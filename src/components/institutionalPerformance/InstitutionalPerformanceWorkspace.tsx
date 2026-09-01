import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Plus, 
  Search,
  Filter,
  BarChart3,
  Layers,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Award,
  ArrowUpRight,
  Shield,
  Activity,
  Check,
  X,
  ExternalLink,
  Calendar,
  UserCheck,
  Building2,
  RefreshCw,
  Sliders,
  Play,
  FileCheck,
  Lock,
  Unlock,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { InstitutionalPerformanceGovernanceService } from '../../services/institutionalPerformanceGovernanceService';
import { 
  StrategicPlan, 
  StrategicObjective, 
  StrategicInitiative,
  KPIDefinition, 
  KPITarget,
  KPIMeasurement,
  BalancedScorecard,
  ExecutiveDecision,
  PerformanceRiskAlert,
  CorrectiveActionPlan,
  WhatIfScenario,
  PerformanceAuditLog,
  KPIPerspective
} from '../../types/institutionalPerformanceGovernance';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { format } from 'date-fns';

export const InstitutionalPerformanceWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const tenantId = currentTenant?.id || 'tenant_main';

  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'kpis' | 'decisions' | 'risks' | 'simulation' | 'audit'>('overview');
  
  // Data states
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<StrategicPlan[]>([]);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([]);
  const [kpis, setKpis] = useState<KPIDefinition[]>([]);
  const [targets, setTargets] = useState<KPITarget[]>([]);
  const [measurements, setMeasurements] = useState<KPIMeasurement[]>([]);
  const [scorecards, setScorecards] = useState<BalancedScorecard[]>([]);
  const [decisions, setDecisions] = useState<ExecutiveDecision[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<PerformanceRiskAlert[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionPlan[]>([]);
  const [simulations, setSimulations] = useState<WhatIfScenario[]>([]);
  const [auditLogs, setAuditLogs] = useState<PerformanceAuditLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerspective, setSelectedPerspective] = useState<string>('ALL');

  // Modal states
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showNewObjectiveModal, setShowNewObjectiveModal] = useState(false);
  const [showNewKPIModal, setShowNewKPIModal] = useState(false);
  const [showNewMeasurementModal, setShowNewMeasurementModal] = useState(false);
  const [showNewDecisionModal, setShowNewDecisionModal] = useState(false);
  const [showNewCAPModal, setShowNewCAPModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    title: '',
    code: '',
    description: '',
    periodStart: '2025-01-01',
    periodEnd: '2030-12-31',
    vision: '',
    mission: '',
    values: 'Academic Rigor, Ethical Governance, Innovation'
  });

  const [objForm, setObjForm] = useState({
    planId: '',
    code: '',
    title: '',
    description: '',
    priority: 'HIGH' as const,
    targetDate: '2027-12-31',
    weight: 25
  });

  const [kpiForm, setKpiForm] = useState({
    code: '',
    name: '',
    description: '',
    perspective: 'ACADEMIC' as KPIPerspective,
    directionality: 'HIGHER_IS_BETTER' as const,
    frequency: 'QUARTERLY' as const,
    unit: 'PERCENTAGE' as const,
    calculationMethod: '',
    dataSourceSystem: 'EMS_STUDENT_RECORD',
    weight: 20
  });

  const [measurementForm, setMeasurementForm] = useState({
    kpiId: '',
    targetId: '',
    periodLabel: 'Q1 2025',
    actualValue: 90,
    notes: '',
    evidenceUrl: ''
  });

  const [decisionForm, setDecisionForm] = useState({
    code: '',
    title: '',
    summary: '',
    rationale: '',
    category: 'STRATEGIC_RESOURCE_ALLOCATION' as const,
    requestedBudget: 500000,
    allocatedBudget: 500000,
    riskAssessment: '',
    alternativeOptionsConsidered: ''
  });

  const [capForm, setCapForm] = useState({
    kpiId: '',
    alertId: '',
    title: '',
    rootCauseAnalysis: '',
    targetResolutionDate: '2025-12-31',
    assignedTo: currentUser?.id || 'staff_1',
    assignedToName: currentUser?.displayName || 'Quality Officer'
  });

  useEffect(() => {
    loadAllData();
  }, [tenantId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Seed baseline if empty
      const existingPlans = await InstitutionalPerformanceGovernanceService.getStrategicPlans(tenantId);
      if (existingPlans.length === 0 && currentUser) {
        await InstitutionalPerformanceGovernanceService.seedBaselineGovernance(tenantId, currentUser);
      }

      const [
        loadedPlans,
        loadedObjs,
        loadedInits,
        loadedKpis,
        loadedTargets,
        loadedMeasures,
        loadedScorecards,
        loadedDecisions,
        loadedAlerts,
        loadedCaps,
        loadedScenarios,
        loadedAudits
      ] = await Promise.all([
        InstitutionalPerformanceGovernanceService.getStrategicPlans(tenantId),
        InstitutionalPerformanceGovernanceService.getStrategicObjectives(tenantId),
        InstitutionalPerformanceGovernanceService.getStrategicInitiatives(tenantId),
        InstitutionalPerformanceGovernanceService.getKPIRegistry(tenantId),
        InstitutionalPerformanceGovernanceService.getKPITargets(tenantId),
        InstitutionalPerformanceGovernanceService.getKPIMeasurements(tenantId),
        InstitutionalPerformanceGovernanceService.getBalancedScorecards(tenantId),
        InstitutionalPerformanceGovernanceService.getExecutiveDecisions(tenantId),
        InstitutionalPerformanceGovernanceService.getPerformanceRiskAlerts(tenantId),
        InstitutionalPerformanceGovernanceService.getCorrectiveActionPlans(tenantId),
        InstitutionalPerformanceGovernanceService.getWhatIfScenarios(tenantId),
        InstitutionalPerformanceGovernanceService.getPerformanceAuditLogs(tenantId)
      ]);

      setPlans(loadedPlans);
      setObjectives(loadedObjs);
      setInitiatives(loadedInits);
      setKpis(loadedKpis);
      setTargets(loadedTargets);
      setMeasurements(loadedMeasures);
      setScorecards(loadedScorecards);
      setDecisions(loadedDecisions);
      setRiskAlerts(loadedAlerts);
      setCorrectiveActions(loadedCaps);
      setSimulations(loadedScenarios);
      setAuditLogs(loadedAudits);

      if (loadedPlans.length > 0 && !selectedPlanId) {
        setSelectedPlanId(loadedPlans[0].id);
      }
    } catch (err) {
      console.error('Error loading performance governance data:', err);
      setErrorMessage('Failed to load performance governance data.');
    } finally {
      setLoading(false);
    }
  };

  const showBanner = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Handlers for Plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await InstitutionalPerformanceGovernanceService.createStrategicPlan(tenantId, {
        ...planForm,
        values: planForm.values.split(',').map(s => s.trim())
      }, currentUser);
      setShowNewPlanModal(false);
      showBanner('Strategic plan created successfully.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to create plan', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprovePlan = async (planId: string) => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.approveStrategicPlan(tenantId, planId, currentUser);
      showBanner('Strategic plan approved successfully.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Approval failed (SoD check enforced)', true);
    }
  };

  const handleActivatePlan = async (planId: string) => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.activateStrategicPlan(tenantId, planId, currentUser);
      showBanner('Strategic plan activated as active institutional masterplan.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Activation failed', true);
    }
  };

  // Handlers for Objective
  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedPlanId) return;
    setSubmitting(true);
    try {
      await InstitutionalPerformanceGovernanceService.createStrategicObjective(tenantId, {
        ...objForm,
        planId: selectedPlanId,
        status: 'PLANNED'
      }, currentUser);
      setShowNewObjectiveModal(false);
      showBanner('Strategic objective registered.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to create objective', true);
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers for KPI
  const handleCreateKPI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await InstitutionalPerformanceGovernanceService.registerKPI(tenantId, {
        ...kpiForm,
        ownerId: currentUser.id,
        ownerName: currentUser.displayName || 'KPI Owner',
        targetType: 'PERCENTAGE',
        isCalculated: true
      }, currentUser);
      setShowNewKPIModal(false);
      showBanner('Authoritative KPI registered successfully.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to register KPI', true);
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers for Measurement
  const handleCreateMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      const target = targets.find(t => t.kpiId === measurementForm.kpiId) || { id: 'target_default', targetValue: 100 };
      await InstitutionalPerformanceGovernanceService.submitKPIMeasurement(tenantId, {
        kpiId: measurementForm.kpiId,
        targetId: measurementForm.targetId || target.id,
        periodLabel: measurementForm.periodLabel,
        actualValue: measurementForm.actualValue,
        notes: measurementForm.notes,
        evidenceUrl: measurementForm.evidenceUrl
      }, currentUser);
      setShowNewMeasurementModal(false);
      showBanner('KPI measurement submitted and audited for variance.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to submit measurement', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveMeasurement = async (measurementId: string) => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.approveKPIMeasurement(tenantId, measurementId, currentUser);
      showBanner('Measurement approved (4-Eyes separation of duties verified).');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Approval failed', true);
    }
  };

  // Handlers for Executive Decisions
  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await InstitutionalPerformanceGovernanceService.proposeExecutiveDecision(tenantId, {
        ...decisionForm,
        linkedObjectiveIds: objectives.slice(0, 1).map(o => o.id),
        linkedKpiIds: kpis.slice(0, 1).map(k => k.id),
        proposerRole: currentUser.role || 'Executive'
      }, currentUser);
      setShowNewDecisionModal(false);
      showBanner('Executive decision proposed for board signoff.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to propose decision', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecisionVote = async (decisionId: string, vote: 'APPROVE' | 'REJECT' | 'ABSTAIN') => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.recordDecisionSignoff(
        tenantId,
        decisionId,
        vote,
        'Ratified via executive governance portal.',
        currentUser
      );
      showBanner(`Decision signoff recorded: ${vote}`);
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Signoff failed (SoD rule enforced)', true);
    }
  };

  // Handlers for CAP
  const handleCreateCAP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await InstitutionalPerformanceGovernanceService.createCorrectiveActionPlan(tenantId, {
        ...capForm,
        actionSteps: [
          { step: 1, description: 'Root cause investigation and audit review', owner: capForm.assignedToName, dueDate: '2025-06-30', completed: false },
          { step: 2, description: 'Corrective intervention execution', owner: capForm.assignedToName, dueDate: '2025-09-30', completed: false }
        ]
      }, currentUser);
      setShowNewCAPModal(false);
      showBanner('Corrective Action Plan (CAP) initiated.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Failed to create CAP', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCAP = async (capId: string) => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.verifyAndCloseCAP(
        tenantId,
        capId,
        'Evidence verified by quality assurance committee.',
        currentUser
      );
      showBanner('CAP verified and closed successfully.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Verification failed', true);
    }
  };

  const handleGenerateScorecard = async () => {
    if (!currentUser) return;
    try {
      await InstitutionalPerformanceGovernanceService.generateBalancedScorecard(
        tenantId,
        'AY-2025-2026',
        'AY 2025-2026',
        currentUser
      );
      showBanner('Official Balanced Scorecard generated successfully.');
      loadAllData();
    } catch (err: any) {
      showBanner(err.message || 'Scorecard generation failed', true);
    }
  };

  const activeScorecard = scorecards[0];

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Notifications */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center shadow-sm">
          <AlertTriangle className="w-5 h-5 mr-2 text-rose-600 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>Phase 7.52 Institutional Enterprise Performance & Strategy Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Institutional Performance & Balanced Scorecard</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Enterprise strategic planning, governed 5-perspective balanced scorecards, executive decision signoffs with 4-eyes separation of duties, and early-warning risk mitigation.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateScorecard}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Generate Scorecard</span>
            </button>
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Health Metrics Bar */}
        {activeScorecard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <span className="text-xs text-indigo-300 uppercase tracking-wider">Overall Health Score</span>
              <div className="text-2xl font-bold mt-1 flex items-baseline">
                <span>{activeScorecard.overallHealthScore}%</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  {activeScorecard.healthStatus}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-indigo-300 uppercase tracking-wider">Active Strategic Plan</span>
              <div className="text-lg font-semibold mt-1 truncate">
                {plans.find(p => p.status === 'ACTIVE')?.title || 'No Active Plan'}
              </div>
            </div>
            <div>
              <span className="text-xs text-indigo-300 uppercase tracking-wider">Active Risk Alerts</span>
              <div className="text-2xl font-bold mt-1 text-amber-300 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-1" />
                <span>{riskAlerts.filter(a => a.status === 'ACTIVE').length}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-indigo-300 uppercase tracking-wider">Governed KPIs</span>
              <div className="text-2xl font-bold mt-1">{kpis.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
        {[
          { id: 'overview', label: 'Balanced Scorecard', icon: BarChart3 },
          { id: 'strategy', label: 'Strategic Planning', icon: Target },
          { id: 'kpis', label: 'KPI Registry & Data', icon: TrendingUp },
          { id: 'decisions', label: 'Executive Decisions', icon: UserCheck },
          { id: 'risks', label: 'Risks & CAPs', icon: ShieldAlert },
          { id: 'simulation', label: 'What-If Simulation', icon: Sliders },
          { id: 'audit', label: 'Audit Trail', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW & BALANCED SCORECARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Balanced Scorecard (5 Perspectives)</h2>
                <p className="text-sm text-slate-500">Holistic institutional performance weighted across financial, academic, internal, stakeholder, and capacity dimensions.</p>
              </div>
              <button
                onClick={handleGenerateScorecard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-Calculate Scorecard</span>
              </button>
            </div>

            {activeScorecard ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(activeScorecard.perspectives).map((p: any) => {
                  const isHealthy = p.status === 'HEALTHY';
                  return (
                    <div key={p.perspective} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                            Weight: {p.weight}%
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            isHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{p.perspectiveName}</h3>
                        <div className="mt-4 flex items-baseline">
                          <span className="text-3xl font-extrabold text-slate-900">{p.rawScore}%</span>
                          <span className="ml-2 text-xs text-slate-500">weighted contrib: {p.weightedScore} pts</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, p.rawScore)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tracked KPIs:</span>
                          <span className="font-semibold text-slate-800">{p.kpiCount}</span>
                        </div>
                        {p.topPerformer && (
                          <div className="flex justify-between truncate">
                            <span className="text-slate-400">Top:</span>
                            <span className="font-medium text-emerald-600 truncate max-w-[180px]">{p.topPerformer}</span>
                          </div>
                        )}
                        {p.lowestPerformer && (
                          <div className="flex justify-between truncate">
                            <span className="text-slate-400">Lagging:</span>
                            <span className="font-medium text-rose-600 truncate max-w-[180px]">{p.lowestPerformer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-700">No Balanced Scorecard Generated</h3>
                <p className="text-sm text-slate-500 mt-1">Click the button above to calculate official institutional scorecards.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STRATEGIC PLANNING */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Multi-Year Strategic Masterplans</h2>
                <p className="text-sm text-slate-500">Manage institutional strategy, themes, objectives, and governance lifecycle approval.</p>
              </div>
              <button
                onClick={() => setShowNewPlanModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Strategic Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plans List */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Masterplans</h3>
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                        isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{plan.code}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          plan.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                          plan.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                          plan.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {plan.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{plan.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{plan.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>Period: {plan.periodStart} to {plan.periodEnd}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Plan Details & Objectives */}
              <div className="lg:col-span-2 space-y-6">
                {selectedPlanId ? (() => {
                  const plan = plans.find(p => p.id === selectedPlanId);
                  const planObjectives = objectives.filter(o => o.planId === selectedPlanId);
                  if (!plan) return null;

                  return (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-indigo-600">{plan.code}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">Version {plan.version}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mt-1">{plan.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {plan.status === 'DRAFT' && (
                            <button
                              onClick={() => handleApprovePlan(plan.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                            >
                              Approve Plan
                            </button>
                          )}
                          {plan.status === 'APPROVED' && (
                            <button
                              onClick={() => handleActivatePlan(plan.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
                            >
                              Activate Plan
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">Vision</span>
                          <p className="text-slate-600 text-xs">{plan.vision}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 block mb-1">Mission</span>
                          <p className="text-slate-600 text-xs">{plan.mission}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-slate-900 text-sm">Strategic Objectives ({planObjectives.length})</h4>
                          <button
                            onClick={() => {
                              setObjForm(prev => ({ ...prev, planId: plan.id }));
                              setShowNewObjectiveModal(true);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium flex items-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Objective</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {planObjectives.map(obj => (
                            <div key={obj.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{obj.code}</span>
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                    obj.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {obj.priority}
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-slate-500">Weight: {obj.weight}%</span>
                              </div>
                              <h5 className="font-bold text-slate-900 text-sm mt-2">{obj.title}</h5>
                              <p className="text-xs text-slate-500 mt-1">{obj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-slate-700">Select a Strategic Plan</h3>
                    <p className="text-sm text-slate-500 mt-1">Choose a masterplan from the left to view objectives and governance.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KPI REGISTRY & MEASUREMENTS */}
        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Authoritative Governed KPI Registry</h2>
                <p className="text-sm text-slate-500">Manage governed key performance indicators, data lineage tracing, and actual measurement submissions.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowNewMeasurementModal(true)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit Measurement</span>
                </button>
                <button
                  onClick={() => setShowNewKPIModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register New KPI</span>
                </button>
              </div>
            </div>

            {/* KPI Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Code / KPI Name</th>
                      <th className="py-3 px-4">Perspective</th>
                      <th className="py-3 px-4">Directionality</th>
                      <th className="py-3 px-4">Data Source System</th>
                      <th className="py-3 px-4">Weight</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {kpis.map((kpi) => (
                      <tr key={kpi.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{kpi.name}</div>
                          <div className="text-xs text-indigo-600 font-mono">{kpi.code}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                            {kpi.perspective}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-600">{kpi.directionality}</td>
                        <td className="py-4 px-4">
                          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                            {kpi.dataSourceSystem}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">{kpi.weight}%</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                            kpi.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {kpi.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setMeasurementForm(prev => ({ ...prev, kpiId: kpi.id }));
                              setShowNewMeasurementModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                          >
                            Add Measure
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Measurements & Audit List */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Measurements & Audited Lineage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {measurements.map((m) => {
                  const kpi = kpis.find(k => k.id === m.kpiId);
                  const isApproved = m.status === 'APPROVED';
                  return (
                    <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-indigo-600">{m.periodLabel}</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5">{kpi?.name || 'Unknown KPI'}</h4>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                        <div>
                          <span className="text-slate-400 block">Actual</span>
                          <span className="font-bold text-slate-900 text-sm">{m.actualValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Target</span>
                          <span className="font-bold text-slate-900 text-sm">{m.targetValue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Achievement</span>
                          <span className="font-bold text-indigo-600 text-sm">{m.achievementRate}%</span>
                        </div>
                      </div>

                      {m.notes && <p className="text-xs text-slate-500 italic">"{m.notes}"</p>}

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Source: {m.dataLineageTrace?.sourceSystem || 'MANUAL'}</span>
                        {!isApproved && (
                          <button
                            onClick={() => handleApproveMeasurement(m.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
                          >
                            Approve Measurement
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXECUTIVE DECISIONS */}
        {activeTab === 'decisions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Executive Decisions & 4-Eyes Signoffs</h2>
                <p className="text-sm text-slate-500">Governed board-level resolutions, resource allocations, and immutable signoff audit trails.</p>
              </div>
              <button
                onClick={() => setShowNewDecisionModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Propose Decision</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {decisions.map((dec) => {
                const approvalCount = dec.signoffs.filter(s => s.decision === 'APPROVE').length;
                return (
                  <div key={dec.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{dec.code}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{dec.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mt-1">{dec.title}</h3>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                        dec.status === 'APPROVED' || dec.status === 'EXECUTED' ? 'bg-emerald-50 text-emerald-700' :
                        dec.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {dec.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600">{dec.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 block">Requested Budget</span>
                        <span className="font-bold text-slate-900 text-base">${dec.requestedBudget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Proposer</span>
                        <span className="font-semibold text-slate-800">{dec.proposerName} ({dec.proposerRole})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Signoff Approvals</span>
                        <span className="font-semibold text-emerald-600">{approvalCount} Signed</span>
                      </div>
                    </div>

                    {/* Signoff Actions */}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <UserCheck className="w-4 h-4 text-indigo-600" />
                        <span>Signoffs recorded: {dec.signoffs.length}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDecisionVote(dec.id, 'APPROVE')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve (SoD)</span>
                        </button>
                        <button
                          onClick={() => handleDecisionVote(dec.id, 'REJECT')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: RISKS & CORRECTIVE ACTIONS */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Performance Risk Alerts & CAPs</h2>
                <p className="text-sm text-slate-500">Automated early warning threshold breach detection and corrective action plan verification.</p>
              </div>
              <button
                onClick={() => setShowNewCAPModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create CAP</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Alerts */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Risk Alerts ({riskAlerts.length})</h3>
                {riskAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700">
                        {alert.severity} SEVERITY
                      </span>
                      <span className="text-xs font-mono text-slate-400">{format(new Date(alert.triggerDate), 'MMM d, yyyy')}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{alert.kpiName}</h4>
                    <p className="text-xs text-slate-600">Threshold breached: <span className="font-semibold text-rose-600">{alert.thresholdBreached}</span> (Actual: {alert.actualValue} vs Target: {alert.targetValue})</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Status: {alert.status}</span>
                      <button
                        onClick={() => {
                          setCapForm(prev => ({ ...prev, alertId: alert.id, title: `CAP for ${alert.kpiName}` }));
                          setShowNewCAPModal(true);
                        }}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                      >
                        Mitigate via CAP
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrective Action Plans */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Corrective Action Plans ({correctiveActions.length})</h3>
                {correctiveActions.map((cap) => {
                  const isClosed = cap.status === 'VERIFIED_CLOSED';
                  return (
                    <div key={cap.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{cap.title}</h4>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          isClosed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {cap.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600"><span className="font-semibold">Root Cause:</span> {cap.rootCauseAnalysis}</p>
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Owner: {cap.assignedToName}</span>
                        {!isClosed && (
                          <button
                            onClick={() => handleVerifyCAP(cap.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
                          >
                            Verify & Close (SoD)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WHAT-IF SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">What-If Scenario Simulation Sandbox</h2>
              <p className="text-sm text-slate-500">Simulate budgetary and KPI policy adjustments to forecast institutional scorecard impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Simulation Parameters</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Target Academic Retention Boost (%)</label>
                    <input type="range" min="0" max="15" defaultValue="5" className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Research Grant Funding Multiplier</label>
                    <input type="range" min="1" max="3" step="0.1" defaultValue="1.5" className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Operating Margin Adjustment (%)</label>
                    <input type="range" min="-5" max="10" defaultValue="2" className="w-full accent-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Forecasted Institutional Health Score</span>
                  <div className="text-4xl font-extrabold mt-2 text-emerald-400">92.4%</div>
                  <p className="text-xs text-slate-300 mt-2">Projected status: <span className="font-semibold text-white">EXCELLING</span> under simulated policy interventions.</p>
                </div>
                <div className="pt-6 border-t border-white/10 text-xs text-indigo-200 flex justify-between">
                  <span>Risk alerts predicted: 0</span>
                  <span>Confidence rating: 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Immutable Performance Governance Audit Logs</h2>
              <p className="text-sm text-slate-500">Tamper-evident chronological event log tracking all institutional performance actions and approvals.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Entity Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-all font-mono text-xs">
                      <td className="py-3 px-4 text-slate-500">{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{log.actorName}</td>
                      <td className="py-3 px-4 text-indigo-600 font-bold">{log.action}</td>
                      <td className="py-3 px-4 text-slate-600">{log.entityType}</td>
                      <td className="py-3 px-4 text-slate-900 truncate max-w-xs">{log.entityName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Create Strategic Masterplan</h3>
              <button onClick={() => setShowNewPlanModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={planForm.title}
                  onChange={e => setPlanForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Vision 2030 Masterplan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Code</label>
                  <input
                    type="text"
                    required
                    value={planForm.code}
                    onChange={e => setPlanForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. STRAT-2030"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Start / End</label>
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={planForm.periodStart}
                      onChange={e => setPlanForm(prev => ({ ...prev, periodStart: e.target.value }))}
                      className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={planForm.description}
                  onChange={e => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Objective Modal */}
      {showNewObjectiveModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add Strategic Objective</h3>
              <button onClick={() => setShowNewObjectiveModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateObjective} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Objective Code</label>
                  <input
                    type="text"
                    required
                    value={objForm.code}
                    onChange={e => setObjForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. OBJ-ACAD-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={objForm.priority}
                    onChange={e => setObjForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={objForm.title}
                  onChange={e => setObjForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={objForm.description}
                  onChange={e => setObjForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={objForm.weight}
                  onChange={e => setObjForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewObjectiveModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Objective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New KPI Modal */}
      {showNewKPIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Register Authoritative KPI</h3>
              <button onClick={() => setShowNewKPIModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateKPI} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">KPI Code</label>
                  <input
                    type="text"
                    required
                    value={kpiForm.code}
                    onChange={e => setKpiForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. KPI-RET-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Perspective</label>
                  <select
                    value={kpiForm.perspective}
                    onChange={e => setKpiForm(prev => ({ ...prev, perspective: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="FINANCIAL">Financial & Stewardship</option>
                    <option value="ACADEMIC">Academic Excellence</option>
                    <option value="INTERNAL_PROCESS">Internal Process</option>
                    <option value="STAKEHOLDER">Stakeholder</option>
                    <option value="STRATEGIC_CAPACITY">Strategic Capacity</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">KPI Name</label>
                <input
                  type="text"
                  required
                  value={kpiForm.name}
                  onChange={e => setKpiForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Source System</label>
                <input
                  type="text"
                  required
                  value={kpiForm.dataSourceSystem}
                  onChange={e => setKpiForm(prev => ({ ...prev, dataSourceSystem: e.target.value }))}
                  placeholder="e.g. EMS_STUDENT_RECORD"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Directionality</label>
                  <select
                    value={kpiForm.directionality}
                    onChange={e => setKpiForm(prev => ({ ...prev, directionality: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="HIGHER_IS_BETTER">Higher is Better</option>
                    <option value="LOWER_IS_BETTER">Lower is Better</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={kpiForm.weight}
                    onChange={e => setKpiForm(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewKPIModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Registering...' : 'Register KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Measurement Modal */}
      {showNewMeasurementModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Submit KPI Measurement</h3>
              <button onClick={() => setShowNewMeasurementModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMeasurement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select KPI</label>
                <select
                  value={measurementForm.kpiId}
                  onChange={e => setMeasurementForm(prev => ({ ...prev, kpiId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="">-- Choose KPI --</option>
                  {kpis.map(k => (
                    <option key={k.id} value={k.id}>{k.code} - {k.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Label</label>
                  <input
                    type="text"
                    value={measurementForm.periodLabel}
                    onChange={e => setMeasurementForm(prev => ({ ...prev, periodLabel: e.target.value }))}
                    placeholder="e.g. Q1 2025"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Actual Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={measurementForm.actualValue}
                    onChange={e => setMeasurementForm(prev => ({ ...prev, actualValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Notes / Commentary</label>
                <textarea
                  rows={2}
                  value={measurementForm.notes}
                  onChange={e => setMeasurementForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewMeasurementModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Submitting...' : 'Submit Measurement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Executive Decision Modal */}
      {showNewDecisionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Propose Executive Decision</h3>
              <button onClick={() => setShowNewDecisionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDecision} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Decision Code</label>
                  <input
                    type="text"
                    required
                    value={decisionForm.code}
                    onChange={e => setDecisionForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. DEC-2025-002"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={decisionForm.category}
                    onChange={e => setDecisionForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="STRATEGIC_RESOURCE_ALLOCATION">Strategic Resource Allocation</option>
                    <option value="POLICY_AMENDMENT">Policy Amendment</option>
                    <option value="CAPEX_AUTHORIZATION">CapEx Authorization</option>
                    <option value="EMERGENCY_INTERVENTION">Emergency Intervention</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={decisionForm.title}
                  onChange={e => setDecisionForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  required
                  value={decisionForm.summary}
                  onChange={e => setDecisionForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Budget ($)</label>
                <input
                  type="number"
                  value={decisionForm.requestedBudget}
                  onChange={e => setDecisionForm(prev => ({ ...prev, requestedBudget: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewDecisionModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Proposing...' : 'Propose Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New CAP Modal */}
      {showNewCAPModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Initiate Corrective Action Plan (CAP)</h3>
              <button onClick={() => setShowNewCAPModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCAP} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Associated KPI</label>
                <select
                  value={capForm.kpiId}
                  onChange={e => setCapForm(prev => ({ ...prev, kpiId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="">-- Choose KPI --</option>
                  {kpis.map(k => (
                    <option key={k.id} value={k.id}>{k.code} - {k.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CAP Title</label>
                <input
                  type="text"
                  required
                  value={capForm.title}
                  onChange={e => setCapForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Root Cause Analysis</label>
                <textarea
                  rows={3}
                  required
                  value={capForm.rootCauseAnalysis}
                  onChange={e => setCapForm(prev => ({ ...prev, rootCauseAnalysis: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCAPModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm"
                >
                  {submitting ? 'Initiating...' : 'Initiate CAP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
