// EMS Phase 7.41 — Institutional Resource Planning, Capacity, Allocation & Enterprise Portfolio Governance Engine Types

export type ResourceCategory =
  | 'HUMAN'
  | 'FACILITY'
  | 'ROOM'
  | 'LABORATORY'
  | 'EQUIPMENT'
  | 'TECHNOLOGY'
  | 'FINANCIAL'
  | 'ACADEMIC'
  | 'OPERATIONAL'
  | 'PROJECT'
  | 'OTHER';

export type ResourcePlanStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'SUPERSEDED';

export type AllocationRequestStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ALLOCATED'
  | 'PARTIALLY_ALLOCATED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CLOSED';

export type PortfolioItemStatus =
  | 'PROPOSED'
  | 'REVIEW'
  | 'PRIORITIZED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type PriorityBand = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ConstraintSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DataQualitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AuditMetadata {
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
  sessionTokenId?: string;
}

export interface ResourcePlan {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  fiscalYear: string;
  description: string;
  startDate: string;
  endDate: string;
  category: ResourceCategory;
  totalEstimatedCost: number;
  totalAllocatedCost: number;
  status: ResourcePlanStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  justification?: string;
  auditMetadata?: AuditMetadata;
}

export interface ResourcePlanVersion {
  id: string;
  tenantId: string;
  resourcePlanId: string;
  versionNumber: number;
  snapshotData: string; // Serialized plan data for immutability
  createdBy: string;
  createdAt: string;
  changeSummary: string;
}

