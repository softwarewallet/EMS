export type VendorStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'BLACKLISTED'
  | 'INACTIVE'
  | 'ARCHIVED';

export type VendorType = 'MANUFACTURER' | 'DISTRIBUTOR' | 'WHOLESALER' | 'SERVICE_PROVIDER' | 'CONTRACTOR' | 'OTHER';

export type ProcurementCategory =
  | 'ACADEMIC'
  | 'IT'
  | 'LIBRARY'
  | 'LAB'
  | 'TRANSPORT'
  | 'HOSTEL'
  | 'FOOD'
  | 'MEDICAL'
  | 'FACILITIES'
  | 'OFFICE'
  | 'SECURITY'
  | 'EVENTS'
  | 'OTHER';

export interface VendorProfile {
  id: string;
  tenantId: string;
  campusId?: string;
  legalName: string;
  displayName: string;
  vendorType: VendorType;
  category: ProcurementCategory;
  registrationNumber: string;
  taxId?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  status: VendorStatus;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type RequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CONVERTED_TO_REQUISITION'
  | 'CLOSED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY';

export interface ProcurementRequest {
  id: string;
  tenantId: string;
  campusId: string;
  requestNumber: string;
  requestingDepartment: string;
  requestedBy: {
    userId: string;
    name: string;
    email: string;
  };
  category: ProcurementCategory;
  priority: PriorityLevel;
  title: string;
  description: string;
  justification: string;
  estimatedAmount: number;
  requiredByDate: string;
  sourceModule?: string;
  sourceReferenceId?: string;
  status: RequestStatus;
  approvalState: {
    currentApproverId?: string;
    comments?: string;
    history: Array<{
      action: string;
      actorId: string;
      actorName: string;
      timestamp: string;
      comment?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RequisitionLineItem {
  id: string;
  itemCode?: string;
  itemName: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  preferredVendorId?: string;
}

export interface PurchaseRequisition {
  id: string;
  tenantId: string;
  campusId: string;
  requisitionNumber: string;
  requestId?: string;
  department: string;
  lineItems: RequisitionLineItem[];
  totalEstimatedAmount: number;
  deliveryLocation: string;
  requiredDate: string;
  budgetReference?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_RFQ' | 'CONVERTED_TO_PO' | 'CLOSED';
  procurementOwner?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RFQVendorInvite {
  vendorId: string;
  vendorName: string;
  email: string;
  status: 'INVITED' | 'ACKNOWLEDGED' | 'SUBMITTED' | 'DECLINED';
  invitedAt: string;
}

export interface RequestForQuotation {
  id: string;
  tenantId: string;
  campusId: string;
  rfqNumber: string;
  requisitionId?: string;
  title: string;
  description: string;
  submissionDeadline: string;
  deliveryTerms: string;
  paymentTerms: string;
  invitedVendors: RFQVendorInvite[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface QuotationLineItem {
  itemId?: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  taxPercent: number;
  discountPercent: number;
}

export interface VendorQuotation {
  id: string;
  tenantId: string;
  campusId: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  quoteNumber: string;
  quoteDate: string;
  validityDate: string;
  currency: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  deliveryCharges: number;
  totalAmount: number;
  deliveryTerms: string;
  paymentTerms: string;
  warrantyMonths: number;
  notes?: string;
  documentRef?: string;
  status: 'SUBMITTED' | 'LOCKED' | 'SELECTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface VendorComparisonEntry {
  vendorId: string;
  vendorName: string;
  quotationId: string;
  totalAmount: number;
  deliveryDays: number;
  warrantyMonths: number;
  technicalScore: number;
  commercialScore: number;
  weightedScore: number;
  selected: boolean;
  selectionNotes?: string;
}

export interface ComparativeStatement {
  id: string;
  tenantId: string;
  campusId: string;
  rfqId: string;
  statementNumber: string;
  entries: VendorComparisonEntry[];
  recommendedVendorId?: string;
  approvedBy?: string;
  approvalNotes?: string;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface POLineItem {
  itemId?: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxPercent: number;
  totalPrice: number;
}

export type POStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ISSUED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CLOSED'
  | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  campusId: string;
  poNumber: string;
  requisitionId?: string;
  quotationId?: string;
  vendorId: string;
  vendorName: string;
  lineItems: POLineItem[];
  subtotal: number;
  totalTax: number;
  shippingCharges: number;
  totalAmount: number;
  deliveryAddress: string;
  expectedDeliveryDate: string;
  paymentTerms: string;
  warrantyTerms: string;
  status: POStatus;
  approvalState: {
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
  };
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ReceiptLineItem {
  itemId?: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM';
  remarks?: string;
}

export interface GoodsReceipt {
  id: string;
  tenantId: string;
  campusId: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  receivedDate: string;
  receivedBy: {
    userId: string;
    name: string;
  };
  location: string;
  lineItems: ReceiptLineItem[];
  inspectionStatus: 'PENDING' | 'PASSED' | 'PARTIALLY_ACCEPTED' | 'FAILED' | 'REQUIRES_REVIEW';
  discrepancyNotes?: string;
  documentRef?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ServiceReceipt {
  id: string;
  tenantId: string;
  campusId: string;
  srnNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  servicePeriodFrom: string;
  servicePeriodTo: string;
  accepted: boolean;
  performanceNotes: string;
  verifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type InspectionStatus = 'PENDING' | 'PASSED' | 'PARTIALLY_ACCEPTED' | 'FAILED' | 'REQUIRES_REVIEW';

export interface QualityInspection {
  id: string;
  tenantId: string;
  campusId: string;
  inspectionNumber: string;
  grnId: string;
  poId: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  status: InspectionStatus;
  findings: string;
  correctiveActionsNeeded?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementReturn {
  id: string;
  tenantId: string;
  campusId: string;
  returnNumber: string;
  poId: string;
  grnId?: string;
  vendorId: string;
  vendorName: string;
  reason: string;
  quantity: number;
  itemDescription: string;
  authorizationRef: string;
  status: 'PENDING' | 'AUTHORIZED' | 'SHIPPED' | 'CREDIT_ISSUED' | 'REPLACED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface ProcurementContract {
  id: string;
  tenantId: string;
  campusId: string;
  contractNumber: string;
  title: string;
  vendorId: string;
  vendorName: string;
  effectiveDate: string;
  expiryDate: string;
  renewalDate?: string;
  contractValue: number;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'RENEWED';
  documentRef?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export type ExceptionType =
  | 'SINGLE_SOURCE'
  | 'EMERGENCY'
  | 'QUOTATION_WAIVER'
  | 'THRESHOLD_OVERRIDE'
  | 'PRICE_VARIANCE'
  | 'QUALITY_FAILURE'
  | 'LATE_DELIVERY';

export interface ProcurementException {
  id: string;
  tenantId: string;
  campusId: string;
  exceptionNumber: string;
  exceptionType: ExceptionType;
  referenceType: 'REQUEST' | 'REQUISITION' | 'PO' | 'RECEIPT' | 'QUOTATION';
  referenceId: string;
  referenceNumber: string;
  justification: string;
  authorizedBy: {
    userId: string;
    name: string;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
}

export interface VendorPerformanceMetrics {
  vendorId: string;
  vendorName: string;
  totalPOs: number;
  onTimeDeliveries: number;
  delayedDeliveries: number;
  acceptedReceipts: number;
  rejectedReceipts: number;
  fulfillmentRate: number;
  qualityScore: number;
  averageRating: number;
}

export interface ProcurementAnalyticsSummary {
  totalRequests: number;
  approvedRequests: number;
  pendingApprovals: number;
  activePOs: number;
  openRFQs: number;
  totalSpendYTD: number;
  spendByCategory: Record<string, number>;
  spendByCampus: Record<string, number>;
  openExceptions: number;
}
