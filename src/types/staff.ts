// EMS Phase 7.17: Staff, HR & Workforce Management Governance Engine Types

export type EmploymentType =
  | 'PERMANENT'
  | 'PROBATION'
  | 'CONTRACT'
  | 'TEMPORARY'
  | 'PART_TIME'
  | 'VISITING'
  | 'CONSULTANT'
  | 'INTERN';

export type EmploymentCategory =
  | 'TEACHING'
  | 'NON_TEACHING'
  | 'ADMINISTRATIVE'
  | 'MANAGEMENT'
  | 'SUPPORT_STAFF'
  | 'TECHNICAL';

export type StaffStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PROBATION'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'RESIGNED'
  | 'TERMINATED'
  | 'RETIRED'
  | 'EXITED';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY' | 'OTHER';

export interface StaffAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface StaffEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
}

export interface StaffProfile {
  id: string;
  tenantId: string;
  campusId: string;
  userId?: string; // Reference to User if platform account exists
  employeeNumber: string; // e.g. EMP-2026-0001
  employeeCode: string; // Internal short code / bio-code
  fullName: string;
  preferredName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  email: string;
  phone: string;
  emergencyContact?: StaffEmergencyContact;
  address?: StaffAddress;
  joiningDate: string; // YYYY-MM-DD
  employmentType: EmploymentType;
  employmentCategory: EmploymentCategory;
  department: string;
  designation: string;
  status: StaffStatus;
  reportingManagerId?: string;
  reportingManagerName?: string;
  profilePhotoUrl?: string;
  probationEndDate?: string;
  contractEndDate?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// 2. Employment Lifecycle History
export type EmploymentLifecycleEvent =
  | 'JOINED'
  | 'CONFIRMED'
  | 'TRANSFERRED'
  | 'PROMOTED'
  | 'ROLE_CHANGED'
  | 'CAMPUS_TRANSFERRED'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'RESIGNED'
  | 'TERMINATED'
  | 'RETIRED'
  | 'EXITED';

export interface StaffEmploymentHistory {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  eventType: EmploymentLifecycleEvent;
  previousState?: string;
  newState: string;
  effectiveDate: string;
  reason: string;
  actorId: string;
  actorName: string;
  notes?: string;
  createdAt: string;
}

// 3. Qualifications, Certifications & Skills
export type QualificationType =
  | 'SECONDARY'
  | 'HIGHER_SECONDARY'
  | 'DIPLOMA'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE'
  | 'POST_DOCTORAL'
  | 'PROFESSIONAL_CERTIFICATION'
  | 'OTHER';

export type QualificationLevel = QualificationType;

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'REJECTED';

export interface StaffQualification {
  id: string;
  tenantId: string;
  staffId: string;
  qualificationType: QualificationType;
  degreeTitle: string;
  institution: string;
  fieldOfStudy: string;
  yearOfPassing: number;
  gradeOrScore?: string;
  certificateDocumentRef?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffCertification {
  id: string;
  tenantId: string;
  staffId: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  createdAt: string;
}

export type SkillProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface StaffSkill {
  id: string;
  tenantId: string;
  staffId: string;
  skillName: string;
  category?: string;
  proficiencyLevel: SkillProficiency;
  createdAt: string;
}

// 4. Staff Documents
export type StaffDocumentCategory =
  | 'IDENTITY_PROOF'
  | 'QUALIFICATION'
  | 'APPOINTMENT_LETTER'
  | 'CONTRACT'
  | 'CERTIFICATION'
  | 'COMPLIANCE'
  | 'RESIGNATION'
  | 'EXIT_CLEARANCE'
  | 'PAYSLIP_PROOF'
  | 'MEDICAL_FITNESS'
  | 'OTHER';

export interface StaffDocument {
  id: string;
  tenantId: string;
  staffId: string;
  title: string;
  documentCategory: StaffDocumentCategory;
  registryDocumentId?: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
  verificationStatus: VerificationStatus;
  expiryDate?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 5. Staff Assignments
export type AssignmentType =
  | 'TEACHING'
  | 'DEPARTMENT_HEAD'
  | 'COORDINATOR'
  | 'CLASS_TEACHER'
  | 'EXAM_DUTY'
  | 'HOSTEL_WARDEN'
  | 'TRANSPORT_INCHARGE'
  | 'COMMITTEE_MEMBER'
  | 'ADMINISTRATIVE'
  | 'OTHER';

export interface StaffAssignment {
  id: string;
  tenantId: string;
  campusId: string;
  staffId: string;
  staffName: string;
  assignmentType: AssignmentType;
  roleTitle: string;
  department?: string;
  academicYearId?: string;
  classId?: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  subjectId?: string;
  subjectName?: string;
  weeklyPeriods?: number;
  status: 'ACTIVE' | 'COMPLETED' | 'REVOKED';
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 6. Workload Engine
export type WorkloadClassification = 'UNDER_UTILIZED' | 'NORMAL' | 'HIGH' | 'OVERLOADED';

export interface StaffWorkloadSnapshot {
  id: string;
  tenantId: string;
  campusId: string;
  staffId: string;
  staffName: string;
  department: string;
  period: string; // e.g. "2026-W35" or "2026-08"
  teachingPeriods: number;
  examDutiesCount: number;
  administrativeDutiesHours: number;
  totalWeeklyLoadHours: number;
  maxRecommendedLoadHours: number;
  utilizationClassification: WorkloadClassification;
  breakdown: {
    classesCount: number;
    subjectsCount: number;
    weeklyTeachingHours: number;
    prepAndGradingHours: number;
    committeeHours: number;
  };
  calculatedAt: string;
}

// 7. Leave Management
export type LeaveCategory =
  | 'CASUAL'
  | 'SICK'
  | 'EARNED'
  | 'MATERNITY'
  | 'PATERNITY'
  | 'COMPENSATORY'
  | 'UNPAID'
  | 'SPECIAL'
  | 'STUDY'
  | 'BEREAVEMENT';

export interface StaffLeaveType {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: LeaveCategory;
  description?: string;
  annualQuota: number;
  carryForwardMax: number;
  allowHalfDay: boolean;
  requiresProof: boolean;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StaffLeavePolicy {
  id: string;
  tenantId: string;
  name: string;
  academicYearId?: string;
  leaveTypeId: string;
  leaveTypeName: string;
  annualQuota: number;
  carryForwardMax: number;
  allowHalfDay: boolean;
  requiresProof: boolean;
  applicableCategories: EmploymentCategory[];
  version: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface StaffLeaveBalance {
  id: string;
  tenantId: string;
  staffId: string;
  academicYearId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  totalAllocated: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  carryForwardDays: number;
  updatedAt: string;
}

export type LeaveRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'TAKEN';

export interface StaffLeaveRequest {
  id: string;
  tenantId: string;
  campusId: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  isHalfDay?: boolean;
  reason: string;
  attachmentDocId?: string;
  status: LeaveRequestStatus;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewNotes?: string;
  actionTimestamp?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type LeaveTransactionType =
  | 'ALLOCATION'
  | 'DEDUCTION'
  | 'CANCELLATION_REFUND'
  | 'ADJUSTMENT'
  | 'EXPIRY';

export interface StaffLeaveTransaction {
  id: string;
  tenantId: string;
  staffId: string;
  leaveTypeId: string;
  leaveRequestId?: string;
  transactionType: LeaveTransactionType;
  days: number;
  balanceAfter: number;
  actorId: string;
  actorName: string;
  reason: string;
  createdAt: string;
}

// 8. Substitute / Cover Management
export interface StaffSubstitutionRecord {
  id: string;
  tenantId: string;
  campusId: string;
  absentStaffId: string;
  absentStaffName: string;
  substituteStaffId: string;
  substituteStaffName: string;
  date: string;
  slotOrPeriodNumber?: number;
  classId?: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  subjectId?: string;
  subjectName?: string;
  reason: string;
  status: 'PROPOSED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  authorizedBy?: string;
  authorizedByName?: string;
  authorizedAt?: string;
  createdAt: string;
}

// 9. Staff Attendance Integration
export interface StaffAttendanceSummary {
  id: string;
  tenantId: string;
  campusId: string;
  staffId: string;
  staffName: string;
  month: number;
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  onLeaveDays: number;
  compliancePercentage: number;
  updatedAt: string;
}

// 10. Performance / Appraisal
export type PerformanceCycleStatus = 'PLANNING' | 'ACTIVE' | 'REVIEW_IN_PROGRESS' | 'FINALIZED' | 'ARCHIVED';

export interface StaffPerformanceCycle {
  id: string;
  tenantId: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  academicYearId?: string;
  status: PerformanceCycleStatus;
  createdAt: string;
  updatedAt: string;
}

export type PerformanceReviewStatus =
  | 'DRAFT'
  | 'SELF_REVIEW_SUBMITTED'
  | 'MANAGER_REVIEW_SUBMITTED'
  | 'FINALIZED'
  | 'DISPUTED'
  | 'COMPLETED';

export type ReviewOutcome =
  | 'EXCEEDS_EXPECTATIONS'
  | 'MEETS_EXPECTATIONS'
  | 'DEVELOPMENT_NEEDED'
  | 'UNSATISFACTORY'
  | 'OUTSTANDING'
  | 'NEEDS_IMPROVEMENT';

export type RatingBand = ReviewOutcome;

export interface StaffPerformanceReview {
  id: string;
  tenantId: string;
  cycleId: string;
  cycleTitle?: string;
  staffId: string;
  staffName: string;
  department: string;
  reviewerId: string;
  reviewerName: string;
  status: PerformanceReviewStatus;
  selfComments?: string;
  reviewerComments?: string;
  strengths?: string;
  areasForGrowth?: string;
  ratingScore?: number; // e.g. 1.0 to 5.0
  reviewOutcome?: ReviewOutcome;
  finalizedAt?: string;
  finalizedBy?: string;
  finalizedByName?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveStatus = 'PENDING' | 'IN_PROGRESS' | 'ACHIEVED' | 'PARTIALLY_ACHIEVED' | 'NOT_ACHIEVED';

export interface StaffObjective {
  id: string;
  tenantId: string;
  reviewId: string;
  staffId: string;
  title: string;
  description: string;
  weightage?: number; // e.g. 25%
  targetDate: string;
  status: ObjectiveStatus;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// 11. Staff Compliance
export type ComplianceCategory =
  | 'CERTIFICATION_EXPIRY'
  | 'MANDATORY_DOCUMENT'
  | 'TRAINING_COMPLETION'
  | 'CAMPUS_AUTHORIZATION'
  | 'BACKGROUND_CHECK';

export type ComplianceStatus = 'COMPLIANT' | 'WARNING' | 'EXPIRED' | 'NON_COMPLIANT' | 'EXEMPT';

export interface StaffComplianceRecord {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  department: string;
  category: ComplianceCategory;
  title: string;
  description: string;
  status: ComplianceStatus;
  dueDate?: string;
  expiryDate?: string;
  lastVerifiedAt?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  notes?: string;
  updatedAt: string;
}

// 12. Training & Professional Development
export type TrainingCategory =
  | 'PEDAGOGY'
  | 'SAFETY_COMPLIANCE'
  | 'LEADERSHIP'
  | 'TECHNICAL_SKILLS'
  | 'CURRICULUM'
  | 'SPECIAL_EDUCATION'
  | 'CLASSROOM_MANAGEMENT';

export type TrainingDeliveryMode = 'ONLINE' | 'IN_PERSON' | 'HYBRID' | 'WORKSHOP';

export interface StaffTrainingProgram {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category: TrainingCategory;
  deliveryMode: TrainingDeliveryMode;
  durationHours: number;
  isMandatory: boolean;
  provider?: string;
  validityMonths?: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export type TrainingAssignmentStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'EXEMPT';

export interface StaffTrainingAssignment {
  id: string;
  tenantId: string;
  programId: string;
  programTitle: string;
  staffId: string;
  staffName: string;
  assignedBy: string;
  assignedByName: string;
  dueDate: string;
  status: TrainingAssignmentStatus;
  completionDate?: string;
  scoreOrGrade?: string;
  certificateDocRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 13. Department & Designation
export interface StaffDepartment {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  headOfDepartmentId?: string;
  headOfDepartmentName?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface StaffDesignation {
  id: string;
  tenantId: string;
  title: string;
  category: EmploymentCategory;
  departmentId?: string;
  departmentName?: string;
  rankLevel?: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// 14. HR Case Management
export type HRCaseCategory =
  | 'GRIEVANCE'
  | 'POLICY_VIOLATION'
  | 'DISCIPLINARY'
  | 'COMPLIANCE_BREACH'
  | 'WORKPLACE_INCIDENT'
  | 'DOCUMENT_DISCREPANCY'
  | 'ATTENDANCE_ISSUE'
  | 'OTHER';

export type HRCasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type HRCaseConfidentiality = 'STANDARD' | 'CONFIDENTIAL' | 'STRICTLY_CONFIDENTIAL';

export type HRCaseStatus =
  | 'OPEN'
  | 'INVESTIGATION'
  | 'HEARING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'APPEALED';

export interface StaffHRCase {
  id: string;
  tenantId: string;
  campusId: string;
  caseNumber: string; // e.g. HRC-2026-001
  title: string;
  category: HRCaseCategory;
  priority: HRCasePriority;
  confidentialityLevel: HRCaseConfidentiality;
  staffId: string;
  staffName: string;
  department: string;
  reportedById?: string;
  reportedByName?: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  status: HRCaseStatus;
  summary: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  evidenceDocRefs?: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 15. Staff Exit / Offboarding
export type StaffExitType =
  | 'RESIGNATION'
  | 'CONTRACT_EXPIRY'
  | 'RETIREMENT'
  | 'TERMINATION'
  | 'MUTUAL_SEPARATION';

export type StaffExitStatus =
  | 'INITIATED'
  | 'CLEARANCE_IN_PROGRESS'
  | 'CLEARANCE_COMPLETED'
  | 'FINAL_SETTLEMENT_APPROVED'
  | 'EXITED'
  | 'CANCELLED';

export type ClearanceStatus = 'PENDING' | 'CLEARED' | 'HOLD' | 'WAIVED';

export type ClearanceDepartment =
  | 'FINANCE'
  | 'LIBRARY'
  | 'IT_EQUIPMENT'
  | 'TRANSPORT'
  | 'HOSTEL'
  | 'ACADEMIC_RESOURCES'
  | 'HR_RECORDS';

export interface StaffExitCase {
  id: string;
  tenantId: string;
  campusId: string;
  staffId: string;
  staffName: string;
  employeeNumber: string;
  designation: string;
  department: string;
  exitType: StaffExitType;
  noticeDate: string;
  lastWorkingDate: string;
  reason: string;
  status: StaffExitStatus;
  overallClearanceStatus: ClearanceStatus;
  handoverCompleted: boolean;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffClearanceItem {
  id: string;
  tenantId: string;
  exitCaseId: string;
  staffId: string;
  departmentKey: ClearanceDepartment;
  departmentName: string;
  status: ClearanceStatus;
  remarks?: string;
  clearedBy?: string;
  clearedByName?: string;
  clearedAt?: string;
  updatedAt: string;
}

export interface StaffHandoverRecord {
  id: string;
  tenantId: string;
  exitCaseId: string;
  staffId: string;
  taskOrAssetTitle: string;
  transferredToStaffId: string;
  transferredToStaffName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  handoverNotes?: string;
  completedAt?: string;
  createdAt: string;
}

// 16. Workforce Analytics Summary
export interface StaffAnalyticsSummary {
  id: string;
  tenantId: string;
  campusId?: string;
  totalStaff: number;
  activeStaff: number;
  onLeaveStaff: number;
  probationStaff: number;
  exitedStaff: number;
  teachingCount: number;
  nonTeachingCount: number;
  byDepartment: Record<string, number>;
  byEmploymentType: Record<string, number>;
  leaveUtilizationRate: number;
  overloadedStaffCount: number;
  complianceRate: number;
  expiringCertificationsCount: number;
  openHRCasesCount: number;
  activeExitsCount: number;
  calculatedAt: string;
}
