// EMS Phase 7.44 — IT Service Management, Digital Operations & Service Delivery Governance Engine
// Comprehensive Types & Domain Models

export type ServiceCriticality = 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'OPERATIONAL' | 'LOW';

export type ServiceStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';

export type ServiceCategory = 'infrastructure' | 'academic' | 'administrative' | 'student_support' | 'security' | 'other';

export interface ITServiceDefinition {
  id: string;
  tenantId: string;
  campusIds: string[];
  name: string;
  code: string;
  description: string;
  version: string;
  category: ServiceCategory;
  serviceHours: string;
  criticality: ServiceCriticality;
  status: ServiceStatus;
  ownerId: string; // Staff ID
  businessOwnerId: string; // Staff ID
  technicalOwnerId: string; // Staff ID
  supportModel: string;
  continuityClassification: string;
  securityClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  slaId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ServiceVersion {
  id: string;
  serviceId: string;
  version: string;
  description: string;
  changelog: string;
  status: 'draft' | 'approved' | 'deprecated';
  publishedAt: string;
  publishedBy: string;
}

export interface ServiceOffering {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  cost: number;
  tier: string;
  status: 'active' | 'inactive';
}

export interface ITSMServiceDependency {
  id: string;
  serviceId: string;
  dependsOnServiceId: string;
  dependencyType: 'hard' | 'soft' | 'infrastructure' | 'external';
  criticality: ServiceCriticality;
  status: 'active' | 'broken';
}

export interface ServiceOwner {
  id: string;
  staffId: string;
  role: 'owner' | 'business' | 'technical';
}

export interface ServiceInstance {
  id: string;
  serviceId: string;
  name: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'online' | 'degraded' | 'offline' | 'maintenance';
  url?: string;
  hostInfo?: string;
}

export interface ServiceAvailabilityRecord {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  uptimeMinutes: number;
  downtimeMinutes: number;
  plannedDowntimeMinutes: number;
  unplannedDowntimeMinutes: number;
  availabilityPercentage: number;
  incidentCount: number;
}

export interface ITSMServiceHealthSnapshot {
  id: string;
  serviceId: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'MAINTENANCE';
  timestamp: string;
  metrics: {
    responseTimeMs?: number;
    cpuUtilization?: number;
    memoryUtilization?: number;
    errorRatePercentage?: number;
  };
  activeIncidentsCount: number;
  activeProblemsCount: number;
}

export interface ServiceMaintenanceWindow {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  changeRequestId?: string;
}

export interface ServiceLevelAgreement {
  id: string;
  name: string;
  description: string;
  serviceHours: string;
  responseSlaMinutes: number;
  resolutionSlaMinutes: number;
  availabilitySlaPercentage: number;
  status: 'active' | 'draft' | 'retired';
}

export interface ServiceLevelObjective {
  id: string;
  slaId: string;
  metricName: string;
  targetValue: number;
  status: 'active' | 'inactive';
}

export interface ServiceLevelMeasurement {
  id: string;
  serviceId: string;
  month: number;
  year: number;
  actualAvailability: number;
  responseSlaCompliance: number; // %
  resolutionSlaCompliance: number; // %
  breachCount: number;
  mttrMinutes: number;
  mttaMinutes: number;
}

export type IncidentClassification = 'software' | 'hardware' | 'network' | 'security' | 'access' | 'database' | 'other';
export type IncidentPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'NEW' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export interface ITIncident {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  description: string;
  classification: IncidentClassification;
  priority: IncidentPriority;
  impact: 1 | 2 | 3 | 4; // High (1) to Low (4)
  urgency: 1 | 2 | 3 | 4; // High (1) to Low (4)
  status: IncidentStatus;
  serviceId: string;
  reporterId: string; // staff or student ID
  affectedUserId?: string;
  assignedToStaffId?: string; // staff ID
  assignedToTeamId?: string;
  slaResponseDeadline?: string;
  slaResolutionDeadline?: string;
  mttaTimestamp?: string;
  mttrTimestamp?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  closedAt?: string;
  closedBy?: string;
  closureEvidence?: string;
  rcaRequired: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface IncidentAssignment {
  incidentId: string;
  staffId: string;
  teamId: string;
  assignedAt: string;
}

export interface ITSMIncidentTimelineEvent {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  eventType: 'create' | 'triage' | 'assign' | 'escalate' | 'status_change' | 'comment' | 'resolve' | 'close';
  timestamp: string;
  actorId: string;
  actorDisplayName: string;
}

export interface MajorIncident {
  id: string;
  incidentId: string;
  declaredBy: string;
  declaredAt: string;
  commanderId: string; // Staff ID
  reason: string;
  commandChannelUrl?: string;
  status: 'active' | 'resolved' | 'closed';
  resolutionSummary?: string;
  reviewCompletedAt?: string;
}

export interface MajorIncidentReview {
  id: string;
  majorIncidentId: string;
  completedBy: string;
  completedAt: string;
  timelines: { phase: string; start: string; end: string }[];
  lessonsLearned: string[];
  preventiveActions: string[];
}

export type ITSMRequestStatus = 'REQUESTED' | 'VALIDATED' | 'APPROVAL_PENDING' | 'APPROVED' | 'FULFILLING' | 'COMPLETED' | 'CLOSED' | 'REJECTED';
export type RequestType = 'access_provision' | 'hardware_provision' | 'software_install' | 'data_export' | 'system_config' | 'other';

export interface RequestCatalogItem {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  requestType: RequestType;
  isPrivileged: boolean;
  cost: number;
  approvalWorkflowRequired: boolean;
}

export interface ServiceRequest {
  id: string;
  tenantId: string;
  campusId: string;
  requesterId: string;
  beneficiaryId: string;
  catalogItemId: string;
  requestData: Record<string, any>;
  status: ITSMRequestStatus;
  assignedToId?: string;
  approvedBy?: string;
  approvedAt?: string;
  fulfilledAt?: string;
  closedAt?: string;
  slaDeadline?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface RequestFulfillmentStep {
  id: string;
  requestId: string;
  stepName: string;
  sequence: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  assignedToId?: string;
  completedAt?: string;
  completedBy?: string;
  comments?: string;
}

export interface RequestApproval {
  id: string;
  requestId: string;
  stepName: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionDate?: string;
  comments?: string;
}

export type ProblemStatus = 'IDENTIFIED' | 'ANALYSIS' | 'ROOT_CAUSE_CONFIRMED' | 'WORKAROUND_AVAILABLE' | 'RESOLUTION_PLANNED' | 'RESOLVED' | 'CLOSED';

export interface ITProblem {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  serviceId: string;
  status: ProblemStatus;
  priority: 'high' | 'medium' | 'low';
  workaround?: string;
  resolution?: string;
  rootCauseAnalysisId?: string;
  affectedIncidentIds: string[];
  knownErrorId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface RootCauseAnalysis {
  id: string;
  problemId: string;
  causalAnalysisType: '5_whys' | 'fishbone' | 'causal_chain';
  fiveWhys?: string[];
  fishboneCategories?: Record<string, string[]>;
  conclusion: string;
  preventiveActions: string[];
  completedBy: string;
  completedAt: string;
}

export interface KnownError {
  id: string;
  title: string;
  description: string;
  serviceId: string;
  workaround: string;
  status: 'active' | 'resolved';
}

export interface ProblemWorkaround {
  problemId: string;
  description: string;
  stepByStep: string;
  authorId: string;
  createdAt: string;
}

export interface ProblemResolution {
  problemId: string;
  permanentResolution: string;
  implementationPlanId?: string;
  resolvedBy: string;
  resolvedAt: string;
}

export type ChangeType = 'normal' | 'standard' | 'emergency';
export type ChangeRiskLevel = 'high' | 'medium' | 'low';
export type ChangeStatus = 'DRAFT' | 'ASSESSMENT' | 'CAB_REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTING' | 'VALIDATION' | 'COMPLETED' | 'FAILED' | 'ROLLBACK' | 'REVIEW';

export interface ITChangeRequest {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  description: string;
  type: ChangeType;
  serviceId: string;
  riskLevel: ChangeRiskLevel;
  status: ChangeStatus;
  justification: string;
  affectedServices: string[];
  implementationPlan: string;
  validationPlan: string;
  rollbackPlan: string;
  maintenanceWindowId?: string;
  requesterId: string;
  approverIds: string[];
  cabReviewNotes?: string;
  cabReviewDate?: string;
  completedAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface ChangeAssessment {
  id: string;
  changeRequestId: string;
  riskScore: number;
  conflictDetected: boolean;
  conflictingChangeIds: string[];
  dependencyCollisions: string[];
  assessorId: string;
  assessedAt: string;
}

export interface ChangeApproval {
  id: string;
  changeRequestId: string;
  approverId: string;
  status: 'approved' | 'rejected';
  comment?: string;
  updatedAt: string;
}

export interface ChangeImplementation {
  id: string;
  changeRequestId: string;
  implementerId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  logs?: string;
}

export interface ChangeValidation {
  id: string;
  changeRequestId: string;
  validatorId: string;
  status: 'passed' | 'failed';
  validationResult: string;
  comments?: string;
}

export interface ChangeRollbackPlan {
  changeRequestId: string;
  steps: string[];
  estimatedDurationMinutes: number;
  backupLocation?: string;
}

export interface ChangeReview {
  id: string;
  changeRequestId: string;
  reviewerId: string;
  success: boolean;
  reviewNotes: string;
  reviewDate: string;
}

export type ReleaseStatus = 'PLANNED' | 'APPROVED' | 'READY' | 'DEPLOYING' | 'VALIDATING' | 'RELEASED' | 'ROLLED_BACK';

export interface ITRelease {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: ReleaseStatus;
  releaseNotes: string;
  changeRequestId: string;
  affectedServiceIds: string[];
  createdAt: string;
  createdBy: string;
}

export interface ReleaseComponent {
  id: string;
  releaseId: string;
  name: string;
  version: string;
  type: 'frontend' | 'backend' | 'database' | 'infrastructure';
  status: 'pending' | 'deployed' | 'failed';
}

export interface DeploymentRecord {
  id: string;
  releaseId: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'pending' | 'deploying' | 'completed' | 'failed' | 'rolled_back';
  initiatedBy: string;
  initiatedAt: string;
  completedAt?: string;
  rollbackTriggered: boolean;
}

export interface DeploymentValidation {
  id: string;
  deploymentRecordId: string;
  validatorId: string;
  passed: boolean;
  validationLogs: string;
  validatedAt: string;
}

export interface SLAEvent {
  id: string;
  tenantId: string;
  serviceId: string;
  incidentId?: string;
  requestId?: string;
  type: 'response' | 'resolution';
  deadline: string;
  completedAt?: string;
  isBreached: boolean;
  breachSeverity: 'low' | 'medium' | 'high';
}

export interface SLAComplianceSnapshot {
  id: string;
  tenantId: string;
  date: string;
  serviceId: string;
  slaId: string;
  complianceRate: number;
  breachCount: number;
  averageResponseTime: number;
  averageResolutionTime: number;
}

export interface ServicePerformanceMetric {
  id: string;
  serviceId: string;
  metricName: string;
  metricValue: number;
  timestamp: string;
}

export interface ServiceBreach {
  id: string;
  slaEventId: string;
  serviceId: string;
  reason: string;
  costImpact: number;
  remediationPlan: string;
}

export interface ServiceCreditOrRemediation {
  id: string;
  breachId: string;
  serviceId: string;
  targetGroupId: string;
  calculationDetails: string;
  creditAmount: number;
}

export interface TechnologyContinuityPlan {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  recoveryStrategy: string;
  rtoMinutes: number;
  rpoMinutes: number;
  associatedBcpPlanId?: string;
  status: 'active' | 'testing' | 'inactive';
}

export interface ServiceRecoveryObjective {
  id: string;
  planId: string;
  serviceId: string;
  rtoTargetMinutes: number;
  rpoTargetMinutes: number;
  status: 'compliant' | 'breached';
}

export interface ServiceRecoveryExercise {
  id: string;
  planId: string;
  date: string;
  type: 'simulation' | 'drill' | 'tabletop';
  scope: string;
  success: boolean;
  executionLog: string;
  completedBy: string;
}

export interface ITSMTechnologyDependency {
  id: string;
  serviceId: string;
  assetId?: string;
  integrationId?: string;
  dependencyType: 'hardware' | 'software' | 'network' | 'integration' | 'cloud';
}

export interface DigitalServiceRecoveryRecord {
  id: string;
  serviceId: string;
  downtimeMinutes: number;
  backupRestoredSuccessfully: boolean;
  rtoCompliance: boolean;
  rpoCompliance: boolean;
  completedAt: string;
}

export interface ServiceGovernanceReview {
  id: string;
  tenantId: string;
  serviceId: string;
  reviewDate: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'action_required';
  securityReviewPassed: boolean;
  riskAssessmentScore: number;
  reviewerId: string;
  actionItems: string[];
}

export interface ServiceRiskRecord {
  id: string;
  tenantId: string;
  serviceId: string;
  riskDescription: string;
  riskId: string; // External risk ID from Phase 7.31
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'mitigated' | 'accepted';
}

export interface OperationalControl {
  id: string;
  tenantId: string;
  controlName: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  ownerId: string;
  lastRunDate: string;
  controlResult: 'passed' | 'failed';
  status: 'active' | 'inactive';
}

export interface ITSMDataQualityIssue {
  id: string;
  tenantId: string;
  issueType: string;
  description: string;
  affectedRecordId: string;
  affectedRecordType: string;
  detectedAt: string;
  status: 'open' | 'resolved';
  severity: 'high' | 'medium' | 'low';
}

export interface ITSMAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  action: string;
  actorId: string;
  actorDisplayName: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  details: string;
}
