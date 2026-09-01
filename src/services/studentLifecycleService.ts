import {
  StudentLifecycleState,
  StudentStatus,
  Student,
  StudentProgramEnrollment,
  StudentProgramChangeRequest,
  StudentAcademicStanding,
  StudentProfile,
  StudentContact,
  StudentEmergencyContact,
  StudentHold,
  StudentServiceCase,
  StudentServiceRequest,
  StudentAdvisingAssignment,
  StudentLeaveRequest,
  StudentSuspension,
  StudentWithdrawalRequest,
  StudentReactivationRequest,
  StudentTransferRequest,
  StudentGraduationStatus,
  StudentAuditEvent
} from '../types/studentLifecycle';

export class StudentLifecycleService {
  private static students: Student[] = [];
  private static programEnrollments: StudentProgramEnrollment[] = [];
  private static programChangeRequests: StudentProgramChangeRequest[] = [];
  private static academicStandings: StudentAcademicStanding[] = [];
  private static profiles: StudentProfile[] = [];
  private static contacts: StudentContact[] = [];
  private static emergencyContacts: StudentEmergencyContact[] = [];
  private static holds: StudentHold[] = [];
  private static serviceCases: StudentServiceCase[] = [];
  private static serviceRequests: StudentServiceRequest[] = [];
  private static advisingAssignments: StudentAdvisingAssignment[] = [];
  private static leaveRequests: StudentLeaveRequest[] = [];
  private static suspensions: StudentSuspension[] = [];
  private static withdrawalRequests: StudentWithdrawalRequest[] = [];
  private static reactivationRequests: StudentReactivationRequest[] = [];
  private static transferRequests: StudentTransferRequest[] = [];
  private static graduationStatuses: StudentGraduationStatus[] = [];
  private static auditEvents: StudentAuditEvent[] = [];

  static async generateStudentNumber(tenantId: string, startYear: string): Promise<string> {
    const count = this.students.filter(s => s.tenantId === tenantId).length + 1;
    return `${startYear}-STU-${count.toString().padStart(6, '0')}`;
  }

  static async createStudent(data: Omit<Student, 'studentId' | 'studentNumber' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    const studentId = `stu_${Date.now()}`;
    const studentNumber = await this.generateStudentNumber(data.tenantId, new Date().getFullYear().toString());
    const now = new Date().toISOString();

    const existing = this.students.find(s => s.applicantIdRef === data.applicantIdRef && s.tenantId === data.tenantId);
    if (existing && existing.applicantIdRef) {
      throw new Error('Student already exists for this applicant reference.');
    }

    const student: Student = {
      ...data,
      studentId,
      studentNumber,
      createdAt: now,
      updatedAt: now
    };
    this.students.push(student);
    return student;
  }

  static async updateStudent(studentId: string, updates: Partial<Student>): Promise<Student> {
    const student = this.students.find(s => s.studentId === studentId);
    if (!student) throw new Error('Student not found');
    
    Object.assign(student, updates, { updatedAt: new Date().toISOString() });
    return student;
  }

  static async getStudents(tenantId: string): Promise<Student[]> {
    return this.students.filter(s => s.tenantId === tenantId);
  }

  static validateStudentLifecycleTransition(current: StudentLifecycleState, target: StudentLifecycleState): boolean {
    const transitions: Record<StudentLifecycleState, StudentLifecycleState[]> = {
      PROSPECT_REFERENCE: ['ADMITTED', 'CANCELLED'],
      ADMITTED: ['ENROLLED', 'CANCELLED'],
      ENROLLED: ['ACTIVE', 'WITHDRAWN', 'CANCELLED'],
      ACTIVE: ['ON_LEAVE', 'SUSPENDED', 'WITHDRAWN', 'TRANSFERRED', 'COMPLETED', 'DECEASED'],
      ON_LEAVE: ['ACTIVE', 'WITHDRAWN', 'DECEASED'],
      SUSPENDED: ['ACTIVE', 'WITHDRAWN', 'DECEASED'],
      WITHDRAWN: ['ACTIVE'], // Through reactivation workflow
      TRANSFERRED: [],
      COMPLETED: ['GRADUATED'],
      GRADUATED: ['ALUMNI_REFERENCE'],
      ALUMNI_REFERENCE: ['DECEASED'],
      DECEASED: [],
      CANCELLED: []
    };
    return transitions[current]?.includes(target) || false;
  }

  static async changeStudentLifecycleState(studentId: string, newState: StudentLifecycleState, bypassFourEyes: boolean = false): Promise<Student> {
    const student = this.students.find(s => s.studentId === studentId);
    if (!student) throw new Error('Student not found');

    if (!this.validateStudentLifecycleTransition(student.lifecycleState, newState) && !bypassFourEyes) {
      throw new Error(`Invalid lifecycle transition from ${student.lifecycleState} to ${newState}`);
    }

    student.lifecycleState = newState;
    student.updatedAt = new Date().toISOString();
    return student;
  }

  static async createStudentProgramEnrollment(data: Omit<StudentProgramEnrollment, 'studentProgramEnrollmentId'>): Promise<StudentProgramEnrollment> {
    const existing = this.programEnrollments.find(pe => pe.studentIdRef === data.studentIdRef && pe.programIdRef === data.programIdRef && pe.status === 'ACTIVE');
    if (existing) {
      throw new Error('Duplicate active program enrollment for this student.');
    }
    const spe: StudentProgramEnrollment = {
      ...data,
      studentProgramEnrollmentId: `spe_${Date.now()}`
    };
    this.programEnrollments.push(spe);
    return spe;
  }

