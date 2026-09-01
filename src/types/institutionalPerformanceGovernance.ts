export type PerformanceDimensionType =
  | 'STRATEGIC'
  | 'ACADEMIC'
  | 'STUDENT_SUCCESS'
  | 'RESEARCH'
  | 'FINANCIAL'
  | 'OPERATIONAL'
  | 'HUMAN_CAPITAL'
  | 'DIGITAL'
  | 'COMMUNITY_ENGAGEMENT'
  | 'INTERNATIONAL'
  | 'QUALITY'
  | 'SAFETY'
  | 'SUSTAINABILITY'
  | 'GOVERNANCE';

export type KpiLifecycleStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVISION'
  | 'DEPRECATED'
  | 'RETIRED';

export type MetricType =
  | 'COUNT'
  | 'RATE'
  | 'RATIO'
  | 'PERCENTAGE'
  | 'AVERAGE'
  | 'MEDIAN'
  | 'INDEX'
  | 'SCORE'
  | 'TIME_DURATION'
  | 'CURRENCY_REFERENCE'
  | 'COMPOSITE';

export type TargetDirection =
  | 'HIGHER_IS_BETTER'
  | 'LOWER_IS_BETTER'
  | 'TARGET_RANGE'
  | 'EXACT_TARGET';

export type PerformanceStatus =
  | 'EXCEEDING'
  | 'ON_TARGET'
  | 'AT_RISK'
  | 'BELOW_TARGET'
  | 'CRITICAL'
  | 'UNKNOWN';

export type TrendClassification =
  | 'IMPROVING'
  | 'STABLE'
  | 'DECLINING'
  | 'VOLATILE'
  | 'INSUFFICIENT_DATA';

export type BenchmarkVerificationStatus =
  | 'VERIFIED'
  | 'PROVISIONAL'
  | 'UNVERIFIED'
  | 'EXPIRED'
  | 'INSUFFICIENT_DATA';

export type DataQualityState =
  | 'VALID'
  | 'PARTIAL'
  | 'STALE'
  | 'CONFLICTING'
  | 'UNVERIFIED'
  | 'INSUFFICIENT_DATA';

export type PerformanceRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'UNKNOWN';

export type PerformanceActionLifecycle =
  | 'PROPOSED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'CANCELLED';

export type ScenarioType901 =
  | 'TARGET_REDUCTION'
  | 'TARGET_INCREASE'
  | 'ENROLLMENT_SHOCK'
  | 'RETENTION_DECLINE'
  | 'RESEARCH_FUNDING_CHANGE'
  | 'WORKFORCE_CAPACITY_CHANGE'
  | 'OPERATING_COST_PRESSURE'
  | 'REVENUE_DECLINE'
  | 'QUALITY_SCORE_DECLINE'
  | 'CYBER_RESILIENCE_DEGRADATION'
  | 'CAMPUS_PERFORMANCE_VARIANCE'
  | 'MULTI_DIMENSION_PERFORMANCE_SHOCK';

export interface InstitutionalPerformanceStrategy {
  id: string;
  tenantId: string;
  campusId?: string;
  strategyCode: string;
  title: string;
  visionStatement: string;
  startYear: number;
  endYear: number;
  status: 'ACTIVE' | 'DRAFT' | 'RETIRED';
  createdAt: string;
}

export interface PerformanceDimension {
  id: string;
  tenantId: string;
  code: PerformanceDimensionType;
  name: string;
  description: string;
  strategyIdRef?: string;
  weightPercent: number;
  isCore: boolean;
}

export interface PerformanceObjective {
  id: string;
  tenantId: string;
  dimensionCode: PerformanceDimensionType;
  objectiveCode: string;
  title: string;
  description: string;
  ownerIdRef: string;
  targetYear: number;
  weightPercent: number;
}

export interface MetricCalculationDefinition {
  formulaReference: string;
  numeratorDescription?: string;
  denominatorDescription?: string;
  unit: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  roundingRule: 'ROUND_2_DECIMALS' | 'EXACT' | 'INTEGER';
}

export interface MetricProvenance {
  sourceSystemIdRef: string;
  sourceRecordIdRef?: string;
  sourceModuleIdRef: string;
  dataDomainIdRef: string;
  lastExtractedAt: string;
  confidenceScorePercent: number;
}

export interface PerformanceKPI {
  id: string;
  tenantId: string;
  campusId?: string;
  kpiCode: string;
  name: string;
  description: string;
  dimensionCode: PerformanceDimensionType;
  objectiveIdRef?: string;
  ownerIdRef: string;
  calculationDefinition: MetricCalculationDefinition;
  direction: TargetDirection;
  currentValue?: number;
  targetValue?: number;
  unit: string;
  frequency: string;
  status: KpiLifecycleStatus;
  provenance: MetricProvenance;
  createdAt: string;
  updatedAt: string;
}

