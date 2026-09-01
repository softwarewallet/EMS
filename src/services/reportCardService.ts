import { ReportCard, AcademicTranscript, ReportCardSubjectRow } from '../types/reportCard';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { MarksService } from './marksService';

const REPORT_CARDS_COL = 'report_cards';
const TRANSCRIPTS_COL = 'academic_transcripts';

export class ReportCardService {
  /**
   * Get all report cards for a tenant
   */
  static async getReportCards(tenantId: string, studentId?: string): Promise<ReportCard[]> {
    let list = await FirebaseService.getTenantCollection<ReportCard>(REPORT_CARDS_COL, tenantId);
    if (!list) list = [];

    // Seed demo report card if empty
    if (list.length === 0) {
      const demoRc: ReportCard = {
        reportCardId: `rc_demo_1`,
        tenantId,
        academicYearId: 'ay_2027_28',
        studentId: 'std_demo_1',
        studentName: 'Demo Student',
        enrollmentId: 'enr_demo_1',
        classId: 'cls_demo',
        sectionId: 'sec_demo',
        reportCardType: 'ANNUAL_REPORT',
        templateId: 'tmpl_standard_v1',
        status: 'PUBLISHED',
        calculationVersion: '1.0-official',
        gradingPolicyId: 'gp_default',
        gradingPolicyVersion: '1.0',
        attendancePercentage: 88.5,
        attendanceStatus: 'COMPLIANT',
        subjects: [
          {
            subjectId: 'sub_math',
            subjectName: 'Mathematics',
            maximumMarks: 100,
            obtainedMarks: 90,
            percentage: 90,
            grade: 'A+',
            resultStatus: 'PASS'
          }
        ],
        totalMaximumMarks: 100,
        totalObtainedMarks: 90,
        overallPercentage: 90,
        overallGrade: 'A+',
        resultStatus: 'PASS',
        verificationCode: 'EMS-RC-2027-8F92K7',
        generatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await FirebaseService.setDocument(REPORT_CARDS_COL, demoRc.reportCardId, demoRc);
      list = [demoRc];
    }

    if (studentId) {
      list = list.filter(r => r.studentId === studentId);
    }
    return list;
  }

  /**
   * Generate official report card from authoritative subject results
   */
  static async generateReportCard(
    tenantId: string,
    studentId: string,
    studentName: string,
    enrollmentId: string,
    examinationId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<ReportCard> {
    const results = await MarksService.getMarks(tenantId, examinationId, undefined, studentId);
    
    // Aggregate subject rows
    const subjectMap: Record<string, { max: number; obt: number; name: string }> = {};
    results.forEach(m => {
      if (!subjectMap[m.subjectId]) {
        subjectMap[m.subjectId] = { max: 0, obt: 0, name: m.subjectId === 'sub_math' ? 'Mathematics' : 'Subject' };
      }
      subjectMap[m.subjectId].max += m.maximumMarks;
      subjectMap[m.subjectId].obt += m.obtainedMarks;
    });

    const subjects: ReportCardSubjectRow[] = Object.keys(subjectMap).map(subId => {
      const data = subjectMap[subId];
      const pct = Number(((data.obt / data.max) * 100).toFixed(1));
      return {
        subjectId: subId,
        subjectName: data.name,
        maximumMarks: data.max,
        obtainedMarks: data.obt,
        percentage: pct,
        grade: pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : 'C',
        resultStatus: pct >= 40 ? 'PASS' : 'FAIL'
      };
    });

    const totalMax = subjects.reduce((acc, s) => acc + s.maximumMarks, 0) || 100;
    const totalObt = subjects.reduce((acc, s) => acc + s.obtainedMarks, 0);
    const overallPct = Number(((totalObt / totalMax) * 100).toFixed(1));

    const reportCardId = `rc_${examinationId}_${studentId}`;
    const now = new Date().toISOString();
    const verificationCode = `EMS-RC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(4, 4).toUpperCase()}`;

    const reportCard: ReportCard = {
      reportCardId,
      tenantId,
      academicYearId: 'ay_2027_28',
      studentId,
      studentName,
      enrollmentId,
      classId: 'cls_demo',
      sectionId: 'sec_demo',
      reportCardType: 'ANNUAL_REPORT',
      templateId: 'tmpl_standard_v1',
      status: 'GENERATED',
      calculationVersion: '1.0-official',
      gradingPolicyId: 'gp_default',
      gradingPolicyVersion: '1.0',
      attendancePercentage: 88.5,
      attendanceStatus: 'COMPLIANT',
      subjects,
      totalMaximumMarks: totalMax,
      totalObtainedMarks: totalObt,
      overallPercentage: overallPct,
      overallGrade: overallPct >= 90 ? 'A+' : overallPct >= 80 ? 'A' : 'B+',
      resultStatus: overallPct >= 40 ? 'PASS' : 'FAIL',
      verificationCode,
      generatedAt: now,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(REPORT_CARDS_COL, reportCardId, reportCard);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'REPORT_CARD_GENERATED' as any,
      resource: 'report_card' as any,
      resourceId: reportCardId,
      resourceName: `Report Card for ${studentName}`,
      newValue: reportCard,
      result: 'SUCCESS'
    });

    return reportCard;
  }

  /**
   * Update report card status (Approve, Publish)
   */
  static async updateStatus(
    reportCardId: string,
    tenantId: string,
    status: ReportCard['status'],
    user: { id: string; email: string; displayName?: string }
  ): Promise<ReportCard> {
    const rc = await FirebaseService.getDocument<ReportCard>(REPORT_CARDS_COL, reportCardId);
    if (!rc) throw new Error('Report Card not found');

    rc.status = status;
    rc.updatedAt = new Date().toISOString();

    if (status === 'APPROVED') {
      rc.approvedBy = user.displayName || user.email;
      rc.approvedAt = rc.updatedAt;
    } else if (status === 'PUBLISHED') {
      rc.publishedAt = rc.updatedAt;
    }

    await FirebaseService.setDocument(REPORT_CARDS_COL, reportCardId, rc);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: (status === 'PUBLISHED' ? 'REPORT_CARD_PUBLISHED' : 'REPORT_CARD_APPROVED') as any,
      resource: 'report_card' as any,
      resourceId: reportCardId,
      resourceName: `Report Card ${rc.studentName}`,
      newValue: rc,
      result: 'SUCCESS'
    });

