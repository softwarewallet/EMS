/**
 * EMS Phase 7.65: Institutional Quality Assurance, Accreditation, Continuous Improvement & Organizational Excellence Governance Engine
 * Module ID: mod_quality_assurance_governance
 */

export type QualityFrameworkCategory =
  | 'INSTITUTIONAL_QUALITY'
  | 'ACADEMIC_QUALITY'
  | 'RESEARCH_QUALITY'
  | 'STUDENT_SUCCESS'
  | 'SERVICE_QUALITY'
  | 'OPERATIONAL_EXCELLENCE'
  | 'GOVERNANCE'
  | 'COMPLIANCE'
  | 'ACCREDITATION'
  | 'REGULATORY'
  | 'CUSTOM';

export type QualityFrameworkLifecycle =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type AccreditationCycleState =
  | 'PLANNING'
  | 'SELF_STUDY'
  | 'EVIDENCE_REVIEW'
  | 'INTERNAL_REVIEW'
  | 'SUBMISSION_READY'
  | 'EXTERNAL_REVIEW'
  | 'FINDINGS_RECEIVED'
  | 'REMEDIATION'
  | 'FOLLOW_UP'
  | 'CLOSED';

export type EvidenceCoverageStatus =
  | 'FULL'
  | 'PARTIAL'
  | 'MISSING'
  | 'STALE'
  | 'UNVERIFIED';

export type EvidenceState =
  | 'REQUESTED'
  | 'RECEIVED'
  | 'VERIFIED'
  | 'ACCEPTED'
  | 'SUPERSEDED'
  | 'RETIRED';

export type MetricObservationType =
  | 'ACTUAL'
  | 'FORECAST'
  | 'TARGET'
  | 'BENCHMARK'
  | 'SCENARIO'
  | 'INSUFFICIENT_DATA';

export type QualityHealthLevel =
  | 'EXCELLENT'
  | 'STRONG'
  | 'ADEQUATE'
  | 'VULNERABLE'
  | 'CRITICAL'
  | 'INSUFFICIENT_DATA';

export type ProgramReviewType =
  | 'ACADEMIC_PROGRAM'
  | 'DEPARTMENT'
  | 'ADMINISTRATIVE_SERVICE'
  | 'RESEARCH_UNIT'
  | 'INSTITUTIONAL';

export type ProgramReviewLifecycle =
  | 'PLANNED'
  | 'INITIATED'
  | 'EVIDENCE_COLLECTION'
  | 'SELF_REVIEW'
  | 'PEER_REVIEW'
  | 'ACTION_PLANNING'
  | 'APPROVED'
  | 'MONITORING'
  | 'COMPLETED'
  | 'ARCHIVED';

export type ImprovementMethodology =
  | 'PDCA'
  | 'CAPA'
  | 'ROOT_CAUSE_ANALYSIS'
  | 'CORRECTIVE_ACTION'
  | 'PREVENTIVE_ACTION'
  | 'PROCESS_IMPROVEMENT'
  | 'LEAN'
  | 'SIX_SIGMA_REFERENCE'
  | 'OTHER';

export type ImprovementLifecycleState =
  | 'IDENTIFIED'
  | 'ANALYZED'
  | 'PLANNED'
  | 'APPROVED'
  | 'IMPLEMENTING'
  | 'VALIDATION'
  | 'EFFECTIVENESS_REVIEW'
  | 'COMPLETED'
  | 'SUSTAINED';

export type RootCauseMethod =
  | 'FIVE_WHYS'
  | 'FISHBONE'
  | 'PARETO_REFERENCE'
  | 'FAULT_TREE_REFERENCE'
  | 'PROCESS_ANALYSIS'
  | 'OTHER';

export type QualityFindingSeverity =
  | 'OBSERVATION'
  | 'MINOR'
  | 'MAJOR'
  | 'CRITICAL';

export type QualityFindingLifecycleState =
  | 'OPEN'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'ACTION_IN_PROGRESS'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'CLOSED';

export type QualityRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'EXTREME';

export type MaturityLevel =
  | 'INITIAL'
  | 'DEVELOPING'
  | 'DEFINED'
  | 'MANAGED'
  | 'OPTIMIZED';

export type QualityResilienceRating =
  | 'STRONG'
  | 'ADEQUATE'
  | 'VULNERABLE'
  | 'SEVERELY_EXPOSED';

