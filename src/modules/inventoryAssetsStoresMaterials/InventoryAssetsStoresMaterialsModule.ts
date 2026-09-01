import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InventoryAssetsStoresMaterialsModule: UniversalModuleContract = {
  moduleId: 'mod_inventory_assets_stores_materials',
  name: 'Institutional Inventory, Assets, Stores & Materials Operations',
  displayName: 'Inventory, Assets & Materials',
  description: 'Authoritative operations module governing institutional stores, warehouses, stock keeping units, item catalog, receipts, issues, returns, inter-campus transfers, adjustments, physical counts, reconciliation, lot/serial tracking, asset lifecycle, assignments, and governed disposals.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.7.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_transport_fleet_mobility', minVersion: '11.6.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_inventory_assets_stores_materials',
      moduleId: 'mod_inventory_assets_stores_materials',
      label: 'Inventory & Assets',
      icon: 'Boxes',
      route: 'inventory_assets_stores_materials',
      sortOrder: 16,
      status: 'active',
      requiredPermission: 'inventory.view',
      allowedRoles: ['super_admin', 'platform_admin', 'inventory_manager', 'store_officer', 'asset_manager', 'procurement_officer'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'inventory.view',
      name: 'View Inventory & Stores',
      description: 'View stock levels, warehouse locations, material catalog, and movement records'
    },
    {
      code: 'inventory.manage',
      name: 'Manage Inventory Systems',
      description: 'Configure warehouse locations, unit conversion tables, and reorder control rules'
    },
    {
      code: 'inventory.item.create',
      name: 'Create Inventory Item',
      description: 'Register new stock keeping units and material specifications in item catalog'
    },
    {
      code: 'inventory.item.update',
      name: 'Update Inventory Item',
      description: 'Modify material classification, reorder threshold boundaries, and unit specifications'
    },
    {
      code: 'inventory.store.view',
      name: 'View Stores & Warehouses',
      description: 'Inspect storage facility capacity, bin allocations, and security classifications'
    },
    {
      code: 'inventory.store.manage',
      name: 'Manage Warehouses',
      description: 'Create and configure store locations, bin layouts, and operational states'
    },
    {
      code: 'inventory.receipt.create',
      name: 'Create Stock Receipt',
      description: 'Draft goods receipt note against purchase order or supplier delivery'
    },
    {
      code: 'inventory.receipt.verify',
      name: 'Verify Stock Receipt',
      description: 'Inspect received stock quantities, batch details, and quality parameters'
    },
    {
      code: 'inventory.receipt.post',
      name: 'Post Stock Receipt',
      description: 'Atomically commit received inventory into warehouse on-hand balances'
    },
    {
      code: 'inventory.issue.create',
      name: 'Create Stock Issue Request',
      description: 'Submit material requisition for academic, laboratory, or administrative consumption'
    },
    {
      code: 'inventory.issue.approve',
      name: 'Approve Stock Issue',
      description: 'Four-Eyes SoD authorization to release requested store stock'
    },
    {
      code: 'inventory.issue.post',
      name: 'Post Stock Issue',
      description: 'Pick, decrement stock balances, and hand over material to recipient'
    },
    {
      code: 'inventory.return.create',
      name: 'Create Stock Return',
      description: 'Initiate material return into warehouse custody'
    },
    {
      code: 'inventory.return.approve',
      name: 'Approve Stock Return',
      description: 'Inspect and authorize returned inventory into usable, damaged, or quarantined stock'
    },
    {
      code: 'inventory.return.post',
      name: 'Post Stock Return',
      description: 'Atomically update warehouse balances based on return inspection condition'
    },
    {
      code: 'inventory.transfer.create',
      name: 'Create Stock Transfer',
      description: 'Initiate inter-store or inter-campus material transfer order'
    },
    {
      code: 'inventory.transfer.approve',
      name: 'Approve Stock Transfer',
      description: 'Four-Eyes SoD authorization for cross-campus or inter-warehouse stock transfer'
    },
    {
      code: 'inventory.transfer.dispatch',
      name: 'Dispatch Transfer',
      description: 'Mark stock in transit and remove from source warehouse on-hand balance'
    },
    {
      code: 'inventory.transfer.receive',
      name: 'Receive Transfer',
      description: 'Acknowledge arrival and reconcile stock into destination warehouse'
    },
    {
      code: 'inventory.adjustment.create',
      name: 'Request Stock Adjustment',
      description: 'Submit quantity variance adjustment, write-off, or damage reclassification'
    },
    {
      code: 'inventory.adjustment.approve',
      name: 'Approve Stock Adjustment',
      description: 'Four-Eyes SoD authorization to post material inventory adjustments'
    },
    {
      code: 'inventory.count.manage',
      name: 'Manage Physical Counts',
      description: 'Schedule, execute, and submit cycle or annual physical inventory stock counts'
    },
    {
      code: 'inventory.reconciliation.manage',
      name: 'Manage Stock Reconciliation',
      description: 'Reconcile physical stock counts against book balances and investigate variances'
    },
    {
      code: 'inventory.exception.approve',
      name: 'Approve Inventory Exceptions',
      description: 'Four-Eyes SoD authority for emergency releases or capacity limit overrides'
    },
    {
      code: 'asset.view',
      name: 'View Institutional Assets',
      description: 'Inspect operational fixed and movable asset registries, barcodes, and book values'
    },
    {
      code: 'asset.manage',
      name: 'Manage Asset Register',
      description: 'Acquire, tag, serialize, and maintain operational asset lifecycle records'
    },
    {
      code: 'asset.assign',
      name: 'Assign Assets',
      description: 'Allocate asset custody to faculty, staff, students, or institutional facilities'
    },
    {
      code: 'asset.transfer',
      name: 'Transfer Assets',
      description: 'Authorize inter-campus or inter-department asset custody transfers'
    },
    {
      code: 'asset.disposal.approve',
      name: 'Approve Asset Disposal',
      description: 'Four-Eyes SoD sign-off for scrap, auction, or write-off of obsolete assets'
    },
    {
      code: 'inventory.audit.view',
      name: 'View Inventory Audit Trail',
      description: 'Inspect cryptographic append-only provenance ledgers and mutation logs'
    }
  ]
};
