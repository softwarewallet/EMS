// Institutional Cybersecurity, Information Security, Privacy, Identity, Access, Zero-Trust & Digital Trust Governance Engine Types (Phase 7.70)

export type CyberSecurityMaturityLevel = 'INITIAL' | 'DEVELOPING' | 'DEFINED' | 'MANAGED' | 'OPTIMIZED';

export type CyberControlStatus = 'CONTROLLED' | 'PARTIALLY_IMPLEMENTED' | 'FAILED' | 'EXCEPTION' | 'NOT_ASSESSED' | 'INSUFFICIENT_DATA';

export type CyberRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type CyberResilienceRating = 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';

export type CyberSeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SimulationScenarioType =
  | 'RANSOMWARE_OUTBREAK'
  | 'IDENTITY_PROVIDER_OUTAGE'
  | 'PRIVILEGED_ACCOUNT_COMPROMISE'
  | 'CRITICAL_APPLICATION_BREACH'
  | 'DATA_EXFILTRATION'
  | 'CLOUD_REGION_OUTAGE'
  | 'DNS_OUTAGE'
  | 'CERTIFICATE_EXPIRY'
  | 'SUPPLIER_CYBER_BREACH'
  | 'DLP_CONTROL_FAILURE'
  | 'BACKUP_FAILURE'
  | 'SIEM_OUTAGE'
  | 'EDR_OUTAGE'
  | 'ZERO_TRUST_POLICY_FAILURE'
  | 'MASS_ACCOUNT_COMPROMISE';

export interface CyberSecurityStrategy {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  version: string;
  timeHorizon: string;
  visionStatement: string;
  pillars: {
    id: string;
    name: string;
    description: string;
    maturityLevel: CyberSecurityMaturityLevel;
    completionPercentage: number;
  }[];
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  updatedAt: string;
}

export interface SecurityPlan {
  id: string;
  tenantId: string;
  campusId: string;
  strategyId: string;
  name: string;
  ownerIdRef: string;
  objectivesCount: number;
  status: 'APPROVED' | 'IN_REVIEW' | 'DRAFT';
  updatedAt: string;
}

export interface SecurityObjective {
  id: string;
  tenantId: string;
  planId: string;
  title: string;
  metricTarget: string;
  currentProgress: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'ACHIEVED';
}

export interface SecurityMaturityAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  assessmentDate: string;
  assessorIdRef: string;
  dimensions: {
    dimension: string;
    maturityLevel: CyberSecurityMaturityLevel;
    score: number; // 0-100
    gapAnalysis: string;
  }[];
  overallMaturityScore: number;
}

export interface InformationSecurityPolicy {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  code: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  version: string;
  ownerIdRef: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'RETIRED';
}

export interface SecurityStandard {
  id: string;
  tenantId: string;
  policyIdRef: string;
  title: string;
  referenceFramework: string;
  mandatory: boolean;
  compliancePercentage: number;
}

export interface SecurityControl {
  id: string;
  tenantId: string;
  standardIdRef: string;
  controlCode: string;
  title: string;
  domain: string;
  status: CyberControlStatus;
  ownerIdRef: string;
  lastTestedDate?: string;
}

export interface SecurityControlTest {
  id: string;
  tenantId: string;
  controlIdRef: string;
  testDate: string;
  testerIdRef: string;
  result: 'PASSED' | 'FAILED' | 'INCONCLUSIVE';
  evidenceReference: string;
}

export interface SecurityControlException {
  id: string;
  tenantId: string;
  campusId: string;
  controlIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  justification: string;
  expirationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}

export interface SecurityAssuranceAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  overallAssuranceScore: number;
  compliantControlsCount: number;
  totalControlsCount: number;
  updatedAt: string;
}

export interface IdentityGovernanceProfile {
  id: string;
  tenantId: string;
  campusId: string;
  identityIdRef: string;
  principalName: string;
  userType: 'STUDENT' | 'STAFF' | 'FACULTY' | 'CONTRACTOR' | 'SYSTEM';
  lifecycleState: 'PROVISIONED' | 'ACTIVE' | 'DORMANT' | 'SUSPENDED' | 'OFFBOARDED';
  mfaEnabled: boolean;
  lastAuthenticationTimestamp?: string;
  riskScore: number;
}

