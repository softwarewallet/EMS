import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Layers, 
  X, 
  BookOpen,
  MapPin,
  User,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TimetableService, TeacherService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { UserService } from '../../services/userService';
import { 
  TimetableEntry, 
  DayOfWeek, 
  ClassGrade, 
  Section, 
  Subject, 
  TeacherProfile, 
  User as UserType,
  TimetableConflict
} from '../../types';

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIOD_SLOTS = [
  { number: 1, label: 'Period 1', time: '08:00 - 08:45' },
  { number: 2, label: 'Period 2', time: '08:45 - 09:30' },
  { number: 3, label: 'Period 3', time: '09:30 - 10:15' },
  { number: 4, label: 'Period 4 (Post-Recess)', time: '10:45 - 11:30' },
  { number: 5, label: 'Period 5', time: '11:30 - 12:15' },
  { number: 6, label: 'Period 6', time: '12:15 - 01:00' }
];

export const TimetableManagementView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Filter States
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Modals & Forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [liveConflict, setLiveConflict] = useState<TimetableConflict | null>(null);

  const [formState, setFormState] = useState<{
    dayOfWeek: DayOfWeek;
    periodNumber: number;
    startTime: string;
    endTime: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    roomId: string;
    roomName: string;
    type: 'core' | 'elective' | 'lab' | 'activity' | 'break' | 'sports';
  }>({
    dayOfWeek: 'Monday',
    periodNumber: 1,
    startTime: '08:00',
    endTime: '08:45',
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    roomId: 'rm_204',
    roomName: 'Room 204',
    type: 'core'
  });

  const canManage = userPermissions.includes('platform.admin') || userPermissions.includes('timetable.create') || userPermissions.includes('timetable.edit');

  useEffect(() => {
    loadInitialData();
  }, [tenantId]);

  const loadInitialData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [cList, secList, subList, tList, uList, eList] = await Promise.all([
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        AcademicService.getSubjects(tenantId),
        TeacherService.getTeachers(tenantId),
        UserService.getUsers(tenantId),
        TimetableService.getEntries(tenantId, 'ay_2025_2026')
      ]);

      setClasses(cList);
      setSections(secList);
      setSubjects(subList);
      setTeachers(tList);
      setUsers(uList);
      setEntries(eList);

      if (cList.length > 0) {
        setSelectedClassId(cList[0].id);
        const classSections = secList.filter(s => s.classId === cList[0].id);
        if (classSections.length > 0) {
          setSelectedSectionId(classSections[0].id);
        }
      }

      if (tList.length > 0) {
        setSelectedTeacherId(tList[0].id);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load timetable dataset');
    } finally {
      setLoading(false);
    }
  };

  // Re-check conflict on form change
  useEffect(() => {
    if (!showAddModal) return;
    const selectedClass = classes.find(c => c.id === formState.classId);
    const selectedTeacher = teachers.find(t => t.id === formState.teacherId);
    const teacherUser = users.find(u => u.id === selectedTeacher?.userId);
    const teacherName = teacherUser?.displayName || selectedTeacher?.employeeId || 'Teacher';

    const testEntry: Omit<TimetableEntry, 'id'> = {
      tenantId,
      academicYearId: 'ay_2025_2026',
      classId: formState.classId,
      className: selectedClass?.name || 'Class',
      sectionId: formState.sectionId,
      sectionName: sections.find(s => s.id === formState.sectionId)?.name || 'Section',
      dayOfWeek: formState.dayOfWeek,
      periodNumber: Number(formState.periodNumber),
      startTime: formState.startTime,
      endTime: formState.endTime,
      subjectId: formState.subjectId,
      subjectName: subjects.find(s => s.id === formState.subjectId)?.name || 'Subject',
      subjectCode: subjects.find(s => s.id === formState.subjectId)?.code || 'SUB-01',
      teacherId: formState.teacherId,
      teacherName,
      roomId: formState.roomId,
      roomName: formState.roomName,
      type: formState.type
    };

    const conflicts = TimetableService.detectConflicts(testEntry, entries, editingEntry?.id);
    setLiveConflict(conflicts.length > 0 ? conflicts[0] : null);
  }, [formState, showAddModal, editingEntry, entries]);

  const handleOpenAdd = (day?: DayOfWeek, period?: number) => {
    const slot = PERIOD_SLOTS.find(p => p.number === (period || 1));
    const [start, end] = slot?.time.split(' - ') || ['08:00', '08:45'];

    setEditingEntry(null);
    setFormState({
      dayOfWeek: day || 'Monday',
      periodNumber: period || 1,
      startTime: start.trim(),
      endTime: end.trim(),
      classId: selectedClassId || classes[0]?.id || '',
      sectionId: selectedSectionId || sections[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      roomId: 'rm_204',
      roomName: 'Room 204',
      type: 'core'
    });
    setLiveConflict(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormState({
      dayOfWeek: entry.dayOfWeek,
      periodNumber: entry.periodNumber,
      startTime: entry.startTime,
      endTime: entry.endTime,
      classId: entry.classId,
      sectionId: entry.sectionId,
      subjectId: entry.subjectId,
      teacherId: entry.teacherId,
      roomId: entry.roomId || 'rm_204',
      roomName: entry.roomName || 'Room 204',
      type: entry.type
    });
    setLiveConflict(null);
    setShowAddModal(true);
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (liveConflict) {
      setErrorMsg(`Cannot save period: ${liveConflict.message}`);
      return;
    }

    const selectedClass = classes.find(c => c.id === formState.classId);
    const selectedSection = sections.find(s => s.id === formState.sectionId);
    const selectedSubject = subjects.find(s => s.id === formState.subjectId);
    const selectedTeacher = teachers.find(t => t.id === formState.teacherId);
    const teacherUser = users.find(u => u.id === selectedTeacher?.userId);
    const teacherName = teacherUser?.displayName || selectedTeacher?.employeeId || 'Teacher';

    try {
      const saved = await TimetableService.saveEntry(
        tenantId,
        {
          id: editingEntry?.id,
          tenantId,
          academicYearId: 'ay_2025_2026',
          classId: formState.classId,
          className: selectedClass?.name || 'Class',
          sectionId: formState.sectionId,
          sectionName: selectedSection?.name || 'Section',
          dayOfWeek: formState.dayOfWeek,
          periodNumber: Number(formState.periodNumber),
          startTime: formState.startTime,
          endTime: formState.endTime,
          subjectId: formState.subjectId,
          subjectName: selectedSubject?.name || 'Subject',
          subjectCode: selectedSubject?.code || 'SUB-01',
          teacherId: formState.teacherId,
          teacherName,
          roomId: formState.roomId,
          roomName: formState.roomName,
          type: formState.type
        },
        currentUser?.email || 'admin',
        currentUser?.displayName || 'Administrator'
      );

      setSuccessMsg(`Timetable period saved for ${saved.subjectName} (${saved.dayOfWeek} P${saved.periodNumber})`);
      setShowAddModal(false);
      
      // Reload timetable
      const updated = await TimetableService.getEntries(tenantId, 'ay_2025_2026');
      setEntries(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save timetable period');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to remove this timetable slot?')) return;
    try {
      await TimetableService.deleteEntry(tenantId, entryId, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg('Timetable slot removed');
      const updated = await TimetableService.getEntries(tenantId, 'ay_2025_2026');
      setEntries(updated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete period');
    }
  };

  // Filter entries based on active view mode
  const activeEntries = entries.filter(e => {
    if (viewMode === 'class') {
      return (!selectedClassId || e.classId === selectedClassId) && (!selectedSectionId || e.sectionId === selectedSectionId);
    } else {
      return !selectedTeacherId || e.teacherId === selectedTeacherId;
    }
  });

  const getEntryForSlot = (day: DayOfWeek, periodNum: number) => {
    return activeEntries.find(e => e.dayOfWeek === day && e.periodNumber === periodNum);
  };

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.name || 'Class';
  const selectedSectionName = sections.find(s => s.id === selectedSectionId)?.name || 'Section';
  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);
  const teacherUser = users.find(u => u.id === selectedTeacher?.userId);
  const selectedTeacherName = teacherUser?.displayName || selectedTeacher?.employeeId || 'Teacher';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Academic Schedule Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Timetable & Schedule Master</h1>
          <p className="text-slate-400 text-sm mt-1">
            Build weekly class and faculty timetables with automated real-time conflict detection and room occupancy verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-medium border border-slate-700 transition"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print Timetable</span>
          </button>
          {canManage && (
            <button
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Period</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3 print:hidden">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View Switcher & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        {/* Toggle Mode */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('class')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'class'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class-wise Timetable
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
              viewMode === 'teacher'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher-wise Timetable
          </button>
        </div>

        {/* Dynamic Filters */}
        {viewMode === 'class' ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Class:</label>
              <select
                value={selectedClassId}
                onChange={e => {
                  const cid = e.target.value;
                  setSelectedClassId(cid);
                  const validSecs = sections.filter(s => s.classId === cid);
                  setSelectedSectionId(validSecs[0]?.id || '');
                }}
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-sky-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Section:</label>
              <select
                value={selectedSectionId}
                onChange={e => setSelectedSectionId(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-sky-500"
              >
                {sections
                  .filter(s => !selectedClassId || s.classId === selectedClassId)
                  .map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Faculty:</label>
            <select
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-sky-500"
            >
              {teachers.map(t => {
                const u = users.find(usr => usr.id === t.userId);
                return (
                  <option key={t.id} value={t.id}>
                    {u?.displayName || t.employeeId} ({t.employeeId} - {t.department})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Timetable Header Summary (Visible in Print as well) */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Weekly Schedule View</span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {viewMode === 'class' 
              ? `${selectedClassName} — ${selectedSectionName}`
              : `Faculty Schedule: ${selectedTeacherName}`}
          </h2>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div className="font-semibold text-slate-900">Academic Session 2025–2026</div>
          <div>Working Days: Monday – Saturday</div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold w-28 border-r border-slate-800">Period / Time</th>
                {DAYS_OF_WEEK.map(day => (
                  <th key={day} className="py-3.5 px-4 font-semibold text-center border-r border-slate-800 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {PERIOD_SLOTS.map(slot => (
                <tr key={slot.number} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700">
                    <div className="text-sky-700">{slot.label}</div>
                    <div className="text-slate-400 font-normal mt-0.5">{slot.time}</div>
                  </td>

                  {DAYS_OF_WEEK.map(day => {
                    const entry = getEntryForSlot(day, slot.number);

                    return (
                      <td key={day} className="p-2 border-r border-slate-200 last:border-r-0 align-top min-w-[170px]">
                        {entry ? (
                          <div className={`p-3 rounded-xl border flex flex-col justify-between h-full min-h-[96px] relative group transition shadow-xs ${
                            entry.type === 'lab' 
                              ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                              : entry.type === 'sports'
                              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                              : entry.type === 'activity'
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-sky-50/70 border-sky-200 text-sky-950'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs leading-tight line-clamp-1">
                                  {entry.subjectName}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-white/80 border border-slate-200/60 uppercase">
                                  {entry.type}
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-600 space-y-0.5">
                                {viewMode === 'class' ? (
                                  <div className="flex items-center gap-1 font-medium text-slate-800">
                                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{entry.teacherName}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 font-medium text-slate-800">
                                    <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{entry.className} ({entry.sectionName})</span>
                                  </div>
                                )}

                                {entry.roomName && (
                                  <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{entry.roomName}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Hover Actions */}
                            {canManage && (
                              <div className="mt-2 pt-1 border-t border-slate-200/50 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition print:hidden">
                                <button
                                  onClick={() => handleOpenEdit(entry)}
                                  className="p-1 hover:bg-white rounded text-slate-500 hover:text-sky-600 transition"
                                  title="Edit Slot"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="p-1 hover:bg-white rounded text-slate-500 hover:text-rose-600 transition"
                                  title="Delete Slot"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          canManage && (
                            <button
                              onClick={() => handleOpenAdd(day, slot.number)}
                              className="w-full h-full min-h-[96px] rounded-xl border border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-300 hover:text-sky-600 flex flex-col items-center justify-center gap-1 transition text-xs print:hidden"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-[10px] font-medium">Add Slot</span>
                            </button>
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Timetable Entry */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">
                  {editingEntry ? 'Edit Period Slot' : 'Schedule Timetable Period'}
                </h3>
                <p className="text-xs text-slate-400">Automated conflict checking against teacher, classroom & section availability</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Conflict Warning Box */}
            {liveConflict && (
              <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider">Schedule Conflict Detected:</span>
                  <p className="mt-0.5 leading-relaxed">{liveConflict.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveEntry} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week *</label>
                  <select
                    value={formState.dayOfWeek}
                    onChange={e => setFormState({ ...formState, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Number *</label>
                  <select
                    value={formState.periodNumber}
                    onChange={e => {
                      const pNum = Number(e.target.value);
                      const slot = PERIOD_SLOTS.find(s => s.number === pNum);
                      const [start, end] = slot?.time.split(' - ') || ['08:00', '08:45'];
                      setFormState({
                        ...formState,
                        periodNumber: pNum,
                        startTime: start.trim(),
                        endTime: end.trim()
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {PERIOD_SLOTS.map(p => (
                      <option key={p.number} value={p.number}>{p.label} ({p.time})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Grade *</label>
                  <select
                    value={formState.classId}
                    onChange={e => {
                      const cid = e.target.value;
                      const validSecs = sections.filter(s => s.classId === cid);
                      setFormState({
                        ...formState,
                        classId: cid,
                        sectionId: validSecs[0]?.id || ''
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section *</label>
                  <select
                    value={formState.sectionId}
                    onChange={e => setFormState({ ...formState, sectionId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {sections
                      .filter(s => !formState.classId || s.classId === formState.classId)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Curriculum Subject *</label>
                <select
                  value={formState.subjectId}
                  onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty *</label>
                <select
                  value={formState.teacherId}
                  onChange={e => setFormState({ ...formState, teacherId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {teachers.map(t => {
                    const u = users.find(usr => usr.id === t.userId);
                    return (
                      <option key={t.id} value={t.id}>
                        {u?.displayName || t.employeeId} ({t.employeeId} - {t.department})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Lab</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204 / Physics Lab 2"
                    value={formState.roomName}
                    onChange={e => setFormState({ ...formState, roomName: e.target.value, roomId: `rm_${e.target.value.toLowerCase().replace(/\s+/g, '_')}` })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Category</label>
                  <select
                    value={formState.type}
                    onChange={e => setFormState({ ...formState, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="core">Core Subject</option>
                    <option value="lab">Science / Computer Lab</option>
                    <option value="activity">Library / Activity</option>
                    <option value="sports">Physical Education / Sports</option>
                    <option value="elective">Elective</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(liveConflict)}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition ${
                    liveConflict 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-sky-600 hover:bg-sky-500'
                  }`}
                >
                  {editingEntry ? 'Update Period Slot' : 'Confirm Schedule Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
