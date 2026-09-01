import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const HumanResourcesWorkforceModule: UniversalModuleContract = {
  moduleId: 'mod_human_resources_workforce',
  name: 'Institutional Human Resources & Workforce',
  displayName: 'HR & Workforce',
  description: 'Authoritative operational module for employee master, lifecycle, and workforce management.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.1.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' }
  ], 
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_human_resources_workforce',
      moduleId: 'mod_human_resources_workforce',
      label: 'HR & Workforce',
      icon: 'Briefcase',
      route: 'human_resources_workforce',
      sortOrder: 10,
      status: 'active',
      requiredPermission: 'hr.employee.view',
      allowedRoles: ['super_admin', 'platform_admin', 'hr_manager', 'hr_director'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'hr.employee.view',
      name: 'View Employee Master',
      description: 'Access employee directory, profiles, and employment status'
    },
    {
      code: 'hr.employee.manage',
      name: 'Manage Employees',
      description: 'Onboard employees, manage positions, and handle separations'
    },
    {
      code: 'hr.leave.approve',
      name: 'Approve Leave',
      description: 'Four-Eyes SoD authority to approve workforce leave'
    },
    {
      code: 'hr.attendance.correct.approve',
      name: 'Approve Attendance Corrections',
      description: 'Authority to approve historical attendance amendments'
    }
  ]
};
