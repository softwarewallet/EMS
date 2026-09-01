import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AdmissionsModule: UniversalModuleContract = {
  moduleId: 'mod_admissions',
  name: 'Admissions',
  displayName: 'Admissions & Enrollment',
  description: 'Manage the complete student admission lifecycle: from enquiries and applications, through document verification, entrance tests, interviews, eligibility scoring, selection, approval, to student creation and enrollment allocation.',
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
      key: 'application_number_prefix',
      label: 'Application Number Prefix',
      type: 'string',
      defaultValue: 'ADM',
      required: true,
      description: 'Prefix used for generating admission application numbers.'
    },
    {
      key: 'require_entrance_test',
      label: 'Require Entrance Test',
      type: 'boolean',
      defaultValue: false,
      description: 'Require an entrance test by default for applicants.'
    },
    {
      key: 'require_interview',
      label: 'Require Interview',
      type: 'boolean',
      defaultValue: false,
      description: 'Require an interview panel evaluation by default.'
    },
    {
      key: 'require_approval_workflow',
      label: 'Require Approval Workflow',
      type: 'boolean',
      defaultValue: true,
      description: 'Require Principal sign-off before admitting applicant.'
    }
  ],
  
  permissions: [
    { code: 'admission.view', name: 'View Admissions', description: 'Can view admission enquiries, applications, and reports.' },
    { code: 'admission.create', name: 'Create Application', description: 'Can create new enquiries and applications.' },
    { code: 'admission.edit', name: 'Edit Application', description: 'Can edit admission applications.' },
    { code: 'admission.submit', name: 'Submit Application', description: 'Can submit draft applications for review.' },
    { code: 'admission.verify', name: 'Verify Application', description: 'Can inspect and process applications in verification stage.' },
    { code: 'admission.document.view', name: 'View Documents', description: 'Can view applicant uploaded certificates.' },
    { code: 'admission.document.upload', name: 'Upload Documents', description: 'Can upload document attachments to applications.' },
    { code: 'admission.document.verify', name: 'Verify Documents', description: 'Can mark applicant documents as verified.' },
    { code: 'admission.document.reject', name: 'Reject Documents', description: 'Can reject applicant documents with remarks.' },
    { code: 'admission.test.view', name: 'View Entrance Tests', description: 'Can view entrance exam schedules and scores.' },
    { code: 'admission.test.manage', name: 'Manage Entrance Tests', description: 'Can schedule and score entrance tests.' },
    { code: 'admission.interview.view', name: 'View Interviews', description: 'Can view interview schedules and recommendations.' },
    { code: 'admission.interview.manage', name: 'Manage Interviews', description: 'Can conduct and score applicant interviews.' },
    { code: 'admission.select', name: 'Select Applicant', description: 'Can mark applicants as selected, waitlisted, or rejected.' },
    { code: 'admission.waitlist', name: 'Waitlist Management', description: 'Can manage waitlisted applicants and offer seats.' },
    { code: 'admission.approve', name: 'Approve Admission', description: 'Can grant final approval for admission offers.' },
    { code: 'admission.reject', name: 'Reject Admission', description: 'Can reject applications.' },
    { code: 'admission.admit', name: 'Admit Student', description: 'Can execute final admission, creating student & enrollment records.' },
    { code: 'admission.enroll', name: 'Allocate Class & Section', description: 'Can assign class and section to admitted student.' },
    { code: 'admission.export', name: 'Export Admission Data', description: 'Can export admission rosters and reports.' },
    { code: 'admission.configure', name: 'Configure Admissions', description: 'Can manage admission sessions, seat capacity, and settings.' },
    { code: 'admission.report.view', name: 'View Admission Reports', description: 'Can access admission analytics, funnels, and reports.' }
  ],
  
  navigationItems: [
    {
      id: 'nav_admissions',
      moduleId: 'mod_admissions',
      label: 'Admissions',
      icon: 'UserPlus',
      sortOrder: 35,
      status: 'active',
      requiredPermission: 'admission.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator', 'admission_officer', 'front_office'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_dashboard',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Dashboard',
      icon: 'PieChart',
      route: 'admissions_dashboard',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'admission.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator', 'admission_officer', 'front_office'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_enquiries',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Enquiries',
      icon: 'MessageSquare',
      route: 'admissions_enquiries',
      sortOrder: 2,
      status: 'active',
      requiredPermission: 'admission.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator', 'admission_officer', 'front_office'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_applications',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Applications',
      icon: 'FileText',
      route: 'admissions_applications',
      sortOrder: 3,
      status: 'active',
      requiredPermission: 'admission.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_verification',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Pending Verification',
      icon: 'ShieldCheck',
      route: 'admissions_verification',
      sortOrder: 4,
      status: 'active',
      requiredPermission: 'admission.verify',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator', 'admission_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_tests',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Entrance Tests',
      icon: 'FileQuestion',
      route: 'admissions_tests',
      sortOrder: 5,
      status: 'active',
      requiredPermission: 'admission.test.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_interviews',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Interviews',
      icon: 'Users',
      route: 'admissions_interviews',
      sortOrder: 6,
      status: 'active',
      requiredPermission: 'admission.interview.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_selection',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Selection & Merit',
      icon: 'Award',
      route: 'admissions_selection',
      sortOrder: 7,
      status: 'active',
      requiredPermission: 'admission.select',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_approvals',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Approvals & Admit',
      icon: 'CheckCircle2',
      route: 'admissions_approvals',
      sortOrder: 8,
      status: 'active',
      requiredPermission: 'admission.approve',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_reports',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Reports',
      icon: 'BarChart3',
      route: 'admissions_reports',
      sortOrder: 9,
      status: 'active',
      requiredPermission: 'admission.report.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal', 'vice_principal', 'admission_coordinator'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_admissions_settings',
      moduleId: 'mod_admissions',
      parentId: 'nav_admissions',
      label: 'Settings & Sessions',
      icon: 'Settings',
      route: 'admissions_settings',
      sortOrder: 10,
      status: 'active',
      requiredPermission: 'admission.configure',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin', 'principal'],
      targetContext: 'tenant'
    }
  ],
  
  eventsEmitted: [
    { eventName: 'ADMISSION_APPLICATION_SUBMITTED', description: 'An admission application was submitted.' },
    { eventName: 'ADMISSION_DOCUMENT_VERIFIED', description: 'An applicant document was verified.' },
    { eventName: 'ADMISSION_DOCUMENT_REJECTED', description: 'An applicant document was rejected.' },
    { eventName: 'ADMISSION_SELECTED', description: 'An applicant was selected for admission.' },
    { eventName: 'ADMISSION_WAITLISTED', description: 'An applicant was placed on the waitlist.' },
    { eventName: 'ADMISSION_APPROVED', description: 'An applicant was approved for admission.' },
    { eventName: 'STUDENT_ADMITTED', description: 'A student was successfully admitted and their student record created.' },
    { eventName: 'STUDENT_ENROLLED', description: 'An admitted student was enrolled in an academic year, class, and section.' }
  ],
  
  reports: [
    { id: 'rpt_admission_app_list', title: 'Application List Report', description: 'Complete roster of applications with filters', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_admission_status', title: 'Admission Status Report', description: 'Stage-by-stage status distribution', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_doc_verification', title: 'Document Verification Audit Report', description: 'Status of verified and pending documents', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_enquiry_conversion', title: 'Enquiry Conversion Report', description: 'Lead generation to application conversion metrics', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_class_admission', title: 'Class-wise Capacity & Admission Report', description: 'Seat allocation and capacity utilization per class', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_merit_list', title: 'Merit List Report', description: 'Calculated score ranks by entrance test and academic history', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_waitlist', title: 'Waitlist Tracking Report', description: 'Current waitlist positions and seat offers', route: 'admissions_reports', requiredPermission: 'admission.report.view' },
    { id: 'rpt_pending_approval', title: 'Pending Approval Sign-off Report', description: 'Selected applications awaiting principal approval', route: 'admissions_reports', requiredPermission: 'admission.report.view' }
  ]
};
