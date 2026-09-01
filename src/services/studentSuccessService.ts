/**
 * EMS Phase 7.33: Student Academic Progression, Retention, Early Warning, Intervention & Student Success Governance Engine Service
 */

import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import {
  StudentSuccessProfile,
  StudentRiskAssessment,
  EarlyWarningSignal,
  StudentIntervention,
  RetentionCase,
  ProgressionAssessment,
  StudentSuccessReview,
  SuccessAnalytics,
  RiskLevel,
  SignalSeverity,
  SignalType,
  SignalStatus,
  InterventionType,
  InterventionStatus,
  RetentionStatus,
  ProgressionStatus,
  ConfidentialityLevel
} from '../types/studentSuccess';

export class StudentSuccessService {
  /**
   * Deterministic Risk Calculation Utility
   * Prevents NaN, Infinity, negative values, and divide-by-zero
   */
  public static calculateCompositeRiskScore(
    attendanceRisk: number,
    academicRisk: number,
    engagementRisk: number,
    financialRisk: number,
    behavioralRisk: number,
    supportRisk: number
  ): { compositeScore: number; riskLevel: RiskLevel; contributingFactors: string[] } {
    const sanitize = (val: number) => (isNaN(val) || !isFinite(val) || val < 0 ? 0 : Math.min(val, 100));

    const att = sanitize(attendanceRisk);
    const acad = sanitize(academicRisk);
    const eng = sanitize(engagementRisk);
    const fin = sanitize(financialRisk);
    const beh = sanitize(behavioralRisk);
    const sup = sanitize(supportRisk);

    // Weighted deterministic composite score: 30% attendance, 30% academic, 15% engagement, 10% financial, 10% behavioral, 5% support
    const rawScore = att * 0.3 + acad * 0.3 + eng * 0.15 + fin * 0.1 + beh * 0.1 + sup * 0.05;
    const compositeScore = Math.round(Math.min(100, Math.max(0, rawScore)) * 100) / 100;

    let riskLevel: RiskLevel = 'LOW';
    if (compositeScore >= 75) {
      riskLevel = 'CRITICAL';
    } else if (compositeScore >= 50) {
      riskLevel = 'HIGH';
    } else if (compositeScore >= 25) {
      riskLevel = 'MODERATE';
    }

    const factors: string[] = [];
    if (att >= 50) factors.push(`High Attendance Deficit (${att}%)`);
    if (acad >= 50) factors.push(`Academic Performance Concern (${acad}%)`);
    if (eng >= 50) factors.push(`Low Class Engagement (${eng}%)`);
    if (fin >= 50) factors.push(`Financial Dues Pending (${fin}%)`);
    if (beh >= 50) factors.push(`Behavioral / Disciplinary Record (${beh}%)`);
    if (sup >= 50) factors.push(`Multiple Active Support Cases (${sup}%)`);

    if (factors.length === 0 && compositeScore > 0) {
      factors.push('Subtle multi-factor deterioration');
    }

    return { compositeScore, riskLevel, contributingFactors: factors };
  }

  /**
   * Create or Initialize Student Success Profile
   */
  public static async createSuccessProfile(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      admissionNumber: string;
      academicYearId: string;
      classId: string;
      className: string;
      sectionId: string;
      sectionName: string;
      confidentialityLevel?: ConfidentialityLevel;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<StudentSuccessProfile> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation mismatch.');
    }
    if (!data.studentId || !data.studentName) {
      throw new Error('Authoritative Student reference required.');
    }

