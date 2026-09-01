export interface CurrencyAmount {
  amountMinorUnits: number;
  currencyCode: string;
  scale: number;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'VOIDED';
export type PaymentStatus = 'INITIATED' | 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'ALLOCATED' | 'COMPLETED' | 'FAILED' | 'EXPIRED' | 'CANCELLED' | 'REVERSED';
export type RefundStatus = 'REQUESTED' | 'REVIEW' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED' | 'CANCELLED';
export type FinancialHoldStatus = 'REQUESTED' | 'ACTIVE' | 'RELEASE_REQUESTED' | 'RELEASED';

export interface StudentFinancialAccount {
  accountId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef: string;
  status: 'ACTIVE' | 'CLOSED' | 'SUSPENDED';
  outstandingBalance: CurrencyAmount;
  overpaymentBalance: CurrencyAmount;
  currencyCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCharge {
  chargeId: string;
  tenantId: string;
  studentIdRef: string;
  sourceReferenceIdRef: string;
  feeComponent: string;
  amount: CurrencyAmount;
  effectiveDate: string;
  status: 'ACTIVE' | 'BILLED' | 'CANCELLED';
  idempotencyKey: string;
  createdAt: string;
}

export interface Invoice {
  invoiceId: string;
  tenantId: string;
  studentIdRef: string;
  invoiceNumber: string;
  subtotal: CurrencyAmount;
  discountTotal: CurrencyAmount;
  netAmount: CurrencyAmount;
  paidAmount: CurrencyAmount;
  outstandingAmount: CurrencyAmount;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: string;
  idempotencyKey: string;
  tenantId: string;
  studentIdRef: string;
  amount: CurrencyAmount;
  paymentMethod: string;
  gatewayReferenceId?: string;
  status: PaymentStatus;
  actorUserIdRef: string;
  timestamp: string;
}

export interface RefundRequest {
  refundId: string;
  tenantId: string;
  studentIdRef: string;
  paymentIdRef: string;
  amount: CurrencyAmount;
  reason: string;
  status: RefundStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialHold {
  holdId: string;
  tenantId: string;
  studentIdRef: string;
  reason: string;
  status: FinancialHoldStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceAuditEvent {
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

export interface FinancialSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
