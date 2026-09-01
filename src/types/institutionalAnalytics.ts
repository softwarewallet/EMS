// EMS Phase 7.36: Institutional Data, Analytics, Business Intelligence & Decision Intelligence Governance Engine Types

export type CalculationMethod = 
  | 'COUNT'
  | 'SUM'
  | 'AVG'
  | 'MIN'
  | 'MAX'
  | 'MEDIAN'
  | 'RATE'
  | 'PERCENTAGE'
  | 'RATIO'
  | 'TREND'
  | 'VARIANCE'
  | 'TARGET_ACHIEVEMENT'
  | 'WEIGHTED_SCORE';

export type MetricRefreshMode = 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ON_DEMAND';

export type CampusScopeType = 'ALL_CAMPUSES' | 'SINGLE_CAMPUS' | 'MULTI_CAMPUS';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ForecastMethodology = 'LINEAR_TREND' | 'MOVING_AVERAGE' | 'WEIGHTED_MOVING_AVERAGE' | 'HISTORICAL_BASELINE';

export type DataClassificationLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';

export type GovernanceReviewStatus = 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';

export type ExportStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';

export type DataQualityRuleType = 
  | 'MISSING_REQUIRED_VALUE'
  | 'ORPHANED_REFERENCE'
  | 'INVALID_DATE'
  | 'DUPLICATE_SOURCE'
  | 'TENANT_INCONSISTENCY'
  | 'CAMPUS_INCONSISTENCY'
  | 'IMPOSSIBLE_NUMERIC'
  | 'STALE_DATASET'
  | 'UNMAPPED_ACADEMIC_YEAR';

export interface AnalyticsAuditMetadata {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  soDVerified?: boolean;
  overrideJustification?: string;
  overrideActorId?: string;
  overrideTimestamp?: string;
}

// Data Lineage Definition
export interface KPIDataLineage {
  metricId: string;
  metricName: string;
  sourceModule: string; // e.g., 'mod_student_success', 'mod_finance', 'mod_attendance'
  sourceCollection: string; // e.g., 'students', 'fee_collections'
  sourceEntityType: string;
  sourceFields: string[];
  calculationMethod: CalculationMethod;
  aggregationMethod: string;
  tenantScope: string;
  campusScope: CampusScopeType;
  academicYearScope?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  refreshMode: MetricRefreshMode;
  ownerId: string;
  definitionVersion: number;
  lastValidatedAt: string;
}

// 1. Metric Definition
export interface AnalyticsMetricDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  description: string;
  category: 'STUDENT' | 'ACADEMIC' | 'FACULTY' | 'FINANCE' | 'RESEARCH' | 'QUALITY' | 'OPERATIONS' | 'RISK';
  lineage: KPIDataLineage;
  targetValue?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  unitOfMeasure: string; // e.g. "%", "Count", "USD", "Hours"
  classification: DataClassificationLevel;
  approvalStatus: GovernanceReviewStatus;
  approvedBy?: string;
  approvedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 2. Metric Measurement
