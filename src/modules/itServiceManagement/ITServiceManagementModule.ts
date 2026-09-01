import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ITServiceManagementModule: UniversalModuleContract = {
  moduleId: 'mod_it_service_management',
  name: 'Institutional IT Service Management, Digital Operations & Service Delivery Governance Engine',
  displayName: 'IT Service Management (ITSM)',
  description: 'Enterprise-grade governance and orchestration layer for institutional technology services, governing catalog lifecycle, incidents, service requests, changes, problems, and operational resilience.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'itsm.service.manage',
      name: 'Manage Service Catalog',
      description: 'Allows registering, drafting, and activating services and service level agreements.'
    },
    {
      code: 'itsm.service.approve',
      name: 'Approve Service Catalog',
      description: 'Allows formal sign-off and approval of draft service definitions (Four-Eyes SoD enforced).'
    },
    {
      code: 'itsm.incident.create',
      name: 'Log Incidents',
      description: 'Allows registering and logging operational incidents.'
    },
    {
      code: 'itsm.incident.triage',
      name: 'Triage & Assign Incidents',
      description: 'Allows categorization, priority assessment, and assignment of active incidents.'
    },
    {
      code: 'itsm.incident.resolve',
      name: 'Resolve Incidents',
      description: 'Allows implementing and documenting incident resolutions.'
    },
    {
      code: 'itsm.incident.close',
      name: 'Verify Incident Closure',
      description: 'Allows confirming resolution and closing incident tickets (SoD peer verification enforced).'
    },
    {
      code: 'itsm.major_incident.declare',
      name: 'Declare Major Incidents',
      description: 'Allows activating Major Incident Command and establishing response commanders.'
    },
    {
      code: 'itsm.problem.manage',
      name: 'Manage Problems and RCAs',
      description: 'Allows recording problems, conducting 5 Whys Root Cause Analysis, and registering known errors.'
    },
    {
      code: 'itsm.change.create',
      name: 'Request Changes (RFC)',
      description: 'Allows drafting and requesting changes to technical infrastructure.'
    },
    {
      code: 'itsm.change.approve',
      name: 'Approve CAB Changes',
      description: 'Allows change advisory board approval of RFCs.'
    },
    {
      code: 'itsm.change.implement',
      name: 'Implement and Validate Changes',
      description: 'Allows logging implementation steps and validating change outcomes.'
    },
    {
      code: 'itsm.release.manage',
      name: 'Govern Releases and Deployments',
      description: 'Allows scheduling releases and validating deployment compliance.'
    },
    {
      code: 'itsm.governance.scan',
      name: 'Run Service Quality Scans',
      description: 'Allows triggering automated scanning for service registry omissions and data quality issues.'
    },
    {
      code: 'itsm.governance.override',
      name: 'Execute Governance Override',
      description: 'Allows platform super-admin override of strict separation of duties.'
    }
  ]
};
