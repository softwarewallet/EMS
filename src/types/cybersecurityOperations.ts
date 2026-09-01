export interface SecurityAssetReference {
  id: string;
  assetType: 'server' | 'workstation' | 'network_device' | 'application' | 'database' | 'integration' | 'user_account';
  assetId: string;
  name: string;
  ipAddress?: string;
  hostname?: string;
  campusId?: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SecurityControlProfile {
  id: string;
  framework: 'ISO27001' | 'NIST_CSF' | 'CIS_CONTROLS' | 'INTERNAL';
  controlNumber: string;
  title: string;
  status: 'IMPLEMENTED' | 'PARTIALLY_IMPLEMENTED' | 'PLANNED' | 'NOT_APPLICABLE';
  lastAssessedDate: string;
}

export interface SecurityTelemetrySource {
  id: string;
  name: string;
  type: 'firewall' | 'edr' | 'iam' | 'dns' | 'cloud_trail' | 'network_sensor';
  status: 'ACTIVE' | 'DEGRADED' | 'DOWN' | 'MAINTENANCE';
  lastEventReceivedAt: string;
  eventRatePerSecond: number;
}

export type SecurityEventStatus = 'OBSERVED' | 'TRIAGED' | 'CORRELATED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';

export interface SecurityEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: SecurityEventStatus;
  telemetrySourceId: string;
  affectedAsset: SecurityAssetReference;
  rawPayload?: string;
  detectedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SecurityEventCorrelation {
  id: string;
  tenantId: string;
  title: string;
  ruleName: string;
  eventIds: string[];
  alertId?: string;
  confidenceScore: number; // 0 - 100
  createdAt: string;
}

export type ThreatIndicatorType = 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'EMAIL' | 'BEHAVIORAL' | 'INFRASTRUCTURE';
export type ThreatIndicatorVerificationStatus = 'UNVERIFIED' | 'VALIDATED' | 'CONFIRMED' | 'FALSE_POSITIVE' | 'EXPIRED' | 'REVOKED';

export interface ThreatIndicator {
  id: string;
  tenantId: string;
  indicatorType: ThreatIndicatorType;
  normalizedValue: string;
  confidence: number; // 0 - 100
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
  firstObservedAt: string;
  lastObservedAt: string;
  expiration: string;
  verificationStatus: ThreatIndicatorVerificationStatus;
  isFalsePositive: boolean;
  classification: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ThreatIntelligenceRecord {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  threatActor?: string;
  indicators: string[]; // ThreatIndicator IDs
  malwareFamilies?: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  createdAt: string;
}

export interface ThreatCampaign {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  objectives?: string[];
  targetSectors?: string[];
  techniquesUsed?: string[]; // MITRE ATT&CK
  status: 'ACTIVE' | 'INACTIVE' | 'MONITORED';
  indicators: string[]; // ThreatIndicator IDs
  createdAt: string;
  createdBy: string;
}

export type SecurityAlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'TRIAGED' | 'ESCALATED' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';

export interface SecurityAlert {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: SecurityAlertStatus;
  detectionSource: string;
  correlationId?: string;
  affectedAsset: SecurityAssetReference;
  confidence: number; // 0 - 100
  slaDeadline: string;
  isEscalated: boolean;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SecurityAlertRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  isEnabled: boolean;
  conditionExpression: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  cooldownMinutes: number;
  createdAt: string;
}

export type SecurityInvestigationStatus = 'OPEN' | 'TRIAGED' | 'INVESTIGATING' | 'FINDINGS_RECORDED' | 'CONTAINMENT_RECOMMENDED' | 'RESOLVED' | 'CLOSED';

export interface SecurityInvestigation {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  status: SecurityInvestigationStatus;
  assignedToId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  alertId?: string;
  findings?: string;
  hypotheses?: string[];
  remediationActionIds?: string[];
  closureReason?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SecurityInvestigationTimelineEvent {
  id: string;
  investigationId: string;
  tenantId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actionType: 'NOTE' | 'EVIDENCE_ADDED' | 'STATUS_CHANGED' | 'PLAYBOOK_EXECUTED' | 'CONTAINMENT_TRIGGERED';
  message: string;
  detailPayload?: string;
}

export interface SecurityIncidentReference {
  id: string;
  incidentId: string; // Authoritative Phase 7.31 or 7.44 incident ID
  relationshipType: 'TRIGGERED_BY' | 'RESOLVED_BY' | 'RELATED';
}

export interface SecurityIncidentResponseAction {
  id: string;
  investigationId: string;
  actionType: 'ISOLATION' | 'REVOCATION' | 'BLOCK' | 'RESTRICTION' | 'CREDENTIAL_RESET';
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'REVERTED';
  target: string;
  executedBy: string;
  executedAt?: string;
}

export interface SecurityRiskObservation {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  inherentRiskScore: number;
  residualRiskScore: number;
  status: 'IDENTIFIED' | 'MITIGATED' | 'ACCEPTED' | 'MONITORED';
  createdAt: string;
}

export type VulnerabilityStatus = 'IDENTIFIED' | 'TRIAGED' | 'ASSIGNED' | 'REMEDIATION_IN_PROGRESS' | 'MITIGATED' | 'VERIFIED' | 'CLOSED' | 'ACCEPTED_RISK';

export interface VulnerabilityFinding {
  id: string;
  tenantId: string;
  campusId?: string;
  vulnerabilityId: string; // CVE or Internal ID
  title: string;
  description: string;
  affectedAsset: SecurityAssetReference;
  detectionSource: string;
  discoveryDate: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cvssScore: number;
  exploitability: 'HIGH' | 'MEDIUM' | 'LOW' | 'POC_ONLY' | 'NONE';
  businessImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  remediationTargetDate: string;
  status: VulnerabilityStatus;
  remediationOwnerId?: string;
  compensatingControls?: string[];
  verificationDate?: string;
  verifiedBy?: string;
  riskAcceptanceJustification?: string;
  riskAcceptanceExpiration?: string;
  riskAcceptanceApprovedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface VulnerabilityAssessment {
  id: string;
  tenantId: string;
  title: string;
  scope: string;
  scannerUsed: string;
  scannedAt: string;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface VulnerabilityRemediation {
  id: string;
  findingId: string;
  actionTaken: string;
  resolvedAt: string;
  resolvedBy: string;
  verificationMethod: string;
}

export interface SecurityPatchObservation {
  id: string;
  tenantId: string;
  patchId: string;
  affectedAssetIds: string[];
  status: 'REQUIRED' | 'STAGED' | 'APPLIED' | 'FAILED' | 'EXEMPT';
  appliedAt?: string;
}

export interface SecurityExposureRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  assetId: string;
  assetName: string;
  exposureType: 'EXTERNAL_PORT' | 'EXPOSED_CREDENTIAL' | 'UNENCRYPTED_DATA' | 'API_KEY_LEAK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: string;
  detectedAt: string;
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED';
}

export interface ZeroTrustPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  isEnabled: boolean;
  requiredRoles: string[];
  requiredDeviceTrust: 'NONE' | 'BASIC' | 'ENROLLED' | 'COMPLIANT';
  allowedCampuses?: string[];
  maxRiskScoreAllowed: number;
  mfaRequired: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ZeroTrustEvaluation {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  deviceId?: string;
  campusId?: string;
  resourceId: string;
  resourceClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  policyEvaluatedId: string;
  factors: {
    identityVerified: boolean;
    deviceTrusted: boolean;
    contextMatched: boolean;
    riskAcceptable: boolean;
    mfaVerified: boolean;
  };
  decision: 'ALLOW' | 'DENY' | 'STEP_UP' | 'REVIEW' | 'ISOLATE';
  reason: string;
  timestamp: string;
}

export interface SecurityAccessObservation {
  id: string;
  tenantId: string;
  userId: string;
  resourceId: string;
  accessType: 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE';
  decision: 'ALLOW' | 'DENY';
  timestamp: string;
}

export type PrivilegedActivityStatus = 'NORMAL' | 'WATCH' | 'SUSPICIOUS' | 'REQUIRES_REVIEW' | 'CONFIRMED';

export interface PrivilegedActivityObservation {
  id: string;
  tenantId: string;
  campusId?: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  privilegedAction: string;
  targetResource: string;
  timestamp: string;
  originatingContext: {
    ipAddress: string;
    userAgent: string;
    campusId?: string;
  };
  authorizationReference?: string; // Request approval ID or Change ID
  actionOutcome: 'SUCCESS' | 'FAILURE' | 'DENIED';
  anomalyScore: number; // 0 - 100
  investigationId?: string;
  status: PrivilegedActivityStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SecurityAnomaly {
  id: string;
  tenantId: string;
  campusId?: string;
  detectionRule: string;
  inputObservations: Record<string, any>;
  calculatedScore: number; // 0 - 100
  explanation: string;
  confidence: number; // 0 - 100
  timestamp: string;
  associatedUserId?: string;
  associatedAssetId?: string;
}

export interface SecurityBehaviorSignal {
  id: string;
  userId: string;
  signalType: string;
  score: number;
  timestamp: string;
}

export interface SecurityPostureSnapshot {
  id: string;
  tenantId: string;
  campusId?: string;
  overallScore: number; // 0 - 100
  metrics: {
    controlCoverage: number; // percentage
    unresolvedCriticalAlerts: number;
    unresolvedHighVulnerabilities: number;
    overdueRemediation: number;
    securityExceptionExposure: number;
    zeroTrustEvaluationHealth: number;
    privilegedActivityAnomalies: number;
    telemetrySourceHealth: number;
    evidenceCompleteness: number;
    complianceControlStatus: number;
  };
  certifiedBy?: string;
  certifiedAt?: string;
  explanation: string;
  timestamp: string;
}

export interface SecurityControlAssessment {
  id: string;
  tenantId: string;
  controlId: string; // Authoritative Phase 7.28 control ID reference
  framework: string;
  controlStatus: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'UNASSESSED';
  evidenceCompleteness: number; // 0 - 100
  assessmentStatus: 'DRAFT' | 'COMPLETED' | 'OVERDUE';
  lastAssessedDate: string;
  nextReviewDate: string;
  deficiencyCount: number;
}

export interface SecurityComplianceAssessment {
  id: string;
  tenantId: string;
  framework: string;
  score: number;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
  assessedAt: string;
}

export type SecurityExceptionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'REVOKED';

export interface SecurityExceptionRequest {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  justification: string;
  compensatingControls: string;
  status: SecurityExceptionStatus;
  expirationDate: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  approverComments?: string;
}

export interface SecurityExceptionApproval {
  id: string;
  requestId: string;
  approverId: string;
  action: 'APPROVE' | 'REJECT';
  comments: string;
  timestamp: string;
}

export interface SecurityPlaybook {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  triggerConditions: string[];
  severityThreshold: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  orderedActions: string[];
  requiredApprovals: string[];
  containmentSteps: string[];
  evidenceRequirements: string[];
  rollbackSteps: string[];
  isEnabled: boolean;
}

export interface SecurityPlaybookExecution {
  id: string;
  tenantId: string;
  playbookId: string;
  playbookName: string;
  triggeredBy: string;
  triggeredAt: string;
  investigationId: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_APPROVAL';
  stepsExecuted: {
    stepIndex: number;
    action: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    executedAt?: string;
    output?: string;
  }[];
  rollbackExecuted: boolean;
}

export interface SecurityContainmentAction {
  id: string;
  tenantId: string;
  campusId?: string;
  actionType: 'isolate_asset' | 'revoke_session' | 'disable_integration' | 'block_indicator' | 'quarantine_resource' | 'restrict_access' | 'require_credential_reset' | 'escalate_incident';
  targetId: string;
  targetName: string;
  reason: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'REVERTED';
  approvedBy?: string;
  approvedAt?: string;
  requiresEmergencyOverride: boolean;
  rollbackActionId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SecurityEvidenceReference {
  id: string;
  tenantId: string;
  documentRegistryId: string; // Phase 7.27 authoritative document
  evidencePurpose: string;
  relatedAlertId?: string;
  relatedInvestigationId?: string;
  relatedControlId?: string;
  verificationState: 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  chainOfCustodyLogs: {
    timestamp: string;
    actorId: string;
    action: string;
  }[];
  createdAt: string;
  createdBy: string;
}

export interface SecurityWatchlist {
  id: string;
  tenantId: string;
  targetId: string; // UserId, AssetId, IP, etc.
  targetType: 'USER' | 'ASSET' | 'IP' | 'DOMAIN';
  reason: string;
  addedBy: string;
  addedAt: string;
}

export interface SecurityMetricDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface SecurityAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  userId: string;
  userDisplayName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  correlationId?: string;
  beforeState?: string;
  afterState?: string;
}

export interface SecurityDataQualityIssue {
  id: string;
  tenantId: string;
  campusId?: string;
  issueType: 'orphaned_asset' | 'orphaned_alert' | 'missing_tenant' | 'missing_campus' | 'missing_classification' | 'expired_indicator' | 'duplicate_indicator' | 'duplicate_alert' | 'stale_telemetry' | 'invalid_vulnerability' | 'broken_evidence' | 'missing_investigation_owner' | 'expired_exception' | 'invalid_lifecycle';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  remediationStatus: 'OPEN' | 'RESOLVED' | 'IGNORED';
  detectedAt: string;
  remediatedAt?: string;
}
