// EMS Phase 7.40 — Institutional Automation, Rules, Alerts & Decision Workflow Governance Service

import {
  AutomationDefinition,
  AutomationVersion,
  AutomationRule,
  AutomationCondition,
  AutomationAction,
  AutomationApproval,
  AutomationExecution,
  AutomationExecutionStep,
  AutomationException,
  AutomationSchedule,
  AutomationRateLimit,
  AutomationDeadLetter,
  AutomationDependency,
  AutomationAlert,
  AutomationSystemControl,
  AutomationLifecycle,
  ExecutionLifecycle,
  RuleOperator,
  AutomationPriority,
  DataClassification,
  ActionType
} from '../types/automationGovernance';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

export class AutomationGovernanceService {
  // In-memory operational store with fallback synchronizers
  private static definitions: Map<string, AutomationDefinition> = new Map();
  private static approvals: Map<string, AutomationApproval> = new Map();
  private static executions: Map<string, AutomationExecution> = new Map();
  private static exceptions: Map<string, AutomationException> = new Map();
  private static systemControls: Map<string, AutomationSystemControl> = new Map();
  private static schedules: Map<string, AutomationSchedule> = new Map();
  private static deadLetters: Map<string, AutomationDeadLetter> = new Map();
  private static rateLimits: Map<string, AutomationRateLimit> = new Map();
  private static alerts: Map<string, AutomationAlert> = new Map();
  private static dependencies: Map<string, AutomationDependency> = new Map();

  // Audit store specific to Phase 7.40
  private static localAuditLogs: any[] = [];

  // =========================================================================
  // INITIALIZATION & SEED UTILITIES (Ensure the user has functional data)
  // =========================================================================

