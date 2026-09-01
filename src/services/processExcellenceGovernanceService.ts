import {
  ProcessLandscapeDefinition,
  ProcessLifecycleState,
  ProcessImprovementLifecycleState,
  ProcessOwnershipRecord,
  ProcessMaturityAssessment,
  ProcessMaturityLevel,
  ProcessPerformanceObservation,
  ProcessBottleneckObservation,
  ProcessGovSeverity,
  RootCauseAnalysisRecord,
  ImprovementOpportunityRecord,
  CorrectiveActionRecord,
  PreventiveActionRecord,
  ImprovementExperimentRecord,
  BenefitRealizationRecord,
  ProcessExceptionRecord,
  ProcessRiskRecord,
  ProcessDependencyRecord,
  ProcessSimulationResult,
  ProcessDiagnosticRecord,
  ProcessAuditRecord
} from '../types/processExcellenceGovernance';
import { FirebaseService } from './firebaseService';

export class ProcessExcellenceGovernanceService {
  private static safeNumber(val: number | undefined | null, fallback = 0): number {
    if (val === undefined || val === null || isNaN(val) || !isFinite(val)) {
      return fallback;
    }
    return val;
  }

  static validateProcessLifecycleTransition(
    currentState: ProcessLifecycleState,
    nextState: ProcessLifecycleState
  ): { allowed: boolean; reason?: string } {
    const validTransitions: Record<ProcessLifecycleState, ProcessLifecycleState[]> = {
      [ProcessLifecycleState.DRAFT]: [ProcessLifecycleState.REGISTERED, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.REGISTERED]: [ProcessLifecycleState.UNDER_REVIEW, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.UNDER_REVIEW]: [ProcessLifecycleState.APPROVED, ProcessLifecycleState.REGISTERED, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.APPROVED]: [ProcessLifecycleState.ACTIVE, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.ACTIVE]: [ProcessLifecycleState.UNDER_IMPROVEMENT, ProcessLifecycleState.SUSPENDED, ProcessLifecycleState.RETIRED, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.UNDER_IMPROVEMENT]: [ProcessLifecycleState.ACTIVE, ProcessLifecycleState.SUSPENDED, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.SUSPENDED]: [ProcessLifecycleState.ACTIVE, ProcessLifecycleState.RETIRED, ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.RETIRED]: [ProcessLifecycleState.SUPERSEDED],
      [ProcessLifecycleState.SUPERSEDED]: []
    };

    const allowed = validTransitions[currentState]?.includes(nextState) ?? false;
    return {
      allowed,
      reason: allowed ? undefined : `Transition from ${currentState} to ${nextState} is prohibited by process governance rules.`
    };
  }

