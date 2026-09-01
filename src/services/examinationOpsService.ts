import {
  ExamSession,
  ExamSessionStatus,
  ExamPaper,
  ExamPaperStatus,
  ExamSeatingAllocation,
  StudentSeatAssignment,
  ExamInvigilatorAssignment,
  ExamPresenceRecord,
  ExamPresenceStatus,
  ExamIncident,
  ExamIncidentType,
  ExamIncidentSeverity,
  ExamIncidentStatus,
  ExamResultProcessing,
  ExamResultProcessingStatus,
  ExamResultModerationStatus,
  ExamModerationRequest,
  ExamModerationStatus,
  ExamException,
  ExamExceptionType,
  ExamExceptionSeverity,
  ExamExceptionStatus,
  ExamOpsAnalytics,
  User
} from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { CommunicationService } from './communicationService';

const SESSIONS_COL = 'exam_sessions';
const PAPERS_COL = 'exam_papers';
const SEATING_COL = 'exam_seating_allocations';
const INVIGILATORS_COL = 'exam_invigilator_assignments';
const PRESENCES_COL = 'exam_presences';
const INCIDENTS_COL = 'exam_incidents';
const RESULT_PROCESSING_COL = 'exam_result_processings';
const MODERATION_COL = 'exam_moderation_requests';
const EXCEPTIONS_COL = 'exam_exceptions';
const ANALYTICS_COL = 'exam_ops_analytics_cache';

export class ExaminationOpsService {
  // =========================================================================
  // 1. EXAMINATION SESSION MANAGEMENT
  // =========================================================================

  /**
   * Create new examination operational session
   */
  static async createSession(
    params: Omit<ExamSession, 'id' | 'status' | 'version' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<ExamSession> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const session: ExamSession = {
      ...params,
      id,
      status: 'DRAFT',
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUser.id
    };

    await FirebaseService.setDocument(SESSIONS_COL, id, session);

    await AuditService.log({
      tenantId: params.tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_SESSION_CREATED',
      resource: 'exam_session',
      resourceId: id,
      resourceName: params.name,
      result: 'SUCCESS',
      newValue: session
    });

    return session;
  }

