/**
 * EMS PHASE 11.10: Institutional Library, Knowledge, Learning Resources & Information Services Operations Types
 * Authoritative domain types for library resource cataloging, institutional holdings, copies, physical/digital circulation,
 * patrons, borrowing policies, loans, returns, renewals, reservations, waitlists, overdue processing, fines/charges,
 * digital resources, electronic subscriptions, research resource services, reference desk operations, reading room reservations,
 * inter-campus transfers, acquisition requests, collection reviews, preservation, loss/damage, disposal governance,
 * diagnostics, what-if simulations, and tamper-evident SHA-256 audit chaining.
 */

// ==========================================
// 1. LIFECYCLE & OPERATIONAL STATUS ENUMS
// ==========================================

export type ResourceLifecycle =
  | 'DRAFT'
  | 'CATALOGED'
  | 'ACTIVE'
  | 'UNDER_REVIEW'
  | 'RESTRICTED'
  | 'PRESERVATION_HOLD'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type ResourceAvailability =
  | 'AVAILABLE'
  | 'ON_LOAN'
  | 'RESERVED'
  | 'IN_TRANSIT'
  | 'PROCESSING'
  | 'REPAIR'
  | 'LOST'
  | 'DAMAGED'
  | 'QUARANTINED'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type ResourceFormat =
  | 'BOOK_PRINT'
  | 'EBOOK'
  | 'JOURNAL_PRINT'
  | 'EJOURNAL'
  | 'THESIS_DISSERTATION'
  | 'AUDIOVISUAL_MEDIA'
  | 'ARCHIVAL_MANUSCRIPT'
  | 'MICROFORM'
  | 'CARTOGRAPHIC_MAP'
  | 'RESEARCH_DATASET'
  | 'PATENT_SPECIFICATION'
  | 'STANDARDS_DOCUMENT';

export type LoanStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'ISSUED'
  | 'DUE'
  | 'OVERDUE'
  | 'RETURNED'
  | 'LOST'
  | 'CLOSED'
  | 'CANCELLED';

export type ReservationStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'READY'
  | 'FULFILLED'
  | 'EXPIRED'
  | 'CANCELLED';

export type WaitlistStatus =
  | 'WAITLISTED'
  | 'ELIGIBLE'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type TransferStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'CANCELLED';

export type AcquisitionRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCUREMENT_PENDING'
  | 'RECEIVED'
  | 'CATALOGED'
  | 'CLOSED';

export type ReferenceRequestStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type ReadingRoomReservationStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED';

export type DisposalActionType =
  | 'SALE'
  | 'SCRAP'
  | 'DONATION'
  | 'TRANSFER'
  | 'ARCHIVE'
  | 'WRITE_OFF';

export type DisposalStatus =
  | 'REQUESTED'
  | 'EVALUATION'
  | 'APPROVED'
  | 'EXECUTED'
  | 'REJECTED'
  | 'CANCELLED';

export type PatronCategory =
  | 'UNDERGRADUATE_STUDENT'
  | 'POSTGRADUATE_STUDENT'
  | 'DOCTORAL_RESEARCHER'
  | 'FACULTY_ACADEMIC'
  | 'RESEARCH_FELLOW'
  | 'ADMIN_STAFF'
  | 'VISITING_SCHOLAR'
  | 'ALUMNI_MEMBER'
  | 'EMERITUS_FACULTY'
  | 'INTER_INSTITUTIONAL_PARTNER';

export type DigitalAccessState =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'CONCURRENCY_EXHAUSTED';

export type SimulationScenario =
  | 'MASS_RETURN_SURGE'
  | 'COPY_DEMAND_SURGE'
  | 'RESERVATION_QUEUE_SURGE'
  | 'WAITLIST_CASCADE'
  | 'CAMPUS_TRANSFER_SURGE'
  | 'OVERDUE_SURGE'
  | 'DIGITAL_LICENSE_EXHAUSTION'
  | 'CONCURRENT_ISSUE_CONFLICT'
  | 'BARCODE_COLLISION'
  | 'ACQUISITION_BACKLOG'
  | 'RESOURCE_LOSS_SURGE'
  | 'DAMAGE_SURGE'
  | 'RESEARCH_ACCESS_SURGE'
  | 'READING_ROOM_CAPACITY_SURGE'
  | 'COLLECTION_WITHDRAWAL_SCENARIO';

