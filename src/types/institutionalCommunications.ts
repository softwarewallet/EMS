/**
 * EMS PHASE 11.11: Institutional Communications, Notifications, Correspondence & Engagement Operations Types
 * Production-grade domain types for institutional communications, notification templates, versioning,
 * multichannel delivery orchestration, campaigns, deterministic audience resolution, preferences,
 * Four-Eyes approvals, formal correspondence management, mandatory acknowledgements, escalations,
 * alerts, announcements, diagnostics scanner, what-if simulations, and SHA-256 tamper-evident audit chaining.
 */

// ============================================================
// 1. CORE DOMAIN ENUMS
// ============================================================

export type CommunicationChannel =
  | 'EMAIL'
  | 'SMS'
  | 'PUSH'
  | 'IN_APP'
  | 'WEB_PORTAL'
  | 'LETTER'
  | 'INTERNAL_MEMO'
  | 'SYSTEM_ALERT';

export type CommunicationPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT'
  | 'CRITICAL';

export type CommunicationStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'DISPATCHING'
  | 'PARTIALLY_DELIVERED'
  | 'DELIVERED'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type AudienceType =
  | 'INDIVIDUAL'
  | 'STUDENTS'
  | 'FACULTY'
  | 'EMPLOYEES'
  | 'DEPARTMENT'
  | 'PROGRAM'
  | 'CAMPUS'
  | 'TENANT'
  | 'COMMITTEE'
  | 'RESEARCH_GROUP'
  | 'CUSTOM_REFERENCE_SET';

export type CampaignStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type TemplateStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'RETIRED';

export type DeliveryStatus =
  | 'QUEUED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'FAILED'
  | 'BOUNCED'
  | 'ACKNOWLEDGED'
  | 'RETRYING';

export type AcknowledgementState =
  | 'PENDING'
  | 'DELIVERED'
  | 'VIEWED'
  | 'ACKNOWLEDGED'
  | 'OVERDUE'
  | 'ESCALATED';

export type CorrespondenceDirection =
  | 'INBOUND'
  | 'OUTBOUND';

export type CorrespondenceStatus =
  | 'DRAFT'
  | 'REGISTERED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESPONSE_PENDING'
  | 'RESPONDED'
  | 'CLOSED'
  | 'ARCHIVED';

export type EscalationLevel =
  | 'LEVEL_1'
  | 'LEVEL_2'
  | 'LEVEL_3'
  | 'EXECUTIVE';

export type AlertSeverity =
  | 'INFO'
  | 'WARNING'
  | 'CRITICAL'
  | 'EMERGENCY_LOCKDOWN'
  | 'WEATHER_ALERT'
  | 'HEALTH_SAFETY';

// ============================================================
// 2. SUPPORTING STRUCTURES & REFERENCES
// ============================================================

export interface ReferenceDisplaySnapshot {
  readonly snapshotTimestamp: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly displayName: string;
  readonly secondaryLabel?: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
}

export interface CommunicationAttachmentRef {
  readonly attachmentId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly fileSizeBytes: number;
  readonly contentSha256: string;
  readonly storageLocationRef: string;
  readonly uploadedAt: string;
  readonly uploadedByUserIdRef: string;
}

export interface TemplateVariableDefinition {
  readonly variableKey: string;
  readonly description: string;
  readonly isRequired: boolean;
  readonly defaultValue?: string;
  readonly sampleValue: string;
}

export interface MultilingualContent {
  readonly languageCode: string; // e.g., 'en', 'hi', 'mr', 'ta'
  readonly subject: string;
  readonly bodyText: string;
  readonly bodyHtml?: string;
}

// ============================================================
// 3. TEMPLATES & VERSIONS
// ============================================================

