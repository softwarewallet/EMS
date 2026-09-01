import {
  WorkforceStrategy,
  WorkforcePlan,
  WorkforceScenario,
  PerformanceCycle,
  PerformanceReview,
  SuccessionPlan,
  HumanCapitalAuditEvent,
  HumanCapitalException
} from '../types/humanCapitalGovernance';

export class HumanCapitalGovernanceService {
  static async logAudit(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: any = null,
    justification?: string
  ): Promise<HumanCapitalAuditEvent> {
    const event: HumanCapitalAuditEvent = {
      id: `hcevt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope: resultingState?.campusScope || 'GLOBAL',
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      resultingState,
      justification
    };
    return event;
  }

  static validateSoD(requesterId: string, approverId: string, actionName: string = 'Approval') {
    if (requesterId && approverId && requesterId === approverId) {
      throw new Error(`Separation of Duties violation: Requester cannot self-approve ${actionName}.`);
    }
  }

  static validatePerformanceCycleTransition(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'DRAFT': ['OPEN', 'ARCHIVED'],
      'OPEN': ['ACTIVE', 'DRAFT'],
      'ACTIVE': ['REVIEW', 'OPEN'],
      'REVIEW': ['CALIBRATION', 'CLOSED'],
      'CALIBRATION': ['CLOSED', 'REVIEW'],
      'CLOSED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid performance cycle status transition from ${currentStatus} to ${nextStatus}`);
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

  static runWorkforceScenario(
    tenantId: string,
    scenarioType: WorkforceScenario['scenarioType'],
    baseCapacity: number,
    baseDemand: number
  ): WorkforceScenario {
    let capGapMultiplier = 0.1;
    let skillGapCount = 5;
    let roleExposure = 2;

    switch (scenarioType) {
      case 'HIRING_FREEZE':
        capGapMultiplier = 0.25;
        skillGapCount = 12;
        roleExposure = 5;
        break;
      case 'EXPANSION':
        capGapMultiplier = 0.40;
        skillGapCount = 20;
        roleExposure = 8;
        break;
      case 'SKILL_SHORTAGE':
        capGapMultiplier = 0.15;
        skillGapCount = 25;
        roleExposure = 6;
        break;
      case 'RETIREMENT_CONCENTRATION':
        capGapMultiplier = 0.20;
        skillGapCount = 10;
        roleExposure = 9;
        break;
      case 'VACANCY_EXPOSURE':
        capGapMultiplier = 0.18;
        skillGapCount = 8;
        roleExposure = 12;
        break;
      case 'RESTRUCTURING':
        capGapMultiplier = 0.30;
        skillGapCount = 15;
        roleExposure = 7;
        break;
    }

    const simulatedGap = Math.round(baseDemand * capGapMultiplier);

    return {
      id: `scen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      campusScope: 'GLOBAL',
      title: `Simulation: ${scenarioType}`,
      scenarioType,
      parametersJson: JSON.stringify({ baseCapacity, baseDemand, capGapMultiplier }),
      simulatedCapacityGap: simulatedGap,
      simulatedSkillGap: skillGapCount,
      simulatedRoleExposure: roleExposure,
      createdBy: 'system_scenario_engine',
      createdAt: new Date().toISOString()
    };
  }

  static runHumanCapitalGovernanceDiagnostics(
    tenantId: string,
    strategies: WorkforceStrategy[],
    plans: WorkforcePlan[],
    performanceCycles: PerformanceCycle[],
    reviews: PerformanceReview[],
    successionPlans: SuccessionPlan[],
    exceptions: HumanCapitalException[]
  ): any[] {
    const diagnostics: any[] = [];
    const now = new Date().toISOString();

    strategies.forEach(s => {
      if (s.status === 'DRAFT' && (!s.workforceObjectives || s.workforceObjectives.length === 0)) {
        diagnostics.push({
          type: 'STRATEGY_MISSING_OBJECTIVES',
          entityId: s.id,
          description: `Workforce strategy "${s.title}" has no defined workforce objectives.`
        });
      }
    });

    plans.forEach(p => {
      if (!p.strategyId) {
        diagnostics.push({
          type: 'ORPHAN_WORKFORCE_PLAN',
          entityId: p.id,
          description: `Workforce plan "${p.title}" does not reference an authoritative workforce strategy.`
        });
      }
    });

    reviews.forEach(r => {
      if (r.staffIdRef === r.reviewerId) {
        diagnostics.push({
          type: 'SELF_APPROVED_PERFORMANCE_REVIEW',
          entityId: r.id,
          description: `Performance review ${r.id} has matching staff and reviewer identities (SoD Violation).`
        });
      }
    });

    successionPlans.forEach(sp => {
      if (sp.status === 'ACTIVE' && !sp.criticalRoleRef) {
        diagnostics.push({
          type: 'SUCCESSION_MISSING_CRITICAL_ROLE',
          entityId: sp.id,
          description: `Active succession plan ${sp.id} is not linked to a critical role.`
        });
      }
    });

    exceptions.forEach(ex => {
      if (ex.status === 'ACTIVE' && ex.expiryDate && ex.expiryDate < now) {
        diagnostics.push({
          type: 'EXPIRED_EXCEPTION_ACTIVE',
          entityId: ex.id,
          description: `Human capital exception ${ex.id} has passed expiry date but remains marked ACTIVE.`
        });
      }
    });

    return diagnostics;
  }
}
