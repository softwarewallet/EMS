// Institutional Business Continuity, Disaster Recovery, Crisis Management, Emergency Operations & Enterprise Resilience Governance Engine Types (Phase 7.71)

export type ResilienceMaturityLevel = 'INITIAL' | 'DEVELOPING' | 'DEFINED' | 'MANAGED' | 'OPTIMIZED';

export type ContinuityPlanStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'SUPERSEDED' | 'ARCHIVED';

export type CrisisSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';

export type CrisisLifecycleState = 'DETECTED' | 'ASSESSED' | 'ESCALATED' | 'ACTIVE' | 'CONTAINED' | 'RECOVERY' | 'RESOLVED' | 'POST_REVIEW' | 'CLOSED';

export type ExerciseStatus = 'PLANNED' | 'SCHEDULED' | 'EXECUTED' | 'UNDER_REVIEW' | 'CLOSED';

export type ResilienceRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BCSimulationScenarioType =
  | 'MAJOR_CAMPUS_BLACKOUT'
  | 'REGIONAL_POWER_FAILURE'
  | 'DATA_CENTER_OUTAGE'
  | 'CLOUD_REGION_FAILURE'
  | 'IDENTITY_SERVICE_OUTAGE'
  | 'NETWORK_CORE_FAILURE'
  | 'RANSOMWARE_RECOVERY_EVENT'
  | 'CRITICAL_VENDOR_FAILURE'
  | 'FACILITY_LOSS'
  | 'NATURAL_DISASTER'
  | 'PANDEMIC_WORKFORCE_ABSENCE'
  | 'WATER_SUPPLY_FAILURE'
  | 'TELECOMMUNICATIONS_OUTAGE'
  | 'MULTI_SYSTEM_CASCADING_FAILURE'
  | 'MASS_EVACUATION_EVENT';

export interface ResilienceStrategy {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  version: string;
  timeHorizon: string;
  visionStatement: string;
  pillars: {
    id: string;
    name: string;
    description: string;
    maturityLevel: ResilienceMaturityLevel;
    completionPercentage: number;
  }[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  updatedAt: string;
}

export interface ResilienceObjective {
  id: string;
  tenantId: string;
  campusId: string;
  strategyIdRef: string;
  title: string;
  metricTarget: string;
  currentProgress: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'ACHIEVED';
}

export interface ResiliencePlan {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  ownerIdRef: string;
  status: ContinuityPlanStatus;
  updatedAt: string;
}

export interface ResiliencePolicy {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  code: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'RETIRED';
}

export interface ResilienceMaturityAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  assessmentDate: string;
  assessorIdRef: string;
  dimensions: {
    dimension: string;
    maturityLevel: ResilienceMaturityLevel;
    score: number; // 0-100
    gapAnalysis: string;
  }[];
  overallMaturityScore: number;
}

export interface BusinessContinuityProgram {
  id: string;
  tenantId: string;
  campusId: string;
  programName: string;
  directorIdRef: string;
  scopeDescription: string;
  status: 'ACTIVE' | 'PLANNING' | 'REVIEW';
}

export interface BusinessContinuityPlan {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  departmentIdRef: string;
  ownerIdRef: string;
  version: string;
  status: ContinuityPlanStatus;
  reviewDate: string;
  updatedAt: string;
}

export interface BusinessContinuityPlanVersion {
  id: string;
  tenantId: string;
  planIdRef: string;
  versionNumber: string;
  changesSummary: string;
  approvedByIdRef: string;
  createdAt: string;
}

export interface BusinessImpactAnalysis {
  id: string;
  tenantId: string;
  campusId: string;
  functionIdRef: string;
  lifeSafetyImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  academicImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  researchImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  financialImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  regulatoryImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reputationImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  criticalityScore: number; // 0-100
  recoveryPriority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  rtoHours: number;
  rpoHours: number;
  mtdHours: number;
  status: 'APPROVED' | 'IN_REVIEW' | 'DRAFT';
}

