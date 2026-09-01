export type TransportStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type Direction = 'PICKUP' | 'DROPOFF' | 'BOTH';
export type StopStatus = 'ACTIVE' | 'INACTIVE' | 'TEMPORARY' | 'SUSPENDED';
export type VehicleStatus = 'ACTIVE' | 'IN_SERVICE' | 'MAINTENANCE' | 'SUSPENDED' | 'RETIRED';
export type DriverStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'EXPIRED';
export type TripScheduleStatus = 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type TripStatus = 'SCHEDULED' | 'READY' | 'STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ABORTED';
export type BoardingEventType = 'BOARDING' | 'DROPPED_OFF' | 'NO_SHOW' | 'ABSENT' | 'EMERGENCY_EXIT' | 'MANUAL_CORRECTION';
export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED';

export interface TransportProfile {
  transportProfileId: string;
  tenantId: string;
  campusId?: string;
  name: string;
  code: string;
  description?: string;
  status: TransportStatus;
  timezone: string;
  operatingDays: string[];
  morningServiceEnabled: boolean;
  afternoonServiceEnabled: boolean;
  emergencyContact: string;
  policyVersion: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportPolicy {
  policyId: string;
  tenantId: string;
  campusId?: string;
  version: string;
  maxVehicleOccupancy: number;
  studentAssignmentRules: string;
  pickupRadiusKm: number;
  guardianAuthorizationRequired: boolean;
  boardingVerificationMethod: string;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'DRAFT';
}

export interface TransportRoute {
  routeId: string;
  tenantId: string;
  campusId?: string;
  transportProfileId: string;
  routeCode: string;
  name: string;
  direction: Direction;
  status: TransportStatus;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  startPoint: string;
  endPoint: string;
  estimatedDurationMinutes: number;
  distanceKm: number;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportStop {
  stopId: string;
  tenantId: string;
  campusId?: string;
  routeId: string;
  routeVersion: string;
  name: string;
  code: string;
  sequence: number;
  latitude?: number;
  longitude?: number;
  address: string;
  pickupTime?: string;
  dropoffTime?: string;
  status: StopStatus;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransportAssignment {
  transportAssignmentId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  routeId: string;
  routeVersion: string;
  pickupStopId?: string;
  dropoffStopId?: string;
  morningEnabled: boolean;
  afternoonEnabled: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  guardianAuthorization: string;
  assignedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportVehicle {
  vehicleId: string;
  tenantId: string;
  campusId?: string;
  registrationNumber: string;
  fleetNumber: string;
  vehicleType: 'BUS' | 'VAN' | 'MINIBUS' | 'CAR' | 'OTHER';
  manufacturer: string;
  model: string;
  year: number;
  seatingCapacity: number;
  standingCapacity: number;
  wheelchairCapacity: number;
  status: VehicleStatus;
  ownershipType: 'OWNED' | 'LEASED' | 'CONTRACTED';
  insuranceExpiry: string;
  permitExpiry: string;
  fitnessExpiry: string;
  pollutionExpiry: string;
  gpsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransportDriver {
  driverId: string;
  tenantId: string;
  campusId?: string;
  employeeReference?: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  status: DriverStatus;
  contactReference: string;
  backgroundCheckStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  trainingStatus: 'COMPLETED' | 'PENDING' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface TransportAttendant {
  attendantId: string;
  tenantId: string;
  campusId?: string;
  employeeReference?: string;
  name: string;
  contactReference: string;
  trainingStatus: 'COMPLETED' | 'PENDING' | 'EXPIRED';
  status: DriverStatus;
}

export interface TripSchedule {
  tripScheduleId: string;
  tenantId: string;
  campusId?: string;
  routeId: string;
  routeVersion: string;
  vehicleId: string;
  driverId: string;
  attendantId?: string;
  direction: Direction;
  operatingDays: string[];
  scheduledStartTime: string;
  scheduledEndTime: string;
  status: TripScheduleStatus;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface TripInstance {
  tripId: string;
  tenantId: string;
  campusId?: string;
  tripScheduleId: string;
  routeId: string;
  routeVersion: string;
  vehicleId: string;
  driverId: string;
  attendantId?: string;
  direction: Direction;
  serviceDate: string;
  status: TripStatus;
  actualStartTime?: string;
  actualEndTime?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardingEvent {
  boardingEventId: string;
  tenantId: string;
  campusId?: string;
  tripId: string;
  studentId: string;
  enrollmentId: string;
  stopId: string;
  eventType: BoardingEventType;
  eventTime: string;
  source: 'MANUAL' | 'QR' | 'RFID' | 'GPS_DEVICE' | 'MOBILE' | 'API';
  verifiedBy: string;
  deviceReference?: string;
  remarks?: string;
  createdAt: string;
}

export interface TransportIncident {
  incidentId: string;
  tenantId: string;
  campusId?: string;
  tripId?: string;
  studentId?: string;
  vehicleId?: string;
  driverId?: string;
  type: 'ACCIDENT' | 'MEDICAL' | 'BEHAVIOR' | 'VEHICLE_FAILURE' | 'ROUTE_DEVIATION' | 'MISSING_STUDENT' | 'SAFETY' | 'OTHER';
  severity: IncidentSeverity;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: IncidentStatus;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface TransportHold {
  holdId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  type: 'UNPAID_TRANSPORT_FEE' | 'MISSING_AUTHORIZATION' | 'SAFETY_RESTRICTION' | 'DOCUMENT_EXPIRY' | 'OTHER';
  reason: string;
  status: 'ACTIVE' | 'RELEASED';
  createdAt: string;
  releasedAt?: string;
  releasedBy?: string;
}
