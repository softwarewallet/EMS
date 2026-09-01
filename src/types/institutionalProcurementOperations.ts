import { CurrencyAmount } from './institutionalFinanceOperations';

export type SupplierStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'ARCHIVED';

export type ProcurementRequestStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'CONVERTED' | 'CANCELLED';

export type PurchaseOrderStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ISSUED' | 'ACKNOWLEDGED' | 'PARTIALLY_RECEIVED' | 'FULLY_RECEIVED' | 'CLOSED' | 'CANCELLED' | 'SUSPENDED';

export type ThreeWayMatchStatus = 'MATCHED' | 'PARTIAL_MATCH' | 'PRICE_VARIANCE' | 'QUANTITY_VARIANCE' | 'MISSING_RECEIPT' | 'MISSING_PO' | 'CURRENCY_MISMATCH' | 'SUPPLIER_MISMATCH' | 'EXCEPTION';

export interface Supplier {
  supplierId: string;
  supplierNumber: string;
  tenantId: string;
  campusIdRef: string;
  legalName: string;
  displayName: string;
  category: string;
  status: SupplierStatus;
  qualificationState: 'PENDING' | 'QUALIFIED' | 'EXPIRED' | 'REVOKED';
  contactEmail: string;
  contactPhone: string;
  taxIdentifier: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementRequest {
  requestId: string;
  requestNumber: string;
  tenantId: string;
  campusIdRef: string;
  organizationUnitIdRef: string;
  requesterUserIdRef: string;
  justification: string;
  totalEstimatedAmount: CurrencyAmount;
  status: ProcurementRequestStatus;
  idempotencyKey: string;
  createdAt: string;
}

export interface PurchaseOrderLine {
  lineId: string;
  itemDescription: string;
  quantity: number;
  unitPrice: CurrencyAmount;
  totalPrice: CurrencyAmount;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  poId: string;
  poNumber: string;
  tenantId: string;
  campusIdRef: string;
  supplierIdRef: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  lines: PurchaseOrderLine[];
  totalAmount: CurrencyAmount;
  status: PurchaseOrderStatus;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsReceipt {
  receiptId: string;
  receiptNumber: string;
  tenantId: string;
  poIdRef: string;
  receivedByUserIdRef: string;
  receivedDate: string;
  lines: {
    lineId: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
  }[];
  createdAt: string;
}

export interface SupplierInvoice {
  invoiceId: string;
  invoiceNumber: string;
  tenantId: string;
  supplierIdRef: string;
  poIdRef: string;
  totalAmount: CurrencyAmount;
  status: 'RECEIVED' | 'VALIDATING' | 'MATCHED' | 'APPROVED' | 'DISPUTED' | 'REJECTED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  matchStatus: ThreeWayMatchStatus;
  createdAt: string;
}

export interface ProcurementDispute {
  disputeId: string;
  tenantId: string;
  poIdRef: string;
  supplierIdRef: string;
  reason: string;
  status: 'OPEN' | 'INVESTIGATION' | 'NEGOTIATION' | 'RESOLVED' | 'CLOSED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
}

export interface ProcurementAuditEvent {
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

export interface ProcurementSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: { processed: number; mutations: number; executionTimeMs: number };
}
