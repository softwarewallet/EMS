import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const EnterprisePortfolioModule: UniversalModuleContract = {
  moduleId: 'mod_enterprise_portfolio',
  name: 'Institutional Enterprise Portfolio, Program & Transformation Governance Engine',
  displayName: 'Enterprise Portfolio & Transformation',
  description: 'Enterprise governance layer for institutional programs, strategic initiatives, transformation portfolios, milestones, stage-gate decisions, dependency health, benefits realization, and transformation assurance.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'enterprise.portfolio.view',
      name: 'View Enterprise Portfolios',
      description: 'Allows viewing strategic portfolios, initiatives, milestones, gates, and benefit plans.'
    },
    {
      code: 'enterprise.portfolio.manage',
      name: 'Manage Enterprise Portfolios',
      description: 'Allows registering and managing portfolios, programs, initiatives, milestones, dependencies, and benefits realization plans.'
    },
    {
      code: 'enterprise.portfolio.approve',
      name: 'Approve Portfolio State Transitions',
      description: 'Allows formal sign-off of stage-gates, capital allocation decisions, and interventions (Four-Eyes SoD enforced).'
    },
    {
      code: 'enterprise.scenario.simulate',
      name: 'Run Scenario Simulations',
      description: 'Allows executing what-if projections, comparing portfolio compositions, and certifying simulation results.'
    },
    {
      code: 'enterprise.governance.certify',
      name: 'Certify Governance and Quality',
      description: 'Allows auditing, checking data quality, running health checks, and resolving data issues.'
    }
  ]
};
