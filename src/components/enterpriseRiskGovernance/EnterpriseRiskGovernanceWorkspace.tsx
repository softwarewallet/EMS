// Institutional Enterprise Risk Management, Risk Intelligence, GRC Integration & Strategic Risk Governance Engine Workspace (Phase 7.72)

import React, { useState } from 'react';
import {
  ShieldAlert, Activity, AlertTriangle, Play, CheckCircle2, Lock, Server, FileText, Users, Building,
  Radio, Cpu, Layers, Search, Plus, RefreshCw, Compass, Zap, CheckSquare, TrendingUp, Sliders, Target, Eye
} from 'lucide-react';
import { Badge } from '../common/Badge';
import {
  EnterpriseRiskRecord, EnterpriseRiskAppetiteFramework, EnterpriseKRI, RiskControlMapping, RiskMitigationPlan,
  EmergingRiskObservation, RiskAcceptanceRecord, ExecutiveRiskDecision, ERMDiagnosticFinding, ERMSimulationScenario, ERMSimulationResult
} from '../../types/enterpriseRiskGovernance';
import { EnterpriseRiskGovernanceService } from '../../services/enterpriseRiskGovernanceService';

export const EnterpriseRiskGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'command' | 'register' | 'heatmap' | 'appetite' | 'kri' | 'controls' | 'mitigation' | 'interdependencies' |
    'emerging' | 'cross_campus' | 'strategic' | 'operational' | 'executive' | 'forecast' | 'sandbox' | 'diagnostics' | 'audit'
  >('command');

  const tenantId = 'tenant_demo_01';
  const campusId = 'campus_main_01';

  const [risks] = useState<EnterpriseRiskRecord[]>([
    {
      id: 'risk_01',
      tenantId,
      campusIdRef: campusId,
      title: 'Advanced Persistent Threat (APT) Data Breach',
      statement: 'Risk of a sophisticated cyberattack leading to mass exfiltration of PII and research data.',
      cause: 'Unpatched legacy systems and social engineering.',
      event: 'Unauthorized access and data exfiltration.',
      consequence: 'Regulatory fines, reputational damage, and loss of IP.',
      category: 'CYBERSECURITY',
      subcategory: 'Data Privacy',
      ownerIdRef: 'usr_ciso_01',
      accountableExecutiveIdRef: 'usr_cio_01',
      inherentLikelihood: 4,
      inherentImpact: 5,
      inherentRiskScore: 20,
      controlEffectiveness: 65,
      residualLikelihood: 3,
      residualImpact: 4,
      residualRiskScore: 12,
      riskVelocity: 'RAPID',
      riskExposure: 15000000,
      appetiteState: 'OUTSIDE_TOLERANCE',
      treatmentStrategy: 'MITIGATE',
      monitoringFrequency: 'DAILY',
      status: 'MITIGATION_ACTIVE',
      lastReviewedAt: '2026-08-01',
      nextReviewAt: '2026-09-01'
    },
    {
      id: 'risk_02',
      tenantId,
      campusIdRef: campusId,
      title: 'International Student Enrollment Decline',
      statement: 'Risk of significant drop in international enrollments due to geopolitical shifts.',
      cause: 'Changes in visa policies or international sanctions.',
      event: 'Reduction in applications and matriculation.',
      consequence: 'Severe revenue shortfall and budget deficits.',
      category: 'STRATEGIC',
      subcategory: 'Enrollment',
      ownerIdRef: 'usr_enrollment_dir',
      accountableExecutiveIdRef: 'usr_provost',
      inherentLikelihood: 3,
      inherentImpact: 5,
      inherentRiskScore: 15,
      controlEffectiveness: 40,
      residualLikelihood: 3,
      residualImpact: 4,
      residualRiskScore: 12,
      riskVelocity: 'MODERATE',
      riskExposure: 22000000,
      appetiteState: 'NEAR_TOLERANCE',
      treatmentStrategy: 'MITIGATE',
      monitoringFrequency: 'MONTHLY',
      status: 'MONITORING',
      lastReviewedAt: '2026-07-15',
      nextReviewAt: '2026-10-15'
    }
  ]);

  const [kris] = useState<EnterpriseKRI[]>([
    {
      id: 'kri_01',
      tenantId,
      riskIdRef: 'risk_01',
      name: 'Unpatched Critical Vulnerabilities (Days)',
      definition: 'Average time to patch critical severity CVEs on internet-facing assets.',
      ownerIdRef: 'usr_ciso_01',
      measurementFrequency: 'WEEKLY',
      baseline: 14,
      target: 7,
      warningThreshold: 10,
      criticalThreshold: 21,
      currentObservation: 12,
      trend: 'DEGRADING',
      directionality: 'NEGATIVE',
      status: 'WARNING',
      calculationBasis: 'Vulnerability Management System extract',
      lastVerifiedAt: '2026-08-28'
    }
  ]);

  const [mitigations] = useState<RiskMitigationPlan[]>([
    {
      id: 'mit_01',
      tenantId,
      riskIdRef: 'risk_01',
      title: 'Deploy Zero-Trust Architecture',
      description: 'Implement micro-segmentation and continuous authentication across all critical networks.',
      ownerIdRef: 'usr_netsec_lead',
      targetDate: '2026-12-31',
      expectedResidualScore: 8,
      status: 'IN_PROGRESS',
      progressPercentage: 45
    }
  ]);

  const [acceptances] = useState<RiskAcceptanceRecord[]>([]);
  const [emerging] = useState<EmergingRiskObservation[]>([
    {
      id: 'emg_01',
      tenantId,
      title: 'Generative AI Hallucination in Academic grading',
      description: 'Unverified use of AI models by adjuncts to auto-grade complex essays leading to systemic grading bias.',
      category: 'AI',
      source: 'Internal Whistleblower & Sector Intelligence',
      confidence: 'MEDIUM',
      observedAt: '2026-08-20',
      analystIdRef: 'usr_risk_analyst',
      reviewStatus: 'WATCHLIST'
    }
  ]);

  const [decisions] = useState<ExecutiveRiskDecision[]>([
    {
      id: 'dec_01',
      tenantId,
      title: 'Approve Cloud ERP Migration Risk Exception',
      proposal: 'Accept elevated operational risk during ERP cutover weekend.',
      riskImplications: 'Potential 48hr payroll processing delay.',
      financialImplications: 'None if contained, SLA penalties if extended.',
      strategicImplications: 'Modernization accelerates by 6 months.',
      requesterIdRef: 'usr_cio',
      approverIdRef: 'usr_cfo',
      status: 'APPROVED',
      fourEyesVerified: true,
      createdAt: '2026-08-10',
      updatedAt: '2026-08-12'
    }
  ]);

  const [diagnostics, setDiagnostics] = useState<ERMDiagnosticFinding[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ERMSimulationScenario>('CYBER_INCIDENT');
  const [simulationResult, setSimulationResult] = useState<ERMSimulationResult | null>(null);
  const auditLogs = EnterpriseRiskGovernanceService.getAuditLogs(tenantId);

  const handleRunDiagnostics = () => {
    const res = EnterpriseRiskGovernanceService.runDiagnostics(risks, kris, mitigations, acceptances);
    setDiagnostics(res);
    EnterpriseRiskGovernanceService.logAudit(tenantId, undefined, 'usr_admin', 'RUN_DIAGNOSTICS', 'Diagnostics', 'system', 'SUCCESS', 'Executed ERM diagnostics', 'System');
  };

  const handleRunSimulation = () => {
    const res = EnterpriseRiskGovernanceService.runSimulation(selectedScenario);
    setSimulationResult(res);
    EnterpriseRiskGovernanceService.logAudit(tenantId, undefined, 'usr_admin', 'RUN_SIMULATION', 'Simulation', selectedScenario, 'SUCCESS', 'Executed ERM what-if sandbox', 'System');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-xs">
              EMS Phase 7.72
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
              Enterprise Risk Governance
            </Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Enterprise Risk Management &amp; Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Institutional GRC control plane for strategic risk, intelligence, and deterministic forecasting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDiagnostics}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Activity className="w-4 h-4" /> Run Diagnostics
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'command', label: 'Executive Command', icon: Target },
          { id: 'register', label: 'Risk Register', icon: Layers },
          { id: 'heatmap', label: 'Heatmap', icon: Compass },
          { id: 'appetite', label: 'Appetite & Tolerance', icon: Sliders },
          { id: 'kri', label: 'Key Risk Indicators', icon: TrendingUp },
          { id: 'controls', label: 'Control Mapping', icon: ShieldAlert },
          { id: 'mitigation', label: 'Treatment & Mitigation', icon: CheckSquare },
          { id: 'emerging', label: 'Emerging Risks', icon: Eye },
          { id: 'executive', label: 'Executive Decisions', icon: Users },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Zap },
          { id: 'audit', label: 'Audit Trail', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enterprise Risks</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{risks.length}</h3>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appetite Breaches</p>
                <h3 className="text-3xl font-black text-rose-600 mt-2">{risks.filter(r => r.appetiteState === 'OUTSIDE_TOLERANCE' || r.appetiteState === 'CRITICAL_BREACH').length}</h3>
                <p className="text-xs text-rose-500 mt-1">Requires immediate attention</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overdue Mitigations</p>
                <h3 className="text-3xl font-black text-amber-600 mt-2">0</h3>
                <p className="text-xs text-slate-500 mt-1">Treatment actions past due</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">KRI Warnings</p>
                <h3 className="text-3xl font-black text-amber-600 mt-2">{kris.filter(k => k.status === 'WARNING').length}</h3>
                <p className="text-xs text-amber-500 mt-1">Indicators degrading</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Diagnostic Findings</h3>
                {diagnostics.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Run diagnostics to evaluate current risk posture.</p>
                ) : (
                  <div className="space-y-3">
                    {diagnostics.map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{d.title}</span>
                          <Badge variant={d.severity === 'CRITICAL' ? 'destructive' : 'default'}>{d.severity}</Badge>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">{d.description}</p>
                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">Rec: {d.remediationRecommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Risk Register</h3>
            <div className="space-y-4">
              {risks.map(r => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base">{r.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-indigo-100 text-indigo-800">{r.category}</Badge>
                        <Badge className="bg-slate-200 text-slate-800">{r.status}</Badge>
                        {r.appetiteState === 'OUTSIDE_TOLERANCE' && <Badge variant="destructive">Outside Tolerance</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Residual Score</div>
                      <div className="text-2xl font-black text-rose-600">{r.residualRiskScore}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{r.statement}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div><span className="block text-slate-400">Owner</span><span className="font-bold">{r.ownerIdRef}</span></div>
                    <div><span className="block text-slate-400">Inherent Score</span><span className="font-bold">{r.inherentRiskScore}</span></div>
                    <div><span className="block text-slate-400">Control Effectiveness</span><span className="font-bold">{r.controlEffectiveness}%</span></div>
                    <div><span className="block text-slate-400">Velocity</span><span className="font-bold">{r.riskVelocity}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kri' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Risk Indicators (KRIs)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kris.map(kri => (
                <div key={kri.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">{kri.name}</h4>
                    <Badge className={kri.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}>{kri.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{kri.definition}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-xs">
                    <div>
                      <span className="block text-slate-400">Target</span>
                      <span className="font-bold">{kri.target}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Current</span>
                      <span className="font-bold text-amber-600">{kri.currentObservation}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Trend</span>
                      <span className="font-bold">{kri.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emerging' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Emerging Risk Intelligence</h3>
            <div className="space-y-3">
              {emerging.map(e => (
                <div key={e.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">{e.title}</h4>
                    <Badge className="bg-purple-100 text-purple-800">{e.reviewStatus}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{e.description}</p>
                  <div className="text-xs text-slate-500 pt-1 flex gap-4">
                    <span>Source: {e.source}</span>
                    <span>Confidence: {e.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 tracking-wider">
                SIMULATION ONLY &bull; SANDBOX MODE ACTIVE &bull; ZERO PRODUCTION MUTATION
              </span>
              <Badge className="bg-amber-200 text-amber-900 font-bold">Isolated Memory</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Select Risk Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as ERMSimulationScenario)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="REVENUE_SHOCK">Revenue Shock</option>
                  <option value="CYBER_INCIDENT">Cyber Incident</option>
                  <option value="RANSOMWARE_EVENT">Ransomware Event</option>
                  <option value="SUPPLIER_FAILURE">Supplier Failure</option>
                  <option value="MULTI_RISK_CASCADE">Multi-Risk Cascade</option>
                </select>
                <button
                  onClick={handleRunSimulation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm mt-4"
                >
                  <Zap className="w-4 h-4" /> Run What-If Simulation
                </button>
              </div>

              <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Simulation Output &amp; Impact Analysis</h4>
                {simulationResult ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Scenario Name:</span>
                      <span className="font-black text-slate-900 dark:text-white">{simulationResult.scenarioName}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{simulationResult.description}</p>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <div>
                        <span className="text-slate-400 block">Affected Risks</span>
                        <strong className="text-lg text-amber-600">{simulationResult.affectedRiskCount}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Est. Financial Exposure</span>
                        <strong className="text-lg text-rose-600">${simulationResult.estimatedFinancialExposure.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Select a risk simulation scenario and click run.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Immutable Governance Audit Trail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor ID</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {auditLogs.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-slate-400 italic">No audit records in current session memory.</td></tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="p-3 font-bold">{log.actorId}</td>
                        <td className="p-3 font-mono text-indigo-600">{log.action}</td>
                        <td className="p-3"><Badge className="bg-emerald-100 text-emerald-800">{log.outcome}</Badge></td>
                        <td className="p-3 font-mono text-slate-400">{log.provenance}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
