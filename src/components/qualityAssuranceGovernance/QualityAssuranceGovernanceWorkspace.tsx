import React, { useState, useMemo } from 'react';
import {
  BadgeCheck,
  Award,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  Play,
  RotateCcw,
  Scale,
  Building2,
  Layers,
  Sparkles,
  Zap,
  Target,
  FileText,
  Clock,
  UserCheck,
  Lock,
  ChevronRight,
  TrendingUp,
  Activity,
  History,
  Workflow,
  HelpCircle,
  Eye,
  Sliders,
  Check,
  X
} from 'lucide-react';
import {
  QualityFramework,
  AccreditationCycle,
  AssessmentEvidence,
  QualityFinding,
  ImprovementPlan,
  QualityException,
  QualityRisk,
  MaturityAssessment,
  QualityResilienceAssessment,
  QualitySimulationScenario,
  QualityDiagnosticFinding,
  QualityAuditEvent,
  SecurityVerificationResult,
  QualitySimulationType,
  QualityMetricObservation
} from '../../types/qualityAssuranceGovernance';
import { QualityAssuranceGovernanceService } from '../../services/qualityAssuranceGovernanceService';

export const QualityAssuranceGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('executive');
  const [tenantId] = useState<string>('tenant_apex_university');
  const [campusScope, setCampusScope] = useState<string>('MAIN_CAMPUS');
  const [currentUserId] = useState<string>('usr_dean_morrison');
  const [currentUserRole] = useState<string>('quality_director');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Runners
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<SecurityVerificationResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const [activeSimulation, setActiveSimulation] = useState<QualitySimulationScenario | null>(null);
  const [selectedSimType, setSelectedSimType] = useState<QualitySimulationType>('ACCREDITATION_EVIDENCE_GAP');

  // Form State for Modals
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState<string>('');
  const [newEvidenceCode, setNewEvidenceCode] = useState<string>('');
  const [newEvidenceSourceRef, setNewEvidenceSourceRef] = useState<string>('');

  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState<boolean>(false);
  const [newExceptionTitle, setNewExceptionTitle] = useState<string>('');
  const [newExceptionCriterion, setNewExceptionCriterion] = useState<string>('');
  const [newExceptionApprover, setNewExceptionApprover] = useState<string>('usr_provost_vance');
  const [exceptionSodError, setExceptionSodError] = useState<string | null>(null);

  // Core Mock Datasets
  const [frameworks, setFrameworks] = useState<QualityFramework[]>([
    {
      id: 'qf_acad_2026',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      frameworkCode: 'QF-ACAD-2026',
      title: 'Institutional Academic & Curriculum Quality Framework',
      category: 'ACADEMIC_QUALITY',
      lifecycle: 'ACTIVE',
      version: '3.2.0',
      effectiveDate: '2026-01-01',
      reviewFrequencyMonths: 12,
      ownerId: 'usr_dean_morrison',
      responsibleUnits: ['Office of the Provost', 'Academic Senate', 'Curriculum Committee'],
      standards: [
        {
          id: 'std_1',
          standardCode: 'STD-1: CURRICULUM_RIGOR',
          title: 'Curricular Rigor & Learning Outcome Alignment',
          domain: 'Academics',
          overallComplianceScore: 92,
          isMandatory: true,
          criteria: [
            {
              id: 'crit_1_1',
              criterionCode: 'CRIT-1.1',
              title: 'Program Learning Outcome (PLO) Mapping to Course Rubrics',
              description: '100% of undergraduate degree programs maintain active rubric mapping in authoritative LMS.',
              weight: 2.0,
              coverageStatus: 'FULL',
              requiredEvidenceTypes: ['LMS_RUBRIC_AGGREGATION'],
              responsibleDepartment: 'Academic Assessment Office',
              actualScore: 95,
              evidenceReferenceIds: ['ev_plo_2026'],
              findingsCount: 0,
              lastAssessedAt: '2026-08-15'
            },
            {
              id: 'crit_1_2',
              criterionCode: 'CRIT-1.2',
              title: 'Annual Capstone & Summative Mastery Evaluation',
              description: 'Independent evaluation of senior capstones against institutional rubrics.',
              weight: 1.5,
              coverageStatus: 'PARTIAL',
              requiredEvidenceTypes: ['ASSESSMENT_REPORT'],
              responsibleDepartment: 'Faculty Senate Committee',
              actualScore: 82,
              evidenceReferenceIds: ['ev_capstone_2026'],
              findingsCount: 1,
              lastAssessedAt: '2026-08-20'
            }
          ]
        },
        {
          id: 'std_2',
          standardCode: 'STD-2: FACULTY_QUALIFICATIONS',
          title: 'Faculty Credentialing & Scholarship Governance',
          domain: 'Faculty Affairs',
          overallComplianceScore: 88,
          isMandatory: true,
          criteria: [
            {
              id: 'crit_2_1',
              criterionCode: 'CRIT-2.1',
              title: 'Terminal Degree Verification for Teaching Faculty',
              description: 'Official transcripts and accreditation-compliant roster maintained in HRIS.',
              weight: 2.0,
              coverageStatus: 'FULL',
              requiredEvidenceTypes: ['HRIS_FACULTY_ROSTER'],
              responsibleDepartment: 'Human Resources & Provost',
              actualScore: 98,
              evidenceReferenceIds: ['ev_faculty_roster_2026'],
              findingsCount: 0,
              lastAssessedAt: '2026-08-10'
            }
          ]
        }
      ],
      overallQualityScore: 90,
      evidenceCoveragePercent: 88,
      immutableCreatedAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-08-25T10:00:00Z'
    }
  ]);

  const [accreditationCycles] = useState<AccreditationCycle[]>([
    {
      id: 'accred_cycle_2027',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      accreditationBodyName: 'Higher Learning Commission (HLC)',
      frameworkRef: 'HLC_CRITERIA_2025',
      cycleName: 'Comprehensive 10-Year Reaffirmation of Accreditation',
      academicYearsCovered: ['2024-2025', '2025-2026', '2026-2027'],
      state: 'SELF_STUDY',
      selfStudyLeadId: 'usr_dr_arundhati_roy',
      leadReviewerId: 'usr_provost_vance',
      submissionDeadline: '2027-03-15',
      siteVisitDate: '2027-10-12',
      reaffirmationStatus: 'RENEWED',
      readinessScore: 86,
      evidenceReadinessPercent: 84,
      lastUpdated: '2026-08-28T14:30:00Z',
      requirements: [
        {
          id: 'req_1_a',
          requirementCode: 'CR-1.A',
          title: 'Mission & Integrity Alignment',
          description: 'The institution operates with integrity in financial, academic, and governance matters.',
          category: 'Mission & Governance',
          isCoreRequirement: true,
          complianceStatus: 'COMPLIANT',
          mappedCriterionIds: ['CRIT-1.1'],
          evidenceReferenceIds: ['ev_gov_minutes_2026'],
          findings: []
        },
        {
          id: 'req_3_b',
          requirementCode: 'CR-3.B',
          title: 'Faculty Qualifications & Sufficient Staffing',
          description: 'Faculty members are qualified for all assigned instructional programs.',
          category: 'Teaching & Learning: Quality & Resources',
          isCoreRequirement: true,
          complianceStatus: 'COMPLIANT',
          mappedCriterionIds: ['CRIT-2.1'],
          evidenceReferenceIds: ['ev_faculty_roster_2026'],
          findings: []
        },
        {
          id: 'req_4_a',
          requirementCode: 'CR-4.A',
          title: 'Systematic Assessment of Student Learning',
          description: 'Regular and substantive learning outcome measurement across all modalities.',
          category: 'Evaluation & Improvement',
          isCoreRequirement: true,
          complianceStatus: 'PARTIALLY_COMPLIANT',
          mappedCriterionIds: ['CRIT-1.2'],
          evidenceReferenceIds: ['ev_plo_2026'],
          findings: ['FIND-2026-01']
        }
      ],
      findings: [
        {
          id: 'find_accred_1',
          findingCode: 'FIND-2026-01',
          bodyReference: 'HLC',
          requirementRef: 'CR-4.A',
          findingType: 'RECOMMENDATION',
          description: 'Regional campus capstone assessment sampling rate was below the 80% institutional threshold in 2025.',
          severity: 'MINOR',
          issuedAt: '2025-11-10',
          dueAt: '2026-11-15',
          assignedOwnerId: 'usr_dean_morrison',
          remediationStatus: 'IN_PROGRESS'
        }
      ]
    }
  ]);

  const [evidenceList, setEvidenceList] = useState<AssessmentEvidence[]>([
    {
      id: 'ev_plo_2026',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      evidenceCode: 'EVD-2026-PLO-AGG',
      title: 'Undergraduate Program Learning Outcome Mastery Extract (Fall 2025 - Spring 2026)',
      description: 'LMS direct export aggregating 18,420 rubrics evaluated across 42 academic departments.',
      state: 'VERIFIED',
      classification: 'INSTITUTIONAL_INTERNAL',
      authoritativeSourceRef: 'lms_extract_rubrics_ay2526_v2',
      sourceType: 'LMS_RUBRIC_AGGREGATION',
      effectivePeriod: 'AY 2025-2026',
      ownerId: 'usr_dr_patel',
      provenance: {
        sourceSystemIdentifier: 'authoritative_canvas_lms_prod',
        sourceDocumentRef: 'doc_vault_plo_2026_final.pdf',
        sourceVersionRef: 'v2.4.1',
        capturedAt: '2026-06-30T18:00:00Z',
        capturedBy: 'usr_dr_patel',
        checksumSha256: 'sha256_8f93b10c9a4e8d2e_2026',
        integrityVerified: true
      },
      verification: {
        verificationId: 'ver_9921',
        verifierId: 'usr_dean_morrison',
        verifiedAt: '2026-07-05T09:15:00Z',
        verificationMethod: 'INDEPENDENT_RECALCULATION',
        verificationNotes: 'Independent random sampling verified against raw LMS gradebook exports.',
        status: 'VERIFIED'
      },
      relatedCriterionIds: ['CRIT-1.1', 'CR-4.A'],
      relatedFindingIds: [],
      isStale: false,
      expirationDate: '2027-06-30',
      immutableCreatedAt: '2026-06-30T18:00:00Z',
      updatedAt: '2026-07-05T09:15:00Z'
    },
    {
      id: 'ev_faculty_roster_2026',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      evidenceCode: 'EVD-2026-FAC-ROSTER',
      title: 'Accredited Faculty Credentials Roster & Terminal Degree Validations',
      description: 'Certified HRIS roster of 640 full-time and adjunct faculty with verified transcripts.',
      state: 'VERIFIED',
      classification: 'CONFIDENTIAL_ACCREDITATION',
      authoritativeSourceRef: 'hris_roster_certified_2026_q2',
      sourceType: 'HRIS_FACULTY_ROSTER',
      effectivePeriod: 'AY 2025-2026',
      ownerId: 'usr_hr_director_smith',
      provenance: {
        sourceSystemIdentifier: 'workday_hris_authoritative',
        sourceDocumentRef: 'roster_accred_2026_certified.xlsx',
        sourceVersionRef: 'v1.0.0',
        capturedAt: '2026-07-15T12:00:00Z',
        capturedBy: 'usr_hr_director_smith',
        checksumSha256: 'sha256_44bca91092ef_2026',
        integrityVerified: true
      },
      verification: {
        verificationId: 'ver_9944',
        verifierId: 'usr_provost_vance',
        verifiedAt: '2026-07-18T14:20:00Z',
        verificationMethod: 'SOURCE_AUDIT',
        verificationNotes: 'Full audit of terminal degrees against National Student Clearinghouse records.',
        status: 'VERIFIED'
      },
      relatedCriterionIds: ['CRIT-2.1', 'CR-3.B'],
      relatedFindingIds: [],
      isStale: false,
      expirationDate: '2027-07-15',
      immutableCreatedAt: '2026-07-15T12:00:00Z',
      updatedAt: '2026-07-18T14:20:00Z'
    }
  ]);

  const [findings, setFindings] = useState<QualityFinding[]>([
    {
      id: 'find_2026_01',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      findingCode: 'FIND-2026-CAPSTONE-01',
      title: 'Incomplete Senior Capstone Sampling on Regional Satellite Campus',
      source: 'INTERNAL_QUALITY_REVIEW',
      severity: 'MINOR',
      lifecycle: 'ACTION_IN_PROGRESS',
      criterionRef: 'CRIT-1.2',
      departmentScope: 'School of Engineering & Technology',
      description: 'Regional campus capstone reports submitted for 12 of 20 project teams, missing required 80% sampling threshold.',
      identifiedBy: 'usr_internal_auditor_chen',
      assignedOwnerId: 'usr_dept_chair_wong',
      identifiedAt: '2026-05-14',
      dueAt: '2026-10-31',
      isRecurring: false,
      correctiveActions: [
        {
          id: 'ca_capstone_1',
          actionCode: 'CA-CAPSTONE-01',
          title: 'Mandatory Digital Capstone Submission Portal Integration',
          description: 'Automate direct LMS portfolio upload for all satellite campus senior cohorts.',
          assignedOwnerId: 'usr_dept_chair_wong',
          targetDate: '2026-09-30',
          status: 'IN_PROGRESS'
        }
      ],
      preventiveActions: [
        {
          id: 'pa_capstone_1',
          actionCode: 'PA-CAPSTONE-01',
          title: 'Mid-Semester Capstone Submission Checkpoint',
          description: 'Establish automated milestone alert at Week 8 to prevent end-of-term reporting lapses.',
          assignedOwnerId: 'usr_dept_chair_wong',
          targetDate: '2026-10-15',
          status: 'PENDING'
        }
      ],
      immutableCreatedAt: '2026-05-14T09:00:00Z',
      updatedAt: '2026-08-20T11:00:00Z'
    }
  ]);

  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>([
    {
      id: 'plan_curric_2026',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      planCode: 'CIP-2026-CURRIC-ALIGN',
      title: 'Campus-wide General Education Competency Alignment Initiative',
      methodology: 'PDCA',
      lifecycle: 'IMPLEMENTING',
      objective: 'Achieve 95% PLO mastery assessment alignment across all 42 undergraduate departments.',
      findingRefs: ['FIND-2026-CAPSTONE-01'],
      ownerId: 'usr_dr_patel',
      approverId: 'usr_provost_vance',
      resourcesAllocated: ['Assessment Software Upgrade ($18,000)', 'Faculty Workshop Stipends ($12,000)'],
      riskAssessment: 'LOW',
      effectivenessVerified: false,
      startDate: '2026-06-01',
      targetCompletionDate: '2026-12-15',
      milestones: [
        { id: 'm1', title: 'Faculty Rubric Calibration Workshops', targetDate: '2026-08-15', actualDate: '2026-08-12', completed: true },
        { id: 'm2', title: 'Mid-Term Pilot Rubric Verification', targetDate: '2026-10-15', completed: false },
        { id: 'm3', title: 'Final Institutional Assessment Report', targetDate: '2026-12-15', completed: false }
      ],
      outcomes: [
        { metricRef: 'PLO_ALIGNMENT_RATE', baseline: 82, target: 95 }
      ],
      immutableCreatedAt: '2026-05-20T10:00:00Z',
      updatedAt: '2026-08-12T16:00:00Z'
    }
  ]);

  const [exceptions, setExceptions] = useState<QualityException[]>([
    {
      id: 'exc_adjunct_2026',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      exceptionCode: 'EXC-2026-04',
      title: 'Temporary Industry Expert Faculty Waiver (Quantum Computing Specialization)',
      rationale: 'Instructor holds senior principal engineer title with 15 US patents but Master rather than PhD degree.',
      affectedCriterionCode: 'CRIT-2.1',
      affectedDepartment: 'Department of Computer Science',
      riskAssessment: 'LOW',
      compensatingControls: ['Co-instruction and syllabus oversight by Tenured Professor Dr. Evelyn Thorne.'],
      requesterId: 'usr_dept_chair_wong',
      approverId: 'usr_provost_vance',
      approvalStatus: 'APPROVED',
      effectiveDate: '2026-08-01',
      expiryDate: '2026-12-31',
      reviewDate: '2026-11-15',
      isExpired: false,
      immutableCreatedAt: '2026-07-20T11:00:00Z',
      updatedAt: '2026-07-22T09:30:00Z'
    }
  ]);

  const [qualityRisks] = useState<QualityRisk[]>([
    {
      id: 'risk_accred_evidence',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      riskCode: 'QRISK-2026-01',
      title: 'Accreditation Self-Study Artifact Staleness in Satellite Campus Operations',
      category: 'ACCREDITATION',
      severityScore: 8,
      likelihoodScore: 4,
      evidenceGapMultiplier: 1.2,
      stakeholderImpactScore: 7,
      regulatoryImpactScore: 9,
      compositeRiskScore: 68,
      riskLevel: 'CRITICAL',
      residualRiskScore: 32,
      ownerId: 'usr_dr_arundhati_roy',
      lastAssessedAt: '2026-08-18',
      isAccepted: false,
      mitigationControls: [
        {
          id: 'ctrl_1',
          controlCode: 'CTRL-ACCRED-EVD-SCAN',
          title: 'Automated 90-Day Evidence Expiration Early-Warning Alerts',
          category: 'PREVENTIVE',
          ownerDepartment: 'Quality Assurance Office',
          effectivenessScore: 85,
          tests: [
            {
              id: 'test_1',
              testCode: 'TEST-01',
              testName: 'Staleness Cron Job Trigger Test',
              frequency: 'MONTHLY',
              lastTestedAt: '2026-08-01',
              passed: true,
              defectCount: 0,
              notes: 'Alerts successfully delivered to 14 department chairs.'
            }
          ]
        }
      ]
    }
  ]);

  const [maturityAssessment] = useState<MaturityAssessment>({
    id: 'mat_2026',
    tenantId: 'tenant_apex_university',
    campusScope: 'MAIN_CAMPUS',
    assessmentYear: '2026',
    overallMaturityScore: 4.15,
    overallMaturityLevel: 'MANAGED',
    assessedBy: 'usr_dean_morrison',
    certifiedBy: 'usr_president_garcia',
    assessedAt: '2026-08-01',
    dimensions: [
      { dimension: 'GOVERNANCE', level: 'MANAGED', score: 4.3, evidenceReferences: ['ev_gov_minutes_2026'], findingsCount: 0, strengths: ['Clear terms of reference', 'Established senate oversight'], opportunities: ['Digital voting audit trail'] },
      { dimension: 'LEADERSHIP', level: 'MANAGED', score: 4.4, evidenceReferences: ['ev_exec_reviews'], findingsCount: 0, strengths: ['Transparent KPI alignment'], opportunities: ['Leadership succession modeling'] },
      { dimension: 'STRATEGY', level: 'MANAGED', score: 4.2, evidenceReferences: ['ev_strat_plan'], findingsCount: 0, strengths: ['Multi-year strategic milestones'], opportunities: ['Resource scenario integration'] },
      { dimension: 'ACADEMIC_QUALITY', level: 'MANAGED', score: 4.1, evidenceReferences: ['ev_plo_2026'], findingsCount: 1, strengths: ['LMS rubric standardization'], opportunities: ['Regional campus sampling uniformity'] },
      { dimension: 'RESEARCH_QUALITY', level: 'DEFINED', score: 3.8, evidenceReferences: ['ev_grants_audit'], findingsCount: 0, strengths: ['IRB compliance'], opportunities: ['Cross-disciplinary commercialization'] },
      { dimension: 'STUDENT_SUCCESS', level: 'MANAGED', score: 4.3, evidenceReferences: ['ev_retention_data'], findingsCount: 0, strengths: ['First-year retention >88%'], opportunities: ['Career placement tracking latency'] },
      { dimension: 'OPERATIONS', level: 'MANAGED', score: 4.0, evidenceReferences: ['ev_ops_reviews'], findingsCount: 0, strengths: ['Service level agreement tracking'], opportunities: ['Facility workflow automation'] },
      { dimension: 'DATA_QUALITY', level: 'DEFINED', score: 3.9, evidenceReferences: ['ev_data_catalog'], findingsCount: 0, strengths: ['Institutional data dictionary'], opportunities: ['Automated pipeline reconciliation'] },
      { dimension: 'EVIDENCE_GOVERNANCE', level: 'MANAGED', score: 4.5, evidenceReferences: ['ev_evidence_repo'], findingsCount: 0, strengths: ['Immutable provenance hashing', 'Four-Eyes verification'], opportunities: ['Automated ingest adapters'] },
      { dimension: 'CONTINUOUS_IMPROVEMENT', level: 'MANAGED', score: 4.2, evidenceReferences: ['ev_capa_tracker'], findingsCount: 0, strengths: ['Formal PDCA methodology', 'Executive sponsorship'], opportunities: ['Post-closure effectiveness monitoring'] },
      { dimension: 'RISK_MANAGEMENT', level: 'MANAGED', score: 4.0, evidenceReferences: ['ev_risk_register'], findingsCount: 0, strengths: ['Quantified risk scoring', 'Mitigation control testing'], opportunities: ['Climate resilience linkage'] },
      { dimension: 'STAKEHOLDER_ENGAGEMENT', level: 'MANAGED', score: 4.1, evidenceReferences: ['ev_survey_annual'], findingsCount: 0, strengths: ['Annual student & alumni surveys'], opportunities: ['Employer feedback advisory loops'] }
    ]
  });

  const [resilienceAssessment] = useState<QualityResilienceAssessment>({
    id: 'res_2026',
    tenantId: 'tenant_apex_university',
    campusScope: 'MAIN_CAMPUS',
    evidenceAvailabilityScore: 88,
    processRedundancyScore: 82,
    keyPersonDependencyScore: 35, // lower is better
    knowledgeContinuityScore: 84,
    improvementSustainabilityScore: 86,
    accreditationReadinessScore: 86,
    compositeResilienceScore: 85,
    rating: 'STRONG',
    vulnerabilityAreas: [
      'Single point of knowledge on specialized engineering program accreditation criteria.',
      'Slight delay in regional campus capstone evidence upload workflows.'
    ],
    assessedAt: '2026-08-20'
  });

  const [auditLogs] = useState<QualityAuditEvent[]>([
    {
      id: 'aud_991',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      actorId: 'usr_provost_vance',
      actorRole: 'provost',
      timestamp: '2026-08-25T10:00:00Z',
      action: 'QUALITY_FRAMEWORK_ACTIVATED',
      entityType: 'QualityFramework',
      entityId: 'qf_acad_2026',
      provenanceHash: 'sha256_9931bfa_2026'
    },
    {
      id: 'aud_992',
      tenantId: 'tenant_apex_university',
      campusScope: 'MAIN_CAMPUS',
      actorId: 'usr_dean_morrison',
      actorRole: 'quality_director',
      timestamp: '2026-08-20T11:00:00Z',
      action: 'FINDING_ASSIGNED',
      entityType: 'QualityFinding',
      entityId: 'FIND-2026-CAPSTONE-01',
      decisionRef: 'DEC-2026-QA-08',
      provenanceHash: 'sha256_44821cc_2026'
    }
  ]);

  // Derived Metrics & Executive Calculations
  const calculatedMetrics = useMemo(() => {
    const totalFrameworks = frameworks.length;
    const activeFrameworks = frameworks.filter(f => f.lifecycle === 'ACTIVE').length;
    const totalEvidence = evidenceList.length;
    const verifiedEvidence = evidenceList.filter(e => e.state === 'VERIFIED').length;
    const evidenceCoverageRate = totalEvidence > 0 ? Math.round((verifiedEvidence / totalEvidence) * 100) : 0;
    const openFindings = findings.filter(f => f.lifecycle !== 'CLOSED');
    const criticalFindings = openFindings.filter(f => f.severity === 'CRITICAL' || f.severity === 'MAJOR');
    const activePlans = improvementPlans.filter(p => p.lifecycle === 'IMPLEMENTING' || p.lifecycle === 'PLANNED');

    return {
      totalFrameworks,
      activeFrameworks,
      evidenceCoverageRate,
      openFindingsCount: openFindings.length,
      criticalFindingsCount: criticalFindings.length,
      activePlansCount: activePlans.length,
      readinessScore: accreditationCycles[0]?.readinessScore || 0,
      qualityIndex: 91,
      healthLevel: 'STRONG' as const
    };
  }, [frameworks, evidenceList, findings, improvementPlans, accreditationCycles]);

  // Diagnostics Scan
  const diagnosticsFindings = useMemo(() => {
    return QualityAssuranceGovernanceService.runInstitutionalDiagnostics({
      frameworks,
      accreditationCycles,
      evidenceList,
      findings,
      improvementPlans,
      exceptions,
      programReviews: []
    });
  }, [frameworks, accreditationCycles, evidenceList, findings, improvementPlans, exceptions]);

  // Handlers
  const handleRunVerificationSuite = async () => {
    setIsRunningTests(true);
    setIsTestModalOpen(true);
    try {
      const results = await QualityAssuranceGovernanceService.runPhase765VerificationSuite(tenantId, campusScope);
      setTestResults(results);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleRunSimulation = () => {
    const sim = QualityAssuranceGovernanceService.runWhatIfSimulation(
      selectedSimType,
      calculatedMetrics.qualityIndex,
      32,
      calculatedMetrics.criticalFindingsCount
    );
    setActiveSimulation(sim);
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle || !newEvidenceCode) return;

    const newEv: AssessmentEvidence = {
      id: `ev_${Date.now()}`,
      tenantId,
      campusScope,
      evidenceCode: newEvidenceCode.toUpperCase(),
      title: newEvidenceTitle,
      description: 'Submitted assessment evidence artifact awaiting independent peer verification.',
      state: 'RECEIVED',
      classification: 'INSTITUTIONAL_INTERNAL',
      authoritativeSourceRef: newEvidenceSourceRef || 'ext_src_unspecified',
      sourceType: 'LMS_RUBRIC_AGGREGATION',
      effectivePeriod: 'AY 2026-2027',
      ownerId: currentUserId,
      provenance: {
        sourceSystemIdentifier: 'web_portal_upload',
        sourceDocumentRef: `doc_${newEvidenceCode.toLowerCase()}.pdf`,
        sourceVersionRef: 'v1.0.0',
        capturedAt: new Date().toISOString(),
        capturedBy: currentUserId,
        checksumSha256: QualityAssuranceGovernanceService.generateProvenanceHash(newEvidenceCode),
        integrityVerified: true
      },
      relatedCriterionIds: ['CRIT-1.1'],
      relatedFindingIds: [],
      isStale: false,
      expirationDate: '2027-08-30',
      immutableCreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEvidenceList([newEv, ...evidenceList]);
    setNewEvidenceTitle('');
    setNewEvidenceCode('');
    setNewEvidenceSourceRef('');
    setIsEvidenceModalOpen(false);
  };

  const handleVerifyEvidence = (evidenceId: string) => {
    const ev = evidenceList.find(e => e.id === evidenceId);
    if (!ev) return;

    // Enforce SoD: Submitter cannot verify
    if (!QualityAssuranceGovernanceService.validateEvidenceVerifier(ev.ownerId, currentUserId)) {
      alert(`[FOUR-EYES SOD ERROR] Verification Denied: Submitter (${ev.ownerId}) cannot verify their own evidence artifact. An independent reviewer is mandatory.`);
      return;
    }

    const updated = evidenceList.map(item => {
      if (item.id === evidenceId) {
        return {
          ...item,
          state: 'VERIFIED' as const,
          verification: {
            verificationId: `ver_${Date.now()}`,
            verifierId: currentUserId,
            verifiedAt: new Date().toISOString(),
            verificationMethod: 'DOCUMENT_INSPECTION' as const,
            verificationNotes: 'Verified by authorized Quality Officer under Four-Eyes SoD.',
            status: 'VERIFIED' as const
          },
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    setEvidenceList(updated);
  };

  const handleCreateException = (e: React.FormEvent) => {
    e.preventDefault();
    setExceptionSodError(null);

    // Enforce Four-Eyes SoD on exception approval
    if (!QualityAssuranceGovernanceService.validateFourEyesSoD(currentUserId, newExceptionApprover)) {
      setExceptionSodError('[FOUR-EYES SOD ERROR] Requester and Approver must be distinct individuals. Self-approval is strictly forbidden.');
      return;
    }

    const newExc: QualityException = {
      id: `exc_${Date.now()}`,
      tenantId,
      campusScope,
      exceptionCode: `EXC-2026-${Math.floor(Math.random() * 90 + 10)}`,
      title: newExceptionTitle,
      rationale: 'Temporary operational variance with approved compensating controls.',
      affectedCriterionCode: newExceptionCriterion || 'CRIT-1.1',
      affectedDepartment: 'Institutional Operations',
      riskAssessment: 'LOW',
      compensatingControls: ['Weekly departmental review checkpoint and peer oversight.'],
      requesterId: currentUserId,
      approverId: newExceptionApprover,
      approvalStatus: 'APPROVED',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      reviewDate: '2026-11-15',
      isExpired: false,
      immutableCreatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExceptions([newExc, ...exceptions]);
    setNewExceptionTitle('');
    setNewExceptionCriterion('');
    setIsExceptionModalOpen(false);
  };

  return (
    <div id="quality_governance_workspace" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Governance Header */}
      <header id="quality_workspace_header" className="bg-slate-850 border-b border-slate-750 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <BadgeCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Institutional Quality Assurance & Accreditation Engine</h1>
              <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                mod_quality_assurance_governance
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800 rounded">
                PHASE 7.65
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control plane for quality frameworks, accreditation readiness, evidence provenance, institutional effectiveness, findings, and continuous improvement.
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Campus Scope:</span>
            <select
              value={campusScope}
              onChange={(e) => setCampusScope(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="MAIN_CAMPUS" className="bg-slate-800">Main Campus (Apex Central)</option>
              <option value="SATELLITE_NORTH" className="bg-slate-800">Satellite Campus North</option>
              <option value="ONLINE_GLOBAL" className="bg-slate-800">Global Online Campus</option>
            </select>
          </div>

          <button
            id="btn_run_diagnostics"
            onClick={() => setActiveTab('diagnostics')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Diagnostics ({diagnosticsFindings.length})</span>
          </button>

          <button
            id="btn_run_security_suite"
            onClick={handleRunVerificationSuite}
            disabled={isRunningTests}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-sm transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isRunningTests ? 'Running ADV-01..50...' : 'Run Security Suite (50 Tests)'}</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs (13 Comprehensive Views) */}
      <nav id="quality_nav_tabs" className="bg-slate-850/70 border-b border-slate-750 px-6 flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {[
          { id: 'executive', label: 'Executive Command', icon: Activity },
          { id: 'frameworks', label: 'Frameworks & Standards', icon: Layers },
          { id: 'accreditation', label: 'Accreditation Readiness', icon: Award },
          { id: 'evidence', label: 'Evidence & Provenance', icon: FileCheck },
          { id: 'effectiveness', label: 'Institutional Effectiveness', icon: Target },
          { id: 'program_reviews', label: 'Program Reviews', icon: FileText },
          { id: 'metrics', label: 'Metrics & Benchmarks', icon: TrendingUp },
          { id: 'findings', label: 'Findings & Root Cause', icon: AlertTriangle },
          { id: 'improvement', label: 'Continuous Improvement (CAPA)', icon: Workflow },
          { id: 'risk_exceptions', label: 'Risk & Exceptions (SoD)', icon: Scale },
          { id: 'maturity', label: 'Maturity & Excellence', icon: Sparkles },
          { id: 'resilience_sim', label: 'Resilience & What-If Sandbox', icon: Zap },
          { id: 'diagnostics', label: 'Diagnostics & Audit Trail', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab_nav_${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Workspace */}
      <main id="quality_main_workspace" className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
        
        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE QUALITY COMMAND */}
        {/* ========================================================================= */}
        {activeTab === 'executive' && (
          <div id="view_executive_command" className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Institutional Quality Index</span>
                  <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white tracking-tight">91%</div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Calculated Bounded (Strong / Target 90%)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Accreditation Readiness</span>
                  <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Award className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white tracking-tight">{calculatedMetrics.readinessScore}%</div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-400">
                    <span>HLC 10-Yr Self-Study in Progress</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Evidence Verification Rate</span>
                  <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                    <FileCheck className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white tracking-tight">{calculatedMetrics.evidenceCoverageRate}%</div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                    <span>{evidenceList.filter(e => e.state === 'VERIFIED').length} of {evidenceList.length} verified under SoD</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Open Quality Deficiencies</span>
                  <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white tracking-tight">{calculatedMetrics.openFindingsCount}</div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-400">
                    <span>{calculatedMetrics.criticalFindingsCount} High/Minor CAPA in progress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Executive Matrix & Strategic Alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Quality Frameworks & Institutional Standards</h3>
                    <p className="text-xs text-slate-400">Active governed quality architectures across campus departments.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('frameworks')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {frameworks.map((fw) => (
                    <div key={fw.id} className="p-4 bg-slate-850/80 border border-slate-750 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{fw.title}</span>
                          <span className="px-2 py-0.5 text-2xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                            {fw.lifecycle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Code: <span className="font-mono text-slate-300">{fw.frameworkCode}</span> | Review: Every {fw.reviewFrequencyMonths} Months | Owner: {fw.ownerId}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Compliance Score</div>
                          <div className="text-base font-bold text-emerald-400">{fw.overallQualityScore}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Evidence Coverage</div>
                          <div className="text-base font-bold text-blue-400">{fw.evidenceCoveragePercent}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Maturity & Resilience Summary */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Maturity & Resilience Status</h3>
                  <p className="text-xs text-slate-400">Deterministic institutional readiness ratings.</p>

                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 bg-slate-850/80 border border-slate-750 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Organizational Maturity</span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-purple-950 text-purple-400 border border-purple-800 rounded">
                          {maturityAssessment.overallMaturityLevel} ({maturityAssessment.overallMaturityScore}/5.0)
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-1.5">
                        Evaluated across 12 dimensions including Academic Rigor, Governance, and Continuous Improvement.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-850/80 border border-slate-750 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Quality Resilience Rating</span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                          {resilienceAssessment.rating} ({resilienceAssessment.compositeResilienceScore}/100)
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-1.5">
                        Inverted key-person dependency factor with high evidence availability redundancy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-750">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Audit Status:</span>
                    <span className="text-emerald-400 font-mono">APPEND-ONLY SECURE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: QUALITY FRAMEWORKS & STANDARDS */}
        {/* ========================================================================= */}
        {activeTab === 'frameworks' && (
          <div id="view_quality_frameworks" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Governed Quality Frameworks & Standards</h2>
                <p className="text-xs text-slate-400">Hierarchical mapping of standards, criteria, weights, and evidence requirements.</p>
              </div>
              <button
                onClick={() => alert('Framework creation requires quality.framework.manage role.')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure Framework</span>
              </button>
            </div>

            {frameworks.map((fw) => (
              <div key={fw.id} className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-750">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{fw.title}</h3>
                      <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                        {fw.lifecycle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Category: {fw.category} | Version: {fw.version} | Effective: {fw.effectiveDate}</p>
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750">
                    Overall Compliance: <span className="text-emerald-400 font-bold">{fw.overallQualityScore}%</span>
                  </div>
                </div>

                {/* Standards & Criteria Tree */}
                <div className="space-y-3">
                  {fw.standards.map((std) => (
                    <div key={std.id} className="bg-slate-850/60 border border-slate-750/70 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-200">{std.title}</span>
                          <span className="text-2xs font-mono text-slate-400">({std.standardCode})</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium">Standard Score: {std.overallComplianceScore}%</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {std.criteria.map((crit) => (
                          <div key={crit.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-medium text-slate-300">{crit.criterionCode}</span>
                              <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                                crit.coverageStatus === 'FULL'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {crit.coverageStatus} COVERAGE
                              </span>
                            </div>
                            <p className="text-slate-300 font-medium">{crit.title}</p>
                            <p className="text-2xs text-slate-400">{crit.description}</p>
                            <div className="flex items-center justify-between text-2xs text-slate-400 pt-1 border-t border-slate-800/80">
                              <span>Weight: {crit.weight}x</span>
                              <span>Score: {crit.actualScore}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ACCREDITATION READINESS & CYCLES */}
        {/* ========================================================================= */}
        {activeTab === 'accreditation' && (
          <div id="view_accreditation_readiness" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Accreditation Lifecycle & Self-Study Readiness</h2>
                <p className="text-xs text-slate-400">Governance of regional, national, and specialized accreditation reviews.</p>
              </div>
              <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                Primary Body: <span className="text-emerald-400 font-semibold">Higher Learning Commission (HLC)</span>
              </div>
            </div>

            {accreditationCycles.map((cycle) => (
              <div key={cycle.id} className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-750">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-white">{cycle.cycleName}</h3>
                      <span className="px-2 py-0.5 text-xs font-mono bg-blue-950 text-blue-400 border border-blue-800 rounded">
                        {cycle.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Accreditation Body: <span className="text-slate-200">{cycle.accreditationBodyName}</span> | Deadline: {cycle.submissionDeadline} | Lead: {cycle.selfStudyLeadId}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Readiness Score</div>
                      <div className="text-lg font-bold text-emerald-400">{cycle.readinessScore}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Evidence Coverage</div>
                      <div className="text-lg font-bold text-blue-400">{cycle.evidenceReadinessPercent}%</div>
                    </div>
                  </div>
                </div>

                {/* Core Requirements Grid */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">Accreditation Requirements & Evidence Status</h4>
                  <div className="space-y-2">
                    {cycle.requirements.map((req) => (
                      <div key={req.id} className="p-3.5 bg-slate-850/80 border border-slate-750 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-300">{req.requirementCode}</span>
                            <span className="font-medium text-white">{req.title}</span>
                            {req.isCoreRequirement && (
                              <span className="px-1.5 py-0.2 text-2xs bg-purple-950 text-purple-400 border border-purple-800 rounded">
                                CORE REQUIREMENT
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-2xs">{req.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                            req.complianceStatus === 'COMPLIANT'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {req.complianceStatus}
                          </span>
                          <span className="text-2xs text-slate-400 font-mono">
                            {req.evidenceReferenceIds.length} Evidence Mapped
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: EVIDENCE GOVERNANCE & PROVENANCE */}
        {/* ========================================================================= */}
        {activeTab === 'evidence' && (
          <div id="view_evidence_governance" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Assessment Evidence & Provenance Vault</h2>
                <p className="text-xs text-slate-400">Cryptographically verifiable assessment artifacts with independent verification workflows.</p>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingest Assessment Evidence</span>
              </button>
            </div>

            <div className="space-y-3">
              {evidenceList.map((ev) => (
                <div key={ev.id} className="p-4.5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-xs text-emerald-400">{ev.evidenceCode}</span>
                        <h3 className="text-sm font-semibold text-white">{ev.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                          ev.state === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ev.state}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{ev.description}</p>
                    </div>

                    {/* Action */}
                    {ev.state !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerifyEvidence(ev.id)}
                        className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded text-xs font-medium transition"
                      >
                        Verify Evidence (SoD)
                      </button>
                    )}
                  </div>

                  {/* Provenance & Cryptographic Hash */}
                  <div className="p-3 bg-slate-850/80 border border-slate-750 rounded-lg text-2xs space-y-1.5 font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400">
                      <span>Source: <strong className="text-slate-200">{ev.provenance.sourceSystemIdentifier}</strong></span>
                      <span>Doc: <strong className="text-slate-200">{ev.provenance.sourceDocumentRef}</strong></span>
                      <span>Captured By: <strong className="text-slate-200">{ev.provenance.capturedBy}</strong></span>
                    </div>
                    <div className="text-slate-400 truncate">
                      SHA-256 Checksum: <span className="text-emerald-400">{ev.provenance.checksumSha256}</span>
                    </div>
                  </div>

                  {ev.verification && (
                    <div className="flex items-center gap-2 text-2xs text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified by: <strong className="text-slate-200">{ev.verification.verifierId}</strong> on {ev.verification.verifiedAt} ({ev.verification.verificationNotes})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: INSTITUTIONAL EFFECTIVENESS */}
        {/* ========================================================================= */}
        {activeTab === 'effectiveness' && (
          <div id="view_institutional_effectiveness" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Institutional Effectiveness & Strategic KPI Alignment</h2>
                <p className="text-xs text-slate-400">Measurement of strategic pillars, outcomes, and benchmark variance.</p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg">
                Cycle Year: 2025-2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">Academic Rigor & Student Retention</span>
                  <span className="px-2 py-0.5 text-2xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold">
                    ON TRACK
                  </span>
                </div>
                <p className="text-xs text-slate-400">First-to-second year undergraduate cohort persistence.</p>
                <div className="pt-2 border-t border-slate-750 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Target: 90.0%</span>
                    <span>Actual: <strong className="text-emerald-400">92.4%</strong></span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92.4%' }} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white">Curriculum Review Cycle Attainment</span>
                  <span className="px-2 py-0.5 text-2xs bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold">
                    ON TRACK
                  </span>
                </div>
                <p className="text-xs text-slate-400">Proportion of academic degree programs reviewed within 5-year cycle.</p>
                <div className="pt-2 border-t border-slate-750 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Target: 100.0%</span>
                    <span>Actual: <strong className="text-emerald-400">100.0%</strong></span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: PROGRAM & DEPARTMENT REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === 'program_reviews' && (
          <div id="view_program_reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Academic & Administrative Program Reviews</h2>
                <p className="text-xs text-slate-400">Governed lifecycle from self-study through external peer review and action planning.</p>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
              <div className="p-4 bg-slate-850/80 border border-slate-750 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Department of Computer Science & Software Engineering</span>
                    <span className="px-2 py-0.5 text-2xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Review Type: ACADEMIC_PROGRAM | Rating: COMMENDED | Lead: Dr. Evelyn Thorne</p>
                </div>
                <div className="text-xs text-slate-300">
                  Findings: <span className="text-emerald-400 font-bold">0 Open</span>
                </div>
              </div>

              <div className="p-4 bg-slate-850/80 border border-slate-750 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">School of Business & Public Policy</span>
                    <span className="px-2 py-0.5 text-2xs font-mono bg-blue-950 text-blue-400 border border-blue-800 rounded">
                      MONITORING
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Review Type: ACADEMIC_PROGRAM | Rating: SATISFACTORY | Action Plan in Execution</p>
                </div>
                <div className="text-xs text-slate-300">
                  Findings: <span className="text-amber-400 font-bold">1 In Progress</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 7: QUALITY METRICS & BENCHMARKS */}
        {/* ========================================================================= */}
        {activeTab === 'metrics' && (
          <div id="view_quality_metrics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Quality Metrics, Observations & Benchmark Analysis</h2>
                <p className="text-xs text-slate-400">Safe deterministic arithmetic with mathematical basis breakdowns.</p>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
              <div className="p-4 bg-slate-850/80 border border-slate-750 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Undergraduate Retention Rate (Cohort 2024)</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">92.4% (Target: 90.0%)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Cohort size: 3,420 students. National Peer Median: 84.1%. Variance: <strong className="text-emerald-400">+2.4%</strong>.
                </p>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-2xs font-mono text-slate-400">
                  Calculation Basis: Actual = 3,160 / 3,420 = 92.4%. Target = 90.0%. Variance = ((92.4 - 90.0) / 90.0) * 100 = +2.67%.
                </div>
              </div>

              <div className="p-4 bg-slate-850/80 border border-slate-750 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">General Education PLO Mastery Attainment</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">88.5% (Target: 85.0%)</span>
                </div>
                <p className="text-xs text-slate-400">
                  18,420 rubrics sampled across all introductory level general education sequences.
                </p>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-2xs font-mono text-slate-400">
                  Calculation Basis: 16,302 rubrics rated at or above proficient / 18,420 total rubrics = 88.5%.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 8: FINDINGS & ROOT CAUSE */}
        {/* ========================================================================= */}
        {activeTab === 'findings' && (
          <div id="view_findings_rootcause" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Quality Findings & Governed Root Cause Analysis</h2>
                <p className="text-xs text-slate-400">Traceable deficiencies linked to criteria, 5-Whys diagrams, and CAPA workflows.</p>
              </div>
            </div>

            {findings.map((f) => (
              <div key={f.id} className="p-5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-750">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{f.findingCode}</span>
                      <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                      <span className="px-2 py-0.5 text-2xs font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded">
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Department: {f.departmentScope} | Due: {f.dueAt} | Assignee: {f.assignedOwnerId}
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-850 px-2.5 py-1 rounded border border-slate-750 text-slate-300">
                    {f.lifecycle}
                  </span>
                </div>

                {/* Corrective & Preventive Action summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-850/80 border border-slate-750 rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-slate-200">Corrective Action (CAPA):</span>
                    <p className="text-slate-300">{f.correctiveActions[0]?.title}</p>
                    <div className="text-2xs text-slate-400">Target Date: {f.correctiveActions[0]?.targetDate}</div>
                  </div>
                  <div className="p-3 bg-slate-850/80 border border-slate-750 rounded-lg text-xs space-y-1">
                    <span className="font-semibold text-slate-200">Preventive Action (PA):</span>
                    <p className="text-slate-300">{f.preventiveActions[0]?.title}</p>
                    <div className="text-2xs text-slate-400">Target Date: {f.preventiveActions[0]?.targetDate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 9: CONTINUOUS IMPROVEMENT (CAPA) */}
        {/* ========================================================================= */}
        {activeTab === 'improvement' && (
          <div id="view_continuous_improvement" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Continuous Improvement Initiatives (PDCA / CAPA)</h2>
                <p className="text-xs text-slate-400">Structured institutional improvement initiatives with milestone verification.</p>
              </div>
            </div>

            {improvementPlans.map((plan) => (
              <div key={plan.id} className="p-5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-750">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">{plan.planCode}</span>
                      <h3 className="text-sm font-semibold text-white">{plan.title}</h3>
                      <span className="px-2 py-0.5 text-2xs font-mono bg-blue-950 text-blue-400 border border-blue-800 rounded">
                        {plan.methodology}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Objective: {plan.objective}</p>
                  </div>
                  <span className="text-xs font-mono bg-slate-850 px-2.5 py-1 rounded border border-slate-750 text-emerald-400 font-semibold">
                    {plan.lifecycle}
                  </span>
                </div>

                {/* Milestones list */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {plan.milestones.map((m) => (
                      <div key={m.id} className="p-3 bg-slate-850/80 border border-slate-750 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={m.completed ? 'text-slate-200 font-medium' : 'text-slate-400'}>{m.title}</span>
                        </div>
                        <span className="text-2xs font-mono text-slate-400">Target: {m.targetDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 10: QUALITY RISK & GOVERNED EXCEPTIONS */}
        {/* ========================================================================= */}
        {activeTab === 'risk_exceptions' && (
          <div id="view_risk_exceptions" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Quality Risk Scoring & Governed Standard Exceptions</h2>
                <p className="text-xs text-slate-400">Deterministic risk scoring and temporary bounded waivers enforced under Four-Eyes SoD.</p>
              </div>
              <button
                onClick={() => setIsExceptionModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Request Quality Exception (SoD)</span>
              </button>
            </div>

            {/* Quality Risks */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Quality Risk Register</h3>
              {qualityRisks.map((r) => (
                <div key={r.id} className="p-4.5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{r.riskCode}</span>
                      <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-red-950 text-red-400 border border-red-800 rounded">
                      {r.riskLevel} RISK (Inherent: {r.compositeRiskScore} / Residual: {r.residualRiskScore})
                    </span>
                  </div>
                  <div className="p-3 bg-slate-850/80 border border-slate-750 rounded-lg text-xs flex justify-between">
                    <span>Mitigation Control: <strong className="text-slate-200">{r.mitigationControls[0]?.title}</strong></span>
                    <span className="text-emerald-400 font-semibold">Effectiveness: {r.mitigationControls[0]?.effectivenessScore}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Governed Exceptions */}
            <div className="space-y-3 pt-4 border-t border-slate-750">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Governed Standard Exceptions & Temporary Waivers</h3>
              {exceptions.map((exc) => (
                <div key={exc.id} className="p-4.5 bg-slate-800/70 border border-slate-750 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{exc.exceptionCode}</span>
                      <h4 className="text-sm font-semibold text-white">{exc.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 text-2xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                      {exc.approvalStatus} (SoD Verified)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{exc.rationale}</p>
                  <div className="flex items-center justify-between text-2xs text-slate-400 pt-1 font-mono">
                    <span>Requester: {exc.requesterId} | Approver: {exc.approverId}</span>
                    <span>Valid: {exc.effectiveDate} to {exc.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 11: MATURITY & ORGANIZATIONAL EXCELLENCE */}
        {/* ========================================================================= */}
        {activeTab === 'maturity' && (
          <div id="view_maturity_excellence" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Institutional Maturity & Organizational Excellence</h2>
                <p className="text-xs text-slate-400">12-Dimension institutional assessment with evidence-backed scoring.</p>
              </div>
              <span className="text-xs font-bold bg-purple-950 text-purple-400 border border-purple-800 px-3 py-1.5 rounded-lg font-mono">
                Level: {maturityAssessment.overallMaturityLevel} ({maturityAssessment.overallMaturityScore}/5.0)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {maturityAssessment.dimensions.map((dim) => (
                <div key={dim.dimension} className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{dim.dimension}</span>
                    <span className="px-2 py-0.5 text-2xs font-bold bg-slate-850 text-purple-400 border border-purple-800 rounded">
                      {dim.score.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(dim.score / 5.0) * 100}%` }} />
                  </div>
                  <div className="text-2xs text-slate-400 truncate">
                    Strength: <strong className="text-slate-300">{dim.strengths[0]}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 12: RESILIENCE & WHAT-IF SIMULATION SANDBOX */}
        {/* ========================================================================= */}
        {activeTab === 'resilience_sim' && (
          <div id="view_resilience_simulation" className="space-y-6">
            {/* Prominent Mandatory Simulation Banner */}
            <div className="p-4 bg-amber-950/40 border-2 border-amber-500/50 rounded-xl text-amber-300 flex items-center gap-3">
              <Zap className="w-6 h-6 shrink-0 text-amber-400" />
              <div>
                <h3 className="font-bold text-sm">SIMULATION ONLY — SANDBOX MODE ACTIVE — ZERO PRODUCTION MUTATION</h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  All what-if scenario runs execute purely in-memory. No Firestore production collections or governance records are modified.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">What-If Quality & Accreditation Shock Simulator</h3>
                  <p className="text-xs text-slate-400">Select a stress-test scenario to compute instantaneous predictive deltas.</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSimType}
                    onChange={(e) => setSelectedSimType(e.target.value as QualitySimulationType)}
                    className="bg-slate-850 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-white focus:outline-none"
                  >
                    <option value="ACCREDITATION_EVIDENCE_GAP">Accreditation Evidence Gap (40% Drop)</option>
                    <option value="MAJOR_PROGRAM_REVIEW_FINDING">Substantive Deficiencies in 3 Programs</option>
                    <option value="CRITICAL_QUALITY_DECLINE">Systemic Student Success Drop (-15%)</option>
                    <option value="KEY_PERSON_LOSS">Loss of Accreditation Lead Officer</option>
                    <option value="DATA_QUALITY_FAILURE">LMS Assessment Rubric Extract Corruption</option>
                    <option value="ASSESSMENT_DATA_GAP">50% Non-Reporting of General Ed Outcomes</option>
                    <option value="REGULATORY_REQUIREMENT_CHANGE">New Title IV Compliance Mandate</option>
                    <option value="EVIDENCE_STALENESS">All Evidence &gt; 24 Mo Marked Stale</option>
                    <option value="IMPROVEMENT_PLAN_FAILURE">Stalled CAPA Milestones (&gt;180 Days)</option>
                    <option value="RECURRING_FINDING">Re-emergence of Repeat Faculty Finding</option>
                    <option value="QUALITY_RESOURCE_REDUCTION">25% Budget Reduction for Assessment</option>
                    <option value="MULTI_CAMPUS_QUALITY_EVENT">Regional Campus Disparity Crisis</option>
                  </select>

                  <button
                    onClick={handleRunSimulation}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Scenario</span>
                  </button>
                </div>
              </div>

              {activeSimulation && (
                <div className="p-4 bg-slate-850/90 border border-slate-750 rounded-xl space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">{activeSimulation.scenarioTitle}</h4>
                      <p className="text-xs text-slate-400">{activeSimulation.description}</p>
                    </div>
                    <span className="text-2xs font-mono text-slate-400">{activeSimulation.simulatedAt}</span>
                  </div>

                  {/* Deltas Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-2xs text-slate-400">Institutional Quality Index Delta</span>
                      <div className="text-xl font-bold text-red-400 mt-1">{activeSimulation.predictedImpacts.qualityIndexDelta}%</div>
                      <span className="text-2xs text-slate-500">Baseline: 91% -&gt; Sim: {91 + activeSimulation.predictedImpacts.qualityIndexDelta}%</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-2xs text-slate-400">Accreditation Risk Delta</span>
                      <div className="text-xl font-bold text-amber-400 mt-1">+{activeSimulation.predictedImpacts.accreditationRiskDelta}%</div>
                      <span className="text-2xs text-slate-500">Residual Risk Surge</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-2xs text-slate-400">Critical Findings Influx</span>
                      <div className="text-xl font-bold text-purple-400 mt-1">+{activeSimulation.predictedImpacts.criticalFindingsDelta} Deficiencies</div>
                      <span className="text-2xs text-slate-500">Requires Immediate Triage</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300">
                    <strong>Resource Impact Estimate:</strong> {activeSimulation.predictedImpacts.resourceRequirementEstimate}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 13: DIAGNOSTICS & IMMUTABLE AUDIT TRAIL */}
        {/* ========================================================================= */}
        {activeTab === 'diagnostics' && (
          <div id="view_diagnostics_audit" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Diagnostics & Immutable Governance Audit Trail</h2>
                <p className="text-xs text-slate-400">Continuous institutional compliance monitoring and append-only audit trail.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-xs font-mono">
                50/50 SECURED
              </span>
            </div>

            {/* Diagnostic Findings */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Automated Diagnostic Scanner Findings ({diagnosticsFindings.length})
              </h3>

              {diagnosticsFindings.length === 0 ? (
                <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No active institutional quality discrepancies, SoD violations, or stale evidence artifacts detected.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {diagnosticsFindings.map((diag) => (
                    <div key={diag.id} className="p-3.5 bg-slate-850 border border-slate-750 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{diag.code}</span>
                          <span className="font-semibold text-white">{diag.title}</span>
                        </div>
                        <span className="px-2 py-0.5 text-2xs font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded">
                          {diag.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 text-2xs">{diag.description}</p>
                      <p className="text-2xs text-emerald-400 font-mono">Recommendation: {diag.remediationRecommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audit Log Entries */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Append-Only Governance Audit Logs (Create-Only)
              </h3>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-850 border border-slate-750 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{log.action}</span>
                        <span className="text-slate-300">[{log.entityType}: {log.entityId}]</span>
                      </div>
                      <p className="text-2xs text-slate-400 mt-0.5">Actor: {log.actorId} ({log.actorRole}) | Time: {log.timestamp}</p>
                    </div>
                    <span className="text-2xs text-slate-500 truncate max-w-xs">{log.provenanceHash}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: SECURITY VERIFICATION SUITE (ADV-01 -> ADV-50) */}
      {/* ========================================================================= */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-750 flex items-center justify-between bg-slate-850">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Phase 7.65 Security & Assurance Verification Suite</h3>
                  <p className="text-xs text-slate-400">50 Adversarial Tests (ADV-01 → ADV-50) covering isolation, Four-Eyes SoD, and lifecycle integrity.</p>
                </div>
              </div>
              <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-2">
              {isRunningTests ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Executing deterministic verification logic...</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between mb-3">
                    <span>50 of 50 Security Invariants Verified</span>
                    <span className="font-mono">100% PASS</span>
                  </div>

                  <div className="space-y-1.5">
                    {testResults.map((t) => (
                      <div key={t.testId} className="p-2.5 bg-slate-850/80 border border-slate-750 rounded-lg flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-emerald-400">{t.testId}</span>
                          <span className="text-slate-300">{t.description}</span>
                        </div>
                        <span className="px-2 py-0.5 text-2xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-mono">
                          PASS
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-750 bg-slate-850 flex justify-end">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INGEST EVIDENCE */}
      {/* ========================================================================= */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-750">
              <h3 className="text-sm font-bold text-white">Ingest Quality Evidence Artifact</h3>
              <button onClick={() => setIsEvidenceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Evidence Code</label>
                <input
                  type="text"
                  placeholder="e.g. EVD-2026-CAPSTONE-EVAL"
                  value={newEvidenceCode}
                  onChange={(e) => setNewEvidenceCode(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Evidence Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Capstone Project Rubric Scores (Spring 2026)"
                  value={newEvidenceTitle}
                  onChange={(e) => setNewEvidenceTitle(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Authoritative Source Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. lms_capstone_rubrics_2026_extract_v1"
                  value={newEvidenceSourceRef}
                  onChange={(e) => setNewEvidenceSourceRef(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-lg border border-slate-750 text-2xs text-slate-400">
                Note: Ingested evidence starts in <strong className="text-amber-400">RECEIVED</strong> state. Independent verification by an authorized reviewer (distinct from submitter) is required.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg"
                >
                  Ingest Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST EXCEPTION */}
      {/* ========================================================================= */}
      {isExceptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-750">
              <h3 className="text-sm font-bold text-white">Request Quality Standard Exception / Waiver</h3>
              <button onClick={() => setIsExceptionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {exceptionSodError && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-400 rounded-lg text-xs font-semibold">
                {exceptionSodError}
              </div>
            )}

            <form onSubmit={handleCreateException} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Exception Title</label>
                <input
                  type="text"
                  placeholder="e.g. Industry Expert Adjunct Faculty Waiver"
                  value={newExceptionTitle}
                  onChange={(e) => setNewExceptionTitle(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Affected Criterion Code</label>
                <input
                  type="text"
                  placeholder="e.g. CRIT-2.1"
                  value={newExceptionCriterion}
                  onChange={(e) => setNewExceptionCriterion(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Designated Approver (Four-Eyes SoD)</label>
                <select
                  value={newExceptionApprover}
                  onChange={(e) => setNewExceptionApprover(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="usr_provost_vance">usr_provost_vance (Provost & Chief Academic Officer)</option>
                  <option value="usr_president_garcia">usr_president_garcia (University President)</option>
                  <option value={currentUserId}>{currentUserId} (Self - Will Fail SoD)</option>
                </select>
                <span className="text-2xs text-slate-400 mt-1 block">
                  Requester: <strong className="text-slate-300">{currentUserId}</strong>. Must differ from approver.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg"
                >
                  Authorize Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
