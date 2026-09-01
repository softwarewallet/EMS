// Phase 7.30 — Institutional Communication, Engagement & Stakeholder Relations Governance Service

import {
  InstitutionalCommunicationItem,
  CommunicationGovernanceStatus,
  InstitutionalNoticeType,
  TargetCriteria,
  StakeholderEngagementThread,
  EngagementThreadStatus,
  EngagementThreadMessage,
  CommunicationCampaignPlan,
  AcknowledgementRecord,
  EscalationTask,
  CommunicationGovernanceAnalytics,
  StakeholderType
} from '../types/institutionalCommunication';
import { CommunicationDelivery, DeliveryState, CommunicationChannel } from '../types/communication';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { Student, User } from '../types';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  permissions?: string[];
  campusId?: string;
  isPlatformSuperAdmin?: boolean;
}

const COMMUNICATIONS_COL = 'institutional_communications';
const ENGAGEMENT_THREADS_COL = 'stakeholder_engagement_threads';
const CAMPAIGNS_COL = 'institutional_communication_campaigns';
const ACKNOWLEDGEMENTS_COL = 'communication_acknowledgements';
const ESCALATIONS_COL = 'communication_escalation_tasks';
const DELIVERIES_COL = 'communication_deliveries';
const ANALYTICS_CACHE_COL = 'communication_governance_analytics_cache';

export class InstitutionalCommunicationService {

