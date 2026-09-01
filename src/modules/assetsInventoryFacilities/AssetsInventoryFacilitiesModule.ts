import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AssetsInventoryFacilitiesModule: UniversalModuleContract = {
  moduleId: 'mod_assets_inventory_facilities',
  name: 'Assets, Inventory & Facilities Operations',
  displayName: 'Assets, Inventory & Facilities',
  description: 'Authoritative operational module for institutional assets, lifecycle, inventory movements, facilities, maintenance work orders, inspections, transfers, and disposal.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.4.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_assets_inventory_facilities',
      moduleId: 'mod_assets_inventory_facilities',
      label: 'Assets, Inventory & Facilities',
      icon: 'Package',
      route: 'assets_inventory_facilities',
      sortOrder: 13,
      status: 'active',
      requiredPermission: 'asset.view',
      allowedRoles: ['super_admin', 'platform_admin', 'asset_manager', 'inventory_manager', 'facility_manager', 'maintenance_engineer'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'asset.view',
      name: 'View Assets',
      description: 'View asset records, custody, inventory, and facilities'
    },
    {
      code: 'asset.manage',
      name: 'Manage Assets',
      description: 'Create and update asset master data and lifecycle'
    },
    {
      code: 'asset.assign',
      name: 'Assign Assets',
      description: 'Assign assets to custodians, departments, or locations'
    },
    {
      code: 'asset.transfer',
      name: 'Transfer Assets',
      description: 'Initiate and approve inter-campus or inter-org asset transfers'
    },
    {
      code: 'asset.dispose',
      name: 'Dispose Assets',
      description: 'Request asset disposal'
    },
    {
      code: 'asset.disposal.approve',
      name: 'Approve Asset Disposal',
      description: 'Four-Eyes SoD authority to approve asset disposal'
    },
    {
      code: 'inventory.view',
      name: 'View Inventory',
      description: 'View inventory balances and stock movements'
    },
    {
      code: 'inventory.manage',
      name: 'Manage Inventory',
      description: 'Record stock receipts, issues, returns, and transfers'
    },
    {
      code: 'inventory.adjust',
      name: 'Adjust Inventory',
      description: 'Perform stock reconciliations and inventory adjustments'
    },
    {
      code: 'facility.view',
      name: 'View Facilities',
      description: 'View buildings, floors, rooms, and physical locations'
    },
    {
      code: 'facility.manage',
      name: 'Manage Facilities',
      description: 'Maintain facility locations and capacity metadata'
    },
    {
      code: 'maintenance.view',
      name: 'View Maintenance',
      description: 'View maintenance requests and work orders'
    },
    {
      code: 'maintenance.manage',
      name: 'Manage Maintenance',
      description: 'Create and update maintenance work orders and schedules'
    },
    {
      code: 'maintenance.approve',
      name: 'Approve Maintenance',
      description: 'Four-Eyes SoD authority to approve work orders'
    },
    {
      code: 'inspection.manage',
      name: 'Manage Inspections',
      description: 'Record facility and asset safety compliance inspections'
    }
  ]
};
