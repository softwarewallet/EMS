export type ProcurementStrategyStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'UNDER_REVIEW' 
  | 'SUPERSEDED' 
  | 'ARCHIVED';

export type ProcurementRequestStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'SOURCING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'CLOSED';

export type SourcingEventStatus = 
  | 'PLANNED' 
  | 'OPEN' 
  | 'EVALUATION' 
  | 'AWARD_RECOMMENDED' 
  | 'APPROVED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type TenderMethod = 
  | 'OPEN_TENDER' 
  | 'LIMITED_TENDER' 
  | 'REQUEST_FOR_PROPOSAL' 
  | 'REQUEST_FOR_QUOTATION' 
  | 'SINGLE_SOURCE' 
  | 'EMERGENCY_PROCUREMENT';

export type VendorRiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VendorClassificationType = 'STANDARD' | 'IMPORTANT' | 'CRITICAL' | 'MISSION_CRITICAL';
export type DueDiligenceStatus = 'VERIFIED' | 'UNVERIFIED' | 'FAILED' | 'NOT_APPLICABLE';
export type VendorRiskLifecycle = 'IDENTIFIED' | 'PLANNED' | 'IN_PROGRESS' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';

export interface ProcurementStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  strategicObjectives: string[];
  procurementPriorities: string[];
  sustainabilityObjectives: string[];
  supplierDiversityObjectives: string[];
  categoryPriorities: string[];
  planningHorizonYears: number;
  riskAppetite: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  ownerId: string;
  status: ProcurementStrategyStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ProcurementPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyId: string;
  fiscalPeriod: string;
  procurementCategories: string[];
  expectedDemandJson: string;
  strategicProjectRefs: string[];
  capitalProjectRefs: string[];
  researchProjectRefs: string[];
  grantRefs: string[];
  budgetEnvelopeIdRef?: string;
  procurementRiskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourcingTimelineJson: string;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ProcurementCategoryGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  code: string;
  name: string;
  strategicImportance: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  spendRiskClassification: 'HIGH_SPEND_HIGH_RISK' | 'HIGH_SPEND_LOW_RISK' | 'LOW_SPEND_HIGH_RISK' | 'LOW_SPEND_LOW_RISK';
  supplierConcentrationRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  criticality: 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'OPERATIONAL' | 'NON_CRITICAL';
  sustainabilityRequirementsJson?: string;
  cybersecurityRequirementsJson?: string;
  dataSensitivity: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
}

export interface ProcurementDemandObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  demandReference: string;
  departmentIdRef: string;
  categoryIdRef: string;
  strategicAlignmentRef?: string;
  urgency: 'ROUTINE' | 'HIGH' | 'URGENT' | 'CRITICAL_EMERGENCY';
  estimatedRequirementReference: string;
  fundingReference: string;
  procurementRiskScore: number;
  createdBy: string;
  createdAt: string;
}

export interface ProcurementRequestGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  requesterId: string;
  departmentIdRef: string;
  categoryIdRef: string;
  budgetCodeRef: string;
  costCenterIdRef: string;
  justification: string;
  urgency: 'ROUTINE' | 'HIGH' | 'URGENT' | 'EMERGENCY';
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceRequirementsJson?: string;
  evidenceRef?: string;
  status: ProcurementRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ProcurementApproval {
  id: string;
  tenantId: string;
  campusScope: string;
  requestId: string;
  proposerId: string;
  reviewerId?: string;
  approverId: string;
  decision: 'APPROVED' | 'REJECTED';
  justification?: string;
  authorizationScope: string;
  idempotencyKey: string;
  timestamp: string;
}

export interface SourcingEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  sourcingStrategy: string;
  categoryIdRef: string;
  tenderMethod: TenderMethod;
  participantsJson: string;
  evaluationCriteriaJson: string;
  complianceRequirementsJson: string;
  status: SourcingEventStatus;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface TenderGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  sourcingEventId: string;
  tenderRef: string;
  sourcingMethod: TenderMethod;
  publicationState: 'DRAFT' | 'PUBLISHED' | 'EVALUATING' | 'AWARDED' | 'CANCELLED';
  eligibilityCriteriaJson: string;
  evaluationMethodology: string;
  coiRequirementVerified: boolean;
  approvalRequirementsJson: string;
  evidenceRef?: string;
  createdBy: string;
  createdAt: string;
}

export interface BidEvaluationCriterion {
  id: string;
  tenderGovernanceId: string;
  criterionName: string;
  category: 'TECHNICAL' | 'COMMERCIAL_REF' | 'COMPLIANCE' | 'CYBERSECURITY' | 'DATA_PROTECTION' | 'SUSTAINABILITY' | 'VENDOR_RISK';
  weightPercent: number;
}