    return rc;
  }

  /**
   * Get Academic Transcripts
   */
  static async getTranscripts(tenantId: string, studentId?: string): Promise<AcademicTranscript[]> {
    let list = await FirebaseService.getTenantCollection<AcademicTranscript>(TRANSCRIPTS_COL, tenantId);
    if (!list) list = [];

    if (list.length === 0) {
      const demoTr: AcademicTranscript = {
        transcriptId: `tr_demo_1`,
        tenantId,
        studentId: 'std_demo_1',
        studentName: 'Demo Student',
        enrollmentId: 'enr_demo_1',
        academicYears: [
          {
            academicYearId: '2027-28',
            className: 'Class VIII',
            sectionName: 'Section A',
            subjects: [
              {
                subjectId: 'sub_math',
                subjectName: 'Mathematics',
                maximumMarks: 100,
                obtainedMarks: 90,
                percentage: 90,
                grade: 'A+',
                resultStatus: 'PASS'
              }
            ],
            overallPercentage: 90,
            overallGrade: 'A+',
            status: 'PASS'
          }
        ],
        status: 'ISSUED',
        verificationCode: 'EMS-TR-2027-991A',
        issuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(TRANSCRIPTS_COL, demoTr.transcriptId, demoTr);
      list = [demoTr];
    }

    if (studentId) {
      list = list.filter(t => t.studentId === studentId);
    }
    return list;
  }
}