export interface IdentityLifecycleObservation {
  id: string;
  tenantId: string;
  identityIdRef: string;
  eventType: 'JOINER' | 'MOVER' | 'LEAVER' | 'ROLE_CHANGE';
  timestamp: string;
  authorizedByRef: string;
}

export interface AuthenticationAssuranceObservation {
  id: string;
  tenantId: string;
  identityIdRef: string;
  authMethod: 'FIDO2' | 'TOTP' | 'SMS_OTP' | 'PASSWORD_ONLY';
  assuranceLevel: 'IAL1' | 'IAL2' | 'IAL3';
  verifiedAt: string;
}

export interface IdentityRiskObservation {
  id: string;
  tenantId: string;
  identityIdRef: string;
  riskFactor: string;
  severity: CyberSeverityLevel;
  detectedAt: string;
}

export interface AccessGovernanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  identityIdRef: string;
  entitlementIdRef: string;
  roleIdRef: string;
  grantedByRef: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expiresAt?: string;
}

export interface EntitlementReference {
  id: string;
  tenantId: string;
  name: string;
  systemIdRef: string;
  sensitivityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'RESTRICTED';
}

export interface CyberRoleGovernanceRecord {
  id: string;
  tenantId: string;
  roleName: string;
  privileged: boolean;
  sodConflictPotential: boolean;
  entitlementCount: number;
}

