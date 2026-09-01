// EMS Phase 7.17: Staff, HR & Workforce Management Governance Engine Service
import {
  StaffProfile,
  StaffStatus,
  EmploymentType,
  EmploymentCategory,
  StaffEmploymentHistory,
  StaffQualification,
  StaffCertification,
  StaffSkill,
  StaffDocument,
  StaffDocumentCategory,
  VerificationStatus,
  StaffAssignment,
  AssignmentType,
  StaffWorkloadSnapshot,
  StaffLeaveType,
  StaffLeavePolicy,
  StaffLeaveBalance,
  StaffLeaveRequest,
  StaffLeaveTransaction,
  LeaveRequestStatus,
  StaffSubstitutionRecord,
  StaffPerformanceCycle,
  StaffPerformanceReview,
  StaffObjective,
  ObjectiveStatus,
  ReviewOutcome,
  StaffComplianceRecord,
  ComplianceStatus,
  StaffTrainingProgram,
  StaffTrainingAssignment,
  StaffDepartment,
  StaffDesignation,
  StaffHRCase,
  HRCaseStatus,
  StaffExitCase,
  StaffClearanceItem,
  StaffHandoverRecord,
  ClearanceStatus,
  ClearanceDepartment,
  StaffAnalyticsSummary,
  User
} from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { CommunicationService } from './communicationService';

// Firestore Collection Constants
const STAFF_PROFILES_COL = 'staff_profiles';
const STAFF_HISTORY_COL = 'staff_employment_history';
const STAFF_QUALIFICATIONS_COL = 'staff_qualifications';
const STAFF_CERTIFICATIONS_COL = 'staff_certifications';
const STAFF_SKILLS_COL = 'staff_skills';
const STAFF_DOCUMENTS_COL = 'staff_documents';
const STAFF_ASSIGNMENTS_COL = 'staff_assignments';
const STAFF_WORKLOADS_COL = 'staff_workload_snapshots';
const STAFF_LEAVE_TYPES_COL = 'staff_leave_types';
const STAFF_LEAVE_POLICIES_COL = 'staff_leave_policies';
const STAFF_LEAVE_BALANCES_COL = 'staff_leave_balances';
const STAFF_LEAVE_REQUESTS_COL = 'staff_leave_requests';
const STAFF_LEAVE_TRANSACTIONS_COL = 'staff_leave_transactions';
const STAFF_SUBSTITUTIONS_COL = 'staff_substitutions';
const STAFF_PERF_CYCLES_COL = 'staff_performance_cycles';
const STAFF_PERF_REVIEWS_COL = 'staff_performance_reviews';
const STAFF_OBJECTIVES_COL = 'staff_objectives';
const STAFF_COMPLIANCE_COL = 'staff_compliance_records';
const STAFF_TRAINING_PROGS_COL = 'staff_training_programs';
const STAFF_TRAINING_ASSIGNS_COL = 'staff_training_assignments';
const STAFF_DEPARTMENTS_COL = 'staff_departments';
const STAFF_DESIGNATIONS_COL = 'staff_designations';
const STAFF_HR_CASES_COL = 'staff_hr_cases';
const STAFF_EXIT_CASES_COL = 'staff_exit_cases';
const STAFF_CLEARANCE_ITEMS_COL = 'staff_exit_clearances';
const STAFF_HANDOVERS_COL = 'staff_handover_records';
const STAFF_ANALYTICS_CACHE_COL = 'staff_analytics_cache';

export class StaffService {
  // =========================================================================
  // 1. STAFF MASTER PROFILES & LIFECYCLE
  // =========================================================================

