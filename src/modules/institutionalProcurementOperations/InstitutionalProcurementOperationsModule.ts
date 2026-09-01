import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalProcurementOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_procurement_operations',
  name: 'Institutional Procurement & Purchasing',
  displayName: 'Procurement & Purchasing',
  description: 'Authoritative operational module for suppliers, purchasing requisitions, POs, three-way matching, and expenditure commitments.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.3.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_procurement_operations',
      moduleId: 'mod_institutional_procurement_operations',
      label: 'Procurement & Purchasing',
      icon: 'ShoppingBag',
      route: 'institutional_procurement_operations',
      sortOrder: 12,
      status: 'active',
      requiredPermission: 'procurement.view',
      allowedRoles: ['super_admin', 'platform_admin', 'procurement_manager', 'purchasing_agent'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'procurement.view',
      name: 'View Procurement Operations',
      description: 'View suppliers, requisitions, purchase orders, and receipts'
    },
    {
      code: 'procurement.manage',
      name: 'Manage Procurement',
      description: 'Create requisitions, issue POs, and record receipts'
    },
    {
      code: 'supplier.approve',
      name: 'Approve Suppliers',
      description: 'Four-Eyes SoD authority to approve and qualify suppliers'
    },
    {
      code: 'purchaseOrder.approve',
      name: 'Approve Purchase Orders',
      description: 'Four-Eyes SoD authority to approve POs and amendments'
    },
    {
      code: 'procurement.exception.approve',
      name: 'Approve Procurement Exceptions',
      description: 'Four-Eyes SoD authority to approve procurement exceptions'
    }
  ]
};
