/**
 * EMS Phase 7.68: Institutional Internationalization, Global Engagement,
 * Transnational Education, Global Partnerships & International Risk Governance Engine
 * Module ID: mod_internationalization_governance
 * 
 * Strict Governance & Assurance Control Plane Contracts.
 * Reference-only integrations with authoritative external and operational systems.
 */

export type InternationalizationLifecycle =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'SUPERSEDED'
  | 'ARCHIVED';

export type ProgramLifecycleState =
  | 'IDEA'
  | 'PROPOSED'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'EVALUATION'
  | 'COMPLETED'
  | 'CLOSED'
  | 'RETIRED';

export type InternationalPartnershipType =
  | 'UNIVERSITY_STRATEGIC'
  | 'DUAL_DEGREE'
  | 'JOINT_RESEARCH'
  | 'GOVERNMENT_CONSORTIUM'
  | 'NGO_GLOBAL'
  | 'INDUSTRY_GLOBAL'
  | 'ACADEMIC_EXCHANGE';

export type InternationalRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'EXTREME'
  | 'INSUFFICIENT_DATA';

export type ObservationValueStatus =
  | 'ACTUAL'
  | 'TARGET'
  | 'FORECAST'
  | 'BENCHMARK'
  | 'SCENARIO'
  | 'INSUFFICIENT_DATA';

export type EngagementEffectivenessStatus =
  | 'EFFECTIVE'
  | 'PARTIALLY_EFFECTIVE'
  | 'INEFFECTIVE'
  | 'INCONCLUSIVE'
  | 'INSUFFICIENT_DATA';

export type ResilienceRating =
  | 'STRONG'
  | 'ADEQUATE'
  | 'VULNERABLE'
  | 'SEVERELY_EXPOSED';

export type InternationalSimulationType =
  | 'PARTNER_WITHDRAWAL'
  | 'COUNTRY_REGULATORY_CHANGE'
  | 'SANCTIONS_CHANGE'
  | 'GEOPOLITICAL_ESCALATION'
  | 'INTERNATIONAL_TRAVEL_DISRUPTION'
  | 'VISA_RESTRICTION'
  | 'INTERNATIONAL_ENROLLMENT_DECLINE'
  | 'MOBILITY_DEMAND_SURGE'
  | 'TRANSNATIONAL_PROGRAM_SUSPENSION'
  | 'INTERNATIONAL_FUNDING_REDUCTION'
  | 'CROSS_BORDER_CYBER_INCIDENT'
  | 'INTERNATIONAL_PARTNER_FAILURE';

export interface InternationalizationGovernanceReference {
  partnerIdRef?: string;
  organizationIdRef?: string;
  institutionIdRef?: string;
  countryIdRef?: string;
  jurisdictionIdRef?: string;
  contractIdRef?: string;
  agreementIdRef?: string;
  mouIdRef?: string;
  grantIdRef?: string;
  researchProjectIdRef?: string;
  studentRecordIdRef?: string;
  scholarRecordIdRef?: string;
  employeeRecordIdRef?: string;
  programIdRef?: string;
  courseIdRef?: string;
  campusId: string;
  departmentIdRef?: string;
  travelRecordIdRef?: string;
  visaRecordIdRef?: string;
  complianceRecordIdRef?: string;
  procurementIdRef?: string;
  financeAccountIdRef?: string;
  budgetCodeRef?: string;
  riskRecordIdRef?: string;
  tenantId: string;
}

export interface InternationalizationObjective {
  id: string;
  code: string;
  category: 'STRATEGIC' | 'PARTNERSHIP' | 'MOBILITY' | 'TRANSNATIONAL' | 'RESEARCH' | 'STUDENT_SUCCESS' | 'REPUTATION' | 'FINANCIAL';
  title: string;
  description: string;
  targetMetricName: string;
  baselineValue: number;
  targetValue: number;
  currentObservedValue: number;
  unit: string;
  responsibleUnitRef: string;
  isCompliant: boolean;
  evidenceReferenceId: string;
}

export interface InternationalizationStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyCode: string;
  title: string;
  description: string;
  lifecycle: InternationalizationLifecycle;
  effectiveAcademicYear: string;
  strategicObjectives: InternationalizationObjective[];
  regionalPriorities: string[];
  ownerId: string;
  approverId: string;
  activatedAt: string;
  nextReviewDate: string;
  provenanceHash: string;
}

