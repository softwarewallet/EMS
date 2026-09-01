/**
 * PHASE 11.12: Institutional Student Services, Case Management, Advising, Wellbeing & Support Operations
 * Domain Entity Types, Enums, Interfaces, and State Machine Definitions
 */

export type SupportCaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_ON_STUDENT'
  | 'WAITING_ON_EXTERNAL_PARTY'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type ServiceRequestStatus =
  | 'SUBMITTED'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'FULFILLED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'REJECTED';

export type ReferralStatus =
  | 'CREATED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export type AppointmentStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_SESSION'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED';

export type InterventionStatus =
  | 'IDENTIFIED'
  | 'REVIEWED'
  | 'PLAN_CREATED'
  | 'ACTIONS_IN_PROGRESS'
  | 'MONITORED'
  | 'SUCCESSFUL'
  | 'UNSUCCESSFUL'
  | 'CLOSED';

export type InterventionActionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DEFERRED'
  | 'CANCELLED';

export type ConfidentialityLevel =
  | 'STANDARD'
  | 'CONFIDENTIAL'
  | 'HIGHLY_CONFIDENTIAL'
  | 'RESTRICTED';

export type AccommodationStatus =
  | 'REQUESTED'
  | 'DOCUMENTATION_REVIEW'
  | 'ASSESSMENT'
  | 'APPROVED'
  | 'ACTIVE'
  | 'MODIFIED'
  | 'EXPIRED'
  | 'CLOSED'
  | 'REJECTED';

export type CrisisSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type CrisisStatus =
  | 'REPORTED'
  | 'TRIAGED'
  | 'ACTIVE_RESPONSE'
  | 'ESCALATED'
  | 'STABILIZED'
  | 'CLOSED';

export type FollowUpStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED';

export type SupportOutcomeType =
  | 'RESOLVED'
  | 'REFERRED'
  | 'STUDENT_WITHDREW'
  | 'NO_FURTHER_ACTION'
  | 'ESCALATED'
  | 'SERVICE_COMPLETED'
  | 'UNABLE_TO_CONTACT'
  | 'DUPLICATE'
  | 'OTHER';

export type AlertCategory =
  | 'ACADEMIC_RISK'
  | 'ATTENDANCE_CONCERN'
  | 'REPEATED_REGISTRATION_FAILURE'
  | 'FINANCIAL_BARRIER'
  | 'UNRESOLVED_SERVICE_REQUEST'
  | 'WELLBEING_CONCERN'
  | 'ACCESSIBILITY_CONCERN'
  | 'ENGAGEMENT_CONCERN'
  | 'ADMINISTRATIVE_CONCERN';

export type SupportCategory =
  | 'ACADEMIC_ADVISING'
  | 'COUNSELLING_WELLBEING'
  | 'ACCESSIBILITY_SERVICES'
  | 'CAREER_SERVICES'
  | 'FINANCIAL_AID'
  | 'STUDENT_AFFAIRS'
  | 'HEALTH_SERVICES'
  | 'HOUSING_SUPPORT'
  | 'INTERNATIONAL_STUDENT_SUPPORT'
  | 'RESEARCH_SUPPORT'
  | 'LIBRARY_SUPPORT'
  | 'GENERAL_SUPPORT';

export interface StudentSupportProfile {
  profileId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentNumber: string;
  studentName: string;
  programIdRef: string;
  academicYear: string;
  cohort: string;
  primaryAdvisorIdRef?: string;
  primaryAdvisorName?: string;
  confidentialityLevel: ConfidentialityLevel;
  activeAccommodationsCount: number;
  openCasesCount: number;
  openAlertsCount: number;
  hasActiveCrisis: boolean;
  registeredAt: string;
  updatedAt: string;
}

export interface SupportCenter {
  centerId: string;
  tenantId: string;
  campusIdRef: string;
  centerCode: string;
  name: string;
  category: SupportCategory;
  location: string;
  contactEmail: string;
  contactPhone: string;
  operatingHours: string;
  headUserIdRef: string;
  isActive: boolean;
}

export interface SupportService {
  serviceId: string;
  tenantId: string;
  campusIdRef: string;
  centerIdRef: string;
  serviceCode: string;
  serviceName: string;
  category: SupportCategory;
  description: string;
  slaHours: number;
  requiresFourEyesApproval: boolean;
  confidentialityLevel: ConfidentialityLevel;
  isActive: boolean;
}

