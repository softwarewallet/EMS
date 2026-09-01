import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const WorkflowGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_workflow_governance',
  name: 'Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine',
  displayName: 'Workflow & Case Governance',
  description: 'Cross-module process orchestration, case management, enterprise task scheduling, configurable approval chains, four-eyes governance, SLA tracking, escalation engine, delegated authority, and process analytics.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'workflow.view',
      name: 'View Workflow Governance Workspace',
      description: 'Allows viewing workflow definitions, instances, work queue, cases, and tasks.'
    },
    {
      code: 'workflow.create',
      name: 'Create Workflow Definitions',
      description: 'Allows creating new workflow definition templates and draft versions.'
    },
    {
      code: 'workflow.manage',
      name: 'Manage Workflow Configurations',
      description: 'Allows editing stages, transitions, conditions, triggers, and SLA policies.'
    },
    {
      code: 'workflow.approve',
      name: 'Approve Workflow Definitions',
      description: 'Allows approving workflow versions for activation (SoD enforced).'
    },
    {
      code: 'workflow.activate',
      name: 'Activate Workflows',
      description: 'Allows activating approved workflow versions for institutional execution.'
    },
    {
      code: 'workflow.execute',
      name: 'Execute & Instantiate Workflows',
      description: 'Allows initiating workflow instances and advancing stage transitions.'
    },
    {
      code: 'workflow.delegate',
      name: 'Delegate Authority',
      description: 'Allows creating time-bound delegated authority records.'
    },
    {
      code: 'workflow.escalate',
      name: 'Trigger Process Escalations',
      description: 'Allows escalating overdue, blocked, or critical workflows, cases, and tasks.'
    },
    {
      code: 'workflow.emergency_override',
      name: 'Execute Emergency Workflow Override',
      description: 'Allows emergency bypass of blocked stages with logged justification.'
    },
    {
      code: 'case.view',
      name: 'View Enterprise Cases',
      description: 'Allows viewing open, assigned, and historical enterprise cases.'
    },
    {
      code: 'case.create',
      name: 'Create Enterprise Cases',
      description: 'Allows creating enterprise cases linked to authoritative source entities.'
    },
    {
      code: 'case.manage',
      name: 'Manage Enterprise Cases',
      description: 'Allows updating case details, priority, evidence, and participants.'
    },
    {
      code: 'case.assign',
      name: 'Assign Case Ownership',
      description: 'Allows reassigning case primary owners and department handlers.'
    },
    {
      code: 'case.resolve',
      name: 'Resolve Enterprise Cases',
      description: 'Allows marking cases as resolved with summary and corrective actions.'
    },
    {
      code: 'case.close',
      name: 'Close Enterprise Cases',
      description: 'Allows formally closing resolved cases.'
    },
    {
      code: 'task.view',
      name: 'View Enterprise Tasks',
      description: 'Allows viewing enterprise task queues and checklists.'
    },
    {
      code: 'task.create',
      name: 'Create Enterprise Tasks',
      description: 'Allows generating tasks linked to workflows, cases, or direct assignments.'
    },
    {
      code: 'task.manage',
      name: 'Manage Task Dependencies',
      description: 'Allows configuring task checklists, blocking dependencies, and due dates.'
    },
    {
      code: 'task.assign',
      name: 'Assign Enterprise Tasks',
      description: 'Allows assigning tasks to users, departments, or campus roles.'
    },
    {
      code: 'task.complete',
      name: 'Complete Enterprise Tasks',
      description: 'Allows marking tasks completed upon resolving mandatory dependencies.'
    },
    {
      code: 'sla.manage',
      name: 'Manage SLA Policies',
      description: 'Allows configuring response, resolution, and escalation SLA thresholds.'
    },
    {
      code: 'workflow.governance.approve',
      name: 'Approve Workflow Governance Reviews',
      description: 'Allows approving workflow governance decisions and override reviews.'
    },
    {
      code: 'workflow.audit.view',
      name: 'View Workflow Governance Audit Trail',
      description: 'Allows inspecting immutable workflow, case, task, and delegation audit logs.'
    }
  ]
};
