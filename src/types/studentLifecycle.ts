export type StudentLifecycleState = 
  | 'PROSPECT_REFERENCE'
  | 'ADMITTED'
  | 'ENROLLED'
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'WITHDRAWN'
  | 'TRANSFERRED'
  | 'COMPLETED'
  | 'GRADUATED'
  | 'ALUMNI_REFERENCE'
  | 'DECEASED'
  | 'CANCELLED';

export type StudentStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'WITHDRAWN'
  | 'COMPLETED'
  | 'GRADUATED';

export interface Student {
  studentId: string;
  tenantId: string;
  studentNumber: string;
  personReference: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  applicantIdRef?: string;
  sourceEnrollmentIdRef?: string;
  institutionIdRef: string;
  primaryCampusIdRef: string;
  studentType: string;
  studentStatus: StudentStatus;
  lifecycleState: StudentLifecycleState;
  admissionDate?: string;
  initialEnrollmentDate?: string;
  currentProgramIdRef: string;
  currentProgramVersionIdRef: string;
  currentTermIdRef: string;
  expectedCompletionDate?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface StudentProgramEnrollment {
  studentProgramEnrollmentId: string;
  studentIdRef: string;
  programIdRef: string;
  programVersionIdRef: string;
  curriculumIdRef: string;
  campusIdRef: string;
  startTermIdRef: string;
  endTermIdRef?: string;
  enrollmentType: 'PRIMARY' | 'SECONDARY' | 'MAJOR' | 'MINOR' | 'SPECIALIZATION' | 'CONCENTRATION';
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN' | 'TRANSFERRED' | 'CANCELLED';
  effectiveFrom: string;
  effectiveTo?: string;
  sourceEnrollmentIdRef?: string;
}

export interface StudentProgramChangeRequest {
  requestId: string;
  studentIdRef: string;
  sourceProgramIdRef: string;
  targetProgramIdRef: string;
  targetProgramVersionIdRef: string;
  effectiveTermIdRef: string;
  changeType: 'MAJOR_CHANGE' | 'PROGRAM_TRANSFER' | 'SPECIALIZATION_CHANGE' | 'CAMPUS_TRANSFER' | 'CURRICULUM_TRANSITION';
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTED' | 'REJECTED' | 'CANCELLED';
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAcademicStanding {
  standingId: string;
  studentIdRef: string;
  termIdRef: string;
  standingType: string;
  standingStatus: 'GOOD_STANDING' | 'WARNING' | 'PROBATION' | 'SUSPENDED' | 'ELIGIBILITY_REVIEW';
  reasonCode: string;
  effectiveDate: string;
  sourceReference?: string;
  reviewDate?: string;
  status: 'ACTIVE' | 'HISTORICAL';
}

export interface StudentProfile {
  profileId: string;
  studentIdRef: string;
  preferredName?: string;
  preferredLanguage?: string;
  communicationPreference?: 'EMAIL' | 'SMS' | 'MAIL' | 'PORTAL';
  residencyCategory: string;
  accessibilityReference?: string;
  supportProfileReference?: string;
}

export interface StudentContact {
  contactId: string;
  studentIdRef: string;
  contactType: 'PERMANENT' | 'CURRENT' | 'MAILING' | 'INSTITUTIONAL';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  preferred: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';
}

export interface StudentEmergencyContact {
  contactId: string;
  studentIdRef: string;
  relationship: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  priority: number;
  emergencyIndicator: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface StudentHold {
  holdId: string;
  studentIdRef: string;
  holdType: 'ACADEMIC' | 'ADMINISTRATIVE' | 'DOCUMENTATION' | 'DISCIPLINARY' | 'FINANCIAL' | 'HEALTH_SAFETY' | 'COMPLIANCE';
  holdReason: string;
  sourceModuleIdRef?: string;
  sourceRecordIdRef?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'REQUESTED' | 'ACTIVE' | 'RELEASED' | 'EXPIRED' | 'CANCELLED';
  releasedByUserIdRef?: string;
}

export interface StudentServiceCase {
  caseId: string;
  studentIdRef: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedUserIdRef?: string;
  organizationUnitIdRef?: string;
  openedAt: string;
  targetResolutionDate?: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
  confidentialityLevel: 'STANDARD' | 'CONFIDENTIAL' | 'RESTRICTED';
  sourceReference?: string;
  resolutionReference?: string;
}

export interface StudentServiceRequest {
  requestId: string;
  studentIdRef: string;
  requestType: 'ENROLLMENT_LETTER' | 'TRANSCRIPT' | 'STUDENT_ID' | 'GENERAL_ADMIN';
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED';
  submittedAt?: string;
  fulfilledAt?: string;
}

export interface StudentAdvisingAssignment {
  assignmentId: string;
  studentIdRef: string;
  advisorPositionIdRef: string;
  advisorUserIdRef: string;
  organizationUnitIdRef: string;
  programIdRef?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StudentLeaveRequest {
  leaveId: string;
  studentIdRef: string;
  leaveType: string;
  requestedStart: string;
  requestedEnd: string;
  reasonReference: string;
  supportingDocumentIdRef?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  approvedByUserIdRef?: string;
  effectiveDate?: string;
}

export interface StudentSuspension {
  suspensionId: string;
  studentIdRef: string;
  reasonReference: string;
  startDate: string;
  endDate?: string;
  sourceCaseIdRef?: string;
  approvalReference?: string;
  status: 'PENDING' | 'ACTIVE' | 'LIFTED' | 'CANCELLED';
}

export interface StudentWithdrawalRequest {
  withdrawalId: string;
  studentIdRef: string;
  requestDate: string;
  effectiveDate?: string;
  reasonCode: string;
  supportingDocumentIdRef?: string;
  approvalReference?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED' | 'CANCELLED';
  approvedByUserIdRef?: string;
}

export interface StudentReactivationRequest {
  reactivationId: string;
  studentIdRef: string;
  sourceRecordIdRef: string; // the withdrawal or suspension id
  effectiveTermIdRef: string;
  targetProgramIdRef: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED' | 'CANCELLED';
  approvedByUserIdRef?: string;
}

export interface StudentTransferRequest {
  transferId: string;
  studentIdRef: string;
  transferType: 'CAMPUS_TRANSFER' | 'PROGRAM_TRANSFER' | 'INSTITUTIONAL_TRANSFER_OUT';
  sourceInstitutionIdRef?: string;
  targetInstitutionIdRef?: string;
  targetCampusIdRef?: string;
  targetProgramIdRef?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED' | 'CANCELLED';
  approvedByUserIdRef?: string;
}

export interface StudentGraduationStatus {
  graduationId: string;
  studentIdRef: string;
  completionStatus: 'IN_PROGRESS' | 'ELIGIBLE' | 'COMPLETED' | 'AWARDED';
  graduationEligibilityReference?: string;
  graduationApplicationReference?: string;
  completionDate?: string;
  graduationDate?: string;
  awardReference?: string;
}

export interface StudentAuditEvent {
  eventId: string;
  tenantId: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  signatureHash: string;
}
