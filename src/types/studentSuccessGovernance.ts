/**
 * EMS Phase 7.66: Institutional Student Success, Retention, Progression, Completion
 * & Learner Outcomes Governance Engine Types & Contracts
 * Module ID: mod_student_success_governance
 */

export type StudentSuccessLifecycleState =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type EarlyAlertRuleState =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RETIRED';

export type InterventionLifecycleState =
  | 'IDENTIFIED'
  | 'PLANNED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'OUTCOME_REVIEW'
  | 'COMPLETED'
  | 'CLOSED';

export type InterventionCategory =
  | 'ACADEMIC_ADVISING'
  | 'TUTORING'
  | 'MENTORING'
  | 'FINANCIAL_SUPPORT_REFERENCE'
  | 'CAREER_SUPPORT'
  | 'STUDENT_SUCCESS_COACHING'
  | 'ENGAGEMENT'
  | 'REENTRY'
  | 'DEGREE_PROGRESS'
  | 'GATEWAY_COURSE_SUPPORT'
  | 'OTHER';

export type InterventionEffectivenessStatus =
  | 'EFFECTIVE'
  | 'PARTIALLY_EFFECTIVE'
  | 'INEFFECTIVE'
  | 'INCONCLUSIVE'
  | 'INSUFFICIENT_DATA';

export type ObservationStatus =
  | 'ACTUAL'
  | 'FORECAST'
  | 'TARGET'
  | 'BENCHMARK'
  | 'SCENARIO'
  | 'INSUFFICIENT_DATA';

export type LearnerOutcomeStatus =
  | 'ACHIEVED'
  | 'PARTIALLY_ACHIEVED'
  | 'NOT_ACHIEVED'
  | 'INSUFFICIENT_DATA';

export type SuccessRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'EXTREME'
  | 'INSUFFICIENT_DATA';

export type SuccessResilienceRating =
  | 'STRONG'
  | 'ADEQUATE'
  | 'VULNERABLE'
  | 'SEVERELY_EXPOSED';

export type SuccessForecastState =
  | 'BASELINE'
  | 'FORECAST'
  | 'REVIEWED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'SUPERSEDED';

export type SuccessFindingSeverity =
  | 'OBSERVATION'
  | 'MINOR'
  | 'MAJOR'
  | 'CRITICAL';

export type CohortType =
  | 'ENTERING_FIRST_YEAR'
  | 'TRANSFER'
  | 'PROGRAM_SPECIFIC'
  | 'ACADEMIC_YEAR'
  | 'RE_ENTRY'
  | 'COMPLETION_TRACK'
  | 'CUSTOM_GOVERNED';

export type SuccessSimulationType =
  | 'RETENTION_DECLINE'
  | 'GATEWAY_COURSE_FAILURE'
  | 'SUPPORT_CAPACITY_REDUCTION'
  | 'ADVISING_CAPACITY_REDUCTION'
  | 'ENROLLMENT_SHOCK'
  | 'FINANCIAL_SUPPORT_REDUCTION'
  | 'REENTRY_DEMAND_SURGE'
  | 'COMPLETION_DELAY'
  | 'KEY_PROGRAM_BOTTLENECK'
  | 'INTERVENTION_FAILURE'
  | 'DATA_QUALITY_FAILURE'
  | 'MULTI_CAMPUS_SUCCESS_EVENT';

export interface StudentSuccessGovernanceReference {
  studentIdRef?: string;
  studentRecordIdRef?: string;
  programIdRef?: string;
  courseIdRef?: string;
  termIdRef?: string;
  degreeAuditIdRef?: string;
  assessmentRecordIdRef?: string;
  supportCaseIdRef?: string;
  financialAidRecordIdRef?: string;
  attendanceRecordIdRef?: string;
  lmsRecordIdRef?: string;
  tenantId: string;
  campusId: string;
}

export interface StudentSuccessObjective {
  id: string;
  code: string;
  title: string;
  category: 'RETENTION' | 'PERSISTENCE' | 'PROGRESSION' | 'COMPLETION' | 'LEARNER_OUTCOME' | 'EQUITY' | 'SUPPORT_ACCESS';
  targetValue: number;
  currentObservedValue: number | null;
  unit: string;
  baselinePeriod: string;
  targetPeriod: string;
  responsibleUnit: string;
  evidenceReferenceId: string;
  isCompliant: boolean;
}

