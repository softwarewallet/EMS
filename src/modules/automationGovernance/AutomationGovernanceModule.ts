import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AutomationGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_automation_governance',
  name: 'Institutional Automation, Rules, Alerts & Decision Workflow Governance Engine',
  displayName: 'Automation & Decision Governance',
  description: 'Enterprise workflow automation registry, deterministic rule evaluators, controlled action pipelines, four-eyes peer approvals, safe exception management, runaway execution protection, idempotency enforcement, and system-wide emergency kill switches.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'automation.view',
      name: 'View Automation Policies',
      description: 'Allows viewing automation definitions, rules, execution history, and live schedules.'
    },
    {
      code: 'automation.create',
      name: 'Create Automation Policies',
      description: 'Allows drafting new automation definitions, conditions, and action configurations.'
    },
    {
      code: 'automation.edit',
      name: 'Edit Automation Policies',
      description: 'Allows editing draft or pending automation policy setups.'
    },
    {
      code: 'automation.submit',
      name: 'Submit Automation Policies',
      description: 'Allows submitting drafted automations for peer-review and validation.'
    },
    {
      code: 'automation.approve',
      name: 'Approve Automation Policies',
      description: 'Allows formal sign-off on pending automation policies (Four-Eyes SoD enforced).'
    },
    {
      code: 'automation.activate',
      name: 'Activate Automation Policies',
      description: 'Allows moving approved automation policies into live active operational state.'
    },
    {
      code: 'automation.suspend',
      name: 'Suspend Automation Policies',
      description: 'Allows administrative suspension of active automation policies.'
    },
    {
      code: 'automation.retire',
      name: 'Retire Automation Policies',
      description: 'Allows archiving/retiring obsolete automation policies to prevent future execution.'
    },
    {
      code: 'automation.execute',
      name: 'Execute Decisions',
      description: 'Allows manual or simulated execution of automation policies.'
    },
    {
      code: 'automation.exception.manage',
      name: 'Manage Exceptions',
      description: 'Allows requesting and approving bypass exceptions (Four-Eyes SoD enforced).'
    },
    {
      code: 'automation.schedule.manage',
      name: 'Manage Schedules',
      description: 'Allows defining and managing timer triggers, cron tasks, and windows.'
    },
    {
      code: 'automation.rate_limit.manage',
      name: 'Manage Rate Limits',
      description: 'Allows editing execution quotas, cascade depths, and retry parameters.'
    },
    {
      code: 'automation.audit.view',
      name: 'View Automation Audit',
      description: 'Allows auditing automation execution steps, exceptions, and security alerts.'
    },
    {
      code: 'automation.security.manage',
      name: 'Manage System Security',
      description: 'Allows managing security classifications, access logs, and bypass reviews.'
    },
    {
      code: 'automation.emergency.manage',
      name: 'Manage Emergency Stop',
      description: 'Allows triggering or lifting the system-wide emergency stop kill switch.'
    }
  ]
};
