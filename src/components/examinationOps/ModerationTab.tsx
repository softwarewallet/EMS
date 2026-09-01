import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Search
} from 'lucide-react';
import { ExamModerationRequest, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface ModerationTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const ModerationTab: React.FC<ModerationTabProps> = ({ tenantId, campusId, currentUser }) => {
  const {
    selectedExamination,
    availableExaminations,
    classes,
    subjects
  } = useExaminationOperations();

  const [requests, setRequests] = useState<ExamModerationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examinationId: '',
    examinationName: '',
    classId: '',
    className: '',
    subjectId: '',
    subjectName: '',
    moderationType: 'SCALING' as const,
    adjustmentValue: 2,
    justificationReason: 'Normalization adjustment approved for syllabus discrepancies.'
  });

  const loadRequests = async () => {
    setLoading(true);
    try {
      const list = await ExaminationOpsService.getModerationRequests(tenantId);
      const filtered = selectedExamination?.id
        ? list.filter(r => r.examinationId === selectedExamination.id)
        : list;
      setRequests(filtered);
    } catch (err) {
      console.error('Error loading moderation requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [tenantId, selectedExamination?.id]);

  const handleOpenModal = () => {
    setActionError(null);
    const exam = selectedExamination || availableExaminations[0];
    const initialClass = classes[0];
    const initialSub = subjects[0];
    setFormData({
      examinationId: exam?.id || '',
      examinationName: exam?.name || '',
      classId: initialClass?.id || '',
      className: initialClass?.name || 'All Classes',
      subjectId: initialSub?.id || '',
      subjectName: initialSub?.name || 'All Subjects',
      moderationType: 'SCALING',
      adjustmentValue: 2,
      justificationReason: 'Normalization adjustment approved for syllabus discrepancies.'
    });
    setShowRequestModal(true);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const targetExam = availableExaminations.find(ex => ex.id === formData.examinationId) || selectedExamination;
    if (!targetExam?.id) {
      setActionError('Please select a valid examination.');
      return;
    }

    try {
      await ExaminationOpsService.requestModeration(
        {
          tenantId,
          campusId,
          examinationId: targetExam.id,
          examinationName: targetExam.name || formData.examinationName,
          subjectId: formData.subjectId,
          subjectName: formData.subjectName,
          classId: formData.classId || 'CLS-ALL',
          className: formData.className || 'All Classes',
          reviewerId: currentUser.id,
          reviewerName: currentUser.displayName || 'Academic Controller',
          reasonCode: formData.moderationType,
          moderationNotes: `${formData.justificationReason} (Adjustment value: +${formData.adjustmentValue} marks)`,
          beforeAfterRecords: []
        },
        currentUser
      );
      setShowRequestModal(false);
      loadRequests();
    } catch (err: any) {
      setActionError(err.message || 'Failed to request moderation');
    }
  };

  const handleReview = async (requestId: string, approved: boolean) => {
    setActionError(null);
    try {
      await ExaminationOpsService.reviewModeration(
        tenantId,
        requestId,
        approved,
        approved ? undefined : 'Moderation adjustment rejected by Academic Committee.',
        currentUser
      );
      loadRequests();
    } catch (err: any) {
      setActionError(err.message || 'Failed to review moderation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Result Moderation & Scale Adjustments</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Submit scaling and grace mark moderation requests, enforced by anti-self-approval security rules.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={!selectedExamination && availableExaminations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Request Subject Moderation
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading moderation register...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Moderation Requests Found</h3>
            <p className="text-xs text-slate-500">Click "Request Subject Moderation" to propose scaling or grace adjustments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Subject & Class</th>
                  <th className="py-3 px-4">Moderation Type</th>
                  <th className="py-3 px-4">Notes & Justification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{req.subjectName}</div>
                      <div className="text-[11px] text-slate-500">{req.className}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-bold">{req.reasonCode}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {req.moderationNotes}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : req.status === 'APPLIED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleReview(req.id, true)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleReview(req.id, false)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-bold hover:bg-rose-100 inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Propose Subject Moderation</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Examination</label>
                <select
                  required
                  value={formData.examinationId}
                  onChange={e => {
                    const ex = availableExaminations.find(x => x.id === e.target.value);
                    setFormData({
                      ...formData,
                      examinationId: e.target.value,
                      examinationName: ex?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableExaminations.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={formData.classId}
                    onChange={e => {
                      const c = classes.find(cl => cl.id === e.target.value);
                      setFormData({
                        ...formData,
                        classId: e.target.value,
                        className: c?.name || 'All Classes'
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Subject</label>
                  <select
                    required
                    value={formData.subjectId}
                    onChange={e => {
                      const s = subjects.find(sub => sub.id === e.target.value);
                      setFormData({
                        ...formData,
                        subjectId: e.target.value,
                        subjectName: s?.name || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moderation Type</label>
                  <select
                    value={formData.moderationType}
                    onChange={e => setFormData({ ...formData, moderationType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="SCALING">SCALING</option>
                    <option value="GRACE_MARKS">GRACE MARKS</option>
                    <option value="QUESTION_CURVE">QUESTION CURVE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adjustment (+ Marks)</label>
                  <input
                    type="number"
                    required
                    value={formData.adjustmentValue}
                    onChange={e => setFormData({ ...formData, adjustmentValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Justification Reason</label>
                <textarea
                  rows={3}
                  required
                  value={formData.justificationReason}
                  onChange={e => setFormData({ ...formData, justificationReason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <strong>Anti-Self-Approval Security Rule:</strong> You cannot approve your own moderation proposal. Another authorized academic officer must sign off on this request.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