// ==========================================
// 2. VALUE OBJECTS & IMMUTABLE REFERENCES
// ==========================================

export interface LibraryCurrencyAmount {
  amount: number; // Stored in minor units (e.g. cents, paise)
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'SGD';
}

export interface ResourceIdentifier {
  type: 'ISBN_10' | 'ISBN_13' | 'ISSN' | 'DOI' | 'OCLC' | 'LCCN' | 'URI';
  value: string;
}

export interface ResourceAuthor {
  authorId: string;
  fullName: string;
  orcid?: string;
  affiliation?: string;
  isPrimary: boolean;
}

export interface ResourceContributor {
  contributorId: string;
  fullName: string;
  role: 'EDITOR' | 'TRANSLATOR' | 'ILLUSTRATOR' | 'COMPILER' | 'ADVISOR' | 'PRODUCER';
}

export interface ResourceClassification {
  scheme: 'DDC' | 'LCC' | 'UDC' | 'NLM' | 'CUSTOM_INSTITUTIONAL';
  classificationNumber: string;
  cutterNumber?: string;
}

export interface ResourceSubject {
  subjectId: string;
  heading: string;
  scheme: 'LCSH' | 'MESH' | 'FAST' | 'INSTITUTIONAL_TAXONOMY';
}

export interface ResourceLanguage {
  isoCode: string; // e.g. "en", "hi", "fr", "de", "es"
  languageName: string;
}

export interface ResourceEdition {
  editionNumber: string;
  publicationYear: number;
  publisherName: string;
  placeOfPublication?: string;
  pageCount?: number;
  physicalDescription?: string;
}

export interface ResourceBarcode {
  barcodeValue: string;
  assignedAt: string;
  isActive: boolean;
}

// ==========================================
// 3. MASTER CATALOG & HOLDINGS
// ==========================================

