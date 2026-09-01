// EMS Phase 7.35 Service: Institutional Accreditation, Regulatory Submission & External Review Governance Engine

import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import {
  AccreditationBody,
  AccreditationCriterion,
  AccreditationCycle,
  AccreditationSubmission,
  SubmissionVersion,
  CriterionResponse,
  EvidenceMapping,
  ReviewVisit,
  ReviewFinding,
  InstitutionalCommitment,
  RegulatoryInspection,
  AccreditationCorrespondence,
  AccreditationDecision,
  AccreditationCertificate,
  AccreditationAnalytics,
  AccreditationCycleStatus,
  AccreditationSubmissionStatus,
  FindingLifecycleStatus,
  RegulatoryInspectionStatus,
  EvidenceVerificationStatus
} from '../types/accreditationReview';

// Audit helper
async function logAudit(
  tenantId: string,
  actorId: string,
  action: string,
  targetEntityId: string,
  details: Record<string, any>,
  justification?: string
) {
  try {
    const auditRef = doc(collection(db, 'audit_logs'));
    await setDoc(auditRef, {
      id: auditRef.id,
      tenantId,
      actorId,
      action,
      targetEntityId,
      details,
      justification: justification || null,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Audit log write error:', err);
  }
}

export class AccreditationReviewService {

  // ============================================================================
  // 1. ACCREDITATION BODY & FRAMEWORK REGISTRY
  // ============================================================================

  static async getAccreditationBodies(tenantId: string): Promise<AccreditationBody[]> {
    const q = query(
      collection(db, 'accreditation_bodies'),
      where('tenantId', '==', tenantId)
    );
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as AccreditationBody);
  }

  static async createAccreditationBody(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationBody, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<AccreditationBody> {
    const bodyRef = doc(collection(db, 'accreditation_bodies'));
    const newBody: AccreditationBody = {
      ...data,
      id: bodyRef.id,
      tenantId,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(bodyRef, newBody);
    await logAudit(tenantId, actorId, 'ACCREDITATION_BODY_CREATED', bodyRef.id, { code: newBody.code, name: newBody.name });
    return newBody;
  }

  static async getCriteria(tenantId: string, accreditationBodyId?: string): Promise<AccreditationCriterion[]> {
    let q = query(
      collection(db, 'accreditation_criteria'),
      where('tenantId', '==', tenantId)
    );
    if (accreditationBodyId) {
      q = query(
        collection(db, 'accreditation_criteria'),
        where('tenantId', '==', tenantId),
        where('accreditationBodyId', '==', accreditationBodyId)
      );
    }
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as AccreditationCriterion);
  }

  static async createCriterion(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationCriterion, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<AccreditationCriterion> {
    const ref = doc(collection(db, 'accreditation_criteria'));
    const item: AccreditationCriterion = {
      ...data,
      id: ref.id,
      tenantId,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, item);
    await logAudit(tenantId, actorId, 'ACCREDITATION_CRITERION_CREATED', ref.id, { code: item.criterionCode, title: item.title });
    return item;
  }

  // ============================================================================
  // 2. ACCREDITATION CYCLE LIFECYCLE
  // ============================================================================

  private static ALLOWED_CYCLE_TRANSITIONS: Record<AccreditationCycleStatus, AccreditationCycleStatus[]> = {
    DRAFT: ['PLANNED', 'CLOSED'],
    PLANNED: ['SELF_STUDY', 'DRAFT', 'CLOSED'],
    SELF_STUDY: ['SUBMITTED', 'PLANNED'],
    SUBMITTED: ['UNDER_REVIEW', 'SELF_STUDY'],
    UNDER_REVIEW: ['REVIEW_COMPLETED'],
    REVIEW_COMPLETED: ['DECISION_PENDING'],
    DECISION_PENDING: ['ACCREDITED', 'CONDITIONAL', 'CLOSED'],
    ACCREDITED: ['EXPIRED', 'CLOSED'],
    CONDITIONAL: ['EXPIRED', 'CLOSED'],
    EXPIRED: ['CLOSED'],
    CLOSED: []
  };

  static async getCycles(tenantId: string, campusId?: string): Promise<AccreditationCycle[]> {
    let q = query(collection(db, 'accreditation_cycles'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    let results = (snap.docs || []).map(d => d.data() as AccreditationCycle);
    if (campusId && campusId !== 'all') {
      results = results.filter(c => !c.campusId || c.campusId === campusId);
    }
    return results;
  }

  static async createCycle(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationCycle, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status'>
  ): Promise<AccreditationCycle> {
    const ref = doc(collection(db, 'accreditation_cycles'));
    const cycle: AccreditationCycle = {
      ...data,
      id: ref.id,
      tenantId,
      status: 'DRAFT',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, cycle);
    await logAudit(tenantId, actorId, 'ACCREDITATION_CYCLE_CREATED', ref.id, { title: cycle.title, bodyId: cycle.accreditationBodyId });
    return cycle;
  }

  static async updateCycleStatus(
    tenantId: string,
    actorId: string,
    cycleId: string,
    targetStatus: AccreditationCycleStatus,
    justification?: string,
    isSuperAdmin?: boolean
  ): Promise<AccreditationCycle> {
    const ref = doc(db, 'accreditation_cycles', cycleId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Accreditation Cycle not found');
    const cycle = snap.data() as AccreditationCycle;

    if (cycle.tenantId !== tenantId) {
      throw new Error('Tenant isolation violation: Cross-tenant operation blocked');
    }

    // Check transition
    const allowed = this.ALLOWED_CYCLE_TRANSITIONS[cycle.status] || [];
    if (!allowed.includes(targetStatus) && !isSuperAdmin) {
      throw new Error(`Invalid Cycle status transition from ${cycle.status} to ${targetStatus}`);
    }

    const updated = {
      ...cycle,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
      ...(targetStatus === 'CLOSED' ? { completionDate: new Date().toISOString() } : {})
    };

    await updateDoc(ref, { status: targetStatus, updatedAt: updated.updatedAt });
    await logAudit(tenantId, actorId, 'ACCREDITATION_CYCLE_STATUS_UPDATED', cycleId, { from: cycle.status, to: targetStatus }, justification);
    return updated;
  }

  // ============================================================================
  // 3. SUBMISSION ENGINE & SOD
  // ============================================================================

  private static ALLOWED_SUBMISSION_TRANSITIONS: Record<AccreditationSubmissionStatus, AccreditationSubmissionStatus[]> = {
    DRAFT: ['INTERNAL_REVIEW', 'ARCHIVED'],
    INTERNAL_REVIEW: ['APPROVED', 'DRAFT'],
    APPROVED: ['SUBMITTED', 'INTERNAL_REVIEW'],
    SUBMITTED: ['ACKNOWLEDGED', 'UNDER_EXTERNAL_REVIEW'],
    ACKNOWLEDGED: ['UNDER_EXTERNAL_REVIEW'],
    UNDER_EXTERNAL_REVIEW: ['DECIDED'],
    DECIDED: ['ARCHIVED'],
    ARCHIVED: []
  };

  static async getSubmissions(tenantId: string, cycleId?: string): Promise<AccreditationSubmission[]> {
    let q = query(collection(db, 'accreditation_submissions'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    let results = (snap.docs || []).map(d => d.data() as AccreditationSubmission);
    if (cycleId) {
      results = results.filter(s => s.cycleId === cycleId);
    }
    return results;
  }

  static async createSubmission(
    tenantId: string,
    actorId: string,
    data: { cycleId: string; title: string; submissionCode: string; campusId?: string }
  ): Promise<AccreditationSubmission> {
    // Check for duplicate submission code
    const existingQ = query(
      collection(db, 'accreditation_submissions'),
      where('tenantId', '==', tenantId),
      where('submissionCode', '==', data.submissionCode)
    );
    const existingSnap = await getDocs(existingQ);
    if (!existingSnap.empty) {
      throw new Error(`Duplicate submission code: ${data.submissionCode} already exists.`);
    }

    const ref = doc(collection(db, 'accreditation_submissions'));
    const initialVersion: SubmissionVersion = {
      versionNumber: 1,
      title: 'Initial Self-Study Draft',
      compiledAt: new Date().toISOString(),
      compiledBy: actorId,
      changeSummary: 'Created initial submission draft',
      isLocked: false,
      approvalStatus: 'DRAFT'
    };

    const sub: AccreditationSubmission = {
      id: ref.id,
      tenantId,
      campusId: data.campusId,
      cycleId: data.cycleId,
      title: data.title,
      submissionCode: data.submissionCode,
      currentVersion: 1,
      versions: [initialVersion],
      status: 'DRAFT',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, sub);
    await logAudit(tenantId, actorId, 'ACCREDITATION_SUBMISSION_CREATED', ref.id, { submissionCode: sub.submissionCode });
    return sub;
  }

  static async approveSubmissionInternal(
    tenantId: string,
    actorId: string,
    submissionId: string,
    userRoles: string[],
    justification?: string
  ): Promise<AccreditationSubmission> {
    const ref = doc(db, 'accreditation_submissions', submissionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Submission not found');
    const sub = snap.data() as AccreditationSubmission;

    if (sub.tenantId !== tenantId) {
      throw new Error('Tenant isolation error: Cross-tenant access forbidden');
    }

    // MANDATORY SEPARATION OF DUTIES (SoD)
    // Submission creator cannot approve submission
    if (sub.createdBy === actorId && !userRoles.includes('PLATFORM_SUPER_ADMIN') && !userRoles.includes('super_admin')) {
      throw new Error('Separation of Duties (SoD) Violation: Submission creator cannot approve their own submission.');
    }

    const currentV = sub.versions.find(v => v.versionNumber === sub.currentVersion);
    if (!currentV) throw new Error('Current submission version invalid');

    const updatedVersions = (sub.versions || []).map(v => {
      if (v.versionNumber === sub.currentVersion) {
        return {
          ...v,
          isLocked: true,
          approvalStatus: 'APPROVED' as const,
          approvedBy: actorId,
          approvedAt: new Date().toISOString()
        };
      }
      return v;
    });

    const updated: AccreditationSubmission = {
      ...sub,
      status: 'APPROVED',
      versions: updatedVersions,
      internalApprovedAt: new Date().toISOString(),
      internalApprovedBy: actorId,
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'ACCREDITATION_SUBMISSION_APPROVED', submissionId, { version: sub.currentVersion }, justification);
    return updated;
  }

  static async submitExternal(
    tenantId: string,
    actorId: string,
    submissionId: string,
    externalRefNumber: string
  ): Promise<AccreditationSubmission> {
    const ref = doc(db, 'accreditation_submissions', submissionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Submission not found');
    const sub = snap.data() as AccreditationSubmission;

    if (sub.status !== 'APPROVED') {
      throw new Error('Submission must be approved internally before external submission.');
    }

    const updated: AccreditationSubmission = {
      ...sub,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      submittedBy: actorId,
      externalRefNumber,
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'ACCREDITATION_SUBMISSION_SUBMITTED', submissionId, { externalRefNumber });
    return updated;
  }

  // ============================================================================
  // 4. EVIDENCE GOVERNANCE & DEFECT DETECTION
  // ============================================================================

  static async getEvidenceMappings(tenantId: string, criterionId?: string): Promise<EvidenceMapping[]> {
    let q = query(collection(db, 'accreditation_evidence'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    let results = (snap.docs || []).map(d => d.data() as EvidenceMapping);
    if (criterionId) {
      results = results.filter(e => e.criterionId === criterionId);
    }

    // Dynamic Defect Detection
    const now = new Date();
    results = (results || []).map(item => {
      const defects: ('MISSING' | 'EXPIRED' | 'UNVERIFIED' | 'ORPHAN' | 'WRONG_CRITERION' | 'DUPLICATE')[] = [];
      if (!item.documentRegistryId) defects.push('MISSING');
      if (item.validTo && new Date(item.validTo) < now) defects.push('EXPIRED');
      if (item.verificationStatus === 'PENDING') defects.push('UNVERIFIED');
      
      // Duplicate detection
      const duplicates = results.filter(r => r.criterionId === item.criterionId && r.documentRegistryId === item.documentRegistryId);
      if (duplicates.length > 1) defects.push('DUPLICATE');

      return {
        ...item,
        defectFlags: defects
      };
    });

    return results;
  }

  static async mapEvidence(
    tenantId: string,
    actorId: string,
    data: Omit<EvidenceMapping, 'id' | 'tenantId' | 'mappedBy' | 'mappedAt' | 'verificationStatus' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<EvidenceMapping> {
    // Check for duplicate evidence mapping
    const q = query(
      collection(db, 'accreditation_evidence'),
      where('tenantId', '==', tenantId),
      where('criterionId', '==', data.criterionId),
      where('documentRegistryId', '==', data.documentRegistryId)
    );
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error('Duplicate Evidence Mapping: Document is already mapped to this criterion.');
    }

    const ref = doc(collection(db, 'accreditation_evidence'));
    const mapping: EvidenceMapping = {
      ...data,
      id: ref.id,
      tenantId,
      mappedBy: actorId,
      mappedAt: new Date().toISOString(),
      verificationStatus: 'PENDING',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, mapping);
    await logAudit(tenantId, actorId, 'ACCREDITATION_EVIDENCE_MAPPED', ref.id, { criterionId: mapping.criterionId, docId: mapping.documentRegistryId });
    return mapping;
  }

  static async verifyEvidence(
    tenantId: string,
    actorId: string,
    evidenceId: string,
    isApproved: boolean,
    userRoles: string[],
    rejectionReason?: string
  ): Promise<EvidenceMapping> {
    const ref = doc(db, 'accreditation_evidence', evidenceId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Evidence mapping not found');
    const item = snap.data() as EvidenceMapping;

    if (item.tenantId !== tenantId) throw new Error('Tenant isolation violation');

    // SEPARATION OF DUTIES: Mapper cannot verify their own evidence mapping
    if (item.mappedBy === actorId && !userRoles.includes('PLATFORM_SUPER_ADMIN') && !userRoles.includes('super_admin')) {
      throw new Error('Separation of Duties (SoD) Violation: Evidence mapper cannot verify their own mapped evidence.');
    }

    const updated: EvidenceMapping = {
      ...item,
      verificationStatus: isApproved ? 'VERIFIED' : 'REJECTED',
      verifiedBy: actorId,
      verifiedAt: new Date().toISOString(),
      ...(rejectionReason ? { rejectionReason } : {}),
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'ACCREDITATION_EVIDENCE_VERIFIED', evidenceId, { status: updated.verificationStatus });
    return updated;
  }

  // ============================================================================
  // 5. EXTERNAL REVIEW / PEER REVIEW ENGINE
  // ============================================================================

  static async getReviewVisits(tenantId: string, cycleId?: string): Promise<ReviewVisit[]> {
    let q = query(collection(db, 'external_reviews'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    let results = (snap.docs || []).map(d => d.data() as ReviewVisit);
    if (cycleId) {
      results = results.filter(r => r.cycleId === cycleId);
    }
    return results;
  }

  static async createReviewVisit(
    tenantId: string,
    actorId: string,
    data: Omit<ReviewVisit, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status'>
  ): Promise<ReviewVisit> {
    const ref = doc(collection(db, 'external_reviews'));
    const visit: ReviewVisit = {
      ...data,
      id: ref.id,
      tenantId,
      status: 'SCHEDULED',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, visit);
    await logAudit(tenantId, actorId, 'ACCREDITATION_REVIEW_SCHEDULED', ref.id, { title: visit.reviewTitle });
    return visit;
  }

  // ============================================================================
  // 6. FINDINGS & RECOMMENDATIONS
  // ============================================================================

  static async getFindings(tenantId: string): Promise<ReviewFinding[]> {
    const q = query(collection(db, 'accreditation_findings'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as ReviewFinding);
  }

  static async createFinding(
    tenantId: string,
    actorId: string,
    data: Omit<ReviewFinding, 'id' | 'tenantId' | 'priorityScore' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status'>
  ): Promise<ReviewFinding> {
    const ref = doc(collection(db, 'accreditation_findings'));
    
    // Priority score calculation: CRITICAL=100, HIGH=75, MEDIUM=50, LOW=25
    const severityWeight: Record<string, number> = { CRITICAL: 100, HIGH: 75, MEDIUM: 50, LOW: 25 };
    const priorityScore = severityWeight[data.severity] || 50;

    const finding: ReviewFinding = {
      ...data,
      id: ref.id,
      tenantId,
      priorityScore,
      status: 'OPEN',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, finding);
    await logAudit(tenantId, actorId, 'ACCREDITATION_FINDING_CREATED', ref.id, { title: finding.title, severity: finding.severity });
    return finding;
  }

  static async closeFinding(
    tenantId: string,
    actorId: string,
    findingId: string,
    remediationEvidenceDocRegistryId: string,
    closureNotes: string,
    userRoles: string[]
  ): Promise<ReviewFinding> {
    if (!remediationEvidenceDocRegistryId) {
      throw new Error('Finding closure requires valid remediation evidence document reference.');
    }

    const ref = doc(db, 'accreditation_findings', findingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Finding not found');
    const finding = snap.data() as ReviewFinding;

    // SEPARATION OF DUTIES: Creator cannot close their own finding
    if (finding.createdBy === actorId && !userRoles.includes('PLATFORM_SUPER_ADMIN') && !userRoles.includes('super_admin')) {
      throw new Error('Separation of Duties (SoD) Violation: Finding creator cannot close their own finding.');
    }

    const updated: ReviewFinding = {
      ...finding,
      status: 'CLOSED',
      closedAt: new Date().toISOString(),
      closedBy: actorId,
      remediationEvidenceDocRegistryId,
      closureVerificationNotes: closureNotes,
      updatedAt: new Date().toISOString()
    };

    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'ACCREDITATION_FINDING_VERIFIED', findingId, { closedBy: actorId });
    return updated;
  }

  // ============================================================================
  // 7. INSTITUTIONAL COMMITMENTS
  // ============================================================================

  static async getCommitments(tenantId: string): Promise<InstitutionalCommitment[]> {
    const q = query(collection(db, 'institutional_commitments'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    const now = new Date();
    return (snap.docs || []).map(d => {
      const data = d.data() as InstitutionalCommitment;
      const isOverdue = data.status !== 'CLOSED' && new Date(data.targetCompletionDate) < now;
      return {
        ...data,
        isOverdue
      };
    });
  }

  static async createCommitment(
    tenantId: string,
    actorId: string,
    data: Omit<InstitutionalCommitment, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'progressPercentage'>
  ): Promise<InstitutionalCommitment> {
    const ref = doc(collection(db, 'institutional_commitments'));
    const commitment: InstitutionalCommitment = {
      ...data,
      id: ref.id,
      tenantId,
      progressPercentage: 0,
      status: 'PLANNED',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, commitment);
    await logAudit(tenantId, actorId, 'ACCREDITATION_COMMITMENT_CREATED', ref.id, { title: commitment.commitmentTitle });
    return commitment;
  }

  static async verifyAndCloseCommitment(
    tenantId: string,
    actorId: string,
    commitmentId: string,
    userRoles: string[]
  ): Promise<InstitutionalCommitment> {
    const ref = doc(db, 'institutional_commitments', commitmentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Commitment not found');
    const item = snap.data() as InstitutionalCommitment;

    if (item.createdBy === actorId && !userRoles.includes('PLATFORM_SUPER_ADMIN') && !userRoles.includes('super_admin')) {
      throw new Error('Separation of Duties (SoD) Violation: Commitment creator cannot verify/close their own commitment.');
    }

    const updated: InstitutionalCommitment = {
      ...item,
      status: 'CLOSED',
      progressPercentage: 100,
      verifiedBy: actorId,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'ACCREDITATION_COMMITMENT_CLOSED', commitmentId, { verifiedBy: actorId });
    return updated;
  }

  // ============================================================================
  // 8. REGULATORY INSPECTIONS
  // ============================================================================

  static async getInspections(tenantId: string): Promise<RegulatoryInspection[]> {
    const q = query(collection(db, 'regulatory_inspections'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as RegulatoryInspection);
  }

  static async createInspection(
    tenantId: string,
    actorId: string,
    data: Omit<RegulatoryInspection, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'findings'>
  ): Promise<RegulatoryInspection> {
    const ref = doc(collection(db, 'regulatory_inspections'));
    const insp: RegulatoryInspection = {
      ...data,
      id: ref.id,
      tenantId,
      findings: [],
      status: 'PLANNED',
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, insp);
    await logAudit(tenantId, actorId, 'REGULATORY_INSPECTION_CREATED', ref.id, { body: insp.regulatoryBody, type: insp.inspectionType });
    return insp;
  }

  static async submitInspectionResponse(
    tenantId: string,
    actorId: string,
    inspectionId: string,
    responseNarrative: string
  ): Promise<RegulatoryInspection> {
    const ref = doc(db, 'regulatory_inspections', inspectionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Inspection not found');
    const insp = snap.data() as RegulatoryInspection;

    const updated: RegulatoryInspection = {
      ...insp,
      submittedResponseNarrative: responseNarrative,
      responseSubmittedAt: new Date().toISOString(),
      responseSubmittedBy: actorId,
      status: 'RESPONSE_SUBMITTED',
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, updated);
    return updated;
  }

  static async approveInspectionResponse(
    tenantId: string,
    actorId: string,
    inspectionId: string,
    userRoles: string[]
  ): Promise<RegulatoryInspection> {
    const ref = doc(db, 'regulatory_inspections', inspectionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Inspection not found');
    const insp = snap.data() as RegulatoryInspection;

    // SEPARATION OF DUTIES: Response submitter cannot approve their own inspection response
    if (insp.responseSubmittedBy === actorId && !userRoles.includes('PLATFORM_SUPER_ADMIN') && !userRoles.includes('super_admin')) {
      throw new Error('Separation of Duties (SoD) Violation: Inspection response submitter cannot approve their own response.');
    }

    const updated: RegulatoryInspection = {
      ...insp,
      responseApprovedBy: actorId,
      status: 'CLOSED',
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, updated);
    await logAudit(tenantId, actorId, 'REGULATORY_INSPECTION_COMPLETED', inspectionId, { approvedBy: actorId });
    return updated;
  }

  // ============================================================================
  // 9. CORRESPONDENCE GOVERNANCE
  // ============================================================================

  static async getCorrespondence(tenantId: string): Promise<AccreditationCorrespondence[]> {
    const q = query(collection(db, 'accreditation_correspondence'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as AccreditationCorrespondence);
  }

  static async createCorrespondence(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationCorrespondence, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<AccreditationCorrespondence> {
    if (!data.documentRegistryId) {
      throw new Error('Correspondence must reference an authoritative Document Registry ID.');
    }

    const ref = doc(collection(db, 'accreditation_correspondence'));
    const item: AccreditationCorrespondence = {
      ...data,
      id: ref.id,
      tenantId,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, item);
    await logAudit(tenantId, actorId, 'ACCREDITATION_CORRESPONDENCE_CREATED', ref.id, { refNum: item.referenceNumber });
    return item;
  }

  // ============================================================================
  // 10. ACCREDITATION DECISIONS
  // ============================================================================

  static async getDecisions(tenantId: string): Promise<AccreditationDecision[]> {
    const q = query(collection(db, 'accreditation_decisions'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return (snap.docs || []).map(d => d.data() as AccreditationDecision);
  }

  static async recordDecision(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationDecision, 'id' | 'tenantId' | 'recordedBy' | 'recordedAt' | 'isImmutable' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<AccreditationDecision> {
    // SoD: Authorized By cannot equal Recorded By
    if (data.authorizedBy === actorId) {
      throw new Error('Separation of Duties (SoD) Violation: Decision recorder cannot authorize their own decision record.');
    }

    const ref = doc(collection(db, 'accreditation_decisions'));
    const decision: AccreditationDecision = {
      ...data,
      id: ref.id,
      tenantId,
      recordedBy: actorId,
      recordedAt: new Date().toISOString(),
      isImmutable: true,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, decision);
    await logAudit(tenantId, actorId, 'ACCREDITATION_DECISION_RECORDED', ref.id, { decisionType: decision.decisionType, grade: decision.officialGradeOrCGPA });
    return decision;
  }

  // ============================================================================
  // 11. ACCREDITATION CERTIFICATES
  // ============================================================================

  static async getCertificates(tenantId: string): Promise<AccreditationCertificate[]> {
    const q = query(collection(db, 'accreditation_certificates'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    const now = new Date();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

    return (snap.docs || []).map(d => {
      const cert = d.data() as AccreditationCertificate;
      const expDate = new Date(cert.expiryDate);
      const isExpired = expDate < now;
      const isExpiringSoon = !isExpired && (expDate.getTime() - now.getTime()) <= ninetyDaysMs;
      
      let status: AccreditationCertificate['status'] = cert.status;
      if (isExpired) status = 'EXPIRED';
      else if (isExpiringSoon) status = 'EXPIRING_SOON';

      return {
        ...cert,
        isExpired,
        isExpiringSoon,
        status
      };
    });
  }

  static async registerCertificate(
    tenantId: string,
    actorId: string,
    data: Omit<AccreditationCertificate, 'id' | 'tenantId' | 'isExpiringSoon' | 'isExpired' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<AccreditationCertificate> {
    if (!data.documentRegistryId) {
      throw new Error('Accreditation Certificate must reference authoritative Document Registry document.');
    }

    const ref = doc(collection(db, 'accreditation_certificates'));
    const cert: AccreditationCertificate = {
      ...data,
      id: ref.id,
      tenantId,
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(ref, cert);
    await logAudit(tenantId, actorId, 'ACCREDITATION_CERTIFICATE_REGISTERED', ref.id, { certificateNumber: cert.certificateNumber });
    return cert;
  }

  // ============================================================================
  // 12. DYNAMIC ANALYTICS & RISK READINESS ENGINE
  // ============================================================================

  static async computeAnalytics(tenantId: string, campusId?: string): Promise<AccreditationAnalytics> {
    const cycles = await this.getCycles(tenantId, campusId);
    const submissions = await this.getSubmissions(tenantId);
    const evidenceList = await this.getEvidenceMappings(tenantId);
    const findings = await this.getFindings(tenantId);
    const commitments = await this.getCommitments(tenantId);
    const inspections = await this.getInspections(tenantId);
    const certs = await this.getCertificates(tenantId);

    // Filter by campus if applicable
    const filteredFindings = campusId && campusId !== 'all' ? findings.filter(f => !f.campusId || f.campusId === campusId) : findings;
    const filteredCommitments = campusId && campusId !== 'all' ? commitments.filter(c => !c.campusId || c.campusId === campusId) : commitments;

    const activeCyclesCount = cycles.filter(c => c.status !== 'CLOSED' && c.status !== 'EXPIRED').length;
    
    // Submissions completion
    const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED' || s.status === 'SUBMITTED' || s.status === 'DECIDED').length;
    const submissionCompletionPercentage = submissions.length === 0 ? 0 : Math.round((approvedSubmissions / submissions.length) * 100);

    // Evidence completeness & verification backlog
    const verifiedEvidence = evidenceList.filter(e => e.verificationStatus === 'VERIFIED').length;
    const evidenceVerificationBacklogCount = evidenceList.filter(e => e.verificationStatus === 'PENDING').length;
    const evidenceCompletenessPercentage = evidenceList.length === 0 ? 0 : Math.round((verifiedEvidence / evidenceList.length) * 100);

    // Open findings & overdue commitments
    const openFindingsCount = filteredFindings.filter(f => f.status !== 'CLOSED').length;
    const openCriticalOrHighFindings = filteredFindings.filter(f => f.status !== 'CLOSED' && (f.severity === 'CRITICAL' || f.severity === 'HIGH')).length;
    const overdueCommitmentsCount = filteredCommitments.filter(c => c.isOverdue).length;

    // CAPA closure rate
    const closedFindings = filteredFindings.filter(f => f.status === 'CLOSED').length;
    const capaClosureRatePercentage = filteredFindings.length === 0 ? 100 : Math.round((closedFindings / filteredFindings.length) * 100);

    // Inspection readiness
    const completedInspections = inspections.filter(i => i.status === 'CLOSED').length;
    const inspectionReadinessScore = inspections.length === 0 ? 100 : Math.round((completedInspections / inspections.length) * 100);

    // Expiry horizon
    let minDaysToExpiry: number | undefined = undefined;
    const now = new Date();
    certs.forEach(cert => {
      const days = Math.ceil((new Date(cert.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (minDaysToExpiry === undefined || days < minDaysToExpiry) {
        minDaysToExpiry = days;
      }
    });

    // DETERMINISTIC READINESS SCORE (0 to 100)
    // 35% Evidence completeness + 25% Submissions + 20% CAPA closure + 20% Inspection readiness - penalties
    let readinessBase = (0.35 * evidenceCompletenessPercentage) + (0.25 * submissionCompletionPercentage) + (0.20 * capaClosureRatePercentage) + (0.20 * inspectionReadinessScore);
    const penalty = (openCriticalOrHighFindings * 10) + (overdueCommitmentsCount * 8);
    const overallReviewReadinessScore = Math.max(0, Math.min(100, Math.round(readinessBase - penalty)));

    // Risk indicator
    let accreditationRiskIndicator: AccreditationAnalytics['accreditationRiskIndicator'] = 'LOW';
    if (overallReviewReadinessScore < 50 || openCriticalOrHighFindings > 2 || overdueCommitmentsCount > 3) {
      accreditationRiskIndicator = 'CRITICAL';
    } else if (overallReviewReadinessScore < 70 || openCriticalOrHighFindings > 0 || overdueCommitmentsCount > 0) {
      accreditationRiskIndicator = 'HIGH';
    } else if (overallReviewReadinessScore < 85) {
      accreditationRiskIndicator = 'MEDIUM';
    }

    return {
      activeCyclesCount,
      submissionCompletionPercentage,
      evidenceCompletenessPercentage,
      evidenceVerificationBacklogCount,
      openFindingsCount,
      overdueCommitmentsCount,
      overallReviewReadinessScore,
      criterionReadinessPercentage: evidenceCompletenessPercentage,
      inspectionReadinessScore,
      accreditationExpiryHorizonDays: minDaysToExpiry,
      capaClosureRatePercentage,
      accreditationRiskIndicator
    };
  }
}
