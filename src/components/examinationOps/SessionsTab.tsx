import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Search,
  Filter,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ExamSession, ExamSessionStatus, ExamSessionType, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface SessionsTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ tenantId, campusId, currentUser }) => {
  const { selectedExamination, availableExaminations, selectedAcademicYear } = useExaminationOperations();
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    examinationId: '',
    examinationName: '',
    name: '',
    code: '',
    sessionDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    sessionType: 'MORNING' as ExamSessionType,
    instructions: 'All students must arrive 15 minutes before the start time with valid institutional ID cards.'
  });

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await ExaminationOpsService.getSessions(tenantId, campusId);
      // Filter sessions for selected examination if selected
      const filteredForExam = selectedExamination?.id
        ? data.filter(s => s.examinationId === selectedExamination.id)
        : data;
      setSessions(filteredForExam);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [tenantId, campusId, selectedExamination?.id]);

  const handleOpenCreate = () => {
    setActionError(null);
    const exam = selectedExamination || availableExaminations[0];
    const seq = Date.now().toString().slice(-4);
    setFormData({
      examinationId: exam?.id || '',
      examinationName: exam?.name || '',
      name: exam ? `Session - ${exam.name}` : `Exam Session ${seq}`,
      code: `SESS-${seq}`,
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '12:00',
      sessionType: 'MORNING' as ExamSessionType,
      instructions: 'All students must arrive 15 minutes before the start time with valid institutional ID cards.'
    });
    setShowCreateModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const targetExam = availableExaminations.find(ex => ex.id === formData.examinationId) || selectedExamination;
    if (!targetExam?.id) {
      setActionError('Please select a valid Examination before creating a session.');
      return;
    }

    try {
      await ExaminationOpsService.createSession(
        {
          tenantId,
          campusId,
          academicYearId: targetExam.academicYearId || selectedAcademicYear?.id || 'AY-CURRENT',
          examinationId: targetExam.id,
          examinationName: targetExam.name || formData.examinationName,
          name: formData.name,
          code: formData.code,
          sessionDate: formData.sessionDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          sessionType: formData.sessionType,
          instructions: formData.instructions,
          createdBy: currentUser.id
        },
        currentUser
      );
      setShowCreateModal(false);
      loadSessions();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create session');
    }
  };

  const handleStatusChange = async (sessionId: string, newStatus: ExamSessionStatus) => {
    setActionError(null);
    try {
      await ExaminationOpsService.updateSessionStatus(tenantId, sessionId, newStatus, currentUser);
      loadSessions();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update status');
    }
  };

  const filtered = sessions.filter(s => {
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.examinationName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Examination Sessions Management</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Define, schedule, approve, and activate operational examination sessions for hall supervision.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedExamination && availableExaminations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          New Exam Session
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by session title or code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>
      </div>

      {/* Sessions List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading examination sessions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Examination Sessions Found</h3>
            <p className="text-xs text-slate-500">
              {searchTerm || filterStatus !== 'ALL'
                ? 'Try adjusting your search filters or status selection.'
                : 'Click "New Exam Session" to create your first operational exam session.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Session Info</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Examination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>Code: {s.code}</span>
                        <span>•</span>
                        <span>Type: {s.sessionType}</span>
                        <span>•</span>
                        <span>v{s.version}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {s.sessionDate}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {s.startTime} - {s.endTime}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium text-slate-800">{s.examinationName || s.examinationId}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {s.examinationId}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'APPROVED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : s.status === 'SCHEDULED'
                            ? 'bg-sky-100 text-sky-800'
                            : s.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : s.status === 'CLOSED'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {s.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'SCHEDULED')}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[11px] font-bold hover:bg-sky-100"
                        >
                          Schedule
                        </button>
                      )}

                      {s.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-bold hover:bg-indigo-100"
                        >
                          Approve
                        </button>
                      )}

                      {s.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'ACTIVE')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                        >
                          Activate
                        </button>
                      )}

                      {s.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold hover:bg-blue-700"
                        >
                          Mark Completed
                        </button>
                      )}

                      {s.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'CLOSED')}
                          className="px-2.5 py-1 bg-slate-800 text-white rounded text-[11px] font-bold hover:bg-slate-900"
                        >
                          Close Session
                        </button>
                      )}

                      {s.status === 'CLOSED' && (
                        <span className="text-[11px] text-slate-400 font-mono italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Schedule New Examination Session</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Examination</label>
                <select
                  required
                  value={formData.examinationId}
                  onChange={e => {
                    const found = availableExaminations.find(ex => ex.id === e.target.value);
                    setFormData({
                      ...formData,
                      examinationId: e.target.value,
                      examinationName: found?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableExaminations.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.code || ex.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session Type</label>
                  <select
                    value={formData.sessionType}
                    onChange={e => setFormData({ ...formData, sessionType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MORNING">MORNING</option>
                    <option value="AFTERNOON">AFTERNOON</option>
                    <option value="EVENING">EVENING</option>
                    <option value="SPECIAL">SPECIAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.sessionDate}
                    onChange={e => setFormData({ ...formData, sessionDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hall Instructions</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

