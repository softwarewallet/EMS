import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { QualityExecutionService } from '../../services/qualityExecutionService';
import { AuditService } from '../../services/auditService';
import {
  QualityAssessmentCycle,
  QualityCriterion,
  QualityIndicator,
  AssessmentSubmission,
  EvidenceMapping,
  ProgramQualityReview,
  ImprovementInitiative,
  CAPAAction,
  AccreditationEvidencePackage,
  QualityAnalytics
} from '../../types/qualityExecution';
import { AuditRecord } from '../../types';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  BarChart3,
  Layers,
  FileText,
  RefreshCw,
  Plus,
  ShieldAlert,
  Search,
  Check,
  X,
  Building,
  Calendar,
  Zap,
  CheckSquare,
  ShieldCheck,
  Target,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const QualityExecutionWorkspace: React.FC = () => {
  const { currentTenant } = useTenant();
  const { currentUser, activeRoleAssignment } = useAuth();
  const tenantId = currentTenant?.id || 'tenant_main';
  const actorId = currentUser?.uid || 'usr_admin';
  const actorEmail = currentUser?.email || 'admin@institution.edu';
  const actorName = currentUser?.displayName || activeRoleAssignment?.roleCode || 'Quality Administrator';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'cycles' | 'submissions' | 'evidence' | 'reviews' | 'pdca' | 'capa' | 'packages'
  >('overview');

  const [campusFilter, setCampusFilter] = useState<string>('MAIN_CAMPUS');

  // State
  const [analytics, setAnalytics] = useState<QualityAnalytics | null>(null);
  const [cycles, setCycles] = useState<QualityAssessmentCycle[]>([]);
  const [criteria, setCriteria] = useState<QualityCriterion[]>([]);
  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [evidenceMappings, setEvidenceMappings] = useState<EvidenceMapping[]>([]);
  const [programReviews, setProgramReviews] = useState<ProgramQualityReview[]>([]);
  const [initiatives, setInitiatives] = useState<ImprovementInitiative[]>([]);
  const [capaActions, setCapaActions] = useState<CAPAAction[]>([]);
  const [evidencePackages, setEvidencePackages] = useState<AccreditationEvidencePackage[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals & Forms
  const [showCycleModal, setShowCycleModal] = useState<boolean>(false);
  const [showSubModal, setShowSubModal] = useState<boolean>(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showPdcaModal, setShowPdcaModal] = useState<boolean>(false);
  const [showCapaModal, setShowCapaModal] = useState<boolean>(false);
  const [showPackageModal, setShowPackageModal] = useState<boolean>(false);

  // Form states
  const [newCycle, setNewCycle] = useState({
    name: '',
    description: '',
    cycleType: 'ANNUAL' as QualityAssessmentCycle['cycleType'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    academicYearId: 'AY-2025-26'
  });

  const [newSub, setNewSub] = useState({
    cycleId: '',
    criterionId: '',
    indicatorId: '',
    actualValue: 0,
    narrative: ''
  });

  const [newEvidence, setNewEvidence] = useState({
    criterionId: '',
    documentRegistryId: '',
    evidenceType: 'POLICY_DOCUMENT',
    evidencePeriod: 'AY-2025-26',
    relevanceScore: 90
  });

  const [newReview, setNewReview] = useState({
    departmentId: 'DEP-CSE',
    programId: 'PRG-BTECH-CSE',
    reviewPeriod: 'AY-2025-26',
    reviewType: 'ANNUAL' as ProgramQualityReview['reviewType'],
    findings: '',
    strengths: ['Strong Faculty-to-Student Ratio', 'Active Industry Collaborations'],
    gaps: ['Curriculum lab infrastructure needs upgrade'],
    recommendations: ['Integrate AI/ML core lab into 5th semester']
  });

  const [newPdca, setNewPdca] = useState({
    title: '',
    objective: '',
    sourceType: 'ASSESSMENT' as ImprovementInitiative['sourceType'],
    priority: 'HIGH' as ImprovementInitiative['priority'],
    dueDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    successCriteria: '',
    baselineValue: 50,
    targetValue: 85
  });

  const [newCapa, setNewCapa] = useState({
    sourceType: 'AUDIT' as CAPAAction['sourceType'],
    actionType: 'CORRECTIVE' as CAPAAction['actionType'],
    rcaMethodology: 'FIVE_WHYS' as CAPAAction['rcaMethodology'],
    rootCause: '',
    correctiveAction: '',
    preventiveAction: '',
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  const [newPackage, setNewPackage] = useState({
    cycleId: '',
    name: 'NAAC SSR Accreditation Evidence Bundle 2026',
    selectedCriteria: [] as string[]
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        analyticsData,
        cyclesData,
        criteriaData,
        indicatorsData,
        subsData,
        evData,
        reviewsData,
        pdcaData,
        capaData,
        pkgData,
        logsData
      ] = await Promise.all([
        QualityExecutionService.getAnalytics(tenantId, campusFilter),
        QualityExecutionService.getAssessmentCycles(tenantId, campusFilter),
        QualityExecutionService.getCriteria(tenantId, campusFilter),
        QualityExecutionService.getIndicators(tenantId),
        QualityExecutionService.getSubmissions(tenantId),
        QualityExecutionService.getEvidenceMappings(tenantId),
        QualityExecutionService.getProgramReviews(tenantId, campusFilter),
        QualityExecutionService.getImprovementInitiatives(tenantId, campusFilter),
        QualityExecutionService.getCAPAActions(tenantId, campusFilter),
        QualityExecutionService.getAccreditationPackages(tenantId, campusFilter),
        AuditService.getAuditLogs({ tenantId, limit: 20 })
      ]);

      setAnalytics(analyticsData);
      setCycles(cyclesData);
      setCriteria(criteriaData);
      setIndicators(indicatorsData);
      setSubmissions(subsData);
      setEvidenceMappings(evData);
      setProgramReviews(reviewsData);
      setInitiatives(pdcaData);
      setCapaActions(capaData);
      setEvidencePackages(pkgData);
      setAuditLogs(logsData.filter(l => l.action.startsWith('QUALITY_')));

      if (cyclesData.length > 0 && !newSub.cycleId) {
        setNewSub(prev => ({ ...prev, cycleId: cyclesData[0].id }));
        setNewPackage(prev => ({ ...prev, cycleId: cyclesData[0].id }));
      }
      if (criteriaData.length > 0 && !newSub.criterionId) {
        setNewSub(prev => ({ ...prev, criterionId: criteriaData[0].id }));
        setNewEvidence(prev => ({ ...prev, criterionId: criteriaData[0].id }));
      }
    } catch (err: any) {
      console.error('Error loading quality execution workspace data:', err);
      setNotification({ type: 'error', message: err.message || 'Failed to load quality execution data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusFilter]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // Actions
  const handleCreateCycle = async () => {
    try {
      await QualityExecutionService.createAssessmentCycle(
        {
          tenantId,
          campusId: campusFilter,
          academicYearId: newCycle.academicYearId,
          name: newCycle.name,
          description: newCycle.description,
          cycleType: newCycle.cycleType,
          startDate: newCycle.startDate,
          endDate: newCycle.endDate,
          ownerId: actorId
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', `Assessment cycle "${newCycle.name}" created successfully.`);
      setShowCycleModal(false);
      setNewCycle({
        name: '',
        description: '',
        cycleType: 'ANNUAL',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        academicYearId: 'AY-2025-26'
      });
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create assessment cycle');
    }
  };

  const handleApproveCycle = async (cycleId: string) => {
    try {
      await QualityExecutionService.approveAssessmentCycle(cycleId, tenantId, actorId, actorEmail, actorName);
      showToast('success', 'Assessment cycle approved and activated.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCreateSubmission = async () => {
    try {
      await QualityExecutionService.createSubmission(
        {
          tenantId,
          campusId: campusFilter,
          cycleId: newSub.cycleId,
          criterionId: newSub.criterionId,
          indicatorId: newSub.indicatorId || undefined,
          actualValue: Number(newSub.actualValue),
          narrative: newSub.narrative,
          evidenceReferenceIds: []
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'Assessment submission recorded successfully.');
      setShowSubModal(false);
      setNewSub(prev => ({ ...prev, actualValue: 0, narrative: '' }));
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to submit assessment.');
    }
  };

  const handleVerifySubmission = async (subId: string) => {
    try {
      await QualityExecutionService.verifySubmission(
        subId,
        tenantId,
        actorId,
        'Four-eyes verified by Quality Auditor',
        actorEmail,
        actorName
      );
      showToast('success', 'Assessment submission verified.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCreateEvidenceMapping = async () => {
    try {
      if (!newEvidence.documentRegistryId) {
        showToast('error', 'Document Registry ID (Phase 7.27) is required.');
        return;
      }
      await QualityExecutionService.createEvidenceMapping(
        {
          tenantId,
          campusId: campusFilter,
          criterionId: newEvidence.documentRegistryId,
          documentRegistryId: newEvidence.documentRegistryId,
          evidenceType: newEvidence.evidenceType,
          evidencePeriod: newEvidence.evidencePeriod,
          relevanceScore: Number(newEvidence.relevanceScore)
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'Evidence document mapped to criterion successfully.');
      setShowEvidenceModal(false);
      setNewEvidence(prev => ({ ...prev, documentRegistryId: '' }));
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to map evidence.');
    }
  };

  const handleVerifyEvidence = async (mappingId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await QualityExecutionService.verifyEvidenceMapping(
        mappingId,
        tenantId,
        actorId,
        status,
        'Verified against institutional document registry standards.',
        actorEmail,
        actorName
      );
      showToast('success', `Evidence mapping set to ${status}.`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCreateReview = async () => {
    try {
      await QualityExecutionService.createProgramReview(
        {
          tenantId,
          campusId: campusFilter,
          academicYearId: 'AY-2025-26',
          departmentId: newReview.departmentId,
          programId: newReview.programId,
          reviewPeriod: newReview.reviewPeriod,
          reviewType: newReview.reviewType,
          reviewerIds: [actorId],
          findings: newReview.findings,
          strengths: newReview.strengths,
          gaps: newReview.gaps,
          recommendations: newReview.recommendations
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'Program quality review created.');
      setShowReviewModal(false);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create program review');
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await QualityExecutionService.approveProgramReview(
        reviewId,
        tenantId,
        actorId,
        'Approved by Institutional Quality Committee',
        actorEmail,
        actorName
      );
      showToast('success', 'Program review approved.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCreatePdca = async () => {
    try {
      await QualityExecutionService.createImprovementInitiative(
        {
          tenantId,
          campusId: campusFilter,
          sourceType: newPdca.sourceType,
          title: newPdca.title,
          objective: newPdca.objective,
          ownerId: actorId,
          priority: newPdca.priority,
          startDate: new Date().toISOString().split('T')[0],
          dueDate: newPdca.dueDate,
          successCriteria: newPdca.successCriteria,
          baselineValue: Number(newPdca.baselineValue),
          targetValue: Number(newPdca.targetValue),
          currentValue: Number(newPdca.baselineValue)
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'Improvement initiative created.');
      setShowPdcaModal(false);
      setNewPdca(prev => ({ ...prev, title: '', objective: '' }));
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create initiative');
    }
  };

  const handleVerifyPdca = async (initId: string) => {
    try {
      await QualityExecutionService.verifyImprovementInitiative(initId, tenantId, actorId, actorEmail, actorName);
      showToast('success', 'Improvement initiative verified and marked COMPLETED.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCreateCapa = async () => {
    try {
      await QualityExecutionService.createCAPAAction(
        {
          tenantId,
          campusId: campusFilter,
          sourceType: newCapa.sourceType,
          actionType: newCapa.actionType,
          rcaMethodology: newCapa.rcaMethodology,
          rootCause: newCapa.rootCause,
          correctiveAction: newCapa.correctiveAction,
          preventiveAction: newCapa.preventiveAction,
          ownerId: actorId,
          dueDate: newCapa.dueDate,
          evidenceReferenceIds: []
        },
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'CAPA Action created with Root Cause Analysis.');
      setShowCapaModal(false);
      setNewCapa(prev => ({ ...prev, rootCause: '', correctiveAction: '', preventiveAction: '' }));
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create CAPA');
    }
  };

  const handleVerifyCapa = async (capaId: string) => {
    try {
      await QualityExecutionService.verifyCAPAAction(
        capaId,
        tenantId,
        actorId,
        'Action steps verified by Quality Committee auditor.',
        actorEmail,
        actorName
      );
      showToast('success', 'CAPA Action verified.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleCloseCapa = async (capaId: string) => {
    try {
      await QualityExecutionService.closeCAPAAction(
        capaId,
        tenantId,
        actorId,
        'Final closure authorized by Quality Governance Manager.',
        actorEmail,
        actorName
      );
      showToast('success', 'CAPA Action closed successfully.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleGeneratePackage = async () => {
    try {
      const selectedCritIds = criteria.map(c => c.id);
      await QualityExecutionService.generateAccreditationPackage(
        newPackage.cycleId || (cycles[0]?.id || 'qac_1'),
        tenantId,
        campusFilter,
        newPackage.name,
        selectedCritIds,
        actorId,
        actorEmail,
        actorName
      );
      showToast('success', 'Accreditation evidence package generated with dynamic completeness score.');
      setShowPackageModal(false);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to generate package');
    }
  };

  const handleApprovePackage = async (packageId: string) => {
    try {
      await QualityExecutionService.approveAccreditationPackage(packageId, tenantId, actorId, actorEmail, actorName);
      showToast('success', 'Accreditation evidence package approved for submission.');
      loadData();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Callout */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-sky-50 border-sky-200 text-sky-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            ) : notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />
            )}
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-900/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                EMS Phase 7.34 Governance Engine
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> SoD Enforced
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Award className="w-8 h-8 text-indigo-400" />
              Institutional Quality Execution & Accreditation Governance
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Governed quality assessment cycles, criteria evidence mappings (Phase 7.27), continuous improvement (PDCA), CAPA root-cause execution, and NAAC/NBA accreditation readiness.
            </p>
          </div>

          {/* Context Switcher & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/10 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-300 ml-2" />
              <select
                value={campusFilter}
                onChange={e => setCampusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-white pr-4 py-1 focus:outline-none cursor-pointer"
              >
                <option value="MAIN_CAMPUS" className="bg-slate-900 text-white">Main Campus</option>
                <option value="NORTH_CAMPUS" className="bg-slate-900 text-white">North Campus</option>
                <option value="ALL" className="bg-slate-900 text-white">All Campuses</option>
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
              title="Refresh Engine Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Metric Cards Banner */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">Active Cycles</span>
              <div className="text-xl font-extrabold text-white mt-0.5">{analytics.activeAssessmentCycles}</div>
              <span className="text-[10px] text-indigo-300">NAAC / NBA / ISO</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">Verification Backlog</span>
              <div className="text-xl font-extrabold text-amber-400 mt-0.5">{analytics.verificationBacklog}</div>
              <span className="text-[10px] text-amber-200/70">Submissions pending</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">Evidence Completeness</span>
              <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{analytics.evidenceCompleteness}%</div>
              <span className="text-[10px] text-emerald-300">Document Registry</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">CAPA Actions</span>
              <div className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                <span>{analytics.openCAPA}</span>
                {analytics.overdueCAPA > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-rose-500/30 text-rose-300 rounded font-bold">
                    {analytics.overdueCAPA} Overdue
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">Open & In-Progress</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">Accreditation Readiness</span>
              <div className="text-xl font-extrabold text-sky-400 mt-0.5">{analytics.accreditationReadiness}%</div>
              <span className="text-[10px] text-sky-300">SSR Evidence Package</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <span className="text-xs text-slate-400 font-medium">Quality Trend</span>
              <div className="text-base font-extrabold text-emerald-400 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>{analytics.qualityTrend}</span>
              </div>
              <span className="text-[10px] text-slate-400">Continuous Assessment</span>
            </div>
          </div>
        )}
      </div>

      {/* Governed Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex flex-wrap items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Command Center
        </button>

        <button
          onClick={() => setActiveTab('cycles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'cycles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Assessment Cycles ({cycles.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'submissions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Submissions ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Evidence Mapping ({evidenceMappings.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Program Reviews ({programReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('pdca')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pdca'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          Improvement (PDCA) ({initiatives.length})
        </button>

        <button
          onClick={() => setActiveTab('capa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'capa'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          CAPA & RCA ({capaActions.length})
        </button>

        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'packages'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Accreditation Packages ({evidencePackages.length})
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Framework Status Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  Quality Framework Criteria Coverage
                </h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {criteria.length} Criteria Configured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {criteria.map(crit => (
                  <div key={crit.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono text-[11px] font-bold">
                        {crit.framework} • {crit.criterionCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">Weight: {crit.weight}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{crit.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{crit.description}</p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-500">Owner: <strong className="text-slate-700">{crit.responsibleOwnerId}</strong></span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Assessment Submissions Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                  Recent Quality Submissions & Verification Pipeline
                </h3>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 font-medium">No assessment submissions recorded yet.</p>
                  <button
                    onClick={() => setShowSubModal(true)}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    + Record First Submission
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {submissions.slice(0, 5).map(sub => (
                    <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 font-mono">{sub.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{sub.narrative || 'Assessment measurement recorded'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-indigo-600">{sub.actualValue}</span>
                        <div className="text-[10px] text-slate-400">{new Date(sub.submissionDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Audit Event History Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Governance & SoD Audit Events
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No quality audit events logged in current session.</p>
                ) : (
                  auditLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span className="font-mono text-[11px] text-indigo-700">{log.action}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 font-bold'
                        }`}>{log.result}</span>
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-2">{log.notes || 'System action executed'}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>User: {log.userDisplayName || log.userId}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assessment Cycles */}
      {activeTab === 'cycles' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Institutional Quality Assessment Cycles</h3>
              <p className="text-xs text-slate-500">Manage annual, semester, and accreditation review cycles.</p>
            </div>
            <button
              onClick={() => setShowCycleModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              New Assessment Cycle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cycles.map(cycle => (
              <div key={cycle.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold font-mono">
                    {cycle.cycleType}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    cycle.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : cycle.status === 'APPROVED'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {cycle.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{cycle.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{cycle.description}</p>

                <div className="pt-2 text-xs space-y-1 text-slate-500 border-t border-slate-200">
                  <div className="flex justify-between"><span>Academic Year:</span> <strong className="text-slate-700">{cycle.academicYearId}</strong></div>
                  <div className="flex justify-between"><span>Dates:</span> <strong className="text-slate-700">{cycle.startDate} to {cycle.endDate}</strong></div>
                  <div className="flex justify-between"><span>Owner:</span> <strong className="text-slate-700">{cycle.ownerId}</strong></div>
                </div>

                {cycle.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleApproveCycle(cycle.id)}
                    className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Activate Cycle
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Submissions */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Criterion & Indicator Assessment Submissions</h3>
              <p className="text-xs text-slate-500">Record actual values, submit narratives, and execute 4-Eyes verification workflows.</p>
            </div>
            <button
              onClick={() => setShowSubModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Record Assessment Submission
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="p-3">Submission ID</th>
                  <th className="p-3">Criterion</th>
                  <th className="p-3">Actual Value</th>
                  <th className="p-3">Narrative</th>
                  <th className="p-3">Submitted By</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-700">{sub.id}</td>
                    <td className="p-3 font-semibold text-slate-800">{sub.criterionId}</td>
                    <td className="p-3 text-sm font-extrabold text-slate-900">{sub.actualValue}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{sub.narrative}</td>
                    <td className="p-3 text-slate-600">{sub.submittedBy}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        sub.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {sub.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerifySubmission(sub.id)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" /> Verify (4-Eyes)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Accreditation Evidence Mapping */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Accreditation Evidence Mapping (Phase 7.27 Integration)</h3>
              <p className="text-xs text-slate-500">Link authoritative Document Registry records to quality criteria with relevance scoring.</p>
            </div>
            <button
              onClick={() => setShowEvidenceModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Map Document Evidence
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidenceMappings.map(ev => (
              <div key={ev.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded text-xs font-mono font-bold">
                    Doc ID: {ev.documentRegistryId}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    ev.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ev.verificationStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600">
                  <div><strong>Criterion:</strong> {ev.criterionId}</div>
                  <div><strong>Evidence Type:</strong> {ev.evidenceType}</div>
                  <div><strong>Relevance Score:</strong> <span className="font-bold text-indigo-600">{ev.relevanceScore}%</span></div>
                </div>

                {ev.verificationStatus !== 'VERIFIED' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleVerifyEvidence(ev.id, 'VERIFIED')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      Verify Evidence
                    </button>
                    <button
                      onClick={() => handleVerifyEvidence(ev.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Program Quality Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Periodic Program & Department Quality Reviews</h3>
              <p className="text-xs text-slate-500">Conduct academic program audits, identify gaps, strengths, and recommendations.</p>
            </div>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Draft Program Review
            </button>
          </div>

          <div className="space-y-4">
            {programReviews.map(rev => (
              <div key={rev.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 font-mono">{rev.id}</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      Department: {rev.departmentId} ({rev.reviewType})
                    </h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    rev.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <strong className="text-emerald-800 block mb-1">Identified Strengths:</strong>
                    <ul className="list-disc list-inside text-emerald-900 space-y-0.5">
                      {rev.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                    <strong className="text-amber-800 block mb-1">Observed Gaps:</strong>
                    <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                      {rev.gaps.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>

                  <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                    <strong className="text-indigo-800 block mb-1">Recommendations:</strong>
                    <ul className="list-disc list-inside text-indigo-900 space-y-0.5">
                      {rev.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>

                {rev.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApproveReview(rev.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Program Quality Review
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Continuous Improvement (PDCA) */}
      {activeTab === 'pdca' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Continuous Improvement Initiatives (PDCA Governance)</h3>
              <p className="text-xs text-slate-500">Track Plan-Do-Check-Act improvement initiatives, baseline vs target progress.</p>
            </div>
            <button
              onClick={() => setShowPdcaModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              New Improvement Initiative
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initiatives.map(item => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-xs">
                    {item.priority} PRIORITY
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.objective}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Baseline: {item.baselineValue}</span>
                    <span className="text-indigo-600">Current: {item.currentValue}</span>
                    <span className="text-emerald-600">Target: {item.targetValue}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(5, (item.currentValue / item.targetValue) * 100))}%` }}
                    />
                  </div>
                </div>

                {item.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleVerifyPdca(item.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify Target Attainment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: CAPA Execution & RCA */}
      {activeTab === 'capa' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Corrective & Preventive Action (CAPA) Governance</h3>
              <p className="text-xs text-slate-500">Root Cause Analysis (5-Whys / Fishbone), corrective action steps, and Quality Manager final closure.</p>
            </div>
            <button
              onClick={() => setShowCapaModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Create CAPA Action
            </button>
          </div>

          <div className="space-y-4">
            {capaActions.map(capa => (
              <div key={capa.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold font-mono">
                      {capa.actionType}
                    </span>
                    <span className="text-xs text-slate-500">RCA Methodology: <strong>{capa.rcaMethodology}</strong></span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    capa.status === 'CLOSED'
                      ? 'bg-slate-200 text-slate-800'
                      : capa.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {capa.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <strong className="text-rose-700 block mb-1">Root Cause Analysis (RCA):</strong>
                    <p className="text-slate-700">{capa.rootCause}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <strong className="text-amber-700 block mb-1">Corrective Action:</strong>
                    <p className="text-slate-700">{capa.correctiveAction}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <strong className="text-indigo-700 block mb-1">Preventive Action:</strong>
                    <p className="text-slate-700">{capa.preventiveAction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Owner: <strong className="text-slate-800">{capa.ownerId}</strong> | Due: <strong className="text-slate-800">{capa.dueDate}</strong></span>
                  <div className="flex items-center gap-2">
                    {capa.status !== 'VERIFIED' && capa.status !== 'CLOSED' && (
                      <button
                        onClick={() => handleVerifyCapa(capa.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                      >
                        Verify Execution
                      </button>
                    )}
                    {capa.status === 'VERIFIED' && (
                      <button
                        onClick={() => handleCloseCapa(capa.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold"
                      >
                        Final Authoritative Closure (SoD)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Accreditation Evidence Packages */}
      {activeTab === 'packages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Accreditation Evidence Packages & Submission Bundles</h3>
              <p className="text-xs text-slate-500">Assemble NAAC/NBA accreditation readiness packages with computed completeness scores.</p>
            </div>
            <button
              onClick={() => setShowPackageModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              Generate Evidence Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidencePackages.map(pkg => (
              <div key={pkg.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-700">{pkg.id}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    pkg.readinessStatus === 'FULLY_READY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : pkg.readinessStatus === 'SUBSTANTIALLY_READY'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pkg.readinessStatus}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{pkg.name}</h4>

                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-600 text-lg">
                    {pkg.completenessScore}%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">Dynamic Completeness Score</span>
                    <p className="text-xs text-slate-500">{pkg.evidenceMappingIds.length} Document Registry attachments verified</p>
                  </div>
                </div>

                {pkg.readinessStatus !== 'FULLY_READY' && (
                  <button
                    onClick={() => handleApprovePackage(pkg.id)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Formally Approve & Lock Package
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Create Cycle */}
      {showCycleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Assessment Cycle</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cycle Name</label>
                <input
                  type="text"
                  value={newCycle.name}
                  onChange={e => setNewCycle({ ...newCycle, name: e.target.value })}
                  placeholder="e.g. NAAC Annual Institutional Quality Assessment 2025-26"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cycle Type</label>
                <select
                  value={newCycle.cycleType}
                  onChange={e => setNewCycle({ ...newCycle, cycleType: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  <option value="ANNUAL">ANNUAL</option>
                  <option value="SEMESTER">SEMESTER</option>
                  <option value="ACCREDITATION">ACCREDITATION</option>
                  <option value="PROGRAM_REVIEW">PROGRAM_REVIEW</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newCycle.description}
                  onChange={e => setNewCycle({ ...newCycle, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCycleModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreateCycle} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Create Cycle</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Submission */}
      {showSubModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Assessment Submission</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Criterion</label>
                <select
                  value={newSub.criterionId}
                  onChange={e => setNewSub({ ...newSub, criterionId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                >
                  {criteria.map(c => (
                    <option key={c.id} value={c.id}>{c.framework} - {c.criterionCode}: {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Actual Score / Value</label>
                <input
                  type="number"
                  value={newSub.actualValue}
                  onChange={e => setNewSub({ ...newSub, actualValue: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Evaluation Narrative</label>
                <textarea
                  value={newSub.narrative}
                  onChange={e => setNewSub({ ...newSub, narrative: e.target.value })}
                  placeholder="Provide supporting narrative rationale and attainment details..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowSubModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreateSubmission} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Submit Assessment</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Evidence Mapping */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Map Evidence (Phase 7.27 Document Registry)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Registry ID</label>
                <input
                  type="text"
                  value={newEvidence.documentRegistryId}
                  onChange={e => setNewEvidence({ ...newEvidence, documentRegistryId: e.target.value })}
                  placeholder="e.g. doc_reg_88291"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Relevance Score (%)</label>
                <input
                  type="number"
                  value={newEvidence.relevanceScore}
                  onChange={e => setNewEvidence({ ...newEvidence, relevanceScore: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowEvidenceModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreateEvidenceMapping} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Map Evidence</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create Review */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Draft Program Quality Review</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department ID</label>
                <input
                  type="text"
                  value={newReview.departmentId}
                  onChange={e => setNewReview({ ...newReview, departmentId: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Findings Summary</label>
                <textarea
                  value={newReview.findings}
                  onChange={e => setNewReview({ ...newReview, findings: e.target.value })}
                  placeholder="Summary of program review findings..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowReviewModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreateReview} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Create Review</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create PDCA */}
      {showPdcaModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">New Continuous Improvement Initiative</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={newPdca.title}
                  onChange={e => setNewPdca({ ...newPdca, title: e.target.value })}
                  placeholder="e.g. Modernization of Software Engineering Lab Infrastructure"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Objective</label>
                <textarea
                  value={newPdca.objective}
                  onChange={e => setNewPdca({ ...newPdca, objective: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Baseline Value</label>
                  <input
                    type="number"
                    value={newPdca.baselineValue}
                    onChange={e => setNewPdca({ ...newPdca, baselineValue: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Value</label>
                  <input
                    type="number"
                    value={newPdca.targetValue}
                    onChange={e => setNewPdca({ ...newPdca, targetValue: Number(e.target.value) })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowPdcaModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreatePdca} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Create Initiative</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create CAPA */}
      {showCapaModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create CAPA Action (Root Cause Analysis)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Root Cause Analysis (RCA)</label>
                <textarea
                  value={newCapa.rootCause}
                  onChange={e => setNewCapa({ ...newCapa, rootCause: e.target.value })}
                  placeholder="Identify underlying root cause..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Corrective Action</label>
                <textarea
                  value={newCapa.correctiveAction}
                  onChange={e => setNewCapa({ ...newCapa, correctiveAction: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preventive Action</label>
                <textarea
                  value={newCapa.preventiveAction}
                  onChange={e => setNewCapa({ ...newCapa, preventiveAction: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowCapaModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleCreateCapa} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Create CAPA</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Generate Package */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Generate Accreditation Evidence Package</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Package Name</label>
                <input
                  type="text"
                  value={newPackage.name}
                  onChange={e => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowPackageModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
              <button onClick={handleGeneratePackage} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Generate Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
