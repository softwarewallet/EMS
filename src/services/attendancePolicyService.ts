import {
  AttendancePolicy,
  LeaveRequest,
  AttendanceCondonation,
  AttendanceComplianceResult,
  ShortageStatus,
  PolicyStatus,
  LeaveStatus,
  CondonationStatus
} from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { AttendanceService } from './attendanceService';

const POLICIES_COL = 'attendance_policies';
const LEAVE_REQUESTS_COL = 'leave_requests';
const CONDONATIONS_COL = 'attendance_condonations';

export class AttendancePolicyService {
  /**
   * Get all policies for a tenant
   */
  static async getPolicies(tenantId: string): Promise<AttendancePolicy[]> {
    const policies = await FirebaseService.getTenantCollection<AttendancePolicy>(POLICIES_COL, tenantId);
    if (policies && policies.length > 0) return policies;

    // Seed default tenant policy if none exists
    const defaultPolicy: AttendancePolicy = {
      policyId: `pol_${tenantId}_default`,
      tenantId,
      name: 'Standard Institution Attendance Policy',
      description: 'Default board-agnostic attendance and leave policy with 75% minimum threshold.',
      boardType: 'Custom',
      status: 'ACTIVE',
      version: '1.0',
      effectiveFrom: '2026-04-01',
      effectiveTo: '2027-03-31',
      minimumAttendancePercentage: 75,
      latePolicy: {
        schoolStartTime: '08:00',
        gracePeriodMinutes: 10,
        lateThresholdMinutes: 11,
        maxLateCountBeforeWarning: 3,
        maxLateCountBeforeEscalation: 5,
        countLateAs: 'present'
      },
      leavePolicy: {
        allowedCategories: ['MEDICAL', 'PERSONAL', 'FAMILY', 'EMERGENCY', 'AUTHORIZED', 'OTHER'],
        requireMedicalDocAfterDays: 3,
        maxConsecutiveDays: 14,
        requireApprovalBy: 'coordinator'
      },
      shortagePolicy: {
        warningThreshold: 80,
        shortageThreshold: 75,
        criticalThreshold: 60,
        autoNotifyParent: true,
        autoNotifyCoordinator: true
      },
      condonationPolicy: {
        maxCondonablePercentage: 10,
        requiresPrincipalApproval: true,
        requiresDocument: true
      },
      approvalPolicy: {
        levels: ['teacher', 'coordinator', 'principal'],
        escalationAfterHours: 48
      },
      notificationPolicy: {
        enableSMS: false,
        enableEmail: true,
        triggerOnWarning: true,
        triggerOnShortage: true,
        triggerOnLeaveDecision: true
      },
      createdBy: 'SYSTEM',
      approvedBy: 'Administrator',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(POLICIES_COL, defaultPolicy.policyId, defaultPolicy);
    return [defaultPolicy];
  }

  /**
   * Create or update attendance policy
   */
  static async savePolicy(
    policy: AttendancePolicy,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendancePolicy> {
    const isNew = !policy.policyId;
    const policyId = policy.policyId || `pol_${policy.tenantId}_${Date.now()}`;
    const now = new Date().toISOString();

    const saved: AttendancePolicy = {
      ...policy,
      policyId,
      updatedAt: now
    };

    if (isNew) {
      saved.createdAt = now;
      saved.createdBy = user.displayName || user.email || user.id;
    }

    await FirebaseService.setDocument(POLICIES_COL, policyId, saved);

    await AuditService.log({
      tenantId: policy.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: isNew ? 'POLICY_CREATED' : 'POLICY_UPDATED',
      resource: 'attendance_policy',
      resourceId: policyId,
      resourceName: saved.name,
      newValue: saved,
      result: 'SUCCESS'
    });

    return saved;
  }

  /**
   * Activate policy (superseding previous active policies at same scope)
   */
  static async activatePolicy(
    policyId: string,
    tenantId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<void> {
    const policies = await this.getPolicies(tenantId);
    const target = policies.find(p => p.policyId === policyId);
    if (!target) throw new Error('Policy not found');

    for (const p of policies) {
      if (p.status === 'ACTIVE' && p.policyId !== policyId) {
        p.status = 'SUPERSEDED';
        p.updatedAt = new Date().toISOString();
        await FirebaseService.setDocument(POLICIES_COL, p.policyId, p);
      }
    }

    target.status = 'ACTIVE';
    target.approvedBy = user.displayName || user.email || user.id;
    target.approvedAt = new Date().toISOString();
    target.updatedAt = new Date().toISOString();
    await FirebaseService.setDocument(POLICIES_COL, policyId, target);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'POLICY_ACTIVATED',
      resource: 'attendance_policy',
      resourceId: policyId,
      resourceName: target.name,
      newValue: target,
      result: 'SUCCESS'
    });
  }

  /**
   * Resolve applicable policy for student/class/campus/tenant
   */
  static async resolvePolicy(
    tenantId: string,
    campusId?: string,
    academicYearId?: string,
    classId?: string
  ): Promise<AttendancePolicy> {
    const policies = await this.getPolicies(tenantId);
    const activePolicies = policies.filter(p => p.status === 'ACTIVE');

    if (classId) {
      const classPol = activePolicies.find(p => p.classId === classId);
      if (classPol) return classPol;
    }

    if (academicYearId && campusId) {
      const acCampusPol = activePolicies.find(p => p.academicYearId === academicYearId && p.campusId === campusId);
      if (acCampusPol) return acCampusPol;
    }

    if (campusId) {
      const campusPol = activePolicies.find(p => p.campusId === campusId && !p.classId);
      if (campusPol) return campusPol;
    }

    const tenantPol = activePolicies.find(p => !p.campusId && !p.classId);
    if (tenantPol) return tenantPol;

    return activePolicies[0] || policies[0];
  }

  /**
   * Get leave requests for tenant or student
   */
  static async getLeaveRequests(
    tenantId: string,
    filters?: { studentId?: string; status?: LeaveStatus; classId?: string }
  ): Promise<LeaveRequest[]> {
    let requests = await FirebaseService.getTenantCollection<LeaveRequest>(LEAVE_REQUESTS_COL, tenantId);
    if (!requests) requests = [];

    if (filters?.studentId) {
      requests = requests.filter(r => r.studentId === filters.studentId);
    }
    if (filters?.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters?.classId) {
      requests = requests.filter(r => r.classId === filters.classId);
    }
    return requests;
  }

  /**
   * Submit or create leave request
   */
  static async saveLeaveRequest(
    request: Omit<LeaveRequest, 'leaveRequestId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<LeaveRequest> {
    const leaveRequestId = `leave_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    const newRequest: LeaveRequest = {
      ...request,
      leaveRequestId,
      status: request.status || 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(LEAVE_REQUESTS_COL, leaveRequestId, newRequest);

    await AuditService.log({
      tenantId: request.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'LEAVE_SUBMITTED',
      resource: 'leave_request',
      resourceId: leaveRequestId,
      resourceName: `Leave Request for ${request.studentName} (${request.startDate} to ${request.endDate})`,
      newValue: newRequest,
      result: 'SUCCESS'
    });

    return newRequest;
  }

  /**
   * Review/Approve/Reject leave request
   */
  static async updateLeaveStatus(
    leaveRequestId: string,
    tenantId: string,
    status: LeaveStatus,
    user: { id: string; email: string; displayName?: string },
    rejectionReason?: string
  ): Promise<LeaveRequest> {
    const request = await FirebaseService.getDocument<LeaveRequest>(LEAVE_REQUESTS_COL, leaveRequestId);
    if (!request) throw new Error('Leave request not found');

    const now = new Date().toISOString();
    request.status = status;
    request.updatedAt = now;

    if (status === 'APPROVED') {
      request.approvedBy = user.id;
      request.approvedByName = user.displayName || user.email;
      request.approvedAt = now;
    } else if (status === 'REJECTED') {
      request.rejectedBy = user.id;
      request.rejectedByName = user.displayName || user.email;
      request.rejectedAt = now;
      request.rejectionReason = rejectionReason;
    } else if (status === 'CANCELLED') {
      request.cancelledBy = user.id;
      request.cancelledAt = now;
    }

    await FirebaseService.setDocument(LEAVE_REQUESTS_COL, leaveRequestId, request);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: status === 'APPROVED' ? 'LEAVE_APPROVED' : status === 'REJECTED' ? 'LEAVE_REJECTED' : 'LEAVE_SUBMITTED',
      resource: 'leave_request',
      resourceId: leaveRequestId,
      resourceName: `Leave status updated to ${status}`,
      newValue: request,
      result: 'SUCCESS'
    });

    return request;
  }

  /**
   * Calculate student compliance and shortage status based on policy
   */
  static async evaluateStudentCompliance(
    tenantId: string,
    studentId: string,
    enrollmentId: string,
    academicYearId: string
  ): Promise<AttendanceComplianceResult> {
    const policy = await this.resolvePolicy(tenantId);
    const records = await AttendanceService.getStudentAttendance(tenantId, studentId);

    const yearRecords = records.filter(r => r.academicYearId === academicYearId && r.enrollmentId === enrollmentId);
    const totalInstructionalDays = yearRecords.length || 1;

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let leaveCount = 0;

    for (const rec of yearRecords) {
      if (rec.status === 'present') presentCount++;
      else if (rec.status === 'absent') absentCount++;
      else if (rec.status === 'late') lateCount++;
      else if (rec.status === 'excused') excusedCount++;
      else if (rec.status === 'leave') leaveCount++;
    }

    const leaveRequests = await this.getLeaveRequests(tenantId, { studentId, status: 'APPROVED' });
    let approvedLeaveDays = 0;
    for (const lr of leaveRequests) {
      approvedLeaveDays += lr.numberOfDays || 1;
    }

    const effectivePresent = presentCount + (policy.latePolicy.countLateAs === 'present' ? lateCount : 0) + approvedLeaveDays;
    const actualPercentage = Number(((presentCount / totalInstructionalDays) * 100).toFixed(2));
    const effectivePercentage = Number(((effectivePresent / totalInstructionalDays) * 100).toFixed(2));

    let shortageStatus: ShortageStatus = 'NORMAL';
    if (effectivePercentage < policy.shortagePolicy.criticalThreshold) {
      shortageStatus = 'CRITICAL';
    } else if (effectivePercentage < policy.shortagePolicy.shortageThreshold) {
      shortageStatus = 'SHORTAGE';
    } else if (effectivePercentage < policy.shortagePolicy.warningThreshold) {
      shortageStatus = 'WARNING';
    }

    const condonations = await this.getCondonations(tenantId, studentId);
    const approvedCondonation = condonations.find(c => c.status === 'APPROVED' && c.academicYearId === academicYearId);

    const isCompliant = effectivePercentage >= policy.minimumAttendancePercentage || !!approvedCondonation;

    return {
      studentId,
      studentName: yearRecords[0]?.studentName || 'Student',
      enrollmentId,
      academicYearId,
      totalInstructionalDays,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      leaveCount: leaveCount + approvedLeaveDays,
      actualPercentage,
      effectivePercentage,
      minimumRequiredPercentage: policy.minimumAttendancePercentage,
      policyId: policy.policyId,
      policyVersion: policy.version,
      shortageStatus: approvedCondonation ? 'NORMAL' : shortageStatus,
      isCompliant,
      condoned: !!approvedCondonation,
      condonationId: approvedCondonation?.id,
      evaluatedAt: new Date().toISOString()
    };
  }

  /**
   * Get condonations
   */
  static async getCondonations(tenantId: string, studentId?: string): Promise<AttendanceCondonation[]> {
    let condonations = await FirebaseService.getTenantCollection<AttendanceCondonation>(CONDONATIONS_COL, tenantId);
    if (!condonations) condonations = [];
    if (studentId) {
      condonations = condonations.filter(c => c.studentId === studentId);
    }
    return condonations;
  }

  /**
   * Save or request condonation
   */
  static async saveCondonation(
    condonation: Omit<AttendanceCondonation, 'id' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceCondonation> {
    const id = `cond_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    const newCondonation: AttendanceCondonation = {
      ...condonation,
      id,
      status: condonation.status || 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(CONDONATIONS_COL, id, newCondonation);

    await AuditService.log({
      tenantId: condonation.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'CONDONATION_SUBMITTED',
      resource: 'attendance_condonation',
      resourceId: id,
      resourceName: `Condonation request for ${condonation.studentName}`,
      newValue: newCondonation,
      result: 'SUCCESS'
    });

    return newCondonation;
  }

  /**
   * Update condonation status (Approve/Reject)
   */
  static async updateCondonationStatus(
    id: string,
    tenantId: string,
    status: CondonationStatus,
    user: { id: string; email: string; displayName?: string },
    remarks?: string
  ): Promise<AttendanceCondonation> {
    const cond = await FirebaseService.getDocument<AttendanceCondonation>(CONDONATIONS_COL, id);
    if (!cond) throw new Error('Condonation request not found');

    const now = new Date().toISOString();
    cond.status = status;
    cond.updatedAt = now;
    if (remarks) cond.remarks = remarks;

    if (status === 'APPROVED') {
      cond.approvedBy = user.id;
      cond.approvedByName = user.displayName || user.email;
      cond.approvedAt = now;
    }

    await FirebaseService.setDocument(CONDONATIONS_COL, id, cond);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: status === 'APPROVED' ? 'CONDONATION_APPROVED' : 'CONDONATION_REJECTED',
      resource: 'attendance_condonation',
      resourceId: id,
      resourceName: `Condonation status updated to ${status}`,
      newValue: cond,
      result: 'SUCCESS'
    });

    return cond;
  }
}
