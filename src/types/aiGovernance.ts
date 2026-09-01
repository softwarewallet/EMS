export interface AIProvider {
  id: string;
  tenantId: string;
  name: string;
  providerType: 'INTERNAL' | 'CLOUD' | 'ON_PREMISE' | 'HYBRID';
  serviceCategory: 'LLM' | 'VISION' | 'TTS_STT' | 'EMBEDDING' | 'CUSTOM_ML';
  securityClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  contractualStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'UNDER_REVIEW';
  dataProcessingAllowed: boolean;
  externalTransferAllowed: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface AISystem {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  purpose: string;
  ownerId: string;
  providerId: string;
  riskTier: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  lifecycleStatus: 'DRAFT' | 'SUBMITTED' | 'RISK_ASSESSED' | 'EVALUATION_REQUIRED' | 'EVALUATED' | 'VERIFIED' | 'APPROVED' | 'DEPLOYED' | 'MONITORED' | 'SUSPENDED' | 'RETIRED' | 'ARCHIVED';
  humanOversightRequired: 'REQUIRED' | 'CONDITIONAL' | 'OPTIONAL';
  productionStatus: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'SUSPENDED';
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface AIModel {
  id: string;
  tenantId: string;
  systemId: string;
  modelName: string;
  modelType: string;
  providerId: string;
  purpose: string;
  capabilityClass: string;
  riskTier: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
  deploymentEnvironment: 'LOCAL' | 'EDGE' | 'CLOUD';
  lifecycleStatus: 'DRAFT' | 'APPROVED' | 'RETIRED';
  ownerId: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIModelVersion {
  id: string;
  tenantId: string;
  modelId: string;
  version: string;
  artifactReference: string;
  checksum: string;
  releaseDate: string;
  evaluationStatus: 'PENDING' | 'PASSED' | 'FAILED';
  securityStatus: 'SECURE' | 'VULNERABLE' | 'UNASSESSED';
  biasStatus: 'VERIFIED' | 'BIASED' | 'UNASSESSED';
  privacyStatus: 'COMPLIANT' | 'BREACHED' | 'UNASSESSED';
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  deployedAt?: string;
  retiredAt?: string;
}

export interface AIUseCase {
  id: string;
  tenantId: string;
  intendedPurpose: string;
  affectedPopulation: string;
  decisionImpact: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  humanDecisionRequired: boolean;
  riskTier: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
  prohibitedUseFlag: boolean;
  approvalStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

export interface AIRiskAssessment {
  id: string;
  tenantId: string;
  targetId: string; // AI System ID or AI Use Case ID
  privacyScore: number; // 1 - 100
  securityScore: number; // 1 - 100
  biasScore: number; // 1 - 100
  accuracyScore: number; // 1 - 100
  hallucinationScore: number; // 1 - 100
  explainabilityScore: number; // 1 - 100
  operationalScore: number; // 1 - 100
  studentImpactScore: number; // 1 - 100
  overallRiskTier: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
  evaluatedBy: string;
  evaluatedAt: string;
  justification: string;
}

export interface AIEvaluation {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  metricType: 'ACCURACY' | 'BIAS' | 'HALLUCINATION' | 'FAIRNESS' | 'PRIVACY';
  thresholdValue: number;
  createdAt: string;
  createdBy: string;
}

export interface AIEvaluationRun {
  id: string;
  tenantId: string;
  datasetReference: string;
  modelVersionId: string;
  evaluatorId: string;
  startedAt: string;
  completedAt?: string;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    fairnessScore: number;
    hallucinationRate: number;
    privacyPass: boolean;
  };
  findings: string;
  certificationStatus: 'UNCERTIFIED' | 'CERTIFIED' | 'REJECTED';
  certifiedBy?: string;
  certifiedAt?: string;
}

export interface AIDataset {
  id: string;
  tenantId: string;
  name: string;
  sourceModule: string;
  sourceCollection: string;
  sourceFields: string[];
  lineageReference: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  consentBasis: string;
  retentionPolicy: string;
  permittedPurpose: string;
  approvedUse: string;
  verificationStatus: 'UNVERIFIED' | 'VERIFIED' | 'REJECTED';
}

export interface AIPromptTemplate {
  id: string;
  tenantId: string;
  name: string;
  version: string;
  purpose: string;
  content: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
  owner: string;
  prohibitedInstructions: string[];
  approvalStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
  testStatus: 'UNTESTED' | 'PASSED' | 'FAILED';
  lifecycleStatus: 'ACTIVE' | 'DEPRECATED' | 'RETIRED';
}

export interface AIAgent {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  toolAccess: string[];
  workflowAccess: string[];
  dataAccess: string[];
  maximumExecutionDepth: number;
  approvalRequirements: 'NONE' | 'SUPERVISORY' | 'CAB_PEER_REVIEW';
  humanEscalationRules: string[];
  permittedActions: string[];
  prohibitedActions: string[];
  riskTier: 'MINIMAL' | 'LIMITED' | 'HIGH' | 'CRITICAL' | 'PROHIBITED';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
}

export interface AIDecisionRecord {
  id: string;
  tenantId: string;
  sourceModule: string;
  sourceRecordId: string;
  aiRecommendation: string;
  humanDecision: string;
  humanDecisionMaker: string;
  recommendationAccepted: boolean;
  recommendationOverridden: boolean;
  overrideReason?: string;
  explainabilityReference?: string;
  timestamp: string;
}

export interface AIIncident {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  incidentType: 'hallucination' | 'privacy_breach' | 'unauthorized_data_exposure' | 'bias' | 'unsafe_recommendation' | 'agent_runaway' | 'policy_violation';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'TRIAGED' | 'INVESTIGATING' | 'CONTAINED' | 'REMEDIATING' | 'VERIFIED' | 'CLOSED';
  affectedSystemId: string;
  reportedBy: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIExceptionRequest {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  justification: string;
  requestedScope: string;
  expirationDate: string;
  riskAssessment: string;
  requestedBy: string;
  approvedBy?: string;
  approvalTimestamp?: string;
  status: 'REQUESTED' | 'RISK_REVIEW' | 'APPROVED' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'CLOSED' | 'REJECTED';
}

export interface AIPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  riskTierRestrictions: Record<string, string>;
  isEnabled: boolean;
  createdAt: string;
  createdBy: string;
}

export interface AIComplianceAssessment {
  id: string;
  tenantId: string;
  systemId: string;
  assessedAt: string;
  assessedBy: string;
  complianceScore: number; // 0 - 100
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT';
}

export interface AIGovernanceReview {
  id: string;
  tenantId: string;
  systemId: string;
  reviewedAt: string;
  reviewedBy: string;
  findings: string;
  actionPlan: string;
  nextReviewDate: string;
}

export interface AIDataQualityIssue {
  id: string;
  tenantId: string;
  issueType: 'orphan_model' | 'invalid_dataset' | 'missing_classification' | 'expired_approval' | 'missing_evaluation' | 'expired_exception' | 'unverified_lineage' | 'retired_model_referenced' | 'unauthorized_provider' | 'incomplete_human_oversight';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
  detectedAt: string;
}

export interface AIAuditLog {
  id: string;
  tenantId: string;
  actorId: string;
  actorDisplayName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  previousState?: string;
  newState?: string;
  justification?: string;
}
