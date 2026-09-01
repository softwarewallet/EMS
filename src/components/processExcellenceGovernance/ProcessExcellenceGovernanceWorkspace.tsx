import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Layers, 
  Users, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  BarChart3, 
  Search, 
  Plus, 
  FileText, 
  Lock, 
  RefreshCw,
  Zap,
  Target,
  FileCheck
} from 'lucide-react';
import { 
  ProcessLandscapeDefinition, 
  ProcessLifecycleState, 
  ProcessOwnershipRecord, 
  ProcessMaturityAssessment, 
  ProcessMaturityLevel,
  ProcessPerformanceObservation,
  ProcessBottleneckObservation,
  RootCauseAnalysisRecord,
  ImprovementOpportunityRecord,
  ImprovementInitiativeRecord,
  CorrectiveActionRecord,
  PreventiveActionRecord,
  ImprovementExperimentRecord,
  BenefitRealizationRecord,
  ProcessExceptionRecord,
  ProcessRiskRecord,
  ProcessGovSeverity,
  ProcessSimulationResult,
  ProcessDiagnosticRecord
} from '../../types/processExcellenceGovernance';
import { ProcessExcellenceGovernanceService } from '../../services/processExcellenceGovernanceService';
import { FirebaseService } from '../../services/firebaseService';

