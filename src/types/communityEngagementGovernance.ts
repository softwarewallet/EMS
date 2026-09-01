/**
 * EMS Phase 7.67: Institutional Community Engagement, Outreach, Extension,
 * Partnerships, Social Impact & Civic Responsibility Governance Engine
 * Module ID: mod_community_engagement_governance
 * 
 * Strict Governance & Assurance Control Plane Contracts.
 * Reference-only integrations with authoritative external and operational systems.
 */

export type CommunityEngagementLifecycle =
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

export type PartnershipType =
  | 'STRATEGIC_COMMUNITY'
  | 'NGO_COMMUNITY_BASED'
  | 'MUNICIPAL_GOVERNMENT'
  | 'INDUSTRY_CIVIC'
  | 'ACADEMIC_EXTENSION'
  | 'INTERNATIONAL_DEVELOPMENT';

export type PartnerRiskLevel =
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'CRITICAL'
  | 'INSUFFICIENT_DATA';

export type EngagementStage =
  | 'IDENTIFY'
  | 'CONSULT'
  | 'CO_DESIGN'
  | 'IMPLEMENT'
  | 'EVALUATE'
  | 'FEEDBACK'
  | 'CLOSE';

export type ImpactAttributionClassification =
  | 'DIRECTLY_OBSERVED'
  | 'EVIDENCE_SUPPORTED'
  | 'ASSOCIATED'
  | 'MODELED'
  | 'FORECAST'
  | 'SCENARIO'
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

export type CommunitySimulationType =
  | 'PARTNER_WITHDRAWAL'
  | 'COMMUNITY_DEMAND_SURGE'
  | 'FUNDING_REDUCTION'
  | 'VOLUNTEER_CAPACITY_DROP'
  | 'PARTICIPATION_DECLINE'
  | 'PROGRAM_CLOSURE'
  | 'EXTENSION_DEMAND_SURGE'
  | 'SAFEGUARDING_EVENT'
  | 'COMMUNITY_TRUST_DECLINE'
  | 'MULTI_CAMPUS_PROGRAM_SHOCK'
  | 'KNOWLEDGE_TRANSFER_FAILURE'
  | 'DISASTER_RESPONSE_ENGAGEMENT';

export interface CommunityEngagementGovernanceReference {
  partnerIdRef?: string;
  organizationIdRef?: string;
  stakeholderIdRef?: string;
  contractIdRef?: string;
  grantIdRef?: string;
  projectIdRef?: string;
  programIdRef?: string;
  departmentIdRef?: string;
  campusId: string;
  eventIdRef?: string;
  volunteerRecordIdRef?: string;
  studentRecordIdRef?: string;
  researchRecordIdRef?: string;
  financeAccountIdRef?: string;
  budgetCodeRef?: string;
  procurementIdRef?: string;
  tenantId: string;
}

export interface CommunityEngagementObjective {
  id: string;
  code: string;
  category: 'STRATEGIC' | 'OUTREACH' | 'EXTENSION' | 'CIVIC' | 'SOCIAL_IMPACT' | 'INCLUSION' | 'ACCESSIBILITY' | 'SUSTAINABILITY';
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

export interface CommunityEngagementStrategy {
  id: string;
  tenantId: string;
  campusScope: string;
  strategyCode: string;
  title: string;
  description: string;
  lifecycle: CommunityEngagementLifecycle;
  effectiveAcademicYear: string;
  strategicObjectives: CommunityEngagementObjective[];
  engagementThemes: string[];
  ownerId: string;
  approverId: string;
  activatedAt: string;
  nextReviewDate: string;
  provenanceHash: string;
}

export interface CommunityEngagementPlan {
  id: string;
  tenantId: string;
  campusScope: string;
  planCode: string;
  title: string;
  cycleName: string;
  lifecycle: CommunityEngagementLifecycle;
  responsibleDepartmentRef: string;
  leadCoordinatorId: string;
  approverId: string;
  approvedDate: string;
  targetCommunityDescriptors: string[];
  objectivesRefs: string[];
}

export interface CommunityEngagementFramework {
  id: string;
  tenantId: string;
  frameworkCode: string;
  title: string;
  version: string;
  governanceScope: string;
  principles: string[];
  regulatoryBasisRefs: string[];
}

export interface CommunityEngagementPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  category: 'OUTREACH' | 'PARTNERSHIP' | 'SAFEGUARDING' | 'VOLUNTEER' | 'SOCIAL_IMPACT';
  lifecycle: CommunityEngagementLifecycle;
  mandatoryControls: string[];
  ownerUnitRef: string;
  provenanceHash: string;
}

