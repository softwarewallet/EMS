export type MaintenancePriority = 'EMERGENCY' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
export type MaintenanceStatus = 'OPEN' | 'TRIAGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'WAITING_VENDOR' | 'COMPLETED' | 'VERIFIED' | 'CANCELLED' | 'CLOSED';
export type FacilityRequestStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED' | 'CLOSED';
export type AssetCondition = 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED' | 'UNSERVICEABLE';
export type DisposalStatus = 'DISPOSAL_PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'DISPOSED' | 'ARCHIVED';

export interface MaintenanceSchedule {
  id: string;
  tenantId: string;
  campusId: string;
  assetId: string;
  title: string;
  description: string;
  frequencyDays: number;
  lastMaintainedAt?: string;
  nextDueAt: string;
  assignedTechnicianId?: string;
  providerReference?: string;
  estimatedCost?: number;
  checklist: string[];
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MaintenanceWorkOrder {
  id: string;
  tenantId: string;
  campusId: string;
  workOrderNumber: string;
  assetId?: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'FACILITY';
  status: MaintenanceStatus;
  reportedById: string;
  assignedTechnicianId?: string;
  diagnosis?: string;
  repairActivity?: string;
  partsConsumed?: string[];
  downtimeHours?: number;
  completedAt?: string;
  verifiedAt?: string;
  verifiedById?: string;
  providerReference?: string;
  cost?: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface FacilityRequest {
  id: string;
  tenantId: string;
  campusId: string;
  requestNumber: string;
  title: string;
  description: string;
  locationId: string; // Campus, Building, Room, etc.
  category: string;
  priority: MaintenancePriority;
  status: FacilityRequestStatus;
  reporterId: string;
  assignedToId?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface AssetInspection {
  id: string;
  tenantId: string;
  campusId: string;
  inspectionNumber: string;
  assetId: string;
  type: 'ROUTINE' | 'SAFETY' | 'COMPLIANCE' | 'CONDITION' | 'PRE_TRANSFER' | 'POST_REPAIR' | 'ANNUAL' | 'DISPOSAL';
  inspectorId: string;
  inspectionDate: string;
  condition: AssetCondition;
  findings: string;
  defects: string[];
  correctiveActions?: string;
  status: 'DRAFT' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface Warranty {
  id: string;
  tenantId: string;
  assetId: string;
  providerReference: string;
  warrantyNumber: string;
  startDate: string;
  endDate: string;
  coveredComponents: string;
  exclusions: string;
  claimStatus: 'NONE' | 'ACTIVE_CLAIM' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceContract {
  id: string;
  tenantId: string;
  contractNumber: string;
  vendorId: string; // From Procurement
  title: string;
  startDate: string;
  endDate: string;
  coveredAssetIds: string[];
  slaDescription: string;
  serviceFrequency: string;
  renewalStatus: 'ACTIVE' | 'EXPIRED' | 'RENEWED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface AssetIncident {
  id: string;
  tenantId: string;
  campusId: string;
  incidentNumber: string;
  assetId: string;
  type: 'LOST' | 'DAMAGED' | 'STOLEN' | 'MISSING' | 'VARIANCE';
  locationId: string;
  reporterId: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  investigationStatus: 'OPEN' | 'UNDER_INVESTIGATION' | 'CONCLUDED';
  resolution?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisposalRecord {
  id: string;
  tenantId: string;
  campusId: string;
  assetId: string;
  disposalNumber: string;
  reason: string;
  condition: AssetCondition;
  method: 'SALE' | 'SCRAP' | 'DONATION' | 'RECYCLE';
  status: DisposalStatus;
  proposedById: string;
  approvedById?: string;
  disposalDate?: string;
  residualValue?: number;
  financeReference?: string;
  createdAt: string;
  updatedAt: string;
}
