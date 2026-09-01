/**
 * EMS Phase 11.17 Module Contract: Institutional Strategy, Planning, Performance & Quality Operations
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalStrategyPlanningPerformanceModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_strategy_planning_performance',
  name: 'Institutional Strategy, Planning, Performance & Quality Operations',
  displayName: 'Strategy, Performance & Quality',
  description: 'Authoritative operational engine for strategy, KPIs, OKRs, quality assurance, accreditation, CAPAs, and continuous improvement.',
  version: '11.17.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_legal_compliance_risk_governance', minVersion: '11.16.0' }
  ],
  configurationSchema: [
    { key: 'enableFourEyesApproval', type: 'boolean', label: 'Require Four-Eyes Approval', required: true, defaultValue: true },
    { key: 'defaultKPIFrequency', type: 'string', label: 'Default KPI Frequency', required: true, defaultValue: 'QUARTERLY' }
  ],
  navigationItems: [
    {
      id: 'nav_strategy_command_center',
      moduleId: 'mod_institutional_strategy_planning_performance',
      label: 'Strategy & Performance Command',
      icon: 'Target',
      route: 'institutional_strategy_planning_performance',
      sortOrder: 40,
      status: 'active',
      requiredPermission: 'strategy.view',
      allowedRoles: ['super_admin', 'platform_admin', 'strategy_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_kpi_scorecards',
      moduleId: 'mod_institutional_strategy_planning_performance',
      label: 'KPIs & Scorecards',
      icon: 'BarChart2',
      route: 'institutional_strategy_planning_performance',
      sortOrder: 41,
      status: 'active',
      requiredPermission: 'performance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'strategy_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_quality_accreditation',
      moduleId: 'mod_institutional_strategy_planning_performance',
      label: 'Quality & Accreditation',
      icon: 'Award',
      route: 'institutional_strategy_planning_performance',
      sortOrder: 42,
      status: 'active',
      requiredPermission: 'quality.view',
      allowedRoles: ['super_admin', 'platform_admin', 'quality_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_capa_improvement',
      moduleId: 'mod_institutional_strategy_planning_performance',
      label: 'Findings & CAPAs',
      icon: 'ClipboardList',
      route: 'institutional_strategy_planning_performance',
      sortOrder: 43,
      status: 'active',
      requiredPermission: 'improvement.view',
      allowedRoles: ['super_admin', 'platform_admin', 'quality_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_strategy_diagnostics',
      moduleId: 'mod_institutional_strategy_planning_performance',
      label: 'Diagnostics & Sandbox',
      icon: 'Activity',
      route: 'institutional_strategy_planning_performance',
      sortOrder: 44,
      status: 'active',
      requiredPermission: 'diagnostics.view',
      allowedRoles: ['super_admin', 'platform_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'strategy.view', name: 'View Strategy', description: 'View institutional strategy.' },
    { code: 'strategy.manage', name: 'Manage Strategy', description: 'Manage strategy plans.' },
    { code: 'performance.view', name: 'View Performance', description: 'View KPIs.' },
    { code: 'performance.measure', name: 'Measure KPIs', description: 'Submit KPI measurements.' },
    { code: 'quality.view', name: 'View Quality', description: 'View quality reviews.' },
    { code: 'improvement.manage', name: 'Manage CAPAs', description: 'Manage corrective actions.' },
    { code: 'improvement.verify', name: 'Verify CAPAs', description: 'Four-Eyes verify CAPAs.' },
    { code: 'diagnostics.view', name: 'View Diagnostics', description: 'Run diagnostics.' }
  ],
  eventsEmitted: [
    { eventName: 'STRATEGY_APPROVED', description: 'Fired when strategy is approved.' },
    { eventName: 'KPI_MEASUREMENT_SUBMITTED', description: 'Fired when KPI is submitted.' },
    { eventName: 'CAPA_VERIFIED', description: 'Fired when CAPA is verified.' }
  ],
  eventsConsumed: []
};
