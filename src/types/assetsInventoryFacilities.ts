export type AssetLifecycleState =
  | 'REQUESTED'
  | 'ACQUIRED'
  | 'RECEIVED'
  | 'ASSIGNED'
  | 'IN_SERVICE'
  | 'UNDER_MAINTENANCE'
  | 'RETIRED'
  | 'DISPOSED'
  | 'LOST'
  | 'DAMAGED';

export type InventoryMovementType =
  | 'RECEIPT'
  | 'ISSUE'
  | 'RETURN'
  | 'TRANSFER'
  | 'ADJUSTMENT'
  | 'RECONCILIATION';

export type MaintenanceStatus =
  | 'REQUESTED'
  | 'TRIAGED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Asset {
  assetId: string;
  assetIdentifier: string;
  tenantId: string;
  campusIdRef: string;
  organizationUnitIdRef: string;
  assetCategory: string;
  assetClass: string;
  description: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  acquisitionReference?: string;
  supplierIdRef?: string;
  purchaseOrderIdRef?: string;
  invoiceIdRef?: string;
  financialAccountIdRef?: string;
  custodianEmployeeIdRef?: string;
  currentLocationIdRef?: string;
  operationalStatus: 'OPERATIONAL' | 'DEGRADED' | 'NON_OPERATIONAL';
  lifecycleState: AssetLifecycleState;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetAssignment {
  assignmentId: string;
  tenantId: string;
  assetIdRef: string;
  assignedToEmployeeIdRef?: string;
  assignedToOrgUnitIdRef?: string;
  assignedByUserIdRef: string;
  assignmentDate: string;
  returnDate?: string;
  status: 'ACTIVE' | 'RELEASED' | 'TRANSFERRED';
}

export interface AssetTransfer {
  transferId: string;
  tenantId: string;
  assetIdRef: string;
  sourceCampusIdRef: string;
  destinationCampusIdRef: string;
  sourceOrgUnitIdRef: string;
  destinationOrgUnitIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'REQUESTED' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  transferDate: string;
}

export interface AssetDisposal {
  disposalId: string;
  tenantId: string;
  assetIdRef: string;
  reason: string;
  disposalMethod: 'SCRAPPED' | 'SOLD' | 'DONATED' | 'RECYCLED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'REQUESTED' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'DISPOSED';
  disposalDate?: string;
}

export interface InventoryItem {
  itemId: string;
  itemCode: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  category: string;
  unitOfMeasure: string;
  availableQuantity: number;
  reservedQuantity: number;
  minimumThreshold: number;
  maximumThreshold: number;
  reorderPoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  movementId: string;
  tenantId: string;
  campusIdRef: string;
  itemIdRef: string;
  movementType: InventoryMovementType;
  quantity: number;
  sourceLocationIdRef?: string;
  destinationLocationIdRef?: string;
  actorUserIdRef: string;
  approverUserIdRef?: string;
  idempotencyKey: string;
  timestamp: string;
  notes?: string;
}

export interface FacilityLocation {
  locationId: string;
  tenantId: string;
  campusIdRef: string;
  buildingName: string;
  floor: string;
  roomNumber: string;
  category: 'CLASSROOM' | 'LAB' | 'OFFICE' | 'AUDITORIUM' | 'STORAGE' | 'MAINTENANCE_ZONE';
  parentLocationIdRef?: string;
  capacity?: number;
  status: 'ACTIVE' | 'UNDER_MAINTENANCE' | 'CLOSED';
}

export interface MaintenanceWorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  tenantId: string;
  campusIdRef: string;
  assetIdRef?: string;
  facilityLocationIdRef?: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  assignedTechnicianEmployeeIdRef?: string;
  description: string;
  estimatedEffortHours: number;
  actualEffortHours?: number;
  scheduledDate?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreventiveMaintenanceSchedule {
  scheduleId: string;
  tenantId: string;
  campusIdRef: string;
  assetIdRef?: string;
  facilityLocationIdRef?: string;
  title: string;
  frequencyDays: number;
  lastCompletedDate?: string;
  nextDueDate: string;
  responsibleEmployeeIdRef: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'OVERDUE';
}

export interface InspectionRecord {
  inspectionId: string;
  tenantId: string;
  campusIdRef: string;
  assetIdRef?: string;
  facilityLocationIdRef?: string;
  inspectorUserIdRef: string;
  inspectionDate: string;
  complianceStatus: 'PASSED' | 'PASSED_WITH_DEFICIENCIES' | 'FAILED' | 'EXPIRED';
  deficienciesFound: string[];
  correctiveActionsRequired: string[];
}

export interface AssetAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface AssetSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: { processed: number; mutations: number; executionTimeMs: number };
}