export interface InternationalizationPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  planCode: string;
  title: string;
  cycleName: string;
  lifecycle: InternationalizationLifecycle;
  responsibleDepartmentRef: string;
  leadCoordinatorId: string;
  approverId: string;
  approvedDate: string;
}

export interface InternationalizationFramework {
  id: string;
  tenantId: string;
  frameworkCode: string;
  title: string;
  version: string;
  governanceScope: string;
  principles: string[];
}

export interface InternationalizationPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  category: 'PARTNERSHIP' | 'MOBILITY' | 'TRANSNATIONAL' | 'SANCTIONS_COMPLIANCE' | 'RESEARCH_SECURITY';
  lifecycle: InternationalizationLifecycle;
  mandatoryControls: string[];
  ownerUnitRef: string;
  provenanceHash: string;
}

export interface GlobalEngagementProgram {
  id: string;
  tenantId: string;
  campusScope: string;
  programCode: string;
  title: string;
  programType: 'STUDY_ABROAD' | 'FACULTY_EXCHANGE' | 'DUAL_DEGREE' | 'GLOBAL_RESEARCH' | 'TRANSNATIONAL_CAMPUS';
  lifecycle: ProgramLifecycleState;
  responsibleUnit: string;
  leadCoordinatorId: string;
  approverId: string;
  countryScopeRefs: string[];
  authoritativeBudgetRef: string;
  startDate: string;
  reviewDate: string;
  provenanceHash: string;
}

export interface InternationalProgram extends GlobalEngagementProgram {
  targetMobilityCapacity: number;
  isVisaSponsored: boolean;
}

export interface TransnationalEducationProgram extends GlobalEngagementProgram {
  deliveryModel: 'BRANCH_CAMPUS' | 'FRANCHISE' | 'DUAL_DEGREE' | 'JOINT_DEGREE' | 'ONLINE_CROSS_BORDER';
  regulatoryApprovalRef: string;
  accreditationBodyRef: string;
}

export interface OffshoreProgramReference {
  id: string;
  offshoreCode: string;
  hostCountryRef: string;
  localPartnerRef: string;
  enrolledStudentsCount: number | null; // Suppressed if N < 10
  isPrivacySuppressed: boolean;
}

export interface CrossBorderEducationReference extends OffshoreProgramReference {}

export interface InternationalAgreementReference {
  id: string;
  agreementCode: string;
  mouContractSystemRef: string;
  signingDate: string;
  effectiveExpiryDate: string;
  isAutoRenew: boolean;
  signatoryRole: string;
}

export interface InternationalPartnershipRisk {
  id: string;
  riskCategory: 'LEGAL_COMPLIANCE' | 'SANCTIONS' | 'GEOPOLITICAL' | 'REPUTATION' | 'SAFEGUARDING' | 'CYBER_DATA' | 'FINANCIAL_DEPENDENCY' | 'ACADEMIC_QUALITY' | 'RESEARCH_INTEGRITY';
  riskLevel: InternationalRiskLevel;
  description: string;
  mitigationControl: string;
  lastAssessedDate: string;
}

export interface InternationalPartnerPerformanceObservation {
  id: string;
  evaluationCycle: string;
  scorePercent: number;
  deliveryOnCommitments: EngagementEffectivenessStatus;
  evaluatorRole: string;
  observationNotes: string;
  evaluatedAt: string;
}

export interface InternationalPartnerReference {
  id: string;
  tenantId: string;
  campusScope: string;
  partnerCode: string;
  institutionName: string;
  countryRef: string;
  partnerType: InternationalPartnershipType;
  primaryContactDepartmentRef: string;
  dueDiligenceStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'FLAGGED';
  dueDiligenceExpiryDate: string;
  authoritativeCrmRef: string;
}

export interface InternationalPartnershipGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  partnershipCode: string;
  partnerRefId: string;
  institutionName: string;
  countryRef: string;
  partnershipType: InternationalPartnershipType;
  strategicObjectiveRefs: string[];
  lifecycle: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'TERMINATED';
  agreementRefs: InternationalAgreementReference[];
  risks: InternationalPartnershipRisk[];
  overallRiskLevel: InternationalRiskLevel;
  latestPerformance: InternationalPartnerPerformanceObservation;
  leadInstitutionalOfficerId: string;
  approverId: string;
  nextFormalReviewDate: string;
  provenanceHash: string;
}

