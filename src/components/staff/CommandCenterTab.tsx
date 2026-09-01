import React from 'react';
import { useStaffContext } from './StaffContext';
import {
  Users,
  GraduationCap,
  Briefcase,
  CalendarCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  TrendingUp,
  UserPlus,
  Clock,
  CheckCircle2,
  Building,
  ArrowUpRight
} from 'lucide-react';

interface CommandCenterTabProps {
  onOpenOnboardModal: () => void;
}

export const CommandCenterTab: React.FC<CommandCenterTabProps> = ({ onOpenOnboardModal }) => {
  const { analytics, staffList, departments, setActiveTab, seedDemoData, isLoading } = useStaffContext();

  const totalStaff = analytics?.totalStaff || staffList.length;
  const activeStaff = analytics?.activeStaff || staffList.filter((s) => s.status === 'ACTIVE').length;
  const teachingStaff = analytics?.teachingCount || staffList.filter((s) => s.employmentCategory === 'TEACHING').length;
  const nonTeachingStaff = totalStaff - teachingStaff;
  const onLeaveStaff = analytics?.onLeaveStaff || staffList.filter((s) => s.status === 'ON_LEAVE').length;
  const expiringCerts = analytics?.expiringCertificationsCount || 0;
  const overloadedCount = analytics?.overloadedStaffCount || 0;
  const openCases = analytics?.openHRCasesCount || 0;
  const activeExits = analytics?.activeExitsCount || 0;

  if (totalStaff === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Workforce Records Initialized</h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">
          Initialize your institutional faculty roster, departments, leave entitlements, and compliance tracking.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={seedDemoData}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Seed Sample Faculty & Staff
          </button>
          <button
            onClick={onOpenOnboardModal}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Onboard Single Employee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Workforce Governance & HR Command Center</h2>
          <p className="text-slate-300 text-sm mt-1">
            Real-time faculty allocations, leave balances, compliance monitoring, and appraisal workflows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOnboardModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Onboard Employee
          </button>
          <button
            onClick={() => setActiveTab('leave')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            Leave Ledger
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Staff */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Workforce</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeStaff}</span>
            <span className="text-xs text-slate-500">/ {totalStaff} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span>{teachingStaff} Faculty</span>
            <span>{nonTeachingStaff} Admin/Support</span>
          </div>
        </div>

        {/* On Leave / Active Cover */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On Leave Today</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{onLeaveStaff}</span>
            <span className="text-xs text-amber-600 font-medium">
              {totalStaff > 0 ? Math.round((onLeaveStaff / totalStaff) * 100) : 0}% absent rate
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('substitutions')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              Manage Cover <ArrowUpRight className="w-3 h-3" />
            </button>
            <span>Active Shifts</span>
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Health</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{analytics?.complianceRate || 96}%</span>
            <span className="text-xs text-emerald-600 font-medium">Standards Met</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className={expiringCerts > 0 ? 'text-amber-600 font-medium' : 'text-slate-500'}>
              {expiringCerts} expiring certs
            </span>
            <button
              onClick={() => setActiveTab('compliance')}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Review
            </button>
          </div>
        </div>

        {/* Workload & Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workload & Attention</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{overloadedCount + openCases}</span>
            <span className="text-xs text-rose-600 font-medium">Action Items</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span>{overloadedCount} overloaded</span>
            <span>{openCases} open HR cases</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Department Capacity & Key Focus Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Department Breakdown & Headcount */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-slate-600" />
              <h3 className="text-base font-bold text-slate-900">Departmental Distribution</h3>
            </div>
            <button
              onClick={() => setActiveTab('directory')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => {
              const count = staffList.filter((s) => s.department === dept.name).length;
              const percent = totalStaff > 0 ? Math.round((count / totalStaff) * 100) : 0;
              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{dept.name}</span>
                    <span className="text-slate-500 font-medium text-xs">
                      {count} staff ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {departments.length === 0 && (
              <p className="text-slate-400 text-sm py-4 text-center">No active departments found.</p>
            )}
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Probation Staff</span>
              <span className="text-lg font-bold text-slate-800">
                {staffList.filter((s) => s.employmentType === 'PROBATION').length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Permanent Faculty</span>
              <span className="text-lg font-bold text-slate-800">
                {staffList.filter((s) => s.employmentType === 'PERMANENT').length}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Active Exits</span>
              <span className="text-lg font-bold text-slate-800">{activeExits}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Shortcuts & Quick Hub */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Operational Modules
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => setActiveTab('assignments')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Academic Assignments</span>
                    <span className="text-xs text-slate-500">Period allocations & class teachers</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('workload')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Workload Engine</span>
                    <span className="text-xs text-slate-500">Load hours, prep time & balance</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Performance & Appraisal</span>
                    <span className="text-xs text-slate-500">Annual reviews, self-scores & OKRs</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('exits')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-300 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Staff Offboarding</span>
                    <span className="text-xs text-slate-500">Multi-department asset clearances</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