export interface CriticalBusinessFunction {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  departmentIdRef: string;
  ownerIdRef: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

export interface CriticalService {
  id: string;
  tenantId: string;
  campusId: string;
  serviceName: string;
  serviceOwnerIdRef: string;
  technicalDependencyRefs: string[];
  vendorDependencyRefs: string[];
  continuityStatus: 'PROTECTED' | 'PARTIAL' | 'VULNERABLE';
  resilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE';
  spofDetected: boolean;
}

export interface ContinuityRequirement {
  id: string;
  tenantId: string;
  functionIdRef: string;
  requirementDescription: string;
  fulfilled: boolean;
}

export interface ContinuityDependency {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  dependencyType: 'TECHNOLOGY' | 'FACILITY' | 'VENDOR' | 'STAFF' | 'DATA';
  dependencyName: string;
  critical: boolean;
}

export interface ContinuityStrategy {
  id: string;
  tenantId: string;
  biaIdRef: string;
  strategyDescription: string;
  estimatedCost: number;
}

export interface RecoveryObjective {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  rtoTargetHours: number;
  rpoTargetHours: number;
  mtdTargetHours: number;
  status: 'ALIGNED' | 'UNALIGNED';
}

export interface RTOReference {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  rtoHours: number;
}

export interface RPOReference {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  rpoHours: number;
}

export interface MaximumTolerableDowntimeReference {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  mtdHours: number;
}

export interface RecoveryPriority {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
}

export interface DisasterRecoveryPlan {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  systemIdRef: string;
  ownerIdRef: string;
  version: string;
  status: ContinuityPlanStatus;
  updatedAt: string;
}

export interface DisasterRecoveryPlanVersion {
  id: string;
  tenantId: string;
  drPlanIdRef: string;
  version: string;
  notes: string;
}

export interface RecoveryCapability {
  id: string;
  tenantId: string;
  systemIdRef: string;
  capabilityType: 'HOT_SITE' | 'WARM_SITE' | 'COLD_SITE' | 'CLOUD_REPLICATION';
  readinessScore: number;
}

export interface RecoveryDependency {
  id: string;
  tenantId: string;
  systemIdRef: string;
  dependentSystemIdRef: string;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RecoverySiteReference {
  id: string;
  tenantId: string;
  siteName: string;
  location: string;
  capacityPercentage: number;
}

export interface BackupRecoveryReference {
  id: string;
  tenantId: string;
  systemIdRef: string;
  backupVaultId: string;
  immutable: boolean;
  lastTestedRestoreDate: string;
}

export interface RecoveryTest {
  id: string;
  tenantId: string;
  campusId: string;
  drPlanIdRef: string;
  testDate: string;
  testerIdRef: string;
  testType: 'TABLETOP' | 'SIMULATION' | 'FULL_FAILOVER';
  status: 'PASSED' | 'FAILED' | 'PARTIAL';
}

export interface RecoveryTestResult {
  id: string;
  tenantId: string;
  testIdRef: string;
  achievedRtoHours: number;
  achievedRpoHours: number;
  successful: boolean;
  notes: string;
}

export interface CrisisGovernanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  severity: CrisisSeverity;
  lifecycleState: CrisisLifecycleState;
  commanderIdRef: string;
  declaredAt: string;
  summary: string;
}

export interface CrisisDecision {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  decisionText: string;
  decisionMakerIdRef: string;
  approverIdRef: string;
  fourEyesVerified: boolean;
  timestamp: string;
}

export interface CrisisEscalation {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  escalatedFrom: string;
  escalatedTo: string;
  reason: string;
  timestamp: string;
}

export interface CrisisCommunicationReference {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  channel: string;
  messagePreview: string;
  sentAt: string;
}

export interface ExecutiveCrisisDecision {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  directive: string;
  executiveIdRef: string;
  approved: boolean;
}

export interface EmergencyOperationsPlan {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  version: string;
  status: ContinuityPlanStatus;
  updatedAt: string;
}

export interface EmergencyOperationsCenterReference {
  id: string;
  tenantId: string;
  campusId: string;
  eocLocationName: string;
  activationStatus: 'STANDBY' | 'ACTIVATED' | 'DEACTIVATED';
  primaryLeadIdRef: string;
}

export interface BCEmergencyExercise {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  exerciseDate: string;
  status: ExerciseStatus;
}

export interface ExerciseScenario {
  id: string;
  tenantId: string;
  exerciseIdRef: string;
  scenarioDescription: string;
}

export interface ExerciseResult {
  id: string;
  tenantId: string;
  exerciseIdRef: string;
  score: number;
  findingsCount: number;
}

export interface EvacuationGovernanceReference {
  id: string;
  tenantId: string;
  buildingIdRef: string;
  assemblyPoint: string;
  capacity: number;
}

export interface ShelterGovernanceReference {
  id: string;
  tenantId: string;
  buildingIdRef: string;
  shelterType: 'SEVERE_WEATHER' | 'HAZMAT' | 'SECURITY';
  maxCapacity: number;
}

export interface EmergencyResourceReference {
  id: string;
  tenantId: string;
  resourceName: string;
  category: string;
  quantityAvailable: number;
  locationRef: string;
}

export interface IncidentCommandStructure {
  id: string;
  tenantId: string;
  campusId: string;
  incidentName: string;
  commanderIdRef: string;
  safetyOfficerIdRef: string;
  operationsSectionChiefIdRef: string;
  planningSectionChiefIdRef: string;
  logisticsSectionChiefIdRef: string;
  financeSectionChiefIdRef: string;
  active: boolean;
}

export interface CommandRoleAssignment {
  id: string;
  tenantId: string;
  icsIdRef: string;
  roleName: string;
  assigneeIdRef: string;
  delegatedAuthority: boolean;
}

export interface CrisisDelegation {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  fromIdRef: string;
  toIdRef: string;
  scope: string;
  expiresAt: string;
}

export interface EmergencyAuthorityReference {
  id: string;
  tenantId: string;
  roleTitle: string;
  authorityScope: string;
}

export interface ResilienceDependency {
  id: string;
  tenantId: string;
  sourceAssetId: string;
  targetAssetId: string;
  dependencyType: string;
  critical: boolean;
}

export interface SinglePointOfFailure {
  id: string;
  tenantId: string;
  campusId: string;
  assetIdRef: string;
  assetName: string;
  assetType: string;
  impactDescription: string;
  mitigated: boolean;
}

export interface CriticalDependency {
  id: string;
  tenantId: string;
  serviceIdRef: string;
  dependencyRef: string;
}

export interface DependencyConcentrationObservation {
  id: string;
  tenantId: string;
  concentrationType: string;
  affectedServicesCount: number;
  riskLevel: ResilienceRiskLevel;
}

export interface InterdependencyRisk {
  id: string;
  tenantId: string;
  sourceSystemId: string;
  targetSystemId: string;
  riskDescription: string;
}

export interface ResilienceRisk {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  category: string;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  riskLevel: ResilienceRiskLevel;
  ownerIdRef: string;
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED';
}

export interface ContinuityRisk {
  id: string;
  tenantId: string;
  planIdRef: string;
  riskDescription: string;
}

export interface RecoveryRisk {
  id: string;
  tenantId: string;
  systemIdRef: string;
  riskDescription: string;
}

export interface ResidualResilienceRisk {
  id: string;
  tenantId: string;
  riskIdRef: string;
  residualScore: number;
  acceptedByRef: string;
}

export interface BCRiskTreatmentPlan {
  id: string;
  tenantId: string;
  riskIdRef: string;
  mitigationActions: string;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface ContinuityExercise {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  exerciseDate: string;
  status: ExerciseStatus;
}

export interface RecoveryExercise {
  id: string;
  tenantId: string;
  exerciseIdRef: string;
  targetSystemIdRef: string;
  success: boolean;
}

export interface TabletopExercise {
  id: string;
  tenantId: string;
  title: string;
  scenarioRef: string;
  participantCount: number;
}

export interface TechnicalRecoveryExercise {
  id: string;
  tenantId: string;
  systemIdRef: string;
  recoveryTimeAchievedMinutes: number;
}

export interface ExerciseFinding {
  id: string;
  tenantId: string;
  exerciseIdRef: string;
  findingDescription: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
}

export interface ExerciseCorrectiveAction {
  id: string;
  tenantId: string;
  findingIdRef: string;
  actionOwnerIdRef: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface ThirdPartyContinuityAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  vendorIdRef: string;
  vendorName: string;
  continuityAssessed: boolean;
  score: number;
  status: 'APPROVED' | 'CONDITIONAL' | 'RESTRICTED';
}

export interface SupplierContinuityReference {
  id: string;
  tenantId: string;
  vendorIdRef: string;
  hasContinuityPlan: boolean;
}

export interface SupplierConcentrationRisk {
  id: string;
  tenantId: string;
  supplierCategory: string;
  riskLevel: ResilienceRiskLevel;
}

export interface ExternalDependencyRisk {
  id: string;
  tenantId: string;
  dependencyName: string;
  exposureScore: number;
}

export interface EmergencyCommunicationGovernance {
  id: string;
  tenantId: string;
  campusId: string;
  planTitle: string;
  channels: string[];
  approvedByIdRef: string;
  status: 'ACTIVE' | 'DRAFT';
}

export interface CommunicationPlan {
  id: string;
  tenantId: string;
  title: string;
  targetAudience: string;
}

export interface StakeholderCommunicationReference {
  id: string;
  tenantId: string;
  stakeholderGroup: string;
  notificationMethod: string;
}

export interface CommunicationReadinessAssessment {
  id: string;
  tenantId: string;
  readinessScore: number;
  lastTestedDate: string;
}

export interface ContinuityApproval {
  id: string;
  tenantId: string;
  planIdRef: string;
  approverIdRef: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  timestamp: string;
}

export interface RecoveryApproval {
  id: string;
  tenantId: string;
  drPlanIdRef: string;
  approverIdRef: string;
  status: 'APPROVED' | 'REJECTED';
}

export interface CrisisApproval {
  id: string;
  tenantId: string;
  crisisIdRef: string;
  approverIdRef: string;
  status: 'APPROVED' | 'REJECTED';
}

export interface ResilienceDecision {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  decisionMakerIdRef: string;
  rationale: string;
  timestamp: string;
}

export interface ResilienceException {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  requesterIdRef: string;
  approverIdRef: string;
  justification: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  expiresAt: string;
}

export interface ResilienceAuditEvent {
  id: string;
  tenantId: string;
  campusId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  reason: string;
  previousHash?: string;
  currentHash: string;
}

export interface BCDiagnosticFinding {
  id: string;
  tenantId: string;
  campusId: string;
  category: 'BIA' | 'CONTINUITY_PLAN' | 'DISASTER_RECOVERY' | 'CRISIS' | 'SPOF' | 'EXERCISE' | 'THIRD_PARTY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  remediationRecommendation: string;
}

export interface BCSimulationResult {
  scenarioType: BCSimulationScenarioType;
  scenarioName: string;
  description: string;
  serviceExposureScore: number;
  recoveryBottlenecks: string[];
  dependencyConcentration: string[];
  estimatedImpact: number;
  resiliencePosture: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'CRITICAL_EXPOSURE';
  mitigationOpportunities: string[];
}
