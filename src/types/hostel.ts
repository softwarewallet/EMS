export type HostelStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type GenderPolicy = 'BOYS' | 'GIRLS' | 'MIXED' | 'STAFF' | 'SPECIALIZED' | 'OTHER';
export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD' | 'DORMITORY' | 'SPECIAL' | 'OTHER';
export type RoomStatus = 'AVAILABLE' | 'FULL' | 'PARTIAL' | 'MAINTENANCE' | 'RESERVED' | 'BLOCKED' | 'INACTIVE';
export type BedType = 'STANDARD' | 'BUNK_TOP' | 'BUNK_BOTTOM' | 'ACCESSIBLE' | 'SPECIAL' | 'OTHER';
export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'BLOCKED' | 'RETIRED';
export type StaffRole = 'WARDEN' | 'ASSISTANT_WARDEN' | 'RESIDENT_SUPERVISOR' | 'HOSTEL_COORDINATOR' | 'CARETAKER' | 'OTHER';
export type AllocationType = 'REGULAR' | 'TEMPORARY' | 'EMERGENCY' | 'SPECIAL';
export type AllocationStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'CANCELLED';

export interface HostelProfile {
  hostelProfileId: string;
  tenantId: string;
  campusId?: string;
  code: string;
  name: string;
  description?: string;
  hostelType: GenderPolicy;
  genderPolicy: GenderPolicy;
  capacity: number;
  status: HostelStatus;
  operatingPolicyId?: string;
  version: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostelPolicy {
  policyId: string;
  tenantId: string;
  campusId?: string;
  version: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';
  effectiveFrom: string;
  effectiveTo?: string;
  minimumAgeRules?: string;
  maximumOccupancyRules?: string;
  genderRestrictions?: string;
  allocationRules?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface HostelBuilding {
  buildingId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  code: string;
  name: string;
  description?: string;
  numberOfFloors: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE' | 'ARCHIVED';
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostelFloor {
  floorId: string;
  tenantId: string;
  campusId?: string;
  buildingId: string;
  floorNumber: number;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface HostelRoom {
  roomId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  genderRestriction: GenderPolicy;
  status: RoomStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostelBed {
  bedId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedNumber: string;
  bedType: BedType;
  status: BedStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HostelStaffAssignment {
  assignmentId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  buildingId?: string;
  employeeReference: string;
  userId: string;
  role: StaffRole;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ENDED';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type ResidenceLifecycleState = 'NOT_HOUSED' | 'ALLOCATED' | 'CHECK_IN_PENDING' | 'CHECKED_IN' | 'ACTIVE' | 'TRANSFER_PENDING' | 'TEMPORARY' | 'CHECKOUT_PENDING' | 'CHECKED_OUT' | 'SUSPENDED';

export type ResidenceEventType = 'ALLOCATED' | 'CHECK_IN_REQUESTED' | 'CHECKED_IN' | 'ACTIVATED' | 'TRANSFER_REQUESTED' | 'TRANSFERRED' | 'TEMPORARY_STARTED' | 'TEMPORARY_ENDED' | 'CHECKOUT_REQUESTED' | 'CHECKED_OUT' | 'CANCELLED' | 'SUSPENDED' | 'REACTIVATED';

export interface ResidenceLifecycleEvent {
  eventId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  allocationId: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  eventType: ResidenceEventType;
  fromStatus: ResidenceLifecycleState;
  toStatus: ResidenceLifecycleState;
  effectiveAt: string;
  recordedAt: string;
  reason?: string;
  remarks?: string;
  actorUserId: string;
  approvedBy?: string;
  policyId?: string;
  policyVersion?: string;
  source: string;
  createdAt: string;
}

export interface ResidenceCheckIn {
  checkInId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  scheduledDate: string;
  actualDate?: string;
  actualTime?: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  checkInType: 'REGULAR' | 'LATE' | 'TRANSFER' | 'EMERGENCY' | 'TEMPORARY';
  documents?: string[];
  remarks?: string;
  recordedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceTransfer {
  transferId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  oldHostelProfileId: string;
  oldBuildingId: string;
  oldFloorId: string;
  oldRoomId: string;
  oldBedId: string;
  newHostelProfileId: string;
  newBuildingId: string;
  newFloorId: string;
  newRoomId: string;
  newBedId: string;
  requestedAt: string;
  effectiveAt: string;
  reason: string;
  remarks?: string;
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  requestedBy: string;
  approvedBy?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemporaryResidenceAssignment {
  temporaryId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  sourceAllocationId?: string;
  temporaryAllocationId: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  approvedBy?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceCheckOut {
  checkOutId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  requestedDate: string;
  actualDate?: string;
  actualTime?: string;
  reason: string;
  checkOutType: 'REGULAR' | 'EARLY' | 'TRANSFER' | 'EXIT' | 'GRADUATION' | 'EXPULSION' | 'OTHER';
  status: 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  requestedBy: string;
  approvedBy?: string;
  completedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceStatusHistory {
  statusHistoryId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  allocationId: string;
  fromStatus: ResidenceLifecycleState;
  toStatus: ResidenceLifecycleState;
  effectiveAt: string;
  reason?: string;
  actorUserId: string;
  approvedBy?: string;
  createdAt: string;
}

export interface HostelAllocation {
  allocationId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  academicYearId: string;
  hostelProfileId: string;
  hostelVersion: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  allocationType: AllocationType;
  effectiveFrom: string;
  effectiveTo?: string;
  status: AllocationStatus;
  residenceStatus?: ResidenceLifecycleState;
  allocationReason?: string;
  assignedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------
// PHASE 7.12C - MESS/DINING & RESIDENCE SERVICES TYPES
// ---------------------------------------------------------

export type MessStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED' | 'ARCHIVED';
export type MessServiceMode = 'FIXED_MENU' | 'ROTATING_MENU' | 'CUSTOM';
export type MealType = 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'EVENING_SNACK' | 'DINNER' | 'OTHER';

export interface MealWindow {
  windowId: string;
  mealType: MealType;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MessProfile {
  messProfileId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  name: string;
  code: string;
  description?: string;
  status: MessStatus;
  operatingDays: number[];
  mealWindows: MealWindow[];
  capacity: number;
  serviceMode: MessServiceMode;
  policyId?: string;
  policyVersion?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export type MealPlanStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export interface MealPlan {
  mealPlanId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  messProfileId: string;
  name: string;
  code: string;
  description?: string;
  includedMeals: MealType[];
  effectiveFrom: string;
  effectiveTo?: string;
  eligibilityRules?: string;
  status: MealPlanStatus;
  version: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ResidentMealAssignmentStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'CANCELLED';

export interface ResidentMealAssignment {
  assignmentId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  hostelProfileId: string;
  messProfileId: string;
  mealPlanId: string;
  mealPlanVersion: string;
  specialMealRequirement?: 'VEGETARIAN' | 'VEGAN' | 'ALLERGY_ALERT' | 'RELIGIOUS_DIET' | 'MEDICAL_DIET' | 'CUSTOM';
  effectiveFrom: string;
  effectiveTo?: string;
  status: ResidentMealAssignmentStatus;
  assignedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type MealSessionStatus = 'SCHEDULED' | 'OPEN' | 'CLOSED' | 'CANCELLED';

export interface MealSession {
  mealSessionId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  messProfileId: string;
  mealType: MealType;
  serviceDate: string;
  startTime: string;
  endTime: string;
  status: MealSessionStatus;
  capacity: number;
  servedCount: number;
  createdBy: string;
  closedBy?: string;
  createdAt: string;
  closedAt?: string;
}

export type MealConsumptionStatus = 'ELIGIBLE' | 'CONSUMED' | 'EXCUSED' | 'NOT_CONSUMED' | 'CANCELLED';
export type MealConsumptionSource = 'MANUAL' | 'QR' | 'RFID' | 'BIOMETRIC' | 'API' | 'OTHER';

export interface MealConsumptionEvent {
  consumptionId: string;
  tenantId: string;
  campusId?: string;
  mealSessionId: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  mealPlanId: string;
  mealType: MealType;
  serviceDate: string;
  status: MealConsumptionStatus;
  source: MealConsumptionSource;
  recordedAt: string;
  recordedBy: string;
  remarks?: string;
  createdAt: string;
}

export type ServiceRequestCategory = 'HOUSEKEEPING' | 'MAINTENANCE' | 'ELECTRICAL' | 'PLUMBING' | 'FURNITURE' | 'CLEANING' | 'LAUNDRY' | 'INTERNET' | 'SECURITY' | 'ROOM_CONDITION' | 'BED_CONDITION' | 'OTHER';
export type ServiceRequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'EMERGENCY';
export type ServiceRequestStatus = 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED' | 'CANCELLED';

export interface ResidenceServiceRequest {
  requestId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId: string;
  category: ServiceRequestCategory;
  priority: ServiceRequestPriority;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  assignedTo?: string;
  requestedAt: string;
  acknowledgedAt?: string;
  startedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  dueAt?: string;
  breachedAt?: string;
  resolution?: string;
  policyId?: string;
  policyVersion?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type HousekeepingTaskType = 'ROOM_CLEANING' | 'BATHROOM_CLEANING' | 'COMMON_AREA' | 'DEEP_CLEANING' | 'BED_AREA' | 'POST_CHECKOUT' | 'OTHER';
export type HousekeepingTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ResidenceHousekeepingTask {
  taskId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  taskType: HousekeepingTaskType;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  scheduledAt: string;
  assignedTo?: string;
  status: HousekeepingTaskStatus;
  completedAt?: string;
  completedBy?: string;
  remarks?: string;
  sourceRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export type InspectionType = 'ROUTINE' | 'CHECK_IN' | 'CHECKOUT' | 'TRANSFER' | 'INCIDENT' | 'EMERGENCY';
export type InspectionCondition = 'GOOD' | 'MINOR_ISSUE' | 'DAMAGED' | 'UNSAFE' | 'UNAVAILABLE';
export type InspectionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ACTION_PENDING' | 'CLOSED';

export interface ResidenceInspection {
  inspectionId: string;
  tenantId: string;
  campusId?: string;
  hostelProfileId: string;
  buildingId: string;
  floorId: string;
  roomId: string;
  bedId?: string;
  allocationId?: string;
  studentId?: string;
  inspectionType: InspectionType;
  inspectionDate: string;
  condition: InspectionCondition;
  findings: string;
  actionRequired?: string;
  status: InspectionStatus;
  performedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type HandoverType = 'CHECK_IN' | 'TRANSFER' | 'CHECKOUT';

export interface InventoryHandoverItem {
  itemId: string;
  itemType: string;
  quantity: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DAMAGED' | 'MISSING';
  serialReference?: string;
  remarks?: string;
}

export interface ResidenceInventoryHandover {
  handoverId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  enrollmentId: string;
  allocationId: string;
  roomId: string;
  bedId: string;
  inventoryItems: InventoryHandoverItem[];
  handoverType: HandoverType;
  condition: string;
  acknowledgedBy: string;
  acknowledgedAt: string;
  createdAt: string;
}

export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

export interface ResidenceComplaint {
  complaintId: string;
  tenantId: string;
  campusId?: string;
  studentId: string;
  allocationId: string;
  category: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  description: string;
  status: ComplaintStatus;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export type IncidentType = 'SAFETY' | 'SECURITY' | 'DISCIPLINE' | 'PROPERTY_DAMAGE' | 'FIRE' | 'EMERGENCY' | 'MEDICAL_REFERENCE' | 'OTHER';
export type IncidentSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED';

export interface ResidenceIncident {
  incidentId: string;
  tenantId: string;
  campusId?: string;
  studentId?: string;
  enrollmentId?: string;
  allocationId?: string;
  hostelProfileId: string;
  buildingId: string;
  roomId?: string;
  bedId?: string;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  occurredAt: string;
  reportedAt: string;
  description: string;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  resolution?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidenceEmergencyOverride {
  overrideId: string;
  tenantId: string;
  campusId?: string;
  actorUserId: string;
  reason: string;
  affectedResourceType: 'ROOM' | 'BED' | 'HOSTEL' | 'MEAL_SESSION';
  affectedResourceId: string;
  scope: string;
  actionTaken: string;
  createdAt: string;
}

export interface HostelOperationsAnalyticsCache {
  cacheId: string;
  tenantId: string;
  campusId?: string;
  generatedAt: string;
  mealUtilization: {
    totalEligible: number;
    totalConsumed: number;
    consumptionPercentage: number;
  };
  serviceRequests: {
    totalOpen: number;
    urgentCount: number;
    slaBreachedCount: number;
    avgResolutionTimeHours: number;
  };
  housekeeping: {
    pendingTasks: number;
    completedToday: number;
  };
  inspections: {
    pendingCount: number;
  };
  complaintsAndIncidents: {
    openComplaints: number;
    openIncidents: number;
    criticalIncidents: number;
  };
}
