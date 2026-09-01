export * from './processExcellenceGovernance';
export * from './planningBudgetResourceGovernance';
export * from './decisionIntelligenceGovernance';

// EMS Global Type Definitions
// Multi-Tenant, Modular, Role-Based Enterprise Architecture

export * from './recordsGovernance';
export {
  FrameworkStatus,
  ObligationStatus,
  ControlLifecycle,
  GovernanceControlEffectiveness,
  GovernanceFindingSeverity,
  FindingStatus,
} from './institutionalGovernance';
export type {
  InstitutionalGovernanceFramework,
  GovernanceObligation,
  GovernanceControl
} from './institutionalGovernance';
export * from './institutionalPerformanceAssurance';
export * from './institutionalPerformanceGovernance';
export type { PerformanceStatus, BenchmarkReference } from './institutionalPerformanceGovernance';
export * from './institutionalAnalyticsGovernance';
export * from './auditAssuranceGovernance';
export * from './enterpriseWorkflowGovernance';

export type InstitutionType = 
  | 'k12_school'
  | 'higher_education'
  | 'coaching_institute'
  | 'vocational'
  | 'multi_campus_group';

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'pending_setup';

export interface TenantBranding {
  primaryColor: string; // e.g. '#1e3a8a'
  accentColor: string;  // e.g. '#0284c7'
  logoUrl?: string;
  institutionMotto?: string;
  portalTitle?: string;
  themeMode?: 'light' | 'dark' | 'system';
}

export interface AcademicConfig {
  academicYearStartMonth: number; // 1-12 (e.g. 4 for April or 9 for Sept)
  gradingSystem: 'letter' | 'percentage' | 'gpa_4' | 'gpa_10';
  attendanceType: 'daily_once' | 'daily_twice' | 'subject_wise';
  termsPerYear: number;
}

export interface Tenant {
  id: string;
  name: string;
  code: string; // Short code e.g. 'OAK-01'
  type: InstitutionType;
  registrationNumber: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  branding: TenantBranding;
  academicConfig: AcademicConfig;
  status: TenantStatus;
  enabledModules: string[]; // List of module IDs
  totalStudents?: number;
  totalStaff?: number;
  createdAt: string;
  updatedAt: string;
}

// Campus & Physical Structure
export interface Campus {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  isMainCampus: boolean;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface Building {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  code: string;
  floorsCount: number;
}

export interface Classroom {
  id: string;
  tenantId: string;
  campusId: string;
  buildingId?: string;
  name: string; // e.g. "Room 302" or "Science Lab 1"
  code: string;
  capacity: number;
  type: 'general' | 'lab' | 'auditorium' | 'sports' | 'library';
}

// Permissions & Scope
export type ScopeType = 
  | 'platform'
  | 'country'
  | 'national'
  | 'state'
  | 'district'
  | 'institution'
  | 'campus'
  | 'academic_year'
  | 'class'
  | 'section'
  | 'subject'
  | 'student'
  | 'child'
  | 'module';

export type RoleCategory = 
  | 'PLATFORM'
  | 'INSTITUTION'
  | 'ACADEMIC'
  | 'STUDENT'
  | 'PARENT'
  | 'FINANCE'
  | 'HR'
  | 'LIBRARY'
  | 'TRANSPORT'
  | 'HOSTEL'
  | 'IT'
  | 'DIGITAL_EDUCATION'
  | 'GOVERNMENT'
  | 'platform'
  | 'institution'
  | 'user';

export type RoleStatus = 'ACTIVE' | 'INACTIVE' | 'SYSTEM' | 'CUSTOM' | 'active' | 'inactive';

export interface ScopeConstraint {
  type: ScopeType;
  value?: string; // ID of the specific campus, class, section, or '*' for any
  name?: string;  // Readable name for UI e.g., "Main Campus" or "Grade 10 - Section A"
}

export interface PermissionDefinition {
  id: string;
  code: string; // e.g. 'student.view'
  name: string;
  category: string;
  description: string;
  applicableScopes: ScopeType[];
}

export interface Role {
  id: string;
  tenantId?: string; // Optional: null/empty for global platform roles, tenantId for custom tenant roles
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  status?: RoleStatus;
  category: RoleCategory | string;
  permissions: string[]; // Permission codes
  applicableScopes?: ScopeType[];
}

export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  roleCode: string;
  roleName: string;
  tenantId: string;
  scopes: ScopeConstraint[];
  assignedAt: string;
  assignedBy?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive' | 'suspended';
  defaultTenantId?: string;
  isPlatformSuperAdmin?: boolean;
  isDemo?: boolean;
  is_demo?: boolean;
  environment?: 'DEVELOPMENT' | 'TEST' | 'STAGING' | 'PRODUCTION';
  roleAssignments: RoleAssignment[];
  metadata?: {
    employeeId?: string;
    studentId?: string;
    designation?: string;
    department?: string;
    rollNumber?: string;
    wardName?: string;
    relationship?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// Module Engine
export interface ModuleDependency {
  moduleId: string;
  minVersion?: string;
  optional?: boolean;
}

export interface ModuleRegistryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  category: 'core' | 'academics' | 'operations' | 'community' | 'future';
  icon: string; // Lucide icon name
  route: string;
  isCore: boolean; // Cannot be disabled if true
  requiredPermissions: string[];
  dependencies: ModuleDependency[];
  tenantAvailability: {
    supportedTypes: InstitutionType[];
    beta?: boolean;
  };
}

// Student & Guardian Lifecycle Types
export type StudentLifecycleStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ON_LEAVE'
  | 'TRANSFERRED'
  | 'WITHDRAWN'
  | 'GRADUATED'
  | 'ALUMNI'
  // legacy backward-compatibility strings
  | 'enrolled'
  | 'transferred'
  | 'graduated'
  | 'suspended'
  | 'withdrawn';

export interface Family {
  id: string;
  tenantId: string;
  familyNumber: string;
  familyName: string;
  primaryAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  primaryContactId?: string; // Guardian ID
  primaryEmail?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export type RelationshipType =
  | 'FATHER'
  | 'MOTHER'
  | 'LEGAL_GUARDIAN'
  | 'STEP_PARENT'
  | 'GRANDPARENT'
  | 'SIBLING_GUARDIAN'
  | 'FOSTER_GUARDIAN'
  | 'OTHER';

export interface StudentGuardianRelationship {
  id: string;
  tenantId: string;
  studentId: string;
  guardianId: string;
  relationshipType: RelationshipType;
  isPrimary: boolean;
  isEmergencyContact: boolean;
  canReceiveCommunications: boolean;
  canAccessPortal: boolean;
  canViewAcademicInformation: boolean;
  canViewAttendance: boolean;
  canViewExaminationResults: boolean;
  canViewDocuments: boolean;
  canAuthorizeActions: boolean;
  financialResponsibility: 'PRIMARY' | 'SECONDARY' | 'NONE';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  tenantId?: string;
  familyId?: string;
  guardianNumber?: string;
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  name: string; // compatibility: `${firstName} ${lastName}`
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation?: string;
  employer?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  photoUrl?: string;
  isPrimaryContact: boolean;
  canReceiveCommunication?: boolean;
  canAccessPortal?: boolean;
  emergencyContact?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentStatusChangeHistory {
  id: string;
  previousStatus: StudentLifecycleStatus;
  newStatus: StudentLifecycleStatus;
  changedBy: {
    userId: string;
    email: string;
    name: string;
  };
  changedAt: string;
  reason: string;
  remarks?: string;
  destinationInstitution?: string;
}

export interface StudentDocumentRef {
  id: string;
  title: string;
  documentType: 'birth_certificate' | 'transfer_certificate' | 'previous_marksheet' | 'national_id' | 'photo' | 'medical_record' | 'other';
  url?: string;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  uploadedAt: string;
  verifiedBy?: string;
  notes?: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  rollNumber?: string;
  enrollmentDate: string;
  admissionDate?: string;
  startDate?: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PROMOTED' | 'RETAINED' | 'TRANSFERRED' | 'WITHDRAWN';
  promotedAt?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentDuplicateCandidate {
  student: Student;
  confidenceScore: number;
  matchReasons: string[];
}

export interface Student {
  id: string;
  tenantId: string;
  campusId: string;
  studentIdNumber: string; // Permanent Admission Number, e.g. "STU-2027-000015"
  admissionNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
  };
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  photoUrl?: string;
  bloodGroup?: string;
  nationalId?: string; // Aadhaar / SSN / Govt Identity
  email?: string;
  phone?: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  
  // Academic Identity
  enrollmentDate: string;
  currentAcademicYearId: string;
  academicYearId?: string;
  currentClassId: string;
  currentSectionId: string;
  rollNumber?: string;
  admissionSessionId?: string;
  admissionApplicationId?: string;
  
  // Previous Education
  previousInstitution?: string;
  previousClass?: string;
  previousBoard?: string;
  previousAcademicInfo?: string;
  
  // Guardians & Contacts
  guardians: Guardian[];
  
  // Medical & Special Notes
  medicalNotes?: string;
  specialNeeds?: string;
  
  // Status & Lifecycle
  status: StudentLifecycleStatus;
  statusHistory?: StudentStatusChangeHistory[];
  documents?: StudentDocumentRef[];
  exitDate?: string;
  exitReason?: string;
  lastAttendanceDate?: string;
  
