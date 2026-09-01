import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Plus,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
  Filter,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { ExamIncident, ExamIncidentSeverity, ExamIncidentType, ExamSession, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface IncidentsTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const IncidentsTab: React.FC<IncidentsTabProps> = ({ tenantId, campusId, currentUser }) => {
  const { selectedExamination, students, getEnrolledStudents } = useExaminationOperations();
  const [incidents, setIncidents] = useState<ExamIncident[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<ExamIncident | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [reportForm, setReportForm] = useState({
    sessionId: '',
    sessionName: '',
    studentId: '',
    studentName: '',
    incidentType: 'UNAUTHORIZED_MATERIAL' as ExamIncidentType,
    severity: 'HIGH' as ExamIncidentSeverity,
    description: '',
    evidenceDocumentIds: [] as string[]
  });

  const [resolveForm, setResolveForm] = useState({
    resolutionNotes: 'Evidence evaluated by Examination Operations Committee.',
    actionTaken: 'PAPER_CONFISCATED_WARNING_ISSUED'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const sessList = await ExaminationOpsService.getSessions(tenantId, campusId);
      const filteredSessions = selectedExamination?.id
        ? sessList.filter(s => s.examinationId === selectedExamination.id)
        : sessList;
      setSessions(filteredSessions);

      const list = await ExaminationOpsService.getIncidents(tenantId);
      const filteredIncidents = selectedExamination?.id
        ? list.filter(inc => inc.examinationId === selectedExamination.id)
        : list;
      setIncidents(filteredIncidents);
    } catch (err) {
      console.error('Error loading incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedExamination?.id]);

  const handleOpenReport = () => {
    setActionError(null);
    const initialSession = sessions[0];
    const initialStudent = students[0];
    setReportForm({
      sessionId: initialSession?.id || '',
      sessionName: initialSession?.name || '',
      studentId: initialStudent?.id || '',
      studentName: initialStudent ? `${initialStudent.firstName} ${initialStudent.lastName}`.trim() : '',
      incidentType: 'UNAUTHORIZED_MATERIAL',
      severity: 'HIGH',
      description: '',
      evidenceDocumentIds: []
    });
    setShowReportModal(true);
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const targetSession = sessions.find(s => s.id === reportForm.sessionId);
    if (!targetSession?.id) {
      setActionError('Please select a valid examination session.');
      return;
    }

    try {
      await ExaminationOpsService.reportIncident(
        {
          tenantId,
          campusId,
          examinationId: targetSession.examinationId || selectedExamination?.id || 'EXAM-ACTIVE',
          examinationName: targetSession.examinationName || selectedExamination?.name || 'Examination',
          sessionId: targetSession.id,
          sessionName: targetSession.name,
          studentId: reportForm.studentId,
          studentName: reportForm.studentName,
          invigilatorId: currentUser.id,
          invigilatorName: currentUser.displayName || 'Staff',
          createdBy: currentUser.id,
          incidentType: reportForm.incidentType,
          severity: reportForm.severity,
          description: reportForm.description,
          evidenceDocumentIds: reportForm.evidenceDocumentIds
        },
        currentUser
      );
      setShowReportModal(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to report incident');
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident) return;
    setActionError(null);
    try {
      await ExaminationOpsService.resolveIncident(
        tenantId,
        selectedIncident.id,
        resolveForm.resolutionNotes,
        resolveForm.actionTaken,
        currentUser
      );
      setShowResolveModal(false);
      setSelectedIncident(null);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to resolve incident');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Malpractice & Incident Management</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Log examination violations, track evidence Document Registry links, and execute committee resolutions.
          </p>
        </div>

        <button
          onClick={handleOpenReport}
          disabled={sessions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-semibold text-sm rounded-lg hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <ShieldAlert className="w-4 h-4" />
          Report Malpractice Incident
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Incidents List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading incident reports...</div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Incidents Reported</h3>
            <p className="text-xs text-slate-500">
              All examination halls are operating normally with zero recorded malpractice infractions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Student & Session</th>
                  <th className="py-3 px-4">Violation Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status & Resolution</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {incidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{inc.studentName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">ID: {inc.studentId}</span>
                        <span>•</span>
                        <span>{inc.sessionName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-bold">{inc.incidentType?.replace(/_/g, ' ') || 'Unknown'}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{inc.description}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : inc.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : inc.severity === 'MEDIUM'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inc.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inc.status === 'DISMISSED'
                              ? 'bg-slate-100 text-slate-600'
                              : inc.status === 'INVESTIGATING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </div>
                      {inc.resolutionNotes && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
                          "{inc.resolutionNotes}"
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED' && (
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                            setShowResolveModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold hover:bg-emerald-100"
                        >
                          Resolve Case
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Report Malpractice Incident
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Session Target</label>
                <select
                  required
                  value={reportForm.sessionId}
                  onChange={e => {
                    const sess = sessions.find(s => s.id === e.target.value);
                    setReportForm({
                      ...reportForm,
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Violation Type</label>
                  <select
                    value={reportForm.incidentType}
                    onChange={e => setReportForm({ ...reportForm, incidentType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="UNAUTHORIZED_MATERIAL">UNAUTHORIZED MATERIAL</option>
                    <option value="IMPERSONATION">IMPERSONATION</option>
                    <option value="COMMUNICATION_VIOLATION">COMMUNICATION VIOLATION</option>
                    <option value="PAPER_TAMPERING">PAPER TAMPERING</option>
                    <option value="HALL_DISRUPTION">HALL DISRUPTION</option>
                    <option value="MEDICAL_EMERGENCY">MEDICAL EMERGENCY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={reportForm.severity}
                    onChange={e => setReportForm({ ...reportForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Involved</label>
                {students.length > 0 ? (
                  <select
                    value={reportForm.studentId}
                    onChange={e => {
                      const st = students.find(s => s.id === e.target.value);
                      setReportForm({
                        ...reportForm,
                        studentId: e.target.value,
                        studentName: st ? `${st.firstName} ${st.lastName}`.trim() : ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.firstName} {st.lastName} (Roll: {st.admissionNumber || st.rollNumber || st.id})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Student Name"
                      value={reportForm.studentName}
                      onChange={e => setReportForm({ ...reportForm, studentName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Student ID / Roll"
                      value={reportForm.studentId}
                      onChange={e => setReportForm({ ...reportForm, studentId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide precise details of the observed violation..."
                  value={reportForm.description}
                  onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px]">
                <strong>Presence Rule:</strong> High and Critical severity incidents automatically trigger a malpractice suspension update on the active hall presence register.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedIncident && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Resolve Malpractice Incident</h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResolve} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Action Taken</label>
                <input
                  type="text"
                  required
                  value={resolveForm.actionTaken}
                  onChange={e => setResolveForm({ ...resolveForm, actionTaken: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Committee Resolution Notes</label>
                <textarea
                  rows={3}
                  required
                  value={resolveForm.resolutionNotes}
                  onChange={e => setResolveForm({ ...resolveForm, resolutionNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
