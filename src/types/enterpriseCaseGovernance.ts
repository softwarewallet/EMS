export type EnterpriseCaseStatus = 
  | 'NEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'ESCALATED'
  | 'RESOLUTION_REVIEW'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type EnterpriseCasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
export type EnterpriseCaseSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL' | 'CATASTROPHIC';
export type EnterpriseCaseType = 'INCIDENT' | 'COMPLIANCE' | 'RISK' | 'AUDIT_FINDING' | 'ACADEMIC_GOVERNANCE' | 'OPERATIONAL' | 'SAFETY' | 'EXECUTIVE_DECISION' | 'GENERAL';

export type EnterpriseTaskStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED';

export type EnterpriseActionStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED' | 'CANCELLED';

export type EnterpriseSLAStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'PAUSED' | 'COMPLETED';

export type EnterpriseEscalationLevel = 
  | 'LEVEL_0' // NORMAL
  | 'LEVEL_1' // OPERATIONAL
  | 'LEVEL_2' // MANAGEMENT
  | 'LEVEL_3' // EXECUTIVE
  | 'LEVEL_4'; // CRITICAL / COMMAND CENTER

export type EnterpriseQueueType = 'USER' | 'DEPARTMENT' | 'ROLE' | 'CAMPUS' | 'EXECUTIVE' | 'CRITICAL_RESPONSE';

export type EnterpriseExceptionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface EnterpriseCaseAssignment {
  assignedUserIdRef?: string;
  assignedRoleIdRef?: string;
  assignedDepartmentIdRef?: string;
  assignedCampusIdRef?: string;
  assignedAt: string;
  assignedByUserIdRef: string;
  previousAssignedUserIdRef?: string;
}

export interface EnterpriseCaseRelationship {
  id: string;
  targetCaseIdRef: string;
  relationshipType: 'PARENT' | 'CHILD' | 'RELATED' | 'BLOCKS' | 'BLOCKED_BY' | 'DUPLICATE_OF';
  createdAt: string;
}

export interface EnterpriseCase {
  id: string;
  tenantId: string;
  campusId?: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: EnterpriseCaseType;
  priority: EnterpriseCasePriority;
  severity: EnterpriseCaseSeverity;
  status: EnterpriseCaseStatus;
  confidentialityLevel: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL' | 'STRICTLY_CONFIDENTIAL';
  
  // Reference-only identifiers (No master data duplication)
  sourceModuleIdRef: string;
  sourceRecordIdRef: string;
  workflowInstanceIdRef?: string;
  entityIdRef?: string;
  departmentIdRef?: string;
  contractIdRef?: string;
  riskIdRef?: string;
  complianceRecordIdRef?: string;
  incidentIdRef?: string;
  studentRecordIdRef?: string;
  projectIdRef?: string;
  vendorIdRef?: string;

  ownerUserIdRef: string;
  assignment?: EnterpriseCaseAssignment;
  relationships: EnterpriseCaseRelationship[];
  
  slaPolicyIdRef?: string;
  slaStatus: EnterpriseSLAStatus;
  slaDueDate?: string;
  slaBreachedAt?: string;

  escalationLevel: EnterpriseEscalationLevel;

  resolutionSummary?: string;
  resolvedAt?: string;
  closedAt?: string;
  archivedAt?: string;
  closureVerificationRequired: boolean;
  closureVerifiedByUserIdRef?: string;

  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseTaskDependency {
  id: string;
  dependsOnTaskIdRef: string;
  dependencyType: 'FINISH_TO_START' | 'START_TO_START' | 'FINISH_TO_FINISH';
  isCriticalPath: boolean;
}

export interface EnterpriseTaskAssignment {
  assignedUserIdRef?: string;
  assignedRoleIdRef?: string;
  assignedDepartmentIdRef?: string;
  assignedAt: string;
  assignedByUserIdRef: string;
  delegatedFromUserIdRef?: string;
}

export interface EnterpriseTask {
  id: string;
  tenantId: string;
  campusId?: string;
  caseIdRef?: string;
  workflowInstanceIdRef?: string;
  title: string;
  description: string;
  priority: EnterpriseCasePriority;
  status: EnterpriseTaskStatus;

  assignment?: EnterpriseTaskAssignment;
  dueDate?: string;
  completionEvidenceRef?: string;
  verificationRequired: boolean;
  verifiedByUserIdRef?: string;
  verifiedAt?: string;

