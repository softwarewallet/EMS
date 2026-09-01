/**
 * EMS Phase 11.15 Module Contract: Institutional Advancement & Development
 */

import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const InstitutionalAdvancementDevelopmentModule: UniversalModuleContract = {
  moduleId: 'mod_institutional_advancement_development',
  name: 'Institutional Advancement, Fundraising, Donor, Philanthropy & Development Operations',
  displayName: 'Institutional Advancement & Development',
  description: 'Authoritative operational engine for institutional advancement, fundraising campaigns, donor management, prospect pipelines, pledges, gifts, gift allocations, stewardship, corporate relations, compliance, and provenance.',
  version: '11.15.0',
  status: 'REGISTERED',
  category: 'Operations',
  provider: 'CORE',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_communications', minVersion: '11.11.0' }
  ],
  configurationSchema: [
    { key: 'enableFourEyesApproval', type: 'boolean', label: 'Require Four-Eyes Approval for Campaigns & Gifts', required: true, defaultValue: true },
    { key: 'defaultCurrencyCode', type: 'string', label: 'Default Currency Code', required: true, defaultValue: 'USD' }
  ],
  navigationItems: [
    {
      id: 'nav_adv_command_center',
      moduleId: 'mod_institutional_advancement_development',
      label: 'Advancement Command Center',
      icon: 'HeartHandshake',
      route: 'institutional_advancement_development',
      sortOrder: 28,
      status: 'active',
      requiredPermission: 'advancement.view',
      allowedRoles: ['super_admin', 'platform_admin', 'advancement_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_adv_donors',
      moduleId: 'mod_institutional_advancement_development',
      label: 'Donor & Prospect Registry',
      icon: 'Users',
      route: 'institutional_advancement_development',
      sortOrder: 29,
      status: 'active',
      requiredPermission: 'advancement.donor.view',
      allowedRoles: ['super_admin', 'platform_admin', 'advancement_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_adv_campaigns',
      moduleId: 'mod_institutional_advancement_development',
      label: 'Fundraising Campaigns & Opportunities',
      icon: 'Target',
      route: 'institutional_advancement_development',
      sortOrder: 30,
      status: 'active',
      requiredPermission: 'advancement.campaign.view',
      allowedRoles: ['super_admin', 'platform_admin', 'advancement_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_adv_gifts',
      moduleId: 'mod_institutional_advancement_development',
      label: 'Gifts, Pledges & Allocations',
      icon: 'Gift',
      route: 'institutional_advancement_development',
      sortOrder: 31,
      status: 'active',
      requiredPermission: 'advancement.gift.view',
      allowedRoles: ['super_admin', 'platform_admin', 'advancement_director'],
      targetContext: 'tenant'
    },
    {
      id: 'nav_adv_diagnostics',
      moduleId: 'mod_institutional_advancement_development',
      label: 'Diagnostics, Sandbox & Verification',
      icon: 'Activity',
      route: 'institutional_advancement_development',
      sortOrder: 32,
      status: 'active',
      requiredPermission: 'advancement.diagnostics.run',
      allowedRoles: ['super_admin', 'platform_admin'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    { code: 'advancement.view', name: 'View Advancement Data', description: 'View advancement data and dashboards.' },
    { code: 'advancement.manage', name: 'Manage Advancement Operations', description: 'Manage advancement operations and settings.' },
    { code: 'advancement.donor.view', name: 'View Donor Records', description: 'View donor records and prospect pipelines.' },
    { code: 'advancement.donor.manage', name: 'Manage Donors', description: 'Create and update donor profiles.' },
    { code: 'advancement.campaign.approve', name: 'Approve Campaigns', description: 'Four-Eyes approval for campaigns.' },
    { code: 'advancement.gift.approve', name: 'Approve Gifts', description: 'Four-Eyes approval for gifts.' },
    { code: 'advancement.diagnostics.run', name: 'Run Diagnostics', description: 'Run diagnostics & simulations.' }
  ],
  eventsEmitted: [
    { eventName: 'ADVANCEMENT_PROSPECT_QUALIFIED', description: 'Fired when a prospect is qualified.' },
    { eventName: 'ADVANCEMENT_CAMPAIGN_APPROVED', description: 'Fired when a campaign is approved.' },
    { eventName: 'ADVANCEMENT_GIFT_ACCEPTED', description: 'Fired when a gift is accepted.' },
    { eventName: 'ADVANCEMENT_GIFT_ALLOCATED', description: 'Fired when a gift is allocated.' }
  ],
  eventsConsumed: []
};
