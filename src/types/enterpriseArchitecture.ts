export enum ADRStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  EFFECTIVE = 'EFFECTIVE',
  SUPERSEDED = 'SUPERSEDED',
  RETIRED = 'RETIRED'
}

export enum PortfolioItemStatus {
  PROPOSED = 'PROPOSED',
  ASSESSED = 'ASSESSED',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  DEPRECATION_PLANNED = 'DEPRECATION_PLANNED',
  RETIRED = 'RETIRED'
}

export enum RationalizationCategory {
  INVEST = 'INVEST',
  MODERNIZE = 'MODERNIZE',
  MIGRATE = 'MIGRATE',
  TOLERATE = 'TOLERATE',
  RETIRE = 'RETIRE'
}

export enum TechnicalDebtStatus {
  IDENTIFIED = 'IDENTIFIED',
  ASSESSED = 'ASSESSED',
  PRIORITIZED = 'PRIORITIZED',
  PLANNED = 'PLANNED',
  IN_REMEDIATION = 'IN_REMEDIATION',
  RESOLVED = 'RESOLVED',
  VERIFIED = 'VERIFIED'
}

export enum ReviewStatus {
  REQUESTED = 'REQUESTED',
  SCREENING = 'SCREENING',
  ARCHITECTURE_REVIEW = 'ARCHITECTURE_REVIEW',
  DECISION_PENDING = 'DECISION_PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONDITIONAL = 'CONDITIONAL',
  CLOSED = 'CLOSED'
}

export enum ClassificationLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  HIGHLY_CONFIDENTIAL = 'HIGHLY_CONFIDENTIAL'
}

export enum ArchitectureDomainType {
  BUSINESS = 'BUSINESS',
  APPLICATION = 'APPLICATION',
  DATA = 'DATA',
  TECHNOLOGY = 'TECHNOLOGY',
  INTEGRATION = 'INTEGRATION',
  SECURITY = 'SECURITY',
  INFORMATION = 'INFORMATION'
}