export interface CommunityProgramGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  programCode: string;
  title: string;
  programType: 'OUTREACH' | 'EXTENSION' | 'CIVIC' | 'SOCIAL_IMPACT' | 'PUBLIC_SERVICE' | 'KNOWLEDGE_TRANSFER' | 'CAPACITY_BUILDING';
  lifecycle: ProgramLifecycleState;
  responsibleUnit: string;
  leadFacultyOrStaffId: string;
  approverId: string;
  targetCommunityScope: string;
  primaryBeneficiaryDescription: string;
  authoritativeGrantRef?: string;
  authoritativeBudgetRef: string;
  startDate: string;
  reviewDate: string;
  provenanceHash: string;
}

export interface OutreachProgram extends CommunityProgramGovernance {
  outreachFormat: 'WORKSHOPS' | 'SUMMER_INSTITUTE' | 'COMMUNITY_CLINIC' | 'MOBILE_EXTENSION' | 'OPEN_LECTURES';
  annualTargetReach: number;
  isYouthSafeguardRequired: boolean;
}

export interface ExtensionProgram extends CommunityProgramGovernance {
  extensionDomain: 'AGRICULTURAL_SUSTAINABILITY' | 'COMMUNITY_HEALTH' | 'TECHNICAL_ENTERPRISE' | 'LEGAL_AID' | 'FINANCIAL_LITERACY';
  knowledgeAssetReference: string;
  deliveryChannel: string;
}

export interface CivicEngagementProgram extends CommunityProgramGovernance {
  civicInitiativeType: 'DEMOCRACY_LITERACY' | 'NEIGHBORHOOD_REVITALIZATION' | 'ENVIRONMENTAL_REST' | 'DISASTER_PREPAREDNESS';
  studentParticipationModel: 'SERVICE_LEARNING' | 'CO_CURRICULAR' | 'ELECTIVE_INTERNSHIP';
}

export interface SocialImpactProgram extends CommunityProgramGovernance {
  theoryOfChangeSummary: string;
  impactDomain: 'EDUCATION_EQUITY' | 'POVERTY_ALLEVIATION' | 'PUBLIC_HEALTH' | 'CLIMATE_ACTION' | 'DIGITAL_INCLUSION';
  modeledImpactMultiplier: number;
}

export interface CommunityInitiative {
  id: string;
  tenantId: string;
  campusScope: string;
  initiativeCode: string;
  title: string;
  programParentRef: string;
  lifecycle: ProgramLifecycleState;
  startDate: string;
  endDate?: string;
}

export interface CommunityNeedObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  needCode: string;
  title: string;
  geographicScope: string;
  category: 'EDUCATIONAL_ACCESS' | 'HEALTH_WELLNESS' | 'ECONOMIC_MOBILITY' | 'DIGITAL_DIVIDE' | 'ENVIRONMENTAL';
  evidenceSource: string;
  methodologyDescription: string;
  observationPeriod: string;
  status: ObservationValueStatus;
  confidenceScorePercent: number;
  responsibleUnitRef: string;
  recordedAt: string;
}

export interface CommunityPriorityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  priorityCode: string;
  stakeholderGroupDescription: string;
  priorityRank: number;
  statement: string;
  sourceConsultationRef: string;
  verifiedAt: string;
}

export interface CommunityStakeholderReference {
  id: string;
  tenantId: string;
  stakeholderType: 'CIVIC_LEADER' | 'RESIDENT_ADVISOR' | 'SCHOOL_DISTRICT' | 'MUNICIPAL_OFFICIAL' | 'NGO_DIRECTOR';
  anonymizedRoleRef: string;
  sector: string;
  geographicDistrict: string;
}

export interface CommunityPartnerReference {
  id: string;
  tenantId: string;
  campusScope: string;
  partnerCode: string;
  organizationName: string;
  partnerType: PartnershipType;
  primaryFocusArea: string;
  contactDepartmentRef: string;
  dueDiligenceStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'FLAGGED';
  dueDiligenceExpiryDate: string;
  authoritativeCrmRef: string;
}

