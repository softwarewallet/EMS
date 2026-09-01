import { UniversalModuleContract } from '../../core/contracts/ModuleContract';

export const TransportFleetMobilityModule: UniversalModuleContract = {
  moduleId: 'mod_transport_fleet_mobility',
  name: 'Institutional Transport, Fleet, Mobility & Logistics Operations',
  displayName: 'Transport, Fleet & Logistics',
  description: 'Authoritative operations module for institutional vehicle registries, driver licensing compliance, trip routing and scheduling, dispatch monitoring, maintenance workorders, telemetry, and critical transport safety incidents.',
  category: 'Core',
  status: 'REGISTERED',
  provider: 'CORE',
  version: '11.6.0',
  dependencies: [
    { moduleId: 'mod_institutional_administration', minVersion: '10.1.0' },
    { moduleId: 'mod_human_resources_workforce', minVersion: '11.1.0' },
    { moduleId: 'mod_institutional_finance_operations', minVersion: '11.2.0' },
    { moduleId: 'mod_institutional_procurement_operations', minVersion: '11.3.0' },
    { moduleId: 'mod_facilities_space_safety', minVersion: '11.5.0' }
  ],
  configurationSchema: [],
  navigationItems: [
    {
      id: 'nav_transport_fleet_mobility',
      moduleId: 'mod_transport_fleet_mobility',
      label: 'Transport & Fleet',
      icon: 'Bus',
      route: 'transport_fleet_mobility',
      sortOrder: 15,
      status: 'active',
      requiredPermission: 'transport.view',
      allowedRoles: ['super_admin', 'platform_admin', 'transport_coordinator', 'fleet_manager', 'driver', 'safety_officer'],
      targetContext: 'tenant'
    }
  ],
  permissions: [
    {
      code: 'transport.view',
      name: 'View Transport Operations',
      description: 'View fleet metrics, trip routing, schedules, and active dispatch statuses'
    },
    {
      code: 'transport.manage',
      name: 'Manage Transport',
      description: 'Complete configuration and operational master setup for the transport system'
    },
    {
      code: 'fleet.view',
      name: 'View Fleet Vehicles',
      description: 'Inspect vehicle registers, compliance, registration dates, and odometer records'
    },
    {
      code: 'fleet.manage',
      name: 'Manage Fleet Vehicles',
      description: 'Create and retire vehicles, update compliance records, and configure class details'
    },
    {
      code: 'vehicle.assign',
      name: 'Assign Vehicles',
      description: 'Submit administrative vehicle bookings and assignment transfers'
    },
    {
      code: 'vehicle.dispatch',
      name: 'Dispatch Vehicles',
      description: 'Perform real-time dispatch checks, odometer logging, and launch active vehicle transits'
    },
    {
      code: 'driver.manage',
      name: 'Govern Institutional Drivers',
      description: 'Register driver eligibility, suspension overrides, and qualification records'
    },
    {
      code: 'driver.assign',
      name: 'Assign Drivers',
      description: 'Allocate drivers to specific routes, shuttles, and active dispatches'
    },
    {
      code: 'route.manage',
      name: 'Manage Transport Routes',
      description: 'Designate origin-destination coordinates, route codes, and sector boundaries'
    },
    {
      code: 'trip.manage',
      name: 'Manage Trips',
      description: 'Define scheduled shuttle timelines, vehicle requests, and manifest assignments'
    },
    {
      code: 'trip.dispatch',
      name: 'Dispatch Trips',
      description: 'Initiate and launch active scheduled or on-demand trips'
    },
    {
      code: 'maintenance.manage',
      name: 'Manage Vehicle Maintenance',
      description: 'Request corrective mechanic repairs, preventive inspections, and logging outcomes'
    },
    {
      code: 'maintenance.approve',
      name: 'Approve Workorders',
      description: 'Four-Eyes SoD authorization to schedule and verify completion of safety-blocking maintenance'
    },
    {
      code: 'transport.incident.manage',
      name: 'Govern Transport Incidents',
      description: 'Triage, investigate, and correct accidents or telemetry alerts on active routes'
    },
    {
      code: 'transport.incident.close',
      name: 'Close Incidents',
      description: 'Four-Eyes SoD authorization to officially sign off and close critical transport incident logs'
    },
    {
      code: 'transport.exception.approve',
      name: 'Approve Exceptions',
      description: 'Four-Eyes SoD authority to grant capacity overrides or dispatch safety-blocked vehicles'
    },
    {
      code: 'transport.audit.view',
      name: 'View Immutable Logs',
      description: 'Review append-only cryptographic audit provenance chains'
    }
  ]
};
