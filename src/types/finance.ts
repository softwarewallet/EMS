export type FeeStructureStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';
export type FeeFrequency = 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'TERM' | 'HALF_YEARLY' | 'ANNUAL' | 'CUSTOM';
export type FinancialAccountStatus = 'ACTIVE' | 'ON_HOLD' | 'CLOSED' | 'WRITTEN_OFF';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'VOIDED';
export type ChargeStatus = 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'WAIVED' | 'CANCELLED' | 'REVERSED';
export type PaymentStatus = 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'REVERSED';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'UPI' | 'CHEQUE' | 'DEMAND_DRAFT' | 'ONLINE_GATEWAY' | 'OTHER';
export type LedgerTransactionType = 'CHARGE' | 'PAYMENT' | 'DISCOUNT' | 'SCHOLARSHIP' | 'WAIVER' | 'LATE_FEE' | 'REFUND' | 'REVERSAL' | 'ADJUSTMENT' | 'WRITE_OFF' | 'OPENING_BALANCE';
export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type HoldStatus = 'ACTIVE' | 'RELEASED' | 'WAIVED';

export interface FeeComponent {
  feeComponentId: string;
  feeStructureId: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  amount: number; // Stored in minor units (e.g., cents)
  frequency: FeeFrequency;
  taxApplicable: boolean;
  sequence: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FeeStructure {
  feeStructureId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  name: string;
  code: string;
  description?: string;
  boardType?: string;
  classIds: string[];
  status: FeeStructureStatus;
  version: string;
  effectiveFrom: string;
  effectiveTo: string;
  currency: string;
  components: FeeComponent[];
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialAccount {
  financialAccountId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  currentEnrollmentId: string;
  academicYearId: string;
  currency: string;
  status: FinancialAccountStatus;
  openingBalance: number;
  currentBalance: number; // Derived from ledger
  createdAt: string;
  updatedAt: string;
}

export interface FinancialLedgerEntry {
  ledgerEntryId: string;
  tenantId: string;
  campusId?: string;
  financialAccountId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  transactionType: LedgerTransactionType;
  referenceType: 'INVOICE' | 'CHARGE' | 'PAYMENT' | 'REFUND' | 'CONCESSION' | 'WAIVER' | 'SCHOLARSHIP';
  referenceId: string;
  debit: number;
  credit: number;
  currency: string;
  description: string;
  transactionDate: string;
  effectiveDate: string;
  status: 'POSTED' | 'REVERSED';
  createdBy: string;
  createdAt: string;
  reversalOf?: string;
  version: string;
}

export interface FeeAssignment {
  feeAssignmentId: string;
  tenantId: string;
  campusId?: string;
  academicYearId: string;
  studentId: string;
  enrollmentId: string;
  feeStructureId: string;
  feeStructureVersion: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeCharge {
  chargeId: string;
  tenantId: string;
  campusId?: string;
  financialAccountId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  feeAssignmentId: string;
  feeComponentId: string;
  billingPeriod: string;
  description: string;
  baseAmount: number;
  discountAmount: number;
  scholarshipAmount: number;
  waiverAmount: number;
  lateFeeAmount: number;
  netAmount: number;
  currency: string;
  dueDate: string;
  status: ChargeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  invoiceId: string;
  tenantId: string;
  campusId?: string;
  financialAccountId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  discount: number;
  scholarship: number;
  waiver: number;
  lateFee: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  version: string;
  charges: string[]; // chargeIds
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  paymentId: string;
  tenantId: string;
  campusId?: string;
  financialAccountId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  paymentReference: string; // Idempotency key
  gatewayReference?: string;
  receiptNumber?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  initiatedAt: string;
  completedAt?: string;
  receivedBy: string;
  gateway?: string;
  gatewayResponseReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAllocation {
  allocationId: string;
  paymentId: string;
  chargeId?: string;
  invoiceId: string;
  amount: number;
  currency: string;
  allocatedAt: string;
  allocatedBy: string;
}

export interface Refund {
  refundId: string;
  paymentId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  financialAccountId: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  requestedBy: string;
  approvedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialHold {
  holdId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  financialAccountId: string;
  type: string; // e.g. OVERDUE_BALANCE, UNPAID_FEE
  reason: string;
  amount: number;
  status: HoldStatus;
  createdAt: string;
  releasedAt?: string;
  releasedBy?: string;
}

export interface Concession {
  concessionId: string;
  tenantId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  feeComponentId?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  reason: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface Scholarship {
  scholarshipId: string;
  tenantId: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  name: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  amount: number; // or percentage value
  percentage?: number;
  sponsor?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  approvedBy?: string;
  createdAt: string;
}