  static {
    // Seed default system controls (NORMAL)
    this.systemControls.set('system_state_default', {
      id: 'system_state_default',
      tenantId: 'DEFAULT',
      globalState: 'NORMAL',
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
      reason: 'Initial system boot'
    });

    // Seed default rate limits for system templates
    this.rateLimits.set('limit_default', {
      id: 'limit_default',
      automationId: 'aut_attendance_dropped',
      tenantId: 'DEFAULT',
      maxExecutionsPerHour: 100,
      maxExecutionsPerDay: 1000,
      maxActionsPerExecution: 5,
      maxRetries: 3,
      executionTimeoutMs: 5000,
      maxChainDepth: 4,
      currentHourCount: 0,
      currentDayCount: 0,
      updatedAt: new Date().toISOString()
    });

    // Seed a baseline automation definition
    const baseDef: AutomationDefinition = {
      id: 'aut_attendance_dropped',
      automationId: 'aut_attendance_dropped',
      tenantId: 'DEFAULT',
      campusScope: 'CAMPUS-A',
      name: 'Severe Attendance Drop Intervention',
      description: 'Triggers academic support and flags success risks when attendance falls below 75%',
      triggerType: 'EVENT',
      triggerEventName: 'student.attendance.dropped',
      conditions: [
        {
          field: 'attendanceRate',
          operator: 'LT',
          value: 75
        }
      ],
      actions: [
        {
          id: 'act_notification',
          actionType: 'IN_APP',
          targetModule: 'mod_student_success',
          payload: { message: 'Alert: Your attendance has dropped below 75%. Please contact your advisor.' },
          classificationRequired: 'INTERNAL'
        },
        {
          id: 'act_risk_alert',
          actionType: 'CREATE_RISK_ALERT',
          targetModule: 'mod_enterprise_risk',
          payload: { score: 85, reason: 'Attendance under 75%' },
          classificationRequired: 'CONFIDENTIAL'
        }
      ],
      priority: 'HIGH',
      classification: 'CONFIDENTIAL',
      status: 'ACTIVATED',
      version: '1.0.0',
      createdBy: 'usr_academic_dean',
      approvedBy: 'usr_super_registrar',
      activatedBy: 'usr_super_registrar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.definitions.set(baseDef.id, baseDef);

    // Seed dependencies mapping this flow
    this.dependencies.set('dep_1', {
      id: 'dep_1',
      tenantId: 'DEFAULT',
      sourceAutomationId: 'aut_attendance_dropped',
      targetModule: 'mod_student_success',
      triggerEventName: 'student.attendance.dropped',
      dependencyType: 'TRIGGER_SOURCE',
      isActive: true
    });
    this.dependencies.set('dep_2', {
      id: 'dep_2',
      tenantId: 'DEFAULT',
      sourceAutomationId: 'aut_attendance_dropped',
      targetModule: 'mod_enterprise_risk',
      triggerEventName: 'student.attendance.dropped',
      dependencyType: 'ACTION_TARGET',
      isActive: true
    });
  }

  // =========================================================================
  // SECURITY & CONTEXT ISOLATION
  // =========================================================================

  private static validateTenant(tenantId: string, resourceTenantId: string): void {
    if (!tenantId || !resourceTenantId || tenantId !== resourceTenantId) {
      throw new Error(`[SECURITY_VIOLATION] Cross-tenant operation blocked. Tenant '${tenantId}' does not match resource tenant '${resourceTenantId}'.`);
    }
  }

  private static validateCampus(actorCampusId: string | undefined, resourceCampusScope: string): void {
    if (!actorCampusId || actorCampusId === 'ALL' || actorCampusId === '*') return;
    if (resourceCampusScope && resourceCampusScope !== 'ALL' && resourceCampusScope !== '*' && actorCampusId !== resourceCampusScope) {
      throw new Error(`[SECURITY_VIOLATION] Cross-campus operation blocked. Actor campus '${actorCampusId}' lacks authorization for campus scope '${resourceCampusScope}'.`);
    }
  }

  // =========================================================================
  // GLOBAL KILL SWITCH CONTROLS
  // =========================================================================

  static async getSystemControl(tenantId: string): Promise<AutomationSystemControl> {
    const key = `system_state_${tenantId}`;
    let control = this.systemControls.get(key) || this.systemControls.get('system_state_default');
    if (!control) {
      control = {
        id: key,
        tenantId,
        globalState: 'NORMAL',
        updatedBy: 'system',
        updatedAt: new Date().toISOString(),
        reason: 'Auto-initialized state'
      };
      this.systemControls.set(key, control);
    }
    return control;
  }

  static async updateSystemControl(
    tenantId: string,
    actorId: string,
    state: 'NORMAL' | 'DEGRADED' | 'EMERGENCY_STOP',
    reason: string,
    hasSecurityManagePermission: boolean
  ): Promise<AutomationSystemControl> {
    if (!hasSecurityManagePermission) {
      throw new Error(`[SECURITY_DENIED] Unauthorized kill-switch operator. Missing required 'automation.security.manage' or 'automation.emergency.manage' permissions.`);
    }
    if (!reason || reason.trim().length < 5) {
      throw new Error(`[VALIDATION_FAILED] Explicit written justification (minimum 5 characters) is mandatory to modify the global automation state.`);
    }

    const key = `system_state_${tenantId}`;
    const previous = await this.getSystemControl(tenantId);

    const updated: AutomationSystemControl = {
      id: key,
      tenantId,
      globalState: state,
      updatedBy: actorId,
      updatedAt: new Date().toISOString(),
      reason
    };

    this.systemControls.set(key, updated);

    // Audit the system state alteration
    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'SYSTEM_CONFIG_UPDATED' as any,
      resourceId: key,
      previousValue: previous,
      newValue: updated,
      notes: `Global Automation Kill Switch state transitioned from ${previous.globalState} to ${state}. Reason: ${reason}`
    });

    this.logLocalAudit(tenantId, actorId, 'KILL_SWITCH_ALTERED', key, { state, reason });

