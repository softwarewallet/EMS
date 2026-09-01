export enum CrisisEventSeverity {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  CATASTROPHIC = 'CATASTROPHIC'
}

export enum CrisisEventCategory {
  NATURAL_DISASTER = 'NATURAL_DISASTER',
  FIRE = 'FIRE',
  MEDICAL = 'MEDICAL',
  SECURITY = 'SECURITY',
  CYBER = 'CYBER',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  UTILITY_FAILURE = 'UTILITY_FAILURE',
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  ACADEMIC_DISRUPTION = 'ACADEMIC_DISRUPTION',
  TRANSPORTATION = 'TRANSPORTATION',
  VIOLENCE_THREAT = 'VIOLENCE_THREAT',
  DATA_SECURITY = 'DATA_SECURITY',
  AI_SECURITY = 'AI_SECURITY',
  FINANCIAL = 'FINANCIAL',
  REPUTATIONAL = 'REPUTATIONAL',
  OTHER = 'OTHER'
}

export enum CrisisEventStatus {
  DRAFT = 'DRAFT',
  REPORTED = 'REPORTED',
  ASSESSED = 'ASSESSED',
  DECLARED = 'DECLARED',
  EOC_ACTIVATED = 'EOC_ACTIVATED',
  RESPONSE_ACTIVE = 'RESPONSE_ACTIVE',
  STABILIZATION = 'STABILIZATION',
  RECOVERY = 'RECOVERY',
  REENTRY = 'REENTRY',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export enum CommandRole {
  INCIDENT_COMMANDER = 'INCIDENT_COMMANDER',
  DEPUTY_INCIDENT_COMMANDER = 'DEPUTY_INCIDENT_COMMANDER',
  OPERATIONS_LEAD = 'OPERATIONS_LEAD',
  PLANNING_LEAD = 'PLANNING_LEAD',
  LOGISTICS_LEAD = 'LOGISTICS_LEAD',
  COMMUNICATIONS_LEAD = 'COMMUNICATIONS_LEAD',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
  IT_TECHNOLOGY_LEAD = 'IT_TECHNOLOGY_LEAD',
  SECURITY_LEAD = 'SECURITY_LEAD',
  MEDICAL_SAFETY_LEAD = 'MEDICAL_SAFETY_LEAD',
  ACADEMIC_CONTINUITY_LEAD = 'ACADEMIC_CONTINUITY_LEAD',
  FINANCE_ADMINISTRATION_LEAD = 'FINANCE_ADMINISTRATION_LEAD'
}

export enum ServiceRecoveryPriority {
  TIER_0 = 'TIER_0', // Instant/Critical (0-2 hours)
  TIER_1 = 'TIER_1', // Urgent (2-12 hours)
  TIER_2 = 'TIER_2', // Important (12-24 hours)
  TIER_3 = 'TIER_3'  // Deferrable (24+ hours)
}

export enum EmergencyCommunicationPriority {
  INFORMATIONAL = 'INFORMATIONAL',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
  LIFE_SAFETY = 'LIFE_SAFETY'
}

export enum EmergencyCommunicationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH'
}

export interface CrisisClassification {
  category: CrisisEventCategory;
  initialSeverity: CrisisEventSeverity;
  affectedScope: string; // "CAMPUS" | "MULTI_CAMPUS" | "SYSTEM_WIDE"
  legalObligationReport: boolean;
}

export interface CrisisEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  category: CrisisEventCategory;
  severity: CrisisEventSeverity;
  status: CrisisEventStatus;
  declaredBy?: string;
  declaredAt?: string;
  closedBy?: string;
  closedAt?: string;
  classification: CrisisClassification;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CrisisTimelineEvent {
  id: string;
  tenantId: string;
  crisisId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  title: string;
  description: string;
  type: 'LOG' | 'DECISION' | 'COMMUNICATION' | 'EVACUATION' | 'SYSTEM_RECOVERY' | 'OVERRIDE';
  severityAtEvent: CrisisEventSeverity;
}

export interface EmergencyOperationsCenter {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  physicalLocation?: string;
  virtualLocationUrl?: string;
  status: 'ACTIVE' | 'STANDBY' | 'DEACTIVATED';
  activatedAt?: string;
  deactivatedAt?: string;
}