export interface PartnershipAgreementReference {
  id: string;
  agreementCode: string;
  mouContractSystemRef: string;
  signingDate: string;
  effectiveExpiryDate: string;
  isAutoRenew: boolean;
  signatoryRole: string;
}

export interface PartnershipRisk {
  id: string;
  riskCategory: 'REPUTATIONAL' | 'COMPLIANCE' | 'SAFEGUARDING' | 'FINANCIAL_DEPENDENCY' | 'OPERATIONAL' | 'CYBER_DATA' | 'CONFLICT_OF_INTEREST';
  riskLevel: PartnerRiskLevel;
  description: string;
  mitigationControl: string;
  lastAssessedDate: string;
}

export interface PartnerPerformanceObservation {
  id: string;
  evaluationCycle: string;
  scorePercent: number;
  deliveryOnCommitments: EngagementEffectivenessStatus;
  evaluatorRole: string;
  observationNotes: string;
  evaluatedAt: string;
}

export interface PartnershipGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  partnershipCode: string;
  partnerRefId: string;
  organizationName: string;
  partnershipType: PartnershipType;
  strategicObjectiveRefs: string[];
  lifecycle: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'TERMINATED';
  agreementRefs: PartnershipAgreementReference[];
  risks: PartnershipRisk[];
  overallRiskLevel: PartnerRiskLevel;
  latestPerformance: PartnerPerformanceObservation;
  leadInstitutionalOfficerId: string;
  approverId: string;
  nextFormalReviewDate: string;
  provenanceHash: string;
}

export interface PartnershipAssessment {
  id: string;
  partnershipId: string;
  cycle: string;
  overallHealthScore: number;
  recommendation: 'CONTINUE' | 'AMEND_TERMS' | 'INTENSIVE_MONITORING' | 'TERMINATE';
  assessorId: string;
  verifiedAt: string;
}

export interface CommunityEngagementActivity {
  id: string;
  tenantId: string;
  campusScope: string;
  activityCode: string;
  title: string;
  programRef: string;
  stage: EngagementStage;
  deliveryDate: string;
  locationScope: string;
  leadCoordinatorId: string;
  evidenceRef: string;
}

export interface EngagementEventReference {
  id: string;
  eventCode: string;
  externalEventSystemRef: string;
  scheduledDate: string;
  venueName: string;
  isPublicAccess: boolean;
}

export interface OutreachCampaignReference {
  id: string;
  campaignCode: string;
  targetAudience: string;
  channel: string;
  launchDate: string;
}

export interface VolunteerCapacityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  registeredVolunteersAggregate: number;
  activeVolunteerHoursTotal: number;
  safeguardingTrainedPercent: number;
  isCapacityConstrained: boolean;
  sourceVolunteerSystemRef: string;
}

export interface VolunteerProgramReference {
  id: string;
  tenantId: string;
  programCode: string;
  title: string;
  targetCommunityScope: string;
  requiredSafeguardingClearanceLevel: 'BASIC' | 'ENHANCED_YOUTH' | 'VULNERABLE_ADULTS';
  responsibleCoordinatorId: string;
}

export interface VolunteerGovernance {
  id: string;
  tenantId: string;
  campusScope: string;
  governanceCode: string;
  volunteerPrograms: VolunteerProgramReference[];
  capacityObservations: VolunteerCapacityObservation[];
  mandatoryBackgroundCheckEnforced: boolean;
  fourEyesCertificationPassed: boolean;
}

export interface ParticipationObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  metricCode: string;
  period: string;
  programOrEventRef: string;
  participantCount: number | null; // Null if privacy suppressed
  repeatParticipantPercent: number | null;
  geographicReachPostalUnits: string[];
  isPrivacySuppressed: boolean;
  status: ObservationValueStatus;
  evidenceSourceRef: string;
}

export interface CommunityParticipationObservation extends ParticipationObservation {
  communitySector: string;
  demographicClusterRef: string;
}

export interface StakeholderEngagementObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  stakeholderCategory: 'RESIDENTS' | 'BUSINESS_OWNERS' | 'EDUCATORS' | 'LOCAL_GOV' | 'HEALTH_WORKERS';
  engagementDepthRating: 'INFORM' | 'CONSULT' | 'INVOLVE' | 'COLLABORATE' | 'EMPOWER';
  aggregateCount: number;
  observationPeriod: string;
}