export type QualitySimulationType =
  | 'ACCREDITATION_EVIDENCE_GAP'
  | 'MAJOR_PROGRAM_REVIEW_FINDING'
  | 'CRITICAL_QUALITY_DECLINE'
  | 'KEY_PERSON_LOSS'
  | 'DATA_QUALITY_FAILURE'
  | 'ASSESSMENT_DATA_GAP'
  | 'REGULATORY_REQUIREMENT_CHANGE'
  | 'EVIDENCE_STALENESS'
  | 'IMPROVEMENT_PLAN_FAILURE'
  | 'RECURRING_FINDING'
  | 'QUALITY_RESOURCE_REDUCTION'
  | 'MULTI_CAMPUS_QUALITY_EVENT';

// Reference-Only Data Integration Layer
export interface QualityGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  departmentScope?: string;
  programScope?: string;
  referenceType:
    | 'STUDENT_RECORD'
    | 'PROGRAM'
    | 'COURSE'
    | 'DEPARTMENT'
    | 'FACULTY'
    | 'EMPLOYEE'
    | 'ASSESSMENT'
    | 'SURVEY'
    | 'DOCUMENT'
    | 'ACCREDITATION_RECORD'
    | 'REGULATORY_REQUIREMENT'
    | 'FINANCE_ACCOUNT'
    | 'BUDGET_CODE'
    | 'RESEARCH_PROJECT'
    | 'FACILITY';
  authoritativeExternalId: string;
  sourceSystemIdentifier: string;
  isAuthoritative: boolean;
  provenanceHash: string;
  capturedAt: string;
  notes?: string;
}

export interface QualityPolicyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  policyCode: string;
  title: string;
  category: QualityFrameworkCategory;
  version: string;
  lifecycle: QualityFrameworkLifecycle;
  effectiveDate: string;
  reviewDate: string;
  ownerId: string;
  approverId?: string;
  governingStandards: string[];
  mandatoryEvidenceCategories: string[];
  statement: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface QualityCriterion {
  id: string;
  criterionCode: string;
  title: string;
  description: string;
  weight: number;
  coverageStatus: EvidenceCoverageStatus;
  requiredEvidenceTypes: string[];
  responsibleDepartment: string;
  targetBenchmark?: number;
  actualScore?: number;
  evidenceReferenceIds: string[];
  findingsCount: number;
  lastAssessedAt?: string;
}

export interface QualityStandard {
  id: string;
  standardCode: string;
  title: string;
  description: string;
  domain: string;
  criteria: QualityCriterion[];
  overallComplianceScore: number;
  isMandatory: boolean;
}

