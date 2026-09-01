import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck, 
  TrendingDown, 
  FileCheck,
  Plus,
  X
} from 'lucide-react';
import { AttendanceComplianceResult, AttendanceCondonation } from '../../types';
import { AttendancePolicyService } from '../../services/attendancePolicyService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const AttendanceShortageView: React.FC<Props> = ({ tenantId, user }) => {
  const [complianceResults, setComplianceResults] = useState<AttendanceComplianceResult[]>([]);
  const [condonations, setCondonations] = useState<AttendanceCondonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<AttendanceComplianceResult | null>(null);
  const [isRequestingCondonation, setIsRequestingCondonation] = useState(false);
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Evaluate for demo student
      const result = await AttendancePolicyService.evaluateStudentCompliance(tenantId, 'std_demo_1', 'enr_demo_1', 'ay_2027_28');
      setComplianceResults([result]);
      const condList = await AttendancePolicyService.getCondonations(tenantId);
      setCondonations(condList);
    } catch (err) {
      console.error('Error loading shortage compliance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCondonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      await AttendancePolicyService.saveCondonation({
        tenantId,
        studentId: selectedStudent.studentId,
        studentName: selectedStudent.studentName,
        enrollmentId: selectedStudent.enrollmentId,
        academicYearId: selectedStudent.academicYearId,
        policyId: selectedStudent.policyId,
        attendancePercentage: selectedStudent.effectivePercentage,
        requestedPercentage: selectedStudent.minimumRequiredPercentage,
        reason,
        status: 'SUBMITTED',
        requestedBy: user.id,
        requestedByName: user.displayName || user.email || 'User'
      }, user);

      setSuccessMessage('Attendance condonation waiver request submitted successfully.');
      setIsRequestingCondonation(false);
      setReason('');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit condonation request');
    }
  };

  const handleApproveCondonation = async (id: string) => {
    try {
      await AttendancePolicyService.updateCondonationStatus(id, tenantId, 'APPROVED', user, 'Approved by Administrator');
      setSuccessMessage('Condonation waiver approved. Compliance status overridden successfully.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to approve condonation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Attendance Shortage & Condonation Monitor</h2>
          <p className="text-sm text-slate-500">Monitor minimum attendance thresholds, identify students at risk, and process condonation waivers.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {isRequestingCondonation && selectedStudent ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-medium text-slate-900">Request Attendance Condonation for {selectedStudent.studentName}</h3>
            <button onClick={() => setIsRequestingCondonation(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleRequestCondonation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <div>
                <span className="text-slate-500 block">Actual Percentage</span>
                <span className="text-lg font-bold text-rose-600">{selectedStudent.effectivePercentage}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Required Policy Minimum</span>
                <span className="text-lg font-bold text-slate-900">{selectedStudent.minimumRequiredPercentage}%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condonation Justification & Medical / Special Circumstances</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Explain reasons for attendance shortage..."
              />
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRequestingCondonation(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Submit Condonation Request
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Student Attendance Compliance Register</h3>
              <span className="text-xs text-slate-500 font-medium">Policy Threshold: 75% Min</span>
            </div>
            <div className="divide-y divide-slate-100">
              {complianceResults.length > 0 ? (
                complianceResults.map(res => (
                  <div key={res.studentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{res.studentName}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          res.shortageStatus === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' :
                          res.shortageStatus === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {res.shortageStatus}
                        </span>
                        {res.condoned && (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                            COMPLIANT BY CONDONATION
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Instructional Days: {res.totalInstructionalDays} | Present: {res.presentCount} | Absent: {res.absentCount} | Late: {res.lateCount}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{res.effectivePercentage}%</p>
                        <p className="text-xs text-slate-400">Target: {res.minimumRequiredPercentage}%</p>
                      </div>
                      {!res.isCompliant && !res.condoned && (
                        <button
                          onClick={() => {
                            setSelectedStudent(res);
                            setIsRequestingCondonation(true);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 shadow-sm"
                        >
                          Request Condonation
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">No compliance shortage records.</div>
              )}
            </div>
          </div>

          {/* Condonation Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Condonation Approval Queue</h3>
              <span className="text-xs text-slate-500 font-medium">{condonations.length} Requests</span>
            </div>
            <div className="divide-y divide-slate-100">
              {condonations.length > 0 ? (
                condonations.map(c => (
                  <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{c.studentName}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          c.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Attendance: {c.attendancePercentage}% | Requested By: {c.requestedByName}</p>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">{c.reason}</p>
                    </div>
                    {c.status === 'SUBMITTED' && (
                      <button
                        onClick={() => handleApproveCondonation(c.id)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 shadow-sm"
                      >
                        Approve Waiver
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">No pending condonation requests.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
