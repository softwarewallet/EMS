/**
 * EMS Phase 11.15: Institutional Advancement, Fundraising, Donor, Philanthropy & Development Operations
 * Authoritative strongly typed domain models.
 */

export type DonorLifecycleStatus =
  | 'PROSPECT'
  | 'QUALIFICATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DECEASED'
  | 'DO_NOT_CONTACT'
  | 'ARCHIVED';

export type ProspectStage =
  | 'IDENTIFIED'
  | 'RESEARCH'
  | 'QUALIFIED'
  | 'CULTIVATION'
  | 'SOLICITATION_READY'
  | 'SOLICITED'
  | 'WON'
  | 'LOST'
  | 'NURTURE';

export type CampaignLifecycleStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'APPROVAL'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETION_REVIEW'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export type OpportunityStage =
  | 'IDENTIFIED'
  | 'QUALIFIED'
  | 'CULTIVATION'
  | 'ASK_PLANNED'
  | 'SOLICITED'
  | 'NEGOTIATION'
  | 'COMMITTED'
  | 'WON'
  | 'LOST'
  | 'CLOSED';

export type SolicitationStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PRESENTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'WITHDRAWN';

export type PledgeStatus =
  | 'PROPOSED'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'PARTIALLY_FULFILLED'
  | 'FULFILLED'
  | 'DEFAULTED'
  | 'CANCELLED'
  | 'CLOSED';

export type GiftStatus =
  | 'PROPOSED'
  | 'PENDING_REVIEW'
  | 'ACCEPTED'
  | 'ACKNOWLEDGED'
  | 'ALLOCATED'
  | 'STEWARDED'
  | 'CLOSED';

export type GiftType =
  | 'ONE_TIME'
  | 'RECURRING'
  | 'IN_KIND'
  | 'MATCHING'
  | 'MEMORIAL'
  | 'TRIBUTE'
  | 'CORPORATE'
  | 'FOUNDATION'
  | 'OTHER';

export type ComplianceCaseStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'CLEARED'
  | 'ESCALATED'
  | 'REJECTED'
  | 'CLOSED';

export interface CurrencyAmount {
  currencyCode: string;
  amountMinorUnits: number;
}

export interface DonorProfile {
  donorId: string;
  tenantId: string;
  campusIdRef: string;
  constituentType: 'INDIVIDUAL' | 'ALUMNI' | 'PARENT' | 'FACULTY_STAFF' | 'CORPORATE' | 'FOUNDATION' | 'TRUST' | 'ANONYMOUS';
  displayName: string;
  email: string;
  phone: string;
  status: DonorLifecycleStatus;
  alumniProfileIdRef?: string;
  employeeIdRef?: string;
  studentIdRef?: string;
  createdAt: string;
  updatedAt: string;
  createdByUserIdRef: string;
}

export interface ProspectProfile {
  prospectId: string;
  tenantId: string;
  campusIdRef: string;
  donorIdRef: string;
  stage: ProspectStage;
  estimatedCapacity: CurrencyAmount;
  interestAreas: string[];
  relationshipOwnerUserIdRef: string;
  probability: number;
  nextAction: string;
  nextActionDate: string;
  updatedAt: string;
}

