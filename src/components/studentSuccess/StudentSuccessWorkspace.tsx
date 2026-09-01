import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  Activity,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Lock,
  FileText,
  Users,
  Award,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  BarChart3,
  Layers,
  Sparkles,
  Zap,
  CheckSquare,
  AlertOctagon
} from 'lucide-react';
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
  InterventionType,
  InterventionStatus,
  RetentionStatus,
  ProgressionStatus
} from '../../types/studentSuccess';
import { StudentSuccessService } from '../../services/studentSuccessService';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { FirebaseService } from '../../services/firebaseService';
import { AuditService } from '../../services/auditService';
import { AuditRecord } from '../../types';

type TabType =
  | 'overview'
  | 'profiles_risk'
  | 'early_warning'
  | 'interventions'
  | 'retention'
  | 'progression'
  | 'reviews_audit';

export const StudentSuccessWorkspace: React.FC = () => {
  const { currentTenant, currentCampus } = useTenant();
  const { currentUser } = useAuth();

  const tenantId = currentTenant?.id || 'tenant_default';
  const campusId = currentCampus?.id || 'campus_main';
  const actorId = currentUser?.id || 'usr_admin';
  const actorName = currentUser?.displayName || currentUser?.email || 'Governance Admin';

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data State
  const [analytics, setAnalytics] = useState<SuccessAnalytics | null>(null);
  const [profiles, setProfiles] = useState<StudentSuccessProfile[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<StudentRiskAssessment[]>([]);
  const [warningSignals, setWarningSignals] = useState<EarlyWarningSignal[]>([]);
  const [interventions, setInterventions] = useState<StudentIntervention[]>([]);
  const [retentionCases, setRetentionCases] = useState<RetentionCase[]>([]);
  const [progressionAssessments, setProgressionAssessments] = useState<ProgressionAssessment[]>([]);
  const [reviews, setReviews] = useState<StudentSuccessReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showRiskModal, setShowRiskModal] = useState<boolean>(false);
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showInterventionModal, setShowInterventionModal] = useState<boolean>(false);
  const [showVerifyInterventionModal, setShowVerifyInterventionModal] = useState<boolean>(false);
  const [showRetentionModal, setShowRetentionModal] = useState<boolean>(false);
  const [showApproveRetentionModal, setShowApproveRetentionModal] = useState<boolean>(false);
  const [showProgressionModal, setShowProgressionModal] = useState<boolean>(false);
  const [showApproveProgressionModal, setShowApproveProgressionModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Selected Item for Actions
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [selectedInterventionId, setSelectedInterventionId] = useState<string>('');
  const [selectedRetentionCaseId, setSelectedRetentionCaseId] = useState<string>('');
  const [selectedProgressionId, setSelectedProgressionId] = useState<string>('');

  // Form Inputs
  const [profileForm, setProfileForm] = useState({
    studentId: '',
    studentName: '',
    admissionNumber: '',
    academicYearId: 'AY-2025-2026',
    classId: 'class_10',
    className: 'Grade 10',
    sectionId: 'sec_a',
    sectionName: 'Section A'
  });

  const [riskForm, setRiskForm] = useState({
    studentId: '',
    studentName: '',
    academicYearId: 'AY-2025-2026',
    assessmentPeriod: 'Term 1',
    attendanceRisk: 15,
    academicRisk: 20,
    engagementRisk: 10,
    financialRisk: 0,
    behavioralRisk: 5,
    supportRisk: 0
  });

  const [overrideForm, setOverrideForm] = useState({
    overrideRiskLevel: 'HIGH' as RiskLevel,
    overrideReason: ''
  });

  const [warningForm, setWarningForm] = useState({
    studentId: '',
    studentName: '',
    signalType: 'ATTENDANCE_DROP' as SignalType,
    severity: 'HIGH' as SignalSeverity,
    sourceModule: 'Attendance Engine',
    sourceRecordId: 'att_session_101',
    evidence: 'Consecutive 5 days unexcused absence detected.'
  });

  const [interventionForm, setInterventionForm] = useState({
    studentId: '',
    studentName: '',
    interventionType: 'ACADEMIC_TUTORING' as InterventionType,
    priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    assignedTo: 'usr_advisor_1',
    assignedToName: 'Dr. Sarah Jenkins (Academic Advisor)',
    referralSource: 'Early Warning Engine',
    actionPlan: 'Weekly 1-on-1 tutoring sessions for Mathematics and Physics.',
    dueDate: '2026-09-30'
  });

  const [verifyInterventionForm, setVerifyInterventionForm] = useState({
    outcome: 'Student attended 4 tutoring sessions. Math score improved from 42% to 68%.'
  });

  const [retentionForm, setRetentionForm] = useState({
    studentId: '',
    studentName: '',
    academicYearId: 'AY-2025-2026',
    retentionRisk: 'HIGH' as RiskLevel,
    caseOwnerId: 'usr_counselor_1',
    caseOwnerName: 'Elena Rostova (Lead Counselor)',
    reasons: ['Prolonged Illness', 'Academic Lag'],
    reviewDate: '2026-10-15'
  });

  const [approveRetentionForm, setApproveRetentionForm] = useState({
    newStatus: 'RETAINED_WITH_SUPPORT' as RetentionStatus,
    outcome: 'Approved custom support track and reduced course workload.'
  });

  const [progressionForm, setProgressionForm] = useState({
    studentId: '',
    studentName: '',
    academicYearId: 'AY-2025-2026',
    currentClassId: 'class_10',
    currentClassName: 'Grade 10',
    nextClassId: 'class_11',
    nextClassName: 'Grade 11',
    earnedCredits: 30,
    failedSubjectsCount: 0,
    failedSubjectNames: [],
    attendanceEligibilityPercentage: 92,
    notes: 'Meets all credit and attendance requirements.'
  });

  const [approveProgressionForm, setApproveProgressionForm] = useState({
    decisionReference: 'BOARD-RES-2026-PROGRESSION-042'
  });

  const [reviewForm, setReviewForm] = useState({
    studentId: '',
    studentName: '',
    reviewPeriod: 'Q1 2026',
    findings: 'Student demonstrated positive response to academic mentoring.',
    recommendations: 'Continue monthly check-in sessions.',
    decision: 'Maintain Standard Academic Standing'
  });

  // Load All Data
  const fetchWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        analyticsData,
        pData,
        raData,
        wsData,
        iData,
        rcData,
        paData,
        revData,
        audData
      ] = await Promise.all([
        StudentSuccessService.getSuccessAnalytics(tenantId),
        FirebaseService.getTenantCollection<StudentSuccessProfile>('student_success_profiles', tenantId),
        FirebaseService.getTenantCollection<StudentRiskAssessment>('student_risk_assessments', tenantId),
        FirebaseService.getTenantCollection<EarlyWarningSignal>('student_success_early_warning_signals', tenantId),
        FirebaseService.getTenantCollection<StudentIntervention>('student_success_interventions', tenantId),
        FirebaseService.getTenantCollection<RetentionCase>('student_success_retention_cases', tenantId),
        FirebaseService.getTenantCollection<ProgressionAssessment>('student_success_progression_assessments', tenantId),
        FirebaseService.getTenantCollection<StudentSuccessReview>('student_success_reviews', tenantId),
        AuditService.getAuditLogs({ tenantId, limit: 50 })
      ]);

      setAnalytics(analyticsData);
      setProfiles(pData);
      setRiskAssessments(raData);
      setWarningSignals(wsData);
      setInterventions(iData);
      setRetentionCases(rcData);
      setProgressionAssessments(paData);
      setReviews(revData);
      setAuditLogs(audData.filter(a => a.action?.startsWith('STUDENT_') || a.action?.startsWith('EARLY_') || a.action?.startsWith('INTERVENTION_') || a.action?.startsWith('RETENTION_') || a.action?.startsWith('PROGRESSION_')));
    } catch (err: any) {
      console.error('Error loading Student Success data:', err);
      setError(err?.message || 'Failed to load Student Success data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [tenantId]);

  // Actions
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.createSuccessProfile(
        { tenantId, campusId, ...profileForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Student Success Profile created successfully.');
      setShowProfileModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile.');
    }
  };

  const handleCalculateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.calculateRisk(
        { tenantId, campusId, ...riskForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Deterministic risk calculated server-side.');
      setShowRiskModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to calculate risk.');
    }
  };

  const handleOverrideRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.overrideRisk(
        selectedAssessmentId,
        overrideForm.overrideRiskLevel,
        overrideForm.overrideReason,
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Manual risk score override recorded with audit justification.');
      setShowOverrideModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to override risk score.');
    }
  };

  const handleCreateWarningSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.createEarlyWarningSignal(
        { tenantId, campusId, ...warningForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Early Warning Signal logged.');
      setShowWarningModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to log warning signal.');
    }
  };

  const handleAcknowledgeWarning = async (id: string, newStatus: 'ACKNOWLEDGED' | 'ACTIONED' | 'RESOLVED') => {
    try {
      await StudentSuccessService.acknowledgeWarning(
        id,
        newStatus,
        'Actioned via governance dashboard.',
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage(`Warning signal status updated to ${newStatus}.`);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to update warning signal.');
    }
  };

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.createIntervention(
        { tenantId, campusId, ...interventionForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Student Intervention proposed.');
      setShowInterventionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to create intervention.');
    }
  };

  const handleVerifyIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.verifyIntervention(
        selectedInterventionId,
        verifyInterventionForm.outcome,
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Intervention outcome verified (Four-Eyes SoD certified).');
      setShowVerifyInterventionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to verify intervention.');
    }
  };

  const handleCloseIntervention = async (id: string) => {
    try {
      await StudentSuccessService.closeIntervention(id, actorId, actorName, tenantId);
      setSuccessMessage('Intervention case formally closed.');
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to close intervention.');
    }
  };

  const handleCreateRetentionCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.createRetentionCase(
        { tenantId, campusId, ...retentionForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Student Retention Monitoring Case initiated.');
      setShowRetentionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to create retention case.');
    }
  };

  const handleApproveRetention = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.approveRetentionDecision(
        selectedRetentionCaseId,
        approveRetentionForm.newStatus,
        approveRetentionForm.outcome,
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Retention Decision authoritatively approved.');
      setShowApproveRetentionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to approve retention decision.');
    }
  };

  const handleAssessProgression = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.assessProgression(
        { tenantId, campusId, ...progressionForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Academic Progression Assessment recorded.');
      setShowProgressionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to assess academic progression.');
    }
  };

  const handleApproveProgression = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.approveProgression(
        selectedProgressionId,
        approveProgressionForm.decisionReference,
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Academic Progression Decision authoritatively approved.');
      setShowApproveProgressionModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to approve progression decision.');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await StudentSuccessService.createSuccessReview(
        { tenantId, campusId, ...reviewForm },
        actorId,
        actorName,
        tenantId
      );
      setSuccessMessage('Student Success Review logged.');
      setShowReviewModal(false);
      fetchWorkspaceData();
    } catch (err: any) {
      setError(err?.message || 'Failed to log success review.');
    }
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      const matchSearch =
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.className.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRisk = riskFilter === 'ALL' || p.currentRiskLevel === riskFilter;
      return matchSearch && matchRisk;
    });
  }, [profiles, searchTerm, riskFilter]);

  const getRiskBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans text-slate-900">
      {/* Header Banner */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                EMS Phase 7.33
              </span>
              <span className="text-xs font-medium text-slate-500">
                Governance & Intelligence Layer
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Student Success, Retention & Progression Engine
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Governed early-warning indicator system, deterministic risk scoring, intervention workflows, retention case governance, and academic progression assessment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchWorkspaceData}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Success Profile
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">
              ×
            </button>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-6 border-b border-slate-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
              { id: 'profiles_risk', label: 'Profiles & Risk Engine', icon: ShieldAlert },
              { id: 'early_warning', label: 'Early Warning Signals', icon: AlertTriangle },
              { id: 'interventions', label: 'Interventions', icon: UserCheck },
              { id: 'retention', label: 'Retention Cases', icon: Activity },
              { id: 'progression', label: 'Academic Progression', icon: GraduationCap },
              { id: 'reviews_audit', label: 'Reviews & Audit Trail', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-slate-200">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Loading Student Success Governance Engine...</p>
          </div>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && analytics && (
            <div className="space-y-6">
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Cohort</span>
                    <Users className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{analytics.totalActiveStudents}</span>
                    <span className="text-xs font-medium text-slate-500">students monitored</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
                    <span>Active Profiles: {profiles.length}</span>
                    <span className="font-semibold text-blue-600">100% Tracked</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High / Critical Risk</span>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-red-600">
                      {analytics.highRiskCount + analytics.criticalRiskCount}
                    </span>
                    <span className="text-xs font-medium text-red-600">
                      ({analytics.criticalRiskCount} Critical)
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
                    <span>Total At-Risk: {analytics.studentsAtRiskCount}</span>
                    <span>Attendance Risk: {analytics.attendanceRiskCount}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Intervention Success Rate</span>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-emerald-600">
                      {analytics.interventionCompletionRatePercentage}%
                    </span>
                    <span className="text-xs font-medium text-slate-500">resolution rate</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
                    <span>Backlog: {analytics.interventionBacklogCount}</span>
                    <span>Total Cases: {interventions.length}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Progression Ready</span>
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {analytics.cohortProgressionRatePercentage}%
                    </span>
                    <span className="text-xs font-medium text-slate-500">eligible</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex justify-between">
                    <span>Eligible: {analytics.progressionReadyCount}</span>
                    <span>Blocked: {analytics.progressionBlockedCount}</span>
                  </div>
                </div>
              </div>

              {/* Early Warnings & Risk Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-slate-900">Active Early Warning Signals</h3>
                    <button
                      onClick={() => setActiveTab('early_warning')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View All ({warningSignals.length}) <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  {warningSignals.length === 0 ? (
                    <div className="text-center py-8 text-sm text-slate-500">
                      No active early warning signals detected across current cohort.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {warningSignals.slice(0, 5).map(signal => (
                        <div key={signal.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                signal.severity === 'CRITICAL'
                                  ? 'bg-red-500 ring-4 ring-red-100'
                                  : signal.severity === 'HIGH'
                                  ? 'bg-orange-500'
                                  : 'bg-yellow-500'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{signal.studentName}</p>
                              <p className="text-xs text-slate-500">
                                {signal.signalType.replace(/_/g, ' ')} • {signal.sourceModule}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">{signal.evidence.substring(0, 40)}...</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                signal.status === 'OPEN'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              {signal.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risk Distribution Heatmap Overview */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">Risk Level Distribution</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span>Critical Risk (&gt;= 75)</span>
                        <span className="font-bold text-red-600">{analytics.criticalRiskCount} students</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-red-600 rounded-full"
                          style={{
                            width: `${
                              analytics.totalActiveStudents > 0
                                ? (analytics.criticalRiskCount / analytics.totalActiveStudents) * 100
                                : 0
                            }%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span>High Risk (50 - 74)</span>
                        <span className="font-bold text-orange-600">{analytics.highRiskCount} students</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{
                            width: `${
                              analytics.totalActiveStudents > 0
                                ? (analytics.highRiskCount / analytics.totalActiveStudents) * 100
                                : 0
                            }%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span>Moderate Risk (25 - 49)</span>
                        <span className="font-bold text-yellow-600">
                          {analytics.studentsAtRiskCount - analytics.highRiskCount - analytics.criticalRiskCount} students
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{
                            width: `${
                              analytics.totalActiveStudents > 0
                                ? ((analytics.studentsAtRiskCount - analytics.highRiskCount - analytics.criticalRiskCount) /
                                    analytics.totalActiveStudents) *
                                  100
                                : 0
                            }%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span>Low Risk (&lt; 25)</span>
                        <span className="font-bold text-emerald-600">
                          {analytics.totalActiveStudents - analytics.studentsAtRiskCount} students
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${
                              analytics.totalActiveStudents > 0
                                ? ((analytics.totalActiveStudents - analytics.studentsAtRiskCount) /
                                    analytics.totalActiveStudents) *
                                  100
                                : 0
                            }%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-1">Deterministic Rule Engine</p>
                    <p>
                      Risk scores are derived server-side via weighted evaluation of attendance (30%), academics (30%), engagement (15%), financial (10%), behavioral (10%), and support (5%). No opaque black-box algorithms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILES & RISK ENGINE */}
          {activeTab === 'profiles_risk' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search student by name, admission #, or class..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <select
                    value={riskFilter}
                    onChange={e => setRiskFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="CRITICAL">Critical Risk</option>
                    <option value="HIGH">High Risk</option>
                    <option value="MODERATE">Moderate Risk</option>
                    <option value="LOW">Low Risk</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRiskModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    <Activity className="h-4 w-4 text-blue-600" />
                    Calculate Risk Score
                  </button>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    New Profile
                  </button>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student Info</th>
                      <th className="py-3.5 px-4">Class & Section</th>
                      <th className="py-3.5 px-4">Composite Risk</th>
                      <th className="py-3.5 px-4">Retention Status</th>
                      <th className="py-3.5 px-4">Progression Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No student success profiles found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map(profile => (
                        <tr key={profile.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{profile.studentName}</div>
                            <div className="text-xs text-slate-400">Adm #: {profile.admissionNumber}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>{profile.className}</div>
                            <div className="text-xs text-slate-400">{profile.sectionName}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRiskBadgeColor(
                                  profile.currentRiskLevel
                                )}`}
                              >
                                {profile.currentRiskLevel} ({profile.currentRiskScore})
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-medium text-slate-700">{profile.retentionStatus}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-medium text-slate-700">{profile.progressionStatus}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                const matchingRisk = riskAssessments.find(r => r.studentId === profile.studentId);
                                if (matchingRisk) {
                                  setSelectedAssessmentId(matchingRisk.id);
                                  setShowOverrideModal(true);
                                } else {
                                  setError('No calculated risk assessment found for override. Please calculate risk first.');
                                }
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Override Risk Score
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EARLY WARNING SIGNALS */}
          {activeTab === 'early_warning' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Early Warning Signal Governance</h3>
                  <p className="text-xs text-slate-500">System-derived and staff-reported warning signals across all EMS modules.</p>
                </div>
                <button
                  onClick={() => setShowWarningModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Log Warning Signal
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Signal Type</th>
                      <th className="py-3.5 px-4">Severity</th>
                      <th className="py-3.5 px-4">Source Module</th>
                      <th className="py-3.5 px-4">Evidence</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {warningSignals.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No early warning signals logged.
                        </td>
                      </tr>
                    ) : (
                      warningSignals.map(sig => (
                        <tr key={sig.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{sig.studentName}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800">{sig.signalType.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                sig.severity === 'CRITICAL'
                                  ? 'bg-red-100 text-red-700'
                                  : sig.severity === 'HIGH'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {sig.severity}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{sig.sourceModule}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">{sig.evidence}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-medium text-slate-700">{sig.status}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {sig.status === 'OPEN' && (
                              <button
                                onClick={() => handleAcknowledgeWarning(sig.id, 'ACKNOWLEDGED')}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                              >
                                Acknowledge
                              </button>
                            )}
                            {sig.status === 'ACKNOWLEDGED' && (
                              <button
                                onClick={() => handleAcknowledgeWarning(sig.id, 'RESOLVED')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INTERVENTIONS */}
          {activeTab === 'interventions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Student Support Interventions</h3>
                  <p className="text-xs text-slate-500">Governed intervention lifecycle with Four-Eyes verification (Creator cannot self-verify).</p>
                </div>
                <button
                  onClick={() => setShowInterventionModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Propose Intervention
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Intervention Type</th>
                      <th className="py-3.5 px-4">Assigned Advisor</th>
                      <th className="py-3.5 px-4">Action Plan</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {interventions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No intervention records found.
                        </td>
                      </tr>
                    ) : (
                      interventions.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{item.studentName}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">{item.interventionType.replace(/_/g, ' ')}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{item.assignedToName}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">{item.actionPlan}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                item.status === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'CLOSED'
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-3">
                            {item.status !== 'VERIFIED' && item.status !== 'CLOSED' && (
                              <button
                                onClick={() => {
                                  setSelectedInterventionId(item.id);
                                  setShowVerifyInterventionModal(true);
                                }}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                              >
                                Verify Outcome
                              </button>
                            )}
                            {item.status === 'VERIFIED' && (
                              <button
                                onClick={() => handleCloseIntervention(item.id)}
                                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                              >
                                Close Case
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: RETENTION CASES */}
          {activeTab === 'retention' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Student Retention Governance</h3>
                  <p className="text-xs text-slate-500">Case management for students at risk of dropout or academic exit. (Owner cannot self-approve decision).</p>
                </div>
                <button
                  onClick={() => setShowRetentionModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Initiate Retention Case
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Retention Risk</th>
                      <th className="py-3.5 px-4">Case Owner</th>
                      <th className="py-3.5 px-4">Reasons</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {retentionCases.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No retention monitoring cases logged.
                        </td>
                      </tr>
                    ) : (
                      retentionCases.map(rc => (
                        <tr key={rc.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{rc.studentName}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskBadgeColor(rc.retentionRisk)}`}>
                              {rc.retentionRisk}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{rc.caseOwnerName}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{rc.reasons.join(', ')}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-medium text-slate-700">{rc.status}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedRetentionCaseId(rc.id);
                                setShowApproveRetentionModal(true);
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Approve Decision
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ACADEMIC PROGRESSION */}
          {activeTab === 'progression' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Academic Year Progression Assessment</h3>
                  <p className="text-xs text-slate-500">Evaluate student credit requirements, failed subjects, and attendance eligibility for promotion.</p>
                </div>
                <button
                  onClick={() => setShowProgressionModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Assess Progression
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Current Class</th>
                      <th className="py-3.5 px-4">Attendance %</th>
                      <th className="py-3.5 px-4">Failed Subjects</th>
                      <th className="py-3.5 px-4">Progression Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {progressionAssessments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No progression assessments recorded.
                        </td>
                      </tr>
                    ) : (
                      progressionAssessments.map(pa => (
                        <tr key={pa.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{pa.studentName}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{pa.currentClassName}</td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">{pa.attendanceEligibilityPercentage}%</td>
                          <td className="py-3.5 px-4 text-xs text-slate-600">{pa.failedSubjectsCount} subjects</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                pa.progressionStatus === 'ELIGIBLE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pa.progressionStatus === 'CONDITIONALLY_ELIGIBLE'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {pa.progressionStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {!pa.approvedBy ? (
                              <button
                                onClick={() => {
                                  setSelectedProgressionId(pa.id);
                                  setShowApproveProgressionModal(true);
                                }}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                              >
                                Approve Decision
                              </button>
                            ) : (
                              <span className="text-xs font-medium text-emerald-600 flex items-center justify-end gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS & AUDIT TRAIL */}
          {activeTab === 'reviews_audit' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Success Reviews & Security Audit Trail</h3>
                  <p className="text-xs text-slate-500">Immutable audit log for all Student Success & Retention events.</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Log Success Review
                </button>
              </div>

              {/* Audit Logs Table */}
              <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">Actor</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Resource</th>
                      <th className="py-3.5 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                          No audit log records found for this module.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{log.userDisplayName}</td>
                          <td className="py-3 px-4 text-blue-600 font-semibold">{log.action}</td>
                          <td className="py-3 px-4 text-slate-600">{log.resource}</td>
                          <td className="py-3 px-4 text-slate-700">{log.resourceName || log.resourceId}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODAL: CREATE SUCCESS PROFILE */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Initialize Student Success Profile</h3>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Id</label>
                <input
                  type="text"
                  required
                  value={profileForm.studentId}
                  onChange={e => setProfileForm({ ...profileForm, studentId: e.target.value })}
                  placeholder="e.g. std_1001"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.studentName}
                  onChange={e => setProfileForm({ ...profileForm, studentName: e.target.value })}
                  placeholder="e.g. Alexander Vance"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Number</label>
                <input
                  type="text"
                  required
                  value={profileForm.admissionNumber}
                  onChange={e => setProfileForm({ ...profileForm, admissionNumber: e.target.value })}
                  placeholder="e.g. ADM-2025-089"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.className}
                    onChange={e => setProfileForm({ ...profileForm, className: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.sectionName}
                    onChange={e => setProfileForm({ ...profileForm, sectionName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CALCULATE RISK */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Deterministic Risk Score Calculation</h3>
            <p className="text-xs text-slate-500 mb-4">Calculated server-side. Weighted parameters composite score.</p>
            <form onSubmit={handleCalculateRisk} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID & Name</label>
                <input
                  type="text"
                  required
                  value={riskForm.studentName}
                  onChange={e => setRiskForm({ ...riskForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  placeholder="e.g. Alexander Vance"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attendance Deficit % (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskForm.attendanceRisk}
                    onChange={e => setRiskForm({ ...riskForm, attendanceRisk: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Deficit % (30%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskForm.academicRisk}
                    onChange={e => setRiskForm({ ...riskForm, academicRisk: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Engagement Deficit % (15%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskForm.engagementRisk}
                    onChange={e => setRiskForm({ ...riskForm, engagementRisk: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Financial Dues % (10%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={riskForm.financialRisk}
                    onChange={e => setRiskForm({ ...riskForm, financialRisk: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Compute Risk Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OVERRIDE RISK */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Formal Manual Risk Score Override</h3>
            <p className="text-xs text-slate-500 mb-4">Requires detailed audit reasoning. Logged immutably in Audit Trail.</p>
            <form onSubmit={handleOverrideRisk} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Override Risk Level</label>
                <select
                  value={overrideForm.overrideRiskLevel}
                  onChange={e => setOverrideForm({ ...overrideForm, overrideRiskLevel: e.target.value as RiskLevel })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Audit Justification</label>
                <textarea
                  required
                  rows={4}
                  value={overrideForm.overrideReason}
                  onChange={e => setOverrideForm({ ...overrideForm, overrideReason: e.target.value })}
                  placeholder="Provide comprehensive medical, personal, or administrative reasoning..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                  Submit Formal Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG WARNING SIGNAL */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Early Warning Signal</h3>
            <form onSubmit={handleCreateWarningSignal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={warningForm.studentName}
                  onChange={e => setWarningForm({ ...warningForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Signal Type</label>
                  <select
                    value={warningForm.signalType}
                    onChange={e => setWarningForm({ ...warningForm, signalType: e.target.value as SignalType })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  >
                    <option value="ATTENDANCE_DROP">ATTENDANCE_DROP</option>
                    <option value="ACADEMIC_DECLINE">ACADEMIC_DECLINE</option>
                    <option value="ENGAGEMENT_LAG">ENGAGEMENT_LAG</option>
                    <option value="FINANCIAL_DEFAULT">FINANCIAL_DEFAULT</option>
                    <option value="BEHAVIORAL_INCIDENT">BEHAVIORAL_INCIDENT</option>
                    <option value="SUPPORT_ESCALATION">SUPPORT_ESCALATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={warningForm.severity}
                    onChange={e => setWarningForm({ ...warningForm, severity: e.target.value as SignalSeverity })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Evidence & Notes</label>
                <textarea
                  required
                  rows={3}
                  value={warningForm.evidence}
                  onChange={e => setWarningForm({ ...warningForm, evidence: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Log Warning Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROPOSE INTERVENTION */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Propose Student Intervention</h3>
            <form onSubmit={handleCreateIntervention} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={interventionForm.studentName}
                  onChange={e => setInterventionForm({ ...interventionForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={interventionForm.interventionType}
                    onChange={e => setInterventionForm({ ...interventionForm, interventionType: e.target.value as InterventionType })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  >
                    <option value="ACADEMIC_TUTORING">ACADEMIC_TUTORING</option>
                    <option value="ATTENDANCE_CONTRACT">ATTENDANCE_CONTRACT</option>
                    <option value="COUNSELING_SESSIONS">COUNSELING_SESSIONS</option>
                    <option value="FINANCIAL_AID_REVIEW">FINANCIAL_AID_REVIEW</option>
                    <option value="BEHAVIORAL_MENTORING">BEHAVIORAL_MENTORING</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Advisor</label>
                  <input
                    type="text"
                    required
                    value={interventionForm.assignedToName}
                    onChange={e => setInterventionForm({ ...interventionForm, assignedToName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Plan</label>
                <textarea
                  required
                  rows={3}
                  value={interventionForm.actionPlan}
                  onChange={e => setInterventionForm({ ...interventionForm, actionPlan: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Propose Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERIFY INTERVENTION (FOUR-EYES SOD) */}
      {showVerifyInterventionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Four-Eyes Intervention Outcome Verification</h3>
            <p className="text-xs text-slate-500 mb-4">Enforces Separation of Duties: Creator cannot self-verify completion.</p>
            <form onSubmit={handleVerifyIntervention} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Outcome & Evidence</label>
                <textarea
                  required
                  rows={4}
                  value={verifyInterventionForm.outcome}
                  onChange={e => setVerifyInterventionForm({ outcome: e.target.value })}
                  placeholder="Record verified academic improvements or attendance outcomes..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVerifyInterventionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Verify Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RETENTION CASE */}
      {showRetentionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Initiate Retention Monitoring Case</h3>
            <form onSubmit={handleCreateRetentionCase} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={retentionForm.studentName}
                  onChange={e => setRetentionForm({ ...retentionForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Retention Risk</label>
                  <select
                    value={retentionForm.retentionRisk}
                    onChange={e => setRetentionForm({ ...retentionForm, retentionRisk: e.target.value as RiskLevel })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Case Owner Name</label>
                  <input
                    type="text"
                    required
                    value={retentionForm.caseOwnerName}
                    onChange={e => setRetentionForm({ ...retentionForm, caseOwnerName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRetentionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Retention Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE RETENTION DECISION */}
      {showApproveRetentionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Approve Authoritative Retention Decision</h3>
            <p className="text-xs text-slate-500 mb-4">Enforces SoD: Retention case owner cannot self-approve retention decisions.</p>
            <form onSubmit={handleApproveRetention} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Decision Status</label>
                <select
                  value={approveRetentionForm.newStatus}
                  onChange={e => setApproveRetentionForm({ ...approveRetentionForm, newStatus: e.target.value as RetentionStatus })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                >
                  <option value="RETAINED_WITH_SUPPORT">RETAINED WITH SUPPORT</option>
                  <option value="STABLE">STABLE</option>
                  <option value="VOLUNTARY_WITHDRAWAL">VOLUNTARY WITHDRAWAL</option>
                  <option value="ACADEMIC_DISMISSAL">ACADEMIC DISMISSAL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Decision Outcome Summary</label>
                <textarea
                  required
                  rows={3}
                  value={approveRetentionForm.outcome}
                  onChange={e => setApproveRetentionForm({ ...approveRetentionForm, outcome: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApproveRetentionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Authoritatively Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSESS PROGRESSION */}
      {showProgressionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Academic Progression Assessment</h3>
            <form onSubmit={handleAssessProgression} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={progressionForm.studentName}
                  onChange={e => setProgressionForm({ ...progressionForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Earned Credits</label>
                  <input
                    type="number"
                    required
                    value={progressionForm.earnedCredits}
                    onChange={e => setProgressionForm({ ...progressionForm, earnedCredits: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Attendance Eligibility %</label>
                  <input
                    type="number"
                    required
                    value={progressionForm.attendanceEligibilityPercentage}
                    onChange={e => setProgressionForm({ ...progressionForm, attendanceEligibilityPercentage: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Failed Subjects Count</label>
                <input
                  type="number"
                  required
                  value={progressionForm.failedSubjectsCount}
                  onChange={e => setProgressionForm({ ...progressionForm, failedSubjectsCount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgressionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPROVE PROGRESSION */}
      {showApproveProgressionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Approve Academic Progression Decision</h3>
            <p className="text-xs text-slate-500 mb-4">Enforces SoD: Assessor cannot self-approve progression decision.</p>
            <form onSubmit={handleApproveProgression} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Board / Academic Council Decision Reference</label>
                <input
                  type="text"
                  required
                  value={approveProgressionForm.decisionReference}
                  onChange={e => setApproveProgressionForm({ decisionReference: e.target.value })}
                  placeholder="e.g. AC-RESOLUTION-2026-092"
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApproveProgressionModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Authoritatively Approve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG SUCCESS REVIEW */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Student Success Review</h3>
            <form onSubmit={handleCreateReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.studentName}
                  onChange={e => setReviewForm({ ...reviewForm, studentName: e.target.value, studentId: 'std_' + e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Review Period</label>
                <input
                  type="text"
                  required
                  value={reviewForm.reviewPeriod}
                  onChange={e => setReviewForm({ ...reviewForm, reviewPeriod: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Findings</label>
                <textarea
                  required
                  rows={2}
                  value={reviewForm.findings}
                  onChange={e => setReviewForm({ ...reviewForm, findings: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recommendations & Decision</label>
                <textarea
                  required
                  rows={2}
                  value={reviewForm.recommendations}
                  onChange={e => setReviewForm({ ...reviewForm, recommendations: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
