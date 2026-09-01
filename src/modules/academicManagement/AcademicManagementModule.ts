import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AcademicManagementModule: UniversalModuleContract = {
  moduleId: 'mod_academic_management',
  name: 'Institutional Academic Management & Academic Operations',
  displayName: 'Institutional Academic Management & Operations',
  description: 'Authoritative academic operating layer for academic units, programs, curriculum, courses, terms, calendar, and offerings.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.2.0',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_academic_management',
      moduleId: 'mod_academic_management',
      label: 'Academic Management',
      icon: 'BookOpen',
      route: 'academic_management',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'academic.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'academic_coordinator'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'academic.view',
      name: 'View Academic Operations',
      description: 'Access academic programs, courses, and curricula'
    },
    {
      code: 'academic.manage',
      name: 'Manage Academic Operations',
      description: 'Authority to modify programs, courses, and terms'
    }
  ]
};
