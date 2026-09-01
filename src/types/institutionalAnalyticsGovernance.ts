export type AnalyticsDomain =
  | 'ACADEMIC'
  | 'STUDENT_SUCCESS'
  | 'FINANCIAL'
  | 'RESEARCH'
  | 'WORKFORCE'
  | 'OPERATIONS'
  | 'COMMUNITY_ENGAGEMENT'
  | 'INTERNATIONALIZATION'
  | 'DIGITAL_TECHNOLOGY'
  | 'RISK_RESILIENCE';

export type GovCalculationMethod =
  | 'SIMPLE_AVERAGE'
  | 'WEIGHTED_AVERAGE'
  | 'SUM'
  | 'RATIO'
  | 'PERCENTAGE'
  | 'DETERMINISTIC_MODEL'
  | 'ROLLING_WINDOW';

export type DataSufficiencyAssessment =
  | 'SUFFICIENT'
  | 'INSUFFICIENT'
  | 'CALIBRATION_REQUIRED';

export type ForecastConfidence =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'UNRELIABLE';

export type ForecastHorizon =
  | 'SHORT_TERM' // Under 1 year
  | 'MEDIUM_TERM' // 1-3 years
  | 'LONG_TERM'; // 3-5+ years

export type NormalizationMethod =
  | 'Z_SCORE'
  | 'MIN_MAX'
  | 'PERCENTILE'
  | 'RAW_RATIO';

export type WarningSeverity =
  | 'STABLE'
  | 'WATCH'
  | 'WARNING'
  | 'CRITICAL';

export type WarningTrigger =
  | 'THRESHOLD_BREACH'
  | 'TREND_DETERIORATION'
  | 'SUDDEN_TREND_BREAK'
  | 'FORECAST_DIVERGENT'
  | 'COMPOUND_CASCADE';

export type WarningEscalationStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'MITIGATED'
  | 'ESCALATED'
  | 'RESOLVED';

export type DecisionConfidence =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'SPECULATIVE';

export type DecisionApprovalState =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVOKED';

export type GovResilienceRating =
  | 'STRONG'
  | 'ADEQUATE'
  | 'VULNERABLE'
  | 'SEVERELY_EXPOSED';

export type ModelLifecycleState =
  | 'DRAFT'
  | 'PENDING_CALIBRATION'
  | 'CALIBRATED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DEPRECATED';

// ==========================================
// A. Analytics Strategy
// ==========================================
export interface AnalyticsObjective {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  weight: number; // For weighting indicators
}

export interface InstitutionalAnalyticsStrategy {
  id: string;
  tenantId: string;
  title: string;
  fiscalYear: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  objectives: AnalyticsObjective[];
  lastUpdated: string;
  updatedBy: string;
}

// ==========================================
// B. Indicator Governance
// ==========================================
export interface IndicatorDefinition {
  code: string;
  name: string;
  description: string;
  domain: AnalyticsDomain;
  unit: string;
  calculationMethod: GovCalculationMethod;
  formula: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
}

export interface IndicatorThreshold {
  criticalBelow?: number;
  warnBelow?: number;
  targetValue: number;
  warnAbove?: number;
  criticalAbove?: number;
}

export interface IndicatorTarget {
  id: string;
  indicatorCode: string;
  fiscalYear: string;
  targetValue: number;
  thresholds: IndicatorThreshold;
  approvedBy?: string;
  approvedDate?: string;
}

export interface IndicatorObservation {
  id: string;
  tenantId: string;
  campusId: string;
  indicatorCode: string;
  observationPeriod: string; // e.g. "2026-Q1", "2026-M08"
  value: number | null; // null represents missing data
  dataSufficiency: DataSufficiencyAssessment;
  timestamp: string;
  provenanceId: string;
}

export interface InstitutionalIndicator {
  definition: IndicatorDefinition;
  target: IndicatorTarget | null;
  latestObservation: IndicatorObservation | null;
}

// ==========================================
// C. Analytics Provenance
// ==========================================
export interface AnalyticsSourceReference {
  sourceModuleIdRef: string; // Reference to existing EMS modules
  sourceRecordIdRef: string; // ID of the referenced source entity
  description: string;
}

export interface MethodologyVersion {
  version: string;
  approvedBy: string;
  approvalDate: string;
  isActive: boolean;
  changeLog: string;
}

export interface AssumptionSet {
  id: string;
  title: string;
  assumptions: Record<string, string | number | boolean>;
  isBaseline: boolean;
}