export interface InternationalPartnershipAssessment {
  id: string;
  partnershipId: string;
  cycle: string;
  overallHealthScore: number;
  recommendation: 'CONTINUE' | 'AMEND_TERMS' | 'INTENSIVE_MONITORING' | 'TERMINATE';
  assessorId: string;
  verifiedAt: string;
}

export interface CountryGovernanceReference {
  id: string;
  tenantId: string;
  countryCode: string;
  countryName: string;
  region: string;
  regulatoryEnvironmentScore: number; // 0-100
  politicalStabilityRating: 'HIGH' | 'MODERATE' | 'VOLATILE' | 'RESTRICTED';
  sanctionsStatus: 'CLEAR' | 'WATCHLIST' | 'RESTRICTED_SECTORS' | 'COMPREHENSIVE_SANCTIONS';
  sanctionsReferenceId: string;
  exportControlLevel: 'UNRESTRICTED' | 'CONTROLLED_TECHNOLOGY' | 'EMBARGOED';
  dataProtectionEnvironment: 'ADEQUATE' | 'RESTRICTIVE' | 'NON_COMPLIANT';
  lastAssessedAt: string;
  provenanceHash: string;
}

export interface JurisdictionGovernanceReference {
  id: string;
  tenantId: string;
  jurisdictionCode: string;
  title: string;
  countryRef: string;
  legalCompatibilityStatus: 'COMPATIBLE' | 'REVIEW_REQUIRED' | 'INCOMPATIBLE';
}

export interface CountryRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  countryRef: string;
  riskCategory: 'GEOPOLITICAL' | 'REGULATORY' | 'SANCTIONS' | 'SECURITY' | 'CYBER_DATA';
  riskLevel: InternationalRiskLevel;
  assessmentSummary: string;
  evidenceSource: string;
  verifiedAt: string;
}

export interface JurisdictionRiskObservation extends CountryRiskObservation {}

export interface GeopoliticalRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  countryRef: string;
  stabilityScore: number; // 0-100
  exposureLevel: InternationalRiskLevel;
  evacuationContingencyReady: boolean;
}

export interface RegulatoryRiskObservation {
  id: string;
  tenantId: string;
  countryRef: string;
  complianceGapSummary: string;
  severity: InternationalRiskLevel;
}

export interface SanctionsComplianceReference {
  id: string;
  tenantId: string;
  entityOrCountryRef: string;
  screeningType: 'OFAC' | 'EU_SANCTIONS' | 'UN_SECURITY_COUNCIL' | 'RESTRICTED_PARTY_LIST';
  screeningResult: 'CLEAR' | 'POTENTIAL_MATCH_REQUIRES_REVIEW' | 'PROHIBITED';
  screenedAt: string;
  screeningReferenceNumber: string;
  verifiedByRole: string;
}

export interface ExportControlReference {
  id: string;
  tenantId: string;
  projectOrAssetRef: string;
  classificationNumber: string; // e.g. EAR99, ITAR
  jurisdictionCountryRef: string;
  licenseRequired: boolean;
  licenseStatus: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'RESTRICTED';
}

export interface CrossBorderDataRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  countryRef: string;
  dataResidencyCompliance: boolean;
  crossBorderTransferMechanism: 'SCC' | 'ADEQUACY_DECISION' | 'EXPLICIT_CONSENT' | 'RESTRICTED';
  securityReviewRef: string;
}

export interface InternationalFinancialRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  countryRef: string;
  currencyExposureRating: InternationalRiskLevel;
  paymentVolatilityRisk: boolean;
  repatriationRestriction: boolean;
}

export interface InternationalReputationRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  partnerOrCountryRef: string;
  reputationIndexScore: number;
  mediaSentimentReference: string;
}

export interface InternationalOperationalRiskObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  operationalDomain: 'LOGISTICS' | 'COMMUNICATIONS' | 'FACILITIES' | 'EMERGENCY_RESPONSE';
  readinessRating: ResilienceRating;
}

export interface InternationalSecurityRiskObservation {
  id: string;
  tenantId: string;
  countryRef: string;
  travelAdvisoryLevel: 'LEVEL_1_NORMAL' | 'LEVEL_2_CAUTION' | 'LEVEL_3_RECONSIDER' | 'LEVEL_4_DO_NOT_TRAVEL';
  evacuationPlanOnFile: boolean;
}

export interface InternationalResilienceObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  overallRating: ResilienceRating;
  partnerRedundancyScore: number;
  countryDiversificationScore: number;
  emergencyRelocationReadiness: boolean;
}

