import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import {
  Timetable,
  TimetableStatus,
  ScheduleEntry,
  TimetableVersion,
  ResourceBookingRequest,
  BookingStatus,
  SchedulingConflict,
  FacultySubstitution,
  ScheduleChangeRequest,
  ScheduleChangeStatus,
  CalendarException,
  WorkloadSnapshot,
  RoomUtilizationSnapshot,
  SchedulingAnalytics
} from '../types/scheduling';

const COLLECTIONS = {
  TIMETABLES: 'scheduling_timetables',
  TIMETABLE_VERSIONS: 'scheduling_timetable_versions',
  ENTRIES: 'scheduling_entries',
  BOOKINGS: 'scheduling_bookings',
  CONFLICTS: 'scheduling_conflicts',
  SUBSTITUTIONS: 'scheduling_substitutions',
  CHANGE_REQUESTS: 'scheduling_change_requests',
  CALENDAR_EXCEPTIONS: 'scheduling_calendar_exceptions'
};

export class SchedulingService {
  /**
   * Helper: Parse "HH:mm" time string into minutes from midnight
   */
  private static parseTimeToMinutes(timeStr: string): number {
    if (!timeStr || typeof timeStr !== 'string') return -1;
    const parts = timeStr.split(':');
    if (parts.length !== 2) return -1;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return -1;
    }
    return hours * 60 + minutes;
  }

  /**
   * Time validation helper
   */
  public static validateTimeSlot(startTime: string, endTime: string): { valid: boolean; reason?: string } {
    const startMins = this.parseTimeToMinutes(startTime);
    const endMins = this.parseTimeToMinutes(endTime);

    if (startMins === -1 || endMins === -1) {
      return { valid: false, reason: 'Invalid time format. Must be HH:mm (00:00 to 23:59).' };
    }

    if (endMins <= startMins) {
      return { valid: false, reason: 'End time must be strictly after start time.' };
    }

    const duration = endMins - startMins;
    if (duration <= 0 || isNaN(duration) || !isFinite(duration)) {
      return { valid: false, reason: 'Slot duration must be positive and finite.' };
    }

    return { valid: true };
  }

  /**
   * Timetable Lifecycle: DRAFT -> SUBMITTED_FOR_REVIEW -> UNDER_REVIEW -> APPROVED -> PUBLISHED -> ACTIVE -> SUPERSEDED -> ARCHIVED
   */
  private static isValidTimetableTransition(current: TimetableStatus, next: TimetableStatus): boolean {
    const allowed: Record<TimetableStatus, TimetableStatus[]> = {
      DRAFT: ['SUBMITTED_FOR_REVIEW', 'ARCHIVED'],
      SUBMITTED_FOR_REVIEW: ['UNDER_REVIEW', 'DRAFT', 'ARCHIVED'],
      UNDER_REVIEW: ['APPROVED', 'DRAFT', 'SUBMITTED_FOR_REVIEW'],
      APPROVED: ['PUBLISHED', 'DRAFT'],
      PUBLISHED: ['ACTIVE', 'SUPERSEDED'],
      ACTIVE: ['SUPERSEDED', 'ARCHIVED'],
      SUPERSEDED: ['ARCHIVED'],
      ARCHIVED: []
    };
    return allowed[current]?.includes(next) ?? false;
  }

  /**
   * Create new Timetable profile
   */
  static async createTimetable(
    data: Omit<Timetable, 'id' | 'status' | 'version' | 'isPublished' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorName: string,
    actorTenantId: string
  ): Promise<Timetable> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    const id = `tt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timetable: Timetable = {
      ...data,
      id,
      status: 'DRAFT',
      version: 1,
      isPublished: false,
      createdBy: actorId,
      createdByName: actorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.TIMETABLES, id, timetable);

    await AuditService.logAction(
      'TIMETABLE_CREATED',
      'scheduling_timetable',
      id,
      {
        tenantId: actorTenantId,
        resourceName: timetable.title,
        newValue: { title: timetable.title, code: timetable.code, status: timetable.status }
      }
    );

    return timetable;
  }

  /**
   * Submit Timetable for Review
   */
  static async submitTimetable(timetableId: string, actorId: string, actorTenantId: string): Promise<Timetable> {
    const timetable = await FirebaseService.getDocument<Timetable>(COLLECTIONS.TIMETABLES, timetableId);
    if (!timetable || timetable.tenantId !== actorTenantId) {
      throw new Error('Timetable not found or access denied.');
    }

    if (!this.isValidTimetableTransition(timetable.status, 'SUBMITTED_FOR_REVIEW')) {
      throw new Error(`Invalid transition from ${timetable.status} to SUBMITTED_FOR_REVIEW.`);
    }

    const updated: Timetable = {
      ...timetable,
      status: 'SUBMITTED_FOR_REVIEW',
      submittedAt: new Date().toISOString(),
      submittedBy: actorId,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.TIMETABLES, timetableId, updated);

    await AuditService.logAction(
      'TIMETABLE_SUBMITTED',
      'scheduling_timetable',
      timetableId,
      {
        tenantId: actorTenantId,
        resourceName: timetable.title,
        previousValue: { status: timetable.status },
        newValue: { status: updated.status }
      }
    );

    return updated;
  }

  /**
   * Approve Timetable with Separation of Duties (Creator cannot approve)
   */
  static async approveTimetable(timetableId: string, actorId: string, actorName: string, actorTenantId: string): Promise<Timetable> {
    const timetable = await FirebaseService.getDocument<Timetable>(COLLECTIONS.TIMETABLES, timetableId);
    if (!timetable || timetable.tenantId !== actorTenantId) {
      throw new Error('Timetable not found or access denied.');
    }

    // Separation of Duties check
    if (timetable.createdBy === actorId) {
      throw new Error('SEPARATION OF DUTIES VIOLATION: Timetable creator cannot approve their own timetable.');
    }

    if (!['SUBMITTED_FOR_REVIEW', 'UNDER_REVIEW'].includes(timetable.status)) {
      throw new Error(`Cannot approve timetable in state: ${timetable.status}`);
    }

    const updated: Timetable = {
      ...timetable,
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      approvedBy: actorId,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.TIMETABLES, timetableId, updated);

    await AuditService.logAction(
      'TIMETABLE_APPROVED',
      'scheduling_timetable',
      timetableId,
      {
        tenantId: actorTenantId,
        resourceName: timetable.title,
        previousValue: { status: timetable.status },
        newValue: { status: updated.status, approvedBy: actorId }
      }
    );

    return updated;
  }

  /**
   * Publish Timetable (Creates Immutable Version Snapshot)
   */
  static async publishTimetable(
    timetableId: string,
    changeSummary: string,
    actorId: string,
    actorName: string,
    actorTenantId: string
  ): Promise<Timetable> {
    const timetable = await FirebaseService.getDocument<Timetable>(COLLECTIONS.TIMETABLES, timetableId);
    if (!timetable || timetable.tenantId !== actorTenantId) {
      throw new Error('Timetable not found or access denied.');
    }

    if (timetable.status !== 'APPROVED') {
      throw new Error('Only APPROVED timetables can be published.');
    }

    // Fetch entries for snapshot
    const allEntries = await FirebaseService.getTenantCollection<ScheduleEntry>(COLLECTIONS.ENTRIES, actorTenantId);
    const entries = allEntries.filter(e => e.timetableId === timetableId);

    const versionNumber = (timetable.version || 1) + 1;

    // Snapshot
    const versionId = `ttv_${timetableId}_v${versionNumber}`;
    const versionSnapshot: TimetableVersion = {
      id: versionId,
      timetableId,
      tenantId: actorTenantId,
      campusId: timetable.campusId,
      versionNumber,
      snapshotData: {
        timetable,
        entries
      },
      changeSummary: changeSummary || 'Published release version',
      publishedBy: actorId,
      publishedByName: actorName,
      publishedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.TIMETABLE_VERSIONS, versionId, versionSnapshot);

    const updated: Timetable = {
      ...timetable,
      status: 'PUBLISHED',
      isPublished: true,
      version: versionNumber,
      publishedAt: new Date().toISOString(),
      publishedBy: actorId,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.TIMETABLES, timetableId, updated);

    await AuditService.logAction(
      'TIMETABLE_PUBLISHED',
      'scheduling_timetable',
      timetableId,
      {
        tenantId: actorTenantId,
        resourceName: timetable.title,
        newValue: { status: 'PUBLISHED', version: versionNumber }
      }
    );

    return updated;
  }

  /**
   * Add / Create Schedule Entry
   */
  static async createScheduleEntry(
    data: Omit<ScheduleEntry, 'id' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorTenantId: string
  ): Promise<ScheduleEntry> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    // Temporal validation
    const timeValidation = this.validateTimeSlot(data.slot.startTime, data.slot.endTime);
    if (!timeValidation.valid) {
      throw new Error(`Temporal Validation Failed: ${timeValidation.reason}`);
    }

    const id = `se_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const entry: ScheduleEntry = {
      ...data,
      id,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.ENTRIES, id, entry);

    // Run conflict detection automatically
    await this.detectAndRecordConflictsForEntry(entry, actorTenantId);

    await AuditService.logAction(
      'SCHEDULE_ENTRY_CREATED',
      'scheduling_entry',
      id,
      {
        tenantId: actorTenantId,
        resourceName: `${entry.subjectName} (${entry.className}-${entry.sectionName})`,
        newValue: { subject: entry.subjectName, teacher: entry.teacherName, room: entry.roomName }
      }
    );

    return entry;
  }

  /**
   * Deterministic Conflict Detection Engine
   */
  public static async detectAndRecordConflictsForEntry(
    targetEntry: ScheduleEntry,
    tenantId: string
  ): Promise<SchedulingConflict[]> {
    const detectedConflicts: SchedulingConflict[] = [];

    // Fetch all active entries for same day and tenant
    const tenantEntries = await FirebaseService.getTenantCollection<ScheduleEntry>(COLLECTIONS.ENTRIES, tenantId);
    const existingEntries = tenantEntries.filter(e => e.status === 'ACTIVE');

    const targetStart = this.parseTimeToMinutes(targetEntry.slot.startTime);
    const targetEnd = this.parseTimeToMinutes(targetEntry.slot.endTime);

    for (const entry of existingEntries) {
      if (entry.id === targetEntry.id) continue;
      if (entry.slot.dayOfWeek !== targetEntry.slot.dayOfWeek) continue;

      const eStart = this.parseTimeToMinutes(entry.slot.startTime);
      const eEnd = this.parseTimeToMinutes(entry.slot.endTime);

      // Check time overlap
      const hasTimeOverlap = targetStart < eEnd && targetEnd > eStart;
      if (!hasTimeOverlap) continue;

      // 1. Faculty conflict
      if (entry.teacherId === targetEntry.teacherId && entry.teacherId) {
        detectedConflicts.push({
          id: `cnf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          campusId: targetEntry.campusId,
          conflictType: 'FACULTY_DOUBLE_BOOKING',
          severity: 'CRITICAL',
          description: `Faculty ${targetEntry.teacherName} double booked at ${targetEntry.slot.startTime}-${targetEntry.slot.endTime} on ${targetEntry.slot.dayOfWeek}`,
          entityId1: targetEntry.id,
          entityType1: 'ScheduleEntry',
          entityId2: entry.id,
          entityType2: 'ScheduleEntry',
          affectedPersonId: targetEntry.teacherId,
          detectedAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }

      // 2. Room conflict
      if (entry.roomId === targetEntry.roomId && entry.roomId) {
        detectedConflicts.push({
          id: `cnf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          campusId: targetEntry.campusId,
          conflictType: 'ROOM_DOUBLE_BOOKING',
          severity: 'CRITICAL',
          description: `Room ${targetEntry.roomName} double booked at ${targetEntry.slot.startTime}-${targetEntry.slot.endTime} on ${targetEntry.slot.dayOfWeek}`,
          entityId1: targetEntry.id,
          entityType1: 'ScheduleEntry',
          entityId2: entry.id,
          entityType2: 'ScheduleEntry',
          affectedRoomId: targetEntry.roomId,
          detectedAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }

      // 3. Section conflict
      if (entry.sectionId === targetEntry.sectionId && entry.sectionId) {
        detectedConflicts.push({
          id: `cnf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          campusId: targetEntry.campusId,
          conflictType: 'SECTION_DOUBLE_BOOKING',
          severity: 'MAJOR',
          description: `Section ${targetEntry.className}-${targetEntry.sectionName} assigned two simultaneous subjects (${targetEntry.subjectName} and ${entry.subjectName})`,
          entityId1: targetEntry.id,
          entityType1: 'ScheduleEntry',
          entityId2: entry.id,
          entityType2: 'ScheduleEntry',
          affectedSectionId: targetEntry.sectionId,
          detectedAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }

      // 4. Lab conflict
      if (targetEntry.isLab && entry.isLab && entry.roomId === targetEntry.roomId) {
        detectedConflicts.push({
          id: `cnf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          campusId: targetEntry.campusId,
          conflictType: 'LABORATORY_OVERBOOKING',
          severity: 'CRITICAL',
          description: `Laboratory facility ${targetEntry.roomName} overbooked for lab session`,
          entityId1: targetEntry.id,
          entityType1: 'ScheduleEntry',
          entityId2: entry.id,
          entityType2: 'ScheduleEntry',
          affectedRoomId: targetEntry.roomId,
          detectedAt: new Date().toISOString(),
          status: 'OPEN'
        });
      }
    }

    // Save detected conflicts to database
    for (const conflict of detectedConflicts) {
      await FirebaseService.setDocument(COLLECTIONS.CONFLICTS, conflict.id, conflict);
      await AuditService.logAction(
        'SCHEDULING_CONFLICT_DETECTED',
        'scheduling_conflict',
        conflict.id,
        {
          tenantId,
          resourceName: conflict.conflictType,
          newValue: { type: conflict.conflictType, description: conflict.description }
        }
      );
    }

    return detectedConflicts;
  }

  /**
   * Resource Booking Request
   */
  static async requestResourceBooking(
    data: Omit<ResourceBookingRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorTenantId: string
  ): Promise<ResourceBookingRequest> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    const timeValidation = this.validateTimeSlot(data.startTime, data.endTime);
    if (!timeValidation.valid) {
      throw new Error(`Time Validation Error: ${timeValidation.reason}`);
    }

    const id = `rb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const booking: ResourceBookingRequest = {
      ...data,
      id,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.BOOKINGS, id, booking);

    await AuditService.logAction(
      'RESOURCE_BOOKING_REQUESTED',
      'scheduling_booking',
      id,
      {
        tenantId: actorTenantId,
        resourceName: `${booking.resourceName} for ${booking.purpose}`,
        newValue: { resource: booking.resourceName, date: booking.bookingDate, time: `${booking.startTime}-${booking.endTime}` }
      }
    );

    return booking;
  }

  /**
   * Approve Resource Booking (With SoD check: Requester cannot approve)
   */
  static async approveResourceBooking(
    bookingId: string,
    actorId: string,
    actorName: string,
    actorTenantId: string
  ): Promise<ResourceBookingRequest> {
    const booking = await FirebaseService.getDocument<ResourceBookingRequest>(COLLECTIONS.BOOKINGS, bookingId);
    if (!booking || booking.tenantId !== actorTenantId) {
      throw new Error('Booking not found or access denied.');
    }

    if (booking.requesterId === actorId) {
      throw new Error('SEPARATION OF DUTIES VIOLATION: Booking requester cannot approve their own booking.');
    }

    if (booking.status !== 'REQUESTED' && booking.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot approve booking in state: ${booking.status}`);
    }

    const updated: ResourceBookingRequest = {
      ...booking,
      status: 'APPROVED',
      approvedBy: actorId,
      approvedByName: actorName,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.BOOKINGS, bookingId, updated);

    await AuditService.logAction(
      'RESOURCE_BOOKING_APPROVED',
      'scheduling_booking',
      bookingId,
      {
        tenantId: actorTenantId,
        resourceName: booking.resourceName,
        previousValue: { status: booking.status },
        newValue: { status: 'APPROVED', approvedBy: actorId }
      }
    );

    return updated;
  }

  /**
   * Request Faculty Substitution
   */
  static async requestFacultySubstitution(
    data: Omit<FacultySubstitution, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorTenantId: string
  ): Promise<FacultySubstitution> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const substitution: FacultySubstitution = {
      ...data,
      id,
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.SUBSTITUTIONS, id, substitution);

    await AuditService.logAction(
      'FACULTY_SUBSTITUTION_REQUESTED',
      'scheduling_substitution',
      id,
      {
        tenantId: actorTenantId,
        resourceName: `Cover by ${substitution.substituteTeacherName} for ${substitution.originalTeacherName}`,
        newValue: { original: substitution.originalTeacherName, substitute: substitution.substituteTeacherName }
      }
    );

    return substitution;
  }

  /**
   * Approve Faculty Substitution
   */
  static async approveFacultySubstitution(
    substitutionId: string,
    actorId: string,
    actorName: string,
    actorTenantId: string
  ): Promise<FacultySubstitution> {
    const sub = await FirebaseService.getDocument<FacultySubstitution>(COLLECTIONS.SUBSTITUTIONS, substitutionId);
    if (!sub || sub.tenantId !== actorTenantId) {
      throw new Error('Substitution request not found or access denied.');
    }

    if (sub.requestedBy === actorId) {
      throw new Error('SEPARATION OF DUTIES VIOLATION: Requester cannot self-approve substitution.');
    }

    const updated: FacultySubstitution = {
      ...sub,
      status: 'APPROVED',
      approvedBy: actorId,
      approvedByName: actorName,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.SUBSTITUTIONS, substitutionId, updated);

    // Update schedule entry with substitute
    const entry = await FirebaseService.getDocument<ScheduleEntry>(COLLECTIONS.ENTRIES, sub.scheduleEntryId);
    if (entry) {
      await FirebaseService.setDocument(COLLECTIONS.ENTRIES, entry.id, {
        ...entry,
        substituteTeacherId: sub.substituteTeacherId,
        substituteTeacherName: sub.substituteTeacherName,
        status: 'SUBSTITUTED',
        updatedAt: new Date().toISOString()
      });
    }

    await AuditService.logAction(
      'FACULTY_SUBSTITUTION_APPROVED',
      'scheduling_substitution',
      substitutionId,
      {
        tenantId: actorTenantId,
        resourceName: sub.substituteTeacherName,
        newValue: { status: 'APPROVED' }
      }
    );

    return updated;
  }

  /**
   * Create Schedule Change Request
   */
  static async createScheduleChangeRequest(
    data: Omit<ScheduleChangeRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorTenantId: string
  ): Promise<ScheduleChangeRequest> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    const id = `scr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const changeReq: ScheduleChangeRequest = {
      ...data,
      id,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.CHANGE_REQUESTS, id, changeReq);

    await AuditService.logAction(
      'SCHEDULE_CHANGE_REQUESTED',
      'scheduling_change',
      id,
      {
        tenantId: actorTenantId,
        resourceName: changeReq.requestType,
        newValue: { reason: changeReq.reason, type: changeReq.requestType }
      }
    );

    return changeReq;
  }

  /**
   * Approve and Implement Schedule Change Request
   */
  static async approveScheduleChangeRequest(
    changeRequestId: string,
    actorId: string,
    actorName: string,
    actorTenantId: string
  ): Promise<ScheduleChangeRequest> {
    const req = await FirebaseService.getDocument<ScheduleChangeRequest>(COLLECTIONS.CHANGE_REQUESTS, changeRequestId);
    if (!req || req.tenantId !== actorTenantId) {
      throw new Error('Schedule change request not found or access denied.');
    }

    if (req.requestedBy === actorId) {
      throw new Error('SEPARATION OF DUTIES VIOLATION: Requester cannot approve their own schedule change.');
    }

    const updated: ScheduleChangeRequest = {
      ...req,
      status: 'IMPLEMENTED',
      reviewedBy: actorId,
      reviewedByName: actorName,
      reviewedAt: new Date().toISOString(),
      implementedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.CHANGE_REQUESTS, changeRequestId, updated);

    // Apply proposed changes to schedule entries
    for (const item of req.proposedChanges) {
      const existing = await FirebaseService.getDocument<ScheduleEntry>(COLLECTIONS.ENTRIES, item.entryId);
      if (existing) {
        await FirebaseService.setDocument(COLLECTIONS.ENTRIES, item.entryId, {
          ...existing,
          ...item.after,
          updatedAt: new Date().toISOString()
        });
      }
    }

    await AuditService.logAction(
      'SCHEDULE_CHANGE_IMPLEMENTED',
      'scheduling_change',
      changeRequestId,
      {
        tenantId: actorTenantId,
        resourceName: req.requestType,
        newValue: { status: 'IMPLEMENTED' }
      }
    );

    return updated;
  }

  /**
   * Create Calendar Exception
   */
  static async createCalendarException(
    data: Omit<CalendarException, 'id' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorTenantId: string
  ): Promise<CalendarException> {
    if (data.tenantId !== actorTenantId) {
      throw new Error('SECURITY VIOLATION: Tenant isolation mismatch.');
    }

    const id = `ce_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const exc: CalendarException = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(COLLECTIONS.CALENDAR_EXCEPTIONS, id, exc);

    await AuditService.logAction(
      'CALENDAR_EXCEPTION_CREATED',
      'scheduling_exception',
      id,
      {
        tenantId: actorTenantId,
        resourceName: exc.title,
        newValue: { title: exc.title, exceptionType: exc.exceptionType, dates: `${exc.startDate} to ${exc.endDate}` }
      }
    );

    return exc;
  }

  /**
   * Derived Workload Calculation (Rebuildable Projection)
   */
  static async calculateFacultyWorkload(tenantId: string): Promise<WorkloadSnapshot[]> {
    const tenantEntries = await FirebaseService.getTenantCollection<ScheduleEntry>(COLLECTIONS.ENTRIES, tenantId);
    const entries = tenantEntries.filter(e => e.status === 'ACTIVE');

    const map = new Map<string, { name: string; periods: number; contactHours: number; labHours: number }>();

    for (const entry of entries) {
      if (!entry.teacherId) continue;
      const existing = map.get(entry.teacherId) || {
        name: entry.teacherName || 'Faculty',
        periods: 0,
        contactHours: 0,
        labHours: 0
      };

      const start = this.parseTimeToMinutes(entry.slot.startTime);
      const end = this.parseTimeToMinutes(entry.slot.endTime);
      const hours = (end - start) / 60;

      existing.periods += 1;
      existing.contactHours += hours > 0 ? hours : 0.75;
      if (entry.isLab) {
        existing.labHours += hours > 0 ? hours : 0.75;
      }

      map.set(entry.teacherId, existing);
    }

    const snapshots: WorkloadSnapshot[] = [];
    for (const [teacherId, data] of map.entries()) {
      let status: 'BALANCED' | 'OVERLOAD' | 'UNDERLOAD' = 'BALANCED';
      if (data.periods > 25) status = 'OVERLOAD';
      else if (data.periods < 10) status = 'UNDERLOAD';

      snapshots.push({
        teacherId,
        teacherName: data.name,
        totalPeriods: data.periods,
        contactHours: Math.round(data.contactHours * 10) / 10,
        labHours: Math.round(data.labHours * 10) / 10,
        status
      });
    }

    return snapshots;
  }

  /**
   * Derived Room Utilization Analytics
   */
  static async calculateRoomUtilization(tenantId: string): Promise<RoomUtilizationSnapshot[]> {
    const tenantEntries = await FirebaseService.getTenantCollection<ScheduleEntry>(COLLECTIONS.ENTRIES, tenantId);
    const entries = tenantEntries.filter(e => e.status === 'ACTIVE');

    const map = new Map<string, { name: string; booked: number }>();

    for (const entry of entries) {
      if (!entry.roomId) continue;
      const existing = map.get(entry.roomId) || { name: entry.roomName || 'Room', booked: 0 };
      existing.booked += 1;
      map.set(entry.roomId, existing);
    }

    const maxWeeklySlots = 35; // 7 periods/day * 5 days
    const snapshots: RoomUtilizationSnapshot[] = [];

    for (const [roomId, data] of map.entries()) {
      const pct = Math.min(100, Math.round((data.booked / maxWeeklySlots) * 100));
      snapshots.push({
        roomId,
        roomName: data.name,
        totalSlotsAvailable: maxWeeklySlots,
        totalSlotsBooked: data.booked,
        utilizationPercentage: pct
      });
    }

    return snapshots;
  }

  /**
   * Comprehensive Scheduling Analytics
   */
  static async getSchedulingAnalytics(tenantId: string): Promise<SchedulingAnalytics> {
    const [timetables, bookings, conflicts, substitutions, changeReqs, exceptions] = await Promise.all([
      FirebaseService.getTenantCollection<Timetable>(COLLECTIONS.TIMETABLES, tenantId),
      FirebaseService.getTenantCollection<ResourceBookingRequest>(COLLECTIONS.BOOKINGS, tenantId),
      FirebaseService.getTenantCollection<SchedulingConflict>(COLLECTIONS.CONFLICTS, tenantId),
      FirebaseService.getTenantCollection<FacultySubstitution>(COLLECTIONS.SUBSTITUTIONS, tenantId),
      FirebaseService.getTenantCollection<ScheduleChangeRequest>(COLLECTIONS.CHANGE_REQUESTS, tenantId),
      FirebaseService.getTenantCollection<CalendarException>(COLLECTIONS.CALENDAR_EXCEPTIONS, tenantId)
    ]);

    const activeTimetablesCount = timetables.filter(t => t.status === 'ACTIVE' || t.status === 'PUBLISHED').length;
    const pendingApprovalsCount = timetables.filter(t => t.status === 'SUBMITTED_FOR_REVIEW' || t.status === 'UNDER_REVIEW').length;
    const unresolvedConflictsCount = conflicts.filter(c => c.status === 'OPEN').length;
    const resourceBookingsCount = bookings.length;
    const pendingSubstitutionsCount = substitutions.filter(s => s.status === 'PENDING_APPROVAL').length;
    const pendingChangesCount = changeReqs.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWED').length;

    const workloads = await this.calculateFacultyWorkload(tenantId);
    const avgWorkload = workloads.length > 0 
      ? Math.round((workloads.reduce((acc, w) => acc + w.contactHours, 0) / workloads.length) * 10) / 10 
      : 0;

    const roomUtil = await this.calculateRoomUtilization(tenantId);
    const avgRoomUtil = roomUtil.length > 0 
      ? Math.round(roomUtil.reduce((acc, r) => acc + r.utilizationPercentage, 0) / roomUtil.length) 
      : 0;

    return {
      activeTimetablesCount,
      pendingApprovalsCount,
      unresolvedConflictsCount,
      resourceBookingsCount,
      pendingSubstitutionsCount,
      pendingChangesCount,
      averageFacultyWorkloadHours: avgWorkload,
      averageRoomUtilizationPercentage: avgRoomUtil,
      calendarExceptionsCount: exceptions.length
    };
  }
}
