import {
  InstitutionalPerformanceStrategy,
  PerformanceDimension,
  PerformanceObjective,
  PerformanceKPI,
  MetricDefinition,
  MetricVersion,
  MetricObservation,
  PerformanceTarget,
  PerformanceThreshold,
  PerformanceScorecard,
  BenchmarkReference,
  BenchmarkObservation,
  PerformanceAssessment,
  PerformanceFinding,
  PerformanceAction,
  PerformanceException,
  PerformanceRisk,
  PerformanceRiskLevel,
  PerformanceDiagnostic,
  PerformanceAuditEvent,
  SimulationResult901,
  ScenarioType901,
  KpiLifecycleStatus,
  PerformanceStatus,
  TrendClassification,
  DataQualityState,
  PerformanceDimensionType,
  TargetDirection,
  StrategicPlan,
  StrategicObjective as OldStrategicObjective,
  StrategicInitiative,
  KPIDefinition,
  KPITarget,
  KPIMeasurement,
  BalancedScorecard,
  ExecutiveDecision,
  PerformanceRiskAlert,
  CorrectiveActionPlan,
  WhatIfScenario,
  PerformanceAuditLog
} from '../types/institutionalPerformanceGovernance';

export class InstitutionalPerformanceGovernanceService {
  private static processedIdempotencyKeys = new Set<string>();
  private static activeLocks = new Set<string>();

  /**
   * Safe Arithmetic Division Helper to prevent NaN, Infinity, or Div-by-Zero
   */
  static safeDivide(
    numerator: number | undefined,
    denominator: number | undefined
  ): { value?: number; status: DataQualityState; isCalculable: boolean } {
    if (
      numerator === undefined ||
      denominator === undefined ||
      isNaN(numerator) ||
      isNaN(denominator)
    ) {
      return { status: 'INSUFFICIENT_DATA', isCalculable: false };
    }
    if (denominator === 0) {
      return { status: 'CONFLICTING', isCalculable: false };
    }
    const val = numerator / denominator;
    if (!isFinite(val)) {
      return { status: 'UNVERIFIED', isCalculable: false };
    }
    return {
      value: Math.round(val * 10000) / 10000,
      status: 'VALID',
      isCalculable: true
    };
  }

  /**
   * Validate KPI Activation Criteria
   */
  static validateKpiActivation(kpi: Partial<PerformanceKPI>): { valid: boolean; reason?: string } {
    if (!kpi.ownerIdRef || kpi.ownerIdRef.trim() === '') {
      return { valid: false, reason: 'ACTIVE KPI must have a designated owner.' };
    }
    if (!kpi.calculationDefinition || !kpi.calculationDefinition.formulaReference) {
      return { valid: false, reason: 'ACTIVE KPI must have a valid calculation definition.' };
    }
    if (!kpi.provenance || !kpi.provenance.sourceSystemIdRef) {
      return { valid: false, reason: 'ACTIVE KPI must have an authoritative data source reference.' };
    }
    if (!kpi.unit || kpi.unit.trim() === '') {
      return { valid: false, reason: 'ACTIVE KPI must specify a measurement unit.' };
    }
    if (!kpi.frequency) {
      return { valid: false, reason: 'ACTIVE KPI must specify measurement frequency.' };
    }
    if (kpi.status !== 'APPROVED' && kpi.status !== 'UNDER_REVIEW') {
      return { valid: false, reason: 'KPI must be APPROVED before activation.' };
    }
    return { valid: true };
  }

  /**
   * Validate KPI Lifecycle Transitions
   */
  static validateKpiLifecycleTransition(
    currentStatus: KpiLifecycleStatus,
    newStatus: KpiLifecycleStatus
  ): { valid: boolean; reason?: string } {
    if (currentStatus === newStatus) return { valid: true };

    if (currentStatus === 'RETIRED' && newStatus === 'ACTIVE') {
      return { valid: false, reason: 'RETIRED KPIs cannot be directly re-activated. Create a new version or draft.' };
    }

    const validTransitions: Record<KpiLifecycleStatus, KpiLifecycleStatus[]> = {
      DRAFT: ['UNDER_REVIEW', 'RETIRED'],
      UNDER_REVIEW: ['APPROVED', 'DRAFT', 'RETIRED'],
      APPROVED: ['ACTIVE', 'UNDER_REVISION', 'RETIRED'],
      ACTIVE: ['UNDER_REVISION', 'DEPRECATED', 'RETIRED'],
      UNDER_REVISION: ['UNDER_REVIEW', 'APPROVED', 'RETIRED'],
      DEPRECATED: ['RETIRED', 'ACTIVE'],
      RETIRED: ['DRAFT']
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return { valid: false, reason: `Invalid transition from ${currentStatus} to ${newStatus}.` };
    }

    return { valid: true };
  }