export interface AccessReview {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  reviewerIdRef: string;
  scope: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

export interface AccessReviewFinding {
  id: string;
  tenantId: string;
  reviewIdRef: string;
  accessRecordIdRef: string;
  findingType: 'EXCESSIVE_PRIVILEGE' | 'DORMANT_ACCESS' | 'SOD_VIOLATION' | 'VALID';
  actionTaken: 'REVOKED' | 'RETAINED' | 'ESCALATED';
}

export interface AccessCertification {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  certifiedByIdRef: string;
  certifiedAt: string;
  itemsCertifiedCount: number;
  status: 'CERTIFIED' | 'REJECTED_ITEMS' | 'PENDING';
}

export interface PrivilegedAccessGovernance {
  id: string;
  tenantId: string;
  campusId: string;
  identityIdRef: string;
  privilegedRoleIdRef: string;
  justification: string;
  approvedByIdRef: string;
  maxDurationHours: number;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
}

export interface EmergencyAccessGovernance {
  id: string;
  tenantId: string;
  campusId: string;
  identityIdRef: string;
  activatedAt: string;
  justification: string;
  auditedByIdRef: string;
  sessionDurationMinutes: number;
  status: 'CLOSED' | 'ACTIVE' | 'FLAGGED';
}

export interface CyberZeroTrustPolicy {
  id: string;
  tenantId: string;
  campusId: string;
  policyName: string;
  enforcementLevel: 'MONITOR' | 'ENFORCE' | 'STRICT';
  targetDomain: 'IDENTITY' | 'DEVICE' | 'APPLICATION' | 'NETWORK' | 'DATA';
  status: 'ACTIVE' | 'DRAFT';
}

export interface ZeroTrustDomain {
  id: string;
  tenantId: string;
  name: string;
  postureScore: number;
  policiesCount: number;
}

export interface TrustSignalObservation {
  id: string;
  tenantId: string;
  identityIdRef: string;
  deviceIdRef: string;
  signalType: string;
  trustScore: number;
  timestamp: string;
}

export interface ConditionalAccessGovernance {
  id: string;
  tenantId: string;
  policyIdRef: string;
  conditionDescription: string;
  action: 'ALLOW' | 'BLOCK' | 'MFA_REQUIRED' | 'COMPLIANT_DEVICE_REQUIRED';
}

export interface DeviceTrustReference {
  id: string;
  tenantId: string;
  deviceIdRef: string;
  identityIdRef: string;
  isCompliant: boolean;
  osVersion: string;
  encryptionEnabled: boolean;
}

export interface NetworkTrustReference {
  id: string;
  tenantId: string;
  networkSegment: string;
  securedByZTNA: boolean;
}

export interface SessionRiskObservation {
  id: string;
  tenantId: string;
  identityIdRef: string;
  sessionId: string;
  riskScore: number;
  actionTaken: 'ALLOW' | 'STEP_UP_AUTH' | 'TERMINATE';
}

export interface CyberRisk {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  category: string;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  riskLevel: CyberRiskLevel;
  ownerIdRef: string;
  status: 'OPEN' | 'MITIGATED' | 'ACCEPTED' | 'TRANSFER';
}

export interface ThreatObservation {
  id: string;
  tenantId: string;
  threatType: string;
  sourceIndicator: string;
  severity: CyberSeverityLevel;
  detectedAt: string;
}

export interface VulnerabilityObservation {
  id: string;
  tenantId: string;
  assetIdRef: string;
  vulnerabilityIdRef: string;
  cvssScore: number;
  severity: CyberSeverityLevel;
  status: 'OPEN' | 'REMEDIATED' | 'ACCEPTED';
}

export interface ExposureObservation {
  id: string;
  tenantId: string;
  assetIdRef: string;
  exposureType: string;
  severity: CyberSeverityLevel;
}

export interface RiskTreatmentPlan {
  id: string;
  tenantId: string;
  riskIdRef: string;
  strategy: 'MITIGATE' | 'ACCEPT' | 'TRANSFER' | 'AVOID';
  actionItems: string;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface ResidualCyberRisk {
  id: string;
  tenantId: string;
  riskIdRef: string;
  residualLikelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  residualImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  residualScore: number;
  approvedByIdRef: string;
}

export interface CyberSecurityIncidentReference {
  id: string;
  tenantId: string;
  campusId: string;
  incidentIdRef: string;
  title: string;
  severity: CyberSeverityLevel;
  category: string;
  status: 'CONTAINED' | 'RESOLVED' | 'INVESTIGATING' | 'CLOSED';
  detectedAt: string;
}

export interface IncidentSeverityObservation {
  id: string;
  tenantId: string;
  incidentIdRef: string;
  businessImpactScore: number;
  regulatoryReportingRequired: boolean;
}

export interface IncidentResponseGovernance {
  id: string;
  tenantId: string;
  incidentIdRef: string;
  playbookIdRef: string;
  commanderIdRef: string;
  status: 'ACTIVE' | 'STAND_DOWN';
}

export interface IncidentPostureAssessment {
  id: string;
  tenantId: string;
  readinessScore: number;
  meanTimeToDetectMinutes: number;
  meanTimeToContainMinutes: number;
}

export interface LessonsLearnedReference {
  id: string;
  tenantId: string;
  incidentIdRef: string;
  summary: string;
  correctiveActionsCount: number;
}

export interface PrivacyGovernanceRecord {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  dataSubjectCategory: string;
  processingPurpose: string;
  lawfulBasis: string;
  retentionPeriodDays: number;
  status: 'ACTIVE' | 'REVIEW' | 'ARCHIVED';
}

export interface PersonalDataProcessingReference {
  id: string;
  tenantId: string;
  privacyRecordIdRef: string;
  systemIdRef: string;
  dataElements: string[];
}

export interface PrivacyImpactAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  privacyOfficerIdRef: string;
  riskLevel: CyberRiskLevel;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  completedAt: string;
}

export interface DataProtectionAssessment {
  id: string;
  tenantId: string;
  piaIdRef: string;
  technicalSafeguardsVerified: boolean;
  organizationalSafeguardsVerified: boolean;
  approvalStatus: 'APPROVED' | 'CONDITIONAL' | 'REJECTED';
}

export interface PrivacyRisk {
  id: string;
  tenantId: string;
  privacyRecordIdRef: string;
  description: string;
  severity: CyberSeverityLevel;
  mitigationStatus: 'MITIGATED' | 'OPEN';
}

export interface PrivacyControl {
  id: string;
  tenantId: string;
  controlCode: string;
  title: string;
  implemented: boolean;
}

export interface PrivacyException {
  id: string;
  tenantId: string;
  privacyRecordIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  justification: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface DataProtectionRequirement {
  id: string;
  tenantId: string;
  title: string;
  mandate: string;
  compliant: boolean;
}

export interface EncryptionGovernance {
  id: string;
  tenantId: string;
  scope: string;
  atRestAlgorithm: string;
  inTransitAlgorithm: string;
  compliant: boolean;
}

export interface KeyManagementReference {
  id: string;
  tenantId: string;
  kmsSystemRef: string;
  keyRotationDays: number;
  hsmProtected: boolean;
}

export interface BackupProtectionReference {
  id: string;
  tenantId: string;
  backupVaultIdRef: string;
  immutableBackups: boolean;
  lastTestedRestoreDate: string;
}

export interface DataLossPreventionReference {
  id: string;
  tenantId: string;
  dlpEngineRef: string;
  activePoliciesCount: number;
  blockEventsLast30Days: number;
}

export interface CyberVendorRisk {
  id: string;
  tenantId: string;
  campusId: string;
  vendorIdRef: string;
  vendorName: string;
  riskRating: CyberRiskLevel;
  soc2Type2Verified: boolean;
  iso27001Certified: boolean;
  lastAssessmentDate: string;
  status: 'APPROVED' | 'CONDITIONAL' | 'RESTRICTED';
}

export interface ThirdPartySecurityAssessment {
  id: string;
  tenantId: string;
  vendorIdRef: string;
  assessorIdRef: string;
  score: number;
  completedAt: string;
}

export interface SecurityDueDiligence {
  id: string;
  tenantId: string;
  vendorIdRef: string;
  questionnaireCompleted: boolean;
  legalClausesVerified: boolean;
}

export interface SupplierSecurityException {
  id: string;
  tenantId: string;
  vendorIdRef: string;
  justification: string;
  approverIdRef: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface CertificateGovernanceReference {
  id: string;
  tenantId: string;
  certificateIdRef: string;
  commonName: string;
  issuer: string;
  expirationDate: string;
  daysToExpiry: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface PKIGovernanceReference {
  id: string;
  tenantId: string;
  pkiArchitectureRef: string;
  internalCaActive: boolean;
}

export interface DigitalSignatureGovernance {
  id: string;
  tenantId: string;
  signingServiceRef: string;
  qualifiedSignaturesEnforced: boolean;
}

export interface TrustServiceReference {
  id: string;
  tenantId: string;
  serviceName: string;
  trustStatus: 'TRUSTED' | 'UNTRUSTED';
}

export interface CyberResilienceAssessment {
  id: string;
  tenantId: string;
  campusId: string;
  assessmentDate: string;
  detectionScore: number;
  responseScore: number;
  recoveryScore: number;
  overallRating: CyberResilienceRating;
}

export interface RecoveryCapabilityReference {
  id: string;
  tenantId: string;
  systemIdRef: string;
  rtoTargetHours: number;
  rpoTargetHours: number;
  drTested: boolean;
}

export interface CyberDependencyReference {
  id: string;
  tenantId: string;
  assetIdRef: string;
  dependentAssetIdRef: string;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CyberResilienceScenario {
  id: string;
  name: string;
  description: string;
  defaultImpactScore: number;
}

export interface CyberSecurityDecision {
  id: string;
  tenantId: string;
  campusId: string;
  title: string;
  decisionMakerIdRef: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  rationale: string;
  createdAt: string;
}

export interface SecurityApproval {
  id: string;
  tenantId: string;
  entityIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  timestamp: string;
}

export interface PrivacyApproval {
  id: string;
  tenantId: string;
  piaIdRef: string;
  privacyOfficerIdRef: string;
  status: 'APPROVED' | 'REJECTED';
}

export interface AccessApproval {
  id: string;
  tenantId: string;
  accessRecordIdRef: string;
  requesterIdRef: string;
  approverIdRef: string;
  status: 'APPROVED' | 'REJECTED';
}

export interface CyberSecurityAuditEvent {
  id: string;
  tenantId: string;
  campusId: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  previousStateHash?: string;
  resultingStateHash: string;
  details: string;
}

export interface DiagnosticFinding {
  id: string;
  tenantId: string;
  campusId: string;
  category: 'IDENTITY' | 'ACCESS' | 'ZERO_TRUST' | 'RISK' | 'PRIVACY' | 'COMPLIANCE' | 'RESILIENCE';
  severity: CyberSeverityLevel;
  title: string;
  description: string;
  remediationRecommendation: string;
}

export interface SimulationResult {
  scenarioType: SimulationScenarioType;
  scenarioName: string;
  description: string;
  resilienceImpactScore: number;
  affectedSystems: string[];
  financialExposureEstimate: number;
  mitigationRecommendations: string[];
}
