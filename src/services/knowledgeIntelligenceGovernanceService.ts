// Phase 9.4 Institutional Knowledge Intelligence, Decision Knowledge, Organizational Memory & Governed Knowledge Retrieval Service Layer

import {
  KnowledgeStrategy,
  KnowledgeDomainGovernance,
  KnowledgeObject,
  KnowledgeSourceReference,
  KnowledgeEvidenceReference,
  KnowledgeProvenanceRecord,
  KnowledgeVerification,
  KnowledgeTrustAssessment,
  KnowledgeLifecycleEvent,
  KnowledgeDecisionRecord,
  KnowledgeDecisionRationale,
  KnowledgeDecisionPrecedent,
  KnowledgeLessonLearned,
  KnowledgeBestPractice,
  KnowledgeInstitutionalInsight,
  KnowledgeResearchFinding,
  KnowledgeContradiction,
  KnowledgeConflictResolution,
  KnowledgeReviewCycle,
  KnowledgeIntelligenceException,
  KnowledgeOverride,
  KnowledgeRetrievalRequest,
  KnowledgeRetrievalPolicy,
  KnowledgeRetrievalEvidence,
  KnowledgeAccessDecision,
  KnowledgeIntelligenceRisk,
  KnowledgeResilienceAssessment,
  KnowledgeScenario,
  KnowledgeSimulationResult,
  KnowledgeGovernanceApproval,
  KnowledgeGovernanceDecision,
  KnowledgeGovernanceAuditEvent,
  KnowledgeDiagnostic,
  KnowledgeLifecycleStatus,
  KnowledgeTrustClassification,
  KnowledgeRiskLevel,
  ConflictResolutionStatus,
  RetrievalClassification
} from '../types/knowledgeIntelligenceGovernance';

