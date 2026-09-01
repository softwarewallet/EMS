/**
 * EMS Phase 11.14 Module Contract: Institutional Internationalization, Global Mobility, Partnerships & Transnational Education Operations
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InternationalizationGlobalMobilityModule: UniversalModuleContract = {
  moduleId: 'mod_internationalization_global_mobility_operations',
  name: 'Institutional Internationalization, Global Mobility, Partnerships & Transnational Education Operations',
  displayName: 'Internationalization & Global Mobility',
  description: 'Authoritative operational execution engine for international partner records, partnership lifecycle, MoU agreements, mobility programs, application workflows, exchange placements, inbound/outbound student cases, visiting scholars/faculty, arrival/departure operations, transnational education arrangements, partner performance, and immutable audit provenance.',
  version: '11.14.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_internationalization_governance', minVersion: '1.0.0' },
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_research_grants_projects_innovation', minVersion: '11.9.0' },
    { moduleId: 'mod_institutional_communications', minVersion: '11.11.0' },
    { moduleId: 'mod_institutional_security_safety_continuity', minVersion: '11.12.0' },
    { moduleId: 'mod_student_services_support', minVersion: '11.13.0' }
  ],
  configurationSchema: [
    { key: 'defaultMobilityQuotaPerPartner', type: 'number', label: 'Default Mobility Quota per Partner', required: true, defaultValue: 10 },
    { key: 'enableAutoDueDiligenceCheck', type: 'boolean', label: 'Enable Automatic Due Diligence Validation', required: true, defaultValue: true },
    { key: 'fourEyesApprovalRequiredForAgreements', type: 'boolean', label: 'Require Four-Eyes Approval for Agreements', required: true, defaultValue: true }
  ],
  navigationItems: [
    {
      id: 'nav_int_command_center',
      moduleId: 'mod_internationalization_global_mobility_operations',
      label: 'International Command Center',
      icon: 'Globe',
      route: 'internationalization_global_mobility',
      sortOrder: 23,
      status: 'active',
      requiredPermission: 'internationalization.view',
      allowedRoles: ['super_admin', 'platform_admin', 'international_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_int_partners',
      moduleId: 'mod_internationalization_global_mobility_operations',
      label: 'Partner Registry & Agreements',
      icon: 'Building2',
      route: 'internationalization_global_mobility',
      sortOrder: 24,
      status: 'active',
      requiredPermission: 'internationalization.partner.view',
      allowedRoles: ['super_admin', 'platform_admin', 'international_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_int_mobility',
      moduleId: 'mod_internationalization_global_mobility_operations',
      label: 'Mobility & Placements',
      icon: 'Plane',
      route: 'internationalization_global_mobility',
      sortOrder: 25,
      status: 'active',
      requiredPermission: 'internationalization.mobility.view',
      allowedRoles: ['super_admin', 'platform_admin', 'international_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_int_scholars',
      moduleId: 'mod_internationalization_global_mobility_operations',
      label: 'Visiting Scholars & Faculty',
      icon: 'GraduationCap',
      route: 'internationalization_global_mobility',
      sortOrder: 26,
      status: 'active',
      requiredPermission: 'internationalization.scholar.manage',
      allowedRoles: ['super_admin', 'platform_admin', 'international_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_int_tne',
      moduleId: 'mod_internationalization_global_mobility_operations',
      label: 'Transnational Education',
      icon: 'BookOpen',
      route: 'internationalization_global_mobility',
      sortOrder: 27,
      status: 'active',
      requiredPermission: 'internationalization.transnational.manage',
      allowedRoles: ['super_admin', 'platform_admin', 'international_director'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'internationalization.view', name: 'View International Operations', description: 'View international command center and operational dashboards.' },
    { code: 'internationalization.manage', name: 'Manage International Operations', description: 'Configure international operational settings and portfolios.' },
    { code: 'internationalization.partner.view', name: 'View Partners', description: 'View international partner institution directories and due diligence records.' },
    { code: 'internationalization.partner.manage', name: 'Manage Partners', description: 'Create and update international partner institution profiles.' },
    { code: 'internationalization.partner.approve', name: 'Approve Partners', description: 'Authorize international partner onboarding and due diligence clearances.' },
    { code: 'internationalization.agreement.view', name: 'View Partnership Agreements', description: 'Inspect partnership agreements, versions, and milestones.' },
    { code: 'internationalization.agreement.manage', name: 'Manage Partnership Agreements', description: 'Draft and submit partnership agreements and renewals.' },
    { code: 'internationalization.agreement.approve', name: 'Approve Agreements (Four-Eyes)', description: 'Authorize partnership agreements under Four-Eyes SoD separation of duties.' },
    { code: 'internationalization.mobility.view', name: 'View Mobility Programs', description: 'View mobility programs, quotas, and capacities.' },
    { code: 'internationalization.mobility.manage', name: 'Manage Mobility Programs', description: 'Configure mobility programs and application pipelines.' },
    { code: 'internationalization.mobility.approve', name: 'Approve Mobility Nominations', description: 'Authorize mobility nominations and seat allocations.' },
    { code: 'internationalization.application.view', name: 'View Mobility Applications', description: 'Inspect mobility applications and eligibility snapshots.' },
    { code: 'internationalization.application.manage', name: 'Manage Mobility Applications', description: 'Process student mobility applications and document verification.' },
    { code: 'internationalization.application.approve', name: 'Approve Mobility Applications', description: 'Approve student mobility applications and placement confirmations.' },
    { code: 'internationalization.placement.manage', name: 'Manage Placements', description: 'Assign course equivalencies, housing, and host placements.' },
    { code: 'internationalization.arrival.manage', name: 'Manage Arrival Operations', description: 'Process inbound and outbound participant arrivals, pickups, and check-ins.' },
    { code: 'internationalization.departure.manage', name: 'Manage Departure Operations', description: 'Process participant departure clearances and completion records.' },
    { code: 'internationalization.scholar.manage', name: 'Manage Visiting Scholars & Faculty', description: 'Govern visiting scholar and international faculty operational cases.' },
    { code: 'internationalization.transnational.manage', name: 'Manage Transnational Education', description: 'Govern joint degrees, dual degrees, and franchise arrangements.' },
    { code: 'internationalization.exception.create', name: 'Create Operational Exception', description: 'Request operational exceptions for mobility or capacity overrides.' },
    { code: 'internationalization.exception.approve', name: 'Approve Operational Exception', description: 'Authorize mobility exceptions under Four-Eyes SoD.' },
    { code: 'internationalization.incident.view', name: 'View Mobility Incidents', description: 'Inspect international travel incidents, disruptions, and safety reports.' },
    { code: 'internationalization.incident.manage', name: 'Manage Mobility Incidents', description: 'Resolve and escalate international mobility incidents.' },
    { code: 'internationalization.audit.view', name: 'View Audit Trail', description: 'Inspect SHA-256 chained immutable audit logs.' },
    { code: 'internationalization.diagnostics.run', name: 'Run Diagnostics', description: 'Execute automated diagnostics and invariant checks.' },
    { code: 'internationalization.simulation.run', name: 'Run What-If Sandbox', description: 'Execute isolated in-memory what-if simulation scenarios.' }
  ]
};
