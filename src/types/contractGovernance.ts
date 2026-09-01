export type ContractStrategyStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'UNDER_REVIEW' 
  | 'SUPERSEDED' 
  | 'ARCHIVED';

export type ContractIntakeStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'SCREENING' 
  | 'REVIEW' 
  | 'APPROVAL' 
  | 'EXECUTION' 
  | 'ACTIVE' 
  | 'CLOSED' 
  | 'ARCHIVED';

export type ContractCriticality = 'STANDARD' | 'IMPORTANT' | 'CRITICAL' | 'MISSION_CRITICAL';
export type ContractRiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ContractReviewStatus = 'NOT_REQUIRED' | 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CONDITIONAL';
export type ObligationLifecycle = 'IDENTIFIED' | 'ACTIVE' | 'DUE' | 'COMPLETED' | 'BREACHED' | 'WAIVED' | 'CLOSED';
export type ContractRiskLifecycle = 'IDENTIFIED' | 'PLANNED' | 'IN_PROGRESS' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';

export interface ContractStrategyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  strategicObjectives: string[];
  contractPortfolioPriorities: string[];
  riskAppetite: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  criticalAgreementCategories: string[];
  standardizationObjectives: string[];
  supplierDependencyObjectives: string[];
  resilienceObjectives: string[];
  planningHorizonYears: number;
  ownerId: string;
  status: ContractStrategyStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractPlanGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyId: string;
  fiscalHorizon: string;
  plannedAgreementsJson: string;
  strategicProjectRefs: string[];
  procurementRefs: string[];
  budgetRefs: string[];
  grantRefs: string[];
  contractCriticality: ContractCriticality;
  renewalWorkloadForecast: number;
  legalWorkloadForecast: number;
  complianceWorkloadForecast: number;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractIntakeGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  contractIdRef?: string;
  requestingDepartmentIdRef: string;
  vendorIdRef: string;
  procurementRequestIdRef?: string;
  contractCategory: string;
  businessPurpose: string;
  urgency: 'ROUTINE' | 'HIGH' | 'URGENT' | 'CRITICAL';
  estimatedRisk: ContractRiskTier;
  requiredReviewsJson: string; // Legal, Compliance, Commercial, Security, Privacy
  status: ContractIntakeStatus;
  requesterId: string;
  proposerId: string;
  screenedBy?: string;
  screenedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractClassificationGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractIdRef: string;
  operationalCriticality: ContractCriticality;
  financialSignificanceRef: 'LOW' | 'MEDIUM' | 'HIGH' | 'SIGNIFICANT';
  dataSensitivity: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  cybersecuritySensitivity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  regulatorySensitivity: 'LOW' | 'MODERATE' | 'HIGH' | 'STRICT';
  strategicImportance: 'STANDARD' | 'IMPORTANT' | 'CRITICAL' | 'PIVOTAL';
  thirdPartyDependencyRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  continuityImpact: 'NEGLIGIBLE' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  overallCriticality: ContractCriticality;
  determinedBy: string;
  determinedAt: string;
}

export interface ContractGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  contractIdRef: string;
  contractVersionIdRef: string;
  title: string;
  vendorIdRef: string;
  ownerId: string;
  businessUnitIdRef: string;
  category: string;
  criticality: ContractCriticality;
  effectiveState: 'DRAFT' | 'EXECUTED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  renewalState: 'NOT_DUE' | 'WINDOW_OPEN' | 'REVIEW_REQUIRED' | 'RENEWAL_RECOMMENDED' | 'NON_RENEWING';
  riskState: ContractRiskTier;
  complianceState: 'COMPLIANT' | 'NEEDS_REVIEW' | 'BREACH_IDENTIFIED' | 'EXEMPTED';
  startDate: string;
  endDate: string;
  renewalNoticeDays: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractVersionGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  contractIdRef: string;
  contractVersionIdRef: string;
  versionNumber: string;
  changeSummary: string;
  changeClassification: 'MINOR' | 'ADMINISTRATIVE' | 'MATERIAL' | 'MAJOR_REVISION';
  approvalState: 'PENDING' | 'APPROVED' | 'REJECTED';
  legalReviewState: ContractReviewStatus;
  commercialReviewState: ContractReviewStatus;
  securityReviewState: ContractReviewStatus;
  privacyReviewState: ContractReviewStatus;
  effectiveState: 'DRAFT' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED';
  createdBy: string;
  createdAt: string;
}

export interface ContractApprovalGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  approvalType: 'INTAKE' | 'EXECUTION' | 'AMENDMENT' | 'TERMINATION' | 'HIGH_RISK_ACCEPTANCE' | 'EXCEPTION' | 'DISPUTE' | 'CLAIM';
  proposerId: string;
  approverId: string;
  decision: 'APPROVED' | 'REJECTED';
  justification?: string;
  authorizationScope: string;
  idempotencyKey: string;
  timestamp: string;
}

