export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
export type DataCriticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DataGovernanceStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED' | 'ARCHIVED';

export interface DataDomain {
  id: string;
  tenantId: string;
  campusScope: string;
  name: string;
  description: string;
  ownerId: string;
  stewardId: string;
  classification: DataClassification;
  criticality: DataCriticality;
  status: DataGovernanceStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DataAsset {
  id: string;
  tenantId: string;
  campusScope: string;
  domainId: string;
  name: string;
  type: 'DATABASE' | 'DATASET' | 'REPORT' | 'API' | 'DATA_FEED' | 'FILE' | 'MODEL';
  description: string;
  ownerId: string;
  stewardId: string;
  custodianId: string;
  sourceSystem: string;
  classification: DataClassification;
  criticality: DataCriticality;
  status: DataGovernanceStatus;
  isAuthoritative: boolean;
  retentionReference?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DataDictionaryEntry {
  id: string;
  tenantId: string;
  assetId: string;
  term: string;
  technicalName: string;
  businessDefinition: string;
  dataType: string;
  allowedValues?: string[];
  format?: string;
  source: string;
  ownerId: string;
  stewardId: string;
  classification: DataClassification;
  sensitivity: string;
  validationRules?: string;
  status: DataGovernanceStatus;
  createdBy: string;
  createdAt: string;
}

export interface BusinessGlossaryTerm {
  id: string;
  tenantId: string;
  term: string;
  definition: string;
  synonyms?: string[];
  prohibitedSynonyms?: string[];
  domainId: string;
  ownerId: string;
  stewardId: string;
  version: number;
  status: DataGovernanceStatus;
  createdBy: string;
  createdAt: string;
}

export interface DataLineageNode {
  id: string;
  tenantId: string;
  assetId: string;
  nodeType: 'SOURCE' | 'TRANSFORMATION' | 'DATASET' | 'APPLICATION' | 'REPORT' | 'CONSUMER';
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface DataLineageEdge {
  id: string;
  tenantId: string;
  sourceNodeId: string;
  targetNodeId: string;
  transformationReference?: string;
  createdAt: string;
}

export interface MasterDataRecord {
  id: string;
  tenantId: string;
  entityType: 'PERSON' | 'ORGANIZATION' | 'CAMPUS' | 'DEPARTMENT' | 'PROGRAM' | 'COURSE' | 'SUPPLIER' | 'ASSET' | 'LOCATION' | string;
  authoritativeSource: string;
  sourceKey: string;
  canonicalReference: string;
  confidenceScore: number;
  duplicateStatus: 'POTENTIAL_DUPLICATE' | 'UNDER_REVIEW' | 'CONFIRMED_DUPLICATE' | 'MERGE_APPROVED' | 'RESOLVED' | 'REJECTED';
  stewardId: string;
  status: 'ACTIVE' | 'MERGED' | 'ARCHIVED';
  createdAt: string;
}

export interface GovDataQualityRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  domainId: string;
  assetId?: string;
  dimension: 'COMPLETENESS' | 'ACCURACY' | 'CONSISTENCY' | 'VALIDITY' | 'TIMELINESS' | 'UNIQUENESS' | 'INTEGRITY' | string;
  severity: DataCriticality;
  ownerId: string;
  stewardId: string;
  executionFrequency: string;
  status: DataGovernanceStatus;
  createdAt: string;
}

export interface DataQualityIssue {
  id: string;
  tenantId: string;
  campusScope: string;
  issueType: string;
  severity: DataCriticality;
  domainId: string;
  assetId?: string;
  ruleId?: string;
  description: string;
  detectedAt: string;
  ownerId: string;
  stewardId: string;
  status: 'OPEN' | 'TRIAGED' | 'REMEDIATION_PLANNED' | 'IN_REMEDIATION' | 'VALIDATION' | 'RESOLVED' | 'CLOSED';
  remediation?: string;
  createdAt: string;
}

export interface DataCertification {
  id: string;
  tenantId: string;
  scopeType: 'DATASET' | 'DOMAIN' | 'DEFINITION' | 'MASTER_DATA' | 'QUALITY' | 'LINEAGE';
  scopeId: string;
  certifierId: string;
  certificationDate: string;
  expiryDate?: string;
  status: 'CERTIFIED' | 'EXPIRED' | 'REVOKED';
  evidenceRef?: string;
  createdAt: string;
}

export interface DataContract {
  id: string;
  tenantId: string;
  providerId: string;
  consumerId: string;
  assetId: string;
  schemaRef: string;
  version: number;
  classification: DataClassification;
  ownerId: string;
  stewardId: string;
  status: DataGovernanceStatus;
  createdAt: string;
}

export interface DataSharingAgreement {
  id: string;
  tenantId: string;
  campusScope: string;
  providerId: string;
  consumerId: string;
  purpose: string;
  assetId: string;
  classification: DataClassification;
  permittedFields: string[];
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  expiryDate: string;
  createdAt: string;
}

export interface DataGovernanceDecision {
  id: string;
  tenantId: string;
  decision: string;
  rationale: string;
  authorityId: string;
  scope: string;
  status: 'PROPOSED' | 'APPROVED' | 'SUPERSEDED';
  effectiveDate: string;
  createdAt: string;
}

export interface DataGovernanceAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousState?: any;
  resultingState?: any;
  justification?: string;
  correlationId?: string;
}
