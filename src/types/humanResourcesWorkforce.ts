export type EmployeeLifecycleStatus = 
  | 'PROSPECT'
  | 'SELECTED'
  | 'APPOINTMENT_PENDING'
  | 'APPOINTED'
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'SUSPENDED'
  | 'SEPARATION_PENDING'
  | 'SEPARATED'
  | 'ALUMNI_STAFF';

export type EmploymentType = 'PERMANENT' | 'TEMPORARY' | 'CONTRACT' | 'VISITING' | 'ADJUNCT' | 'PART_TIME' | 'FULL_TIME' | 'INTERNSHIP';

export type LeaveRequestStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'TAKEN' | 'COMPLETED';

export type SeparationType = 'RESIGNATION' | 'RETIREMENT' | 'CONTRACT_END' | 'TERMINATION' | 'TRANSFER' | 'DEATH' | 'OTHER_GOVERNED_REASON';

export type ClearanceStatus = 'PENDING' | 'CLEARED' | 'REJECTED';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Employee {
  employeeId: string; // Internal UUID
  employeeNumber: string; // e.g. 2026-EMP-000001
  tenantId: string;
  primaryCampusIdRef: string;
  status: EmployeeLifecycleStatus;
  employeeType: EmploymentType;
  classification: string;
  displayName: string;
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentRecord {
  employmentId: string;
  tenantId: string;
  employeeIdRef: string;
  contractType: EmploymentType;
  startDate: string;
  endDate?: string;
  probationEndDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  sourceReferenceId?: string;
}

export interface PositionAssignment {
  assignmentId: string;
  tenantId: string;
  employeeIdRef: string;
  positionIdRef: string; // Ref Phase 10.1
  organizationIdRef: string; // Ref Phase 10.1
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
}

export interface EmployeeLeaveRequest {
  requestId: string;
  tenantId: string;
  employeeIdRef: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  createdAt: string;
}

export interface EmployeeAttendanceCorrection {
  correctionId: string;
  tenantId: string;
  employeeIdRef: string;
  date: string;
  originalValue: string;
  correctedValue: string;
  reason: string;
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface EmployeeSeparationRequest {
  separationId: string;
  tenantId: string;
  employeeIdRef: string;
  separationType: SeparationType;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'APPROVED' | 'CLEARANCE' | 'FINALIZED' | 'SEPARATED' | 'CANCELLED';
  requesterUserIdRef: string;
  approverUserIdRef?: string;
  requestedDate: string;
  effectiveDate: string;
}

export interface HRAuditEvent {
  eventId: string;
  tenantId: string;
  campusIdRef: string;
  actorUserIdRef: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

export interface HRSimulationScenario {
  id: string;
  name: string;
  description: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  result?: string;
  metrics?: any;
}
