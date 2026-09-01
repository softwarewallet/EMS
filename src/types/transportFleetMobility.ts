export type VehicleLifecycleState = 'DRAFT' | 'ACTIVE' | 'ASSIGNED' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';

export type TripLifecycleState = 'PLANNED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'CANCELLED' | 'ABORTED';

export type MaintenanceLifecycleState = 'REQUESTED' | 'APPROVED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'CLOSED';

export type IncidentLifecycleState = 'REPORTED' | 'TRIAGED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export interface Vehicle {
  vehicleId: string;
  registrationNumber: string;
  vin?: string;
  vehicleClassIdRef: string;
  tenantId: string;
  campusIdRef: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: VehicleLifecycleState;
  insuranceExpiry: string;
  permitExpiry: string;
  inspectionExpiry: string;
  isActive: boolean;
  isSafetyBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleClass {
  vehicleClassId: string;
  name: string; // e.g., 'SUV', 'MINIBUS', 'BUS', 'CAR'
  description?: string;
  tenantId: string;
}

export interface VehicleComplianceRecord {
  complianceRecordId: string;
  vehicleIdRef: string;
  tenantId: string;
  documentType: 'INSURANCE' | 'PERMIT' | 'EMISSION_CERT' | 'ROADWORTHINESS';
  referenceNumber: string;
  validFrom: string;
  validUntil: string;
  issuingAuthority: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING_RENEWAL';
}

export interface VehicleInspection {
  inspectionId: string;
  vehicleIdRef: string;
  tenantId: string;
  inspectedByUserIdRef: string;
  inspectedAt: string;
  odometerReading: number;
  itemsChecked: { itemName: string; status: 'PASS' | 'FAIL' }[];
  isPassed: boolean;
  remarks?: string;
}

export interface DriverAssignment {
  driverAssignmentId: string;
  tenantId: string;
  vehicleIdRef: string;
  employeeIdRef: string;
  assignedAt: string;
  releasedAt?: string;
  status: 'ACTIVE' | 'RELEASED';
}

export interface DriverQualification {
  qualificationId: string;
  tenantId: string;
  employeeIdRef: string;
  licenseNumber: string;
  licenseClass: string; // matches VehicleClass name or code
  validUntil: string;
  isSuspended: boolean;
  authorizedStatus: 'AUTHORIZED' | 'UNAUTHORIZED' | 'EXPIRED';
  remarks?: string;
}

export interface VehicleAssignment {
  vehicleAssignmentId: string;
  tenantId: string;
  vehicleIdRef: string;
  purpose: string;
  assignedByUserIdRef: string;
  assignedAt: string;
  expectedReturn?: string;
  returnedAt?: string;
}

export interface TransportRoute {
  routeId: string;
  routeCode: string;
  routeName: string;
  tenantId: string;
  campusIdRef: string;
  originName: string;
  destinationName: string;
  stopPoints: string[];
  estimatedDistanceKm: number;
  estimatedDurationMin: number;
  isActive: boolean;
}

export interface TransportServiceArea {
  serviceAreaId: string;
  tenantId: string;
  campusIdRef: string;
  name: string;
  boundaryCoordinates?: { lat: number; lng: number }[];
  isActive: boolean;
}

export interface TransportRequest {
  requestId: string;
  tenantId: string;
  campusIdRef: string;
  studentIdRef?: string;
  employeeIdRef?: string;
  origin: string;
  destination: string;
  requestedAt: string;
  preferredTime: string;
  purpose: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'CANCELLED';
  passengerCount: number;
  remarks?: string;
}

export interface Trip {
  tripId: string;
  tripCode: string;
  tenantId: string;
  campusIdRef: string;
  routeIdRef?: string;
  vehicleIdRef?: string;
  employeeIdRef?: string; // Driver ID (referencing Phase 11.1 employee)
  status: TripLifecycleState;
  plannedDeparture: string;
  actualDeparture?: string;
  actualArrival?: string;
  passengerCount: number;
  notes?: string;
}

export interface TripSchedule {
  scheduleId: string;
  tenantId: string;
  campusIdRef: string;
  routeIdRef: string;
  departureTime: string;
  frequency: 'DAILY' | 'WEEKDAYS' | 'WEEKLY';
  isActive: boolean;
}

