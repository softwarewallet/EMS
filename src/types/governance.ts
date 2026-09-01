// Governance, Compliance, Accreditation & Institutional Quality Management Types
// Phase 7.24A Enterprise Domain Foundation

export type GovernanceBodyType =
  | 'BOARD_OF_GOVERNORS'
  | 'ACADEMIC_COUNCIL'
  | 'EXECUTIVE_COMMITTEE'
  | 'COMPLIANCE_COMMITTEE'
  | 'QUALITY_ASSURANCE'
  | 'ETHICS_COMMITTEE'
  | 'DEPARTMENTAL_COMMITTEE'
  | 'ADVISORY_BOARD'
  | 'OTHER';

export type GovernanceMemberRole =
  | 'CHAIR'
  | 'SECRETARY'
  | 'MEMBER'
  | 'OBSERVER'
  | 'ADVISOR';

export type GovernanceMeetingType =
  | 'REGULAR'
  | 'SPECIAL'
  | 'EMERGENCY'
  | 'ANNUAL'
  | 'AUDIT';

export type GovernanceMeetingStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'POSTPONED';

export type ResolutionDecision =
  | 'APPROVED'
  | 'REJECTED'
  | 'DEFERRED'
  | 'AMENDED'
  | 'NOTED';

export type ResolutionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUPERSEDED';

export type ActionItemPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActionItemStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED';

export type PolicyCategory =
  | 'ACADEMIC'
  | 'ADMINISTRATIVE'
  | 'FINANCIAL'
  | 'HR_STAFF'
  | 'STUDENT_AFFAIRS'
  | 'RESEARCH_ETHICS'
  | 'IT_SECURITY'
  | 'HEALTH_SAFETY'
  | 'GOVERNANCE'
  | 'QUALITY_COMPLIANCE';

export type PolicyScope =
  | 'INSTITUTION_WIDE'
  | 'CAMPUS_SPECIFIC'
  | 'DEPARTMENTAL'
  | 'ACADEMIC_PROGRAM';

export type PolicyStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'RETIRED';

export type ComplianceFrameworkCategory =
  | 'HIGHER_ED_MINISTRY'
  | 'NATIONAL_ACCREDITATION'
  | 'STATE_EDUCATION_BOARD'
  | 'DATA_PRIVACY'
  | 'LABOR_SAFETY'
  | 'FINANCIAL_REGULATION'
  | 'OTHER';

export type ComplianceObligationFrequency =
  | 'ONE_TIME'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUALLY'
  | 'ANNUALLY'
  | 'BIENNIALLY';

export type ComplianceStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'EXCEPTION'
  | 'CLOSED';

export type ControlEffectiveness =
  | 'EFFECTIVE'
  | 'NEEDS_IMPROVEMENT'
  | 'INEFFECTIVE'
  | 'NOT_TESTED';

export type AccreditationCycleStatus =
  | 'PLANNING'
  | 'SELF_STUDY'
  | 'SUBMITTED'
  | 'PEER_REVIEW'
  | 'ACCREDITED'
  | 'CONDITIONAL'
  | 'EXPIRED';

export type AccreditationCriterionStatus =
  | 'MET'
  | 'PARTIALLY_MET'
  | 'NOT_MET'
  | 'IN_PROGRESS'
  | 'NOT_APPLICABLE';

export type QualityIndicatorFrequency =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUALLY'
  | 'ANNUALLY'
  | 'PER_ACADEMIC_TERM';

export type QualityUnitOfMeasure =
  | 'PERCENTAGE'
  | 'SCORE'
  | 'COUNT'
  | 'RATIO'
  | 'DAYS';

export type QualityVerificationState =
  | 'ENTERED'
  | 'VERIFIED'
  | 'DISCREPANCY';

export type InstitutionalAuditType =
  | 'INTERNAL_ACADEMIC'
  | 'INTERNAL_ADMINISTRATIVE'
  | 'EXTERNAL_REGULATORY'
  | 'QUALITY_ACCREDITATION'
  | 'FINANCIAL_GOVERNANCE'
  | 'SAFETY_COMPLIANCE';

export type InstitutionalAuditStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED';

export type AuditFindingSeverity =
  | 'OBSERVATION'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type AuditFindingStatus =
  | 'OPEN'
  | 'CORRECTIVE_ACTION_REQUIRED'
  | 'UNDER_REVIEW'
  | 'CLOSED';

export type CorrectiveActionStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'VERIFICATION_PENDING'
  | 'CLOSED'
  | 'OVERDUE';

export type InstitutionalRiskCategory =
  | 'STRATEGIC'
  | 'ACADEMIC'
  | 'FINANCIAL'
  | 'REGULATORY'
  | 'OPERATIONAL'
  | 'REPUTATIONAL'
  | 'SAFETY_HEALTH';

export type RiskSeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskStatus =
  | 'OPEN'
  | 'MITIGATING'
  | 'MONITORED'
  | 'ACCEPTED'
  | 'CLOSED';

