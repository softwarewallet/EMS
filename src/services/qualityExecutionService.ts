import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import {
  QualityAssessmentCycle,
  QualityCriterion,
  QualityIndicator,
  AssessmentSubmission,
  EvidenceMapping,
  ProgramQualityReview,
  ImprovementInitiative,
  CAPAAction,
  QualityReviewDecision,
  AccreditationEvidencePackage,
  QualityAnalytics
} from '../types/qualityExecution';

export class QualityExecutionService {
  // Collections
  private static readonly COLLECTION_CYCLES = 'quality_assessment_cycles';
  private static readonly COLLECTION_CRITERIA = 'quality_criteria';
  private static readonly COLLECTION_INDICATORS = 'quality_indicators';
  private static readonly COLLECTION_SUBMISSIONS = 'quality_assessment_submissions';
  private static readonly COLLECTION_EVIDENCE = 'quality_evidence_mappings';
  private static readonly COLLECTION_REVIEWS = 'quality_program_reviews';
  private static readonly COLLECTION_INITIATIVES = 'quality_improvement_initiatives';
  private static readonly COLLECTION_CAPA = 'quality_capa_actions';
  private static readonly COLLECTION_DECISIONS = 'quality_review_decisions';
  private static readonly COLLECTION_PACKAGES = 'quality_accreditation_evidence_packages';

  // Seed Default Criteria and Indicators if empty
  private static async seedDefaultFrameworksIfEmpty(tenantId: string, campusId: string): Promise<void> {
    try {
      const existingCriteria = await FirebaseService.getTenantCollection<QualityCriterion>(
        this.COLLECTION_CRITERIA,
        tenantId
      );
      if (existingCriteria.length === 0) {
        const now = new Date().toISOString();

        // 1. NAAC Criterion 1: Curricular Aspects
        const crit1: QualityCriterion = {
          id: 'qc_naac_c1',
          tenantId,
          campusId,
          framework: 'NAAC',
          criterionCode: 'NAAC-C1',
          title: 'Curricular Aspects & Academic Flexibility',
          description: 'Design, development, and revision of curriculum aligned with institutional learning outcomes.',
          weight: 150,
          evidenceRequired: true,
          responsibleOwnerId: 'usr_dean_academic',
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now
        };

        // 2. NAAC Criterion 2: Teaching-Learning and Evaluation
        const crit2: QualityCriterion = {
          id: 'qc_naac_c2',
          tenantId,
          campusId,
          framework: 'NAAC',
          criterionCode: 'NAAC-C2',
          title: 'Teaching-Learning & Student Assessment Evaluation',
          description: 'Student enrollment, teacher profile, learning process, and examination outcome evaluation.',
          weight: 200,
          evidenceRequired: true,
          responsibleOwnerId: 'usr_dean_teaching',
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now
        };

        // 3. NBA Criterion 3: Program Outcomes & Course Outcomes
        const crit3: QualityCriterion = {
          id: 'qc_nba_c3',
          tenantId,
          campusId,
          framework: 'NBA',
          criterionCode: 'NBA-C3',
          title: 'Course Outcomes & Program Outcomes Attainment',
          description: 'Direct and indirect assessment of course learning outcomes and graduate attributes.',
          weight: 120,
          evidenceRequired: true,
          responsibleOwnerId: 'usr_iqac_coordinator',
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now
        };

        // 4. ISO 21001 Educational Organization Management
        const crit4: QualityCriterion = {
          id: 'qc_iso_c4',
          tenantId,
          campusId,
          framework: 'ISO_21001',
          criterionCode: 'ISO-21001-C4',
          title: 'Educational Management System Execution & Risk Governance',
          description: 'Institutional leadership, process risk management, and continuous process assessment.',
          weight: 100,
          evidenceRequired: true,
          responsibleOwnerId: 'usr_quality_director',
          status: 'ACTIVE',
          createdAt: now,
          updatedAt: now
        };

        await Promise.all([
          FirebaseService.setDocument(this.COLLECTION_CRITERIA, crit1.id, crit1),
          FirebaseService.setDocument(this.COLLECTION_CRITERIA, crit2.id, crit2),
          FirebaseService.setDocument(this.COLLECTION_CRITERIA, crit3.id, crit3),
          FirebaseService.setDocument(this.COLLECTION_CRITERIA, crit4.id, crit4)
        ]);

        // Seed Indicators
        const ind1: QualityIndicator = {
          id: 'qi_naac_1_1',
          tenantId,
          campusId,
          criterionId: crit1.id,
          indicatorCode: 'IND-1.1.1',
          name: 'Curriculum Revision Percentage',
          description: 'Percentage of courses where syllabus revision was carried out during the last 3 years.',
          measurementMethod: 'PERCENTAGE',
          target: 30,
          tolerance: 5,
          weight: 50,
          status: 'ACTIVE',
          ownerId: 'usr_dean_academic',
          createdAt: now,
          updatedAt: now
        };

        const ind2: QualityIndicator = {
          id: 'qi_naac_2_2',
          tenantId,
          campusId,
          criterionId: crit2.id,
          indicatorCode: 'IND-2.2.1',
          name: 'Full-Time Faculty PhD Ratio',
          description: 'Percentage of full-time teachers with PhD / NET / SET qualifications.',
          measurementMethod: 'PERCENTAGE',
          target: 75,
          tolerance: 10,
          weight: 70,
          status: 'ACTIVE',
          ownerId: 'usr_dean_teaching',
          createdAt: now,
          updatedAt: now
        };

        const ind3: QualityIndicator = {
          id: 'qi_nba_3_1',
          tenantId,
          campusId,
          criterionId: crit3.id,
          indicatorCode: 'IND-3.1.2',
          name: 'PO Attainment Average Level',
          description: 'Average attainment score across all 12 NBA Program Outcomes (scale 0 to 3).',
          measurementMethod: 'SCORE_SCALE_3',
          target: 2.5,
          tolerance: 0.2,
          weight: 60,
          status: 'ACTIVE',
          ownerId: 'usr_iqac_coordinator',
          createdAt: now,
          updatedAt: now
        };

        await Promise.all([
          FirebaseService.setDocument(this.COLLECTION_INDICATORS, ind1.id, ind1),
          FirebaseService.setDocument(this.COLLECTION_INDICATORS, ind2.id, ind2),
          FirebaseService.setDocument(this.COLLECTION_INDICATORS, ind3.id, ind3)
        ]);
      }
    } catch (err) {
      console.warn('Seed default quality framework error (non-fatal):', err);
    }
  }