export interface QualityFramework {
  id: string;
  tenantId: string;
  campusScope: string;
  frameworkCode: string;
  title: string;
  category: QualityFrameworkCategory;
  lifecycle: QualityFrameworkLifecycle;
  version: string;
  effectiveDate: string;
  reviewFrequencyMonths: number;
  ownerId: string;
  approverId?: string;
  responsibleUnits: string[];
  standards: QualityStandard[];
  overallQualityScore: number;
  evidenceCoveragePercent: number;
  approvalMetadata?: {
    approvedBy: string;
    approvedAt: string;
    decisionNote: string;
  };
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface AccreditationRequirement {
  id: string;
  requirementCode: string;
  title: string;
  description: string;
  category: string;
  isCoreRequirement: boolean;
  complianceStatus: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT' | 'INSUFFICIENT_DATA';
  mappedCriterionIds: string[];
  evidenceReferenceIds: string[];
  remediationPlanId?: string;
  findings: string[];
}

export interface AccreditationFinding {
  id: string;
  findingCode: string;
  bodyReference: string;
  requirementRef: string;
  findingType: 'RECOMMENDATION' | 'REQUIREMENT' | 'AFFIRMATION' | 'SANCTION_RISK';
  description: string;
  severity: QualityFindingSeverity;
  issuedAt: string;
  dueAt: string;
  assignedOwnerId: string;
  remediationStatus: 'OPEN' | 'IN_PROGRESS' | 'REMEDIATED' | 'VERIFIED';
  evidenceVerificationId?: string;
}

export interface AccreditationCycle {
  id: string;
  tenantId: string;
  campusScope: string;
  accreditationBodyName: string;
  frameworkRef: string;
  cycleName: string;
  academicYearsCovered: string[];
  state: AccreditationCycleState;
  selfStudyLeadId: string;
  leadReviewerId?: string;
  submissionDeadline: string;
  siteVisitDate?: string;
  decisionExpectedDate?: string;
  reaffirmationStatus?: 'RENEWED' | 'CONDITIONAL' | 'DEFERRED' | 'PROBATION' | 'INSUFFICIENT_DATA';
  requirements: AccreditationRequirement[];
  findings: AccreditationFinding[];
  readinessScore: number;
  evidenceReadinessPercent: number;
  lastUpdated: string;
}

export interface AccreditationFramework {
  id: string;
  tenantId: string;
  campusScope: string;
  accreditingBodyId: string;
  bodyName: string;
  frameworkName: string;
  regionOrScope: string;
  recognitionStatus: 'RECOGNIZED' | 'REGIONAL' | 'SPECIALIZED' | 'NATIONAL';
  cycles: AccreditationCycle[];
}

export interface AccreditationBodyReference {
  id: string;
  bodyCode: string;
  name: string;
  jurisdiction: string;
  website: string;
  contactEmail: string;
  recognizedBy: string;
}

export interface QualityIndicator {
  id: string;
  indicatorCode: string;
  title: string;
  unit: string;
  baselineValue: number;
  targetValue: number;
  actualValue?: number;
  benchmarkValue?: number;
  metricType: MetricObservationType;
  achievementPercentage?: number;
  variance?: number;
  trendDirection: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
  calculationBasis: string;
  lastObservedAt?: string;
  authoritativeSourceRef: string;
}

export interface QualityObjective {
  id: string;
  objectiveCode: string;
  title: string;
  description: string;
  strategicGoalRef?: string;
  indicators: QualityIndicator[];
  overallAttainment: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'CRITICAL' | 'ACHIEVED' | 'INSUFFICIENT_DATA';
}

export interface InstitutionalObjective {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleYear: string;
  title: string;
  pillar: string;
  qualityObjectives: QualityObjective[];
  compositeScore: number;
  healthLevel: QualityHealthLevel;
}

export interface InstitutionalEffectivenessFramework {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleYear: string;
  objectives: InstitutionalObjective[];
  overallEffectivenessIndex: number;
  lastAssessedAt: string;
  leadAnalystId: string;
}

export interface QualityMetricObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  metricCode: string;
  metricName: string;
  category: QualityFrameworkCategory;
  observationType: MetricObservationType;
  value: number | null;
  target: number;
  baseline: number;
  benchmark?: number;
  variancePercent?: number;
  achievementPercent?: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
  confidenceScore: number;
  calculationBasis: string;
  authoritativeSourceRef: string;
  capturedAt: string;
  recordedBy: string;
}

export interface BenchmarkReference {
  id: string;
  tenantId: string;
  benchmarkCode: string;
  metricRef: string;
  cohortName: string;
  cohortType: 'REGIONAL_PEERS' | 'NATIONAL_TOP_DECILE' | 'GLOBAL_RESEARCH' | 'REGULATORY_MINIMUM';
  targetValue: number;
  peerMedianValue: number;
  sourceDocumentRef: string;
  effectiveYear: string;
}

