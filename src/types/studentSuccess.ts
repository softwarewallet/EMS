/**
 * EMS Phase 7.33: Student Academic Progression, Retention, Early Warning, Intervention & Student Success Governance Types
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SignalSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SignalType =
  | 'ATTENDANCE_DROP'
  | 'LOW_ATTENDANCE'
  | 'MARKS_DECLINE'
  | 'FAILED_SUBJECT'
  | 'MULTIPLE_FAILED_SUBJECTS'
  | 'ASSESSMENT_NON_COMPLETION'
  | 'ACADEMIC_STAGNATION'
  | 'ENGAGEMENT_DROP'
  | 'DISCIPLINARY_CONCERN'
  | 'FINANCIAL_RISK'
  | 'REPEATED_SUPPORT_CASE'
  | 'UNRESOLVED_INTERVENTION'
  | 'PROGRESSION_BLOCK'
  | 'RETENTION_RISK';

export type SignalStatus = 'OPEN' | 'ACKNOWLEDGED' | 'ACTIONED' | 'RESOLVED';

export type InterventionType =
  | 'ACADEMIC_COUNSELING'
  | 'FACULTY_MENTORING'
  | 'ATTENDANCE_INTERVENTION'
  | 'PARENT_GUARDIAN_ENGAGEMENT'
  | 'TUTORING_REMEDIAL'
  | 'FINANCIAL_REFERRAL'
  | 'COUNSELING_REFERRAL'
  | 'STUDENT_SUPPORT_REFERRAL'
  | 'CAREER_GUIDANCE'
  | 'ACCESSIBILITY_SUPPORT_REFERRAL';

export type InterventionStatus =
  | 'PROPOSED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED';

export type RetentionStatus =
  | 'STABLE'
  | 'UNDER_MONITORING'
  | 'INTERVENTION_ACTIVE'
  | 'HIGH_ATTRITION_RISK'
  | 'RETAINED'
  | 'WITHDRAWN_VOLUNTARY'
  | 'TRANSFERRED';

export type ProgressionStatus =
  | 'ELIGIBLE'
  | 'CONDITIONALLY_ELIGIBLE'
  | 'REVIEW_REQUIRED'
  | 'BLOCKED'
  | 'COMPLETED';

export type ConfidentialityLevel = 'STANDARD' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';

export interface StudentSuccessProfile {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MONITORED';
  currentRiskLevel: RiskLevel;
  currentRiskScore: number;
  retentionStatus: RetentionStatus;
  progressionStatus: ProgressionStatus;
  confidentialityLevel: ConfidentialityLevel;
  lastCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRiskAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  academicYearId: string;
  assessmentPeriod: string;
  attendanceRisk: number; // 0-100
  academicRisk: number; // 0-100
  engagementRisk: number; // 0-100
  financialRisk: number; // 0-100
  behavioralRisk: number; // 0-100
  supportRisk: number; // 0-100
  compositeRiskScore: number; // 0-100
  riskLevel: RiskLevel;
  contributingFactors: string[];
  calculatedAt: string;
  calculationVersion: string;
  isOverridden?: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
}

export interface EarlyWarningSignal {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  signalType: SignalType;
  severity: SignalSeverity;
  sourceModule: string;
  sourceRecordId: string;
  detectedAt: string;
  evidence: string;
  status: SignalStatus;
  acknowledgedBy?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface StudentIntervention {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  interventionType: InterventionType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;
  assignedToName: string;
  referralSource: string;
  actionPlan: string;
  dueDate: string;
  status: InterventionStatus;
  outcome?: string;
  completedAt?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetentionCase {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  academicYearId: string;
  retentionRisk: RiskLevel;
  caseOwnerId: string;
  caseOwnerName: string;
  reasons: string[];
  interventionPlanId?: string;
  status: RetentionStatus;
  reviewDate: string;
  outcome?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressionAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  academicYearId: string;
  currentClassId: string;
  currentClassName: string;
  nextClassId?: string;
  nextClassName?: string;
  earnedCredits: number;
  failedSubjectsCount: number;
  failedSubjectNames: string[];
  attendanceEligibilityPercentage: number;
  progressionStatus: ProgressionStatus;
  decisionReference?: string;
  notes?: string;
  assessedBy: string;
  assessedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSuccessReview {
  id: string;
  tenantId: string;
  campusId: string;
  studentId: string;
  studentName: string;
  reviewPeriod: string;
  reviewerId: string;
  reviewerName: string;
  findings: string;
  recommendations: string;
  decision: string;
  createdAt: string;
}

export interface SuccessAnalytics {
  totalActiveStudents: number;
  studentsAtRiskCount: number;
  highRiskCount: number;
  criticalRiskCount: number;
  attendanceRiskCount: number;
  academicRiskCount: number;
  interventionBacklogCount: number;
  interventionCompletionRatePercentage: number;
  retentionRiskCount: number;
  progressionReadyCount: number;
  progressionBlockedCount: number;
  unresolvedSignalsCount: number;
  cohortRetentionRatePercentage: number;
  cohortProgressionRatePercentage: number;
}