export interface MetricDefinition {
  id: string;
  tenantId: string;
  metricCode: string;
  name: string;
  metricType: MetricType;
  calculationDefinition: MetricCalculationDefinition;
  isImmutablePublished: boolean;
  version: number;
  createdAt: string;
}

export interface MetricVersion {
  id: string;
  tenantId: string;
  metricIdRef: string;
  versionNumber: number;
  effectiveFrom: string;
  effectiveTo?: string;
  calculationDefinition: MetricCalculationDefinition;
  changedByUserIdRef: string;
  approvedByUserIdRef: string;
  changeReason: string;
}

export interface MetricObservation {
  id: string;
  tenantId: string;
  kpiIdRef: string;
  observationPeriod: string;
  observedValue?: number;
  calculatedValue?: number;
  numeratorValue?: number;
  denominatorValue?: number;
  dataQualityState: DataQualityState;
  calculationBasis: string;
  evidenceRef?: string;
  observedAt: string;
}

export interface PerformanceTarget {
  id: string;
  tenantId: string;
  kpiIdRef: string;
  periodType: 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'STRATEGIC';
  periodLabel: string;
  targetValue: number;
  approvedByUserIdRef: string;
  approvedAt: string;
  status: 'ACTIVE' | 'SUPERSEDED';
}

export interface PerformanceThresholdBand {
  minWarningValue?: number;
  maxWarningValue?: number;
  minCriticalValue?: number;
  maxCriticalValue?: number;
}

export interface PerformanceThreshold {
  id: string;
  tenantId: string;
  kpiIdRef: string;
  direction: TargetDirection;
  thresholdBands: PerformanceThresholdBand;
  approvedByUserIdRef: string;
  approvedAt: string;
}

export interface PerformanceScorecardItem {
  id: string;
  kpiIdRef: string;
  kpiCode: string;
  kpiName: string;
  weightPercent: number;
  currentScore?: number;
  status: PerformanceStatus;
}

export interface PerformanceScorecard {
  id: string;
  tenantId: string;
  campusId?: string;
  scorecardCode: string;
  name: string;
  scorecardType: 'INSTITUTIONAL' | 'CAMPUS' | 'STRATEGIC' | 'ACADEMIC' | 'OPERATIONAL' | 'EXECUTIVE';
  items: PerformanceScorecardItem[];
  compositeScore?: number;
  overallStatus: PerformanceStatus;
  publishedByUserIdRef?: string;
  publishedAt?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface PerformanceTrend {
  kpiIdRef: string;
  classification: TrendClassification;
  slope: number;
  samplePointsCount: number;
  interpretation: string;
}

export interface PerformanceVariance {
  kpiIdRef: string;
  absoluteVariance?: number;
  percentageVariance?: number;
  isCalculable: boolean;
  varianceStatus: PerformanceStatus;
  explanation?: string;
}

export interface BenchmarkReference {
  id: string;
  tenantId: string;
  benchmarkCode: string;
  title: string;
  benchmarkSourceType: 'PEER_INSTITUTION' | 'SECTOR' | 'REGULATORY' | 'ACCREDITATION' | 'HISTORICAL_BASELINE';
  sourceName: string;
  cohortName: string;
  benchmarkValue: number;
  unit: string;
  periodLabel: string;
  verificationStatus: BenchmarkVerificationStatus;
  provenance: string;
  verifiedAt?: string;
}

export interface BenchmarkObservation {
  id: string;
  kpiIdRef: string;
  benchmarkRefId: string;
  institutionalValue: number;
  benchmarkValue: number;
  gapAbsolute: number;
  gapPercentage?: number;
  gapStatus: 'AHEAD' | 'ALIGNED' | 'LAGGING';
}

export interface PerformanceAssessment {
  id: string;
  tenantId: string;
  assessmentCode: string;
  dimensionCode: PerformanceDimensionType;
  findings: string[];
  observedFacts: string[];
  interpretations: string[];
  recommendations: string[];
  assessorUserIdRef: string;
  assessedAt: string;
}

export interface PerformanceFinding {
  id: string;
  tenantId: string;
  findingCode: string;
  kpiIdRef: string;
  title: string;
  description: string;
  severity: PerformanceRiskLevel;
  dataQualityState: DataQualityState;
  identifiedAt: string;
}

export interface PerformanceAction {
  id: string;
  tenantId: string;
  actionCode: string;
  findingIdRef?: string;
  kpiIdRef: string;
  title: string;
  description: string;
  ownerIdRef: string;
  dueDate: string;
  lifecycle: PerformanceActionLifecycle;
  evidenceRef?: string;
  createdAt: string;
}

export interface PerformanceException {
  id: string;
  tenantId: string;
  exceptionCode: string;
  title: string;
  businessJustification: string;
  kpiIdRef: string;
  compensatingControlRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  approvedAt: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface PerformanceRisk {
  id: string;
  tenantId: string;
  kpiIdRef: string;
  varianceMagnitude: number;
  persistenceScore: number;
  strategicCriticality: number;
  trendDeteriorationScore: number;
  compositeRiskScore: number;
  riskLevel: PerformanceRiskLevel;
  calculatedAt: string;
}

export interface PerformanceDiagnostic {
  id: string;
  tenantId: string;
  code: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  recommendation: string;
  entityRef?: string;
}

export interface PerformanceAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityIdRef: string;
  timestamp: string;
  correlationId: string;
  previousHash: string;
  currentHash: string;
}

export interface SimulationResult901 {
  scenario: ScenarioType901;
  timestamp: string;
  simulatedKpisCount: number;
  affectedDimensionsCount: number;
  thresholdBreachesCount: number;
  scorecardImpactDeltaPercent: number;
  summary: string;
  diagnosticsGenerated: string[];
}

export type StrategicPlanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export interface StrategicPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  status: StrategicPlanStatus;
  version: number;
  vision?: string;
  mission?: string;
  values?: string[];
  documentRegistryId?: string;
  approvedBy?: string;
  approvedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  code?: string;
}