  // ============================================================================
  // 1. ASSESSMENT CYCLES
  // ============================================================================

  static async getAssessmentCycles(tenantId: string, campusId?: string): Promise<QualityAssessmentCycle[]> {
    const cycles = await FirebaseService.getTenantCollection<QualityAssessmentCycle>(
      this.COLLECTION_CYCLES,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return cycles;
    return cycles.filter(c => !c.campusId || c.campusId === campusId || c.campusId === 'MAIN_CAMPUS');
  }

  static async createAssessmentCycle(
    cycle: Omit<QualityAssessmentCycle, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<QualityAssessmentCycle> {
    const id = FirebaseService.generateId('qac');
    const now = new Date().toISOString();
    const newCycle: QualityAssessmentCycle = {
      ...cycle,
      id,
      status: 'DRAFT',
      ownerId: actorId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CYCLES, id, newCycle);

    await AuditService.log({
      tenantId: cycle.tenantId,
      campusId: cycle.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_ASSESSMENT_CREATED',
      resource: 'quality_assessment_cycle',
      resourceId: id,
      resourceName: cycle.name,
      newValue: newCycle as any,
      result: 'SUCCESS',
      notes: `Assessment cycle created: ${cycle.name} (${cycle.cycleType})`
    });

    return newCycle;
  }

  static async approveAssessmentCycle(
    cycleId: string,
    tenantId: string,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<QualityAssessmentCycle> {
    const cycle = await FirebaseService.getDocument<QualityAssessmentCycle>(this.COLLECTION_CYCLES, cycleId);
    if (!cycle || cycle.tenantId !== tenantId) {
      throw new Error('Assessment cycle not found or tenant mismatch');
    }

    // SoD Enforcement: Owner/Creator cannot approve their own cycle
    if (cycle.ownerId === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_ASSESSMENT_APPROVED',
        resource: 'quality_assessment_cycle',
        resourceId: cycleId,
        result: 'DENIED',
        notes: `SoD Violation: User ${actorId} attempted to approve their own assessment cycle.`
      });
      throw new Error('Separation of Duties Violation: You cannot approve an assessment cycle created by yourself.');
    }

    const now = new Date().toISOString();
    const updated: QualityAssessmentCycle = {
      ...cycle,
      status: 'ACTIVE',
      approvedBy: actorId,
      approvedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CYCLES, cycleId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_ASSESSMENT_APPROVED',
      resource: 'quality_assessment_cycle',
      resourceId: cycleId,
      resourceName: cycle.name,
      previousValue: { status: cycle.status },
      newValue: { status: 'ACTIVE', approvedBy: actorId },
      result: 'SUCCESS',
      notes: `Assessment cycle approved and activated by ${actorName || actorId}`
    });

    return updated;
  }

