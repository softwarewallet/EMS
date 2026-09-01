import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ProcessExcellenceGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_process_excellence_governance',
  name: 'Process Excellence & Continuous Improvement Governance',
  displayName: 'Process Excellence & Continuous Improvement',
  description: 'Institutional Process Excellence, Continuous Improvement, Quality Improvement & Operational Excellence Governance Control Plane',
  category: 'Future',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '9.7.0',
  dependencies: [
    { moduleId: 'mod_decision_intelligence_governance' },
    { moduleId: 'mod_planning_budget_resource_governance' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_process_excellence_governance',
      moduleId: 'mod_process_excellence_governance',
      label: 'Process Excellence',
      icon: 'Activity',
      route: 'process_excellence_governance',
      sortOrder: 115,
      status: 'active',
      requiredPermission: 'process.governance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'process.governance.view',
      name: 'View Process Excellence Governance',
      description: 'Access to institutional process excellence and continuous improvement workspace'
    },
    {
      code: 'process.improvement.authorize',
      name: 'Authorize Improvement Initiatives',
      description: 'Power to approve institutional process improvement initiatives'
    },
    {
      code: 'process.simulation.run',
      name: 'Run Process Simulations',
      description: 'Ability to execute what-if process and bottleneck scenarios'
    }
  ]
};
