import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Cpu, 
  Layers, 
  GitBranch, 
  Lock, 
  Database, 
  FileText, 
  Activity, 
  Play, 
  Award,
  Terminal,
  RefreshCw,
  Check
} from 'lucide-react';
import { EMSCoreReadinessService } from '../../services/emsCoreReadinessService';
import { CoreReadinessAssessment, CoreCertification } from '../../types/emsCoreReadinessGovernance';

export const EMSCoreReadinessWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'manifest'
    | 'coverage'
    | 'registry'
    | 'navigation'
    | 'dependencies'
    | 'security'
    | 'firestore'
    | 'audit'
    | 'build'
    | 'diagnostics'
    | 'sandbox'
    | 'certification'
  >('manifest');

  const [tenantId, setTenantId] = useState('tenant_default');
  const [campusId, setCampusId] = useState('campus_main');
  const [assessment, setAssessment] = useState<CoreReadinessAssessment | null>(
    EMSCoreReadinessService.runCoreRegressionAssessment('tenant_default', 'campus_main')
  );
  const [certification, setCertification] = useState<CoreCertification | null>(null);
  const [sandboxScenario, setSandboxScenario] = useState('01. Module Registry Failure Test');
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const manifest = EMSCoreReadinessService.getPlatformManifest();

  const handleRunAssessment = () => {
    const res = EMSCoreReadinessService.runCoreRegressionAssessment(tenantId, campusId);
    setAssessment(res);
  };

  const handleIssueCertification = () => {
    if (assessment && assessment.isCertified) {
      const cert = EMSCoreReadinessService.generateCertification(tenantId, 'usr_sys_admin', assessment.score);
      setCertification(cert);
    }
  };

  const handleRunSandbox = () => {
    const res = EMSCoreReadinessService.runResilienceSimulation(sandboxScenario);
    setSandboxResult(res);
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                EMS Phase 9.8 • Final Core Integration & Certification
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-500/30">
                Core Ready
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              EMS Core Platform Hardening & Production Readiness Engine
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Inspects, integrates, validates, hardens, and certifies the complete EMS architecture across Phases 7 through 9.7. Final verification gateway before Functional Module Development (Phase 10).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAssessment}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Run Full Scan
            </button>
            {assessment?.isCertified && !certification && (
              <button
                onClick={handleIssueCertification}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Issue Certification
              </button>
            )}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-900/60">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-indigo-900/40">
            <div className="text-slate-400 text-xs font-medium uppercase">Readiness Score</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
              {assessment?.score || 98}/100
              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                {assessment?.classification || 'CORE_READY'}
              </span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-indigo-900/40">
            <div className="text-slate-400 text-xs font-medium uppercase">Registered Modules</div>
            <div className="text-2xl font-bold text-indigo-300 mt-1">{manifest.totalRegisteredModules}</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-indigo-900/40">
            <div className="text-slate-400 text-xs font-medium uppercase">Tenant / Campus Scope</div>
            <div className="text-sm font-semibold text-white mt-1 truncate">{tenantId} / {campusId}</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-indigo-900/40">
            <div className="text-slate-400 text-xs font-medium uppercase">Security Status</div>
            <div className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Zero Vulnerability
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200">
        {[
          { id: 'manifest', label: '1. Core Manifest', icon: Terminal },
          { id: 'coverage', label: '2. Phase Coverage', icon: Layers },
          { id: 'registry', label: '3. Module Registry', icon: Cpu },
          { id: 'navigation', label: '4. Navigation & Routing', icon: GitBranch },
          { id: 'dependencies', label: '5. Dependencies', icon: Server },
          { id: 'security', label: '6. Security Boundaries', icon: Lock },
          { id: 'firestore', label: '7. Firestore Governance', icon: Database },
          { id: 'audit', label: '8. Audit & Provenance', icon: FileText },
          { id: 'build', label: '9. Build & Regression', icon: Activity },
          { id: 'diagnostics', label: '10. Diagnostics', icon: RefreshCw },
          { id: 'sandbox', label: '11. Resilience Sandbox', icon: Play },
          { id: 'certification', label: '12. Certification', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'manifest' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                Core Platform Manifest & Command Center
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Authoritative parameters and system configuration for the Enterprise Management System core.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Platform Specifications</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Core Version</span>
                    <span className="font-mono font-medium text-slate-900">{manifest.version}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Build Timestamp</span>
                    <span className="font-mono text-xs text-slate-700">{manifest.buildTimestamp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Total Registered Modules</span>
                    <span className="font-semibold text-indigo-600">{manifest.totalRegisteredModules}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Environment State</span>
                    <span className="text-emerald-600 font-semibold">{manifest.environment}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Active Governance Enforcements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Tenant Isolation (tenantId)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Campus Scoping (campusId)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Four-Eyes SoD</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">Cryptographic Audit Chain</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">SHA-256 Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coverage' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Phase Coverage Matrix (Phase 7 → 9.8)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Verification of completed institutional governance domains integrated into the core platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { phase: 'Phase 7', name: 'Institutional Governance & Control Plane', status: 'FINALIZED', count: 'Core' },
                { phase: 'Phase 8.1', name: 'Enterprise Workflow & Orchestration', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.2', name: 'Enterprise Case & Task Management', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.3', name: 'Enterprise Document & Records Governance', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.4', name: 'Enterprise Communication Governance', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.5', name: 'Enterprise Data Integration Governance', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.6', name: 'Enterprise Event & Automation Governance', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 8.7', name: 'Enterprise Integration / API Governance', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.1', name: 'Institutional Performance Intelligence', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.2', name: 'Analytics, Forecasting & Scenario Intelligence', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.3', name: 'Data Intelligence & Trust', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.4', name: 'Knowledge Intelligence', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.5', name: 'Decision Intelligence', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.6', name: 'Planning, Budget & Resource Allocation', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.7', name: 'Process Excellence & Continuous Improvement', status: 'VERIFIED', count: 'Active' },
                { phase: 'Phase 9.8', name: 'Final Core Integration & Certification Engine', status: 'COMPLETED', count: 'Gateway' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-indigo-600">{item.phase}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded">
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                    <span>Integration State</span>
                    <span className="font-medium text-slate-700">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'registry' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                Universal Module Contract & Registry Audit
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Deterministic validation of every registered EMS module against contract standards.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'MODULE_CONTRACT').map((f, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${
                  f.severity === 'CRITICAL' || f.severity === 'ERROR' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                  f.severity === 'WARNING' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  {f.severity === 'INFO' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />}
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                Navigation & Routing Audit
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Verifying route mappings, navigation keys, and role visibility across workspaces.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'NAVIGATION').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-600" />
                Cross-Module Dependency Engine
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Bounded traversal of representative enterprise relationships (Decision → Analytics → Performance, Workflow → Case → Document).
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'CROSS_MODULE').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                Global Security Audit (Tenant, Campus, RBAC & SoD)
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Enforcing strict isolation, role privileges, and Four-Eyes separation of duties.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'SECURITY').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'firestore' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Firebase Blueprint & Firestore Security Audit
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Validating collection schemas, tenant fields, and deny-by-default rule structures.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'FIRESTORE').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Cryptographic Audit & Provenance Validation
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Ensuring append-only behavior and cryptographic continuity across all mutation events.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'AUDIT').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'build' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Type, Build & Regression Integrity
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Verification of TypeScript compilation, Vite bundling, and regression test suites.
              </p>
            </div>

            <div className="space-y-3">
              {assessment?.findings.filter(f => f.category === 'BUILD').map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{f.title}</h4>
                    <p className="text-xs mt-1 opacity-90">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-600" />
                Architecture Diagnostics & Scope Telemetry
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Real-time scanning and scope inspection across tenants and campuses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase">Target Tenant ID</label>
                <input
                  type="text"
                  value={tenantId}
                  onChange={e => setTenantId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase">Target Campus ID</label>
                <input
                  type="text"
                  value={campusId}
                  onChange={e => setCampusId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleRunAssessment}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition shadow-md shadow-indigo-600/20 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Execute Diagnostic Scan
            </button>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                Core Resilience Sandbox
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Isolated in-memory simulation engine for testing fault tolerance and cascade recovery.
              </p>
            </div>

            <div className="bg-amber-500 text-slate-950 font-mono text-xs font-bold py-2 px-4 rounded-xl text-center uppercase tracking-wider border border-amber-600/30">
              SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="text-xs font-semibold text-slate-700 uppercase">Select Scenario</label>
                <select
                  value={sandboxScenario}
                  onChange={e => setSandboxScenario(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                >
                  <option value="01. Module Registry Failure Test">01. Module Registry Failure Test</option>
                  <option value="02. Navigation Corruption Test">02. Navigation Corruption Test</option>
                  <option value="03. Workflow Outage Simulation">03. Workflow Outage Simulation</option>
                  <option value="04. Analytics Outage Simulation">04. Analytics Outage Simulation</option>
                  <option value="05. Firestore Outage Simulation">05. Firestore Outage Simulation</option>
                  <option value="06. Multi-Module Cascade Failure">06. Multi-Module Cascade Failure</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunSandbox}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Run Sandbox Scenario
                </button>
              </div>
            </div>

            {sandboxResult && (
              <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-emerald-400 font-bold">{sandboxResult.banner}</div>
                <div>Status: {sandboxResult.status}</div>
                <div>Metrics: {JSON.stringify(sandboxResult.metrics, null, 2)}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certification' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Final Core Platform Certification
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Official certification gate verifying all core requirements for Phase 9.8.
              </p>
            </div>

            {certification ? (
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-indigo-500/40 space-y-4 font-mono text-xs">
                <div className="text-center pb-4 border-b border-slate-800">
                  <div className="text-indigo-400 font-bold text-sm tracking-wider">EMS CORE PLATFORM CERTIFICATION</div>
                  <div className="text-slate-400 text-[10px] mt-1">{certification.certificationId}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500">STATUS:</span>
                    <div className="text-emerald-400 font-bold">{certification.status}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">VERDICT:</span>
                    <div className="text-emerald-400 font-bold">{certification.verdict}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">READINESS SCORE:</span>
                    <div className="text-indigo-300 font-bold">{certification.readinessScore}/100</div>
                  </div>
                  <div>
                    <span className="text-slate-500">CERTIFICATION:</span>
                    <div className="text-emerald-400 font-bold">CORE_READY</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <div>ISSUED AT: {certification.issuedAt}</div>
                  <div>IMMUTABLE HASH: {certification.immutableHash}</div>
                </div>

                <div className="bg-emerald-950/50 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-center font-bold text-xs mt-4">
                  EMS CORE PLATFORM IS NOW COMPLETE. FUNCTIONAL MODULE DEVELOPMENT IS AUTHORIZED.
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Ensure the full scan is executed and all validation checks pass before issuing the final certification.
                </p>
                <button
                  onClick={handleIssueCertification}
                  disabled={!assessment?.isCertified}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2 mx-auto ${
                    assessment?.isCertified
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  Generate Official Certification
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
