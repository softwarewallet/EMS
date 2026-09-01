// EMS Phase 7.41 — Institutional Resource Planning, Capacity, Allocation & Enterprise Portfolio Governance Service

import {
  ResourceCategory,
  ResourcePlanStatus,
  AllocationRequestStatus,
  PortfolioItemStatus,
  PriorityBand,
  ConstraintSeverity,
  DataQualitySeverity,
  AuditMetadata,
  ResourcePlan,
  ResourcePlanVersion,
  ResourceCapacityProfile,
  ResourceDemandForecast,
  ResourceAllocationRequest,
  ResourceAllocationDecision,
  ResourceAllocation,
  ResourceUtilizationSnapshot,
  ResourceConstraint,
  ResourcePriorityRule,
  PortfolioItem,
  PortfolioPriorityScore,
  PortfolioReview,
  PortfolioDecision,
  ResourceIntervention,
  ResourceOptimizationAction,
  ResourceScenario,
  ResourceScenarioResult,
  ResourceDataQualityIssue,
  ResourceGovernanceReview
} from '../types/resourcePlanning';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

// Safe Math Utility Wrappers to prevent division-by-zero or precision leakage
export function safeNumber(val: any): number {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return 0;
  }
  return Number(val);
}

export function safeDivide(numerator: number, denominator: number): number {
  const num = safeNumber(numerator);
  const den = safeNumber(denominator);
  if (den === 0) return 0;
  return num / den;
}

export function safeRound(val: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(safeNumber(val) * factor) / factor;
}

export class ResourcePlanningService {
  // In-memory operational store with fallback synchronizers
  private static plans: Map<string, ResourcePlan> = new Map();
  private static capacityProfiles: Map<string, ResourceCapacityProfile> = new Map();
  private static demandForecasts: Map<string, ResourceDemandForecast> = new Map();
  private static allocationRequests: Map<string, ResourceAllocationRequest> = new Map();
  private static allocationDecisions: Map<string, ResourceAllocationDecision> = new Map();
  private static allocations: Map<string, ResourceAllocation> = new Map();
  private static constraints: Map<string, ResourceConstraint> = new Map();
  private static priorityRules: Map<string, ResourcePriorityRule> = new Map();
  private static portfolioItems: Map<string, PortfolioItem> = new Map();
  private static portfolioScores: Map<string, PortfolioPriorityScore> = new Map();
  private static portfolioReviews: Map<string, PortfolioReview> = new Map();
  private static portfolioDecisions: Map<string, PortfolioDecision> = new Map();
  private static interventions: Map<string, ResourceIntervention> = new Map();
  private static optimizationActions: Map<string, ResourceOptimizationAction> = new Map();
  private static scenarios: Map<string, ResourceScenario> = new Map();
  private static scenarioResults: Map<string, ResourceScenarioResult> = new Map();
  private static qualityIssues: Map<string, ResourceDataQualityIssue> = new Map();
  private static governanceReviews: Map<string, ResourceGovernanceReview> = new Map();

