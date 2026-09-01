import React from 'react';
import { useStaffContext } from './StaffContext';
import { TrendingUp, Users, PieChart, BarChart3, Award, Calendar, ShieldCheck } from 'lucide-react';

export const WorkforceAnalyticsTab: React.FC = () => {
  const { analytics, staffList, departments } = useStaffContext();

  const totalStaff = analytics?.totalStaff || staffList.length;
  const teachingStaff = analytics?.teachingCount || staffList.filter((s) => s.employmentCategory === 'TEACHING').length;
  const nonTeaching = totalStaff - teachingStaff;

  const permanentCount = staffList.filter((s) => s.employmentType === 'PERMANENT').length;
  const probationCount = staffList.filter((s) => s.employmentType === 'PROBATION').length;
  const contractCount = staffList.filter((s) => s.employmentType === 'CONTRACT').length;

  const femaleCount = staffList.filter((s) => s.gender === 'FEMALE').length;
  const maleCount = staffList.filter((s) => s.gender === 'MALE').length;
  const otherCount = totalStaff - (femaleCount + maleCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Workforce Analytics, Demographics & Capacity Projections
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Macro-level organizational metrics, faculty tenure distribution, gender diversity, and compliance rates.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Staff Headcount</span>
          <span className="text-2xl font-bold text-slate-900 block my-1">{totalStaff}</span>
          <span className="text-xs text-blue-600 font-medium">100% Institutional Capacity</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Teaching Ratio</span>
          <span className="text-2xl font-bold text-slate-900 block my-1">
            {totalStaff > 0 ? Math.round((teachingStaff / totalStaff) * 100) : 0}%
          </span>
          <span className="text-xs text-slate-500">{teachingStaff} Teaching / {nonTeaching} Support</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Compliance Rate</span>
          <span className="text-2xl font-bold text-emerald-600 block my-1">{analytics?.complianceRate || 96}%</span>
          <span className="text-xs text-emerald-700 font-medium">Verified Credentials</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Retention Stability</span>
          <span className="text-2xl font-bold text-slate-900 block my-1">94.8%</span>
          <span className="text-xs text-slate-500">Low turnover rate</span>
        </div>
      </div>

      {/* Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Type Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            Contract Tenure Distribution
          </h4>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">Permanent / Tenured Faculty</span>
                <span className="text-slate-500">{permanentCount} ({totalStaff > 0 ? Math.round((permanentCount / totalStaff) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${totalStaff > 0 ? (permanentCount / totalStaff) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">Probationary Staff</span>
                <span className="text-slate-500">{probationCount} ({totalStaff > 0 ? Math.round((probationCount / totalStaff) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${totalStaff > 0 ? (probationCount / totalStaff) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">Contractual / Visiting</span>
                <span className="text-slate-500">{contractCount} ({totalStaff > 0 ? Math.round((contractCount / totalStaff) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${totalStaff > 0 ? (contractCount / totalStaff) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gender Demographics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Gender Diversity & Inclusion
          </h4>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Female</span>
              <span className="text-2xl font-bold text-slate-900 my-1 block">{femaleCount}</span>
              <span className="text-xs text-slate-400">
                {totalStaff > 0 ? Math.round((femaleCount / totalStaff) * 100) : 0}%
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Male</span>
              <span className="text-2xl font-bold text-slate-900 my-1 block">{maleCount}</span>
              <span className="text-xs text-slate-400">
                {totalStaff > 0 ? Math.round((maleCount / totalStaff) * 100) : 0}%
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Other / Non-Binary</span>
              <span className="text-2xl font-bold text-slate-900 my-1 block">{otherCount}</span>
              <span className="text-xs text-slate-400">
                {totalStaff > 0 ? Math.round((otherCount / totalStaff) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
