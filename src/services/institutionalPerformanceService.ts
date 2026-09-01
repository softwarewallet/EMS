import { 
  FirebaseService, 
  handleFirestoreError 
} from './firebaseService';
import { where } from 'firebase/firestore';
import { 
  StrategicPlan, 
  StrategicObjective, 
  StrategicInitiative, 
  InstitutionalGoal,
  KPIDefinition, 
  KPITarget, 
  KPIMeasurement, 
  PerformanceRisk, 
  CorrectiveAction,
  CorrectiveActionStatus,
  InstitutionalPerformanceAnalyticsCache
} from '../types/institutionalPerformance';
import { AuditService } from './auditService';
import { User } from '../types/index';

const STRATEGIC_PLANS_COL = 'strategic_plans';
const STRATEGIC_OBJECTIVES_COL = 'strategic_objectives';
const STRATEGIC_GOALS_COL = 'strategic_goals';
const STRATEGIC_INITIATIVES_COL = 'strategic_initiatives';
const KPI_DEFINITIONS_COL = 'kpi_definitions';
const KPI_TARGETS_COL = 'kpi_targets';
const KPI_MEASUREMENTS_COL = 'kpi_measurements';
const PERFORMANCE_RISKS_COL = 'performance_risks';
const CORRECTIVE_ACTIONS_COL = 'performance_corrective_actions';
const ANALYTICS_CACHE_COL = 'performance_analytics_cache';

export class InstitutionalPerformanceService {
  // =========================================================================
  // 1. STRATEGIC PLANNING
  // =========================================================================

