// Phase 7.30 — Institutional Communication, Engagement & Stakeholder Relations Governance Types

import { CommunicationChannel, CommunicationCategory, AudienceScope } from './communication';

export type InstitutionalNoticeType = 
  | 'CIRCULAR'
  | 'NOTICE'
  | 'POLICY_DIRECTIVE'
  | 'ADVISORY_BULLETIN'
  | 'ACADEMIC_CIRCULAR'
  | 'EXAM_NOTIFICATION'
  | 'FEE_REMINDER'
  | 'EMERGENCY_ALERT'
  | 'EVENT_INVITATION'
  | 'NEWSLETTER'
  | 'STATUTORY_DISCLOSURE';

export type CommunicationGovernanceStatus = 
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type TargetAudienceType = 
  | 'ALL_STUDENTS'
  | 'ALL_GUARDIANS'
  | 'ALL_STAFF'
  | 'ALL_TEACHERS'
  | 'SPECIFIC_CAMPUS'
  | 'SPECIFIC_CLASS'
  | 'SPECIFIC_SECTION'
  | 'SPECIFIC_DEPARTMENT'
  | 'SPECIFIC_ROLES'
  | 'CUSTOM_FILTER'
  | 'ALUMNI_NETWORK'
  | 'VENDORS_SUPPLIERS'
  | 'GOVERNMENT_REGULATORS';

export interface TargetCriteria {
  audienceType: TargetAudienceType;
  campusIds?: string[];
  classIds?: string[];
  sectionIds?: string[];
  departmentIds?: string[];
  roleCodes?: string[];
  studentStatus?: string[];
  specificRecipientIds?: string[];
  customFilterDescription?: string;
}

export interface CommunicationAttachmentDoc {
  id: string;
  title: string;
  fileUrl: string;
  fileSize?: string;
  mimeType?: string;
  isSignedDocument?: boolean;
}

export interface InstitutionalCommunicationItem {
  id: string;
  tenantId: string;
  campusId?: string;
  referenceNumber: string; // Official format: e.g. "EMS/CIR/2026/08-042"
  title: string;
  type: InstitutionalNoticeType;
  category: CommunicationCategory;
  status: CommunicationGovernanceStatus;
  priority: 'EMERGENCY' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  channels: CommunicationChannel[];
  audienceScope: AudienceScope;
  targetCriteria: TargetCriteria;
  targetEstimate: number;
  content: string;
  summary?: string;
  attachments?: CommunicationAttachmentDoc[];
  
  // Compliance & Sign-off
  acknowledgementRequired: boolean;
  acknowledgementDeadline?: string;
  digitalSignatureRequired: boolean;
  signatoryName?: string;
  signatoryDesignation?: string;
  signatoryDepartment?: string;
  tags?: string[];
  
  // Emergency Handling
  isEmergency: boolean;
  emergencyJustification?: string;
  emergencyAuthorizedBy?: string;
  
  // Timing & Lifecycle
  scheduledPublishAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  version: number;
  
  // Author & Audit Track
  createdBy: string;
  createdByName: string;
  createdByRole: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

export type StakeholderType = 
  | 'PARENT'
  | 'STUDENT'
  | 'TEACHER'
  | 'STAFF'
  | 'ALUMNI'
  | 'VENDOR'
  | 'GOVERNMENT'
  | 'COMMUNITY';

export type EngagementThreadStatus = 
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_STAKEHOLDER'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED';

export interface EngagementThreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: StakeholderType | 'INSTITUTION_STAFF';
  isInternalNote: boolean;
  content: string;
  attachments?: CommunicationAttachmentDoc[];
  sentAt: string;
}

export interface StakeholderEngagementThread {
  id: string;
  tenantId: string;
  campusId?: string;
  threadNumber: string; // e.g. "ENG-2026-0012"
  category: 'ACADEMIC' | 'FEES_FINANCE' | 'TRANSPORT' | 'HOSTEL' | 'DISCIPLINE' | 'GENERAL_INQUIRY' | 'GRIEVANCE' | 'FACILITIES';
  subject: string;
  stakeholderType: StakeholderType;
  stakeholderId: string;
  stakeholderName: string;
  stakeholderEmail?: string;
  stakeholderPhone?: string;
  studentId?: string;
  studentName?: string;
  
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedDepartment?: string;
  
  status: EngagementThreadStatus;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  slaDeadline: string;
  slaBreached: boolean;
  lastActivityAt: string;
  
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  
  satisfactionRating?: number; // 1 to 5 stars
  feedbackComment?: string;
  
  messages: EngagementThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStage {
  stageNumber: number;
  name: string;
  delayDays: number;
  channel: CommunicationChannel;
  templateId?: string;
  subject: string;
  content: string;
  triggerCondition: string; // e.g. "AFTER_CAMPAIGN_START", "IF_UNACKNOWLEDGED_3_DAYS"
}

export interface CommunicationCampaignPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string; // e.g. "CAMP-2026-ADM-ONBOARD"
  name: string;
  description: string;
  goal: string;
  category: CommunicationCategory;
  status: 'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  stages: CampaignStage[];
  targetAudience: TargetCriteria;
  startDate?: string;
  endDate?: string;
  metrics: {
    targeted: number;
    dispatched: number;
    delivered: number;
    opened: number;
    clicked: number;
    acknowledged: number;
    failed: number;
  };
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcknowledgementRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  communicationId: string;
  communicationRef: string;
  communicationTitle: string;
  recipientId: string;
  recipientName: string;
  recipientType: StakeholderType;
  recipientContact: string; // Email or Phone
  status: 'PENDING' | 'VIEWED' | 'ACKNOWLEDGED' | 'EXPIRED' | 'WAIVED';
  viewedAt?: string;
  acknowledgedAt?: string;
  digitalSignature?: string; // e.g. "John Doe [Verified DigiSign]"
  signatoryIp?: string;
  deviceInfo?: string;
  notes?: string;
  waivedBy?: string;
  waivedByName?: string;
  waiverReason?: string;
  waivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationTask {
  id: string;
  tenantId: string;
  campusId?: string;
  communicationId: string;
  communicationRef: string;
  recipientId: string;
  recipientName: string;
  level: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  triggerReason: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED' | 'OVERRIDDEN';
  escalatedToRole: string;
  escalatedToUserId?: string;
  escalatedToUserName?: string;
  actionTaken?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationGovernanceAnalytics {
  totalCommunications: number;
  publishedCount: number;
  pendingReviewCount: number;
  activeCampaignsCount: number;
  openStakeholderThreadsCount: number;
  averageAckRate: number;
  averageSlaResolutionHours: number;
  emergencyBroadcastsCount: number;
  channelDeliveryStats: Record<string, { sent: number; delivered: number; failed: number; rate: number }>;
  complianceRateByType: Record<string, number>;
}
