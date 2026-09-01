import { 
  AcademicPerformanceInsight, 
  AcademicIntervention, 
  IntelligenceRiskPolicy, 
  DataSufficiency, 
  TrendStatus, 
  RiskLevel 
} from '../types/intelligence';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { MarksService } from './marksService';
import { StudentService } from './studentService';
import { AttendanceAnalyticsService } from './attendanceAnalyticsService';
import { RankingService } from './rankingService';

const INSIGHTS_COL = 'academic_performance_insights';
const INTERVENTIONS_COL = 'academic_interventions';
const RISK_POLICIES_COL = 'intelligence_risk_policies';

export class IntelligenceService {
  /**
   * Get risk policy for tenant with fallback default
   */
  static async getRiskPolicy(tenantId: string): Promise<IntelligenceRiskPolicy> {
    let policies = await FirebaseService.getTenantCollection<IntelligenceRiskPolicy>(RISK_POLICIES_COL, tenantId);
    if (!policies || policies.length === 0) {
      const defaultPolicy: IntelligenceRiskPolicy = {
        policyId: `irp_${tenantId}_default`,
        tenantId,
        name: 'Standard Deterministic Risk Policy',
        version: '1.0',
        status: 'ACTIVE',
        weights: {
          lowPerformance: 25,
          performanceDecline: 25,
          repeatedFailure: 20,
          subjectWeakness: 15,
          lowAttendance: 10,
          volatility: 5
        },
        thresholds: {
          passingPercentage: 40,
          minimumAttendance: 75,
          declineThreshold: 5
        },
        updatedAt: new Date().toISOString()
      };
      await FirebaseService.setDocument(RISK_POLICIES_COL, defaultPolicy.policyId, defaultPolicy);
      return defaultPolicy;
    }
    return policies.find(p => p.status === 'ACTIVE') || policies[0];
  }

  /**
   * Get all intelligence insights for a tenant with server-side tenant isolation
   */
  static async getInsights(tenantId: string, studentId?: string, requestingUser?: any): Promise<AcademicPerformanceInsight[]> {
    let list = await FirebaseService.getTenantCollection<AcademicPerformanceInsight>(INSIGHTS_COL, tenantId);
    if (!list) list = [];

    // Server-side RBAC and student/guardian scoping
    if (requestingUser) {
      const isStudent = requestingUser.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT');
      const isParent = requestingUser.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN');
      
      if (isStudent) {
        const studentIdRef = requestingUser.metadata?.studentId;
        if (studentIdRef) {
          list = list.filter(i => i.studentId === studentIdRef);
        }
      } else if (isParent) {
        const wardId = requestingUser.metadata?.studentId;
        if (wardId) {
          list = list.filter(i => i.studentId === wardId);
        }
      }
    }

    if (studentId) {
      list = list.filter(i => i.studentId === studentId);
    }
    return list;
  }

