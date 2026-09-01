// EMS Phase 7.37: Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine Types

export type WorkflowLifecycleStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RETIRED';

export type WorkflowInstanceStatus =
  | 'INITIATED'
  | 'IN_PROGRESS'
  | 'PENDING_APPROVAL'
  | 'BLOCKED'
  | 'ESCALATED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type CaseCategory =
  | 'ACADEMIC'
  | 'STUDENT_SUPPORT'
  | 'FINANCE'
  | 'HR'
  | 'RESEARCH'
  | 'GOVERNANCE'
  | 'COMPLIANCE'
  | 'ACCREDITATION'
  | 'QUALITY'
  | 'RISK'
  | 'PRIVACY'
  | 'SECURITY'
  | 'OPERATIONS'
  | 'FACILITIES'
  | 'COMMUNICATION'
  | 'CUSTOM';

export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CaseStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type TaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'WAITING'
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskDependencyType = 'BLOCKS' | 'BLOCKED_BY' | 'RELATED_TO';

export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SKIPPED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ApprovalType =
  | 'SEQUENTIAL'
  | 'PARALLEL'
  | 'ROLE_BASED'
  | 'USER_SPECIFIC'
  | 'DEPARTMENT'
  | 'CAMPUS';

export type EscalationLevel =
  | 'LEVEL_1'
  | 'LEVEL_2'
  | 'LEVEL_3'
  | 'EXECUTIVE'
  | 'EMERGENCY';

export type PrivacyClassification =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'RESTRICTED'
  | 'HIGHLY_CONFIDENTIAL';

export type CampusScopeMode = 'ALL_CAMPUSES' | 'SINGLE_CAMPUS' | 'MULTI_CAMPUS';

export type WorkflowAuditAction =
  | 'WORKFLOW_DEFINITION_CREATED'
  | 'WORKFLOW_VERSION_CREATED'
  | 'WORKFLOW_SUBMITTED'
  | 'WORKFLOW_APPROVED'
  | 'WORKFLOW_ACTIVATED'
  | 'WORKFLOW_SUSPENDED'
  | 'WORKFLOW_RETIRED'
  | 'WORKFLOW_INSTANCE_CREATED'
  | 'WORKFLOW_TRANSITIONED'
  | 'WORKFLOW_APPROVAL_REQUESTED'
  | 'WORKFLOW_APPROVAL_APPROVED'
  | 'WORKFLOW_APPROVAL_REJECTED'
  | 'WORKFLOW_DELEGATION_CREATED'
  | 'WORKFLOW_ESCALATED'
  | 'WORKFLOW_SLA_BREACHED'
  | 'CASE_CREATED'
  | 'CASE_ASSIGNED'
  | 'CASE_REASSIGNED'
  | 'CASE_ESCALATED'
  | 'CASE_RESOLVED'
  | 'CASE_CLOSED'
  | 'TASK_CREATED'
  | 'TASK_ASSIGNED'
  | 'TASK_COMPLETED'
  | 'TASK_ESCALATED'
  | 'TASK_CANCELLED'
  | 'WORKFLOW_EMERGENCY_OVERRIDE'
  | 'WORKFLOW_EVIDENCE_ATTACHED'
  | 'WORKFLOW_ACCESS_DENIED'
  | 'WORKFLOW_CONFIGURATION_CHANGED';

