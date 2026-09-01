export type StoreLifecycleStatus = 'DRAFT' | 'ACTIVE' | 'RESTRICTED' | 'CLOSED';

export type ReceiptLifecycleStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'POSTED' | 'CLOSED' | 'CANCELLED';

export type IssueLifecycleStatus = 'DRAFT' | 'REQUESTED' | 'APPROVED' | 'PICKED' | 'ISSUED' | 'CLOSED' | 'REJECTED' | 'CANCELLED';

export type ReturnLifecycleStatus = 'REQUESTED' | 'APPROVED' | 'RECEIVED' | 'INSPECTED' | 'POSTED' | 'CLOSED' | 'REJECTED';

export type TransferLifecycleStatus = 'REQUESTED' | 'APPROVED' | 'DISPATCHED' | 'IN_TRANSIT' | 'RECEIVED' | 'RECONCILED' | 'CLOSED' | 'CANCELLED';

export type ReservationStatus = 'ACTIVE' | 'CONSUMED' | 'EXPIRED' | 'CANCELLED';

export type AdjustmentStatus = 'REQUESTED' | 'REVIEW' | 'APPROVED' | 'POSTED' | 'CLOSED' | 'REJECTED';

export type AdjustmentType = 'INCREASE' | 'DECREASE' | 'DAMAGE' | 'WRITE_OFF' | 'RECLASSIFICATION';

export type CountLifecycleStatus = 'PLANNED' | 'OPEN' | 'COUNTING' | 'SUBMITTED' | 'VERIFIED' | 'RECONCILED' | 'CLOSED' | 'CANCELLED';

export type LotStatus = 'USABLE' | 'QUARANTINED' | 'EXPIRED' | 'REJECTED';

export type SerialStatus = 'IN_STOCK' | 'ISSUED' | 'ASSIGNED' | 'IN_TRANSIT' | 'DAMAGED' | 'RETIRED' | 'LOST';

export type OperationalAssetLifecycleState = 
  | 'DRAFT' 
  | 'ACQUIRED' 
  | 'IN_SERVICE' 
  | 'ASSIGNED' 
  | 'MAINTENANCE' 
  | 'TRANSFER_PENDING' 
  | 'RETIRED' 
  | 'DISPOSED' 
  | 'LOST' 
  | 'DAMAGED';

export type AssetAssignmentStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'ASSIGNED' 
  | 'ACKNOWLEDGED' 
  | 'RETURN_REQUESTED' 
  | 'RETURNED' 
  | 'CLOSED' 
  | 'REJECTED';

export type AssetTransferStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'DISPATCHED' 
  | 'RECEIVED' 
  | 'ACKNOWLEDGED' 
  | 'CLOSED' 
  | 'CANCELLED';

export type AssetDisposalStatus = 
  | 'REQUESTED' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'DISPOSAL_PENDING' 
  | 'DISPOSED' 
  | 'CLOSED' 
  | 'REJECTED';

export type InventoryExceptionType = 
  | 'OVERRIDE_ISSUE' 
  | 'CAPACITY_BYPASS' 
  | 'EXPIRED_LOT_RELEASE' 
  | 'NEGATIVE_BALANCE_ALLOWANCE' 
  | 'UNRECONCILED_VARIANCE'
  | 'DISPOSAL_FAST_TRACK';

export type InventoryExceptionStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type StandardUOM = 'EACH' | 'BOX' | 'PACK' | 'KG' | 'G' | 'L' | 'ML' | 'M' | 'SET';

export interface UnitOfMeasure {
  uomId: string;
  code: StandardUOM | string;
  name: string;
  tenantId: string;
  isBaseUnit: boolean;
  baseUOMRef?: string;
  conversionFactor: number; // Multiply by this to get base UOM value
}

export interface InventoryCategory {
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  tenantId: string;
  isActive: boolean;
}

export interface InventorySubcategory {
  subcategoryId: string;
  categoryIdRef: string;
  code: string;
  name: string;
  tenantId: string;
  isActive: boolean;
}

export interface InventoryItem {
  itemId: string;
  itemCode: string; // Deterministic & unique within tenant
  name: string;
  description: string;
  categoryIdRef: string;
  subcategoryIdRef?: string;
  uomIdRef: string;
  isConsumable: boolean;
  isSerialized: boolean;
  isBatchControlled: boolean;
  reorderThreshold: number;
  minimumStock: number;
  maximumStock: number;
  safetyStock: number;
  standardCost: number;
  isActive: boolean;
  tenantId: string;
  permittedCampusScope: string[]; // Campus IDs allowed
  createdAt: string;
  updatedAt: string;
}

