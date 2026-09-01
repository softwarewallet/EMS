import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const QualityExecutionModule: UniversalModuleContract = {
  moduleId: 'mod_quality_execution',
  name: 'Institutional Quality Execution & Accreditation Governance Engine',
  displayName: 'Quality Execution & Accreditation Evidence',
  description: 'Governed assessment cycles, criteria mapping, document evidence verification, program quality reviews, continuous improvement initiatives (PDCA), CAPA execution, and accreditation readiness packages.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'quality.view',
      name: 'View Quality Execution Workspace',
      description: 'Allows viewing quality assessment cycles, indicators, reviews, and CAPA dashboards.'
    },
    {
      code: 'quality.manage',
      name: 'Manage Quality Frameworks & Criteria',
      description: 'Allows configuring criteria, indicators, and assessment targets.'
    },
    {
      code: 'quality_assessment.create',
      name: 'Create Assessment Submissions',
      description: 'Allows recording actual assessment indicator scores and narratives.'
    },
    {
      code: 'quality_assessment.verify',
      name: 'Verify Assessment Submissions',
      description: 'Allows certifying assessment indicator entries with four-eyes verification.'
    },
    {
      code: 'quality_assessment.approve',
      name: 'Approve Assessment Cycles',
      description: 'Allows approving and publishing institutional assessment cycles.'
    },
    {
      code: 'quality_evidence.map',
      name: 'Map Accreditation Evidence Documents',
      description: 'Allows linking Document Registry files (Phase 7.27) to quality criteria.'
    },
    {
      code: 'quality_evidence.verify',
      name: 'Verify Evidence Relevance',
      description: 'Allows auditing and certifying evidence document linkages.'
    },
    {
      code: 'quality_review.create',
      name: 'Create Program Quality Reviews',
      description: 'Allows drafting and submitting department and program reviews.'
    },
    {
      code: 'quality_review.approve',
      name: 'Approve Program Quality Reviews',
      description: 'Allows formal sign-off on program quality reviews with immutable rationale.'
    },
    {
      code: 'quality_improvement.manage',
      name: 'Manage Continuous Improvement Initiatives',
      description: 'Allows creating and managing PDCA improvement initiatives.'
    },
    {
      code: 'quality_improvement.verify',
      name: 'Verify Improvement Completion',
      description: 'Allows verifying target attainment for improvement initiatives.'
    },
    {
      code: 'quality_capa.create',
      name: 'Create CAPA Actions',
      description: 'Allows initiating Corrective & Preventive Actions with RCA methodology.'
    },
    {
      code: 'quality_capa.verify',
      name: 'Verify CAPA Execution',
      description: 'Allows checking completed corrective action steps.'
    },
    {
      code: 'quality_capa.close',
      name: 'Close CAPA Actions',
      description: 'Allows authoritative Quality Manager closure of CAPA items (SoD enforced).'
    },
    {
      code: 'quality_accreditation.generate',
      name: 'Generate Accreditation Packages',
      description: 'Allows building accreditation readiness evidence packages.'
    },
    {
      code: 'quality_accreditation.approve',
      name: 'Approve Accreditation Packages',
      description: 'Allows formal institutional sign-off on accreditation packages.'
    }
  ]
};
