import { FirebaseService, handleFirestoreError, OperationType } from './firebaseService';
import {
  InstitutionalRiskItem,
  RiskMitigationAction,
  KeyRiskIndicator,
  CampusIncidentItem,
  BusinessContinuityPlan,
  SafetyAuditInspection,
  ContinuitySimulationDrill,
  InstitutionalRiskAnalytics,
  RiskCategory,
  RiskSeverity,
  RiskStatus,
  KriStatus,
  IncidentStatus,
  IncidentSeverity,
  PostIncidentReview,
  BcpStep,
  InspectionFinding
} from '../types/institutionalRisk';
import { AuditService } from './auditService';
import { User } from '../types/index';

export interface UserActor {
  id?: string;
  uid?: string;
  name?: string;
  displayName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  campusId?: string;
  isPlatformSuperAdmin?: boolean;
}

const INSTITUTIONAL_RISKS_COL = 'institutional_risks';
const RISK_MITIGATIONS_COL = 'institutional_risk_mitigations';
const KEY_RISK_INDICATORS_COL = 'institutional_key_risk_indicators';
const CAMPUS_INCIDENTS_COL = 'campus_incidents';
const BUSINESS_CONTINUITY_PLANS_COL = 'business_continuity_plans';
const SAFETY_INSPECTIONS_COL = 'safety_audit_inspections';
const CONTINUITY_DRILLS_COL = 'continuity_simulation_drills';

export class InstitutionalRiskService {
  private static getActorId(user?: UserActor | User): string {
    return user?.id || (user as any)?.uid || 'system_user';
  }

  private static getActorName(user?: UserActor | User): string {
    return user?.displayName || (user as any)?.name || user?.email || 'System User';
  }

  private static getActorEmail(user?: UserActor | User): string {
    return user?.email || '';
  }

  private static getActorRole(user?: UserActor | User): string {
    return (user as any)?.role || (user as any)?.roles?.[0] || 'STAFF';
  }

  // Helper to calculate risk severity
  private static calculateSeverity(score: number): RiskSeverity {
    if (score >= 15) return 'CRITICAL';
    if (score >= 10) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    return 'LOW';
  }

  // =========================================================================
  // 1. ENTERPRISE RISK REGISTER (ERM)
  // =========================================================================

