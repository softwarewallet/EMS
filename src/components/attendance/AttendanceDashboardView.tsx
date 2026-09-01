import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AttendanceService } from '../../services/attendanceService';
import { AttendanceSession, AttendanceCorrectionRecord } from '../../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  FileText,
  Activity
} from 'lucide-react';

interface AttendanceDashboardViewProps {
  onNavigateToRollCall: (classId?: string, sectionId?: string, date?: string) => void;
  onNavigateToMissing: () => void;
  onNavigateToReports: (tab?: string) => void;
}

export const AttendanceDashboardView: React.FC<AttendanceDashboardViewProps> = ({
  onNavigateToRollCall,
  onNavigateToMissing,
  onNavigateToReports
}) => {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [metrics, setMetrics] = useState<{
    totalEnrolled: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    leave: number;
    attendancePercentage: number;
    totalSessions: number;
    submittedSessions: number;
    lockedSessions: number;
    missingSessions: number;
  }>({
    totalEnrolled: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    leave: 0,
    attendancePercentage: 0,
    totalSessions: 0,
    submittedSessions: 0,
    lockedSessions: 0,
    missingSessions: 0
  });

  const [missingList, setMissingList] = useState<Array<{
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    teacherName?: string;
    status: 'NOT_STARTED' | 'DRAFT';
    sessionId?: string;
  }>>([]);

  const [lowAttendanceList, setLowAttendanceList] = useState<Array<{
    studentId: string;
    studentName: string;
    admissionNumber: string;
    className: string;
    sectionName: string;
    percentage: number;
    isCritical: boolean;
  }>>([]);

  const [recentCorrections, setRecentCorrections] = useState<AttendanceCorrectionRecord[]>([]);
  const [recentSessions, setRecentSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  const loadDashboardData = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    try {
      const [m, missing, low, corrections, sessions] = await Promise.all([
        AttendanceService.getAttendanceMetrics(currentTenant.id, date),
        AttendanceService.getMissingAttendance(currentTenant.id, date),
        AttendanceService.getLowAttendanceStudents(currentTenant.id),
        AttendanceService.getCorrectionAuditLogs(currentTenant.id, 5),
        AttendanceService.getSessions(currentTenant.id, { date })
      ]);

      setMetrics(m);
      setMissingList(missing);
      setLowAttendanceList(low);
      setRecentCorrections(corrections);
      setRecentSessions(sessions);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentTenant, date]);

  const handleSeedData = async () => {
    if (!currentTenant) return;
    setIsSeeding(true);
    try {
      await AttendanceService.seedSyntheticDemoData(currentTenant.id, {
        id: currentUser?.id || 'usr_admin',
        email: currentUser?.email || 'admin@edutech.io',
        displayName: currentUser?.displayName || 'Administrator'
      });
      notify('success', 'Sample Data Seeded', 'Populated 10 days of realistic attendance history across classes.');
      await loadDashboardData();
    } catch (err: any) {
      notify('error', 'Seeding Failed', err.message || 'Could not seed demo data.');
    } finally {
      setIsSeeding(false);
    }
  };

  const sessionSubmissionRate = metrics.totalSessions > 0
    ? Math.round((metrics.submittedSessions / metrics.totalSessions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs text-indigo-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Attendance Intelligence Engine • Phase 7.1</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Institutional Attendance Overview
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl">
            Real-time multi-cohort attendance tracking, automated tardiness logging, auditable corrections, and early-warning truancy detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
            <span className="text-xs text-indigo-200">Date:</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            onClick={() => onNavigateToRollCall()}
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Take Roll Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 border border-white/20 text-white font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
            title="Populate 10 days of realistic attendance history across classes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {isSeeding ? 'Seeding Demo Data...' : 'Seed Sample History'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Attendance Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {metrics.attendancePercentage}%
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {metrics.present + metrics.late} present / late
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(metrics.attendancePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Absentees */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unexcused Absences</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {metrics.absent}
            </span>
            <span className="text-xs text-slate-500">
              of {metrics.totalEnrolled} students
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {metrics.excused + metrics.leave} students on verified leave
          </p>
        </div>

        {/* Late Arrivals */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tardiness / Late Arrivals</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {metrics.late}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              flagged late
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Automated threshold applied
          </p>
        </div>

        {/* Classroom Submission Health */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Roll-Call Submission</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {metrics.submittedSessions}/{metrics.totalSessions || 1}
            </span>
            <span className="text-xs text-slate-500">
              ({sessionSubmissionRate}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${sessionSubmissionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Missing Sessions & Low Attendance Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Roll-Call Classroom Alerts */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Missing Attendance Roll Calls
                </h3>
                <p className="text-xs text-slate-500">
                  Classes that haven't submitted attendance for {date}
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToMissing}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              View All ({missingList.length})
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {missingList.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                All Classrooms Complete!
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                100% of academic sections have recorded their roll call for {date}.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {missingList.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.className} — {item.sectionName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.status === 'DRAFT'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}>
                        {item.status === 'DRAFT' ? 'In Draft' : 'Not Started'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Teacher: {item.teacherName || 'Assigned Class Teacher'}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateToRollCall(item.classId, item.sectionId, date)}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Attendance Risk Alert Card */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Low Attendance Risk Monitor
                </h3>
                <p className="text-xs text-slate-500">
                  Students falling below policy thresholds (&lt; 75%)
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToReports('low-attendance')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Full Register ({lowAttendanceList.length})
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {lowAttendanceList.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <ShieldCheck className="w-6 h-6 text-indigo-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                No At-Risk Students Detected
              </p>
              <p className="text-[11px] text-slate-500">
                All enrolled students are currently maintaining acceptable attendance records.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto">
              {lowAttendanceList.slice(0, 4).map((student, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {student.studentName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {student.admissionNumber}
                      </span>
                      {student.isCritical && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 font-bold">
                          Critical Risk
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Class: {student.className} ({student.sectionName})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold ${
                      student.isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {student.percentage}%
                    </span>
                    <p className="text-[10px] text-slate-400">Cumulative</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Auditable Corrections & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Auditable Corrections */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Recent Auditable Corrections
                </h3>
                <p className="text-xs text-slate-500">
                  Latest verified status adjustments with immutable audit trail
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToReports('corrections-audit')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Audit Log
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentCorrections.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No recent attendance corrections recorded.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {recentCorrections.map(corr => (
                <div
                  key={corr.id}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {corr.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(corr.correctedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500">Changed:</span>
                    <span className="capitalize line-through text-slate-400">{corr.previousStatus}</span>
                    <span>→</span>
                    <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400">{corr.newStatus}</span>
                    <span className="text-slate-400">• By: {corr.correctedByName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                    Reason: "{corr.reason}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Roll Call Activity Stream */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Today's Classroom Activity
                </h3>
                <p className="text-xs text-slate-500">
                  Live session progress across cohorts for {date}
                </p>
              </div>
            </div>
          </div>

          {recentSessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No sessions opened yet for today. Click "Take Roll Call" to begin.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {recentSessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Class {sess.classId} — Section {sess.sectionId}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        sess.status === 'LOCKED' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' :
                        sess.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {sess.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Teacher: {sess.teacherName || 'Faculty'} • Enrolled: {sess.totalEnrolled}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {sess.presentCount} P
                    </span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {sess.absentCount} A
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
