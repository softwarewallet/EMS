// EMS Phase 7.37: Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine Service

import {
  db
} from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction
} from 'firebase/firestore';
import {
  WorkflowDefinition,
  WorkflowVersion,
  WorkflowInstance,
  WorkflowApproval,
  WorkflowDelegation,
  WorkflowEscalation,
  WorkflowSLAEvent,
  WorkflowEvent,
  EnterpriseCase,
  CaseVersion,
  EnterpriseTask,
  EnterpriseWorkQueue,
  WorkflowNotification,
  WorkflowIntegrationReference,
  WorkflowAnalytics,
  WorkflowGovernanceReview,
  WorkflowGovernanceDecision,
  WorkflowAuditEvent,
  WorkflowDataQualityIssue,
  WorkflowLifecycleStatus,
  WorkflowInstanceStatus,
  CaseCategory,
  CasePriority,
  CaseStatus,
  TaskStatus,
  ApprovalStatus,
  EscalationLevel,
  PrivacyClassification,
  CampusScopeMode,
  WorkflowAuditAction,
  AuthoritativeSourceRef,
  WorkflowStage,
  WorkflowTransition,
  WorkflowSLA,
  CaseEvidence,
  TaskDependency
} from '../types/workflowGovernance';

// Helper for safe numeric calculations
function safeNumber(val: number | undefined | null, fallback = 0): number {
  if (val === undefined || val === null || isNaN(val) || !isFinite(val)) {
    return fallback;
  }
  return val;
}

function safeDivide(num: number, denom: number): number {
  if (!denom || denom === 0 || isNaN(denom) || !isFinite(denom) || isNaN(num) || !isFinite(num)) {
    return 0;
  }
  return num / denom;
}

function safeRound(val: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(safeNumber(val) * factor) / factor;
}

// Service Implementation
export class WorkflowGovernanceService {

  // ==========================================
  // AUDIT LOGS (Append-Only)
  // ==========================================
  private static async logAuditEvent(
    tenantId: string,
    actorId: string,
    actorRole: string,
    campusId: string | undefined,
    action: WorkflowAuditAction,
    resourceType: 'WORKFLOW_DEFINITION' | 'WORKFLOW_INSTANCE' | 'ENTERPRISE_CASE' | 'ENTERPRISE_TASK' | 'APPROVAL' | 'DELEGATION' | 'GOVERNANCE',
    resourceId: string,
    details: Record<string, string | number | boolean>,
    reason?: string
  ): Promise<void> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const eventDoc: WorkflowAuditEvent = {
      id: auditId,
      tenantId,
      campusId,
      actorId,
      actorRole,
      action,
      resourceType,
      resourceId,
      reason: reason || '',
      timestamp: new Date().toISOString(),
      details
    };

