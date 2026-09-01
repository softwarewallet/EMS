// Phase 8.5 — Institutional Enterprise Master Data, Reference Data, Data Synchronization, Data Contract & Cross-System Integration Governance Control Plane Types

export type DataDomainType = 
  | 'PERSON'
  | 'STUDENT'
  | 'EMPLOYEE'
  | 'DEPARTMENT'
  | 'CAMPUS'
  | 'PROGRAM'
  | 'COURSE'
  | 'VENDOR'
  | 'CONTRACT'
  | 'FINANCE'
  | 'ASSET'
  | 'FACILITY'
  | 'PROJECT'
  | 'GRANT'
  | 'DOCUMENT'
  | 'OTHER';

export type ReferenceDataLifecycle = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'RETIRED';

export type DataContractLifecycle = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'RETIRED';

export type IntegrationEndpointType = 
  | 'API'
  | 'EVENT'
  | 'FILE'
  | 'DATABASE_REFERENCE'
  | 'MESSAGE_QUEUE'
  | 'WEBHOOK'
  | 'BATCH'
  | 'OTHER';

export type SynchronizationPolicyMode = 
  | 'REAL_TIME'
  | 'NEAR_REAL_TIME'
  | 'BATCH'
  | 'SCHEDULED'
  | 'MANUAL'
  | 'EVENT_DRIVEN';

export type ReconciliationStatus805 = 
  | 'MATCHED'
  | 'MISMATCHED'
  | 'MISSING_SOURCE'
  | 'MISSING_TARGET'
  | 'STALE'
  | 'NOT_VERIFIABLE'
  | 'INSUFFICIENT_DATA';

export type DataQualitySeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type ScenarioType805 = 
  | 'AUTHORITATIVE_SYSTEM_OUTAGE'
  | 'INTEGRATION_ENDPOINT_FAILURE'
  | 'DATA_CONTRACT_BREAK'
  | 'REFERENCE_DATA_CHANGE'
  | 'SYNCHRONIZATION_DELAY'
  | 'MASS_DATA_QUALITY_DEGRADATION'
  | 'DUPLICATE_EVENT_SURGE'
  | 'CROSS_CAMPUS_INTEGRATION_FAILURE'
  | 'THIRD_PARTY_PLATFORM_OUTAGE'
  | 'CASCADING_DEPENDENCY_FAILURE'
  | 'DATA_MAPPING_CORRUPTION'
  | 'RECONCILIATION_BACKLOG';