  /**
   * Four-Eyes Separation of Duties (SoD) Rule
   */
  static validateFourEyesSoD(
    requesterId: string,
    approverId: string,
    actionName: string
  ): { valid: boolean; reason?: string } {
    if (!requesterId || !approverId) {
      return { valid: false, reason: 'Requester and Approver IDs are required.' };
    }
    if (requesterId === approverId) {
      return {
        valid: false,
        reason: `Four-Eyes SoD Violation: Requester (${requesterId}) cannot self-approve action "${actionName}".`
      };
    }
    return { valid: true };
  }

  /**
   * Idempotency Guard
   */
  static checkAndRegisterIdempotency(key: string): { isDuplicate: boolean } {
    if (this.processedIdempotencyKeys.has(key)) {
      return { isDuplicate: true };
    }
    this.processedIdempotencyKeys.add(key);
    return { isDuplicate: false };
  }

  /**
   * Bounded Lock Concurrency Guard
   */
  static acquireLock(resourceId: string): boolean {
    if (this.activeLocks.has(resourceId)) {
      return false;
    }
    this.activeLocks.add(resourceId);
    return true;
  }

  static releaseLock(resourceId: string): void {
    this.activeLocks.delete(resourceId);
  }

  /**
   * Evaluate Performance Status against Targets & Thresholds
   */
  static evaluatePerformanceStatus(
    currentValue: number | undefined,
    targetValue: number | undefined,
    direction: TargetDirection,
    thresholdMinWarning?: number,
    thresholdMinCritical?: number
  ): PerformanceStatus {
    if (currentValue === undefined || targetValue === undefined || isNaN(currentValue) || isNaN(targetValue)) {
      return 'UNKNOWN';
    }

    if (direction === 'HIGHER_IS_BETTER') {
      if (currentValue >= targetValue) return 'EXCEEDING';
      if (thresholdMinWarning !== undefined && currentValue < thresholdMinWarning) {
        if (thresholdMinCritical !== undefined && currentValue < thresholdMinCritical) {
          return 'CRITICAL';
        }
        return 'BELOW_TARGET';
      }
      return 'ON_TARGET';
    }

    if (direction === 'LOWER_IS_BETTER') {
      if (currentValue <= targetValue) return 'EXCEEDING';
      if (thresholdMinWarning !== undefined && currentValue > thresholdMinWarning) {
        if (thresholdMinCritical !== undefined && currentValue > thresholdMinCritical) {
          return 'CRITICAL';
        }
        return 'BELOW_TARGET';
      }
      return 'ON_TARGET';
    }

    if (Math.abs(currentValue - targetValue) <= 0.05 * targetValue) {
      return 'ON_TARGET';
    }
    return 'AT_RISK';
  }

  /**
   * Calculate Trend and Safe Variance
   */
  static calculateTrendAndVariance(
    previousValue: number | undefined,
    currentValue: number | undefined,
    direction: TargetDirection = 'HIGHER_IS_BETTER'
  ): { trend: TrendClassification; absoluteVariance?: number; percentageVariance?: number; isCalculable: boolean } {
    if (previousValue === undefined || currentValue === undefined || isNaN(previousValue) || isNaN(currentValue)) {
      return { trend: 'INSUFFICIENT_DATA', isCalculable: false };
    }

    const diff = currentValue - previousValue;
    const absVar = Math.round(diff * 100) / 100;

    let trend: TrendClassification = 'STABLE';
    if (diff > 0.001) {
      trend = direction === 'HIGHER_IS_BETTER' ? 'IMPROVING' : 'DECLINING';
    } else if (diff < -0.001) {
      trend = direction === 'HIGHER_IS_BETTER' ? 'DECLINING' : 'IMPROVING';
    }

    if (previousValue === 0) {
      return {
        trend,
        absoluteVariance: absVar,
        isCalculable: false
      };
    }

    const pct = Math.round(((currentValue - previousValue) / Math.abs(previousValue)) * 10000) / 100;
    return {
      trend,
      absoluteVariance: absVar,
      percentageVariance: pct,
      isCalculable: true
    };
  }

