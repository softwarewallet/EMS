import React, { useState } from 'react';
import { StaffProvider, useStaffContext } from './StaffContext';
import { CommandCenterTab } from './CommandCenterTab';
import { StaffDirectoryTab } from './StaffDirectoryTab';
import { AssignmentsTab } from './AssignmentsTab';
import { QualificationsTab } from './QualificationsTab';
import { DocumentsTab } from './DocumentsTab';
import { LeaveManagementTab } from './LeaveManagementTab';
import { WorkloadEngineTab } from './WorkloadEngineTab';
import { SubstitutionsTab } from './SubstitutionsTab';
import { TrainingTab } from './TrainingTab';
import { ComplianceTab } from './ComplianceTab';
import { PerformanceTab } from './PerformanceTab';
import { HRCasesTab } from './HRCasesTab';
import { ExitClearanceTab } from './ExitClearanceTab';
import { WorkforceAnalyticsTab } from './WorkforceAnalyticsTab';
import { GovernanceAuditTab } from './GovernanceAuditTab';
import { OnboardStaffModal } from './OnboardStaffModal';
import { StaffProfileModal } from './StaffProfileModal';
import { User, StaffProfile } from '../../types';
import {
  Users,
  LayoutDashboard,
  GraduationCap,
  Award,
  FileText,
  CalendarCheck,
  Clock,
  UserCheck,
  BookOpen,
  ShieldCheck,
  TrendingUp,
  ShieldAlert,
  LogOut,
  BarChart3,
  Shield,
  Building,
  RefreshCw
} from 'lucide-react';

interface StaffHRWorkspaceProps {
  tenantId: string;
  currentUser: User;
}

const StaffHRWorkspaceInner: React.FC = () => {
  const {
    campuses,
    selectedCampusId,
    setSelectedCampusId,
    activeTab,
    setActiveTab,
    selectedStaff,
    setSelectedStaff,
    refreshAll,
    isLoading
  } = useStaffContext();

  const [showOnboardModal, setShowOnboardModal] = useState<boolean>(false);

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'directory', label: 'Staff Directory', icon: Users },
    { id: 'assignments', label: 'Academic & Duty Allocations', icon: GraduationCap },
    { id: 'qualifications', label: 'Credentials & Skills', icon: Award },
    { id: 'documents', label: 'HR Documents', icon: FileText },
    { id: 'leave', label: 'Leave Ledger', icon: CalendarCheck },
    { id: 'workload', label: 'Workload Engine', icon: Clock },
    { id: 'substitutions', label: 'Class Cover', icon: UserCheck },
    { id: 'training', label: 'Professional Development', icon: BookOpen },
    { id: 'compliance', label: 'Compliance Radar', icon: ShieldCheck },
    { id: 'performance', label: 'Appraisals', icon: TrendingUp },
    { id: 'cases', label: 'HR Cases', icon: ShieldAlert },
    { id: 'exits', label: 'Offboarding', icon: LogOut },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Trail', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls: Campus Switcher & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Staff, HR & Workforce Management
            </h1>
            <p className="text-xs text-slate-500">Phase 7.17 Multi-Campus Governance Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Campus Switcher */}
          {campuses.length > 0 && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCampusId}
                onChange={(e) => setSelectedCampusId(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.isMainCampus ? '(Main Campus)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => refreshAll()}
            disabled={isLoading}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Workforce Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Render */}
      <div className="min-h-[480px]">
        {activeTab === 'overview' && (
          <CommandCenterTab onOpenOnboardModal={() => setShowOnboardModal(true)} />
        )}
        {activeTab === 'directory' && (
          <StaffDirectoryTab
            onOpenOnboardModal={() => setShowOnboardModal(true)}
            onSelectStaff={(staff) => setSelectedStaff(staff)}
          />
        )}
        {activeTab === 'assignments' && <AssignmentsTab />}
        {activeTab === 'qualifications' && <QualificationsTab />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'leave' && <LeaveManagementTab />}
        {activeTab === 'workload' && <WorkloadEngineTab />}
        {activeTab === 'substitutions' && <SubstitutionsTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'compliance' && <ComplianceTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'cases' && <HRCasesTab />}
        {activeTab === 'exits' && <ExitClearanceTab />}
        {activeTab === 'analytics' && <WorkforceAnalyticsTab />}
        {activeTab === 'audit' && <GovernanceAuditTab />}
      </div>

      {/* Onboarding Modal */}
      <OnboardStaffModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
      />

      {/* Staff 360° Profile Modal */}
      <StaffProfileModal
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
      />
    </div>
  );
};

export const StaffHRWorkspace: React.FC<StaffHRWorkspaceProps> = ({ tenantId, currentUser }) => {
  return (
    <StaffProvider tenantId={tenantId} currentUser={currentUser}>
      <StaffHRWorkspaceInner />
    </StaffProvider>
  );
};
