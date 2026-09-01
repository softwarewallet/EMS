import {
  Student,
  StudentLifecycleStatus,
  StudentStatusChangeHistory,
  StudentDocumentRef,
  StudentEnrollment,
  StudentDuplicateCandidate,
  StudentAttendanceRecord,
  ReportCard,
  MarkEntry,
  AuditRecord
} from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { SYSTEM_ROLES } from '../config/permissions';

const STUDENTS_COL = 'students';
const ENROLLMENTS_COL = 'enrollments';

export interface StudentSearchParams {
  tenantId: string;
  campusId?: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  status?: StudentLifecycleStatus | string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export class StudentService {
  private static userCache = new Map<string, any>();

  static async getActiveUser(): Promise<any | null> {
    const savedUserId = localStorage.getItem('edutech_active_user_id');
    if (!savedUserId) return null;
    if (this.userCache.has(savedUserId)) {
      return this.userCache.get(savedUserId);
    }
    const user = await FirebaseService.getDocument<any>('users', savedUserId);
    if (user) {
      this.userCache.set(savedUserId, user);
    }
    return user;
  }

  static getUserPermissions(user: any, tenantId: string): string[] {
    if (!user) return [];
    if (user.isPlatformSuperAdmin) {
      return ['platform.admin', 'student.sensitive.view', 'student.medical.view', 'student.identity.view', 'student.view', 'student.export'];
    }
    const effectiveRoles = user.roleAssignments?.filter((ra: any) => ra.tenantId === tenantId || ra.tenantId === 'ALL') || [];
    if (effectiveRoles.some((r: any) => r.roleCode === 'super_admin')) {
      return ['platform.admin', 'student.sensitive.view', 'student.medical.view', 'student.identity.view', 'student.view', 'student.export'];
    }
    
    const permissionSet = new Set<string>();
    for (const assignment of effectiveRoles) {
      const roleDef = SYSTEM_ROLES.find(r => r.code === assignment.roleCode);
      if (roleDef) {
        roleDef.permissions.forEach(p => permissionSet.add(p));
      }
    }
    return Array.from(permissionSet);
  }

  static sanitizeStudent(student: Student, tenantId: string, user?: any): Student {
    // Strict Tenant Isolation check
    if (tenantId !== 'ALL' && student.tenantId !== tenantId) {
      throw new Error(`Tenant Isolation Violation: Access denied to student record.`);
    }

    if (!user) {
      const sanitized = { ...student };
      delete sanitized.medicalNotes;
      delete sanitized.specialNeeds;
      delete sanitized.nationalId;
      return sanitized;
    }

    const permissions = this.getUserPermissions(user, tenantId);
    const isPlatformAdmin = user.isPlatformSuperAdmin || user.roleAssignments?.some((ra: any) => ra.roleCode === 'super_admin' && (ra.tenantId === tenantId || ra.tenantId === 'ALL'));
    
    let isSelfOrWard = false;
    const isStudentRole = user.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT' && ra.tenantId === student.tenantId);
    if (isStudentRole) {
      if (user.metadata?.studentId === student.id || user.email?.toLowerCase() === student.email?.toLowerCase()) {
        isSelfOrWard = true;
      }
    }
    
    const isParentRole = user.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN' && ra.tenantId === student.tenantId);
    if (isParentRole) {
      const isLinkedByMetadata = user.metadata?.studentId === student.id;
      const isLinkedByGuardianList = student.guardians?.some((g: any) => 
        g.email?.toLowerCase() === user.email?.toLowerCase() || 
        (user.phoneNumber && g.phone === user.phoneNumber)
      );
      if (isLinkedByMetadata || isLinkedByGuardianList) {
        isSelfOrWard = true;
      }
    }

    const hasMedical = isPlatformAdmin || isSelfOrWard || permissions.includes('student.medical.view') || permissions.includes('student.sensitive.view');
    const hasIdentity = isPlatformAdmin || isSelfOrWard || permissions.includes('student.identity.view') || permissions.includes('student.sensitive.view');

    const sanitized = { ...student };
    if (!hasMedical) {
      delete sanitized.medicalNotes;
      delete sanitized.specialNeeds;
    }
    if (!hasIdentity) {
      delete sanitized.nationalId;
    }

    return sanitized;
  }

  /**
   * Get all students for a tenant
   */
  static async getStudents(tenantId: string, requestingUser?: any): Promise<Student[]> {
    const rawStudents = await FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId);
    const resolvedUser = requestingUser !== undefined ? requestingUser : (await this.getActiveUser());
    return rawStudents.map(s => {
      try {
        return this.sanitizeStudent(s, tenantId, resolvedUser);
      } catch (e) {
        return null;
      }
    }).filter(Boolean) as Student[];
  }

