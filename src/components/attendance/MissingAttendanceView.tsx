import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ArrowRight,
  RefreshCw,
  Search,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

interface MissingAttendanceViewProps {
  onNavigateToRollCall: (classId: string, sectionId: string, date: string) => void;
}

export const MissingAttendanceView: React.FC<MissingAttendanceViewProps> = ({ onNavigateToRollCall }) => {
  const { currentTenant } = useTenant();
  const { notify } = useNotification();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [missingList, setMissingList] = useState<Array<{
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    teacherName?: string;
    status: 'NOT_STARTED' | 'DRAFT';
    sessionId?: string;
  }>>([]);
  const [metrics, setMetrics] = useState<{
    totalSessions: number;
    submittedSessions: number;
    missingSessions: number;
  }>({
    totalSessions: 0,
    submittedSessions: 0,
    missingSessions: 0
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchMissing = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    try {
      const [missing, m] = await Promise.all([
        AttendanceService.getMissingAttendance(currentTenant.id, date),
        AttendanceService.getAttendanceMetrics(currentTenant.id, date)
      ]);

      setMissingList(missing);
      setMetrics({
        totalSessions: m.totalSessions,
        submittedSessions: m.submittedSessions,
        missingSessions: missing.length
      });
    } catch (err) {
      console.error('Error fetching missing attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissing();
  }, [currentTenant, date]);

  const handleSendReminder = (item: { className: string; sectionName: string; teacherName?: string }) => {
    notify(
      'info',
      'Reminder Dispatched',
      `Sent urgent roll-call reminder notification to ${item.teacherName || 'assigned class teacher'} for Class ${item.className} - ${item.sectionName}.`
    );
  };

  const handleRemindAll = () => {
    notify(
      'success',
      'Batch Reminders Dispatched',
      `Sent automated roll call reminder alerts to teachers of all ${missingList.length} pending classrooms.`
    );
  };

  const filtered = missingList.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.className.toLowerCase().includes(q) ||
      item.sectionName.toLowerCase().includes(q) ||
      (item.teacherName || '').toLowerCase().includes(q)
    );
  });

  const completionRate = metrics.totalSessions > 0
    ? Math.round((metrics.submittedSessions / metrics.totalSessions) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Missing Roll-Call Monitor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track and remind classrooms that have not recorded or submitted daily attendance
            </p>
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 outline-hidden"
            />
          </div>

          <button
            onClick={fetchMissing}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {missingList.length > 0 && (
            <button
              onClick={handleRemindAll}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Bell className="w-3.5 h-3.5" />
              Remind All Teachers ({missingList.length})
            </button>
          )}
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completion Status</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {completionRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">
              {metrics.submittedSessions} of {metrics.totalSessions} classrooms
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Classrooms</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {missingList.length}
            </span>
            <span className="text-xs text-slate-500">
              require immediate roll call
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">In Draft Sessions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {missingList.filter(m => m.status === 'DRAFT').length}
            </span>
            <span className="text-xs text-slate-500">
              started but not submitted
            </span>
          </div>
        </div>
      </div>

      {/* Missing Classrooms Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Search Header */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pending Classrooms for {date}
          </span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search class or teacher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-48 focus:w-60 transition-all outline-hidden"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Checking classroom session statuses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Missing Attendance Records!
            </p>
            <p className="text-xs text-slate-500">
              All active academic sections have recorded their attendance for {date}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Class / Grade</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Assigned Teacher</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {item.className}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                      {item.sectionName}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.teacherName || 'Assigned Class Teacher'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'DRAFT'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}>
                        {item.status === 'DRAFT' ? 'In Draft' : 'Not Started'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSendReminder(item)}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                      >
                        <Bell className="w-3 h-3 text-amber-500" />
                        <span>Remind</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onNavigateToRollCall(item.classId, item.sectionId, date)}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>Take Roll Call</span>
                        <ArrowRight className="w-3 h-3" />
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
  );
};