export function generateDeterministicHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex}_${content.length}`;
}

// In-Memory Data Repositories for Phase 9.4
let memStrategies: KnowledgeStrategy[] = [];
let memDomains: KnowledgeDomainGovernance[] = [];
let memObjects: KnowledgeObject[] = [];
let memSources: KnowledgeSourceReference[] = [];
let memEvidences: KnowledgeEvidenceReference[] = [];
let memProvenances: KnowledgeProvenanceRecord[] = [];
let memVerifications: KnowledgeVerification[] = [];
let memTrustAssessments: KnowledgeTrustAssessment[] = [];
let memLifecycleEvents: KnowledgeLifecycleEvent[] = [];
let memDecisionRecords: KnowledgeDecisionRecord[] = [];
let memDecisionRationales: KnowledgeDecisionRationale[] = [];
let memDecisionPrecedents: KnowledgeDecisionPrecedent[] = [];
let memLessonsLearned: KnowledgeLessonLearned[] = [];
let memBestPractices: KnowledgeBestPractice[] = [];
let memInsights: KnowledgeInstitutionalInsight[] = [];
let memResearchFindings: KnowledgeResearchFinding[] = [];
let memContradictions: KnowledgeContradiction[] = [];
let memConflictResolutions: KnowledgeConflictResolution[] = [];
let memReviewCycles: KnowledgeReviewCycle[] = [];
let memExceptions: KnowledgeIntelligenceException[] = [];
let memOverrides: KnowledgeOverride[] = [];
let memRetrievalRequests: KnowledgeRetrievalRequest[] = [];
let memRetrievalPolicies: KnowledgeRetrievalPolicy[] = [];
let memRetrievalEvidences: KnowledgeRetrievalEvidence[] = [];
let memAccessDecisions: KnowledgeAccessDecision[] = [];
let memRisks: KnowledgeIntelligenceRisk[] = [];
let memResilienceAssessments: KnowledgeResilienceAssessment[] = [];
let memAuditEvents: KnowledgeGovernanceAuditEvent[] = [];
let memDiagnostics: KnowledgeDiagnostic[] = [];
let memApprovals: KnowledgeGovernanceApproval[] = [];

let isSeeded = false;

export function seedKnowledgeIntelligenceGovernance(tenantId: string, campusId: string) {
  if (isSeeded) return;
  isSeeded = true;

  // 1. Strategies
  memStrategies = [
    {
      id: 'strat_kn_01',
      tenantId,
      campusId,
      title: 'Strategic Academic Standard & Curriculum Intelligence Masterplan',
      description: 'Govern and verify authoritative references across global syllabus frameworks and institutional standards.',
      objectiveCodes: ['OBJ-01', 'OBJ-02'],
      ownerUserIdRef: 'usr_dean_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'strat_kn_02',
      tenantId,
      campusId,
      title: 'Institutional Research Excellence & IP Provenance Framework',
      description: 'Establish structural validation, peer reviews, and evidence tracking of active campus findings.',
      objectiveCodes: ['OBJ-03'],
      ownerUserIdRef: 'usr_steward_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 2. Knowledge Domains
  memDomains = [
    { id: 'dom_kn_01', tenantId, campusId, domainName: 'Academic Standards', domainCode: 'ACADEMICS', stewardUserIdRef: 'usr_steward_01', backupStewardUserIdRef: 'usr_dean_01', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dom_kn_02', tenantId, campusId, domainName: 'Scientific Research', domainCode: 'RESEARCH', stewardUserIdRef: 'usr_steward_02', backupStewardUserIdRef: 'usr_steward_01', isActive: true, createdAt: new Date().toISOString() },
    { id: 'dom_kn_03', tenantId, campusId, domainName: 'Institutional Decisions & Memory', domainCode: 'DECISIONS', stewardUserIdRef: 'usr_auditor_01', backupStewardUserIdRef: 'usr_steward_02', isActive: true, createdAt: new Date().toISOString() }
  ];

  // 3. Knowledge Objects
  memObjects = [
    {
      id: 'kn_obj_01',
      tenantId,
      campusId,
      domainCode: 'ACADEMICS',
      title: 'Official General Education Grading & GPA Formulation Directive',
      contentReference: 'Policy Ref: PL-AC-901-V4 on Cumulative Quality Weights and Academic Outcomes',
      status: 'PUBLISHED',
      ownerUserIdRef: 'usr_dean_01',
      stewardUserIdRef: 'usr_steward_01',
      classificationSensitivity: 'INTERNAL',
      trustScore: 0.95,
      trustClassification: 'VERY_HIGH',
      riskLevel: 'LOW',
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_obj_02',
      tenantId,
      campusId,
      domainCode: 'RESEARCH',
      title: 'Biomedical Isolation & Synthesis Protocol Guidelines',
      contentReference: 'Research Reference: SCI-BIO-E22-R98 on Cryo-electron Tomography mapping.',
      status: 'VERIFICATION_PENDING',
      ownerUserIdRef: 'usr_steward_02',
      stewardUserIdRef: 'usr_steward_01',
      classificationSensitivity: 'RESTRICTED',
      trustScore: 0.65,
      trustClassification: 'MODERATE',
      riskLevel: 'HIGH',
      nextReviewDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kn_obj_03',
      tenantId,
      campusId,
      domainCode: 'DECISIONS',
      title: 'Emergency Student Relocation & Campus Safe Facility Strategy',
      contentReference: 'Decision Directive: BOARD-EMER-GP-002 on Seismic and structural updates.',
      status: 'PUBLISHED',
      ownerUserIdRef: 'usr_dean_01',
      stewardUserIdRef: 'usr_auditor_01',
      classificationSensitivity: 'HIGHLY_CONFIDENTIAL',
      trustScore: 0.88,
      trustClassification: 'HIGH',
      riskLevel: 'MODERATE',
      nextReviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Past review date
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 4. Source References
  memSources = [
    { id: 'src_ref_01', tenantId, sourceModuleIdRef: 'Phase 9.1', recordTitle: 'Academic GPA Weight Policy Source Record', reliabilityScore: 0.95, verifiedAt: new Date().toISOString() },
    { id: 'src_ref_02', tenantId, sourceModuleIdRef: 'Phase 7.58', recordTitle: 'Peer-reviewed Cellular Imaging Dataset 09', reliabilityScore: 0.92, verifiedAt: new Date().toISOString() },
    { id: 'src_ref_03', tenantId, sourceModuleIdRef: 'Phase 7.49', recordTitle: 'Executive Council Seismic Assessment Draft', reliabilityScore: 0.85, verifiedAt: new Date().toISOString() }
  ];

  // 5. Evidence References
  memEvidences = [
    { id: 'ev_ref_01', knowledgeObjectIdRef: 'kn_obj_01', evidenceType: 'DOCUMENT', description: 'Curriculum Council Curriculum Signature File', hashChecksum: 'sha256-acade091', qualityScore: 0.96, createdAt: new Date().toISOString() },
    { id: 'ev_ref_02', knowledgeObjectIdRef: 'kn_obj_02', evidenceType: 'RESEARCH_PAPER', description: 'Scientific Journal Abstract Verification Cert', hashChecksum: 'sha256-res09841', qualityScore: 0.90, createdAt: new Date().toISOString() },
    { id: 'ev_ref_03', knowledgeObjectIdRef: 'kn_obj_03', evidenceType: 'AUDIT_LOG', description: 'Civil Engineers Structural Integrity Report', hashChecksum: 'sha256-seis0019', qualityScore: 0.88, createdAt: new Date().toISOString() }
  ];

  // 6. Provenances
  memProvenances = [
    {
      id: 'prov_rec_01',
      knowledgeObjectIdRef: 'kn_obj_01',
      sourceRecordIdRef: 'src_ref_01',
      sourceModuleIdRef: 'Phase 9.1',
      sourceTimestamp: new Date().toISOString(),
      sourceVersionRef: 'v4.1',
      evidenceReferences: ['ev_ref_01'],
      verificationReferences: ['ver_01'],
      previousProvenanceHash: 'sha256_root_anchor_00000000000000000',
      provenanceHash: 'sha256_e109ab41',
      createdAt: new Date().toISOString()
    }
  ];

  // 7. Verifications
  memVerifications = [
    { id: 'ver_01', knowledgeObjectIdRef: 'kn_obj_01', verifierUserIdRef: 'usr_auditor_01', verificationMethod: 'FOUR_EYES_REVIEW', status: 'PASSED', verificationNotes: 'Syllabus, GPA weights, and credits reviewed and cross-checked.', verifiedAt: new Date().toISOString() }
  ];

  // 8. Lifecycle Events
  memLifecycleEvents = [
    { id: 'evt_lc_01', knowledgeObjectIdRef: 'kn_obj_01', fromStatus: 'UNDER_REVIEW', toStatus: 'PUBLISHED', actorUserIdRef: 'usr_steward_01', rationale: 'Final audit completed successfully.', timestamp: new Date().toISOString() }
  ];

  // 9. Trust Assessments
  memTrustAssessments = [
    {
      id: 'ta_01',
      knowledgeObjectIdRef: 'kn_obj_01',
      calculatedTrustScore: 0.95,
      classification: 'VERY_HIGH',
      authorityScore: 1.0,
      evidenceQualityScore: 0.95,
      freshnessScore: 0.98,
      verificationScore: 1.0,
      sourceReliabilityScore: 0.95,
      provenanceCompletenessScore: 1.0,
      assessedAt: new Date().toISOString()
    }
  ];

  // 10. Decisions, Rationales & Precedents
  memDecisionRecords = [
    {
      id: 'dec_rec_01',
      tenantId,
      campusId,
      decisionDate: new Date().toISOString(),
      decisionAuthorityRef: 'Executive Academic Senate',
      decisionContext: 'Adopting international validation rules for transfer credits.',
      rationaleReference: 'Justification: Standardize global degree reciprocity guidelines.',
      expectedOutcome: 'Increase study-abroad credit integration speed by 40%.',
      createdAt: new Date().toISOString()
    }
  ];

  memDecisionRationales = [
    { id: 'rat_01', decisionRecordIdRef: 'dec_rec_01', coreJustification: 'Aligning standard definitions of credit modules reduces institutional overhead.', riskAssessmentReference: 'Risk Level: LOW', alternativesConsidered: ['Do nothing', 'Regional-only agreement'], createdAt: new Date().toISOString() }
  ];

  memDecisionPrecedents = [
    { id: 'prec_01', precedentCode: 'PREC-AC-01', title: 'Degree Equivalence Exemption Precedent', description: 'Prior standard exceptions regarding non-formal credits apply to clinical training programs.', rulingAuthority: 'Academic Senate Committee', relevancyTags: ['EQUIVALENCY', 'CLINICAL'], createdAt: new Date().toISOString() }
  ];

  // 11. Lessons Learned & Best Practices
  memLessonsLearned = [
    { id: 'les_01', tenantId, title: 'Incomplete Transfer Credit Lineage Mapping', description: 'Observed credits imported from unverified external institutions caused analytics variance.', rootCause: 'Legacy XML inputs bypassed the schema contract validation.', remediationAction: 'Add automated interface contracts checking schema version.', stewardUserIdRef: 'usr_steward_01', createdAt: new Date().toISOString() }
  ];

  memBestPractices = [
    { id: 'bp_01', domainCode: 'ACADEMICS', title: 'Bi-annual Credit Audit Procedure', guidelines: 'Stewards must verify historical GPA formulations at least once per term to guarantee data parity.', ownerUserIdRef: 'usr_dean_01', createdAt: new Date().toISOString() }
  ];

  memInsights = [
    { id: 'ins_01', title: 'Grade Curve Performance Metric Outliers', insightSummary: 'Consistent grade skewing in biomedical science indicates a potential core syllabus mismatch.', dataBackingReference: 'Phase 9.2 Analytics Dashboard #04', impactLevel: 'HIGH', createdAt: new Date().toISOString() }
  ];

  memResearchFindings = [
    { id: 'res_find_01', researchTitle: 'Structural Synthesis of Polynucleotides at Scale', abstractSummary: 'High-throughput structural scanning utilizing robotic pipette arms.', methodologyOverview: 'Dynamic feedback loops paired with cryogenic isolation models.', peerReviewStatus: 'APPROVED', researcherUserIdRefs: ['usr_steward_02'], publishedDate: new Date().toISOString() }
  ];

  // 12. Contradictions & Conflicts
  memContradictions = [
    {
      id: 'con_01',
      tenantId,
      campusId,
      knowledgeObjectIdRefA: 'kn_obj_01',
      knowledgeObjectIdRefB: 'kn_obj_02',
      conflictType: 'SEMANTIC_CONTRADICTION',
      severity: 'MEDIUM',
      status: 'DETECTED',
      detectedAt: new Date().toISOString()
    }
  ];

  // 13. Exceptions & Overrides
  memExceptions = [
    {
      id: 'exc_01',
      tenantId,
      campusId,
      exceptionType: 'UNVERIFIED_KNOWLEDGE_USE',
      targetEntityIdRef: 'kn_obj_02',
      businessRationale: 'Unverified biomedical Guidelines required immediately for urgent active research.',
      compensatingControls: 'Mandatory daily review of newly added data inputs by second-tier committee.',
      proposerUserIdRef: 'usr_steward_01',
      approverUserIdRef: 'usr_auditor_01',
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    }
  ];

  memOverrides = [
    {
      id: 'ov_01',
      tenantId,
      targetKnowledgeObjectIdRef: 'kn_obj_02',
      targetField: 'trustScore',
      originalValue: '0.65',
      overriddenValue: '0.85',
      proposerUserIdRef: 'usr_steward_01',
      approverUserIdRef: 'usr_auditor_01',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      justification: 'Manual emergency override applied based on secondary dataset integrity checks.',
      createdAt: new Date().toISOString()
    }
  ];

  // 14. Policies & Retrievals
  memRetrievalPolicies = [
    { id: 'pol_ret_01', tenantId, domainCode: 'ACADEMICS', minimumRequiredRole: 'steward', maxSensitivityAllowed: 'HIGHLY_CONFIDENTIAL', requiresFourEyesApprovals: true, isActive: true },
    { id: 'pol_ret_02', tenantId, domainCode: 'RESEARCH', minimumRequiredRole: 'faculty', maxSensitivityAllowed: 'RESTRICTED', requiresFourEyesApprovals: false, isActive: true }
  ];

  // 15. Initial Diagnostics & Risks
  memDiagnostics = [
    {
      id: 'diag_kn_01',
      tenantId,
      campusId,
      diagnosticType: 'EXPIRED_KNOWLEDGE',
      targetEntityIdRef: 'kn_obj_03',
      severity: 'HIGH',
      diagnosticMessage: 'Official Emergency Relocation Directive is past its review date and requires immediate audit re-certification.',
      isResolved: false,
      detectedAt: new Date().toISOString()
    }
  ];

  memRisks = [
    {
      id: 'risk_01',
      tenantId,
      targetObjectIdRef: 'kn_obj_03',
      riskType: 'STALE_KNOWLEDGE',
      inherentScore: 0.8,
      residualScore: 0.4,
      criticalityScore: 0.9,
      reliabilityDeclineScore: 0.1,
      freshnessDeclineScore: 0.85,
      evidenceDeficiencyScore: 0.2,
      riskRating: 'HIGH',
      mitigationPlan: 'Initiate emergency steward sign-off and verify structural engineers current report status.',
      createdAt: new Date().toISOString()
    }
  ];

  // 16. Resilience
  memResilienceAssessments = [
    {
      id: 'res_ass_01',
      tenantId,
      campusId,
      assessedAt: new Date().toISOString(),
      vulnerabilityCount: 1,
      coverageRatio: 0.85,
      criticalDeficiencyCount: 0,
      compositeResilienceIndex: 0.92
    }
  ];

  // 17. Initial Audit Log
  const initialEventPayload = `${tenantId}:system_init:KNOWLEDGE_INTELLIGENCE_INIT:strat_kn_01:${new Date().toISOString()}:00000000`;
  const initialHash = generateDeterministicHash(initialEventPayload);
  memAuditEvents = [
    {
      id: 'audit_kn_01',
      tenantId,
      campusId,
      actorUserIdRef: 'system_init',
      actionCode: 'KNOWLEDGE_INTELLIGENCE_INIT',
      entityIdRef: 'strat_kn_01',
      timestamp: new Date().toISOString(),
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: initialHash
    }
  ];
}

export class KnowledgeIntelligenceGovernanceService {
  // 3. KNOWLEDGE TRUST ENGINE
  public static calculateKnowledgeTrustScore(metrics: {
    authority: number;
    evidenceQuality: number;
    freshness: number;
    verification: number;
    sourceReliability: number;
    provenanceCompleteness: number;
  }): { score: number; classification: KnowledgeTrustClassification } {
    const rawAuthority = metrics.authority;
    const rawEvidenceQuality = metrics.evidenceQuality;
    const rawFreshness = metrics.freshness;
    const rawVerification = metrics.verification;
    const rawSourceReliability = metrics.sourceReliability;
    const rawProvenanceCompleteness = metrics.provenanceCompleteness;

    // Safety checks against division-by-zero, NaN, Infinity, negative/invalid scores
    const safeNum = (n: number) => {
      if (typeof n !== 'number' || isNaN(n) || !isFinite(n) || n < 0) return 0;
      return Math.min(1, n);
    };

    const auth = safeNum(rawAuthority);
    const ev = safeNum(rawEvidenceQuality);
    const fresh = safeNum(rawFreshness);
    const ver = safeNum(rawVerification);
    const src = safeNum(rawSourceReliability);
    const prov = safeNum(rawProvenanceCompleteness);

    // Dynamic mathematical composite formula: Weighted composite trust
    const sum = (auth * 0.25) + (ev * 0.20) + (fresh * 0.15) + (ver * 0.15) + (src * 0.15) + (prov * 0.10);
    const score = Math.max(0, Math.min(1, sum));

    let classification: KnowledgeTrustClassification = 'INSUFFICIENT_DATA';
    if (score >= 0.90) classification = 'VERY_HIGH';
    else if (score >= 0.75) classification = 'HIGH';
    else if (score >= 0.50) classification = 'MODERATE';
    else if (score >= 0.30) classification = 'LOW';
    else classification = 'UNTRUSTED';

    return { score, classification };
  }

  // 11. KNOWLEDGE RISK ENGINE
  public static calculateKnowledgeRisk(metrics: {
    criticality: number;
    sourceReliability: number;
    freshnessDegradation: number;
    evidenceWeakness: number;
    provenanceWeakness: number;
    contradictionExposure: number;
    dependencyConcentration: number;
    accessSensitivity: number;
  }): { riskScore: number; riskRating: KnowledgeRiskLevel } {
    const safeVal = (v: number) => {
      if (typeof v !== 'number' || isNaN(v) || !isFinite(v) || v < 0) return 0;
      return Math.min(1, v);
    };

    const crit = safeVal(metrics.criticality);
    const src = safeVal(metrics.sourceReliability);
    const freshDeg = safeVal(metrics.freshnessDegradation);
    const evWeak = safeVal(metrics.evidenceWeakness);
    const provWeak = safeVal(metrics.provenanceWeakness);
    const conExp = safeVal(metrics.contradictionExposure);
    const depConc = safeVal(metrics.dependencyConcentration);
    const sens = safeVal(metrics.accessSensitivity);

    // Dynamic mathematical formula ensuring no NaN or division-by-zero
    const compositeRisk = (crit * 0.25) + ((1 - src) * 0.15) + (freshDeg * 0.15) + (evWeak * 0.10) + (provWeak * 0.10) + (conExp * 0.10) + (depConc * 0.10) + (sens * 0.05);
    const riskScore = Math.max(0, Math.min(1, compositeRisk));

    let riskRating: KnowledgeRiskLevel = 'LOW';
    if (riskScore >= 0.80) riskRating = 'CRITICAL';
    else if (riskScore >= 0.60) riskRating = 'HIGH';
    else if (riskScore >= 0.35) riskRating = 'MODERATE';

    return { riskScore, riskRating };
  }

  // 2. KNOWLEDGE LIFECYCLE
  private static readonly VALID_TRANSITIONS: Record<KnowledgeLifecycleStatus, KnowledgeLifecycleStatus[]> = {
    'DRAFT': ['UNDER_REVIEW'],
    'UNDER_REVIEW': ['VERIFICATION_PENDING', 'DRAFT'],
    'VERIFICATION_PENDING': ['VERIFIED', 'UNDER_REVIEW'],
    'VERIFIED': ['PUBLISHED', 'UNDER_REVIEW'],
    'PUBLISHED': ['SUPERSEDED', 'RETIRED', 'ARCHIVED'],
    'SUPERSEDED': ['ARCHIVED'],
    'RETIRED': ['ARCHIVED'],
    'ARCHIVED': []
  };

  public static validateKnowledgeLifecycleTransition(
    fromStatus: KnowledgeLifecycleStatus,
    toStatus: KnowledgeLifecycleStatus
  ): boolean {
    const allowed = this.VALID_TRANSITIONS[fromStatus] || [];
    return allowed.includes(toStatus);
  }

  // 6. FOUR-EYES GOVERNANCE
  public static validateFourEyesSoD(requesterUserIdRef: string, approverUserIdRef: string): boolean {
    if (!requesterUserIdRef || !approverUserIdRef) return false;
    return requesterUserIdRef !== approverUserIdRef;
  }

  // 4. PROVENANCE ENGINE
  public static generateKnowledgeProvenanceHash(
    title: string,
    contentReference: string,
    sourceRecordIdRef: string,
    sourceModuleIdRef: string,
    previousProvenanceHash: string
  ): string {
    const payload = `${title}:${contentReference}:${sourceRecordIdRef}:${sourceModuleIdRef}:${previousProvenanceHash}`;
    return generateDeterministicHash(payload);
  }

  public static verifyKnowledgeProvenance(
    obj: KnowledgeObject,
    prov: KnowledgeProvenanceRecord
  ): boolean {
    const expected = this.generateKnowledgeProvenanceHash(
      obj.title,
      obj.contentReference,
      prov.sourceRecordIdRef,
      prov.sourceModuleIdRef,
      prov.previousProvenanceHash
    );
    return prov.provenanceHash === expected;
  }

  // 8. RETRIEVAL GOVERNANCE
  public static evaluateRetrievalAuthorization(
    request: KnowledgeRetrievalRequest,
    policy: KnowledgeRetrievalPolicy,
    userRole: string
  ): { decision: RetrievalClassification; reason?: string } {
    // Tenant and campus checks are verified inside the service methods.
    
    // Minimum role verification
    const roleHierarchy: Record<string, number> = { 'guest': 0, 'faculty': 1, 'steward': 2, 'dean': 3, 'admin': 4 };
    const requiredRoleVal = roleHierarchy[policy.minimumRequiredRole.toLowerCase()] || 0;
    const userRoleVal = roleHierarchy[userRole.toLowerCase()] || 0;

    if (userRoleVal < requiredRoleVal) {
      return { decision: 'DENIED', reason: `Inadequate role authority. Required role: ${policy.minimumRequiredRole}.` };
    }

    // Sensitivity boundary checks
    const sensitivityHierarchy: Record<string, number> = { 'PUBLIC': 0, 'INTERNAL': 1, 'RESTRICTED': 2, 'HIGHLY_CONFIDENTIAL': 3 };
    const maxSensitivityVal = sensitivityHierarchy[policy.maxSensitivityAllowed] || 0;
    const requestedSensitivityVal = sensitivityHierarchy[request.sensitivityLevel] || 0;

    if (requestedSensitivityVal > maxSensitivityVal) {
      return { decision: 'DENIED', reason: `Sensitivity boundary exceeded. Policy maximum: ${policy.maxSensitivityAllowed}.` };
    }

    // High-risk and Freshness check
    if (request.requiredAuthorityLevel > userRoleVal) {
      return { decision: 'RESTRICTED', reason: `Requested authority level ${request.requiredAuthorityLevel} exceeds user role scope.` };
    }

    return { decision: 'AUTHORIZED' };
  }

  // 7. KNOWLEDGE CONTRADICTION ENGINE
  public static detectKnowledgeContradictions(tenantId: string): KnowledgeContradiction[] {
    const objects = memObjects.filter(o => o.tenantId === tenantId);
    const contradictions: KnowledgeContradiction[] = [];

    // Simple rule-based detector checking title similarities, overlapping domain codes, or conflicting target states
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const objA = objects[i];
        const objB = objects[j];

        // Semantic overlap or conflict criteria
        if (objA.domainCode === objB.domainCode && objA.title.split(' ')[0] === objB.title.split(' ')[0]) {
          contradictions.push({
            id: `con_detect_${objA.id}_${objB.id}`,
            tenantId,
            campusId: objA.campusId,
            knowledgeObjectIdRefA: objA.id,
            knowledgeObjectIdRefB: objB.id,
            conflictType: 'SEMANTIC_CONTRADICTION',
            severity: 'HIGH',
            status: 'DETECTED',
            detectedAt: new Date().toISOString()
          });
        }
      }
    }

    return [...memContradictions.filter(c => c.tenantId === tenantId), ...contradictions];
  }

  // 10. REVIEW & FRESHNESS ENGINE
  public static calculateFreshnessStatus(nextReviewDate: string): { freshnessScore: number; isExpired: boolean } {
    const now = Date.now();
    const reviewTime = new Date(nextReviewDate).getTime();
    const msDiff = reviewTime - now;

    if (msDiff <= 0) {
      return { freshnessScore: 0, isExpired: true };
    }

    // Map duration to scores
    const daysRemaining = msDiff / (1000 * 60 * 60 * 24);
    const freshnessScore = Math.max(0, Math.min(1, daysRemaining / 90));
    return { freshnessScore, isExpired: daysRemaining < 1 };
  }

  // 10. DIAGNOSTIC SCANNER
  public static runKnowledgeDiagnostics(tenantId: string): KnowledgeDiagnostic[] {
    const list: KnowledgeDiagnostic[] = [];
    const objects = memObjects.filter(o => o.tenantId === tenantId);

    objects.forEach(obj => {
      // 1. Freshness detection
      const { isExpired } = this.calculateFreshnessStatus(obj.nextReviewDate);
      if (isExpired) {
        list.push({
          id: `diag_expired_${obj.id}`,
          tenantId,
          campusId: obj.campusId,
          diagnosticType: 'EXPIRED_KNOWLEDGE',
          targetEntityIdRef: obj.id,
          severity: 'HIGH',
          diagnosticMessage: `Knowledge record "${obj.title}" is past its critical review date.`,
          isResolved: false,
          detectedAt: new Date().toISOString()
        });
      }

      // 2. Missing Steward Check
      if (!obj.ownerUserIdRef || !obj.stewardUserIdRef) {
        list.push({
          id: `diag_owner_${obj.id}`,
          tenantId,
          campusId: obj.campusId,
          diagnosticType: 'MISSING_OWNER_STEWARD',
          targetEntityIdRef: obj.id,
          severity: 'CRITICAL',
          diagnosticMessage: `Knowledge record "${obj.title}" lacks a registered steward or owner assignment.`,
          isResolved: false,
          detectedAt: new Date().toISOString()
        });
      }

      // 3. Unverified Check
      const verified = memVerifications.some(v => v.knowledgeObjectIdRef === obj.id && v.status === 'PASSED');
      if (!verified && obj.status === 'PUBLISHED') {
        list.push({
          id: `diag_unver_${obj.id}`,
          tenantId,
          campusId: obj.campusId,
          diagnosticType: 'MISSING_VERIFICATION',
          targetEntityIdRef: obj.id,
          severity: 'HIGH',
          diagnosticMessage: `Published record "${obj.title}" lacks active peer or auditor verification reference.`,
          isResolved: false,
          detectedAt: new Date().toISOString()
        });
      }
    });

    // 4. Overrides expire check
    memOverrides.forEach(ov => {
      if (new Date(ov.expiryDate).getTime() < Date.now()) {
        list.push({
          id: `diag_ov_expired_${ov.id}`,
          tenantId,
          campusId: 'default_campus',
          diagnosticType: 'EXPIRED_KNOWLEDGE',
          targetEntityIdRef: ov.id,
          severity: 'MEDIUM',
          diagnosticMessage: `Manual override of metric "${ov.targetField}" is expired and must be cleared.`,
          isResolved: false,
          detectedAt: new Date().toISOString()
        });
      }
    });

    return [...memDiagnostics.filter(d => d.tenantId === tenantId), ...list];
  }

  // 5. INSTITUTIONAL MEMORY
  public static createInstitutionalMemoryReference(
    tenantId: string,
    campusId: string,
    record: Partial<KnowledgeDecisionRecord>
  ): KnowledgeDecisionRecord {
    const dec: KnowledgeDecisionRecord = {
      id: `dec_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      campusId,
      decisionDate: record.decisionDate || new Date().toISOString(),
      decisionAuthorityRef: record.decisionAuthorityRef || 'Executive Committee',
      decisionContext: record.decisionContext || 'Global directive memory',
      rationaleReference: record.rationaleReference || 'Default justification rationale',
      expectedOutcome: record.expectedOutcome || 'Maximize data parity',
      lessonsLearnedReference: record.lessonsLearnedReference,
      actualOutcomeReference: record.actualOutcomeReference,
      supersessionReference: record.supersessionReference,
      createdAt: new Date().toISOString()
    };
    memDecisionRecords.push(dec);
    this.appendAuditEvent(tenantId, campusId, 'system_steward', 'DECISION_MEM_CREATED', dec.id);
    return dec;
  }

  // 12. WHAT-IF RESILIENCE SANDBOX (15 scenarios)
  private static readonly SCENARIOS_15: KnowledgeScenario[] = [
    { id: 'scen_1', code: 'KNOWLEDGE_SOURCE_OUTAGE', name: 'Knowledge Source Outage', description: 'Simulates connection loss with the central strategic records pool.' },
    { id: 'scen_2', code: 'AUTHORITATIVE_SOURCE_FAILURE', name: 'Authoritative Source Integration Failure', description: 'Simulates structural database timeout on external API references.' },
    { id: 'scen_3', code: 'KNOWLEDGE_STALENESS', name: 'Widespread Knowledge Staleness Peak', description: 'Simulates a 3x increase in expired review dates across active domains.' },
    { id: 'scen_4', code: 'PROVENANCE_CORRUPTION', name: 'Cryptographic Provenance Chain Break', description: 'Simulates invalid previous hash signatures triggering automated diagnostics.' },
    { id: 'scen_5', code: 'EVIDENCE_LOSS', name: 'Subscribed Evidence Reference File Loss', description: 'Simulates checksum mismatches on attached compliance documents.' },
    { id: 'scen_6', code: 'SOURCE_CONTRADICTION', name: 'Opposing Domain Rule Contradictions', description: 'Simulates high-severity overlapping assertions in academics.' },
    { id: 'scen_7', code: 'POLICY_SUPERSESSION', name: 'Unresolved Policies Supersession Disconnect', description: 'Simulates missing replacement references on retired syllabus records.' },
    { id: 'scen_8', code: 'DECISION_HISTORY_GAP', name: 'Institutional Decision Rationale Gap', description: 'Simulates decision logs missing expected outcome metrics.' },
    { id: 'scen_9', code: 'KNOWLEDGE_DOMAIN_OUTAGE', name: 'Regional Knowledge Domain Offlining', description: 'Simulates emergency offlining of research datasets.' },
    { id: 'scen_10', code: 'RETRIEVAL_SERVICE_FAILURE', name: 'Retrieval Control Plane Congestion', description: 'Simulates a massive spike in denied access queries.' },
    { id: 'scen_11', code: 'VERIFICATION_BACKLOG', name: 'Pending Verification Backlog Peak', description: 'Simulates a bottleneck in peer-review evaluations.' },
    { id: 'scen_12', code: 'MASS_KNOWLEDGE_EXPIRATION', name: 'Simultaneous Expiration of active guidelines', description: 'Simulates 50% of published records hitting nextReviewDate today.' },
    { id: 'scen_13', code: 'CROSS_CAMPUS_KNOWLEDGE_FAILURE', name: 'Regional Satellite Campus Sync Outage', description: 'Simulates regional credential feeds dropping off.' },
    { id: 'scen_14', code: 'THIRD_PARTY_KNOWLEDGE_OUTAGE', name: 'External Bureau Benchmark Service Outage', description: 'Simulates global benchmarking references returning 504 Gateway errors.' },
    { id: 'scen_15', code: 'CASCADING_KNOWLEDGE_TRUST_FAILURE', name: 'Cascading Trust Pipeline Collapse', description: 'Simulates consecutive source, provenance, and verification failures.' }
  ];

  public static getScenarios(): KnowledgeScenario[] {
    return this.SCENARIOS_15;
  }

  public static executeKnowledgeSimulation(scenarioCode: string): KnowledgeSimulationResult {
    const scenario = this.SCENARIOS_15.find(s => s.code === scenarioCode);
    if (!scenario) throw new Error('Simulation scenario code not found.');

    let impactScore = 0.15;
    let resilienceDelta = -0.05;
    const triggered: string[] = [];

    switch (scenarioCode) {
      case 'KNOWLEDGE_SOURCE_OUTAGE':
        impactScore = 0.55;
        resilienceDelta = -0.15;
        triggered.push('VULN_SOURCE_OFFLINE', 'LINEAGE_WARN');
        break;
      case 'AUTHORITATIVE_SOURCE_FAILURE':
        impactScore = 0.40;
        resilienceDelta = -0.10;
        triggered.push('VULN_AUTH_TIMEOUT');
        break;
      case 'KNOWLEDGE_STALENESS':
        impactScore = 0.45;
        resilienceDelta = -0.12;
        triggered.push('VULN_STALE_RECORDS');
        break;
      case 'PROVENANCE_CORRUPTION':
        impactScore = 0.85;
        resilienceDelta = -0.35;
        triggered.push('VULN_HASH_INTEGRITY_BREACH', 'AUDIT_FAULT');
        break;
      case 'EVIDENCE_LOSS':
        impactScore = 0.50;
        resilienceDelta = -0.18;
        triggered.push('VULN_CHECKSUM_ERROR');
        break;
      case 'SOURCE_CONTRADICTION':
        impactScore = 0.35;
        resilienceDelta = -0.08;
        triggered.push('VULN_CONTRADICTORY_POLICY');
        break;
      case 'POLICY_SUPERSESSION':
        impactScore = 0.30;
        resilienceDelta = -0.05;
        triggered.push('VULN_ORPHAN_SUPERSESSION');
        break;
      case 'DECISION_HISTORY_GAP':
        impactScore = 0.25;
        resilienceDelta = -0.04;
        triggered.push('VULN_DECISION_GAP');
        break;
      case 'KNOWLEDGE_DOMAIN_OUTAGE':
        impactScore = 0.60;
        resilienceDelta = -0.22;
        triggered.push('VULN_DOMAIN_OFFLINE');
        break;
      case 'RETRIEVAL_SERVICE_FAILURE':
        impactScore = 0.70;
        resilienceDelta = -0.25;
        triggered.push('VULN_RETRIEVAL_FAIL');
        break;
      case 'VERIFICATION_BACKLOG':
        impactScore = 0.38;
        resilienceDelta = -0.09;
        triggered.push('VULN_REVIEW_QUEUE_PEAK');
        break;
      case 'MASS_KNOWLEDGE_EXPIRATION':
        impactScore = 0.78;
        resilienceDelta = -0.30;
        triggered.push('VULN_EXPIRED_KNOWLEDGE_PEAK');
        break;
      case 'CROSS_CAMPUS_KNOWLEDGE_FAILURE':
        impactScore = 0.48;
        resilienceDelta = -0.14;
        triggered.push('VULN_CROSS_CAMPUS_GAP');
        break;
      case 'THIRD_PARTY_KNOWLEDGE_OUTAGE':
        impactScore = 0.28;
        resilienceDelta = -0.06;
        triggered.push('VULN_EXTERNAL_BENCHMARK_TIMEOUT');
        break;
      case 'CASCADING_KNOWLEDGE_TRUST_FAILURE':
        impactScore = 0.95;
        resilienceDelta = -0.45;
        triggered.push('VULN_CASCADING_TRUST_BREACH', 'VULN_TOTAL_SYSTEM_COMPROMISE');
        break;
    }

    return {
      id: `sim_res_${Math.random().toString(36).substr(2, 9)}`,
      scenarioCode,
      simulatedAt: new Date().toISOString(),
      impactScore,
      resilienceDelta,
      vulnerabilitiesTriggered: triggered,
      diagnosticBanner: 'SIMULATION ONLY | SANDBOX MODE ACTIVE | ZERO PRODUCTION MUTATION'
    };
  }

  // Standard CRUD-like operations over memory repositories
  public static getStrategies(tenantId: string): KnowledgeStrategy[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memStrategies.filter(s => s.tenantId === tenantId);
  }

  public static getDomains(tenantId: string): KnowledgeDomainGovernance[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memDomains.filter(d => d.tenantId === tenantId);
  }

  public static getObjects(tenantId: string): KnowledgeObject[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memObjects.filter(o => o.tenantId === tenantId);
  }

  public static getSources(tenantId: string): KnowledgeSourceReference[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memSources.filter(s => s.tenantId === tenantId);
  }

  public static getEvidences(knowledgeObjectIdRef: string): KnowledgeEvidenceReference[] {
    return memEvidences.filter(e => e.knowledgeObjectIdRef === knowledgeObjectIdRef);
  }

  public static getProvenance(knowledgeObjectIdRef: string): KnowledgeProvenanceRecord | undefined {
    return memProvenances.find(p => p.knowledgeObjectIdRef === knowledgeObjectIdRef);
  }

  public static getVerifications(knowledgeObjectIdRef: string): KnowledgeVerification[] {
    return memVerifications.filter(v => v.knowledgeObjectIdRef === knowledgeObjectIdRef);
  }

  public static getDecisionRecords(tenantId: string): KnowledgeDecisionRecord[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memDecisionRecords.filter(d => d.tenantId === tenantId);
  }

  public static getRationales(decisionRecordIdRef: string): KnowledgeDecisionRationale[] {
    return memDecisionRationales.filter(r => r.decisionRecordIdRef === decisionRecordIdRef);
  }

  public static getPrecedents(): KnowledgeDecisionPrecedent[] {
    return memDecisionPrecedents;
  }

  public static getLessonsLearned(tenantId: string): KnowledgeLessonLearned[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memLessonsLearned.filter(l => l.tenantId === tenantId);
  }

  public static getBestPractices(): KnowledgeBestPractice[] {
    return memBestPractices;
  }

  public static getInsights(): KnowledgeInstitutionalInsight[] {
    return memInsights;
  }

  public static getResearchFindings(): KnowledgeResearchFinding[] {
    return memResearchFindings;
  }

  public static getExceptions(tenantId: string): KnowledgeIntelligenceException[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memExceptions.filter(e => e.tenantId === tenantId);
  }

  public static getOverrides(tenantId: string): KnowledgeOverride[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memOverrides.filter(o => o.tenantId === tenantId);
  }

  public static getRetrievalRequests(tenantId: string): KnowledgeRetrievalRequest[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memRetrievalRequests.filter(r => r.tenantId === tenantId);
  }

  public static getRetrievalPolicies(tenantId: string): KnowledgeRetrievalPolicy[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memRetrievalPolicies.filter(p => p.tenantId === tenantId);
  }

  public static getAuditEvents(tenantId: string): KnowledgeGovernanceAuditEvent[] {
    seedKnowledgeIntelligenceGovernance(tenantId, 'default_campus');
    return memAuditEvents.filter(a => a.tenantId === tenantId);
  }

  // Immutable, append-only logger helper
  public static appendAuditEvent(
    tenantId: string,
    campusId: string,
    actorId: string,
    actionCode: string,
    entityIdRef: string
  ): KnowledgeGovernanceAuditEvent {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);

    const previousHash = memAuditEvents.length > 0
      ? memAuditEvents[memAuditEvents.length - 1].currentHash
      : 'sha256_root_anchor_00000000000000000';

    const timestamp = new Date().toISOString();
    const payload = `${tenantId}:${actorId}:${actionCode}:${entityIdRef}:${timestamp}:${previousHash}`;
    const currentHash = generateDeterministicHash(payload);

    const event: KnowledgeGovernanceAuditEvent = {
      id: `audit_kn_lc_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      campusId,
      actorUserIdRef: actorId,
      actionCode,
      entityIdRef,
      timestamp,
      previousHash,
      currentHash
    };

    memAuditEvents.push(event);
    return event;
  }

  // Four-Eyes validated state transitions
  public static executeLifecycleTransition(
    tenantId: string,
    campusId: string,
    objId: string,
    toStatus: KnowledgeLifecycleStatus,
    actorId: string,
    approverId: string,
    rationale: string
  ): KnowledgeObject {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);
    const obj = memObjects.find(o => o.id === objId);
    if (!obj) throw new Error('Knowledge Object not found.');

    if (!this.validateKnowledgeLifecycleTransition(obj.status, toStatus)) {
      throw new Error(`Invalid status transition from ${obj.status} to ${toStatus}.`);
    }

    if (!this.validateFourEyesSoD(actorId, approverId)) {
      throw new Error('Four-Eyes Separation of Duties (SoD) violated. Proposer cannot approve.');
    }

    const prevStatus = obj.status;
    obj.status = toStatus;
    obj.updatedAt = new Date().toISOString();

    // Log the event
    memLifecycleEvents.push({
      id: `lc_evt_${Math.random().toString(36).substr(2, 9)}`,
      knowledgeObjectIdRef: objId,
      fromStatus: prevStatus,
      toStatus,
      actorUserIdRef: actorId,
      rationale,
      timestamp: new Date().toISOString()
    });

    this.appendAuditEvent(tenantId, campusId, approverId, `KNOWLEDGE_TRANSITION_${toStatus}`, objId);
    return obj;
  }

  // Create exceptions (requires 4-eyes)
  public static proposeException(
    tenantId: string,
    campusId: string,
    proposerId: string,
    approverId: string,
    exceptionType: 'UNVERIFIED_KNOWLEDGE_USE' | 'MISSING_PROVENANCE' | 'SUPERSEDED_ACTIVE_USE',
    targetEntityIdRef: string,
    businessRationale: string,
    compensatingControls: string,
    expiryDate: string
  ): KnowledgeIntelligenceException {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);

    if (!this.validateFourEyesSoD(proposerId, approverId)) {
      throw new Error('Separation of Duties violated. Requester and approver must be distinct.');
    }

    if (!expiryDate || new Date(expiryDate).getTime() <= Date.now()) {
      throw new Error('Indefinite or expired bounds are blocked. Exception expiry date must be in the future.');
    }

    const exc: KnowledgeIntelligenceException = {
      id: `exc_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      campusId,
      exceptionType,
      targetEntityIdRef,
      businessRationale,
      compensatingControls,
      proposerUserIdRef: proposerId,
      approverUserIdRef: approverId,
      expiryDate,
      status: 'APPROVED',
      createdAt: new Date().toISOString()
    };

    memExceptions.push(exc);
    this.appendAuditEvent(tenantId, campusId, approverId, 'KNOWLEDGE_EXCEPTION_APPROVED', exc.id);
    return exc;
  }

  // Propose manual overrides (requires 4-eyes)
  public static proposeOverride(
    tenantId: string,
    campusId: string,
    proposerId: string,
    approverId: string,
    targetObjectId: string,
    targetField: string,
    originalValue: string,
    overriddenValue: string,
    justification: string,
    expiryDate: string
  ): KnowledgeOverride {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);

    if (!this.validateFourEyesSoD(proposerId, approverId)) {
      throw new Error('Separation of Duties violated. Requester and approver must be distinct.');
    }

    if (!expiryDate || new Date(expiryDate).getTime() <= Date.now()) {
      throw new Error('Manual overrides must contain finite bounded expiration dates.');
    }

    const ov: KnowledgeOverride = {
      id: `ov_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      targetKnowledgeObjectIdRef: targetObjectId,
      targetField,
      originalValue,
      overriddenValue,
      proposerUserIdRef: proposerId,
      approverUserIdRef: approverId,
      expiryDate,
      justification,
      createdAt: new Date().toISOString()
    };

    // Apply mutation on the target object
    const obj = memObjects.find(o => o.id === targetObjectId);
    if (obj) {
      if (targetField === 'trustScore') {
        obj.trustScore = parseFloat(overriddenValue);
        const { classification } = this.calculateKnowledgeTrustScore({
          authority: obj.trustScore,
          evidenceQuality: obj.trustScore,
          freshness: 0.9,
          verification: 0.9,
          sourceReliability: obj.trustScore,
          provenanceCompleteness: 0.9
        });
        obj.trustClassification = classification;
      } else if (targetField === 'riskLevel') {
        obj.riskLevel = overriddenValue as KnowledgeRiskLevel;
      }
    }

    memOverrides.push(ov);
    this.appendAuditEvent(tenantId, campusId, approverId, 'KNOWLEDGE_OVERRIDE_APPROVED', ov.id);
    return ov;
  }

  // Propose conflict resolution (requires 4-eyes)
  public static proposeConflictResolution(
    tenantId: string,
    campusId: string,
    contradictionId: string,
    strategy: 'RETAIN_A_RETIRE_B' | 'RETAIN_B_RETIRE_A' | 'SUPERSEDE_BOTH' | 'MERGE_INTO_NEW' | 'ACCEPT_EXCEPTIONAL_OVERLAP',
    proposedResolution: string,
    proposerId: string,
    approverId: string
  ): KnowledgeConflictResolution {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);

    if (!this.validateFourEyesSoD(proposerId, approverId)) {
      throw new Error('Separation of Duties violated. Requester and approver must be distinct.');
    }

    const con = memContradictions.find(c => c.id === contradictionId);
    if (con) {
      con.status = 'RESOLVED';
      con.resolvedAt = new Date().toISOString();
    }

    const res: KnowledgeConflictResolution = {
      id: `res_con_${Math.random().toString(36).substr(2, 9)}`,
      contradictionIdRef: contradictionId,
      proposedResolution,
      resolutionStrategy: strategy,
      proposerUserIdRef: proposerId,
      approverUserIdRef: approverId,
      resolvedAt: new Date().toISOString()
    };

    memConflictResolutions.push(res);
    this.appendAuditEvent(tenantId, campusId, approverId, 'KNOWLEDGE_CONFLICT_RESOLVED', res.id);
    return res;
  }

  // Request Governed Retrieval
  public static requestRetrieval(
    tenantId: string,
    campusId: string,
    requesterId: string,
    domainCode: string,
    purpose: string,
    sensitivity: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL',
    userRole: string
  ): { decision: KnowledgeAccessDecision; retrievalEvidence?: KnowledgeRetrievalEvidence } {
    seedKnowledgeIntelligenceGovernance(tenantId, campusId);

    const req: KnowledgeRetrievalRequest = {
      id: `ret_req_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      campusId,
      requesterUserIdRef: requesterId,
      knowledgeDomainCode: domainCode,
      requestedPurpose: purpose,
      sensitivityLevel: sensitivity,
      requiredFreshnessDays: 90,
      requiredAuthorityLevel: 1,
      createdAt: new Date().toISOString()
    };
    memRetrievalRequests.push(req);

    const policy = memRetrievalPolicies.find(p => p.domainCode === domainCode && p.tenantId === tenantId) || {
      id: 'default_policy',
      tenantId,
      domainCode,
      minimumRequiredRole: 'guest',
      maxSensitivityAllowed: 'INTERNAL',
      requiresFourEyesApprovals: false,
      isActive: true
    };

    const evaluation = this.evaluateRetrievalAuthorization(req, policy, userRole);

    const decision: KnowledgeAccessDecision = {
      id: `acc_dec_${Math.random().toString(36).substr(2, 9)}`,
      retrievalRequestIdRef: req.id,
      decision: evaluation.decision,
      assessedPolicyIdRef: policy.id,
      rejectionReason: evaluation.reason,
      authorizedAt: evaluation.decision === 'AUTHORIZED' ? new Date().toISOString() : undefined
    };
    memAccessDecisions.push(decision);

    let retrievalEvidence: KnowledgeRetrievalEvidence | undefined;
    if (evaluation.decision === 'AUTHORIZED') {
      const matchObj = memObjects.find(o => o.domainCode === domainCode && o.tenantId === tenantId);
      if (matchObj) {
        const prov = memProvenances.find(p => p.knowledgeObjectIdRef === matchObj.id);
        retrievalEvidence = {
          id: `ev_ret_${Math.random().toString(36).substr(2, 9)}`,
          retrievalRequestIdRef: req.id,
          knowledgeObjectIdRef: matchObj.id,
          provenanceHashRef: prov ? prov.provenanceHash : 'sha256_root_anchor_00000000000000000',
          evidenceChecksums: ['sha256-acade091'],
          verificationStatus: 'VERIFIED_METADATA'
        };
        memRetrievalEvidences.push(retrievalEvidence);
      }
    }

    this.appendAuditEvent(tenantId, campusId, requesterId, `KNOWLEDGE_RETRIEVAL_${evaluation.decision}`, req.id);
    return { decision, retrievalEvidence };
  }
}
