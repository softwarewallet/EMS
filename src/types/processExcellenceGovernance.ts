export enum ProcessLifecycleState {
  DRAFT = 'DRAFT',
  REGISTERED = 'REGISTERED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  UNDER_IMPROVEMENT = 'UNDER_IMPROVEMENT',
  SUSPENDED = 'SUSPENDED',
  RETIRED = 'RETIRED',
  SUPERSEDED = 'SUPERSEDED'
}

export enum ProcessImprovementLifecycleState {
  IDEA = 'IDEA',
  SCREENING = 'SCREENING',
  ANALYSIS = 'ANALYSIS',
  BUSINESS_CASE = 'BUSINESS_CASE',
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  APPROVED = 'APPROVED',
  IMPLEMENTATION = 'IMPLEMENTATION',
  VALIDATION = 'VALIDATION',
  BENEFITS_REVIEW = 'BENEFITS_REVIEW',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
  SUPERSEDED = 'SUPERSEDED'
}

export enum ProcessMaturityLevel {
  INITIAL = 'INITIAL',
  DEVELOPING = 'DEVELOPING',
  DEFINED = 'DEFINED',
  MANAGED = 'MANAGED',
  OPTIMIZED = 'OPTIMIZED'
}

export enum ProcessGovSeverity {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ProcessLandscapeDefinition {
  id: string;
  tenantId: string;
  campusId: string;
  processName: string;
  processFamily: string;
  processOwnerUserIdRef: string;
  departmentIdRef: string;
  businessUnitIdRef?: string;
  state: ProcessLifecycleState;
  upstreamProcessIds: string[];
  downstreamProcessIds: string[];
  strategicObjectiveIdRefs: string[];
  riskIdRefs: string[];
  controlIdRefs: string[];
  workflowIdRef?: string;
  serviceIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessOwnershipRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  processOwnerUserIdRef: string;
  accountableExecutiveUserIdRef: string;
  processStewardUserIdRef: string;
  departmentIdRef: string;
  ownershipEffectiveDate: string;
  ownershipExpiryDate: string;
  continuityReferenceId?: string;
}

export interface ProcessMaturityAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  governanceScore: number;
  documentationScore: number;
  standardizationScore: number;
  measurementScore: number;
  automationReadinessScore: number;
  controlEffectivenessScore: number;
  riskManagementScore: number;
  stakeholderOrientationScore: number;
  continuousImprovementScore: number;
  resilienceScore: number;
  compositeScore: number;
  maturityLevel: ProcessMaturityLevel;
  assessedByUserIdRef: string;
  assessedAt: string;
}

export interface ProcessPerformanceObservation {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  cycleTimeHours: number;
  throughputRate: number;
  backlogCount: number;
  firstPassYieldPercentage: number;
  reworkPercentage: number;
  errorRatePercentage: number;
  slaAdherencePercentage: number;
  abandonmentRatePercentage: number;
  status: 'HEALTHY' | 'WATCH' | 'DEGRADING' | 'BREACHED' | 'INSUFFICIENT_DATA';
  observationTimestamp: string;
}

export interface ProcessBottleneckObservation {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  bottleneckType: 'QUEUE_ACCUMULATION' | 'EXCESSIVE_CYCLE_TIME' | 'APPROVAL_DELAY' | 'DEPENDENCY_DELAY' | 'CAPACITY_CONSTRAINT' | 'SYSTEM_DEPENDENCY' | 'REWORK_CONCENTRATION';
  severity: ProcessGovSeverity;
  queueDepth: number;
  delayHours: number;
  description: string;
  detectedAt: string;
}

export interface RootCauseAnalysisRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  bottleneckIdRef?: string;
  failureObservationIdRef?: string;
  methodology: '5_WHY' | 'FISHBONE' | 'PARETO' | 'FAULT_TREE' | 'CONTRIBUTING_FACTOR_ANALYSIS';
  findings: string;
  evidenceReferenceIds: string[];
  state: 'PROPOSED' | 'UNDER_REVIEW' | 'VALIDATED' | 'REJECTED' | 'SUPERSEDED';
  authorUserIdRef: string;
  createdAt: string;
}

