// Phase 8.7 — Institutional Enterprise Integration, API, Service Interface, Interoperability & External Connectivity Governance Control Plane Types

export type IntegrationLifecycle807 = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'SECURITY_REVIEW'
  | 'APPROVED'
  | 'READY'
  | 'ACTIVE'
  | 'DEGRADED'
  | 'SUSPENDED'
  | 'RETIRING'
  | 'RETIRED'
  | 'ARCHIVED';

export type ApiLifecycle807 = 
  | 'DRAFT'
  | 'DESIGN_REVIEW'
  | 'SECURITY_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'RETIRED';

export type ContractLifecycle807 = 
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'RETIRED';

export type CompatibilityType807 = 
  | 'COMPATIBLE'
  | 'NON_BREAKING'
  | 'CONDITIONALLY_COMPATIBLE'
  | 'BREAKING'
  | 'UNKNOWN';

export type ChangeClass807 = 
  | 'MINOR'
  | 'STANDARD'
  | 'SIGNIFICANT'
  | 'MAJOR'
  | 'BREAKING';

export type RiskLevel807 = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type SlaStatus807 = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'UNKNOWN';

export type InterfaceProtocol807 = 
  | 'REST'
  | 'GRAPHQL'
  | 'SOAP'
  | 'GRPC'
  | 'WEBHOOK'
  | 'EVENT_API'
  | 'FILE_EXCHANGE'
  | 'BATCH';

export type ScenarioType807 = 
  | 'API_PROVIDER_OUTAGE'
  | 'IDENTITY_PROVIDER_OUTAGE'
  | 'CLOUD_SERVICE_OUTAGE'
  | 'NETWORK_PARTITION'
  | 'CERTIFICATE_EXPIRY'
  | 'AUTHENTICATION_FAILURE'
  | 'SCHEMA_BREAK'
  | 'API_VERSION_RETIREMENT'
  | 'THIRD_PARTY_OUTAGE'
  | 'MESSAGE_BACKLOG'
  | 'INTEGRATION_CASCADE'
  | 'DATA_MAPPING_FAILURE'
  | 'RATE_LIMIT_EXHAUSTION'
  | 'CYBER_COMPROMISE'
  | 'MULTI_SYSTEM_CONNECTIVITY_FAILURE';

export interface EnterpriseIntegrationStrategy {
  id: string;
  tenantId: string;
  strategyCode: string;
  title: string;
  description: string;
  visionStatement: string;
  governanceModel: 'CENTRALIZED' | 'FEDERATED' | 'HYBRID';
  effectiveDate: string;
  reviewDate: string;
  ownerIdRef: string;
  status: 'ACTIVE' | 'UNDER_REVISION' | 'SUPERSEDED';
}

export interface EnterpriseIntegrationPortfolio {
  id: string;
  tenantId: string;
  portfolioCode: string;
  name: string;
  description: string;
  departmentIdRef: string;
  leadOwnerIdRef: string;
  totalIntegrationCount: number;
  highRiskIntegrationCount: number;
  updatedAt: string;
}

export interface EnterpriseIntegrationDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  integrationCode: string;
  title: string;
  description: string;
  portfolioIdRef: string;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  dataDomainIdRef: string;
  lifecycle: IntegrationLifecycle807;
  protocol: InterfaceProtocol807;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'MISSION_CRITICAL';
  ownerIdRef: string;
  stewardIdRef: string;
  vendorIdRef?: string;
  contractIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseIntegrationVersion {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  versionNumber: string;
  versionHash: string; // SHA-256
  changeDescription: string;
  requesterIdRef: string;
  approverIdRef?: string;
  approvedAt?: string;
  lifecycle: IntegrationLifecycle807;
  isCurrent: boolean;
  createdAt: string;
}

export interface EnterpriseServiceInterface {
  id: string;
  tenantId: string;
  interfaceCode: string;
  name: string;
  description: string;
  protocol: InterfaceProtocol807;
  baseEndpointUrlRef: string;
  sourceSystemIdRef: string;
  ownerIdRef: string;
  lifecycle: IntegrationLifecycle807;
  isInternal: boolean;
  createdAt: string;
}

export interface EnterpriseApiGovernanceRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  apiCode: string;
  name: string;
  description: string;
  interfaceIdRef: string;
  lifecycle: ApiLifecycle807;
  currentVersion: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  authModelRef: string;
  rateLimitPolicyRef: string;
  slaIdRef?: string;
  ownerIdRef: string;
  securityReviewStatus: 'PENDING' | 'APPROVED' | 'EXCEPTED';
  privacyReviewStatus: 'PENDING' | 'APPROVED' | 'EXCEPTED';
  deprecationDate?: string;
  retirementDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseApiVersion {
  id: string;
  tenantId: string;
  apiIdRef: string;
  versionNumber: string;
  schemaVersion: string;
  lifecycle: ApiLifecycle807;
  compatibility: CompatibilityType807;
  publishedAt?: string;
  deprecatedAt?: string;
  retiredAt?: string;
}

export interface EnterpriseInterfaceContract {
  id: string;
  tenantId: string;
  contractCode: string;
  title: string;
  apiIdRef: string;
  consumerSystemIdRef: string;
  providerSystemIdRef: string;
  lifecycle: ContractLifecycle807;
  compatibilityType: CompatibilityType807;
  effectiveDate: string;
  expiryDate: string;
  certificationStatus: 'CERTIFIED' | 'REVOKED' | 'EXPIRED' | 'PENDING';
  ownerIdRef: string;
  createdAt: string;
}

export interface EnterpriseDataExchangeAgreement {
  id: string;
  tenantId: string;
  agreementCode: string;
  title: string;
  contractIdRef: string;
  dataDomainIdRef: string;
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  purposeStatement: string;
  privacyBasisRef: string;
  retentionPeriodMonths: number;
  thirdPartyRecipientRef?: string;
  approvedByIdRef: string;
  effectiveDate: string;
  expiryDate: string;
}

export interface EnterpriseEndpointReference {
  id: string;
  tenantId: string;
  endpointCode: string;
  name: string;
  environment: 'DEVELOPMENT' | 'TEST' | 'STAGING' | 'PRODUCTION';
  protocol: InterfaceProtocol807;
  urlReferenceHash: string;
  trustZoneRef: string;
  isTelemetryAvailable: boolean; // false -> INSUFFICIENT DATA
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastCheckedAt?: string;
}

export interface EnterpriseSystemDependency {
  id: string;
  tenantId: string;
  upstreamSystemIdRef: string;
  downstreamSystemIdRef: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dependencyType: 'SYNCHRONOUS' | 'ASYNCHRONOUS' | 'BATCH' | 'MANUAL';
}

export interface EnterpriseIntegrationDependency {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  dependentApiIdRef: string;
  isHardDependency: boolean;
  failureImpact: string;
}

export interface EnterpriseIntegrationOwner {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  ownerIdRef: string;
  role: 'BUSINESS_OWNER' | 'TECHNICAL_LEAD' | 'DATA_STEWARD' | 'SECURITY_REVIEWER';
  assignedAt: string;
}

export interface EnterpriseIntegrationSLA {
  id: string;
  tenantId: string;
  slaCode: string;
  title: string;
  integrationIdRef: string;
  targetAvailabilityPercent: number; // e.g. 99.9
  targetResponseMs: number;
  targetRpoMinutes: number;
  targetRtoMinutes: number;
  status: SlaStatus807;
  createdAt: string;
}

export interface EnterpriseIntegrationSLAObservation {
  id: string;
  tenantId: string;
  slaIdRef: string;
  observedAvailabilityPercent?: number;
  observedResponseMs?: number;
  status: SlaStatus807;
  observedAt: string;
  isTelemetryAvailable: boolean;
}

export interface EnterpriseIntegrationSecurityProfile {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  authenticationTypeRef: string; // e.g., OAuth2_GSI, mTLS
  authorizationPolicyRef: string;
  encryptionInTransit: boolean;
  encryptionAtRest: boolean;
  certificateExpiryDate?: string;
  securityReviewDate: string;
  reviewerIdRef: string;
  isPrivileged: boolean;
}

export interface EnterpriseIntegrationAuthenticationReference {
  id: string;
  tenantId: string;
  authCode: string;
  name: string;
  authMethod: 'OAUTH2' | 'MTLS' | 'SAMLV2' | 'API_KEY_REF' | 'BEARER_TOKEN_REF';
  keyVaultRef: string;
  lastRotatedAt?: string;
}

export interface EnterpriseIntegrationAuthorizationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  apiIdRef: string;
  allowedRoles: string[];
  requiresFourEyes: boolean;
  isActive: boolean;
}

export interface EnterpriseIntegrationDataClassification {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  dataDomainIdRef: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_RESTRICTED';
  containsPII: boolean;
  containsFERPA: boolean;
  containsFinancial: boolean;
}

