import { AssessmentMark, SubjectResult, GradingPolicy } from '../types/marks';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const MARKS_COL = 'assessment_marks';
const RESULTS_COL = 'subject_results';
const GRADING_POLICIES_COL = 'grading_policies';

export class MarksService {
  /**
   * Get grading policies for tenant
   */
  static async getGradingPolicies(tenantId: string): Promise<GradingPolicy[]> {
    let policies = await FirebaseService.getTenantCollection<GradingPolicy>(GRADING_POLICIES_COL, tenantId);
    if (!policies || policies.length === 0) {
      const defaultPolicy: GradingPolicy = {
        policyId: `gp_${tenantId}_default`,
        tenantId,
        name: 'Standard Percentage & Letter Grade Policy',
        gradingSystem: 'LETTER_GRADE',
        gradeBands: [
          { minPercentage: 90, maxPercentage: 100, grade: 'A+', points: 10 },
          { minPercentage: 80, maxPercentage: 89.99, grade: 'A', points: 9 },
          { minPercentage: 70, maxPercentage: 79.99, grade: 'B+', points: 8 },
          { minPercentage: 60, maxPercentage: 69.99, grade: 'B', points: 7 },
          { minPercentage: 50, maxPercentage: 59.99, grade: 'C', points: 6 },
          { minPercentage: 40, maxPercentage: 49.99, grade: 'D', points: 5 },
          { minPercentage: 0, maxPercentage: 39.99, grade: 'F', points: 0 }
        ],
        passingPercentage: 40,
        roundingRules: 'ONE_DECIMAL',
        status: 'ACTIVE',
        version: '1.0'
      };
      await FirebaseService.setDocument(GRADING_POLICIES_COL, defaultPolicy.policyId, defaultPolicy);
      policies = [defaultPolicy];
    }
    return policies;
  }

  /**
   * Get marks records for an examination/component
   */
  static async getMarks(
    tenantId: string,
    examinationId?: string,
    componentId?: string,
    studentId?: string
  ): Promise<AssessmentMark[]> {
    let marks = await FirebaseService.getTenantCollection<AssessmentMark>(MARKS_COL, tenantId);
    if (!marks) marks = [];

    // Seed demo marks if empty
    if (marks.length === 0) {
      const demoMark: AssessmentMark = {
        markId: `mark_demo_1`,
        tenantId,
        academicYearId: 'ay_2027_28',
        examinationId: examinationId || `exam_${tenantId}_annual_2028`,
        componentId: componentId || 'comp_math_theory',
        studentId: 'std_demo_1',
        studentName: 'Demo Student',
        enrollmentId: 'enr_demo_1',
        classId: 'cls_demo',
        sectionId: 'sec_demo',
        subjectId: 'sub_math',
        maximumMarks: 80,
        passingMarks: 28,
        graceMarks: 0,
        moderationMarks: 0,
        obtainedMarks: 72,
        participationStatus: 'PRESENT',
        status: 'VERIFIED',
        enteredBy: 'Teacher Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(MARKS_COL, demoMark.markId, demoMark);
      marks = [demoMark];
    }

    if (examinationId) {
      marks = marks.filter(m => m.examinationId === examinationId);
    }
    if (componentId) {
      marks = marks.filter(m => m.componentId === componentId);
    }
    if (studentId) {
      marks = marks.filter(m => m.studentId === studentId);
    }

    return marks;
  }

  /**
   * Save individual mark record with validation
   */
  static async saveMark(
    mark: Omit<AssessmentMark, 'markId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AssessmentMark> {
    // Validation
    if (mark.obtainedMarks < 0 || mark.obtainedMarks > mark.maximumMarks) {
      throw new Error(`Invalid marks obtained (${mark.obtainedMarks}). Must be between 0 and ${mark.maximumMarks}.`);
    }

    const markId = `mark_${mark.examinationId}_${mark.componentId}_${mark.studentId}`;
    const existing = await FirebaseService.getDocument<AssessmentMark>(MARKS_COL, markId);
    
    if (existing && existing.status === 'LOCKED') {
      throw new Error('Marks record is locked and cannot be modified directly. Use correction workflow.');
    }

    const now = new Date().toISOString();
    const effectiveMarks = mark.obtainedMarks + (mark.graceMarks || 0) + (mark.moderationMarks || 0);

    const saved: AssessmentMark = {
      ...mark,
      markId,
      obtainedMarks: Math.min(mark.maximumMarks, effectiveMarks),
      status: mark.status || 'DRAFT',
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    await FirebaseService.setDocument(MARKS_COL, markId, saved);

    await AuditService.log({
      tenantId: mark.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: existing ? 'MARK_UPDATED' : ('MARK_CREATED' as any),
      resource: 'marks',
      resourceId: markId,
      resourceName: `Marks for student ${mark.studentId}`,
      newValue: saved,
      result: 'SUCCESS'
    });

    return saved;
  }

  /**
   * Bulk save marks
   */
  static async bulkSaveMarks(
    marksList: Omit<AssessmentMark, 'markId' | 'createdAt' | 'updatedAt'>[],
    user: { id: string; email: string; displayName?: string }
  ): Promise<number> {
    let savedCount = 0;
    for (const m of marksList) {
      await this.saveMark(m, user);
      savedCount++;
    }
    return savedCount;
  }

  /**
   * Verify marks batch
   */
  static async verifyMarks(
    tenantId: string,
    examinationId: string,
    componentId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<void> {
    const marks = await this.getMarks(tenantId, examinationId, componentId);
    const now = new Date().toISOString();

    for (const m of marks) {
      if (m.status === 'SUBMITTED' || m.status === 'DRAFT') {
        m.status = 'VERIFIED';
        m.verifiedBy = user.displayName || user.email;
        m.verifiedAt = now;
        m.updatedAt = now;
        await FirebaseService.setDocument(MARKS_COL, m.markId, m);
      }
    }

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'MARK_VERIFIED' as any,
      resource: 'marks',
      resourceId: `${examinationId}_${componentId}`,
      resourceName: 'Batch marks verification',
      result: 'SUCCESS'
    });
  }

  /**
   * Lock marks batch
   */
  static async lockMarks(
    tenantId: string,
    examinationId: string,
    componentId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<void> {
    const marks = await this.getMarks(tenantId, examinationId, componentId);
    const now = new Date().toISOString();

    for (const m of marks) {
      m.status = 'LOCKED';
      m.approvedBy = user.displayName || user.email;
      m.approvedAt = now;
      m.lockedAt = now;
      m.updatedAt = now;
      await FirebaseService.setDocument(MARKS_COL, m.markId, m);
    }

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'MARK_LOCKED',
      resource: 'marks',
      resourceId: `${examinationId}_${componentId}`,
      resourceName: 'Batch marks locked',
      result: 'SUCCESS'
    });
  }