export interface InternationalMobilityGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  governanceCode: string;
  programType: 'STUDY_ABROAD' | 'EXCHANGE' | 'FACULTY_MOBILITY';
  targetCapacityAggregate: number;
  riskMitigationStandard: string;
  fourEyesApprovalVerified: boolean;
}

export interface StudentMobilityReference {
  id: string;
  tenantId: string;
  campusScope: string;
  mobilityCode: string;
  hostCountryRef: string;
  partnerInstitutionRef: string;
  outboundCount: number | null; // Suppressed if N < 10
  inboundCount: number | null; // Suppressed if N < 10
  isPrivacySuppressed: boolean;
  term: string;
}

export interface StaffMobilityReference {
  id: string;
  tenantId: string;
  campusScope: string;
  staffMobilityCode: string;
  destinationCountryRef: string;
  travelAuthorizationRef: string;
}

export interface ScholarMobilityReference {
  id: string;
  tenantId: string;
  campusScope: string;
  scholarRefId: string;
  homeCountryRef: string;
  hostDepartmentRef: string;
  visaComplianceRef: string;
}

export interface ExchangeProgramGovernance {
  id: string;
  tenantId: string;
  exchangeCode: string;
  partnerRef: string;
  balanceRatioVerified: boolean;
}

export interface MobilityCapacityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  totalMobilitySlotsAvailable: number;
  utilizedSlotsCount: number;
  capacityUtilizationPercent: number;
}

export interface MobilityDemandObservation {
  id: string;
  tenantId: string;
  cycle: string;
  applicantCount: number;
  demandSurgeIndicator: boolean;
}

export interface MobilityOutcomeObservation {
  id: string;
  tenantId: string;
  mobilityRef: string;
  completionRatePercent: number;
  academicCreditTransferSuccess: boolean;
}

export interface InternationalStudentGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  academicTerm: string;
  totalInternationalEnrollmentCount: number | null; // Suppressed if N < 10
  countryOfOriginDistributionSummary: string;
  visaComplianceRatePercent: number;
  isPrivacySuppressed: boolean;
  authoritativeSisRef: string;
}

export interface InternationalScholarGovernanceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  activeScholarsCount: number | null;
  visaStatusCompliancePercent: number;
  isPrivacySuppressed: boolean;
  authoritativeHrisRef: string;
}

export interface InternationalRecruitmentReference {
  id: string;
  tenantId: string;
  campusScope: string;
  recruitmentRegion: string;
  authorizedAgentNetworkRef: string;
  complianceAuditStatus: 'VERIFIED' | 'REVIEW_REQUIRED';
}

export interface InternationalEnrollmentObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  undergraduateInternationalCount: number | null;
  graduateInternationalCount: number | null;
  isPrivacySuppressed: boolean;
}

export interface InternationalStudentSupportReference {
  id: string;
  tenantId: string;
  campusScope: string;
  supportServiceType: 'VISA_ADVISING' | 'ORIENTATION' | 'LANGUAGE_SUPPORT' | 'HOUSING_ASSISTANCE';
  satisfactionScorePercent: number;
  capacityStatus: 'ADEQUATE' | 'CONSTRAINED';
}

export interface ImmigrationComplianceReference {
  id: string;
  tenantId: string;
  campusScope: string;
  regulatoryBodyRef: string; // e.g. SEVP / Home Office
  complianceAuditStatus: 'COMPLIANT' | 'MINOR_FINDINGS' | 'CORRECTIVE_ACTION_ACTIVE';
  lastAuditedDate: string;
}

export interface VisaStatusReference {
  id: string;
  studentOrScholarRef: string;
  statusCategory: 'VALID' | 'RENEWAL_PENDING' | 'COMPLIANCE_ALERT';
  authoritativeSystemRef: string;
}

export interface InternationalResearchGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  governanceCode: string;
  activeGlobalCollaborationsCount: number;
  researchSecurityEnforced: boolean;
  exportControlScreeningPassed: boolean;
}

export interface GlobalResearchPartnershipReference {
  id: string;
  tenantId: string;
  campusScope: string;
  collaborationCode: string;
  title: string;
  foreignPartnerRef: string;
  hostCountryRef: string;
  grantRef: string;
  researchSecurityReviewRef: string;
  riskLevel: InternationalRiskLevel;
}

