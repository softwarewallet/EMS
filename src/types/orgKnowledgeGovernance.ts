export type OrgKnowledgeClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
export type OrgKnowledgeStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'UNDER_REVIEW' | 'SUPERSEDED' | 'ARCHIVED' | 'RETIRED';

export interface KnowledgeDomain {
  id: string;
  tenantId: string;
  campusScope: string;
  name: string;
  description: string;
  ownerId: string;
  stewardId: string;
  classification: OrgKnowledgeClassification;
  lifecycle: string;
  reviewFrequencyDays: number;
  status: OrgKnowledgeStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface KnowledgeAsset {
  id: string;
  tenantId: string;
  campusScope: string;
  domainId: string;
  title: string;
  description: string;
  type: string;
  ownerId: string;
  stewardId: string;
  classification: OrgKnowledgeClassification;
  authoritativeSourceRef?: string;
  version: number;
  status: OrgKnowledgeStatus;
  reviewDate?: string;
  expirationDate?: string;
  isCertified: boolean;
  lineageRef?: string;
  createdBy: string;
  createdAt: string;
}

export interface KnowledgeAssetVersion {
  id: string;
  tenantId: string;
  assetId: string;
  version: number;
  previousVersion?: number;
  changeSummary: string;
  effectiveDate: string;
  authorId: string;
  reviewerId?: string;
  approverId?: string;
  supersessionRef?: string;
  contentSnapshot: any;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  tenantId: string;
  assetId: string;
  content: string;
  sourceRef: string;
  reviewState: string;
  status: OrgKnowledgeStatus;
  createdAt: string;
}

export interface KnowledgeResource {
  id: string;
  tenantId: string;
  assetId: string;
  uri: string;
  status: OrgKnowledgeStatus;
  createdAt: string;
}

export interface KnowledgeCollection {
  id: string;
  tenantId: string;
  name: string;
  assetIds: string[];
  ownerId: string;
  createdAt: string;
}

export interface KnowledgeTaxonomy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
}

export interface KnowledgeTaxonomyTerm {
  id: string;
  tenantId: string;
  taxonomyId: string;
  term: string;
  parentId?: string;
  createdAt: string;
}

export interface KnowledgeTag {
  id: string;
  tenantId: string;
  assetId: string;
  termId: string;
  createdAt: string;
}

export interface KnowledgeRelationship {
  id: string;
  tenantId: string;
  sourceId: string;
  targetId: string;
  relationshipType: 'SUPPORTS' | 'CONTRADICTS' | 'DERIVED_FROM' | 'RELATED_TO' | 'SUPERSEDES' | 'IMPLEMENTS' | 'REFERENCES' | 'DEPENDS_ON' | 'APPLIES_TO' | 'EXPANDS' | 'SUMMARIZES';
  createdAt: string;
}

export interface KnowledgeReference {
  id: string;
  tenantId: string;
  assetId: string;
  targetRef: string;
  createdAt: string;
}

export interface KnowledgeEvidence {
  id: string;
  tenantId: string;
  assetId: string;
  evidenceType: string;
  evidenceRef: string;
  createdAt: string;
}

export interface InstitutionalPractice {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  description: string;
  status: OrgKnowledgeStatus;
  evidenceRefs: string[];
  createdAt: string;
}

export interface LessonLearned {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  context: string;
  lesson: string;
  status: 'DRAFT' | 'REVIEW' | 'VALIDATED' | 'PUBLISHED' | 'RETIRED';
  evidenceRefs: string[];
  createdAt: string;
}

export interface OrganizationalMemoryRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  context: string;
  sourceRef: string;
  lesson: string;
  applicability: string;
  ownerId: string;
  reviewDate: string;
  classification: OrgKnowledgeClassification;
  createdAt: string;
}

export interface ExpertiseProfile {
  id: string;
  tenantId: string;
  campusScope: string;
  staffRef: string;
  domains: string[];
  isCertified: boolean;
  reviewDate: string;
  createdAt: string;
}

