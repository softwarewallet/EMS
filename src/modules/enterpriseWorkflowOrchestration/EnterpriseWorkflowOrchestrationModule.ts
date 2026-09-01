import React from 'react';
import { UniversalModuleContract } from '../../core/contracts/ModuleContract';
import { EnterpriseWorkflowOrchestrationWorkspace } from '../../components/enterpriseWorkflowOrchestration/EnterpriseWorkflowOrchestrationWorkspace';

export const EnterpriseWorkflowOrchestrationModule: UniversalModuleContract = {
  moduleId: 'mod_enterprise_workflow_orchestration',
  name: 'Enterprise Workflow & Institutional Process Orchestration Engine',
  displayName: 'Workflow & Orchestration',
  description: 'Governed execution layer that converts approved institutional decisions into controlled, traceable workflows.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Core',
  provider: 'EduTech-SMS',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'workflow.definitions.manage', name: 'Manage Definitions', description: 'Create and modify workflow definitions.' },
    { code: 'workflow.instances.view', name: 'View Workflows', description: 'View active workflow instances.' },
    { code: 'workflow.instances.trigger', name: 'Trigger Workflows', description: 'Manually trigger workflow instances.' }
  ]
};
