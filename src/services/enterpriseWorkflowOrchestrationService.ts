import { 
  EnterpriseWorkflowDefinition, 
  EnterpriseWorkflowInstance, 
  EnterpriseWorkflowStep,
  EnterpriseWorkflowExecutionAudit,
  EnterpriseWorkflowException,
  EnterpriseWorkflowApproval,
  EnterpriseWorkflowEscalation
} from '../types';

export class EnterpriseWorkflowOrchestrationService {
  // Idempotency Tracking
  private static idempotencyCache = new Set<string>();

  public static checkIdempotency(action: string, entityId: string, timestamp: string, correlationId: string): boolean {
    const key = `${action}_${entityId}_${timestamp}_${correlationId}`;
    if (this.idempotencyCache.has(key)) return false;
    this.idempotencyCache.add(key);
    return true;
  }

  public static clearIdempotencyCache(): void {
    this.idempotencyCache.clear();
  }

  // Diagnostic scanner
  public static runDiagnostics(
    instances: EnterpriseWorkflowInstance[],
    steps: EnterpriseWorkflowStep[],
    exceptions: EnterpriseWorkflowException[],
    approvals: EnterpriseWorkflowApproval[],
    escalations: EnterpriseWorkflowEscalation[]
  ) {
    const issues: { type: string; message: string; entityId: string; severity: 'WARNING' | 'CRITICAL' | 'PASS' }[] = [];
    const now = new Date();

    // Check stuck workflows
    instances.forEach(instance => {
      if (instance.status === 'RUNNING' || instance.status === 'WAITING') {
        const activeSteps = steps.filter(s => s.instanceIdRef === instance.id && (s.status === 'IN_PROGRESS' || s.status === 'WAITING_APPROVAL' || s.status === 'READY'));
        if (activeSteps.length === 0) {
          issues.push({ type: 'STUCK_WORKFLOW', message: `Instance ${instance.id} is RUNNING but has no active steps.`, entityId: instance.id, severity: 'CRITICAL' });
        }
      }
    });

    // Check overdue steps / SLA breach
    steps.forEach(step => {
      if ((step.status === 'IN_PROGRESS' || step.status === 'WAITING_APPROVAL') && step.targetCompletionDate && new Date(step.targetCompletionDate) < now) {
        issues.push({ type: 'SLA_BREACH', message: `Step ${step.id} has breached its target completion date.`, entityId: step.id, severity: 'CRITICAL' });
      }
    });

    // Check expired exceptions
    exceptions.forEach(exc => {
      if (exc.status === 'APPROVED' && exc.expiryDate && new Date(exc.expiryDate) < now) {
        issues.push({ type: 'EXPIRED_EXCEPTION', message: `Exception ${exc.id} has expired but is still active.`, entityId: exc.id, severity: 'WARNING' });
      }
    });

    // Check SoD violations
    approvals.forEach(app => {
      if (app.requesterIdRef === app.approverIdRef && app.decision === 'APPROVED') {
        issues.push({ type: 'SO_D_VIOLATION', message: `Approval ${app.id} was requested and approved by the same person.`, entityId: app.id, severity: 'CRITICAL' });
      }
    });

    return issues;
  }

  // Simulation Sandbox
  public static runSimulation(
    scenario: string,
    instances: EnterpriseWorkflowInstance[],
    steps: EnterpriseWorkflowStep[]
  ) {
    const sandboxInstances = JSON.parse(JSON.stringify(instances)) as EnterpriseWorkflowInstance[];
    const sandboxSteps = JSON.parse(JSON.stringify(steps)) as EnterpriseWorkflowStep[];
    const impacts: string[] = [];

    if (scenario === 'SLA_BREACH') {
      sandboxSteps.forEach(step => {
        if (step.status === 'IN_PROGRESS') {
          step.slaStatus = 'BREACHED';
          impacts.push(`Step [${step.id}] breached SLA.`);
        }
      });
    } else if (scenario === 'CRITICAL_APPROVER_UNAVAILABLE') {
      sandboxSteps.forEach(step => {
        if (step.status === 'WAITING_APPROVAL') {
          step.status = 'FAILED';
          impacts.push(`Step [${step.id}] failed due to approver unavailability.`);
        }
      });
    } else if (scenario === 'MULTI_DOMAIN_CASCADE') {
      sandboxInstances.forEach(inst => {
        if (inst.status === 'RUNNING') {
          inst.status = 'BLOCKED';
          impacts.push(`Instance [${inst.id}] blocked by cross-domain dependency failure.`);
        }
      });
    } else {
      impacts.push('Unknown scenario or no direct impact calculated.');
    }

    return {
      sandboxInstances,
      sandboxSteps,
      impacts,
      note: 'SIMULATION ONLY - ZERO PRODUCTION MUTATION'
    };
  }

  // Audit event hashing
  public static generateAuditHash(event: Omit<EnterpriseWorkflowExecutionAudit, 'provenanceHash'>): string {
    const payload = `${event.id}:${event.tenantId}:${event.action}:${event.instanceIdRef}:${event.timestamp}:${event.correlationId}`;
    // Simple deterministic hash 
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  }
}
