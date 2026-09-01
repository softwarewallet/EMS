import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalCommunicationsModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_communications',
  name: 'Institutional Communications, Notifications, Correspondence & Engagement Operations',
  displayName: 'Communications & Engagement',
  description: 'Authoritative operations module governing institutional notifications, communication campaigns, template versioning, deterministic audience resolution, multichannel delivery orchestration, formal correspondence management, Four-Eyes approvals, emergency alerts, acknowledgements, escalations, diagnostics, what-if simulations, and cryptographic SHA-256 audit chaining.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.11.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_research_grants_projects_innovation', minVersion: '11.9.0' },
    { moduleId: 'mod_library_knowledge_information_services', minVersion: '11.10.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_communications',
      moduleId: 'mod_institutional_communications',
      label: 'Communications & Notices',
      icon: 'Megaphone',
      route: 'institutional_communications',
      sortOrder: 20,
      status: 'active',
      requiredPermission: 'communications.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'registrar',
        'dean_academics',
        'communications_officer',
        'public_relations_officer',
        'department_head',
        'faculty_member',
        'safety_officer',
        'exam_controller',
        'student',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'communications.view',
      name: 'View Communications & Announcements',
      description: 'Access institutional communications, public notices, announcements, and relevant dispatches'
    },
    {
      code: 'communications.create',
      name: 'Create Communication Notices',
      description: 'Draft institutional communications and notices for review and dispatch'
    },
    {
      code: 'communications.manage',
      name: 'Manage Communications Infrastructure',
      description: 'Configure communication policies, quiet hours, and channel endpoints'
    },
    {
      code: 'communications.template.manage',
      name: 'Manage Notification Templates',
      description: 'Create, edit, version, and publish institutional notification templates'
    },
    {
      code: 'communications.campaign.manage',
      name: 'Manage Communication Campaigns',
      description: 'Plan, schedule, and configure institutional campaigns and target audiences'
    },
    {
      code: 'communications.approve',
      name: 'Approve Campaigns & Broadcasts (Four-Eyes)',
      description: 'Authorize campaigns, mass broadcasts, and emergency alerts under Segregation of Duties'
    },
    {
      code: 'communications.dispatch',
      name: 'Dispatch Communications',
      description: 'Execute approved outbound message broadcasts and multichannel dispatches'
    },
    {
      code: 'communications.cancel',
      name: 'Cancel Active Dispatches',
      description: 'Abort in-flight campaigns or dispatches with mandatory justification audit'
    },
    {
      code: 'communications.correspondence.manage',
      name: 'Manage Formal Correspondence',
      description: 'Register, assign, respond to, and close inbound/outbound official correspondence'
    },
    {
      code: 'communications.preference.manage',
      name: 'Manage User Communication Preferences',
      description: 'Configure delivery channels, languages, and non-emergency category opt-outs'
    },
    {
      code: 'communications.audit.view',
      name: 'View Cryptographic Audit Provenance',
      description: 'Inspect immutable SHA-256 audit logs and historical message delivery receipts'
    },
    {
      code: 'communications.diagnostics.view',
      name: 'Execute Communication Diagnostics',
      description: 'Run diagnostic health checks and execute isolated What-If sandbox simulations'
    }
  ]
};