export interface ImprovementOpportunityRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  title: string;
  description: string;
  impactScore: number;
  performanceGapScore: number;
  riskReductionScore: number;
  strategicAlignmentScore: number;
  feasibilityScore: number;
  compositeScore: number;
  classification: ProcessGovSeverity;
  calibrationRequired: boolean;
  identifiedByUserIdRef: string;
  createdAt: string;
}

export interface ImprovementInitiativeRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  opportunityIdRef: string;
  title: string;
  state: ProcessImprovementLifecycleState;
  ownerUserIdRef: string;
  strategicObjectiveIdRef?: string;
  expectedBenefits: string[];
  workflowIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveActionRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  rootCauseIdRef: string;
  title: string;
  description: string;
  ownerUserIdRef: string;
  dueDate: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED' | 'OVERDUE' | 'REJECTED';
  evidenceReferenceIds: string[];
  verificationUserIdRef?: string;
  createdAt: string;
}

export interface PreventiveActionRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  riskIdRef: string;
  title: string;
  description: string;
  ownerUserIdRef: string;
  dueDate: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED' | 'OVERDUE' | 'REJECTED';
  evidenceReferenceIds: string[];
  verificationUserIdRef?: string;
  createdAt: string;
}

export interface ImprovementExperimentRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  hypothesis: string;
  baselineObservationIdRef: string;
  targetMetric: string;
  scope: string;
  durationDays: number;
  ownerUserIdRef: string;
  result: 'NOT_STARTED' | 'RUNNING' | 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED' | 'INCONCLUSIVE';
  evidenceSummary: string;
  createdAt: string;
}

export interface BenefitRealizationRecord {
  id: string;
  tenantId: string;
  campusId: string;
  initiativeIdRef: string;
  benefitDimension: 'CYCLE_TIME_REDUCTION' | 'COST_AVOIDANCE' | 'QUALITY_IMPROVEMENT' | 'RISK_REDUCTION' | 'CAPACITY_IMPROVEMENT' | 'STAKEHOLDER_SATISFACTION';
  plannedValue: number;
  actualObservedValue: number;
  status: 'PLANNED' | 'TRACKING' | 'PARTIALLY_REALIZED' | 'REALIZED' | 'NOT_REALIZED' | 'INSUFFICIENT_DATA';
  evaluationTimestamp: string;
}

export interface ProcessExceptionRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  reason: string;
  requesterUserIdRef: string;
  approverUserIdRef: string;
  scope: string;
  effectiveDate: string;
  expiryDate: string;
  compensatingControlRef: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface ProcessRiskRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  impactScore: number;
  likelihoodScore: number;
  controlWeaknessScore: number;
  resilienceExposureScore: number;
  compositeRiskScore: number;
  classification: ProcessGovSeverity;
}

export interface ProcessDependencyRecord {
  id: string;
  tenantId: string;
  sourceProcessIdRef: string;
  targetProcessIdRef: string;
  dependencyType: 'SEQUENTIAL' | 'DATA_DEPENDENT' | 'RESOURCE_SHARED' | 'HIERARCHICAL';
  criticality: ProcessGovSeverity;
}

export interface ProcessBenchmarkRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  sourceOrganization: string;
  observationPeriod: string;
  metricName: string;
  metricValue: number;
  comparability: 'DIRECTLY_COMPARABLE' | 'PARTIALLY_COMPARABLE' | 'NOT_COMPARABLE' | 'INSUFFICIENT_DATA';
  recordedAt: string;
}

export interface ProcessReviewRecord {
  id: string;
  tenantId: string;
  campusId: string;
  processIdRef: string;
  cadence: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL' | 'EVENT_TRIGGERED';
  scheduledDate: string;
  status: 'SCHEDULED' | 'OPEN' | 'UNDER_REVIEW' | 'COMPLETED' | 'OVERDUE';
  reviewerUserIdRefs: string[];
  findingsSummary?: string;
}

export interface ProcessSimulationResult {
  simulationId: string;
  scenario: string;
  timestamp: string;
  banner: string;
  parameters: Record<string, any>;
  results: {
    impact: string;
    throughputDeltaPercentage: number;
    cycleTimeDeltaPercentage: number;
    riskShiftScore: number;
    affectedProcessesCount: number;
  };
}

export interface ProcessDiagnosticRecord {
  id: string;
  tenantId: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: string;
  message: string;
  entityIdRef?: string;
  timestamp: string;
}

export interface ProcessAuditRecord {
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
