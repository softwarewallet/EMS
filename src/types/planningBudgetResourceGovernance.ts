export enum PlanningLifecycleState {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  DEPARTMENT_INPUT = 'DEPARTMENT_INPUT',
  CONSOLIDATION = 'CONSOLIDATION',
  REVIEW = 'REVIEW',
  EXECUTIVE_REVIEW = 'EXECUTIVE_REVIEW',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  SUPERSEDED = 'SUPERSEDED',
  CANCELLED = 'CANCELLED'
}

export enum InitiativeLifecycleState {
  PROPOSED = 'PROPOSED',
  SCREENING = 'SCREENING',
  BUSINESS_CASE = 'BUSINESS_CASE',
  PRIORITIZATION = 'PRIORITIZATION',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  AT_RISK = 'AT_RISK',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SUPERSEDED = 'SUPERSEDED'
}

export enum GovImpactLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface PlanningCycle {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  type: 'ANNUAL' | 'MULTI_YEAR' | 'STRATEGIC' | 'ROLLING_FORECAST';
  state: PlanningLifecycleState;
  startDate: string;
  endDate: string;
  ownerUserIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicPriority {
  id: string;
  tenantId: string;
  planningCycleIdRef: string;
  name: string;
  description: string;
  weight: number;
  strategicObjectiveIdRef: string; // Reference to Phase 9.5 Strategy
  kpiIndicatorIdRefs: string[];
}

export interface InstitutionalInitiative {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioIdRef: string;
  name: string;
  description: string;
  state: InitiativeLifecycleState;
  priorityLevel: GovImpactLevel;
  strategicObjectiveIdRefs: string[];
  departmentIdRef: string;
  accountableOwnerUserIdRef: string;
  budgetRecordIdRef?: string; // Reference to external ERP/Finance
  riskIdRefs: string[];
  workflowIdRef?: string;
  decisionIdRef?: string;
  expectedOutcomes: string[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InitiativePortfolio {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  description: string;
  managerUserIdRef: string;
  initiativeIdRefs: string[];
  totalBudgetCapacity?: number;
  totalWorkforceCapacity?: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface ResourceRequest {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeIdRef: string;
  type: 'FINANCIAL' | 'WORKFORCE' | 'TECHNOLOGY' | 'FACILITIES' | 'RESEARCH' | 'INFRASTRUCTURE' | 'EXTERNAL_SERVICES';
  requestedAmount?: number;
  requestedCapacity?: string;
  justification: string;
  strategicAlignment: 'ALIGNED' | 'PARTIALLY_ALIGNED' | 'UNALIGNED' | 'INSUFFICIENT_DATA';
  expectedBenefit: string;
  riskLevel: GovImpactLevel;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dependencyIdRefs: string[];
  fundingSourceIdRef?: string;
  requestingUnitIdRef: string;
  requesterUserIdRef: string;
  state: 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'ALLOCATED';
  createdAt: string;
}

export interface BudgetGovernanceRequest {
  id: string;
  tenantId: string;
  campusId: string;
  planningCycleIdRef: string;
  departmentIdRef: string;
  requestedAllocation: number;
  justification: string;
  priorities: string[];
  assumptions: string[];
  scenarios: string[];
  varianceObservationRefs: string[];
  state: PlanningLifecycleState;
  createdAt: string;
}

export interface InvestmentCase {
  id: string;
  initiativeIdRef: string;
  strategicAlignment: number; // 0-100
  institutionalBenefit: number;
  financialExposure: number;
  implementationComplexity: number;
  riskScore: number;
  regulatoryImpact: number;
  technologyDependency: number;
  workforceDependency: number;
  reversibility: number;
  timeToValue: number;
  resilienceContribution: number;
  totalInvestmentScore: number;
  authorUserIdRef: string;
  createdAt: string;
}

export interface AllocationDecision {
  id: string;
  tenantId: string;
  campusId: string;
  allocationProposalIdRef: string;
  decisionIdRef: string; // Ref to Phase 9.5
  strategicPriorityRefs: string[];
  resourceRequestIdRefs: string[];
  riskIdRefs: string[];
  supportingEvidenceRefs: string[];
  proposerUserIdRef: string;
  approverUserIdRef: string;
  timestamp: string;
  rationale: string;
  conditions: string[];
  provenanceHash: string;
  previousProvenanceHash: string;
}

export interface CapacityObservation {
  id: string;
  tenantId: string;
  campusId: string;
  type: 'FINANCIAL' | 'WORKFORCE' | 'TECHNOLOGY' | 'FACILITIES' | 'RESEARCH' | 'OPERATIONAL';
  plannedCapacityRef: string;
  availableCapacityObs: number;
  committedCapacityObs: number;
  utilizationObs: number;
  capacityGap: number;
  riskLevel: GovImpactLevel;
  timestamp: string;
}

export interface BudgetVarianceObservation {
  id: string;
  tenantId: string;
  campusId: string;
  budgetRecordIdRef: string;
  actualObservationIdRef: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  toleranceThreshold: number;
  status: 'WITHIN_TOLERANCE' | 'WARNING' | 'BREACH' | 'INSUFFICIENT_DATA';
  timestamp: string;
}

export interface PlanningException {
  id: string;
  tenantId: string;
  type: 'BUDGET_THRESHOLD' | 'PRIORITY' | 'EMERGENCY_ALLOCATION' | 'DEADLINE_EXTENSION' | 'CAPACITY' | 'RISK_ACCEPTANCE' | 'STRATEGIC_DEVIATION';
  reason: string;
  requesterUserIdRef: string;
  approverUserIdRef: string;
  compensatingControlRef: string;
  effectiveDate: string;
  expiryDate: string;
  scope: string;
  auditIdRef: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface PortfolioRisk {
  id: string;
  portfolioIdRef: string;
  score: number;
  classification: GovImpactLevel;
  factors: {
    fundingConcentration: number;
    dependencyConcentration: number;
    resourceScarcity: number;
    strategicMisalignment: number;
    scheduleExposure: number;
    complexity: number;
    vendorDependency: number;
    technologyDependency: number;
    regulatoryExposure: number;
    benefitUncertainty: number;
  };
}

export interface PlanningDiagnostic {
  id: string;
  tenantId: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: string;
  message: string;
  entityIdRef?: string;
  entityType?: string;
  timestamp: string;
}

export interface PlanningAuditEvent {
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

export interface PlanningPeriod {
  id: string;
  tenantId: string;
  campusId: string;
  planningCycleIdRef: string;
  name: string;
  periodType: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'SEMESTER_1' | 'SEMESTER_2' | 'ANNUAL';
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
}

export interface FundingScenario {
  id: string;
  tenantId: string;
  planningCycleIdRef: string;
  name: string;
  description: string;
  budgetDeltaPercentage: number;
  assumptions: string[];
  projectedOutcome: string;
  isBaseline: boolean;
}

export interface AllocationProposal {
  id: string;
  tenantId: string;
  campusId: string;
  planningCycleIdRef: string;
  title: string;
  proposerUserIdRef: string;
  totalRequestedAmount: number;
  resourceRequestIds: string[];
  strategicPriorityIds: string[];
  justification: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface InitiativePrioritization {
  id: string;
  tenantId: string;
  initiativeIdRef: string;
  strategicAlignmentScore: number;
  institutionalImpactScore: number;
  urgencyScore: number;
  riskReductionScore: number;
  feasibilityScore: number;
  totalPriorityScore: number;
  rank: number;
  calibrationRequired: boolean;
  evaluatedAt: string;
}

export interface PortfolioCapacity {
  id: string;
  tenantId: string;
  campusId: string;
  portfolioIdRef: string;
  financialCapacityTotal: number;
  financialCapacityCommitted: number;
  workforceHeadcountTotal: number;
  workforceHeadcountCommitted: number;
  technologyCapacityUnits: number;
  facilitiesCapacityUnits: number;
  evaluatedAt: string;
}

export interface InvestmentRisk {
  id: string;
  initiativeIdRef: string;
  riskCategory: 'FINANCIAL' | 'OPERATIONAL' | 'REPUTATIONAL' | 'REGULATORY' | 'TECHNOLOGY';
  severity: GovImpactLevel;
  likelihood: GovImpactLevel;
  mitigationStrategy: string;
  residualRiskScore: number;
}

export interface InitiativeDependency {
  id: string;
  tenantId: string;
  sourceInitiativeIdRef: string;
  targetInitiativeIdRef: string;
  dependencyType: 'FINANCIAL' | 'TECHNICAL' | 'RESOURCE' | 'SEQUENTIAL' | 'REGULATORY';
  criticality: GovImpactLevel;
  status: 'SATISFIED' | 'PENDING' | 'BLOCKED' | 'AT_RISK';
}

export interface ExecutiveAllocationApproval {
  id: string;
  tenantId: string;
  allocationDecisionIdRef: string;
  approverUserIdRef: string;
  approvalRole: string;
  approvedAmount: number;
  approvalTimestamp: string;
  conditions: string[];
  fourEyesVerified: boolean;
  signatureProvenance: string;
}

export interface PlanningAssumption {
  id: string;
  tenantId: string;
  planningCycleIdRef: string;
  category: 'REVENUE' | 'ENROLLMENT' | 'INFLATION' | 'REGULATORY' | 'CAPACITY';
  description: string;
  confidenceLevel: number;
  impactIfViolated: GovImpactLevel;
  validatedAt: string;
}

export interface PortfolioReview {
  id: string;
  tenantId: string;
  portfolioIdRef: string;
  reviewDate: string;
  reviewerUserIdRefs: string[];
  overallHealth: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL';
  keyFindings: string[];
  actionItemIds: string[];
  nextReviewDate: string;
}

export interface ResourceOptimizationScenario {
  id: string;
  tenantId: string;
  title: string;
  constrainedResourceType: 'FINANCIAL' | 'WORKFORCE' | 'FACILITIES' | 'TECHNOLOGY';
  constraintReductionPercentage: number;
  reallocatedInitiativeIds: string[];
  expectedEfficiencyGain: number;
}

export interface PlanningSimulationResult {
  simulationId: string;
  scenario: string;
  timestamp: string;
  banner: string;
  parameters: Record<string, any>;
  results: {
    impact: string;
    resourcePressure: number;
    riskShift: number;
    affectedInitiativesCount?: number;
    estimatedBudgetDelta?: number;
  };
}
