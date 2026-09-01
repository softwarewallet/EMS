import {
  ProcurementStrategy,
  ProcurementPlan,
  ProcurementRequestGovernance,
  BidEvaluationGovernance,
  VendorGovernance,
  VendorDueDiligence,
  VendorRiskAssessment,
  SingleSourceJustification,
  EmergencyProcurementGovernance,
  ProcurementControlException,
  SupplierDisruptionScenario,
  ProcurementAuditEvent,
  ProcurementDiagnosticFinding
} from '../types/procurementGovernance';

export class ProcurementGovernanceService {
  static async logAudit(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: any = null,
    justification?: string,
    correlationId?: string
  ): Promise<ProcurementAuditEvent> {
    const event: ProcurementAuditEvent = {
      id: `pgaudit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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

  static validateSoD(requesterId: string, approverId: string, actionName: string = 'Procurement Approval') {
    if (requesterId && approverId && requesterId === approverId) {
      throw new Error(`Separation of Duties violation: Requester cannot self-approve ${actionName}.`);
    }
  }

  static validateEvaluatorIndependence(evaluatorId: string, coiDeclared: boolean, coiResolved: boolean = false) {
    if (coiDeclared && !coiResolved) {
      throw new Error(`Conflict of Interest violation: Evaluator ${evaluatorId} has an unresolved conflict of interest.`);
    }
  }

  static validateRequestStatusTransition(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'DRAFT': ['SUBMITTED', 'CANCELLED'],
      'SUBMITTED': ['UNDER_REVIEW', 'SOURCING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      'UNDER_REVIEW': ['SOURCING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      'SOURCING': ['APPROVED', 'REJECTED', 'CANCELLED'],
      'APPROVED': ['CLOSED'],
      'REJECTED': ['CLOSED'],
      'CANCELLED': [],
      'CLOSED': []
    };

    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid procurement request status transition from ${currentStatus} to ${nextStatus}`);
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

  static runSupplierDisruptionScenario(
    tenantId: string,
    disruptionType: SupplierDisruptionScenario['disruptionType'],
    baseServicesCount: number = 10
  ): SupplierDisruptionScenario {
    let affectedCountMultiplier = 0.3;
    let alternativeAvailability = 70;
    let recoveryTimeHours = 24;
    let resilienceRating: SupplierDisruptionScenario['simulatedResilienceRating'] = 'ADEQUATE';

    switch (disruptionType) {
      case 'CRITICAL_SUPPLIER_OUTAGE':
        affectedCountMultiplier = 0.5;
        alternativeAvailability = 40;
        recoveryTimeHours = 72;
        resilienceRating = 'VULNERABLE';
        break;
      case 'SUPPLIER_BANKRUPTCY':
        affectedCountMultiplier = 0.8;
        alternativeAvailability = 20;
        recoveryTimeHours = 240;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
      case 'CYBER_COMPROMISE':
        affectedCountMultiplier = 0.6;
        alternativeAvailability = 30;
        recoveryTimeHours = 120;
        resilienceRating = 'VULNERABLE';
        break;
      case 'GEOGRAPHIC_DISRUPTION':
        affectedCountMultiplier = 0.4;
        alternativeAvailability = 60;
        recoveryTimeHours = 48;
        resilienceRating = 'ADEQUATE';
        break;
      case 'LOGISTICS_FAILURE':
        affectedCountMultiplier = 0.35;
        alternativeAvailability = 65;
        recoveryTimeHours = 36;
        resilienceRating = 'ADEQUATE';
        break;
      case 'QUALITY_FAILURE':
        affectedCountMultiplier = 0.25;
        alternativeAvailability = 80;
        recoveryTimeHours = 18;
        resilienceRating = 'STRONG';
        break;
      case 'CONTRACT_TERMINATION':
        affectedCountMultiplier = 0.7;
        alternativeAvailability = 25;
        recoveryTimeHours = 168;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
      case 'PRICE_SHOCK':
        affectedCountMultiplier = 0.45;
        alternativeAvailability = 50;
        recoveryTimeHours = 72;
        resilienceRating = 'VULNERABLE';
        break;
      case 'SOLE_SOURCE_FAILURE':
        affectedCountMultiplier = 0.9;
        alternativeAvailability = 10;
        recoveryTimeHours = 360;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
    }

    const simulatedAffectedServicesCount = Math.round(baseServicesCount * affectedCountMultiplier);

    return {
      id: `pgscen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      campusScope: 'GLOBAL',
      title: `Simulation: ${disruptionType}`,
      disruptionType,
      parametersJson: JSON.stringify({ baseServicesCount, affectedCountMultiplier }),
      simulatedAffectedServicesCount,
      simulatedAlternativeAvailabilityScore: alternativeAvailability,
      simulatedRecoveryTimeHours: recoveryTimeHours,
      simulatedResilienceRating: resilienceRating,
      isSandbox: true,
      createdBy: 'system_supplier_disruption_engine',
      createdAt: new Date().toISOString()
    };
  }

  static runProcurementGovernanceDiagnostics(
    tenantId: string,
    strategies: ProcurementStrategy[],
    plans: ProcurementPlan[],
    requests: ProcurementRequestGovernance[],
    evaluations: BidEvaluationGovernance[],
    vendors: VendorGovernance[],
    dueDiligences: VendorDueDiligence[],
    riskAssessments: VendorRiskAssessment[],
    singleSources: SingleSourceJustification[],
    emergencies: EmergencyProcurementGovernance[],
    exceptions: ProcurementControlException[]
  ): ProcurementDiagnosticFinding[] {
    const diagnostics: ProcurementDiagnosticFinding[] = [];
    const now = new Date().toISOString();

    strategies.forEach(s => {
      if (s.status === 'DRAFT' && (!s.strategicObjectives || s.strategicObjectives.length === 0)) {
        diagnostics.push({
          type: 'STRATEGY_MISSING_OBJECTIVES',
          entityId: s.id,
          description: `Procurement strategy "${s.title}" has no defined strategic objectives.`
        });
      }
    });

    plans.forEach(p => {
      if (!p.strategyId) {
        diagnostics.push({
          type: 'ORPHAN_PROCUREMENT_PLAN',
          entityId: p.id,
          description: `Procurement plan for ${p.fiscalPeriod} does not reference an authoritative strategy.`
        });
      }
    });

    requests.forEach(r => {
      if (r.status === 'SUBMITTED' && r.requesterId === r.approvedBy) {
        diagnostics.push({
          type: 'SELF_APPROVED_PROCUREMENT_REQUEST',
          entityId: r.id,
          description: `Procurement request ${r.id} has matching requester and approver identities (SoD Violation).`
        });
      }
    });

    evaluations.forEach(ev => {
      if (ev.coiDeclared && !ev.evaluatorIndependenceVerified) {
        diagnostics.push({
          type: 'UNRESOLVED_EVALUATOR_COI',
          entityId: ev.id,
          description: `Bid evaluation ${ev.id} has declared Conflict of Interest without verified independence.`
        });
      }
    });

    vendors.forEach(v => {
      if ((v.criticality === 'MISSION_CRITICAL' || v.criticality === 'BUSINESS_CRITICAL') && v.status === 'ACTIVE') {
        const hasRisk = riskAssessments.some(ra => ra.vendorGovernanceId === v.id);
        if (!hasRisk) {
          diagnostics.push({
            type: 'CRITICAL_VENDOR_MISSING_RISK_ASSESSMENT',
            entityId: v.id,
            description: `Critical vendor "${v.vendorName}" has no active risk assessment on record.`
          });
        }
      }
    });

    dueDiligences.forEach(dd => {
      if (dd.overallStatus === 'VERIFIED' && dd.expiryDate && dd.expiryDate < now) {
        diagnostics.push({
          type: 'EXPIRED_DUE_DILIGENCE_ACTIVE',
          entityId: dd.id,
          description: `Vendor due diligence ${dd.id} has passed expiry date but remains marked VERIFIED.`
        });
      }
    });

    singleSources.forEach(ss => {
      if (ss.status === 'PROPOSED' && ss.requesterId === ss.approverId) {
        diagnostics.push({
          type: 'SELF_APPROVED_SINGLE_SOURCE',
          entityId: ss.id,
          description: `Single-source justification ${ss.id} has matching requester and approver (SoD Violation).`
        });
      }
    });

    emergencies.forEach(em => {
      if (em.status === 'EXPIRED' && !em.postEventReviewCompleted) {
        diagnostics.push({
          type: 'UNREVIEWED_EXPIRED_EMERGENCY_PROCUREMENT',
          entityId: em.id,
          description: `Emergency procurement ${em.id} expired without post-event review completion.`
        });
      }
    });

    exceptions.forEach(ex => {
      if (ex.status === 'ACTIVE' && ex.expiryDate && ex.expiryDate < now) {
        diagnostics.push({
          type: 'EXPIRED_EXCEPTION_ACTIVE',
          entityId: ex.id,
          description: `Procurement control exception ${ex.id} has passed expiry date but remains marked ACTIVE.`
        });
      }
    });

    return diagnostics;
  }
}
