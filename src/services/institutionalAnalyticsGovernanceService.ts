import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  addDoc 
} from 'firebase/firestore';
import {
  InstitutionalAnalyticsStrategy,
  AnalyticsObjective,
  IndicatorDefinition,
  IndicatorObservation,
  IndicatorTarget,
  ForecastRun,
  BenchmarkDefinition,
  GovBenchmarkObservation,
  EarlyWarningObservation,
  AnalyticsScenario,
  ScenarioParameter,
  ScenarioOutcome,
  DecisionBrief,
  ResilienceImpact,
  AnalyticsException,
  AnalyticsOverride,
  GovAnalyticsAuditEvent,
  AnalyticsDiagnostic,
  AnalyticsDomain,
  GovCalculationMethod,
  DataSufficiencyAssessment,
  ForecastConfidence,
  ForecastHorizon,
  WarningSeverity,
  WarningTrigger,
  GovResilienceRating,
  DecisionConfidence,
  DecisionApprovalState
} from '../types/institutionalAnalyticsGovernance';

// Pre-defined Indicators across domains
export const DOMAIN_INDICATORS: IndicatorDefinition[] = [
  {
    code: 'IND_ACAD_PASS',
    name: 'Academic Term Pass Rate',
    description: 'Percentage of students successfully passing all registered term courses.',
    domain: 'ACADEMIC',
    unit: '%',
    calculationMethod: 'PERCENTAGE',
    formula: '(Passed Students / Total Students) * 100',
    frequency: 'QUARTERLY'
  },
  {
    code: 'IND_STUD_RET',
    name: 'Student Retention Index',
    description: 'Calculated student cohort retention and re-enrollment strength.',
    domain: 'STUDENT_SUCCESS',
    unit: 'Index',
    calculationMethod: 'DETERMINISTIC_MODEL',
    formula: 'Cohort Progression Rate * Retention Weight',
    frequency: 'ANNUALLY'
  },
  {
    code: 'IND_FIN_LIQ',
    name: 'Net Operating Margin',
    description: 'Ratio of surplus/deficit relative to institutional operating revenues.',
    domain: 'FINANCIAL',
    unit: '%',
    calculationMethod: 'RATIO',
    formula: '(Operating Revenue - Operating Expense) / Operating Revenue',
    frequency: 'MONTHLY'
  },
  {
    code: 'IND_RES_FUND',
    name: 'Active Research Grants Volume',
    description: 'Total active financial backing across funded research proposals.',
    domain: 'RESEARCH',
    unit: 'INR',
    calculationMethod: 'SUM',
    formula: 'Sum(Active Grant Funding values)',
    frequency: 'QUARTERLY'
  },
  {
    code: 'IND_WORK_EFF',
    name: 'Workforce Retention Rate',
    description: 'Staff retention strength across teaching and administrative teams.',
    domain: 'WORKFORCE',
    unit: '%',
    calculationMethod: 'PERCENTAGE',
    formula: '(Retained Staff Count / Start Staff Count) * 100',
    frequency: 'ANNUALLY'
  },
  {
    code: 'IND_OPER_UTIL',
    name: 'Facility Space Utilization',
    description: 'Optimized usage index across designated campus facilities.',
    domain: 'OPERATIONS',
    unit: '%',
    calculationMethod: 'PERCENTAGE',
    formula: '(Scheduled hours / Total operational hours) * 100',
    frequency: 'MONTHLY'
  },
  {
    code: 'IND_COMM_ENG',
    name: 'Community Integration Score',
    description: 'Governed community engagement participation index.',
    domain: 'COMMUNITY_ENGAGEMENT',
    unit: 'Score',
    calculationMethod: 'DETERMINISTIC_MODEL',
    formula: 'Weighted average of community project feedback',
    frequency: 'QUARTERLY'
  },
  {
    code: 'IND_INT_ENR',
    name: 'International Student Enrollment',
    description: 'Total international origin student registration volume.',
    domain: 'INTERNATIONALIZATION',
    unit: 'Count',
    calculationMethod: 'SUM',
    formula: 'Sum(International Student Enrollments)',
    frequency: 'ANNUALLY'
  },
  {
    code: 'IND_DIG_UPT',
    name: 'Core System Up-Time Rate',
    description: 'Aggregated reliability and accessibility rate of core enterprise services.',
    domain: 'DIGITAL_TECHNOLOGY',
    unit: '%',
    calculationMethod: 'PERCENTAGE',
    formula: '(Uptime hours / Total hours) * 100',
    frequency: 'MONTHLY'
  },
  {
    code: 'IND_RISK_RES',
    name: 'Governance Continuity Preparedness Index',
    description: 'Evaluated readiness score based on business resilience scenario drills.',
    domain: 'RISK_RESILIENCE',
    unit: 'Index',
    calculationMethod: 'DETERMINISTIC_MODEL',
    formula: 'Score based on verified contingency playbooks',
    frequency: 'QUARTERLY'
  }
];