export interface MetricMeasurement {
  id: string;
  tenantId: string;
  campusId?: string;
  metricId: string;
  metricCode: string;
  numericValue: number;
  rawValue: number;
  targetValue?: number;
  variance?: number;
  measurementDate: string;
  academicYearId?: string;
  dataType: 'OBSERVED' | 'DERIVED' | 'FORECAST' | 'TARGET';
  calculatedAt: string;
  calculatedBy: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface MetricCalculation {
  metricId: string;
  method: CalculationMethod;
  result: number;
  observationCount: number;
  hasNaNOrInfinityProtected: boolean;
  computedAt: string;
}

export interface MetricDataSource {
  id: string;
  moduleName: string;
  collectionName: string;
  entityType: string;
  isAuthorized: boolean;
  lastSyncAt: string;
}

// 3. Dashboards & Widgets
export interface DashboardWidget {
  id: string;
  title: string;
  widgetType: 'SCORECARD_KPI' | 'LINE_CHART' | 'BAR_CHART' | 'PIE_CHART' | 'TABLE' | 'HEATMAP' | 'GAUGE';
  metricId?: string;
  metricCode?: string;
  gridX: number;
  gridY: number;
  gridW: number;
  gridH: number;
  chartSettings?: Record<string, string | number | boolean>;
}

export interface DashboardDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  category: string;
  widgets: DashboardWidget[];
  isSystemDashboard: boolean;
  isPublished: boolean;
  classification: DataClassificationLevel;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsWorkspace {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  dashboards: DashboardDefinition[];
  defaultDashboardId?: string;
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Datasets & Snapshots
export interface AnalyticsDataset {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  sourceModule: string;
  sourceCollection: string;
  recordCount: number;
  fields: string[];
  classification: DataClassificationLevel;
  lastRefreshedAt: string;
  createdAt: string;
  createdBy: string;
}

export interface AnalyticsSnapshot {
  id: string;
  tenantId: string;
  campusId?: string;
  snapshotTitle: string;
  snapshotDate: string;
  datasetId: string;
  dataPayloadJson: string; // JSON Stringified array of aggregate metrics
  createdById: string;
  createdAt: string;
}

// 5. Benchmarking & Cohorts
export interface InstitutionalBenchmark {
  id: string;
  tenantId: string;
  campusId?: string;
  benchmarkCode: string;
  title: string;
  metricId: string;
  category: string;
  benchmarkType: 'CAMPUS_VS_CAMPUS' | 'DEPT_VS_DEPT' | 'PROGRAM_VS_PROGRAM' | 'YEAR_VS_YEAR' | 'EXTERNAL_APPROVED';
  sourceReference: string;
  referencePeriod: string;
  methodology: string;
  benchmarkValue: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CohortDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  title: string;
  description: string;
  admissionYear?: string;
  academicYearId?: string;
  programId?: string;
  departmentId?: string;
  minCohortSizeProtection: number; // e.g. minimum 5 records to prevent identity re-identification
  filterCriteria: Record<string, string | number | boolean>;
  createdAt: string;
  createdBy: string;
}

export interface CohortMembership {
  id: string;
  tenantId: string;
  cohortId: string;
  studentId: string;
  academicStatus: string;
  retentionStatus: 'RETAINED' | 'PROGRESSING' | 'DROPPED_OUT' | 'GRADUATED' | 'TRANSFERRED';
  enrolledAt: string;
}

// 6. Trends & Forecasts
export interface TrendAnalysis {
  id: string;
  tenantId: string;
  metricId: string;
  timePeriodUnit: 'MONTHLY' | 'QUARTERLY' | 'SEMESTER' | 'ACADEMIC_YEAR';
  startPeriod: string;
  endPeriod: string;
  baselineValue: number;
  currentValue: number;
  absoluteChange: number;
  percentageChange: number;
  trendDirection: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  volatilityIndex: number;
  targetVariance: number;
  computedAt: string;
}

export interface ForecastDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  metricId: string;
  forecastTitle: string;
  methodology: ForecastMethodology;
  sourcePeriodStart: string;
  sourcePeriodEnd: string;
  observationCount: number;
  forecastHorizonPeriods: number;
  createdAt: string;
  createdBy: string;
}

export interface ForecastResult {
  id: string;
  tenantId: string;
  forecastDefinitionId: string;
  metricId: string;
  methodology: ForecastMethodology;
  forecastPeriods: {
    periodLabel: string;
    forecastedValue: number;
    lowerBoundConfidence?: number;
    upperBoundConfidence?: number;
  }[];
  generatedAt: string;
  generatedBy: string;
}

// 7. Data Quality
export interface AnalyticsDataQualityIssue {
  id: string;
  tenantId: string;
  campusId?: string;
  sourceModule: string;
  sourceCollection: string;
  recordId?: string;
  ruleType: DataQualityRuleType;
  severity: SeverityLevel;
  issueDescription: string;
  remediationModuleRef: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  detectedAt: string;
}

export interface DataQualityRule {
  id: string;
  tenantId: string;
  ruleName: string;
  targetCollection: string;
  ruleType: DataQualityRuleType;
  severity: SeverityLevel;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

// 8. Alerts & Decision Intelligence
export interface AnalyticsAlert {
  id: string;
  tenantId: string;
  campusId?: string;
  metricId: string;
  metricName: string;
  alertType: 'WARNING' | 'CRITICAL';
  evaluationPeriod: string;
  triggerCondition: string;
  currentValue: number;
  thresholdValue: number;
  message: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  idempotencyKey: string; // Prevents duplicate alerts
  createdAt: string;
}

export interface DecisionRecommendation {
  id: string;
  actionTitle: string;
  actionDetails: string;
  priority: SeverityLevel;
  targetDepartmentOrScope: string;
}

export interface DecisionInsight {
  id: string;
  tenantId: string;
  campusId?: string;
  sourceMetricIds: string[];
  title: string;
  observation: string;
  evidenceSummary: string;
  trendDirection: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  severity: SeverityLevel;
  affectedScope: string;
  recommendations: DecisionRecommendation[];
  confidenceScore: number; // 0 to 100% deterministic score
  reviewStatus: 'DRAFT' | 'REVIEWED' | 'CERTIFIED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  generatedAt: string;
  createdBy: string;
}

export interface ExecutiveBrief {
  id: string;
  tenantId: string;
  campusId?: string;
  briefTitle: string;
  reportingPeriod: string;
  summaryText: string;
  keyInsights: DecisionInsight[];
  topAlerts: AnalyticsAlert[];
  compiledBy: string;
  createdAt: string;
}

// 9. Reports & Exports
export interface ReportDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  title: string;
  description: string;
  reportType: 'EXECUTIVE' | 'ACADEMIC' | 'STUDENT_SUCCESS' | 'FACULTY' | 'FINANCE' | 'RESEARCH' | 'QUALITY' | 'ACCREDITATION' | 'RISK' | 'CAMPUS_PERFORMANCE';
  includedMetricIds: string[];
  classification: DataClassificationLevel;
  approvalStatus: GovernanceReviewStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportExecution {
  id: string;
  tenantId: string;
  campusId?: string;
  reportDefinitionId: string;
  executionTitle: string;
  executedBy: string;
  executedAt: string;
  sourceSnapshotId?: string;
  outputSummaryJson: string;
}

export interface ScheduledReport {
  id: string;
  tenantId: string;
  reportDefinitionId: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recipients: string[];
  isActive: boolean;
  lastRunAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface AnalyticsExportRequest {
  id: string;
  tenantId: string;
  campusId?: string;
  exportTitle: string;
  exportFormat: 'CSV' | 'XLSX' | 'PDF';
  requestedBy: string;
  requestPurpose: string;
  classification: DataClassificationLevel;
  approvalStatus: ExportStatus;
  approvedBy?: string; // SoD check: requester cannot approve
  approvedAt?: string;
  exportedAt?: string;
  createdAt: string;
}

// 10. Access Control & Governance
export interface AnalyticsAccessGrant {
  id: string;
  tenantId: string;
  userId: string;
  roleCode: string;
  allowedCategories: string[];
  maxClassificationAllowed: DataClassificationLevel;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface AnalyticsAuditEvent {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  targetEntityId: string;
  details: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface AnalyticsGovernanceReview {
  id: string;
  tenantId: string;
  reviewTitle: string;
  targetType: 'METRIC' | 'REPORT' | 'EXPORT' | 'DASHBOARD';
  targetId: string;
  submitterId: string;
  status: GovernanceReviewStatus;
  justification: string;
  createdAt: string;
}

export interface AnalyticsGovernanceDecision {
  id: string;
  tenantId: string;
  governanceReviewId: string;
  decision: 'APPROVED' | 'REJECTED';
  reviewerId: string; // SoD check: reviewer !== submitter
  decisionNotes: string;
  decidedAt: string;
}

// Overall Scorecard Aggregations
export interface InstitutionalAnalytics {
  totalStudents: number;
  activeStudents: number;
  enrollmentTrend: number;
  attendanceRate: number;
  academicAchievementAvg: number;
  progressionRate: number;
  retentionRate: number;
  placementRate: number;
  feeCollectionRate: number;
  outstandingReceivables: number;
  facultyStrength: number;
  facultyWorkloadAvg: number;
  researchOutputCount: number;
  accreditationReadinessScore: number;
  openInstitutionalRisksCount: number;
  criticalComplianceIssuesCount: number;
  campusUtilizationPercentage: number;
  overallInstitutionalPerformanceIndex: number;
}
