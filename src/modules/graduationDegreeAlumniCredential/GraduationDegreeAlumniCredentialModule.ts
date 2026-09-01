import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const GraduationDegreeAlumniCredentialModule: UniversalModuleContract = {
  moduleId: 'mod_graduation_degree_alumni_credential',
  name: 'Institutional Graduation, Degree Award & Alumni',
  displayName: 'Graduation & Alumni',
  description: 'Authoritative operational module for graduation clearance, degree awarding, credentials, and alumni lifecycles.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.8.0',
  dependencies: [], 
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_graduation_degree_alumni_credential',
      moduleId: 'mod_graduation_degree_alumni_credential',
      label: 'Graduation & Alumni',
      icon: 'GraduationCap',
      route: 'graduation_degree_alumni_credential',
      sortOrder: 8,
      status: 'active',
      requiredPermission: 'graduation.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'registrar', 'alumni_director'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'graduation.view',
      name: 'View Graduation Records',
      description: 'Access graduation applications, clearance items, and degree awards'
    },
    {
      code: 'degree.award.manage',
      name: 'Manage Degree Awards',
      description: 'Process graduation cohorts and propose degree awards'
    },
    {
      code: 'credential.suspend',
      name: 'Revoke Credentials',
      description: 'Four-Eyes SoD authority to suspend or revoke credentials'
    }
  ]
};
