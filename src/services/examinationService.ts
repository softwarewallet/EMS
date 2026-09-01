import { 
  Examination, 
  ExaminationSchedule, 
  ExaminationEligibility, 
  AssessmentComponent,
  ScheduleConflict 
} from '../types/examination';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { AttendancePolicyService } from './attendancePolicyService';

const EXAMINATIONS_COL = 'examinations';
const SCHEDULES_COL = 'examination_schedules';
const ELIGIBILITY_COL = 'examination_eligibility';

export class ExaminationService {
  /**
   * Get all examinations for a tenant
   */
  static async getExaminations(tenantId: string, academicYearId?: string): Promise<Examination[]> {
    let exams = await FirebaseService.getTenantCollection<Examination>(EXAMINATIONS_COL, tenantId);
    if (!exams) exams = [];

    if (academicYearId) {
      exams = exams.filter(e => e.academicYearId === academicYearId);
    }
    return exams;
  }

  /**
   * Save or create examination
   */
  static async saveExamination(
    exam: Omit<Examination, 'examinationId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<Examination> {
    const examinationId = `exam_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    const newExam: Examination = {
      ...exam,
      examinationId,
      status: exam.status || 'DRAFT',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(EXAMINATIONS_COL, examinationId, newExam);

    await AuditService.log({
      tenantId: exam.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXAMINATION_CREATED',
      resource: 'examination' as any,
      resourceId: examinationId,
      resourceName: exam.name,
      newValue: newExam,
      result: 'SUCCESS'
    });

    return newExam;
  }

  /**
   * Update examination status (Approve, Publish, Cancel)
   */
  static async updateExaminationStatus(
    examinationId: string,
    tenantId: string,
    status: Examination['status'],
    user: { id: string; email: string; displayName?: string }
  ): Promise<Examination> {
    const exam = await FirebaseService.getDocument<Examination>(EXAMINATIONS_COL, examinationId);
    if (!exam) throw new Error('Examination not found');

    exam.status = status;
    exam.updatedAt = new Date().toISOString();

    if (status === 'APPROVED') {
      exam.approvedBy = user.displayName || user.email;
      exam.approvedAt = exam.updatedAt;
    } else if (status === 'PUBLISHED') {
      exam.publishedAt = exam.updatedAt;
    }

    await FirebaseService.setDocument(EXAMINATIONS_COL, examinationId, exam);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: status === 'PUBLISHED' ? 'EXAMINATION_PUBLISHED' : 'EXAMINATION_UPDATED',
      resource: 'examination' as any,
      resourceId: examinationId,
      resourceName: exam.name,
      newValue: exam,
      result: 'SUCCESS'
    });

    return exam;
  }

  /**
   * Get schedules for an examination or tenant
   */
  static async getSchedules(tenantId: string, examinationId?: string): Promise<ExaminationSchedule[]> {
    let schedules = await FirebaseService.getTenantCollection<ExaminationSchedule>(SCHEDULES_COL, tenantId);
    if (!schedules) schedules = [];

    if (examinationId) {
      schedules = schedules.filter(s => s.examinationId === examinationId);
    }
    return schedules;
  }

  /**
   * Schedule examination component with conflict validation
   */
  static async scheduleExamination(
    schedule: Omit<ExaminationSchedule, 'scheduleId'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<ExaminationSchedule> {
    const schedules = await this.getSchedules(schedule.tenantId);
    
    // Check for time/room/class overlap
    const conflict = schedules.find(s => 
      s.date === schedule.date &&
      s.classId === schedule.classId &&
      s.sectionId === schedule.sectionId &&
      ((s.startTime <= schedule.startTime && s.endTime > schedule.startTime) ||
       (s.startTime < schedule.endTime && s.endTime >= schedule.endTime))
    );

    if (conflict) {
      throw new Error(`Schedule conflict detected for Class/Section at ${schedule.date} between ${conflict.startTime}-${conflict.endTime}.`);
    }

    const scheduleId = `sch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newSchedule: ExaminationSchedule = {
      ...schedule,
      scheduleId
    };

    await FirebaseService.setDocument(SCHEDULES_COL, scheduleId, newSchedule);

    await AuditService.log({
      tenantId: schedule.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'EXAMINATION_SCHEDULED',
      resource: 'examination' as any,
      resourceId: scheduleId,
      resourceName: `Exam Schedule for ${schedule.date}`,
      newValue: newSchedule,
      result: 'SUCCESS'
    });

    return newSchedule;
  }

  /**
   * Generate student examination eligibility using Phase 7.2/7.3 attendance policy compliance
   */
  static async generateStudentEligibility(
    tenantId: string,
    examinationId: string,
    studentId: string,
    studentName: string,
    enrollmentId: string,
    academicYearId: string,
    classId: string,
    sectionId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<ExaminationEligibility> {
    const compliance = await AttendancePolicyService.evaluateStudentCompliance(
      tenantId,
      studentId,
      enrollmentId,
      academicYearId
    );

    const isCompliant = compliance.isCompliant;
    const status = isCompliant ? 'ELIGIBLE' : 'NOT_ELIGIBLE';

    const eligibilityId = `elig_${examinationId}_${studentId}`;
    const now = new Date().toISOString();

    const eligibility: ExaminationEligibility = {
      eligibilityId,
      examinationId,
      tenantId,
      studentId,
      studentName,
      enrollmentId,
      classId,
      sectionId,
      status,
      attendancePercentage: compliance.effectivePercentage,
      attendanceCompliant: isCompliant,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ELIGIBILITY_COL, eligibilityId, eligibility);
    return eligibility;
  }

  /**
   * Get student eligibility records
   */
  static async getEligibilityRecords(tenantId: string, examinationId?: string): Promise<ExaminationEligibility[]> {
    let records = await FirebaseService.getTenantCollection<ExaminationEligibility>(ELIGIBILITY_COL, tenantId);
    if (!records) records = [];

    if (examinationId) {
      records = records.filter(r => r.examinationId === examinationId);
    }
    return records;
  }
}