  static async createStrategicPlan(
    tenantId: string,
    params: Omit<StrategicPlan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'status' | 'version' | 'createdBy'>,
    actor: User
  ): Promise<StrategicPlan> {
    if (!tenantId || typeof tenantId !== 'string') {
      throw new Error('Valid tenantId is required');
    }
    if (!params.title || params.title.trim().length < 3) {
      throw new Error('Strategic plan title must be at least 3 characters');
    }
    if (!params.periodStart || !params.periodEnd) {
      throw new Error('Period start and end dates are required');
    }
    if (new Date(params.periodStart) > new Date(params.periodEnd)) {
      throw new Error('Period start date must precede period end date');
    }

    const id = FirebaseService.generateId('plan');
    const now = new Date().toISOString();
    const plan: StrategicPlan = {
      ...params,
      id,
      tenantId,
      status: 'DRAFT',
      version: 1,
      createdBy: actor.id,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STRATEGIC_PLANS_COL, id, plan);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STRATEGY_PLAN_CREATED',
      resource: 'strategy_plan',
      resourceId: id,
      resourceName: plan.title,
      result: 'SUCCESS',
      newValue: plan
    });

    return plan;
  }

  static async approveStrategicPlan(
    planId: string,
    actor: User
  ): Promise<void> {
    const plan = await FirebaseService.getDocument<StrategicPlan>(STRATEGIC_PLANS_COL, planId);
    if (!plan) throw new Error('Strategic plan not found');
    
    // Cross-tenant protection
    if (actor.defaultTenantId && actor.defaultTenantId !== plan.tenantId && !actor.isPlatformSuperAdmin) {
      throw new Error('Unauthorized: Cannot approve strategic plan belonging to another tenant');
    }

    if (plan.status !== 'DRAFT' && plan.status !== 'UNDER_REVIEW') {
      throw new Error(`Invalid plan status for approval: ${plan.status}. Must be DRAFT or UNDER_REVIEW.`);
    }

    // Segregation of Duties: Creator cannot self-approve unless platform super admin
    if (plan.createdBy === actor.id && !actor.isPlatformSuperAdmin) {
      throw new Error('Segregation of Duties: Proposer/creator cannot self-approve strategic plan');
    }

    const now = new Date().toISOString();
    const updates: Partial<StrategicPlan> = {
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedAt: now,
      updatedAt: now
    };

    await FirebaseService.updateDocument(STRATEGIC_PLANS_COL, planId, updates);

    await AuditService.log({
      tenantId: plan.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STRATEGY_PLAN_APPROVED',
      resource: 'strategy_plan',
      resourceId: planId,
      resourceName: plan.title,
      result: 'SUCCESS',
      newValue: updates
    });
  }

  static async activateStrategicPlan(
    planId: string,
    actor: User
  ): Promise<void> {
    const plan = await FirebaseService.getDocument<StrategicPlan>(STRATEGIC_PLANS_COL, planId);
    if (!plan) throw new Error('Strategic plan not found');

    if (actor.defaultTenantId && actor.defaultTenantId !== plan.tenantId && !actor.isPlatformSuperAdmin) {
      throw new Error('Unauthorized: Cannot activate strategic plan belonging to another tenant');
    }

    if (plan.status !== 'APPROVED') {
      throw new Error('Plan must be approved before activation');
    }

    const now = new Date().toISOString();
    
    // Deactivate currently active plans for this tenant
    const activePlans = await FirebaseService.getTenantCollection<StrategicPlan>(STRATEGIC_PLANS_COL, plan.tenantId, [
      where('status', '==', 'ACTIVE')
    ]);

    for (const p of activePlans) {
      if (p.id !== planId) {
        await FirebaseService.updateDocument(STRATEGIC_PLANS_COL, p.id, {
          status: 'SUPERSEDED',
          updatedAt: now
        });
      }
    }

    const updates: Partial<StrategicPlan> = {
      status: 'ACTIVE',
      activatedBy: actor.id,
      activatedAt: now,
      updatedAt: now
    };

    await FirebaseService.updateDocument(STRATEGIC_PLANS_COL, planId, updates);

    await AuditService.log({
      tenantId: plan.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STRATEGY_PLAN_ACTIVATED',
      resource: 'strategy_plan',
      resourceId: planId,
      resourceName: plan.title,
      result: 'SUCCESS',
      newValue: updates
    });
  }

  static async createObjective(
    tenantId: string,
    planId: string,
    params: Omit<StrategicObjective, 'id' | 'tenantId' | 'planId' | 'createdAt' | 'updatedAt' | 'status'>,
    actor: User
  ): Promise<StrategicObjective> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    if (!planId) throw new Error('Valid planId is required');

    // IDOR / Cross-tenant validation
    const plan = await FirebaseService.getDocument<StrategicPlan>(STRATEGIC_PLANS_COL, planId);
    if (!plan) throw new Error('Referenced strategic plan does not exist');
    if (plan.tenantId !== tenantId) {
      throw new Error('Cross-tenant violation: Referenced strategic plan does not belong to this tenant');
    }

    if (!params.code || !params.title) {
      throw new Error('Objective code and title are required');
    }

    const weight = Number(params.weight);
    if (isNaN(weight) || !isFinite(weight) || weight <= 0 || weight > 100) {
      throw new Error('Objective weight must be a valid number between 1 and 100');
    }

    const id = FirebaseService.generateId('obj');
    const now = new Date().toISOString();
    const objective: StrategicObjective = {
      ...params,
      weight,
      id,
      tenantId,
      planId,
      status: 'PLANNED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STRATEGIC_OBJECTIVES_COL, id, objective);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STRATEGY_OBJECTIVE_CREATED',
      resource: 'strategy_objective',
      resourceId: id,
      resourceName: objective.title,
      result: 'SUCCESS',
      newValue: objective
    });

    return objective;
  }

  // =========================================================================
  // 2. KPI GOVERNANCE
  // =========================================================================

  static async defineKPI(
    tenantId: string,
    params: Omit<KPIDefinition, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'status' | 'version'>,
    actor: User
  ): Promise<KPIDefinition> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    if (!params.code || params.code.trim().length < 2) {
      throw new Error('KPI code is required');
    }
    if (!params.name || params.name.trim().length < 3) {
      throw new Error('KPI name must be at least 3 characters');
    }
    if (!params.unit || !params.calculationMethod) {
      throw new Error('KPI unit and calculation method are required');
    }

    const weight = Number(params.weight);
    if (isNaN(weight) || !isFinite(weight) || weight <= 0 || weight > 100) {
      throw new Error('KPI weight must be a valid number between 1 and 100');
    }

    const id = FirebaseService.generateId('kpi');
    const now = new Date().toISOString();
    const kpi: KPIDefinition = {
      ...params,
      weight,
      id,
      tenantId,
      status: 'ACTIVE',
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(KPI_DEFINITIONS_COL, id, kpi);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'KPI_DEFINITION_CREATED',
      resource: 'kpi_definition',
      resourceId: id,
      resourceName: kpi.name,
      result: 'SUCCESS',
      newValue: kpi
    });

    return kpi;
  }

  static async createKPITarget(
    tenantId: string,
    params: Omit<KPITarget, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
    actor: User
  ): Promise<KPITarget> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    if (!params.kpiId) throw new Error('Valid kpiId is required');

    const kpi = await FirebaseService.getDocument<KPIDefinition>(KPI_DEFINITIONS_COL, params.kpiId);
    if (!kpi) throw new Error('Referenced KPI definition does not exist');
    if (kpi.tenantId !== tenantId) {
      throw new Error('Cross-tenant violation: Referenced KPI does not belong to this tenant');
    }

    const targetVal = Number(params.targetValue);
    if (isNaN(targetVal) || !isFinite(targetVal)) {
      throw new Error('Target value must be a valid finite number');
    }

    if (kpi.targetType === 'PERCENTAGE' && (targetVal < 0 || targetVal > 100)) {
      throw new Error('Percentage targets must be between 0 and 100');
    }

    const id = FirebaseService.generateId('trgt');
    const now = new Date().toISOString();
    const target: KPITarget = {
      ...params,
      targetValue: targetVal,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(KPI_TARGETS_COL, id, target);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'KPI_DEFINITION_CREATED',
      resource: 'kpi_definition',
      resourceId: id,
      resourceName: `${kpi.code} - ${params.periodLabel}`,
      result: 'SUCCESS',
      newValue: target
    });

    return target;
  }

  static async submitMeasurement(
    tenantId: string,
    params: Omit<KPIMeasurement, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'status' | 'submittedBy' | 'submittedAt' | 'achievementPercentage' | 'weightedScore'>,
    actor: User
  ): Promise<KPIMeasurement> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    
    const kpi = await FirebaseService.getDocument<KPIDefinition>(KPI_DEFINITIONS_COL, params.kpiId);
    const target = await FirebaseService.getDocument<KPITarget>(KPI_TARGETS_COL, params.targetId);
    
    if (!kpi) throw new Error('KPI definition not found');
    if (!target) throw new Error('KPI target not found');

    // Tenant boundary checks
    if (kpi.tenantId !== tenantId || target.tenantId !== tenantId) {
      throw new Error('Cross-tenant violation: KPI or Target does not belong to this tenant');
    }

    // Target linkage integrity check
    if (target.kpiId !== kpi.id) {
      throw new Error('Target linkage violation: Referenced target belongs to a different KPI definition');
    }

    // Sanitization & bounds checks
    const actualVal = Number(params.actualValue);
    if (isNaN(actualVal) || !isFinite(actualVal)) {
      throw new Error('Actual value must be a valid, finite numeric measurement (NaN and Infinity rejected)');
    }

    if (kpi.targetType === 'PERCENTAGE' && actualVal < 0) {
      throw new Error('Percentage measurement cannot be negative');
    }

    if (!params.measurementDate || isNaN(new Date(params.measurementDate).getTime())) {
      throw new Error('Measurement date must be a valid ISO date');
    }

    // Calculate achievement percentage with divide-by-zero protection
    let achievementPercentage = 0;
    if (kpi.directionality === 'HIGHER_IS_BETTER') {
      if (target.targetValue === 0) {
        achievementPercentage = actualVal > 0 ? 100 : 0;
      } else {
        achievementPercentage = (actualVal / target.targetValue) * 100;
      }
    } else if (kpi.directionality === 'LOWER_IS_BETTER') {
      if (actualVal === 0) {
        achievementPercentage = target.targetValue === 0 ? 100 : 100;
      } else {
        achievementPercentage = (target.targetValue / actualVal) * 100;
      }
    } else {
      // TARGET_BAND
      const diff = Math.abs(actualVal - target.targetValue);
      achievementPercentage = Math.max(0, 100 - (diff / (target.targetValue || 1)) * 100);
    }

    // Clamp achievement percentage if necessary or round to 2 decimal places
    achievementPercentage = Math.round(achievementPercentage * 100) / 100;
    const weightedScore = Math.round(((achievementPercentage / 100) * (kpi.weight || 1)) * 100) / 100;

    const id = FirebaseService.generateId('msrm');
    const now = new Date().toISOString();

    const measurement: KPIMeasurement = {
      ...params,
      actualValue: actualVal,
      id,
      tenantId,
      status: 'SUBMITTED', // Client cannot supply VERIFIED or APPROVED
      submittedBy: actor.id,
      submittedAt: now,
      achievementPercentage,
      weightedScore,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(KPI_MEASUREMENTS_COL, id, measurement);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'KPI_MEASUREMENT_SUBMITTED',
      resource: 'kpi_measurement',
      resourceId: id,
      resourceName: `${kpi.code}: ${actualVal} ${kpi.unit}`,
      result: 'SUCCESS',
      newValue: measurement
    });

    return measurement;
  }

  static async verifyMeasurement(measurementId: string, actor: User): Promise<void> {
    const measurement = await FirebaseService.getDocument<KPIMeasurement>(KPI_MEASUREMENTS_COL, measurementId);
    if (!measurement) throw new Error('Measurement not found');

    if (actor.defaultTenantId && actor.defaultTenantId !== measurement.tenantId && !actor.isPlatformSuperAdmin) {
      throw new Error('Unauthorized: Cannot verify measurement belonging to another tenant');
    }

    if (measurement.status !== 'SUBMITTED') {
      throw new Error(`Measurement cannot be verified from status: ${measurement.status}. Must be SUBMITTED.`);
    }

    // Segregation of Duties: Submitter cannot self-verify unless platform super admin
    if (measurement.submittedBy === actor.id && !actor.isPlatformSuperAdmin) {
      throw new Error('Segregation of Duties: Submitter cannot self-verify their own KPI measurement');
    }

    const now = new Date().toISOString();
    const updates: Partial<KPIMeasurement> = {
      status: 'VERIFIED',
      verifiedBy: actor.id,
      verifiedAt: now,
      updatedAt: now
    };

    await FirebaseService.updateDocument(KPI_MEASUREMENTS_COL, measurementId, updates);

    await AuditService.log({
      tenantId: measurement.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'KPI_MEASUREMENT_VERIFIED',
      resource: 'kpi_measurement',
      resourceId: measurementId,
      result: 'SUCCESS',
      newValue: updates
    });
  }

  static async approveMeasurement(measurementId: string, actor: User): Promise<void> {
    const measurement = await FirebaseService.getDocument<KPIMeasurement>(KPI_MEASUREMENTS_COL, measurementId);
    if (!measurement) throw new Error('Measurement not found');

    if (actor.defaultTenantId && actor.defaultTenantId !== measurement.tenantId && !actor.isPlatformSuperAdmin) {
      throw new Error('Unauthorized: Cannot approve measurement belonging to another tenant');
    }

    if (measurement.status !== 'VERIFIED') {
      throw new Error(`Measurement must be in VERIFIED status before approval (current: ${measurement.status})`);
    }

    const now = new Date().toISOString();
    const updates: Partial<KPIMeasurement> = {
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedAt: now,
      updatedAt: now
    };

    await FirebaseService.updateDocument(KPI_MEASUREMENTS_COL, measurementId, updates);

    await AuditService.log({
      tenantId: measurement.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'KPI_MEASUREMENT_APPROVED',
      resource: 'kpi_measurement',
      resourceId: measurementId,
      result: 'SUCCESS',
      newValue: updates
    });
  }

  // =========================================================================
  // 3. RISK & CORRECTIVE ACTIONS
  // =========================================================================

  static async reportRisk(
    tenantId: string,
    params: Omit<PerformanceRisk, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'severityScore' | 'severity'>,
    actor: User
  ): Promise<PerformanceRisk> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    if (!params.title || params.title.trim().length < 3) {
      throw new Error('Risk title must be at least 3 characters');
    }

    const prob = Number(params.probability);
    const imp = Number(params.impact);

    if (isNaN(prob) || !Number.isInteger(prob) || prob < 1 || prob > 5) {
      throw new Error('Risk probability must be an integer between 1 and 5');
    }
    if (isNaN(imp) || !Number.isInteger(imp) || imp < 1 || imp > 5) {
      throw new Error('Risk impact must be an integer between 1 and 5');
    }

    const severityScore = prob * imp;
    let severity: PerformanceRisk['severity'] = 'LOW';
    if (severityScore >= 20) severity = 'CRITICAL';
    else if (severityScore >= 12) severity = 'HIGH';
    else if (severityScore >= 6) severity = 'MEDIUM';

    const id = FirebaseService.generateId('risk');
    const now = new Date().toISOString();

    const risk: PerformanceRisk = {
      ...params,
      probability: prob,
      impact: imp,
      id,
      tenantId,
      severityScore,
      severity,
      status: 'IDENTIFIED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PERFORMANCE_RISKS_COL, id, risk);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'PERFORMANCE_RISK_CREATED',
      resource: 'performance_risk',
      resourceId: id,
      resourceName: risk.title,
      result: 'SUCCESS',
      newValue: risk
    });

    return risk;
  }

  static async initiateCorrectiveAction(
    tenantId: string,
    params: Omit<CorrectiveAction, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'status'>,
    actor: User
  ): Promise<CorrectiveAction> {
    if (!tenantId) throw new Error('Valid tenantId is required');
    if (!params.title || params.title.trim().length < 3) {
      throw new Error('Corrective action title must be at least 3 characters');
    }
    if (!params.dueDate) {
      throw new Error('Due date is required for corrective action');
    }

    const id = FirebaseService.generateId('actn');
    const now = new Date().toISOString();
    const action: CorrectiveAction = {
      ...params,
      id,
      tenantId,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CORRECTIVE_ACTIONS_COL, id, action);
    
    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'CORRECTIVE_ACTION_CREATED',
      resource: 'corrective_action',
      resourceId: id,
      resourceName: action.title,
      result: 'SUCCESS',
      newValue: action
    });

    return action;
  }

  static async updateCorrectiveAction(
    actionId: string, 
    updates: Partial<CorrectiveAction>, 
    actor: User
  ): Promise<void> {
    const action = await FirebaseService.getDocument<CorrectiveAction>(CORRECTIVE_ACTIONS_COL, actionId);
    if (!action) throw new Error('Corrective action not found');

    if (actor.defaultTenantId && actor.defaultTenantId !== action.tenantId && !actor.isPlatformSuperAdmin) {
      throw new Error('Unauthorized: Cannot update corrective action belonging to another tenant');
    }

    const now = new Date().toISOString();
    const newUpdates: Partial<CorrectiveAction> = {
      ...updates,
      updatedAt: now
    };

    if (updates.status === 'VERIFIED' && !action.verifiedBy) {
      newUpdates.verifiedBy = actor.id;
      newUpdates.verifiedAt = now;
    }

    await FirebaseService.updateDocument(CORRECTIVE_ACTIONS_COL, actionId, newUpdates);
    
    await AuditService.log({
      tenantId: action.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: updates.status === 'CLOSED' ? 'CORRECTIVE_ACTION_CLOSED' : 'CORRECTIVE_ACTION_CREATED',
      resource: 'corrective_action',
      resourceId: actionId,
      resourceName: action.title,
      result: 'SUCCESS',
      newValue: newUpdates
    });
  }

  // =========================================================================
  // 4. DATA RETRIEVAL (TENANT ISOLATED)
  // =========================================================================

  static async getStrategicPlans(tenantId: string): Promise<StrategicPlan[]> {
    if (!tenantId) return [];
    return FirebaseService.getTenantCollection<StrategicPlan>(STRATEGIC_PLANS_COL, tenantId);
  }

  static async getObjectives(tenantId: string, planId: string): Promise<StrategicObjective[]> {
    if (!tenantId || !planId) return [];
    return FirebaseService.getTenantCollection<StrategicObjective>(STRATEGIC_OBJECTIVES_COL, tenantId, [
      where('planId', '==', planId)
    ]);
  }

  static async getKPIDefinitions(tenantId: string): Promise<KPIDefinition[]> {
    if (!tenantId) return [];
    return FirebaseService.getTenantCollection<KPIDefinition>(KPI_DEFINITIONS_COL, tenantId);
  }

  static async getKPIMeasurements(tenantId: string, kpiId?: string): Promise<KPIMeasurement[]> {
    if (!tenantId) return [];
    const constraints: any[] = [];
    if (kpiId) constraints.push(where('kpiId', '==', kpiId));
    return FirebaseService.getTenantCollection<KPIMeasurement>(KPI_MEASUREMENTS_COL, tenantId, constraints);
  }

  static async getKPITargets(tenantId: string, kpiId?: string): Promise<KPITarget[]> {
    if (!tenantId) return [];
    const constraints: any[] = [];
    if (kpiId) constraints.push(where('kpiId', '==', kpiId));
    return FirebaseService.getTenantCollection<KPITarget>(KPI_TARGETS_COL, tenantId, constraints);
  }

  static async getPerformanceRisks(tenantId: string): Promise<PerformanceRisk[]> {
    if (!tenantId) return [];
    return FirebaseService.getTenantCollection<PerformanceRisk>(PERFORMANCE_RISKS_COL, tenantId);
  }

  static async getCorrectiveActions(tenantId: string): Promise<CorrectiveAction[]> {
    if (!tenantId) return [];
    return FirebaseService.getTenantCollection<CorrectiveAction>(CORRECTIVE_ACTIONS_COL, tenantId);
  }

  // =========================================================================
  // 5. MANUAL DATA BOOTSTRAPPING (FOR DEMO/TESTING ONLY)
  // =========================================================================

  static async seedInitialPerformanceData(tenantId: string, actor: User): Promise<void> {
    if (!tenantId) throw new Error('Tenant ID required');
    const existing = await this.getStrategicPlans(tenantId);
    if (existing.length > 0) return;

    // 1. Create a 5-Year Institutional Strategic Plan
    const plan = await this.createStrategicPlan(
      tenantId,
      {
        title: 'Institutional Vision 2025-2030: Academic & Digital Transformation',
        description: 'Comprehensive strategic roadmap to elevate academic excellence, student retention, research output, and digital governance.',
        periodStart: '2025-01-01',
        periodEnd: '2030-12-31',
        vision: 'To be a nationally benchmarked centre of educational distinction, innovation, and ethical leadership.',
        mission: 'Deliver holistically accredited education through cutting-edge pedagogical methods and institutional accountability.',
        values: ['Excellence', 'Integrity', 'Innovation', 'Inclusivity', 'Sustainability']
      },
      actor
    );

    // Approve and activate via super admin bypass if needed
    const approvedPlanUpdates: Partial<StrategicPlan> = {
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.updateDocument(STRATEGIC_PLANS_COL, plan.id, approvedPlanUpdates);
    await this.activateStrategicPlan(plan.id, actor);

    // 2. Create Objectives
    const obj1 = await this.createObjective(
      tenantId,
      plan.id,
      {
        code: 'SO-101',
        title: 'Enhance Academic Quality & Curriculum Accreditation',
        description: 'Achieve top-tier NAAC/NBA accreditation ratings across all degree programs.',
        priority: 'CRITICAL',
        weight: 35
      },
      actor
    );

    const obj2 = await this.createObjective(
      tenantId,
      plan.id,
      {
        code: 'SO-102',
        title: 'Improve Student Retention & Placement Velocity',
        description: 'Drive high-impact industry career placements and minimize academic attrition.',
        priority: 'HIGH',
        weight: 30
      },
      actor
    );

    const obj3 = await this.createObjective(
      tenantId,
      plan.id,
      {
        code: 'SO-103',
        title: 'Institutional Governance, Compliance & Sustainability',
        description: 'Automate statutory compliance, records preservation, and fiscal sustainability.',
        priority: 'HIGH',
        weight: 35
      },
      actor
    );

    // 3. Create Authoritative KPIs
    const kpi1 = await this.defineKPI(
      tenantId,
      {
        code: 'KPI-ACAD-01',
        name: 'Curriculum Outcome Attainment Rate',
        description: 'Percentage of students meeting or exceeding Bloom taxonomy target learning outcomes.',
        unit: '%',
        calculationMethod: '(Students achieving threshold marks / Total enrolled students) * 100',
        directionality: 'HIGHER_IS_BETTER',
        frequency: 'SEMI_ANNUALLY',
        ownerId: actor.id,
        departmentId: 'Academics',
        targetType: 'PERCENTAGE',
        weight: 25
      },
      actor
    );

    const kpi2 = await this.defineKPI(
      tenantId,
      {
        code: 'KPI-RET-02',
        name: 'Annual Student Retention Ratio',
        description: 'Proportion of students progressing to next academic level without dropout or transfer.',
        unit: '%',
        calculationMethod: '(Continuing students / Starting cohort students) * 100',
        directionality: 'HIGHER_IS_BETTER',
        frequency: 'ANNUALLY',
        ownerId: actor.id,
        departmentId: 'Student Affairs',
        targetType: 'PERCENTAGE',
        weight: 20
      },
      actor
    );

    const kpi3 = await this.defineKPI(
      tenantId,
      {
        code: 'KPI-PLAC-03',
        name: 'Graduate Employment & Placement Rate',
        description: 'Percentage of eligible graduates securing placement offers within 6 months of graduation.',
        unit: '%',
        calculationMethod: '(Placed graduates / Total eligible job-seeking graduates) * 100',
        directionality: 'HIGHER_IS_BETTER',
        frequency: 'ANNUALLY',
        ownerId: actor.id,
        departmentId: 'Career Services',
        targetType: 'PERCENTAGE',
        weight: 25
      },
      actor
    );

    const kpi4 = await this.defineKPI(
      tenantId,
      {
        code: 'KPI-COMP-04',
        name: 'Statutory Compliance Audit Deficiencies',
        description: 'Number of open regulatory compliance or accreditation audit non-conformities.',
        unit: 'Count',
        calculationMethod: 'Sum of unmitigated audit findings',
        directionality: 'LOWER_IS_BETTER',
        frequency: 'QUARTERLY',
        ownerId: actor.id,
        departmentId: 'Governance & Quality',
        targetType: 'NUMERIC',
        weight: 30
      },
      actor
    );

    // 4. Create KPI Targets
    const trgt1 = await this.createKPITarget(tenantId, {
      kpiId: kpi1.id,
      academicYearId: 'ay_2025_2026',
      periodLabel: 'H1 2025-2026',
      targetValue: 85,
      thresholds: { warning: 75, critical: 65 }
    }, actor);

    const trgt2 = await this.createKPITarget(tenantId, {
      kpiId: kpi2.id,
      academicYearId: 'ay_2025_2026',
      periodLabel: 'AY 2025-2026',
      targetValue: 92,
      thresholds: { warning: 85, critical: 75 }
    }, actor);

    const trgt4 = await this.createKPITarget(tenantId, {
      kpiId: kpi4.id,
      academicYearId: 'ay_2025_2026',
      periodLabel: 'Q1 2025',
      targetValue: 0,
      thresholds: { warning: 2, critical: 5 }
    }, actor);

    // 5. Submit Measurements
    await this.submitMeasurement(tenantId, {
      kpiId: kpi1.id,
      targetId: trgt1.id,
      actualValue: 88.5,
      measurementDate: '2025-06-30',
      notes: 'Mid-term outcome assessment verified by department academic committee.'
    }, actor);

    await this.submitMeasurement(tenantId, {
      kpiId: kpi2.id,
      targetId: trgt2.id,
      actualValue: 94.2,
      measurementDate: '2025-07-15',
      notes: 'Annual census confirms 94.2% retention following enhanced mentoring programs.'
    }, actor);

    await this.submitMeasurement(tenantId, {
      kpiId: kpi4.id,
      targetId: trgt4.id,
      actualValue: 1,
      measurementDate: '2025-03-31',
      notes: '1 minor record archiving finding identified during internal quality audit.'
    }, actor);

    // 6. Report Performance Risks
    await this.reportRisk(tenantId, {
      title: 'Curriculum Accreditation Renewal Delay Risk',
      description: 'Potential delay in faculty research output documentation for upcoming NBA accreditation.',
      probability: 3,
      impact: 4,
      status: 'IDENTIFIED',
      ownerId: actor.id,
      relatedEntityId: obj1.id
    }, actor);

    await this.reportRisk(tenantId, {
      title: 'Industry Hiring Cyclicality',
      description: 'Macroeconomic slowdown affecting campus recruitment partner intake quotas.',
      probability: 2,
      impact: 3,
      status: 'IDENTIFIED',
      ownerId: actor.id,
      relatedEntityId: obj2.id
    }, actor);

    // 7. Corrective Action
    await this.initiateCorrectiveAction(tenantId, {
      title: 'Accelerate Faculty Publication Assistance Grant',
      description: 'Allocate fast-track institutional funding for peer-reviewed journal publication fees.',
      sourceType: 'RISK_MITIGATION',
      sourceId: obj1.id,
      ownerId: actor.id,
      dueDate: '2025-11-30'
    }, actor);
  }
}
