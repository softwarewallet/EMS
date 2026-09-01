export type RegistrationLifecycleStatus = 
  | 'REQUESTED'
  | 'ELIGIBILITY_CHECK'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REGISTERED'
  | 'DROPPED'
  | 'WITHDRAWN'
  | 'COMPLETED'
  | 'CANCELLED';

export type WaitlistStatus = 
  | 'WAITLISTED'
  | 'ELIGIBLE'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'REGISTERED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ExceptionStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface RegistrationPolicy {
  policyId: string;
  tenantId: string;
  campusIdRef: string;
  programIdRef?: string;
  maxCreditsPerTerm: number;
  allowCrossCampus: boolean;
  requireAdvisorApproval: boolean;
  active: boolean;
}

export interface RegistrationWindow {
  windowId: string;
  tenantId: string;
  termIdRef: string;
  campusIdRef: string;
  programIdRef?: string;
  startDate: string;
  endDate: string;
  studentType?: string;
  isActive: boolean;
}

export interface CourseRegistration {
  registrationId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  termIdRef: string;
  courseIdRef: string;
  sectionIdRef: string;
  status: RegistrationLifecycleStatus;
  credits: number;
  gradingBasis: 'GRADED' | 'PASS_FAIL' | 'AUDIT';
  registeredAt?: string;
  droppedAt?: string;
  withdrawnAt?: string;
  overrideIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  waitlistId: string;
  tenantId: string;
  studentIdRef: string;
  sectionIdRef: string;
  termIdRef: string;
  position: number;
  status: WaitlistStatus;
  offeredAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface AcademicPlan {
  planId: string;
  tenantId: string;
  studentIdRef: string;
  programIdRef: string;
  programVersionIdRef: string;
  totalCreditsRequired: number;
  totalCreditsCompleted: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface AdvisingRecommendation {
  recommendationId: string;
  tenantId: string;
  studentIdRef: string;
  advisorUserIdRef: string;
  termIdRef: string;
  recommendedCourses: string[];
  notes: string;
  acknowledgedByStudent: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ACKNOWLEDGED' | 'ARCHIVED';
  createdAt: string;
}

export interface RegistrationException {
  exceptionId: string;
  tenantId: string;
  studentIdRef: string;
  courseIdRef: string;
  termIdRef: string;
  exceptionType: 'PREREQUISITE' | 'CREDIT_LOAD' | 'LATE_REGISTRATION' | 'CROSS_CAMPUS' | 'RESTRICTED_COURSE';
  reason: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: ExceptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SectionSeatAllocation {
  allocationId: string;
  tenantId: string;
  sectionIdRef: string;
  totalCapacity: number;
  enrolledCount: number;
  waitlistCount: number;
  reservedCount: number;
  updatedAt: string;
}

export interface RegistrationAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