export interface EngagementReachObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  uniqueIndividualsReachedTotal: number;
  unduplicatedHouseholdsEstimate: number;
  municipalDistrictsCovered: number;
  evidenceRef: string;
}

export interface EngagementDepthObservation {
  id: string;
  programRef: string;
  averageContactHoursPerParticipant: number;
  multiSessionCompletionRatePercent: number;
}

export interface InclusionObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  dimension: 'LANGUAGE_ACCESS' | 'DIGITAL_ACCESS' | 'GEOGRAPHIC_EQUITY' | 'SOCIOECONOMIC_REACH';
  observationSummary: string;
  evidenceSourceRef: string;
  equityBarrierIdentified: boolean;
  compensatingActionTaken: string;
  status: ObservationValueStatus;
}

export interface AccessibilityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  engagementVenueOrPlatformRef: string;
  physicalAdaCompliant: boolean;
  digitalWcag21AaCompliant: boolean;
  translationServicesProvided: boolean;
  assessedAt: string;
}

export interface CommunityFeedbackObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  feedbackTheme: string;
  sentimentRef: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL_CONCERN' | 'SUGGESTION';
  sourceConsultationChannel: string;
  period: string;
  responseStatus: 'UNDER_INVESTIGATION' | 'ACTION_SCHEDULED' | 'RESOLVED_COMMUNICATED' | 'CLOSED';
  assignedUnitRef: string;
  actionItemRef?: string;
}

export interface CommunityVoiceReference {
  id: string;
  anonymizedVoiceBatchId: string;
  topicTag: string;
  totalSubmissions: number;
  verifiedLocalOriginPercent: number;
}

export interface SocialImpactObjective {
  id: string;
  objectiveCode: string;
  impactDomain: string;
  baselineStatement: string;
  targetChangeDescription: string;
  quantifiedTargetPercent: number;
}

export interface SocialImpactFramework {
  id: string;
  tenantId: string;
  frameworkCode: string;
  title: string;
  logicModelTier: 'INPUT' | 'ACTIVITY' | 'OUTPUT' | 'OUTCOME' | 'IMPACT';
  objectives: SocialImpactObjective[];
  attributionMethodology: string;
  publishedDate: string;
}

export interface ImpactBaseline {
  id: string;
  metricCode: string;
  baselineYear: string;
  baselineValue: number;
  measurementUnit: string;
  sourceDatasetRef: string;
}

export interface ImpactTarget {
  id: string;
  metricCode: string;
  targetYear: string;
  targetValue: number;
  stretchTargetValue: number;
}

export interface ImpactOutcome {
  id: string;
  outcomeCode: string;
  title: string;
  observedChangeValue: number;
  measurementUnit: string;
  verificationEvidenceRef: string;
}

export interface ImpactEvidence {
  id: string;
  evidenceRef: string;
  documentType: 'EXTERNAL_EVALUATION' | 'SURVEY_DATASET' | 'MUNICIPAL_RECORD' | 'LONGITUDINAL_STUDY';
  issuingBody: string;
  cryptographicHash: string;
  verifiedByRole: string;
}

export interface SocialImpactMetric {
  id: string;
  metricCode: string;
  title: string;
  frameworkRef: string;
  baseline: ImpactBaseline;
  target: ImpactTarget;
  currentActual: number;
  calculationBasis: string;
  attributionClassification: ImpactAttributionClassification;
  confidenceScorePercent: number;
  lastVerifiedAt: string;
}

export interface SocialImpactIndicator {
  id: string;
  indicatorCode: string;
  title: string;
  sdgMappingRef?: string; // e.g. UN SDG 4, SDG 10
  currentProgressPercent: number;
}

export interface SocialImpactObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  metricRef: string;
  observationPeriod: string;
  value: number;
  attributionClassification: ImpactAttributionClassification;
  evidenceSourceRef: string;
  status: ObservationValueStatus;
}

export interface ImpactAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  programRef: string;
  assessmentCycle: string;
  evaluatorType: 'INDEPENDENT_EXTERNAL' | 'INSTITUTIONAL_IR' | 'ACADEMIC_PEER';
  overallImpactScore: number;
  evidenceRefs: string[];
  findingsSummary: string;
  assessedAt: string;
}

export interface ImpactAttributionAssessment {
  id: string;
  tenantId: string;
  programRef: string;
  claimedOutcomeDescription: string;
  attributionClassification: ImpactAttributionClassification;
  causalEvidenceAdequacyScore: number; // 0-100
  disclaimerNote: string;
  assessedBy: string;
}

