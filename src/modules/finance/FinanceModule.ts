import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const FinanceModule: UniversalModuleContract = {
  moduleId: 'mod_finance',
  name: 'Finance',
  displayName: 'Fees, Billing & Payments',
  description: 'Authoritative financial layer and ledger for fees, billing, and payments (Phase 7.10)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Finance',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_core', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'finance.view',
      name: 'View Finance',
      description: 'View financial dashboards and reports'
    },
    {
      code: 'finance.create',
      name: 'Create Finance Data',
      description: 'Create financial structures and billing data'
    },
    {
      code: 'finance.update',
      name: 'Update Finance Data',
      description: 'Update financial ledgers and settings'
    },
    {
      code: 'finance.configure',
      name: 'Configure Finance',
      description: 'Configure fee structures and payment settings'
    }
  ],
  navigationItems: [
    {
      id: 'finance_workspace',
      moduleId: 'mod_finance',
      label: 'Finance & Billing',
      icon: 'CreditCard',
      route: '/finance/workspace',
      requiredPermission: 'finance.view',
      sortOrder: 1,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] FinanceModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] FinanceModule disabled for tenant ${tenantId}`);
  }
};
