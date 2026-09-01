import {
  ContractStrategyGovernance,
  ContractPlanGovernance,
  ContractIntakeGovernance,
  ContractClassificationGovernance,
  ContractGovernanceReference,
  ContractVersionGovernance,
  ContractApprovalGovernance,
  ContractRiskAssessment,
  ContractRiskMitigation,
  ContractLegalReview,
  ContractComplianceReview,
  ContractCommercialReview,
  ContractSecurityReview,
  ContractPrivacyReview,
  ContractExecutionGovernance,
  ContractObligation,
  ContractObligationEvidence,
  ContractObligationException,
  ContractMilestone,
  ContractMilestoneObservation,
  ContractSLAGovernance,
  ContractSLAObservation,
  ContractPerformanceObservation,
  ContractRenewalObservation,
  ContractAmendmentGovernance,
  ContractTerminationGovernance,
  ContractDisputeGovernance,
  ContractClaimObservation,
  ContractExceptionGovernance,
  ContractControl,
  ContractControlTest,
  ContractControlException,
  ContractResilienceAssessment,
  ContractDependencyObservation,
  ContractDecisionGovernance,
  ContractAssuranceEvent,
  ContractAuditEvent,
  ContractDiagnosticFinding,
  ContractSimulationScenario,
  ContractSimulationType
} from '../types/contractGovernance';