export interface EnterpriseIntegrationDataFlow {
  id: string;
  tenantId: string;
  flowCode: string;
  sourceSystemIdRef: string;
  targetSystemIdRef: string;
  dataDomainIdRef: string;
  direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  frequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'ON_DEMAND';
}

export interface EnterpriseIntegrationLineage {
  id: string;
  tenantId: string;
  sourceSystemIdRef: string;
  interfaceIdRef: string;
  apiIdRef: string;
  dataDomainIdRef: string;
  targetSystemIdRef: string;
  lineagePathHash: string;
}

export interface EnterpriseIntegrationMappingReference {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  sourceFieldRef: string;
  targetFieldRef: string;
  transformationType: 'DIRECT' | 'LOOKUP' | 'CALCULATED' | 'COMPOSITE';
}

export interface EnterpriseIntegrationTransformationReference {
  id: string;
  tenantId: string;
  transformationCode: string;
  name: string;
  rulesSummary: string;
  isLossless: boolean;
}

export interface EnterpriseIntegrationChangeRequest {
  id: string;
  tenantId: string;
  requestCode: string;
  title: string;
  integrationIdRef: string;
  changeClass: ChangeClass807;
  justification: string;
  requesterIdRef: string;
  approverIdRef?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  createdAt: string;
}

export interface EnterpriseIntegrationApproval {
  id: string;
  tenantId: string;
  changeRequestIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  decision: 'APPROVED' | 'REJECTED';
  justification: string;
  decidedAt: string;
}

export interface EnterpriseIntegrationException {
  id: string;
  tenantId: string;
  exceptionCode: string;
  title: string;
  businessJustification: string;
  compensatingControlRef: string;
  affectedIntegrationIdRef: string;
  requesterIdRef: string;
  approverIdRef?: string;
  approvedAt?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface EnterpriseIntegrationRisk {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  criticalityScore: number;
  dataSensitivityScore: number;
  securityExposureScore: number;
  dependencyConcentrationScore: number;
  externalDependencyScore: number;
  compositeRiskScore: number;
  riskLevel: RiskLevel807;
  evaluatedAt: string;
}

export interface EnterpriseIntegrationRiskAssessment {
  id: string;
  tenantId: string;
  assessmentCode: string;
  integrationIdRef: string;
  assessorIdRef: string;
  riskLevel: RiskLevel807;
  mitigationPlanSummary: string;
  assessedAt: string;
}

export interface EnterpriseIntegrationResilienceAssessment {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  rtoMinutes: number;
  rpoMinutes: number;
  hasFallbackProtocol: boolean;
  circuitBreakerSupported: boolean;
  testedAt?: string;
}

export interface EnterpriseIntegrationIncidentReference {
  id: string;
  tenantId: string;
  incidentCode: string;
  integrationIdRef: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  occurredAt: string;
}

export interface EnterpriseIntegrationTestEvidence {
  id: string;
  tenantId: string;
  evidenceCode: string;
  integrationIdRef: string;
  testType: 'UNIT' | 'INTEGRATION' | 'SECURITY' | 'PENETRATION' | 'LOAD';
  passed: boolean;
  testerIdRef: string;
  executedAt: string;
}

export interface EnterpriseIntegrationCertification {
  id: string;
  tenantId: string;
  certificationCode: string;
  integrationIdRef: string;
  certifyingAuthorityRef: string;
  validFrom: string;
  validTo: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
}

export interface EnterpriseIntegrationMonitoringObservation {
  id: string;
  tenantId: string;
  integrationIdRef: string;
  isTelemetryAvailable: boolean;
  observationSummary: string;
  observedAt: string;
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

export interface EnterpriseIntegrationDecision {
  id: string;
  tenantId: string;
  decisionCode: string;
  title: string;
  integrationIdRef: string;
  decisionType: 'APPROVAL' | 'REJECTION' | 'RETIREMENT' | 'EXCEPTION';
  decisionMakerIdRef: string;
  justification: string;
  decidedAt: string;
}

export interface EnterpriseIntegrationAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityIdRef: string;
  timestamp: string;
  correlationId: string;
  previousHash: string;
  currentHash: string;
}

export interface SimulationResult807 {
  scenario: ScenarioType807;
  banner: 'SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION';
  timestamp: string;
  simulatedRequestsCount: number;
  affectedSystemsCount: number;
  circuitBreakersTrippedCount: number;
  fallbackEngaged: boolean;
  estimatedRecoveryExposureHours: number;
  diagnosticsGenerated: string[];
  summary: string;
}
