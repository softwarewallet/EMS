/**
 * EMS PHASE 11.8: Institutional Library, Learning Resources, Knowledge Assets & Resource Circulation Types
 * Authoritative type definitions for library branches, physical/digital learning resources,
 * resource copies, circulation policies, loans, renewals, reservations, overdue management,
 * fine assessments, waivers (Four-Eyes SoD), damage/loss reports, inter-library transfers,
 * acquisition requests, digital entitlements, diagnostics, cryptographic audit, and what-if simulation.
 */

// ==========================================
// 1. LIFECYCLE ENUMS & STATUSES
// ==========================================

export type ResourceLifecycleState =
  | 'DRAFT'
  | 'CATALOGUED'
  | 'AVAILABLE'
  | 'ON_LOAN'
  | 'RESERVED'
  | 'IN_TRANSIT'
  | 'UNDER_REPAIR'
  | 'DAMAGED'
  | 'LOST'
  | 'WITHDRAWN'
  | 'ARCHIVED';

export type ResourceCopyCondition =
  | 'NEW'
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR'
  | 'POOR'
  | 'DAMAGED'
  | 'UNUSABLE';

export type ResourceCopyStatus =
  | 'AVAILABLE'
  | 'ON_LOAN'
  | 'RESERVED'
  | 'IN_TRANSIT'
  | 'UNDER_REPAIR'
  | 'DAMAGED'
  | 'LOST'
  | 'WITHDRAWN'
  | 'DISPOSED';

export type LibraryLoanStatus =
  | 'ACTIVE'
  | 'RENEWED'
  | 'RETURNED'
  | 'OVERDUE'
  | 'LOST_CLAIMED'
  | 'CLOSED'
  | 'CANCELLED';

export type LibraryReservationStatus =
  | 'REQUESTED'
  | 'QUEUED'
  | 'AVAILABLE_FOR_PICKUP'
  | 'FULFILLED'
  | 'EXPIRED'
  | 'CANCELLED';

export type LibraryFineStatus =
  | 'ASSESSED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'WAIVER_REQUESTED'
  | 'WAIVED'
  | 'ADJUSTED'
  | 'WRITTEN_OFF';

export type ResourceTransferStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'REJECTED';

export type AcquisitionRequestStatus =
  | 'REQUESTED'
  | 'PROPOSED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ORDERED'
  | 'RECEIVED'
  | 'CATALOGUED'
  | 'REJECTED'
  | 'CANCELLED';

export type DigitalAccessStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REVOKED'
  | 'SUSPENDED';

export type ResourceFormat =
  | 'PHYSICAL_BOOK'
  | 'EBOOK'
  | 'JOURNAL_PRINT'
  | 'EJOURNAL'
  | 'AUDIOBOOK'
  | 'VIDEO_MEDIA'
  | 'THESIS_DISSERTATION'
  | 'CONFERENCE_PROCEEDING'
  | 'PATENT'
  | 'STANDARD'
  | 'DATASET'
  | 'MICROFORM'
  | 'MAP_CARTOGRAPHIC'
  | 'EQUIPMENT_KIT';

export type ResourceAccessClassification =
  | 'GENERAL_CIRCULATION'
  | 'REFERENCE_ONLY'
  | 'RESTRICTED_RESERVE'
  | 'SPECIAL_COLLECTIONS'
  | 'RARE_MANUSCRIPT'
  | 'FACULTY_ONLY'
  | 'EMBARGOED'
  | 'DIGITAL_RESTRICTED';

export type MemberCategory =
  | 'STUDENT_UG'
  | 'STUDENT_PG'
  | 'RESEARCH_SCHOLAR'
  | 'FACULTY'
  | 'STAFF'
  | 'ALUMNI'
  | 'VISITING_SCHOLAR'
  | 'EXTERNAL_MEMBER';

// ==========================================
// 2. MONETARY VALUE CONTRACT (Phase 11.2 Aligned)
// ==========================================

export interface LibraryCurrencyAmount {
  amount: number;
  currency: string;
}

// ==========================================
// 3. CORE DOMAIN ENTITIES
// ==========================================

/**
 * Authoritative Library Definition (Campus Level)
 */
