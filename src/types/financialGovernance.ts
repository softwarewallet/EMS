export type FinancialStrategyStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'UNDER_REVIEW' 
  | 'SUPERSEDED' 
  | 'ARCHIVED';

export type BudgetCyclePhase = 
  | 'PREPARATION' 
  | 'SUBMISSION' 
  | 'REVIEW' 
  | 'APPROVAL' 
  | 'ACTIVE' 
  | 'MID_YEAR_ADJUSTMENT' 
  | 'CLOSING' 
  | 'CLOSED';

export type BudgetRequestStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'WITHDRAWN' 
  | 'CLOSED';

export type FinancialRiskLifecycle = 
  | 'IDENTIFIED' 
  | 'ASSESSED' 
  | 'MITIGATION_PLANNED' 
  | 'MITIGATING' 
  | 'MONITORED' 
  | 'CLOSED';

export type FinancialScenarioType = 
  | 'REVENUE_DECLINE' 
  | 'EXPENDITURE_INCREASE' 
  | 'FUNDING_REDUCTION' 
  | 'ENROLLMENT_SHOCK' 
  | 'WORKFORCE_COST_SPIKE' 
  | 'CAPEX_OVERRUN' 
  | 'INFLATION_SURGE' 
  | 'GRANT_SHORTFALL' 
  | 'LIQUIDITY_STRESS' 
  | 'EMERGENCY_EXPENDITURE' 
  | 'COST_OPTIMIZATION';

export interface FinancialStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  planningHorizonYears: number;
  strategicAlignmentRefs: string[];
  financialObjectives: string[];
  sustainabilityObjectives: string[];
  assumptionsJson: string;
  financialPriorities: string[];
  ownerId: string;
  reviewCycleMonths: number;
  status: FinancialStrategyStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface FinancialPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyId: string;
  title: string;
  planningHorizonYears: number;
  strategicObjectiveRefs: string[];
  revenueAssumptionsJson: string;
  expenditureAssumptionsJson: string;
  capitalRequirementRefs: string[];
  workforceCostRefs: string[];
  researchFundingRefs: string[];
  resilienceReserveAmountRef?: number;
  riskRefs: string[];
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface FinancialScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  scenarioType: FinancialScenarioType;
  parametersJson: string;
  simulatedBudgetImpact: number;
  simulatedVariancePercent: number;
  simulatedLiquidityImpact: number;
  simulatedRevenueGap: number;
  simulatedCostGap: number;
  simulatedRiskExposureScore: number;
  simulatedResilienceRating: 'CRITICAL' | 'VULNERABLE' | 'MODERATE' | 'RESILIENT';
  isSandbox: true;
  createdBy: string;
  createdAt: string;
}