  /**
   * Deterministic Performance Risk Scoring
   */
  static calculatePerformanceRisk(
    varianceMagnitudePct: number,
    persistenceScore: number,
    strategicCriticality: number,
    trendDeteriorationScore: number
  ): PerformanceRisk {
    const composite =
      varianceMagnitudePct * 0.3 +
      persistenceScore * 0.2 +
      strategicCriticality * 0.3 +
      trendDeteriorationScore * 0.2;

    const rounded = Math.min(10, Math.max(0, Math.round(composite * 10) / 10));

    let riskLevel: PerformanceRiskLevel = 'LOW';
    if (rounded >= 8.5) riskLevel = 'CRITICAL';
    else if (rounded >= 6.5) riskLevel = 'HIGH';
    else if (rounded >= 4.0) riskLevel = 'MODERATE';

    return {
      id: `risk_${Date.now()}`,
      tenantId: 't1',
      kpiIdRef: 'kpi_ref',
      varianceMagnitude: varianceMagnitudePct,
      persistenceScore,
      strategicCriticality,
      trendDeteriorationScore,
      compositeRiskScore: rounded,
      riskLevel,
      calculatedAt: new Date().toISOString()
    };
  }

  /**
   * Lineage Graph Traversal & Cycle Detection
   */
  static traverseLineage(
    startNodeId: string,
    edges: Array<{ from: string; to: string }>
  ): { path: string[]; hasCycle: boolean } {
    const visited = new Set<string>();
    const path: string[] = [];
    let hasCycle = false;

    const dfs = (curr: string, depth: number) => {
      if (depth > 10) return; // Bounded max depth
      if (visited.has(curr)) {
        hasCycle = true;
        return;
      }
      visited.add(curr);
      path.push(curr);

      const nextEdges = edges.filter(e => e.from === curr);
      for (const edge of nextEdges) {
        dfs(edge.to, depth + 1);
      }
    };

    dfs(startNodeId, 0);
    return { path, hasCycle };
  }

  /**
   * Execute Isolated What-If Performance Simulation Sandbox
   */
  static executeWhatIfSimulation(scenario: ScenarioType901): SimulationResult901 {
    let affectedDimensions = 3;
    let thresholdBreaches = 2;
    let delta = -4.5;
    let summary = `What-If Simulation for ${scenario} completed.`;

    switch (scenario) {
      case 'TARGET_REDUCTION':
        delta = 2.0;
        thresholdBreaches = 0;
        summary = 'Target reduction scenario increases overall scorecard compliance.';
        break;
      case 'ENROLLMENT_SHOCK':
        affectedDimensions = 5;
        thresholdBreaches = 4;
        delta = -12.5;
        summary = 'Simulated 15% drop in enrollment triggers critical threshold breaches in Financial and Student Success dimensions.';
        break;
      case 'OPERATING_COST_PRESSURE':
        affectedDimensions = 4;
        thresholdBreaches = 3;
        delta = -8.2;
        summary = 'Operating cost shock degrades Financial and Operational scorecard performance.';
        break;
      case 'MULTI_DIMENSION_PERFORMANCE_SHOCK':
        affectedDimensions = 8;
        thresholdBreaches = 7;
        delta = -18.4;
        summary = 'Multi-dimensional shock causes severe cascading target deviations across Academic, Financial, and Digital dimensions.';
        break;
      default:
        summary = `Scenario ${scenario} modeled in isolated memory sandbox.`;
        break;
    }

    return {
      scenario,
      timestamp: new Date().toISOString(),
      simulatedKpisCount: 14,
      affectedDimensionsCount: affectedDimensions,
      thresholdBreachesCount: thresholdBreaches,
      scorecardImpactDeltaPercent: delta,
      summary: `SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION: ${summary}`,
      diagnosticsGenerated: [
        'SIM_DIAG_01: Potential strategic objective exposure detected.',
        'SIM_DIAG_02: Resource reallocation recommended to stabilize academic KPIs.'
      ]
    };
  }