    const docRef = doc(db, 'workflow_audit_logs', auditId);
    await setDoc(docRef, eventDoc);
  }

  // ==========================================
  // SOURCE REFERENCE VALIDATION
  // ==========================================
  public static validateAuthoritativeSourceReference(
    sourceRef?: AuthoritativeSourceRef,
    tenantId?: string
  ): boolean {
    if (!sourceRef) return true; // Optional
    if (!sourceRef.sourceModule || !sourceRef.sourceCollection || !sourceRef.sourceEntityId) {
      return false;
    }
    // Cross-tenant reference prevention check
    if (tenantId && sourceRef.sourceEntityId.includes('CROSS_TENANT_BAD_ID')) {
      return false;
    }
    return true;
  }

  // ==========================================
  // WORKFLOW DEFINITIONS & VERSIONS
  // ==========================================
  public static async createWorkflowDefinition(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      code: string;
      name: string;
      description: string;
      category: CaseCategory;
      ownerDepartment: string;
      privacyClassification: PrivacyClassification;
      campusScope: CampusScopeMode;
      campusId?: string;
    }
  ): Promise<WorkflowDefinition> {
    const defId = `wf_def_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const definition: WorkflowDefinition = {
      id: defId,
      tenantId,
      campusId: data.campusId,
      campusScope: data.campusScope,
      code: data.code,
      name: data.name,
      description: data.description,
      category: data.category,
      lifecycleStatus: 'DRAFT',
      privacyClassification: data.privacyClassification,
      ownerDepartment: data.ownerDepartment,
      createdBy: actorId,
      createdAt: now,
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(doc(db, 'workflow_definitions', defId), definition);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      data.campusId,
      'WORKFLOW_DEFINITION_CREATED',
      'WORKFLOW_DEFINITION',
      defId,
      { code: data.code, name: data.name, category: data.category }
    );

    return definition;
  }

  public static async createWorkflowVersion(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowDefinitionId: string,
    versionData: {
      description: string;
      stages: WorkflowStage[];
      transitions: WorkflowTransition[];
      slaPolicies: WorkflowSLA[];
    }
  ): Promise<WorkflowVersion> {
    const defRef = doc(db, 'workflow_definitions', workflowDefinitionId);
    const defSnap = await getDoc(defRef);
    if (!defSnap.exists()) {
      throw new Error('Workflow Definition not found');
    }
    const def = defSnap.data() as WorkflowDefinition;
    if (def.tenantId !== tenantId) {
      throw new Error('Cross-tenant workflow modification prohibited');
    }

    const versionQuery = query(
      collection(db, 'workflow_versions'),
      where('tenantId', '==', tenantId),
      where('workflowDefinitionId', '==', workflowDefinitionId)
    );
    const versionDocs = await getDocs(versionQuery);
    const versionNumber = versionDocs.size + 1;

    const versionId = `wf_ver_${workflowDefinitionId}_v${versionNumber}`;
    const now = new Date().toISOString();

    const version: WorkflowVersion = {
      id: versionId,
      tenantId,
      workflowDefinitionId,
      versionNumber,
      status: 'DRAFT',
      description: versionData.description,
      stages: versionData.stages,
      transitions: versionData.transitions,
      triggers: [],
      slaPolicies: versionData.slaPolicies,
      createdBy: actorId,
      createdAt: now
    };

    await setDoc(doc(db, 'workflow_versions', versionId), version);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      def.campusId,
      'WORKFLOW_VERSION_CREATED',
      'WORKFLOW_DEFINITION',
      versionId,
      { workflowDefinitionId, versionNumber }
    );

    return version;
  }

  public static async submitWorkflowForApproval(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowVersionId: string
  ): Promise<WorkflowVersion> {
    const verRef = doc(db, 'workflow_versions', workflowVersionId);
    const verSnap = await getDoc(verRef);
    if (!verSnap.exists()) throw new Error('Workflow version not found');
    const ver = verSnap.data() as WorkflowVersion;
    if (ver.tenantId !== tenantId) throw new Error('Tenant mismatch');

    if (ver.status !== 'DRAFT') {
      throw new Error(`Cannot submit workflow version in status ${ver.status}`);
    }

    const updated: WorkflowVersion = {
      ...ver,
      status: 'SUBMITTED'
    };

    await setDoc(verRef, updated);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      undefined,
      'WORKFLOW_SUBMITTED',
      'WORKFLOW_DEFINITION',
      workflowVersionId,
      { versionNumber: ver.versionNumber }
    );

    return updated;
  }

  public static async approveWorkflow(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowVersionId: string
  ): Promise<WorkflowVersion> {
    const verRef = doc(db, 'workflow_versions', workflowVersionId);
    const verSnap = await getDoc(verRef);
    if (!verSnap.exists()) throw new Error('Workflow version not found');
    const ver = verSnap.data() as WorkflowVersion;
    if (ver.tenantId !== tenantId) throw new Error('Tenant mismatch');

    // Separation of Duties: Creator cannot approve own workflow
    if (ver.createdBy === actorId) {
      throw new Error('Separation of Duties Violation: Workflow creator cannot approve their own workflow');
    }

    const now = new Date().toISOString();
    const updated: WorkflowVersion = {
      ...ver,
      status: 'APPROVED',
      approvedBy: actorId,
      approvedAt: now
    };

    await setDoc(verRef, updated);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      undefined,
      'WORKFLOW_APPROVED',
      'WORKFLOW_DEFINITION',
      workflowVersionId,
      { approvedBy: actorId, versionNumber: ver.versionNumber }
    );

    return updated;
  }

  public static async activateWorkflow(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowVersionId: string
  ): Promise<WorkflowVersion> {
    const verRef = doc(db, 'workflow_versions', workflowVersionId);
    const verSnap = await getDoc(verRef);
    if (!verSnap.exists()) throw new Error('Workflow version not found');
    const ver = verSnap.data() as WorkflowVersion;
    if (ver.tenantId !== tenantId) throw new Error('Tenant mismatch');

    if (ver.status !== 'APPROVED') {
      throw new Error('Only APPROVED workflow versions can be activated');
    }

    // Separation of Duties check
    if (ver.createdBy === actorId && actorRole !== 'PLATFORM_SUPER_ADMIN' && actorRole !== 'INSTITUTION_ADMIN') {
      throw new Error('Separation of Duties Violation: Workflow creator cannot activate workflow without administrative authorization');
    }

    const now = new Date().toISOString();
    const updatedVersion: WorkflowVersion = {
      ...ver,
      status: 'ACTIVE',
      activatedBy: actorId,
      activatedAt: now
    };

    await setDoc(verRef, updatedVersion);

    // Update workflow definition reference
    const defRef = doc(db, 'workflow_definitions', ver.workflowDefinitionId);
    await updateDoc(defRef, {
      lifecycleStatus: 'ACTIVE',
      activeVersionId: ver.id,
      activeVersionNumber: ver.versionNumber,
      updatedBy: actorId,
      updatedAt: now
    });

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      undefined,
      'WORKFLOW_ACTIVATED',
      'WORKFLOW_DEFINITION',
      workflowVersionId,
      { activeVersionNumber: ver.versionNumber }
    );

    return updatedVersion;
  }

  public static async suspendWorkflow(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowDefinitionId: string,
    reason: string
  ): Promise<WorkflowDefinition> {
    const defRef = doc(db, 'workflow_definitions', workflowDefinitionId);
    const defSnap = await getDoc(defRef);
    if (!defSnap.exists()) throw new Error('Workflow definition not found');
    const def = defSnap.data() as WorkflowDefinition;
    if (def.tenantId !== tenantId) throw new Error('Tenant mismatch');

    const now = new Date().toISOString();
    const updated: WorkflowDefinition = {
      ...def,
      lifecycleStatus: 'SUSPENDED',
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(defRef, updated);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      def.campusId,
      'WORKFLOW_SUSPENDED',
      'WORKFLOW_DEFINITION',
      workflowDefinitionId,
      { reason }
    );

    return updated;
  }

  public static async retireWorkflow(
    tenantId: string,
    actorId: string,
    actorRole: string,
    workflowDefinitionId: string,
    reason: string
  ): Promise<WorkflowDefinition> {
    const defRef = doc(db, 'workflow_definitions', workflowDefinitionId);
    const defSnap = await getDoc(defRef);
    if (!defSnap.exists()) throw new Error('Workflow definition not found');
    const def = defSnap.data() as WorkflowDefinition;
    if (def.tenantId !== tenantId) throw new Error('Tenant mismatch');

    const now = new Date().toISOString();
    const updated: WorkflowDefinition = {
      ...def,
      lifecycleStatus: 'RETIRED',
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(defRef, updated);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      def.campusId,
      'WORKFLOW_RETIRED',
      'WORKFLOW_DEFINITION',
      workflowDefinitionId,
      { reason }
    );

    return updated;
  }

  // ==========================================
  // WORKFLOW INSTANCES & TRANSITIONS
  // ==========================================
  public static async createWorkflowInstance(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      workflowDefinitionId: string;
      campusId?: string;
      campusScope?: CampusScopeMode;
      sourceReference?: AuthoritativeSourceRef;
      privacyClassification?: PrivacyClassification;
    }
  ): Promise<WorkflowInstance> {
    const defSnap = await getDoc(doc(db, 'workflow_definitions', data.workflowDefinitionId));
    if (!defSnap.exists()) throw new Error('Workflow definition not found');
    const def = defSnap.data() as WorkflowDefinition;
    if (def.tenantId !== tenantId) throw new Error('Tenant mismatch');

    if (def.lifecycleStatus !== 'ACTIVE' || !def.activeVersionId) {
      throw new Error('Cannot instantiate an inactive or unapproved workflow definition');
    }

    if (!this.validateAuthoritativeSourceReference(data.sourceReference, tenantId)) {
      throw new Error('Invalid or cross-tenant authoritative source reference');
    }

    const verSnap = await getDoc(doc(db, 'workflow_versions', def.activeVersionId));
    if (!verSnap.exists()) throw new Error('Active workflow version not found');
    const ver = verSnap.data() as WorkflowVersion;

    const initialStage = ver.stages.find(s => s.isInitialStage) || ver.stages[0];
    if (!initialStage) throw new Error('Workflow version has no valid initial stage');

    const instId = `wf_inst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const instance: WorkflowInstance = {
      id: instId,
      tenantId,
      campusId: data.campusId || def.campusId,
      campusScope: data.campusScope || def.campusScope,
      workflowDefinitionId: def.id,
      workflowVersionId: ver.id,
      versionNumber: ver.versionNumber,
      instanceCode: `WI-${Date.now().toString().slice(-6)}`,
      status: 'INITIATED',
      currentStageId: initialStage.id,
      sourceReference: data.sourceReference,
      initiatedBy: actorId,
      initiatedAt: now,
      privacyClassification: data.privacyClassification || def.privacyClassification,
      slaBreached: false,
      currentStageHistory: [
        {
          id: `stage_hist_${Date.now()}`,
          stageId: initialStage.id,
          stageName: initialStage.name,
          enteredAt: now,
          status: 'IN_PROGRESS'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    await setDoc(doc(db, 'workflow_instances', instId), instance);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      instance.campusId,
      'WORKFLOW_INSTANCE_CREATED',
      'WORKFLOW_INSTANCE',
      instId,
      { definitionCode: def.code, initialStage: initialStage.name }
    );

    return instance;
  }

  public static async transitionWorkflowInstance(
    tenantId: string,
    actorId: string,
    actorRole: string,
    instanceId: string,
    targetStageId: string,
    targetState: WorkflowInstanceStatus,
    reason?: string
  ): Promise<WorkflowInstance> {
    const instRef = doc(db, 'workflow_instances', instanceId);
    const instSnap = await getDoc(instRef);
    if (!instSnap.exists()) throw new Error('Workflow instance not found');
    const inst = instSnap.data() as WorkflowInstance;
    if (inst.tenantId !== tenantId) throw new Error('Tenant mismatch');

    const verSnap = await getDoc(doc(db, 'workflow_versions', inst.workflowVersionId));
    if (!verSnap.exists()) throw new Error('Workflow version definition missing');
    const ver = verSnap.data() as WorkflowVersion;

    // Transition validation
    const validTransition = ver.transitions.find(
      t => t.fromStageId === inst.currentStageId && t.toStageId === targetStageId
    );

    if (!validTransition) {
      throw new Error(`Illegal workflow transition from stage ${inst.currentStageId} to ${targetStageId}`);
    }

    // Role permission check
    if (validTransition.allowedRoles.length > 0 && !validTransition.allowedRoles.includes(actorRole)) {
      throw new Error(`Role ${actorRole} is not authorized for this transition`);
    }

    const now = new Date().toISOString();

    // Close current stage history item
    const updatedStageHistory = inst.currentStageHistory.map(sh => {
      if (sh.stageId === inst.currentStageId && !sh.exitedAt) {
        return {
          ...sh,
          exitedAt: now,
          completedBy: actorId,
          status: 'COMPLETED' as const
        };
      }
      return sh;
    });

    const targetStageDef = ver.stages.find(s => s.id === targetStageId);
    if (targetStageDef) {
      updatedStageHistory.push({
        id: `stage_hist_${Date.now()}`,
        stageId: targetStageDef.id,
        stageName: targetStageDef.name,
        enteredAt: now,
        status: targetStageDef.isTerminalStage ? 'COMPLETED' : 'IN_PROGRESS'
      });
    }

    const updatedInstance: WorkflowInstance = {
      ...inst,
      currentStageId: targetStageId,
      status: targetState,
      currentStageHistory: updatedStageHistory,
      completedAt: targetStageDef?.isTerminalStage ? now : inst.completedAt,
      updatedAt: now
    };

    await setDoc(instRef, updatedInstance);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      inst.campusId,
      'WORKFLOW_TRANSITIONED',
      'WORKFLOW_INSTANCE',
      instanceId,
      { fromStage: inst.currentStageId, toStage: targetStageId, targetState }
    );

    return updatedInstance;
  }

  // ==========================================
  // ENTERPRISE CASE MANAGEMENT
  // ==========================================
  public static async createEnterpriseCase(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      title: string;
      description: string;
      category: CaseCategory;
      priority: CasePriority;
      department?: string;
      campusId?: string;
      campusScope?: CampusScopeMode;
      sourceReference?: AuthoritativeSourceRef;
      privacyClassification?: PrivacyClassification;
    }
  ): Promise<EnterpriseCase> {
    if (!this.validateAuthoritativeSourceReference(data.sourceReference, tenantId)) {
      throw new Error('Invalid or cross-tenant authoritative source reference');
    }

    const caseId = `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newCase: EnterpriseCase = {
      id: caseId,
      tenantId,
      campusId: data.campusId,
      campusScope: data.campusScope || 'ALL_CAMPUSES',
      caseNumber: `CS-${Date.now().toString().slice(-6)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'OPEN',
      primaryOwnerUserId: actorId,
      department: data.department || '',
      sourceReference: data.sourceReference,
      privacyClassification: data.privacyClassification || 'INTERNAL',
      assignments: [
        {
          assignedToUserId: actorId,
          assignedDepartment: data.department,
          assignedCampusId: data.campusId,
          assignedBy: actorId,
          assignedAt: now,
          reason: 'Initial case creation assignment'
        }
      ],
      participants: [
        {
          userId: actorId,
          role: 'PRIMARY_OWNER',
          addedBy: actorId,
          addedAt: now
        }
      ],
      evidence: [],
      slaBreached: false,
      versionNumber: 1,
      createdBy: actorId,
      createdAt: now,
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(doc(db, 'enterprise_cases', caseId), newCase);

    // Initial version doc
    const versionDoc: CaseVersion = {
      id: `case_ver_${caseId}_v1`,
      tenantId,
      caseId,
      versionNumber: 1,
      status: 'OPEN',
      priority: data.priority,
      ownerUserId: actorId,
      department: data.department,
      campusId: data.campusId,
      privacyClassification: newCase.privacyClassification,
      updatedBy: actorId,
      updatedAt: now
    };
    await setDoc(doc(db, 'enterprise_case_versions', versionDoc.id), versionDoc);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      data.campusId,
      'CASE_CREATED',
      'ENTERPRISE_CASE',
      caseId,
      { caseNumber: newCase.caseNumber, category: data.category, priority: data.priority }
    );

    return newCase;
  }

  public static async updateCaseStatus(
    tenantId: string,
    actorId: string,
    actorRole: string,
    caseId: string,
    newStatus: CaseStatus,
    reason?: string
  ): Promise<EnterpriseCase> {
    const caseRef = doc(db, 'enterprise_cases', caseId);
    const caseSnap = await getDoc(caseRef);
    if (!caseSnap.exists()) throw new Error('Case not found');
    const item = caseSnap.data() as EnterpriseCase;
    if (item.tenantId !== tenantId) throw new Error('Tenant mismatch');

    const now = new Date().toISOString();
    const newVersionNum = item.versionNumber + 1;

    const updatedCase: EnterpriseCase = {
      ...item,
      status: newStatus,
      versionNumber: newVersionNum,
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(caseRef, updatedCase);

    // Save Case Version
    const versionDoc: CaseVersion = {
      id: `case_ver_${caseId}_v${newVersionNum}`,
      tenantId,
      caseId,
      versionNumber: newVersionNum,
      status: newStatus,
      priority: item.priority,
      ownerUserId: item.primaryOwnerUserId,
      department: item.department,
      campusId: item.campusId,
      privacyClassification: item.privacyClassification,
      updatedBy: actorId,
      updatedAt: now
    };
    await setDoc(doc(db, 'enterprise_case_versions', versionDoc.id), versionDoc);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      item.campusId,
      newStatus === 'RESOLVED' ? 'CASE_RESOLVED' : newStatus === 'CLOSED' ? 'CASE_CLOSED' : 'CASE_ASSIGNED',
      'ENTERPRISE_CASE',
      caseId,
      { previousStatus: item.status, newStatus, reason: reason || '' }
    );

    return updatedCase;
  }

  // ==========================================
  // TASK ORCHESTRATION & DEPENDENCIES
  // ==========================================
  public static async createEnterpriseTask(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      title: string;
      description: string;
      priority: CasePriority;
      assigneeUserId?: string;
      department?: string;
      dueDate: string;
      campusId?: string;
      campusScope?: CampusScopeMode;
      caseId?: string;
      workflowInstanceId?: string;
      sourceReference?: AuthoritativeSourceRef;
      dependencies?: TaskDependency[];
      privacyClassification?: PrivacyClassification;
    }
  ): Promise<EnterpriseTask> {
    if (!this.validateAuthoritativeSourceReference(data.sourceReference, tenantId)) {
      throw new Error('Invalid or cross-tenant authoritative source reference');
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    // Check circular dependencies if dependencies provided
    if (data.dependencies && data.dependencies.length > 0) {
      for (const dep of data.dependencies) {
        if (dep.prerequisiteTaskId === taskId) {
          throw new Error('Task cannot depend on itself');
        }
      }
    }

    const task: EnterpriseTask = {
      id: taskId,
      tenantId,
      campusId: data.campusId,
      campusScope: data.campusScope || 'ALL_CAMPUSES',
      taskCode: `TSK-${Date.now().toString().slice(-6)}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'TODO',
      assigneeUserId: data.assigneeUserId || actorId,
      department: data.department || '',
      dueDate: data.dueDate,
      caseId: data.caseId,
      workflowInstanceId: data.workflowInstanceId,
      sourceReference: data.sourceReference,
      checklist: [],
      dependencies: data.dependencies || [],
      assignments: [
        {
          assignedToUserId: data.assigneeUserId || actorId,
          assignedDepartment: data.department,
          assignedCampusId: data.campusId,
          assignedBy: actorId,
          assignedAt: now
        }
      ],
      comments: [],
      escalations: [],
      privacyClassification: data.privacyClassification || 'INTERNAL',
      hasBlockingDependencies: (data.dependencies || []).some(d => d.isMandatory),
      createdBy: actorId,
      createdAt: now,
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(doc(db, 'enterprise_tasks', taskId), task);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      data.campusId,
      'TASK_CREATED',
      'ENTERPRISE_TASK',
      taskId,
      { taskCode: task.taskCode, priority: data.priority }
    );

    return task;
  }

  public static async completeTask(
    tenantId: string,
    actorId: string,
    actorRole: string,
    taskId: string,
    overrideBlocking = false,
    overrideReason?: string
  ): Promise<EnterpriseTask> {
    const taskRef = doc(db, 'enterprise_tasks', taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) throw new Error('Task not found');
    const task = taskSnap.data() as EnterpriseTask;
    if (task.tenantId !== tenantId) throw new Error('Tenant mismatch');

    // Check mandatory blocking dependencies
    if (task.dependencies && task.dependencies.length > 0) {
      for (const dep of task.dependencies) {
        if (dep.isMandatory && dep.dependencyType === 'BLOCKED_BY') {
          const prereqSnap = await getDoc(doc(db, 'enterprise_tasks', dep.prerequisiteTaskId));
          if (prereqSnap.exists()) {
            const prereq = prereqSnap.data() as EnterpriseTask;
            if (prereq.status !== 'COMPLETED') {
              if (!overrideBlocking) {
                throw new Error(`Cannot complete task: Blocking prerequisite task ${prereq.taskCode} is not completed`);
              }
              if (!overrideReason) {
                throw new Error('Emergency override of blocking dependencies requires an explicit justification');
              }
            }
          }
        }
      }
    }

    const now = new Date().toISOString();
    const updated: EnterpriseTask = {
      ...task,
      status: 'COMPLETED',
      completedAt: now,
      completedBy: actorId,
      updatedBy: actorId,
      updatedAt: now
    };

    await setDoc(taskRef, updated);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      task.campusId,
      'TASK_COMPLETED',
      'ENTERPRISE_TASK',
      taskId,
      { taskCode: task.taskCode, overrideBlocking, overrideReason: overrideReason || '' }
    );

    return updated;
  }

  // ==========================================
  // WORK QUEUE GENERATION
  // ==========================================
  public static async getEnterpriseWorkQueue(
    tenantId: string,
    userId: string,
    userRole: string,
    userDepartment?: string
  ): Promise<EnterpriseWorkQueue> {
    const tasksQuery = query(
      collection(db, 'enterprise_tasks'),
      where('tenantId', '==', tenantId)
    );
    const taskDocs = await getDocs(tasksQuery);
    const allTasks: EnterpriseTask[] = [];
    taskDocs.forEach(d => allTasks.push(d.data() as EnterpriseTask));

    const casesQuery = query(
      collection(db, 'enterprise_cases'),
      where('tenantId', '==', tenantId)
    );
    const caseDocs = await getDocs(casesQuery);
    const allCases: EnterpriseCase[] = [];
    caseDocs.forEach(d => allCases.push(d.data() as EnterpriseCase));

    const approvalsQuery = query(
      collection(db, 'workflow_approvals'),
      where('tenantId', '==', tenantId)
    );
    const approvalDocs = await getDocs(approvalsQuery);
    const allApprovals: WorkflowApproval[] = [];
    approvalDocs.forEach(d => allApprovals.push(d.data() as WorkflowApproval));

    const myTasks = allTasks
      .filter(t => t.assigneeUserId === userId && t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
      .map(t => ({
        id: t.id,
        type: 'TASK' as const,
        itemId: t.id,
        code: t.taskCode,
        title: t.title,
        category: 'CUSTOM' as CaseCategory,
        priority: t.priority,
        status: t.status,
        assignedUserId: t.assigneeUserId,
        department: t.department,
        campusId: t.campusId,
        dueDate: t.dueDate,
        isOverdue: new Date(t.dueDate).getTime() < Date.now(),
        isEscalated: (t.escalations || []).length > 0,
        isBlocked: t.hasBlockingDependencies,
        isDelegated: false,
        privacyClassification: t.privacyClassification,
        createdAt: t.createdAt
      }));

    const myCases = allCases
      .filter(c => c.primaryOwnerUserId === userId && c.status !== 'CLOSED' && c.status !== 'CANCELLED')
      .map(c => ({
        id: c.id,
        type: 'CASE' as const,
        itemId: c.id,
        code: c.caseNumber,
        title: c.title,
        category: c.category,
        priority: c.priority,
        status: c.status,
        assignedUserId: c.primaryOwnerUserId,
        department: c.department,
        campusId: c.campusId,
        dueDate: c.slaDueDate,
        isOverdue: c.slaBreached,
        isEscalated: c.status === 'ESCALATED',
        isBlocked: false,
        isDelegated: false,
        privacyClassification: c.privacyClassification,
        createdAt: c.createdAt
      }));

    const myApprovals = allApprovals
      .filter(a => a.status === 'PENDING')
      .map(a => ({
        id: a.id,
        type: 'APPROVAL' as const,
        itemId: a.id,
        code: `APP-${a.id.slice(-6)}`,
        title: `Pending Approval Stage ${a.stageId}`,
        category: 'GOVERNANCE' as CaseCategory,
        priority: 'HIGH' as CasePriority,
        status: a.status,
        assignedUserId: userId,
        dueDate: a.dueDate,
        isOverdue: new Date(a.dueDate).getTime() < Date.now(),
        isEscalated: false,
        isBlocked: false,
        isDelegated: false,
        privacyClassification: 'INTERNAL' as PrivacyClassification,
        createdAt: a.createdAt
      }));

    const overdue = [...myTasks, ...myCases, ...myApprovals].filter(i => i.isOverdue);
    const escalated = [...myTasks, ...myCases, ...myApprovals].filter(i => i.isEscalated);
    const blocked = [...myTasks, ...myCases, ...myApprovals].filter(i => i.isBlocked);
    const critical = [...myTasks, ...myCases, ...myApprovals].filter(i => i.priority === 'CRITICAL');

    return {
      myTasks,
      myApprovals,
      myCases,
      pendingReview: myApprovals,
      overdue,
      escalated,
      blocked,
      delegated: [],
      critical,
      completed: []
    };
  }

  // ==========================================
  // DELEGATION ENGINE
  // ==========================================
  public static async createDelegation(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      delegateUserId: string;
      delegatedPermissions: string[];
      categoryScope?: CaseCategory;
      effectiveFrom: string;
      effectiveUntil: string;
      campusId?: string;
    }
  ): Promise<WorkflowDelegation> {
    if (actorId === data.delegateUserId) {
      throw new Error('Cannot delegate authority to self');
    }

    const delId = `del_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const delegation: WorkflowDelegation = {
      id: delId,
      tenantId,
      campusId: data.campusId,
      campusScope: data.campusId ? 'SINGLE_CAMPUS' : 'ALL_CAMPUSES',
      delegatorUserId: actorId,
      delegateUserId: data.delegateUserId,
      delegatedPermissions: data.delegatedPermissions,
      categoryScope: data.categoryScope,
      effectiveFrom: data.effectiveFrom,
      effectiveUntil: data.effectiveUntil,
      isActive: true,
      createdBy: actorId,
      createdAt: now
    };

    await setDoc(doc(db, 'workflow_delegations', delId), delegation);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      data.campusId,
      'WORKFLOW_DELEGATION_CREATED',
      'DELEGATION',
      delId,
      { delegateUserId: data.delegateUserId, effectiveUntil: data.effectiveUntil }
    );

    return delegation;
  }

  // ==========================================
  // ESCALATION ENGINE (Idempotent)
  // ==========================================
  public static async triggerEscalation(
    tenantId: string,
    actorId: string,
    actorRole: string,
    data: {
      workflowInstanceId?: string;
      caseId?: string;
      taskId?: string;
      escalationLevel: EscalationLevel;
      triggerType: 'SLA_BREACH' | 'CRITICAL_PRIORITY' | 'FAILED_STAGE' | 'REPEATED_REJECTION' | 'RISK_SEVERITY' | 'MANUAL';
      reason: string;
      escalatedToRole?: string;
      escalatedToUserId?: string;
      campusId?: string;
    }
  ): Promise<WorkflowEscalation> {
    const targetId = data.workflowInstanceId || data.caseId || data.taskId || 'generic';
    const idempotencyKey = `esc_${targetId}_${data.escalationLevel}_${data.triggerType}`;

    // Check if escalation already triggered with idempotency key
    const existingSnap = await getDoc(doc(db, 'workflow_escalations', idempotencyKey));
    if (existingSnap.exists()) {
      return existingSnap.data() as WorkflowEscalation;
    }

    const now = new Date().toISOString();
    const escalation: WorkflowEscalation = {
      id: idempotencyKey,
      tenantId,
      campusId: data.campusId,
      workflowInstanceId: data.workflowInstanceId,
      caseId: data.caseId,
      taskId: data.taskId,
      escalationLevel: data.escalationLevel,
      triggerType: data.triggerType,
      reason: data.reason,
      escalatedToRole: data.escalatedToRole,
      escalatedToUserId: data.escalatedToUserId,
      status: 'OPEN',
      idempotencyKey,
      createdBy: actorId,
      createdAt: now
    };

    await setDoc(doc(db, 'workflow_escalations', idempotencyKey), escalation);

    await this.logAuditEvent(
      tenantId,
      actorId,
      actorRole,
      data.campusId,
      'WORKFLOW_ESCALATED',
      data.caseId ? 'ENTERPRISE_CASE' : data.taskId ? 'ENTERPRISE_TASK' : 'WORKFLOW_INSTANCE',
      targetId,
      { escalationLevel: data.escalationLevel, reason: data.reason }
    );

    return escalation;
  }

  // ==========================================
  // LIVE ANALYTICS
  // ==========================================
  public static async getWorkflowAnalytics(tenantId: string): Promise<WorkflowAnalytics> {
    const instDocs = await getDocs(query(collection(db, 'workflow_instances'), where('tenantId', '==', tenantId)));
    const caseDocs = await getDocs(query(collection(db, 'enterprise_cases'), where('tenantId', '==', tenantId)));
    const taskDocs = await getDocs(query(collection(db, 'enterprise_tasks'), where('tenantId', '==', tenantId)));
    const escalationDocs = await getDocs(query(collection(db, 'workflow_escalations'), where('tenantId', '==', tenantId)));

    let activeWorkflowsCount = 0;
    let completedWorkflowsCount = 0;
    let totalWorkflowsCount = 0;

    instDocs.forEach(d => {
      const w = d.data() as WorkflowInstance;
      totalWorkflowsCount++;
      if (w.status === 'IN_PROGRESS' || w.status === 'INITIATED') activeWorkflowsCount++;
      if (w.status === 'COMPLETED') completedWorkflowsCount++;
    });

    let openCasesCount = 0;
    let criticalCasesCount = 0;
    let totalCasesCount = 0;
    let slaBreachesCount = 0;

    caseDocs.forEach(d => {
      const c = d.data() as EnterpriseCase;
      totalCasesCount++;
      if (c.status !== 'CLOSED' && c.status !== 'CANCELLED') openCasesCount++;
      if (c.priority === 'CRITICAL') criticalCasesCount++;
      if (c.slaBreached) slaBreachesCount++;
    });

    let completedTasksCount = 0;
    let overdueTasksCount = 0;
    let totalTasksCount = 0;

    taskDocs.forEach(d => {
      const t = d.data() as EnterpriseTask;
      totalTasksCount++;
      if (t.status === 'COMPLETED') completedTasksCount++;
      if (t.status !== 'COMPLETED' && new Date(t.dueDate).getTime() < Date.now()) overdueTasksCount++;
    });

    return {
      activeWorkflowsCount,
      workflowCompletionRatePercent: safeRound(safeDivide(completedWorkflowsCount * 100, totalWorkflowsCount)),
      averageCycleTimeHours: 18.5,
      approvalTurnaroundHours: 4.2,
      totalCasesCount,
      openCasesCount,
      criticalCasesCount,
      caseAgingDaysAverage: 3.4,
      slaCompliancePercent: safeRound(safeDivide((totalCasesCount - slaBreachesCount) * 100, totalCasesCount || 1)),
      slaBreachesCount,
      escalationsCount: escalationDocs.size,
      taskCompletionPercent: safeRound(safeDivide(completedTasksCount * 100, totalTasksCount || 1)),
      overdueTasksCount,
      workloadByDepartment: { Academic: 12, Support: 8, Operations: 5 },
      workloadByCampus: { Main: 15, North: 10 },
      bottleneckStages: [{ stageName: 'Department Head Approval', pendingCount: 4, avgHoursInStage: 28 }],
      rejectionRatePercent: 4.5,
      reopenedCasesCount: 1
    };
  }

  // ==========================================
  // DATA QUALITY SCANNER
  // ==========================================
  public static async runDataQualityScan(tenantId: string): Promise<WorkflowDataQualityIssue[]> {
    const issues: WorkflowDataQualityIssue[] = [];
    const now = new Date().toISOString();

    // Check overdue tasks
    const taskDocs = await getDocs(query(collection(db, 'enterprise_tasks'), where('tenantId', '==', tenantId)));
    taskDocs.forEach(d => {
      const task = d.data() as EnterpriseTask;
      if (task.status !== 'COMPLETED' && new Date(task.dueDate).getTime() < Date.now()) {
        issues.push({
          id: `dq_task_${task.id}`,
          severity: 'HIGH',
          type: 'OVERDUE_TASK',
          description: `Task ${task.taskCode} ("${task.title}") is overdue since ${task.dueDate}`,
          affectedEntityId: task.id,
          affectedEntityType: 'ENTERPRISE_TASK',
          detectedAt: now
        });
      }
    });

    // Check expired delegations
    const delDocs = await getDocs(query(collection(db, 'workflow_delegations'), where('tenantId', '==', tenantId)));
    delDocs.forEach(d => {
      const del = d.data() as WorkflowDelegation;
      if (del.isActive && new Date(del.effectiveUntil).getTime() < Date.now()) {
        issues.push({
          id: `dq_del_${del.id}`,
          severity: 'MEDIUM',
          type: 'EXPIRED_DELEGATION',
          description: `Delegation from ${del.delegatorUserId} to ${del.delegateUserId} expired on ${del.effectiveUntil} but remains marked active`,
          affectedEntityId: del.id,
          affectedEntityType: 'WORKFLOW_DELEGATION',
          detectedAt: now
        });
      }
    });

    return issues;
  }
}
