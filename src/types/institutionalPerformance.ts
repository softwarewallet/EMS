import { UserActor } from './index';

export type StrategicPlanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export type KPIStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export type MeasurementStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'APPROVED' | 'LOCKED';

export type KPIDirectionality = 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'TARGET_BAND';

export type PerformanceRiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CorrectiveActionStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CLOSED';

export interface StrategicPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  periodStart: string;
  periodEnd: string;
  status: StrategicPlanStatus;
  version: number;
  vision?: string;
  mission?: string;
  values?: string[];
  documentRegistryId?: string;
  approvedBy?: string;
  approvedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface StrategicObjective {
  id: string;
  tenantId: string;
  campusId?: string;
  planId: string;
  code: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  weight: number; // For aggregate calculations
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalGoal {
  id: string;
  tenantId: string;
  campusId?: string;
  objectiveId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED';
  createdAt: string;
  updatedAt: string;
}

export interface StrategicInitiative {
  id: string;
  tenantId: string;
  campusId?: string;
  objectiveId: string;
  title: string;
  description: string;
  ownerId: string; // Staff ID
  departmentId: string;
  startDate: string;
  endDate: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budgetReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPIDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  description: string;
  unit: string;
  calculationMethod: string;
  directionality: KPIDirectionality;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY';
  ownerId: string; // Staff ID
  departmentId: string;
  dataSourceReference?: string;
  targetType: 'NUMERIC' | 'PERCENTAGE' | 'CURRENCY';
  status: KPIStatus;
  version: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface KPITarget {
  id: string;
  tenantId: string;
  campusId?: string;
  kpiId: string;
  academicYearId: string;
  periodLabel: string; // e.g. "Q1 2024"
  targetValue: number;
  thresholds?: {
    warning: number;
    critical: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KPIMeasurement {
  id: string;
  tenantId: string;
  campusId?: string;
  kpiId: string;
  targetId: string;
  actualValue: number;
  measurementDate: string;
  status: MeasurementStatus;
  notes?: string;
  evidenceDocumentId?: string;
  submittedBy: string;
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  achievementPercentage: number; // Derived
  weightedScore: number; // Derived
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceRisk {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  probability: number; // 1-5
  impact: number; // 1-5
  severityScore: number; // probability * impact
  severity: PerformanceRiskSeverity;
  status: 'IDENTIFIED' | 'MITIGATED' | 'REALIZED' | 'CLOSED';
  ownerId: string;
  relatedEntityId?: string; // StrategicPlan, Objective, Initiative, or KPI
  createdAt: string;
  updatedAt: string;
}

export interface CorrectiveAction {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  sourceType: 'KPI_UNDERPERFORMANCE' | 'RISK_MITIGATION' | 'STRATEGY_REVIEW';
  sourceId: string;
  ownerId: string;
  dueDate: string;
  status: CorrectiveActionStatus;
  evidenceDocumentId?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalPerformanceAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  overallScore: number;
  objectiveCompletionRate: number;
  kpiAchievementRate: number;
  initiativeProgress: number;
  riskHeatmap: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastUpdated: string;
}
