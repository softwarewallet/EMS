import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentExitModule: UniversalModuleContract = {
  moduleId: 'mod_student_exit',
  name: 'Student Exit Management',
  displayName: 'Student Exit & Clearance',
  description: 'Manage institutional withdrawals, student transfers, and multi-department clearance cases using dynamic, granular rule engines.',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Student Lifecycle',
  provider: 'EduTech Core Team',
  
  dependencies: [
    { moduleId: 'mod_core' },
    { moduleId: 'mod_student' },
    { moduleId: 'mod_academic' }
  ],
  
  configurationSchema: [
    {
      key: 'principal_approval_required',
      label: 'Require Principal Approval',
      type: 'boolean',
      defaultValue: true,
      description: 'Enforce that Principal sign-off is mandatory to complete student exits.'
    },
    {
      key: 'allow_guardian_initiation',
      label: 'Allow Parents to Initiate Request',
      type: 'boolean',
      defaultValue: true,
      description: 'Enable parents/guardians to submit transfer or withdrawal requests for their linked wards from the student portal.'
    },
    {
      key: 'allow_student_self_service',
      label: 'Allow Students to Initiate Request',
      type: 'boolean',
      defaultValue: false,
      description: 'Permit students to initiate their own exit requests, subject to guardian confirmation and institutional review.'
    }
  ],
  
  permissions: [
    { code: 'exit.view', name: 'View Exits', description: 'Can view exit and withdrawal requests, clearances, and dashboards.' },
    { code: 'exit.create', name: 'Create Exit Request', description: 'Can initiate or request student transfers and withdrawals.' },
    { code: 'exit.edit', name: 'Edit Exit Request', description: 'Can edit draft or active exit details and configurations.' },
    { code: 'exit.submit', name: 'Submit Exit Request', description: 'Can submit draft exit requests for institutional review.' },
    { code: 'exit.review', name: 'Review Exit Request', description: 'Can perform formal review and manage active exit workflows.' },
    { code: 'exit.approve', name: 'Approve Exit', description: 'Can grant final administrative approval for student exits.' },
    { code: 'exit.reject', name: 'Reject Exit', description: 'Can reject student transfer or withdrawal requests.' },
    { code: 'exit.complete', name: 'Complete Exit', description: 'Can execute final student status transitions and close academic enrollments.' },
    { code: 'exit.cancel', name: 'Cancel Exit Request', description: 'Can cancel active or draft exit requests.' },
    { code: 'exit.export', name: 'Export Exit Data', description: 'Can export exit logs, reports, and clearance sheets.' },
    
    { code: 'clearance.view', name: 'View Clearance', description: 'Can view student clearance cases and individual item logs.' },
    { code: 'clearance.manage', name: 'Manage Clearance Case', description: 'Can assign owners or update departments.' },
    { code: 'clearance.clear', name: 'Clear Department', description: 'Can mark a specific department clearance item as cleared.' },
    { code: 'clearance.block', name: 'Block Clearance', description: 'Can place a blocking hold on student clearance for outstanding obligations.' },
    { code: 'clearance.waive', name: 'Waive Clearance hold', description: 'Can bypass or waive department clearance holds with authorized administrative override.' },
    { code: 'clearance.configure', name: 'Configure Exit Policy', description: 'Can modify tenant-wide required clearance departments and policies.' }
  ],
  
  navigationItems: [
    {
      id: 'nav_student_exit',
      moduleId: 'mod_student_exit',
      label: 'Student Exit',
      icon: 'LogOut',
      sortOrder: 45,
      status: 'active',
      requiredPermission: 'exit.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer', 'accountant', 'librarian'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_exit_dashboard',
      moduleId: 'mod_student_exit',
      parentId: 'nav_student_exit',
      label: 'Exit Dashboard',
      icon: 'BarChart2',
      route: 'exit_dashboard',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'exit.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_exit_workspace',
      moduleId: 'mod_student_exit',
      parentId: 'nav_student_exit',
      label: 'Exit Workspace',
      icon: 'Briefcase',
      route: 'exit_workspace',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'exit.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_exit_clearance',
      moduleId: 'mod_student_exit',
      parentId: 'nav_student_exit',
      label: 'Clearance Center',
      icon: 'FileCheck',
      route: 'exit_clearance',
      sortOrder: 3,
      status: 'active',
      requiredPermission: 'clearance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar_officer', 'academic_coordinator', 'admission_officer', 'accountant', 'librarian'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_exit_settings',
      moduleId: 'mod_student_exit',
      parentId: 'nav_student_exit',
      label: 'Exit Policy Settings',
      icon: 'Settings',
      route: 'exit_settings',
      sortOrder: 4,
      status: 'active',
      requiredPermission: 'clearance.configure',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin'],
      targetContext: 'tenant'
    }
  ],
  
  eventsEmitted: [
    { eventName: 'EXIT_REQUEST_SUBMITTED', description: 'A student exit/withdrawal request was officially submitted to the institution.' },
    { eventName: 'EXIT_CLEARANCE_STARTED', description: 'Clearance tracking and cases were initiated for a student.' },
    { eventName: 'EXIT_CLEARANCE_COMPLETED', description: 'All required clearance items have been successfully cleared or waived.' },
    { eventName: 'EXIT_APPROVED', description: 'A student exit was officially approved by the Principal/Registrar.' },
    { eventName: 'STUDENT_TRANSFERRED', description: 'Student status transitioned to Transferred and enrollment was closed.' },
    { eventName: 'STUDENT_WITHDRAWN', description: 'Student status transitioned to Withdrawn and enrollment was closed.' }
  ]
};
