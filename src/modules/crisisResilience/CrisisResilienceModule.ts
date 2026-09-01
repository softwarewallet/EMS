import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const CrisisResilienceModule: UniversalModuleContract = {
  moduleId: 'mod_crisis_resilience',
  name: 'Institutional Crisis Management, Emergency Operations, Disaster Recovery & Organizational Resilience Governance Engine',
  displayName: 'Crisis & Resilience Governance (Resilience)',
  description: 'Enterprise-grade command-and-control layer for orchestrating EOC command assignments, emergency dispatches, business continuity plans, disaster recovery operations, and isolated resilience simulations.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'crisis.view',
      name: 'View Crisis Records',
      description: 'Allows viewing active crises, EOC command status, and resilience metrics.'
    },
    {
      code: 'crisis.create',
      name: 'Create Crisis Logs',
      description: 'Allows logging new threat signals or draft crisis records.'
    },
    {
      code: 'crisis.assess',
      name: 'Assess Crisis Event',
      description: 'Allows conducting preliminary risk assessments on active crisis events.'
    },
    {
      code: 'crisis.declare',
      name: 'Declare Active Crisis',
      description: 'Allows officially declaring active crises and initiating response protocols (SoD enforced).'
    },
    {
      code: 'crisis.eoc.manage',
      name: 'Manage EOC Activations',
      description: 'Allows managing Emergency Operations Center activation triggers (SoD enforced).'
    },
    {
      code: 'crisis.command.manage',
      name: 'Manage Command Assignments',
      description: 'Allows setting EOC command assignments and resolving command incompatible roles.'
    },
    {
      code: 'crisis.response.manage',
      name: 'Orchestrate Actions',
      description: 'Allows tracking response tasks, SLA milestones, and response clock completions.'
    },
    {
      code: 'crisis.escalation.manage',
      name: 'Configure Escalations',
      description: 'Allows configuring and tracking severity-based and SLA escalations.'
    },
    {
      code: 'crisis.communication.execute',
      name: 'Execute Dispatches',
      description: 'Allows broadcasting emergency messages across multi-channel priority transport layers.'
    },
    {
      code: 'crisis.override.request',
      name: 'Request Emergency Overrides',
      description: 'Allows requesting temporary transient security policy overrides.'
    },
    {
      code: 'crisis.override.approve',
      name: 'Approve Emergency Overrides',
      description: 'Allows peer-approving temporary emergency overrides (SoD enforced).'
    },
    {
      code: 'crisis.continuity.manage',
      name: 'Manage Business Continuity',
      description: 'Allows managing critical services, alternate procedures, and BCP coverage mappings.'
    },
    {
      code: 'crisis.recovery.manage',
      name: 'Manage System Restore',
      description: 'Allows activating and orchestrating disaster recovery system restorations (SoD enforced).'
    },
    {
      code: 'crisis.evacuation.manage',
      name: 'Manage Evacuations',
      description: 'Allows initiating campus closure or zone evacuation orders (SoD enforced).'
    },
    {
      code: 'crisis.reentry.approve',
      name: 'Approve Campus Reentry',
      description: 'Allows peer-approving reentry authorizations post safety inspections (SoD enforced).'
    },
    {
      code: 'crisis.resource.manage',
      name: 'Manage Emergency Resources',
      description: 'Allows request and deployment of emergency resource capacities (SoD enforced).'
    },
    {
      code: 'crisis.playbook.manage',
      name: 'Manage Playbooks',
      description: 'Allows drafting and version-publishing immutable response playbooks.'
    },
    {
      code: 'crisis.simulation.run',
      name: 'Run Offline Simulations',
      description: 'Allows running completely isolated resilience simulation drills in sandbox buffers.'
    },
    {
      code: 'crisis.aar.manage',
      name: 'Manage AAR Learning',
      description: 'Allows finalizing After-Action Review (AAR) correctives (SoD enforced).'
    },
    {
      code: 'crisis.resilience.view',
      name: 'View Resilience Snapshot',
      description: 'Allows viewing readiness snapshots, gap assessments, and analytics.'
    },
    {
      code: 'crisis.audit.view',
      name: 'View Resilience Audits',
      description: 'Allows viewing immutable crisis and operations audit trail collections.'
    },
    {
      code: 'crisis.data_quality.manage',
      name: 'Manage Data Quality Scans',
      description: 'Allows running diagnostics scans and viewing quality finding registers.'
    }
  ]
};
