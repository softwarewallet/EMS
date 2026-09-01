import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const SchedulingModule: UniversalModuleContract = {
  moduleId: 'mod_scheduling',
  name: 'Scheduling',
  displayName: 'Scheduling & Academic Operations Engine',
  description: 'Enterprise Governance for Timetables, Resource Booking, Faculty Workload & Scheduling Governance (Phase 7.32)',
  version: '1.0.0',
  status: 'AVAILABLE',
  category: 'Academics',
  provider: 'EMS',
  dependencies: [
    { moduleId: 'mod_academic', optional: false },
    { moduleId: 'mod_timetable', optional: true },
    { moduleId: 'mod_core', optional: false }
  ],
  configurationSchema: [],
  permissions: [
    {
      code: 'scheduling.view',
      name: 'View Scheduling Engine',
      description: 'View academic timetables, schedules, workload and bookings'
    },
    {
      code: 'scheduling.create',
      name: 'Create Timetables & Entries',
      description: 'Draft timetables, schedule slots, and resource bookings'
    },
    {
      code: 'scheduling.manage',
      name: 'Manage Scheduling Operations',
      description: 'Modify entries, resolve conflicts, and configure calendar exceptions'
    },
    {
      code: 'scheduling.review',
      name: 'Review Scheduling Submissions',
      description: 'Review timetables, substitution requests, and schedule change requests'
    },
    {
      code: 'scheduling.approve',
      name: 'Approve Timetables & Changes',
      description: 'Formally approve timetables, resource bookings, and schedule adjustments'
    },
    {
      code: 'scheduling.publish',
      name: 'Publish Timetables',
      description: 'Publish approved academic timetables to active status'
    },
    {
      code: 'timetable.view',
      name: 'View Timetables',
      description: 'Access timetable views'
    },
    {
      code: 'timetable.manage',
      name: 'Manage Timetables',
      description: 'Manage timetable configurations'
    },
    {
      code: 'timetable.approve',
      name: 'Approve Timetables',
      description: 'Grant timetable approvals'
    },
    {
      code: 'timetable.publish',
      name: 'Publish Timetables',
      description: 'Publish finalized timetables'
    },
    {
      code: 'resource.view',
      name: 'View Resource Availability',
      description: 'Inspect facility and room availability schedules'
    },
    {
      code: 'resource.book',
      name: 'Request Resource Booking',
      description: 'Submit resource and facility reservation requests'
    },
    {
      code: 'resource.approve',
      name: 'Approve Resource Bookings',
      description: 'Approve or reject resource booking requests'
    },
    {
      code: 'resource.manage',
      name: 'Manage Resources & Facilities',
      description: 'Configure resource attributes and maintenance locks'
    },
    {
      code: 'scheduling.conflict.manage',
      name: 'Manage Scheduling Conflicts',
      description: 'Override or resolve detected double-bookings and conflicts'
    },
    {
      code: 'scheduling.substitution.manage',
      name: 'Manage Faculty Substitutions',
      description: 'Request, assign, and approve cover arrangements for absent faculty'
    },
    {
      code: 'scheduling.change.request',
      name: 'Request Schedule Changes',
      description: 'Propose adjustments to active timetables'
    },
    {
      code: 'scheduling.change.approve',
      name: 'Approve Schedule Changes',
      description: 'Approve and implement schedule change proposals'
    },
    {
      code: 'scheduling.analytics.view',
      name: 'View Scheduling Analytics',
      description: 'Access workload projections, room utilization, and governance reports'
    }
  ],
  navigationItems: [
    {
      id: 'scheduling_workspace',
      moduleId: 'mod_scheduling',
      label: 'Scheduling & Academic Ops',
      icon: 'Calendar',
      route: '/scheduling/workspace',
      requiredPermission: 'scheduling.view',
      sortOrder: 2,
      status: 'active'
    }
  ],
  onEnable: async (tenantId: string) => {
    console.log(`[ModuleEngine] SchedulingModule enabled for tenant ${tenantId}`);
  },
  onDisable: async (tenantId: string) => {
    console.log(`[ModuleEngine] SchedulingModule disabled for tenant ${tenantId}`);
  }
};