export interface Library {
  libraryId: string;
  libraryCode: string;
  name: string;
  description: string;
  tenantId: string;
  campusIdRef: string; // Ref: Phase 10.1 Campus
  buildingIdRef: string; // Ref: Phase 11.5 Building
  spaceIdRef?: string; // Ref: Phase 11.5 Space/Room
  status: 'ACTIVE' | 'TEMPORARILY_CLOSED' | 'MAINTENANCE' | 'DECOMMISSIONED';
  totalAreaSqM?: number;
  seatingCapacity: number;
  contactEmail: string;
  operatingHours: {
    weekdayOpen: string;
    weekdayClose: string;
    weekendOpen?: string;
    weekendClose?: string;
  };
  librarianInChargeUserIdRef: string; // Ref: Phase 11.1 Employee
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Branch or Special Section within a Library
 */
export interface LibraryBranch {
  branchId: string;
  branchCode: string;
  libraryIdRef: string;
  name: string;
  tenantId: string;
  campusIdRef: string;
  departmentIdRef?: string; // Ref: Phase 10.1 OrgUnit
  spaceIdRef?: string; // Ref: Phase 11.5 Room/Space
  floorNumber: string;
  status: 'ACTIVE' | 'CLOSED';
  curatorUserIdRef?: string; // Ref: Phase 11.1 Employee
  createdAt: string;
  updatedAt: string;
}

/**
 * Resource Category & Classification Schema
 */
export interface ResourceCategory {
  categoryId: string;
  categoryCode: string;
  name: string;
  deweyDecimalPrefix?: string;
  locClassificationPrefix?: string;
  tenantId: string;
  description: string;
  parentCategoryIdRef?: string;
  isActive: boolean;
}

/**
 * Learning Resource Master Record (Title / Work level)
 */
export interface LearningResource {
  resourceId: string;
  isbn?: string;
  issn?: string;
  doi?: string;
  callNumber: string;
  title: string;
  subtitle?: string;
  authors: string[];
  editors?: string[];
  publisher: string;
  publicationYear: number;
  edition?: string;
  language: string;
  format: ResourceFormat;
  categoryIdRef: string;
  accessClassification: ResourceAccessClassification;
  keywords: string[];
  abstractSummary?: string;
  standardReplacementCost: LibraryCurrencyAmount;
  tenantId: string;
  permittedCampusScope: string[]; // Strict Campus Scoping
  status: ResourceLifecycleState;
  isDigital: boolean;
  totalCopiesCount: number;
  availableCopiesCount: number;
  borrowedCopiesCount: number;
  reservedCopiesCount: number;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Physical Resource Copy (Item / Barcode level)
 */
export interface ResourceCopy {
  copyId: string;
  resourceIdRef: string;
  barcode: string;
  rfidTag?: string;
  accessionNumber: string;
  copyNumber: number;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  branchIdRef?: string;
  shelfLocation: string; // e.g. "Rack-B-Shelf-04"
  condition: ResourceCopyCondition;
  status: ResourceCopyStatus;
  acquisitionDate: string;
  purchaseCost: LibraryCurrencyAmount;
  purchaseOrderIdRef?: string; // Ref: Phase 11.3 PO
  supplierIdRef?: string; // Ref: Phase 11.3 Supplier
  inventoryAssetIdRef?: string; // Ref: Phase 11.7 Asset/Inventory item
  isRestricted: boolean;
  lastCirculationDate?: string;
  totalCirculationCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Digital Resource Asset Registration
 */
export interface DigitalResource {
  digitalResourceId: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  fileFormat: 'PDF' | 'EPUB' | 'MP3' | 'MP4' | 'HTML' | 'ZIP';
  fileSizeMb: number;
  uriOrStorageRef: string;
  drmProtected: boolean;
  maxConcurrentUsers?: number;
  currentActiveStreams: number;
  licenseType: 'OPEN_ACCESS' | 'INSTITUTIONAL_SUBSCRIPTION' | 'PERPETUAL' | 'RESTRICTED_EMBARGO';
  subscriptionExpiryDate?: string;
  watermarkingRequired: boolean;
  isRestrictedFacultyOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reference to Library Member (Student or Employee - strictly reference-only)
 */
export interface LibraryMemberReference {
  memberId: string;
  memberType: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string; // Ref: Phase 10.4 Student
  employeeIdRef?: string; // Ref: Phase 11.1 Employee
  tenantId: string;
  campusIdRef: string;
  memberCategory: MemberCategory;
  membershipStatus: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED' | 'EXPIRED';
  activeLoansCount: number;
  maxLoanLimit: number;
  outstandingFinesTotal: LibraryCurrencyAmount;
  isBlockedForOverdue: boolean;
  joinedDate: string;
  expiryDate: string;
}

/**
 * Circulation Policy Definition
 */
export interface CirculationPolicy {
  policyId: string;
  policyCode: string;
  name: string;
  tenantId: string;
  campusIdRef: string;
  memberCategory: MemberCategory;
  resourceFormat: ResourceFormat;
  accessClassification: ResourceAccessClassification;
  maxLoansAllowed: number;
  loanPeriodDays: number;
  maxRenewalsAllowed: number;
  renewalPeriodDays: number;
  gracePeriodDays: number;
  finePerDay: LibraryCurrencyAmount;
  maxFineLimit: LibraryCurrencyAmount;
  allowHoldIfAvailable: boolean;
  maxActiveReservations: number;
  isActive: boolean;
}

/**
 * Active or Historical Resource Loan
 */
export interface LibraryLoan {
  loanId: string;
  loanNumber: string;
  tenantId: string;
  campusIdRef: string;
  libraryIdRef: string;
  resourceIdRef: string;
  copyIdRef: string;
  memberType: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string;
  employeeIdRef?: string;
  memberCategory: MemberCategory;
  checkoutDate: string;
  dueDate: string;
  returnedDate?: string;
  renewalCount: number;
  maxRenewals: number;
  issuedByUserIdRef: string; // Ref: Phase 11.1 Employee
  returnedToUserIdRef?: string;
  status: LibraryLoanStatus;
  returnCondition?: ResourceCopyCondition;
  fineAssessedAmount?: LibraryCurrencyAmount;
  fineStatus?: LibraryFineStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Loan Renewal Record
 */
export interface LibraryLoanRenewal {
  renewalId: string;
  loanIdRef: string;
  tenantId: string;
  previousDueDate: string;
  newDueDate: string;
  renewalDate: string;
  renewedByUserIdRef: string;
  policyIdRef: string;
  idempotencyKey: string;
}

/**
 * Resource Reservation / Hold Queue
 */
export interface LibraryReservation {
  reservationId: string;
  reservationNumber: string;
  tenantId: string;
  campusIdRef: string;
  resourceIdRef: string;
  copyIdRef?: string;
  memberType: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string;
  employeeIdRef?: string;
  memberCategory: MemberCategory;
  requestedDate: string;
  queuePosition: number;
  pickupDeadlineDate?: string;
  fulfilledDate?: string;
  status: LibraryReservationStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Fine Assessment Record
 */
export interface LibraryFineAssessment {
  fineId: string;
  fineNumber: string;
  tenantId: string;
  campusIdRef: string;
  loanIdRef?: string;
  resourceIdRef?: string;
  copyIdRef?: string;
  memberType: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string;
  employeeIdRef?: string;
  financialAccountIdRef?: string; // Ref: Phase 11.2 Student financial account
  invoiceIdRef?: string; // Ref: Phase 11.2 Billing invoice
  reason: 'OVERDUE' | 'DAMAGE' | 'LOSS_REPLACEMENT' | 'PROCESSING_FEE';
  daysOverdue?: number;
  assessedAmount: LibraryCurrencyAmount;
  paidAmount: LibraryCurrencyAmount;
  waivedAmount: LibraryCurrencyAmount;
  outstandingAmount: LibraryCurrencyAmount;
  status: LibraryFineStatus;
  assessedDate: string;
  assessedByUserIdRef: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Fine Waiver Request (Governed by Four-Eyes SoD)
 */
export interface FineWaiverRequest {
  waiverRequestId: string;
  fineIdRef: string;
  tenantId: string;
  campusIdRef: string;
  waiverAmount: LibraryCurrencyAmount;
  reasonCategory: 'ACADEMIC_EXCUSE' | 'MEDICAL_EMERGENCY' | 'INSTITUTIONAL_DELAY' | 'ADMINISTRATIVE_ERROR' | 'SPECIAL_DISPENSATION';
  justification: string;
  requestedByUserIdRef: string; // Requester
  approvedByUserIdRef?: string; // Distinct Approver (SoD)
  approvalDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Resource Damage or Loss Report
 */
export interface ResourceDamageReport {
  reportId: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  reportedByUserIdRef: string;
  memberType?: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string;
  employeeIdRef?: string;
  incidentType: 'DAMAGED_PAGES' | 'BINDING_BROKEN' | 'WATER_DAMAGE' | 'ELECTRONIC_FAILURE' | 'TOTAL_LOSS';
  estimatedRepairCost: LibraryCurrencyAmount;
  replacementAssessed: boolean;
  fineIdRef?: string;
  reportDate: string;
  status: 'INVESTIGATING' | 'REPAIR_SCHEDULED' | 'WRITTEN_OFF' | 'RESOLVED';
  auditHash?: string;
}

/**
 * Resource Repair Record
 */
export interface ResourceRepair {
  repairId: string;
  copyIdRef: string;
  tenantId: string;
  campusIdRef: string;
  sentToRepairDate: string;
  returnedFromRepairDate?: string;
  repairVendorSupplierIdRef?: string; // Ref: Phase 11.3 Supplier
  repairCost: LibraryCurrencyAmount;
  outcomeStatus: 'REPAIRED_RETURNED' | 'UNREPAIRABLE_SCRAP';
  inspectedByUserIdRef: string;
}

/**
 * Inter-Branch & Inter-Campus Resource Transfer
 */
export interface ResourceTransfer {
  transferId: string;
  transferNumber: string;
  tenantId: string;
  copyIdRef: string;
  resourceIdRef: string;
  fromCampusIdRef: string;
  toCampusIdRef: string;
  fromLibraryIdRef: string;
  toLibraryIdRef: string;
  requestedByUserIdRef: string;
  authorizedByUserIdRef?: string; // SoD authorized
  dispatchedDate?: string;
  receivedDate?: string;
  status: ResourceTransferStatus;
  reason: 'STUDENT_RESERVATION' | 'FACULTY_REQUEST' | 'COLLECTION_BALANCING' | 'SPECIAL_EXHIBITION';
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Acquisition Request & Proposal Workflow
 */
export interface AcquisitionRequest {
  requestId: string;
  requestNumber: string;
  tenantId: string;
  campusIdRef: string;
  departmentIdRef?: string; // Ref: Phase 10.1 OrgUnit
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  edition?: string;
  format: ResourceFormat;
  quantityRequested: number;
  estimatedTotalCost: LibraryCurrencyAmount;
  requestedByUserIdRef: string; // Faculty / Researcher / Student
  requesterType: 'FACULTY' | 'RESEARCHER' | 'STUDENT' | 'LIBRARIAN';
  approvedByUserIdRef?: string; // Distinct Approver (Four-Eyes SoD)
  supplierIdRef?: string; // Ref: Phase 11.3 Supplier
  purchaseOrderIdRef?: string; // Ref: Phase 11.3 PO
  status: AcquisitionRequestStatus;
  academicJustification: string;
  courseCodeRef?: string; // Ref: Phase 10.2 Course
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  auditHash?: string;
}

/**
 * Resource Withdrawal (Weeding / Deaccessioning - Four-Eyes SoD)
 */
export interface ResourceWithdrawal {
  withdrawalId: string;
  copyIdRef: string;
  resourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  withdrawalReason: 'OBSOLETE_CONTENT' | 'DAMAGED_BEYOND_REPAIR' | 'LOST_CONFIRMED' | 'SUPERSEDED_EDITION' | 'POLICY_MANDATE';
  proposedByUserIdRef: string;
  approvedByUserIdRef: string; // Distinct Approver (SoD)
  approvalDate: string;
  disposalMethod: 'RECYCLE' | 'DONATION' | 'AUCTION' | 'DESTRUCTION';
  idempotencyKey: string;
  createdAt: string;
  auditHash?: string;
}

/**
 * Digital Access Entitlement
 */
export interface DigitalAccessEntitlement {
  entitlementId: string;
  digitalResourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  memberType: 'STUDENT' | 'EMPLOYEE';
  studentIdRef?: string;
  employeeIdRef?: string;
  memberCategory: MemberCategory;
  validFrom: string;
  validUntil: string;
  maxDownloadCount: number;
  currentDownloadCount: number;
  status: DigitalAccessStatus;
  issuedByUserIdRef: string;
}

/**
 * Digital Resource Access Audit Event
 */
export interface DigitalAccessEvent {
  eventId: string;
  digitalResourceIdRef: string;
  tenantId: string;
  campusIdRef: string;
  memberIdRef: string;
  accessType: 'ONLINE_VIEW' | 'DOWNLOAD' | 'STREAM' | 'AUTHENTICATION_CHALLENGE';
  ipAddressMasked: string;
  timestamp: string;
  success: boolean;
  rejectionReason?: string;
}

// ==========================================
// 4. AUDIT & PROVENANCE (SHA-256 Chaining)
// ==========================================

export interface LibraryAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  timestamp: string;
  actorUserIdRef: string;
  action:
    | 'LIBRARY_CREATED'
    | 'RESOURCE_CATALOGUED'
    | 'RESOURCE_UPDATED'
    | 'COPY_ADDED'
    | 'COPY_STATUS_CHANGED'
    | 'LOAN_CHECKOUT'
    | 'LOAN_CHECKIN'
    | 'LOAN_RENEWED'
    | 'RESERVATION_CREATED'
    | 'RESERVATION_FULFILLED'
    | 'RESERVATION_EXPIRED'
    | 'FINE_ASSESSED'
    | 'FINE_PAID'
    | 'FINE_WAIVED_SOD'
    | 'DAMAGE_REPORTED'
    | 'TRANSFER_DISPATCHED'
    | 'TRANSFER_RECEIVED'
    | 'ACQUISITION_REQUESTED'
    | 'ACQUISITION_APPROVED_SOD'
    | 'RESOURCE_WITHDRAWN_SOD'
    | 'DIGITAL_ACCESS_GRANTED'
    | 'POLICY_OVERRIDE_SOD';
  entityType: 'Library' | 'LearningResource' | 'ResourceCopy' | 'LibraryLoan' | 'LibraryReservation' | 'LibraryFineAssessment' | 'ResourceTransfer' | 'AcquisitionRequest' | 'DigitalResource';
  entityId: string;
  previousHash: string;
  hash: string;
  correlationId: string;
  idempotencyKey?: string;
  details: Record<string, any>;
}

// ==========================================
// 5. DIAGNOSTICS
// ==========================================

export interface LibraryDiagnosticAnomaly {
  anomalyId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category:
    | 'DUPLICATE_ACTIVE_LOAN'
    | 'INVALID_RESOURCE_STATE'
    | 'ORPHAN_MEMBER_REFERENCE'
    | 'EXPIRED_UNRELEASED_RESERVATION'
    | 'UNASSESSED_OVERDUE_LOAN'
    | 'UNRESOLVED_LOST_RESOURCE'
    | 'IMPOSSIBLE_CIRCULATION_TRANSITION'
    | 'UNAUTHORIZED_RESTRICTED_ACCESS'
    | 'BROKEN_INTER_LIBRARY_TRANSFER'
    | 'DUPLICATE_ACQUISITION_REQUEST'
    | 'AUDIT_CHAIN_INTEGRITY_BREACH';
  description: string;
  entityType: string;
  entityId: string;
  campusIdRef: string;
  detectedAt: string;
  remediationRecommendation: string;
}

export interface LibraryDiagnosticResult {
  tenantId: string;
  status: 'HEALTHY' | 'WARNING' | 'ANOMALIES_DETECTED';
  totalResourcesInspected: number;
  totalCopiesInspected: number;
  totalActiveLoansInspected: number;
  anomaliesCount: number;
  anomalies: LibraryDiagnosticAnomaly[];
  auditChainIntact: boolean;
  evaluatedAt: string;
}

// ==========================================
// 6. WHAT-IF SANDBOX SIMULATION
// ==========================================

export interface LibrarySimulationScenario {
  scenarioId: string;
  name: string;
  type:
    | 'SEMESTER_CIRCULATION_SURGE'
    | 'LIBRARY_CAPACITY_EXHAUSTION'
    | 'MASS_OVERDUE_EVENT'
    | 'HIGH_DEMAND_RESOURCE_SHORTAGE'
    | 'RESERVATION_SURGE'
    | 'INTER_CAMPUS_TRANSFER_CASCADE'
    | 'LOST_RESOURCE_SURGE'
    | 'FINE_POLICY_CHANGE'
    | 'FINE_WAIVER_SURGE'
    | 'ACQUISITION_DEMAND_SURGE'
    | 'DIGITAL_ENTITLEMENT_EXPIRY_EVENT'
    | 'RESTRICTED_RESOURCE_ACCESS_ATTEMPT'
    | 'CAMPUS_CLOSURE'
    | 'RESOURCE_WITHDRAWAL_CASCADE'
    | 'LIBRARY_SERVICE_DISRUPTION';
  description: string;
  parameters: Record<string, any>;
}

export interface LibrarySimulationResult {
  scenarioType: LibrarySimulationScenario['type'];
  simulationBanner: 'SIMULATION ONLY - SANDBOX MODE ACTIVE - ZERO PRODUCTION MUTATION';
  executionDurationMs: number;
  initialResourceCount: number;
  initialCopiesCount: number;
  initialLoansCount: number;
  projectedCirculationVolume: number;
  projectedOverdueFinesTotal: LibraryCurrencyAmount;
  projectedTurnaroundDelayDays: number;
  projectedCapacityShortfallPercent: number;
  projectedInterLibraryTransitVolume: number;
  stressFactorMultiplier: number;
  recommendations: string[];
  zeroProductionMutationVerified: boolean;
}
