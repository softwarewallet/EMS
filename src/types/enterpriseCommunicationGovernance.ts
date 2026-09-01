// Phase 8.4 — Institutional Enterprise Communication, Notification, Alert, Collaboration & Official Messaging Governance Control Plane Types

export type CommunicationPolicyLifecycle = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'SUPERSEDED'
  | 'RETIRED';

export type CommunicationPolicyScope = 
  | 'OFFICIAL'
  | 'OPERATIONAL'
  | 'EXECUTIVE'
  | 'ACADEMIC'
  | 'ADMINISTRATIVE'
  | 'EMERGENCY'
  | 'COMPLIANCE'
  | 'REGULATORY_NOTICE'
  | 'PUBLIC_NOTICE'
  | 'INTERNAL_ANNOUNCEMENT'
  | 'SYSTEM_NOTIFICATION';

export type CommunicationChannelClassification = 
  | 'EMAIL'
  | 'SMS'
  | 'PUSH'
  | 'WEB_NOTIFICATION'
  | 'PORTAL'
  | 'COLLABORATION_PLATFORM'
  | 'OFFICIAL_NOTICE'
  | 'EMERGENCY_ALERT'
  | 'OTHER';

export type CommunicationTemplateLifecycle = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'RETIRED';

export type AudienceType = 
  | 'ROLE'
  | 'DEPARTMENT'
  | 'CAMPUS'
  | 'PROGRAM'
  | 'CASE'
  | 'WORKFLOW'
  | 'TASK'
  | 'EVENT'
  | 'INCIDENT'
  | 'CUSTOM_GOVERNED_GROUP';

export type AlertLifecycle = 
  | 'DRAFT'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'ACKNOWLEDGED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type AlertSeverity = 'INFORMATIONAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EscalationLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'EXECUTIVE' | 'CRITICAL_RESPONSE';

export type DeliveryObservationStatus = 
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'BOUNCED'
  | 'REJECTED'
  | 'ACKNOWLEDGED'
  | 'UNKNOWN'
  | 'INSUFFICIENT_DATA';

export type ScenarioType804 = 
  | 'EMAIL_PROVIDER_OUTAGE'
  | 'SMS_PROVIDER_OUTAGE'
  | 'MASS_NOTIFICATION_FAILURE'
  | 'CAMPUS_NETWORK_OUTAGE'
  | 'CYBER_INCIDENT'
  | 'FALSE_ALERT_SURGE'
  | 'EXECUTIVE_COMMUNICATION_DELAY'
  | 'EMERGENCY_CHANNEL_FAILURE'
  | 'MULTI_CAMPUS_CRISIS'
  | 'HIGH_VOLUME_NOTIFICATION_SPIKE'
  | 'THIRD_PARTY_COMMUNICATION_FAILURE'
  | 'CASCADING_ESCALATION_FAILURE';