export interface StrategicObjective {
  id: string;
  tenantId: string;
  campusId?: string;
  planId: string;
  code: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  weight: number;
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
}

export interface StrategicInitiative {
  id: string;
  tenantId: string;
  campusId?: string;
  objectiveId: string;
  title: string;
  description: string;
  ownerId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budgetReference?: string;
  createdAt: string;
  updatedAt: string;
}

export type KPIPerspective = 'ACADEMIC' | 'ADMINISTRATIVE' | 'FINANCIAL' | 'STUDENT_SUCCESS' | 'RESEARCH';

export interface KPIDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  description: string;
  perspective: KPIPerspective;
  unit: string;
  calculationMethod: string;
  directionality: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY';
  ownerId: string;
  ownerName?: string;
  departmentId?: string;
  dataSourceSystem?: string;
  targetType?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  version: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface KPITarget {
  id: string;
  tenantId: string;
  campusId?: string;
  kpiId: string;
  academicYearId?: string;
  periodLabel: string;
  targetValue: number;
  thresholds?: {
    warning: number;
    critical: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KPIMeasurement {
  id: string;
  tenantId: string;
  campusId?: string;
  kpiId: string;
  targetId: string;
  actualValue: number;
  measurementDate?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'LOCKED';
  notes?: string;
  evidenceUrl?: string;
  submittedBy: string;
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  achievementPercentage?: number;
  weightedScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BalancedScorecard {
  id: string;
  tenantId: string;
  overallHealthScore: number;
  healthStatus: string;
  perspectives: Record<string, {
    perspective: string;
    score: number;
    status: string;
    kpisCount: number;
  }>;
}

export interface ExecutiveDecisionSignoff {
  userId: string;
  userName: string;
  role: string;
  decision: 'APPROVE' | 'REJECT' | 'ABSTAIN';
  timestamp: string;
  comments?: string;
}

export interface ExecutiveDecision {
  id: string;
  tenantId: string;
  code: string;
  category: string;
  title: string;
  status: 'PENDING_RATIFICATION' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  summary: string;
  requestedBudget: number;
  proposerName?: string;
  proposerRole: string;
  signoffs: ExecutiveDecisionSignoff[];
}

export interface PerformanceRiskAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  triggerDate: string;
  kpiName: string;
  thresholdBreached: string;
  actualValue: number;
  targetValue: number;
  status: string;
}

export interface CorrectiveActionStep {
  step: number;
  description: string;
  owner: string;
  dueDate: string;
  completed: boolean;
}

export interface CorrectiveActionPlan {
  id: string;
  tenantId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'VERIFIED_CLOSED';
  title: string;
  alertId?: string;
  kpiId: string;
  rootCauseAnalysis: string;
  targetResolutionDate: string;
  assignedTo: string;
  assignedToName: string;
  actionSteps: CorrectiveActionStep[];
}

export interface WhatIfScenario {
  id: string;
  name: string;
}

export interface PerformanceAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  action: string;
  entityType: string;
  entityName: string;
}
