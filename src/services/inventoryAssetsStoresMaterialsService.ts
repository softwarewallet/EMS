import {
  InventoryItem,
  InventoryCategory,
  InventorySubcategory,
  UnitOfMeasure,
  StoreLocation,
  StorageBin,
  StockBalance,
  StockLot,
  SerialNumberRecord,
  InventoryReceipt,
  InventoryReceiptLine,
  StockIssue,
  StockIssueLine,
  StockReturn,
  StockReturnLine,
  StockTransfer,
  StockTransferLine,
  StockReservation,
  StockAdjustment,
  InventoryCount,
  InventoryCountLine,
  InventoryReconciliation,
  ReorderRule,
  InventoryException,
  Asset,
  AssetCategory,
  AssetAssignment,
  AssetCustody,
  AssetTransfer,
  AssetMaintenanceReference,
  AssetDisposalRequest,
  InventoryMaterialsAuditEvent,
  InventorySimulationScenario,
  StoreLifecycleStatus,
  ReceiptLifecycleStatus,
  IssueLifecycleStatus,
  ReturnLifecycleStatus,
  TransferLifecycleStatus,
  ReservationStatus,
  AdjustmentStatus,
  AdjustmentType,
  CountLifecycleStatus,
  OperationalAssetLifecycleState,
  AssetAssignmentStatus,
  AssetTransferStatus,
  AssetDisposalStatus,
  InventoryExceptionType
} from '../types/inventoryAssetsStoresMaterials';

class InventoryAssetsStoresMaterialsService {
  private items: InventoryItem[] = [];
  private categories: InventoryCategory[] = [];
  private subcategories: InventorySubcategory[] = [];
  private uoms: UnitOfMeasure[] = [];
  private stores: StoreLocation[] = [];
  private bins: StorageBin[] = [];
  private balances: StockBalance[] = [];
  private lots: StockLot[] = [];
  private serials: SerialNumberRecord[] = [];
  private receipts: InventoryReceipt[] = [];
  private issues: StockIssue[] = [];
  private returns: StockReturn[] = [];
  private transfers: StockTransfer[] = [];
  private reservations: StockReservation[] = [];
  private adjustments: StockAdjustment[] = [];
  private counts: InventoryCount[] = [];
  private reconciliations: InventoryReconciliation[] = [];
  private reorderRules: ReorderRule[] = [];
  private exceptions: InventoryException[] = [];
  private assets: Asset[] = [];
  private assetCategories: AssetCategory[] = [];
  private assignments: AssetAssignment[] = [];
  private custodies: AssetCustody[] = [];
  private assetTransfers: AssetTransfer[] = [];
  private maintenanceRefs: AssetMaintenanceReference[] = [];
  private disposals: AssetDisposalRequest[] = [];
  private auditEvents: InventoryMaterialsAuditEvent[] = [];
  private idempotencyKeys: Set<string> = new Set();

  constructor() {
    this.seedInitialData();
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
  }

