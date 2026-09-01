import { 
  GovExecutiveDecision, 
  DecisionLifecycleState, 
  DecisionRequest,
  GovDecisionBrief,
  DecisionOption,
  GovDecisionRecommendation,
  DecisionChallenge,
  PolicyImpactAssessment,
  StrategicActionDirective,
  DecisionImpactLevel,
  DecisionImpactAssessment,
  DecisionRisk,
  DecisionDiagnosticFinding,
  DecisionDiagnosticSeverity,
  DecisionGovernanceAuditEvent,
  DecisionEvidenceSufficiency,
  DecisionIntelligenceStrategy,
  DecisionPriority
} from '../types/decisionIntelligenceGovernance';
import { FirebaseService } from './firebaseService';

export class DecisionIntelligenceGovernanceService {
  private static readonly COLLECTION_REQUESTS = 'decision_requests';
  private static readonly COLLECTION_BRIEFS = 'decision_briefs';
  private static readonly COLLECTION_DECISIONS = 'executive_decisions';
  private static readonly COLLECTION_AUDIT = 'decision_audit_events';
  private static readonly COLLECTION_STRATEGIES = 'decision_intelligence_strategies';

  /**
   * Governed Decision Intake
   */
  static async validateDecisionRequest(request: Partial<DecisionRequest>): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    if (!request.tenantId) errors.push('Tenant ID is mandatory');
    if (!request.campusId) errors.push('Campus ID is mandatory');
    if (!request.requesterUserIdRef) errors.push('Requester reference is mandatory');
    if (!request.decisionCategory) errors.push('Decision category is mandatory');
    if (!request.strategicObjectiveRefs || request.strategicObjectiveRefs.length === 0) {
      errors.push('Strategic alignment is mandatory');
    }
    if (!request.requestedDecisionDate) errors.push('Requested decision date is mandatory');
    if (!request.urgency) errors.push('Urgency level is mandatory');
    