export interface AnalyticsProvenance {
  id: string;
  tenantId: string;
  indicatorCode: string;
  methodologyVersion: string;
  calculationBasis: string;
  sources: AnalyticsSourceReference[];
  calculatedAt: string;
  calculationEngineVersion: string;
  assumptionSetId?: string;
}

// ==========================================
// D. Trend Intelligence
// ==========================================
export interface TrendObservation {
  indicatorCode: string;
  timeRange: string;
  direction: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  percentageChange: number;
  variancePct: number;
}

export interface TrendBreakObservation {
  id: string;
  indicatorCode: string;
  breakPointPeriod: string;
  breakSeverity: 'MINOR' | 'MAJOR' | 'SEVERE';
  preBreakSlope: number;
  postBreakSlope: number;
  explanation: string;
}

export interface VarianceObservation {
  indicatorCode: string;
  period: string;
  observedValue: number;
  targetValue: number;
  varianceValue: number;
  variancePercentage: number;
}

export interface DriverAnalysis {
  id: string;
  targetIndicatorCode: string;
  driverIndicatorCode: string;
  correlationCoefficient: number;
  impactWeight: number; // Contribution percentage
}

// ==========================================
// E. Forecasting
// ==========================================
export interface GovForecastDefinition {
  indicatorCode: string;
  horizon: ForecastHorizon;
  methodology: string;
  applicableAssumptions: string[];
}

export interface ForecastAssumption {
  key: string;
  description: string;
  value: number;
}

export interface ForecastObservation {
  period: string;
  predictedValue: number;
  confidenceLowerBound: number;
  confidenceUpperBound: number;
}

export interface ForecastRun {
  id: string;
  tenantId: string;
  indicatorCode: string;
  runTimestamp: string;
  horizon: ForecastHorizon;
  confidence: ForecastConfidence;
  assumptions: ForecastAssumption[];
  predictions: ForecastObservation[];
  provenance: AnalyticsProvenance;
}

// ==========================================
// F. Benchmarking
// ==========================================
export interface BenchmarkDefinition {
  code: string;
  name: string;
  indicatorCode: string;
  sectorName: string; // e.g. "National Average", "Top Tier Peers"
  source: string;
}

export interface GovBenchmarkObservation {
  benchmarkCode: string;
  period: string;
  benchmarkValue: number;
  dataSufficiency: DataSufficiencyAssessment;
}

export interface BenchmarkComparison {
  indicatorCode: string;
  observedValue: number;
  benchmarkValue: number;
  variancePct: number;
  normalizationMethod: NormalizationMethod;
  normalizedScore: number; // Bound between 0 and 100
}

// ==========================================
// G. Early Warning
// ==========================================
export interface EarlyWarningDefinition {
  id: string;
  title: string;
  indicatorCode: string;
  triggerType: WarningTrigger;
  conditionFormula: string;
  severity: WarningSeverity;
}

export interface EarlyWarningObservation {
  id: string;
  tenantId: string;
  campusId: string;
  definitionId: string;
  detectedAt: string;
  observedValue: number;
  triggerValue: number;
  severity: WarningSeverity;
  status: WarningEscalationStatus;
  investigatedBy?: string;
  investigationNotes?: string;
  recommendedResponse: string;
}

export interface WarningEscalation {
  id: string;
  warningId: string;
  escalatedToUserIdRef: string;
  escalatedAt: string;
  actionTaken?: string;
}

// ==========================================
// H. Scenario Intelligence
// ==========================================
export interface ScenarioParameter {
  key: string;
  name: string;
  defaultValue: number;
  currentValue: number;
  unit: string;
}

export interface ScenarioOutcome {
  indicatorCode: string;
  baselineValue: number;
  simulatedValue: number;
  variancePct: number;
  riskRating: GovResilienceRating;
}

export interface AnalyticsScenario {
  id: string;
  name: string;
  description: string;
  parameters: ScenarioParameter[];
  outcomes: ScenarioOutcome[];
  runAt: string;
  isCustom: boolean;
}

export interface ScenarioComparison {
  scenarioAId: string;
  scenarioBId: string;
  comparisonAt: string;
  varianceOutcomes: Array<{
    indicatorCode: string;
    varianceA: number;
    varianceB: number;
    deltaPct: number;
  }>;
}

export interface SensitivityObservation {
  indicatorCode: string;
  parameterKey: string;
  elasticityIndex: number; // Impact ratio of parameter change to indicator change
}

