/**
 * EMS Phase 11.14: Institutional Internationalization, Global Mobility, Partnerships & Transnational Education Operations
 * Authoritative type definitions.
 */

export type PartnerLifecycleStatus =
  | 'PROSPECT'
  | 'DUE_DILIGENCE'
  | 'REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'RENEWAL_REVIEW'
  | 'EXPIRED'
  | 'TERMINATED';

export type AgreementLifecycleStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'EXECUTED'
  | 'ACTIVE'
  | 'RENEWAL_REVIEW'
  | 'EXPIRED'
  | 'TERMINATED';

export type MobilityProgramStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'APPLICATIONS_OPEN'
  | 'SELECTION'
  | 'NOMINATION'
  | 'PLACEMENT'
  | 'PRE_DEPARTURE'
  | 'ACTIVE'
  | 'COMPLETION_REVIEW'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export type MobilityApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ELIGIBILITY_CHECK'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'NOMINATED'
  | 'PLACED'
  | 'PRE_DEPARTURE'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'CANCELLED';

export type ArrivalDepartureStatus =
  | 'PREPARING'
  | 'ARRIVAL_SCHEDULED'
  | 'ARRIVED'
  | 'ACTIVE'
  | 'DEPARTURE_SCHEDULED'
  | 'DEPARTED'
  | 'COMPLETED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ImmigrationCaseStatus =
  | 'NOT_STARTED'
  | 'DOCUMENTS_PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CLOSED';

