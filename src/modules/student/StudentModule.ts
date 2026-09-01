import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentModule: UniversalModuleContract = {
  moduleId: 'mod_student',
  name: 'Student Master & Lifecycle Workspace',
  displayName: 'Student Master & Lifecycle Workspace',
  description: 'Authoritative single-source student identity, profile 360°, status lifecycle, guardian relations, and enrollment history.',
  version: '1.0.0',
  status: 'ENABLED',
  category: 'Student Lifecycle',
  provider: 'EduTech Core Platform Engine',
  dependencies: [
    { moduleId: 'mod_core' }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'student.view',
      name: 'View Student Directory',
      description: 'View student master records, class rosters, and basic details'
    },
    {
      code: 'student.create',
      name: 'Enroll Students',
      description: 'Register and enroll new students into the master database'
    },
    {
      code: 'student.edit',
      name: 'Edit Student Profiles',
      description: 'Update student demographics, contacts, and guardian profiles'
    },
    {
      code: 'student.status.change',
      name: 'Change Student Status',
      description: 'Authorize status changes (Active, On Leave, Inactive)'
    },
    {
      code: 'student.transfer',
      name: 'Transfer Student',
      description: 'Process official student transfer'
    },
    {
      code: 'student.withdraw',
      name: 'Withdraw Student',
      description: 'Process official student withdrawal'
    },
    {
      code: 'student.graduate',
      name: 'Graduate Student',
      description: 'Graduate students and transition to alumni records'
    },
    {
      code: 'student.export',
      name: 'Export Student Records',
      description: 'Export student rosters to CSV or Excel formats'
    },
    {
      code: 'student.document.view',
      name: 'View Student Documents',
      description: 'Access student certificates and records'
    },
    {
      code: 'student.document.manage',
      name: 'Manage Student Documents',
      description: 'Upload, verify, or archive student documents'
    },
    {
      code: 'student.guardian.view',
      name: 'View Guardians',
      description: 'Access parent and guardian contact profiles'
    },
    {
      code: 'student.guardian.manage',
      name: 'Manage Guardians',
      description: 'Link or update student guardian relationships'
    },
    {
      code: 'student.sensitive.view',
      name: 'View All Restricted Student Data',
      description: 'Access both medical and national identity restricted student information'
    },
    {
      code: 'student.medical.view',
      name: 'View Restricted Medical Info',
      description: 'View student health, medical conditions, and special needs support notes'
    },
    {
      code: 'student.identity.view',
      name: 'View National Identity Info',
      description: 'View national identification numbers (SSN/Aadhaar/Government ID)'
    }
  ],
  navigationItems: [
    {
      id: 'nav_student_parent',
      moduleId: 'mod_student',
      label: 'Student Master',
      icon: 'GraduationCap',
      route: 'students',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'student.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'registrar', 'student', 'parent'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_student_directory',
      moduleId: 'mod_student',
      parentId: 'nav_student_parent',
      label: 'All Students Directory',
      icon: 'Users',
      route: 'students',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'student.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'registrar'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_student_classes',
      moduleId: 'mod_student',
      parentId: 'nav_student_parent',
      label: 'Class Rosters',
      icon: 'BookOpen',
      route: 'students',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'student.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'registrar'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_student_transfers',
      moduleId: 'mod_student',
      parentId: 'nav_student_parent',
      label: 'Transfers & Withdrawals',
      icon: 'ArrowRightLeft',
      route: 'students',
      sortOrder: 3,
      status: 'active',
      requiredPermission: 'student.transfer',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_student_alumni',
      moduleId: 'mod_student',
      parentId: 'nav_student_parent',
      label: 'Graduated & Alumni',
      icon: 'Award',
      route: 'students',
      sortOrder: 4,
      status: 'active',
      requiredPermission: 'student.graduate',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'registrar'],
      targetContext: 'tenant'
    }
  ],
  eventsEmitted: [
    { eventName: 'STUDENT_CREATED', description: 'A new authoritative student record was created.' },
    { eventName: 'STUDENT_UPDATED', description: 'Student master demographics or contact details were updated.' },
    { eventName: 'STUDENT_STATUS_CHANGED', description: 'A student lifecycle status transition occurred.' },
    { eventName: 'STUDENT_TRANSFERRED', description: 'A student was officially transferred to another institution.' },
    { eventName: 'STUDENT_WITHDRAWN', description: 'A student was officially withdrawn from the institution.' },
    { eventName: 'STUDENT_GRADUATED', description: 'A student successfully graduated.' },
    { eventName: 'STUDENT_GUARDIAN_LINKED', description: 'A parent/guardian profile was linked to a student.' },
    { eventName: 'STUDENT_GUARDIAN_UNLINKED', description: 'A parent/guardian profile was unlinked from a student.' },
    { eventName: 'STUDENT_PHOTO_UPDATED', description: 'Student photograph was uploaded or changed.' },
    { eventName: 'STUDENT_DOCUMENT_ADDED', description: 'A student document/certificate was attached.' }
  ],
  reports: [
    { id: 'rpt_student_master_list', title: 'Student Master Directory Report', description: 'Complete exportable student roster with contact details', route: 'students', requiredPermission: 'student.export' },
    { id: 'rpt_student_class_distribution', title: 'Class & Section Strength Report', description: 'Gender breakdown and capacity utilization by class', route: 'students', requiredPermission: 'student.view' },
    { id: 'rpt_student_lifecycle', title: 'Lifecycle Transition Audit Report', description: 'History of transfers, withdrawals, and graduations', route: 'students', requiredPermission: 'student.status.change' }
  ]
};
