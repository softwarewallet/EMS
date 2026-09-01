import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  Radio,
  FileText,
  Bell,
  Users,
  AlertTriangle,
  Send,
  LifeBuoy,
  FileCheck,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Terminal,
  RefreshCw,
  Search,
  Filter,
  Lock,
  Layers,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';

import {
  EnterpriseCommunicationPolicy,
  EnterpriseCommunicationChannel,
  EnterpriseCommunicationTemplate,
  EnterpriseCommunicationCampaign,
  EnterpriseCommunicationMessage,
  EnterpriseCommunicationRecipientGroup,
  EnterpriseCommunicationAudience,
  EnterpriseNotificationRule,
  EnterpriseAlertInstance,
  EnterpriseOfficialNotice,
  EnterpriseEmergencyCommunication,
  EnterpriseCommunicationDiagnostic,
  ScenarioType804,
  SimulationResult804
} from '../../types/enterpriseCommunicationGovernance';
import { EnterpriseCommunicationGovernanceService } from '../../services/enterpriseCommunicationGovernanceService';

export const EnterpriseCommunicationGovernanceWorkspace: React.FC = () => {
  const tenantId = 'tenant-main-edu';
  const [activeTab, setActiveTab] = useState<string>('command');
  
  // Data State
  const [policies, setPolicies] = useState<EnterpriseCommunicationPolicy[]>(
    EnterpriseCommunicationGovernanceService.getInitialPolicies(tenantId)
  );
  const [channels, setChannels] = useState<EnterpriseCommunicationChannel[]>(
    EnterpriseCommunicationGovernanceService.getInitialChannels(tenantId)
  );
  const [templates, setTemplates] = useState<EnterpriseCommunicationTemplate[]>(
    EnterpriseCommunicationGovernanceService.getInitialTemplates(tenantId)
  );
  const [alerts, setAlerts] = useState<EnterpriseAlertInstance[]>(
    EnterpriseCommunicationGovernanceService.getInitialAlerts(tenantId)
  );
  const [officialNotices, setOfficialNotices] = useState<EnterpriseOfficialNotice[]>(
    EnterpriseCommunicationGovernanceService.getInitialOfficialNotices(tenantId)
  );
  const [emergencies, setEmergencies] = useState<EnterpriseEmergencyCommunication[]>([
    {
      id: 'emg-001',
      tenantId,
      emergencyCode: 'EMG-2026-001',
      scenario: 'SEVERE_WEATHER',
      title: 'Severe Weather Warning Dispatched',
      messageBody: 'Campus evacuation notice due to incoming severe storm advisory.',
      isSandboxSimulation: false,
      requesterUserIdRef: 'usr-safety-officer',
      approverUserIdRef: 'usr-campus-director',
      status: 'DISPATCHED',
      safetyIncidentRef: 'inc-phase764-001',
      dispatchedAt: '2026-08-30T08:30:00.000Z',
      createdAt: '2026-08-30T08:00:00.000Z',
      updatedAt: '2026-08-30T08:30:00.000Z'
    }
  ]);

  // Form states
  const [sodRequester, setSodRequester] = useState<string>('usr-req-001');
  const [sodApprover, setSodApprover] = useState<string>('usr-app-002');
  const [sodMessage, setSodMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Simulation State
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType804>('EMAIL_PROVIDER_OUTAGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult804 | null>(null);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState<string>('');

  const diagnostics: EnterpriseCommunicationDiagnostic[] = EnterpriseCommunicationGovernanceService.runDiagnosticScan(
    policies,
    templates,
    alerts,
    [],
    emergencies
  );

  const handleTestFourEyes = () => {
    const res = EnterpriseCommunicationGovernanceService.validateFourEyesSoD(
      sodRequester,
      sodApprover,
      'EMERGENCY_DISPATCH',
      'emg-new-test'
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

  const handleRunSimulation = () => {
    const res = EnterpriseCommunicationGovernanceService.executeWhatIfSimulation(selectedScenario);
    setSimulationResult(res);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-950 border border-indigo-700/50 rounded-xl text-indigo-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                Communication & Official Messaging Governance
              </h1>
              <p className="text-xs text-slate-400">
                Phase 8.4 • Reference-Only Institutional Messaging, Alert, Notification & Emergency Control Plane
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
            <span>What-If Resilience Sandbox</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (13 Sections) */}
      <div className="flex overflow-x-auto space-x-1 border-b border-slate-800 pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {[
          { id: 'command', label: '1. Executive Command', icon: Activity },
          { id: 'policies', label: '2. Policies', icon: ShieldAlert },
          { id: 'channels', label: '3. Channels & Telemetry', icon: Radio },
          { id: 'templates', label: '4. Templates', icon: FileText },
          { id: 'campaigns', label: '5. Campaigns', icon: Send },
          { id: 'audiences', label: '6. Audiences', icon: Users },
          { id: 'rules', label: '7. Notification Rules', icon: Layers },
          { id: 'alerts', label: '8. Alerts & Escalation', icon: Bell },
          { id: 'emergency', label: '9. Emergency Dispatch', icon: AlertTriangle },
          { id: 'notices', label: '10. Official Notices', icon: FileCheck },
          { id: 'reliability', label: '11. Reliability', icon: LifeBuoy },
          { id: 'audit', label: '12. Risks & Audit', icon: Terminal },
          { id: 'sandbox', label: '13. What-If Sandbox', icon: Play }
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
                <span className="text-xs text-slate-400 font-medium">Active Policies</span>
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{policies.length}</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center">
                <Check className="w-3 h-3 mr-1" /> 100% Governed Scope
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Governed Channels</span>
                <Radio className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{channels.length}</div>
              <div className="text-xs text-slate-400 mt-1">Reference Integrations</div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Active High Alerts</span>
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{alerts.length}</div>
              <div className="text-xs text-amber-400 mt-1 flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Four-Eyes Protected
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400 font-medium">Diagnostic Anomalies</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-2">{diagnostics.length}</div>
              <div className="text-xs text-rose-400 mt-1">Requires Governance Review</div>
            </div>
          </div>

          {/* Quick Four-Eyes Tester */}
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

          {/* Key Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <span>Recent Official Notices</span>
              </h3>
              <div className="space-y-2">
                {officialNotices.map(n => (
                  <div key={n.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-medium text-slate-200">{n.noticeNumber}: {n.title}</div>
                      <div className="text-slate-400 text-[11px]">{n.issuingAuthority} • Published {new Date(n.publicationDate).toLocaleDateString()}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      {n.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Active Emergency Dispatches</span>
              </h3>
              <div className="space-y-2">
                {emergencies.map(e => (
                  <div key={e.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-medium text-slate-200">{e.emergencyCode}: {e.title}</div>
                      <div className="text-slate-400 text-[11px]">Ref: {e.safetyIncidentRef} • Requester: {e.requesterUserIdRef}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-950 text-rose-400 border border-rose-800/50">
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: POLICIES */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Institutional Communication Policies</h2>
            <div className="text-xs text-slate-400">Reference-Only Policy Governance</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-medium border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Scope</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">Owner Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {policies.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-indigo-300">{p.policyCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{p.title}</td>
                    <td className="px-4 py-3 text-slate-400">{p.scope}</td>
                    <td className="px-4 py-3 font-mono">{p.version}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950 text-purple-400 border border-purple-800/50">
                        {p.dataClassification}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{p.ownerUserIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: CHANNELS */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Channels & Integration Adapters</h2>
            <div className="text-xs text-slate-400">Provider References (No Authoritative Data Duplication)</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map(c => (
              <div key={c.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-sky-400">{c.channelCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {c.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-100">{c.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">Provider Ref: <span className="font-mono">{c.providerReference}</span></p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>Reliability: <strong className="text-slate-200">{c.reliabilityObservationPercentage}%</strong></span>
                  <span>Priority: <strong className="text-indigo-400">{c.escalationPriority}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Governed Communication Templates</h2>
            <div className="text-xs text-slate-400">Immutable Checksums & Revision Control</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-medium border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Audience Type</th>
                  <th className="px-4 py-3">Checksum</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Owner Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {templates.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-indigo-300">{t.templateCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{t.title}</td>
                    <td className="px-4 py-3 text-slate-400">{t.audienceType}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{t.contentChecksum}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{t.ownerUserIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 5: CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Send className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Campaigns & Mass Communication Control</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Governed campaign dispatches reference external audience groups without duplicating personal PII.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 6: AUDIENCES */}
      {activeTab === 'audiences' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Users className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Audiences & Recipient Governance</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Small-cell privacy protection enforced. Direct user identity lookup requires authoritative directory reference.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 7: RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Deterministic Notification Rules</h2>
            <div className="text-xs text-slate-400">Idempotency & Event Trigger Rules</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-mono text-indigo-300 font-semibold">RULE-SLA-BREACH</span>
                <span className="ml-3 text-slate-200">Trigger SLA breach notification on Phase 8.2 Case</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400">ACTIVE</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-mono text-indigo-300 font-semibold">RULE-EMERGENCY-DISPATCH</span>
                <span className="ml-3 text-slate-200">Trigger multi-channel dispatch on Safety EHS Alert</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 8: ALERTS & ESCALATION */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Institutional Alerts & Escalation Policies</h2>
            <div className="text-xs text-slate-400">Four-Eyes Approval Enforced</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-medium border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requester Ref</th>
                  <th className="px-4 py-3">Approver Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-amber-300">{a.instanceCode}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{a.title}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-950 text-rose-400 border border-rose-800/50">
                        {a.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{a.status}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{a.requesterUserIdRef}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{a.approverUserIdRef || 'PENDING'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 9: EMERGENCY COMMUNICATIONS */}
      {activeTab === 'emergency' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Emergency Communication Governance</h2>
            <div className="text-xs text-slate-400">Phase 7.64 / 7.71 / 7.72 / 8.1 / 8.2 Integration</div>
          </div>
          <div className="space-y-3">
            {emergencies.map(e => (
              <div key={e.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-amber-300">{e.emergencyCode}</span>
                    <span className="text-xs text-slate-300 font-medium">• {e.scenario}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {e.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{e.title}</h4>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">{e.messageBody}</p>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>Safety Ref: <strong className="text-slate-300 font-mono">{e.safetyIncidentRef || 'N/A'}</strong></span>
                  <span>Requester: <strong className="text-slate-300 font-mono">{e.requesterUserIdRef}</strong></span>
                  <span>Approver: <strong className="text-slate-300 font-mono">{e.approverUserIdRef || 'N/A'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 10: OFFICIAL NOTICES */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Official Notices & Legal Directives</h2>
            <div className="text-xs text-slate-400">Phase 8.3 Document & Records Integration</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
            {officialNotices.map(n => (
              <div key={n.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-mono text-indigo-300 font-bold">{n.noticeNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    {n.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-100">{n.title}</h4>
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Authority: {n.issuingAuthority}</span>
                  <span>Doc Ref: <strong className="font-mono text-slate-300">{n.documentIdRef}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 11: RELIABILITY */}
      {activeTab === 'reliability' && (
        <div className="p-8 text-center bg-slate-800/30 border border-slate-700/60 rounded-xl space-y-3">
          <Radio className="w-8 h-8 text-indigo-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">Delivery & Communication Reliability Telemetry</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Truthful provider telemetry observation. Provider telemetry status is unconfigured.
          </p>
          <div className="inline-block px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 font-mono">
            INSUFFICIENT DATA
          </div>
        </div>
      )}

      {/* VIEW 12: RISKS & AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-200">Diagnostics & Security Anomalies</h2>
            <div className="text-xs text-slate-400">Automated Policy Scanner</div>
          </div>
          <div className="space-y-2">
            {diagnostics.length === 0 ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero diagnostic anomalies detected across policies, templates, alerts, and emergency dispatches.</span>
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
              <Play className="w-4 h-4 text-indigo-400" />
              <span>What-If Communication Resilience Simulation Engine (12 Scenarios)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Resilience Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as ScenarioType804)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="EMAIL_PROVIDER_OUTAGE">1. EMAIL_PROVIDER_OUTAGE</option>
                  <option value="SMS_PROVIDER_OUTAGE">2. SMS_PROVIDER_OUTAGE</option>
                  <option value="MASS_NOTIFICATION_FAILURE">3. MASS_NOTIFICATION_FAILURE</option>
                  <option value="CAMPUS_NETWORK_OUTAGE">4. CAMPUS_NETWORK_OUTAGE</option>
                  <option value="CYBER_INCIDENT">5. CYBER_INCIDENT</option>
                  <option value="FALSE_ALERT_SURGE">6. FALSE_ALERT_SURGE</option>
                  <option value="EXECUTIVE_COMMUNICATION_DELAY">7. EXECUTIVE_COMMUNICATION_DELAY</option>
                  <option value="EMERGENCY_CHANNEL_FAILURE">8. EMERGENCY_CHANNEL_FAILURE</option>
                  <option value="MULTI_CAMPUS_CRISIS">9. MULTI_CAMPUS_CRISIS</option>
                  <option value="HIGH_VOLUME_NOTIFICATION_SPIKE">10. HIGH_VOLUME_NOTIFICATION_SPIKE</option>
                  <option value="THIRD_PARTY_COMMUNICATION_FAILURE">11. THIRD_PARTY_COMMUNICATION_FAILURE</option>
                  <option value="CASCADING_ESCALATION_FAILURE">12. CASCADING_ESCALATION_FAILURE</option>
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
                    <span className="text-[11px] text-slate-400">Simulated Events</span>
                    <div className="text-lg font-bold text-slate-100 mt-1">{simulationResult.simulatedEventsCount}</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700">
                    <span className="text-[11px] text-slate-400">Success Rate</span>
                    <div className="text-lg font-bold text-emerald-400 mt-1">{simulationResult.deliverySuccessRate}%</div>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded border border-slate-700 col-span-2 md:col-span-1">
                    <span className="text-[11px] text-slate-400">Fallback Triggered</span>
                    <div className="text-xs font-mono text-sky-300 mt-1">
                      {simulationResult.fallbackChannelsTriggered.length > 0
                        ? simulationResult.fallbackChannelsTriggered.join(', ')
                        : 'None Required'}
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
    </div>
  );
};
