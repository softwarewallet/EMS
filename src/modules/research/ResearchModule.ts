import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ResearchModule: UniversalModuleContract = {
  moduleId: 'mod_research',
  name: 'Research, Innovation & Project Governance',
  displayName: 'Research, Innovation, Projects & Institutional Knowledge Governance Engine',
  description: 'Enterprise governance for research projects, proposals, funding references, ethics compliance, publications, IP disclosures, innovation initiatives, institutional projects, risks/issues, and knowledge assets (Phase 7.22)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Academics',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_core', optional: false },
    { moduleId: 'mod_staff', optional: false },
    { moduleId: 'mod_finance', optional: true },
    { moduleId: 'mod_procurement', optional: true },
    { moduleId: 'mod_library', optional: true }
  ],
  configurationSchema: [],
  permissions: [
    { code: 'research.view', name: 'View Research Workspace', description: 'Access research projects, proposals, and projects' },
    { code: 'research.create', name: 'Create Projects & Proposals', description: 'Draft research proposals and projects' },
    { code: 'research.update', name: 'Update Research Records', description: 'Modify research proposals, projects, and milestones' },
    { code: 'research.submit', name: 'Submit Proposals & Projects', description: 'Submit proposals and projects for formal review' },
    { code: 'research.review', name: 'Review Proposals', description: 'Conduct formal review of research proposals' },
    { code: 'research.approve', name: 'Approve Proposals & Projects', description: 'Approve research proposals and project lifecycle transitions' },
    { code: 'research.manage_team', name: 'Manage Research Team', description: 'Assign PIs, co-investigators, and team members' },
    { code: 'research.manage_milestones', name: 'Manage Milestones', description: 'Create and update project milestones' },
    { code: 'research.manage_outputs', name: 'Manage Outputs & Publications', description: 'Register research outputs and publications' },
    { code: 'research.manage_ip', name: 'Manage Intellectual Property', description: 'Disclose and manage IP, patent, and copyright records' },
    { code: 'research.manage_innovation', name: 'Manage Innovation Initiatives', description: 'Track innovation ideas and pilot initiatives' },
    { code: 'research.manage_projects', name: 'Manage Institutional Projects', description: 'Create and oversee institutional projects' },
    { code: 'research.manage_risks', name: 'Manage Risks & Issues', description: 'Track project risks, severity scores, and issue resolution' },
    { code: 'research.manage_knowledge', name: 'Manage Knowledge Assets', description: 'Publish and curate institutional knowledge assets' },
    { code: 'research.export', name: 'Export Research Data', description: 'Export research project and publication reports' },
    { code: 'research.audit', name: 'Audit Research Logs', description: 'Access audit trail for research governance events' },
    { code: 'research.admin', name: 'Research System Admin', description: 'Full administrative control over research governance' }
  ],
  navigationItems: [
    {
      id: 'nav_research_workspace',
      moduleId: 'mod_research',
      label: 'Research & Innovation Governance',
      icon: 'Microscope',
      route: '/research/workspace',
      requiredPermission: 'research.view',
      sortOrder: 23,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] ResearchModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] ResearchModule disabled for tenant ${tenantId}`);
  }
};
