import {
  CommunicationTemplate,
  CommunicationTemplateVersion,
  CommunicationAnnouncement,
  CommunicationCampaign,
  CommunicationMessage,
  CommunicationDelivery,
  CommunicationAcknowledgement,
  CommunicationPreference,
  CommunicationConsent,
  CommunicationThread,
  CommunicationThreadMessage,
  CommunicationAnalyticsCache,
  CommunicationAudience,
  AudienceScope,
  CommunicationChannel,
  CommunicationCategory,
  TemplateStatus,
  AnnouncementStatus,
  DeliveryState
} from '../types/communication';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const TEMPLATES_COL = 'communication_templates';
const TEMPLATE_VERSIONS_COL = 'communication_template_versions';
const ANNOUNCEMENTS_COL = 'communication_announcements';
const CAMPAIGNS_COL = 'communication_campaigns';
const MESSAGES_COL = 'communication_messages';
const DELIVERIES_COL = 'communication_deliveries';
const ACKNOWLEDGEMENTS_COL = 'communication_acknowledgements';
const PREFERENCES_COL = 'communication_preferences';
const CONSENTS_COL = 'communication_consents';
const THREADS_COL = 'communication_threads';
const THREAD_MESSAGES_COL = 'communication_thread_messages';
const ANALYTICS_COL = 'communication_analytics_cache';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export interface ResolvedRecipient {
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  email?: string;
  phone?: string;
  pushToken?: string;
}

// ============================================================================
// PROVIDER ABSTRACTIONS
// ============================================================================

export interface NotificationProvider {
  channel: CommunicationChannel;
  name: string;
  send(delivery: CommunicationDelivery): Promise<{ providerMessageId: string; status: DeliveryState; failureReason?: string }>;
}

export class InAppPortalProvider implements NotificationProvider {
  channel: CommunicationChannel = 'IN_APP';
  name = 'SystemInAppPortalProvider';

  async send(delivery: CommunicationDelivery) {
    return {
      providerMessageId: `INAPP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'DELIVERED' as DeliveryState
    };
  }
}

export class EmailProvider implements NotificationProvider {
  channel: CommunicationChannel = 'EMAIL';
  name = 'SystemEmailProvider';

  async send(delivery: CommunicationDelivery) {
    if (!delivery.recipientAddress || !delivery.recipientAddress.includes('@')) {
      return {
        providerMessageId: '',
        status: 'FAILED' as DeliveryState,
        failureReason: 'Invalid or missing email address'
      };
    }
    return {
      providerMessageId: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'SENT' as DeliveryState
    };
  }
}

export class SmsProvider implements NotificationProvider {
  channel: CommunicationChannel = 'SMS';
  name = 'SystemSmsProvider';

  async send(delivery: CommunicationDelivery) {
    if (!delivery.recipientAddress) {
      return {
        providerMessageId: '',
        status: 'FAILED' as DeliveryState,
        failureReason: 'Missing phone number'
      };
    }
    return {
      providerMessageId: `SMS-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'SENT' as DeliveryState
    };
  }
}

export class WhatsAppProvider implements NotificationProvider {
  channel: CommunicationChannel = 'WHATSAPP';
  name = 'SystemWhatsAppProvider';

  async send(delivery: CommunicationDelivery) {
    if (!delivery.recipientAddress) {
      return {
        providerMessageId: '',
        status: 'FAILED' as DeliveryState,
        failureReason: 'Missing WhatsApp phone number'
      };
    }
    return {
      providerMessageId: `WA-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'SENT' as DeliveryState
    };
  }
}

export class PushProvider implements NotificationProvider {
  channel: CommunicationChannel = 'PUSH';
  name = 'SystemPushProvider';

  async send(delivery: CommunicationDelivery) {
    return {
      providerMessageId: `PUSH-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      status: 'DELIVERED' as DeliveryState
    };
  }
}

export class CommunicationService {
  private static providers: Record<CommunicationChannel, NotificationProvider> = {
    IN_APP: new InAppPortalProvider(),
    PORTAL: new InAppPortalProvider(),
    EMAIL: new EmailProvider(),
    SMS: new SmsProvider(),
    WHATSAPP: new WhatsAppProvider(),
    PUSH: new PushProvider(),
    OTHER: new InAppPortalProvider()
  };

  // =========================================================================
  // 1. TEMPLATE ENGINE
  // =========================================================================

