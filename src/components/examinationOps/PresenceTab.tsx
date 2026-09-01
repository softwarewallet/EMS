import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
  CheckCircle,
  Save,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { ExamPresenceRecord, ExamPresenceStatus, ExamSession, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface PresenceTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const PresenceTab: React.FC<PresenceTabProps> = ({ tenantId, campusId, currentUser }) => {
  const {
    selectedExamination,
    subjects,
    classes,
    sections,
    students,
    getEnrolledStudents,
    getClassName,
    getSectionName
  } = useExaminationOperations();

  const [presences, setPresences] = useState<ExamPresenceRecord[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [sessionStudents, setSessionStudents] = useState<{
    studentId: string;
    studentName: string;
    rollNumber: string;
    seatNumber: string;
    classId: string;
    sectionId: string;
    enrollmentId?: string;
  }[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

      if (subjects.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(subjects[0].id);
      }

      if (targetSessionId) {
        // Fetch existing recorded presence
        const presList = await ExaminationOpsService.getPresences(tenantId, targetSessionId);
        setPresences(presList);

        // Fetch seating allocations to get real assigned students & seats for this session
        const seatingAllocations = await ExaminationOpsService.getSeatingAllocations(tenantId, targetSessionId);
        if (seatingAllocations.length > 0) {
          const seatedStudents: typeof sessionStudents = [];
          seatingAllocations.forEach(alloc => {
            alloc.studentSeating.forEach(st => {
              seatedStudents.push({
                studentId: st.studentId,
                studentName: st.studentName,
                rollNumber: st.rollNumber,
                seatNumber: st.seatNumber,
                classId: classes[0]?.id || 'cls_gen',
                sectionId: sections[0]?.id || 'sec_gen'
              });
            });
          });
          setSessionStudents(seatedStudents);
        } else {
          // Fallback to enrolled students from context
          const enrolled = getEnrolledStudents();
          if (enrolled.length > 0) {
            setSessionStudents(
              enrolled.map((item, idx) => ({
                studentId: item.student.id,
                studentName: `${item.student.firstName} ${item.student.lastName}`.trim(),
                rollNumber: item.enrollment?.rollNumber || item.student.admissionNumber || item.student.rollNumber || `R-${100 + idx + 1}`,
                seatNumber: `S-${idx + 1}`,
                classId: item.enrollment?.classId || item.student.currentClassId || '',
                sectionId: item.enrollment?.sectionId || item.student.currentSectionId || '',
                enrollmentId: item.enrollment?.id
              }))
            );
          } else if (students.length > 0) {
            setSessionStudents(
              students.map((st, idx) => ({
                studentId: st.id,
                studentName: `${st.firstName} ${st.lastName}`.trim(),
                rollNumber: st.admissionNumber || st.rollNumber || `R-${100 + idx + 1}`,
                seatNumber: `S-${idx + 1}`,
                classId: st.currentClassId || '',
                sectionId: st.currentSectionId || ''
              }))
            );
          } else {
            setSessionStudents([]);
          }
        }
      } else {
        setPresences([]);
        setSessionStudents([]);
      }
    } catch (err) {
      console.error('Error loading presences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedSessionId, selectedExamination?.id]);

  const handlePresenceChange = (studentId: string, newStatus: ExamPresenceStatus) => {
    setPresences(prev => {
      const existingIdx = prev.findIndex(p => p.studentId === studentId);
      const sub = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
      const stud = sessionStudents.find(s => s.studentId === studentId);

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], status: newStatus };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `p_temp_${studentId}`,
            tenantId,
            campusId,
            sessionId: selectedSessionId,
            studentId,
            studentName: stud?.studentName || studentId,
            rollNumber: stud?.rollNumber,
            seatNumber: stud?.seatNumber,
            subjectId: sub?.id || 'SUB-GEN',
            subjectName: sub?.name || 'General Subject',
            status: newStatus,
            recordedBy: currentUser.id,
            recordedByName: currentUser.displayName,
            recordedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const handleSaveAll = async () => {
    if (!selectedSessionId) return;
    if (sessionStudents.length === 0) {
      setActionError('No students available in this session to record presence.');
      return;
    }

    setSaving(true);
    setActionError(null);
    setSaveSuccess(false);

    try {
      const selectedSession = sessions.find(s => s.id === selectedSessionId);
      const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

      const recordsToSave = sessionStudents.map(stud => {
        const existing = presences.find(p => p.studentId === stud.studentId);
        return {
          tenantId,
          campusId,
          examinationId: selectedSession?.examinationId || selectedExamination?.id || 'EXAM-ACTIVE',
          examinationName: selectedSession?.examinationName || selectedExamination?.name || 'Examination',
          sessionId: selectedSessionId,
          sessionName: selectedSession?.name || 'Examination Session',
          studentId: stud.studentId,
          studentName: stud.studentName,
          rollNumber: stud.rollNumber,
          seatNumber: stud.seatNumber,
          subjectId: activeSubject?.id || 'SUB-GEN',
          subjectName: activeSubject?.name || 'General Subject',
          classId: stud.classId || 'CLS-GEN',
          className: getClassName(stud.classId),
          sectionId: stud.sectionId || 'SEC-GEN',
          sectionName: getSectionName(stud.sectionId),
          enrollmentId: stud.enrollmentId || `enr_${stud.studentId}`,
          status: existing ? existing.status : ('PRESENT' as ExamPresenceStatus)
        };
      });

      await ExaminationOpsService.batchRecordPresence(
        tenantId,
        selectedSessionId,
        activeSubject?.id || 'SUB-GEN',
        recordsToSave,
        currentUser
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to save presence records');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Examination Hall Presence Register</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time hall check-in, absentee verification, late arrivals, and malpractice suspension tracking.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving || !selectedSessionId || sessionStudents.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Presence...' : 'Save Presence Roster'}
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Presence roster saved successfully!</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Active Session:</span>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          >
            {sessions.length === 0 && <option value="">No Sessions Available</option>}
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.sessionDate} • {s.startTime})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Subject:</span>
          <select
            value={selectedSubjectId}
            onChange={e => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
          >
            {subjects.length === 0 && <option value="">Default Subject</option>}
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code || s.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Roster Presence Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading presence register...</div>
        ) : sessionStudents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <UserX className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Students Found for Session</h3>
            <p className="text-xs text-slate-500">
              Ensure you have registered students, created examination sessions, and allocated seating.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Seat #</th>
                  <th className="py-3 px-4">Student & Roll No.</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Presence Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {sessionStudents.map(stud => {
                  const pres = presences.find(p => p.studentId === stud.studentId);
                  const status = pres ? pres.status : 'PRESENT';

                  return (
                    <tr key={stud.studentId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-extrabold text-indigo-600 font-mono">{stud.seatNumber}</td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{stud.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Roll: {stud.rollNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {getClassName(stud.classId)} {stud.sectionId && `• ${getSectionName(stud.sectionId)}`}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePresenceChange(stud.studentId, 'PRESENT')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            PRESENT
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePresenceChange(stud.studentId, 'ABSENT')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ABSENT
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePresenceChange(stud.studentId, 'LATE')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              status === 'LATE'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            LATE
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePresenceChange(stud.studentId, 'MALPRACTICE_SUSPENDED')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                              status === 'MALPRACTICE_SUSPENDED'
                                ? 'bg-purple-700 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            SUSPENDED
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