export interface StoreLocation {
  storeId: string;
  storeCode: string;
  name: string;
  tenantId: string;
  campusIdRef: string;
  organizationUnitIdRef?: string;
  capacityMax: number;
  currentUtilization: number;
  status: StoreLifecycleStatus;
  securityClassification: 'STANDARD' | 'RESTRICTED' | 'HIGH_SECURITY' | 'HAZMAT';
  responsibleOfficerUserIdRef: string;
  isCentralWarehouse: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StorageBin {
  binId: string;
  storeIdRef: string;
  tenantId: string;
  binCode: string;
  aisle: string;
  rack: string;
  shelf: string;
  maxCapacity: number;
  currentCapacity: number;
  isActive: boolean;
}

export interface StockBalance {
  balanceId: string;
  itemIdRef: string;
  storeIdRef: string;
  tenantId: string;
  onHand: number;
  reserved: number;
  available: number; // formula: onHand - reserved - quarantined - damaged
  damaged: number;
  quarantined: number;
  inTransit: number;
  updatedAt: string;
}

export interface StockLot {
  lotId: string;
  itemIdRef: string;
  storeIdRef: string;
  tenantId: string;
  lotNumber: string;
  manufactureDate?: string;
  expiryDate?: string;
  receivedDate: string;
  quantity: number;
  status: LotStatus;
  supplierIdRef?: string;
  purchaseOrderIdRef?: string;
}

export interface SerialNumberRecord {
  serialId: string;
  itemIdRef: string;
  serialNumber: string; // Unique per tenant + item
  tenantId: string;
  storeIdRef?: string;
  status: SerialStatus;
  currentCustodyUserIdRef?: string;
  currentAssetIdRef?: string;
  registeredAt: string;
  updatedAt: string;
}

export interface InventoryReceiptLine {
  lineId: string;
  itemIdRef: string;
  quantityExpected: number;
  quantityReceived: number;
  quantityRejected: number;
  unitPrice: number;
  uomIdRef: string;
  lotNumber?: string;
  expiryDate?: string;
  serialNumbers?: string[];
  rejectionReason?: string;
}

export interface InventoryReceipt {
  receiptId: string;
  receiptNumber: string;
  tenantId: string;
  campusIdRef: string;
  storeIdRef: string;
  supplierIdRef?: string; // Reference to Phase 11.3 Supplier
  purchaseOrderIdRef?: string; // Reference to Phase 11.3 PO
  requisitionIdRef?: string; // Reference to Phase 11.3 Requisition
  receivingOfficerUserIdRef: string;
  status: ReceiptLifecycleStatus;
  lines: InventoryReceiptLine[];
  totalAmount: number;
  receivedAt: string;
  verifiedAt?: string;
  verifiedByUserIdRef?: string;
  postedAt?: string;
  postedByUserIdRef?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockIssueLine {
  lineId: string;
  itemIdRef: string;
  quantityRequested: number;
  quantityIssued: number;
  uomIdRef: string;
  lotIdRef?: string;
  serialNumbers?: string[];
}

export interface StockIssue {
  issueId: string;
  issueNumber: string;
  tenantId: string;
  campusIdRef: string;
  storeIdRef: string;
  recipientType: 'EMPLOYEE' | 'STUDENT' | 'ORG_UNIT' | 'CAMPUS' | 'PROJECT';
  recipientIdRef: string; // Reference to Phase 11.1 Employee, Phase 10.4 Student, or OrgUnit
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  issuedByUserIdRef?: string;
  status: IssueLifecycleStatus;
  lines: StockIssueLine[];
  purpose: string;
  requiredByDate?: string;
  issuedAt?: string;
  idempotencyKey: string;
  costCenterIdRef?: string; // Reference to Phase 11.2 Cost Center
  createdAt: string;
  updatedAt: string;
}

export interface StockReturnLine {
  lineId: string;
  itemIdRef: string;
  quantityReturned: number;
  returnCondition: 'USABLE' | 'DAMAGED' | 'QUARANTINED';
  uomIdRef: string;
  lotIdRef?: string;
  serialNumbers?: string[];
  remarks?: string;
}

export interface StockReturn {
  returnId: string;
  returnNumber: string;
  tenantId: string;
  campusIdRef: string;
  storeIdRef: string;
  stockIssueIdRef?: string;
  returnedByUserIdRef: string;
  inspectedByUserIdRef?: string;
  status: ReturnLifecycleStatus;
  lines: StockReturnLine[];
  returnedAt: string;
  postedAt?: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface StockTransferLine {
  lineId: string;
  itemIdRef: string;
  quantityTransferred: number;
  quantityReceived?: number;
  uomIdRef: string;
  lotIdRef?: string;
  serialNumbers?: string[];
}

export interface StockTransfer {
  transferId: string;
  transferNumber: string;
  tenantId: string;
  sourceCampusIdRef: string;
  sourceStoreIdRef: string;
  destinationCampusIdRef: string;
  destinationStoreIdRef: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  dispatchedByUserIdRef?: string;
  receivedByUserIdRef?: string;
  status: TransferLifecycleStatus;
  lines: StockTransferLine[];
  dispatchedAt?: string;
  receivedAt?: string;
  reconciliationNotes?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockReservation {
  reservationId: string;
  tenantId: string;
  campusIdRef: string;
  storeIdRef: string;
  itemIdRef: string;
  requestedQuantity: number;
  approvedQuantity: number;
  reservedQuantity: number;
  expiryDate: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  targetReferenceId: string; // e.g., project, event, maintenance work order
  targetType: 'PROJECT' | 'MAINTENANCE' | 'EVENT' | 'COURSE' | 'DEPARTMENT';
  status: ReservationStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustment {
  adjustmentId: string;
  adjustmentNumber: string;
  tenantId: string;
  storeIdRef: string;
  itemIdRef: string;
  adjustmentType: AdjustmentType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  evidenceRef?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: AdjustmentStatus;
  postedAt?: string;
  idempotencyKey: string;
  auditHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCountLine {
  lineId: string;
  itemIdRef: string;
  systemQuantity: number;
  countedQuantity: number;
  varianceQuantity: number; // counted - system
  variancePercentage: number;
  reasonCode?: string;
  isReconciled: boolean;
}

export interface InventoryCount {
  countId: string;
  countNumber: string;
  tenantId: string;
  campusIdRef: string;
  storeIdRef: string;
  countType: 'CYCLE' | 'FULL' | 'BLIND';
  plannedDate: string;
  status: CountLifecycleStatus;
  countedByUserIdRef?: string;
  verifiedByUserIdRef?: string;
  lines: InventoryCountLine[];
  totalVarianceQuantity: number;
  reconciliationNotes?: string;
  reconciledAt?: string;
  reconciledByUserIdRef?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryReconciliation {
  reconciliationId: string;
  tenantId: string;
  countIdRef: string;
  storeIdRef: string;
  totalItemsCounted: number;
  totalVariances: number;
  unexplainedShortages: number;
  unexplainedSurplus: number;
  staleReservationsDetected: number;
  status: 'REVIEW' | 'APPROVED' | 'AUTO_RECONCILED' | 'EXCEPTION_REQUIRED';
  approvedByUserIdRef?: string;
  reconciledAt: string;
}

export interface ReorderRule {
  ruleId: string;
  tenantId: string;
  storeIdRef: string;
  itemIdRef: string;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  autoReorderEnabled: boolean;
  preferredSupplierIdRef?: string;
  isActive: boolean;
}

export interface InventoryException {
  exceptionId: string;
  tenantId: string;
  campusIdRef: string;
  exceptionType: InventoryExceptionType;
  targetEntityIdRef: string;
  justification: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: InventoryExceptionStatus;
  validUntil: string;
  idempotencyKey: string;
  createdAt: string;
}

// Operational Asset Management (Fixed & Movable Assets)
export interface AssetCategory {
  categoryId: string;
  code: string;
  name: string;
  depreciationMethod: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'NONE';
  usefulLifeMonths: number;
  tenantId: string;
  isActive: boolean;
}

export interface Asset {
  assetId: string;
  assetCode: string; // Unique per tenant
  name: string;
  description: string;
  categoryIdRef: string;
  tenantId: string;
  campusIdRef: string;
  status: OperationalAssetLifecycleState;
  purchaseCost: number;
  currentBookValue: number;
  serialNumber?: string;
  barCode?: string;
  facilitySpaceIdRef?: string; // Reference to Phase 11.5 Space/Facility
  financialAccountIdRef?: string; // Reference to Phase 11.2 Account
  costCenterIdRef?: string; // Reference to Phase 11.2 Cost Center
  supplierIdRef?: string; // Reference to Phase 11.3 Supplier
  purchaseOrderIdRef?: string; // Reference to Phase 11.3 PO
  acquisitionDate: string;
  warrantyExpiry?: string;
  isDepreciated: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetAssignment {
  assignmentId: string;
  assetIdRef: string;
  tenantId: string;
  campusIdRef: string;
  assignedToType: 'EMPLOYEE' | 'STUDENT' | 'ORG_UNIT' | 'CAMPUS' | 'FACILITY_SPACE';
  assignedToIdRef: string; // Reference to Employee, Student, OrgUnit, Space
  assignedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: AssetAssignmentStatus;
  issueDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  conditionOnIssue: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  conditionOnReturn?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  acknowledgementNotes?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCustody {
  custodyId: string;
  assetIdRef: string;
  tenantId: string;
  custodianUserIdRef: string;
  status: 'ACTIVE' | 'TRANSFERRED' | 'RETURNED' | 'DISPOSED';
  startDate: string;
  endDate?: string;
  notes?: string;
  condition: string;
}

export interface AssetTransfer {
  transferId: string;
  assetIdRef: string;
  tenantId: string;
  sourceCampusIdRef: string;
  targetCampusIdRef: string;
  sourceSpaceIdRef?: string;
  targetSpaceIdRef?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  dispatchedByUserIdRef?: string;
  receivedByUserIdRef?: string;
  status: AssetTransferStatus;
  transferReason: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetMaintenanceReference {
  referenceId: string;
  assetIdRef: string;
  tenantId: string;
  externalMaintenanceIdRef: string; // Links to Phase 11.5 / 11.4 Maintenance Work Order
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'INSPECTION';
  scheduledDate: string;
  completedDate?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AssetDisposalRequest {
  disposalId: string;
  disposalNumber: string;
  assetIdRef: string;
  tenantId: string;
  campusIdRef: string;
  reason: string;
  condition: 'OBSOLETE' | 'DAMAGED_BEYOND_REPAIR' | 'SURPLUS' | 'EXPIRED';
  disposalMethod: 'SALE' | 'SCRAP' | 'DONATION' | 'WRITE_OFF' | 'RECYCLING';
  estimatedRecoveryValue: number;
  actualRecoveryValue?: number;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: AssetDisposalStatus;
  disposedAt?: string;
  auditHash: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

// Audit & Provenance
export interface InventoryMaterialsAuditEvent {
  eventId: string;
  tenantId: string;
  actorUserIdRef: string;
  action: string;
  entityType: 'ITEM' | 'STORE' | 'BALANCE' | 'RECEIPT' | 'ISSUE' | 'RETURN' | 'TRANSFER' | 'RESERVATION' | 'ADJUSTMENT' | 'COUNT' | 'ASSET' | 'ASSIGNMENT' | 'DISPOSAL' | 'EXCEPTION';
  entityId: string;
  timestamp: string;
  payload: any;
  previousHash: string;
  hash: string;
}

// What-If Simulation Scenarios
export interface InventorySimulationScenario {
  scenarioId: string;
  name: string;
  description: string;
  type: 
    | 'DEMAND_SURGE'
    | 'STOCKOUT'
    | 'WAREHOUSE_CAPACITY_EXHAUSTION'
    | 'CAMPUS_TRANSFER_SURGE'
    | 'RESERVATION_SPIKE'
    | 'SUPPLIER_RECEIPT_DELAY'
    | 'BATCH_EXPIRY_CASCADE'
    | 'SERIAL_NUMBER_COLLISION'
    | 'PHYSICAL_COUNT_VARIANCE'
    | 'EMERGENCY_STOCK_RELEASE'
    | 'ASSET_ASSIGNMENT_SURGE'
    | 'ASSET_TRANSFER_CASCADE'
    | 'DISPOSAL_BACKLOG'
    | 'NEGATIVE_STOCK_DETECTION'
    | 'PROCUREMENT_DISRUPTION';
  parameters: Record<string, any>;
  simulatedImpact: {
    stockBalanceDelta?: number;
    stockoutRiskPercentage?: number;
    unfulfilledIssuesCount?: number;
    capacityExceeded?: boolean;
    costImpact?: number;
    flaggedAnomalies?: string[];
    recommendations: string[];
  };
}