export interface Library {
  libraryId: string;
  tenantId: string;
  campusIdRef: string;
  code: string;
  name: string;
  type: 'CENTRAL_MAIN' | 'DEPARTMENTAL' | 'BRANCH' | 'RESEARCH_COMMONS' | 'DIGITAL_REPOSITORY' | 'ARCHIVE_SPECIAL_COLLECTIONS';
  operatingHours: string;
  totalFloorAreaSqMt?: number;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryBranch {
  branchId: string;
  libraryIdRef: string;
  tenantId: string;
  campusIdRef: string;
  code: string;
  name: string;
  buildingSpaceIdRef: string; // Reference to Phase 11.5 Space
  floor: string;
  wingSection?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LibraryLocation {
  locationId: string;
  branchIdRef: string;
  tenantId: string;
  code: string;
  name: string; // e.g. "Stack 4B - Computing Science", "Reference Bay 2", "Reserve Shelf"
  zoneType: 'STACKS' | 'REFERENCE' | 'PERIODICALS' | 'SPECIAL_COLLECTIONS' | 'RESERVE' | 'AUDIOVISUAL' | 'DIGITAL_TERMINALS';
  capacityCopies: number;
  isActive: boolean;
}

export interface LibraryCollection {
  collectionId: string;
  libraryIdRef: string;
  tenantId: string;
  code: string;
  name: string; // e.g., "General Lending", "Reference Only", "Rare Manuscripts", "Faculty Course Reserves"
  isCirculating: boolean;
  defaultLoanPeriodDays: number;
  requiresSpecialPermission: boolean;
  isActive: boolean;
}

export interface Resource {
  resourceId: string;
  tenantId: string;
  title: string;
  subtitle?: string;
  edition: ResourceEdition;
  authors: ResourceAuthor[];
  contributors: ResourceContributor[];
  identifiers: ResourceIdentifier[];
  language: ResourceLanguage;
  format: ResourceFormat;
  classification: ResourceClassification;
  subjects: ResourceSubject[];
  keywords: string[];
  abstractDescription: string;
  callNumber: string;
  collectionIdRef: string;
  lifecycleState: ResourceLifecycle;
  isDigital: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Holding {
  holdingId: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  branchIdRef: string;
  collectionIdRef: string;
  callNumberPrefix?: string;
  totalCopies: number;
  availableCopies: number;
  onLoanCopies: number;
  reservedCopies: number;
  inRepairCopies: number;
  withdrawnCopies: number;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingLocation {
  holdingLocationId: string;
  holdingIdRef: string;
  locationIdRef: string;
  tenantId: string;
  shelfTag: string;
}

export interface ResourceCopy {
  copyId: string;
  holdingIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  branchIdRef: string;
  locationIdRef: string;
  barcode: ResourceBarcode;
  accessionNumber: string; // Must be unique per tenant
  copyNumber: number;
  acquisitionReferenceId?: string; // Reference to Phase 11.3 Procurement
  purchaseCost?: LibraryCurrencyAmount;
  itemCondition: 'PRISTINE_NEW' | 'GOOD' | 'FAIR' | 'WORN' | 'DAMAGED_REPAIRABLE' | 'SEVERELY_DAMAGED';
  availabilityStatus: ResourceAvailability;
  isCirculating: boolean;
  isReferenceOnly: boolean;
  lastCirculatedAt?: string;
  totalCirculationCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. PATRONS & BORROWING POLICIES
// ==========================================

export interface PatronEligibility {
  isEligible: boolean;
  reason?: string;
  activeLoanCount: number;
  maxLoansAllowed: number;
  hasOverdueLoans: boolean;
  totalOverdueDays: number;
  hasFinancialHold: boolean;
  outstandingFines: LibraryCurrencyAmount;
  disciplinaryHold: boolean;
}

export interface Patron {
  patronId: string;
  tenantId: string;
  campusIdRef: string;
  patronCategory: PatronCategory;
  studentIdRef?: string; // Reference to Phase 10.4 Student Lifecycle
  employeeIdRef?: string; // Reference to Phase 11.1 HR Workforce
  researcherIdRef?: string; // Reference to Phase 11.9 Research
  externalPartnerIdRef?: string;
  institutionalEmail: string;
  barcodeNumber: string;
  membershipStartDate: string;
  membershipExpiryDate: string;
  isActive: boolean;
  borrowingPrivilegeOverrides?: Partial<BorrowingPrivilege>;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowingPrivilege {
  maxSimultaneousLoans: number;
  loanDurationDays: number;
  maxRenewalsAllowed: number;
  maxReservationsAllowed: number;
  gracePeriodDays: number;
  finePerDayPerItem: LibraryCurrencyAmount;
  maxFineAccumulationCap: LibraryCurrencyAmount;
  canAccessDigitalVault: boolean;
  canReserveReadingRoom: boolean;
  canRequestInterCampusTransfer: boolean;
}

export interface BorrowingPolicy {
  policyId: string;
  tenantId: string;
  campusIdRef?: string;
  patronCategory: PatronCategory;
  format: ResourceFormat;
  privilege: BorrowingPrivilege;
  isEffective: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

// ==========================================
// 5. CIRCULATION: LOANS, RETURNS, RENEWALS
// ==========================================

export interface Loan {
  loanId: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  patronIdRef: string;
  copyIdRef: string;
  resourceIdRef: string;
  issuedByUserIdRef: string; // Authorized library staff
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  returnProcessedByUserIdRef?: string;
  renewalCount: number;
  maxRenewalsPermitted: number;
  status: LoanStatus;
  isOverdue: boolean;
  overdueDaysCount: number;
  notes?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanRenewal {
  renewalId: string;
  loanIdRef: string;
  tenantId: string;
  renewalNumber: number;
  renewedAt: string;
  previousDueDate: string;
  newDueDate: string;
  renewedByUserIdRef: string;
  idempotencyKey: string;
}

export interface ReturnTransaction {
  returnId: string;
  loanIdRef: string;
  copyIdRef: string;
  tenantId: string;
  returnedAt: string;
  processedByUserIdRef: string;
  conditionOnReturn: 'PRISTINE_NEW' | 'GOOD' | 'FAIR' | 'WORN' | 'DAMAGED_REPAIRABLE' | 'SEVERELY_DAMAGED';
  wasOverdue: boolean;
  overdueDays: number;
  fineAssessed?: LibraryCurrencyAmount;
  fineRecordIdRef?: string;
  idempotencyKey: string;
}

// ==========================================
// 6. RESERVATIONS & WAITLISTS
// ==========================================

export interface Reservation {
  reservationId: string;
  tenantId: string;
  campusIdRef: string;
  resourceIdRef: string;
  specificCopyIdRef?: string;
  patronIdRef: string;
  status: ReservationStatus;
  queuePosition: number;
  requestedAt: string;
  readyAt?: string;
  expiryDate?: string;
  fulfilledAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  idempotencyKey: string;
}

export interface WaitlistEntry {
  waitlistId: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  patronIdRef: string;
  position: number;
  status: WaitlistStatus;
  joinedAt: string;
  notifiedAt?: string;
  expiresAt?: string;
}

// ==========================================
// 7. OVERDUE, FINES & CHARGES
// ==========================================

export interface OverdueRecord {
  overdueId: string;
  loanIdRef: string;
  patronIdRef: string;
  copyIdRef: string;
  tenantId: string;
  dueDate: string;
  daysOverdue: number;
  calculatedFine: LibraryCurrencyAmount;
  isFineGenerated: boolean;
  noticesSentCount: number;
  lastNoticeSentAt?: string;
  status: 'PENDING' | 'NOTIFIED' | 'CHARGED' | 'WAIVED' | 'RESOLVED';
}

export interface LibraryFineReference {
  fineId: string;
  tenantId: string;
  campusIdRef: string;
  patronIdRef: string;
  loanIdRef?: string;
  copyIdRef?: string;
  reason: 'OVERDUE_LATE_RETURN' | 'ITEM_DAMAGED' | 'ITEM_LOST' | 'REPLACEMENT_FEE' | 'SPECIAL_PROCESSING';
  fineAmount: LibraryCurrencyAmount;
  waivedAmount: LibraryCurrencyAmount;
  paidAmount: LibraryCurrencyAmount;
  outstandingAmount: LibraryCurrencyAmount;
  financeTransactionIdRef?: string; // Reference to Phase 11.2 Finance
  isWaived: boolean;
  waiverJustification?: string;
  waiverApprovedByUserIdRef?: string; // Four-Eyes SoD
  waiverRequestedByUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 8. LOSS, DAMAGE & REPLACEMENT
// ==========================================

export interface DamageReport {
  damageReportId: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  reportedByUserIdRef: string;
  patronIdRef?: string;
  damageType: 'WATER_STAIN' | 'PAGES_TORN' | 'BINDING_BROKEN' | 'HIGHLIGHTING_MARKINGS' | 'MEDIA_CRACKED' | 'OTHER';
  severity: 'MINOR_REPAIRABLE' | 'MODERATE_RESTORABLE' | 'BEYOND_ECONOMIC_REPAIR';
  description: string;
  estimatedRestorationCost: LibraryCurrencyAmount;
  actionTaken: 'SENT_TO_BINDERY' | 'REPAIRED_IN_HOUSE' | 'ASSESSED_FOR_REPLACEMENT' | 'WITHDRAWN';
  reportedAt: string;
  resolvedAt?: string;
}

export interface LossReport {
  lossReportId: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  patronIdRef?: string;
  loanIdRef?: string;
  reportedByUserIdRef: string;
  lossCircumstances: string;
  replacementCost: LibraryCurrencyAmount;
  processingFee: LibraryCurrencyAmount;
  patronBilled: boolean;
  status: 'INVESTIGATING' | 'CONFIRMED_LOST' | 'RECOVERED' | 'PAID_BY_PATRON' | 'WRITTEN_OFF';
  writtenOffByUserIdRef?: string; // Four-Eyes SoD
  writtenOffAt?: string;
  reportedAt: string;
}

export interface ReplacementRequest {
  replacementId: string;
  lossReportIdRef?: string;
  damageReportIdRef?: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  procurementRequestIdRef?: string; // Reference to Phase 11.3
  replacementType: 'EXACT_EDITION' | 'NEWER_EDITION' | 'ACCEPTABLE_SUBSTITUTE' | 'MONETARY_RECOVERY_ONLY';
  approvedByUserIdRef?: string;
  status: 'REQUESTED' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CATALOGED' | 'CANCELLED';
  createdAt: string;
}

// ==========================================
// 9. DIGITAL & ELECTRONIC RESOURCES
// ==========================================

export interface LicenseConstraint {
  concurrentUserLimit: number;
  allowsWalkInUsers: boolean;
  allowsCoursePacks: boolean;
  allowsInterLibraryLoan: boolean;
  requiresProxyAuth: boolean;
  embargoPeriodMonths?: number;
  authorizedDomains: string[];
}

export interface DigitalResource {
  digitalResourceId: string;
  resourceIdRef: string;
  tenantId: string;
  campusScope: string[]; // campus IDs or ['*'] for institutional wide
  accessUrl: string;
  providerName: string;
  subscriptionReferenceId?: string; // Reference to Phase 11.2 / 11.3
  licenseConstraint: LicenseConstraint;
  allowedPatronCategories: PatronCategory[];
  accessState: DigitalAccessState;
  activeSessionsCount: number;
  accessCountLifetime: number;
  validFrom: string;
  validTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalResourceAccess {
  accessSessionId: string;
  digitalResourceIdRef: string;
  patronIdRef: string;
  tenantId: string;
  sessionStartedAt: string;
  sessionEndedAt?: string;
  ipAddressMasked: string;
  bytesDownloaded?: number;
}

export interface ElectronicResource {
  electronicResourceId: string;
  tenantId: string;
  title: string;
  resourceType: 'E_JOURNAL_COLLECTION' | 'ONLINE_DATABASE' | 'E_BOOK_COLLECTION' | 'DISCOVERY_INDEX' | 'STREAMING_VIDEO';
  provider: string;
  vendorContactEmail: string;
  accessUrl: string;
  authenticationMethod: 'IP_RANGE' | 'SAML_SSO' | 'OPEN_ATHENS' | 'EZPROXY';
  licenseStart: string;
  licenseEnd: string;
  annualSubscriptionFee?: LibraryCurrencyAmount;
  renewalAlertDays: number;
  status: 'ACTIVE' | 'UPCOMING_RENEWAL' | 'UNDER_EVALUATION' | 'EXPIRED' | 'CANCELLED';
}

export interface ElectronicSubscriptionReference {
  subscriptionRefId: string;
  electronicResourceIdRef: string;
  tenantId: string;
  procurementContractRefId: string; // Phase 11.3
  financeBudgetAllocationRefId: string; // Phase 11.2
  renewalTermMonths: number;
  paymentCycle: 'ANNUAL' | 'MULTI_YEAR' | 'PERPETUAL_WITH_MAINTENANCE';
}

export interface AccessEntitlement {
  entitlementId: string;
  patronIdRef: string;
  digitalResourceIdRef: string;
  tenantId: string;
  grantedByUserIdRef: string;
  validFrom: string;
  validTo: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

// ==========================================
// 10. RESEARCH RESOURCES & REFERENCE SERVICES
// ==========================================

export interface ResearchResourceRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  researchProjectIdRef: string; // Phase 11.9 Reference
  researcherPatronIdRef: string;
  resourceTitleOrDescription: string;
  resourceType: 'SPECIAL_ARCHIVE' | 'PROPRIETARY_DATASET' | 'INTER_LIBRARY_DOCUMENT' | 'HIGH_VALUE_MONOGRAPH';
  justification: string;
  isRestrictedResource: boolean;
  restrictedResourceApprovedByUserIdRef?: string; // Four-Eyes SoD
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'FULFILLED' | 'REJECTED';
  requestedAt: string;
  fulfilledAt?: string;
}

export interface ReferenceDeskSession {
  sessionId: string;
  tenantId: string;
  campusIdRef: string;
  librarianUserIdRef: string;
  patronIdRef?: string;
  inquiryCategory: 'LITERATURE_SEARCH' | 'CITATION_MANAGEMENT' | 'DATASET_DISCOVERY' | 'SYSTEMATIC_REVIEW' | 'COPYRIGHT_ETHICS' | 'GENERAL_REFERENCE';
  sessionFormat: 'IN_PERSON' | 'VIRTUAL_CHAT' | 'EMAIL' | 'PHONE';
  durationMinutes: number;
  summaryNotes: string;
  resourcesRecommendedCount: number;
  sessionTimestamp: string;
}

export interface ReferenceServiceRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  patronIdRef: string;
  title: string;
  inquiryDetail: string;
  category: 'LITERATURE_SEARCH' | 'CITATION_MANAGEMENT' | 'DATASET_DISCOVERY' | 'SYSTEMATIC_REVIEW' | 'COPYRIGHT_ETHICS' | 'GENERAL_REFERENCE';
  assignedLibrarianUserIdRef?: string;
  status: ReferenceRequestStatus;
  slaTargetHours: number;
  submittedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface LibraryServiceRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  patronIdRef: string;
  serviceType: 'SCAN_ON_DEMAND' | 'INTER_LIBRARY_LOAN' | 'COURSE_RESERVE_CREATION' | 'BULK_CIRCULATION_EVENT' | 'RESEARCH_ASSISTANCE';
  resourceDetails: string;
  urgency: 'STANDARD' | 'HIGH' | 'CRITICAL_ACADEMIC_DEADLINE';
  status: 'SUBMITTED' | 'ASSIGNED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  completedAt?: string;
}

// ==========================================
// 11. READING ROOM & SEAT RESERVATION
// ==========================================

export interface ReadingRoomReservation {
  reservationId: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  buildingSpaceIdRef: string; // Reference to Phase 11.5 Room/Space
  seatDeskNumber: string;
  patronIdRef: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  status: ReadingRoomReservationStatus;
  purpose: 'QUIET_STUDY' | 'GROUP_COLLABORATION' | 'RESEARCH_CONSULTATION' | 'MICROFORM_VIEWING';
  bookedAt: string;
  checkedInAt?: string;
}

// ==========================================
// 12. INTER-CAMPUS TRANSFERS & ACQUISITIONS
// ==========================================

export interface TransferLine {
  copyIdRef: string;
  resourceIdRef: string;
  accessionNumber: string;
  conditionBeforeTransfer: string;
  conditionOnArrival?: string;
  verifiedReceived: boolean;
}

export interface ResourceTransfer {
  transferId: string;
  tenantId: string;
  sourceCampusIdRef: string;
  sourceLibraryIdRef: string;
  destinationCampusIdRef: string;
  destinationLibraryIdRef: string;
  initiatedByUserIdRef: string;
  approvedByUserIdRef?: string; // Four-Eyes SoD if exceptional
  items: TransferLine[];
  transferReason: 'PATRON_HOLD_FULFILLMENT' | 'PERMANENT_REBALANCE' | 'BINDERY_PRESERVATION' | 'EXHIBITION_LOAN';
  status: TransferStatus;
  dispatchedAt?: string;
  receivedAt?: string;
  receivingVerifiedByUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcquisitionRequest {
  acquisitionRequestId: string;
  tenantId: string;
  campusIdRef: string;
  requestedByUserIdRef: string;
  requestorRole: 'FACULTY' | 'RESEARCH_PI' | 'STUDENT' | 'LIBRARIAN' | 'DEPT_CHAIR';
  departmentIdRef?: string; // Phase 10.1
  academicProgramIdRef?: string; // Phase 10.2
  courseIdRef?: string; // Phase 10.2
  researchProjectIdRef?: string; // Phase 11.9
  title: string;
  authors: string[];
  editionOrYear?: string;
  formatRequested: ResourceFormat;
  identifiers: ResourceIdentifier[];
  estimatedCost: LibraryCurrencyAmount;
  justification: string;
  urgency: 'ROUTINE' | 'NEXT_SEMESTER_SYLLABUS' | 'URGENT_RESEARCH_GRANT';
  status: AcquisitionRequestStatus;
  approvedByUserIdRef?: string; // Four-Eyes SoD (cannot equal requestedByUserIdRef)
  procurementRequisitionIdRef?: string; // Phase 11.3
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 13. COLLECTION REVIEWS, PRESERVATION & DISPOSAL
// ==========================================

export interface CollectionReview {
  reviewId: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  collectionIdRef: string;
  conductedByUserIdRef: string;
  reviewDate: string;
  itemsAuditedCount: number;
  missingItemsCount: number;
  damagedItemsCount: number;
  recommendedWeedingCount: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'REPORT_GENERATED';
  findingsSummary: string;
}

export interface CollectionMaintenanceAction {
  actionId: string;
  tenantId: string;
  reviewIdRef?: string;
  copyIdRef: string;
  actionType: 'CLEANING' | 'RE_LABELING' | 'MINOR_MENDING' | 'BINDERY_SHIPMENT' | 'DESHELVE_FOR_REVIEW';
  performedByUserIdRef: string;
  timestamp: string;
  notes: string;
}

export interface PreservationRecord {
  preservationId: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  treatmentType: 'DEACIDIFICATION' | 'REBINDING' | 'DIGITIZATION_SURROGATE' | 'CLIMATE_CONTROLLED_VAULT' | 'ENCAPSULATION';
  conservatorName: string;
  cost: LibraryCurrencyAmount;
  commencedAt: string;
  completedAt?: string;
  status: 'SCHEDULED' | 'IN_TREATMENT' | 'COMPLETED' | 'PERMANENT_RESTRICTION';
}

export interface ArchiveRecord {
  archiveRecordId: string;
  resourceIdRef: string;
  copyIdRef?: string;
  tenantId: string;
  archiveClassification: 'INSTITUTIONAL_HERITAGE' | 'RARE_BOOK' | 'SPECIAL_COLLECTION_MANUSCRIPT' | 'FACULTY_PAPERS';
  preservationBoxNumber: string;
  vaultLocationCode: string;
  climateRequirements: string;
  accessRestrictionPolicy: 'RESTRICTED_BY_APPOINTMENT' | 'DIGITAL_FACSIMILE_ONLY' | 'CURATOR_APPROVAL_MANDATORY';
  archivedAt: string;
}

export interface ResourceDisposalRequest {
  disposalId: string;
  tenantId: string;
  campusIdRef: string;
  copyIdRef: string;
  resourceIdRef: string;
  accessionNumber: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string; // Four-Eyes SoD (cannot equal requestedByUserIdRef)
  disposalAction: DisposalActionType;
  justification: 'OBSOLETE_CONTENT' | 'BEYOND_REPAIR' | 'EXCESS_DUPLICATION' | 'SUPERSEDED_EDITION';
  disposalStatus: DisposalStatus;
  financialWriteOffRefId?: string; // Phase 11.2
  executedAt?: string;
  createdAt: string;
}

// ==========================================
// 14. POLICIES, EXCEPTIONS & GOVERNANCE
// ==========================================

export interface LibraryPolicy {
  policyId: string;
  tenantId: string;
  policyCode: string;
  policyName: string;
  category: 'CIRCULATION' | 'DIGITAL_ACCESS' | 'ACQUISITIONS' | 'COLLECTION_WEEDING' | 'SPECIAL_COLLECTIONS' | 'FINES_WAIVERS';
  rulesJson: string;
  version: number;
  isActive: boolean;
  effectiveDate: string;
}

export interface LibraryException {
  exceptionId: string;
  tenantId: string;
  campusIdRef: string;
  exceptionType: 'BORROWING_LIMIT_OVERRIDE' | 'OVERDUE_RESTRICTION_OVERRIDE' | 'FINE_WAIVER' | 'RESTRICTED_ACCESS_PERMIT' | 'DISPOSAL_OVERRIDE';
  requestedByUserIdRef: string;
  approvedByUserIdRef: string; // Four-Eyes SoD
  patronIdRef?: string;
  resourceIdRef?: string;
  justification: string;
  grantedAt: string;
  expiresAt?: string;
}

// ==========================================
// 15. AUDIT, DIAGNOSTICS & SIMULATION
// ==========================================

export interface LibraryAuditEvent {
  auditEventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  previousStateHash: string;
  currentStateHash: string;
  previousEventHash: string;
  currentAuditHash: string;
  timestamp: string;
  correlationId: string;
  idempotencyKey?: string;
  reason?: string;
}

export interface LibraryDiagnosticFinding {
  findingId: string;
  severity: 'PASS' | 'WARNING' | 'ERROR' | 'INSUFFICIENT_DATA';
  checkName: string;
  category: 'IDENTITY_INTEGRITY' | 'STATE_CONSISTENCY' | 'FOUR_EYES_SOD' | 'ARITHMETIC_RECONCILIATION' | 'AUDIT_PROVENANCE';
  message: string;
  affectedEntityId?: string;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  executionTimestamp: string;
  zeroProductionMutationVerified: boolean;
  isSyntheticSandbox: true;
  baselineSnapshot: {
    totalHoldings: number;
    totalCopies: number;
    activeLoans: number;
    activeReservations: number;
    totalFinesAssessedMinorUnits: number;
  };
  simulatedOutcomes: {
    projectedTurnoverIncreasePercent?: number;
    projectedOverdueIncreasePercent?: number;
    projectedLicenseExhaustionCount?: number;
    detectedCollisionsCount?: number;
    processedQueueItems?: number;
    rebalancedCopiesCount?: number;
  };
  recommendations: string[];
}