export interface BudgetFramework {
  id: string;
  tenantId: string;
  campusScope: string;
  name: string;
  fiscalPeriod: string;
  planningMethodology: 'ZERO_BASED' | 'INCREMENTAL' | 'ACTIVITY_BASED' | 'PERFORMANCE_BASED';
  allocationPrinciples: string[];
  approvalHierarchyJson: string;
  budgetControlsJson: string;
  varianceThresholdPercent: number;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BudgetCycle {
  id: string;
  tenantId: string;
  campusScope: string;
  frameworkId: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  phase: BudgetCyclePhase;
  ownerId: string;
  status: 'DRAFT' | 'OPEN' | 'ACTIVE' | 'LOCKED' | 'CLOSED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BudgetEnvelope {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleId: string;
  organizationIdRef: string;
  departmentIdRef?: string;
  costCenterIdRef?: string;
  fundingSourceIdRef?: string;
  approvedEnvelopeAmountRef: number;
  allocationAuthorityId: string;
  restrictionsJson?: string;
  status: 'PROPOSED' | 'APPROVED' | 'LOCKED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BudgetAllocation {
  id: string;
  tenantId: string;
  campusScope: string;
  envelopeId: string;
  organizationalScope: string;
  allocationPurpose: string;
  amountRef: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  createdBy: string;
  createdAt: string;
}

export interface BudgetRequest {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleId: string;
  requesterId: string;
  costCenterIdRef: string;
  fundingSourceIdRef?: string;
  purpose: string;
  requestedAmountRef: number;
  strategicAlignmentRef?: string;
  evidenceRef?: string;
  status: BudgetRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BudgetRevision {
  id: string;
  tenantId: string;
  campusScope: string;
  allocationId: string;
  originalAmountRef: number;
  proposedAmountRef: number;
  deltaAmountRef: number;
  reason: string;
  evidenceRef?: string;
  requesterId: string;
  approverId?: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  effectiveDate?: string;
  createdBy: string;
  createdAt: string;
}

export interface BudgetTransfer {
  id: string;
  tenantId: string;
  campusScope: string;
  sourceEnvelopeId: string;
  destinationEnvelopeId: string;
  transferAmountRef: number;
  reason: string;
  requesterId: string;
  approverId?: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface CostCenterGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  costCenterIdRef: string;
  costCenterCode: string;
  name: string;
  ownerId: string;
  departmentIdRef: string;
  strategicClassification: 'CORE_ACADEMIC' | 'RESEARCH' | 'ADMINISTRATIVE' | 'COMMERCIAL' | 'SUPPORT';
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  approvalAuthorityLevel: number;
  reportingScope: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CostObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  costCenterGovernanceId: string;
  costCategory: string;
  observationPeriod: string;
  sourceRef: string;
  varianceAmountRef: number;
  variancePercent: number;
  isAdverse: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CostOptimizationPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  costCenterGovernanceId: string;
  title: string;
  targetSavingsRef: number;
  actionItemsJson: string;
  ownerId: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'ACHIEVED' | 'ABANDONED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface RevenueGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  ownerId: string;
  overallTargetRef: number;
  concentrationRiskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  controlRequirementsJson: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface RevenueStream {
  id: string;
  tenantId: string;
  campusScope: string;
  revenueGovernanceId: string;
  category: 'TUITION' | 'GRANTS' | 'RESEARCH_COMMERCIAL' | 'DONATIONS' | 'AUXILIARY' | 'OTHER';
  name: string;
  ownerId: string;
  strategicImportance: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
  dependencyDescription: string;
  targetAmountRef: number;
  createdBy: string;
  createdAt: string;
}

export interface RevenueForecast {
  id: string;
  tenantId: string;
  campusScope: string;
  revenueStreamId: string;
  sourceRef: string;
  forecastPeriod: string;
  methodology: string;
  assumptionsJson: string;
  forecastValueRef: number;
  confidencePercent: number;
  reviewerId: string;
  dataType: 'ACTUAL' | 'FORECAST' | 'SCENARIO';
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdBy: string;
  createdAt: string;
}

export interface FundingSourceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  fundingType: 'GRANT' | 'GOVERNMENT' | 'INSTITUTIONAL' | 'DONATION' | 'RESEARCH' | 'RESTRICTED';
  externalIdRef: string;
  title: string;
  allocatedAmountRef: number;
  remainingAmountRef: number;
  expiryDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DEPLETED';
  createdBy: string;
  createdAt: string;
}

export interface CashFlowObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  observationPeriod: string;
  sourceRef: string;
  inflowRefAmount: number;
  outflowRefAmount: number;
  netCashFlowRefAmount: number;
  liquidityImplication: string;
  governanceStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  createdBy: string;
  createdAt: string;
}

export interface LiquidityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  observationPeriod: string;
  sourceRef: string;
  currentRatioRef: number;
  quickRatioRef: number;
  daysCashOnHand: number;
  thresholdDaysMin: number;
  riskStatus: 'ADEQUATE' | 'WATCH' | 'DEFICIT';
  mitigationNotes?: string;
  createdBy: string;
  createdAt: string;
}

export interface TreasuryGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  liquidityControlsJson: string;
  authorizedBankRelationshipsJson: string;
  treasuryPolicyRefs: string[];
  concentrationRiskLimitsJson: string;
  approvalBoundariesJson: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
}

