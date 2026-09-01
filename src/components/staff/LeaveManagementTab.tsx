import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import {
  StaffLeaveRequest,
  StaffLeaveBalance,
  LeaveRequestStatus
} from '../../types';
import {
  CalendarCheck,
  Plus,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export const LeaveManagementTab: React.FC = () => {
  const { tenantId, staffList, leaveTypes, currentUser, refreshAll } = useStaffContext();
  const { notify } = useNotification();

  const [leaveRequests, setLeaveRequests] = useState<StaffLeaveRequest[]>([]);
  const [selectedStaffBalances, setSelectedStaffBalances] = useState<StaffLeaveBalance[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Leave Modal
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applyStaffId, setApplyStaffId] = useState<string>(staffList[0]?.id || '');
  const [applyLeaveTypeId, setApplyLeaveTypeId] = useState<string>(leaveTypes[0]?.id || '');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<string>('');
  const [isHalfDay, setIsHalfDay] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Review Modal State
  const [reviewRequest, setReviewRequest] = useState<StaffLeaveRequest | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewRemarks, setReviewRemarks] = useState<string>('');

  const loadLeaveData = async () => {
    setLoading(true);
    try {
      const [reqData, balData] = await Promise.all([
        StaffService.getLeaveRequests(tenantId),
        selectedStaffId ? StaffService.getLeaveBalances(tenantId, selectedStaffId) : Promise.resolve([])
      ]);
      setLeaveRequests(reqData);
      setSelectedStaffBalances(balData);
    } catch (err: any) {
      console.error('Failed to load leave records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveData();
  }, [tenantId, selectedStaffId]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyStaffId || !applyLeaveTypeId || !startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const applicant = staffList.find((s) => s.id === applyStaffId);
      const lType = leaveTypes.find((l) => l.id === applyLeaveTypeId) || leaveTypes[0];
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
      const totalDays = isHalfDay ? 0.5 : diffDays;

      await StaffService.submitLeaveRequest(
        tenantId,
        {
          tenantId,
          campusId: applicant?.campusId || 'campus_main',
          staffId: applyStaffId,
          staffName: applicant?.fullName || 'Faculty Member',
          department: applicant?.department || 'Academics',
          leaveTypeId: lType?.id || 'lt_casual',
          leaveTypeName: lType?.name || 'Casual Leave',
          startDate,
          endDate,
          totalDays,
          reason: reason.trim() || 'Personal leave request'
        },
        currentUser
      );

      notify('success', 'Leave Submitted', 'Leave application submitted for managerial sign-off.');

      setShowApplyModal(false);
      setReason('');
      await loadLeaveData();
      await refreshAll();
    } catch (err: any) {
      notify('error', 'Submission Failed', err.message || 'Could not submit leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewDecision = async () => {
    if (!reviewRequest) return;

    try {
      await StaffService.reviewLeaveRequest(
        tenantId,
        reviewRequest.id,
        reviewDecision,
        reviewRemarks.trim() || '',
        currentUser
      );

      notify('success', `Leave ${reviewDecision === 'APPROVED' ? 'Approved' : 'Rejected'}`, 'Leave request decided successfully with balance ledger updated.');

      setReviewRequest(null);
      setReviewRemarks('');
      await loadLeaveData();
      await refreshAll();
    } catch (err: any) {
      notify('error', 'Decision Blocked', err.message || 'Failed to authorize leave request.');
    }
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: LeaveRequestStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            Leave Ledger, Requests & Entitlements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee absence applications with anti-self-approval enforcement, live balance deductions, and coverage scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Submit Leave Application
          </button>
        </div>
      </div>

      {/* 2-Column Split: Leave Requests & Balance Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leave Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Leave Applications Register</h4>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">No Leave Requests Found</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                No leave requests match your filter selection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const staff = staffList.find((s) => s.id === req.staffId);
                const isApplicantSelf = currentUser.id === req.staffId || currentUser.email === staff?.email;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 text-sm">{req.staffName || staff?.fullName || 'Faculty Member'}</span>
                        <span className="text-xs font-mono text-slate-500">({req.department || staff?.department})</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="font-semibold text-blue-700">{req.leaveTypeName}</span>
                        <span>•</span>
                        <span>{req.startDate} to {req.endDate} ({req.totalDays} day{req.totalDays > 1 ? 's' : ''})</span>
                      </div>

                      <p className="text-xs text-slate-500 italic mt-1">&quot;{req.reason}&quot;</p>

                      {req.reviewedByName && (
                        <span className="text-[11px] text-slate-400 block pt-1">
                          Decided by {req.reviewedByName} on {req.actionTimestamp?.split('T')[0]} {req.reviewNotes ? `• "${req.reviewNotes}"` : ''}
                        </span>
                      )}
                    </div>

                    {/* Decision Controls */}
                    {(req.status === 'SUBMITTED' || req.status === 'UNDER_REVIEW') && (
                      <div className="flex items-center gap-2 shrink-0">
                        {isApplicantSelf ? (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Self-approval blocked
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewRequest(req);
                              setReviewDecision('APPROVED');
                            }}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            Review & Decide
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Balance Ledger for Selected Staff */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Annual Quota Balances
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Employee</label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              {selectedStaffBalances.map((bal) => (
                <div key={bal.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{bal.leaveTypeName}</span>
                    <span className="font-bold text-sm text-blue-700">{bal.remainingDays} days left</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round(((bal.totalAllocated - bal.remainingDays) / (bal.totalAllocated || 1)) * 100))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{bal.usedDays} used</span>
                    <span>{bal.totalAllocated + bal.carryForwardDays} allocated</span>
                  </div>
                </div>
              ))}

              {selectedStaffBalances.length === 0 && (
                <p className="text-center py-6 text-slate-400 text-xs italic">
                  No balance quotas initialized for this employee.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              Submit Leave Application
            </h3>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Employee / Applicant</label>
                <select
                  required
                  value={applyStaffId}
                  onChange={(e) => setApplyStaffId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  required
                  value={applyLeaveTypeId}
                  onChange={(e) => setApplyLeaveTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} ({lt.code}) - Max {lt.annualQuota} days/yr
                    </option>
                  ))}
                  {leaveTypes.length === 0 && (
                    <>
                      <option value="lt_casual">Casual Leave (CL)</option>
                      <option value="lt_sick">Medical / Sick Leave (SL)</option>
                      <option value="lt_earned">Earned Annual Leave (EL)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="halfDayCheck"
                  checked={isHalfDay}
                  onChange={(e) => setIsHalfDay(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="halfDayCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Half-day leave (0.5 day quota)
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason / Purpose</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Attending academic conference / Family obligation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Decide Modal */}
      {reviewRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Authorize Leave Application</h3>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Leave Type:</span>
                <span className="font-bold text-slate-800">{reviewRequest.leaveTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-slate-800">{reviewRequest.startDate} to {reviewRequest.endDate} ({reviewRequest.totalDays} day)</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block">Reason:</span>
                <span className="text-slate-800 italic">{reviewRequest.reason}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('APPROVED')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      reviewDecision === 'APPROVED'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Approve Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('REJECTED')}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      reviewDecision === 'REJECTED'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Reject Application
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Administrative Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Approved. Cover teacher assigned."
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewRequest(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewDecision}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs cursor-pointer"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