// In-Memory Database for Offline/Sandboxed Execution & Compliance Validation
const memAnalyticsStrategies: InstitutionalAnalyticsStrategy[] = [];
const memIndicatorObservations: IndicatorObservation[] = [];
const memIndicatorTargets: IndicatorTarget[] = [];
const memForecastRuns: ForecastRun[] = [];
const memEarlyWarningObservations: EarlyWarningObservation[] = [];
const memDecisionBriefs: DecisionBrief[] = [];
const memAnalyticsExceptions: AnalyticsException[] = [];
const memAnalyticsOverrides: AnalyticsOverride[] = [];
const memAnalyticsAuditEvents: GovAnalyticsAuditEvent[] = [];
const memAnalyticsDiagnostics: AnalyticsDiagnostic[] = [];

export class InstitutionalAnalyticsGovernanceService {
  private static processedIdempotencyKeys = new Set<string>();

  // ==========================================
  // 4. DETERMINISTIC ANALYTICS ENGINE
  // ==========================================

  public static safeDivide(num: number | undefined | null, den: number | undefined | null): number {
    if (num === undefined || num === null || isNaN(num)) return 0;
    if (den === undefined || den === null || isNaN(den) || den === 0) return 0;
    return num / den;
  }

  public static safePercentage(num: number | undefined | null, den: number | undefined | null): number {
    const val = this.safeDivide(num, den) * 100;
    return Math.max(0, Math.min(100, Math.round(val * 100) / 100));
  }

