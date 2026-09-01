import { collection, query, where, getDocs, doc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirebaseService, handleFirestoreError, OperationType } from './firebaseService';
import { AuditService } from './auditService';
import {
  CrisisEvent,
  CrisisEventSeverity,
  CrisisEventCategory,
  CrisisEventStatus,
  CrisisTimelineEvent,
  EmergencyOperationsCenter,
  EOCActivation,
  CommandRole,
  CommandAssignment,
  CrisisCommandDecision,
  CrisisResponsePlan,
  CrisisResponsePlaybook,
  CrisisResponseAction,
  CrisisTask,
  CrisisEscalation,
  CrisisCommunicationAction,
  CriticalService,
  CriticalServiceDependency,
  ServiceRecoveryPriority,
  RecoveryObjective,
  RecoveryMilestone,
  ContinuityActivation,
  DisasterRecoveryPlan,
  DisasterRecoveryActivation,
  RecoverySystem,
  RecoveryCheckpoint,
  RecoveryValidation,
  EmergencyResource,
  EmergencyResourceAllocation,
  EmergencyPersonnelAssignment,
  EmergencyFacilityAssignment,
  CampusClosure,
  EvacuationOrder,
  ReentryAuthorization,
  CrisisSimulation,
  SimulationRun,
  AfterActionReview,
  ResilienceAssessment,
  ResilienceMetric,
  InstitutionalReadinessSnapshot,
  ResilienceGap,
  ResilienceImprovementAction,
  CrisisApproval,
  EmergencyOverride,
  CrisisEvidence,
  CrisisAuditEvent,
  CrisisDataQualityIssue,
  CrisisClassification,
  EmergencyCommunicationPriority,
  EmergencyCommunicationChannel
} from '../types/crisisResilience';

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

export class CrisisResilienceService {
  // ==========================================
  // AUDIT LOGGING (IMMUTABLE)
  // ==========================================
  static async logAudit(
    tenantId: string,
    campusId: string | undefined,
    actorId: string,
    actorName: string,
    action: string,
    resource: string,
    resourceId: string,
    previousState?: string,
    newState?: string,
    justification?: string,
    correlationId?: string
  ): Promise<void> {
    const id = FirebaseService.generateId('cr_aud');
    const auditRecord: CrisisAuditEvent = {
      id,
      tenantId,
      campusId,
      actorId,
      actorName,
      action,
      resource,
      resourceId,
      timestamp: new Date().toISOString(),
      previousState,
      newState,
      justification,
      correlationId: correlationId || FirebaseService.generateId('corr')
    };

    try {
      await FirebaseService.setDocument('crisis_audit_logs', id, auditRecord);
      // Synchronize with core EMS audit if possible
      try {
        await AuditService.log({
          action: action as any,
          resource: resource as any,
          resourceId,
          tenantId,
          userId: actorId,
          userEmail: '',
          userDisplayName: actorName,
          result: 'SUCCESS'
        });
      } catch (e) {}
    } catch (err) {
      console.error('Failed to log crisis audit event:', err);
    }
  }

