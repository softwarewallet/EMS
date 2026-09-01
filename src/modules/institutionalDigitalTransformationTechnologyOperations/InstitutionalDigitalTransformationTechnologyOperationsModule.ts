/**
 * EMS Phase 11.18 Module Contract: Institutional Digital Transformation, Enterprise Architecture,
 * IT Service Management, Technology Operations & Cybersecurity
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalDigitalTransformationTechnologyOperationsModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_digital_transformation_technology_operations',
  name: 'Digital Transformation, ITSM & Technology Operations',
  displayName: 'ITSM & Technology Ops',
  description: 'Authoritative operational engine for enterprise architecture, IT service management, technology operations, and cybersecurity.',
  version: '11.18.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_legal_compliance_risk_governance', minVersion: '11.16.0' }
  ],
  configurationSchema: [
    { key: 'requireFourEyesChangeApproval', type: 'boolean', label: 'Require Four-Eyes for Changes', required: true, defaultValue: true },
    { key: 'defaultIncidentPriority', type: 'string', label: 'Default Incident Priority', required: true, defaultValue: 'MEDIUM' }
  ],
  navigationItems: [
    {
      id: 'nav_tech_command_center',
      moduleId: 'mod_institutional_digital_transformation_technology_operations',
      label: 'ITSM Command Center',
      icon: 'Server',
      route: 'institutional_digital_transformation_technology_operations',
      sortOrder: 45,
      status: 'active',
      requiredPermission: 'technology.view',
      allowedRoles: ['super_admin', 'platform_admin', 'it_director', 'service_desk'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_incidents_changes',
      moduleId: 'mod_institutional_digital_transformation_technology_operations',
      label: 'Incidents & Changes',
      icon: 'Activity',
      route: 'institutional_digital_transformation_technology_operations',
      sortOrder: 46,
      status: 'active',
      requiredPermission: 'itsm.incident.view',
      allowedRoles: ['super_admin', 'platform_admin', 'it_director', 'service_desk'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_architecture_apps',
      moduleId: 'mod_institutional_digital_transformation_technology_operations',
      label: 'Architecture & Apps',
      icon: 'Cpu',
      route: 'institutional_digital_transformation_technology_operations',
      sortOrder: 47,
      status: 'active',
      requiredPermission: 'architecture.view',
      allowedRoles: ['super_admin', 'platform_admin', 'enterprise_architect'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_cybersecurity',
      moduleId: 'mod_institutional_digital_transformation_technology_operations',
      label: 'Cybersecurity Ops',
      icon: 'ShieldAlert',
      route: 'institutional_digital_transformation_technology_operations',
      sortOrder: 48,
      status: 'active',
      requiredPermission: 'security.view',
      allowedRoles: ['super_admin', 'platform_admin', 'ciso', 'soc_analyst'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'technology.view', name: 'View Technology Operations', description: 'View general IT operations.' },
    { code: 'technology.manage', name: 'Manage Technology Operations', description: 'Manage IT ops.' },
    { code: 'architecture.view', name: 'View Architecture', description: 'View enterprise architecture.' },
    { code: 'architecture.approve', name: 'Approve Architecture', description: 'Approve ADRs.' },
    { code: 'itsm.incident.view', name: 'View Incidents', description: 'View IT incidents.' },
    { code: 'itsm.incident.manage', name: 'Manage Incidents', description: 'Manage IT incidents.' },
    { code: 'itsm.change.manage', name: 'Manage Changes', description: 'Manage IT changes.' },
    { code: 'itsm.change.approve', name: 'Approve Changes', description: 'Approve IT changes.' },
    { code: 'security.view', name: 'View Security', description: 'View cybersecurity ops.' },
    { code: 'security.incident.resolve', name: 'Resolve Security Incidents', description: 'Resolve and verify security incidents.' },
    { code: 'diagnostics.view', name: 'View Diagnostics', description: 'Run diagnostics.' }
  ],
  eventsEmitted: [
    { eventName: 'CHANGE_APPROVED', description: 'Fired when a change is approved.' },
    { eventName: 'SECURITY_INCIDENT_CLOSED', description: 'Fired when a security incident is closed.' }
  ],
  eventsConsumed: []
};
