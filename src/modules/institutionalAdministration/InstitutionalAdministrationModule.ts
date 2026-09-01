import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalAdministrationModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_administration',
  name: 'Institutional Administration & Organization',
  displayName: 'Institutional Administration & Organization',
  description: 'Authoritative operational backbone for institution, campus, hierarchy, position, and committee management.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.1.0',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_administration',
      moduleId: 'mod_institutional_administration',
      label: 'Institutional Admin',
      icon: 'Building2',
      route: 'institutional_administration',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'institution.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'institution.view',
      name: 'View Institution Records',
      description: 'Access to institutional profile and campus data'
    },
    {
      code: 'institution.manage',
      name: 'Manage Institution Records',
      description: 'Authority to modify institutional profile and campuses'
    },
    {
      code: 'organization.view',
      name: 'View Organization Units',
      description: 'Access organization hierarchy and departments'
    },
    {
      code: 'organization.create',
      name: 'Create Organization Units',
      description: 'Create new departments, schools, and units'
    },
    {
      code: 'organization.update',
      name: 'Update Organization Units',
      description: 'Modify organizational structure and reporting lines'
    },
    {
      code: 'organization.archive',
      name: 'Archive Organization Units',
      description: 'Archive obsolete organizational units'
    },
    {
      code: 'position.view',
      name: 'View Positions',
      description: 'View organizational positions'
    },
    {
      code: 'position.manage',
      name: 'Manage Positions',
      description: 'Create and manage organizational positions'
    },
    {
      code: 'committee.view',
      name: 'View Committees',
      description: 'View institutional committees and memberships'
    },
    {
      code: 'committee.manage',
      name: 'Manage Committees',
      description: 'Create and manage committees and charters'
    },
    {
      code: 'organization.change.request',
      name: 'Request Organization Change',
      description: 'Submit structural change requests'
    },
    {
      code: 'organization.change.approve',
      name: 'Approve Organization Change',
      description: 'Review and approve structural changes with Four-Eyes enforcement'
    },
    {
      code: 'organization.change.implement',
      name: 'Implement Organization Change',
      description: 'Execute scheduled structural changes'
    }
  ]
};
