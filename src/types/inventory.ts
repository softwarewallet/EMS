export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type AssetStatus = 'DRAFT' | 'RECEIVED' | 'IN_STOCK' | 'ASSIGNED' | 'IN_MAINTENANCE' | 'TRANSFERRED' | 'DAMAGED' | 'LOST' | 'WRITTEN_OFF' | 'DISPOSED' | 'RETIRED';
export type StockMovementType = 'RECEIPT' | 'ISSUE' | 'RETURN' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'DAMAGE' | 'LOSS' | 'EXPIRY' | 'DISPOSAL';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export interface StoreLocation {
  id: string;
  tenantId: string;
  campusId: string;
  name: string;
  code: string;
  type: 'CENTRAL' | 'CAMPUS' | 'DEPARTMENT' | 'LABORATORY' | 'LIBRARY' | 'HOSTEL' | 'SPORTS' | 'MAINTENANCE' | 'EXAMINATION' | 'CUSTOM';
  description?: string;
  responsibleOfficerId?: string;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface InventoryCategory {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  parentCategoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  campusId?: string;
  itemCode: string;
  sku?: string;
  barcode?: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  unitOfMeasure: string;
  isConsumable: boolean;
  isSerialized: boolean;
  requiresBatchTracking: boolean;
  requiresExpiryTracking: boolean;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  status: InventoryStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface InventoryStock {
  id: string;
  tenantId: string;
  campusId: string;
  storeId: string;
  itemId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastValuation?: number;
  lastMovementDate: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface InventoryStockLedger {
  id: string;
  tenantId: string;
  campusId: string;
  storeId: string;
  itemId: string;
  movementType: StockMovementType;
  quantity: number;
  balanceAfter: number;
  referenceId: string; // GRN ID, Issue ID, Adjustment ID, etc.
  referenceType: string;
  notes?: string;
  actorId: string;
  actorName: string;
  timestamp: string;
}

export interface InventoryReceipt {
  id: string;
  tenantId: string;
  campusId: string;
  receiptNumber: string;
  storeId: string;
  grnId?: string;
  poId?: string;
  vendorId?: string;
  receivedDate: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitCost?: number;
    batchNumber?: string;
    expiryDate?: string;
  }[];
  receivedById: string;
  receivedByName: string;
  status: 'COMPLETED';
  notes?: string;
  createdAt: string;
}

export interface InventoryIssue {
  id: string;
  tenantId: string;
  campusId: string;
  issueNumber: string;
  storeId: string;
  requestedById: string;
  requestedByName: string;
  departmentId?: string;
  issueDate: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    notes?: string;
  }[];
  issuedById: string;
  issuedByName: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'ISSUED' | 'REJECTED';
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryReturn {
  id: string;
  tenantId: string;
  campusId: string;
  returnNumber: string;
  storeId: string;
  issueId: string;
  returnedById: string;
  returnedByName: string;
  returnDate: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    condition: 'GOOD' | 'DAMAGED' | 'EXPIRED';
    notes?: string;
  }[];
  receivedById: string;
  receivedByName: string;
  status: 'COMPLETED';
  createdAt: string;
}

export interface InventoryTransfer {
  id: string;
  tenantId: string;
  campusId: string;
  transferNumber: string;
  sourceStoreId: string;
  destinationStoreId: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
  }[];
  requestedById: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';
  dispatchedById?: string;
  receivedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAdjustment {
  id: string;
  tenantId: string;
  campusId: string;
  adjustmentNumber: string;
  storeId: string;
  adjustmentDate: string;
  type: 'INCREASE' | 'DECREASE';
  reason: 'COUNT_VARIANCE' | 'DAMAGE' | 'EXPIRY' | 'LOSS' | 'CORRECTION';
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    notes?: string;
  }[];
  requestedById: string;
  requestedByName: string;
  approvedById?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAsset {
  id: string;
  tenantId: string;
  campusId: string;
  assetNumber: string;
  serialNumber?: string;
  barcode?: string;
  itemId: string;
  itemName: string;
  categoryId: string;
  categoryName: string;
  purchaseCost?: number;
  acquisitionDate?: string;
  grnId?: string;
  poId?: string;
  currentStoreId?: string;
  currentCustodianId?: string;
  currentLocation?: string;
  status: AssetStatus;
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'UNUSABLE';
  warrantyExpiryDate?: string;
  usefulLifeMonths?: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface AssetAssignment {
  id: string;
  tenantId: string;
  campusId: string;
  assetId: string;
  assetNumber: string;
  assignedToId: string; // Staff/Student/Dept ID
  assignedToType: 'STAFF' | 'STUDENT' | 'DEPARTMENT' | 'LOCATION';
  assignedToName: string;
  assignedDate: string;
  expectedReturnDate?: string;
  returnedDate?: string;
  assignedById: string;
  status: 'ACTIVE' | 'RETURNED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetMaintenanceReference {
  id: string;
  tenantId: string;
  assetId: string;
  maintenanceRequestId: string;
  providerReference?: string;
  startDate: string;
  endDate?: string;
  cost?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface InventoryStockAudit {
  id: string;
  tenantId: string;
  campusId: string;
  auditNumber: string;
  storeId: string;
  auditorId: string;
  auditorName: string;
  startDate: string;
  completedDate?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStockAuditLine {
  id: string;
  tenantId: string;
  auditId: string;
  itemId: string;
  expectedQuantity: number;
  actualQuantity: number;
  variance: number;
  reason?: string;
  adjustmentId?: string;
}

export interface InventoryAnalyticsCache {
  id: string; // Usually 'tenantId_campusId'
  tenantId: string;
  campusId: string;
  totalItems: number;
  totalStockValue: number;
  lowStockItemsCount: number;
  outOfStockItemsCount: number;
  totalAssets: number;
  assignedAssets: number;
  maintenanceAssets: number;
  lastUpdated: string;
}