export interface ContractRiskAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  contractIdRef: string;
  legalRiskScore: number;
  regulatoryRiskScore: number;
  financialRiskScore: number;
  commercialRiskScore: number;
  operationalRiskScore: number;
  cybersecurityRiskScore: number;
  privacyRiskScore: number;
  dataRiskScore: number;
  reputationalRiskScore: number;
  dependencyRiskScore: number;
  continuityRiskScore: number;
  geopoliticalRiskScore: number;
  supplierRiskScore: number;
  strategicRiskScore: number;
  overallRiskScore: number;
  overallRiskTier: ContractRiskTier;
  assessedBy: string;
  assessedAt: string;
}

export interface ContractRiskMitigation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractRiskAssessmentId: string;
  identifiedRiskTitle: string;
  mitigationPlan: string;
  ownerId: string;
  dueDate: string;
  evidenceRef?: string;
  residualRiskScore: number;
  lifecycle: ContractRiskLifecycle;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractLegalReview {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  legalRecordIdRef: string;
  reviewerId: string;
  reviewStatus: ContractReviewStatus;
  governingLaw: string;
  jurisdiction: string;
  liabilityCapsVerified: boolean;
  indemnityBalanced: boolean;
  ipOwnershipProtected: boolean;
  disputeResolutionClauseVerified: boolean;
  legalRiskTier: ContractRiskTier;
  findings?: string;
  reviewedAt: string;
}

export interface ContractComplianceReview {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  reviewerId: string;
  reviewStatus: ContractReviewStatus;
  regulatoryObligationsVerified: boolean;
  institutionalPoliciesVerified: boolean;
  mandatoryClausesIncluded: boolean;
  recordsRetentionClauseVerified: boolean;
  reportingRequirementsVerified: boolean;
  conflictRequirementsVerified: boolean;
  jurisdictionalConstraintsVerified: boolean;
  findings?: string;
  reviewedAt: string;
}

export interface ContractCommercialReview {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  reviewerId: string;
  reviewStatus: ContractReviewStatus;
  pricingScheduleRef: string;
  paymentTermsRef: string;
  terminationLiabilityExposure: 'LOW' | 'MEDIUM' | 'HIGH' | 'CAPPED';
  renewalExposureScore: number;
  financialRiskRating: ContractRiskTier;
  commercialExceptionsFound: boolean;
  findings?: string;
  reviewedAt: string;
}

export interface ContractSecurityReview {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  reviewerId: string;
  reviewStatus: ContractReviewStatus;
  securityControlsVerified: boolean;
  accessManagementAdequate: boolean;
  incidentNotificationHoursRequirement: number;
  thirdPartyCyberRiskTier: ContractRiskTier;
  cloudDependencyDocumented: boolean;
  businessContinuityProvisionsVerified: boolean;
  securityCertificationRefsJson?: string;
  findings?: string;
  reviewedAt: string;
}

export interface ContractPrivacyReview {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  reviewerId: string;
  reviewStatus: ContractReviewStatus;
  personalDataProcessingInvolved: boolean;
  privacyImpactAssessmentRef?: string;
  dataLocationJurisdiction: string;
  dataRetentionAndDeletionVerified: boolean;
  breachNotificationTimelineHours: number;
  subprocessorAuthorizationControlled: boolean;
  crossBorderTransferCompliant: boolean;
  findings?: string;
  reviewedAt: string;
}

export interface ContractExecutionGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  executionReadiness: 'READY' | 'BLOCKED_MISSING_REVIEWS' | 'BLOCKED_MISSING_APPROVAL' | 'EXECUTED';
  mandatoryLegalReviewPassed: boolean;
  mandatoryComplianceReviewPassed: boolean;
  mandatorySecurityReviewPassed: boolean;
  mandatoryPrivacyReviewPassed: boolean;
  mandatoryFourEyesApprovalPassed: boolean;
  evidenceRef?: string;
  executionDate?: string;
  effectiveDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  authorizedBy?: string;
  authorizedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface ContractObligation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  obligationTitle: string;
  category: 'DELIVERABLE' | 'REPORTING' | 'PAYMENT_REF' | 'SERVICE_COMMITMENT' | 'COMPLIANCE' | 'SECURITY' | 'PRIVACY' | 'INSURANCE' | 'CERTIFICATION' | 'AUDIT_RIGHTS' | 'RENEWAL_NOTICE' | 'TERMINATION_NOTICE';
  responsibleParty: 'INSTITUTION' | 'VENDOR' | 'MUTUAL';
  ownerId: string;
  dueDate: string;
  criticality: ContractCriticality;
  lifecycle: ObligationLifecycle;
  breachReason?: string;
  evidenceRef?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ContractObligationEvidence {
  id: string;
  tenantId: string;
  campusScope: string;
  obligationId: string;
  evidenceRef: string;
  submittedBy: string;
  submittedDate: string;
  verificationState: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifierId?: string;
  verificationDate?: string;
  verificationComments?: string;
}

