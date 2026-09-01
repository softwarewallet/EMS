import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalLifecycleIntegrationModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_lifecycle_integration',
  name: 'Institutional Lifecycle Integration & Assurance',
  displayName: 'Integration Assurance',
  description: 'Cross-module integration, reconciliation, and transaction assurance engine.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '10.9.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_admissions_enrollment', minVersion: '10.3.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_student_academic_operations', minVersion: '10.5.0' },
    { moduleId: 'mod_assessment_examination', minVersion: '10.6.0' },
    { moduleId: 'mod_results_transcript_certification', minVersion: '10.7.0' },
    { moduleId: 'mod_graduation_degree_alumni_credential', minVersion: '10.8.0' }
  ], 
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_lifecycle_integration',
      moduleId: 'mod_institutional_lifecycle_integration',
      label: 'Integration Assurance',
      icon: 'Network',
      route: 'institutional_lifecycle_integration',
      sortOrder: 9,
      status: 'active',
      requiredPermission: 'lifecycle.integration.view',
      allowedRoles: ['super_admin', 'platform_admin', 'system_auditor'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'lifecycle.integration.view',
      name: 'View Integration Assurance',
      description: 'Access cross-module transactions, checkpoints, and diagnostics'
    },
    {
      code: 'lifecycle.integration.reconcile',
      name: 'Manage Reconciliation',
      description: 'Run reconciliation tasks and manage integration findings'
    },
    {
      code: 'lifecycle.integration.recovery.approve',
      name: 'Approve Recovery Actions',
      description: 'Four-Eyes SoD authority to approve compensating integration recoveries'
    }
  ]
};