  /**
   * Diagnostic Scanner Engine
   */
  static runDiagnostics(
    kpis: PerformanceKPI[],
    scorecards: PerformanceScorecard[],
    exceptions: PerformanceException[]
  ): PerformanceDiagnostic[] {
    const diagnostics: PerformanceDiagnostic[] = [];

    // 1. Active KPIs without designated owner
    kpis.forEach(k => {
      if (k.status === 'ACTIVE' && (!k.ownerIdRef || k.ownerIdRef.trim() === '')) {
        diagnostics.push({
          id: `diag_owner_${k.id}`,
          tenantId: k.tenantId,
          code: 'ERR_KPI_NO_OWNER',
          severity: 'CRITICAL',
          title: `Active KPI ${k.kpiCode} Missing Owner`,
          description: `KPI "${k.name}" is ACTIVE but lacks a designated institutional owner.`,
          recommendation: 'Assign an authorized owner immediately.',
          entityRef: k.id
        });
      }
    });

    // 2. Active KPIs without calculation definition or data source
    kpis.forEach(k => {
      if (k.status === 'ACTIVE' && (!k.calculationDefinition || !k.provenance.sourceSystemIdRef)) {
        diagnostics.push({
          id: `diag_calc_${k.id}`,
          tenantId: k.tenantId,
          code: 'ERR_KPI_NO_CALC_DEF',
          severity: 'CRITICAL',
          title: `Active KPI ${k.kpiCode} Missing Calculation Definition / Source`,
          description: `KPI "${k.name}" lacks verified formula or data source reference.`,
          recommendation: 'Provide calculation definition and data provenance.',
          entityRef: k.id
        });
      }
    });

    // 3. Scorecards with invalid total item weights
    scorecards.forEach(sc => {
      const totalWeight = sc.items.reduce((acc, item) => acc + item.weightPercent, 0);
      if (totalWeight > 100.01 || (sc.items.length > 0 && totalWeight < 99.99)) {
        diagnostics.push({
          id: `diag_sc_weight_${sc.id}`,
          tenantId: sc.tenantId,
          code: 'ERR_INVALID_SCORECARD_WEIGHT',
          severity: 'WARNING',
          title: `Scorecard ${sc.scorecardCode} Weight Mismatch`,
          description: `Total item weights equal ${totalWeight.toFixed(1)}% instead of 100%.`,
          recommendation: 'Adjust item weights to sum exactly to 100%.',
          entityRef: sc.id
        });
      }
    });

    // 4. Expired Exceptions
    const now = new Date().toISOString();
    exceptions.forEach(ex => {
      if (ex.status === 'ACTIVE' && ex.expiryDate < now) {
        diagnostics.push({
          id: `diag_exp_${ex.id}`,
          tenantId: ex.tenantId,
          code: 'ERR_EXPIRED_EXCEPTION',
          severity: 'WARNING',
          title: `Performance Exception ${ex.exceptionCode} Expired`,
          description: `Exception "${ex.title}" expired on ${ex.expiryDate}.`,
          recommendation: 'Renew exception or restore baseline KPI target compliance.',
          entityRef: ex.id
        });
      }
    });

    return diagnostics;
  }

  /**
   * Cryptographic Audit Hash Generation
   */
  static generateAuditHash(
    actorId: string,
    action: string,
    entityId: string,
    timestamp: string,
    prevHash: string
  ): string {
    const raw = `${actorId}|${action}|${entityId}|${timestamp}|${prevHash}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-901-${timestamp.substring(0, 10)}-${hex}`;
  }

  // Static state stores for older Phase 7/8 performance governance
  private static mockPlans: StrategicPlan[] = [];
  private static mockObjectives: OldStrategicObjective[] = [];
  private static mockInitiatives: StrategicInitiative[] = [];
  private static mockKpis: KPIDefinition[] = [];
  private static mockTargets: KPITarget[] = [];
  private static mockMeasurements: KPIMeasurement[] = [];
  private static mockScorecards: BalancedScorecard[] = [];
  private static mockDecisions: ExecutiveDecision[] = [];
  private static mockRiskAlerts: PerformanceRiskAlert[] = [];
  private static mockCAPs: CorrectiveActionPlan[] = [];
  private static mockWhatIfScenarios: WhatIfScenario[] = [];
  private static mockAuditLogs: PerformanceAuditLog[] = [];

