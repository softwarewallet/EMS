// EMS Phase 7.18 — Procurement, Vendor & Purchase Management Service Engine

import {
  VendorProfile,
  ProcurementRequest,
  PurchaseRequisition,
  RequestForQuotation,
  VendorQuotation,
  ComparativeStatement,
  PurchaseOrder,
  GoodsReceipt,
  ServiceReceipt,
  QualityInspection,
  ProcurementReturn,
  ProcurementContract,
  ProcurementException,
  VendorPerformanceMetrics,
  ProcurementAnalyticsSummary,
  VendorStatus,
  RequestStatus,
  POStatus,
  InspectionStatus
} from '../types/procurement';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { where } from 'firebase/firestore';

const VENDORS_COL = 'procurement_vendors';
const REQUESTS_COL = 'procurement_requests';
const REQUISITIONS_COL = 'procurement_requisitions';
const RFQS_COL = 'procurement_rfqs';
const QUOTATIONS_COL = 'procurement_quotations';
const COMPARISONS_COL = 'procurement_comparisons';
const POS_COL = 'procurement_purchase_orders';
const GRNS_COL = 'procurement_grns';
const SRNS_COL = 'procurement_srns';
const INSPECTIONS_COL = 'procurement_inspections';
const RETURNS_COL = 'procurement_returns';
const CONTRACTS_COL = 'procurement_contracts';
const EXCEPTIONS_COL = 'procurement_exceptions';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export class ProcurementService {
  private static async logAudit(
    tenantId: string,
    actor: UserActor,
    action: any,
    resourceId: string,
    details: any
  ) {
    try {
      await AuditService.logAction(
        actor.id,
        actor.email || `${actor.id}@system.local`,
        actor.displayName || actor.id,
        action,
        'module' as any,
        resourceId,
        tenantId,
        details
      );
    } catch (e) {
      console.warn("Audit logging warning:", e);
    }
  }

  // ==========================================
  // VENDOR MANAGEMENT
  // ==========================================
  static async getVendors(tenantId: string, campusId?: string): Promise<VendorProfile[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<VendorProfile>(VENDORS_COL, tenantId, constraints);
  }

  static async createVendor(
    tenantId: string,
    data: Omit<VendorProfile, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'version'>,
    actor: UserActor
  ): Promise<VendorProfile> {
    const id = `vnd_${Date.now()}`;
    const now = new Date().toISOString();
    const newVendor: VendorProfile = {
      ...data,
      id,
      tenantId,
      status: data.status || 'DRAFT',
      verificationStatus: 'PENDING',
      riskRating: data.riskRating || 'MEDIUM',
      createdBy: actor.displayName || actor.email,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(VENDORS_COL, id, newVendor);
    await this.logAudit(tenantId, actor, 'VENDOR_CREATED', id, { legalName: data.legalName, category: data.category });

    return newVendor;
  }

  static async verifyVendor(
    tenantId: string,
    vendorId: string,
    status: 'VERIFIED' | 'REJECTED',
    actor: UserActor
  ): Promise<VendorProfile> {
    const existing = await FirebaseService.getDocument<VendorProfile>(VENDORS_COL, vendorId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Vendor not found');

    const updated: VendorProfile = {
      ...existing,
      verificationStatus: status,
      status: status === 'VERIFIED' ? 'VERIFIED' : existing.status,
      approvedBy: actor.displayName || actor.email,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1
    };

    await FirebaseService.setDocument(VENDORS_COL, vendorId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'VENDOR_VERIFIED',
      targetResource: 'vendor',
      targetId: vendorId,
      details: { verificationStatus: status }
    });

    return updated;
  }

  static async suspendVendor(
    tenantId: string,
    vendorId: string,
    reason: string,
    actor: UserActor
  ): Promise<VendorProfile> {
    const existing = await FirebaseService.getDocument<VendorProfile>(VENDORS_COL, vendorId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Vendor not found');

    const updated: VendorProfile = {
      ...existing,
      status: 'SUSPENDED',
      updatedAt: new Date().toISOString(),
      version: existing.version + 1
    };

    await FirebaseService.setDocument(VENDORS_COL, vendorId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'VENDOR_SUSPENDED',
      targetResource: 'vendor',
      targetId: vendorId,
      details: { reason }
    });

    return updated;
  }

  // ==========================================
  // PROCUREMENT REQUESTS
  // ==========================================
  static async getRequests(tenantId: string, campusId?: string): Promise<ProcurementRequest[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<ProcurementRequest>(REQUESTS_COL, tenantId, constraints);
  }

  static async createRequest(
    tenantId: string,
    data: Omit<ProcurementRequest, 'id' | 'tenantId' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status' | 'approvalState'>,
    actor: UserActor
  ): Promise<ProcurementRequest> {
    if (data.estimatedAmount < 0) {
      throw new Error('Estimated amount cannot be negative');
    }
    if (!data.justification || data.justification.trim() === '') {
      throw new Error('Justification is required for a procurement request');
    }

    const id = `req_${Date.now()}`;
    const now = new Date().toISOString();
    const requestNumber = `PRQ-${new Date().getFullYear()}-${FirebaseService.generateId("").split("-")[0].substring(0, 6).toUpperCase()}`;

    const newReq: ProcurementRequest = {
      ...data,
      id,
      tenantId,
      requestNumber,
      status: 'DRAFT',
      approvalState: {
        history: [
          {
            action: 'CREATED',
            actorId: actor.id,
            actorName: actor.displayName,
            timestamp: now,
            comment: 'Procurement request drafted'
          }
        ]
      },
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(REQUESTS_COL, id, newReq);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'REQUEST_CREATED',
      targetResource: 'procurement_request',
      targetId: id,
      details: { requestNumber, title: data.title }
    });

    return newReq;
  }

  static async submitRequest(tenantId: string, requestId: string, actor: UserActor): Promise<ProcurementRequest> {
    const existing = await FirebaseService.getDocument<ProcurementRequest>(REQUESTS_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Request not found');

    const now = new Date().toISOString();
    const updated: ProcurementRequest = {
      ...existing,
      status: 'SUBMITTED',
      approvalState: {
        ...existing.approvalState,
        history: [
          ...existing.approvalState.history,
          {
            action: 'SUBMITTED',
            actorId: actor.id,
            actorName: actor.displayName,
            timestamp: now,
            comment: 'Submitted for procurement review'
          }
        ]
      },
      updatedAt: now,
      version: existing.version + 1
    };

    await FirebaseService.setDocument(REQUESTS_COL, requestId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'REQUEST_SUBMITTED',
      targetResource: 'procurement_request',
      targetId: requestId
    });

    return updated;
  }

  static async approveRequest(tenantId: string, requestId: string, comment: string, actor: UserActor): Promise<ProcurementRequest> {
    const existing = await FirebaseService.getDocument<ProcurementRequest>(REQUESTS_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Request not found');

    // Prevent self-approval if actor is the requester
    if (existing.requestedBy.userId === actor.id) {
      throw new Error('Self-approval violation: Requester cannot approve their own procurement request');
    }

    const now = new Date().toISOString();
    const updated: ProcurementRequest = {
      ...existing,
      status: 'APPROVED',
      approvalState: {
        ...existing.approvalState,
        comments: comment,
        history: [
          ...existing.approvalState.history,
          {
            action: 'APPROVED',
            actorId: actor.id,
            actorName: actor.displayName,
            timestamp: now,
            comment: comment || 'Approved by procurement authority'
          }
        ]
      },
      updatedAt: now,
      version: existing.version + 1
    };

    await FirebaseService.setDocument(REQUESTS_COL, requestId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'REQUEST_APPROVED',
      targetResource: 'procurement_request',
      targetId: requestId
    });

    return updated;
  }

  static async rejectRequest(tenantId: string, requestId: string, reason: string, actor: UserActor): Promise<ProcurementRequest> {
    const existing = await FirebaseService.getDocument<ProcurementRequest>(REQUESTS_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Request not found');

    const now = new Date().toISOString();
    const updated: ProcurementRequest = {
      ...existing,
      status: 'REJECTED',
      approvalState: {
        ...existing.approvalState,
        comments: reason,
        history: [
          ...existing.approvalState.history,
          {
            action: 'REJECTED',
            actorId: actor.id,
            actorName: actor.displayName,
            timestamp: now,
            comment: reason
          }
        ]
      },
      updatedAt: now,
      version: existing.version + 1
    };

    await FirebaseService.setDocument(REQUESTS_COL, requestId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'REQUEST_REJECTED',
      targetResource: 'procurement_request',
      targetId: requestId,
      details: { reason }
    });

    return updated;
  }

  // ==========================================
  // PURCHASE REQUISITIONS
  // ==========================================
  static async getRequisitions(tenantId: string, campusId?: string): Promise<PurchaseRequisition[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<PurchaseRequisition>(REQUISITIONS_COL, tenantId, constraints);
  }

  static async createRequisition(
    tenantId: string,
    data: Omit<PurchaseRequisition, 'id' | 'tenantId' | 'requisitionNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<PurchaseRequisition> {
    if (!data.lineItems || data.lineItems.length === 0) {
      throw new Error('Requisition must have at least one line item');
    }

    let calculatedTotal = 0;
    for (const item of data.lineItems) {
      if (item.quantity <= 0) throw new Error(`Invalid quantity for item ${item.itemName}`);
      if (item.estimatedUnitPrice < 0) throw new Error(`Invalid unit price for item ${item.itemName}`);
      
      const itemTotal = item.quantity * item.estimatedUnitPrice;
      if (Math.abs(item.estimatedTotal - itemTotal) > 0.05) {
        throw new Error(`Invalid estimated total for item ${item.itemName}. Expected approximately ${itemTotal.toFixed(2)}`);
      }
      calculatedTotal += itemTotal;
    }

    if (Math.abs(data.totalEstimatedAmount - calculatedTotal) > 0.05) {
      throw new Error(`Invalid total estimated amount. Expected approximately ${calculatedTotal.toFixed(2)}`);
    }

    const id = `reqn_${Date.now()}`;
    const now = new Date().toISOString();
    const requisitionNumber = `REQ-${new Date().getFullYear()}-${FirebaseService.generateId("").split("-")[0].substring(0, 6).toUpperCase()}`;

    const newReqn: PurchaseRequisition = {
      ...data,
      id,
      tenantId,
      requisitionNumber,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(REQUISITIONS_COL, id, newReqn);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'REQUISITION_CREATED' as any,
      targetResource: 'purchase_requisition',
      targetId: id,
      details: { requisitionNumber }
    });

    return newReqn;
  }

  // ==========================================
  // RFQS & QUOTATIONS
  // ==========================================
  static async getRFQs(tenantId: string, campusId?: string): Promise<RequestForQuotation[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<RequestForQuotation>(RFQS_COL, tenantId, constraints);
  }

  static async createRFQ(
    tenantId: string,
    data: Omit<RequestForQuotation, 'id' | 'tenantId' | 'rfqNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<RequestForQuotation> {
    const id = `rfq_${Date.now()}`;
    const now = new Date().toISOString();
    const rfqNumber = `RFQ-${new Date().getFullYear()}-${FirebaseService.generateId("").split("-")[0].substring(0, 6).toUpperCase()}`;

    const newRFQ: RequestForQuotation = {
      ...data,
      id,
      tenantId,
      rfqNumber,
      status: 'PUBLISHED',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(RFQS_COL, id, newRFQ);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RFQ_CREATED',
      targetResource: 'rfq',
      targetId: id,
      details: { rfqNumber }
    });

    return newRFQ;
  }

  static async getQuotations(tenantId: string, campusId?: string): Promise<VendorQuotation[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<VendorQuotation>(QUOTATIONS_COL, tenantId, constraints);
  }

  static async submitQuotation(
    tenantId: string,
    data: Omit<VendorQuotation, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<VendorQuotation> {
    if (!data.lineItems || data.lineItems.length === 0) {
      throw new Error('Quotation must have at least one line item');
    }

    let calculatedSubtotal = 0;
    let calculatedTax = 0;
    let calculatedDiscount = 0;

    for (const item of data.lineItems) {
      if (item.quantity <= 0) throw new Error(`Invalid quantity for item ${item.itemName}`);
      if (item.unitPrice < 0) throw new Error(`Invalid unit price for item ${item.itemName}`);
      if (item.taxPercent < 0 || item.taxPercent > 100) throw new Error(`Invalid tax percent for item ${item.itemName}`);
      if (item.discountPercent < 0 || item.discountPercent > 100) throw new Error(`Invalid discount percent for item ${item.itemName}`);

      // Basic safe float calculation by rounding to 4 decimals intermediate, 2 final
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = itemSubtotal * (item.discountPercent / 100);
      const itemTax = (itemSubtotal - itemDiscount) * (item.taxPercent / 100);
      const itemTotal = itemSubtotal - itemDiscount + itemTax;
      
      if (Math.abs(item.totalPrice - itemTotal) > 0.05) {
        throw new Error(`Invalid total price for item ${item.itemName}. Expected approximately ${itemTotal.toFixed(2)}`);
      }

      calculatedSubtotal += itemSubtotal;
      calculatedDiscount += itemDiscount;
      calculatedTax += itemTax;
    }

    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedTax + (data.deliveryCharges || 0);
    if (Math.abs(data.totalAmount - calculatedTotal) > 0.05) {
      throw new Error(`Invalid total amount. Expected approximately ${calculatedTotal.toFixed(2)}`);
    }

    const id = `quot_${Date.now()}`;
    const now = new Date().toISOString();
    const newQuote: VendorQuotation = {
      ...data,
      id,
      tenantId,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(QUOTATIONS_COL, id, newQuote);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'QUOTATION_SUBMITTED' as any,
      targetResource: 'vendor_quotation',
      targetId: id,
      details: { quoteNumber: data.quoteNumber, vendorId: data.vendorId }
    });

    return newQuote;
  }

  // ==========================================
  // COMPARATIVE STATEMENTS
  // ==========================================
  static async getComparativeStatements(tenantId: string, campusId?: string): Promise<ComparativeStatement[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<ComparativeStatement>(COMPARISONS_COL, tenantId, constraints);
  }

  static async createComparison(
    tenantId: string,
    data: Omit<ComparativeStatement, 'id' | 'tenantId' | 'statementNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<ComparativeStatement> {
    if (!data.entries || data.entries.length === 0) {
      throw new Error('Comparative statement must have at least one entry');
    }
    
    // Server-side validation for tie-breaking
    const maxScore = Math.max(...data.entries.map(e => e.weightedScore));
    const topScorers = data.entries.filter(e => Math.abs(e.weightedScore - maxScore) < 0.01);
    
    const selectedEntries = data.entries.filter(e => e.selected);
    if (selectedEntries.length > 1) {
      throw new Error('Only one vendor can be selected for recommendation');
    }
    
    if (selectedEntries.length === 1 && topScorers.length > 1) {
      // It's a tie, explicitly require notes
      if (!selectedEntries[0].selectionNotes || selectedEntries[0].selectionNotes.trim() === '') {
        throw new Error('Explicit selection notes are required when there is a tie in weighted scores');
      }
    }

    const id = `cmp_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const statementNumber = `CMP-${new Date().getFullYear()}-${shortId}`;

    const newCmp: ComparativeStatement = {
      ...data,
      id,
      tenantId,
      statementNumber,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(COMPARISONS_COL, id, newCmp);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPARISON_CREATED' as any,
      targetResource: 'comparative_statement',
      targetId: id,
      details: { statementNumber }
    });

    return newCmp;
  }

  // ==========================================
  // PURCHASE ORDERS
  // ==========================================
  static async getPurchaseOrders(tenantId: string, campusId?: string): Promise<PurchaseOrder[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<PurchaseOrder>(POS_COL, tenantId, constraints);
  }

  static async createPO(
    tenantId: string,
    data: Omit<PurchaseOrder, 'id' | 'tenantId' | 'poNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<PurchaseOrder> {
    const id = `po_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const poNumber = `PO-${new Date().getFullYear()}-${shortId}`;

    const newPO: PurchaseOrder = {
      ...data,
      id,
      tenantId,
      poNumber,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(POS_COL, id, newPO);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PO_CREATED',
      targetResource: 'purchase_order',
      targetId: id,
      details: { poNumber, totalAmount: data.totalAmount }
    });

    return newPO;
  }

  static async approvePO(tenantId: string, poId: string, comment: string, actor: UserActor): Promise<PurchaseOrder> {
    const existing = await FirebaseService.getDocument<PurchaseOrder>(POS_COL, poId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Purchase order not found');

    if (existing.status !== 'DRAFT' && existing.status !== 'UNDER_REVIEW') {
      throw new Error('PO cannot be approved in its current state');
    }

    const now = new Date().toISOString();
    const updated: PurchaseOrder = {
      ...existing,
      status: 'APPROVED',
      approvalState: {
        approvedBy: actor.displayName || actor.email,
        approvedAt: now,
        comments: comment
      },
      updatedAt: now,
      version: existing.version + 1
    };

    await FirebaseService.setDocument(POS_COL, poId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PO_APPROVED' as any,
      targetResource: 'purchase_order',
      targetId: poId,
      details: { comment }
    });

    return updated;
  }

  static async issuePO(tenantId: string, poId: string, actor: UserActor): Promise<PurchaseOrder> {
    const existing = await FirebaseService.getDocument<PurchaseOrder>(POS_COL, poId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Purchase order not found');

    const now = new Date().toISOString();
    const updated: PurchaseOrder = {
      ...existing,
      status: 'ISSUED',
      issuedAt: now,
      updatedAt: now,
      version: existing.version + 1
    };

    await FirebaseService.setDocument(POS_COL, poId, updated);
    await AuditService.log({
      tenantId,
      campusId: existing.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'PO_ISSUED',
      targetResource: 'purchase_order',
      targetId: poId
    });

    return updated;
  }

  // ==========================================
  // GOODS & SERVICE RECEIPTS (GRN / SRN)
  // ==========================================
  static async getGoodsReceipts(tenantId: string, campusId?: string): Promise<GoodsReceipt[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<GoodsReceipt>(GRNS_COL, tenantId, constraints);
  }

  static async createGRN(
    tenantId: string,
    data: Omit<GoodsReceipt, 'id' | 'tenantId' | 'grnNumber' | 'createdAt' | 'updatedAt' | 'version'>,
    actor: UserActor
  ): Promise<GoodsReceipt> {
    const po = await FirebaseService.getDocument<PurchaseOrder>(POS_COL, data.poId);
    if (!po || po.tenantId !== tenantId) {
      throw new Error('Purchase order not found');
    }

    if (po.status !== 'ISSUED' && po.status !== 'PARTIALLY_RECEIVED') {
      throw new Error(`Cannot receive goods against a PO in ${po.status} state`);
    }

    // Validate over-receipt against PO line items
    for (const receiptItem of data.lineItems) {
      const poItem = po.lineItems.find(i => 
        (i.itemId && i.itemId === receiptItem.itemId) || 
        (!i.itemId && i.itemName === receiptItem.itemName)
      );
      
      if (!poItem) {
        throw new Error(`Item ${receiptItem.itemName} is not part of the Purchase Order`);
      }
      
      // In a real system we'd track cumulative received quantities. For this check, we'll
      // prevent a single GRN from exceeding the PO quantity if cumulative logic isn't fully implemented.
      if (receiptItem.receivedQuantity > poItem.quantity) {
        throw new Error(`Received quantity (${receiptItem.receivedQuantity}) for ${receiptItem.itemName} exceeds ordered quantity (${poItem.quantity})`);
      }
    }

    const id = `grn_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const grnNumber = `GRN-${new Date().getFullYear()}-${shortId}`;

    const newGRN: GoodsReceipt = {
      ...data,
      id,
      tenantId,
      grnNumber,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(GRNS_COL, id, newGRN);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RECEIPT_CREATED' as any,
      targetResource: 'goods_receipt',
      targetId: id,
      details: { grnNumber, poNumber: data.poNumber }
    });

    return newGRN;
  }

  // ==========================================
  // QUALITY INSPECTIONS
  // ==========================================
  static async getInspections(tenantId: string, campusId?: string): Promise<QualityInspection[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<QualityInspection>(INSPECTIONS_COL, tenantId, constraints);
  }

  static async createInspection(
    tenantId: string,
    data: Omit<QualityInspection, 'id' | 'tenantId' | 'inspectionNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<QualityInspection> {
    const id = `insp_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const inspectionNumber = `INSP-${new Date().getFullYear()}-${shortId}`;

    const newInsp: QualityInspection = {
      ...data,
      id,
      tenantId,
      inspectionNumber,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INSPECTIONS_COL, id, newInsp);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INSPECTION_COMPLETED' as any,
      targetResource: 'quality_inspection',
      targetId: id,
      details: { inspectionNumber, status: data.status }
    });

    return newInsp;
  }

  // ==========================================
  // RETURNS / REJECTIONS
  // ==========================================
  static async getReturns(tenantId: string, campusId?: string): Promise<ProcurementReturn[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<ProcurementReturn>(RETURNS_COL, tenantId, constraints);
  }

  static async createReturn(
    tenantId: string,
    data: Omit<ProcurementReturn, 'id' | 'tenantId' | 'returnNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<ProcurementReturn> {
    if (data.grnId) {
      const grn = await FirebaseService.getDocument<GoodsReceipt>(GRNS_COL, data.grnId);
      if (!grn || grn.tenantId !== tenantId) throw new Error('GRN not found');
      
      const item = grn.lineItems.find(i => i.itemName === data.itemDescription);
      if (!item) {
        throw new Error(`Item ${data.itemDescription} not found in GRN`);
      }

      if (data.quantity > item.receivedQuantity) {
        throw new Error(`Return quantity (${data.quantity}) cannot exceed received quantity (${item.receivedQuantity})`);
      }
    } else {
      const po = await FirebaseService.getDocument<PurchaseOrder>(POS_COL, data.poId);
      if (!po || po.tenantId !== tenantId) throw new Error('Purchase order not found');

      const item = po.lineItems.find(i => i.itemName === data.itemDescription);
      if (!item) {
        throw new Error(`Item ${data.itemDescription} not found in Purchase Order`);
      }
      
      if (data.quantity > item.quantity) {
        throw new Error(`Return quantity (${data.quantity}) cannot exceed ordered quantity (${item.quantity})`);
      }
    }

    const id = `ret_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const returnNumber = `RET-${new Date().getFullYear()}-${shortId}`;

    const newRet: ProcurementReturn = {
      ...data,
      id,
      tenantId,
      returnNumber,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(RETURNS_COL, id, newRet);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RETURN_CREATED' as any,
      targetResource: 'procurement_return',
      targetId: id,
      details: { returnNumber }
    });

    return newRet;
  }

  // ==========================================
  // CONTRACT MANAGEMENT
  // ==========================================
  static async getContracts(tenantId: string, campusId?: string): Promise<ProcurementContract[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<ProcurementContract>(CONTRACTS_COL, tenantId, constraints);
  }

  static async createContract(
    tenantId: string,
    data: Omit<ProcurementContract, 'id' | 'tenantId' | 'contractNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<ProcurementContract> {
    const id = `cnt_${Date.now()}`;
    const now = new Date().toISOString();
    const contractNumber = `CNT-${new Date().getFullYear()}-${FirebaseService.generateId("").split("-")[0].substring(0, 6).toUpperCase()}`;

    const newCnt: ProcurementContract = {
      ...data,
      id,
      tenantId,
      contractNumber,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CONTRACTS_COL, id, newCnt);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'CONTRACT_CREATED',
      targetResource: 'procurement_contract',
      targetId: id,
      details: { contractNumber }
    });

    return newCnt;
  }

  // ==========================================
  // EXCEPTIONS
  // ==========================================
  static async getExceptions(tenantId: string, campusId?: string): Promise<ProcurementException[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<ProcurementException>(EXCEPTIONS_COL, tenantId, constraints);
  }

  static async createException(
    tenantId: string,
    data: Omit<ProcurementException, 'id' | 'tenantId' | 'exceptionNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<ProcurementException> {
    const id = `exc_${Date.now()}`;
    const now = new Date().toISOString();
    const exceptionNumber = `EXC-${new Date().getFullYear()}-${FirebaseService.generateId("").split("-")[0].substring(0, 6).toUpperCase()}`;

    const newExc: ProcurementException = {
      ...data,
      id,
      tenantId,
      exceptionNumber,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(EXCEPTIONS_COL, id, newExc);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'EXCEPTION_CREATED',
      targetResource: 'procurement_exception',
      targetId: id,
      details: { exceptionNumber, exceptionType: data.exceptionType }
    });

    return newExc;
  }

  // ==========================================
  // ANALYTICS & PERFORMANCE PROJECTIONS
  // ==========================================
  static async getAnalyticsSummary(tenantId: string, campusId?: string): Promise<ProcurementAnalyticsSummary> {
    const [requests, pos, rfqs, exceptions] = await Promise.all([
      this.getRequests(tenantId, campusId),
      this.getPurchaseOrders(tenantId, campusId),
      this.getRFQs(tenantId, campusId),
      this.getExceptions(tenantId, campusId)
    ]);

    const totalRequests = requests.length;
    const approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
    const pendingApprovals = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
    const activePOs = pos.filter(p => p.status === 'ISSUED' || p.status === 'PARTIALLY_RECEIVED').length;
    const openRFQs = rfqs.filter(r => r.status === 'PUBLISHED').length;

    let totalSpendYTD = 0;
    const spendByCategory: Record<string, number> = {};
    const spendByCampus: Record<string, number> = {};

    pos.forEach(po => {
      totalSpendYTD += po.totalAmount || 0;
      spendByCampus[po.campusId] = (spendByCampus[po.campusId] || 0) + po.totalAmount;
    });

    return {
      totalRequests,
      approvedRequests,
      pendingApprovals,
      activePOs,
      openRFQs,
      totalSpendYTD,
      spendByCategory,
      spendByCampus,
      openExceptions: exceptions.length
    };
  }
}
