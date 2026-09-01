// EMS Phase 7.42 — Institutional Enterprise Portfolio, Program & Transformation Governance Engine Types

export type PortfolioStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'ARCHIVED';

export type ProgramStatus = 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export type InitiativeStatus = 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export type MilestoneStatus = 'PLANNED' | 'ON_TRACK' | 'DELAYED' | 'ACHIEVED' | 'MISSED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type GateType = 'GATE_0' | 'GATE_1' | 'GATE_2' | 'GATE_3' | 'GATE_4' | 'GATE_5' | 'GATE_6';

export type GateStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL';

export type GateDecisionType = 'APPROVED' | 'REJECTED' | 'CONDITIONAL_APPROVAL';

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export type DependencyLinkStatus = 'ACTIVE' | 'RESOLVED' | 'BLOCKED';

export type DependencyIssueType = 'CIRCULAR' | 'TIMELINE_VIOLATION' | 'CRITICAL_PATH_DELAY';

export type BenefitType = 'FINANCIAL' | 'ACADEMIC' | 'OPERATIONAL';

export type BenefitPlanStatus = 'ACTIVE' | 'SUSPENDED' | 'ACHIEVED' | 'FAILED';

export type InvestmentDecisionType = 'ALLOCATION' | 'RELEASE' | 'ADJUSTMENT' | 'FREEZE';

export type InvestmentDecisionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AssuranceReviewStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type FindingType = 'COMPLIANCE_GAP' | 'RISK_EXPOSURE' | 'STRATEGIC_MISALIGNMENT';

export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type InterventionType = 'RESET' | 'BUDGET_FREEZE' | 'SCOPE_TRIM' | 'ACCELERATION' | 'TERMINATION';

export type InterventionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';

export type DataQualityIssueType =
  | 'MISSING_STRATEGIC_LINK'
  | 'MISMATCHED_MILESTONE_DATES'
  | 'ORPHAN_PROGRAM'
  | 'UNAUTHORIZED_GATE_TRANSITION';

export interface HealthScoreFactors {
  alignment: number;
  delivery: number;
  dependency: number;
  risk: number;
}

export interface EnterprisePortfolio {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  fiscalYear: string;
  status: PortfolioStatus;
  healthScore: number;
  healthScoreFactors: HealthScoreFactors;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface EnterprisePortfolioVersion {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  versionNumber: number;
  snapshotData: string; // Serialized JSON
  createdBy: string;
  createdAt: string;
  changeSummary: string;
}

export interface EnterpriseProgram {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  name: string;
  description: string;
  ownerId: string; // references authoritative staffId
  status: ProgramStatus;
  budget: number;
  healthScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicInitiative {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  programId: string;
  name: string;
  description: string;
  leadStaffId: string; // references authoritative staffId
  strategicObjectiveId: string; // references Phase 7.29 objective
  associatedRiskId: string; // references Phase 7.31 risk
  financialCode: string; // references finance code
  status: InitiativeStatus;
  budget: number;
  healthScore: number;
  currentGate: GateType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceMilestone {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeId: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  ownerId: string; // references authoritative staffId
  status: MilestoneStatus;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  evidenceDocId?: string; // references Phase 7.27 docId
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
}

export interface GovernanceGate {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeId: string;
  gateType: GateType;
  status: GateStatus;
  submittedBy?: string;
  submittedAt?: string;
  checklist: ChecklistItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GateDecision {
  id: string;
  tenantId: string;
  campusId: string;
  gateId: string;
  decision: GateDecisionType;
  rationale: string;
  conditions?: string;
  approver1Id: string;
  approver1SignedAt: string;
  approver2Id: string;
  approver2SignedAt: string;
  status: 'PENDING' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
}

export interface DependencyLink {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  sourceInitiativeId: string;
  targetInitiativeId: string;
  dependencyType: DependencyType;
  lagDays: number;
  isCriticalPath: boolean;
  status: DependencyLinkStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyHealthIssue {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  dependencyLinkId: string;
  issueType: DependencyIssueType;
  severity: FindingSeverity;
  description: string;
  detectedAt: string;
  status: 'OPEN' | 'RESOLVED';
  resolutionSummary?: string;
}

export interface BenefitRealizationPlan {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeId: string;
  name: string;
  benefitType: BenefitType;
  targetValue: number;
  targetUnit: string;
  baselineValue: number;
  targetDate: string;
  strategicObjectiveId: string; // references Phase 7.29 objective
  status: BenefitPlanStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitMeasurement {
  id: string;
  tenantId: string;
  campusId: string;
  benefitPlanId: string;
  measuredValue: number;
  measuredDate: string;
  measuredBy: string;
  evidenceDocId?: string; // references Phase 7.27 docId
  variance: number;
  status: 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface PortfolioInvestment {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  programId?: string;
  initiativeId?: string;
  amount: number;
  fundingSource: string;
  financialCode: string;
  allocatedAt: string;
  createdBy: string;
  createdAt: string;
}

export interface InvestmentDecision {
  id: string;
  tenantId: string;
  campusId: string;
  investmentId: string;
  decisionType: InvestmentDecisionType;
  status: InvestmentDecisionStatus;
  approver1Id: string;
  approver1SignedAt: string;
  approver2Id: string;
  approver2SignedAt: string;
  rationale: string;
  createdBy: string;
  createdAt: string;
}

export interface TransformationAssuranceReview {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioId: string;
  reviewDate: string;
  leadReviewerId: string; // references authoritative staffId
  scopeSummary: string;
  deliveryComplianceScore: number;
  strategicFitScore: number;
  riskPostureScore: number;
  overallRating: 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY';
  status: AssuranceReviewStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssuranceFinding {
  id: string;
  tenantId: string;
  campusId: string;
  reviewId: string;
  title: string;
  description: string;
  findingType: FindingType;
  severity: FindingSeverity;
  correctiveActionPlan: string;
  targetClosureDate: string;
  actualClosureDate?: string;
  status: 'OPEN' | 'CLOSED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiativeIntervention {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeId: string;
  interventionType: InterventionType;
  triggerReason: string;
  status: InterventionStatus;
  approver1Id: string;
  approver1SignedAt: string;
  approver2Id: string;
  approver2SignedAt: string;
  justification: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatIfTransformationScenario {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  basePortfolioId: string;
  fundingCutPercentage: number;
  excludeInitiativeIds: string[];
  timelineShiftDays: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioSimulationResult {
  id: string;
  tenantId: string;
  campusId: string;
  scenarioId: string;
  simulatedPortfolioComposition: string[]; // array of initiative IDs
  simulatedHealthScore: number;
  simulatedAlignmentScore: number;
  simulatedDeliveryScore: number;
  simulatedRiskScore: number;
  simulatedDependencyScore: number;
  impactAnalysis: string;
  certifiedBy: string;
  certifiedAt: string;
  createdBy: string;
  createdAt: string;
}

export interface TransformationDataQualityIssue {
  id: string;
  tenantId: string;
  campusId: string;
  issueType: DataQualityIssueType;
  targetEntityCollection: string;
  targetEntityId: string;
  severity: FindingSeverity;
  description: string;
  detectedAt: string;
  status: 'OPEN' | 'RESOLVED';
  remediationActionTaken?: string;
  resolvedAt?: string;
}

export interface TransformationGovernanceAudit {
  id: string;
  tenantId: string;
  campusId: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  action: string; // e.g. 'GATE_TRANSITION', 'DECISION_FOUR_EYES', etc.
  entityCollection: string;
  entityId: string;
  previousState?: string; // Serialized JSON
  newState?: string; // Serialized JSON
  timestamp: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  rationale?: string;
}