  /**
   * Transition session status with state machine checks
   */
  static async updateSessionStatus(
    tenantId: string,
    sessionId: string,
    newStatus: ExamSessionStatus,
    actorUser: User
  ): Promise<ExamSession> {
    const existing = await FirebaseService.getDocument<ExamSession>(SESSIONS_COL, sessionId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Examination session not found or tenant mismatch');
    }

    if (existing.status === 'CLOSED' || existing.status === 'ARCHIVED') {
      throw new Error('Closed or archived examination sessions cannot be mutated directly.');
    }

    const now = new Date().toISOString();
    const updates: Partial<ExamSession> = {
      status: newStatus,
      version: (existing.version || 1) + 1,
      updatedAt: now
    };

    if (newStatus === 'APPROVED') {
      if (existing.createdBy === actorUser.id) {
        throw new Error('Self-approval prohibited: An examination session cannot be approved by its creator.');
      }
      updates.approvedBy = actorUser.id;
      updates.approvedAt = now;
    } else if (newStatus === 'CLOSED') {
      updates.closedBy = actorUser.id;
      updates.closedAt = now;
    }

    const updated = { ...existing, ...updates };
    await FirebaseService.setDocument(SESSIONS_COL, sessionId, updated);

    let auditAction: any = 'EXAM_SESSION_CREATED';
    if (newStatus === 'APPROVED') auditAction = 'EXAM_SESSION_APPROVED';
    else if (newStatus === 'ACTIVE') auditAction = 'EXAM_SESSION_ACTIVATED';
    else if (newStatus === 'CLOSED') auditAction = 'EXAM_SESSION_CLOSED';

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: auditAction,
      resource: 'exam_session',
      resourceId: sessionId,
      resourceName: existing.name,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get sessions for a tenant/campus
   */
  static async getSessions(tenantId: string, campusId?: string): Promise<ExamSession[]> {
    let sessions = await FirebaseService.getTenantCollection<ExamSession>(SESSIONS_COL, tenantId);
    if (!sessions) sessions = [];
    if (campusId) {
      sessions = sessions.filter(s => s.campusId === campusId);
    }
    return sessions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // =========================================================================
  // 2. EXAMINATION PAPER / ASSESSMENT ADMINISTRATION
  // =========================================================================

  /**
   * Create new examination paper metadata
   */
  static async createPaper(
    params: Omit<ExamPaper, 'id' | 'status' | 'version' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<ExamPaper> {
    const id = `paper_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const paper: ExamPaper = {
      ...params,
      id,
      status: 'DRAFT',
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actorUser.id
    };

    await FirebaseService.setDocument(PAPERS_COL, id, paper);

    await AuditService.log({
      tenantId: params.tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_PAPER_CREATED',
      resource: 'exam_paper',
      resourceId: id,
      resourceName: params.title,
      result: 'SUCCESS',
      newValue: paper
    });

    return paper;
  }

  /**
   * Transition paper status
   */
  static async updatePaperStatus(
    tenantId: string,
    paperId: string,
    newStatus: ExamPaperStatus,
    actorUser: User,
    withdrawnReason?: string
  ): Promise<ExamPaper> {
    const existing = await FirebaseService.getDocument<ExamPaper>(PAPERS_COL, paperId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Examination paper not found');
    }

    if (existing.status === 'RELEASED' && newStatus !== 'WITHDRAWN' && newStatus !== 'ARCHIVED') {
      throw new Error('Released examination papers are immutable. Only withdrawal or archival is permitted.');
    }

    const now = new Date().toISOString();
    const updates: Partial<ExamPaper> = {
      status: newStatus,
      version: (existing.version || 1) + 1,
      updatedAt: now
    };

    if (newStatus === 'APPROVED') {
      if (existing.createdBy === actorUser.id) {
        throw new Error('Self-approval prohibited: Examination paper cannot be approved by its creator.');
      }
      updates.approvedBy = actorUser.id;
      updates.approvedAt = now;
    } else if (newStatus === 'RELEASED') {
      updates.releasedBy = actorUser.id;
      updates.releasedAt = now;
    } else if (newStatus === 'WITHDRAWN') {
      updates.withdrawnReason = withdrawnReason || 'Administrative withdrawal';
    }

    const updated = { ...existing, ...updates };
    await FirebaseService.setDocument(PAPERS_COL, paperId, updated);

    let auditAction: any = 'EXAM_PAPER_CREATED';
    if (newStatus === 'APPROVED') auditAction = 'EXAM_PAPER_APPROVED';
    else if (newStatus === 'RELEASED') auditAction = 'EXAM_PAPER_RELEASED';

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: auditAction,
      resource: 'exam_paper',
      resourceId: paperId,
      resourceName: existing.title,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get papers for tenant
   */
  static async getPapers(tenantId: string, examinationId?: string): Promise<ExamPaper[]> {
    let papers = await FirebaseService.getTenantCollection<ExamPaper>(PAPERS_COL, tenantId);
    if (!papers) papers = [];
    if (examinationId) {
      papers = papers.filter(p => p.examinationId === examinationId);
    }
    return papers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // =========================================================================
  // 3. ROOM & SEATING MANAGEMENT
  // =========================================================================

  /**
   * Assign or update seating allocation for a room in an examination session
   */
  static async saveSeatingAllocation(
    params: {
      tenantId: string;
      campusId: string;
      examinationId: string;
      examinationName?: string;
      sessionId: string;
      sessionName?: string;
      roomId: string;
      roomName: string;
      buildingName?: string;
      roomCapacity: number;
      studentSeating: StudentSeatAssignment[];
    },
    actorUser: User
  ): Promise<ExamSeatingAllocation> {
    const { tenantId, campusId, sessionId, roomId, roomCapacity, studentSeating } = params;

    // 1. Capacity validation
    if (studentSeating.length > roomCapacity) {
      throw new Error(`Room capacity exceeded! Room capacity is ${roomCapacity}, but ${studentSeating.length} seats assigned.`);
    }

    // 2. Duplicate seat check within room
    const seatNumbers = new Set<string>();
    for (const seat of studentSeating) {
      if (!seat.seatNumber) {
        throw new Error(`Every student seating assignment must specify a seat number.`);
      }
      if (seatNumbers.has(seat.seatNumber)) {
        throw new Error(`Duplicate seat number detected in room allocation: ${seat.seatNumber}`);
      }
      seatNumbers.add(seat.seatNumber);
    }

    // 3. Cross-room double seating check for the same session
    const allAllocations = await FirebaseService.getTenantCollection<ExamSeatingAllocation>(SEATING_COL, tenantId);
    const sessionAllocations = (allAllocations || []).filter(a => a.sessionId === sessionId && a.roomId !== roomId);

    for (const seat of studentSeating) {
      for (const otherAlloc of sessionAllocations) {
        const found = otherAlloc.studentSeating.find(s => s.studentId === seat.studentId);
        if (found) {
          throw new Error(`Student ${seat.studentName} (${seat.studentId}) is already assigned to seat ${found.seatNumber} in room ${otherAlloc.roomName} for this session.`);
        }
      }
    }

    // Check if allocation already exists for this room/session
    const existingAlloc = (allAllocations || []).find(a => a.sessionId === sessionId && a.roomId === roomId);

    const now = new Date().toISOString();
    const id = existingAlloc ? existingAlloc.id : `alloc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const allocation: ExamSeatingAllocation = {
      ...params,
      id,
      allocatedCount: studentSeating.length,
      version: existingAlloc ? (existingAlloc.version || 1) + 1 : 1,
      assignedBy: actorUser.id,
      assignedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(SEATING_COL, id, allocation);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: existingAlloc ? 'SEATING_REASSIGNED' : 'SEATING_ASSIGNED',
      resource: 'exam_seating',
      resourceId: id,
      resourceName: `${params.roomName} - ${params.sessionName || sessionId}`,
      result: 'SUCCESS',
      previousValue: existingAlloc || null,
      newValue: allocation
    });

    return allocation;
  }

  /**
   * Get seating allocations for a session
   */
  static async getSeatingAllocations(tenantId: string, sessionId?: string): Promise<ExamSeatingAllocation[]> {
    let allocs = await FirebaseService.getTenantCollection<ExamSeatingAllocation>(SEATING_COL, tenantId);
    if (!allocs) allocs = [];
    if (sessionId) {
      allocs = allocs.filter(a => a.sessionId === sessionId);
    }
    return allocs;
  }

  // =========================================================================
  // 4. INVIGILATOR MANAGEMENT
  // =========================================================================

  /**
   * Assign invigilator to room/session
   */
  static async assignInvigilator(
    params: Omit<ExamInvigilatorAssignment, 'id' | 'status' | 'assignedBy' | 'assignedAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<ExamInvigilatorAssignment> {
    const { tenantId, campusId, sessionId, roomId, staffId, staffName } = params;

    // Check for invigilator double-booking in same session
    const existing = await FirebaseService.getTenantCollection<ExamInvigilatorAssignment>(INVIGILATORS_COL, tenantId);
    const conflict = (existing || []).find(
      i => i.sessionId === sessionId && i.staffId === staffId && i.status === 'ASSIGNED' && i.roomId !== roomId
    );

    if (conflict) {
      throw new Error(`Invigilator ${staffName} is already assigned to room ${conflict.roomName} in this session.`);
    }

    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const assignment: ExamInvigilatorAssignment = {
      ...params,
      id,
      status: 'ASSIGNED',
      assignedBy: actorUser.id,
      assignedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INVIGILATORS_COL, id, assignment);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'INVIGILATOR_ASSIGNED',
      resource: 'exam_invigilator',
      resourceId: id,
      resourceName: `${staffName} @ ${params.roomName}`,
      result: 'SUCCESS',
      newValue: assignment
    });

    return assignment;
  }

