/**
 * EMS Phase 7.32: Institutional Scheduling, Timetable Management, Resource Booking & Academic Operations Governance Domain Types
 */

export type TimetableStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type BookingStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'RESERVED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED';

export type ScheduleChangeStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'APPROVED'
  | 'IMPLEMENTED'
  | 'ARCHIVED';

export type ConflictSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'WARNING';

export type ConflictType =
  | 'FACULTY_DOUBLE_BOOKING'
  | 'ROOM_DOUBLE_BOOKING'
  | 'SECTION_DOUBLE_BOOKING'
  | 'LABORATORY_OVERBOOKING'
  | 'SUBJECT_OVERLAP'
  | 'CROSS_CAMPUS_MISMATCH'
  | 'WORKLOAD_EXCEEDED'
  | 'CALENDAR_EXCEPTION_CLASH';

export type ExceptionType =
  | 'INSTITUTIONAL_HOLIDAY'
  | 'CAMPUS_CLOSURE'
  | 'SPECIAL_ACADEMIC_DAY'
  | 'EMERGENCY_CLOSURE'
  | 'ROOM_MAINTENANCE'
  | 'EXAM_PERIOD';

export interface ScheduleSlot {
  id: string;
  slotName: string; // e.g., "Period 1", "Morning Lab 1"
  startTime: string; // HH:mm format, e.g. "08:30"
  endTime: string; // HH:mm format, e.g. "09:15"
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  order: number;
}

export interface ScheduleEntry {
  id: string;
  tenantId: string;
  campusId: string;
  timetableId: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  roomCode?: string;
  isLab: boolean;
  slot: ScheduleSlot;
  effectiveStartDate: string; // YYYY-MM-DD
  effectiveEndDate: string; // YYYY-MM-DD
  status: 'ACTIVE' | 'CANCELLED' | 'SUBSTITUTED';
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface Timetable {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  termId?: string;
  title: string;
  code: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string; // YYYY-MM-DD
  status: TimetableStatus;
  version: number;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  submittedAt?: string;
  submittedBy?: string;
  rejectionReason?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  entriesCount?: number;
}

export interface TimetableVersion {
  id: string;
  timetableId: string;
  tenantId: string;
  campusId: string;
  versionNumber: number;
  snapshotData: {
    timetable: Timetable;
    entries: ScheduleEntry[];
  };
  changeSummary: string;
  publishedBy: string;
  publishedByName: string;
  publishedAt: string;
}

export interface AcademicSchedule extends Timetable {}
export interface ScheduleVersion extends TimetableVersion {}

export interface FacultyScheduleAssignment {
  id: string;
  tenantId: string;
  campusId: string;
  teacherId: string;
  teacherName: string;
  assignedEntries: ScheduleEntry[];
  totalWeeklyPeriods: number;
  totalWeeklyHours: number;
  labHours: number;
  isOverloaded: boolean;
  isUnderloaded: boolean;
}

export interface RoomScheduleAssignment {
  id: string;
  tenantId: string;
  campusId: string;
  roomId: string;
  roomName: string;
  roomCode: string;
  capacity: number;
  isLab: boolean;
  assignedEntries: ScheduleEntry[];
  utilizationPercentage: number;
}

export interface ResourceBookingRequest {
  id: string;
  tenantId: string;
  campusId: string;
  resourceId: string; // room or facility ID
  resourceName: string;
  resourceType: 'ROOM' | 'LABORATORY' | 'AUDITORIUM' | 'EQUIPMENT' | 'GROUND';
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  purpose: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceBooking extends ResourceBookingRequest {}

export interface SchedulingConflict {
  id: string;
  tenantId: string;
  campusId: string;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  description: string;
  entityId1: string; // e.g. Entry ID, Booking ID
  entityType1: string;
  entityId2: string;
  entityType2: string;
  affectedPersonId?: string;
  affectedRoomId?: string;
  affectedSectionId?: string;
  detectedAt: string;
  status: 'OPEN' | 'RESOLVED' | 'IGNORED_BY_OVERRIDE';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface FacultySubstitution {
  id: string;
  tenantId: string;
  campusId: string;
  scheduleEntryId: string;
  originalTeacherId: string;
  originalTeacherName: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  effectiveDate: string; // YYYY-MM-DD
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleChangeRequest {
  id: string;
  tenantId: string;
  campusId: string;
  timetableId: string;
  requestType: 'FACULTY_CHANGE' | 'ROOM_CHANGE' | 'TIME_SLOT_CHANGE' | 'EMERGENCY_CANCEL';
  reason: string;
  proposedChanges: {
    entryId: string;
    before: Partial<ScheduleEntry>;
    after: Partial<ScheduleEntry>;
  }[];
  status: ScheduleChangeStatus;
  requestedBy: string;
  requestedByName: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  implementedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarException {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  exceptionType: ExceptionType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  affectsAllClasses: boolean;
  affectedClassIds?: string[];
  affectedRoomIds?: string[];
  reason: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalEventReference {
  id: string;
  tenantId: string;
  campusId: string;
  eventName: string;
  eventCategory: string;
  startDate: string;
  endDate: string;
  impactLevel: 'FULL_SUSPENSION' | 'PARTIAL_SUSPENSION' | 'NO_IMPACT';
  notes?: string;
}

export interface WorkloadSnapshot {
  teacherId: string;
  teacherName: string;
  totalPeriods: number;
  contactHours: number;
  labHours: number;
  status: 'BALANCED' | 'OVERLOAD' | 'UNDERLOAD';
}

export interface RoomUtilizationSnapshot {
  roomId: string;
  roomName: string;
  totalSlotsAvailable: number;
  totalSlotsBooked: number;
  utilizationPercentage: number;
}

export interface SchedulingAnalytics {
  activeTimetablesCount: number;
  pendingApprovalsCount: number;
  unresolvedConflictsCount: number;
  resourceBookingsCount: number;
  pendingSubstitutionsCount: number;
  pendingChangesCount: number;
  averageFacultyWorkloadHours: number;
  averageRoomUtilizationPercentage: number;
  calendarExceptionsCount: number;
}
