/**
 * EMS Phase 11.20 Module Contract: Institutional IT Service Management
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalITServiceManagementModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_it_service_management',
  name: 'IT Service Management & Ops',
  displayName: 'ITSM',
  description: 'Authoritative operational engine for IT services, incidents, changes, configuration items, and infrastructure.',
  version: '11.20.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' }
  ],
  configurationSchema: [
    { key: 'requireFourEyesChangeApproval', type: 'boolean', label: 'Require Four-Eyes for Changes', required: true, defaultValue: true },
    { key: 'defaultIncidentSLA', type: 'number', label: 'Default Incident SLA (Minutes)', required: true, defaultValue: 240 }
  ],
  navigationItems: [
    {
      id: 'nav_itsm_command_center',
      moduleId: 'mod_institutional_it_service_management',
      label: 'ITSM Dashboard',
      icon: 'Activity',
      route: 'institutional_it_service_management',
      sortOrder: 52,
      status: 'active',
      requiredPermission: 'it.service.view',
      allowedRoles: ['super_admin', 'platform_admin', 'it_director', 'service_desk'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_itsm_incidents',
      moduleId: 'mod_institutional_it_service_management',
      label: 'Incidents & Requests',
      icon: 'AlertTriangle',
      route: 'institutional_it_service_management',
      sortOrder: 53,
      status: 'active',
      requiredPermission: 'it.incident.view',
      allowedRoles: ['super_admin', 'platform_admin', 'it_director', 'service_desk'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_itsm_changes',
      moduleId: 'mod_institutional_it_service_management',
      label: 'Changes & CIs',
      icon: 'GitPullRequest',
      route: 'institutional_it_service_management',
      sortOrder: 54,
      status: 'active',
      requiredPermission: 'it.change.view',
      allowedRoles: ['super_admin', 'platform_admin', 'it_director', 'change_manager'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'it.service.view', name: 'View IT Services', description: 'View IT services and availability.' },
    { code: 'it.incident.view', name: 'View Incidents', description: 'View IT incidents and requests.' },
    { code: 'it.change.view', name: 'View Changes', description: 'View change requests and CIs.' },
    { code: 'it.change.approve', name: 'Approve Changes', description: 'Approve changes.' },
    { code: 'it.incident.major.manage', name: 'Manage Major Incidents', description: 'Manage and close major incidents.' }
  ],
  eventsEmitted: [
    { eventName: 'CHANGE_APPROVED', description: 'Fired when a change request is approved.' },
    { eventName: 'MAJOR_INCIDENT_CLOSED', description: 'Fired when a major incident is closed.' }
  ],
  eventsConsumed: []
};
