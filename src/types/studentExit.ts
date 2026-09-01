export type ExitType = 'TRANSFER' | 'WITHDRAWAL' | 'GRADUATION' | 'COMPLETION' | 'OTHER';

export type ExitRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CLEARANCE_PENDING'
  | 'CLEARANCE_IN_PROGRESS'
  | 'READY_FOR_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface ExitRequest {
  id: string;
  tenantId: string;
  studentId: string;
  currentEnrollmentId: string;
  exitType: ExitType;
  requestedDate: string; // YYYY-MM-DD
  proposedLastDate: string; // YYYY-MM-DD
  reason: string; // e.g. FAMILY_RELOCATION, etc.
  destinationInstitution?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationCountry?: string;
  requestedBy: string; // userId
  requestedByRole: string; // 'parent' | 'student' | 'registrar' | 'principal' | 'admin'
  requestedAt: string; // ISO String
  status: ExitRequestStatus;
  remarks?: string;
  approvedBy?: string; // userId
  approvedAt?: string; // ISO String
  completedAt?: string; // ISO String
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export type ClearanceItemStatus = 'NOT_REQUIRED' | 'PENDING' | 'IN_REVIEW' | 'CLEARED' | 'BLOCKED' | 'WAIVED';

export interface ClearanceCase {
  id: string;
  exitRequestId: string;
  studentId: string;
  tenantId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLEARED' | 'COMPLETED';
  openedAt: string;
  completedAt?: string;
}

export interface ClearanceItem {
  id: string;
  clearanceCaseId: string;
  exitRequestId: string;
  studentId: string;
  tenantId: string;
  moduleId: string; // e.g., 'core', 'student', 'academic', 'attendance', 'fees', 'library', 'transport', 'hostel', 'inventory', 'administration'
  department: string; // e.g. 'Academic', 'Finance', 'Library', 'Transport', 'Hostel', 'Inventory', 'Administration'
  itemType: string; // e.g. 'academic_records', 'outstanding_dues', 'books_returned', etc.
  status: ClearanceItemStatus;
  assignedTo?: string; // role code or specific user
  remarks?: string;
  amount?: number; // Optional blocking amount
  blocking: boolean;
  resolvedBy?: string; // userId
  resolvedAt?: string; // ISO String
  waivedBy?: string; // userId
  waivedReason?: string; // required if status === 'WAIVED'
  waivedAt?: string; // ISO String
  createdAt: string;
  updatedAt: string;
}

export interface ExitConfiguration {
  id: string; // e.g., 'exit_config'
  tenantId: string;
  requiredCategories: {
    category: string; // e.g., 'Academic', 'Finance', 'Library', 'Transport', 'Hostel', 'Inventory', 'Administration'
    moduleId?: string; // module code if tied to a module
    blocking: boolean;
    clearingRoles: string[]; // e.g., ['registrar', 'academic_coordinator', 'accountant', 'librarian']
  }[];
  manualClearancePermitted: boolean;
  principalApprovalRequired: boolean;
  registrarApprovalRequired: boolean;
  withdrawalReasons: string[]; // List of withdrawal reasons
  updatedAt: string;
  updatedBy?: string;
}
