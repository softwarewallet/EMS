/**
 * EMS Phase 11.20: Institutional IT Service Management & Technology Operations
 * Strongly typed authoritative domain models.
 */

export type ITSMServiceStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED' | 'ARCHIVED';
export type ITSMRequestStatus = 'SUBMITTED' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING' | 'FULFILLED' | 'RESOLVED' | 'CLOSED';
export type ITSMIncidentStatus = 'NEW' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type ITSMMajorIncidentStatus = 'DECLARED' | 'RESPONSE' | 'CONTAINMENT' | 'SERVICE_RECOVERY' | 'RESOLVED' | 'POST_INCIDENT_REVIEW' | 'CLOSED';
export type ITSMProblemStatus = 'OPEN' | 'INVESTIGATING' | 'ROOT_CAUSE_IDENTIFIED' | 'WORKAROUND_AVAILABLE' | 'REMEDIATION' | 'VERIFIED' | 'CLOSED';
export type ITSMChangeStatus = 'DRAFT' | 'SUBMITTED' | 'ASSESSED' | 'APPROVAL_PENDING' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTING' | 'IMPLEMENTED' | 'VALIDATING' | 'CLOSED';
export type ITSMChangeType = 'STANDARD' | 'NORMAL' | 'EMERGENCY';
export type ITSMMaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ITSMOutageStatus = 'ACTIVE' | 'RESOLVED' | 'CLOSED';
export type ITSMPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ITSMCIType = 'SERVER' | 'NETWORK' | 'STORAGE' | 'APPLICATION' | 'ENDPOINT' | 'SERVICE';
export type ITSMRelationshipType = 'DEPENDS_ON' | 'HOSTS' | 'CONNECTS_TO' | 'PROVIDES' | 'USES' | 'BACKED_BY' | 'LOCATED_IN' | 'RELATED_TO';

export interface ITService {
  serviceId: string;
  tenantId: string;
  name: string;
  description: string;
  categoryIdRef: string;
  status: ITSMServiceStatus;
  businessOwnerUserIdRef: string;
  technicalOwnerUserIdRef: string;
  supportGroupIdRef: string;
  criticality: ITSMPriority;
}

export interface ITServiceRequest {
  requestId: string;
  tenantId: string;
  requesterUserIdRef: string;
  serviceIdRef: string;
  title: string;
  description: string;
  priority: ITSMPriority;
  status: ITSMRequestStatus;
  assignedToUserIdRef?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ITIncident {
  incidentId: string;
  tenantId: string;
  title: string;
  description: string;
  serviceIdRef: string;
  campusIdRef?: string;
  priority: ITSMPriority;
  status: ITSMIncidentStatus;
  reporterUserIdRef: string;
  assignedToUserIdRef?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ITMajorIncident {
  majorIncidentId: string;
  tenantId: string;
  incidentIdRef: string;
  severity: ITSMPriority;
  status: ITSMMajorIncidentStatus;
  commanderUserIdRef: string;
  businessLiaisonUserIdRef: string;
  closureApproverUserIdRef?: string;
  createdAt: string;
  closedAt?: string;
}

export interface ITProblem {
  problemId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: ITSMPriority;
  status: ITSMProblemStatus;
  ownerUserIdRef: string;
  verifierUserIdRef?: string;
  rootCause?: string;
  workaround?: string;
  createdAt: string;
}

export interface ITChangeRequest {
  changeId: string;
  tenantId: string;
  title: string;
  description: string;
  type: ITSMChangeType;
  priority: ITSMPriority;
  status: ITSMChangeStatus;
  serviceIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  executorUserIdRef?: string;
  rollbackPlan?: string;
  createdAt: string;
}

export interface ITConfigurationItem {
  ciId: string;
  tenantId: string;
  name: string;
  ciType: ITSMCIType;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE' | 'OFFLINE' | 'RETIRED' | 'UNKNOWN';
  ownerUserIdRef: string;
}

export interface ITCIRelationship {
  relationshipId: string;
  tenantId: string;
  sourceCiIdRef: string;
  targetCiIdRef: string;
  relationshipType: ITSMRelationshipType;
}

export interface ITMaintenanceWindow {
  windowId: string;
  tenantId: string;
  title: string;
  ciIdRef: string;
  status: ITSMMaintenanceStatus;
  startTime: string;
  endTime: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
}

export interface ITOutage {
  outageId: string;
  tenantId: string;
  serviceIdRef: string;
  status: ITSMOutageStatus;
  startTime: string;
  endTime?: string;
  incidentIdRef?: string;
}

export interface ITSLA {
  slaId: string;
  tenantId: string;
  serviceIdRef: string;
  responseTargetMinutes: number;
  resolutionTargetMinutes: number;
}

export interface ITKnowledgeArticle {
  articleId: string;
  tenantId: string;
  title: string;
  content: string;
  authorUserIdRef: string;
  status: 'DRAFT' | 'PUBLISHED' | 'RETIRED';
  publishedAt?: string;
}

export interface ITDisasterRecoveryExercise {
  exerciseId: string;
  tenantId: string;
  planIdRef: string;
  title: string;
  status: 'PLANNED' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'REVIEWED' | 'CLOSED';
  executorUserIdRef: string;
  verifierUserIdRef?: string;
}

export interface ITAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserIdRef: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  previousHash: string;
  currentHash: string;
  payloadDigest: string;
}
