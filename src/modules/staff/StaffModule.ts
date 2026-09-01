import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StaffModule: UniversalModuleContract = {
  moduleId: 'mod_staff',
  name: 'Staff & HR Management',
  displayName: 'Staff, HR & Workforce Management Governance Engine',
  description: 'Authoritative workforce governance engine for staff profiles, employment lifecycle, assignments, qualifications, workload analytics, leave ledgers, substitutions, professional development, appraisals, compliance monitoring, HR cases, and departmental offboarding clearances (Phase 7.17)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'HR',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_academic', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'hr.view',
      name: 'View Workforce Workspace',
      description: 'Access staff directory, profiles, basic assignments, and departmental rosters'
    },
    {
      code: 'hr.create',
      name: 'Create Staff Profile',
      description: 'Onboard new employees and provision staff identity records'
    },
    {
      code: 'hr.update',
      name: 'Update Staff Profile',
      description: 'Modify staff demographics, designations, contacts, and metadata'
    },
    {
      code: 'hr.manage_staff',
      name: 'Manage Staff Lifecycle',
      description: 'Authorize status transitions, transfers, promotions, and exits'
    },
    {
      code: 'hr.manage_assignments',
      name: 'Manage Staff Assignments',
      description: 'Allocate teaching periods, class teacher roles, and institutional duties'
    },
    {
      code: 'hr.manage_leave',
      name: 'Manage Leave Policies & Quotas',
      description: 'Configure leave types, annual quotas, and carry forward policies'
    },
    {
      code: 'hr.approve_leave',
      name: 'Approve / Reject Leave Requests',
      description: 'Review and decide employee leave applications with anti-self-approval enforcement'
    },
    {
      code: 'hr.manage_documents',
      name: 'Manage Staff Documents',
      description: 'Upload and organize contracts, qualification proofs, and IDs'
    },
    {
      code: 'hr.verify_documents',
      name: 'Verify Staff Documents',
      description: 'Sign off verification stamps on submitted qualifications and credentials'
    },
    {
      code: 'hr.manage_training',
      name: 'Manage Professional Development',
      description: 'Schedule training programs, assign staff courses, and log certifications'
    },
    {
      code: 'hr.manage_compliance',
      name: 'Monitor Compliance & Authorizations',
      description: 'Track background checks, expiry alerts, and mandatory compliance standards'
    },
    {
      code: 'hr.manage_performance',
      name: 'Manage Performance Appraisals',
      description: 'Run appraisal cycles, manager reviews, objectives, and finalize ratings'
    },
    {
      code: 'hr.manage_cases',
      name: 'Manage HR & Workplace Cases',
      description: 'Log and investigate confidential grievances, policy violations, and disciplinary cases'
    },
    {
      code: 'hr.manage_exit',
      name: 'Manage Staff Offboarding & Clearance',
      description: 'Coordinate multi-department asset signoffs, handovers, and exit completion'
    },
    {
      code: 'hr.export',
      name: 'Export Workforce Data',
      description: 'Export staff rosters, leave ledgers, workload reports, and analytics to CSV'
    }
  ],
  navigationItems: [
    {
      id: 'staff_workspace',
      moduleId: 'mod_staff',
      label: 'Staff & HR Management',
      icon: 'Users',
      route: '/staff/workspace',
      requiredPermission: 'hr.view',
      sortOrder: 49,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] StaffModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] StaffModule disabled for tenant ${tenantId}`);
  }
};
