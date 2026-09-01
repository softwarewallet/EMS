import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const HostelModule: UniversalModuleContract = {
  moduleId: 'mod_hostel',
  name: 'Hostel',
  displayName: 'Hostel & Residence',
  description: 'Authoritative infrastructure for student accommodation and residence management (Phase 7.12A)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Infrastructure',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_student', optional: false },
    { moduleId: 'mod_finance', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'hostel.view',
      name: 'View Hostel',
      description: 'View hostel dashboards and residence data'
    },
    {
      code: 'hostel.create',
      name: 'Create Hostel Data',
      description: 'Create hostels, rooms, and beds'
    },
    {
      code: 'hostel.allocation.view',
      name: 'View Allocations',
      description: 'View student room and bed allocations'
    },
    {
      code: 'hostel.allocation.create',
      name: 'Create Allocations',
      description: 'Allocate students to rooms and beds'
    }
  ],
  navigationItems: [
    {
      id: 'hostel_workspace',
      moduleId: 'mod_hostel',
      label: 'Hostel & Residence',
      icon: 'Building',
      route: '/hostel/workspace',
      requiredPermission: 'hostel.view',
      sortOrder: 1,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] HostelModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] HostelModule disabled for tenant ${tenantId}`);
  }
};
