import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Clock, 
  FileCheck, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  ArrowRight,
  Info,
  DollarSign,
  User,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Award,
  Eye,
  Printer
} from 'lucide-react';
import { StudentExitService } from '../../services/studentExitService';
import { StudentService } from '../../services/studentService';
import { CertificateService } from '../../services/certificateService';
import { ExitRequest, ClearanceCase, ClearanceItem, Student, ExitType, Certificate, CertificateSnapshot } from '../../types';
import { CertificateDocumentRenderer } from '../certificates/CertificateDocumentRenderer';
import { useNotification } from '../../context/NotificationContext';

interface Student360ExitTabProps {
  student: Student;
  currentUser: any;
  onRefresh: () => void;
}

export const Student360ExitTab: React.FC<Student360ExitTabProps> = ({ 
  student, 
  currentUser,
  onRefresh
}) => {
  const { notify } = useNotification();
  const [requests, setRequests] = useState<ExitRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<ExitRequest | null>(null);
  const [clearanceCase, setClearanceCase] = useState<ClearanceCase | null>(null);
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Create Form State
  const [exitType, setExitType] = useState<ExitType>('WITHDRAWAL');
  const [proposedLastDate, setProposedLastDate] = useState('');
  const [reason, setReason] = useState('CHANGE_OF_SCHOOL');
  const [destinationInstitution, setDestinationInstitution] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [remarks, setRemarks] = useState('');

  // Administrative Override state
  const [adminRemarks, setAdminRemarks] = useState('');
  const [blockAmount, setBlockAmount] = useState<number>(0);
  const [blockRemarks, setBlockRemarks] = useState('');
  const [waiveReason, setWaiveReason] = useState('');
  const [activeActionItemId, setActiveActionItemId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'block' | 'waive' | 'clear' | null>(null);

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertForView, setSelectedCertForView] = useState<Certificate | null>(null);
  const [selectedCertSnapshot, setSelectedCertSnapshot] = useState<CertificateSnapshot | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const permissions = StudentExitService.getUserPermissions(currentUser, student.tenantId);
  const certPermissions = CertificateService.getUserPermissions(currentUser, student.tenantId);
  const hasCreatePerm = permissions.includes('exit.create');
  const hasReviewPerm = permissions.includes('exit.review');
  const hasApprovePerm = permissions.includes('exit.approve');
  const hasCompletePerm = permissions.includes('exit.complete');
  const hasCancelPerm = permissions.includes('exit.cancel');
  const hasClearancePerm = permissions.includes('clearance.clear');
  const canIssueCert = certPermissions.includes('certificate.issue') || certPermissions.includes('platform.admin');
  const canCreateCert = certPermissions.includes('certificate.create') || certPermissions.includes('platform.admin');

  const loadExitData = async () => {
    try {
      const allReqs = await StudentExitService.getExitRequestsByStudent(student.id, student.tenantId, currentUser);
      setRequests(allReqs);
      
      const certs = await CertificateService.getCertificatesByStudent(student.id, student.tenantId, currentUser);
      setCertificates(certs);

      const active = allReqs.find(r => r.status !== 'CANCELLED' && r.status !== 'REJECTED' && r.status !== 'COMPLETED');
      if (active) {
        setActiveRequest(active);
        const cCase = await StudentExitService.getClearanceCaseByRequest(active.id, student.tenantId);
        setClearanceCase(cCase);
        if (cCase) {
          const items = await StudentExitService.getClearanceItems(cCase.id, student.tenantId);
          setClearanceItems(items);
        } else {
          setClearanceItems([]);
        }
      } else {
        setActiveRequest(null);
        setClearanceCase(null);
        setClearanceItems([]);
      }
    } catch (err: any) {
      console.error('Failed to load exit request records:', err);
    }
  };

  const handleOpenCertificate = async (cert: Certificate) => {
    try {
      const snap = await CertificateService.getSnapshotById(cert.snapshotId);
      if (snap) {
        setSelectedCertForView(cert);
        setSelectedCertSnapshot(snap);
      } else {
        notify('error', 'Document Error', 'Certificate snapshot could not be found.');
      }
    } catch {
      notify('error', 'Document Error', 'Failed to load certificate document.');
    }
  };

  const handleGenerateCertificate = async (exitReqId: string) => {
    setIsGeneratingCert(true);
    try {
      const draft = await CertificateService.createDraftCertificate({
        tenantId: student.tenantId,
        studentId: student.id,
        exitRequestId: exitReqId,
        documentType: 'TRANSFER_CERTIFICATE'
      }, currentUser);

      notify('success', 'Draft Created', 'Draft Transfer Certificate generated successfully.');
      await loadExitData();
      await handleOpenCertificate(draft);
    } catch (err: any) {
      notify('error', 'Generation Error', err.message || 'Failed to generate certificate.');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  useEffect(() => {
    loadExitData();
  }, [student.id, currentUser]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedLastDate) {
      notify('error', 'Required Field', 'Proposed Last Date is strictly mandatory.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReq = await StudentExitService.createExitRequest({
        tenantId: student.tenantId,
        studentId: student.id,
        exitType,
        requestedDate: new Date().toISOString().split('T')[0],
        proposedLastDate,
        reason,
        destinationInstitution: destinationInstitution || undefined,
        destinationCity: destinationCity || undefined,
        destinationState: destinationState || undefined,
        destinationCountry: destinationCountry || undefined,
        remarks: remarks || undefined
      }, currentUser);

      notify('success', 'Request Draft Created', `A new student exit request was successfully drafted (ID: ${newReq.id}).`);
      setShowCreateForm(false);
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Creation Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransition = async (status: any) => {
    if (!activeRequest) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.updateRequestStatus(
        activeRequest.id, 
        student.tenantId, 
        status, 
        adminRemarks || undefined,
        currentUser
      );
      notify('success', 'Workflow State Advanced', `Request transitioned to ${status?.replace(/_/g, ' ') || 'unknown'} successfully.`);
      setAdminRemarks('');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Transition Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDraft = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.submitExitRequest(activeRequest.id, student.tenantId, currentUser);
      notify('success', 'Request Submitted', 'Exit request was submitted to the institution registrar.');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Submission Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.reviewExitRequest(activeRequest.id, student.tenantId, adminRemarks || undefined, currentUser);
      notify('success', 'Review Started', 'Request put under formal institutional review.');
      setAdminRemarks('');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Review Transition Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!activeRequest) return;
    if (!window.confirm('Are you absolutely sure you want to cancel this active exit workflow? This operation is irreversible.')) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.cancelExitRequest(activeRequest.id, student.tenantId, adminRemarks || undefined, currentUser);
      notify('success', 'Request Cancelled', 'The exit request was cancelled.');
      setAdminRemarks('');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Cancellation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!activeRequest) return;
    if (!adminRemarks) {
      notify('error', 'Required Feedback', 'Administrative rejection remarks are strictly required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await StudentExitService.rejectExitRequest(activeRequest.id, student.tenantId, adminRemarks, currentUser);
      notify('success', 'Request Rejected', 'The student exit request was rejected with feedback.');
      setAdminRemarks('');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Rejection Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!activeRequest) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.approveExitRequest(activeRequest.id, student.tenantId, adminRemarks || undefined, currentUser);
      notify('success', 'Request Approved', 'The student exit was approved. Ready for execution.');
      setAdminRemarks('');
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Approval Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteExecution = async () => {
    if (!activeRequest) return;
    if (!window.confirm(`WARNING: Executing this will permanently change ${student.firstName}'s institutional status to WITHDRAWN / TRANSFERRED, seal their active enrollment record, and conclude the workflow. Do you wish to proceed?`)) return;
    setIsSubmitting(true);
    try {
      await StudentExitService.completeExitRequest(activeRequest.id, student.tenantId, currentUser);
      notify('success', 'Execution Concluded', `Student status transitioned. Workflow marked complete.`);
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Execution Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearItem = async (itemId: string, dept: string) => {
    setIsSubmitting(true);
    try {
      await StudentExitService.resolveClearanceItem(itemId, student.tenantId, blockRemarks || undefined, currentUser);
      notify('success', 'Department Cleared', `${dept} hold was resolved and marked CLEARED.`);
      setBlockRemarks('');
      setActiveActionItemId(null);
      setActionType(null);
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Clearance Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockItem = async (itemId: string, dept: string) => {
    if (!blockRemarks) {
      notify('error', 'Required Field', 'Please provide a clear reason for blocking.');
      return;
    }
    setIsSubmitting(true);
    try {
      await StudentExitService.blockClearanceItem(itemId, student.tenantId, blockRemarks, blockAmount, currentUser);
      notify('success', 'Hold Placed', `Blocked status posted on ${dept} clearance.`);
      setBlockRemarks('');
      setBlockAmount(0);
      setActiveActionItemId(null);
      setActionType(null);
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Block Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaiveItem = async (itemId: string, dept: string) => {
    if (!waiveReason) {
      notify('error', 'Required Field', 'Administrative waive reason is strictly required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await StudentExitService.waiveClearanceItem(itemId, student.tenantId, waiveReason, currentUser);
      notify('success', 'Hold Waived', `Bypassed/Waived hold on ${dept} department.`);
      setWaiveReason('');
      setActiveActionItemId(null);
      setActionType(null);
      await loadExitData();
      onRefresh();
    } catch (err: any) {
      notify('error', 'Waive Operation Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800';
      case 'SUBMITTED': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-300 dark:border-sky-800';
      case 'UNDER_REVIEW': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800';
      case 'CLEARANCE_IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-800';
      case 'READY_FOR_APPROVAL': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-800';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'COMPLETED': return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-800';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-800';
      case 'CANCELLED': return 'bg-slate-150 text-slate-600 border-slate-200 dark:bg-slate-850 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getClearanceItemStatusIcon = (status: string) => {
    switch (status) {
      case 'CLEARED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'WAIVED': return <Sparkles className="w-4 h-4 text-teal-500" />;
      case 'BLOCKED': return <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'NOT_REQUIRED': return <Clock className="w-4 h-4 text-slate-400" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div id="student_exit_tab_container" className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-1.5">
            <LogOut className="w-4 h-4 text-slate-500" />
            Institutional Exit & Clearance Workflow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Active Student status: <span className="font-semibold">{student.status}</span>.
            Create, track, and process multi-department clearance, parents' transfer or withdrawal requests, and final sign-offs.
          </p>
        </div>

        {!activeRequest && !showCreateForm && student.status !== 'WITHDRAWN' && student.status !== 'TRANSFERRED' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Initiate Exit request
          </button>
        )}
      </div>

      {/* 2. Create Request Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateRequest} className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Draft Exit Application</h4>
            <button 
              type="button" 
              onClick={() => setShowCreateForm(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Exit Type *</label>
              <select
                value={exitType}
                onChange={(e) => setExitType(e.target.value as ExitType)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              >
                <option value="WITHDRAWAL">Withdrawal (General)</option>
                <option value="TRANSFER">Official Transfer</option>
                <option value="GRADUATION">Graduation</option>
                <option value="COMPLETION">Completion of Study</option>
                <option value="OTHER">Other Reason</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Proposed Last Date of Attendance *</label>
              <input
                type="date"
                required
                value={proposedLastDate}
                onChange={(e) => setProposedLastDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              >
                <option value="FAMILY_RELOCATION">Family Relocation</option>
                <option value="CHANGE_OF_SCHOOL">Moving to Another School</option>
                <option value="FINANCIAL_REASON">Financial Constraints</option>
                <option value="HEALTH_REASON">Medical / Health Reasons</option>
                <option value="PERSONAL_REASON">Personal Reasons</option>
                <option value="OTHER">Other Reason</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Institution</label>
              <input
                type="text"
                placeholder="e.g. Pinehurst Academy"
                value={destinationInstitution}
                onChange={(e) => setDestinationInstitution(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination City</label>
              <input
                type="text"
                placeholder="City"
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination State</label>
              <input
                type="text"
                placeholder="State / Region"
                value={destinationState}
                onChange={(e) => setDestinationState(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Destination Country</label>
              <input
                type="text"
                placeholder="Country"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Remarks / Explanations</label>
            <textarea
              rows={2}
              placeholder="Provide context or explanation..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-950 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-900 pt-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-55"
            >
              Discard Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1"
            >
              {isSubmitting ? 'Processing...' : 'Create Draft Application'}
            </button>
          </div>
        </form>
      )}

      {/* 3. Active Exit Workflow Details */}
      {activeRequest && (
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                <LogOut className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Active Exit Request: #{activeRequest.id}</h4>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(activeRequest.status)}`}>
                    {activeRequest.status?.replace(/_/g, ' ') || 'Unknown Status'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Created by {activeRequest.requestedByRole.toUpperCase()} on {new Date(activeRequest.requestedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quick Actions based on status */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeRequest.status === 'DRAFT' && (
                <>
                  <button
                    onClick={handleSubmitDraft}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-3 py-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                  >
                    Discard
                  </button>
                </>
              )}

              {activeRequest.status === 'SUBMITTED' && hasReviewPerm && (
                <>
                  <button
                    onClick={handleReview}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Initiate Review
                  </button>
                </>
              )}

              {activeRequest.status === 'UNDER_REVIEW' && hasReviewPerm && (
                <>
                  <button
                    onClick={() => handleTransition('CLEARANCE_PENDING')}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Approve & Trigger Clearance
                  </button>
                </>
              )}

              {activeRequest.status === 'READY_FOR_APPROVAL' && hasApprovePerm && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    Grant Approval
                  </button>
                </>
              )}

              {activeRequest.status === 'APPROVED' && hasCompletePerm && (
                <>
                  <button
                    onClick={handleCompleteExecution}
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-xs"
                  >
                    Conclude Student Exit
                  </button>
                </>
              )}

              {activeRequest.status !== 'APPROVED' && activeRequest.status !== 'COMPLETED' && activeRequest.status !== 'DRAFT' && hasReviewPerm && (
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                >
                  Reject
                </button>
              )}

              {activeRequest.status !== 'DRAFT' && activeRequest.status !== 'COMPLETED' && (isSubmitting || hasCancelPerm || activeRequest.requestedBy === currentUser.id) && (
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-3 py-1 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>

          {/* Details body */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs border-b border-slate-100 dark:border-slate-900">
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Exit Type</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeRequest.exitType}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Proposed Last Attendance Date</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{new Date(activeRequest.proposedLastDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Primary Reason</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{activeRequest.reason?.replace(/_/g, ' ') || 'Not Specified'}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-500 dark:text-slate-400">Destination Location</p>
              <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeRequest.destinationInstitution || 'Not Specified'} 
                {activeRequest.destinationCity ? ` (${activeRequest.destinationCity}, ${activeRequest.destinationState || ''})` : ''}
              </p>
            </div>

            {activeRequest.remarks && (
              <div className="md:col-span-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-150 dark:border-slate-800 mt-1">
                <span className="font-bold text-slate-500 block mb-0.5 text-[10px] uppercase tracking-wide">Applicant Remarks & Instructions</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs italic">{activeRequest.remarks}</p>
              </div>
            )}
          </div>

          {/* Admin Feedback Override inputs */}
          {hasReviewPerm && (activeRequest.status === 'SUBMITTED' || activeRequest.status === 'UNDER_REVIEW' || activeRequest.status === 'CLEARANCE_IN_PROGRESS' || activeRequest.status === 'READY_FOR_APPROVAL') && (
            <div className="p-4 bg-indigo-50/25 dark:bg-indigo-950/10 border-b border-slate-100 dark:border-slate-900 space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Administrative Feedback / Transition Remarks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter rejection reason or operational sign-off remarks..."
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-indigo-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Live Clearance Department progress */}
          {clearanceCase && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  Dynamic Multi-Department Clearance Case: {clearanceCase.status}
                </h5>
                <span className="text-[10px] text-slate-400">Opened {new Date(clearanceCase.openedAt).toLocaleString()}</span>
              </div>

              {/* Blocking Items Alert banner */}
              {clearanceItems.some(i => i.status === 'BLOCKED') && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-lg flex items-start gap-2 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold block">Approval Blocks Identified</span>
                    Exit approval is restricted due to outstanding obligations in blocked departments. Please review resolving details below.
                  </div>
                </div>
              )}

              {/* Clearance list */}
              <div className="space-y-2.5">
                {clearanceItems.map(item => {
                  const isActionActive = activeActionItemId === item.id;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors ${
                        item.status === 'BLOCKED'
                          ? 'border-rose-200 bg-rose-50/10'
                          : item.status === 'CLEARED' || item.status === 'WAIVED'
                          ? 'border-emerald-100 bg-emerald-50/5'
                          : 'border-slate-150'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {getClearanceItemStatusIcon(item.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-950 dark:text-white">{item.department}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              item.status === 'BLOCKED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              item.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              item.status === 'WAIVED' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                              item.status === 'NOT_REQUIRED' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {item.status}
                            </span>
                            {item.blocking && (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold uppercase px-1 rounded">
                                Blocking
                              </span>
                            )}
                          </div>
                          
                          {item.remarks && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                              &ldquo;{item.remarks}&rdquo;
                            </p>
                          )}

                          {item.amount && item.amount > 0 ? (
                            <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3" />
                              Outstanding Dues: {item.amount.toLocaleString()}
                            </p>
                          ) : null}

                          {item.status === 'WAIVED' && item.waivedReason && (
                            <p className="text-[10px] text-slate-400 mt-1">
                              Override Waiver Reason: {item.waivedReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Clearance Action controls */}
                      <div className="flex items-center gap-1.5 self-end md:self-auto flex-wrap">
                        {hasClearancePerm && item.status !== 'CLEARED' && item.status !== 'WAIVED' && item.status !== 'NOT_REQUIRED' && !isActionActive && (
                          <>
                            <button
                              onClick={() => {
                                handleClearItem(item.id, item.department);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded-md"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                setActiveActionItemId(item.id);
                                setActionType('block');
                              }}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold rounded-md"
                            >
                              Block hold
                            </button>
                            {permissions.includes('clearance.waive') && (
                              <button
                                onClick={() => {
                                  setActiveActionItemId(item.id);
                                  setActionType('waive');
                                }}
                                className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-semibold rounded-md"
                              >
                                Waive hold
                              </button>
                            )}
                          </>
                        )}

                        {/* Interactive override forms inline */}
                        {isActionActive && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 max-w-sm w-full">
                            <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              {actionType === 'block' ? 'Post Outstanding hold' : 'Bypass Waiver Override'}
                            </h6>
                            
                            {actionType === 'block' && (
                              <div>
                                <label className="block text-[9px] text-slate-400">Blocking Amount / Fine (Optional)</label>
                                <input
                                  type="number"
                                  value={blockAmount}
                                  onChange={(e) => setBlockAmount(Number(e.target.value))}
                                  className="w-full text-xs px-2 py-1 rounded bg-white dark:bg-slate-950 border text-slate-950 dark:text-white mt-0.5"
                                  placeholder="0.00"
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-[9px] text-slate-400">
                                {actionType === 'block' ? 'Clearance Block Remarks *' : 'Override Reason *'}
                              </label>
                              <input
                                type="text"
                                value={actionType === 'block' ? blockRemarks : waiveReason}
                                onChange={(e) => actionType === 'block' ? setBlockRemarks(e.target.value) : setWaiveReason(e.target.value)}
                                className="w-full text-xs px-2 py-1 rounded bg-white dark:bg-slate-950 border text-slate-950 dark:text-white mt-0.5"
                                placeholder={actionType === 'block' ? "e.g. Missing library book: Macbeth" : "e.g. Authorized by Principal"}
                              />
                            </div>

                            <div className="flex justify-end gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveActionItemId(null);
                                  setActionType(null);
                                }}
                                className="px-2 py-1 border text-[9px] rounded hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (actionType === 'block') {
                                    handleBlockItem(item.id, item.department);
                                  } else {
                                    handleWaiveItem(item.id, item.department);
                                  }
                                }}
                                className="px-2 py-1 bg-indigo-600 text-white text-[9px] font-bold rounded"
                              >
                                Post Override
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Complete Exit requests logs / History */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Exit History & Logs</h4>
        {requests.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            No active or past exit requests exist for this student.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Exit Type</th>
                  <th className="p-3">Date Initiated</th>
                  <th className="p-3">Proposed End</th>
                  <th className="p-3">Primary Reason</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {requests.map(req => (
                  <tr 
                    key={req.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 cursor-pointer"
                    onClick={() => {
                      if (activeRequest?.id !== req.id) {
                        setActiveRequest(req);
                        // Load items for this selected request if it has one
                        StudentExitService.getClearanceCaseByRequest(req.id, student.tenantId).then(c => {
                          setClearanceCase(c);
                          if (c) {
                            StudentExitService.getClearanceItems(c.id, student.tenantId).then(setClearanceItems);
                          } else {
                            setClearanceItems([]);
                          }
                        });
                      }
                    }}
                  >
                    <td className="p-3 font-bold text-slate-950 dark:text-white flex items-center gap-1">
                      {req.id}
                      {activeRequest?.id === req.id && <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
                    </td>
                    <td className="p-3 font-semibold">{req.exitType}</td>
                    <td className="p-3 text-slate-500">{new Date(req.requestedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-slate-500">{new Date(req.proposedLastDate).toLocaleDateString()}</td>
                    <td className="p-3">{req.reason?.replace(/_/g, ' ') || 'Not Specified'}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Official Certificates & Transfer Documentation (Phase 6.4B) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Official Transfer Certificates & Documents
            </h4>
          </div>
          {activeRequest && (activeRequest.status === 'APPROVED' || activeRequest.status === 'COMPLETED') && canCreateCert && (
            <button
              onClick={() => handleGenerateCertificate(activeRequest.id)}
              disabled={isGeneratingCert}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingCert ? 'Generating TC...' : 'Generate New TC Draft'}
            </button>
          )}
        </div>

        {certificates.length === 0 ? (
          <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold">No official certificates generated yet.</p>
            <p className="text-2xs text-slate-500">
              Certificates are generated once the exit request is approved and clearance requirements are fulfilled.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certificates.map((cert) => (
              <div 
                key={cert.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xs font-mono font-bold text-slate-400">
                      {cert.certificateNumber} (v{cert.certificateVersion || 1})
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {cert.documentType?.replace(/_/g, ' ') || 'Unknown Document'}
                    </h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    cert.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                    cert.status === 'REISSUED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                    cert.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>

                <div className="text-2xs text-slate-500 space-y-0.5">
                  <p>Issue Date: {cert.issueDate || 'Pending Issue'}</p>
                  <p className="font-mono">Verify Token: {cert.verificationCode}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenCertificate(cert)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View / Print Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Document Modal View */}
      {selectedCertForView && selectedCertSnapshot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 bg-slate-900/90 rounded-2xl">
            <CertificateDocumentRenderer
              certificate={selectedCertForView}
              snapshot={selectedCertSnapshot}
              onClose={() => {
                setSelectedCertForView(null);
                setSelectedCertSnapshot(null);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
