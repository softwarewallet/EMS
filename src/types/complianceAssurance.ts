export enum ComplianceFrameworkStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RETIRED = 'RETIRED'
}

export enum ComplianceObligationStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  FULFILLED = 'FULFILLED',
  SUPERSEDED = 'SUPERSEDED',
  RETIRED = 'RETIRED'
}

export enum ComplianceControlType {
  PREVENTIVE = 'PREVENTIVE',
  DETECTIVE = 'DETECTIVE',
  CORRECTIVE = 'CORRECTIVE',
  COMPENSATING = 'COMPENSATING'
}

export enum ComplianceControlEffectiveness {
  NOT_TESTED = 'NOT_TESTED',
  INEFFECTIVE = 'INEFFECTIVE',
  PARTIALLY_EFFECTIVE = 'PARTIALLY_EFFECTIVE',
  EFFECTIVE = 'EFFECTIVE',
  OPTIMIZED = 'OPTIMIZED'
}

export enum ComplianceFindingSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplianceFindingStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  REMEDIATION_PLANNED = 'REMEDIATION_PLANNED',
  IN_REMEDIATION = 'IN_REMEDIATION',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  CLOSED = 'CLOSED'
}

export enum LegalMatterStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum LegalMatterPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplianceAssessmentStatus {
  DRAFT = 'DRAFT',
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  EVIDENCE_COLLECTION = 'EVIDENCE_COLLECTION',
  ASSESSMENT = 'ASSESSMENT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum ComplianceEscalationLevel {
  NOTICE = 'NOTICE',
  WARNING = 'WARNING',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ComplianceFramework {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  code: string;
  authorityId: string;
  jurisdiction: string;
  effectiveDate: string;
  reviewDate: string;
  responsibleOwnerId: string;
  sourceDocumentUrl?: string;
  documentRegistryId?: string;
  status: ComplianceFrameworkStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegulatoryAuthority {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  jurisdiction: string;
  website?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegulatoryRequirement {
  id: string;
  tenantId: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  articleNumber?: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceObligation {
  id: string;
  tenantId: string;
  campusId: string; // 'ALL_CAMPUSES', 'SINGLE_CAMPUS', 'MULTI_CAMPUS' conceptually mapped
  campusScopeType: 'ALL_CAMPUSES' | 'SINGLE_CAMPUS' | 'MULTI_CAMPUS';
  frameworkId: string;
  requirementId: string;
  code: string;
  title: string;
  description: string;
  authorityId: string;
  jurisdiction: string;
  source: string;
  applicability: string;
  ownerId: string;
  accountableExecutiveId: string;
  department: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY' | 'AD_HOC';
  deadline?: string;
  evidenceRequirements: string;
  status: ComplianceObligationStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceControl {
  id: string;
  tenantId: string;
  obligationId: string;
  code: string;
  title: string;
  description: string;
  controlType: ComplianceControlType;
  ownerId: string;
  effectiveness: ComplianceControlEffectiveness;
  lastTestedAt?: string;
  nextTestDueDate?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceControlTest {
  id: string;
  tenantId: string;
  controlId: string;
  testerId: string;
  testDate: string;
  methodology: string;
  result: 'EFFECTIVE' | 'INEFFECTIVE' | 'PARTIALLY_EFFECTIVE';
  evidenceDetails?: string;
  documentRegistryId?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  description: string;
  assessors: string[];
  startDate: string;
  endDate: string;
  obligationCoverageCount: number;
  effectiveControlCount: number;
  evidenceCompleteCount: number;
  overdueObligationCount: number;
  openFindingsCount: number;
  criticalFindingsCount: number;
  status: ComplianceAssessmentStatus;
  certifiedBy?: string;
  certifiedAt?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAssessmentFinding {
  id: string;
  tenantId: string;
  assessmentId: string;
  obligationId: string;
  controlId?: string;
  title: string;
  description: string;
  severity: ComplianceFindingSeverity;
  rootCause: string;
  regulatoryReference: string;
  controlReference?: string;
  ownerId: string;
  targetDate: string;
  remediationPlan?: string;
  evidenceId?: string; // Phase 7.27 integration
  qualityReviewId?: string; // CAPA integration Phase 7.34
  verificationEvidence?: string;
  closureDecision?: string;
  closedBy?: string;
  closedAt?: string;
  status: ComplianceFindingStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceException {
  id: string;
  tenantId: string;
  campusId: string;
  obligationId: string;
  reason: string;
  justification: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceWaiver {
  id: string;
  tenantId: string;
  campusId: string;
  obligationId: string;
  reason: string;
  justification: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalMatter {
  id: string;
  tenantId: string;
  campusId: string;
  matterNumber: string;
  title: string;
  classification: 'LITIGATION' | 'REGULATORY_HEARING' | 'CONTRACTUAL' | 'EMPLOYMENT' | 'STUDENT_DISCIPLINE' | 'INTELLECTUAL_PROPERTY' | 'OTHER';
  responsibleLegalOwnerId: string;
  businessOwnerId: string;
  externalCounselReference?: string;
  priority: LegalMatterPriority;
  legalRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  exposureEstimate: number;
  status: LegalMatterStatus;
  secondaryAuthorizedBy?: string;
  secondaryAuthorizedAt?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalMatterParty {
  id: string;
  tenantId: string;
  matterId: string;
  name: string;
  role: 'PLAINTIFF' | 'DEFENDANT' | 'WITNESS' | 'CLAIMANT' | 'RESPONDENT' | 'EXTERNAL_COUNSEL' | 'THIRD_PARTY';
  contactInfo?: string;
  createdBy: string;
  createdAt: string;
}

export interface LegalDeadline {
  id: string;
  tenantId: string;
  matterId: string;
  title: string;
  dueDate: string;
  responsibleUserId: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  createdBy: string;
  createdAt: string;
}

export interface LegalHold {
  id: string;
  tenantId: string;
  holdIdentifier: string;
  triggeringMatterId: string;
  scopeDescription: string;
  affectedRecords: string[]; // documentRegistryIds
  affectedUsersOrDepartments: string[];
  issuedBy: string;
  acknowledgedBy?: string;
  effectiveAt: string;
  releasedAt?: string;
  releaseAuthority?: string;
  status: 'ACTIVE' | 'RELEASED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalCorrespondence {
  id: string;
  tenantId: string;
  matterId: string;
  sender: string;
  recipient: string;
  subject: string;
  dateSent: string;
  summary: string;
  documentRegistryId?: string;
  createdBy: string;
  createdAt: string;
}

export interface LegalOpinion {
  id: string;
  tenantId: string;
  matterId: string;
  authorUserId: string;
  opinionText: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidentialityLevel: 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  documentRegistryId?: string;
  createdBy: string;
  createdAt: string;
}

export interface LegalRiskAssessment {
  id: string;
  tenantId: string;
  matterId: string;
  probabilityOfLoss: number; // 0 - 100
  exposureAmount: number;
  mitigationStrategy?: string;
  assessedBy: string;
  assessedAt: string;
}

export interface AssurancePlan {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  scope: string;
  startDate: string;
  endDate: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssuranceReview {
  id: string;
  tenantId: string;
  planId: string;
  title: string;
  reviewType: 'COMPLIANCE' | 'INTERNAL_AUDIT' | 'REGULATORY_INSPECTION' | 'ACCREDITATION' | 'PRIVACY' | 'CYBERSECURITY' | 'AI_GOVERNANCE' | 'OPERATIONAL_CONTROLS';
  leadReviewerId: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'REPORT_DRAFTED' | 'COMPLETED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssuranceFinding {
  id: string;
  tenantId: string;
  reviewId: string;
  title: string;
  description: string;
  severity: ComplianceFindingSeverity;
  status: 'OPEN' | 'IN_REMEDIATION' | 'CLOSED';
  createdBy: string;
  createdAt: string;
}

export interface AssuranceRecommendation {
  id: string;
  tenantId: string;
  findingId: string;
  recommendationText: string;
  ownerId: string;
  targetDate: string;
  createdBy: string;
  createdAt: string;
}

export interface AssuranceAction {
  id: string;
  tenantId: string;
  recommendationId: string;
  actionText: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
}

export interface AssuranceEvidence {
  id: string;
  tenantId: string;
  reviewId: string;
  title: string;
  documentRegistryId: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AssuranceCertification {
  id: string;
  tenantId: string;
  title: string;
  statement: string;
  evidenceIds: string[];
  validityStartDate: string;
  validityEndDate: string;
  certifiedBy: string;
  certifiedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'SUPERSEDED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAttestation {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  statement: string;
  assessmentId: string;
  validityPeriod: string; // YYYY-MM-DD to YYYY-MM-DD
  evidenceIds: string[];
  certifiedBy: string;
  certifiedAt: string;
  reviewerId?: string;
  approvedBy?: string;
  approvedAt?: string;
  expiryDate: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegulatorySubmission {
  id: string;
  tenantId: string;
  authorityId: string;
  submissionType: string;
  reportingPeriod: string;
  deadline: string;
  ownerId: string;
  reviewerId?: string;
  approvedBy?: string;
  approvedAt?: string;
  submissionTimestamp?: string;
  acknowledgementNumber?: string;
  supportingEvidenceIds: string[]; // documentRegistryIds
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceRegulatoryInspection {
  id: string;
  tenantId: string;
  authorityId: string;
  inspectionDate: string;
  scope: string;
  inspectors: string[];
  coordinatorUserId: string;
  requestedEvidenceIds: string[]; // documentRegistryIds
  findingsSummary?: string;
  responseDeadline?: string;
  outcome?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegulatoryRequest {
  id: string;
  tenantId: string;
  authorityId: string;
  requestCode: string;
  subject: string;
  requestedDate: string;
  deadlineDate: string;
  assignedUserId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED';
}

export interface RegulatoryResponse {
  id: string;
  tenantId: string;
  requestId: string;
  responseText: string;
  evidenceIds: string[];
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'DRAFT' | 'APPROVED' | 'SUBMITTED';
}

export interface RegulatoryCorrespondence {
  id: string;
  tenantId: string;
  authorityId: string;
  direction: 'INBOUND' | 'OUTBOUND';
  correspondenceDate: string;
  subject: string;
  sender: string;
  recipient: string;
  summary: string;
  documentRegistryId?: string;
}

export interface RegulatoryDecision {
  id: string;
  tenantId: string;
  authorityId: string;
  decisionDate: string;
  referenceNumber: string;
  subject: string;
  decisionOutcome: 'APPROVED' | 'CONDITIONAL' | 'DENIED' | 'PENALIZED' | 'INVESTIGATION';
  details: string;
}

export interface ComplianceRiskSnapshot {
  id: string;
  tenantId: string;
  calculatedAt: string;
  overallScore: number;
  riskBand: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  explanation: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface ComplianceHeatmap {
  byCampus: Record<string, number>;
  byDepartment: Record<string, number>;
  byFramework: Record<string, number>;
  byObligation: Record<string, number>;
}

export interface ObligationCoverageSnapshot {
  tenantId: string;
  totalObligations: number;
  activeObligations: number;
  coveredByControlsCount: number;
  uncoveredObligationsCount: number;
}

export interface ComplianceAnalytics {
  complianceHealthScore: number;
  regulatoryExposureScore: number;
  criticalFindingsCount: number;
  overdueObligationsCount: number;
  evidenceCompletenessRate: number;
  controlEffectivenessRate: number;
  upcomingDeadlinesCount: number;
  certificationStatusCount: Record<string, number>;
}

export interface ComplianceDataQualityIssue {
  id: string;
  tenantId: string;
  issueType: string;
  entityType: string;
  entityId: string;
  description: string;
  detectedAt: string;
  remediedAt?: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface ComplianceAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  actorDisplayName: string;
  action: string;
  entity: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  justification?: string;
  timestamp: string;
  source: string;
  correlationId: string;
}