export interface WorkflowAuditMetadata {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

export interface AuthoritativeSourceRef {
  sourceModule: string;
  sourceCollection: string;
  sourceEntityType: string;
  sourceEntityId: string;
  sourceDisplayReference: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN_LIST';
  value: string | number | boolean | string[];
}

export interface WorkflowAction {
  id: string;
  actionType: 'GENERATE_TASK' | 'SEND_NOTIFICATION' | 'TRIGGER_ESCALATION' | 'UPDATE_CASE_STATUS' | 'CALL_MODULE_TRIGGER';
  targetModule?: string;
  targetRole?: string;
  targetUser?: string;
  config: Record<string, string | number | boolean>;
}

export interface WorkflowTrigger {
  id: string;
  triggerType: 'MANUAL' | 'EVENT_BASED' | 'SCHEDULED' | 'SLA_BREACH' | 'CASE_CREATED';
  sourceModule?: string;
  sourceEvent?: string;
  conditions: WorkflowCondition[];
}

export interface WorkflowSLA {
  id: string;
  name: string;
  responseDurationMinutes: number;
  resolutionDurationMinutes: number;
  approvalDurationMinutes: number;
  escalationDurationMinutes: number;
  businessCalendarAware: boolean;
  escalationLevelOnBreach: EscalationLevel;
}

export interface WorkflowStage {
  id: string;
  stageCode: string;
  name: string;
  description: string;
  stageOrder: number;
  isInitialStage: boolean;
  isTerminalStage: boolean;
  requiredPermission: string;
  allowedRoles: string[];
  slaConfig?: WorkflowSLA;
  actionsOnEnter: WorkflowAction[];
  actionsOnExit: WorkflowAction[];
}

export interface WorkflowTransition {
  id: string;
  fromStageId: string;
  toStageId: string;
  fromState: WorkflowInstanceStatus;
  toState: WorkflowInstanceStatus;
  requiredPermission: string;
  allowedRoles: string[];
  conditions: WorkflowCondition[];
  requiredApprovalsCount: number;
  requiresFourEyesCheck: boolean;
  auditAction: WorkflowAuditAction;
}

export interface WorkflowVersion {
  id: string;
  tenantId: string;
  workflowDefinitionId: string;
  versionNumber: number;
  status: WorkflowLifecycleStatus;
  description: string;
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
  triggers: WorkflowTrigger[];
  slaPolicies: WorkflowSLA[];
  approvedBy?: string;
  approvedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  campusScope: CampusScopeMode;
  code: string;
  name: string;
  description: string;
  category: CaseCategory;
  lifecycleStatus: WorkflowLifecycleStatus;
  activeVersionId?: string;
  activeVersionNumber?: number;
  privacyClassification: PrivacyClassification;
  ownerDepartment: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WorkflowInstanceStage {
  id: string;
  stageId: string;
  stageName: string;
  enteredAt: string;
  exitedAt?: string;
  completedBy?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
}

export interface WorkflowApprovalStep {
  id: string;
  stepNumber: number;
  approverRole?: string;
  approverUserId?: string;
  approverDepartment?: string;
  approverCampusId?: string;
  status: ApprovalStatus;
  decisionBy?: string;
  decisionAt?: string;
  comments?: string;
  requiresFourEyes: boolean;
}

export interface WorkflowApproval {
  id: string;
  tenantId: string;
  campusId?: string;
  workflowInstanceId: string;
  caseId?: string;
  stageId: string;
  approvalType: ApprovalType;
  status: ApprovalStatus;
  requesterId: string;
  steps: WorkflowApprovalStep[];
  currentStepIndex: number;
  dueDate: string;
  isEmergencyOverride: boolean;
  overrideReason?: string;
  overrideBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstance {
  id: string;
  tenantId: string;
  campusId?: string;
  campusScope: CampusScopeMode;
  workflowDefinitionId: string;
  workflowVersionId: string;
  versionNumber: number;
  instanceCode: string;
  status: WorkflowInstanceStatus;
  currentStageId: string;
  sourceReference?: AuthoritativeSourceRef;
  initiatedBy: string;
  initiatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  privacyClassification: PrivacyClassification;
  slaDueDate?: string;
  slaBreached: boolean;
  slaBreachedAt?: string;
  currentStageHistory: WorkflowInstanceStage[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDelegation {
  id: string;
  tenantId: string;
  campusId?: string;
  campusScope: CampusScopeMode;
  delegatorUserId: string;
  delegateUserId: string;
  delegatedPermissions: string[];
  categoryScope?: CaseCategory;
  effectiveFrom: string;
  effectiveUntil: string;
  isActive: boolean;
  revokedAt?: string;
  revokedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowEscalation {
  id: string;
  tenantId: string;
  campusId?: string;
  workflowInstanceId?: string;
  caseId?: string;
  taskId?: string;
  escalationLevel: EscalationLevel;
  triggerType: 'SLA_BREACH' | 'CRITICAL_PRIORITY' | 'FAILED_STAGE' | 'REPEATED_REJECTION' | 'RISK_SEVERITY' | 'MANUAL';
  reason: string;
  escalatedToRole?: string;
  escalatedToUserId?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  idempotencyKey: string;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowSLAEvent {
  id: string;
  tenantId: string;
  workflowInstanceId?: string;
  caseId?: string;
  taskId?: string;
  eventType: 'WARNING' | 'BREACH' | 'PAUSED' | 'RESUMED' | 'RESOLVED';
  slaPolicyName: string;
  dueAt: string;
  eventTimestamp: string;
  elapsedMinutes: number;
  remainingMinutes: number;
  breachDurationMinutes: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface WorkflowEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  eventType: string;
  workflowInstanceId?: string;
  caseId?: string;
  actorId: string;
  actorRole: string;
  action: WorkflowAuditAction;
  details: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface CaseAssignment {
  assignedToUserId?: string;
  assignedDepartment?: string;
  assignedCampusId?: string;
  assignedBy: string;
  assignedAt: string;
  reason?: string;
}

export interface CaseParticipant {
  userId: string;
  role: 'PRIMARY_OWNER' | 'ASSIGNED_STAFF' | 'OBSERVER' | 'PARTICIPANT' | 'ESCALATION_AUTHORITY';
  addedBy: string;
  addedAt: string;
}

export interface CaseComment {
  id: string;
  caseId: string;
  authorUserId: string;
  authorName: string;
  content: string;
  isInternalOnly: boolean;
  createdAt: string;
}

export interface CaseEvidence {
  id: string;
  caseId: string;
  documentRegistryId: string;
  evidenceType: string;
  title: string;
  addedBy: string;
  addedAt: string;
  relevance: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface CaseResolution {
  resolvedBy: string;
  resolvedAt: string;
  resolutionCategory: 'COMPLETED_SUCCESS' | 'RESOLVED_WITH_ACTION' | 'DISMISSED' | 'DUPLICATE' | 'REFERRED_OUT';
  summaryNotes: string;
  correctiveActionsTaken?: string[];
}

export interface CaseVersion {
  id: string;
  tenantId: string;
  caseId: string;
  versionNumber: number;
  status: CaseStatus;
  priority: CasePriority;
  ownerUserId?: string;
  department?: string;
  campusId?: string;
  resolutionSummary?: string;
  privacyClassification: PrivacyClassification;
  slaDueDate?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface EnterpriseCase {
  id: string;
  tenantId: string;
  campusId?: string;
  campusScope: CampusScopeMode;
  caseNumber: string;
  title: string;
  description: string;
  category: CaseCategory;
  priority: CasePriority;
  status: CaseStatus;
  primaryOwnerUserId?: string;
  department?: string;
  sourceReference?: AuthoritativeSourceRef;
  workflowInstanceId?: string;
  privacyClassification: PrivacyClassification;
  assignments: CaseAssignment[];
  participants: CaseParticipant[];
  evidence: CaseEvidence[];
  resolution?: CaseResolution;
  slaDueDate?: string;
  slaBreached: boolean;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface TaskDependency {
  id: string;
  dependentTaskId: string; // The task that depends on another
  prerequisiteTaskId: string; // The task that must be completed first
  dependencyType: TaskDependencyType;
  isMandatory: boolean;
}

export interface TaskAssignment {
  assignedToUserId?: string;
  assignedDepartment?: string;
  assignedCampusId?: string;
  assignedBy: string;
  assignedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorUserId: string;
  content: string;
  createdAt: string;
}

export interface TaskEscalation {
  id: string;
  taskId: string;
  escalationLevel: EscalationLevel;
  escalatedToUserId?: string;
  reason: string;
  escalatedAt: string;
}

export interface EnterpriseTask {
  id: string;
  tenantId: string;
  campusId?: string;
  campusScope: CampusScopeMode;
  taskCode: string;
  title: string;
  description: string;
  priority: CasePriority;
  status: TaskStatus;
  assigneeUserId?: string;
  department?: string;
  startDate?: string;
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
  sourceReference?: AuthoritativeSourceRef;
  workflowInstanceId?: string;
  caseId?: string;
  checklist: TaskChecklistItem[];
  dependencies: TaskDependency[];
  assignments: TaskAssignment[];
  comments: TaskComment[];
  escalations: TaskEscalation[];
  privacyClassification: PrivacyClassification;
  hasBlockingDependencies: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface EnterpriseWorkQueueItem {
  id: string;
  type: 'TASK' | 'APPROVAL' | 'CASE';
  itemId: string;
  code: string;
  title: string;
  category: CaseCategory;
  priority: CasePriority;
  status: string;
  assignedUserId?: string;
  department?: string;
  campusId?: string;
  dueDate?: string;
  isOverdue: boolean;
  isEscalated: boolean;
  isBlocked: boolean;
  isDelegated: boolean;
  privacyClassification: PrivacyClassification;
  createdAt: string;
}

export interface EnterpriseWorkQueue {
  myTasks: EnterpriseWorkQueueItem[];
  myApprovals: EnterpriseWorkQueueItem[];
  myCases: EnterpriseWorkQueueItem[];
  pendingReview: EnterpriseWorkQueueItem[];
  overdue: EnterpriseWorkQueueItem[];
  escalated: EnterpriseWorkQueueItem[];
  blocked: EnterpriseWorkQueueItem[];
  delegated: EnterpriseWorkQueueItem[];
  critical: EnterpriseWorkQueueItem[];
  completed: EnterpriseWorkQueueItem[];
}

export interface WorkflowNotification {
  id: string;
  tenantId: string;
  recipientUserId: string;
  title: string;
  body: string;
  type: 'TASK_ASSIGNED' | 'APPROVAL_REQUESTED' | 'APPROVAL_DECISION' | 'SLA_WARNING' | 'SLA_BREACH' | 'ESCALATION' | 'CASE_ASSIGNED' | 'WORKFLOW_COMPLETED';
  relatedWorkflowInstanceId?: string;
  relatedCaseId?: string;
  relatedTaskId?: string;
  idempotencyKey: string;
  isRead: boolean;
  createdAt: string;
}

export interface WorkflowIntegrationReference {
  id: string;
  tenantId: string;
  sourceModule: string;
  sourceCollection: string;
  sourceEntityType: string;
  sourceEntityId: string;
  targetWorkflowDefinitionId?: string;
  targetCaseId?: string;
  targetTaskId?: string;
  triggerEvent: string;
  createdAt: string;
}

export interface WorkflowAnalytics {
  activeWorkflowsCount: number;
  workflowCompletionRatePercent: number;
  averageCycleTimeHours: number;
  approvalTurnaroundHours: number;
  totalCasesCount: number;
  openCasesCount: number;
  criticalCasesCount: number;
  caseAgingDaysAverage: number;
  slaCompliancePercent: number;
  slaBreachesCount: number;
  escalationsCount: number;
  taskCompletionPercent: number;
  overdueTasksCount: number;
  workloadByDepartment: Record<string, number>;
  workloadByCampus: Record<string, number>;
  bottleneckStages: { stageName: string; pendingCount: number; avgHoursInStage: number }[];
  rejectionRatePercent: number;
  reopenedCasesCount: number;
}

export interface WorkflowGovernanceReview {
  id: string;
  tenantId: string;
  campusId?: string;
  reviewTitle: string;
  workflowDefinitionId?: string;
  caseId?: string;
  reviewerUserId: string;
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowGovernanceDecision {
  id: string;
  tenantId: string;
  reviewId: string;
  decidedBy: string;
  decision: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  justification: string;
  decidedAt: string;
}

export interface WorkflowAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  actorRole: string;
  action: WorkflowAuditAction;
  resourceType: 'WORKFLOW_DEFINITION' | 'WORKFLOW_INSTANCE' | 'ENTERPRISE_CASE' | 'ENTERPRISE_TASK' | 'APPROVAL' | 'DELEGATION' | 'GOVERNANCE';
  resourceId: string;
  reason?: string;
  timestamp: string;
  details: Record<string, string | number | boolean>;
}

export interface WorkflowDataQualityIssue {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type:
    | 'ORPHANED_SOURCE_REFERENCE'
    | 'INVALID_WORKFLOW_VERSION'
    | 'MISSING_ASSIGNMENT'
    | 'INVALID_TENANT_REFERENCE'
    | 'INVALID_CAMPUS_REFERENCE'
    | 'OVERDUE_TASK'
    | 'EXPIRED_DELEGATION'
    | 'INVALID_SLA_DATE'
    | 'CIRCULAR_DEPENDENCY'
    | 'DUPLICATE_WORKFLOW_EXECUTION'
    | 'DUPLICATE_ESCALATION_EVENT';
  description: string;
  affectedEntityId: string;
  affectedEntityType: string;
  detectedAt: string;
}
