export type AcademicProgramType = 'BACHELOR' | 'MASTER' | 'DOCTORAL' | 'DIPLOMA' | 'CERTIFICATE' | 'FOUNDATION' | 'PROFESSIONAL';

export type DeliveryMode = 'IN_PERSON' | 'ONLINE' | 'HYBRID' | 'BLENDED';

export type CourseType = 'CORE' | 'ELECTIVE' | 'LAB' | 'PROJECT' | 'INTERNSHIP' | 'SEMINAR' | 'THESIS' | 'PRACTICAL';

export type VersionStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED';

export type TermStatus = 'PLANNED' | 'OPEN' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type OfferingStatus = 'PLANNED' | 'APPROVED' | 'OPEN' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export interface AcademicDiscipline {
  disciplineId: string;
  tenantId: string;
  code: string;
  name: string;
  description: string;
  parentDisciplineId?: string;
  organizationUnitIdRef: string;
  status: 'ACTIVE' | 'INACTIVE';
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface AcademicProgram {
  programId: string;
  tenantId: string;
  campusIdRef: string;
  owningOrganizationUnitIdRef: string;
  programCode: string;
  programName: string;
  programType: AcademicProgramType;
  awardType: string;
  disciplineIdRef: string;
  duration: number;
  durationUnit: 'YEARS' | 'SEMESTERS' | 'MONTHS';
  deliveryMode: DeliveryMode;
  status: 'ACTIVE' | 'INACTIVE' | 'RETIRED';
  effectiveFrom: string;
  effectiveTo?: string;
  currentVersionId?: string;
  accreditationReference?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AcademicProgramVersion {
  versionId: string;
  programId: string;
  versionNumber: string;
  status: VersionStatus;
  totalCreditsRequired: number;
  minimumGpaRequired: number;
  effectiveFrom: string;
  effectiveTo?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicCourse {
  courseId: string;
  tenantId: string;
  courseCode: string;
  courseTitle: string;
  shortTitle: string;
  description: string;
  disciplineIdRef: string;
  owningOrganizationUnitIdRef: string;
  courseType: CourseType;
  level: string;
  creditValue: number;
  contactHours: number;
  deliveryMode: DeliveryMode;
  gradingMode: 'LETTER' | 'PASS_FAIL' | 'NUMERIC';
  status: 'ACTIVE' | 'INACTIVE' | 'RETIRED';
  currentVersionId?: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface AcademicCourseVersion {
  versionId: string;
  courseId: string;
  versionNumber: string;
  status: VersionStatus;
  syllabusSummary: string;
  learningOutcomes: string[];
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface AcademicCurriculum {
  curriculumId: string;
  tenantId: string;
  programVersionId: string;
  name: string;
  academicYear: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface AcademicCurriculumComponent {
  componentId: string;
  curriculumId: string;
  courseIdRef: string;
  componentType: 'MANDATORY' | 'ELECTIVE' | 'CORE_ELECTIVE';
  academicPeriod: string; // e.g. "Year 1, Semester 1"
  credits: number;
  sequence: number;
  effectiveFrom: string;
}

export interface AcademicCoursePrerequisite {
  prerequisiteId: string;
  tenantId: string;
  courseId: string;
  requiredCourseId: string;
  minimumGrade?: string;
  ruleType: 'COURSE' | 'CREDIT_COUNT' | 'STANDING';
}

export interface AcademicCourseCorequisite {
  corequisiteId: string;
  tenantId: string;
  courseId: string;
  concurrentCourseId: string;
}

export interface AcademicTerm {
  termId: string;
  tenantId: string;
  campusId: string;
  code: string;
  name: string;
  academicYear: string;
  sequence: number;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  teachingStart: string;
  teachingEnd: string;
  status: TermStatus;
}

export interface AcademicCalendarEvent {
  eventId: string;
  tenantId: string;
  termId: string;
  title: string;
  eventType: 'REGISTRATION' | 'CLASSES_START' | 'HOLIDAY' | 'ADD_DROP' | 'EXAM_PREP' | 'TERM_CLOSE';
  startDate: string;
  endDate: string;
}

export interface AcademicCourseOffering {
  offeringId: string;
  tenantId: string;
  courseIdRef: string;
  courseVersionIdRef: string;
  termIdRef: string;
  campusIdRef: string;
  organizationUnitIdRef: string;
  deliveryMode: DeliveryMode;
  capacity: number;
  status: OfferingStatus;
  effectiveFrom: string;
}

export interface AcademicSection {
  sectionId: string;
  offeringIdRef: string;
  sectionCode: string;
  campusIdRef: string;
  deliveryMode: DeliveryMode;
  capacity: number;
  roomReference?: string;
  scheduleReference?: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
}

export interface AcademicRule {
  ruleId: string;
  tenantId: string;
  code: string;
  title: string;
  description: string;
  ruleCategory: 'CREDIT_LIMIT' | 'GPA_REQUIREMENT' | 'ATTENDANCE' | 'PREREQUISITE_POLICY';
  status: VersionStatus;
}

export interface AcademicChangeRequest {
  requestId: string;
  tenantId: string;
  title: string;
  description: string;
  changeType: 'PROGRAM_CREATION' | 'CURRICULUM_REVISION' | 'COURSE_CREATION' | 'COURSE_RETIREMENT' | 'PREREQUISITE_CHANGE';
  targetEntityId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTED' | 'REJECTED' | 'CANCELLED';
  requestedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicAuditEvent {
  eventId: string;
  tenantId: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  signatureHash: string;
  metadata?: any;
}
