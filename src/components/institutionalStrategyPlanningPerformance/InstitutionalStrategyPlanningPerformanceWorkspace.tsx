/**
 * EMS Phase 11.17: Institutional Strategy, Planning, Performance & Quality Workspace
 */

import React, { useState } from 'react';
import {
  InstitutionalStrategyPlanningPerformanceService,
  TestResult
} from '../../services/institutionalStrategyPlanningPerformanceService';
import { Badge } from '../common/Badge';
import {
  Target,
  BarChart2,
  Award,
  ClipboardList,
  Activity,
  Play,
  Lock,
  Database,
  Server
} from 'lucide-react';

export const InstitutionalStrategyPlanningPerformanceWorkspace: React.FC = () => {
  const service = InstitutionalStrategyPlanningPerformanceService.getInstance();
  const tenantId = 'tenant-main';

  const [activeTab, setActiveTab] = useState<'command' | 'strategy' | 'kpis' | 'quality' | 'capas' | 'diagnostics' | 'audit' | 'sandbox' | 'verification'>('command');
  
  const [measurementValue, setMeasurementValue] = useState<number>(0);
  const [actorUser, setActorUser] = useState('usr-admin-01');

  const [verificationResults, setVerificationResults] = useState<TestResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const strategies = service.getStrategies(tenantId);
  const objectives = service.getObjectives(tenantId);
  const kpis = service.getKPIs(tenantId);
  const measurements = service.getKPIMeasurements(tenantId);
  const findings = service.getFindings(tenantId);
  const capas = service.getCAPAs(tenantId);
  const auditEvents = service.getAuditEvents(tenantId);
  const diagnostics = service.runDiagnostics(tenantId);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResults(service.runPhase1117VerificationSuite(tenantId, 'campus-north'));
      setIsVerifying(false);
    }, 400);
  };
  
  const handleSubmitMeasurement = (e: React.FormEvent) => {
      e.preventDefault();
      try {
          service.submitKPIMeasurement(tenantId, 'kpi-001', 'tgt-001', measurementValue, actorUser, 'idemp-kpi-' + Date.now());
          alert('KPI Measurement submitted successfully.');
      } catch (err: any) {
          alert('Error: ' + err.message);
      }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Institutional Strategy, Planning, Performance &amp; Quality
              </h1>
              <Badge variant="primary" size="sm">Phase 11.17</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authoritative engine for strategic planning, KPIs, scorecards, accreditation readiness, and continuous improvement (CAPAs).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <select
              value={actorUser}
              onChange={(e) => setActorUser(e.target.value)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <option value="usr-admin-01">Admin (usr-admin-01)</option>
              <option value="usr-planner-01">Strategy Planner (usr-planner-01)</option>
              <option value="usr-quality-01">Quality Dir (usr-quality-01)</option>
            </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'command', label: 'Command Center', icon: Activity },
          { id: 'strategy', label: 'Strategy & Objectives', icon: Target },
          { id: 'kpis', label: 'KPI Scorecards', icon: BarChart2 },
          { id: 'quality', label: 'Quality & Accreditation', icon: Award },
          { id: 'capas', label: 'Findings & CAPAs', icon: ClipboardList },
          { id: 'diagnostics', label: 'Diagnostics', icon: Database },
          { id: 'audit', label: 'Audit Chain', icon: Lock },
          { id: 'sandbox', label: 'Sandbox', icon: Play },
          { id: 'verification', label: 'ADV Suite (50 Tests)', icon: Server }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === t.id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Active Strategies</p>
                <p className="text-2xl font-extrabold mt-1">{strategies.length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Strategic Objectives</p>
                <p className="text-2xl font-extrabold mt-1">{objectives.length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Tracked KPIs</p>
                <p className="text-2xl font-extrabold mt-1">{kpis.length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Open CAPAs</p>
                <p className="text-2xl font-extrabold mt-1 text-amber-600">{capas.filter(c => c.status !== 'CLOSED').length}</p>
             </div>
             
             <div className="col-span-1 md:col-span-2 p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                 <h3 className="text-sm font-bold mb-4">Quick KPI Measurement</h3>
                 <form onSubmit={handleSubmitMeasurement} className="flex gap-2">
                     <input type="number" value={measurementValue} onChange={e => setMeasurementValue(Number(e.target.value))} placeholder="Actual Value" className="flex-1 px-3 py-2 border rounded-lg text-xs" />
                     <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">Submit</button>
                 </form>
             </div>
          </div>
        )}

        {activeTab === 'kpis' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">KPI Measurements</h3>
                <div className="space-y-3">
                    {measurements.map(m => (
                        <div key={m.measurementId} className="flex justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">{m.kpiIdRef}</p>
                                <p className="text-2xs text-slate-500 mt-1">Value: {m.actualValue} | Variance: {m.variance}</p>
                            </div>
                            <Badge variant={m.status === 'EXCEEDED' || m.status === 'ACHIEVED' ? 'success' : 'warning'}>{m.status}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {activeTab === 'capas' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Corrective & Preventive Actions (CAPAs)</h3>
                <div className="space-y-3">
                    {capas.map(c => (
                        <div key={c.capaId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">{c.title}</p>
                                <p className="text-2xs text-slate-500 mt-1">Owner: {c.actionOwnerUserIdRef} | Status: {c.status}</p>
                            </div>
                            <button onClick={() => {
                                try { service.verifyCAPA(c.capaId, 'usr-admin-01'); alert('Verified'); } catch(e:any) { alert(e.message); }
                            }} className="px-3 py-1 bg-emerald-600 text-white text-2xs font-bold rounded">Verify (4-Eyes)</button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold mb-4">Diagnostics Engine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnostics.map(d => (
                <div key={d.invariantCode} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-xs font-bold">{d.invariantCode} {d.title}</p>
                    <p className="text-2xs text-slate-500 mt-1">{d.message}</p>
                  </div>
                  <Badge variant={d.status === 'PASS' ? 'success' : 'danger'}>{d.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold mb-4">Audit Chain</h3>
            <div className="space-y-2">
                {auditEvents.map(e => (
                    <div key={e.eventId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                        <p>{e.action} on {e.entityType}</p>
                        <p className="text-2xs text-slate-500 truncate">Hash: {e.currentHash}</p>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {activeTab === 'sandbox' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Sandbox (Zero Mutation)</h3>
                <button onClick={() => setSandboxResult(service.runSandboxSimulation(tenantId, 'CRITICAL_FINDING_ESCALATION'))} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded">Run Simulation</button>
                {sandboxResult && (
                    <div className="mt-4 p-4 border rounded bg-slate-50">
                        <p className="font-bold">{sandboxResult.title}</p>
                        <p className="text-xs mt-1">{sandboxResult.description}</p>
                        <p className="text-xs text-amber-600 mt-1">Impact: {sandboxResult.impactScore}/10</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Verification Suite (ADV-11.17-01 to ADV-11.17-50)</h3>
              <button onClick={handleRunVerification} disabled={isVerifying} className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold disabled:opacity-50">
                {isVerifying ? 'Running...' : 'Run 50 Tests'}
              </button>
            </div>
            {verificationResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {verificationResults.map(r => (
                  <div key={r.id} className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div>
                      <p className="font-bold font-mono text-indigo-600">{r.id} <span className="text-slate-800">{r.title}</span></p>
                      <p className="text-2xs text-slate-500 mt-1">{r.description}</p>
                    </div>
                    <Badge variant={r.status === 'PASS' ? 'success' : 'danger'}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
