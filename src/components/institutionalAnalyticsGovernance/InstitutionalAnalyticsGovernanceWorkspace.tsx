import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Award,
  Layers,
  FileCheck,
  Activity,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  BarChart3,
  GitBranch,
  RefreshCw,
  Zap,
  Lock,
  Compass,
  AlertCircle,
  HelpCircle,
  UserCheck,
  Check,
  Info,
  Play,
  RotateCcw,
  FileText,
  Clock,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  InstitutionalAnalyticsStrategy,
  AnalyticsObjective,
  IndicatorDefinition,
  IndicatorObservation,
  IndicatorTarget,
  ForecastRun,
  EarlyWarningObservation,
  AnalyticsScenario,
  DecisionBrief,
  AnalyticsException,
  AnalyticsOverride,
  GovAnalyticsAuditEvent,
  AnalyticsDiagnostic,
  AnalyticsDomain
} from '../../types/institutionalAnalyticsGovernance';
import { 
  InstitutionalAnalyticsGovernanceService,
  DOMAIN_INDICATORS 
} from '../../services/institutionalAnalyticsGovernanceService';

export const InstitutionalAnalyticsGovernanceWorkspace: React.FC = () => {
  const { currentUser, activeRoleAssignment } = useAuth();
  const { currentTenant } = useTenant();
  const { showNotification } = useNotification();

  const tenantId = currentTenant?.id || 't_demo_india';
  const campusId = 'main_campus_delhi';
  const actorId = currentUser?.email || 'executive@ryze.com';

  const [activeTab, setActiveTab] = useState<string>('strategy');
  const [strategy, setStrategy] = useState<InstitutionalAnalyticsStrategy | null>(null);
  const [indicators, setIndicators] = useState<IndicatorDefinition[]>(DOMAIN_INDICATORS);
  const [observations, setObservations] = useState<IndicatorObservation[]>([]);
  const [targets, setTargets] = useState<IndicatorTarget[]>([]);
  const [forecasts, setForecasts] = useState<ForecastRun[]>([]);
  const [warnings, setWarnings] = useState<EarlyWarningObservation[]>([]);
  const [decisions, setDecisions] = useState<DecisionBrief[]>([]);
  const [overrides, setOverrides] = useState<AnalyticsOverride[]>([]);
  const [exceptions, setExceptions] = useState<AnalyticsException[]>([]);
  const [diagnostics, setDiagnostics] = useState<AnalyticsDiagnostic[]>([]);
  const [auditLogs, setAuditLogs] = useState<GovAnalyticsAuditEvent[]>([]);

  // Sandbox Scenario state
  const [selectedScenario, setSelectedScenario] = useState<string>('Enrollment Decline');
  const [activeSimulation, setActiveSimulation] = useState<AnalyticsScenario | null>(null);

  // Form State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Override Form
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [overrideIndicator, setOverrideIndicator] = useState<string>('');
  const [overrideValue, setOverrideValue] = useState<string>('');
  const [overrideJustification, setOverrideJustification] = useState<string>('');

  // Decision Brief Form
  const [showDecisionModal, setShowDecisionModal] = useState<boolean>(false);
  const [newDecisionTitle, setNewDecisionTitle] = useState<string>('');
  const [newDecisionQuestion, setNewDecisionQuestion] = useState<string>('');
  const [newDecisionState, setNewDecisionState] = useState<string>('');
  const [newDecisionAlt, setNewDecisionAlt] = useState<string>('');
  const [newDecisionAltCost, setNewDecisionAltCost] = useState<string>('');

  // Load state from service
  const loadData = async () => {
    const strat = await InstitutionalAnalyticsGovernanceService.getStrategy(tenantId);
    setStrategy(strat);

    const obs = await InstitutionalAnalyticsGovernanceService.getIndicatorObservations(tenantId, campusId);
    setObservations(obs);

    const tgts = await InstitutionalAnalyticsGovernanceService.getIndicatorTargets(tenantId);
    setTargets(tgts);

    const fore = await InstitutionalAnalyticsGovernanceService.generateForecasts(tenantId, campusId);
    setForecasts(fore);

    const war = await InstitutionalAnalyticsGovernanceService.evaluateEarlyWarnings(tenantId, campusId);
    setWarnings(war);

    const decs = await InstitutionalAnalyticsGovernanceService.getDecisionBriefs(tenantId);
    setDecisions(decs);

    const ovrs = await InstitutionalAnalyticsGovernanceService.getOverrides(tenantId);
    setOverrides(ovrs);

    const excep = await InstitutionalAnalyticsGovernanceService.getExceptions(tenantId);
    setExceptions(excep);

    const diags = await InstitutionalAnalyticsGovernanceService.runSystemDiagnostics(tenantId, campusId);
    setDiagnostics(diags);

    const logs = InstitutionalAnalyticsGovernanceService.getAuditTrailLogs(tenantId);
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  // Run in-memory simulation
  const handleRunSimulation = () => {
    const sim = InstitutionalAnalyticsGovernanceService.runScenarioSimulation(selectedScenario, observations);
    setActiveSimulation(sim);
    showNotification({
      type: 'success',
      title: 'Simulation Executed',
      message: `In-memory stress scenario "${selectedScenario}" processed successfully.`
    });
  };

  // Run overrides
  const handleApplyOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideIndicator || !overrideValue || !overrideJustification) {
      showNotification({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please complete all required fields for the override.'
      });
      return;
    }

    const valueNum = parseFloat(overrideValue);
    if (isNaN(valueNum)) {
      showNotification({
        type: 'error',
        title: 'Validation Failed',
        message: 'Override value must be a valid number.'
      });
      return;
    }

    const matchedObs = observations.find(o => o.indicatorCode === overrideIndicator);
    const original = matchedObs ? (matchedObs.value ?? 0) : 0;

    await InstitutionalAnalyticsGovernanceService.recordOverride(tenantId, {
      indicatorCode: overrideIndicator,
      originalValue: original,
      overrideValue: valueNum,
      reason: overrideJustification,
      governanceApprovedByUserIdRef: actorId
    });

    // Update state observations in memory to reflect corrected value
    setObservations(prev => prev.map(o => o.indicatorCode === overrideIndicator ? { ...o, value: valueNum } : o));

    showNotification({
      type: 'success',
      title: 'Override Authorized',
      message: `Manual correction registered on ${overrideIndicator} with audit trail.`
    });

    setShowOverrideModal(false);
    setOverrideIndicator('');
    setOverrideValue('');
    setOverrideJustification('');
    loadData();
  };

  // Create Decision Brief
  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecisionTitle || !newDecisionQuestion || !newDecisionState) {
      showNotification({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please complete core decision fields.'
      });
      return;
    }

    const costNum = parseFloat(newDecisionAltCost) || 0;

    await InstitutionalAnalyticsGovernanceService.createDecisionBrief(tenantId, {
      title: newDecisionTitle,
      decisionQuestion: newDecisionQuestion,
      currentState: newDecisionState,
      requestedByUserIdRef: actorId,
      campusId,
      confidence: 'HIGH',
      alternatives: [
        {
          id: `alt_${Date.now()}`,
          title: newDecisionAlt || 'Contingency Implementation Plan',
          description: 'Deploy adaptive resources to absorb current performance deviation.',
          estimatedCost: costNum,
          expectedBenefits: 'Stabilize domain indicators and mitigate early warnings.',
          impactEstimates: []
        }
      ],
      evidence: [
        {
          referenceType: 'KPI',
          referenceId: 'IND_FIN_LIQ',
          description: 'Linked observed indicator level triggers.'
        }
      ]
    });

    showNotification({
      type: 'success',
      title: 'Decision Brief Submitted',
      message: `Strategic decision "${newDecisionTitle}" registered for Four-Eyes approval.`
    });

    setShowDecisionModal(false);
    setNewDecisionTitle('');
    setNewDecisionQuestion('');
    setNewDecisionState('');
    setNewDecisionAlt('');
    setNewDecisionAltCost('');
    loadData();
  };

  // Approve Decision Brief with SOD Check
  const handleApproveDecision = async (id: string) => {
    const res = await InstitutionalAnalyticsGovernanceService.approveDecisionBrief(tenantId, id, actorId, 'Verified and approved under institutional charter guidelines.');
    
    if (res.success) {
      showNotification({
        type: 'success',
        title: 'Decision Approved',
        message: 'Executive Decision Brief approved and digitally signed.'
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Governance Block',
        message: res.reason || 'Failed to authorize.'
      });
    }
    loadData();
  };

  // List of all 15 deterministic scenario names
  const SCENARIOS = [
    'Enrollment Decline',
    'Revenue Shock',
    'Funding Reduction',
    'Workforce Cost Increase',
    'Student Retention Decline',
    'Research Funding Reduction',
    'Major Grant Loss',
    'Cyber Disruption',
    'Critical Vendor Failure',
    'Campus Operations Disruption',
    'International Enrollment Contraction',
    'Major Infrastructure Failure',
    'Regulatory Shock',
    'Multi-Domain Cascade',
    'Compound Institutional Stress'
  ];

  const filteredIndicators = indicators.filter(ind => {
    const matchesDomain = selectedDomain === 'ALL' || ind.domain === selectedDomain;
    const matchesSearch = ind.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ind.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div id="platform-analytics-governance-root" className="bg-[#111422] text-slate-100 min-h-screen font-sans flex flex-col antialiased">
      {/* Executive Header */}
      <header className="border-b border-[#21273d] bg-[#171b30] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono tracking-wider border border-emerald-500/20 uppercase">Phase 9.2</span>
            <span className="text-slate-400 text-xs">GOVERNED INTELLIGENCE LAYER</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">Analytics, Forecasting &amp; Decision Support</h1>
          <p className="text-xs text-slate-400 mt-0.5">Continuous predictive monitoring, early warnings, scenario sandbox, and Four-Eyes decision governance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => { setShowOverrideModal(true); }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            Apply Governance Override
          </button>
          <button 
            onClick={() => { setShowDecisionModal(true); }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Propose Decision Brief
          </button>
          <button 
            onClick={loadData}
            className="p-1.5 rounded-lg border border-[#21273d] hover:bg-[#21273d] transition-all text-slate-300"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-[#21273d] bg-[#141829] px-6 flex flex-wrap gap-1">
        {[
          { id: 'strategy', label: 'Strategic Plan', icon: Target },
          { id: 'indicators', label: 'Indicators & Provenance', icon: Layers },
          { id: 'forecasting', label: 'Predictive & Benchmarks', icon: TrendingUp },
          { id: 'earlywarnings', label: 'Early Warnings', icon: AlertTriangle },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Compass },
          { id: 'decisions', label: 'Decision Briefs', icon: FileCheck },
          { id: 'diagnostics', label: 'Audit & Diagnostics', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? 'border-indigo-500 text-white bg-[#1a1e35]/45' 
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1a1e35]/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'diagnostics' && diagnostics.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold font-mono">
                  {diagnostics.length}
                </span>
              )}
              {tab.id === 'earlywarnings' && warnings.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold font-mono">
                  {warnings.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Body */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* Tab content: STRATEGY */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Strategic Objectives alignment
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Five-Year strategic masterplan mapping out prioritized performance goals, relative weights, and targeted completion windows.
              </p>

              {strategy ? (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-[#111422] rounded-lg border border-[#21273d] flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">{strategy.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Fiscal Period: {strategy.fiscalYear} • Governed Ledger</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-bold">
                      {strategy.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {strategy.objectives.map((obj, idx) => (
                      <div key={obj.id} className="p-4 bg-[#1c213a]/50 rounded-lg border border-[#21273d] hover:border-slate-500/20 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">OBJECTIVE 0{idx + 1}</span>
                            <span className="text-xs font-mono text-slate-400 font-semibold">Weight: {obj.weight}%</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1.5">{obj.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{obj.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#21273d] flex justify-between items-center text-[10px]">
                          <span className="text-slate-400">Target Completion</span>
                          <span className="font-mono text-slate-200 font-semibold">{obj.targetDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">No active strategic template found.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab content: INDICATORS */}
        {activeTab === 'indicators' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter indicators by code/name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="bg-[#111422] border border-[#21273d] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none w-full sm:w-auto"
                >
                  <option value="ALL">All Domains</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="STUDENT_SUCCESS">Student Success</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="RESEARCH">Research</option>
                  <option value="WORKFORCE">Workforce</option>
                  <option value="OPERATIONS">Operations</option>
                  <option value="RISK_RESILIENCE">Risk &amp; Resilience</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c213a] border-b border-[#21273d]">
                      <th className="p-4 text-xs font-semibold text-slate-300">Indicator Code / Name</th>
                      <th className="p-4 text-xs font-semibold text-slate-300">Domain</th>
                      <th className="p-4 text-xs font-semibold text-slate-300">Target</th>
                      <th className="p-4 text-xs font-semibold text-slate-300">Observed Value</th>
                      <th className="p-4 text-xs font-semibold text-slate-300">Sufficiency</th>
                      <th className="p-4 text-xs font-semibold text-slate-300">Data Lineage &amp; Provenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#21273d]">
                    {filteredIndicators.map(ind => {
                      const latestObs = observations.filter(o => o.indicatorCode === ind.code).pop();
                      const target = targets.find(t => t.indicatorCode === ind.code);

                      let sufficiencyBadge = (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20 font-bold uppercase">
                          CALIBRATION REQUIRED
                        </span>
                      );
                      if (latestObs?.dataSufficiency === 'SUFFICIENT') {
                        sufficiencyBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-bold uppercase">
                            SUFFICIENT
                          </span>
                        );
                      } else if (latestObs?.dataSufficiency === 'INSUFFICIENT') {
                        sufficiencyBadge = (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 font-mono border border-rose-500/20 font-bold uppercase">
                            INSUFFICIENT
                          </span>
                        );
                      }

                      return (
                        <tr key={ind.code} className="hover:bg-[#1a1e35]/30 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <span className="font-mono text-xs text-indigo-400 font-semibold">{ind.code}</span>
                                <h4 className="text-xs font-bold text-white mt-0.5">{ind.name}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{ind.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-300">{ind.domain}</td>
                          <td className="p-4 text-xs font-mono font-semibold text-slate-200">
                            {target ? `${target.targetValue}${ind.unit}` : 'Not Defined'}
                          </td>
                          <td className="p-4 text-xs font-mono font-semibold text-white">
                            {latestObs?.value !== undefined ? (
                              <span className="bg-slate-800 px-2 py-1 rounded">
                                {latestObs.value}{ind.unit}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-4">{sufficiencyBadge}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="font-semibold text-slate-300">Method:</span>
                                <span>{ind.calculationMethod}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="font-semibold text-slate-300">Formula:</span>
                                <code className="bg-[#111422] px-1 py-0.5 rounded text-indigo-300 font-mono">{ind.formula}</code>
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="font-semibold text-slate-300">Source:</span>
                                <span>mod_institutional_analytics / observation_registry</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab content: FORECASTING */}
        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Predictive Forecasting &amp; Industry Benchmarking
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic trend forecasting mapping confidence upper/lower limits alongside verified external sector benchmark data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {forecasts.map(fore => {
                  const ind = indicators.find(i => i.code === fore.indicatorCode);
                  const pred = fore.predictions[0];
                  return (
                    <div key={fore.id} className="p-4 bg-[#111422] rounded-xl border border-[#21273d] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{ind?.domain}</span>
                          <h4 className="text-xs font-bold text-white mt-0.5">{ind?.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          fore.confidence === 'HIGH' ? 'bg-emerald-500/10 text-emerald-400' :
                          fore.confidence === 'MEDIUM' ? 'bg-indigo-500/10 text-indigo-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {fore.confidence} CONFIDENCE
                        </span>
                      </div>

                      <div className="p-3 bg-[#171b30] rounded-lg flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400">{pred.period}</span>
                          <div className="text-lg font-bold text-white mt-0.5">{pred.predictedValue}{ind?.unit}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Interval (95%)</span>
                          <div className="text-[11px] font-mono font-semibold text-indigo-300 mt-0.5">
                            {pred.confidenceLowerBound} – {pred.confidenceUpperBound}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#21273d] flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Baseline Sector Avg:</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {ind?.code === 'IND_ACAD_PASS' ? '81.5%' : 
                           ind?.code === 'IND_STUD_RET' ? '85.0%' :
                           ind?.code === 'IND_FIN_LIQ' ? '9.0%' : 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab content: EARLY WARNINGS */}
        {activeTab === 'earlywarnings' && (
          <div className="space-y-6">
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Active Early Warning Radar
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Trigger evaluation logging sudden trend breaks, parameter breaches, and compound cascading stress.
              </p>

              {warnings.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {warnings.map(war => {
                    const ind = indicators.find(i => i.code === war.indicatorCode || `def_ew_${i.code}` === war.definitionId);
                    return (
                      <div key={war.id} className="p-4 bg-[#111422] rounded-xl border border-[#21273d] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-500/20 transition-all">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              war.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {war.severity}
                            </span>
                            <span className="text-xs font-bold text-white">{ind?.name || 'Parameter Deviation Alert'}</span>
                          </div>
                          <p className="text-xs text-slate-400">{war.recommendedResponse}</p>
                          <div className="text-[10px] text-slate-500 flex flex-wrap gap-4 pt-1">
                            <span>Detected: {new Date(war.detectedAt).toLocaleDateString()}</span>
                            <span>Observed Level: <strong className="text-slate-300 font-mono">{war.observedValue}{ind?.unit}</strong></span>
                            <span>Trigger Threshold: <strong className="text-slate-300 font-mono">{war.triggerValue}{ind?.unit}</strong></span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              showNotification({
                                type: 'success',
                                title: 'Response Action Logged',
                                message: `Standard corrective mitigation steps initialized for warning ${war.id}.`
                              });
                              // Mark warning as mitigated in state
                              setWarnings(prev => prev.filter(w => w.id !== war.id));
                            }}
                            className="px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/20 cursor-pointer"
                          >
                            Acknowledge &amp; Mitigate
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  All domain performance metrics within baseline tolerances.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab content: SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            {/* MANDATORY SIMULATION BANNER */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl flex items-center gap-3">
              <Lock className="w-5 h-5 flex-shrink-0" />
              <div>
                <strong className="text-xs uppercase font-mono tracking-wider font-bold">
                  SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
                </strong>
                <p className="text-[10px] text-amber-400/85 mt-0.5">
                  All stress-testing and scenario projections run purely in-memory. Under no circumstance are authoritative live databases impacted.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trigger panel */}
              <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Trigger Stress Scenario
                </h3>
                <p className="text-xs text-slate-400">
                  Select and run any of the 15 compliant stress scenarios to analyze multi-domain degradation and cascading institutional risks.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Select Scenario Modeling Template</label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {SCENARIOS.map(sc => (
                      <option key={sc} value={sc}>{sc}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Play className="w-3.5 h-3.5" />
                  Run Pure Simulation
                </button>
              </div>

              {/* Outcomes Panel */}
              <div className="lg:col-span-2 bg-[#171b30] border border-[#21273d] rounded-xl p-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Simulated Resilience Outcomes
                </h3>
                
                {activeSimulation ? (
                  <div className="mt-4 space-y-4">
                    <div className="p-3.5 bg-[#111422] rounded-lg border border-[#21273d]">
                      <h4 className="text-xs font-bold text-white">{activeSimulation.name} Projections</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{activeSimulation.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1.5">Executed At: {new Date(activeSimulation.runAt).toLocaleTimeString()}</span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                      {activeSimulation.outcomes.map(out => {
                        const ind = indicators.find(i => i.code === out.indicatorCode);
                        const isNeg = out.variancePct < 0;
                        return (
                          <div key={out.indicatorCode} className="p-3 bg-[#1c213a]/40 rounded-lg border border-[#21273d] flex justify-between items-center">
                            <div>
                              <h5 className="text-xs font-bold text-white">{ind?.name}</h5>
                              <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                Baseline: {out.baselineValue}{ind?.unit} → Simulated: {out.simulatedValue}{ind?.unit}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-bold font-mono ${isNeg ? 'text-rose-400' : 'text-emerald-400'}`}>
                                {isNeg ? '' : '+'}{out.variancePct}%
                              </span>
                              <div className="mt-0.5">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                                  out.riskRating === 'STRONG' ? 'bg-emerald-500/10 text-emerald-400' :
                                  out.riskRating === 'ADEQUATE' ? 'bg-indigo-500/10 text-indigo-400' :
                                  out.riskRating === 'VULNERABLE' ? 'bg-amber-500/10 text-amber-400' :
                                  'bg-rose-500/10 text-rose-400'
                                }`}>
                                  {out.riskRating}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
                    <Activity className="w-8 h-8 text-slate-600 mb-3 animate-pulse" />
                    <span>Select a stress template and run simulation to populate model outcome metrics.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab content: DECISIONS */}
        {activeTab === 'decisions' && (
          <div className="space-y-6">
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Executive Decision Brief Governance
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Strategic proposals linked with mathematical proof, requiring strict Four-Eyes Separation of Duties (SoD) sign-offs.
              </p>

              {decisions.length > 0 ? (
                <div className="space-y-4 mt-6">
                  {decisions.map(dec => {
                    const isRequester = dec.requestedByUserIdRef === actorId;
                    const isApproved = dec.status === 'APPROVED';

                    return (
                      <div key={dec.id} className="p-4 bg-[#111422] rounded-xl border border-[#21273d] space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400">PROPOSAL REFERENCE: {dec.id}</span>
                            <h3 className="text-xs font-bold text-white mt-0.5">{dec.title}</h3>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-bold ${
                            isApproved 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                          }`}>
                            {dec.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-3 bg-[#171b30] rounded-lg">
                            <span className="text-[10px] text-slate-400 uppercase font-mono">Decision Question</span>
                            <p className="text-slate-200 mt-1">{dec.decisionQuestion}</p>
                          </div>
                          <div className="p-3 bg-[#171b30] rounded-lg">
                            <span className="text-[10px] text-slate-400 uppercase font-mono">Current Observed State</span>
                            <p className="text-slate-200 mt-1">{dec.currentState}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#21273d] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            <div>Requested By: <strong className="text-slate-300 font-semibold">{dec.requestedByUserIdRef}</strong></div>
                            <div>Submitted At: {new Date(dec.requestedAt).toLocaleString()}</div>
                          </div>

                          {!isApproved && (
                            <div className="flex gap-2">
                              {isRequester && (
                                <span className="text-[10px] text-rose-400 flex items-center gap-1 bg-rose-500/5 px-2 py-1 rounded border border-rose-500/15">
                                  <AlertCircle className="w-3 h-3" />
                                  SOD Enabled: You cannot approve your own proposal
                                </span>
                              )}
                              <button
                                onClick={() => handleApproveDecision(dec.id)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                                  isRequester 
                                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                                disabled={isRequester}
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve &amp; Digitally Sign
                              </button>
                            </div>
                          )}

                          {isApproved && (
                            <div className="p-2.5 bg-emerald-500/5 rounded-lg border border-emerald-500/15 text-[10px] text-slate-400 space-y-1">
                              <div className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Digitally Signed By: {dec.approvals[0]?.approverUserIdRef}
                              </div>
                              <div className="font-mono text-[9px]">Signature: {dec.approvals[0]?.signatureHash}</div>
                              <div>Date: {new Date(dec.approvals[0]?.approvedAt).toLocaleString()}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">No active decision proposals logged. Click Propose Decision Brief above.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab content: DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            {/* System Diagnostics */}
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-400" />
                Governed System Integrity &amp; Diagnostic Logs
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Automated diagnostics checking for target orphan integrity, stale telemetry, override authorization, and Separation of Duties.
              </p>

              {diagnostics.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {diagnostics.map((diag, idx) => (
                    <div key={diag.id || idx} className="p-3.5 bg-[#111422] rounded-lg border border-[#21273d] flex items-start gap-3">
                      {diag.severity === 'ERROR' ? (
                        <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                            diag.severity === 'ERROR' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {diag.severity}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-200">{diag.category}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{diag.description}</p>
                        <span className="text-[9px] text-slate-500 font-mono block mt-1">Reference: {diag.entityRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 flex flex-col items-center justify-center mt-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                  <span>Zero structural diagnostics defects detected in analytics ledger.</span>
                </div>
              )}
            </div>

            {/* Cryptographic Audit Trail */}
            <div className="bg-[#171b30] border border-[#21273d] rounded-xl p-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                SHA-256 Ledger Lineage Audit Trail
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compliant append-only cryptographic event block logs with sequential block hashing.
              </p>

              {auditLogs.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-[#111422] rounded-lg border border-[#21273d] space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-indigo-400 font-bold">{log.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-300">{log.provenanceInfo}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono border-t border-[#21273d]/50 pt-2 text-slate-500">
                        <div>
                          <span>Prev Hash:</span>
                          <span className="text-slate-400 block truncate">{log.previousHash}</span>
                        </div>
                        <div>
                          <span>Block Hash:</span>
                          <span className="text-emerald-400 block truncate">{log.currentHash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">No cryptographic audit events written. Perform actions to generate lineage blocks.</div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: Governance Override */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#171b30] border border-[#21273d] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#21273d] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-400" />
                Apply Governance Override
              </h3>
              <button 
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleApplyOverride} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Indicator Metric</label>
                <select
                  value={overrideIndicator}
                  onChange={(e) => setOverrideIndicator(e.target.value)}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Select Target...</option>
                  {indicators.map(ind => (
                    <option key={ind.code} value={ind.code}>{ind.name} ({ind.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Corrected/Override Value</label>
                <input 
                  type="text" 
                  placeholder="e.g. 88.5"
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Governance Justification</label>
                <textarea 
                  placeholder="Provide mandatory operational or technical audit reason justifying this manual record adjustment..."
                  value={overrideJustification}
                  onChange={(e) => setOverrideJustification(e.target.value)}
                  rows={3}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-indigo-600/10"
              >
                Authorize &amp; Apply Correction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Propose Decision Brief */}
      {showDecisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#171b30] border border-[#21273d] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#21273d] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Propose Executive Decision Brief
              </h3>
              <button 
                onClick={() => setShowDecisionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDecision} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Proposal Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Allocation of Strategic Research Funding Reserves"
                  value={newDecisionTitle}
                  onChange={(e) => setNewDecisionTitle(e.target.value)}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Strategic Core Question</label>
                <input 
                  type="text" 
                  placeholder="e.g. How shall the institute balance research infrastructure deficits?"
                  value={newDecisionQuestion}
                  onChange={(e) => setNewDecisionQuestion(e.target.value)}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Current Observed State &amp; Deviation</label>
                <textarea 
                  placeholder="Detail current observed performance levels and early warning deviations..."
                  value={newDecisionState}
                  onChange={(e) => setNewDecisionState(e.target.value)}
                  rows={2}
                  className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Alternative Action</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Action Plan Alpha"
                    value={newDecisionAlt}
                    onChange={(e) => setNewDecisionAlt(e.target.value)}
                    className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400">Cost (INR)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5000000"
                    value={newDecisionAltCost}
                    onChange={(e) => setNewDecisionAltCost(e.target.value)}
                    className="w-full bg-[#111422] border border-[#21273d] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-600/10"
              >
                Submit Strategic Brief Proposal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
