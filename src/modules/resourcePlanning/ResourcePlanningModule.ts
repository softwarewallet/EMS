import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ResourcePlanningModule: UniversalModuleContract = {
  moduleId: 'mod_resource_planning',
  name: 'Institutional Resource Planning, Capacity, Allocation & Enterprise Portfolio Governance Engine',
  displayName: 'Resource & Portfolio Governance',
  description: 'Enterprise resource planning, deterministic capacity calculations, transaction-safe allocation requests, segregation of duties (SoD) peer reviews, portfolio prioritization, scenario simulation, and compliance reporting.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'resource.plan.view',
      name: 'View Resource Plans',
      description: 'Allows viewing academic plans, capacities, forecasts, allocations, and constraints.'
    },
    {
      code: 'resource.plan.manage',
      name: 'Manage Resource Plans',
      description: 'Allows drafting, submitting, and editing plans and capacity profiles.'
    },
    {
      code: 'resource.plan.approve',
      name: 'Approve Resource Plans',
      description: 'Allows formal sign-off and approval of resource plans and allocations (Four-Eyes SoD enforced).'
    },
    {
      code: 'resource.portfolio.manage',
      name: 'Manage Portfolio Items',
      description: 'Allows registering, reviewing, and scoring strategic portfolio initiatives.'
    },
    {
      code: 'resource.scenario.simulate',
      name: 'Run Scenario Simulations',
      description: 'Allows executing what-if projections and certifying simulation results.'
    },
    {
      code: 'resource.governance.certify',
      name: 'Certify Governance compliance',
      description: 'Allows certifying formal compliance ratings and resolving data sanity issues.'
    }
  ]
};