export interface StudentSuccessStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyCode: string;
  title: string;
  description: string;
  lifecycle: StudentSuccessLifecycleState;
  version: string;
  effectiveAcademicYear: string;
  reviewFrequencyMonths: number;
  ownerId: string;
  approverId?: string;
  strategicObjectives: StudentSuccessObjective[];
  governedCohortIds: string[];
  institutionalBenchmarkRefs: string[];
  lastAssessedAt: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface StudentSuccessCohort {
  id: string;
  tenantId: string;
  campusScope: string;
  cohortCode: string;
  cohortName: string;
  cohortType: CohortType;
  academicYear: string;
  term: string;
  programRef?: string;
  departmentRef?: string;
  aggregateHeadcount: number;
  isPrivacySuppressed: boolean; // True if headcount < 10 to protect privacy
  lineageSourceSystem: string;
  observationPeriod: string;
  ownerId: string;
  createdAt: string;
}

export interface RetentionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cohortRef: string;
  period: string; // e.g. "AY 2025-2026 to AY 2026-2027"
  observationStatus: ObservationStatus;
  ratePercent: number | null; // null if INSUFFICIENT_DATA
  numeratorHeadcount?: number;
  denominatorHeadcount?: number;
  methodology: string;
  authoritativeSourceRef: string;
  evidenceConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
  isPrivacySuppressed: boolean;
  benchmarkVariance?: number;
  lastUpdated: string;
}

export interface PersistenceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cohortRef: string;
  termFrom: string;
  termTo: string;
  observationStatus: ObservationStatus;
  persistenceRatePercent: number | null;
  stopOutRatePercent: number | null;
  reEnrollmentRatePercent: number | null;
  authoritativeSourceRef: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
  lastUpdated: string;
}

export interface ProgressionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  programRef: string;
  term: string;
  academicLevel: 'FIRST_YEAR' | 'SECOND_YEAR' | 'THIRD_YEAR' | 'FOURTH_YEAR' | 'GRADUATE';
  creditAccumulationPacePercent: number | null; // e.g. % on track for 30 credits/yr
  degreeProgressAveragePercent: number | null;
  bottleneckCoursesIdentified: string[];
  excessCreditExposurePercent: number | null;
  observationStatus: ObservationStatus;
  sourceRef: string;
  lastUpdated: string;
}

export interface CompletionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cohortRef: string;
  completionMetric: '4_YEAR_RATE' | '6_YEAR_RATE' | 'GRADUATION_RATE_150' | 'CREDENTIAL_COMPLETION';
  ratePercent: number | null;
  averageTimeToDegreeMonths: number | null;
  observationStatus: ObservationStatus;
  authoritativeSourceRef: string;
  benchmarkTargetPercent: number;
  isCompliant: boolean;
  lastUpdated: string;
}

export interface GraduationReadinessObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cohortRef: string;
  graduatingTerm: string;
  totalCandidates: number;
  verifiedAuditCompletePercent: number | null;
  pendingRequirementCount: number;
  criticalBarriersIdentified: string[];
  readinessIndex: number; // 0-100
  observationStatus: ObservationStatus;
  sourceDegreeAuditRef: string;
  lastUpdated: string;
}

export interface EarlyAlertRule {
  id: string;
  tenantId: string;
  campusScope: string;
  ruleCode: string;
  title: string;
  category: 'ACADEMIC_PROGRESS' | 'ATTENDANCE_PATTERN' | 'LMS_ENGAGEMENT' | 'FINANCIAL_HOLDS' | 'MIDTERM_DEFICIENCY';
  lifecycle: EarlyAlertRuleState;
  explainableCriteria: string;
  authoritativeSourceSystem: string;
  triggerThresholdDescription: string;
  reviewFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'TERMLY';
  falsePositiveReviewDate: string;
  falsePositiveRatePercent: number;
  linkedInterventionCategory: InterventionCategory;
  ruleOwnerId: string;
  approverId?: string;
  effectiveFrom: string;
  expiresAt: string;
}

export interface EarlyAlertObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  ruleRef: string;
  observationTerm: string;
  alertsGeneratedAggregate: number;
  alertsTriagedAggregate: number;
  interventionsInitiatedAggregate: number;
  falsePositiveFlagCount: number;
  status: 'ACTIVE' | 'REVIEWED' | 'ARCHIVED';
  lastGeneratedAt: string;
}

