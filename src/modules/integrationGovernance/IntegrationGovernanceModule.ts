import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const IntegrationGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_integration_governance',
  name: 'Institutional Integration, Interoperability, API & Data Exchange Governance Engine',
  displayName: 'Integration & API Governance',
  description: 'Enterprise integration registry, API lifecycle management, data exchange contract governance, field mapping & lineage, idempotent execution, retry & dead-letter queue, webhook governance, four-eyes change management, and data quality scanning.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'integration.view',
      name: 'View Integration Registry',
      description: 'Allows viewing integration definitions, endpoints, health status, and configurations.'
    },
    {
      code: 'integration.create',
      name: 'Create Integration Definitions',
      description: 'Allows drafting new integration definitions and endpoint specifications.'
    },
    {
      code: 'integration.manage',
      name: 'Manage Integrations',
      description: 'Allows editing integration definitions, endpoints, and retry policies.'
    },
    {
      code: 'integration.approve',
      name: 'Approve Integration Definitions',
      description: 'Allows approving integration definitions for deployment (SoD four-eyes enforced).'
    },
    {
      code: 'integration.activate',
      name: 'Activate Integrations',
      description: 'Allows moving approved integrations into ACTIVE production status.'
    },
    {
      code: 'integration.suspend',
      name: 'Suspend Integrations',
      description: 'Allows suspending active integrations during maintenance or incident response.'
    },
    {
      code: 'api.view',
      name: 'View API Catalog',
      description: 'Allows viewing governed API definitions, consumers, and rate limits.'
    },
    {
      code: 'api.manage',
      name: 'Manage API Definitions',
      description: 'Allows drafting and updating API specifications, documentation, and scopes.'
    },
    {
      code: 'api.approve',
      name: 'Approve API Definitions',
      description: 'Allows approving API definitions for active consumer access (SoD four-eyes enforced).'
    },
    {
      code: 'exchange.view',
      name: 'View Data Exchange Contracts',
      description: 'Allows viewing data exchange contracts, field mappings, and job execution logs.'
    },
    {
      code: 'exchange.manage',
      name: 'Manage Data Exchange Contracts',
      description: 'Allows creating and editing exchange contracts, transformation rules, and schema versions.'
    },
    {
      code: 'exchange.execute',
      name: 'Execute Data Exchanges',
      description: 'Allows initiating event-triggered or batch data exchange jobs with idempotency.'
    },
    {
      code: 'exchange.replay',
      name: 'Replay Failed Exchange Jobs',
      description: 'Allows authorizing manual replay of failed or dead-letter data exchange jobs.'
    },
    {
      code: 'exchange.approve',
      name: 'Approve Exchange Contracts',
      description: 'Allows approving data exchange contracts and schema mappings (SoD four-eyes enforced).'
    },
    {
      code: 'webhook.manage',
      name: 'Manage Webhook Subscriptions',
      description: 'Allows configuring and revoking webhook subscriptions and secret metadata.'
    },
    {
      code: 'credential.manage',
      name: 'Manage Integration Credentials',
      description: 'Allows configuring vault secret references and initiating credential rotation.'
    },
    {
      code: 'lineage.view',
      name: 'View Data Lineage',
      description: 'Allows tracing data lineage from authoritative sources to destination modules.'
    },
    {
      code: 'change.manage',
      name: 'Manage Integration Change Requests',
      description: 'Allows submitting integration change requests with risk assessments and snapshots.'
    },
    {
      code: 'change.approve',
      name: 'Approve Integration Change Requests',
      description: 'Allows approving production integration change requests (SoD four-eyes enforced).'
    },
    {
      code: 'analytics.view',
      name: 'View Integration Analytics',
      description: 'Allows viewing integration health indicators, SLA breaches, and success rates.'
    },
    {
      code: 'data_quality.manage',
      name: 'Manage Integration Data Quality',
      description: 'Allows running automated data quality scans for orphan references and schema mismatches.'
    },
    {
      code: 'audit.view',
      name: 'View Integration Audit Trail',
      description: 'Allows inspecting immutable integration, API, and exchange audit logs.'
    }
  ]
};
