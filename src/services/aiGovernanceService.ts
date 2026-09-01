import { collection, query, where, getDocs, doc, limit, runTransaction, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirebaseService, handleFirestoreError, OperationType } from './firebaseService';
import { AuditService } from './auditService';
import {
  AIProvider,
  AISystem,
  AIModel,
  AIModelVersion,
  AIUseCase,
  AIRiskAssessment,
  AIEvaluation,
  AIEvaluationRun,
  AIDataset,
  AIPromptTemplate,
  AIAgent,
  AIDecisionRecord,
  AIIncident,
  AIExceptionRequest,
  AIPolicy,
  AIComplianceAssessment,
  AIGovernanceReview,
  AIDataQualityIssue,
  AIAuditLog
} from '../types/aiGovernance';

// Safe Math helpers to avoid NaN, Infinity, and divide-by-zero errors
export function safeNumber(val: any, fallback = 0): number {
  if (val === undefined || val === null || isNaN(Number(val))) return fallback;
  return Number(val);
}

export function safeDivide(numerator: number, denominator: number): number {
  const d = safeNumber(denominator, 0);
  const n = safeNumber(numerator, 0);
  if (d === 0) return 0;
  return n / d;
}

export function safeRound(val: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function safePercentage(part: number, total: number): number {
  const p = safeNumber(part);
  const t = safeNumber(total);
  if (t === 0) return 0;
  return safeRound((p / t) * 100, 1);
}

export class AIGovernanceService {
  // ==========================================
  // GENERAL HELPER FOR AUDITING
  // ==========================================
  static async logAudit(
    tenantId: string,
    actorId: string,
    actorName: string,
    action: string,
    resourceType: string,
    resourceId: string,
    justification?: string,
    previousState?: string,
    newState?: string
  ): Promise<void> {
    const id = FirebaseService.generateId('aud');
    const auditRecord: AIAuditLog = {
      id,
      tenantId,
      actorId,
      actorDisplayName: actorName,
      action,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
      justification,
      previousState,
      newState
    };
    try {
      await FirebaseService.setDocument('ai_audit_logs', id, auditRecord);
      // Integrate with the core EMS platform AuditService if it has a dynamic logger
      try {
        await AuditService.log({
          action: action as any,
          resource: resourceType as any,
          resourceId,
          tenantId,
          userId: actorId,
          userEmail: '',
          userDisplayName: actorName,
          result: 'SUCCESS'
        });
      } catch (e) {}
    } catch (err) {
      console.error('Failed to write AI audit log:', err);
    }
  }

  // ==========================================
  // AI PROVIDERS GOVERNANCE
  // ==========================================
  static async getProviders(tenantId: string): Promise<AIProvider[]> {
    return FirebaseService.getTenantCollection<AIProvider>('ai_providers', tenantId);
  }

  static async createProvider(
    tenantId: string,
    data: Omit<AIProvider, 'id' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIProvider> {
    const id = FirebaseService.generateId('prov');
    const provider: AIProvider = {
      ...data,
      id,
      tenantId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_providers', id, provider);
    await this.logAudit(tenantId, actorId, actorName, 'AI_PROVIDER_REGISTERED', 'ai_providers', id);
    return provider;
  }

  // ==========================================
  // AI SYSTEMS GOVERNANCE (WITH SOD & RISK BLOCKS)
  // ==========================================
  static async getSystems(tenantId: string, campusId?: string): Promise<AISystem[]> {
    const constraints = campusId && campusId !== 'ALL_CAMPUSES' ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<AISystem>('ai_systems', tenantId, constraints);
  }

  static async createSystem(
    tenantId: string,
    data: Omit<AISystem, 'id' | 'lifecycleStatus' | 'productionStatus'>,
    actorId: string,
    actorName: string
  ): Promise<AISystem> {
    // Prohibited Use-case Block
    if (data.riskTier === 'PROHIBITED') {
      throw new Error('Action blocked: Cannot register an AI system mapping to a PROHIBITED risk tier.');
    }

    const id = FirebaseService.generateId('sys');
    const system: AISystem = {
      ...data,
      id,
      tenantId,
      lifecycleStatus: 'DRAFT',
      productionStatus: 'DEVELOPMENT'
    };
    await FirebaseService.setDocument('ai_systems', id, system);
    await this.logAudit(tenantId, actorId, actorName, 'AI_SYSTEM_REGISTERED', 'ai_systems', id);
    return system;
  }

  static async approveSystem(
    tenantId: string,
    systemId: string,
    actorId: string,
    actorName: string
  ): Promise<AISystem> {
    const systemRef = doc(db, 'ai_systems', systemId);
    return runTransaction(db, async (transaction) => {
      const snap = await transaction.get(systemRef);
      if (!snap.exists()) {
        throw new Error('AI system not found.');
      }
      const system = snap.data() as AISystem;
      if (system.tenantId !== tenantId) {
        throw new Error('Access denied: cross-tenant authorization violation.');
      }

      // 4-Eyes Separation of Duties Violation Block
      if (system.createdBy === actorId) {
        throw new Error('Governance Block: Self-approval prohibited. High-risk systems require independent evaluation approval.');
      }

      const updated = {
        ...system,
        lifecycleStatus: 'APPROVED' as const,
        approvedBy: actorId,
        approvedAt: new Date().toISOString()
      };

      transaction.update(systemRef, updated);
      return updated;
    }).then(async (res) => {
      await this.logAudit(tenantId, actorId, actorName, 'AI_SYSTEM_APPROVED', 'ai_systems', systemId);
      return res;
    });
  }

  static async setSystemStatus(
    tenantId: string,
    systemId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE',
    actorId: string,
    actorName: string,
    justification: string
  ): Promise<void> {
    const systemRef = doc(db, 'ai_systems', systemId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(systemRef);
      if (!snap.exists()) throw new Error('AI System not found');
      const system = snap.data() as AISystem;
      if (system.tenantId !== tenantId) throw new Error('Cross-tenant block');

      transaction.update(systemRef, {
        productionStatus: status === 'ACTIVE' ? 'PRODUCTION' : 'SUSPENDED',
        lifecycleStatus: status === 'SUSPENDED' ? 'SUSPENDED' : system.lifecycleStatus
      });
    });

    await this.logAudit(
      tenantId,
      actorId,
      actorName,
      status === 'SUSPENDED' ? 'AI_SYSTEM_SUSPENDED' : 'AI_SYSTEM_REACTIVATED',
      'ai_systems',
      systemId,
      justification
    );
  }

  // ==========================================
  // AI MODELS GOVERNANCE
  // ==========================================
  static async getModels(tenantId: string, systemId?: string): Promise<AIModel[]> {
    const constraints = systemId ? [where('systemId', '==', systemId)] : [];
    return FirebaseService.getTenantCollection<AIModel>('ai_models', tenantId, constraints);
  }

  static async createModel(
    tenantId: string,
    data: Omit<AIModel, 'id' | 'createdAt' | 'updatedAt' | 'lifecycleStatus'>,
    actorId: string,
    actorName: string
  ): Promise<AIModel> {
    if (data.riskTier === 'PROHIBITED') {
      throw new Error('Cannot register a PROHIBITED model.');
    }

    const id = FirebaseService.generateId('mdl');
    const model: AIModel = {
      ...data,
      id,
      tenantId,
      lifecycleStatus: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_models', id, model);
    await this.logAudit(tenantId, actorId, actorName, 'AI_MODEL_REGISTERED', 'ai_models', id);
    return model;
  }

  static async approveModel(
    tenantId: string,
    modelId: string,
    actorId: string,
    actorName: string
  ): Promise<AIModel> {
    const modelRef = doc(db, 'ai_models', modelId);
    return runTransaction(db, async (transaction) => {
      const snap = await transaction.get(modelRef);
      if (!snap.exists()) throw new Error('Model not found');
      const model = snap.data() as AIModel;
      if (model.tenantId !== tenantId) throw new Error('Cross-tenant action blocked');
      if (model.createdBy === actorId) {
        throw new Error('Self-approval blocked. Models require secondary structural signoff.');
      }

      const updated = {
        ...model,
        lifecycleStatus: 'APPROVED' as const,
        approvedBy: actorId,
        updatedAt: new Date().toISOString()
      };
      transaction.update(modelRef, updated);
      return updated;
    }).then(async (res) => {
      await this.logAudit(tenantId, actorId, actorName, 'AI_MODEL_APPROVED', 'ai_models', modelId);
      return res;
    });
  }

  // ==========================================
  // AI MODEL VERSIONS (LINEAGE TRACKING)
  // ==========================================
  static async getModelVersions(tenantId: string, modelId: string): Promise<AIModelVersion[]> {
    const constraints = [where('modelId', '==', modelId)];
    return FirebaseService.getTenantCollection<AIModelVersion>('ai_model_versions', tenantId, constraints);
  }

  static async createModelVersion(
    tenantId: string,
    data: Omit<AIModelVersion, 'id' | 'deployedAt' | 'retiredAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIModelVersion> {
    const id = FirebaseService.generateId('ver');
    const version: AIModelVersion = {
      ...data,
      id,
      tenantId
    };
    await FirebaseService.setDocument('ai_model_versions', id, version);
    await this.logAudit(tenantId, actorId, actorName, 'AI_MODEL_VERSION_SUBMITTED', 'ai_model_versions', id);
    return version;
  }

  static async approveModelVersion(
    tenantId: string,
    versionId: string,
    actorId: string,
    actorName: string
  ): Promise<AIModelVersion> {
    const versionRef = doc(db, 'ai_model_versions', versionId);
    return runTransaction(db, async (transaction) => {
      const snap = await transaction.get(versionRef);
      if (!snap.exists()) throw new Error('Model version not found');
      const version = snap.data() as AIModelVersion;
      if (version.tenantId !== tenantId) throw new Error('Cross-tenant block');

      const updated = {
        ...version,
        approvalStatus: 'APPROVED' as const,
        deployedAt: new Date().toISOString()
      };
      transaction.update(versionRef, updated);
      return updated;
    }).then(async (res) => {
      await this.logAudit(tenantId, actorId, actorName, 'AI_MODEL_VERSION_APPROVED', 'ai_model_versions', versionId);
      return res;
    });
  }

  // ==========================================
  // AI USE CASES
  // ==========================================
  static async getUseCases(tenantId: string): Promise<AIUseCase[]> {
    return FirebaseService.getTenantCollection<AIUseCase>('ai_use_cases', tenantId);
  }

  static async createUseCase(
    tenantId: string,
    data: Omit<AIUseCase, 'id' | 'approvalStatus' | 'prohibitedUseFlag'>,
    actorId: string,
    actorName: string
  ): Promise<AIUseCase> {
    if (data.riskTier === 'PROHIBITED') {
      throw new Error('Use case maps to PROHIBITED risk category.');
    }

    const id = FirebaseService.generateId('uc');
    const useCase: AIUseCase = {
      ...data,
      id,
      tenantId,
      prohibitedUseFlag: false,
      approvalStatus: 'DRAFT'
    };
    await FirebaseService.setDocument('ai_use_cases', id, useCase);
    await this.logAudit(tenantId, actorId, actorName, 'AI_USE_CASE_REGISTERED', 'ai_use_cases', id);
    return useCase;
  }

  // ==========================================
  // RISK ASSESSMENTS
  // ==========================================
  static async getRiskAssessments(tenantId: string): Promise<AIRiskAssessment[]> {
    return FirebaseService.getTenantCollection<AIRiskAssessment>('ai_risk_assessments', tenantId);
  }

  static async createRiskAssessment(
    tenantId: string,
    data: Omit<AIRiskAssessment, 'id' | 'evaluatedAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIRiskAssessment> {
    const id = FirebaseService.generateId('risk');
    const assessment: AIRiskAssessment = {
      ...data,
      id,
      tenantId,
      evaluatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_risk_assessments', id, assessment);
    await this.logAudit(tenantId, actorId, actorName, 'AI_RISK_ASSESSED', 'ai_risk_assessments', id);
    return assessment;
  }

  // ==========================================
  // EVALUATION & RESULTS LAB
  // ==========================================
  static async getEvaluations(tenantId: string): Promise<AIEvaluation[]> {
    return FirebaseService.getTenantCollection<AIEvaluation>('ai_evaluations', tenantId);
  }

  static async createEvaluation(
    tenantId: string,
    data: Omit<AIEvaluation, 'id' | 'createdAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIEvaluation> {
    const id = FirebaseService.generateId('eval');
    const evaluation: AIEvaluation = {
      ...data,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_evaluations', id, evaluation);
    await this.logAudit(tenantId, actorId, actorName, 'AI_EVALUATION_RULE_CREATED', 'ai_evaluations', id);
    return evaluation;
  }

  static async getEvaluationRuns(tenantId: string): Promise<AIEvaluationRun[]> {
    return FirebaseService.getTenantCollection<AIEvaluationRun>('ai_evaluation_runs', tenantId);
  }

  static async createEvaluationRun(
    tenantId: string,
    data: Omit<AIEvaluationRun, 'id' | 'startedAt' | 'certificationStatus'>,
    actorId: string,
    actorName: string
  ): Promise<AIEvaluationRun> {
    const id = FirebaseService.generateId('run');
    const run: AIEvaluationRun = {
      ...data,
      id,
      tenantId,
      startedAt: new Date().toISOString(),
      certificationStatus: 'UNCERTIFIED'
    };
    await FirebaseService.setDocument('ai_evaluation_runs', id, run);
    await this.logAudit(tenantId, actorId, actorName, 'AI_EVALUATION_RUN_STARTED', 'ai_evaluation_runs', id);
    return run;
  }

  static async certifyEvaluationRun(
    tenantId: string,
    runId: string,
    status: 'CERTIFIED' | 'REJECTED',
    actorId: string,
    actorName: string
  ): Promise<AIEvaluationRun> {
    const runRef = doc(db, 'ai_evaluation_runs', runId);
    return runTransaction(db, async (transaction) => {
      const snap = await transaction.get(runRef);
      if (!snap.exists()) throw new Error('Evaluation run not found');
      const run = snap.data() as AIEvaluationRun;
      if (run.tenantId !== tenantId) throw new Error('Cross-tenant block');
      if (run.evaluatorId === actorId) {
        throw new Error('Self-approval blocked. An evaluation run cannot be certified by the execution evaluator.');
      }

      const updated = {
        ...run,
        certificationStatus: status,
        certifiedBy: actorId,
        certifiedAt: new Date().toISOString()
      };
      transaction.update(runRef, updated);
      return updated;
    }).then(async (res) => {
      await this.logAudit(tenantId, actorId, actorName, 'AI_EVALUATION_CERTIFIED', 'ai_evaluation_runs', runId);
      return res;
    });
  }

  // ==========================================
  // DATASETS LINEAGE
  // ==========================================
  static async getDatasets(tenantId: string): Promise<AIDataset[]> {
    return FirebaseService.getTenantCollection<AIDataset>('ai_datasets', tenantId);
  }

  static async createDataset(
    tenantId: string,
    data: Omit<AIDataset, 'id' | 'verificationStatus'>,
    actorId: string,
    actorName: string
  ): Promise<AIDataset> {
    const id = FirebaseService.generateId('data');
    const dataset: AIDataset = {
      ...data,
      id,
      tenantId,
      verificationStatus: 'UNVERIFIED'
    };
    await FirebaseService.setDocument('ai_datasets', id, dataset);
    await this.logAudit(tenantId, actorId, actorName, 'AI_DATASET_REGISTERED', 'ai_datasets', id);
    return dataset;
  }

  static async verifyDataset(
    tenantId: string,
    datasetId: string,
    status: 'VERIFIED' | 'REJECTED',
    actorId: string,
    actorName: string
  ): Promise<void> {
    const dsRef = doc(db, 'ai_datasets', datasetId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(dsRef);
      if (!snap.exists()) throw new Error('Dataset not found');
      const ds = snap.data() as AIDataset;
      if (ds.tenantId !== tenantId) throw new Error('Cross-tenant mismatch');

      transaction.update(dsRef, { verificationStatus: status });
    });
    await this.logAudit(tenantId, actorId, actorName, 'AI_DATASET_VERIFIED', 'ai_datasets', datasetId);
  }

  // ==========================================
  // AIPROMPT TEMPLATES GOVERNANCE
  // ==========================================
  static async getPromptTemplates(tenantId: string): Promise<AIPromptTemplate[]> {
    return FirebaseService.getTenantCollection<AIPromptTemplate>('ai_prompt_templates', tenantId);
  }

  static async createPromptTemplate(
    tenantId: string,
    data: Omit<AIPromptTemplate, 'id' | 'approvalStatus' | 'testStatus' | 'lifecycleStatus'>,
    actorId: string,
    actorName: string
  ): Promise<AIPromptTemplate> {
    const id = FirebaseService.generateId('prt');
    const prompt: AIPromptTemplate = {
      ...data,
      id,
      tenantId,
      approvalStatus: 'DRAFT',
      testStatus: 'UNTESTED',
      lifecycleStatus: 'ACTIVE'
    };
    await FirebaseService.setDocument('ai_prompt_templates', id, prompt);
    await this.logAudit(tenantId, actorId, actorName, 'AI_PROMPT_TEMPLATE_CREATED', 'ai_prompt_templates', id);
    return prompt;
  }

  // ==========================================
  // AGENTS SAFETY GATEWAY
  // ==========================================
  static async getAgents(tenantId: string): Promise<AIAgent[]> {
    return FirebaseService.getTenantCollection<AIAgent>('ai_agents', tenantId);
  }

  static async createAgent(
    tenantId: string,
    data: Omit<AIAgent, 'id'>,
    actorId: string,
    actorName: string
  ): Promise<AIAgent> {
    // Prohibited Check
    if (data.riskTier === 'PROHIBITED') {
      throw new Error('Cannot run an agent belonging to the PROHIBITED risk tier.');
    }

    const id = FirebaseService.generateId('agt');
    const agent: AIAgent = {
      ...data,
      id,
      tenantId
    };
    await FirebaseService.setDocument('ai_agents', id, agent);
    await this.logAudit(tenantId, actorId, actorName, 'AI_AGENT_CREATED', 'ai_agents', id);
    return agent;
  }

  static async runAgentSafeguardCheck(agent: AIAgent, payloadDepth: number): Promise<{ passed: boolean; message: string }> {
    // 1. Recursive Limit Check
    if (payloadDepth > agent.maximumExecutionDepth) {
      return {
        passed: false,
        message: `Execution blocked: Execution recursion depth of ${payloadDepth} exceeds the agent safety limit of ${agent.maximumExecutionDepth}.`
      };
    }
    // 2. Kill Switch Status Check
    if (agent.status === 'SUSPENDED') {
      return {
        passed: false,
        message: 'Execution blocked: Agent status is currently SUSPENDED via the administrative Kill-Switch.'
      };
    }
    return { passed: true, message: 'Safety check passed' };
  }

  // ==========================================
  // AI DECISIONS (HUMAN REVIEW INTEGRATION)
  // ==========================================
  static async getDecisions(tenantId: string): Promise<AIDecisionRecord[]> {
    return FirebaseService.getTenantCollection<AIDecisionRecord>('ai_decisions', tenantId);
  }

  static async createDecisionRecord(
    tenantId: string,
    data: Omit<AIDecisionRecord, 'id' | 'timestamp'>,
    actorId: string,
    actorName: string
  ): Promise<AIDecisionRecord> {
    const id = FirebaseService.generateId('dec');
    const record: AIDecisionRecord = {
      ...data,
      id,
      tenantId,
      timestamp: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_decisions', id, record);
    await this.logAudit(tenantId, actorId, actorName, 'AI_DECISION_RECORDED', 'ai_decisions', id);
    return record;
  }

  // ==========================================
  // AI INCIDENTS MANAGEMENT
  // ==========================================
  static async getIncidents(tenantId: string): Promise<AIIncident[]> {
    return FirebaseService.getTenantCollection<AIIncident>('ai_incidents', tenantId);
  }

  static async createIncident(
    tenantId: string,
    data: Omit<AIIncident, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIIncident> {
    const id = FirebaseService.generateId('inc');
    const incident: AIIncident = {
      ...data,
      id,
      tenantId,
      status: 'REPORTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_incidents', id, incident);
    await this.logAudit(tenantId, actorId, actorName, 'AI_INCIDENT_REPORTED', 'ai_incidents', id);
    return incident;
  }

  static async triageIncident(
    tenantId: string,
    incidentId: string,
    nextStatus: AIIncident['status'],
    actorId: string,
    actorName: string
  ): Promise<void> {
    const incRef = doc(db, 'ai_incidents', incidentId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(incRef);
      if (!snap.exists()) throw new Error('Incident not found');
      const inc = snap.data() as AIIncident;
      if (inc.tenantId !== tenantId) throw new Error('Cross-tenant block');

      if (nextStatus === 'CLOSED' && inc.reportedBy === actorId) {
        throw new Error('Separation of duties violation: Incident reported user cannot self-close active cases.');
      }

      transaction.update(incRef, {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
    });
    await this.logAudit(tenantId, actorId, actorName, 'AI_INCIDENT_STATUS_CHANGED', 'ai_incidents', incidentId, `Moved to ${nextStatus}`);
  }

  // ==========================================
  // EXCEPTION GOVERNANCE
  // ==========================================
  static async getExceptions(tenantId: string): Promise<AIExceptionRequest[]> {
    return FirebaseService.getTenantCollection<AIExceptionRequest>('ai_exceptions', tenantId);
  }

  static async createException(
    tenantId: string,
    data: Omit<AIExceptionRequest, 'id' | 'status' | 'requestedBy'>,
    actorId: string,
    actorName: string
  ): Promise<AIExceptionRequest> {
    const id = FirebaseService.generateId('exc');
    const request: AIExceptionRequest = {
      ...data,
      id,
      tenantId,
      requestedBy: actorId,
      status: 'REQUESTED'
    };
    await FirebaseService.setDocument('ai_exceptions', id, request);
    await this.logAudit(tenantId, actorId, actorName, 'AI_EXCEPTION_SUBMITTED', 'ai_exceptions', id);
    return request;
  }

  static async approveException(
    tenantId: string,
    exceptionId: string,
    actorId: string,
    actorName: string
  ): Promise<AIExceptionRequest> {
    const excRef = doc(db, 'ai_exceptions', exceptionId);
    return runTransaction(db, async (transaction) => {
      const snap = await transaction.get(excRef);
      if (!snap.exists()) throw new Error('Exception request not found');
      const request = snap.data() as AIExceptionRequest;
      if (request.tenantId !== tenantId) throw new Error('Cross-tenant block');

      if (request.requestedBy === actorId) {
        throw new Error('Self-approval blocked: Exception request must be signed off by an independent authority.');
      }

      const updated = {
        ...request,
        status: 'APPROVED' as const,
        approvedBy: actorId,
        approvalTimestamp: new Date().toISOString()
      };
      transaction.update(excRef, updated);
      return updated;
    }).then(async (res) => {
      await this.logAudit(tenantId, actorId, actorName, 'AI_EXCEPTION_APPROVED', 'ai_exceptions', exceptionId);
      return res;
    });
  }

  // ==========================================
  // POLICIES AND COMPLIANCE
  // ==========================================
  static async getPolicies(tenantId: string): Promise<AIPolicy[]> {
    return FirebaseService.getTenantCollection<AIPolicy>('ai_policies', tenantId);
  }

  static async createPolicy(
    tenantId: string,
    data: Omit<AIPolicy, 'id' | 'createdAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIPolicy> {
    const id = FirebaseService.generateId('pol');
    const policy: AIPolicy = {
      ...data,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_policies', id, policy);
    await this.logAudit(tenantId, actorId, actorName, 'AI_POLICY_CREATED', 'ai_policies', id);
    return policy;
  }

  static async getCompliance(tenantId: string): Promise<AIComplianceAssessment[]> {
    return FirebaseService.getTenantCollection<AIComplianceAssessment>('ai_compliance_assessments', tenantId);
  }

  static async createCompliance(
    tenantId: string,
    data: Omit<AIComplianceAssessment, 'id' | 'assessedAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIComplianceAssessment> {
    const id = FirebaseService.generateId('comp');
    const comp: AIComplianceAssessment = {
      ...data,
      id,
      tenantId,
      assessedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_compliance_assessments', id, comp);
    await this.logAudit(tenantId, actorId, actorName, 'AI_COMPLIANCE_ASSESSED', 'ai_compliance_assessments', id);
    return comp;
  }

  static async getGovernanceReviews(tenantId: string): Promise<AIGovernanceReview[]> {
    return FirebaseService.getTenantCollection<AIGovernanceReview>('ai_governance_reviews', tenantId);
  }

  static async createGovernanceReview(
    tenantId: string,
    data: Omit<AIGovernanceReview, 'id' | 'reviewedAt'>,
    actorId: string,
    actorName: string
  ): Promise<AIGovernanceReview> {
    const id = FirebaseService.generateId('govr');
    const review: AIGovernanceReview = {
      ...data,
      id,
      tenantId,
      reviewedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument('ai_governance_reviews', id, review);
    await this.logAudit(tenantId, actorId, actorName, 'AI_GOVERNANCE_REVIEWED', 'ai_governance_reviews', id);
    return review;
  }

  // ==========================================
  // AUTOMATED DATA QUALITY SCANNER
  // ==========================================
  static async getDataQualityIssues(tenantId: string): Promise<AIDataQualityIssue[]> {
    return FirebaseService.getTenantCollection<AIDataQualityIssue>('ai_data_quality_issues', tenantId);
  }

  static async runDataQualityScan(tenantId: string, actorId: string, actorName: string): Promise<AIDataQualityIssue[]> {
    // 1. Retrieve all registered systems, models, exceptions, evaluations
    const systems = await this.getSystems(tenantId);
    const models = await this.getModels(tenantId);
    const exceptions = await this.getExceptions(tenantId);
    const evaluationRuns = await this.getEvaluationRuns(tenantId);
    const datasets = await this.getDatasets(tenantId);

    const detectedIssues: Omit<AIDataQualityIssue, 'id' | 'detectedAt'>[] = [];

    // Diagnostic 1: Orphan models referencing missing AI systems
    for (const model of models) {
      if (!systems.some((s) => s.id === model.systemId)) {
        detectedIssues.push({
          tenantId,
          issueType: 'orphan_model',
          severity: 'HIGH',
          description: `Model [${model.modelName}] references parent system ID [${model.systemId}] which does not exist.`,
          status: 'OPEN'
        });
      }
    }

    // Diagnostic 2: Missing classifications inside datasets
    for (const dataset of datasets) {
      if (!dataset.classification) {
        detectedIssues.push({
          tenantId,
          issueType: 'missing_classification',
          severity: 'MEDIUM',
          description: `Dataset [${dataset.name}] is missing a structured privacy classification level.`,
          status: 'OPEN'
        });
      }
      if (dataset.verificationStatus === 'UNVERIFIED') {
        detectedIssues.push({
          tenantId,
          issueType: 'unverified_lineage',
          severity: 'MEDIUM',
          description: `Lineage for dataset [${dataset.name}] has not been verified.`,
          status: 'OPEN'
        });
      }
    }

    // Diagnostic 3: Expired active exception requests
    const now = Date.now();
    for (const exp of exceptions) {
      if (exp.status === 'APPROVED' && new Date(exp.expirationDate).getTime() < now) {
        detectedIssues.push({
          tenantId,
          issueType: 'expired_exception',
          severity: 'CRITICAL',
          description: `Active safety policy exception [${exp.title}] has expired but remains marked active.`,
          status: 'OPEN'
        });
      }
    }

    // Diagnostic 4: Systems missing verified model evaluations
    for (const sys of systems) {
      if (sys.riskTier === 'HIGH' || sys.riskTier === 'CRITICAL') {
        const sysModels = models.filter((m) => m.systemId === sys.id);
        for (const mdl of sysModels) {
          const runs = evaluationRuns.filter((r) => r.modelVersionId && r.certificationStatus === 'CERTIFIED');
          if (runs.length === 0) {
            detectedIssues.push({
              tenantId,
              issueType: 'missing_evaluation',
              severity: 'HIGH',
              description: `High-risk AI Model [${mdl.modelName}] has no certified evaluation run recordings.`,
              status: 'OPEN'
            });
          }
        }
      }
    }

    // 2. Fetch existing issues to avoid duplicating
    const existingRef = collection(db, 'ai_data_quality_issues');
    const existingSnap = await getDocs(query(existingRef, where('tenantId', '==', tenantId)));
    const existingIssues = existingSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as AIDataQualityIssue) }));

    const newlyCreated: AIDataQualityIssue[] = [];
    for (const issue of detectedIssues) {
      const isDuplicate = existingIssues.some((ex) => ex.issueType === issue.issueType && ex.description === issue.description && ex.status === 'OPEN');
      if (!isDuplicate) {
        const id = FirebaseService.generateId('dq');
        const finalIssue: AIDataQualityIssue = {
          ...issue,
          id,
          detectedAt: new Date().toISOString()
        };
        await FirebaseService.setDocument('ai_data_quality_issues', id, finalIssue);
        newlyCreated.push(finalIssue);
      }
    }

    await this.logAudit(tenantId, actorId, actorName, 'DATA_QUALITY_SCAN_EXECUTED', 'ai_data_quality_issues', 'batch');
    return [...existingIssues.filter((i) => i.status === 'OPEN'), ...newlyCreated];
  }

  // ==========================================
  // EXECUTIVE MODEL POSTURE & HEALTH SCORE
  // ==========================================
  static async calculateAIGovernanceHealthScore(tenantId: string): Promise<{
    score: number;
    systemsCount: number;
    highRiskCount: number;
    pendingEvaluations: number;
    activeIncidents: number;
    activeExceptions: number;
    complianceScore: number;
  }> {
    const [systems, runs, incidents, exceptions, complianceDocs] = await Promise.all([
      this.getSystems(tenantId),
      this.getEvaluationRuns(tenantId),
      this.getIncidents(tenantId),
      this.getExceptions(tenantId),
      this.getCompliance(tenantId)
    ]);

    const systemsCount = systems.length;
    const highRiskCount = systems.filter((s) => s.riskTier === 'HIGH' || s.riskTier === 'CRITICAL').length;
    const pendingEvaluations = runs.filter((r) => r.certificationStatus === 'UNCERTIFIED').length;
    const activeIncidents = incidents.filter((i) => i.status !== 'CLOSED').length;
    const activeExceptions = exceptions.filter((e) => e.status === 'APPROVED').length;

    // Evaluate compliance average
    const complianceScore = complianceDocs.length > 0
      ? safeRound(safeDivide(complianceDocs.reduce((acc, doc) => acc + safeNumber(doc.complianceScore), 0), complianceDocs.length))
      : 100;

    // Deduct penalty scores from 100 base
    let scoreBase = 100;
    scoreBase -= activeIncidents * 10;
    scoreBase -= activeExceptions * 5;
    scoreBase -= pendingEvaluations * 2;
    if (highRiskCount > 0) {
      const evaluationCoverage = safePercentage(
        runs.filter((r) => r.certificationStatus === 'CERTIFIED').length,
        systems.length
      );
      scoreBase -= safeRound((100 - evaluationCoverage) * 0.15);
    }

    const finalScore = Math.max(0, Math.min(100, safeRound(scoreBase)));

    return {
      score: finalScore,
      systemsCount,
      highRiskCount,
      pendingEvaluations,
      activeIncidents,
      activeExceptions,
      complianceScore
    };
  }

  // ==========================================
  // WHAT-IF / SIMULATION SANDBOX ACTIONS
  // ==========================================
  static simulateScenario(scenarioName: string): {
    title: string;
    description: string;
    simulatedRiskRating: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
    impactFactors: string[];
    governanceActionPlans: string[];
  } {
    switch (scenarioName) {
      case 'RANSOMWARE_COMPROMISE':
        return {
          title: 'Simulation: Autonomous Security Assistant Compromise Scenarios',
          description: 'Simulates the dynamic operational impact if an orchestration security assistant is compromised via recursive command injection.',
          simulatedRiskRating: 'CRITICAL',
          impactFactors: [
            'Privileged execution access level across critical networking tools',
            'Recursive maximum depth reached during unauthorized pipeline scan operations',
            'Classification of systems mapped to RESTRICTED database partitions'
          ],
          governanceActionPlans: [
            'Trigger immediate global Kill-Switch to lock agent tools access list',
            'Enforce temporary supervisor approval rules for security action playbooks',
            'Conduct high-fidelity evaluation run benchmark using evaluation datasets'
          ]
        };
      case 'CREDENTIAL_EXPOSURE':
        return {
          title: 'Simulation: Fine-Tuning Dataset Personal Data Leakage',
          description: 'Simulates direct privacy breach scenario where training pipelines ingest unmasked student registration credentials.',
          simulatedRiskRating: 'HIGH',
          impactFactors: [
            'Ingestion of unverified lineage dataset records containing Highly Confidential fields',
            'Missing consent flags across target data collections'
          ],
          governanceActionPlans: [
            'Quarantine affected model version artifact and withdraw release deployed stamp',
            'Initiate automatic compliance assessment audits across pipeline inputs',
            'Register localized AI policy restriction blocks on the model template definitions'
          ]
        };
      default:
        return {
          title: 'Simulation Sandbox Mode',
          description: 'Ready to receive select scenario parameters. Simulated states will not modify database configurations.',
          simulatedRiskRating: 'MINIMAL',
          impactFactors: [],
          governanceActionPlans: []
        };
    }
  }
}