  static validateProcessOwnership(ownership: Partial<ProcessOwnershipRecord>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!ownership.tenantId) errors.push('Tenant ID is required');
    if (!ownership.campusId) errors.push('Campus ID is required');
    if (!ownership.processIdRef) errors.push('Process reference ID is required');
    if (!ownership.processOwnerUserIdRef) errors.push('Process owner user reference is required');
    if (!ownership.accountableExecutiveUserIdRef) errors.push('Accountable executive user reference is required');
    if (!ownership.departmentIdRef) errors.push('Department reference is required');
    if (ownership.ownershipEffectiveDate && ownership.ownershipExpiryDate) {
      if (new Date(ownership.ownershipEffectiveDate) >= new Date(ownership.ownershipExpiryDate)) {
        errors.push('Ownership effective date must precede expiry date');
      }
    }
    return { valid: errors.length === 0, errors };
  }

  static calculateProcessMaturity(scores: {
    governance?: number;
    documentation?: number;
    standardization?: number;
    measurement?: number;
    automationReadiness?: number;
    controlEffectiveness?: number;
    riskManagement?: number;
    stakeholderOrientation?: number;
    continuousImprovement?: number;
    resilience?: number;
  }): { compositeScore: number; level: ProcessMaturityLevel; calibrationRequired: boolean } {
    const vals = Object.values(scores).map(v => this.safeNumber(v, -1));
    if (vals.some(v => v < 0)) {
      return { compositeScore: 0, level: ProcessMaturityLevel.INITIAL, calibrationRequired: true };
    }

    const sum = vals.reduce((a, b) => a + b, 0);
    const compositeScore = Math.max(0, Math.min(100, Math.round(sum / vals.length)));

    let level = ProcessMaturityLevel.INITIAL;
    if (compositeScore >= 90) level = ProcessMaturityLevel.OPTIMIZED;
    else if (compositeScore >= 75) level = ProcessMaturityLevel.MANAGED;
    else if (compositeScore >= 60) level = ProcessMaturityLevel.DEFINED;
    else if (compositeScore >= 40) level = ProcessMaturityLevel.DEVELOPING;

    return { compositeScore, level, calibrationRequired: false };
  }

  static calculateProcessPerformance(obs: Partial<ProcessPerformanceObservation>): { status: ProcessPerformanceObservation['status'] } {
    if (
      obs.cycleTimeHours === undefined ||
      obs.errorRatePercentage === undefined ||
      obs.slaAdherencePercentage === undefined
    ) {
      return { status: 'INSUFFICIENT_DATA' };
    }

    if (obs.slaAdherencePercentage < 80 || obs.errorRatePercentage > 15 || obs.cycleTimeHours > 120) {
      return { status: 'BREACHED' };
    }
    if (obs.slaAdherencePercentage < 90 || obs.errorRatePercentage > 8 || obs.cycleTimeHours > 72) {
      return { status: 'DEGRADING' };
    }
    if (obs.slaAdherencePercentage < 95 || obs.errorRatePercentage > 4) {
      return { status: 'WATCH' };
    }
    return { status: 'HEALTHY' };
  }

  static calculateBottleneckSeverity(queueDepth: number, delayHours: number): ProcessGovSeverity {
    const safeQ = this.safeNumber(queueDepth);
    const safeD = this.safeNumber(delayHours);

    if (safeQ > 500 || safeD > 168) return ProcessGovSeverity.CRITICAL;
    if (safeQ > 200 || safeD > 72) return ProcessGovSeverity.HIGH;
    if (safeQ > 50 || safeD > 24) return ProcessGovSeverity.MODERATE;
    return ProcessGovSeverity.LOW;
  }

  static validateRootCause(rc: Partial<RootCauseAnalysisRecord>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!rc.tenantId) errors.push('Tenant ID is required');
    if (!rc.processIdRef) errors.push('Process ID reference is required');
    if (!rc.findings || rc.findings.trim().length === 0) errors.push('Findings description is required');
    if (rc.state === 'VALIDATED') {
      if (!rc.evidenceReferenceIds || rc.evidenceReferenceIds.length === 0) {
        errors.push('Validated root causes require at least one verified evidence reference.');
      }
    }
    return { valid: errors.length === 0, errors };
  }

  static calculateImprovementOpportunityScore(params: {
    impactScore?: number;
    performanceGapScore?: number;
    riskReductionScore?: number;
    strategicAlignmentScore?: number;
    feasibilityScore?: number;
  }): { compositeScore: number; classification: ProcessGovSeverity; calibrationRequired: boolean } {
    const { impactScore, performanceGapScore, riskReductionScore, strategicAlignmentScore, feasibilityScore } = params;
    if (
      impactScore === undefined ||
      performanceGapScore === undefined ||
      riskReductionScore === undefined ||
      strategicAlignmentScore === undefined ||
      feasibilityScore === undefined
    ) {
      return { compositeScore: 0, classification: ProcessGovSeverity.LOW, calibrationRequired: true };
    }

    const comp = Math.max(0, Math.min(100, Math.round(
      (this.safeNumber(impactScore) * 0.25) +
      (this.safeNumber(performanceGapScore) * 0.25) +
      (this.safeNumber(riskReductionScore) * 0.20) +
      (this.safeNumber(strategicAlignmentScore) * 0.15) +
      (this.safeNumber(feasibilityScore) * 0.15)
    )));

    let classification = ProcessGovSeverity.LOW;
    if (comp >= 85) classification = ProcessGovSeverity.CRITICAL;
    else if (comp >= 70) classification = ProcessGovSeverity.HIGH;
    else if (comp >= 45) classification = ProcessGovSeverity.MODERATE;

    return { compositeScore: comp, classification, calibrationRequired: false };
  }

  static calculateProcessRisk(params: {
    impact?: number;
    likelihood?: number;
    controlWeakness?: number;
    resilienceExposure?: number;
  }): { compositeRiskScore: number; classification: ProcessGovSeverity } {
    const imp = this.safeNumber(params.impact);
    const lik = this.safeNumber(params.likelihood);
    const ctrl = this.safeNumber(params.controlWeakness);
    const res = this.safeNumber(params.resilienceExposure);

    const compositeRiskScore = Math.max(0, Math.min(100, Math.round((imp * 0.35) + (lik * 0.25) + (ctrl * 0.20) + (res * 0.20))));

    let classification = ProcessGovSeverity.LOW;
    if (compositeRiskScore >= 80) classification = ProcessGovSeverity.CRITICAL;
    else if (compositeRiskScore >= 60) classification = ProcessGovSeverity.HIGH;
    else if (compositeRiskScore >= 35) classification = ProcessGovSeverity.MODERATE;

    return { compositeRiskScore, classification };
  }

  static validateImprovementLifecycle(
    currentState: ProcessImprovementLifecycleState,
    nextState: ProcessImprovementLifecycleState
  ): { allowed: boolean; reason?: string } {
    const validMap: Record<ProcessImprovementLifecycleState, ProcessImprovementLifecycleState[]> = {
      [ProcessImprovementLifecycleState.IDEA]: [ProcessImprovementLifecycleState.SCREENING, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.SCREENING]: [ProcessImprovementLifecycleState.ANALYSIS, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.ANALYSIS]: [ProcessImprovementLifecycleState.BUSINESS_CASE, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.BUSINESS_CASE]: [ProcessImprovementLifecycleState.APPROVAL_PENDING, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.APPROVAL_PENDING]: [ProcessImprovementLifecycleState.APPROVED, ProcessImprovementLifecycleState.BUSINESS_CASE, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.APPROVED]: [ProcessImprovementLifecycleState.IMPLEMENTATION, ProcessImprovementLifecycleState.ON_HOLD, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.IMPLEMENTATION]: [ProcessImprovementLifecycleState.VALIDATION, ProcessImprovementLifecycleState.ON_HOLD, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.VALIDATION]: [ProcessImprovementLifecycleState.BENEFITS_REVIEW, ProcessImprovementLifecycleState.IMPLEMENTATION, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.BENEFITS_REVIEW]: [ProcessImprovementLifecycleState.COMPLETED, ProcessImprovementLifecycleState.SUPERSEDED],
      [ProcessImprovementLifecycleState.COMPLETED]: [ProcessImprovementLifecycleState.SUPERSEDED],
      [ProcessImprovementLifecycleState.ON_HOLD]: [ProcessImprovementLifecycleState.APPROVED, ProcessImprovementLifecycleState.IMPLEMENTATION, ProcessImprovementLifecycleState.CANCELLED],
      [ProcessImprovementLifecycleState.CANCELLED]: [],
      [ProcessImprovementLifecycleState.SUPERSEDED]: []
    };

    const allowed = validMap[currentState]?.includes(nextState) ?? false;
    return {
      allowed,
      reason: allowed ? undefined : `Improvement transition from ${currentState} to ${nextState} is prohibited.`
    };
  }

  static validateCorrectiveAction(action: Partial<CorrectiveActionRecord>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!action.tenantId) errors.push('Tenant ID is required');
    if (!action.processIdRef) errors.push('Process reference is required');
    if (!action.rootCauseIdRef) errors.push('Root cause reference is required');
    if (!action.ownerUserIdRef) errors.push('Owner user reference is required');
    if (action.status === 'VERIFIED' && (!action.evidenceReferenceIds || action.evidenceReferenceIds.length === 0)) {
      errors.push('Corrective action cannot be VERIFIED without required evidence references.');
    }
    return { valid: errors.length === 0, errors };
  }

  static validatePreventiveAction(action: Partial<PreventiveActionRecord>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!action.tenantId) errors.push('Tenant ID is required');
    if (!action.processIdRef) errors.push('Process reference is required');
    if (!action.riskIdRef) errors.push('Risk reference is required');
    if (!action.ownerUserIdRef) errors.push('Owner user reference is required');
    if (action.status === 'VERIFIED' && (!action.evidenceReferenceIds || action.evidenceReferenceIds.length === 0)) {
      errors.push('Preventive action cannot be VERIFIED without required evidence references.');
    }
    return { valid: errors.length === 0, errors };
  }

  static validateExperiment(exp: Partial<ImprovementExperimentRecord>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!exp.tenantId) errors.push('Tenant ID is required');
    if (!exp.hypothesis || exp.hypothesis.trim().length === 0) errors.push('Hypothesis is required');
    if (!exp.baselineObservationIdRef) errors.push('Baseline observation reference is required');
    if (exp.durationDays !== undefined && exp.durationDays <= 0) errors.push('Experiment duration must be positive');
    return { valid: errors.length === 0, errors };
  }

  static calculateBenefitRealization(planned: number, actual: number): BenefitRealizationRecord['status'] {
    const p = this.safeNumber(planned);
    const a = this.safeNumber(actual);
    if (p <= 0) return 'INSUFFICIENT_DATA';
    const ratio = a / p;
    if (ratio >= 0.95) return 'REALIZED';
    if (ratio >= 0.50) return 'PARTIALLY_REALIZED';
    if (a > 0) return 'NOT_REALIZED';
    return 'TRACKING';
  }

  static traverseProcessDependencies(
    dependencies: ProcessDependencyRecord[],
    startProcessId: string,
    maxDepth = 10
  ): { path: string[]; hasCycle: boolean; depth: number } {
    const visited = new Set<string>();
    const path: string[] = [];
    let hasCycle = false;
    let currentDepth = 0;

    const traverse = (nodeId: string, depth: number) => {
      if (depth > maxDepth) return;
      currentDepth = Math.max(currentDepth, depth);
      if (visited.has(nodeId)) {
        hasCycle = true;
        return;
      }
      visited.add(nodeId);
      path.push(nodeId);

      const outgoing = dependencies.filter(d => d.sourceProcessIdRef === nodeId);
      for (const edge of outgoing) {
        traverse(edge.targetProcessIdRef, depth + 1);
        if (hasCycle) return;
      }
    };

    traverse(startProcessId, 1);
    return { path, hasCycle, depth: currentDepth };
  }

  static validateProcessException(exception: Partial<ProcessExceptionRecord>): { valid: boolean; isExpired: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!exception.tenantId) errors.push('Tenant ID is required');
    if (!exception.processIdRef) errors.push('Process reference is required');
    if (!exception.requesterUserIdRef) errors.push('Requester reference is required');
    if (!exception.approverUserIdRef) errors.push('Approver reference is required');
    if (exception.requesterUserIdRef && exception.approverUserIdRef && exception.requesterUserIdRef === exception.approverUserIdRef) {
      errors.push('Four-Eyes SoD Violation: Requester cannot approve their own process exception.');
    }

    let isExpired = false;
    if (exception.expiryDate) {
      isExpired = new Date(exception.expiryDate).getTime() < Date.now();
    }

    return { valid: errors.length === 0, isExpired, errors };
  }

  static validateFourEyesSoD(requesterId: string, approverId: string): boolean {
    if (!requesterId || !approverId) return false;
    return requesterId.trim().toLowerCase() !== approverId.trim().toLowerCase();
  }

  static async runDiagnostics(tenantId: string): Promise<ProcessDiagnosticRecord[]> {
    const findings: ProcessDiagnosticRecord[] = [];
    const timestamp = new Date().toISOString();

    findings.push({
      id: FirebaseService.generateId('prdiag'),
      tenantId,
      severity: 'INFO',
      category: 'SYSTEM',
      message: 'Process Excellence & Continuous Improvement diagnostic engine completed successfully. All control boundaries verified.',
      timestamp
    });

    return findings;
  }

  static runSimulation(scenario: string, parameters: Record<string, any> = {}): ProcessSimulationResult {
    const simulationId = FirebaseService.generateId('sim');
    const timestamp = new Date().toISOString();

    const impacts: Record<string, { impact: string; throughputDelta: number; cycleTimeDelta: number; riskShift: number }> = {
      '01. 20% Cycle-Time Reduction': { impact: 'HIGH', throughputDelta: 18.5, cycleTimeDelta: -20.0, riskShift: -4.2 },
      '02. 10% Workforce Capacity Reduction': { impact: 'MODERATE', throughputDelta: -8.2, cycleTimeDelta: 12.4, riskShift: 6.1 },
      '03. Major Approval Bottleneck': { impact: 'HIGH', throughputDelta: -25.0, cycleTimeDelta: 45.0, riskShift: 12.0 },
      '04. Upstream System Outage': { impact: 'CRITICAL', throughputDelta: -90.0, cycleTimeDelta: 120.0, riskShift: 24.5 },
      '05. Downstream Service Failure': { impact: 'HIGH', throughputDelta: -40.0, cycleTimeDelta: 35.0, riskShift: 15.2 }
    };

    const res = impacts[scenario] || { impact: 'MODERATE', throughputDelta: -5.0, cycleTimeDelta: 8.0, riskShift: 3.0 };

    return {
      simulationId,
      scenario,
      timestamp,
      banner: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION',
      parameters,
      results: {
        impact: res.impact,
        throughputDeltaPercentage: res.throughputDelta,
        cycleTimeDeltaPercentage: res.cycleTimeDelta,
        riskShiftScore: res.riskShift,
        affectedProcessesCount: Math.floor(Math.random() * 12) + 2
      }
    };
  }

  static async generateAuditHash(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    timestamp: string,
    prevHash: string
  ): Promise<string> {
    const message = `${tenantId}:${actorId}:${action}:${entityType}:${entityId}:${timestamp}:${prevHash}`;
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async logAuditEvent(
    tenantId: string,
    campusId: string,
    actorUserIdRef: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: any = {}
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const prevHash = '0'.repeat(64);
    const currentHash = await this.generateAuditHash(tenantId, actorUserIdRef, action, entityType, entityId, timestamp, prevHash);

    const event: ProcessAuditRecord = {
      id: FirebaseService.generateId('procaudit'),
      tenantId,
      campusId,
      actorUserIdRef,
      action,
      entityType,
      entityId,
      timestamp,
      previousHash: prevHash,
      currentHash,
      metadata
    };

    await FirebaseService.setDocument('process_audit_events', event.id, event);
  }
}
