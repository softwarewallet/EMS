import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const StudentSupportModule: UniversalModuleContract = {
  moduleId: 'mod_student_support',
  name: 'StudentSupport',
  displayName: 'Health & Student Support',
  description: 'Authoritative engine for student health, counselling, wellness observations, support plans, referrals, accommodations, and emergency incidents (Phase 7.13)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Infrastructure',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_student', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'student_support.view',
      name: 'View Student Support',
      description: 'View student support cases and welfares'
    },
    {
      code: 'student_support.create',
      name: 'Create Support Cases',
      description: 'Log and create student support cases'
    },
    {
      code: 'student_support.update',
      name: 'Update Support Cases',
      description: 'Modify active student support case logs'
    },
    {
      code: 'student_support.assign',
      name: 'Assign Support Staff',
      description: 'Assign caseworkers and team members to support plans'
    },
    {
      code: 'student_support.manage_cases',
      name: 'Manage Support Cases',
      description: 'Full coordination and lifecycle management of student cases'
    },
    {
      code: 'student_support.manage_counseling',
      name: 'Manage Counseling',
      description: 'Access counseling referrals and session logs'
    },
    {
      code: 'student_support.manage_welfare',
      name: 'Manage Student Welfare',
      description: 'Manage and coordinate student welfare interventions'
    },
    {
      code: 'student_support.manage_grievances',
      name: 'Manage Grievances',
      description: 'Log, investigate, and approve student/guardian grievances'
    },
    {
      code: 'student_support.manage_safeguarding',
      name: 'Manage Safeguarding',
      description: 'Designated Safeguarding Officer (DSO) case management'
    },
    {
      code: 'student_support.escalate',
      name: 'Escalate Cases',
      description: 'Trigger manual escalation for high-priority support cases'
    },
    {
      code: 'student_support.manage_consent',
      name: 'Manage Consent',
      description: 'Authorize and track student/guardian consent statuses'
    },
    {
      code: 'student_support.record_disclosure',
      name: 'Record Disclosure',
      description: 'Log formal external case disclosures'
    },
    {
      code: 'student_support.review',
      name: 'Review Support Cases',
      description: 'Perform formal support reviews and update action plans'
    },
    {
      code: 'student_support.close',
      name: 'Close Support Cases',
      description: 'Mark active support cases as resolved and closed'
    },
    {
      code: 'student_support.view_confidential',
      name: 'View Confidential Cases',
      description: 'Read-access to confidential support layers'
    },
    {
      code: 'student_support.view_restricted',
      name: 'View Restricted Cases',
      description: 'Read-access to restricted support layers'
    },
    {
      code: 'student_support.view_safeguarding',
      name: 'View Safeguarding Cases',
      description: 'Read-access to highly restricted safeguarding records'
    },
    {
      code: 'student_support.export',
      name: 'Export Support Records',
      description: 'Export case reports and analytics and logs to CSV/Excel'
    },
    {
      code: 'student_support.view_audit',
      name: 'View Support Audit Logs',
      description: 'Access audit trails for student support records'
    }
  ],
  navigationItems: [
    {
      id: 'student_support_workspace',
      moduleId: 'mod_student_support',
      label: 'Health & Support',
      icon: 'HeartHandshake',
      route: '/student-support/workspace',
      requiredPermission: 'student_support.view',
      sortOrder: 45,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] StudentSupportModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] StudentSupportModule disabled for tenant ${tenantId}`);
  }
};