  private appendAudit(
    tenantId: string,
    actor: string,
    action: string,
    entityType: InventoryMaterialsAuditEvent['entityType'],
    entityId: string,
    payload: any
  ): InventoryMaterialsAuditEvent {
    const previousHash = this.auditEvents.length > 0 
      ? this.auditEvents[this.auditEvents.length - 1].hash 
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date().toISOString();
    const eventId = `AUDIT-INV-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const rawData = `${previousHash}|${tenantId}|${actor}|${action}|${entityType}|${entityId}|${timestamp}|${JSON.stringify(payload)}`;
    const hash = this.simpleHash(rawData);

    const event: InventoryMaterialsAuditEvent = {
      eventId,
      tenantId,
      actorUserIdRef: actor,
      action,
      entityType,
      entityId,
      timestamp,
      payload,
      previousHash,
      hash
    };

    this.auditEvents.push(event);
    return event;
  }

  private seedInitialData() {
    const defaultTenant = 'TENANT_INDIA_DEFAULT';
    const usTenant = 'TENANT_US_CAMPUS';
    const defaultCampus = 'CAMPUS_DELHI';
    const mumCampus = 'CAMPUS_MUMBAI';
    const usCampus = 'CAMPUS_NY';

    // Seed UOMs
    this.uoms.push(
      { uomId: 'UOM-EACH', code: 'EACH', name: 'Individual Units', tenantId: defaultTenant, isBaseUnit: true, conversionFactor: 1 },
      { uomId: 'UOM-BOX-10', code: 'BOX', name: 'Box of 10', tenantId: defaultTenant, isBaseUnit: false, baseUOMRef: 'UOM-EACH', conversionFactor: 10 },
      { uomId: 'UOM-PACK-50', code: 'PACK', name: 'Pack of 50', tenantId: defaultTenant, isBaseUnit: false, baseUOMRef: 'UOM-EACH', conversionFactor: 50 },
      { uomId: 'UOM-KG', code: 'KG', name: 'Kilograms', tenantId: defaultTenant, isBaseUnit: true, conversionFactor: 1 },
      { uomId: 'UOM-G', code: 'G', name: 'Grams', tenantId: defaultTenant, isBaseUnit: false, baseUOMRef: 'UOM-KG', conversionFactor: 0.001 },
      { uomId: 'UOM-L', code: 'L', name: 'Liters', tenantId: defaultTenant, isBaseUnit: true, conversionFactor: 1 },
      { uomId: 'UOM-ML', code: 'ML', name: 'Milliliters', tenantId: defaultTenant, isBaseUnit: false, baseUOMRef: 'UOM-L', conversionFactor: 0.001 },
      { uomId: 'UOM-SET', code: 'SET', name: 'Set', tenantId: defaultTenant, isBaseUnit: true, conversionFactor: 1 },
      // US UOMs
      { uomId: 'UOM-US-EACH', code: 'EACH', name: 'Individual Units (US)', tenantId: usTenant, isBaseUnit: true, conversionFactor: 1 }
    );

    // Seed Categories
    this.categories.push(
      { categoryId: 'CAT-STAT', code: 'STATIONERY', name: 'Academic & Office Stationery', tenantId: defaultTenant, isActive: true },
      { categoryId: 'CAT-LAB', code: 'LAB_CHEMICALS', name: 'Laboratory Consumables & Reagents', tenantId: defaultTenant, isActive: true },
      { categoryId: 'CAT-IT', code: 'IT_HARDWARE', name: 'IT Infrastructure & Computing', tenantId: defaultTenant, isActive: true },
      { categoryId: 'CAT-MED', code: 'MEDICAL', name: 'Campus Clinic & Medical Supplies', tenantId: defaultTenant, isActive: true },
      // US Tenant Category
      { categoryId: 'CAT-US-OFFICE', code: 'OFFICE_SUPPLIES', name: 'Office Supplies (US)', tenantId: usTenant, isActive: true }
    );

    // Seed Stores / Warehouses
    this.stores.push(
      {
        storeId: 'STR-DEL-MAIN',
        storeCode: 'DEL-WH-CENTRAL',
        name: 'Delhi Central Institutional Warehouse',
        tenantId: defaultTenant,
        campusIdRef: defaultCampus,
        capacityMax: 10000,
        currentUtilization: 4200,
        status: 'ACTIVE',
        securityClassification: 'HIGH_SECURITY',
        responsibleOfficerUserIdRef: 'USER_STORE_MGR_DELHI',
        isCentralWarehouse: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        storeId: 'STR-DEL-LAB',
        storeCode: 'DEL-STORE-LAB',
        name: 'Delhi Science Block Materials Store',
        tenantId: defaultTenant,
        campusIdRef: defaultCampus,
        capacityMax: 3000,
        currentUtilization: 1100,
        status: 'ACTIVE',
        securityClassification: 'HAZMAT',
        responsibleOfficerUserIdRef: 'USER_LAB_SUPV_DELHI',
        isCentralWarehouse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        storeId: 'STR-MUM-MAIN',
        storeCode: 'MUM-WH-CENTRAL',
        name: 'Mumbai Campus Regional Depot',
        tenantId: defaultTenant,
        campusIdRef: mumCampus,
        capacityMax: 8000,
        currentUtilization: 2500,
        status: 'ACTIVE',
        securityClassification: 'STANDARD',
        responsibleOfficerUserIdRef: 'USER_MUM_LOGISTICS',
        isCentralWarehouse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        storeId: 'STR-CLOSED-OLD',
        storeCode: 'DEL-OLD-ANNEX',
        name: 'Old Decommissioned Annex Store',
        tenantId: defaultTenant,
        campusIdRef: defaultCampus,
        capacityMax: 1000,
        currentUtilization: 0,
        status: 'CLOSED',
        securityClassification: 'STANDARD',
        responsibleOfficerUserIdRef: 'USER_OFFICER_RETIRED',
        isCentralWarehouse: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // US Tenant Store
      {
        storeId: 'STR-US-MAIN',
        storeCode: 'NY-WH-CENTRAL',
        name: 'New York Central Supply Depot',
        tenantId: usTenant,
        campusIdRef: usCampus,
        capacityMax: 5000,
        currentUtilization: 1800,
        status: 'ACTIVE',
        securityClassification: 'STANDARD',
        responsibleOfficerUserIdRef: 'USER_US_MGR',
        isCentralWarehouse: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Seed Storage Bins
    this.bins.push(
      { binId: 'BIN-DEL-A1', storeIdRef: 'STR-DEL-MAIN', tenantId: defaultTenant, binCode: 'A1-R01-S01', aisle: 'Aisle-A', rack: 'R01', shelf: 'S01', maxCapacity: 500, currentCapacity: 120, isActive: true },
      { binId: 'BIN-DEL-B2', storeIdRef: 'STR-DEL-MAIN', tenantId: defaultTenant, binCode: 'B2-R03-S02', aisle: 'Aisle-B', rack: 'R03', shelf: 'S02', maxCapacity: 300, currentCapacity: 85, isActive: true }
    );

    // Seed Items
    this.items.push(
      {
        itemId: 'ITEM-A4-PAPER',
        itemCode: 'MAT-STAT-001',
        name: 'A4 Copier Paper 75 GSM (Ream of 500)',
        description: 'High-speed copier paper for institutional printing & exam papers',
        categoryIdRef: 'CAT-STAT',
        uomIdRef: 'UOM-EACH',
        isConsumable: true,
        isSerialized: false,
        isBatchControlled: false,
        reorderThreshold: 100,
        minimumStock: 50,
        maximumStock: 1000,
        safetyStock: 80,
        standardCost: 280,
        isActive: true,
        tenantId: defaultTenant,
        permittedCampusScope: [defaultCampus, mumCampus],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        itemId: 'ITEM-NITRIC-ACID',
        itemCode: 'MAT-LAB-101',
        name: 'Nitric Acid AR Grade 69-71% (500ml)',
        description: 'Analytical reagent grade nitric acid for chemistry laboratory research',
        categoryIdRef: 'CAT-LAB',
        uomIdRef: 'UOM-L',
        isConsumable: true,
        isSerialized: false,
        isBatchControlled: true,
        reorderThreshold: 20,
        minimumStock: 10,
        maximumStock: 100,
        safetyStock: 15,
        standardCost: 1450,
        isActive: true,
        tenantId: defaultTenant,
        permittedCampusScope: [defaultCampus],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        itemId: 'ITEM-LAPTOP-THINKPAD',
        itemCode: 'MAT-IT-301',
        name: 'Faculty Workstation Laptop i7 32GB',
        description: 'Standard faculty and researcher high-performance computing laptop',
        categoryIdRef: 'CAT-IT',
        uomIdRef: 'UOM-EACH',
        isConsumable: false,
        isSerialized: true,
        isBatchControlled: false,
        reorderThreshold: 5,
        minimumStock: 2,
        maximumStock: 50,
        safetyStock: 5,
        standardCost: 85000,
        isActive: true,
        tenantId: defaultTenant,
        permittedCampusScope: [defaultCampus, mumCampus],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // US Tenant Item
      {
        itemId: 'ITEM-US-MARKERS',
        itemCode: 'MAT-US-001',
        name: 'Dry Erase Markers Assorted 12-Pack',
        description: 'Whiteboard markers for lecture halls',
        categoryIdRef: 'CAT-US-OFFICE',
        uomIdRef: 'UOM-US-EACH',
        isConsumable: true,
        isSerialized: false,
        isBatchControlled: false,
        reorderThreshold: 25,
        minimumStock: 10,
        maximumStock: 200,
        safetyStock: 20,
        standardCost: 18,
        isActive: true,
        tenantId: usTenant,
        permittedCampusScope: [usCampus],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Seed Stock Balances
    this.balances.push(
      {
        balanceId: 'BAL-DEL-PAPER',
        itemIdRef: 'ITEM-A4-PAPER',
        storeIdRef: 'STR-DEL-MAIN',
        tenantId: defaultTenant,
        onHand: 450,
        reserved: 50,
        available: 400, // 450 - 50 - 0 - 0
        damaged: 0,
        quarantined: 0,
        inTransit: 0,
        updatedAt: new Date().toISOString()
      },
      {
        balanceId: 'BAL-DEL-ACID',
        itemIdRef: 'ITEM-NITRIC-ACID',
        storeIdRef: 'STR-DEL-LAB',
        tenantId: defaultTenant,
        onHand: 35,
        reserved: 5,
        available: 25, // 35 - 5 - 5 (quarantined) - 0
        damaged: 0,
        quarantined: 5,
        inTransit: 0,
        updatedAt: new Date().toISOString()
      },
      {
        balanceId: 'BAL-DEL-LAPTOP',
        itemIdRef: 'ITEM-LAPTOP-THINKPAD',
        storeIdRef: 'STR-DEL-MAIN',
        tenantId: defaultTenant,
        onHand: 15,
        reserved: 2,
        available: 13,
        damaged: 0,
        quarantined: 0,
        inTransit: 0,
        updatedAt: new Date().toISOString()
      },
      // US Balance
      {
        balanceId: 'BAL-US-MARKERS',
        itemIdRef: 'ITEM-US-MARKERS',
        storeIdRef: 'STR-US-MAIN',
        tenantId: usTenant,
        onHand: 120,
        reserved: 10,
        available: 110,
        damaged: 0,
        quarantined: 0,
        inTransit: 0,
        updatedAt: new Date().toISOString()
      }
    );

    // Seed Lots
    this.lots.push(
      {
        lotId: 'LOT-NA-2025-01',
        itemIdRef: 'ITEM-NITRIC-ACID',
        storeIdRef: 'STR-DEL-LAB',
        tenantId: defaultTenant,
        lotNumber: 'NA-B25-994',
        manufactureDate: '2025-01-10T00:00:00.000Z',
        expiryDate: '2027-01-10T00:00:00.000Z',
        receivedDate: '2025-01-20T00:00:00.000Z',
        quantity: 30,
        status: 'USABLE',
        supplierIdRef: 'SUP-SIGMA-ALDRICH',
        purchaseOrderIdRef: 'PO-2025-LAB-01'
      },
      {
        lotId: 'LOT-NA-2023-EXP',
        itemIdRef: 'ITEM-NITRIC-ACID',
        storeIdRef: 'STR-DEL-LAB',
        tenantId: defaultTenant,
        lotNumber: 'NA-B23-012',
        manufactureDate: '2023-01-10T00:00:00.000Z',
        expiryDate: '2024-01-10T00:00:00.000Z', // Expired
        receivedDate: '2023-01-25T00:00:00.000Z',
        quantity: 5,
        status: 'EXPIRED',
        supplierIdRef: 'SUP-SIGMA-ALDRICH',
        purchaseOrderIdRef: 'PO-2023-LAB-99'
      }
    );

    // Seed Serials
    this.serials.push(
      {
        serialId: 'SER-TP-001',
        itemIdRef: 'ITEM-LAPTOP-THINKPAD',
        serialNumber: 'PF3A9901',
        tenantId: defaultTenant,
        storeIdRef: 'STR-DEL-MAIN',
        status: 'IN_STOCK',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        serialId: 'SER-TP-002',
        itemIdRef: 'ITEM-LAPTOP-THINKPAD',
        serialNumber: 'PF3A9902',
        tenantId: defaultTenant,
        storeIdRef: 'STR-DEL-MAIN',
        status: 'ASSIGNED',
        currentCustodyUserIdRef: 'EMP-FACULTY-01',
        registeredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Seed Asset Categories
    this.assetCategories.push(
      { categoryId: 'ACAT-COMP', code: 'COMPUTING', name: 'IT Computing & Workstations', depreciationMethod: 'STRAIGHT_LINE', usefulLifeMonths: 36, tenantId: defaultTenant, isActive: true },
      { categoryId: 'ACAT-LABEQ', code: 'LAB_EQUIP', name: 'Advanced Laboratory Equipment', depreciationMethod: 'STRAIGHT_LINE', usefulLifeMonths: 60, tenantId: defaultTenant, isActive: true }
    );

    // Seed Assets
    this.assets.push(
      {
        assetId: 'AST-DEL-001',
        assetCode: 'AST-IT-2025-001',
        name: 'Faculty Workstation Lenovo P16',
        description: 'Assigned to Dean of Science for computational astrophysics simulations',
        categoryIdRef: 'ACAT-COMP',
        tenantId: defaultTenant,
        campusIdRef: defaultCampus,
        status: 'ASSIGNED',
        purchaseCost: 145000,
        currentBookValue: 120000,
        serialNumber: 'PF3A9902',
        barCode: 'BC-AST-001',
        facilitySpaceIdRef: 'SP-102',
        financialAccountIdRef: 'ACC-FIXED-ASSET-01',
        costCenterIdRef: 'CC-SCIENCE-DELHI',
        supplierIdRef: 'SUP-LENOVO-INDIA',
        purchaseOrderIdRef: 'PO-2025-IT-004',
        acquisitionDate: '2025-01-15T00:00:00.000Z',
        warrantyExpiry: '2028-01-15T00:00:00.000Z',
        isDepreciated: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        assetId: 'AST-DEL-002',
        assetCode: 'AST-LAB-2024-089',
        name: 'Spectrophotometer UV-Vis 2600',
        description: 'Precision dual-beam spectrophotometer in Advanced Nuclear Lab',
        categoryIdRef: 'ACAT-LABEQ',
        tenantId: defaultTenant,
        campusIdRef: defaultCampus,
        status: 'IN_SERVICE',
        purchaseCost: 450000,
        currentBookValue: 380000,
        serialNumber: 'SHIM-UV-88210',
        barCode: 'BC-AST-002',
        facilitySpaceIdRef: 'SP-102',
        financialAccountIdRef: 'ACC-FIXED-ASSET-02',
        costCenterIdRef: 'CC-PHYSICS-DELHI',
        supplierIdRef: 'SUP-SHIMADZU',
        purchaseOrderIdRef: 'PO-2024-LAB-012',
        acquisitionDate: '2024-03-20T00:00:00.000Z',
        warrantyExpiry: '2027-03-20T00:00:00.000Z',
        isDepreciated: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Seed Asset Assignment
    this.assignments.push({
      assignmentId: 'ASG-AST-001',
      assetIdRef: 'AST-DEL-001',
      tenantId: defaultTenant,
      campusIdRef: defaultCampus,
      assignedToType: 'EMPLOYEE',
      assignedToIdRef: 'EMP-FACULTY-01',
      assignedByUserIdRef: 'USER_STORE_MGR_DELHI',
      approvedByUserIdRef: 'USER_DEAN_APPROVAL',
      status: 'ASSIGNED',
      issueDate: '2025-01-20T00:00:00.000Z',
      conditionOnIssue: 'EXCELLENT',
      acknowledgementNotes: 'Received in sealed box with charger and dock.',
      idempotencyKey: 'IDEM-ASG-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Seed Reorder Rules
    this.reorderRules.push({
      ruleId: 'RR-A4-PAPER',
      tenantId: defaultTenant,
      storeIdRef: 'STR-DEL-MAIN',
      itemIdRef: 'ITEM-A4-PAPER',
      minimumStock: 50,
      maximumStock: 1000,
      reorderPoint: 100,
      reorderQuantity: 300,
      autoReorderEnabled: true,
      preferredSupplierIdRef: 'SUP-ITC-PAPER',
      isActive: true
    });

    // Seed Initial Audit Event
    this.appendAudit(defaultTenant, 'SYSTEM_BOOTSTRAP', 'BOOTSTRAP', 'STORE', 'STR-DEL-MAIN', { msg: 'Phase 11.7 initial seed completed' });
  }

  // ==========================================
  // INVENTORY ITEMS & UOM
  // ==========================================
  public getItems(tenantId: string): InventoryItem[] {
    return this.items.filter(i => i.tenantId === tenantId);
  }

  public getItemById(itemId: string, tenantId: string): InventoryItem | undefined {
    return this.items.find(i => i.itemId === itemId && i.tenantId === tenantId);
  }

  public createItem(item: Omit<InventoryItem, 'createdAt' | 'updatedAt'>, actorUserId: string): InventoryItem {
    if (!item.tenantId || !item.itemCode || !item.name) {
      throw new Error('Item code, name, and tenantId are mandatory');
    }

    // Deterministic unique item code check within tenant
    const duplicate = this.items.find(i => i.tenantId === item.tenantId && i.itemCode.toLowerCase() === item.itemCode.toLowerCase());
    if (duplicate) {
      throw new Error(`Item code '${item.itemCode}' already exists for tenant ${item.tenantId}`);
    }

    if (item.minimumStock < 0 || item.maximumStock < item.minimumStock || item.reorderThreshold < 0) {
      throw new Error('Invalid stock boundaries: minimumStock must be >= 0 and maximumStock >= minimumStock');
    }

    const newItem: InventoryItem = {
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.items.push(newItem);
    this.appendAudit(item.tenantId, actorUserId, 'CREATE_ITEM', 'ITEM', newItem.itemId, newItem);
    return newItem;
  }

  public getUOMs(tenantId: string): UnitOfMeasure[] {
    return this.uoms.filter(u => u.tenantId === tenantId);
  }

  public getCategories(tenantId: string): InventoryCategory[] {
    return this.categories.filter(c => c.tenantId === tenantId);
  }

  // ==========================================
  // STORES & WAREHOUSES
  // ==========================================
  public getStores(tenantId: string): StoreLocation[] {
    return this.stores.filter(s => s.tenantId === tenantId);
  }

  public getStoreById(storeId: string, tenantId: string): StoreLocation | undefined {
    return this.stores.find(s => s.storeId === storeId && s.tenantId === tenantId);
  }

  public createStore(store: Omit<StoreLocation, 'createdAt' | 'updatedAt'>, actorUserId: string): StoreLocation {
    if (!store.tenantId || !store.storeCode || !store.name) {
      throw new Error('Store code, name, and tenantId are mandatory');
    }

    const duplicate = this.stores.find(s => s.tenantId === store.tenantId && s.storeCode.toLowerCase() === store.storeCode.toLowerCase());
    if (duplicate) {
      throw new Error(`Store code '${store.storeCode}' already exists for tenant`);
    }

    const newStore: StoreLocation = {
      ...store,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.stores.push(newStore);
    this.appendAudit(store.tenantId, actorUserId, 'CREATE_STORE', 'STORE', newStore.storeId, newStore);
    return newStore;
  }

  public updateStoreStatus(storeId: string, tenantId: string, status: StoreLifecycleStatus, actorUserId: string): StoreLocation {
    const store = this.getStoreById(storeId, tenantId);
    if (!store) {
      throw new Error(`Store '${storeId}' not found for tenant '${tenantId}'`);
    }

    store.status = status;
    store.updatedAt = new Date().toISOString();
    this.appendAudit(tenantId, actorUserId, 'UPDATE_STORE_STATUS', 'STORE', store.storeId, { status });
    return store;
  }

  // ==========================================
  // STOCK BALANCE ENGINE
  // ==========================================
  public getStockBalances(tenantId: string, storeId?: string): StockBalance[] {
    let balances = this.balances.filter(b => b.tenantId === tenantId);
    if (storeId) {
      balances = balances.filter(b => b.storeIdRef === storeId);
    }
    return balances;
  }

  public getOrCreateBalance(tenantId: string, storeId: string, itemId: string): StockBalance {
    let balance = this.balances.find(b => b.tenantId === tenantId && b.storeIdRef === storeId && b.itemIdRef === itemId);
    if (!balance) {
      balance = {
        balanceId: `BAL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        itemIdRef: itemId,
        storeIdRef: storeId,
        tenantId,
        onHand: 0,
        reserved: 0,
        available: 0,
        damaged: 0,
        quarantined: 0,
        inTransit: 0,
        updatedAt: new Date().toISOString()
      };
      this.balances.push(balance);
    }
    return balance;
  }

  private recalculateAvailable(balance: StockBalance) {
    balance.available = balance.onHand - balance.reserved - balance.quarantined - balance.damaged;
    balance.updatedAt = new Date().toISOString();
  }

  // ==========================================
  // RECEIVING ENGINE
  // ==========================================
  public getReceipts(tenantId: string): InventoryReceipt[] {
    return this.receipts.filter(r => r.tenantId === tenantId);
  }

  public createReceipt(receipt: Omit<InventoryReceipt, 'createdAt' | 'updatedAt'>, actorUserId: string): InventoryReceipt {
    if (this.idempotencyKeys.has(receipt.idempotencyKey)) {
      const existing = this.receipts.find(r => r.idempotencyKey === receipt.idempotencyKey);
      if (existing) return existing;
    }

    const store = this.getStoreById(receipt.storeIdRef, receipt.tenantId);
    if (!store) {
      throw new Error('Destination store does not exist for tenant');
    }
    if (store.status === 'CLOSED') {
      throw new Error('Cannot receive stock into a CLOSED warehouse location');
    }

    const newReceipt: InventoryReceipt = {
      ...receipt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.receipts.push(newReceipt);
    this.idempotencyKeys.add(receipt.idempotencyKey);
    this.appendAudit(receipt.tenantId, actorUserId, 'CREATE_RECEIPT', 'RECEIPT', newReceipt.receiptId, newReceipt);
    return newReceipt;
  }

  public postReceipt(receiptId: string, tenantId: string, actorUserId: string): InventoryReceipt {
    const receipt = this.receipts.find(r => r.receiptId === receiptId && r.tenantId === tenantId);
    if (!receipt) {
      throw new Error('Receipt not found');
    }
    if (receipt.status === 'POSTED') {
      return receipt; // Idempotent return
    }
    if (receipt.status === 'CLOSED' || receipt.status === 'CANCELLED') {
      throw new Error(`Cannot post receipt in ${receipt.status} status`);
    }

    const store = this.getStoreById(receipt.storeIdRef, tenantId);
    if (!store || store.status === 'CLOSED') {
      throw new Error('Target store is closed or unavailable');
    }

    // Atomically increment stock for each line
    for (const line of receipt.lines) {
      const balance = this.getOrCreateBalance(tenantId, receipt.storeIdRef, line.itemIdRef);
      balance.onHand += line.quantityReceived;
      this.recalculateAvailable(balance);

      // If batch controlled and lot specified, create or update lot
      if (line.lotNumber) {
        this.lots.push({
          lotId: `LOT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          itemIdRef: line.itemIdRef,
          storeIdRef: receipt.storeIdRef,
          tenantId,
          lotNumber: line.lotNumber,
          expiryDate: line.expiryDate,
          receivedDate: new Date().toISOString(),
          quantity: line.quantityReceived,
          status: 'USABLE',
          supplierIdRef: receipt.supplierIdRef,
          purchaseOrderIdRef: receipt.purchaseOrderIdRef
        });
      }

      // If serialized, register serial numbers
      if (line.serialNumbers && line.serialNumbers.length > 0) {
        for (const sn of line.serialNumbers) {
          const dup = this.serials.find(s => s.tenantId === tenantId && s.itemIdRef === line.itemIdRef && s.serialNumber === sn);
          if (dup) {
            throw new Error(`Serial number '${sn}' already registered for this item in tenant`);
          }
          this.serials.push({
            serialId: `SER-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            itemIdRef: line.itemIdRef,
            serialNumber: sn,
            tenantId,
            storeIdRef: receipt.storeIdRef,
            status: 'IN_STOCK',
            registeredAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    receipt.status = 'POSTED';
    receipt.postedAt = new Date().toISOString();
    receipt.postedByUserIdRef = actorUserId;
    receipt.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, actorUserId, 'POST_RECEIPT', 'RECEIPT', receipt.receiptId, { linesCount: receipt.lines.length });
    return receipt;
  }

  // ==========================================
  // STOCK ISSUE ENGINE
  // ==========================================
  public getIssues(tenantId: string): StockIssue[] {
    return this.issues.filter(i => i.tenantId === tenantId);
  }

  public createIssueRequest(issue: Omit<StockIssue, 'createdAt' | 'updatedAt'>, actorUserId: string): StockIssue {
    if (this.idempotencyKeys.has(issue.idempotencyKey)) {
      const existing = this.issues.find(i => i.idempotencyKey === issue.idempotencyKey);
      if (existing) return existing;
    }

    const store = this.getStoreById(issue.storeIdRef, issue.tenantId);
    if (!store || store.status === 'CLOSED') {
      throw new Error('Issue warehouse location is invalid or CLOSED');
    }

    // Validate available balance for each line
    for (const line of issue.lines) {
      const balance = this.getOrCreateBalance(issue.tenantId, issue.storeIdRef, line.itemIdRef);
      if (line.quantityRequested > balance.available) {
        throw new Error(`Requested quantity (${line.quantityRequested}) exceeds available stock (${balance.available}) for item ${line.itemIdRef}`);
      }
    }

    const newIssue: StockIssue = {
      ...issue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.issues.push(newIssue);
    this.idempotencyKeys.add(issue.idempotencyKey);
    this.appendAudit(issue.tenantId, actorUserId, 'CREATE_ISSUE_REQUEST', 'ISSUE', newIssue.issueId, newIssue);
    return newIssue;
  }

  public approveIssue(issueId: string, tenantId: string, approverUserId: string): StockIssue {
    const issue = this.issues.find(i => i.issueId === issueId && i.tenantId === tenantId);
    if (!issue) {
      throw new Error('Stock issue record not found');
    }
    if (issue.requestedByUserIdRef === approverUserId) {
      throw new Error('Four-Eyes SoD Violation: Requester cannot approve their own stock issue');
    }

    issue.status = 'APPROVED';
    issue.approvedByUserIdRef = approverUserId;
    issue.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, approverUserId, 'APPROVE_ISSUE', 'ISSUE', issue.issueId, { approved: true });
    return issue;
  }

  public issueStock(issueId: string, tenantId: string, issuerUserId: string): StockIssue {
    const issue = this.issues.find(i => i.issueId === issueId && i.tenantId === tenantId);
    if (!issue) {
      throw new Error('Stock issue not found');
    }
    if (issue.status === 'ISSUED') {
      return issue; // Idempotent
    }
    if (issue.status !== 'APPROVED' && issue.status !== 'PICKED') {
      throw new Error(`Cannot issue stock from status ${issue.status}. Issue must be APPROVED first.`);
    }

    // Atomically decrement stock
    for (const line of issue.lines) {
      const balance = this.getOrCreateBalance(tenantId, issue.storeIdRef, line.itemIdRef);
      const qty = line.quantityIssued || line.quantityRequested;
      if (qty > balance.available) {
        throw new Error(`Cannot complete issue: Available stock (${balance.available}) is insufficient for requested qty (${qty})`);
      }

      balance.onHand -= qty;
      this.recalculateAvailable(balance);

      // Handle lot reduction if specified
      if (line.lotIdRef) {
        const lot = this.lots.find(l => l.lotId === line.lotIdRef && l.tenantId === tenantId);
        if (lot) {
          if (lot.status === 'EXPIRED' || lot.status === 'QUARANTINED') {
            throw new Error(`Cannot issue from lot ${lot.lotNumber} with status ${lot.status}`);
          }
          lot.quantity -= qty;
        }
      }

      // Handle serial status update
      if (line.serialNumbers && line.serialNumbers.length > 0) {
        for (const sn of line.serialNumbers) {
          const serial = this.serials.find(s => s.tenantId === tenantId && s.itemIdRef === line.itemIdRef && s.serialNumber === sn);
          if (serial) {
            serial.status = 'ISSUED';
            serial.currentCustodyUserIdRef = issue.recipientIdRef;
            serial.updatedAt = new Date().toISOString();
          }
        }
      }
    }

    issue.status = 'ISSUED';
    issue.issuedByUserIdRef = issuerUserId;
    issue.issuedAt = new Date().toISOString();
    issue.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, issuerUserId, 'POST_STOCK_ISSUE', 'ISSUE', issue.issueId, { linesCount: issue.lines.length });
    return issue;
  }

  // ==========================================
  // STOCK RETURN ENGINE
  // ==========================================
  public getReturns(tenantId: string): StockReturn[] {
    return this.returns.filter(r => r.tenantId === tenantId);
  }

  public processReturn(returnRecord: StockReturn, actorUserId: string): StockReturn {
    if (this.idempotencyKeys.has(returnRecord.idempotencyKey)) {
      const existing = this.returns.find(r => r.idempotencyKey === returnRecord.idempotencyKey);
      if (existing) return existing;
    }

    const store = this.getStoreById(returnRecord.storeIdRef, returnRecord.tenantId);
    if (!store || store.status === 'CLOSED') {
      throw new Error('Return target store is CLOSED or invalid');
    }

    for (const line of returnRecord.lines) {
      const balance = this.getOrCreateBalance(returnRecord.tenantId, returnRecord.storeIdRef, line.itemIdRef);
      if (line.returnCondition === 'USABLE') {
        balance.onHand += line.quantityReturned;
      } else if (line.returnCondition === 'DAMAGED') {
        balance.onHand += line.quantityReturned;
        balance.damaged += line.quantityReturned;
      } else if (line.returnCondition === 'QUARANTINED') {
        balance.onHand += line.quantityReturned;
        balance.quarantined += line.quantityReturned;
      }
      this.recalculateAvailable(balance);
    }

    returnRecord.status = 'POSTED';
    returnRecord.postedAt = new Date().toISOString();
    this.returns.push(returnRecord);
    this.idempotencyKeys.add(returnRecord.idempotencyKey);

    this.appendAudit(returnRecord.tenantId, actorUserId, 'PROCESS_RETURN', 'RETURN', returnRecord.returnId, returnRecord);
    return returnRecord;
  }

  // ==========================================
  // STOCK TRANSFER ENGINE
  // ==========================================
  public getTransfers(tenantId: string): StockTransfer[] {
    return this.transfers.filter(t => t.tenantId === tenantId);
  }

  public createTransfer(transfer: Omit<StockTransfer, 'createdAt' | 'updatedAt'>, actorUserId: string): StockTransfer {
    if (this.idempotencyKeys.has(transfer.idempotencyKey)) {
      const existing = this.transfers.find(t => t.idempotencyKey === transfer.idempotencyKey);
      if (existing) return existing;
    }

    const srcStore = this.getStoreById(transfer.sourceStoreIdRef, transfer.tenantId);
    const destStore = this.getStoreById(transfer.destinationStoreIdRef, transfer.tenantId);

    if (!srcStore || !destStore) {
      throw new Error('Source or destination store invalid');
    }
    if (srcStore.status === 'CLOSED' || destStore.status === 'CLOSED') {
      throw new Error('Cannot execute transfer with CLOSED store locations');
    }

    // Verify stock availability in source store
    for (const line of transfer.lines) {
      const balance = this.getOrCreateBalance(transfer.tenantId, transfer.sourceStoreIdRef, line.itemIdRef);
      if (line.quantityTransferred > balance.available) {
        throw new Error(`Insufficient available stock for transfer in source store`);
      }
    }

    const newTransfer: StockTransfer = {
      ...transfer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transfers.push(newTransfer);
    this.idempotencyKeys.add(transfer.idempotencyKey);
    this.appendAudit(transfer.tenantId, actorUserId, 'CREATE_TRANSFER', 'TRANSFER', newTransfer.transferId, newTransfer);
    return newTransfer;
  }

  public dispatchTransfer(transferId: string, tenantId: string, actorUserId: string): StockTransfer {
    const transfer = this.transfers.find(t => t.transferId === transferId && t.tenantId === tenantId);
    if (!transfer) throw new Error('Transfer not found');

    for (const line of transfer.lines) {
      const srcBalance = this.getOrCreateBalance(tenantId, transfer.sourceStoreIdRef, line.itemIdRef);
      srcBalance.onHand -= line.quantityTransferred;
      srcBalance.inTransit += line.quantityTransferred;
      this.recalculateAvailable(srcBalance);
    }

    transfer.status = 'IN_TRANSIT';
    transfer.dispatchedByUserIdRef = actorUserId;
    transfer.dispatchedAt = new Date().toISOString();
    transfer.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, actorUserId, 'DISPATCH_TRANSFER', 'TRANSFER', transfer.transferId, { status: 'IN_TRANSIT' });
    return transfer;
  }

  public receiveTransfer(transferId: string, tenantId: string, actorUserId: string): StockTransfer {
    const transfer = this.transfers.find(t => t.transferId === transferId && t.tenantId === tenantId);
    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status !== 'IN_TRANSIT') throw new Error('Transfer is not in IN_TRANSIT status');

    for (const line of transfer.lines) {
      const srcBalance = this.getOrCreateBalance(tenantId, transfer.sourceStoreIdRef, line.itemIdRef);
      const destBalance = this.getOrCreateBalance(tenantId, transfer.destinationStoreIdRef, line.itemIdRef);

      srcBalance.inTransit -= line.quantityTransferred;
      destBalance.onHand += line.quantityTransferred;
      this.recalculateAvailable(srcBalance);
      this.recalculateAvailable(destBalance);
    }

    transfer.status = 'RECONCILED';
    transfer.receivedByUserIdRef = actorUserId;
    transfer.receivedAt = new Date().toISOString();
    transfer.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, actorUserId, 'RECEIVE_TRANSFER', 'TRANSFER', transfer.transferId, { status: 'RECONCILED' });
    return transfer;
  }

  // ==========================================
  // STOCK RESERVATIONS
  // ==========================================
  public getReservations(tenantId: string): StockReservation[] {
    return this.reservations.filter(r => r.tenantId === tenantId);
  }

  public createReservation(reservation: Omit<StockReservation, 'createdAt' | 'updatedAt'>, actorUserId: string): StockReservation {
    if (this.idempotencyKeys.has(reservation.idempotencyKey)) {
      const existing = this.reservations.find(r => r.idempotencyKey === reservation.idempotencyKey);
      if (existing) return existing;
    }

    const balance = this.getOrCreateBalance(reservation.tenantId, reservation.storeIdRef, reservation.itemIdRef);
    if (reservation.reservedQuantity > balance.available) {
      throw new Error(`Cannot reserve ${reservation.reservedQuantity}: only ${balance.available} available`);
    }

    balance.reserved += reservation.reservedQuantity;
    this.recalculateAvailable(balance);

    const newRes: StockReservation = {
      ...reservation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.reservations.push(newRes);
    this.idempotencyKeys.add(reservation.idempotencyKey);
    this.appendAudit(reservation.tenantId, actorUserId, 'CREATE_RESERVATION', 'RESERVATION', newRes.reservationId, newRes);
    return newRes;
  }

  public releaseReservation(reservationId: string, tenantId: string, actorUserId: string): StockReservation {
    const res = this.reservations.find(r => r.reservationId === reservationId && r.tenantId === tenantId);
    if (!res) throw new Error('Reservation not found');
    if (res.status !== 'ACTIVE') return res;

    const balance = this.getOrCreateBalance(tenantId, res.storeIdRef, res.itemIdRef);
    balance.reserved = Math.max(0, balance.reserved - res.reservedQuantity);
    this.recalculateAvailable(balance);

    res.status = 'CANCELLED';
    res.updatedAt = new Date().toISOString();
    this.appendAudit(tenantId, actorUserId, 'RELEASE_RESERVATION', 'RESERVATION', res.reservationId, { released: true });
    return res;
  }

  // ==========================================
  // STOCK ADJUSTMENT & SOD GOVERNANCE
  // ==========================================
  public getAdjustments(tenantId: string): StockAdjustment[] {
    return this.adjustments.filter(a => a.tenantId === tenantId);
  }

  public requestAdjustment(adjustment: Omit<StockAdjustment, 'createdAt' | 'updatedAt' | 'auditHash'>, actorUserId: string): StockAdjustment {
    const balance = this.getOrCreateBalance(adjustment.tenantId, adjustment.storeIdRef, adjustment.itemIdRef);
    const prevQty = balance.onHand;
    let newQty = prevQty;

    if (adjustment.adjustmentType === 'INCREASE') {
      newQty = prevQty + adjustment.quantity;
    } else if (adjustment.adjustmentType === 'DECREASE' || adjustment.adjustmentType === 'DAMAGE' || adjustment.adjustmentType === 'WRITE_OFF') {
      newQty = Math.max(0, prevQty - adjustment.quantity);
    }

    const auditHash = this.simpleHash(`${adjustment.tenantId}|${adjustment.itemIdRef}|${prevQty}|${newQty}|${adjustment.reason}|${Date.now()}`);

    const newAdj: StockAdjustment = {
      ...adjustment,
      previousQuantity: prevQty,
      newQuantity: newQty,
      auditHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.adjustments.push(newAdj);
    this.appendAudit(adjustment.tenantId, actorUserId, 'REQUEST_ADJUSTMENT', 'ADJUSTMENT', newAdj.adjustmentId, newAdj);
    return newAdj;
  }

  public approveAndPostAdjustment(adjustmentId: string, tenantId: string, approverUserId: string): StockAdjustment {
    const adj = this.adjustments.find(a => a.adjustmentId === adjustmentId && a.tenantId === tenantId);
    if (!adj) throw new Error('Adjustment not found');

    // Four-Eyes SoD mandatory enforcement
    if (adj.requestedByUserIdRef === approverUserId) {
      throw new Error('Four-Eyes SoD Violation: Adjustment requester cannot approve their own stock adjustment');
    }

    const balance = this.getOrCreateBalance(tenantId, adj.storeIdRef, adj.itemIdRef);
    balance.onHand = adj.newQuantity;
    if (adj.adjustmentType === 'DAMAGE') {
      balance.damaged += adj.quantity;
    }
    this.recalculateAvailable(balance);

    adj.status = 'POSTED';
    adj.approvedByUserIdRef = approverUserId;
    adj.postedAt = new Date().toISOString();
    adj.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, approverUserId, 'APPROVE_POST_ADJUSTMENT', 'ADJUSTMENT', adj.adjustmentId, {
      prev: adj.previousQuantity,
      new: adj.newQuantity
    });
    return adj;
  }

  // ==========================================
  // PHYSICAL COUNT & RECONCILIATION
  // ==========================================
  public getCounts(tenantId: string): InventoryCount[] {
    return this.counts.filter(c => c.tenantId === tenantId);
  }

  public createCount(count: Omit<InventoryCount, 'createdAt' | 'updatedAt'>, actorUserId: string): InventoryCount {
    const newCount: InventoryCount = {
      ...count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.counts.push(newCount);
    this.appendAudit(count.tenantId, actorUserId, 'CREATE_INVENTORY_COUNT', 'COUNT', newCount.countId, newCount);
    return newCount;
  }

  public submitCountLines(countId: string, tenantId: string, lines: { itemIdRef: string; countedQuantity: number; reasonCode?: string }[], actorUserId: string): InventoryCount {
    const count = this.counts.find(c => c.countId === countId && c.tenantId === tenantId);
    if (!count) throw new Error('Inventory count record not found');

    let totalVariance = 0;
    const computedLines: InventoryCountLine[] = [];

    for (const l of lines) {
      if (l.countedQuantity < 0) {
        throw new Error('Counted quantity cannot be negative');
      }

      const balance = this.getOrCreateBalance(tenantId, count.storeIdRef, l.itemIdRef);
      const systemQty = balance.onHand;
      const variance = l.countedQuantity - systemQty;
      const variancePct = systemQty > 0 ? (variance / systemQty) * 100 : (l.countedQuantity > 0 ? 100 : 0);

      totalVariance += Math.abs(variance);
      computedLines.push({
        lineId: `CL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        itemIdRef: l.itemIdRef,
        systemQuantity: systemQty,
        countedQuantity: l.countedQuantity,
        varianceQuantity: variance,
        variancePercentage: Number(variancePct.toFixed(2)),
        reasonCode: l.reasonCode,
        isReconciled: variance === 0
      });
    }

    count.lines = computedLines;
    count.totalVarianceQuantity = totalVariance;
    count.status = 'SUBMITTED';
    count.countedByUserIdRef = actorUserId;
    count.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, actorUserId, 'SUBMIT_COUNT_LINES', 'COUNT', count.countId, { totalVariance });
    return count;
  }

  // ==========================================
  // OPERATIONAL ASSETS & ASSIGNMENTS
  // ==========================================
  public getAssets(tenantId: string): Asset[] {
    return this.assets.filter(a => a.tenantId === tenantId);
  }

  public getAssetById(assetId: string, tenantId: string): Asset | undefined {
    return this.assets.find(a => a.assetId === assetId && a.tenantId === tenantId);
  }

  public createAsset(asset: Omit<Asset, 'createdAt' | 'updatedAt'>, actorUserId: string): Asset {
    if (!asset.assetCode || !asset.tenantId || !asset.name) {
      throw new Error('Asset code, name, and tenantId are required');
    }

    const duplicate = this.assets.find(a => a.tenantId === asset.tenantId && a.assetCode.toLowerCase() === asset.assetCode.toLowerCase());
    if (duplicate) {
      throw new Error(`Asset code '${asset.assetCode}' already exists for tenant`);
    }

    const newAsset: Asset = {
      ...asset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.assets.push(newAsset);
    this.appendAudit(asset.tenantId, actorUserId, 'CREATE_ASSET', 'ASSET', newAsset.assetId, newAsset);
    return newAsset;
  }

  public getAssignments(tenantId: string): AssetAssignment[] {
    return this.assignments.filter(a => a.tenantId === tenantId);
  }

  public assignAsset(assignment: Omit<AssetAssignment, 'createdAt' | 'updatedAt'>, actorUserId: string): AssetAssignment {
    if (this.idempotencyKeys.has(assignment.idempotencyKey)) {
      const existing = this.assignments.find(a => a.idempotencyKey === assignment.idempotencyKey);
      if (existing) return existing;
    }

    const asset = this.getAssetById(assignment.assetIdRef, assignment.tenantId);
    if (!asset) throw new Error('Asset not found');

    if (asset.status === 'ASSIGNED') {
      throw new Error('Asset is already assigned to an active custodian. Cannot assign simultaneously.');
    }
    if (asset.status === 'DISPOSED' || asset.status === 'RETIRED' || asset.status === 'LOST') {
      throw new Error(`Cannot assign asset in ${asset.status} status`);
    }

    asset.status = 'ASSIGNED';
    asset.updatedAt = new Date().toISOString();

    const newAsg: AssetAssignment = {
      ...assignment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.assignments.push(newAsg);
    this.idempotencyKeys.add(assignment.idempotencyKey);

    // Create custody entry
    this.custodies.push({
      custodyId: `CUST-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      assetIdRef: asset.assetId,
      tenantId: assignment.tenantId,
      custodianUserIdRef: assignment.assignedToIdRef,
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      condition: assignment.conditionOnIssue
    });

    this.appendAudit(assignment.tenantId, actorUserId, 'ASSIGN_ASSET', 'ASSIGNMENT', newAsg.assignmentId, newAsg);
    return newAsg;
  }

  public returnAsset(assignmentId: string, tenantId: string, returnCondition: AssetAssignment['conditionOnReturn'], actorUserId: string): AssetAssignment {
    const asg = this.assignments.find(a => a.assignmentId === assignmentId && a.tenantId === tenantId);
    if (!asg) throw new Error('Assignment not found');

    const asset = this.getAssetById(asg.assetIdRef, tenantId);
    if (asset) {
      asset.status = returnCondition === 'DAMAGED' ? 'DAMAGED' : 'IN_SERVICE';
      asset.updatedAt = new Date().toISOString();
    }

    asg.status = 'RETURNED';
    asg.actualReturnDate = new Date().toISOString();
    asg.conditionOnReturn = returnCondition;
    asg.updatedAt = new Date().toISOString();

    // Close active custody
    const activeCustody = this.custodies.find(c => c.assetIdRef === asg.assetIdRef && c.status === 'ACTIVE');
    if (activeCustody) {
      activeCustody.status = 'RETURNED';
      activeCustody.endDate = new Date().toISOString();
    }

    this.appendAudit(tenantId, actorUserId, 'RETURN_ASSET', 'ASSIGNMENT', asg.assignmentId, { returnCondition });
    return asg;
  }

  // ==========================================
  // ASSET DISPOSAL GOVERNANCE
  // ==========================================
  public getDisposals(tenantId: string): AssetDisposalRequest[] {
    return this.disposals.filter(d => d.tenantId === tenantId);
  }

  public createDisposalRequest(disposal: Omit<AssetDisposalRequest, 'createdAt' | 'updatedAt' | 'auditHash'>, actorUserId: string): AssetDisposalRequest {
    const asset = this.getAssetById(disposal.assetIdRef, disposal.tenantId);
    if (!asset) throw new Error('Asset not found');

    const auditHash = this.simpleHash(`${disposal.tenantId}|${disposal.assetIdRef}|${disposal.reason}|${Date.now()}`);

    const newDisposal: AssetDisposalRequest = {
      ...disposal,
      auditHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.disposals.push(newDisposal);
    this.appendAudit(disposal.tenantId, actorUserId, 'REQUEST_DISPOSAL', 'DISPOSAL', newDisposal.disposalId, newDisposal);
    return newDisposal;
  }

  public approveAndExecuteDisposal(disposalId: string, tenantId: string, approverUserId: string): AssetDisposalRequest {
    const disposal = this.disposals.find(d => d.disposalId === disposalId && d.tenantId === tenantId);
    if (!disposal) throw new Error('Disposal request not found');

    // Four-Eyes SoD Enforcement
    if (disposal.requestedByUserIdRef === approverUserId) {
      throw new Error('Four-Eyes SoD Violation: Disposal requester cannot approve their own asset disposal request');
    }

    const asset = this.getAssetById(disposal.assetIdRef, tenantId);
    if (asset) {
      asset.status = 'DISPOSED';
      asset.isActive = false;
      asset.updatedAt = new Date().toISOString();
    }

    disposal.status = 'DISPOSED';
    disposal.approvedByUserIdRef = approverUserId;
    disposal.disposedAt = new Date().toISOString();
    disposal.updatedAt = new Date().toISOString();

    this.appendAudit(tenantId, approverUserId, 'EXECUTE_DISPOSAL', 'DISPOSAL', disposal.disposalId, { disposed: true });
    return disposal;
  }

  // ==========================================
  // DIAGNOSTICS ENGINE
  // ==========================================
  public runDiagnostics(tenantId: string) {
    const tenantItems = this.getItems(tenantId);
    const tenantStores = this.getStores(tenantId);
    const tenantBalances = this.getStockBalances(tenantId);
    const tenantAssets = this.getAssets(tenantId);
    const tenantLots = this.lots.filter(l => l.tenantId === tenantId);
    const tenantSerials = this.serials.filter(s => s.tenantId === tenantId);

    const anomalies: string[] = [];

    // Check 1: Negative stock balance
    for (const b of tenantBalances) {
      if (b.onHand < 0 || b.available < 0) {
        anomalies.push(`Negative stock balance detected on item ${b.itemIdRef} at store ${b.storeIdRef}`);
      }
      if (b.reserved > b.onHand) {
        anomalies.push(`Over-reservation detected: reserved (${b.reserved}) > onHand (${b.onHand}) on item ${b.itemIdRef}`);
      }
    }

    // Check 2: Expired lots in active stores
    for (const lot of tenantLots) {
      if (lot.expiryDate && new Date(lot.expiryDate) < new Date() && lot.status === 'USABLE') {
        anomalies.push(`Expired lot ${lot.lotNumber} marked as USABLE for item ${lot.itemIdRef}`);
      }
    }

    // Check 3: Duplicate serial numbers
    const serialMap = new Map<string, number>();
    for (const s of tenantSerials) {
      const key = `${s.itemIdRef}:${s.serialNumber}`;
      serialMap.set(key, (serialMap.get(key) || 0) + 1);
      if ((serialMap.get(key) || 0) > 1) {
        anomalies.push(`Duplicate serial number registered: ${s.serialNumber}`);
      }
    }

    // Check 4: Simultaneous active custody on assets
    const activeCustodyMap = new Map<string, number>();
    for (const c of this.custodies.filter(c => c.tenantId === tenantId && c.status === 'ACTIVE')) {
      activeCustodyMap.set(c.assetIdRef, (activeCustodyMap.get(c.assetIdRef) || 0) + 1);
      if ((activeCustodyMap.get(c.assetIdRef) || 0) > 1) {
        anomalies.push(`Simultaneous active custody detected for asset ${c.assetIdRef}`);
      }
    }

    return {
      status: anomalies.length === 0 ? 'HEALTHY' : 'WARNINGS_DETECTED',
      totalItems: tenantItems.length,
      totalStores: tenantStores.length,
      totalBalances: tenantBalances.length,
      totalAssets: tenantAssets.length,
      anomaliesCount: anomalies.length,
      anomalies
    };
  }

  // ==========================================
  // WHAT-IF SANDBOX (15 ISOLATED SCENARIOS)
  // ZERO PRODUCTION MUTATION GUARANTEE
  // ==========================================
  public runSimulation(scenarioType: InventorySimulationScenario['type']): {
    scenario: InventorySimulationScenario;
    status: 'COMPLETED';
    clonedItemCount: number;
    mutationCount: number;
    banner: string;
  } {
    const banner = 'SIMULATION ONLY - SANDBOX MODE ACTIVE - ZERO PRODUCTION MUTATION';
    const baseItemsCount = this.items.length;
    const baseBalancesCount = this.balances.length;

    // Clone isolated state
    const simItems = JSON.parse(JSON.stringify(this.items));
    const simBalances = JSON.parse(JSON.stringify(this.balances));

    let delta = 0;
    let riskPct = 0;
    let cost = 0;
    const recs: string[] = [];

    switch (scenarioType) {
      case 'DEMAND_SURGE':
        delta = -150;
        riskPct = 45;
        cost = 45000;
        recs.push('Increase reorder safety stock by 35%', 'Enable multi-campus emergency stock transfer');
        break;
      case 'STOCKOUT':
        riskPct = 95;
        cost = 120000;
        recs.push('Trigger automated RFQ to secondary suppliers', 'Enforce rationed stock issues');
        break;
      case 'WAREHOUSE_CAPACITY_EXHAUSTION':
        recs.push('Reallocate bulk paper reams to regional Mumbai depot', 'Accelerate scrap disposal');
        break;
      case 'CAMPUS_TRANSFER_SURGE':
        recs.push('Consolidate inter-campus shuttle dispatch schedules', 'Implement minimum transfer batch sizing');
        break;
      case 'RESERVATION_SPIKE':
        riskPct = 60;
        recs.push('Enforce 72-hour auto-release rule for unfulfilled student project reservations');
        break;
      case 'SUPPLIER_RECEIPT_DELAY':
        cost = 35000;
        recs.push('Activate backup contract supplier', 'Notify lab supervisors of delivery schedule revisions');
        break;
      case 'BATCH_EXPIRY_CASCADE':
        cost = 78000;
        recs.push('Quarantine all pre-2024 chemical lots', 'Schedule hazardous material disposal');
        break;
      case 'SERIAL_NUMBER_COLLISION':
        recs.push('Enforce barcode scanner validation prior to serial register creation');
        break;
      case 'PHYSICAL_COUNT_VARIANCE':
        recs.push('Conduct secondary blind recount on high-value computing assets');
        break;
      case 'EMERGENCY_STOCK_RELEASE':
        recs.push('Log executive Four-Eyes approval for safety kit emergency issue');
        break;
      case 'ASSET_ASSIGNMENT_SURGE':
        recs.push('Deploy automated batch asset assignment for incoming faculty cohort');
        break;
      case 'ASSET_TRANSFER_CASCADE':
        recs.push('Audit asset custody chains during inter-campus logistics transition');
        break;
      case 'DISPOSAL_BACKLOG':
        recs.push('Convene institutional disposal review board to approve e-waste auction');
        break;
      case 'NEGATIVE_STOCK_DETECTION':
        recs.push('Freeze automatic issue postings until physical count reconciliation completes');
        break;
      case 'PROCUREMENT_DISRUPTION':
        cost = 180000;
        recs.push('Diversify tier-1 supplier pool across multiple geographic zones');
        break;
      default:
        recs.push('Standard inventory optimization protocol applied.');
    }

    // Verify zero production mutations
    if (this.items.length !== baseItemsCount || this.balances.length !== baseBalancesCount) {
      throw new Error('CRITICAL INTEGRITY FAILURE: Production database was mutated during sandbox simulation!');
    }

    const scenario: InventorySimulationScenario = {
      scenarioId: `SIM-${Date.now()}`,
      name: `Simulation: ${scenarioType}`,
      description: `What-If sandbox execution for ${scenarioType}`,
      type: scenarioType,
      parameters: { delta, riskPct },
      simulatedImpact: {
        stockBalanceDelta: delta,
        stockoutRiskPercentage: riskPct,
        costImpact: cost,
        recommendations: recs
      }
    };

    return {
      scenario,
      status: 'COMPLETED',
      clonedItemCount: simItems.length,
      mutationCount: 0,
      banner
    };
  }

  public getAuditTrail(tenantId: string): InventoryMaterialsAuditEvent[] {
    return this.auditEvents.filter(a => a.tenantId === tenantId);
  }
}

export const inventoryAssetsStoresMaterialsService = new InventoryAssetsStoresMaterialsService();