// ==========================================
// I. Decision Intelligence
// ==========================================
export interface DecisionEvidence {
  referenceType: 'KPI' | 'FORECAST' | 'BENCHMARK' | 'SCENARIO' | 'EARLY_WARNING';
  referenceId: string;
  description: string;
}

export interface DecisionAlternative {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  expectedBenefits: string;
  impactEstimates: Array<{
    indicatorCode: string;
    estimatedChangePct: number;
  }>;
}

export interface DecisionImpactEstimate {
  indicatorCode: string;
  expectedChange: number;
}

export interface DecisionApproval {
  approverUserIdRef: string;
  approvedAt: string;
  signatureHash: string; // Deterministic hash of decision contents
  notes?: string;
}

export interface DecisionBrief {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  decisionQuestion: string;
  currentState: string;
  evidence: DecisionEvidence[];
  alternatives: DecisionAlternative[];
  recommendedAlternativeId: string;
  confidence: DecisionConfidence;
  assumptions: string[];
  status: DecisionApprovalState;
  requestedByUserIdRef: string;
  requestedAt: string;
  approvals: DecisionApproval[];
  auditReferenceId?: string;
}

// ==========================================
// J. Resilience Intelligence
// ==========================================
export interface ResilienceIndicator {
  indicatorCode: string;
  domain: AnalyticsDomain;
  exposureScore: number; // 0 (Safe) to 100 (Extremely Exposed)
  resilienceRating: GovResilienceRating;
  dependencyConcentration: string; // Description of concentration risk
}

export interface RecoveryTrajectory {
  scenarioName: string;
  monthsToRecovery: number;
  trajectoryPoints: Array<{ month: number; indicatorLevel: number }>;
}

export interface ResilienceScenario {
  id: string;
  scenarioName: string;
  impactScore: number;
  probabilityScore: number;
  estimatedFinancialLoss: number;
  recoveryTrajectory: RecoveryTrajectory;
}

export interface ResilienceImpact {
  domain: AnalyticsDomain;
  rating: GovResilienceRating;
  mitigationStatus: 'UNMITIGATED' | 'PARTIALLY_MITIGATED' | 'FULLY_MITIGATED';
  scenarios: ResilienceScenario[];
}

// ==========================================
// K. Governance
// ==========================================
export interface MethodologyApproval {
  methodologyVersion: string;
  approverUserIdRef: string;
  approvedAt: string;
  signoffNotes: string;
}

export interface AnalyticsModelGovernance {
  id: string;
  modelName: string;
  version: string;
  status: ModelLifecycleState;
  calibrationDate?: string;
  nextCalibrationDue: string;
  approvals: MethodologyApproval[];
}

export interface AnalyticsException {
  id: string;
  tenantId: string;
  indicatorCode: string;
  reason: string;
  startDate: string;
  endDate: string;
  exemptTargetValue: number;
  approvedByUserIdRef: string;
  approvedAt: string;
}

export interface AnalyticsOverride {
  id: string;
  tenantId: string;
  indicatorCode: string;
  period: string;
  originalValue: number;
  overrideValue: number;
  reason: string;
  justificationNotes: string;
  governanceApprovedByUserIdRef: string;
  approvedAt: string;
}

export interface GovAnalyticsAuditEvent {
  id: string;
  tenantId: string;
  campusId: string;
  actorRef: string;
  action: string;
  entityRef: string;
  timestamp: string;
  correlationId: string;
  previousHash: string;
  currentHash: string;
  provenanceInfo: string;
}

export interface AnalyticsDiagnostic {
  id: string;
  severity: 'WARNING' | 'ERROR';
  category:
    | 'MISSING_SOURCE'
    | 'ORPHAN_REFERENCE'
    | 'INSUFFICIENT_HISTORY'
    | 'STALE_OBSERVATION'
    | 'INVALID_METHODOLOGY'
    | 'UNAPPROVED_METHODOLOGY'
    | 'CONFIDENCE_DEFICIENCY'
    | 'THRESHOLD_DEFECT'
    | 'EXPIRED_EXCEPTION'
    | 'UNAPPROVED_OVERRIDE'
    | 'SOD_VIOLATION'
    | 'INCONSISTENT_CALCULATION'
    | 'PROVENANCE_GAP'
    | 'MUTATION_ATTEMPT';
  description: string;
  entityRef: string;
  detectedAt: string;
}