export interface SocialValueObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  benefitDomain: 'LOCAL_WORKFORCE_READINESS' | 'PREVENTATIVE_HEALTH' | 'SMALL_BIZ_ACCELERATION' | 'CULTURAL_HERITAGE';
  estimatedCommunityBenefitValueCurrency: number;
  methodologyRef: 'SROI_STANDARDS_2025' | 'ECONOMIC_MULTIPLIER_MODEL';
  verificationConfidence: 'HIGH' | 'MEDIUM' | 'PROVISIONAL';
}

export interface BeneficiaryObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  beneficiaryCohortLabel: string;
  directBeneficiariesCount: number;
  indirectBeneficiariesEstimated: number;
  isPrivacySuppressed: boolean;
}

export interface CommunityBenefitObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  benefitCode: string;
  description: string;
  monetaryValueEstimated?: number;
  nonMonetaryPublicValueSummary: string;
}

export interface PublicValueObservation {
  id: string;
  tenantId: string;
  publicValuePillar: 'CIVIC_TRUST' | 'DEMOCRATIC_ENGAGEMENT' | 'COMMUNITY_WELLBEING' | 'ENVIRONMENTAL_STEWARDSHIP';
  assessmentScore: number;
  supportingEvidenceRef: string;
}

export interface ExtensionKnowledgeTransferObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  extensionProgramRef: string;
  knowledgeAssetReference: string;
  targetStakeholderCluster: string;
  practitionersTrainedCount: number;
  adoptionRatePercent: number;
  evidenceSourceRef: string;
}

export interface CommunityCapacityBuildingObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  organizationRefId: string;
  capacityDomain: 'GOVERNANCE_STRUCTURE' | 'GRANT_WRITING' | 'DIGITAL_SERVICES' | 'PROGRAM_EVALUATION';
  baselineMaturity: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
  postEngagementMaturity: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
}

export interface CivicResponsibilityObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  cycle: string;
  totalServiceHoursLogged: number;
  participatingStudentsAndStaffCount: number;
  communityPartnerSatisfactionPercent: number;
}

export interface SustainabilityEngagementObservation {
  id: string;
  tenantId: string;
  campusScope: string;
  sustainabilityTheme: 'URBAN_CANOPY' | 'WATER_CONSERVATION' | 'FOOD_SECURITY' | 'RENEWABLE_ENERGY';
  metricValue: number;
  metricUnit: string;
}

export interface CommunityRisk {
  id: string;
  tenantId: string;
  campusScope: string;
  riskCode: string;
  riskCategory: 'PARTNERSHIP_DEPENDENCY' | 'COMMUNITY_TRUST' | 'SAFEGUARDING' | 'LEGAL_COMPLIANCE' | 'FINANCIAL_DEPENDENCY' | 'OPERATIONAL' | 'REPUTATION';
  riskLevel: PartnerRiskLevel;
  title: string;
  description: string;
  compensatingControl: string;
  ownerRole: string;
  lastAssessedAt: string;
}

export interface EngagementRisk extends CommunityRisk {}

export interface PartnershipRiskObservation {
  id: string;
  partnershipRef: string;
  concentrationScore: number; // 0-100
  mitigationProtocol: string;
}

export interface CommunitySafeguard {
  id: string;
  tenantId: string;
  campusScope: string;
  safeguardCode: string;
  title: string;
  scope: 'YOUTH_PROGRAMS' | 'VULNERABLE_COMMUNITIES' | 'CONFIDENTIAL_HEALTH' | 'DATA_ETHICS';
  policyReference: string;
  mandatoryClearanceEnforced: boolean;
  lastAuditedDate: string;
  auditStatus: 'COMPLIANT' | 'DEFICIENCY_IDENTIFIED' | 'UNDER_REMEDIATION';
}

