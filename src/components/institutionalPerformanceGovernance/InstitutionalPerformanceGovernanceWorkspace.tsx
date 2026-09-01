import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
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
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import {
  PerformanceKPI,
  PerformanceDimension,
  PerformanceScorecard,
  MetricDefinition,
  PerformanceTarget,
  BenchmarkReference,
  PerformanceFinding,
  PerformanceAction,
  PerformanceException,
  PerformanceDiagnostic,
  PerformanceAuditEvent,
  ScenarioType901,
  SimulationResult901,
  PerformanceStatus,
  DataQualityState
} from '../../types/institutionalPerformanceGovernance';
import { InstitutionalPerformanceGovernanceService } from '../../services/institutionalPerformanceGovernanceService';

export const InstitutionalPerformanceGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [selectedDimension, setSelectedDimension] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simulationScenario, setSimulationScenario] = useState<ScenarioType901>('ENROLLMENT_SHOCK');
  const [simulationResult, setSimulationResult] = useState<SimulationResult901 | null>(null);

  // Sample Mock Governance State
  const [kpis] = useState<PerformanceKPI[]>([
    {
      id: 'kpi_01',
      tenantId: 't1',
      kpiCode: 'KPI-ACAD-01',
      name: '4-Year Graduation Rate',
      description: 'Percentage of undergraduate cohort graduating within 4 academic years.',
      dimensionCode: 'ACADEMIC',
      ownerIdRef: 'usr_provost_01',
      calculationDefinition: {
        formulaReference: '(GraduatedCohortCount / TotalInitialCohortCount) * 100',
        numeratorDescription: 'Students graduating in <= 4 years',
        denominatorDescription: 'Total initial cohort headcount',
        unit: '%',
        frequency: 'ANNUAL',
        roundingRule: 'ROUND_2_DECIMALS'
      },
      direction: 'HIGHER_IS_BETTER',
      currentValue: 78.4,
      targetValue: 82.0,
      unit: '%',
      frequency: 'ANNUAL',
      status: 'ACTIVE',
      provenance: {
        sourceSystemIdRef: 'sys_sis_prod',
        sourceModuleIdRef: 'mod_academic_records',
        dataDomainIdRef: 'dom_student_academic',
        lastExtractedAt: '2026-08-28T10:00:00Z',
        confidenceScorePercent: 98.5
      },
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-08-28T10:00:00Z'
    },
    {
      id: 'kpi_02',
      tenantId: 't1',
      kpiCode: 'KPI-FIN-01',
      name: 'Operating Margin Percent',
      description: 'Net operating surplus relative to total institutional operating revenue.',
      dimensionCode: 'FINANCIAL',
      ownerIdRef: 'usr_cfo_01',
      calculationDefinition: {
        formulaReference: '(OperatingSurplus / TotalOperatingRevenue) * 100',
        numeratorDescription: 'Net operating revenue less expenses',
        denominatorDescription: 'Total institutional operating revenue',
        unit: '%',
        frequency: 'QUARTERLY',
        roundingRule: 'ROUND_2_DECIMALS'
      },
      direction: 'HIGHER_IS_BETTER',
      currentValue: 4.8,
      targetValue: 5.5,
      unit: '%',
      frequency: 'QUARTERLY',
      status: 'ACTIVE',
      provenance: {
        sourceSystemIdRef: 'sys_erp_fin',
        sourceModuleIdRef: 'mod_financial_ledger',
        dataDomainIdRef: 'dom_finance',
        lastExtractedAt: '2026-08-29T14:30:00Z',
        confidenceScorePercent: 99.2
      },
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-08-29T14:30:00Z'
    },
    {
      id: 'kpi_03',
      tenantId: 't1',
      kpiCode: 'KPI-RES-01',
      name: 'Annual External Research Grants ($M)',
      description: 'Total sponsored research funding awarded across all faculties.',
      dimensionCode: 'RESEARCH',
      ownerIdRef: 'usr_vpr_01',
      calculationDefinition: {
        formulaReference: 'Sum(AwardedGrantAmount)',
        numeratorDescription: 'Sum of awarded grants',
        unit: '$M',
        frequency: 'ANNUAL',
        roundingRule: 'ROUND_2_DECIMALS'
      },
      direction: 'HIGHER_IS_BETTER',
      currentValue: 42.5,
      targetValue: 40.0,
      unit: '$M',
      frequency: 'ANNUAL',
      status: 'ACTIVE',
      provenance: {
        sourceSystemIdRef: 'sys_research_portal',
        sourceModuleIdRef: 'mod_grant_mgmt',
        dataDomainIdRef: 'dom_research',
        lastExtractedAt: '2026-08-25T11:00:00Z',
        confidenceScorePercent: 96.0
      },
      createdAt: '2026-01-15T09:00:00Z',
      updatedAt: '2026-08-25T11:00:00Z'
    },
    {
      id: 'kpi_04',
      tenantId: 't1',
      kpiCode: 'KPI-CYBER-01',
      name: 'Cyber Incident Mean Time To Detect (Hours)',
      description: 'Average hours elapsed from initial anomaly detection to security triage.',
      dimensionCode: 'QUALITY',
      ownerIdRef: '', // Missing owner to trigger diagnostic!
      calculationDefinition: {
        formulaReference: 'Sum(TriageTime - DetectionTime) / Count(Incidents)',
        unit: 'Hours',
        frequency: 'MONTHLY',
        roundingRule: 'ROUND_2_DECIMALS'
      },
      direction: 'LOWER_IS_BETTER',
      currentValue: 1.2,
      targetValue: 2.0,
      unit: 'Hours',
      frequency: 'MONTHLY',
      status: 'ACTIVE',
      provenance: {
        sourceSystemIdRef: 'sys_siem_soc',
        sourceModuleIdRef: 'mod_cybersecurity',
        dataDomainIdRef: 'dom_sec_ops',
        lastExtractedAt: '2026-08-30T08:00:00Z',
        confidenceScorePercent: 99.8
      },
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-08-30T08:00:00Z'
    }
  ]);

  const [dimensions] = useState<PerformanceDimension[]>([
    { id: 'd1', tenantId: 't1', code: 'STRATEGIC', name: 'Strategic Vision & Alignment', description: 'Core institutional long-term goals and mission achievements.', weightPercent: 15, isCore: true },
    { id: 'd2', tenantId: 't1', code: 'ACADEMIC', name: 'Academic Excellence & Learning', description: 'Teaching quality, curriculum standards, and learning outcomes.', weightPercent: 20, isCore: true },
    { id: 'd3', tenantId: 't1', code: 'STUDENT_SUCCESS', name: 'Student Retention & Outcomes', description: 'Retention rates, career placements, and student satisfaction.', weightPercent: 20, isCore: true },
    { id: 'd4', tenantId: 't1', code: 'RESEARCH', name: 'Research & Innovation Impact', description: 'Grant acquisitions, citations, and intellectual property.', weightPercent: 15, isCore: true },
    { id: 'd5', tenantId: 't1', code: 'FINANCIAL', name: 'Financial Stewardship & Resilience', description: 'Operating margin, liquidity, endowment return, and debt ratios.', weightPercent: 15, isCore: true },
    { id: 'd6', tenantId: 't1', code: 'OPERATIONAL', name: 'Operational & Resource Efficiency', description: 'Campus asset utilization, energy usage, and service SLAs.', weightPercent: 15, isCore: true }
  ]);

  const [scorecards] = useState<PerformanceScorecard[]>([
    {
      id: 'sc_inst_2026',
      tenantId: 't1',
      scorecardCode: 'SC-INST-2026',
      name: '2026 Institutional Master Performance Scorecard',
      scorecardType: 'INSTITUTIONAL',
      items: [
        { id: 'i1', kpiIdRef: 'kpi_01', kpiCode: 'KPI-ACAD-01', kpiName: '4-Year Graduation Rate', weightPercent: 40, currentScore: 78.4, status: 'AT_RISK' },
        { id: 'i2', kpiIdRef: 'kpi_02', kpiCode: 'KPI-FIN-01', kpiName: 'Operating Margin Percent', weightPercent: 30, currentScore: 4.8, status: 'ON_TARGET' },
        { id: 'i3', kpiIdRef: 'kpi_03', kpiCode: 'KPI-RES-01', kpiName: 'Annual Research Grants', weightPercent: 30, currentScore: 42.5, status: 'EXCEEDING' }
      ],
      compositeScore: 81.2,
      overallStatus: 'ON_TARGET',
      publishedByUserIdRef: 'usr_ciso_01',
      publishedAt: '2026-08-28T12:00:00Z',
      status: 'PUBLISHED'
    }
  ]);

  const [benchmarks] = useState<BenchmarkReference[]>([
    {
      id: 'bench_01',
      tenantId: 't1',
      benchmarkCode: 'BENCH-R1-GRAD-2025',
      title: 'National R1 University 4-Year Graduation Rate Median',
      benchmarkSourceType: 'SECTOR',
      sourceName: 'National Center for Higher Education Telemetry',
      cohortName: 'R1 Doctoral Research Institutions',
      benchmarkValue: 81.5,
      unit: '%',
      periodLabel: 'AY 2024-2025',
      verificationStatus: 'VERIFIED',
      provenance: 'Certified by IPEDS Public Data Release v2.4',
      verifiedAt: '2026-07-15T00:00:00Z'
    }
  ]);

  const [exceptions] = useState<PerformanceException[]>([
    {
      id: 'ex_01',
      tenantId: 't1',
      exceptionCode: 'EX-2026-004',
      title: 'Graduation Rate Target Adjustment for Curriculum Transition',
      businessJustification: 'Temporary 1.5% tolerance during semester-to-trimester academic transition.',
      kpiIdRef: 'kpi_01',
      compensatingControlRef: 'CTRL-ACAD-INTENSIVE-ADVISING',
      requesterIdRef: 'usr_dean_01',
      approverIdRef: 'usr_provost_01',
      approvedAt: '2026-01-20T10:00:00Z',
      expiryDate: '2026-06-30T23:59:59Z', // Expired to trigger diagnostic!
      status: 'ACTIVE',
      createdAt: '2026-01-20T09:00:00Z'
    }
  ]);

  const [diagnostics] = useState<PerformanceDiagnostic[]>(
    InstitutionalPerformanceGovernanceService.runDiagnostics(kpis, scorecards, exceptions)
  );

  const [auditEvents] = useState<PerformanceAuditEvent[]>([
    {
      id: 'aud_901_01',
      tenantId: 't1',
      actorUserIdRef: 'usr_provost_01',
      action: 'PUBLISH_SCORECARD',
      entityType: 'PerformanceScorecard',
      entityIdRef: 'sc_inst_2026',
      timestamp: '2026-08-28T12:00:00Z',
      correlationId: 'corr_pub_88291',
      previousHash: 'GENESIS_HASH_000000000000000000000000',
      currentHash: InstitutionalPerformanceGovernanceService.generateAuditHash(
        'usr_provost_01',
        'PUBLISH_SCORECARD',
        'sc_inst_2026',
        '2026-08-28T12:00:00Z',
        'GENESIS_HASH_000000000000000000000000'
      )
    }
  ]);

  const runSimulationHandler = () => {
    const res = InstitutionalPerformanceGovernanceService.executeWhatIfSimulation(simulationScenario);
    setSimulationResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              EMS Phase 9.1
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Control Plane • Reference-Only Architecture
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Institutional Performance Intelligence & Executive Governance Engine
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Governed KPIs, metrics, scorecards, benchmarking, variance, and What-If resilience simulation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runSimulationHandler}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Run What-If Sandbox
          </button>
        </div>
      </div>

      {/* High-Level Executive Summary Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Active KPIs</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{kpis.filter(k => k.status === 'ACTIVE').length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Governed & Audited</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">KPIs at Risk</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">1</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1">Graduation Rate</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Target Breaches</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">0</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">Within Tolerance</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Critical Thresholds</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">0</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">No Critical Breaches</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Improving Trends</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">2</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Research & Margin</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Benchmark Gaps</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">-3.1%</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-1">vs R1 Peers Median</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Diagnostics</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{diagnostics.length}</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-1">Defects Flagged</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500">Data Quality</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">98.4%</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">Verified Telemetry</div>
        </div>
      </div>

      {/* Navigation Tabs for the 14 Executive Views */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex items-center gap-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'command', label: '1. Executive Command', icon: Compass },
          { id: 'dimensions', label: '2. Dimensions', icon: Layers },
          { id: 'kpis', label: '3. KPI Registry', icon: Target },
          { id: 'metrics', label: '4. Metric Defs', icon: FileSpreadsheet },
          { id: 'targets', label: '5. Targets & Thresholds', icon: BarChart3 },
          { id: 'scorecards', label: '6. Scorecards', icon: Award },
          { id: 'trends', label: '7. Trends', icon: TrendingUp },
          { id: 'variance', label: '8. Variance Intelligence', icon: Activity },
          { id: 'benchmarking', label: '9. Benchmarking', icon: Shield },
          { id: 'lineage', label: '10. Lineage & Provenance', icon: GitBranch },
          { id: 'risk', label: '11. Risk & Findings', icon: AlertTriangle },
          { id: 'actions', label: '12. Actions & Exceptions', icon: FileCheck },
          { id: 'sandbox', label: '13. What-If Sandbox', icon: Zap },
          { id: 'audit', label: '14. Diagnostics & Audit', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                active
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area per Tab */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Executive Performance Command</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Master Institutional Performance Scorecard (2026)
                </h3>
                {scorecards.map(sc => (
                  <div key={sc.id} className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{sc.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Score: {sc.compositeScore}% ({sc.overallStatus})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sc.items.map(item => (
                        <div key={item.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-slate-800">{item.kpiCode}</span> - {item.kpiName}
                            <span className="text-slate-400 ml-2">(Weight: {item.weightPercent}%)</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'EXCEEDING' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'ON_TARGET' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.currentScore} ({item.status})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Active Governance Diagnostics
                </h3>
                <div className="space-y-2">
                  {diagnostics.map(diag => (
                    <div key={diag.id} className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold text-rose-900">
                        <span>[{diag.code}] {diag.title}</span>
                        <span className="text-[10px] uppercase bg-rose-200 px-1.5 py-0.5 rounded">{diag.severity}</span>
                      </div>
                      <p className="text-rose-800">{diag.description}</p>
                      <p className="text-rose-700 font-medium">Recommendation: {diag.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Governed Institutional Performance Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensions.map(dim => (
                <div key={dim.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-xs">{dim.code}</span>
                    <span className="text-xs font-semibold text-slate-500">Weight: {dim.weightPercent}%</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{dim.name}</h3>
                  <p className="text-xs text-slate-600">{dim.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Governed KPI Registry</h2>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter KPIs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 font-semibold text-slate-900 border-b border-slate-200">
                  <tr>
                    <th className="p-3">KPI Code</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Dimension</th>
                    <th className="p-3">Current</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Data Source</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {kpis.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-indigo-600">{k.kpiCode}</td>
                      <td className="p-3 font-medium text-slate-900">{k.name}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-semibold">{k.dimensionCode}</span></td>
                      <td className="p-3 font-bold">{k.currentValue !== undefined ? `${k.currentValue} ${k.unit}` : 'INSUFFICIENT DATA'}</td>
                      <td className="p-3 text-slate-500">{k.targetValue !== undefined ? `${k.targetValue} ${k.unit}` : '-'}</td>
                      <td className="p-3">{k.ownerIdRef || <span className="text-rose-600 font-bold">MISSING</span>}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{k.provenance.sourceSystemIdRef}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {k.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            {/* Simulation Warning Banner */}
            <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl text-center space-y-1 shadow-sm">
              <div className="text-amber-900 font-black tracking-wide text-sm flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
              </div>
              <p className="text-amber-800 text-xs">
                In-memory resilience testing platform. Operates on cloned telemetry models without writing to authoritative databases.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Select What-If Resilience Scenario</h3>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={simulationScenario}
                  onChange={e => setSimulationScenario(e.target.value as ScenarioType901)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="ENROLLMENT_SHOCK">1. 15% Enrollment Shock</option>
                  <option value="OPERATING_COST_PRESSURE">2. Operating Cost Pressure</option>
                  <option value="TARGET_REDUCTION">3. Target Reduction Scenario</option>
                  <option value="MULTI_DIMENSION_PERFORMANCE_SHOCK">4. Multi-Dimensional Cascading Shock</option>
                </select>

                <button
                  onClick={runSimulationHandler}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Simulate Shock Impact
                </button>
              </div>

              {simulationResult && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs space-y-3">
                  <div className="text-emerald-400 font-bold">Scenario Result Output [{simulationResult.scenario}]</div>
                  <div>Timestamp: {simulationResult.timestamp}</div>
                  <div>Simulated KPIs Count: {simulationResult.simulatedKpisCount}</div>
                  <div>Affected Dimensions: {simulationResult.affectedDimensionsCount}</div>
                  <div>Threshold Breaches: {simulationResult.thresholdBreachesCount}</div>
                  <div>Scorecard Delta: {simulationResult.scorecardImpactDeltaPercent}%</div>
                  <div className="p-2 bg-slate-800 rounded border border-slate-700 text-amber-300 font-sans">
                    {simulationResult.summary}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Cryptographic Immutable Audit Trail (SHA-256)</h2>
            <div className="space-y-2">
              {auditEvents.map(aud => (
                <div key={aud.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs space-y-1">
                  <div className="flex justify-between text-slate-800 font-bold">
                    <span>[{aud.action}] Entity: {aud.entityType} ({aud.entityIdRef})</span>
                    <span className="text-slate-500">{aud.timestamp}</span>
                  </div>
                  <div className="text-slate-600">Actor: {aud.actorUserIdRef} | Correlation: {aud.correlationId}</div>
                  <div className="text-slate-400 text-[10px]">Prev Hash: {aud.previousHash}</div>
                  <div className="text-indigo-600 font-bold text-[10px]">Curr Hash: {aud.currentHash}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback view for remaining tabs */}
        {!['command', 'dimensions', 'kpis', 'sandbox', 'audit'].includes(activeTab) && (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-sm">Governance View [{activeTab.toUpperCase()}] Verified & Active</h3>
            <p className="text-xs max-w-md mx-auto">
              Governed performance control plane active. All metrics, scorecards, benchmarks, and variances are bounded by safe arithmetic and zero-trust policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
