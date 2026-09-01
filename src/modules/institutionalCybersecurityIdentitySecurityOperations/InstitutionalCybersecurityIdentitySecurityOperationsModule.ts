/**
 * EMS Phase 11.21 Module Contract: Institutional Cybersecurity, Identity, Security Operations
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalCybersecurityIdentitySecurityOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_cybersecurity_identity_security_operations',
  name: 'Cybersecurity & Identity Ops',
  displayName: 'SecOps',
  description: 'Authoritative operational engine for institutional cybersecurity, identity lifecycles, access reviews, and security incident management.',
  version: '11.21.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_it_service_management', minVersion: '11.20.0' }
  ],
  configurationSchema: [
    { key: 'requireFourEyesPrivilegedAccess', type: 'boolean', label: 'Require Four-Eyes for Privileged Access', required: true, defaultValue: true },
    { key: 'defaultSessionTimeoutMinutes', type: 'number', label: 'Default Session Timeout (Minutes)', required: true, defaultValue: 60 }
  ],
  navigationItems: [
    {
      id: 'nav_secops_dashboard',
      moduleId: 'mod_cybersecurity_identity_security_operations',
      label: 'Security Command Center',
      icon: 'Shield',
      route: 'institutional_cybersecurity_identity_ops',
      sortOrder: 55,
      status: 'active',
      requiredPermission: 'security.view',
      allowedRoles: ['super_admin', 'security_officer', 'ciso'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_secops_incidents',
      moduleId: 'mod_cybersecurity_identity_security_operations',
      label: 'Security Incidents',
      icon: 'AlertOctagon',
      route: 'institutional_cybersecurity_identity_ops',
      sortOrder: 56,
      status: 'active',
      requiredPermission: 'security.incident.view',
      allowedRoles: ['super_admin', 'security_officer', 'soc_analyst'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_secops_identity',
      moduleId: 'mod_cybersecurity_identity_security_operations',
      label: 'Identity & Access',
      icon: 'Key',
      route: 'institutional_cybersecurity_identity_ops',
      sortOrder: 57,
      status: 'active',
      requiredPermission: 'security.identity.view',
      allowedRoles: ['super_admin', 'security_officer', 'iam_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'security.view', name: 'View Security Posture', description: 'View overall security posture and dashboards.' },
    { code: 'security.incident.view', name: 'View Security Incidents', description: 'View security incidents and alerts.' },
    { code: 'security.incident.manage', name: 'Manage Security Incidents', description: 'Update and manage security incidents.' },
    { code: 'security.identity.view', name: 'View Identities', description: 'View identity profiles and access assignments.' },
    { code: 'security.privileged.approve', name: 'Approve Privileged Access', description: 'Approve requests for elevated privileges.' }
  ],
  eventsEmitted: [
    { eventName: 'SECURITY_INCIDENT_DECLARED', description: 'Fired when a major security incident is created.' },
    { eventName: 'PRIVILEGED_ACCESS_GRANTED', description: 'Fired when privileged access is approved.' }
  ],
  eventsConsumed: []
};
