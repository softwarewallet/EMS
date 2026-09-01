export type ExaminationType = 
  | 'UNIT_TEST'
  | 'PERIODIC_TEST'
  | 'MID_TERM'
  | 'HALF_YEARLY'
  | 'ANNUAL'
  | 'PRE_BOARD'
  | 'BOARD'
  | 'PRACTICAL'
  | 'PROJECT'
  | 'INTERNAL_ASSESSMENT'
  | 'CLASS_TEST'
  | 'OTHER';

export type ExaminationStatus = 
  | 'DRAFT'
  | 'PLANNING'
  | 'SCHEDULED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type ComponentType = 
  | 'THEORY'
  | 'PRACTICAL'
  | 'PROJECT'
  | 'INTERNAL'
  | 'ORAL'
  | 'VIVA'
  | 'ASSIGNMENT'
  | 'CONTINUOUS_ASSESSMENT'
  | 'OTHER';

export type EligibilityStatus = 
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'PENDING_REVIEW'
  | 'ELIGIBLE_BY_APPROVAL'
  | 'EXEMPTED';

export type ParticipationStatus = 
  | 'SCHEDULED'
  | 'PRESENT'
  | 'ABSENT'
  | 'EXCUSED'
  | 'MEDICAL'
  | 'EXEMPTED'
  | 'WITHHELD';

export interface AssessmentComponent {
  componentId: string;
  examinationId: string;
  subjectId: string;
  subjectName?: string;
  componentType: ComponentType;
  name: string;
  maximumMarks: number;
  passingMarks: number;
  weightage: number; // percentage weight
  sequence: number;
  durationMinutes: number;
  instructions?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Examination {
  examinationId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  name: string;
  code: string;
  description?: string;
  examinationType: ExaminationType;
  termId?: string;
  status: ExaminationStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  classIds: string[];
  sectionIds: string[];
  components: AssessmentComponent[];
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExaminationSchedule {
  scheduleId: string;
  examinationId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  componentId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  roomId?: string;
  roomName?: string;
  invigilatorIds?: string[];
  invigilatorNames?: string[];
  instructions?: string;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
}

export interface ExaminationEligibility {
  eligibilityId: string;
  examinationId: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  status: EligibilityStatus;
  attendancePercentage: number;
  attendanceCompliant: boolean;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleConflict {
  hasConflict: boolean;
  conflictType?: 'STUDENT_OVERLAP' | 'ROOM_OVERLAP' | 'INVIGILATOR_OVERLAP' | 'TIME_OVERLAP';
  message?: string;
}
