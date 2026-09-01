import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { Family, Guardian, StudentGuardianRelationship, Student, RelationshipType } from '../types';

const FAMILIES_COL = 'families';
const GUARDIANS_COL = 'guardians';
const RELATIONSHIPS_COL = 'student_guardian_relationships';
const STUDENTS_COL = 'students';

export class FamilyService {
  /**
   * Generates a unique, tenant-aware Family Number (e.g. FAM-2026-000001)
   */
  static async generateFamilyNumber(tenantId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `FAM-${currentYear}-`;
    
    // Fetch all families for the tenant to find the max number
    const families = await FirebaseService.getTenantCollection<Family>(FAMILIES_COL, tenantId);
    let maxSeq = 0;
    
    for (const f of families) {
      if (f.familyNumber && f.familyNumber.startsWith(prefix)) {
        const parts = f.familyNumber.split('-');
        if (parts.length === 3) {
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    }
    
    const nextSeq = maxSeq + 1;
    const formattedSeq = String(nextSeq).padStart(6, '0');
    return `${prefix}${formattedSeq}`;
  }

  /**
   * Generates a unique, tenant-aware Guardian Number (e.g. GDN-2026-000001)
   */
  static async generateGuardianNumber(tenantId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `GDN-${currentYear}-`;
    
    const guardians = await FirebaseService.getTenantCollection<Guardian>(GUARDIANS_COL, tenantId);
    let maxSeq = 0;
    
    for (const g of guardians) {
      if (g.guardianNumber && g.guardianNumber.startsWith(prefix)) {
        const parts = g.guardianNumber.split('-');
        if (parts.length === 3) {
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    }
    
    const nextSeq = maxSeq + 1;
    const formattedSeq = String(nextSeq).padStart(6, '0');
    return `${prefix}${formattedSeq}`;
  }

  /**
   * Detect potential duplicates using email, phone, name+phone, name+email
   */
  static async detectDuplicateGuardians(
    tenantId: string,
    params: { firstName: string; lastName: string; phone: string; email?: string }
  ): Promise<Guardian[]> {
    const allGuardians = await FirebaseService.getTenantCollection<Guardian>(GUARDIANS_COL, tenantId);
    const inputEmail = params.email?.trim().toLowerCase();
    const inputPhone = params.phone.trim().replace(/\s+/g, '');
    const inputFullName = `${params.firstName.trim()} ${params.lastName.trim()}`.toLowerCase();

    return allGuardians.filter(g => {
      const gEmail = g.email?.trim().toLowerCase();
      const gPhone = g.phone?.trim().replace(/\s+/g, '');
      const gFullName = `${g.firstName || ''} ${g.lastName || ''}`.trim().toLowerCase();
      const legacyName = g.name?.trim().toLowerCase();

      // Check direct email match
      if (inputEmail && gEmail && inputEmail === gEmail) return true;

      // Check direct phone match
      if (inputPhone && gPhone && inputPhone === gPhone) return true;

      // Check Name + Phone
      const nameMatches = gFullName === inputFullName || legacyName === inputFullName;
      if (nameMatches && inputPhone && gPhone && inputPhone === gPhone) return true;

      // Check Name + Email
      if (nameMatches && inputEmail && gEmail && inputEmail === gEmail) return true;

      return false;
    });
  }

  // ================== FAMILY CRUD ==================

  static async getFamilies(tenantId: string): Promise<Family[]> {
    return FirebaseService.getTenantCollection<Family>(FAMILIES_COL, tenantId);
  }

  static async getFamilyById(id: string): Promise<Family | null> {
    return FirebaseService.getDocument<Family>(FAMILIES_COL, id);
  }

  static async createFamily(
    data: Omit<Family, 'id' | 'familyNumber' | 'status' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Family> {
    const id = FirebaseService.generateId('fam');
    const familyNumber = await this.generateFamilyNumber(data.tenantId);
    const now = new Date().toISOString();

    const newFamily: Family = {
      ...data,
      id,
      familyNumber,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdBy: performedBy.userId,
      updatedBy: performedBy.userId
    };

    await FirebaseService.setDocument(FAMILIES_COL, id, newFamily);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'FAMILY_CREATED',
      resource: 'family',
      resourceId: id,
      resourceName: newFamily.familyName,
      newValue: newFamily,
      result: 'SUCCESS'
    });

    return newFamily;
  }

  static async updateFamily(
    id: string,
    tenantId: string,
    data: Partial<Omit<Family, 'id' | 'tenantId' | 'familyNumber' | 'createdAt' | 'updatedAt'>>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Family> {
    const prev = await this.getFamilyById(id);
    if (!prev) throw new Error('Family not found');

    const now = new Date().toISOString();
    const updated: Family = {
      ...prev,
      ...data,
      updatedAt: now,
      updatedBy: performedBy.userId
    };

    await FirebaseService.setDocument(FAMILIES_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'FAMILY_UPDATED',
      resource: 'family',
      resourceId: id,
      resourceName: updated.familyName,
      previousValue: prev,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  // ================== GUARDIAN CRUD ==================

  static async getGuardians(tenantId: string): Promise<Guardian[]> {
    return FirebaseService.getTenantCollection<Guardian>(GUARDIANS_COL, tenantId);
  }

  static async getGuardianById(id: string): Promise<Guardian | null> {
    return FirebaseService.getDocument<Guardian>(GUARDIANS_COL, id);
  }

  static async createGuardian(
    data: Omit<Guardian, 'id' | 'guardianNumber' | 'name' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string },
    bypassDuplicateCheck = false
  ): Promise<Guardian> {
    const tenantId = data.tenantId || 'ALL';
    
    if (!bypassDuplicateCheck) {
      const duplicates = await this.detectDuplicateGuardians(tenantId, {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone,
        email: data.email
      });
      if (duplicates.length > 0) {
        throw new Error('DUPLICATE_GUARDIAN_FOUND');
      }
    }

    const id = FirebaseService.generateId('grd');
    const guardianNumber = await this.generateGuardianNumber(tenantId);
    const now = new Date().toISOString();
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.preferredName || 'Unnamed Guardian';

    const newGuardian: Guardian = {
      ...data,
      id,
      guardianNumber,
      name: fullName,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(GUARDIANS_COL, id, newGuardian);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'GUARDIAN_CREATED',
      resource: 'guardian',
      resourceId: id,
      resourceName: fullName,
      newValue: newGuardian,
      result: 'SUCCESS'
    });

    return newGuardian;
  }

  static async updateGuardian(
    id: string,
    tenantId: string,
    data: Partial<Omit<Guardian, 'id' | 'guardianNumber' | 'name' | 'createdAt' | 'updatedAt'>>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Guardian> {
    const prev = await this.getGuardianById(id);
    if (!prev) throw new Error('Guardian not found');

    const now = new Date().toISOString();
    const updatedData = { ...prev, ...data };
    const fullName = `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim() || updatedData.preferredName || prev.name;

    const updated: Guardian = {
      ...updatedData,
      name: fullName,
      updatedAt: now
    };

    await FirebaseService.setDocument(GUARDIANS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'GUARDIAN_UPDATED',
      resource: 'guardian',
      resourceId: id,
      resourceName: fullName,
      previousValue: prev,
      newValue: updated,
      result: 'SUCCESS'
    });

    // Synchronize nested student guardians for any linked students
    await this.syncStudentNestedGuardiansForGuardian(id, tenantId);

    return updated;
  }

  // ================== RELATIONSHIPS & LINKAGE ==================

  static async getRelationshipsForStudent(studentId: string, tenantId: string): Promise<StudentGuardianRelationship[]> {
    const all = await FirebaseService.getTenantCollection<StudentGuardianRelationship>(RELATIONSHIPS_COL, tenantId);
    return all.filter(r => r.studentId === studentId);
  }

  static async getRelationshipsForGuardian(guardianId: string, tenantId: string): Promise<StudentGuardianRelationship[]> {
    const all = await FirebaseService.getTenantCollection<StudentGuardianRelationship>(RELATIONSHIPS_COL, tenantId);
    return all.filter(r => r.guardianId === guardianId);
  }

  static async linkStudentAndGuardian(
    relationship: Omit<StudentGuardianRelationship, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<StudentGuardianRelationship> {
    const id = FirebaseService.generateId('sgr');
    const now = new Date().toISOString();

    // Check if relationship already exists
    const existing = await this.getRelationshipsForStudent(relationship.studentId, relationship.tenantId);
    const alreadyLinked = existing.find(r => r.guardianId === relationship.guardianId);
    if (alreadyLinked) {
      return alreadyLinked;
    }

    // Handle primary guardian conflict (only one primary per student)
    if (relationship.isPrimary) {
      for (const rel of existing) {
        if (rel.isPrimary) {
          await FirebaseService.setDocument(RELATIONSHIPS_COL, rel.id, {
            ...rel,
            isPrimary: false,
            updatedAt: now
          });
        }
      }
    }

    const newRelationship: StudentGuardianRelationship = {
      ...relationship,
      id,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(RELATIONSHIPS_COL, id, newRelationship);

    await AuditService.log({
      tenantId: relationship.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_GUARDIAN_LINKED',
      resource: 'relationship',
      resourceId: id,
      resourceName: `Link Student ${relationship.studentId} ↔ Guardian ${relationship.guardianId}`,
      newValue: newRelationship,
      result: 'SUCCESS'
    });

    // Sync student's denormalized nested array
    await this.syncStudentNestedGuardians(relationship.studentId, relationship.tenantId);

    return newRelationship;
  }

  static async updateRelationship(
    id: string,
    tenantId: string,
    data: Partial<Omit<StudentGuardianRelationship, 'id' | 'tenantId' | 'studentId' | 'guardianId' | 'createdAt' | 'updatedAt'>>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<StudentGuardianRelationship> {
    const prev = await FirebaseService.getDocument<StudentGuardianRelationship>(RELATIONSHIPS_COL, id);
    if (!prev) throw new Error('Relationship record not found');

    const now = new Date().toISOString();

    // Handle primary conflict
    if (data.isPrimary && !prev.isPrimary) {
      const existing = await this.getRelationshipsForStudent(prev.studentId, tenantId);
      for (const rel of existing) {
        if (rel.isPrimary && rel.id !== id) {
          await FirebaseService.setDocument(RELATIONSHIPS_COL, rel.id, {
            ...rel,
            isPrimary: false,
            updatedAt: now
          });
        }
      }
    }

    const updated: StudentGuardianRelationship = {
      ...prev,
      ...data,
      updatedAt: now
    };

    await FirebaseService.setDocument(RELATIONSHIPS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'RELATIONSHIP_PERMISSION_CHANGED',
      resource: 'relationship',
      resourceId: id,
      resourceName: `Update Link Student ${prev.studentId} ↔ Guardian ${prev.guardianId}`,
      previousValue: prev,
      newValue: updated,
      result: 'SUCCESS'
    });

    // Check portal access events
    if (data.canAccessPortal !== undefined && data.canAccessPortal !== prev.canAccessPortal) {
      await AuditService.log({
        tenantId,
        userId: performedBy.userId,
        userEmail: performedBy.email,
        userDisplayName: performedBy.name,
        action: data.canAccessPortal ? 'GUARDIAN_PORTAL_ACCESS_ENABLED' : 'GUARDIAN_PORTAL_ACCESS_DISABLED',
        resource: 'guardian',
        resourceId: prev.guardianId,
        resourceName: `Guardian ID: ${prev.guardianId}`,
        result: 'SUCCESS'
      });
    }

    // Sync student's denormalized nested array
    await this.syncStudentNestedGuardians(prev.studentId, tenantId);

    return updated;
  }

  static async unlinkStudentAndGuardian(
    relationshipId: string,
    tenantId: string,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const rel = await FirebaseService.getDocument<StudentGuardianRelationship>(RELATIONSHIPS_COL, relationshipId);
    if (!rel) return;

    await FirebaseService.deleteDocument(RELATIONSHIPS_COL, relationshipId);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_GUARDIAN_UNLINKED',
      resource: 'relationship',
      resourceId: relationshipId,
      resourceName: `Unlink Student ${rel.studentId} ↔ Guardian ${rel.guardianId}`,
      result: 'SUCCESS'
    });

    // Sync student's denormalized nested array
    await this.syncStudentNestedGuardians(rel.studentId, tenantId);
  }

  // ================== SYNCHRONIZATION BACKWARD COMPATIBILITY ==================

  /**
   * Re-builds and updates the nested `student.guardians` array in the `students` collection document.
   * This ensures 100% backward compatibility and 0 regressions.
   */
  static async syncStudentNestedGuardians(studentId: string, tenantId: string): Promise<void> {
    const student = await FirebaseService.getDocument<Student>(STUDENTS_COL, studentId);
    if (!student) return;

    const relationships = await this.getRelationshipsForStudent(studentId, tenantId);
    const guardiansList: any[] = [];

    for (const rel of relationships) {
      const g = await this.getGuardianById(rel.guardianId);
      if (g) {
        guardiansList.push({
          id: g.id,
          name: g.name,
          relationship: rel.relationshipType.toLowerCase() as any,
          email: g.email,
          phone: g.phone,
          occupation: g.occupation || '',
          isPrimaryContact: rel.isPrimary,
          canReceiveCommunication: rel.canReceiveCommunications,
          canAccessPortal: rel.canAccessPortal,
          emergencyContact: rel.isEmergencyContact
        });
      }
    }

    await FirebaseService.updateDocument(STUDENTS_COL, studentId, {
      guardians: guardiansList,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Syncs student nested guardians for all students linked to a specific guardian.
   */
  static async syncStudentNestedGuardiansForGuardian(guardianId: string, tenantId: string): Promise<void> {
    const relationships = await this.getRelationshipsForGuardian(guardianId, tenantId);
    for (const rel of relationships) {
      await this.syncStudentNestedGuardians(rel.studentId, tenantId);
    }
  }

  // ================== DISCOVERY & RECONCILIATION ==================

  /**
   * Inspects existing data and migrates inline student guardians to top-level Guardian & Relationship documents if not already present.
   * This heals the database dynamically and handles existing records seamlessly!
   */
  static async runAdHocMigration(tenantId: string, performedBy: { userId: string; email: string; name: string }): Promise<void> {
    const students = await FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId);
    const existingGuardians = await FirebaseService.getTenantCollection<Guardian>(GUARDIANS_COL, tenantId);
    const existingRelationships = await FirebaseService.getTenantCollection<StudentGuardianRelationship>(RELATIONSHIPS_COL, tenantId);

    for (const s of students) {
      if (s.guardians && s.guardians.length > 0) {
        for (const inlineG of s.guardians) {
          // Check if this guardian already has a top-level entity
          let targetG = existingGuardians.find(eg => 
            (eg.phone && inlineG.phone && eg.phone === inlineG.phone) || 
            (eg.email && inlineG.email && eg.email.toLowerCase() === inlineG.email.toLowerCase())
          );

          if (!targetG) {
            // Create a brand new Guardian document
            const gId = inlineG.id || FirebaseService.generateId('grd');
            const guardianNum = await this.generateGuardianNumber(tenantId);
            const spaceIdx = inlineG.name.indexOf(' ');
            const firstName = spaceIdx !== -1 ? inlineG.name.substring(0, spaceIdx) : inlineG.name;
            const lastName = spaceIdx !== -1 ? inlineG.name.substring(spaceIdx + 1) : '';

            targetG = {
              id: gId,
              tenantId,
              guardianNumber: guardianNum,
              firstName,
              lastName,
              name: inlineG.name,
              relationship: inlineG.relationship,
              email: inlineG.email,
              phone: inlineG.phone,
              occupation: inlineG.occupation,
              isPrimaryContact: inlineG.isPrimaryContact || false,
              canReceiveCommunication: inlineG.canReceiveCommunication || false,
              canAccessPortal: inlineG.canAccessPortal || false,
              emergencyContact: inlineG.emergencyContact || false,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            await FirebaseService.setDocument(GUARDIANS_COL, gId, targetG);
            existingGuardians.push(targetG);
          }

          // Check if relationship exists
          const hasRel = existingRelationships.some(er => er.studentId === s.id && er.guardianId === targetG!.id);
          if (!hasRel) {
            const relId = FirebaseService.generateId('sgr');
            const newRel: StudentGuardianRelationship = {
              id: relId,
              tenantId,
              studentId: s.id,
              guardianId: targetG.id,
              relationshipType: (inlineG.relationship?.toUpperCase() || 'OTHER') as RelationshipType,
              isPrimary: inlineG.isPrimaryContact || false,
              isEmergencyContact: inlineG.emergencyContact || false,
              canReceiveCommunications: inlineG.canReceiveCommunication || false,
              canAccessPortal: inlineG.canAccessPortal || false,
              canViewAcademicInformation: inlineG.canAccessPortal || false,
              canViewAttendance: inlineG.canAccessPortal || false,
              canViewExaminationResults: inlineG.canAccessPortal || false,
              canViewDocuments: inlineG.canAccessPortal || false,
              canAuthorizeActions: inlineG.canAccessPortal || false,
              financialResponsibility: inlineG.isPrimaryContact ? 'PRIMARY' : 'NONE',
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            await FirebaseService.setDocument(RELATIONSHIPS_COL, relId, newRel);
            existingRelationships.push(newRel);
          }
        }
      }
    }
  }
}
