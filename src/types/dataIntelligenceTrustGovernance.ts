// Phase 9.3 - Institutional Data Governance, Intelligence Quality, Decision Provenance & Data Trust Governance types

export type DataQualityStatus =
  | 'EXCELLENT'
  | 'GOOD'
  | 'DEGRADED'
  | 'POOR'
  | 'CRITICAL'
  | 'INSUFFICIENT_DATA'
  | 'CALIBRATION_REQUIRED';

export type DataCertificationStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'PENDING_VERIFICATION'
  | 'CERTIFIED'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'RETIRED';

export type DataAuthorityClassification =
  | 'AUTHORITATIVE'
  | 'SECONDARY'
  | 'REFERENCE'
  | 'DERIVED'
  | 'SCENARIO';

export type DataTrustRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL';

export interface DataTrustStrategy {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  vision: string;
  stewardUserIdRef: string;
  ownerUserIdRef: string;
  targetQualityScore: number;
  maxAllowedRiskLevel: DataTrustRiskLevel;
  isActive: boolean;
  createdAt: string;
}

export interface DataDomainGovernance {
  id: string;
  tenantId: string;
  campusId: string;
  domainName: string; // e.g., Academics, Finance, Human Capital
  domainCode: string;
  stewardUserIdRef: string;
  ownerUserIdRef: string;
  criticalityScore: number; // 1-100
  isActive: boolean;
}

export interface DataSourceReference {
  id: string;
  tenantId: string;
  campusId: string;
  sourceName: string;
  sourceCode: string; // e.g., SIS, ERP, LMS
  connectionStatus: 'ACTIVE' | 'DEGRADED' | 'DISCONNECTED';
  stewardUserIdRef: string;
  lastConnectedAt: string;
}

export interface DataAuthorityDeclaration {
  id: string;
  tenantId: string;
  campusId: string;
  dataDomainIdRef: string;
  dataSourceIdRef: string;
  entityName: string; // e.g., StudentAttendance, GradeRegister
  classification: DataAuthorityClassification;
  declarationRationale: string;
  isApproved: boolean;
  certifiedByUserIdRef?: string;
  createdAt: string;
}

export interface DataQualityPolicy {
  id: string;
  tenantId: string;
  campusId: string;
  dataDomainIdRef: string;
  policyName: string;
  completenessWeight: number;
  accuracyWeight: number;
  timelinessWeight: number;
  consistencyWeight: number;
  uniquenessWeight: number;
  targetThreshold: number; // e.g. 0.95
  isActive: boolean;
}

export interface TrustDataQualityRule {
  id: string;
  tenantId: string;
  policyIdRef: string;
  ruleCode: string;
  dimension: 'completeness' | 'accuracy' | 'timeliness' | 'consistency' | 'uniqueness';
  description: string;
  expression: string;
  errorThreshold: number;
  isActive: boolean;
}

export interface DataQualityObservation {
  id: string;
  tenantId: string;
  campusId: string;
  dataDomainIdRef: string;
  sourceRecordIdRef: string; // reference-only
  sourceModuleIdRef: string; // reference-only
  completeness: number; // 0.0 to 1.0
  accuracy: number;     // 0.0 to 1.0
  timeliness: number;   // 0.0 to 1.0
  consistency: number;  // 0.0 to 1.0
  uniqueness: number;   // 0.0 to 1.0
  overallQualityScore: number; // calculated weighted average, bounded [0.0 - 1.0]
  status: DataQualityStatus;
  measuredAt: string;
  diagnosticNotes?: string;
}

export interface DataQualityRemediation {
  id: string;
  tenantId: string;
  observationIdRef: string;
  assignedToUserIdRef: string;
  remediationAction: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'BYPASSED';
  createdAt: string;
  resolvedAt?: string;
}

export interface TrustDataCertification {
  id: string;
  tenantId: string;
  campusId: string;
  dataDomainIdRef: string;
  entityName: string;
  version: string;
  status: DataCertificationStatus;
  overallQualityScore: number;
  issuedAt: string;
  expiresAt: string;
  certifiedByUserIdRef: string;
}

export interface DataCertificationReview {
  id: string;
  tenantId: string;
  certificationIdRef: string;
  reviewerUserIdRef: string;
  reviewDecision: 'APPROVE' | 'REJECT';
  comments: string;
  reviewedAt: string;
}

export interface DataProvenanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  sourceRecordIdRef: string;
  sourceModuleIdRef: string;
  authoritativeSystemIdRef: string;
  calculationBasis: string;
  transformationReferences: string[];
  versionReferences: string[];
  provenanceHash: string; // deterministic SHA-256
  previousProvenanceHash: string; // for ledger continuity
  createdAt: string;
}

export interface TrustDataLineageNode {
  id: string;
  label: string;
  type: 'SOURCE_SYSTEM' | 'DATALAKE' | 'TRANSFORM' | 'ANALYTICS_INPUT' | 'DECISION_OUTPUT';
  moduleCode?: string;
  systemCode?: string;
}

