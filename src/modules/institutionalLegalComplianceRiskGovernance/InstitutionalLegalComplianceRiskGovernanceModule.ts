/**
 * EMS Phase 11.16 Module Contract: Institutional Legal, Compliance, Risk, Governance & Policy Operations
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalLegalComplianceRiskGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_legal_compliance_risk_governance',
  name: 'Institutional Legal, Compliance, Risk, Governance & Policy Operations Engine',
  displayName: 'Legal, Compliance, Risk & Governance',
  description: 'Authoritative operational engine for institutional legal matters, regulatory compliance, policy governance, risk management, obligations, controls, legal cases, investigations, approvals, attestations, governance decisions, and compliance evidence.',
  version: '11.16.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_communications', minVersion: '11.11.0' }
  ],
  configurationSchema: [
    { key: 'enableFourEyesApproval', type: 'boolean', label: 'Require Four-Eyes Approval for Legal & Risk Actions', required: true, defaultValue: true },
    { key: 'defaultJurisdiction', type: 'string', label: 'Default Jurisdictional Authority', required: true, defaultValue: 'Federal' }
  ],
  navigationItems: [
    {
      id: 'nav_legal_command_center',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Legal & Compliance Command Center',
      icon: 'Scale',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 33,
      status: 'active',
      requiredPermission: 'legal.view',
      allowedRoles: ['super_admin', 'platform_admin', 'general_counsel', 'compliance_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_legal_matters',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Legal Matters & Cases',
      icon: 'Briefcase',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 34,
      status: 'active',
      requiredPermission: 'legal.case.manage',
      allowedRoles: ['super_admin', 'platform_admin', 'general_counsel'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_compliance_obligations',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Compliance Obligations & Controls',
      icon: 'ShieldCheck',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 35,
      status: 'active',
      requiredPermission: 'compliance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'compliance_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_risk_register',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Institutional Risk Register',
      icon: 'AlertTriangle',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 36,
      status: 'active',
      requiredPermission: 'risk.view',
      allowedRoles: ['super_admin', 'platform_admin', 'risk_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_policy_governance',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Policy Governance & Versions',
      icon: 'FileText',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 37,
      status: 'active',
      requiredPermission: 'policy.view',
      allowedRoles: ['super_admin', 'platform_admin', 'policy_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_governance_bodies',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Governance Bodies & Decisions',
      icon: 'Users',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 38,
      status: 'active',
      requiredPermission: 'governance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'board_secretary'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_legal_diagnostics',
      moduleId: 'mod_institutional_legal_compliance_risk_governance',
      label: 'Diagnostics, Sandbox & Verification',
      icon: 'Activity',
      route: 'institutional_legal_compliance_risk_governance',
      sortOrder: 39,
      status: 'active',
      requiredPermission: 'legal.manage',
      allowedRoles: ['super_admin', 'platform_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'legal.view', name: 'View Legal Data', description: 'View legal matters and cases.' },
    { code: 'legal.manage', name: 'Manage Legal Operations', description: 'Manage legal settings and diagnostics.' },
    { code: 'legal.case.manage', name: 'Manage Cases', description: 'Create and update legal cases.' },
    { code: 'legal.case.close', name: 'Close Cases', description: 'Authorize case closures with Four-Eyes.' },
    { code: 'compliance.view', name: 'View Compliance', description: 'View obligations and controls.' },
    { code: 'compliance.manage', name: 'Manage Compliance', description: 'Manage obligations and controls.' },
    { code: 'risk.view', name: 'View Risk', description: 'View risk register.' },
    { code: 'risk.manage', name: 'Manage Risk', description: 'Manage risk assessments and treatments.' },
    { code: 'policy.view', name: 'View Policies', description: 'View institutional policies.' },
    { code: 'policy.manage', name: 'Manage Policies', description: 'Create and publish policies.' },
    { code: 'governance.view', name: 'View Governance', description: 'View governance meetings and decisions.' },
    { code: 'governance.manage', name: 'Manage Governance', description: 'Manage governance bodies and decisions.' }
  ],
  eventsEmitted: [
    { eventName: 'LEGAL_CASE_REGISTERED', description: 'Fired when a legal case is registered.' },
    { eventName: 'COMPLIANCE_OBLIGATION_VERIFIED', description: 'Fired when an obligation is verified.' },
    { eventName: 'RISK_ACCEPTED', description: 'Fired when a risk is accepted with Four-Eyes.' },
    { eventName: 'POLICY_PUBLISHED', description: 'Fired when an immutable policy version is published.' }
  ],
  eventsConsumed: []
};