export interface ContractObligationException {
  id: string;
  tenantId: string;
  campusScope: string;
  obligationId: string;
  reason: string;
  compensatingControl: string;
  ownerId: string;
  proposerId: string;
  approverId?: string;
  expiryDate: string;
  reviewDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdBy: string;
  createdAt: string;
}

export interface ContractMilestone {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  milestoneTitle: string;
  dueDateRef: string;
  dependencyDescription?: string;
  ownerId: string;
  status: 'PENDING' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'COMPLETED';
  createdBy: string;
  createdAt: string;
}

export interface ContractMilestoneObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  milestoneId: string;
  observationDate: string;
  completionPercentage: number;
  delayDays: number;
  isDelayed: boolean;
  evidenceRef?: string;
  correctiveAction?: string;
  recordedBy: string;
}

export interface ContractSLAGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  slaMetricName: string;
  targetThresholdPercent: number;
  measurementFrequency: 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  penaltyRemedyClauseRef?: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'REVISED' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
}

export interface ContractSLAObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  slaGovernanceId: string;
  servicePeriod: string;
  actualObservedPercent: number;
  isBreached: boolean;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  remediationPlan?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface ContractPerformanceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  vendorIdRef: string;
  evaluationPeriod: string;
  serviceQualityScore: number;
  deliveryScore: number;
  slaScore: number;
  complianceScore: number;
  incidentCount: number;
  obligationCompletionRate: number;
  overallScore: number;
  correctiveActionsRequired: boolean;
  evaluatedBy: string;
  evaluatedAt: string;
}

export interface ContractVendorPerformanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorIdRef: string;
  contractGovernanceRefId: string;
  performanceTier: 'EXEMPLARY' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_DEFICIT';
  lastEvaluationDate: string;
}

export interface ContractRenewalObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  contractIdRef: string;
  renewalNoticeDeadline: string;
  contractEndDate: string;
  reviewWindowStatus: 'UPCOMING' | 'WINDOW_OPEN' | 'MISSED_DEADLINE' | 'REVIEWED';
  performanceRatingScore: number;
  unresolvedRisksCount: number;
  unresolvedDisputesCount: number;
  unresolvedSLABreachesCount: number;
  unresolvedObligationsCount: number;
  recommendation: 'RENEW' | 'RENEGOTIATE' | 'TERMINATE' | 'RE_TENDER' | 'HOLD';
  recommendationJustification?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ContractAmendmentGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  amendmentIdRef: string;
  amendmentReason: string;
  materiality: 'NON_MATERIAL' | 'MATERIAL' | 'MAJOR_RESTRUCTURING';
  affectedObligationsSummary: string;
  riskImpactRating: ContractRiskTier;
  financialReferenceAmount?: number;
  procurementReferenceId?: string;
  legalReviewPassed: boolean;
  complianceReviewPassed: boolean;
  proposerId: string;
  approverId?: string;
  decision: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  createdAt: string;
}

export interface ContractTerminationGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  terminationType: 'CONVENIENCE' | 'CAUSE' | 'BREACH' | 'EXPIRY' | 'FORCE_MAJEURE' | 'MUTUAL';
  reason: string;
  authorityId: string;
  noticeRequirementMet: boolean;
  remainingObligationsCount: number;
  transitionRequirementsPlan?: string;
  dataReturnOrDeletionVerified: boolean;
  continuityRiskRating: ContractRiskTier;
  proposerId: string;
  approverId?: string;
  closureReviewCompleted: boolean;
  status: 'PROPOSED' | 'APPROVED' | 'TERMINATED' | 'CLOSED';
  createdAt: string;
}

export interface ContractDisputeGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  disputeIdRef: string;
  contractGovernanceRefId: string;
  issueDescription: string;
  disputeStatus: 'IDENTIFIED' | 'ESCALATED' | 'IN_MEDIATION' | 'SETTLED' | 'CLOSED';
  legalReviewRef?: string;
  commercialImpactEstimatedRef: string;
  operationalImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskRating: ContractRiskTier;
  resolutionPlan?: string;
  evidenceRef?: string;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface ContractClaimObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  disputeGovernanceId: string;
  claimType: 'LIABILITY' | 'SERVICE_CREDIT' | 'WARRANTY' | 'INDEMNIFICATION' | 'BREACH_DAMAGES';
  claimAmountRef?: number;
  claimStatus: 'SUBMITTED' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'PAID';
  recordedBy: string;
  recordedAt: string;
}

