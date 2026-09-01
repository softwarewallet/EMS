import React, { useState } from 'react';
import {
  Layers,
  Clock,
  FileText,
  Grid,
  UserCheck,
  Users,
  AlertTriangle,
  CheckCircle,
  Sliders,
  ShieldAlert,
  FileSpreadsheet,
  Lock,
  Activity,
  Calendar,
  Building,
  ChevronDown
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import {
  ExaminationOperationsProvider,
  useExaminationOperations
} from '../../context/ExaminationOperationsContext';

import { CommandCenterTab } from './CommandCenterTab';
import { SessionsTab } from './SessionsTab';
import { PapersTab } from './PapersTab';
import { SeatingTab } from './SeatingTab';
import { InvigilatorsTab } from './InvigilatorsTab';
import { PresenceTab } from './PresenceTab';
import { IncidentsTab } from './IncidentsTab';
import { ResultReadinessTab } from './ResultReadinessTab';
import { ModerationTab } from './ModerationTab';
import { ExceptionsTab } from './ExceptionsTab';
import { ReportsTab } from './ReportsTab';
import { GovernanceTab } from './GovernanceTab';

interface ExaminationOpsWorkspaceProps {
  currentTenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
}

type TabType =
  | 'command_center'
  | 'sessions'
  | 'papers'
  | 'seating'
  | 'invigilators'
  | 'presence'
  | 'incidents'
  | 'readiness'
  | 'moderation'
  | 'exceptions'
  | 'reports'
  | 'governance';

const WorkspaceContent: React.FC<{
  currentTenantId: string;
  campusId: string;
  mappedUser: any;
}> = ({ currentTenantId, campusId, mappedUser }) => {
  const [activeTab, setActiveTab] = useState<TabType>('command_center');
  const {
    availableExaminations,
    selectedExamination,
    selectExamination,
    academicYears,
    selectedAcademicYear,
    selectAcademicYear,
    isLoading
  } = useExaminationOperations();

  const tabs = [
    { id: 'command_center' as TabType, label: 'Command Center', icon: Layers, description: 'Live operational status and analytics overview.' },
    { id: 'sessions' as TabType, label: 'Sessions', icon: Clock, description: 'Schedule and manage exam day sessions.' },
    { id: 'papers' as TabType, label: 'Papers & Vault', icon: FileText, description: 'Secure questions, codes, and version controls.' },
    { id: 'seating' as TabType, label: 'Seating Plans', icon: Grid, description: 'Coordinate seat layouts and student assignments.' },
    { id: 'invigilators' as TabType, label: 'Invigilators', icon: UserCheck, description: 'Staff assignments, duty rosters, and substitutes.' },
    { id: 'presence' as TabType, label: 'Presence Register', icon: Users, description: 'Take student attendance and record check-ins.' },
    { id: 'incidents' as TabType, label: 'Incident Desk', icon: AlertTriangle, description: 'Log malpractice, disruptions, or emergency reports.' },
    { id: 'readiness' as TabType, label: 'Result Readiness', icon: CheckCircle, description: 'Track score entry completion and validation checks.' },
    { id: 'moderation' as TabType, label: 'Moderation', icon: Sliders, description: 'Administer grace marks, scaling, and adjustments.' },
    { id: 'exceptions' as TabType, label: 'Exceptions', icon: ShieldAlert, description: 'Resolve schema discrepancies and audit flags.' },
    { id: 'reports' as TabType, label: 'Reports', icon: FileSpreadsheet, description: 'Export datesheets, hall registers, and statistics.' },
    { id: 'governance' as TabType, label: 'Governance & Logs', icon: Lock, description: 'Audit trails and compliance tracking.' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                Phase 7.16 Authoritative Control
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
              <Activity className="w-6 h-6 text-indigo-600" />
              Examination Operations Workspace
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Live operational supervision for sessions, seating grids, invigilation rosters, presence rosters, and incident desk.
            </p>
          </div>

          {/* Dynamic Examination & Academic Year Selector Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {/* Academic Year Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select
                value={selectedAcademicYear?.id || ''}
                onChange={e => selectAcademicYear(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                disabled={isLoading}
              >
                {academicYears.map(ay => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.isCurrent ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Examination Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-700">Exam:</span>
              <select
                value={selectedExamination?.id || ''}
                onChange={e => selectExamination(e.target.value)}
                className="px-3 py-1.5 bg-indigo-600 text-white border border-indigo-700 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs shadow-sm"
                disabled={isLoading}
              >
                {availableExaminations.length === 0 && (
                  <option value="">No Examinations Found</option>
                )}
                {availableExaminations.map(ex => (
                  <option key={ex.id} value={ex.id} className="bg-white text-slate-900">
                    {ex.name} ({ex.term || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Horizontal / Sidebar Tabs & View Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Cards */}
        <div className="lg:col-span-1 space-y-3 bg-white p-4 border border-slate-200 rounded-2xl h-fit shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Operations Menu
          </div>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <TabIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab View Canvas Content */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          {activeTab === 'command_center' && (
            <CommandCenterTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
              onNavigateTab={(tab: string) => setActiveTab(tab as TabType)}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'papers' && (
            <PapersTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'seating' && (
            <SeatingTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'invigilators' && (
            <InvigilatorsTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'presence' && (
            <PresenceTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentsTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'readiness' && (
            <ResultReadinessTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'moderation' && (
            <ModerationTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'exceptions' && (
            <ExceptionsTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              tenantId={currentTenantId}
              campusId={campusId}
              currentUser={mappedUser}
            />
          )}

          {activeTab === 'governance' && (
            <GovernanceTab
              tenantId={currentTenantId}
              currentUser={mappedUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const ExaminationOpsWorkspace: React.FC<ExaminationOpsWorkspaceProps> = ({
  currentTenantId,
  currentUser
}) => {
  const { activeCampus } = useTenant();
  const campusId = activeCampus?.id || 'campus_main';

  // Convert the simplified currentUser to the full User type expected by our tabs.
  const mappedUser: any = {
    id: currentUser.id,
    email: currentUser.email,
    displayName: currentUser.displayName,
    status: 'active',
    roleAssignments: currentUser.role ? [{ roleCode: currentUser.role }] : []
  };

  return (
    <ExaminationOperationsProvider tenantId={currentTenantId} campusId={campusId}>
      <WorkspaceContent
        currentTenantId={currentTenantId}
        campusId={campusId}
        mappedUser={mappedUser}
      />
    </ExaminationOperationsProvider>
  );
};