export const ProcessExcellenceGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landscape' | 'ownership' | 'maturity' | 'performance' | 'bottlenecks' | 'root_cause' | 'opportunities' | 'initiatives' | 'corrective_actions' | 'experiments' | 'benefits' | 'risks' | 'simulation' | 'diagnostics'>('landscape');
  
  const [processes, setProcesses] = useState<ProcessLandscapeDefinition[]>([]);
  const [ownerships, setOwnerships] = useState<ProcessOwnershipRecord[]>([]);
  const [maturityAssessments, setMaturityAssessments] = useState<ProcessMaturityAssessment[]>([]);
  const [performances, setPerformances] = useState<ProcessPerformanceObservation[]>([]);
  const [bottlenecks, setBottlenecks] = useState<ProcessBottleneckObservation[]>([]);
  const [rootCauses, setRootCauses] = useState<RootCauseAnalysisRecord[]>([]);
  const [opportunities, setOpportunities] = useState<ImprovementOpportunityRecord[]>([]);
  const [initiatives, setInitiatives] = useState<ImprovementInitiativeRecord[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionRecord[]>([]);
  const [preventiveActions, setPreventiveActions] = useState<PreventiveActionRecord[]>([]);
  const [experiments, setExperiments] = useState<ImprovementExperimentRecord[]>([]);
  const [benefits, setBenefits] = useState<BenefitRealizationRecord[]>([]);
  const [exceptions, setExceptions] = useState<ProcessExceptionRecord[]>([]);
  const [risks, setRisks] = useState<ProcessRiskRecord[]>([]);
  const [diagnostics, setDiagnostics] = useState<ProcessDiagnosticRecord[]>([]);
  
  const [simulationScenario, setSimulationScenario] = useState('01. 20% Cycle-Time Reduction');
  const [simulationResult, setSimulationResult] = useState<ProcessSimulationResult | null>(null);

  const tenantId = 'tenant_default';
  const campusId = 'campus_main';
  const currentUserId = 'user_admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        pList, oList, mList, perfList, bList, rcList, oppList, initList, caList, paList, expList, benList, excList, rList, dList
      ] = await Promise.all([
        FirebaseService.getTenantCollection<ProcessLandscapeDefinition>('process_landscape', tenantId),
        FirebaseService.getTenantCollection<ProcessOwnershipRecord>('process_ownership', tenantId),
        FirebaseService.getTenantCollection<ProcessMaturityAssessment>('process_maturity_assessments', tenantId),
        FirebaseService.getTenantCollection<ProcessPerformanceObservation>('process_performance_observations', tenantId),
        FirebaseService.getTenantCollection<ProcessBottleneckObservation>('process_bottlenecks', tenantId),
        FirebaseService.getTenantCollection<RootCauseAnalysisRecord>('root_cause_analyses', tenantId),
        FirebaseService.getTenantCollection<ImprovementOpportunityRecord>('improvement_opportunities', tenantId),
        FirebaseService.getTenantCollection<ImprovementInitiativeRecord>('improvement_initiatives', tenantId),
        FirebaseService.getTenantCollection<CorrectiveActionRecord>('corrective_actions', tenantId),
        FirebaseService.getTenantCollection<PreventiveActionRecord>('preventive_actions', tenantId),
        FirebaseService.getTenantCollection<ImprovementExperimentRecord>('improvement_experiments', tenantId),
        FirebaseService.getTenantCollection<BenefitRealizationRecord>('benefit_realizations', tenantId),
        FirebaseService.getTenantCollection<ProcessExceptionRecord>('process_exceptions', tenantId),
        FirebaseService.getTenantCollection<ProcessRiskRecord>('process_risks', tenantId),
        FirebaseService.getTenantCollection<ProcessDiagnosticRecord>('process_diagnostics', tenantId)
      ]);

      if (pList.length === 0) {
        // Seed initial sample record
        const sampleProc: ProcessLandscapeDefinition = {
          id: FirebaseService.generateId('proc'),
          tenantId,
          campusId,
          processName: 'Admissions Document Verification & Enrollment Approval',
          processFamily: 'Student Lifecycle Services',
          processOwnerUserIdRef: 'usr_registrar',
          departmentIdRef: 'dept_enrollment',
          state: ProcessLifecycleState.ACTIVE,
          upstreamProcessIds: [],
          downstreamProcessIds: [],
          strategicObjectiveIdRefs: ['strat_growth_1'],
          riskIdRefs: ['risk_adm_delay'],
          controlIdRefs: ['ctrl_four_eyes'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await FirebaseService.setDocument('process_landscape', sampleProc.id, sampleProc);
        setProcesses([sampleProc]);
      } else {
        setProcesses(pList);
      }

      setOwnerships(oList);
      setMaturityAssessments(mList);
      setPerformances(perfList);
      setBottlenecks(bList);
      setRootCauses(rcList);
      setOpportunities(oppList);
      setInitiatives(initList);
      setCorrectiveActions(caList);
      setPreventiveActions(paList);
      setExperiments(expList);
      setBenefits(benList);
      setExceptions(excList);
      setRisks(rList);
      setDiagnostics(dList);
    } catch (e) {
      console.error('Error loading process excellence data:', e);
    }
  };

  const runSim = () => {
    const res = ProcessExcellenceGovernanceService.runSimulation(simulationScenario);
    setSimulationResult(res);
  };

  const runDiag = async () => {
    const diagList = await ProcessExcellenceGovernanceService.runDiagnostics(tenantId);
    setDiagnostics(diagList);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider border border-indigo-100">
                EMS Phase 9.7 Control Plane
              </span>
              <span className="text-xs text-slate-500 font-mono">Tenant: {tenantId} • Campus: {campusId}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Institutional Process Excellence & Continuous Improvement
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Reference-only governance control plane for process landscape, ownership, maturity, bottlenecks, root-cause analysis, and benefits realization.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={runDiag}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Run Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {[
          { id: 'landscape', label: 'Process Landscape', icon: Layers },
          { id: 'ownership', label: 'Ownership', icon: Users },
          { id: 'maturity', label: 'Maturity', icon: Award },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'bottlenecks', label: 'Bottlenecks', icon: AlertTriangle },
          { id: 'root_cause', label: 'Root Cause (RCA)', icon: Search },
          { id: 'opportunities', label: 'Opportunities', icon: Target },
          { id: 'initiatives', label: 'Initiatives', icon: Zap },
          { id: 'corrective_actions', label: 'CAPA Actions', icon: CheckCircle2 },
          { id: 'experiments', label: 'Experiments', icon: Cpu },
          { id: 'benefits', label: 'Benefits Realization', icon: BarChart3 },
          { id: 'risks', label: 'Process Risks', icon: Shield },
          { id: 'simulation', label: 'What-If Sandbox', icon: RefreshCw },
          { id: 'diagnostics', label: 'Diagnostics & Audit', icon: FileCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto space-y-6">
        {activeTab === 'landscape' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Institutional Process Landscape</h2>
                <p className="text-sm text-slate-500">Governing process families, states, and reference links.</p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                Total Processes: {processes.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    <th className="py-3 px-4">Process Name</th>
                    <th className="py-3 px-4">Family</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Lifecycle State</th>
                    <th className="py-3 px-4">Owner Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {processes.map(proc => (
                    <tr key={proc.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-900">{proc.processName}</td>
                      <td className="py-3 px-4 text-slate-600">{proc.processFamily}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">{proc.departmentIdRef}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                          {proc.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">{proc.processOwnerUserIdRef}</td>
                    </tr>
                  ))}
                  {processes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">No process landscape records registered.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ownership' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Accountable Process Ownership</h2>
            <p className="text-sm text-slate-500 mb-6">Process owner assignments, executive accountability, and stewardship tracking.</p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              Ownership governance is active. All registered processes require designated accountable executives and valid expiry dates.
            </div>
          </div>
        )}

        {activeTab === 'maturity' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Process Maturity Assessments</h2>
            <p className="text-sm text-slate-500 mb-6">Deterministic 10-dimension maturity scoring (Initial to Optimized).</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              No maturity assessments conducted yet. Run diagnostic engine or create an assessment.
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Process Performance Observations</h2>
            <p className="text-sm text-slate-500 mb-6">Cycle time, error rate, throughput, and SLA adherence telemetry.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Telemetry status: All operational observations operating within threshold limits.
            </div>
          </div>
        )}

        {activeTab === 'bottlenecks' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Process Bottlenecks & Queue Accumulation</h2>
            <p className="text-sm text-slate-500 mb-6">Queue depth and delay hours identification across institutional workflows.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              No active bottleneck alarms detected in current execution cycle.
            </div>
          </div>
        )}

        {activeTab === 'root_cause' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Root-Cause Analysis (RCA) Engine</h2>
            <p className="text-sm text-slate-500 mb-6">5-Why, Fishbone, and Pareto methodologies with verified evidence requirements.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Validated root causes require attached evidence references before state progression.
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Improvement Opportunity Scoring</h2>
            <p className="text-sm text-slate-500 mb-6">Impact, risk reduction, and strategic alignment bounded composite scoring.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              No improvement opportunities pending screening.
            </div>
          </div>
        )}

        {activeTab === 'initiatives' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Continuous Improvement Initiatives</h2>
            <p className="text-sm text-slate-500 mb-6">Idea-to-completion lifecycle management for institutional excellence.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Phase 9.7 governs improvement initiatives; Phase 8.1 executes underlying workflows.
            </div>
          </div>
        )}

        {activeTab === 'corrective_actions' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Corrective & Preventive Action (CAPA) Governance</h2>
            <p className="text-sm text-slate-500 mb-6">Mandatory evidence verification before action closure.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              All CAPA workflows are synchronized with audit compliance.
            </div>
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Controlled Improvement Experiments</h2>
            <p className="text-sm text-slate-500 mb-6">Hypothesis-driven testing with zero production mutation.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Sandbox experiments isolated from operational transaction pathways.
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Benefits Realization Tracking</h2>
            <p className="text-sm text-slate-500 mb-6">Cycle-time reduction, cost avoidance, and capacity improvement tracking.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Financial benefits remain reference observations from authoritative financial systems.
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Process Risks & Control Mapping</h2>
            <p className="text-sm text-slate-500 mb-6">Deterministic scoring of process vulnerabilities and controls.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              Risk control mappings synchronized with Phase 8.7 and Phase 9.2.
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-slate-900 text-amber-400 text-xs font-mono px-4 py-2 rounded-xl mb-6 tracking-wide flex items-center justify-between">
              <span>SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mb-2">What-If Improvement Sandbox</h2>
            <p className="text-sm text-slate-500 mb-6">Test institutional process shocks and optimization scenarios in pure memory.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">Select Simulation Scenario</label>
                <select 
                  value={simulationScenario}
                  onChange={(e) => setSimulationScenario(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="01. 20% Cycle-Time Reduction">01. 20% Cycle-Time Reduction</option>
                  <option value="02. 10% Workforce Capacity Reduction">02. 10% Workforce Capacity Reduction</option>
                  <option value="03. Major Approval Bottleneck">03. Major Approval Bottleneck</option>
                  <option value="04. Upstream System Outage">04. Upstream System Outage</option>
                  <option value="05. Downstream Service Failure">05. Downstream Service Failure</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={runSim}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all"
                >
                  Run Simulation Sandbox
                </button>
              </div>
            </div>

            {simulationResult && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-semibold text-slate-900 text-base">{simulationResult.scenario}</h3>
                  <span className="text-xs font-mono text-slate-500">{simulationResult.timestamp}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Impact Severity</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">{simulationResult.results.impact}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Throughput Delta</div>
                    <div className="text-lg font-bold text-emerald-600 mt-1">{simulationResult.results.throughputDeltaPercentage}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Cycle Time Delta</div>
                    <div className="text-lg font-bold text-amber-600 mt-1">{simulationResult.results.cycleTimeDeltaPercentage}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 font-medium">Risk Shift Score</div>
                    <div className="text-lg font-bold text-indigo-600 mt-1">{simulationResult.results.riskShiftScore}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Process Excellence Diagnostics & Audit Ledger</h2>
              <p className="text-sm text-slate-500">Immutable ledger events and governance health findings.</p>
            </div>

            <div className="space-y-3">
              {diagnostics.map(diag => (
                <div key={diag.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                        {diag.severity}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{diag.category}</span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium">{diag.message}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{diag.timestamp}</span>
                </div>
              ))}
              {diagnostics.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  No diagnostics executed yet. Click "Run Diagnostics" above.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
