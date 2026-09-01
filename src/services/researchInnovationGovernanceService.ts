import { 
  GovResearchProject,
  GovResearchProposal,
  GrantApplication,
  IPDisclosure,
  ResearchRisk,
  ResearchAuditEvent
} from '../types/researchInnovationGovernance';

export class ResearchInnovationGovernanceService {
  static async logAudit(
    tenantId: string,
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    resultingState: any = null,
    justification?: string
  ): Promise<ResearchAuditEvent> {
    const event: ResearchAuditEvent = {
      id: `rsevt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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

  static validateSoD(proposerId: string, approverId: string, actionName: string = 'Approval') {
    if (proposerId && approverId && proposerId === approverId) {
      throw new Error(`Separation of Duties violation: Proposer cannot self-approve ${actionName}.`);
    }
  }

  static validateProjectTransition(currentStatus: string, nextStatus: string) {
    const allowedTransitions: Record<string, string[]> = {
      'PROPOSED': ['APPROVED', 'DRAFT', 'CLOSED'],
      'APPROVED': ['FUNDED', 'ACTIVE', 'SUSPENDED'],
      'FUNDED': ['ACTIVE', 'SUSPENDED'],
      'ACTIVE': ['SUSPENDED', 'COMPLETED'],
      'SUSPENDED': ['ACTIVE', 'CLOSED'],
      'COMPLETED': ['CLOSED'],
      'CLOSED': ['ARCHIVED'],
      'ARCHIVED': []
    };

    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid research project transition from ${currentStatus} to ${nextStatus}`);
    }
  }

  static validateGrantApplicationStatus(currentStatus: string, nextStatus: string) {
    const allowed: Record<string, string[]> = {
      'DRAFT': ['INTERNAL_REVIEW', 'WITHDRAWN'],
      'INTERNAL_REVIEW': ['APPROVED', 'DRAFT', 'REJECTED'],
      'APPROVED': ['SUBMITTED', 'WITHDRAWN'],
      'SUBMITTED': ['UNDER_REVIEW', 'AWARDED', 'REJECTED', 'WITHDRAWN'],
      'UNDER_REVIEW': ['AWARDED', 'REJECTED', 'WITHDRAWN'],
      'AWARDED': [],
      'REJECTED': [],
      'WITHDRAWN': []
    };

    const valid = allowed[currentStatus] || [];
    if (!valid.includes(nextStatus)) {
      throw new Error(`Invalid grant application status transition from ${currentStatus} to ${nextStatus}`);
    }
  }

  static safeDivide(num: number, denom: number): number {
    if (!denom || isNaN(denom) || !isFinite(denom) || denom === 0) return 0;
    if (isNaN(num) || !isFinite(num)) return 0;
    return num / denom;
  }

  static safePercentage(num: number, denom: number): string {
    const res = this.safeDivide(num, denom) * 100;
    return `${Math.round(res)}%`;
  }

  static runResearchGovernanceDiagnostics(tenantId: string, projects: GovResearchProject[], grantApplications: GrantApplication[], ipDisclosures: IPDisclosure[]): any[] {
    const diagnostics: any[] = [];

    projects.forEach(p => {
      if (!p.principalInvestigatorId) {
        diagnostics.push({
          type: 'MISSING_INVESTIGATOR',
          entityId: p.id,
          description: `Research project "${p.title}" lacks a Principal Investigator.`
        });
      }
    });

    grantApplications.forEach(g => {
      if (g.status === 'APPROVED' && !g.submissionDate) {
        diagnostics.push({
          type: 'UNSUBMITTED_APPROVED_GRANT',
          entityId: g.id,
          description: `Approved grant application ${g.id} has not recorded a submission date.`
        });
      }
    });

    ipDisclosures.forEach(ip => {
      if (ip.status === 'SUBMITTED' && (!ip.inventorRefs || ip.inventorRefs.length === 0)) {
        diagnostics.push({
          type: 'IP_MISSING_INVENTORS',
          entityId: ip.id,
          description: `IP disclosure "${ip.title}" does not list any inventors.`
        });
      }
    });

    return diagnostics;
  }
}
