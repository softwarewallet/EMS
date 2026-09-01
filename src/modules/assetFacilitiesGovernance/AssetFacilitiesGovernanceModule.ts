import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AssetFacilitiesGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_asset_facilities_governance',
  name: 'Institutional Asset, Facilities, Infrastructure, Space, Utilities & Physical Resilience Governance Engine',
  displayName: 'Asset, Facilities & Physical Resilience Governance',
  description: 'Authoritative governance layer for physical assets, facilities, infrastructure, space utilization, utilities, maintenance governance, lifecycle planning, and physical resilience.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EduTech-SMS',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'asset.governance.view', name: 'View Asset Governance', description: 'View asset and facilities governance workspace and dashboards.' },
    { code: 'asset.registry.manage', name: 'Manage Asset Registry', description: 'Manage asset governance references and categories.' },
    { code: 'asset.lifecycle.manage', name: 'Manage Asset Lifecycle', description: 'Authorize asset lifecycle transitions and decommissioning.' },
    { code: 'asset.criticality.manage', name: 'Manage Asset Criticality', description: 'Perform and approve multi-factor criticality assessments.' },
    { code: 'facility.governance.manage', name: 'Manage Facility Governance', description: 'Manage facilities, buildings, sites, and infrastructure topology.' },
    { code: 'space.governance.manage', name: 'Manage Space Governance', description: 'Govern space categories, design capacities, and department allocations.' },
    { code: 'space.utilization.view', name: 'View Space Utilization', description: 'View space utilization and occupancy observations.' },
    { code: 'utility.governance.manage', name: 'Manage Utility Governance', description: 'Govern utility providers, consumption, energy efficiency, water, and waste.' },
    { code: 'maintenance.governance.manage', name: 'Manage Maintenance Governance', description: 'Manage maintenance policies, preventive schedules, and risk oversight.' },
    { code: 'capital.renewal.manage', name: 'Manage Capital Renewal', description: 'Manage capital renewal plans, replacement priorities, and FCI exposure.' },
    { code: 'asset.risk.manage', name: 'Manage Asset Risk', description: 'Manage physical risks, environmental observations, and internal controls.' },
    { code: 'asset.exception.create', name: 'Create Asset Exception', description: 'Request asset and maintenance exceptions.' },
    { code: 'asset.exception.approve', name: 'Approve Asset Exception', description: 'Authorize asset and maintenance exceptions with compensating controls.' },
    { code: 'asset.resilience.assess', name: 'Assess Physical Resilience', description: 'Perform facility resilience assessments and continuity mappings.' },
    { code: 'asset.simulation.run', name: 'Run Resilience Simulations', description: 'Execute isolated in-memory physical resilience simulations.' },
    { code: 'asset.decision.propose', name: 'Propose Asset Decisions', description: 'Propose executive asset and facility decisions.' },
    { code: 'asset.decision.approve', name: 'Approve Asset Decisions', description: 'Approve executive asset and facility decisions with Four-Eyes SoD.' },
    { code: 'asset.audit.view', name: 'View Asset Audit Trail', description: 'View immutable audit trail for asset & facilities governance.' },
    { code: 'asset.diagnostics.run', name: 'Run Asset Diagnostics', description: 'Execute governance diagnostic engine for physical assets and facilities.' }
  ]
};