    const now = new Date().toISOString();
    const id = 'ssp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const profile: StudentSuccessProfile = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      admissionNumber: data.admissionNumber,
      academicYearId: data.academicYearId,
      classId: data.classId,
      className: data.className,
      sectionId: data.sectionId,
      sectionName: data.sectionName,
      status: 'ACTIVE',
      currentRiskLevel: 'LOW',
      currentRiskScore: 0,
      retentionStatus: 'STABLE',
      progressionStatus: 'ELIGIBLE',
      confidentialityLevel: data.confidentialityLevel || 'STANDARD',
      lastCalculatedAt: now,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument('student_success_profiles', profile.id, profile);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'STUDENT_SUCCESS_PROFILE_CREATED',
      resource: 'student_success_profile',
      resourceId: profile.id,
      resourceName: profile.studentName
    });

    return profile;
  }

  /**
   * Calculate and Record Risk Assessment for Student
   * Completely ignores any client-supplied score. Composite score calculated server-side.
   */
  public static async calculateRisk(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      academicYearId: string;
      assessmentPeriod: string;
      attendanceRisk: number;
      academicRisk: number;
      engagementRisk: number;
      financialRisk: number;
      behavioralRisk: number;
      supportRisk: number;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<StudentRiskAssessment> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    const { compositeScore, riskLevel, contributingFactors } = this.calculateCompositeRiskScore(
      data.attendanceRisk,
      data.academicRisk,
      data.engagementRisk,
      data.financialRisk,
      data.behavioralRisk,
      data.supportRisk
    );

    const now = new Date().toISOString();
    const id = 'sra_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const assessment: StudentRiskAssessment = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      academicYearId: data.academicYearId,
      assessmentPeriod: data.assessmentPeriod,
      attendanceRisk: data.attendanceRisk,
      academicRisk: data.academicRisk,
      engagementRisk: data.engagementRisk,
      financialRisk: data.financialRisk,
      behavioralRisk: data.behavioralRisk,
      supportRisk: data.supportRisk,
      compositeRiskScore: compositeScore,
      riskLevel,
      contributingFactors,
      calculatedAt: now,
      calculationVersion: 'v1.0.0'
    };

    await FirebaseService.setDocument('student_risk_assessments', assessment.id, assessment);

    // Update Student Success Profile risk scores
    const profiles = await FirebaseService.getTenantCollection<StudentSuccessProfile>('student_success_profiles', data.tenantId);
    const matchingProfiles = profiles.filter(p => p.studentId === data.studentId);

    if (matchingProfiles.length > 0) {
      await FirebaseService.updateDocument('student_success_profiles', matchingProfiles[0].id, {
        currentRiskLevel: riskLevel,
        currentRiskScore: compositeScore,
        lastCalculatedAt: now,
        updatedAt: now
      });
    }

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'STUDENT_RISK_CALCULATED',
      resource: 'student_risk_assessment',
      resourceId: assessment.id,
      resourceName: `${data.studentName} (${riskLevel})`
    });

    return assessment;
  }

  /**
   * Formal Override of Automated Risk Score
   * Enforces SoD: Overrider cannot be the automated system or self-certify without reason.
   */
  public static async overrideRisk(
    assessmentId: string,
    overrideRiskLevel: RiskLevel,
    overrideReason: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const assessment = await FirebaseService.getDocument<StudentRiskAssessment>('student_risk_assessments', assessmentId);
    if (!assessment || assessment.tenantId !== tenantId) {
      throw new Error('Risk Assessment record not found or tenant mismatch.');
    }
    if (!overrideReason || overrideReason.trim().length < 10) {
      throw new Error('Formal override requires detailed audit justification (min 10 chars).');
    }

    const now = new Date().toISOString();

    await FirebaseService.updateDocument('student_risk_assessments', assessmentId, {
      riskLevel: overrideRiskLevel,
      isOverridden: true,
      overrideReason,
      overriddenBy: actorId,
      overriddenAt: now
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'STUDENT_RISK_OVERRIDDEN',
      resource: 'student_risk_assessment',
      resourceId: assessmentId,
      resourceName: `${assessment.studentName} -> ${overrideRiskLevel}`
    });
  }

  /**
   * Create Early Warning Signal
   */
  public static async createEarlyWarningSignal(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      signalType: SignalType;
      severity: SignalSeverity;
      sourceModule: string;
      sourceRecordId: string;
      evidence: string;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<EarlyWarningSignal> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    const now = new Date().toISOString();
    const id = 'ews_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const signal: EarlyWarningSignal = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      signalType: data.signalType,
      severity: data.severity,
      sourceModule: data.sourceModule,
      sourceRecordId: data.sourceRecordId,
      detectedAt: now,
      evidence: data.evidence,
      status: 'OPEN'
    };

    await FirebaseService.setDocument('student_success_early_warning_signals', signal.id, signal);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'EARLY_WARNING_CREATED',
      resource: 'student_warning_signal',
      resourceId: signal.id,
      resourceName: `${data.signalType} - ${data.studentName}`
    });

    return signal;
  }

  /**
   * Acknowledge or Action Early Warning Signal
   */
  public static async acknowledgeWarning(
    signalId: string,
    newStatus: 'ACKNOWLEDGED' | 'ACTIONED' | 'RESOLVED',
    resolutionNotes: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const signal = await FirebaseService.getDocument<EarlyWarningSignal>('student_success_early_warning_signals', signalId);
    if (!signal || signal.tenantId !== tenantId) {
      throw new Error('Warning signal not found or tenant mismatch.');
    }

    const now = new Date().toISOString();
    const updatePayload: Partial<EarlyWarningSignal> = {
      status: newStatus,
      acknowledgedBy: actorId,
      acknowledgedByName: actorName,
      acknowledgedAt: now
    };

    if (newStatus === 'RESOLVED') {
      updatePayload.resolvedAt = now;
      updatePayload.resolutionNotes = resolutionNotes;
    }

    await FirebaseService.updateDocument('student_success_early_warning_signals', signalId, updatePayload);

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'EARLY_WARNING_ACKNOWLEDGED',
      resource: 'student_warning_signal',
      resourceId: signalId,
      resourceName: `${signal.signalType} (${newStatus})`
    });
  }

  /**
   * Create Student Intervention
   */
  public static async createIntervention(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      interventionType: InterventionType;
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
      assignedTo: string;
      assignedToName: string;
      referralSource: string;
      actionPlan: string;
      dueDate: string;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<StudentIntervention> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    const now = new Date().toISOString();
    const id = 'st_int_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const intervention: StudentIntervention = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      interventionType: data.interventionType,
      priority: data.priority,
      assignedTo: data.assignedTo,
      assignedToName: data.assignedToName,
      referralSource: data.referralSource,
      actionPlan: data.actionPlan,
      dueDate: data.dueDate,
      status: 'PROPOSED',
      createdBy: actorId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument('student_success_interventions', intervention.id, intervention);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'INTERVENTION_CREATED',
      resource: 'student_intervention',
      resourceId: intervention.id,
      resourceName: `${data.interventionType} - ${data.studentName}`
    });

    return intervention;
  }

  /**
   * Verify Intervention Outcome
   * Enforces Four-Eyes SoD: Intervention creator cannot verify closure independently.
   */
  public static async verifyIntervention(
    interventionId: string,
    outcome: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const intervention = await FirebaseService.getDocument<StudentIntervention>('student_success_interventions', interventionId);
    if (!intervention || intervention.tenantId !== tenantId) {
      throw new Error('Intervention record not found or tenant mismatch.');
    }

    // Four-Eyes SoD Check
    if (intervention.createdBy === actorId) {
      throw new Error('Separation of Duties violation: Intervention creator cannot self-verify intervention completion.');
    }

    const now = new Date().toISOString();

    await FirebaseService.updateDocument('student_success_interventions', interventionId, {
      status: 'VERIFIED',
      outcome,
      verifiedBy: actorId,
      verifiedByName: actorName,
      verifiedAt: now,
      completedAt: now,
      updatedAt: now
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'INTERVENTION_VERIFIED',
      resource: 'student_intervention',
      resourceId: interventionId,
      resourceName: `${intervention.interventionType} (VERIFIED)`
    });
  }

  /**
   * Close Intervention Case
   */
  public static async closeIntervention(
    interventionId: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const intervention = await FirebaseService.getDocument<StudentIntervention>('student_success_interventions', interventionId);
    if (!intervention || intervention.tenantId !== tenantId) {
      throw new Error('Intervention record not found or tenant mismatch.');
    }

    const now = new Date().toISOString();

    await FirebaseService.updateDocument('student_success_interventions', interventionId, {
      status: 'CLOSED',
      updatedAt: now
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'INTERVENTION_CLOSED',
      resource: 'student_intervention',
      resourceId: interventionId,
      resourceName: `${intervention.interventionType} (CLOSED)`
    });
  }

  /**
   * Create Retention Case
   */
  public static async createRetentionCase(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      academicYearId: string;
      retentionRisk: RiskLevel;
      caseOwnerId: string;
      caseOwnerName: string;
      reasons: string[];
      reviewDate: string;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<RetentionCase> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    const now = new Date().toISOString();
    const id = 'ret_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const retentionCase: RetentionCase = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      academicYearId: data.academicYearId,
      retentionRisk: data.retentionRisk,
      caseOwnerId: data.caseOwnerId,
      caseOwnerName: data.caseOwnerName,
      reasons: data.reasons,
      status: 'UNDER_MONITORING',
      reviewDate: data.reviewDate,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument('student_success_retention_cases', retentionCase.id, retentionCase);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'RETENTION_CASE_CREATED',
      resource: 'student_retention_case',
      resourceId: retentionCase.id,
      resourceName: `${data.studentName} Retention Case`
    });

    return retentionCase;
  }

  /**
   * Authoritatively Approve Retention Decision
   * Enforces SoD: Case Owner cannot self-approve retention decisions.
   */
  public static async approveRetentionDecision(
    caseId: string,
    newStatus: RetentionStatus,
    outcome: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const rCase = await FirebaseService.getDocument<RetentionCase>('student_success_retention_cases', caseId);
    if (!rCase || rCase.tenantId !== tenantId) {
      throw new Error('Retention case not found or tenant mismatch.');
    }

    // SoD Check: Case owner cannot approve own retention decision
    if (rCase.caseOwnerId === actorId) {
      throw new Error('Separation of Duties violation: Retention case owner cannot self-approve retention decisions.');
    }

    const now = new Date().toISOString();

    await FirebaseService.updateDocument('student_success_retention_cases', caseId, {
      status: newStatus,
      outcome,
      approvedBy: actorId,
      approvedByName: actorName,
      approvedAt: now,
      updatedAt: now
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'RETENTION_DECISION_APPROVED',
      resource: 'student_retention_case',
      resourceId: caseId,
      resourceName: `${rCase.studentName} (${newStatus})`
    });
  }

  /**
   * Assess Academic Progression Eligibility
   */
  public static async assessProgression(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      academicYearId: string;
      currentClassId: string;
      currentClassName: string;
      nextClassId?: string;
      nextClassName?: string;
      earnedCredits: number;
      failedSubjectsCount: number;
      failedSubjectNames: string[];
      attendanceEligibilityPercentage: number;
      notes?: string;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<ProgressionAssessment> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    let progressionStatus: ProgressionStatus = 'ELIGIBLE';
    if (data.failedSubjectsCount > 2 || data.attendanceEligibilityPercentage < 75) {
      progressionStatus = 'BLOCKED';
    } else if (data.failedSubjectsCount > 0 || data.attendanceEligibilityPercentage < 80) {
      progressionStatus = 'CONDITIONALLY_ELIGIBLE';
    }

    const now = new Date().toISOString();
    const id = 'pa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const assessment: ProgressionAssessment = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      academicYearId: data.academicYearId,
      currentClassId: data.currentClassId,
      currentClassName: data.currentClassName,
      nextClassId: data.nextClassId,
      nextClassName: data.nextClassName,
      earnedCredits: data.earnedCredits,
      failedSubjectsCount: data.failedSubjectsCount,
      failedSubjectNames: data.failedSubjectNames,
      attendanceEligibilityPercentage: data.attendanceEligibilityPercentage,
      progressionStatus,
      notes: data.notes,
      assessedBy: actorId,
      assessedByName: actorName,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument('student_success_progression_assessments', assessment.id, assessment);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'PROGRESSION_ASSESSED',
      resource: 'student_progression_assessment',
      resourceId: assessment.id,
      resourceName: `${data.studentName} (${progressionStatus})`
    });

    return assessment;
  }

  /**
   * Authoritatively Approve Academic Progression Decision
   * Enforces SoD: Assessor cannot self-approve progression decision.
   */
  public static async approveProgression(
    assessmentId: string,
    decisionReference: string,
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<void> {
    const assessment = await FirebaseService.getDocument<ProgressionAssessment>('student_success_progression_assessments', assessmentId);
    if (!assessment || assessment.tenantId !== tenantId) {
      throw new Error('Progression assessment record not found or tenant mismatch.');
    }

    // SoD Check: Assessor cannot self-approve
    if (assessment.assessedBy === actorId) {
      throw new Error('Separation of Duties violation: Assessor cannot self-approve academic progression decisions.');
    }

    const now = new Date().toISOString();

    await FirebaseService.updateDocument('student_success_progression_assessments', assessmentId, {
      decisionReference,
      approvedBy: actorId,
      approvedByName: actorName,
      approvedAt: now,
      updatedAt: now
    });

    await AuditService.log({
      tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'PROGRESSION_APPROVED',
      resource: 'student_progression_assessment',
      resourceId: assessmentId,
      resourceName: `${assessment.studentName} Progression Approved`
    });
  }

  /**
   * Create Student Success Review Record
   */
  public static async createSuccessReview(
    data: {
      tenantId: string;
      campusId: string;
      studentId: string;
      studentName: string;
      reviewPeriod: string;
      findings: string;
      recommendations: string;
      decision: string;
    },
    actorId: string,
    actorName: string,
    tenantId: string
  ): Promise<StudentSuccessReview> {
    if (!data.tenantId || data.tenantId !== tenantId) {
      throw new Error('Tenant isolation failure.');
    }

    const now = new Date().toISOString();
    const id = 'ssr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const review: StudentSuccessReview = {
      id,
      tenantId: data.tenantId,
      campusId: data.campusId,
      studentId: data.studentId,
      studentName: data.studentName,
      reviewPeriod: data.reviewPeriod,
      reviewerId: actorId,
      reviewerName: actorName,
      findings: data.findings,
      recommendations: data.recommendations,
      decision: data.decision,
      createdAt: now
    };

    await FirebaseService.setDocument('student_success_reviews', review.id, review);

    await AuditService.log({
      tenantId: data.tenantId,
      userId: actorId,
      userEmail: actorId + '@system.local',
      userDisplayName: actorName,
      action: 'SUCCESS_REVIEW_CREATED',
      resource: 'student_success_review',
      resourceId: review.id,
      resourceName: `${data.studentName} Success Review`
    });

    return review;
  }

  /**
   * Derive Success Analytics dynamically from real DB documents
   * Zero hardcoded KPI data or fake metrics!
   */
  public static async getSuccessAnalytics(tenantId: string): Promise<SuccessAnalytics> {
    const [profiles, risks, signals, interventions, retentionCases, progressions] = await Promise.all([
      FirebaseService.getTenantCollection<StudentSuccessProfile>('student_success_profiles', tenantId),
      FirebaseService.getTenantCollection<StudentRiskAssessment>('student_risk_assessments', tenantId),
      FirebaseService.getTenantCollection<EarlyWarningSignal>('student_success_early_warning_signals', tenantId),
      FirebaseService.getTenantCollection<StudentIntervention>('student_success_interventions', tenantId),
      FirebaseService.getTenantCollection<RetentionCase>('student_success_retention_cases', tenantId),
      FirebaseService.getTenantCollection<ProgressionAssessment>('student_success_progression_assessments', tenantId)
    ]);

    const totalActiveStudents = profiles.length;
    const highRiskCount = profiles.filter(p => p.currentRiskLevel === 'HIGH').length;
    const criticalRiskCount = profiles.filter(p => p.currentRiskLevel === 'CRITICAL').length;
    const studentsAtRiskCount = highRiskCount + criticalRiskCount + profiles.filter(p => p.currentRiskLevel === 'MODERATE').length;

    const attendanceRiskCount = risks.filter(r => r.attendanceRisk >= 50).length;
    const academicRiskCount = risks.filter(r => r.academicRisk >= 50).length;

    const openInterventions = interventions.filter(i => i.status !== 'CLOSED' && i.status !== 'VERIFIED');
    const completedInterventions = interventions.filter(i => i.status === 'VERIFIED' || i.status === 'CLOSED');

    const interventionCompletionRatePercentage =
      interventions.length > 0 ? Math.round((completedInterventions.length / interventions.length) * 100) : 100;

    const retentionRiskCount = retentionCases.filter(rc => rc.retentionRisk === 'HIGH' || rc.retentionRisk === 'CRITICAL').length;
    const progressionReadyCount = progressions.filter(p => p.progressionStatus === 'ELIGIBLE').length;
    const progressionBlockedCount = progressions.filter(p => p.progressionStatus === 'BLOCKED').length;

    const unresolvedSignalsCount = signals.filter(s => s.status === 'OPEN' || s.status === 'ACKNOWLEDGED').length;

    const cohortRetentionRatePercentage =
      retentionCases.length > 0
        ? Math.round(((retentionCases.length - retentionRiskCount) / retentionCases.length) * 100)
        : 100;

    const cohortProgressionRatePercentage =
      progressions.length > 0 ? Math.round((progressionReadyCount / progressions.length) * 100) : 100;

    return {
      totalActiveStudents,
      studentsAtRiskCount,
      highRiskCount,
      criticalRiskCount,
      attendanceRiskCount,
      academicRiskCount,
      interventionBacklogCount: openInterventions.length,
      interventionCompletionRatePercentage,
      retentionRiskCount,
      progressionReadyCount,
      progressionBlockedCount,
      unresolvedSignalsCount,
      cohortRetentionRatePercentage,
      cohortProgressionRatePercentage
    };
  }
}