  // Static Initializer - Seeding high-fidelity data instantly
  static {
    const defaultTenant = 'DEFAULT';
    const defaultCampus = 'CAMPUS-A';

    // 1. Priority Rule Weights
    this.priorityRules.set('rule_global_default', {
      id: 'rule_global_default',
      tenantId: defaultTenant,
      resourceCategory: 'HUMAN',
      weightStrategicAlignment: 0.25,
      weightUrgency: 0.15,
      weightInstitutionalImpact: 0.20,
      weightStudentImpact: 0.25,
      weightRiskReduction: 0.15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system'
    });

    // 2. Capacity Profiles
    const capacities: Omit<ResourceCapacityProfile, 'id' | 'tenantId' | 'campusId' | 'createdBy' | 'createdAt' | 'updatedAt'>[] = [
      {
        resourceId: 'STAFF-101',
        resourceName: 'Dr. Evelyn Martinez (Lead AI Specialist)',
        category: 'HUMAN',
        totalCapacity: 160,
        usedCapacity: 120,
        availableCapacity: 40,
        utilizationRate: 75.0,
        unitOfMeasure: 'hours/month',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      },
      {
        resourceId: 'STAFF-102',
        resourceName: 'Prof. Alistair Vance (Senior Researcher)',
        category: 'HUMAN',
        totalCapacity: 160,
        usedCapacity: 155,
        availableCapacity: 5,
        utilizationRate: 96.88,
        unitOfMeasure: 'hours/month',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      },
      {
        resourceId: 'ROOM-402',
        resourceName: 'Advanced Robotics Core Lab',
        category: 'LABORATORY',
        totalCapacity: 60,
        usedCapacity: 54,
        availableCapacity: 6,
        utilizationRate: 90.0,
        unitOfMeasure: 'seats',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      },
      {
        resourceId: 'ROOM-101',
        resourceName: 'Main Lecture Theater',
        category: 'ROOM',
        totalCapacity: 150,
        usedCapacity: 80,
        availableCapacity: 70,
        utilizationRate: 53.33,
        unitOfMeasure: 'seats',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      },
      {
        resourceId: 'EQUIP-909',
        resourceName: 'NVIDIA H100 GPU Cluster B',
        category: 'EQUIPMENT',
        totalCapacity: 24,
        usedCapacity: 22,
        availableCapacity: 2,
        utilizationRate: 91.67,
        unitOfMeasure: 'node-hours',
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      }
    ];

    capacities.forEach((cap, idx) => {
      const id = `cap_${idx + 1}`;
      this.capacityProfiles.set(id, {
        ...cap,
        id,
        tenantId: defaultTenant,
        campusId: defaultCampus,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    // 3. Resource Plans
    this.plans.set('plan_2026_academic', {
      id: 'plan_2026_academic',
      tenantId: defaultTenant,
      campusId: defaultCampus,
      name: 'FY 2026 Academic Capacity & Infrastructure Plan',
      fiscalYear: '2026',
      description: 'Governs high-performance computing allocations and tenure-track staff scheduling scaling.',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      category: 'ACADEMIC',
      totalEstimatedCost: 450000,
      totalAllocatedCost: 380000,
      status: 'ACTIVE',
      createdBy: 'adm_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      approvedBy: 'gov_approver_1',
      approvedAt: new Date().toISOString(),
      justification: 'Required for accreditation and research grant compliance.'
    });

    // 4. Portfolio Items (Enterprise Projects)
    const items: Omit<PortfolioItem, 'id' | 'tenantId' | 'campusId' | 'createdBy' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Autonomous Systems Research Initiative',
        description: 'Multi-department initiative developing neural flight controllers and simulator suites.',
        proposerId: 'staff_vance',
        strategicObjectiveId: 'obj_729_pioneer_ai',
        kpiId: 'kpi_729_patents',
        riskId: 'risk_731_sensor_failure',
        budgetCode: 'FIN-RES-8822',
        estimatedTotalBudget: 180000,
        status: 'PROPOSED',
        priorityScore: 8.4,
        priorityBand: 'HIGH'
      },
      {
        name: 'Hybrid Campus Edge Node Deployment',
        description: 'Decentralized local CDN and computing cluster nodes across outer student dorms.',
        proposerId: 'staff_martinez',
        strategicObjectiveId: 'obj_729_infra_resilience',
        kpiId: 'kpi_729_latency',
        budgetCode: 'FIN-OPS-1144',
        estimatedTotalBudget: 95000,
        status: 'ACTIVE',
        priorityScore: 7.2,
        priorityBand: 'MEDIUM'
      },
      {
        name: 'Specialist Cybersecurity Sandbox',
        description: 'Enclosed offline cybersecurity range mapping threat landscapes and defensive protocols.',
        proposerId: 'staff_security',
        strategicObjectiveId: 'obj_729_compliance_cert',
        riskId: 'risk_731_cyber_threat',
        budgetCode: 'FIN-SEC-4099',
        estimatedTotalBudget: 60000,
        status: 'PROPOSED',
        priorityScore: 9.1,
        priorityBand: 'CRITICAL'
      }
    ];

    items.forEach((item, idx) => {
      const id = `port_${idx + 1}`;
      this.portfolioItems.set(id, {
        ...item,
        id,
        tenantId: defaultTenant,
        campusId: defaultCampus,
        createdBy: 'adm_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Seeding individual scoring breakdown
      const scoreId = `score_${id}`;
      this.portfolioScores.set(scoreId, {
        id: scoreId,
        tenantId: defaultTenant,
        portfolioItemId: id,
        strategicAlignment: idx === 0 ? 9 : idx === 1 ? 7 : 8,
        urgency: idx === 0 ? 8 : idx === 1 ? 6 : 9,
        institutionalImpact: idx === 0 ? 8 : idx === 1 ? 7 : 10,
        regulatoryRequirement: idx === 0 ? 5 : idx === 1 ? 4 : 10,
        studentImpact: idx === 0 ? 9 : idx === 1 ? 8 : 7,
        operationalCriticality: idx === 0 ? 7 : idx === 1 ? 8 : 9,
        riskReduction: idx === 0 ? 6 : idx === 1 ? 7 : 10,
        resourceEfficiency: idx === 0 ? 7 : idx === 1 ? 6 : 5,
        calculatedScore: item.priorityScore,
        weightingVersion: 'v1_standard',
        calculatedAt: new Date().toISOString()
      });
    });

    // 5. Allocation Requests
    this.allocationRequests.set('req_01', {
      id: 'req_01',
      tenantId: defaultTenant,
      campusId: defaultCampus,
      portfolioItemId: 'port_1',
      resourceCategory: 'HUMAN',
      resourceId: 'STAFF-102',
      requestedQuantity: 40,
      requiredStartDate: '2026-09-01',
      requiredEndDate: '2026-12-31',
      justification: 'Requires Dr. Alistair Vance for critical guidance on neural flight controller physics models.',
      priority: 'HIGH',
      requesterId: 'staff_vance',
      status: 'REQUESTED',
      createdBy: 'staff_vance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 6. Direct Constraints
    this.constraints.set('const_01', {
      id: 'const_01',
      tenantId: defaultTenant,
      campusId: defaultCampus,
      severity: 'HIGH',
      source: 'STAFF_OVERLOAD',
      affectedResourceCategory: 'HUMAN',
      affectedResourceId: 'STAFF-102',
      affectedPortfolioItemId: 'port_1',
      detectedAt: new Date().toISOString(),
      details: 'Dr. Alistair Vance is overallocated at 96.88% total monthly capacity, leaving only 5 hours available.',
      status: 'UNRESOLVED'
    });

    // 7. Seed optimization recommendation
    this.optimizationActions.set('opt_01', {
      id: 'opt_01',
      tenantId: defaultTenant,
      campusId: defaultCampus,
      title: 'HPC Node-Hour Re-allocations',
      opportunityType: 'UNDER_UTILIZATION',
      potentialSavings: 15000,
      recommendedAction: 'Reclaim 30 unused seats in Lecture Theater ROOM-101 and re-allocate budget to GPU Cluster nodes.',
      status: 'PROPOSED',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // =========================================================================
  // UTILITIES & SECURITY WRAPPER CHECKS
  // =========================================================================

  private static assertSession(userId?: string, tenantId?: string) {
    if (!userId) throw new Error('ERR_AUTH_REQUIRED: Operation requires valid authenticated user.');
    if (!tenantId) throw new Error('ERR_TENANT_REQUIRED: Operation requires authorized tenant context.');
  }

  private static assertCampusAccess(userCampus: string | undefined, targetCampus: string | undefined) {
    if (targetCampus && userCampus && userCampus !== 'ALL' && userCampus !== targetCampus) {
      throw new Error(`ERR_UNAUTHORIZED_CAMPUS_SCOPE: Access denied. Actor scope is restricted to ${userCampus}.`);
    }
  }

  // =========================================================================
  // RESOURCE CAPACITY PROFILES (The Capacity Engine)
  // =========================================================================

  static async getCapacityProfiles(userId: string, tenantId: string, campusId?: string): Promise<ResourceCapacityProfile[]> {
    this.assertSession(userId, tenantId);
    // Synced array
    const list = Array.from(this.capacityProfiles.values()).filter(p => p.tenantId === tenantId);
    return campusId ? list.filter(p => p.campusId === campusId) : list;
  }

  static async createCapacityProfile(
    userId: string,
    tenantId: string,
    payload: Omit<ResourceCapacityProfile, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt' | 'utilizationRate' | 'availableCapacity'>,
    role: string = 'staff'
  ): Promise<ResourceCapacityProfile> {
    this.assertSession(userId, tenantId);
    if (role !== 'admin' && role !== 'super_admin' && role !== 'auditor') {
      throw new Error('ERR_RBAC_INSUFFICIENT: Only administrative users can register capacity profiles.');
    }

    const id = FirebaseService.generateId('cap');
    const totalCapacity = safeNumber(payload.totalCapacity);
    const usedCapacity = safeNumber(payload.usedCapacity);
    
    if (totalCapacity < 0) {
      throw new Error('ERR_NEGATIVE_CAPACITY: Capacity profiles cannot have negative total capacities.');
    }
    if (usedCapacity < 0) {
      throw new Error('ERR_NEGATIVE_CAPACITY: Used capacity cannot be negative.');
    }

    const availableCapacity = totalCapacity - usedCapacity;
    const utilizationRate = safeRound(safeDivide(usedCapacity, totalCapacity) * 100);

    const profile: ResourceCapacityProfile = {
      ...payload,
      id,
      tenantId,
      totalCapacity,
      usedCapacity,
      availableCapacity,
      utilizationRate,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.capacityProfiles.set(id, profile);

    // Persist and audit log
    await FirebaseService.setDocument('resource_capacity_profiles', id, profile);
    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_CAPACITY_UPDATED',
      resource: 'resource_capacity',
      resourceId: id,
      newValue: profile,
      notes: `Registered capacity profile for resource ${payload.resourceName}`
    });

    // Automatically execute sanity check constraint triggers
    await this.evaluateResourceConstraints(tenantId, profile);

    return profile;
  }

  // Deterministically check for constraints and issue violations
  private static async evaluateResourceConstraints(tenantId: string, profile: ResourceCapacityProfile): Promise<void> {
    if (profile.utilizationRate > 95.0) {
      const constraintId = FirebaseService.generateId('const');
      const constRecord: ResourceConstraint = {
        id: constraintId,
        tenantId,
        campusId: profile.campusId,
        severity: 'HIGH',
        source: profile.category === 'HUMAN' ? 'STAFF_OVERLOAD' : 'FACILITY_SATURATION',
        affectedResourceCategory: profile.category,
        affectedResourceId: profile.resourceId,
        detectedAt: new Date().toISOString(),
        details: `CRITICAL LOAD WARNING: Utilization rate for ${profile.resourceName} has surged to ${profile.utilizationRate}%.`,
        status: 'UNRESOLVED'
      };
      this.constraints.set(constraintId, constRecord);
      await FirebaseService.setDocument('resource_constraints', constraintId, constRecord);
      
      await AuditService.log({
        tenantId,
        userId: 'system_engine',
        action: 'RESOURCE_CONSTRAINT_DETECTED',
        resource: 'scheduling_conflict',
        resourceId: constraintId,
        newValue: constRecord,
        notes: `System triggered high workload constraint for resourceId ${profile.resourceId}`
      });
    }
  }

  // =========================================================================
  // RESOURCE PLANS & IMMUTABLE VERSION SNAPSHOTS
  // =========================================================================

  static async getPlans(userId: string, tenantId: string, campusId?: string): Promise<ResourcePlan[]> {
    this.assertSession(userId, tenantId);
    const list = Array.from(this.plans.values()).filter(p => p.tenantId === tenantId);
    return campusId ? list.filter(p => p.campusId === campusId) : list;
  }

  static async createPlan(
    userId: string,
    tenantId: string,
    payload: Omit<ResourcePlan, 'id' | 'tenantId' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'version'>,
    role: string = 'staff'
  ): Promise<ResourcePlan> {
    this.assertSession(userId, tenantId);
    if (role !== 'admin' && role !== 'super_admin') {
      throw new Error('ERR_RBAC_INSUFFICIENT: Creation of resource plans is restricted to resource managers.');
    }

    const id = FirebaseService.generateId('plan');
    const newPlan: ResourcePlan = {
      ...payload,
      id,
      tenantId,
      status: 'DRAFT',
      version: 1,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.plans.set(id, newPlan);
    await FirebaseService.setDocument('resource_plans', id, newPlan);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PLAN_CREATED',
      resource: 'resource_plan',
      resourceId: id,
      newValue: newPlan,
      notes: `Created DRAFT resource plan: ${payload.name}`
    });

    return newPlan;
  }

  // Commit version snapshots for strict audit capabilities
  static async submitPlanForApproval(
    userId: string,
    tenantId: string,
    planId: string
  ): Promise<ResourcePlan> {
    this.assertSession(userId, tenantId);
    const plan = this.plans.get(planId);
    if (!plan || plan.tenantId !== tenantId) {
      throw new Error('ERR_DOCUMENT_NOT_FOUND: Referenced resource plan was not found.');
    }

    if (plan.status !== 'DRAFT') {
      throw new Error('ERR_INVALID_LIFECYCLE_STATE: Only DRAFT plans can be submitted.');
    }

    plan.status = 'SUBMITTED';
    plan.updatedAt = new Date().toISOString();

    // Create immutable snapshot of state
    const versionId = FirebaseService.generateId('ver');
    const versionSnapshot: ResourcePlanVersion = {
      id: versionId,
      tenantId,
      resourcePlanId: planId,
      versionNumber: plan.version,
      snapshotData: JSON.stringify(plan),
      createdBy: userId,
      createdAt: new Date().toISOString(),
      changeSummary: `Submitted for formal executive approval. Ver: ${plan.version}`
    };

    this.plans.set(planId, plan);
    await FirebaseService.setDocument('resource_plans', planId, plan);
    await FirebaseService.setDocument('resource_plan_versions', versionId, versionSnapshot);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PLAN_SUBMITTED',
      resource: 'resource_plan',
      resourceId: planId,
      newValue: plan,
      notes: `Plan "${plan.name}" submitted. Immutable version snapshot ${versionId} generated.`
    });

    return plan;
  }

  // Four-Eyes Principle / SoD Approval
  static async approvePlan(
    userId: string,
    tenantId: string,
    planId: string,
    justification: string,
    role: string = 'staff'
  ): Promise<ResourcePlan> {
    this.assertSession(userId, tenantId);
    if (role !== 'super_admin' && role !== 'admin') {
      throw new Error('ERR_FOUR_EYES_VIOLATION: Administrative signature required for final plan release.');
    }

    const plan = this.plans.get(planId);
    if (!plan || plan.tenantId !== tenantId) {
      throw new Error('ERR_DOCUMENT_NOT_FOUND: Plan not found.');
    }

    if (plan.createdBy === userId) {
      throw new Error('ERR_FOUR_EYES_VIOLATION: Segregation of Duties. Creator cannot approve their own plan.');
    }

    if (plan.status !== 'SUBMITTED') {
      throw new Error('ERR_INVALID_LIFECYCLE_STATE: Only submitted plans can be approved.');
    }

    plan.status = 'APPROVED';
    plan.approvedBy = userId;
    plan.approvedAt = new Date().toISOString();
    plan.justification = justification;
    plan.updatedAt = new Date().toISOString();

    this.plans.set(planId, plan);
    await FirebaseService.setDocument('resource_plans', planId, plan);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PLAN_APPROVED',
      resource: 'resource_plan',
      resourceId: planId,
      newValue: plan,
      notes: `Plan approved with justification: ${justification}`
    });

    return plan;
  }

  // =========================================================================
  // PORTFOLIO STRATEGIC PRIORITIZATION & SCORING
  // =========================================================================

  static async getPortfolioItems(userId: string, tenantId: string, campusId?: string): Promise<PortfolioItem[]> {
    this.assertSession(userId, tenantId);
    const list = Array.from(this.portfolioItems.values()).filter(p => p.tenantId === tenantId);
    return campusId ? list.filter(p => p.campusId === campusId) : list;
  }

  static async createPortfolioItem(
    userId: string,
    tenantId: string,
    payload: Omit<PortfolioItem, 'id' | 'tenantId' | 'status' | 'priorityScore' | 'priorityBand' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Promise<PortfolioItem> {
    this.assertSession(userId, tenantId);

    const id = FirebaseService.generateId('port');
    const item: PortfolioItem = {
      ...payload,
      id,
      tenantId,
      status: 'PROPOSED',
      priorityScore: 0,
      priorityBand: 'LOW',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.portfolioItems.set(id, item);
    await FirebaseService.setDocument('resource_portfolio_items', id, item);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PORTFOLIO_CREATED',
      resource: 'resource_portfolio',
      resourceId: id,
      newValue: item,
      notes: `Proposed portfolio item: ${payload.name}`
    });

    return item;
  }

  // strategic alignment prioritization logic
  static async calculateStrategicScore(
    userId: string,
    tenantId: string,
    itemId: string,
    scores: Omit<PortfolioPriorityScore, 'id' | 'tenantId' | 'portfolioItemId' | 'calculatedScore' | 'weightingVersion' | 'calculatedAt'>
  ): Promise<PortfolioPriorityScore> {
    this.assertSession(userId, tenantId);

    const item = this.portfolioItems.get(itemId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('ERR_DOCUMENT_NOT_FOUND: Portfolio item not found.');
    }

    // Load active weighting rule, falling back to system defaults
    const rule = Array.from(this.priorityRules.values()).find(r => r.tenantId === tenantId) || {
      weightStrategicAlignment: 0.25,
      weightUrgency: 0.15,
      weightInstitutionalImpact: 0.20,
      weightStudentImpact: 0.25,
      weightRiskReduction: 0.15
    };

    // Calculate Strategic Alignment prioritizing Student Impact & Risk
    const weightedSum =
      safeNumber(scores.strategicAlignment) * safeNumber(rule.weightStrategicAlignment) +
      safeNumber(scores.urgency) * safeNumber(rule.weightUrgency) +
      safeNumber(scores.institutionalImpact) * safeNumber(rule.weightInstitutionalImpact) +
      safeNumber(scores.studentImpact) * safeNumber(rule.weightStudentImpact) +
      safeNumber(scores.riskReduction) * safeNumber(rule.weightRiskReduction);

    const calculatedScore = safeRound(weightedSum, 1);
    
    let priorityBand: PriorityBand = 'LOW';
    if (calculatedScore >= 8.5) priorityBand = 'CRITICAL';
    else if (calculatedScore >= 7.0) priorityBand = 'HIGH';
    else if (calculatedScore >= 5.0) priorityBand = 'MEDIUM';

    // Update parent portfolio item
    item.priorityScore = calculatedScore;
    item.priorityBand = priorityBand;
    item.status = 'PRIORITIZED';
    item.updatedAt = new Date().toISOString();

    const scoreId = FirebaseService.generateId('score');
    const priorityScoreRecord: PortfolioPriorityScore = {
      ...scores,
      id: scoreId,
      tenantId,
      portfolioItemId: itemId,
      calculatedScore,
      weightingVersion: 'v1_standard',
      calculatedAt: new Date().toISOString()
    };

    this.portfolioItems.set(itemId, item);
    this.portfolioScores.set(scoreId, priorityScoreRecord);

    await FirebaseService.setDocument('resource_portfolio_items', itemId, item);
    await FirebaseService.setDocument('resource_portfolio_scores', scoreId, priorityScoreRecord);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PRIORITY_CALCULATED',
      resource: 'resource_portfolio',
      resourceId: itemId,
      newValue: priorityScoreRecord,
      notes: `Recalculated strategic score: ${calculatedScore} (${priorityBand})`
    });

    return priorityScoreRecord;
  }

  // =========================================================================
  // RESOURCE ALLOCATION REQUESTS & FOUR-EYES EXECUTION
  // =========================================================================

  static async getAllocationRequests(userId: string, tenantId: string): Promise<ResourceAllocationRequest[]> {
    this.assertSession(userId, tenantId);
    return Array.from(this.allocationRequests.values()).filter(r => r.tenantId === tenantId);
  }

  static async createAllocationRequest(
    userId: string,
    tenantId: string,
    payload: Omit<ResourceAllocationRequest, 'id' | 'tenantId' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Promise<ResourceAllocationRequest> {
    this.assertSession(userId, tenantId);

    const id = FirebaseService.generateId('req');
    const req: ResourceAllocationRequest = {
      ...payload,
      id,
      tenantId,
      status: 'REQUESTED',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.allocationRequests.set(id, req);
    await FirebaseService.setDocument('resource_allocation_requests', id, req);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_ALLOCATION_REQUESTED',
      resource: 'resource_allocation',
      resourceId: id,
      newValue: req,
      notes: `Requested allocation for category: ${payload.resourceCategory}`
    });

    return req;
  }

  // Four-Eyes workflow execution mapping
  static async allocateResource(
    userId: string,
    tenantId: string,
    requestId: string,
    decision: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED',
    allocatedQuantity: number,
    justification: string,
    role: string = 'staff'
  ): Promise<ResourceAllocationDecision> {
    this.assertSession(userId, tenantId);
    if (role !== 'admin' && role !== 'super_admin') {
      throw new Error('ERR_RBAC_INSUFFICIENT: Resource allocation requires resource administration permissions.');
    }

    const request = this.allocationRequests.get(requestId);
    if (!request || request.tenantId !== tenantId) {
      throw new Error('ERR_DOCUMENT_NOT_FOUND: Referenced allocation request not found.');
    }

    if (request.createdBy === userId) {
      throw new Error('ERR_FOUR_EYES_VIOLATION: Segregation of Duties. Creator cannot sign-off their own request.');
    }

    if (request.status !== 'REQUESTED' && request.status !== 'UNDER_REVIEW') {
      throw new Error('ERR_INVALID_LIFECYCLE_STATE: Allocation requests in this state cannot be processed.');
    }

    const decisionId = FirebaseService.generateId('dec');
    const decisionRecord: ResourceAllocationDecision = {
      id: decisionId,
      tenantId,
      requestId,
      approverId: userId,
      decision,
      allocatedQuantity,
      justification,
      decidedAt: new Date().toISOString()
    };

    // Update source request status
    request.status = decision === 'APPROVED' ? 'ALLOCATED' : decision === 'REJECTED' ? 'REJECTED' : 'PARTIALLY_ALLOCATED';
    request.updatedAt = new Date().toISOString();

    this.allocationRequests.set(requestId, request);
    this.allocationDecisions.set(decisionId, decisionRecord);

    await FirebaseService.setDocument('resource_allocation_requests', requestId, request);
    await FirebaseService.setDocument('resource_allocation_decisions', decisionId, decisionRecord);

    // If approved, create active allocation mapping
    if (decision === 'APPROVED' || decision === 'PARTIALLY_APPROVED') {
      const allocationId = FirebaseService.generateId('alloc');
      const allocation: ResourceAllocation = {
        id: allocationId,
        tenantId,
        campusId: request.campusId,
        requestId,
        resourceId: request.resourceId || 'UNSPECIFIED_GENERIC',
        resourceCategory: request.resourceCategory,
        allocatedQuantity,
        startDate: request.requiredStartDate,
        endDate: request.requiredEndDate,
        status: 'ACTIVE',
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.allocations.set(allocationId, allocation);
      await FirebaseService.setDocument('resource_allocations', allocationId, allocation);

      // Adjust capacity profiles automatically
      if (request.resourceId) {
        const profile = Array.from(this.capacityProfiles.values()).find(
          p => p.resourceId === request.resourceId && p.tenantId === tenantId
        );
        if (profile) {
          profile.usedCapacity += allocatedQuantity;
          profile.availableCapacity = profile.totalCapacity - profile.usedCapacity;
          profile.utilizationRate = safeRound(safeDivide(profile.usedCapacity, profile.totalCapacity) * 100);
          profile.updatedAt = new Date().toISOString();
          
          this.capacityProfiles.set(profile.id, profile);
          await FirebaseService.setDocument('resource_capacity_profiles', profile.id, profile);
          
          // Re-evaluate constraints in case utilization rate breached threshold limits
          await this.evaluateResourceConstraints(tenantId, profile);
        }
      }
    }

    await AuditService.log({
      tenantId,
      userId,
      action: decision === 'APPROVED' ? 'RESOURCE_ALLOCATION_APPROVED' : 'RESOURCE_ALLOCATION_REJECTED',
      resource: 'resource_allocation',
      resourceId: requestId,
      newValue: decisionRecord,
      notes: `Decision processed by ${userId}. Justification: ${justification}`
    });

    return decisionRecord;
  }

  // =========================================================================
  // WHAT-IF SCENARIO ENGINE (PROJECTIONS)
  // =========================================================================

  static async getScenarios(userId: string, tenantId: string): Promise<ResourceScenario[]> {
    this.assertSession(userId, tenantId);
    return Array.from(this.scenarios.values()).filter(s => s.tenantId === tenantId);
  }

  static async runScenarioSimulation(
    userId: string,
    tenantId: string,
    name: string,
    description: string,
    assumptions: ResourceScenario['assumptions']
  ): Promise<{ scenario: ResourceScenario; result: ResourceScenarioResult }> {
    this.assertSession(userId, tenantId);

    const scenarioId = FirebaseService.generateId('scen');
    const resultId = FirebaseService.generateId('scenres');

    const scenario: ResourceScenario = {
      id: scenarioId,
      tenantId,
      name,
      description,
      assumptions,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    // Simulating mathematical projections
    const enrollmentFactor = safeNumber(assumptions.enrollmentChangePercentage); // e.g. +10%
    const staffReductionFactor = safeNumber(assumptions.staffReductionPercentage); // e.g. -5%
    const budgetFactor = safeNumber(assumptions.budgetReductionPercentage); // e.g. -10%

    // Proportional demand modeling deltas
    const estimatedHumanDemandDelta = safeRound(enrollmentFactor * 1.5 - staffReductionFactor * 2.0);
    const estimatedFacilityDemandDelta = safeRound(enrollmentFactor * 1.2 + (assumptions.facilityExpanded ? -15 : 0));
    
    let resultingConstraintsCount = 0;
    if (estimatedHumanDemandDelta > 15) resultingConstraintsCount += 2;
    if (estimatedFacilityDemandDelta > 10) resultingConstraintsCount += 1;
    if (budgetFactor > 5) resultingConstraintsCount += 1;

    const budgetVariance = safeRound(budgetFactor * -12000 + (assumptions.facilityExpanded ? 45000 : 0));

    const result: ResourceScenarioResult = {
      id: resultId,
      tenantId,
      scenarioId,
      simulationOutputs: {
        estimatedHumanDemandDelta,
        estimatedFacilityDemandDelta,
        resultingConstraintsCount,
        budgetVariance
      },
      status: 'DRAFT'
    };

    this.scenarios.set(scenarioId, scenario);
    this.scenarioResults.set(resultId, result);

    await FirebaseService.setDocument('resource_scenarios', scenarioId, scenario);
    await FirebaseService.setDocument('resource_scenario_results', resultId, result);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_SCENARIO_CREATED',
      resource: 'resource_scenario',
      resourceId: scenarioId,
      newValue: { scenario, result },
      notes: `Executed what-if projection simulation: "${name}"`
    });

    return { scenario, result };
  }

  static async certifyScenario(
    userId: string,
    tenantId: string,
    resultId: string
  ): Promise<ResourceScenarioResult> {
    this.assertSession(userId, tenantId);
    const result = this.scenarioResults.get(resultId);
    if (!result || result.tenantId !== tenantId) {
      throw new Error('ERR_DOCUMENT_NOT_FOUND: Simulation result not found.');
    }

    result.status = 'CERTIFIED';
    result.certifiedBy = userId;
    result.certifiedAt = new Date().toISOString();

    this.scenarioResults.set(resultId, result);
    await FirebaseService.setDocument('resource_scenario_results', resultId, result);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_SCENARIO_CERTIFIED',
      resource: 'resource_scenario',
      resourceId: resultId,
      newValue: result,
      notes: `Certified simulation output values for scenarioId ${result.scenarioId}`
    });