export interface EnterpriseDataDomain {
  id: string;
  tenantId: string;
  campusId?: string;
  domainCode: string;
  domainName: string;
  domainType: DataDomainType;
  authoritativeSystemIdRef: string;
  authoritativeIdentifierName: string;
  sourceOwnershipDepartmentRef: string;
  stewardshipUserIdRef: string;
  synchronizationPolicyMode: SynchronizationPolicyMode;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  lifecycle: 'ACTIVE' | 'UNDER_REVIEW' | 'DEPRECATED' | 'RETIRED';
  qualityStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'UNKNOWN';
  dependencyCount: number;
  integrationHealthScore: number; // 0-100 bounded
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseMasterDataReference {
  id: string;
  tenantId: string;
  campusId?: string;
  domainCode: string;
  masterRecordIdRef: string; // Global cross-system identifier reference
  authoritativeSystemIdRef: string;
  sourceRecordIdRef: string; // Authoritative ID in source
  systemReferences: {
    systemIdRef: string;
    systemRecordIdRef: string;
    lastSyncedAt: string;
    syncStatus: ReconciliationStatus805;
  }[];
  isLocked: boolean;
  stewardUserIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseReferenceDataSet {
  id: string;
  tenantId: string;
  datasetCode: string;
  name: string;
  description: string;
  domainType: DataDomainType;
  lifecycle: ReferenceDataLifecycle;
  version: string;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  effectiveDate: string;
  expiryDate?: string;
  approvalPackageIdRef?: string;
  valueCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseReferenceDataValue {
  id: string;
  tenantId: string;
  datasetIdRef: string;
  valueCode: string;
  displayName: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  parentValueCode?: string;
  externalSystemMappings: Record<string, string>; // systemCode -> externalValueCode reference
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDataMapping {
  id: string;
  tenantId: string;
  mappingCode: string;
  name: string;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  domainCode: string;
  sourceFieldRef: string;
  targetFieldRef: string;
  transformationLogicRef: string;
  mappingVersion: string;
  validationRuleRef?: string;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  approverUserIdRef?: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDataContract {
  id: string;
  tenantId: string;
  contractCode: string;
  title: string;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  domainType: DataDomainType;
  schemaReference: string;
  version: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  requiredFields: string[];
  validationRulesSummary: string;
  compatibilityMode: 'BACKWARD_COMPATIBLE' | 'BREAKING_CHANGE' | 'STRICT';
  status: DataContractLifecycle;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  effectiveDate: string;
  expiryDate?: string;
  approvalPackageIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDataContractVersion {
  id: string;
  tenantId: string;
  contractIdRef: string;
  versionNumber: string;
  schemaHash: string; // SHA-256
  changeDescription: string;
  isBreakingChange: boolean;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface EnterpriseIntegrationDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  integrationCode: string;
  name: string;
  endpointType: IntegrationEndpointType;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  providerReference: string;
  endpointReference: string; // URL or queue ref
  authenticationReference: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  contractIdRef?: string;
  status: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE' | 'DISABLED';
  ownerUserIdRef: string;
  dependencyIds: string[];
  healthScore: number; // 0-100
  lastObservedExecution?: string;
  failureRateObservationPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseIntegrationEndpointRef {
  id: string;
  tenantId: string;
  endpointCode: string;
  integrationIdRef: string;
  protocol: string;
  networkScope: 'INTERNAL' | 'EXTRANET' | 'PUBLIC';
  healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'UNVERIFIABLE';
  isTelemetryAvailable: boolean; // false -> INSUFFICIENT DATA
  lastHeartbeat?: string;
}

export interface EnterpriseIntegrationExecution {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  correlationId: string;
  idempotencyKey: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'RETRYING';
  recordsProcessedCount: number;
  failedCount: number;
  durationMs: number;
  executedAt: string;
}

export interface EnterpriseSynchronizationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  mode: SynchronizationPolicyMode;
  direction: 'ONE_WAY_PUSH' | 'ONE_WAY_PULL' | 'BI_DIRECTIONAL';
  frequencyMinutes?: number;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  contractIdRef: string;
  isActive: boolean;
  lastExecutionAt?: string;
  nextExecutionAt?: string;
  failureCount: number;
  reconciliationStatus: ReconciliationStatus805;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseSynchronizationEvent {
  id: string;
  tenantId: string;
  policyIdRef: string;
  eventCode: string;
  idempotencyKey: string;
  sourceRecordIdRef: string;
  targetRecordIdRef?: string;
  status: 'QUEUED' | 'SYNCED' | 'FAILED' | 'SKIPPED_DUPLICATE';
  processedAt?: string;
  createdAt: string;
}

export interface EnterpriseReconciliationRun {
  id: string;
  tenantId: string;
  campusId?: string;
  runCode: string;
  domainCode: string;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  totalEvaluatedCount: number;
  matchedCount: number;
  mismatchedCount: number;
  missingSourceCount: number;
  missingTargetCount: number;
  staleCount: number;
  reconciliationStatus: ReconciliationStatus805;
  executedAt: string;
}

export interface EnterpriseReconciliationException {
  id: string;
  tenantId: string;
  runIdRef: string;
  exceptionCode: string;
  masterRecordIdRef: string;
  sourceRecordIdRef?: string;
  targetRecordIdRef?: string;
  status: ReconciliationStatus805;
  reason: string;
  isResolved: boolean;
  resolvedByUserIdRef?: string;
  createdAt: string;
}

export interface EnterpriseDataQualityRule {
  id: string;
  tenantId: string;
  ruleCode: string;
  name: string;
  dimension: 'COMPLETENESS' | 'VALIDITY' | 'CONSISTENCY' | 'UNIQUENESS' | 'TIMELINESS' | 'REFERENTIAL_INTEGRITY';
  domainCode: string;
  sourceSystemIdRef: string;
  expression: string;
  severity: DataQualitySeverity;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseDataQualityObservation {
  id: string;
  tenantId: string;
  ruleIdRef: string;
  observationCode: string;
  result: 'PASS' | 'FAIL' | 'INSUFFICIENT_DATA';
  scorePercentage: number; // 0-100 or -1 if INSUFFICIENT_DATA
  isTelemetryAvailable: boolean; // if false -> displays INSUFFICIENT DATA
  evidenceReference: string;
  observedAt: string;
}

export interface EnterpriseDataLineageNode {
  id: string;
  tenantId: string;
  nodeCode: string;
  name: string;
  nodeType: 'SOURCE_SYSTEM' | 'TRANSFORMATION' | 'TARGET_SYSTEM' | 'DATA_STORE';
  systemRef: string;
  domainType: DataDomainType;
}

export interface EnterpriseDataLineageEdge {
  id: string;
  tenantId: string;
  sourceNodeIdRef: string;
  targetNodeIdRef: string;
  transformationDescription: string;
  contractIdRef?: string;
}

export interface EnterpriseDataDependency {
  id: string;
  tenantId: string;
  upstreamIdRef: string;
  downstreamIdRef: string;
  dependencyType: 'HARD_BLOCKING' | 'SOFT_EVENTUAL' | 'READ_ONLY';
  isCritical: boolean;
}

export interface EnterpriseDataProvenance {
  id: string;
  tenantId: string;
  masterRecordIdRef: string;
  actorUserIdRef: string;
  correlationId: string;
  contractVersionRef: string;
  provenanceHash: string; // SHA-256
  timestamp: string;
}

export interface EnterpriseDataException {
  id: string;
  tenantId: string;
  exceptionCode: string;
  title: string;
  type: 'CONTRACT_DEVIATION' | 'SYNC_DELAY' | 'MAPPING_EXCEPTION' | 'QUALITY_FAILURE' | 'RECONCILIATION_MISMATCH' | 'INTEGRATION_OUTAGE';
  businessRationale: string;
  riskAssessment: string;
  compensatingControl: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  approvedAt?: string;
  expiryDate: string; // Mandatory expiry date
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface EnterpriseIntegrationRisk {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  criticalityScore: number; // 1-10 bounded
  sensitivityScore: number; // 1-10 bounded
  failureExposureScore: number; // 1-10 bounded
  compositeRiskScore: number; // 1-10 bounded
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evaluatedAt: string;
}

export interface EnterpriseIntegrationApproval {
  id: string;
  tenantId: string;
  approvalCode: string;
  targetType: 'MASTER_REF' | 'REF_DATA' | 'CONTRACT' | 'MAPPING' | 'INTEGRATION' | 'EXCEPTION' | 'RECONCILIATION_OVERRIDE';
  targetIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED';
  justification?: string;
  decidedAt?: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface EnterpriseIntegrationAuditLog {
  id: string;
  tenantId: string;
  campusId?: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  provenanceHash: string;
  timestamp: string;
}

export interface EnterpriseIntegrationDiagnostic {
  id: string;
  tenantId: string;
  code: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  description: string;
  recommendation: string;
  affectedRef?: string;
  detectedAt: string;
}

export interface SimulationResult805 {
  scenario: ScenarioType805;
  banner: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  timestamp: string;
  simulatedRecordsCount: number;
  reconciliationMismatchCount: number;
  circuitBreakerActivated: boolean;
  diagnosticsGenerated: string[];
  summary: string;
}
