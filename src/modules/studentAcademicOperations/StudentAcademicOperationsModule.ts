import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentAcademicOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_student_academic_operations',
  name: 'Institutional Student Academic Operations',
  displayName: 'Academic Operations & Registration',
  description: 'Authoritative operational module for student course registration, academic planning, advising, and registration governance.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.5.0',
  dependencies: [], // Inherently depends on Phase 10.1, 10.2, 10.3, 10.4
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_student_academic_operations',
      moduleId: 'mod_student_academic_operations',
      label: 'Academic Operations',
      icon: 'BookOpen',
      route: 'student_academic_operations',
      sortOrder: 5,
      status: 'active',
      requiredPermission: 'student.registration.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'registrar', 'academic_advisor'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'student.registration.view',
      name: 'View Registrations',
      description: 'Access student course registrations and academic plans'
    },
    {
      code: 'student.registration.manage',
      name: 'Manage Registrations',
      description: 'Update registrations, manage add/drops, and waitlists'
    },
    {
      code: 'student.registration.exception.approve',
      name: 'Approve Registration Exceptions',
      description: 'Four-Eyes SoD approval authority for registration overrides'
    }
  ]
};
