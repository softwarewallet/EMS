export type EnterpriseWorkflowDefinitionState = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';
export type EnterpriseWorkflowInstanceState = 'CREATED' | 'QUEUED' | 'RUNNING' | 'WAITING' | 'BLOCKED' | 'ESCALATED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type EnterpriseWorkflowStepState = 'PENDING' | 'READY' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'COMPLETED' | 'SKIPPED' | 'FAILED' | 'CANCELLED';
export type EnterpriseSLAStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'PAUSED' | 'COMPLETED';
export type EnterpriseExceptionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
export type EnterpriseEscalationState = 'ESCALATED_L1' | 'ESCALATED_L2' | 'ESCALATED_EXECUTIVE';

export interface EnterpriseWorkflowDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  version: number;
  status: EnterpriseWorkflowDefinitionState;
  ownerIdRef: string;
  businessPurpose: string;
  triggerConditions: string;
  steps: string[];
  dependencies: string[];
  conditions: string[];
  approvalGates: string[];
  escalationRules: string[];
  slaReferences: string[];
  requiredRoleRefs: string[];
  riskClassification: string;
  dataClassification: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseWorkflowInstance {
  id: string;
  tenantId: string;
  campusId?: string;
  definitionIdRef: string;
  version: number;
  status: EnterpriseWorkflowInstanceState;
  triggerType: string;
  sourceModuleIdRef?: string;
  sourceRecordIdRef?: string;
  actorIdRef: string;
  correlationId: string;
  idempotencyKey: string;
  currentStepIdRef?: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseWorkflowStep {
  id: string;
  tenantId: string;
  instanceIdRef: string;
  definitionStepIdRef: string;
  status: EnterpriseWorkflowStepState;
  assignedUserIdRef?: string;
  assignedRoleIdRef?: string;
  assignedDepartmentIdRef?: string;
  startDate?: string;
  completionDate?: string;
  slaStatus: EnterpriseSLAStatus;
  targetCompletionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseWorkflowApproval {
  id: string;
  tenantId: string;
  stepIdRef: string;
  instanceIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  decision?: 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
  comments?: string;
  decisionDate?: string;
  createdAt: string;
}

export interface EnterpriseWorkflowEscalation {
  id: string;
  tenantId: string;
  instanceIdRef: string;
  stepIdRef?: string;
  reason: string;
  previousState: string;
  newState: EnterpriseEscalationState;
  actorIdRef: string;
  targetRoleRef?: string;
  targetUserRef?: string;
  createdAt: string;
}

export interface EnterpriseWorkflowException {
  id: string;
  tenantId: string;
  instanceIdRef: string;
  reason: string;
  businessJustification: string;
  riskClassification: string;
  compensatingControlRef?: string;
  requesterIdRef: string;
  approverIdRef?: string;
  expiryDate?: string;
  status: EnterpriseExceptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseWorkflowExecutionAudit {
  id: string;
  tenantId: string;
  campusId?: string;
  actorIdRef: string;
  action: string;
  workflowIdRef?: string;
  instanceIdRef?: string;
  stepIdRef?: string;
  sourceRecordIdRef?: string;
  previousState: string;
  newState: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey: string;
  provenanceHash: string;
}
