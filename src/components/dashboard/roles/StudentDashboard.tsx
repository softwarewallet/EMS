import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, Clock, Award, RefreshCw, CheckSquare, Clipboard } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTenant } from '../../../context/TenantContext';
import { DashboardService } from '../../../services/dashboardService';
import { StudentAcademicStats } from '../../../types/dashboard';

export const StudentDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const [stats, setStats] = useState<StudentAcademicStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStudentData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    // Use studentId from user metadata or fallback to a default id for beautiful render
    const studentId = currentUser?.metadata?.studentId || 'std_demo_101';
    const data = await DashboardService.getStudentStats(currentTenant.id, studentId);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStudentData();
  }, [currentTenant, currentUser]);

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Resolving Student Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="student-dashboard-root">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="student-metrics-grid">
        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('attendance')}
          id="student-attendance"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Attendance</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.attendancePercentage}%</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              <span>Excellent Standing</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('assignments')}
          id="student-homework"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.pendingAssignmentsCount}</h3>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span>Due this week</span>
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('report_cards')}
          id="student-grade"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest GPA Grade</p>
            <h3 className="text-3xl font-bold text-emerald-600">{stats.latestGrade}</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              <span>Class Percentile: Top 10%</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('routine')}
          id="student-next-class"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Subject</p>
            <h3 className="text-lg font-bold text-slate-800 truncate max-w-[150px]">
              {stats.nextClass?.subject.split(' ')[0] || 'N/A'}
            </h3>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span>At {stats.nextClass?.time.split('-')[0]}</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="student-main-grid">
        
        {/* Today's Timetable / Classes */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="student-timetable-panel">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">My Period Schedule</h3>
              <p className="text-xs text-slate-400">Your daily subject sessions and assigned classrooms</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Today
            </span>
          </div>

          <div className="space-y-3">
            {(stats.todayTimetable || []).map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {item.subject.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{item.subject}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Teacher: {item.teacherName} • Room {item.room}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Homework Task Checklist */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="student-homework-panel">
          <h3 className="text-base font-bold text-slate-800 mb-1">My Homework Assignments</h3>
          <p className="text-xs text-slate-400 mb-6">Active curriculum tasks assigned by your teachers</p>

          <div className="space-y-3">
            {(stats.homeworkTasks || []).map((task) => (
              <div key={task.id} className="p-3 border border-slate-100 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{task.subject}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    task.status === 'graded' ? 'bg-emerald-50 text-emerald-700' : task.status === 'submitted' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Due: {task.dueDate}</span>
                  {task.grade ? (
                    <span className="text-emerald-600">Grade: {task.grade}</span>
                  ) : (
                    task.status === 'pending' && (
                      <button 
                        onClick={() => onNavigate?.('assignments')}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                      >
                        Submit <Clipboard className="w-3 h-3" />
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
