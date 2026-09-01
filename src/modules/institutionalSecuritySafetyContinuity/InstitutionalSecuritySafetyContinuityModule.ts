import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalSecuritySafetyContinuityModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_security_safety_continuity',
  name: 'Institutional Security, Access Control, Safety, Incident & Business Continuity Operations',
  displayName: 'Security, Safety & Continuity',
  description: 'Authoritative operations module governing campus security zones, checkpoints, access-control policies, credential lifecycles, visitor/contractor management, physical access events, security patrols, guard assignments, incident & safety management, security investigations, threat & risk assessments, emergency response, evacuation operations, business continuity planning, disaster recovery drills, Four-Eyes approvals, diagnostics, and SHA-256 audit chaining.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.12.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_transport_fleet_mobility', minVersion: '11.6.0' },
    { moduleId: 'mod_inventory_assets_stores_materials', minVersion: '11.7.0' },
    { moduleId: 'mod_research_grants_projects_innovation', minVersion: '11.9.0' },
    { moduleId: 'mod_institutional_communications', minVersion: '11.11.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_institutional_security_safety_continuity',
      moduleId: 'mod_institutional_security_safety_continuity',
      label: 'Security & Safety',
      icon: 'ShieldAlert',
      route: 'institutional_security_safety_continuity',
      sortOrder: 21,
      status: 'active',
      requiredPermission: 'security.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'chief_security_officer',
        'security_supervisor',
        'security_officer',
        'safety_officer',
        'emergency_commander',
        'business_continuity_lead',
        'investigator',
        'registrar',
        'dean',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'security.view',
      name: 'View Security Overview & Public Safety Notices',
      description: 'Access non-confidential security operational dashboards and zone statuses'
    },
    {
      code: 'security.manage',
      name: 'Manage Security Infrastructure & Zoning',
      description: 'Configure security zones, checkpoints, posts, and security policies'
    },
    {
      code: 'security.access.view',
      name: 'View Access Credentials & Physical Logs',
      description: 'Inspect credential registries and physical access event logs'
    },
    {
      code: 'security.access.manage',
      name: 'Manage Access Credentials & Authorizations',
      description: 'Request, issue, suspend, or revoke credentials and zone permissions'
    },
    {
      code: 'security.access.approve',
      name: 'Approve Access Credentials (Four-Eyes)',
      description: 'Authorize access credential issuance and special clearance overrides'
    },
    {
      code: 'security.visitor.manage',
      name: 'Manage Visitors & Contractor Passes',
      description: 'Register, check-in, issue badges, and check-out visitors and contractors'
    },
    {
      code: 'security.patrol.manage',
      name: 'Manage Guard Rosters & Patrol Routes',
      description: 'Schedule, dispatch, monitor, and evaluate security patrols and post assignments'
    },
    {
      code: 'security.incident.view',
      name: 'View Security & Safety Incidents',
      description: 'Access incident summaries and operational status boards'
    },
    {
      code: 'security.incident.manage',
      name: 'Manage & Triage Incidents',
      description: 'Report, triage, assign, and record actions for security and safety incidents'
    },
    {
      code: 'security.incident.close',
      name: 'Close Incidents (Four-Eyes)',
      description: 'Authorize closure of critical incidents with dual approval verification'
    },
    {
      code: 'security.investigation.manage',
      name: 'Conduct Security Investigations',
      description: 'Manage investigation case files, findings, witness statements, and evidence references'
    },
    {
      code: 'security.investigation.close',
      name: 'Close Investigations (Four-Eyes)',
      description: 'Dual-authorize final investigation closure and formal recommendations'
    },
    {
      code: 'security.risk.manage',
      name: 'Manage Threat & Risk Assessments',
      description: 'Execute bounded threat assessments and manage risk mitigation plans'
    },
    {
      code: 'security.emergency.manage',
      name: 'Manage Emergency Plans & Resources',
      description: 'Maintain emergency response plans, resource inventories, and call trees'
    },
    {
      code: 'security.emergency.activate',
      name: 'Declare & Command Emergency Response',
      description: 'Declare institutional emergency states, lockdowns, and command operations'
    },
    {
      code: 'security.evacuation.manage',
      name: 'Manage Evacuation Plans & Zones',
      description: 'Maintain evacuation schemes, wardens, and designated assembly points'
    },
    {
      code: 'security.evacuation.authorize',
      name: 'Authorize Building Re-Entry (Four-Eyes)',
      description: 'Dual-authorize post-evacuation building re-entry clearance'
    },
    {
      code: 'security.continuity.view',
      name: 'View Business Continuity Plans',
      description: 'Inspect BCP plans, critical functions, and recovery time objectives'
    },
    {
      code: 'security.continuity.manage',
      name: 'Manage Business Continuity & DR Plans',
      description: 'Author and update business continuity strategies, RTO/RPO metrics, and failover workflows'
    },
    {
      code: 'security.continuity.activate',
      name: 'Activate BCP Continuity Incidents',
      description: 'Declare continuity disruptions and mobilize failover operations'
    },
    {
      code: 'security.audit.view',
      name: 'View Security Cryptographic Audit Trail',
      description: 'Inspect immutable SHA-256 chained logs and provenance receipts'
    },
    {
      code: 'security.admin',
      name: 'Master Security Administrator',
      description: 'Full administrative authority across all campus security and continuity domains'
    }
  ]
};