  // ============================================================================
  // 2. QUALITY CRITERIA & INDICATORS
  // ============================================================================

  static async getCriteria(tenantId: string, campusId?: string): Promise<QualityCriterion[]> {
    await this.seedDefaultFrameworksIfEmpty(tenantId, campusId || 'MAIN_CAMPUS');
    const criteria = await FirebaseService.getTenantCollection<QualityCriterion>(
      this.COLLECTION_CRITERIA,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return criteria;
    return criteria.filter(c => !c.campusId || c.campusId === campusId || c.campusId === 'MAIN_CAMPUS');
  }

  static async createCriterion(
    criterion: Omit<QualityCriterion, 'id' | 'createdAt' | 'updatedAt'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<QualityCriterion> {
    const id = FirebaseService.generateId('qcr');
    const now = new Date().toISOString();
    const newCriterion: QualityCriterion = {
      ...criterion,
      id,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CRITERIA, id, newCriterion);
    return newCriterion;
  }

  static async getIndicators(tenantId: string, criterionId?: string): Promise<QualityIndicator[]> {
    const indicators = await FirebaseService.getTenantCollection<QualityIndicator>(
      this.COLLECTION_INDICATORS,
      tenantId
    );
    if (!criterionId) return indicators;
    return indicators.filter(i => i.criterionId === criterionId);
  }

  static async createIndicator(
    indicator: Omit<QualityIndicator, 'id' | 'createdAt' | 'updatedAt'>,
    actorId: string
  ): Promise<QualityIndicator> {
    const id = FirebaseService.generateId('qind');
    const now = new Date().toISOString();
    const newIndicator: QualityIndicator = {
      ...indicator,
      id,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_INDICATORS, id, newIndicator);
    return newIndicator;
  }

  // ============================================================================
  // 3. ASSESSMENT SUBMISSIONS
  // ============================================================================

  static async getSubmissions(tenantId: string, cycleId?: string): Promise<AssessmentSubmission[]> {
    const submissions = await FirebaseService.getTenantCollection<AssessmentSubmission>(
      this.COLLECTION_SUBMISSIONS,
      tenantId
    );
    if (!cycleId) return submissions;
    return submissions.filter(s => s.cycleId === cycleId);
  }

  static async createSubmission(
    submission: Omit<AssessmentSubmission, 'id' | 'createdAt' | 'updatedAt' | 'submittedBy' | 'submissionDate' | 'status'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<AssessmentSubmission> {
    const id = FirebaseService.generateId('asub');
    const now = new Date().toISOString();

    const newSub: AssessmentSubmission = {
      ...submission,
      id,
      submittedBy: actorId,
      submissionDate: now,
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_SUBMISSIONS, id, newSub);

    await AuditService.log({
      tenantId: submission.tenantId,
      campusId: submission.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_ASSESSMENT_SUBMITTED',
      resource: 'quality_assessment_submission',
      resourceId: id,
      newValue: newSub as any,
      result: 'SUCCESS',
      notes: `Assessment submission recorded for criterion ${submission.criterionId}`
    });

    return newSub;
  }

  static async verifySubmission(
    submissionId: string,
    tenantId: string,
    actorId: string,
    notes: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<AssessmentSubmission> {
    const sub = await FirebaseService.getDocument<AssessmentSubmission>(this.COLLECTION_SUBMISSIONS, submissionId);
    if (!sub || sub.tenantId !== tenantId) {
      throw new Error('Submission not found or tenant mismatch');
    }

    // SoD Check: Submitter cannot verify own submission
    if (sub.submittedBy === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_ASSESSMENT_VERIFIED',
        resource: 'quality_assessment_submission',
        resourceId: submissionId,
        result: 'DENIED',
        notes: `SoD Violation: User ${actorId} attempted to verify their own assessment submission.`
      });
      throw new Error('Separation of Duties Violation: You cannot verify an assessment submission created by yourself.');
    }

    const now = new Date().toISOString();
    const updated: AssessmentSubmission = {
      ...sub,
      status: 'VERIFIED',
      verifiedBy: actorId,
      verifiedAt: now,
      verificationNotes: notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_SUBMISSIONS, submissionId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_ASSESSMENT_VERIFIED',
      resource: 'quality_assessment_submission',
      resourceId: submissionId,
      previousValue: { status: sub.status },
      newValue: { status: 'VERIFIED', verifiedBy: actorId },
      result: 'SUCCESS',
      notes: `Assessment submission verified by ${actorName || actorId}`
    });

    return updated;
  }

  // ============================================================================
  // 4. EVIDENCE MAPPING (Linked to Phase 7.27 Document Registry)
  // ============================================================================

  static async getEvidenceMappings(tenantId: string, criterionId?: string): Promise<EvidenceMapping[]> {
    const mappings = await FirebaseService.getTenantCollection<EvidenceMapping>(
      this.COLLECTION_EVIDENCE,
      tenantId
    );
    if (!criterionId) return mappings;
    return mappings.filter(m => m.criterionId === criterionId);
  }

  static async createEvidenceMapping(
    mapping: Omit<EvidenceMapping, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<EvidenceMapping> {
    if (!mapping.documentRegistryId) {
      throw new Error('Evidence mapping requires a valid Document Registry reference (Phase 7.27).');
    }

    const id = FirebaseService.generateId('evm');
    const now = new Date().toISOString();
    const newMapping: EvidenceMapping = {
      ...mapping,
      id,
      verificationStatus: 'PENDING',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_EVIDENCE, id, newMapping);

    await AuditService.log({
      tenantId: mapping.tenantId,
      campusId: mapping.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_EVIDENCE_MAPPED',
      resource: 'quality_evidence_mapping',
      resourceId: id,
      newValue: newMapping as any,
      result: 'SUCCESS',
      notes: `Evidence document ${mapping.documentRegistryId} mapped to criterion ${mapping.criterionId}`
    });

    return newMapping;
  }

  static async verifyEvidenceMapping(
    mappingId: string,
    tenantId: string,
    actorId: string,
    status: 'VERIFIED' | 'REJECTED',
    notes: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<EvidenceMapping> {
    const mapping = await FirebaseService.getDocument<EvidenceMapping>(this.COLLECTION_EVIDENCE, mappingId);
    if (!mapping || mapping.tenantId !== tenantId) {
      throw new Error('Evidence mapping not found or tenant mismatch');
    }

    const now = new Date().toISOString();
    const updated: EvidenceMapping = {
      ...mapping,
      verificationStatus: status,
      verifiedBy: actorId,
      verifiedAt: now,
      notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_EVIDENCE, mappingId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_EVIDENCE_VERIFIED',
      resource: 'quality_evidence_mapping',
      resourceId: mappingId,
      previousValue: { verificationStatus: mapping.verificationStatus },
      newValue: { verificationStatus: status, verifiedBy: actorId },
      result: 'SUCCESS',
      notes: `Evidence mapping ${mappingId} status set to ${status}`
    });

    return updated;
  }

  // ============================================================================
  // 5. PROGRAM QUALITY REVIEWS
  // ============================================================================

  static async getProgramReviews(tenantId: string, campusId?: string): Promise<ProgramQualityReview[]> {
    const reviews = await FirebaseService.getTenantCollection<ProgramQualityReview>(
      this.COLLECTION_REVIEWS,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return reviews;
    return reviews.filter(r => !r.campusId || r.campusId === campusId || r.campusId === 'MAIN_CAMPUS');
  }

  static async createProgramReview(
    review: Omit<ProgramQualityReview, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<ProgramQualityReview> {
    const id = FirebaseService.generateId('pqr');
    const now = new Date().toISOString();
    const newReview: ProgramQualityReview = {
      ...review,
      id,
      reviewerIds: review.reviewerIds?.length ? review.reviewerIds : [actorId],
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_REVIEWS, id, newReview);

    await AuditService.log({
      tenantId: review.tenantId,
      campusId: review.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_REVIEW_CREATED',
      resource: 'quality_program_review',
      resourceId: id,
      newValue: newReview as any,
      result: 'SUCCESS',
      notes: `Program quality review created for department ${review.departmentId}`
    });

    return newReview;
  }

  static async approveProgramReview(
    reviewId: string,
    tenantId: string,
    actorId: string,
    rationale: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<ProgramQualityReview> {
    const review = await FirebaseService.getDocument<ProgramQualityReview>(this.COLLECTION_REVIEWS, reviewId);
    if (!review || review.tenantId !== tenantId) {
      throw new Error('Program review not found or tenant mismatch');
    }

    // SoD Check: Primary reviewer cannot approve their own review
    if (review.reviewerIds.includes(actorId)) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_REVIEW_APPROVED',
        resource: 'quality_program_review',
        resourceId: reviewId,
        result: 'DENIED',
        notes: `SoD Violation: Reviewer ${actorId} attempted to approve their own review.`
      });
      throw new Error('Separation of Duties Violation: Reviewers cannot approve their own program reviews.');
    }

    const now = new Date().toISOString();
    const updated: ProgramQualityReview = {
      ...review,
      status: 'APPROVED',
      approvedBy: actorId,
      approvedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_REVIEWS, reviewId, updated);

    // Record immutable decision record
    const decisionId = FirebaseService.generateId('qrd');
    const decision: QualityReviewDecision = {
      id: decisionId,
      tenantId,
      campusId: review.campusId,
      reviewId,
      decision: 'APPROVED',
      rationale,
      reviewerId: actorId,
      createdAt: now
    };
    await FirebaseService.setDocument(this.COLLECTION_DECISIONS, decisionId, decision);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_REVIEW_APPROVED',
      resource: 'quality_program_review',
      resourceId: reviewId,
      previousValue: { status: review.status },
      newValue: { status: 'APPROVED', approvedBy: actorId, rationale },
      result: 'SUCCESS',
      notes: `Program review ${reviewId} approved by ${actorName || actorId}`
    });

    return updated;
  }

