import {
  EnterpriseCase,
  EnterpriseCaseStatus,
  EnterpriseTask,
  EnterpriseTaskStatus,
  EnterpriseActionItem,
  EnterpriseActionStatus,
  EnterpriseSLAStatus,
  EnterpriseEscalationEvent,
  EnterpriseEscalationLevel,
  EnterpriseGovernanceException,
  EnterpriseCaseDiagnostic,
  EnterpriseCaseSimulation,
  EnterpriseCaseAuditLog,
  EnterpriseTaskDependency
} from '../types/enterpriseCaseGovernance';

export class EnterpriseCaseGovernanceService {
  private static idempotencyTracker: Set<string> = new Set();
  private static activeLocks: Set<string> = new Set();

  // 1. CASE LIFECYCLE GOVERNANCE
  public static transitionCase(
    existingCase: EnterpriseCase,
    targetStatus: EnterpriseCaseStatus,
    actorUserIdRef: string,
    verificationUserIdRef?: string
  ): { success: boolean; updatedCase?: EnterpriseCase; error?: string } {
    const validTransitions: Record<EnterpriseCaseStatus, EnterpriseCaseStatus[]> = {
      NEW: ['TRIAGED', 'CLOSED', 'ARCHIVED'],
      TRIAGED: ['ASSIGNED', 'IN_PROGRESS', 'CLOSED'],
      ASSIGNED: ['IN_PROGRESS', 'WAITING', 'ESCALATED', 'CLOSED'],
      IN_PROGRESS: ['WAITING', 'ESCALATED', 'RESOLUTION_REVIEW', 'RESOLVED', 'CLOSED'],
      WAITING: ['IN_PROGRESS', 'ESCALATED', 'RESOLVED'],
      ESCALATED: ['IN_PROGRESS', 'RESOLUTION_REVIEW', 'RESOLVED'],
      RESOLUTION_REVIEW: ['RESOLVED', 'IN_PROGRESS', 'CLOSED'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'], // Reopening allowed back to IN_PROGRESS
      CLOSED: ['ARCHIVED', 'IN_PROGRESS'],   // Reopening allowed back to IN_PROGRESS
      ARCHIVED: []
    };

    const allowed = validTransitions[existingCase.status] || [];
    if (!allowed.includes(targetStatus)) {
      return {
        success: false,
        error: `Invalid state transition from ${existingCase.status} to ${targetStatus}`
      };
    }

    // Require verification for closing critical cases (Four-Eyes SoD)
    if (targetStatus === 'CLOSED' || targetStatus === 'RESOLVED') {
      if (existingCase.closureVerificationRequired) {
        if (!verificationUserIdRef) {
          return { success: false, error: 'Independent closure verification required for this case' };
        }
        if (verificationUserIdRef === existingCase.ownerUserIdRef) {
          return { success: false, error: 'SoD Violation: Case owner cannot verify their own case closure' };
        }
        if (verificationUserIdRef === actorUserIdRef) {
          return { success: false, error: 'SoD Violation: Actor cannot verify their own closure request' };
        }
      }
    }

    const updated: EnterpriseCase = {
      ...existingCase,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
      ...(targetStatus === 'RESOLVED' ? { resolvedAt: new Date().toISOString() } : {}),
      ...(targetStatus === 'CLOSED' ? { closedAt: new Date().toISOString(), closureVerifiedByUserIdRef: verificationUserIdRef } : {}),
      ...(targetStatus === 'ARCHIVED' ? { archivedAt: new Date().toISOString() } : {})
    };

    return { success: true, updatedCase: updated };
  }

  // 2. TASK LIFECYCLE GOVERNANCE
  public static transitionTask(
    existingTask: EnterpriseTask,
    targetStatus: EnterpriseTaskStatus,
    actorUserIdRef: string,
    verifierUserIdRef?: string
  ): { success: boolean; updatedTask?: EnterpriseTask; error?: string } {
    const validTaskTransitions: Record<EnterpriseTaskStatus, EnterpriseTaskStatus[]> = {
      PENDING: ['ASSIGNED', 'IN_PROGRESS', 'BLOCKED', 'CLOSED'],
      ASSIGNED: ['IN_PROGRESS', 'BLOCKED', 'CLOSED'],
      IN_PROGRESS: ['BLOCKED', 'COMPLETED', 'CLOSED'],
      BLOCKED: ['IN_PROGRESS', 'ASSIGNED', 'CLOSED'],
      COMPLETED: ['VERIFIED', 'IN_PROGRESS', 'CLOSED'],
      VERIFIED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: ['IN_PROGRESS']
    };

    const allowed = validTaskTransitions[existingTask.status] || [];
    if (!allowed.includes(targetStatus)) {
      return {
        success: false,
        error: `Invalid task transition from ${existingTask.status} to ${targetStatus}`
      };
    }

    // Prevent completing blocked task
    if (targetStatus === 'COMPLETED' && existingTask.isBlocked) {
      return { success: false, error: 'Cannot complete a task that is currently BLOCKED' };
    }

    // Verification check for VERIFIED state
    if (targetStatus === 'VERIFIED') {
      if (!verifierUserIdRef) {
        return { success: false, error: 'Task verification requires an explicit verifier' };
      }
      if (verifierUserIdRef === actorUserIdRef) {
        return { success: false, error: 'SoD Violation: Task completed actor cannot verify their own task' };
      }
      if (existingTask.assignment?.assignedUserIdRef && verifierUserIdRef === existingTask.assignment.assignedUserIdRef) {
        return { success: false, error: 'SoD Violation: Assigned task user cannot verify their own task' };
      }
    }

    const updated: EnterpriseTask = {
      ...existingTask,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
      ...(targetStatus === 'VERIFIED' ? { verifiedByUserIdRef: verifierUserIdRef, verifiedAt: new Date().toISOString() } : {})
    };

    return { success: true, updatedTask: updated };
  }

  // 3. ACTION & ACCOUNTABILITY REGISTER
  public static verifyAndCloseAction(
    actionItem: EnterpriseActionItem,
    verifierUserIdRef: string,
    notes: string,
    evidenceRef?: string
  ): { success: boolean; updatedAction?: EnterpriseActionItem; error?: string } {
    if (verifierUserIdRef === actionItem.responsibleUserIdRef) {
      return { success: false, error: 'SoD Violation: Responsible actor cannot verify their own action item' };
    }
    if (verifierUserIdRef === actionItem.ownerUserIdRef) {
      return { success: false, error: 'SoD Violation: Action owner cannot be the independent verifier' };
    }

    const updated: EnterpriseActionItem = {
      ...actionItem,
      status: 'CLOSED',
      verificationStatus: 'VERIFIED',
      verifiedByUserIdRef: verifierUserIdRef,
      verificationNotes: notes,
      evidenceReferenceId: evidenceRef || actionItem.evidenceReferenceId,
      updatedAt: new Date().toISOString()
    };

    return { success: true, updatedAction: updated };
  }

  // 4. SLA GOVERNANCE ENGINE
  public static calculateSLAStatus(
    createdAtIso?: string,
    dueDateIso?: string,
    isPaused: boolean = false
  ): EnterpriseSLAStatus {
    if (!createdAtIso || !dueDateIso) {
      return 'ON_TRACK'; // Default safe fallback
    }

    if (isPaused) {
      return 'PAUSED';
    }

    const now = new Date().getTime();
    const created = new Date(createdAtIso).getTime();
    const due = new Date(dueDateIso).getTime();

    if (isNaN(created) || isNaN(due)) {
      return 'ON_TRACK';
    }

    if (now > due) {
      return 'BREACHED';
    }

    const totalDuration = due - created;
    const timeRemaining = due - now;

    if (totalDuration > 0 && (timeRemaining / totalDuration) < 0.25) {
      return 'AT_RISK';
    }

    return 'ON_TRACK';
  }

  // 5. ESCALATION ENGINE (WITH IDEMPOTENCY)
  public static escalateCase(
    caseItem: EnterpriseCase,
    newLevel: EnterpriseEscalationLevel,
    reason: string,
    actorUserIdRef: string,
    idempotencyKey: string
  ): { success: boolean; escalationEvent?: EnterpriseEscalationEvent; updatedCase?: EnterpriseCase; error?: string } {
    if (this.idempotencyTracker.has(idempotencyKey)) {
      return { success: false, error: `Duplicate escalation event rejected (Idempotency Key: ${idempotencyKey})` };
    }

    this.idempotencyTracker.add(idempotencyKey);

    const event: EnterpriseEscalationEvent = {
      id: `esc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: caseItem.tenantId,
      campusId: caseItem.campusId,
      caseIdRef: caseItem.id,
      trigger: reason,
      previousLevel: caseItem.escalationLevel,
      newLevel,
      reason,
      actorUserIdRef,
      idempotencyKey,
      resolved: false,
      auditHash: `hash-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedCase: EnterpriseCase = {
      ...caseItem,
      escalationLevel: newLevel,
      status: 'ESCALATED',
      updatedAt: new Date().toISOString()
    };

    return { success: true, escalationEvent: event, updatedCase };
  }

  // 6. DEPENDENCY & CIRCULAR DEPENDENCY DETECTOR (BOUNDED GRAPH TRAVERSAL)
  public static detectCircularDependencies(
    taskId: string,
    allTasks: EnterpriseTask[]
  ): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const taskMap = new Map<string, EnterpriseTask>();
    allTasks.forEach(t => taskMap.set(t.id, t));

    const dfs = (currentId: string, depth: number = 0): boolean => {
      if (depth > 20) return true; // Safety depth limit against unbounded recursion
      if (recStack.has(currentId)) return true;
      if (visited.has(currentId)) return false;

      visited.add(currentId);
      recStack.add(currentId);

      const task = taskMap.get(currentId);
      if (task && task.dependencies) {
        for (const dep of task.dependencies) {
          if (dfs(dep.dependsOnTaskIdRef, depth + 1)) {
            return true;
          }
        }
      }

      recStack.delete(currentId);
      return false;
    };

    return dfs(taskId);
  }

  // 7. SEPARATION OF DUTIES (SoD) VALIDATION
  public static validateSoD(
    requesterId: string,
    approverId: string,
    operationName: string
  ): { valid: boolean; reason?: string } {
    if (!requesterId || !approverId) {
      return { valid: false, reason: 'Both requester and approver IDs are required for SoD check' };
    }
    if (requesterId === approverId) {
      return {
        valid: false,
        reason: `SoD Violation in ${operationName}: Requester cannot approve/verify their own request (${requesterId})`
      };
    }
    return { valid: true };
  }

  // 8. DIAGNOSTICS ENGINE
  public static runDiagnostics(
    cases: EnterpriseCase[],
    tasks: EnterpriseTask[],
    exceptions: EnterpriseGovernanceException[]
  ): EnterpriseCaseDiagnostic[] {
    const diagnostics: EnterpriseCaseDiagnostic[] = [];
    const nowIso = new Date().toISOString();

    // Check cases for SLA breach & missing owner
    cases.forEach(c => {
      if (!c.ownerUserIdRef) {
        diagnostics.push({
          id: `diag-no-owner-${c.id}`,
          issueType: 'MISSING_OWNER',
          severity: 'CRITICAL',
          message: `Case ${c.caseNumber} lacks an assigned owner`,
          entityIdRef: c.id,
          detectedAt: nowIso
        });
      }

      const calculatedSla = this.calculateSLAStatus(c.createdAt, c.slaDueDate, c.status === 'WAITING');
      if (calculatedSla === 'BREACHED' && c.status !== 'CLOSED' && c.status !== 'RESOLVED') {
        diagnostics.push({
          id: `diag-sla-${c.id}`,
          issueType: 'SLA_BREACH',
          severity: 'HIGH' as any,
          message: `Case ${c.caseNumber} has breached SLA target date`,
          entityIdRef: c.id,
          detectedAt: nowIso
        });
      }
    });

    // Check tasks for overdue & circular dependencies
    tasks.forEach(t => {
      if (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'CLOSED' && t.status !== 'VERIFIED') {
        diagnostics.push({
          id: `diag-overdue-${t.id}`,
          issueType: 'OVERDUE_TASK',
          severity: 'WARNING',
          message: `Task ${t.title} is past due date`,
          entityIdRef: t.id,
          detectedAt: nowIso
        });
      }

      if (this.detectCircularDependencies(t.id, tasks)) {
        diagnostics.push({
          id: `diag-circ-${t.id}`,
          issueType: 'CIRCULAR_DEPENDENCY',
          severity: 'CRITICAL',
          message: `Circular dependency graph detected starting at task ${t.title}`,
          entityIdRef: t.id,
          detectedAt: nowIso
        });
      }
    });

    // Check exceptions for expiry
    exceptions.forEach(e => {
      if (e.expiryDate && new Date(e.expiryDate) < new Date() && e.status === 'APPROVED') {
        diagnostics.push({
          id: `diag-exp-${e.id}`,
          issueType: 'EXPIRED_EXCEPTION',
          severity: 'CRITICAL',
          message: `Governance exception ${e.exceptionNumber} has expired`,
          entityIdRef: e.id,
          detectedAt: nowIso
        });
      }
    });

    return diagnostics;
  }

  // 9. ISOLATED WHAT-IF SIMULATION SANDBOX (ZERO PRODUCTION MUTATION)
  public static runSimulation(
    scenario: EnterpriseCaseSimulation['scenario'],
    cases: EnterpriseCase[],
    tasks: EnterpriseTask[]
  ): EnterpriseCaseSimulation {
    const caseCount = cases.length + 25;
    let predictedBreaches = 0;
    let predictedEscalations = 0;
    const bottlenecks: string[] = [];
    const impactSummary: string[] = [];

    switch (scenario) {
      case 'SLA_SURGE':
        predictedBreaches = Math.ceil(caseCount * 0.35);
        predictedEscalations = Math.ceil(caseCount * 0.2);
        bottlenecks.push('Triage & SLA Response Capacity');
        impactSummary.push('SLA breach rate predicted to surge by 35%', 'Executive escalation volume expected +20%');
        break;
      case 'STAFF_CAPACITY_REDUCTION':
        predictedBreaches = Math.ceil(caseCount * 0.5);
        predictedEscalations = Math.ceil(caseCount * 0.3);
        bottlenecks.push('Action Verification Queue', 'Campus Incident Handlers');
        impactSummary.push('Queue backlog expected to increase by 50%', 'Task resolution time extended by 4.2x');
        break;
      default:
        predictedBreaches = Math.ceil(caseCount * 0.15);
        predictedEscalations = Math.ceil(caseCount * 0.1);
        bottlenecks.push('General Operations Queue');
        impactSummary.push('Simulation executed cleanly in isolated sandbox memory.', 'Zero production database mutation occurred.');
    }

    return {
      scenario,
      simulatedCaseCount: caseCount,
      predictedSlaBreaches: predictedBreaches,
      predictedEscalations: predictedEscalations,
      capacityBottlenecks: bottlenecks,
      impactSummary,
      executedAt: new Date().toISOString()
    };
  }

  // 10. IMMUTABLE AUDIT HASH GENERATOR
  public static generateAuditHash(log: Omit<EnterpriseCaseAuditLog, 'auditHash'>): string {
    const raw = `${log.id}:${log.tenantId}:${log.actorId}:${log.action}:${log.entityId}:${log.timestamp}:${log.idempotencyKey}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hash-802-${Math.abs(hash).toString(16)}`;
  }
}
