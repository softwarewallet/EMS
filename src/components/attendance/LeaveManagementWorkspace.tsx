import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { LeaveRequest, LeaveType, LeaveStatus, RequesterType } from '../../types';
import { AttendancePolicyService } from '../../services/attendancePolicyService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const LeaveManagementWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('std_demo_1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('MEDICAL');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadLeaves();
  }, [tenantId]);

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const list = await AttendancePolicyService.getLeaveRequests(tenantId);
      setLeaves(list);
    } catch (err) {
      console.error('Error loading leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await AttendancePolicyService.saveLeaveRequest({
        tenantId,
        studentId,
        studentName: studentName || 'Demo Student',
        enrollmentId: 'enr_demo_1',
        campusId: 'campus_main',
        academicYearId: 'ay_2027_28',
        classId: 'class_viii',
        sectionId: 'sec_a',
        startDate,
        endDate,
        numberOfDays: numberOfDays > 0 ? numberOfDays : 1,
        leaveType,
        reason,
        requestedBy: user.id,
        requesterName: user.displayName || user.email || 'User',
        requesterType: (user.role === 'parent' ? 'PARENT_GUARDIAN' : user.role === 'student' ? 'STUDENT' : 'TEACHER') as RequesterType,
        status: 'SUBMITTED'
      }, user);

      setSuccessMessage('Leave request submitted successfully for approval.');
      setIsCreating(false);
      setReason('');
      loadLeaves();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit leave');
    }
  };

  const handleUpdateStatus = async (leaveRequestId: string, status: LeaveStatus) => {
    try {
      await AttendancePolicyService.updateLeaveStatus(leaveRequestId, tenantId, status, user);
      setSuccessMessage(`Leave request successfully ${status.toLowerCase()}.`);
      loadLeaves();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update leave status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Leave & Approval Engine</h2>
          <p className="text-sm text-slate-500">Manage student leave requests, medical certificates, and multi-level approvals.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {isCreating ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-medium text-slate-900">New Leave Request</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmitLeave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Alex Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="MEDICAL">Medical Leave</option>
                  <option value="PERSONAL">Personal Leave</option>
                  <option value="FAMILY">Family Function / Event</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="AUTHORIZED">Authorized Institution Event</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason & Remarks</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Provide detailed justification for leave..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Submit Leave Request
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Leave Requests Queue</h3>
            <span className="text-xs text-slate-500 font-medium">{leaves.length} Total Requests</span>
          </div>
          <div className="divide-y divide-slate-100">
            {leaves.length > 0 ? (
              leaves.map(req => (
                <div key={req.leaveRequestId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{req.studentName}</span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                        {req.leaveType}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        req.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.startDate} to {req.endDate} ({req.numberOfDays} days)</span>
                      <span>• Requested by {req.requesterName} ({req.requesterType})</span>
                    </p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">{req.reason}</p>
                  </div>

                  {req.status === 'SUBMITTED' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(req.leaveRequestId, 'APPROVED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.leaveRequestId, 'REJECTED')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-medium hover:bg-rose-700 shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">No leave requests found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
