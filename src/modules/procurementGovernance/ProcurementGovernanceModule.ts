import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ProcurementGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_procurement_governance',
  name: 'Institutional Procurement, Sourcing, Vendor, Third-Party Risk & Procurement Assurance Governance Engine',
  displayName: 'Procurement & Vendor Risk Governance',
  description: 'Authoritative governance layer for procurement strategy, demand governance, sourcing, tenders, bid evaluation, vendor due diligence, third-party risk, SLA governance, emergency procurement, and supplier resilience.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EduTech-SMS',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'procurement_governance.view', name: 'View Procurement Governance', description: 'View procurement governance command center and workspace.' },
    { code: 'procurement_governance.create', name: 'Create Procurement Records', description: 'Create procurement requests, vendor records, and tenders.' },
    { code: 'procurement_governance.edit', name: 'Edit Procurement Records', description: 'Edit existing procurement governance records.' },
    { code: 'procurement_governance.manage', name: 'Manage Procurement Governance', description: 'Manage overall procurement governance parameters.' },

    { code: 'procurement_strategy.view', name: 'View Procurement Strategy', description: 'View procurement strategies.' },
    { code: 'procurement_strategy.manage', name: 'Manage Procurement Strategy', description: 'Manage procurement strategy objectives.' },
    { code: 'procurement_strategy.approve', name: 'Approve Procurement Strategy', description: 'Approve procurement strategies.' },

    { code: 'procurement_plan.view', name: 'View Procurement Plans', description: 'View procurement plans.' },
    { code: 'procurement_plan.manage', name: 'Manage Procurement Plans', description: 'Manage procurement plan references.' },
    { code: 'procurement_plan.approve', name: 'Approve Procurement Plans', description: 'Approve procurement plans.' },

    { code: 'procurement_request.view', name: 'View Procurement Requests', description: 'View procurement requests.' },
    { code: 'procurement_request.create', name: 'Create Procurement Request', description: 'Submit new procurement requests.' },
    { code: 'procurement_request.manage', name: 'Manage Procurement Requests', description: 'Manage procurement request workflows.' },
    { code: 'procurement_request.approve', name: 'Approve Procurement Requests', description: 'Approve or reject procurement requests.' },

    { code: 'procurement_sourcing.view', name: 'View Sourcing Events', description: 'View sourcing events.' },
    { code: 'procurement_sourcing.manage', name: 'Manage Sourcing Events', description: 'Manage sourcing events.' },

    { code: 'procurement_tender.view', name: 'View Tender Governance', description: 'View tenders and eligibility requirements.' },
    { code: 'procurement_tender.manage', name: 'Manage Tender Governance', description: 'Manage tender publication and rules.' },
    { code: 'procurement_tender.approve', name: 'Approve Tender Awards', description: 'Approve tender award recommendations.' },

    { code: 'procurement_evaluation.view', name: 'View Bid Evaluations', description: 'View bid evaluation scores.' },
    { code: 'procurement_evaluation.manage', name: 'Manage Bid Evaluations', description: 'Manage bid evaluation criteria.' },
    { code: 'procurement_evaluation.approve', name: 'Approve Bid Evaluations', description: 'Approve bid evaluation records.' },

    { code: 'vendor_governance.view', name: 'View Vendor Governance', description: 'View vendor registry governance.' },
    { code: 'vendor_governance.manage', name: 'Manage Vendor Governance', description: 'Manage vendor governance classifications.' },
    { code: 'vendor_governance.approve', name: 'Approve Vendor Classification', description: 'Approve vendor classifications.' },

    { code: 'vendor_due_diligence.view', name: 'View Vendor Due Diligence', description: 'View vendor due diligence records.' },
    { code: 'vendor_due_diligence.manage', name: 'Manage Vendor Due Diligence', description: 'Perform vendor due diligence evaluations.' },
    { code: 'vendor_due_diligence.approve', name: 'Approve Vendor Due Diligence', description: 'Approve vendor due diligence verification.' },

    { code: 'vendor_risk.view', name: 'View Vendor Risk', description: 'View vendor risk assessments.' },
    { code: 'vendor_risk.manage', name: 'Manage Vendor Risk', description: 'Manage vendor risk ratings.' },
    { code: 'vendor_risk.approve', name: 'Approve Vendor Risk Mitigation', description: 'Approve vendor risk mitigations.' },

    { code: 'third_party_risk.view', name: 'View Third-Party Risk', description: 'View third-party dependencies and concentration risks.' },
    { code: 'third_party_risk.manage', name: 'Manage Third-Party Risk', description: 'Manage third-party governance records.' },

    { code: 'contract_governance.view', name: 'View Contract Governance', description: 'View contract governance references.' },
    { code: 'contract_governance.manage', name: 'Manage Contract Governance', description: 'Manage contract governance references.' },
    { code: 'contract_governance.approve', name: 'Approve Contract Amendments', description: 'Approve contract amendments.' },

    { code: 'vendor_performance.view', name: 'View Vendor Performance', description: 'View vendor performance observations and SLA status.' },
    { code: 'vendor_performance.manage', name: 'Manage Vendor Performance', description: 'Manage vendor performance observations.' },

    { code: 'procurement_exception.manage', name: 'Manage Procurement Exceptions', description: 'Manage procurement control exceptions.' },
    { code: 'procurement_exception.approve', name: 'Approve Procurement Exceptions', description: 'Approve procurement control exceptions.' },

    { code: 'emergency_procurement.manage', name: 'Manage Emergency Procurement', description: 'Request emergency procurement exceptions.' },
    { code: 'emergency_procurement.approve', name: 'Approve Emergency Procurement', description: 'Authorize emergency procurement exceptions.' },

    { code: 'single_source.manage', name: 'Manage Single-Source Justifications', description: 'Submit single-source justifications.' },
    { code: 'single_source.approve', name: 'Approve Single-Source Justifications', description: 'Approve single-source justifications.' },

    { code: 'procurement_control.view', name: 'View Procurement Controls', description: 'View procurement internal controls.' },
    { code: 'procurement_control.manage', name: 'Manage Procurement Controls', description: 'Manage procurement control definitions.' },
    { code: 'procurement_control.test', name: 'Test Procurement Controls', description: 'Execute procurement control tests.' },

    { code: 'procurement_resilience.view', name: 'View Procurement Resilience', description: 'View supplier resilience assessments.' },
    { code: 'procurement_resilience.manage', name: 'Manage Procurement Resilience', description: 'Perform supplier resilience assessments.' },

    { code: 'procurement_decision.view', name: 'View Procurement Decisions', description: 'View procurement decision log.' },
    { code: 'procurement_decision.manage', name: 'Manage Procurement Decisions', description: 'Propose procurement decisions.' },
    { code: 'procurement_decision.approve', name: 'Approve Procurement Decisions', description: 'Approve procurement decisions.' },

    { code: 'procurement_diagnostics.run', name: 'Run Procurement Diagnostics', description: 'Run procurement governance diagnostics.' },
    { code: 'procurement_audit.view', name: 'View Procurement Audit Trail', description: 'View immutable procurement audit log.' }
  ]
};
