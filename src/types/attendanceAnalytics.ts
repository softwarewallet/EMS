export interface AttendanceAnalyticsSummary {
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  totalStudents: number;
  applicableStudents: number;
  averageAttendancePercentage: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  totalLeave: number;
  shortageCount: number;
  criticalCount: number;
  warningCount: number;
  chronicAbsenteeCount: number;
  highRiskCount: number;
  missingSessionsCount: number;
  calculatedAt: string;
  readModelVersion: string;
}

export interface StudentAttendanceAnalytics {
  studentId: string;
  studentName: string;
  enrollmentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  totalInstructionalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  leaveDays: number;
  attendancePercentage: number;
  effectivePercentage: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'INSUFFICIENT_DATA';
  currentAbsentStreak: number;
  maxAbsentStreak: number;
  currentLateStreak: number;
  maxLateStreak: number;
  isChronicAbsentee: boolean;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskReasons: string[];
  complianceStatus: 'NORMAL' | 'WARNING' | 'SHORTAGE' | 'CRITICAL' | 'COMPLIANT_BY_CONDONATION';
  policyId: string;
  policyVersion: string;
  calculatedAt: string;
}

export interface ClassAttendanceAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  averagePercentage: number;
  presentRate: number;
  absentRate: number;
  lateRate: number;
  shortageCount: number;
  highRiskCount: number;
  chronicAbsenteeCount: number;
  missingSessions: number;
}

export interface TeacherSubmissionAnalytics {
  teacherId: string;
  teacherName: string;
  assignedSessions: number;
  submittedSessions: number;
  missingSessions: number;
  lateSubmissions: number;
  onTimeSubmissionPercentage: number;
  correctionCount: number;
}