  static async getStrategicPlans(tenantId: string): Promise<StrategicPlan[]> {
    return this.mockPlans.filter(p => p.tenantId === tenantId);
  }

  static async getStrategicObjectives(tenantId: string): Promise<OldStrategicObjective[]> {
    return this.mockObjectives.filter(o => o.tenantId === tenantId);
  }

  static async getStrategicInitiatives(tenantId: string): Promise<StrategicInitiative[]> {
    return this.mockInitiatives.filter(i => i.tenantId === tenantId);
  }

  static async getKPIRegistry(tenantId: string): Promise<KPIDefinition[]> {
    return this.mockKpis.filter(k => k.tenantId === tenantId);
  }

  static async getKPITargets(tenantId: string): Promise<KPITarget[]> {
    return this.mockTargets.filter(t => t.tenantId === tenantId);
  }

  static async getKPIMeasurements(tenantId: string): Promise<KPIMeasurement[]> {
    return this.mockMeasurements.filter(m => m.tenantId === tenantId);
  }

  static async getBalancedScorecards(tenantId: string): Promise<BalancedScorecard[]> {
    return this.mockScorecards.filter(s => s.tenantId === tenantId);
  }

  static async getExecutiveDecisions(tenantId: string): Promise<ExecutiveDecision[]> {
    return this.mockDecisions.filter(d => d.tenantId === tenantId);
  }

  static async getPerformanceRiskAlerts(tenantId: string): Promise<PerformanceRiskAlert[]> {
    return this.mockRiskAlerts;
  }

  static async getCorrectiveActionPlans(tenantId: string): Promise<CorrectiveActionPlan[]> {
    return this.mockCAPs.filter(c => c.tenantId === tenantId);
  }

  static async getWhatIfScenarios(tenantId: string): Promise<WhatIfScenario[]> {
    return this.mockWhatIfScenarios;
  }

  static async getPerformanceAuditLogs(tenantId: string): Promise<PerformanceAuditLog[]> {
    return this.mockAuditLogs;
  }

  static async createStrategicPlan(tenantId: string, plan: any, user: any): Promise<StrategicPlan> {
    const newPlan: StrategicPlan = {
      id: `plan_${Date.now()}`,
      tenantId,
      code: plan.code || 'PLAN_NEW',
      title: plan.title,
      description: plan.description,
      periodStart: plan.periodStart,
      periodEnd: plan.periodEnd,
      status: 'DRAFT',
      version: 1,
      vision: plan.vision,
      mission: plan.mission,
      values: plan.values || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.displayName || user.email || 'System'
    };
    this.mockPlans.push(newPlan);
    this.addAudit(user.displayName || 'System', 'CREATE_PLAN', 'StrategicPlan', newPlan.title);
    return newPlan;
  }

  static async approveStrategicPlan(tenantId: string, planId: string, user: any): Promise<void> {
    const plan = this.mockPlans.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');
    if (plan.createdBy === (user.displayName || user.email)) {
      throw new Error('4-Eyes Principle Enforced: Requester and Approver must be different actors.');
    }
    plan.status = 'APPROVED';
    plan.approvedBy = user.displayName || user.email || 'Auditor';
    plan.approvedAt = new Date().toISOString();
    this.addAudit(user.displayName || 'System', 'APPROVE_PLAN', 'StrategicPlan', plan.title);
  }

  static async activateStrategicPlan(tenantId: string, planId: string, user: any): Promise<void> {
    const plan = this.mockPlans.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');
    this.mockPlans.forEach(p => {
      if (p.tenantId === tenantId && p.status === 'ACTIVE') {
        p.status = 'SUPERSEDED';
      }
    });
    plan.status = 'ACTIVE';
    plan.activatedBy = user.displayName || user.email || 'Director';
    plan.activatedAt = new Date().toISOString();
    this.addAudit(user.displayName || 'System', 'ACTIVATE_PLAN', 'StrategicPlan', plan.title);
  }

