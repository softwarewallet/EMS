import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalAnalyticsModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_analytics',
  name: 'Institutional Data, Analytics, Business Intelligence & Decision Intelligence Governance Engine',
  displayName: 'Data, BI & Decision Analytics',
  description: 'Governed derived analytics layer, executive scorecards, KPI data lineage, cohort intelligence, transparent trend forecasting, benchmarking, automated data quality detection, decision insights, and controlled export governance.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'analytics.view',
      name: 'View Institutional Analytics Workspace',
      description: 'Allows viewing dashboards, metrics, scorecards, and executive summaries.'
    },
    {
      code: 'analytics.dashboard.manage',
      name: 'Manage Analytics Dashboards',
      description: 'Allows creating, configuring, and publishing analytics dashboards and widgets.'
    },
    {
      code: 'analytics.metric.manage',
      name: 'Manage KPI Metric Definitions',
      description: 'Allows defining KPI metrics, data lineage, thresholds, and refresh modes.'
    },
    {
      code: 'analytics.dataset.manage',
      name: 'Manage Analytics Datasets',
      description: 'Allows configuring dataset snapshots and source collection mappings.'
    },
    {
      code: 'analytics.cohort.manage',
      name: 'Manage Student & Academic Cohorts',
      description: 'Allows creating cohort definitions with minimum cohort size privacy controls.'
    },
    {
      code: 'analytics.forecast.view',
      name: 'View Trend & Forecast Models',
      description: 'Allows viewing deterministic trend analyses and transparent forecast results.'
    },
    {
      code: 'analytics.benchmark.manage',
      name: 'Manage Institutional Benchmarks',
      description: 'Allows recording institutional and verified external benchmark references.'
    },
    {
      code: 'analytics.data_quality.manage',
      name: 'Manage Data Quality Audits',
      description: 'Allows running data quality scans, reviewing issues, and assigning remediation.'
    },
    {
      code: 'analytics.insight.review',
      name: 'Review & Certify Decision Insights',
      description: 'Allows reviewing and certifying decision insights (SoD enforced).'
    },
    {
      code: 'analytics.alert.manage',
      name: 'Manage Threshold Alerts',
      description: 'Allows configuring and acknowledging metric threshold breach alerts.'
    },
    {
      code: 'analytics.report.manage',
      name: 'Manage Governed Analytics Reports',
      description: 'Allows defining and publishing executive and departmental report templates.'
    },
    {
      code: 'analytics.report.execute',
      name: 'Execute Governed Reports',
      description: 'Allows running report executions and generating snapshot summaries.'
    },
    {
      code: 'analytics.export',
      name: 'Request & Download Analytics Exports',
      description: 'Allows requesting structured dataset exports in CSV, XLSX, or PDF.'
    },
    {
      code: 'analytics.sensitive_data.view',
      name: 'View Sensitive & Restricted Analytics',
      description: 'Allows viewing highly confidential metrics and unmasked cohort drilldowns.'
    },
    {
      code: 'analytics.governance.approve',
      name: 'Approve Analytics Governance Reviews',
      description: 'Allows approving metrics, restricted exports, and governance decisions (SoD enforced).'
    },
    {
      code: 'analytics.audit.view',
      name: 'View Analytics Governance Audit Trail',
      description: 'Allows inspecting immutable analytics access and action audit logs.'
    }
  ]
};
