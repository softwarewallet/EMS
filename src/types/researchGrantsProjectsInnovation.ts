/**
 * EMS PHASE 11.9: Institutional Research, Grants, Projects, Innovation & Sponsored Programs Types
 * Authoritative operational models for research projects, proposals, grant applications, awards,
 * sponsored programs, research teams, milestones, deliverables, budgets, compliance reviews, ethics,
 * risks, outputs, IP disclosure, innovation projects, technology transfer, and commercialization.
 */

// ==========================================
// 1. LIFECYCLE ENUMS & STATUSES
// ==========================================

export type ResearchProjectStatus =
  | 'DRAFT'
  | 'PROPOSED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'COMPLETION_REVIEW'
  | 'CLOSED'
  | 'ARCHIVED'
  | 'REJECTED'
  | 'CANCELLED';

export type ResearchProposalStatus =
  | 'DRAFT'
  | 'IN_PREPARATION'
  | 'INTERNAL_REVIEW'
  | 'INSTITUTIONAL_APPROVED'
  | 'SUBMITTED'
  | 'SPONSOR_UNDER_REVIEW'
  | 'AWARDED'
  | 'REVISION_REQUESTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type FundingOpportunityStatus =
  | 'FORECAST'
  | 'OPEN'
  | 'CLOSED'
  | 'UNDER_EVALUATION'
  | 'ARCHIVED'
  | 'CANCELLED';

export type GrantApplicationStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'AWARDED'
  | 'DECLINED'
  | 'WITHDRAWN'
  | 'CLOSED';

export type GrantAwardStatus =
  | 'ACTIVE'
  | 'EXTENDED'
  | 'AMENDMENT_PENDING'
  | 'SUSPENDED'
  | 'CLOSEOUT_IN_PROGRESS'
  | 'CLOSED'
  | 'TERMINATED';

export type ResearchMilestoneStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED_FOR_REVIEW'
  | 'COMPLETED'
  | 'DELAYED'
  | 'WAIVED'
  | 'CANCELLED';

export type ResearchDeliverableStatus =
  | 'PENDING'
  | 'IN_DEVELOPMENT'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REVISION_REQUIRED'
  | 'REJECTED';

export type ResearchComplianceStatus =
  | 'NOT_SUBMITTED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'CONDITIONALLY_APPROVED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'SUSPENDED';

export type ResearchRiskSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type ResearchRiskProbability =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'ALMOST_CERTAIN';

export type InnovationProjectStatus =
  | 'IDEA'
  | 'SCREENING'
  | 'VALIDATION'
  | 'PROTOTYPE'
  | 'PILOT'
  | 'INCUBATION'
  | 'COMMERCIALIZATION'
  | 'TRANSFERRED'
  | 'CLOSED';

export type IntellectualPropertyStatus =
  | 'DISCLOSED'
  | 'ASSESSMENT'
  | 'PROVISIONAL_FILED'
  | 'PATENT_PENDING'
  | 'PATENT_GRANTED'
  | 'LICENSED'
  | 'MAINTAINED'
  | 'ABANDONED'
  | 'EXPIRED';

export type CommercializationType =
  | 'EXCLUSIVE_LICENSE'
  | 'NON_EXCLUSIVE_LICENSE'
  | 'SPINOFF_STARTUP'
  | 'ASSIGNMENT'
  | 'JOINT_VENTURE'
  | 'OPEN_ACCESS_CONSORTIUM';

export type ResearchBudgetCategory =
  | 'PERSONNEL'
  | 'EQUIPMENT'
  | 'SUPPLIES_MATERIALS'
  | 'TRAVEL'
  | 'CONTRACTUAL_SERVICES'
  | 'PUBLICATION_DISSEMINATION'
  | 'INDIRECT_OVERHEAD'
  | 'PARTICIPANT_COSTS'
  | 'OTHER_DIRECT';

export type ResearchOutputType =
  | 'PEER_REVIEWED_JOURNAL'
  | 'CONFERENCE_PAPER'
  | 'BOOK_CHAPTER'
  | 'MONOGRAPH'
  | 'DATASET'
  | 'PATENT_FILING'
  | 'POLICY_BRIEF'
  | 'SOFTWARE_PROTOTYPE'
  | 'TECHNICAL_REPORT';