export interface CrossBorderResearchRisk {
  id: string;
  researchRef: string;
  ipLeakageExposure: InternationalRiskLevel;
  foreignInterferenceRisk: InternationalRiskLevel;
  mitigationProtocol: string;
}

export interface InternationalGrantReference {
  id: string;
  grantCode: string;
  fundingAgencyName: string;
  fundingCountryRef: string;
  awardAmountCurrency: number;
  authoritativeFinanceRef: string;
}

export interface GlobalKnowledgeTransferReference {
  id: string;
  tenantId: string;
  campusScope: string;
  transferCode: string;
  title: string;
  destinationCountryRef: string;
  commercializationRef: string;
}

export interface InternationalInnovationReference {
  id: string;
  tenantId: string;
  innovationCode: string;
  title: string;
  crossBorderPatentRef: string;
}

export interface GlobalExtensionReference {
  id: string;
  tenantId: string;
  extensionCode: string;
  title: string;
  hostCommunityCountryRef: string;
}

export interface InternationalProgramQualityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  programRef: string;
  academicEquivalenceRating: 'EXEMPLARY' | 'SATISFACTORY' | 'DEFICIENT';
  externalReviewerRef: string;
  assessedAt: string;
}

export interface InternationalAccreditationReference {
  id: string;
  accreditationCode: string;
  bodyName: string;
  jurisdictionCountryRef: string;
  status: 'FULL_ACCREDITATION' | 'PROVISIONAL' | 'EXPIRED';
  expiryDate: string;
}

export interface GlobalRankingReference {
  id: string;
  rankingSystemName: string; // e.g. THE, QS, ARWU
  metricCategory: string;
  globalRankNumber: number;
  institutionScore: number;
  publishedYear: string;
  isVerified: boolean;
}

export interface InternationalReputationObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  indicatorCode: string;
  title: string;
  observedScore: number;
  benchmarkScore: number;
  provenanceSource: string;
}

export interface InternationalStakeholderReference {
  id: string;
  stakeholderGroup: 'ALUMNI' | 'GOVERNMENT_OFFICIAL' | 'EMPLOYER' | 'PARTNER_ADMIN';
  countryRef: string;
  anonymizedIdentifierRef: string;
}

export interface GlobalAlumniReference {
  id: string;
  tenantId: string;
  campusScope: string;
  regionCode: string;
  totalAlumniCountEstimate: number | null; // Suppressed if N < 10
  isPrivacySuppressed: boolean;
  activeChapterCount: number;
}

export interface InternationalEngagementObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  engagementType: 'DELEGATION_VISIT' | 'CONSULTATION' | 'JOINT_SYMPOSIUM';
  countryRef: string;
  summary: string;
  recordedAt: string;
}

export interface GlobalImpactObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  impactDomain: string;
  summary: string;
  evidenceRef: string;
}

export interface InternationalOutcomeObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  outcomeCode: string;
  title: string;
  status: 'ACHIEVED' | 'PARTIALLY_ACHIEVED' | 'NOT_ACHIEVED' | 'INCONCLUSIVE' | 'INSUFFICIENT_DATA';
  verificationEvidenceRef: string;
}

export interface InternationalBenchmark {
  id: string;
  tenantId: string;
  metricCode: string;
  title: string;
  benchmarkType: 'GLOBAL_PEER_AVERAGE' | 'RUSSELL_GROUP_AVERAGE' | 'AAU_AVERAGE' | 'STRATEGIC_TARGET';
  benchmarkValue: number;
  unit: string;
  sourceDataset: string;
  observationPeriod: string;
  isVerified: boolean;
}

export interface InternationalTarget {
  id: string;
  metricCode: string;
  targetYear: string;
  targetValue: number;
}

export interface InternationalForecast {
  id: string;
  tenantId: string;
  campusScope: string;
  forecastCode: string;
  title: string;
  metricTarget: string;
  baselineActual: number;
  forecastedValue: number;
  unit: string;
  forecastPeriod: string;
  lifecycle: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED';
  methodology: 'TIME_SERIES_HOLT_WINTERS' | 'REGRESSION_COVARIATE' | 'STOCHASTIC_SCENARIO';
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
  publishedAt?: string;
  authorId: string;
  verifierId: string;
}

export interface InternationalScenario {
  id: string;
  scenarioType: InternationalSimulationType;
  title: string;
  description: string;
  projectedEnrollmentDeltaPercent: number;
  projectedPartnershipRiskDeltaPercent: number;
  projectedMobilityVolumeDeltaPercent: number;
  projectedRevenueDeltaPercent: number;
  resilienceImpactRating: ResilienceRating;
  recommendedGovernanceActions: string[];
}

