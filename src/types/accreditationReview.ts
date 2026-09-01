// EMS Phase 7.35: Institutional Accreditation, Regulatory Submission & External Review Governance Engine Types

export type AccreditationFrameworkCode = 
  | 'NAAC'
  | 'NBA'
  | 'UGC'
  | 'AICTE'
  | 'NIRF'
  | 'ISO_21001'
  | 'AACSB'
  | 'ABET'
  | 'CUSTOM';

export type AccreditationCycleStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'SELF_STUDY'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVIEW_COMPLETED'
  | 'DECISION_PENDING'
  | 'ACCREDITED'
  | 'CONDITIONAL'
  | 'EXPIRED'
  | 'CLOSED';

export type AccreditationSubmissionStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'APPROVED'
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'UNDER_EXTERNAL_REVIEW'
  | 'DECIDED'
  | 'ARCHIVED';

export type FindingLifecycleStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'ACTION_REQUIRED'
  | 'UNDER_REMEDIATION'
  | 'READY_FOR_VERIFICATION'
  | 'VERIFIED'
  | 'CLOSED';

export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RegulatoryInspectionStatus =
  | 'PLANNED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'FINDINGS_ISSUED'
  | 'RESPONSE_REQUIRED'
  | 'RESPONSE_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CLOSED';

export type AccreditationDecisionType =
  | 'ACCREDITED'
  | 'CONDITIONALLY_ACCREDITED'
  | 'DEFERRED'
  | 'NOT_ACCREDITED'
  | 'REACCREDITATION_REQUIRED';

export type CorrespondenceDirection = 'INBOUND' | 'OUTBOUND';

export type EvidenceVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'NEEDS_REVISION';

export interface AuditMetadata {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy?: string;
  soDVerified?: boolean;
  overrideJustification?: string;
  overrideActorId?: string;
  overrideTimestamp?: string;
}

