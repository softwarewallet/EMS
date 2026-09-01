import {
  FinancialStrategy,
  FinancialPlan,
  FinancialScenario,
  BudgetFramework,
  BudgetCycle,
  BudgetEnvelope,
  BudgetAllocation,
  BudgetRequest,
  BudgetRevision,
  BudgetTransfer,
  CostCenterGovernance,
  CostObservation,
  CostOptimizationPlan,
  RevenueGovernance,
  RevenueStream,
  RevenueForecast,
  FundingSourceReference,
  CashFlowObservation,
  LiquidityObservation,
  TreasuryGovernanceReference,
  CapitalPlan,
  CapitalProjectGovernance,
  FinancialForecast,
  FinancialVarianceObservation,
  FinancialControl,
  FinancialControlTest,
  FinancialControlException,
  FinancialRisk,
  FinancialResilienceAssessment,
  FinancialApproval,
  FinancialDecision,
  FinancialAuditEvent
} from '../types/financialGovernance';

export class FinancialGovernanceService {
  static async logAudit(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: any = null,
    justification?: string,
    correlationId?: string
  ): Promise<FinancialAuditEvent> {
    const event: FinancialAuditEvent = {
      id: `fgaudit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope: resultingState?.campusScope || 'GLOBAL',
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      resultingState,
      justification,
      correlationId
    };
    return event;
  }

  static validateSoD(requesterId: string, approverId: string, actionName: string = 'Financial Approval') {
    if (requesterId && approverId && requesterId === approverId) {
      throw new Error(`Separation of Duties violation: Requester cannot self-approve ${actionName}.`);
    }
  }

  static validateBudgetCycleTransition(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'DRAFT': ['OPEN', 'ACTIVE'],
      'OPEN': ['ACTIVE', 'LOCKED'],
      'ACTIVE': ['LOCKED', 'MID_YEAR_ADJUSTMENT'],
      'MID_YEAR_ADJUSTMENT': ['ACTIVE', 'LOCKED'],
      'LOCKED': ['CLOSED'],
      'CLOSED': []
    };

    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid budget cycle status transition from ${currentStatus} to ${nextStatus}`);
    }
  }

  static safeDivide(num: number, denom: number): number {
    if (!denom || isNaN(denom) || !isFinite(denom) || denom === 0) return 0;
    if (isNaN(num) || !isFinite(num)) return 0;
    return num / denom;
  }

  static safeRound(num: number, decimals: number = 2): number {
    if (isNaN(num) || !isFinite(num)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  static safePercentage(num: number, denom: number): string {
    const res = this.safeDivide(num, denom) * 100;
    return `${Math.round(res)}%`;
  }

  static runFinancialScenario(
    tenantId: string,
    scenarioType: FinancialScenario['scenarioType'],
    baseBudget: number,
    baseRevenue: number
  ): FinancialScenario {
    let budgetImpactMultiplier = 0.10;
    let liquidityMultiplier = -0.05;
    let riskExposure = 35;
    let resilienceRating: FinancialScenario['simulatedResilienceRating'] = 'RESILIENT';

    switch (scenarioType) {
      case 'REVENUE_DECLINE':
        budgetImpactMultiplier = 0.15;
        liquidityMultiplier = -0.20;
        riskExposure = 70;
        resilienceRating = 'VULNERABLE';
        break;
      case 'EXPENDITURE_INCREASE':
        budgetImpactMultiplier = 0.20;
        liquidityMultiplier = -0.15;
        riskExposure = 65;
        resilienceRating = 'MODERATE';
        break;
      case 'FUNDING_REDUCTION':
        budgetImpactMultiplier = 0.25;
        liquidityMultiplier = -0.30;
        riskExposure = 80;
        resilienceRating = 'CRITICAL';
        break;
      case 'ENROLLMENT_SHOCK':
        budgetImpactMultiplier = 0.18;
        liquidityMultiplier = -0.22;
        riskExposure = 75;
        resilienceRating = 'VULNERABLE';
        break;
      case 'WORKFORCE_COST_SPIKE':
        budgetImpactMultiplier = 0.14;
        liquidityMultiplier = -0.10;
        riskExposure = 60;
        resilienceRating = 'MODERATE';
        break;
      case 'CAPEX_OVERRUN':
        budgetImpactMultiplier = 0.22;
        liquidityMultiplier = -0.18;
        riskExposure = 72;
        resilienceRating = 'VULNERABLE';
        break;
      case 'INFLATION_SURGE':
        budgetImpactMultiplier = 0.12;
        liquidityMultiplier = -0.08;
        riskExposure = 55;
        resilienceRating = 'MODERATE';
        break;
      case 'GRANT_SHORTFALL':
        budgetImpactMultiplier = 0.16;
        liquidityMultiplier = -0.14;
        riskExposure = 68;
        resilienceRating = 'VULNERABLE';
        break;
      case 'LIQUIDITY_STRESS':
        budgetImpactMultiplier = 0.30;
        liquidityMultiplier = -0.40;
        riskExposure = 90;
        resilienceRating = 'CRITICAL';
        break;
      case 'EMERGENCY_EXPENDITURE':
        budgetImpactMultiplier = 0.28;
        liquidityMultiplier = -0.25;
        riskExposure = 85;
        resilienceRating = 'CRITICAL';
        break;
      case 'COST_OPTIMIZATION':
        budgetImpactMultiplier = -0.12;
        liquidityMultiplier = 0.15;
        riskExposure = 20;
        resilienceRating = 'RESILIENT';
        break;
    }

    const simulatedBudgetImpact = Math.round(baseBudget * budgetImpactMultiplier);
    const simulatedLiquidityImpact = Math.round(baseRevenue * liquidityMultiplier);
    const simulatedRevenueGap = scenarioType.includes('REVENUE') || scenarioType.includes('FUNDING') ? Math.round(baseRevenue * 0.15) : 0;
    const simulatedCostGap = scenarioType.includes('EXPENDITURE') || scenarioType.includes('CAPEX') ? Math.round(baseBudget * 0.12) : 0;

    return {
      id: `fgscen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      campusScope: 'GLOBAL',
      title: `Simulation: ${scenarioType}`,
      scenarioType,
      parametersJson: JSON.stringify({ baseBudget, baseRevenue, budgetImpactMultiplier }),
      simulatedBudgetImpact,
      simulatedVariancePercent: this.safeRound((simulatedBudgetImpact / (baseBudget || 1)) * 100, 1),
      simulatedLiquidityImpact,
      simulatedRevenueGap,
      simulatedCostGap,
      simulatedRiskExposureScore: riskExposure,
      simulatedResilienceRating: resilienceRating,
      isSandbox: true,
      createdBy: 'system_financial_scenario_engine',
      createdAt: new Date().toISOString()
    };
  }

  static runFinancialGovernanceDiagnostics(
    tenantId: string,
    strategies: FinancialStrategy[],
    plans: FinancialPlan[],
    cycles: BudgetCycle[],
    requests: BudgetRequest[],
    revisions: BudgetRevision[],
    transfers: BudgetTransfer[],
    exceptions: FinancialControlException[],
    risks: FinancialRisk[]
  ): any[] {
    const diagnostics: any[] = [];
    const now = new Date().toISOString();

    strategies.forEach(s => {
      if (s.status === 'DRAFT' && (!s.financialObjectives || s.financialObjectives.length === 0)) {
        diagnostics.push({
          type: 'STRATEGY_MISSING_OBJECTIVES',
          entityId: s.id,
          description: `Financial strategy "${s.title}" has no defined financial objectives.`
        });
      }
    });

    plans.forEach(p => {
      if (!p.strategyId) {
        diagnostics.push({
          type: 'ORPHAN_FINANCIAL_PLAN',
          entityId: p.id,
          description: `Financial plan "${p.title}" does not reference an authoritative strategy.`
        });
      }
    });

    cycles.forEach(c => {
      if (c.status === 'ACTIVE' && c.endDate && c.endDate < now) {
        diagnostics.push({
          type: 'EXPIRED_BUDGET_CYCLE_ACTIVE',
          entityId: c.id,
          description: `Budget cycle ${c.id} for ${c.fiscalYear} is past end date but remains ACTIVE.`
        });
      }
    });

    requests.forEach(r => {
      if (r.status === 'SUBMITTED' && r.requesterId === r.approvedBy) {
        diagnostics.push({
          type: 'SELF_APPROVED_BUDGET_REQUEST',
          entityId: r.id,
          description: `Budget request ${r.id} has matching requester and approver identities (SoD Violation).`
        });
      }
    });

    revisions.forEach(rev => {
      if (rev.status === 'APPROVED' && rev.requesterId === rev.approverId) {
        diagnostics.push({
          type: 'SELF_APPROVED_BUDGET_REVISION',
          entityId: rev.id,
          description: `Budget revision ${rev.id} has matching requester and approver identities (SoD Violation).`
        });
      }
    });

    transfers.forEach(tr => {
      if (tr.status === 'APPROVED' && tr.requesterId === tr.approverId) {
        diagnostics.push({
          type: 'SELF_APPROVED_BUDGET_TRANSFER',
          entityId: tr.id,
          description: `Budget transfer ${tr.id} has matching requester and approver identities (SoD Violation).`
        });
      }
    });

    exceptions.forEach(ex => {
      if (ex.status === 'ACTIVE' && ex.expiryDate && ex.expiryDate < now) {
        diagnostics.push({
          type: 'EXPIRED_EXCEPTION_ACTIVE',
          entityId: ex.id,
          description: `Financial control exception ${ex.id} has passed expiry date but remains marked ACTIVE.`
        });
      }
    });

    risks.forEach(rk => {
      if (rk.lifecycle === 'IDENTIFIED' && !rk.mitigationPlan) {
        diagnostics.push({
          type: 'UNMITIGATED_FINANCIAL_RISK',
          entityId: rk.id,
          description: `Financial risk "${rk.title}" has no defined mitigation plan.`
        });
      }
    });

    return diagnostics;
  }
}
