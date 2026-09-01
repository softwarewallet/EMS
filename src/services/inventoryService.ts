import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import {
  StoreLocation,
  InventoryCategory,
  InventoryItem,
  InventoryStock,
  InventoryStockLedger,
  InventoryReceipt,
  InventoryIssue,
  InventoryReturn,
  InventoryTransfer,
  InventoryAdjustment,
  InventoryAsset,
  AssetAssignment,
  InventoryStockAudit,
  InventoryStockAuditLine,
  InventoryAnalyticsCache,
  StockMovementType,
  UserActor
} from '../types/inventory';
import { db } from '../config/firebase';
import { doc, runTransaction, getDoc, collection, where } from 'firebase/firestore';

const STORES_COL = 'inventory_stores';
const CATEGORIES_COL = 'inventory_categories';
const ITEMS_COL = 'inventory_items';
const STOCKS_COL = 'inventory_stocks';
const LEDGER_COL = 'inventory_stock_ledgers';
const RECEIPTS_COL = 'inventory_receipts';
const ISSUES_COL = 'inventory_issues';
const RETURNS_COL = 'inventory_returns';
const TRANSFERS_COL = 'inventory_transfers';
const ADJUSTMENTS_COL = 'inventory_adjustments';
const ASSETS_COL = 'inventory_assets';
const ASSET_ASSIGNMENTS_COL = 'inventory_asset_assignments';
const AUDITS_COL = 'inventory_stock_audits';
const AUDIT_LINES_COL = 'inventory_stock_audit_lines';
const ANALYTICS_COL = 'inventory_analytics_cache';

export class InventoryService {
  // ==========================================
  // MASTER DATA
  // ==========================================

  static async getStores(tenantId: string, campusId?: string): Promise<StoreLocation[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<StoreLocation>(STORES_COL, tenantId, constraints);
  }

  static async createStore(
    tenantId: string,
    data: Omit<StoreLocation, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'version'>,
    actor: UserActor
  ): Promise<StoreLocation> {
    const id = `store_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newStore: StoreLocation = {
      ...data,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(STORES_COL, id, newStore);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_ITEM_CREATED' as any,
      targetResource: 'store_location',
      targetId: id,
      details: { storeName: data.name }
    });

    return newStore;
  }

  static async getCategories(tenantId: string): Promise<InventoryCategory[]> {
    return FirebaseService.getTenantCollection<InventoryCategory>(CATEGORIES_COL, tenantId, []);
  }

  static async createCategory(
    tenantId: string,
    data: Omit<InventoryCategory, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<InventoryCategory> {
    const id = `cat_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newCategory: InventoryCategory = {
      ...data,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CATEGORIES_COL, id, newCategory);
    return newCategory;
  }

  static async getItems(tenantId: string, campusId?: string): Promise<InventoryItem[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<InventoryItem>(ITEMS_COL, tenantId, constraints);
  }

