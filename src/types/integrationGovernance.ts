// EMS Phase 7.39: Institutional Integration, Interoperability, API & Data Exchange Governance Engine Types

export type DataClassification =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CONFIDENTIAL'
  | 'RESTRICTED'
  | 'HIGHLY_CONFIDENTIAL';

export type IntegrationType =
  | 'REST_API'
  | 'SOAP_WS'
  | 'WEBHOOK'
  | 'SFTP_BATCH'
  | 'EVENT_BUS'
  | 'GRAPHQL'
  | 'MESSAGE_QUEUE'
  | 'DATABASE_LINK'
  | 'CUSTOM_CONNECTOR';

export type IntegrationDirection =
  | 'INBOUND'
  | 'OUTBOUND'
  | 'BI_DIRECTIONAL';

export type IntegrationStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'DEPRECATED'
  | 'RETIRED';

export type ApiLifecycleStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'RETIRED';

export type ExchangeContractStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'TERMINATED';

export type ExchangeJobStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PARTIALLY_COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REPLAYED';

export type FailureType =
  | 'AUTHENTICATION_FAILURE'
  | 'AUTHORIZATION_FAILURE'
  | 'SCHEMA_VALIDATION_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'TRANSFORMATION_ERROR'
  | 'DATA_QUALITY_FAILURE'
  | 'DEAD_LETTER';

export type ChangeRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'APPLIED'
  | 'ROLLED_BACK';

export type HealthStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'FAILED'
  | 'SUSPENDED'
  | 'UNKNOWN';

export type IntegrationAuditAction =
  | 'INTEGRATION_CREATED'
  | 'INTEGRATION_SUBMITTED'
  | 'INTEGRATION_APPROVED'
  | 'INTEGRATION_ACTIVATED'
  | 'INTEGRATION_SUSPENDED'
  | 'INTEGRATION_RETIRED'
  | 'API_CREATED'
  | 'API_APPROVED'
  | 'API_DEPRECATED'
  | 'EXCHANGE_CONTRACT_CREATED'
  | 'EXCHANGE_CONTRACT_APPROVED'
  | 'EXCHANGE_STARTED'
  | 'EXCHANGE_COMPLETED'
  | 'EXCHANGE_FAILED'
  | 'EXCHANGE_REPLAYED'
  | 'WEBHOOK_CREATED'
  | 'WEBHOOK_REVOKED'
  | 'CREDENTIAL_ROTATION_REQUESTED'
  | 'CREDENTIAL_ROTATED'
  | 'INTEGRATION_CHANGE_REQUESTED'
  | 'INTEGRATION_CHANGE_APPROVED'
  | 'INTEGRATION_CHANGE_APPLIED'
  | 'DATA_LINEAGE_VERIFIED'
  | 'DATA_QUALITY_ISSUE_DETECTED'
  | 'DEAD_LETTER_CREATED'
  | 'OVERRIDE_EXECUTED';

export interface IntegrationDefinition {
  id: string;
  tenantId: string;
  campusId?: string;
  authorizedCampusIds?: string[];
  integrationCode: string;
  name: string;
  description: string;
  integrationType: IntegrationType;
  direction: IntegrationDirection;
  sourceSystem: string;
  targetSystem: string;
  ownerId: string;
  technicalOwnerId: string;
  businessOwnerId: string;
  status: IntegrationStatus;
  environment: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
  securityClassification: DataClassification;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: string;
}

export interface IntegrationEndpoint {
  id: string;
  tenantId: string;
  integrationId: string;
  endpointId: string;
  endpointType: 'REST' | 'SOAP' | 'WEBHOOK' | 'MQ' | 'SFTP';
  protocol: 'HTTPS' | 'SFTP' | 'AMQP' | 'GRPC' | 'WEBSOCKET';
  baseReference: string;
  authenticationMethod: 'OAUTH2' | 'API_KEY' | 'MTLS' | 'BEARER_TOKEN' | 'BASIC';
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  rateLimit: number; // requests per minute
  timeout: number; // in milliseconds
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    initialIntervalMs: number;
  };
  allowedScopes: string[];
}

