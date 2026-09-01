import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { AccreditationReviewService } from '../../services/accreditationReviewService';
import {
  AccreditationBody,
  AccreditationCriterion,
  AccreditationCycle,
  AccreditationSubmission,
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
  FindingSeverity
} from '../../types/accreditationReview';
import {
  ShieldCheck,
  Award,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  Users,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  Lock,
  Building,
  Calendar,
  Eye,
  Check,
  X,
  AlertCircle,
  FileSpreadsheet,
  Send,
  BookOpen
} from 'lucide-react';

export function AccreditationReviewWorkspace() {
  const { currentUser, activeRoleAssignment } = useAuth();
  const { currentTenant, campuses } = useTenant();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'cycles'
    | 'criteria'
    | 'submissions'
    | 'evidence'
    | 'verification'
    | 'external_reviews'
    | 'findings'
    | 'commitments'
    | 'inspections'
    | 'correspondence'
    | 'decisions'
    | 'certificates'
    | 'analytics'
    | 'audit'
  >('overview');

  const [selectedCampusId, setSelectedCampusId] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // State collections from Firestore
  const [analytics, setAnalytics] = useState<AccreditationAnalytics | null>(null);
  const [bodies, setBodies] = useState<AccreditationBody[]>([]);
  const [criteria, setCriteria] = useState<AccreditationCriterion[]>([]);
  const [cycles, setCycles] = useState<AccreditationCycle[]>([]);
  const [submissions, setSubmissions] = useState<AccreditationSubmission[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceMapping[]>([]);
  const [reviews, setReviews] = useState<ReviewVisit[]>([]);
  const [findings, setFindings] = useState<ReviewFinding[]>([]);
  const [commitments, setCommitments] = useState<InstitutionalCommitment[]>([]);
  const [inspections, setInspections] = useState<RegulatoryInspection[]>([]);
  const [correspondenceList, setCorrespondenceList] = useState<AccreditationCorrespondence[]>([]);
  const [decisions, setDecisions] = useState<AccreditationDecision[]>([]);
  const [certificates, setCertificates] = useState<AccreditationCertificate[]>([]);

  // User roles
  const userRoles = activeRoleAssignment ? [activeRoleAssignment.roleCode] : (currentUser?.isPlatformSuperAdmin ? ['super_admin'] : ['staff']);
  const actorId = currentUser?.uid || 'user_anon';

  // Modal / Form state toggles
  const [showCreateCycleModal, setShowCreateCycleModal] = useState(false);
  const [showCreateCriteriaModal, setShowCreateCriteriaModal] = useState(false);
  const [showCreateSubmissionModal, setShowCreateSubmissionModal] = useState(false);
  const [showMapEvidenceModal, setShowMapEvidenceModal] = useState(false);
  const [showCreateFindingModal, setShowCreateFindingModal] = useState(false);
  const [showCreateCommitmentModal, setShowCreateCommitmentModal] = useState(false);
  const [showCreateInspectionModal, setShowCreateInspectionModal] = useState(false);
  const [showCreateCorrespondenceModal, setShowCreateCorrespondenceModal] = useState(false);
  const [showRecordDecisionModal, setShowRecordDecisionModal] = useState(false);
  const [showRegisterCertModal, setShowRegisterCertModal] = useState(false);

  // Form Fields
  const [cycleForm, setCycleForm] = useState({ title: '', bodyId: 'NAAC', targetSubmissionDate: '', leadCoordinator: '' });
  const [criteriaForm, setCriteriaForm] = useState({ code: '', title: '', category: 'Curricular Aspects', weight: 100, maxScore: 100, isMandatory: true, description: '' });
  const [submissionForm, setSubmissionForm] = useState({ cycleId: '', title: '', code: '' });
  const [evidenceForm, setEvidenceForm] = useState({ criterionId: '', docRegistryId: '', docTitle: '', docCategory: 'Policy', narrative: '', evidenceType: 'POLICY' as const });
  const [findingForm, setFindingForm] = useState({ title: '', code: '', description: '', severity: 'HIGH' as FindingSeverity, ownerUserId: '', dueDate: '' });
  const [commitmentForm, setCommitmentForm] = useState({ title: '', sourceType: 'ACCREDITATION_RECOMMENDATION' as const, description: '', ownerUserId: '', dueDate: '' });
  const [inspectionForm, setInspectionForm] = useState({ body: 'AICTE', type: 'ROUTINE' as const, scheduledDate: '', scope: '', teamLead: '' });
  const [correspondenceForm, setCorrespondenceForm] = useState({ direction: 'INBOUND' as const, senderRef: '', recipientRef: '', subject: '', refNum: '', date: '', docRegistryId: '', summary: '' });
  const [decisionForm, setDecisionForm] = useState({ cycleId: '', bodyId: '', type: 'ACCREDITED' as const, grade: '', effectiveDate: '', expiryDate: '', refNum: '', authorizedBy: '' });
  const [certForm, setCertForm] = useState({ bodyId: '', cycleId: '', certNum: '', issueDate: '', expiryDate: '', gradeStatus: '', scope: '', docRegistryId: '' });

  // Remediation & Closure inputs
  const [closeFindingId, setCloseFindingId] = useState<string | null>(null);
  const [closeFindingEvidenceDocId, setCloseFindingEvidenceDocId] = useState('');
  const [closeFindingNotes, setCloseFindingNotes] = useState('');

  // Load All Authoritative Data
  const loadData = async () => {
    if (!currentTenant?.id) return;
    setLoading(true);
    setError(null);
    try {
      const tenantId = currentTenant.id;
      const [
        bData,
        crData,
        cyData,
        subData,
        evData,
        revData,
        fData,
        comData,
        inspData,
        corrData,
        decData,
        certData,
        analyticsRes
      ] = await Promise.all([
        AccreditationReviewService.getAccreditationBodies(tenantId),
        AccreditationReviewService.getCriteria(tenantId),
        AccreditationReviewService.getCycles(tenantId, selectedCampusId),
        AccreditationReviewService.getSubmissions(tenantId),
        AccreditationReviewService.getEvidenceMappings(tenantId),
        AccreditationReviewService.getReviewVisits(tenantId),
        AccreditationReviewService.getFindings(tenantId),
        AccreditationReviewService.getCommitments(tenantId),
        AccreditationReviewService.getInspections(tenantId),
        AccreditationReviewService.getCorrespondence(tenantId),
        AccreditationReviewService.getDecisions(tenantId),
        AccreditationReviewService.getCertificates(tenantId),
        AccreditationReviewService.computeAnalytics(tenantId, selectedCampusId)
      ]);

      setBodies(bData);
      setCriteria(crData);
      setCycles(cyData);
      setSubmissions(subData);
      setEvidenceList(evData);
      setReviews(revData);
      setFindings(fData);
      setCommitments(comData);
      setInspections(inspData);
      setCorrespondenceList(corrData);
      setDecisions(decData);
      setCertificates(certData);
      setAnalytics(analyticsRes);
    } catch (err: any) {
      console.error('Error loading accreditation review data:', err);
      setError(err.message || 'Failed to load accreditation review data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant?.id, selectedCampusId]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // 1. Create Cycle Action
  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.createCycle(currentTenant.id, actorId, {
        title: cycleForm.title,
        accreditationBodyId: cycleForm.bodyId,
        frameworkCode: cycleForm.bodyId,
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined,
        startDate: new Date().toISOString().split('T')[0],
        targetSubmissionDate: cycleForm.targetSubmissionDate,
        leadCoordinatorUserId: cycleForm.leadCoordinator || actorId,
        selfStudyAuthorUserId: actorId
      });
      setShowCreateCycleModal(false);
      showNotification('Accreditation Cycle created in DRAFT state.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 2. Cycle Status Transition Action
  const handleCycleStatusUpdate = async (cycleId: string, targetStatus: AccreditationCycleStatus) => {
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.updateCycleStatus(currentTenant.id, actorId, cycleId, targetStatus, 'User initiated transition', currentUser?.isPlatformSuperAdmin);
      showNotification(`Cycle status updated to ${targetStatus}`);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 3. Create Submission Action
  const handleCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.createSubmission(currentTenant.id, actorId, {
        cycleId: submissionForm.cycleId,
        title: submissionForm.title,
        submissionCode: submissionForm.code,
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined
      });
      setShowCreateSubmissionModal(false);
      showNotification('Self-Study Submission workspace initialized.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 4. Internal Approve Submission (SoD Enforced)
  const handleApproveSubmission = async (submissionId: string) => {
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.approveSubmissionInternal(currentTenant.id, actorId, submissionId, userRoles);
      showNotification('Submission internally approved and version locked.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 5. Map Evidence Action
  const handleMapEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.mapEvidence(currentTenant.id, actorId, {
        criterionId: evidenceForm.criterionId,
        criterionCode: evidenceForm.criterionId,
        documentRegistryId: evidenceForm.docRegistryId,
        documentTitle: evidenceForm.docTitle,
        documentCategory: evidenceForm.docCategory,
        relevanceNarrative: evidenceForm.narrative,
        evidenceType: evidenceForm.evidenceType,
        validFrom: new Date().toISOString().split('T')[0],
        isMandatory: true,
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined
      });
      setShowMapEvidenceModal(false);
      showNotification('Evidence mapped from Document Registry.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 6. Verify Evidence Action (SoD Enforced)
  const handleVerifyEvidence = async (evidenceId: string, isApproved: boolean) => {
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.verifyEvidence(currentTenant.id, actorId, evidenceId, isApproved, userRoles);
      showNotification(`Evidence ${isApproved ? 'verified' : 'rejected'} successfully.`);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 7. Create Finding Action
  const handleCreateFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.createFinding(currentTenant.id, actorId, {
        findingCode: findingForm.code,
        title: findingForm.title,
        description: findingForm.description,
        severity: findingForm.severity,
        responsibleOwnerUserId: findingForm.ownerUserId || actorId,
        dueDate: findingForm.dueDate,
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined
      });
      setShowCreateFindingModal(false);
      showNotification('Review finding recorded with calculated priority.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 8. Close Finding Action (SoD Enforced)
  const handleCloseFinding = async (findingId: string) => {
    if (!currentTenant?.id) return;
    if (!closeFindingEvidenceDocId) {
      setError('Please provide a valid Document Registry ID for remediation evidence.');
      return;
    }
    try {
      await AccreditationReviewService.closeFinding(currentTenant.id, actorId, findingId, closeFindingEvidenceDocId, closeFindingNotes, userRoles);
      setCloseFindingId(null);
      setCloseFindingEvidenceDocId('');
      setCloseFindingNotes('');
      showNotification('Finding remediated, verified, and closed.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 9. Record Decision Action (SoD Enforced)
  const handleRecordDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.recordDecision(currentTenant.id, actorId, {
        cycleId: decisionForm.cycleId,
        accreditationBodyId: decisionForm.bodyId,
        decisionType: decisionForm.type,
        officialGradeOrCGPA: decisionForm.grade,
        effectiveDate: decisionForm.effectiveDate,
        expiryDate: decisionForm.expiryDate,
        decisionReferenceNumber: decisionForm.refNum,
        authorizedBy: decisionForm.authorizedBy,
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined
      });
      setShowRecordDecisionModal(false);
      showNotification('Authoritative external accreditation decision recorded.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 10. Register Certificate Action
  const handleRegisterCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id) return;
    try {
      await AccreditationReviewService.registerCertificate(currentTenant.id, actorId, {
        accreditationBodyId: certForm.bodyId,
        accreditationCycleId: certForm.cycleId,
        certificateNumber: certForm.certNum,
        issueDate: certForm.issueDate,
        expiryDate: certForm.expiryDate,
        gradeStatus: certForm.gradeStatus,
        accreditationScope: certForm.scope,
        documentRegistryId: certForm.docRegistryId,
        status: 'ACTIVE',
        campusId: selectedCampusId !== 'all' ? selectedCampusId : undefined
      });
      setShowRegisterCertModal(false);
      showNotification('Accreditation certificate registered.');
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Accreditation & Regulatory Governance Engine
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Phase 7.35
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Governed cycles, self-study submissions, Document Registry evidence verification, peer reviews, inspections, and certificate horizons.
              </p>
            </div>
          </div>
        </div>

        {/* Controls Header */}
        <div className="flex items-center gap-3">
          {/* Multi-campus selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700 text-xs">
            <Building className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="bg-transparent text-slate-200 outline-none font-medium cursor-pointer"
            >
              <option value="all" className="bg-slate-800">All Campuses</option>
              {campuses.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-800">{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs (15 Tabs) */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Command Center', icon: ShieldCheck },
          { id: 'cycles', label: 'Accreditation Cycles', icon: Clock },
          { id: 'criteria', label: 'Framework & Criteria', icon: BookOpen },
          { id: 'submissions', label: 'Self-Study Submissions', icon: FileText },
          { id: 'evidence', label: 'Evidence Mapping', icon: Layers },
          { id: 'verification', label: 'Internal Verification', icon: CheckCircle2 },
          { id: 'external_reviews', label: 'External Reviews', icon: Users },
          { id: 'findings', label: 'Findings & Remediations', icon: AlertTriangle },
          { id: 'commitments', label: 'Institutional Commitments', icon: FileCheck },
          { id: 'inspections', label: 'Regulatory Inspections', icon: Award },
          { id: 'correspondence', label: 'Correspondence', icon: Send },
          { id: 'decisions', label: 'Accreditation Decisions', icon: Lock },
          { id: 'certificates', label: 'Certificates & Validity', icon: Award },
          { id: 'analytics', label: 'Analytics & Risk', icon: FileSpreadsheet },
          { id: 'audit', label: 'Governance Audit', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE COMMAND CENTER */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Active Cycles</span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">
                {analytics?.activeCyclesCount || 0}
              </div>
              <p className="text-xs text-slate-400">Governance cycles in motion</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Evidence Completeness</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {analytics?.evidenceCompletenessPercentage || 0}%
              </div>
              <p className="text-xs text-slate-400">Verified document registry mappings</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Verification Backlog</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {analytics?.evidenceVerificationBacklogCount || 0}
              </div>
              <p className="text-xs text-slate-400">Items pending four-eyes verification</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Readiness Score</span>
                <Award className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-sky-400">
                  {analytics?.overallReviewReadinessScore || 0}%
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                  analytics?.accreditationRiskIndicator === 'LOW' ? 'bg-emerald-500/20 text-emerald-400' :
                  analytics?.accreditationRiskIndicator === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-rose-500/20 text-rose-400'
                }`}>
                  {analytics?.accreditationRiskIndicator || 'LOW'} RISK
                </span>
              </div>
              <p className="text-xs text-slate-400">Deterministic readiness index</p>
            </div>
          </div>

          {/* Quick Action Cards & Live Status Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4 col-span-2">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  Active Accreditation Cycles
                </h3>
                <button
                  onClick={() => setShowCreateCycleModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" /> New Cycle
                </button>
              </div>

              {cycles.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm border border-dashed border-slate-700/80 rounded-xl">
                  No accreditation cycles configured. Create a new cycle to initiate self-study governance.
                </div>
              ) : (
                <div className="space-y-3">
                  {cycles.map(c => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{c.title}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                          <span>Framework: <strong className="text-slate-200">{c.frameworkCode}</strong></span>
                          <span>Target Submission: <strong className="text-slate-200">{c.targetSubmissionDate}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {c.status}
                        </span>
                        <button
                          onClick={() => setActiveTab('cycles')}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Manage →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificate Horizon Card */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
              <h3 className="font-semibold text-white text-base flex items-center gap-2 border-b border-slate-700/60 pb-3">
                <Award className="w-5 h-5 text-emerald-400" />
                Certificate Horizons
              </h3>

              {certificates.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-700/80 rounded-xl">
                  No accreditation certificates registered.
                </div>
              ) : (
                <div className="space-y-3">
                  {certificates.map(cert => (
                    <div key={cert.id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{cert.certificateNumber}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          cert.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {cert.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">Scope: {cert.accreditationScope}</div>
                      <div className="text-[11px] text-slate-400">Expires: <strong className="text-slate-200">{cert.expiryDate}</strong></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACCREDITATION CYCLES */}
      {/* ========================================================================= */}
      {activeTab === 'cycles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Accreditation Cycle Management</h2>
            <button
              onClick={() => setShowCreateCycleModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create Accreditation Cycle
            </button>
          </div>

          {cycles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No accreditation cycles configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cycles.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div>
                      <h3 className="font-semibold text-white text-base">{c.title}</h3>
                      <p className="text-xs text-slate-400">Framework: {c.frameworkCode}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                      {c.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>Start Date: <strong className="text-slate-200">{c.startDate}</strong></div>
                    <div>Target Submission: <strong className="text-slate-200">{c.targetSubmissionDate}</strong></div>
                    <div>Lead Coordinator: <strong className="text-slate-200">{c.leadCoordinatorUserId}</strong></div>
                    <div>Self-Study Author: <strong className="text-slate-200">{c.selfStudyAuthorUserId}</strong></div>
                  </div>

                  {/* Cycle State Machine Transition Controls */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium">Transition State:</span>
                    {c.status === 'DRAFT' && (
                      <button
                        onClick={() => handleCycleStatusUpdate(c.id, 'PLANNED')}
                        className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs"
                      >
                        Set PLANNED
                      </button>
                    )}
                    {c.status === 'PLANNED' && (
                      <button
                        onClick={() => handleCycleStatusUpdate(c.id, 'SELF_STUDY')}
                        className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs"
                      >
                        Start SELF_STUDY
                      </button>
                    )}
                    {c.status === 'SELF_STUDY' && (
                      <button
                        onClick={() => handleCycleStatusUpdate(c.id, 'SUBMITTED')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        Mark SUBMITTED
                      </button>
                    )}
                    {c.status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleCycleStatusUpdate(c.id, 'UNDER_REVIEW')}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs"
                      >
                        Start UNDER_REVIEW
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SELF-STUDY SUBMISSIONS */}
      {/* ========================================================================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Self-Study Submission Workspace</h2>
            <button
              onClick={() => setShowCreateSubmissionModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create Submission Workspace
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No submissions found.
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{sub.title}</h3>
                      <p className="text-xs text-slate-400">Submission Code: <strong className="text-slate-200">{sub.submissionCode}</strong> | Version: v{sub.currentVersion}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {sub.status}
                    </span>
                  </div>

                  {/* Versions Table */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-300">Version History (Immutable Locked Versions)</h4>
                    <div className="space-y-1.5">
                      {sub.versions.map(v => (
                        <div key={v.versionNumber} className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white">Version v{v.versionNumber}</span> - {v.title}
                            <div className="text-[11px] text-slate-400">Compiled by: {v.compiledBy} on {v.compiledAt}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {v.isLocked && <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold"><Lock className="w-3 h-3" /> Locked</span>}
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              v.approvalStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {v.approvalStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {sub.status === 'DRAFT' && (
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleApproveSubmission(sub.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Internal (SoD Enforced)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EVIDENCE MAPPING */}
      {/* ========================================================================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Document Registry Evidence Mapping (Phase 7.27 Integrated)</h2>
            <button
              onClick={() => setShowMapEvidenceModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Map Evidence Document
            </button>
          </div>

          {evidenceList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No evidence mappings found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidenceList.map(item => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.documentTitle}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">Doc Registry ID: <strong className="text-slate-200">{item.documentRegistryId}</strong></div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      item.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.verificationStatus === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                    {item.relevanceNarrative}
                  </p>

                  {/* Defect Flags */}
                  {item.defectFlags && item.defectFlags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">Defects:</span>
                      {item.defectFlags.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/60 pt-2">
                    <span>Mapped by: {item.mappedBy}</span>
                    <span>Mapped at: {item.mappedAt.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INTERNAL VERIFICATION */}
      {/* ========================================================================= */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">4-Eyes Internal Verification Queue</h2>

          {evidenceList.filter(e => e.verificationStatus === 'PENDING').length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No evidence items pending verification.
            </div>
          ) : (
            <div className="space-y-4">
              {evidenceList.filter(e => e.verificationStatus === 'PENDING').map(item => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{item.documentTitle}</h3>
                    <p className="text-xs text-slate-400">Doc Registry Ref: {item.documentRegistryId} | Mapped by: {item.mappedBy}</p>
                    <p className="text-xs text-slate-300 mt-1">{item.relevanceNarrative}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyEvidence(item.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleVerifyEvidence(item.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: FINDINGS & RECOMMENDATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'findings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Review & Inspection Findings</h2>
            <button
              onClick={() => setShowCreateFindingModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Record Review Finding
            </button>
          </div>

          {findings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No open accreditation findings.
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map(f => (
                <div key={f.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{f.title}</span>
                        <span className="text-xs text-slate-400">({f.findingCode})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{f.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        f.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        f.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}>
                        {f.severity}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 font-medium">
                        {f.status}
                      </span>
                    </div>
                  </div>

                  {f.status !== 'CLOSED' && (
                    <div className="pt-2 border-t border-slate-700/60">
                      {closeFindingId === f.id ? (
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-3">
                          <h4 className="text-xs font-bold text-white">Remediate & Close Finding (SoD Enforced)</h4>
                          <input
                            type="text"
                            placeholder="Document Registry ID (Phase 7.27)"
                            value={closeFindingEvidenceDocId}
                            onChange={(e) => setCloseFindingEvidenceDocId(e.target.value)}
                            className="w-full bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 outline-none"
                          />
                          <textarea
                            placeholder="Closure verification notes..."
                            value={closeFindingNotes}
                            onChange={(e) => setCloseFindingNotes(e.target.value)}
                            className="w-full bg-slate-800 text-white text-xs p-3 rounded-lg border border-slate-700 outline-none h-16"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCloseFinding(f.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                            >
                              Confirm Closure
                            </button>
                            <button
                              onClick={() => setCloseFindingId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCloseFindingId(f.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium"
                        >
                          Close Finding...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: INSTITUTIONAL COMMITMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'commitments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Institutional Commitment Tracker</h2>
            <button
              onClick={() => setShowCreateCommitmentModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create Commitment
            </button>
          </div>

          {commitments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No institutional commitments found.
            </div>
          ) : (
            <div className="space-y-3">
              {commitments.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{c.commitmentTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                    <div className="text-[11px] text-slate-400 mt-1">Target Date: <strong className="text-slate-200">{c.targetCompletionDate}</strong></div>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.isOverdue && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                        OVERDUE
                      </span>
                    )}
                    <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 10: REGULATORY INSPECTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'inspections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Regulatory Inspections Workspace</h2>
            <button
              onClick={() => setShowCreateInspectionModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Schedule Inspection
            </button>
          </div>

          {inspections.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No regulatory inspections found.
            </div>
          ) : (
            <div className="space-y-4">
              {inspections.map(i => (
                <div key={i.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{i.regulatoryBody} ({i.inspectionType})</h3>
                      <p className="text-xs text-slate-400">Scheduled Date: {i.scheduledDate} | Scope: {i.inspectionScope}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30">
                      {i.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 12: ACCREDITATION DECISIONS */}
      {/* ========================================================================= */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Authoritative External Accreditation Decisions</h2>
            <button
              onClick={() => setShowRecordDecisionModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Record Decision Outcome
            </button>
          </div>

          {decisions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No accreditation decisions recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {decisions.map(d => (
                <div key={d.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{d.decisionType} - Grade: {d.officialGradeOrCGPA || 'N/A'}</h3>
                    <p className="text-xs text-slate-400">Ref: {d.decisionReferenceNumber} | Authorized By: {d.authorizedBy}</p>
                    <div className="text-[11px] text-slate-400 mt-1">Effective: {d.effectiveDate} to {d.expiryDate}</div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    IMMUTABLE DECISION
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 13: CERTIFICATES & VALIDITY */}
      {/* ========================================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Accreditation Certificates & Validity Horizons</h2>
            <button
              onClick={() => setShowRegisterCertModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Register Certificate
            </button>
          </div>

          {certificates.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
              No accreditation certificates registered.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{cert.certificateNumber}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      cert.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                      cert.status === 'EXPIRING_SOON' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {cert.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300">
                    <div>Scope: <strong className="text-slate-100">{cert.accreditationScope}</strong></div>
                    <div>Grade / Status: <strong className="text-slate-100">{cert.gradeStatus}</strong></div>
                    <div>Doc Registry Ref: <strong className="text-slate-100">{cert.documentRegistryId}</strong></div>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-between">
                    <span>Issued: {cert.issueDate}</span>
                    <span>Expires: {cert.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALS FOR RECORD CREATION */}
      {/* 1. Create Cycle Modal */}
      {showCreateCycleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-slate-100">
            <h3 className="font-bold text-lg text-white">Create Accreditation Cycle</h3>
            <form onSubmit={handleCreateCycle} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Cycle Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NAAC Cycle 3 Self-Study"
                  value={cycleForm.title}
                  onChange={e => setCycleForm({ ...cycleForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Accreditation Body Code</label>
                <select
                  value={cycleForm.bodyId}
                  onChange={e => setCycleForm({ ...cycleForm, bodyId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                >
                  <option value="NAAC">NAAC</option>
                  <option value="NBA">NBA</option>
                  <option value="NIRF">NIRF</option>
                  <option value="ISO_21001">ISO 21001</option>
                  <option value="UGC">UGC</option>
                  <option value="AICTE">AICTE</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Target Submission Date</label>
                <input
                  type="date"
                  required
                  value={cycleForm.targetSubmissionDate}
                  onChange={e => setCycleForm({ ...cycleForm, targetSubmissionDate: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateCycleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500"
                >
                  Create Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Submission Modal */}
      {showCreateSubmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-slate-100">
            <h3 className="font-bold text-lg text-white">Create Submission Workspace</h3>
            <form onSubmit={handleCreateSubmission} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Target Cycle</label>
                <select
                  required
                  value={submissionForm.cycleId}
                  onChange={e => setSubmissionForm({ ...submissionForm, cycleId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                >
                  <option value="">Select Cycle...</option>
                  {cycles.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Submission Title</label>
                <input
                  type="text"
                  required
                  placeholder="Institutional Self-Study Report (SSR)"
                  value={submissionForm.title}
                  onChange={e => setSubmissionForm({ ...submissionForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Submission Code</label>
                <input
                  type="text"
                  required
                  placeholder="SSR-2026-001"
                  value={submissionForm.code}
                  onChange={e => setSubmissionForm({ ...submissionForm, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateSubmissionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500"
                >
                  Initialize Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Map Evidence Modal */}
      {showMapEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-slate-100">
            <h3 className="font-bold text-lg text-white">Map Document Registry Evidence</h3>
            <form onSubmit={handleMapEvidence} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Criterion ID / Code</label>
                <input
                  type="text"
                  required
                  placeholder="C1.1"
                  value={evidenceForm.criterionId}
                  onChange={e => setEvidenceForm({ ...evidenceForm, criterionId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Document Registry ID (Phase 7.27 Authoritative)</label>
                <input
                  type="text"
                  required
                  placeholder="DOC-REG-8849"
                  value={evidenceForm.docRegistryId}
                  onChange={e => setEvidenceForm({ ...evidenceForm, docRegistryId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="Curriculum Review Minutes & Academic Council Ordinance"
                  value={evidenceForm.docTitle}
                  onChange={e => setEvidenceForm({ ...evidenceForm, docTitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Relevance Narrative</label>
                <textarea
                  required
                  placeholder="Explains how this document satisfies criterion evidence requirements..."
                  value={evidenceForm.narrative}
                  onChange={e => setEvidenceForm({ ...evidenceForm, narrative: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none h-20 mt-1"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowMapEvidenceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500"
                >
                  Map Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