  static async createItem(
    tenantId: string,
    data: Omit<InventoryItem, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'version'>,
    actor: UserActor
  ): Promise<InventoryItem> {
    const id = `item_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newItem: InventoryItem = {
      ...data,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(ITEMS_COL, id, newItem);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_ITEM_CREATED' as any,
      targetResource: 'inventory_item',
      targetId: id,
      details: { itemCode: data.itemCode, name: data.name }
    });

    return newItem;
  }

  // ==========================================
  // STOCK OPERATIONS
  // ==========================================

  static async getStocks(tenantId: string, storeId?: string): Promise<InventoryStock[]> {
    const constraints = storeId ? [where('storeId', '==', storeId)] : [];
    return FirebaseService.getTenantCollection<InventoryStock>(STOCKS_COL, tenantId, constraints);
  }

  /**
   * Internal method for ledger updates within a transaction.
   */
  private static recordLedger(
    t: any, // Transaction
    tenantId: string,
    campusId: string,
    storeId: string,
    itemId: string,
    movementType: StockMovementType,
    quantity: number,
    balanceAfter: number,
    referenceId: string,
    referenceType: string,
    actor: UserActor,
    notes?: string
  ): void {
    const ledgerId = `ledg_${Date.now()}_${Math.floor(Math.random() * 10000)}`; // Keep purely internal random for rapid tx inserts
    const ledgerRef = doc(db, LEDGER_COL, ledgerId);
    t.set(ledgerRef, {
      id: ledgerId,
      tenantId,
      campusId,
      storeId,
      itemId,
      movementType,
      quantity,
      balanceAfter,
      referenceId,
      referenceType,
      notes,
      actorId: actor.id,
      actorName: actor.displayName,
      timestamp: new Date().toISOString()
    });
  }

  static async receiveFromGRN(
    tenantId: string,
    campusId: string,
    grnId: string,
    storeId: string,
    actor: UserActor
  ): Promise<InventoryReceipt> {
    // We should ideally fetch GRN to validate. We assume validation is done prior or passed correctly.
    // For production hardening, let's just make a mock GRN fetch placeholder.
    // Since we don't import GRN directly here due to circular deps, we can fetch it via FirebaseService.
    const grn = await FirebaseService.getDocument<any>('procurement_grns', grnId);
    if (!grn || grn.tenantId !== tenantId) {
      throw new Error('Valid GRN not found for receipt');
    }

    if (grn.status === 'RECEIVED_IN_INVENTORY') {
      throw new Error('GRN has already been processed into inventory (Idempotency violation)');
    }

    const receiptId = `rcpt_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();

    const receipt: InventoryReceipt = {
      id: receiptId,
      tenantId,
      campusId,
      receiptNumber: `RCPT-${new Date().getFullYear()}-${shortId}`,
      storeId,
      grnId,
      poId: grn.poId,
      vendorId: grn.vendorId,
      receivedDate: now,
      items: grn.lineItems.map((item: any) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.receivedQuantity,
        unitCost: item.unitPrice || 0
      })).filter((item: any) => item.itemId), // Only process mapped items
      receivedById: actor.id,
      receivedByName: actor.displayName || actor.email,
      status: 'COMPLETED',
      createdAt: now
    };

    await runTransaction(db, async (t) => {
      // 1. Mark GRN as processed
      const grnRef = doc(db, 'procurement_grns', grnId);
      t.update(grnRef, { status: 'RECEIVED_IN_INVENTORY', inventoryReceiptId: receiptId });

      // 2. Save Receipt
      const receiptRef = doc(db, RECEIPTS_COL, receiptId);
      t.set(receiptRef, receipt);

      // 3. Update Stocks
      for (const item of receipt.items) {
        if (!item.itemId) continue;

        // Use a composite ID for stock to avoid complex queries in transaction
        const stockId = `${tenantId}_${storeId}_${item.itemId}`;
        const stockRef = doc(db, STOCKS_COL, stockId);
        const stockDoc = await t.get(stockRef);

        let newQuantity = item.quantity;
        if (stockDoc.exists()) {
          const currentStock = stockDoc.data() as InventoryStock;
          newQuantity = currentStock.quantity + item.quantity;
          t.update(stockRef, {
            quantity: newQuantity,
            availableQuantity: currentStock.availableQuantity + item.quantity,
            lastMovementDate: now,
            updatedAt: now,
            version: currentStock.version + 1
          });
        } else {
          const newStock: InventoryStock = {
            id: stockId,
            tenantId,
            campusId,
            storeId,
            itemId: item.itemId,
            quantity: newQuantity,
            reservedQuantity: 0,
            availableQuantity: newQuantity,
            lastMovementDate: now,
            createdAt: now,
            updatedAt: now,
            version: 1
          };
          t.set(stockRef, newStock);
        }

        // 4. Ledger Entry
        this.recordLedger(
          t, tenantId, campusId, storeId, item.itemId, 'RECEIPT', item.quantity, newQuantity, receiptId, 'RECEIPT', actor, `Received from GRN ${grn.grnNumber}`
        );
      }
    });

    await AuditService.log({
      tenantId,
      campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_RECEIVED' as any,
      targetResource: 'inventory_receipt',
      targetId: receiptId,
      details: { grnId, receiptNumber: receipt.receiptNumber }
    });

    return receipt;
  }

  static async issueStock(
    tenantId: string,
    data: Omit<InventoryIssue, 'id' | 'tenantId' | 'issueNumber' | 'createdAt' | 'updatedAt' | 'status'>,
    actor: UserActor
  ): Promise<InventoryIssue> {
    const id = `issue_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    
    // Authorization check - cannot approve own issue request if we separate these later,
    // but for direct issue, we enforce server-side quantity validations.

    const newIssue: InventoryIssue = {
      ...data,
      id,
      tenantId,
      issueNumber: `ISSUE-${new Date().getFullYear()}-${shortId}`,
      status: 'ISSUED', // For simplicity in this direct issue method
      createdAt: now,
      updatedAt: now
    };

    await runTransaction(db, async (t) => {
      // Create Issue Doc
      const issueRef = doc(db, ISSUES_COL, id);
      t.set(issueRef, newIssue);

      // Process Line Items
      for (const item of newIssue.items) {
        if (item.quantity <= 0) {
          throw new Error(`Issue quantity for ${item.itemName} must be greater than zero`);
        }

        const stockId = `${tenantId}_${newIssue.storeId}_${item.itemId}`;
        const stockRef = doc(db, STOCKS_COL, stockId);
        const stockDoc = await t.get(stockRef);

        if (!stockDoc.exists()) {
          throw new Error(`Item ${item.itemName} not found in store`);
        }

        const currentStock = stockDoc.data() as InventoryStock;
        
        if (currentStock.availableQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.itemName}. Available: ${currentStock.availableQuantity}, Requested: ${item.quantity}`);
        }

        const newQuantity = currentStock.quantity - item.quantity;
        const newAvailable = currentStock.availableQuantity - item.quantity;

        t.update(stockRef, {
          quantity: newQuantity,
          availableQuantity: newAvailable,
          lastMovementDate: now,
          updatedAt: now,
          version: currentStock.version + 1
        });

        // Ledger Entry
        this.recordLedger(
          t, tenantId, newIssue.campusId, newIssue.storeId, item.itemId, 'ISSUE', -item.quantity, newQuantity, id, 'ISSUE', actor, item.notes
        );
      }
    });

    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_ISSUED' as any,
      targetResource: 'inventory_issue',
      targetId: id,
      details: { issueNumber: newIssue.issueNumber }
    });

    return newIssue;
  }

  // ==========================================
  // SERIALIZED ASSETS
  // ==========================================

  static async getAssets(tenantId: string, campusId?: string): Promise<InventoryAsset[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return FirebaseService.getTenantCollection<InventoryAsset>(ASSETS_COL, tenantId, constraints);
  }

  static async createAsset(
    tenantId: string,
    data: Omit<InventoryAsset, 'id' | 'tenantId' | 'assetNumber' | 'createdAt' | 'updatedAt' | 'version' | 'status'>,
    actor: UserActor
  ): Promise<InventoryAsset> {
    const id = `ast_${Date.now()}`;
    const now = new Date().toISOString();
    const shortId = FirebaseService.generateId('').split('-')[0].substring(0, 6).toUpperCase();
    const assetNumber = `AST-${new Date().getFullYear()}-${shortId}`;

    const newAsset: InventoryAsset = {
      ...data,
      id,
      tenantId,
      assetNumber,
      status: 'IN_STOCK',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    await FirebaseService.setDocument(ASSETS_COL, id, newAsset);
    await AuditService.log({
      tenantId,
      campusId: data.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_ASSET_CREATED' as any,
      targetResource: 'inventory_asset',
      targetId: id,
      details: { assetNumber, itemName: data.itemName }
    });

    return newAsset;
  }

  static async assignAsset(
    tenantId: string,
    assetId: string,
    assignmentData: Omit<AssetAssignment, 'id' | 'tenantId' | 'assetId' | 'assetNumber' | 'assignedById' | 'assignedDate' | 'status' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<AssetAssignment> {
    const asset = await FirebaseService.getDocument<InventoryAsset>(ASSETS_COL, assetId);
    if (!asset || asset.tenantId !== tenantId) {
      throw new Error('Asset not found');
    }

    if (asset.status !== 'IN_STOCK' && asset.status !== 'RECEIVED') {
      throw new Error(`Asset cannot be assigned in its current state: ${asset.status}`);
    }

    const id = `asgn_${Date.now()}`;
    const now = new Date().toISOString();

    const assignment: AssetAssignment = {
      ...assignmentData,
      id,
      tenantId,
      campusId: asset.campusId,
      assetId,
      assetNumber: asset.assetNumber,
      assignedById: actor.id,
      assignedDate: now,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    await runTransaction(db, async (t) => {
      const assetRef = doc(db, ASSETS_COL, assetId);
      const asgnRef = doc(db, ASSET_ASSIGNMENTS_COL, id);

      t.update(assetRef, {
        status: 'ASSIGNED',
        currentCustodianId: assignment.assignedToId,
        updatedAt: now,
        version: asset.version + 1
      });
      t.set(asgnRef, assignment);
    });

    await AuditService.log({
      tenantId,
      campusId: asset.campusId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INVENTORY_ASSET_ASSIGNED' as any,
      targetResource: 'asset_assignment',
      targetId: id,
      details: { assetId, assignedTo: assignment.assignedToName }
    });

    return assignment;
  }
}