export interface ProgramReviewFinding {
  id: string;
  findingCode: string;
  area: 'CURRICULUM' | 'FACULTY_CREDENTIALS' | 'STUDENT_RETENTION' | 'RESOURCE_ADEQUACY' | 'ASSESSMENT_RIGOR';
  description: string;
  severity: QualityFindingSeverity;
  recommendation: string;
  assignedTo: string;
  dueDate: string;
  actionStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ProgramReview {
  id: string;
  tenantId: string;
  campusScope: string;
  programReviewCode: string;
  reviewType: ProgramReviewType;
  programOrDepartmentName: string;
  authoritativeProgramIdRef: string;
  lifecycle: ProgramReviewLifecycle;
  cycleYear: string;
  leadReviewerId: string;
  externalPeerReviewer?: string;
  startDate: string;
  scheduledCompletionDate: string;
  actualCompletionDate?: string;
  findings: ProgramReviewFinding[];
  evidenceIds: string[];
  overallRating: 'COMMENDED' | 'SATISFACTORY' | 'CONDITIONAL_APPROVAL' | 'SUBSTANTIAL_DEFICIENCIES';
  actionPlanApproved: boolean;
  approverId?: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface ProgramReviewCycle {
  id: string;
  tenantId: string;
  campusScope: string;
  cycleName: string;
  academicYear: string;
  reviews: ProgramReview[];
  completionPercentage: number;
}

export interface AcademicQualityReview extends ProgramReview {
  curriculumRevisionApproved: boolean;
  learningOutcomesAssessedCount: number;
  facultyCredentialVerificationRate: number;
}

export interface DepartmentQualityReview extends ProgramReview {
  departmentHeadId: string;
  operationalEfficiencyScore: number;
  stakeholderSatisfactionScore: number;
}

export interface ServiceQualityReview extends ProgramReview {
  serviceUnitName: string;
  slaAttainmentRate: number;
  studentSatisfactionIndex: number;
}

export interface EvidenceProvenance {
  sourceSystemIdentifier: string;
  sourceDocumentRef: string;
  sourceVersionRef: string;
  capturedAt: string;
  capturedBy: string;
  checksumSha256: string;
  integrityVerified: boolean;
}

export interface EvidenceVerification {
  verificationId: string;
  verifierId: string;
  verifiedAt: string;
  verificationMethod: 'SOURCE_AUDIT' | 'DOCUMENT_INSPECTION' | 'INDEPENDENT_RECALCULATION' | 'INTERVIEW';
  verificationNotes: string;
  status: 'VERIFIED' | 'REJECTED' | 'PROVISIONAL';
}

export interface AssessmentEvidence {
  id: string;
  tenantId: string;
  campusScope: string;
  evidenceCode: string;
  title: string;
  description: string;
  state: EvidenceState;
  classification: 'PUBLIC' | 'INSTITUTIONAL_INTERNAL' | 'CONFIDENTIAL_ACCREDITATION' | 'RESTRICTED_PII_PROTECTED';
  authoritativeSourceRef: string;
  sourceType: 'LMS_RUBRIC_AGGREGATION' | 'SIS_RETENTION_COHORT' | 'HRIS_FACULTY_ROSTER' | 'FINANCE_AUDIT' | 'SURVEY_RESULTS' | 'COMMITTEE_MINUTES';
  effectivePeriod: string;
  ownerId: string;
  provenance: EvidenceProvenance;
  verification?: EvidenceVerification;
  relatedCriterionIds: string[];
  relatedFindingIds: string[];
  isStale: boolean;
  expirationDate?: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface EvidenceArtifactReference {
  id: string;
  evidenceId: string;
  artifactName: string;
  fileType: string;
  externalStorageUriRef: string;
  fileSizeBytes: number;
  sha256Hash: string;
}

export interface EvidenceGap {
  id: string;
  criterionCode: string;
  standardTitle: string;
  gapSeverity: 'CRITICAL_PREREQUISITE' | 'SUBSTANTIVE' | 'DOCUMENTARY_ONLY';
  identifiedAt: string;
  remediationDueDate: string;
  responsibleOwnerId: string;
  status: 'OPEN' | 'ASSIGNED' | 'EVIDENCE_SUBMITTED' | 'RESOLVED';
}

export interface EvidenceRequest {
  id: string;
  tenantId: string;
  campusScope: string;
  requestCode: string;
  targetCriterionId: string;
  targetDepartment: string;
  requestedBy: string;
  assignedTo: string;
  requiredByDate: string;
  description: string;
  status: 'PENDING' | 'FULFILLED' | 'OVERDUE' | 'CANCELLED';
  fulfilledEvidenceId?: string;
}

export interface QualityRootCauseAnalysis {
  id: string;
  tenantId: string;
  method: RootCauseMethod;
  problemStatement: string;
  contributingFactors: string[];
  rootCauses: string[];
  evidenceReferences: string[];
  assumptions: string[];
  confidenceScore: number;
  approvedConclusion?: string;
  analystId: string;
  approvedBy?: string;
}

export interface QualityCorrectiveAction {
  id: string;
  actionCode: string;
  title: string;
  description: string;
  assignedOwnerId: string;
  targetDate: string;
  completionDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
  verificationEvidenceId?: string;
  effectivenessRating?: 'HIGHLY_EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE';
}

export interface QualityPreventiveAction {
  id: string;
  actionCode: string;
  title: string;
  description: string;
  assignedOwnerId: string;
  targetDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface QualityFinding {
  id: string;
  tenantId: string;
  campusScope: string;
  findingCode: string;
  title: string;
  source: 'ACCREDITATION_AUDIT' | 'INTERNAL_QUALITY_REVIEW' | 'PROGRAM_REVIEW' | 'STAKEHOLDER_COMPLAINT' | 'DIAGNOSTIC_SCAN';
  severity: QualityFindingSeverity;
  lifecycle: QualityFindingLifecycleState;
  criterionRef?: string;
  departmentScope: string;
  description: string;
  rootCauseAnalysis?: QualityRootCauseAnalysis;
  correctiveActions: QualityCorrectiveAction[];
  preventiveActions: QualityPreventiveAction[];
  identifiedBy: string;
  assignedOwnerId: string;
  identifiedAt: string;
  dueAt: string;
  closedAt?: string;
  verificationNotes?: string;
  verifiedBy?: string;
  isRecurring: boolean;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface ImprovementMilestone {
  id: string;
  title: string;
  targetDate: string;
  actualDate?: string;
  completed: boolean;
  evidenceRef?: string;
}

export interface ImprovementOutcome {
  metricRef: string;
  baseline: number;
  target: number;
  actualAchieved?: number;
  verifiedAt?: string;
}

export interface ImprovementPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  planCode: string;
  title: string;
  methodology: ImprovementMethodology;
  lifecycle: ImprovementLifecycleState;
  objective: string;
  findingRefs: string[];
  ownerId: string;
  approverId?: string;
  milestones: ImprovementMilestone[];
  outcomes: ImprovementOutcome[];
  resourcesAllocated: string[];
  riskAssessment: QualityRiskLevel;
  effectivenessVerified: boolean;
  verifierId?: string;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface ContinuousImprovementInitiative extends ImprovementPlan {
  sponsorExecutiveId: string;
  departmentScope: string;
  estimatedReturnOnQuality: string;
}

export interface QualityException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionCode: string;
  title: string;
  rationale: string;
  affectedCriterionCode: string;
  affectedDepartment: string;
  riskAssessment: QualityRiskLevel;
  compensatingControls: string[];
  requesterId: string;
  approverId?: string;
  approvalStatus: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  effectiveDate: string;
  expiryDate: string;
  reviewDate: string;
  isExpired: boolean;
  immutableCreatedAt: string;
  updatedAt: string;
}

export interface QualityWaiver extends QualityException {
  regulatoryAccreditationImpact: boolean;
}

export interface QualityControlTest {
  id: string;
  testCode: string;
  testName: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEMESTER' | 'ANNUAL';
  lastTestedAt: string;
  passed: boolean;
  defectCount: number;
  notes: string;
}

export interface QualityControl {
  id: string;
  controlCode: string;
  title: string;
  category: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
  ownerDepartment: string;
  tests: QualityControlTest[];
  effectivenessScore: number;
}

export interface QualityRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  riskCode: string;
  title: string;
  category: 'ACCREDITATION' | 'ACADEMIC_INTEGRITY' | 'STUDENT_OUTCOME' | 'DATA_QUALITY' | 'FACULTY_COMPLIANCE' | 'FACILITIES';
  severityScore: number; // 1-10
  likelihoodScore: number; // 1-10
  evidenceGapMultiplier: number; // 1.0 - 2.0
  stakeholderImpactScore: number; // 1-10
  regulatoryImpactScore: number; // 1-10
  compositeRiskScore: number; // calculated bounded 1-100
  riskLevel: QualityRiskLevel;
  mitigationControls: QualityControl[];
  residualRiskScore: number;
  ownerId: string;
  lastAssessedAt: string;
  isAccepted: boolean;
  acceptedBy?: string;
}

export interface QualityDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionCode: string;
  title: string;
  category: 'FRAMEWORK_APPROVAL' | 'ACCREDITATION_SUBMISSION' | 'CRITICAL_RISK_ACCEPTANCE' | 'EXCEPTION_GRANT' | 'PROGRAM_REVIEW_CLOSURE';
  summary: string;
  proposerId: string;
  approverId?: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  fourEyesVerified: boolean;
  decisionDate?: string;
  justification: string;
  immutableCreatedAt: string;
}

export interface QualityApproval {
  decisionId: string;
  approverId: string;
  role: string;
  approvedAt: string;
  notes: string;
}

export interface QualityActionItem {
  id: string;
  itemCode: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export interface QualityReviewMeeting {
  id: string;
  meetingCode: string;
  date: string;
  chairpersonId: string;
  attendeesCount: number;
  agenda: string[];
  actionItems: QualityActionItem[];
  minutesDocRef: string;
}

export interface QualityCommitteeGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  committeeCode: string;
  name: string;
  purpose: string;
  chairId: string;
  members: { userId: string; role: string }[];
  quorumRequirement: number;
  meetings: QualityReviewMeeting[];
  activeInitiatives: string[];
}

export interface StakeholderFeedbackReference {
  id: string;
  surveyIdRef: string;
  stakeholderGroup: 'STUDENTS' | 'FACULTY' | 'ALUMNI' | 'EMPLOYERS' | 'COMMUNITY';
  responseCount: number;
  satisfactionRatePercent: number;
  collectionPeriod: string;
  provenanceHash: string;
}

export interface SurveyObservationReference {
  id: string;
  surveyInstrumentName: string;
  npsScore?: number;
  overallSatisfactionPercent: number;
  sourceDocRef: string;
}

export interface StudentSuccessObservationReference {
  id: string;
  cohortYear: string;
  retentionRatePercent: number;
  graduationRateFourYear: number;
  graduationRateSixYear: number;
  employmentRateAtSixMonths: number;
  sourceAuthoritativeRef: string;
}

export interface LearningOutcomeObservationReference {
  id: string;
  programIdRef: string;
  courseIdRef: string;
  outcomeCode: string;
  assessmentCycle: string;
  masteryPercentage: number;
  studentsSampledCount: number;
  authoritativeLmsRef: string;
}

export interface InstitutionalBenchmarkObservation {
  id: string;
  benchmarkCode: string;
  targetPercent: number;
  actualPercent: number;
  variance: number;
  cohortMedian: number;
}

export interface MaturityDimensionAssessment {
  dimension:
    | 'GOVERNANCE'
    | 'LEADERSHIP'
    | 'STRATEGY'
    | 'ACADEMIC_QUALITY'
    | 'RESEARCH_QUALITY'
    | 'STUDENT_SUCCESS'
    | 'OPERATIONS'
    | 'DATA_QUALITY'
    | 'EVIDENCE_GOVERNANCE'
    | 'CONTINUOUS_IMPROVEMENT'
    | 'RISK_MANAGEMENT'
    | 'STAKEHOLDER_ENGAGEMENT';
  level: MaturityLevel;
  score: number; // 1-5
  evidenceReferences: string[];
  findingsCount: number;
  strengths: string[];
  opportunities: string[];
}

export interface MaturityAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentYear: string;
  dimensions: MaturityDimensionAssessment[];
  overallMaturityScore: number; // 1.0 - 5.0
  overallMaturityLevel: MaturityLevel;
  assessedBy: string;
  certifiedBy?: string;
  assessedAt: string;
}

export interface ExcellenceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  frameworkUsed: 'BALDRIGE_EDUCATION' | 'EFQM_EXCELLENCE' | 'CUSTOM_INSTITUTIONAL';
  leadershipScore: number;
  strategyScore: number;
  customersStudentsScore: number;
  workforceScore: number;
  operationsScore: number;
  resultsScore: number;
  totalScore: number; // Max 1000
  recognitionTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'INSUFFICIENT_DATA';
}

