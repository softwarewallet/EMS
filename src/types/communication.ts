// Phase 7.14 Communications, Notifications & Stakeholder Engagement Governance Types

export type CommunicationChannel = 
  | 'IN_APP'
  | 'EMAIL'
  | 'SMS'
  | 'WHATSAPP'
  | 'PUSH'
  | 'PORTAL'
  | 'OTHER';

export type CommunicationCategory = 
  | 'TRANSACTIONAL'
  | 'ANNOUNCEMENT'
  | 'REMINDER'
  | 'ALERT'
  | 'EMERGENCY'
  | 'ACADEMIC'
  | 'ATTENDANCE'
  | 'EXAMINATION'
  | 'RESULT'
  | 'FINANCE'
  | 'TRANSPORT'
  | 'HOSTEL'
  | 'HEALTH_SUPPORT'
  | 'ADMINISTRATIVE'
  | 'SYSTEM'
  | 'OTHER';

export type TemplateStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export interface CommunicationTemplate {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  category: CommunicationCategory;
  channel: CommunicationChannel;
  subject: string;
  body: string;
  variables: string[];
  language: string;
  status: TemplateStatus;
  version: number;
  createdBy: string;
  createdByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationTemplateVersion {
  id: string;
  templateId: string;
  tenantId: string;
  version: number;
  subject: string;
  body: string;
  variables: string[];
  approvedBy?: string;
  approvedByName?: string;
  publishedAt: string;
  createdAt: string;
}

export type AudienceScope = 
  | 'INDIVIDUAL'
  | 'STUDENT'
  | 'GUARDIAN'
  | 'TEACHER'
  | 'STAFF'
  | 'CLASS'
  | 'SECTION'
  | 'CAMPUS'
  | 'INSTITUTION'
  | 'ROLE'
  | 'CUSTOM_AUTHORIZED_GROUP';

export interface CommunicationAudience {
  scope: AudienceScope;
  targetIds?: string[]; // studentIds, classIds, sectionIds, userIds, etc.
  roles?: string[];
  description?: string;
}

export type AnnouncementStatus = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'ARCHIVED';

export interface CommunicationAttachment {
  id: string;
  title: string;
  url: string;
  documentType?: string;
}

export interface CommunicationAnnouncement {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  message: string;
  category?: CommunicationCategory;
  audience: CommunicationAudience;
  priority: 'EMERGENCY' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  channels: CommunicationChannel[];
  publishAt: string;
  expiresAt?: string;
  attachments?: CommunicationAttachment[];
  acknowledgementRequired: boolean;
  status: AnnouncementStatus;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationCampaign {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  templateId?: string;
  category: CommunicationCategory;
  audience: CommunicationAudience;
  channels: CommunicationChannel[];
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  scheduledAt?: string;
  completedAt?: string;
  totalTargeted: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationMessage {
  id: string;
  tenantId: string;
  campusId?: string;
  templateId?: string;
  templateVersion?: number;
  category: CommunicationCategory;
  sourceModule: string; // e.g. 'finance', 'attendance', 'health', 'system'
  sourceType: string;   // e.g. 'invoice', 'absence_alert', 'exam_schedule'
  sourceId: string;
  subject: string;
  body: string;
  channels: CommunicationChannel[];
  audience: CommunicationAudience;
  priority: 'EMERGENCY' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  idempotencyKey: string;
  acknowledgementRequired: boolean;
  attachments?: CommunicationAttachment[];
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export type DeliveryState = 
  | 'QUEUED'
  | 'PROCESSING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'RETRYING'
  | 'CANCELLED'
  | 'SUPPRESSED';

export interface CommunicationDelivery {
  id: string;
  tenantId: string;
  campusId?: string;
  messageId: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  recipientAddress: string;
  channel: CommunicationChannel;
  provider: string;
  providerMessageId?: string;
  status: DeliveryState;
  attemptCount: number;
  queuedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  acknowledgedAt?: string;
  failureCode?: string;
  failureReason?: string;
  lastAttemptAt?: string;
  idempotencyKey: string;
  slaTargetDeliveryAt?: string;
  slaBreached?: boolean;
}

export interface CommunicationAcknowledgement {
  id: string;
  tenantId: string;
  messageId: string;
  deliveryId?: string;
  recipientId: string;
  recipientName: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'EXPIRED' | 'WAIVED';
  acknowledgedBy?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
  acknowledgementMethod?: 'PORTAL_CLICK' | 'SMS_REPLY' | 'EMAIL_LINK' | 'ADMIN_MANUAL';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationPreference {
  id: string;
  tenantId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  channelPreferences: Record<CommunicationChannel, boolean>;
  categoryPreferences: Record<CommunicationCategory, boolean>;
  emergencyOverridePermitted: boolean;
  updatedAt: string;
  updatedBy?: string;
}

export interface CommunicationConsent {
  id: string;
  tenantId: string;
  userId: string;
  studentId?: string;
  guardianId?: string;
  consentType: string; // e.g. 'SMS_NOTIFICATIONS', 'WHATSAPP_UPDATES', 'HEALTH_DISCLOSURE'
  channel: CommunicationChannel;
  status: 'GRANTED' | 'REVOKED';
  grantedAt?: string;
  revokedAt?: string;
  actor: string;
  actorName?: string;
  source: string;
  policyVersion: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationEscalationRule {
  id: string;
  tenantId: string;
  name: string;
  category: CommunicationCategory;
  unacknowledgedTimeoutMinutes: number;
  nextChannel: CommunicationChannel;
  escalateToRoles: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationThreadParticipant {
  userId: string;
  name: string;
  role: string;
}

export interface CommunicationThread {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  category: CommunicationCategory;
  participants: CommunicationThreadParticipant[];
  studentId?: string;
  guardianId?: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  lastMessageAt: string;
  createdAt: string;
  createdBy: string;
  createdByName?: string;
}

export interface CommunicationThreadMessage {
  id: string;
  tenantId: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  attachments?: CommunicationAttachment[];
  sentAt: string;
}

export interface CommunicationAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  lastCalculatedAt: string;
  totalMessages: number;
  queuedCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  readCount: number;
  acknowledgedCount: number;
  deliveryRate: number;
  acknowledgementRate: number;
  failureRate: number;
  averageDeliveryLatencySeconds: number;
  slaBreachedCount: number;
  byChannel: Record<string, number>;
  byCategory: Record<string, number>;
}