  /**
   * Run deterministic intelligence analysis for a student using authoritative data
   */
  static async runIntelligenceAnalysis(
    tenantId: string,
    studentId: string,
    academicYearId: string,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AcademicPerformanceInsight[]> {
    const student = await StudentService.getStudentById(studentId, user);
    if (!student) throw new Error('Authoritative student record not found.');

    const enrollments = await StudentService.getStudentEnrollments(studentId, tenantId);
    const enrollment = enrollments.find(e => e.academicYearId === academicYearId) || enrollments[0];
    if (!enrollment) throw new Error('Authoritative student enrollment context not found.');

    const riskPolicy = await this.getRiskPolicy(tenantId);
    const marks = await MarksService.getMarks(tenantId, undefined, undefined, studentId);
    const attendanceAnalytics = await AttendanceAnalyticsService.calculateStudentAnalytics(
      tenantId,
      studentId,
      enrollment.id,
      academicYearId,
      enrollment.classId,
      enrollment.sectionId,
      `${student.firstName} ${student.lastName}`
    );

    // Data sufficiency evaluation
    const assessmentCount = marks.length;
    const dataSufficiency: DataSufficiency = assessmentCount >= 3 && attendanceAnalytics.totalInstructionalDays >= 10 ? 'SUFFICIENT' : assessmentCount >= 1 ? 'LIMITED' : 'INSUFFICIENT';
    const confidence = dataSufficiency === 'SUFFICIENT' ? 'HIGH_DATA_CONFIDENCE' : dataSufficiency === 'LIMITED' ? 'LOW_DATA_CONFIDENCE' : 'INSUFFICIENT_DATA';

    // Calculate average score & subject results
    let totalObt = 0;
    let totalMax = 0;
    const subjectScores: Record<string, { obt: number; max: number; count: number }> = {};

    marks.forEach(m => {
      totalObt += m.obtainedMarks;
      totalMax += m.maximumMarks;
      if (!subjectScores[m.subjectId]) {
        subjectScores[m.subjectId] = { obt: 0, max: 0, count: 0 };
      }
      subjectScores[m.subjectId].obt += m.obtainedMarks;
      subjectScores[m.subjectId].max += m.maximumMarks;
      subjectScores[m.subjectId].count++;
    });

    const averageScore = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(1)) : 0;
    const attendancePct = attendanceAnalytics.effectivePercentage;

    const weakSubjects: string[] = [];
    const strongSubjects: string[] = [];

    Object.keys(subjectScores).forEach(subId => {
      const sub = subjectScores[subId];
      const pct = sub.max > 0 ? (sub.obt / sub.max) * 100 : 0;
      if (pct < riskPolicy.thresholds.passingPercentage) weakSubjects.push(subId);
      else if (pct >= 85) strongSubjects.push(subId);
    });

    // Trend analysis
    let trendStatus: TrendStatus = 'INSUFFICIENT_DATA';
    if (assessmentCount >= 3) {
      const sortedMarks = [...marks].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      const firstHalf = sortedMarks.slice(0, Math.floor(sortedMarks.length / 2));
      const secondHalf = sortedMarks.slice(Math.floor(sortedMarks.length / 2));
      const avgFirst = firstHalf.reduce((acc, m) => acc + (m.obtainedMarks / m.maximumMarks), 0) / (firstHalf.length || 1) * 100;
      const avgSecond = secondHalf.reduce((acc, m) => acc + (m.obtainedMarks / m.maximumMarks), 0) / (secondHalf.length || 1) * 100;

      if (avgSecond - avgFirst >= riskPolicy.thresholds.declineThreshold) trendStatus = 'IMPROVING';
      else if (avgFirst - avgSecond >= riskPolicy.thresholds.declineThreshold) trendStatus = 'DECLINING';
      else trendStatus = 'STABLE';
    }

    // Deterministic Risk Calculation
    let riskScore = 0;
    const reasonCodes: string[] = [];

    if (averageScore < riskPolicy.thresholds.passingPercentage) {
      riskScore += riskPolicy.weights.lowPerformance;
      reasonCodes.push('LOW_AVERAGE_SCORE');
    }
    if (trendStatus === 'DECLINING') {
      riskScore += riskPolicy.weights.performanceDecline;
      reasonCodes.push('PERFORMANCE_DECLINE');
    }
    if (weakSubjects.length > 0) {
      riskScore += riskPolicy.weights.subjectWeakness;
      reasonCodes.push('SUBJECT_WEAKNESS');
    }
    if (attendancePct < riskPolicy.thresholds.minimumAttendance) {
      riskScore += riskPolicy.weights.lowAttendance;
      reasonCodes.push('LOW_ATTENDANCE');
    }

    riskScore = Math.min(100, riskScore);
    const severity: RiskLevel = riskScore >= 70 ? 'CRITICAL' : riskScore >= 45 ? 'HIGH' : riskScore >= 25 ? 'MODERATE' : 'LOW';

    const now = new Date().toISOString();
    const insights: AcademicPerformanceInsight[] = [];

    // 1. Risk Insight
    const riskInsightId = `ins_risk_${studentId}_${Date.now()}`;
    const riskInsight: AcademicPerformanceInsight = {
      insightId: riskInsightId,
      tenantId,
      academicYearId,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      enrollmentId: enrollment.id,
      classId: enrollment.classId,
      sectionId: enrollment.sectionId,
      insightType: 'ACADEMIC_RISK',
      severity,
      status: 'ACTIVE',
      score: riskScore,
      confidence,
      dataSufficiency,
      reasonCodes,
      evidence: {
        averageScore,
        attendancePercentage: attendancePct,
        trendStatus,
        weakSubjects,
        strongSubjects
      },
      sourceVersions: {
        marksVersion: 'v1.0-authoritative',
        attendanceVersion: 'v1.0-authoritative'
      },
      calculationVersion: '1.2-deterministic',
      policyVersion: riskPolicy.version,
      generatedAt: now,
      createdAt: now,
      updatedAt: now
    };
    insights.push(riskInsight);

    // 2. Trend Insight
    const trendInsightId = `ins_trend_${studentId}_${Date.now()}`;
    const trendInsight: AcademicPerformanceInsight = {
      insightId: trendInsightId,
      tenantId,
      academicYearId,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      enrollmentId: enrollment.id,
      classId: enrollment.classId,
      sectionId: enrollment.sectionId,
      insightType: trendStatus === 'DECLINING' ? 'PERFORMANCE_DECLINE' : trendStatus === 'IMPROVING' ? 'PERFORMANCE_IMPROVEMENT' : 'PERFORMANCE_TREND',
      severity: trendStatus === 'DECLINING' ? 'HIGH' : 'LOW',
      status: 'ACTIVE',
      score: assessmentCount,
      confidence,
      dataSufficiency,
      reasonCodes: [trendStatus],
      evidence: {
        averageScore,
        trendStatus,
        observationCount: assessmentCount
      },
      sourceVersions: { marksVersion: 'v1.0-authoritative' },
      calculationVersion: '1.2-deterministic',
      policyVersion: riskPolicy.version,
      generatedAt: now,
      createdAt: now,
      updatedAt: now
    };
    insights.push(trendInsight);

    // Save all generated insights
    for (const ins of insights) {
      await FirebaseService.setDocument(INSIGHTS_COL, ins.insightId, ins);
    }

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'INTELLIGENCE_CALCULATED' as any,
      resource: 'intelligence_insight' as any,
      resourceId: studentId,
      resourceName: `Intelligence Analysis for ${student.firstName} ${student.lastName}`,
      newValue: { count: insights.length, riskScore, severity },
      result: 'SUCCESS'
    });

    return insights;
  }

  /**
   * Get intervention cases for tenant
   */
  static async getInterventions(tenantId: string, requestingUser?: any): Promise<AcademicIntervention[]> {
    let list = await FirebaseService.getTenantCollection<AcademicIntervention>(INTERVENTIONS_COL, tenantId);
    if (!list) list = [];

    if (requestingUser) {
      const isStudent = requestingUser.roleAssignments?.some((ra: any) => ra.roleCode === 'STUDENT');
      const isParent = requestingUser.roleAssignments?.some((ra: any) => ra.roleCode === 'PARENT_GUARDIAN');
      if (isStudent) {
        const studentIdRef = requestingUser.metadata?.studentId;
        if (studentIdRef) list = list.filter(i => i.studentId === studentIdRef);
      } else if (isParent) {
        const wardId = requestingUser.metadata?.studentId;
        if (wardId) list = list.filter(i => i.studentId === wardId);
      }
    }

    return list;
  }

  /**
   * Create intervention case
   */
  static async createIntervention(
    intervention: Omit<AcademicIntervention, 'interventionId' | 'createdAt' | 'updatedAt'>,
    user: { id: string; email: string; displayName?: string }
  ): Promise<AcademicIntervention> {
    const interventionId = `int_${Date.now()}`;
    const now = new Date().toISOString();

    const record: AcademicIntervention = {
      ...intervention,
      interventionId,
      reviews: [],
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(INTERVENTIONS_COL, interventionId, record);

    await AuditService.log({
      tenantId: intervention.tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'INTERVENTION_CREATED' as any,
      resource: 'intervention' as any,
      resourceId: interventionId,
      resourceName: `Intervention for ${intervention.studentName}`,
      newValue: record,
      result: 'SUCCESS'
    });

    return record;
  }

  /**
   * Add review to intervention
   */
  static async addInterventionReview(
    interventionId: string,
    tenantId: string,
    review: { progressNotes: string; outcome: 'IMPROVED' | 'STABLE' | 'NO_IMPROVEMENT' | 'WORSENED' | 'INCONCLUSIVE'; currentPerformance?: number },
    user: { id: string; email: string; displayName?: string }
  ): Promise<AcademicIntervention> {
    const intRecord = await FirebaseService.getDocument<AcademicIntervention>(INTERVENTIONS_COL, interventionId);
    if (!intRecord) throw new Error('Intervention case not found.');

    const now = new Date().toISOString();
    const newReview = {
      reviewId: `rev_${Date.now()}`,
      reviewDate: now,
      progressNotes: review.progressNotes,
      outcome: review.outcome,
      currentPerformance: review.currentPerformance,
      reviewedBy: user.displayName || user.email
    };

    intRecord.reviews = [...(intRecord.reviews || []), newReview];
    intRecord.outcome = review.outcome;
    if (review.outcome === 'IMPROVED' || review.outcome === 'STABLE') {
      intRecord.status = 'MONITORING';
    }
    intRecord.updatedAt = now;

    await FirebaseService.setDocument(INTERVENTIONS_COL, interventionId, intRecord);

    await AuditService.log({
      tenantId,
      userId: user.id,
      userEmail: user.email,
      userDisplayName: user.displayName || user.email,
      action: 'INTERVENTION_UPDATED' as any,
      resource: 'intervention' as any,
      resourceId: interventionId,
      resourceName: `Intervention Review for ${intRecord.studentName}`,
      newValue: newReview,
      result: 'SUCCESS'
    });

    return intRecord;
  }
}
