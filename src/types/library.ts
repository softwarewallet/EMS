// EMS Phase 7.15A - Library & Learning Resource Foundation Types

export type LibraryStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type LibraryType = 'MAIN' | 'BRANCH' | 'DEPARTMENTAL' | 'DIGITAL' | 'REFERENCE';

export type ResourceType = 
  | 'BOOK'
  | 'TEXTBOOK'
  | 'REFERENCE_BOOK'
  | 'WORKBOOK'
  | 'JOURNAL'
  | 'MAGAZINE'
  | 'NEWSPAPER'
  | 'EBOOK'
  | 'DIGITAL_DOCUMENT'
  | 'VIDEO'
  | 'AUDIO'
  | 'RESEARCH_PAPER'
  | 'TEACHING_MATERIAL'
  | 'LEARNING_MATERIAL'
  | 'OTHER';

export type ResourceStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type CopyStatus = 
  | 'AVAILABLE'
  | 'ISSUED'
  | 'RESERVED'
  | 'LOST'
  | 'DAMAGED'
  | 'UNDER_REPAIR'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type CopyCondition = 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';

export type LocationType = 
  | 'MAIN_LIBRARY'
  | 'REFERENCE_SECTION'
  | 'TEXTBOOK_SECTION'
  | 'CHILDREN_SECTION'
  | 'DIGITAL_SECTION'
  | 'LABRARY_ROOM'
  | 'STORAGE'
  | 'ARCHIVE'
  | 'OTHER';

export type MembershipType = 'STUDENT' | 'TEACHER' | 'STAFF' | 'ADMINISTRATOR' | 'OTHER';
export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED' | 'ARCHIVED';
export type MembershipEligibility = 'ELIGIBLE' | 'INELIGIBLE' | 'UNDER_REVIEW';

export type AcquisitionStatus = 'REQUESTED' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export type IdentifierType = 'ISBN10' | 'ISBN13' | 'ISSN' | 'DOI' | 'OCLC' | 'CUSTOM' | 'ACCESSION' | 'BARCODE' | 'QR';

