export type DecisionLifecycleState = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'EVIDENCE_REVIEW' 
  | 'ANALYSIS' 
  | 'RECOMMENDATION_READY' 
  | 'EXECUTIVE_REVIEW' 
  | 'APPROVAL_PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DEFERRED' 
  | 'DIRECTED' 
  | 'IMPLEMENTATION_MONITORING' 
  | 'REVIEW_REQUIRED' 
  | 'CLOSED' 
  | 'SUPERSEDED' 
  | 'CANCELLED';

export interface DecisionIntelligenceStrategy {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  strategicObjectives: DecisionStrategicObjective[];
  priority: DecisionPriority;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface DecisionStrategicObjective {
  id: string;
  name: string;
  description: string;
  indicatorIdRefs: string[]; // Reference to Phase 9.1/9.2 Indicators
}

export enum DecisionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface DecisionIntelligencePortfolio {
  id: string;
  tenantId: string;
  name: string;
  strategyIdRef: string;
  decisionIds: string[];
  createdAt: string;
}

export interface DecisionRequest {
  id: string;
  tenantId: string;
  campusId: string;
  requesterUserIdRef: string;
  decisionCategory: string;
  strategicObjectiveRefs: string[];
  originatingSourceRefs: string[]; // References to cases, risks, workflows
  requestedDecisionDate: string;
  urgency: DecisionPriority;
  institutionalImpact: DecisionImpactLevel;
  financialImpactReference?: string;
  riskReferenceIds: string[];
  evidenceReferences: string[];
  decisionOwnerUserIdRef: string;
  state: DecisionLifecycleState;
  createdAt: string;
}

export interface GovDecisionBrief {
  id: string;
  decisionRequestIdRef: string;
  problemStatement: string;
  decisionQuestion: string;
  strategicContext: string;
  currentStateEvidence: string;
  constraints: string[];
  assumptions: string[];
  alternatives: string[];
  optionComparison: string;
  risks: string[];
  financialConsiderations: string;
  policyImplications: string;
  legalComplianceConsiderations: string;
  technologyImplications: string;
  implementationDependencies: string[];
  recommendation: string;
  confidenceLevel: number;
  evidenceSufficiency: DecisionEvidenceSufficiency;
  unresolvedQuestions: string[];
  authorUserIdRef: string;
  updatedAt: string;
}

export interface DecisionEvidenceReference {
  id: string;
  decisionIdRef: string;
  sourceRecordIdRef: string;
  sourceModuleIdRef: string;
  assessment: DecisionEvidenceAssessment;
  sufficiency: DecisionEvidenceSufficiency;
  provenanceHash: string;
}

export enum DecisionEvidenceAssessment {
  SUPPORTIVE = 'SUPPORTIVE',
  NEUTRAL = 'NEUTRAL',
  CONTRADICTORY = 'CONTRADICTORY'
}

export enum DecisionEvidenceSufficiency {
  SUFFICIENT = 'SUFFICIENT',
  PARTIALLY_SUFFICIENT = 'PARTIALLY_SUFFICIENT',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  CONFLICTING_EVIDENCE = 'CONFLICTING_EVIDENCE',
  STALE_EVIDENCE = 'STALE_EVIDENCE',
  UNVERIFIED = 'UNVERIFIED'
}

export interface DecisionOption {
  id: string;
  decisionBriefIdRef: string;
  title: string;
  description: string;
  strategicAlignment: number; // 0-100
  institutionalImpact: number;
  financialExposure: number;
  operationalComplexity: number;
  implementationEffort: number;
  riskExposure: number;
  regulatoryImpact: number;
  stakeholderImpact: number;
  reversibility: number;
  timeToValue: number;
  dependencyConcentration: number;
  totalScore: number;
}

export interface GovDecisionRecommendation {
  id: string;
  decisionBriefIdRef: string;
  selectedOptionIdRef: string;
  rationale: string;
  confidenceScore: number;
  authorUserIdRef: string;
  createdAt: string;
}

/**
 * Phase 9.5 Specific Executive Decision
 * Renamed to avoid collision with Phase 9.1
 */
export interface GovExecutiveDecision {
  id: string;
  tenantId: string;
  campusId: string;
  decisionRequestIdRef: string;
  version: number;
  state: DecisionLifecycleState;
  proposerUserIdRef: string;
  approverUserIdRefs: string[];
  approvalTimestamp?: string;
  rationale: string;
  evidenceIdRefs: string[];
  recommendationIdRef: string;
  riskReferenceIds: string[];
  strategicAlignmentRefs: string[];
  dissentChallengeRefs: string[];
  policyImpactIdRef?: string;
  implementationDirective: string;
  provenanceHash: string;
  previousProvenanceHash: string;
  createdAt: string;
}

export interface GovDecisionApproval {
  id: string;
  decisionIdRef: string;
  approverUserIdRef: string;
  status: 'APPROVED' | 'REJECTED' | 'DISSENT';
  comments: string;
  timestamp: string;
  signature: string;
}

export interface DecisionChallenge {
  id: string;
  decisionIdRef: string;
  challengerUserIdRef: string;
  type: 'FACTUAL' | 'EVIDENCE' | 'RISK' | 'COMPLIANCE' | 'FINANCIAL' | 'STRATEGIC' | 'IMPLEMENTATION';
  description: string;
  evidenceRefs: string[];
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  timestamp: string;
}

export interface PolicyImpactAssessment {
  id: string;
  decisionIdRef: string;
  assessorUserIdRef: string;
  impactedPolicyRefs: string[]; // References to Policy Module
  impactTypes: PolicyImpactType[];
  assessmentDetail: string;
  mitigationRequired: boolean;
  status: 'PENDING' | 'COMPLETED' | 'BLOCKED';
}

export enum PolicyImpactType {
  INSTITUTIONAL = 'INSTITUTIONAL',
  ACADEMIC = 'ACADEMIC',
  HR = 'HR',
  FINANCIAL = 'FINANCIAL',
  TECHNOLOGY = 'TECHNOLOGY',
  SAFETY = 'SAFETY',
  PRIVACY = 'PRIVACY',
  CYBERSECURITY = 'CYBERSECURITY',
  RESEARCH = 'RESEARCH',
  GOVERNANCE = 'GOVERNANCE'
}

export interface StrategicActionDirective {
  id: string;
  executiveDecisionIdRef: string;
  strategicObjectiveRef: string;
  accountableUserIdRef: string;
  responsibleDepartmentIdRef: string;
  originatingWorkflowIdRef?: string;
  expectedMilestone: string;
  expectedOutcome: string;
  kpiIndicatorIdRefs: string[];
  riskIdRefs: string[];
  dependencies: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'AT_RISK';
}

export enum DecisionImpactLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface DecisionImpactAssessment {
  id: string;
  decisionIdRef: string;
  dimensions: {
    academic: DecisionImpactLevel;
    studentSuccess: DecisionImpactLevel;
    research: DecisionImpactLevel;
    financial: DecisionImpactLevel;
    operational: DecisionImpactLevel;
    workforce: DecisionImpactLevel;
    technology: DecisionImpactLevel;
    cybersecurity: DecisionImpactLevel;
    privacy: DecisionImpactLevel;
    safety: DecisionImpactLevel;
    regulatory: DecisionImpactLevel;
    reputation: DecisionImpactLevel;
    international: DecisionImpactLevel;
    community: DecisionImpactLevel;
  };
  overallClassification: DecisionImpactLevel;
  basis: string;
}

export interface DecisionEffectivenessObservation {
  id: string;
  decisionIdRef: string;
  expectedOutcome: string;
  observedOutcomeReference?: string;
  variance: number;
  effectivenessRating: number; // 0-100
  unintendedConsequence?: string;
  riskChange?: string;
  correctiveRecommendation?: string;
  reviewStatus: 'PENDING' | 'COMPLETED';
}

export interface DecisionRisk {
  id: string;
  decisionIdRef: string;
  score: number;
  classification: DecisionImpactLevel;
  factors: {
    strategic: number;
    financial: number;
    operational: number;
    regulatory: number;
    cyber: number;
    privacy: number;
    stakeholder: number;
    reversibility: number;
    complexity: number;
  };
}

export interface DecisionException {
  id: string;
  decisionIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef: string;
  reason: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface DecisionSimulationRun {
  id: string;
  scenarioId: string;
  runTimestamp: string;
  actorUserIdRef: string;
  results: any;
  isSimulation: true;
}

export interface DecisionDiagnosticFinding {
  id: string;
  decisionIdRef?: string;
  severity: DecisionDiagnosticSeverity;
  category: string;
  message: string;
  timestamp: string;
}

export enum DecisionDiagnosticSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export interface DecisionGovernanceAuditEvent {
  id: string;
  tenantId: string;
  campusId: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  metadata: any;
}
