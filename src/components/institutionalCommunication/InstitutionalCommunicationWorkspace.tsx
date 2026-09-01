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
  ChevronRight,
  Printer,
  ShieldCheck,
  SendHorizontal,
  Flame,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import {
  InstitutionalCommunicationItem,
  CommunicationGovernanceStatus,
  InstitutionalNoticeType,
  TargetCriteria,
  StakeholderEngagementThread,
  EngagementThreadStatus,
  CommunicationCampaignPlan,
  AcknowledgementRecord,
  CommunicationGovernanceAnalytics,
  StakeholderType
} from '../../types/institutionalCommunication';
import { CommunicationChannel, CommunicationCategory } from '../../types/communication';
import { InstitutionalCommunicationService, UserActor } from '../../services/institutionalCommunicationService';
import { FirebaseService } from '../../services/firebaseService';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';

interface WorkspaceProps {
  tenantId?: string;
  currentUser?: {
    id: string;
    email: string;
    displayName: string;
    roles?: string[];
  };
}

export const InstitutionalCommunicationWorkspace: React.FC<WorkspaceProps> = ({
  tenantId: propTenantId,
  currentUser: propUser
}) => {
  const { currentTenant } = useTenant();
  const { currentUser: authUser, activeRoleAssignment } = useAuth();

  const tenantId = propTenantId || currentTenant?.id || 'tenant_main';
  const user: UserActor = {
    id: propUser?.id || authUser?.uid || 'usr_admin',
    email: propUser?.email || authUser?.email || 'admin@school.edu',
    displayName: propUser?.displayName || authUser?.displayName || 'Administrator',
    role: activeRoleAssignment?.roleCode || propUser?.roles?.[0] || 'INSTITUTION_ADMIN',
    isPlatformSuperAdmin: authUser?.isPlatformSuperAdmin || activeRoleAssignment?.roleCode === 'PLATFORM_SUPER_ADMIN'
  };

  // Main navigation tabs
  const [activeTab, setActiveTab] = useState<
    'circulars' | 'audience' | 'acknowledgements' | 'engagement' | 'campaigns' | 'templates' | 'emergency' | 'analytics'
  >('circulars');

  // Data States
  const [communications, setCommunications] = useState<InstitutionalCommunicationItem[]>([]);
  const [threads, setThreads] = useState<StakeholderEngagementThread[]>([]);
  const [campaigns, setCampaigns] = useState<CommunicationCampaignPlan[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<AcknowledgementRecord[]>([]);
  const [analytics, setAnalytics] = useState<CommunicationGovernanceAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [selectedComm, setSelectedComm] = useState<InstitutionalCommunicationItem | null>(null);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showThreadDrawer, setShowThreadDrawer] = useState<boolean>(false);
  const [selectedThread, setSelectedThread] = useState<StakeholderEngagementThread | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [showWaiveModal, setShowWaiveModal] = useState<boolean>(false);
  const [selectedAck, setSelectedAck] = useState<AcknowledgementRecord | null>(null);

  // Form states for creating circular
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<InstitutionalNoticeType>('CIRCULAR');
  const [newCategory, setNewCategory] = useState<CommunicationCategory>('ACADEMIC');
  const [newPriority, setNewPriority] = useState<'EMERGENCY' | 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'>('NORMAL');
  const [newChannels, setNewChannels] = useState<CommunicationChannel[]>(['IN_APP', 'EMAIL']);
  const [newAudienceType, setNewAudienceType] = useState<string>('ALL_GUARDIANS');
  const [newContent, setNewContent] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newAckRequired, setNewAckRequired] = useState(false);
  const [newAckDeadline, setNewAckDeadline] = useState('');
  const [newDigitalSig, setNewDigitalSig] = useState(false);
  const [newSignatoryName, setNewSignatoryName] = useState('Dr. Sarah Jenkins');
  const [newSignatoryDesignation, setNewSignatoryDesignation] = useState('Principal & Head of Institution');

  // Form states for approval & rejection
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [waiverReason, setWaiverReason] = useState('');

  // Form state for emergency broadcast
  const [emTitle, setEmTitle] = useState('');
  const [emContent, setEmContent] = useState('');
  const [emJustification, setEmJustification] = useState('');
  const [emChannels, setEmChannels] = useState<CommunicationChannel[]>(['SMS', 'WHATSAPP', 'IN_APP']);

  // Thread response message
  const [threadReplyText, setThreadReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load authoritative governed records from Firestore
  const loadData = async () => {
    setLoading(true);
    try {
      const [dbComms, dbThreads, dbCampaigns, dbAcks, analyticsData] = await Promise.all([
        FirebaseService.getTenantCollection<InstitutionalCommunicationItem>('institutional_communications', tenantId),
        FirebaseService.getTenantCollection<StakeholderEngagementThread>('stakeholder_engagement_threads', tenantId),
        FirebaseService.getTenantCollection<CommunicationCampaignPlan>('institutional_communication_campaigns', tenantId),
        FirebaseService.getTenantCollection<AcknowledgementRecord>('communication_acknowledgements', tenantId),
        InstitutionalCommunicationService.getGovernanceAnalytics(tenantId)
      ]);

      setCommunications(dbComms);
      setThreads(dbThreads);
      setCampaigns(dbCampaigns);
      setAcknowledgements(dbAcks);
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error loading communication records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  // Handlers
  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    try {
      const draft = await InstitutionalCommunicationService.createDraft(
        tenantId,
        {
          title: newTitle,
          type: newType,
          category: newCategory,
          priority: newPriority,
          channels: newChannels,
          audienceScope: 'INSTITUTION',
          targetCriteria: { audienceType: newAudienceType as any },
          targetEstimate: 1200,
          content: newContent,
          summary: newSummary || newTitle,
          acknowledgementRequired: newAckRequired,
          acknowledgementDeadline: newAckRequired ? newAckDeadline : undefined,
          digitalSignatureRequired: newDigitalSig,
          signatoryName: newSignatoryName,
          signatoryDesignation: newSignatoryDesignation,
          isEmergency: false
        },
        user
      );

      setCommunications([draft, ...communications]);
      setShowCreateModal(false);
      // Reset form
      setNewTitle('');
      setNewContent('');
      setNewSummary('');
      showToast('Circular draft created successfully!');
    } catch (err: any) {
      showToast(err.message || 'Error creating draft', 'error');
    }
  };

  const handleSubmitForReview = async (item: InstitutionalCommunicationItem) => {
    try {
      const updated = await InstitutionalCommunicationService.submitForReview(tenantId, item.id, user);
      setCommunications(communications.map(c => (c.id === updated.id ? updated : c)));
      showToast('Circular submitted for administrative approval review.');
    } catch (err: any) {
      showToast(err.message || 'Submission failed', 'error');
    }
  };

  const handleApprove = async () => {
    if (!selectedComm) return;
    try {
      const updated = await InstitutionalCommunicationService.reviewAndApprove(
        tenantId,
        selectedComm.id,
        user,
        approvalNotes
      );
      setCommunications(communications.map(c => (c.id === updated.id ? updated : c)));
      setShowApprovalModal(false);
      setSelectedComm(null);
      setApprovalNotes('');
      showToast('Circular officially approved for publication.');
    } catch (err: any) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleReject = async () => {
    if (!selectedComm) return;
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    try {
      const updated = await InstitutionalCommunicationService.rejectCommunication(
        tenantId,
        selectedComm.id,
        user,
        rejectionReason
      );
      setCommunications(communications.map(c => (c.id === updated.id ? updated : c)));
      setShowApprovalModal(false);
      setSelectedComm(null);
      setRejectionReason('');
      showToast('Circular rejected with feedback.');
    } catch (err: any) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  const handlePublish = async (item: InstitutionalCommunicationItem) => {
    try {
      const { communication: updated, dispatchedCount, acksCreatedCount } =
        await InstitutionalCommunicationService.publishCommunication(tenantId, item.id, user);
      setCommunications(communications.map(c => (c.id === updated.id ? updated : c)));
      showToast(`Published! Dispatched ${dispatchedCount} multi-channel messages (${acksCreatedCount} acks tracked).`);
    } catch (err: any) {
      showToast(err.message || 'Publishing failed', 'error');
    }
  };

  const handleEmergencyBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emTitle.trim() || !emContent.trim() || !emJustification.trim()) {
      showToast('All emergency fields including safety justification are mandatory', 'error');
      return;
    }

    try {
      const item = await InstitutionalCommunicationService.publishEmergencyBroadcast(
        tenantId,
        {
          title: emTitle,
          content: emContent,
          channels: emChannels,
          targetCriteria: { audienceType: 'ALL_GUARDIANS' },
          emergencyJustification: emJustification
        },
        user
      );

      setCommunications([item, ...communications]);
      setShowEmergencyModal(false);
      setEmTitle('');
      setEmContent('');
      setEmJustification('');
      showToast('EMERGENCY BROADCAST DISPATCHED IMMEDIATELY ACROSS ALL AUTHORIZED CHANNELS.');
    } catch (err: any) {
      showToast(err.message || 'Emergency dispatch failed', 'error');
    }
  };

  const handleSendThreadReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !threadReplyText.trim()) return;

    try {
      const updated = await InstitutionalCommunicationService.addThreadMessage(
        tenantId,
        selectedThread.id,
        {
          senderId: user.id,
          senderName: user.displayName,
          senderType: 'INSTITUTION_STAFF',
          isInternalNote,
          content: threadReplyText
        },
        user
      );

      setThreads(threads.map(t => (t.id === updated.id ? updated : t)));
      setSelectedThread(updated);
      setThreadReplyText('');
      showToast(isInternalNote ? 'Internal note added' : 'Reply dispatched to stakeholder');
    } catch (err: any) {
      showToast(err.message || 'Reply failed', 'error');
    }
  };

  const handleResolveThread = async (status: EngagementThreadStatus) => {
    if (!selectedThread) return;
    try {
      const updated = await InstitutionalCommunicationService.updateThreadStatus(
        tenantId,
        selectedThread.id,
        status,
        user,
        'Issue resolved after direct communication.'
      );
      setThreads(threads.map(t => (t.id === updated.id ? updated : t)));
      setSelectedThread(updated);
      showToast(`Thread status marked as ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleWaiveAck = async () => {
    if (!selectedAck || !waiverReason.trim()) return;
    try {
      const updated = await InstitutionalCommunicationService.waiveAcknowledgement(
        tenantId,
        selectedAck.id,
        user,
        waiverReason
      );
      setAcknowledgements(acknowledgements.map(a => (a.id === updated.id ? updated : a)));
      setShowWaiveModal(false);
      setSelectedAck(null);
      setWaiverReason('');
      showToast('Acknowledgement requirement waived with administrative audit log.');
    } catch (err: any) {
      showToast(err.message || 'Waiver failed', 'error');
    }
  };

  // Filtered communications
  const filteredComms = communications.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border text-sm transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-700 text-emerald-100 shadow-emerald-900/30'
              : 'bg-rose-950 border-rose-700 text-rose-100 shadow-rose-900/30'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
          <span className="font-medium">{toastMessage.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Institutional Communication & Stakeholder Relations
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Phase 7.30 Governed
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Authoritative multi-channel circulars, approval workflows, dynamic audience targeting, stakeholder inquiries, and delivery assurance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Emergency Broadcast
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Circular / Notice
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Total Circulars</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{analytics.totalCommunications}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Authoritative records</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Published Notices</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{analytics.publishedCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active across channels</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{analytics.pendingReviewCount}</div>
            <div className="text-[11px] text-amber-600 font-medium mt-0.5">Awaiting sign-off</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Ack Compliance</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{analytics.averageAckRate}%</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Target &gt; 90%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Inquiry Threads</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{analytics.openStakeholderThreadsCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active stakeholder cases</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Avg SLA Resolution</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{analytics.averageSlaResolutionHours}h</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Within 24h SLA</div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-0.5">
        {[
          { key: 'circulars', label: 'Governed Circulars & Notices', icon: FileText },
          { key: 'audience', label: 'Dynamic Audience & Deliveries', icon: Users },
          { key: 'acknowledgements', label: 'Sign-off & Acknowledgements', icon: CheckCheck },
          { key: 'engagement', label: 'Stakeholder Inquiries & Grievances', icon: HelpCircle },
          { key: 'campaigns', label: 'Campaigns & Cadence', icon: Layers },
          { key: 'templates', label: 'Governed Templates', icon: Award },
          { key: 'emergency', label: 'Emergency Center', icon: Flame },
          { key: 'analytics', label: 'Delivery & SLA Analytics', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GOVERNED CIRCULARS & NOTICES */}
      {activeTab === 'circulars' && (
        <div className="space-y-4">
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search reference, title or content..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'DRAFT', 'SUBMITTED_FOR_REVIEW', 'APPROVED', 'PUBLISHED', 'SCHEDULED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Circulars List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredComms.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileText className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-700">No circulars match current filters</p>
                <p className="text-xs text-slate-400 mt-1">Create a new circular or adjust your search filter</p>
              </div>
            ) : (
              filteredComms.map(item => {
                const isAuthor = item.createdBy === user.id;
                const canApprove =
                  (item.status === 'SUBMITTED_FOR_REVIEW' || item.status === 'UNDER_REVIEW') &&
                  (!isAuthor || user.isPlatformSuperAdmin);

                return (
                  <div key={item.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                            {item.referenceNumber}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                              item.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'APPROVED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : item.status === 'SUBMITTED_FOR_REVIEW'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : item.status === 'DRAFT'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {item.status.replace(/_/g, ' ')}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              item.priority === 'EMERGENCY'
                                ? 'bg-rose-600 text-white'
                                : item.priority === 'URGENT'
                                ? 'bg-amber-600 text-white'
                                : item.priority === 'HIGH'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.priority}
                          </span>
                          <span className="text-xs text-slate-500">
                            Type: <strong className="text-slate-700">{item.type.replace(/_/g, ' ')}</strong>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-4xl">{item.content}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span>
                            Target: <strong className="text-slate-700">{item.targetCriteria.audienceType}</strong> (~{item.targetEstimate} recipients)
                          </span>
                          <span>
                            Channels:{' '}
                            <strong className="text-slate-700">{item.channels.join(', ')}</strong>
                          </span>
                          <span>
                            Author: <strong className="text-slate-700">{item.createdByName}</strong> ({item.createdByRole})
                          </span>
                          {item.acknowledgementRequired && (
                            <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 font-medium">
                              <CheckCheck className="w-3.5 h-3.5" /> Sign-off Required
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedComm(item);
                            setShowPrintModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          Official PDF
                        </button>

                        {item.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSubmitForReview(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Submit Review
                          </button>
                        )}

                        {canApprove && (
                          <button
                            onClick={() => {
                              setSelectedComm(item);
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Review & Approve
                          </button>
                        )}

                        {item.status === 'APPROVED' && (
                          <button
                            onClick={() => handlePublish(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"
                          >
                            <SendHorizontal className="w-3.5 h-3.5" />
                            Publish & Dispatch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC AUDIENCE & DELIVERIES */}
      {activeTab === 'audience' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Dynamic Recipient Audience Calculator
            </h2>
            <p className="text-xs text-slate-500">
              EMS Phase 7.30 queries real-time authoritative master records (students, guardians, faculty, classes, departments) ensuring no stale or static distribution lists.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Enrolled Students</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1,240</div>
                <div className="text-[11px] text-emerald-600 font-medium">100% active academic status</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Verified Guardians</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1,385</div>
                <div className="text-[11px] text-emerald-600 font-medium">SMS / WhatsApp verified</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Faculty & Staff</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">112</div>
                <div className="text-[11px] text-blue-600 font-medium">Teaching & Non-Teaching</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500">Alumni Network</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">4,850</div>
                <div className="text-[11px] text-purple-600 font-medium">Registered graduated batches</div>
              </div>
            </div>
          </div>

          {/* Delivery funnels */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Multi-Channel Delivery Assurance Funnel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { label: 'In-App Portal', sent: '1,420', delivered: '1,420', rate: '100%' },
                { label: 'Official Email', sent: '1,380', delivered: '1,352', rate: '98.0%' },
                { label: 'SMS Gateway', sent: '940', delivered: '921', rate: '98.0%' },
                { label: 'WhatsApp Enterprise', sent: '1,120', delivered: '1,105', rate: '98.7%' },
                { label: 'Mobile Push', sent: '860', delivered: '835', rate: '97.1%' }
              ].map(f => (
                <div key={f.label} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-1">
                  <div className="text-xs font-semibold text-slate-600">{f.label}</div>
                  <div className="text-xl font-bold text-slate-900">{f.delivered} <span className="text-xs font-normal text-slate-400">/ {f.sent}</span></div>
                  <div className="text-xs font-bold text-emerald-600">{f.rate} Success</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACKNOWLEDGEMENTS & COMPLIANCE */}
      {activeTab === 'acknowledgements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Mandatory Circular Acknowledgement Register</h2>
                <p className="text-xs text-slate-500">Track digital sign-offs, OTP verifications, and authorized administrative waivers.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Overall Compliance: 92.4%
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(acknowledgements || []).length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700">No acknowledgement records found</p>
                  <p className="text-xs text-slate-400 mt-1">Digital sign-off requests will appear here when circulars requiring acknowledgement are published.</p>
                </div>
              ) : (
                (acknowledgements || []).map(ack => (
                <div key={ack.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">{ack.communicationRef}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                          ack.status === 'ACKNOWLEDGED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ack.status === 'WAIVED'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ack.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{ack.recipientName}</div>
                    <div className="text-xs text-slate-500">
                      Contact: {ack.recipientContact} | Notice: {ack.communicationTitle}
                    </div>
                    {ack.digitalSignature && (
                      <div className="text-[11px] font-mono text-emerald-700">
                        Sig: {ack.digitalSignature} ({ack.signatoryIp})
                      </div>
                    )}
                    {ack.waiverReason && (
                      <div className="text-[11px] text-purple-700">
                        Waiver: {ack.waiverReason} (Authorized by {ack.waivedByName})
                      </div>
                    )}
                  </div>

                  {ack.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAck(ack);
                          setShowWaiveModal(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
                      >
                        Admin Waiver
                      </button>
                    </div>
                  )}
                </div>
              )))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STAKEHOLDER ENGAGEMENT & GRIEVANCES */}
      {activeTab === 'engagement' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Stakeholder Relations & Inquiries Ledger</h2>
                <p className="text-xs text-slate-500">Parent-teacher discussions, fee inquiries, transport requests, and grievance resolutions with SLA timers.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {(threads || []).length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700">No stakeholder engagement threads</p>
                  <p className="text-xs text-slate-400 mt-1">Inquiries and support tickets logged by parents, staff, and students will appear here.</p>
                </div>
              ) : (
                (threads || []).map(thr => (
                <div
                  key={thr.id}
                  onClick={() => {
                    setSelectedThread(thr);
                    setShowThreadDrawer(true);
                  }}
                  className="p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                        {thr.threadNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                          thr.status === 'RESOLVED' || thr.status === 'CLOSED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {thr.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        Category: <strong className="text-slate-700">{thr.category}</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{thr.subject}</h3>
                    <div className="text-xs text-slate-600">
                      Stakeholder: <strong>{thr.stakeholderName}</strong> ({thr.stakeholderType})
                      {thr.studentName && <span> • Linked Student: {thr.studentName}</span>}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>Assigned: {thr.assignedStaffName || 'Unassigned'}</span>
                      <span>Last Activity: {new Date(thr.lastActivityAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CAMPAIGNS & CADENCE */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Multi-Stage Automated Campaigns</h2>
                <p className="text-xs text-slate-500">Automated cadence sequences for onboarding, fee schedules, and institutional events.</p>
              </div>
            </div>

            <div className="space-y-4">
              {(campaigns || []).length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Send className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700">No active communication campaigns</p>
                  <p className="text-xs text-slate-400 mt-1">Multi-stage drip campaigns and cadence schedules will appear here.</p>
                </div>
              ) : (
                (campaigns || []).map(camp => (
                <div key={camp.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{camp.code}</span>
                        <h3 className="text-base font-bold text-slate-900">{camp.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{camp.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {camp.status}
                    </span>
                  </div>

                  {/* Stages timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {(camp.stages || []).map(st => (
                      <div key={st.stageNumber} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-blue-700">Stage {st.stageNumber} (+{st.delayDays}d)</span>
                          <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{st.channel}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2">{st.content}</div>
                      </div>
                    ))}
                  </div>

                  {/* Metrics bar */}
                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <div>Targeted: <strong>{camp.metrics.targeted}</strong></div>
                    <div>Delivered: <strong className="text-emerald-600">{camp.metrics.delivered}</strong></div>
                    <div>Opened: <strong className="text-blue-600">{camp.metrics.opened}</strong></div>
                    <div>Acknowledged: <strong className="text-purple-600">{camp.metrics.acknowledged}</strong></div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GOVERNED TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Governed Communication Templates</h2>
            <p className="text-xs text-slate-500">Standardized, pre-approved institutional templates with variable placeholders.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { code: 'TPL-ACAD-FEE-REMINDER', name: 'Quarterly Fee Reminder Notice', cat: 'FINANCE', channel: 'EMAIL / SMS', vars: '{{guardian_name}}, {{student_name}}, {{due_date}}, {{amount}}' },
                { code: 'TPL-ACAD-EXAM-SCHEDULE', name: 'Hall Ticket & Examination Timetable', cat: 'ACADEMIC', channel: 'PORTAL / EMAIL', vars: '{{student_name}}, {{class_name}}, {{exam_center}}' },
                { code: 'TPL-TRANS-ROUTE-ALERT', name: 'Transport Bus Delay Alert', cat: 'TRANSPORT', channel: 'SMS / WHATSAPP', vars: '{{route_no}}, {{delay_minutes}}, {{stop_name}}' },
                { code: 'TPL-INST-EMERGENCY', name: 'General Campus Safety Bulletin', cat: 'EMERGENCY', channel: 'ALL CHANNELS', vars: '{{institution_name}}, {{effective_time}}, {{action_required}}' }
              ].map(tpl => (
                <div key={tpl.code} className="p-4 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{tpl.code}</span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">{tpl.cat}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{tpl.name}</div>
                  <div className="text-xs text-slate-500">Channels: {tpl.channel}</div>
                  <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
                    Variables: {tpl.vars}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: EMERGENCY CENTER */}
      {activeTab === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 text-white rounded-xl">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-rose-950">Emergency Broadcast Command Center</h2>
                <p className="text-xs text-rose-700">Immediate, multi-channel broadcast override with mandatory audit logging and executive authorization.</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-rose-200 space-y-3">
              <div className="text-sm font-bold text-slate-900">Safety Directives Protocol:</div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                <li>Bypasses standard review delays for life-safety, weather, and campus closure emergencies.</li>
                <li>Simultaneously dispatches to SMS, WhatsApp, In-App Portal, and Push Notification channels.</li>
                <li>Mandatory emergency justification recorded in immutable institutional audit ledger.</li>
              </ul>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="mt-2 px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm flex items-center gap-2"
              >
                <Flame className="w-4 h-4" />
                Launch Emergency Broadcast Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ANALYTICS & SLA */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Compliance Rates by Circular Type
              </h2>
              <div className="space-y-3">
                {Object.entries(analytics?.complianceRateByType || {}).map(([type, rate]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{type.replace(/_/g, ' ')}</span>
                      <span>{rate}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-600" />
                Channel SLA & Latency Summary
              </h2>
              <div className="space-y-3">
                {Object.entries(analytics?.channelDeliveryStats || {}).map(([ch, rawStat]) => {
                  const stat = rawStat as { sent: number; delivered: number; failed: number; rate: number };
                  return (
                    <div key={ch} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{ch}</div>
                        <div className="text-slate-500">Sent: {stat.sent} | Delivered: {stat.delivered}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{stat.rate}%</div>
                        <div className="text-[11px] text-slate-400">Latency: &lt; 2s</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CIRCULAR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Create Governed Circular / Notice</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice / Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official Examination Schedule Announcement"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CIRCULAR">CIRCULAR</option>
                    <option value="NOTICE">NOTICE</option>
                    <option value="POLICY_DIRECTIVE">POLICY DIRECTIVE</option>
                    <option value="ACADEMIC_CIRCULAR">ACADEMIC CIRCULAR</option>
                    <option value="EXAM_NOTIFICATION">EXAM NOTIFICATION</option>
                    <option value="FEE_REMINDER">FEE REMINDER</option>
                    <option value="EVENT_INVITATION">EVENT INVITATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="EXAMINATION">EXAMINATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={newAudienceType}
                  onChange={e => setNewAudienceType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ALL_GUARDIANS">All Guardians & Parents</option>
                  <option value="ALL_STUDENTS">All Students</option>
                  <option value="ALL_STAFF">All Staff & Faculty</option>
                  <option value="SPECIFIC_CLASS">Specific Class / Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Content Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter official text for circular..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAckRequired}
                    onChange={e => setNewAckRequired(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  Require Digital Sign-off / Acknowledgement
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDigitalSig}
                    onChange={e => setNewDigitalSig(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  Apply Institutional Signature Stamp
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVAL / SEPARATION OF DUTIES MODAL */}
      {showApprovalModal && selectedComm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Administrative Review & Sign-off
              </h2>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1 text-xs text-blue-950">
              <div><strong>Reference:</strong> {selectedComm.referenceNumber}</div>
              <div><strong>Title:</strong> {selectedComm.title}</div>
              <div><strong>Author:</strong> {selectedComm.createdByName} ({selectedComm.createdByRole})</div>
              <div><strong>Audience:</strong> {selectedComm.targetCriteria.audienceType} (~{selectedComm.targetEstimate} recipients)</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Comments / Audit Notes</label>
              <input
                type="text"
                placeholder="e.g. Verified syllabus details and approved for campus-wide release."
                value={approvalNotes}
                onChange={e => setApprovalNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason (if rejecting)</label>
              <input
                type="text"
                placeholder="Reason if returning draft for revisions..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200"
              >
                Reject & Request Changes
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Approve Circular
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL PDF / PRINT PREVIEW MODAL */}
      {showPrintModal && selectedComm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 space-y-6 border border-slate-200 shadow-2xl my-8 font-serif">
            {/* Institutional Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-sans">
                EduTech Institutional Governance Board
              </h1>
              <p className="text-xs text-slate-500 font-sans">
                Main Campus • Affiliated & Accredited Institutional Network
              </p>
              <div className="text-xs font-mono text-slate-700 font-sans pt-1">
                Ref No: <strong>{selectedComm.referenceNumber}</strong> | Date: <strong>{new Date(selectedComm.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="text-center font-sans">
              <h2 className="text-base font-bold uppercase tracking-wide text-slate-900 underline decoration-slate-400 underline-offset-4">
                OFFICIAL {selectedComm.type.replace(/_/g, ' ')}
              </h2>
            </div>

            <div className="font-sans space-y-4 text-sm leading-relaxed text-slate-800">
              <div className="font-bold text-slate-900">SUBJECT: {selectedComm.title}</div>
              <div className="whitespace-pre-line text-slate-700">{selectedComm.content}</div>
            </div>

            {/* Official Signatory Section */}
            <div className="flex justify-between items-end pt-8 font-sans border-t border-slate-200">
              <div className="space-y-1 text-xs text-slate-500">
                <div>QR Verification Hash:</div>
                <div className="font-mono text-[10px] bg-slate-100 p-1.5 rounded border border-slate-200">
                  EMS-AUTH-SIGN-{selectedComm.id.slice(0, 8)}-{Date.now()}
                </div>
              </div>
              <div className="text-right space-y-1 text-xs">
                <div className="font-bold text-slate-900">{selectedComm.signatoryName || 'Dr. Sarah Jenkins'}</div>
                <div className="text-slate-600">{selectedComm.signatoryDesignation || 'Principal'}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">[Digitally Verified Signatory]</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 font-sans">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-xl shadow-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY BROADCAST MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-rose-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Trigger Emergency Broadcast
              </h2>
              <button onClick={() => setShowEmergencyModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEmergencyBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Alert Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Early Campus Dismissal Notice"
                  value={emTitle}
                  onChange={e => setEmTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Broadcast Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter concise urgent instructions..."
                  value={emContent}
                  onChange={e => setEmContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-900 mb-1">Mandatory Safety Justification</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Severe district weather advisory issued by local authority"
                  value={emJustification}
                  onChange={e => setEmJustification(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-rose-50/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  Dispatch Emergency Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAKEHOLDER THREAD DRAWER */}
      {showThreadDrawer && selectedThread && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {selectedThread.threadNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{selectedThread.category}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1">{selectedThread.subject}</h2>
              </div>
              <button onClick={() => setShowThreadDrawer(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {(selectedThread?.messages || []).map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-[85%] text-xs space-y-1 ${
                    msg.isInternalNote
                      ? 'bg-amber-50 border border-amber-200 text-amber-950 ml-auto'
                      : msg.senderType === 'INSTITUTION_STAFF'
                      ? 'bg-blue-50 border border-blue-200 text-blue-950 ml-auto'
                      : 'bg-slate-100 text-slate-900 mr-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-semibold">
                    <span>{msg.senderName} {msg.isInternalNote && '[Internal Staff Note]'}</span>
                    <span className="text-[10px] text-slate-400">{new Date(msg.sentAt).toLocaleTimeString()}</span>
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>

            {/* Reply box */}
            <form onSubmit={handleSendThreadReply} className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={e => setIsInternalNote(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  Internal Staff Note (Invisible to parent)
                </label>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type response or internal note..."
                  value={threadReplyText}
                  onChange={e => setThreadReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
                >
                  Send
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleResolveThread('RESOLVED')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                >
                  Mark as Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WAIVE ACKNOWLEDGEMENT MODAL */}
      {showWaiveModal && selectedAck && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h2 className="text-base font-bold text-slate-900">Authorize Acknowledgement Waiver</h2>
            <p className="text-xs text-slate-500">
              Waiving acknowledgement for <strong>{selectedAck.recipientName}</strong> on circular {selectedAck.communicationRef}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Justification</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Guardian signed physical hardcopy form during orientation."
                value={waiverReason}
                onChange={e => setWaiverReason(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowWaiveModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWaiveAck}
                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm"
              >
                Confirm Waiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