export interface ContractExceptionGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  exceptionType: 'MISSING_CLAUSE' | 'APPROVAL_EXCEPTION' | 'SECURITY_EXCEPTION' | 'PRIVACY_EXCEPTION' | 'COMPLIANCE_EXCEPTION' | 'OBLIGATION_EXCEPTION' | 'RENEWAL_EXCEPTION' | 'EMERGENCY_EXECUTION';
  reason: string;
  compensatingControl: string;
  ownerId: string;
  proposerId: string;
  approverId?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface ContractControl {
  id: string;
  tenantId: string;
  campusScope: string;
  code: string;
  title: string;
  category: 'AUTHORIZATION' | 'LEGAL_REVIEW' | 'COMMERCIAL_REVIEW' | 'SECURITY_REVIEW' | 'PRIVACY_REVIEW' | 'COMPLIANCE_REVIEW' | 'APPROVAL_SEGREGATION' | 'OBLIGATION_MONITORING' | 'RENEWAL_MANAGEMENT' | 'AMENDMENT_CONTROL' | 'TERMINATION_CONTROL' | 'EXCEPTION_MANAGEMENT' | 'RECORDS_PRESERVATION' | 'AUDIT_RIGHTS';
  description: string;
  controlOwnerId: string;
  testingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  status: 'EFFECTIVE' | 'NEEDS_REMEDIATION' | 'FAILED';
  createdBy: string;
  createdAt: string;
}

export interface ContractControlTest {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  testerId: string;
  testDate: string;
  sampleSize: number;
  passCount: number;
  failCount: number;
  resultStatus: 'PASSED' | 'FAILED';
  findings?: string;
  createdBy: string;
  createdAt: string;
}

export interface ContractControlException {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  reason: string;
  compensatingControl: string;
  proposerId: string;
  approverId?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdBy: string;
  createdAt: string;
}

export interface ContractResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentDate: string;
  criticalSupplierDependencyScore: number;
  terminationExposureScore: number;
  substitutabilityScore: number;
  geographicDependencyScore: number;
  technologyDependencyScore: number;
  transitionCapabilityScore: number;
  recoveryObligationsScore: number;
  continuityRequirementsScore: number;
  concentrationScore: number;
  overallContractResilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  assessorId: string;
  createdBy: string;
  createdAt: string;
}

export interface ContractDependencyObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  dependentSystemOrProcess: string;
  criticality: ContractCriticality;
  recoveryTimeObjectiveHours: number;
  substituteAvailable: boolean;
  substituteContractRef?: string;
  createdBy: string;
  createdAt: string;
}

export interface ContractDecisionGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionType: 'EXECUTION' | 'HIGH_RISK_ACCEPTANCE' | 'AMENDMENT' | 'RENEWAL_RECOMMENDATION' | 'TERMINATION' | 'EXCEPTION' | 'DISPUTE_RESOLUTION' | 'RESILIENCE_ACTION';
  contractGovernanceRefId: string;
  title: string;
  description: string;
  proposerId: string;
  approverId: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  decisionDate: string;
  createdBy: string;
  createdAt: string;
}

export interface ContractAssuranceEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  assuranceActivity: string;
  controlId: string;
  result: 'SATISFACTORY' | 'QUALIFIED' | 'DEFICIENT';
  evidenceRef?: string;
  findingSummary?: string;
  remediationPlan?: string;
  verifierId: string;
  timestamp: string;
}

export interface ContractAuditEvent {
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

export interface ContractDiagnosticFinding {
  type: string;
  entityId: string;
  description: string;
}

export type ContractSimulationType =
  | 'CRITICAL_CONTRACT_TERMINATION'
  | 'SUPPLIER_DEFAULT'
  | 'SLA_FAILURE'
  | 'CYBER_INCIDENT'
  | 'DATA_BREACH'
  | 'FORCE_MAJEURE'
  | 'RENEWAL_FAILURE'
  | 'KEY_OBLIGATION_BREACH'
  | 'SUPPLIER_EXIT'
  | 'SERVICE_INTERRUPTION';

export interface ContractSimulationScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  simulationType: ContractSimulationType;
  parametersJson: string;
  simulatedAffectedDependenciesCount: number;
  simulatedImpactedObligationsCount: number;
  simulatedContinuityExposureHours: number;
  simulatedResilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  isSandbox: true;
  idempotencyKey: string;
  createdBy: string;
  createdAt: string;
}