export interface InterventionAction {
  id: string;
  actionCode: string;
  title: string;
  description: string;
  assignedOwnerId: string;
  targetDate: string;
  completedDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
}

export interface InterventionPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  planCode: string;
  title: string;
  category: InterventionCategory;
  lifecycle: InterventionLifecycleState;
  cohortOrProgramRef: string;
  objective: string;
  evidenceSourceCaseRef: string;
  assignedUnit: string;
  ownerId: string;
  approverId?: string;
  verifierId?: string;
  actions: InterventionAction[];
  startDate: string;
  targetReviewDate: string;
  effectivenessAssessment?: InterventionEffectivenessStatus;
  effectivenessNotes?: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface InterventionEffectivenessObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  interventionPlanRef: string;
  baselineMetricValue: number | null;
  postInterventionMetricValue: number | null;
  targetMetricValue: number;
  variance: number | null;
  causalityStatement: 'ASSOCIATION ONLY' | 'CONTROLLED COMPARISON' | 'INSUFFICIENT DATA';
  effectivenessStatus: InterventionEffectivenessStatus;
  evaluatedAt: string;
  evaluatedBy: string;
  notes: string;
}

export interface AcademicAdvisingGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleName: string;
  academicYear: string;
  term: string;
  totalStudentsRequiringAdvisingAggregate: number;
  completedAdvisingAppointmentsAggregate: number;
  completionRatePercent: number;
  advisingCapacityAdvisorToStudentRatio: string; // e.g. "1:320"
  capacityExposureStatus: 'OPTIMAL' | 'MODERATE' | 'CRITICAL_CAPACITY';
  unmetAdvisingCount: number;
  sourceAdvisingSystemRef: string;
  lastUpdated: string;
}

export interface StudentSupportServiceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  serviceCategory: 'TUTORING' | 'CAREER_SERVICES' | 'COUNSELING_REFERRAL' | 'DISABILITY_SUPPORT' | 'FINANCIAL_WELLNESS' | 'WRITING_CENTER';
  serviceName: string;
  reportingPeriod: string;
  aggregateDemandHeadcount: number;
  aggregateServedHeadcount: number;
  utilizationRatePercent: number;
  averageWaitTimeDays: number;
  capacityStrainLevel: 'NORMAL' | 'HIGH' | 'OVERLOADED';
  sourceSystemRef: string;
  lastUpdated: string;
}

export interface LearnerOutcomeObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  outcomeCode: string;
  title: string;
  domain: 'COMMUNICATION' | 'CRITICAL_THINKING' | 'QUANTITATIVE_REASONING' | 'PROGRAM_SPECIALIZATION' | 'PROFESSIONAL_ETHICS';
  evaluationPeriod: string;
  cohortRef: string;
  status: LearnerOutcomeStatus;
  attainmentPercent: number | null;
  targetPercent: number;
  authoritativeAssessmentRef: string;
  lastAssessedAt: string;
}

export interface StudentExperienceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  dimension: 'BELONGING' | 'ACADEMIC_ENGAGEMENT' | 'CAMPUS_LIFE' | 'SUPPORT_SATISFACTION' | 'INSTITUTIONAL_VOICE';
  surveyCycleRef: string;
  overallSatisfactionIndex: number | null; // 0-100, null if suppressed
  responseRatePercent: number | null;
  totalRespondents: number;
  isPrivacySuppressed: boolean; // Suppressed if respondents < 15
  evidenceSourceRef: string;
  lastUpdated: string;
}

export interface EquityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  metricCategory: 'RETENTION_GAP' | 'COMPLETION_GAP' | 'GATEWAY_PROGRESSION_GAP' | 'SUPPORT_UTILIZATION_GAP';
  comparisonGroupTitle: string;
  referenceCohortCode: string;
  observedDifferenceRatePercent: number | null; // neutral terminology
  methodologyDescription: string;
  isPrivacySuppressed: boolean;
  status: ObservationStatus;
  evidenceSourceRef: string;
  lastAssessedAt: string;
}

