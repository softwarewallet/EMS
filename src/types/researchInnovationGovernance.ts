export type ResearchClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL';
export type ResearchStatus = 'DRAFT' | 'PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'FUNDED' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CLOSED' | 'ARCHIVED';
export type GrantApplicationStatus = 'DRAFT' | 'INTERNAL_REVIEW' | 'APPROVED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'AWARDED' | 'REJECTED' | 'WITHDRAWN';
export type IPDisclosureStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_ASSESSMENT' | 'ASSESSED' | 'PROTECTION_DECISION' | 'PROTECTED' | 'DECLINED' | 'CLOSED';
export type CommercializationStage = 'IDENTIFIED' | 'ASSESSED' | 'VALIDATED' | 'PARTNERING' | 'NEGOTIATION' | 'LICENSED' | 'COMMERCIALIZED' | 'CLOSED';
export type GovInnovationStage = 'IDEA' | 'DISCOVERY' | 'VALIDATION' | 'PROTOTYPE' | 'PILOT' | 'SCALE' | 'TRANSFER' | 'COMMERCIALIZED' | 'RETIRED';

export interface ResearchPortfolio {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  description: string;
  ownerId: string;
  strategicAlignment: string;
  researchDomains: string[];
  fundingProfile: string;
  impactTargets: string;
  riskProfile: string;
  status: ResearchStatus;
  reviewCycle: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ResearchProgram {
  id: string;
  tenantId: string;
  campusScope: string;
  portfolioId: string;
  title: string;
  strategicObjective: string;
  ownerId: string;
  fundingAllocated: number;
  status: ResearchStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GovResearchProject {
  id: string;
  tenantId: string;
  campusScope: string;
  programId?: string;
  title: string;
  description: string;
  principalInvestigatorId: string;
  classification: ResearchClassification;
  status: ResearchStatus;
  startDate?: string;
  endDate?: string;
  aiUsageDisclosed: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ResearchOpportunity {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  sponsor: string;
  fundingType: string;
  deadline: string;
  fundingMin?: number;
  fundingMax?: number;
  eligibility: string;
  status: 'OPEN' | 'CLOSED' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface FundingOpportunity extends ResearchOpportunity {}

export interface GrantApplication {
  id: string;
  tenantId: string;
  campusScope: string;
  opportunityId: string;
  projectId?: string;
  applicantId: string;
  investigatorIds: string[];
  requestedFunding: number;
  submissionState: GrantApplicationStatus;
  submissionDate?: string;
  sponsorRef: string;
  status: GrantApplicationStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GrantAward {
  id: string;
  tenantId: string;
  campusScope: string;
  applicationId: string;
  awardAmount: number;
  financeCodeRef: string;
  contractRef: string;
  sponsor: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GovResearchProposal {
  id: string;
  tenantId: string;
  campusScope: string;
  projectId?: string;
  title: string;
  objectives: string;
  principalInvestigatorId: string;
  budgetRef: string;
  riskAssessment: string;
  ethicsRequired: boolean;
  dataClassification: ResearchClassification;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GovResearchReview {
  id: string;
  tenantId: string;
  proposalId?: string;
  grantApplicationId?: string;
  ipDisclosureId?: string;
  reviewerId: string;
  reviewType: 'SCIENTIFIC' | 'STRATEGIC' | 'FINANCIAL' | 'ETHICAL' | 'LEGAL' | 'IP' | 'RISK' | 'COMPLIANCE';
  recommendation: 'APPROVE' | 'REJECT' | 'REVISE';
  evidence: string;
  createdAt: string;
}

export interface GovResearchApproval {
  id: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  approverId: string;
  decision: 'APPROVED' | 'REJECTED';
  rationale: string;
  approvalDate: string;
  createdAt: string;
}

export interface ResearchInvestigator {
  id: string;
  tenantId: string;
  staffIdRef: string;
  specialization: string;
  orcidRef?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface ResearchTeam {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  leadInvestigatorId: string;
  createdAt: string;
}

export interface GovResearchTeamMember {
  id: string;
  tenantId: string;
  teamId: string;
  identityRef: string;
  role: string;
  createdAt: string;
}

export interface GovResearchMilestone {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  targetDate: string;
  actualDate?: string;
  ownerId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  createdAt: string;
}

export interface ResearchDeliverable {
  id: string;
  tenantId: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  ownerId: string;
  status: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  completionDate?: string;
  createdAt: string;
}

export interface GovResearchOutput {
  id: string;
  tenantId: string;
  projectId: string;
  outputType: 'PUBLICATION' | 'DATASET' | 'SOFTWARE' | 'INVENTION' | 'REPORT' | 'PROTOTYPE' | 'POLICY' | 'EDUCATIONAL';
  title: string;
  description: string;
  aiUsageDeclared: boolean;
  createdAt: string;
}

export interface GovResearchPublication {
  id: string;
  tenantId: string;
  projectId: string;
  outputId: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doiRef?: string;
  journalOrVenue: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'PUBLISHED';
  createdAt: string;
}

export interface GovResearchDatasetReference {
  id: string;
  tenantId: string;
  projectId: string;
  dataAssetId: string;
  classification: ResearchClassification;
  provenance: string;
  createdAt: string;
}

export interface ResearchKnowledgeReference {
  id: string;
  tenantId: string;
  projectId: string;
  knowledgeAssetId: string;
  createdAt: string;
}

export interface ResearchAgreement {
  id: string;
  tenantId: string;
  projectId?: string;
  contractRef: string;
  agreementType: 'SPONSORED_RESEARCH' | 'INDUSTRY_COLLABORATION' | 'NDA' | 'MTA' | 'JOINT_VENTURE';
  parties: string[];
  effectiveDate: string;
  expiryDate: string;
  ipTermsSummary: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  createdAt: string;
}

export interface SponsoredResearchAgreement extends ResearchAgreement {}
export interface IndustryResearchAgreement extends ResearchAgreement {}

export interface IPDisclosure {
  id: string;
  tenantId: string;
  campusScope: string;
  projectId?: string;
  title: string;
  description: string;
  inventorRefs: string[];
  disclosureDate: string;
  classification: ResearchClassification;
  status: IPDisclosureStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface IPAssessment {
  id: string;
  tenantId: string;
  disclosureId: string;
  assessorId: string;
  noveltyScore: number;
  commercialPotential: string;
  ownershipVerification: string;
  recommendation: 'PROTECT' | 'DECLINE' | 'FURTHER_EVALUATION';
  createdAt: string;
}

export interface IPProtectionDecision {
  id: string;
  tenantId: string;
  disclosureId: string;
  protectionType: 'PATENT' | 'COPYRIGHT' | 'TRADEMARK' | 'TRADE_SECRET';
  decisionDate: string;
  approverId: string;
  jurisdiction: string;
  status: 'APPROVED' | 'FILED' | 'GRANTED' | 'DECLINED';
  createdAt: string;
}

export interface PatentRecord {
  id: string;
  tenantId: string;
  disclosureId: string;
  patentNumberRef?: string;
  title: string;
  jurisdiction: string;
  filingDate: string;
  grantDate?: string;
  status: 'FILED' | 'PENDING' | 'GRANTED' | 'EXPIRED';
  createdAt: string;
}

export interface CopyrightRecord {
  id: string;
  tenantId: string;
  disclosureId: string;
  registrationRef?: string;
  title: string;
  creationDate: string;
  status: 'REGISTERED' | 'UNREGISTERED';
  createdAt: string;
}

export interface TrademarkRecord {
  id: string;
  tenantId: string;
  disclosureId: string;
  markName: string;
  registrationRef?: string;
  status: 'FILED' | 'REGISTERED' | 'EXPIRED';
  createdAt: string;
}

export interface TechnologyTransferOpportunity {
  id: string;
  tenantId: string;
  disclosureId: string;
  title: string;
  summary: string;
  stage: CommercializationStage;
  targetIndustries: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'LICENSED';
  createdAt: string;
}

export interface CommercializationOpportunity extends TechnologyTransferOpportunity {}

export interface LicenseRecord {
  id: string;
  tenantId: string;
  ipRef: string;
  licenseeName: string;
  contractRef: string;
  territory: string;
  effectiveDate: string;
  expiryDate: string;
  royaltyTermsRef?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  createdAt: string;
}

export interface RoyaltyReference {
  id: string;
  tenantId: string;
  licenseId: string;
  financeCodeRef: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
}

export interface InnovationRecord {
  id: string;
  tenantId: string;
  campusScope: string;
  title: string;
  description: string;
  creatorId: string;
  currentStage: GovInnovationStage;
  status: 'ACTIVE' | 'RETIRED' | 'COMMERCIALIZED';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface InnovationPipeline {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface InnovationStageRecord {
  id: string;
  tenantId: string;
  innovationId: string;
  stage: GovInnovationStage;
  transitionDate: string;
  approvedById: string;
  evidence: string;
  createdAt: string;
}

export interface GovResearchEthicsReference {
  id: string;
  tenantId: string;
  projectId: string;
  complianceRef: string;
  approvalStatus: 'APPROVED' | 'PENDING' | 'EXPIRED';
  approvalDate?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface ResearchComplianceRecord {
  id: string;
  tenantId: string;
  projectId: string;
  complianceType: string;
  complianceRef: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  createdAt: string;
}

export interface ResearchConflictOfInterest {
  id: string;
  tenantId: string;
  projectId: string;
  personnelRef: string;
  disclosureDetails: string;
  mitigationPlan: string;
  reviewerId: string;
  status: 'DISCLOSED' | 'MITIGATED' | 'RESOLVED' | 'UNRESOLVED';
  createdAt: string;
}

export interface GrantObligation {
  id: string;
  tenantId: string;
  awardId: string;
  title: string;
  dueDate: string;
  responsibleOwnerId: string;
  status: 'PENDING' | 'SUBMITTED' | 'OVERDUE' | 'MET';
  createdAt: string;
}

export interface GrantReportingRequirement {
  id: string;
  tenantId: string;
  awardId: string;
  reportType: 'PROGRESS' | 'FINANCIAL' | 'FINAL';
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'OVERDUE';
  createdAt: string;
}

export interface GrantReport {
  id: string;
  tenantId: string;
  requirementId: string;
  submittingUserId: string;
  submissionDate: string;
  contentSummary: string;
  status: 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface ResearchRisk {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  riskCategory: 'FUNDING' | 'SCHEDULE' | 'ETHICS' | 'DATA' | 'IP' | 'CONTRACTUAL' | 'COMPLIANCE' | 'COMMERCIALIZATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationPlan: string;
  ownerId: string;
  status: 'IDENTIFIED' | 'ASSESSED' | 'MITIGATION_PLANNED' | 'MITIGATING' | 'MONITORED' | 'CLOSED';
  createdAt: string;
}

export interface ResearchException {
  id: string;
  tenantId: string;
  projectId: string;
  reason: string;
  scope: string;
  compensatingControl: string;
  requesterId: string;
  approverId: string;
  expiryDate: string;
  reviewDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: string;
}

export interface ResearchBenefit {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  impactDomain: string;
  baselineValue: number;
  targetValue: number;
  actualValue: number;
  measurementDate: string;
  beneficiary: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'REALIZED';
  createdAt: string;
}

export interface ResearchImpactRecord {
  id: string;
  tenantId: string;
  projectId: string;
  benefitId: string;
  evidenceRef: string;
  verifiedById: string;
  verifiedAt: string;
  createdAt: string;
}

export interface ResearchClosure {
  id: string;
  tenantId: string;
  projectId: string;
  milestonesVerified: boolean;
  deliverablesVerified: boolean;
  grantObligationsMet: boolean;
  ipDispositionSummary: string;
  knowledgeTransferred: boolean;
  closedById: string;
  closedAt: string;
  status: 'CLOSED';
  createdAt: string;
}

export interface ResearchAuditEvent {
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
