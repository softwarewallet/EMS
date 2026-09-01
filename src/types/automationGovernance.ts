// EMS Phase 7.40 — Institutional Automation, Rules, Alerts & Decision Workflow Governance Engine Types

export type AutomationLifecycle =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVATED'
  | 'RUNNING'
  | 'SUSPENDED'
  | 'RETIRED';

export type ExecutionLifecycle =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRYING'
  | 'DEAD_LETTER'
  | 'CANCELLED';

export type RuleOperator =
  | 'EQ'
  | 'NEQ'
  | 'GT'
  | 'GTE'
  | 'LT'
  | 'LTE'
  | 'IN'
  | 'NOT_IN'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'EXISTS'
  | 'NOT_EXISTS'
  | 'BETWEEN'
  | 'AND'
  | 'OR';

export type AutomationPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'CRITICAL'
  | 'EMERGENCY';

export type DataClassification =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'RESTRICTED'
  | 'HIGHLY_CONFIDENTIAL';

export type ActionType =
  // Notification
  | 'IN_APP'
  | 'EMAIL'
  | 'SMS'
  | 'PUSH'
  | 'WHATSAPP'
  // Workflow
  | 'CREATE_TASK'
  | 'CREATE_CASE'
  | 'ESCALATE_CASE'
  | 'START_WORKFLOW'
  | 'ASSIGN_TASK'
  // Governance
  | 'CREATE_REVIEW'
  | 'CREATE_ALERT'
  | 'CREATE_EXCEPTION'
  | 'REQUEST_APPROVAL'
  // Analytics
  | 'RECALCULATE_KPI'
  | 'CREATE_RISK_ALERT'
  | 'CREATE_EARLY_WARNING'
  // Integration
  | 'EXECUTE_API'
  | 'SEND_WEBHOOK'
  | 'CREATE_DATA_EXCHANGE';

export interface AutomationCondition {
  field: string;
  operator: RuleOperator;
  value: any;
  subConditions?: AutomationCondition[]; // For AND / OR recursive check
}

export interface AutomationAction {
  id: string;
  actionType: ActionType;
  targetModule: string; // The authoritative module to invoke (e.g., 'mod_student_success')
  payload: Record<string, any>;
  classificationRequired?: DataClassification;
  permissionRequired?: string;
}

export interface AutomationDefinition {
  id: string;
  automationId: string;
  tenantId: string;
  campusScope: string;
  name: string;
  description: string;
  triggerType: 'EVENT' | 'SCHEDULE' | 'INBOUND_API';
  triggerEventName: string; // Event name triggering this rule (e.g., 'student.attendance.dropped')
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: AutomationPriority;
  classification: DataClassification;
  status: AutomationLifecycle;
  version: string;
  createdBy: string;
  approvedBy?: string;
  activatedBy?: string;
  createdAt: string;
  updatedAt: string;
  governanceMetadata?: {
    writtenJustification?: string;
    superAdminOverride?: boolean;
    riskAssessment?: string;
    [key: string]: any;
  };
}

export interface AutomationVersion {
  id: string;
  automationId: string;
  tenantId: string;
  version: string;
  definitionSnapshot: AutomationDefinition;
  createdBy: string;
  createdAt: string;
  changelog: string;
}

export interface AutomationRule {
  id: string;
  automationId: string;
  tenantId: string;
  ruleCode: string;
  ruleName: string;
  conditions: AutomationCondition[];
  isActive: boolean;
}

export interface AutomationApproval {
  id: string;
  tenantId: string;
  automationId: string;
  version: string;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  fourEyesEnforced: boolean;
  writtenJustification?: string;
}

export interface AutomationExecution {
  id: string;
  automationId: string;
  automationVersion: string;
  tenantId: string;
  campusScope: string;
  triggerEventId: string;
  correlationId: string;
  idempotencyKey: string;
  evaluatedConditions: boolean;
  executionActor: string; // UserId or system context
  generatedActions: AutomationAction[];
  status: ExecutionLifecycle;
  startTimestamp: string;
  completionTimestamp?: string;
  retryCount: number;
  failureReason?: string;
}

export interface AutomationExecutionStep {
  id: string;
  executionId: string;
  tenantId: string;
  actionId: string;
  actionType: ActionType;
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  executedAt: string;
  durationMs?: number;
  payloadSent: Record<string, any>;
  resultReceived?: Record<string, any>;
  errorMessage?: string;
}

export interface AutomationException {
  id: string;
  tenantId: string;
  campusScope: string;
  automationId: string;
  targetExecutionId?: string;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason: string;
  expiryTimestamp?: string;
}

export interface AutomationSchedule {
  id: string;
  automationId: string;
  tenantId: string;
  campusScope: string;
  scheduleType: 'ONE_TIME' | 'RECURRING' | 'TIME_WINDOW' | 'ACADEMIC_RELATIVE';
  cronExpression?: string; // Standard or simplified cron expression
  oneTimeDateTime?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  academicRelativeTrigger?: string; // e.g. "attendance_period_end"
  timezone: string;
  isActive: boolean;
  nextExecutionTime?: string;
  lastExecutionTime?: string;
}

export interface AutomationRateLimit {
  id: string;
  automationId: string;
  tenantId: string;
  maxExecutionsPerHour: number;
  maxExecutionsPerDay: number;
  maxActionsPerExecution: number;
  maxRetries: number;
  executionTimeoutMs: number;
  maxChainDepth: number;
  currentHourCount: number;
  currentDayCount: number;
  updatedAt: string;
}

export interface AutomationDeadLetter {
  id: string;
  executionId: string;
  automationId: string;
  tenantId: string;
  originalPayload: Record<string, any>;
  failedAt: string;
  failureReason: string;
  retryAttemptsMade: number;
  status: 'UNRESOLVED' | 'REPLAYED' | 'DISMISSED';
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AutomationDependency {
  id: string;
  tenantId: string;
  sourceAutomationId: string;
  targetModule: string; // The module A depends on (e.g. 'mod_student_success')
  triggerEventName: string;
  dependencyType: 'TRIGGER_SOURCE' | 'ACTION_TARGET' | 'CHAINED_AUTOMATION';
  isActive: boolean;
}

export interface AutomationAlert {
  id: string;
  tenantId: string;
  campusScope: string;
  severity: AutomationPriority;
  title: string;
  message: string;
  automationId?: string;
  executionId?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
}

export interface AutomationSystemControl {
  id: string; // usually 'system_state'
  tenantId: string;
  globalState: 'NORMAL' | 'DEGRADED' | 'EMERGENCY_STOP';
  updatedBy: string;
  updatedAt: string;
  reason: string;
}
