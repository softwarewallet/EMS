// Phase 8.6 — Institutional Enterprise Event, Work Queue, Rule Engine, Business Rules, Event-Driven Automation & Cross-Module Action Governance Control Plane Types

export type EventCategory806 = 
  | 'RECORD_CREATED'
  | 'RECORD_UPDATED'
  | 'RECORD_STATUS_CHANGED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVAL_COMPLETED'
  | 'SLA_AT_RISK'
  | 'SLA_BREACHED'
  | 'RISK_THRESHOLD_BREACHED'
  | 'COMPLIANCE_EXCEPTION'
  | 'SAFETY_FINDING'
  | 'CONTRACT_EXPIRING'
  | 'BUDGET_THRESHOLD'
  | 'CYBER_ALERT'
  | 'DATA_QUALITY_ALERT'
  | 'WORKFLOW_STUCK'
  | 'CASE_ESCALATION'
  | 'DOCUMENT_REVIEW_REQUIRED'
  | 'SYSTEM_INTEGRATION_FAILURE';

export type RuleLifecycle806 = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RETIRED';

export type ActionType806 = 
  | 'CREATE_CASE_REFERENCE'
  | 'CREATE_TASK_REFERENCE'
  | 'ASSIGN_WORK_QUEUE'
  | 'REQUEST_APPROVAL'
  | 'CREATE_ESCALATION'
  | 'SEND_GOVERNED_NOTIFICATION'
  | 'CREATE_COMPLIANCE_REVIEW'
  | 'CREATE_RISK_REVIEW'
  | 'REQUEST_DOCUMENT_REVIEW'
  | 'REQUEST_DATA_QUALITY_REVIEW'
  | 'REQUEST_SECURITY_REVIEW'
  | 'REQUEST_SAFETY_REVIEW'
  | 'REQUEST_CONTRACT_REVIEW';

export type ExecutionState806 = 
  | 'QUEUED'
  | 'EVALUATING'
  | 'AUTHORIZATION_REQUIRED'
  | 'APPROVED'
  | 'EXECUTING'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'CANCELLED'
  | 'EXPIRED';

export type WorkQueueStatus806 = 'ACTIVE' | 'PAUSED' | 'SUSPENDED' | 'RETIRED';

export type WorkItemStatus806 = 
  | 'QUEUED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'WAITING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type SlaStatus806 = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'RESOLVED';

export type ScenarioType806 = 
  | 'MASS_EVENT_SURGE'
  | 'RULE_FAILURE'
  | 'WORK_QUEUE_OVERLOAD'
  | 'SLA_BREACH_CASCADE'
  | 'NOTIFICATION_PROVIDER_FAILURE'
  | 'CROSS_MODULE_OUTAGE'
  | 'DUPLICATE_EVENT_STORM'
  | 'CYBER_ALERT_SURGE'
  | 'COMPLIANCE_ALERT_SURGE'
  | 'SAFETY_ALERT_SURGE'
  | 'CONTRACT_EXPIRING_WAVE'
  | 'DATA_QUALITY_DEGRADATION'
  | 'AUTOMATION_DEPENDENCY_FAILURE'
  | 'DEAD_LETTER_BACKLOG'
  | 'MULTI_MODULE_CASCADE';

export interface EnterpriseEventDefinition {
  id: string;
  tenantId: string;
  eventCode: string;
  name: string;
  description: string;
  category: EventCategory806;
  sourceModuleIdRef: string;
  schemaVersion: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseEventEnvelope {
  id: string;
  tenantId: string;
  campusId?: string;
  eventId: string;
  eventType: EventCategory806;
  sourceModuleIdRef: string;
  sourceRecordIdRef: string;
  sourceSystemIdRef: string;
  actorIdRef: string;
  correlationId: string;
  causationId?: string;
  occurredAt: string;
  receivedAt: string;
  schemaVersion: string;
  idempotencyKey: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  provenanceHash: string;
}

export interface EnterpriseEventSubscription {
  id: string;
  tenantId: string;
  subscriptionCode: string;
  eventCodeRef: string;
  targetRuleIdRef: string;
  isActive: boolean;
  subscriberUserIdRef: string;
  createdAt: string;
}

export interface EnterpriseEventSource {
  id: string;
  tenantId: string;
  sourceCode: string;
  name: string;
  sourceModuleIdRef: string;
  isTelemetryAvailable: boolean; // false -> INSUFFICIENT DATA
  lastHeartbeat?: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
}

export interface EnterpriseRuleCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN_LIST' | 'EXISTS';
  value: string;
}