export interface EnterpriseCommunicationPolicy {
  id: string;
  tenantId: string;
  campusId?: string;
  policyCode: string;
  title: string;
  scope: CommunicationPolicyScope;
  status: CommunicationPolicyLifecycle;
  version: string;
  description: string;
  ownerUserIdRef: string;
  approvalPackageIdRef?: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  effectiveDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationChannel {
  id: string;
  tenantId: string;
  campusId?: string;
  channelCode: string;
  name: string;
  classification: CommunicationChannelClassification;
  providerReference: string; // Integration ref only
  status: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE' | 'DISABLED';
  reliabilityObservationPercentage: number; // 0-100 or -1 if insufficient data
  authorizationRequired: boolean;
  maxDataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  fallbackChannelIdRef?: string;
  escalationPriority: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationTemplate {
  id: string;
  tenantId: string;
  campusId?: string;
  templateCode: string;
  title: string;
  purpose: string;
  audienceType: AudienceType;
  classification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  languageCode: string;
  version: string;
  status: CommunicationTemplateLifecycle;
  ownerUserIdRef: string;
  sourceReference: string;
  contentChecksum: string; // SHA-256 hash of template body
  subjectPattern: string;
  bodyPattern: string;
  effectiveDate: string;
  expiryDate?: string;
  approvalPackageIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationCampaign {
  id: string;
  tenantId: string;
  campusId?: string;
  campaignCode: string;
  title: string;
  purpose: string;
  templateIdRef: string;
  audienceIdRef: string;
  scheduledTime?: string;
  status: 'DRAFT' | 'APPROVAL_PENDING' | 'SCHEDULED' | 'EXECUTING' | 'COMPLETED' | 'CANCELLED';
  createdUserIdRef: string;
  approvalPackageIdRef?: string;
  totalRecipientsCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationMessage {
  id: string;
  tenantId: string;
  campusId?: string;
  messageCode: string;
  templateIdRef?: string;
  channelIdRef: string;
  recipientGroupIdRef?: string;
  recipientUserIdRef?: string; // Reference only
  caseIdRef?: string;
  taskIdRef?: string;
  workflowInstanceIdRef?: string;
  documentIdRef?: string;
  recordIdRef?: string;
  incidentIdRef?: string;
  externalMessageIdRef?: string; // Provider ID
  classification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  idempotencyKey: string;
  subject: string;
  bodyHash: string;
  status: DeliveryObservationStatus;
  sentAt?: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationRecipientGroup {
  id: string;
  tenantId: string;
  campusId?: string;
  groupCode: string;
  name: string;
  audienceType: AudienceType;
  targetRefId: string; // Department ID, Role ID, Case ID, etc.
  isSmallCellProtected: boolean;
  memberCountRef: number;
  authorizedRoles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationAudience {
  id: string;
  tenantId: string;
  campusId?: string;
  audienceCode: string;
  title: string;
  audienceType: AudienceType;
  criteriaDescription: string;
  recipientGroupIdRefs: string[];
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  estimatedCount: number;
  isAvailable: boolean; // if false -> displays INSUFFICIENT DATA
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationPreference {
  id: string;
  tenantId: string;
  actorUserIdRef: string;
  optOutChannels: CommunicationChannelClassification[];
  emergencyOverrideAllowed: boolean;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseNotificationRule {
  id: string;
  tenantId: string;
  campusId?: string;
  ruleCode: string;
  name: string;
  eventType: string; // e.g. SLA_BREACH, TASK_OVERDUE, APPROVAL_NEEDED, EMERGENCY_DECLARED
  severity: AlertSeverity;
  sourceModuleIdRef: string;
  templateIdRef: string;
  channelIdRef: string;
  audienceIdRef: string;
  suppressionWindowMinutes: number;
  isActive: boolean;
  requiresSoD: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseNotificationEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  eventCode: string;
  ruleIdRef: string;
  eventType: string;
  sourceRecordIdRef: string;
  sourceModuleIdRef: string;
  idempotencyKey: string;
  payloadHash: string;
  status: 'PENDING' | 'PROCESSED' | 'SUPPRESSED' | 'FAILED';
  processedAt?: string;
  createdAt: string;
}

export interface EnterpriseAlertDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  alertCode: string;
  title: string;
  severity: AlertSeverity;
  affectedService: string;
  requiresFourEyesApproval: boolean;
  escalationPolicyIdRef: string;
  channelIdRef: string;
  audienceIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseAlertInstance {
  id: string;
  tenantId: string;
  campusId?: string;
  instanceCode: string;
  alertDefinitionIdRef: string;
  title: string;
  severity: AlertSeverity;
  status: AlertLifecycle;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  approvalTimestamp?: string;
  acknowledgedByUserIdRef?: string;
  acknowledgedAt?: string;
  resolvedByUserIdRef?: string;
  resolvedAt?: string;
  incidentIdRef?: string;
  resolutionSummary?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseEscalationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  levels: {
    level: EscalationLevel;
    thresholdMinutes: number;
    responsibleRole: string;
    fallbackRole: string;
    channelClassification: CommunicationChannelClassification;
    requiresAcknowledgement: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationApproval {
  id: string;
  tenantId: string;
  approvalCode: string;
  targetType: 'POLICY' | 'TEMPLATE' | 'CAMPAIGN' | 'ALERT' | 'EMERGENCY' | 'NOTICE';
  targetIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  justification?: string;
  decidedAt?: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface EnterpriseCommunicationDeliveryObservation {
  id: string;
  tenantId: string;
  messageIdRef: string;
  externalMessageIdRef?: string;
  externalChannelIdRef?: string;
  observationStatus: DeliveryObservationStatus;
  telemetryProviderRef: string;
  isTelemetryAvailable: boolean; // if false -> displays INSUFFICIENT DATA
  observationTimestamp: string;
  latencyMs?: number;
}

export interface EnterpriseCommunicationFailure {
  id: string;
  tenantId: string;
  messageIdRef?: string;
  campaignIdRef?: string;
  channelIdRef: string;
  failureCode: string;
  failureReason: string;
  attemptNumber: number;
  canRetry: boolean;
  occurredAt: string;
}

export interface EnterpriseCommunicationSuppression {
  id: string;
  tenantId: string;
  suppressionCode: string;
  reason: 'MAINTENANCE_WINDOW' | 'DUPLICATE_EVENT' | 'RESOLVED_INCIDENT' | 'OPT_OUT' | 'POLICY_EXCLUSION';
  ruleIdRef?: string;
  recipientUserIdRef?: string;
  channelClassification?: CommunicationChannelClassification;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  isProtectedEmergency: boolean; // Cannot suppress emergency communications
  createdUserIdRef: string;
  createdAt: string;
}

export interface EnterpriseCommunicationException {
  id: string;
  tenantId: string;
  exceptionCode: string;
  title: string;
  policyIdRef: string;
  reason: string;
  approvedByUserIdRef: string;
  effectiveDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface EnterpriseOfficialNotice {
  id: string;
  tenantId: string;
  campusId?: string;
  noticeNumber: string;
  issuingAuthority: string;
  title: string;
  publicationDate: string;
  effectiveDate: string;
  expiryDate?: string;
  audienceIdRef: string;
  documentIdRef?: string;
  recordIdRef?: string;
  caseIdRef?: string;
  incidentIdRef?: string;
  approvalPackageIdRef?: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'EXPIRED' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseEmergencyCommunication {
  id: string;
  tenantId: string;
  campusId?: string;
  emergencyCode: string;
  scenario: 
    | 'CAMPUS_EVACUATION'
    | 'SEVERE_WEATHER'
    | 'FIRE'
    | 'SECURITY_INCIDENT'
    | 'CYBER_INCIDENT'
    | 'INFRASTRUCTURE_OUTAGE'
    | 'PUBLIC_HEALTH'
    | 'MAJOR_DISRUPTION'
    | 'CRISIS_ESCALATION';
  title: string;
  messageBody: string;
  isSandboxSimulation: boolean; // if true -> displays SIMULATION ONLY
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'DRAFT' | 'APPROVAL_PENDING' | 'DISPATCHED' | 'CANCELLED';
  safetyIncidentRef?: string; // Phase 7.64
  businessContinuityRef?: string; // Phase 7.71
  riskRef?: string; // Phase 7.72
  workflowRef?: string; // Phase 8.1
  caseRef?: string; // Phase 8.2
  dispatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseCommunicationSubscription {
  id: string;
  tenantId: string;
  actorUserIdRef: string;
  topicCode: string;
  channelClassification: CommunicationChannelClassification;
  isSubscribed: boolean;
  updatedAt: string;
}

export interface EnterpriseCommunicationIntegrationRef {
  id: string;
  tenantId: string;
  providerCode: string;
  providerName: string;
  channelClassification: CommunicationChannelClassification;
  integrationStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'UNCONFIGURED';
  lastHeartbeat?: string;
  telemetryAvailable: boolean;
}

export interface EnterpriseCommunicationAuditLog {
  id: string;
  tenantId: string;
  campusId?: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  evidenceHash: string; // SHA-256 string
  timestamp: string;
}

export interface EnterpriseCommunicationDiagnostic {
  id: string;
  tenantId: string;
  code: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  affectedRef?: string;
  detectedAt: string;
}

export interface SimulationResult804 {
  scenario: ScenarioType804;
  banner: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  timestamp: string;
  simulatedEventsCount: number;
  deliverySuccessRate: number;
  fallbackChannelsTriggered: string[];
  diagnosticsGenerated: string[];
  summary: string;
}
