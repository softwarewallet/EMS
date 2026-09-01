export type PolicyStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export type BoardType = 'CBSE' | 'ICSE' | 'IB' | 'Cambridge' | 'State Board' | 'Custom';

export type LeaveType = 'MEDICAL' | 'PERSONAL' | 'FAMILY' | 'EMERGENCY' | 'AUTHORIZED' | 'OTHER';

export type LeaveStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED';

export type RequesterType = 'STUDENT' | 'PARENT_GUARDIAN' | 'TEACHER' | 'ADMINISTRATOR';

export type ShortageStatus = 'NORMAL' | 'WARNING' | 'SHORTAGE' | 'CRITICAL';

export type CondonationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LatePolicyRule {
  schoolStartTime: string; // e.g., '08:00'
  gracePeriodMinutes: number; // e.g., 10
  lateThresholdMinutes: number; // e.g., 11
  maxLateCountBeforeWarning: number; // e.g., 3
  maxLateCountBeforeEscalation: number; // e.g., 5
  countLateAs: 'present' | 'half_day' | 'late' | 'absent';
}

export interface LeavePolicyRule {
  allowedCategories: LeaveType[];
  requireMedicalDocAfterDays: number; // e.g., 3
  maxConsecutiveDays: number; // e.g., 15
  requireApprovalBy: 'teacher' | 'coordinator' | 'principal';
}

export interface ShortagePolicyRule {
  warningThreshold: number; // e.g., 80%
  shortageThreshold: number; // e.g., 75%
  criticalThreshold: number; // e.g., 60%
  autoNotifyParent: boolean;
  autoNotifyCoordinator: boolean;
}

export interface CondonationPolicyRule {
  maxCondonablePercentage: number; // e.g., 10% (e.g. can condone down to 65% if min is 75%)
  requiresPrincipalApproval: boolean;
  requiresDocument: boolean;
}

export interface ApprovalChainRule {
  levels: ('teacher' | 'coordinator' | 'principal')[];
  escalationAfterHours: number;
}

export interface NotificationPolicyRule {
  enableSMS: boolean;
  enableEmail: boolean;
  triggerOnWarning: boolean;
  triggerOnShortage: boolean;
  triggerOnLeaveDecision: boolean;
}

export interface AttendancePolicy {
  policyId: string;
  tenantId: string;
  campusId?: string; // Optional if tenant-wide
  academicYearId?: string; // Optional if global across years
  classId?: string; // Optional grade/class override
  name: string;
  description: string;
  boardType: BoardType;
  status: PolicyStatus;
  version: string; // e.g. "1.0"
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string; // YYYY-MM-DD
  minimumAttendancePercentage: number; // e.g., 75
  latePolicy: LatePolicyRule;
  leavePolicy: LeavePolicyRule;
  shortagePolicy: ShortagePolicyRule;
  condonationPolicy: CondonationPolicyRule;
  approvalPolicy: ApprovalChainRule;
  notificationPolicy: NotificationPolicyRule;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  leaveRequestId: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  campusId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  numberOfDays: number;
  leaveType: LeaveType;
  reason: string;
  supportingDocumentId?: string;
  supportingDocumentName?: string;
  requestedBy: string;
  requesterName: string;
  requesterType: RequesterType;
  status: LeaveStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedByName?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  currentApprovalLevel?: 'teacher' | 'coordinator' | 'principal';
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceCondonation {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  academicYearId: string;
  classId?: string;
  sectionId?: string;
  policyId: string;
  attendancePercentage: number;
  requestedPercentage: number;
  reason: string;
  supportingDocumentId?: string;
  status: CondonationStatus;
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceComplianceResult {
  studentId: string;
  studentName: string;
  enrollmentId: string;
  academicYearId: string;
  totalInstructionalDays: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  leaveCount: number;
  actualPercentage: number;
  effectivePercentage: number; // after approved leaves/excused according to policy
  minimumRequiredPercentage: number;
  policyId: string;
  policyVersion: string;
  shortageStatus: ShortageStatus;
  isCompliant: boolean;
  condoned: boolean;
  condonationId?: string;
  evaluatedAt: string;
}
