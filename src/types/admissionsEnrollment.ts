export type CycleStatus = 'DRAFT' | 'PLANNED' | 'OPEN' | 'CLOSED' | 'DECISION' | 'COMPLETED' | 'ARCHIVED';

export type ApplicationType = 'NEW' | 'TRANSFER' | 'READMISSION' | 'INTERNATIONAL' | 'PROFESSIONAL' | 'OTHER_CONFIGURED';

export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'EVALUATION'
  | 'DECISION_PENDING'
  | 'ACCEPTED'
  | 'OFFERED'
  | 'OFFER_ACCEPTED'
  | 'ENROLLMENT_PENDING'
  | 'ENROLLED'
  | 'WITHDRAWN'
  | 'REJECTED'
  | 'CANCELLED'
  | 'DEFERRED'
  | 'WAITLISTED';

export type ReviewStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED' | 'CANCELLED';

export type DecisionType = 'ADMIT' | 'CONDITIONAL_ADMIT' | 'WAITLIST' | 'REJECT' | 'DEFER' | 'WITHDRAW';

export type OfferStatus = 'DRAFT' | 'ISSUED' | 'VIEWED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN';

export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'DEFERRED' | 'WITHDRAWN' | 'COMPLETED' | 'CANCELLED';

export type EnrollmentType = 'NEW' | 'TRANSFER' | 'READMISSION' | 'CONTINUING' | 'OTHER_CONFIGURED';

export interface Applicant {
  applicantId: string;
  tenantId: string;
  applicantNumber: string;
  personReference: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  identityReference: {
    documentType: string;
    documentNumber: string;
    issuingCountry: string;
  };
  contactReference: {
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferredCampusIdRef: string;
  residencyCategory: 'DOMESTIC' | 'INTERNATIONAL' | 'STATE_RESIDENT';
  applicantType: ApplicationType;
  status: 'ACTIVE' | 'ARCHIVED' | 'CONVERTED';
  source: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface AdmissionCycle {
  cycleId: string;
  tenantId: string;
  campusIdRef: string;
  academicYear: string;
  termIdRef: string;
  cycleCode: string;
  cycleName: string;
  startDate: string;
  applicationOpenDate: string;
  applicationCloseDate: string;
  decisionDeadline: string;
  enrollmentDeadline: string;
  status: CycleStatus;
}

export interface AdmissionCampaign {
  campaignId: string;
  cycleIdRef: string;
  name: string;
  description: string;
  targetProgramReferences: string[];
  channelReferences: string[];
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  endDate: string;
}

export interface Application {
  applicationId: string;
  tenantId: string;
  applicantIdRef: string;
  cycleIdRef: string;
  campaignIdRef?: string;
  campusIdRef: string;
  programIdRef: string;
  programVersionIdRef: string;
  applicationNumber: string;
  applicationType: ApplicationType;
  submittedAt?: string;
  status: ApplicationStatus;
  priority: 'STANDARD' | 'HIGH' | 'VIP';
  source: string;
  assignedReviewerUserIdRef?: string;
  documentReferenceIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationReview {
  reviewId: string;
  applicationIdRef: string;
  reviewerUserIdRef: string;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  recommendation?: DecisionType;
  score?: number;
  commentsReference?: string;
  status: ReviewStatus;
}

export interface AdmissionEvaluationRule {
  ruleId: string;
  programIdRef: string;
  programVersionIdRef: string;
  ruleType: 'MIN_GPA' | 'ENTRANCE_SCORE' | 'PREREQUISITE_COURSE' | 'LANGUAGE_PROFICIENCY' | 'DOCUMENT_MANDATORY';
  threshold: number | string;
  weight: number;
  required: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE';
  version: string;
}

export interface AdmissionDecision {
  decisionId: string;
  applicationIdRef: string;
  decisionType: DecisionType;
  decisionDate: string;
  decisionReason: string;
  decisionScore: number;
  decisionMakerUserIdRef: string;
  approvalReference?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
}

export interface AdmissionOverride {
  overrideId: string;
  applicationIdRef: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  reason: string;
  policyReference: string;
  evidenceReference?: string;
  expiry?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}

export interface AdmissionOffer {
  offerId: string;
  applicationIdRef: string;
  decisionIdRef: string;
  programIdRef: string;
  programVersionIdRef: string;
  termIdRef: string;
  issueDate: string;
  expiryDate: string;
  conditions?: string;
  status: OfferStatus;
}

export interface Enrollment {
  enrollmentId: string;
  applicantIdRef: string;
  studentIdRef?: string;
  programIdRef: string;
  programVersionIdRef: string;
  campusIdRef: string;
  termIdRef: string;
  enrollmentNumber: string;
  enrollmentType: EnrollmentType;
  status: EnrollmentStatus;
  effectiveDate: string;
  sourceApplicationIdRef: string;
  sourceOfferIdRef: string;
}

export interface EnrollmentCourseRegistration {
  registrationId: string;
  enrollmentIdRef: string;
  courseIdRef: string;
  courseVersionIdRef: string;
  offeringIdRef: string;
  sectionIdRef: string;
  termIdRef: string;
  status: 'ENROLLED' | 'WAITLISTED' | 'DROPPED' | 'COMPLETED';
}

export interface EnrollmentChangeRequest {
  requestId: string;
  enrollmentIdRef: string;
  changeType: 'ADD_COURSE' | 'DROP_COURSE' | 'WITHDRAW' | 'DEFER' | 'PROGRAM_CHANGE' | 'SECTION_CHANGE';
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED' | 'CANCELLED';
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionWaitlist {
  waitlistId: string;
  cycleIdRef: string;
  programIdRef: string;
  applicationIdRef: string;
  rank: number;
  priorityScore: number;
  status: 'ACTIVE' | 'OFFERED' | 'WITHDRAWN' | 'EXPIRED';
  createdAt: string;
}

export interface AdmissionsAuditEvent {
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