// Interfaces

export interface InstitutionalGovernanceProfile {
  id: string;
  tenantId: string;
  campusId?: string;
  institutionName: string;
  governanceFramework: string;
  primaryRegulator: string;
  accreditationStatus: string;
  policyReviewCycleMonths: number;
  riskThresholdLevel: RiskSeverityLevel;
  updatedAt: string;
  updatedBy: string;
}

export interface GovernanceBody {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  code: string;
  bodyType: GovernanceBodyType;
  description: string;
  chairpersonId: string;
  chairpersonName: string;
  secretaryId?: string;
  secretaryName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISSOLVED';
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GovernanceBodyMember {
  id: string;
  tenantId: string;
  governanceBodyId: string;
  staffId: string;
  staffName: string;
  email?: string;
  designation?: string;
  departmentId?: string;
  role: GovernanceMemberRole;
  appointedDate: string;
  termEndDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED';
  createdAt: string;
  createdBy: string;
}

export interface GovernanceMeeting {
  id: string;
  tenantId: string;
  campusId?: string;
  governanceBodyId: string;
  governanceBodyName: string;
  title: string;
  meetingType: GovernanceMeetingType;
  scheduledAt: string;
  venue: string;
  status: GovernanceMeetingStatus;
  agendaSummary?: string;
  minutesDocumentRegistryId?: string;
  attendanceCount?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface GovernanceAgenda {
  id: string;
  tenantId: string;
  meetingId: string;
  itemNumber: number;
  title: string;
  description: string;
  presenterId?: string;
  presenterName?: string;
  durationMinutes?: number;
  status: 'PENDING' | 'DISCUSSED' | 'DEFERRED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  createdBy: string;
}

export interface GovernanceResolution {
  id: string;
  tenantId: string;
  meetingId: string;
  governanceBodyId: string;
  resolutionNumber: string;
  title: string;
  decision: ResolutionDecision;
  proposerId: string;
  proposerName: string;
  seconderId?: string;
  seconderName?: string;
  votesInFavor?: number;
  votesAgainst?: number;
  abstentions?: number;
  status: ResolutionStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface GovernanceActionItem {
  id: string;
  tenantId: string;
  meetingId?: string;
  resolutionId?: string;
  title: string;
  description: string;
  assignedToStaffId: string;
  assignedToStaffName: string;
  dueDate: string;
  priority: ActionItemPriority;
  status: ActionItemStatus;
  completionNotes?: string;
  evidenceDocumentRegistryId?: string;
  completedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Policy {
  id: string;
  tenantId: string;
  campusId?: string;
  policyNumber: string;
  title: string;
  category: PolicyCategory;
  ownerStaffId: string;
  ownerStaffName: string;
  issuingAuthority: string;
  scope: PolicyScope;
  effectiveFrom: string;
  effectiveTo?: string;
  reviewDueAt: string;
  status: PolicyStatus;
  currentVersion: number;
  documentRegistryId?: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PolicyVersion {
  id: string;
  tenantId: string;
  policyId: string;
  versionNumber: number;
  changeSummary: string;
  policyText: string;
  documentRegistryId?: string;
  effectiveFrom: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PolicyReview {
  id: string;
  tenantId: string;
  policyId: string;
  reviewerStaffId: string;
  reviewerStaffName: string;
  reviewDate: string;
  comments: string;
  recommendation: 'RETAIN_AS_IS' | 'MINOR_REVISION' | 'MAJOR_REVISION' | 'RETIRE';
  status: 'PENDING' | 'COMPLETED';
  completedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface ComplianceFramework {
  id: string;
  tenantId: string;
  campusId?: string;
  frameworkName: string;
  code: string;
  authorityRegulator: string;
  version: string;
  category: ComplianceFrameworkCategory;
  effectiveDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ComplianceObligation {
  id: string;
  tenantId: string;
  campusId?: string;
  frameworkId: string;
  frameworkCode?: string;
  requirementReference: string;
  title: string;
  description: string;
  responsibleStaffId: string;
  responsibleStaffName: string;
  departmentId?: string;
  dueDate: string;
  frequency: ComplianceObligationFrequency;
  status: ComplianceStatus;
  evidenceRequired: boolean;
  lastAssessedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ComplianceControl {
  id: string;
  tenantId: string;
  obligationId: string;
  controlCode: string;
  description: string;
  controlOwnerStaffId: string;
  controlOwnerStaffName: string;
  frequency: 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  effectivenessStatus: ControlEffectiveness;
  lastTestedAt?: string;
  evidenceDocumentRegistryId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ComplianceEvidence {
  id: string;
  tenantId: string;
  obligationId?: string;
  controlId?: string;
  accreditationCriterionId?: string;
  auditFindingId?: string;
  documentRegistryId: string;
  title: string;
  documentType: string;
  sourceModule: string;
  sourceId?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface ComplianceException {
  id: string;
  tenantId: string;
  obligationId: string;
  reason: string;
  severity: ActionItemPriority;
  requestedByStaffId: string;
  requestedByStaffName: string;
  approvedByStaffId?: string;
  approvedByStaffName?: string;
  expiryDate: string;
  mitigationPlan: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  approvedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface AccreditationBody {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  authority: string;
  countryRegion?: string;
  website?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccreditationCycle {
  id: string;
  tenantId: string;
  campusId?: string;
  accreditationBodyId: string;
  accreditationBodyName: string;
  cycleName: string;
  startDate: string;
  targetCompletionDate: string;
  reviewDate?: string;
  status: AccreditationCycleStatus;
  overallReadinessScore?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccreditationStandard {
  id: string;
  tenantId: string;
  cycleId: string;
  standardCode: string;
  title: string;
  description: string;
  weight?: number;
  maxScore?: number;
  createdAt: string;
  createdBy: string;
}

export interface AccreditationCriterion {
  id: string;
  tenantId: string;
  standardId: string;
  criterionCode: string;
  requirement: string;
  evidenceRequirements?: string;
  responsibleStaffId: string;
  responsibleStaffName: string;
  complianceStatus: AccreditationCriterionStatus;
  score?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface QualityFramework {
  id: string;
  tenantId: string;
  campusId?: string;
  frameworkName: string;
  code: string;
  description: string;
  ownerStaffId: string;
  ownerStaffName: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface QualityIndicator {
  id: string;
  tenantId: string;
  qualityFrameworkId?: string;
  code: string;
  name: string;
  definition: string;
  measurementMethod: string;
  frequency: QualityIndicatorFrequency;
  ownerStaffId: string;
  ownerStaffName: string;
  targetValue: number;
  unitOfMeasure: QualityUnitOfMeasure;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface QualityTarget {
  id: string;
  tenantId: string;
  campusId?: string;
  indicatorId: string;
  academicYearId?: string;
  targetValue: number;
  effectivePeriod: string;
  status: 'ACTIVE' | 'REVISED' | 'SUPERSEDED';
  createdAt: string;
  createdBy: string;
}

export interface QualityMeasurement {
  id: string;
  tenantId: string;
  campusId?: string;
  indicatorId: string;
  period: string;
  actualValue: number;
  targetValue: number;
  evidenceDocumentRegistryId?: string;
  enteredByStaffId: string;
  enteredByStaffName: string;
  verificationState: QualityVerificationState;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface InstitutionalAudit {
  id: string;
  tenantId: string;
  campusId?: string;
  auditNumber: string;
  title: string;
  scope: string;
  auditType: InstitutionalAuditType;
  leadAuditorId: string;
  leadAuditorName: string;
  scheduledDate: string;
  completedDate?: string;
  status: InstitutionalAuditStatus;
  frameworkReferences?: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AuditFinding {
  id: string;
  tenantId: string;
  auditId: string;
  findingNumber: string;
  title: string;
  severity: AuditFindingSeverity;
  description: string;
  evidenceDocumentRegistryId?: string;
  responsibleStaffId: string;
  responsibleStaffName: string;
  status: AuditFindingStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CorrectiveAction {
  id: string;
  tenantId: string;
  findingId: string;
  actionDescription: string;
  assignedStaffId: string;
  assignedStaffName: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  verificationEvidenceRegistryId?: string;
  verifiedByStaffId?: string;
  verifiedByStaffName?: string;
  verifiedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface InstitutionalRisk {
  id: string;
  tenantId: string;
  campusId?: string;
  riskNumber: string;
  title: string;
  description: string;
  category: InstitutionalRiskCategory;
  probability: number; // 1 to 5
  impact: number; // 1 to 5
  severityScore: number; // probability * impact (1 to 25)
  severityLevel: RiskSeverityLevel;
  ownerStaffId: string;
  ownerStaffName: string;
  status: RiskStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface RiskMitigation {
  id: string;
  tenantId: string;
  riskId: string;
  mitigationPlan: string;
  assignedStaffId: string;
  assignedStaffName: string;
  dueDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  residualProbability?: number;
  residualImpact?: number;
  residualSeverityScore?: number;
  updatedAt: string;
  updatedBy: string;
}

export interface GovernanceDocumentReference {
  id: string;
  tenantId: string;
  documentRegistryId: string;
  artifactId?: string;
  sourceModule: string;
  sourceId: string;
  documentType: string;
  versionReference?: string;
  createdAt: string;
  createdBy: string;
}

export interface GovernanceAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  activeBodiesCount: number;
  upcomingMeetingsCount: number;
  policiesAwaitingReviewCount: number;
  policiesDueForReviewCount: number;
  openComplianceCount: number;
  overdueComplianceCount: number;
  accreditationReadinessPercent: number;
  openAuditFindingsCount: number;
  overdueCorrectiveActionsCount: number;
  highRiskCount: number;
  lastUpdated: string;
}

export interface FilterGovernanceParams {
  campusId?: string;
  status?: string;
  category?: string;
  searchQuery?: string;
  governanceBodyId?: string;
}