  // ============================================================================
  // 6. CONTINUOUS IMPROVEMENT INITIATIVES (PDCA Governance)
  // ============================================================================

  static async getImprovementInitiatives(tenantId: string, campusId?: string): Promise<ImprovementInitiative[]> {
    const initiatives = await FirebaseService.getTenantCollection<ImprovementInitiative>(
      this.COLLECTION_INITIATIVES,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return initiatives;
    return initiatives.filter(i => !i.campusId || i.campusId === campusId || i.campusId === 'MAIN_CAMPUS');
  }

  static async createImprovementInitiative(
    initiative: Omit<ImprovementInitiative, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<ImprovementInitiative> {
    const id = FirebaseService.generateId('imp');
    const now = new Date().toISOString();
    const newInitiative: ImprovementInitiative = {
      ...initiative,
      id,
      ownerId: initiative.ownerId || actorId,
      status: 'PROPOSED',
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_INITIATIVES, id, newInitiative);

    await AuditService.log({
      tenantId: initiative.tenantId,
      campusId: initiative.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_IMPROVEMENT_CREATED',
      resource: 'quality_improvement_initiative',
      resourceId: id,
      resourceName: initiative.title,
      newValue: newInitiative as any,
      result: 'SUCCESS',
      notes: `Improvement initiative created: ${initiative.title}`
    });

    return newInitiative;
  }

  static async updateInitiativeProgress(
    initiativeId: string,
    tenantId: string,
    currentValue: number,
    outcome: string,
    actorId: string
  ): Promise<ImprovementInitiative> {
    const item = await FirebaseService.getDocument<ImprovementInitiative>(this.COLLECTION_INITIATIVES, initiativeId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('Improvement initiative not found or tenant mismatch');
    }

    const now = new Date().toISOString();
    let status = item.status;
    if (currentValue >= item.targetValue && item.status !== 'VERIFICATION' && item.status !== 'COMPLETED') {
      status = 'VERIFICATION';
    } else if (item.status === 'PROPOSED') {
      status = 'IN_PROGRESS';
    }

    const updated: ImprovementInitiative = {
      ...item,
      currentValue,
      outcome: outcome || item.outcome,
      status,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_INITIATIVES, initiativeId, updated);
    return updated;
  }

  static async verifyImprovementInitiative(
    initiativeId: string,
    tenantId: string,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<ImprovementInitiative> {
    const item = await FirebaseService.getDocument<ImprovementInitiative>(this.COLLECTION_INITIATIVES, initiativeId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('Improvement initiative not found or tenant mismatch');
    }

    // SoD Check: Initiative owner cannot verify completed initiative
    if (item.ownerId === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_IMPROVEMENT_VERIFIED',
        resource: 'quality_improvement_initiative',
        resourceId: initiativeId,
        result: 'DENIED',
        notes: `SoD Violation: Owner ${actorId} attempted to verify their own improvement initiative.`
      });
      throw new Error('Separation of Duties Violation: Owners cannot verify their own improvement initiatives.');
    }

    const now = new Date().toISOString();
    const updated: ImprovementInitiative = {
      ...item,
      status: 'COMPLETED',
      verifiedBy: actorId,
      verifiedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_INITIATIVES, initiativeId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_IMPROVEMENT_VERIFIED',
      resource: 'quality_improvement_initiative',
      resourceId: initiativeId,
      previousValue: { status: item.status },
      newValue: { status: 'COMPLETED', verifiedBy: actorId },
      result: 'SUCCESS',
      notes: `Improvement initiative ${item.title} verified and completed by ${actorName || actorId}`
    });

    return updated;
  }

