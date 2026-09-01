export type KnowledgeCategory = 
  | 'POLICY' | 'PROCEDURE' | 'SOP' | 'GUIDELINE' | 'MANUAL' 
  | 'STANDARD' | 'KNOWLEDGE_ARTICLE' | 'DECISION' | 'PRECEDENT' 
  | 'LESSON_LEARNED' | 'BEST_PRACTICE' | 'REFERENCE';

export type KnowledgeClassification = 
  | 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';

export type KnowledgeStatus = 
  | 'DRAFT' | 'REVIEW' | 'APPROVAL_PENDING' | 'APPROVED' 
  | 'PUBLISHED' | 'ACTIVE' | 'UNDER_REVIEW' | 'SUPERSEDED' 
  | 'RETIRED' | 'ARCHIVED';

export interface InstitutionalKnowledgeAsset {
  id: string;
  tenantId: string;
  campusScope: string;
  category: KnowledgeCategory;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  stewardId: string;
  stewardName: string;
  classification: KnowledgeClassification;
  status: KnowledgeStatus;
  effectiveDate: string;
  reviewDate?: string;
  reviewFrequencyDays?: number;
  source?: string;
  version: number;
  parentAssetId?: string; // For linking procedures to policies
  supersededByAssetId?: string; // If superseded by a completely new asset
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface KnowledgeVersion {
  id: string;
  tenantId: string;
  assetId: string;
  version: number;
  content: string;
  changeSummary: string;
  status: KnowledgeStatus;
  createdBy: string;
  createdAt: string;
}

export interface KnowledgeApproval {
  id: string;
  tenantId: string;
  assetId: string;
  version: number;
  approverId: string;
  approverName: string;
  decision: 'APPROVED' | 'REJECTED';
  rationale: string;
  approvedAt: string;
}

export interface InstitutionalMemoryRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  type: 'DECISION' | 'PRECEDENT' | 'LESSON_LEARNED' | 'BEST_PRACTICE';
  title: string;
  context: string;
  details: string; // The decision, precedent, lesson, or practice itself
  domain: string;
  ownerId: string;
  sourceEventId?: string;
  classification: KnowledgeClassification;
  status: 'DRAFT' | 'VERIFIED' | 'PUBLISHED' | 'SUPERSEDED' | 'ARCHIVED';
  evidenceIds: string[];
  createdBy: string;
  createdAt: string;
}

export interface KnowledgeDistribution {
  id: string;
  tenantId: string;
  assetId: string;
  version: number;
  audienceGroupId: string;
  campusScope: string;
  method: string;
  requiresAcknowledgement: boolean;
  distributedBy: string;
  distributedAt: string;
}

export interface KnowledgeRisk {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  assetId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_PLANNED' | 'MITIGATING' | 'MONITORED' | 'CLOSED';
  ownerId: string;
  createdAt: string;
}

export interface KnowledgeDataQualityIssue {
  id: string;
  tenantId: string;
  campusScope: string;
  entityType: string;
  entityId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED';
  description: string;
  detectedAt: string;
  remediation: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface KnowledgeAuditEvent {
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
