import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const FinancialGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_financial_governance',
  name: 'Institutional Financial Governance, Budget, Treasury, Revenue, Cost & Financial Resilience Engine',
  displayName: 'Financial Governance & Treasury',
  description: 'Authoritative governance layer for financial strategy, multi-year planning, budget envelopes, treasury controls, revenue governance, cost optimization, capital projects, financial controls, and resilience.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Finance',
  provider: 'EduTech-SMS',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'financial_governance.view', name: 'View Financial Governance', description: 'View financial governance dashboards and command center.' },
    { code: 'financial_governance.create', name: 'Create Financial Records', description: 'Create financial strategy, budget, and control records.' },
    { code: 'financial_governance.edit', name: 'Edit Financial Records', description: 'Edit existing financial governance records.' },
    { code: 'financial_governance.manage', name: 'Manage Financial Governance', description: 'Manage overall financial governance parameters.' },

    { code: 'financial_strategy.view', name: 'View Financial Strategy', description: 'View multi-year financial strategies.' },
    { code: 'financial_strategy.manage', name: 'Manage Financial Strategy', description: 'Manage financial strategy objectives and assumptions.' },
    { code: 'financial_strategy.approve', name: 'Approve Financial Strategy', description: 'Approve multi-year financial strategies.' },

    { code: 'financial_plan.view', name: 'View Financial Plans', description: 'View institutional financial plans.' },
    { code: 'financial_plan.manage', name: 'Manage Financial Plans', description: 'Manage multi-year financial plan references.' },
    { code: 'financial_plan.approve', name: 'Approve Financial Plans', description: 'Approve institutional financial plans.' },

    { code: 'financial_budget.view', name: 'View Budget Governance', description: 'View budget frameworks, cycles, envelopes, and requests.' },
    { code: 'financial_budget.manage', name: 'Manage Budget Frameworks', description: 'Manage budget cycles, allocations, and envelopes.' },
    { code: 'financial_budget.approve', name: 'Approve Budget Requests', description: 'Approve or reject budget requests.' },
    { code: 'financial_budget.transfer', name: 'Approve Budget Transfers', description: 'Approve or reject budget transfer requests.' },
    { code: 'financial_budget.revise', name: 'Approve Budget Revisions', description: 'Approve or reject budget revision proposals.' },

    { code: 'financial_cost.view', name: 'View Cost Management', description: 'View cost observations and optimization plans.' },
    { code: 'financial_cost.manage', name: 'Manage Cost Optimization', description: 'Manage cost center governance and optimization plans.' },

    { code: 'financial_revenue.view', name: 'View Revenue Governance', description: 'View revenue streams and forecasts.' },
    { code: 'financial_revenue.manage', name: 'Manage Revenue Governance', description: 'Manage revenue streams and funding sources.' },
    { code: 'financial_revenue.forecast', name: 'Approve Revenue Forecasts', description: 'Approve revenue forecast models.' },

    { code: 'financial_treasury.view', name: 'View Treasury & Cash Flow', description: 'View liquidity observations and treasury governance.' },
    { code: 'financial_treasury.manage', name: 'Manage Treasury Governance', description: 'Manage treasury policy references and liquidity controls.' },

    { code: 'financial_capital.view', name: 'View Capital Plans', description: 'View capital plans and project governance.' },
    { code: 'financial_capital.manage', name: 'Manage Capital Plans', description: 'Manage capital project governance and priorities.' },
    { code: 'financial_capital.approve', name: 'Approve Capital Projects', description: 'Approve capital project governance proposals.' },

    { code: 'financial_forecast.view', name: 'View Financial Forecasts', description: 'View financial variance and forecast models.' },
    { code: 'financial_forecast.manage', name: 'Manage Financial Forecasts', description: 'Manage financial forecasting assumptions.' },

    { code: 'financial_control.view', name: 'View Financial Controls', description: 'View internal financial controls and test results.' },
    { code: 'financial_control.manage', name: 'Manage Financial Controls', description: 'Manage financial control definitions.' },
    { code: 'financial_control.test', name: 'Test Financial Controls', description: 'Execute and record internal financial control tests.' },

    { code: 'financial_risk.view', name: 'View Financial Risks', description: 'View financial risk matrix and mitigations.' },
    { code: 'financial_risk.manage', name: 'Manage Financial Risks', description: 'Manage financial risk ratings and mitigation plans.' },

    { code: 'financial_resilience.view', name: 'View Financial Resilience', description: 'View institutional financial resilience ratings.' },
    { code: 'financial_resilience.manage', name: 'Manage Financial Resilience', description: 'Perform financial resilience assessments.' },

    { code: 'financial_exception.manage', name: 'Request Financial Exceptions', description: 'Request exceptions to internal financial controls.' },
    { code: 'financial_exception.approve', name: 'Approve Financial Exceptions', description: 'Approve or revoke financial control exceptions.' },

    { code: 'financial_decision.view', name: 'View Financial Decisions', description: 'View high-value financial decisions.' },
    { code: 'financial_decision.manage', name: 'Propose Financial Decisions', description: 'Propose high-value financial decisions.' },
    { code: 'financial_decision.approve', name: 'Approve Financial Decisions', description: 'Approve high-value financial decisions.' },

    { code: 'financial_diagnostics.run', name: 'Run Financial Diagnostics', description: 'Run financial governance diagnostic engine.' },
    { code: 'financial_audit.view', name: 'View Financial Audit Trail', description: 'View immutable financial governance audit trail.' }
  ]
};