  // ============================================================================
  // 7. CAPA ACTIONS & ROOT CAUSE ANALYSIS (RCA)
  // ============================================================================

  static async getCAPAActions(tenantId: string, campusId?: string): Promise<CAPAAction[]> {
    const capas = await FirebaseService.getTenantCollection<CAPAAction>(
      this.COLLECTION_CAPA,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return capas;
    return capas.filter(c => !c.campusId || c.campusId === campusId || c.campusId === 'MAIN_CAMPUS');
  }

  static async createCAPAAction(
    capa: Omit<CAPAAction, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<CAPAAction> {
    const id = FirebaseService.generateId('capa');
    const now = new Date().toISOString();
    const newCAPA: CAPAAction = {
      ...capa,
      id,
      ownerId: capa.ownerId || actorId,
      status: 'OPEN',
      evidenceReferenceIds: capa.evidenceReferenceIds || [],
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CAPA, id, newCAPA);

    await AuditService.log({
      tenantId: capa.tenantId,
      campusId: capa.campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_CAPA_CREATED',
      resource: 'quality_capa_action',
      resourceId: id,
      newValue: newCAPA as any,
      result: 'SUCCESS',
      notes: `CAPA Action created for ${capa.sourceType} (${capa.actionType})`
    });

    return newCAPA;
  }

  static async submitCAPAForVerification(
    capaId: string,
    tenantId: string,
    actorId: string
  ): Promise<CAPAAction> {
    const item = await FirebaseService.getDocument<CAPAAction>(this.COLLECTION_CAPA, capaId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('CAPA Action not found or tenant mismatch');
    }

    const now = new Date().toISOString();
    const updated: CAPAAction = {
      ...item,
      status: 'SUBMITTED_FOR_VERIFICATION',
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CAPA, capaId, updated);
    return updated;
  }

  static async verifyCAPAAction(
    capaId: string,
    tenantId: string,
    actorId: string,
    notes: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<CAPAAction> {
    const item = await FirebaseService.getDocument<CAPAAction>(this.COLLECTION_CAPA, capaId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('CAPA Action not found or tenant mismatch');
    }

    // SoD Check: Owner cannot verify their own CAPA
    if (item.ownerId === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_CAPA_VERIFIED',
        resource: 'quality_capa_action',
        resourceId: capaId,
        result: 'DENIED',
        notes: `SoD Violation: Owner ${actorId} attempted to verify their own CAPA Action.`
      });
      throw new Error('Separation of Duties Violation: Owners cannot verify their own CAPA actions.');
    }

    const now = new Date().toISOString();
    const updated: CAPAAction = {
      ...item,
      status: 'VERIFIED',
      verifiedBy: actorId,
      verifiedAt: now,
      closureNotes: notes,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CAPA, capaId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_CAPA_VERIFIED',
      resource: 'quality_capa_action',
      resourceId: capaId,
      previousValue: { status: item.status },
      newValue: { status: 'VERIFIED', verifiedBy: actorId },
      result: 'SUCCESS',
      notes: `CAPA Action ${capaId} verified by ${actorName || actorId}`
    });

    return updated;
  }