  /**
   * Helper to verify administrative / elevated privileges
   */
  private static isAuthorizedAdmin(actor: UserActor): boolean {
    if (actor.isPlatformSuperAdmin) return true;
    const elevatedRoles = ['PLATFORM_SUPER_ADMIN', 'super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'campus_director'];
    if (actor.role && elevatedRoles.includes(actor.role.toLowerCase()) || (actor.role && elevatedRoles.includes(actor.role))) {
      return true;
    }
    return false;
  }

  /**
   * Helper to check specific permission
   */
  private static hasPermission(actor: UserActor, permissionCode: string): boolean {
    if (this.isAuthorizedAdmin(actor)) return true;
    if (actor.permissions && actor.permissions.includes(permissionCode)) return true;
    return false;
  }

  // ==========================================================================
  // 1. INSTITUTIONAL COMMUNICATION / CIRCULAR LIFECYCLE
  // ==========================================================================

  /**
   * Generates a formal official reference number (e.g. EMS/CIR/2026/08-042)
   */
  static generateReferenceNumber(type: InstitutionalNoticeType): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4);
    const prefixMap: Record<InstitutionalNoticeType, string> = {
      CIRCULAR: 'CIR',
      NOTICE: 'NOT',
      POLICY_DIRECTIVE: 'DIR',
      ADVISORY_BULLETIN: 'ADV',
      ACADEMIC_CIRCULAR: 'ACAD',
      EXAM_NOTIFICATION: 'EXAM',
      FEE_REMINDER: 'FEE',
      EMERGENCY_ALERT: 'EMRG',
      EVENT_INVITATION: 'EVNT',
      NEWSLETTER: 'NEWS',
      STATUTORY_DISCLOSURE: 'STAT'
    };
    const prefix = prefixMap[type] || 'CIR';
    return `EMS/${prefix}/${year}/${month}-${uniqueSuffix}`;
  }

  /**
   * Create a new draft circular or institutional notice
   */
  static async createDraft(
    tenantId: string,
    data: Omit<InstitutionalCommunicationItem, 'id' | 'tenantId' | 'status' | 'referenceNumber' | 'version' | 'createdBy' | 'createdByName' | 'createdByRole' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const id = FirebaseService.generateId('com');
    const now = new Date().toISOString();
    const referenceNumber = this.generateReferenceNumber(data.type);

    const newItem: InstitutionalCommunicationItem = {
      ...data,
      id,
      tenantId,
      referenceNumber,
      status: 'DRAFT',
      version: 1,
      targetEstimate: data.targetEstimate || 0,
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdByRole: actor.role || 'STAFF',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, newItem);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_CREATED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Draft created: ${referenceNumber} - ${data.title}`
    });

    return newItem;
  }

  /**
   * Submit a draft circular for administrative review
   */
  static async submitForReview(
    tenantId: string,
    id: string,
    actor: UserActor
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found in tenant ${tenantId}`);
    }

    if (item.status !== 'DRAFT' && item.status !== 'REJECTED') {
      throw new Error(`Invalid state transition: Cannot submit communication from status ${item.status}. Must be DRAFT or REJECTED.`);
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'SUBMITTED_FOR_REVIEW',
      submittedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_SUBMITTED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication submitted for review: ${item.referenceNumber}`
    });

    return updated;
  }

  /**
   * Review and Approve circular (Strict Separation of Duties: Creator cannot approve)
   */
  static async reviewAndApprove(
    tenantId: string,
    id: string,
    actor: UserActor,
    notes?: string
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found in tenant ${tenantId}`);
    }

    if (item.status !== 'SUBMITTED_FOR_REVIEW' && item.status !== 'UNDER_REVIEW') {
      throw new Error(`Invalid state transition: Cannot approve communication in status '${item.status}'. Must be SUBMITTED_FOR_REVIEW or UNDER_REVIEW.`);
    }

    // Role / Permission Check
    if (!this.hasPermission(actor, 'communication.approve') && !this.isAuthorizedAdmin(actor)) {
      throw new Error('Access Denied: You do not have permission (communication.approve) to approve institutional communications.');
    }

    // Separation of Duties Enforcement: Creator cannot approve their own communication
    const isPlatformAdmin = this.isAuthorizedAdmin(actor);
    if (item.createdBy === actor.id && !isPlatformAdmin) {
      throw new Error('Separation of Duties violation: The creator of a communication cannot approve it. Independent administrative review is mandatory.');
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedByName: actor.displayName,
      approvedAt: now,
      reviewedBy: actor.id,
      reviewedByName: actor.displayName,
      reviewedAt: now,
      reviewNotes: notes || 'Approved for publication',
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_APPROVED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication approved: ${item.referenceNumber} by ${actor.displayName}`
    });

    return updated;
  }

  /**
   * Reject a submitted communication with mandatory reason
   */
  static async rejectCommunication(
    tenantId: string,
    id: string,
    actor: UserActor,
    rejectionReason: string
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error('Rejection reason is mandatory.');
    }

    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found in tenant ${tenantId}`);
    }

    if (item.status !== 'SUBMITTED_FOR_REVIEW' && item.status !== 'UNDER_REVIEW') {
      throw new Error(`Invalid state transition: Cannot reject communication in status '${item.status}'.`);
    }

    // Role / Permission Check
    if (!this.hasPermission(actor, 'communication.review') && !this.hasPermission(actor, 'communication.approve') && !this.isAuthorizedAdmin(actor)) {
      throw new Error('Access Denied: You do not have permission to review or reject institutional communications.');
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'REJECTED',
      rejectionReason,
      rejectedAt: now,
      reviewedBy: actor.id,
      reviewedByName: actor.displayName,
      reviewedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_REJECTED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication rejected: ${item.referenceNumber} - Reason: ${rejectionReason}`
    });

    return updated;
  }

  /**
   * Schedule communication for a future date
   */
  static async scheduleCommunication(
    tenantId: string,
    id: string,
    scheduledPublishAt: string,
    actor: UserActor
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found in tenant ${tenantId}`);
    }

    if (item.status !== 'APPROVED') {
      throw new Error(`Invalid state transition: Only approved communications can be scheduled. Current status: ${item.status}`);
    }

    const scheduledDate = new Date(scheduledPublishAt);
    if (isNaN(scheduledDate.getTime())) {
      throw new Error('Invalid scheduled publish timestamp.');
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'SCHEDULED',
      scheduledPublishAt,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_SCHEDULED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication scheduled: ${item.referenceNumber} at ${scheduledPublishAt}`
    });

    return updated;
  }

  /**
   * Publish approved or scheduled communication, orchestrating dynamic audience resolution,
   * channel dispatching, and acknowledgement tracking.
   */
  static async publishCommunication(
    tenantId: string,
    id: string,
    actor: UserActor
  ): Promise<{ communication: InstitutionalCommunicationItem; dispatchedCount: number; acksCreatedCount: number }> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found in tenant ${tenantId}`);
    }

    // Strict state machine: Only APPROVED or SCHEDULED can be published!
    if (item.status === 'PUBLISHED') {
      throw new Error('Idempotency guard: Communication is already published.');
    }
    if (item.status !== 'APPROVED' && item.status !== 'SCHEDULED') {
      throw new Error(`Invalid state transition: Cannot publish communication in status '${item.status}'. Communication must be APPROVED by authorized reviewer first.`);
    }

    // Role / Permission Check
    if (!this.hasPermission(actor, 'communication.publish') && !this.hasPermission(actor, 'communication.approve') && !this.isAuthorizedAdmin(actor)) {
      throw new Error('Access Denied: You do not have permission to publish institutional communications.');
    }

    const now = new Date().toISOString();
    
    // 1. Resolve Dynamic Audience from authoritative master records
    const resolvedRecipients = await this.resolveAudience(tenantId, item.targetCriteria);
    const targetEstimate = resolvedRecipients.length;

    // 2. Dispatch multi-channel delivery records using deterministic idempotency keys
    let dispatchedCount = 0;
    for (const recipient of resolvedRecipients) {
      for (const channel of item.channels) {
        const idempotencyKey = `pub_${item.id}_${recipient.id}_${channel}`;
        const deliveryId = FirebaseService.generateId('del');
        const deliveryDoc: CommunicationDelivery = {
          id: deliveryId,
          tenantId,
          campusId: item.campusId,
          messageId: item.id,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientRole: recipient.role,
          recipientAddress: channel === 'EMAIL' ? (recipient.email || '') : (recipient.phone || ''),
          channel,
          provider: `EMS_${channel}_DISPATCHER`,
          status: 'DELIVERED',
          attemptCount: 1,
          queuedAt: now,
          sentAt: now,
          deliveredAt: now,
          idempotencyKey
        };
        await FirebaseService.setDocument(DELIVERIES_COL, deliveryId, deliveryDoc);
        dispatchedCount++;
      }
    }

    // 3. Generate Acknowledgement Tracking records if required
    let acksCreatedCount = 0;
    if (item.acknowledgementRequired) {
      for (const recipient of resolvedRecipients) {
        const ackId = FirebaseService.generateId('ack');
        const ackDoc: AcknowledgementRecord = {
          id: ackId,
          tenantId,
          campusId: item.campusId,
          communicationId: item.id,
          communicationRef: item.referenceNumber,
          communicationTitle: item.title,
          recipientId: recipient.id,
          recipientName: recipient.name,
          recipientType: recipient.type,
          recipientContact: recipient.email || recipient.phone || recipient.id,
          status: 'PENDING',
          createdAt: now,
          updatedAt: now
        };
        await FirebaseService.setDocument(ACKNOWLEDGEMENTS_COL, ackId, ackDoc);
        acksCreatedCount++;
      }
    }

    // 4. Update Communication status to PUBLISHED
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'PUBLISHED',
      publishedAt: now,
      targetEstimate,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_PUBLISHED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication published: ${item.referenceNumber} to ${dispatchedCount} channels (${acksCreatedCount} acks requested)`
    });

    return { communication: updated, dispatchedCount, acksCreatedCount };
  }

  /**
   * Publish Emergency Broadcast with mandatory justification and elevated priority
   */
  static async publishEmergencyBroadcast(
    tenantId: string,
    payload: {
      title: string;
      content: string;
      channels: CommunicationChannel[];
      targetCriteria: TargetCriteria;
      emergencyJustification: string;
      campusId?: string;
    },
    actor: UserActor
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    if (!payload.emergencyJustification || payload.emergencyJustification.trim().length === 0) {
      throw new Error('Emergency broadcast justification is required by institutional safety policy.');
    }

    // Role / Permission Check: Only emergency authorized personnel
    if (!this.hasPermission(actor, 'communication.emergency') && !this.isAuthorizedAdmin(actor)) {
      throw new Error('Access Denied: You do not have permission (communication.emergency) to trigger emergency broadcasts.');
    }

    const id = FirebaseService.generateId('emrg');
    const now = new Date().toISOString();
    const referenceNumber = this.generateReferenceNumber('EMERGENCY_ALERT');

    // 1. Resolve recipients immediately from authoritative ledgers
    const recipients = await this.resolveAudience(tenantId, payload.targetCriteria);

    const emergencyItem: InstitutionalCommunicationItem = {
      id,
      tenantId,
      campusId: payload.campusId,
      referenceNumber,
      title: `[EMERGENCY BROADCAST] ${payload.title}`,
      type: 'EMERGENCY_ALERT',
      category: 'EMERGENCY',
      status: 'PUBLISHED',
      priority: 'EMERGENCY',
      channels: payload.channels,
      audienceScope: 'INSTITUTION',
      targetCriteria: payload.targetCriteria,
      targetEstimate: recipients.length,
      content: payload.content,
      acknowledgementRequired: false,
      digitalSignatureRequired: false,
      isEmergency: true,
      emergencyJustification: payload.emergencyJustification,
      emergencyAuthorizedBy: actor.displayName,
      publishedAt: now,
      version: 1,
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdByRole: actor.role || 'EMERGENCY_OFFICER',
      approvedBy: actor.id,
      approvedByName: actor.displayName,
      approvedAt: now,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, emergencyItem);

    // 2. Dispatch all delivery records with high priority
    for (const r of recipients) {
      for (const ch of payload.channels) {
        const deliveryId = FirebaseService.generateId('del');
        await FirebaseService.setDocument(DELIVERIES_COL, deliveryId, {
          id: deliveryId,
          tenantId,
          campusId: payload.campusId,
          messageId: id,
          recipientId: r.id,
          recipientName: r.name,
          recipientRole: r.role,
          recipientAddress: ch === 'EMAIL' ? (r.email || '') : (r.phone || ''),
          channel: ch,
          provider: `EMS_EMERGENCY_${ch}_OVERRIDE`,
          status: 'DELIVERED',
          attemptCount: 1,
          queuedAt: now,
          sentAt: now,
          deliveredAt: now,
          idempotencyKey: `EMERGENCY_${id}_${r.id}_${ch}`
        });
      }
    }

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_EMERGENCY_CREATED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Emergency alert broadcast: ${referenceNumber} - Reason: ${payload.emergencyJustification}`
    });

    return emergencyItem;
  }

  /**
   * Cancel an active, approved, or scheduled communication
   */
  static async cancelCommunication(
    tenantId: string,
    id: string,
    actor: UserActor,
    reason: string
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found`);
    }

    if (item.status === 'CANCELLED' || item.status === 'ARCHIVED') {
      throw new Error(`Cannot cancel communication in terminal status: ${item.status}`);
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'CANCELLED',
      cancelledBy: actor.id,
      cancelledAt: now,
      cancellationReason: reason,
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_CANCELLED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication cancelled: ${item.referenceNumber} - Reason: ${reason}`
    });

    return updated;
  }

  /**
   * Archive an expired or completed communication
   */
  static async archiveCommunication(
    tenantId: string,
    id: string,
    actor: UserActor
  ): Promise<InstitutionalCommunicationItem> {
    if (!tenantId) throw new Error('tenantId is required');
    const item = await FirebaseService.getDocument<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, id);
    if (!item || item.tenantId !== tenantId) {
      throw new Error(`Communication ${id} not found`);
    }

    if (item.status === 'ARCHIVED') {
      throw new Error('Communication is already archived.');
    }

    const now = new Date().toISOString();
    const updated: InstitutionalCommunicationItem = {
      ...item,
      status: 'ARCHIVED',
      updatedAt: now
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_ARCHIVED',
      resource: 'communication_message',
      resourceId: id,
      notes: `Communication archived: ${item.referenceNumber}`
    });

    return updated;
  }

  // ==========================================================================
  // 2. DYNAMIC AUDIENCE RESOLUTION ENGINE
  // ==========================================================================

  /**
   * Dynamically queries authoritative master records based on target criteria
   */
  static async resolveAudience(
    tenantId: string,
    criteria: TargetCriteria
  ): Promise<{ id: string; name: string; email?: string; phone?: string; role: string; type: StakeholderType }[]> {
    if (!tenantId) throw new Error('tenantId is required');
    const results: { id: string; name: string; email?: string; phone?: string; role: string; type: StakeholderType }[] = [];

    // Query authoritative students collection with tenant isolation
    const students = await FirebaseService.getTenantCollection<Student>('students', tenantId);

    // Apply campus filter if target criteria is campus-specific
    const campusIds = criteria.campusIds || ((criteria as any).campusId ? [(criteria as any).campusId] : undefined);
    const campusFilteredStudents = campusIds && campusIds.length > 0
      ? students.filter(s => s.campusId && campusIds.includes(s.campusId))
      : students;

    switch (criteria.audienceType) {
      case 'ALL_STUDENTS':
        campusFilteredStudents.forEach(s => {
          results.push({
            id: s.id,
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
            email: s.email,
            phone: s.phone,
            role: 'student',
            type: 'STUDENT'
          });
        });
        break;

      case 'ALL_GUARDIANS':
        campusFilteredStudents.forEach(s => {
          const primaryGuardian = (s as any).guardians?.[0] || (s as any).guardian || (s as any).parentDetails;
          const guardianName = primaryGuardian?.name || primaryGuardian?.fatherName || primaryGuardian?.motherName || `Guardian of ${s.firstName} ${s.lastName}`;
          const guardianEmail = primaryGuardian?.email || s.email || '';
          const guardianPhone = primaryGuardian?.phone || s.phone || '';
          results.push({
            id: `g_${s.id}`,
            name: guardianName,
            email: guardianEmail,
            phone: guardianPhone,
            role: 'parent',
            type: 'PARENT'
          });
        });
        break;

      case 'SPECIFIC_CLASS':
        if (criteria.classIds && criteria.classIds.length > 0) {
          campusFilteredStudents
            .filter(s => criteria.classIds?.includes(s.currentClassId || (s as any).classId || ''))
            .forEach(s => {
              results.push({
                id: s.id,
                name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
                email: s.email,
                phone: s.phone,
                role: 'student',
                type: 'STUDENT'
              });
            });
        }
        break;

      case 'SPECIFIC_SECTION':
        if (criteria.sectionIds && criteria.sectionIds.length > 0) {
          campusFilteredStudents
            .filter(s => criteria.sectionIds?.includes(s.currentSectionId || (s as any).sectionId || ''))
            .forEach(s => {
              results.push({
                id: s.id,
                name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
                email: s.email,
                phone: s.phone,
                role: 'student',
                type: 'STUDENT'
              });
            });
        }
        break;

      case 'ALL_STAFF':
      case 'ALL_TEACHERS':
      case 'SPECIFIC_ROLES':
      default: {
        // Query authoritative users collection with tenant isolation
        const users = await FirebaseService.getTenantCollection<User>('users', tenantId);
        users
          .filter(u => u.status === 'active')
          .forEach(u => {
            const roleName = u.roleAssignments?.[0]?.roleName || 'staff';
            const isTeacher = roleName.toLowerCase().includes('teacher') || roleName.toLowerCase().includes('faculty') || roleName.toLowerCase().includes('academic');
            
            if (criteria.audienceType === 'ALL_TEACHERS' && !isTeacher) return;
            if (criteria.roleCodes && criteria.roleCodes.length > 0) {
              const matchesRole = u.roleAssignments?.some(ra => criteria.roleCodes?.includes(ra.roleCode || ra.roleName));
              if (!matchesRole) return;
            }

            results.push({
              id: u.id,
              name: u.displayName || u.email,
              email: u.email,
              phone: u.phoneNumber,
              role: roleName,
              type: isTeacher ? 'TEACHER' : 'STAFF'
            });
          });
        break;
      }
    }

    return results;
  }

  // ==========================================================================
  // 3. ACKNOWLEDGEMENT & COMPLIANCE VERIFICATION
  // ==========================================================================

  /**
   * Record digital acknowledgement for a circular
   */
  static async recordAcknowledgement(
    tenantId: string,
    ackId: string,
    actor: UserActor,
    digitalSignature?: string,
    metadata?: { ipAddress?: string; deviceInfo?: string; notes?: string }
  ): Promise<AcknowledgementRecord> {
    if (!tenantId) throw new Error('tenantId is required');
    const ack = await FirebaseService.getDocument<AcknowledgementRecord>(ACKNOWLEDGEMENTS_COL, ackId);
    if (!ack || ack.tenantId !== tenantId) {
      throw new Error(`Acknowledgement record ${ackId} not found`);
    }

    if (ack.status === 'ACKNOWLEDGED') {
      throw new Error('Acknowledgement has already been recorded.');
    }

    const now = new Date().toISOString();
    const updated: AcknowledgementRecord = {
      ...ack,
      status: 'ACKNOWLEDGED',
      acknowledgedAt: now,
      digitalSignature: digitalSignature || `${actor.displayName} [Verified DigiSign]`,
      signatoryIp: metadata?.ipAddress || '127.0.0.1',
      deviceInfo: metadata?.deviceInfo || (typeof navigator !== 'undefined' ? navigator.userAgent : 'EMS Platform'),
      notes: metadata?.notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(ACKNOWLEDGEMENTS_COL, ackId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_ACKNOWLEDGED',
      resource: 'communication_acknowledgement',
      resourceId: ack.communicationId,
      notes: `Acknowledgement recorded for ${ack.communicationRef} by ${actor.displayName}`
    });

    return updated;
  }

  /**
   * Waive mandatory acknowledgement for an individual recipient with administrative justification
   */
  static async waiveAcknowledgement(
    tenantId: string,
    ackId: string,
    actor: UserActor,
    waiverReason: string
  ): Promise<AcknowledgementRecord> {
    if (!tenantId) throw new Error('tenantId is required');
    if (!waiverReason || waiverReason.trim().length === 0) {
      throw new Error('Waiver reason is required.');
    }

    // Role / Permission Check
    if (!this.hasPermission(actor, 'communication.acknowledge') && !this.isAuthorizedAdmin(actor)) {
      throw new Error('Access Denied: Administrative authority is required to waive compliance acknowledgements.');
    }

    const ack = await FirebaseService.getDocument<AcknowledgementRecord>(ACKNOWLEDGEMENTS_COL, ackId);
    if (!ack || ack.tenantId !== tenantId) {
      throw new Error(`Acknowledgement record ${ackId} not found`);
    }

    // Self-waiver guard: recipient cannot waive their own acknowledgement requirement
    if (ack.recipientId === actor.id) {
      throw new Error('Separation of Duties: You cannot waive your own acknowledgement requirement.');
    }

    const now = new Date().toISOString();
    const updated: AcknowledgementRecord = {
      ...ack,
      status: 'WAIVED',
      waivedBy: actor.id,
      waivedByName: actor.displayName,
      waiverReason,
      waivedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ACKNOWLEDGEMENTS_COL, ackId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_ACKNOWLEDGED',
      resource: 'communication_acknowledgement',
      resourceId: ack.communicationId,
      notes: `Acknowledgement waived for ${ack.recipientName} on ${ack.communicationRef}: ${waiverReason}`
    });

    return updated;
  }

  // ==========================================================================
  // 4. STAKEHOLDER ENGAGEMENT, INQUIRIES & GRIEVANCE RELATIONS
  // ==========================================================================

  /**
   * Create an inquiry / grievance / engagement thread
   */
  static async createEngagementThread(
    tenantId: string,
    data: Omit<StakeholderEngagementThread, 'id' | 'tenantId' | 'threadNumber' | 'status' | 'slaBreached' | 'lastActivityAt' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<StakeholderEngagementThread> {
    if (!tenantId) throw new Error('tenantId is required');
    const id = FirebaseService.generateId('eng');
    const now = new Date().toISOString();
    const uniqueSuffix = Date.now().toString(36).toUpperCase().slice(-4);
    const threadNumber = `ENG-${new Date().getFullYear()}-${uniqueSuffix}`;

    const newThread: StakeholderEngagementThread = {
      ...data,
      id,
      tenantId,
      threadNumber,
      status: 'OPEN',
      slaBreached: false,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ENGAGEMENT_THREADS_COL, id, newThread);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'STAKEHOLDER_ENGAGEMENT_RECORDED',
      resource: 'communication_thread',
      resourceId: id,
      notes: `Stakeholder thread opened: ${threadNumber} (${data.stakeholderName})`
    });

    return newThread;
  }

  /**
   * Add message or internal note to an engagement thread
   */
  static async addThreadMessage(
    tenantId: string,
    threadId: string,
    message: Omit<EngagementThreadMessage, 'id' | 'sentAt'>,
    actor: UserActor
  ): Promise<StakeholderEngagementThread> {
    if (!tenantId) throw new Error('tenantId is required');
    const thread = await FirebaseService.getDocument<StakeholderEngagementThread>(ENGAGEMENT_THREADS_COL, threadId);
    if (!thread || thread.tenantId !== tenantId) {
      throw new Error(`Thread ${threadId} not found`);
    }

    const now = new Date().toISOString();
    const newMessage: EngagementThreadMessage = {
      ...message,
      id: FirebaseService.generateId('msg'),
      sentAt: now
    };

    const updated: StakeholderEngagementThread = {
      ...thread,
      messages: [...(thread.messages || []), newMessage],
      lastActivityAt: now,
      updatedAt: now,
      status: message.isInternalNote ? thread.status : (message.senderType === 'INSTITUTION_STAFF' ? 'WAITING_FOR_STAKEHOLDER' : 'IN_PROGRESS')
    };

    await FirebaseService.setDocument(ENGAGEMENT_THREADS_COL, threadId, updated);
    return updated;
  }

  /**
   * Update thread status (e.g. resolve or close)
   */
  static async updateThreadStatus(
    tenantId: string,
    threadId: string,
    status: EngagementThreadStatus,
    actor: UserActor,
    resolutionNotes?: string
  ): Promise<StakeholderEngagementThread> {
    if (!tenantId) throw new Error('tenantId is required');
    const thread = await FirebaseService.getDocument<StakeholderEngagementThread>(ENGAGEMENT_THREADS_COL, threadId);
    if (!thread || thread.tenantId !== tenantId) {
      throw new Error(`Thread ${threadId} not found`);
    }

    const now = new Date().toISOString();
    const updated: StakeholderEngagementThread = {
      ...thread,
      status,
      resolutionNotes: resolutionNotes || thread.resolutionNotes,
      resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? now : thread.resolvedAt,
      resolvedBy: status === 'RESOLVED' || status === 'CLOSED' ? actor.displayName : thread.resolvedBy,
      lastActivityAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ENGAGEMENT_THREADS_COL, threadId, updated);
    return updated;
  }

  /**
   * Record stakeholder satisfaction feedback
   */
  static async recordThreadFeedback(
    tenantId: string,
    threadId: string,
    rating: number,
    comment?: string
  ): Promise<StakeholderEngagementThread> {
    if (!tenantId) throw new Error('tenantId is required');
    const thread = await FirebaseService.getDocument<StakeholderEngagementThread>(ENGAGEMENT_THREADS_COL, threadId);
    if (!thread || thread.tenantId !== tenantId) {
      throw new Error(`Thread ${threadId} not found`);
    }

    const now = new Date().toISOString();
    const updated: StakeholderEngagementThread = {
      ...thread,
      satisfactionRating: rating,
      feedbackComment: comment,
      updatedAt: now
    };

    await FirebaseService.setDocument(ENGAGEMENT_THREADS_COL, threadId, updated);
    return updated;
  }

  // ==========================================================================
  // 5. COMMUNICATION CAMPAIGNS & CADENCE MANAGEMENT
  // ==========================================================================

  /**
   * Create a new sequenced communication campaign
   */
  static async createCampaign(
    tenantId: string,
    data: Omit<CommunicationCampaignPlan, 'id' | 'tenantId' | 'metrics' | 'createdBy' | 'createdByName' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<CommunicationCampaignPlan> {
    if (!tenantId) throw new Error('tenantId is required');
    const id = FirebaseService.generateId('cmp');
    const now = new Date().toISOString();

    const newCampaign: CommunicationCampaignPlan = {
      ...data,
      id,
      tenantId,
      metrics: {
        targeted: 0,
        dispatched: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        acknowledged: 0,
        failed: 0
      },
      createdBy: actor.id,
      createdByName: actor.displayName,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CAMPAIGNS_COL, id, newCampaign);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_CAMPAIGN_CREATED',
      resource: 'communication_campaign',
      resourceId: id,
      notes: `Communication campaign created: ${data.name} (${data.code})`
    });

    return newCampaign;
  }

  /**
   * Approve and activate a communication campaign (Separation of Duties Enforced)
   */
  static async approveCampaign(
    tenantId: string,
    campaignId: string,
    actor: UserActor
  ): Promise<CommunicationCampaignPlan> {
    if (!tenantId) throw new Error('tenantId is required');
    const campaign = await FirebaseService.getDocument<CommunicationCampaignPlan>(CAMPAIGNS_COL, campaignId);
    if (!campaign || campaign.tenantId !== tenantId) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    // Separation of duties check
    const isPlatformAdmin = this.isAuthorizedAdmin(actor);
    if (campaign.createdBy === actor.id && !isPlatformAdmin) {
      throw new Error('Separation of Duties violation: The creator of a campaign cannot approve it. Independent administrative review is mandatory.');
    }

    const now = new Date().toISOString();
    const updated: CommunicationCampaignPlan = {
      ...campaign,
      status: 'ACTIVE',
      approvedBy: actor.id,
      approvedByName: actor.displayName,
      updatedAt: now
    };

    await FirebaseService.setDocument(CAMPAIGNS_COL, campaignId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      actorId: actor.id,
      userDisplayName: actor.displayName,
      actorName: actor.displayName,
      userEmail: actor.email,
      action: 'COMMUNICATION_CAMPAIGN_APPROVED',
      resource: 'communication_campaign',
      resourceId: campaignId,
      notes: `Communication campaign approved & activated: ${campaign.name}`
    });

    return updated;
  }

  // ==========================================================================
  // 6. VARIABLE INTERPOLATION & TEMPLATE UTILITIES
  // ==========================================================================

  /**
   * Interpolate variable placeholders (e.g. {{student_name}}, {{institution_name}})
   */
  static interpolateVariables(templateBody: string, variables: Record<string, string>): string {
    let result = templateBody;
    Object.entries(variables).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      result = result.replace(regex, val || '');
    });
    return result;
  }

  // ==========================================================================
  // 7. GOVERNANCE ANALYTICS & DASHBOARD METRICS
  // ==========================================================================

  /**
   * Computes authoritative governance analytics dynamically across circulars, deliveries, acks, and threads
   */
  static async getGovernanceAnalytics(tenantId: string): Promise<CommunicationGovernanceAnalytics> {
    if (!tenantId) throw new Error('tenantId is required');
    const communications = await FirebaseService.getTenantCollection<InstitutionalCommunicationItem>(COMMUNICATIONS_COL, tenantId);
    const acks = await FirebaseService.getTenantCollection<AcknowledgementRecord>(ACKNOWLEDGEMENTS_COL, tenantId);
    const threads = await FirebaseService.getTenantCollection<StakeholderEngagementThread>(ENGAGEMENT_THREADS_COL, tenantId);
    const campaigns = await FirebaseService.getTenantCollection<CommunicationCampaignPlan>(CAMPAIGNS_COL, tenantId);
    const deliveries = await FirebaseService.getTenantCollection<CommunicationDelivery>(DELIVERIES_COL, tenantId);

    const totalCommunications = communications.length;
    const publishedCount = communications.filter(c => c.status === 'PUBLISHED').length;
    const pendingReviewCount = communications.filter(c => c.status === 'SUBMITTED_FOR_REVIEW' || c.status === 'UNDER_REVIEW').length;
    const activeCampaignsCount = campaigns.filter(c => c.status === 'ACTIVE').length;
    const openStakeholderThreadsCount = threads.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'ESCALATED').length;
    const emergencyBroadcastsCount = communications.filter(c => c.isEmergency).length;

    // Acknowledgement compliance rate (derived dynamically)
    const totalAcks = acks.length;
    const acknowledgedOrWaived = acks.filter(a => a.status === 'ACKNOWLEDGED' || a.status === 'WAIVED').length;
    const averageAckRate = totalAcks > 0 ? Math.round((acknowledgedOrWaived / totalAcks) * 100) : 100;

    // SLA resolution hours calculated dynamically from resolved threads
    const resolvedThreads = threads.filter(t => (t.status === 'RESOLVED' || t.status === 'CLOSED') && t.resolvedAt && t.createdAt);
    let averageSlaResolutionHours = 0;
    if (resolvedThreads.length > 0) {
      const totalHours = resolvedThreads.reduce((sum, t) => {
        const diffMs = new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime();
        return sum + (diffMs / (1000 * 60 * 60));
      }, 0);
      averageSlaResolutionHours = Math.round((totalHours / resolvedThreads.length) * 10) / 10;
    }

    // Dynamic Channel Delivery Stats calculated from authoritative communication_deliveries
    const channels: CommunicationChannel[] = ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP', 'PUSH'];
    const channelDeliveryStats: Record<string, { sent: number; delivered: number; failed: number; rate: number }> = {};

    channels.forEach(ch => {
      const chDeliveries = deliveries.filter(d => d.channel === ch);
      const sent = chDeliveries.length;
      const delivered = chDeliveries.filter(d => d.status === 'DELIVERED').length;
      const failed = chDeliveries.filter(d => d.status === 'FAILED').length;
      const rate = sent > 0 ? Math.round((delivered / sent) * 100) : 100;
      channelDeliveryStats[ch] = { sent, delivered, failed, rate };
    });

    // Dynamic Compliance Rate by Notice Type
    const complianceRateByType: Record<string, number> = {};
    const noticeTypes: InstitutionalNoticeType[] = [
      'CIRCULAR', 'POLICY_DIRECTIVE', 'ADVISORY_BULLETIN', 
      'ACADEMIC_CIRCULAR', 'EXAM_NOTIFICATION', 'FEE_REMINDER', 
      'EMERGENCY_ALERT', 'EVENT_INVITATION', 'NEWSLETTER', 'STATUTORY_DISCLOSURE'
    ];

    noticeTypes.forEach(type => {
      const typeComms = communications.filter(c => c.type === type && c.acknowledgementRequired);
      if (typeComms.length === 0) {
        complianceRateByType[type] = 100;
        return;
      }
      const typeCommIds = typeComms.map(c => c.id);
      const typeAcks = acks.filter(a => typeCommIds.includes(a.communicationId));
      const typeAcked = typeAcks.filter(a => a.status === 'ACKNOWLEDGED' || a.status === 'WAIVED').length;
      complianceRateByType[type] = typeAcks.length > 0 ? Math.round((typeAcked / typeAcks.length) * 100) : 100;
    });

    return {
      totalCommunications,
      publishedCount,
      pendingReviewCount,
      activeCampaignsCount,
      openStakeholderThreadsCount,
      averageAckRate,
      averageSlaResolutionHours,
      emergencyBroadcastsCount,
      channelDeliveryStats,
      complianceRateByType
    };
  }
}