  static async createRiskItem(
    tenantId: string,
    params: {
      campusId?: string;
      riskCode: string;
      title: string;
      description: string;
      category: RiskCategory;
      inherentProbability: number;
      inherentImpact: number;
      strategy: 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';
      mitigationSummary: string;
      residualProbability: number;
      residualImpact: number;
      riskOwnerId: string;
      riskOwnerName: string;
      riskOwnerDepartment: string;
      reviewCadence: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';
      nextReviewDate: string;
    },
    user?: UserActor | User
  ): Promise<InstitutionalRiskItem> {
    try {
      const riskId = FirebaseService.generateId('rsk');
      const now = new Date().toISOString();
      const inherentScore = params.inherentProbability * params.inherentImpact;
      const residualScore = params.residualProbability * params.residualImpact;

      const riskItem: InstitutionalRiskItem = {
        id: riskId,
        tenantId,
        campusId: params.campusId,
        riskCode: params.riskCode,
        title: params.title,
        description: params.description,
        category: params.category,
        status: 'DRAFT',
        version: 1,
        inherentProbability: params.inherentProbability,
        inherentImpact: params.inherentImpact,
        inherentScore,
        inherentSeverity: this.calculateSeverity(inherentScore),
        strategy: params.strategy,
        mitigationSummary: params.mitigationSummary,
        residualProbability: params.residualProbability,
        residualImpact: params.residualImpact,
        residualScore,
        residualSeverity: this.calculateSeverity(residualScore),
        riskOwnerId: params.riskOwnerId,
        riskOwnerName: params.riskOwnerName,
        riskOwnerDepartment: params.riskOwnerDepartment,
        reviewCadence: params.reviewCadence,
        lastReviewedAt: now,
        nextReviewDate: params.nextReviewDate,
        mitigationIds: [],
        kriIds: [],
        incidentIds: [],
        createdBy: this.getActorId(user),
        createdByName: this.getActorName(user),
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(INSTITUTIONAL_RISKS_COL, riskId, riskItem);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_CREATED' as any,
        resource: 'risk_item' as any,
        resourceId: riskId,
        notes: `Drafted enterprise risk: ${params.riskCode} - ${params.title}`
      });

      return riskItem;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, INSTITUTIONAL_RISKS_COL);
    }
  }

  static async submitRiskItemForReview(
    tenantId: string,
    riskId: string,
    user?: UserActor | User
  ): Promise<InstitutionalRiskItem> {
    try {
      const risk = await FirebaseService.getDocument<InstitutionalRiskItem>(INSTITUTIONAL_RISKS_COL, riskId);
      if (!risk || risk.tenantId !== tenantId) {
        throw new Error('Risk item not found.');
      }

      if (risk.status !== 'DRAFT') {
        throw new Error(`Cannot submit risk with status ${risk.status}. Must be DRAFT.`);
      }

      const now = new Date().toISOString();
      const updated: InstitutionalRiskItem = {
        ...risk,
        status: 'SUBMITTED_FOR_REVIEW',
        updatedAt: now
      };

      await FirebaseService.setDocument(INSTITUTIONAL_RISKS_COL, riskId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_UPDATED' as any,
        resource: 'risk_item' as any,
        resourceId: riskId,
        notes: `Submitted risk for review: ${risk.riskCode}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${INSTITUTIONAL_RISKS_COL}/${riskId}`);
    }
  }

  static async approveRiskItem(
    tenantId: string,
    riskId: string,
    approvalNotes: string,
    user?: UserActor | User
  ): Promise<InstitutionalRiskItem> {
    try {
      const risk = await FirebaseService.getDocument<InstitutionalRiskItem>(INSTITUTIONAL_RISKS_COL, riskId);
      if (!risk || risk.tenantId !== tenantId) {
        throw new Error('Risk item not found.');
      }

      const currentUserId = this.getActorId(user);
      // Separation of Duties Check
      if (risk.createdBy === currentUserId) {
        throw new Error('Separation of Duties violation: The creator of a risk cannot approve it.');
      }

      if (risk.status !== 'SUBMITTED_FOR_REVIEW') {
        throw new Error(`Cannot approve risk with status ${risk.status}. Must be SUBMITTED_FOR_REVIEW.`);
      }

      const now = new Date().toISOString();
      const updated: InstitutionalRiskItem = {
        ...risk,
        status: 'APPROVED',
        approvedBy: currentUserId,
        approvedByName: this.getActorName(user),
        approvedAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(INSTITUTIONAL_RISKS_COL, riskId, updated);

      await AuditService.log({
        tenantId,
        userId: currentUserId,
        actorId: currentUserId,
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_APPROVED' as any,
        resource: 'risk_item' as any,
        resourceId: riskId,
        notes: `Approved risk: ${risk.riskCode} - ${approvalNotes}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${INSTITUTIONAL_RISKS_COL}/${riskId}`);
    }
  }

  static async conductRiskReview(
    tenantId: string,
    riskId: string,
    params: {
      residualProbability: number;
      residualImpact: number;
      mitigationSummary?: string;
      nextReviewDate: string;
      reviewNotes: string;
    },
    user?: UserActor | User
  ): Promise<InstitutionalRiskItem> {
    try {
      const risk = await FirebaseService.getDocument<InstitutionalRiskItem>(INSTITUTIONAL_RISKS_COL, riskId);
      if (!risk || risk.tenantId !== tenantId) {
        throw new Error('Risk item not found.');
      }

      const now = new Date().toISOString();
      const residualScore = params.residualProbability * params.residualImpact;
      const residualSeverity = this.calculateSeverity(residualScore);

      const updated: InstitutionalRiskItem = {
        ...risk,
        status: 'ACTIVE_MONITORED',
        residualProbability: params.residualProbability,
        residualImpact: params.residualImpact,
        residualScore,
        residualSeverity,
        mitigationSummary: params.mitigationSummary || risk.mitigationSummary,
        lastReviewedAt: now,
        nextReviewDate: params.nextReviewDate,
        updatedAt: now
      };

      await FirebaseService.setDocument(INSTITUTIONAL_RISKS_COL, riskId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_REVIEWED' as any,
        resource: 'risk_item' as any,
        resourceId: riskId,
        notes: `Risk review conducted: ${risk.riskCode} (New residual score: ${residualScore})`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${INSTITUTIONAL_RISKS_COL}/${riskId}`);
    }
  }

  static async getRisks(tenantId: string, campusId?: string): Promise<InstitutionalRiskItem[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<InstitutionalRiskItem>(INSTITUTIONAL_RISKS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(r => !r.campusId || r.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching risks:', error);
      return [];
    }
  }

  // =========================================================================
  // 2. RISK MITIGATION ACTIONS & CONTROLS
  // =========================================================================

  static async createMitigationAction(
    tenantId: string,
    params: {
      campusId?: string;
      riskId: string;
      riskCode: string;
      title: string;
      controlType: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';
      description: string;
      actionOwnerId: string;
      actionOwnerName: string;
      allocatedBudget: number;
      targetCompletionDate: string;
    },
    user?: UserActor | User
  ): Promise<RiskMitigationAction> {
    try {
      const actionId = FirebaseService.generateId('mit');
      const now = new Date().toISOString();

      const action: RiskMitigationAction = {
        id: actionId,
        tenantId,
        campusId: params.campusId,
        riskId: params.riskId,
        riskCode: params.riskCode,
        title: params.title,
        controlType: params.controlType,
        description: params.description,
        actionOwnerId: params.actionOwnerId,
        actionOwnerName: params.actionOwnerName,
        status: 'OPEN',
        progressPercentage: 0,
        targetCompletionDate: params.targetCompletionDate,
        allocatedBudget: params.allocatedBudget,
        spentBudget: 0,
        createdBy: this.getActorId(user),
        createdByName: this.getActorName(user),
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(RISK_MITIGATIONS_COL, actionId, action);

      // Link to parent risk
      const parentRisk = await FirebaseService.getDocument<InstitutionalRiskItem>(INSTITUTIONAL_RISKS_COL, params.riskId);
      if (parentRisk) {
        const updatedMitIds = [...(parentRisk.mitigationIds || []), actionId];
        await FirebaseService.setDocument(INSTITUTIONAL_RISKS_COL, params.riskId, {
          ...parentRisk,
          mitigationIds: updatedMitIds,
          updatedAt: now
        });
      }

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_MITIGATION_ADDED' as any,
        resource: 'risk_mitigation' as any,
        resourceId: actionId,
        notes: `Mitigation control created for risk ${params.riskCode}: ${params.title}`
      });

      return action;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, RISK_MITIGATIONS_COL);
    }
  }

  static async verifyMitigationCompletion(
    tenantId: string,
    actionId: string,
    verificationNotes: string,
    user?: UserActor | User
  ): Promise<RiskMitigationAction> {
    try {
      const action = await FirebaseService.getDocument<RiskMitigationAction>(RISK_MITIGATIONS_COL, actionId);
      if (!action || action.tenantId !== tenantId) {
        throw new Error('Mitigation action not found.');
      }

      const currentUserId = this.getActorId(user);
      // Separation of Duties
      if (action.actionOwnerId === currentUserId) {
        throw new Error('Separation of Duties violation: The assignee of a mitigation control cannot verify its completion.');
      }

      const now = new Date().toISOString();
      const updated: RiskMitigationAction = {
        ...action,
        status: 'VERIFIED_EFFECTIVE',
        actualCompletionDate: now,
        verifiedBy: currentUserId,
        verifiedByName: this.getActorName(user),
        verifiedAt: now,
        verificationNotes,
        updatedAt: now
      };

      await FirebaseService.setDocument(RISK_MITIGATIONS_COL, actionId, updated);

      await AuditService.log({
        tenantId,
        userId: currentUserId,
        actorId: currentUserId,
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_RISK_MITIGATION_VERIFIED' as any,
        resource: 'risk_mitigation' as any,
        resourceId: actionId,
        notes: `Verified mitigation completion: ${action.title}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${RISK_MITIGATIONS_COL}/${actionId}`);
    }
  }

  static async getMitigations(tenantId: string, riskId?: string): Promise<RiskMitigationAction[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<RiskMitigationAction>(RISK_MITIGATIONS_COL, tenantId)) || [];
      if (riskId) {
        return list.filter(m => m.riskId === riskId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching mitigations:', error);
      return [];
    }
  }

  // =========================================================================
  // 3. KEY RISK INDICATORS (KRIs)
  // =========================================================================

  static async createKeyRiskIndicator(
    tenantId: string,
    params: {
      campusId?: string;
      code: string;
      name: string;
      metricUnit: string;
      targetDirection: 'LOWER_IS_BETTER' | 'HIGHER_IS_BETTER';
      normalThreshold: number;
      watchThreshold: number;
      breachThreshold: number;
      currentValue: number;
      responsibleDepartment: string;
      associatedRiskIds: string[];
    },
    user?: UserActor | User
  ): Promise<KeyRiskIndicator> {
    try {
      const kriId = FirebaseService.generateId('kri');
      const now = new Date().toISOString();

      let status: KriStatus = 'NORMAL';
      if (params.targetDirection === 'LOWER_IS_BETTER') {
        if (params.currentValue >= params.breachThreshold) status = 'BREACH';
        else if (params.currentValue >= params.watchThreshold) status = 'WATCH';
      } else {
        if (params.currentValue <= params.breachThreshold) status = 'BREACH';
        else if (params.currentValue <= params.watchThreshold) status = 'WATCH';
      }

      const kri: KeyRiskIndicator = {
        id: kriId,
        tenantId,
        campusId: params.campusId,
        code: params.code,
        name: params.name,
        metricUnit: params.metricUnit,
        targetDirection: params.targetDirection,
        normalThreshold: params.normalThreshold,
        watchThreshold: params.watchThreshold,
        breachThreshold: params.breachThreshold,
        currentValue: params.currentValue,
        status,
        responsibleDepartment: params.responsibleDepartment,
        associatedRiskIds: params.associatedRiskIds,
        lastEvaluatedAt: now,
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(KEY_RISK_INDICATORS_COL, kriId, kri);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_KRI_CREATED' as any,
        resource: 'key_risk_indicator',
        resourceId: kriId,
        notes: `Created KRI: ${params.code} - ${params.name}`
      });

      return kri;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, KEY_RISK_INDICATORS_COL);
    }
  }

  static async recordKriEvaluation(
    tenantId: string,
    kriId: string,
    newValue: number,
    user?: UserActor | User
  ): Promise<KeyRiskIndicator> {
    try {
      const kri = await FirebaseService.getDocument<KeyRiskIndicator>(KEY_RISK_INDICATORS_COL, kriId);
      if (!kri || kri.tenantId !== tenantId) {
        throw new Error('KRI not found.');
      }

      const now = new Date().toISOString();
      let status: KriStatus = 'NORMAL';
      if (kri.targetDirection === 'LOWER_IS_BETTER') {
        if (newValue >= kri.breachThreshold) status = 'BREACH';
        else if (newValue >= kri.watchThreshold) status = 'WATCH';
      } else {
        if (newValue <= kri.breachThreshold) status = 'BREACH';
        else if (newValue <= kri.watchThreshold) status = 'WATCH';
      }

      const updated: KeyRiskIndicator = {
        ...kri,
        currentValue: newValue,
        status,
        lastEvaluatedAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(KEY_RISK_INDICATORS_COL, kriId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INSTITUTIONAL_KRI_EVALUATED' as any,
        resource: 'key_risk_indicator',
        resourceId: kriId,
        notes: `KRI evaluated: ${kri.code} -> Value: ${newValue} (Status: ${status})`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${KEY_RISK_INDICATORS_COL}/${kriId}`);
    }
  }

  static async getKeyRiskIndicators(tenantId: string, campusId?: string): Promise<KeyRiskIndicator[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<KeyRiskIndicator>(KEY_RISK_INDICATORS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(k => !k.campusId || k.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching KRIs:', error);
      return [];
    }
  }

  // =========================================================================
  // 4. CAMPUS INCIDENT COMMAND SYSTEM (ICS)
  // =========================================================================

  static async reportCampusIncident(
    tenantId: string,
    campusId: string,
    params: {
      title: string;
      type: CampusIncidentItem['type'];
      severity: IncidentSeverity;
      location: string;
      occurredAt: string;
      immediateActionsTaken: string;
      emergencyServicesNotified?: boolean;
      emergencyBroadcastTriggered?: boolean;
    },
    user?: UserActor | User
  ): Promise<CampusIncidentItem> {
    try {
      const incidentId = FirebaseService.generateId('inc');
      const now = new Date().toISOString();
      const incidentNumber = `INC-${Date.now().toString().slice(-6)}`;

      const initialTimeline = [
        {
          id: FirebaseService.generateId('evt'),
          timestamp: now,
          action: 'INCIDENT_REPORTED',
          actorName: this.getActorName(user),
          notes: `Initial triage report: ${params.title} at ${params.location}`
        }
      ];

      const item: CampusIncidentItem = {
        id: incidentId,
        tenantId,
        campusId,
        incidentNumber,
        title: params.title,
        type: params.type,
        severity: params.severity,
        status: 'TRIAGED',
        location: params.location,
        occurredAt: params.occurredAt,
        reportedBy: this.getActorId(user),
        reporterName: this.getActorName(user),
        reportedByName: this.getActorName(user),
        reporterRole: 'STAFF',
        reportedAt: now,
        immediateActionsTaken: params.immediateActionsTaken,
        emergencyServicesNotified: params.emergencyServicesNotified || false,
        emergencyBroadcastTriggered: params.emergencyBroadcastTriggered || false,
        casualtiesReported: 0,
        hospitalizationsReported: 0,
        propertyDamageEstimated: 0,
        timeline: initialTimeline,
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(CAMPUS_INCIDENTS_COL, incidentId, item);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'CAMPUS_INCIDENT_REPORTED',
        resource: 'campus_incident',
        resourceId: incidentId,
        notes: `Reported campus incident: ${incidentNumber} (${params.severity}) - ${params.title}`
      });

      return item;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, CAMPUS_INCIDENTS_COL);
    }
  }

  static async activateIncidentCommand(
    tenantId: string,
    incidentId: string,
    roles: {
      commanderId: string;
      commanderName: string;
      safetyOfficerName?: string;
      publicInfoOfficerName?: string;
    },
    user?: UserActor | User
  ): Promise<CampusIncidentItem> {
    try {
      const incident = await FirebaseService.getDocument<CampusIncidentItem>(CAMPUS_INCIDENTS_COL, incidentId);
      if (!incident || incident.tenantId !== tenantId) {
        throw new Error('Incident not found.');
      }

      const now = new Date().toISOString();
      const newTimeline = [
        ...(incident.timeline || []),
        {
          id: FirebaseService.generateId('evt'),
          timestamp: now,
          action: 'COMMAND_ACTIVATED',
          actorName: this.getActorName(user),
          notes: `ICS command structure activated. Incident Commander: ${roles.commanderName}`
        }
      ];

      const updated: CampusIncidentItem = {
        ...incident,
        status: 'COMMAND_ACTIVATED',
        incidentCommanderId: roles.commanderId,
        incidentCommanderName: roles.commanderName,
        safetyOfficerName: roles.safetyOfficerName,
        publicInfoOfficerName: roles.publicInfoOfficerName,
        timeline: newTimeline,
        updatedAt: now
      };

      await FirebaseService.setDocument(CAMPUS_INCIDENTS_COL, incidentId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'INCIDENT_COMMAND_ACTIVATED' as any,
        resource: 'campus_incident',
        resourceId: incidentId,
        notes: `ICS Activated for ${incident.incidentNumber}. Commander: ${roles.commanderName}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${CAMPUS_INCIDENTS_COL}/${incidentId}`);
    }
  }

  static async logIncidentAction(
    tenantId: string,
    incidentId: string,
    actionTitle: string,
    notes: string,
    user?: UserActor | User
  ): Promise<CampusIncidentItem> {
    try {
      const incident = await FirebaseService.getDocument<CampusIncidentItem>(CAMPUS_INCIDENTS_COL, incidentId);
      if (!incident || incident.tenantId !== tenantId) {
        throw new Error('Incident not found.');
      }

      const now = new Date().toISOString();
      const newTimeline = [
        ...(incident.timeline || []),
        {
          id: FirebaseService.generateId('evt'),
          timestamp: now,
          action: actionTitle,
          actorName: this.getActorName(user),
          notes
        }
      ];

      const updated: CampusIncidentItem = {
        ...incident,
        timeline: newTimeline,
        updatedAt: now
      };

      await FirebaseService.setDocument(CAMPUS_INCIDENTS_COL, incidentId, updated);
      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${CAMPUS_INCIDENTS_COL}/${incidentId}`);
    }
  }

  static async resolveIncident(
    tenantId: string,
    incidentId: string,
    resolutionSummary: string,
    user?: UserActor | User
  ): Promise<CampusIncidentItem> {
    try {
      const incident = await FirebaseService.getDocument<CampusIncidentItem>(CAMPUS_INCIDENTS_COL, incidentId);
      if (!incident || incident.tenantId !== tenantId) {
        throw new Error('Incident not found.');
      }

      const now = new Date().toISOString();
      const newTimeline = [
        ...(incident.timeline || []),
        {
          id: FirebaseService.generateId('evt'),
          timestamp: now,
          action: 'INCIDENT_RESOLVED',
          actorName: this.getActorName(user),
          notes: resolutionSummary
        }
      ];

      const updated: CampusIncidentItem = {
        ...incident,
        status: 'RESOLVED',
        resolvedAt: now,
        timeline: newTimeline,
        updatedAt: now
      };

      await FirebaseService.setDocument(CAMPUS_INCIDENTS_COL, incidentId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'CAMPUS_INCIDENT_RESOLVED',
        resource: 'campus_incident',
        resourceId: incidentId,
        notes: `Resolved campus incident ${incident.incidentNumber}: ${resolutionSummary}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${CAMPUS_INCIDENTS_COL}/${incidentId}`);
    }
  }

  static async getCampusIncidents(tenantId: string, campusId?: string): Promise<CampusIncidentItem[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<CampusIncidentItem>(CAMPUS_INCIDENTS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(i => !i.campusId || i.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching incidents:', error);
      return [];
    }
  }

  // =========================================================================
  // 5. BUSINESS CONTINUITY PLANS (BCP) & DRILLS
  // =========================================================================

  static async createBcpPlan(
    tenantId: string,
    params: {
      campusId?: string;
      code: string;
      name: string;
      criticalFunction: string;
      department: string;
      rtoHours: number;
      rpoHours: number;
      alternateOperatingFacility: string;
      remoteWorkCapability: boolean;
      backupSystemDescription: string;
      emergencyTeamLeadId: string;
      emergencyTeamLeadName: string;
      secondaryLeadId: string;
      secondaryLeadName: string;
      activationTrigger: string;
      stepByStepProcedures: BcpStep[];
    },
    user?: UserActor | User
  ): Promise<BusinessContinuityPlan> {
    try {
      const bcpId = FirebaseService.generateId('bcp');
      const now = new Date().toISOString();

      const plan: BusinessContinuityPlan = {
        id: bcpId,
        tenantId,
        campusId: params.campusId,
        code: params.code,
        name: params.name,
        criticalFunction: params.criticalFunction,
        department: params.department,
        status: 'DRAFT',
        version: 1,
        rtoHours: params.rtoHours,
        rpoHours: params.rpoHours,
        alternateOperatingFacility: params.alternateOperatingFacility,
        remoteWorkCapability: params.remoteWorkCapability,
        backupSystemDescription: params.backupSystemDescription,
        emergencyTeamLeadId: params.emergencyTeamLeadId,
        emergencyTeamLeadName: params.emergencyTeamLeadName,
        secondaryLeadId: params.secondaryLeadId,
        secondaryLeadName: params.secondaryLeadName,
        activationTrigger: params.activationTrigger,
        stepByStepProcedures: params.stepByStepProcedures,
        lastTestedAt: undefined,
        nextTestDueAt: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        createdBy: this.getActorId(user),
        createdByName: this.getActorName(user),
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(BUSINESS_CONTINUITY_PLANS_COL, bcpId, plan);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'BCP_PLAN_CREATED' as any,
        resource: 'business_continuity_plan' as any,
        resourceId: bcpId,
        notes: `Created BCP: ${params.code} - ${params.name}`
      });

      return plan;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, BUSINESS_CONTINUITY_PLANS_COL);
    }
  }

  static async approveBcpPlan(
    tenantId: string,
    bcpId: string,
    user?: UserActor | User
  ): Promise<BusinessContinuityPlan> {
    try {
      const bcp = await FirebaseService.getDocument<BusinessContinuityPlan>(BUSINESS_CONTINUITY_PLANS_COL, bcpId);
      if (!bcp || bcp.tenantId !== tenantId) {
        throw new Error('BCP not found.');
      }

      const currentUserId = this.getActorId(user);
      // Separation of Duties
      if (bcp.createdBy === currentUserId) {
        throw new Error('Separation of Duties violation: The author of a BCP cannot approve it.');
      }

      const now = new Date().toISOString();
      const updated: BusinessContinuityPlan = {
        ...bcp,
        status: 'ACTIVE_APPROVED',
        approvedBy: currentUserId,
        approvedByName: this.getActorName(user),
        approvedAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(BUSINESS_CONTINUITY_PLANS_COL, bcpId, updated);

      await AuditService.log({
        tenantId,
        userId: currentUserId,
        actorId: currentUserId,
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'BCP_PLAN_APPROVED' as any,
        resource: 'business_continuity_plan' as any,
        resourceId: bcpId,
        notes: `Approved BCP: ${bcp.code}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${BUSINESS_CONTINUITY_PLANS_COL}/${bcpId}`);
    }
  }

  static async getBcpPlans(tenantId: string, campusId?: string): Promise<BusinessContinuityPlan[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<BusinessContinuityPlan>(BUSINESS_CONTINUITY_PLANS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(b => !b.campusId || b.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching BCPs:', error);
      return [];
    }
  }

  // =========================================================================
  // 6. SAFETY AUDITS & CAPA
  // =========================================================================

  static async scheduleSafetyInspection(
    tenantId: string,
    campusId: string,
    params: {
      inspectionNumber: string;
      inspectionType: SafetyAuditInspection['inspectionType'];
      facilityLocation: string;
      inspectorId: string;
      inspectorName: string;
      inspectionDate: string;
    },
    user?: UserActor | User
  ): Promise<SafetyAuditInspection> {
    try {
      const inspId = FirebaseService.generateId('insp');
      const now = new Date().toISOString();

      const item: SafetyAuditInspection = {
        id: inspId,
        tenantId,
        campusId,
        inspectionNumber: params.inspectionNumber,
        inspectionType: params.inspectionType,
        facilityLocation: params.facilityLocation,
        inspectorId: params.inspectorId,
        inspectorName: params.inspectorName,
        status: 'SCHEDULED',
        inspectionDate: params.inspectionDate,
        scheduledDate: params.inspectionDate,
        findings: [],
        overallScore: 0,
        complianceStatus: 'PENDING_REVIEW',
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(SAFETY_INSPECTIONS_COL, inspId, item);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'SAFETY_INSPECTION_SCHEDULED' as any,
        resource: 'safety_inspection',
        resourceId: inspId,
        notes: `Scheduled safety audit ${params.inspectionNumber} at ${params.facilityLocation}`
      });

      return item;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, SAFETY_INSPECTIONS_COL);
    }
  }

  static async completeSafetyInspection(
    tenantId: string,
    inspId: string,
    results: {
      overallScore: number;
      complianceStatus: 'COMPLIANT' | 'NEEDS_IMPROVEMENT' | 'NON_COMPLIANT';
      findings: InspectionFinding[];
    },
    user?: UserActor | User
  ): Promise<SafetyAuditInspection> {
    try {
      const insp = await FirebaseService.getDocument<SafetyAuditInspection>(SAFETY_INSPECTIONS_COL, inspId);
      if (!insp || insp.tenantId !== tenantId) {
        throw new Error('Inspection not found.');
      }

      const now = new Date().toISOString();
      const updated: SafetyAuditInspection = {
        ...insp,
        status: 'COMPLETED',
        completedDate: now,
        overallScore: results.overallScore,
        complianceStatus: results.complianceStatus,
        findings: results.findings,
        updatedAt: now
      };

      await FirebaseService.setDocument(SAFETY_INSPECTIONS_COL, inspId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'SAFETY_INSPECTION_COMPLETED' as any,
        resource: 'safety_inspection',
        resourceId: inspId,
        notes: `Completed inspection ${insp.inspectionNumber}. Score: ${results.overallScore}%`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${SAFETY_INSPECTIONS_COL}/${inspId}`);
    }
  }

  static async getSafetyInspections(tenantId: string, campusId?: string): Promise<SafetyAuditInspection[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<SafetyAuditInspection>(SAFETY_INSPECTIONS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(s => !s.campusId || s.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching inspections:', error);
      return [];
    }
  }

  // =========================================================================
  // 7. SIMULATION DRILLS
  // =========================================================================

  static async scheduleSimulationDrill(
    tenantId: string,
    campusId: string,
    params: {
      drillCode: string;
      drillType: ContinuitySimulationDrill['drillType'];
      title: string;
      scheduledDate: string;
      targetedParticipantsCount: number;
    },
    user?: UserActor | User
  ): Promise<ContinuitySimulationDrill> {
    try {
      const drillId = FirebaseService.generateId('drl');
      const now = new Date().toISOString();

      const drill: ContinuitySimulationDrill = {
        id: drillId,
        tenantId,
        campusId,
        drillCode: params.drillCode,
        drillType: params.drillType,
        title: params.title,
        scheduledDate: params.scheduledDate,
        status: 'SCHEDULED',
        targetedParticipantsCount: params.targetedParticipantsCount,
        actualParticipantsCount: 0,
        createdAt: now,
        updatedAt: now
      };

      await FirebaseService.setDocument(CONTINUITY_DRILLS_COL, drillId, drill);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'CONTINUITY_DRILL_SCHEDULED' as any,
        resource: 'simulation_drill' as any,
        resourceId: drillId,
        notes: `Scheduled simulation drill: ${params.drillCode} (${params.drillType})`
      });

      return drill;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, CONTINUITY_DRILLS_COL);
    }
  }

  static async evaluateSimulationDrill(
    tenantId: string,
    drillId: string,
    evalRecord: {
      actualParticipantsCount: number;
      evacuationTimeSeconds: number;
      targetEvacuationTimeSeconds: number;
      overallReadinessRating: 'SATISFACTORY' | 'ACCEPTABLE_WITH_GAPS' | 'UNSATISFACTORY';
      identifiedGaps: string[];
      correctiveActions: string[];
    },
    user?: UserActor | User
  ): Promise<ContinuitySimulationDrill> {
    try {
      const drill = await FirebaseService.getDocument<ContinuitySimulationDrill>(CONTINUITY_DRILLS_COL, drillId);
      if (!drill || drill.tenantId !== tenantId) {
        throw new Error('Drill not found.');
      }

      const now = new Date().toISOString();
      const updated: ContinuitySimulationDrill = {
        ...drill,
        status: 'COMPLETED',
        executedDate: now,
        actualParticipantsCount: evalRecord.actualParticipantsCount,
        evacuationTimeSeconds: evalRecord.evacuationTimeSeconds,
        targetEvacuationTimeSeconds: evalRecord.targetEvacuationTimeSeconds,
        overallReadinessRating: evalRecord.overallReadinessRating,
        identifiedGaps: evalRecord.identifiedGaps,
        correctiveActions: evalRecord.correctiveActions,
        evaluatedBy: this.getActorId(user),
        evaluatedByName: this.getActorName(user),
        updatedAt: now
      };

      await FirebaseService.setDocument(CONTINUITY_DRILLS_COL, drillId, updated);

      await AuditService.log({
        tenantId,
        userId: this.getActorId(user),
        actorId: this.getActorId(user),
        userDisplayName: this.getActorName(user),
        actorName: this.getActorName(user),
        userEmail: this.getActorEmail(user),
        action: 'CONTINUITY_DRILL_EVALUATED' as any,
        resource: 'simulation_drill' as any,
        resourceId: drillId,
        notes: `Evaluated drill ${drill.drillCode}. Rating: ${evalRecord.overallReadinessRating}`
      });

      return updated;
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `${CONTINUITY_DRILLS_COL}/${drillId}`);
    }
  }

  static async getSimulationDrills(tenantId: string, campusId?: string): Promise<ContinuitySimulationDrill[]> {
    try {
      const list = (await FirebaseService.getTenantCollection<ContinuitySimulationDrill>(CONTINUITY_DRILLS_COL, tenantId)) || [];
      if (campusId) {
        return list.filter(d => !d.campusId || d.campusId === campusId);
      }
      return list;
    } catch (error: any) {
      console.warn('Error fetching simulation drills:', error);
      return [];
    }
  }

  // =========================================================================
  // 8. QUANTITATIVE RISK ANALYTICS & DYNAMIC HEATMAP PROJECTION
  // =========================================================================

  static async getInstitutionalRiskAnalytics(tenantId: string, campusId?: string): Promise<InstitutionalRiskAnalytics> {
    try {
      const [risks, kris, incidents, bcps, inspections, drills] = await Promise.all([
        this.getRisks(tenantId, campusId),
        this.getKeyRiskIndicators(tenantId, campusId),
        this.getCampusIncidents(tenantId, campusId),
        this.getBcpPlans(tenantId, campusId),
        this.getSafetyInspections(tenantId, campusId),
        this.getSimulationDrills(tenantId, campusId)
      ]);

      const totalRisks = risks.length;
      const criticalRisks = risks.filter(r => r.residualSeverity === 'CRITICAL').length;
      const highRisks = risks.filter(r => r.residualSeverity === 'HIGH').length;
      const mediumRisks = risks.filter(r => r.residualSeverity === 'MEDIUM').length;
      const lowRisks = risks.filter(r => r.residualSeverity === 'LOW').length;
      const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
      const level4Incidents = incidents.filter(i => i.severity === 'LEVEL_4_CRITICAL_DISASTER').length;
      const kriBreaches = kris.filter(k => k.status === 'BREACH').length;
      const kriWatch = kris.filter(k => k.status === 'WATCH').length;
      const activeBcps = bcps.filter(b => b.status === 'ACTIVE' || b.status === 'APPROVED' || b.status === 'ACTIVE_APPROVED').length;

      // Category distribution
      const categoryDistribution: Record<string, number> = {};
      risks.forEach(r => {
        categoryDistribution[r.category] = (categoryDistribution[r.category] || 0) + 1;
      });

      // 5x5 Heatmap Matrix Population
      const inherentMap: Record<string, number> = {};
      const residualMap: Record<string, number> = {};

      for (let p = 1; p <= 5; p++) {
        for (let i = 1; i <= 5; i++) {
          inherentMap[`${i}-${p}`] = 0;
          residualMap[`${i}-${p}`] = 0;
        }
      }

      risks.forEach(r => {
        const inKey = `${r.inherentImpact}-${r.inherentProbability}`;
        const resKey = `${r.residualImpact}-${r.residualProbability}`;
        inherentMap[inKey] = (inherentMap[inKey] || 0) + 1;
        residualMap[resKey] = (residualMap[resKey] || 0) + 1;
      });

      // BCP Readiness Index
      const approvedBcps = bcps.filter(b => b.status === 'ACTIVE_APPROVED' || b.status === 'ACTIVE' || b.status === 'APPROVED').length;
      const bcpReadinessIndex = bcps.length > 0 ? Math.round((approvedBcps / bcps.length) * 100) : 100;

      // Open CAPAs across inspections
      let openCapaCount = 0;
      inspections.forEach(insp => {
        (insp.findings || []).forEach(f => {
          if (f.capaRequired && f.capaStatus !== 'CLOSED') {
            openCapaCount++;
          }
        });
      });

      // Average Evacuation Time
      const completedDrills = drills.filter(d => (d.status === 'COMPLETED' || d.status === 'CONDUCTED' || d.status === 'EVALUATED') && d.evacuationTimeSeconds);
      const totalEvacSeconds = completedDrills.reduce((sum, d) => sum + (d.evacuationTimeSeconds || 0), 0);
      const averageEvacuationTimeSeconds = completedDrills.length > 0
        ? Math.round(totalEvacSeconds / completedDrills.length)
        : 0;

      return {
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        activeIncidents,
        level4Incidents,
        kriBreaches,
        kriWatch,
        activeBcps,
        bcpReadinessIndex,
        openCapaCount,
        averageEvacuationTimeSeconds,
        categoryDistribution,
        riskHeatmapMatrix: {
          inherent: inherentMap,
          residual: residualMap
        }
      };
    } catch (error: any) {
      handleFirestoreError(error, OperationType.GET, 'institutional_risk_analytics');
    }
  }
}