export interface StudentSuccessRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  riskCode: string;
  title: string;
  category: 'RETENTION_DECLINE' | 'COMPLETION_BARRIER' | 'GATEWAY_BOTTLENECK' | 'ADVISING_OVERLOAD' | 'EQUITY_DISPARITY';
  severityScore: number; // 1-10
  likelihoodScore: number; // 1-10
  exposureMultiplier: number; // e.g. 1.0 - 2.0
  compositeRiskScore: number; // (severity * likelihood * exposureMultiplier)
  riskLevel: SuccessRiskLevel;
  residualRiskScore: number;
  mitigationPlanRef?: string;
  ownerId: string;
  lastEvaluatedAt: string;
  isAccepted: boolean;
}

export interface SuccessBenchmark {
  id: string;
  tenantId: string;
  campusScope: string;
  metricCode: string;
  benchmarkType: 'INTERNAL_HISTORICAL' | 'PEER_COHORT' | 'STRATEGIC_TARGET' | 'ACCREDITATION_STANDARD';
  sourceTitle: string;
  benchmarkValuePercent: number;
  effectivePeriod: string;
  confidenceRating: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: 'CERTIFIED' | 'PROVISIONAL' | 'UNVERIFIED';
  verifiedBy?: string;
  updatedAt: string;
}

export interface SuccessForecast {
  id: string;
  tenantId: string;
  campusScope: string;
  forecastCode: string;
  metricCode: string;
  state: SuccessForecastState;
  forecastHorizon: string; // e.g. "AY 2027-2028 (6-Year Target)"
  baselineRatePercent: number;
  projectedRatePercent: number;
  methodology: string;
  assumptions: string[];
  limitations: string;
  confidenceInterval: string; // e.g. "± 2.4%"
  ownerId: string;
  approverId?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface SuccessSimulationScenario {
  id: string;
  simulationType: SuccessSimulationType;
  title: string;
  description: string;
  baselineRetentionPercent: number;
  simulatedRetentionPercent: number;
  retentionShockDelta: number;
  baselineCompletionPercent: number;
  simulatedCompletionPercent: number;
  completionShockDelta: number;
  affectedCohortCount: number;
  estimatedInterventionBudgetExposureUSD: number;
  isSandboxMode: boolean; // ALWAYS TRUE
  zeroProductionMutation: boolean; // ALWAYS TRUE
  executedAt: string;
}

export interface SuccessResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  supportRedundancyScore: number; // 0-100
  advisingCapacityScore: number; // 0-100
  gatewayCourseResilienceScore: number; // 0-100
  dataAvailabilityScore: number; // 0-100
  keyPersonDependencyScore: number; // 0-100 (inverted: lower dependency is better)
  emergencySupportReadinessScore: number; // 0-100
  compositeResilienceScore: number; // 0-100
  rating: SuccessResilienceRating;
  vulnerabilityAreas: string[];
  assessedAt: string;
}

export interface SuccessException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionCode: string;
  title: string;
  rationale: string;
  affectedPolicyRuleRef: string;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  compensatingControls: string[];
  requesterId: string;
  approverId: string;
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'EXPIRED';
  effectiveDate: string;
  expiryDate: string;
  reviewDate: string;
  isExpired: boolean;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface SuccessDiagnosticFinding {
  id: string;
  code: string;
  category:
    | 'MISSING_RETENTION_DATA'
    | 'INVALID_DENOMINATOR'
    | 'STALE_METRICS'
    | 'UNSUPPORTED_SUCCESS_CLAIM'
    | 'ORPHAN_REFERENCE'
    | 'OVERDUE_INTERVENTION'
    | 'INEFFECTIVE_INTERVENTION'
    | 'PROGRESSION_BOTTLENECK'
    | 'GATEWAY_COURSE_EXPOSURE'
    | 'SUPPORT_CAPACITY_GAP'
    | 'ADVISING_OVERLOAD'
    | 'EXPIRED_ALERT_RULE'
    | 'UNVERIFIED_FORECAST'
    | 'PRIVACY_CELL_SUPPRESSION_VIOLATION'
    | 'SOD_VIOLATION'
    | 'EXPIRED_EXCEPTION'
    | 'TENANT_LEAK_ATTEMPT';
  severity: SuccessFindingSeverity;
  title: string;
  description: string;
  affectedEntityRef: string;
  remediationAction: string;
  detectedAt: string;
}

export interface SuccessAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  evidenceRef?: string;
  decisionRef?: string;
  provenanceHash: string;
}

export interface SuccessSecurityVerificationResult {
  testId: string;
  category: string;
  name: string;
  passed: boolean;
  details: string;
  timestamp: string;
}
