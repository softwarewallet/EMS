// Phase 9.4 Institutional Knowledge Intelligence, Decision Knowledge, Organizational Memory & Governed Knowledge Retrieval Domain Model

export type KnowledgeLifecycleStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'RETIRED'
  | 'ARCHIVED';

export type KnowledgeTrustClassification =
  | 'VERY_HIGH'
  | 'HIGH'
  | 'MODERATE'
  | 'LOW'
  | 'UNTRUSTED'
  | 'INSUFFICIENT_DATA';

export type KnowledgeRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export type ConflictResolutionStatus =
  | 'DETECTED'
  | 'UNDER_REVIEW'
  | 'RESOLUTION_PROPOSED'
  | 'RESOLVED'
  | 'ACCEPTED_EXCEPTION'
  | 'CLOSED';

export type RetrievalClassification =
  | 'AUTHORIZED'
  | 'RESTRICTED'
  | 'DENIED'
  | 'INSUFFICIENT_DATA';

export interface KnowledgeStrategy {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  description: string;
  objectiveCodes: string[];
  ownerUserIdRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDomainGovernance {
  id: string;
  tenantId: string;
  campusId: string;
  domainName: string;
  domainCode: string; // e.g., 'ACADEMICS', 'RESEARCH', 'STRATEGY'
  stewardUserIdRef: string;
  backupStewardUserIdRef?: string;
  isActive: boolean;
  createdAt: string;
}

export interface KnowledgeObject {
  id: string; // knowledgeObjectId
  tenantId: string;
  campusId: string;
  domainCode: string;
  title: string;
  contentReference: string; // Brief reference descriptor, not duplicate content
  status: KnowledgeLifecycleStatus;
  ownerUserIdRef: string;
  stewardUserIdRef: string;
  classificationSensitivity: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  trustScore: number;
  trustClassification: KnowledgeTrustClassification;
  riskLevel: KnowledgeRiskLevel;
  nextReviewDate: string;
  successorObjectIdRef?: string; // For SUPERSEDED status
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSourceReference {
  id: string; // sourceRecordIdRef
  tenantId: string;
  sourceModuleIdRef: string; // e.g. 'Phase 7.49', 'Phase 9.1', 'Phase 9.3'
  sourceDocumentIdRef?: string;
  sourceDecisionIdRef?: string;
  sourceEvidenceIdRef?: string;
  sourceResearchIdRef?: string;
  recordTitle: string;
  recordUri?: string;
  reliabilityScore: number; // 0.0 to 1.0
  verifiedAt?: string;
}

export interface KnowledgeEvidenceReference {
  id: string; // sourceEvidenceIdRef
  knowledgeObjectIdRef: string;
  evidenceType: 'DOCUMENT' | 'AUDIT_LOG' | 'RESEARCH_PAPER' | 'STATISTICAL_OBSERVATION';
  description: string;
  evidenceUri?: string;
  hashChecksum: string; // SHA-256 equivalent checksum
  qualityScore: number; // 0.0 to 1.0
  createdAt: string;
}

export interface KnowledgeProvenanceRecord {
  id: string;
  knowledgeObjectIdRef: string;
  sourceRecordIdRef: string;
  sourceModuleIdRef: string;
  sourceTimestamp: string;
  sourceVersionRef: string;
  evidenceReferences: string[]; // List of sourceEvidenceIdRef
  verificationReferences: string[]; // List of verificationIdRef
  previousProvenanceHash: string;
  provenanceHash: string; // SHA-256 hash of object elements + previous hash
  createdAt: string;
}

export interface KnowledgeVerification {
  id: string;
  knowledgeObjectIdRef: string;
  verifierUserIdRef: string;
  verificationMethod: 'AUTOMATED_DIAGNOSTIC' | 'STEWARD_MANUAL' | 'EXTERNAL_AUDIT' | 'FOUR_EYES_REVIEW';
  status: 'PENDING' | 'PASSED' | 'FAILED';
  verificationNotes: string;
  verifiedAt: string;
}

export interface KnowledgeTrustAssessment {
  id: string;
  knowledgeObjectIdRef: string;
  calculatedTrustScore: number; // 0.0 to 1.0
  classification: KnowledgeTrustClassification;
  authorityScore: number;
  evidenceQualityScore: number;
  freshnessScore: number;
  verificationScore: number;
  sourceReliabilityScore: number;
  provenanceCompletenessScore: number;
  assessedAt: string;
}

export interface KnowledgeLifecycleEvent {
  id: string;
  knowledgeObjectIdRef: string;
  fromStatus: KnowledgeLifecycleStatus;
  toStatus: KnowledgeLifecycleStatus;
  actorUserIdRef: string;
  rationale: string;
  timestamp: string;
}

export interface KnowledgeDecisionRecord {
  id: string; // sourceDecisionIdRef
  tenantId: string;
  campusId: string;
  decisionDate: string;
  decisionAuthorityRef: string; // e.g. Board, President, Academic Senate
  decisionContext: string;
  rationaleReference: string; // Rationale description or record ID
  expectedOutcome: string;
  actualOutcomeReference?: string;
  lessonsLearnedReference?: string; // ID of lessonsLearned
  supersessionReference?: string; // ID of replacing decision
  createdAt: string;
}

export interface KnowledgeDecisionRationale {
  id: string;
  decisionRecordIdRef: string;
  coreJustification: string;
  riskAssessmentReference: string;
  alternativesConsidered: string[];
  createdAt: string;
}

export interface KnowledgeDecisionPrecedent {
  id: string;
  precedentCode: string;
  title: string;
  description: string;
  rulingAuthority: string;
  relevancyTags: string[];
  createdAt: string;
}

export interface KnowledgeLessonLearned {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  rootCause: string;
  remediationAction: string;
  stewardUserIdRef: string;
  createdAt: string;
}

export interface KnowledgeBestPractice {
  id: string;
  domainCode: string;
  title: string;
  guidelines: string;
  ownerUserIdRef: string;
  createdAt: string;
}

export interface KnowledgeInstitutionalInsight {
  id: string;
  title: string;
  insightSummary: string;
  dataBackingReference: string; // Reference to Phase 7.56 or Phase 9.2 Analytics
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface KnowledgeResearchFinding {
  id: string; // sourceResearchIdRef
  researchTitle: string;
  abstractSummary: string;
  methodologyOverview: string;
  peerReviewStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  researcherUserIdRefs: string[];
  publishedDate?: string;
}

export interface KnowledgeContradiction {
  id: string;
  tenantId: string;
  campusId: string;
  knowledgeObjectIdRefA: string;
  knowledgeObjectIdRefB: string;
  conflictType: 'SCHEMA_MISMATCH' | 'SEMANTIC_CONTRADICTION' | 'VERSION_COLLISION' | 'DECISION_CONFLICT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: ConflictResolutionStatus;
  detectedAt: string;
  resolvedAt?: string;
}

export interface KnowledgeConflictResolution {
  id: string;
  contradictionIdRef: string;
  proposedResolution: string;
  resolutionStrategy: 'RETAIN_A_RETIRE_B' | 'RETAIN_B_RETIRE_A' | 'SUPERSEDE_BOTH' | 'MERGE_INTO_NEW' | 'ACCEPT_EXCEPTIONAL_OVERLAP';
  proposerUserIdRef: string;
  approverUserIdRef?: string;
  resolvedAt?: string;
}

export interface KnowledgeReviewCycle {
  id: string;
  knowledgeObjectIdRef: string;
  lastReviewedAt: string;
  reviewFrequencyDays: number;
  nextReviewDate: string;
  stewardUserIdRef: string;
}

export interface KnowledgeIntelligenceException {
  id: string;
  tenantId: string;
  campusId: string;
  exceptionType: 'UNVERIFIED_KNOWLEDGE_USE' | 'MISSING_PROVENANCE' | 'SUPERSEDED_ACTIVE_USE';
  targetEntityIdRef: string;
  businessRationale: string;
  compensatingControls: string;
  proposerUserIdRef: string;
  approverUserIdRef?: string; // Required for four-eyes sign-off
  expiryDate: string; // Must be bounded, not indefinite
  status: 'PROPOSED' | 'APPROVED' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface KnowledgeOverride {
  id: string;
  tenantId: string;
  targetKnowledgeObjectIdRef: string;
  targetField: string; // e.g. 'trustScore', 'riskLevel'
  originalValue: string;
  overriddenValue: string;
  proposerUserIdRef: string;
  approverUserIdRef?: string; // Required for four-eyes sign-off
  expiryDate: string; // Must be bounded, not indefinite
  justification: string;
  createdAt: string;
}

export interface KnowledgeRetrievalRequest {
  id: string;
  tenantId: string;
  campusId: string;
  requesterUserIdRef: string;
  knowledgeDomainCode: string;
  requestedPurpose: string;
  sensitivityLevel: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  requiredFreshnessDays: number;
  requiredAuthorityLevel: number; // 0 to 5
  sourceConstraints?: string[];
  createdAt: string;
}

export interface KnowledgeRetrievalPolicy {
  id: string;
  tenantId: string;
  domainCode: string;
  minimumRequiredRole: string;
  maxSensitivityAllowed: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  requiresFourEyesApprovals: boolean;
  isActive: boolean;
}

export interface KnowledgeRetrievalEvidence {
  id: string;
  retrievalRequestIdRef: string;
  knowledgeObjectIdRef: string;
  provenanceHashRef: string;
  evidenceChecksums: string[];
  verificationStatus: string;
}

export interface KnowledgeAccessDecision {
  id: string;
  retrievalRequestIdRef: string;
  decision: RetrievalClassification;
  assessedPolicyIdRef?: string;
  rejectionReason?: string;
  authorizedAt?: string;
}

export interface KnowledgeIntelligenceRisk {
  id: string;
  tenantId: string;
  targetObjectIdRef?: string;
  riskType: 'STALE_KNOWLEDGE' | 'UNVERIFIED_CLAIM' | 'CONTRADICTION_EXPOSURE' | 'PROVENANCE_BREAK' | 'SENSITIVITY_LEAK';
  inherentScore: number; // 0.0 to 1.0
  residualScore: number; // 0.0 to 1.0
  criticalityScore: number;
  reliabilityDeclineScore: number;
  freshnessDeclineScore: number;
  evidenceDeficiencyScore: number;
  riskRating: KnowledgeRiskLevel;
  mitigationPlan: string;
  createdAt: string;
}

export interface KnowledgeResilienceAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  assessedAt: string;
  vulnerabilityCount: number;
  coverageRatio: number; // 0.0 to 1.0
  criticalDeficiencyCount: number;
  compositeResilienceIndex: number; // 0.0 to 1.0
}

export interface KnowledgeScenario {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface KnowledgeSimulationResult {
  id: string;
  scenarioCode: string;
  simulatedAt: string;
  impactScore: number; // 0.0 to 1.0
  resilienceDelta: number; // delta change, e.g. -0.2
  vulnerabilitiesTriggered: string[];
  diagnosticBanner: string; // Must show SIMULATION ONLY, etc.
}

export interface KnowledgeGovernanceApproval {
  id: string;
  tenantId: string;
  targetEntityIdRef: string;
  actionType: 'PUBLISH' | 'VERIFY' | 'EXCEPTION_APPROVE' | 'OVERRIDE_APPROVE' | 'CONFLICT_RESOLVE' | 'HIGH_RISK_RETRIEVAL' | 'DECISION_CERTIFY';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  actionedAt?: string;
}

export interface KnowledgeGovernanceDecision {
  id: string;
  tenantId: string;
  stewardUserIdRef: string;
  approvalChainIds: string[];
  resolutionNotes: string;
  createdAt: string;
}

export interface KnowledgeGovernanceAuditEvent {
  id: string; // Immutable, append-only
  tenantId: string;
  campusId: string;
  actorUserIdRef: string;
  actionCode: string; // e.g. 'KNOWLEDGE_PUBLISHED', 'EXCEPTION_APPROVED'
  entityIdRef: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface KnowledgeDiagnostic {
  id: string;
  tenantId: string;
  campusId: string;
  diagnosticType: 'OVERDUE_REVIEW' | 'EXPIRED_KNOWLEDGE' | 'STALE_KNOWLEDGE' | 'MISSING_OWNER_STEWARD' | 'MISSING_VERIFICATION' | 'MISSING_EVIDENCE_PROVENANCE' | 'CONTRADICTION_EXISTS' | 'SOD_VIOLATION_ATTEMPT';
  targetEntityIdRef: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  diagnosticMessage: string;
  isResolved: boolean;
  detectedAt: string;
}