  // Administrative
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Academic Foundation
export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string; // e.g. "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: {
    id: string;
    name: string; // e.g. "Semester 1" or "Term 1"
    startDate: string;
    endDate: string;
  }[];
}

export interface ClassGrade {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string; // e.g. "Grade 10" or "Year 1" or "Class XII"
  code: string; // e.g. "G10"
  order: number; // For sorting
  description?: string;
}

export interface Section {
  id: string;
  tenantId: string;
  classId: string;
  campusId: string;
  name: string; // e.g. "Section A", "Section B"
  code: string;
  roomNumber?: string;
  classTeacherId?: string;
  classTeacherName?: string;
  maxCapacity: number;
  currentStudentCount?: number;
}

export interface Subject {
  id: string;
  tenantId: string;
  name: string; // e.g. "Mathematics", "Advanced Physics"
  code: string; // e.g. "MTH-101"
  type: 'core' | 'elective' | 'lab' | 'vocational';
  creditHours?: number;
  description?: string;
  applicableClassIds: string[]; // ClassGrade IDs
}

// Attendance Foundation & Daily Engine Types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'leave' | 'half_day';
export type AttendanceSessionType = 'DAILY' | 'PERIOD' | 'EVENT' | 'EXAM' | 'LAB' | 'ACTIVITY';
export type AttendanceSessionStatus = 'DRAFT' | 'OPEN' | 'SUBMITTED' | 'LOCKED' | 'CANCELLED';
export type AttendanceSource = 'MANUAL' | 'TABLET' | 'BIOMETRIC' | 'RFID' | 'QR' | 'API' | 'AUTOMATED';

export interface AttendanceSession {
  id: string;
  tenantId: string;
  campusId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  sessionType: AttendanceSessionType;
  subjectId?: string;
  periodId?: string;
  periodName?: string;
  teacherId?: string;
  teacherName?: string;
  status: AttendanceSessionStatus;
  openedAt?: string;
  submittedAt?: string;
  lockedAt?: string;
  createdBy: string;
  submittedBy?: string;
  lockedBy?: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  leaveCount: number;
  isHoliday?: boolean;
  isSchoolClosed?: boolean;
  holidayReason?: string;
  closureReason?: string;
  source: AttendanceSource;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  attendanceSessionId: string;
  studentId: string;
  enrollmentId: string; // Authoritative reference to StudentEnrollment
  academicYearId: string;
  classId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  sessionType: AttendanceSessionType;
  subjectId?: string;
  periodId?: string;
  studentName: string;
  rollNumber?: string;
  admissionNumber?: string;
  status: AttendanceStatus;
  arrivalTime?: string; // HH:mm (e.g., '08:15')
  departureTime?: string;
  lateMinutes?: number;
  reason?: string;
  remarks?: string;
  leaveRequestId?: string;
  source: AttendanceSource;
  recordedBy: string;
  recordedAt: string;
  correctedBy?: string;
  correctedAt?: string;
  previousStatus?: AttendanceStatus;
  correctionReason?: string;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceCorrectionRecord {
  id: string;
  tenantId: string;
  attendanceRecordId: string;
  attendanceSessionId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  classId: string;
  sectionId: string;
  date: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
  correctedByUserId: string;
  correctedByName: string;
  correctedAt: string;
  approvalStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: string;
}

export interface TenantAttendanceConfig {
  tenantId: string;
  dailyAttendanceRequired: boolean;
  periodAttendanceEnabled: boolean;
  schoolStartTime: string; // e.g. "08:00"
  schoolEndTime: string;   // e.g. "15:00"
  lateThresholdMinutes: number; // e.g. 15
  gracePeriodMinutes: number;   // e.g. 5
  autoLateOnThreshold: boolean;
  allowExcusedAbsence: boolean;
  allowLeaveStatus: boolean;
  requireCorrectionApproval: boolean;
  autoLockAfterHours?: number; // e.g. 24
  lowAttendanceWarningThreshold: number; // e.g. 75
  lowAttendanceCriticalThreshold: number; // e.g. 60
  countLateAs: 'present' | 'half_day' | 'late';
  countExcusedAs: 'excused' | 'present' | 'absent';
  countLeaveAs: 'leave' | 'present' | 'excused';
  updatedAt: string;
  updatedBy: string;
}

export interface StaffAttendanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  date: string; // YYYY-MM-DD
  userId: string;
  userName: string;
  designation: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  recordedBy: string;
  recordedAt: string;
}

// Security Audit & Event System
export type AuditAction = 
  | 'INVENTORY_ITEM_CREATED'
  | 'INVENTORY_ITEM_UPDATED'
  | 'INVENTORY_RECEIVED'
  | 'INVENTORY_ISSUED'
  | 'INVENTORY_RETURNED'
  | 'INVENTORY_TRANSFERRED'
  | 'INVENTORY_ADJUSTED'
  | 'INVENTORY_RESERVED'
  | 'INVENTORY_AUDIT_CREATED'
  | 'INVENTORY_ASSET_CREATED'
  | 'INVENTORY_ASSET_ASSIGNED'
  | 'INVENTORY_ASSET_TRANSFERRED'
  | 'INVENTORY_ASSET_RETURNED'
  | 'INVENTORY_ASSET_INSPECTED'
  | 'INVENTORY_ASSET_WRITTEN_OFF'
  | 'INVENTORY_ASSET_DISPOSED'
  | 'MAINTENANCE_CREATED'
  | 'MAINTENANCE_COMPLETED'
  | 'FACILITY_REQUEST_CREATED'
  | 'FACILITY_REQUEST_RESOLVED'
  | 'WARRANTY_CREATED'
  | 'SERVICE_CONTRACT_CREATED'
  | 'ASSET_INCIDENT_REPORTED'
  | 'ASSET_DISPOSAL_PROPOSED'
  | 'ASSET_DISPOSAL_APPROVED'
  | 'USER_CREATED'
  | 'USER_CREATE'
  | 'USER_UPDATED'
  | 'USER_UPDATE'
  | 'USER_DISABLED'
  | 'USER_ROLE_ASSIGNED'
  | 'TENANT_CREATED'
  | 'TENANT_UPDATED'
  | 'MODULE_ENABLED'
  | 'MODULE_DISABLED'
  | 'STUDENT_CREATED'
  | 'STUDENT_ENROLLED'
  | 'STUDENT_UPDATED'
  | 'STUDENT_STATUS_CHANGED'
  | 'STUDENT_TRANSFERRED'
  | 'STUDENT_WITHDRAWN'
  | 'STUDENT_GRADUATED'
  | 'STUDENT_GUARDIAN_LINKED'
  | 'STUDENT_GUARDIAN_UNLINKED'
  | 'STUDENT_PHOTO_UPDATED'
  | 'STUDENT_DOCUMENT_ADDED'
  | 'ACADEMIC_YEAR_CREATED'
  | 'CLASS_CREATED'
  | 'SECTION_CREATED'
  | 'ATTENDANCE_RECORDED'
  | 'ATTENDANCE_MODIFIED'
  | 'PERMISSION_MODIFIED'
  | 'SECURITY_CONFIG_CHANGED'
  | 'RESTRICTED_DATA_ACCESSED'
  | 'STAFF_PROFILE_CREATED'
  | 'STAFF_PROFILE_UPDATED'
  | 'STAFF_HR_CASE_LOGGED'
  // Phase 3 Academic Management Audit Actions
  | 'TEACHER_CREATED'
  | 'TEACHER_UPDATED'
  | 'TEACHER_ASSIGNED'
  | 'TEACHER_UNASSIGNED'
  | 'COURSE_ASSIGN'
  | 'TIMETABLE_CREATED'
  | 'TIMETABLE_UPDATED'
  | 'TIMETABLE_DELETED'
  | 'LESSON_PLAN_CREATED'
  | 'LESSON_PLAN_UPDATED'
  | 'LESSON_PLAN_STATUS_CHANGED'
  | 'ASSIGNMENT_CREATED'
  | 'ASSIGNMENT_UPDATED'
  | 'ASSIGNMENT_PUBLISHED'
  | 'ASSIGNMENT_CLOSED'
  | 'ASSIGNMENT_GRADED'
  | 'ASSESSMENT_CREATED'
  | 'ASSESSMENT_UPDATED'
  | 'ASSESSMENT_SCORED'
  | 'EXAM_CREATED'
  | 'EXAMINATION_CREATED'
  | 'EXAM_SCHEDULED'
  | 'EXAMINATION_UPDATED'
  | 'MARKS_ENTERED'
  | 'MARKS_RECORDED'
  | 'MARKS_SUBMITTED'
  | 'MARKS_VERIFIED'
  | 'MARKS_APPROVED'
  | 'MARKS_PUBLISHED'
  | 'MARKS_CORRECTED'
  | 'GRADING_SCHEME_SAVED'
  | 'REPORT_CARD_GENERATED'
  | 'REPORT_CARD_VERIFIED'
  | 'REPORT_CARD_APPROVED'
  | 'REPORT_CARD_PUBLISHED'
  | 'STUDENT_PROMOTED'
  | 'PROMOTION_EXECUTED'
  | 'FAMILY_CREATED'
  | 'FAMILY_UPDATED'
  | 'GUARDIAN_CREATED'
  | 'GUARDIAN_UPDATED'
  | 'GUARDIAN_LINKED'
  | 'GUARDIAN_UNLINKED'
  | 'STUDENT_GUARDIAN_LINKED'
  | 'STUDENT_GUARDIAN_UNLINKED'
  | 'GUARDIAN_PORTAL_ACCESS_ENABLED'
  | 'GUARDIAN_PORTAL_ACCESS_DISABLED'
  | 'RELATIONSHIP_PERMISSION_CHANGED'
  | 'RESTRICTED_GUARDIAN_DATA_ACCESSED'
  // Student Exit & Clearance Actions
  | 'EXIT_CONFIG_UPDATED'
  | 'EXIT_REQUEST_CREATED'
  | 'EXIT_REQUEST_SUBMITTED'
  | 'EXIT_REQUEST_REVIEWED'
  | 'EXIT_REQUEST_STATUS_UPDATED'
  | 'EXIT_REQUEST_CANCELLED'
  | 'EXIT_REQUEST_REJECTED'
  | 'EXIT_REQUEST_APPROVED'
  | 'EXIT_CLEARANCE_CREATED'
  | 'EXIT_CLEARANCE_ITEM_CLEARED'
  | 'EXIT_CLEARANCE_ITEM_BLOCKED'
  | 'EXIT_CLEARANCE_ITEM_WAIVED'
  | 'EXIT_CLEARANCE_COMPLETED'
  // Phase 6.4B Certificate Actions
  | 'CERTIFICATE_DRAFT_CREATED'
  | 'CERTIFICATE_VERIFIED'
  | 'CERTIFICATE_SIGNED'
  | 'CERTIFICATE_ISSUED'
  | 'CERTIFICATE_REISSUED'
  | 'CERTIFICATE_CANCELLED'
  | 'CERTIFICATE_TEMPLATE_CREATED'
  | 'CERTIFICATE_TEMPLATE_UPDATED'
  | 'CERTIFICATE_NUMBERING_CONFIG_UPDATED'
  // Phase 7.1 Attendance Lifecycle Actions
  | 'ATTENDANCE_SESSION_CREATED'
  | 'ATTENDANCE_SESSION_OPENED'
  | 'ATTENDANCE_SUBMITTED'
  | 'ATTENDANCE_LOCKED'
  | 'ATTENDANCE_UNLOCKED'
  | 'ATTENDANCE_CORRECTED'
  | 'ATTENDANCE_CANCELLED'
  | 'ATTENDANCE_CONFIG_UPDATED'
  | 'ATTENDANCE_HOLIDAY_DECLARED'
  | 'ATTENDANCE_CLOSURE_DECLARED'
  | 'STUDENT_MARKED_ABSENT'
  | 'STUDENT_MARKED_LATE'
  // Phase 7.2 Attendance Policy & Leave Actions
  | 'POLICY_CREATED'
  | 'POLICY_UPDATED'
  | 'POLICY_ACTIVATED'
  | 'LEAVE_SUBMITTED'
  | 'LEAVE_APPROVED'
  | 'LEAVE_REJECTED'
  | 'CONDONATION_SUBMITTED'
  | 'CONDONATION_APPROVED'
  | 'CONDONATION_REJECTED'
  // Phase 7.4 Examination & Assessment Foundation Actions
  | 'EXAMINATION_CREATED'
  | 'EXAMINATION_UPDATED'
  | 'EXAMINATION_SCHEDULED'
  | 'EXAMINATION_APPROVED'
  | 'EXAMINATION_PUBLISHED'
  | 'EXAMINATION_CANCELLED'
  | 'EXAMINATION_CORRECTED'
  | 'ELIGIBILITY_GENERATED'
  | 'ELIGIBILITY_OVERRIDDEN'
  | 'SCHEDULE_CONFLICT_DETECTED'
  // Phase 7.5 Marks & Results Engine Actions
  | 'MARK_CREATED'
  | 'MARK_SUBMITTED'
  | 'MARK_VERIFIED'
  | 'MARK_APPROVED'
  | 'MARK_LOCKED'
  | 'RESULT_PUBLISHED'
  | 'MARK_CORRECTION_REQUESTED'
  // Phase 7.9 Timetable & Scheduling
  | 'TIMETABLE_CREATED'
  | 'TIMETABLE_UPDATED'
  | 'TIMETABLE_SUBMITTED'
  | 'TIMETABLE_APPROVED'
  | 'TIMETABLE_PUBLISHED'
  | 'TIMETABLE_SUPERSEDED'
  | 'TIMETABLE_ARCHIVED'
  | 'PERIOD_STRUCTURE_CREATED'
  | 'PERIOD_STRUCTURE_UPDATED'
  | 'SLOT_CREATED'
  | 'SLOT_UPDATED'
  | 'SLOT_DELETED'
  | 'CONFLICT_DETECTED'
  | 'CONFLICT_RESOLVED'
  | 'CONFLICT_OVERRIDDEN'
  | 'SUBSTITUTION_CREATED'
  | 'SUBSTITUTION_APPROVED'
  | 'SUBSTITUTION_REJECTED'
  | 'RESOURCE_CREATED'
  | 'RESOURCE_UPDATED'
  | 'RESOURCE_DISABLED'
  | 'TIMETABLE_GENERATED'
  // Phase 7.10 Finance & Billing
  | 'FEE_STRUCTURE_CREATED'
  | 'FEE_STRUCTURE_APPROVED'
  | 'FEE_STRUCTURE_PUBLISHED'
  | 'FEE_ASSIGNMENT_CREATED'
  | 'CHARGE_CREATED'
  | 'CHARGE_POSTED'
  | 'INVOICE_CREATED'
  | 'INVOICE_ISSUED'
  | 'PAYMENT_CREATED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_ALLOCATED'
  | 'PAYMENT_REVERSED'
  | 'REFUND_REQUESTED'
  | 'REFUND_APPROVED'
  | 'REFUND_COMPLETED'
  | 'CONCESSION_CREATED'
  | 'CONCESSION_APPROVED'
  | 'SCHOLARSHIP_CREATED'
  | 'SCHOLARSHIP_APPROVED'
  | 'WAIVER_CREATED'
  | 'WAIVER_APPROVED'
  | 'LATE_FEE_APPLIED'
  | 'WRITE_OFF_CREATED'
  | 'FINANCIAL_HOLD_CREATED'
  | 'FINANCIAL_HOLD_RELEASED'
  | 'FINANCIAL_CLEARANCE_APPROVED'
  // Phase 7.11 Transport
  | 'TRANSPORT_PROFILE_CREATED'
  | 'TRANSPORT_PROFILE_APPROVED'
  | 'ROUTE_CREATED'
  | 'ROUTE_APPROVED'
  | 'ROUTE_PUBLISHED'
  | 'STOP_CREATED'
  | 'TRANSPORT_ASSIGNMENT_CREATED'
  | 'TRANSPORT_ASSIGNMENT_CHANGED'
  | 'VEHICLE_CREATED'
  | 'VEHICLE_UPDATED'
  | 'DRIVER_ASSIGNED'
  | 'TRIP_CREATED'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'TRIP_CANCELLED'
  | 'BOARDING_RECORDED'
  | 'BOARDING_CORRECTED'
  | 'VEHICLE_REPLACED'
  | 'DRIVER_SUBSTITUTED'
  | 'ROUTE_OVERRIDDEN'
  | 'INCIDENT_CREATED'
  | 'INCIDENT_RESOLVED'
  | 'EMERGENCY_ACTION'
  | 'TRANSPORT_HOLD_CREATED'
  | 'TRANSPORT_HOLD_RELEASED'
  // Phase 7.12A Hostel
  | 'HOSTEL_CREATED'
  | 'HOSTEL_UPDATED'
  | 'HOSTEL_APPROVED'
  | 'HOSTEL_PUBLISHED'
  | 'HOSTEL_ARCHIVED'
  | 'BUILDING_CREATED'
  | 'FLOOR_CREATED'
  | 'ROOM_CREATED'
  | 'BED_CREATED'
  | 'ROOM_STATUS_CHANGED'
  | 'BED_STATUS_CHANGED'
  | 'HOSTEL_ALLOCATION_CREATED'
  | 'HOSTEL_ALLOCATION_APPROVED'
  | 'HOSTEL_ALLOCATION_ACTIVATED'
  | 'HOSTEL_ALLOCATION_ENDED'
  | 'HOSTEL_ALLOCATION_TRANSFERRED'
  | 'HOSTEL_CAPACITY_OVERRIDE'
  | 'HOSTEL_STAFF_ASSIGNED'
  | 'HOSTEL_POLICY_CREATED'
  | 'HOSTEL_POLICY_APPROVED'
  | 'HOSTEL_POLICY_PUBLISHED'
  // Phase 7.12B Residence Lifecycle
  | 'RESIDENCE_ALLOCATION_CREATED'
  | 'RESIDENCE_CHECKIN_REQUESTED'
  | 'RESIDENCE_CHECKIN_APPROVED'
  | 'RESIDENCE_CHECKED_IN'
  | 'RESIDENCE_TRANSFER_REQUESTED'
  | 'RESIDENCE_TRANSFER_APPROVED'
  | 'RESIDENCE_TRANSFER_COMPLETED'
  | 'RESIDENCE_TEMPORARY_CREATED'
  | 'RESIDENCE_TEMPORARY_ACTIVATED'
  | 'RESIDENCE_TEMPORARY_EXPIRED'
  | 'RESIDENCE_CHECKOUT_REQUESTED'
  | 'RESIDENCE_CHECKOUT_APPROVED'
  | 'RESIDENCE_CHECKED_OUT'
  | 'RESIDENCE_STATUS_CHANGED'
  // Phase 7.12C Hostel Operations & Mess
  | 'MEAL_PLAN_CREATED'
  | 'MEAL_PLAN_APPROVED'
  | 'MEAL_PLAN_ACTIVATED'
  | 'MEAL_ASSIGNMENT_CREATED'
  | 'MEAL_CONSUMPTION_RECORDED'
  | 'MEAL_CONSUMPTION_CORRECTED'
  | 'MEAL_SESSION_OPENED'
  | 'MEAL_SESSION_CLOSED'
  | 'SERVICE_REQUEST_CREATED'
  | 'SERVICE_REQUEST_ASSIGNED'
  | 'SERVICE_REQUEST_UPDATED'
  | 'SERVICE_REQUEST_RESOLVED'
  | 'SERVICE_REQUEST_CLOSED'
  | 'HOUSEKEEPING_TASK_CREATED'
  | 'HOUSEKEEPING_TASK_COMPLETED'
  | 'INSPECTION_CREATED'
  | 'INSPECTION_APPROVED'
  | 'INVENTORY_HANDOVER_CREATED'
  | 'COMPLAINT_CREATED'
  | 'COMPLAINT_UPDATED'
  | 'COMPLAINT_CLOSED'
  | 'INCIDENT_CREATED'
  | 'INCIDENT_ESCALATED'
  | 'INCIDENT_RESOLVED'
  | 'INCIDENT_CLOSED'
  | 'EMERGENCY_OVERRIDE_CREATED'
  // Phase 7.13 Health & Student Support Actions
  | 'SUPPORT_CASE_CREATED'
  | 'SUPPORT_CASE_UPDATED'
  | 'SUPPORT_CASE_ASSIGNED'
  | 'SUPPORT_CASE_TRIAGED'
  | 'SUPPORT_CASE_RESOLVED'
  | 'SUPPORT_CASE_CLOSED'
  | 'HEALTH_ENCOUNTER_CREATED'
  | 'COUNSELLING_CASE_CREATED'
  | 'COUNSELLING_SESSION_CREATED'
  | 'SUPPORT_PLAN_CREATED'
  | 'SUPPORT_PLAN_UPDATED'
  | 'SUPPORT_REFERRAL_CREATED'
  | 'SUPPORT_REFERRAL_UPDATED'
  | 'SUPPORT_CONSENT_GRANTED'
  | 'SUPPORT_CONSENT_WITHDRAWN'
  | 'SUPPORT_ACCOMMODATION_CREATED'
  | 'SUPPORT_INCIDENT_CREATED'
  | 'SUPPORT_INCIDENT_ESCALATED'
  | 'SENSITIVE_RECORD_ACCESSED'
  | 'SUPPORT_EXPORT_CREATED'
  // Phase 7.26 Student Support Audit Actions
  | 'STUDENT_SUPPORT_CASE_CREATED'
  | 'STUDENT_SUPPORT_CASE_UPDATED'
  | 'STUDENT_SUPPORT_CASE_ASSIGNED'
  | 'STUDENT_SUPPORT_CASE_ESCALATED'
  | 'STUDENT_SUPPORT_CASE_RESOLVED'
  | 'STUDENT_SUPPORT_CASE_CLOSED'
  | 'COUNSELING_REFERRAL_CREATED'
  | 'COUNSELING_SESSION_RECORDED'
  | 'WELFARE_INTERVENTION_CREATED'
  | 'GRIEVANCE_CREATED'
  | 'GRIEVANCE_RESOLVED'
  | 'SAFEGUARDING_CASE_CREATED'
  | 'SAFEGUARDING_CASE_ESCALATED'
  | 'SAFEGUARDING_CASE_CLOSED'
  | 'SUPPORT_CONSENT_CREATED'
  | 'SUPPORT_CONSENT_REVOKED'
  | 'SUPPORT_DISCLOSURE_RECORDED'
  | 'SUPPORT_REVIEW_COMPLETED'
  // Phase 7.14 & 7.30 Communication Actions
  | 'COMMUNICATION_TEMPLATE_CREATED'
  | 'COMMUNICATION_TEMPLATE_UPDATED'
  | 'COMMUNICATION_TEMPLATE_APPROVED'
  | 'COMMUNICATION_TEMPLATE_PUBLISHED'
  | 'COMMUNICATION_CREATED'
  | 'COMMUNICATION_SUBMITTED'
  | 'COMMUNICATION_APPROVED'
  | 'COMMUNICATION_REJECTED'
  | 'COMMUNICATION_SCHEDULED'
  | 'COMMUNICATION_PUBLISHED'
  | 'COMMUNICATION_EMERGENCY_CREATED'
  | 'COMMUNICATION_CANCELLED'
  | 'COMMUNICATION_ARCHIVED'
  | 'STAKEHOLDER_ENGAGEMENT_RECORDED'
  | 'COMMUNICATION_CAMPAIGN_CREATED'
  | 'COMMUNICATION_CAMPAIGN_APPROVED'
  | 'COMMUNICATION_SENT'
  | 'COMMUNICATION_DELIVERY_UPDATED'
  | 'COMMUNICATION_ACKNOWLEDGED'
  | 'COMMUNICATION_PREFERENCE_UPDATED'
  | 'COMMUNICATION_CONSENT_GRANTED'
  | 'COMMUNICATION_CONSENT_REVOKED'
  | 'COMMUNICATION_ANNOUNCEMENT_PUBLISHED'
  | 'COMMUNICATION_BROADCAST_SENT'
  | 'COMMUNICATION_EMERGENCY_SENT'
  | 'COMMUNICATION_SUPPRESSED'
  | 'COMMUNICATION_ESCALATED'
  // Phase 7.15A & 7.15B Library Actions
  | 'LIBRARY_CREATED'
  | 'LIBRARY_UPDATED'
  | 'LIBRARY_ACTIVATED'
  | 'LIBRARY_ARCHIVED'
  | 'RESOURCE_CREATED'
  | 'RESOURCE_UPDATED'
  | 'RESOURCE_APPROVED'
  | 'RESOURCE_PUBLISHED'
  | 'RESOURCE_VERSION_CREATED'
  | 'RESOURCE_WITHDRAWN'
  | 'RESOURCE_ARCHIVED'
  | 'COPY_CREATED'
  | 'COPY_UPDATED'
  | 'COPY_STATUS_CHANGED'
  | 'MEMBERSHIP_CREATED'
  | 'MEMBERSHIP_UPDATED'
  | 'MEMBERSHIP_SUSPENDED'
  | 'MEMBERSHIP_EXPIRED'
  | 'CATEGORY_CREATED'
  | 'CATEGORY_UPDATED'
  | 'LOCATION_CREATED'
  | 'LOCATION_UPDATED'
  | 'ACQUISITION_CREATED'
  | 'ACQUISITION_UPDATED'
  | 'DIGITAL_RESOURCE_REGISTERED'
  | 'LIBRARY_LOAN_CREATED'
  | 'LIBRARY_LOAN_ISSUED'
  | 'LIBRARY_LOAN_RETURNED'
  | 'LIBRARY_LOAN_RENEWED'
  | 'LIBRARY_RESERVATION_CREATED'
  | 'LIBRARY_RESERVATION_FULFILLED'
  | 'LIBRARY_RESERVATION_CANCELLED'
  | 'LIBRARY_FINE_CREATED'
  | 'LIBRARY_FINE_ADJUSTED'
  | 'LIBRARY_FINE_WAIVED'
  | 'LIBRARY_LOST_ITEM_REPORTED'
  | 'LIBRARY_LOST_ITEM_CONFIRMED'
  | 'LIBRARY_LOST_ITEM_RECOVERED'
  | 'LIBRARY_DAMAGE_REPORTED'
  | 'LIBRARY_DAMAGE_RESOLVED'
  | 'LIBRARY_CIRCULATION_BLOCKED'
  | 'LIBRARY_CIRCULATION_UNBLOCKED'
  // Phase 7.16 Examination Operations Actions
  | 'EXAM_SESSION_CREATED'
  | 'EXAM_SESSION_APPROVED'
  | 'EXAM_SESSION_ACTIVATED'
  | 'EXAM_SESSION_CLOSED'
  | 'EXAM_PAPER_CREATED'
  | 'EXAM_PAPER_APPROVED'
  | 'EXAM_PAPER_RELEASED'
  | 'SEATING_ASSIGNED'
  | 'SEATING_REASSIGNED'
  | 'INVIGILATOR_ASSIGNED'
  | 'INVIGILATOR_SUBSTITUTED'
  | 'EXAM_PRESENCE_RECORDED'
  | 'EXAM_INCIDENT_CREATED'
  | 'EXAM_INCIDENT_RESOLVED'
  | 'MODERATION_REQUESTED'
  | 'MODERATION_APPROVED'
  | 'RESULT_FINALIZATION_REQUESTED'
  | 'RESULT_FINALIZED'
  | 'RESULT_LOCKED'
  | 'EXAM_EXCEPTION_CREATED'
  | 'EXAM_EXCEPTION_RESOLVED'
  // Phase 7.17 Staff & Workforce Management Actions
  | 'STAFF_ONBOARDED'
  | 'STAFF_UPDATED'
  | 'STAFF_STATUS_CHANGED'
  | 'STAFF_DOCUMENT_UPLOADED'
  | 'STAFF_DOCUMENT_VERIFIED'
  | 'STAFF_ASSIGNMENT_CREATED'
  | 'STAFF_ASSIGNMENT_UPDATED'
  | 'STAFF_ASSIGNMENT_ENDED'
  | 'STAFF_QUALIFICATION_ADDED'
  | 'STAFF_QUALIFICATION_VERIFIED'
  | 'STAFF_LEAVE_POLICY_UPDATED'
  | 'STAFF_LEAVE_REQUEST_SUBMITTED'
  | 'STAFF_LEAVE_APPROVED'
  | 'STAFF_LEAVE_REJECTED'
  | 'STAFF_LEAVE_CANCELLED'
  | 'STAFF_LEAVE_BALANCE_ADJUSTED'
  | 'STAFF_SUBSTITUTION_SCHEDULED'
  | 'STAFF_TRAINING_PROGRAM_CREATED'
  | 'STAFF_TRAINING_ENROLLED'
  | 'STAFF_TRAINING_COMPLETED'
  | 'STAFF_COMPLIANCE_RECORD_CREATED'
  | 'STAFF_COMPLIANCE_VERIFIED'
  | 'STAFF_PERFORMANCE_CYCLE_CREATED'
  | 'STAFF_PERFORMANCE_FINALIZED'
  | 'STAFF_HR_CASE_LOGGED'
  | 'STAFF_HR_CASE_UPDATED'
  | 'STAFF_EXIT_INITIATED'
  | 'STAFF_EXIT_CLEARANCE_SIGNED'
  | 'STAFF_EXIT_FINALIZED'
  // Phase 7.18 Procurement, Vendor & Purchase Management Actions
  | 'VENDOR_CREATED'
  | 'VENDOR_UPDATED'
  | 'VENDOR_VERIFIED'
  | 'VENDOR_SUSPENDED'
  | 'REQUEST_CREATED'
  | 'REQUEST_SUBMITTED'
  | 'REQUEST_APPROVED'
  | 'REQUEST_REJECTED'
  | 'REQUISITION_CREATED'
  | 'RFQ_CREATED'
  | 'QUOTATION_SUBMITTED'
  | 'QUOTATION_LOCKED'
  | 'COMPARISON_CREATED'
  | 'VENDOR_SELECTED'
  | 'PO_CREATED'
  | 'PO_APPROVED'
  | 'PO_ISSUED'
  | 'RECEIPT_CREATED'
  | 'INSPECTION_COMPLETED'
  | 'RETURN_CREATED'
  | 'CONTRACT_CREATED'
  | 'EXCEPTION_CREATED'
  | 'EMERGENCY_PROCUREMENT'
  | 'PROCUREMENT_CANCELLED'
  // Phase 7.21 Alumni, Career Services, Internship & Placement Governance Actions
  | 'ALUMNI_PROFILE_CREATED'
  | 'ALUMNI_PROFILE_UPDATED'
  | 'CORPORATE_PARTNER_CREATED'
  | 'CORPORATE_PARTNER_UPDATED'
  | 'JOB_POSTING_CREATED'
  | 'JOB_POSTING_PUBLISHED'
  | 'JOB_POSTING_CLOSED'
  | 'PLACEMENT_DRIVE_CREATED'
  | 'PLACEMENT_DRIVE_STATUS_UPDATED'
  | 'JOB_APPLICATION_SUBMITTED'
  | 'JOB_APPLICATION_STATUS_UPDATED'
  | 'PLACEMENT_OFFER_CREATED'
  | 'PLACEMENT_OFFER_VERIFIED'
  | 'MENTORSHIP_SESSION_SCHEDULED'
  | 'ALUMNI_EVENT_CREATED'
  | 'ALUMNI_CONTRIBUTION_RECORDED'
  // Phase 7.22 Learning Management Governance Actions
  | 'LEARNING_COURSE_CREATED'
  | 'LEARNING_COURSE_UPDATED'
  | 'LEARNING_COURSE_APPROVED'
  | 'LEARNING_COURSE_PUBLISHED'
  | 'LEARNING_CONTENT_CREATED'
  | 'LEARNING_CONTENT_PUBLISHED'
  | 'LEARNING_CONTENT_VERSION_CREATED'
  | 'LEARNING_TEACHING_ASSIGNMENT_CREATED'
  | 'LEARNING_ASSIGNMENT_CREATED'
  | 'LEARNING_ASSIGNMENT_PUBLISHED'
  | 'LEARNING_SUBMISSION_CREATED'
  | 'LEARNING_SUBMISSION_GRADED'
  | 'LEARNING_GRADE_FINALIZED'
  | 'LEARNING_QUIZ_CREATED'
  | 'LEARNING_QUIZ_ATTEMPT_STARTED'
  | 'LEARNING_QUIZ_ATTEMPT_SUBMITTED'
  | 'LEARNING_ASSESSMENT_FINALIZED'
  | 'LEARNING_DISCUSSION_CREATED'
  | 'LEARNING_DISCUSSION_MODERATED'
  | 'LEARNING_ANNOUNCEMENT_CREATED'
  | 'LEARNING_PROGRESS_UPDATED'
  | 'LEARNING_COMPLETION_RECORDED'
  | 'LEARNING_EXPORT_CREATED'
  // Phase 7.22 Research, Innovation & Institutional Knowledge Governance Actions
  | 'RESEARCH_PROJECT_CREATED'
  | 'RESEARCH_PROJECT_SUBMITTED'
  | 'RESEARCH_PROJECT_APPROVED'
  | 'RESEARCH_PROJECT_COMPLETED'
  | 'RESEARCH_PROPOSAL_CREATED'
  | 'RESEARCH_PROPOSAL_SUBMITTED'
  | 'RESEARCH_PROPOSAL_REVIEWED'
  | 'RESEARCH_PROPOSAL_APPROVED'
  | 'RESEARCH_TEAM_UPDATED'
  | 'RESEARCH_MILESTONE_UPDATED'
  | 'RESEARCH_OUTPUT_CREATED'
  | 'RESEARCH_PUBLICATION_REGISTERED'
  | 'RESEARCH_IP_CREATED'
  | 'RESEARCH_IP_APPROVED'
  | 'INNOVATION_INITIATIVE_CREATED'
  | 'INSTITUTIONAL_PROJECT_CREATED'
  | 'PROJECT_TASK_UPDATED'
  | 'PROJECT_RISK_CREATED'
  | 'PROJECT_ISSUE_CREATED'
  | 'PROJECT_DECISION_RECORDED'
  | 'KNOWLEDGE_ASSET_CREATED'
  | 'RESEARCH_EXPORT_CREATED'
  // Phase 7.24 Governance, Compliance & Quality Audit Actions
  | 'GOVERNANCE_BODY_CREATED'
  | 'GOVERNANCE_BODY_UPDATED'
  | 'GOVERNANCE_MEMBER_ADDED'
  | 'GOVERNANCE_MEETING_CREATED'
  | 'GOVERNANCE_RESOLUTION_CREATED'
  | 'GOVERNANCE_ACTION_ITEM_CREATED'
  | 'POLICY_CREATED'
  | 'POLICY_VERSION_CREATED'
  | 'POLICY_SUBMITTED'
  | 'POLICY_APPROVED'
  | 'POLICY_PUBLISHED'
  | 'POLICY_RETIRED'
  | 'COMPLIANCE_FRAMEWORK_CREATED'
  | 'COMPLIANCE_OBLIGATION_CREATED'
  | 'COMPLIANCE_CONTROL_CREATED'
  | 'COMPLIANCE_EVIDENCE_RECORDED'
  | 'COMPLIANCE_EXCEPTION_CREATED'
  | 'ACCREDITATION_BODY_CREATED'
  | 'ACCREDITATION_CYCLE_CREATED'
  | 'ACCREDITATION_STANDARD_CREATED'
  | 'ACCREDITATION_CRITERION_CREATED'
  | 'QUALITY_FRAMEWORK_CREATED'
  | 'QUALITY_INDICATOR_CREATED'
  | 'QUALITY_TARGET_CREATED'
  | 'QUALITY_MEASUREMENT_RECORDED'
  | 'INSTITUTIONAL_AUDIT_CREATED'
  | 'AUDIT_FINDING_CREATED'
  | 'CORRECTIVE_ACTION_CREATED'
  | 'CORRECTIVE_ACTION_CLOSED'
  | 'INSTITUTIONAL_RISK_CREATED'
  | 'RISK_MITIGATION_UPDATED'
  // Phase 7.25 Access Governance Actions
  | 'USER_INVITED'
  | 'USER_ACTIVE'
  | 'USER_SUSPENDED'
  | 'USER_DISABLED'
  | 'USER_ARCHIVED'
  | 'USER_LOCKED'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REVOKED'
  | 'MODULE_ASSIGNED'
  | 'MODULE_UNASSIGNED'
  | 'CAMPUS_ASSIGNED'
  | 'CAMPUS_UNASSIGNED'
  | 'TEMP_ACCESS_GRANTED'
  | 'TEMP_ACCESS_REVOKED'
  | 'DELEGATED_ACCESS_GRANTED'
  | 'DELEGATED_ACCESS_REVOKED'
  | 'ACCESS_REVIEW_CREATED'
  | 'SECURITY_SESSION_REVOKED'
  // Phase 7.27 Institutional Document, Records & Retention Governance Actions
  | 'INSTITUTIONAL_RECORD_CREATED'
  | 'INSTITUTIONAL_RECORD_UPDATED'
  | 'RECORD_CLASSIFICATION_CHANGED'
  | 'RECORD_STATUS_CHANGED'
  | 'RETENTION_SCHEDULE_CREATED'
  | 'RETENTION_SCHEDULE_UPDATED'
  | 'LEGAL_HOLD_INSTITUTED'
  | 'LEGAL_HOLD_RELEASED'
  | 'DISPOSITION_BATCH_CREATED'
  | 'DISPOSITION_BATCH_APPROVED'
  | 'DISPOSITION_BATCH_EXECUTED'
  | 'EVIDENCE_PACKAGE_CREATED'
  | 'EVIDENCE_PACKAGE_LOCKED'
  // Phase 7.28 Privacy Governance Actions
  | 'PRIVACY_PURPOSE_CREATED'
  | 'PRIVACY_PURPOSE_APPROVED'
  | 'PRIVACY_CONSENT_GRANTED'
  | 'PRIVACY_CONSENT_WITHDRAWN'
  | 'PRIVACY_REQUEST_CREATED'
  | 'PRIVACY_REQUEST_APPROVED'
  | 'PRIVACY_EXPORT_AUTHORIZED'
  | 'PRIVACY_EXPORT_COMPLETED'
  | 'PRIVACY_INCIDENT_CREATED'
  | 'PRIVACY_INCIDENT_ESCALATED'
  | 'PRIVACY_INCIDENT_CLOSED'
  | 'PRIVACY_PIA_CREATED'
  | 'PRIVACY_PIA_APPROVED'
  | 'PRIVACY_SHARING_APPROVED'
  | 'PRIVACY_CONTROL_REVIEWED'
  | 'PRIVACY_EXCEPTION_APPROVED'
  // Phase 7.29 Institutional Performance Actions
  | 'STRATEGY_PLAN_CREATED'
  | 'STRATEGY_PLAN_SUBMITTED'
  | 'STRATEGY_PLAN_APPROVED'
  | 'STRATEGY_PLAN_ACTIVATED'
  | 'STRATEGY_OBJECTIVE_CREATED'
  | 'STRATEGY_INITIATIVE_CREATED'
  | 'KPI_DEFINITION_CREATED'
  | 'KPI_VERSIONED'
  | 'KPI_MEASUREMENT_SUBMITTED'
  | 'KPI_MEASUREMENT_VERIFIED'
  | 'KPI_MEASUREMENT_APPROVED'
  | 'KPI_MEASUREMENT_LOCKED'
  | 'PERFORMANCE_REVIEW_CREATED'
  | 'PERFORMANCE_REVIEW_APPROVED'
  | 'PERFORMANCE_RISK_CREATED'
  | 'PERFORMANCE_RISK_ESCALATED'
  | 'CORRECTIVE_ACTION_CREATED'
  | 'CORRECTIVE_ACTION_CLOSED'
  | 'STRATEGY_REVIEW_DECISION'
  // Phase 7.31 Institutional Enterprise Risk & Incident Command Actions
  | 'INSTITUTIONAL_RISK_ITEM_CREATED'
  | 'INSTITUTIONAL_RISK_ITEM_SUBMITTED'
  | 'INSTITUTIONAL_RISK_ITEM_APPROVED'
  | 'INSTITUTIONAL_RISK_ITEM_REJECTED'
  | 'INSTITUTIONAL_RISK_ITEM_REVIEWED'
  | 'INSTITUTIONAL_RISK_STATUS_CHANGED'
  | 'RISK_MITIGATION_ACTION_CREATED'
  | 'RISK_MITIGATION_ACTION_VERIFIED'
  | 'KEY_RISK_INDICATOR_CREATED'
  | 'KEY_RISK_INDICATOR_EVALUATED'
  | 'CAMPUS_INCIDENT_REPORTED'
  | 'CAMPUS_INCIDENT_COMMAND_ACTIVATED'
  | 'CAMPUS_INCIDENT_TIMELINE_LOGGED'
  | 'CAMPUS_INCIDENT_CONTAINED'
  | 'CAMPUS_INCIDENT_RESOLVED'
  | 'CAMPUS_INCIDENT_CLOSED'
  | 'CAMPUS_INCIDENT_PIR_RECORDED'
  | 'BCP_PLAN_CREATED'
  | 'BCP_PLAN_APPROVED'
  | 'BCP_PLAN_ACTIVATED'
  | 'SAFETY_AUDIT_INSPECTION_CREATED'
  | 'SAFETY_AUDIT_INSPECTION_COMPLETED'
  | 'SAFETY_AUDIT_CAR_ISSUED'
  | 'CONTINUITY_DRILL_SCHEDULED'
  | 'CONTINUITY_DRILL_EVALUATED'
  // Phase 7.32 Institutional Scheduling, Timetable & Resource Booking Actions
  | 'TIMETABLE_CREATED'
  | 'TIMETABLE_SUBMITTED'
  | 'TIMETABLE_REVIEWED'
  | 'TIMETABLE_APPROVED'
  | 'TIMETABLE_PUBLISHED'
  | 'TIMETABLE_SUPERSEDE'
  | 'TIMETABLE_ARCHIVED'
  | 'SCHEDULE_ENTRY_CREATED'
  | 'SCHEDULE_ENTRY_UPDATED'
  | 'SCHEDULE_ENTRY_DELETED'
  | 'SCHEDULING_CONFLICT_DETECTED'
  | 'SCHEDULING_CONFLICT_RESOLVED'
  | 'RESOURCE_BOOKING_REQUESTED'
  | 'RESOURCE_BOOKING_APPROVED'
  | 'RESOURCE_BOOKING_REJECTED'
  | 'RESOURCE_BOOKING_CANCELLED'
  | 'FACULTY_SUBSTITUTION_REQUESTED'
  | 'FACULTY_SUBSTITUTION_APPROVED'
  | 'FACULTY_SUBSTITUTION_REJECTED'
  | 'SCHEDULE_CHANGE_REQUESTED'
  | 'SCHEDULE_CHANGE_APPROVED'
  | 'SCHEDULE_CHANGE_IMPLEMENTED'
  | 'CALENDAR_EXCEPTION_CREATED'
  | 'CALENDAR_EXCEPTION_DELETED'
  | 'SCHEDULING_EMERGENCY_OVERRIDE'
  // Phase 7.33 Institutional Student Success, Early Warning & Academic Progression Actions
  | 'STUDENT_SUCCESS_PROFILE_CREATED'
  | 'STUDENT_RISK_CALCULATED'
  | 'STUDENT_RISK_OVERRIDDEN'
  | 'EARLY_WARNING_CREATED'
  | 'EARLY_WARNING_ACKNOWLEDGED'
  | 'INTERVENTION_CREATED'
  | 'INTERVENTION_ASSIGNED'
  | 'INTERVENTION_VERIFIED'
  | 'INTERVENTION_CLOSED'
  | 'RETENTION_CASE_CREATED'
  | 'RETENTION_DECISION_APPROVED'
  | 'PROGRESSION_ASSESSED'
  | 'PROGRESSION_APPROVED'
  | 'SUCCESS_REVIEW_CREATED'
  // Phase 7.34 Quality Execution Actions
  | 'QUALITY_ASSESSMENT_CREATED'
  | 'QUALITY_ASSESSMENT_SUBMITTED'
  | 'QUALITY_ASSESSMENT_VERIFIED'
  | 'QUALITY_ASSESSMENT_APPROVED'
  | 'QUALITY_EVIDENCE_MAPPED'
  | 'QUALITY_EVIDENCE_VERIFIED'
  | 'QUALITY_REVIEW_CREATED'
  | 'QUALITY_REVIEW_APPROVED'
  | 'QUALITY_IMPROVEMENT_CREATED'
  | 'QUALITY_IMPROVEMENT_APPROVED'
  | 'QUALITY_IMPROVEMENT_VERIFIED'
  | 'QUALITY_CAPA_CREATED'
  | 'QUALITY_CAPA_VERIFIED'
  | 'QUALITY_CAPA_CLOSED'
  | 'QUALITY_EVIDENCE_PACKAGE_GENERATED'
  | 'QUALITY_EVIDENCE_PACKAGE_APPROVED'
  // Phase 7.41 Institutional Resource Planning & Portfolio Governance Actions
  | 'RESOURCE_PLAN_CREATED'
  | 'RESOURCE_PLAN_SUBMITTED'
  | 'RESOURCE_PLAN_APPROVED'
  | 'RESOURCE_PLAN_ACTIVATED'
  | 'RESOURCE_ALLOCATION_REQUESTED'
  | 'RESOURCE_ALLOCATION_APPROVED'
  | 'RESOURCE_ALLOCATION_REJECTED'
  | 'RESOURCE_ALLOCATION_EXECUTED'
  | 'RESOURCE_CAPACITY_UPDATED'
  | 'RESOURCE_CONSTRAINT_DETECTED'
  | 'RESOURCE_PRIORITY_CALCULATED'
  | 'RESOURCE_PORTFOLIO_CREATED'
  | 'RESOURCE_PORTFOLIO_APPROVED'
  | 'RESOURCE_PORTFOLIO_REVIEWED'
  | 'RESOURCE_SCENARIO_CREATED'
  | 'RESOURCE_SCENARIO_CERTIFIED'
  | 'RESOURCE_INTERVENTION_CREATED'
  | 'RESOURCE_INTERVENTION_CLOSED'
  | 'RESOURCE_GOVERNANCE_OVERRIDE'
  | 'RESOURCE_DATA_QUALITY_ISSUE_DETECTED'
  // Phase 7.43 Enterprise Architecture Actions
  | 'ADR_APPROVED'
  | 'ADR_SUPERSEDED'
  | 'RISK_APPROVED'
  | 'TECH_DEBT_CLOSED';

export interface AuditRecord {
  id: string;
  tenantId: string;
  tenantName?: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  action: AuditAction;
  resource: 'user' | 'tenant' | 'module' | 'student' | 'academic' | 'attendance' | 'security' | 'role' | 'teacher' | 'timetable' | 'lesson_plan' | 'assignment' | 'assessment' | 'exam' | 'examination' | 'marks' | 'report_card' | 'promotion' | 'family' | 'guardian' | 'relationship' | 'exit' | 'clearance' | 'certificate' | 'certificate_template' | 'certificate_config' | 'attendance_policy' | 'leave_request' | 'attendance_condonation' | 'examination_schedule' | 'examination_eligibility' | 'resource' | 'timetable_slot' | 'substitution' | 'period_structure' | 'timetable_conflict' | 'fee_structure' | 'fee_assignment' | 'invoice' | 'payment' | 'charge' | 'refund' | 'concession' | 'scholarship' | 'financial_hold' | 'transport_profile' | 'transport_route' | 'transport_stop' | 'transport_vehicle' | 'transport_driver' | 'transport_assignment' | 'transport_trip' | 'transport_boarding' | 'transport_incident' | 'hostel_profile' | 'hostel_policy' | 'hostel_building' | 'hostel_floor' | 'hostel_room' | 'hostel_bed' | 'hostel_staff_assignment' | 'hostel_allocation' | 'residence_checkin' | 'residence_transfer' | 'residence_temporary' | 'residence_checkout' | 'residence_status_history' | 'mess_profile' | 'meal_plan' | 'resident_meal_assignment' | 'meal_session' | 'meal_consumption' | 'residence_service_request' | 'housekeeping_task' | 'residence_inspection' | 'inventory_handover' | 'residence_complaint' | 'residence_incident' | 'emergency_override' | 'student_support_case' | 'health_encounter' | 'wellness_observation' | 'counselling_case' | 'counselling_session' | 'support_plan' | 'support_referral' | 'support_consent' | 'support_accommodation' | 'support_incident' | 'communication_template' | 'communication_message' | 'communication_delivery' | 'communication_announcement' | 'communication_campaign' | 'communication_preference' | 'communication_consent' | 'communication_thread' | 'communication_acknowledgement' | 'library_profile' | 'library_resource' | 'library_copy' | 'library_membership' | 'library_category' | 'library_location' | 'library_acquisition' | 'library_loan' | 'library_return' | 'library_renewal' | 'library_reservation' | 'library_fine' | 'library_fine_adjustment' | 'library_lost_item' | 'library_damage_report' | 'library_hold' | 'library_circulation_policy' | 'exam_session' | 'exam_paper' | 'exam_seating' | 'exam_invigilator' | 'exam_presence' | 'exam_incident' | 'exam_result_processing' | 'exam_moderation' | 'exam_exception' | 'staff_profile' | 'staff_document' | 'staff_assignment' | 'staff_qualification' | 'staff_leave_policy' | 'staff_leave_request' | 'staff_leave_balance' | 'staff_substitution' | 'staff_training_program' | 'staff_training_record' | 'staff_compliance_record' | 'staff_performance_cycle' | 'staff_performance_review' | 'staff_hr_case' | 'staff_exit_case' | 'staff_exit_clearance' | 'governance_body' | 'governance_meeting' | 'governance_resolution' | 'governance_action_item' | 'governance_policy' | 'policy_version' | 'compliance_framework' | 'compliance_obligation' | 'compliance_control' | 'compliance_exception' | 'accreditation_body' | 'accreditation_cycle' | 'quality_framework' | 'quality_indicator' | 'quality_measurement' | 'institutional_audit' | 'audit_finding' | 'corrective_action' | 'institutional_risk' | 'risk_mitigation' | 'governance_document_ref' | 'welfare_intervention' | 'grievance' | 'safeguarding_case' | 'support_action_plan' | 'support_disclosure' | 'support_case_review' | 'institutional_record' | 'retention_schedule' | 'legal_hold' | 'disposition_batch' | 'evidence_package' | 'record_audit' | 'privacy_purpose' | 'privacy_consent' | 'privacy_request' | 'privacy_incident' | 'privacy_pia' | 'privacy_sharing' | 'privacy_processor' | 'privacy_security_control' | 'privacy_security_exception' | 'strategy_plan' | 'strategy_objective' | 'strategy_initiative' | 'kpi_definition' | 'kpi_measurement' | 'performance_review' | 'performance_risk' | 'corrective_action' | 'strategy_review' | 'campus_incident' | 'bcp_plan' | 'safety_inspection' | 'continuity_drill' | 'key_risk_indicator' | 'scheduling_timetable' | 'scheduling_entry' | 'scheduling_booking' | 'scheduling_conflict' | 'scheduling_substitution' | 'scheduling_change' | 'scheduling_exception' | 'student_success_profile' | 'student_risk_assessment' | 'student_warning_signal' | 'student_intervention' | 'student_retention_case' | 'student_progression_assessment' | 'student_success_review' | 'quality_assessment_cycle' | 'quality_criterion' | 'quality_indicator' | 'quality_assessment_submission' | 'quality_evidence_mapping' | 'quality_program_review' | 'quality_improvement_initiative' | 'quality_capa_action' | 'quality_review_decision' | 'quality_accreditation_evidence_package' | 'resource_plan' | 'resource_capacity' | 'resource_allocation' | 'resource_portfolio' | 'resource_scenario' | 'resource_intervention' | 'resource_governance' | 'architecture_decision_record' | 'technology_risk' | 'technical_debt_item';
  resourceId: string;
  resourceName?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: Record<string, any> | null;
  newValue?: Record<string, any> | null;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  notes?: string;
}

// ============================================================================
// PHASE 3: ACADEMIC MANAGEMENT DATA MODELS
// ============================================================================

// 1. Teacher Management
export type EmploymentStatus = 'full_time' | 'part_time' | 'contract' | 'probation' | 'visiting';

export interface TeacherProfile {
  id: string;
  tenantId: string;
  userId: string; // Linked directly to User entity
  employeeId: string; // e.g. "DPS-TCH-014"
  qualification: string; // e.g. "M.Sc. Mathematics, B.Ed (Delhi University)"
  specialization: string; // e.g. "Calculus & Linear Algebra"
  department: string; // e.g. "Mathematics & Sciences"
  joiningDate: string; // YYYY-MM-DD
  employmentStatus: EmploymentStatus;
  contactNumber: string;
  email: string;
  profilePhotoUrl?: string;
  bio?: string;
  documents?: {
    id: string;
    title: string;
    type: string;
    url?: string;
    verified: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

// 2. Teacher-Class-Subject Allocation
export interface TeacherAssignment {
  id: string;
  tenantId: string;
  teacherId: string; // TeacherProfile id or userId
  teacherName: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  role: 'primary' | 'assistant' | 'substitute';
  status: 'active' | 'inactive';
  assignedAt: string;
  assignedBy?: string;
}

// 3. Timetable Module
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type PeriodType = 'core' | 'lab' | 'break' | 'sports' | 'activity' | 'assembly';

export interface TimetableEntry {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string; // "08:30"
  endTime: string;   // "09:15"
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  type: PeriodType;
}

export interface TimetableConflict {
  type: 'teacher_conflict' | 'room_conflict' | 'class_conflict' | 'TEACHER_DOUBLE_BOOKED' | 'ROOM_DOUBLE_BOOKED' | 'CLASS_DOUBLE_BOOKED';
  message: string;
  conflictingEntity?: string;
  conflictingEntry?: TimetableEntry;
  details?: {
    dayOfWeek: DayOfWeek;
    periodNumber: number;
    time: string;
    conflictingEntity: string;
    existingEntry: TimetableEntry;
  };
}

// 4. Lesson Planning
export type LessonPlanStatus = 'DRAFT' | 'PLANNED' | 'COMPLETED' | 'CANCELLED';

export interface LessonPlan {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  topic: string;
  title: string;
  learningObjectives: string[];
  teachingMethod: string;
  requiredMaterials: string[];
  estimatedDurationMinutes: number;
  notes?: string;
  lessonDate: string; // YYYY-MM-DD
  status: LessonPlanStatus;
  curriculumUnit?: string;
  smartClassroomReady?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 5. Homework & Assignments
export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'OPEN' | 'CLOSED' | 'REVIEWED';

export interface Assignment {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  instructions?: string;
  assignedDate?: string;
  issueDate?: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  attachmentUrl?: string;
  maximumMarks?: number;
  maxMarks?: number;
  allowLateSubmission?: boolean;
  submissionType?: string;
  status: AssignmentStatus;
  submissionsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type SubmissionStatus = 'submitted' | 'graded' | 'late' | 'resubmit' | 'pending' | 'SUBMITTED' | 'GRADED' | 'PENDING';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  submittedAt: string;
  submissionText?: string;
  attachmentUrl?: string;
  status: SubmissionStatus;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

// 6. Assessments (Continuous Evaluation)
export type AssessmentType = 
  | 'class_test' 
  | 'quiz' 
  | 'unit_test' 
  | 'assignment' 
  | 'practical' 
  | 'oral' 
  | 'project' 
  | 'internal';

export interface Assessment {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title?: string;
  name?: string;
  type?: AssessmentType;
  assessmentType?: AssessmentType;
  date?: string;
  assessmentDate?: string;
  maximumMarks?: number;
  maxMarks?: number;
  passingMarks?: number;
  weightagePercentage?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt?: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  marksObtained: number;
  status: 'present' | 'absent' | 'exempt';
  isAbsent?: boolean;
  remarks?: string;
}

// 7. Examination Management
export type ExamType = 'unit_test' | 'term_exam' | 'half_yearly' | 'annual' | 'pre_board' | 'custom';
export type ExamTerm = 'term_1' | 'term_2' | 'half_yearly' | 'annual' | 'unit_test' | 'pre_board';
export type ExamStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'results_published' | 'DRAFT' | 'SCHEDULED' | 'COMPLETED' | 'PUBLISHED';

export interface Examination {
  id: string;
  tenantId: string;
  academicYearId: string;
  name: string; // e.g. "Term 1 Half-Yearly (CBSE)"
  code?: string; // e.g. "EX-2025-T1"
  term?: ExamTerm;
  examType?: ExamType;
  startDate: string;
  endDate: string;
  applicableClassIds?: string[];
  classIds?: string[];
  maxMarksDefault?: number;
  passingMarksDefault?: number;
  gradingSchemeId?: string;
  status: ExamStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSchedule {
  id: string;
  examinationId?: string;
  examId?: string;
  examName?: string;
  tenantId: string;
  classId: string;
  className: string;
  sectionId?: string;
  sectionName?: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  date?: string;
  examDate?: string;
  startTime: string; // "09:00 AM"
  endTime: string;   // "12:00 PM"
  roomNumber: string;
  maximumMarks?: number;
  maxMarks?: number;
  passingMarks?: number;
  invigilatorTeacherId?: string;
  invigilatorName?: string;
}

// 8. Marks Entry & Workflow
export type MarkStatus = 'DRAFT' | 'ENTERED' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'PUBLISHED';
export type MarkWorkflowStatus = MarkStatus;
export type MarkAttendance = 'present' | 'absent' | 'exempt' | 'not_evaluated' | 'PRESENT' | 'ABSENT' | 'EXEMPT';

export interface MarkEntry {
  id: string;
  tenantId: string;
  academicYearId: string;
  examinationId?: string;
  examId?: string;
  examName?: string;
  examScheduleId?: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  studentId: string;
  studentName: string;
  rollNumber?: string;
  studentRollNo?: string;
  marksObtained: number;
  maximumMarks?: number;
  maxMarks?: number;
  passingMarks?: number;
  grade?: string;
  gradePoint?: number;
  attendanceStatus?: MarkAttendance;
  status: MarkStatus;
  enteredBy: string;
  enteredAt: string;
  submittedBy?: string;
  submittedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  remarks?: string;
}

// 9. Configurable Grading Schemes
export interface GradingRule {
  minPercentage: number;
  maxPercentage: number;
  grade: string;        // e.g. "A1", "A+", "A", "B"
  gradePoint: number;   // e.g. 10.0, 9.0, 4.0
  description: string;  // e.g. "Outstanding (Top 1/8th)"
  isPassing?: boolean;
}

export interface GradingScheme {
  id: string;
  tenantId: string;
  name: string; // e.g. "CBSE 9-Point Grading Scheme", "Standard 10-Point GPA"
  type?: string;
  isDefault: boolean;
  rules: GradingRule[];
  createdAt?: string;
}

// 10. Report Cards
export type ReportCardStatus = 'DRAFT' | 'GENERATED' | 'VERIFIED' | 'APPROVED' | 'PUBLISHED';
export type OverallResult = 'PASSED' | 'FAILED' | 'COMPARTMENT' | 'WITHHELD' | 'DISTINCTION';

export interface ReportCardSubject {
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
  gradePoint: number;
  teacherRemarks?: string;
}

export interface ReportCard {
  id: string;
  tenantId: string;
  academicYearId: string;
  academicYearName?: string;
  studentId: string;
  studentName: string;
  rollNumber?: string;
  studentRollNo?: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  examinationId?: string;
  examId?: string;
  examinationName?: string;
  examName?: string;
  subjects?: ReportCardSubject[];
  subjectMarks?: ReportCardSubject[];
  totalMaxMarks: number;
  totalMarksObtained: number;
  percentage: number;
  overallGrade: string;
  overallGradePoint?: number;
  overallResult?: OverallResult;
  attendancePercentage: number;
  workingDays?: number;
  presentDays?: number;
  teacherRemarks?: string;
  classTeacherRemarks?: string;
  principalRemarks?: string;
  status: ReportCardStatus;
  generatedAt: string;
  generatedBy?: string;
  verifiedBy?: string;
  approvedBy?: string;
  publishedAt?: string;
}

// 11. Student Promotion
export type PromotionStatus = 'PROMOTED' | 'NOT_PROMOTED' | 'RETAINED' | 'CONDITIONALLY_PROMOTED' | 'CONDITIONAL' | 'TRANSFERRED' | 'WITHDRAWN' | 'GRADUATED';
export type PromotionDecision = PromotionStatus;

export interface PromotionRecord {
  id: string;
  batchId?: string;
  studentId: string;
  studentName: string;
  rollNumber?: string;
  studentRollNo?: string;
  fromClassId: string;
  fromClassName: string;
  fromSectionId: string;
  fromSectionName: string;
  toClassId: string;
  toClassName: string;
  toSectionId: string;
  toSectionName: string;
  status?: PromotionStatus;
  decision?: PromotionDecision;
  percentage?: number;
  remarks?: string;
  promotedAt?: string;
  executedAt?: string;
}

export interface PromotionBatch {
  id: string;
  tenantId: string;
  fromAcademicYearId: string;
  fromAcademicYearName?: string;
  toAcademicYearId: string;
  toAcademicYearName?: string;
  fromClassId: string;
  fromClassName: string;
  toClassId: string;
  toClassName: string;
  promotedBy?: string;
  executedBy?: string;
  promotedAt?: string;
  executedAt?: string;
  totalStudents: number;
  promotedCount: number;
  retainedCount: number;
  conditionalCount?: number;
  records?: PromotionRecord[];
  status: 'draft' | 'completed' | 'DRAFT' | 'COMPLETED';
}

export interface PromotionPolicy {
  id: string;
  tenantId: string;
  boardName: string; // e.g. 'CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Custom'
  name: string;
  version: string;
  isActive: boolean;
  minAttendancePercentage: number;
  minAcademicPercentage: number;
  failedSubjectThreshold: number;
  teacherRecommendationRequired: boolean;
  principalApprovalRequired: boolean;
  examRequirementEnabled: boolean;
  automaticPromotionEnabled: boolean;
  requiredSubjectIds?: string[];
  retentionRulesRemarks?: string;
  updatedAt: string;
  updatedBy?: string;
}

// ============================================================================
// PHASE 4: DYNAMIC ROLE-BASED NAVIGATION & WORKSPACE ENGINE DATA MODELS
// ============================================================================

export type NavigationTargetContext = 
  | 'all' 
  | 'platform' 
  | 'institution' 
  | 'tenant'
  | 'teacher' 
  | 'student' 
  | 'parent' 
  | 'government'
  | 'national'
  | 'district'
  | 'finance'
  | 'hr';

export interface NavigationItemDefinition {
  id: string;
  moduleId: string; // e.g. 'core', 'student', 'academic', 'attendance', 'teacher', 'timetable', 'examination', 'finance', 'lms', 'smart_classroom', etc.
  parentId?: string; // For unlimited hierarchical menu nesting
  label: string;
  icon?: string; // Lucide icon identifier e.g. 'GraduationCap', 'BookOpen', 'Users'
  route?: string; // Tab ID or route path
  sortOrder: number;
  requiredPermission?: string | string[]; // Single permission code or array of permission codes (satisfied if user has any)
  requiredModule?: string; // Module required to be enabled for tenant
  scopeType?: ScopeType;
  status: 'active' | 'disabled';
  visibility?: 'always' | 'permission_gated' | 'admin_only';
  allowedRoles?: string[]; // Optional role codes allowed to see this item
  badge?: {
    text: string;
    variant?: 'primary' | 'pink' | 'emerald' | 'amber' | 'sky' | 'rose';
  };
  targetContext?: NavigationTargetContext;
  description?: string;
  isSectionHeader?: boolean; // For visual grouping e.g. '-- Main', '-- Academic Modules'
  isExternal?: boolean;
}

export interface DynamicNavigationNode extends NavigationItemDefinition {
  children?: DynamicNavigationNode[];
  isExpanded?: boolean;
  isActive?: boolean;
  depth?: number;
  parentPath?: string[];
}

export interface UserNavigationPreferences {
  userId: string;
  tenantId: string;
  pinnedItemIds: string[];
  recentItemIds: string[];
  sidebarCollapsed: boolean;
  expandedParentIds: string[];
}

export interface NavigationSearchResult {
  item: NavigationItemDefinition;
  breadcrumbs: string[];
  score: number;
  highlightMatch: string;
}

export * from './studentExit';
export * from './certificate';
export * from './attendancePolicy';
export * from './studentSupport';
export * from './communication';
export * from './library';
export * from './examination';
export * from './examinationOps';
export * from './staff';
export * from './procurement';
export * from './inventory';
export * from './asset';
export * from './alumniPlacement';
export * from './learning';
export * from './research';
export type {
  GovernanceBodyType,
  GovernanceMemberRole,
  GovernanceMeetingType,
  GovernanceMeetingStatus,
  ResolutionDecision,
  ResolutionStatus,
  ActionItemPriority,
  ActionItemStatus,
  PolicyCategory,
  PolicyScope,
  PolicyStatus as GovernancePolicyStatus,
  ComplianceFrameworkCategory,
  ComplianceObligationFrequency,
  ComplianceStatus as GovernanceComplianceStatus,
  ControlEffectiveness,
  AccreditationCycleStatus,
  AccreditationCriterionStatus,
  QualityIndicatorFrequency,
  QualityUnitOfMeasure,
  QualityVerificationState,
  InstitutionalAuditType,
  InstitutionalAuditStatus,
  AuditFindingSeverity,
  AuditFindingStatus,
  CorrectiveActionStatus,
  InstitutionalRiskCategory,
  RiskSeverityLevel,
  RiskStatus as GovernanceRiskStatus,
  InstitutionalGovernanceProfile,
  GovernanceBody,
  GovernanceBodyMember,
  GovernanceMeeting,
  GovernanceAgenda,
  GovernanceResolution,
  GovernanceActionItem,
  Policy,
  PolicyVersion,
  PolicyReview,
  ComplianceFramework,
  ComplianceObligation,
  ComplianceControl,
  ComplianceEvidence,
  ComplianceException,
  AccreditationBody,
  AccreditationCycle,
  AccreditationStandard,
  AccreditationCriterion,
  QualityFramework,
  QualityIndicator,
  QualityTarget,
  QualityMeasurement,
  InstitutionalAudit,
  AuditFinding,
  CorrectiveAction,
  InstitutionalRisk,
  RiskMitigation,
  GovernanceDocumentReference,
  GovernanceAnalyticsCache,
  FilterGovernanceParams
} from './governance';

export type {
  InstitutionalRiskItem,
  RiskMitigationAction,
  KeyRiskIndicator,
  CampusIncidentItem,
  IncidentTimelineEvent,
  BusinessContinuityPlan,
  SafetyAuditInspection,
  InspectionFinding,
  ContinuitySimulationDrill,
  InstitutionalRiskAnalytics,
  RiskCategory,
  KriStatus
} from './institutionalRisk';
export type {
  RiskSeverity as InstitutionalRiskSeverity,
  RiskStatus as InstitutionalRiskStatus,
  IncidentSeverity as CampusIncidentSeverity,
  IncidentStatus as CampusIncidentStatus,
  InspectionStatus as SafetyInspectionStatus
} from './institutionalRisk';

export * from './accreditationReview';
export * from './institutionalAnalytics';
export * from './workflowGovernance';
export * from './knowledgeGovernance';
export * from './integrationGovernance';
export * from './automationGovernance';
export type { DataClassification } from './integrationGovernance';
export type {
  PortfolioStatus,
  ProgramStatus,
  InitiativeStatus,
  GateType,
  GateStatus,
  GateDecisionType,
  DependencyType,
  DependencyLinkStatus,
  DependencyIssueType,
  BenefitType,
  BenefitPlanStatus,
  InvestmentDecisionType,
  InvestmentDecisionStatus,
  AssuranceReviewStatus,
  FindingType,
  InterventionType,
  InterventionStatus,
  DataQualityIssueType,
  HealthScoreFactors,
  EnterprisePortfolio,
  EnterprisePortfolioVersion,
  EnterpriseProgram,
  StrategicInitiative,
  GovernanceMilestone,
  GovernanceGate,
  GateDecision,
  DependencyLink,
  DependencyHealthIssue,
  BenefitRealizationPlan,
  BenefitMeasurement,
  PortfolioInvestment,
  InvestmentDecision,
  TransformationAssuranceReview,
  AssuranceFinding,
  InitiativeIntervention,
  WhatIfTransformationScenario,
  ScenarioSimulationResult,
  TransformationDataQualityIssue,
  TransformationGovernanceAudit
} from './enterprisePortfolio';

export * from './enterpriseArchitecture';
export * from './itServiceManagement';
export * from './cybersecurityOperations';
export * from './complianceAssurance';




export * from './stakeholderGovernance';
export * from './knowledgeGovernance';
export * from './dataGovernance';
export * from './orgKnowledgeGovernance';
export * from './researchInnovationGovernance';
export * from './humanCapitalGovernance';
export * from './financialGovernance';
export * from './procurementGovernance';
export * from './contractGovernance';
export * from './assetFacilitiesGovernance';
export * from './safetyEhsGovernance';
export * from './qualityAssuranceGovernance';
export * from './studentSuccessGovernance';
export * from './internationalizationGovernance';
export * from './cyberSecurityPrivacyGovernance';
export * from './businessContinuityResilienceGovernance';
export * from './enterpriseRiskGovernance';
export type {
  EnterpriseCaseStatus as EnterpriseCaseGovStatus,
  EnterpriseCasePriority as EnterpriseCaseGovPriority,
  EnterpriseCaseSeverity,
  EnterpriseCaseType,
  EnterpriseTaskStatus as EnterpriseTaskGovStatus,
  EnterpriseActionStatus,
  EnterpriseSLAStatus as EnterpriseCaseGovSLAStatus,
  EnterpriseEscalationLevel,
  EnterpriseQueueType,
  EnterpriseExceptionStatus as EnterpriseCaseGovExceptionStatus,
  EnterpriseCaseAssignment,
  EnterpriseCaseRelationship,
  EnterpriseCase as EnterpriseCaseGovCase,
  EnterpriseTaskDependency,
  EnterpriseTaskAssignment,
  EnterpriseTask as EnterpriseCaseGovTask,
  EnterpriseActionItem,
  EnterpriseActionVerification,
  EnterpriseSLATier,
  EnterpriseSLAPolicy,
  EnterpriseSLAObservation,
  EnterpriseEscalationPolicy,
  EnterpriseEscalationEvent,
  EnterpriseAssignmentRule,
  EnterpriseWorkQueue as EnterpriseCaseGovWorkQueue,
  EnterpriseGovernanceException,
  EnterpriseEvidenceReference,
  EnterpriseCaseDiagnostic,
  EnterpriseCaseSimulation,
  EnterpriseCaseAuditLog
} from './enterpriseCaseGovernance';
export * from './documentRecordsGovernance';
export type {
  EventCategory806,
  RuleLifecycle806,
  ActionType806,
  ScenarioType806,
  EnterpriseEventDefinition,
  EnterpriseEventEnvelope,
  EnterpriseEventSubscription,
  EnterpriseBusinessRule,
  EnterpriseRuleVersion,
  EnterpriseRuleCondition,
  EnterpriseRuleAction,
  EnterpriseRuleEvaluation,
  EnterpriseAutomationPolicy,
  EnterpriseAutomationExecution,
  EnterpriseAutomationStep,
  EnterpriseWorkQueue as EnterpriseEventAutomationWorkQueue,
  EnterpriseWorkQueueItem as EnterpriseEventAutomationWorkQueueItem,
  EnterpriseActionRequest,
  EnterpriseActionAuthorization,
  EnterpriseActionExecution,
  EnterpriseEscalationPolicy as EnterpriseEscalationPolicy806,
  EnterpriseEscalationEvent as EnterpriseEscalationEvent806,
  EnterpriseAutomationException,
  EnterpriseAutomationSuppression,
  EnterpriseDeadLetterEvent,
  EnterpriseReplayRequest,
  EnterpriseReplayExecution,
  EnterpriseAutomationDependency,
  EnterpriseAutomationRisk,
  EnterpriseAutomationAuditLog,
  EnterpriseAutomationDiagnostic,
  SimulationResult806
} from './enterpriseEventAutomationGovernance';
export * from './enterpriseIntegrationGovernance';
export * from './dataIntelligenceTrustGovernance';
export * from './knowledgeIntelligenceGovernance';

