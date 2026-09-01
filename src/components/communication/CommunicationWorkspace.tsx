import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bell,
  Mail,
  Phone,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Users,
  Check,
  Slash,
  BarChart3,
  Layers,
  Lock,
  Eye,
  Radio,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import {
  CommunicationTemplate,
  CommunicationAnnouncement,
  CommunicationMessage,
  CommunicationDelivery,
  CommunicationAcknowledgement,
  CommunicationPreference,
  CommunicationConsent,
  CommunicationThread,
  CommunicationThreadMessage,
  CommunicationAnalyticsCache,
  CommunicationChannel,
  CommunicationCategory,
  AudienceScope
} from '../../types/communication';
import { CommunicationService, UserActor } from '../../services/communicationService';

interface CommunicationWorkspaceProps {
  currentTenantId?: string;
  currentCampusId?: string;
  currentUser?: UserActor;
}

export const CommunicationWorkspace: React.FC<CommunicationWorkspaceProps> = ({
  currentTenantId = 'tenant_default',
  currentCampusId,
  currentUser = { id: 'usr_admin1', email: 'admin@school.edu', displayName: 'System Admin', role: 'tenant_admin' }
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'templates' | 'announcements' | 'messages' | 'acknowledgements' | 'preferences' | 'threads' | 'emergency'>('analytics');
  
  // Data States
  const [analytics, setAnalytics] = useState<CommunicationAnalyticsCache | null>(null);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [announcements, setAnnouncements] = useState<CommunicationAnnouncement[]>([]);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [deliveries, setDeliveries] = useState<CommunicationDelivery[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<CommunicationAcknowledgement[]>([]);
  const [consents, setConsents] = useState<CommunicationConsent[]>([]);
  const [threads, setThreads] = useState<CommunicationThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<CommunicationThread | null>(null);
  const [threadMessages, setThreadMessages] = useState<CommunicationThreadMessage[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals & Forms
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState<boolean>(false);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  
  // Form Inputs
  const [newTplName, setNewTplName] = useState('');
  const [newTplCode, setNewTplCode] = useState('');
  const [newTplCategory, setNewTplCategory] = useState<CommunicationCategory>('TRANSACTIONAL');
  const [newTplChannel, setNewTplChannel] = useState<CommunicationChannel>('EMAIL');
  const [newTplSubject, setNewTplSubject] = useState('');
  const [newTplBody, setNewTplBody] = useState('');
  const [newTplVars, setNewTplVars] = useState('student_name, date, amount');

  const [newAncTitle, setNewAncTitle] = useState('');
  const [newAncMessage, setNewAncMessage] = useState('');
  const [newAncScope, setNewAncScope] = useState<AudienceScope>('INSTITUTION');
  const [newAncAck, setNewAncAck] = useState(false);

  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgCategory, setMsgCategory] = useState<CommunicationCategory>('ANNOUNCEMENT');
  const [msgChannels, setMsgChannels] = useState<CommunicationChannel[]>(['IN_APP', 'EMAIL']);
  const [msgScope, setMsgScope] = useState<AudienceScope>('GUARDIAN');
  const [msgAck, setMsgAck] = useState(false);

  const [emgTitle, setEmgTitle] = useState('');
  const [emgBody, setEmgBody] = useState('');
  const [emgReason, setEmgReason] = useState('');

  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadData();
  }, [currentTenantId, currentCampusId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, tpls, ancs, msgs, dlvs, acks, csnts, thrds] = await Promise.all([
        CommunicationService.getAnalyticsCache(currentTenantId, currentCampusId),
        CommunicationService.getTemplates(currentTenantId, currentCampusId),
        CommunicationService.getAnnouncements(currentTenantId, currentCampusId),
        CommunicationService.getMessages(currentTenantId, currentCampusId),
        CommunicationService.getDeliveries(currentTenantId, currentCampusId),
        CommunicationService.getAcknowledgements(currentTenantId),
        CommunicationService.getConsents(currentTenantId),
        CommunicationService.getThreads(currentTenantId, currentCampusId)
      ]);

      setAnalytics(analyticsData);
      setTemplates(tpls);
      setAnnouncements(ancs);
      setMessages(msgs);
      setDeliveries(dlvs);
      setAcknowledgements(acks);
      setConsents(csnts);
      setThreads(thrds);

      if (thrds.length > 0 && !selectedThread) {
        setSelectedThread(thrds[0]);
        const msgs = await CommunicationService.getThreadMessages(currentTenantId, thrds[0].id);
        setThreadMessages(msgs);
      }
    } catch (err) {
      console.error('Failed to load communication data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CommunicationService.createTemplate(currentTenantId, currentCampusId, {
        code: newTplCode || `TPL_${Date.now()}`,
        name: newTplName,
        category: newTplCategory,
        channel: newTplChannel,
        subject: newTplSubject,
        body: newTplBody,
        variables: newTplVars.split(',').map(s => s.trim()),
        language: 'en'
      }, currentUser);

      setShowTemplateModal(false);
      setNewTplName('');
      setNewTplCode('');
      setNewTplSubject('');
      setNewTplBody('');
      loadData();
    } catch (err) {
      alert(`Error creating template: ${(err as Error).message}`);
    }
  };

  const handleApproveTemplate = async (templateId: string) => {
    try {
      await CommunicationService.approveTemplate(currentTenantId, templateId, currentUser);
      loadData();
    } catch (err) {
      alert(`Error approving template: ${(err as Error).message}`);
    }
  };

  const handlePublishTemplate = async (templateId: string) => {
    try {
      await CommunicationService.publishTemplate(currentTenantId, templateId, currentUser);
      loadData();
    } catch (err) {
      alert(`Error publishing template: ${(err as Error).message}`);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const anc = await CommunicationService.createAnnouncement(currentTenantId, currentCampusId, {
        title: newAncTitle,
        message: newAncMessage,
        category: 'ANNOUNCEMENT',
        audience: { scope: newAncScope },
        priority: 'HIGH',
        channels: ['IN_APP', 'EMAIL'],
        publishAt: new Date().toISOString(),
        acknowledgementRequired: newAncAck
      }, currentUser);

      await CommunicationService.publishAnnouncement(currentTenantId, anc.id, currentUser);

      setShowAnnouncementModal(false);
      setNewAncTitle('');
      setNewAncMessage('');
      loadData();
    } catch (err) {
      alert(`Error publishing announcement: ${(err as Error).message}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CommunicationService.sendMessage(currentTenantId, currentCampusId, {
        category: msgCategory,
        sourceModule: 'communication',
        sourceType: 'manual_dispatch',
        sourceId: `dispatch_${Date.now()}`,
        subject: msgSubject,
        body: msgBody,
        channels: msgChannels,
        audience: { scope: msgScope },
        priority: 'NORMAL',
        idempotencyKey: `man_msg_${Date.now()}`,
        acknowledgementRequired: msgAck
      }, currentUser);

      setShowMessageModal(false);
      setMsgSubject('');
      setMsgBody('');
      loadData();
    } catch (err) {
      alert(`Error sending message: ${(err as Error).message}`);
    }
  };

  const handleSendEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emgReason) {
      alert('Must state a valid governance reason for Emergency Override.');
      return;
    }
    try {
      await CommunicationService.sendEmergencyBroadcast(
        currentTenantId,
        currentCampusId,
        emgTitle,
        emgBody,
        ['IN_APP', 'EMAIL', 'SMS', 'PUSH'],
        'INSTITUTION',
        emgReason,
        currentUser
      );

      setShowEmergencyModal(false);
      setEmgTitle('');
      setEmgBody('');
      setEmgReason('');
      loadData();
    } catch (err) {
      alert(`Error sending emergency broadcast: ${(err as Error).message}`);
    }
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    try {
      await CommunicationService.retryDelivery(currentTenantId, deliveryId, currentUser);
      loadData();
    } catch (err) {
      alert(`Retry failed: ${(err as Error).message}`);
    }
  };

  const handleAcknowledge = async (ackId: string) => {
    try {
      await CommunicationService.acknowledgeMessage(currentTenantId, ackId, 'PORTAL_CLICK', currentUser);
      loadData();
    } catch (err) {
      alert(`Acknowledgement failed: ${(err as Error).message}`);
    }
  };

  const handleThreadSelect = async (thread: CommunicationThread) => {
    setSelectedThread(thread);
    const msgs = await CommunicationService.getThreadMessages(currentTenantId, thread.id);
    setThreadMessages(msgs);
  };

  const handleSendThreadReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;
    try {
      await CommunicationService.addThreadMessage(currentTenantId, selectedThread.id, replyText, currentUser);
      setReplyText('');
      const msgs = await CommunicationService.getThreadMessages(currentTenantId, selectedThread.id);
      setThreadMessages(msgs);
    } catch (err) {
      alert(`Failed to send reply: ${(err as Error).message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Communications & Notifications</h1>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Phase 7.14 Multi-Channel Engine
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Authoritative multi-channel dispatch, versioned template governance, delivery tracking & emergency broadcast console
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMessageModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" /> Dispatch Message
          </button>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" /> Emergency Broadcast
          </button>
          <button
            onClick={loadData}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-px">
        {[
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
          { id: 'templates', label: 'Template Governance', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Radio },
          { id: 'messages', label: 'Delivery Register', icon: Layers },
          { id: 'acknowledgements', label: 'Acknowledgements', icon: CheckCircle2 },
          { id: 'preferences', label: 'Consents & Prefs', icon: UserCheck },
          { id: 'threads', label: 'Support Threads', icon: MessageSquare },
          { id: 'emergency', label: 'Emergency Console', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-semibold'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total Dispatches</p>

                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{analytics.totalMessages}</p>
                </div>
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Send className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Across all channel endpoints</p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Delivery Rate</p>

                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{analytics.deliveryRate}%</p>
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">SLA target delivery: &lt; 15 mins</p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Acknowledgement Rate</p>

                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-2">{analytics.acknowledgementRate}%</p>
                </div>
                <div className="p-2 bg-sky-50 dark:bg-sky-950/50 rounded-lg text-sky-600 dark:text-sky-400">
                  <Check className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Mandatory confirmation tracking</p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Failure Rate</p>

                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{analytics.failureRate}%</p>
                </div>
                <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">SLA Breaches: {analytics.slaBreachedCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-500" /> Dispatches by Channel
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.byChannel).map(([channel, count]) => (
                  <div key={channel} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{channel}</span>
                      <span className="text-gray-500 dark:text-gray-400">{count} dispatches</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (Number(count) / (analytics.totalMessages || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Dispatches by Category
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.byCategory).map(([cat, count]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <span className="text-gray-500 dark:text-gray-400">{count} messages</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (Number(count) / (analytics.totalMessages || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATE GOVERNANCE */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by code or subject..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Template
            </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-3">Code / Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Version / Status</th>
                  <th className="p-3">Variables</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {templates.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.code.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="p-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{t.code}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-xs text-indigo-600 dark:text-indigo-400">{t.channel}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">v{t.version}</span>
                        <span className={`px-2 py-0.5 text-xs rounded font-semibold ${
                          t.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          t.status === 'APPROVED' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {t.variables.map(v => (
                          <span key={v} className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {t.status === 'DRAFT' && (
                        <button
                          onClick={() => handleApproveTemplate(t.id)}
                          className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 rounded"
                        >
                          Approve
                        </button>
                      )}
                      {(t.status === 'APPROVED' || t.status === 'DRAFT') && (
                        <button
                          onClick={() => handlePublishTemplate(t.id)}
                          className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded"
                        >
                          Publish
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Institution Announcements</h3>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Announcement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map(anc => (
              <div key={anc.id} className="p-5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 space-y-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {anc.audience.scope}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {anc.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{anc.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{anc.message}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>By {anc.createdByName}</span>
                  <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERY REGISTER */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Channel / Provider</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Attempts</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {deliveries.map(dlv => (
                  <tr key={dlv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="p-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{dlv.recipientName}</div>
                      <div className="text-xs text-gray-500">{dlv.recipientRole}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-xs text-indigo-600 dark:text-indigo-400">{dlv.channel}</div>
                      <div className="text-[11px] text-gray-400">{dlv.provider}</div>
                    </td>
                    <td className="p-3 text-xs font-mono text-gray-600 dark:text-gray-400">{dlv.recipientAddress}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-semibold ${
                        dlv.status === 'DELIVERED' || dlv.status === 'READ' || dlv.status === 'ACKNOWLEDGED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : dlv.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {dlv.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono">{dlv.attemptCount}</td>
                    <td className="p-3 text-xs text-gray-500">{new Date(dlv.queuedAt).toLocaleTimeString()}</td>
                    <td className="p-3 text-right">
                      {dlv.status === 'FAILED' && (
                        <button
                          onClick={() => handleRetryDelivery(dlv.id)}
                          className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 rounded"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ACKNOWLEDGEMENTS */}
      {activeTab === 'acknowledgements' && (
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Acknowledged At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {acknowledgements.map(ack => (
                  <tr key={ack.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{ack.recipientName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-semibold ${
                        ack.status === 'ACKNOWLEDGED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ack.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono text-gray-600 dark:text-gray-400">{ack.acknowledgementMethod || '—'}</td>
                    <td className="p-3 text-xs text-gray-500">{ack.acknowledgedAt ? new Date(ack.acknowledgedAt).toLocaleString() : '—'}</td>
                    <td className="p-3 text-right">
                      {ack.status === 'PENDING' && (
                        <button
                          onClick={() => handleAcknowledge(ack.id)}
                          className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 rounded"
                        >
                          Mark Acknowledged
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CONSENTS & PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Stakeholder Consents & Communication Disclosures</h3>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-3">Consent Type</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Policy Version</th>
                  <th className="p-3">Granted / Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {consents.map(c => (
                  <tr key={c.id}>
                    <td className="p-3 font-semibold text-gray-900 dark:text-white">{c.consentType}</td>
                    <td className="p-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">{c.channel}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs rounded font-semibold ${
                        c.status === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono">{c.policyVersion}</td>
                    <td className="p-3 text-xs text-gray-500">{new Date(c.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SUPPORT THREADS */}
      {activeTab === 'threads' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-4 space-y-3 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white">Active Communication Threads</h4>
            <div className="space-y-2">
              {threads.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleThreadSelect(t)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedThread?.id === t.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">{t.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.participants.map(p => p.name).join(', ')}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 p-5 flex flex-col justify-between shadow-sm min-h-[400px]">
            {selectedThread ? (
              <>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedThread.title}</h3>
                    <p className="text-xs text-gray-500">Thread ID: {selectedThread.id}</p>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {threadMessages.map(tm => (
                      <div key={tm.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{tm.senderName} ({tm.senderRole})</span>
                          <span className="text-gray-400">{new Date(tm.sentAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{tm.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendThreadReply} className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">Select a thread to inspect message history</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: EMERGENCY CONSOLE */}
      {activeTab === 'emergency' && (
        <div className="p-6 border-2 border-rose-200 dark:border-rose-900 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 space-y-6">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300">
            <ShieldAlert className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Emergency Broadcast Console</h2>
              <p className="text-sm text-rose-600 dark:text-rose-400">
                Authorized override for immediate campus and institution-wide emergency notifications. Bypasses non-mandatory channel silences with recorded audit reasons.
              </p>
            </div>
          </div>

          <form onSubmit={handleSendEmergency} className="space-y-4 max-w-2xl bg-white dark:bg-gray-900 p-5 rounded-xl border border-rose-200 dark:border-rose-800 shadow-sm">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Emergency Title</label>
              <input
                type="text"
                required
                placeholder="e.g. CAMPUS SEVERE WEATHER ALERT"
                value={emgTitle}
                onChange={e => setEmgTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Emergency Message Body</label>
              <textarea
                required
                rows={3}
                placeholder="Clear instructional message for students, staff, and guardians..."
                value={emgBody}
                onChange={e => setEmgBody(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">Governance Reason for Override</label>
              <input
                type="text"
                required
                placeholder="Mandatory safety directive authorized by Principal/District Admin"
                value={emgReason}
                onChange={e => setEmgReason(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" /> Execute Institution Emergency Broadcast
            </button>
          </form>
        </div>
      )}

      {/* CREATE TEMPLATE MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full p-6 space-y-4 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Communication Template</h3>
            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Template Code</label>
                <input type="text" required placeholder="FEE_REMINDER_TPL" value={newTplCode} onChange={e => setNewTplCode(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Template Name</label>
                <input type="text" required placeholder="Fee Due Reminder" value={newTplName} onChange={e => setNewTplName(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={newTplCategory} onChange={e => setNewTplCategory(e.target.value as any)} className="w-full px-3 py-2 text-sm border rounded bg-transparent">
                    <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="ATTENDANCE">ATTENDANCE</option>
                    <option value="EXAMINATION">EXAMINATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Channel</label>
                  <select value={newTplChannel} onChange={e => setNewTplChannel(e.target.value as any)} className="w-full px-3 py-2 text-sm border rounded bg-transparent">
                    <option value="EMAIL">EMAIL</option>
                    <option value="SMS">SMS</option>
                    <option value="IN_APP">IN_APP</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                <input type="text" required value={newTplSubject} onChange={e => setNewTplSubject(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Body Template</label>
                <textarea required rows={3} value={newTplBody} onChange={e => setNewTplBody(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Variables (comma separated)</label>
                <input type="text" value={newTplVars} onChange={e => setNewTplVars(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTemplateModal(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded">Create Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH MESSAGE MODAL */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full p-6 space-y-4 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dispatch Message</h3>
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                <input type="text" required value={msgSubject} onChange={e => setMsgSubject(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Message Body</label>
                <textarea required rows={3} value={msgBody} onChange={e => setMsgBody(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Audience Scope</label>
                  <select value={msgScope} onChange={e => setMsgScope(e.target.value as any)} className="w-full px-3 py-2 text-sm border rounded bg-transparent">
                    <option value="GUARDIAN">GUARDIAN</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                    <option value="INSTITUTION">INSTITUTION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={msgCategory} onChange={e => setMsgCategory(e.target.value as any)} className="w-full px-3 py-2 text-sm border rounded bg-transparent">
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                    <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                    <option value="ATTENDANCE">ATTENDANCE</option>
                    <option value="FINANCE">FINANCE</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="ackReq" checked={msgAck} onChange={e => setMsgAck(e.target.checked)} />
                <label htmlFor="ackReq" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mandatory Acknowledgement Required</label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded">Dispatch Message</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