  static async getStaffList(
    tenantId: string,
    filters?: {
      campusId?: string;
      department?: string;
      category?: EmploymentCategory;
      status?: StaffStatus;
      search?: string;
    }
  ): Promise<StaffProfile[]> {
    const list = await FirebaseService.getTenantCollection<StaffProfile>(
      STAFF_PROFILES_COL,
      tenantId
    );

    return list.filter((staff) => {
      if (filters?.campusId && staff.campusId && staff.campusId !== filters.campusId) return false;
      if (filters?.department && staff.department !== filters.department) return false;
      if (filters?.category && staff.employmentCategory !== filters.category) return false;
      if (filters?.status && staff.status !== filters.status) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matchName = staff.fullName?.toLowerCase().includes(q);
        const matchEmpNo = staff.employeeNumber?.toLowerCase().includes(q);
        const matchEmail = staff.email?.toLowerCase().includes(q);
        const matchDept = staff.department?.toLowerCase().includes(q);
        const matchDesig = staff.designation?.toLowerCase().includes(q);
        if (!matchName && !matchEmpNo && !matchEmail && !matchDept && !matchDesig) return false;
      }
      return true;
    });
  }

  static async getStaffById(tenantId: string, staffId: string): Promise<StaffProfile | null> {
    const doc = await FirebaseService.getDocument<StaffProfile>(STAFF_PROFILES_COL, staffId);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  static async createStaff(
    tenantId: string,
    params: Omit<StaffProfile, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'employeeNumber'> & {
      customEmployeeNumber?: string;
    },
    actorUser: User
  ): Promise<StaffProfile> {
    const id = `staff_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();

    // Deterministic Employee Numbering sequence
    const existing = await FirebaseService.getTenantCollection<StaffProfile>(STAFF_PROFILES_COL, tenantId);
    const seq = (existing.length + 1).toString().padStart(4, '0');
    const employeeNumber = params.customEmployeeNumber?.trim() || `EMP-${currentYear}-${seq}`;

    const profile: StaffProfile = {
      ...params,
      id,
      tenantId,
      employeeNumber,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUser.id
    };

    await FirebaseService.setDocument(STAFF_PROFILES_COL, id, profile);

    // Record initial lifecycle event
    await this.recordLifecycleEvent(
      tenantId,
      {
        tenantId,
        staffId: id,
        staffName: profile.fullName,
        eventType: 'JOINED',
        newState: profile.status,
        effectiveDate: profile.joiningDate,
        reason: 'Initial Employee Onboarding',
        actorId: actorUser.id,
        actorName: actorUser.displayName || actorUser.email,
        notes: `Joined as ${profile.designation} in ${profile.department}`
      },
      actorUser
    );

    // Initial audit log
    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_PROFILE_CREATED',
      resource: 'staff_profile',
      resourceId: id,
      resourceName: profile.fullName,
      result: 'SUCCESS',
      newValue: profile
    });

    return profile;
  }

  static async updateStaff(
    tenantId: string,
    staffId: string,
    updates: Partial<StaffProfile>,
    actorUser: User
  ): Promise<StaffProfile> {
    const existing = await this.getStaffById(tenantId, staffId);
    if (!existing) throw new Error('Staff record not found or tenant mismatch');

    const updated: StaffProfile = {
      ...existing,
      ...updates,
      version: (existing.version || 1) + 1,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_PROFILES_COL, staffId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_PROFILE_UPDATED',
      resource: 'staff_profile',
      resourceId: staffId,
      resourceName: existing.fullName,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  static async updateStaffStatus(
    tenantId: string,
    staffId: string,
    newStatus: StaffStatus,
    reason: string,
    actorUser: User
  ): Promise<StaffProfile> {
    const existing = await this.getStaffById(tenantId, staffId);
    if (!existing) throw new Error('Staff record not found');

    const oldStatus = existing.status;
    const updated = await this.updateStaff(tenantId, staffId, { status: newStatus }, actorUser);

    let eventType: StaffEmploymentHistory['eventType'] = 'ROLE_CHANGED';
    if (newStatus === 'ACTIVE' && oldStatus === 'DRAFT') eventType = 'CONFIRMED';
    else if (newStatus === 'ON_LEAVE') eventType = 'ON_LEAVE';
    else if (newStatus === 'SUSPENDED') eventType = 'SUSPENDED';
    else if (newStatus === 'RESIGNED') eventType = 'RESIGNED';
    else if (newStatus === 'TERMINATED') eventType = 'TERMINATED';
    else if (newStatus === 'RETIRED') eventType = 'RETIRED';
    else if (newStatus === 'EXITED') eventType = 'EXITED';

    await this.recordLifecycleEvent(
      tenantId,
      {
        tenantId,
        staffId,
        staffName: existing.fullName,
        eventType,
        previousState: oldStatus,
        newState: newStatus,
        effectiveDate: new Date().toISOString().split('T')[0],
        reason,
        actorId: actorUser.id,
        actorName: actorUser.displayName || actorUser.email
      },
      actorUser
    );

    return updated;
  }

  // =========================================================================
  // 2. EMPLOYMENT LIFECYCLE HISTORY
  // =========================================================================

  static async getEmploymentHistory(tenantId: string, staffId: string): Promise<StaffEmploymentHistory[]> {
    const list = await FirebaseService.getTenantCollection<StaffEmploymentHistory>(
      STAFF_HISTORY_COL,
      tenantId
    );
    return list.filter((h) => h.staffId === staffId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async recordLifecycleEvent(
    tenantId: string,
    params: Omit<StaffEmploymentHistory, 'id' | 'createdAt'>,
    actorUser: User
  ): Promise<StaffEmploymentHistory> {
    const id = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const event: StaffEmploymentHistory = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_HISTORY_COL, id, event);
    return event;
  }

  // =========================================================================
  // 3. QUALIFICATIONS, CERTIFICATIONS & SKILLS
  // =========================================================================

  static async getQualifications(tenantId: string, staffId: string): Promise<StaffQualification[]> {
    const list = await FirebaseService.getTenantCollection<StaffQualification>(STAFF_QUALIFICATIONS_COL, tenantId);
    return list.filter((q) => q.staffId === staffId);
  }

  static async addQualification(
    tenantId: string,
    params: Omit<StaffQualification, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffQualification> {
    const id = `qual_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const qual: StaffQualification = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_QUALIFICATIONS_COL, id, qual);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_QUALIFICATION_ADDED',
      resource: 'staff_qualification',
      resourceId: id,
      result: 'SUCCESS',
      newValue: qual
    });

    return qual;
  }

  static async verifyQualification(
    tenantId: string,
    qualId: string,
    status: VerificationStatus,
    actorUser: User
  ): Promise<StaffQualification> {
    const existing = await FirebaseService.getDocument<StaffQualification>(STAFF_QUALIFICATIONS_COL, qualId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Qualification not found');

    const updated: StaffQualification = {
      ...existing,
      verificationStatus: status,
      verifiedBy: actorUser.id,
      verifiedByName: actorUser.displayName || actorUser.email,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_QUALIFICATIONS_COL, qualId, updated);
    return updated;
  }

  static async getCertifications(tenantId: string, staffId: string): Promise<StaffCertification[]> {
    const list = await FirebaseService.getTenantCollection<StaffCertification>(STAFF_CERTIFICATIONS_COL, tenantId);
    return list.filter((c) => c.staffId === staffId);
  }

  static async addCertification(
    tenantId: string,
    params: Omit<StaffCertification, 'id' | 'createdAt'>,
    actorUser: User
  ): Promise<StaffCertification> {
    const id = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const cert: StaffCertification = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_CERTIFICATIONS_COL, id, cert);
    return cert;
  }

  static async verifyCertification(
    tenantId: string,
    certId: string,
    status: VerificationStatus,
    actorUser: User
  ): Promise<StaffCertification> {
    const existing = await FirebaseService.getDocument<StaffCertification>(STAFF_CERTIFICATIONS_COL, certId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Certification record not found');

    const updated: StaffCertification = {
      ...existing,
      verificationStatus: status,
      verifiedBy: actorUser.id,
      verifiedByName: actorUser.displayName || actorUser.email,
      verifiedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_CERTIFICATIONS_COL, certId, updated);
    return updated;
  }

  static async getSkills(tenantId: string, staffId: string): Promise<StaffSkill[]> {
    const list = await FirebaseService.getTenantCollection<StaffSkill>(STAFF_SKILLS_COL, tenantId);
    return list.filter((s) => s.staffId === staffId);
  }

  static async addSkill(tenantId: string, params: Omit<StaffSkill, 'id' | 'createdAt'>): Promise<StaffSkill> {
    const id = `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const skill: StaffSkill = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(STAFF_SKILLS_COL, id, skill);
    return skill;
  }

  static async deleteSkill(tenantId: string, skillId: string): Promise<void> {
    await FirebaseService.deleteDocument(STAFF_SKILLS_COL, skillId);
  }

  // =========================================================================
  // 4. STAFF DOCUMENTS
  // =========================================================================

  static async getStaffDocuments(
    tenantId: string,
    staffId?: string,
    category?: StaffDocumentCategory
  ): Promise<StaffDocument[]> {
    const list = await FirebaseService.getTenantCollection<StaffDocument>(
      STAFF_DOCUMENTS_COL,
      tenantId
    );
    let filtered = list;
    if (staffId) {
      filtered = filtered.filter((d) => d.staffId === staffId);
    }
    if (category) {
      filtered = filtered.filter((d) => d.documentCategory === category);
    }
    return filtered;
  }

  static async uploadDocument(
    tenantId: string,
    params: Omit<StaffDocument, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffDocument> {
    const id = `sdoc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const doc: StaffDocument = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_DOCUMENTS_COL, id, doc);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_DOCUMENT_UPLOADED',
      resource: 'staff_document',
      resourceId: id,
      resourceName: doc.title,
      result: 'SUCCESS',
      newValue: doc
    });

    return doc;
  }

  static async verifyDocument(
    tenantId: string,
    docId: string,
    status: VerificationStatus,
    notes: string,
    actorUser: User
  ): Promise<StaffDocument> {
    const existing = await FirebaseService.getDocument<StaffDocument>(STAFF_DOCUMENTS_COL, docId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Staff document not found');

    const updated: StaffDocument = {
      ...existing,
      verificationStatus: status,
      verifiedBy: actorUser.id,
      verifiedByName: actorUser.displayName || actorUser.email,
      verifiedAt: new Date().toISOString(),
      notes: notes || existing.notes,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_DOCUMENTS_COL, docId, updated);
    return updated;
  }

  // =========================================================================
  // 5. STAFF ASSIGNMENTS
  // =========================================================================

  static async getStaffAssignments(
    tenantId: string,
    filters?: {
      campusId?: string;
      staffId?: string;
      type?: AssignmentType;
      status?: 'ACTIVE' | 'COMPLETED' | 'REVOKED';
    }
  ): Promise<StaffAssignment[]> {
    const list = await FirebaseService.getTenantCollection<StaffAssignment>(
      STAFF_ASSIGNMENTS_COL,
      tenantId
    );

    return list.filter((a) => {
      if (filters?.campusId && a.campusId && a.campusId !== filters.campusId) return false;
      if (filters?.staffId && a.staffId !== filters.staffId) return false;
      if (filters?.type && a.assignmentType !== filters.type) return false;
      if (filters?.status && a.status !== filters.status) return false;
      return true;
    });
  }

  static async createAssignment(
    tenantId: string,
    params: Omit<StaffAssignment, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffAssignment> {
    const id = `asgn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const assignment: StaffAssignment = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_ASSIGNMENTS_COL, id, assignment);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_ASSIGNMENT_CREATED',
      resource: 'staff_assignment',
      resourceId: id,
      resourceName: `${assignment.staffName} - ${assignment.roleTitle}`,
      result: 'SUCCESS',
      newValue: assignment
    });

    return assignment;
  }

  static async updateAssignmentStatus(
    tenantId: string,
    assignmentId: string,
    status: 'ACTIVE' | 'COMPLETED' | 'REVOKED',
    actorUser: User
  ): Promise<StaffAssignment> {
    const existing = await FirebaseService.getDocument<StaffAssignment>(STAFF_ASSIGNMENTS_COL, assignmentId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Assignment not found');

    const updated: StaffAssignment = {
      ...existing,
      status,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_ASSIGNMENTS_COL, assignmentId, updated);
    return updated;
  }

  // =========================================================================
  // 6. WORKLOAD ENGINE
  // =========================================================================

  static async getWorkloadSnapshots(tenantId: string, campusId?: string): Promise<StaffWorkloadSnapshot[]> {
    const list = await FirebaseService.getTenantCollection<StaffWorkloadSnapshot>(
      STAFF_WORKLOADS_COL,
      tenantId
    );
    if (campusId) {
      return list.filter((w) => w.campusId === campusId);
    }
    return list;
  }

  static async calculateWorkloadForStaff(
    tenantId: string,
    campusId: string,
    staffId: string,
    period = new Date().toISOString().substring(0, 7) // YYYY-MM
  ): Promise<StaffWorkloadSnapshot> {
    const staff = await this.getStaffById(tenantId, staffId);
    if (!staff) throw new Error('Staff member not found');

    // Aggregate assignments
    const assignments = await this.getStaffAssignments(tenantId, { staffId, status: 'ACTIVE' });
    const teachingAssignments = assignments.filter((a) => a.assignmentType === 'TEACHING');
    const adminAssignments = assignments.filter((a) => a.assignmentType !== 'TEACHING');

    const teachingPeriods = teachingAssignments.reduce((sum, a) => sum + (a.weeklyPeriods || 4), 0);
    const classesSet = new Set(teachingAssignments.map((a) => a.classId).filter(Boolean));
    const subjectsSet = new Set(teachingAssignments.map((a) => a.subjectId).filter(Boolean));

    const weeklyTeachingHours = teachingPeriods * 0.75; // 45 mins per period
    const prepAndGradingHours = Math.round(weeklyTeachingHours * 0.4 * 10) / 10;
    const adminHours = adminAssignments.length * 3; // Approx 3 hrs per administrative / committee duty
    const totalWeeklyLoadHours = Math.round((weeklyTeachingHours + prepAndGradingHours + adminHours) * 10) / 10;

    const maxRecommended = staff.employmentType === 'PART_TIME' ? 20 : 36;
    let utilization: StaffWorkloadSnapshot['utilizationClassification'] = 'NORMAL';
    if (totalWeeklyLoadHours < 16) utilization = 'UNDER_UTILIZED';
    else if (totalWeeklyLoadHours > 40) utilization = 'OVERLOADED';
    else if (totalWeeklyLoadHours >= 34) utilization = 'HIGH';

    const snapshotId = `wload_${staffId}_${period.replace('-', '_')}`;
    const snapshot: StaffWorkloadSnapshot = {
      id: snapshotId,
      tenantId,
      campusId: staff.campusId || campusId,
      staffId,
      staffName: staff.fullName,
      department: staff.department,
      period,
      teachingPeriods,
      examDutiesCount: 0,
      administrativeDutiesHours: adminHours,
      totalWeeklyLoadHours,
      maxRecommendedLoadHours: maxRecommended,
      utilizationClassification: utilization,
      breakdown: {
        classesCount: classesSet.size,
        subjectsCount: subjectsSet.size,
        weeklyTeachingHours,
        prepAndGradingHours,
        committeeHours: adminHours
      },
      calculatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_WORKLOADS_COL, snapshotId, snapshot);
    return snapshot;
  }

  static async recalculateAllWorkloads(tenantId: string, campusId?: string): Promise<StaffWorkloadSnapshot[]> {
    const staffList = await this.getStaffList(tenantId, { campusId, status: 'ACTIVE' });
    const results: StaffWorkloadSnapshot[] = [];
    for (const s of staffList) {
      const snap = await this.calculateWorkloadForStaff(tenantId, s.campusId || campusId || '', s.id);
      results.push(snap);
    }
    return results;
  }

  // =========================================================================
  // 7. LEAVE MANAGEMENT & LEDGER
  // =========================================================================

  static async getLeaveTypes(tenantId: string): Promise<StaffLeaveType[]> {
    return FirebaseService.getTenantCollection<StaffLeaveType>(STAFF_LEAVE_TYPES_COL, tenantId);
  }

  static async createLeaveType(
    tenantId: string,
    params: Omit<StaffLeaveType, 'id'>,
    actorUser: User
  ): Promise<StaffLeaveType> {
    const id = `lt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const leaveType: StaffLeaveType = {
      ...params,
      id,
      tenantId
    };
    await FirebaseService.setDocument(STAFF_LEAVE_TYPES_COL, id, leaveType);
    return leaveType;
  }

  static async getLeaveBalances(
    tenantId: string,
    staffId: string,
    academicYearId?: string
  ): Promise<StaffLeaveBalance[]> {
    const list = await FirebaseService.getTenantCollection<StaffLeaveBalance>(
      STAFF_LEAVE_BALANCES_COL,
      tenantId
    );
    return list.filter((b) => {
      if (b.staffId !== staffId) return false;
      if (academicYearId && b.academicYearId !== academicYearId) return false;
      return true;
    });
  }

  static async initializeLeaveBalances(
    tenantId: string,
    staffId: string,
    academicYearId: string,
    category: EmploymentCategory,
    actorUser: User
  ): Promise<StaffLeaveBalance[]> {
    const leaveTypes = await this.getLeaveTypes(tenantId);
    const existing = await this.getLeaveBalances(tenantId, staffId, academicYearId);
    const existingTypeIds = new Set(existing.map((e) => e.leaveTypeId));

    const createdBalances: StaffLeaveBalance[] = [];

    for (const lt of leaveTypes) {
      if (lt.status !== 'ACTIVE' || existingTypeIds.has(lt.id)) continue;

      const balanceId = `bal_${staffId}_${lt.id}_${academicYearId}`;
      const balance: StaffLeaveBalance = {
        id: balanceId,
        tenantId,
        staffId,
        academicYearId,
        leaveTypeId: lt.id,
        leaveTypeName: lt.name,
        totalAllocated: lt.annualQuota,
        usedDays: 0,
        pendingDays: 0,
        remainingDays: lt.annualQuota,
        carryForwardDays: 0,
        updatedAt: new Date().toISOString()
      };

      await FirebaseService.setDocument(STAFF_LEAVE_BALANCES_COL, balanceId, balance);

      // Record transaction
      await this.recordLeaveTransaction(
        tenantId,
        {
          tenantId,
          staffId,
          leaveTypeId: lt.id,
          transactionType: 'ALLOCATION',
          days: lt.annualQuota,
          balanceAfter: lt.annualQuota,
          actorId: actorUser.id,
          actorName: actorUser.displayName || actorUser.email,
          reason: `Annual Leave Quota Allocation for Academic Year ${academicYearId}`
        }
      );

      createdBalances.push(balance);
    }

    return [...existing, ...createdBalances];
  }

  static async getLeaveRequests(
    tenantId: string,
    filters?: {
      campusId?: string;
      staffId?: string;
      status?: LeaveRequestStatus;
    }
  ): Promise<StaffLeaveRequest[]> {
    const list = await FirebaseService.getTenantCollection<StaffLeaveRequest>(
      STAFF_LEAVE_REQUESTS_COL,
      tenantId
    );

    return list.filter((r) => {
      if (filters?.campusId && r.campusId && r.campusId !== filters.campusId) return false;
      if (filters?.staffId && r.staffId !== filters.staffId) return false;
      if (filters?.status && r.status !== filters.status) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async submitLeaveRequest(
    tenantId: string,
    params: Omit<StaffLeaveRequest, 'id' | 'status' | 'version' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffLeaveRequest> {
    const id = `lreq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const request: StaffLeaveRequest = {
      ...params,
      id,
      tenantId,
      status: 'SUBMITTED',
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_LEAVE_REQUESTS_COL, id, request);

    // Update pending days in balance
    const balances = await this.getLeaveBalances(tenantId, params.staffId);
    const matched = balances.find((b) => b.leaveTypeId === params.leaveTypeId);
    if (matched) {
      const updatedBalance: StaffLeaveBalance = {
        ...matched,
        pendingDays: (matched.pendingDays || 0) + params.totalDays,
        updatedAt: now
      };
      await FirebaseService.setDocument(STAFF_LEAVE_BALANCES_COL, matched.id, updatedBalance);
    }

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_LEAVE_REQUEST_SUBMITTED',
      resource: 'staff_leave_request',
      resourceId: id,
      resourceName: `${params.staffName} (${params.leaveTypeName}: ${params.totalDays} days)`,
      result: 'SUCCESS',
      newValue: request
    });

    return request;
  }

  static async reviewLeaveRequest(
    tenantId: string,
    requestId: string,
    action: 'APPROVED' | 'REJECTED',
    notes: string,
    actorUser: User
  ): Promise<StaffLeaveRequest> {
    const existing = await FirebaseService.getDocument<StaffLeaveRequest>(STAFF_LEAVE_REQUESTS_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Leave request not found');

    // Anti-Self-Approval Enforcement Check
    const staff = await this.getStaffById(tenantId, existing.staffId);
    if (
      actorUser.id === existing.staffId ||
      (staff && staff.email && actorUser.email && staff.email.toLowerCase() === actorUser.email.toLowerCase())
    ) {
      throw new Error('Anti-Self-Approval Violation: You cannot approve or reject your own leave request.');
    }

    if (existing.status !== 'SUBMITTED' && existing.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot review leave request in ${existing.status} status`);
    }

    const now = new Date().toISOString();
    const updated: StaffLeaveRequest = {
      ...existing,
      status: action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      reviewedBy: actorUser.id,
      reviewedByName: actorUser.displayName || actorUser.email,
      reviewNotes: notes,
      actionTimestamp: now,
      version: existing.version + 1,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_LEAVE_REQUESTS_COL, requestId, updated);

    // Update balances
    const balances = await this.getLeaveBalances(tenantId, existing.staffId);
    const matched = balances.find((b) => b.leaveTypeId === existing.leaveTypeId);
    if (matched) {
      const newPending = Math.max(0, (matched.pendingDays || 0) - existing.totalDays);
      const newUsed = action === 'APPROVED' ? matched.usedDays + existing.totalDays : matched.usedDays;
      const newRemaining = Math.max(0, matched.totalAllocated - newUsed);

      const updatedBal: StaffLeaveBalance = {
        ...matched,
        pendingDays: newPending,
        usedDays: newUsed,
        remainingDays: newRemaining,
        updatedAt: now
      };
      await FirebaseService.setDocument(STAFF_LEAVE_BALANCES_COL, matched.id, updatedBal);

      if (action === 'APPROVED') {
        await this.recordLeaveTransaction(tenantId, {
          tenantId,
          staffId: existing.staffId,
          leaveTypeId: existing.leaveTypeId,
          leaveRequestId: requestId,
          transactionType: 'DEDUCTION',
          days: existing.totalDays,
          balanceAfter: newRemaining,
          actorId: actorUser.id,
          actorName: actorUser.displayName || actorUser.email,
          reason: `Approved Leave (${existing.startDate} to ${existing.endDate})`
        });
      }
    }

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: action === 'APPROVED' ? 'STAFF_LEAVE_APPROVED' : 'STAFF_LEAVE_REJECTED',
      resource: 'staff_leave_request',
      resourceId: requestId,
      resourceName: `${existing.staffName} (${existing.leaveTypeName})`,
      result: 'SUCCESS',
      newValue: updated
    });

    return updated;
  }

  static async cancelLeaveRequest(
    tenantId: string,
    requestId: string,
    actorUser: User
  ): Promise<StaffLeaveRequest> {
    const existing = await FirebaseService.getDocument<StaffLeaveRequest>(STAFF_LEAVE_REQUESTS_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Leave request not found');

    const now = new Date().toISOString();
    const wasApproved = existing.status === 'APPROVED';

    const updated: StaffLeaveRequest = {
      ...existing,
      status: 'CANCELLED',
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_LEAVE_REQUESTS_COL, requestId, updated);

    // If was approved or submitted, restore balance
    const balances = await this.getLeaveBalances(tenantId, existing.staffId);
    const matched = balances.find((b) => b.leaveTypeId === existing.leaveTypeId);
    if (matched) {
      if (wasApproved) {
        const newUsed = Math.max(0, matched.usedDays - existing.totalDays);
        const newRemaining = matched.totalAllocated - newUsed;
        await FirebaseService.setDocument(STAFF_LEAVE_BALANCES_COL, matched.id, {
          ...matched,
          usedDays: newUsed,
          remainingDays: newRemaining,
          updatedAt: now
        });

        await this.recordLeaveTransaction(tenantId, {
          tenantId,
          staffId: existing.staffId,
          leaveTypeId: existing.leaveTypeId,
          leaveRequestId: requestId,
          transactionType: 'CANCELLATION_REFUND',
          days: existing.totalDays,
          balanceAfter: newRemaining,
          actorId: actorUser.id,
          actorName: actorUser.displayName || actorUser.email,
          reason: `Cancelled Approved Leave Request #${requestId}`
        });
      } else {
        const newPending = Math.max(0, (matched.pendingDays || 0) - existing.totalDays);
        await FirebaseService.setDocument(STAFF_LEAVE_BALANCES_COL, matched.id, {
          ...matched,
          pendingDays: newPending,
          updatedAt: now
        });
      }
    }

    return updated;
  }

  static async getLeaveTransactions(tenantId: string, staffId: string): Promise<StaffLeaveTransaction[]> {
    const list = await FirebaseService.getTenantCollection<StaffLeaveTransaction>(
      STAFF_LEAVE_TRANSACTIONS_COL,
      tenantId
    );
    return list.filter((t) => t.staffId === staffId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async recordLeaveTransaction(
    tenantId: string,
    params: Omit<StaffLeaveTransaction, 'id' | 'createdAt'>
  ): Promise<StaffLeaveTransaction> {
    const id = `ltx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tx: StaffLeaveTransaction = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(STAFF_LEAVE_TRANSACTIONS_COL, id, tx);
    return tx;
  }

  // =========================================================================
  // 8. SUBSTITUTE & COVER MANAGEMENT
  // =========================================================================

  static async getSubstitutions(
    tenantId: string,
    campusId?: string,
    date?: string
  ): Promise<StaffSubstitutionRecord[]> {
    const list = await FirebaseService.getTenantCollection<StaffSubstitutionRecord>(
      STAFF_SUBSTITUTIONS_COL,
      tenantId
    );
    return list.filter((s) => {
      if (campusId && s.campusId && s.campusId !== campusId) return false;
      if (date && s.date !== date) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async createSubstitution(
    tenantId: string,
    params: Omit<StaffSubstitutionRecord, 'id' | 'createdAt'>,
    actorUser: User
  ): Promise<StaffSubstitutionRecord> {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: StaffSubstitutionRecord = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_SUBSTITUTIONS_COL, id, record);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_SUBSTITUTION_SCHEDULED',
      resource: 'staff_substitution',
      resourceId: id,
      resourceName: `${record.substituteStaffName} covering for ${record.absentStaffName}`,
      result: 'SUCCESS',
      newValue: record
    });

    return record;
  }

  static async updateSubstitutionStatus(
    tenantId: string,
    subId: string,
    status: 'PROPOSED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
    actorUser: User
  ): Promise<StaffSubstitutionRecord> {
    const existing = await FirebaseService.getDocument<StaffSubstitutionRecord>(STAFF_SUBSTITUTIONS_COL, subId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Substitution not found');

    const updated: StaffSubstitutionRecord = {
      ...existing,
      status,
      authorizedBy: actorUser.id,
      authorizedByName: actorUser.displayName || actorUser.email,
      authorizedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_SUBSTITUTIONS_COL, subId, updated);
    return updated;
  }

  // =========================================================================
  // 9. PERFORMANCE & APPRAISAL
  // =========================================================================

  static async getPerformanceCycles(tenantId: string): Promise<StaffPerformanceCycle[]> {
    return FirebaseService.getTenantCollection<StaffPerformanceCycle>(STAFF_PERF_CYCLES_COL, tenantId);
  }

  static async createPerformanceCycle(
    tenantId: string,
    params: Omit<StaffPerformanceCycle, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffPerformanceCycle> {
    const id = `pcycle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const cycle: StaffPerformanceCycle = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };
    await FirebaseService.setDocument(STAFF_PERF_CYCLES_COL, id, cycle);
    return cycle;
  }

  static async getPerformanceReviews(
    tenantId: string,
    cycleId?: string,
    staffId?: string
  ): Promise<StaffPerformanceReview[]> {
    const list = await FirebaseService.getTenantCollection<StaffPerformanceReview>(
      STAFF_PERF_REVIEWS_COL,
      tenantId
    );
    return list.filter((r) => {
      if (cycleId && r.cycleId !== cycleId) return false;
      if (staffId && r.staffId !== staffId) return false;
      return true;
    });
  }

  static async createPerformanceReview(
    tenantId: string,
    params: Omit<StaffPerformanceReview, 'id' | 'version' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffPerformanceReview> {
    const id = `prev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const review: StaffPerformanceReview = {
      ...params,
      id,
      tenantId,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_PERF_REVIEWS_COL, id, review);
    return review;
  }

  static async submitSelfReview(
    tenantId: string,
    reviewId: string,
    comments: string,
    actorUser: User
  ): Promise<StaffPerformanceReview> {
    const existing = await FirebaseService.getDocument<StaffPerformanceReview>(STAFF_PERF_REVIEWS_COL, reviewId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Performance review not found');

    const updated: StaffPerformanceReview = {
      ...existing,
      selfComments: comments,
      status: 'SELF_REVIEW_SUBMITTED',
      version: existing.version + 1,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_PERF_REVIEWS_COL, reviewId, updated);
    return updated;
  }

  static async submitManagerReview(
    tenantId: string,
    reviewId: string,
    updates: {
      reviewerComments?: string;
      strengths?: string;
      areasForGrowth?: string;
      ratingScore?: number;
      reviewOutcome?: ReviewOutcome;
    },
    actorUser: User
  ): Promise<StaffPerformanceReview> {
    const existing = await FirebaseService.getDocument<StaffPerformanceReview>(STAFF_PERF_REVIEWS_COL, reviewId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Performance review not found');

    // Anti-Self-Appraisal Check
    if (existing.staffId === actorUser.id) {
      throw new Error('Anti-Self-Appraisal Violation: Reviewers cannot submit manager evaluations for themselves.');
    }

    const updated: StaffPerformanceReview = {
      ...existing,
      ...updates,
      reviewerId: actorUser.id,
      reviewerName: actorUser.displayName || actorUser.email,
      status: 'MANAGER_REVIEW_SUBMITTED',
      version: existing.version + 1,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_PERF_REVIEWS_COL, reviewId, updated);
    return updated;
  }

  static async updatePerformanceReview(
    tenantId: string,
    reviewId: string,
    updates: Partial<StaffPerformanceReview>,
    actorUser: User
  ): Promise<StaffPerformanceReview> {
    const existing = await FirebaseService.getDocument<StaffPerformanceReview>(STAFF_PERF_REVIEWS_COL, reviewId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Performance review not found');

    const updated: StaffPerformanceReview = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_PERF_REVIEWS_COL, reviewId, updated);
    return updated;
  }

  static async finalizePerformanceReview(
    tenantId: string,
    reviewId: string,
    actorUser: User
  ): Promise<StaffPerformanceReview> {
    const existing = await FirebaseService.getDocument<StaffPerformanceReview>(STAFF_PERF_REVIEWS_COL, reviewId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Performance review not found');

    if (existing.staffId === actorUser.id) {
      throw new Error('Anti-Self-Approval: Cannot finalize your own appraisal.');
    }

    const now = new Date().toISOString();
    const updated: StaffPerformanceReview = {
      ...existing,
      status: 'FINALIZED',
      finalizedAt: now,
      finalizedBy: actorUser.id,
      finalizedByName: actorUser.displayName || actorUser.email,
      version: existing.version + 1,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_PERF_REVIEWS_COL, reviewId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_PERFORMANCE_FINALIZED',
      resource: 'staff_performance_review',
      resourceId: reviewId,
      resourceName: `${existing.staffName} (Score: ${existing.ratingScore}/5)`,
      result: 'SUCCESS',
      newValue: updated
    });

    return updated;
  }

  static async getObjectives(tenantId: string, reviewId: string): Promise<StaffObjective[]> {
    const list = await FirebaseService.getTenantCollection<StaffObjective>(STAFF_OBJECTIVES_COL, tenantId);
    return list.filter((o) => o.reviewId === reviewId);
  }

  static async createObjective(
    tenantId: string,
    params: Omit<StaffObjective, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffObjective> {
    const id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const obj: StaffObjective = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };
    await FirebaseService.setDocument(STAFF_OBJECTIVES_COL, id, obj);
    return obj;
  }

  static async updateObjectiveStatus(
    tenantId: string,
    objId: string,
    status: ObjectiveStatus,
    actorUser: User
  ): Promise<StaffObjective> {
    const existing = await FirebaseService.getDocument<StaffObjective>(STAFF_OBJECTIVES_COL, objId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Objective not found');

    const updated: StaffObjective = {
      ...existing,
      status,
      completionDate: status === 'ACHIEVED' ? new Date().toISOString().split('T')[0] : existing.completionDate,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_OBJECTIVES_COL, objId, updated);
    return updated;
  }

  // =========================================================================
  // 10. COMPLIANCE & CREDENTIAL MONITORING
  // =========================================================================

  static async getComplianceRecords(
    tenantId: string,
    filters?: {
      staffId?: string;
      status?: ComplianceStatus;
    }
  ): Promise<StaffComplianceRecord[]> {
    const list = await FirebaseService.getTenantCollection<StaffComplianceRecord>(
      STAFF_COMPLIANCE_COL,
      tenantId
    );
    return list.filter((c) => {
      if (filters?.staffId && c.staffId !== filters.staffId) return false;
      if (filters?.status && c.status !== filters.status) return false;
      return true;
    });
  }

  static async auditStaffCompliance(tenantId: string, staffId: string): Promise<StaffComplianceRecord[]> {
    const staff = await this.getStaffById(tenantId, staffId);
    if (!staff) throw new Error('Staff record not found');

    const certs = await this.getCertifications(tenantId, staffId);
    const docs = await this.getStaffDocuments(tenantId, staffId);
    const trainings = await this.getTrainingAssignments(tenantId, staffId);

    const records: StaffComplianceRecord[] = [];
    const now = new Date();

    // 1. Check certifications expiry
    for (const cert of certs) {
      if (cert.expiryDate) {
        const exp = new Date(cert.expiryDate);
        const daysToExpiry = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let status: ComplianceStatus = 'COMPLIANT';
        if (daysToExpiry < 0) status = 'EXPIRED';
        else if (daysToExpiry <= 30) status = 'WARNING';

        const recId = `comp_cert_${cert.id}`;
        const rec: StaffComplianceRecord = {
          id: recId,
          tenantId,
          staffId,
          staffName: staff.fullName,
          department: staff.department,
          category: 'CERTIFICATION_EXPIRY',
          title: `Certification: ${cert.title}`,
          description: `Issued by ${cert.issuingOrganization}, expires on ${cert.expiryDate}`,
          status,
          expiryDate: cert.expiryDate,
          lastVerifiedAt: cert.verifiedAt,
          verifiedByName: cert.verifiedByName,
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.setDocument(STAFF_COMPLIANCE_COL, recId, rec);
        records.push(rec);
      }
    }

    // 2. Check Mandatory Document verification
    const idProof = docs.find((d) => d.documentCategory === 'IDENTITY_PROOF');
    const docRecId = `comp_doc_id_${staffId}`;
    const docRec: StaffComplianceRecord = {
      id: docRecId,
      tenantId,
      staffId,
      staffName: staff.fullName,
      department: staff.department,
      category: 'MANDATORY_DOCUMENT',
      title: 'Identity & Right to Work Verification',
      description: idProof ? `Verified file: ${idProof.fileName}` : 'No verified identity proof uploaded yet',
      status: idProof && idProof.verificationStatus === 'VERIFIED' ? 'COMPLIANT' : 'WARNING',
      dueDate: staff.probationEndDate || staff.joiningDate,
      lastVerifiedAt: idProof?.verifiedAt,
      verifiedByName: idProof?.verifiedByName,
      updatedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(STAFF_COMPLIANCE_COL, docRecId, docRec);
    records.push(docRec);

    return records;
  }

  static async updateComplianceRecord(
    tenantId: string,
    recordId: string,
    updates: Partial<StaffComplianceRecord>,
    actorUser: User
  ): Promise<StaffComplianceRecord> {
    const existing = await FirebaseService.getDocument<StaffComplianceRecord>(STAFF_COMPLIANCE_COL, recordId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Compliance record not found');

    const updated: StaffComplianceRecord = {
      ...existing,
      ...updates,
      verifiedBy: actorUser.id,
      verifiedByName: actorUser.displayName || actorUser.email,
      lastVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_COMPLIANCE_COL, recordId, updated);
    return updated;
  }

  // =========================================================================
  // 11. TRAINING & PROFESSIONAL DEVELOPMENT
  // =========================================================================

  static async getTrainingPrograms(tenantId: string): Promise<StaffTrainingProgram[]> {
    return FirebaseService.getTenantCollection<StaffTrainingProgram>(STAFF_TRAINING_PROGS_COL, tenantId);
  }

  static async createTrainingProgram(
    tenantId: string,
    params: Omit<StaffTrainingProgram, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffTrainingProgram> {
    const id = `tprog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const program: StaffTrainingProgram = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_TRAINING_PROGS_COL, id, program);
    return program;
  }

  static async getTrainingAssignments(
    tenantId: string,
    staffId?: string,
    programId?: string
  ): Promise<StaffTrainingAssignment[]> {
    const list = await FirebaseService.getTenantCollection<StaffTrainingAssignment>(
      STAFF_TRAINING_ASSIGNS_COL,
      tenantId
    );
    return list.filter((a) => {
      if (staffId && a.staffId !== staffId) return false;
      if (programId && a.programId !== programId) return false;
      return true;
    });
  }

  static async assignTraining(
    tenantId: string,
    params: Omit<StaffTrainingAssignment, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffTrainingAssignment> {
    const id = `tasgn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const assignment: StaffTrainingAssignment = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_TRAINING_ASSIGNS_COL, id, assignment);
    return assignment;
  }

  static async completeTraining(
    tenantId: string,
    assignmentId: string,
    scoreOrGrade?: string,
    certificateDocRef?: string
  ): Promise<StaffTrainingAssignment> {
    const existing = await FirebaseService.getDocument<StaffTrainingAssignment>(STAFF_TRAINING_ASSIGNS_COL, assignmentId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Training assignment not found');

    const now = new Date().toISOString();
    const updated: StaffTrainingAssignment = {
      ...existing,
      status: 'COMPLETED',
      completionDate: now.split('T')[0],
      scoreOrGrade: scoreOrGrade || 'PASS',
      certificateDocRef,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_TRAINING_ASSIGNS_COL, assignmentId, updated);
    return updated;
  }

  // =========================================================================
  // 12. HR CASES & GRIEVANCES
  // =========================================================================

  static async getHRCases(
    tenantId: string,
    filters?: {
      campusId?: string;
      status?: HRCaseStatus;
    }
  ): Promise<StaffHRCase[]> {
    const list = await FirebaseService.getTenantCollection<StaffHRCase>(
      STAFF_HR_CASES_COL,
      tenantId
    );
    return list.filter((c) => {
      if (filters?.campusId && c.campusId && c.campusId !== filters.campusId) return false;
      if (filters?.status && c.status !== filters.status) return false;
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async createHRCase(
    tenantId: string,
    params: Omit<StaffHRCase, 'id' | 'caseNumber' | 'version' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffHRCase> {
    const id = `hrc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();

    const existing = await FirebaseService.getTenantCollection<StaffHRCase>(STAFF_HR_CASES_COL, tenantId);
    const seq = (existing.length + 1).toString().padStart(3, '0');
    const caseNumber = `HRC-${currentYear}-${seq}`;

    const hrCase: StaffHRCase = {
      ...params,
      id,
      tenantId,
      caseNumber,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_HR_CASES_COL, id, hrCase);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_HR_CASE_LOGGED',
      resource: 'staff_hr_case',
      resourceId: id,
      resourceName: `${caseNumber}: ${hrCase.title}`,
      result: 'SUCCESS',
      newValue: hrCase
    });

    return hrCase;
  }

  static async updateHRCaseStatus(
    tenantId: string,
    caseId: string,
    status: HRCaseStatus,
    resolutionNotes?: string,
    actorUser?: User
  ): Promise<StaffHRCase> {
    const existing = await FirebaseService.getDocument<StaffHRCase>(STAFF_HR_CASES_COL, caseId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('HR case record not found');

    const now = new Date().toISOString();
    const updated: StaffHRCase = {
      ...existing,
      status,
      resolutionNotes: resolutionNotes || existing.resolutionNotes,
      resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? now : existing.resolvedAt,
      resolvedBy: status === 'RESOLVED' || status === 'CLOSED' ? actorUser?.id : existing.resolvedBy,
      resolvedByName: status === 'RESOLVED' || status === 'CLOSED' ? actorUser?.displayName || actorUser?.email : existing.resolvedByName,
      version: existing.version + 1,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_HR_CASES_COL, caseId, updated);
    return updated;
  }

  // =========================================================================
  // 13. STAFF EXIT & MULTI-DEPARTMENT CLEARANCE
  // =========================================================================

  static async getExitCases(tenantId: string, campusId?: string): Promise<StaffExitCase[]> {
    const list = await FirebaseService.getTenantCollection<StaffExitCase>(
      STAFF_EXIT_CASES_COL,
      tenantId
    );
    if (campusId) {
      return list.filter((e) => e.campusId === campusId);
    }
    return list;
  }

  static async initiateExitCase(
    tenantId: string,
    params: Omit<
      StaffExitCase,
      'id' | 'status' | 'overallClearanceStatus' | 'handoverCompleted' | 'version' | 'createdAt' | 'updatedAt'
    >,
    actorUser: User
  ): Promise<StaffExitCase> {
    const id = `exit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const exitCase: StaffExitCase = {
      ...params,
      id,
      tenantId,
      status: 'INITIATED',
      overallClearanceStatus: 'PENDING',
      handoverCompleted: false,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_EXIT_CASES_COL, id, exitCase);

    // Bootstrap standard clearance departments
    const requiredDepts: { key: ClearanceDepartment; name: string }[] = [
      { key: 'FINANCE', name: 'Finance & Accounts Ledger Settlement' },
      { key: 'LIBRARY', name: 'Library Book & Overdue Fine Clearance' },
      { key: 'IT_EQUIPMENT', name: 'IT Assets & Device Handover' },
      { key: 'ACADEMIC_RESOURCES', name: 'Academic Records & Teaching Materials' },
      { key: 'HR_RECORDS', name: 'HR File & Identity Card Surrender' }
    ];

    for (const d of requiredDepts) {
      const cItemId = `cl_${id}_${d.key}`;
      const cItem: StaffClearanceItem = {
        id: cItemId,
        tenantId,
        exitCaseId: id,
        staffId: params.staffId,
        departmentKey: d.key,
        departmentName: d.name,
        status: 'PENDING',
        updatedAt: now
      };
      await FirebaseService.setDocument(STAFF_CLEARANCE_ITEMS_COL, cItemId, cItem);
    }

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_EXIT_INITIATED',
      resource: 'staff_exit_case',
      resourceId: id,
      resourceName: `${exitCase.staffName} (${exitCase.exitType})`,
      result: 'SUCCESS',
      newValue: exitCase
    });

    return exitCase;
  }

  static async getClearanceItems(tenantId: string, exitCaseId: string): Promise<StaffClearanceItem[]> {
    const list = await FirebaseService.getTenantCollection<StaffClearanceItem>(STAFF_CLEARANCE_ITEMS_COL, tenantId);
    return list.filter((item) => item.exitCaseId === exitCaseId);
  }

  static async updateClearanceItem(
    tenantId: string,
    itemId: string,
    status: ClearanceStatus,
    remarks: string,
    actorUser: User
  ): Promise<StaffClearanceItem> {
    const existing = await FirebaseService.getDocument<StaffClearanceItem>(STAFF_CLEARANCE_ITEMS_COL, itemId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Clearance item not found');

    // Anti-self-clearance
    if (existing.staffId === actorUser.id) {
      throw new Error('Anti-Self-Clearance: You cannot sign off your own departmental clearance.');
    }

    const updated: StaffClearanceItem = {
      ...existing,
      status,
      remarks,
      clearedBy: actorUser.id,
      clearedByName: actorUser.displayName || actorUser.email,
      clearedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_CLEARANCE_ITEMS_COL, itemId, updated);

    // Check if all clearances are complete
    const allItems = await this.getClearanceItems(tenantId, existing.exitCaseId);
    const exitCase = await FirebaseService.getDocument<StaffExitCase>(STAFF_EXIT_CASES_COL, existing.exitCaseId);
    if (exitCase) {
      const allCleared = allItems.every((item) => item.id === itemId ? status === 'CLEARED' || status === 'WAIVED' : item.status === 'CLEARED' || item.status === 'WAIVED');
      const hasHold = allItems.some((item) => item.id === itemId ? status === 'HOLD' : item.status === 'HOLD');

      let overall: ClearanceStatus = 'PENDING';
      if (allCleared) overall = 'CLEARED';
      else if (hasHold) overall = 'HOLD';

      await FirebaseService.setDocument(STAFF_EXIT_CASES_COL, exitCase.id, {
        ...exitCase,
        overallClearanceStatus: overall,
        status: allCleared ? 'CLEARANCE_COMPLETED' : 'CLEARANCE_IN_PROGRESS',
        updatedAt: new Date().toISOString()
      });
    }

    return updated;
  }

  static async getHandoverRecords(tenantId: string, exitCaseId: string): Promise<StaffHandoverRecord[]> {
    const list = await FirebaseService.getTenantCollection<StaffHandoverRecord>(STAFF_HANDOVERS_COL, tenantId);
    return list.filter((h) => h.exitCaseId === exitCaseId);
  }

  static async addHandoverRecord(
    tenantId: string,
    params: Omit<StaffHandoverRecord, 'id' | 'createdAt'>,
    actorUser: User
  ): Promise<StaffHandoverRecord> {
    const id = `hnd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const record: StaffHandoverRecord = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_HANDOVERS_COL, id, record);
    return record;
  }

  static async finalizeStaffExit(
    tenantId: string,
    exitCaseId: string,
    actorUser: User
  ): Promise<StaffExitCase> {
    const existing = await FirebaseService.getDocument<StaffExitCase>(STAFF_EXIT_CASES_COL, exitCaseId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Exit case not found');

    if (existing.overallClearanceStatus !== 'CLEARED' && existing.overallClearanceStatus !== 'WAIVED') {
      throw new Error('Cannot finalize exit while departmental clearances are pending or blocked on hold.');
    }

    const now = new Date().toISOString();
    const updated: StaffExitCase = {
      ...existing,
      status: 'EXITED',
      approvedBy: actorUser.id,
      approvedByName: actorUser.displayName || actorUser.email,
      approvedAt: now,
      version: existing.version + 1,
      updatedAt: now
    };

    await FirebaseService.setDocument(STAFF_EXIT_CASES_COL, exitCaseId, updated);

    // Update staff profile status to EXITED
    await this.updateStaffStatus(tenantId, existing.staffId, 'EXITED', `Formal Exit Finalized via Case #${exitCaseId}`, actorUser);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'STAFF_EXIT_FINALIZED',
      resource: 'staff_exit_case',
      resourceId: exitCaseId,
      resourceName: existing.staffName,
      result: 'SUCCESS',
      newValue: updated
    });

    return updated;
  }

  // =========================================================================
  // 14. DEPARTMENTS & DESIGNATIONS
  // =========================================================================

  static async getDepartments(tenantId: string): Promise<StaffDepartment[]> {
    return FirebaseService.getTenantCollection<StaffDepartment>(STAFF_DEPARTMENTS_COL, tenantId);
  }

  static async createDepartment(
    tenantId: string,
    params: Omit<StaffDepartment, 'id' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<StaffDepartment> {
    const id = `dept_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const dept: StaffDepartment = {
      ...params,
      id,
      tenantId,
      createdAt: now,
      updatedAt: now
    };
    await FirebaseService.setDocument(STAFF_DEPARTMENTS_COL, id, dept);
    return dept;
  }

  static async getDesignations(tenantId: string): Promise<StaffDesignation[]> {
    return FirebaseService.getTenantCollection<StaffDesignation>(STAFF_DESIGNATIONS_COL, tenantId);
  }

  static async createDesignation(
    tenantId: string,
    params: Omit<StaffDesignation, 'id' | 'createdAt'>,
    actorUser: User
  ): Promise<StaffDesignation> {
    const id = `desig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const desig: StaffDesignation = {
      ...params,
      id,
      tenantId,
      createdAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(STAFF_DESIGNATIONS_COL, id, desig);
    return desig;
  }

  // =========================================================================
  // 15. WORKFORCE ANALYTICS PROJECTIONS
  // =========================================================================

  static async getAnalyticsSummary(tenantId: string, campusId?: string): Promise<StaffAnalyticsSummary> {
    const staffList = await this.getStaffList(tenantId, { campusId });
    const leaves = await this.getLeaveRequests(tenantId, { campusId });
    const workloads = await this.getWorkloadSnapshots(tenantId, campusId);
    const compliances = await this.getComplianceRecords(tenantId);
    const hrCases = await this.getHRCases(tenantId, { campusId, status: 'OPEN' });
    const exits = await this.getExitCases(tenantId, campusId);

    const totalStaff = staffList.length;
    const activeStaff = staffList.filter((s) => s.status === 'ACTIVE').length;
    const onLeaveStaff = staffList.filter((s) => s.status === 'ON_LEAVE').length;
    const probationStaff = staffList.filter((s) => s.employmentType === 'PROBATION').length;
    const exitedStaff = staffList.filter((s) => s.status === 'EXITED').length;

    const teachingCount = staffList.filter((s) => s.employmentCategory === 'TEACHING').length;
    const nonTeachingCount = totalStaff - teachingCount;

    const byDepartment: Record<string, number> = {};
    const byEmploymentType: Record<string, number> = {};

    for (const s of staffList) {
      byDepartment[s.department] = (byDepartment[s.department] || 0) + 1;
      byEmploymentType[s.employmentType] = (byEmploymentType[s.employmentType] || 0) + 1;
    }

    const overloadedCount = workloads.filter((w) => w.utilizationClassification === 'OVERLOADED').length;
    const compliantCount = compliances.filter((c) => c.status === 'COMPLIANT').length;
    const complianceRate = compliances.length > 0 ? Math.round((compliantCount / compliances.length) * 100) : 100;
    const expiringCerts = compliances.filter((c) => c.status === 'WARNING' || c.status === 'EXPIRED').length;

    const approvedLeavesCount = leaves.filter((l) => l.status === 'APPROVED').length;
    const leaveUtilizationRate = leaves.length > 0 ? Math.round((approvedLeavesCount / leaves.length) * 100) : 0;

    const summaryId = `analytics_${tenantId}_${campusId || 'all'}`;
    const summary: StaffAnalyticsSummary = {
      id: summaryId,
      tenantId,
      campusId,
      totalStaff,
      activeStaff,
      onLeaveStaff,
      probationStaff,
      exitedStaff,
      teachingCount,
      nonTeachingCount,
      byDepartment,
      byEmploymentType,
      leaveUtilizationRate,
      overloadedStaffCount: overloadedCount,
      complianceRate,
      expiringCertificationsCount: expiringCerts,
      openHRCasesCount: hrCases.length,
      activeExitsCount: exits.filter((e) => e.status !== 'EXITED' && e.status !== 'CANCELLED').length,
      calculatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(STAFF_ANALYTICS_CACHE_COL, summaryId, summary);
    return summary;
  }

  // =========================================================================
  // 16. SEED & INITIAL DEMO DATA INITIALIZATION
  // =========================================================================

  static async seedInitialStaffData(tenantId: string, campusId: string, actorUser: User): Promise<void> {
    const existing = await this.getStaffList(tenantId);
    if (existing.length > 0) return; // Already initialized

    // 1. Seed Departments
    const depts = [
      { code: 'D-SCI', name: 'Sciences & Mathematics', description: 'STEM Curriculum Faculty' },
      { code: 'D-HUM', name: 'Humanities & Languages', description: 'Literature, Social Sciences & Arts' },
      { code: 'D-ICT', name: 'Computer Science & ICT', description: 'Technology & Robotics Instructors' },
      { code: 'D-ADM', name: 'General Administration', description: 'Operations, Finance, & Admissions' },
      { code: 'D-SPT', name: 'Physical Education & Athletics', description: 'Sports & Wellness Coaches' }
    ];

    for (const d of depts) {
      await this.createDepartment(tenantId, { ...d, tenantId, status: 'ACTIVE', campusId }, actorUser);
    }

    // 2. Seed Leave Types
    const leaveTypes: Omit<StaffLeaveType, 'id'>[] = [
      {
        tenantId,
        code: 'CASUAL',
        name: 'Casual Leave',
        category: 'CASUAL',
        annualQuota: 12,
        carryForwardMax: 3,
        allowHalfDay: true,
        requiresProof: false,
        status: 'ACTIVE'
      },
      {
        tenantId,
        code: 'SICK',
        name: 'Medical / Sick Leave',
        category: 'SICK',
        annualQuota: 10,
        carryForwardMax: 5,
        allowHalfDay: true,
        requiresProof: true,
        status: 'ACTIVE'
      },
      {
        tenantId,
        code: 'EARNED',
        name: 'Earned / Annual Leave',
        category: 'EARNED',
        annualQuota: 18,
        carryForwardMax: 15,
        allowHalfDay: false,
        requiresProof: false,
        status: 'ACTIVE'
      },
      {
        tenantId,
        code: 'MATERNITY',
        name: 'Maternity Leave',
        category: 'MATERNITY',
        annualQuota: 180,
        carryForwardMax: 0,
        allowHalfDay: false,
        requiresProof: true,
        status: 'ACTIVE'
      }
    ];

    for (const lt of leaveTypes) {
      await this.createLeaveType(tenantId, lt, actorUser);
    }

    // 3. Seed Staff Members
    const seedStaff = [
      {
        fullName: 'Dr. Sarah Jenkins',
        preferredName: 'Sarah',
        email: 'sarah.jenkins@edutech.edu',
        phone: '+1 (555) 234-5678',
        joiningDate: '2022-06-15',
        employmentType: 'PERMANENT' as EmploymentType,
        employmentCategory: 'TEACHING' as EmploymentCategory,
        department: 'Sciences & Mathematics',
        designation: 'Senior Faculty & Head of Department',
        status: 'ACTIVE' as StaffStatus,
        employeeCode: 'BIO-101',
        gender: 'FEMALE' as const,
        customEmployeeNumber: 'EMP-2022-0001'
      },
      {
        fullName: 'Prof. Rajesh Kumar',
        preferredName: 'Rajesh',
        email: 'rajesh.kumar@edutech.edu',
        phone: '+1 (555) 345-6789',
        joiningDate: '2023-01-10',
        employmentType: 'PERMANENT' as EmploymentType,
        employmentCategory: 'TEACHING' as EmploymentCategory,
        department: 'Sciences & Mathematics',
        designation: 'Associate Professor of Physics',
        status: 'ACTIVE' as StaffStatus,
        employeeCode: 'PHY-204',
        gender: 'MALE' as const,
        customEmployeeNumber: 'EMP-2023-0012'
      },
      {
        fullName: 'Elena Rostova',
        preferredName: 'Elena',
        email: 'elena.rostova@edutech.edu',
        phone: '+1 (555) 456-7890',
        joiningDate: '2024-08-01',
        employmentType: 'PROBATION' as EmploymentType,
        employmentCategory: 'TEACHING' as EmploymentCategory,
        department: 'Humanities & Languages',
        designation: 'Lecturer in World Literature',
        status: 'ACTIVE' as StaffStatus,
        employeeCode: 'LIT-305',
        gender: 'FEMALE' as const,
        probationEndDate: '2025-02-01',
        customEmployeeNumber: 'EMP-2024-0045'
      },
      {
        fullName: 'Marcus Vance',
        preferredName: 'Marcus',
        email: 'marcus.vance@edutech.edu',
        phone: '+1 (555) 567-8901',
        joiningDate: '2021-04-12',
        employmentType: 'PERMANENT' as EmploymentType,
        employmentCategory: 'ADMINISTRATIVE' as EmploymentCategory,
        department: 'General Administration',
        designation: 'Senior Registrar & Operations Lead',
        status: 'ACTIVE' as StaffStatus,
        employeeCode: 'OPS-002',
        gender: 'MALE' as const,
        customEmployeeNumber: 'EMP-2021-0004'
      }
    ];

    for (const s of seedStaff) {
      const staff = await this.createStaff(
        tenantId,
        {
          ...s,
          tenantId,
          campusId
        },
        actorUser
      );

      // Initialize leave balances for academic year 2026-27
      await this.initializeLeaveBalances(tenantId, staff.id, 'ay_2026_27', staff.employmentCategory, actorUser);

      // Add seed qualification
      await this.addQualification(
        tenantId,
        {
          tenantId,
          staffId: staff.id,
          qualificationType: 'MASTERS',
          degreeTitle: s.employmentCategory === 'TEACHING' ? 'Master of Science (Education)' : 'Master of Business Administration',
          institution: 'State University',
          fieldOfStudy: s.department,
          yearOfPassing: 2018,
          gradeOrScore: 'A (Distinction)',
          verificationStatus: 'VERIFIED',
          verifiedBy: actorUser.id,
          verifiedByName: actorUser.displayName || actorUser.email,
          verifiedAt: new Date().toISOString()
        },
        actorUser
      );

      // Add seed certification
      await this.addCertification(
        tenantId,
        {
          tenantId,
          staffId: staff.id,
          title: 'National Board Teaching Certificate (NBTC Level 3)',
          issuingOrganization: 'Board of Secondary Education',
          issueDate: '2023-05-10',
          expiryDate: '2027-05-10',
          credentialId: `CERT-${staff.id.substring(6, 12).toUpperCase()}`,
          verificationStatus: 'VERIFIED',
          verifiedBy: actorUser.id,
          verifiedByName: actorUser.displayName || actorUser.email,
          verifiedAt: new Date().toISOString()
        },
        actorUser
      );

      // Calculate initial workload
      await this.calculateWorkloadForStaff(tenantId, campusId, staff.id);

      // Audit initial compliance
      await this.auditStaffCompliance(tenantId, staff.id);
    }

    // Seed Training Program
    await this.createTrainingProgram(
      tenantId,
      {
        tenantId,
        title: 'Modern Pedagogical Strategies & Digital Classroom Integration',
        description: 'Comprehensive 12-hour certification on active student engagement, AI-assisted rubric grading, and hybrid learning.',
        category: 'PEDAGOGY',
        deliveryMode: 'HYBRID',
        durationHours: 12,
        isMandatory: true,
        provider: 'National Educator Council',
        validityMonths: 24,
        status: 'ACTIVE'
      },
      actorUser
    );

    // Seed Performance Cycle
    await this.createPerformanceCycle(
      tenantId,
      {
        tenantId,
        title: 'Annual Faculty Appraisal Cycle 2026-2027',
        periodStart: '2026-04-01',
        periodEnd: '2027-03-31',
        academicYearId: 'ay_2026_27',
        status: 'ACTIVE'
      },
      actorUser
    );
  }
}