  /**
   * Get single student by primary key ID
   */
  static async getStudentById(id: string, requestingUser?: any): Promise<Student | null> {
    const student = await FirebaseService.getDocument<Student>(STUDENTS_COL, id);
    if (!student) return null;
    const resolvedUser = requestingUser !== undefined ? requestingUser : (await this.getActiveUser());
    
    // Strict tenant boundary if resolved user has a tenant
    const userTenantId = resolvedUser?.roleAssignments?.[0]?.tenantId || student.tenantId;
    const sanitized = this.sanitizeStudent(student, userTenantId, resolvedUser);

    // Audit log access if restricted data is present and authorized
    if (resolvedUser && resolvedUser.id) {
      const accessedTypes: string[] = [];
      const permissions = this.getUserPermissions(resolvedUser, student.tenantId);
      const isPlatformAdmin = resolvedUser.isPlatformSuperAdmin || resolvedUser.roleAssignments?.some((ra: any) => ra.roleCode === 'super_admin');
      
      let isSelfOrWard = false;
      if (resolvedUser.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT')) {
        if (resolvedUser.metadata?.studentId === student.id || resolvedUser.email?.toLowerCase() === student.email?.toLowerCase()) {
          isSelfOrWard = true;
        }
      }
      if (resolvedUser.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN')) {
        if (resolvedUser.metadata?.studentId === student.id || student.guardians?.some((g: any) => g.email?.toLowerCase() === resolvedUser.email?.toLowerCase())) {
          isSelfOrWard = true;
        }
      }

      const hasMedical = isPlatformAdmin || isSelfOrWard || permissions.includes('student.medical.view') || permissions.includes('student.sensitive.view');
      const hasIdentity = isPlatformAdmin || isSelfOrWard || permissions.includes('student.identity.view') || permissions.includes('student.sensitive.view');

      if (hasMedical && (student.medicalNotes || student.specialNeeds)) {
        accessedTypes.push('MEDICAL_INFO');
      }
      if (hasIdentity && student.nationalId) {
        accessedTypes.push('NATIONAL_IDENTITY_INFO');
      }

      if (accessedTypes.length > 0) {
        AuditService.log({
          tenantId: student.tenantId,
          userId: resolvedUser.id,
          userEmail: resolvedUser.email,
          userDisplayName: resolvedUser.displayName,
          action: 'RESTRICTED_DATA_ACCESSED',
          resource: 'student',
          resourceId: student.id,
          resourceName: `${student.firstName} ${student.lastName}`,
          result: 'SUCCESS',
          notes: `Accessed restricted information types: ${accessedTypes.join(', ')}`
        }).catch(err => console.error('Failed to log restricted access audit:', err));
      }
    }

    return sanitized;
  }

  /**
   * Server-side search, filtering, and pagination for students
   */
  static async searchStudents(params: StudentSearchParams, requestingUser?: any): Promise<{
    students: Student[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const resolvedUser = requestingUser !== undefined ? requestingUser : (await this.getActiveUser());
    const all = await this.getStudents(params.tenantId, resolvedUser);
    let filtered = all;

    if (params.campusId && params.campusId !== 'ALL') {
      filtered = filtered.filter(s => s.campusId === params.campusId);
    }

    if (params.classId && params.classId !== 'ALL') {
      filtered = filtered.filter(s => s.currentClassId === params.classId);
    }

    if (params.sectionId && params.sectionId !== 'ALL') {
      filtered = filtered.filter(s => s.currentSectionId === params.sectionId);
    }

    if (params.academicYearId && params.academicYearId !== 'ALL') {
      filtered = filtered.filter(
        s => s.currentAcademicYearId === params.academicYearId || s.academicYearId === params.academicYearId
      );
    }

    if (params.status && params.status !== 'ALL') {
      const targetStatus = params.status.toUpperCase();
      filtered = filtered.filter(s => {
        const sStatus = s.status ? s.status.toUpperCase() : 'ACTIVE';
        if (targetStatus === 'ACTIVE') return sStatus === 'ACTIVE' || sStatus === 'ENROLLED';
        return sStatus === targetStatus;
      });
    }

    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => {
        const fullName = `${s.firstName} ${s.middleName || ''} ${s.lastName}`.toLowerCase();
        const idNum = (s.studentIdNumber || '').toLowerCase();
        const email = (s.email || '').toLowerCase();
        const phone = (s.phone || '').toLowerCase();
        const guardianName = s.guardians?.[0]?.name ? s.guardians[0].name.toLowerCase() : '';
        const guardianPhone = s.guardians?.[0]?.phone ? s.guardians[0].phone.toLowerCase() : '';

        return (
          fullName.includes(q) ||
          idNum.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          guardianName.includes(q) ||
          guardianPhone.includes(q)
        );
      });
    }

