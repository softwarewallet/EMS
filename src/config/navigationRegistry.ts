import { NavigationItemDefinition } from '../types';

/**
 * EMS Centralized Navigation Registry
 * Declares all hierarchical workspace navigation items for Platform Super Administrator, Platform Administrator, and other roles.
 */
export const BASE_NAVIGATION_ITEMS: NavigationItemDefinition[] = [
  // ==========================================================================
  // SHARED DASHBOARD
  // ==========================================================================
  {
    id: 'nav_dashboard',
    moduleId: 'core',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    route: 'my_school',
    sortOrder: 10,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'school_owner', 'tenant_admin', 'principal', 'director', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'examination_coordinator', 'accountant', 'hr_manager', 'student', 'parent', 'librarian', 'transport_manager', 'it_manager', 'govt_admin', 'district_admin'],
    targetContext: 'all'
  },

  // ==========================================================================
  // DECISION INTELLIGENCE & GOVERNANCE
  // ==========================================================================
  {
    id: 'nav_decision_intelligence_governance',
    moduleId: 'mod_decision_intelligence_governance',
    label: 'Decision Governance',
    icon: 'Scale',
    route: 'decision_intelligence_governance',
    sortOrder: 999,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'principal', 'director'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 1. PLATFORM SUPER ADMINISTRATOR NAVIGATION
  // ==========================================================================
  {
    id: 'nav_platform_parent',
    moduleId: 'core',
    label: 'Tenant & Campus Governance',
    icon: 'Building2',
    sortOrder: 20,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_platform_command_center',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Platform Command Center',
    icon: 'LayoutDashboard',
    route: 'tenants',
    sortOrder: 21,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_all_tenants',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'All Tenants',
    icon: 'Globe',
    route: 'tenants',
    sortOrder: 22,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_tenant_config',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Tenant Configuration',
    icon: 'Settings2',
    route: 'settings',
    sortOrder: 23,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_tenant_branding',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Tenant Branding',
    icon: 'Palette',
    route: 'settings',
    sortOrder: 24,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_enabled_modules',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Enabled Modules',
    icon: 'CheckSquare',
    route: 'modules',
    sortOrder: 25,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_institution_types',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Institution Types',
    icon: 'Layers',
    route: 'settings',
    sortOrder: 26,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_academic_configs',
    moduleId: 'academic',
    parentId: 'nav_platform_parent',
    label: 'Academic Configurations',
    icon: 'Sliders',
    route: 'academic',
    sortOrder: 27,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_institution_status',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Institution Status',
    icon: 'Activity',
    route: 'audit',
    sortOrder: 28,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_tenant_activity',
    moduleId: 'core',
    parentId: 'nav_platform_parent',
    label: 'Tenant Activity',
    icon: 'ClipboardList',
    route: 'audit',
    sortOrder: 29,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },

  // 1.2 Identity & Security
  {
    id: 'nav_identity_parent',
    moduleId: 'core',
    label: 'Identity & Security',
    icon: 'ShieldCheck',
    sortOrder: 40,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_all_users',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Users',
    icon: 'Users',
    route: 'users',
    sortOrder: 41,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_roles_permissions',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Roles & Permissions',
    icon: 'Shield',
    route: 'roles',
    sortOrder: 42,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_security_dash',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Security Dashboard',
    icon: 'ShieldAlert',
    route: 'security_tests',
    sortOrder: 43,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_sessions',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Active Sessions',
    icon: 'Monitor',
    route: 'security_tests',
    sortOrder: 44,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_login_activity',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Login Activity',
    icon: 'LogIn',
    route: 'audit',
    sortOrder: 45,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_failed_access',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Failed Access Logs',
    icon: 'ShieldAlert',
    route: 'security_tests',
    sortOrder: 46,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_security_events',
    moduleId: 'core',
    parentId: 'nav_identity_parent',
    label: 'Security Events',
    icon: 'AlertTriangle',
    route: 'security_tests',
    sortOrder: 47,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },

  // 1.3 Modules & Extensions
  {
    id: 'nav_modules_parent',
    moduleId: 'core',
    label: 'Modules & Extensions',
    icon: 'Boxes',
    sortOrder: 60,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_module_registry',
    moduleId: 'core',
    parentId: 'nav_modules_parent',
    label: 'Module Registry',
    icon: 'Package',
    route: 'modules',
    sortOrder: 61,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_module_catalog',
    moduleId: 'core',
    parentId: 'nav_modules_parent',
    label: 'Module Catalog',
    icon: 'ShoppingBag',
    route: 'modules',
    sortOrder: 62,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_module_versions',
    moduleId: 'core',
    parentId: 'nav_modules_parent',
    label: 'Module Versions',
    icon: 'GitBranch',
    route: 'modules',
    sortOrder: 63,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_module_dependencies',
    moduleId: 'core',
    parentId: 'nav_modules_parent',
    label: 'Dependencies',
    icon: 'Network',
    route: 'modules',
    sortOrder: 64,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_module_health',
    moduleId: 'core',
    parentId: 'nav_modules_parent',
    label: 'Module Health',
    icon: 'HeartPulse',
    route: 'security_tests',
    sortOrder: 65,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },

  // 1.4 Platform Operations & Settings
  {
    id: 'nav_settings_parent',
    moduleId: 'core',
    label: 'Platform Operations & Settings',
    icon: 'Settings',
    sortOrder: 70,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_settings_general',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'General Settings',
    icon: 'Sliders',
    route: 'settings',
    sortOrder: 71,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_settings_notifications',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 72,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_settings_integrations',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Integrations',
    icon: 'Workflow',
    route: 'settings',
    sortOrder: 73,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_settings_api',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'API Keys',
    icon: 'Code2',
    route: 'settings',
    sortOrder: 74,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_settings_sysconfig',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'System Configuration',
    icon: 'SlidersHorizontal',
    route: 'settings',
    sortOrder: 75,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_system_health',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'System Health',
    icon: 'Activity',
    route: 'security_tests',
    sortOrder: 76,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_system_jobs',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Background Jobs',
    icon: 'Cpu',
    route: 'audit',
    sortOrder: 77,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_system_services',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'System Services',
    icon: 'Server',
    route: 'settings',
    sortOrder: 78,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_system_maintenance',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Maintenance',
    icon: 'Wrench',
    route: 'settings',
    sortOrder: 79,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_audit_logs',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Audit Logs',
    icon: 'FileText',
    route: 'audit',
    sortOrder: 80,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_system_events',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'System Events',
    icon: 'Radio',
    route: 'audit',
    sortOrder: 81,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_admin_actions',
    moduleId: 'core',
    parentId: 'nav_settings_parent',
    label: 'Administrative Actions',
    icon: 'UserCog',
    route: 'audit',
    sortOrder: 82,
    status: 'active',
    allowedRoles: ['super_admin'],
    targetContext: 'platform'
  },

  // ==========================================================================
  // 2. PLATFORM ADMINISTRATOR NAVIGATION
  // ==========================================================================
  // Institutions (Platform Admin)
  {
    id: 'nav_pa_institutions_parent',
    moduleId: 'core',
    label: 'Institutions',
    icon: 'Building',
    sortOrder: 110,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_institutions',
    moduleId: 'core',
    parentId: 'nav_pa_institutions_parent',
    label: 'Institutions',
    icon: 'Building2',
    route: 'tenants',
    sortOrder: 111,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_campuses',
    moduleId: 'core',
    parentId: 'nav_pa_institutions_parent',
    label: 'Campuses',
    icon: 'MapPin',
    route: 'tenants',
    sortOrder: 112,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_institution_config',
    moduleId: 'core',
    parentId: 'nav_pa_institutions_parent',
    label: 'Institution Configuration',
    icon: 'Sliders',
    route: 'settings',
    sortOrder: 113,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // Modules (Platform Admin)
  {
    id: 'nav_pa_modules_parent',
    moduleId: 'core',
    label: 'Modules',
    icon: 'Boxes',
    sortOrder: 120,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_module_registry',
    moduleId: 'core',
    parentId: 'nav_pa_modules_parent',
    label: 'Module Registry',
    icon: 'Package',
    route: 'modules',
    sortOrder: 121,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_tenant_modules',
    moduleId: 'core',
    parentId: 'nav_pa_modules_parent',
    label: 'Tenant Modules',
    icon: 'CheckSquare',
    route: 'modules',
    sortOrder: 122,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // Users (Platform Admin)
  {
    id: 'nav_pa_users_parent',
    moduleId: 'core',
    label: 'Users',
    icon: 'Users',
    sortOrder: 130,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_users',
    moduleId: 'core',
    parentId: 'nav_pa_users_parent',
    label: 'Users',
    icon: 'UserCheck',
    route: 'users',
    sortOrder: 131,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_roles',
    moduleId: 'core',
    parentId: 'nav_pa_users_parent',
    label: 'Roles',
    icon: 'Shield',
    route: 'roles',
    sortOrder: 132,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_permissions',
    moduleId: 'core',
    parentId: 'nav_pa_users_parent',
    label: 'Permissions',
    icon: 'KeyRound',
    route: 'roles',
    sortOrder: 133,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // Analytics (Platform Admin)
  {
    id: 'nav_pa_analytics_parent',
    moduleId: 'core',
    label: 'Analytics',
    icon: 'BarChart3',
    sortOrder: 140,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_analytics_overview',
    moduleId: 'core',
    parentId: 'nav_pa_analytics_parent',
    label: 'Platform Overview',
    icon: 'Gauge',
    route: 'reports',
    sortOrder: 141,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_analytics_usage',
    moduleId: 'core',
    parentId: 'nav_pa_analytics_parent',
    label: 'Usage',
    icon: 'Activity',
    route: 'reports',
    sortOrder: 142,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // Audit (Platform Admin)
  {
    id: 'nav_pa_audit_parent',
    moduleId: 'core',
    label: 'Audit',
    icon: 'ClipboardList',
    sortOrder: 150,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_activity_logs',
    moduleId: 'core',
    parentId: 'nav_pa_audit_parent',
    label: 'Activity Logs',
    icon: 'FileText',
    route: 'audit',
    sortOrder: 151,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // Settings (Platform Admin)
  {
    id: 'nav_pa_settings_parent',
    moduleId: 'core',
    label: 'Settings',
    icon: 'Settings',
    sortOrder: 160,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_settings_notifications',
    moduleId: 'core',
    parentId: 'nav_pa_settings_parent',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 161,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },
  {
    id: 'nav_pa_settings_config',
    moduleId: 'core',
    parentId: 'nav_pa_settings_parent',
    label: 'Configuration',
    icon: 'Wrench',
    route: 'settings',
    sortOrder: 162,
    status: 'active',
    allowedRoles: ['platform_admin'],
    targetContext: 'platform'
  },

  // ==========================================================================
  // 3. INSTITUTION MANAGEMENT / OWNER NAVIGATION
  // ==========================================================================
  {
    id: 'nav_imo_institution_parent',
    moduleId: 'core',
    label: 'Institution',
    icon: 'Building',
    sortOrder: 200,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_institution_profile',
    moduleId: 'core',
    parentId: 'nav_imo_institution_parent',
    label: 'Institution Profile',
    icon: 'Building2',
    route: 'tenants',
    sortOrder: 201,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_campuses',
    moduleId: 'core',
    parentId: 'nav_imo_institution_parent',
    label: 'Campuses',
    icon: 'MapPin',
    route: 'tenants',
    sortOrder: 202,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_buildings',
    moduleId: 'core',
    parentId: 'nav_imo_institution_parent',
    label: 'Buildings',
    icon: 'Home',
    route: 'tenants',
    sortOrder: 203,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_classrooms',
    moduleId: 'core',
    parentId: 'nav_imo_institution_parent',
    label: 'Classrooms',
    icon: 'DoorOpen',
    route: 'academic',
    sortOrder: 204,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_institution_settings',
    moduleId: 'core',
    parentId: 'nav_imo_institution_parent',
    label: 'Institution Settings',
    icon: 'Settings2',
    route: 'settings',
    sortOrder: 205,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Academics (Institution Management)
  {
    id: 'nav_imo_academics_parent',
    moduleId: 'academic',
    label: 'Academics',
    icon: 'BookOpen',
    sortOrder: 210,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_academic_years',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Academic Years',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 211,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_classes',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 212,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_sections',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Sections',
    icon: 'Layers',
    route: 'academic',
    sortOrder: 213,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_subjects',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Subjects',
    icon: 'BookMarked',
    route: 'academic',
    sortOrder: 214,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_curriculum',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Curriculum',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 215,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_academic_config',
    moduleId: 'academic',
    parentId: 'nav_imo_academics_parent',
    label: 'Academic Configuration',
    icon: 'Sliders',
    route: 'academic',
    sortOrder: 216,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Students (Institution Management)
  {
    id: 'nav_imo_students_parent',
    moduleId: 'students',
    label: 'Students',
    icon: 'Users',
    sortOrder: 220,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_students_list',
    moduleId: 'students',
    parentId: 'nav_imo_students_parent',
    label: 'Students',
    icon: 'UserCheck',
    route: 'students',
    sortOrder: 221,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_admissions',
    moduleId: 'students',
    parentId: 'nav_imo_students_parent',
    label: 'Admissions',
    icon: 'UserPlus',
    route: 'students',
    sortOrder: 222,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_enrollments',
    moduleId: 'students',
    parentId: 'nav_imo_students_parent',
    label: 'Enrollments',
    icon: 'UserCog',
    route: 'students',
    sortOrder: 223,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_guardians',
    moduleId: 'students',
    parentId: 'nav_imo_students_parent',
    label: 'Guardians',
    icon: 'HeartHandshake',
    route: 'students',
    sortOrder: 224,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_student_documents',
    moduleId: 'students',
    parentId: 'nav_imo_students_parent',
    label: 'Student Documents',
    icon: 'FolderOpen',
    route: 'students',
    sortOrder: 225,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_alumni',
    moduleId: 'mod_alumni_placement',
    parentId: 'nav_imo_students_parent',
    label: 'Alumni & Placements',
    icon: 'Briefcase',
    route: 'alumni_placement',
    sortOrder: 226,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin', 'academic_coordinator', 'teacher', 'hr_manager', 'super_admin', 'platform_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_exits',
    moduleId: 'student_exit',
    parentId: 'nav_imo_students_parent',
    label: 'Exit Management & Clearance',
    icon: 'LogOut',
    route: 'exits',
    sortOrder: 227,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Staff (Institution Management)
  {
    id: 'nav_imo_staff_parent',
    moduleId: 'staff',
    label: 'Staff',
    icon: 'UserCheck',
    sortOrder: 230,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_teachers',
    moduleId: 'staff',
    parentId: 'nav_imo_staff_parent',
    label: 'Teachers',
    icon: 'GraduationCap',
    route: 'staff',
    sortOrder: 231,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_staff_list',
    moduleId: 'staff',
    parentId: 'nav_imo_staff_parent',
    label: 'Staff',
    icon: 'Users',
    route: 'staff',
    sortOrder: 232,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_teacher_assignments',
    moduleId: 'staff',
    parentId: 'nav_imo_staff_parent',
    label: 'Teacher Assignments',
    icon: 'Briefcase',
    route: 'staff',
    sortOrder: 233,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_staff_attendance',
    moduleId: 'staff',
    parentId: 'nav_imo_staff_parent',
    label: 'Staff Attendance',
    icon: 'Clock',
    route: 'attendance',
    sortOrder: 234,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Attendance (Institution Management)
  {
    id: 'nav_imo_attendance_parent',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    sortOrder: 240,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_student_attendance',
    moduleId: 'attendance',
    parentId: 'nav_imo_attendance_parent',
    label: 'Student Attendance',
    icon: 'UserCheck',
    route: 'attendance',
    sortOrder: 241,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_teacher_attendance',
    moduleId: 'attendance',
    parentId: 'nav_imo_attendance_parent',
    label: 'Teacher Attendance',
    icon: 'UserX',
    route: 'attendance',
    sortOrder: 242,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_attendance_reports',
    moduleId: 'attendance',
    parentId: 'nav_imo_attendance_parent',
    label: 'Attendance Reports',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 243,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Academics Operations (Institution Management)
  {
    id: 'nav_imo_ops_parent',
    moduleId: 'academic',
    label: 'Academics Operations',
    icon: 'Layers',
    sortOrder: 250,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_timetable',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Timetable',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 251,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_lesson_plans',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Lesson Plans',
    icon: 'BookOpen',
    route: 'academic',
    sortOrder: 252,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_assignments',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Assignments',
    icon: 'FileSpreadsheet',
    route: 'academic',
    sortOrder: 253,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_assessments',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 254,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_examinations',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Examinations',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 255,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_marks',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 256,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_report_cards',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Report Cards',
    icon: 'FileBadge',
    route: 'academic',
    sortOrder: 257,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_promotion',
    moduleId: 'academic',
    parentId: 'nav_imo_ops_parent',
    label: 'Promotion',
    icon: 'TrendingUp',
    route: 'academic',
    sortOrder: 258,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Analytics (Institution Management)
  {
    id: 'nav_imo_analytics_parent',
    moduleId: 'core',
    label: 'Analytics',
    icon: 'BarChart3',
    sortOrder: 260,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_student_performance',
    moduleId: 'core',
    parentId: 'nav_imo_analytics_parent',
    label: 'Student Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 261,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_teacher_performance',
    moduleId: 'core',
    parentId: 'nav_imo_analytics_parent',
    label: 'Teacher Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 262,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_attendance_analytics',
    moduleId: 'core',
    parentId: 'nav_imo_analytics_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 263,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_academic_reports_analytics',
    moduleId: 'core',
    parentId: 'nav_imo_analytics_parent',
    label: 'Academic Reports',
    icon: 'FileText',
    route: 'reports',
    sortOrder: 264,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Modules (Institution Management)
  {
    id: 'nav_imo_modules_parent',
    moduleId: 'core',
    label: 'Modules',
    icon: 'Boxes',
    sortOrder: 270,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_enabled_modules',
    moduleId: 'core',
    parentId: 'nav_imo_modules_parent',
    label: 'Enabled Modules',
    icon: 'CheckSquare',
    route: 'modules',
    sortOrder: 271,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_module_config',
    moduleId: 'core',
    parentId: 'nav_imo_modules_parent',
    label: 'Module Configuration',
    icon: 'Sliders',
    route: 'modules',
    sortOrder: 272,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Communication (Institution Management)
  {
    id: 'nav_imo_communication_parent',
    moduleId: 'core',
    label: 'Communication',
    icon: 'MessageSquare',
    sortOrder: 280,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_announcements',
    moduleId: 'core',
    parentId: 'nav_imo_communication_parent',
    label: 'Announcements',
    icon: 'Megaphone',
    route: 'settings',
    sortOrder: 281,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_circulars',
    moduleId: 'core',
    parentId: 'nav_imo_communication_parent',
    label: 'Circulars',
    icon: 'FileText',
    route: 'settings',
    sortOrder: 282,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_notifications',
    moduleId: 'core',
    parentId: 'nav_imo_communication_parent',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 283,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Reports (Institution Management)
  {
    id: 'nav_imo_reports_parent',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    sortOrder: 290,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_student_reports',
    moduleId: 'core',
    parentId: 'nav_imo_reports_parent',
    label: 'Student Reports',
    icon: 'Users',
    route: 'reports',
    sortOrder: 291,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_academic_reports',
    moduleId: 'core',
    parentId: 'nav_imo_reports_parent',
    label: 'Academic Reports',
    icon: 'BookOpen',
    route: 'reports',
    sortOrder: 292,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_attendance_reports_list',
    moduleId: 'core',
    parentId: 'nav_imo_reports_parent',
    label: 'Attendance Reports',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 293,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_institution_reports',
    moduleId: 'core',
    parentId: 'nav_imo_reports_parent',
    label: 'Institution Reports',
    icon: 'Building',
    route: 'reports',
    sortOrder: 294,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Users & Access (Institution Management)
  {
    id: 'nav_imo_users_access_parent',
    moduleId: 'core',
    label: 'Users & Access',
    icon: 'Shield',
    sortOrder: 300,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_users',
    moduleId: 'core',
    parentId: 'nav_imo_users_access_parent',
    label: 'Users',
    icon: 'UserCheck',
    route: 'users',
    sortOrder: 301,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_roles',
    moduleId: 'core',
    parentId: 'nav_imo_users_access_parent',
    label: 'Roles',
    icon: 'ShieldCheck',
    route: 'roles',
    sortOrder: 302,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_permissions',
    moduleId: 'core',
    parentId: 'nav_imo_users_access_parent',
    label: 'Permissions',
    icon: 'KeyRound',
    route: 'roles',
    sortOrder: 303,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Audit (Institution Management)
  {
    id: 'nav_imo_audit_parent',
    moduleId: 'core',
    label: 'Audit',
    icon: 'Activity',
    sortOrder: 310,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_activity_logs',
    moduleId: 'core',
    parentId: 'nav_imo_audit_parent',
    label: 'Activity Logs',
    icon: 'FileText',
    route: 'audit',
    sortOrder: 311,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // Settings (Institution Management)
  {
    id: 'nav_imo_settings_parent',
    moduleId: 'core',
    label: 'Settings',
    icon: 'Settings',
    sortOrder: 320,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_setting_institution',
    moduleId: 'core',
    parentId: 'nav_imo_settings_parent',
    label: 'Institution',
    icon: 'Building2',
    route: 'settings',
    sortOrder: 321,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_setting_branding',
    moduleId: 'core',
    parentId: 'nav_imo_settings_parent',
    label: 'Branding',
    icon: 'Palette',
    route: 'settings',
    sortOrder: 322,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_imo_setting_preferences',
    moduleId: 'core',
    parentId: 'nav_imo_settings_parent',
    label: 'Preferences',
    icon: 'Sliders',
    route: 'settings',
    sortOrder: 323,
    status: 'active',
    allowedRoles: ['institution_manager', 'school_owner', 'tenant_admin'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 4. PRINCIPAL / DIRECTOR NAVIGATION
  // ==========================================================================
  // Institution
  {
    id: 'nav_prin_institution_parent',
    moduleId: 'core',
    label: 'Institution',
    icon: 'Building',
    sortOrder: 400,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_overview',
    moduleId: 'core',
    parentId: 'nav_prin_institution_parent',
    label: 'Overview',
    icon: 'LayoutDashboard',
    route: 'tenants',
    sortOrder: 401,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_campuses',
    moduleId: 'core',
    parentId: 'nav_prin_institution_parent',
    label: 'Campuses',
    icon: 'MapPin',
    route: 'tenants',
    sortOrder: 402,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_classrooms',
    moduleId: 'core',
    parentId: 'nav_prin_institution_parent',
    label: 'Classrooms',
    icon: 'DoorOpen',
    route: 'academic',
    sortOrder: 403,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Students
  {
    id: 'nav_prin_students_parent',
    moduleId: 'students',
    label: 'Students',
    icon: 'Users',
    sortOrder: 410,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_all_students',
    moduleId: 'students',
    parentId: 'nav_prin_students_parent',
    label: 'All Students',
    icon: 'UserCheck',
    route: 'students',
    sortOrder: 411,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_admissions',
    moduleId: 'students',
    parentId: 'nav_prin_students_parent',
    label: 'Admissions',
    icon: 'UserPlus',
    route: 'students',
    sortOrder: 412,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_enrollments',
    moduleId: 'students',
    parentId: 'nav_prin_students_parent',
    label: 'Enrollments',
    icon: 'UserCog',
    route: 'students',
    sortOrder: 413,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_exits',
    moduleId: 'student_exit',
    parentId: 'nav_prin_students_parent',
    label: 'Exit Management & Clearance',
    icon: 'LogOut',
    route: 'exits',
    sortOrder: 414,
    status: 'active',
    allowedRoles: ['principal', 'director', 'registrar'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_student_performance',
    moduleId: 'students',
    parentId: 'nav_prin_students_parent',
    label: 'Student Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 414,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Teachers & Staff
  {
    id: 'nav_prin_staff_parent',
    moduleId: 'staff',
    label: 'Teachers & Staff',
    icon: 'UserCheck',
    sortOrder: 420,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_teachers',
    moduleId: 'staff',
    parentId: 'nav_prin_staff_parent',
    label: 'Teachers',
    icon: 'GraduationCap',
    route: 'staff',
    sortOrder: 421,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_staff',
    moduleId: 'staff',
    parentId: 'nav_prin_staff_parent',
    label: 'Staff',
    icon: 'Users',
    route: 'staff',
    sortOrder: 422,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_teacher_attendance',
    moduleId: 'staff',
    parentId: 'nav_prin_staff_parent',
    label: 'Teacher Attendance',
    icon: 'Clock',
    route: 'attendance',
    sortOrder: 423,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_teacher_workload',
    moduleId: 'staff',
    parentId: 'nav_prin_staff_parent',
    label: 'Teacher Workload',
    icon: 'Briefcase',
    route: 'staff',
    sortOrder: 424,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_teacher_performance',
    moduleId: 'staff',
    parentId: 'nav_prin_staff_parent',
    label: 'Teacher Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 425,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Academics
  {
    id: 'nav_prin_academics_parent',
    moduleId: 'academic',
    label: 'Academics',
    icon: 'BookOpen',
    sortOrder: 430,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_academic_years',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Academic Years',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 431,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_classes',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 432,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_sections',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Sections',
    icon: 'Layers',
    route: 'academic',
    sortOrder: 433,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_subjects',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Subjects',
    icon: 'BookMarked',
    route: 'academic',
    sortOrder: 434,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_curriculum',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Curriculum',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 435,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_timetable',
    moduleId: 'academic',
    parentId: 'nav_prin_academics_parent',
    label: 'Timetable',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 436,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Attendance
  {
    id: 'nav_prin_attendance_parent',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    sortOrder: 440,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_student_attendance',
    moduleId: 'attendance',
    parentId: 'nav_prin_attendance_parent',
    label: 'Student Attendance',
    icon: 'UserCheck',
    route: 'attendance',
    sortOrder: 441,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_teacher_attendance_sub',
    moduleId: 'attendance',
    parentId: 'nav_prin_attendance_parent',
    label: 'Teacher Attendance',
    icon: 'UserX',
    route: 'attendance',
    sortOrder: 442,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_attendance_analytics',
    moduleId: 'attendance',
    parentId: 'nav_prin_attendance_parent',
    label: 'Attendance Analytics',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 443,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Examinations
  {
    id: 'nav_prin_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileSpreadsheet',
    sortOrder: 450,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_assessments',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 451,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_examinations',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Examinations',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 452,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_exam_schedule',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Exam Schedule',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 453,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_marks',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 454,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_results',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Results',
    icon: 'TrendingUp',
    route: 'academic',
    sortOrder: 455,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_report_cards',
    moduleId: 'academic',
    parentId: 'nav_prin_exams_parent',
    label: 'Report Cards',
    icon: 'FileBadge',
    route: 'academic',
    sortOrder: 456,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Performance
  {
    id: 'nav_prin_performance_parent',
    moduleId: 'core',
    label: 'Performance',
    icon: 'BarChart3',
    sortOrder: 460,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_perf_student',
    moduleId: 'core',
    parentId: 'nav_prin_performance_parent',
    label: 'Student Performance',
    icon: 'Users',
    route: 'reports',
    sortOrder: 461,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_perf_class',
    moduleId: 'core',
    parentId: 'nav_prin_performance_parent',
    label: 'Class Performance',
    icon: 'GraduationCap',
    route: 'reports',
    sortOrder: 462,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_perf_subject',
    moduleId: 'core',
    parentId: 'nav_prin_performance_parent',
    label: 'Subject Performance',
    icon: 'BookOpen',
    route: 'reports',
    sortOrder: 463,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_perf_teacher',
    moduleId: 'core',
    parentId: 'nav_prin_performance_parent',
    label: 'Teacher Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 464,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Communication
  {
    id: 'nav_prin_comm_parent',
    moduleId: 'core',
    label: 'Communication',
    icon: 'MessageSquare',
    sortOrder: 470,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_announcements',
    moduleId: 'core',
    parentId: 'nav_prin_comm_parent',
    label: 'Announcements',
    icon: 'Megaphone',
    route: 'settings',
    sortOrder: 471,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_circulars',
    moduleId: 'core',
    parentId: 'nav_prin_comm_parent',
    label: 'Circulars',
    icon: 'FileText',
    route: 'settings',
    sortOrder: 472,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_prin_notifications',
    moduleId: 'core',
    parentId: 'nav_prin_comm_parent',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 473,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_prin_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 480,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // Settings
  {
    id: 'nav_prin_settings',
    moduleId: 'core',
    label: 'Settings',
    icon: 'Settings',
    route: 'settings',
    sortOrder: 490,
    status: 'active',
    allowedRoles: ['principal', 'director'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 5. VICE PRINCIPAL NAVIGATION
  // ==========================================================================
  {
    id: 'nav_vp_students',
    moduleId: 'students',
    label: 'Students',
    icon: 'Users',
    route: 'students',
    sortOrder: 500,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_teachers',
    moduleId: 'staff',
    label: 'Teachers',
    icon: 'GraduationCap',
    route: 'staff',
    sortOrder: 510,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_academics',
    moduleId: 'academic',
    label: 'Academics',
    icon: 'BookOpen',
    route: 'academic',
    sortOrder: 520,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_attendance',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'attendance',
    sortOrder: 530,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_examinations',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 540,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_performance',
    moduleId: 'core',
    label: 'Performance',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 550,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_communication',
    moduleId: 'core',
    label: 'Communication',
    icon: 'MessageSquare',
    route: 'settings',
    sortOrder: 560,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_vp_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 570,
    status: 'active',
    allowedRoles: ['vice_principal'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 6. ACADEMIC COORDINATOR NAVIGATION
  // ==========================================================================
  // Academics
  {
    id: 'nav_ac_academics_parent',
    moduleId: 'academic',
    label: 'Academics',
    icon: 'BookOpen',
    sortOrder: 600,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_academic_years',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Academic Years',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 601,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_classes',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 602,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_sections',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Sections',
    icon: 'Layers',
    route: 'academic',
    sortOrder: 603,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_subjects',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Subjects',
    icon: 'BookMarked',
    route: 'academic',
    sortOrder: 604,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_curriculum',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Curriculum',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 605,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_academic_config',
    moduleId: 'academic',
    parentId: 'nav_ac_academics_parent',
    label: 'Academic Configuration',
    icon: 'Sliders',
    route: 'academic',
    sortOrder: 606,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Teachers
  {
    id: 'nav_ac_teachers_parent',
    moduleId: 'staff',
    label: 'Teachers',
    icon: 'GraduationCap',
    sortOrder: 610,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_teacher_assignments',
    moduleId: 'staff',
    parentId: 'nav_ac_teachers_parent',
    label: 'Teacher Assignments',
    icon: 'Briefcase',
    route: 'staff',
    sortOrder: 611,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_subject_allocation',
    moduleId: 'staff',
    parentId: 'nav_ac_teachers_parent',
    label: 'Subject Allocation',
    icon: 'BookOpen',
    route: 'staff',
    sortOrder: 612,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_class_allocation',
    moduleId: 'staff',
    parentId: 'nav_ac_teachers_parent',
    label: 'Class Allocation',
    icon: 'Layers',
    route: 'staff',
    sortOrder: 613,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_teacher_workload',
    moduleId: 'staff',
    parentId: 'nav_ac_teachers_parent',
    label: 'Teacher Workload',
    icon: 'Clock',
    route: 'staff',
    sortOrder: 614,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Timetable
  {
    id: 'nav_ac_timetable_parent',
    moduleId: 'academic',
    label: 'Timetable',
    icon: 'CalendarDays',
    sortOrder: 620,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_master_timetable',
    moduleId: 'academic',
    parentId: 'nav_ac_timetable_parent',
    label: 'Master Timetable',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 621,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_class_timetable',
    moduleId: 'academic',
    parentId: 'nav_ac_timetable_parent',
    label: 'Class Timetable',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 622,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_teacher_timetable',
    moduleId: 'academic',
    parentId: 'nav_ac_timetable_parent',
    label: 'Teacher Timetable',
    icon: 'UserCheck',
    route: 'academic',
    sortOrder: 623,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_classroom_timetable',
    moduleId: 'academic',
    parentId: 'nav_ac_timetable_parent',
    label: 'Classroom Timetable',
    icon: 'DoorOpen',
    route: 'academic',
    sortOrder: 624,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Lesson Planning
  {
    id: 'nav_ac_lesson_parent',
    moduleId: 'academic',
    label: 'Lesson Planning',
    icon: 'BookMarked',
    sortOrder: 630,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_lesson_plans',
    moduleId: 'academic',
    parentId: 'nav_ac_lesson_parent',
    label: 'Lesson Plans',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 631,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_lesson_planned',
    moduleId: 'academic',
    parentId: 'nav_ac_lesson_parent',
    label: 'Planned',
    icon: 'Clock',
    route: 'academic',
    sortOrder: 632,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_lesson_completed',
    moduleId: 'academic',
    parentId: 'nav_ac_lesson_parent',
    label: 'Completed',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 633,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Assignments
  {
    id: 'nav_ac_assignments_parent',
    moduleId: 'academic',
    label: 'Assignments',
    icon: 'FileSpreadsheet',
    sortOrder: 640,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_all_assignments',
    moduleId: 'academic',
    parentId: 'nav_ac_assignments_parent',
    label: 'All Assignments',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 641,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_assignment_reports',
    moduleId: 'academic',
    parentId: 'nav_ac_assignments_parent',
    label: 'Assignment Reports',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 642,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Assessments
  {
    id: 'nav_ac_assessments_parent',
    moduleId: 'academic',
    label: 'Assessments',
    icon: 'CheckSquare',
    sortOrder: 650,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_assessments',
    moduleId: 'academic',
    parentId: 'nav_ac_assessments_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 651,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_assessment_results',
    moduleId: 'academic',
    parentId: 'nav_ac_assessments_parent',
    label: 'Results',
    icon: 'Award',
    route: 'academic',
    sortOrder: 652,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_assessment_performance',
    moduleId: 'academic',
    parentId: 'nav_ac_assessments_parent',
    label: 'Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 653,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Examinations
  {
    id: 'nav_ac_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    sortOrder: 660,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_exams',
    moduleId: 'academic',
    parentId: 'nav_ac_exams_parent',
    label: 'Exams',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 661,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_exam_schedule',
    moduleId: 'academic',
    parentId: 'nav_ac_exams_parent',
    label: 'Schedule',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 662,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_exam_marks',
    moduleId: 'academic',
    parentId: 'nav_ac_exams_parent',
    label: 'Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 663,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_exam_verification',
    moduleId: 'academic',
    parentId: 'nav_ac_exams_parent',
    label: 'Verification',
    icon: 'ShieldCheck',
    route: 'academic',
    sortOrder: 664,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ac_exam_results',
    moduleId: 'academic',
    parentId: 'nav_ac_exams_parent',
    label: 'Results',
    icon: 'TrendingUp',
    route: 'academic',
    sortOrder: 665,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Report Cards
  {
    id: 'nav_ac_report_cards',
    moduleId: 'academic',
    label: 'Report Cards',
    icon: 'FileBadge',
    route: 'academic',
    sortOrder: 670,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Academic Analytics
  {
    id: 'nav_ac_analytics',
    moduleId: 'core',
    label: 'Academic Analytics',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 680,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_ac_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 690,
    status: 'active',
    allowedRoles: ['academic_coordinator'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 7. TEACHER NAVIGATION
  // ==========================================================================
  // My Students
  {
    id: 'nav_tch_students_parent',
    moduleId: 'students',
    label: 'My Students',
    icon: 'Users',
    sortOrder: 700,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_my_classes',
    moduleId: 'students',
    parentId: 'nav_tch_students_parent',
    label: 'My Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 701,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_student_list',
    moduleId: 'students',
    parentId: 'nav_tch_students_parent',
    label: 'Student List',
    icon: 'UserCheck',
    route: 'students',
    sortOrder: 702,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_student_profiles',
    moduleId: 'students',
    parentId: 'nav_tch_students_parent',
    label: 'Student Profiles',
    icon: 'UserCog',
    route: 'students',
    sortOrder: 703,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // My Timetable
  {
    id: 'nav_tch_timetable',
    moduleId: 'academic',
    label: 'My Timetable',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 710,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Teaching
  {
    id: 'nav_tch_teaching_parent',
    moduleId: 'academic',
    label: 'Teaching',
    icon: 'BookOpen',
    sortOrder: 720,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_lesson_plans',
    moduleId: 'academic',
    parentId: 'nav_tch_teaching_parent',
    label: 'Lesson Plans',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 721,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_assignments',
    moduleId: 'academic',
    parentId: 'nav_tch_teaching_parent',
    label: 'Assignments',
    icon: 'FileSpreadsheet',
    route: 'academic',
    sortOrder: 722,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_assessments',
    moduleId: 'academic',
    parentId: 'nav_tch_teaching_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 723,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_learning_material',
    moduleId: 'academic',
    parentId: 'nav_tch_teaching_parent',
    label: 'Learning Material',
    icon: 'FolderOpen',
    route: 'academic',
    sortOrder: 724,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Attendance
  {
    id: 'nav_tch_attendance_parent',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    sortOrder: 730,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_mark_attendance',
    moduleId: 'attendance',
    parentId: 'nav_tch_attendance_parent',
    label: 'Mark Attendance',
    icon: 'UserCheck',
    route: 'attendance',
    sortOrder: 731,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_attendance_history',
    moduleId: 'attendance',
    parentId: 'nav_tch_attendance_parent',
    label: 'Attendance History',
    icon: 'Clock',
    route: 'attendance',
    sortOrder: 732,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_attendance_reports',
    moduleId: 'attendance',
    parentId: 'nav_tch_attendance_parent',
    label: 'Attendance Reports',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 733,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Examinations
  {
    id: 'nav_tch_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    sortOrder: 740,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_my_exams',
    moduleId: 'academic',
    parentId: 'nav_tch_exams_parent',
    label: 'My Exams',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 741,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_enter_marks',
    moduleId: 'academic',
    parentId: 'nav_tch_exams_parent',
    label: 'Enter Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 742,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_submitted_marks',
    moduleId: 'academic',
    parentId: 'nav_tch_exams_parent',
    label: 'Submitted Marks',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 743,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_exam_results',
    moduleId: 'academic',
    parentId: 'nav_tch_exams_parent',
    label: 'Results',
    icon: 'TrendingUp',
    route: 'academic',
    sortOrder: 744,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Performance
  {
    id: 'nav_tch_performance_parent',
    moduleId: 'core',
    label: 'Performance',
    icon: 'BarChart3',
    sortOrder: 750,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_student_performance',
    moduleId: 'core',
    parentId: 'nav_tch_performance_parent',
    label: 'Student Performance',
    icon: 'Users',
    route: 'reports',
    sortOrder: 751,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Communication
  {
    id: 'nav_tch_comm_parent',
    moduleId: 'core',
    label: 'Communication',
    icon: 'MessageSquare',
    sortOrder: 760,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_announcements',
    moduleId: 'core',
    parentId: 'nav_tch_comm_parent',
    label: 'Announcements',
    icon: 'Megaphone',
    route: 'settings',
    sortOrder: 761,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tch_messages',
    moduleId: 'core',
    parentId: 'nav_tch_comm_parent',
    label: 'Messages',
    icon: 'MessageCircle',
    route: 'settings',
    sortOrder: 762,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // Notifications
  {
    id: 'nav_tch_notifications',
    moduleId: 'core',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 770,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // My Profile
  {
    id: 'nav_tch_profile',
    moduleId: 'core',
    label: 'My Profile',
    icon: 'User',
    route: 'settings',
    sortOrder: 780,
    status: 'active',
    allowedRoles: ['teacher'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 8. CLASS TEACHER / CLASS COORDINATOR NAVIGATION
  // ==========================================================================
  // My Class
  {
    id: 'nav_cc_class_parent',
    moduleId: 'students',
    label: 'My Class',
    icon: 'Users',
    sortOrder: 800,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_student_list',
    moduleId: 'students',
    parentId: 'nav_cc_class_parent',
    label: 'Student List',
    icon: 'UserCheck',
    route: 'students',
    sortOrder: 801,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_student_profiles',
    moduleId: 'students',
    parentId: 'nav_cc_class_parent',
    label: 'Student Profiles',
    icon: 'UserCog',
    route: 'students',
    sortOrder: 802,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_attendance',
    moduleId: 'attendance',
    parentId: 'nav_cc_class_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'attendance',
    sortOrder: 803,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_academic_perf',
    moduleId: 'academic',
    parentId: 'nav_cc_class_parent',
    label: 'Academic Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 804,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_behaviour',
    moduleId: 'core',
    parentId: 'nav_cc_class_parent',
    label: 'Behaviour / Remarks',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 805,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_cc_parent_comm',
    moduleId: 'core',
    parentId: 'nav_cc_class_parent',
    label: 'Parent Communication',
    icon: 'MessageSquare',
    route: 'settings',
    sortOrder: 806,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },

  // Class Performance
  {
    id: 'nav_cc_class_performance',
    moduleId: 'core',
    label: 'Class Performance',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 810,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },

  // Class Communication
  {
    id: 'nav_cc_class_communication',
    moduleId: 'core',
    label: 'Class Communication',
    icon: 'MessageCircle',
    route: 'settings',
    sortOrder: 820,
    status: 'active',
    allowedRoles: ['class_coordinator'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 9. EXAMINATION COORDINATOR NAVIGATION
  // ==========================================================================
  // Examinations
  {
    id: 'nav_ec_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    sortOrder: 900,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_exam_types',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Examination Types',
    icon: 'Tag',
    route: 'academic',
    sortOrder: 901,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_examinations',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Examinations',
    icon: 'FileSpreadsheet',
    route: 'academic',
    sortOrder: 902,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_classes',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 903,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_exam_schedule',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Exam Schedule',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 904,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_exam_rooms',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Exam Rooms',
    icon: 'DoorOpen',
    route: 'academic',
    sortOrder: 905,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_invigilation',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Invigilation',
    icon: 'UserCheck',
    route: 'academic',
    sortOrder: 906,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_exam_calendar',
    moduleId: 'academic',
    parentId: 'nav_ec_exams_parent',
    label: 'Examination Calendar',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 907,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },

  // Marks
  {
    id: 'nav_ec_marks_parent',
    moduleId: 'academic',
    label: 'Marks',
    icon: 'Award',
    sortOrder: 910,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_marks_entry',
    moduleId: 'academic',
    parentId: 'nav_ec_marks_parent',
    label: 'Marks Entry',
    icon: 'Edit3',
    route: 'academic',
    sortOrder: 911,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_submission_status',
    moduleId: 'academic',
    parentId: 'nav_ec_marks_parent',
    label: 'Submission Status',
    icon: 'Clock',
    route: 'academic',
    sortOrder: 912,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_verification',
    moduleId: 'academic',
    parentId: 'nav_ec_marks_parent',
    label: 'Verification',
    icon: 'ShieldCheck',
    route: 'academic',
    sortOrder: 913,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_approval',
    moduleId: 'academic',
    parentId: 'nav_ec_marks_parent',
    label: 'Approval',
    icon: 'CheckCircle2',
    route: 'academic',
    sortOrder: 914,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },

  // Results
  {
    id: 'nav_ec_results_parent',
    moduleId: 'academic',
    label: 'Results',
    icon: 'TrendingUp',
    sortOrder: 920,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_class_results',
    moduleId: 'academic',
    parentId: 'nav_ec_results_parent',
    label: 'Class Results',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 921,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_subject_results',
    moduleId: 'academic',
    parentId: 'nav_ec_results_parent',
    label: 'Subject Results',
    icon: 'BookOpen',
    route: 'academic',
    sortOrder: 922,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_student_results',
    moduleId: 'academic',
    parentId: 'nav_ec_results_parent',
    label: 'Student Results',
    icon: 'UserCheck',
    route: 'academic',
    sortOrder: 923,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_result_analysis',
    moduleId: 'academic',
    parentId: 'nav_ec_results_parent',
    label: 'Result Analysis',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 924,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },

  // Report Cards
  {
    id: 'nav_ec_report_cards_parent',
    moduleId: 'academic',
    label: 'Report Cards',
    icon: 'FileBadge',
    sortOrder: 930,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_rc_generate',
    moduleId: 'academic',
    parentId: 'nav_ec_report_cards_parent',
    label: 'Generate',
    icon: 'FilePlus',
    route: 'academic',
    sortOrder: 931,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_rc_verify',
    moduleId: 'academic',
    parentId: 'nav_ec_report_cards_parent',
    label: 'Verify',
    icon: 'ShieldCheck',
    route: 'academic',
    sortOrder: 932,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_rc_approve',
    moduleId: 'academic',
    parentId: 'nav_ec_report_cards_parent',
    label: 'Approve',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 933,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ec_rc_publish',
    moduleId: 'academic',
    parentId: 'nav_ec_report_cards_parent',
    label: 'Publish',
    icon: 'Send',
    route: 'academic',
    sortOrder: 934,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_ec_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 940,
    status: 'active',
    allowedRoles: ['examination_coordinator'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 10. ACCOUNTANT NAVIGATION
  // ==========================================================================
  // Finance
  {
    id: 'nav_acc_finance_parent',
    moduleId: 'finance',
    label: 'Finance',
    icon: 'DollarSign',
    sortOrder: 1000,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_fee_structure',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Fee Structure',
    icon: 'Layers',
    route: 'finance',
    sortOrder: 1001,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_fee_collection',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Fee Collection',
    icon: 'CreditCard',
    route: 'finance',
    sortOrder: 1002,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_receipts',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Receipts',
    icon: 'FileText',
    route: 'finance',
    sortOrder: 1003,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_outstanding_fees',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Outstanding Fees',
    icon: 'AlertCircle',
    route: 'finance',
    sortOrder: 1004,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_discounts',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Discounts',
    icon: 'Percent',
    route: 'finance',
    sortOrder: 1005,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_scholarships',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Scholarships',
    icon: 'Award',
    route: 'finance',
    sortOrder: 1006,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_refunds',
    moduleId: 'finance',
    parentId: 'nav_acc_finance_parent',
    label: 'Refunds',
    icon: 'RefreshCw',
    route: 'finance',
    sortOrder: 1007,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },

  // Financial Reports
  {
    id: 'nav_acc_fin_reports_parent',
    moduleId: 'finance',
    label: 'Financial Reports',
    icon: 'BarChart3',
    sortOrder: 1010,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_rep_collection',
    moduleId: 'finance',
    parentId: 'nav_acc_fin_reports_parent',
    label: 'Collection',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 1011,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_rep_outstanding',
    moduleId: 'finance',
    parentId: 'nav_acc_fin_reports_parent',
    label: 'Outstanding',
    icon: 'Clock',
    route: 'reports',
    sortOrder: 1012,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_acc_rep_daily_summary',
    moduleId: 'finance',
    parentId: 'nav_acc_fin_reports_parent',
    label: 'Daily Summary',
    icon: 'Calendar',
    route: 'reports',
    sortOrder: 1013,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },

  // Notifications
  {
    id: 'nav_acc_notifications',
    moduleId: 'core',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 1020,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },

  // My Profile
  {
    id: 'nav_acc_profile',
    moduleId: 'core',
    label: 'My Profile',
    icon: 'User',
    route: 'settings',
    sortOrder: 1030,
    status: 'active',
    allowedRoles: ['accountant'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 11. HR MANAGER NAVIGATION
  // ==========================================================================
  // Employees
  {
    id: 'nav_hr_employees_parent',
    moduleId: 'staff',
    label: 'Employees',
    icon: 'Users',
    sortOrder: 1100,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_teachers',
    moduleId: 'staff',
    parentId: 'nav_hr_employees_parent',
    label: 'Teachers',
    icon: 'GraduationCap',
    route: 'staff',
    sortOrder: 1101,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_staff',
    moduleId: 'staff',
    parentId: 'nav_hr_employees_parent',
    label: 'Staff',
    icon: 'UserCheck',
    route: 'staff',
    sortOrder: 1102,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_employee_profiles',
    moduleId: 'staff',
    parentId: 'nav_hr_employees_parent',
    label: 'Employee Profiles',
    icon: 'UserCog',
    route: 'staff',
    sortOrder: 1103,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_documents',
    moduleId: 'staff',
    parentId: 'nav_hr_employees_parent',
    label: 'Documents',
    icon: 'FileText',
    route: 'staff',
    sortOrder: 1104,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Attendance
  {
    id: 'nav_hr_attendance_parent',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    sortOrder: 1110,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_staff_attendance',
    moduleId: 'attendance',
    parentId: 'nav_hr_attendance_parent',
    label: 'Staff Attendance',
    icon: 'UserCheck',
    route: 'attendance',
    sortOrder: 1111,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_attendance_reports',
    moduleId: 'attendance',
    parentId: 'nav_hr_attendance_parent',
    label: 'Reports',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 1112,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Leave
  {
    id: 'nav_hr_leave_parent',
    moduleId: 'staff',
    label: 'Leave',
    icon: 'Calendar',
    sortOrder: 1120,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_leave_requests',
    moduleId: 'staff',
    parentId: 'nav_hr_leave_parent',
    label: 'Leave Requests',
    icon: 'Clock',
    route: 'staff',
    sortOrder: 1121,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_leave_approvals',
    moduleId: 'staff',
    parentId: 'nav_hr_leave_parent',
    label: 'Approvals',
    icon: 'CheckSquare',
    route: 'staff',
    sortOrder: 1122,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_hr_leave_balance',
    moduleId: 'staff',
    parentId: 'nav_hr_leave_parent',
    label: 'Leave Balance',
    icon: 'PieChart',
    route: 'staff',
    sortOrder: 1123,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Performance
  {
    id: 'nav_hr_performance',
    moduleId: 'core',
    label: 'Performance',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 1130,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Training
  {
    id: 'nav_hr_training',
    moduleId: 'staff',
    label: 'Training',
    icon: 'BookOpen',
    route: 'staff',
    sortOrder: 1140,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Payroll
  {
    id: 'nav_hr_payroll',
    moduleId: 'finance',
    label: 'Payroll',
    icon: 'DollarSign',
    route: 'finance',
    sortOrder: 1150,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_hr_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 1160,
    status: 'active',
    allowedRoles: ['hr_manager'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 12. STUDENT NAVIGATION
  // ==========================================================================
  // My Learning
  {
    id: 'nav_std_learning_parent',
    moduleId: 'academic',
    label: 'My Learning',
    icon: 'BookOpen',
    sortOrder: 1200,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_my_classes',
    moduleId: 'academic',
    parentId: 'nav_std_learning_parent',
    label: 'My Classes',
    icon: 'GraduationCap',
    route: 'academic',
    sortOrder: 1201,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_my_subjects',
    moduleId: 'academic',
    parentId: 'nav_std_learning_parent',
    label: 'My Subjects',
    icon: 'BookMarked',
    route: 'academic',
    sortOrder: 1202,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_study_material',
    moduleId: 'academic',
    parentId: 'nav_std_learning_parent',
    label: 'Study Material',
    icon: 'FolderOpen',
    route: 'academic',
    sortOrder: 1203,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_assignments',
    moduleId: 'academic',
    parentId: 'nav_std_learning_parent',
    label: 'Assignments',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 1204,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_assessments',
    moduleId: 'academic',
    parentId: 'nav_std_learning_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 1205,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // My Timetable
  {
    id: 'nav_std_timetable',
    moduleId: 'academic',
    label: 'My Timetable',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 1210,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // My Attendance
  {
    id: 'nav_std_attendance',
    moduleId: 'attendance',
    label: 'My Attendance',
    icon: 'CalendarCheck',
    route: 'attendance',
    sortOrder: 1220,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Examinations
  {
    id: 'nav_std_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    sortOrder: 1230,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_upcoming_exams',
    moduleId: 'academic',
    parentId: 'nav_std_exams_parent',
    label: 'Upcoming Exams',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 1231,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_my_marks',
    moduleId: 'academic',
    parentId: 'nav_std_exams_parent',
    label: 'My Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 1232,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_std_results',
    moduleId: 'academic',
    parentId: 'nav_std_exams_parent',
    label: 'Results',
    icon: 'TrendingUp',
    route: 'academic',
    sortOrder: 1233,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Report Cards
  {
    id: 'nav_std_report_cards',
    moduleId: 'academic',
    label: 'Report Cards',
    icon: 'FileBadge',
    route: 'academic',
    sortOrder: 1240,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Recorded Classes
  {
    id: 'nav_std_recorded_classes',
    moduleId: 'academic',
    label: 'Recorded Classes',
    icon: 'Video',
    route: 'academic',
    sortOrder: 1250,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Notices
  {
    id: 'nav_std_notices',
    moduleId: 'core',
    label: 'Notices',
    icon: 'Megaphone',
    route: 'settings',
    sortOrder: 1260,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Notifications
  {
    id: 'nav_std_notifications',
    moduleId: 'core',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 1270,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // My Profile
  {
    id: 'nav_std_profile',
    moduleId: 'core',
    label: 'My Profile',
    icon: 'User',
    route: 'settings',
    sortOrder: 1280,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Digital Library (Later)
  {
    id: 'nav_std_digital_library',
    moduleId: 'academic',
    label: 'Digital Library',
    icon: 'Library',
    route: 'academic',
    sortOrder: 1290,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // Digital Books (Later)
  {
    id: 'nav_std_digital_books',
    moduleId: 'academic',
    label: 'Digital Books',
    icon: 'Book',
    route: 'academic',
    sortOrder: 1300,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // AI Learning Assistant (Later)
  {
    id: 'nav_std_ai_assistant',
    moduleId: 'core',
    label: 'AI Learning Assistant',
    icon: 'Bot',
    route: 'settings',
    sortOrder: 1310,
    status: 'active',
    allowedRoles: ['student'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 13. PARENT / GUARDIAN NAVIGATION
  // ==========================================================================
  // My Children
  {
    id: 'nav_parent_children_parent',
    moduleId: 'students',
    label: 'My Children',
    icon: 'Users',
    sortOrder: 1400,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_child_1',
    moduleId: 'students',
    parentId: 'nav_parent_children_parent',
    label: 'Child 1',
    icon: 'User',
    route: 'students',
    sortOrder: 1401,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_child_2',
    moduleId: 'students',
    parentId: 'nav_parent_children_parent',
    label: 'Child 2',
    icon: 'User',
    route: 'students',
    sortOrder: 1402,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_child_3',
    moduleId: 'students',
    parentId: 'nav_parent_children_parent',
    label: 'Child 3',
    icon: 'User',
    route: 'students',
    sortOrder: 1403,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Attendance
  {
    id: 'nav_parent_attendance',
    moduleId: 'attendance',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'attendance',
    sortOrder: 1410,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Academics
  {
    id: 'nav_parent_academics_parent',
    moduleId: 'academic',
    label: 'Academics',
    icon: 'BookOpen',
    sortOrder: 1420,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_subjects',
    moduleId: 'academic',
    parentId: 'nav_parent_academics_parent',
    label: 'Subjects',
    icon: 'BookMarked',
    route: 'academic',
    sortOrder: 1421,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_assignments',
    moduleId: 'academic',
    parentId: 'nav_parent_academics_parent',
    label: 'Assignments',
    icon: 'FileText',
    route: 'academic',
    sortOrder: 1422,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_assessments',
    moduleId: 'academic',
    parentId: 'nav_parent_academics_parent',
    label: 'Assessments',
    icon: 'CheckSquare',
    route: 'academic',
    sortOrder: 1423,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_performance',
    moduleId: 'academic',
    parentId: 'nav_parent_academics_parent',
    label: 'Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 1424,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Examinations
  {
    id: 'nav_parent_exams_parent',
    moduleId: 'academic',
    label: 'Examinations',
    icon: 'FileText',
    sortOrder: 1430,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_upcoming_exams',
    moduleId: 'academic',
    parentId: 'nav_parent_exams_parent',
    label: 'Upcoming',
    icon: 'Calendar',
    route: 'academic',
    sortOrder: 1431,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_marks',
    moduleId: 'academic',
    parentId: 'nav_parent_exams_parent',
    label: 'Marks',
    icon: 'Award',
    route: 'academic',
    sortOrder: 1432,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_results',
    moduleId: 'academic',
    parentId: 'nav_parent_exams_parent',
    label: 'Results',
    icon: 'BarChart2',
    route: 'academic',
    sortOrder: 1433,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Report Cards
  {
    id: 'nav_parent_report_cards',
    moduleId: 'academic',
    label: 'Report Cards',
    icon: 'FileBadge',
    route: 'academic',
    sortOrder: 1440,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Timetable
  {
    id: 'nav_parent_timetable',
    moduleId: 'academic',
    label: 'Timetable',
    icon: 'CalendarDays',
    route: 'academic',
    sortOrder: 1450,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Recorded Classes
  {
    id: 'nav_parent_recorded_classes',
    moduleId: 'academic',
    label: 'Recorded Classes',
    icon: 'Video',
    route: 'academic',
    sortOrder: 1460,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Fees
  {
    id: 'nav_parent_fees',
    moduleId: 'finance',
    label: 'Fees',
    icon: 'DollarSign',
    route: 'finance',
    sortOrder: 1470,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Communication
  {
    id: 'nav_parent_comm_parent',
    moduleId: 'core',
    label: 'Communication',
    icon: 'MessageSquare',
    sortOrder: 1480,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_notices',
    moduleId: 'core',
    parentId: 'nav_parent_comm_parent',
    label: 'Notices',
    icon: 'Megaphone',
    route: 'settings',
    sortOrder: 1481,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_circulars',
    moduleId: 'core',
    parentId: 'nav_parent_comm_parent',
    label: 'Circulars',
    icon: 'FileText',
    route: 'settings',
    sortOrder: 1482,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_parent_messages',
    moduleId: 'core',
    parentId: 'nav_parent_comm_parent',
    label: 'Messages',
    icon: 'MessageCircle',
    route: 'settings',
    sortOrder: 1483,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // Notifications
  {
    id: 'nav_parent_notifications',
    moduleId: 'core',
    label: 'Notifications',
    icon: 'Bell',
    route: 'settings',
    sortOrder: 1490,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // My Profile
  {
    id: 'nav_parent_profile',
    moduleId: 'core',
    label: 'My Profile',
    icon: 'User',
    route: 'settings',
    sortOrder: 1500,
    status: 'active',
    allowedRoles: ['parent'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 14. LIBRARIAN NAVIGATION
  // ==========================================================================
  // Library
  {
    id: 'nav_lib_library_parent',
    moduleId: 'academic',
    label: 'Library',
    icon: 'BookOpen',
    sortOrder: 1600,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_books',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Books',
    icon: 'Book',
    route: 'academic',
    sortOrder: 1601,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_categories',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Categories',
    icon: 'Tags',
    route: 'academic',
    sortOrder: 1602,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_authors',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Authors',
    icon: 'UserCheck',
    route: 'academic',
    sortOrder: 1603,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_publishers',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Publishers',
    icon: 'Building2',
    route: 'academic',
    sortOrder: 1604,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_inventory',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Inventory',
    icon: 'Layers',
    route: 'academic',
    sortOrder: 1605,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_members',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Members',
    icon: 'Users',
    route: 'academic',
    sortOrder: 1606,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_issue_book',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Issue Book',
    icon: 'BookUp',
    route: 'academic',
    sortOrder: 1607,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_return_book',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Return Book',
    icon: 'BookDown',
    route: 'academic',
    sortOrder: 1608,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_reservations',
    moduleId: 'academic',
    parentId: 'nav_lib_library_parent',
    label: 'Reservations',
    icon: 'BookmarkCheck',
    route: 'academic',
    sortOrder: 1609,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_lib_fines',
    moduleId: 'finance',
    parentId: 'nav_lib_library_parent',
    label: 'Fines',
    icon: 'DollarSign',
    route: 'finance',
    sortOrder: 1610,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_lib_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 1620,
    status: 'active',
    allowedRoles: ['librarian'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 15. TRANSPORT MANAGER NAVIGATION
  // ==========================================================================
  // Transport
  {
    id: 'nav_tm_transport_parent',
    moduleId: 'core',
    label: 'Transport',
    icon: 'Bus',
    sortOrder: 1700,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_vehicles',
    moduleId: 'core',
    parentId: 'nav_tm_transport_parent',
    label: 'Vehicles',
    icon: 'Truck',
    route: 'settings',
    sortOrder: 1701,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_routes',
    moduleId: 'core',
    parentId: 'nav_tm_transport_parent',
    label: 'Routes',
    icon: 'MapPin',
    route: 'settings',
    sortOrder: 1702,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_stops',
    moduleId: 'core',
    parentId: 'nav_tm_transport_parent',
    label: 'Stops',
    icon: 'Navigation',
    route: 'settings',
    sortOrder: 1703,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_drivers',
    moduleId: 'staff',
    parentId: 'nav_tm_transport_parent',
    label: 'Drivers',
    icon: 'UserCheck',
    route: 'staff',
    sortOrder: 1704,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_conductors',
    moduleId: 'staff',
    parentId: 'nav_tm_transport_parent',
    label: 'Conductors',
    icon: 'Users',
    route: 'staff',
    sortOrder: 1705,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_student_allocation',
    moduleId: 'students',
    parentId: 'nav_tm_transport_parent',
    label: 'Student Allocation',
    icon: 'UserPlus',
    route: 'students',
    sortOrder: 1706,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_vehicle_tracking',
    moduleId: 'core',
    parentId: 'nav_tm_transport_parent',
    label: 'Vehicle Tracking',
    icon: 'Compass',
    route: 'settings',
    sortOrder: 1707,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_tm_maintenance',
    moduleId: 'core',
    parentId: 'nav_tm_transport_parent',
    label: 'Maintenance',
    icon: 'Wrench',
    route: 'settings',
    sortOrder: 1708,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },

  // Reports
  {
    id: 'nav_tm_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 1710,
    status: 'active',
    allowedRoles: ['transport_manager'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 16. IT / DEVICE MANAGER NAVIGATION
  // ==========================================================================
  // Devices
  {
    id: 'nav_it_devices_parent',
    moduleId: 'core',
    label: 'Devices',
    icon: 'Laptop',
    sortOrder: 1800,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_all_devices',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'All Devices',
    icon: 'Cpu',
    route: 'settings',
    sortOrder: 1801,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_student_tablets',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'Student Tablets',
    icon: 'Tablet',
    route: 'settings',
    sortOrder: 1802,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_teacher_devices',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'Teacher Devices',
    icon: 'Smartphone',
    route: 'settings',
    sortOrder: 1803,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_smart_boards',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'Smart Boards',
    icon: 'Tv',
    route: 'settings',
    sortOrder: 1804,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_classroom_devices',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'Classroom Devices',
    icon: 'HardDrive',
    route: 'settings',
    sortOrder: 1805,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_device_assignment',
    moduleId: 'core',
    parentId: 'nav_it_devices_parent',
    label: 'Device Assignment',
    icon: 'UserCheck',
    route: 'settings',
    sortOrder: 1806,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },

  // Smart Classrooms
  {
    id: 'nav_it_smart_classrooms_parent',
    moduleId: 'academic',
    label: 'Smart Classrooms',
    icon: 'School',
    sortOrder: 1810,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_classrooms',
    moduleId: 'academic',
    parentId: 'nav_it_smart_classrooms_parent',
    label: 'Classrooms',
    icon: 'DoorOpen',
    route: 'academic',
    sortOrder: 1811,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_online_status',
    moduleId: 'core',
    parentId: 'nav_it_smart_classrooms_parent',
    label: 'Online Status',
    icon: 'Activity',
    route: 'settings',
    sortOrder: 1812,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_device_status',
    moduleId: 'core',
    parentId: 'nav_it_smart_classrooms_parent',
    label: 'Device Status',
    icon: 'CheckCircle',
    route: 'settings',
    sortOrder: 1813,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_connectivity',
    moduleId: 'core',
    parentId: 'nav_it_smart_classrooms_parent',
    label: 'Connectivity',
    icon: 'Wifi',
    route: 'settings',
    sortOrder: 1814,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },

  // CCTV
  {
    id: 'nav_it_cctv_parent',
    moduleId: 'core',
    label: 'CCTV',
    icon: 'Video',
    sortOrder: 1820,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_cameras',
    moduleId: 'core',
    parentId: 'nav_it_cctv_parent',
    label: 'Cameras',
    icon: 'Camera',
    route: 'settings',
    sortOrder: 1821,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_live_status',
    moduleId: 'core',
    parentId: 'nav_it_cctv_parent',
    label: 'Live Status',
    icon: 'Radio',
    route: 'settings',
    sortOrder: 1822,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_recording_status',
    moduleId: 'core',
    parentId: 'nav_it_cctv_parent',
    label: 'Recording Status',
    icon: 'Disc',
    route: 'settings',
    sortOrder: 1823,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_storage',
    moduleId: 'core',
    parentId: 'nav_it_cctv_parent',
    label: 'Storage',
    icon: 'Database',
    route: 'settings',
    sortOrder: 1824,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },

  // Maintenance
  {
    id: 'nav_it_maintenance_parent',
    moduleId: 'core',
    label: 'Maintenance',
    icon: 'Wrench',
    sortOrder: 1830,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_issues',
    moduleId: 'core',
    parentId: 'nav_it_maintenance_parent',
    label: 'Issues',
    icon: 'AlertCircle',
    route: 'settings',
    sortOrder: 1831,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_service_requests',
    moduleId: 'core',
    parentId: 'nav_it_maintenance_parent',
    label: 'Service Requests',
    icon: 'FileText',
    route: 'settings',
    sortOrder: 1832,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_it_repairs',
    moduleId: 'core',
    parentId: 'nav_it_maintenance_parent',
    label: 'Repairs',
    icon: 'Tool',
    route: 'settings',
    sortOrder: 1833,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },

  // Device Reports
  {
    id: 'nav_it_device_reports',
    moduleId: 'core',
    label: 'Device Reports',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 1840,
    status: 'active',
    allowedRoles: ['it_manager'],
    targetContext: 'tenant'
  },

  // ==========================================================================
  // 17. GOVERNMENT — NATIONAL ADMINISTRATOR NAVIGATION
  // ==========================================================================
  // National Dashboard
  {
    id: 'nav_govt_national_dashboard',
    moduleId: 'core',
    label: 'National Dashboard',
    icon: 'LayoutDashboard',
    route: 'national_dashboard',
    sortOrder: 1900,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Education System
  {
    id: 'nav_govt_system_parent',
    moduleId: 'core',
    label: 'Education System',
    icon: 'Building',
    sortOrder: 1910,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_states',
    moduleId: 'core',
    parentId: 'nav_govt_system_parent',
    label: 'States',
    icon: 'MapPin',
    route: 'settings',
    sortOrder: 1911,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_districts',
    moduleId: 'core',
    parentId: 'nav_govt_system_parent',
    label: 'Districts',
    icon: 'Building',
    route: 'settings',
    sortOrder: 1912,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_institutions',
    moduleId: 'core',
    parentId: 'nav_govt_system_parent',
    label: 'Institutions',
    icon: 'Building2',
    route: 'tenants',
    sortOrder: 1913,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_students',
    moduleId: 'students',
    parentId: 'nav_govt_system_parent',
    label: 'Students',
    icon: 'Users',
    route: 'students',
    sortOrder: 1914,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_teachers',
    moduleId: 'staff',
    parentId: 'nav_govt_system_parent',
    label: 'Teachers',
    icon: 'GraduationCap',
    route: 'staff',
    sortOrder: 1915,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_infrastructure',
    moduleId: 'core',
    parentId: 'nav_govt_system_parent',
    label: 'Infrastructure',
    icon: 'Layers',
    route: 'settings',
    sortOrder: 1916,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // National Analytics
  {
    id: 'nav_govt_analytics_parent',
    moduleId: 'core',
    label: 'National Analytics',
    icon: 'BarChart2',
    sortOrder: 1920,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_enrollment',
    moduleId: 'core',
    parentId: 'nav_govt_analytics_parent',
    label: 'Enrollment',
    icon: 'UserPlus',
    route: 'reports',
    sortOrder: 1921,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_attendance',
    moduleId: 'attendance',
    parentId: 'nav_govt_analytics_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 1922,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_academic_perf',
    moduleId: 'academic',
    parentId: 'nav_govt_analytics_parent',
    label: 'Academic Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 1923,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_teacher_perf',
    moduleId: 'staff',
    parentId: 'nav_govt_analytics_parent',
    label: 'Teacher Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 1924,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_inst_perf',
    moduleId: 'core',
    parentId: 'nav_govt_analytics_parent',
    label: 'Institution Performance',
    icon: 'BarChart3',
    route: 'reports',
    sortOrder: 1925,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_analytics_regional_comp',
    moduleId: 'core',
    parentId: 'nav_govt_analytics_parent',
    label: 'Regional Comparison',
    icon: 'Globe',
    route: 'reports',
    sortOrder: 1926,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Education KPIs
  {
    id: 'nav_govt_kpis',
    moduleId: 'core',
    label: 'Education KPIs',
    icon: 'LineChart',
    route: 'reports',
    sortOrder: 1930,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Policy
  {
    id: 'nav_govt_policy_parent',
    moduleId: 'core',
    label: 'Policy',
    icon: 'FileText',
    sortOrder: 1940,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_policies',
    moduleId: 'core',
    parentId: 'nav_govt_policy_parent',
    label: 'Policies',
    icon: 'Scroll',
    route: 'settings',
    sortOrder: 1941,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_policy_implementation',
    moduleId: 'core',
    parentId: 'nav_govt_policy_parent',
    label: 'Policy Implementation',
    icon: 'CheckCircle2',
    route: 'settings',
    sortOrder: 1942,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_policy_compliance',
    moduleId: 'core',
    parentId: 'nav_govt_policy_parent',
    label: 'Compliance',
    icon: 'ShieldCheck',
    route: 'settings',
    sortOrder: 1943,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_policy_impact',
    moduleId: 'core',
    parentId: 'nav_govt_policy_parent',
    label: 'Policy Impact',
    icon: 'Target',
    route: 'reports',
    sortOrder: 1944,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Institutions (Govt view)
  {
    id: 'nav_govt_institutions_parent',
    moduleId: 'core',
    label: 'Institutions',
    icon: 'School',
    sortOrder: 1950,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_inst_monitoring',
    moduleId: 'core',
    parentId: 'nav_govt_institutions_parent',
    label: 'Monitoring',
    icon: 'Eye',
    route: 'settings',
    sortOrder: 1951,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_inst_performance',
    moduleId: 'core',
    parentId: 'nav_govt_institutions_parent',
    label: 'Performance',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 1952,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_inst_infrastructure',
    moduleId: 'core',
    parentId: 'nav_govt_institutions_parent',
    label: 'Infrastructure',
    icon: 'Home',
    route: 'settings',
    sortOrder: 1953,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_inst_compliance',
    moduleId: 'core',
    parentId: 'nav_govt_institutions_parent',
    label: 'Compliance',
    icon: 'CheckSquare',
    route: 'settings',
    sortOrder: 1954,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Students (Govt view)
  {
    id: 'nav_govt_students_parent',
    moduleId: 'students',
    label: 'Students',
    icon: 'Users',
    sortOrder: 1960,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_std_enrollment',
    moduleId: 'students',
    parentId: 'nav_govt_students_parent',
    label: 'Enrollment',
    icon: 'UserPlus',
    route: 'reports',
    sortOrder: 1961,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_std_attendance',
    moduleId: 'attendance',
    parentId: 'nav_govt_students_parent',
    label: 'Attendance',
    icon: 'Calendar',
    route: 'reports',
    sortOrder: 1962,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_std_performance',
    moduleId: 'academic',
    parentId: 'nav_govt_students_parent',
    label: 'Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 1963,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Teachers (Govt view)
  {
    id: 'nav_govt_teachers_parent',
    moduleId: 'staff',
    label: 'Teachers',
    icon: 'GraduationCap',
    sortOrder: 1970,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_T_workforce',
    moduleId: 'staff',
    parentId: 'nav_govt_teachers_parent',
    label: 'Workforce',
    icon: 'Briefcase',
    route: 'staff',
    sortOrder: 1971,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_T_attendance',
    moduleId: 'attendance',
    parentId: 'nav_govt_teachers_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 1972,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_T_qualifications',
    moduleId: 'staff',
    parentId: 'nav_govt_teachers_parent',
    label: 'Qualifications',
    icon: 'BookOpen',
    route: 'staff',
    sortOrder: 1973,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_T_performance',
    moduleId: 'staff',
    parentId: 'nav_govt_teachers_parent',
    label: 'Performance',
    icon: 'Star',
    route: 'reports',
    sortOrder: 1974,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Smart Education
  {
    id: 'nav_govt_smart_edu_parent',
    moduleId: 'core',
    label: 'Smart Education',
    icon: 'Tv',
    sortOrder: 1980,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_smart_classrooms',
    moduleId: 'academic',
    parentId: 'nav_govt_smart_edu_parent',
    label: 'Smart Classrooms',
    icon: 'Monitor',
    route: 'settings',
    sortOrder: 1981,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_digital_education',
    moduleId: 'academic',
    parentId: 'nav_govt_smart_edu_parent',
    label: 'Digital Education',
    icon: 'Laptop',
    route: 'settings',
    sortOrder: 1982,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_device_deployment',
    moduleId: 'core',
    parentId: 'nav_govt_smart_edu_parent',
    label: 'Device Deployment',
    icon: 'Cpu',
    route: 'settings',
    sortOrder: 1983,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },
  {
    id: 'nav_govt_smart_infrastructure',
    moduleId: 'core',
    parentId: 'nav_govt_smart_edu_parent',
    label: 'Infrastructure',
    icon: 'Server',
    route: 'settings',
    sortOrder: 1984,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Reports
  {
    id: 'nav_govt_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 1990,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Inspections
  {
    id: 'nav_govt_inspections',
    moduleId: 'core',
    label: 'Inspections',
    icon: 'Search',
    route: 'settings',
    sortOrder: 2000,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Regulations
  {
    id: 'nav_govt_regulations',
    moduleId: 'core',
    label: 'Regulations',
    icon: 'Scroll',
    route: 'settings',
    sortOrder: 2010,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // Government Settings
  {
    id: 'nav_govt_settings',
    moduleId: 'core',
    label: 'Government Settings',
    icon: 'Settings',
    route: 'settings',
    sortOrder: 2020,
    status: 'active',
    allowedRoles: ['govt_admin'],
    targetContext: 'national'
  },

  // ==========================================================================
  // 18. DISTRICT ADMINISTRATOR NAVIGATION
  // ==========================================================================
  // District Dashboard
  {
    id: 'nav_dist_dashboard',
    moduleId: 'core',
    label: 'District Dashboard',
    icon: 'LayoutDashboard',
    route: 'national_dashboard',
    sortOrder: 2100,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Institutions
  {
    id: 'nav_dist_inst_parent',
    moduleId: 'core',
    label: 'Institutions',
    icon: 'School',
    sortOrder: 2110,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_inst_list',
    moduleId: 'core',
    parentId: 'nav_dist_inst_parent',
    label: 'Institution List',
    icon: 'Building2',
    route: 'tenants',
    sortOrder: 2111,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_inst_perf',
    moduleId: 'core',
    parentId: 'nav_dist_inst_parent',
    label: 'Institution Performance',
    icon: 'BarChart2',
    route: 'reports',
    sortOrder: 2112,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_inst_attendance',
    moduleId: 'attendance',
    parentId: 'nav_dist_inst_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 2113,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_inst_compliance',
    moduleId: 'core',
    parentId: 'nav_dist_inst_parent',
    label: 'Compliance',
    icon: 'ShieldCheck',
    route: 'settings',
    sortOrder: 2114,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Students
  {
    id: 'nav_dist_std_parent',
    moduleId: 'students',
    label: 'Students',
    icon: 'Users',
    sortOrder: 2120,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_std_enrollment',
    moduleId: 'students',
    parentId: 'nav_dist_std_parent',
    label: 'Enrollment',
    icon: 'UserPlus',
    route: 'reports',
    sortOrder: 2121,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_std_attendance',
    moduleId: 'attendance',
    parentId: 'nav_dist_std_parent',
    label: 'Attendance',
    icon: 'Calendar',
    route: 'reports',
    sortOrder: 2122,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_std_performance',
    moduleId: 'academic',
    parentId: 'nav_dist_std_parent',
    label: 'Performance',
    icon: 'Award',
    route: 'reports',
    sortOrder: 2123,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Teachers
  {
    id: 'nav_dist_tch_parent',
    moduleId: 'staff',
    label: 'Teachers',
    icon: 'GraduationCap',
    sortOrder: 2130,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_tch_workforce',
    moduleId: 'staff',
    parentId: 'nav_dist_tch_parent',
    label: 'Workforce',
    icon: 'Briefcase',
    route: 'staff',
    sortOrder: 2131,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_tch_attendance',
    moduleId: 'attendance',
    parentId: 'nav_dist_tch_parent',
    label: 'Attendance',
    icon: 'CalendarCheck',
    route: 'reports',
    sortOrder: 2132,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_tch_performance',
    moduleId: 'staff',
    parentId: 'nav_dist_tch_parent',
    label: 'Performance',
    icon: 'Star',
    route: 'reports',
    sortOrder: 2133,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Analytics
  {
    id: 'nav_dist_analytics_parent',
    moduleId: 'core',
    label: 'Analytics',
    icon: 'BarChart3',
    sortOrder: 2140,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_analytics_inst_comp',
    moduleId: 'core',
    parentId: 'nav_dist_analytics_parent',
    label: 'Institution Comparison',
    icon: 'GitCompare',
    route: 'reports',
    sortOrder: 2141,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_analytics_class_perf',
    moduleId: 'academic',
    parentId: 'nav_dist_analytics_parent',
    label: 'Class Performance',
    icon: 'TrendingUp',
    route: 'reports',
    sortOrder: 2142,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_analytics_subject_perf',
    moduleId: 'academic',
    parentId: 'nav_dist_analytics_parent',
    label: 'Subject Performance',
    icon: 'BookOpen',
    route: 'reports',
    sortOrder: 2143,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },
  {
    id: 'nav_dist_analytics_kpis',
    moduleId: 'core',
    parentId: 'nav_dist_analytics_parent',
    label: 'District KPIs',
    icon: 'LineChart',
    route: 'reports',
    sortOrder: 2144,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Inspections
  {
    id: 'nav_dist_inspections',
    moduleId: 'core',
    label: 'Inspections',
    icon: 'Search',
    route: 'settings',
    sortOrder: 2150,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Policy Compliance
  {
    id: 'nav_dist_policy_compliance',
    moduleId: 'core',
    label: 'Policy Compliance',
    icon: 'Scroll',
    route: 'settings',
    sortOrder: 2160,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Reports
  {
    id: 'nav_dist_reports',
    moduleId: 'core',
    label: 'Reports',
    icon: 'ClipboardList',
    route: 'reports',
    sortOrder: 2170,
    status: 'active',
    allowedRoles: ['district_admin'],
    targetContext: 'district'
  },

  // Phase 7.13 Health & Student Support
  {
    id: 'nav_student_support_workspace',
    moduleId: 'mod_student_support',
    label: 'Health & Support',
    icon: 'HeartHandshake',
    route: 'student_support_workspace',
    sortOrder: 45,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'counsellor', 'doctor', 'nurse', 'safeguarding_officer', 'teacher'],
    targetContext: 'all'
  },

  // Phase 7.14 Communications, Notifications & Stakeholder Engagement
  {
    id: 'nav_communication_workspace',
    moduleId: 'mod_communication',
    label: 'Communications',
    icon: 'MessageSquare',
    route: 'communication_workspace',
    sortOrder: 46,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'class_coordinator', 'accountant', 'transport_manager', 'student', 'parent'],
    targetContext: 'all'
  },

  // Phase 7.15A Library & Learning Resource Foundation
  {
    id: 'nav_library_workspace',
    moduleId: 'mod_library',
    label: 'Library Workspace',
    icon: 'BookOpen',
    route: 'library_workspace',
    sortOrder: 47,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'librarian', 'teacher', 'student', 'parent'],
    targetContext: 'all'
  },

  // Phase 7.22 Learning Management & Digital Classroom
  {
    id: 'nav_learning_workspace',
    moduleId: 'mod_learning',
    label: 'Learning Management',
    icon: 'GraduationCap',
    route: 'learning_workspace',
    sortOrder: 22,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'student', 'parent'],
    targetContext: 'all'
  },

  // Phase 7.22 Research, Innovation, Projects & Institutional Knowledge
  {
    id: 'nav_research_workspace',
    moduleId: 'mod_research',
    label: 'Research & Innovation',
    icon: 'Microscope',
    route: 'research_workspace',
    sortOrder: 23,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'teacher', 'staff', 'student'],
    targetContext: 'all'
  },

  // Phase 7.24 Governance, Compliance, Accreditation & Institutional Quality Management
  {
    id: 'nav_governance_workspace',
    moduleId: 'mod_governance',
    label: 'Governance & Compliance',
    icon: 'ShieldCheck',
    route: 'governance_workspace',
    sortOrder: 24,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'hr_manager', 'accountant', 'teacher', 'staff'],
    targetContext: 'all'
  },
  {
    id: 'nav_records_governance',
    moduleId: 'mod_governance',
    label: 'Records Governance',
    icon: 'FileLock2',
    route: 'records_governance',
    sortOrder: 25,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'hr_manager'],
    targetContext: 'all'
  },
  {
    id: 'nav_privacy_governance',
    moduleId: 'mod_governance',
    label: 'Privacy Governance',
    icon: 'Shield',
    route: 'privacy_governance',
    sortOrder: 26,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'hr_manager'],
    targetContext: 'all'
  },
  // Phase 7.29 Institutional Planning, Strategy, KPI & Performance Management
  {
    id: 'nav_institutional_performance',
    moduleId: 'mod_institutional_performance',
    label: 'Strategy & Performance',
    icon: 'Trophy',
    route: 'institutional_performance',
    sortOrder: 27,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager'],
    targetContext: 'all'
  },
  // Phase 7.30 Institutional Communication & Stakeholder Relations
  {
    id: 'nav_institutional_communication',
    moduleId: 'mod_institutional_communication',
    label: 'Institutional Comms',
    icon: 'Megaphone',
    route: 'institutional_communication',
    sortOrder: 28,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher'],
    targetContext: 'all'
  },
  // Phase 7.31 Institutional Enterprise Risk Management, Campus Incident Command & Business Continuity
  {
    id: 'nav_institutional_risk',
    moduleId: 'mod_institutional_risk',
    label: 'Risk & Incident Command',
    icon: 'AlertTriangle',
    route: 'institutional_risk',
    sortOrder: 29,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff'],
    targetContext: 'all'
  },
  // Phase 7.32 Institutional Scheduling & Academic Timetables
  {
    id: 'nav_scheduling',
    moduleId: 'mod_scheduling',
    label: 'Scheduling & Timetables',
    icon: 'Calendar',
    route: 'scheduling',
    sortOrder: 30,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher'],
    targetContext: 'all'
  },
  // Phase 7.33 Institutional Student Success, Early Warning & Academic Progression
  {
    id: 'nav_student_success',
    moduleId: 'mod_student_success',
    label: 'Student Success Engine',
    icon: 'TrendingUp',
    route: 'student_success',
    sortOrder: 31,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher', 'counselor'],
    targetContext: 'all'
  },
  // Phase 7.34 Institutional Assessment, Accreditation Evidence, Continuous Improvement & Academic Quality Execution
  {
    id: 'nav_quality_execution',
    moduleId: 'mod_quality_execution',
    label: 'Quality Execution & Accreditation',
    icon: 'Award',
    route: 'quality_execution',
    sortOrder: 32,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher'],
    targetContext: 'all'
  },
  // Phase 7.35 Institutional Accreditation, Regulatory Submission & External Review Governance Engine
  {
    id: 'nav_accreditation_review',
    moduleId: 'mod_accreditation_review',
    label: 'Accreditation & Regulatory Review',
    icon: 'ShieldCheck',
    route: 'accreditation_review',
    sortOrder: 33,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff'],
    targetContext: 'all'
  },
  // Phase 7.36 Institutional Data, Analytics, Business Intelligence & Decision Intelligence Governance Engine
  {
    id: 'nav_institutional_analytics',
    moduleId: 'mod_institutional_analytics',
    label: 'Institutional Analytics & BI',
    icon: 'BarChart3',
    route: 'institutional_analytics',
    sortOrder: 34,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'finance_officer'],
    targetContext: 'all'
  },
  // Phase 7.37 Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine
  {
    id: 'nav_workflow_governance',
    moduleId: 'mod_workflow_governance',
    label: 'Workflow & Case Governance',
    icon: 'GitBranch',
    route: 'workflow_governance',
    sortOrder: 35,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher'],
    targetContext: 'all'
  },
  // Phase 7.38 Institutional Knowledge, Enterprise Search, Policy Intelligence & Governed Information Discovery Engine
  {
    id: 'nav_knowledge_governance',
    moduleId: 'mod_knowledge_governance',
    label: 'Knowledge & Enterprise Search',
    icon: 'Search',
    route: 'knowledge_governance',
    sortOrder: 36,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher'],
    targetContext: 'all'
  },
  // Phase 7.39 Institutional Integration, Interoperability, API & Data Exchange Governance Engine
  {
    id: 'nav_integration_governance',
    moduleId: 'mod_integration_governance',
    label: 'Integration & API Governance',
    icon: 'Share2',
    route: 'integration_governance',
    sortOrder: 37,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin'],
    targetContext: 'all'
  },
  // Phase 7.40 Institutional Automation, Rules, Alerts & Decision Workflow Governance Engine
  {
    id: 'nav_automation_governance',
    moduleId: 'mod_automation_governance',
    label: 'Automation & Rules Governance',
    icon: 'Cpu',
    route: 'automation_governance',
    sortOrder: 38,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin'],
    targetContext: 'all'
  },
  // Phase 7.41 Institutional Resource Planning, Capacity, Allocation & Enterprise Portfolio Governance Engine
  {
    id: 'nav_resource_planning',
    moduleId: 'mod_resource_planning',
    label: 'Resource & Portfolio Governance',
    icon: 'PieChart',
    route: 'resource_planning',
    sortOrder: 39,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.42 Institutional Enterprise Portfolio, Program & Transformation Governance Engine
  {
    id: 'nav_enterprise_portfolio',
    moduleId: 'mod_enterprise_portfolio',
    label: 'Enterprise Portfolio & Transformation',
    icon: 'Briefcase',
    route: 'enterprise_portfolio_workspace',
    sortOrder: 40,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.43 Institutional Enterprise Architecture, Technology Portfolio & Digital Governance Engine
  {
    id: 'nav_enterprise_architecture',
    moduleId: 'mod_enterprise_architecture',
    label: 'Enterprise Architecture & Technology Portfolio',
    icon: 'Network',
    route: 'enterprise_architecture_workspace',
    sortOrder: 41,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.44 Institutional IT Service Management, Digital Operations & Service Delivery Governance Engine
  {
    id: 'nav_it_service_management',
    moduleId: 'mod_it_service_management',
    label: 'IT Service Management (ITSM)',
    icon: 'Server',
    route: 'it_service_management_workspace',
    sortOrder: 42,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.45 Institutional Cybersecurity Operations, Threat Intelligence & Zero-Trust Governance Engine
  {
    id: 'nav_cybersecurity_operations',
    moduleId: 'mod_cybersecurity_operations',
    label: 'Cybersecurity Operations',
    icon: 'Shield',
    route: 'cybersecurity_operations_workspace',
    sortOrder: 43,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.50 Institutional Governance Control Tower
  {
    id: 'nav_institutional_governance_parent',
    moduleId: 'mod_institutional_governance',
    label: 'Institutional Governance',
    icon: 'ShieldCheck',
    sortOrder: 5880,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_institutional_governance_workspace',
    moduleId: 'mod_institutional_governance',
    parentId: 'nav_institutional_governance_parent',
    label: 'Control Tower',
    icon: 'LayoutDashboard',
    route: 'institutional_governance',
    sortOrder: 5881,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager'],
    targetContext: 'tenant'
  },
  // Phase 7.51 Institutional Performance, Accountability, Assurance & Operating Review Governance Engine
  {
    id: 'nav_institutional_performance_assurance_parent',
    moduleId: 'mod_institutional_performance_assurance',
    label: 'Institutional Performance',
    icon: 'BarChart3',
    sortOrder: 5882,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_institutional_performance_assurance_workspace',
    moduleId: 'mod_institutional_performance_assurance',
    parentId: 'nav_institutional_performance_assurance_parent',
    label: 'Assurance Control Tower',
    icon: 'LayoutDashboard',
    route: 'institutional_performance_assurance',
    sortOrder: 5883,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'institution_manager'],
    targetContext: 'tenant'
  },
  {
    id: 'nav_ai_governance',
    moduleId: 'mod_ai_governance',
    label: 'AI & Model Governance',
    icon: 'Brain',
    route: 'ai_governance_workspace',
    sortOrder: 44,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.47 Institutional Crisis Management, Emergency Operations, Disaster Recovery & Organizational Resilience Governance Engine
  {
    id: 'nav_crisis_resilience',
    moduleId: 'mod_crisis_resilience',
    label: 'Crisis & Resilience Command',
    icon: 'ShieldAlert',
    route: 'crisis_resilience_workspace',
    sortOrder: 45,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.48 Institutional Compliance, Legal, Regulatory Obligations & Enterprise Assurance Governance Engine
  {
    id: 'nav_compliance_assurance',
    moduleId: 'mod_compliance_assurance',
    label: 'Compliance & Assurance',
    icon: 'ShieldCheck',
    route: 'compliance_assurance_workspace',
    sortOrder: 46,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'it_admin', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.58 Institutional Research, Innovation, Intellectual Property, Grants & Knowledge Commercialization Governance Engine
  {
    id: 'nav_research_innovation_governance',
    moduleId: 'mod_research_innovation_governance',
    label: 'Research & IP Governance',
    icon: 'FlaskConical',
    route: 'research_innovation_governance',
    sortOrder: 47,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.59 Institutional Human Capital, Workforce, Talent, Performance & Organizational Development Governance Engine
  {
    id: 'nav_human_capital_governance',
    moduleId: 'mod_human_capital_governance',
    label: 'Human Capital & Workforce',
    icon: 'UsersRound',
    route: 'human_capital_governance',
    sortOrder: 48,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'hr_manager', 'staff', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.60 Institutional Financial Governance, Budget, Treasury, Revenue, Cost Management & Financial Resilience Engine
  {
    id: 'nav_financial_governance',
    moduleId: 'mod_financial_governance',
    label: 'Financial Governance & Treasury',
    icon: 'Landmark',
    route: 'financial_governance',
    sortOrder: 49,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.61 Institutional Procurement, Sourcing, Vendor, Third-Party Risk & Procurement Assurance Governance Engine
  {
    id: 'nav_procurement_governance',
    moduleId: 'mod_procurement_governance',
    label: 'Procurement & Vendor Risk',
    icon: 'Handshake',
    route: 'procurement_governance',
    sortOrder: 50,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.62 Institutional Contract, Commercial Obligations, Agreement Lifecycle & Contract Assurance Governance Engine
  {
    id: 'nav_contract_governance',
    moduleId: 'mod_contract_governance',
    label: 'Contract & Commercial Obligations',
    icon: 'FileSignature',
    route: 'contract_governance',
    sortOrder: 51,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.63 Institutional Asset, Facilities, Infrastructure, Space, Utilities & Physical Resilience Governance Engine
  {
    id: 'nav_asset_facilities_governance',
    moduleId: 'mod_asset_facilities_governance',
    label: 'Asset, Facilities & Resilience',
    icon: 'Building2',
    route: 'asset_facilities_governance',
    sortOrder: 52,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.64 Institutional Safety, Occupational Health, Environmental Health, Emergency Preparedness & Life-Safety Governance Engine
  {
    id: 'nav_safety_ehs_governance',
    moduleId: 'mod_safety_ehs_governance',
    label: 'Safety, EHS & Life-Safety',
    icon: 'ShieldAlert',
    route: 'safety_ehs_governance',
    sortOrder: 53,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.65 Institutional Quality Assurance, Accreditation, Continuous Improvement & Organizational Excellence Governance Engine
  {
    id: 'nav_quality_assurance_governance',
    moduleId: 'mod_quality_assurance_governance',
    label: 'Quality Assurance & Accreditation',
    icon: 'BadgeCheck',
    route: 'quality_assurance_governance',
    sortOrder: 54,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.66 Institutional Student Success, Retention, Progression, Completion & Learner Outcomes Governance Engine
  {
    id: 'nav_student_success_governance',
    moduleId: 'mod_student_success_governance',
    label: 'Student Success & Retention Governance',
    icon: 'GraduationCap',
    route: 'student_success_governance',
    sortOrder: 55,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.67 Institutional Community Engagement, Outreach, Extension, Partnerships, Social Impact & Civic Responsibility Governance Engine
  {
    id: 'nav_community_engagement_governance',
    moduleId: 'mod_community_engagement_governance',
    label: 'Community Engagement & Social Impact',
    icon: 'HeartHandshake',
    route: 'community_engagement_governance',
    sortOrder: 56,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.68 Institutional Internationalization, Global Engagement, Transnational Education, Global Partnerships & International Risk Governance Engine
  {
    id: 'nav_internationalization_governance',
    moduleId: 'mod_internationalization_governance',
    label: 'Internationalization & Global Governance',
    icon: 'Globe',
    route: 'internationalization_governance',
    sortOrder: 57,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.69 Institutional Digital Transformation, Technology Governance, IT Service Management, Cyber Resilience & Enterprise Architecture Governance Engine
  {
    id: 'nav_digital_technology_governance',
    moduleId: 'mod_digital_technology_governance',
    label: 'Digital Technology & Architecture Governance',
    icon: 'Cpu',
    route: 'digital_technology_governance',
    sortOrder: 58,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.70 Institutional Cybersecurity, Information Security, Privacy, Identity, Access, Zero-Trust & Digital Trust Governance Engine
  {
    id: 'nav_cyber_security_privacy_governance',
    moduleId: 'mod_cyber_security_privacy_governance',
    label: 'Cybersecurity, Privacy & Identity Governance',
    icon: 'ShieldCheck',
    route: 'cyber_security_privacy_governance',
    sortOrder: 59,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.71 Institutional Business Continuity, Disaster Recovery, Crisis Management, Emergency Operations & Enterprise Resilience Governance Engine
  {
    id: 'nav_business_continuity_resilience_governance',
    moduleId: 'business_continuity_resilience_governance',
    label: 'Business Continuity & Resilience Governance',
    icon: 'ShieldAlert',
    route: 'business_continuity_resilience_governance',
    sortOrder: 60,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'vice_principal', 'academic_coordinator', 'director', 'institution_manager', 'school_owner', 'finance_manager', 'accountant', 'hr_manager', 'staff', 'teacher', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.72 Institutional Enterprise Risk Management & GRC
  {
    id: 'nav_enterprise_risk_governance',
    moduleId: 'mod_enterprise_risk_governance',
    label: 'Enterprise Risk & GRC',
    icon: 'ShieldAlert',
    route: 'enterprise_risk_governance',
    sortOrder: 61,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 7.73 Institutional Audit, Assurance, Internal Controls & Findings
  {
    id: 'nav_audit_assurance_governance',
    moduleId: 'mod_audit_assurance_governance',
    label: 'Audit & Assurance',
    icon: 'ClipboardCheck',
    route: 'audit_assurance_governance',
    sortOrder: 62,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.1 Enterprise Workflow & Institutional Process Orchestration Engine
  {
    id: 'nav_enterprise_workflow_orchestration',
    moduleId: 'mod_enterprise_workflow_orchestration',
    label: 'Workflow & Orchestration',
    icon: 'GitPullRequest',
    route: 'enterprise_workflow_orchestration',
    sortOrder: 63,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director'],
    targetContext: 'all'
  },
  // Phase 8.2 Enterprise Case, Task, SLA & Accountability Governance Engine
  {
    id: 'nav_enterprise_case_governance',
    moduleId: 'mod_enterprise_case_governance',
    label: 'Case & Task Governance',
    icon: 'Briefcase',
    route: 'enterprise_case_governance',
    sortOrder: 64,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.3 Enterprise Document, Records, Correspondence & Approval Control Plane
  {
    id: 'nav_document_records_governance',
    moduleId: 'mod_document_records_governance',
    label: 'Document & Records Control',
    icon: 'FileText',
    route: 'document_records_governance',
    sortOrder: 65,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.4 Institutional Enterprise Communication, Notification, Alert & Official Messaging Control Plane
  {
    id: 'nav_enterprise_communication_governance',
    moduleId: 'mod_enterprise_communication_governance',
    label: 'Communication & Alerts',
    icon: 'MessageSquare',
    route: 'enterprise_communication_governance',
    sortOrder: 66,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.5 Institutional Enterprise Master Data, Reference Data, Data Synchronization, Data Contract & Cross-System Integration Governance Control Plane
  {
    id: 'nav_enterprise_data_integration_governance',
    moduleId: 'mod_enterprise_data_integration_governance',
    label: 'Data Integration Governance',
    icon: 'Database',
    route: 'enterprise_data_integration_governance',
    sortOrder: 67,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.6 Institutional Enterprise Event, Work Queue, Rule Engine, Business Rules, Event-Driven Automation & Cross-Module Action Governance Control Plane
  {
    id: 'nav_enterprise_event_automation_governance',
    moduleId: 'mod_enterprise_event_automation_governance',
    label: 'Event & Automation Governance',
    icon: 'Zap',
    route: 'enterprise_event_automation_governance',
    sortOrder: 68,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 8.7 Institutional Enterprise Integration, API, Service Interface, Interoperability & External Connectivity Governance Control Plane
  {
    id: 'nav_enterprise_integration_governance',
    moduleId: 'mod_enterprise_integration_governance',
    label: 'Integration & API Governance',
    icon: 'Share2',
    route: 'enterprise_integration_governance',
    sortOrder: 69,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 9.1 Institutional Performance Intelligence, KPI, Metrics, Benchmarking & Executive Performance Governance Engine
  {
    id: 'nav_institutional_performance_governance',
    moduleId: 'mod_institutional_performance_governance',
    label: 'Performance Intelligence',
    icon: 'TrendingUp',
    route: 'institutional_performance_governance',
    sortOrder: 70,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 9.2 Institutional Analytics, Forecasting, Scenario Intelligence & Executive Decision Support Governance Engine
  {
    id: 'nav_institutional_analytics_governance',
    moduleId: 'mod_institutional_analytics_governance',
    label: 'Analytics & Forecast Governance',
    icon: 'BarChart3',
    route: 'institutional_analytics_governance',
    sortOrder: 71,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 9.3 Institutional Data Governance, Intelligence Quality, Decision Provenance & Data Trust Governance Engine
  {
    id: 'nav_data_intelligence_trust_governance',
    moduleId: 'mod_data_intelligence_trust_governance',
    label: 'Data Intelligence & Trust',
    icon: 'ShieldCheck',
    route: 'data_intelligence_trust_governance',
    sortOrder: 72,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  },
  // Phase 9.4 Institutional Knowledge Intelligence, Decision Knowledge, Organizational Memory & Governed Knowledge Retrieval Control Plane
  {
    id: 'nav_knowledge_intelligence_governance',
    moduleId: 'mod_knowledge_intelligence_governance',
    label: 'Knowledge & Decision Governance',
    icon: 'Brain',
    route: 'knowledge_intelligence_governance',
    sortOrder: 73,
    status: 'active',
    allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'principal', 'director', 'auditor'],
    targetContext: 'all'
  }
];




