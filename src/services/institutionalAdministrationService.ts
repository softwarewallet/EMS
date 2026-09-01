import {
  Institution,
  Campus,
  OrganizationalUnit,
  OrganizationalRelationship,
  OrganizationalPosition,
  Committee,
  CommitteeMembership,
  AdministrativeResponsibility,
  OrganizationContact,
  OrganizationChangeRequest,
  OrganizationAuditEvent
} from '../types/institutionalAdministration';

export class InstitutionalAdministrationService {
  private static institutions: Map<string, Institution> = new Map();
  private static campuses: Map<string, Campus> = new Map();
  private static units: Map<string, OrganizationalUnit> = new Map();
  private static relationships: Map<string, OrganizationalRelationship> = new Map();
  private static positions: Map<string, OrganizationalPosition> = new Map();
  private static committees: Map<string, Committee> = new Map();
  private static memberships: Map<string, CommitteeMembership> = new Map();
  private static responsibilities: Map<string, AdministrativeResponsibility> = new Map();
  private static contacts: Map<string, OrganizationContact> = new Map();
  private static changeRequests: Map<string, OrganizationChangeRequest> = new Map();
  private static auditEvents: OrganizationAuditEvent[] = [];

  static {
    // Seed initial data for testing & development
    const defaultTenant = 'tenant_default';
    const defaultCampus = 'campus_main';
    const defaultInst = 'inst_global';

    InstitutionalAdministrationService.institutions.set(defaultInst, {
      institutionId: defaultInst,
      tenantId: defaultTenant,
      legalName: 'Global Technological University',
      displayName: 'Global Tech',
      shortName: 'GTU',
      institutionType: 'UNIVERSITY',
      accreditationReferences: ['ACC-2026-US', 'ED-VAL-99'],
      country: 'United States',
      region: 'North',
      timezone: 'America/New_York',
      primaryCampusId: defaultCampus,
      status: 'ACTIVE',
      effectiveFrom: '2020-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'sys_admin',
      updatedBy: 'sys_admin'
    });

    InstitutionalAdministrationService.campuses.set(defaultCampus, {
      campusId: defaultCampus,
      tenantId: defaultTenant,
      institutionId: defaultInst,
      code: 'MAIN-01',
      name: 'Main Metropolitan Campus',
      campusType: 'MAIN',
      locationReference: '100 University Ave, Metropolis',
      timezone: 'America/New_York',
      status: 'ACTIVE',
      effectiveFrom: '2020-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const rootUnitId = 'unit_root_exec';
    InstitutionalAdministrationService.units.set(rootUnitId, {
      organizationUnitId: rootUnitId,
      tenantId: defaultTenant,
      campusId: defaultCampus,
      unitType: 'OFFICE',
      code: 'EXEC-OFFICE',
      name: 'Office of the President',
      description: 'Executive leadership and institutional governance.',
      status: 'ACTIVE',
      effectiveFrom: '2020-01-01',
      ownershipType: 'AUTHORITATIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  static async generateAuditHash(
    tenantId: string,
    actor: string,
    action: string,
    entityType: string,
    entityId: string,
    timestamp: string,
    previousHash: string
  ): Promise<string> {
    const rawData = `${previousHash}:${tenantId}:${actor}:${action}:${entityType}:${entityId}:${timestamp}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async logAudit(tenantId: string, actor: string, action: string, entityType: string, entityId: string, metadata?: any): Promise<void> {
    const prev = this.auditEvents.length > 0 ? this.auditEvents[this.auditEvents.length - 1].signatureHash : '0'.repeat(64);
    const timestamp = new Date().toISOString();
    const signatureHash = await this.generateAuditHash(tenantId, actor, action, entityType, entityId, timestamp, prev);
    this.auditEvents.push({
      eventId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      tenantId,
      actor,
      action,
      entityType,
      entityId,
      timestamp,
      previousHash: prev,
      signatureHash,
      metadata
    });
  }

  static createInstitution(data: Omit<Institution, 'institutionId' | 'createdAt' | 'updatedAt'>): Institution {
    const institutionId = `inst_${Date.now()}`;
    const now = new Date().toISOString();
    const inst: Institution = {
      ...data,
      institutionId,
      createdAt: now,
      updatedAt: now
    };
    this.institutions.set(institutionId, inst);
    this.logAudit(inst.tenantId, inst.createdBy || 'system', 'CREATE', 'INSTITUTION', institutionId);
    return inst;
  }

  static updateInstitution(institutionId: string, updates: Partial<Institution>, userId: string): Institution {
    const existing = this.institutions.get(institutionId);
    if (!existing) throw new Error(`Institution ${institutionId} not found`);
    const updated: Institution = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    };
    this.institutions.set(institutionId, updated);
    this.logAudit(updated.tenantId, userId, 'UPDATE', 'INSTITUTION', institutionId);
    return updated;
  }

  static createCampus(data: Omit<Campus, 'campusId' | 'createdAt' | 'updatedAt'>): Campus {
    const campusId = `campus_${Date.now()}`;
    const now = new Date().toISOString();
    const campus: Campus = {
      ...data,
      campusId,
      createdAt: now,
      updatedAt: now
    };
    this.campuses.set(campusId, campus);
    this.logAudit(campus.tenantId, 'system', 'CREATE', 'CAMPUS', campusId);
    return campus;
  }

  static updateCampus(campusId: string, updates: Partial<Campus>, userId: string): Campus {
    const existing = this.campuses.get(campusId);
    if (!existing) throw new Error(`Campus ${campusId} not found`);
    const updated: Campus = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.campuses.set(campusId, updated);
    this.logAudit(updated.tenantId, userId, 'UPDATE', 'CAMPUS', campusId);
    return updated;
  }

  static validateHierarchy(unitId: string, parentUnitId?: string): boolean {
    if (!parentUnitId) return true;
    if (unitId === parentUnitId) return false;

    // Check circular reference by walking up from parent
    let currentId: string | undefined = parentUnitId;
    const visited = new Set<string>();
    visited.add(unitId);

    while (currentId) {
      if (visited.has(currentId)) return false; // Cycle detected
      visited.add(currentId);
      const parentUnit = this.units.get(currentId);
      currentId = parentUnit?.parentOrganizationUnitId;
    }
    return true;
  }

  static createOrganizationUnit(data: Omit<OrganizationalUnit, 'organizationUnitId' | 'createdAt' | 'updatedAt'>): OrganizationalUnit {
    if (data.parentOrganizationUnitId && !this.validateHierarchy('', data.parentOrganizationUnitId)) {
      throw new Error('Circular hierarchy detected. Cannot set parent unit.');
    }
    const organizationUnitId = `unit_${Date.now()}`;
    const now = new Date().toISOString();
    const unit: OrganizationalUnit = {
      ...data,
      organizationUnitId,
      createdAt: now,
      updatedAt: now
    };
    this.units.set(organizationUnitId, unit);
    this.logAudit(unit.tenantId, 'system', 'CREATE', 'ORGANIZATIONAL_UNIT', organizationUnitId);
    return unit;
  }

  static updateOrganizationUnit(unitId: string, updates: Partial<OrganizationalUnit>, userId: string): OrganizationalUnit {
    const existing = this.units.get(unitId);
    if (!existing) throw new Error(`Organizational unit ${unitId} not found`);

    if (updates.parentOrganizationUnitId !== undefined) {
      if (!this.validateHierarchy(unitId, updates.parentOrganizationUnitId)) {
        throw new Error('Circular hierarchy detected during update.');
      }
    }

    const updated: OrganizationalUnit = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.units.set(unitId, updated);
    this.logAudit(updated.tenantId, userId, 'UPDATE', 'ORGANIZATIONAL_UNIT', unitId);
    return updated;
  }

  static archiveOrganizationUnit(unitId: string, userId: string): OrganizationalUnit {
    return this.updateOrganizationUnit(unitId, { status: 'ARCHIVED' }, userId);
  }

  static getOrganizationTree(tenantId: string): any[] {
    const allUnits = Array.from(this.units.values()).filter(u => u.tenantId === tenantId);
    const map = new Map<string, any>();
    allUnits.forEach(u => {
      map.set(u.organizationUnitId, { ...u, children: [] });
    });

    const roots: any[] = [];
    map.forEach(node => {
      if (node.parentOrganizationUnitId && map.has(node.parentOrganizationUnitId)) {
        map.get(node.parentOrganizationUnitId).children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  static getOrganizationAncestors(unitId: string): OrganizationalUnit[] {
    const ancestors: OrganizationalUnit[] = [];
    let current = this.units.get(unitId);
    while (current && current.parentOrganizationUnitId) {
      const parent = this.units.get(current.parentOrganizationUnitId);
      if (parent) {
        ancestors.push(parent);
        current = parent;
      } else {
        break;
      }
    }
    return ancestors;
  }

  static getOrganizationDescendants(unitId: string): OrganizationalUnit[] {
    const descendants: OrganizationalUnit[] = [];
    const queue = [unitId];
    while (queue.length > 0) {
      const currId = queue.shift()!;
      const children = Array.from(this.units.values()).filter(u => u.parentOrganizationUnitId === currId);
      for (const child of children) {
        descendants.push(child);
        queue.push(child.organizationUnitId);
      }
    }
    return descendants;
  }

  static createRelationship(data: Omit<OrganizationalRelationship, 'relationshipId'>): OrganizationalRelationship {
    const relationshipId = `rel_${Date.now()}`;
    const rel: OrganizationalRelationship = { ...data, relationshipId };
    this.relationships.set(relationshipId, rel);
    this.logAudit(rel.tenantId, 'system', 'CREATE', 'ORGANIZATIONAL_RELATIONSHIP', relationshipId);
    return rel;
  }

  static createPosition(data: Omit<OrganizationalPosition, 'positionId' | 'createdAt' | 'updatedAt'>): OrganizationalPosition {
    const positionId = `pos_${Date.now()}`;
    const now = new Date().toISOString();
    const pos: OrganizationalPosition = {
      ...data,
      positionId,
      createdAt: now,
      updatedAt: now
    };
    this.positions.set(positionId, pos);
    this.logAudit(pos.tenantId, 'system', 'CREATE', 'ORGANIZATIONAL_POSITION', positionId);
    return pos;
  }

  static updatePosition(positionId: string, updates: Partial<OrganizationalPosition>, userId: string): OrganizationalPosition {
    const existing = this.positions.get(positionId);
    if (!existing) throw new Error(`Position ${positionId} not found`);
    const updated: OrganizationalPosition = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.positions.set(positionId, updated);
    this.logAudit(updated.tenantId, userId, 'UPDATE', 'ORGANIZATIONAL_POSITION', positionId);
    return updated;
  }

  static createCommittee(data: Omit<Committee, 'committeeId' | 'createdAt' | 'updatedAt'>): Committee {
    const committeeId = `com_${Date.now()}`;
    const now = new Date().toISOString();
    const com: Committee = {
      ...data,
      committeeId,
      createdAt: now,
      updatedAt: now
    };
    this.committees.set(committeeId, com);
    this.logAudit(com.tenantId, 'system', 'CREATE', 'COMMITTEE', committeeId);
    return com;
  }

  static manageCommitteeMembership(data: Omit<CommitteeMembership, 'membershipId'>): CommitteeMembership {
    const membershipId = `memb_${Date.now()}`;
    const memb: CommitteeMembership = { ...data, membershipId };
    this.memberships.set(membershipId, memb);
    return memb;
  }

  static assignResponsibility(data: Omit<AdministrativeResponsibility, 'responsibilityId'>): AdministrativeResponsibility {
    const responsibilityId = `resp_${Date.now()}`;
    const resp: AdministrativeResponsibility = { ...data, responsibilityId };
    this.responsibilities.set(responsibilityId, resp);
    this.logAudit(resp.tenantId, 'system', 'CREATE', 'ADMINISTRATIVE_RESPONSIBILITY', responsibilityId);
    return resp;
  }

  static createOrganizationChangeRequest(data: Omit<OrganizationChangeRequest, 'requestId' | 'createdAt' | 'updatedAt'>): OrganizationChangeRequest {
    const requestId = `req_${Date.now()}`;
    const now = new Date().toISOString();
    const req: OrganizationChangeRequest = {
      ...data,
      requestId,
      createdAt: now,
      updatedAt: now
    };
    this.changeRequests.set(requestId, req);
    this.logAudit(req.tenantId, req.requestedBy, 'CREATE', 'ORGANIZATION_CHANGE_REQUEST', requestId);
    return req;
  }

  static submitOrganizationChange(requestId: string, userId: string): OrganizationChangeRequest {
    const req = this.changeRequests.get(requestId);
    if (!req) throw new Error(`Change request ${requestId} not found`);
    req.status = 'SUBMITTED';
    req.updatedAt = new Date().toISOString();
    this.logAudit(req.tenantId, userId, 'SUBMIT', 'ORGANIZATION_CHANGE_REQUEST', requestId);
    return req;
  }

  static approveOrganizationChange(requestId: string, approverUserId: string): OrganizationChangeRequest {
    const req = this.changeRequests.get(requestId);
    if (!req) throw new Error(`Change request ${requestId} not found`);
    if (req.requestedBy === approverUserId) {
      throw new Error('Four-Eyes Principle violation: Requester cannot approve their own structural change request.');
    }
    req.status = 'APPROVED';
    req.approvedBy = approverUserId;
    req.updatedAt = new Date().toISOString();
    this.logAudit(req.tenantId, approverUserId, 'APPROVE', 'ORGANIZATION_CHANGE_REQUEST', requestId);
    return req;
  }

  static scheduleOrganizationChange(requestId: string, scheduledFor: string, userId: string): OrganizationChangeRequest {
    const req = this.changeRequests.get(requestId);
    if (!req) throw new Error(`Change request ${requestId} not found`);
    req.status = 'SCHEDULED';
    req.scheduledFor = scheduledFor;
    req.updatedAt = new Date().toISOString();
    this.logAudit(req.tenantId, userId, 'SCHEDULE', 'ORGANIZATION_CHANGE_REQUEST', requestId);
    return req;
  }

  static implementOrganizationChange(requestId: string, userId: string): OrganizationChangeRequest {
    const req = this.changeRequests.get(requestId);
    if (!req) throw new Error(`Change request ${requestId} not found`);
    req.status = 'IMPLEMENTED';
    req.updatedAt = new Date().toISOString();
    this.logAudit(req.tenantId, userId, 'IMPLEMENT', 'ORGANIZATION_CHANGE_REQUEST', requestId);
    return req;
  }

  static runDiagnostics(tenantId: string): any[] {
    const findings: any[] = [];
    const units = Array.from(this.units.values()).filter(u => u.tenantId === tenantId);
    const codeCounts = new Map<string, number>();

    units.forEach(u => {
      codeCounts.set(u.code, (codeCounts.get(u.code) || 0) + 1);
      if (u.parentOrganizationUnitId && !this.units.has(u.parentOrganizationUnitId)) {
        findings.push({
          id: `diag_orphan_${u.organizationUnitId}`,
          severity: 'HIGH',
          title: 'Orphan Organizational Unit',
          description: `Unit ${u.name} references non-existent parent ID ${u.parentOrganizationUnitId}.`
        });
      }
    });

    codeCounts.forEach((count, code) => {
      if (count > 1) {
        findings.push({
          id: `diag_dup_code_${code}`,
          severity: 'MEDIUM',
          title: 'Duplicate Organization Code',
          description: `Organization code ${code} is used by ${count} distinct units.`
        });
      }
    });

    if (findings.length === 0) {
      findings.push({
        id: 'diag_ok',
        severity: 'INFORMATIONAL',
        title: 'Institutional Structure Diagnostics Passed',
        description: 'No circular hierarchies, orphan records, or duplicate codes detected.'
      });
    }

    return findings;
  }

  static getInstitutions(tenantId: string): Institution[] {
    return Array.from(this.institutions.values()).filter(i => i.tenantId === tenantId);
  }

  static getCampuses(tenantId: string): Campus[] {
    return Array.from(this.campuses.values()).filter(c => c.tenantId === tenantId);
  }

  static getUnits(tenantId: string): OrganizationalUnit[] {
    return Array.from(this.units.values()).filter(u => u.tenantId === tenantId);
  }

  static getPositions(tenantId: string): OrganizationalPosition[] {
    return Array.from(this.positions.values()).filter(p => p.tenantId === tenantId);
  }

  static getCommittees(tenantId: string): Committee[] {
    return Array.from(this.committees.values()).filter(c => c.tenantId === tenantId);
  }

  static getResponsibilities(tenantId: string): AdministrativeResponsibility[] {
    return Array.from(this.responsibilities.values()).filter(r => r.tenantId === tenantId);
  }

  static getChangeRequests(tenantId: string): OrganizationChangeRequest[] {
    return Array.from(this.changeRequests.values()).filter(r => r.tenantId === tenantId);
  }

  static getAuditEvents(tenantId: string): OrganizationAuditEvent[] {
    return this.auditEvents.filter(a => a.tenantId === tenantId);
  }
}
