import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import { AcademicService } from '../../services/academicService';
import {
  AttendanceCorrectionRecord,
  ClassGrade,
  Section
} from '../../types';
import {
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingDown,
  Mail,
  Printer
} from 'lucide-react';

interface AttendanceReportsViewProps {
  initialSubTab?: string;
}

export const AttendanceReportsView: React.FC<AttendanceReportsViewProps> = ({ initialSubTab = 'low-attendance' }) => {
  const { currentTenant } = useTenant();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');

  const [lowAttendanceStudents, setLowAttendanceStudents] = useState<Array<{
    studentId: string;
    studentName: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
    isCritical: boolean;
  }>>([]);

  const [correctionsLog, setCorrectionsLog] = useState<AttendanceCorrectionRecord[]>([]);
  const [thresholdCutoff, setThresholdCutoff] = useState<number>(75);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load Classes & Sections
  useEffect(() => {
    async function loadMeta() {
      if (!currentTenant) return;
      try {
        const [cls, sec] = await Promise.all([
          AcademicService.getClasses(currentTenant.id),
          AcademicService.getSections(currentTenant.id)
        ]);
        setClasses(cls);
        setSections(sec);
      } catch (err) {
        console.error('Error loading academic metadata:', err);
      }
    }
    loadMeta();
  }, [currentTenant]);

  // Load Report Data
  useEffect(() => {
    async function loadReports() {
      if (!currentTenant) return;
      setIsLoading(true);
      try {
        const [lowList, corrs] = await Promise.all([
          AttendanceService.getLowAttendanceStudents(currentTenant.id, thresholdCutoff),
          AttendanceService.getCorrectionAuditLogs(currentTenant.id, 100)
        ]);

        setLowAttendanceStudents(lowList);
        setCorrectionsLog(corrs);
      } catch (err) {
        console.error('Error loading attendance reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, [currentTenant, thresholdCutoff]);

  // Export Low Attendance CSV
  const handleExportLowAttendanceCSV = () => {
    if (lowAttendanceStudents.length === 0) return;
    const headers = ['Student Name', 'Admission No', 'Class', 'Section', 'Total Days', 'Present', 'Absent', 'Late', 'Percentage', 'Risk Level'];
    const rows = lowAttendanceStudents.map(s => [
      `"${s.studentName}"`,
      s.admissionNumber,
      `"${s.className}"`,
      `"${s.sectionName}"`,
      s.totalDays,
      s.presentDays,
      s.absentDays,
      s.lateDays,
      `${s.percentage}%`,
      s.isCritical ? 'CRITICAL' : 'WARNING'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Low_Attendance_Register_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Corrections Audit CSV
  const handleExportCorrectionsCSV = () => {
    if (correctionsLog.length === 0) return;
    const headers = ['Timestamp', 'Student Name', 'Date of Attendance', 'Previous Status', 'Corrected Status', 'Justification Reason', 'Corrected By'];
    const rows = correctionsLog.map(c => [
      c.correctedAt,
      `"${c.studentName}"`,
      c.date,
      c.previousStatus.toUpperCase(),
      c.newStatus.toUpperCase(),
      `"${c.reason}"`,
      `"${c.correctedByName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Attendance_Corrections_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLowAttendance = lowAttendanceStudents.filter(s => {
    if (selectedClassId !== 'ALL' && s.className !== classes.find(c => c.id === selectedClassId)?.name) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCorrections = correctionsLog.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.reason.toLowerCase().includes(q) ||
      c.correctedByName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Sub-Tab Selector Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('low-attendance')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'low-attendance'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Low Attendance Risk ({lowAttendanceStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('corrections-audit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'corrections-audit'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Corrections Audit Trail ({correctionsLog.length})</span>
          </button>
        </div>

        {/* Global Search and CSV Export */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search report records..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-44 focus:w-56 transition-all outline-hidden"
            />
          </div>

          <button
            type="button"
            onClick={activeTab === 'low-attendance' ? handleExportLowAttendanceCSV : handleExportCorrectionsCSV}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LOW ATTENDANCE RISK REGISTER */}
      {activeTab === 'low-attendance' && (
        <div className="space-y-4">
          {/* Threshold & Class Filter Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cutoff Threshold:
                </span>
                <select
                  value={thresholdCutoff}
                  onChange={e => setThresholdCutoff(parseInt(e.target.value, 10))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value={85}>Below 85%</option>
                  <option value={75}>Below 75% (Standard Warning)</option>
                  <option value={60}>Below 60% (Critical Truancy)</option>
                  <option value={50}>Below 50% (Extreme Risk)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Filter Class:
                </span>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">All Classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredLowAttendance.length}</strong> flagged students
            </span>
          </div>

          {/* Table of At-Risk Students */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Scanning cumulative attendance records...</p>
              </div>
            ) : filteredLowAttendance.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No Students Below {thresholdCutoff}% Threshold!
                </p>
                <p className="text-xs text-slate-500">
                  All students in selected cohorts have maintained satisfactory attendance.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Admission No</th>
                      <th className="px-4 py-3">Class & Section</th>
                      <th className="px-4 py-3 text-center">Total Sessions</th>
                      <th className="px-4 py-3 text-center">Present</th>
                      <th className="px-4 py-3 text-center">Absent</th>
                      <th className="px-4 py-3 text-center">Late</th>
                      <th className="px-4 py-3 text-center">Attendance %</th>
                      <th className="px-4 py-3 text-center">Risk Tier</th>
                      <th className="px-4 py-3 text-right">Intervention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLowAttendance.map((student, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center font-bold text-[10px]">
                              {student.studentName.charAt(0)}
                            </div>
                            <span>{student.studentName}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-mono text-slate-500">
                          {student.admissionNumber || '-'}
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                          {student.className} ({student.sectionName})
                        </td>

                        <td className="px-4 py-3 text-center font-medium">
                          {student.totalDays}
                        </td>

                        <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {student.presentDays}
                        </td>

                        <td className="px-4 py-3 text-center font-bold text-rose-600 dark:text-rose-400">
                          {student.absentDays}
                        </td>

                        <td className="px-4 py-3 text-center font-bold text-amber-600 dark:text-amber-400">
                          {student.lateDays}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold ${
                            student.isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {student.percentage}%
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.isCritical
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>
                            {student.isCritical ? 'Critical (< 60%)' : 'Warning (< 75%)'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => notify('info', 'Guardian Notice', `Drafted warning letter for ${student.studentName}'s parents.`)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Send Guardian Notice"
                          >
                            <Mail className="w-3.5 h-3.5 text-indigo-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CORRECTIONS AUDIT TRAIL */}
      {activeTab === 'corrections-audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {filteredCorrections.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Attendance Corrections Recorded
              </p>
              <p className="text-xs text-slate-500">
                All attendance updates and retro-corrections will be logged here with cryptographic immutability.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Attendance Date</th>
                    <th className="px-4 py-3 text-center">Status Adjustment</th>
                    <th className="px-4 py-3">Justification Reason</th>
                    <th className="px-4 py-3">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCorrections.map(corr => (
                    <tr key={corr.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {new Date(corr.correctedAt).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {corr.studentName}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {corr.date}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 line-through capitalize">
                            {corr.previousStatus}
                          </span>
                          <span>→</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold capitalize">
                            {corr.newStatus}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        "{corr.reason}"
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {corr.correctedByName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
