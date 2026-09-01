export type InstitutionType = 'UNIVERSITY' | 'COLLEGE' | 'INSTITUTE' | 'SYSTEM' | 'SEMINARY' | 'OTHER';

export type CampusType = 'MAIN' | 'SATELLITE' | 'VIRTUAL' | 'RESEARCH' | 'CLINICAL' | 'EXTENSION';

export type OrganizationUnitType = 
  | 'SCHOOL' 
  | 'FACULTY' 
  | 'COLLEGE' 
  | 'DEPARTMENT' 
  | 'DIVISION' 
  | 'OFFICE' 
  | 'CENTER' 
  | 'UNIT' 
  | 'COMMITTEE' 
  | 'LABORATORY' 
  | 'PROGRAM';

export type OwnershipType = 'AUTHORITATIVE' | 'FEDERATED' | 'EXTERNAL_REFERENCE' | 'VIRTUAL';

export type RelationshipType = 
  | 'PARENT' 
  | 'CHILD' 
  | 'REPORTS_TO' 
  | 'MATRIX_REPORTS_TO' 
  | 'OVERSEES' 
  | 'SUPPORTS' 
  | 'COORDINATES' 
  | 'COLLABORATES_WITH' 
  | 'GOVERNED_BY';

export type PositionType = 'EXECUTIVE' | 'ADMINISTRATIVE' | 'ACADEMIC_HEAD' | 'FACULTY_MEMBER' | 'SUPPORT_STAFF' | 'OFFICER';

export type CommitteeType = 'STANDING' | 'AD_HOC' | 'SENATE' | 'BOARD' | 'TASK_FORCE' | 'EXECUTIVE';

export type ResponsibilityType = 
  | 'BUDGET_OWNERSHIP' 
  | 'ACADEMIC_ADMINISTRATION' 
  | 'STUDENT_SERVICES' 
  | 'COMPLIANCE_RESPONSIBILITY' 
  | 'FACILITIES_RESPONSIBILITY' 
  | 'TECHNOLOGY_RESPONSIBILITY' 
  | 'RESEARCH_RESPONSIBILITY';

export type ChangeRequestStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTED' | 'CANCELLED';

export interface Institution {
  institutionId: string;
  tenantId: string;
  legalName: string;
  displayName: string;
  shortName: string;
  institutionType: InstitutionType;
  accreditationReferences: string[];
  country: string;
  region: string;
  timezone: string;
  primaryCampusId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Campus {
  campusId: string;
  tenantId: string;
  institutionId: string;
  code: string;
  name: string;
  campusType: CampusType;
  locationReference: string;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  effectiveFrom: string;
  effectiveTo?: string;
  primaryContactReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationalUnit {
  organizationUnitId: string;
  tenantId: string;
  campusId: string;
  parentOrganizationUnitId?: string;
  unitType: OrganizationUnitType;
  code: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REORGANIZING' | 'ARCHIVED';
  headPositionId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  ownershipType: OwnershipType;
  authoritativeSystem?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationalRelationship {
  relationshipId: string;
  tenantId: string;
  sourceOrganizationId: string;
  targetOrganizationId: string;
  relationshipType: RelationshipType;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OrganizationalPosition {
  positionId: string;
  tenantId: string;
  campusId: string;
  organizationUnitId: string;
  positionCode: string;
  title: string;
  positionType: PositionType;
  reportingPositionId?: string;
  status: 'ACTIVE' | 'VACANT' | 'FROZEN' | 'ELIMINATED';
  effectiveFrom: string;
  effectiveTo?: string;
  responsibilityReferences: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeMembership {
  membershipId: string;
  committeeId: string;
  userReference: string;
  role: 'CHAIR' | 'CO_CHAIR' | 'SECRETARY' | 'MEMBER' | 'EX_OFFICIO' | 'OBSERVER';
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Committee {
  committeeId: string;
  tenantId: string;
  campusId: string;
  organizationUnitId?: string;
  code: string;
  name: string;
  committeeType: CommitteeType;
  charterReference: string;
  chairPositionId?: string;
  quorumCount: number;
  meetingFrequency: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISSOLVED';
  createdAt: string;
  updatedAt: string;
}

export interface AdministrativeResponsibility {
  responsibilityId: string;
  tenantId: string;
  organizationUnitId: string;
  responsibilityType: ResponsibilityType;
  ownerPositionId: string;
  backupPositionId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OrganizationContact {
  contactId: string;
  tenantId: string;
  organizationUnitId: string;
  contactType: 'EMAIL' | 'PHONE' | 'OFFICE_LOCATION' | 'MAILING_ADDRESS';
  label: string;
  value: string;
  isPrimary: boolean;
}

export interface OrganizationChangeRequest {
  requestId: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  changeType: 'UNIT_CREATION' | 'UNIT_RESTRUCTURING' | 'UNIT_CLOSURE' | 'POSITION_CREATION' | 'HIERARCHY_MODIFICATION';
  targetEntityId: string;
  payload: any;
  status: ChangeRequestStatus;
  requestedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationAuditEvent {
  eventId: string;
  tenantId: string;
  campusId?: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  signatureHash: string;
  metadata?: any;
}