export interface EOCActivation {
  id: string;
  tenantId: string;
  crisisId: string;
  eocId: string;
  activatedBy: string;
  activatedAt: string;
  justification: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'DEACTIVATED';
}

export interface CommandAssignment {
  id: string;
  tenantId: string;
  crisisId: string;
  role: CommandRole;
  userId: string;
  userName: string;
  assignedBy: string;
  assignedAt: string;
  startTime: string;
  endTime?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'TERMINATED';
}

export interface CrisisCommandDecision {
  id: string;
  tenantId: string;
  crisisId: string;
  decisionMakerId: string;
  decisionMakerRole: CommandRole;
  title: string;
  description: string;
  justification: string;
  approvedBy?: string;
  approvedAt?: string;
  requiresSecondaryApproval: boolean;
  status: 'PROPOSED' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  createdAt: string;
}

export interface CrisisResponsePlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  category: CrisisEventCategory;
  severity: CrisisEventSeverity;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CrisisResponsePlaybook {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  category: CrisisEventCategory;
  severity: CrisisEventSeverity;
  version: number;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED';
  actions: string[]; // List of tasks/action ids or descriptions
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CrisisResponseAction {
  id: string;
  tenantId: string;
  crisisId: string;
  playbookId?: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  startedAt?: string;
  completedAt?: string;
  evidenceId?: string;
}

export interface CrisisTask {
  id: string;
  tenantId: string;
  crisisId: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CANCELLED';
  slaMinutes: number;
  deadline: string;
  dependencies: string[]; // Array of taskIds
  completedAt?: string;
  completedBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  evidenceUrl?: string;
}

export interface CrisisEscalation {
  id: string;
  tenantId: string;
  crisisId: string;
  triggerType: 'SEVERITY' | 'TIME' | 'ALERT_UNACKNOWLEDGED' | 'FAILED_RESPONSE' | 'COMMAND_ABSENCE' | 'SLA_BREACH';
  previousSeverity: CrisisEventSeverity;
  newSeverity: CrisisEventSeverity;
  escalatedToUserId?: string;
  reason: string;
  createdAt: string;
}

export interface CrisisCommunicationAction {
  id: string;
  tenantId: string;
  crisisId: string;
  priority: EmergencyCommunicationPriority;
  channel: EmergencyCommunicationChannel;
  recipientScope: string; // "ALL_CAMPUS" | "STAFF" | "STUDENTS" | "EOC_COMMAND"
  recipientCount: number;
  message: string;
  dispatchReference: string; // Maps to Phase 7.30
  dispatchStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentBy: string;
  sentAt: string;
  acknowledgements: { userId: string; timestamp: string }[];
}

export interface CriticalService {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  rtoMinutes: number; // Recovery Time Objective
  rpoMinutes: number; // Recovery Point Objective
  recoveryPriority: ServiceRecoveryPriority;
  ownerId: string;
  ownerName: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DISRUPTED' | 'RECOVERING';
}

export interface CriticalServiceDependency {
  id: string;
  tenantId: string;
  serviceId: string;
  dependsOnServiceId: string;
  dependencySeverity: 'CRITICAL' | 'SECONDARY';
}

export interface RecoveryObjective {
  id: string;
  tenantId: string;
  crisisId: string;
  serviceId: string;
  targetRtoMinutes: number;
  actualRecoveryMinutes?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED';
}

export interface RecoveryMilestone {
  id: string;
  tenantId: string;
  recoveryActivationId: string;
  title: string;
  targetTime: string;
  actualTime?: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

export interface ContinuityActivation {
  id: string;
  tenantId: string;
  crisisId: string;
  serviceId: string;
  activatedBy: string;
  activatedAt: string;
  alternateProcedure: string;
  notes?: string;
  status: 'ACTIVE' | 'STANDDOWN';
}

export interface DisasterRecoveryPlan {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  systemName: string;
  rtoMinutes: number;
  rpoMinutes: number;
  steps: string[];
  ownerId: string;
  createdAt: string;
}

export interface DisasterRecoveryActivation {
  id: string;
  tenantId: string;
  crisisId: string;
  drPlanId: string;
  activatedBy: string;
  activatedAt: string;
  status: 'PENDING_APPROVAL' | 'RECOVERY_IN_PROGRESS' | 'VALIDATION' | 'COMPLETED' | 'FAILED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface RecoverySystem {
  id: string;
  tenantId: string;
  drActivationId: string;
  systemName: string;
  status: 'OFFLINE' | 'RESTORING' | 'SYNCING' | 'ONLINE_VERIFYING' | 'FULLY_RESTORED' | 'FAILED';
  recoveryProgressPercent: number;
}

export interface RecoveryCheckpoint {
  id: string;
  tenantId: string;
  drActivationId: string;
  title: string;
  stepIndex: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  completedAt?: string;
  completedBy?: string;
  evidenceUrl?: string;
}

export interface RecoveryValidation {
  id: string;
  tenantId: string;
  drActivationId: string;
  validatedBy: string;
  validatedAt: string;
  testingMethod: string;
  isSuccessful: boolean;
  validationNotes: string;
}

export interface EmergencyResource {
  id: string;
  tenantId: string;
  name: string;
  category: 'MEDICAL' | 'COMMUNICATION' | 'SHELTER' | 'POWER' | 'FOOD_WATER' | 'VEHICLES' | 'SECURITY' | 'OTHER';
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
  resourceMasterRef: string; // Reference to Phase 7.41 Resources
}

export interface EmergencyResourceAllocation {
  id: string;
  tenantId: string;
  crisisId: string;
  resourceId: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  requestedBy: string;
  approvedBy?: string;
  destination: string;
  status: 'REQUESTED' | 'ALLOCATED' | 'DEPLOYED' | 'RETURNED' | 'REJECTED';
  createdAt: string;
}

export interface EmergencyPersonnelAssignment {
  id: string;
  tenantId: string;
  crisisId: string;
  userId: string;
  userName: string;
  skillRole: string;
  assignedAt: string;
  status: 'ASSIGNED' | 'ACTIVE' | 'RELEASED';
}

export interface EmergencyFacilityAssignment {
  id: string;
  tenantId: string;
  crisisId: string;
  facilityId: string;
  facilityName: string;
  purpose: string;
  assignedAt: string;
  status: 'ASSIGNED' | 'ACTIVE' | 'RELEASED';
}

export interface CampusClosure {
  id: string;
  tenantId: string;
  campusId: string;
  initiatedBy: string;
  initiatedAt: string;
  closureType: 'PARTIAL' | 'FULL';
  reason: string;
  isEmergency: boolean;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PROPOSED' | 'CLOSED' | 'REOPENING' | 'REOPENED' | 'CANCELLED';
}

export interface EvacuationOrder {
  id: string;
  tenantId: string;
  crisisId: string;
  campusId: string;
  initiatedBy: string;
  initiatedAt: string;
  zones: string[];
  assemblyPoints: string[];
  status: 'ACTIVE' | 'CLEAR' | 'STAND_DOWN';
  clearanceVerifiedBy?: string;
  clearanceVerifiedAt?: string;
}

export interface EvacuationZone {
  id: string;
  name: string;
  campusId: string;
  assemblyPointId: string;
}

export interface AssemblyPoint {
  id: string;
  name: string;
  campusId: string;
  capacity: number;
  locationDetails: string;
}

export interface ReentryAuthorization {
  id: string;
  tenantId: string;
  campusId: string;
  authorizedBy: string;
  authorizedAt: string;
  safetyAssessmentDone: boolean;
  assessmentNotes: string;
  outstandingHazardsCheck: boolean;
  status: 'PENDING_APPROVAL' | 'AUTHORIZED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface CrisisSimulation {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  scenarioType: 'FIRE' | 'FLOOD' | 'CYBERATTACK' | 'RANSOMWARE' | 'POWER_OUTAGE' | 'PANDEMIC' | 'VIOLENT_THREAT' | 'INFRASTRUCTURE_FAILURE' | 'MASS_COMM_FAILURE' | 'AI_DATA_SECURITY';
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface SimulationScenario {
  id: string;
  simulationId: string;
  title: string;
  injects: { timeOffsetMinutes: number; title: string; description: string }[];
}

export interface SimulationRun {
  id: string;
  tenantId: string;
  simulationId: string;
  executedBy: string;
  executedAt: string;
  scenarioType: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  hypotheticalResourceShortages: boolean;
  staffingReductionsPercent: number;
  campusClosureSimulated: boolean;
  serviceDegradationSimulated: boolean;
  communicationFailureSimulated: boolean;
  recoveryDelaysSimulated: boolean;
  projectedResponseTimeSeconds: number;
  projectedServiceImpactPercent: number;
  projectedResourceGapPercent: number;
  projectedRecoveryTimeSeconds: number;
  projectedResilienceScore: number;
  notes: string;
  isSimulation: true;
}

export interface SimulationResult {
  id: string;
  runId: string;
  findings: string[];
  gapsIdentified: string[];
}

export interface AfterActionReview {
  id: string;
  tenantId: string;
  crisisId: string;
  facilitatorId: string;
  facilitatorName: string;
  reviewedAt: string;
  whatHappened: string;
  whatWorked: string;
  whatFailed: string;
  timelineDeviations: string[];
  commandDecisionsNotes: string;
  communicationPerformanceScore: number;
  resourceGapsNotes: string;
  recoveryPerformanceScore: number;
  lessonsLearned: string[];
  correctiveActions: string[];
  preventiveActions: string[];
  status: 'DRAFT' | 'APPROVED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface ResilienceAssessment {
  id: string;
  tenantId: string;
  assessedBy: string;
  assessedAt: string;
  readinessScore: number;
  components: { name: string; score: number }[];
  status: 'DRAFT' | 'COMPLETED';
}

export interface ResilienceMetric {
  id: string;
  tenantId: string;
  key: string;
  value: number;
  unit: string;
  updatedAt: string;
}

export interface InstitutionalReadinessSnapshot {
  id: string;
  tenantId: string;
  overallScore: number;
  crisisResponseScore: number;
  eocReadinessScore: number;
  bcpReadinessScore: number;
  drReadinessScore: number;
  criticalServiceCoverageScore: number;
  recoveryPerformanceScore: number;
  communicationReadinessScore: number;
  resourceAvailabilityScore: number;
  dependencyResilienceScore: number;
  openResilienceGapsCount: number;
  overdueRecoveryActionsCount: number;
  snapshotDate: string;
}

export interface ResilienceGap {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  detectedAt: string;
}

export interface ResilienceImprovementAction {
  id: string;
  tenantId: string;
  gapId: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  targetDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

export interface CrisisApproval {
  id: string;
  tenantId: string;
  entityType: 'CRISIS_DECLARATION' | 'EOC_ACTIVATION' | 'EMERGENCY_OVERRIDE' | 'CAMPUS_CLOSURE' | 'SYSTEM_RECOVERY' | 'REENTRY_AUTHORIZATION' | 'CRISIS_CLOSURE';
  entityId: string;
  requestedBy: string;
  requestedAt: string;
  justification: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  decisionNotes?: string;
}

export interface EmergencyOverride {
  id: string;
  tenantId: string;
  requestedBy: string;
  requestedAt: string;
  justification: string;
  affectedScope: string;
  authorityLevel: string;
  startTime: string;
  expiryTime: string;
  reason: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  approvedBy?: string;
  approvedAt?: string;
  auditReference: string;
}

export interface CrisisEvidence {
  id: string;
  tenantId: string;
  crisisId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CrisisCorrespondence {
  id: string;
  tenantId: string;
  crisisId: string;
  senderName: string;
  message: string;
  sentAt: string;
}

export interface CrisisAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  previousState?: string;
  newState?: string;
  justification?: string;
  correlationId: string;
}

export interface CrisisDataQualityIssue {
  id: string;
  tenantId: string;
  issueType: 'ORPHAN_REFERENCE' | 'INVALID_TENANT_ID' | 'INVALID_CAMPUS_ID' | 'EXPIRED_OVERRIDE' | 'EXPIRED_COMMAND_ASSIGNMENT' | 'MISSING_RECOVERY_OWNER' | 'MISSING_RTO_RPO' | 'BROKEN_DEPENDENCY' | 'CIRCULAR_DEPENDENCY' | 'STALE_RESPONSE_PLAN' | 'STALE_PLAYBOOK' | 'INCOMPLETE_AAR' | 'MISSING_EVIDENCE' | 'UNRESOLVED_CRITICAL_ACTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedEntityId: string;
  affectedEntityType: string;
  detectedAt: string;
}
