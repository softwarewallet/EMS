import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, CheckSquare, RefreshCw, Clipboard, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTenant } from '../../../context/TenantContext';
import { DashboardService } from '../../../services/dashboardService';
import { TeacherAcademicStats } from '../../../types/dashboard';

export const TeacherDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { currentUser } = useAuth();
  const { currentTenant, activeCampus } = useTenant();
  const [stats, setStats] = useState<TeacherAcademicStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTeacherData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    const data = await DashboardService.getTeacherStats(currentTenant.id, activeCampus?.id, currentUser);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTeacherData();
  }, [currentTenant, activeCampus]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Resolving Teacher Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="teacher-dashboard-root">
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="teacher-metrics-grid">
        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('routine')}
          id="teacher-classes"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Classes</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.classesCount}</h3>
            <div className="text-xs text-indigo-600 font-semibold mt-1">
              <span>{stats.sectionsCount} Subject Sections</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('assignments')}
          id="teacher-grading"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Grading Backlog</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.pendingAssignmentsCount}</h3>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              <span>Pending review verification</span>
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('attendance')}
          id="teacher-attendance"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class Attendance</p>
            <h3 className="text-3xl font-bold text-emerald-600">98.2%</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              <span>Rolling term average</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('routine')}
          id="teacher-next-period"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Period</p>
            <h3 className="text-xl font-bold text-slate-800 truncate max-w-[150px]">
              {(stats.todayPeriods || [])[0]?.subject || 'None'}
            </h3>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span>Starts at {(stats.todayPeriods || [])[0]?.time.split('-')[0] || 'N/A'}</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="teacher-dashboard-panels">
        
        {/* Period Routine Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="teacher-routine-panel">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Today's Class Schedule</h3>
              <p className="text-xs text-slate-400">Chronological academic routine allocated for today</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Active Session
            </span>
          </div>

          <div className="space-y-3">
            {(stats.todayPeriods || []).map((period) => (
              <div 
                key={period.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-50/80 transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {period.subject.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{period.subject}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {period.grade} • Room {period.room}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-xs font-bold text-slate-400">{period.time}</span>
                  <button 
                    onClick={() => onNavigate?.('attendance')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg transition-colors"
                  >
                    Mark Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments & Assessments Tracker */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="teacher-tasks-panel">
          <h3 className="text-base font-bold text-slate-800 mb-1">Assessments Registry</h3>
          <p className="text-xs text-slate-400 mb-6">Current continuous evaluation tasks and deadlines</p>

          <div className="space-y-4">
            {(stats.recentAssessments || []).map((item) => (
              <div key={item.id} className="p-3 border border-slate-100 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.grade}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Due: {item.dueDate}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-500">{item.submissionsCount} submissions received</span>
                  <button 
                    onClick={() => onNavigate?.('assignments')}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Review <Clipboard className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