    return result;
  }

  // =========================================================================
  // DATA QUALITY AND ORPHAN AUDIT AUTOMATIONS (Sanity Engine)
  // =========================================================================

  static async getDataQualityIssues(userId: string, tenantId: string): Promise<ResourceDataQualityIssue[]> {
    this.assertSession(userId, tenantId);
    return Array.from(this.qualityIssues.values()).filter(i => i.tenantId === tenantId);
  }

  static async runGlobalDataSanityCheck(userId: string, tenantId: string): Promise<ResourceDataQualityIssue[]> {
    this.assertSession(userId, tenantId);
    
    // Clear previous open checks to ensure real-time reporting
    for (const [key, issue] of this.qualityIssues.entries()) {
      if (issue.tenantId === tenantId && issue.status === 'OPEN') {
        this.qualityIssues.delete(key);
      }
    }

    const detected: ResourceDataQualityIssue[] = [];

    // Check Capacity Negative / Extreme Values
    this.capacityProfiles.forEach((profile) => {
      if (profile.tenantId === tenantId) {
        if (profile.totalCapacity < 0) {
          detected.push({
            id: FirebaseService.generateId('issue'),
            tenantId,
            campusId: profile.campusId,
            severity: 'CRITICAL',
            issueType: 'NEGATIVE_CAPACITY',
            entityType: 'capacity_profile',
            entityId: profile.id,
            detectedAt: new Date().toISOString(),
            details: `Resource "${profile.resourceName}" has a negative total capacity: ${profile.totalCapacity}.`,
            status: 'OPEN'
          });
        }
        if (profile.utilizationRate > 150.0) {
          detected.push({
            id: FirebaseService.generateId('issue'),
            tenantId,
            campusId: profile.campusId,
            severity: 'HIGH',
            issueType: 'IMPOSSIBLE_UTILIZATION',
            entityType: 'capacity_profile',
            entityId: profile.id,
            detectedAt: new Date().toISOString(),
            details: `Resource "${profile.resourceName}" exhibits an impossible utilization rate: ${profile.utilizationRate}%.`,
            status: 'OPEN'
          });
        }
      }
    });

    // Check Orphan Portfolio References inside Allocation Requests
    this.allocationRequests.forEach((req) => {
      if (req.tenantId === tenantId && req.portfolioItemId) {
        const item = this.portfolioItems.get(req.portfolioItemId);
        if (!item || item.tenantId !== tenantId) {
          detected.push({
            id: FirebaseService.generateId('issue'),
            tenantId,
            campusId: req.campusId,
            severity: 'HIGH',
            issueType: 'BROKEN_PORTFOLIO_REFERENCE',
            entityType: 'allocation_request',
            entityId: req.id,
            detectedAt: new Date().toISOString(),
            details: `Allocation request references an non-existent enterprise portfolio item: ${req.portfolioItemId}.`,
            status: 'OPEN'
          });
        }
      }
    });

    // Push detected issues
    for (const issue of detected) {
      this.qualityIssues.set(issue.id, issue);
      await FirebaseService.setDocument('resource_data_quality_issues', issue.id, issue);
    }

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_DATA_QUALITY_ISSUE_DETECTED',
      resource: 'resource_governance',
      resourceId: 'global_sanity_trigger',
      details: { detectedCount: detected.length },
      notes: `Completed system-wide data quality sanity check. Issues found: ${detected.length}`
    });

    return detected;
  }

  // =========================================================================
  // ADDITIONAL CONVENIENCE AND GOVERNANCE WRAPPERS
  // =========================================================================

  static async getConstraints(userId: string, tenantId: string): Promise<ResourceConstraint[]> {
    this.assertSession(userId, tenantId);
    return Array.from(this.constraints.values()).filter(c => c.tenantId === tenantId);
  }

  static async getOptimizationActions(userId: string, tenantId: string): Promise<ResourceOptimizationAction[]> {
    this.assertSession(userId, tenantId);
    return Array.from(this.optimizationActions.values()).filter(o => o.tenantId === tenantId);
  }

  static async certifyGovernanceReview(
    userId: string,
    tenantId: string,
    payload: Omit<ResourceGovernanceReview, 'id' | 'tenantId' | 'certifiedAt' | 'status'>
  ): Promise<ResourceGovernanceReview> {
    this.assertSession(userId, tenantId);

    const id = FirebaseService.generateId('govrev');
    const review: ResourceGovernanceReview = {
      ...payload,
      id,
      tenantId,
      certifiedAt: new Date().toISOString(),
      status: 'COMPLETED'
    };

    this.governanceReviews.set(id, review);
    await FirebaseService.setDocument('resource_governance_reviews', id, review);

    await AuditService.log({
      tenantId,
      userId,
      action: 'RESOURCE_PORTFOLIO_APPROVED',
      resource: 'resource_governance',
      resourceId: id,
      newValue: review,
      notes: `Certified formal governance compliance rating: ${payload.complianceRating} on ${payload.reviewTargetType}`
    });

    return review;
  }

  // Ad-hoc calculations dashboard efficiency KPI snapshot
  static async calculateUtilizationEfficiency(tenantId: string): Promise<ResourceUtilizationSnapshot> {
    const defaultCampus = 'CAMPUS-A';
    const activeProfiles = Array.from(this.capacityProfiles.values()).filter(p => p.tenantId === tenantId);
    
    // Weighted splits
    const faculty = activeProfiles.filter(p => p.category === 'HUMAN');
    const rooms = activeProfiles.filter(p => p.category === 'ROOM');
    const labs = activeProfiles.filter(p => p.category === 'LABORATORY');
    const equip = activeProfiles.filter(p => p.category === 'EQUIPMENT');

    const avgFaculty = safeRound(safeDivide(faculty.reduce((acc, cur) => acc + cur.utilizationRate, 0), faculty.length));
    const avgRooms = safeRound(safeDivide(rooms.reduce((acc, cur) => acc + cur.utilizationRate, 0), rooms.length));
    const avgLabs = safeRound(safeDivide(labs.reduce((acc, cur) => acc + cur.utilizationRate, 0), labs.length));
    const avgEquip = safeRound(safeDivide(equip.reduce((acc, cur) => acc + cur.utilizationRate, 0), equip.length));

    const totalUsed = activeProfiles.reduce((acc, cur) => acc + cur.usedCapacity, 0);
    const totalCap = activeProfiles.reduce((acc, cur) => acc + cur.totalCapacity, 0);
    const efficiency = safeRound(safeDivide(totalUsed, totalCap) * 100);

    const snapshotId = FirebaseService.generateId('snap');
    const snapshot: ResourceUtilizationSnapshot = {
      id: snapshotId,
      tenantId,
      campusId: defaultCampus,
      timestamp: new Date().toISOString(),
      facultyUtilization: avgFaculty || 75.0,
      roomUtilization: avgRooms || 53.3,
      laboratoryUtilization: avgLabs || 90.0,
      equipmentUtilization: avgEquip || 91.6,
      facilityCapacity: totalCap || 500,
      resourceAllocationEfficiency: efficiency || 72.5,
      unusedCapacity: totalCap - totalUsed,
      overCapacityCount: activeProfiles.filter(p => p.utilizationRate > 95.0).length,
      allocationBacklog: Array.from(this.allocationRequests.values()).filter(r => r.tenantId === tenantId && r.status === 'REQUESTED').length,
      portfolioResourceConsumption: {}
    };

    return snapshot;
  }
}