  dependencies: EnterpriseTaskDependency[];
  isBlocked: boolean;
  blockerReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseActionItem {
  id: string;
  tenantId: string;
  campusId?: string;
  actionNumber: string;
  title: string;
  description: string;
  
  // Originating reference
  originType: 'AUDIT_FINDING' | 'COMPLIANCE_FINDING' | 'RISK_MITIGATION' | 'CAPA' | 'INCIDENT' | 'SAFETY_FINDING' | 'ACCREDITATION' | 'PROCUREMENT' | 'CONTRACT' | 'STRATEGIC' | 'EMERGENCY';
  originRecordIdRef: string;

  ownerUserIdRef: string;
  responsibleUserIdRef: string;
  accountableAuthorityUserIdRef: string;
  supportingUserIdsRef: string[];

  dueDate: string;
  priority: EnterpriseCasePriority;
  status: EnterpriseActionStatus;

  evidenceReferenceId?: string;
  verificationStatus: 'NOT_REQUIRED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedByUserIdRef?: string;
  verificationNotes?: string;
  closureRationale?: string;

  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseActionVerification {
  id: string;
  actionIdRef: string;
  verifierUserIdRef: string;
  verificationResult: 'APPROVED' | 'REJECTED';
  verificationNotes: string;
  evidenceRef?: string;
  verifiedAt: string;
}

export interface EnterpriseSLATier {
  tierName: string;
  priority: EnterpriseCasePriority;
  targetResponseHours: number;
  targetResolutionHours: number;
  gracePeriodHours: number;
}

export interface EnterpriseSLAPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  workingHoursStart: string; // e.g. "08:00"
  workingHoursEnd: string;   // e.g. "17:00"
  weekendIncluded: boolean;
  tiers: EnterpriseSLATier[];
  createdAt: string;
}

export interface EnterpriseSLAObservation {
  id: string;
  tenantId: string;
  entityType: 'CASE' | 'TASK' | 'ACTION';
  entityIdRef: string;
  policyIdRef: string;
  status: EnterpriseSLAStatus;
  timeElapsedHours: number;
  timeRemainingHours: number;
  targetDueDate: string;
  isPaused: boolean;
  pausedAt?: string;
  resumedAt?: string;
}

export interface EnterpriseEscalationPolicy {
  id: string;
  tenantId: string;
  name: string;
  triggerCondition: 'SLA_BREACH' | 'HIGH_SEVERITY' | 'CRITICAL_RISK' | 'REPEATED_REASSIGNMENT' | 'UNRESOLVED_DEPENDENCY' | 'SAFETY_ISSUE' | 'REGULATORY_DEADLINE';
  escalateToLevel: EnterpriseEscalationLevel;
  targetRoleIdRef?: string;
  targetUserIdRef?: string;
}

export interface EnterpriseEscalationEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  caseIdRef?: string;
  taskIdRef?: string;
  actionIdRef?: string;
  trigger: string;
  previousLevel: EnterpriseEscalationLevel;
  newLevel: EnterpriseEscalationLevel;
  reason: string;
  actorUserIdRef: string;
  idempotencyKey: string;
  resolved: boolean;
  resolutionNotes?: string;
  auditHash: string;
  createdAt: string;
}

export interface EnterpriseAssignmentRule {
  id: string;
  tenantId: string;
  name: string;
  caseType?: EnterpriseCaseType;
  priority?: EnterpriseCasePriority;
  targetQueueIdRef: string;
  assignedRoleIdRef?: string;
  assignedUserIdRef?: string;
  isActive: boolean;
}

export interface EnterpriseWorkQueue {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  queueType: EnterpriseQueueType;
  departmentIdRef?: string;
  roleIdRef?: string;
  memberUserIdsRef: string[];
  maxCapacity?: number;
  currentWorkload: number;
  isActive: boolean;
}

export interface EnterpriseGovernanceException {
  id: string;
  tenantId: string;
  campusId?: string;
  exceptionNumber: string;
  title: string;
  businessRationale: string;
  riskJustification: string;
  compensatingControl: string;
  
  requesterUserIdRef: string;
  independentApproverUserIdRef?: string;

  effectiveDate: string;
  expiryDate: string; // Cannot be indefinite
  reviewDate: string;

  status: EnterpriseExceptionStatus;
  auditHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseEvidenceReference {
  id: string;
  tenantId: string;
  entityType: 'CASE' | 'TASK' | 'ACTION' | 'EXCEPTION' | 'ESCALATION';
  entityIdRef: string;
  title: string;
  evidenceUrl?: string;
  documentHash?: string;
  uploadedByUserIdRef: string;
  uploadedAt: string;
}

export interface EnterpriseCaseDiagnostic {
  id: string;
  issueType: 
    | 'ORPHAN_CASE'
    | 'INVALID_SOURCE_REF'
    | 'STUCK_CASE'
    | 'OVERDUE_TASK'
    | 'SLA_BREACH'
    | 'SLA_APPROACHING_BREACH'
    | 'ESCALATION_FAILURE'
    | 'REPEATED_REASSIGNMENT'
    | 'MISSING_OWNER'
    | 'INVALID_ASSIGNMENT'
    | 'EXPIRED_EXCEPTION'
    | 'MISSING_CLOSURE_EVIDENCE'
    | 'MISSING_VERIFICATION'
    | 'CIRCULAR_DEPENDENCY'
    | 'STALE_BLOCKER'
    | 'SOD_VIOLATION'
    | 'CROSS_TENANT_REF'
    | 'CROSS_CAMPUS_VIOLATION'
    | 'DUPLICATE_ACTION'
    | 'BROKEN_AUDIT_LINEAGE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  entityIdRef: string;
  detectedAt: string;
}

export interface EnterpriseCaseSimulation {
  scenario: 
    | 'SLA_SURGE'
    | 'CASE_VOLUME_SURGE'
    | 'CRITICAL_CASE_ESCALATION'
    | 'STAFF_CAPACITY_REDUCTION'
    | 'MASS_TASK_BACKLOG'
    | 'REGULATORY_DEADLINE_SURGE'
    | 'MULTI_CAMPUS_EVENT'
    | 'SYSTEM_OUTAGE'
    | 'CRITICAL_DEPENDENCY_FAILURE'
    | 'EXECUTIVE_ESCALATION_SURGE'
    | 'REASSIGNMENT_CASCADE'
    | 'CASE_CLOSURE_BACKLOG'
    | 'THIRD_PARTY_DELAY'
    | 'EMERGENCY_RESPONSE_LOAD'
    | 'MULTI_CASE_CASCADE';
  simulatedCaseCount: number;
  predictedSlaBreaches: number;
  predictedEscalations: number;
  capacityBottlenecks: string[];
  impactSummary: string[];
  executedAt: string;
}

export interface EnterpriseCaseAuditLog {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  sourceReference: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey: string;
  previousStateHash?: string;
  newStateHash?: string;
  auditHash: string;
}