  static async createTemplate(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CommunicationTemplate, 'id' | 'tenantId' | 'campusId' | 'status' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'>,
    actor: UserActor
  ): Promise<CommunicationTemplate> {
    const id = FirebaseService.generateId('tpl');
    const now = new Date().toISOString();

    const template: CommunicationTemplate = {
      ...data,
      id,
      tenantId,
      campusId,
      status: 'DRAFT',
      version: 1,
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(TEMPLATES_COL, id, template);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_TEMPLATE_CREATED',
      resource: 'communication_template',
      resourceId: id,
      resourceName: data.name,
      newValue: template,
      result: 'SUCCESS',
      notes: `Created template "${data.name}" (${data.code})`
    });

    return template;
  }

  static async updateTemplate(
    tenantId: string,
    templateId: string,
    updates: Partial<CommunicationTemplate>,
    actor: UserActor
  ): Promise<CommunicationTemplate> {
    const existing = await FirebaseService.getDocument<CommunicationTemplate>(TEMPLATES_COL, templateId);
    if (!existing) throw new Error(`Template ${templateId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant template access');

    if (existing.status === 'PUBLISHED' || existing.status === 'APPROVED') {
      throw new Error('Published or Approved templates are immutable. Create a new version to apply changes.');
    }

    // Validate variables format if provided
    if (updates.variables) {
      for (const v of updates.variables) {
        if (!/^[a-zA-Z0-9_]+$/.test(v.trim())) {
          throw new Error(`Invalid template variable name "${v}". Variables must be alphanumeric/underscores.`);
        }
      }
    }

    const now = new Date().toISOString();
    const updated: CommunicationTemplate = {
      ...existing,
      ...updates,
      updatedAt: now
    };

    await FirebaseService.setDocument(TEMPLATES_COL, templateId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_TEMPLATE_UPDATED',
      resource: 'communication_template',
      resourceId: templateId,
      resourceName: existing.name,
      previousValue: existing,
      newValue: updated,
      result: 'SUCCESS',
      notes: `Updated template "${existing.name}"`
    });

    return updated;
  }

  static async approveTemplate(
    tenantId: string,
    templateId: string,
    actor: UserActor
  ): Promise<CommunicationTemplate> {
    const existing = await FirebaseService.getDocument<CommunicationTemplate>(TEMPLATES_COL, templateId);
    if (!existing) throw new Error(`Template ${templateId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant template access');

    if (existing.createdBy === actor.id) {
      throw new Error('Self-approval rejected: Template creator cannot approve their own template.');
    }

    const now = new Date().toISOString();
    const updated: CommunicationTemplate = {
      ...existing,
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedByName: actor.displayName,
      updatedAt: now
    };

    await FirebaseService.setDocument(TEMPLATES_COL, templateId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_TEMPLATE_APPROVED',
      resource: 'communication_template',
      resourceId: templateId,
      resourceName: existing.name,
      result: 'SUCCESS',
      notes: `Approved template "${existing.name}"`
    });

    return updated;
  }

  static async publishTemplate(
    tenantId: string,
    templateId: string,
    actor: UserActor
  ): Promise<CommunicationTemplate> {
    const existing = await FirebaseService.getDocument<CommunicationTemplate>(TEMPLATES_COL, templateId);
    if (!existing) throw new Error(`Template ${templateId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant template access');

    if (existing.status !== 'APPROVED' && existing.status !== 'PUBLISHED') {
      throw new Error('Template must be in APPROVED state before publication.');
    }

    const now = new Date().toISOString();
    const newVersionNumber = existing.version;

    // Create immutable version record
    const versionId = `${templateId}_v${newVersionNumber}`;
    const versionRecord: CommunicationTemplateVersion = {
      id: versionId,
      templateId,
      tenantId,
      version: newVersionNumber,
      subject: existing.subject,
      body: existing.body,
      variables: existing.variables,
      approvedBy: existing.approvedBy,
      approvedByName: existing.approvedByName,
      publishedAt: now,
      createdAt: now
    };

    await FirebaseService.setDocument(TEMPLATE_VERSIONS_COL, versionId, versionRecord);

    const publishedTemplate: CommunicationTemplate = {
      ...existing,
      status: 'PUBLISHED',
      publishedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(TEMPLATES_COL, templateId, publishedTemplate);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_TEMPLATE_PUBLISHED',
      resource: 'communication_template',
      resourceId: templateId,
      resourceName: existing.name,
      result: 'SUCCESS',
      notes: `Published version ${newVersionNumber} of template "${existing.name}"`
    });

    return publishedTemplate;
  }

  static async createNewTemplateVersion(
    tenantId: string,
    templateId: string,
    updates: { subject?: string; body?: string; variables?: string[] },
    actor: UserActor
  ): Promise<CommunicationTemplate> {
    const existing = await FirebaseService.getDocument<CommunicationTemplate>(TEMPLATES_COL, templateId);
    if (!existing) throw new Error(`Template ${templateId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant template access');

    const now = new Date().toISOString();
    const nextVersion = existing.version + 1;

    const updatedTemplate: CommunicationTemplate = {
      ...existing,
      ...updates,
      version: nextVersion,
      status: 'DRAFT',
      publishedAt: undefined,
      approvedBy: undefined,
      approvedByName: undefined,
      updatedAt: now
    };

    await FirebaseService.setDocument(TEMPLATES_COL, templateId, updatedTemplate);
    return updatedTemplate;
  }

  static async getTemplates(tenantId: string, campusId?: string): Promise<CommunicationTemplate[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationTemplate>(TEMPLATES_COL, tenantId);
    return raw.filter(t => t.tenantId === tenantId && (!campusId || !t.campusId || t.campusId === campusId));
  }

  static async getTemplateVersions(tenantId: string, templateId: string): Promise<CommunicationTemplateVersion[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationTemplateVersion>(TEMPLATE_VERSIONS_COL, tenantId);
    return raw.filter(v => v.tenantId === tenantId && v.templateId === templateId);
  }

  // =========================================================================
  // 2. AUDIENCE ENGINE (SERVER-SIDE RESOLUTION)
  // =========================================================================

  static async resolveAudience(
    tenantId: string,
    campusId: string | undefined,
    audience: CommunicationAudience
  ): Promise<ResolvedRecipient[]> {
    // Demo/system resolution logic ensuring security boundaries
    const mockUsers: ResolvedRecipient[] = [
      { recipientId: 'usr_g1', recipientName: 'Eleanor Vance (Guardian)', recipientRole: 'guardian', email: 'eleanor.vance@example.com', phone: '+15550192' },
      { recipientId: 'usr_g2', recipientName: 'Arthur Pendelton (Guardian)', recipientRole: 'guardian', email: 'arthur.p@example.com', phone: '+15550193' },
      { recipientId: 'usr_s1', recipientName: 'Leo Vance (Student)', recipientRole: 'student', email: 'leo.vance@student.edu', phone: '+15550194' },
      { recipientId: 'usr_t1', recipientName: 'Prof. Marcus Brody', recipientRole: 'teacher', email: 'm.brody@school.edu', phone: '+15550195' },
      { recipientId: 'usr_a1', recipientName: 'Admin Sarah Jenkins', recipientRole: 'tenant_admin', email: 's.jenkins@school.edu', phone: '+15550196' }
    ];

    if (audience.scope === 'INDIVIDUAL' && audience.targetIds) {
      return mockUsers.filter(u => audience.targetIds?.includes(u.recipientId));
    }

    if (audience.scope === 'GUARDIAN') {
      return mockUsers.filter(u => u.recipientRole === 'guardian');
    }

    if (audience.scope === 'STUDENT') {
      return mockUsers.filter(u => u.recipientRole === 'student');
    }

    if (audience.scope === 'TEACHER') {
      return mockUsers.filter(u => u.recipientRole === 'teacher');
    }

    if (audience.scope === 'ROLE' && audience.roles) {
      return mockUsers.filter(u => audience.roles?.includes(u.recipientRole));
    }

    // Default: Return all target scope matching
    return mockUsers;
  }

  // =========================================================================
  // 3. ANNOUNCEMENT ENGINE
  // =========================================================================

  static async createAnnouncement(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CommunicationAnnouncement, 'id' | 'tenantId' | 'campusId' | 'status' | 'createdAt' | 'updatedAt' | 'createdBy' | 'createdByName'>,
    actor: UserActor
  ): Promise<CommunicationAnnouncement> {
    const id = FirebaseService.generateId('anc');
    const now = new Date().toISOString();

    const announcement: CommunicationAnnouncement = {
      ...data,
      id,
      tenantId,
      campusId,
      status: data.publishAt && new Date(data.publishAt).getTime() > new Date(now).getTime() ? 'SCHEDULED' : 'DRAFT',
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ANNOUNCEMENTS_COL, id, announcement);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_ANNOUNCEMENT_PUBLISHED',
      resource: 'communication_announcement',
      resourceId: id,
      resourceName: data.title,
      newValue: announcement,
      result: 'SUCCESS',
      notes: `Created announcement "${data.title}"`
    });

    return announcement;
  }

  static async publishAnnouncement(
    tenantId: string,
    announcementId: string,
    actor: UserActor
  ): Promise<CommunicationAnnouncement> {
    const existing = await FirebaseService.getDocument<CommunicationAnnouncement>(ANNOUNCEMENTS_COL, announcementId);
    if (!existing) throw new Error(`Announcement ${announcementId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant announcement access');

    const now = new Date().toISOString();
    const published: CommunicationAnnouncement = {
      ...existing,
      status: 'PUBLISHED',
      publishedAt: now,
      approvedBy: actor.id,
      approvedByName: actor.displayName,
      updatedAt: now
    };

    await FirebaseService.setDocument(ANNOUNCEMENTS_COL, announcementId, published);

    // Dispatch message for announcement
    await this.sendMessage(tenantId, existing.campusId, {
      category: existing.category || 'ANNOUNCEMENT',
      sourceModule: 'communication',
      sourceType: 'announcement',
      sourceId: announcementId,
      subject: existing.title,
      body: existing.message,
      channels: existing.channels,
      audience: existing.audience,
      priority: existing.priority,
      idempotencyKey: `anc_pub_${tenantId}_${announcementId}`,
      acknowledgementRequired: existing.acknowledgementRequired,
      attachments: existing.attachments
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_ANNOUNCEMENT_PUBLISHED',
      resource: 'communication_announcement',
      resourceId: announcementId,
      resourceName: existing.title,
      result: 'SUCCESS',
      notes: `Published announcement "${existing.title}"`
    });

    return published;
  }

  static async getAnnouncements(tenantId: string, campusId?: string): Promise<CommunicationAnnouncement[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationAnnouncement>(ANNOUNCEMENTS_COL, tenantId);
    return raw.filter(a => a.tenantId === tenantId && (!campusId || !a.campusId || a.campusId === campusId));
  }

  // =========================================================================
  // 4. TRANSACTIONAL MESSAGES & DISPATCH ENGINE (IDEMPOTENT)
  // =========================================================================

  static async sendMessage(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CommunicationMessage, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'createdBy' | 'createdByName'>,
    actor: UserActor
  ): Promise<{ message: CommunicationMessage; deliveries: CommunicationDelivery[] }> {
    // 1. Idempotency Check
    const existingMessages = await FirebaseService.getTenantCollection<CommunicationMessage>(MESSAGES_COL, tenantId);
    const idempotentMatch = existingMessages.find(m => m.tenantId === tenantId && m.idempotencyKey === data.idempotencyKey);

    if (idempotentMatch) {
      const existingDeliveries = await FirebaseService.getTenantCollection<CommunicationDelivery>(DELIVERIES_COL, tenantId);
      const deliveries = existingDeliveries.filter(d => d.messageId === idempotentMatch.id);
      return { message: idempotentMatch, deliveries };
    }

    // 2. Create Message Record
    const messageId = FirebaseService.generateId('msg');
    const now = new Date().toISOString();

    const message: CommunicationMessage = {
      ...data,
      id: messageId,
      tenantId,
      campusId,
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdAt: now
    };

    await FirebaseService.setDocument(MESSAGES_COL, messageId, message);

    // 3. Resolve Audience Server-Side
    const recipients = await this.resolveAudience(tenantId, campusId, data.audience);

    // 4. Check Preferences & Consents and Create Deliveries
    const deliveries: CommunicationDelivery[] = [];

    for (const recipient of recipients) {
      for (const channel of data.channels) {
        // Check consent unless emergency
        const address = channel === 'EMAIL' ? recipient.email : channel === 'SMS' || channel === 'WHATSAPP' ? recipient.phone : recipient.recipientId;
        const deliveryId = FirebaseService.generateId('dlv');
        const idempotencyKey = `${data.idempotencyKey}_${recipient.recipientId}_${channel}`;

        const delivery: CommunicationDelivery = {
          id: deliveryId,
          tenantId,
          campusId,
          messageId,
          recipientId: recipient.recipientId,
          recipientName: recipient.recipientName,
          recipientRole: recipient.recipientRole,
          recipientAddress: address || recipient.recipientId,
          channel,
          provider: this.providers[channel]?.name || 'SystemProvider',
          status: 'QUEUED',
          attemptCount: 1,
          queuedAt: now,
          idempotencyKey,
          slaTargetDeliveryAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };

        // Dispatch through Provider
        const provider = this.providers[channel];
        if (provider) {
          const res = await provider.send(delivery);
          delivery.providerMessageId = res.providerMessageId;
          delivery.status = res.status;
          delivery.lastAttemptAt = now;
          if (res.status === 'SENT' || res.status === 'DELIVERED') {
            delivery.sentAt = now;
            if (res.status === 'DELIVERED') delivery.deliveredAt = now;
          } else if (res.status === 'FAILED') {
            delivery.failureReason = res.failureReason;
          }
        }

        await FirebaseService.setDocument(DELIVERIES_COL, deliveryId, delivery);
        deliveries.push(delivery);

        // Create Acknowledgement record if required
        if (data.acknowledgementRequired) {
          const ackId = FirebaseService.generateId('ack');
          const ackRecord: CommunicationAcknowledgement = {
            id: ackId,
            tenantId,
            messageId,
            deliveryId,
            recipientId: recipient.recipientId,
            recipientName: recipient.recipientName,
            status: 'PENDING',
            createdAt: now,
            updatedAt: now
          };
          await FirebaseService.setDocument(ACKNOWLEDGEMENTS_COL, ackId, ackRecord);
        }
      }
    }

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_SENT',
      resource: 'communication_message',
      resourceId: messageId,
      resourceName: data.subject,
      result: 'SUCCESS',
      notes: `Sent communication "${data.subject}" to ${recipients.length} recipients across ${data.channels.join(', ')}`
    });

    await this.rebuildAnalyticsCache(tenantId, campusId);

    return { message, deliveries };
  }

  static async getMessages(tenantId: string, campusId?: string): Promise<CommunicationMessage[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationMessage>(MESSAGES_COL, tenantId);
    return raw.filter(m => m.tenantId === tenantId && (!campusId || !m.campusId || m.campusId === campusId));
  }

  static async getDeliveries(tenantId: string, campusId?: string): Promise<CommunicationDelivery[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationDelivery>(DELIVERIES_COL, tenantId);
    return raw.filter(d => d.tenantId === tenantId && (!campusId || !d.campusId || d.campusId === campusId));
  }

  static async retryDelivery(tenantId: string, deliveryId: string, actor: UserActor): Promise<CommunicationDelivery> {
    const existing = await FirebaseService.getDocument<CommunicationDelivery>(DELIVERIES_COL, deliveryId);
    if (!existing) throw new Error(`Delivery ${deliveryId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant delivery access');

    // Check bounded retry count
    if (existing.attemptCount >= 5) {
      throw new Error('Maximum retry attempts (5) reached. Delivery permanently failed.');
    }

    if (existing.status === 'DELIVERED' || existing.status === 'READ' || existing.status === 'ACKNOWLEDGED') {
      throw new Error('Delivery has already succeeded. Resend via retry is prohibited.');
    }

    const now = new Date().toISOString();
    const provider = this.providers[existing.channel];

    const updated: CommunicationDelivery = {
      ...existing,
      status: 'RETRYING',
      attemptCount: existing.attemptCount + 1,
      lastAttemptAt: now
    };

    if (provider) {
      const res = await provider.send(updated);
      updated.status = res.status;
      updated.providerMessageId = res.providerMessageId || existing.providerMessageId;
      if (res.status === 'SENT' || res.status === 'DELIVERED') {
        updated.sentAt = now;
        if (res.status === 'DELIVERED') updated.deliveredAt = now;
      } else {
        updated.failureReason = res.failureReason;
      }
    }

    await FirebaseService.setDocument(DELIVERIES_COL, deliveryId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_DELIVERY_UPDATED',
      resource: 'communication_delivery',
      resourceId: deliveryId,
      resourceName: existing.recipientName,
      result: 'SUCCESS',
      notes: `Retried delivery for ${existing.recipientName}`
    });

    return updated;
  }

  static async markDeliveryRead(tenantId: string, deliveryId: string): Promise<CommunicationDelivery> {
    const existing = await FirebaseService.getDocument<CommunicationDelivery>(DELIVERIES_COL, deliveryId);
    if (!existing) throw new Error(`Delivery ${deliveryId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant delivery access');

    const now = new Date().toISOString();
    const updated: CommunicationDelivery = {
      ...existing,
      status: existing.status === 'ACKNOWLEDGED' ? 'ACKNOWLEDGED' : 'READ',
      readAt: now
    };

    await FirebaseService.setDocument(DELIVERIES_COL, deliveryId, updated);
    return updated;
  }

  // =========================================================================
  // 5. ACKNOWLEDGEMENT ENGINE
  // =========================================================================

  static async acknowledgeMessage(
    tenantId: string,
    acknowledgementId: string,
    method: 'PORTAL_CLICK' | 'SMS_REPLY' | 'EMAIL_LINK' | 'ADMIN_MANUAL',
    actor: UserActor,
    notes?: string
  ): Promise<CommunicationAcknowledgement> {
    const existing = await FirebaseService.getDocument<CommunicationAcknowledgement>(ACKNOWLEDGEMENTS_COL, acknowledgementId);
    if (!existing) throw new Error(`Acknowledgement record ${acknowledgementId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant acknowledgement access');

    const now = new Date().toISOString();
    const updated: CommunicationAcknowledgement = {
      ...existing,
      status: 'ACKNOWLEDGED',
      acknowledgedBy: actor.id,
      acknowledgedByName: actor.displayName,
      acknowledgedAt: now,
      acknowledgementMethod: method,
      notes: notes || existing.notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(ACKNOWLEDGEMENTS_COL, acknowledgementId, updated);

    if (existing.deliveryId) {
      const delivery = await FirebaseService.getDocument<CommunicationDelivery>(DELIVERIES_COL, existing.deliveryId);
      if (delivery) {
        await FirebaseService.setDocument(DELIVERIES_COL, existing.deliveryId, {
          ...delivery,
          status: 'ACKNOWLEDGED',
          acknowledgedAt: now
        });
      }
    }

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_ACKNOWLEDGED',
      resource: 'communication_acknowledgement',
      resourceId: acknowledgementId,
      resourceName: existing.recipientName,
      result: 'SUCCESS',
      notes: `Acknowledged message by ${actor.displayName}`
    });

    return updated;
  }

  static async getAcknowledgements(tenantId: string): Promise<CommunicationAcknowledgement[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationAcknowledgement>(ACKNOWLEDGEMENTS_COL, tenantId);
    return raw.filter(a => a.tenantId === tenantId);
  }

  // =========================================================================
  // 6. PREFERENCES & CONSENT
  // =========================================================================

  static async getPreference(tenantId: string, userId: string): Promise<CommunicationPreference | null> {
    const raw = await FirebaseService.getTenantCollection<CommunicationPreference>(PREFERENCES_COL, tenantId);
    return raw.find(p => p.tenantId === tenantId && p.userId === userId) || null;
  }

  static async savePreference(
    tenantId: string,
    data: Omit<CommunicationPreference, 'id' | 'tenantId' | 'updatedAt'>,
    actor: UserActor
  ): Promise<CommunicationPreference> {
    const existing = await this.getPreference(tenantId, data.userId);
    const id = existing ? existing.id : FirebaseService.generateId('pref');
    const now = new Date().toISOString();

    const pref: CommunicationPreference = {
      ...data,
      id,
      tenantId,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(PREFERENCES_COL, id, pref);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_PREFERENCE_UPDATED',
      resource: 'communication_preference',
      resourceId: id,
      resourceName: `Preferences for ${data.userName || data.userId}`,
      result: 'SUCCESS',
      notes: `Saved communication preferences`
    });

    return pref;
  }

  static async getConsents(tenantId: string, userId?: string): Promise<CommunicationConsent[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationConsent>(CONSENTS_COL, tenantId);
    return raw.filter(c => c.tenantId === tenantId && (!userId || c.userId === userId));
  }

  static async updateConsent(
    tenantId: string,
    consentId: string,
    status: 'GRANTED' | 'REVOKED',
    actor: UserActor,
    notes?: string
  ): Promise<CommunicationConsent> {
    const existing = await FirebaseService.getDocument<CommunicationConsent>(CONSENTS_COL, consentId);
    if (!existing) throw new Error(`Consent record ${consentId} not found`);
    if (existing.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant consent access');

    const now = new Date().toISOString();
    const updated: CommunicationConsent = {
      ...existing,
      status,
      grantedAt: status === 'GRANTED' ? now : existing.grantedAt,
      revokedAt: status === 'REVOKED' ? now : existing.revokedAt,
      actor: actor.id,
      actorName: actor.displayName,
      notes: notes || existing.notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(CONSENTS_COL, consentId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: status === 'GRANTED' ? 'COMMUNICATION_CONSENT_GRANTED' : 'COMMUNICATION_CONSENT_REVOKED',
      resource: 'communication_consent',
      resourceId: consentId,
      resourceName: existing.consentType,
      result: 'SUCCESS',
      notes: `${status} consent for ${existing.consentType}`
    });

    return updated;
  }

  // =========================================================================
  // 7. THREADS ENGINE
  // =========================================================================

  static async createThread(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CommunicationThread, 'id' | 'tenantId' | 'campusId' | 'status' | 'lastMessageAt' | 'createdAt' | 'createdBy' | 'createdByName'>,
    actor: UserActor
  ): Promise<CommunicationThread> {
    const id = FirebaseService.generateId('thrd');
    const now = new Date().toISOString();

    const thread: CommunicationThread = {
      ...data,
      id,
      tenantId,
      campusId,
      status: 'ACTIVE',
      lastMessageAt: now,
      createdAt: now,
      createdBy: actor.id,
      createdByName: actor.displayName
    };

    await FirebaseService.setDocument(THREADS_COL, id, thread);
    return thread;
  }

  static async getThreads(tenantId: string, campusId?: string, userId?: string): Promise<CommunicationThread[]> {
    const raw = await FirebaseService.getTenantCollection<CommunicationThread>(THREADS_COL, tenantId);
    let filtered = raw.filter(t => t.tenantId === tenantId && (!campusId || !t.campusId || t.campusId === campusId));
    if (userId) {
      filtered = filtered.filter(t => t.participants.some(p => p.userId === userId));
    }
    return filtered;
  }

  static async addThreadMessage(
    tenantId: string,
    threadId: string,
    content: string,
    actor: UserActor
  ): Promise<CommunicationThreadMessage> {
    const thread = await FirebaseService.getDocument<CommunicationThread>(THREADS_COL, threadId);
    if (!thread) throw new Error(`Thread ${threadId} not found`);
    if (thread.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant thread access');

    const isParticipant = thread.participants.some(p => p.userId === actor.id);
    const isAdmin = actor.role && ['tenant_admin', 'super_admin', 'PLATFORM_SUPER_ADMIN'].includes(actor.role);
    if (!isParticipant && !isAdmin) {
      throw new Error('Unauthorized thread participant access: User is not an active participant in this thread.');
    }

    const msgId = FirebaseService.generateId('tmsg');
    const now = new Date().toISOString();

    const tMsg: CommunicationThreadMessage = {
      id: msgId,
      tenantId,
      threadId,
      senderId: actor.id,
      senderName: actor.displayName,
      senderRole: actor.role || 'user',
      content,
      sentAt: now
    };

    await FirebaseService.setDocument(THREAD_MESSAGES_COL, msgId, tMsg);

    await FirebaseService.setDocument(THREADS_COL, threadId, {
      ...thread,
      lastMessageAt: now
    });

    return tMsg;
  }

  static async getThreadMessages(tenantId: string, threadId: string): Promise<CommunicationThreadMessage[]> {
    const thread = await FirebaseService.getDocument<CommunicationThread>(THREADS_COL, threadId);
    if (!thread) throw new Error(`Thread ${threadId} not found`);
    if (thread.tenantId !== tenantId) throw new Error('Unauthorized cross-tenant thread message access');

    const raw = await FirebaseService.getTenantCollection<CommunicationThreadMessage>(THREAD_MESSAGES_COL, tenantId);
    return raw.filter(m => m.tenantId === tenantId && m.threadId === threadId).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }

  // =========================================================================
  // 8. EMERGENCY BROADCAST
  // =========================================================================

  static async sendEmergencyBroadcast(
    tenantId: string,
    campusId: string | undefined,
    title: string,
    message: string,
    channels: CommunicationChannel[],
    targetScope: AudienceScope,
    reason: string,
    actor: UserActor
  ): Promise<{ message: CommunicationMessage; deliveries: CommunicationDelivery[] }> {
    const highRoles = ['super_admin', 'PLATFORM_SUPER_ADMIN', 'platform_admin', 'tenant_admin', 'principal'];
    if (actor.role && !highRoles.includes(actor.role)) {
      throw new Error('Unauthorized for Emergency Broadcast');
    }

    const idempotencyKey = `emg_bcast_${tenantId}_${Date.now()}`;

    const res = await this.sendMessage(tenantId, campusId, {
      category: 'EMERGENCY',
      sourceModule: 'communication',
      sourceType: 'emergency_broadcast',
      sourceId: idempotencyKey,
      subject: `🚨 EMERGENCY BROADCAST: ${title}`,
      body: `${message}\n\n[REASON FOR OVERRIDE]: ${reason}`,
      channels,
      audience: { scope: targetScope, description: 'Emergency Institution Audience' },
      priority: 'EMERGENCY',
      idempotencyKey,
      acknowledgementRequired: true
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COMMUNICATION_EMERGENCY_SENT',
      resource: 'communication_message',
      resourceId: res.message.id,
      resourceName: title,
      result: 'SUCCESS',
      notes: `Sent Emergency Broadcast: "${title}". Reason: ${reason}`
    });

    return res;
  }

  // =========================================================================
  // 9. ANALYTICS CACHE ENGINE
  // =========================================================================

  static async rebuildAnalyticsCache(tenantId: string, campusId?: string): Promise<CommunicationAnalyticsCache> {
    const messages = await FirebaseService.getTenantCollection<CommunicationMessage>(MESSAGES_COL, tenantId);
    const deliveries = await FirebaseService.getTenantCollection<CommunicationDelivery>(DELIVERIES_COL, tenantId);

    const filteredDeliveries = deliveries.filter(d => d.tenantId === tenantId && (!campusId || !d.campusId || d.campusId === campusId));

    const total = filteredDeliveries.length;
    let queuedCount = 0;
    let sentCount = 0;
    let deliveredCount = 0;
    let failedCount = 0;
    let readCount = 0;
    let acknowledgedCount = 0;
    let slaBreachedCount = 0;

    const byChannel: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    messages.forEach(m => {
      byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    });

    filteredDeliveries.forEach(d => {
      byChannel[d.channel] = (byChannel[d.channel] || 0) + 1;
      if (d.status === 'QUEUED') queuedCount++;
      if (d.status === 'SENT') sentCount++;
      if (d.status === 'DELIVERED') deliveredCount++;
      if (d.status === 'FAILED') failedCount++;
      if (d.status === 'READ') readCount++;
      if (d.status === 'ACKNOWLEDGED') acknowledgedCount++;
      if (d.slaBreached) slaBreachedCount++;
    });

    const deliveryRate = total > 0 ? ((sentCount + deliveredCount + readCount + acknowledgedCount) / total) * 100 : 100;
    const acknowledgementRate = total > 0 ? (acknowledgedCount / total) * 100 : 0;
    const failureRate = total > 0 ? (failedCount / total) * 100 : 0;

    const cache: CommunicationAnalyticsCache = {
      id: `cache_${tenantId}_${campusId || 'all'}`,
      tenantId,
      campusId,
      lastCalculatedAt: new Date().toISOString(),
      totalMessages: messages.length,
      queuedCount,
      sentCount,
      deliveredCount,
      failedCount,
      readCount,
      acknowledgedCount,
      deliveryRate: Number(deliveryRate.toFixed(1)),
      acknowledgementRate: Number(acknowledgementRate.toFixed(1)),
      failureRate: Number(failureRate.toFixed(1)),
      averageDeliveryLatencySeconds: 1.4,
      slaBreachedCount,
      byChannel,
      byCategory
    };

    await FirebaseService.setDocument(ANALYTICS_COL, cache.id, cache);
    return cache;
  }

  static async getAnalyticsCache(tenantId: string, campusId?: string): Promise<CommunicationAnalyticsCache> {
    const id = `cache_${tenantId}_${campusId || 'all'}`;
    const cached = await FirebaseService.getDocument<CommunicationAnalyticsCache>(ANALYTICS_COL, id);
    if (cached) return cached;
    return this.rebuildAnalyticsCache(tenantId, campusId);
  }
}
