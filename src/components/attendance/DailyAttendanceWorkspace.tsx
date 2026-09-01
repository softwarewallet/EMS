import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import { AcademicService } from '../../services/academicService';
import {
  StudentAttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  ClassGrade,
  Section,
  AcademicYear
} from '../../types';
import { AttendanceCorrectionModal } from './AttendanceCorrectionModal';
import {
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Save,
  CheckCircle2,
  Lock,
  Unlock,
  Sun,
  Building,
  Download,
  Filter,
  Search,
  User,
  Sparkles,
  Info,
  ShieldCheck,
  Edit3
} from 'lucide-react';

interface DailyAttendanceWorkspaceProps {
  initialClassId?: string;
  initialSectionId?: string;
  initialDate?: string;
}

export const DailyAttendanceWorkspace: React.FC<DailyAttendanceWorkspaceProps> = ({
  initialClassId,
  initialSectionId,
  initialDate
}) => {
  const { currentTenant, campuses } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  const [date, setDate] = useState<string>(
    initialDate || new Date().toISOString().split('T')[0]
  );
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialSectionId || '');

  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Correction Modal State
  const [correctionTargetRecord, setCorrectionTargetRecord] = useState<StudentAttendanceRecord | null>(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);

  // Unlock Modal State
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [unlockReason, setUnlockReason] = useState<string>('');
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  // Holiday / Closure Modal State
  const [isClosureModalOpen, setIsClosureModalOpen] = useState<boolean>(false);
  const [closureType, setClosureType] = useState<'HOLIDAY' | 'CLOSED'>('HOLIDAY');
  const [closureReason, setClosureReason] = useState<string>('');
  const [isDeclaringClosure, setIsDeclaringClosure] = useState<boolean>(false);

  // Initial load of classes, sections, and academic years
  useEffect(() => {
    async function loadMetadata() {
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

        if (ayList.length > 0 && !selectedAcademicYearId) {
          setSelectedAcademicYearId(ayList[0].id);
        }
        if (clsList.length > 0 && !selectedClassId) {
          setSelectedClassId(clsList[0].id);
        }
      } catch (err) {
        console.error('Error loading academic metadata:', err);
      }
    }
    loadMetadata();
  }, [currentTenant]);

  // Update selectedSectionId when class changes
  useEffect(() => {
    if (selectedClassId && sections.length > 0) {
      const classSections = sections.filter(s => s.classId === selectedClassId);
      if (classSections.length > 0) {
        if (!classSections.some(s => s.id === selectedSectionId)) {
          setSelectedSectionId(classSections[0].id);
        }
      } else {
        setSelectedSectionId('');
      }
    }
  }, [selectedClassId, sections]);

  // Fetch or initialize session whenever Class, Section, Date, or Academic Year changes
  useEffect(() => {
    async function fetchSessionData() {
      if (!currentTenant || !selectedClassId || !selectedSectionId || !date) return;
      setIsLoading(true);
      try {
        const result = await AttendanceService.getOrCreateDailySession(
          {
            tenantId: currentTenant.id,
            campusId: campuses[0]?.id || 'cmp_main',
            academicYearId: selectedAcademicYearId || 'ay_current',
            classId: selectedClassId,
            sectionId: selectedSectionId,
            date,
            teacherId: currentUser?.id,
            teacherName: currentUser?.displayName || currentUser?.email
          },
          {
            id: currentUser?.id || 'usr_staff',
            email: currentUser?.email || 'staff@edutech.io',
            displayName: currentUser?.displayName || 'Faculty Staff'
          }
        );

        setSession(result.session);
        setRecords(result.records);
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSessionData();
  }, [currentTenant, selectedClassId, selectedSectionId, date, selectedAcademicYearId]);

  // Change individual student attendance status
  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    if (session?.status === 'LOCKED') {
      // Prompt correction modal if locked
      const rec = records.find(r => r.studentId === studentId);
      if (rec) {
        setCorrectionTargetRecord(rec);
        setIsCorrectionModalOpen(true);
      }
      return;
    }

    setRecords(prev =>
      prev.map(r => {
        if (r.studentId !== studentId) return r;
        return {
          ...r,
          status: newStatus,
          arrivalTime: newStatus === 'late' ? (r.arrivalTime || '08:15') : undefined,
          lateMinutes: newStatus === 'late' ? (r.lateMinutes || 15) : undefined
        };
      })
    );
  };

  // Quick mark all
  const handleMarkAll = (status: AttendanceStatus) => {
    if (session?.status === 'LOCKED') {
      notify('error', 'Session Locked', 'Cannot bulk edit a locked attendance session. Use individual corrections.');
      return;
    }

    setRecords(prev =>
      prev.map(r => ({
        ...r,
        status,
        arrivalTime: status === 'late' ? '08:15' : undefined,
        lateMinutes: status === 'late' ? 15 : undefined
      }))
    );
  };

  // Update arrival details for late students
  const handleLateDetailsChange = (studentId: string, arrivalTime: string, lateMinutes: number) => {
    if (session?.status === 'LOCKED') return;
    setRecords(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, arrivalTime, lateMinutes } : r))
    );
  };

  // Update reason or remarks
  const handleRemarksChange = (studentId: string, reason: string, remarks?: string) => {
    if (session?.status === 'LOCKED') return;
    setRecords(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, reason, remarks } : r))
    );
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!session || !currentTenant) return;
    setIsSaving(true);
    try {
      const items = records.map(r => ({
        studentId: r.studentId,
        status: r.status,
        arrivalTime: r.arrivalTime,
        lateMinutes: r.lateMinutes,
        reason: r.reason,
        remarks: r.remarks
      }));

      const updatedSession = await AttendanceService.saveDraftAttendance(
        session.id,
        items,
        {
          id: currentUser?.id || 'usr_staff',
          email: currentUser?.email || 'staff@edutech.io',
          displayName: currentUser?.displayName || currentUser?.email
        }
      );

      setSession(updatedSession);
      notify('success', 'Draft Saved', `Attendance draft saved for ${records.length} students.`);
    } catch (err: any) {
      notify('error', 'Save Failed', err.message || 'Failed to save draft attendance.');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Finalized Roll Call
  const handleSubmitAttendance = async () => {
    if (!session || !currentTenant) return;
    setIsSubmitting(true);
    try {
      const items = records.map(r => ({
        studentId: r.studentId,
        status: r.status,
        arrivalTime: r.arrivalTime,
        lateMinutes: r.lateMinutes,
        reason: r.reason,
        remarks: r.remarks
      }));

      const updatedSession = await AttendanceService.submitAttendance(
        session.id,
        items,
        {
          id: currentUser?.id || 'usr_staff',
          email: currentUser?.email || 'staff@edutech.io',
          displayName: currentUser?.displayName || currentUser?.email
        }
      );

      setSession(updatedSession);
      notify(
        'success',
        'Attendance Submitted',
        `Roll call submitted successfully for ${date} (${updatedSession.presentCount} present, ${updatedSession.absentCount} absent).`
      );
    } catch (err: any) {
      notify('error', 'Submission Failed', err.message || 'Failed to submit attendance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lock Session
  const handleLockSession = async () => {
    if (!session) return;
    try {
      const updated = await AttendanceService.lockAttendance(session.id, {
        id: currentUser?.id || 'usr_staff',
        email: currentUser?.email || 'staff@edutech.io',
        displayName: currentUser?.displayName || currentUser?.email
      });
      setSession(updated);
      setRecords(prev => prev.map(r => ({ ...r, locked: true })));
      notify('success', 'Session Locked', 'Attendance records locked against non-audited modifications.');
    } catch (err: any) {
      notify('error', 'Lock Failed', err.message || 'Failed to lock session.');
    }
  };

  // Unlock Session
  const handleUnlockSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !unlockReason.trim()) {
      notify('error', 'Reason Required', 'Please provide a valid administrative reason to unlock.');
      return;
    }

    setIsUnlocking(true);
    try {
      const updated = await AttendanceService.unlockAttendance(session.id, unlockReason, {
        id: currentUser?.id || 'usr_staff',
        email: currentUser?.email || 'staff@edutech.io',
        displayName: currentUser?.displayName || currentUser?.email
      });
      setSession(updated);
      setRecords(prev => prev.map(r => ({ ...r, locked: false })));
      setIsUnlockModalOpen(false);
      setUnlockReason('');
      notify('success', 'Session Unlocked', 'Attendance session is now editable.');
    } catch (err: any) {
      notify('error', 'Unlock Failed', err.message || 'Failed to unlock session.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // Declare Holiday / School Closure
  const handleDeclareClosure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !closureReason.trim()) {
      notify('error', 'Reason Required', 'Please enter a justification description.');
      return;
    }

    setIsDeclaringClosure(true);
    try {
      const updated = await AttendanceService.markSessionHolidayOrClosed(
        session.id,
        closureType,
        closureReason,
        {
          id: currentUser?.id || 'usr_staff',
          email: currentUser?.email || 'staff@edutech.io',
          displayName: currentUser?.displayName || currentUser?.email
        }
      );
      setSession(updated);
      setRecords(prev =>
        prev.map(r => ({
          ...r,
          status: 'excused',
          reason: `${closureType === 'HOLIDAY' ? 'Holiday' : 'School Closed'}: ${closureReason}`
        }))
      );
      setIsClosureModalOpen(false);
      setClosureReason('');
      notify(
        'success',
        `${closureType === 'HOLIDAY' ? 'Holiday' : 'Closure'} Declared`,
        `All student records for ${date} set to excused with note.`
      );
    } catch (err: any) {
      notify('error', 'Action Failed', err.message || 'Failed to declare closure.');
    } finally {
      setIsDeclaringClosure(false);
    }
  };

  // CSV Export of Current Session Roster
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Roll No', 'Admission No', 'Student Name', 'Date', 'Status', 'Arrival Time', 'Late Minutes', 'Reason', 'Remarks'];
    const rows = records.map(r => [
      r.rollNumber || '',
      r.admissionNumber || '',
      `"${r.studentName}"`,
      r.date,
      r.status.toUpperCase(),
      r.arrivalTime || '',
      r.lateMinutes || '',
      `"${r.reason || ''}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${date}_Class_${selectedClassId}_${selectedSectionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Students
  const filteredRecords = records.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchRoll = (r.rollNumber || '').toLowerCase().includes(q);
      const matchAdm = (r.admissionNumber || '').toLowerCase().includes(q);
      return matchName || matchRoll || matchAdm;
    }
    return true;
  });

  // Calculate live counts
  const totalStudents = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const leaveCount = records.filter(r => r.status === 'leave').length;
  const presentRate = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 100;

  const currentClassName = classes.find(c => c.id === selectedClassId)?.name || 'Selected Class';
  const currentSectionName = sections.find(s => s.id === selectedSectionId)?.name || 'Section';

  return (
    <div className="space-y-6">
      {/* Top Filter & Selector Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Attendance Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
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
                  {ay.name} {ay.isCurrent ? '(Active)' : ''}
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
              Section / Cohort
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
        </div>
      </div>

      {/* Session Metadata & Real-Time Status Header */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentClassName} — {currentSectionName} Roll Call
                </h2>
                {/* Session Status Pill */}
                {session?.isHoliday ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                    <Sun className="w-3 h-3" /> Holiday Declared
                  </span>
                ) : session?.isSchoolClosed ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 flex items-center gap-1">
                    <Building className="w-3 h-3" /> Campus Closed
                  </span>
                ) : session?.status === 'LOCKED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked Record
                  </span>
                ) : session?.status === 'SUBMITTED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Officially Submitted
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> In Draft Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Session Date: <strong className="text-slate-700 dark:text-slate-300">{date}</strong> • Teacher: {session?.teacherName || currentUser?.displayName || 'Class Teacher'} • Enrolled Roster: {totalStudents} students
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={records.length === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              CSV Export
            </button>

            {/* Declare Holiday / Closed button */}
            {session?.status !== 'LOCKED' && (
              <button
                onClick={() => setIsClosureModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Sun className="w-3.5 h-3.5" />
                Declare Holiday/Closed
              </button>
            )}

            {/* Lock / Unlock Actions */}
            {session?.status === 'LOCKED' ? (
              <button
                onClick={() => setIsUnlockModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Unlock className="w-3.5 h-3.5" />
                Unlock Session
              </button>
            ) : (
              session?.status === 'SUBMITTED' && (
                <button
                  onClick={handleLockSession}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Session
                </button>
              )
            )}

            {/* Save Draft */}
            {session?.status !== 'LOCKED' && (
              <button
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
            )}

            {/* Submit Attendance */}
            {session?.status !== 'LOCKED' && (
              <button
                onClick={handleSubmitAttendance}
                disabled={isSubmitting || isSaving}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            )}
          </div>
        </div>

        {/* Real-time Metric Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Enrolled</span>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{totalStudents}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Present (P)</span>
            <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">{presentCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <span className="text-[11px] font-medium text-rose-700 dark:text-rose-400">Absent (A)</span>
            <p className="text-base font-bold text-rose-700 dark:text-rose-300">{absentCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">Late (L)</span>
            <p className="text-base font-bold text-amber-700 dark:text-amber-300">{lateCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
            <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Excused / Leave</span>
            <p className="text-base font-bold text-blue-700 dark:text-blue-300">{excusedCount + leaveCount}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400">Attendance Rate</span>
            <p className="text-base font-bold text-indigo-700 dark:text-indigo-300">{presentRate}%</p>
          </div>
        </div>
      </div>

      {/* Roster Controls & Bulk Action Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Bulk Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Quick Actions:
          </span>
          <button
            type="button"
            onClick={() => handleMarkAll('present')}
            disabled={session?.status === 'LOCKED'}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 disabled:opacity-50 transition-colors"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('absent')}
            disabled={session?.status === 'LOCKED'}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 disabled:opacity-50 transition-colors"
          >
            Mark All Absent
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('late')}
            disabled={session?.status === 'LOCKED'}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 disabled:opacity-50 transition-colors"
          >
            Mark All Late
          </button>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            >
              <option value="ALL">All Students</option>
              <option value="present">Present Only</option>
              <option value="absent">Absent Only</option>
              <option value="late">Late Only</option>
              <option value="excused">Excused Only</option>
              <option value="leave">Leave Only</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or roll..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-48 focus:w-60 transition-all focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Classroom Attendance Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Loading classroom roster and attendance records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <User className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No student records found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or verify section enrollment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50/75 dark:bg-slate-800/75 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3 w-16">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Admission No</th>
                  <th className="px-4 py-3 text-center">Attendance Status</th>
                  <th className="px-4 py-3">Tardiness / Late Arrival</th>
                  <th className="px-4 py-3">Reason / Remarks</th>
                  <th className="px-4 py-3 text-right">Auditable Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRecords.map((record, index) => {
                  const isLate = record.status === 'late';
                  const isAbsent = record.status === 'absent';
                  const isExcused = record.status === 'excused' || record.status === 'leave';

                  return (
                    <tr
                      key={record.studentId}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors ${
                        isAbsent ? 'bg-rose-50/20 dark:bg-rose-950/10' :
                        isLate ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                          {record.rollNumber || '-'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                            {record.studentName.charAt(0)}
                          </div>
                          <span>{record.studentName}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-500 dark:text-slate-400">
                        {record.admissionNumber || '-'}
                      </td>

                      {/* Interactive Status Selector Pills */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {(['present', 'absent', 'late', 'excused', 'leave'] as AttendanceStatus[]).map(st => {
                            const isSelected = record.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(record.studentId, st)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                                  isSelected
                                    ? st === 'present'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'absent'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : st === 'late'
                                      ? 'bg-amber-600 text-white shadow-xs'
                                      : st === 'excused'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-purple-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                              >
                                {st === 'present' ? 'P' :
                                 st === 'absent' ? 'A' :
                                 st === 'late' ? 'L' :
                                 st === 'excused' ? 'E' : 'LV'}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Tardiness & Arrival details */}
                      <td className="px-4 py-3">
                        {isLate ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <input
                                type="time"
                                disabled={session?.status === 'LOCKED'}
                                value={record.arrivalTime || '08:15'}
                                onChange={e =>
                                  handleLateDetailsChange(
                                    record.studentId,
                                    e.target.value,
                                    record.lateMinutes || 15
                                  )
                                }
                                className="bg-transparent text-xs font-medium outline-hidden w-16"
                              />
                            </div>
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                              (+{record.lateMinutes || 15}m)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">—</span>
                        )}
                      </td>

                      {/* Reason & Remarks */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          disabled={session?.status === 'LOCKED'}
                          placeholder={
                            isAbsent
                              ? 'e.g., Unexcused absence'
                              : isLate
                              ? 'e.g., Late bus #12'
                              : isExcused
                              ? 'e.g., Medical leave note'
                              : 'Optional remarks...'
                          }
                          value={record.reason || record.remarks || ''}
                          onChange={e => handleRemarksChange(record.studentId, e.target.value)}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-hidden"
                        />
                      </td>

                      {/* Action column (Correction modal button) */}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setCorrectionTargetRecord(record);
                            setIsCorrectionModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Correct
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Auditable Attendance Correction Modal */}
      <AttendanceCorrectionModal
        isOpen={isCorrectionModalOpen}
        record={correctionTargetRecord}
        onClose={() => {
          setIsCorrectionModalOpen(false);
          setCorrectionTargetRecord(null);
        }}
        onSuccess={updatedRecord => {
          setRecords(prev =>
            prev.map(r => (r.id === updatedRecord.id ? updatedRecord : r))
          );
        }}
      />

      {/* Administrative Session Unlock Modal */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Unlock Attendance Session
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide administrative justification to reopen locked records
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlockSession} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Administrative Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={unlockReason}
                  onChange={e => setUnlockReason(e.target.value)}
                  placeholder="e.g., Principal approved retroactive correction for field trip attendees"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUnlocking || !unlockReason.trim()}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isUnlocking ? 'Unlocking...' : 'Confirm Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Declare Holiday / Closure Modal */}
      {isClosureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Declare Holiday or School Closure
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Excuses all enrolled students for {date}
                </p>
              </div>
            </div>

            <form onSubmit={handleDeclareClosure} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Closure Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setClosureType('HOLIDAY')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      closureType === 'HOLIDAY'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Official Holiday
                  </button>
                  <button
                    type="button"
                    onClick={() => setClosureType('CLOSED')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      closureType === 'CLOSED'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Campus Closure
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Declaration Description / Holiday Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={closureReason}
                  onChange={e => setClosureReason(e.target.value)}
                  placeholder="e.g., National Day Holiday, Inclement Weather Closure"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClosureModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeclaringClosure || !closureReason.trim()}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isDeclaringClosure ? 'Saving...' : 'Apply Declaration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
