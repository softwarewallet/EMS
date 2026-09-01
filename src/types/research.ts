export type ResearchProjectStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CLOSED'
  | 'ARCHIVED';

export type ResearchProposalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED';

export type TeamRole =
  | 'PRINCIPAL_INVESTIGATOR'
  | 'CO_INVESTIGATOR'
  | 'RESEARCH_ASSISTANT'
  | 'COLLABORATOR';

export type MilestoneStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'CANCELLED';

export type IPLifecycleStage =
  | 'DISCLOSED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'FILED'
  | 'GRANTED'
  | 'REJECTED'
  | 'CLOSED';

export type InnovationStage =
  | 'IDEA'
  | 'SCREENING'
  | 'VALIDATION'
  | 'PILOT'
  | 'SCALE'
  | 'COMPLETED'
  | 'ARCHIVED';

export type InstitutionalProjectStatus =
  | 'DRAFT'
  | 'APPROVED'
  | 'ACTIVE'
  | 'AT_RISK'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CLOSED'
  | 'ARCHIVED';

export type ProjectTaskStatus =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'COMPLETED'
  | 'BLOCKED';

export type ResearchPriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProjectIssueStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskStatus = 'IDENTIFIED' | 'MITIGATED' | 'MONITORING' | 'CLOSED';

export type KnowledgeAssetCategory =
  | 'RESEARCH_REPORT'
  | 'PROJECT_CLOSURE_REPORT'
  | 'TECHNICAL_DOCUMENTATION'
  | 'POLICY_REFERENCE'
  | 'LESSONS_LEARNED'
  | 'METHODOLOGY'
  | 'PUBLICATION_OUTPUT';

