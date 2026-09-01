import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentLifecycleModule: UniversalModuleContract = {
  moduleId: 'mod_student_lifecycle',
  name: 'Institutional Student Lifecycle',
  displayName: 'Student Lifecycle & Records',
  description: 'Authoritative operational module for managing the complete student institutional lifecycle, records, and student services.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.4.0',
  dependencies: [], // Intentionally empty array for TS compliance, logically depends on 10.1, 10.2, 10.3
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_student_lifecycle',
      moduleId: 'mod_student_lifecycle',
      label: 'Student Lifecycle',
      icon: 'GraduationCap', // Will map to Lucide icon in Workspace
      route: 'student_lifecycle',
      sortOrder: 4,
      status: 'active',
      requiredPermission: 'student.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'student_services_officer', 'registrar'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'student.view',
      name: 'View Student Records',
      description: 'Access student master records and basic lifecycle information'
    },
    {
      code: 'student.manage',
      name: 'Manage Student Records',
      description: 'Update student profiles, holds, and process lifecycle events'
    }
  ]
};
