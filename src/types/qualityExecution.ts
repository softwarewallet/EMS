/**
 * EMS Phase 7.34 Institutional Assessment, Accreditation Evidence,
 * Continuous Improvement & Academic Quality Execution Governance Engine
 */

export type AssessmentCycleType =
  | 'ANNUAL'
  | 'SEMESTER'
  | 'PROGRAM_REVIEW'
  | 'DEPARTMENT_REVIEW'
  | 'ACCREDITATION'
  | 'INSTITUTIONAL_QUALITY'
  | 'OUTCOME_ASSESSMENT'
  | 'IMPROVEMENT_REVIEW';

export type AssessmentCycleStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export type QualityFrameworkType =
  | 'NAAC'
  | 'NBA'
  | 'AACSB'
  | 'ABET'
  | 'ISO_21001'
  | 'INSTITUTIONAL_QUALITY_FRAMEWORK'
  | string;

export type AssessmentSubmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'ACCEPTED'
  | 'REJECTED';

export type EvidenceVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ReviewType =
  | 'ANNUAL'
  | 'PERIODIC'
  | 'ACCREDITATION_PREP'
  | 'SPECIAL';

export type ProgramReviewStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export type InitiativeSourceType =
  | 'ASSESSMENT'
  | 'PROGRAM_REVIEW'
  | 'CAPA'
  | 'AUDIT_FINDING'
  | 'KPI_GAP'
  | 'RISK_MITIGATION';

export type InitiativePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InitiativeStatus =
  | 'PROPOSED'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'VERIFICATION'
  | 'COMPLETED'
  | 'CLOSED';

export type CAPASourceType =
  | 'AUDIT'
  | 'ASSESSMENT'
  | 'REVIEW'
  | 'INCIDENT'
  | 'KPI_DEFICIT';

export type CAPAActionType = 'CORRECTIVE' | 'PREVENTIVE' | 'BOTH';

export type RCAMethodology = 'FIVE_WHYS' | 'FISHBONE' | 'NARRATIVE';

export type CAPAStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'VERIFIED'
  | 'CLOSED';

export type ReviewDecisionType = 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';

export type ReadinessStatus =
  | 'NOT_READY'
  | 'IN_PROGRESS'
  | 'SUBSTANTIALLY_READY'
  | 'FULLY_READY';

export interface QualityAssessmentCycle {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  name: string;
  description: string;
  cycleType: AssessmentCycleType;
  startDate: string;
  endDate: string;
  status: AssessmentCycleStatus;
  ownerId: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualityCriterion {
  id: string;
  tenantId: string;
  campusId: string;
  framework: QualityFrameworkType;
  criterionCode: string;
  title: string;
  description: string;
  weight: number;
  evidenceRequired: boolean;
  responsibleOwnerId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface QualityIndicator {
  id: string;
  tenantId: string;
  campusId: string;
  criterionId: string;
  kpiId?: string; // Reference to Phase 7.29 KPI
  indicatorCode: string;
  name: string;
  description: string;
  measurementMethod: string;
  target: number;
  tolerance: number;
  weight: number;
  status: 'ACTIVE' | 'INACTIVE';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSubmission {
  id: string;
  tenantId: string;
  campusId: string;
  cycleId: string;
  criterionId: string;
  indicatorId?: string;
  submittedBy: string;
  submissionDate: string;
  actualValue: number;
  narrative: string;
  evidenceReferenceIds: string[]; // IDs of EvidenceMapping
  status: AssessmentSubmissionStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceMapping {
  id: string;
  tenantId: string;
  campusId: string;
  criterionId: string;
  assessmentId?: string;
  documentRegistryId: string; // Reference to Phase 7.27 Record
  evidenceType: string;
  evidencePeriod: string;
  relevanceScore: number;
  verificationStatus: EvidenceVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramQualityReview {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  departmentId: string;
  programId?: string;
  reviewPeriod: string;
  reviewType: ReviewType;
  reviewerIds: string[];
  findings: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  status: ProgramReviewStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImprovementInitiative {
  id: string;
  tenantId: string;
  campusId: string;
  sourceType: InitiativeSourceType;
  sourceId?: string;
  title: string;
  objective: string;
  ownerId: string;
  priority: InitiativePriority;
  startDate: string;
  dueDate: string;
  status: InitiativeStatus;
  successCriteria: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  outcome?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CAPAAction {
  id: string;
  tenantId: string;
  campusId: string;
  sourceType: CAPASourceType;
  sourceId?: string;
  actionType: CAPAActionType;
  rootCause: string;
  rcaMethodology?: RCAMethodology;
  correctiveAction: string;
  preventiveAction: string;
  ownerId: string;
  dueDate: string;
  status: CAPAStatus;
  evidenceReferenceIds: string[];
  verifiedBy?: string;
  verifiedAt?: string;
  closureNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualityReviewDecision {
  id: string;
  tenantId: string;
  campusId: string;
  reviewId: string;
  decision: ReviewDecisionType;
  rationale: string;
  reviewerId: string;
  createdAt: string;
}

export interface AccreditationEvidencePackage {
  id: string;
  tenantId: string;
  campusId: string;
  accreditationCycleId: string;
  name: string;
  criterionIds: string[];
  evidenceMappingIds: string[];
  completenessScore: number; // 0-100%
  readinessStatus: ReadinessStatus;
  preparedBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface QualityAnalytics {
  activeAssessmentCycles: number;
  completedAssessments: number;
  verificationBacklog: number;
  evidenceCompleteness: number;
  criterionReadiness: number;
  openCAPA: number;
  overdueCAPA: number;
  improvementInitiatives: number;
  improvementCompletionRate: number;
  programReviewCompletion: number;
  accreditationReadiness: number;
  qualityTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}
