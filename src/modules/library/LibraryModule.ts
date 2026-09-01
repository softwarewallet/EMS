import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const LibraryModule: UniversalModuleContract = {
  moduleId: 'mod_library',
  name: 'Library',
  displayName: 'Library & Learning Resource Management',
  description: 'Authoritative engine for library profiles, catalogue, copy inventory, memberships, acquisitions, circulation lending, returns, renewals, reservations, overdue management, fines, lost/damaged workflows, and analytics (Phase 7.15A & 7.15B)',
  version: '2.0.0',
  status: 'AVAILABLE',
  category: 'Infrastructure',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_student', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'library.view',
      name: 'View Library Workspace',
      description: 'Access library overview, catalogue, digital resources, and locations'
    },
    {
      code: 'library.create',
      name: 'Create Library Resources',
      description: 'Create master catalogue resource records and profiles'
    },
    {
      code: 'library.update',
      name: 'Update Library Resources',
      description: 'Update metadata and version snapshot records'
    },
    {
      code: 'library.approve',
      name: 'Approve Resources',
      description: 'Approve resources submitted for review'
    },
    {
      code: 'library.publish',
      name: 'Publish Resources',
      description: 'Activate resources for general circulation and digital view'
    },
    {
      code: 'library.manage_copies',
      name: 'Manage Physical Copies',
      description: 'Register copies, assign accession numbers, barcodes, and locations'
    },
    {
      code: 'library.manage_memberships',
      name: 'Manage Library Memberships',
      description: 'Register student/staff memberships and check eligibility'
    },
    {
      code: 'library.manage_categories',
      name: 'Manage Categories',
      description: 'Manage classification and category trees'
    },
    {
      code: 'library.manage_locations',
      name: 'Manage Library Locations',
      description: 'Manage library rooms, shelving, and capacity'
    },
    {
      code: 'library.manage_acquisitions',
      name: 'Manage Acquisitions',
      description: 'Create and track procurement purchase orders'
    },
    {
      code: 'library.export',
      name: 'Export Catalogue Data',
      description: 'Export resource catalogue and copy inventory records'
    },
    {
      code: 'library.configure',
      name: 'Configure Library Settings',
      description: 'Manage library profiles, opening hours, and policy defaults'
    },
    // Phase 7.15B Circulation Permissions
    {
      code: 'library.circulation.view',
      name: 'View Circulation Registers',
      description: 'View active loans, return history, reservation queues, and fine registers'
    },
    {
      code: 'library.circulation.issue',
      name: 'Issue Library Loans',
      description: 'Scan barcodes/QRs and issue physical resource copies to eligible members'
    },
    {
      code: 'library.circulation.return',
      name: 'Process Resource Returns',
      description: 'Check in returned physical copies, record conditions, and trigger overdue calculations'
    },
    {
      code: 'library.circulation.renew',
      name: 'Renew Active Loans',
      description: 'Extend loan due dates according to policy renewal limits'
    },
    {
      code: 'library.circulation.reserve',
      name: 'Create Reservations',
      description: 'Place holds and reservation requests on physical library resources'
    },
    {
      code: 'library.circulation.manage_holds',
      name: 'Manage Holds',
      description: 'Fulfill, release, and re-order reservation hold queues'
    },
    {
      code: 'library.fines.view',
      name: 'View Library Fines',
      description: 'View calculated overdue, lost item, and damage fine ledgers'
    },
    {
      code: 'library.fines.create',
      name: 'Create Fines',
      description: 'Generate manual or rule-based library fine obligations'
    },
    {
      code: 'library.fines.adjust',
      name: 'Adjust Fines',
      description: 'Request or approve partial reductions on library fines'
    },
    {
      code: 'library.fines.waive',
      name: 'Waive Fines',
      description: 'Authorize full or partial fine waivers with mandatory audit logs'
    },
    {
      code: 'library.lost_items.manage',
      name: 'Manage Lost Resources',
      description: 'Report lost copies, confirm replacement fees, or process recoveries'
    },
    {
      code: 'library.damage.manage',
      name: 'Manage Damage Reports',
      description: 'Assess copy damage severity, calculate repairs, and process resolutions'
    },
    {
      code: 'library.circulation.export',
      name: 'Export Circulation Data',
      description: 'Export loan registers, overdue reports, and fine histories'
    }
  ],
  navigationItems: [
    {
      id: 'library_workspace',
      moduleId: 'mod_library',
      label: 'Library Management',
      icon: 'BookOpen',
      route: '/library/workspace',
      requiredPermission: 'library.view',
      sortOrder: 47,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] LibraryModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] LibraryModule disabled for tenant ${tenantId}`);
  }
};
