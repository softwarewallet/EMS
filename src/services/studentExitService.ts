import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { StudentService } from './studentService';
import { 
  ExitRequest, 
  ExitRequestStatus, 
  ClearanceCase, 
  ClearanceItem, 
  ClearanceItemStatus, 
  ExitConfiguration, 
  Student, 
  StudentEnrollment,
  AuditAction
} from '../types';
import { SYSTEM_ROLES, ROLE_ALIASES } from '../config/permissions';

const EXIT_REQUESTS_COL = 'exit_requests';
const CLEARANCE_CASES_COL = 'clearance_cases';
const CLEARANCE_ITEMS_COL = 'clearance_items';
const EXIT_CONFIGS_COL = 'exit_configs';

export class StudentExitService {
  private static userCache = new Map<string, any>();

  static async getActiveUser(): Promise<any | null> {
    const savedUserId = localStorage.getItem('edutech_active_user_id');
    if (!savedUserId) return null;
    if (this.userCache.has(savedUserId)) {
      return this.userCache.get(savedUserId);
    }
    const user = await FirebaseService.getDocument<any>('users', savedUserId);
    if (user) {
      this.userCache.set(savedUserId, user);
    }
    return user;
  }

  static getUserPermissions(user: any, tenantId: string): string[] {
    if (!user) return [];
    if (user.isPlatformSuperAdmin) {
      return ['platform.admin', 'exit.view', 'exit.create', 'exit.edit', 'exit.submit', 'exit.review', 'exit.approve', 'exit.reject', 'exit.complete', 'exit.cancel', 'clearance.view', 'clearance.manage', 'clearance.clear', 'clearance.block', 'clearance.waive', 'clearance.configure'];
    }
    const effectiveRoles = user.roleAssignments?.filter((ra: any) => ra.tenantId === tenantId || ra.tenantId === 'ALL') || [];
    if (effectiveRoles.some((r: any) => r.roleCode === 'super_admin' || r.roleCode === 'PLATFORM_SUPER_ADMIN')) {
      return ['platform.admin', 'exit.view', 'exit.create', 'exit.edit', 'exit.submit', 'exit.review', 'exit.approve', 'exit.reject', 'exit.complete', 'exit.cancel', 'clearance.view', 'clearance.manage', 'clearance.clear', 'clearance.block', 'clearance.waive', 'clearance.configure'];
    }
    
    const permissionSet = new Set<string>();
    for (const assignment of effectiveRoles) {
      const rawCode = assignment.roleCode || '';
      const resolvedCode = ROLE_ALIASES[rawCode] || rawCode;
      const roleDef = SYSTEM_ROLES.find(
        r => (resolvedCode && r.code === resolvedCode) || 
             r.id === assignment.roleId || 
             (r.code && resolvedCode && r.code.toUpperCase() === resolvedCode.toUpperCase())
      );
      if (roleDef) {
        roleDef.permissions.forEach(p => permissionSet.add(p));
      }
    }
    return Array.from(permissionSet);
  }

