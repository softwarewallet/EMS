import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalPerformanceGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_performance_governance',
  name: 'Institutional Performance Intelligence, KPI, Metrics, Benchmarking & Executive Performance Governance Engine',
  displayName: 'Institutional Performance Intelligence',
  description: 'Foundational institutional performance-intelligence control plane governing KPIs, metric definitions, calculation governance, scorecards, targets, benchmarks, variance intelligence, and What-If performance resilience simulations.',
  version: '9.1.0',
  status: 'INSTALLED',
  category: 'Core',
  provider: 'EduTech-SMS',
  dependencies: [
    { moduleId: 'mod_institutional_analytics' },
    { moduleId: 'mod_data_governance' },
    { moduleId: 'mod_enterprise_data_integration_governance' },
    { moduleId: 'mod_enterprise_event_automation_governance' }
  ],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'performance.kpi.manage', name: 'Manage Institutional KPIs', description: 'Create and govern KPI definitions, metrics, and strategic alignment.' },
    { code: 'performance.target.approve', name: 'Approve Performance Targets', description: 'Four-Eyes approval for targets, thresholds, and performance bands.' },
    { code: 'performance.benchmark.certify', name: 'Certify Institutional Benchmarks', description: 'Certify external and sector benchmark references.' },
    { code: 'performance.scorecard.publish', name: 'Publish Performance Scorecards', description: 'Four-Eyes publication of institutional master scorecards.' },
    { code: 'performance.exception.approve', name: 'Approve Performance Exceptions', description: 'Four-Eyes approval for temporary target and threshold exceptions.' },
    { code: 'performance.sandbox.simulate', name: 'Run What-If Performance Sandbox', description: 'Execute isolated in-memory performance resilience simulations.' }
  ]
};