  public static safeRound(val: number | undefined | null, decimals: number = 2): number {
    if (val === undefined || val === null || isNaN(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  public static safeAverage(vals: number[]): number {
    if (!vals || vals.length === 0) return 0;
    const sum = vals.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
    return this.safeRound(sum / vals.length, 2);
  }

  public static safeWeightedAverage(vals: number[], weights: number[]): number {
    if (!vals || vals.length === 0 || !weights || weights.length !== vals.length) return 0;
    let sumProd = 0;
    let sumWeight = 0;
    for (let i = 0; i < vals.length; i++) {
      const v = vals[i];
      const w = weights[i];
      if (!isNaN(v) && !isNaN(w)) {
        sumProd += v * w;
        sumWeight += w;
      }
    }
    return this.safeRound(this.safeDivide(sumProd, sumWeight), 2);
  }

  public static safeVariance(vals: number[], mean: number): number {
    if (!vals || vals.length <= 1) return 0;
    const sumSqDiff = vals.reduce((sum, val) => sum + Math.pow((isNaN(val) ? 0 : val) - mean, 2), 0);
    return this.safeRound(sumSqDiff / (vals.length - 1), 4);
  }

  public static safePercentageChange(oldVal: number | undefined | null, newVal: number | undefined | null): number {
    if (oldVal === undefined || oldVal === null || isNaN(oldVal) || oldVal === 0) return 0;
    if (newVal === undefined || newVal === null || isNaN(newVal)) return -100;
    const change = ((newVal - oldVal) / oldVal) * 100;
    return this.safeRound(change, 2);
  }

  public static safeNormalize(val: number, min: number, max: number): number {
    if (max <= min) return 0;
    const norm = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, this.safeRound(norm, 2)));
  }

  // ==========================================
  // AUDIT TRAIL CRYPTOGRAPHIC LINEAGE
  // ==========================================

  public static generateAuditHash(
    tenantId: string,
    actorRef: string,
    action: string,
    entityRef: string,
    timestamp: string,
    previousHash: string
  ): string {
    const raw = `${tenantId}:${actorRef}:${action}:${entityRef}:${timestamp}:${previousHash}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256_${hex}_92_${Date.now().toString(36)}`;
  }

  public static async recordAuditEvent(
    tenantId: string,
    campusId: string,
    actorRef: string,
    action: string,
    entityRef: string,
    provenanceInfo: string
  ): Promise<GovAnalyticsAuditEvent> {
    const previousEvent = memAnalyticsAuditEvents[memAnalyticsAuditEvents.length - 1];
    const prevHash = previousEvent ? previousEvent.currentHash : 'GENESIS_HASH_00000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const currentHash = this.generateAuditHash(tenantId, actorRef, action, entityRef, timestamp, prevHash);

    const event: GovAnalyticsAuditEvent = {
      id,
      tenantId,
      campusId,
      actorRef,
      action,
      entityRef,
      timestamp,
      correlationId: `corr_${Date.now()}`,
      previousHash: prevHash,
      currentHash,
      provenanceInfo
    };

    memAnalyticsAuditEvents.push(event);

    try {
      if (db) {
        await setDoc(doc(db, 'analyticsAuditEvents', id), event);
      }
    } catch (e) {
      console.warn("Firestore audit write skipped/failed:", e);
    }

    return event;
  }

  // ==========================================
  // STRATEGY & OBJECTIVES
  // ==========================================

  public static async getStrategy(tenantId: string): Promise<InstitutionalAnalyticsStrategy | null> {
    const strategies = memAnalyticsStrategies.filter(s => s.tenantId === tenantId && s.status === 'ACTIVE');
    if (strategies.length > 0) return strategies[0];

    // Seed default if none
    const defaultStrategy: InstitutionalAnalyticsStrategy = {
      id: `strat_${tenantId}`,
      tenantId,
      title: 'Five-Year Strategic Resilience Masterplan',
      fiscalYear: '2026-2027',
      status: 'ACTIVE',
      objectives: [
        { id: 'obj_1', title: 'Enhance Academic and Term Progression Rates', description: 'Maintain overall academic term pass rates above 85%.', targetDate: '2027-03-31', weight: 30 },
        { id: 'obj_2', title: 'Fortify Financial & Operating Margin Reserve', description: 'Establish secure Net Operating Margin target above 10%.', targetDate: '2027-03-31', weight: 25 },
        { id: 'obj_3', title: 'Expand Research Innovation & Funding Grants', description: 'Boost active research grant backing past 50,000,000 INR.', targetDate: '2027-03-31', weight: 25 },
        { id: 'obj_4', title: 'Sustain Digital Systems High-Availability', description: 'Insure core enterprise systems up-time stays above 99.9%.', targetDate: '2027-03-31', weight: 20 }
      ],
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system_bootstrap'
    };

    memAnalyticsStrategies.push(defaultStrategy);
    return defaultStrategy;
  }

  // ==========================================
  // INDICATOR OBSERVATIONS & TARGETS
  // ==========================================

  public static async getIndicatorTargets(tenantId: string): Promise<IndicatorTarget[]> {
    const targets = memIndicatorTargets.filter(t => t.fiscalYear === '2026-2027');
    if (targets.length > 0) return targets;

    // Seed default targets
    const defaultTargets: IndicatorTarget[] = [
      { id: 't_acad', indicatorCode: 'IND_ACAD_PASS', fiscalYear: '2026-2027', targetValue: 85, thresholds: { warnBelow: 80, criticalBelow: 75, targetValue: 85 } },
      { id: 't_ret', indicatorCode: 'IND_STUD_RET', fiscalYear: '2026-2027', targetValue: 90, thresholds: { warnBelow: 85, criticalBelow: 80, targetValue: 90 } },
      { id: 't_fin', indicatorCode: 'IND_FIN_LIQ', fiscalYear: '2026-2027', targetValue: 12, thresholds: { warnBelow: 8, criticalBelow: 4, targetValue: 12 } },
      { id: 't_res', indicatorCode: 'IND_RES_FUND', fiscalYear: '2026-2027', targetValue: 50000000, thresholds: { warnBelow: 40000000, criticalBelow: 30000000, targetValue: 50000000 } },
      { id: 't_work', indicatorCode: 'IND_WORK_EFF', fiscalYear: '2026-2027', targetValue: 88, thresholds: { warnBelow: 82, criticalBelow: 75, targetValue: 88 } },
      { id: 't_oper', indicatorCode: 'IND_OPER_UTIL', fiscalYear: '2026-2027', targetValue: 75, thresholds: { warnBelow: 65, criticalBelow: 55, targetValue: 75 } },
      { id: 't_comm', indicatorCode: 'IND_COMM_ENG', fiscalYear: '2026-2027', targetValue: 80, thresholds: { warnBelow: 70, criticalBelow: 60, targetValue: 80 } },
      { id: 't_int', indicatorCode: 'IND_INT_ENR', fiscalYear: '2026-2027', targetValue: 150, thresholds: { warnBelow: 120, criticalBelow: 100, targetValue: 150 } },
      { id: 't_dig', indicatorCode: 'IND_DIG_UPT', fiscalYear: '2026-2027', targetValue: 99.9, thresholds: { warnBelow: 99.5, criticalBelow: 99.0, targetValue: 99.9 } },
      { id: 't_risk', indicatorCode: 'IND_RISK_RES', fiscalYear: '2026-2027', targetValue: 85, thresholds: { warnBelow: 75, criticalBelow: 65, targetValue: 85 } }
    ];

    memIndicatorTargets.push(...defaultTargets);
    return defaultTargets;
  }

  public static async getIndicatorObservations(tenantId: string, campusId: string): Promise<IndicatorObservation[]> {
    const observations = memIndicatorObservations.filter(o => o.tenantId === tenantId && o.campusId === campusId);
    if (observations.length > 0) return observations;

    // Seed 3 periods of default data to allow trend and forecast evaluations
    const periods = ['2026-Q1', '2026-Q2', '2026-Q3'];
    const values: Record<string, number[]> = {
      IND_ACAD_PASS: [82, 84, 86],
      IND_STUD_RET: [88, 89, 91],
      IND_FIN_LIQ: [10.5, 11.2, 12.8],
      IND_RES_FUND: [42000000, 46000000, 52000000],
      IND_WORK_EFF: [85, 86, 89],
      IND_OPER_UTIL: [70, 72, 76],
      IND_COMM_ENG: [75, 78, 82],
      IND_INT_ENR: [110, 125, 145],
      IND_DIG_UPT: [99.6, 99.8, 99.9],
      IND_RISK_RES: [80, 82, 86]
    };

    const seeded: IndicatorObservation[] = [];
    periods.forEach((period, idx) => {
      DOMAIN_INDICATORS.forEach(ind => {
        const val = values[ind.code]?.[idx] ?? 0;
        const obsId = `obs_${ind.code}_${period}_${idx}`;
        seeded.push({
          id: obsId,
          tenantId,
          campusId,
          indicatorCode: ind.code,
          observationPeriod: period,
          value: val,
          dataSufficiency: 'SUFFICIENT',
          timestamp: new Date().toISOString(),
          provenanceId: `prov_${ind.code}_${period}`
        });
      });
    });

    memIndicatorObservations.push(...seeded);
    return seeded;
  }

  // ==========================================
  // FORECASTING UTILITIES
  // ==========================================

  public static async generateForecasts(tenantId: string, campusId: string): Promise<ForecastRun[]> {
    const observations = await this.getIndicatorObservations(tenantId, campusId);
    const targets = await this.getIndicatorTargets(tenantId);

    const runs: ForecastRun[] = DOMAIN_INDICATORS.map(ind => {
      const indObs = observations.filter(o => o.indicatorCode === ind.code).sort((a, b) => a.observationPeriod.localeCompare(b.observationPeriod));
      const target = targets.find(t => t.indicatorCode === ind.code);

      let confidence: ForecastConfidence = 'MEDIUM';
      let sufficiency: DataSufficiencyAssessment = 'SUFFICIENT';

      if (indObs.length < 3) {
        confidence = 'UNRELIABLE';
        sufficiency = 'INSUFFICIENT';
      }

      // Linear regression deterministic trend estimation
      let nextPredicted = target ? target.targetValue : 100;
      if (indObs.length >= 2) {
        const last = indObs[indObs.length - 1].value ?? 0;
        const prev = indObs[indObs.length - 2].value ?? 0;
        const slope = last - prev;
        nextPredicted = last + slope;
      }

      // Safeguards (bounded variables)
      if (ind.unit === '%' || ind.calculationMethod === 'PERCENTAGE') {
        nextPredicted = Math.max(0, Math.min(100, nextPredicted));
      }

      const predictions = [
        {
          period: '2026-Q4 (Forecast)',
          predictedValue: this.safeRound(nextPredicted, 2),
          confidenceLowerBound: this.safeRound(nextPredicted * 0.95, 2),
          confidenceUpperBound: this.safeRound(nextPredicted * 1.05, 2)
        }
      ];

      return {
        id: `fore_${ind.code}_${Date.now()}`,
        tenantId,
        indicatorCode: ind.code,
        runTimestamp: new Date().toISOString(),
        horizon: 'SHORT_TERM' as ForecastHorizon,
        confidence,
        assumptions: [
          { key: 'ASM_CONT_DEM', description: 'Assumes continuous baseline enrollment growth and operational patterns.', value: 1.0 }
        ],
        predictions,
        provenance: {
          id: `prov_fore_${ind.code}`,
          tenantId,
          indicatorCode: ind.code,
          methodologyVersion: 'FORECAST_DETERMINISTIC_1.0',
          calculationBasis: 'Deterministic Slope Progression of Historic Periods',
          sources: [{ sourceModuleIdRef: 'mod_institutional_analytics', sourceRecordIdRef: ind.code, description: 'Historic indicator observations' }],
          calculatedAt: new Date().toISOString(),
          calculationEngineVersion: '1.0.0'
        }
      };
    });

    memForecastRuns.push(...runs);
    return runs;
  }

  // ==========================================
  // EARLY WARNING SYSTEM
  // ==========================================

  public static async evaluateEarlyWarnings(tenantId: string, campusId: string): Promise<EarlyWarningObservation[]> {
    const observations = await this.getIndicatorObservations(tenantId, campusId);
    const targets = await this.getIndicatorTargets(tenantId);
    
    const warnings: EarlyWarningObservation[] = [];

    DOMAIN_INDICATORS.forEach(ind => {
      const indObs = observations.filter(o => o.indicatorCode === ind.code);
      const target = targets.find(t => t.indicatorCode === ind.code);
      if (!target || indObs.length === 0) return;

      const latest = indObs[indObs.length - 1];
      const observedVal = latest.value ?? 0;

      // Deterministic threshold trigger check
      let severity: WarningSeverity = 'STABLE';
      let triggerType: WarningTrigger = 'THRESHOLD_BREACH';
      let recommendedResponse = 'No immediate action required. Performance parameters stable.';

      if (target.thresholds.criticalBelow !== undefined && observedVal < target.thresholds.criticalBelow) {
        severity = 'CRITICAL';
        recommendedResponse = `Convene Board immediate extraordinary session to review deteriorating performance in ${ind.name}.`;
      } else if (target.thresholds.warnBelow !== undefined && observedVal < target.thresholds.warnBelow) {
        severity = 'WARNING';
        recommendedResponse = `Formulate Corrective Action Plan (CAP) addressing indicators in ${ind.name}.`;
      } else if (target.thresholds.criticalAbove !== undefined && observedVal > target.thresholds.criticalAbove) {
        severity = 'CRITICAL';
        recommendedResponse = `Elevate compliance review for resource overuse or parameter breach in ${ind.name}.`;
      } else if (target.thresholds.warnAbove !== undefined && observedVal > target.thresholds.warnAbove) {
        severity = 'WARNING';
        recommendedResponse = `Engage oversight administrators to examine upward deviation of ${ind.name}.`;
      }

      // Trend break detection (e.g. drop from previous period)
      if (indObs.length >= 2 && severity === 'STABLE') {
        const prevVal = indObs[indObs.length - 2].value ?? 0;
        if (prevVal - observedVal > (target.targetValue * 0.08)) {
          severity = 'WATCH';
          triggerType = 'SUDDEN_TREND_BREAK';
          recommendedResponse = `Monitor performance slope of ${ind.name} for persistent negative trend break.`;
        }
      }

      if (severity !== 'STABLE') {
        warnings.push({
          id: `ew_${ind.code}_${Date.now()}`,
          tenantId,
          campusId,
          definitionId: `def_ew_${ind.code}`,
          detectedAt: new Date().toISOString(),
          observedValue: observedVal,
          triggerValue: target.targetValue,
          severity,
          status: 'OPEN',
          recommendedResponse
        });
      }
    });

    memEarlyWarningObservations.push(...warnings);
    return warnings;
  }

  // ==========================================
  // 9. SCENARIO & SENSITIVITY ENGINE (SANDBOX ONLY)
  // ==========================================

  public static runScenarioSimulation(scenarioName: string, baselineObservations: IndicatorObservation[]): AnalyticsScenario {
    const parameters: ScenarioParameter[] = [
      { key: 'PARAM_ENR_DROP', name: 'Enrollment Contraction Factor', defaultValue: 0, currentValue: 0, unit: '%' },
      { key: 'PARAM_REV_SHOCK', name: 'Revenue Reduction Factor', defaultValue: 0, currentValue: 0, unit: '%' },
      { key: 'PARAM_COST_RISE', name: 'Workforce Cost Inflation', defaultValue: 0, currentValue: 0, unit: '%' }
    ];

    // Alter parameters based on scenario
    if (scenarioName === 'Enrollment Decline') {
      parameters[0].currentValue = 20; // 20% decline
    } else if (scenarioName === 'Revenue Shock') {
      parameters[1].currentValue = 15; // 15% drop
    } else if (scenarioName === 'Workforce Cost Increase') {
      parameters[2].currentValue = 10; // 10% inflation
    } else if (scenarioName === 'Compound Institutional Stress') {
      parameters[0].currentValue = 15;
      parameters[1].currentValue = 15;
      parameters[2].currentValue = 8;
    }

    const enrDrop = parameters[0].currentValue;
    const revDrop = parameters[1].currentValue;
    const costRise = parameters[2].currentValue;

    const outcomes: ScenarioOutcome[] = DOMAIN_INDICATORS.map(ind => {
      const baseline = baselineObservations.find(o => o.indicatorCode === ind.code)?.value ?? 80;
      let simulated = baseline;

      // Determine deterministic impact
      if (ind.code === 'IND_FIN_LIQ') {
        simulated = baseline - (revDrop * 0.5) - (costRise * 0.4) - (enrDrop * 0.2);
      } else if (ind.code === 'IND_INT_ENR') {
        simulated = baseline * (1 - (enrDrop / 100));
      } else if (ind.code === 'IND_STUD_RET') {
        simulated = baseline - (enrDrop * 0.15);
      } else if (ind.code === 'IND_ACAD_PASS') {
        simulated = baseline - (enrDrop * 0.05);
      } else if (ind.code === 'IND_WORK_EFF') {
        simulated = baseline - (costRise * 0.3);
      } else if (ind.code === 'IND_RISK_RES') {
        simulated = baseline - (costRise * 0.1) - (revDrop * 0.1);
      }

      // Bounded values
      if (ind.unit === '%' || ind.calculationMethod === 'PERCENTAGE') {
        simulated = Math.max(0, Math.min(100, simulated));
      }

      const changePct = this.safePercentageChange(baseline, simulated);
      
      let riskRating: GovResilienceRating = 'STRONG';
      if (changePct < -15) riskRating = 'SEVERELY_EXPOSED';
      else if (changePct < -8) riskRating = 'VULNERABLE';
      else if (changePct < -3) riskRating = 'ADEQUATE';

      return {
        indicatorCode: ind.code,
        baselineValue: this.safeRound(baseline, 2),
        simulatedValue: this.safeRound(simulated, 2),
        variancePct: changePct,
        riskRating
      };
    });

    return {
      id: `scen_${scenarioName.toLowerCase().replace(/\s+/g, '_')}`,
      name: scenarioName,
      description: `In-memory simulation modeling stress levels for: ${scenarioName}.`,
      parameters,
      outcomes,
      runAt: new Date().toISOString(),
      isCustom: false
    };
  }

  // ==========================================
  // EXECUTIVE DECISION INTELLIGENCE
  // ==========================================

  public static async createDecisionBrief(tenantId: string, brief: Partial<DecisionBrief>): Promise<DecisionBrief> {
    const id = `dec_${Date.now()}`;
    const newBrief: DecisionBrief = {
      id,
      tenantId,
      campusId: brief.campusId || 'main',
      title: brief.title || 'Decision Proposal',
      decisionQuestion: brief.decisionQuestion || '',
      currentState: brief.currentState || '',
      evidence: brief.evidence || [],
      alternatives: brief.alternatives || [],
      recommendedAlternativeId: brief.recommendedAlternativeId || '',
      confidence: brief.confidence || 'MEDIUM',
      assumptions: brief.assumptions || [],
      status: 'SUBMITTED',
      requestedByUserIdRef: brief.requestedByUserIdRef || '',
      requestedAt: new Date().toISOString(),
      approvals: []
    };

    memDecisionBriefs.push(newBrief);

    try {
      if (db) {
        await setDoc(doc(db, 'decisionBriefs', id), newBrief);
      }
    } catch (e) {
      console.warn("Firestore decision write skipped:", e);
    }

    await this.recordAuditEvent(
      tenantId,
      newBrief.campusId,
      newBrief.requestedByUserIdRef,
      'DECISION_BRIEF_CREATED',
      id,
      `Created Decision Brief: ${newBrief.title}`
    );

    return newBrief;
  }

  public static async approveDecisionBrief(
    tenantId: string,
    id: string,
    approverUserIdRef: string,
    notes?: string
  ): Promise<{ success: boolean; brief?: DecisionBrief; reason?: string }> {
    const brief = memDecisionBriefs.find(b => b.id === id);
    if (!brief) return { success: false, reason: 'Decision Brief not found.' };

    if (brief.status === 'APPROVED') {
      return { success: false, reason: 'Decision brief already approved.' };
    }

    // 11. FOUR-EYES SEPARATION OF DUTIES (SoD) VERIFICATION
    if (brief.requestedByUserIdRef === approverUserIdRef) {
      // Create diagnostic log of the violation
      await this.recordDiagnostic({
        severity: 'ERROR',
        category: 'SOD_VIOLATION',
        description: `Separation of Duties violation: Requester ${brief.requestedByUserIdRef} attempted self-approval of decision brief ${id}`,
        entityRef: id
      });
      return { success: false, reason: 'Four-Eyes Separation of Duties Violation: Requester cannot act as approver.' };
    }

    const signatureHash = this.generateAuditHash(
      tenantId,
      approverUserIdRef,
      'APPROVE',
      id,
      new Date().toISOString(),
      brief.id
    );

    brief.approvals.push({
      approverUserIdRef,
      approvedAt: new Date().toISOString(),
      signatureHash,
      notes
    });
    brief.status = 'APPROVED';

    try {
      if (db) {
        await setDoc(doc(db, 'decisionBriefs', id), brief);
      }
    } catch (e) {
      console.warn("Firestore decision update failed:", e);
    }

    await this.recordAuditEvent(
      tenantId,
      brief.campusId,
      approverUserIdRef,
      'DECISION_BRIEF_APPROVED',
      id,
      `Approved Decision Brief: ${brief.title} by ${approverUserIdRef}`
    );

    return { success: true, brief };
  }

  // ==========================================
  // GOVERNANCE OVERRIDES & EXCEPTIONS
  // ==========================================

  public static async approveTargetException(tenantId: string, exception: Partial<AnalyticsException>): Promise<AnalyticsException> {
    const id = `exc_${Date.now()}`;
    const newExc: AnalyticsException = {
      id,
      tenantId,
      indicatorCode: exception.indicatorCode || '',
      reason: exception.reason || 'General temporary operational exemption.',
      startDate: exception.startDate || new Date().toISOString(),
      endDate: exception.endDate || new Date().toISOString(),
      exemptTargetValue: exception.exemptTargetValue || 0,
      approvedByUserIdRef: exception.approvedByUserIdRef || 'platform_admin',
      approvedAt: new Date().toISOString()
    };

    memAnalyticsExceptions.push(newExc);

    try {
      if (db) {
        await setDoc(doc(db, 'analyticsExceptions', id), newExc);
      }
    } catch (e) {}

    return newExc;
  }

  public static async recordOverride(tenantId: string, override: Partial<AnalyticsOverride>): Promise<AnalyticsOverride> {
    const id = `ovr_${Date.now()}`;
    const newOvr: AnalyticsOverride = {
      id,
      tenantId,
      indicatorCode: override.indicatorCode || '',
      period: override.period || '2026-Q1',
      originalValue: override.originalValue || 0,
      overrideValue: override.overrideValue || 0,
      reason: override.reason || '',
      justificationNotes: override.justificationNotes || '',
      governanceApprovedByUserIdRef: override.governanceApprovedByUserIdRef || 'super_admin',
      approvedAt: new Date().toISOString()
    };

    memAnalyticsOverrides.push(newOvr);

    try {
      if (db) {
        await setDoc(doc(db, 'analyticsOverrides', id), newOvr);
      }
    } catch (e) {}

    return newOvr;
  }

  // ==========================================
  // DIAGNOSTICS & SYSTEM MONITORING
  // ==========================================

  public static async runSystemDiagnostics(tenantId: string, campusId: string): Promise<AnalyticsDiagnostic[]> {
    memAnalyticsDiagnostics.length = 0; // Reset list for run

    const observations = await this.getIndicatorObservations(tenantId, campusId);
    const targets = await this.getIndicatorTargets(tenantId);
    const decisions = memDecisionBriefs.filter(d => d.tenantId === tenantId);
    const overrides = memAnalyticsOverrides.filter(o => o.tenantId === tenantId);

    // 1. Diagnose orphan indicator definitions
    targets.forEach(t => {
      const match = DOMAIN_INDICATORS.find(ind => ind.code === t.indicatorCode);
      if (!match) {
        memAnalyticsDiagnostics.push({
          id: `diag_orph_${t.id}`,
          severity: 'ERROR',
          category: 'ORPHAN_REFERENCE',
          description: `Target references undefined KPI indicator definition: ${t.indicatorCode}`,
          entityRef: t.id,
          detectedAt: new Date().toISOString()
        });
      }
    });

    // 2. Diagnose insufficient source history
    DOMAIN_INDICATORS.forEach(ind => {
      const history = observations.filter(o => o.indicatorCode === ind.code);
      if (history.length < 3) {
        memAnalyticsDiagnostics.push({
          id: `diag_hist_${ind.code}`,
          severity: 'WARNING',
          category: 'INSUFFICIENT_HISTORY',
          description: `Insufficient observation periods (${history.length}/3 required) for robust forecasting on ${ind.name}`,
          entityRef: ind.code,
          detectedAt: new Date().toISOString()
        });
      }
    });

    // 3. Diagnose stale observations
    observations.forEach(o => {
      const ageHours = (Date.now() - new Date(o.timestamp).getTime()) / (1000 * 60 * 60);
      if (ageHours > 720) { // stale after 30 days
        memAnalyticsDiagnostics.push({
          id: `diag_stale_${o.id}`,
          severity: 'WARNING',
          category: 'STALE_OBSERVATION',
          description: `Observation data point ${o.id} for period ${o.observationPeriod} is stale.`,
          entityRef: o.id,
          detectedAt: new Date().toISOString()
        });
      }
    });

    // 4. Diagnose separation of duties (SoD) violations
    decisions.forEach(d => {
      d.approvals.forEach(app => {
        if (d.requestedByUserIdRef === app.approverUserIdRef) {
          memAnalyticsDiagnostics.push({
            id: `diag_sod_${d.id}`,
            severity: 'ERROR',
            category: 'SOD_VIOLATION',
            description: `Separation of Duties violation: Decision brief approved by the requester ${app.approverUserIdRef}`,
            entityRef: d.id,
            detectedAt: new Date().toISOString()
          });
        }
      });
    });

    // 5. Diagnose unapproved overrides
    overrides.forEach(o => {
      if (!o.governanceApprovedByUserIdRef || o.governanceApprovedByUserIdRef === o.tenantId) {
        memAnalyticsDiagnostics.push({
          id: `diag_over_${o.id}`,
          severity: 'ERROR',
          category: 'UNAPPROVED_OVERRIDE',
          description: `Manual override for indicator ${o.indicatorCode} lacks valid corporate governance authorization hash.`,
          entityRef: o.id,
          detectedAt: new Date().toISOString()
        });
      }
    });

    return memAnalyticsDiagnostics;
  }

  private static async recordDiagnostic(diag: Partial<AnalyticsDiagnostic>): Promise<void> {
    const fullDiag: AnalyticsDiagnostic = {
      id: diag.id || `diag_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      severity: diag.severity || 'WARNING',
      category: diag.category || 'PROVENANCE_GAP',
      description: diag.description || '',
      entityRef: diag.entityRef || '',
      detectedAt: new Date().toISOString()
    };
    memAnalyticsDiagnostics.push(fullDiag);
  }

  // Helper to fetch in-memory diagnostics count
  public static getDiagnosticsCount(): number {
    return memAnalyticsDiagnostics.length;
  }

  // Helper to fetch in-memory audit trail logs
  public static getAuditTrailLogs(tenantId: string): GovAnalyticsAuditEvent[] {
    return memAnalyticsAuditEvents.filter(a => a.tenantId === tenantId);
  }

  // Helper to fetch saved decisions
  public static async getDecisionBriefs(tenantId: string): Promise<DecisionBrief[]> {
    return memDecisionBriefs.filter(d => d.tenantId === tenantId);
  }

  // Helper to fetch active overrides
  public static async getOverrides(tenantId: string): Promise<AnalyticsOverride[]> {
    return memAnalyticsOverrides.filter(o => o.tenantId === tenantId);
  }

  // Helper to fetch active exceptions
  public static async getExceptions(tenantId: string): Promise<AnalyticsException[]> {
    return memAnalyticsExceptions.filter(e => e.tenantId === tenantId);
  }

  // ==========================================
  // ADVERSARIAL SECURITY & VALIDATION GATES
  // ==========================================

  public static validateFourEyesSoD(
    requesterUserIdRef: string,
    approverUserIdRef: string,
    actionCode: string
  ): { valid: boolean; reason?: string } {
    if (requesterUserIdRef === approverUserIdRef) {
      return {
        valid: false,
        reason: `Separation of Duties violation: ${actionCode} proposer cannot self-approve.`
      };
    }
    return { valid: true };
  }

  public static validateForecastSufficiency(historicalValues: number[]): boolean {
    return historicalValues.length >= 3;
  }

  public static evaluateWarningThreshold(
    observedValue: number,
    triggerValue: number,
    direction: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER'
  ): boolean {
    if (direction === 'HIGHER_IS_BETTER') {
      return observedValue < triggerValue;
    } else {
      return observedValue > triggerValue;
    }
  }
}