export interface BidEvaluationGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  tenderGovernanceId: string;
  vendorIdRef: string;
  bidderName: string;
  technicalScore: number;
  complianceScore: number;
  cybersecurityScore: number;
  sustainabilityScore: number;
  vendorRiskScore: number;
  totalEvaluationScore: number;
  evaluatorIndependenceVerified: boolean;
  coiDeclared: boolean;
  coiDetails?: string;
  recommendation: 'RECOMMENDED' | 'SHORTLISTED' | 'REJECTED';
  evaluatorId: string;
  createdAt: string;
}

export interface BidEvaluationRecord {
  id: string;
  bidEvaluationGovernanceId: string;
  criterionId: string;
  score: number;
  evaluatorComments?: string;
}

export interface VendorGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorIdRef: string;
  vendorName: string;
  classification: VendorClassificationType;
  criticality: 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'OPERATIONAL' | 'NON_CRITICAL';
  strategicImportance: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'LOW';
  dependencyDescription: string;
  riskTier: VendorRiskTier;
  reviewFrequencyMonths: number;
  ownerId: string;
  status: 'ACTIVE' | 'ON_HOLD' | 'SUSPENDED' | 'TERMINATED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface VendorClassification {
  id: string;
  tenantId: string;
  vendorGovernanceId: string;
  classificationType: VendorClassificationType;
  rationale: string;
  determinedBy: string;
  determinedAt: string;
}

export interface VendorDueDiligence {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorGovernanceId: string;
  legalStanding: DueDiligenceStatus;
  regulatoryStatus: DueDiligenceStatus;
  sanctionsScreeningRef: DueDiligenceStatus;
  financialHealthRef: DueDiligenceStatus;
  cybersecurityPosture: DueDiligenceStatus;
  dataProtectionCompliance: DueDiligenceStatus;
  insuranceCoverage: DueDiligenceStatus;
  businessContinuityVerified: boolean;
  overallStatus: 'VERIFIED' | 'UNVERIFIED' | 'FAILED';
  evaluatedBy: string;
  evaluatedAt: string;
  expiryDate: string;
}

export interface VendorRiskAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorGovernanceId: string;
  financialRiskScore: number;
  operationalRiskScore: number;
  cybersecurityRiskScore: number;
  privacyRiskScore: number;
  complianceRiskScore: number;
  concentrationRiskScore: number;
  overallVendorRiskScore: number;
  overallRiskTier: VendorRiskTier;
  assessedBy: string;
  assessedAt: string;
}

export interface VendorRiskMitigation {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorRiskAssessmentId: string;
  identifiedRiskTitle: string;
  mitigationPlan: string;
  ownerId: string;
  targetCompletionDate: string;
  evidenceRef?: string;
  lifecycle: VendorRiskLifecycle;
  residualRiskScore: number;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ThirdPartyGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  vendorGovernanceIdRef: string;
  serviceCategory: 'CLOUD' | 'SOFTWARE' | 'SECURITY' | 'FACILITIES' | 'RESEARCH_PARTNER' | 'LOGISTICS' | 'UTILITIES' | 'OUTSOURCED';
  riskTier: VendorRiskTier;
  cybersecurityReviewStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  privacyReviewStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
}

export interface ThirdPartyDependency {
  id: string;
  tenantId: string;
  campusScope: string;
  thirdPartyGovernanceId: string;
  dependentSystemOrProcess: string;
  dependencyCriticality: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  alternativeAvailable: boolean;
  alternativeVendorIdRef?: string;
  recoveryTimeObjectiveHours: number;
  createdBy: string;
  createdAt: string;
}

export interface ThirdPartyConcentrationRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  categoryOrService: string;
  vendorIdRef: string;
  concentrationPercent: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationStrategy?: string;
  assessedBy: string;
  assessedAt: string;
}

export interface ProcurementContractGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  contractIdRef: string;
  contractVersionIdRef: string;
  vendorIdRef: string;
  title: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  ownerId: string;
  startDate: string;
  endDate: string;
  renewalNoticeDays: number;
  slaRequirementsJson?: string;
  securityRequirementsJson?: string;
  dataRequirementsJson?: string;
  status: 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'TERMINATED';
  createdBy: string;
  createdAt: string;
}

export interface ProcurementContractRenewalObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  renewalWindowStartDate: string;
  renewalDeadlineDate: string;
  performanceRatingScore: number;
  riskRating: VendorRiskTier;
  recommendation: 'RENEW' | 'RENEGOTIATE' | 'TERMINATE' | 'RE_TENDER';
  reviewedBy: string;
  reviewedAt: string;
  status: 'PENDING' | 'DECIDED';
}

export interface ProcurementContractAmendmentGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  amendmentReason: string;
  scopeChangeDescription: string;
  budgetImpactRefAmount: number;
  legalReviewRef?: string;
  requesterId: string;
  approverId?: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface VendorPerformanceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorGovernanceIdRef: string;
  servicePeriod: string;
  qualityRatingScore: number;
  deliveryRatingScore: number;
  complianceRatingScore: number;
  overallPerformanceScore: number;
  correctiveActionRequired: boolean;
  observedBy: string;
  createdAt: string;
}