export interface DispatchRecord {
  dispatchId: string;
  tenantId: string;
  tripIdRef: string;
  vehicleIdRef: string;
  employeeIdRef: string; // Driver
  dispatchedByUserIdRef: string;
  dispatchedAt: string;
  startingOdometer: number;
  endingOdometer?: number;
  safetyOverrideReason?: string;
  idempotencyKey?: string;
}

export interface PassengerManifest {
  manifestId: string;
  tenantId: string;
  tripIdRef: string;
  studentIdRef?: string;
  employeeIdRef?: string;
  checkedInAt?: string;
  isNoShow: boolean;
}

export interface VehicleAvailability {
  vehicleIdRef: string;
  isAvailable: boolean;
  nextAvailableTime?: string;
  reason?: string;
}

export interface MaintenanceSchedule {
  scheduleId: string;
  tenantId: string;
  vehicleIdRef: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE';
  intervalMonths: number;
  intervalKm: number;
  lastPerformedDate?: string;
  lastPerformedKm?: number;
  nextDueDate: string;
}

export interface MaintenanceWorkOrder {
  workOrderId: string;
  workOrderNumber: string;
  tenantId: string;
  vehicleIdRef: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE';
  status: MaintenanceLifecycleState;
  issueDescription: string;
  actionTaken?: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  completedByUserIdRef?: string;
  verifiedByUserIdRef?: string;
  isSafetyBlocking: boolean;
  requestedAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  closedAt?: string;
  costRef?: string;
}

export interface FuelRecord {
  fuelRecordId: string;
  tenantId: string;
  vehicleIdRef: string;
  recordedByUserIdRef: string;
  refueledAt: string;
  fuelQuantityLiters: number;
  cost: number;
  odometerReading: number;
  energyConsumptionKwh?: number; // for electric vehicles
  idempotencyKey?: string;
}

export interface OdometerRecord {
  odometerRecordId: string;
  tenantId: string;
  vehicleIdRef: string;
  readingValue: number;
  previousReadingValue: number;
  recordedByUserIdRef: string;
  recordedAt: string;
  isAnomaly: boolean;
  idempotencyKey?: string;
}

export interface TransportIncident {
  incidentId: string;
  incidentCode: string;
  tenantId: string;
  campusIdRef: string;
  vehicleIdRef?: string;
  employeeIdRef?: string; // driver or employee involved
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: IncidentLifecycleState;
  reportedByUserIdRef: string;
  reportedAt: string;
  triagedAt?: string;
  investigatingAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  closedByUserIdRef?: string;
  correctiveActions?: string;
  isSafetyBlocking: boolean;
  idempotencyKey?: string;
}

export interface SafetyEvent {
  safetyEventId: string;
  tenantId: string;
  campusIdRef: string;
  incidentIdRef?: string;
  eventType: 'ACCIDENT' | 'NEAR_MISS' | 'SPEEDING' | 'HARSH_BRAKING' | 'ROUTE_DEVIATION';
  timestamp: string;
  description: string;
}

export interface ExternalTransportProviderReference {
  providerId: string;
  tenantId: string;
  supplierIdRef: string; // References Phase 11.3 Supplier Registry
  name: string;
  contractNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TransportCostReference {
  costId: string;
  tenantId: string;
  tripIdRef?: string;
  workOrderIdRef?: string;
  amount: number;
  financialAccountIdRef: string; // References Phase 11.2 Accounting System
  invoiceNumber?: string;
  createdAt: string;
}

export interface TransportException {
  exceptionId: string;
  tenantId: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  exceptionType: 'CAPACITY_OVERRIDE' | 'EXPIRED_QUALIFICATION_DISPATCH' | 'SAFETY_BLOCKED_DISPATCH' | 'CROSS_CAMPUS_ROUTE';
  reason: string;
  isApproved: boolean;
  approvedAt?: string;
  idempotencyKey?: string;
}

export interface LogisticsMovement {
  movementId: string;
  tenantId: string;
  originCampusIdRef: string;
  destinationCampusIdRef: string;
  vehicleIdRef?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  itemDescription: string;
}

export interface TransportAuditEvent {
  eventId: string;
  tenantId: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  previousHash: string;
  payload: string; // JSON string of the details
  hash: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: {
    processed: number;
    mutations: number;
    executionTimeMs: number;
  };
}
