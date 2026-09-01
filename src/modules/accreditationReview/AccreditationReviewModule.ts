import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AccreditationReviewModule: UniversalModuleContract = {
  moduleId: 'mod_accreditation_review',
  name: 'Institutional Accreditation, Regulatory Submission & External Review Governance Engine',
  displayName: 'Accreditation & Regulatory Review',
  description: 'Governed accreditation cycles, self-study submissions, Document Registry evidence mapping, peer review visits, regulatory inspections, finding remediation (SoD enforced), institutional commitments, and official decision certificates.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'accreditation.view',
      name: 'View Accreditation & Regulatory Workspace',
      description: 'Allows viewing accreditation cycles, criteria, submissions, peer reviews, and analytics.'
    },
    {
      code: 'accreditation.manage',
      name: 'Manage Accreditation Frameworks & Cycles',
      description: 'Allows configuring accreditation bodies, criteria definitions, and cycle lifecycles.'
    },
    {
      code: 'accreditation.submit',
      name: 'Create & Edit Self-Study Submissions',
      description: 'Allows drafting criterion responses and building submission versions.'
    },
    {
      code: 'accreditation.approve',
      name: 'Approve Self-Study Submissions',
      description: 'Allows internal approval of self-study submissions (Separation of Duties enforced).'
    },
    {
      code: 'accreditation.evidence.manage',
      name: 'Map Accreditation Evidence Documents',
      description: 'Allows linking authoritative Document Registry records (Phase 7.27) to accreditation criteria.'
    },
    {
      code: 'accreditation.evidence.verify',
      name: 'Verify Evidence Relevance & Validity',
      description: 'Allows auditing and certifying evidence mappings (Separation of Duties enforced).'
    },
    {
      code: 'accreditation.review.manage',
      name: 'Manage External Peer Review Visits',
      description: 'Allows scheduling peer review visits, reviewers, agendas, and observations.'
    },
    {
      code: 'accreditation.finding.manage',
      name: 'Manage Review & Inspection Findings',
      description: 'Allows recording review findings, compliance observations, and remediation plans.'
    },
    {
      code: 'accreditation.finding.verify',
      name: 'Verify & Close Review Findings',
      description: 'Allows certifying remediation evidence and closing review findings (SoD enforced).'
    },
    {
      code: 'accreditation.commitment.manage',
      name: 'Manage Institutional Commitments',
      description: 'Allows tracking and closing institutional commitments and statutory directions.'
    },
    {
      code: 'accreditation.inspection.manage',
      name: 'Manage Regulatory Inspections',
      description: 'Allows configuring regulatory inspections, findings, and formal responses.'
    },
    {
      code: 'accreditation.decision.record',
      name: 'Record Official Accreditation Decisions',
      description: 'Allows recording authoritative external accreditation decisions and grades.'
    },
    {
      code: 'accreditation.certificate.manage',
      name: 'Manage Accreditation Certificates',
      description: 'Allows registering and tracking accreditation certificates and validity horizons.'
    },
    {
      code: 'accreditation.analytics.view',
      name: 'View Accreditation Analytics & Risk Intelligence',
      description: 'Allows viewing dynamic accreditation readiness scores, defect analytics, and risk indicators.'
    }
  ]
};
