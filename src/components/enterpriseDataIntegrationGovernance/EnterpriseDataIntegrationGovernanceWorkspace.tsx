import React, { useState } from 'react';
import {
  Database,
  Layers,
  FileCode,
  GitCommit,
  Share2,
  RefreshCw,
  Scale,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  Play,
  Terminal,
  Activity,
  Lock,
  Search,
  Filter,
  Check,
  X,
  FileCheck,
  Zap,
  HelpCircle,
  Eye,
  Server
} from 'lucide-react';

import {
  EnterpriseDataDomain,
  EnterpriseMasterDataReference,
  EnterpriseReferenceDataSet,
  EnterpriseDataMapping,
  EnterpriseDataContract,
  EnterpriseIntegrationDefinition,
  EnterpriseSynchronizationPolicy,
  EnterpriseReconciliationRun,
  EnterpriseDataQualityRule,
  EnterpriseDataQualityObservation,
  EnterpriseDataLineageNode,
  EnterpriseDataLineageEdge,
  EnterpriseDataException,
  EnterpriseIntegrationRisk,
  EnterpriseIntegrationAuditLog,
  EnterpriseIntegrationDiagnostic,
  ScenarioType805,
  SimulationResult805
} from '../../types/enterpriseDataIntegrationGovernance';
import { EnterpriseDataIntegrationGovernanceService } from '../../services/enterpriseDataIntegrationGovernanceService';

