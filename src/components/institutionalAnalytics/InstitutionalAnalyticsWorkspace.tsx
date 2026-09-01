// EMS Phase 7.36: Institutional Data, Analytics, Business Intelligence & Decision Intelligence Governance Engine Workspace

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import {
  InstitutionalAnalyticsService
} from '../../services/institutionalAnalyticsService';
import {
  AnalyticsMetricDefinition,
  DashboardDefinition,
  CohortDefinition,
  InstitutionalBenchmark,
  AnalyticsDataQualityIssue,
  DecisionInsight,
  ReportDefinition,
  AnalyticsExportRequest,
  InstitutionalAnalytics,
  CalculationMethod,
  DataClassificationLevel
} from '../../types/institutionalAnalytics';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Award,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Database,
  Briefcase,
  CheckCircle2,
  DollarSign,
  BookOpen,
  Filter,
  Plus,
  RefreshCw,
  Info,
  Shield,
  FileText,
  Search,
  Lock,
  PieChart,
  Target
} from 'lucide-react';

export const InstitutionalAnalyticsWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant, currentCampus, campuses } = useTenant();

  // Active Tab State (18 tabs)
  const [activeTab, setActiveTab] = useState<
    | 'command_center'
    | 'scorecard'
    | 'student_intel'
    | 'academic_intel'
    | 'faculty_intel'
    | 'finance_intel'
    | 'research_intel'
    | 'quality_intel'
    | 'operations_intel'
    | 'risk_intel'
    | 'cohorts'
    | 'benchmarks'
    | 'trends_forecasts'
    | 'data_quality'
    | 'reports_exports'
    | 'decision_intel'
    | 'governance'
    | 'audit_trail'
  >('command_center');

  // Campus context switcher
  const [selectedCampusId, setSelectedCampusId] = useState<string>('all');

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Data States
  const [scorecard, setScorecard] = useState<InstitutionalAnalytics | null>(null);
  const [metrics, setMetrics] = useState<AnalyticsMetricDefinition[]>([]);
  const [dashboards, setDashboards] = useState<DashboardDefinition[]>([]);
  const [cohorts, setCohorts] = useState<CohortDefinition[]>([]);
  const [benchmarks, setBenchmarks] = useState<InstitutionalBenchmark[]>([]);
  const [dqIssues, setDqIssues] = useState<AnalyticsDataQualityIssue[]>([]);
  const [insights, setInsights] = useState<DecisionInsight[]>([]);
  const [reports, setReports] = useState<ReportDefinition[]>([]);

  // Modal / Form States
  const [showMetricModal, setShowMetricModal] = useState<boolean>(false);
  const [metricForm, setMetricForm] = useState({
    code: '',
    name: '',
    description: '',
    category: 'STUDENT' as AnalyticsMetricDefinition['category'],
    sourceModule: 'mod_student_success',
    sourceCollection: 'students',
    sourceEntityType: 'Student',
    calculationMethod: 'COUNT' as CalculationMethod,
    unitOfMeasure: 'Count',
    classification: 'INTERNAL' as DataClassificationLevel,
    targetValue: 100
  });

  const [showCohortModal, setShowCohortModal] = useState<boolean>(false);
  const [cohortForm, setCohortForm] = useState({
    code: '',
    title: '',
    description: '',
    minCohortSizeProtection: 5
  });

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportForm, setExportForm] = useState({
    title: '',
    format: 'CSV' as 'CSV' | 'XLSX' | 'PDF',
    purpose: '',
    classification: 'INTERNAL' as DataClassificationLevel
  });

  // Load Workspace Data
  const loadWorkspaceData = async () => {
    if (!currentTenant?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [
        scorecardRes,
        metricsRes,
        dashboardsRes,
        cohortsRes,
        benchmarksRes,
        dqRes,
        insightsRes,
        reportsRes
      ] = await Promise.all([
        InstitutionalAnalyticsService.deriveInstitutionalScorecard(currentTenant.id, selectedCampusId),
        InstitutionalAnalyticsService.getMetricDefinitions(currentTenant.id),
        InstitutionalAnalyticsService.getDashboards(currentTenant.id, selectedCampusId),
        InstitutionalAnalyticsService.getCohorts(currentTenant.id),
        InstitutionalAnalyticsService.getBenchmarks(currentTenant.id),
        InstitutionalAnalyticsService.runDataQualityAudit(currentTenant.id),
        InstitutionalAnalyticsService.getDecisionInsights(currentTenant.id),
        InstitutionalAnalyticsService.getReports(currentTenant.id)
      ]);

      setScorecard(scorecardRes);
      setMetrics(metricsRes);
      setDashboards(dashboardsRes);
      setCohorts(cohortsRes);
      setBenchmarks(benchmarksRes);
      setDqIssues(dqRes);
      setInsights(insightsRes);
      setReports(reportsRes);
    } catch (err: any) {
      console.error('Error loading analytics workspace:', err);
      setError(err.message || 'Failed to load institutional analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [currentTenant?.id, selectedCampusId]);

  // Handlers
  const handleCreateMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.createMetricDefinition(currentTenant.id, currentUser.uid, {
        code: metricForm.code,
        name: metricForm.name,
        description: metricForm.description,
        category: metricForm.category,
        lineage: {
          metricId: metricForm.code,
          metricName: metricForm.name,
          sourceModule: metricForm.sourceModule,
          sourceCollection: metricForm.sourceCollection,
          sourceEntityType: metricForm.sourceEntityType,
          sourceFields: ['id', 'status'],
          calculationMethod: metricForm.calculationMethod,
          aggregationMethod: 'SUM',
          tenantScope: currentTenant.id,
          campusScope: 'ALL_CAMPUSES',
          refreshMode: 'HOURLY',
          ownerId: currentUser.uid,
          definitionVersion: 1,
          lastValidatedAt: new Date().toISOString()
        },
        unitOfMeasure: metricForm.unitOfMeasure,
        targetValue: metricForm.targetValue,
        classification: metricForm.classification,
        isActive: true
      });
      setShowMetricModal(false);
      setActionSuccess('KPI Metric Definition created successfully in DRAFT state.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Failed to create metric definition.');
    }
  };

  const handleApproveMetric = async (metricId: string) => {
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.approveMetricDefinition(
        currentTenant.id,
        currentUser.uid,
        metricId,
        currentUser.roles || ['staff']
      );
      setActionSuccess('Metric approved successfully.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Approval failed.');
    }
  };

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.createCohort(currentTenant.id, currentUser.uid, {
        code: cohortForm.code,
        title: cohortForm.title,
        description: cohortForm.description,
        minCohortSizeProtection: cohortForm.minCohortSizeProtection,
        filterCriteria: {}
      });
      setShowCohortModal(false);
      setActionSuccess('Student cohort created successfully with privacy protections.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Failed to create cohort.');
    }
  };

  const handleGenerateInsights = async () => {
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.generateDecisionInsights(currentTenant.id, currentUser.uid);
      setActionSuccess('Decision Insights generated based on dynamic scorecard thresholds.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Failed to generate insights.');
    }
  };

  const handleCertifyInsight = async (insightId: string) => {
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.certifyDecisionInsight(
        currentTenant.id,
        currentUser.uid,
        insightId,
        currentUser.roles || ['staff']
      );
      setActionSuccess('Decision insight certified under Separation of Duties governance.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Certification failed.');
    }
  };

  const handleRequestExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant?.id || !currentUser?.uid) return;
    setError(null);
    try {
      await InstitutionalAnalyticsService.requestExport(currentTenant.id, currentUser.uid, {
        exportTitle: exportForm.title,
        exportFormat: exportForm.format,
        requestPurpose: exportForm.purpose,
        classification: exportForm.classification
      });
      setShowExportModal(false);
      setActionSuccess('Export request submitted. Controlled approval flow initialized.');
      loadWorkspaceData();
    } catch (err: any) {
      setError(err.message || 'Failed to submit export request.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-medium text-slate-600">Loading Institutional Analytics Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Institutional Data & Decision Intelligence</h1>
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  EMS Phase 7.36
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Governed derived analytics layer, KPI data lineage, cohort intelligence & transparent BI dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Campus Context & Quick Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-500 ml-2" />
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 pr-4 py-1 focus:outline-none"
            >
              <option value="all">All Campuses Scope</option>
              {campuses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowMetricModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Define KPI Metric
          </button>

          <button
            onClick={handleGenerateInsights}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Target className="w-4 h-4" />
            Generate Insights
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-semibold underline">Dismiss</button>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs font-semibold underline">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs (18 Tabs) */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm overflow-x-auto flex items-center gap-1">
        {[
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'scorecard', label: 'Scorecard', icon: Target },
          { id: 'student_intel', label: 'Student Intel', icon: Users },
          { id: 'academic_intel', label: 'Academic Intel', icon: BookOpen },
          { id: 'faculty_intel', label: 'Faculty Intel', icon: Briefcase },
          { id: 'finance_intel', label: 'Finance Intel', icon: DollarSign },
          { id: 'research_intel', label: 'Research Intel', icon: Layers },
          { id: 'quality_intel', label: 'Quality Intel', icon: Award },
          { id: 'operations_intel', label: 'Operations', icon: Database },
          { id: 'risk_intel', label: 'Risk Intel', icon: ShieldCheck },
          { id: 'cohorts', label: 'Cohorts', icon: PieChart },
          { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 },
          { id: 'trends_forecasts', label: 'Forecasts', icon: TrendingUp },
          { id: 'data_quality', label: 'Data Quality', icon: Shield },
          { id: 'reports_exports', label: 'Reports & Exports', icon: FileSpreadsheet },
          { id: 'decision_intel', label: 'Decision Intel', icon: Target },
          { id: 'governance', label: 'Governance', icon: Lock },
          { id: 'audit_trail', label: 'Audit Trail', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. Command Center */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Performance Index</div>
              <div className="text-3xl font-bold text-indigo-600">{scorecard?.overallInstitutionalPerformanceIndex || 0}%</div>
              <p className="text-xs text-slate-500">Derived from attendance, academics & compliance</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Students</div>
              <div className="text-3xl font-bold text-slate-900">{scorecard?.activeStudents || 0}</div>
              <p className="text-xs text-emerald-600 font-medium">+{scorecard?.enrollmentTrend || 0}% growth trajectory</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection Rate</div>
              <div className="text-3xl font-bold text-emerald-600">{scorecard?.feeCollectionRate || 0}%</div>
              <p className="text-xs text-slate-500">Receivables: ${(scorecard?.outstandingReceivables || 0).toLocaleString()}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Institutional Risks</div>
              <div className="text-3xl font-bold text-amber-600">{scorecard?.openInstitutionalRisksCount || 0}</div>
              <p className="text-xs text-red-600 font-medium">{scorecard?.criticalComplianceIssuesCount || 0} critical breaches</p>
            </div>
          </div>

          {/* Top Decision Insights */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Active Decision Intelligence Insights
              </h3>
              <span className="text-xs text-slate-500">{insights.length} Insights Available</span>
            </div>

            {insights.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No decision insights available. Click "Generate Insights" to run automated deterministic evaluation.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map(ins => (
                  <div key={ins.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {ins.severity} SEVERITY
                      </span>
                      <span className="text-xs text-slate-500">Status: {ins.reviewStatus}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ins.title}</h4>
                    <p className="text-xs text-slate-600">{ins.observation}</p>
                    <div className="text-xs font-semibold text-indigo-600">Confidence Score: {ins.confidenceScore}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Scorecard */}
      {activeTab === 'scorecard' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900">Institutional Governance Executive Scorecard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-500">Attendance Rate</div>
              <div className="text-2xl font-bold text-slate-900">{scorecard?.attendanceRate}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full" style={{ width: `${scorecard?.attendanceRate}%` }}></div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-500">Academic Achievement Average</div>
              <div className="text-2xl font-bold text-slate-900">{scorecard?.academicAchievementAvg}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full" style={{ width: `${scorecard?.academicAchievementAvg}%` }}></div>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg space-y-2">
              <div className="text-xs font-semibold text-slate-500">Accreditation Readiness Score</div>
              <div className="text-2xl font-bold text-slate-900">{scorecard?.accreditationReadinessScore}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${scorecard?.accreditationReadinessScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Cohorts */}
      {activeTab === 'cohorts' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Governed Student & Academic Cohorts</h3>
              <p className="text-xs text-slate-500">Enforcing minimum cohort size protection for privacy compliance</p>
            </div>
            <button
              onClick={() => setShowCohortModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              Create Cohort
            </button>
          </div>

          {cohorts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No cohorts configured. Click "Create Cohort" to define a governed student group.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cohorts.map(c => (
                <div key={c.id} className="p-4 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600">{c.code}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      Min Size: {c.minCohortSizeProtection}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                  <p className="text-xs text-slate-600">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 14. Data Quality */}
      {activeTab === 'data_quality' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Automated Data Quality Audit Scan</h3>
            <button
              onClick={loadWorkspaceData}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-Scan Collections
            </button>
          </div>

          {dqIssues.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">No Data Quality Issues Detected</h4>
              <p className="text-xs text-emerald-700">All tenant records pass mandatory validation and lineage checks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dqIssues.map(iss => (
                <div key={iss.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        iss.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {iss.severity}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{iss.ruleType}</span>
                    </div>
                    <p className="text-xs text-slate-700">{iss.issueDescription}</p>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium">Ref: {iss.remediationModuleRef}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 17. Governance */}
      {activeTab === 'governance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Governed KPI Metric Definitions</h3>
              <p className="text-xs text-slate-500">Separation of Duties enforced for all metric approvals</p>
            </div>
            <button
              onClick={() => setShowMetricModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              Define KPI Metric
            </button>
          </div>

          {metrics.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No KPI definitions available. Click "Define KPI Metric" to add governed metric lineage.
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.map(m => (
                <div key={m.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600">{m.code}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">{m.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        m.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.approvalStatus}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                    <p className="text-xs text-slate-500">Lineage Source: {m.lineage?.sourceModule} / {m.lineage?.sourceCollection}</p>
                  </div>

                  {m.approvalStatus === 'DRAFT' && (
                    <button
                      onClick={() => handleApproveMetric(m.id)}
                      className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Approve (SoD)
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fallback Zero State Panel for Other Intel Tabs */}
      {!['command_center', 'scorecard', 'cohorts', 'data_quality', 'governance'].includes(activeTab) && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-sm">
          <Info className="w-8 h-8 text-indigo-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')} Intelligence Domain</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Live derived analytics and domain specific metric calculations are dynamically calculated from tenant collections.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs font-semibold px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100"
            >
              Request Controlled Domain Export
            </button>
          </div>
        </div>
      )}

      {/* CREATE METRIC MODAL */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Define Governed KPI Metric</h3>
            <form onSubmit={handleCreateMetric} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Metric Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KPI_STUDENT_ATT_RATE"
                  value={metricForm.code}
                  onChange={(e) => setMetricForm({ ...metricForm, code: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Metric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overall Attendance Rate"
                  value={metricForm.name}
                  onChange={(e) => setMetricForm({ ...metricForm, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Source Module (Lineage)</label>
                <select
                  value={metricForm.sourceModule}
                  onChange={(e) => setMetricForm({ ...metricForm, sourceModule: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="mod_student_success">mod_student_success</option>
                  <option value="mod_attendance">mod_attendance</option>
                  <option value="mod_finance">mod_finance</option>
                  <option value="mod_academic">mod_academic</option>
                  <option value="mod_quality_execution">mod_quality_execution</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMetricModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Save KPI Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COHORT MODAL */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Create Governed Student Cohort</h3>
            <form onSubmit={handleCreateCohort} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Cohort Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COHORT_2026_CS"
                  value={cohortForm.code}
                  onChange={(e) => setCohortForm({ ...cohortForm, code: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Cohort Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science 2026 Batch"
                  value={cohortForm.title}
                  onChange={(e) => setCohortForm({ ...cohortForm, title: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCohortModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT REQUEST MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Request Controlled Analytics Export</h3>
            <form onSubmit={handleRequestExport} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Export Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Performance Summary Q3"
                  value={exportForm.title}
                  onChange={(e) => setExportForm({ ...exportForm, title: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Export Format</label>
                <select
                  value={exportForm.format}
                  onChange={(e) => setExportForm({ ...exportForm, format: e.target.value as any })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="CSV">CSV Format</option>
                  <option value="XLSX">XLSX Format</option>
                  <option value="PDF">PDF Report Package</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Export Purpose Justification</label>
                <textarea
                  required
                  rows={2}
                  placeholder="State the institutional purpose for this data export..."
                  value={exportForm.purpose}
                  onChange={(e) => setExportForm({ ...exportForm, purpose: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Submit Export Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