export interface SupportCaseParticipant {
  participantId: string;
  userIdRef: string;
  name: string;
  role: 'PRIMARY_CASE_WORKER' | 'SUPPORT_ADVISOR' | 'COUNSELLOR' | 'FACULTY_LIAISON' | 'STUDENT' | 'OBSERVER';
  assignedAt: string;
}

export interface SupportCaseNote {
  noteId: string;
  caseIdRef: string;
  authorUserIdRef: string;
  authorName: string;
  confidentialityLevel: ConfidentialityLevel;
  content: string;
  createdAt: string;
}

export interface SupportCase {
  caseId: string;
  tenantId: string;
  campusIdRef: string;
  caseNumber: string;
  studentIdRef: string;
  studentName: string;
  serviceIdRef: string;
  serviceCategory: SupportCategory;
  title: string;
  description: string;
  status: SupportCaseStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidentialityLevel: ConfidentialityLevel;
  primaryAssignedUserIdRef?: string;
  primaryAssignedName?: string;
  participants: SupportCaseParticipant[];
  notes: SupportCaseNote[];
  idempotencyKey: string;
  triagedAt?: string;
  assignedAt?: string;
  escalatedAt?: string;
  escalationReason?: string;
  resolvedAt?: string;
  resolutionSummary?: string;
  closedAt?: string;
  closingUserIdRef?: string;
  dualApprovedClosureUserIdRef?: string;
  closureRemarks?: string;
  reopenedAt?: string;
  reopeningReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  requestNumber: string;
  studentIdRef: string;
  studentName: string;
  serviceIdRef: string;
  serviceName: string;
  category: SupportCategory;
  subject: string;
  details: string;
  status: ServiceRequestStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedToUserIdRef?: string;
  assignedToName?: string;
  idempotencyKey: string;
  submittedAt: string;
  fulfilledAt?: string;
  verifiedAt?: string;
  closedAt?: string;
  rejectionReason?: string;
  updatedAt: string;
}

export interface ServiceReferral {
  referralId: string;
  tenantId: string;
  campusIdRef: string;
  referralNumber: string;
  studentIdRef: string;
  studentName: string;
  sourceServiceCategory: SupportCategory;
  targetServiceCategory: SupportCategory;
  targetCenterIdRef: string;
  referringStaffUserIdRef: string;
  referringStaffName: string;
  reason: string;
  urgency: 'ROUTINE' | 'URGENT' | 'CRISIS';
  confidentialityLevel: ConfidentialityLevel;
  status: ReferralStatus;
  acceptedByUserIdRef?: string;
  assignedToUserIdRef?: string;
  idempotencyKey: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  declinedReason?: string;
  updatedAt: string;
}

export interface ReferralAssignment {
  assignmentId: string;
  referralIdRef: string;
  assignedToUserIdRef: string;
  assignedToName: string;
  assignedAt: string;
  active: boolean;
}

export interface AdvisingAssignment {
  assignmentId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  advisorUserIdRef: string;
  advisorName: string;
  advisorEmail: string;
  advisingType: 'ACADEMIC' | 'CAREER' | 'ACCESSIBILITY' | 'GENERAL';
  status: 'ACTIVE' | 'INACTIVE' | 'REASSIGNED';
  assignedAt: string;
  reassignedAt?: string;
  reassignmentReason?: string;
}

export interface AdvisingAppointment {
  appointmentId: string;
  tenantId: string;
  campusIdRef: string;
  appointmentNumber: string;
  studentIdRef: string;
  studentName: string;
  advisorUserIdRef: string;
  advisorName: string;
  slotStartTime: string;
  slotEndTime: string;
  location: string;
  modality: 'IN_PERSON' | 'VIRTUAL' | 'PHONE';
  meetingLink?: string;
  purpose: string;
  status: AppointmentStatus;
  idempotencyKey: string;
  requestedAt: string;
  confirmedAt?: string;
  checkedInAt?: string;
  completedAt?: string;
  cancellationReason?: string;
  noShowRecordedAt?: string;
  updatedAt: string;
}

export interface AdvisingRecommendation {
  recommendationId: string;
  sessionIdRef: string;
  studentIdRef: string;
  advisorUserIdRef: string;
  category: 'COURSE_LOAD' | 'ACADEMIC_SKILLS' | 'TUTORING' | 'CAREER_PATH' | 'WELLBEING_REFERRAL' | 'OTHER';
  actionableSummary: string;
  targetCourseIdRef?: string;
  targetProgramVersionIdRef?: string;
  dueDate?: string;
  createdAt: string;
}