export interface FundraisingCampaign {
  campaignId: string;
  tenantId: string;
  campusIdRef: string;
  campaignCode: string;
  campaignName: string;
  objective: string;
  startDate: string;
  endDate: string;
  targetAmount: CurrencyAmount;
  raisedAmount: CurrencyAmount;
  targetParticipation: number;
  restrictedPurpose: string;
  status: CampaignLifecycleStatus;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundraisingOpportunity {
  opportunityId: string;
  tenantId: string;
  campusIdRef: string;
  donorIdRef: string;
  campaignIdRef: string;
  officerUserIdRef: string;
  stage: OpportunityStage;
  expectedValue: CurrencyAmount;
  expectedCloseDate: string;
  purpose: string;
  probability: number;
  nextAction: string;
  updatedAt: string;
}

export interface SolicitationRecord {
  solicitationId: string;
  tenantId: string;
  campusIdRef: string;
  opportunityIdRef: string;
  donorIdRef: string;
  campaignIdRef: string;
  askAmount: CurrencyAmount;
  purpose: string;
  status: SolicitationStatus;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  presentedDate?: string;
  responseDate?: string;
}

export interface PledgeRecord {
  pledgeId: string;
  tenantId: string;
  campusIdRef: string;
  donorIdRef: string;
  campaignIdRef: string;
  pledgedAmount: CurrencyAmount;
  fulfilledAmount: CurrencyAmount;
  outstandingAmount: CurrencyAmount;
  schedule: string;
  status: PledgeStatus;
  purpose: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface GiftAllocation {
  allocationId: string;
  giftIdRef: string;
  purposeCode: string;
  allocatedAmount: CurrencyAmount;
  financialAccountIdRef?: string;
}

export interface GiftRecord {
  giftId: string;
  tenantId: string;
  campusIdRef: string;
  donorIdRef: string;
  campaignIdRef?: string;
  pledgeIdRef?: string;
  giftType: GiftType;
  amount: CurrencyAmount;
  status: GiftStatus;
  allocations: GiftAllocation[];
  financialTransactionIdRef?: string;
  financialAccountIdRef?: string;
  receivedDate: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
}

export interface RecurringGiftArrangement {
  recurringId: string;
  tenantId: string;
  campusIdRef: string;
  donorIdRef: string;
  installmentAmount: CurrencyAmount;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  startDate: string;
  expectedEndDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

export interface GiftAcknowledgementRecord {
  acknowledgementId: string;
  giftIdRef: string;
  donorIdRef: string;
  status: 'PENDING' | 'PREPARED' | 'REVIEW' | 'APPROVED' | 'SENT' | 'CONFIRMED' | 'CLOSED';
  communicationCampaignIdRef?: string;
  sentDate?: string;
  approvedByUserIdRef?: string;
}

export interface StewardshipPlan {
  planId: string;
  donorIdRef: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  officerUserIdRef: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
}

export interface StewardshipActivity {
  activityId: string;
  planIdRef: string;
  activityType: 'IMPACT_REPORT' | 'DONOR_MEETING' | 'APPRECIATION_EVENT' | 'ANNUAL_UPDATE' | 'FUND_REPORT';
  dueDate: string;
  status: 'PLANNED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  officerUserIdRef: string;
}

export interface DonorRecognitionRecord {
  recognitionId: string;
  donorIdRef: string;
  tenantId: string;
  campusIdRef: string;
  level: string;
  optOut: boolean;
  namingReference?: string;
  approvedByUserIdRef?: string;
}

export interface CorporatePartnerRecord {
  partnerId: string;
  tenantId: string;
  campusIdRef: string;
  companyName: string;
  industry: string;
  relationshipOwnerUserIdRef: string;
  activeStatus: 'ACTIVE' | 'PROSPECT' | 'INACTIVE';
}

export interface DevelopmentInteraction {
  interactionId: string;
  donorIdRef: string;
  officerUserIdRef: string;
  interactionType: 'MEETING' | 'CALL' | 'EMAIL_REFERENCE' | 'EVENT' | 'VISIT' | 'PROPOSAL';
  date: string;
  purpose: string;
  outcome: string;
  nextAction: string;
}

export interface FundraisingTask {
  taskId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  assignedToUserIdRef: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  donorIdRef?: string;
}

export interface GiftComplianceCase {
  caseId: string;
  tenantId: string;
  campusIdRef: string;
  giftIdRef?: string;
  donorIdRef: string;
  category: 'RESTRICTION_CONCERN' | 'UNUSUAL_PATTERN' | 'MISSING_AGREEMENT' | 'ANONYMOUS_REVIEW' | 'PURPOSE_CONFLICT';
  status: ComplianceCaseStatus;
  description: string;
  escalatedToUserIdRef?: string;
  resolvedAt?: string;
}

export interface AdvancementFinding {
  findingId: string;
  tenantId: string;
  campusIdRef: string;
  category: 'COMPLIANCE' | 'ALLOCATION' | 'PLEDGE' | 'AUDIT';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVED';
  detectedAt: string;
}

export interface AdvancementAuditEvent {
  eventId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  previousHash: string;
  currentHash: string;
  actorUserIdRef: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  payloadDigest: string;
}

export interface AdvancementSimulationScenario {
  scenarioId: string;
  scenarioType:
    | 'MAJOR_CAMPAIGN_SURGE'
    | 'DONOR_SURGE'
    | 'MASS_PLEDGE_DEFAULT'
    | 'LARGE_GIFT_SCENARIO'
    | 'RESTRICTED_GIFT_ALLOCATION_CONFLICT'
    | 'CAMPAIGN_TARGET_SHORTFALL'
    | 'DONOR_ATTRITION'
    | 'RECURRING_GIVING_FAILURE_WAVE'
    | 'STEWARDSHIP_BACKLOG'
    | 'CORPORATE_PARTNER_WITHDRAWAL'
    | 'FOUNDATION_FUNDING_SURGE'
    | 'CAMPAIGN_EXTENSION'
    | 'MAJOR_GIFT_PIPELINE_SURGE'
    | 'MULTI_CAMPUS_CAMPAIGN'
    | 'EMERGENCY_FUNDRAISING_SCENARIO';
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}
