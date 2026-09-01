import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const TransportModule: UniversalModuleContract = {
  moduleId: 'mod_transport',
  name: 'Transport',
  displayName: 'Transport & Fleet',
  description: 'Authoritative transport, fleet, and student mobility management (Phase 7.11)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_student', optional: false },
    { moduleId: 'mod_finance', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'transport.view',
      name: 'View Transport',
      description: 'View transport dashboard and routing data'
    },
    {
      code: 'transport.create',
      name: 'Create Transport Data',
      description: 'Create transport routes, stops, and vehicles'
    },
    {
      code: 'transport.update',
      name: 'Update Transport Data',
      description: 'Update transport operations and assignments'
    },
    {
      code: 'transport.configure',
      name: 'Configure Transport',
      description: 'Configure transport policies and settings'
    }
  ],
  navigationItems: [
    {
      id: 'transport_workspace',
      moduleId: 'mod_transport',
      label: 'Transport & Fleet',
      icon: 'Bus',
      route: '/transport/workspace',
      requiredPermission: 'transport.view',
      sortOrder: 1,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] TransportModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] TransportModule disabled for tenant ${tenantId}`);
  }
};