export interface AdvisingSession {
  sessionId: string;
  tenantId: string;
  campusIdRef: string;
  appointmentIdRef: string;
  studentIdRef: string;
  advisorUserIdRef: string;
  sessionStartedAt: string;
  sessionEndedAt: string;
  topicsDiscussed: string[];
  summaryNotes: string;
  confidentialityLevel: ConfidentialityLevel;
  recommendations: AdvisingRecommendation[];
  nextFollowUpDate?: string;
}

export interface InterventionAction {
  actionId: string;
  planIdRef: string;
  title: string;
  ownerUserIdRef: string;
  ownerName: string;
  targetCompletionDate: string;
  status: InterventionActionStatus;
  completedAt?: string;
  completionNotes?: string;
  evidenceDocumentIdRef?: string;
  escalationRule?: string;
}

export interface InterventionPlan {
  planId: string;
  tenantId: string;
  campusIdRef: string;
  planNumber: string;
  studentIdRef: string;
  studentName: string;
  alertIdRef?: string;
  category: AlertCategory;
  status: InterventionStatus;
  objective: string;
  leadAdvisorUserIdRef: string;
  leadAdvisorName: string;
  actions: InterventionAction[];
  startDate: string;
  reviewDate: string;
  completedAt?: string;
  outcomeSummary?: string;
  dualApprovedClosureUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSuccessAlert {
  alertId: string;
  tenantId: string;
  campusIdRef: string;
  alertNumber: string;
  studentIdRef: string;
  studentName: string;
  category: AlertCategory;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  reason: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolutionNotes?: string;
  linkedPlanIdRef?: string;
}

export interface WellbeingAssessment {
  assessmentId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  assessorUserIdRef: string;
  assessorRole: string;
  assessedAt: string;
  confidentialityLevel: ConfidentialityLevel;
  presentingConcerns: string[];
  riskIndicatorsPresent: boolean;
  supportPlanSummary: string;
  scheduledNextReviewDate?: string;
  mandatedCrisisEscalation: boolean;
}

export interface AccommodationAdjustment {
  adjustmentId: string;
  planIdRef: string;
  category: 'EXAM_TIME_EXTENSION' | 'DISTRACTION_REDUCED_SPACE' | 'ASSISTIVE_TECH' | 'NOTETAKING' | 'ERGONOMIC' | 'ATTENDANCE_FLEXIBILITY' | 'ACCESSIBLE_FORMAT';
  description: string;
  approvedDurationMultiplier?: number;
  specialInstructions?: string;
  isActive: boolean;
}

export interface AccessibilityVerification {
  verificationId: string;
  documentIdRef: string;
  documentType: string;
  verifiedByUserIdRef: string;
  verifiedAt: string;
  verificationStatus: 'VALID' | 'INSUFFICIENT' | 'EXPIRED' | 'REJECTED';
  notes: string;
}

export interface AccommodationRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  requestNumber: string;
  studentIdRef: string;
  studentName: string;
  disabilityCategory: string;
  requestedAdjustments: string[];
  status: AccommodationStatus;
  submittedAt: string;
  reviewedByUserIdRef?: string;
  assessedAt?: string;
  approvedAt?: string;
  approverUserIdRef?: string;
  dualApproverUserIdRef?: string;
  expiryDate?: string;
  rejectionReason?: string;
  idempotencyKey: string;
  supportingDocuments: AccessibilityVerification[];
  updatedAt: string;
}

export interface AccommodationPlan {
  planId: string;
  tenantId: string;
  campusIdRef: string;
  planNumber: string;
  studentIdRef: string;
  studentName: string;
  requestIdRef: string;
  status: AccommodationStatus;
  effectiveFrom: string;
  expiresAt: string;
  adjustments: AccommodationAdjustment[];
  authorizedByUserIdRef: string;
  dualApprovedUserIdRef: string;
  lastReviewDate: string;
  nextReviewDate: string;
  confidentialNotes?: string;
}