export interface InternationalSimulation {
  id: string;
  simulationType: InternationalSimulationType;
  timestamp: string;
  executedBy: string;
  role: string;
  sandboxMode: true;
  isProductionMutated: false;
  scenario: InternationalScenario;
  executionLog: string[];
}

export interface InternationalControl {
  id: string;
  controlCode: string;
  title: string;
  category: 'PARTNER_DUE_DILIGENCE' | 'SANCTIONS_SCREENING' | 'FOUR_EYES_APPROVAL' | 'FERPA_PRIVACY' | 'EXPORT_CONTROL';
  enforcementStatus: 'ENFORCED' | 'PARTIAL' | 'DEFICIENT';
  lastTestedAt: string;
}

export interface InternationalControlTest {
  id: string;
  controlRef: string;
  testedBy: string;
  passed: boolean;
  details: string;
  executedAt: string;
}

export interface InternationalException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionCode: string;
  title: string;
  controlRef: string;
  rationale: string;
  compensatingControls: string[];
  requesterId: string;
  approverId: string;
  effectiveDate: string;
  expiryDate: string;
  reviewDate: string;
  isExpired: boolean;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  provenanceHash: string;
}

export interface InternationalWaiver extends InternationalException {}

export interface InternationalDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionCode: string;
  decisionType: 'STRATEGY_APPROVAL' | 'PARTNERSHIP_CHARTER' | 'HIGH_RISK_COUNTRY_APPROVAL' | 'SANCTIONS_EXCEPTION' | 'TRANSNATIONAL_PROGRAM_APPROVAL' | 'RISK_ACCEPTANCE';
  title: string;
  proposerId: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rationale: string;
  evidenceRef: string;
  isFourEyesCompliant: boolean;
  decidedAt?: string;
  provenanceHash: string;
}

export interface InternationalApproval {
  id: string;
  decisionRef: string;
  approverId: string;
  approverRole: string;
  approvedAt: string;
  signatureHash: string;
}

export interface InternationalCommitteeGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  committeeCode: string;
  title: string;
  committeeType: 'GLOBAL_ENGAGEMENT_STEERING' | 'INTERNATIONAL_RISK_BOARD' | 'TRANSNATIONAL_QA_COMMITTEE' | 'RESEARCH_SECURITY_PANEL';
  chairPersonRole: string;
  memberCount: number;
  meetingFrequency: string;
  lastMeetingDate: string;
  nextMeetingDate: string;
  quorumSatisfied: boolean;
}

export interface InternationalActionItem {
  id: string;
  actionCode: string;
  title: string;
  assignedOwnerId: string;
  targetDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface InternationalMaturityAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  overallMaturityScorePercent: number; // 0-100
  dimensions: {
    name: string;
    scorePercent: number;
    level: 'INITIAL' | 'DEVELOPING' | 'DEFINED' | 'MANAGED' | 'OPTIMIZING';
  }[];
  assessedAt: string;
}

export interface InternationalResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentCode: string;
  cycle: string;
  overallRating: ResilienceRating;
  partnerRedundancyScore: number;
  countryDiversificationScore: number;
  mobilityContinuityScore: number;
  financialResilienceScore: number;
  cyberDataResilienceScore: number;
  emergencyRelocationScore: number;
  geopoliticalContingencyScore: number;
  dependencyConcentrationExposure: InternationalRiskLevel;
  assessedByRole: string;
  assessedAt: string;
}

export interface InternationalDiagnosticFinding {
  id: string;
  ruleCode: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  category: 'ORPHAN_REFERENCE' | 'SANCTIONS_EVIDENCE_MISSING' | 'DUE_DILIGENCE_EXPIRED' | 'COUNTRY_RISK_STALE' | 'PRIVACY_LEAK' | 'SOD_VIOLATION';
  title: string;
  description: string;
  affectedEntityRef: string;
  recommendedRemediation: string;
  detectedAt: string;
}

export interface InternationalAuditEvent {
  id: string;
  tenantId: string;
  campusScope: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  provenanceHash: string;
  previousState?: string;
  newState?: string;
  evidenceRef?: string;
}

export interface InternationalSecurityVerificationResult {
  testId: string;
  category: string;
  name: string;
  passed: boolean;
  details: string;
  timestamp: string;
}