    const total = filtered.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 50;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      students: paginated,
      total,
      page,
      pageSize
    };
  }

  /**
   * Generate a permanent student admission number (e.g., STU-2027-000015)
   */
  static async generateAdmissionNumber(tenantId: string): Promise<string> {
    const students = await this.getStudents(tenantId);
    const year = new Date().getFullYear();
    const seq = (students.length + 1).toString().padStart(6, '0');
    return `STU-${year}-${seq}`;
  }

  /**
   * Duplicate detection check before creating a new student
   */
  static async detectDuplicateStudents(
    tenantId: string,
    candidate: Partial<Student>
  ): Promise<StudentDuplicateCandidate[]> {
    const existing = await this.getStudents(tenantId);
    const candidates: StudentDuplicateCandidate[] = [];

    const candFirstName = (candidate.firstName || '').toLowerCase().trim();
    const candLastName = (candidate.lastName || '').toLowerCase().trim();
    const candDob = candidate.dateOfBirth;
    const candAdmissionNo = (candidate.studentIdNumber || '').toUpperCase().trim();
    const candPrimaryGuardianPhone = candidate.guardians?.[0]?.phone;

    for (const st of existing) {
      const reasons: string[] = [];
      let score = 0;

      // Match 1: Exact Admission Number
      if (candAdmissionNo && st.studentIdNumber && st.studentIdNumber.toUpperCase().trim() === candAdmissionNo) {
        score += 100;
        reasons.push(`Exact Admission Number Match: ${st.studentIdNumber}`);
      }

      // Match 2: Same Name & Same DOB
      const stFirstName = st.firstName.toLowerCase().trim();
      const stLastName = st.lastName.toLowerCase().trim();
      if (candFirstName === stFirstName && candLastName === stLastName) {
        score += 50;
        reasons.push('Exact First & Last Name Match');
        if (candDob && st.dateOfBirth === candDob) {
          score += 40;
          reasons.push(`Exact Date of Birth Match (${candDob})`);
        }
      }

      // Match 3: Guardian Phone Number
      if (candPrimaryGuardianPhone && st.guardians?.some(g => g.phone && g.phone === candPrimaryGuardianPhone)) {
        score += 30;
        reasons.push(`Primary Guardian Phone Number Match (${candPrimaryGuardianPhone})`);
      }

      if (score >= 40) {
        candidates.push({
          student: st,
          confidenceScore: Math.min(score, 100),
          matchReasons: reasons
        });
      }
    }

    return candidates.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  /**
   * Enroll a new student and write initial enrollment record
   */
  static async enrollStudent(
    studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<Student> {
    const id = FirebaseService.generateId('stu');
    const now = new Date().toISOString();

    const admissionNo = studentData.studentIdNumber || (await this.generateAdmissionNumber(studentData.tenantId));

    const initialStatus: StudentLifecycleStatus = (studentData.status as StudentLifecycleStatus) || 'ACTIVE';

    const initialStatusHistory: StudentStatusChangeHistory[] = [
      {
        id: `sh_${Date.now()}`,
        previousStatus: 'ACTIVE',
        newStatus: initialStatus,
        changedBy: performedBy,
        changedAt: now,
        reason: 'Initial Student Registration & Admission',
        remarks: `Enrolled in Class ${studentData.currentClassId}`
      }
    ];

    const student: Student = {
      ...studentData,
      id,
      studentIdNumber: admissionNo,
      status: initialStatus,
      statusHistory: initialStatusHistory,
      documents: studentData.documents || [],
      createdAt: now,
      updatedAt: now,
      createdBy: performedBy.userId,
      updatedBy: performedBy.userId
    };

    // 1. Write authoritative student document
    await FirebaseService.setDocument(STUDENTS_COL, id, student);

    // 2. Write authoritative enrollment record into enrollments collection
    const enrollmentId = FirebaseService.generateId('enr');
    const enrollmentRecord: StudentEnrollment = {
      id: enrollmentId,
      studentId: id,
      tenantId: student.tenantId,
      academicYearId: student.currentAcademicYearId || 'ay_current',
      classId: student.currentClassId,
      sectionId: student.currentSectionId,
      rollNumber: student.rollNumber,
      enrollmentDate: student.enrollmentDate || now.split('T')[0],
      status: 'ACTIVE'
    };
    await FirebaseService.setDocument(ENROLLMENTS_COL, enrollmentId, enrollmentRecord);

    // 3. Log Audit Records
    await AuditService.log({
      tenantId: student.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_CREATED',
      resource: 'student',
      resourceId: id,
      resourceName: `${student.firstName} ${student.lastName} (${student.studentIdNumber})`,
      newValue: student,
      result: 'SUCCESS',
      notes: `Authoritative student created with Admission No: ${student.studentIdNumber}`
    });

    await AuditService.log({
      tenantId: student.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_ENROLLED',
      resource: 'student',
      resourceId: id,
      resourceName: `${student.firstName} ${student.lastName}`,
      newValue: enrollmentRecord,
      result: 'SUCCESS',
      notes: `Enrolled in class ${student.currentClassId}, section ${student.currentSectionId}`
    });

    return student;
  }

  /**
   * Update student master profile
   */
  static async updateStudent(
    id: string,
    data: Partial<Student>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const prev = await this.getStudentById(id);
    if (!prev) throw new Error('Student record not found.');

    const now = new Date().toISOString();
    const updatePayload = {
      ...data,
      updatedAt: now,
      updatedBy: performedBy.userId
    };

    await FirebaseService.updateDocument(STUDENTS_COL, id, updatePayload);

    await AuditService.log({
      tenantId: prev.tenantId || 'ALL',
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_UPDATED',
      resource: 'student',
      resourceId: id,
      resourceName: `${prev.firstName} ${prev.lastName} (${prev.studentIdNumber})`,
      previousValue: prev,
      newValue: updatePayload,
      result: 'SUCCESS'
    });
  }

  /**
   * Controlled Student Status Lifecycle Engine
   */
  static async changeStudentStatus(
    id: string,
    newStatus: StudentLifecycleStatus,
    reason: string,
    remarks?: string,
    destinationInstitution?: string,
    performedBy?: { userId: string; email: string; name: string }
  ): Promise<void> {
    const prev = await this.getStudentById(id);
    if (!prev) throw new Error('Student record not found.');

    const actor = performedBy || { userId: 'usr_system', email: 'system@ems.internal', name: 'System Administrator' };
    const prevStatusNormalized = (prev.status ? prev.status.toUpperCase() : 'ACTIVE') as StudentLifecycleStatus;
    const targetStatusNormalized = newStatus.toUpperCase() as StudentLifecycleStatus;

    if (prevStatusNormalized === targetStatusNormalized) {
      return; // No status change required
    }

    const now = new Date().toISOString();
    const historyItem: StudentStatusChangeHistory = {
      id: `sh_${Date.now()}`,
      previousStatus: prevStatusNormalized,
      newStatus: targetStatusNormalized,
      changedBy: actor,
      changedAt: now,
      reason,
      remarks,
      destinationInstitution
    };

    const currentHistory = prev.statusHistory || [];
    const updatedHistory = [historyItem, ...currentHistory];

    await FirebaseService.updateDocument(STUDENTS_COL, id, {
      status: targetStatusNormalized,
      statusHistory: updatedHistory,
      updatedAt: now,
      updatedBy: actor.userId
    });

    // Map audit action based on transition type
    let auditAction: any = 'STUDENT_STATUS_CHANGED';
    if (targetStatusNormalized === 'TRANSFERRED') auditAction = 'STUDENT_TRANSFERRED';
    else if (targetStatusNormalized === 'WITHDRAWN') auditAction = 'STUDENT_WITHDRAWN';
    else if (targetStatusNormalized === 'GRADUATED' || targetStatusNormalized === 'ALUMNI') auditAction = 'STUDENT_GRADUATED';

    await AuditService.log({
      tenantId: prev.tenantId || 'ALL',
      userId: actor.userId,
      userEmail: actor.email,
      userDisplayName: actor.name,
      action: auditAction,
      resource: 'student',
      resourceId: id,
      resourceName: `${prev.firstName} ${prev.lastName} (${prev.studentIdNumber})`,
      previousValue: { status: prev.status },
      newValue: { status: targetStatusNormalized, reason, destinationInstitution },
      result: 'SUCCESS',
      notes: `Status transitioned from ${prev.status} to ${targetStatusNormalized}. Reason: ${reason}`
    });
  }

  /**
   * Get all historical and current enrollments for a student
   */
  static async getStudentEnrollments(studentId: string, tenantId: string): Promise<StudentEnrollment[]> {
    const allTenantEnrollments = await FirebaseService.getTenantCollection<StudentEnrollment>(ENROLLMENTS_COL, tenantId);
    return allTenantEnrollments.filter(e => e.studentId === studentId);
  }

  /**
   * Upload or add a document reference to student profile
   */
  static async addStudentDocument(
    studentId: string,
    doc: Omit<StudentDocumentRef, 'id' | 'uploadedAt'>,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const student = await this.getStudentById(studentId);
    if (!student) throw new Error('Student record not found.');

    const newDoc: StudentDocumentRef = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };

    const existingDocs = student.documents || [];
    const updatedDocs = [...existingDocs, newDoc];

    await FirebaseService.updateDocument(STUDENTS_COL, studentId, {
      documents: updatedDocs,
      updatedAt: new Date().toISOString(),
      updatedBy: performedBy.userId
    });

    await AuditService.log({
      tenantId: student.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_DOCUMENT_ADDED',
      resource: 'student',
      resourceId: studentId,
      resourceName: `${student.firstName} ${student.lastName}`,
      newValue: newDoc,
      result: 'SUCCESS',
      notes: `Attached document: ${doc.title}`
    });
  }

  /**
   * Update student profile photograph
   */
  static async updateStudentPhoto(
    studentId: string,
    photoUrl: string,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<void> {
    const student = await this.getStudentById(studentId);
    if (!student) throw new Error('Student record not found.');

    await FirebaseService.updateDocument(STUDENTS_COL, studentId, {
      photoUrl,
      updatedAt: new Date().toISOString(),
      updatedBy: performedBy.userId
    });

    await AuditService.log({
      tenantId: student.tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'STUDENT_PHOTO_UPDATED',
      resource: 'student',
      resourceId: studentId,
      resourceName: `${student.firstName} ${student.lastName}`,
      newValue: { photoUrl },
      result: 'SUCCESS'
    });
  }

  /**
   * Student 360° Profile Aggregator
   */
  static async getStudent360Data(studentId: string, tenantId: string, requestingUser?: any): Promise<{
    student: Student | null;
    enrollments: StudentEnrollment[];
    attendanceHistory: StudentAttendanceRecord[];
    reportCards: ReportCard[];
    marks: MarkEntry[];
    auditLogs: AuditRecord[];
  }> {
    const resolvedUser = requestingUser !== undefined ? requestingUser : (await this.getActiveUser());
    const [
      student,
      enrollments,
      attendanceAll,
      reportCardsAll,
      marksAll,
      auditLogsAll
    ] = await Promise.all([
      this.getStudentById(studentId, resolvedUser),
      this.getStudentEnrollments(studentId, tenantId),
      FirebaseService.getTenantCollection<StudentAttendanceRecord>('student_attendance', tenantId),
      FirebaseService.getTenantCollection<ReportCard>('report_cards', tenantId),
      FirebaseService.getTenantCollection<MarkEntry>('mark_entries', tenantId),
      AuditService.getLogs(tenantId)
    ]);

    const attendanceHistory = attendanceAll.filter(a => a.studentId === studentId);
    const reportCards = reportCardsAll.filter(rc => rc.studentId === studentId);
    const marks = marksAll.filter(m => m.studentId === studentId);
    const auditLogs = auditLogsAll.filter(a => a.resourceId === studentId || (a.notes && a.notes.includes(studentId)));

    return {
      student,
      enrollments,
      attendanceHistory,
      reportCards,
      marks,
      auditLogs
    };
  }
}