export interface CrisisIncident {
  incidentId: string;
  tenantId: string;
  campusIdRef: string;
  incidentNumber: string;
  studentIdRef: string;
  studentName: string;
  reportedByUserIdRef: string;
  severity: CrisisSeverity;
  status: CrisisStatus;
  category: 'SELF_HARM_RISK' | 'IMMINENT_SAFETY_THREAT' | 'SEVERE_DISTRESS' | 'MEDICAL_EMERGENCY' | 'SAFEGUARDING_BREACH';
  incidentSummary: string;
  confidentialityLevel: ConfidentialityLevel;
  emergencyServicesContacted: boolean;
  activeEscalationOwnerUserIdRef?: string;
  responseDeadline: string;
  triagedAt?: string;
  escalatedAt?: string;
  stabilizedAt?: string;
  closedAt?: string;
  closingUserIdRef?: string;
  dualApprovedClosureUserIdRef?: string;
  closureRationale?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeguardingConcern {
  concernId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  reportedByUserIdRef: string;
  concernDetails: string;
  confidentialityLevel: ConfidentialityLevel;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'ESCALATED_TO_AUTHORITIES' | 'RESOLVED' | 'CLOSED';
  designatedSafeguardingLeadUserIdRef: string;
  dualApprovedResolutionUserIdRef?: string;
  resolutionDetails?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface EscalationRecord {
  escalationId: string;
  tenantId: string;
  campusIdRef: string;
  sourceEntityType: 'SUPPORT_CASE' | 'CRISIS_INCIDENT' | 'SAFEGUARDING_CONCERN' | 'INTERVENTION_PLAN';
  sourceEntityId: string;
  escalatedByUserIdRef: string;
  escalatedToUserIdRef: string;
  severity: CrisisSeverity;
  reason: string;
  escalatedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface FollowUpTask {
  taskId: string;
  tenantId: string;
  campusIdRef: string;
  taskNumber: string;
  relatedEntityType: 'SUPPORT_CASE' | 'ADVISING_SESSION' | 'INTERVENTION_PLAN' | 'ACCOMMODATION' | 'CRISIS';
  relatedEntityId: string;
  studentIdRef: string;
  studentName: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: FollowUpStatus;
  assignedToUserIdRef: string;
  assignedToName: string;
  dueAt: string;
  completedAt?: string;
  completionNotes?: string;
  isOverdue: boolean;
  createdAt: string;
}

export interface SupportOutcome {
  outcomeId: string;
  tenantId: string;
  campusIdRef: string;
  caseIdRef?: string;
  studentIdRef: string;
  outcomeType: SupportOutcomeType;
  evidenceSummary: string;
  serviceIdRef: string;
  serviceCategory: SupportCategory;
  recordedByUserIdRef: string;
  recordedAt: string;
}

export interface CaseClosure {
  closureId: string;
  caseIdRef: string;
  closingUserIdRef: string;
  dualApprovedClosureUserIdRef: string;
  closureRemarks: string;
  outcomeType: SupportOutcomeType;
  closedAt: string;
}

export interface StudentSupportAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef?: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserIdRef: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  correlationId: string;
  idempotencyKey: string;
  payloadHash: string;
}

export type StudentSupportSimulationType =
  | 'CASE_SURGE'
  | 'REFERRAL_BACKLOG'
  | 'ADVISOR_CAPACITY_EXHAUSTION'
  | 'ADVISOR_DOUBLE_BOOKING'
  | 'CRITICAL_CASE_ESCALATION'
  | 'SLA_BREACH_CASCADE'
  | 'MASS_SERVICE_REQUEST'
  | 'ACCOMMODATION_SURGE'
  | 'ACCOMMODATION_EXPIRY'
  | 'INTERVENTION_CASCADE'
  | 'FOLLOWUP_OVERLOAD'
  | 'MULTI_CAMPUS_SUPPORT_LOAD'
  | 'PROVIDER_UNAVAILABLE'
  | 'DUPLICATE_REQUEST_REPLAY'
  | 'FULL_SUPPORT_LIFECYCLE';

export interface SimulationScenario {
  scenarioId: string;
  scenarioType: StudentSupportSimulationType;
  title: string;
  description: string;
  simulatedAt: string;
  syntheticResults: {
    predictedCaseBacklog: number;
    predictedSlaBreachCount: number;
    advisorUtilizationPercent: number;
    capacityOverloadDetected: boolean;
    criticalEscalationsProjected: number;
    estimatedResolutionTimeHours: number;
    complianceScoreProjected: number;
  };
}

export interface StudentSupportDiagnosticsReport {
  timestamp: string;
  tenantId: string;
  campusIdRef: string;
  totalChecksExecuted: number;
  passedChecksCount: number;
  systemHealthScore: number;
  auditChainIntegrityValid: boolean;
  issuesFound: Array<{
    issueId: string;
    code: string;
    title: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    details: string;
    remediationRecommendation: string;
  }>;
}
