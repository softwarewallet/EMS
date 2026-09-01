import {
  StudentAttendanceRecord,
  StaffAttendanceRecord,
  AttendanceStatus,
  AttendanceSession,
  AttendanceSessionStatus,
  AttendanceCorrectionRecord,
  TenantAttendanceConfig,
  Student,
  StudentEnrollment,
  ClassGrade,
  Section,
  AcademicYear
} from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const STUDENT_ATTENDANCE_COL = 'student_attendance';
const STAFF_ATTENDANCE_COL = 'staff_attendance';
const ATTENDANCE_SESSIONS_COL = 'attendance_sessions';
const ATTENDANCE_CORRECTIONS_COL = 'attendance_corrections';
const ATTENDANCE_CONFIGS_COL = 'attendance_configs';
const STUDENTS_COL = 'students';
const ENROLLMENTS_COL = 'enrollments';
const CLASSES_COL = 'classes';
const SECTIONS_COL = 'sections';
const ACADEMIC_YEARS_COL = 'academic_years';

const DEFAULT_ATTENDANCE_CONFIG: Omit<TenantAttendanceConfig, 'tenantId' | 'updatedAt' | 'updatedBy'> = {
  dailyAttendanceRequired: true,
  periodAttendanceEnabled: false,
  schoolStartTime: '08:00',
  schoolEndTime: '15:00',
  lateThresholdMinutes: 15,
  gracePeriodMinutes: 5,
  autoLateOnThreshold: true,
  allowExcusedAbsence: true,
  allowLeaveStatus: true,
  requireCorrectionApproval: false,
  autoLockAfterHours: 24,
  lowAttendanceWarningThreshold: 75,
  lowAttendanceCriticalThreshold: 60,
  countLateAs: 'present',
  countExcusedAs: 'excused',
  countLeaveAs: 'leave'
};

export class AttendanceService {
  /**
   * Get or initialize tenant attendance policy configuration
   */
  static async getTenantConfig(tenantId: string): Promise<TenantAttendanceConfig> {
    const doc = await FirebaseService.getDocument<TenantAttendanceConfig>(ATTENDANCE_CONFIGS_COL, tenantId);
    if (doc) return doc;

    const initialConfig: TenantAttendanceConfig = {
      tenantId,
      ...DEFAULT_ATTENDANCE_CONFIG,
      updatedAt: new Date().toISOString(),
      updatedBy: 'SYSTEM'
    };

    await FirebaseService.setDocument(ATTENDANCE_CONFIGS_COL, tenantId, initialConfig);
    return initialConfig;
  }

  /**
   * Update tenant attendance configuration
   */
  static async updateTenantConfig(
    tenantId: string,
    config: Partial<TenantAttendanceConfig>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<TenantAttendanceConfig> {
    const current = await this.getTenantConfig(tenantId);
    const updated: TenantAttendanceConfig = {
      ...current,
      ...config,
      tenantId,
      updatedAt: new Date().toISOString(),
      updatedBy: user.displayName || user.email || user.id
    };

    await FirebaseService.setDocument(ATTENDANCE_CONFIGS_COL, tenantId, updated);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_CONFIG_UPDATED',
      resource: 'attendance',
      resourceId: tenantId,
      resourceName: 'Attendance Policy Config',
      previousValue: current,
      newValue: updated,
      result: 'SUCCESS',
      notes: 'Tenant attendance policy configuration updated'
    });

