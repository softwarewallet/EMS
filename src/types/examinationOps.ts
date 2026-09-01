// EMS Phase 7.16 — Examination Operations & Assessment Administration Data Models

export type ExamSessionStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CLOSED'
  | 'ARCHIVED'
  | 'CANCELLED';

export type ExamSessionType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'SPECIAL';

export interface ExamSession {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  examinationId: string;
  examinationName?: string;
  name: string;
  code: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  sessionType: ExamSessionType;
  status: ExamSessionStatus;
  version: number;
  instructions?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  closedBy?: string;
  closedAt?: string;
}

export type ExamPaperStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'RELEASED'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export interface ExamPaper {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  sessionId?: string;
  sessionName?: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  componentId?: string;
  componentName?: string;
  paperCode: string;
  title: string;
  maximumMarks: number;
  durationMinutes: number;
  version: number;
  documentRefId?: string; // Reference to Document Registry file
  documentName?: string;
  documentUrl?: string;
  instructions?: string;
  status: ExamPaperStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  releasedBy?: string;
  releasedAt?: string;
  withdrawnReason?: string;
}

export interface StudentSeatAssignment {
  studentId: string;
  enrollmentId: string;
  studentName: string;
  studentIdNumber?: string;
  rollNumber?: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  seatNumber: string; // e.g., "A-01", "R1-C2"
  rowNumber?: number;
  colNumber?: number;
  accommodationIds?: string[];
  accommodationNotes?: string;
}

export interface ExamSeatingAllocation {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  sessionId: string;
  sessionName?: string;
  roomId: string;
  roomName: string;
  buildingName?: string;
  roomCapacity: number;
  allocatedCount: number;
  studentSeating: StudentSeatAssignment[];
  version: number;
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
}

export type InvigilatorRole = 'PRIMARY' | 'ASSISTANT' | 'RELIEF' | 'STANDBY';
export type InvigilatorStatus = 'ASSIGNED' | 'CONFIRMED' | 'SUBSTITUTED' | 'CANCELLED';

export interface ExamInvigilatorAssignment {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  sessionId: string;
  sessionName?: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  roomId: string;
  roomName: string;
  staffId: string;
  staffName: string;
  employeeId?: string;
  role: InvigilatorRole;
  status: InvigilatorStatus;
  substituteStaffId?: string;
  substituteStaffName?: string;
  substituteReason?: string;
  substitutedBy?: string;
  substitutedAt?: string;
  assignedBy: string;
  assignedAt: string;
  updatedAt: string;
}

export type ExamPresenceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EXCUSED'
  | 'MALPRACTICE_SUSPENDED';

export interface ExamPresenceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  sessionId: string;
  sessionName?: string;
  roomId?: string;
  roomName?: string;
  subjectId: string;
  subjectName: string;
  componentId?: string;
  studentId: string;
  enrollmentId: string;
  studentName: string;
  rollNumber?: string;
  studentIdNumber?: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  status: ExamPresenceStatus;
  lateMinutes?: number;
  seatNumber?: string;
  recordedBy: string;
  recordedByName?: string;
  recordedAt: string;
  remarks?: string;
  updatedAt: string;
}

export type ExamIncidentType =
  | 'CHEATING'
  | 'UNAUTHORIZED_MATERIAL'
  | 'IDENTITY_MISMATCH'
  | 'DISRUPTIVE_BEHAVIOR'
  | 'PAPER_LEAKAGE_SUSPICION'
  | 'DEVICE_VIOLATION'
  | 'UNAUTHORIZED_ASSISTANCE'
  | 'OTHER';

export type ExamIncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ExamIncidentStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'RESOLVED'
  | 'CLOSED';

export interface ExamIncident {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  sessionId: string;
  sessionName?: string;
  roomId?: string;
  roomName?: string;
  studentId?: string;
  enrollmentId?: string;
  studentName?: string;
  invigilatorId: string;
  invigilatorName: string;
  incidentType: ExamIncidentType;
  severity: ExamIncidentSeverity;
  description: string;
  evidenceDocumentIds: string[]; // References to Document Registry
  status: ExamIncidentStatus;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  actionTaken?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ExamResultProcessingStatus =
  | 'DRAFT'
  | 'MARKS_PENDING'
  | 'MARKS_COMPLETE'
  | 'UNDER_VERIFICATION'
  | 'MODERATION'
  | 'APPROVED'
  | 'FINALIZED'
  | 'LOCKED';

export type ExamResultModerationStatus = 'NONE' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED';

export interface ExamResultProcessing {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  examinationId: string;
  examinationName?: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  subjectId?: string;
  subjectName?: string;
  status: ExamResultProcessingStatus;
  totalStudents: number;
  marksEnteredCount: number;
  marksVerifiedCount: number;
  missingMarksCount: number;
  unverifiedMarksCount: number;
  moderationStatus: ExamResultModerationStatus;
  exceptionCount: number;
  finalizedBy?: string;
  finalizedByName?: string;
  finalizedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ExamModerationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export interface ModerationBeforeAfterRecord {
  studentId: string;
  studentName: string;
  assessmentId: string;
  subjectName?: string;
  originalMark: number;
  moderatedMark: number;
  adjustmentReason: string;
}

export interface ExamModerationRequest {
  id: string;
  tenantId: string;
  campusId: string;
  examinationId: string;
  examinationName?: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  reviewerId: string;
  reviewerName: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  reasonCode: string;
  moderationNotes: string;
  status: ExamModerationStatus;
  beforeAfterRecords: ModerationBeforeAfterRecord[];
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export type ExamExceptionSeverity = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

export type ExamExceptionType =
  | 'MISSING_MARKS'
  | 'INVALID_MARKS'
  | 'MISSING_ENROLLMENT'
  | 'STUDENT_ABSENT'
  | 'DUPLICATE_SEATING'
  | 'ROOM_CONFLICT'
  | 'INVIGILATOR_CONFLICT'
  | 'UNAPPROVED_PAPER'
  | 'RESULT_MISMATCH'
  | 'MODERATION_PENDING'
  | 'INCIDENT_PENDING'
  | 'ACCOMMODATION_MISSING'
  | 'CALCULATION_INCONSISTENCY';

export type ExamExceptionStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'IGNORED';

export interface ExamException {
  exceptionId: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  examinationId: string;
  examinationName?: string;
  sessionId?: string;
  sessionName?: string;
  studentId?: string;
  enrollmentId?: string;
  studentName?: string;
  severity: ExamExceptionSeverity;
  type: ExamExceptionType;
  status: ExamExceptionStatus;
  sourceModule: 'examination_ops';
  sourceId: string;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  resolutionNotes?: string;
  calculationVersion?: string;
}

export interface ExamOpsAnalytics {
  tenantId: string;
  campusId: string;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalStudentsScheduled: number;
  presenceRatePercentage: number;
  absenceRatePercentage: number;
  roomUtilizationPercentage: number;
  totalRoomsAllocated: number;
  invigilatorsAssigned: number;
  incidentsReported: number;
  activeIncidents: number;
  openExceptions: number;
  resultsFinalizedCount: number;
  resultReadinessPercentage: number;
  moderationsPending: number;
  updatedAt: string;
}

export type ExamOpsTab =
  | 'command_center'
  | 'sessions'
  | 'papers'
  | 'seating'
  | 'invigilators'
  | 'presence'
  | 'incidents'
  | 'result_readiness'
  | 'moderation'
  | 'exceptions'
  | 'reports'
  | 'governance';
