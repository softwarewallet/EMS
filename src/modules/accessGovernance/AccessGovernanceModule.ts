// EMS Access Governance Module Contract
// Fully integrated with EMS UniversalModuleContract architecture

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const AccessGovernanceModule: UniversalModuleContract = {
  moduleId: 'mod_access_governance',
  name: 'AccessGovernance',
  displayName: 'Access Governance & Platform Administration',
  description: 'Authoritative system module governing user lifecycles, fine-grained role allocations, cross-tenant/campus boundary isolation, temporary delegation grants, and security compliance audits.',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Operations',
  provider: 'EduTech Security Team',

  dependencies: [
    { moduleId: 'mod_core' }
  ],

  configurationSchema: [
    {
      key: 'enable_temporary_access',
      label: 'Enable Temporary Access Grants',
      type: 'boolean',
      defaultValue: true,
      description: 'Permit institutional administrators to grant scoped, auto-expiring access tokens.'
    },
    {
      key: 'require_dual_approval_elevated',
      label: 'Require Dual Approval for Privileged Roles',
      type: 'boolean',
      defaultValue: true,
      description: 'Enforce dual administrative consensus before modifying PLATFORM_SUPER_ADMINISTRATOR or TENANT_ADMINISTRATOR roles.'
    }
  ],

  permissions: [
    { code: 'users.view', name: 'View Users Directory', description: 'Can search and view user directory details.' },
    { code: 'users.create', name: 'Invite/Create Users', description: 'Can invite and provision new accounts.' },
    { code: 'users.update', name: 'Modify User Profiles', description: 'Can update user profiles and metadata.' },
    { code: 'users.disable', name: 'Disable/Archive Users', description: 'Can suspend, lock, or archive user accounts.' },
    { code: 'users.manage_roles', name: 'Manage User Roles', description: 'Can assign and revoke roles for users.' },
    { code: 'users.manage_modules', name: 'Manage User Modules', description: 'Can assign module extensions to specific users.' },
    { code: 'users.manage_campuses', name: 'Manage User Campuses', description: 'Can edit authorized physical campus allocations.' },
    
    { code: 'roles.view', name: 'View Roles Registry', description: 'Can view platform and tenant-specific role definitions.' },
    { code: 'roles.create', name: 'Create Custom Roles', description: 'Can author custom, fine-grained role assignments.' },
    { code: 'roles.update', name: 'Edit Role Definitions', description: 'Can modify role permissions and metadata.' },
    
    { code: 'access.review', name: 'Execute Access Reviews', description: 'Can initiate and complete periodic access certification campaigns.' },
    { code: 'security.view', name: 'Monitor Security Sessions', description: 'Can view and revoke active session buffers.' },
    { code: 'security.audit', name: 'Inspect Governance Logs', description: 'Can view immutable administrative security logs.' }
  ],

  navigationItems: [
    {
      id: 'nav_access_governance',
      moduleId: 'mod_access_governance',
      label: 'Access Governance',
      icon: 'ShieldCheck',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'users.view',
      allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'institution_manager'],
      targetContext: 'platform'
    },
    {
      id: 'nav_access_gov_cmd',
      moduleId: 'mod_access_governance',
      parentId: 'nav_access_governance',
      label: 'Command Center',
      icon: 'Activity',
      route: 'access_governance',
      sortOrder: 1,
      status: 'active',
      requiredPermission: 'users.view',
      allowedRoles: ['super_admin', 'platform_admin', 'tenant_admin', 'institution_manager'],
      targetContext: 'platform'
    }
  ],

  eventsEmitted: [
    { eventName: 'USER_INVITED', description: 'A user account invitation was dispatched.' },
    { eventName: 'USER_ACTIVATED', description: 'A user account status transitioned to ACTIVE.' },
    { eventName: 'USER_SUSPENDED', description: 'A user account was suspended.' },
    { eventName: 'USER_DISABLED', description: 'A user account was administrative disabled.' },
    { eventName: 'USER_ARCHIVED', description: 'A user account was archived.' },
    { eventName: 'ROLE_ASSIGNED', description: 'A user was assigned an access role.' },
    { eventName: 'ROLE_REVOKED', description: 'An access role assignment was revoked.' },
    { eventName: 'MODULE_ASSIGNED', description: 'A module extension assignment was activated.' },
    { eventName: 'MODULE_UNASSIGNED', description: 'A module assignment was revoked.' },
    { eventName: 'CAMPUS_ASSIGNED', description: 'A user was assigned to a campus.' },
    { eventName: 'CAMPUS_UNASSIGNED', description: 'A user was unlinked from a campus.' },
    { eventName: 'TEMP_ACCESS_GRANTED', description: 'A temporary privilege grant was generated.' },
    { eventName: 'TEMP_ACCESS_REVOKED', description: 'A temporary privilege grant was manually terminated.' },
    { eventName: 'DELEGATED_ACCESS_GRANTED', description: 'A delegated administration grant was authorized.' },
    { eventName: 'DELEGATED_ACCESS_REVOKED', description: 'A delegated authority was terminated.' },
    { eventName: 'ACCESS_REVIEW_CREATED', description: 'An access review campaign was launched.' },
    { eventName: 'ACCESS_REVIEW_COMPLETED', description: 'An access review campaign was fully certified.' },
    { eventName: 'SECURITY_SESSION_REVOKED', description: 'A user session buffer was terminated.' },
    { eventName: 'PRIVILEGE_ESCALATION_BLOCKED', description: 'A non-authorized privilege elevation attempt was blocked.' }
  ]
};
export default AccessGovernanceModule;