export interface ExpertiseDomain {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ExpertiseReference {
  id: string;
  tenantId: string;
  profileId: string;
  domainId: string;
  proficiencyLevel: string;
  evidenceRefs: string[];
  createdAt: string;
}

export interface ResearchKnowledgeRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  topic: string;
  domainId: string;
  status: OrgKnowledgeStatus;
  publicationState: string;
  reviewState: string;
  createdAt: string;
}

export interface ResearchOutputReference {
  id: string;
  tenantId: string;
  knowledgeId: string;
  outputRef: string;
  createdAt: string;
}

export interface ResearchEvidence {
  id: string;
  tenantId: string;
  knowledgeId: string;
  evidenceRef: string;
  createdAt: string;
}

export interface OrgLearningResource {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  type: string;
  referenceId: string;
  createdAt: string;
}

export interface LearningPathReference {
  id: string;
  tenantId: string;
  learningResourceId: string;
  pathId: string;
  createdAt: string;
}

export interface KnowledgeQuestion {
  id: string;
  tenantId: string;
  campusScope: string;
  question: string;
  questionType: 'OPERATIONAL' | 'ACADEMIC' | 'POLICY' | 'TECHNICAL' | 'INSTITUTIONAL';
  status: 'OPEN' | 'ANSWERED';
  createdAt: string;
}

export interface KnowledgeAnswer {
  id: string;
  tenantId: string;
  questionId: string;
  answer: string;
  responderId: string;
  evidenceRefs: string[];
  confidenceState: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNAVAILABLE';
  reviewStatus: 'PENDING' | 'REVIEWED';
  expirationDate: string;
  createdAt: string;
}

export interface KnowledgeReview {
  id: string;
  tenantId: string;
  assetId: string;
  reviewerId: string;
  reviewDate: string;
  findings: string;
  evidenceRefs: string[];
  recommendation: string;
  resultingState: string;
  createdAt: string;
}

export interface KnowledgeCertification {
  id: string;
  tenantId: string;
  scopeType: 'ARTICLE' | 'PRACTICE' | 'LESSON' | 'RESEARCH' | 'COLLECTION' | 'TAXONOMY';
  scopeId: string;
  certifierId: string;
  certificationDate: string;
  status: 'CERTIFIED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface OrgKnowledgeApproval {
  id: string;
  tenantId: string;
  assetId: string;
  approverId: string;
  approvalDate: string;
  decision: 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface KnowledgeGap {
  id: string;
  tenantId: string;
  description: string;
  gapType: 'MISSING_EVIDENCE' | 'MISSING_OWNER' | 'OUTDATED_KNOWLEDGE' | 'UNDOCUMENTED_PRACTICE' | 'MISSING_LESSON' | 'UNSUPPORTED_ARTICLE' | 'BROKEN_REFERENCE' | 'MISSING_REVIEW';
  status: 'IDENTIFIED' | 'ASSESSED' | 'REMEDIATION_PLANNED' | 'REMEDIATING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface OrgKnowledgeRisk {
  id: string;
  tenantId: string;
  title: string;
  riskType: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_PLANNED' | 'MITIGATING' | 'MONITORED' | 'CLOSED';
  createdAt: string;
}

export interface KnowledgeException {
  id: string;
  tenantId: string;
  reason: string;
  scope: string;
  requesterId: string;
  approverId: string;
  compensatingControl: string;
  expiryDate: string;
  reviewDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface KnowledgeSearchRequest {
  tenantId: string;
  query: string;
  filters?: any;
}

export interface KnowledgeSearchResult {
  assetId: string;
  relevance: number;
  classification: OrgKnowledgeClassification;
  status: OrgKnowledgeStatus;
  evidenceState: string;
}

export interface KnowledgeLineageNode {
  id: string;
  tenantId: string;
  assetId: string;
  nodeType: 'SOURCE' | 'KNOWLEDGE_ASSET' | 'EVIDENCE' | 'RELATIONSHIP' | 'PRACTICE' | 'LESSON' | 'DECISION' | 'INSIGHT';
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface KnowledgeLineageEdge {
  id: string;
  tenantId: string;
  sourceNodeId: string;
  targetNodeId: string;
  createdAt: string;
}

export interface OrgKnowledgeAuditEvent {
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