export interface VendorSLAObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  contractGovernanceRefId: string;
  slaName: string;
  servicePeriod: string;
  targetThresholdPercent: number;
  actualObservedPercent: number;
  isBreached: boolean;
  correctiveActionPlan?: string;
  recordedBy: string;
  createdAt: string;
}

export interface VendorIncidentObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  vendorGovernanceIdRef: string;
  incidentType: 'CYBERSECURITY' | 'PRIVACY' | 'SERVICE_INTERRUPTION' | 'COMPLIANCE' | 'SAFETY' | 'DELIVERY' | 'QUALITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  investigationStatus: 'OPEN' | 'UNDER_INVESTIGATION' | 'REMEDIATED' | 'CLOSED';
  remediationPlan?: string;
  reportedBy: string;
  reportedAt: string;
}

export interface EmergencyProcurementGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  reason: 'DISASTER' | 'CYBERSECURITY_INCIDENT' | 'INFRASTRUCTURE_FAILURE' | 'HEALTH_EMERGENCY' | 'CRITICAL_OUTAGE' | 'FORCE_MAJEURE';
  scopeDescription: string;
  justification: string;
  requesterId: string;
  authorizerId: string;
  evidenceRef?: string;
  expiryDate: string;
  postEventReviewCompleted: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'REVIEWED';
  createdAt: string;
}

export interface SingleSourceJustification {
  id: string;
  tenantId: string;
  campusScope: string;
  procurementRequestIdRef: string;
  vendorIdRef: string;
  marketRationale: string;
  alternativesConsideredJson: string;
  coiDeclarationVerified: boolean;
  requesterId: string;
  approverId?: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ProcurementControl {
  id: string;
  tenantId: string;
  campusScope: string;
  code: string;
  title: string;
  category: 
    | 'AUTHORIZATION' 
    | 'TENDER_INTEGRITY' 
    | 'COMPETITIVE_SOURCING' 
    | 'CONFLICT_OF_INTEREST' 
    | 'VENDOR_DUE_DILIGENCE' 
    | 'SANCTIONS_SCREENING' 
    | 'CYBERSECURITY' 
    | 'DATA_PROTECTION' 
    | 'CONTRACT_APPROVAL' 
    | 'EMERGENCY_PROCUREMENT' 
    | 'SINGLE_SOURCE' 
    | 'BUDGET_LINKAGE' 
    | 'SEGREGATION_OF_DUTIES' 
    | 'VENDOR_PERFORMANCE';
  description: string;
  controlOwnerId: string;
  testingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  status: 'EFFECTIVE' | 'NEEDS_REMEDIATION' | 'FAILED';
  createdBy: string;
  createdAt: string;
}

export interface ProcurementControlTest {
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

export interface ProcurementControlException {
  id: string;
  tenantId: string;
  campusScope: string;
  controlId: string;
  exceptionType: string;
  requesterId: string;
  reason: string;
  compensatingControl: string;
  approverId?: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdBy: string;
  createdAt: string;
}

export interface ProcurementResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentDate: string;
  criticalSupplierExposureScore: number;
  alternativeSupplierAvailabilityScore: number;
  geographicConcentrationScore: number;
  serviceDependencyScore: number;
  recoveryTimeObjectiveHours: number;
  overallSupplierResilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  assessorId: string;
  createdBy: string;
  createdAt: string;
}

export interface SupplierDisruptionScenario {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  disruptionType: 
    | 'CRITICAL_SUPPLIER_OUTAGE' 
    | 'SUPPLIER_BANKRUPTCY' 
    | 'CYBER_COMPROMISE' 
    | 'GEOGRAPHIC_DISRUPTION' 
    | 'LOGISTICS_FAILURE' 
    | 'QUALITY_FAILURE' 
    | 'CONTRACT_TERMINATION' 
    | 'PRICE_SHOCK' 
    | 'SOLE_SOURCE_FAILURE';
  parametersJson: string;
  simulatedAffectedServicesCount: number;
  simulatedAlternativeAvailabilityScore: number;
  simulatedRecoveryTimeHours: number;
  simulatedResilienceRating: 'STRONG' | 'ADEQUATE' | 'VULNERABLE' | 'SEVERELY_EXPOSED';
  isSandbox: true;
  createdBy: string;
  createdAt: string;
}

export interface ProcurementDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionType: 'AWARD_RECOMMENDATION' | 'EXCEPTION_APPROVAL' | 'VENDOR_RISK_ACCEPTANCE' | 'EMERGENCY_PROCUREMENT' | 'SINGLE_SOURCE_APPROVAL' | 'CONTRACT_GOVERNANCE';
  entityId: string;
  title: string;
  description: string;
  requesterId: string;
  approverId: string;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  decisionDate: string;
  createdBy: string;
  createdAt: string;
}

export interface ProcurementAuditEvent {
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

export interface ProcurementDiagnosticFinding {
  type: string;
  entityId: string;
  description: string;
}
