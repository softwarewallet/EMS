export type TimetableStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED' | 'CANCELLED';
export type PeriodType = 'TEACHING' | 'BREAK' | 'LUNCH' | 'ASSEMBLY' | 'ACTIVITY' | 'FREE' | 'CUSTOM';
export type ResourceType = 'CLASSROOM' | 'LAB' | 'LIBRARY' | 'AUDITORIUM' | 'SPORTS_FACILITY' | 'COMPUTER_LAB' | 'ART_ROOM' | 'MUSIC_ROOM' | 'TRANSPORT_RESOURCE' | 'CUSTOM';
export type ResourceStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE' | 'RESERVED';
export type ActivityType = 'REGULAR_CLASS' | 'PRACTICAL' | 'LAB' | 'PROJECT' | 'ACTIVITY' | 'SPORTS' | 'LIBRARY' | 'ASSEMBLY' | 'REMEDIAL' | 'EXTRA_CLASS' | 'EXAM' | 'CUSTOM';
export type ConflictSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ConflictType = 'TEACHER_CONFLICT' | 'SECTION_CONFLICT' | 'ROOM_CONFLICT' | 'CAPACITY_CONFLICT' | 'AVAILABILITY_CONFLICT' | 'CALENDAR_CONFLICT' | 'EXAM_CONFLICT' | 'FREQUENCY_CONFLICT' | 'WORKLOAD_CONFLICT';
export type ConflictStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'WAIVED';
export type SubstitutionStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Period {
  periodId: string;
  name: string;
  sequence: number;
  startTime: string;
  endTime: string;
  type: PeriodType;
  durationMinutes: number;
}

export interface PeriodStructure {
  periodStructureId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'INACTIVE';
  periods: Period[];
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableProfile {
  timetableId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  name: string;
  code: string;
  description?: string;
  scope: string;
  status: TimetableStatus;
  version: string;
  effectiveFrom: string;
  effectiveTo: string;
  weekPattern: string;
  workingDays: DayOfWeek[];
  periodStructureId: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulingResource {
  resourceId: string;
  tenantId: string;
  campusId?: string;
  name: string;
  code: string;
  resourceType: ResourceType;
  capacity: number;
  location?: string;
  features?: string[];
  status: ResourceStatus;
  availabilityRules?: any;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableSlot {
  slotId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  timetableId: string;
  timetableVersion: string;
  dayOfWeek: DayOfWeek;
  periodId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  curriculumId?: string;
  teachingPlanId?: string;
  activityType: ActivityType;
  status: 'ACTIVE' | 'CANCELLED' | 'SUPERSEDED';
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubstituteTeacher {
  substitutionId: string;
  tenantId: string;
  campusId?: string;
  date: string;
  slotId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  reason: string;
  approvedBy?: string;
  status: SubstitutionStatus;
}

export interface TimetableConflict {
  conflictId: string;
  severity: ConflictSeverity;
  type: ConflictType;
  resource: string;
  date?: string;
  period?: string;
  details: string;
  detectedAt: string;
  status: ConflictStatus;
}