export interface InternationalOfficeProfile {
  profileId: string;
  tenantId: string;
  campusIdRef: string;
  officeName: string;
  directorName: string;
  contactEmail: string;
  regionCoverage: string[];
  activeProgramsCount: number;
  activePartnersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerContactReference {
  contactId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: string;
}

export interface PartnerDueDiligenceSnapshot {
  assessmentId: string;
  partnerIdRef: string;
  governancePolicyIdRef?: string;
  reputationalScore: number;
  financialStabilityScore: number;
  regulatoryComplianceStatus: 'COMPLIANT' | 'REVIEW_REQUIRED' | 'NON_COMPLIANT';
  sanctionsCheckPassed: boolean;
  assessedByUserIdRef: string;
  assessedAt: string;
  expiresAt: string;
}

export interface InternationalPartner {
  partnerId: string;
  tenantId: string;
  campusIdRef: string;
  partnerCode: string;
  institutionName: string;
  country: string;
  region: string;
  website: string;
  status: PartnerLifecycleStatus;
  dueDiligenceSnapshot?: PartnerDueDiligenceSnapshot;
  primaryContact: PartnerContactReference;
  governanceReferenceId?: string;
  createdAt: string;
  updatedAt: string;
  createdByUserIdRef: string;
}

export interface PartnershipAgreementVersion {
  versionId: string;
  agreementIdRef: string;
  versionNumber: number;
  termsSummary: string;
  authorizedSignatoryHome: string;
  authorizedSignatoryPartner: string;
  documentReferenceId: string;
  createdAt: string;
}

export interface PartnershipAgreementMilestone {
  milestoneId: string;
  agreementIdRef: string;
  title: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}

export interface PartnershipAgreement {
  agreementId: string;
  tenantId: string;
  campusIdRef: string;
  agreementNumber: string;
  partnerIdRef: string;
  partnerName: string;
  agreementType: 'MOU' | 'STUDENT_EXCHANGE' | 'DUAL_DEGREE' | 'RESEARCH_COLLABORATION' | 'ARTICULATION';
  status: AgreementLifecycleStatus;
  effectiveDate: string;
  expirationDate: string;
  currentVersionNumber: number;
  versions: PartnershipAgreementVersion[];
  milestones: PartnershipAgreementMilestone[];
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipRenewal {
  renewalId: string;
  agreementIdRef: string;
  partnerIdRef: string;
  reviewStatus: 'PENDING' | 'RECOMMENDED_FOR_RENEWAL' | 'MODIFIED_RENEWAL' | 'TERMINATION_RECOMMENDED';
  reviewedByUserIdRef: string;
  reviewedAt: string;
  comments: string;
}

export interface CollaborationPortfolio {
  portfolioId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  description: string;
  activePartnersCount: number;
  activeAgreementsCount: number;
  totalMobilityCapacity: number;
  updatedAt: string;
}

export interface InternationalProgram {
  programId: string;
  tenantId: string;
  campusIdRef: string;
  programCode: string;
  programName: string;
  category: 'EXCHANGE' | 'STUDY_ABROAD' | 'FACULTY_LED' | 'RESEARCH_MOBILITY';
  termCode: string;
  capacityTotal: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

export interface MobilityProgramCapacity {
  programIdRef: string;
  totalSeats: number;
  inboundSeatsAllocated: number;
  outboundSeatsAllocated: number;
  reservedSeats: number;
}

export interface MobilityEligibilitySnapshot {
  snapshotId: string;
  studentIdRef: string;
  programIdRef: string;
  gpa: number;
  completedCredits: number;
  standing: 'GOOD_STANDING' | 'PROBATION' | 'INELIGIBLE';
  languageRequirementMet: boolean;
  evaluatedAt: string;
  result: 'ELIGIBLE' | 'INSUFFICIENT_DATA' | 'INELIGIBLE';
}

export interface MobilityApproval {
  approvalId: string;
  targetType: 'APPLICATION' | 'AGREEMENT' | 'EXCEPTION';
  targetId: string;
  requesterUserIdRef: string;
  approverUserIdRef: string;
  approvedAt: string;
  approvalReason: string;
  correlationId: string;
  auditEventIdRef: string;
}

export interface MobilityApplication {
  applicationId: string;
  tenantId: string;
  campusIdRef: string;
  applicationNumber: string;
  studentIdRef: string;
  studentName: string;
  programIdRef: string;
  partnerIdRef: string;
  partnerName: string;
  status: MobilityApplicationStatus;
  eligibilitySnapshot?: MobilityEligibilitySnapshot;
  preferenceRank: number;
  submittedAt: string;
  updatedAt: string;
  idempotencyKey?: string;
}

export interface MobilityParticipant {
  participantId: string;
  tenantId: string;
  campusIdRef: string;
  applicationIdRef: string;
  studentIdRef: string;
  studentName: string;
  programIdRef: string;
  partnerIdRef: string;
  partnerName: string;
  mobilityType: 'INBOUND' | 'OUTBOUND';
  status: ArrivalDepartureStatus;
  startDate: string;
  endDate: string;
}

export interface MobilityPlacement {
  placementId: string;
  applicationIdRef: string;
  studentIdRef: string;
  hostPartnerIdRef: string;
  hostInstitutionName: string;
  assignedCourseCodes: string[];
  housingAssigned: boolean;
  confirmedAt: string;
  status: 'CONFIRMED' | 'MODIFIED' | 'CANCELLED';
}

export interface InboundMobilityCase {
  caseId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  homePartnerIdRef: string;
  homePartnerName: string;
  hostDepartmentRef: string;
  arrivalStatus: ArrivalDepartureStatus;
  supportCaseReferenceId?: string;
  accommodationReferenceId?: string;
  insuranceReferenceId?: string;
  immigrationCaseReferenceId?: string;
}

export interface OutboundMobilityCase {
  caseId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  hostPartnerIdRef: string;
  hostPartnerName: string;
  departureStatus: ArrivalDepartureStatus;
  creditTransferReferenceIds: string[];
  insuranceReferenceId?: string;
  travelComplianceSnapshotId?: string;
}

export interface ExchangeNomination {
  nominationId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  studentName: string;
  partnerIdRef: string;
  direction: 'INBOUND' | 'OUTBOUND';
  status: 'NOMINATED' | 'ACCEPTED' | 'DECLINED';
  nominatedAt: string;
}

export interface VisitingStudentCase {
  visitingStudentId: string;
  tenantId: string;
  campusIdRef: string;
  studentName: string;
  homeInstitution: string;
  hostDepartment: string;
  term: string;
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN';
}

export interface VisitingScholarCase {
  scholarId: string;
  tenantId: string;
  campusIdRef: string;
  scholarName: string;
  homeInstitution: string;
  hostDepartmentRef: string;
  researchProjectRef?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface VisitingFacultyCase {
  facultyId: string;
  tenantId: string;
  campusIdRef: string;
  facultyName: string;
  homeInstitution: string;
  hostDepartmentRef: string;
  teachingAssignmentRef?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface MobilityArrivalRecord {
  arrivalId: string;
  tenantId: string;
  campusIdRef: string;
  participantIdRef: string;
  studentName: string;
  arrivalDate: string;
  airportPickupRequested: boolean;
  orientationCompleted: boolean;
  checkedInByUserIdRef: string;
}

export interface MobilityDepartureRecord {
  departureId: string;
  tenantId: string;
  campusIdRef: string;
  participantIdRef: string;
  studentName: string;
  departureDate: string;
  clearanceGranted: boolean;
  exitSurveyCompleted: boolean;
  processedByUserIdRef: string;
}

export interface MobilityCompletionRecord {
  completionId: string;
  participantIdRef: string;
  creditsEarned: number;
  transcriptReceived: boolean;
  completedAt: string;
}

export interface MobilityIncident {
  incidentId: string;
  tenantId: string;
  campusIdRef: string;
  participantIdRef: string;
  studentName: string;
  severity: IncidentSeverity;
  category: 'TRAVEL_DISRUPTION' | 'DOCUMENTATION' | 'SAFETY_CONCERN' | 'ACADEMIC_ISSUES' | 'MEDICAL';
  description: string;
  reportedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
}

export interface MobilityException {
  exceptionId: string;
  tenantId: string;
  campusIdRef: string;
  exceptionType: 'LATE_APPLICATION' | 'CAPACITY_OVERRIDE' | 'ELIGIBILITY_WAIVER' | 'AGREEMENT_EXCEPTION';
  description: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  approvedAt?: string;
  correlationId: string;
}

export interface MobilityDocumentReference {
  documentId: string;
  entityIdRef: string;
  documentType: 'PASSPORT' | 'VISA' | 'INSURANCE_CERTIFICATE' | 'TRANSCRIPT' | 'AGREEMENT';
  documentReferenceUrl: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  expiresAt: string;
}

export interface InsuranceCoverageReference {
  insuranceId: string;
  participantIdRef: string;
  policyNumber: string;
  providerName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface ImmigrationCaseReference {
  immigrationCaseId: string;
  participantIdRef: string;
  caseNumber: string;
  visaType: string;
  status: ImmigrationCaseStatus;
  submissionDate: string;
  expiryDate: string;
}

export interface TravelComplianceSnapshot {
  complianceId: string;
  participantIdRef: string;
  travelAdvisoryLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';
  acknowledgementSigned: boolean;
  briefingCompleted: boolean;
  verifiedAt: string;
}

export interface InternationalFeeReference {
  feeId: string;
  applicationIdRef: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'WAIVED';
}

export interface StipendReference {
  stipendId: string;
  participantIdRef: string;
  amount: number;
  disbursed: boolean;
  disbursedDate?: string;
}

export interface ScholarshipReference {
  scholarshipId: string;
  participantIdRef: string;
  scholarshipName: string;
  awardAmount: number;
  status: 'ACTIVE' | 'DISBURSED' | 'REVOKED';
}

export interface CreditTransferReference {
  transferId: string;
  participantIdRef: string;
  hostCourseCode: string;
  homeCourseEquivalent: string;
  creditsEarned: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TransnationalEducationArrangement {
  arrangementId: string;
  tenantId: string;
  campusIdRef: string;
  arrangementNumber: string;
  partnerIdRef: string;
  partnerName: string;
  programIdRef: string;
  deliveryModel: 'BRANCH_CAMPUS' | 'FRANCHISE' | 'DUAL_DEGREE' | 'ARTICULATION' | 'ONLINE_GLOBAL';
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  effectiveDate: string;
  expirationDate: string;
  maxCapacity: number;
}

export interface DualDegreeArrangement {
  dualDegreeId: string;
  arrangementIdRef: string;
  homeProgramRef: string;
  partnerProgramRef: string;
  jointCredentialIssued: boolean;
}

export interface ArticulationArrangement {
  articulationId: string;
  arrangementIdRef: string;
  transferCreditsMax: number;
  minimumGpaRequired: number;
}

export interface FranchiseArrangement {
  franchiseId: string;
  arrangementIdRef: string;
  royaltyPercentage: number;
  qualityAssuranceFrequencyMonths: number;
}

export interface InternationalProgramDelivery {
  deliveryId: string;
  arrangementIdRef: string;
  siteLocation: string;
  instructorRef: string;
  enrolledCount: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface PartnerPerformanceReview {
  reviewId: string;
  tenantId: string;
  campusIdRef: string;
  partnerIdRef: string;
  partnerName: string;
  reviewPeriod: string;
  overallScore: number;
  fulfillmentScore: number;
  complianceScore: number;
  recommendation: 'RENEW' | 'EXPAND' | 'REVIEW' | 'TERMINATE';
  reviewedAt: string;
}

export interface InternationalOutcome {
  outcomeId: string;
  tenantId: string;
  campusIdRef: string;
  programIdRef: string;
  metricName: string;
  measuredValue: number;
  targetValue: number;
  recordedAt: string;
}

export interface InternationalOperationalFinding {
  findingId: string;
  tenantId: string;
  campusIdRef: string;
  category: 'COMPLIANCE' | 'CAPACITY' | 'AGREEMENT' | 'SAFETY';
  description: string;
  severity: IncidentSeverity;
  status: 'OPEN' | 'RESOLVED';
  detectedAt: string;
}

export interface InternationalAuditEvent {
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

export interface SimulationScenario {
  scenarioId: string;
  scenarioType:
    | 'PARTNER_SURGE'
    | 'MOBILITY_APPLICATION_SURGE'
    | 'OUTBOUND_CAPACITY_EXHAUSTION'
    | 'INBOUND_CAPACITY_EXHAUSTION'
    | 'PARTNER_SUSPENSION'
    | 'AGREEMENT_EXPIRY'
    | 'MASS_MOBILITY_CANCELLATION'
    | 'DESTINATION_COUNTRY_RISK_CHANGE'
    | 'INSURANCE_EXPIRY_WAVE'
    | 'IMMIGRATION_DELAY_WAVE'
    | 'TRANSNATIONAL_PROGRAM_SUSPENSION'
    | 'PARTNER_RENEWAL_FAILURE'
    | 'EMERGENCY_RETURN_SCENARIO'
    | 'CREDIT_TRANSFER_BOTTLENECK'
    | 'CROSS_CAMPUS_MOBILITY_SURGE';
  title: string;
  description: string;
  impactScore: number;
  simulatedAt: string;
  recommendations: string[];
}

export type SimulationScenarioType = SimulationScenario['scenarioType'];

