import { 
  AuditEngagement, AssuranceAuditFinding, CAPAPlan, InternalControl, AuditTrailEvent, 
  AuditCommitteeMatter, AssuranceOpinion, ControlTestResult, ControlTestResultStatus,
  AssuranceFindingSeverity
} from '../types';

export class AuditAssuranceGovernanceService {
  // Safe math utilities
  public static calculatePriorityScore(
    riskExposure: number, 
    strategicAlignmentScore: number, 
    regulatorySignificance: number
  ): number {
    if (isNaN(riskExposure) || isNaN(strategicAlignmentScore) || isNaN(regulatorySignificance)) {
      throw new Error('NaN detected in inputs');
    }
    const score = (riskExposure * 0.5) + (strategicAlignmentScore * 0.3) + (regulatorySignificance * 0.2);
    if (!isFinite(score) || score < 0) return 0;
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  public static calculateFindingRiskScore(likelihood: number, impact: number): number {
    if (isNaN(likelihood) || isNaN(impact) || likelihood < 0 || impact < 0) return 0;
    const score = likelihood * impact;
    if (!isFinite(score)) return 0;
    return Math.min(25, Math.round(score));
  }

  // Idempotency Tracking
  private static idempotencyCache = new Set<string>();

  public static checkIdempotency(action: string, entityId: string, timestamp: string): boolean {
    const key = `${action}_${entityId}_${timestamp}`;
    if (this.idempotencyCache.has(key)) return false;
    this.idempotencyCache.add(key);
    return true;
  }

  public static clearIdempotencyCache(): void {
    this.idempotencyCache.clear();
  }

  // Diagnostic scanner
  public static runDiagnostics(
    engagements: AuditEngagement[],
    findings: AssuranceAuditFinding[],
    capas: CAPAPlan[],
    controls: InternalControl[],
    testResults: ControlTestResult[],
    matters: AuditCommitteeMatter[]
  ) {
    const issues: { type: string; message: string; entityId: string }[] = [];
    const now = new Date();

    // Check overdue engagements (if active and past end date)
    engagements.forEach(eng => {
      if ((eng.status === 'FIELDWORK' || eng.status === 'PLANNING') && new Date(eng.endDate) < now) {
        issues.push({ type: 'OVERDUE_AUDIT', message: `Engagement ${eng.title} is overdue.`, entityId: eng.id });
      }
    });

    // Check overdue findings
    findings.forEach(finding => {
      if (finding.status !== 'CLOSED' && finding.status !== 'ACCEPTED' && finding.dueDate && new Date(finding.dueDate) < now) {
        issues.push({ type: 'OVERDUE_FINDING', message: `Finding ${finding.title} is overdue.`, entityId: finding.id });
      }
    });

    // Check overdue CAPA
    capas.forEach(capa => {
      if (capa.status !== 'CLOSED' && capa.status !== 'VERIFIED' && capa.targetDate && new Date(capa.targetDate) < now) {
        issues.push({ type: 'OVERDUE_CAPA', message: `CAPA ${capa.title} is overdue.`, entityId: capa.id });
      }
    });

    // Check untested controls
    controls.forEach(ctrl => {
      if (ctrl.status === 'OPERATING' && (!ctrl.lastTestDate || (ctrl.nextTestDate && new Date(ctrl.nextTestDate) < now))) {
        issues.push({ type: 'UNTESTED_CRITICAL_CONTROL', message: `Control ${ctrl.objective} is untested or test is overdue.`, entityId: ctrl.id });
      }
      
      const tests = testResults.filter(t => t.controlIdRef === ctrl.id);
      const recentFails = tests.filter(t => t.status === 'FAIL' || t.status === 'PARTIAL');
      if (recentFails.length > 0 && ctrl.status === 'OPERATING') {
        issues.push({ type: 'FAILED_CONTROL', message: `Control ${ctrl.objective} has failed tests but is marked OPERATING.`, entityId: ctrl.id });
      }
    });

    // Separation of Duties check
    matters.forEach(matter => {
      if (matter.proposerIdRef === matter.approverIdRef && matter.status === 'APPROVED') {
        issues.push({ type: 'SO_D_VIOLATION', message: `Matter ${matter.title} was proposed and approved by the same person.`, entityId: matter.id });
      }
    });

    return issues;
  }

  // Simulation Sandbox
  public static runSimulation(
    scenario: string,
    findings: AssuranceAuditFinding[],
    controls: InternalControl[]
  ) {
    const sandboxFindings = JSON.parse(JSON.stringify(findings)) as AssuranceAuditFinding[];
    const sandboxControls = JSON.parse(JSON.stringify(controls)) as InternalControl[];
    const impacts: string[] = [];

    if (scenario === 'CRITICAL_CONTROL_FAILURE') {
      sandboxControls.forEach(ctrl => {
        if (ctrl.status === 'OPERATING' && ctrl.objective.includes('Critical')) {
          ctrl.status = 'INEFFECTIVE';
          impacts.push(`Control [${ctrl.objective}] failed in simulation.`);
        }
      });
    } else if (scenario === 'MAJOR_AUDIT_FINDING') {
      const mockFinding: AssuranceAuditFinding = {
        id: 'SIM_FIND_1',
        tenantId: 'SIM',
        title: 'Simulated Major Finding',
        condition: 'Simulated condition',
        criteria: 'Simulated criteria',
        cause: 'Simulated',
        effect: 'Simulated',
        severity: 'CRITICAL',
        likelihood: 'HIGH',
        impact: 'HIGH',
        riskScore: 25,
        ownerIdRef: 'user1',
        status: 'OPEN',
        evidenceIdRefs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      sandboxFindings.push(mockFinding);
      impacts.push('A new CRITICAL finding was injected.');
    } else {
      impacts.push('Unknown scenario or no direct impact calculated.');
    }

    return {
      sandboxControls,
      sandboxFindings,
      impacts,
      note: 'SIMULATION ONLY - ZERO PRODUCTION MUTATION'
    };
  }

  // Audit event hashing
  public static generateAuditHash(event: Omit<AuditTrailEvent, 'currentHash'>): string {
    const payload = `${event.id}:${event.tenantId}:${event.action}:${event.entityId}:${event.timestamp}:${event.previousHash}`;
    // Simple mock deterministic hash for prototype
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `hash_${Math.abs(hash).toString(16)}`;
  }
}
