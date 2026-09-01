import React from 'react';
import { UniversalModuleContract } from '../../core/contracts/ModuleContract';
import { AuditAssuranceGovernanceWorkspace } from '../../components/auditAssuranceGovernance/AuditAssuranceGovernanceWorkspace';

export const AuditAssuranceGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_audit_assurance_governance',
  name: 'Institutional Audit, Assurance, Internal Controls, Inspection, Findings, CAPA & Enterprise Assurance Governance Engine',
  displayName: 'Audit & Assurance Governance',
  description: 'Complete enterprise governance and assurance control plane for institutional audit, assurance, internal controls, inspections, findings, CAPA, remediation verification, and executive assurance.',
  version: '1.0.0',
  status: 'INSTALLED',
  category: 'Operations',
  provider: 'EduTech-SMS',
  dependencies: [],
  configurationSchema: [],
  navigationItems: [],
  permissions: [
    { code: 'assurance.universe.view', name: 'View Audit Universe', description: 'View the enterprise audit universe.' },
    { code: 'assurance.plan.manage', name: 'Manage Audit Plans', description: 'Create and propose audit plans.' },
    { code: 'assurance.engagement.manage', name: 'Manage Engagements', description: 'Conduct audit engagements.' },
    { code: 'assurance.control.test', name: 'Test Controls', description: 'Execute control testing.' },
    { code: 'assurance.finding.manage', name: 'Manage Findings', description: 'Draft and manage findings.' },
    { code: 'assurance.capa.manage', name: 'Manage CAPA', description: 'Manage Corrective and Preventive Actions.' },
    { code: 'assurance.committee.view', name: 'View Audit Committee', description: 'View audit committee decisions.' }
  ]
};
