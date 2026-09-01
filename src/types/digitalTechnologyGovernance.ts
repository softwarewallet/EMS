// Institutional Digital Transformation, Technology Governance, IT Service Management, Cyber Resilience & Enterprise Architecture Governance Engine Types (Phase 7.69)

export type GovernanceStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED' | 'SUSPENDED';
export type LifecycleStatus = 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'UNDER_REVIEW' | 'DEPRECATED' | 'RETIRED';
export type ExceptionStatus = 'REQUESTED' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'CLOSED';
export type RiskStatus = 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_REQUIRED' | 'MITIGATING' | 'MONITORED' | 'ACCEPTED' | 'CLOSED';
export type TransformationStatus = 'IDEA' | 'DISCOVERY' | 'APPROVED' | 'ACTIVE' | 'AT_RISK' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
export type SeverityLevel = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TechnologyClassification = 'STANDARD' | 'NON_STANDARD' | 'EXCEPTION' | 'PROHIBITED';
export type ServiceCriticalityLevel = 'MISSION_CRITICAL' | 'BUSINESS_CRITICAL' | 'OPERATIONAL' | 'SUPPORT';

export interface BaseGovernanceEntity {
  id: string;
  tenantId: string;
  campusId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// A. DIGITAL STRATEGY
export interface DigitalStrategy extends BaseGovernanceEntity {
  title: string;
  visionStatement: string;
  timeHorizon: string;
  strategicPillars: string[];
  ownerId: string;
  status: GovernanceStatus;
  version: string;
}

export interface DigitalObjective extends BaseGovernanceEntity {
  strategyIdRef: string;
  title: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  targetDate: string;
  ownerId: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'ACHIEVED' | 'DEFERRED';
}

export interface DigitalTransformationRoadmap extends BaseGovernanceEntity {
  title: string;
  description: string;
  phasesCount: number;
  startDate: string;
  targetCompletionDate: string;
  budgetCodeRef: string;
  status: TransformationStatus;
}

export interface DigitalCapability extends BaseGovernanceEntity {
  name: string;
  domain: string;
  maturityLevel: number; // 1 to 5
  targetMaturity: number;
  description: string;
  ownerId: string;
}

export interface DigitalMaturityAssessment extends BaseGovernanceEntity {
  capabilityIdRef: string;
  assessorId: string;
  assessmentDate: string;
  score: number; // 1.0 - 5.0
  evidenceNotes: string;
  gapsIdentified: string[];
}

// B. ENTERPRISE ARCHITECTURE
export interface EnterpriseArchitecturePrinciple extends BaseGovernanceEntity {
  code: string;
  title: string;
  statement: string;
  rationale: string;
  implications: string;
}

export interface ArchitectureDomain extends BaseGovernanceEntity {
  name: string; // Business, Data, Application, Technology, Security
  leadArchitectId: string;
  scopeDescription: string;
  governanceModel: string;
}

export interface ArchitectureStandard extends BaseGovernanceEntity {
  domainIdRef: string;
  name: string;
  version: string;
  classification: TechnologyClassification;
  description: string;
  effectiveDate: string;
  sunsetDate?: string;
}

export interface ArchitectureDecisionRecord extends BaseGovernanceEntity {
  adrNumber: string;
  title: string;
  status: GovernanceStatus;
  context: string;
  decision: string;
  consequences: string;
  domainIdRef: string;
  authorId: string;
  approverId: string;
}

export interface ArchitectureReview extends BaseGovernanceEntity {
  projectIdRef: string;
  title: string;
  architectId: string;
  reviewDate: string;
  status: 'PASSED' | 'CONDITIONAL' | 'REJECTED' | 'PENDING';
  findingsSummary: string;
}

export interface ArchitectureException extends BaseGovernanceEntity {
  standardIdRef: string;
  requestedBy: string;
  approvedBy?: string;
  justification: string;
  status: ExceptionStatus;
  expiryDate: string;
  riskMitigationPlan: string;
}

export interface TechnologyPattern extends BaseGovernanceEntity {
  name: string;
  category: string;
  classification: TechnologyClassification;
  description: string;
  approvedUseCases: string[];
}

export interface ApplicationPortfolioReference extends BaseGovernanceEntity {
  applicationIdRef: string;
  name: string;
  architectureDomain: string;
  criticality: ServiceCriticalityLevel;
  lifecycleStatus: LifecycleStatus;
}

// C. TECHNOLOGY PORTFOLIO
export interface TechnologyPortfolio extends BaseGovernanceEntity {
  name: string;
  portfolioManagerId: string;
  assetCount: number;
  totalTcoAnnual: number;
  riskScore: number;
}

export interface TechnologyInvestment extends BaseGovernanceEntity {
  portfolioIdRef: string;
  title: string;
  budgetCodeRef: string;
  allocatedAmount: number;
  spentAmount: number;
  fiscalYear: string;
  status: 'PLANNED' | 'COMMITTED' | 'DISBURSED' | 'COMPLETED';
}

export interface TechnologyLifecycleObservation extends BaseGovernanceEntity {
  technologyAssetIdRef: string;
  assetName: string;
  lifecycleStatus: LifecycleStatus;
  supportEndDaet: string;
  replacementCandidateRef?: string;
}

export interface TechnologyDependency extends BaseGovernanceEntity {
  sourceAssetIdRef: string;
  targetAssetIdRef: string;
  dependencyType: 'REQUIRES' | 'INTEGRATES_WITH' | 'DATA_FEED' | 'INFRASTRUCTURE';
  criticality: SeverityLevel;
}

export interface TechnologyObsolescenceRisk extends BaseGovernanceEntity {
  technologyAssetIdRef: string;
  vendorIdRef: string;
  eolDate: string;
  riskSeverity: SeverityLevel;
  mitigationStrategy: string;
}

export interface TechnologyConcentrationRisk extends BaseGovernanceEntity {
  category: string; // e.g. Cloud Provider, Database Engine, Vendor
  entityName: string;
  dependentAssetCount: number;
  concentrationPercentage: number;
  riskRating: SeverityLevel;
}

// D. APPLICATION GOVERNANCE
export interface ApplicationGovernanceReference extends BaseGovernanceEntity {
  applicationIdRef: string;
  applicationName: string;
  ownerId: string;
  businessUnit: string;
  classification: TechnologyClassification;
}

export interface ApplicationCriticalityProfile extends BaseGovernanceEntity {
  applicationIdRef: string;
  rtoHours: number;
  rpoHours: number;
  criticalityLevel: ServiceCriticalityLevel;
  financialImpactTier: string;
}

export interface ApplicationRiskObservation extends BaseGovernanceEntity {
  applicationIdRef: string;
  riskCategory: string;
  description: string;
  severity: SeverityLevel;
  mitigationStatus: RiskStatus;
}

export interface ApplicationLifecycle extends BaseGovernanceEntity {
  applicationIdRef: string;
  currentStage: LifecycleStatus;
  lastReviewDate: string;
  nextScheduledReview: string;
}

export interface ApplicationArchitectureReview extends BaseGovernanceEntity {
  applicationIdRef: string;
  reviewerId: string;
  reviewDate: string;
  complianceScore: number; // 0 - 100
  securityVerified: boolean;
}

export interface ApplicationTechnicalDebtObservation extends BaseGovernanceEntity {
  applicationIdRef: string;
  debtType: 'CODE' | 'ARCHITECTURE' | 'INFRASTRUCTURE' | 'DOCUMENTATION';
  remediationCostEstimate: number;
  effortHours: number;
  impactScore: number;
}

// E. IT SERVICE GOVERNANCE
export interface ServiceGovernanceReference extends BaseGovernanceEntity {
  serviceIdRef: string;
  serviceName: string;
  serviceOwnerId: string;
  serviceType: 'INTERNAL' | 'STUDENT_FACING' | 'RESEARCH' | 'INFRASTRUCTURE';
}

export interface ServiceCriticality extends BaseGovernanceEntity {
  serviceIdRef: string;
  tier: ServiceCriticalityLevel;
  businessImpactSummary: string;
}

export interface ServiceLevelObservation extends BaseGovernanceEntity {
  serviceIdRef: string;
  measurementPeriod: string;
  availabilityPercentage: number;
  latencyMs: number;
  slaMet: boolean;
}

export interface SLAObservation extends BaseGovernanceEntity {
  serviceIdRef: string;
  slaName: string;
  targetPercentage: number;
  actualPercentage: number;
  breachCount: number;
}

export interface ServiceAvailabilityObservation extends BaseGovernanceEntity {
  serviceIdRef: string;
  uptimePercentage: number;
  outageMinutesTotal: number;
  scheduledMaintenanceMinutes: number;
}

export interface ServiceContinuityProfile extends BaseGovernanceEntity {
  serviceIdRef: string;
  drTestedDate: string;
  drSuccess: boolean;
  recoveryPlanRef: string;
}

export interface ServiceDependency extends BaseGovernanceEntity {
  serviceIdRef: string;
  dependsOnServiceIdRef: string;
  couplingType: 'TIGHT' | 'LOOSE' | 'SYNCHRONOUS' | 'ASYNCHRONOUS';
}

export interface ServiceException extends BaseGovernanceEntity {
  serviceIdRef: string;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: ExceptionStatus;
  expiryDate: string;
}

// F. ITSM GOVERNANCE (Reference Only)
export interface IncidentGovernanceObservation extends BaseGovernanceEntity {
  incidentIdRef: string;
  serviceIdRef: string;
  severity: SeverityLevel;
  resolutionTimeMinutes: number;
  rootCauseSummary: string;
}

export interface ProblemGovernanceObservation extends BaseGovernanceEntity {
  problemIdRef: string;
  associatedServiceIdRef: string;
  knownError: boolean;
  status: string;
}

export interface ChangeGovernanceObservation extends BaseGovernanceEntity {
  changeRequestIdRef: string;
  serviceIdRef: string;
  changeType: 'STANDARD' | 'NORMAL' | 'EMERGENCY';
  riskAssessmentScore: number;
  success: boolean;
}

export interface MajorIncidentGovernanceObservation extends BaseGovernanceEntity {
  incidentIdRef: string;
  serviceIdRef: string;
  businessImpactHours: number;
  postIncidentReviewCompleted: boolean;
}

export interface ChangeRiskAssessment extends BaseGovernanceEntity {
  changeRequestIdRef: string;
  assessorId: string;
  riskLevel: SeverityLevel;
  fallbackPlanVerified: boolean;
}

export interface ChangeFreezeWindow extends BaseGovernanceEntity {
  title: string;
  startDate: string;
  endDate: string;
  reason: string;
  scope: string;
}

export interface EmergencyChangeObservation extends BaseGovernanceEntity {
  changeRequestIdRef: string;
  justification: string;
  postImplementationReviewPassed: boolean;
}

// G. CYBERSECURITY GOVERNANCE (Reference Only)
export interface CyberRiskObservation extends BaseGovernanceEntity {
  riskIdRef: string;
  title: string;
  threatCategory: string;
  inherentRiskScore: number;
  residualRiskScore: number;
  status: RiskStatus;
}

export interface SecurityControlObservation extends BaseGovernanceEntity {
  controlId: string;
  framework: string; // NIST, ISO27001, CIS
  effectivenessScore: number; // 0 - 100
  testedDate: string;
}

export interface SecurityFindingReference extends BaseGovernanceEntity {
  securityFindingIdRef: string;
  sourceSystem: string;
  severity: SeverityLevel;
  assetAffectedRef: string;
  remediated: boolean;
}

export interface VulnerabilityGovernanceObservation extends BaseGovernanceEntity {
  cveId: string;
  assetIdRef: string;
  cvssScore: number;
  patchStatus: 'PATCHED' | 'PENDING' | 'ACCEPTED_RISK';
}

export interface IdentityRiskObservation extends BaseGovernanceEntity {
  identityProviderIdRef: string;
  mfaEnforcementPercentage: number;
  staleAccountsCount: number;
  anomalousLoginsCount: number;
}

export interface PrivilegedAccessRiskObservation extends BaseGovernanceEntity {
  systemRef: string;
  privilegedAccountCount: number;
  unreviewedAccessCount: number;
  pamToolIntegrated: boolean;
}

export interface CyberResilienceAssessment extends BaseGovernanceEntity {
  assessmentDate: string;
  overallResilienceScore: number; // 0 - 100
  ransomwareReadinessScore: number;
  incidentResponseMaturity: number;
}

// H. CLOUD & INFRASTRUCTURE GOVERNANCE
export interface InfrastructureGovernanceReference extends BaseGovernanceEntity {
  infrastructureAssetIdRef: string;
  name: string;
  assetType: 'CLOUD_VPC' | 'VIRTUAL_MACHINE' | 'STORAGE_BUCKET' | 'SUBNET' | 'LOAD_BALANCER';
  provider: string;
}

export interface CloudGovernanceObservation extends BaseGovernanceEntity {
  tenantIdScope: string;
  complianceScore: number;
  unencryptedResourcesCount: number;
  publicBucketsCount: number;
  policyViolationsCount: number;
}

export interface CloudConcentrationRisk extends BaseGovernanceEntity {
  provider: string; // AWS, Azure, GCP
  workloadPercentage: number;
  riskRating: SeverityLevel;
}

export interface InfrastructureDependency extends BaseGovernanceEntity {
  sourceAssetRef: string;
  targetAssetRef: string;
  dependencyNature: string;
}

export interface CapacityObservation extends BaseGovernanceEntity {
  resourceRef: string;
  cpuUtilizationAvg: number;
  memoryUtilizationAvg: number;
  storageUtilizationAvg: number;
  projectedSaturationDate: string;
}

export interface AvailabilityZoneDependency extends BaseGovernanceEntity {
  serviceRef: string;
  primaryZone: string;
  multiAzRedundant: boolean;
}

export interface CriticalInfrastructureDependency extends BaseGovernanceEntity {
  serviceRef: string;
  facilityDependencyRef: string;
  powerRedundant: boolean;
}

// I. DATA & TECHNOLOGY ARCHITECTURE
export interface DataPlatformDependency extends BaseGovernanceEntity {
  applicationIdRef: string;
  databaseIdRef: string;
  dataFlowType: 'READ' | 'WRITE' | 'BIDIRECTIONAL';
}

export interface DataArchitectureObservation extends BaseGovernanceEntity {
  domain: string;
  lineageMapped: boolean;
  masterDataManagementAligned: boolean;
  dataQualityScore: number;
}

export interface IntegrationDependency extends BaseGovernanceEntity {
  sourceAppRef: string;
  targetAppRef: string;
  protocol: 'REST' | 'GRAPHQL' | 'SOAP' | 'SFTP' | 'MESSAGE_QUEUE';
}

export interface APIArchitectureObservation extends BaseGovernanceEntity {
  apiName: string;
  gatewayManaged: boolean;
  version: string;
  deprecationStatus: boolean;
}

export interface TechnologyDataRiskObservation extends BaseGovernanceEntity {
  assetRef: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
}

// J. DIGITAL TRANSFORMATION
export interface TransformationPortfolio extends BaseGovernanceEntity {
  name: string;
  executiveSponsorId: string;
  totalBudget: number;
  overallHealth: 'GREEN' | 'AMBER' | 'RED';
}

export interface TransformationInitiative extends BaseGovernanceEntity {
  portfolioIdRef: string;
  title: string;
  ownerId: string;
  budgetRef: string;
  startDate: string;
  targetEndDate: string;
  status: TransformationStatus;
  completionPercentage: number;
}

export interface TransformationMilestone extends BaseGovernanceEntity {
  initiativeIdRef: string;
  title: string;
  dueDate: string;
  completedDate?: string;
  status: 'PENDING' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
}

export interface TransformationBenefitObservation extends BaseGovernanceEntity {
  initiativeIdRef: string;
  benefitDescription: string;
  targetValue: number;
  actualRealizedValue: number;
  unit: string;
}

export interface TransformationRisk extends BaseGovernanceEntity {
  initiativeIdRef: string;
  riskDescription: string;
  severity: SeverityLevel;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface TransformationDependency extends BaseGovernanceEntity {
  sourceInitiativeRef: string;
  targetInitiativeRef: string;
  dependencyDescription: string;
}

export interface TransformationDecision extends BaseGovernanceEntity {
  initiativeIdRef: string;
  decisionTitle: string;
  proposedBy: string;
  approvedBy?: string;
  status: GovernanceStatus;
}

// K. IT FINANCIAL GOVERNANCE
export interface TechnologyCostObservation extends BaseGovernanceEntity {
  costCenterIdRef: string;
  category: string;
  monthlySpend: number;
  forecastSpend: number;
  budgetCap: number;
}

export interface TechnologyTCOObservation extends BaseGovernanceEntity {
  assetIdRef: string;
  directCostAnnual: number;
  supportCostAnnual: number;
  internalLaborCostAnnual: number;
  totalTco: number;
}

export interface TechnologyInvestmentReference extends BaseGovernanceEntity {
  investmentIdRef: string;
  projectCode: string;
  roiPercentage: number;
  paybackPeriodMonths: number;
}

export interface CloudCostObservation extends BaseGovernanceEntity {
  provider: string;
  monthlyBill: number;
  idleResourceWasteEstimate: number;
  reservedInstanceCoveragePct: number;
}

export interface TechnologyBudgetVariance extends BaseGovernanceEntity {
  budgetCodeRef: string;
  budgetAmount: number;
  actualAmount: number;
  variancePercentage: number;
  explanation: string;
}

// L. VENDOR / THIRD-PARTY TECHNOLOGY
export interface TechnologyVendorRisk extends BaseGovernanceEntity {
  vendorIdRef: string;
  vendorName: string;
  cyberRiskRating: SeverityLevel;
  financialStabilityRating: string;
  lastAssessmentDate: string;
}

export interface TechnologySupplierDependency extends BaseGovernanceEntity {
  vendorIdRef: string;
  dependentSystemsCount: number;
  singleSourceOfFailure: boolean;
}

export interface TechnologyThirdPartyRisk extends BaseGovernanceEntity {
  vendorIdRef: string;
  dataAccessScope: string;
  soc2Type2Verified: boolean;
  iso27001Verified: boolean;
}

export interface TechnologyExitRisk extends BaseGovernanceEntity {
  vendorIdRef: string;
  dataPortabilityScore: number; // 0 - 100
  transitionComplexity: SeverityLevel;
  exitPlanDocumented: boolean;
}

export interface VendorConcentrationObservation extends BaseGovernanceEntity {
  category: string;
  dominantVendorRef: string;
  spendSharePercentage: number;
}

// M. CONTRACT / COMMERCIAL
export interface TechnologyContractReference extends BaseGovernanceEntity {
  contractIdRef: string;
  vendorIdRef: string;
  title: string;
  effectiveDate: string;
  expirationDate: string;
  annualValue: number;
}

export interface TechnologySLAContractObservation extends BaseGovernanceEntity {
  contractIdRef: string;
  guaranteedUptimePct: number;
  penaltyClauseActive: boolean;
}

export interface TechnologyObligationObservation extends BaseGovernanceEntity {
  contractIdRef: string;
  obligationDescription: string;
  status: 'COMPLIED' | 'PENDING' | 'BREACHED';
}

export interface TechnologyRenewalRisk extends BaseGovernanceEntity {
  contractIdRef: string;
  renewalDate: string;
  priceEscalationRisk: SeverityLevel;
  alternativeSolutionAvailable: boolean;
}

// N. ASSET / FACILITIES
export interface TechnologyFacilityDependency extends BaseGovernanceEntity {
  rackOrServerRoomRef: string;
  housedAssetsCount: number;
  environmentalMonitoringActive: boolean;
}

export interface DataCenterDependency extends BaseGovernanceEntity {
  dataCenterName: string;
  location: string;
  tierRating: 'TIER_I' | 'TIER_II' | 'TIER_III' | 'TIER_IV';
  redundantPower: boolean;
}

export interface PowerDependency extends BaseGovernanceEntity {
  facilityRef: string;
  upsBackupMinutes: number;
  generatorAvailable: boolean;
}

export interface CoolingDependency extends BaseGovernanceEntity {
  facilityRef: string;
  redundantCooling: boolean;
  temperatureCelsiusAvg: number;
}

export interface PhysicalInfrastructureDependency extends BaseGovernanceEntity {
  assetRef: string;
  rackLocation: string;
  secureCage: boolean;
}

// O. SAFETY / RESILIENCE
export interface TechnologyEmergencyDependency extends BaseGovernanceEntity {
  emergencySystemRef: string;
  ipBased: boolean;
  batteryBackupVerified: boolean;
}

export interface TechnologyLifeSafetyDependency extends BaseGovernanceEntity {
  systemName: string;
  integrationStatus: 'INTEGRATED' | 'ISOLATED' | 'FAILED';
}

export interface TechnologyResilienceObservation extends BaseGovernanceEntity {
  serviceRef: string;
  resilienceScore: number;
  singlePointsOfFailureCount: number;
}

// P. QUALITY
export interface TechnologyQualityObservation extends BaseGovernanceEntity {
  assetRef: string;
  defectDensity: number;
  codeCoveragePct: number;
  testAutomationPct: number;
}

export interface DigitalProcessQualityObservation extends BaseGovernanceEntity {
  processName: string;
  automationLevel: number; // 0 - 100%
  errorRate: number;
}

export interface TechnologyContinuousImprovementPlan extends BaseGovernanceEntity {
  title: string;
  objective: string;
  ownerId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

// Q. STUDENT / INSTITUTIONAL OUTCOMES
export interface DigitalStudentExperienceObservation extends BaseGovernanceEntity {
  portalName: string;
  csatScore: number; // 0 - 5
  averageLoadTimeMs: number;
  mobileResponsive: boolean;
}

export interface DigitalServiceOutcome extends BaseGovernanceEntity {
  serviceRef: string;
  adoptionRatePercentage: number;
  userSatisfactionPct: number;
}

export interface TechnologyAccessEquityObservation extends BaseGovernanceEntity {
  campusScope: string;
  deviceLoanerProgramActive: boolean;
  broadbandAccessPct: number;
  accessibilityWcagCompliant: boolean;
}

// R. COMMUNITY / INTERNATIONAL
export interface DigitalCommunityAccessObservation extends BaseGovernanceEntity {
  programName: string;
  activeUsersCount: number;
  digitalLiteracyImpactScore: number;
}

export interface InternationalTechnologyRisk extends BaseGovernanceEntity {
  countryCode: string;
  dataSovereigntyRestriction: boolean;
  exportControlRisk: SeverityLevel;
}

export interface CrossBorderTechnologyObservation extends BaseGovernanceEntity {
  dataFlowDescription: string;
  originCountry: string;
  destinationCountry: string;
  standardContractualClausesActive: boolean;
}

export interface GlobalTechnologyDependency extends BaseGovernanceEntity {
  serviceRef: string;
  globalRegion: string;
  latencyPenaltyMs: number;
}

// S. GOVERNANCE DECISIONS & AUDIT
export interface TechnologyGovernanceDecision extends BaseGovernanceEntity {
  title: string;
  category: string;
  summary: string;
  requesterId: string;
  approverId: string;
  status: GovernanceStatus;
  decisionDate: string;
}

export interface TechnologyApproval extends BaseGovernanceEntity {
  entityType: string;
  entityId: string;
  requesterId: string;
  approverId: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  comments: string;
}

export interface TechnologyRiskAcceptance extends BaseGovernanceEntity {
  riskRef: string;
  justification: string;
  requesterId: string;
  approverId: string;
  expiryDate: string;
  status: ExceptionStatus;
}

export interface TechnologyExceptionApproval extends BaseGovernanceEntity {
  exceptionRef: string;
  requesterId: string;
  approverId: string;
  status: ExceptionStatus;
  terms: string;
}

export interface TechnologyAuditEvent {
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

// SIMULATION & DIAGNOSTICS
export type SimulationScenarioType =
  | 'CLOUD_PROVIDER_OUTAGE'
  | 'DATA_CENTER_OUTAGE'
  | 'RANSOMWARE_EVENT'
  | 'CRITICAL_APPLICATION_FAILURE'
  | 'NETWORK_BACKBONE_FAILURE'
  | 'IDENTITY_PROVIDER_OUTAGE'
  | 'MASS_ACCOUNT_LOCKOUT'
  | 'MAJOR_VENDOR_WITHDRAWAL'
  | 'TECHNOLOGY_SUPPLY_SHORTAGE'
  | 'CYBER_INCIDENT_ESCALATION'
  | 'DATA_PLATFORM_FAILURE'
  | 'API_INTEGRATION_FAILURE'
  | 'DISASTER_RECOVERY_FAILURE'
  | 'DIGITAL_TRANSFORMATION_DELAY'
  | 'TECHNOLOGY_BUDGET_REDUCTION';

export interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  description: string;
  assumptions: string[];
  affectedServices: string[];
  affectedApplications: string[];
  resilienceImpactScore: number; // 0 - 100
  financialExposureEstimate: number;
  mitigationRecommendations: string[];
  simulatedAt: string;
}

export interface DiagnosticFinding {
  id: string;
  code: string;
  category: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  remediationRecommendation: string;
}
