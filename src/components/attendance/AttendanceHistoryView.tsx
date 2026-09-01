import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import {
  StudentAttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  ClassGrade,
  Section,
  AcademicYear,
  Student
} from '../../types';
import { AttendanceCorrectionModal } from './AttendanceCorrectionModal';
import {
  Calendar,
  Grid,
  List,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  Sun,
  Building,
  User,
  ArrowRight,
  Edit3,
  CalendarRange
} from 'lucide-react';

interface AttendanceHistoryViewProps {
  onSelectSession?: (classId: string, sectionId: string, date: string) => void;
}

export const AttendanceHistoryView: React.FC<AttendanceHistoryViewProps> = ({ onSelectSession }) => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const [viewMode, setViewMode] = useState<'MATRIX' | 'SESSIONS'>('MATRIX');
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>('');

  // Selected Month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [allRecords, setAllRecords] = useState<StudentAttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Correction Modal
  const [correctionTargetRecord, setCorrectionTargetRecord] = useState<StudentAttendanceRecord | null>(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);

  // Load Classes, Sections, Academic Years
  useEffect(() => {
    async function loadMeta() {
      if (!currentTenant) return;
      try {
        const [clsList, secList, ayList] = await Promise.all([
          AcademicService.getClasses(currentTenant.id),
          AcademicService.getSections(currentTenant.id),
          AcademicService.getAcademicYears(currentTenant.id)
        ]);

        setClasses(clsList);
        setSections(secList);
        setAcademicYears(ayList);

        if (clsList.length > 0) setSelectedClassId(clsList[0].id);
        if (ayList.length > 0) setSelectedAcademicYearId(ayList[0].id);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    }
    loadMeta();
  }, [currentTenant]);

  // Adjust section when class changes
  useEffect(() => {
    if (selectedClassId && sections.length > 0) {
      const clsSections = sections.filter(s => s.classId === selectedClassId);
      if (clsSections.length > 0) {
        setSelectedSectionId(clsSections[0].id);
      } else {
        setSelectedSectionId('');
      }
    }
  }, [selectedClassId, sections]);

  // Fetch Attendance Records & Sessions for the selected class/section/month
  useEffect(() => {
    async function fetchHistory() {
      if (!currentTenant || !selectedClassId || !selectedSectionId) return;
      setIsLoading(true);
      try {
        const [allStudents, tenantRecords, tenantSessions] = await Promise.all([
          StudentService.getStudents(currentTenant.id),
          AttendanceService.getStudentAttendance(currentTenant.id, ''), // We will filter by month & class in memory
          AttendanceService.getSessions(currentTenant.id, {
            classId: selectedClassId,
            sectionId: selectedSectionId
          })
        ]);

        const classStudents = allStudents.filter(
          s => s.currentClassId === selectedClassId && s.currentSectionId === selectedSectionId
        );
        setStudents(classStudents.length > 0 ? classStudents : allStudents.slice(0, 15));

        // Filter records by selected class & section and month prefix
        const monthRecords = tenantRecords.filter(r =>
          r.classId === selectedClassId &&
          r.sectionId === selectedSectionId &&
          r.date.startsWith(selectedMonth)
        );

        setAllRecords(monthRecords);
        setSessions(tenantSessions);
      } catch (err) {
        console.error('Failed to load attendance history:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [currentTenant, selectedClassId, selectedSectionId, selectedMonth]);

  // Generate list of days for selected month (e.g., 2026-08-01 to 2026-08-31)
  const getDaysInMonth = (yearMonth: string): string[] => {
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const dateCount = new Date(year, month, 0).getDate();

    const days: string[] = [];
    for (let d = 1; d <= dateCount; d++) {
      const dayFormatted = d < 10 ? `0${d}` : `${d}`;
      days.push(`${yearMonth}-${dayFormatted}`);
    }
    return days;
  };

  const monthDays = getDaysInMonth(selectedMonth);

  // Export Matrix to CSV
  const handleExportMatrixCSV = () => {
    if (students.length === 0) return;
    const header = ['Roll No', 'Admission No', 'Student Name', ...monthDays.map(d => d.slice(8)), 'Present', 'Absent', 'Late', 'Rate %'];
    const rows = students.map(s => {
      let p = 0, a = 0, l = 0;
      const dayValues = monthDays.map(d => {
        const rec = allRecords.find(r => r.studentId === s.id && r.date === d);
        if (!rec) return '-';
        if (rec.status === 'present') { p++; return 'P'; }
        if (rec.status === 'absent') { a++; return 'A'; }
        if (rec.status === 'late') { l++; return 'L'; }
        if (rec.status === 'excused') return 'E';
        if (rec.status === 'leave') return 'LV';
        return '-';
      });

      const totalActive = p + a + l;
      const rate = totalActive > 0 ? Math.round(((p + l) / totalActive) * 100) : 100;

      return [
        s.rollNumber || '',
        s.studentIdNumber || '',
        `"${s.firstName} ${s.lastName}"`,
        ...dayValues,
        p,
        a,
        l,
        `${rate}%`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Matrix_${selectedMonth}_Class_${selectedClassId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students by search query
  const filteredStudents = students.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      (s.rollNumber || '').toLowerCase().includes(q) ||
      (s.studentIdNumber || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Filter and Mode Control Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Month Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CalendarRange className="w-3.5 h-3.5 text-indigo-500" />
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Academic Year
            </label>
            <select
              value={selectedAcademicYearId}
              onChange={e => setSelectedAcademicYearId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              {academicYears.map(ay => (
                <option key={ay.id} value={ay.id}>
                  {ay.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Class / Grade
            </label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Section
            </label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              {sections
                .filter(s => s.classId === selectedClassId)
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          {/* View Mode Toggle & Export */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('MATRIX')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'MATRIX'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('SESSIONS')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === 'SESSIONS'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Sessions</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportMatrixCSV}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs"
              title="Export Register to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legend and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-500 font-medium">Legend:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">P</span>
            <span className="text-slate-700 dark:text-slate-300">Present</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">A</span>
            <span className="text-slate-700 dark:text-slate-300">Absent</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">L</span>
            <span className="text-slate-700 dark:text-slate-300">Late</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">E</span>
            <span className="text-slate-700 dark:text-slate-300">Excused</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">LV</span>
            <span className="text-slate-700 dark:text-slate-300">Leave</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold text-[10px] flex items-center justify-center">-</span>
            <span className="text-slate-500">No Record / Off</span>
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-48 focus:w-60 transition-all outline-hidden"
          />
        </div>
      </div>

      {/* MATRIX SPREADSHEET REGISTER VIEW */}
      {viewMode === 'MATRIX' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium">Compiling monthly attendance register matrix...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <User className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No students enrolled</p>
              <p className="text-xs text-slate-500">Please choose a valid class and section.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                    <th className="px-3 py-2.5 sticky left-0 z-20 bg-slate-50 dark:bg-slate-800 w-12 text-center border-r border-slate-200 dark:border-slate-700">
                      Roll
                    </th>
                    <th className="px-3 py-2.5 sticky left-12 z-20 bg-slate-50 dark:bg-slate-800 min-w-[160px] border-r border-slate-200 dark:border-slate-700">
                      Student Name
                    </th>
                    {monthDays.map(d => {
                      const dayNumber = d.slice(8);
                      const dayOfWeek = new Date(d).getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      return (
                        <th
                          key={d}
                          className={`px-1 py-2 text-center min-w-[28px] border-r border-slate-200 dark:border-slate-700 font-mono text-[11px] ${
                            isWeekend ? 'bg-slate-100/70 dark:bg-slate-850 text-slate-400' : ''
                          }`}
                          title={d}
                        >
                          {dayNumber}
                        </th>
                      );
                    })}
                    <th className="px-3 py-2.5 text-center min-w-[50px] bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Pres
                    </th>
                    <th className="px-3 py-2.5 text-center min-w-[50px] bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 font-semibold">
                      Abs
                    </th>
                    <th className="px-3 py-2.5 text-center min-w-[50px] bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-semibold">
                      Late
                    </th>
                    <th className="px-3 py-2.5 text-center min-w-[60px] bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                      % Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map(student => {
                    let pCount = 0;
                    let aCount = 0;
                    let lCount = 0;
                    let eCount = 0;
                    let lvCount = 0;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors"
                      >
                        {/* Sticky Roll Number */}
                        <td className="px-3 py-2 text-center font-mono font-medium text-slate-500 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                          {student.rollNumber || '-'}
                        </td>

                        {/* Sticky Student Name */}
                        <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100 sticky left-12 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{student.firstName} {student.lastName}</span>
                          </div>
                        </td>

                        {/* Month Days Cells */}
                        {monthDays.map(d => {
                          const record = allRecords.find(r => r.studentId === student.id && r.date === d);
                          const dayOfWeek = new Date(d).getDay();
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                          let cellContent = '-';
                          let cellClass = 'text-slate-300 dark:text-slate-700';

                          if (record) {
                            if (record.status === 'present') {
                              pCount++;
                              cellContent = 'P';
                              cellClass = 'bg-emerald-600 text-white font-bold rounded-xs';
                            } else if (record.status === 'absent') {
                              aCount++;
                              cellContent = 'A';
                              cellClass = 'bg-rose-600 text-white font-bold rounded-xs';
                            } else if (record.status === 'late') {
                              lCount++;
                              cellContent = 'L';
                              cellClass = 'bg-amber-600 text-white font-bold rounded-xs';
                            } else if (record.status === 'excused') {
                              eCount++;
                              cellContent = 'E';
                              cellClass = 'bg-blue-600 text-white font-bold rounded-xs';
                            } else if (record.status === 'leave') {
                              lvCount++;
                              cellContent = 'LV';
                              cellClass = 'bg-purple-600 text-white font-bold rounded-xs';
                            }
                          }

                          return (
                            <td
                              key={d}
                              className={`p-1 text-center border-r border-slate-100 dark:border-slate-800 text-[11px] ${
                                isWeekend ? 'bg-slate-50/50 dark:bg-slate-850/30' : ''
                              }`}
                            >
                              {record ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCorrectionTargetRecord(record);
                                    setIsCorrectionModalOpen(true);
                                  }}
                                  className={`w-6 h-6 mx-auto flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xs ${cellClass}`}
                                  title={`${d}: ${record.status.toUpperCase()}${record.reason ? ` (${record.reason})` : ''} - Click to correct`}
                                >
                                  {cellContent}
                                </button>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-700 text-xs">-</span>
                              )}
                            </td>
                          );
                        })}

                        {/* Calculated Statistics */}
                        <td className="px-3 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">
                          {pCount}
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-rose-600 dark:text-rose-400 bg-rose-50/20">
                          {aCount}
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50/20">
                          {lCount}
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/20">
                          {pCount + aCount + lCount > 0
                            ? `${Math.round(((pCount + lCount) / (pCount + aCount + lCount)) * 100)}%`
                            : '100%'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SESSIONS ARCHIVE LOG VIEW */}
      {viewMode === 'SESSIONS' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No session archives found</p>
              <p className="text-xs text-slate-500">Record your first roll-call in the Daily Attendance Workspace.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Class & Cohort</th>
                    <th className="px-4 py-3">Recorded By</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Present / Total</th>
                    <th className="px-4 py-3 text-center">Absent</th>
                    <th className="px-4 py-3 text-center">Late</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map(sess => (
                    <tr key={sess.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {sess.date}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                        Class {sess.classId} — Section {sess.sectionId}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {sess.teacherName || sess.submittedBy || 'Teacher'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sess.status === 'LOCKED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                          sess.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {sess.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        {sess.presentCount} / {sess.totalEnrolled}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-rose-600 dark:text-rose-400">
                        {sess.absentCount}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-amber-600 dark:text-amber-400">
                        {sess.lateCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {onSelectSession && (
                          <button
                            type="button"
                            onClick={() => onSelectSession(sess.classId, sess.sectionId, sess.date)}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1"
                          >
                            <span>Open Roster</span>
                            <ArrowRight className="w-3 h-3" />
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
      )}

      {/* Auditable Attendance Correction Modal */}
      <AttendanceCorrectionModal
        isOpen={isCorrectionModalOpen}
        record={correctionTargetRecord}
        onClose={() => {
          setIsCorrectionModalOpen(false);
          setCorrectionTargetRecord(null);
        }}
        onSuccess={updatedRecord => {
          setAllRecords(prev =>
            prev.map(r => (r.id === updatedRecord.id ? updatedRecord : r))
          );
        }}
      />
    </div>
  );
};