export interface APIDefinition {
  id: string;
  tenantId: string;
  apiName: string;
  apiCode: string;
  version: string;
  description: string;
  lifecycleStatus: ApiLifecycleStatus;
  ownerDepartment: string;
  ownerUserId: string;
  consumerPolicy: 'OPEN_INTERNAL' | 'RESTRICTED_DEPARTMENT' | 'PARTNER_ONLY' | 'EXPLICIT_APPROVAL';
  authenticationMethod: string;
  authorizationScopes: string[];
  rateLimitReqPerMin: number;
  quotaReqPerDay: number;
  dataClassification: DataClassification;
  deprecationDate?: string;
  documentationReference?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface APIConsumer {
  id: string;
  tenantId: string;
  applicationId: string;
  applicationName: string;
  ownerId: string;
  authorizedScopes: string[];
  approvedBy?: string;
  approvedAt?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  createdAt: string;
  expiryAt?: string;
}

export interface DataExchangeContract {
  id: string;
  tenantId: string;
  campusScope?: string;
  contractCode: string;
  contractName: string;
  sourceSystem: string;
  targetSystem: string;
  sourceModule: string;
  targetModule: string;
  dataClassification: DataClassification;
  allowedFields: string[];
  transformationVersion: string;
  schemaVersion: string;
  validationRules: string[];
  frequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'BATCH_NIGHTLY' | 'ON_DEMAND';
  direction: IntegrationDirection;
  status: ExchangeContractStatus;
  effectiveFrom: string;
  effectiveUntil?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface DataFieldMapping {
  id: string;
  tenantId: string;
  contractId: string;
  sourceField: string;
  targetField: string;
  transformationRule: string;
  validationRule?: string;
  required: boolean;
  nullable: boolean;
  classification: DataClassification;
  mappingVersion: string;
}

export interface DataExchangeJob {
  id: string;
  tenantId: string;
  campusId?: string;
  exchangeContractId: string;
  executionType: 'SCHEDULED' | 'EVENT_TRIGGERED' | 'MANUAL_REPLAY';
  status: ExchangeJobStatus;
  idempotencyKey: string;
  startedAt: string;
  completedAt?: string;
  recordsRead: number;
  recordsWritten: number;
  recordsRejected: number;
  errorCount: number;
  retryCount: number;
  initiatedBy: string;
}

export interface IntegrationEvent {
  id: string;
  tenantId: string;
  integrationId: string;
  eventType: string;
  direction: IntegrationDirection;
  correlationId: string;
  idempotencyKey: string;
  payloadReference: string; // Sanitized payload ref, no plaintext sensitive data
  classification: DataClassification;
  status: 'RECEIVED' | 'PROCESSED' | 'FAILED' | 'IGNORED';
  receivedAt: string;
  processedAt?: string;
  retryCount: number;
}

export interface WebhookSubscription {
  id: string;
  tenantId: string;
  integrationId: string;
  targetUrl: string;
  subscribedEvents: string[];
  authorizationPolicy: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
  secretReference: string; // Metadata ref only, no plaintext secret
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  expiryAt?: string;
}

export interface IntegrationFailure {
  id: string;
  tenantId: string;
  integrationId: string;
  jobId?: string;
  eventId?: string;
  failureType: FailureType;
  errorCode: string;
  message: string;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  status: 'OPEN' | 'RETRYING' | 'RESOLVED' | 'DEAD_LETTER' | 'IGNORED';
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface DataLineageRecord {
  id: string;
  tenantId: string;
  sourceModule: string;
  sourceCollection: string;
  sourceField: string;
  transformation: string;
  destinationModule: string;
  destinationCollection: string;
  destinationField: string;
  contractVersion: string;
  ownerId: string;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'FLAGGED';
  verifiedAt?: string;
  createdAt: string;
}

export interface IntegrationChangeRequest {
  id: string;
  tenantId: string;
  targetType: 'INTEGRATION' | 'API' | 'CONTRACT' | 'MAPPING' | 'ENDPOINT';
  targetId: string;
  changeTitle: string;
  reason: string;
  beforeSnapshot: Record<string, any>;
  afterSnapshot: Record<string, any>;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedSystems: string[];
  affectedClassifications: DataClassification[];
  rollbackStrategy: string;
  status: ChangeRequestStatus;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  appliedAt?: string;
}

export interface IntegrationDataQualityIssue {
  id: string;
  tenantId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  issueType:
    | 'ORPHAN_INTEGRATION'
    | 'ORPHAN_CONTRACT'
    | 'ORPHAN_MAPPING'
    | 'INVALID_SOURCE'
    | 'INVALID_DESTINATION'
    | 'SCHEMA_MISMATCH'
    | 'CLASSIFICATION_MISMATCH'
    | 'STALE_CONTRACT'
    | 'DUPLICATE_MAPPING'
    | 'DUPLICATE_EXECUTION'
    | 'UNRESOLVED_DEAD_LETTER'
    | 'CROSS_TENANT_REFERENCE';
  description: string;
  affectedEntityId: string;
  detectedAt: string;
}

export interface IntegrationAnalytics {
  activeIntegrationsCount: number;
  failedJobsCount: number;
  successfulJobsCount: number;
  apiHealthStatus: HealthStatus;
  exchangeSuccessRatePercent: number;
  retryRatePercent: number;
  slaBreachesCount: number;
  dataQualityFailuresCount: number;
  securityEventsCount: number;
  deprecatedApisCount: number;
  contractCoveragePercent: number;
}

export interface IntegrationAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  actorId: string;
  actorRole: string;
  action: IntegrationAuditAction;
  resourceType: string;
  resourceId: string;
  reason?: string;
  timestamp: string;
  details: Record<string, string | number | boolean>;
}