export interface TrustDataLineageEdge {
  id: string;
  sourceId: string;
  targetId: string;
  transformationType: string;
}

export interface DataContractReference {
  id: string;
  tenantId: string;
  campusId: string;
  contractName: string;
  publisherModuleIdRef: string;
  subscriberModuleIdRef: string;
  schemaVersion: string;
  isComplianceActive: boolean;
  createdAt: string;
}

export interface DataSourceReliabilityObservation {
  id: string;
  tenantId: string;
  dataSourceIdRef: string;
  availabilityRate: number; // 0.0 to 1.0
  latencyMs: number;
  outageMinutesCount: number;
  measuredAt: string;
}

export interface DataReconciliationObservation {
  id: string;
  tenantId: string;
  campusId: string;
  sourceSystemA: string;
  sourceSystemB: string;
  recordCountA: number;
  recordCountB: number;
  varianceCount: number;
  reconciliationStatus: 'MATCHED' | 'MISMATCHED' | 'CRITICAL_VARIANCE';
  measuredAt: string;
}

export interface DataException {
  id: string;
  tenantId: string;
  campusId: string;
  dataDomainIdRef: string;
  businessRationale: string;
  riskAssessment: string;
  compensatingControlRef: string;
  requesterUserIdRef: string;
  independentApproverUserIdRef: string;
  creationTimestamp: string;
  mandatoryExpiryTimestamp: string; // must not be indefinite
  isApproved: boolean;
}

export interface DataOverride {
  id: string;
  tenantId: string;
  campusId: string;
  indicatorIdRef: string; // reference-only from Phase 9.1
  originalValue: number;
  overriddenValue: number;
  businessRationale: string;
  riskAssessment: string;
  compensatingControlRef: string;
  requesterUserIdRef: string;
  independentApproverUserIdRef: string;
  creationTimestamp: string;
  mandatoryExpiryTimestamp: string;
  isApproved: boolean;
}

export interface DataDecisionProvenance {
  id: string;
  tenantId: string;
  decisionBriefIdRef: string; // reference-only from Phase 9.2
  inputProvenanceHashes: string[];
  decisionStewardUserIdRef: string;
  cryptographicSignature: string;
  signedAt: string;
}

export interface DecisionIntegrityObservation {
  id: string;
  tenantId: string;
  campusId: string;
  diagnosticType: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  affectedEntityIdRef: string;
  resolved: boolean;
  detectedAt: string;
}

export interface DataTrustRisk {
  id: string;
  tenantId: string;
  campusId: string;
  riskCategory: string;
  criticalityScore: number;
  sensitivityScore: number;
  qualityDegradationScore: number;
  sourceConcentrationScore: number;
  dependencyConcentrationScore: number;
  provenanceWeaknessScore: number;
  reconciliationFailureScore: number;
  availabilityExposureScore: number;
  overallRiskScore: number; // bounded [0-100]
  level: DataTrustRiskLevel;
  measuredAt: string;
}

export interface DataTrustAssessment {
  id: string;
  tenantId: string;
  assessmentName: string;
  assessorUserIdRef: string;
  overallScore: number;
  recommendations: string[];
  createdAt: string;
}

export interface DataTrustScenario {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface DataTrustSimulationResult {
  scenarioCode: string;
  scenarioName: string;
  impactScore: number; // 0-100
  simulatedQualityScore: number; // [0.0 - 1.0]
  simulatedRiskLevel: DataTrustRiskLevel;
  remediationSteps: string[];
  diagnosticBanner: string; // "SIMULATION ONLY | SANDBOX MODE ACTIVE | ZERO PRODUCTION MUTATION"
}

export interface DataGovernanceApproval {
  id: string;
  tenantId: string;
  requestType: 'CERTIFICATION' | 'EXCEPTION' | 'OVERRIDE' | 'AUTHORITY_DECLARATION';
  targetEntityIdRef: string;
  proposerUserIdRef: string;
  approverUserIdRef: string; // SoD: proposerUserIdRef !== approverUserIdRef
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  actionedAt?: string;
}

export interface TrustDataGovernanceDecision {
  id: string;
  tenantId: string;
  stewardUserIdRef: string;
  resolutionNote: string;
  isExecuted: boolean;
  createdAt: string;
}

export interface TrustDataGovernanceAuditEvent {
  id: string; // Immutable, append-only
  tenantId: string;
  campusId: string;
  actorUserIdRef: string;
  actionCode: string;
  targetEntityIdRef: string;
  previousHash: string;
  currentHash: string;
  timestamp: string;
}

export interface DataGovernanceDiagnostic {
  id: string;
  tenantId: string;
  ruleCode: string;
  findingType: string;
  description: string;
  isViolation: boolean;
  detectedAt: string;
}
