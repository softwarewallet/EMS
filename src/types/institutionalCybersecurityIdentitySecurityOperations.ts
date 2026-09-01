/**
 * EMS Phase 11.21: Institutional Cybersecurity, Identity, Access, Security Operations
 * Strongly typed authoritative domain models.
 */

export type SecIdentityStatus = 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED' | 'DISABLED' | 'ARCHIVED';
export type SecIncidentStatus = 'DETECTED' | 'TRIAGED' | 'INVESTIGATING' | 'CONTAINMENT' | 'ERADICATION' | 'RECOVERY' | 'MONITORING' | 'CLOSED';
export type SecIncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecVulnerabilitySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SecPolicyStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED' | 'ARCHIVED';
export type SecControlAssessment = 'NOT_ASSESSED' | 'PARTIALLY_EFFECTIVE' | 'EFFECTIVE' | 'INEFFECTIVE';

export interface SecIdentityProfile {
  identityId: string;
  tenantId: string;
  campusIdRef?: string;
  sourceUserIdRef: string; // Ref to employee, student, or other external user identity
  status: SecIdentityStatus;
  mfaEnabled: boolean;
  mfaEnrolledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecRoleAssignment {
  assignmentId: string;
  tenantId: string;
  identityIdRef: string;
  roleId: string;
  assignedByUserIdRef: string;
  assignedAt: string;
  expiresAt?: string;
}

export interface SecPrivilegedAccessRequest {
  requestId: string;
  tenantId: string;
  identityIdRef: string;
  requestedRoleId: string;
  justification: string;
  durationMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface SecBreakGlassRequest {
  requestId: string;
  tenantId: string;
  identityIdRef: string;
  reason: string;
  status: 'ACTIVE' | 'REVIEWED' | 'CLOSED';
  requesterUserIdRef: string;
  reviewerUserIdRef?: string;
  startTime: string;
  endTime: string;
}

export interface SecAccessReview {
  reviewId: string;
  tenantId: string;
  campaignName: string;
  reviewerUserIdRef: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
}

export interface SecSecurityIncident {
  incidentId: string;
  tenantId: string;
  title: string;
  category: string;
  severity: SecIncidentSeverity;
  status: SecIncidentStatus;
  commanderUserIdRef?: string;
  createdAt: string;
  closedAt?: string;
  closureApproverUserIdRef?: string; // 4-eyes rule for major incidents
}

export interface SecSecurityAlert {
  alertId: string;
  tenantId: string;
  source: string;
  title: string;
  severity: SecIncidentSeverity;
  status: 'NEW' | 'ACKNOWLEDGED' | 'ESCALATED' | 'SUPPRESSED' | 'RESOLVED';
  incidentIdRef?: string;
  correlationKey?: string;
  createdAt: string;
}

export interface SecThreatIndicator {
  indicatorId: string;
  tenantId: string;
  type: 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'EMAIL' | 'HOSTNAME' | 'USER_REF' | 'OTHER';
  value: string;
  confidence: number;
  severity: SecIncidentSeverity;
  status: 'ACTIVE' | 'EXPIRED' | 'FALSE_POSITIVE';
  firstSeenAt: string;
  expiresAt?: string;
}

export interface SecVulnerabilityRecord {
  vulnerabilityId: string;
  tenantId: string;
  cveId?: string;
  title: string;
  severity: SecVulnerabilitySeverity;
  affectedAssetIdRef: string;
  status: 'OPEN' | 'REMEDIATING' | 'MITIGATED' | 'CLOSED' | 'EXCEPTION';
  discoveredAt: string;
}

export interface SecSecurityException {
  exceptionId: string;
  tenantId: string;
  controlIdRef: string;
  justification: string;
  riskAcceptanceApproverUserIdRef: string; // 4-eyes
  requesterUserIdRef: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
}

export interface SecSecurityPolicy {
  policyId: string;
  tenantId: string;
  title: string;
  status: SecPolicyStatus;
  ownerUserIdRef: string;
  createdAt: string;
}

export interface SecSecurityControl {
  controlId: string;
  tenantId: string;
  policyIdRef: string;
  title: string;
  assessmentState: SecControlAssessment;
  lastAssessedAt?: string;
}

export interface SecEndpointSecurityRecord {
  endpointRecordId: string;
  tenantId: string;
  assetIdRef: string;
  posture: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNKNOWN';
  lastAssessedAt: string;
}

export interface SecIncidentEvidence {
  evidenceId: string;
  tenantId: string;
  incidentIdRef: string;
  description: string;
  contentHash: string; // SHA-256
  collectedByUserIdRef: string;
  collectedAt: string;
}

export interface SecAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserIdRef: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  previousHash: string;
  currentHash: string;
  payloadDigest: string;
}
