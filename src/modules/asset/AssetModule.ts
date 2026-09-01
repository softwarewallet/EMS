import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AssetModule: UniversalModuleContract = {
  moduleId: 'mod_asset',
  name: 'Asset & Facilities Management',
  displayName: 'Asset, Inventory, Facilities & Maintenance Management Governance Engine',
  description: 'Enterprise governance for physical assets, inventory items, maintenance work orders, facilities requests, and lifecycles (Phase 7.20)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_inventory', optional: true },
    { moduleId: 'mod_procurement', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    { code: 'asset.view', name: 'View Assets', description: 'View asset register and facility records' },
    { code: 'asset.create', name: 'Create Assets', description: 'Create and define capital assets' },
    { code: 'asset.update', name: 'Update Assets', description: 'Modify asset records' },
    { code: 'asset.transfer', name: 'Transfer Assets', description: 'Process asset transfers' },
    { code: 'asset.assign', name: 'Assign Assets', description: 'Assign assets to custodians' },
    { code: 'asset.inspect', name: 'Inspect Assets', description: 'Conduct asset inspections' },
    { code: 'asset.maintain', name: 'Maintain Assets', description: 'Log and update asset maintenance' },
    { code: 'asset.dispose', name: 'Dispose Assets', description: 'Process asset disposal workflows' },
    { code: 'maintenance.view', name: 'View Maintenance', description: 'View maintenance schedules and work orders' },
    { code: 'maintenance.create', name: 'Create Maintenance', description: 'Create maintenance work orders' },
    { code: 'maintenance.assign', name: 'Assign Maintenance', description: 'Assign technicians to work orders' },
    { code: 'maintenance.approve', name: 'Approve Maintenance', description: 'Approve completed maintenance work orders' },
    { code: 'facility.view', name: 'View Facilities', description: 'View facility maintenance requests' },
    { code: 'facility.create', name: 'Create Facility Requests', description: 'Create new facility maintenance requests' },
    { code: 'facility.manage', name: 'Manage Facilities', description: 'Manage and resolve facility requests' },
    { code: 'asset.export', name: 'Export Asset Data', description: 'Export asset registers and maintenance logs' },
    { code: 'asset.audit', name: 'Audit Assets', description: 'View audit logs for asset and maintenance activities' }
  ],
  navigationItems: [
    {
      id: 'nav_asset_management_workspace',
      moduleId: 'mod_asset',
      label: 'Asset & Facilities',
      icon: 'Settings',
      route: '/asset/workspace',
      requiredPermission: 'asset.view',
      sortOrder: 54,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] AssetModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] AssetModule disabled for tenant ${tenantId}`);
  }
};
