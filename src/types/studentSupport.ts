export type SupportCaseCategory = 
  | 'ACADEMIC'
  | 'BEHAVIOURAL'
  | 'HEALTH'
  | 'COUNSELLING'
  | 'SAFEGUARDING'
  | 'RESIDENTIAL'
  | 'OTHER';

export type SupportCasePriority = 
  | 'EMERGENCY'
  | 'URGENT'
  | 'HIGH'
  | 'NORMAL'
  | 'LOW';

export type SupportCaseStatus = 
  | 'DRAFT'
  | 'OPEN'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'MONITORING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ON_HOLD'
  | 'ESCALATED'
  | 'CANCELLED';

export type ConfidentialityLevel = 
  | 'STANDARD'
  | 'RESTRICTED'
  | 'CONFIDENTIAL'
  | 'HIGHLY_CONFIDENTIAL';

export type HealthEncounterType = 
  | 'ROUTINE_CHECK'
  | 'MINOR_ILLNESS'
  | 'INJURY'
  | 'FIRST_AID'
  | 'EMERGENCY_OBSERVATION'
  | 'WELLNESS_CHECK'
  | 'MEDICATION_ADMINISTRATION'
  | 'POST_INCIDENT_FOLLOWUP';

export type WellnessDomain = 
  | 'GENERAL_WELLBEING'
  | 'ATTENDANCE_CONCERN'
  | 'ACADEMIC_STRESS'
  | 'SOCIAL_ADJUSTMENT'
  | 'BEHAVIOURAL_CONCERN'
  | 'RESIDENTIAL_ADJUSTMENT'
  | 'PEER_CONFLICT'
  | 'SAFEGUARDING_CONCERN'
  | 'OTHER';

export type WellnessRiskLevel = 
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export type ReferralCategory = 
  | 'INTERNAL_COUNSELLING'
  | 'EXTERNAL_SPECIALIST'
  | 'MEDICAL_CLINIC'
  | 'PSYCHOLOGICAL_SERVICES'
  | 'ACADEMIC_SUPPORT'
  | 'SAFEGUARDING_AUTHORITY'
  | 'OTHER';

export type ReferralStatus = 
  | 'DRAFT'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED';

export type ConsentType = 
  | 'COUNSELLING'
  | 'HEALTH_DATA_SHARING'
  | 'EXTERNAL_REFERRAL'
  | 'GUARDIAN_DISCLOSURE'
  | 'MEDICAL_TREATMENT';

export type ConsentStatus = 
  | 'GRANTED'
  | 'DENIED'
  | 'WITHDRAWN'
  | 'EXPIRED';

export type AccommodationCategory = 
  | 'ACCESSIBILITY'
  | 'EXAM'
  | 'CLASSROOM'
  | 'RESIDENCE'
  | 'TRANSPORT'
  | 'TEMPORARY';

export type AccommodationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REJECTED';

export type IncidentSeverity = 
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export type CommunicationType = 
  | 'CALL'
  | 'EMAIL'
  | 'IN_PERSON_MEETING'
  | 'LETTER'
  | 'PORTAL_MESSAGE';

export interface HealthDocumentReference {
  docId: string;
  title: string;
  fileType: string;
  url?: string;
  uploadedAt: string;
  confidentiality: ConfidentialityLevel;
}

