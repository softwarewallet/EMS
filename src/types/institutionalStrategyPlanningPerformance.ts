/**
 * EMS Phase 11.17: Institutional Strategy, Planning, Performance & Quality Operations
 * Authoritative strongly typed domain models.
 */

export type StrategyLifecycleStatus =
  | 'DRAFT'
  | 'UNDER_DEVELOPMENT'
  | 'CONSULTATION'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type KPIStatus =
  | 'NOT_STARTED'
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'OFF_TRACK'
  | 'ACHIEVED'
  | 'EXCEEDED'
  | 'INSUFFICIENT_DATA';

export type QualityReviewStatus =
  | 'PLANNED'
  | 'OPEN'
  | 'SELF_ASSESSMENT'
  | 'EVIDENCE_REVIEW'
  | 'FINDINGS'
  | 'ACTION_PLANNING'
  | 'VERIFICATION'
  | 'CLOSED';

export type AccreditationEvidenceStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

export type FindingSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FindingStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'ACTION_REQUIRED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'CLOSED';

export type CAPAStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'CLOSED'
  | 'OVERDUE';

export interface InstitutionalStrategy {
  strategyId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  description: string;
  cycleIdRef: string;
  version: string;
  status: StrategyLifecycleStatus;
  ownerUserIdRef: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyCycle {
  cycleId: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
}

export interface StrategicObjective {
  objectiveId: string;
  strategyIdRef: string;
  tenantId: string;
  title: string;
  description: string;
  parentObjectiveIdRef?: string; // For hierarchy
  ownerUserIdRef: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface KPIDefinition {
  kpiId: string;
  tenantId: string;
  objectiveIdRef: string;
  title: string;
  measurementMethod: 'COUNT' | 'SUM' | 'AVERAGE' | 'RATE' | 'PERCENTAGE' | 'RATIO' | 'SCORE' | 'MILESTONE_COMPLETION';
  unit: string;
  directionality: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'TARGET_RANGE';
  reportingFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  ownerUserIdRef: string;
}

export interface KPITarget {
  targetId: string;
  kpiIdRef: string;
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  targetValue: number;
  thresholdValue: number;
}

export interface KPIMeasurement {
  measurementId: string;
  kpiIdRef: string;
  tenantId: string;
  periodIdRef: string; // targetId
  actualValue: number;
  variance: number;
  achievementPercentage: number;
  status: KPIStatus;
  measuredAt: string;
  measuredByUserIdRef: string;
}

export interface AccreditationFramework {
  frameworkId: string;
  tenantId: string;
  title: string;
  authority: string;
  cycleEndDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface EvidenceReference {
  evidenceId: string;
  tenantId: string;
  sourceModule: string;
  sourceEntityIdRef: string;
  evidenceType: string;
  capturedAt: string;
  capturedByUserIdRef: string;
  immutableSnapshotHash: string;
  status: AccreditationEvidenceStatus;
  acceptedByUserIdRef?: string;
}

export interface ReviewFinding {
  findingId: string;
  tenantId: string;
  reviewIdRef: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  discoveredAt: string;
  closedAt?: string;
}

export interface CorrectiveActionPlan {
  capaId: string;
  tenantId: string;
  findingIdRef: string;
  title: string;
  actionOwnerUserIdRef: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: CAPAStatus;
  submittedForVerificationAt?: string;
  verifiedByUserIdRef?: string;
}

export interface StrategicInitiative {
  initiativeId: string;
  tenantId: string;
  objectiveIdRef: string;
  title: string;
  ownerUserIdRef: string;
  status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budgetRef?: string;
  expectedOutcome: string;
}

export interface PerformanceAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  previousHash: string;
  currentHash: string;
  actorUserIdRef: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  payloadDigest: string;
}

export interface SimulationScenario {
  scenarioId: string;
  scenarioType:
    | 'STRATEGY_TARGET_MISALIGNMENT'
    | 'KPI_DATA_GAP'
    | 'KPI_TARGET_FAILURE'
    | 'OBJECTIVE_CASCADE'
    | 'CAMPUS_PERFORMANCE_VARIANCE'
    | 'ACCREDITATION_EVIDENCE_GAP'
    | 'CRITICAL_FINDING_ESCALATION'
    | 'CAPA_OVERDUE_SURGE'
    | 'STRATEGY_REVISION_CONFLICT'
    | 'MASS_KPI_SUBMISSION'
    | 'EVIDENCE_EXPIRY'
    | 'INITIATIVE_DEPENDENCY_FAILURE'
    | 'PERFORMANCE_CERTIFICATION_BLOCK'
    | 'QUALITY_REVIEW_BACKLOG'
    | 'INSTITUTIONAL_PERFORMANCE_STRESS';
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}
