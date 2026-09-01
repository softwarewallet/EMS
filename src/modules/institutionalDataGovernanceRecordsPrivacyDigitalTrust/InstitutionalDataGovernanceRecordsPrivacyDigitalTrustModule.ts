/**
 * EMS Phase 11.19 Module Contract: Institutional Data Governance, Records, Information Management, Privacy & Digital Trust Operations
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalDataGovernanceRecordsPrivacyDigitalTrustModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_data_governance_records_privacy_digital_trust',
  name: 'Data Governance, Records, Privacy & Digital Trust',
  displayName: 'Data Gov & Privacy',
  description: 'Authoritative operational engine for data governance, records management, privacy ops, and digital trust.',
  version: '11.19.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_legal_compliance_risk_governance', minVersion: '11.16.0' }
  ],
  configurationSchema: [
    { key: 'requireFourEyesDispositionApproval', type: 'boolean', label: 'Require Four-Eyes for Disposition', required: true, defaultValue: true },
    { key: 'defaultPrivacyRequestDeadlineDays', type: 'number', label: 'Default Privacy Request Deadline (Days)', required: true, defaultValue: 30 }
  ],
  navigationItems: [
    {
      id: 'nav_datagov_command_center',
      moduleId: 'mod_institutional_data_governance_records_privacy_digital_trust',
      label: 'Data Gov & Privacy Command',
      icon: 'Database',
      route: 'institutional_data_governance_records_privacy_digital_trust',
      sortOrder: 48,
      status: 'active',
      requiredPermission: 'dataGovernance.view',
      allowedRoles: ['super_admin', 'platform_admin', 'cdb_officer', 'privacy_officer'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_data_catalog_quality',
      moduleId: 'mod_institutional_data_governance_records_privacy_digital_trust',
      label: 'Catalog & Quality',
      icon: 'Search',
      route: 'institutional_data_governance_records_privacy_digital_trust',
      sortOrder: 49,
      status: 'active',
      requiredPermission: 'dataCatalog.view',
      allowedRoles: ['super_admin', 'platform_admin', 'cdb_officer', 'data_steward'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_records_management',
      moduleId: 'mod_institutional_data_governance_records_privacy_digital_trust',
      label: 'Records & Disposition',
      icon: 'FileArchive',
      route: 'institutional_data_governance_records_privacy_digital_trust',
      sortOrder: 50,
      status: 'active',
      requiredPermission: 'records.view',
      allowedRoles: ['super_admin', 'platform_admin', 'records_manager'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_privacy_operations',
      moduleId: 'mod_institutional_data_governance_records_privacy_digital_trust',
      label: 'Privacy Operations',
      icon: 'Shield',
      route: 'institutional_data_governance_records_privacy_digital_trust',
      sortOrder: 51,
      status: 'active',
      requiredPermission: 'privacy.view',
      allowedRoles: ['super_admin', 'platform_admin', 'privacy_officer'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'dataGovernance.view', name: 'View Data Governance', description: 'View data governance operations.' },
    { code: 'dataCatalog.view', name: 'View Data Catalog', description: 'View data catalog.' },
    { code: 'records.view', name: 'View Records Management', description: 'View records and retention ops.' },
    { code: 'records.dispose.approve', name: 'Approve Record Disposition', description: 'Approve disposition.' },
    { code: 'privacy.view', name: 'View Privacy Ops', description: 'View privacy operations.' },
    { code: 'privacy.pia.approve', name: 'Approve PIA', description: 'Approve PIAs.' },
    { code: 'dataIncident.resolve', name: 'Resolve Data Incidents', description: 'Resolve and verify data incidents.' },
    { code: 'diagnostics.view', name: 'View Diagnostics', description: 'Run diagnostics.' }
  ],
  eventsEmitted: [
    { eventName: 'DISPOSITION_APPROVED', description: 'Fired when a disposition is approved.' },
    { eventName: 'PRIVACY_INCIDENT_CLOSED', description: 'Fired when a privacy incident is closed.' }
  ],
  eventsConsumed: []
};