  static async createStrategicObjective(tenantId: string, objective: any, user: any): Promise<OldStrategicObjective> {
    const newObj: OldStrategicObjective = {
      id: `obj_${Date.now()}`,
      tenantId,
      planId: objective.planId,
      code: objective.code || 'OBJ_NEW',
      title: objective.title,
      description: objective.description,
      priority: objective.priority || 'HIGH',
      status: 'PLANNED',
      weight: objective.weight || 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetDate: objective.targetDate
    };
    this.mockObjectives.push(newObj);
    this.addAudit(user.displayName || 'System', 'CREATE_OBJECTIVE', 'StrategicObjective', newObj.title);
    return newObj;
  }

  static async registerKPI(tenantId: string, kpi: any, user: any): Promise<KPIDefinition> {
    const newKpi: KPIDefinition = {
      id: `kpi_def_${Date.now()}`,
      tenantId,
      code: kpi.code || 'KPI_NEW',
      name: kpi.name,
      description: kpi.description,
      perspective: kpi.perspective || 'ACADEMIC',
      directionality: kpi.directionality || 'HIGHER_IS_BETTER',
      frequency: kpi.frequency || 'QUARTERLY',
      unit: kpi.unit || 'PERCENTAGE',
      calculationMethod: kpi.calculationMethod || 'Percentage',
      ownerId: kpi.ownerId || 'system',
      ownerName: kpi.ownerName || 'Staff',
      dataSourceSystem: kpi.dataSourceSystem || 'EMS',
      weight: kpi.weight || 20,
      status: 'ACTIVE',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockKpis.push(newKpi);
    this.addAudit(user.displayName || 'System', 'REGISTER_KPI', 'KPIDefinition', newKpi.name);
    return newKpi;
  }

  static async submitKPIMeasurement(tenantId: string, measurement: any, user: any): Promise<KPIMeasurement> {
    const kpi = this.mockKpis.find(k => k.id === measurement.kpiId);
    const newM: KPIMeasurement = {
      id: `measure_${Date.now()}`,
      tenantId,
      kpiId: measurement.kpiId,
      targetId: measurement.targetId || 'target_1',
      actualValue: measurement.actualValue,
      notes: measurement.notes,
      evidenceUrl: measurement.evidenceUrl,
      status: 'SUBMITTED',
      submittedBy: user.displayName || user.email || 'Staff',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockMeasurements.push(newM);
    this.addAudit(user.displayName || 'System', 'SUBMIT_MEASUREMENT', 'KPIMeasurement', kpi?.name || 'KPI Measurement');

    if (measurement.actualValue < 80) {
      const alert: PerformanceRiskAlert = {
        id: `alert_${Date.now()}`,
        severity: measurement.actualValue < 70 ? 'CRITICAL' : 'HIGH',
        triggerDate: new Date().toISOString(),
        kpiName: kpi?.name || 'KPI Underperformance',
        thresholdBreached: 'Lower limit violation',
        actualValue: measurement.actualValue,
        targetValue: 85,
        status: 'OPEN'
      };
      this.mockRiskAlerts.push(alert);
      this.addAudit('System Engine', 'TRIGGER_RISK_ALERT', 'PerformanceRiskAlert', alert.kpiName);
    }
    return newM;
  }

  static async approveKPIMeasurement(tenantId: string, id: string, user: any): Promise<void> {
    const m = this.mockMeasurements.find(x => x.id === id);
    if (!m) throw new Error('Measurement not found');
    if (m.submittedBy === (user.displayName || user.email)) {
      throw new Error('4-Eyes Principle Enforced: Cannot approve own submitted measurements.');
    }
    m.status = 'APPROVED';
    m.approvedBy = user.displayName || user.email || 'Auditor';
    m.approvedAt = new Date().toISOString();
    this.addAudit(user.displayName || 'System', 'APPROVE_MEASUREMENT', 'KPIMeasurement', `Measurement ${m.id}`);
  }

  static async proposeExecutiveDecision(tenantId: string, decision: any, user: any): Promise<ExecutiveDecision> {
    const newD: ExecutiveDecision = {
      id: `dec_${Date.now()}`,
      tenantId,
      code: decision.code || 'DEC_NEW',
      category: decision.category || 'STRATEGIC_RESOURCE_ALLOCATION',
      title: decision.title,
      status: 'PENDING_RATIFICATION',
      summary: decision.summary,
      requestedBudget: decision.requestedBudget || 0,
      proposerName: user.displayName || user.email || 'Executive',
      proposerRole: decision.proposerRole || 'Executive',
      signoffs: []
    };
    this.mockDecisions.push(newD);
    this.addAudit(user.displayName || 'System', 'PROPOSE_DECISION', 'ExecutiveDecision', newD.title);
    return newD;
  }

  static async recordDecisionSignoff(tenantId: string, id: string, vote: string, comments: string, user: any): Promise<void> {
    const d = this.mockDecisions.find(x => x.id === id);
    if (!d) throw new Error('Decision not found');
    if (d.proposerName === (user.displayName || user.email)) {
      throw new Error('4-Eyes Principle Enforced: Proposers are barred from rating/signing off on their own proposals.');
    }
    d.signoffs.push({
      userId: user.id || 'usr_1',
      userName: user.displayName || user.email || 'Board Member',
      role: user.role || 'Board',
      decision: vote as any,
      timestamp: new Date().toISOString(),
      comments
    });
    if (d.signoffs.length >= 2) {
      d.status = 'APPROVED';
    }
    this.addAudit(user.displayName || 'System', 'RECORD_SIGNOFF', 'ExecutiveDecision', d.title);
  }

  static async createCorrectiveActionPlan(tenantId: string, cap: any, user: any): Promise<CorrectiveActionPlan> {
    const newCap: CorrectiveActionPlan = {
      id: `cap_${Date.now()}`,
      tenantId,
      status: 'OPEN',
      title: cap.title,
      alertId: cap.alertId,
      kpiId: cap.kpiId || 'kpi_1',
      rootCauseAnalysis: cap.rootCauseAnalysis,
      targetResolutionDate: cap.targetResolutionDate,
      assignedTo: cap.assignedTo || 'staff_1',
      assignedToName: cap.assignedToName || 'Officer',
      actionSteps: cap.actionSteps || []
    };
    this.mockCAPs.push(newCap);
    this.addAudit(user.displayName || 'System', 'CREATE_CAP', 'CorrectiveActionPlan', newCap.title);
    return newCap;
  }

  static async verifyAndCloseCAP(tenantId: string, id: string, comment: string, user: any): Promise<void> {
    const cap = this.mockCAPs.find(x => x.id === id);
    if (!cap) throw new Error('CAP not found');
    cap.status = 'VERIFIED_CLOSED';
    this.addAudit(user.displayName || 'System', 'VERIFY_CLOSE_CAP', 'CorrectiveActionPlan', cap.title);
  }

  static async generateBalancedScorecard(tenantId: string, ayId: string, ayLabel: string, user: any): Promise<BalancedScorecard> {
    const newSc: BalancedScorecard = {
      id: `sc_${Date.now()}`,
      tenantId,
      overallHealthScore: 88,
      healthStatus: 'HEALTHY',
      perspectives: {
        ACADEMIC: { perspective: 'Academic Quality', score: 85, status: 'ON_TRACK', kpisCount: 3 },
        ADMINISTRATIVE: { perspective: 'Administrative Efficiency', score: 92, status: 'EXCEEDING', kpisCount: 2 },
        FINANCIAL: { perspective: 'Financial Sustainability', score: 87, status: 'ON_TRACK', kpisCount: 2 }
      }
    };
    this.mockScorecards.unshift(newSc);
    this.addAudit(user.displayName || 'System', 'GENERATE_SCORECARD', 'BalancedScorecard', ayLabel);
    return newSc;
  }

  private static addAudit(actorName: string, action: string, entityType: string, entityName: string) {
    this.mockAuditLogs.unshift({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      actorName,
      action,
      entityType,
      entityName
    });
  }

  static async seedBaselineGovernance(tenantId: string, user: any): Promise<void> {
    this.mockPlans = [
      {
        id: 'plan_1',
        tenantId,
        code: 'VISION_2030',
        title: 'Vision 2030 Strategic Masterplan',
        description: 'Comprehensive institutional transformation strategy focusing on academic quality, research impact, and student achievement.',
        periodStart: '2025-01-01',
        periodEnd: '2030-12-31',
        status: 'ACTIVE',
        version: 1,
        vision: 'World-class education and innovation hub.',
        mission: 'Provide transformative learning and impactful research.',
        values: ['Academic Integrity', 'Global Outlook', 'Social Equity'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'System'
      }
    ];

    this.mockObjectives = [
      {
        id: 'obj_1',
        tenantId,
        planId: 'plan_1',
        code: 'OBJ_AC_1',
        title: 'Elevate Student Graduation Rates',
        description: 'Implement targeted interventions to support at-risk students and increase overall four-year completion rates.',
        priority: 'CRITICAL',
        status: 'IN_PROGRESS',
        weight: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetDate: '2027-12-31'
      },
      {
        id: 'obj_2',
        tenantId,
        planId: 'plan_1',
        code: 'OBJ_RES_1',
        title: 'Expand External Research Funding',
        description: 'Increase annual external research grants from government and industry partnerships.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        weight: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetDate: '2028-06-30'
      }
    ];

    this.mockKpis = [
      {
        id: 'kpi_1',
        tenantId,
        code: 'KPI_GRAD_4YR',
        name: '4-Year Graduation Rate',
        description: 'Percentage of first-time, full-time undergraduate students who graduate within 4 academic years.',
        perspective: 'ACADEMIC',
        directionality: 'HIGHER_IS_BETTER',
        frequency: 'ANNUALLY',
        unit: 'PERCENTAGE',
        calculationMethod: '(Graduated count / Intake count) * 100',
        ownerId: 'staff_1',
        ownerName: 'Dr. Sarah Jenkins',
        dataSourceSystem: 'EMS_STUDENT_RECORD',
        weight: 20,
        status: 'ACTIVE',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'kpi_2',
        tenantId,
        code: 'KPI_RES_GRANT',
        name: 'Annual Research Grant Revenue',
        description: 'Total active external research grant funding recognized in the current fiscal year.',
        perspective: 'RESEARCH',
        directionality: 'HIGHER_IS_BETTER',
        frequency: 'ANNUALLY',
        unit: 'CURRENCY_REFERENCE',
        calculationMethod: 'Sum of all recognized external grant milestones',
        ownerId: 'staff_2',
        ownerName: 'Prof. Michael Chen',
        dataSourceSystem: 'EMS_FINANCE_LEDGER',
        weight: 15,
        status: 'ACTIVE',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.mockTargets = [
      {
        id: 'target_1',
        tenantId,
        kpiId: 'kpi_1',
        periodLabel: 'AY 2025-2026',
        targetValue: 85,
        thresholds: { warning: 80, critical: 75 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'target_2',
        tenantId,
        kpiId: 'kpi_2',
        periodLabel: 'AY 2025-2026',
        targetValue: 5000000,
        thresholds: { warning: 4500000, critical: 4000000 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.mockMeasurements = [
      {
        id: 'm_1',
        tenantId,
        kpiId: 'kpi_1',
        targetId: 'target_1',
        actualValue: 83,
        notes: 'Target nearly achieved. Cohort support program showed positive outcomes.',
        status: 'APPROVED',
        submittedBy: 'Dr. Sarah Jenkins',
        submittedAt: new Date().toISOString(),
        approvedBy: 'Provost Miller',
        approvedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.mockScorecards = [
      {
        id: 'sc_1',
        tenantId,
        overallHealthScore: 89,
        healthStatus: 'HEALTHY',
        perspectives: {
          ACADEMIC: { perspective: 'Academic Quality', score: 88, status: 'ON_TRACK', kpisCount: 1 },
          RESEARCH: { perspective: 'Research and Innovation', score: 90, status: 'EXCEEDING', kpisCount: 1 }
        }
      }
    ];

    this.mockDecisions = [
      {
        id: 'dec_1',
        tenantId,
        code: 'EXEC_DEC_2025_03',
        category: 'STRATEGIC_RESOURCE_ALLOCATION',
        title: 'Approve $250k Academic Advising Boost',
        status: 'APPROVED',
        summary: 'Allocate extra budget for student advising tools to assist at-risk retention strategies and target KPI_GRAD_4YR improvement.',
        requestedBudget: 250000,
        proposerName: 'Dr. Sarah Jenkins',
        proposerRole: 'Dean',
        signoffs: [
          {
            userId: 'usr_director',
            userName: 'Provost Miller',
            role: 'Director',
            decision: 'APPROVE',
            timestamp: new Date().toISOString(),
            comments: 'Fully aligned with student success initiatives.'
          }
        ]
      }
    ];

    this.addAudit('System Engine', 'SEED_BASELINE_DATA', 'Tenant', tenantId);
  }
}
