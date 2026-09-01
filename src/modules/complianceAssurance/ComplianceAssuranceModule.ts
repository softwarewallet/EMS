import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const ComplianceAssuranceModule: UniversalModuleContract = {
  moduleId: 'mod_compliance_assurance',
  name: 'Institutional Compliance, Legal, Regulatory Obligations & Enterprise Assurance Governance Engine',
  displayName: 'Compliance & Assurance',
  description: 'Enterprise-grade governance layer managing regulatory compliance frameworks, active obligations registers, control mitigation, independent testing, corrective CAPA linkages, legal holds, regulatory submissions, executive certifications, and immutable audit logs.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EMS Core',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    {
      code: 'compliance.view',
      name: 'View Compliance Module',
      description: 'Allows viewing compliance checklists, frameworks, and dashboards.'
    },
    {
      code: 'compliance.framework.manage',
      name: 'Manage Compliance Frameworks',
      description: 'Allows configuring regulatory authorities, jurisdictions, frameworks, and source reference documents.'
    },
    {
      code: 'compliance.obligation.manage',
      name: 'Manage Obligations Register',
      description: 'Allows drafting and modifying active institutional regulatory obligations.'
    },
    {
      code: 'compliance.obligation.approve',
      name: 'Approve Compliance Obligations',
      description: 'Allows peer-approving compliance obligations (SoD enforced).'
    },
    {
      code: 'compliance.control.manage',
      name: 'Manage Mitigation Controls',
      description: 'Allows configuring and testing preventive, detective, or corrective controls.'
    },
    {
      code: 'compliance.control.verify',
      name: 'Verify Mitigation Controls',
      description: 'Allows peer-verifying control test results and effectiveness levels (SoD enforced).'
    },
    {
      code: 'compliance.assessment.manage',
      name: 'Manage Program Assessments',
      description: 'Allows creating and running periodic compliance program assessments.'
    },
    {
      code: 'compliance.assessment.approve',
      name: 'Approve Program Assessments',
      description: 'Allows peer-approving/signing off compliance assessments (SoD enforced).'
    },
    {
      code: 'compliance.finding.manage',
      name: 'Manage Audit Findings',
      description: 'Allows raising and assigning compliance audit corrective findings.'
    },
    {
      code: 'compliance.finding.verify',
      name: 'Verify Action Plans',
      description: 'Allows verifying remediation evidence and CAPA action completions.'
    },
    {
      code: 'compliance.finding.close',
      name: 'Close Audit Findings',
      description: 'Allows closing resolved findings after independent verification (SoD enforced).'
    },
    {
      code: 'compliance.exception.request',
      name: 'Request Compliance Exceptions',
      description: 'Allows requesting temporary compliance exceptions or obligation waivers.'
    },
    {
      code: 'compliance.exception.approve',
      name: 'Approve Compliance Exceptions',
      description: 'Allows peer-approving active exceptions and waivers (SoD enforced).'
    },
    {
      code: 'compliance.legal.view',
      name: 'View Legal Matters',
      description: 'Allows viewing legal matters register and sensitive opinions with classification filters.'
    },
    {
      code: 'compliance.legal.manage',
      name: 'Manage Legal Matters',
      description: 'Allows creating and updating legal matters, deadlines, external counsel references, and risk assessments.'
    },
    {
      code: 'compliance.legal.hold',
      name: 'Manage Legal Records Holds',
      description: 'Allows instituting and releasing legal holds on departments, users, and Document Registry items.'
    },
    {
      code: 'compliance.regulatory.manage',
      name: 'Manage Regulatory Requests',
      description: 'Allows managing incoming regulatory agency inspections, audits, and inquiries.'
    },
    {
      code: 'compliance.regulatory.submit',
      name: 'Submit Regulatory Reports',
      description: 'Allows peer approval and submission of reports to external authorities (SoD enforced).'
    },
    {
      code: 'compliance.attestation.create',
      name: 'Create Compliance Attestations',
      description: 'Allows preparing executive compliance attestations and validity scopes.'
    },
    {
      code: 'compliance.attestation.certify',
      name: 'Certify Attestations',
      description: 'Allows signing and certifying formal attestations (SoD enforced).'
    },
    {
      code: 'compliance.assurance.manage',
      name: 'Manage Assurance Plans',
      description: 'Allows configuring strategic assurance plans and internal reviews.'
    },
    {
      code: 'compliance.analytics.view',
      name: 'View Compliance Analytics',
      description: 'Allows viewing compliance risk heatmaps and calculated coverage snapshots.'
    },
    {
      code: 'compliance.audit.view',
      name: 'View Compliance Audits',
      description: 'Allows viewing append-only immutable compliance audit trail logs.'
    },
    {
      code: 'compliance.override',
      name: 'Administrative Overrides',
      description: 'Allows super-admins to override workflow locks with mandatory audit justifications.'
    }
  ]
};