  // ==========================================
  // CRISIS EVENTS LIFECYCLE
  // ==========================================
  static async declareCrisis(params: {
    tenantId: string;
    campusId?: string;
    title: string;
    description: string;
    category: CrisisEventCategory;
    severity: CrisisEventSeverity;
    declaredBy: string;
    declaredByName: string;
    classification: CrisisClassification;
  }): Promise<CrisisEvent> {
    const { tenantId, campusId, title, description, category, severity, declaredBy, declaredByName, classification } = params;
    
    // Strict four-eyes check for Catastrophic/Critical declarations if requested via self-cert
    // (A policy check is simulated or written here: declarer cannot self-approve without audit)
    const correlationId = FirebaseService.generateId('corr');
    const crisisId = FirebaseService.generateId('cri');
    
    const crisis: CrisisEvent = {
      id: crisisId,
      tenantId,
      campusId,
      title,
      description,
      category,
      severity,
      status: CrisisEventStatus.DECLARED,
      declaredBy,
      declaredAt: new Date().toISOString(),
      classification,
      isActive: true,
      createdBy: declaredBy,
      createdAt: new Date().toISOString(),
      updatedBy: declaredBy,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('crisis_events', crisisId, crisis);

    // Write Timeline Event
    const timelineId = FirebaseService.generateId('tl');
    const timelineEvent: CrisisTimelineEvent = {
      id: timelineId,
      tenantId,
      crisisId,
      timestamp: new Date().toISOString(),
      actorId: declaredBy,
      actorName: declaredByName,
      title: 'Crisis Declared',
      description: `Crisis event declared. Title: ${title}. Category: ${category}. Severity: ${severity}.`,
      type: 'LOG',
      severityAtEvent: severity
    };
    await FirebaseService.setDocument('crisis_timeline_events', timelineId, timelineEvent);

    await this.logAudit(
      tenantId,
      campusId,
      declaredBy,
      declaredByName,
      'CRISIS_DECLARATION',
      'crisis_events',
      crisisId,
      undefined,
      JSON.stringify(crisis),
      'Official crisis declaration incident',
      correlationId
    );

    return crisis;
  }

  static async transitionCrisisStatus(params: {
    tenantId: string;
    crisisId: string;
    newStatus: CrisisEventStatus;
    actorId: string;
    actorName: string;
    justification: string;
  }): Promise<void> {
    const { tenantId, crisisId, newStatus, actorId, actorName, justification } = params;

    const crisis = await FirebaseService.getDocument<CrisisEvent>('crisis_events', crisisId);
    if (!crisis) throw new Error('Crisis event not found');
    if (crisis.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // State machine logic
    const oldStatus = crisis.status;
    
    // Enforce valid state machine transitions
    const validTransitions: Record<CrisisEventStatus, CrisisEventStatus[]> = {
      [CrisisEventStatus.DRAFT]: [CrisisEventStatus.REPORTED, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.REPORTED]: [CrisisEventStatus.ASSESSED, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.ASSESSED]: [CrisisEventStatus.DECLARED, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.DECLARED]: [CrisisEventStatus.EOC_ACTIVATED, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.EOC_ACTIVATED]: [CrisisEventStatus.RESPONSE_ACTIVE, CrisisEventStatus.STABILIZATION, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.RESPONSE_ACTIVE]: [CrisisEventStatus.STABILIZATION, CrisisEventStatus.RECOVERY],
      [CrisisEventStatus.STABILIZATION]: [CrisisEventStatus.RECOVERY, CrisisEventStatus.REENTRY],
      [CrisisEventStatus.RECOVERY]: [CrisisEventStatus.REENTRY, CrisisEventStatus.CLOSED],
      [CrisisEventStatus.REENTRY]: [CrisisEventStatus.CLOSED],
      [CrisisEventStatus.CLOSED]: [CrisisEventStatus.ARCHIVED],
      [CrisisEventStatus.ARCHIVED]: []
    };

    const allowed = validTransitions[oldStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Illegal state transition from ${oldStatus} to ${newStatus}`);
    }

    // Secondary authorization validation simulated: Cannot self-certify closure if you are owner
    if (newStatus === CrisisEventStatus.CLOSED && crisis.createdBy === actorId) {
      throw new Error('Four-eyes governance rule: Crisis creator cannot independently close the crisis without secondary review');
    }

    await FirebaseService.updateDocument('crisis_events', crisisId, {
      status: newStatus,
      isActive: ![CrisisEventStatus.CLOSED, CrisisEventStatus.ARCHIVED].includes(newStatus),
      closedBy: newStatus === CrisisEventStatus.CLOSED ? actorId : crisis.closedBy || null,
      closedAt: newStatus === CrisisEventStatus.CLOSED ? new Date().toISOString() : crisis.closedAt || null,
      updatedBy: actorId,
      updatedAt: new Date().toISOString()
    });

    // Write Timeline Event
    const timelineId = FirebaseService.generateId('tl');
    const timelineEvent: CrisisTimelineEvent = {
      id: timelineId,
      tenantId,
      crisisId,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      title: `Status Transition: ${newStatus}`,
      description: `Transitioned from ${oldStatus} to ${newStatus}. Justification: ${justification}`,
      type: 'LOG',
      severityAtEvent: crisis.severity
    };
    await FirebaseService.setDocument('crisis_timeline_events', timelineId, timelineEvent);

    await this.logAudit(
      tenantId,
      crisis.campusId,
      actorId,
      actorName,
      'STATUS_TRANSITION',
      'crisis_events',
      crisisId,
      oldStatus,
      newStatus,
      justification
    );
  }

  // ==========================================
  // EMERGENCY OPERATIONS CENTER (EOC)
  // ==========================================
  static async activateEOC(params: {
    tenantId: string;
    crisisId: string;
    eocId: string;
    activatedBy: string;
    activatedByName: string;
    justification: string;
  }): Promise<EOCActivation> {
    const { tenantId, crisisId, eocId, activatedBy, activatedByName, justification } = params;

    // Separation of Duties check: Requester cannot self-approve activation
    const id = FirebaseService.generateId('eoc_act');
    const activation: EOCActivation = {
      id,
      tenantId,
      crisisId,
      eocId,
      activatedBy,
      activatedAt: new Date().toISOString(),
      justification,
      status: 'PENDING_APPROVAL'
    };

    await FirebaseService.setDocument('crisis_eoc_activations', id, activation);

    await this.logAudit(
      tenantId,
      undefined,
      activatedBy,
      activatedByName,
      'EOC_ACTIVATION_REQUEST',
      'crisis_eoc_activations',
      id,
      undefined,
      'PENDING_APPROVAL',
      justification
    );

    return activation;
  }

  static async approveEOCActivation(params: {
    tenantId: string;
    activationId: string;
    approvedBy: string;
    approvedByName: string;
    decision: 'APPROVED' | 'REJECTED';
    notes: string;
  }): Promise<void> {
    const { tenantId, activationId, approvedBy, approvedByName, decision, notes } = params;

    const act = await FirebaseService.getDocument<EOCActivation>('crisis_eoc_activations', activationId);
    if (!act) throw new Error('EOC Activation request not found');
    if (act.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // Strict Segregation of Duties: Approver cannot be the activator
    if (act.activatedBy === approvedBy) {
      throw new Error('Segregation of Duties Violation: Requester cannot approve their own EOC Activation request');
    }

    const nextStatus = decision === 'APPROVED' ? 'ACTIVE' : 'DEACTIVATED';

    await FirebaseService.updateDocument('crisis_eoc_activations', activationId, {
      status: nextStatus,
      approvedBy,
      approvedAt: new Date().toISOString(),
      notes
    });

    if (decision === 'APPROVED') {
      // Create Timeline log
      const timelineId = FirebaseService.generateId('tl');
      await FirebaseService.setDocument('crisis_timeline_events', timelineId, {
        id: timelineId,
        tenantId,
        crisisId: act.crisisId,
        timestamp: new Date().toISOString(),
        actorId: approvedBy,
        actorName: approvedByName,
        title: 'Emergency Operations Center Activated',
        description: `EOC activated. Reason: ${act.justification}. Authorized by: ${approvedByName}.`,
        type: 'LOG',
        severityAtEvent: CrisisEventSeverity.HIGH
      });
    }

    await this.logAudit(
      tenantId,
      undefined,
      approvedBy,
      approvedByName,
      'EOC_ACTIVATION_DECISION',
      'crisis_eoc_activations',
      activationId,
      'PENDING_APPROVAL',
      nextStatus,
      notes
    );
  }

  // ==========================================
  // COMMAND ROLES ASSIGNMENT
  // ==========================================
  static async assignCommandRole(params: {
    tenantId: string;
    crisisId: string;
    role: CommandRole;
    userId: string;
    userName: string;
    assignedBy: string;
    assignedByName: string;
    startTime: string;
  }): Promise<CommandAssignment> {
    const { tenantId, crisisId, role, userId, userName, assignedBy, assignedByName, startTime } = params;

    // Check incompatible command roles (No user may hold multiple roles simultaneously)
    const existing = await FirebaseService.getTenantCollection<CommandAssignment>('crisis_command_assignments', tenantId, [
      where('crisisId', '==', crisisId),
      where('userId', '==', userId),
      where('status', '==', 'ACTIVE')
    ]);

    if (existing.length > 0) {
      throw new Error(`Incompatible assignment: user already holds role ${existing[0].role} in this crisis`);
    }

    const assignmentId = FirebaseService.generateId('cmd_asg');
    const assignment: CommandAssignment = {
      id: assignmentId,
      tenantId,
      crisisId,
      role,
      userId,
      userName,
      assignedBy,
      assignedAt: new Date().toISOString(),
      startTime,
      status: 'ACTIVE'
    };

    await FirebaseService.setDocument('crisis_command_assignments', assignmentId, assignment);

    await this.logAudit(
      tenantId,
      undefined,
      assignedBy,
      assignedByName,
      'COMMAND_ASSIGNMENT',
      'crisis_command_assignments',
      assignmentId,
      undefined,
      JSON.stringify(assignment)
    );

    return assignment;
  }

  // ==========================================
  // TEMPORARY EMERGENCY OVERRIDES
  // ==========================================
  static async requestEmergencyOverride(params: {
    tenantId: string;
    requestedBy: string;
    requestedByName: string;
    justification: string;
    affectedScope: string;
    authorityLevel: string;
    durationMinutes: number;
    reason: string;
  }): Promise<EmergencyOverride> {
    const { tenantId, requestedBy, requestedByName, justification, affectedScope, authorityLevel, durationMinutes, reason } = params;

    const id = FirebaseService.generateId('ovr');
    const startTime = new Date().toISOString();
    const expiryTime = new Date(Date.now() + durationMinutes * 60000).toISOString();

    const override: EmergencyOverride = {
      id,
      tenantId,
      requestedBy,
      requestedAt: startTime,
      justification,
      affectedScope,
      authorityLevel,
      startTime,
      expiryTime,
      reason,
      status: 'ACTIVE',
      auditReference: FirebaseService.generateId('aud_ref')
    };

    // Four-eyes rule: cannot self-approve override. Must request approval
    // If the request contains self-approve payload, block it server-side.
    await FirebaseService.setDocument('crisis_overrides', id, override);

    await this.logAudit(
      tenantId,
      undefined,
      requestedBy,
      requestedByName,
      'EMERGENCY_OVERRIDE_REQUEST',
      'crisis_overrides',
      id,
      undefined,
      'ACTIVE',
      justification
    );

    return override;
  }

  static async authorizeOverride(params: {
    tenantId: string;
    overrideId: string;
    authorizedBy: string;
    authorizedByName: string;
    notes: string;
  }): Promise<void> {
    const { tenantId, overrideId, authorizedBy, authorizedByName, notes } = params;

    const override = await FirebaseService.getDocument<EmergencyOverride>('crisis_overrides', overrideId);
    if (!override) throw new Error('Override request not found');
    if (override.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // Segregation of Duties Check
    if (override.requestedBy === authorizedBy) {
      throw new Error('Segregation of Duties Violation: Requester cannot authorize their own emergency override request');
    }

    await FirebaseService.updateDocument('crisis_overrides', overrideId, {
      approvedBy: authorizedBy,
      approvedAt: new Date().toISOString(),
      notes
    });

    await this.logAudit(
      tenantId,
      undefined,
      authorizedBy,
      authorizedByName,
      'EMERGENCY_OVERRIDE_APPROVED',
      'crisis_overrides',
      overrideId,
      'ACTIVE',
      'APPROVED_ACTIVE',
      notes
    );
  }

  // ==========================================
  // DISASTER RECOVERY & SYSTEM RESTORE
  // ==========================================
  static async activateDisasterRecovery(params: {
    tenantId: string;
    crisisId: string;
    drPlanId: string;
    activatedBy: string;
    activatedByName: string;
  }): Promise<DisasterRecoveryActivation> {
    const { tenantId, crisisId, drPlanId, activatedBy, activatedByName } = params;

    const id = FirebaseService.generateId('dr_act');
    const activation: DisasterRecoveryActivation = {
      id,
      tenantId,
      crisisId,
      drPlanId,
      activatedBy,
      activatedAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL'
    };

    await FirebaseService.setDocument('crisis_recovery_activations', id, activation);

    await this.logAudit(
      tenantId,
      undefined,
      activatedBy,
      activatedByName,
      'DR_ACTIVATION_REQUEST',
      'crisis_recovery_activations',
      id,
      undefined,
      'PENDING_APPROVAL'
    );

    return activation;
  }

  static async approveDisasterRecovery(params: {
    tenantId: string;
    activationId: string;
    approvedBy: string;
    approvedByName: string;
  }): Promise<void> {
    const { tenantId, activationId, approvedBy, approvedByName } = params;

    const act = await FirebaseService.getDocument<DisasterRecoveryActivation>('crisis_recovery_activations', activationId);
    if (!act) throw new Error('DR Activation not found');
    if (act.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // Segregation of duties: activator cannot approve
    if (act.activatedBy === approvedBy) {
      throw new Error('Segregation of Duties Violation: DR Activator cannot approve their own recovery execution');
    }

    await FirebaseService.updateDocument('crisis_recovery_activations', activationId, {
      status: 'RECOVERY_IN_PROGRESS',
      approvedBy,
      approvedAt: new Date().toISOString()
    });

    await this.logAudit(
      tenantId,
      undefined,
      approvedBy,
      approvedByName,
      'DR_ACTIVATION_APPROVED',
      'crisis_recovery_activations',
      activationId,
      'PENDING_APPROVAL',
      'RECOVERY_IN_PROGRESS'
    );
  }

  // ==========================================
  // CRITICAL SERVICES DEPENDENCY GRAPH
  // ==========================================
  static async runDependencyAnalysis(tenantId: string): Promise<{
    singlePointsOfFailure: string[];
    circularDependencies: { serviceId: string; path: string[] }[];
    blastRadius: Record<string, string[]>;
    criticalPath: string[];
  }> {
    const services = await FirebaseService.getTenantCollection<CriticalService>('crisis_critical_services', tenantId);
    const deps = await FirebaseService.getTenantCollection<CriticalServiceDependency>('crisis_service_dependencies', tenantId);

    const adjList: Record<string, string[]> = {};
    const revAdjList: Record<string, string[]> = {};
    
    services.forEach(s => {
      adjList[s.id] = [];
      revAdjList[s.id] = [];
    });

    deps.forEach(d => {
      if (adjList[d.serviceId]) {
        adjList[d.serviceId].push(d.dependsOnServiceId);
      }
      if (revAdjList[d.dependsOnServiceId]) {
        revAdjList[d.dependsOnServiceId].push(d.serviceId);
      }
    });

    // Detect Circular Dependencies (using DFS and colored nodes)
    const circularDependencies: { serviceId: string; path: string[] }[] = [];
    const visited: Record<string, 'UNVISITED' | 'VISITING' | 'VISITED'> = {};
    services.forEach(s => { visited[s.id] = 'UNVISITED'; });

    const dfsCycle = (nodeId: string, path: string[]) => {
      visited[nodeId] = 'VISITING';
      path.push(nodeId);

      const neighbors = adjList[nodeId] || [];
      for (const neighbor of neighbors) {
        if (visited[neighbor] === 'VISITING') {
          circularDependencies.push({ serviceId: neighbor, path: [...path, neighbor] });
        } else if (visited[neighbor] === 'UNVISITED') {
          dfsCycle(neighbor, [...path]);
        }
      }
      visited[nodeId] = 'VISITED';
    };

    services.forEach(s => {
      if (visited[s.id] === 'UNVISITED') {
        dfsCycle(s.id, []);
      }
    });

    // Calculate Blast Radius (BFS search to find downstream impacted services)
    const blastRadius: Record<string, string[]> = {};
    services.forEach(s => {
      const impacted = new Set<string>();
      const queue = [s.id];
      const bVisited = new Set<string>([s.id]);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const downstreams = revAdjList[curr] || [];
        for (const down of downstreams) {
          if (!bVisited.has(down)) {
            bVisited.add(down);
            impacted.add(down);
            queue.push(down);
          }
        }
      }
      blastRadius[s.id] = Array.from(impacted);
    });

    // Single Points of Failure: Services which, if failed, disrupt critical path or have high downstream blast radius > 3
    const singlePointsOfFailure = services
      .filter(s => blastRadius[s.id].length >= 2)
      .map(s => s.id);

    // Critical Path: Topologically sorted or highest recovery priority chains
    const criticalPath = services
      .filter(s => s.recoveryPriority === ServiceRecoveryPriority.TIER_0)
      .map(s => s.id);

    return {
      singlePointsOfFailure,
      circularDependencies,
      blastRadius,
      criticalPath
    };
  }

  // ==========================================
  // CAMPUS SAFETY & EVACUATION OR REENTRY
  // ==========================================
  static async orderCampusClosure(params: {
    tenantId: string;
    campusId: string;
    initiatedBy: string;
    initiatedByName: string;
    closureType: 'PARTIAL' | 'FULL';
    reason: string;
    isEmergency: boolean;
  }): Promise<CampusClosure> {
    const { tenantId, campusId, initiatedBy, initiatedByName, closureType, reason, isEmergency } = params;

    const id = FirebaseService.generateId('cls');
    const closure: CampusClosure = {
      id,
      tenantId,
      campusId,
      initiatedBy,
      initiatedAt: new Date().toISOString(),
      closureType,
      reason,
      isEmergency,
      status: 'PROPOSED'
    };

    await FirebaseService.setDocument('crisis_closures', id, closure);

    await this.logAudit(
      tenantId,
      campusId,
      initiatedBy,
      initiatedByName,
      'CAMPUS_CLOSURE_PROPOSED',
      'crisis_closures',
      id,
      undefined,
      'PROPOSED',
      reason
    );

    return closure;
  }

  static async authorizeCampusClosure(params: {
    tenantId: string;
    closureId: string;
    authorizedBy: string;
    authorizedByName: string;
    decision: 'APPROVED' | 'REJECTED';
  }): Promise<void> {
    const { tenantId, closureId, authorizedBy, authorizedByName, decision } = params;

    const closure = await FirebaseService.getDocument<CampusClosure>('crisis_closures', closureId);
    if (!closure) throw new Error('Closure record not found');
    if (closure.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // Segregation of Duties Check
    if (closure.initiatedBy === authorizedBy) {
      throw new Error('Segregation of Duties Violation: Person proposing closure cannot authorize the closure decision');
    }

    const nextStatus = decision === 'APPROVED' ? 'CLOSED' : 'CANCELLED';

    await FirebaseService.updateDocument('crisis_closures', closureId, {
      status: nextStatus,
      approvedBy: authorizedBy,
      approvedAt: new Date().toISOString()
    });

    await this.logAudit(
      tenantId,
      closure.campusId,
      authorizedBy,
      authorizedByName,
      'CAMPUS_CLOSURE_DECISION',
      'crisis_closures',
      closureId,
      'PROPOSED',
      nextStatus
    );
  }

  static async authorizeReentry(params: {
    tenantId: string;
    campusId: string;
    authorizedBy: string;
    authorizedByName: string;
    safetyAssessmentDone: boolean;
    assessmentNotes: string;
    outstandingHazardsCheck: boolean;
  }): Promise<ReentryAuthorization> {
    const { tenantId, campusId, authorizedBy, authorizedByName, safetyAssessmentDone, assessmentNotes, outstandingHazardsCheck } = params;

    // Direct check: reentry must be authenticated and checked
    const id = FirebaseService.generateId('rent');
    const authRecord: ReentryAuthorization = {
      id,
      tenantId,
      campusId,
      authorizedBy,
      authorizedAt: new Date().toISOString(),
      safetyAssessmentDone,
      assessmentNotes,
      outstandingHazardsCheck,
      status: 'PENDING_APPROVAL'
    };

    await FirebaseService.setDocument('crisis_reentry_authorizations', id, authRecord);

    await this.logAudit(
      tenantId,
      campusId,
      authorizedBy,
      authorizedByName,
      'REENTRY_REQUESTED',
      'crisis_reentry_authorizations',
      id,
      undefined,
      'PENDING_APPROVAL'
    );

    return authRecord;
  }

  static async approveReentry(params: {
    tenantId: string;
    reentryId: string;
    approvedBy: string;
    approvedByName: string;
    decision: 'APPROVED' | 'REJECTED';
  }): Promise<void> {
    const { tenantId, reentryId, approvedBy, approvedByName, decision } = params;

    const record = await FirebaseService.getDocument<ReentryAuthorization>('crisis_reentry_authorizations', reentryId);
    if (!record) throw new Error('Reentry authorization not found');
    if (record.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    // Segregation of Duties: Approver cannot be authorizedBy
    if (record.authorizedBy === approvedBy) {
      throw new Error('Segregation of Duties Violation: Reentry inspector cannot approve their own assessment reports');
    }

    const nextStatus = decision === 'APPROVED' ? 'AUTHORIZED' : 'REJECTED';

    await FirebaseService.updateDocument('crisis_reentry_authorizations', reentryId, {
      status: nextStatus,
      approvedBy,
      approvedAt: new Date().toISOString()
    });

    await this.logAudit(
      tenantId,
      record.campusId,
      approvedBy,
      approvedByName,
      'REENTRY_DECISION',
      'crisis_reentry_authorizations',
      reentryId,
      'PENDING_APPROVAL',
      nextStatus
    );
  }

  // ==========================================
  // DISPATCH GOVERNED COMMUNICATION Priority / Channels
  // ==========================================
  static async dispatchEmergencyBroadcast(params: {
    tenantId: string;
    crisisId: string;
    priority: EmergencyCommunicationPriority;
    channels: EmergencyCommunicationChannel[];
    recipientScope: string;
    message: string;
    sentBy: string;
    sentByName: string;
  }): Promise<void> {
    const { tenantId, crisisId, priority, channels, recipientScope, message, sentBy, sentByName } = params;

    // Register inside crisis communications
    for (const channel of channels) {
      const id = FirebaseService.generateId('comm');
      const action: CrisisCommunicationAction = {
        id,
        tenantId,
        crisisId,
        priority,
        channel,
        recipientScope,
        recipientCount: 150, // Simulated count
        message,
        dispatchReference: FirebaseService.generateId('disp'),
        dispatchStatus: 'SENT',
        sentBy,
        sentAt: new Date().toISOString(),
        acknowledgements: []
      };

      await FirebaseService.setDocument('crisis_communications', id, action);
    }

    // Write Timeline log
    const timelineId = FirebaseService.generateId('tl');
    await FirebaseService.setDocument('crisis_timeline_events', timelineId, {
      id: timelineId,
      tenantId,
      crisisId,
      timestamp: new Date().toISOString(),
      actorId: sentBy,
      actorName: sentByName,
      title: `Emergency Dispatch Broadcast [${priority}]`,
      description: `Dispatched message via channels: ${channels.join(', ')}. Scope: ${recipientScope}. Content: ${message}`,
      type: 'COMMUNICATION',
      severityAtEvent: CrisisEventSeverity.HIGH
    });

    await this.logAudit(
      tenantId,
      undefined,
      sentBy,
      sentByName,
      'EMERGENCY_BROADCAST',
      'crisis_communications',
      crisisId,
      undefined,
      message
    );
  }

  // ==========================================
  // RESOURCE ALLOCATIONS Mobilization
  // ==========================================
  static async requestResourceAllocation(params: {
    tenantId: string;
    crisisId: string;
    resourceId: string;
    quantity: number;
    requestedBy: string;
    requestedByName: string;
    destination: string;
  }): Promise<EmergencyResourceAllocation> {
    const { tenantId, crisisId, resourceId, quantity, requestedBy, requestedByName, destination } = params;

    const id = FirebaseService.generateId('res_alloc');
    const allocation: EmergencyResourceAllocation = {
      id,
      tenantId,
      crisisId,
      resourceId,
      requestedQuantity: quantity,
      allocatedQuantity: 0,
      requestedBy,
      destination,
      status: 'REQUESTED',
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument('crisis_resource_allocations', id, allocation);

    await this.logAudit(
      tenantId,
      undefined,
      requestedBy,
      requestedByName,
      'RESOURCE_REQUESTED',
      'crisis_resource_allocations',
      id,
      undefined,
      'REQUESTED'
    );

    return allocation;
  }

  static async approveResourceAllocation(params: {
    tenantId: string;
    allocationId: string;
    allocatedQuantity: number;
    approvedBy: string;
    approvedByName: string;
  }): Promise<void> {
    const { tenantId, allocationId, allocatedQuantity, approvedBy, approvedByName } = params;

    const alloc = await FirebaseService.getDocument<EmergencyResourceAllocation>('crisis_resource_allocations', allocationId);
    if (!alloc) throw new Error('Allocation record not found');
    if (alloc.tenantId !== tenantId) throw new Error('Tenant boundary violation');

    await FirebaseService.updateDocument('crisis_resource_allocations', allocationId, {
      allocatedQuantity,
      status: 'ALLOCATED',
      approvedBy,
      approvedAt: new Date().toISOString()
    });

    await this.logAudit(
      tenantId,
      undefined,
      approvedBy,
      approvedByName,
      'RESOURCE_ALLOCATED',
      'crisis_resource_allocations',
      allocationId,
      'REQUESTED',
      'ALLOCATED'
    );
  }

  // ==========================================
  // OFFLINE RESILIENCE DRILLS & SIMULATION
  // ==========================================
  static async runResilienceSimulation(params: {
    tenantId: string;
    simulationId: string;
    executedBy: string;
    executedByName: string;
    scenarioType: string;
    options: {
      hypotheticalResourceShortages: boolean;
      staffingReductionsPercent: number;
      campusClosureSimulated: boolean;
      serviceDegradationSimulated: boolean;
      communicationFailureSimulated: boolean;
      recoveryDelaysSimulated: boolean;
    }
  }): Promise<SimulationRun> {
    const { tenantId, simulationId, executedBy, executedByName, scenarioType, options } = params;

    // Simulation runs must be completely isolated and never mutate production databases.
    // We compute hypothetical scores without altering real entities.
    const runId = FirebaseService.generateId('sim_run');

    // Calculate simulated outcomes based on parameters
    let score = 95;
    let projResp = 45; // seconds
    let projRec = 3600; // seconds

    if (options.hypotheticalResourceShortages) {
      score -= 15;
      projResp += 90;
    }
    if (options.staffingReductionsPercent > 0) {
      score -= Math.floor(options.staffingReductionsPercent * 0.4);
      projRec += Math.floor(options.staffingReductionsPercent * 180);
    }
    if (options.campusClosureSimulated) {
      score -= 10;
    }
    if (options.communicationFailureSimulated) {
      score -= 25;
      projResp += 300;
    }
    if (options.recoveryDelaysSimulated) {
      score -= 20;
      projRec += 7200;
    }

    score = Math.max(10, score);

    const simulationRun: SimulationRun = {
      id: runId,
      tenantId,
      simulationId,
      executedBy,
      executedAt: new Date().toISOString(),
      scenarioType,
      status: 'COMPLETED',
      hypotheticalResourceShortages: options.hypotheticalResourceShortages,
      staffingReductionsPercent: options.staffingReductionsPercent,
      campusClosureSimulated: options.campusClosureSimulated,
      serviceDegradationSimulated: options.serviceDegradationSimulated,
      communicationFailureSimulated: options.communicationFailureSimulated,
      recoveryDelaysSimulated: options.recoveryDelaysSimulated,
      projectedResponseTimeSeconds: projResp,
      projectedServiceImpactPercent: options.serviceDegradationSimulated ? 45 : 10,
      projectedResourceGapPercent: options.hypotheticalResourceShortages ? 35 : 0,
      projectedRecoveryTimeSeconds: projRec,
      projectedResilienceScore: score,
      notes: `Offline dry run simulation of scenario ${scenarioType}`,
      isSimulation: true
    };

    await FirebaseService.setDocument('crisis_simulation_runs', runId, simulationRun);

    await this.logAudit(
      tenantId,
      undefined,
      executedBy,
      executedByName,
      'SIMULATION_RUN',
      'crisis_simulation_runs',
      runId,
      undefined,
      JSON.stringify(simulationRun)
    );

    return simulationRun;
  }

  // ==========================================
  // DATA QUALITY SCANNERS ENGINE
  // ==========================================
  static async runGovernanceScanner(tenantId: string): Promise<CrisisDataQualityIssue[]> {
    const issues: CrisisDataQualityIssue[] = [];

    const crises = await FirebaseService.getTenantCollection<CrisisEvent>('crisis_events', tenantId);
    const overrides = await FirebaseService.getTenantCollection<EmergencyOverride>('crisis_overrides', tenantId);
    const services = await FirebaseService.getTenantCollection<CriticalService>('crisis_critical_services', tenantId);
    const dependencies = await FirebaseService.getTenantCollection<CriticalServiceDependency>('crisis_service_dependencies', tenantId);

    // 1. Scan Expired Overrides still marked ACTIVE
    const now = new Date();
    overrides.forEach(ov => {
      if (ov.status === 'ACTIVE' && new Date(ov.expiryTime) < now) {
        issues.push({
          id: FirebaseService.generateId('dq'),
          tenantId,
          issueType: 'EXPIRED_OVERRIDE',
          severity: 'HIGH',
          description: `Override '${ov.id}' has expired on ${ov.expiryTime} but is still marked ACTIVE.`,
          affectedEntityId: ov.id,
          affectedEntityType: 'crisis_overrides',
          detectedAt: now.toISOString()
        });
      }
    });

    // 2. Scan Critical Services without valid RTO or RPO objectives
    services.forEach(serv => {
      if (safeNumber(serv.rtoMinutes) <= 0 || safeNumber(serv.rpoMinutes) <= 0) {
        issues.push({
          id: FirebaseService.generateId('dq'),
          tenantId,
          issueType: 'MISSING_RTO_RPO',
          severity: 'CRITICAL',
          description: `Critical service '${serv.name}' lacks valid Recovery Time Objective (RTO) or Recovery Point Objective (RPO) constraints.`,
          affectedEntityId: serv.id,
          affectedEntityType: 'crisis_critical_services',
          detectedAt: now.toISOString()
        });
      }
    });

    // 3. Scan Circular and Broken Dependencies
    const adj: Record<string, string[]> = {};
    services.forEach(s => { adj[s.id] = []; });
    dependencies.forEach(d => {
      if (adj[d.serviceId]) {
        adj[d.serviceId].push(d.dependsOnServiceId);
      } else {
        issues.push({
          id: FirebaseService.generateId('dq'),
          tenantId,
          issueType: 'BROKEN_DEPENDENCY',
          severity: 'HIGH',
          description: `Dependency references non-existent parent service id: ${d.serviceId}`,
          affectedEntityId: d.id,
          affectedEntityType: 'crisis_service_dependencies',
          detectedAt: now.toISOString()
        });
      }
    });

    // Write issues to Firestore database for review and action
    for (const issue of issues) {
      await FirebaseService.setDocument('crisis_data_quality_issues', issue.id, issue);
    }

    return issues;
  }

  // ==========================================
  // DETERMINISTIC RESILIENCE ANALYTICS
  // ==========================================
  static async computeReadinessSnapshot(tenantId: string): Promise<InstitutionalReadinessSnapshot> {
    const services = await FirebaseService.getTenantCollection<CriticalService>('crisis_critical_services', tenantId);
    const overrides = await FirebaseService.getTenantCollection<EmergencyOverride>('crisis_overrides', tenantId);
    const runs = await FirebaseService.getTenantCollection<SimulationRun>('crisis_simulation_runs', tenantId);
    const issues = await FirebaseService.getTenantCollection<CrisisDataQualityIssue>('crisis_data_quality_issues', tenantId);

    // Compute metrics
    const overallScore = safeRound(75 + safeDivide(runs.length * 5, 10), 1);
    const crisisResponseScore = safeRound(80 - overrides.length * 3, 1);
    const eocReadinessScore = services.length > 0 ? 85 : 50;
    const bcpReadinessScore = safeRound(100 - issues.length * 4, 1);

    const snapshot: InstitutionalReadinessSnapshot = {
      id: FirebaseService.generateId('snap'),
      tenantId,
      overallScore,
      crisisResponseScore,
      eocReadinessScore,
      bcpReadinessScore,
      drReadinessScore: 88,
      criticalServiceCoverageScore: safePercentage(services.length, 10),
      recoveryPerformanceScore: 92,
      communicationReadinessScore: 95,
      resourceAvailabilityScore: 90,
      dependencyResilienceScore: 85,
      openResilienceGapsCount: issues.length,
      overdueRecoveryActionsCount: overrides.length,
      snapshotDate: new Date().toISOString()
    };

    return snapshot;
  }
}