  /**
   * Enforces security, tenant boundaries, and permissions
   */
  private static async validateAccess(
    tenantId: string, 
    permissionRequired: string, 
    studentId?: string,
    customUser?: any
  ): Promise<any> {
    const user = customUser !== undefined ? customUser : (await this.getActiveUser());
    if (!user) {
      throw new Error('Unauthenticated: Access Denied.');
    }

    // Platform level bypass
    if (user.isPlatformSuperAdmin) {
      return user;
    }

    // Tenant Isolation
    const userTenantAssignments = user.roleAssignments?.filter((ra: any) => ra.tenantId === tenantId || ra.tenantId === 'ALL') || [];
    if (userTenantAssignments.length === 0) {
      throw new Error(`Tenant Isolation Violation: You are not authorized to access tenant ${tenantId}.`);
    }

    const permissions = this.getUserPermissions(user, tenantId);
    
    // Check Permission
    if (permissionRequired && !permissions.includes(permissionRequired)) {
      throw new Error(`Permission Denied: Missing '${permissionRequired}' permission.`);
    }

    // Guardian / Student Security checks
    if (studentId) {
      const student = await StudentService.getStudentById(studentId, user);
      if (!student) {
        throw new Error('Student record not found.');
      }

      const isStudentRole = user.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT' || ra.roleCode === 'student');
      const isParentRole = user.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN' || ra.roleCode === 'parent');

      if (isStudentRole) {
        const isSelf = user.metadata?.studentId === studentId || user.email?.toLowerCase() === student.email?.toLowerCase();
        if (!isSelf) {
          throw new Error('Security Violation: Students may only view or request exits for themselves.');
        }
      } else if (isParentRole) {
        const isWard = user.metadata?.studentId === studentId || 
                       student.guardians?.some((g: any) => g.email?.toLowerCase() === user.email?.toLowerCase());
        if (!isWard) {
          throw new Error('Security Violation: Guardians may only manage exit requests for their registered wards.');
        }
      }
    }

    return user;
  }

  /**
   * Get default or existing exit configuration for a tenant
   */
  static async getConfiguration(tenantId: string, requestingUser?: any): Promise<ExitConfiguration> {
    await this.validateAccess(tenantId, 'clearance.view', undefined, requestingUser);

    const config = await FirebaseService.getDocument<ExitConfiguration>(EXIT_CONFIGS_COL, `${tenantId}_config`);
    if (config) return config;

    // Default configuration if none exists
    const defaultConfig: ExitConfiguration = {
      id: `${tenantId}_config`,
      tenantId,
      requiredCategories: [
        { category: 'Academic', moduleId: 'mod_academic', blocking: true, clearingRoles: ['academic_coordinator', 'principal', 'registrar'] },
        { category: 'Finance', moduleId: 'fees', blocking: true, clearingRoles: ['accountant', 'registrar'] },
        { category: 'Library', moduleId: 'library', blocking: true, clearingRoles: ['librarian', 'registrar'] },
        { category: 'Transport', moduleId: 'transport', blocking: false, clearingRoles: ['transport_manager', 'registrar'] },
        { category: 'Hostel', moduleId: 'hostel', blocking: false, clearingRoles: ['hostel_warden', 'registrar'] },
        { category: 'Inventory', moduleId: 'inventory', blocking: false, clearingRoles: ['inventory_manager', 'registrar'] },
        { category: 'Administration', moduleId: 'core', blocking: true, clearingRoles: ['registrar', 'tenant_admin'] }
      ],
      manualClearancePermitted: true,
      principalApprovalRequired: true,
      registrarApprovalRequired: true,
      withdrawalReasons: ['FAMILY_RELOCATION', 'CHANGE_OF_SCHOOL', 'FINANCIAL_REASON', 'HEALTH_REASON', 'PERSONAL_REASON', 'OTHER'],
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_CONFIGS_COL, defaultConfig.id, defaultConfig);
    return defaultConfig;
  }

  /**
   * Update tenant exit configuration
   */
  static async updateConfiguration(
    tenantId: string, 
    partial: Partial<Omit<ExitConfiguration, 'id' | 'tenantId'>>,
    requestingUser?: any
  ): Promise<void> {
    const user = await this.validateAccess(tenantId, 'clearance.configure', undefined, requestingUser);

    const config = await this.getConfiguration(tenantId, user);
    const updated = {
      ...config,
      ...partial,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await FirebaseService.setDocument(EXIT_CONFIGS_COL, config.id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_CONFIG_UPDATED',
      resource: 'tenant',
      resourceId: config.id,
      resourceName: 'Exit & Clearance Configuration',
      newValue: updated as any,
      notes: 'Exit policy and clearance settings updated by administrator'
    });
  }

