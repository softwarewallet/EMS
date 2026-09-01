import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const FacilitiesSpaceSafetyOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_facilities_space_safety',
  name: 'Facilities, Space Planning, Utilities & Safety Operations',
  displayName: 'Space, Utilities & Safety',
  description: 'Authoritative operations module for space planning, room inventory allocations, utility meter consumption tracking, safety incidents, compliance audits, and emergency drill readiness logs.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.5.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_assets_inventory_facilities', minVersion: '11.4.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_facilities_space_safety',
      moduleId: 'mod_facilities_space_safety',
      label: 'Space, Utilities & Safety',
      icon: 'Building2',
      route: 'facilities_space_safety',
      sortOrder: 14,
      status: 'active',
      requiredPermission: 'facilities.space.view',
      allowedRoles: ['super_admin', 'platform_admin', 'space_manager', 'safety_officer', 'facility_manager'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'facilities.space.view',
      name: 'View Spaces',
      description: 'View space, campus room allocations, and schedules'
    },
    {
      code: 'facilities.space.manage',
      name: 'Manage Space Layouts',
      description: 'Create and update architectural room dimensions and levels'
    },
    {
      code: 'facilities.space.allocate',
      name: 'Allocate Spaces',
      description: 'Assign campus zones and wings to organization departments'
    },
    {
      code: 'facilities.space.reserve',
      name: 'Reserve Rooms',
      description: 'Submit class schedule, event, and research lab reservations'
    },
    {
      code: 'facilities.space.approve',
      name: 'Approve Bookings',
      description: 'Review and authorize restricted space reservations'
    },
    {
      code: 'facilities.utility.view',
      name: 'View Utility Consumption',
      description: 'View utility usage logs, readings, and cost attributes'
    },
    {
      code: 'facilities.utility.manage',
      name: 'Manage Meters',
      description: 'Register and update sub-meters and telemetry systems'
    },
    {
      code: 'facilities.utility.reading.create',
      name: 'Record Meter Readings',
      description: 'Submit periodical water, electricity, or gas utility inputs'
    },
    {
      code: 'facilities.safety.view',
      name: 'View Safety Controls',
      description: 'View safety violations, inspections, and emergency assembly areas'
    },
    {
      code: 'facilities.safety.manage',
      name: 'Manage Emergency Plans',
      description: 'Maintain campus evacuation routes and drill schedules'
    },
    {
      code: 'facilities.safety.inspect',
      name: 'Execute Safety Audits',
      description: 'Submit and log fire, electrical, or hazard safety inspections'
    },
    {
      code: 'facilities.safety.finding.manage',
      name: 'Govern Hazards',
      description: 'Manage deficiencies, hazards, and corrective action completions'
    },
    {
      code: 'facilities.incident.view',
      name: 'View Safety Incidents',
      description: 'View active environmental spills or workplace injury incidents'
    },
    {
      code: 'facilities.incident.manage',
      name: 'Govern Safety Incidents',
      description: 'Report and triage campus safety incident investigations'
    },
    {
      code: 'facilities.incident.close.approve',
      name: 'Authorize Incident Closures',
      description: 'Four-Eyes SoD authorization to sign off and close incident investigations'
    },
    {
      code: 'facilities.compliance.view',
      name: 'View Regulatory Compliance',
      description: 'View accessibility reviews and overall statutory safety metrics'
    },
    {
      code: 'facilities.compliance.manage',
      name: 'Govern Compliance Audits',
      description: 'Maintain statutory certification dates'
    },
    {
      code: 'facilities.risk.view',
      name: 'View Facilities Risks',
      description: 'View deterministic hazard and threat risk analysis reports'
    },
    {
      code: 'facilities.risk.manage',
      name: 'Assess Structural Risks',
      description: 'Perform risk assessment scoring and record mitigation actions'
    },
    {
      code: 'facilities.change.approve',
      name: 'Approve Architectural Changes',
      description: 'Four-Eyes SoD authority to approve space conversion or structural safety restrictions'
    },
    {
      code: 'facilities.sandbox.run',
      name: 'Run Space Sandbox',
      description: 'Access isolated in-memory simulation environments'
    }
  ]
};