export interface ResearchProfile {
  id: string;
  tenantId: string;
  campusId?: string;
  staffOrTeacherId: string;
  researcherName: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  specializationArea: string[];
  orcidId?: string;
  scopusAuthorId?: string;
  googleScholarUrl?: string;
  totalPublications: number;
  activeProjectsCount: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchProject {
  id: string;
  tenantId: string;
  campusId?: string;
  projectCode: string;
  title: string;
  abstractText: string;
  departmentId: string;
  departmentName?: string;
  principalInvestigatorId: string;
  principalInvestigatorName: string;
  status: ResearchProjectStatus;
  proposalId?: string;
  fundingReferenceId?: string;
  ethicsReferenceId?: string;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  budgetAmount?: number;
  currency?: string;
  tags?: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchProposal {
  id: string;
  tenantId: string;
  campusId?: string;
  proposalCode: string;
  title: string;
  summary: string;
  departmentId: string;
  principalInvestigatorId: string;
  principalInvestigatorName: string;
  currentVersionNumber: number;
  status: ResearchProposalStatus;
  requestedFundingAmount?: number;
  fundingAgencyName?: string;
  ethicsRequired: boolean;
  submittedAt?: string;
  approvedAt?: string;
  approvedById?: string;
  approvedByName?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchProposalVersion {
  id: string;
  tenantId: string;
  proposalId: string;
  versionNumber: number;
  title: string;
  fullProposalText: string;
  methodologyOverview: string;
  expectedDeliverables: string[];
  budgetBreakdownSummary?: string;
  documentId?: string;
  status: ResearchProposalStatus;
  createdAt: string;
  createdBy: string;
}

export interface ResearchTeamMember {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  memberId: string; // Staff, Teacher, or Student ID
  memberName: string;
  memberEmail?: string;
  memberType: 'STAFF' | 'TEACHER' | 'STUDENT' | 'EXTERNAL';
  role: TeamRole;
  responsibilityDescription?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ResearchMilestone {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  description: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  ownerId: string;
  ownerName: string;
  status: MilestoneStatus;
  completionPercentage: number;
  dependencyMilestoneIds?: string[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchFundingReference {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId?: string;
  proposalId?: string;
  fundingAgencyName: string;
  grantNumber?: string;
  financeReferenceId?: string; // Phase 7.10 Finance ledger ref
  totalGrantAmount: number;
  currency: string;
  disbursedAmount: number;
  status: 'PROPOSED' | 'APPROVED' | 'DISBURSED' | 'CLOSED';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchApproval {
  id: string;
  tenantId: string;
  campusId?: string;
  targetType: 'PROPOSAL' | 'PROJECT' | 'IP' | 'ETHICS';
  targetId: string;
  approverId: string;
  approverName: string;
  approverRole: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUESTED_CHANGES';
  comments: string;
  approvedAt: string;
}

export interface ResearchReview {
  id: string;
  tenantId: string;
  campusId?: string;
  proposalId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewNotes: string;
  recommendation: 'APPROVE' | 'REJECT' | 'REVISE';
  conflictOfInterestDeclared: boolean;
  reviewedAt: string;
}

export interface ResearchOutput {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  outputType: 'PUBLICATION' | 'DATASET' | 'PATENT' | 'PROTOTYPE' | 'REPORT' | 'SOFTWARE';
  description: string;
  authorNames: string[];
  documentRegistryId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResearchPublication {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId?: string;
  outputId?: string;
  title: string;
  journalOrConferenceName: string;
  publicationType: 'JOURNAL' | 'CONFERENCE' | 'BOOK_CHAPTER' | 'MONOGRAPH' | 'PREPRINT';
  doi?: string;
  isbnIssn?: string;
  publicationDate: string;
  volumeIssuePages?: string;
  indexingStatus?: string[]; // e.g. Scopus, Web of Science, IEEE
  authors: { authorId?: string; name: string; isCorresponding: boolean }[];
  documentId?: string;
  createdAt: string;
  createdBy: string;
}

export interface ResearchDatasetReference {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  datasetName: string;
  repositoryUrl: string;
  doi?: string;
  accessType: 'OPEN' | 'RESTRICTED' | 'CONFIDENTIAL';
  licenseType?: string;
  createdAt: string;
  createdBy: string;
}

export interface ResearchIntellectualProperty {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId?: string;
  title: string;
  ipType: 'PATENT' | 'COPYRIGHT' | 'TRADEMARK' | 'TRADE_SECRET' | 'INDUSTRIAL_DESIGN';
  disclosureNumber: string;
  inventors: { inventorId?: string; name: string; sharePercentage: number }[];
  stage: IPLifecycleStage;
  filingApplicationNumber?: string;
  filingCountry?: string;
  filingDate?: string;
  grantNumber?: string;
  grantDate?: string;
  documentRegistryId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface InnovationInitiative {
  id: string;
  tenantId: string;
  campusId?: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  ownerId: string;
  ownerName: string;
  departmentId?: string;
  relatedProjectId?: string;
  stage: InnovationStage;
  estimatedImpactScore: number;
  reviewNotes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface InstitutionalProject {
  id: string;
  tenantId: string;
  campusId?: string;
  projectCode: string;
  title: string;
  objectives: string;
  ownerId: string;
  ownerName: string;
  departmentId: string;
  sponsorName?: string;
  status: InstitutionalProjectStatus;
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  budgetAmount?: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ProjectMilestone {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  dueDate: string;
  completedAt?: string;
  status: MilestoneStatus;
  createdAt: string;
  createdBy: string;
}

export interface ProjectTask {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  priority: ResearchPriorityLevel;
  dueDate: string;
  status: ProjectTaskStatus;
  completionPercentage: number;
  documentReferenceId?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ProjectDependency {
  id: string;
  tenantId: string;
  projectId: string;
  taskOrMilestoneId: string;
  dependsOnId: string;
  dependencyType: 'FINISH_TO_START' | 'START_TO_START';
  createdAt: string;
}

export interface ProjectRisk {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  description: string;
  probability: number; // 1 to 5
  impact: number; // 1 to 5
  severityScore: number; // probability * impact
  severityLevel: RiskSeverity;
  mitigationPlan: string;
  ownerId: string;
  ownerName: string;
  targetResolutionDate?: string;
  status: RiskStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ProjectIssue {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  description: string;
  reporterId: string;
  reporterName: string;
  assigneeId?: string;
  assigneeName?: string;
  priority: ResearchPriorityLevel;
  resolutionNotes?: string;
  status: ProjectIssueStatus;
  resolvedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ProjectDecision {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  decisionTitle: string;
  contextDescription: string;
  alternativesConsidered: string[];
  decisionOwnerId: string;
  decisionOwnerName: string;
  approvedAt: string;
  supportingDocumentId?: string;
  createdAt: string;
  createdBy: string;
}

export interface ProjectDocument {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  title: string;
  documentType: 'SPECIFICATION' | 'CHARTER' | 'REPORT' | 'CONTRACT' | 'OTHER';
  documentRegistryId: string; // References Document Registry
  uploadedById: string;
  uploadedByName: string;
  createdAt: string;
}

export interface ProjectReview {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  reviewTitle: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comments: string;
  reviewedAt: string;
}

export interface ResearchKnowledgeAsset {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId?: string;
  title: string;
  summary: string;
  category: KnowledgeAssetCategory;
  authorId: string;
  authorName: string;
  departmentId?: string;
  documentRegistryId?: string;
  keywords: string[];
  createdAt: string;
  createdBy: string;
}

export interface ResearchEthicsReference {
  id: string;
  tenantId: string;
  campusId?: string;
  projectId: string;
  committeeReference: string;
  approvalReference: string;
  approvalDate: string;
  expiryDate?: string;
  conditionsDescription?: string;
  complianceStatus: 'PENDING' | 'APPROVED' | 'EXPIRED' | 'CONDITIONALLY_APPROVED';
  createdAt: string;
  createdBy: string;
}

export interface ResearchAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  totalActiveProjects: number;
  totalCompletedProjects: number;
  proposalsUnderReview: number;
  averageApprovalTurnaroundDays: number;
  milestoneCompletionRate: number;
  delayedProjectsCount: number;
  atRiskProjectsCount: number;
  totalPublicationsCount: number;
  totalIPDisclosuresCount: number;
  activeInnovationsCount: number;
  activeResearchersCount: number;
  lastUpdated: string;
}

export interface FilterResearchParams {
  departmentId?: string;
  status?: string;
  searchQuery?: string;
  principalInvestigatorId?: string;
}
