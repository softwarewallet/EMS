import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const CommunicationModule: UniversalModuleContract = {
  moduleId: 'mod_communication',
  name: 'Communication',
  displayName: 'Communications & Notifications',
  description: 'Authoritative governance engine for multi-channel messaging, versioned templates, deterministic audience resolution, delivery tracking, acknowledgements, consent & emergency broadcasts (Phase 7.14)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Infrastructure',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_student', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'communication.view',
      name: 'View Communications',
      description: 'View communication dashboard, delivery logs, and announcements'
    },
    {
      code: 'communication.create',
      name: 'Create Messages',
      description: 'Create draft messages and announcements'
    },
    {
      code: 'communication.update',
      name: 'Update Communications',
      description: 'Modify draft templates, messages, and campaigns'
    },
    {
      code: 'communication.approve',
      name: 'Approve Templates',
      description: 'Approve templates and announcements'
    },
    {
      code: 'communication.publish',
      name: 'Publish Templates & Announcements',
      description: 'Publish versioned templates and institution announcements'
    },
    {
      code: 'communication.send',
      name: 'Send Messages',
      description: 'Dispatch messages to resolved audiences'
    },
    {
      code: 'communication.broadcast',
      name: 'Broadcast Announcements',
      description: 'Broadcast institution and campus wide communications'
    },
    {
      code: 'communication.manage_templates',
      name: 'Manage Templates',
      description: 'Create and version communication templates'
    },
    {
      code: 'communication.manage_preferences',
      name: 'Manage Preferences',
      description: 'Manage user notification preferences and consent policies'
    },
    {
      code: 'communication.view_delivery',
      name: 'View Delivery Logs',
      description: 'Inspect real-time delivery statuses, failure codes, and retries'
    },
    {
      code: 'communication.view_audit',
      name: 'View Communication Audit',
      description: 'Access immutable audit trail for dispatches and overrides'
    },
    {
      code: 'communication.export',
      name: 'Export Communication Data',
      description: 'Export delivery registers and compliance reports'
    },
    {
      code: 'communication.emergency',
      name: 'Send Emergency Broadcasts',
      description: 'Trigger authorized emergency broadcasts overriding non-mandatory preferences'
    }
  ],
  navigationItems: [
    {
      id: 'communication_workspace',
      moduleId: 'mod_communication',
      label: 'Communications',
      icon: 'MessageSquare',
      route: '/communication/workspace',
      requiredPermission: 'communication.view',
      sortOrder: 46,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] CommunicationModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] CommunicationModule disabled for tenant ${tenantId}`);
  }
};