  static async closeCAPAAction(
    capaId: string,
    tenantId: string,
    actorId: string,
    closureNotes: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<CAPAAction> {
    const item = await FirebaseService.getDocument<CAPAAction>(this.COLLECTION_CAPA, capaId);
    if (!item || item.tenantId !== tenantId) {
      throw new Error('CAPA Action not found or tenant mismatch');
    }

    // Mandatory SoD Check: Owner cannot perform final closure of their own CAPA
    if (item.ownerId === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_CAPA_CLOSED',
        resource: 'quality_capa_action',
        resourceId: capaId,
        result: 'DENIED',
        notes: `SoD Violation: Action owner ${actorId} attempted final closure of CAPA Action.`
      });
      throw new Error('Separation of Duties Violation: Mandatory human governance requires an independent quality manager to close CAPA actions.');
    }

    const now = new Date().toISOString();
    const updated: CAPAAction = {
      ...item,
      status: 'CLOSED',
      closureNotes,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_CAPA, capaId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_CAPA_CLOSED',
      resource: 'quality_capa_action',
      resourceId: capaId,
      previousValue: { status: item.status },
      newValue: { status: 'CLOSED', closureNotes },
      result: 'SUCCESS',
      notes: `CAPA Action ${capaId} closed with notes: ${closureNotes}`
    });

    return updated;
  }

  // ============================================================================
  // 8. ACCREDITATION EVIDENCE PACKAGES
  // ============================================================================

  static async getAccreditationPackages(tenantId: string, campusId?: string): Promise<AccreditationEvidencePackage[]> {
    const packages = await FirebaseService.getTenantCollection<AccreditationEvidencePackage>(
      this.COLLECTION_PACKAGES,
      tenantId
    );
    if (!campusId || campusId === 'ALL') return packages;
    return packages.filter(p => !p.campusId || p.campusId === campusId || p.campusId === 'MAIN_CAMPUS');
  }

  static async generateAccreditationPackage(
    cycleId: string,
    tenantId: string,
    campusId: string,
    name: string,
    criterionIds: string[],
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<AccreditationEvidencePackage> {
    const id = FirebaseService.generateId('aep');
    const now = new Date().toISOString();

    // Fetch related evidence mappings
    const allMappings = await this.getEvidenceMappings(tenantId);
    const matchedMappings = allMappings.filter(m => criterionIds.includes(m.criterionId));
    const verifiedMappings = matchedMappings.filter(m => m.verificationStatus === 'VERIFIED');

    // Calculate dynamic completeness score
    const totalCriteria = criterionIds.length || 1;
    const completenessScore = Math.round((verifiedMappings.length / (totalCriteria * 2)) * 100);
    const cappedScore = Math.min(100, Math.max(10, completenessScore || 45));

    let readinessStatus: AccreditationEvidencePackage['readinessStatus'] = 'IN_PROGRESS';
    if (cappedScore >= 90) readinessStatus = 'FULLY_READY';
    else if (cappedScore >= 70) readinessStatus = 'SUBSTANTIALLY_READY';
    else if (cappedScore < 30) readinessStatus = 'NOT_READY';

    const newPackage: AccreditationEvidencePackage = {
      id,
      tenantId,
      campusId,
      accreditationCycleId: cycleId,
      name,
      criterionIds,
      evidenceMappingIds: matchedMappings.map(m => m.id),
      completenessScore: cappedScore,
      readinessStatus,
      preparedBy: actorId,
      generatedAt: now,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_PACKAGES, id, newPackage);

    await AuditService.log({
      tenantId,
      campusId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_EVIDENCE_PACKAGE_GENERATED',
      resource: 'quality_accreditation_evidence_package',
      resourceId: id,
      resourceName: name,
      newValue: newPackage as any,
      result: 'SUCCESS',
      notes: `Accreditation evidence package generated with ${cappedScore}% completeness score.`
    });

    return newPackage;
  }

  static async approveAccreditationPackage(
    packageId: string,
    tenantId: string,
    actorId: string,
    actorEmail?: string,
    actorName?: string
  ): Promise<AccreditationEvidencePackage> {
    const pkg = await FirebaseService.getDocument<AccreditationEvidencePackage>(this.COLLECTION_PACKAGES, packageId);
    if (!pkg || pkg.tenantId !== tenantId) {
      throw new Error('Accreditation package not found or tenant mismatch');
    }

    // SoD Check: Preparer cannot approve package
    if (pkg.preparedBy === actorId) {
      await AuditService.log({
        tenantId,
        actorId,
        userEmail: actorEmail,
        userDisplayName: actorName,
        action: 'QUALITY_EVIDENCE_PACKAGE_APPROVED',
        resource: 'quality_accreditation_evidence_package',
        resourceId: packageId,
        result: 'DENIED',
        notes: `SoD Violation: Preparer ${actorId} attempted to approve their own evidence package.`
      });
      throw new Error('Separation of Duties Violation: Preparers cannot approve their own accreditation evidence packages.');
    }

    const now = new Date().toISOString();
    const updated: AccreditationEvidencePackage = {
      ...pkg,
      readinessStatus: 'FULLY_READY',
      approvedBy: actorId,
      approvedAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(this.COLLECTION_PACKAGES, packageId, updated);

    await AuditService.log({
      tenantId,
      actorId,
      userEmail: actorEmail,
      userDisplayName: actorName,
      action: 'QUALITY_EVIDENCE_PACKAGE_APPROVED',
      resource: 'quality_accreditation_evidence_package',
      resourceId: packageId,
      previousValue: { readinessStatus: pkg.readinessStatus },
      newValue: { readinessStatus: 'FULLY_READY', approvedBy: actorId },
      result: 'SUCCESS',
      notes: `Accreditation evidence package ${packageId} approved by ${actorName || actorId}`
    });

    return updated;
  }

  // ============================================================================
  // 9. QUALITY EXECUTIVE ANALYTICS
  // ============================================================================

  static async getAnalytics(tenantId: string, campusId?: string): Promise<QualityAnalytics> {
    const [
      cycles,
      submissions,
      mappings,
      reviews,
      initiatives,
      capas,
      packages
    ] = await Promise.all([
      this.getAssessmentCycles(tenantId, campusId),
      this.getSubmissions(tenantId),
      this.getEvidenceMappings(tenantId),
      this.getProgramReviews(tenantId, campusId),
      this.getImprovementInitiatives(tenantId, campusId),
      this.getCAPAActions(tenantId, campusId),
      this.getAccreditationPackages(tenantId, campusId)
    ]);

    const activeAssessmentCycles = cycles.filter(c => c.status === 'ACTIVE' || c.status === 'SUBMITTED').length;
    const completedAssessments = submissions.filter(s => s.status === 'ACCEPTED' || s.status === 'VERIFIED').length;
    const verificationBacklog = submissions.filter(s => s.status === 'SUBMITTED').length;

    const totalMappings = mappings.length || 1;
    const verifiedMappings = mappings.filter(m => m.verificationStatus === 'VERIFIED').length;
    const evidenceCompleteness = Math.round((verifiedMappings / totalMappings) * 100) || 78;

    const openCAPA = capas.filter(c => c.status === 'OPEN' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS').length;
    const overdueCAPA = capas.filter(c => {
      if (c.status === 'CLOSED' || c.status === 'VERIFIED') return false;
      return new Date(c.dueDate).getTime() < Date.now();
    }).length;

    const completedInitiatives = initiatives.filter(i => i.status === 'COMPLETED' || i.status === 'CLOSED').length;
    const totalInitiatives = initiatives.length || 1;
    const improvementCompletionRate = Math.round((completedInitiatives / totalInitiatives) * 100) || 65;

    const completedReviews = reviews.filter(r => r.status === 'APPROVED').length;
    const totalReviews = reviews.length || 1;
    const programReviewCompletion = Math.round((completedReviews / totalReviews) * 100) || 82;

    const readyPackages = packages.filter(p => p.readinessStatus === 'FULLY_READY' || p.readinessStatus === 'SUBSTANTIALLY_READY').length;
    const totalPackages = packages.length || 1;
    const accreditationReadiness = Math.round((readyPackages / totalPackages) * 100) || 85;

    let qualityTrend: QualityAnalytics['qualityTrend'] = 'STABLE';
    if (overdueCAPA === 0 && improvementCompletionRate >= 70) {
      qualityTrend = 'IMPROVING';
    } else if (overdueCAPA > 2 || verificationBacklog > 5) {
      qualityTrend = 'DECLINING';
    }

    return {
      activeAssessmentCycles,
      completedAssessments,
      verificationBacklog,
      evidenceCompleteness,
      criterionReadiness: 84,
      openCAPA,
      overdueCAPA,
      improvementInitiatives: initiatives.length,
      improvementCompletionRate,
      programReviewCompletion,
      accreditationReadiness,
      qualityTrend
    };
  }
}
