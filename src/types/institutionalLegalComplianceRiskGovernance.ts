/**
 * EMS Phase 11.16: Institutional Legal, Compliance, Risk, Governance & Policy Operations
 * Authoritative strongly typed domain models.
 */

export type LegalCaseLifecycleStatus =
  | 'DRAFT'
  | 'INTAKE'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'RESOLUTION_PROPOSED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type ComplianceObligationStatus =
  | 'IDENTIFIED'
  | 'ASSESSED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'EVIDENCE_SUBMITTED'
  | 'VERIFIED'
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'AT_RISK'
  | 'EXPIRED'
  | 'WAIVED'
  | 'CLOSED';

export type ComplianceControlStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'UNDER_TEST'
  | 'FAILED'
  | 'REMEDIATION_REQUIRED'
  | 'PASSED'
  | 'RETIRED';

export type RiskTreatmentStrategy = 'ACCEPT' | 'MITIGATE' | 'TRANSFER' | 'AVOID';

export type RiskSeverityBand = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PolicyLifecycleStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'EFFECTIVE'
  | 'SUPERSEDED'
  | 'RETIRED';

export type RegulatorySubmissionStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'CLOSED';

export interface CurrencyAmount {
  currencyCode: string;
  amountMinorUnits: number;
}

export interface InstitutionalLegalMatter {
  matterId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  description: string;
  practiceArea: 'LITIGATION' | 'EMPLOYMENT' | 'INTELLECTUAL_PROPERTY' | 'CONTRACTS' | 'REGULATORY' | 'STUDENT_AFFAIRS';
  status: LegalCaseLifecycleStatus;
  leadCounselUserIdRef: string;
  externalCounselReference?: string;
  estimatedExposure?: CurrencyAmount;
  createdAt: string;
  updatedAt: string;
}

export interface LegalCase {
  caseId: string;
  matterIdRef: string;
  tenantId: string;
  campusIdRef: string;
  caseNumber: string;
  courtOrForum: string;
  plaintiffOrClaimant: string;
  defendantOrRespondent: string;
  status: LegalCaseLifecycleStatus;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface ComplianceObligation {
  obligationId: string;
  tenantId: string;
  campusIdRef: string;
  regulatoryAuthority: string;
  jurisdiction: string;
  title: string;
  description: string;
  ownerUserIdRef: string;
  frequency: 'ANNUAL' | 'BIENNIAL' | 'QUARTERLY' | 'MONTHLY' | 'CONTINUOUS';
  status: ComplianceObligationStatus;
  deadline: string;
  escalationLevel: RiskSeverityBand;
}

export interface ComplianceControl {
  controlId: string;
  tenantId: string;
  campusIdRef: string;
  controlCode: string;
  title: string;
  objective: string;
  ownerUserIdRef: string;
  frequency: 'ANNUAL' | 'SEMI_ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'CONTINUOUS';
  status: ComplianceControlStatus;
  lastTestedDate?: string;
  lastTestResult?: 'PASS' | 'FAIL';
}

export interface InstitutionalRisk {
  riskId: string;
  tenantId: string;
  campusIdRef: string;
  category: 'FINANCIAL' | 'OPERATIONAL' | 'REPUTATIONAL' | 'REGULATORY' | 'STRATEGIC' | 'CYBER_SECURITY';
  title: string;
  description: string;
  ownerUserIdRef: string;
  inherentLikelihood: number; // 1-5
  inherentImpact: number; // 1-5
  inherentScore: number;
  residualLikelihood: number;
  residualImpact: number;
  residualScore: number;
  treatmentStrategy: RiskTreatmentStrategy;
  severityBand: RiskSeverityBand;
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';
  acceptedByUserIdRef?: string;
}

export interface PolicyDocument {
  policyId: string;
  tenantId: string;
  campusIdRef: string;
  policyCode: string;
  title: string;
  category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'RESEARCH' | 'STUDENT' | 'IT_SECURITY' | 'FINANCE';
  ownerUserIdRef: string;
  currentVersion: string;
  status: PolicyLifecycleStatus;
  requiresAcknowledgement: boolean;
  createdAt: string;
}

export interface PolicyVersion {
  versionId: string;
  policyIdRef: string;
  versionNumber: string;
  content: string;
  effectiveDate: string;
  status: PolicyLifecycleStatus;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  immutable: boolean;
}

export interface GovernanceBody {
  bodyId: string;
  tenantId: string;
  campusIdRef: string;
  bodyName: string;
  mandate: string;
  chairUserIdRef: string;
  secretaryUserIdRef: string;
}

export interface GovernanceMeeting {
  meetingId: string;
  bodyIdRef: string;
  tenantId: string;
  campusIdRef: string;
  meetingDate: string;
  locationOrUrl: string;
  agendaSummary: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'ADJOURNED' | 'CANCELLED';
}

export interface GovernanceDecision {
  decisionId: string;
  meetingIdRef: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  resolutionText: string;
  votingSummary: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'TABLED';
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
}

export interface InvestigationRecord {
  investigationId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  classification: 'MISCONDUCT' | 'FRAUD' | 'HARASSMENT' | 'DATA_BREACH' | 'RESEARCH_INTEGRITY';
  leadInvestigatorUserIdRef: string;
  status: 'INTAKE' | 'ACTIVE' | 'INTERVIEWING' | 'REPORT_DRAFTING' | 'CLOSED';
  conflictChecked: boolean;
  confidential: boolean;
  openedAt: string;
  closedAt?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
}

export interface RegulatorySubmission {
  submissionId: string;
  tenantId: string;
  campusIdRef: string;
  regulatorName: string;
  title: string;
  deadline: string;
  status: RegulatorySubmissionStatus;
  responsibleOfficerUserIdRef: string;
  submissionTimestamp?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
}

export interface ComplianceException {
  exceptionId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  reason: string;
  scope: string;
  riskAssessmentSummary: string;
  compensatingControls: string;
  expiryDate: string;
  status: 'REQUESTED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
}

export interface ConflictOfInterestDeclaration {
  declarationId: string;
  tenantId: string;
  campusIdRef: string;
  personUserIdRef: string;
  relatedEntity: string;
  natureOfConflict: string;
  status: 'PENDING_REVIEW' | 'MITIGATED' | 'APPROVED' | 'REJECTED';
  reviewerUserIdRef: string;
  mitigationPlan?: string;
}

export interface LegalComplianceAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  previousHash: string;
  currentHash: string;
  actorUserIdRef: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  payloadDigest: string;
}

export interface LegalComplianceSimulationScenario {
  scenarioId: string;
  scenarioType:
    | 'REGULATORY_DEADLINE_SURGE'
    | 'CRITICAL_RISK_ESCALATION'
    | 'COMPLIANCE_FAILURE_CASCADE'
    | 'MASS_POLICY_ACKNOWLEDGEMENT_CAMPAIGN'
    | 'POLICY_VERSION_SUPERSESSION'
    | 'CONTROL_FAILURE_REMEDIATION'
    | 'MULTI_CAMPUS_COMPLIANCE_ASSESSMENT'
    | 'REGULATORY_SUBMISSION_DELAY'
    | 'CRITICAL_LEGAL_MATTER_ESCALATION'
    | 'INVESTIGATION_WORKLOAD_SURGE'
    | 'HIGH_RISK_EXCEPTION_EXPIRY'
    | 'GOVERNANCE_ACTION_BACKLOG'
    | 'CONFLICT_OF_INTEREST_DETECTION'
    | 'COMPLIANCE_EVIDENCE_LOSS'
    | 'ENTERPRISE_COMPLIANCE_CRISIS';
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}