export interface CapitalPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  planningHorizonYears: number;
  totalBudgetEnvelopeRef: number;
  strategicAlignmentRefs: string[];
  resilienceReserveRef: number;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'CLOSED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CapitalProjectGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  capitalPlanId: string;
  projectIdRef: string;
  projectName: string;
  approvedCapitalAmountRef: number;
  fundingSourceRef: string;
  capitalPriority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  benefitTargetJson: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lifecycleState: 'PROPOSED' | 'APPROVED' | 'IN_EXECUTION' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

export interface FinancialForecast {
  id: string;
  tenantId: string;
  campusScope: string;
  forecastCategory: 'REVENUE' | 'EXPENDITURE' | 'CASH' | 'BUDGET' | 'CAPITAL';
  forecastPeriod: string;
  assumptionsJson: string;
  evidenceRef: string;
  forecastValueRef: number;
  confidenceScore: number;
  createdBy: string;
  createdAt: string;
}

export interface FinancialVarianceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  budgetRef: string;
  actualRef: string;
  forecastRef: string;
  varianceAmountRef: number;
  variancePercent: number;
  thresholdPercent: number;
  explanation: string;
  correctiveActionPlan?: string;
  createdBy: string;
  createdAt: string;
}

export interface FinancialControl {
  id: string;
  tenantId: string;
  campusScope: string;
  code: string;
  title: string;
  category: 
    | 'BUDGET_AUTHORIZATION' 
    | 'EXPENDITURE_AUTHORIZATION' 
    | 'REVENUE_RECOGNITION' 
    | 'SEGREGATION_OF_DUTIES' 
    | 'PROCUREMENT_LINKAGE' 
    | 'GRANT_CONTROLS' 
    | 'CAPITAL_APPROVAL' 
    | 'TREASURY_CONTROLS' 
    | 'REPORTING_INTEGRITY';
  description: string;
  controlOwnerId: string;
  testingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  status: 'EFFECTIVE' | 'NEEDS_REMEDIATION' | 'FAILED';
  createdBy: string;
  createdAt: string;
}

export interface FinancialControlTest {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  testerId: string;
  testDate: string;
  sampleSize: number;
  passCount: number;
  failCount: number;
  resultStatus: 'PASSED' | 'FAILED';
  findings?: string;
  createdBy: string;
  createdAt: string;
}

export interface FinancialControlException {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  requesterId: string;
  reason: string;
  scope: string;
  compensatingControl: string;
  approverId?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdBy: string;
  createdAt: string;
}

export interface FinancialRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  category: 
    | 'LIQUIDITY' 
    | 'REVENUE' 
    | 'EXPENDITURE' 
    | 'FUNDING' 
    | 'GRANT' 
    | 'CAPITAL' 
    | 'PROCUREMENT' 
    | 'FRAUD' 
    | 'CONCENTRATION' 
    | 'COMPLIANCE' 
    | 'OPERATIONAL' 
    | 'RESILIENCE';
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE';
  riskScore: number;
  mitigationPlan?: string;
  ownerId: string;
  lifecycle: FinancialRiskLifecycle;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface FinancialResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentDate: string;
  liquidityResilienceScore: number;
  revenueDiversificationScore: number;
  fundingResilienceScore: number;
  costFlexibilityScore: number;
  emergencyReservesRefAmount: number;
  criticalExpenditureExposureScore: number;
  recoveryCapabilityRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  overallResilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  assessorId: string;
  createdBy: string;
  createdAt: string;
}

export interface FinancialApproval {
  id: string;
  tenantId: string;
  campusScope: string;
  entityType: 'BUDGET_REQUEST' | 'BUDGET_REVISION' | 'BUDGET_TRANSFER' | 'CAPITAL_PROJECT' | 'EXCEPTION' | 'STRATEGY' | 'DECISION';
  entityId: string;
  proposerId: string;
  reviewerId?: string;
  approverId: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  justification?: string;
  idempotencyKey: string;
  timestamp: string;
}

export interface FinancialDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  description: string;
  financialImpactRefAmount: number;
  requesterId: string;
  approverId: string;
  decisionStatus: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  decisionDate: string;
  createdBy: string;
  createdAt: string;
}

export interface FinancialAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousState?: any;
  resultingState?: any;
  justification?: string;
  correlationId?: string;
}
