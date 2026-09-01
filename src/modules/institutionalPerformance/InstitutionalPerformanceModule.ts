import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalPerformanceModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_performance',
  name: 'Institutional Performance & Strategy',
  displayName: 'Institutional Strategy & Performance',
  description: 'Manage institutional strategic plans, objectives, KPIs, performance reviews, risks, and scorecards.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Core',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'performance.view',
      name: 'View Performance & Strategy',
      description: 'Allows viewing of institutional strategic plans, objectives, and KPIs.'
    },
    {
      code: 'strategy.view',
      name: 'View Strategic Plans',
      description: 'Allows viewing of multi-year strategic plans, vision, mission, and pillars.'
    },
    {
      code: 'strategy.create',
      name: 'Create Strategic Plans',
      description: 'Allows drafting new strategic plans and roadmaps.'
    },
    {
      code: 'strategy.manage',
      name: 'Manage Strategic Planning',
      description: 'Allows creating, modifying, and managing strategic plans and institutional roadmaps.'
    },
    {
      code: 'objective.create',
      name: 'Create Strategic Objectives',
      description: 'Allows defining new strategic objectives linked to approved plans.'
    },
    {
      code: 'objective.manage',
      name: 'Manage Strategic Objectives',
      description: 'Allows updating, prioritizing, and weighting strategic objectives.'
    },
    {
      code: 'kpi.view',
      name: 'View KPIs & Measurements',
      description: 'Allows viewing institutional KPIs, targets, and measurement scorecards.'
    },
    {
      code: 'kpi.create',
      name: 'Create KPI Definitions',
      description: 'Allows defining new authoritative KPIs and calculation methods.'
    },
    {
      code: 'kpi.manage',
      name: 'Manage KPI Definitions',
      description: 'Allows definition, versioning, weighting, and governance of institutional KPIs.'
    },
    {
      code: 'kpi.measure',
      name: 'Submit KPI Measurements',
      description: 'Allows recording and submission of actual performance measurements and evidence.'
    },
    {
      code: 'kpi.verify',
      name: 'Verify KPI Measurements',
      description: 'Allows quality auditing and verification of submitted KPI measurements.'
    },
    {
      code: 'target.manage',
      name: 'Manage Performance Targets',
      description: 'Allows establishing and modifying periodic KPI performance targets and thresholds.'
    },
    {
      code: 'risk.manage',
      name: 'Manage Performance Risks',
      description: 'Allows logging, scoring, mitigating, and closing performance risks.'
    },
    {
      code: 'corrective_action.manage',
      name: 'Manage Corrective Actions',
      description: 'Allows initiating, assigning, executing, and closing performance corrective actions.'
    },
    {
      code: 'performance.approve',
      name: 'Approve Performance Records',
      description: 'Allows authoritative executive approval and locking of strategic plans and measurements.'
    },
    {
      code: 'performance.export',
      name: 'Export Performance Data',
      description: 'Allows exporting institutional scorecards, risk ledgers, and strategy audits.'
    },
    {
      code: 'governance.audit',
      name: 'Institutional Performance Audit',
      description: 'Allows full read access to strategy and performance governance audit trails.'
    },
    // Backwards-compatible aliases
    {
      code: 'institutional_performance.view',
      name: 'Institutional Performance View (Legacy)',
      description: 'Legacy alias for performance.view.'
    },
    {
      code: 'institutional_performance.manage_strategy',
      name: 'Manage Strategic Planning (Legacy)',
      description: 'Legacy alias for strategy.manage.'
    },
    {
      code: 'institutional_performance.manage_kpis',
      name: 'Manage KPI Definitions (Legacy)',
      description: 'Legacy alias for kpi.manage.'
    },
    {
      code: 'institutional_performance.submit_measurements',
      name: 'Submit KPI Measurements (Legacy)',
      description: 'Legacy alias for kpi.measure.'
    },
    {
      code: 'institutional_performance.approve_measurements',
      name: 'Approve Measurements (Legacy)',
      description: 'Legacy alias for performance.approve.'
    },
    {
      code: 'institutional_performance.manage_risks',
      name: 'Manage Performance Risks (Legacy)',
      description: 'Legacy alias for risk.manage.'
    },
    {
      code: 'institutional_performance.manage_governance',
      name: 'Performance Governance Admin (Legacy)',
      description: 'Legacy alias for performance governance administration.'
    }
  ]
};