  /**
   * Create Exit Request
   */
  static async createExitRequest(params: {
    tenantId: string;
    studentId: string;
    exitType: ExitRequest['exitType'];
    requestedDate: string;
    proposedLastDate: string;
    reason: string;
    destinationInstitution?: string;
    destinationCity?: string;
    destinationState?: string;
    destinationCountry?: string;
    remarks?: string;
  }, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(params.tenantId, 'exit.create', params.studentId, requestingUser);

    // Validate Student status and existing enrollments
    const student = await StudentService.getStudentById(params.studentId, user);
    if (!student) throw new Error('Student record not found.');
    
    if (student.status === 'WITHDRAWN' || student.status === 'TRANSFERRED') {
      throw new Error(`Invalid Request: The student is already officially ${(student.status || '').toLowerCase()}.`);
    }

    // Get current active enrollment
    const enrollments = await StudentService.getStudentEnrollments(params.studentId, params.tenantId);
    const activeEnrollment = enrollments.find(e => e.status === 'ACTIVE');
    if (!activeEnrollment) {
      throw new Error('Invalid Request: The student does not have an active enrollment record to exit from.');
    }

    // Prevent duplicate active requests
    const existingRequests = await this.getExitRequestsByStudent(params.studentId, params.tenantId, user);
    const activeRequest = existingRequests.find(r => 
      r.status !== 'REJECTED' && r.status !== 'CANCELLED' && r.status !== 'COMPLETED'
    );
    if (activeRequest) {
      throw new Error(`Duplicate Request Blocked: An active exit workflow (ID: ${activeRequest.id}, Status: ${activeRequest.status}) already exists for this student.`);
    }

    const id = FirebaseService.generateId('exr');
    
    // Resolve requester role
    let requestedByRole = 'admin';
    const isStudent = user.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT' || ra.roleCode === 'student');
    const isParent = user.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN' || ra.roleCode === 'parent');
    if (isStudent) requestedByRole = 'student';
    else if (isParent) requestedByRole = 'parent';

    const nowStr = new Date().toISOString();
    const newRequest: ExitRequest = {
      id,
      tenantId: params.tenantId,
      studentId: params.studentId,
      currentEnrollmentId: activeEnrollment.id,
      exitType: params.exitType,
      requestedDate: params.requestedDate,
      proposedLastDate: params.proposedLastDate,
      reason: params.reason,
      destinationInstitution: params.destinationInstitution,
      destinationCity: params.destinationCity,
      destinationState: params.destinationState,
      destinationCountry: params.destinationCountry,
      requestedBy: user.id,
      requestedByRole,
      requestedAt: nowStr,
      status: 'DRAFT',
      remarks: params.remarks,
      createdAt: nowStr,
      updatedAt: nowStr
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, newRequest);

    await AuditService.log({
      tenantId: params.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_CREATED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `${student.firstName} ${student.lastName} Exit Request`,
      newValue: newRequest as any,
      notes: `Exit request created in DRAFT state for student: ${student.firstName} ${student.lastName}.`
    });

    return newRequest;
  }

  /**
   * Submit Exit Request (Draft -> Submitted)
   */
  static async submitExitRequest(id: string, tenantId: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.submit', undefined, requestingUser);

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');
    
    if (req.status !== 'DRAFT') {
      throw new Error(`Invalid Transition: Cannot submit a request in '${req.status}' status.`);
    }

    const updated: ExitRequest = {
      ...req,
      status: 'SUBMITTED',
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_SUBMITTED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: 'Exit request submitted to institution for formal review.'
    });