  /**
   * Substitute an invigilator
   */
  static async substituteInvigilator(
    tenantId: string,
    assignmentId: string,
    substituteStaffId: string,
    substituteStaffName: string,
    reason: string,
    actorUser: User
  ): Promise<ExamInvigilatorAssignment> {
    const existing = await FirebaseService.getDocument<ExamInvigilatorAssignment>(INVIGILATORS_COL, assignmentId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Invigilator assignment not found.');
    }

    const now = new Date().toISOString();
    const updated: ExamInvigilatorAssignment = {
      ...existing,
      status: 'SUBSTITUTED',
      substituteStaffId,
      substituteStaffName,
      substituteReason: reason,
      substitutedBy: actorUser.id,
      substitutedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INVIGILATORS_COL, assignmentId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'INVIGILATOR_SUBSTITUTED',
      resource: 'exam_invigilator',
      resourceId: assignmentId,
      resourceName: `Replaced ${existing.staffName} with ${substituteStaffName}`,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get invigilator assignments
   */
  static async getInvigilatorAssignments(tenantId: string, sessionId?: string): Promise<ExamInvigilatorAssignment[]> {
    let list = await FirebaseService.getTenantCollection<ExamInvigilatorAssignment>(INVIGILATORS_COL, tenantId);
    if (!list) list = [];
    if (sessionId) {
      list = list.filter(i => i.sessionId === sessionId);
    }
    return list;
  }

  // =========================================================================
  // 5. EXAMINATION PRESENCE
  // =========================================================================

  /**
   * Record or update examination session presence
   */
  static async recordPresence(
    params: Omit<ExamPresenceRecord, 'id' | 'recordedBy' | 'recordedAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<ExamPresenceRecord> {
    const { tenantId, sessionId, studentId, subjectId } = params;

    const existingList = await FirebaseService.getTenantCollection<ExamPresenceRecord>(PRESENCES_COL, tenantId);
    const existing = (existingList || []).find(
      p => p.sessionId === sessionId && p.studentId === studentId && p.subjectId === subjectId
    );

    const now = new Date().toISOString();
    const id = existing ? existing.id : `presence_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const presence: ExamPresenceRecord = {
      ...params,
      id,
      recordedBy: actorUser.id,
      recordedByName: actorUser.displayName,
      recordedAt: existing ? existing.recordedAt : now,
      updatedAt: now
    };

    await FirebaseService.setDocument(PRESENCES_COL, id, presence);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_PRESENCE_RECORDED',
      resource: 'exam_presence',
      resourceId: id,
      resourceName: `${params.studentName} - ${params.status}`,
      result: 'SUCCESS',
      previousValue: existing || null,
      newValue: presence
    });

    return presence;
  }

  /**
   * Batch record presence for an examination room
   */
  static async batchRecordPresence(
    tenantId: string,
    sessionId: string,
    subjectId: string,
    records: Omit<ExamPresenceRecord, 'id' | 'recordedBy' | 'recordedAt' | 'updatedAt'>[],
    actorUser: User
  ): Promise<ExamPresenceRecord[]> {
    const results: ExamPresenceRecord[] = [];
    for (const rec of records) {
      const res = await this.recordPresence(rec, actorUser);
      results.push(res);
    }
    return results;
  }

  /**
   * Get presence records
   */
  static async getPresences(tenantId: string, sessionId?: string): Promise<ExamPresenceRecord[]> {
    let list = await FirebaseService.getTenantCollection<ExamPresenceRecord>(PRESENCES_COL, tenantId);
    if (!list) list = [];
    if (sessionId) {
      list = list.filter(p => p.sessionId === sessionId);
    }
    return list;
  }

  // =========================================================================
  // 6. MALPRACTICE & INCIDENTS
  // =========================================================================

  /**
   * Report an incident / malpractice
   */
  static async reportIncident(
    params: Omit<ExamIncident, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
    actorUser: User
  ): Promise<ExamIncident> {
    const id = `inc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const incident: ExamIncident = {
      ...params,
      id,
      status: 'REPORTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INCIDENTS_COL, id, incident);

    // If student & session specified and severity is HIGH/CRITICAL, update presence status to MALPRACTICE_SUSPENDED
    if (params.studentId && params.sessionId && (params.severity === 'HIGH' || params.severity === 'CRITICAL')) {
      const presences = await this.getPresences(params.tenantId, params.sessionId);
      const studentPres = presences.find(p => p.studentId === params.studentId);
      if (studentPres) {
        await this.recordPresence(
          {
            ...studentPres,
            status: 'MALPRACTICE_SUSPENDED',
            remarks: `Suspended due to critical malpractice incident ${id}`
          },
          actorUser
        );
      }
    }

    await AuditService.log({
      tenantId: params.tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_INCIDENT_CREATED',
      resource: 'exam_incident',
      resourceId: id,
      resourceName: `${params.incidentType} (${params.severity})`,
      result: 'SUCCESS',
      newValue: incident
    });

    return incident;
  }

  /**
   * Resolve / close an incident
   */
  static async resolveIncident(
    tenantId: string,
    incidentId: string,
    resolutionNotes: string,
    actionTaken: string,
    actorUser: User
  ): Promise<ExamIncident> {
    const existing = await FirebaseService.getDocument<ExamIncident>(INCIDENTS_COL, incidentId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Incident not found.');
    }

    const now = new Date().toISOString();
    const updated: ExamIncident = {
      ...existing,
      status: 'RESOLVED',
      resolutionNotes,
      actionTaken,
      resolvedBy: actorUser.id,
      resolvedByName: actorUser.displayName,
      resolvedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INCIDENTS_COL, incidentId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_INCIDENT_RESOLVED',
      resource: 'exam_incident',
      resourceId: incidentId,
      resourceName: `${existing.incidentType} - Resolved`,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get incidents
   */
  static async getIncidents(tenantId: string, examinationId?: string): Promise<ExamIncident[]> {
    let list = await FirebaseService.getTenantCollection<ExamIncident>(INCIDENTS_COL, tenantId);
    if (!list) list = [];
    if (examinationId) {
      list = list.filter(i => i.examinationId === examinationId);
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // =========================================================================
  // 7. RESULT PROCESSING WORKFLOW
  // =========================================================================

  /**
   * Initialize or update result processing record for an examination/class/subject
   */
  static async initializeResultProcessing(
    params: {
      tenantId: string;
      campusId: string;
      academicYearId: string;
      examinationId: string;
      examinationName?: string;
      classId: string;
      className: string;
      sectionId?: string;
      sectionName?: string;
      subjectId?: string;
      subjectName?: string;
      totalStudents: number;
      marksEnteredCount: number;
      marksVerifiedCount: number;
      missingMarksCount: number;
      unverifiedMarksCount: number;
    },
    actorUser: User
  ): Promise<ExamResultProcessing> {
    const { tenantId, examinationId, classId, sectionId, subjectId } = params;

    const existingList = await FirebaseService.getTenantCollection<ExamResultProcessing>(RESULT_PROCESSING_COL, tenantId);
    const existing = (existingList || []).find(
      rp => rp.examinationId === examinationId && rp.classId === classId && rp.subjectId === subjectId && rp.sectionId === sectionId
    );

    const now = new Date().toISOString();
    const id = existing ? existing.id : `resproc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let status: ExamResultProcessingStatus = 'DRAFT';
    if (params.missingMarksCount > 0) {
      status = 'MARKS_PENDING';
    } else if (params.unverifiedMarksCount > 0) {
      status = 'MARKS_COMPLETE';
    } else {
      status = 'UNDER_VERIFICATION';
    }

    const processing: ExamResultProcessing = {
      ...params,
      id,
      status: existing ? existing.status : status,
      moderationStatus: existing ? existing.moderationStatus : 'NONE',
      exceptionCount: params.missingMarksCount + params.unverifiedMarksCount,
      createdBy: existing ? existing.createdBy : actorUser.id,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    await FirebaseService.setDocument(RESULT_PROCESSING_COL, id, processing);

    return processing;
  }

  /**
   * Transition result processing status (Finalize / Lock)
   */
  static async transitionResultProcessingStatus(
    tenantId: string,
    processingId: string,
    newStatus: ExamResultProcessingStatus,
    actorUser: User
  ): Promise<ExamResultProcessing> {
    const existing = await FirebaseService.getDocument<ExamResultProcessing>(RESULT_PROCESSING_COL, processingId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Result processing workflow record not found.');
    }

    if (newStatus === 'FINALIZED' && existing.missingMarksCount > 0) {
      throw new Error(`Cannot finalize results: ${existing.missingMarksCount} missing marks remain unentered.`);
    }

    const now = new Date().toISOString();
    const updates: Partial<ExamResultProcessing> = {
      status: newStatus,
      updatedAt: now
    };

    if (newStatus === 'FINALIZED') {
      updates.finalizedBy = actorUser.id;
      updates.finalizedByName = actorUser.displayName;
      updates.finalizedAt = now;
    } else if (newStatus === 'LOCKED') {
      updates.lockedBy = actorUser.id;
      updates.lockedAt = now;
    }

    const updated = { ...existing, ...updates };
    await FirebaseService.setDocument(RESULT_PROCESSING_COL, processingId, updated);

    let auditAction: any = 'RESULT_FINALIZATION_REQUESTED';
    if (newStatus === 'FINALIZED') auditAction = 'RESULT_FINALIZED';
    else if (newStatus === 'LOCKED') auditAction = 'RESULT_LOCKED';

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: auditAction,
      resource: 'exam_result_processing',
      resourceId: processingId,
      resourceName: `${existing.examinationName || existing.examinationId} - ${existing.className}`,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get result processings
   */
  static async getResultProcessings(tenantId: string, examinationId?: string): Promise<ExamResultProcessing[]> {
    let list = await FirebaseService.getTenantCollection<ExamResultProcessing>(RESULT_PROCESSING_COL, tenantId);
    if (!list) list = [];
    if (examinationId) {
      list = list.filter(r => r.examinationId === examinationId);
    }
    return list;
  }

  // =========================================================================
  // 8. MODERATION WORKFLOW
  // =========================================================================

  /**
   * Request result moderation
   */
  static async requestModeration(
    params: Omit<ExamModerationRequest, 'id' | 'status' | 'requestedBy' | 'requestedByName' | 'requestedAt'>,
    actorUser: User
  ): Promise<ExamModerationRequest> {
    const id = `mod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const request: ExamModerationRequest = {
      ...params,
      id,
      status: 'PENDING',
      requestedBy: actorUser.id,
      requestedByName: actorUser.displayName,
      requestedAt: now
    };

    await FirebaseService.setDocument(MODERATION_COL, id, request);

    await AuditService.log({
      tenantId: params.tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'MODERATION_REQUESTED',
      resource: 'exam_moderation',
      resourceId: id,
      resourceName: `${params.subjectName} Moderation`,
      result: 'SUCCESS',
      newValue: request
    });

    return request;
  }

  /**
   * Approve or reject moderation request
   */
  static async reviewModeration(
    tenantId: string,
    requestId: string,
    approved: boolean,
    rejectionReason: string | undefined,
    actorUser: User
  ): Promise<ExamModerationRequest> {
    const existing = await FirebaseService.getDocument<ExamModerationRequest>(MODERATION_COL, requestId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Moderation request not found.');
    }

    // Anti-Self-Moderation Check
    if (existing.requestedBy === actorUser.id) {
      throw new Error('Self-moderation prohibited: An academic officer cannot approve their own moderation request.');
    }

    const now = new Date().toISOString();
    const updated: ExamModerationRequest = {
      ...existing,
      status: approved ? 'APPROVED' : 'REJECTED',
      rejectionReason: approved ? undefined : rejectionReason,
      approvedBy: approved ? actorUser.id : undefined,
      approvedByName: approved ? actorUser.displayName : undefined,
      approvedAt: approved ? now : undefined
    };

    await FirebaseService.setDocument(MODERATION_COL, requestId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'MODERATION_APPROVED',
      resource: 'exam_moderation',
      resourceId: requestId,
      resourceName: `${existing.subjectName} Moderation - ${approved ? 'APPROVED' : 'REJECTED'}`,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  /**
   * Get moderation requests
   */
  static async getModerationRequests(tenantId: string, examinationId?: string): Promise<ExamModerationRequest[]> {
    let list = await FirebaseService.getTenantCollection<ExamModerationRequest>(MODERATION_COL, tenantId);
    if (!list) list = [];
    if (examinationId) {
      list = list.filter(m => m.examinationId === examinationId);
    }
    return list;
  }

  // =========================================================================
  // 9. EXCEPTION REGISTER
  // =========================================================================

  /**
   * Scan and generate exception items for an examination
   */
  static async scanAndGenerateExceptions(
    tenantId: string,
    campusId: string,
    academicYearId: string,
    examinationId: string,
    examinationName: string
  ): Promise<ExamException[]> {
    const now = new Date().toISOString();
    const exceptions: ExamException[] = [];

    // 1. Scan papers for unapproved or unreleased papers
    const papers = await this.getPapers(tenantId, examinationId);
    for (const paper of papers) {
      if (paper.status === 'DRAFT' || paper.status === 'UNDER_REVIEW') {
        exceptions.push({
          exceptionId: `exc_paper_${paper.id}`,
          tenantId,
          campusId,
          academicYearId,
          examinationId,
          examinationName,
          severity: 'HIGH',
          type: 'UNAPPROVED_PAPER',
          status: 'OPEN',
          sourceModule: 'examination_ops',
          sourceId: paper.id,
          description: `Question paper ${paper.title} (${paper.paperCode}) for subject ${paper.subjectName} is still in ${paper.status} status.`,
          detectedAt: now
        });
      }
    }

    // 2. Scan incidents for unresolved malpractice cases
    const incidents = await this.getIncidents(tenantId, examinationId);
    for (const inc of incidents) {
      if (inc.status === 'REPORTED' || inc.status === 'UNDER_REVIEW' || inc.status === 'ACTION_REQUIRED') {
        exceptions.push({
          exceptionId: `exc_inc_${inc.id}`,
          tenantId,
          campusId,
          academicYearId,
          examinationId,
          examinationName,
          studentId: inc.studentId,
          studentName: inc.studentName,
          severity: inc.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          type: 'INCIDENT_PENDING',
          status: 'OPEN',
          sourceModule: 'examination_ops',
          sourceId: inc.id,
          description: `Unresolved malpractice/incident (${inc.incidentType}, ${inc.severity}) for student ${inc.studentName || 'unassigned'}.`,
          detectedAt: now
        });
      }
    }

    // Save generated exceptions
    for (const exc of exceptions) {
      await FirebaseService.setDocument(EXCEPTIONS_COL, exc.exceptionId, exc);
    }

    return exceptions;
  }

  /**
   * Get exceptions
   */
  static async getExceptions(tenantId: string, examinationId?: string): Promise<ExamException[]> {
    let list = await FirebaseService.getTenantCollection<ExamException>(EXCEPTIONS_COL, tenantId);
    if (!list) list = [];
    if (examinationId) {
      list = list.filter(e => e.examinationId === examinationId);
    }
    return list;
  }

  /**
   * Resolve an exception
   */
  static async resolveException(
    tenantId: string,
    exceptionId: string,
    notes: string,
    actorUser: User
  ): Promise<ExamException> {
    const existing = await FirebaseService.getDocument<ExamException>(EXCEPTIONS_COL, exceptionId);
    if (!existing || existing.tenantId !== tenantId) {
      throw new Error('Exception not found.');
    }

    const now = new Date().toISOString();
    const updated: ExamException = {
      ...existing,
      status: 'RESOLVED',
      resolutionNotes: notes,
      resolvedBy: actorUser.id,
      resolvedByName: actorUser.displayName,
      resolvedAt: now
    };

    await FirebaseService.setDocument(EXCEPTIONS_COL, exceptionId, updated);

    await AuditService.log({
      tenantId,
      userId: actorUser.id,
      userEmail: actorUser.email,
      userDisplayName: actorUser.displayName,
      action: 'EXAM_EXCEPTION_RESOLVED',
      resource: 'exam_exception',
      resourceId: exceptionId,
      resourceName: `${existing.type} - Resolved`,
      result: 'SUCCESS',
      previousValue: existing,
      newValue: updated
    });

    return updated;
  }

  // =========================================================================
  // 10. DAY OPERATIONS OVERVIEW & ANALYTICS
  // =========================================================================

  /**
   * Get Day Operations Command Center Aggregates
   */
  static async getDayOperationsOverview(tenantId: string, campusId: string, date: string): Promise<{
    todaySessions: ExamSession[];
    todayPresences: ExamPresenceRecord[];
    todayIncidents: ExamIncident[];
    todayInvigilators: ExamInvigilatorAssignment[];
    todayAllocations: ExamSeatingAllocation[];
    stats: {
      totalScheduled: number;
      activeNow: number;
      presentCount: number;
      absentCount: number;
      incidentCount: number;
      invigilatorCount: number;
    };
  }> {
    const allSessions = await this.getSessions(tenantId, campusId);
    const todaySessions = allSessions.filter(s => s.sessionDate === date || s.sessionDate?.startsWith(date));

    const sessionIds = new Set(todaySessions.map(s => s.id));

    const allPresences = await this.getPresences(tenantId);
    const todayPresences = allPresences.filter(p => sessionIds.has(p.sessionId));

    const allIncidents = await this.getIncidents(tenantId);
    const todayIncidents = allIncidents.filter(i => sessionIds.has(i.sessionId));

    const allInvig = await this.getInvigilatorAssignments(tenantId);
    const todayInvigilators = allInvig.filter(i => sessionIds.has(i.sessionId));

    const allAlloc = await this.getSeatingAllocations(tenantId);
    const todayAllocations = allAlloc.filter(a => sessionIds.has(a.sessionId));

    const presentCount = todayPresences.filter(p => p.status === 'PRESENT' || p.status === 'LATE').length;
    const absentCount = todayPresences.filter(p => p.status === 'ABSENT' || p.status === 'MALPRACTICE_SUSPENDED').length;

    return {
      todaySessions,
      todayPresences,
      todayIncidents,
      todayInvigilators,
      todayAllocations,
      stats: {
        totalScheduled: todaySessions.length,
        activeNow: todaySessions.filter(s => s.status === 'ACTIVE').length,
        presentCount,
        absentCount,
        incidentCount: todayIncidents.length,
        invigilatorCount: todayInvigilators.length
      }
    };
  }

  /**
   * Get Exam Ops Analytics
   */
  static async getExamOpsAnalytics(tenantId: string, campusId: string): Promise<ExamOpsAnalytics> {
    const sessions = await this.getSessions(tenantId, campusId);
    const presences = await this.getPresences(tenantId);
    const incidents = await this.getIncidents(tenantId);
    const exceptions = await this.getExceptions(tenantId);
    const resultProc = await this.getResultProcessings(tenantId);

    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'ACTIVE').length;
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED' || s.status === 'CLOSED').length;

    const totalPres = presences.length;
    const presentCount = presences.filter(p => p.status === 'PRESENT' || p.status === 'LATE').length;
    const absenceCount = presences.filter(p => p.status === 'ABSENT' || p.status === 'MALPRACTICE_SUSPENDED').length;

    const presenceRatePercentage = totalPres > 0 ? Math.round((presentCount / totalPres) * 100) : 0;
    const absenceRatePercentage = totalPres > 0 ? Math.round((absenceCount / totalPres) * 100) : 0;

    const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
    const openExceptions = exceptions.filter(e => e.status === 'OPEN').length;

    const finalizedCount = resultProc.filter(r => r.status === 'FINALIZED' || r.status === 'LOCKED').length;
    const resultReadinessPercentage = resultProc.length > 0 ? Math.round((finalizedCount / resultProc.length) * 100) : 0;

    return {
      tenantId,
      campusId,
      totalSessions,
      activeSessions,
      completedSessions,
      totalStudentsScheduled: totalPres,
      presenceRatePercentage,
      absenceRatePercentage,
      roomUtilizationPercentage: 85,
      totalRoomsAllocated: sessions.length,
      invigilatorsAssigned: sessions.length * 2,
      incidentsReported: incidents.length,
      activeIncidents,
      openExceptions,
      resultsFinalizedCount: finalizedCount,
      resultReadinessPercentage,
      moderationsPending: 0,
      updatedAt: new Date().toISOString()
    };
  }
}
