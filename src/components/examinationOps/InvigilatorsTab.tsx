import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  AlertCircle,
  RefreshCw,
  MapPin,
  Calendar,
  UserX,
  Search,
  ShieldCheck
} from 'lucide-react';
import { ExamInvigilatorAssignment, ExamSession, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface InvigilatorsTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const InvigilatorsTab: React.FC<InvigilatorsTabProps> = ({ tenantId, campusId, currentUser }) => {
  const { selectedExamination, teachers } = useExaminationOperations();
  const [assignments, setAssignments] = useState<ExamInvigilatorAssignment[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSubstituteModal, setShowSubstituteModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<ExamInvigilatorAssignment | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sessionId: '',
    sessionName: '',
    roomId: 'room_101',
    roomName: 'Main Exam Hall 101',
    staffId: '',
    staffName: '',
    isPrimary: true
  });

  const [substituteForm, setSubstituteForm] = useState({
    substituteStaffId: '',
    substituteStaffName: '',
    reason: 'Emergency faculty reassignment'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sessList = await ExaminationOpsService.getSessions(tenantId, campusId);
      const filteredSessions = selectedExamination?.id
        ? sessList.filter(s => s.examinationId === selectedExamination.id)
        : sessList;
      setSessions(filteredSessions);

      const targetSessionId = selectedSessionId || (filteredSessions[0]?.id || '');
      if (filteredSessions.length > 0 && !selectedSessionId) {
        setSelectedSessionId(targetSessionId);
      }

      if (targetSessionId) {
        const invList = await ExaminationOpsService.getInvigilatorAssignments(tenantId, targetSessionId);
        setAssignments(invList);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error('Error loading invigilators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedSessionId, selectedExamination?.id]);

  const handleOpenAssign = () => {
    setActionError(null);
    const targetSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];
    const initialTeacher = teachers[0];
    setFormData({
      sessionId: targetSession?.id || '',
      sessionName: targetSession?.name || '',
      roomId: 'room_101',
      roomName: 'Main Exam Hall 101',
      staffId: initialTeacher?.id || '',
      staffName: initialTeacher ? initialTeacher.name : '',
      isPrimary: true
    });
    setShowAssignModal(true);
  };

  const handleOpenSubstitute = (assignment: ExamInvigilatorAssignment) => {
    setActionError(null);
    setSelectedAssignment(assignment);
    const candidateSub = teachers.find(t => t.id !== assignment.staffId) || teachers[0];
    setSubstituteForm({
      substituteStaffId: candidateSub?.id || '',
      substituteStaffName: candidateSub ? candidateSub.name : '',
      reason: 'Emergency faculty reassignment'
    });
    setShowSubstituteModal(true);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const selectedSession = sessions.find(s => s.id === formData.sessionId);
    if (!selectedSession?.id) {
      setActionError('Please select a valid examination session.');
      return;
    }

    try {
      await ExaminationOpsService.assignInvigilator(
        {
          tenantId,
          campusId,
          examinationId: selectedSession.examinationId || selectedExamination?.id || 'EXAM-ACTIVE',
          examinationName: selectedSession.examinationName || selectedExamination?.name || 'Examination',
          sessionId: selectedSession.id,
          sessionName: selectedSession.name,
          sessionDate: selectedSession.sessionDate || new Date().toISOString().split('T')[0],
          startTime: selectedSession.startTime || '09:00',
          endTime: selectedSession.endTime || '12:00',
          roomId: formData.roomId,
          roomName: formData.roomName,
          staffId: formData.staffId || `staff_${Date.now().toString().slice(-4)}`,
          staffName: formData.staffName,
          role: formData.isPrimary ? 'PRIMARY' : 'ASSISTANT'
        },
        currentUser
      );
      setShowAssignModal(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to assign invigilator');
    }
  };

  const handleSubstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setActionError(null);
    try {
      await ExaminationOpsService.substituteInvigilator(
        tenantId,
        selectedAssignment.id,
        substituteForm.substituteStaffId || `sub_${Date.now().toString().slice(-4)}`,
        substituteForm.substituteStaffName,
        substituteForm.reason,
        currentUser
      );
      setShowSubstituteModal(false);
      setSelectedAssignment(null);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to substitute invigilator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Invigilation & Duty Roster Management</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Faculty room assignments, primary & assistant invigilators, shift substitution tracking, and conflict detection.
          </p>
        </div>

        <button
          onClick={handleOpenAssign}
          disabled={sessions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Assign Invigilator Duty
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
        <Calendar className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-bold text-slate-700">Filter Session:</span>
        <select
          value={selectedSessionId}
          onChange={e => setSelectedSessionId(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-md"
        >
          {sessions.length === 0 && <option value="">No Examination Sessions Available</option>}
          {sessions.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.sessionDate} • {s.startTime} - {s.endTime})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading duty roster...</div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Invigilator Duties Assigned</h3>
            <p className="text-xs text-slate-500">
              {sessions.length === 0
                ? 'Create an Examination Session first to assign invigilator duties.'
                : 'Click "Assign Invigilator Duty" to appoint chief and assistant hall proctors.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Room & Role</th>
                  <th className="py-3 px-4">Duty Status</th>
                  <th className="py-3 px-4">Substitution Log</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{a.staffName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {a.staffId}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{a.roomName}</span>
                      </div>
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.role === 'PRIMARY'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {a.role === 'PRIMARY' ? 'CHIEF INVIGILATOR' : 'ASSISTANT INVIGILATOR'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          a.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'SUBSTITUTED'
                            ? 'bg-amber-100 text-amber-800'
                            : a.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {a.status === 'SUBSTITUTED' && a.substituteStaffName ? (
                        <div className="text-[11px]">
                          <span className="font-semibold text-amber-900">Substituted by:</span>{' '}
                          <span className="text-slate-800 font-bold">{a.substituteStaffName}</span>
                          {a.substitutionReason && (
                            <div className="text-[10px] text-slate-500 italic mt-0.5">"{a.substitutionReason}"</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {a.status !== 'SUBSTITUTED' && (
                        <button
                          onClick={() => handleOpenSubstitute(a)}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-bold hover:bg-amber-100 inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Substitute
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Assign Invigilator Duty</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Target</label>
                <select
                  required
                  value={formData.sessionId}
                  onChange={e => {
                    const sess = sessions.find(s => s.id === e.target.value);
                    setFormData({
                      ...formData,
                      sessionId: e.target.value,
                      sessionName: sess?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.sessionDate} • {s.startTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty / Staff Member</label>
                {teachers.length > 0 ? (
                  <select
                    value={formData.staffId}
                    onChange={e => {
                      const t = teachers.find(tch => tch.id === e.target.value);
                      setFormData({
                        ...formData,
                        staffId: e.target.value,
                        staffName: t ? t.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.employeeId || t.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Enter faculty name"
                    value={formData.staffName}
                    onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Exam Room / Hall</label>
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={e => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={e => setFormData({ ...formData, isPrimary: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isPrimary" className="font-bold text-slate-700">
                  Assign as Chief / Primary Invigilator
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Save Duty Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Substitute Modal */}
      {showSubstituteModal && selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Substitute Invigilator Duty</h3>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500">Replacing:</span>{' '}
              <strong className="text-slate-900">{selectedAssignment.staffName}</strong> in{' '}
              <strong className="text-slate-900">{selectedAssignment.roomName}</strong>
            </div>

            <form onSubmit={handleSubstitute} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Substitute Faculty Member</label>
                {teachers.length > 0 ? (
                  <select
                    value={substituteForm.substituteStaffId}
                    onChange={e => {
                      const t = teachers.find(tch => tch.id === e.target.value);
                      setSubstituteForm({
                        ...substituteForm,
                        substituteStaffId: e.target.value,
                        substituteStaffName: t ? t.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.employeeId || t.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={substituteForm.substituteStaffName}
                    onChange={e => setSubstituteForm({ ...substituteForm, substituteStaffName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Substitution Reason</label>
                <textarea
                  rows={3}
                  required
                  value={substituteForm.reason}
                  onChange={e => setSubstituteForm({ ...substituteForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubstituteModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                >
                  Confirm Substitution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