export interface ResourceCapacityProfile {
  id: string;
  tenantId: string;
  campusId?: string;
  resourceId: string; // References authoritative resource: room, lab, asset, teacher/staff ID
  resourceName: string;
  category: ResourceCategory;
  totalCapacity: number; // Max capacity or work-hours
  usedCapacity: number;
  availableCapacity: number;
  utilizationRate: number; // (usedCapacity / totalCapacity) * 100
  unitOfMeasure: string; // hours, seats, units
  status: 'ACTIVE' | 'INACTIVE';
  lastCheckedAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceDemandForecast {
  id: string;
  tenantId: string;
  campusId?: string;
  resourceCategory: ResourceCategory;
  sourcePeriodStart: string;
  sourcePeriodEnd: string;
  forecastPeriodStart: string;
  forecastPeriodEnd: string;
  historicalObservationsCount: number;
  forecastedDemand: number;
  methodology: 'MOVING_AVERAGE' | 'WEIGHTED_MOVING_AVERAGE' | 'HISTORICAL_TREND' | 'SEASONAL_COMPARISON';
  forecastVersion: number;
  createdBy: string;
  createdAt: string;
  status: 'ACTIVE' | 'SUPERSEDED';
}

export interface ResourceAllocationRequest {
  id: string;
  tenantId: string;
  campusId?: string;
  portfolioItemId?: string; // References portfolio item or project
  resourceCategory: ResourceCategory;
  resourceId?: string; // Optional specific target
  requestedQuantity: number;
  requiredStartDate: string;
  requiredEndDate: string;
  justification: string;
  priority: PriorityBand;
  requesterId: string;
  status: AllocationRequestStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceAllocationDecision {
  id: string;
  tenantId: string;
  requestId: string;
  approverId: string;
  decision: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
  allocatedQuantity: number;
  justification: string;
  decidedAt: string;
}

export interface ResourceAllocation {
  id: string;
  tenantId: string;
  campusId?: string;
  requestId: string;
  resourceId: string; // The specific allocated resource (room, asset, staff ID)
  resourceCategory: ResourceCategory;
  allocatedQuantity: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'RELEASED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceUtilizationSnapshot {
  id: string;
  tenantId: string;
  campusId?: string;
  timestamp: string;
  facultyUtilization: number;
  roomUtilization: number;
  laboratoryUtilization: number;
  equipmentUtilization: number;
  facilityCapacity: number;
  resourceAllocationEfficiency: number;
  unusedCapacity: number;
  overCapacityCount: number;
  allocationBacklog: number;
  portfolioResourceConsumption: Record<string, number>;
}

export interface ResourceConstraint {
  id: string;
  tenantId: string;
  campusId?: string;
  severity: ConstraintSeverity;
  source: 'CAPACITY_SHORTAGE' | 'STAFF_OVERLOAD' | 'FACILITY_SATURATION' | 'EQUIPMENT_SHORTAGE' | 'BUDGET_CONSTRAINT' | 'TIMELINE_CONFLICT' | 'DEPENDENCY_CONFLICT' | 'CAMPUS_CONSTRAINT' | 'REGULATORY_CONSTRAINT' | 'STRATEGIC_CONFLICT';
  affectedResourceCategory: ResourceCategory;
  affectedResourceId?: string;
  affectedPortfolioItemId?: string;
  detectedAt: string;
  details: string;
  status: 'UNRESOLVED' | 'RESOLVED' | 'BYPASSED';
  resolutionReference?: string;
}

export interface CapacityThreshold {
  id: string;
  tenantId: string;
  resourceCategory: ResourceCategory;
  warningPercentage: number;
  criticalPercentage: number;
  alertRecipients: string[]; // Email list
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ResourcePriorityRule {
  id: string;
  tenantId: string;
  resourceCategory: ResourceCategory;
  weightStrategicAlignment: number;
  weightUrgency: number;
  weightInstitutionalImpact: number;
  weightStudentImpact: number;
  weightRiskReduction: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  proposerId: string;
  strategicObjectiveId?: string; // References Phase 7.29 Strategic Objective
  kpiId?: string; // References Phase 7.29 KPI
  riskId?: string; // References Phase 7.31 Risk
  workflowId?: string; // References Phase 7.37 Workflow / Project
  qualityInitiativeId?: string; // References Phase 7.34 Quality initiative
  accreditationCommitmentId?: string; // References Phase 7.35 Commitment
  budgetCode?: string; // Authoritative Finance context
  estimatedTotalBudget: number;
  status: PortfolioItemStatus;
  priorityScore: number;
  priorityBand: PriorityBand;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPriorityScore {
  id: string;
  tenantId: string;
  portfolioItemId: string;
  strategicAlignment: number; // 1-10
  urgency: number; // 1-10
  institutionalImpact: number; // 1-10
  regulatoryRequirement: number; // 1-10
  studentImpact: number; // 1-10
  operationalCriticality: number; // 1-10
  riskReduction: number; // 1-10
  resourceEfficiency: number; // 1-10
  calculatedScore: number; // Weighted output
  weightingVersion: string;
  calculatedAt: string;
}

export interface PortfolioReview {
  id: string;
  tenantId: string;
  portfolioItemId: string;
  reviewerId: string;
  reviewDate: string;
  evaluationNotes: string;
  recommendation: 'APPROVE' | 'REJECT' | 'HOLD' | 'REVISE';
  status: 'PENDING' | 'COMPLETED';
}

export interface PortfolioDecision {
  id: string;
  tenantId: string;
  portfolioItemId: string;
  decisionMakerId: string;
  decision: 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'DEFERRED';
  justification: string;
  decidedAt: string;
}

export interface ResourceIntervention {
  id: string;
  tenantId: string;
  campusId?: string;
  resourceId: string;
  resourceCategory: ResourceCategory;
  triggerConstraintId: string;
  interventionType: 'CAPACITY_REALLOCATION' | 'ACQUISITION_ACCELERATION' | 'WORKLOAD_SHEDDING' | 'SCHEDULE_REFACTOR' | 'EMERGENCY_BUDGET';
  description: string;
  status: 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  closedBy?: string;
  closedAt?: string;
  closureReport?: string;
}

export interface ResourceOptimizationAction {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  opportunityType: 'UNDER_UTILIZATION' | 'OVER_ALLOCATION' | 'COST_SAVING';
  potentialSavings: number;
  recommendedAction: string;
  status: 'PROPOSED' | 'IMPLEMENTED' | 'DISMISSED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceScenario {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  assumptions: {
    enrollmentChangePercentage?: number;
    staffReductionPercentage?: number;
    newCampusAdded?: boolean;
    facilityExpanded?: boolean;
    budgetReductionPercentage?: number;
  };
  createdBy: string;
  createdAt: string;
}

export interface ResourceScenarioResult {
  id: string;
  tenantId: string;
  scenarioId: string;
  simulationOutputs: {
    estimatedHumanDemandDelta: number;
    estimatedFacilityDemandDelta: number;
    resultingConstraintsCount: number;
    budgetVariance: number;
  };
  certifiedBy?: string;
  certifiedAt?: string;
  status: 'DRAFT' | 'CERTIFIED';
}

export interface ResourceDataQualityIssue {
  id: string;
  tenantId: string;
  campusId?: string;
  severity: DataQualitySeverity;
  issueType:
    | 'ORPHAN_RESOURCE_REFERENCE'
    | 'INVALID_TENANT_REFERENCE'
    | 'INVALID_CAMPUS_REFERENCE'
    | 'STALE_CAPACITY_DATA'
    | 'DUPLICATE_ALLOCATION'
    | 'NEGATIVE_CAPACITY'
    | 'IMPOSSIBLE_UTILIZATION'
    | 'MISSING_OWNERSHIP'
    | 'MISSING_CLASSIFICATION'
    | 'MISSING_APPROVAL'
    | 'EXPIRED_ALLOCATION'
    | 'INACTIVE_RESOURCE'
    | 'BROKEN_PORTFOLIO_REFERENCE';
  entityType: string;
  entityId: string;
  detectedAt: string;
  details: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'WAIVED';
  remediationWorkflowId?: string;
}

export interface ResourceGovernanceReview {
  id: string;
  tenantId: string;
  reviewerId: string;
  reviewTargetType: 'PLAN' | 'PORTFOLIO' | 'ALLOCATION' | 'SCENARIO';
  reviewTargetId: string;
  complianceRating: 'COMPLIANT' | 'MINOR_NON_COMPLIANCE' | 'NON_COMPLIANT';
  certificationSignature: string;
  certifiedAt: string;
  status: 'COMPLETED';
}