export interface CommunitySafeguardException {
  id: string;
  tenantId: string;
  campusScope: string;
  exceptionCode: string;
  title: string;
  safeguardRef: string;
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

export interface CommunitySafeguardWaiver extends CommunitySafeguardException {}

export interface CommunityEngagementDecision {
  id: string;
  tenantId: string;
  campusScope: string;
  decisionCode: string;
  decisionType: 'STRATEGY_APPROVAL' | 'PARTNERSHIP_CHARTER' | 'CRITICAL_RISK_ACCEPTANCE' | 'SAFEGUARD_EXCEPTION' | 'IMPACT_CERTIFICATION' | 'PROGRAM_CLOSURE';
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

export interface CommunityEngagementApproval {
  id: string;
  decisionRef: string;
  approverId: string;
  approverRole: string;
  approvedAt: string;
  signatureHash: string;
}

export interface CommunityEngagementActionItem {
  id: string;
  actionCode: string;
  title: string;
  assignedOwnerId: string;
  targetDate: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface CommunityEngagementCommittee {
  id: string;
  tenantId: string;
  campusScope: string;
  committeeCode: string;
  title: string;
  committeeType: 'COMMUNITY_ADVISORY' | 'OUTREACH_STEERING' | 'PARTNERSHIP_REVIEW' | 'SOCIAL_IMPACT_ASSURANCE';
  chairPersonRole: string;
  memberCount: number;
  meetingFrequency: string;
  lastMeetingDate: string;
  nextMeetingDate: string;
  quorumSatisfied: boolean;
}

export interface CommunityEngagementBenchmark {
  id: string;
  tenantId: string;
  metricCode: string;
  title: string;
  benchmarkType: 'HISTORICAL' | 'PEER_CARNEGIE_CLASSIFICATION' | 'STRATEGIC_TARGET' | 'REGIONAL_BASELINE';
  benchmarkValue: number;
  unit: string;
  sourceDataset: string;
  observationPeriod: string;
  isVerified: boolean;
}

export interface CommunityEngagementForecast {
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

export interface CommunityEngagementScenario {
  id: string;
  scenarioType: CommunitySimulationType;
  title: string;
  description: string;
  projectedReachDeltaPercent: number;
  projectedPartnerRiskDeltaPercent: number;
  projectedSocialImpactAttainmentDeltaPercent: number;
  projectedVolunteerCapacityDeltaPercent: number;
  resilienceImpactRating: ResilienceRating;
  recommendedGovernanceActions: string[];
}

export interface CommunityEngagementSimulation {
  id: string;
  simulationType: CommunitySimulationType;
  timestamp: string;
  executedBy: string;
  role: string;
  sandboxMode: true;
  isProductionMutated: false;
  scenario: CommunityEngagementScenario;
  executionLog: string[];
}

export interface CommunityEngagementControl {
  id: string;
  controlCode: string;
  title: string;
  category: 'PARTNER_DUE_DILIGENCE' | 'SAFEGUARDING' | 'FOUR_EYES_APPROVAL' | 'FERPA_PRIVACY' | 'EVIDENCE_LINEAGE';
  enforcementStatus: 'ENFORCED' | 'PARTIAL' | 'DEFICIENT';
  lastTestedAt: string;
}

export interface CommunityEngagementControlTest {
  id: string;
  controlRef: string;
  testedBy: string;
  passed: boolean;
  details: string;
  executedAt: string;
}

export interface CommunityEngagementDiagnosticFinding {
  id: string;
  ruleCode: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  category: 'ORPHAN_REFERENCE' | 'UNSUPPORTED_IMPACT_CLAIM' | 'SAFEGUARD_EXPIRY' | 'PARTNER_RISK_DUE_DILIGENCE' | 'PRIVACY_LEAK' | 'SOD_VIOLATION';
  title: string;
  description: string;
  affectedEntityRef: string;
  recommendedRemediation: string;
  detectedAt: string;
}

export interface CommunityEngagementMaturityAssessment {
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

export interface CommunityEngagementResilienceAssessment {
  id: string;
  tenantId: string;
  campusScope: string;
  assessmentCode: string;
  cycle: string;
  overallRating: ResilienceRating;
  partnerRedundancyScore: number; // 0-100
  volunteerCapacityScore: number;
  programContinuityScore: number;
  communityTrustScore: number;
  fundingResilienceScore: number;
  safeguardingReadinessScore: number;
  emergencyEngagementScore: number;
  geographicDiversificationScore: number;
  dependencyConcentrationExposure: PartnerRiskLevel;
  assessedByRole: string;
  assessedAt: string;
}

export interface CommunityEngagementAuditEvent {
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

export interface CommunitySecurityVerificationResult {
  testId: string;
  category: string;
  name: string;
  passed: boolean;
  details: string;
  timestamp: string;
}