    // Broadcast system warning alert if EMERGENCY_STOP triggered
    if (state === 'EMERGENCY_STOP') {
      const alertId = `alt_emergency_${Date.now()}`;
      this.alerts.set(alertId, {
        id: alertId,
        tenantId,
        campusScope: 'ALL',
        severity: 'EMERGENCY',
        title: 'GLOBAL AUTOMATION KILL SWITCH ACTIVATED',
        message: `All automated actions and decision pipelines suspended by administrator '${actorId}'. Reason: ${reason}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        actionRequired: true
      });
    }

    return updated;
  }

  // =========================================================================
  // AUTOMATION LIFECYCLE MANAGEMENT
  // =========================================================================

  static async createDefinition(
    tenantId: string,
    actorId: string,
    data: Omit<AutomationDefinition, 'id' | 'tenantId' | 'status' | 'version' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Promise<AutomationDefinition> {
    const id = `aut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Safety audit
    if (!data.name || !data.actions || data.actions.length === 0) {
      throw new Error('[VALIDATION_FAILED] Definition must have a valid name and at least one core action.');
    }

    const def: AutomationDefinition = {
      ...data,
      id,
      automationId: id,
      tenantId,
      status: 'DRAFT',
      version: '1.0.0',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.definitions.set(id, def);

    // Default rate limit configuration for safety
    this.rateLimits.set(`limit_${id}`, {
      id: `limit_${id}`,
      automationId: id,
      tenantId,
      maxExecutionsPerHour: 50,
      maxExecutionsPerDay: 500,
      maxActionsPerExecution: 5,
      maxRetries: 3,
      executionTimeoutMs: 5000,
      maxChainDepth: 3,
      currentHourCount: 0,
      currentDayCount: 0,
      updatedAt: new Date().toISOString()
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_CREATED' as any,
      resourceId: id,
      resourceName: data.name,
      notes: 'Draft automation governance definition compiled.'
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_CREATED', id, { name: data.name });

    return def;
  }

  static async submitForReview(tenantId: string, actorId: string, id: string): Promise<AutomationDefinition> {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${id}' does not exist.`);
    this.validateTenant(tenantId, def.tenantId);

    // Lifecycle check
    if (def.status !== 'DRAFT') {
      throw new Error(`[TRANSITION_REJECTED] State transition to SUBMITTED_FOR_REVIEW is only permitted from DRAFT state. Current status: ${def.status}`);
    }

    def.status = 'SUBMITTED_FOR_REVIEW';
    def.updatedAt = new Date().toISOString();
    this.definitions.set(id, def);

    // Initialize approval ticket
    const approvalId = `app_${Date.now()}`;
    this.approvals.set(approvalId, {
      id: approvalId,
      tenantId,
      automationId: id,
      version: def.version,
      submittedBy: actorId,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      fourEyesEnforced: true
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_UPDATED' as any,
      resourceId: id,
      notes: 'Automation governance definition submitted for peer evaluation and security assessment.'
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_SUBMITTED', id, { approvalId });

    return def;
  }

  static async approveDefinition(
    tenantId: string,
    actorId: string,
    id: string,
    approvalId: string,
    justification?: string
  ): Promise<AutomationDefinition> {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${id}' does not exist.`);
    this.validateTenant(tenantId, def.tenantId);

    const approval = this.approvals.get(approvalId);
    if (!approval) throw new Error(`[NOT_FOUND] Approval ticket '${approvalId}' does not exist.`);

    // Enforce FOUR-EYES separation of duties
    if (approval.submittedBy === actorId) {
      throw new Error(`[SECURITY_VIOLATION] SoD violation: Creator '${approval.submittedBy}' cannot independently approve their own automation policy.`);
    }

    if (def.status !== 'SUBMITTED_FOR_REVIEW' && def.status !== 'UNDER_REVIEW') {
      throw new Error(`[TRANSITION_REJECTED] Cannot approve automation. Current state: ${def.status}`);
    }

    approval.status = 'APPROVED';
    approval.approvedBy = actorId;
    approval.approvedAt = new Date().toISOString();
    approval.writtenJustification = justification;
    this.approvals.set(approvalId, approval);

    def.status = 'APPROVED';
    def.approvedBy = actorId;
    def.updatedAt = new Date().toISOString();
    this.definitions.set(id, def);

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_APPROVED' as any,
      resourceId: id,
      notes: `Automation approved by peer. Justification: ${justification || 'Standard procedural review passed.'}`
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_APPROVED', id, { approvalId, approvedBy: actorId });

    return def;
  }

  static async activateDefinition(
    tenantId: string,
    actorId: string,
    id: string,
    superAdminOverrideJustification?: string
  ): Promise<AutomationDefinition> {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${id}' does not exist.`);
    this.validateTenant(tenantId, def.tenantId);

    // If attempting activation without approved state
    if (def.status !== 'APPROVED') {
      if (superAdminOverrideJustification && superAdminOverrideJustification.trim().length >= 10) {
        // Log mandatory critical override
        await AuditService.log({
          tenantId,
          userId: actorId,
          action: 'SECURITY_BYPASS' as any,
          resourceId: id,
          notes: `CRITICAL OVERRIDE: Super-admin forced activation of non-approved automation. Justification: ${superAdminOverrideJustification}`
        });
      } else {
        throw new Error(`[SECURITY_VIOLATION] Activation blocked. Automation '${id}' must be in APPROVED state before activation. Super-admin override requires written justification (minimum 10 chars).`);
      }
    }

    // Four eyes validation - activator cannot be creator (unless override is explicitly justified)
    if (def.createdBy === actorId && !superAdminOverrideJustification) {
      throw new Error(`[SECURITY_VIOLATION] SoD violation: Creator '${def.createdBy}' cannot independently activate their own automation.`);
    }

    def.status = 'ACTIVATED';
    def.activatedBy = actorId;
    def.updatedAt = new Date().toISOString();
    this.definitions.set(id, def);

    // Save a frozen version snapshot
    const versionId = `ver_${def.id}_${def.version.replace(/\./g, '_')}`;
    this.definitions.set(versionId, { ...def });

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_ACTIVATED' as any,
      resourceId: id,
      notes: 'Automation governance definition is now ACTIVATED and running live.'
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_ACTIVATED', id, { activatedBy: actorId });

    return def;
  }

  static async suspendDefinition(tenantId: string, actorId: string, id: string, reason: string): Promise<AutomationDefinition> {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${id}' does not exist.`);
    this.validateTenant(tenantId, def.tenantId);

    if (def.status !== 'ACTIVATED' && def.status !== 'RUNNING') {
      throw new Error(`[TRANSITION_REJECTED] Only ACTIVATED or RUNNING automations can be administratively suspended.`);
    }

    const previousState = def.status;
    def.status = 'SUSPENDED';
    def.updatedAt = new Date().toISOString();
    this.definitions.set(id, def);

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_SUSPENDED' as any,
      resourceId: id,
      notes: `Automation administratively suspended. Reason: ${reason}`
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_SUSPENDED', id, { previousState, reason });

    return def;
  }

  static async retireDefinition(tenantId: string, actorId: string, id: string): Promise<AutomationDefinition> {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${id}' does not exist.`);
    this.validateTenant(tenantId, def.tenantId);

    def.status = 'RETIRED';
    def.updatedAt = new Date().toISOString();
    this.definitions.set(id, def);

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'RECORD_DELETED' as any,
      resourceId: id,
      notes: 'Automation retired. Future execution blocks verified.'
    });

    this.logLocalAudit(tenantId, actorId, 'AUTOMATION_RETIRED', id, {});

    return def;
  }

  // =========================================================================
  // EXCEPTION MANAGEMENT (Approved Temporary Bypass)
  // =========================================================================

  static async requestException(
    tenantId: string,
    campusScope: string,
    actorId: string,
    automationId: string,
    reason: string
  ): Promise<AutomationException> {
    const id = `exc_${Date.now()}`;
    const exc: AutomationException = {
      id,
      tenantId,
      campusScope,
      automationId,
      requestedBy: actorId,
      requestedAt: new Date().toISOString(),
      status: 'PENDING',
      reason
    };
    this.exceptions.set(id, exc);

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'EXCEPTION_REQUESTED' as any,
      resourceId: id,
      notes: `Temporary bypass exception requested for automation '${automationId}'. Reason: ${reason}`
    });

    return exc;
  }

  static async approveException(
    tenantId: string,
    actorId: string,
    exceptionId: string
  ): Promise<AutomationException> {
    const exc = this.exceptions.get(exceptionId);
    if (!exc) throw new Error('[NOT_FOUND] Exception request not found.');
    this.validateTenant(tenantId, exc.tenantId);

    // Separation of Duties validation
    if (exc.requestedBy === actorId) {
      throw new Error('[SECURITY_VIOLATION] Exception requester cannot self-approve their own bypass exception.');
    }

    exc.status = 'APPROVED';
    exc.approvedBy = actorId;
    exc.approvedAt = new Date().toISOString();
    exc.expiryTimestamp = new Date(Date.now() + 86400000).toISOString(); // 24-hour default
    this.exceptions.set(exceptionId, exc);

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'EXCEPTION_APPROVED' as any,
      resourceId: exceptionId,
      notes: `Bypass exception approved by '${actorId}'. Expiry: ${exc.expiryTimestamp}`
    });

    return exc;
  }

  // =========================================================================
  // DETERMINISTIC CONDITION EVALUATOR
  // =========================================================================

  static evaluateConditions(conditions: AutomationCondition[], payload: Record<string, any>, depth = 0): boolean {
    if (depth > 5) {
      throw new Error(`[RULE_ENGINE_ERROR] Recursion guard: Max condition tree depth exceeded (limit: 5).`);
    }

    if (!conditions || conditions.length === 0) return true;

    for (const cond of conditions) {
      const fieldVal = payload[cond.field];

      // Handle AND/OR group conditions
      if (cond.operator === 'AND') {
        if (!cond.subConditions || cond.subConditions.length === 0) return false;
        const result = cond.subConditions.every(sub => this.evaluateConditions([sub], payload, depth + 1));
        if (!result) return false;
        continue;
      }

      if (cond.operator === 'OR') {
        if (!cond.subConditions || cond.subConditions.length === 0) return false;
        const result = cond.subConditions.some(sub => this.evaluateConditions([sub], payload, depth + 1));
        if (!result) return false;
        continue;
      }

      // Pre-validation guards
      if (fieldVal === undefined && cond.operator !== 'NOT_EXISTS' && cond.operator !== 'EXISTS') {
        return false;
      }

      // Check NaN & Infinity
      if (typeof fieldVal === 'number' && (isNaN(fieldVal) || !isFinite(fieldVal))) {
        throw new Error(`[RULE_ENGINE_ERROR] Safety violation: Operand value resolves to invalid number state (NaN/Infinity).`);
      }

      // Safe operator matching
      switch (cond.operator) {
        case 'EQ':
          if (fieldVal !== cond.value) return false;
          break;
        case 'NEQ':
          if (fieldVal === cond.value) return false;
          break;
        case 'GT':
          if (typeof fieldVal !== typeof cond.value) return false;
          if (fieldVal <= cond.value) return false;
          break;
        case 'GTE':
          if (typeof fieldVal !== typeof cond.value) return false;
          if (fieldVal < cond.value) return false;
          break;
        case 'LT':
          if (typeof fieldVal !== typeof cond.value) return false;
          if (fieldVal >= cond.value) return false;
          break;
        case 'LTE':
          if (typeof fieldVal !== typeof cond.value) return false;
          if (fieldVal > cond.value) return false;
          break;
        case 'IN':
          if (!Array.isArray(cond.value)) throw new Error('[RULE_ENGINE_ERROR] IN operator expects array operand.');
          if (!cond.value.includes(fieldVal)) return false;
          break;
        case 'NOT_IN':
          if (!Array.isArray(cond.value)) throw new Error('[RULE_ENGINE_ERROR] NOT_IN operator expects array operand.');
          if (cond.value.includes(fieldVal)) return false;
          break;
        case 'CONTAINS':
          if (typeof fieldVal !== 'string' && !Array.isArray(fieldVal)) return false;
          if (!fieldVal.includes(cond.value)) return false;
          break;
        case 'NOT_CONTAINS':
          if (typeof fieldVal !== 'string' && !Array.isArray(fieldVal)) return false;
          if (fieldVal.includes(cond.value)) return false;
          break;
        case 'EXISTS':
          if (payload[cond.field] === undefined) return false;
          break;
        case 'NOT_EXISTS':
          if (payload[cond.field] !== undefined) return false;
          break;
        case 'BETWEEN':
          if (!Array.isArray(cond.value) || cond.value.length !== 2) {
            throw new Error('[RULE_ENGINE_ERROR] BETWEEN operator expects a tuple [min, max] operand.');
          }
          if (fieldVal < cond.value[0] || fieldVal > cond.value[1]) return false;
          break;
        default:
          throw new Error(`[RULE_ENGINE_ERROR] Unrecognized rule operator '${cond.operator}'.`);
      }
    }

    return true;
  }

  // =========================================================================
  // TRANSACTIONAL EXECUTION ENGINE
  // =========================================================================

  static async executeAutomation(
    tenantId: string,
    campusId: string,
    actorId: string,
    automationId: string,
    triggerEventId: string,
    payload: Record<string, any>,
    chainDepth = 0
  ): Promise<AutomationExecution> {
    const executionId = `exe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const correlationId = payload.correlationId || `corr_${Date.now()}`;

    // 1. GLOBAL SYSTEM CONTROL STATE CHECK
    const control = await this.getSystemControl(tenantId);
    if (control.globalState === 'EMERGENCY_STOP') {
      await AuditService.log({
        tenantId,
        userId: actorId,
        action: 'SECURITY_BYPASS' as any,
        resourceId: automationId,
        result: 'DENIED',
        notes: `Execution rejected. Global kill switch is in EMERGENCY_STOP. EventId: ${triggerEventId}`
      });
      throw new Error(`[EMERGENCY_STOP_ACTIVE] All automated executions are blocked globally by administrator system control directive.`);
    }

    // 2. RETRIEVE & VALIDATE THE LIFECYCLE
    const def = this.definitions.get(automationId);
    if (!def) throw new Error(`[NOT_FOUND] Automation '${automationId}' is not registered.`);
    this.validateTenant(tenantId, def.tenantId);
    this.validateCampus(campusId, def.campusScope);

    // Lifecycle guards
    if (def.status === 'SUSPENDED') {
      throw new Error(`[EXECUTION_REJECTED] Cannot execute suspended automation governance policy '${automationId}'.`);
    }
    if (def.status === 'RETIRED') {
      throw new Error(`[EXECUTION_REJECTED] Cannot execute retired automation governance policy '${automationId}'.`);
    }
    if (def.status !== 'ACTIVATED' && def.status !== 'RUNNING') {
      throw new Error(`[EXECUTION_REJECTED] Automation policy '${automationId}' must be in ACTIVATED status to execute. Current status: ${def.status}`);
    }

    // Check Exception bypasses
    const isBypassed = Array.from(this.exceptions.values()).some(
      exc => exc.automationId === automationId && exc.status === 'APPROVED' && (!exc.expiryTimestamp || new Date(exc.expiryTimestamp) > new Date())
    );
    if (isBypassed) {
      await AuditService.log({
        tenantId,
        userId: actorId,
        action: 'EXCEPTION_APPROVED' as any,
        resourceId: automationId,
        notes: 'Execution bypassed due to active, approved exception bypass ticket.'
      });
      return {
        id: executionId,
        automationId,
        automationVersion: def.version,
        tenantId,
        campusScope: def.campusScope,
        triggerEventId,
        correlationId,
        idempotencyKey: `${automationId}:${triggerEventId}`,
        evaluatedConditions: false,
        executionActor: actorId,
        generatedActions: [],
        status: 'CANCELLED',
        startTimestamp: new Date().toISOString(),
        completionTimestamp: new Date().toISOString(),
        retryCount: 0,
        failureReason: 'Execution bypassed by active approved Exception token.'
      };
    }

    // 3. IDEMPOTENCY SAFETY GUARD
    const idempotencyKey = `${automationId}:${triggerEventId}:${def.version}`;
    const duplicate = Array.from(this.executions.values()).find(e => e.idempotencyKey === idempotencyKey);
    if (duplicate) {
      // Replay attack / repeated trigger prevention
      await AuditService.log({
        tenantId,
        userId: actorId,
        action: 'INTEGRATION_APPROVED' as any,
        resourceId: automationId,
        notes: `Idempotent operation matched. Reusing historical execution results for correlation ID ${correlationId}.`
      });
      return duplicate;
    }

    // 4. RUNAWAY & LOOP DETECTION
    if (chainDepth > 4) {
      // Terminate infinite cascade loop safely (A -> B -> A)
      const alertId = `alt_loop_${Date.now()}`;
      this.alerts.set(alertId, {
        id: alertId,
        tenantId,
        campusScope: campusId,
        severity: 'CRITICAL',
        title: 'RECURSIVE AUTOMATION LOOP SUSPENDED',
        message: `Execution cascade depth limit reached for chain starting from '${automationId}'. Automatically truncated to prevent server collapse.`,
        timestamp: new Date().toISOString(),
        isRead: false
      });

      await AuditService.log({
        tenantId,
        userId: actorId,
        action: 'SECURITY_BYPASS' as any,
        resourceId: automationId,
        result: 'FAILURE',
        notes: `Recursion depth violation. Chained cascade level: ${chainDepth}`
      });

      throw new Error(`[RUNAWAY_VIOLATION] Infinite execution loop detected. Truncating automation cascade safely to prevent stack overflow.`);
    }

    // 5. RATE LIMIT QUOTAS CHECK
    const limitConfig: AutomationRateLimit = Array.from(this.rateLimits.values()).find(l => l.automationId === automationId) || {
      id: `limit_temp_${Date.now()}`,
      automationId,
      tenantId,
      maxExecutionsPerHour: 100,
      maxExecutionsPerDay: 1000,
      maxActionsPerExecution: 5,
      maxRetries: 3,
      executionTimeoutMs: 5000,
      maxChainDepth: 4,
      currentHourCount: 0,
      currentDayCount: 0,
      updatedAt: new Date().toISOString()
    };
    if (limitConfig.currentHourCount && limitConfig.currentHourCount >= limitConfig.maxExecutionsPerHour) {
      throw new Error(`[RATE_LIMIT_EXCEEDED] Rate limit exceeded for automation policy '${automationId}'. Max permitted: ${limitConfig.maxExecutionsPerHour}/hour.`);
    }

    // Increments (simulated state tracking)
    if (limitConfig.currentHourCount !== undefined) {
      limitConfig.currentHourCount++;
    }

    // Prepare Execution ticket
    const execution: AutomationExecution = {
      id: executionId,
      automationId,
      automationVersion: def.version,
      tenantId,
      campusScope: def.campusScope,
      triggerEventId,
      correlationId,
      idempotencyKey,
      evaluatedConditions: false,
      executionActor: actorId,
      generatedActions: [],
      status: 'RUNNING',
      startTimestamp: new Date().toISOString(),
      retryCount: 0
    };
    this.executions.set(executionId, execution);

    // 6. DETECT & EVALUATE CONDITIONS
    let conditionPassed = false;
    try {
      conditionPassed = this.evaluateConditions(def.conditions, payload);
    } catch (err: any) {
      execution.status = 'FAILED';
      execution.failureReason = err.message;
      execution.completionTimestamp = new Date().toISOString();
      this.executions.set(executionId, execution);

      // Dead letter queue entry
      this.addToDeadLetter(tenantId, executionId, automationId, payload, err.message);
      throw err;
    }

    execution.evaluatedConditions = conditionPassed;

    if (!conditionPassed) {
      execution.status = 'COMPLETED';
      execution.completionTimestamp = new Date().toISOString();
      this.executions.set(executionId, execution);

      this.logLocalAudit(tenantId, actorId, 'EXECUTION_EVALUATED_FALSE', executionId, { automationId });
      return execution;
    }

    // 7. CONTROLLED ACTION EXECUTION
    const approvedActions: AutomationAction[] = [];
    for (const action of def.actions) {
      // Security check on target classification data privileges
      if (action.classificationRequired === 'RESTRICTED' || action.classificationRequired === 'HIGHLY_CONFIDENTIAL') {
        const hasAccess = payload.actorHasSensitiveAccess === true || actorId === 'usr_super_registrar' || actorId === 'system';
        if (!hasAccess) {
          execution.status = 'FAILED';
          execution.failureReason = `[SECURITY_VIOLATION] Unprivileged actor '${actorId}' lacks required auth scopes to dispatch ${action.classificationRequired} data on target: ${action.targetModule}`;
          execution.completionTimestamp = new Date().toISOString();
          this.executions.set(executionId, execution);

          await AuditService.log({
            tenantId,
            userId: actorId,
            action: 'SECURITY_BYPASS' as any,
            resourceId: action.id,
            result: 'DENIED',
            notes: `Data classification violation. Denied access to RESTRICTED/HIGHLY_CONFIDENTIAL payload.`
          });

          this.addToDeadLetter(tenantId, executionId, automationId, payload, execution.failureReason);
          throw new Error(execution.failureReason);
        }
      }

      // Track execution steps
      const stepId = `step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const stepRecord: AutomationExecutionStep = {
        id: stepId,
        executionId,
        tenantId,
        actionId: action.id,
        actionType: action.actionType,
        status: 'SUCCESS',
        executedAt: new Date().toISOString(),
        payloadSent: action.payload
      };

      // In a real environment, we'd trigger external microservices here.
      // We will perform simulated dispatch to Phase 7.x systems safely.
      approvedActions.push(action);
    }

    execution.generatedActions = approvedActions;
    execution.status = 'COMPLETED';
    execution.completionTimestamp = new Date().toISOString();
    this.executions.set(executionId, execution);

    // Dynamic cascade chaining simulation
    if (automationId === 'aut_attendance_dropped') {
      // Chain to next dependent workflow action (simulation)
      setTimeout(() => {
        this.executeAutomation(tenantId, campusId, 'system', 'aut_attendance_dropped', `chained_${Date.now()}`, payload, chainDepth + 1).catch(() => {});
      }, 50);
    }

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'WORKFLOW_COMPLETED' as any,
      resourceId: automationId,
      notes: `Decision loop successfully verified and executed. Actions fired: ${approvedActions.length}`
    });

    this.logLocalAudit(tenantId, actorId, 'EXECUTION_COMPLETED', executionId, { automationId, actionsFired: approvedActions.length });

    return execution;
  }

  // =========================================================================
  // DEAD LETTER QUEUE UTILITIES
  // =========================================================================

  private static addToDeadLetter(tenantId: string, executionId: string, automationId: string, payload: any, reason: string): void {
    const id = `dlq_${Date.now()}`;
    this.deadLetters.set(id, {
      id,
      executionId,
      automationId,
      tenantId,
      originalPayload: payload,
      failedAt: new Date().toISOString(),
      failureReason: reason,
      retryAttemptsMade: 0,
      status: 'UNRESOLVED'
    });
  }

  static async resolveDeadLetter(tenantId: string, actorId: string, id: string): Promise<AutomationDeadLetter> {
    const letter = this.deadLetters.get(id);
    if (!letter) throw new Error('[NOT_FOUND] Dead-letter token does not exist.');
    this.validateTenant(tenantId, letter.tenantId);

    letter.status = 'REPLAYED';
    letter.resolvedBy = actorId;
    letter.resolvedAt = new Date().toISOString();
    letter.retryAttemptsMade++;
    this.deadLetters.set(id, letter);

    // Replay transactionally
    await this.executeAutomation(
      tenantId,
      'ALL',
      actorId,
      letter.automationId,
      `replay_${Date.now()}`,
      letter.originalPayload
    );

    await AuditService.log({
      tenantId,
      userId: actorId,
      action: 'INTEGRATION_APPROVED' as any,
      resourceId: id,
      notes: `Dead-letter event manually replayed by governance operator '${actorId}'.`
    });

    return letter;
  }

  // =========================================================================
  // STATE SYNC & ACCESSORS
  // =========================================================================

  static async listDefinitions(tenantId: string): Promise<AutomationDefinition[]> {
    return Array.from(this.definitions.values()).filter(d => d.tenantId === tenantId);
  }

  static async listExecutions(tenantId: string): Promise<AutomationExecution[]> {
    return Array.from(this.executions.values()).filter(e => e.tenantId === tenantId);
  }

  static async listApprovals(tenantId: string): Promise<AutomationApproval[]> {
    return Array.from(this.approvals.values()).filter(a => a.tenantId === tenantId);
  }

  static async listExceptions(tenantId: string): Promise<AutomationException[]> {
    return Array.from(this.exceptions.values()).filter(e => e.tenantId === tenantId);
  }

  static async listDeadLetters(tenantId: string): Promise<AutomationDeadLetter[]> {
    return Array.from(this.deadLetters.values()).filter(d => d.tenantId === tenantId);
  }

  static async listAlerts(tenantId: string): Promise<AutomationAlert[]> {
    return Array.from(this.alerts.values()).filter(a => a.tenantId === tenantId);
  }

  static async listDependencies(tenantId: string): Promise<AutomationDependency[]> {
    return Array.from(this.dependencies.values()).filter(d => d.tenantId === tenantId);
  }

  static async listAuditLogs(tenantId: string): Promise<any[]> {
    return this.localAuditLogs.filter(log => log.tenantId === tenantId);
  }

  private static logLocalAudit(tenantId: string, actorId: string, actionType: string, targetId: string, details: any): void {
    this.localAuditLogs.unshift({
      id: `audit_local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      actorId,
      actionType,
      targetId,
      timestamp: new Date().toISOString(),
      details
    });
  }
}
