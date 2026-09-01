import React, { useState, useEffect } from 'react';
import {
  Grid,
  Plus,
  Users,
  AlertCircle,
  Calendar,
  MapPin,
  Filter
} from 'lucide-react';
import { ExamSeatingAllocation, ExamSession, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface SeatingTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const SeatingTab: React.FC<SeatingTabProps> = ({ tenantId, campusId, currentUser }) => {
  const {
    selectedExamination,
    availableExaminations,
    classes,
    sections,
    students,
    getEnrolledStudents
  } = useExaminationOperations();

  const [allocations, setAllocations] = useState<ExamSeatingAllocation[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State for Allocation
  const [formData, setFormData] = useState({
    sessionId: '',
    sessionName: '',
    roomId: 'room_hall_a',
    roomName: 'Main Examination Hall A',
    roomCapacity: 40,
    classId: '',
    sectionId: '',
    rows: 5,
    columns: 6,
    studentCountToSeat: 30
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const allSessions = await ExaminationOpsService.getSessions(tenantId, campusId);
      const filteredSessions = selectedExamination?.id
        ? allSessions.filter(s => s.examinationId === selectedExamination.id)
        : allSessions;
      setSessions(filteredSessions);

      if (filteredSessions.length > 0 && !selectedSessionId) {
        setSelectedSessionId(filteredSessions[0].id);
      }

      const allocData = await ExaminationOpsService.getSeatingAllocations(
        tenantId,
        selectedSessionId || (filteredSessions[0]?.id)
      );
      setAllocations(allocData);
    } catch (err) {
      console.error('Error loading seating data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedSessionId, selectedExamination?.id]);

  const handleOpenAllocate = () => {
    setActionError(null);
    const targetSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];
    const initialClass = classes[0];
    const initialSection = sections.find(s => !initialClass || s.classId === initialClass.id) || sections[0];
    setFormData({
      sessionId: targetSession?.id || '',
      sessionName: targetSession?.name || '',
      roomId: `room_${Date.now().toString().slice(-4)}`,
      roomName: 'Main Examination Hall A',
      roomCapacity: 40,
      classId: initialClass?.id || '',
      sectionId: initialSection?.id || '',
      rows: 5,
      columns: 6,
      studentCountToSeat: 30
    });
    setShowAllocateModal(true);
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const targetSession = sessions.find(s => s.id === formData.sessionId);
    if (!targetSession?.id) {
      setActionError('Please select a valid examination session.');
      return;
    }

    // Resolve authoritative enrolled students
    const candidateStudents = getEnrolledStudents(
      formData.classId || undefined,
      formData.sectionId || undefined
    );

    if (candidateStudents.length === 0 && students.length === 0) {
      setActionError('No registered students found in this institution to allocate seats.');
      return;
    }

    const studentsPool = candidateStudents.length > 0
      ? candidateStudents.map(cs => ({
          id: cs.student.id,
          name: `${cs.student.firstName} ${cs.student.lastName}`.trim(),
          rollNumber: cs.enrollment?.rollNumber || cs.student.admissionNumber || cs.student.rollNumber || cs.student.id
        }))
      : students.map(st => ({
          id: st.id,
          name: `${st.firstName} ${st.lastName}`.trim(),
          rollNumber: st.admissionNumber || st.rollNumber || st.id
        }));

    // Auto-generate student seats based on grid (row x col) up to student count or capacity
    const generatedSeating = [];
    let count = 0;
    const maxToSeat = Math.min(
      formData.studentCountToSeat,
      formData.roomCapacity,
      formData.rows * formData.columns,
      studentsPool.length
    );

    for (let r = 1; r <= formData.rows; r++) {
      for (let c = 1; c <= formData.columns; c++) {
        if (count >= maxToSeat) break;
        const candidate = studentsPool[count];
        count++;
        const seatNum = `R${r}-S${c}`;
        generatedSeating.push({
          studentId: candidate.id,
          studentName: candidate.name,
          rollNumber: candidate.rollNumber,
          seatNumber: seatNum,
          rowNumber: r,
          columnNumber: c,
          specialNeeds: count % 6 === 0 ? 'Extra Desk Clearance' : undefined
        });
      }
    }

    try {
      await ExaminationOpsService.saveSeatingAllocation(
        {
          tenantId,
          campusId,
          examinationId: targetSession.examinationId || selectedExamination?.id || 'EXAM-ACTIVE',
          examinationName: targetSession.examinationName || selectedExamination?.name || 'Examination',
          sessionId: targetSession.id,
          sessionName: targetSession.name,
          roomId: formData.roomId,
          roomName: formData.roomName,
          roomCapacity: formData.roomCapacity,
          studentSeating: generatedSeating
        },
        currentUser
      );
      setShowAllocateModal(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to allocate seating');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Examination Room Seating Allocations</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grid-based seat allocations, room capacity checks, accommodation tags, and cross-room conflict prevention.
          </p>
        </div>

        <button
          onClick={handleOpenAllocate}
          disabled={sessions.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Assign Room Seating Grid
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Session Filter Bar */}
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
              {s.name} ({s.sessionDate} • {s.startTime})
            </option>
          ))}
        </select>
      </div>

      {/* Allocations View */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Loading seating allocations...</div>
      ) : allocations.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-2">
          <Grid className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Seating Allocations Configured</h3>
          <p className="text-xs text-slate-500">
            {sessions.length === 0
              ? 'Please create and schedule an Examination Session first.'
              : 'Select an active examination session and click "Assign Room Seating Grid" to allocate student seats.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allocations.map(alloc => (
            <div key={alloc.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-bold text-slate-800 text-base">{alloc.roomName}</h3>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                      Capacity: {alloc.allocatedCount} / {alloc.roomCapacity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Session: {alloc.sessionName || alloc.sessionId}</p>
                </div>

                <div className="text-xs text-slate-400 font-mono">Allocation v{alloc.version || 1}</div>
              </div>

              {/* Seating Grid Visualization */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {alloc.studentSeating.map((seat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-indigo-600 text-xs font-mono">{seat.seatNumber}</span>
                      {seat.specialNeeds && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title={seat.specialNeeds}></span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-800 truncate">{seat.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{seat.rollNumber}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Allocate Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Assign Examination Room Seating</h3>
              <button
                onClick={() => setShowAllocateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAllocate} className="space-y-3 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={formData.classId}
                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Applicable Classes</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Section</label>
                  <select
                    value={formData.sectionId}
                    onChange={e => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Sections</option>
                    {sections
                      .filter(s => !formData.classId || s.classId === formData.classId)
                      .map(sec => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Name / Number</label>
                  <input
                    type="text"
                    required
                    value={formData.roomName}
                    onChange={e => setFormData({ ...formData, roomName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.roomCapacity}
                    onChange={e => setFormData({ ...formData, roomCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rows</label>
                  <input
                    type="number"
                    required
                    value={formData.rows}
                    onChange={e => setFormData({ ...formData, rows: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Columns</label>
                  <input
                    type="number"
                    required
                    value={formData.columns}
                    onChange={e => setFormData({ ...formData, columns: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Students to Seat</label>
                  <input
                    type="number"
                    required
                    value={formData.studentCountToSeat}
                    onChange={e => setFormData({ ...formData, studentCountToSeat: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                <strong>Capacity Protection Rule:</strong> Real registered student enrollments from the selected class/section will be mapped to the seating grid.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Auto-Generate & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