    return { valid: errors.length === 0, errors };
  }

  static async submitDecisionRequest(request: Omit<DecisionRequest, 'id' | 'state' | 'createdAt'>): Promise<DecisionRequest> {
    const validation = await this.validateDecisionRequest(request);
    if (!validation.valid) throw new Error(`Invalid decision request: ${validation.errors.join(', ')}`);

    const newRequest: DecisionRequest = {
      ...request,
      id: FirebaseService.generateId('dreq'),
      state: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(this.COLLECTION_REQUESTS, newRequest.id, newRequest);
    await this.logAuditEvent(newRequest.tenantId, newRequest.campusId, request.requesterUserIdRef, 'REQUEST_SUBMITTED', 'DecisionRequest', newRequest.id, { category: request.decisionCategory });
    
    return newRequest;
  }

  /**
   * Decision Brief Engine
   */
  static async createDecisionBrief(brief: Omit<GovDecisionBrief, 'id' | 'updatedAt'>): Promise<GovDecisionBrief> {
    const newBrief: GovDecisionBrief = {
      ...brief,
      id: FirebaseService.generateId('dbrief'),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(this.COLLECTION_BRIEFS, newBrief.id, newBrief);
    return newBrief;
  }

  /**
   * Option & Recommendation Engine
   */
  static calculateOptionScore(option: Omit<DecisionOption, 'id' | 'totalScore'>): number {
    const weights = {
      strategicAlignment: 0.15,
      institutionalImpact: 0.10,
      financialExposure: -0.15, // Cost reduces score
      operationalComplexity: -0.10,
      implementationEffort: -0.05,
      riskExposure: -0.15,
      regulatoryImpact: 0.10,
      stakeholderImpact: 0.10,
      reversibility: 0.05,
      timeToValue: 0.05,
      dependencyConcentration: -0.10
    };

    // Protect against invalid inputs
    const safe = (val: number | undefined) => (val === undefined || isNaN(val) || !isFinite(val)) ? 0 : Math.max(0, Math.min(100, val));

    let score = 
      safe(option.strategicAlignment) * weights.strategicAlignment +
      safe(option.institutionalImpact) * weights.institutionalImpact +
      safe(option.financialExposure) * weights.financialExposure +
      safe(option.operationalComplexity) * weights.operationalComplexity +
      safe(option.implementationEffort) * weights.implementationEffort +
      safe(option.riskExposure) * weights.riskExposure +
      safe(option.regulatoryImpact) * weights.regulatoryImpact +
      safe(option.stakeholderImpact) * weights.stakeholderImpact +
      safe(option.reversibility) * weights.reversibility +
      safe(option.timeToValue) * weights.timeToValue +
      safe(option.dependencyConcentration) * weights.dependencyConcentration;

    return Math.max(0, Math.min(100, score + 50)); // Normalize to 0-100 range assuming base 50
  }

  /**
   * Four-Eyes / Separation of Duties
   */
  static validateFourEyesSoD(actorId: string, proposerId: string): boolean {
    return actorId !== proposerId;
  }

  /**
   * Executive Decision Governance
   */
  static async authorizeDecision(
    decision: Omit<GovExecutiveDecision, 'id' | 'version' | 'provenanceHash' | 'previousProvenanceHash' | 'createdAt'>,
    approverId: string
  ): Promise<GovExecutiveDecision> {
    if (!this.validateFourEyesSoD(approverId, decision.proposerUserIdRef)) {
      throw new Error('Four-Eyes Violation: Proposer cannot approve their own decision');
    }

    const id = FirebaseService.generateId('execdec');
    const timestamp = new Date().toISOString();
    const prevHash = '0'.repeat(64); // In a real chain, fetch latest decision hash
    const currentHash = await this.generateAuditHash(decision.tenantId, approverId, 'DECISION_AUTHORIZED', 'ExecutiveDecision', id, timestamp, prevHash);

    const newDecision: GovExecutiveDecision = {
      ...decision,
      id,
      version: 1,
      state: 'APPROVED',
      approverUserIdRefs: [...decision.approverUserIdRefs, approverId],
      approvalTimestamp: timestamp,
      provenanceHash: currentHash,
      previousProvenanceHash: prevHash,
      createdAt: timestamp
    };

    await FirebaseService.setDocument(this.COLLECTION_DECISIONS, newDecision.id, newDecision);
    await this.logAuditEvent(newDecision.tenantId, newDecision.campusId, approverId, 'DECISION_AUTHORIZED', 'ExecutiveDecision', newDecision.id, { hash: currentHash });

    return newDecision;
  }

  /**
   * Cryptographic Provenance (Simplified Simulation)
   */
  private static async generateAuditHash(
    tenantId: string, 
    actor: string, 
    action: string, 
    entity: string, 
    entityId: string, 
    timestamp: string, 
    prevHash: string
  ): Promise<string> {
    const data = `${tenantId}:${actor}:${action}:${entity}:${entityId}:${timestamp}:${prevHash}`;
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async logAuditEvent(
    tenantId: string,
    campusId: string,
    actorUserIdRef: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: any
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const prevHash = '0'.repeat(64); // Real implementation would fetch latest
    const currentHash = await this.generateAuditHash(tenantId, actorUserIdRef, action, entityType, entityId, timestamp, prevHash);

    const event: DecisionGovernanceAuditEvent = {
      id: FirebaseService.generateId('govaudit'),
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

    await FirebaseService.setDocument(this.COLLECTION_AUDIT, event.id, event);
  }

  /**
   * Risk Engine
   */
  static calculateDecisionRisk(factors: DecisionRisk['factors']): { score: number; classification: DecisionImpactLevel } {
    const score = (
      factors.strategic * 0.2 +
      factors.financial * 0.2 +
      factors.operational * 0.15 +
      factors.regulatory * 0.15 +
      factors.cyber * 0.1 +
      factors.privacy * 0.05 +
      factors.stakeholder * 0.05 +
      (100 - factors.reversibility) * 0.05 +
      factors.complexity * 0.05
    );

    let classification: DecisionImpactLevel = DecisionImpactLevel.LOW;
    if (score > 80) classification = DecisionImpactLevel.CRITICAL;
    else if (score > 60) classification = DecisionImpactLevel.HIGH;
    else if (score > 30) classification = DecisionImpactLevel.MODERATE;

    return { score, classification };
  }

  /**
   * Diagnostic Engine
   */
  static async runDiagnostics(tenantId: string): Promise<DecisionDiagnosticFinding[]> {
    const findings: DecisionDiagnosticFinding[] = [];
    const timestamp = new Date().toISOString();

    // Simulation of diagnostics logic
    const requests = await FirebaseService.getTenantCollection<DecisionRequest>(this.COLLECTION_REQUESTS, tenantId);
    
    for (const req of requests) {
      if (req.state === 'SUBMITTED' && (req.evidenceReferences || []).length === 0) {
        findings.push({
          id: FirebaseService.generateId('diag'),
          decisionIdRef: req.id,
          severity: DecisionDiagnosticSeverity.WARNING,
          category: 'EVIDENCE',
          message: `Decision Request ${req.id} has no evidence references.`,
          timestamp
        });
      }
    }

    return findings;
  }

  /**
   * What-If Simulation Sandbox (In-Memory Only)
   */
  static runSimulation(scenarioId: string, params: any): any {
    const scenarios = [
      'Major Strategic Investment',
      'Budget Reduction',
      'Enrollment Shock',
      'Revenue Shock',
      'Research Funding Reduction',
      'Major Cyber Incident',
      'Regulatory Change',
      'Policy Conflict',
      'Key Partner Withdrawal',
      'Technology Platform Failure',
      'Campus Closure',
      'Workforce Constraint',
      'Reputation Crisis',
      'Multi-Risk Cascade',
      'Executive Decision Reversal'
    ];

    const scenarioName = scenarios[parseInt(scenarioId) - 1] || 'Unknown Scenario';
    
    return {
      scenarioId,
      scenarioName,
      timestamp: new Date().toISOString(),
      isSimulation: true,
      outcome: `Simulation of ${scenarioName} completed with zero production mutation.`,
      impactProjections: {
        financial: -Math.random() * 1000000,
        reputational: 'MODERATE_RISK',
        academic: 'STABLE'
      }
    };
  }

  static async getStrategies(tenantId: string): Promise<DecisionIntelligenceStrategy[]> {
    return FirebaseService.getTenantCollection<DecisionIntelligenceStrategy>(this.COLLECTION_STRATEGIES, tenantId);
  }
}
