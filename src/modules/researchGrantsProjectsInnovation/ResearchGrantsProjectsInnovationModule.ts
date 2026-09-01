import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ResearchGrantsProjectsInnovationModule: UniversalModuleContract = {
  moduleId: 'mod_research_grants_projects_innovation',
  name: 'Institutional Research, Grants, Projects, Innovation & Sponsored Programs Operations',
  displayName: 'Research, Grants & Innovation',
  description: 'Authoritative operations module governing institutional research projects, proposals, funding opportunities, grant applications, grant awards, sponsored programs, research teams, milestones, deliverables, budgets, compliance reviews, ethics protocols, research risks, outputs, publications, IP disclosure, innovation tech-transfer, and commercialization.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.9.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_academic_management', minVersion: '10.2.0' },
    { moduleId: 'mod_student_lifecycle', minVersion: '10.4.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' },
    { moduleId: 'mod_inventory_assets_stores_materials', minVersion: '11.7.0' },
    { moduleId: 'mod_library_learning_resources', minVersion: '11.8.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_research_grants_projects_innovation',
      moduleId: 'mod_research_grants_projects_innovation',
      label: 'Research & Innovation',
      icon: 'FlaskConical',
      route: 'research_grants_projects_innovation',
      sortOrder: 18,
      status: 'active',
      requiredPermission: 'research.view',
      allowedRoles: [
        'super_admin',
        'platform_admin',
        'dean_research',
        'research_director',
        'principal_investigator',
        'faculty_member',
        'research_scholar',
        'grant_administrator',
        'compliance_officer',
        'tech_transfer_officer',
        'auditor'
      ],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'research.view',
      name: 'View Research & Grants',
      description: 'Access research project dashboards, public funding opportunities, and non-confidential project metadata'
    },
    {
      code: 'research.manage',
      name: 'Manage Research Configuration',
      description: 'Configure institutional research units, strategic themes, and sponsored program frameworks'
    },
    {
      code: 'research.project.create',
      name: 'Create Research Project',
      description: 'Initiate and submit new institutional research project profiles'
    },
    {
      code: 'research.project.update',
      name: 'Update Research Project',
      description: 'Modify project objectives, team assignments, and operational parameters'
    },
    {
      code: 'research.project.approve',
      name: 'Approve Research Project',
      description: 'Execute Four-Eyes institutional project approvals, status transitions, and lifecycle state changes'
    },
    {
      code: 'research.proposal.manage',
      name: 'Manage Research Proposals',
      description: 'Draft, revise, and package grant proposals for sponsor submission'
    },
    {
      code: 'research.proposal.submit',
      name: 'Submit Research Proposal',
      description: 'Authorize and submit formal institutional research proposals to external funding sponsors'
    },
    {
      code: 'research.grant.view',
      name: 'View Grant Applications & Awards',
      description: 'Inspect grant application tracking numbers, award agreements, and reporting requirements'
    },
    {
      code: 'research.grant.manage',
      name: 'Manage Grant Operations',
      description: 'Maintain grant award schedules, terms, amendments, and reporting obligations'
    },
    {
      code: 'research.grant.approve',
      name: 'Approve Grant Awards & Amendments',
      description: 'Execute Four-Eyes institutional acceptance of grant agreements and sponsor contract amendments'
    },
    {
      code: 'research.budget.view',
      name: 'View Research Budgets',
      description: 'Inspect project budget lines, commitments, expenditures, and remaining balances'
    },
    {
      code: 'research.budget.manage',
      name: 'Manage Research Budgets',
      description: 'Allocate budget line items and record approved project expenditures'
    },
    {
      code: 'research.budget.override',
      name: 'Override Research Budget Limits',
      description: 'Execute authorized Four-Eyes reallocations and budget category ceiling overrides'
    },
    {
      code: 'research.compliance.view',
      name: 'View Research Compliance & Ethics',
      description: 'Inspect IRB, IACUC, and IBC protocol clearances and risk assessments'
    },
    {
      code: 'research.compliance.manage',
      name: 'Manage Compliance Reviews',
      description: 'Conduct compliance audits, log ethics reviews, and track expiration dates'
    },
    {
      code: 'research.compliance.override',
      name: 'Override Research Compliance Holds',
      description: 'Grant authorized conditional safety clearances with Four-Eyes institutional approval'
    },
    {
      code: 'research.output.manage',
      name: 'Manage Research Outputs',
      description: 'Register publications, datasets, conference papers, and technical reports'
    },
    {
      code: 'research.ip.view',
      name: 'View Intellectual Property Disclosures',
      description: 'Inspect invention disclosures, patent filings, and licensing status'
    },
    {
      code: 'research.ip.manage',
      name: 'Manage Intellectual Property',
      description: 'File provisional patents, record inventor equity shares, and maintain filings'
    },
    {
      code: 'research.ip.approve',
      name: 'Approve IP Dispositions',
      description: 'Execute Four-Eyes institutional approval for patent licensing, assignment, and commercial rights transfer'
    },
    {
      code: 'research.innovation.manage',
      name: 'Manage Innovation & Incubation',
      description: 'Track startup ventures, prototype milestones, and Technology Readiness Levels (TRL)'
    },
    {
      code: 'research.commercialization.manage',
      name: 'Manage Commercialization & Tech-Transfer',
      description: 'Negotiate licensing agreements, spin-off equity, and royalty sharing'
    },
    {
      code: 'research.closeout.approve',
      name: 'Approve Grant Closeout',
      description: 'Execute Four-Eyes final institutional audit, unexpended balance reconciliation, and grant closeout'
    },
    {
      code: 'research.audit.view',
      name: 'View Research Audit & Provenance Trail',
      description: 'Inspect SHA-256 cryptographic audit logs, correlation keys, and diagnostic integrity scans'
    }
  ]
};