    return updated;
  }

  /**
   * Review Exit Request (Submitted -> Under Review)
   */
  static async reviewExitRequest(id: string, tenantId: string, remarks?: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.review', undefined, requestingUser);

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    if (req.status !== 'SUBMITTED') {
      throw new Error(`Invalid Transition: Only SUBMITTED requests can be placed UNDER_REVIEW. Current state: ${req.status}`);
    }

    const updated: ExitRequest = {
      ...req,
      status: 'UNDER_REVIEW',
      remarks: remarks || req.remarks,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_REVIEWED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: `Review initiated. Admin remarks: ${remarks || 'None'}`
    });

    return updated;
  }

  /**
   * Transition Request Status and Manage Clearance Cases
   */
  static async updateRequestStatus(
    id: string, 
    tenantId: string, 
    targetStatus: ExitRequestStatus, 
    remarks?: string,
    requestingUser?: any
  ): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.edit', undefined, requestingUser);

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    // Validate Transition
    this.validateStateTransition(req.status, targetStatus);

    const updated: ExitRequest = {
      ...req,
      status: targetStatus,
      remarks: remarks || req.remarks,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    // Audit transition
    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: `EXIT_REQUEST_STATUS_UPDATED` as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: `Request status transitioned from ${req.status} to ${targetStatus}. Remarks: ${remarks || 'None'}`
    });

    // Side Effect: If transitioning to CLEARANCE_PENDING, initialize the Clearance Case & Items!
    if (targetStatus === 'CLEARANCE_PENDING') {
      await this.initializeClearanceCase(req, user);
      
      // Auto-advance status to CLEARANCE_IN_PROGRESS
      updated.status = 'CLEARANCE_IN_PROGRESS';
      await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);
    }

    return updated;
  }

  /**
   * Cancel Exit Request
   */
  static async cancelExitRequest(id: string, tenantId: string, remarks?: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.getActiveUser();
    if (!user) throw new Error('Unauthenticated.');

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    // Validate Cancel Authority: Requester or Registrar/Admin
    const isCreator = req.requestedBy === user.id;
    const permissions = this.getUserPermissions(user, tenantId);
    const hasCancelPermission = permissions.includes('exit.cancel');

    if (!isCreator && !hasCancelPermission) {
      throw new Error('Permission Denied: You are not authorized to cancel this exit request.');
    }

    if (req.status === 'COMPLETED' || req.status === 'REJECTED' || req.status === 'CANCELLED') {
      throw new Error(`Invalid Transition: Cannot cancel a request in final state: ${req.status}`);
    }

    const updated: ExitRequest = {
      ...req,
      status: 'CANCELLED',
      remarks: remarks || req.remarks,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_CANCELLED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: `Exit request cancelled. Remarks: ${remarks || 'Cancelled by user'}`
    });

    return updated;
  }

  /**
   * Reject Exit Request
   */
  static async rejectExitRequest(id: string, tenantId: string, remarks: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.reject', undefined, requestingUser);

    if (!remarks) {
      throw new Error('Bad Request: A valid rejection reason/remark is strictly required.');
    }

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    if (req.status === 'COMPLETED' || req.status === 'CANCELLED' || req.status === 'REJECTED') {
      throw new Error(`Invalid Transition: Cannot reject a request in final state: ${req.status}`);
    }

    const updated: ExitRequest = {
      ...req,
      status: 'REJECTED',
      remarks,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_REJECTED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: `Exit request rejected. Remarks: ${remarks}`
    });

    return updated;
  }

  /**
   * Approve Exit Request (Ready for Approval -> Approved)
   */
  static async approveExitRequest(id: string, tenantId: string, remarks?: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.approve', undefined, requestingUser);

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    // Enforce that clearance is complete if config/state is in CLEARANCE_IN_PROGRESS / READY_FOR_APPROVAL
    const clearanceCase = await this.getClearanceCaseByRequest(id, tenantId);
    if (clearanceCase) {
      const items = await this.getClearanceItems(clearanceCase.id, tenantId);
      const blockingItems = items.filter(item => item.blocking && item.status !== 'CLEARED' && item.status !== 'WAIVED' && item.status !== 'NOT_REQUIRED');
      if (blockingItems.length > 0) {
        throw new Error(`Approval Blocked: There are ${blockingItems.length} outstanding blocking clearance departments: ${blockingItems.map(i => i.department).join(', ')}.`);
      }
    }

    const nowStr = new Date().toISOString();
    const updated: ExitRequest = {
      ...req,
      status: 'APPROVED',
      approvedBy: user.id,
      approvedAt: nowStr,
      remarks: remarks || req.remarks,
      updatedAt: nowStr
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_REQUEST_APPROVED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: id,
      resourceName: `Exit Request ${id}`,
      newValue: updated as any,
      notes: `Exit request approved by administrator. Finalizing stage reached.`
    });

    return updated;
  }

  /**
   * Complete Exit Request (Approved -> Completed)
   * This is the final step that officially transitions the student status to WITHDRAWN / TRANSFERRED
   * and closes the active enrollment historical record.
   */
  static async completeExitRequest(id: string, tenantId: string, requestingUser?: any): Promise<ExitRequest> {
    const user = await this.validateAccess(tenantId, 'exit.complete', undefined, requestingUser);

    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) throw new Error('Exit request not found.');
    if (req.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    if (req.status !== 'APPROVED') {
      throw new Error(`Invalid Transition: Cannot complete a request in '${req.status}' state. It must be APPROVED first.`);
    }

    const student = await StudentService.getStudentById(req.studentId, user);
    if (!student) throw new Error('Student record not found.');

    // Determine final status
    let targetStatus: Student['status'] = 'WITHDRAWN';
    let auditAction: AuditAction = 'STUDENT_WITHDRAWN';
    if (req.exitType === 'TRANSFER') {
      targetStatus = 'TRANSFERRED';
      auditAction = 'STUDENT_TRANSFERRED' as any;
    } else if (req.exitType === 'GRADUATION') {
      targetStatus = 'GRADUATED'; // Existing completed/alumni status or equivalent
      auditAction = 'STUDENT_GRADUATED' as any;
    }

    // 1. Update Student lifecycle status
    await FirebaseService.updateDocument('students', req.studentId, {
      status: targetStatus,
      lastAttendanceDate: req.proposedLastDate,
      exitReason: req.reason,
      exitDate: req.requestedDate
    });

    // 2. Safely close/update current enrollment record status
    if (req.currentEnrollmentId) {
      await FirebaseService.updateDocument('enrollments', req.currentEnrollmentId, {
        status: targetStatus,
        endDate: req.proposedLastDate,
        updatedAt: new Date().toISOString()
      });
    }

    // 3. Mark request as COMPLETED
    const nowStr = new Date().toISOString();
    const updated: ExitRequest = {
      ...req,
      status: 'COMPLETED',
      completedAt: nowStr,
      updatedAt: nowStr
    };

    await FirebaseService.setDocument(EXIT_REQUESTS_COL, id, updated);

    // Update Clearance Case if exists
    const clearanceCase = await this.getClearanceCaseByRequest(id, tenantId);
    if (clearanceCase) {
      await FirebaseService.updateDocument(CLEARANCE_CASES_COL, clearanceCase.id, {
        status: 'COMPLETED',
        completedAt: nowStr
      });
    }

    // 4. Log formal audit records
    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: auditAction,
      resource: 'student',
      resourceId: req.studentId,
      resourceName: `${student.firstName} ${student.lastName}`,
      newValue: { status: targetStatus, exitRequest: updated },
      notes: `Student Exit Request successfully executed. Status set to ${targetStatus}. Enrollment closed.`
    });

    return updated;
  }

  /**
   * Initialize Clearance Case and items based on tenant configuration & module enablement
   */
  private static async initializeClearanceCase(req: ExitRequest, actor: any): Promise<ClearanceCase> {
    const config = await this.getConfiguration(req.tenantId, actor);
    
    // Obtain active tenant enabled modules
    const tenant = await FirebaseService.getDocument<any>('tenants', req.tenantId);
    const enabledModules: string[] = tenant?.enabledModules || [];

    const caseId = FirebaseService.generateId('clc');
    const nowStr = new Date().toISOString();

    const clearanceCase: ClearanceCase = {
      id: caseId,
      exitRequestId: req.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
      status: 'PENDING',
      openedAt: nowStr
    };

    await FirebaseService.setDocument(CLEARANCE_CASES_COL, caseId, clearanceCase);

    // Build Clearance Items based on categories in the policy
    for (const cat of config.requiredCategories) {
      const itemId = FirebaseService.generateId('cli');
      
      // Determine initial status based on module enablement
      let status: ClearanceItemStatus = 'PENDING';
      if (cat.moduleId && cat.moduleId !== 'core' && !enabledModules.includes(cat.moduleId)) {
        status = 'NOT_REQUIRED'; // Respect module enablement!
      }

      const item: ClearanceItem = {
        id: itemId,
        clearanceCaseId: caseId,
        exitRequestId: req.id,
        studentId: req.studentId,
        tenantId: req.tenantId,
        moduleId: cat.moduleId || 'core',
        department: cat.category,
        itemType: `${cat.category.toLowerCase()}_clearance`,
        status,
        blocking: cat.blocking,
        assignedTo: cat.clearingRoles?.[0], // default assign to first role code
        createdAt: nowStr,
        updatedAt: nowStr
      };

      await FirebaseService.setDocument(CLEARANCE_ITEMS_COL, itemId, item);
    }

    await AuditService.log({
      tenantId: req.tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName || actor.email,
      action: 'EXIT_CLEARANCE_CREATED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: caseId,
      resourceName: `Clearance Case for Request ${req.id}`,
      notes: `Clearance tracking initiated for student. Requirements generated dynamically.`
    });

    return clearanceCase;
  }

  /**
   * Get Clearance Case by Request ID
   */
  static async getClearanceCaseByRequest(exitRequestId: string, tenantId: string): Promise<ClearanceCase | null> {
    const cases = await FirebaseService.getTenantCollection<ClearanceCase>(CLEARANCE_CASES_COL, tenantId);
    return cases.find(c => c.exitRequestId === exitRequestId) || null;
  }

  /**
   * Get Clearance Items by Case ID
   */
  static async getClearanceItems(clearanceCaseId: string, tenantId: string): Promise<ClearanceItem[]> {
    const items = await FirebaseService.getTenantCollection<ClearanceItem>(CLEARANCE_ITEMS_COL, tenantId);
    return items.filter(i => i.clearanceCaseId === clearanceCaseId);
  }

  /**
   * Resolve Clearance Item (Pending -> Cleared)
   */
  static async resolveClearanceItem(
    itemId: string, 
    tenantId: string, 
    remarks?: string, 
    requestingUser?: any
  ): Promise<ClearanceItem> {
    const user = await this.validateAccess(tenantId, 'clearance.clear', undefined, requestingUser);

    const item = await FirebaseService.getDocument<ClearanceItem>(CLEARANCE_ITEMS_COL, itemId);
    if (!item) throw new Error('Clearance item not found.');
    if (item.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    const nowStr = new Date().toISOString();
    const updated: ClearanceItem = {
      ...item,
      status: 'CLEARED',
      remarks: remarks || item.remarks,
      resolvedBy: user.id,
      resolvedAt: nowStr,
      updatedAt: nowStr
    };

    await FirebaseService.setDocument(CLEARANCE_ITEMS_COL, itemId, updated);

    // Audit resolve
    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_CLEARANCE_ITEM_CLEARED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: itemId,
      resourceName: `${item.department} Clearance Item`,
      newValue: updated as any,
      notes: `Clearance marked CLEARED. Remarks: ${remarks || 'None'}`
    });

    // Check if all blocking items are cleared to transition the exit request to READY_FOR_APPROVAL
    await this.reevaluateClearanceCaseStatus(item.clearanceCaseId, tenantId);

    return updated;
  }

  /**
   * Block Clearance Item (Pending -> Blocked)
   */
  static async blockClearanceItem(
    itemId: string, 
    tenantId: string, 
    remarks: string, 
    amount?: number, 
    requestingUser?: any
  ): Promise<ClearanceItem> {
    const user = await this.validateAccess(tenantId, 'clearance.block', undefined, requestingUser);

    if (!remarks) {
      throw new Error('Bad Request: Remarks indicating blocking reason are strictly required.');
    }

    const item = await FirebaseService.getDocument<ClearanceItem>(CLEARANCE_ITEMS_COL, itemId);
    if (!item) throw new Error('Clearance item not found.');
    if (item.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    const updated: ClearanceItem = {
      ...item,
      status: 'BLOCKED',
      remarks,
      amount: amount !== undefined ? amount : item.amount,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(CLEARANCE_ITEMS_COL, itemId, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_CLEARANCE_ITEM_BLOCKED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: itemId,
      resourceName: `${item.department} Clearance Item`,
      newValue: updated as any,
      notes: `Department clearance blocked. Reason: ${remarks}. Amount: ${amount || 0}`
    });

    await this.reevaluateClearanceCaseStatus(item.clearanceCaseId, tenantId);

    return updated;
  }

  /**
   * Waive Clearance Item (Blocked/Pending -> Waived)
   */
  static async waiveClearanceItem(
    itemId: string, 
    tenantId: string, 
    reason: string, 
    requestingUser?: any
  ): Promise<ClearanceItem> {
    const user = await this.validateAccess(tenantId, 'clearance.waive', undefined, requestingUser);

    if (!reason) {
      throw new Error('Bad Request: A valid waiver reason is strictly required.');
    }

    const item = await FirebaseService.getDocument<ClearanceItem>(CLEARANCE_ITEMS_COL, itemId);
    if (!item) throw new Error('Clearance item not found.');
    if (item.tenantId !== tenantId) throw new Error('Tenant boundary violation.');

    const nowStr = new Date().toISOString();
    const updated: ClearanceItem = {
      ...item,
      status: 'WAIVED',
      remarks: `Waived by administrative override. Reason: ${reason}`,
      waivedBy: user.id,
      waivedReason: reason,
      waivedAt: nowStr,
      updatedAt: nowStr
    };

    await FirebaseService.setDocument(CLEARANCE_ITEMS_COL, itemId, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXIT_CLEARANCE_ITEM_WAIVED' as any,
      resource: 'STUDENT_RECORD' as any,
      resourceId: itemId,
      resourceName: `${item.department} Clearance Item`,
      newValue: updated as any,
      notes: `Clearance item waived. Reason: ${reason}`
    });

    await this.reevaluateClearanceCaseStatus(item.clearanceCaseId, tenantId);

    return updated;
  }

  /**
   * Automatically reevaluates overall clearance completion status
   */
  private static async reevaluateClearanceCaseStatus(caseId: string, tenantId: string): Promise<void> {
    const cCase = await FirebaseService.getDocument<ClearanceCase>(CLEARANCE_CASES_COL, caseId);
    if (!cCase) return;

    const items = await this.getClearanceItems(caseId, tenantId);
    
    // Check if any item is blocked or pending
    const outstandingBlocking = items.filter(i => 
      i.blocking && i.status !== 'CLEARED' && i.status !== 'WAIVED' && i.status !== 'NOT_REQUIRED'
    );

    const hasInReview = items.some(i => i.status === 'IN_REVIEW');
    const isCompleted = outstandingBlocking.length === 0;

    let targetCaseStatus: ClearanceCase['status'] = 'IN_PROGRESS';
    if (isCompleted) {
      targetCaseStatus = 'CLEARED';
    }

    if (cCase.status !== targetCaseStatus) {
      await FirebaseService.updateDocument(CLEARANCE_CASES_COL, caseId, {
        status: targetCaseStatus,
        completedAt: targetCaseStatus === 'CLEARED' ? new Date().toISOString() : null
      });

      // If fully cleared, automatically advance the Exit Request to READY_FOR_APPROVAL!
      if (targetCaseStatus === 'CLEARED') {
        const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, cCase.exitRequestId);
        if (req && req.status === 'CLEARANCE_IN_PROGRESS') {
          await FirebaseService.updateDocument(EXIT_REQUESTS_COL, req.id, {
            status: 'READY_FOR_APPROVAL',
            updatedAt: new Date().toISOString()
          });

          await AuditService.log({
            tenantId,
            userId: 'system',
            userEmail: 'system@edutechsms.com',
            userDisplayName: 'Clearance Workflow Engine',
            action: 'EXIT_CLEARANCE_COMPLETED' as any,
            resource: 'STUDENT_RECORD' as any,
            resourceId: req.id,
            resourceName: `Exit Request ${req.id}`,
            notes: `All mandatory clearance items resolved. Request advanced to READY_FOR_APPROVAL.`
          });
        }
      } else {
        // If it was READY_FOR_APPROVAL, but now an item is blocked again, regress state back to CLEARANCE_IN_PROGRESS
        const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, cCase.exitRequestId);
        if (req && req.status === 'READY_FOR_APPROVAL') {
          await FirebaseService.updateDocument(EXIT_REQUESTS_COL, req.id, {
            status: 'CLEARANCE_IN_PROGRESS',
            updatedAt: new Date().toISOString()
          });
        }
      }
    }
  }

  /**
   * Fetch all exit requests for a tenant
   */
  static async getExitRequests(tenantId: string, requestingUser?: any): Promise<ExitRequest[]> {
    await this.validateAccess(tenantId, 'exit.view', undefined, requestingUser);
    return FirebaseService.getTenantCollection<ExitRequest>(EXIT_REQUESTS_COL, tenantId);
  }

  /**
   * Fetch all clearance cases for a tenant
   */
  static async getAllClearanceCases(tenantId: string, requestingUser?: any): Promise<ClearanceCase[]> {
    await this.validateAccess(tenantId, 'exit.view', undefined, requestingUser);
    return FirebaseService.getTenantCollection<ClearanceCase>(CLEARANCE_CASES_COL, tenantId);
  }

  /**
   * Fetch exit requests for a student
   */
  static async getExitRequestsByStudent(studentId: string, tenantId: string, requestingUser?: any): Promise<ExitRequest[]> {
    await this.validateAccess(tenantId, 'exit.view', studentId, requestingUser);
    const all = await FirebaseService.getTenantCollection<ExitRequest>(EXIT_REQUESTS_COL, tenantId);
    return all.filter(r => r.studentId === studentId);
  }

  /**
   * Fetch single exit request by ID
   */
  static async getExitRequestById(id: string, tenantId: string, requestingUser?: any): Promise<ExitRequest | null> {
    const req = await FirebaseService.getDocument<ExitRequest>(EXIT_REQUESTS_COL, id);
    if (!req) return null;
    if (req.tenantId !== tenantId) {
      throw new Error('Tenant boundary violation.');
    }
    await this.validateAccess(tenantId, 'exit.view', req.studentId, requestingUser);
    return req;
  }

  /**
   * Validates state machine transition rules
   */
  private static validateStateTransition(current: ExitRequestStatus, target: ExitRequestStatus): void {
    if (current === target) return;

    const validTransitions: Record<ExitRequestStatus, ExitRequestStatus[]> = {
      DRAFT: ['SUBMITTED', 'CANCELLED'],
      SUBMITTED: ['UNDER_REVIEW', 'REJECTED', 'CANCELLED'],
      UNDER_REVIEW: ['CLEARANCE_PENDING', 'REJECTED', 'CANCELLED'],
      CLEARANCE_PENDING: ['CLEARANCE_IN_PROGRESS', 'REJECTED', 'CANCELLED'],
      CLEARANCE_IN_PROGRESS: ['READY_FOR_APPROVAL', 'REJECTED', 'CANCELLED'],
      READY_FOR_APPROVAL: ['APPROVED', 'REJECTED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      REJECTED: ['DRAFT', 'CANCELLED'],
      CANCELLED: ['DRAFT'],
      COMPLETED: []
    };

    const allowed = validTransitions[current] || [];
    if (!allowed.includes(target)) {
      throw new Error(`Invalid Transition: Moving from '${current}' to '${target}' state is strictly forbidden by institutional policy.`);
    }
  }
}