export interface StudentSupportCase {
  id: string;
  caseNumber: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  enrollmentId?: string;
  academicYearId?: string;
  category: SupportCaseCategory;
  priority: SupportCasePriority;
  confidentialityLevel: ConfidentialityLevel;
  status: SupportCaseStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  openedDate: string;
  targetFollowUpDate: string;
  resolutionDate?: string;
  closedDate?: string;
  closureReason?: string;
  summary: string;
  notes?: string;
  linkedSupportPlanId?: string;
  linkedReferralIds?: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface HealthEncounter {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  encounterDateTime: string;
  encounterType: HealthEncounterType;
  staffMemberId: string;
  staffMemberName: string;
  vitals?: {
    temperatureCelsius?: number;
    pulseBpm?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    spO2Percent?: number;
  };
  observations: string;
  actionsTaken: string;
  medicationAdministered?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  referralRequired: boolean;
  guardianNotified: boolean;
  guardianNotifiedAt?: string;
  confidentialityLevel: ConfidentialityLevel;
  documentReferences?: HealthDocumentReference[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface WellnessObservation {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  observationDate: string;
  domain: WellnessDomain;
  riskLevel: WellnessRiskLevel;
  observationNotes: string;
  observerId: string;
  observerName: string;
  observerRole?: string;
  actionRecommended?: string;
  linkedCaseId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CounsellingCase {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseNumber: string;
  assignedCounsellorId: string;
  assignedCounsellorName: string;
  priority: SupportCasePriority;
  status: SupportCaseStatus;
  confidentialityLevel: ConfidentialityLevel;
  openingReasonCategory: SupportCaseCategory;
  openedAt: string;
  closedAt?: string;
  totalSessions: number;
  nextSessionDate?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CounsellingSession {
  id: string;
  tenantId: string;
  campusId?: string;
  counsellingCaseId: string;
  studentId: string;
  sessionDate: string;
  durationMinutes: number;
  counsellorId: string;
  counsellorName: string;
  sessionStatus: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  summaryPublic?: string;
  restrictedNotesReference?: string;
  confidentialNotes?: string;
  followUpRequired: boolean;
  nextReviewDate?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SupportPlanTask {
  id: string;
  planId: string;
  description: string;
  assignedTo: string;
  assignedToName?: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt?: string;
  notes?: string;
}

export interface SupportPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseId?: string;
  planName: string;
  objectives: string[];
  responsibleStaffId: string;
  responsibleStaffName: string;
  startDate: string;
  reviewDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'SUSPENDED' | 'ARCHIVED';
  tasks: SupportPlanTask[];
  reviewHistory?: Array<{
    reviewedAt: string;
    reviewedBy: string;
    comments: string;
    nextReviewDate: string;
  }>;
  outcome?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SupportReferral {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseId?: string;
  referralCategory: ReferralCategory;
  providerType: string;
  providerName?: string;
  referralDate: string;
  reasonCategory: string;
  reasonDetails: string;
  consentStatus: ConsentStatus;
  consentId?: string;
  followUpDate: string;
  completionStatus: ReferralStatus;
  outcomeNotes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SupportConsent {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedBy: string;
  grantedByName?: string;
  relationshipToStudent?: string;
  timestamp: string;
  scope: string;
  expiryDate?: string;
  withdrawalDate?: string;
  withdrawalReason?: string;
  supportingDocumentRef?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SupportCommunication {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  caseId?: string;
  guardianId: string;
  guardianName?: string;
  commType: CommunicationType;
  date: string;
  staffMemberId: string;
  staffMemberName: string;
  purpose: string;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SupportAccommodation {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseId?: string;
  category: AccommodationCategory;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: AccommodationStatus;
  approvingAuthority: string;
  reviewDate: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SupportIncident {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseId?: string;
  incidentTimestamp: string;
  location: string;
  category: SupportCaseCategory;
  severity: IncidentSeverity;
  description: string;
  immediateActions: string;
  responsibleStaffId: string;
  responsibleStaffName: string;
  escalationStatus: 'NONE' | 'ESCALATED' | 'RESOLVED';
  guardianNotified: boolean;
  referralIssued: boolean;
  resolution?: string;
  postIncidentReview?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EmergencySupportOverride {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  incidentId?: string;
  reason: string;
  authorizedBy: string;
  authorizedByName?: string;
  authorizedAt: string;
  effectiveUntil: string;
  auditTrail: Array<{
    timestamp: string;
    action: string;
    user: string;
    notes?: string;
  }>;
  createdAt: string;
}

export interface SupportAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  lastCalculatedAt: string;
  activeCasesCount: number;
  casesByCategory: Record<string, number>;
  casesByPriority: Record<string, number>;
  casesByStatus: Record<string, number>;
  totalHealthEncounters: number;
  activeCounsellingCases: number;
  activeSupportPlans: number;
  pendingReferrals: number;
  activeAccommodations: number;
  incidentsThisMonth: number;
  averageResolutionDays: number;
  slaBreachedCount: number;
}

// Phase 7.26 Student Support & Grievance Governance Engine Additions
export interface StudentSupportCaseVersion {
  id: string;
  caseId: string;
  tenantId: string;
  version: number;
  status: SupportCaseStatus;
  priority: SupportCasePriority;
  confidentialityLevel: ConfidentialityLevel;
  assignedStaffId?: string;
  summary: string;
  notes?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SupportAssignment {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  assignedStaffId: string;
  assignedStaffName: string;
  role: string;
  assignmentScope: string;
  assignedAt: string;
  assignedBy: string;
  revokedAt?: string;
  assignmentReason: string;
}

export interface SupportActionItem {
  id: string;
  planId: string;
  objective: string;
  responsibleOfficerId: string;
  responsibleOfficerName: string;
  targetDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completionPercentage: number; // 0-100 only
  evidenceReference?: string;
  completionNotes?: string;
}

export interface SupportActionPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  studentId: string;
  studentName?: string;
  objective: string;
  responsibleOfficer: string;
  targetDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'SUSPENDED';
  completionPercentage: number; // 0-100 only
  actionItems: SupportActionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportFollowUp {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  studentId: string;
  dueDate: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  followUpType: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  outcome?: string;
  completedAt?: string;
  nextFollowUpId?: string;
}

export interface SupportEscalation {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  originalStatus: SupportCaseStatus;
  escalatedTo: string;
  escalationReason: string;
  escalationActorId: string;
  timestamp: string;
  notes?: string;
}

export interface SupportDisclosure {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  disclosurePurpose: string;
  disclosureRecipient: string;
  legalBasis: string;
  disclosedBy: string;
  disclosedAt: string;
  scope: string;
  expiresAt?: string;
}

export interface SupportCaseReview {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  reviewDate: string;
  progressNotes: string;
  outcome: 'IMPROVED' | 'STABLE' | 'NO_IMPROVEMENT' | 'WORSENED';
  reviewedBy: string;
  reviewedByName: string;
}

export interface SupportCaseDocumentReference {
  id: string;
  tenantId: string;
  campusId?: string;
  caseId: string;
  documentId: string;
  documentRegistryReference: string;
  documentType: string;
}

export interface SupportCaseComment {
  id: string;
  tenantId: string;
  caseId: string;
  commenterId: string;
  commenterName: string;
  commentText: string;
  createdAt: string;
  confidentialityLevel: ConfidentialityLevel;
}

export interface SupportNotificationReference {
  id: string;
  tenantId: string;
  recipientId: string;
  caseId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WelfareIntervention {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseId?: string;
  type: string;
  description: string;
  startDate: string;
  targetEndDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedStaffId: string;
  assignedStaffName: string;
  outcomeNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grievance {
  id: string;
  tenantId: string;
  campusId?: string;
  complainantReference: string;
  complainantName: string;
  complainantType: 'STUDENT' | 'GUARDIAN' | 'STAFF' | 'OTHER';
  subjectReference?: string;
  category: string;
  description: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'TRIAGED' | 'ASSIGNED' | 'INVESTIGATION' | 'RESPONSE_DRAFTED' | 'RESPONSE_APPROVED' | 'RESOLVED' | 'CLOSED';
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  investigationNotes?: string;
  resolution?: string;
  response?: string;
  responseDraft?: string;
  closedByEmail?: string;
  appealReference?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeguardingConcern {
  id: string;
  tenantId: string;
  studentId: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface SafeguardingCase {
  id: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  studentName?: string;
  caseNumber: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'MONITORING' | 'CLOSED' | 'ESCALATED';
  designatedSafeguardingOfficerId?: string;
  designatedSafeguardingOfficerName?: string;
  actionPlan?: string;
  protectedCaseNotes?: string;
  referralReferences?: string[];
  closureApprovalBy?: string;
  closureReason?: string;
  reviewHistory?: Array<{
    reviewedAt: string;
    reviewedBy: string;
    comments: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export type CounselingSession = CounsellingSession;

