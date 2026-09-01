import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalRiskModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_risk',
  name: 'Enterprise Risk & Incident Command',
  displayName: 'Enterprise Risk Management & Incident Command',
  description: 'Governed enterprise risk registers, dynamic 5x5 heatmaps, mitigation controls, Key Risk Indicators (KRIs), campus Incident Command System (ICS), business continuity plans (BCP), and safety audit CAPA tracking.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'risk.view',
      name: 'View Enterprise Risk & Incidents',
      description: 'Allows viewing risk registers, heatmaps, campus incidents, and continuity plans.'
    },
    {
      code: 'risk.create',
      name: 'Create Risk Items & Log Incidents',
      description: 'Allows drafting risk register entries, logging campus incidents, and proposing mitigations.'
    },
    {
      code: 'risk.manage',
      name: 'Manage Risk Registers & Controls',
      description: 'Allows updating risk mitigation progress, KRIs, BCPs, and safety findings.'
    },
    {
      code: 'risk.review',
      name: 'Review Risk & Continuity Plans',
      description: 'Allows formal risk reviews, BCP evaluations, and safety inspection reviews.'
    },
    {
      code: 'risk.approve',
      name: 'Approve Risk & Mitigation Plans',
      description: 'Allows authoritative executive approval of risk registers, BCPs, and CAR closures.'
    },
    {
      code: 'risk.incident_command',
      name: 'Campus Incident Command Lead',
      description: 'Allows activating the Incident Command System, assigning response roles, and managing crisis operations.'
    },
    {
      code: 'risk.safety_audit',
      name: 'Conduct Safety Audits & Inspections',
      description: 'Allows executing campus safety inspections, logging hazard findings, and issuing CAR notices.'
    },
    {
      code: 'risk.drills',
      name: 'Coordinate Continuity & Safety Drills',
      description: 'Allows scheduling, conducting, and scoring emergency evacuations and continuity simulations.'
    },
    {
      code: 'risk.analytics',
      name: 'View Risk Heatmaps & Analytics',
      description: 'Allows accessing 5x5 dynamic risk heatmaps, threat exposure indices, and BCP readiness metrics.'
    }
  ]
};
