export type AuditUniverseItemCriticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AssuranceFrequency = 'ANNUAL' | 'BI_ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'AD_HOC';
export type AuditPlanStatus = 'DRAFT' | 'PROPOSED' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'SUPERSEDED' | 'ARCHIVED';
export type EngagementLifecycle = 'INITIATED' | 'PLANNING' | 'FIELDWORK' | 'REVIEW' | 'DRAFT_REPORT' | 'MANAGEMENT_RESPONSE' | 'FINALIZATION' | 'ISSUED' | 'FOLLOW_UP' | 'CLOSED' | 'CANCELLED';
export type AssuranceEvidenceState = 'COLLECTED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'SUPERSEDED' | 'RETIRED';
export type ControlState = 'DESIGNED' | 'IMPLEMENTED' | 'OPERATING' | 'DEFICIENT' | 'INEFFECTIVE' | 'RETIRED';
export type ControlTestResultStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'NOT_TESTED' | 'INSUFFICIENT_EVIDENCE';
export type AssuranceFindingSeverity = 'OBSERVATION' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AssuranceFindingLifecycle = 'OPEN' | 'MANAGEMENT_RESPONSE' | 'REMEDIATION_ACTIVE' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED' | 'ACCEPTED' | 'ESCALATED';
export type CAPALifecycle = 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'BLOCKED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED' | 'CANCELLED';
export type RemediationEffectiveness = 'NOT_ASSESSED' | 'INEFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'EFFECTIVE' | 'INSUFFICIENT_DATA';
export type InspectionLifecycle = 'PLANNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW' | 'CLOSED' | 'CANCELLED';
export type AssuranceOpinionStatus = 'EFFECTIVE' | 'GENERALLY_EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'ADVERSE' | 'DISCLAIMER' | 'INSUFFICIENT_EVIDENCE';
export type AuditCommitteeDecision = 'PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DEFERRED' | 'CLOSED';
export type AssuranceType = 'INTERNAL_AUDIT' | 'COMPLIANCE_REVIEW' | 'CONTROL_ASSURANCE' | 'QUALITY_ASSURANCE' | 'SAFETY_ASSURANCE' | 'CYBER_ASSURANCE' | 'PRIVACY_ASSURANCE' | 'FINANCIAL_ASSURANCE' | 'THIRD_PARTY_ASSURANCE' | 'PROGRAM_ASSURANCE' | 'PROJECT_ASSURANCE' | 'THEMATIC_REVIEW';
export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';

export interface AuditUniverse {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  criticality: AuditUniverseItemCriticality;
  riskExposure: number;
  lastAssuranceDate?: string;
  assuranceFrequency: AssuranceFrequency;
  nextReviewDate?: string;
  ownerIdRef: string;
  sourceSystemRef?: string;
  strategicAlignment?: string;
  regulatoryRelevance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  year: number;
  status: AuditPlanStatus;
  priorityScore: number | 'INSUFFICIENT_DATA';
  ownerIdRef: string;
  executiveSponsorIdRef: string;
  resourceAssumptions: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEngagement {
  id: string;
  tenantId: string;
  campusId?: string;
  planIdRef?: string;
  title: string;
  status: EngagementLifecycle;
  objectives: string;
  scope: string;
  exclusions: string;
  methodology: string;
  leadAuditorIdRef: string;
  teamMemberIdRefs: string[];
  independenceDeclared: boolean;
  conflictOfInterestDeclared: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvidence {
  id: string;
  tenantId: string;
  engagementIdRef: string;
  sourceSystemRef?: string;
  sourceRecordIdRef?: string;
  description: string;
  classification: DataClassification;
  collectionDate: string;
  collectorIdRef: string;
  verificationStatus: AssuranceEvidenceState;
  provenanceHash: string;
  integrityHash: string;
  retentionReference?: string;
  findingReferences: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalControl {
  id: string;
  tenantId: string;
  objective: string;
  ownerIdRef: string;
  frequency: AssuranceFrequency;
  controlType: 'PREVENTIVE' | 'DETECTIVE';
  automationLevel: 'MANUAL' | 'SEMI_AUTOMATED' | 'AUTOMATED';
  riskIdRefs: string[];
  policyIdRefs: string[];
  obligationIdRefs: string[];
  evidenceRequirements: string;
  testingMethodology: string;
  lastTestDate?: string;
  nextTestDate?: string;
  status: ControlState;
  createdAt: string;
  updatedAt: string;
}

export interface ControlTestResult {
  id: string;
  tenantId: string;
  controlIdRef: string;
  engagementIdRef?: string;
  testMethod: 'DESIGN_EFFECTIVENESS' | 'OPERATING_EFFECTIVENESS' | 'SAMPLE_TEST' | 'REPERFORMANCE' | 'INSPECTION' | 'OBSERVATION' | 'INQUIRY' | 'AUTOMATED_TEST' | 'EVIDENCE_REVIEW';
  status: ControlTestResultStatus;
  testerIdRef: string;
  testDate: string;
  evidenceIdRefs: string[];
  comments: string;
  createdAt: string;
}

export interface AssuranceAuditFinding {
  id: string;
  tenantId: string;
  campusId?: string;
  engagementIdRef?: string;
  controlIdRef?: string;
  riskIdRef?: string;
  obligationIdRef?: string;
  title: string;
  condition: string;
  criteria: string;
  cause: string;
  effect: string;
  severity: AssuranceFindingSeverity;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  rootCauseIdRef?: string;
  managementResponse?: string;
  ownerIdRef: string;
  dueDate?: string;
  status: AssuranceFindingLifecycle;
  evidenceIdRefs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssuranceRootCauseAnalysis {
  id: string;
  tenantId: string;
  findingIdRef: string;
  methodology: '5_WHYS' | 'FISHBONE' | 'CAUSE_TREE' | 'BARRIER_ANALYSIS' | 'OTHER_GOVERNED_METHOD';
  analystIdRef: string;
  rootCause: string;
  contributingFactors: string[];
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  evidenceIdRefs: string[];
  createdAt: string;
}

export interface CAPAPlan {
  id: string;
  tenantId: string;
  findingIdRef: string;
  title: string;
  status: CAPALifecycle;
  ownerIdRef: string;
  correctiveActions: string[];
  preventiveActions: string[];
  targetDate: string;
  verificationIdRef?: string;
  effectivenessCheckDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CAPAVerification {
  id: string;
  tenantId: string;
  capaIdRef: string;
  verifierIdRef: string;
  verificationDate: string;
  effectiveness: RemediationEffectiveness;
  evidenceIdRefs: string[];
  comments: string;
  createdAt: string;
}

export interface Inspection {
  id: string;
  tenantId: string;
  campusId?: string;
  programRef?: string;
  title: string;
  status: InspectionLifecycle;
  scope: string;
  criteria: string;
  inspectorIdRefs: string[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssuranceOpinion {
  id: string;
  tenantId: string;
  engagementIdRef: string;
  opinion: AssuranceOpinionStatus;
  scope: string;
  basis: string;
  evidenceSufficiency: string;
  limitations: string;
  reviewerIdRef: string;
  approverIdRef?: string;
  provenanceHash: string;
  createdAt: string;
}

export interface AuditCommitteeMatter {
  id: string;
  tenantId: string;
  title: string;
  status: AuditCommitteeDecision;
  findingIdRef?: string;
  riskIdRef?: string;
  proposerIdRef: string;
  approverIdRef?: string;
  meetingDate?: string;
  decisionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditTrailEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  provenance: string;
  metadata: string;
}