export interface QualityResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  evidenceAvailabilityScore: number;
  processRedundancyScore: number;
  keyPersonDependencyScore: number; // lower is better
  knowledgeContinuityScore: number;
  improvementSustainabilityScore: number;
  accreditationReadinessScore: number;
  compositeResilienceScore: number;
  rating: QualityResilienceRating;
  vulnerabilityAreas: string[];
  assessedAt: string;
}

export interface QualitySimulationScenario {
  id: string;
  simulationType: QualitySimulationType;
  scenarioTitle: string;
  description: string;
  isSandboxActive: boolean;
  simulatedParameters: Record<string, any>;
  predictedImpacts: {
    qualityIndexDelta: number;
    accreditationRiskDelta: number;
    criticalFindingsDelta: number;
    resourceRequirementEstimate: string;
  };
  simulatedAt: string;
  simulatedBy: string;
}

export interface QualityDiagnosticFinding {
  id: string;
  code: string;
  category: 'EVIDENCE_GAP' | 'STALE_EVIDENCE' | 'UNVERIFIED_EVIDENCE' | 'OVERDUE_PROGRAM_REVIEW' | 'OVERDUE_CAPA' | 'SOD_VIOLATION' | 'EXPIRED_EXCEPTION' | 'RECURRING_FINDING' | 'MISSING_BENCHMARK' | 'BOUNDARY_LEAK';
  severity: QualityFindingSeverity;
  title: string;
  description: string;
  affectedEntityRef: string;
  remediationRecommendation: string;
  autoDetectedAt: string;
}

export interface QualityAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  previousStateJson?: string;
  newStateJson?: string;
  evidenceRef?: string;
  decisionRef?: string;
  provenanceHash: string;
}

export interface SecurityVerificationResult {
  testId: string;
  category: string;
  description: string;
  passed: boolean;
  executionTimeMs: number;
  details: string;
}