export interface EnterpriseRuleAction {
  actionType: ActionType806;
  targetModuleIdRef: string;
  payloadSummary: string;
  requiresSoDApproval: boolean;
}

export interface EnterpriseBusinessRule {
  id: string;
  tenantId: string;
  campusId?: string;
  ruleCode: string;
  title: string;
  description: string;
  category: EventCategory806;
  lifecycle: RuleLifecycle806;
  activeVersionNumber: string;
  matchType: 'ALL' | 'ANY';
  conditions: EnterpriseRuleCondition[];
  actions: EnterpriseRuleAction[];
  priority: number;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  effectiveDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseRuleVersion {
  id: string;
  tenantId: string;
  ruleIdRef: string;
  versionNumber: string;
  versionHash: string; // SHA-256
  conditionsSnapshot: EnterpriseRuleCondition[];
  actionsSnapshot: EnterpriseRuleAction[];
  changeDescription: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  approvedAt?: string;
  lifecycle: RuleLifecycle806;
  createdAt: string;
}

export interface EnterpriseRuleEvaluation {
  id: string;
  tenantId: string;
  ruleIdRef: string;
  ruleVersionIdRef: string;
  triggeringEventIdRef: string;
  evaluationResult: 'MATCHED' | 'NO_MATCH' | 'ERROR' | 'SUPPRESSED';
  evaluatedAt: string;
  durationMs: number;
}

export interface EnterpriseAutomationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  maxExecutionDepth: number; // default 5 recursion limit
  maxActionCount: number; // default 10
  requireFourEyesForHighRisk: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseAutomationExecution {
  id: string;
  tenantId: string;
  campusId?: string;
  executionId: string;
  ruleIdRef: string;
  ruleVersionIdRef: string;
  triggeringEventIdRef: string;
  correlationId: string;
  actorIdRef: string;
  executionStatus: ExecutionState806;
  startedAt: string;
  completedAt?: string;
  resultSummary?: string;
  failureReason?: string;
  idempotencyKey: string;
  auditHash: string;
  riskScore: number;
}

export interface EnterpriseAutomationStep {
  id: string;
  tenantId: string;
  executionIdRef: string;
  stepNumber: number;
  actionType: ActionType806;
  targetModuleIdRef: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'SKIPPED';
  executedAt?: string;
  errorDetails?: string;
}

export interface EnterpriseWorkQueue {
  id: string;
  tenantId: string;
  campusId?: string;
  queueCode: string;
  name: string;
  description: string;
  departmentIdRef: string;
  ownerUserIdRef: string;
  status: WorkQueueStatus806;
  maxCapacity: number;
  activeItemCount: number;
  targetSlaMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseWorkQueueItem {
  id: string;
  tenantId: string;
  queueIdRef: string;
  itemCode: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: WorkItemStatus806;
  sourceEventIdRef?: string;
  caseIdRef?: string;
  taskIdRef?: string;
  assignedUserIdRef?: string;
  dueAt: string;
  slaStatus: SlaStatus806;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseActionRequest {
  id: string;
  tenantId: string;
  requestCode: string;
  actionType: ActionType806;
  targetModuleIdRef: string;
  triggeringRuleIdRef: string;
  requesterUserIdRef: string;
  requiresSoD: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  createdAt: string;
}

export interface EnterpriseActionAuthorization {
  id: string;
  tenantId: string;
  requestIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef: string;
  decision: 'APPROVED' | 'REJECTED';
  justification: string;
  decidedAt: string;
  idempotencyKey: string;
}

export interface EnterpriseActionExecution {
  id: string;
  tenantId: string;
  requestIdRef: string;
  actionType: ActionType806;
  targetModuleIdRef: string;
  executedAt: string;
  status: 'SUCCESS' | 'FAILED';
  resultRef?: string;
  provenanceHash: string;
}

export interface EnterpriseEscalationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  queueIdRef?: string;
  warningThresholdMinutes: number;
  breachThresholdMinutes: number;
  escalationRoleRef: string;
  isActive: boolean;
  createdAt: string;
}

export interface EnterpriseEscalationEvent {
  id: string;
  tenantId: string;
  policyIdRef: string;
  workItemIdRef: string;
  escalationLevel: number; // 1, 2, 3...
  targetUserIdRef?: string;
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED';
  triggeredAt: string;
  acknowledgedAt?: string;
}

export interface EnterpriseAutomationException {
  id: string;
  tenantId: string;
  exceptionCode: string;
  title: string;
  businessJustification: string;
  compensatingControl: string;
  affectedRuleIdRef: string;
  affectedActionType?: ActionType806;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  approvedAt?: string;
  expiryDate: string; // Mandatory expiry date
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface EnterpriseAutomationSuppression {
  id: string;
  tenantId: string;
  suppressionCode: string;
  eventCodeRef: string;
  reason: string;
  suppressUntil: string;
  isActive: boolean;
  createdByUserIdRef: string;
  createdAt: string;
}

export interface EnterpriseDeadLetterEvent {
  id: string;
  tenantId: string;
  eventEnvelopeIdRef: string;
  deadLetterCode: string;
  reason: string;
  failureClassification: 'INVALID_SCHEMA' | 'NO_MATCHING_RULE' | 'AUTHORIZATION_DENIED' | 'MAX_RECURSION_EXCEEDED' | 'SYSTEM_ERROR';
  retryCount: number;
  lastAttemptedAt: string;
  isReplayEligible: boolean;
  isResolved: boolean;
  createdAt: string;
}

export interface EnterpriseReplayRequest {
  id: string;
  tenantId: string;
  deadLetterIdRef: string;
  replayCode: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: 'PENDING' | 'APPROVED' | 'REPLAYED' | 'REJECTED';
  createdAt: string;
}

export interface EnterpriseReplayExecution {
  id: string;
  tenantId: string;
  replayRequestIdRef: string;
  newExecutionIdRef: string;
  executedAt: string;
  status: 'SUCCESS' | 'FAILED';
  provenanceHash: string;
}

export interface EnterpriseAutomationDependency {
  id: string;
  tenantId: string;
  upstreamRuleIdRef: string;
  downstreamRuleIdRef: string;
  dependencyType: 'BLOCKING' | 'TRIGGER' | 'CONDITIONAL';
}

export interface EnterpriseAutomationRisk {
  id: string;
  tenantId: string;
  ruleIdRef: string;
  criticalityScore: number; // 1-10 bounded
  sensitivityScore: number; // 1-10 bounded
  blastRadiusScore: number; // 1-10 bounded
  compositeRiskScore: number; // 1-10 bounded
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evaluatedAt: string;
}

export interface EnterpriseAutomationAuditLog {
  id: string;
  tenantId: string;
  campusId?: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityIdRef: string;
  timestamp: string;
  correlationId: string;
  previousHash: string;
  currentHash: string;
}

export interface EnterpriseAutomationDiagnostic {
  id: string;
  tenantId: string;
  code: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  affectedRef?: string;
  detectedAt: string;
}

export interface SimulationResult806 {
  scenario: ScenarioType806;
  banner: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  timestamp: string;
  simulatedEventsCount: number;
  rulesEvaluatedCount: number;
  actionsTriggeredCount: number;
  deadLettersGeneratedCount: number;
  circuitBreakerActivated: boolean;
  diagnosticsGenerated: string[];
  summary: string;
}
