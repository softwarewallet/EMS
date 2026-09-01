export type AssessmentLifecycleState = 
  | 'DRAFT'
  | 'CONFIGURED'
  | 'SCHEDULED'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'SUBMISSION_CLOSED'
  | 'EVALUATION'
  | 'MODERATION'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type ExamSessionLifecycleState =
  | 'PLANNED'
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'EVALUATION'
  | 'RESULT_APPROVAL'
  | 'PUBLISHED'
  | 'CLOSED';

export type ResultApprovalState = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'PUBLISHED';

export interface AssessmentScheme {
  schemeId: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  components: AssessmentComponent[];
  active: boolean;
  createdAt: string;
}

export interface AssessmentComponent {
  componentId: string;
  name: string;
  type: 'INTERNAL' | 'MIDTERM' | 'FINAL' | 'PRACTICAL' | 'LAB' | 'PROJECT' | 'ASSIGNMENT' | 'VIVA' | 'CONTINUOUS';
  weight: number;
  maxScore: number;
  mandatory: boolean;
}

export interface AssessmentInstance {
  assessmentId: string;
  tenantId: string;
  campusIdRef: string;
  courseIdRef: string;
  sectionIdRef: string;
  termIdRef: string;
  schemeIdRef: string;
  status: AssessmentLifecycleState;
  createdAt: string;
  updatedAt: string;
}

export interface ExaminationSession {
  sessionId: string;
  tenantId: string;
  campusIdRef: string;
  assessmentIdRef: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ExamSessionLifecycleState;
}

export interface ExaminationVenue {
  venueId: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface ExaminationSeatAllocation {
  allocationId: string;
  tenantId: string;
  sessionIdRef: string;
  venueIdRef: string;
  studentIdRef: string;
  seatNumber: string;
}

export interface InvigilationAssignment {
  assignmentId: string;
  tenantId: string;
  sessionIdRef: string;
  venueIdRef: string;
  invigilatorPositionIdRef: string;
  invigilatorUserIdRef: string;
  role: 'CHIEF' | 'STANDARD' | 'RELIEF';
  status: 'ASSIGNED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export interface AssessmentSubmission {
  submissionId: string;
  tenantId: string;
  assessmentIdRef: string;
  componentIdRef: string;
  studentIdRef: string;
  status: 'PENDING' | 'OPEN' | 'SUBMITTED' | 'LATE' | 'ACCEPTED' | 'LOCKED';
  submittedAt?: string;
}

export interface AssessmentMark {
  markId: string;
  tenantId: string;
  submissionIdRef: string;
  studentIdRef: string;
  rawScore: number;
  weightedScore: number;
  markerUserIdRef: string;
  status: 'DRAFT' | 'SUBMITTED' | 'MODERATED' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

export interface GradeScale {
  scaleId: string;
  tenantId: string;
  name: string;
  grades: { grade: string; minScore: number; maxScore: number; gradePoint: number; pass: boolean }[];
  active: boolean;
}

export interface ResultApproval {
  approvalId: string;
  tenantId: string;
  assessmentIdRef: string;
  studentIdRef: string;
  finalScore: number;
  grade: string;
  status: ResultApprovalState;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GradeChangeRequest {
  requestId: string;
  tenantId: string;
  resultIdRef: string;
  studentIdRef: string;
  originalGrade: string;
  proposedGrade: string;
  reason: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentAuditEvent {
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
