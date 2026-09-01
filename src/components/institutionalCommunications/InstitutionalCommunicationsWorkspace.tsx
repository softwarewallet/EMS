import React, { useState } from 'react';
import {
  Megaphone,
  Radio,
  Mail,
  FileText,
  Users,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Sliders,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Play,
  Search,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  Inbox,
  Bell,
  Lock,
  ChevronRight,
  XCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { institutionalCommunicationsService } from '../../services/institutionalCommunicationsService';
import {
  InstitutionalCommunication,
  CommunicationCampaign,
  CommunicationTemplate,
  CommunicationTemplateVersion,
  CommunicationAudience,
  CommunicationRecipient,
  CommunicationMessage,
  CommunicationDelivery,
  CommunicationAcknowledgement,
  CommunicationPreference,
  CommunicationSchedule,
  CommunicationApproval,
  CommunicationEscalation,
  InstitutionalAnnouncement,
  InstitutionalAlert,
  CorrespondenceRecord,
  CommunicationAuditEvent,
  CommunicationDiagnosticFinding,
  CommunicationSimulationScenario,
  CommunicationSimulationResult
} from '../../types/institutionalCommunications';

export const InstitutionalCommunicationsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('CAMPUS_DELHI');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Core Data Bindings
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(() => institutionalCommunicationsService.getTemplates());
  const [campaigns, setCampaigns] = useState<CommunicationCampaign[]>(() => institutionalCommunicationsService.getCampaigns());
  const [audiences, setAudiences] = useState<CommunicationAudience[]>(() => institutionalCommunicationsService.getAudiences());
  const [recipients] = useState<CommunicationRecipient[]>(() => institutionalCommunicationsService.getRecipients());
  const [communications, setCommunications] = useState<InstitutionalCommunication[]>(() => institutionalCommunicationsService.getCommunications());
  const [messages] = useState<CommunicationMessage[]>(() => institutionalCommunicationsService.getMessages());
  const [deliveries] = useState<CommunicationDelivery[]>(() => institutionalCommunicationsService.getDeliveries());
  const [acknowledgements, setAcknowledgements] = useState<CommunicationAcknowledgement[]>(() => institutionalCommunicationsService.getAcknowledgements());
  const [correspondence, setCorrespondence] = useState<CorrespondenceRecord[]>(() => institutionalCommunicationsService.getCorrespondenceRecords());
  const [announcements, setAnnouncements] = useState<InstitutionalAnnouncement[]>(() => institutionalCommunicationsService.getAnnouncements());
  const [alerts, setAlerts] = useState<InstitutionalAlert[]>(() => institutionalCommunicationsService.getAlerts());
  const [preferences] = useState<CommunicationPreference[]>(() => institutionalCommunicationsService.getPreferences());
  const [schedules] = useState<CommunicationSchedule[]>(() => institutionalCommunicationsService.getSchedules());
  const [approvals] = useState<CommunicationApproval[]>(() => institutionalCommunicationsService.getApprovals());
  const [escalations, setEscalations] = useState<CommunicationEscalation[]>(() => institutionalCommunicationsService.getEscalations());
  const [auditTrail, setAuditTrail] = useState<CommunicationAuditEvent[]>(() => institutionalCommunicationsService.getAuditTrail());

  // Diagnostics & Simulation State
  const [diagnostics, setDiagnostics] = useState<{
    findings: CommunicationDiagnosticFinding[];
    summary: { totalChecks: number; passed: number; warnings: number; errors: number };
    auditChainIntact: boolean;
  } | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<CommunicationSimulationScenario>('MASS_NOTIFICATION_SURGE');
  const [simulationResult, setSimulationResult] = useState<CommunicationSimulationResult | null>(null);

  // Template Test Form State
  const [testTemplateId, setTestTemplateId] = useState<string>('TMPL-EXAM-001');
  const [testLang, setTestLang] = useState<string>('en');
  const [testVariables, setTestVariables] = useState<string>('{\n  "student_name": "Aarav Sharma",\n  "term_code": "AUTUMN-2026",\n  "exam_start_date": "2026-11-15",\n  "venue_hall": "Hall 3B"\n}');
  const [renderedPreview, setRenderedPreview] = useState<{ subject: string; bodyText: string; isComplete: boolean; missingVariables: string[] } | null>(null);

  // Interactive Action Modals/Forms State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [newCommTitle, setNewCommTitle] = useState('');
  const [newCommRef, setNewCommRef] = useState('');
  const [newCommChannel, setNewCommChannel] = useState<'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP' | 'SYSTEM_ALERT'>('EMAIL');
  const [newCommPriority, setNewCommPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL'>('HIGH');
  const [newCommAudience, setNewCommAudience] = useState('AUD-BTECH-DELHI');
  const [newCommSubject, setNewCommSubject] = useState('');
  const [newCommBody, setNewCommBody] = useState('');

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampCode, setNewCampCode] = useState('');
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampObjective, setNewCampObjective] = useState('');
  const [newCampPriority, setNewCampPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | 'CRITICAL'>('HIGH');

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [newAlertHeadline, setNewAlertHeadline] = useState('');
  const [newAlertDesc, setNewAlertDesc] = useState('');
  const [newAlertInstructions, setNewAlertInstructions] = useState('');
  const [newAlertIssuedBy, setNewAlertIssuedBy] = useState('USER_SAFETY_OFFICER');
  const [newAlertAuthorizedBy, setNewAlertAuthorizedBy] = useState('USER_DIRECTOR_CAMPUS');

  // Trigger Notification
  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Dispatch Communication Handler
  const handleDispatchCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommTitle || !newCommRef || !newCommSubject || !newCommBody) {
      notify('error', 'Please fill in all required communication fields.');
      return;
    }

    try {
      const idempotencyKey = `IDEM-DISPATCH-${Date.now()}`;
      const result = institutionalCommunicationsService.dispatchCommunication({
        tenantId: 'TENANT_INDIA_DEFAULT',
        campusIdRef: selectedCampus,
        referenceNumber: newCommRef,
        title: newCommTitle,
        summary: newCommSubject,
        category: 'NOTICE',
        channel: newCommChannel,
        priority: newCommPriority,
        audienceIdRef: newCommAudience,
        renderedSubject: newCommSubject,
        renderedBody: newCommBody,
        attachments: [],
        requiresAcknowledgement: true,
        isConfidential: false,
        isEmergencyBroadcast: false,
        createdByUserIdRef: 'USER_COMM_OFFICER'
      }, 'USER_COMM_OFFICER', idempotencyKey);

      setCommunications(institutionalCommunicationsService.getCommunications());
      setAuditTrail(institutionalCommunicationsService.getAuditTrail());
      setShowDispatchModal(false);
      setNewCommTitle('');
      setNewCommRef('');
      setNewCommSubject('');
      setNewCommBody('');
      notify('success', `Communication ${result.communication.referenceNumber} dispatched to ${result.messagesCreated.length} recipients.`);
    } catch (err: any) {
      notify('error', err.message || 'Dispatch failed.');
    }
  };

  // 2. Create & Approve Campaign Handler
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampCode || !newCampTitle || !newCampObjective) {
      notify('error', 'Please provide campaign code, title, and objective.');
      return;
    }

    try {
      const camp = institutionalCommunicationsService.createCampaign({
        tenantId: 'TENANT_INDIA_DEFAULT',
        campusIdRef: selectedCampus,
        code: newCampCode,
        title: newCampTitle,
        objective: newCampObjective,
        priority: newCampPriority,
        primaryChannel: 'EMAIL',
        alternateChannels: ['IN_APP'],
        audienceIdRef: 'AUD-BTECH-DELHI',
        templateIdRef: 'TMPL-EXAM-001',
        templateVersionNumber: 1,
        templateVariables: { term_code: 'AUTUMN-2026' },
        requiresAcknowledgement: true,
        totalRecipients: 2,
        requestedByUserIdRef: 'USER_CAMPAIGN_PLANNER'
      });

      setCampaigns(institutionalCommunicationsService.getCampaigns());
      setAuditTrail(institutionalCommunicationsService.getAuditTrail());
      setShowCampaignModal(false);
      setNewCampCode('');
      setNewCampTitle('');
      setNewCampObjective('');
      notify('success', `Campaign ${camp.code} created in DRAFT state. Awaiting Four-Eyes approval.`);
    } catch (err: any) {
      notify('error', err.message || 'Campaign creation failed.');
    }
  };

  const handleApproveCampaign = (campaignId: string, requestedBy: string) => {
    const approverUserId = requestedBy === 'USER_DEAN_ACADEMICS' ? 'USER_VICE_CHANCELLOR' : 'USER_DEAN_ACADEMICS';
    try {
      institutionalCommunicationsService.approveCampaign(campaignId, 'TENANT_INDIA_DEFAULT', approverUserId, 'Approved for broadcast per academic schedule review.');
      setCampaigns(institutionalCommunicationsService.getCampaigns());
      setAuditTrail(institutionalCommunicationsService.getAuditTrail());
      notify('success', `Campaign ${campaignId} approved by ${approverUserId} under Four-Eyes dual control.`);
    } catch (err: any) {
      notify('error', err.message || 'Approval rejected.');
    }
  };

  // 3. Issue Emergency Alert Handler
  const handleIssueAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertHeadline || !newAlertDesc || !newAlertInstructions) {
      notify('error', 'Please provide headline, description, and action instructions.');
      return;
    }

    try {
      const alt = institutionalCommunicationsService.issueEmergencyAlert({
        tenantId: 'TENANT_INDIA_DEFAULT',
        campusIdRef: selectedCampus,
        alertCode: `ALT_${Date.now().toString().slice(-4)}`,
        headline: newAlertHeadline,
        description: newAlertDesc,
        severity: 'CRITICAL',
        actionInstructions: newAlertInstructions,
        broadcastChannels: ['SYSTEM_ALERT', 'SMS', 'IN_APP'],
        issuedByUserIdRef: newAlertIssuedBy
      }, newAlertAuthorizedBy);

      setAlerts(institutionalCommunicationsService.getAlerts());
      setAuditTrail(institutionalCommunicationsService.getAuditTrail());
      setShowAlertModal(false);
      setNewAlertHeadline('');
      setNewAlertDesc('');
      setNewAlertInstructions('');
      notify('success', `Emergency Alert ${alt.alertCode} issued and broadcast actively across campus.`);
    } catch (err: any) {
      notify('error', err.message || 'Alert broadcast failed.');
    }
  };

  // 4. Template Preview Handler
  const handleRenderTestTemplate = () => {
    try {
      const parsedVars = JSON.parse(testVariables);
      const res = institutionalCommunicationsService.renderTemplate(testTemplateId, 1, parsedVars, testLang);
      setRenderedPreview(res);
      if (!res.isComplete) {
        notify('error', `Template rendering incomplete: Missing required variable(s): ${res.missingVariables.join(', ')}`);
      } else {
        notify('success', 'Template rendered successfully.');
      }
    } catch (e: any) {
      notify('error', `JSON parse error in template variables: ${e.message}`);
    }
  };

  // 5. Diagnostics Runner
  const handleRunDiagnostics = () => {
    const res = institutionalCommunicationsService.runDiagnostics();
    setDiagnostics(res);
    notify('success', `Diagnostics scan completed: ${res.summary.passed} passed, ${res.summary.warnings} warnings, ${res.summary.errors} errors.`);
  };

  // 6. Simulation Runner
  const handleRunSimulation = () => {
    const res = institutionalCommunicationsService.runSimulation(selectedScenario);
    setSimulationResult(res);
    notify('success', `Simulation '${selectedScenario}' completed in isolated memory sandbox.`);
  };

  // Quick stats
  const totalComms = communications.length;
  const activeCamps = campaigns.filter(c => c.status === 'ACTIVE' || c.status === 'APPROVED').length;
  const totalDeliveries = deliveries.length;
  const totalAcks = acknowledgements.filter(a => a.state === 'ACKNOWLEDGED').length;
  const activeAlertsCount = alerts.filter(a => a.isBroadcastActive).length;

  return (
    <div id="institutional-communications-workspace" className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          id="comm-workspace-notification"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 border ${
            notification.type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-700' : 'bg-rose-950 text-rose-200 border-rose-700'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50 text-indigo-400">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Institutional Communications &amp; Engagement</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded">
                  EMS Phase 11.11
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Four-Eyes SoD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authoritative multichannel notification orchestration, campaigns, templates, formal correspondence, alerts &amp; tamper-evident audit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300">
            <span className="text-slate-400 mr-2">Campus:</span>
            <select
              id="comm-campus-select"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="CAMPUS_DELHI" className="bg-slate-800">Campus Delhi (Main)</option>
              <option value="CAMPUS_MUMBAI" className="bg-slate-800">Campus Mumbai</option>
            </select>
          </div>

          <button
            id="btn-open-dispatch-modal"
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Notice
          </button>

          <button
            id="btn-open-alert-modal"
            onClick={() => setShowAlertModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-900 border border-rose-700 rounded-lg transition-colors shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Emergency Alert
          </button>
        </div>
      </header>

      {/* Primary KPI Ribbon */}
      <section id="comm-kpi-ribbon" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Communications</span>
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white">{totalComms}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Authoritative records</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Campaigns</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">{activeCamps}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Four-Eyes governed</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Deliveries</span>
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{totalDeliveries}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% gateway receipted</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Acknowledgements</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400">{totalAcks}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified reader telemetry</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Alerts</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">{activeAlertsCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Broadcast active</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>SHA-256 Chain</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{auditTrail.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immutable audit events</div>
        </div>
      </section>

      {/* Navigation Tabs (17 High-Density Tabs) */}
      <nav id="comm-tabs-navigation" className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-800 text-xs scrollbar-thin">
        {[
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'communications', label: 'Communications', icon: Radio },
          { id: 'campaigns', label: 'Campaigns', icon: Layers },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'audiences', label: 'Audiences', icon: Users },
          { id: 'messages', label: 'Messages', icon: Mail },
          { id: 'delivery', label: 'Delivery', icon: Send },
          { id: 'acknowledgements', label: 'Acknowledgements', icon: CheckCircle2 },
          { id: 'correspondence', label: 'Correspondence', icon: Inbox },
          { id: 'announcements', label: 'Announcements', icon: Bell },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          { id: 'preferences', label: 'Preferences', icon: Sliders },
          { id: 'schedules', label: 'Schedules', icon: Calendar },
          { id: 'escalations', label: 'Escalations', icon: ArrowUpRight },
          { id: 'diagnostics', label: 'Diagnostics', icon: FileCheck2 },
          { id: 'sandbox', label: 'Sandbox', icon: Play },
          { id: 'audit_trail', label: 'Audit Trail', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
                isActive
                  ? 'bg-slate-800 text-indigo-400 border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Tab Content Panels */}
      <main id="comm-main-content-panel">
        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'command_center' && (
          <div id="tab-panel-command-center" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Quick Actions & Live Alerts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Emergency Broadcast Alert Banner */}
                {alerts.filter(a => a.isBroadcastActive).map(alert => (
                  <div key={alert.alertId} className="bg-rose-950/40 border border-rose-800 rounded-xl p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-900/60 text-rose-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-900/50 px-2 py-0.5 rounded border border-rose-700">
                          {alert.severity} • {alert.alertCode}
                        </span>
                        <span className="text-xs text-rose-300">Issued {new Date(alert.issuedAt).toLocaleTimeString()}</span>
                      </div>
                      <h3 className="text-base font-semibold text-rose-100 mt-1">{alert.headline}</h3>
                      <p className="text-xs text-rose-200/90 mt-1">{alert.description}</p>
                      <div className="mt-2 text-xs bg-rose-900/30 p-2 rounded text-rose-100 font-mono">
                        <strong>Action Steps:</strong> {alert.actionInstructions}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Recent Communications Table */}
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-indigo-400" /> Recent Institutional Dispatches
                    </h2>
                    <button
                      onClick={() => setActiveTab('communications')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      View all <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-700">
                        <tr>
                          <th className="p-2.5">Ref Number</th>
                          <th className="p-2.5">Title</th>
                          <th className="p-2.5">Channel</th>
                          <th className="p-2.5">Priority</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Dispatched At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {communications.map(c => (
                          <tr key={c.communicationId} className="hover:bg-slate-800/40">
                            <td className="p-2.5 font-mono text-indigo-300">{c.referenceNumber}</td>
                            <td className="p-2.5 font-medium text-white">{c.title}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                                {c.channel}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                c.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-700' :
                                c.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-700' :
                                'bg-slate-900 text-slate-300 border border-slate-700'
                              }`}>
                                {c.priority}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">
                                {c.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-400">{c.dispatchedAt ? new Date(c.dispatchedAt).toLocaleString() : 'Pending'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Governance, Policy & Four-Eyes Controls */}
              <div className="space-y-6">
                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Governance Policies
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                      <div className="font-semibold text-slate-200">Quiet Period Guard</div>
                      <div className="text-slate-400 mt-0.5">22:00 — 06:00 (Emergency safety alerts exempt)</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                      <div className="font-semibold text-slate-200">Four-Eyes SoD Rule</div>
                      <div className="text-slate-400 mt-0.5">Requester !== Approver on all mass broadcasts &amp; alerts</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                      <div className="font-semibold text-slate-200">Multichannel Fallback</div>
                      <div className="text-slate-400 mt-0.5">Email → Push → SMS → Web Portal fallback cascade</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-cyan-400" /> System Verification Status
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-700/60">
                      <span className="text-slate-400">Upstream Phase Bindings</span>
                      <span className="text-emerald-400 font-semibold">Phases 10.1 — 11.10 Connected</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-700/60">
                      <span className="text-slate-400">Reference Mode</span>
                      <span className="text-indigo-400 font-semibold">Reference-Only (Zero Duplication)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-700/60">
                      <span className="text-slate-400">SHA-256 Audit Provenance</span>
                      <span className="text-emerald-400 font-semibold">Intact ({auditTrail.length} Chained)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNICATIONS */}
        {activeTab === 'communications' && (
          <div id="tab-panel-communications" className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter communications by title, ref, or audience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-64"
                />
              </div>
              <button
                onClick={() => setShowDispatchModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Communication
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Reference No</th>
                    <th className="p-3">Title &amp; Summary</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ack Required</th>
                    <th className="p-3">Dispatched</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {communications
                    .filter(c => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(c => (
                      <tr key={c.communicationId} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono text-indigo-300 font-medium">{c.referenceNumber}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{c.title}</div>
                          <div className="text-slate-400 text-[11px] mt-0.5">{c.summary}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                            {c.channel}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            c.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-700' :
                            c.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-700' :
                            'bg-slate-900 text-slate-300 border border-slate-700'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {c.requiresAcknowledgement ? (
                            <span className="text-cyan-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Yes (72h)
                            </span>
                          ) : (
                            <span className="text-slate-500">No</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-400">{c.dispatchedAt ? new Date(c.dispatchedAt).toLocaleString() : 'Draft'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div id="tab-panel-campaigns" className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Governed Multi-Target Notification Campaigns with Four-Eyes Segregation of Duties</span>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Plan New Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map(camp => (
                <div key={camp.campaignId} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                        {camp.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        camp.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                        camp.status === 'DRAFT' ? 'bg-amber-950 text-amber-400 border border-amber-700' :
                        'bg-slate-900 text-slate-300 border border-slate-700'
                      }`}>
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white mt-2">{camp.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{camp.objective}</p>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                      <div>
                        <div className="text-slate-500 text-[10px]">Recipients</div>
                        <div className="font-bold text-white">{camp.totalRecipients}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Delivered</div>
                        <div className="font-bold text-emerald-400">{camp.successfullyDeliveredCount}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px]">Acknowledged</div>
                        <div className="font-bold text-cyan-400">{camp.acknowledgedCount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-400">
                      {camp.approvedByUserIdRef ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Approved by {camp.approvedByUserIdRef}
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pending Four-Eyes Approval
                        </span>
                      )}
                    </div>

                    {camp.status === 'DRAFT' && (
                      <button
                        onClick={() => handleApproveCampaign(camp.campaignId, camp.requestedByUserIdRef)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-200 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700 rounded"
                      >
                        Four-Eyes Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEMPLATES & VERSION ENGINE */}
        {activeTab === 'templates' && (
          <div id="tab-panel-templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Published Templates List */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Declared Institutional Templates
                </h3>
                <div className="space-y-3">
                  {templates.map(tmpl => (
                    <div key={tmpl.templateId} className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-indigo-300 font-semibold">{tmpl.code}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                          v{tmpl.currentPublishedVersionNumber || 1} • {tmpl.status}
                        </span>
                      </div>
                      <div className="font-semibold text-white text-sm mt-1">{tmpl.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{tmpl.description}</div>
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Category: {tmpl.category}</span>
                        <span>•</span>
                        <span>Channel: {tmpl.defaultChannel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Testing & Validation Sandbox */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" /> Template Rendering &amp; Variable Engine
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Select Template</label>
                    <select
                      value={testTemplateId}
                      onChange={(e) => setTestTemplateId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                    >
                      {templates.map(t => (
                        <option key={t.templateId} value={t.templateId}>{t.name} ({t.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Target Language Variant</label>
                    <select
                      value={testLang}
                      onChange={(e) => setTestLang(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                    >
                      <option value="en">English (en)</option>
                      <option value="hi">Hindi (hi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Supplied Variables (JSON)</label>
                    <textarea
                      rows={5}
                      value={testVariables}
                      onChange={(e) => setTestVariables(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 font-mono text-[11px] text-indigo-300 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRenderTestTemplate}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded transition-colors"
                  >
                    Render Template Preview
                  </button>

                  {renderedPreview && (
                    <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase">Subject Preview:</div>
                      <div className="font-semibold text-indigo-300 mt-0.5">{renderedPreview.subject}</div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase mt-2">Body Preview:</div>
                      <div className="text-slate-200 whitespace-pre-wrap mt-0.5 font-mono text-[11px]">{renderedPreview.bodyText}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIENCES */}
        {activeTab === 'audiences' && (
          <div id="tab-panel-audiences" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Deterministic Target Audiences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audiences.map(aud => (
                  <div key={aud.audienceId} className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-sm">{aud.audienceName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {aud.audienceType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{aud.description}</p>
                    <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-950 p-2 rounded">
                      <div>Key: {aud.deterministicAudienceKey}</div>
                      <div>Resolved Recipients: <strong className="text-emerald-400">{aud.resolvedRecipientCount}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === 'messages' && (
          <div id="tab-panel-messages" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Message ID</th>
                    <th className="p-3">Target User Ref</th>
                    <th className="p-3">Endpoint</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3">Idempotency Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {messages.map(m => (
                    <tr key={m.messageId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-indigo-300">{m.messageId}</td>
                      <td className="p-3 font-semibold text-white">{m.targetUserIdRef}</td>
                      <td className="p-3 font-mono text-slate-400">{m.recipientEndpoint}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                          {m.channel}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">
                          {m.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{m.idempotencyKey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: DELIVERY */}
        {activeTab === 'delivery' && (
          <div id="tab-panel-delivery" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Delivery ID</th>
                    <th className="p-3">Message Ref</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Gateway Reference</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Dispatched Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {deliveries.map(d => (
                    <tr key={d.deliveryId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-indigo-300">{d.deliveryId}</td>
                      <td className="p-3 font-mono text-slate-400">{d.messageIdRef}</td>
                      <td className="p-3">{d.channel}</td>
                      <td className="p-3 font-mono text-emerald-400">{d.providerReferenceId || 'N/A'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">
                          {d.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{new Date(d.dispatchedTimestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: ACKNOWLEDGEMENTS */}
        {activeTab === 'acknowledgements' && (
          <div id="tab-panel-acknowledgements" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Ack ID</th>
                    <th className="p-3">Patron / Student</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Delivered At</th>
                    <th className="p-3">Acknowledged At</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {acknowledgements.map(a => (
                    <tr key={a.acknowledgementId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-indigo-300">{a.acknowledgementId}</td>
                      <td className="p-3 font-medium text-white">{a.displaySnapshot?.displayName || a.acknowledgedByUserIdRef}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.state === 'ACKNOWLEDGED' ? 'bg-cyan-950 text-cyan-400 border border-cyan-700' :
                          'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}>
                          {a.state}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{a.deliveredAt ? new Date(a.deliveredAt).toLocaleTimeString() : '-'}</td>
                      <td className="p-3 text-slate-400">{a.acknowledgedAt ? new Date(a.acknowledgedAt).toLocaleTimeString() : 'Pending'}</td>
                      <td className="p-3 text-slate-400">{a.acknowledgementNote || 'Awaiting recipient confirmation'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: CORRESPONDENCE */}
        {activeTab === 'correspondence' && (
          <div id="tab-panel-correspondence" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Formal Ref</th>
                    <th className="p-3">Direction</th>
                    <th className="p-3">Sender / Recipient</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Responsible Org Unit</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {correspondence.map(c => (
                    <tr key={c.correspondenceId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-indigo-300 font-semibold">{c.formalReferenceNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300">
                          {c.direction}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200">
                        <div>From: {c.senderReference}</div>
                        <div className="text-slate-400 text-[10px]">To: {c.recipientReference}</div>
                      </td>
                      <td className="p-3 font-medium text-white">{c.subject}</td>
                      <td className="p-3 text-indigo-400 font-mono text-[10px]">{c.classification}</td>
                      <td className="p-3 font-mono text-slate-400">{c.responsibleOrganizationUnitIdRef}</td>
                      <td className="p-3 text-amber-400 font-semibold">{c.responseDueDate ? new Date(c.responseDueDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div id="tab-panel-announcements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map(ann => (
                <div key={ann.announcementId} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(ann.publishDate).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mt-2">{ann.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ann.bodyText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: ALERTS */}
        {activeTab === 'alerts' && (
          <div id="tab-panel-alerts" className="space-y-4">
            <div className="flex justify-between items-center bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-400">Institutional Safety &amp; Emergency Alerts with Four-Eyes Authorization</span>
              <button
                onClick={() => setShowAlertModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Issue Emergency Alert
              </button>
            </div>

            <div className="space-y-4">
              {alerts.map(alt => (
                <div key={alt.alertId} className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800 font-mono">
                        {alt.alertCode}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
                        {alt.severity}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(alt.issuedAt).toLocaleString()}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">{alt.headline}</h3>
                  <p className="text-xs text-slate-300 mt-1">{alt.description}</p>
                  <div className="mt-3 p-3 bg-slate-900/80 rounded-lg text-xs font-mono text-rose-200 border border-rose-900/50">
                    <strong>Instructions:</strong> {alt.actionInstructions}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Issued By: <strong>{alt.issuedByUserIdRef}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authorized By: <strong>{alt.authorizedByUserIdRef}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: PREFERENCES */}
        {activeTab === 'preferences' && (
          <div id="tab-panel-preferences" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">User Reference</th>
                    <th className="p-3">User Type</th>
                    <th className="p-3">Preferred Channel</th>
                    <th className="p-3">Quiet Hours</th>
                    <th className="p-3">Opt-Out Categories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {preferences.map(p => (
                    <tr key={p.preferenceId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-white">{p.displaySnapshot?.displayName || p.userIdRef}</td>
                      <td className="p-3">{p.userType}</td>
                      <td className="p-3 text-indigo-400 font-semibold">{p.preferredChannel}</td>
                      <td className="p-3 text-slate-400">{p.quietHoursEnabled ? `${p.quietHourStart} — ${p.quietHourEnd}` : 'Disabled'}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400">{p.optOutCategories.join(', ') || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 13: SCHEDULES */}
        {activeTab === 'schedules' && (
          <div id="tab-panel-schedules" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Planned Broadcast Schedules</h3>
              <p className="text-xs text-slate-400">All planned dispatches adhere strictly to institutional quiet-hour policies.</p>
            </div>
          </div>
        )}

        {/* TAB 14: ESCALATIONS */}
        {activeTab === 'escalations' && (
          <div id="tab-panel-escalations" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">Escalation ID</th>
                    <th className="p-3">Communication Ref</th>
                    <th className="p-3">Trigger Reason</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Designated Supervisor</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {escalations.map(e => (
                    <tr key={e.escalationId} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-indigo-300">{e.escalationId}</td>
                      <td className="p-3 font-mono text-slate-400">{e.communicationIdRef}</td>
                      <td className="p-3 font-semibold text-rose-400">{e.triggerReason}</td>
                      <td className="p-3 font-semibold text-amber-400">{e.escalationLevel}</td>
                      <td className="p-3 text-slate-200">{e.designatedSupervisorUserIdRef}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-700">
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 15: DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div id="tab-panel-diagnostics" className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div>
                <h3 className="text-base font-semibold text-white">Institutional Communication Diagnostics Engine</h3>
                <p className="text-xs text-slate-400 mt-0.5">Scans for duplicate reference keys, template variable drift, Four-Eyes SoD violations, and broken SHA-256 audit chains.</p>
              </div>
              <button
                onClick={handleRunDiagnostics}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Execute Diagnostic Scan
              </button>
            </div>

            {diagnostics && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-center">
                    <div className="text-xs text-slate-400">Total Checks</div>
                    <div className="text-xl font-bold text-white mt-1">{diagnostics.summary.totalChecks}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-center">
                    <div className="text-xs text-emerald-400">Passed</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">{diagnostics.summary.passed}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-center">
                    <div className="text-xs text-amber-400">Warnings</div>
                    <div className="text-xl font-bold text-amber-400 mt-1">{diagnostics.summary.warnings}</div>
                  </div>
                  <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-center">
                    <div className="text-xs text-rose-400">Errors</div>
                    <div className="text-xl font-bold text-rose-400 mt-1">{diagnostics.summary.errors}</div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Diagnostic Findings</h4>
                  <div className="space-y-2">
                    {diagnostics.findings.map((f, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-xs flex items-start gap-3 border ${
                          f.severity === 'PASS' ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200' :
                          f.severity === 'WARNING' ? 'bg-amber-950/40 border-amber-800/50 text-amber-200' :
                          'bg-rose-950/40 border-rose-800/50 text-rose-200'
                        }`}
                      >
                        {f.severity === 'PASS' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5" />}
                        <div>
                          <div className="font-semibold">{f.checkId} • {f.category}</div>
                          <div className="text-slate-300 mt-0.5">{f.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 16: WHAT-IF SANDBOX (15 ISOLATED SIMULATIONS) */}
        {activeTab === 'sandbox' && (
          <div id="tab-panel-sandbox" className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-400" /> What-If Simulation Sandbox
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Isolated in-memory simulation engine for stress-testing surge notifications, provider outages, and compliance attacks.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded border border-amber-800">
                  SYNTHETIC / SANDBOX — ZERO PRODUCTION MUTATION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">Select Sandbox Scenario (15 Governed Scenarios)</label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value as CommunicationSimulationScenario)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  >
                    <option value="MASS_NOTIFICATION_SURGE">1. MASS_NOTIFICATION_SURGE (25k Recipient Throughput)</option>
                    <option value="CAMPUS_WIDE_ALERT">2. CAMPUS_WIDE_ALERT (Emergency Bypass Execution)</option>
                    <option value="MULTI_CAMPUS_CAMPAIGN">3. MULTI_CAMPUS_CAMPAIGN (Delhi &amp; Mumbai Dual-Sync)</option>
                    <option value="DELIVERY_PROVIDER_FAILURE">4. DELIVERY_PROVIDER_FAILURE (SMTP Outage Fallback)</option>
                    <option value="EMAIL_BOUNCE_SURGE">5. EMAIL_BOUNCE_SURGE (Hard Bounce Quarantine)</option>
                    <option value="SMS_FAILURE">6. SMS_FAILURE (Carrier Throttle Re-Routing)</option>
                    <option value="ACKNOWLEDGEMENT_BACKLOG">7. ACKNOWLEDGEMENT_BACKLOG (Overdue Escalations)</option>
                    <option value="CRITICAL_ALERT_ESCALATION">8. CRITICAL_ALERT_ESCALATION (Level 3 Executive Dispatch)</option>
                    <option value="DUPLICATE_DISPATCH_ATTEMPT">9. DUPLICATE_DISPATCH_ATTEMPT (Idempotency Intercept)</option>
                    <option value="CAMPAIGN_CANCELLATION">10. CAMPAIGN_CANCELLATION (Mid-Flight Queue Purge)</option>
                    <option value="TEMPLATE_VERSION_CONFLICT">11. TEMPLATE_VERSION_CONFLICT (Immutability Lock)</option>
                    <option value="RECIPIENT_SCOPE_EXPANSION">12. RECIPIENT_SCOPE_EXPANSION (Postgrad Ingestion)</option>
                    <option value="CROSS_TENANT_ATTACK">13. CROSS_TENANT_ATTACK (Foreign Injection Barrier)</option>
                    <option value="SCHEDULE_COLLISION">14. SCHEDULE_COLLISION (Dispatch Staggering)</option>
                    <option value="COMMUNICATION_RECOVERY">15. COMMUNICATION_RECOVERY (State Rehydration)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleRunSimulation}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Simulation
                  </button>
                </div>
              </div>

              {simulationResult && (
                <div className="mt-6 space-y-4 pt-4 border-t border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-900 rounded-lg text-center">
                      <div className="text-[11px] text-slate-400">Target Recipients</div>
                      <div className="text-lg font-bold text-white mt-0.5">{simulationResult.simulatedTargetRecipients.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg text-center">
                      <div className="text-[11px] text-emerald-400">Projected Deliveries</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">{simulationResult.simulatedDeliveriesProjected.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg text-center">
                      <div className="text-[11px] text-rose-400">Simulated Failures</div>
                      <div className="text-lg font-bold text-rose-400 mt-0.5">{simulationResult.simulatedFailuresEstimated.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg text-center">
                      <div className="text-[11px] text-cyan-400">Throughput</div>
                      <div className="text-lg font-bold text-cyan-400 mt-0.5">{simulationResult.simulatedProviderThroughputSec} msg/sec</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Simulation Trace Logs</div>
                    <div className="space-y-1 font-mono text-[11px] text-slate-300">
                      {simulationResult.logMessages.map((msg, i) => (
                        <div key={i} className="text-slate-300">{msg}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 17: AUDIT TRAIL */}
        {activeTab === 'audit_trail' && (
          <div id="tab-panel-audit-trail" className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cryptographic SHA-256 Audit Trail
                </h3>
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                  Chain Status: 100% Intact ({auditTrail.length} Chained Blocks)
                </span>
              </div>

              <div className="space-y-2">
                {auditTrail.slice().reverse().map(ev => (
                  <div key={ev.eventId} className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-lg text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-indigo-400 font-semibold">{ev.action}</span>
                      <span>{new Date(ev.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-300">
                      Actor: <strong className="text-white">{ev.actorUserIdRef}</strong> | Entity: <strong className="text-white">{ev.entityType} ({ev.entityId})</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 break-all">
                      <div>PrevHash: {ev.previousHash}</div>
                      <div className="text-emerald-400">CurrHash: {ev.currentHash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DISPATCH COMMUNICATION MODAL */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" /> Dispatch Institutional Communication
              </h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchCommunication} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Official Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. COM/DEL/2026/0992"
                  value={newCommRef}
                  onChange={(e) => setNewCommRef(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notice Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mandatory Faculty Development Symposium 2026"
                  value={newCommTitle}
                  onChange={(e) => setNewCommTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Channel</label>
                  <select
                    value={newCommChannel}
                    onChange={(e) => setNewCommChannel(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="EMAIL">EMAIL</option>
                    <option value="SMS">SMS</option>
                    <option value="PUSH">PUSH</option>
                    <option value="IN_APP">IN_APP</option>
                    <option value="SYSTEM_ALERT">SYSTEM_ALERT</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newCommPriority}
                    onChange={(e) => setNewCommPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Audience</label>
                <select
                  value={newCommAudience}
                  onChange={(e) => setNewCommAudience(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                >
                  {audiences.map(a => (
                    <option key={a.audienceId} value={a.audienceId}>{a.audienceName} ({a.audienceType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Rendered Subject</label>
                <input
                  type="text"
                  placeholder="Subject Line"
                  value={newCommSubject}
                  onChange={(e) => setNewCommSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Body Text</label>
                <textarea
                  rows={3}
                  placeholder="Official notice body..."
                  value={newCommBody}
                  onChange={(e) => setNewCommBody(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                >
                  Confirm &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Plan Institutional Campaign
              </h3>
              <button onClick={() => setShowCampaignModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Campaign Code</label>
                <input
                  type="text"
                  placeholder="e.g. CMP_HOSTEL_ALLOCATION_2026"
                  value={newCampCode}
                  onChange={(e) => setNewCampCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn 2026 Hostel Room Allocation Notices"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Strategic Objective</label>
                <textarea
                  rows={2}
                  placeholder="Describe the operational purpose of this campaign..."
                  value={newCampObjective}
                  onChange={(e) => setNewCampObjective(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE ALERT MODAL */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Issue Campus Emergency Alert
              </h3>
              <button onClick={() => setShowAlertModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueAlert} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Flash Flood & Heavy Rainfall Warning"
                  value={newAlertHeadline}
                  onChange={(e) => setNewAlertHeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed situation advisory..."
                  value={newAlertDesc}
                  onChange={(e) => setNewAlertDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Action Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Remain indoors in Block A/B shelters immediately."
                  value={newAlertInstructions}
                  onChange={(e) => setNewAlertInstructions(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 bg-rose-950/40 rounded-lg border border-rose-900/60 text-[11px]">
                <div>
                  <label className="text-rose-300 font-semibold block mb-1">Issued By (Requester)</label>
                  <input
                    type="text"
                    value={newAlertIssuedBy}
                    onChange={(e) => setNewAlertIssuedBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-rose-300 font-semibold block mb-1">Authorized By (Approver)</label>
                  <input
                    type="text"
                    value={newAlertAuthorizedBy}
                    onChange={(e) => setNewAlertAuthorizedBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div className="col-span-2 text-rose-400 text-[10px] italic">
                  *Four-Eyes Segregation of Duties: Issued By and Authorized By MUST NOT be identical.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded"
                >
                  Authorize &amp; Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
