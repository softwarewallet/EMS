export type GraduationApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ELIGIBILITY_CHECK'
  | 'CLEARANCE'
  | 'ACADEMIC_REVIEW'
  | 'ADMINISTRATIVE_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'GRADUATED'
  | 'CLOSED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CANCELLED';

export type AwardCredentialStatus =
  | 'ISSUED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REVOKED'
  | 'REPLACED'
  | 'EXPIRED';

export type AlumniStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DECEASED'
  | 'ARCHIVED';

export type ClearanceCategory =
  | 'ACADEMIC'
  | 'ADMINISTRATIVE'
  | 'FINANCIAL'
  | 'LIBRARY'
  | 'HOSTEL'
  | 'DISCIPLINARY'
  | 'DOCUMENTATION'
  | 'OTHER_INSTITUTIONAL';

export interface GraduationApplication {
  applicationId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  programIdRef: string;
  programVersionIdRef: string;
  academicRecordIdRef?: string;
  status: GraduationApplicationStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface GraduationClearanceItem {
  clearanceId: string;
  tenantId: string;
  applicationIdRef: string;
  category: ClearanceCategory;
  status: 'PENDING' | 'CLEARED' | 'REJECTED';
  responsibleUnitRef: string;
  reviewerUserIdRef?: string;
  comments?: string;
  reviewedAt?: string;
}

export interface DegreeAward {
  awardId: string;
  tenantId: string;
  studentIdRef: string;
  programIdRef: string;
  campusIdRef: string;
  graduationCohortRef: string;
  academicRecordIdRef: string;
  status: 'PROPOSED' | 'REVIEW' | 'APPROVED' | 'AWARDED' | 'RECORDED' | 'REJECTED' | 'CANCELLED' | 'WITHDRAWN';
  awardIdentifier: string; // e.g. 2026-DEG-000001
  awardDate?: string;
  proposerUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
}

export interface AwardCredential {
  credentialId: string;
  tenantId: string;
  studentIdRef: string;
  awardIdRef: string;
  type: 'DEGREE' | 'DIPLOMA' | 'CERTIFICATE';
  status: AwardCredentialStatus;
  issuedAt: string;
  issuerUserIdRef: string;
  revocationReason?: string;
  revokerUserIdRef?: string;
}

export interface CredentialReplacement {
  replacementId: string;
  tenantId: string;
  previousCredentialIdRef: string;
  newCredentialIdRef?: string;
  reason: string;
  status: 'REQUESTED' | 'REVIEW' | 'APPROVED' | 'ISSUED' | 'REJECTED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
}

export interface AlumniProfile {
  alumniId: string;
  tenantId: string;
  studentIdRef: string;
  degreeAwardIdRef: string;
  status: AlumniStatus;
  preferredEmail?: string;
  preferredPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniAffiliation {
  affiliationId: string;
  tenantId: string;
  alumniIdRef: string;
  type: 'EMPLOYER' | 'PROFESSIONAL_ROLE' | 'ALUMNI_ASSOCIATION' | 'MENTORSHIP' | 'PHILANTHROPY';
  organizationName: string;
  roleTitle?: string;
  isActive: boolean;
  startDate?: string;
}

export interface GraduationAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