// 1. Accreditation Body
export interface AccreditationBody {
  id: string;
  tenantId: string;
  campusId?: string;
  code: AccreditationFrameworkCode | string;
  name: string;
  description: string;
  regulatoryJurisdiction: string; // e.g., 'National', 'International', 'State'
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  validityYearsDefault: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 2. Accreditation Criterion Definition
export interface AccreditationCriterion {
  id: string;
  tenantId: string;
  accreditationBodyId: string;
  frameworkCode: string;
  criterionCode: string; // e.g. "C1.1", "Criteria 2"
  title: string;
  description: string;
  category: string;
  weight: number;
  maxScore: number;
  isMandatory: boolean;
  scoringModel: 'QUANTITATIVE' | 'QUALITATIVE' | 'HYBRID';
  evidenceRequirements: string[];
  responseRequirements: string;
  assignedOwnerUserId?: string;
  validFrom: string;
  validTo?: string;
  status: 'ACTIVE' | 'DEPRECATED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 3. Accreditation Cycle
export interface AccreditationCycle {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  accreditationBodyId: string;
  frameworkCode: string;
  targetAcademicYearId?: string;
  startDate: string;
  targetSubmissionDate: string;
  completionDate?: string;
  status: AccreditationCycleStatus;
  leadCoordinatorUserId: string;
  selfStudyAuthorUserId: string;
  finalApproverUserId?: string;
  overallScoreTarget?: number;
  achievedGrade?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 4. Submission Version & Main Submission
export interface SubmissionVersion {
  versionNumber: number;
  title: string;
  compiledAt: string;
  compiledBy: string;
  changeSummary: string;
  documentRegistryId?: string; // Reference to compiled PDF in Document Registry
  isLocked: boolean;
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface AccreditationSubmission {
  id: string;
  tenantId: string;
  campusId?: string;
  cycleId: string;
  title: string;
  submissionCode: string;
  currentVersion: number;
  versions: SubmissionVersion[];
  status: AccreditationSubmissionStatus;
  submittedAt?: string;
  submittedBy?: string;
  internalApprovedAt?: string;
  internalApprovedBy?: string;
  externalAcknowledgedAt?: string;
  externalRefNumber?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 5. Criterion Response
export interface CriterionResponse {
  id: string;
  tenantId: string;
  submissionId: string;
  criterionId: string;
  criterionCode: string;
  narrativeResponse: string;
  quantitativeScore?: number;
  maxScore: number;
  assignedOwnerUserId: string;
  lastEditedBy: string;
  version: number;
  status: 'DRAFT' | 'COMPLETED' | 'VERIFIED' | 'NEEDS_REVISION';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 6. Evidence Submission & Mapping
export interface EvidenceMapping {
  id: string;
  tenantId: string;
  campusId?: string;
  criterionId: string;
  criterionCode: string;
  documentRegistryId: string; // Authoritative Phase 7.27 Document Registry ID
  documentTitle: string;
  documentCategory: string;
  relevanceNarrative: string;
  evidenceType: 'POLICY' | 'REPORT' | 'MINUTES' | 'CERTIFICATE' | 'DATA_SHEET' | 'AUDIT_LOG' | 'OTHER';
  validFrom: string;
  validTo?: string;
  isMandatory: boolean;
  mappedBy: string;
  mappedAt: string;
  verificationStatus: EvidenceVerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  defectFlags?: ('MISSING' | 'EXPIRED' | 'UNVERIFIED' | 'ORPHAN' | 'WRONG_CRITERION' | 'DUPLICATE')[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface EvidenceSubmission {
  id: string;
  tenantId: string;
  submissionId: string;
  evidenceMappingId: string;
  criterionId: string;
  documentRegistryId: string;
  status: 'INCLUDED' | 'EXCLUDED';
  createdAt: string;
  createdBy: string;
}

// 7. External Reviewer & Peer Review Visit
export interface ExternalReviewer {
  id: string;
  tenantId: string;
  fullName: string;
  email: string;
  organization: string;
  designation: string;
  accreditationBodyId: string;
  role: 'CHAIR' | 'MEMBER_COORDINATOR' | 'PEER_EVALUATOR' | 'OBSERVER';
  specializationArea: string;
  contactNumberPrivacyMasked?: string;
  status: 'ACTIVE' | 'COMPLETED';
  createdAt: string;
}

export interface ReviewMeeting {
  id: string;
  title: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  location: string;
  stakeholders: string[]; // e.g. "Faculty", "Students", "Management"
  minutesSummary?: string;
}

export interface ReviewAgenda {
  dayNumber: number;
  date: string;
  items: {
    timeSlot: string;
    activity: string;
    responsiblePerson: string;
  }[];
}

export interface ReviewVisit {
  id: string;
  tenantId: string;
  campusId?: string;
  cycleId: string;
  accreditationBodyId: string;
  reviewTitle: string;
  startDate: string;
  endDate: string;
  reviewers: ExternalReviewer[];
  agendas: ReviewAgenda[];
  meetings: ReviewMeeting[];
  evidenceRequestsCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'REPORT_PENDING' | 'COMPLETED';
  finalReportDocumentRegistryId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ReviewObservation {
  id: string;
  tenantId: string;
  reviewVisitId: string;
  criterionId?: string;
  criterionCode?: string;
  reviewerId: string;
  reviewerName: string;
  observationType: 'STRENGTH' | 'WEAKNESS' | 'OPPORTUNITY' | 'CONCERN';
  description: string;
  observedAt: string;
}

// 8. Review Findings & Recommendations
export interface ReviewFinding {
  id: string;
  tenantId: string;
  campusId?: string;
  reviewVisitId?: string;
  inspectionId?: string;
  cycleId?: string;
  findingCode: string;
  title: string;
  description: string;
  criterionId?: string;
  severity: FindingSeverity;
  priorityScore: number; // Computed score
  status: FindingLifecycleStatus;
  remediationPlan?: string;
  remediationEvidenceDocRegistryId?: string;
  responsibleOwnerUserId: string;
  dueDate: string;
  closedAt?: string;
  closedBy?: string;
  closureVerificationNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ComplianceObservation {
  id: string;
  tenantId: string;
  reviewVisitId: string;
  regulatoryBody: string;
  clauseReference: string;
  observationDetails: string;
  complianceState: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
  createdAt: string;
}

export interface AccreditationRecommendation {
  id: string;
  tenantId: string;
  cycleId: string;
  recommendationCode: string;
  description: string;
  targetDomain: string;
  isMandatoryForReaccreditation: boolean;
  status: 'OPEN' | 'IN_PROGRESS' | 'ADDRESS';
  createdAt: string;
  createdBy: string;
}

// 9. Institutional Commitments
export interface InstitutionalCommitment {
  id: string;
  tenantId: string;
  campusId?: string;
  sourceType: 'ACCREDITATION_RECOMMENDATION' | 'REGULATOR_DIRECTION' | 'PEER_REVIEW' | 'STATUTORY' | 'IMPROVEMENT';
  sourceReferenceId?: string;
  commitmentTitle: string;
  description: string;
  responsibleOwnerUserId: string;
  targetCompletionDate: string;
  progressPercentage: number;
  evidenceDocumentRegistryId?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'UNDER_VERIFICATION' | 'CLOSED' | 'OVERDUE';
  verifiedBy?: string;
  verifiedAt?: string;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 10. Regulatory Inspection Engine
export interface InspectionFinding {
  id: string;
  findingTitle: string;
  findingDescription: string;
  severity: FindingSeverity;
  correctiveActionRequired: string;
  complianceDeadline: string;
  isResolved: boolean;
}

export interface RegulatoryInspection {
  id: string;
  tenantId: string;
  campusId?: string;
  regulatoryBody: string; // e.g., 'AICTE', 'UGC', 'State Higher Ed Council'
  inspectionType: 'ROUTINE' | 'SURPRISE' | 'COMPLAINT_BASED' | 'APPROVAL_RENEWAL';
  scheduledDate: string;
  completedDate?: string;
  inspectionScope: string;
  inspectionTeamLead: string;
  inspectionTeamMembers: string[];
  findings: InspectionFinding[];
  requiredResponseNarrative?: string;
  submittedResponseNarrative?: string;
  responseSubmittedAt?: string;
  responseSubmittedBy?: string;
  responseApprovedBy?: string; // SoD check
  complianceDeadline?: string;
  status: RegulatoryInspectionStatus;
  officialReportDocumentRegistryId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CorrectiveActionReference {
  id: string;
  tenantId: string;
  findingId: string;
  qualityCapaId?: string; // Reference to Phase 7.34 Quality CAPA ID if linked
  actionPlan: string;
  targetDate: string;
  certifiedBy?: string;
  certifiedAt?: string;
  status: 'OPEN' | 'CERTIFIED' | 'REJECTED';
  createdAt: string;
  createdBy: string;
}

// 11. Correspondence Governance
export interface AccreditationCorrespondence {
  id: string;
  tenantId: string;
  campusId?: string;
  direction: CorrespondenceDirection;
  senderReference: string;
  recipientReference: string;
  subject: string;
  correspondenceDate: string;
  referenceNumber: string;
  linkedCycleId?: string;
  linkedInspectionId?: string;
  documentRegistryId: string; // Reference to Document Registry
  summary: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 12. Accreditation Decision
export interface AccreditationDecision {
  id: string;
  tenantId: string;
  campusId?: string;
  cycleId: string;
  accreditationBodyId: string;
  decisionType: AccreditationDecisionType;
  officialGradeOrCGPA?: string; // e.g. "A++", "3.62/4.00"
  effectiveDate: string;
  expiryDate: string;
  decisionReferenceNumber: string;
  officialLetterDocumentRegistryId?: string;
  recordedBy: string; // User ID
  authorizedBy: string; // SoD User ID
  recordedAt: string;
  isImmutable: boolean;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 13. Accreditation Certificate
export interface AccreditationCertificate {
  id: string;
  tenantId: string;
  campusId?: string;
  accreditationBodyId: string;
  accreditationCycleId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  gradeStatus: string;
  accreditationScope: string; // e.g. "B.Tech Computer Science Program", "Entire Institution"
  documentRegistryId: string; // Document Registry ID
  isExpiringSoon?: boolean; // Within 90 days
  isExpired?: boolean;
  hasScopeMismatch?: boolean;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 14. Accreditation Analytics & Readiness
export interface AccreditationAnalytics {
  activeCyclesCount: number;
  submissionCompletionPercentage: number;
  evidenceCompletenessPercentage: number;
  evidenceVerificationBacklogCount: number;
  openFindingsCount: number;
  overdueCommitmentsCount: number;
  overallReviewReadinessScore: number;
  criterionReadinessPercentage: number;
  inspectionReadinessScore: number;
  accreditationExpiryHorizonDays?: number;
  capaClosureRatePercentage: number;
  accreditationRiskIndicator: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
