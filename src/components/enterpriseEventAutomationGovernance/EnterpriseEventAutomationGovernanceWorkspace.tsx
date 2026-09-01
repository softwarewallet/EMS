import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  FileCode,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  ShieldAlert,
  ListTodo,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Check,
  X,
  Radio,
  Sliders,
  Bell,
  Send,
  HelpCircle,
  Eye,
  Server
} from 'lucide-react';

import {
  EnterpriseEventDefinition,
  EnterpriseEventEnvelope,
  EnterpriseEventSubscription,
  EnterpriseEventSource,
  EnterpriseBusinessRule,
  EnterpriseRuleVersion,
  EnterpriseAutomationPolicy,
  EnterpriseAutomationExecution,
  EnterpriseWorkQueue,
  EnterpriseWorkQueueItem,
  EnterpriseActionRequest,
  EnterpriseEscalationPolicy,
  EnterpriseAutomationException,
  EnterpriseDeadLetterEvent,
  EnterpriseAutomationDiagnostic,
  ScenarioType806,
  SimulationResult806
} from '../../types/enterpriseEventAutomationGovernance';
import { EnterpriseEventAutomationGovernanceService } from '../../services/enterpriseEventAutomationGovernanceService';

export const EnterpriseEventAutomationGovernanceWorkspace: React.FC = () => {
  const tenantId = 'tenant-main-edu';
  const [activeTab, setActiveTab] = useState<string>('command');

  // Initial Data State
  const [rules, setRules] = useState<EnterpriseBusinessRule[]>(
    EnterpriseEventAutomationGovernanceService.getInitialRules(tenantId)
  );
  const [queues, setQueues] = useState<EnterpriseWorkQueue[]>(
    EnterpriseEventAutomationGovernanceService.getInitialQueues(tenantId)
  );
  const [eventSources] = useState<EnterpriseEventSource[]>(
    EnterpriseEventAutomationGovernanceService.getInitialSources(tenantId)
  );

  const [exceptions] = useState<EnterpriseAutomationException[]>([
    {
      id: 'exc-auto-01',
      tenantId,
      exceptionCode: 'EXC-RULE-SLA-001',
      title: 'Temporary SLA Escalation Suppression for Grade Appeals',
      businessJustification: 'High-volume end-of-semester grade appeal processing buffer.',
      compensatingControl: 'Manual daily triage by Assistant Dean.',
      affectedRuleIdRef: 'rule-001',
      requesterUserIdRef: 'usr-dean-assistant',
      approverUserIdRef: 'usr-dean-academic',
      approvedAt: '2026-08-15T00:00:00.000Z',
      expiryDate: '2026-09-15T00:00:00.000Z',
      status: 'ACTIVE',
      createdAt: '2026-08-15T00:00:00.000Z'
    }
  ]);

  const [deadLetters] = useState<EnterpriseDeadLetterEvent[]>([
    {
      id: 'dlq-001',
      tenantId,
      eventEnvelopeIdRef: 'evt-env-legacy-99',
      deadLetterCode: 'DLQ-2026-042',
      reason: 'Schema validation failed: missing mandatory courseTermIdRef',
      failureClassification: 'INVALID_SCHEMA',
      retryCount: 3,
      lastAttemptedAt: '2026-08-30T10:00:00.000Z',
      isReplayEligible: true,
      isResolved: false,
      createdAt: '2026-08-30T09:30:00.000Z'
    }
  ]);

  // Four-Eyes SoD State
  const [sodRequester, setSodRequester] = useState<string>('usr-rule-author');
  const [sodApprover, setSodApprover] = useState<string>('usr-governance-officer');
  const [sodMessage, setSodMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Simulation State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType806>('MASS_EVENT_SURGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult806 | null>(null);

  // Diagnostics
  const diagnostics: EnterpriseAutomationDiagnostic[] = EnterpriseEventAutomationGovernanceService.runDiagnostics(
    rules,
    queues,
    exceptions,
    deadLetters
  );

  const handleTestFourEyes = () => {
    const res = EnterpriseEventAutomationGovernanceService.validateFourEyesSoD(
      sodRequester,
      sodApprover,
      'BUSINESS_RULE_VERSION',
      'ver-rule-001-1.1'
    );
    if (res.isValid) {
      setSodMessage({
        type: 'success',
        text: `Four-Eyes Verification Passed! Requester (${sodRequester}) and Approver (${sodApprover}) are distinct identity references.`
      });
    } else {
      setSodMessage({
        type: 'error',
        text: res.reason || 'Four-Eyes SoD verification failed.'
      });
    }
  };

  const handleRunSimulation = () => {
    const res = EnterpriseEventAutomationGovernanceService.executeWhatIfSimulation(selectedScenario);
    setSimulationResult(res);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-950 border border-amber-700/50 rounded-xl text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                Enterprise Event, Work Queue & Action Governance Control Plane
              </h1>
              <p className="text-xs text-slate-400">
                Phase 8.6 • Reference-Only Governed Automation, Deterministic Business Rules, Work Queues & Escalation
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
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Resilience Sandbox</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (14 Views) */}
      <div className="flex overflow-x-auto space-x-1 border-b border-slate-800 pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {[
          { id: 'command', label: '1. Executive Command', icon: Activity },
          { id: 'registry', label: '2. Event Registry', icon: Radio },
          { id: 'subscriptions', label: '3. Subscriptions', icon: Sliders },
          { id: 'rules', label: '4. Business Rules', icon: FileCode },
          { id: 'versions', label: '5. Rule Versions', icon: Lock },
          { id: 'policies', label: '6. Policies', icon: ShieldAlert },
          { id: 'monitor', label: '7. Execution Monitor', icon: Eye },
          { id: 'queues', label: '8. Work Queues', icon: ListTodo },
          { id: 'sla', label: '9. SLA & Escalation', icon: Clock },
          { id: 'actions', label: '10. Action Governance', icon: Send },
          { id: 'exceptions', label: '11. Exceptions', icon: AlertTriangle },
          { id: 'deadletter', label: '12. Dead-Letter & Replay', icon: RefreshCw },
          { id: 'sandbox', label: '13. What-If Sandbox', icon: Play },
          { id: 'audit', label: '14. Diagnostics & Audit', icon: Terminal }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
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
                <span className="text-xs text-slate-400 font-medium">Active Business Rules</span>
                <FileCode className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{rules.length}</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center">
                <Check className="w-3 h-3 mr-1" /> 100% Deterministic & Versioned
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Governed Work Queues</span>
                <ListTodo className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{queues.length}</div>
              <div className="text-xs text-slate-400 mt-1">SLA Target Monitoring</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Dead-Letter Events</span>
                <RefreshCw className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{deadLetters.length}</div>
              <div className="text-xs text-rose-400 mt-1">Replay Eligible</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Diagnostic Alerts</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{diagnostics.length}</div>
              <div className="text-xs text-amber-400 mt-1">Governance Review</div>
            </div>
          </div>

          {/* Four-Eyes SoD Rule Tester */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Four-Eyes Segregation of Duties (SoD) Verifier</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Requester Identity Ref</label>
                <input
                  type="text"
                  value={sodRequester}
                  onChange={e => setSodRequester(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Approver Identity Ref</label>
                <input
                  type="text"
                  value={sodApprover}
                  onChange={e => setSodApprover(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleTestFourEyes}
                  className="w-full px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs transition-colors"
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

          {/* Event Sources Telemetry Panel */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-sky-400" />
              <span>Observed Event Sources Telemetry</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventSources.map(s => (
                <div key={s.id} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-sky-300 font-bold">{s.sourceCode}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        s.status === 'HEALTHY'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800/50'
                          : 'bg-rose-950 text-rose-400 border-rose-800/50'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{s.name}</h4>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    {s.isTelemetryAvailable ? (
                      <div>Heartbeat: <span className="font-mono text-slate-200">{s.lastHeartbeat}</span></div>
                    ) : (
                      <div className="text-amber-400 font-mono font-bold">INSUFFICIENT DATA • TELEMETRY UNCONFIGURED</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EVENT REGISTRY */}
      {activeTab === 'registry' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Radio className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Enterprise Event Catalog & Schema Governance</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            18 standard governed event categories registered across institutional modules.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            18 GOVERNED EVENT CATEGORIES ACTIVE
          </div>
        </div>
      )}

      {/* VIEW 3: EVENT SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Sliders className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Event Subscriptions & Routing Policies</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Deterministic bindings connecting observed event categories to business rules.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 4: BUSINESS RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Business Rules</h2>
            <div className="text-xs text-slate-400">Deterministic Versioned Rules</div>
          </div>
          <div className="space-y-3">
            {rules.map(r => (
              <div key={r.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-amber-300">{r.ruleCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {r.lifecycle} (v{r.activeVersionNumber})
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{r.title}</h4>
                <p className="text-xs text-slate-400">{r.description}</p>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pt-2 border-t border-slate-800">
                  <span>Match Type: <strong className="text-slate-200">{r.matchType}</strong></span>
                  <span>Category: <strong className="text-slate-200">{r.category}</strong></span>
                  <span>Owner: <strong className="text-slate-200 font-mono">{r.ownerUserIdRef}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: RULE VERSIONS */}
      {activeTab === 'versions' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Lock className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Immutable Business Rule Versions</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            SHA-256 version snapshots requiring mandatory Four-Eyes approval for activation.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 6: AUTOMATION POLICIES */}
      {activeTab === 'policies' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <ShieldAlert className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Automation Policies & Recursion Limits</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Global constraints: Max Execution Depth = 5, Max Action Count = 10, Recursion Protection Active.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            GLOBAL RECURSION LIMIT: 5 STEPS
          </div>
        </div>
      )}

      {/* VIEW 7: EXECUTION MONITOR */}
      {activeTab === 'monitor' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Eye className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Automation Execution Monitor</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Real-time execution telemetry.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 8: WORK QUEUES */}
      {activeTab === 'queues' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Enterprise Work Queues</h2>
            <div className="text-xs text-slate-400">Queue Ownership & Capacity Monitoring</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queues.map(q => (
              <div key={q.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-sky-300">{q.queueCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {q.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-100">{q.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{q.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 text-xs text-slate-400">
                  <div>Active Items: <strong className="text-amber-400">{q.activeItemCount} / {q.maxCapacity}</strong></div>
                  <div>SLA Target: <strong className="text-slate-200">{q.targetSlaMinutes} mins</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 9: SLA & ESCALATION */}
      {activeTab === 'sla' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Clock className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">SLA Monitoring & Deterministic Escalation</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Deterministic escalation level dispatching upon SLA warning and breach thresholds.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 10: ACTION GOVERNANCE */}
      {activeTab === 'actions' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Send className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Controlled Action Catalog & Cross-Module Authorization</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            13 explicit action types requiring 8-stage authorization validation.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            13 CONTROLLED ACTION TYPES AUTHORIZED
          </div>
        </div>
      )}

      {/* VIEW 11: EXCEPTIONS */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Automation Exceptions</h2>
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
                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">{e.businessJustification}</p>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>Expiry Date: <strong className="text-amber-300 font-mono">{new Date(e.expiryDate).toLocaleDateString()}</strong></span>
                  <span>Requester: <strong className="text-slate-300 font-mono">{e.requesterUserIdRef}</strong></span>
                  <span>Approver: <strong className="text-slate-300 font-mono">{e.approverUserIdRef}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 12: DEAD-LETTER & REPLAY */}
      {activeTab === 'deadletter' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Dead-Letter Queue & Replay Governance</h2>
            <div className="text-xs text-slate-400">Authorized Event Replay Engine</div>
          </div>
          <div className="space-y-3">
            {deadLetters.map(d => (
              <div key={d.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-rose-300">{d.deadLetterCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-950 text-rose-400 border border-rose-800/50">
                    {d.failureClassification}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-2 rounded border border-slate-800">{d.reason}</p>
                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                  <span>Retries: <strong className="text-slate-200">{d.retryCount}</strong></span>
                  <span>Replay Eligible: <strong className="text-emerald-400">{d.isReplayEligible ? 'YES' : 'NO'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 13: RESILIENCE WHAT-IF SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="p-3 bg-amber-950/60 border border-amber-800/50 rounded-xl text-center">
            <span className="text-xs font-bold text-amber-300 tracking-wider">
              SIMULATION ONLY • SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
            </span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>What-If Automation Resilience Simulation Engine (15 Scenarios)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Resilience Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as ScenarioType806)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="MASS_EVENT_SURGE">1. MASS_EVENT_SURGE</option>
                  <option value="RULE_FAILURE">2. RULE_FAILURE</option>
                  <option value="WORK_QUEUE_OVERLOAD">3. WORK_QUEUE_OVERLOAD</option>
                  <option value="SLA_BREACH_CASCADE">4. SLA_BREACH_CASCADE</option>
                  <option value="NOTIFICATION_PROVIDER_FAILURE">5. NOTIFICATION_PROVIDER_FAILURE</option>
                  <option value="CROSS_MODULE_OUTAGE">6. CROSS_MODULE_OUTAGE</option>
                  <option value="DUPLICATE_EVENT_STORM">7. DUPLICATE_EVENT_STORM</option>
                  <option value="CYBER_ALERT_SURGE">8. CYBER_ALERT_SURGE</option>
                  <option value="COMPLIANCE_ALERT_SURGE">9. COMPLIANCE_ALERT_SURGE</option>
                  <option value="SAFETY_ALERT_SURGE">10. SAFETY_ALERT_SURGE</option>
                  <option value="CONTRACT_EXPIRING_WAVE">11. CONTRACT_EXPIRING_WAVE</option>
                  <option value="DATA_QUALITY_DEGRADATION">12. DATA_QUALITY_DEGRADATION</option>
                  <option value="AUTOMATION_DEPENDENCY_FAILURE">13. AUTOMATION_DEPENDENCY_FAILURE</option>
                  <option value="DEAD_LETTER_BACKLOG">14. DEAD_LETTER_BACKLOG</option>
                  <option value="MULTI_MODULE_CASCADE">15. MULTI_MODULE_CASCADE</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleRunSimulation}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
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
                    <span className="text-xs text-amber-400 font-bold">SCENARIO EXECUTION RESULTS</span>
                    <h4 className="text-sm font-semibold text-slate-100">{simulationResult.scenario}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{simulationResult.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Simulated Events</span>
                    <div className="text-lg font-bold text-slate-100 mt-1">{simulationResult.simulatedEventsCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Rules Evaluated</span>
                    <div className="text-lg font-bold text-amber-300 mt-1">{simulationResult.rulesEvaluatedCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Actions Triggered</span>
                    <div className="text-lg font-bold text-emerald-400 mt-1">{simulationResult.actionsTriggeredCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Circuit Breaker</span>
                    <div className="text-xs font-mono text-sky-300 mt-1">
                      {simulationResult.circuitBreakerActivated ? 'ACTIVATED (SAFE)' : 'INACTIVE'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded text-slate-300">
                  <strong className="text-amber-400">Simulation Summary:</strong> {simulationResult.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 14: DIAGNOSTICS & IMMUTABLE AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Diagnostics & Immutable Automation Audit Trail</h2>
            <div className="text-xs text-slate-400">Automated Governance Diagnostics</div>
          </div>
          <div className="space-y-2">
            {diagnostics.length === 0 ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero diagnostic anomalies detected across event rules, queues, and automation exceptions.</span>
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
                  <p className="text-xs text-amber-300 pt-1">Recommendation: {d.recommendation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