export interface LibraryProfile {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  code: string;
  description?: string;
  status: LibraryStatus;
  libraryType: LibraryType;
  openingHours?: string;
  workingDays?: string[];
  contactInformation?: {
    email?: string;
    phone?: string;
    librarianName?: string;
  };
  locationReference?: string;
  policyVersion: string;
  currentVersion: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourceAuthor {
  id: string;
  tenantId: string;
  name: string;
  displayName: string;
  organization?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourcePublisher {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  contact?: string;
  websiteReference?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourceCategory {
  id: string;
  tenantId: string;
  libraryId?: string;
  name: string;
  code: string;
  parentCategoryId?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourceLocation {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  name: string;
  code: string;
  type: LocationType;
  capacity?: number;
  status: 'ACTIVE' | 'INACTIVE';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResource {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  title: string;
  subtitle?: string;
  description?: string;
  language: string;
  edition?: string;
  volume?: string;
  series?: string;
  publicationYear?: number;
  publisherId?: string;
  publisherName?: string;
  authors: string[]; // Author names or IDs
  resourceType: ResourceType;
  categoryId?: string;
  categoryName?: string;
  subjectIds: string[]; // References authoritative Subject IDs
  curriculumIds: string[]; // References authoritative Curriculum IDs
  isbn?: string;
  issn?: string;
  doi?: string;
  externalIdentifiers?: Record<string, string>;
  keywords?: string[];
  tags?: string[];
  pageCount?: number;
  durationMinutes?: number;
  fileFormat?: string;
  coverImageReference?: string;
  digitalResourceReference?: string; // Document Registry artifact reference
  status: ResourceStatus;
  version: number;
  totalCopies: number;
  availableCopies: number;
  idempotencyKey?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourceVersion {
  id: string;
  resourceId: string;
  tenantId: string;
  version: number;
  metadataSnapshot: Partial<LibraryResource>;
  changeReason: string;
  policyContext?: string;
  changedBy: string;
  changedAt: string;
}

export interface LibraryResourceCopy {
  id: string;
  resourceId: string;
  libraryId: string;
  tenantId: string;
  campusId: string;
  accessionNumber: string; // Unique deterministic identifier
  barcode: string;
  qrCode: string;
  copyStatus: CopyStatus;
  condition: CopyCondition;
  locationId?: string;
  locationName?: string;
  acquisitionId?: string;
  purchaseDate?: string;
  cost?: number;
  fundingSource?: string;
  notes?: string;
  version: number;
  idempotencyKey?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResourceIdentifier {
  id: string;
  tenantId: string;
  resourceId?: string;
  copyId?: string;
  type: IdentifierType;
  normalizedValue: string;
  rawValue: string;
  createdAt: string;
}

export interface LibraryResourceSubjectMapping {
  id: string;
  tenantId: string;
  resourceId: string;
  subjectId: string; // Authoritative Subject ID
  mappedBy: string;
  createdAt: string;
}

export interface LibraryResourceCurriculumMapping {
  id: string;
  tenantId: string;
  resourceId: string;
  curriculumId: string;
  unitId?: string;
  chapterId?: string;
  topicId?: string;
  learningOutcomeId?: string;
  mappedBy: string;
  createdAt: string;
}

export interface LibraryMembership {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  userId: string; // Authoritative User ID
  studentId?: string; // Authoritative Student ID if student
  staffId?: string; // Authoritative Staff/Teacher ID if staff
  membershipNumber: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate?: string;
  policyVersion: string;
  eligibilityStatus: MembershipEligibility;
  notes?: string;
  idempotencyKey?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryAcquisition {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  resourceId?: string;
  supplier: string;
  purchaseReference: string;
  purchaseDate: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  currency: string;
  fundingSource?: string;
  approvalReference?: string;
  invoiceReference?: string;
  status: AcquisitionStatus;
  notes?: string;
  idempotencyKey?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  totalResources: number;
  totalPhysicalCopies: number;
  totalDigitalResources: number;
  activeMemberships: number;
  resourcesByType: Record<string, number>;
  resourcesByCategory: Record<string, number>;
  resourcesBySubject: Record<string, number>;
  resourcesByCampus: Record<string, number>;
  copiesByStatus: Record<string, number>;
  resourceConditionDistribution: Record<string, number>;
  acquisitionCounts: number;
  catalogueGrowth: number;
  lastRebuiltAt: string;
}

// ============================================================================
// PHASE 7.15B - LIBRARY CIRCULATION DATA MODELS
// ============================================================================

export type LoanStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'ISSUED' 
  | 'OVERDUE' 
  | 'RETURN_REQUESTED' 
  | 'RETURNED' 
  | 'LOST' 
  | 'CANCELLED';

export type ReturnOutcome = 
  | 'NORMAL' 
  | 'OVERDUE' 
  | 'DAMAGED' 
  | 'LOST' 
  | 'PARTIAL_DAMAGE' 
  | 'REFERRED_FOR_REVIEW';

export type ReservationStatus = 
  | 'REQUESTED' 
  | 'QUEUED' 
  | 'READY' 
  | 'FULFILLED' 
  | 'EXPIRED' 
  | 'CANCELLED' 
  | 'REJECTED';

export type FineStatus = 
  | 'CALCULATED' 
  | 'PENDING' 
  | 'ADJUSTMENT_REQUESTED' 
  | 'ADJUSTED' 
  | 'WAIVED' 
  | 'REFERRED_TO_FINANCE' 
  | 'SETTLED' 
  | 'REVERSED';

export type FineType = 
  | 'OVERDUE' 
  | 'LOST_ITEM' 
  | 'DAMAGE' 
  | 'REPLACEMENT' 
  | 'ADMINISTRATIVE';

export type LostItemStatus = 
  | 'REPORTED' 
  | 'UNDER_REVIEW' 
  | 'CONFIRMED' 
  | 'REPLACEMENT_PENDING' 
  | 'CHARGED' 
  | 'RECOVERED' 
  | 'CLOSED';

export type DamageSeverity = 'MINOR' | 'MODERATE' | 'MAJOR' | 'UNUSABLE';

export type DamageReportStatus = 
  | 'REPORTED' 
  | 'ASSESSED' 
  | 'RESOLVED' 
  | 'CHARGED' 
  | 'REPAIRED' 
  | 'DISCARDED';

export type PolicyLifecycleStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'SUPERSEDED' 
  | 'ARCHIVED';

export interface LibraryCirculationPolicy {
  id: string;
  tenantId: string;
  campusId?: string;
  libraryId?: string;
  name: string;
  description?: string;
  memberType: MembershipType;
  resourceType: ResourceType;
  maxActiveLoans: number;
  maxRenewalCount: number;
  standardLoanDurationDays: number;
  gracePeriodDays: number;
  fineRatePerDay: number; // In local currency
  maxFineAmount: number;
  reservationDurationDays: number;
  overdueBlockThresholdDays: number;
  lostItemReplacementFeeMultiplier: number;
  damageFeeSchedule?: Record<string, number>;
  borrowingEligibility: MembershipEligibility;
  blockingConditions?: string[];
  status: PolicyLifecycleStatus;
  version: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCirculationPolicyVersion {
  id: string;
  policyId: string;
  tenantId: string;
  version: number;
  policySnapshot: Partial<LibraryCirculationPolicy>;
  activatedAt: string;
  activatedBy: string;
  changeReason?: string;
}

export interface LibraryLoan {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  membershipId: string;
  memberId: string; // Authoritative user/student ID
  memberName?: string;
  memberType: MembershipType;
  membershipNumber?: string;
  enrollmentId?: string; // Authoritative reference to StudentEnrollment
  copyId: string;
  accessionNumber: string;
  barcode: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: ResourceType;
  policyVersionId: string;
  issuedAt: string;
  dueAt: string;
  returnedAt?: string;
  status: LoanStatus;
  transactionReference: string;
  idempotencyKey?: string;
  issuedBy: string;
  issuedByName?: string;
  receivedBy?: string;
  receivedByName?: string;
  renewalCount: number;
  maxRenewalsAllowed: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryLoanItem {
  id: string;
  loanId: string;
  tenantId: string;
  copyId: string;
  resourceId: string;
  itemNotes?: string;
  createdAt: string;
}

export interface LibraryReturn {
  id: string;
  loanId: string;
  copyId: string;
  resourceId: string;
  membershipId: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  returnedAt: string;
  receivedBy: string;
  receivedByName?: string;
  overdueDays: number;
  fineAmountCalculated: number;
  conditionOnReturn: CopyCondition;
  returnOutcome: ReturnOutcome;
  damageReportId?: string;
  lostReportId?: string;
  fineId?: string;
  notes?: string;
  createdAt: string;
}

export interface LibraryRenewal {
  id: string;
  loanId: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  previousDueAt: string;
  newDueAt: string;
  renewalNumber: number;
  policyVersionId: string;
  renewedBy: string;
  renewedByName?: string;
  reason?: string;
  timestamp: string;
}

export interface LibraryReservation {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  resourceId: string;
  resourceTitle: string;
  copyId?: string;
  membershipId: string;
  memberId: string;
  memberName?: string;
  requestedAt: string;
  priorityScore: number;
  queuePosition: number;
  status: ReservationStatus;
  holdExpiresAt?: string;
  fulfilledAt?: string;
  fulfilledCopyId?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  notifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryHold {
  id: string;
  reservationId: string;
  copyId: string;
  resourceId: string;
  membershipId: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  holdStart: string;
  holdExpiresAt: string;
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED' | 'RELEASED';
  createdAt: string;
  updatedAt: string;
}

export interface LibraryFine {
  id: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  loanId?: string;
  membershipId: string;
  memberId: string;
  memberName?: string;
  membershipNumber?: string;
  fineType: FineType;
  originalAmount: number;
  currentAmount: number;
  amountWaived: number;
  currency: string;
  status: FineStatus;
  financeAccountId?: string;
  financeChargeId?: string;
  financeInvoiceId?: string;
  financePaymentId?: string;
  policyVersionId?: string;
  calculatedAt: string;
  createdBy: string;
  createdByName?: string;
  reason?: string;
  notes?: string;
  settledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryFineAdjustment {
  id: string;
  fineId: string;
  tenantId: string;
  originalAmount: number;
  adjustedAmount: number;
  amountWaived: number;
  reason: string;
  requestedBy: string;
  requestedByName?: string;
  authorizedBy?: string;
  authorizedByName?: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  policyContext?: string;
  timestamp: string;
}

export interface LibraryLostItem {
  id: string;
  copyId: string;
  resourceId: string;
  resourceTitle: string;
  accessionNumber: string;
  barcode: string;
  loanId?: string;
  membershipId: string;
  memberId: string;
  memberName?: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  reportedAt: string;
  reportedBy: string;
  reportedByName?: string;
  status: LostItemStatus;
  replacementCost: number;
  currency: string;
  financeChargeId?: string;
  recoveredAt?: string;
  recoveredBy?: string;
  recoveryTransactionRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryDamageReport {
  id: string;
  copyId: string;
  resourceId: string;
  resourceTitle: string;
  accessionNumber: string;
  barcode: string;
  loanId?: string;
  membershipId: string;
  memberId: string;
  memberName?: string;
  tenantId: string;
  campusId: string;
  libraryId: string;
  damageType: string;
  severity: DamageSeverity;
  description: string;
  evidenceRef?: string;
  reportedBy: string;
  reportedByName?: string;
  assessedBy?: string;
  assessedByName?: string;
  estimatedCharge: number;
  currency: string;
  resolution?: string;
  financeChargeId?: string;
  status: DamageReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCirculationAnalyticsCache {
  id: string;
  tenantId: string;
  campusId?: string;
  activeLoansCount: number;
  overdueLoansCount: number;
  totalReturnsCount: number;
  totalRenewalsCount: number;
  activeReservationsCount: number;
  activeHoldsCount: number;
  totalFinesGenerated: number;
  totalFinesCollectedOrReferred: number;
  totalFinesWaived: number;
  lostItemsCount: number;
  damagedItemsCount: number;
  averageLoanDurationDays: number;
  copyUtilizationRate: number; // percentage
  mostBorrowedResources: { resourceId: string; title: string; borrowCount: number }[];
  loansByMemberType: Record<string, number>;
  loansByResourceType: Record<string, number>;
  lastRebuiltAt: string;
}