// ==========================================
// 2. MONETARY VALUE TYPE (Phase 11.2 Aligned)
// ==========================================

export interface ResearchCurrencyAmount {
  amount: number; // Integer minor units (e.g. paisa/cents) or standard major unit integer
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
}

// ==========================================
// 3. RESEARCH UNITS & PROGRAMS
// ==========================================

export interface ResearchUnit {
  unitId: string;
  code: string;
  name: string;
  tenantId: string;
  campusIdRef: string;
  departmentIdRef?: string; // Phase 10.1 Ref
  facultyLeadEmployeeIdRef: string; // Phase 11.1 Ref
  description: string;
  focusDisciplines: string[]; // Phase 10.2 Ref
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProgram {
  programId: string;
  code: string;
  title: string;
  tenantId: string;
  campusIdRef: string;
  researchUnitIdRef: string;
  strategicTheme: string;
  targetFundingSponsors: string[];
  totalAllocatedBudget: ResearchCurrencyAmount;
  leadCoordinatorEmployeeIdRef: string;
  status: 'ACTIVE' | 'PLANNED' | 'CONCLUDED';
  startDate: string;
  endDate?: string;
}

// ==========================================
// 4. RESEARCH TEAMS & INVESTIGATOR REFERENCES
// ==========================================

export interface PrincipalInvestigatorReference {
  employeeIdRef: string; // Upstream Phase 11.1
  fullName: string;
  email: string;
  departmentCode: string;
  orcid?: string;
  isLeadPI: boolean;
}

export interface CoInvestigatorReference {
  investigatorId: string;
  memberType: 'EMPLOYEE' | 'STUDENT' | 'EXTERNAL_COLLABORATOR';
  employeeIdRef?: string; // Phase 11.1
  studentIdRef?: string; // Phase 10.4
  externalName?: string;
  externalAffiliation?: string;
  role: 'CO_PI' | 'POSTDOC_RESEARCHER' | 'GRADUATE_ASSISTANT' | 'TECHNICAL_CONSULTANT';
  allocationPercentage: number;
}

export interface ResearchTeam {
  teamId: string;
  projectIdRef: string;
  tenantId: string;
  principalInvestigator: PrincipalInvestigatorReference;
  coInvestigators: CoInvestigatorReference[];
  studentResearchers: Array<{
    studentIdRef: string; // Phase 10.4
    role: string;
    stipendBudgetIdRef?: string;
  }>;
  createdAt: string;
}

// ==========================================
// 5. FUNDING OPPORTUNITY & SPONSOR
// ==========================================

export interface FundingOpportunity {
  opportunityId: string;
  opportunityCode: string;
  title: string;
  sponsorName: string;
  sponsorType: 'GOVERNMENT' | 'INDUSTRY' | 'FOUNDATION' | 'INTERNATIONAL' | 'INTERNAL_INSTITUTIONAL';
  sponsorIdRef?: string; // Phase 11.3 Supplier/Partner Ref
  tenantId: string;
  campusIdRef: string;
  announcementDate: string;
  openingDate: string;
  closingDate: string;
  maxFundingAmount: ResearchCurrencyAmount;
  eligibilitySummary: string;
  guidelinesUrl?: string;
  status: FundingOpportunityStatus;
  createdAt: string;
}

// ==========================================
// 6. RESEARCH PROPOSALS
// ==========================================

export interface ResearchProposal {
  proposalId: string;
  proposalNumber: string;
  title: string;
  tenantId: string;
  campusIdRef: string;
  researchUnitIdRef: string;
  opportunityIdRef?: string;
  leadPiEmployeeIdRef: string; // Phase 11.1
  coPiRefs: string[];
  abstract: string;
  keywords: string[];
  proposedDurationMonths: number;
  totalProposedBudget: ResearchCurrencyAmount;
  indirectCostRatePercentage: number;
  mandatoryComplianceCategories: ('HUMAN_SUBJECTS' | 'ANIMAL_CARE' | 'BIOSAFETY' | 'EXPORT_CONTROL' | 'CONFLICT_OF_INTEREST' | 'DATA_ETHICS')[];
  status: ResearchProposalStatus;
  submissionDeadline?: string;
  submittedAt?: string;
  institutionalApproverUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. GRANT APPLICATION & AWARDS
// ==========================================

export interface GrantApplication {
  applicationId: string;
  applicationNumber: string;
  proposalIdRef: string;
  opportunityIdRef: string;
  tenantId: string;
  campusIdRef: string;
  applicantPiEmployeeIdRef: string;
  requestedAmount: ResearchCurrencyAmount;
  submissionPortalRef?: string;
  sponsorTrackingNumber?: string;
  status: GrantApplicationStatus;
  submittedAt: string;
  decisionDate?: string;
  declineReason?: string;
  createdAt: string;
}

export interface GrantAward {
  awardId: string;
  awardNumber: string;
  grantApplicationIdRef: string;
  projectIdRef: string;
  sponsorName: string;
  sponsorAwardReferenceNumber: string;
  tenantId: string;
  campusIdRef: string;
  financialAccountIdRef?: string; // Phase 11.2 Ref
  awardedAmount: ResearchCurrencyAmount;
  indirectOverheadAmount: ResearchCurrencyAmount;
  awardStartDate: string;
  awardEndDate: string;
  status: GrantAwardStatus;
  termsAndConditionsSummary: string;
  reportingRequirements: {
    financialReportFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY';
    technicalReportFrequency: 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY' | 'FINAL_ONLY';
    nextReportDueDate: string;
  };
  acceptedByUserIdRef: string;
  acceptedAt: string;
}

export interface SponsoredProgram {
  programId: string;
  programCode: string;
  title: string;
  sponsorName: string;
  tenantId: string;
  campusIdRef: string;
  leadCoordinatorEmployeeIdRef: string;
  associatedProjectsCount: number;
  totalCommittedFunding: ResearchCurrencyAmount;
  activeGrantAwardsCount: number;
  status: 'ACTIVE' | 'CONCLUDED' | 'ON_HOLD';
  startDate: string;
  endDate: string;
}

// ==========================================
// 8. RESEARCH PROJECTS & VERSIONS
// ==========================================

export interface ResearchProject {
  projectId: string;
  projectCode: string;
  title: string;
  tenantId: string;
  campusIdRef: string;
  researchUnitIdRef: string;
  proposalIdRef?: string;
  grantAwardIdRef?: string;
  principalInvestigator: PrincipalInvestigatorReference;
  disciplineCategory: string; // Phase 10.2
  totalBudget: ResearchCurrencyAmount;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  status: ResearchProjectStatus;
  version: number;
  confidentialityLevel: 'PUBLIC' | 'INSTITUTIONAL' | 'RESTRICTED' | 'CLASSIFIED_SPONSOR';
  facilitySpaceRefs?: string[]; // Phase 11.5 Space Ref
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProjectVersion {
  versionId: string;
  projectIdRef: string;
  versionNumber: number;
  snapshotTimestamp: string;
  changedByUserIdRef: string;
  changeJustification: string;
  projectStateSnapshot: Partial<ResearchProject>;
}

// ==========================================
// 9. MILESTONES & DELIVERABLES
// ==========================================

export interface ResearchMilestone {
  milestoneId: string;
  projectIdRef: string;
  tenantId: string;
  milestoneCode: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  weightPercentage: number;
  status: ResearchMilestoneStatus;
  deliverableRefs: string[];
  verifiedByUserIdRef?: string;
  createdAt: string;
}

export interface ResearchDeliverable {
  deliverableId: string;
  milestoneIdRef: string;
  projectIdRef: string;
  tenantId: string;
  title: string;
  deliverableType: 'TECHNICAL_REPORT' | 'CODE_RELEASE' | 'DATASET_DEPOSIT' | 'PROTOTYPE_DEMO' | 'MANUSCRIPT_PREPRINT';
  formatSpecification: string;
  dueDate: string;
  status: ResearchDeliverableStatus;
  repositoryUri?: string;
  reviewerNotes?: string;
  reviewedByUserIdRef?: string;
}

// ==========================================
// 10. BUDGETS & EXPENDITURE REFERENCES
// ==========================================

export interface ResearchBudgetLine {
  lineId: string;
  category: ResearchBudgetCategory;
  description: string;
  allocatedAmount: ResearchCurrencyAmount;
  committedAmount: ResearchCurrencyAmount;
  expendedAmount: ResearchCurrencyAmount;
  equipmentAssetIdRef?: string; // Phase 11.7
  personnelEmployeeIdRef?: string; // Phase 11.1
}

export interface ResearchBudget {
  budgetId: string;
  projectIdRef: string;
  tenantId: string;
  campusIdRef: string;
  financialAccountIdRef?: string; // Phase 11.2 General Ledger Account Ref
  totalAllocated: ResearchCurrencyAmount;
  totalCommitted: ResearchCurrencyAmount;
  totalExpended: ResearchCurrencyAmount;
  totalRemaining: ResearchCurrencyAmount;
  indirectOverheadRate: number;
  lines: ResearchBudgetLine[];
  lastReconciledAt: string;
}

export interface ResearchExpenditureReference {
  expenditureRefId: string;
  budgetIdRef: string;
  lineIdRef: string;
  tenantId: string;
  transactionIdRef: string; // Phase 11.2 Payment Transaction Ref
  purchaseOrderIdRef?: string; // Phase 11.3 PO Ref
  storeMaterialIdRef?: string; // Phase 11.7 Material Ref
  amount: ResearchCurrencyAmount;
  expenditureDate: string;
  justification: string;
  authorizedByUserIdRef: string;
}

// ==========================================
// 11. COMPLIANCE, ETHICS & BIOSAFETY
// ==========================================

export interface ResearchEthicsReference {
  ethicsProtocolId: string;
  projectIdRef: string;
  tenantId: string;
  protocolNumber: string;
  reviewBoardType: 'IRB_HUMAN_SUBJECTS' | 'IACUC_ANIMAL_CARE' | 'IBC_BIOSAFETY' | 'RADIATION_SAFETY' | 'DATA_ETHICS';
  submissionDate: string;
  approvalDate?: string;
  expirationDate?: string;
  status: ResearchComplianceStatus;
  leadReviewerUserIdRef?: string;
  conditionsOfApproval?: string;
}

export interface ResearchComplianceReview {
  reviewId: string;
  projectIdRef: string;
  tenantId: string;
  requirementType: string;
  status: ResearchComplianceStatus;
  riskRating: ResearchRiskSeverity;
  reviewNotes: string;
  reviewedByUserIdRef: string;
  reviewDate: string;
  validUntil: string;
}

// ==========================================
// 12. RISKS & ISSUES
// ==========================================

export interface ResearchRisk {
  riskId: string;
  projectIdRef: string;
  tenantId: string;
  title: string;
  description: string;
  category: 'FINANCIAL' | 'TECHNICAL' | 'COMPLIANCE' | 'PERSONNEL' | 'SUPPLY_CHAIN' | 'TIMELINE';
  probability: ResearchRiskProbability;
  severity: ResearchRiskSeverity;
  riskScore: number; // 1 to 16
  mitigationPlan: string;
  ownerEmployeeIdRef: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'MONITORED' | 'RESOLVED' | 'ACCEPTED';
  createdAt: string;
}

export interface ResearchIssue {
  issueId: string;
  projectIdRef: string;
  tenantId: string;
  title: string;
  description: string;
  severity: ResearchRiskSeverity;
  escalationRequired: boolean;
  assignedToUserIdRef: string;
  resolutionSummary?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED';
  reportedAt: string;
  resolvedAt?: string;
}

// ==========================================
// 13. RESEARCH OUTPUTS & PUBLICATIONS
// ==========================================

export interface ResearchPublication {
  publicationId: string;
  projectIdRef: string;
  tenantId: string;
  title: string;
  authors: string[];
  journalOrVenueName: string;
  publicationType: ResearchOutputType;
  doi?: string;
  issnOrIsbn?: string;
  peerReviewed: boolean;
  openAccess: boolean;
  publicationYear: number;
  citationCount: number;
  libraryResourceCatalogIdRef?: string; // Phase 11.8 Library Ref
  status: 'SUBMITTED' | 'ACCEPTED' | 'PUBLISHED' | 'IN_PRESS';
  publishedDate?: string;
}

export interface ResearchOutput {
  outputId: string;
  projectIdRef: string;
  tenantId: string;
  outputCode: string;
  title: string;
  outputType: ResearchOutputType;
  primaryAuthorName: string;
  summary: string;
  externalIdentifier?: string;
  repositoryLink?: string;
  disseminationDate: string;
  createdAt: string;
}

// ==========================================
// 14. INTELLECTUAL PROPERTY & PATENTS
// ==========================================

export interface ResearchIntellectualProperty {
  ipId: string;
  ipCode: string;
  projectIdRef: string;
  tenantId: string;
  campusIdRef: string;
  inventionTitle: string;
  inventorEmployeeRefs: string[];
  disclosureDate: string;
  ipType: 'PATENT' | 'COPYRIGHT' | 'TRADEMARK' | 'TRADE_SECRET' | 'PLANT_BREEDERS_RIGHT';
  patentApplicationNumber?: string;
  filingJurisdiction?: string;
  status: IntellectualPropertyStatus;
  institutionalOwnershipPercentage: number;
  inventorRevenueSharePercentage: number;
  commercialStatus: 'UNASSIGNED' | 'EVALUATING' | 'MARKETED' | 'LICENSED' | 'SPINOFF_FORMED';
  confidentialityLevel: 'CONFIDENTIAL' | 'PUBLIC_DISCLOSED';
  createdAt: string;
}

// ==========================================
// 15. INNOVATION & COMMERCIALIZATION
// ==========================================

export interface InnovationPartner {
  partnerId: string;
  name: string;
  partnerType: 'INCUBATOR' | 'ANGEL_INVESTOR' | 'VENTURE_CAPITAL' | 'CORPORATE_R_AND_D' | 'GOVERNMENT_TECH_TRANSFER';
  contactPerson: string;
  contactEmail: string;
  mouReferenceNumber?: string;
  status: 'ACTIVE' | 'PROSPECTIVE' | 'TERMINATED';
}

export interface InnovationProject {
  innovationId: string;
  code: string;
  title: string;
  tenantId: string;
  campusIdRef: string;
  originatingProjectIdRef?: string;
  ipIdRef?: string;
  founderEmployeeIdRef: string;
  technologyReadinessLevel: number; // 1 to 9 (TRL)
  targetMarket: string;
  incubationSpaceRef?: string; // Phase 11.5 Space Ref
  partnerRefs: string[];
  status: InnovationProjectStatus;
  fundingRaised: ResearchCurrencyAmount;
  createdAt: string;
  updatedAt: string;
}

export interface CommercializationOpportunity {
  opportunityId: string;
  innovationIdRef: string;
  ipIdRef?: string;
  tenantId: string;
  commercializationType: CommercializationType;
  licenseePartnerName: string;
  dealValue: ResearchCurrencyAmount;
  royaltyPercentage: number;
  agreementStatus: 'TERM_SHEET' | 'LEGAL_DRAFTING' | 'EXECUTED' | 'ACTIVE_ROYALTIES' | 'CONCLUDED';
  executionDate?: string;
  approvedByUserIdRef: string;
  createdAt: string;
}

// ==========================================
// 16. GRANT AMENDMENTS, EXTENSIONS & CLOSEOUT
// ==========================================

export interface GrantAmendment {
  amendmentId: string;
  awardIdRef: string;
  tenantId: string;
  amendmentNumber: string;
  requestedByUserIdRef: string;
  approverUserIdRef?: string;
  amendmentType: 'NO_COST_EXTENSION' | 'BUDGET_REALLOCATION' | 'PI_CHANGE' | 'SCOPE_REVISION';
  requestedExtensionDays?: number;
  justification: string;
  status: 'SUBMITTED' | 'UNDER_SPONSOR_REVIEW' | 'APPROVED' | 'REJECTED';
  requestedDate: string;
  approvedDate?: string;
}

export interface GrantCloseout {
  closeoutId: string;
  awardIdRef: string;
  projectIdRef: string;
  tenantId: string;
  financialCloseoutVerified: boolean;
  technicalReportsSubmitted: boolean;
  propertyInventoryDecommissioned: boolean; // Phase 11.7
  ipDisclosuresComplete: boolean;
  unexpendedFundsReconciled: ResearchCurrencyAmount;
  closingAuditorUserIdRef: string;
  approverUserIdRef: string;
  status: 'PENDING_VERIFICATION' | 'AUDIT_APPROVED' | 'COMPLETED' | 'CANCELLED';
  closedAt?: string;
}

// ==========================================
// 17. AUDIT TRAIL (SHA-256 Chained)
// ==========================================

export interface ResearchAuditEvent {
  eventId: string;
  tenantId: string;
  campusId: string;
  actorUserIdRef: string;
  action: string;
  entityId: string;
  entityType: 'RESEARCH_PROJECT' | 'PROPOSAL' | 'GRANT_AWARD' | 'BUDGET' | 'MILESTONE' | 'COMPLIANCE' | 'IP' | 'INNOVATION' | 'CLOSEOUT';
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  previousAuditHash: string;
  currentAuditHash: string;
  details: Record<string, any>;
}

// ==========================================
// 18. DIAGNOSTICS & SIMULATION
// ==========================================

export interface ResearchDiagnostic {
  diagnosticId: string;
  code: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  entityType: string;
  entityId: string;
  message: string;
  recommendedAction: string;
  timestamp: string;
}

export interface ResearchDiagnosticResult {
  tenantId: string;
  scannedAt: string;
  totalProjectsScanned: number;
  totalProposalsScanned: number;
  totalAwardsScanned: number;
  totalBudgetsScanned: number;
  diagnostics: ResearchDiagnostic[];
  auditChainIntact: boolean;
  selfApprovalViolationsCount: number;
  overdueMilestonesCount: number;
  complianceGapsCount: number;
  status: 'HEALTHY' | 'WARNINGS_DETECTED' | 'CRITICAL_FAILURES';
}

export interface ResearchSimulationScenario {
  scenarioId: string;
  type:
    | 'GRANT_APPLICATION_SURGE'
    | 'FUNDING_OPPORTUNITY_DEADLINE_SURGE'
    | 'RESEARCH_PROJECT_SURGE'
    | 'BUDGET_CUT_SCENARIO'
    | 'BUDGET_INCREASE_SCENARIO'
    | 'MILESTONE_DELAY_CASCADE'
    | 'RESEARCHER_CAPACITY_SHORTAGE'
    | 'GRANT_EXTENSION_SURGE'
    | 'GRANT_CLOSEOUT_SURGE'
    | 'COMPLIANCE_REVIEW_BACKLOG'
    | 'RESEARCH_RISK_ESCALATION'
    | 'IP_DISCLOSURE_SURGE'
    | 'INNOVATION_PIPELINE_SURGE'
    | 'COMMERCIALIZATION_DELAY'
    | 'MULTI_CAMPUS_RESEARCH_PROGRAM';
  name: string;
  description: string;
  stressFactorMultiplier: number;
}

export interface ResearchSimulationResult {
  scenarioType: ResearchSimulationScenario['type'];
  simulationBanner: 'SIMULATION ONLY - SANDBOX MODE ACTIVE - ZERO PRODUCTION MUTATION';
  timestamp: string;
  stressFactorMultiplier: number;
  projectedProposalVolume: number;
  projectedAwardValue: ResearchCurrencyAmount;
  projectedMilestoneDelaysCount: number;
  projectedComplianceBacklogDays: number;
  projectedBudgetVariancePercent: number;
  zeroProductionMutationVerified: boolean;
  recommendations: string[];
}
