import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InventoryModule: UniversalModuleContract = {
  moduleId: 'mod_inventory',
  name: 'Asset & Inventory Management',
  displayName: 'Asset, Inventory & Stores Management Engine',
  description: 'Enterprise inventory engine supporting stores, stock ledger, receiving, issuing, asset lifecycle, assignments, physical audits, and write-offs (Phase 7.19)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_procurement', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    { code: 'inventory.view', name: 'View Inventory', description: 'View stock balances and asset registers' },
    { code: 'inventory.create', name: 'Create Items', description: 'Create and define inventory items and categories' },
    { code: 'inventory.update', name: 'Update Items', description: 'Modify inventory master records' },
    { code: 'inventory.receive', name: 'Receive Stock', description: 'Process inventory receipts (e.g. from GRNs)' },
    { code: 'inventory.issue', name: 'Issue Stock', description: 'Issue stock to individuals or departments' },
    { code: 'inventory.return', name: 'Return Stock', description: 'Process stock returns into stores' },
    { code: 'inventory.transfer', name: 'Transfer Stock', description: 'Transfer stock between locations' },
    { code: 'inventory.adjust', name: 'Adjust Stock', description: 'Record manual stock adjustments' },
    { code: 'inventory.manage_assets', name: 'Manage Assets', description: 'Create and update capital assets' },
    { code: 'inventory.assign_assets', name: 'Assign Assets', description: 'Allocate assets to custodians' },
    { code: 'inventory.audit', name: 'Audit Stock', description: 'Conduct physical inventory audits' },
    { code: 'inventory.approve', name: 'Approve Movements', description: 'Approve transfers, adjustments, and write-offs' },
    { code: 'inventory.dispose', name: 'Dispose Assets', description: 'Process asset write-offs and disposals' },
    { code: 'inventory.configure', name: 'Configure Stores', description: 'Configure store locations and policies' },
    { code: 'inventory.export', name: 'Export Data', description: 'Export inventory ledgers and reports' },
    { code: 'inventory.view_audit', name: 'View Audit Logs', description: 'View inventory transaction audit logs' }
  ],
  navigationItems: [
    {
      id: 'inventory_workspace',
      moduleId: 'mod_inventory',
      label: 'Asset & Inventory',
      icon: 'Package',
      route: '/inventory/workspace',
      requiredPermission: 'inventory.view',
      sortOrder: 53,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] InventoryModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] InventoryModule disabled for tenant ${tenantId}`);
  }
};
