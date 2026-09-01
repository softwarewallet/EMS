export type StakeholderCategory = 
  | 'STUDENT' | 'PARENT_GUARDIAN' | 'FACULTY' | 'STAFF' | 'ALUMNI' 
  | 'EMPLOYER' | 'INDUSTRY' | 'GOVERNMENT' | 'REGULATOR' 
  | 'ACCREDITATION_BODY' | 'PARTNER' | 'VENDOR' | 'COMMUNITY' 
  | 'MEDIA' | 'DONOR' | 'OTHER';

export type CommunicationClassification = 
  | 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';

export type LifecycleStatus = 
  | 'DRAFT' | 'REVIEW' | 'APPROVAL_PENDING' | 'APPROVED' 
  | 'SCHEDULED' | 'PUBLISHED' | 'WITHDRAWN' | 'SUPERSEDED' | 'ARCHIVED';

export type EngagementLifecycleStatus = 
  | 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Stakeholder {
  id: string;
  tenantId: string;
  campusScope: string;
  referenceId?: string; // authoritative reference to existing EMS record
  category: StakeholderCategory;
  name: string;
  organization?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  strategicRelevance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  communicationPreference?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface StakeholderGroup {
  id: string;
  tenantId: string;
  campusScope: string;
  name: string;
  description: string;
  ownerId: string;
  stakeholderIds: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface StakeholderSegment {
  id: string;
  tenantId: string;
  name: string;
  criteria: Record<string, any>;
  estimatedSize: number;
  lastCalculatedAt: string;
}

export interface StakeholderRelationship {
  id: string;
  tenantId: string;
  sourceStakeholderId: string;
  targetStakeholderId: string;
  relationshipType: string;
  sensitivity: 'STANDARD' | 'SENSITIVE';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StakeholderEngagementPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  objective: string;
  engagementPurpose: string;
  stakeholderGroupIds: string[];
  ownerId: string;
  ownerName: string;
  expectedOutcomes: string;
  actualOutcomes?: string;
  status: EngagementLifecycleStatus;
  createdBy: string;
  createdAt: string;
}

export interface StakeholderEngagementActivity {
  id: string;
  tenantId: string;
  planId: string;
  type: 'MEETING' | 'CONSULTATION' | 'SURVEY' | 'WORKSHOP' | 'TOWN_HALL' | 'EMAIL' | 'NOTICE' | 'EVENT' | 'CALL' | 'FEEDBACK_SESSION' | 'OTHER';
  date: string;
  ownerId: string;
  participants: string[]; // reference ids
  purpose: string;
  outcome?: string;
  followUpActions?: string;
  evidenceId?: string;
  createdAt: string;
}

export interface InstitutionalCommunication {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  purpose: string;
  communicationType: string;
  audience: string[]; // group or segment ids
  classification: CommunicationClassification;
  content: string;
  ownerId: string;
  ownerName: string;
  effectiveDate: string;
  expiryDate?: string;
  evidenceId?: string;
  status: LifecycleStatus;
  version: number;
  createdBy: string;
  createdAt: string;
}

export interface CommunicationVersion {
  id: string;
  tenantId: string;
  communicationId: string;
  version: number;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface CommunicationApproval {
  id: string;
  tenantId: string;
  communicationId: string;
  version: number;
  approverId: string;
  approverName: string;
  decision: 'APPROVED' | 'REJECTED';
  rationale: string;
  approvedAt: string;
}

export interface CommunicationPublication {
  id: string;
  tenantId: string;
  communicationId: string;
  version: number;
  publishedBy: string;
  publishedAt: string;
  channels: string[];
}

export interface Announcement {
  id: string;
  tenantId: string;
  campusScope: string;
  type: 'EMERGENCY' | 'ACADEMIC' | 'ADMINISTRATIVE' | 'STUDENT' | 'STAFF' | 'CAMPUS' | 'REGULATORY' | 'PUBLIC';
  title: string;
  content: string;
  status: LifecycleStatus;
  publishedAt?: string;
  expiresAt?: string;
}

export interface Consultation {
  id: string;
  tenantId: string;
  title: string;
  status: 'OPEN' | 'CLOSED';
  themes?: string;
  actions?: string;
}

export interface StakeholderComplaint {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'SEVERE';
  category: string;
  status: 'RECEIVED' | 'TRIAGED' | 'ASSIGNED' | 'INVESTIGATING' | 'RESPONSE_REQUIRED' | 'RESOLVED' | 'CLOSED';
  ownerId?: string;
  dueDate: string;
  createdAt: string;
}

export interface StakeholderIssue {
  id: string;
  tenantId: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  strategicImpact: string;
  operationalImpact: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  ownerId: string;
  dueDate: string;
  createdAt: string;
}

export interface StakeholderEscalation {
  id: string;
  tenantId: string;
  entityType: 'COMPLAINT' | 'ISSUE' | 'COMMUNICATION' | 'RISK';
  entityId: string;
  reason: string;
  status: 'ESCALATED' | 'ACKNOWLEDGED' | 'RESOLVED';
  idempotencyKey: string;
  createdAt: string;
}

export interface ReputationObservation {
  id: string;
  tenantId: string;
  topic: string;
  source: string;
  date: string;
  direction: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  classification: CommunicationClassification;
}

export interface ReputationSnapshot {
  id: string;
  tenantId: string;
  period: string;
  overallSentiment: number; // 0-100
  trend: 'UP' | 'DOWN' | 'STABLE';
  calculatedAt: string;
}

export interface StakeholderRisk {
  id: string;
  tenantId: string;
  title: string;
  stakeholderGroupId: string;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ownerId: string;
  mitigation: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_PLANNED' | 'MITIGATING' | 'MONITORED' | 'CLOSED';
  dueDate: string;
  createdAt: string;
}

export interface ExecutiveCommunicationDecision {
  id: string;
  tenantId: string;
  title: string;
  recommendation: string;
  riskAssessment: string;
  status: 'PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  proposerId: string;
  approverId?: string;
  createdAt: string;
}

export interface StakeholderDataQualityIssue {
  id: string;
  tenantId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED';
  detectedAt: string;
  entityType: string;
  entityId: string;
  description: string;
  remediation: string;
}

export interface StakeholderAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousState?: any;
  resultingState?: any;
  justification?: string;
  correlationId?: string;
}
