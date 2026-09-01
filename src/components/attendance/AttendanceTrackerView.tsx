import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceDashboardView } from './AttendanceDashboardView';
import { DailyAttendanceWorkspace } from './DailyAttendanceWorkspace';
import { AttendanceHistoryView } from './AttendanceHistoryView';
import { MissingAttendanceView } from './MissingAttendanceView';
import { AttendanceReportsView } from './AttendanceReportsView';
import { AttendanceSettingsView } from './AttendanceSettingsView';
import { AttendancePolicyWorkspace } from './AttendancePolicyWorkspace';
import { LeaveManagementWorkspace } from './LeaveManagementWorkspace';
import { AttendanceShortageView } from './AttendanceShortageView';
import { AttendanceAnalyticsDashboard } from './AttendanceAnalyticsDashboard';
import {
  LayoutDashboard,
  CalendarCheck,
  Grid,
  AlertTriangle,
  FileBarChart,
  Settings,
  ShieldCheck,
  Calendar,
  AlertCircle,
  BarChart3
} from 'lucide-react';


interface AttendanceTrackerViewProps {
  initialTab?: string;
}

export const AttendanceTrackerView: React.FC<AttendanceTrackerViewProps> = ({ initialTab = 'dashboard' }) => {
  const { tenantId, user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [targetClassId, setTargetClassId] = useState<string | undefined>(undefined);
  const [targetSectionId, setTargetSectionId] = useState<string | undefined>(undefined);
  const [targetDate, setTargetDate] = useState<string | undefined>(undefined);
  const [reportsSubTab, setReportsSubTab] = useState<string>('low-attendance');

  // Navigation handlers
  const handleNavigateToRollCall = (classId?: string, sectionId?: string, date?: string) => {
    if (classId) setTargetClassId(classId);
    if (sectionId) setTargetSectionId(sectionId);
    if (date) setTargetDate(date);
    setActiveTab('rollcall');
  };

  const handleNavigateToMissing = () => {
    setActiveTab('missing');
  };

  const handleNavigateToReports = (subTab?: string) => {
    if (subTab) setReportsSubTab(subTab);
    setActiveTab('reports');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rollcall', label: 'Daily Roll Call', icon: CalendarCheck },
    { id: 'history', label: 'Matrix Register', icon: Grid },
    { id: 'missing', label: 'Missing Sessions', icon: AlertTriangle },
    { id: 'policies', label: 'Attendance Policies', icon: ShieldCheck },
    { id: 'leaves', label: 'Leave & Approvals', icon: Calendar },
    { id: 'shortage', label: 'Shortage & Waivers', icon: AlertCircle },
    { id: 'analytics', label: 'Analytics & Intelligence', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Truancy', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Attendance Management & Roster Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Phase 7.1 Enterprise Attendance Engine — Authoritative session roll calls, matrix registers, and auditable corrections
          </p>
        </div>
      </div>

      {/* Primary Tab Navigation Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <AttendanceDashboardView
            onNavigateToRollCall={handleNavigateToRollCall}
            onNavigateToMissing={handleNavigateToMissing}
            onNavigateToReports={handleNavigateToReports}
          />
        )}

        {activeTab === 'rollcall' && (
          <DailyAttendanceWorkspace
            initialClassId={targetClassId}
            initialSectionId={targetSectionId}
            initialDate={targetDate}
          />
        )}

        {activeTab === 'history' && (
          <AttendanceHistoryView
            onSelectSession={(classId, sectionId, date) => {
              setTargetClassId(classId);
              setTargetSectionId(sectionId);
              setTargetDate(date);
              setActiveTab('rollcall');
            }}
          />
        )}

        {activeTab === 'missing' && (
          <MissingAttendanceView
            onNavigateToRollCall={handleNavigateToRollCall}
          />
        )}

        {activeTab === 'policies' && (
          <AttendancePolicyWorkspace tenantId={tenantId || 'tenant_default'} user={user || { id: 'usr_1', email: 'admin@school.edu', displayName: 'Administrator' }} />
        )}

        {activeTab === 'leaves' && (
          <LeaveManagementWorkspace tenantId={tenantId || 'tenant_default'} user={user || { id: 'usr_1', email: 'admin@school.edu', displayName: 'Administrator' }} />
        )}

        {activeTab === 'shortage' && (
          <AttendanceShortageView tenantId={tenantId || 'tenant_default'} user={user || { id: 'usr_1', email: 'admin@school.edu', displayName: 'Administrator' }} />
        )}

        {activeTab === 'analytics' && (
          <AttendanceAnalyticsDashboard tenantId={tenantId || 'tenant_default'} user={user || { id: 'usr_1', email: 'admin@school.edu', displayName: 'Administrator' }} />
        )}

        {activeTab === 'reports' && (
          <AttendanceReportsView
            initialSubTab={reportsSubTab}
          />
        )}

        {activeTab === 'settings' && (
          <AttendanceSettingsView />
        )}
      </div>
    </div>
  );
};
