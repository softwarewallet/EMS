import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Award, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Printer, 
  RotateCcw, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sliders, 
  Settings, 
  ShieldCheck, 
  Users, 
  Layers, 
  Sparkles, 
  Check, 
  FileCheck,
  Building,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FileCode,
  Download
} from 'lucide-react';
import { 
  Certificate, 
  CertificateDocumentType, 
  CertificateStatus, 
  CertificateTemplate, 
  CertificateNumberingConfig, 
  AuthorizedSignatory,
  CertificateSnapshot,
  ExitRequest,
  Student
} from '../../types';
import { CertificateService } from '../../services/certificateService';
import { StudentExitService } from '../../services/studentExitService';
import { StudentService } from '../../services/studentService';
import { CertificateDocumentRenderer } from './CertificateDocumentRenderer';
import { CertificateReissueModal } from './CertificateReissueModal';
import { CertificateCancellationModal } from './CertificateCancellationModal';
import { PublicCertificateVerificationView } from './PublicCertificateVerificationView';

interface CertificateManagementViewProps {
  tenantId: string;
  currentUser: any;
  onOpenStudent360?: (studentId: string) => void;
}

export const CertificateManagementView: React.FC<CertificateManagementViewProps> = ({
  tenantId,
  currentUser,
  onOpenStudent360
}) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'queue' | 'templates' | 'numbering' | 'signatories' | 'verification'>('registry');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [queueRequests, setQueueRequests] = useState<ExitRequest[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, Student>>({});
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [numberingConfig, setNumberingConfig] = useState<CertificateNumberingConfig | null>(null);
  const [signatories, setSignatories] = useState<AuthorizedSignatory[]>([]);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal / Document Preview states
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<CertificateSnapshot | null>(null);
  const [isViewingDoc, setIsViewingDoc] = useState(false);
  const [reissueTarget, setReissueTarget] = useState<Certificate | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Certificate | null>(null);

  // Template Editing state
  const [editingTemplate, setEditingTemplate] = useState<CertificateTemplate | null>(null);

  // Generation / Action loading
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const permissions = CertificateService.getUserPermissions(currentUser, tenantId);
  const canIssue = permissions.includes('certificate.issue') || permissions.includes('platform.admin');
  const canCreate = permissions.includes('certificate.create') || permissions.includes('platform.admin');
  const canReissue = permissions.includes('certificate.reissue') || permissions.includes('platform.admin');
  const canCancel = permissions.includes('certificate.cancel') || permissions.includes('platform.admin');
  const canManageTemplates = permissions.includes('certificate.template.edit') || permissions.includes('platform.admin');
  const canManageNumbering = permissions.includes('certificate.numbering.manage') || permissions.includes('platform.admin');

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch certificates
      const certs = await CertificateService.getCertificates(tenantId, currentUser);
      setCertificates(certs);

      // 2. Fetch Exit Requests for Queue
      const allExits = await StudentExitService.getExitRequests(tenantId, currentUser);
      const eligibleExits = allExits.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED');
      setQueueRequests(eligibleExits);

      // 3. Cache students
      const studentIds = new Set<string>();
      certs.forEach(c => studentIds.add(c.studentId));
      eligibleExits.forEach(e => studentIds.add(e.studentId));

      const sMap: Record<string, Student> = {};
      for (const sId of Array.from(studentIds)) {
        const s = await StudentService.getStudentById(sId, currentUser);
        if (s) sMap[sId] = s;
      }
      setStudentsMap(sMap);

      // 4. Fetch Templates, Numbering Config, and Signatories
      const tmpls = await CertificateService.getTemplates(tenantId, currentUser);
      setTemplates(tmpls);

      const numCfg = await CertificateService.getNumberingConfig(tenantId, 'TRANSFER_CERTIFICATE');
      setNumberingConfig(numCfg);

      const sigs = await CertificateService.getSignatories(tenantId);
      setSignatories(sigs);

    } catch (err) {
      console.error('Failed loading certificate module data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  // Open Document Viewer
  const handleOpenCertificate = async (cert: Certificate) => {
    setActionLoadingId(cert.id);
    try {
      const snap = await CertificateService.getSnapshotById(cert.snapshotId);
      if (snap) {
        setSelectedCertificate(cert);
        setSelectedSnapshot(snap);
        setIsViewingDoc(true);
      } else {
        setFeedbackMessage({ type: 'error', text: 'Snapshot not found for this certificate record.' });
      }
    } catch (err) {
      setFeedbackMessage({ type: 'error', text: 'Failed to load certificate document.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Generate Draft from Queue
  const handleGenerateDraft = async (exitReq: ExitRequest) => {
    setActionLoadingId(exitReq.id);
    try {
      const draft = await CertificateService.createDraftCertificate({
        tenantId,
        studentId: exitReq.studentId,
        exitRequestId: exitReq.id,
        documentType: 'TRANSFER_CERTIFICATE'
      }, currentUser);

      setFeedbackMessage({ type: 'success', text: `Draft Transfer Certificate created for student.` });
      await loadData();
      
      // Auto open newly created draft
      await handleOpenCertificate(draft);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to generate draft certificate.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Direct Issue Action
  const handleIssueCertificate = async (certId: string) => {
    setActionLoadingId(certId);
    try {
      const issued = await CertificateService.issueCertificate(certId, tenantId, currentUser);
      setFeedbackMessage({ type: 'success', text: `Official Certificate #${issued.certificateNumber} issued successfully!` });
      await loadData();
      if (selectedCertificate?.id === certId) {
        await handleOpenCertificate(issued);
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to issue certificate.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Execute Reissue
  const handleConfirmReissue = async (reason: any, description: string, signatoryId?: string) => {
    if (!reissueTarget) return;
    try {
      const { newCertificate } = await CertificateService.reissueCertificate({
        originalCertificateId: reissueTarget.id,
        tenantId,
        reason,
        reasonDescription: description,
        signatoryId
      }, currentUser);

      setFeedbackMessage({ type: 'success', text: `Certificate reissued successfully! New Certificate #${newCertificate.certificateNumber}` });
      await loadData();
      setReissueTarget(null);
      setIsViewingDoc(false);
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to reissue certificate.' });
    }
  };

  // Execute Cancel
  const handleConfirmCancel = async (reason: string) => {
    if (!cancelTarget) return;
    try {
      const cancelled = await CertificateService.cancelCertificate(cancelTarget.id, tenantId, reason, currentUser);
      setFeedbackMessage({ type: 'success', text: `Certificate #${cancelled.certificateNumber} cancelled.` });
      await loadData();
      setCancelTarget(null);
      if (selectedCertificate?.id === cancelTarget.id) {
        await handleOpenCertificate(cancelled);
      }
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to cancel certificate.' });
    }
  };

  // Save Numbering Config
  const handleSaveNumbering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numberingConfig) return;
    try {
      const updated = await CertificateService.saveNumberingConfig(numberingConfig, currentUser);
      setNumberingConfig(updated);
      setFeedbackMessage({ type: 'success', text: 'Certificate numbering configuration saved successfully.' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to save configuration.' });
    }
  };

  // Filter Certificates for Registry
  const filteredCertificates = certificates.filter(c => {
    const student = studentsMap[c.studentId];
    const sName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
    const admNo = student?.admissionNumber?.toLowerCase() || '';
    const certNo = c.certificateNumber.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !query || sName.includes(query) || admNo.includes(query) || certNo.includes(query);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || c.documentType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalIssued = certificates.filter(c => c.status === 'ISSUED').length;
  const totalDrafts = certificates.filter(c => c.status === 'DRAFT' || c.status === 'PENDING_VERIFICATION' || c.status === 'READY_FOR_SIGNATURE').length;
  const totalReissued = certificates.filter(c => c.status === 'REISSUED').length;
  const totalCancelled = certificates.filter(c => c.status === 'CANCELLED').length;
  const queuePendingCount = queueRequests.filter(r => !certificates.some(c => c.exitRequestId === r.id && c.status === 'ISSUED')).length;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {feedbackMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold animate-in fade-in duration-150 ${
          feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50' :
          'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-2xs font-bold uppercase underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Module Title & Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Certificate Generation & Transfer Registry
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phase 6.4B · Authoritative Transfer Certificates, School Leaving Certificates & Verification
              </p>
            </div>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
            <span className="text-2xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Issued Active</span>
            <p className="text-lg font-black text-indigo-900 dark:text-indigo-100">{totalIssued}</p>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl">
            <span className="text-2xs font-bold text-amber-700 dark:text-amber-300 uppercase">Drafts in Prep</span>
            <p className="text-lg font-black text-amber-900 dark:text-amber-100">{totalDrafts}</p>
          </div>
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-xl">
            <span className="text-2xs font-bold text-purple-700 dark:text-purple-300 uppercase">Exit Queue</span>
            <p className="text-lg font-black text-purple-900 dark:text-purple-100">{queuePendingCount}</p>
          </div>
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-2xs font-bold text-slate-600 dark:text-slate-400 uppercase">Reissued/Revoked</span>
            <p className="text-lg font-black text-slate-900 dark:text-slate-100">{totalReissued + totalCancelled}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('registry'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'registry'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Official Document Registry ({certificates.length})
        </button>

        <button
          onClick={() => { setActiveTab('queue'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'queue'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          Generation Queue ({queuePendingCount})
        </button>

        <button
          onClick={() => { setActiveTab('templates'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Templates & Boards ({templates.length})
        </button>

        <button
          onClick={() => { setActiveTab('numbering'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'numbering'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          Numbering Engine & Policy
        </button>

        <button
          onClick={() => { setActiveTab('signatories'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'signatories'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Authorized Signatories ({signatories.length})
        </button>

        <button
          onClick={() => { setActiveTab('verification'); setIsViewingDoc(false); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'verification'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Public Verification Simulator
        </button>
      </div>

      {/* ==================== TAB 1: REGISTRY ==================== */}
      {activeTab === 'registry' && !isViewingDoc && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[240px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, admission no, or certificate no..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="ISSUED">ISSUED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="READY_FOR_SIGNATURE">READY FOR SIGNATURE</option>
                <option value="REISSUED">REISSUED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
              >
                <option value="ALL">All Document Types</option>
                <option value="TRANSFER_CERTIFICATE">Transfer Certificate (TC)</option>
                <option value="SCHOOL_LEAVING_CERTIFICATE">School Leaving Certificate (SLC)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                title="Refresh Records"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-2xs font-bold">
                    <th className="py-3 px-4">Certificate No.</th>
                    <th className="py-3 px-4">Student / Admission No</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Version</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No certificates found matching criteria. Check the Generation Queue to prepare new documents.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((cert) => {
                      const student = studentsMap[cert.studentId];
                      return (
                        <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {cert.certificateNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => onOpenStudent360 && onOpenStudent360(cert.studentId)}
                              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-left block"
                            >
                              {student ? `${student.firstName} ${student.lastName}` : 'Student Name'}
                            </button>
                            <span className="text-2xs text-slate-400 font-mono">
                              Adm: {student?.admissionNumber || 'ADM-PENDING'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {cert.documentType?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-mono text-2xs">
                              v{cert.certificateVersion || 1}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {cert.issueDate || 'Pending Issue'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                              cert.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                              cert.status === 'DRAFT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' :
                              cert.status === 'READY_FOR_SIGNATURE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300' :
                              cert.status === 'REISSUED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}>
                              {cert.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenCertificate(cert)}
                                disabled={actionLoadingId === cert.id}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View / Print
                              </button>

                              {cert.status !== 'ISSUED' && cert.status !== 'CANCELLED' && cert.status !== 'REISSUED' && canIssue && (
                                <button
                                  onClick={() => handleIssueCertificate(cert.id)}
                                  disabled={actionLoadingId === cert.id}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Issue
                                </button>
                              )}

                              {cert.status === 'ISSUED' && canReissue && (
                                <button
                                  onClick={() => setReissueTarget(cert)}
                                  className="p-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-md cursor-pointer"
                                  title="Reissue Certificate"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {cert.status === 'ISSUED' && canCancel && (
                                <button
                                  onClick={() => setCancelTarget(cert)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md cursor-pointer"
                                  title="Cancel Certificate"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ACTIVE DOCUMENT VIEWER ==================== */}
      {isViewingDoc && selectedCertificate && selectedSnapshot && (
        <CertificateDocumentRenderer
          certificate={selectedCertificate}
          snapshot={selectedSnapshot}
          template={templates.find(t => t.id === selectedCertificate.templateId)}
          onClose={() => setIsViewingDoc(false)}
          onReissue={() => setReissueTarget(selectedCertificate)}
          onCancel={() => setCancelTarget(selectedCertificate)}
        />
      )}

      {/* ==================== TAB 2: GENERATION QUEUE ==================== */}
      {activeTab === 'queue' && !isViewingDoc && (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-xs text-indigo-900 dark:text-indigo-300">
            <p className="font-bold">Authoritative Certificate Generation Queue</p>
            <p className="text-2xs mt-0.5">
              The following students have Exit Requests in <strong>APPROVED</strong> or <strong>COMPLETED</strong> status and are eligible for official Transfer Certificate generation. Clearance status is validated before draft creation.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-2xs font-bold">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Admission No</th>
                    <th className="py-3 px-4">Exit Type</th>
                    <th className="py-3 px-4">Effective Exit Date</th>
                    <th className="py-3 px-4">Exit Status</th>
                    <th className="py-3 px-4">Existing Certificate</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {queueRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No exit requests currently pending certificate generation.
                      </td>
                    </tr>
                  ) : (
                    queueRequests.map((req) => {
                      const student = studentsMap[req.studentId];
                      const existingCert = certificates.find(c => c.exitRequestId === req.id && c.status !== 'CANCELLED');

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                            {student ? `${student.firstName} ${student.lastName}` : 'Student Name'}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {student?.admissionNumber || 'ADM-PENDING'}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {req.exitType?.replace(/_/g, ' ') || 'Unknown'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {req.proposedLastDate || req.requestedDate}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-full text-2xs font-bold uppercase">
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {existingCert ? (
                              <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase ${
                                existingCert.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {existingCert.status}: #{existingCert.certificateNumber}
                              </span>
                            ) : (
                              <span className="text-2xs text-slate-400 italic">None Issued</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {existingCert ? (
                              <button
                                onClick={() => handleOpenCertificate(existingCert)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg cursor-pointer"
                              >
                                View {existingCert.certificateNumber}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleGenerateDraft(req)}
                                disabled={actionLoadingId === req.id || !canCreate}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                {actionLoadingId === req.id ? 'Generating...' : 'Generate TC'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: TEMPLATES & BOARDS ==================== */}
      {activeTab === 'templates' && !isViewingDoc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Institutional Certificate Templates & Board Layouts
            </h2>
            {canManageTemplates && (
              <button 
                onClick={() => setFeedbackMessage({ type: 'success', text: 'Template designer initialized.' })}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Board Template
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-2xs rounded-md">
                      {tmpl.boardType} BOARD
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                      {tmpl.name}
                    </h3>
                    <p className="text-2xs text-slate-400 font-mono">
                      Code: {tmpl.code} | Version: {tmpl.version}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase ${
                    tmpl.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tmpl.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Header Title: <span className="font-normal text-slate-900 dark:text-slate-100">{tmpl.header.title}</span>
                  </p>
                  <p className="text-2xs text-slate-500">
                    Affiliation: {tmpl.header.affiliationText || 'Configured'}
                  </p>
                  <p className="text-2xs text-slate-500">
                    Configured Fields: {tmpl.fieldsConfig?.length || 20} Data Attributes
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                  <span className="text-2xs text-slate-400">
                    QR Verification: {tmpl.footer.showQrCode ? 'Enabled' : 'Disabled'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-emerald-600 font-bold">
                      {tmpl.isDefault ? 'Default Active Template' : 'Secondary Template'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: NUMBERING ENGINE & POLICY ==================== */}
      {activeTab === 'numbering' && numberingConfig && !isViewingDoc && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Official Certificate Numbering Engine
              </h2>
              <p className="text-2xs text-slate-500">
                Configure sequential formatting, prefix codes, and zero-padding for non-reusable certificate numbers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveNumbering} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Document Prefix
                </label>
                <input
                  type="text"
                  value={numberingConfig.prefix}
                  onChange={(e) => setNumberingConfig({ ...numberingConfig, prefix: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Format Pattern
                </label>
                <input
                  type="text"
                  value={numberingConfig.formatPattern}
                  onChange={(e) => setNumberingConfig({ ...numberingConfig, formatPattern: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Academic Year Representation
                </label>
                <select
                  value={numberingConfig.academicYearFormat}
                  onChange={(e) => setNumberingConfig({ ...numberingConfig, academicYearFormat: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-medium"
                >
                  <option value="YYYY-YY">Full Academic Year (e.g. 2026-27)</option>
                  <option value="YY-YY">Short Year (e.g. 26-27)</option>
                  <option value="YYYY">Calendar Year (e.g. 2026)</option>
                  <option value="NONE">Exclude Year from Number</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Sequence Padding Length
                </label>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={numberingConfig.paddingLength}
                  onChange={(e) => setNumberingConfig({ ...numberingConfig, paddingLength: parseInt(e.target.value) || 6 })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Pattern Preview Box */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1">
              <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Live Next Number Preview</span>
              <p className="text-lg font-mono font-bold text-emerald-400">
                {(numberingConfig.formatPattern || '{PREFIX}/{YEAR}/{SEQ}')
                  .replace('{CAMPUS}', 'MAIN')
                  .replace('{PREFIX}', numberingConfig.prefix || 'TC')
                  .replace('{YEAR}', '2026-27')
                  .replace('{SEQ}', ((numberingConfig.currentSequence || 0) + 1).toString().padStart(numberingConfig.paddingLength || 4, '0'))}
              </p>
              <p className="text-2xs text-slate-400">
                Current Sequence Counter: {numberingConfig.currentSequence || 0} | Total Reserved/Issued: {numberingConfig.reservedNumbers?.length || 0}
              </p>
            </div>

            {canManageNumbering && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  Save Numbering Policy
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ==================== TAB 5: AUTHORIZED SIGNATORIES ==================== */}
      {activeTab === 'signatories' && !isViewingDoc && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Institutional Signatory Registry
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {signatories.map((sig) => (
              <div key={sig.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{sig.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{sig.designation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-2xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-mono">Role: {sig.role}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    sig.canIssue ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {sig.canIssue ? 'Authorized to Issue' : 'Reviewer / Registrar'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: PUBLIC VERIFICATION SIMULATOR ==================== */}
      {activeTab === 'verification' && !isViewingDoc && (
        <PublicCertificateVerificationView 
          initialVerificationCode={certificates[0]?.verificationCode}
        />
      )}

      {/* Reissue Modal */}
      {reissueTarget && (
        <CertificateReissueModal
          certificate={reissueTarget}
          signatories={signatories}
          isOpen={true}
          onClose={() => setReissueTarget(null)}
          onConfirm={handleConfirmReissue}
        />
      )}

      {/* Cancellation Modal */}
      {cancelTarget && (
        <CertificateCancellationModal
          certificate={cancelTarget}
          isOpen={true}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
        />
      )}

    </div>
  );
};
