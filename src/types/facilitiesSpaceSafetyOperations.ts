export type SpaceType = 'CLASSROOM' | 'LABORATORY' | 'OFFICE' | 'AUDITORIUM' | 'LIBRARY' | 'STUDENT_SERVICE' | 'RESEARCH_UNIT' | 'UTILITY_ZONE' | 'EMERGENCY_ZONE';

export type SpaceHierarchyLevel = 'CAMPUS' | 'BUILDING' | 'FLOOR' | 'WING' | 'ROOM' | 'ZONE';

export type ReservationStatus = 
  | 'REQUESTED' 
  | 'ELIGIBILITY_CHECK' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'RESERVED' 
  | 'CHECKED_IN' 
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'NO_SHOW';

export type MeterType = 'ELECTRICITY' | 'WATER' | 'GAS' | 'SOLAR' | 'HVAC' | 'STEAM' | 'OTHER';

export type ThresholdSeverity = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type SafetyStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED' | 'CLOSED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DrillStatus = 'PLANNED' | 'SCHEDULED' | 'EXECUTED' | 'REVIEWED' | 'CLOSED';

export type ChangeRequestStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'SCHEDULED' | 'IMPLEMENTED' | 'CANCELLED' | 'REJECTED';

export interface InstitutionalSpace {
  spaceId: string;
  spaceCode: string;
  name: string;
  tenantId: string;
  campusIdRef: string;
  spaceType: SpaceType;
  hierarchyLevel: SpaceHierarchyLevel;
  parentSpaceIdRef?: string;
  nominalCapacity: number;
  safeCapacity: number;
  accessibilityCapacity: number;
  currentOccupancy: number;
  reservedCapacity: number;
  isSafetyBlocked: boolean;
  isActive: boolean;
  organizationUnitIdRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpaceAllocation {
  allocationId: string;
  tenantId: string;
  spaceIdRef: string;
  organizationUnitIdRef: string;
  allocatedByUserIdRef: string;
  startDate: string;
  endDate?: string;
  isMultiUse: boolean;
  status: 'ACTIVE' | 'RELEASED' | 'TRANSFERRED';
}

export interface SpaceReservation {
  reservationId: string;
  tenantId: string;
  spaceIdRef: string;
  userIdRef: string;
  purpose: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  requestedCapacity: number;
  idempotencyKey: string;
}

export interface UtilityMeter {
  meterId: string;
  meterCode: string;
  tenantId: string;
  campusIdRef: string;
  spaceIdRef: string;
  meterType: MeterType;
  isActive: boolean;
  unit: string;
}

export interface UtilityReading {
  readingId: string;
  tenantId: string;
  meterIdRef: string;
  readingValue: number;
  previousReadingValue?: number;
  consumption: number;
  recordedByUserIdRef: string;
  recordedAt: string;
  isAnomaly: boolean;
  idempotencyKey: string;
}

export interface EnvironmentalObservation {
  observationId: string;
  tenantId: string;
  spaceIdRef: string;
  parameterType: 'TEMPERATURE' | 'HUMIDITY' | 'AIR_QUALITY' | 'CO2' | 'WATER_QUALITY' | 'NOISE' | 'LIGHTING';
  value: number;
  unit: string;
  severity: ThresholdSeverity;
  observedAt: string;
}

export interface SafetyInspection {
  inspectionId: string;
  tenantId: string;
  campusIdRef: string;
  spaceIdRef?: string;
  inspectorUserIdRef: string;
  inspectionDate: string;
  complianceStatus: 'PASSED' | 'PASSED_WITH_DEFICIENCIES' | 'FAILED' | 'EXPIRED';
  notes: string;
}

export interface SafetyFinding {
  findingId: string;
  tenantId: string;
  inspectionIdRef: string;
  spaceIdRef: string;
  description: string;
  severity: SeverityLevel;
  status: SafetyStatus;
  reportedByUserIdRef: string;
  resolvedByUserIdRef?: string;
  idempotencyKey: string;
}

export interface SafetyCorrectiveAction {
  actionId: string;
  tenantId: string;
  findingIdRef: string;
  actionRequired: string;
  assignedEmployeeIdRef: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  dueDate: string;
  idempotencyKey: string;
}

export interface SafetyIncident {
  incidentId: string;
  tenantId: string;
  campusIdRef: string;
  spaceIdRef?: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: 'REPORTED' | 'TRIAGED' | 'INVESTIGATING' | 'ACTION_REQUIRED' | 'RESOLVED' | 'VERIFIED' | 'CLOSED';
  reporterUserIdRef: string;
  assignedEmployeeIdRef?: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface EmergencyPlan {
  planId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  assemblyAreaDescription: string;
  evacuationRouteDescription: string;
  expiryDate: string;
  isActive: boolean;
}

export interface EmergencyDrill {
  drillId: string;
  tenantId: string;
  campusIdRef: string;
  title: string;
  plannedDate: string;
  executedDate?: string;
  status: DrillStatus;
  feedbackNotes?: string;
}

export interface RiskAssessment {
  assessmentId: string;
  tenantId: string;
  spaceIdRef: string;
  hazardDescription: string;
  likelihood: number; // 1 to 10
  impact: number;     // 1 to 10
  exposure: number;   // 1 to 10
  riskScore: number;  // 0 to 100
  assessedByUserIdRef: string;
  assessedDate: string;
}

export interface AccessibilityAssessment {
  assessmentId: string;
  tenantId: string;
  spaceIdRef: string;
  hasEntranceAccess: boolean;
  hasAccessibleRoute: boolean;
  hasRestroomAccess: boolean;
  hasCorrectSignage: boolean;
  barriersIdentified: string[];
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT';
}

export interface SustainabilityMetric {
  metricId: string;
  tenantId: string;
  campusIdRef: string;
  yearMonth: string; // YYYY-MM
  energyIntensityKWhPerSqM: number;
  renewableContributionPercentage: number;
  waterConsumptionLiters: number;
  carbonFootprintMetricTons: number;
}

export interface WasteRecord {
  recordId: string;
  tenantId: string;
  spaceIdRef: string;
  wasteCategory: 'GENERAL' | 'RECYCLABLE' | 'HAZARDOUS' | 'CHEMICAL' | 'ELECTRONIC';
  quantityKg: number;
  isHazardous: boolean;
  disposalMethod: string;
  recordedDate: string;
}

export interface FacilitiesChangeRequest {
  requestId: string;
  tenantId: string;
  spaceIdRef: string;
  changeType: 'CAPACITY_MODIFICATION' | 'ROOM_CONVERSION' | 'SAFETY_RESTRICTION' | 'UTILITY_RECONFIG';
  description: string;
  requestedByUserIdRef: string;
  approvedByUserIdRef?: string;
  status: ChangeRequestStatus;
  idempotencyKey: string;
}

export interface FacilitiesAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  payload: string;
  previousHash: string;
  currentHash: string;
}

export interface FacilitiesSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: { processed: number; mutations: number; executionTimeMs: number };
}