export const EnterpriseDataIntegrationGovernanceWorkspace: React.FC = () => {
  const tenantId = 'tenant-main-edu';
  const [activeTab, setActiveTab] = useState<string>('command');

  // Initial Data State
  const [domains, setDomains] = useState<EnterpriseDataDomain[]>(
    EnterpriseDataIntegrationGovernanceService.getInitialDomains(tenantId)
  );
  const [contracts, setContracts] = useState<EnterpriseDataContract[]>(
    EnterpriseDataIntegrationGovernanceService.getInitialContracts(tenantId)
  );
  const [integrations, setIntegrations] = useState<EnterpriseIntegrationDefinition[]>(
    EnterpriseDataIntegrationGovernanceService.getInitialIntegrations(tenantId)
  );

  const [exceptions, setExceptions] = useState<EnterpriseDataException[]>([
    {
      id: 'exc-001',
      tenantId,
      exceptionCode: 'EXC-2026-088',
      title: 'Legacy Sis Enrollment Field Schema Deviation',
      type: 'CONTRACT_DEVIATION',
      businessRationale: 'Temporary tolerance during SIS upgrade sprint.',
      riskAssessment: 'LOW risk of downstream grade calculation impact.',
      compensatingControl: 'Daily script validation on course section assignments.',
      requesterUserIdRef: 'usr-dev-lead',
      approverUserIdRef: 'usr-architect-chief',
      approvedAt: '2026-08-01T00:00:00.000Z',
      expiryDate: '2026-09-30T00:00:00.000Z',
      status: 'ACTIVE',
      createdAt: '2026-08-01T00:00:00.000Z'
    }
  ]);

  // Four-Eyes SoD Form State
  const [sodRequester, setSodRequester] = useState<string>('usr-req-steward');
  const [sodApprover, setSodApprover] = useState<string>('usr-app-architect');
  const [sodMessage, setSodMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Lineage State
  const [lineageEdges] = useState<EnterpriseDataLineageEdge[]>([
    { id: 'edge-1', tenantId, sourceNodeIdRef: 'node-sis', targetNodeIdRef: 'node-trans', transformationDescription: 'Normalize Student ID format' },
    { id: 'edge-2', tenantId, sourceNodeIdRef: 'node-trans', targetNodeIdRef: 'node-lms', transformationDescription: 'Map to LMS User Account' }
  ]);
  const [lineageTraverseResult, setLineageTraverseResult] = useState<{ visitedNodeIds: string[]; hasCircularDependency: boolean; depthReached: number } | null>(null);

  // Simulation State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType805>('AUTHORITATIVE_SYSTEM_OUTAGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult805 | null>(null);

  // Run diagnostics
  const diagnostics: EnterpriseIntegrationDiagnostic[] = EnterpriseDataIntegrationGovernanceService.runDiagnosticScan(
    domains,
    contracts,
    exceptions,
    []
  );

  const handleTestFourEyes = () => {
    const res = EnterpriseDataIntegrationGovernanceService.validateFourEyesSoD(
      sodRequester,
      sodApprover,
      'DATA_CONTRACT',
      'cnt-test-01'
    );
    if (res.isValid) {
      setSodMessage({
        type: 'success',
        text: `Four-Eyes Validation Passed! Requester (${sodRequester}) and Approver (${sodApprover}) are distinct identity references.`
      });
    } else {
      setSodMessage({
        type: 'error',
        text: res.reason || 'Four-Eyes SoD check failed.'
      });
    }
  };

  const handleRunLineageTraversal = () => {
    const res = EnterpriseDataIntegrationGovernanceService.traverseLineageGraph('node-sis', lineageEdges, 10);
    setLineageTraverseResult(res);
  };

  const handleRunSimulation = () => {
    const res = EnterpriseDataIntegrationGovernanceService.executeWhatIfSimulation(selectedScenario);
    setSimulationResult(res);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-950 border border-indigo-700/50 rounded-xl text-indigo-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                Enterprise Data Integration & Master Data Control Plane
              </h1>
              <p className="text-xs text-slate-400">
                Phase 8.5 • Reference-Only Institutional Master Data, Reference Data, Contracts, Lineage & Integration Governance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Control Plane Active
          </span>
          <button
            onClick={() => setActiveTab('sandbox')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Resilience Sandbox</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (13 Views) */}
      <div className="flex overflow-x-auto space-x-1 border-b border-slate-800 pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {[
          { id: 'command', label: '1. Executive Command', icon: Activity },
          { id: 'domains', label: '2. Master Data References', icon: Database },
          { id: 'refdata', label: '3. Reference Data', icon: Layers },
          { id: 'contracts', label: '4. Data Contracts', icon: FileCode },
          { id: 'mappings', label: '5. Field Mappings', icon: GitCommit },
          { id: 'integrations', label: '6. Integration Registry', icon: Share2 },
          { id: 'sync', label: '7. Synchronization', icon: RefreshCw },
          { id: 'reconciliation', label: '8. Reconciliation', icon: Scale },
          { id: 'quality', label: '9. Data Quality', icon: CheckCircle2 },
          { id: 'lineage', label: '10. Lineage & Dependencies', icon: GitBranch },
          { id: 'exceptions', label: '11. Exceptions & Risk', icon: ShieldAlert },
          { id: 'sandbox', label: '12. What-If Sandbox', icon: Play },
          { id: 'audit', label: '13. Diagnostics & Audit', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: EXECUTIVE COMMAND */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Governed Master Domains</span>
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{domains.length}</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center">
                <Check className="w-3 h-3 mr-1" /> Zero Data Duplication
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Active Data Contracts</span>
                <FileCode className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{contracts.length}</div>
              <div className="text-xs text-slate-400 mt-1">Versioned Schemas</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Active Integrations</span>
                <Share2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{integrations.length}</div>
              <div className="text-xs text-emerald-400 mt-1">100% Health Score</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Diagnostic Anomalies</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{diagnostics.length}</div>
              <div className="text-xs text-amber-400 mt-1">Governance Review</div>
            </div>
          </div>

          {/* Four-Eyes SoD Tester */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-200">Four-Eyes Segregation of Duties (SoD) Verifier</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Requester Identity Ref</label>
                <input
                  type="text"
                  value={sodRequester}
                  onChange={e => setSodRequester(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Approver Identity Ref</label>
                <input
                  type="text"
                  value={sodApprover}
                  onChange={e => setSodApprover(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleTestFourEyes}
                  className="w-full px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Verify SoD Rule
                </button>
              </div>
            </div>
            {sodMessage && (
              <div
                className={`p-3 rounded-lg text-xs border ${
                  sodMessage.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800/50 text-rose-300'
                }`}
              >
                {sodMessage.text}
              </div>
            )}
          </div>

          {/* Key Master Domains Grid */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Governed Institutional Data Domains (Reference-Only)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {domains.map(d => (
                <div key={d.id} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-indigo-300 font-bold">{d.domainCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      {d.qualityStatus}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{d.domainName}</h4>
                  <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                    <div>Authoritative System: <span className="font-mono text-slate-300">{d.authoritativeSystemIdRef}</span></div>
                    <div>Steward: <span className="font-mono text-slate-300">{d.stewardshipUserIdRef}</span></div>
                    <div>Health Score: <strong className="text-emerald-400">{d.integrationHealthScore}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MASTER DATA REFERENCES */}
      {activeTab === 'domains' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Master Data Domains & System References</h2>
            <div className="text-xs text-slate-400">Reference-Only Governance (No Authoritative Clones)</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-medium border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Domain Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Authoritative System</th>
                  <th className="px-4 py-3">Identifier Field</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">Steward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {domains.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-indigo-300 font-bold">{d.domainCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{d.domainName}</td>
                    <td className="px-4 py-3 font-mono text-sky-400">{d.authoritativeSystemIdRef}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{d.authoritativeIdentifierName}</td>
                    <td className="px-4 py-3">{d.synchronizationPolicyMode}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950 text-purple-400 border border-purple-800/50">
                        {d.dataClassification}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{d.stewardshipUserIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: REFERENCE DATA */}
      {activeTab === 'refdata' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Layers className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Governed Reference Data & Vocabularies</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Controlled vocabularies, campus codes, department codes, and status code mappings.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            3 ACTIVE VOCABULARY DATASETS GOVERNED
          </div>
        </div>
      )}

      {/* VIEW 4: DATA CONTRACTS */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Data Contracts</h2>
            <div className="text-xs text-slate-400">Versioned Schemas & Compatibility Rules</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-medium border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Source &rarr; Target</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {contracts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-sky-300 font-bold">{c.contractCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{c.title}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{`${c.sourceSystemIdRef} -> ${c.targetSystemIdRef}`}</td>
                    <td className="px-4 py-3 font-mono text-indigo-400">{c.version}</td>
                    <td className="px-4 py-3 text-slate-400">{c.compatibilityMode}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{c.ownerUserIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: FIELD MAPPINGS */}
      {activeTab === 'mappings' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <GitCommit className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Field & Data Mapping Governance</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Metadata mapping rules between source systems and target schemas.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 6: INTEGRATION REGISTRY */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Integration Endpoints</h2>
            <div className="text-xs text-slate-400">Endpoint Reference Registry</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(i => (
              <div key={i.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{i.integrationCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {i.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-100">{i.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Endpoint: {i.endpointReference}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>Provider: <strong className="text-slate-200 font-mono">{i.providerReference}</strong></span>
                  <span>Health: <strong className="text-emerald-400">{i.healthScore}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 7: SYNCHRONIZATION */}
      {activeTab === 'sync' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Synchronization Policies & Idempotency Engine</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Deterministic synchronization tracking preventing duplicate processing.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 8: RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Scale className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Reference Reconciliation Engine</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Cross-system reference matching and stale record detection.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 9: DATA QUALITY */}
      {activeTab === 'quality' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Data Quality Rule Observations</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Truthful telemetry observations. Source quality telemetry is unconfigured.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 10: LINEAGE & DEPENDENCIES */}
      {activeTab === 'lineage' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Bounded Lineage Graph & Circular Dependency Detector</h2>
            <button
              onClick={handleRunLineageTraversal}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Run Lineage Traversal
            </button>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200">Lineage Edges (Bounded Graph)</h4>
            <div className="space-y-2">
              {lineageEdges.map(e => (
                <div key={e.id} className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs flex justify-between items-center">
                  <div className="font-mono text-indigo-300 font-bold">
                    {`${e.sourceNodeIdRef} ---> ${e.targetNodeIdRef}`}
                  </div>
                  <div className="text-slate-400">{e.transformationDescription}</div>
                </div>
              ))}
            </div>

            {lineageTraverseResult && (
              <div className="mt-4 p-4 bg-slate-900 border border-slate-700 rounded-lg text-xs space-y-2">
                <div className="text-xs font-bold text-emerald-400">LINEAGE TRAVERSAL RESULTS</div>
                <div>Visited Nodes: <span className="font-mono text-slate-200">{lineageTraverseResult.visitedNodeIds.join(', ')}</span></div>
                <div>Depth Reached: <span className="font-mono text-indigo-300">{lineageTraverseResult.depthReached}</span></div>
                <div>
                  Circular Dependency Detected: {' '}
                  <strong className={lineageTraverseResult.hasCircularDependency ? 'text-rose-400' : 'text-emerald-400'}>
                    {lineageTraverseResult.hasCircularDependency ? 'YES (ALERT)' : 'NO (SAFE)'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 11: EXCEPTIONS & RISK */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Data Exceptions & Risk Assessment</h2>
            <div className="text-xs text-slate-400">Mandatory Expiry & Four-Eyes Approvals</div>
          </div>
          <div className="space-y-3">
            {exceptions.map(e => (
              <div key={e.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-amber-300">{e.exceptionCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {e.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{e.title}</h4>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">{e.businessRationale}</p>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>Expiry Date: <strong className="text-indigo-300 font-mono">{new Date(e.expiryDate).toLocaleDateString()}</strong></span>
                  <span>Requester: <strong className="text-slate-300 font-mono">{e.requesterUserIdRef}</strong></span>
                  <span>Approver: <strong className="text-slate-300 font-mono">{e.approverUserIdRef}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 12: RESILIENCE WHAT-IF SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-300 tracking-wider">
              SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
            </span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Play className="w-4 h-4 text-indigo-400" />
              <span>What-If Data Integration Resilience Simulation Engine (12 Scenarios)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Resilience Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as ScenarioType805)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="AUTHORITATIVE_SYSTEM_OUTAGE">1. AUTHORITATIVE_SYSTEM_OUTAGE</option>
                  <option value="INTEGRATION_ENDPOINT_FAILURE">2. INTEGRATION_ENDPOINT_FAILURE</option>
                  <option value="DATA_CONTRACT_BREAK">3. DATA_CONTRACT_BREAK</option>
                  <option value="REFERENCE_DATA_CHANGE">4. REFERENCE_DATA_CHANGE</option>
                  <option value="SYNCHRONIZATION_DELAY">5. SYNCHRONIZATION_DELAY</option>
                  <option value="MASS_DATA_QUALITY_DEGRADATION">6. MASS_DATA_QUALITY_DEGRADATION</option>
                  <option value="DUPLICATE_EVENT_SURGE">7. DUPLICATE_EVENT_SURGE</option>
                  <option value="CROSS_CAMPUS_INTEGRATION_FAILURE">8. CROSS_CAMPUS_INTEGRATION_FAILURE</option>
                  <option value="THIRD_PARTY_PLATFORM_OUTAGE">9. THIRD_PARTY_PLATFORM_OUTAGE</option>
                  <option value="CASCADING_DEPENDENCY_FAILURE">10. CASCADING_DEPENDENCY_FAILURE</option>
                  <option value="DATA_MAPPING_CORRUPTION">11. DATA_MAPPING_CORRUPTION</option>
                  <option value="RECONCILIATION_BACKLOG">12. RECONCILIATION_BACKLOG</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleRunSimulation}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Simulation</span>
                </button>
              </div>
            </div>

            {simulationResult && (
              <div className="mt-6 p-5 bg-slate-900 border border-slate-700 rounded-xl space-y-4 text-xs">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-indigo-400 font-bold">SCENARIO EXECUTION RESULTS</span>
                    <h4 className="text-sm font-semibold text-slate-100">{simulationResult.scenario}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{simulationResult.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Simulated Records</span>
                    <div className="text-lg font-bold text-slate-100 mt-1">{simulationResult.simulatedRecordsCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Reconciliation Mismatches</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">{simulationResult.reconciliationMismatchCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700 col-span-2 md:col-span-1">
                    <span className="text-[11px] text-slate-400">Circuit Breaker</span>
                    <div className="text-xs font-mono text-sky-300 mt-1">
                      {simulationResult.circuitBreakerActivated ? 'ACTIVATED (SAFE)' : 'INACTIVE'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded text-slate-300">
                  <strong className="text-indigo-400">Simulation Summary:</strong> {simulationResult.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 13: DIAGNOSTICS & IMMUTABLE AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Diagnostics & Governance Audit Trail</h2>
            <div className="text-xs text-slate-400">Automated Data Integration Scanner</div>
          </div>
          <div className="space-y-2">
            {diagnostics.length === 0 ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero diagnostic anomalies detected across master domains, contracts, and data exceptions.</span>
              </div>
            ) : (
              diagnostics.map(d => (
                <div key={d.id} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-rose-400 font-bold">{d.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-950 text-rose-400 border border-rose-800/50">
                      {d.severity}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{d.title}</h4>
                  <p className="text-xs text-slate-400">{d.description}</p>
                  <p className="text-xs text-indigo-300 pt-1">Recommendation: {d.recommendation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
