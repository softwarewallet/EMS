import React, { useState } from 'react';
import {
  Share2,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Layers,
  Lock,
  RefreshCw,
  Search,
  Server,
  Terminal,
  Cpu,
  Database,
  Eye,
  Zap,
  Clock,
  ExternalLink,
  ShieldAlert,
  GitBranch,
  Play
} from 'lucide-react';
import {
  EnterpriseIntegrationStrategy,
  EnterpriseIntegrationPortfolio,
  EnterpriseIntegrationDefinition,
  EnterpriseApiGovernanceRecord,
  EnterpriseInterfaceContract,
  EnterpriseIntegrationSLA,
  EnterpriseIntegrationSecurityProfile,
  EnterpriseIntegrationException,
  EnterpriseIntegrationRisk,
  EnterpriseIntegrationDiagnostic,
  EnterpriseIntegrationAuditEvent,
  ScenarioType807,
  SimulationResult807
} from '../../types/enterpriseIntegrationGovernance';
import { EnterpriseIntegrationGovernanceService } from '../../services/enterpriseIntegrationGovernanceService';

export const EnterpriseIntegrationGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'command'
    | 'portfolio'
    | 'registry'
    | 'apis'
    | 'contracts'
    | 'lineage'
    | 'dependencies'
    | 'security'
    | 'privacy'
    | 'sla'
    | 'change'
    | 'thirdparty'
    | 'risk'
    | 'sandbox'
    | 'diagnostics'
  >('command');

  // Seed Data State
  const [portfolios] = useState<EnterpriseIntegrationPortfolio[]>(
    EnterpriseIntegrationGovernanceService.getInitialPortfolios()
  );
  const [integrations] = useState<EnterpriseIntegrationDefinition[]>(
    EnterpriseIntegrationGovernanceService.getInitialIntegrations()
  );
  const [apis] = useState<EnterpriseApiGovernanceRecord[]>(
    EnterpriseIntegrationGovernanceService.getInitialApis()
  );
  const [contracts] = useState<EnterpriseInterfaceContract[]>(
    EnterpriseIntegrationGovernanceService.getInitialContracts()
  );
  const [slas] = useState<EnterpriseIntegrationSLA[]>(
    EnterpriseIntegrationGovernanceService.getInitialSLAs()
  );

  // Exception State
  const [exceptions] = useState<EnterpriseIntegrationException[]>([
    {
      id: 'exc_legacy_auth_01',
      tenantId: 'tenant_default',
      exceptionCode: 'EXC-2026-089',
      title: 'Legacy API Key Auth Exception for Partner Portal',
      businessJustification: 'Vendor migration scheduled for Q4 2026',
      compensatingControlRef: 'IP Whitelisting & WAF Rate Limit',
      affectedIntegrationIdRef: 'integ_pay_gw_202',
      requesterIdRef: 'usr_dev_01',
      approverIdRef: 'usr_ciso_01',
      approvedAt: '2026-01-10T10:00:00Z',
      expiryDate: '2026-12-31T23:59:59Z',
      status: 'ACTIVE',
      createdAt: '2026-01-10T10:00:00Z'
    }
  ]);

  const [secProfiles] = useState<EnterpriseIntegrationSecurityProfile[]>([
    {
      id: 'sec_prof_01',
      tenantId: 'tenant_default',
      integrationIdRef: 'integ_sis_lms_101',
      authenticationTypeRef: 'OAuth2_GSI_Bearer',
      authorizationPolicyRef: 'POL_RBAC_ACADEMIC',
      encryptionInTransit: true,
      encryptionAtRest: true,
      certificateExpiryDate: '2027-06-30T23:59:59Z',
      securityReviewDate: '2026-01-10T00:00:00Z',
      reviewerIdRef: 'usr_ciso_01',
      isPrivileged: true
    }
  ]);

  // Lineage State
  const [lineageStart, setLineageStart] = useState('sys_sis_prod');
  const [lineageResult, setLineageResult] = useState<{ path: string[]; hasCycle: boolean } | null>(null);

  // Risk Calculator State
  const [riskCrit, setRiskCrit] = useState(9);
  const [riskSens, setRiskSens] = useState(8);
  const [riskSec, setRiskSec] = useState(7);
  const [riskDep, setRiskDep] = useState(6);
  const [riskExt, setRiskExt] = useState(5);
  const [calculatedRisk, setCalculatedRisk] = useState<EnterpriseIntegrationRisk | null>(null);

  // Four-Eyes SoD Form State
  const [sodRequester, setSodRequester] = useState('usr_dev_101');
  const [sodApprover, setSodApprover] = useState('usr_mgr_202');
  const [sodAction, setSodAction] = useState('Integration Activation');
  const [sodResult, setSodResult] = useState<{ valid: boolean; reason?: string } | null>(null);

  // Sandbox State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType807>('API_PROVIDER_OUTAGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult807 | null>(null);

  // Diagnostics State
  const [diagnosticsList, setDiagnosticsList] = useState<EnterpriseIntegrationDiagnostic[]>([]);
  const [auditLogs, setAuditLogs] = useState<EnterpriseIntegrationAuditEvent[]>([
    {
      id: 'audit_01',
      tenantId: 'tenant_default',
      actorUserIdRef: 'usr_ciso_01',
      action: 'INTEGRATION_SECURITY_REVIEW_APPROVED',
      entityType: 'EnterpriseIntegrationDefinition',
      entityIdRef: 'integ_sis_lms_101',
      timestamp: '2026-08-30T10:00:00Z',
      correlationId: 'corr_init_807',
      previousHash: 'GENESIS_HASH_807',
      currentHash: EnterpriseIntegrationGovernanceService.generateAuditHash(
        'usr_ciso_01',
        'INTEGRATION_SECURITY_REVIEW_APPROVED',
        'integ_sis_lms_101',
        '2026-08-30T10:00:00Z',
        'GENESIS_HASH_807'
      )
    }
  ]);

  // Handlers
  const handleRunLineage = () => {
    const sampleEdges = [
      { id: '1', tenantId: 't1', sourceSystemIdRef: 'sys_sis_prod', interfaceIdRef: 'i1', apiIdRef: 'a1', dataDomainIdRef: 'd1', targetSystemIdRef: 'sys_lms_canvas', lineagePathHash: 'h1' },
      { id: '2', tenantId: 't1', sourceSystemIdRef: 'sys_lms_canvas', interfaceIdRef: 'i2', apiIdRef: 'a2', dataDomainIdRef: 'd2', targetSystemIdRef: 'sys_analytics_hub', lineagePathHash: 'h2' },
      { id: '3', tenantId: 't1', sourceSystemIdRef: 'sys_analytics_hub', interfaceIdRef: 'i3', apiIdRef: 'a3', dataDomainIdRef: 'd3', targetSystemIdRef: 'sys_finance_erp', lineagePathHash: 'h3' }
    ];
    const res = EnterpriseIntegrationGovernanceService.traverseLineage(lineageStart, sampleEdges);
    setLineageResult({ path: res.path, hasCycle: res.hasCycle });
  };

  const handleCalculateRisk = () => {
    const r = EnterpriseIntegrationGovernanceService.calculateIntegrationRisk(
      riskCrit,
      riskSens,
      riskSec,
      riskDep,
      riskExt
    );
    setCalculatedRisk(r);
  };

  const handleVerifySoD = () => {
    const res = EnterpriseIntegrationGovernanceService.validateFourEyesSoD(sodRequester, sodApprover, sodAction);
    setSodResult(res);
  };

  const handleRunSimulation = () => {
    const res = EnterpriseIntegrationGovernanceService.executeWhatIfSimulation(selectedScenario);
    setSimulationResult(res);
  };

  const handleRunDiagnostics = () => {
    const diag = EnterpriseIntegrationGovernanceService.runDiagnostics(integrations, apis, exceptions, secProfiles);
    setDiagnosticsList(diag);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Enterprise Integration &amp; API Governance
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                  EMS Phase 8.7
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Horizontal control plane for APIs, service interfaces, interoperability contracts, data exchange &amp; external connectivity risk
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={handleRunDiagnostics}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Run Governance Diagnostics</span>
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Resilience Sandbox</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 mb-6 border-b border-slate-800 text-xs font-medium">
        {[
          { id: 'command', label: 'Executive Command', icon: Activity },
          { id: 'portfolio', label: 'Integration Portfolio', icon: Layers },
          { id: 'registry', label: 'Integration Registry', icon: Server },
          { id: 'apis', label: 'API Governance', icon: FileCode },
          { id: 'contracts', label: 'Interface Contracts', icon: Shield },
          { id: 'lineage', label: 'Data Exchange & Lineage', icon: GitBranch },
          { id: 'dependencies', label: 'System Dependencies', icon: Cpu },
          { id: 'security', label: 'Security Governance', icon: Lock },
          { id: 'privacy', label: 'Privacy Governance', icon: Eye },
          { id: 'sla', label: 'SLA Assurance', icon: Clock },
          { id: 'change', label: 'Change Control', icon: RefreshCw },
          { id: 'thirdparty', label: 'Third-Party Connectivity', icon: ExternalLink },
          { id: 'risk', label: 'Risk & Exceptions', icon: AlertTriangle },
          { id: 'sandbox', label: 'Resilience Sandbox', icon: Play },
          { id: 'diagnostics', label: 'Diagnostics & Audit', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Executive Command */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Integrations</div>
              <div className="text-2xl font-bold text-white">{integrations.filter(i => i.lifecycle === 'ACTIVE').length}</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Governed &amp; Active
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">APIs Under Governance</div>
              <div className="text-2xl font-bold text-white">{apis.length}</div>
              <div className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                <FileCode className="w-3 h-3" /> Published &amp; Managed
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">High Risk Integrations</div>
              <div className="text-2xl font-bold text-amber-400">1</div>
              <div className="text-xs text-amber-400/80 mt-1">Requires Close Monitoring</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Telemetry Status</div>
              <div className="text-lg font-bold text-amber-300">INSUFFICIENT DATA</div>
              <div className="text-xs text-slate-400 mt-1">Telemetry Stream Unconfigured</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" /> API Security Posture Overview
              </h3>
              <div className="space-y-3 text-xs">
                {apis.map(a => (
                  <div key={a.id} className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{a.name}</div>
                      <div className="text-slate-400">{a.apiCode} • Classification: <span className="text-indigo-300 font-mono">{a.dataClassification}</span></div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {a.securityReviewStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> SLA &amp; Service Assurance
              </h3>
              <div className="space-y-3 text-xs">
                {slas.map(s => (
                  <div key={s.id} className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{s.title}</div>
                      <div className="text-slate-400">Target Availability: {s.targetAvailabilityPercent}% • Max Latency: {s.targetResponseMs}ms</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Integration Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Enterprise Integration Portfolios</h2>
            <span className="text-xs text-slate-400">3 Portfolios Defined</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolios.map(p => (
              <div key={p.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {p.portfolioCode}
                  </span>
                  <span className="text-xs text-slate-400">{p.totalIntegrationCount} Integrations</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                </div>
                <div className="text-xs text-amber-400 pt-2 border-t border-slate-700/40">
                  High Risk Count: {p.highRiskIntegrationCount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Integration Registry */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Governed Integration Catalog</h2>
            <span className="text-xs text-slate-400">{integrations.length} Active Records</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Protocol</th>
                  <th className="px-4 py-3">Criticality</th>
                  <th className="px-4 py-3">Lifecycle</th>
                  <th className="px-4 py-3">Owner Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {integrations.map(i => (
                  <tr key={i.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-indigo-300">{i.integrationCode}</td>
                    <td className="px-4 py-3 font-medium text-white">{i.title}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-mono">{i.protocol}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        i.criticality === 'MISSION_CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {i.criticality}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        {i.lifecycle}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{i.ownerIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. API Governance */}
      {activeTab === 'apis' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Institutional API Governance Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apis.map(a => (
              <div key={a.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{a.apiCode}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {a.lifecycle}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{a.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{a.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/40 text-slate-300">
                  <div>Version: <span className="font-mono text-white">{a.currentVersion}</span></div>
                  <div>Classification: <span className="font-mono text-indigo-300">{a.dataClassification}</span></div>
                  <div>Security Review: <span className="text-emerald-400 font-semibold">{a.securityReviewStatus}</span></div>
                  <div>Privacy Review: <span className="text-emerald-400 font-semibold">{a.privacyReviewStatus}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Interface Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Interoperability Contracts &amp; Exchange Agreements</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            {contracts.map(c => (
              <div key={c.id} className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-indigo-400">{c.contractCode}</span>
                    <span className="text-sm font-bold text-white">{c.title}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Consumer: <span className="text-slate-200">{c.consumerSystemIdRef}</span> → Provider: <span className="text-slate-200">{c.providerSystemIdRef}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-semibold">{c.compatibilityType}</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-semibold">{c.certificationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Data Exchange & Lineage */}
      {activeTab === 'lineage' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Bounded Lineage Traversal &amp; Cycle Detection</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={lineageStart}
                onChange={e => setLineageStart(e.target.value)}
                placeholder="Start System ID (e.g. sys_sis_prod)"
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-md px-3 py-2 w-64 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleRunLineage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition"
              >
                Traverse Lineage Graph
              </button>
            </div>

            {lineageResult && (
              <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-lg space-y-2">
                <div className="text-xs font-semibold text-slate-300">Traversal Lineage Path:</div>
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 overflow-x-auto py-2">
                  {lineageResult.path.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-white">{step}</span>
                      {idx < lineageResult.path.length - 1 && <span className="text-slate-500">→</span>}
                    </React.Fragment>
                  ))}
                </div>
                <div className="text-xs text-slate-400">
                  Cycle Detected: <span className={lineageResult.hasCycle ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{lineageResult.hasCycle ? 'YES' : 'NO'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. System Dependencies */}
      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Upstream &amp; Downstream Dependency Architecture</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">sys_sis_prod → sys_lms_canvas</div>
                <div className="text-slate-400">Synchronous Roster &amp; Course Enrollment Feed</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">MISSION_CRITICAL</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Security Governance */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Integration Security Profiles &amp; Four-Eyes SoD Verifier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Four-Eyes SoD Validation</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Requester User ID</label>
                  <input
                    type="text"
                    value={sodRequester}
                    onChange={e => setSodRequester(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Approver User ID</label>
                  <input
                    type="text"
                    value={sodApprover}
                    onChange={e => setSodApprover(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Action Type</label>
                  <input
                    type="text"
                    value={sodAction}
                    onChange={e => setSodAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <button
                  onClick={handleVerifySoD}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded transition"
                >
                  Verify Four-Eyes SoD Policy
                </button>
                {sodResult && (
                  <div className={`p-3 rounded border ${sodResult.valid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                    {sodResult.valid ? 'PASSED: Valid Four-Eyes Separation of Duties' : sodResult.reason}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Security Profiles</h3>
              {secProfiles.map(sp => (
                <div key={sp.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg space-y-1">
                  <div className="font-bold text-white">Ref: {sp.integrationIdRef}</div>
                  <div className="text-slate-400">Auth Method: <span className="text-indigo-300 font-mono">{sp.authenticationTypeRef}</span></div>
                  <div className="text-slate-400">TLS Encryption: <span className="text-emerald-400 font-semibold">{sp.encryptionInTransit ? 'ENABLED' : 'DISABLED'}</span></div>
                  <div className="text-slate-400">Cert Expiry: <span className="text-slate-200">{sp.certificateExpiryDate}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Privacy Governance */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Data Protection &amp; Cross-Border Privacy Governance</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-xs text-slate-300 space-y-2">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">FERPA &amp; GDPR Student Data Exchange Controls</div>
                <div className="text-slate-400">Encryption in Transit &amp; At Rest Enforced • Purpose Limitation Reference Verified</div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                COMPLIANT
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 10. SLA Assurance */}
      {activeTab === 'sla' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">SLA Objectives &amp; Truthful Telemetry Monitoring</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4 text-xs">
            {slas.map(s => (
              <div key={s.id} className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{s.title} ({s.slaCode})</div>
                  <div className="text-slate-400 mt-1">
                    Target: {s.targetAvailabilityPercent}% Availability | Max Latency: {s.targetResponseMs}ms | RPO: {s.targetRpoMinutes}m | RTO: {s.targetRtoMinutes}m
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {s.status}
                  </span>
                  <div className="text-[10px] text-amber-300 mt-1">TELEMETRY: INSUFFICIENT DATA</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. Change Control */}
      {activeTab === 'change' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Change Control &amp; Version Governance</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-xs text-slate-300 space-y-2">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">CR-2026-042: API-STUDENT-V2 Schema Extension</div>
                <div className="text-slate-400">Class: NON_BREAKING • Four-Eyes Approval Verified</div>
              </div>
              <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-semibold">IMPLEMENTED</span>
            </div>
          </div>
        </div>
      )}

      {/* 12. Third-Party Connectivity */}
      {activeTab === 'thirdparty' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Third-Party SaaS &amp; External Provider Risk</h2>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-xs text-slate-300 space-y-2">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Stripe Inc. Payment Gateway Connectivity</div>
                <div className="text-slate-400">Vendor Ref: ven_stripe_inc • Criticality: HIGH • Exit Complexity: MODERATE</div>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* 13. Risk & Exceptions */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deterministic Integration Risk Calculator</h3>
            <div className="grid grid-cols-5 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Criticality (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={riskCrit}
                  onChange={e => setRiskCrit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Data Sensitivity</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={riskSens}
                  onChange={e => setRiskSens(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Security Exposure</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={riskSec}
                  onChange={e => setRiskSec(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Dependency Conc.</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={riskDep}
                  onChange={e => setRiskDep(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">External Dep.</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={riskExt}
                  onChange={e => setRiskExt(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCalculateRisk}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
            >
              Calculate Composite Risk Score
            </button>

            {calculatedRisk && (
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs space-y-1">
                <div className="text-slate-300">Composite Risk Score: <span className="text-white font-bold">{calculatedRisk.compositeRiskScore}</span></div>
                <div className="text-slate-300">
                  Risk Level:{' '}
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    calculatedRisk.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                    calculatedRisk.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {calculatedRisk.riskLevel}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Exceptions</h3>
            {exceptions.map(ex => (
              <div key={ex.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs space-y-1">
                <div className="font-bold text-white">{ex.title} ({ex.exceptionCode})</div>
                <div className="text-slate-400">{ex.businessJustification}</div>
                <div className="text-slate-400">Expiry Date: <span className="text-amber-300">{ex.expiryDate}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14. Resilience What-If Sandbox */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          {/* MANDATORY BANNER */}
          <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-xl text-center">
            <div className="text-sm font-extrabold text-amber-300 tracking-wider font-mono">
              SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
            </div>
            <p className="text-xs text-amber-400/80 mt-1">
              Isolated in-memory simulation engine for evaluating resilience under adverse failures.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1 font-semibold">Select Simulation Scenario (15 Scenarios Available)</label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as ScenarioType807)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="API_PROVIDER_OUTAGE">1. API_PROVIDER_OUTAGE</option>
                  <option value="IDENTITY_PROVIDER_OUTAGE">2. IDENTITY_PROVIDER_OUTAGE</option>
                  <option value="CLOUD_SERVICE_OUTAGE">3. CLOUD_SERVICE_OUTAGE</option>
                  <option value="NETWORK_PARTITION">4. NETWORK_PARTITION</option>
                  <option value="CERTIFICATE_EXPIRY">5. CERTIFICATE_EXPIRY</option>
                  <option value="AUTHENTICATION_FAILURE">6. AUTHENTICATION_FAILURE</option>
                  <option value="SCHEMA_BREAK">7. SCHEMA_BREAK</option>
                  <option value="API_VERSION_RETIREMENT">8. API_VERSION_RETIREMENT</option>
                  <option value="THIRD_PARTY_OUTAGE">9. THIRD_PARTY_OUTAGE</option>
                  <option value="MESSAGE_BACKLOG">10. MESSAGE_BACKLOG</option>
                  <option value="INTEGRATION_CASCADE">11. INTEGRATION_CASCADE</option>
                  <option value="DATA_MAPPING_FAILURE">12. DATA_MAPPING_FAILURE</option>
                  <option value="RATE_LIMIT_EXHAUSTION">13. RATE_LIMIT_EXHAUSTION</option>
                  <option value="CYBER_COMPROMISE">14. CYBER_COMPROMISE</option>
                  <option value="MULTI_SYSTEM_CONNECTIVITY_FAILURE">15. MULTI_SYSTEM_CONNECTIVITY_FAILURE</option>
                </select>
              </div>

              <button
                onClick={handleRunSimulation}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition self-end h-9"
              >
                Execute What-If Simulation
              </button>
            </div>

            {simulationResult && (
              <div className="mt-4 p-5 bg-slate-900 border border-slate-700 rounded-xl space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-white text-sm">Simulation Summary Report</div>
                  <span className="text-[10px] text-slate-400 font-mono">{simulationResult.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-800/80 rounded border border-slate-700">
                    <div className="text-slate-400">Simulated Requests</div>
                    <div className="text-lg font-bold text-white">{simulationResult.simulatedRequestsCount.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded border border-slate-700">
                    <div className="text-slate-400">Affected Systems</div>
                    <div className="text-lg font-bold text-amber-400">{simulationResult.affectedSystemsCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded border border-slate-700">
                    <div className="text-slate-400">Circuit Breakers Tripped</div>
                    <div className="text-lg font-bold text-rose-400">{simulationResult.circuitBreakersTrippedCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded border border-slate-700">
                    <div className="text-slate-400">Estimated Recovery</div>
                    <div className="text-lg font-bold text-indigo-300">{simulationResult.estimatedRecoveryExposureHours} Hours</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded border border-slate-700 text-slate-200">
                  <div className="font-semibold mb-1 text-white">Impact Assessment:</div>
                  {simulationResult.summary}
                </div>

                {simulationResult.diagnosticsGenerated.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-400 mb-1">Generated Diagnostics Code References:</div>
                    <div className="flex flex-wrap gap-2">
                      {simulationResult.diagnosticsGenerated.map((code, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 15. Diagnostics & Audit */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Diagnostic Scanner Findings</h3>
              <button
                onClick={handleRunDiagnostics}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded font-semibold transition"
              >
                Scan Now
              </button>
            </div>

            {diagnosticsList.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">Click "Scan Now" or "Run Governance Diagnostics" to evaluate integration integrity.</div>
            ) : (
              <div className="space-y-2 text-xs">
                {diagnosticsList.map(d => (
                  <div key={d.id} className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">{d.title}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">{d.severity}</span>
                    </div>
                    <p className="text-slate-300">{d.description}</p>
                    <div className="text-emerald-400">Recommendation: {d.recommendation}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Immutable Governance Audit Log</h3>
            <div className="space-y-2 text-xs font-mono">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-bold">{log.action}</span>
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  </div>
                  <div>Actor: <span className="text-white">{log.actorUserIdRef}</span> | Entity: <span className="text-cyan-300">{log.entityIdRef}</span></div>
                  <div className="text-[10px] text-slate-500 truncate">Current Hash: {log.currentHash}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