// 1. Architecture Interfaces
export interface EnterpriseArchitectureRepository {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  domain: ArchitectureDomainType;
  ownerId: string;
  status: string;
  classification: ClassificationLevel;
  authoritativeSource: string;
  effectiveDate: string;
  reviewDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureDomain {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  domainType: ArchitectureDomainType;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitecturePrinciple {
  id: string;
  tenantId: string;
  campusId?: string;
  statement: string;
  rationale: string;
  implications: string;
  domain: ArchitectureDomainType;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureStandard {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  category: string; // OS, Database, API, etc.
  domain: ArchitectureDomainType;
  approvedVersions: string[];
  deprecatedVersions: string[];
  status: string;
  reviewDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureDecisionRecord {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  status: ADRStatus;
  version: number;
  creatorId: string;
  approverId?: string;
  decisionRationale: string;
  alternativesConsidered: string[];
  consequences: string;
  affectedSystems: string[];
  affectedCampuses: string[];
  implementationRequirements: string;
  reviewDate: string;
  linkedEvidence: string[];
  linkedPolicies: string[];
  linkedTechnologyStandards: string[];
  supersededByAdrId?: string;
  supersedesAdrId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureReview {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  requesterId: string;
  reviewerId?: string;
  status: ReviewStatus;
  findings: string;
  recommendations: string;
  targetDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureException {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  requesterId: string;
  approvingAuthority?: string;
  justification: string;
  affectedPrincipleId: string;
  riskAssessment: string;
  mitigation: string;
  expiryDate: string;
  status: string; // REQUESTED, APPROVED, REJECTED, EXPIRED, RENEWED
  compensatingControls?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureRoadmap {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  phases: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Technology Portfolio
export interface TechnologyPortfolio {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyProduct {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  vendor: string;
  version: string;
  category: string;
  status: PortfolioItemStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyPlatform {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  technologyStack: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyService {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyComponent {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationPortfolioItem {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  businessOwner: string;
  technicalOwner: string;
  vendorReference?: string;
  status: PortfolioItemStatus;
  criticality: number; // 1 to 5
  institutionalUsage: string;
  campuses: string[];
  technologyCategory: string;
  architectureDomain: ArchitectureDomainType;
  dependencies: string[];
  riskProfile: string;
  technicalDebt: string;
  modernizationStatus: string;
  retirementHorizon?: string; // date or year
  complianceClassification: ClassificationLevel;
  relatedInvestmentId?: string;
  relatedPortfolioId?: string;
  relatedProgramId?: string;
  relatedInitiativeId?: string;
  // Rationalization inputs
  businessCriticality: number; // 1 to 5
  technicalHealth: number; // 1 to 5
  strategicAlignment: number; // 1 to 5
  operatingCostReference: number; // 1 to 5
  securityRisk: number; // 1 to 5
  integrationComplexity: number; // 1 to 5
  userAdoption: number; // 1 to 5
  technicalDebtScore: number; // 1 to 5
  lifecyclePosition: number; // 1 to 5
  rationalizationCategory?: RationalizationCategory;
  rationalizationScore?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationLifecycleAssessment {
  id: string;
  tenantId: string;
  campusId?: string;
  applicationId: string;
  assessmentDate: string;
  technicalHealthScore: number;
  strategicValueScore: number;
  rationalizationRecommendation: RationalizationCategory;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyLifecycleAssessment {
  id: string;
  tenantId: string;
  campusId?: string;
  technologyName: string; // e.g., PostgreSQL 11
  category: string; // OS, Database, Framework, API, etc.
  currentVersion: string;
  endOfLifeDate?: string;
  endOfSupportDate?: string;
  status: string; // SECURE, UPGRADE_REQUIRED, CRITICAL, OBSOLETE
  lastReviewDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Digital Services
export interface DigitalService {
  id: string;
  tenantId: string;
  campusId?: string;
  name: string;
  description: string;
  serviceOwner: string;
  technicalOwner: string;
  serviceCriticality: number; // 1 to 5
  availabilityTarget: number; // e.g. 99.9
  supportedCampuses: string[];
  dependencyMap: string[];
  lifecycleStatus: string;
  incidentReference?: string;
  technologyRiskScore?: number;
  complianceClassification: ClassificationLevel;
  reviewSchedule: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalServiceOwner {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDependency {
  id: string;
  tenantId: string;
  serviceId: string;
  dependentOnServiceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCriticalityAssessment {
  id: string;
  tenantId: string;
  serviceId: string;
  rating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAvailabilityTarget {
  id: string;
  tenantId: string;
  serviceId: string;
  percentage: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceHealthSnapshot {
  id: string;
  tenantId: string;
  serviceId: string;
  healthScore: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Technology Risk
export interface TechnologyRiskItem {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  probability: number; // 1 to 5
  impact: number; // 1 to 5
  exposure: number; // probability * impact
  controlEffectiveness: number; // 1 to 5
  severity: string; // LOW, MEDIUM, HIGH, CRITICAL (server calculated)
  creatorId: string;
  approverId?: string;
  status: string; // IDENTIFIED, APPROVED, REJECTED, MITIGATED
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyRiskAssessment {
  id: string;
  tenantId: string;
  riskItemId: string;
  assessorId: string;
  score: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyControl {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  effectivenessRating: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyRiskMitigation {
  id: string;
  tenantId: string;
  riskItemId: string;
  actionPlan: string;
  ownerId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyException {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  justification: string;
  expiryDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 5. Technical Debt
export interface TechnicalDebtItem {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  affectedTechnology: string;
  affectedApplicationId: string;
  businessImpact: string;
  technicalImpact: string;
  riskImpact: string;
  estimatedRemediationEffort: number; // person-days or dollars
  priority: string; // LOW, MEDIUM, HIGH, CRITICAL
  targetRemediationDate: string;
  ownerId: string;
  creatorId: string;
  verifierId?: string;
  status: TechnicalDebtStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalDebtAssessment {
  id: string;
  tenantId: string;
  debtItemId: string;
  score: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalDebtRemediation {
  id: string;
  tenantId: string;
  debtItemId: string;
  plan: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 6. Architecture & Dependency
export interface ArchitectureDependency {
  id: string;
  tenantId: string;
  sourceId: string;
  sourceType: string; // application, API, database, infrastructure, process, campus
  targetId: string;
  targetType: string;
  dependencyType: string; // application -> application, technology -> application, etc.
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDependency {
  id: string;
  tenantId: string;
  applicationId: string;
  dependsOnApplicationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationDependency {
  id: string;
  tenantId: string;
  applicationId: string;
  dependsOnApiId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyDependency {
  id: string;
  tenantId: string;
  campusId?: string;
  sourceId: string;
  sourceType: string; // 'application' | 'technology' | 'service'
  targetId: string;
  targetType: string; // 'application' | 'api' | 'database' | 'infrastructure' | 'process' | 'campus'
  dependencyType: string; // e.g. 'application_to_api'
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyImpactAssessment {
  id: string;
  tenantId: string;
  dependencyId: string;
  blastRadiusScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 7. Investment & Modernization
export interface TechnologyInvestmentRequest {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  estimatedCost: number;
  proposerId: string;
  approverId?: string;
  status: string; // PROPOSED, APPROVED, REJECTED
  portfolioId?: string;
  programId?: string;
  initiativeId?: string;
  stageGateId?: string;
  benefitAssessment: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModernizationInitiative {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  targetPortfolioId?: string;
  targetProgramId?: string;
  targetInitiativeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyRetirementPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  targetRetirementDate: string;
  proposerId: string;
  approverId?: string;
  status: string; // DRAFT, SUBMITTED, APPROVED, EXECUTED
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MigrationPlan {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyBenefitAssessment {
  id: string;
  tenantId: string;
  title: string;
  score: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 8. Governance
export interface TechnologyGovernanceReview {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  reviewerId: string;
  status: string; // PENDING, PASSED, FAILED
  findings: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyDecision {
  id: string;
  tenantId: string;
  title: string;
  decisionBody: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureAuditEvent {
  id: string;
  tenantId: string;
  campusId?: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologyDataQualityIssue {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  description: string;
  category: string; // ORPHAN, CROSS_TENANT, EXPIRED_EXCEPTION, UNSUPPORTED_TECH, CIRCULAR_DEPENDENCY
  sourceRecordId: string;
  sourceCollection: string;
  detectedAt: string;
  status: string; // OPEN, RESOLVED
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