export interface CommunicationTemplateVersion {
  readonly versionId: string;
  readonly templateIdRef: string;
  readonly versionNumber: number;
  readonly status: TemplateStatus;
  readonly channel: CommunicationChannel;
  readonly supportedLanguages: string[];
  readonly multilingualContents: MultilingualContent[];
  readonly declaredVariables: TemplateVariableDefinition[];
  readonly effectiveFromDate: string;
  readonly effectiveToDate?: string;
  readonly changeSummary: string;
  readonly createdByUserIdRef: string;
  readonly createdAt: string;
  readonly publishedByUserIdRef?: string;
  readonly publishedAt?: string;
  readonly contentChecksumSha256: string;
}

export interface CommunicationTemplate {
  readonly templateId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly defaultChannel: CommunicationChannel;
  readonly category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'FINANCE' | 'FACILITY' | 'SAFETY' | 'RESEARCH' | 'GENERAL';
  readonly currentPublishedVersionNumber?: number;
  readonly status: TemplateStatus;
  readonly isSystemMandatory: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ============================================================
// 4. POLICIES & PREFERENCES
// ============================================================

export interface CommunicationPolicy {
  readonly policyId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly code: string;
  readonly name: string;
  readonly description: string;
  readonly maxFrequencyPerHour: number;
  readonly quietPeriodStart?: string; // '22:00'
  readonly quietPeriodEnd?: string; // '06:00'
  readonly allowEmergencyOverride: boolean;
  readonly defaultRetentionDays: number;
  readonly requireFourEyesForMassBroadcast: boolean;
  readonly massBroadcastThresholdCount: number;
  readonly isActive: boolean;
}

export interface CommunicationPreference {
  readonly preferenceId: string;
  readonly tenantId: string;
  readonly userIdRef: string;
  readonly userType: 'STUDENT' | 'EMPLOYEE' | 'FACULTY' | 'EXTERNAL_STAKEHOLDER';
  readonly preferredChannel: CommunicationChannel;
  readonly fallbackChannel?: CommunicationChannel;
  readonly optOutCategories: string[]; // Cannot contain 'EMERGENCY' or 'MANDATORY_LEGAL'
  readonly preferredLanguage: string;
  readonly quietHoursEnabled: boolean;
  readonly quietHourStart?: string;
  readonly quietHourEnd?: string;
  readonly displaySnapshot?: ReferenceDisplaySnapshot;
  readonly updatedAt: string;
}

// ============================================================
// 5. AUDIENCE & RECIPIENTS
// ============================================================

export interface RecipientFilterCriteria {
  readonly targetAudienceType: AudienceType;
  readonly campusIdRef?: string;
  readonly organizationUnitIdRef?: string;
  readonly programIdRef?: string;
  readonly studentLifecycleStates?: string[];
  readonly employeeCategories?: string[];
  readonly specificUserIds?: string[];
  readonly researchProjectIdRef?: string;
}

export interface CommunicationAudience {
  readonly audienceId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly audienceType: AudienceType;
  readonly audienceName: string;
  readonly description: string;
  readonly filterCriteria: RecipientFilterCriteria;
  readonly resolvedRecipientCount: number;
  readonly deterministicAudienceKey: string;
  readonly resolvedAt: string;
}

export interface CommunicationRecipient {
  readonly recipientId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly audienceIdRef: string;
  readonly communicationIdRef?: string;
  readonly targetUserIdRef: string;
  readonly targetUserType: 'STUDENT' | 'EMPLOYEE' | 'FACULTY' | 'EXTERNAL';
  // Reference-only bindings to upstream modules (Phases 10.1 - 11.10)
  readonly studentIdRef?: string;
  readonly employeeIdRef?: string;
  readonly organizationUnitIdRef?: string;
  readonly programIdRef?: string;
  readonly researchProjectIdRef?: string;
  readonly libraryIdRef?: string;
  readonly financialAccountIdRef?: string;
  readonly destinationEndpoint: string; // Email address / phone number / push token
  readonly resolvedChannel: CommunicationChannel;
  readonly displaySnapshot?: ReferenceDisplaySnapshot;
  readonly isOptedOut: boolean;
  readonly optOutBypassedForSafety: boolean;
}

// ============================================================
// 6. CAMPAIGNS
// ============================================================

export interface CommunicationCampaign {
  readonly campaignId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly code: string;
  readonly title: string;
  readonly objective: string;
  readonly status: CampaignStatus;
  readonly priority: CommunicationPriority;
  readonly primaryChannel: CommunicationChannel;
  readonly alternateChannels: CommunicationChannel[];
  readonly audienceIdRef: string;
  readonly templateIdRef: string;
  readonly templateVersionNumber: number;
  readonly templateVariables: Record<string, string>;
  readonly requiresAcknowledgement: boolean;
  readonly acknowledgementDueDurationHours?: number;
  readonly scheduledStartTime?: string;
  readonly scheduledEndTime?: string;
  readonly totalRecipients: number;
  readonly successfullyDeliveredCount: number;
  readonly failedCount: number;
  readonly acknowledgedCount: number;
  readonly requestedByUserIdRef: string;
  readonly approvedByUserIdRef?: string;
  readonly approvalTimestamp?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ============================================================
// 7. INSTITUTIONAL COMMUNICATIONS & MESSAGES
// ============================================================

export interface InstitutionalCommunication {
  readonly communicationId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly referenceNumber: string;
  readonly title: string;
  readonly summary: string;
  readonly category: 'ANNOUNCEMENT' | 'CIRCULAR' | 'NOTICE' | 'ALERT' | 'CAMPAIGN_BROADCAST' | 'CORRESPONDENCE' | 'DIRECT_MESSAGE';
  readonly channel: CommunicationChannel;
  readonly priority: CommunicationPriority;
  readonly status: CommunicationStatus;
  readonly audienceIdRef: string;
  readonly campaignIdRef?: string;
  readonly templateIdRef?: string;
  readonly templateVersionNumber?: number;
  readonly renderedSubject: string;
  readonly renderedBody: string;
  readonly attachments: CommunicationAttachmentRef[];
  readonly requiresAcknowledgement: boolean;
  readonly acknowledgementDeadline?: string;
  readonly isConfidential: boolean;
  readonly isEmergencyBroadcast: boolean;
  readonly createdByUserIdRef: string;
  readonly createdAt: string;
  readonly scheduledDispatchTime?: string;
  readonly dispatchedAt?: string;
  readonly completedAt?: string;
  readonly cancellationReason?: string;
  readonly cancelledByUserIdRef?: string;
}

export interface CommunicationMessage {
  readonly messageId: string;
  readonly tenantId: string;
  readonly communicationIdRef: string;
  readonly recipientIdRef: string;
  readonly targetUserIdRef: string;
  readonly channel: CommunicationChannel;
  readonly recipientEndpoint: string;
  readonly subject: string;
  readonly contentBody: string;
  readonly deliveryStatus: DeliveryStatus;
  readonly idempotencyKey: string;
  readonly dispatchAttempts: number;
  readonly firstDispatchedAt?: string;
  readonly lastDispatchedAt?: string;
  readonly deliveredAt?: string;
  readonly failedReason?: string;
}

// ============================================================
// 8. DELIVERY, ACKNOWLEDGEMENTS & ESCALATIONS
// ============================================================

export interface CommunicationDelivery {
  readonly deliveryId: string;
  readonly tenantId: string;
  readonly messageIdRef: string;
  readonly communicationIdRef: string;
  readonly recipientIdRef: string;
  readonly channel: CommunicationChannel;
  readonly providerReferenceId?: string;
  readonly deliveryStatus: DeliveryStatus;
  readonly attemptNumber: number;
  readonly dispatchedTimestamp: string;
  readonly deliveryTimestamp?: string;
  readonly failureCode?: string;
  readonly failureMessage?: string;
  readonly isBounced: boolean;
  readonly idempotencyKey: string;
}

export interface CommunicationAcknowledgement {
  readonly acknowledgementId: string;
  readonly tenantId: string;
  readonly communicationIdRef: string;
  readonly messageIdRef: string;
  readonly recipientIdRef: string;
  readonly acknowledgedByUserIdRef: string;
  readonly state: AcknowledgementState;
  readonly deliveredAt?: string;
  readonly viewedAt?: string;
  readonly acknowledgedAt?: string;
  readonly acknowledgementNote?: string;
  readonly isOverdue: boolean;
  readonly isEscalated: boolean;
  readonly displaySnapshot?: ReferenceDisplaySnapshot;
}

export interface CommunicationEscalation {
  readonly escalationId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly communicationIdRef: string;
  readonly acknowledgementIdRef?: string;
  readonly correspondenceIdRef?: string;
  readonly triggerReason: 'NON_ACKNOWLEDGED_CRITICAL' | 'OVERDUE_CORRESPONDENCE' | 'DELIVERY_FAILURE_SURGE' | 'UNRESOLVED_ALERT';
  readonly escalationLevel: EscalationLevel;
  readonly designatedSupervisorUserIdRef: string;
  readonly triggeredAt: string;
  readonly resolvedAt?: string;
  readonly resolutionNote?: string;
  readonly status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
}

// ============================================================
// 9. SCHEDULES & FOUR-EYES APPROVALS
// ============================================================

export interface CommunicationSchedule {
  readonly scheduleId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly entityType: 'COMMUNICATION' | 'CAMPAIGN';
  readonly entityIdRef: string;
  readonly scheduledDispatchTime: string;
  readonly expiryTime?: string;
  readonly isRecurring: boolean;
  readonly recurrenceCron?: string;
  readonly quietPeriodBypass: boolean;
  readonly isExecuted: boolean;
  readonly executedAt?: string;
  readonly createdByUserIdRef: string;
  readonly createdAt: string;
}

export interface CommunicationApproval {
  readonly approvalId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly entityType: 'COMMUNICATION' | 'CAMPAIGN' | 'ANNOUNCEMENT' | 'ALERT' | 'DISPOSAL';
  readonly entityIdRef: string;
  readonly requestedByUserIdRef: string;
  readonly requestedAt: string;
  readonly justification: string;
  readonly approvedByUserIdRef?: string;
  readonly decisionTimestamp?: string;
  readonly decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  readonly decisionRemarks?: string;
  readonly requiresExecutiveTier: boolean;
}

// ============================================================
// 10. INSTITUTIONAL ANNOUNCEMENTS & ALERTS
// ============================================================

export interface InstitutionalAnnouncement {
  readonly announcementId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly title: string;
  readonly bodyText: string;
  readonly category: 'ACADEMIC_CALENDAR' | 'CONVOCATION' | 'EXAM_SCHEDULE' | 'CAMPUS_LIFE' | 'ADMINISTRATIVE_ORDER' | 'GENERAL';
  readonly priority: CommunicationPriority;
  readonly targetAudienceType: AudienceType;
  readonly organizationUnitIdRef?: string;
  readonly isPinned: boolean;
  readonly publishDate: string;
  readonly expiryDate?: string;
  readonly authorUserIdRef: string;
  readonly approvedByUserIdRef?: string;
  readonly isPublished: boolean;
  readonly createdAt: string;
}

export interface InstitutionalAlert {
  readonly alertId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly alertCode: string;
  readonly headline: string;
  readonly description: string;
  readonly severity: AlertSeverity;
  readonly actionInstructions: string;
  readonly broadcastChannels: CommunicationChannel[];
  readonly isBroadcastActive: boolean;
  readonly issuedAt: string;
  readonly expiresAt?: string;
  readonly issuedByUserIdRef: string;
  readonly authorizedByUserIdRef: string; // Four-Eyes check required
  readonly resolvedAt?: string;
  readonly resolutionRemarks?: string;
}

// ============================================================
// 11. FORMAL CORRESPONDENCE MANAGEMENT
// ============================================================

export interface CorrespondenceRecord {
  readonly correspondenceId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly formalReferenceNumber: string;
  readonly direction: CorrespondenceDirection;
  readonly senderReference: string; // e.g. External Regulator / Govt Ministry / Parent / Student ID
  readonly recipientReference: string;
  readonly subject: string;
  readonly classification: 'REGULATORY_COMPLIANCE' | 'LEGAL_NOTICE' | 'ACADEMIC_PETITION' | 'FACILITY_REQUEST' | 'INTER_INSTITUTIONAL' | 'CONFIDENTIAL_INQUIRY';
  readonly priority: CommunicationPriority;
  readonly status: CorrespondenceStatus;
  readonly responsibleOrganizationUnitIdRef: string;
  readonly assignedOfficerUserIdRef: string;
  readonly receivedOrSentDate: string;
  readonly responseDueDate?: string;
  readonly linkedCaseOrWorkflowRef?: string;
  readonly attachments: CommunicationAttachmentRef[];
  readonly responseSummary?: string;
  readonly closedAt?: string;
  readonly closedByUserIdRef?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// ============================================================
// 12. AUDIT & PROVENANCE (SHA-256)
// ============================================================

export interface CommunicationAuditEvent {
  readonly eventId: string;
  readonly tenantId: string;
  readonly campusIdRef?: string;
  readonly timestamp: string;
  readonly actorUserIdRef: string;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly correlationId: string;
  readonly idempotencyKey?: string;
  readonly previousHash: string;
  readonly currentHash: string;
  readonly payloadSnapshot: string;
}

// ============================================================
// 13. DIAGNOSTICS & WHAT-IF SIMULATIONS
// ============================================================

export interface CommunicationDiagnosticFinding {
  readonly checkId: string;
  readonly category: 'DUPLICATE_DISPATCH' | 'RECIPIENT_INTEGRITY' | 'TEMPLATE_VALIDATION' | 'FOUR_EYES_SOD' | 'TENANT_ISOLATION' | 'SCHEDULE_CONFLICT' | 'AUDIT_INTEGRITY';
  readonly severity: 'PASS' | 'WARNING' | 'ERROR' | 'CRITICAL';
  readonly message: string;
  readonly affectedEntityId?: string;
  readonly diagnosticTimestamp: string;
}

export type CommunicationSimulationScenario =
  | 'MASS_NOTIFICATION_SURGE'
  | 'CAMPUS_WIDE_ALERT'
  | 'MULTI_CAMPUS_CAMPAIGN'
  | 'DELIVERY_PROVIDER_FAILURE'
  | 'EMAIL_BOUNCE_SURGE'
  | 'SMS_FAILURE'
  | 'ACKNOWLEDGEMENT_BACKLOG'
  | 'CRITICAL_ALERT_ESCALATION'
  | 'DUPLICATE_DISPATCH_ATTEMPT'
  | 'CAMPAIGN_CANCELLATION'
  | 'TEMPLATE_VERSION_CONFLICT'
  | 'RECIPIENT_SCOPE_EXPANSION'
  | 'CROSS_TENANT_ATTACK'
  | 'SCHEDULE_COLLISION'
  | 'COMMUNICATION_RECOVERY';

export interface CommunicationSimulationResult {
  readonly scenario: CommunicationSimulationScenario;
  readonly simulatedAt: string;
  readonly simulatedTargetRecipients: number;
  readonly simulatedDeliveriesProjected: number;
  readonly simulatedFailuresEstimated: number;
  readonly simulatedEscalationsTriggered: number;
  readonly simulatedProviderThroughputSec: number;
  readonly simulatedZeroMutationVerified: boolean;
  readonly logMessages: string[];
  readonly outcome: 'COMPLETED_SUCCESS' | 'CONTAINED_WARNING' | 'SIMULATED_FAILURE_DEFECT_DETECTED';
}
