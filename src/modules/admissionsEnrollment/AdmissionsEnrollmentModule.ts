import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AdmissionsEnrollmentModule: UniversalModuleContract = {
  moduleId: 'mod_admissions_enrollment',
  name: 'Institutional Admissions & Enrollment Operations',
  displayName: 'Admissions & Enrollment Operations',
  description: 'Authoritative operational layer for admission cycles, campaigns, applications, reviews, evaluations, decisions, offers, enrollments, and waitlists.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.3.0',
  dependencies: [] as any[],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_admissions_enrollment',
      moduleId: 'mod_admissions_enrollment',
      label: 'Admissions & Enrollment',
      icon: 'UserPlus',
      route: 'admissions_enrollment',
      sortOrder: 3,
      status: 'active',
      requiredPermission: 'admissions.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_admin', 'admissions_officer', 'academic_coordinator'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'admissions.view',
      name: 'View Admissions & Enrollment',
      description: 'Access applicant records, applications, cycles, and enrollment statuses'
    },
    {
      code: 'admissions.manage',
      name: 'Manage Admissions & Enrollment',
      description: 'Authority to process applications, make decisions, issue offers, and manage enrollments'
    }
  ]
};
