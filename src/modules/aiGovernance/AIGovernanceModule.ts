import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AIGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_ai_governance',
  name: 'Institutional Artificial Intelligence, Responsible AI, Model Governance & AI Decision Oversight Governance Engine',
  displayName: 'AI & Model Governance (AIGov)',
  description: 'Enterprise-grade governance layer for tracking AI systems, model lifecycles, certified evaluation runs, data quality scans, safety policies, multi-agent execution depth, human-in-the-loop review, and immutable audit logs.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'aigov.system.create',
      name: 'Create AI Systems',
      description: 'Allows registering AI use cases, systems, and models.'
    },
    {
      code: 'aigov.system.approve',
      name: 'Approve AI Systems',
      description: 'Allows peer-approving registered AI systems and use cases (SoD enforced).'
    },
    {
      code: 'aigov.model.approve',
      name: 'Approve AI Models',
      description: 'Allows peer-approving models for staging and production lifecycles (SoD enforced).'
    },
    {
      code: 'aigov.evaluation.certify',
      name: 'Certify Evaluation Runs',
      description: 'Allows certifying benchmark and safety evaluation runs (SoD enforced).'
    },
    {
      code: 'aigov.dataset.verify',
      name: 'Verify Dataset Lineage',
      description: 'Allows validating dataset consent, classification, and lineage tracing.'
    },
    {
      code: 'aigov.agent.manage',
      name: 'Configure Agent Safeguards',
      description: 'Allows managing recursion depths, safety thresholds, and active model status.'
    },
    {
      code: 'aigov.incident.manage',
      name: 'Triage AI Incidents',
      description: 'Allows tracking, triaging, and closing reported AI/model incidents.'
    },
    {
      code: 'aigov.exception.review',
      name: 'Approve AI Exceptions',
      description: 'Allows peer approval of temporary AI safety policy exceptions (SoD enforced).'
    },
    {
      code: 'aigov.policy.manage',
      name: 'Manage AI Policies',
      description: 'Allows configuring safety thresholds, alignment metrics, and regulatory policies.'
    }
  ]
};
