import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const PlanningBudgetResourceGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_planning_budget_resource_governance',
  name: 'Planning, Budget & Portfolio Governance',
  displayName: 'Institutional Planning & Resource Governance',
  description: 'Institutional Planning, Budgeting, Resource Allocation, Investment Prioritization & Portfolio Governance Control Plane',
  category: 'Future',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '9.6.0',
  dependencies: [
    { moduleId: 'mod_decision_intelligence_governance' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_planning_budget_resource_governance',
      moduleId: 'mod_planning_budget_resource_governance',
      label: 'Planning & Portfolio',
      icon: 'BarChart3',
      route: 'planning_budget_portfolio',
      sortOrder: 110,
      status: 'active',
      requiredPermission: 'planning.governance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'institution_manager', 'tenant_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'planning.governance.view',
      name: 'View Planning & Portfolio Governance',
      description: 'Access to institutional planning and resource governance workspace'
    },
    {
      code: 'planning.allocation.authorize',
      name: 'Authorize Resource Allocations',
      description: 'Power to approve institutional resource and budget allocations'
    },
    {
      code: 'planning.simulation.run',
      name: 'Run Resource Simulations',
      description: 'Ability to execute what-if resource and budget scenarios'
    }
  ]
};