export class ContractGovernanceService {
  static async logAudit(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: any = null,
    justification?: string,
    correlationId?: string
  ): Promise<ContractAuditEvent> {
    const event: ContractAuditEvent = {
      id: `cgaudit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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

  static validateSoD(proposerId: string, approverId: string, actionName: string = 'Contract Approval') {
    if (proposerId && approverId && proposerId === approverId) {
      throw new Error(`Separation of Duties violation: Proposer cannot self-approve ${actionName}.`);
    }
  }

  static validateIntakeTransition(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'DRAFT': ['SUBMITTED', 'ARCHIVED'],
      'SUBMITTED': ['SCREENING', 'REVIEW', 'ARCHIVED'],
      'SCREENING': ['REVIEW', 'APPROVAL', 'ARCHIVED'],
      'REVIEW': ['APPROVAL', 'ARCHIVED'],
      'APPROVAL': ['EXECUTION', 'ARCHIVED'],
      'EXECUTION': ['ACTIVE', 'ARCHIVED'],
      'ACTIVE': ['CLOSED', 'ARCHIVED'],
      'CLOSED': ['ARCHIVED'],
      'ARCHIVED': []
    };
    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid contract intake status transition from ${currentStatus} to ${nextStatus}`);
    }
  }

  static validateObligationTransition(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'IDENTIFIED': ['ACTIVE', 'WAIVED', 'CLOSED'],
      'ACTIVE': ['DUE', 'COMPLETED', 'BREACHED', 'WAIVED', 'CLOSED'],
      'DUE': ['COMPLETED', 'BREACHED', 'WAIVED', 'CLOSED'],
      'COMPLETED': ['CLOSED'],
      'BREACHED': ['COMPLETED', 'WAIVED', 'CLOSED'],
      'WAIVED': ['CLOSED'],
      'CLOSED': []
    };
    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid contract obligation lifecycle transition from ${currentStatus} to ${nextStatus}`);
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

  static runContractSimulation(
    tenantId: string,
    simulationType: ContractSimulationType,
    baseContractsCount: number = 10
  ): ContractSimulationScenario {
    let affectedDependenciesMultiplier = 0.4;
    let impactedObligationsMultiplier = 1.2;
    let continuityExposureHours = 48;
    let resilienceRating: ContractSimulationScenario['simulatedResilienceRating'] = 'ADEQUATE';

    switch (simulationType) {
      case 'CRITICAL_CONTRACT_TERMINATION':
        affectedDependenciesMultiplier = 0.8;
        impactedObligationsMultiplier = 2.5;
        continuityExposureHours = 120;
        resilienceRating = 'VULNERABLE';
        break;
      case 'SUPPLIER_DEFAULT':
        affectedDependenciesMultiplier = 0.9;
        impactedObligationsMultiplier = 3.0;
        continuityExposureHours = 180;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
      case 'SLA_FAILURE':
        affectedDependenciesMultiplier = 0.3;
        impactedObligationsMultiplier = 0.8;
        continuityExposureHours = 24;
        resilienceRating = 'ADEQUATE';
        break;
      case 'CYBER_INCIDENT':
        affectedDependenciesMultiplier = 0.85;
        impactedObligationsMultiplier = 2.8;
        continuityExposureHours = 144;
        resilienceRating = 'VULNERABLE';
        break;
      case 'DATA_BREACH':
        affectedDependenciesMultiplier = 0.75;
        impactedObligationsMultiplier = 2.2;
        continuityExposureHours = 96;
        resilienceRating = 'VULNERABLE';
        break;
      case 'FORCE_MAJEURE':
        affectedDependenciesMultiplier = 0.95;
        impactedObligationsMultiplier = 3.5;
        continuityExposureHours = 240;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
      case 'RENEWAL_FAILURE':
        affectedDependenciesMultiplier = 0.5;
        impactedObligationsMultiplier = 1.5;
        continuityExposureHours = 72;
        resilienceRating = 'ADEQUATE';
        break;
      case 'KEY_OBLIGATION_BREACH':
        affectedDependenciesMultiplier = 0.6;
        impactedObligationsMultiplier = 2.0;
        continuityExposureHours = 80;
        resilienceRating = 'VULNERABLE';
        break;
      case 'SUPPLIER_EXIT':
        affectedDependenciesMultiplier = 0.9;
        impactedObligationsMultiplier = 3.2;
        continuityExposureHours = 200;
        resilienceRating = 'SEVERELY_EXPOSED';
        break;
      case 'SERVICE_INTERRUPTION':
        affectedDependenciesMultiplier = 0.4;
        impactedObligationsMultiplier = 1.0;
        continuityExposureHours = 36;
        resilienceRating = 'STRONG';
        break;
    }

    const simulatedAffectedDependenciesCount = Math.round(baseContractsCount * affectedDependenciesMultiplier);
    const simulatedImpactedObligationsCount = Math.round(baseContractsCount * impactedObligationsMultiplier);

    return {
      id: `cgscen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      campusScope: 'GLOBAL',
      title: `Simulation: ${simulationType}`,
      simulationType,
      parametersJson: JSON.stringify({ baseContractsCount, affectedDependenciesMultiplier }),
      simulatedAffectedDependenciesCount,
      simulatedImpactedObligationsCount,
      simulatedContinuityExposureHours: continuityExposureHours,
      simulatedResilienceRating: resilienceRating,
      isSandbox: true,
      idempotencyKey: `sim_${simulationType}_${Date.now()}`,
      createdBy: 'system_contract_resilience_engine',
      createdAt: new Date().toISOString()
    };
  }

  static runContractGovernanceDiagnostics(
    tenantId: string,
    strategies: ContractStrategyGovernance[],
    plans: ContractPlanGovernance[],
    intakes: ContractIntakeGovernance[],
    references: ContractGovernanceReference[],
    approvals: ContractApprovalGovernance[],
    risks: ContractRiskAssessment[],
    riskMitigations: ContractRiskMitigation[],
    legalReviews: ContractLegalReview[],
    complianceReviews: ContractComplianceReview[],
    securityReviews: ContractSecurityReview[],
    privacyReviews: ContractPrivacyReview[],
    executions: ContractExecutionGovernance[],
    obligations: ContractObligation[],
    exceptions: ContractExceptionGovernance[],
    renewals: ContractRenewalObservation[],
    amendments: ContractAmendmentGovernance[],
    terminations: ContractTerminationGovernance[],
    disputes: ContractDisputeGovernance[],
    controls: ContractControl[]
  ): ContractDiagnosticFinding[] {
    const diagnostics: ContractDiagnosticFinding[] = [];
    const now = new Date().toISOString();

    strategies.forEach(s => {
      if (s.status === 'DRAFT' && (!s.strategicObjectives || s.strategicObjectives.length === 0)) {
        diagnostics.push({
          type: 'STRATEGY_MISSING_OBJECTIVES',
          entityId: s.id,
          description: `Contract strategy "${s.title}" has no defined strategic objectives.`
        });
      }
    });

    plans.forEach(p => {
      if (!p.strategyId) {
        diagnostics.push({
          type: 'ORPHAN_CONTRACT_PLAN',
          entityId: p.id,
          description: `Contract plan for horizon ${p.fiscalHorizon} is an orphan with no strategic anchor.`
        });
      }
    });

    intakes.forEach(i => {
      if (i.proposerId && i.approvedBy && i.proposerId === i.approvedBy) {
        diagnostics.push({
          type: 'SELF_APPROVED_CONTRACT_INTAKE',
          entityId: i.id,
          description: `Contract intake ${i.id} has identical proposer and approver (SoD Violation).`
        });
      }
    });

    references.forEach(r => {
      if (r.criticality === 'MISSION_CRITICAL' || r.criticality === 'CRITICAL') {
        const hasRisk = risks.some(rk => rk.contractGovernanceRefId === r.id);
        if (!hasRisk) {
          diagnostics.push({
            type: 'CRITICAL_CONTRACT_MISSING_RISK_ASSESSMENT',
            entityId: r.id,
            description: `Critical contract "${r.title}" (${r.contractIdRef}) lacks a comprehensive risk assessment.`
          });
        }
      }
    });

    riskMitigations.forEach(rm => {
      if (rm.lifecycle === 'PLANNED' || rm.lifecycle === 'IN_PROGRESS') {
        if (rm.dueDate && rm.dueDate < now) {
          diagnostics.push({
            type: 'EXPIRED_RISK_MITIGATION',
            entityId: rm.id,
            description: `Risk mitigation "${rm.identifiedRiskTitle}" has passed its target completion due date.`
          });
        }
      }
    });

    executions.forEach(ex => {
      if (ex.executionReadiness === 'READY' && (!ex.mandatoryFourEyesApprovalPassed || !ex.mandatoryLegalReviewPassed)) {
        diagnostics.push({
          type: 'EXECUTION_READINESS_WITHOUT_MANDATORY_CHECKS',
          entityId: ex.id,
          description: `Contract execution ${ex.id} is marked READY despite incomplete mandatory reviews or four-eyes approvals.`
        });
      }
    });

    obligations.forEach(ob => {
      if (!ob.ownerId) {
        diagnostics.push({
          type: 'OBLIGATION_WITHOUT_OWNER',
          entityId: ob.id,
          description: `Contract obligation "${ob.obligationTitle}" has no assigned responsible owner.`
        });
      }
      if (ob.lifecycle === 'ACTIVE' || ob.lifecycle === 'DUE') {
        if (ob.dueDate && ob.dueDate < now) {
          diagnostics.push({
            type: 'OVERDUE_CONTRACT_OBLIGATION',
            entityId: ob.id,
            description: `Contract obligation "${ob.obligationTitle}" is overdue past target date ${ob.dueDate}.`
          });
        }
      }
    });

    exceptions.forEach(exc => {
      if (exc.status === 'ACTIVE' && exc.expiryDate && exc.expiryDate < now) {
        diagnostics.push({
          type: 'EXPIRED_EXCEPTION_ACTIVE',
          entityId: exc.id,
          description: `Contract exception ${exc.id} has expired but remains marked as ACTIVE.`
        });
      }
    });

    renewals.forEach(ren => {
      if (ren.reviewWindowStatus === 'MISSED_DEADLINE' || (ren.unresolvedRisksCount > 0 && ren.recommendation === 'RENEW')) {
        diagnostics.push({
          type: 'HIGH_RISK_RENEWAL_ANOMALY',
          entityId: ren.id,
          description: `Contract renewal observation ${ren.id} recommends renewal despite unresolved risks or missed review window.`
        });
      }
    });

    amendments.forEach(am => {
      if (am.materiality === 'MATERIAL' && am.proposerId === am.approverId) {
        diagnostics.push({
          type: 'SELF_APPROVED_MATERIAL_AMENDMENT',
          entityId: am.id,
          description: `Material amendment ${am.id} violates SoD with matching proposer and approver.`
        });
      }
    });

    disputes.forEach(d => {
      if (d.disputeStatus === 'ESCALATED' && !d.legalReviewRef) {
        diagnostics.push({
          type: 'ESCALATED_DISPUTE_WITHOUT_LEGAL_REVIEW',
          entityId: d.id,
          description: `Escalated contract dispute ${d.disputeIdRef} has no referenced formal legal review.`
        });
      }
    });

    controls.forEach(c => {
      if (c.status === 'FAILED') {
        diagnostics.push({
          type: 'FAILED_CONTRACT_GOVERNANCE_CONTROL',
          entityId: c.id,
          description: `Contract governance control ${c.code} (${c.title}) is currently in FAILED state.`
        });
      }
    });

    return diagnostics;
  }
}
