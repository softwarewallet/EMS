/**
 * EMS Phase 11.18: Institutional Digital Transformation, Enterprise Architecture,
 * IT Service Management, Technology Operations & Cybersecurity
 * Authoritative strongly typed domain models.
 */

export type ServiceLifecycleStatus = 'DRAFT' | 'DESIGN' | 'APPROVED' | 'ACTIVE' | 'DEGRADED' | 'SUSPENDED' | 'RETIRED';
export type ServiceRequestStatus = 'OPEN' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';
export type IncidentStatus = 'OPEN' | 'TRIAGED' | 'ASSIGNED' | 'INVESTIGATING' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';
export type MajorIncidentStatus = 'DECLARED' | 'RESPONSE' | 'CONTAINMENT' | 'SERVICE_RECOVERY' | 'RESOLVED' | 'POST_INCIDENT_REVIEW' | 'CLOSED';
export type ProblemStatus = 'OPEN' | 'INVESTIGATING' | 'ROOT_CAUSE_IDENTIFIED' | 'REMEDIATION' | 'VERIFIED' | 'CLOSED';
export type ChangeRequestStatus = 'DRAFT' | 'ASSESSMENT' | 'CAB_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTING' | 'VALIDATION' | 'COMPLETED' | 'REJECTED' | 'CANCELLED' | 'ROLLED_BACK';
export type EmergencyChangeStatus = 'REQUESTED' | 'EMERGENCY_AUTHORIZATION' | 'IMPLEMENTING' | 'VALIDATION' | 'COMPLETED' | 'POST_REVIEW';
export type ReleaseStatus = 'PLANNED' | 'APPROVED' | 'STAGED' | 'DEPLOYING' | 'VALIDATING' | 'RELEASED' | 'FAILED' | 'ROLLED_BACK';
export type ArchitectureDecisionStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'SUPERSEDED' | 'ARCHIVED';
export type SecurityIncidentStatus = 'DETECTED' | 'TRIAGED' | 'CONTAINMENT' | 'ERADICATION' | 'RECOVERY' | 'VALIDATION' | 'CLOSED';
export type VulnerabilityStatus = 'OPEN' | 'IN_PROGRESS' | 'MITIGATED' | 'REMEDIATED' | 'VERIFIED' | 'CLOSED';
export type AccessRequestStatus = 'REQUESTED' | 'APPROVED' | 'PROVISIONED' | 'EXPIRED' | 'REVOKED' | 'REJECTED';
export type RecoveryExerciseStatus = 'PLANNED' | 'EXECUTING' | 'COMPLETED' | 'REVIEWED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ChangeRiskLevel = 'STANDARD' | 'NORMAL' | 'HIGH_RISK' | 'EMERGENCY';

export interface TechnologyService {
  serviceId: string;
  tenantId: string;
  campusIdRef?: string;
  name: string;
  description: string;
  status: ServiceLifecycleStatus;
  ownerUserIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  requestId: string;
  tenantId: string;
  requesterUserIdRef: string;
  serviceIdRef: string;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  assignedUserIdRef?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ITIncident {
  incidentId: string;
  tenantId: string;
  title: string;
  description: string;
  serviceIdRef: string;
  status: IncidentStatus;
  priority: PriorityLevel;
  assignedUserIdRef?: string;
  reporterUserIdRef: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ChangeRequest {
  changeId: string;
  tenantId: string;
  title: string;
  description: string;
  serviceIdRef: string;
  riskLevel: ChangeRiskLevel;
  status: ChangeRequestStatus | EmergencyChangeStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  executorUserIdRef?: string;
  rollbackPlan?: string;
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
}

export interface ReleaseRecord {
  releaseId: string;
  tenantId: string;
  title: string;
  version: string;
  status: ReleaseStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
  releasedAt?: string;
}

export interface EnterpriseApplication {
  applicationId: string;
  tenantId: string;
  name: string;
  description: string;
  businessOwnerUserIdRef: string;
  technicalOwnerUserIdRef: string;
  criticality: PriorityLevel;
  status: 'ACTIVE' | 'RETIRED';
}

export interface TechnologyIntegration {
  integrationId: string;
  tenantId: string;
  sourceApplicationIdRef: string;
  targetApplicationIdRef: string;
  protocol: string;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED';
  ownerUserIdRef: string;
}

export interface ArchitectureDecisionRecord {
  adrId: string;
  tenantId: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  status: ArchitectureDecisionStatus;
  authorUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
}

export interface PrivilegedAccessRequest {
  accessId: string;
  tenantId: string;
  requesterUserIdRef: string;
  targetSystemIdRef: string; // Application or Infrastructure ref
  justification: string;
  status: AccessRequestStatus;
  approverUserIdRef?: string;
  expiryDate: string;
  createdAt: string;
}

export interface CybersecurityIncident {
  securityIncidentId: string;
  tenantId: string;
  title: string;
  severity: PriorityLevel;
  status: SecurityIncidentStatus;
  affectedAssetIdRef: string;
  reporterUserIdRef: string;
  resolverUserIdRef?: string;
  verifierUserIdRef?: string; // For four-eyes closure
  createdAt: string;
  closedAt?: string;
}

export interface VulnerabilityFinding {
  vulnerabilityId: string;
  tenantId: string;
  title: string;
  severity: PriorityLevel;
  affectedAssetIdRef: string;
  status: VulnerabilityStatus;
  remediationOwnerUserIdRef: string;
  verifierUserIdRef?: string;
  createdAt: string;
}

export interface SecurityException {
  exceptionId: string;
  tenantId: string;
  title: string;
  businessJustification: string;
  riskReference: string;
  status: 'REQUESTED' | 'APPROVED' | 'EXPIRED' | 'CLOSED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  expiryDate: string;
  createdAt: string;
}

export interface DisasterRecoveryExercise {
  exerciseId: string;
  tenantId: string;
  planIdRef: string;
  title: string;
  status: RecoveryExerciseStatus;
  executorUserIdRef: string;
  certifierUserIdRef?: string; // Four-eyes
  createdAt: string;
}

export interface TechnologyAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  actorUserIdRef: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  correlationId: string;
  idempotencyKey?: string;
  payloadDigest: string;
}

export interface SimulationScenario {
  scenarioId: string;
  scenarioType: string;
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}