    return updated;
  }

  /**
   * Query attendance sessions with optional filters
   */
  static async getSessions(
    tenantId: string,
    filters?: {
      date?: string;
      classId?: string;
      sectionId?: string;
      academicYearId?: string;
      status?: AttendanceSessionStatus;
    }
  ): Promise<AttendanceSession[]> {
    const all = await FirebaseService.getTenantCollection<AttendanceSession>(ATTENDANCE_SESSIONS_COL, tenantId);
    return all
      .filter(sess => {
        if (filters?.date && sess.date !== filters.date) return false;
        if (filters?.classId && filters.classId !== 'ALL' && sess.classId !== filters.classId) return false;
        if (filters?.sectionId && filters.sectionId !== 'ALL' && sess.sectionId !== filters.sectionId) return false;
        if (filters?.academicYearId && filters.academicYearId !== 'ALL' && sess.academicYearId !== filters.academicYearId) return false;
        if (filters?.status && sess.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  /**
   * Get single session by ID
   */
  static async getSessionById(tenantId: string, sessionId: string): Promise<AttendanceSession | null> {
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session || session.tenantId !== tenantId) return null;
    return session;
  }

  /**
   * Get student attendance records for a specific session
   */
  static async getStudentAttendanceForSession(tenantId: string, sessionId: string): Promise<StudentAttendanceRecord[]> {
    const all = await FirebaseService.getTenantCollection<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, tenantId);
    return all.filter(r => r.attendanceSessionId === sessionId);
  }

  /**
   * Save class roster attendance directly (supports idempotent batch updates and security test verification)
   */
  static async saveClassRosterAttendance(
    records: Array<{
      tenantId: string;
      campusId?: string;
      date: string;
      academicYearId?: string;
      classId: string;
      sectionId: string;
      studentId: string;
      studentName: string;
      rollNumber?: string;
      status: AttendanceStatus;
      remarks?: string;
      reason?: string;
      recordedBy: string;
    }>,
    user: { userId: string; email: string; name?: string }
  ): Promise<void> {
    if (records.length === 0) return;
    const now = new Date().toISOString();

    for (const rec of records) {
      const sessionId = `att_sess_${rec.tenantId}_${rec.academicYearId || 'ay_current'}_${rec.classId}_${rec.sectionId}_${rec.date}`;
      const recordId = `att_rec_${rec.tenantId}_${sessionId}_${rec.studentId}`;

      const existing = await FirebaseService.getDocument<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, recordId);
      const updatedRec: StudentAttendanceRecord = {
        id: recordId,
        tenantId: rec.tenantId,
        campusId: rec.campusId || 'cmp_main',
        attendanceSessionId: sessionId,
        studentId: rec.studentId,
        enrollmentId: existing?.enrollmentId || rec.studentId,
        academicYearId: rec.academicYearId || 'ay_current',
        classId: rec.classId,
        sectionId: rec.sectionId,
        date: rec.date,
        sessionType: 'DAILY',
        studentName: rec.studentName,
        rollNumber: rec.rollNumber || '',
        admissionNumber: existing?.admissionNumber || '',
        status: rec.status,
        remarks: rec.remarks,
        reason: rec.reason,
        source: 'MANUAL',
        recordedBy: user.name || user.email || user.userId,
        recordedAt: now,
        locked: false,
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };

      await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, recordId, updatedRec);
    }
  }

  /**
   * Get student attendance records for a specific date and section (legacy + direct lookup)
   */
  static async getStudentAttendance(
    tenantId: string,
    date: string,
    classId?: string,
    sectionId?: string
  ): Promise<StudentAttendanceRecord[]> {
    const all = await FirebaseService.getTenantCollection<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, tenantId);
    return all.filter(rec => {
      if (rec.date !== date) return false;
      if (classId && classId !== 'ALL' && rec.classId !== classId) return false;
      if (sectionId && sectionId !== 'ALL' && rec.sectionId !== sectionId) return false;
      return true;
    });
  }

  /**
   * Fetch active students for a class and section
   * Cross-references authoritative Students and StudentEnrollments
   */
  static async getRosterForSection(
    tenantId: string,
    classId: string,
    sectionId: string,
    academicYearId?: string
  ): Promise<Array<{ student: Student; enrollment?: StudentEnrollment }>> {
    const [allStudents, allEnrollments] = await Promise.all([
      FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId),
      FirebaseService.getTenantCollection<StudentEnrollment>(ENROLLMENTS_COL, tenantId)
    ]);

    const activeStudents = allStudents.filter(s => {
      if (s.currentClassId !== classId) return false;
      if (sectionId && sectionId !== 'ALL' && s.currentSectionId !== sectionId) return false;
      const status = (s.status || 'ACTIVE').toUpperCase();
      return status === 'ACTIVE' || status === 'ENROLLED';
    });

    return activeStudents
      .map(student => {
        const enrollment = allEnrollments.find(e =>
          e.studentId === student.id &&
          e.classId === classId &&
          (sectionId === 'ALL' || e.sectionId === sectionId) &&
          (academicYearId ? e.academicYearId === academicYearId : true) &&
          e.status === 'ACTIVE'
        );
        return { student, enrollment };
      })
      .sort((a, b) => {
        const rollA = parseInt(a.student.rollNumber || '9999', 10);
        const rollB = parseInt(b.student.rollNumber || '9999', 10);
        if (rollA !== rollB) return rollA - rollB;
        return `${a.student.firstName} ${a.student.lastName}`.localeCompare(`${b.student.firstName} ${b.student.lastName}`);
      });
  }

  /**
   * Get or create daily attendance session for a class, section, and date
   */
  static async getOrCreateDailySession(
    params: {
      tenantId: string;
      campusId: string;
      academicYearId: string;
      classId: string;
      sectionId: string;
      date: string; // YYYY-MM-DD
      teacherId?: string;
      teacherName?: string;
    },
    user: { id: string; email: string; displayName?: string }
  ): Promise<{
    session: AttendanceSession;
    records: StudentAttendanceRecord[];
    isNew: boolean;
  }> {
    const { tenantId, campusId, academicYearId, classId, sectionId, date, teacherId, teacherName } = params;
    const sessionId = `att_sess_${tenantId}_${academicYearId}_${classId}_${sectionId}_${date}`;

    const existingSession = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);

    if (existingSession) {
      const existingRecords = await this.getStudentAttendanceForSession(tenantId, sessionId);
      return {
        session: existingSession,
        records: existingRecords,
        isNew: false
      };
    }

    // Fetch roster of active enrolled students
    const roster = await this.getRosterForSection(tenantId, classId, sectionId, academicYearId);
    const now = new Date().toISOString();

    const initialRecords: StudentAttendanceRecord[] = roster.map(({ student, enrollment }) => {
      const recordId = `att_rec_${tenantId}_${sessionId}_${student.id}`;
      return {
        id: recordId,
        tenantId,
        campusId,
        attendanceSessionId: sessionId,
        studentId: student.id,
        enrollmentId: enrollment?.id || student.id,
        academicYearId,
        classId,
        sectionId,
        date,
        sessionType: 'DAILY',
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        rollNumber: student.rollNumber || '',
        admissionNumber: student.studentIdNumber || '',
        status: 'present', // Default to present for quick roll-call workflow
        source: 'MANUAL',
        recordedBy: user.displayName || user.email || user.id,
        recordedAt: now,
        locked: false,
        createdAt: now,
        updatedAt: now
      };
    });

    const newSession: AttendanceSession = {
      id: sessionId,
      tenantId,
      campusId,
      academicYearId,
      classId,
      sectionId,
      date,
      sessionType: 'DAILY',
      teacherId: teacherId || user.id,
      teacherName: teacherName || user.displayName || user.email,
      status: 'DRAFT',
      openedAt: now,
      createdBy: user.id,
      totalEnrolled: roster.length,
      presentCount: roster.length,
      absentCount: 0,
      lateCount: 0,
      excusedCount: 0,
      leaveCount: 0,
      source: 'MANUAL',
      createdAt: now,
      updatedAt: now
    };

    // Save session and initial records
    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, newSession);
    for (const rec of initialRecords) {
      await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, rec.id, rec);
    }

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_SESSION_CREATED',
      resource: 'attendance',
      resourceId: sessionId,
      resourceName: `Daily Attendance for ${date} (Class ${classId}-${sectionId})`,
      newValue: newSession,
      result: 'SUCCESS',
      notes: `Session initialized with ${roster.length} students`
    });

    return {
      session: newSession,
      records: initialRecords,
      isNew: true
    };
  }

  /**
   * Save draft attendance for a session without locking or finalized submit
   */
  static async saveDraftAttendance(
    sessionId: string,
    items: Array<{
      studentId: string;
      status: AttendanceStatus;
      arrivalTime?: string;
      lateMinutes?: number;
      reason?: string;
      remarks?: string;
    }>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceSession> {
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session) throw new Error('Attendance session not found.');
    if (session.status === 'LOCKED') throw new Error('Cannot edit a locked attendance session.');

    const now = new Date().toISOString();
    const existingRecords = await this.getStudentAttendanceForSession(session.tenantId, sessionId);
    const recordsMap = new Map<string, StudentAttendanceRecord>(existingRecords.map(r => [r.studentId, r]));

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let leaveCount = 0;

    for (const item of items) {
      if (item.status === 'present') presentCount++;
      else if (item.status === 'absent') absentCount++;
      else if (item.status === 'late') lateCount++;
      else if (item.status === 'excused') excusedCount++;
      else if (item.status === 'leave') leaveCount++;

      const existing = recordsMap.get(item.studentId);
      if (existing) {
        const updatedRec: StudentAttendanceRecord = {
          ...existing,
          status: item.status,
          arrivalTime: item.arrivalTime || existing.arrivalTime,
          lateMinutes: item.lateMinutes !== undefined ? item.lateMinutes : existing.lateMinutes,
          reason: item.reason || existing.reason,
          remarks: item.remarks || existing.remarks,
          recordedBy: user.displayName || user.email || user.id,
          updatedAt: now
        };
        await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, existing.id, updatedRec);
      }
    }

    const updatedSession: AttendanceSession = {
      ...session,
      status: 'DRAFT',
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      leaveCount,
      totalEnrolled: items.length,
      updatedAt: now
    };

    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, updatedSession);
    return updatedSession;
  }

  /**
   * Submit finalized attendance session
   */
  static async submitAttendance(
    sessionId: string,
    items: Array<{
      studentId: string;
      status: AttendanceStatus;
      arrivalTime?: string;
      lateMinutes?: number;
      reason?: string;
      remarks?: string;
    }>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceSession> {
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session) throw new Error('Attendance session not found.');
    if (session.status === 'LOCKED') throw new Error('Cannot submit a locked attendance session.');

    const now = new Date().toISOString();
    const existingRecords = await this.getStudentAttendanceForSession(session.tenantId, sessionId);
    const recordsMap = new Map<string, StudentAttendanceRecord>(existingRecords.map(r => [r.studentId, r]));

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    let leaveCount = 0;

    for (const item of items) {
      if (item.status === 'present') presentCount++;
      else if (item.status === 'absent') absentCount++;
      else if (item.status === 'late') lateCount++;
      else if (item.status === 'excused') excusedCount++;
      else if (item.status === 'leave') leaveCount++;

      const existing = recordsMap.get(item.studentId);
      if (existing) {
        const updatedRec: StudentAttendanceRecord = {
          ...existing,
          status: item.status,
          arrivalTime: item.arrivalTime,
          lateMinutes: item.lateMinutes,
          reason: item.reason,
          remarks: item.remarks,
          recordedBy: user.displayName || user.email || user.id,
          recordedAt: now,
          updatedAt: now
        };
        await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, existing.id, updatedRec);
      }
    }

    const updatedSession: AttendanceSession = {
      ...session,
      status: 'SUBMITTED',
      submittedAt: now,
      submittedBy: user.displayName || user.email || user.id,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      leaveCount,
      totalEnrolled: items.length,
      updatedAt: now
    };

    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, updatedSession);

    await AuditService.log({
      tenantId: session.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_SUBMITTED',
      resource: 'attendance',
      resourceId: sessionId,
      resourceName: `Attendance Submitted (${session.date} Class ${session.classId}-${session.sectionId})`,
      newValue: {
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        leaveCount,
        totalEnrolled: items.length
      },
      result: 'SUCCESS',
      notes: `Roll call submitted: ${presentCount} present, ${absentCount} absent, ${lateCount} late`
    });

    return updatedSession;
  }

  /**
   * Lock attendance session to prevent further regular edits
   */
  static async lockAttendance(
    sessionId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceSession> {
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session) throw new Error('Attendance session not found.');

    const now = new Date().toISOString();
    const updatedSession: AttendanceSession = {
      ...session,
      status: 'LOCKED',
      lockedAt: now,
      lockedBy: user.displayName || user.email || user.id,
      updatedAt: now
    };

    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, updatedSession);

    // Lock individual records
    const records = await this.getStudentAttendanceForSession(session.tenantId, sessionId);
    for (const rec of records) {
      await FirebaseService.updateDocument(STUDENT_ATTENDANCE_COL, rec.id, {
        locked: true,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId: session.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_LOCKED',
      resource: 'attendance',
      resourceId: sessionId,
      resourceName: `Session Locked (${session.date})`,
      newValue: { status: 'LOCKED', lockedAt: now },
      result: 'SUCCESS',
      notes: `Attendance session locked by ${user.displayName || user.email}`
    });

    return updatedSession;
  }

  /**
   * Unlock attendance session with administrative authorization
   */
  static async unlockAttendance(
    sessionId: string,
    reason: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceSession> {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Administrative reason is required to unlock attendance.');
    }

    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session) throw new Error('Attendance session not found.');

    const now = new Date().toISOString();
    const updatedSession: AttendanceSession = {
      ...session,
      status: 'SUBMITTED',
      lockedAt: undefined,
      lockedBy: undefined,
      remarks: session.remarks ? `${session.remarks} | Unlocked: ${reason}` : `Unlocked: ${reason}`,
      updatedAt: now
    };

    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, updatedSession);

    const records = await this.getStudentAttendanceForSession(session.tenantId, sessionId);
    for (const rec of records) {
      await FirebaseService.updateDocument(STUDENT_ATTENDANCE_COL, rec.id, {
        locked: false,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId: session.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_UNLOCKED',
      resource: 'attendance',
      resourceId: sessionId,
      resourceName: `Session Unlocked (${session.date})`,
      previousValue: { status: 'LOCKED' },
      newValue: { status: 'SUBMITTED', reason },
      result: 'SUCCESS',
      notes: `Attendance unlocked by ${user.displayName || user.email}. Reason: ${reason}`
    });

    return updatedSession;
  }

  /**
   * Correct an individual student attendance record with full audit trail
   */
  static async correctAttendanceRecord(
    recordId: string,
    newStatus: AttendanceStatus,
    reason: string,
    user: { id: string; email: string; displayName?: string },
    arrivalTime?: string,
    lateMinutes?: number
  ): Promise<StudentAttendanceRecord> {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Justification reason is required for attendance corrections.');
    }

    const record = await FirebaseService.getDocument<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, recordId);
    if (!record) throw new Error('Attendance record not found.');

    const previousStatus = record.status;
    const now = new Date().toISOString();

    const updatedRecord: StudentAttendanceRecord = {
      ...record,
      status: newStatus,
      arrivalTime: arrivalTime !== undefined ? arrivalTime : record.arrivalTime,
      lateMinutes: lateMinutes !== undefined ? lateMinutes : record.lateMinutes,
      previousStatus,
      correctedBy: user.displayName || user.email || user.id,
      correctedAt: now,
      correctionReason: reason,
      updatedAt: now
    };

    await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, recordId, updatedRecord);

    // Save correction entry for permanent audit tracking
    const correctionId = FirebaseService.generateId('att_corr');
    const correctionEntry: AttendanceCorrectionRecord = {
      id: correctionId,
      tenantId: record.tenantId,
      attendanceRecordId: recordId,
      attendanceSessionId: record.attendanceSessionId,
      studentId: record.studentId,
      studentName: record.studentName,
      enrollmentId: record.enrollmentId,
      classId: record.classId,
      sectionId: record.sectionId,
      date: record.date,
      previousStatus,
      newStatus,
      reason,
      correctedByUserId: user.id,
      correctedByName: user.displayName || user.email || user.id,
      correctedAt: now,
      approvalStatus: 'APPROVED'
    };

    await FirebaseService.setDocument(ATTENDANCE_CORRECTIONS_COL, correctionId, correctionEntry);

    // Recalculate session counts
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, record.attendanceSessionId);
    if (session) {
      const records = await this.getStudentAttendanceForSession(session.tenantId, session.id);
      let p = 0, a = 0, l = 0, e = 0, lv = 0;
      for (const r of records) {
        if (r.status === 'present') p++;
        else if (r.status === 'absent') a++;
        else if (r.status === 'late') l++;
        else if (r.status === 'excused') e++;
        else if (r.status === 'leave') lv++;
      }
      await FirebaseService.updateDocument(ATTENDANCE_SESSIONS_COL, session.id, {
        presentCount: p,
        absentCount: a,
        lateCount: l,
        excusedCount: e,
        leaveCount: lv,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId: record.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'ATTENDANCE_CORRECTED',
      resource: 'attendance',
      resourceId: recordId,
      resourceName: `${record.studentName} (${record.date})`,
      previousValue: { status: previousStatus },
      newValue: { status: newStatus, reason, arrivalTime, lateMinutes },
      result: 'SUCCESS',
      notes: `Status changed from ${previousStatus} to ${newStatus}. Reason: ${reason}`
    });

    return updatedRecord;
  }

  /**
   * Declare a holiday or campus closure for a session
   */
  static async markSessionHolidayOrClosed(
    sessionId: string,
    type: 'HOLIDAY' | 'CLOSED',
    reason: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AttendanceSession> {
    const session = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
    if (!session) throw new Error('Attendance session not found.');

    const now = new Date().toISOString();
    const updatedSession: AttendanceSession = {
      ...session,
      status: 'SUBMITTED',
      isHoliday: type === 'HOLIDAY',
      isSchoolClosed: type === 'CLOSED',
      holidayReason: type === 'HOLIDAY' ? reason : undefined,
      closureReason: type === 'CLOSED' ? reason : undefined,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      excusedCount: session.totalEnrolled,
      leaveCount: 0,
      updatedAt: now
    };

    await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, updatedSession);

    const records = await this.getStudentAttendanceForSession(session.tenantId, sessionId);
    for (const rec of records) {
      await FirebaseService.updateDocument(STUDENT_ATTENDANCE_COL, rec.id, {
        status: 'excused',
        reason: `${type === 'HOLIDAY' ? 'Holiday' : 'School Closed'}: ${reason}`,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId: session.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: type === 'HOLIDAY' ? 'ATTENDANCE_HOLIDAY_DECLARED' : 'ATTENDANCE_CLOSURE_DECLARED',
      resource: 'attendance',
      resourceId: sessionId,
      resourceName: `${type} declared for ${session.date}`,
      newValue: { type, reason },
      result: 'SUCCESS',
      notes: `Declared ${type} on ${session.date}. Reason: ${reason}`
    });

    return updatedSession;
  }

  /**
   * Calculate cumulative student attendance history & percentages
   */
  static async getStudentAttendanceHistory(
    tenantId: string,
    studentId: string,
    academicYearId?: string
  ): Promise<{
    records: StudentAttendanceRecord[];
    metrics: {
      totalDays: number;
      present: number;
      absent: number;
      late: number;
      excused: number;
      leave: number;
      percentage: number;
    };
  }> {
    const all = await FirebaseService.getTenantCollection<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, tenantId);
    const config = await this.getTenantConfig(tenantId);

    const studentRecords = all
      .filter(r => {
        if (r.studentId !== studentId) return false;
        if (academicYearId && academicYearId !== 'ALL' && r.academicYearId !== academicYearId) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let leave = 0;

    for (const r of studentRecords) {
      if (r.status === 'present') present++;
      else if (r.status === 'absent') absent++;
      else if (r.status === 'late') late++;
      else if (r.status === 'excused') excused++;
      else if (r.status === 'leave') leave++;
      else if (r.status === 'half_day') present += 0.5;
    }

    const totalDays = studentRecords.length;
    let effectivePresent = present;
    if (config.countLateAs === 'present') effectivePresent += late;
    else if (config.countLateAs === 'half_day') effectivePresent += late * 0.5;

    let eligibleDays = totalDays;
    if (config.countExcusedAs === 'excused') eligibleDays -= excused;
    if (config.countLeaveAs === 'leave') eligibleDays -= leave;

    const percentage = eligibleDays > 0 ? Math.round((effectivePresent / eligibleDays) * 100) : 100;

    return {
      records: studentRecords,
      metrics: {
        totalDays,
        present,
        absent,
        late,
        excused,
        leave,
        percentage
      }
    };
  }

  /**
   * Find missing attendance for a given date across active classes & sections
   */
  static async getMissingAttendance(
    tenantId: string,
    date: string,
    academicYearId?: string
  ): Promise<Array<{
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    teacherName?: string;
    status: 'NOT_STARTED' | 'DRAFT';
    sessionId?: string;
  }>> {
    const [classes, sections, sessions] = await Promise.all([
      FirebaseService.getTenantCollection<ClassGrade>(CLASSES_COL, tenantId),
      FirebaseService.getTenantCollection<Section>(SECTIONS_COL, tenantId),
      FirebaseService.getTenantCollection<AttendanceSession>(ATTENDANCE_SESSIONS_COL, tenantId)
    ]);

    const dateSessions = sessions.filter(s =>
      s.date === date &&
      (academicYearId && academicYearId !== 'ALL' ? s.academicYearId === academicYearId : true)
    );

    const missing: Array<{
      classId: string;
      className: string;
      sectionId: string;
      sectionName: string;
      teacherName?: string;
      status: 'NOT_STARTED' | 'DRAFT';
      sessionId?: string;
    }> = [];

    for (const cls of classes) {
      const classSections = sections.filter(s => s.classId === cls.id);
      for (const sec of classSections) {
        const session = dateSessions.find(s => s.classId === cls.id && s.sectionId === sec.id);
        if (!session) {
          missing.push({
            classId: cls.id,
            className: cls.name,
            sectionId: sec.id,
            sectionName: sec.name,
            teacherName: sec.classTeacherId || undefined,
            status: 'NOT_STARTED'
          });
        } else if (session.status === 'DRAFT') {
          missing.push({
            classId: cls.id,
            className: cls.name,
            sectionId: sec.id,
            sectionName: sec.name,
            teacherName: session.teacherName,
            status: 'DRAFT',
            sessionId: session.id
          });
        }
      }
    }

    return missing;
  }

  /**
   * Get tenant-wide attendance metrics for a specific date
   */
  static async getAttendanceMetrics(
    tenantId: string,
    date: string,
    academicYearId?: string
  ): Promise<{
    totalEnrolled: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    leave: number;
    attendancePercentage: number;
    totalSessions: number;
    submittedSessions: number;
    lockedSessions: number;
    missingSessions: number;
  }> {
    const [sessions, missing] = await Promise.all([
      this.getSessions(tenantId, { date, academicYearId }),
      this.getMissingAttendance(tenantId, date, academicYearId)
    ]);

    let totalEnrolled = 0;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let leave = 0;
    let submittedSessions = 0;
    let lockedSessions = 0;

    for (const s of sessions) {
      totalEnrolled += s.totalEnrolled || 0;
      present += s.presentCount || 0;
      absent += s.absentCount || 0;
      late += s.lateCount || 0;
      excused += s.excusedCount || 0;
      leave += s.leaveCount || 0;

      if (s.status === 'SUBMITTED') submittedSessions++;
      else if (s.status === 'LOCKED') {
        submittedSessions++;
        lockedSessions++;
      }
    }

    const attendancePercentage = totalEnrolled > 0
      ? Math.round(((present + late) / totalEnrolled) * 100)
      : 0;

    return {
      totalEnrolled,
      present,
      absent,
      late,
      excused,
      leave,
      attendancePercentage,
      totalSessions: sessions.length + missing.filter(m => m.status === 'NOT_STARTED').length,
      submittedSessions,
      lockedSessions,
      missingSessions: missing.length
    };
  }

  /**
   * Identify students with low attendance (below warning or critical thresholds)
   */
  static async getLowAttendanceStudents(
    tenantId: string,
    threshold?: number,
    academicYearId?: string
  ): Promise<Array<{
    studentId: string;
    studentName: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
    isCritical: boolean;
  }>> {
    const [config, students, classes, sections, records] = await Promise.all([
      this.getTenantConfig(tenantId),
      FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId),
      FirebaseService.getTenantCollection<ClassGrade>(CLASSES_COL, tenantId),
      FirebaseService.getTenantCollection<Section>(SECTIONS_COL, tenantId),
      FirebaseService.getTenantCollection<StudentAttendanceRecord>(STUDENT_ATTENDANCE_COL, tenantId)
    ]);

    const cutoff = threshold !== undefined ? threshold : config.lowAttendanceWarningThreshold;
    const criticalCutoff = config.lowAttendanceCriticalThreshold;

    const classMap = new Map(classes.map(c => [c.id, c.name]));
    const sectionMap = new Map(sections.map(s => [s.id, s.name]));

    const results: Array<{
      studentId: string;
      studentName: string;
      admissionNumber: string;
      className: string;
      sectionName: string;
      totalDays: number;
      presentDays: number;
      absentDays: number;
      lateDays: number;
      percentage: number;
      isCritical: boolean;
    }> = [];

    const activeStudents = students.filter(s => {
      const st = (s.status || 'ACTIVE').toUpperCase();
      return st === 'ACTIVE' || st === 'ENROLLED';
    });

    for (const student of activeStudents) {
      const studentRecords = records.filter(r => {
        if (r.studentId !== student.id) return false;
        if (academicYearId && academicYearId !== 'ALL' && r.academicYearId !== academicYearId) return false;
        return true;
      });

      if (studentRecords.length === 0) continue;

      let p = 0, a = 0, l = 0, e = 0, lv = 0;
      for (const r of studentRecords) {
        if (r.status === 'present') p++;
        else if (r.status === 'absent') a++;
        else if (r.status === 'late') l++;
        else if (r.status === 'excused') e++;
        else if (r.status === 'leave') lv++;
      }

      const totalDays = studentRecords.length;
      let effectivePresent = p + l;
      const eligibleDays = totalDays - e - lv;
      const percentage = eligibleDays > 0 ? Math.round((effectivePresent / eligibleDays) * 100) : 100;

      if (percentage < cutoff) {
        results.push({
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`.trim(),
          admissionNumber: student.studentIdNumber || '',
          className: classMap.get(student.currentClassId) || student.currentClassId,
          sectionName: sectionMap.get(student.currentSectionId) || student.currentSectionId,
          totalDays,
          presentDays: p,
          absentDays: a,
          lateDays: l,
          percentage,
          isCritical: percentage < criticalCutoff
        });
      }
    }

    return results.sort((a, b) => a.percentage - b.percentage);
  }

  /**
   * Get attendance correction audit logs
   */
  static async getCorrectionAuditLogs(tenantId: string, limitCount = 50): Promise<AttendanceCorrectionRecord[]> {
    const all = await FirebaseService.getTenantCollection<AttendanceCorrectionRecord>(ATTENDANCE_CORRECTIONS_COL, tenantId);
    return all.sort((a, b) => b.correctedAt.localeCompare(a.correctedAt)).slice(0, limitCount);
  }

  /**
   * Staff Attendance methods
   */
  static async getStaffAttendance(tenantId: string, date: string): Promise<StaffAttendanceRecord[]> {
    const all = await FirebaseService.getTenantCollection<StaffAttendanceRecord>(STAFF_ATTENDANCE_COL, tenantId);
    return all.filter(rec => rec.date === date);
  }

  static async recordStaffAttendance(
    record: Omit<StaffAttendanceRecord, 'id' | 'recordedAt'>
  ): Promise<void> {
    const docId = `staff_att_${record.tenantId}_${record.date}_${record.userId}`;
    const fullRecord: StaffAttendanceRecord = {
      ...record,
      id: docId,
      recordedAt: new Date().toISOString()
    };
    await FirebaseService.setDocument(STAFF_ATTENDANCE_COL, docId, fullRecord);
  }

  /**
   * Seed realistic sample attendance history across 10 school days for rich experience
   */
  static async seedSyntheticDemoData(
    tenantId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<void> {
    const [classes, sections, students, academicYears] = await Promise.all([
      FirebaseService.getTenantCollection<ClassGrade>(CLASSES_COL, tenantId),
      FirebaseService.getTenantCollection<Section>(SECTIONS_COL, tenantId),
      FirebaseService.getTenantCollection<Student>(STUDENTS_COL, tenantId),
      FirebaseService.getTenantCollection<AcademicYear>(ACADEMIC_YEARS_COL, tenantId)
    ]);

    if (students.length === 0) return;

    const academicYearId = academicYears[0]?.id || 'ay_current';
    const now = new Date();

    // Generate dates for past 10 weekdays
    const dates: string[] = [];
    let d = new Date(now);
    while (dates.length < 10) {
      d.setDate(d.getDate() - 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) { // Skip weekends
        dates.push(d.toISOString().split('T')[0]);
      }
    }

    for (const dateStr of dates) {
      for (const cls of classes.slice(0, 3)) {
        const clsSections = sections.filter(s => s.classId === cls.id);
        for (const sec of clsSections.slice(0, 2)) {
          const clsStudents = students.filter(
            s => s.currentClassId === cls.id && s.currentSectionId === sec.id
          );

          if (clsStudents.length === 0) continue;

          const sessionId = `att_sess_${tenantId}_${academicYearId}_${cls.id}_${sec.id}_${dateStr}`;
          const existing = await FirebaseService.getDocument<AttendanceSession>(ATTENDANCE_SESSIONS_COL, sessionId);
          if (existing) continue;

          let presentCount = 0;
          let absentCount = 0;
          let lateCount = 0;
          let excusedCount = 0;

          const records: StudentAttendanceRecord[] = clsStudents.map((st, idx) => {
            // Realistic pseudo-random distribution: 85% present, 8% late, 5% absent, 2% excused
            const rand = ((idx * 17 + dateStr.charCodeAt(dateStr.length - 1) * 31) % 100);
            let status: AttendanceStatus = 'present';
            let arrivalTime: string | undefined = '07:55';
            let lateMinutes: number | undefined = undefined;
            let reason: string | undefined = undefined;

            if (rand > 95) {
              status = 'excused';
              reason = 'Doctor appointment';
              excusedCount++;
            } else if (rand > 90) {
              status = 'absent';
              reason = 'Unexcused illness';
              absentCount++;
            } else if (rand > 82) {
              status = 'late';
              arrivalTime = '08:22';
              lateMinutes = 22;
              reason = 'Bus delay';
              lateCount++;
            } else {
              status = 'present';
              presentCount++;
            }

            const recId = `att_rec_${tenantId}_${sessionId}_${st.id}`;
            return {
              id: recId,
              tenantId,
              campusId: st.campusId || 'main',
              attendanceSessionId: sessionId,
              studentId: st.id,
              enrollmentId: st.id,
              academicYearId,
              classId: cls.id,
              sectionId: sec.id,
              date: dateStr,
              sessionType: 'DAILY',
              studentName: `${st.firstName} ${st.lastName}`.trim(),
              rollNumber: st.rollNumber || `${idx + 1}`,
              admissionNumber: st.studentIdNumber || '',
              status,
              arrivalTime,
              lateMinutes,
              reason,
              source: 'MANUAL',
              recordedBy: user.displayName || user.email || 'Teacher',
              recordedAt: `${dateStr}T08:30:00Z`,
              locked: true,
              createdAt: `${dateStr}T08:30:00Z`,
              updatedAt: `${dateStr}T08:30:00Z`
            };
          });

          const session: AttendanceSession = {
            id: sessionId,
            tenantId,
            campusId: clsStudents[0]?.campusId || 'main',
            academicYearId,
            classId: cls.id,
            sectionId: sec.id,
            date: dateStr,
            sessionType: 'DAILY',
            teacherId: user.id,
            teacherName: user.displayName || user.email,
            status: 'LOCKED',
            openedAt: `${dateStr}T08:00:00Z`,
            submittedAt: `${dateStr}T08:30:00Z`,
            lockedAt: `${dateStr}T17:00:00Z`,
            createdBy: user.id,
            submittedBy: user.displayName || user.email,
            lockedBy: 'SYSTEM Auto-Lock',
            totalEnrolled: clsStudents.length,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            leaveCount: 0,
            source: 'MANUAL',
            createdAt: `${dateStr}T08:00:00Z`,
            updatedAt: `${dateStr}T17:00:00Z`
          };

          await FirebaseService.setDocument(ATTENDANCE_SESSIONS_COL, sessionId, session);
          for (const rec of records) {
            await FirebaseService.setDocument(STUDENT_ATTENDANCE_COL, rec.id, rec);
          }
        }
      }
    }
  }
}
