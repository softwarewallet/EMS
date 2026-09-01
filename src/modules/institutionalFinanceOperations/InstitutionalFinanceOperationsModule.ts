import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalFinanceOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_finance_operations',
  name: 'Institutional Finance & Student Billing',
  displayName: 'Finance Operations',
  description: 'Authoritative operational module for student fees, billing, payments, and receivables.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.2.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' }
  ], 
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_finance_operations',
      moduleId: 'mod_institutional_finance_operations',
      label: 'Finance & Billing',
      icon: 'DollarSign',
      route: 'institutional_finance_operations',
      sortOrder: 11,
      status: 'active',
      requiredPermission: 'finance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'finance_manager', 'bursar'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'finance.view',
      name: 'View Financial Records',
      description: 'Access invoices, payments, and student financial accounts'
    },
    {
      code: 'finance.manage',
      name: 'Manage Financial Operations',
      description: 'Issue charges, process payments, and manage billing'
    },
    {
      code: 'finance.refund.approve',
      name: 'Approve Refunds',
      description: 'Four-Eyes SoD authority to approve refunds and reversals'
    },
    {
      code: 'finance.hold.manage',
      name: 'Manage Financial Holds',
      description: 'Place or release financial holds on student accounts'
    }
  ]
};
