import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  RefreshCw,
  ShieldAlert,
  Zap,
  TrendingUp,
  UserCheck,
  UserX,
  XCircle
} from 'lucide-react';
import { ExamOpsAnalytics, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface CommandCenterTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
  onNavigateTab: (tab: string) => void;
}

export const CommandCenterTab: React.FC<CommandCenterTabProps> = ({
  tenantId,
  campusId,
  currentUser,
  onNavigateTab
}) => {
  const { selectedExamination } = useExaminationOperations();
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<ExamOpsAnalytics | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    setLoading(true);
    try {
      const dayOverview = await ExaminationOpsService.getDayOperationsOverview(tenantId, campusId, selectedDate);
      const analyticsData = await ExaminationOpsService.getExamOpsAnalytics(tenantId, campusId);

      // If an examination is actively selected in context, filter day overview sessions
      if (selectedExamination?.id && dayOverview?.todaySessions) {
        const filteredSessions = dayOverview.todaySessions.filter((s: any) => s.examinationId === selectedExamination.id);
        setTodayData({
          ...dayOverview,
          todaySessions: filteredSessions,
          stats: {
            ...dayOverview.stats,
            totalScheduled: filteredSessions.length,
            activeNow: filteredSessions.filter((s: any) => s.status === 'ACTIVE').length
          }
        });
      } else {
        setTodayData(dayOverview);
      }

      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedDate, selectedExamination?.id]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Operational Mode
            </span>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
            <span className="text-xs text-slate-500 font-mono">Terminal ID: EXAM-CMD-01</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">Examination Operations Command Center</h2>
          <p className="text-sm text-slate-500">
            Real-time monitoring for examination sessions, room allocations, student presence, and incident control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Sessions</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayData?.stats?.totalScheduled || 0}</span>
            <span className="text-xs font-medium text-indigo-600">
              ({todayData?.stats?.activeNow || 0} Active Now)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Scheduled for {selectedDate}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Presence Rate</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {analytics?.presenceRatePercentage || 0}%
            </span>
            <span className="text-xs font-medium text-emerald-600">
              ({todayData?.stats?.presentCount || 0} Present)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <UserX className="w-3.5 h-3.5 text-amber-500" />
            <span>{todayData?.stats?.absentCount || 0} Absent / Suspended</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Incidents</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayData?.stats?.incidentCount || 0}</span>
            <span className="text-xs font-medium text-rose-600">
              ({analytics?.activeIncidents || 0} Pending)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Reported during examinations</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Result Readiness</span>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {analytics?.resultReadinessPercentage || 0}%
            </span>
            <span className="text-xs font-medium text-sky-600">
              ({analytics?.resultsFinalizedCount || 0} Finalized)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-sky-500" />
            <span>Ready for report cards</span>
          </div>
        </div>
      </div>

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Active Examination Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Today's Examination Sessions</h3>
              </div>
              <button
                onClick={() => onNavigateTab('sessions')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Manage All Sessions &rarr;
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading today's session ticker...</div>
            ) : !todayData?.todaySessions?.length ? (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No examination sessions scheduled for {selectedDate}.</p>
                <p className="text-xs text-slate-400 mt-1">Use the Examination Sessions tab to schedule or activate new exam sessions.</p>
                <button
                  onClick={() => onNavigateTab('sessions')}
                  className="mt-4 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Create Exam Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {(todayData?.todaySessions || []).map((session: any) => (
                  <div
                    key={session.id}
                    className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          session.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : session.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{session.code}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{session.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {session.startTime} - {session.endTime} ({session.sessionType})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Campus ID: {session.campusId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('presence')}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Record Presence
                      </button>
                      <button
                        onClick={() => onNavigateTab('seating')}
                        className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                      >
                        Seating
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Hub */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Examination Terminal Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('seating')}
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg w-fit mb-2 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Room Seating</div>
                <div className="text-[11px] text-slate-500">Assign seat layout</div>
              </button>

              <button
                onClick={() => onNavigateTab('presence')}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg w-fit mb-2 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Presence Check</div>
                <div className="text-[11px] text-slate-500">Hall roster check-in</div>
              </button>

              <button
                onClick={() => onNavigateTab('incidents')}
                className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg w-fit mb-2 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Log Malpractice</div>
                <div className="text-[11px] text-slate-500">Report exam violation</div>
              </button>

              <button
                onClick={() => onNavigateTab('result_readiness')}
                className="p-3 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-sky-100 text-sky-700 rounded-lg w-fit mb-2 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">Finalize Results</div>
                <div className="text-[11px] text-slate-500">Lock mark ledger</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Operational Alerts & Exceptions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Operational Exceptions
              </h3>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                {analytics?.openExceptions || 0} Open
              </span>
            </div>

            {analytics?.openExceptions === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                All examination operational checks passed. Zero blocking exceptions detected.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center justify-between">
                    <span>Pending Paper Release Approval</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">HIGH</span>
                  </div>
                  <p className="text-amber-800">One or more question papers require dual-officer signoff before printing/release.</p>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-rose-900 flex items-center justify-between">
                    <span>Malpractice Case Under Review</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">CRITICAL</span>
                  </div>
                  <p className="text-rose-800">Active malpractice incident logged in room requires invigilator resolution signature.</p>
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigateTab('exceptions')}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors text-center"
            >
              View Full Exception Register &rarr;
            </button>
          </div>

          {/* Security & Isolation Summary Card */}
          <div className="bg-slate-900 text-white rounded-xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Security & Audit Enforcement
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Examination records are protected by server-side tenant and campus isolation rules. Anti-self-approval and immutable session locks are strictly enforced.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Campus Scope: {campusId || 'Default'}</span>
              <span>Audit Action Logging: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