  /**
   * Calculate Subject Result for student
   */
  static async calculateSubjectResult(
    tenantId: string,
    examinationId: string,
    studentId: string,
    enrollmentId: string,
    subjectId: string,
    subjectName: string
  ): Promise<SubjectResult> {
    const allMarks = await this.getMarks(tenantId, examinationId, undefined, studentId);
    const subjectMarks = allMarks.filter(m => m.subjectId === subjectId);

    let totalMax = 0;
    let totalObt = 0;

    for (const m of subjectMarks) {
      totalMax += m.maximumMarks;
      totalObt += m.obtainedMarks;
    }

    const percentage = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(1)) : 0;
    const policies = await this.getGradingPolicies(tenantId);
    const policy = policies[0];

    let assignedGrade = 'F';
    let gradePoints = 0;
    for (const band of policy.gradeBands) {
      if (percentage >= band.minPercentage && percentage <= band.maxPercentage) {
        assignedGrade = band.grade;
        gradePoints = band.points || 0;
        break;
      }
    }

    const resultStatus = percentage >= policy.passingPercentage ? 'PASS' : 'FAIL';
    const resultId = `res_${examinationId}_${studentId}_${subjectId}`;
    const now = new Date().toISOString();

    const subjectResult: SubjectResult = {
      resultId,
      tenantId,
      academicYearId: subjectMarks[0]?.academicYearId || 'ay_2027_28',
      examinationId,
      studentId,
      enrollmentId,
      subjectId,
      subjectName,
      totalMaximumMarks: totalMax || 100,
      totalObtainedMarks: totalObt || 0,
      percentage,
      grade: assignedGrade,
      gradePoints,
      resultStatus,
      gradingPolicyVersion: policy.version,
      calculatedAt: now
    };

    await FirebaseService.setDocument(RESULTS_COL, resultId, subjectResult);
    return subjectResult;
  }
}
