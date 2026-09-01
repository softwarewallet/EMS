/**
 * EMS Phase 11.19: Institutional Data Governance, Records, Information Management, Privacy & Digital Trust Operations
 * Authoritative strongly typed domain models.
 */

export type InformationClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
export type DataQualityDimension = 'ACCURACY' | 'COMPLETENESS' | 'CONSISTENCY' | 'TIMELINESS' | 'VALIDITY' | 'UNIQUENESS' | 'INTEGRITY';
export type DataIssueStatus = 'OPEN' | 'TRIAGED' | 'ASSIGNED' | 'REMEDIATION' | 'VALIDATION' | 'RESOLVED' | 'CLOSED';
export type RecordState = 'DRAFT' | 'ACTIVE' | 'LOCKED' | 'RETENTION' | 'ELIGIBLE_FOR_DISPOSITION' | 'DISPOSED';
export type DispositionAction = 'DELETE' | 'ARCHIVE' | 'TRANSFER' | 'ANONYMIZE';
export type DispositionStatus = 'ELIGIBILITY_REVIEW' | 'APPROVAL' | 'SCHEDULED' | 'EXECUTED' | 'VERIFIED';
export type PrivacyRequestType = 'ACCESS' | 'RECTIFICATION' | 'ERASURE' | 'RESTRICTION' | 'PORTABILITY' | 'OBJECTION' | 'INFORMATION';
export type PrivacyRequestStatus = 'RECEIVED' | 'VALIDATION' | 'TRIAGED' | 'IN_PROGRESS' | 'RESPONSE_REVIEW' | 'COMPLETED' | 'CLOSED';
export type ConsentState = 'REQUESTED' | 'GRANTED' | 'DENIED' | 'WITHDRAWN' | 'EXPIRED';
export type PIAStatus = 'DRAFT' | 'ASSESSMENT' | 'MITIGATION' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'RETIRED';
export type DataSharingAgreementStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
export type IncidentStatus = 'DETECTED' | 'TRIAGED' | 'CONTAINMENT' | 'ASSESSMENT' | 'REMEDIATION' | 'VALIDATION' | 'CLOSED';

export interface DataDomain {
  domainId: string;
  tenantId: string;
  name: string;
  description: string;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
}

export interface DataCatalogEntry {
  assetId: string;
  tenantId: string;
  name: string;
  description: string;
  domainIdRef: string;
  classification: InformationClassification;
  sourceSystemIdRef: string;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  lastReviewedAt: string;
}

export interface DataQualityRule {
  ruleId: string;
  tenantId: string;
  assetIdRef: string;
  dimension: DataQualityDimension;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DataIssue {
  issueId: string;
  tenantId: string;
  assetIdRef: string;
  ruleIdRef?: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: DataIssueStatus;
  ownerUserIdRef: string;
  verifierUserIdRef?: string;
}

export interface DataLineageRecord {
  lineageId: string;
  tenantId: string;
  sourceAssetIdRef: string;
  targetAssetIdRef: string;
  relationshipType: 'SOURCE_OF' | 'TRANSFORMS_TO' | 'DERIVED_FROM' | 'SYNCHRONIZED_WITH' | 'PUBLISHED_TO' | 'CONSUMED_BY';
}

export interface MetadataDefinition {
  metadataId: string;
  tenantId: string;
  term: string;
  definition: string;
  status: 'DRAFT' | 'APPROVED' | 'SUPERSEDED';
}

export interface RecordLifecycle {
  recordId: string;
  tenantId: string;
  recordSeriesIdRef: string;
  sourceEntityIdRef: string;
  recordType: string;
  classification: InformationClassification;
  status: RecordState;
  createdAt: string;
  retentionStartAt?: string;
  retentionEndAt?: string;
  legalHoldReference?: string;
  currentVersionRef: string;
}

export interface RecordVersion {
  versionId: string;
  recordIdRef: string;
  tenantId: string;
  versionNumber: number;
  createdByUserIdRef: string;
  createdAt: string;
  contentReference: string;
  contentHash: string;
  previousVersionRef?: string;
}

export interface DispositionReview {
  reviewId: string;
  tenantId: string;
  recordIdRef: string;
  action: DispositionAction;
  status: DispositionStatus;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  executedByUserIdRef?: string;
  verifiedByUserIdRef?: string;
}

export interface DataProcessingActivity {
  activityId: string;
  tenantId: string;
  purpose: string;
  dataCategories: string[];
  dataSubjectCategories: string[];
  ownerUserIdRef: string;
  privacyRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reviewSchedule: string;
}

export interface ConsentRecord {
  consentId: string;
  tenantId: string;
  dataSubjectIdRef: string; // studentIdRef, employeeIdRef, etc.
  purpose: string;
  state: ConsentState;
  grantedAt?: string;
  withdrawnAt?: string;
  expiredAt?: string;
}

export interface PrivacyRequest {
  requestId: string;
  tenantId: string;
  dataSubjectIdRef: string;
  requestType: PrivacyRequestType;
  status: PrivacyRequestStatus;
  deadline: string;
  assignedUserIdRef?: string;
  approverUserIdRef?: string;
}

export interface PrivacyImpactAssessment {
  piaId: string;
  tenantId: string;
  activityIdRef: string;
  status: PIAStatus;
  riskAssessment: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
}

export interface DataSharingAgreement {
  agreementId: string;
  tenantId: string;
  recipientReference: string; // Third-party reference
  purpose: string;
  status: DataSharingAgreementStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  expirationDate: string;
}

export interface CrossBorderTransferAssessment {
  transferId: string;
  tenantId: string;
  destination: string;
  recipientReference: string;
  safeguardReference: string;
  status: 'DRAFT' | 'ASSESSMENT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
}

export interface PrivacyIncident {
  incidentId: string;
  tenantId: string;
  affectedDataReference: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: IncidentStatus;
  reporterUserIdRef: string;
  resolverUserIdRef?: string;
  verifierUserIdRef?: string;
}

export interface DigitalRecordCertification {
  certificationId: string;
  tenantId: string;
  recordIdRef: string;
  contentHash: string;
  issuerUserIdRef: string;
  issuedAt: string;
  verificationStatus: 'VALID' | 'INVALID' | 'REVOKED';
}

export interface DataGovernanceAuditEvent {
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
}

export interface DiagnosticFinding {
  invariantCode: string;
  title: string;
  status: 'PASS' | 'WARNING' | 'BLOCKING' | 'INSUFFICIENT_DATA';
  message: string;
}

export interface SimulationScenario {
  scenarioId: string;
  scenarioType: string;
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}