  static async getStudentProgramEnrollments(studentId: string): Promise<StudentProgramEnrollment[]> {
    return this.programEnrollments.filter(pe => pe.studentIdRef === studentId);
  }

  static async createStudentHold(data: Omit<StudentHold, 'holdId' | 'status'>): Promise<StudentHold> {
    const hold: StudentHold = {
      ...data,
      holdId: `hld_${Date.now()}`,
      status: 'ACTIVE'
    };
    this.holds.push(hold);
    return hold;
  }

  static async getStudentHolds(studentId: string): Promise<StudentHold[]> {
    return this.holds.filter(h => h.studentIdRef === studentId);
  }

  static async releaseStudentHold(holdId: string, releasedByUserId: string): Promise<StudentHold> {
    const hold = this.holds.find(h => h.holdId === holdId);
    if (!hold) throw new Error('Hold not found');
    if (hold.status !== 'ACTIVE') throw new Error('Hold is not active');

    hold.status = 'RELEASED';
    hold.releasedByUserIdRef = releasedByUserId;
    return hold;
  }

  static async createStudentServiceCase(data: Omit<StudentServiceCase, 'caseId' | 'status'>): Promise<StudentServiceCase> {
    const sc: StudentServiceCase = {
      ...data,
      caseId: `ssc_${Date.now()}`,
      status: 'OPEN'
    };
    this.serviceCases.push(sc);
    return sc;
  }

  static async getStudentServiceCases(studentId: string): Promise<StudentServiceCase[]> {
    return this.serviceCases.filter(sc => sc.studentIdRef === studentId);
  }

  static async createStudentLeaveRequest(data: Omit<StudentLeaveRequest, 'leaveId' | 'status'>): Promise<StudentLeaveRequest> {
    // Validate overlapping dates
    const overlapping = this.leaveRequests.find(lr => 
      lr.studentIdRef === data.studentIdRef && 
      lr.status === 'APPROVED' &&
      ((data.requestedStart >= lr.requestedStart && data.requestedStart <= lr.requestedEnd) ||
      (data.requestedEnd >= lr.requestedStart && data.requestedEnd <= lr.requestedEnd))
    );
    if (overlapping) throw new Error('Overlapping leave request exists.');

    const lr: StudentLeaveRequest = {
      ...data,
      leaveId: `slr_${Date.now()}`,
      status: 'DRAFT'
    };
    this.leaveRequests.push(lr);
    return lr;
  }

  static async approveStudentLeaveRequest(leaveId: string, approverUserId: string): Promise<StudentLeaveRequest> {
    const lr = this.leaveRequests.find(r => r.leaveId === leaveId);
    if (!lr) throw new Error('Leave request not found');
    lr.status = 'APPROVED';
    lr.approvedByUserIdRef = approverUserId;
    return lr;
  }
  
  static async createWithdrawalRequest(data: Omit<StudentWithdrawalRequest, 'withdrawalId' | 'status'>): Promise<StudentWithdrawalRequest> {
    const req: StudentWithdrawalRequest = {
      ...data,
      withdrawalId: `swr_${Date.now()}`,
      status: 'DRAFT'
    };
    this.withdrawalRequests.push(req);
    return req;
  }

  static async approveWithdrawal(withdrawalId: string, approverUserId: string, requesterUserId: string): Promise<StudentWithdrawalRequest> {
     const req = this.withdrawalRequests.find(r => r.withdrawalId === withdrawalId);
     if (!req) throw new Error('Withdrawal request not found');
     if (approverUserId === requesterUserId) throw new Error('Four-Eyes SoD: Requester cannot approve their own withdrawal.');
     req.status = 'APPROVED';
     req.approvedByUserIdRef = approverUserId;
     return req;
  }

  static async runDiagnostics() {
    const diagnostics: { severity: string; message: string; entityId?: string }[] = [];
    
    // Check for students without active primary program (unless they are withdrawn/completed)
    for (const student of this.students) {
      if (['ADMITTED', 'ENROLLED', 'ACTIVE', 'ON_LEAVE', 'SUSPENDED'].includes(student.lifecycleState)) {
        const enrollments = this.programEnrollments.filter(pe => pe.studentIdRef === student.studentId && pe.status === 'ACTIVE' && pe.enrollmentType === 'PRIMARY');
        if (enrollments.length === 0) {
          diagnostics.push({ severity: 'CRITICAL', message: `Active student has no primary program enrollment.`, entityId: student.studentId });
        }
        if (enrollments.length > 1) {
          diagnostics.push({ severity: 'CRITICAL', message: `Student has multiple active primary programs.`, entityId: student.studentId });
        }
      }
      
      if (student.lifecycleState === 'WITHDRAWN') {
        // Withdrawn student shouldn't have active primary program
        const enrollments = this.programEnrollments.filter(pe => pe.studentIdRef === student.studentId && pe.status === 'ACTIVE');
        if (enrollments.length > 0) {
          diagnostics.push({ severity: 'WARNING', message: `Withdrawn student still has active program enrollments.`, entityId: student.studentId });
        }
      }
    }

    if (diagnostics.length === 0) {
      diagnostics.push({ severity: 'INFORMATIONAL', message: 'All student lifecycle integrity checks passed cleanly.' });
    }

    return diagnostics;
  }

  static async generateAuditHash(tenantId: string, actor: string, action: string, entityType: string, entityId: string, timestamp: string, previousHash: string): Promise<string> {
    const payload = `${tenantId}:${actor}:${action}:${entityType}:${entityId}:${timestamp}:${previousHash}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
