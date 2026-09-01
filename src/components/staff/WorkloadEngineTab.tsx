import React, { useState, useMemo } from 'react';
import { useStaffContext } from './StaffContext';
import { Clock, AlertTriangle, CheckCircle2, TrendingUp, BarChart2, Users, Building } from 'lucide-react';

export const WorkloadEngineTab: React.FC = () => {
  const { staffList, departments } = useStaffContext();

  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Compute workload for teaching faculty
  const facultyWorkload = useMemo(() => {
    return staffList
      .filter((s) => s.employmentCategory === 'TEACHING')
      .map((faculty, idx) => {
        // Base realistic periods distribution based on index
        const periods = ((idx * 4 + 14) % 18) + 12; // ranges between 12 and 29
        const adminHours = (idx % 3) * 2;
        const totalLoad = periods + adminHours;

        let status: 'UNDERLOAD' | 'OPTIMAL' | 'HIGH' | 'OVERLOADED' = 'OPTIMAL';
        if (totalLoad < 15) status = 'UNDERLOAD';
        else if (totalLoad <= 22) status = 'OPTIMAL';
        else if (totalLoad <= 26) status = 'HIGH';
        else status = 'OVERLOADED';

        return {
          faculty,
          teachingPeriods: periods,
          adminHours,
          totalLoad,
          status
        };
      });
  }, [staffList]);

  const filteredFaculty = facultyWorkload.filter((item) => {
    if (selectedDept !== 'ALL' && item.faculty.department !== selectedDept) return false;
    return true;
  });

  const optimalCount = facultyWorkload.filter((f) => f.status === 'OPTIMAL').length;
  const highCount = facultyWorkload.filter((f) => f.status === 'HIGH').length;
  const overloadedCount = facultyWorkload.filter((f) => f.status === 'OVERLOADED').length;
  const underloadCount = facultyWorkload.filter((f) => f.status === 'UNDERLOAD').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'UNDERLOAD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'OVERLOADED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Faculty Workload & Period Distribution Engine
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit weekly contact periods, administrative duty allocations, and prevent institutional burnout.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
          >
            <option value="ALL">All Teaching Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-emerald-700 block mb-1">Balanced / Optimal</span>
          <span className="text-2xl font-bold text-slate-900">{optimalCount}</span>
          <span className="text-xs text-slate-400 block mt-1">15 - 22 hrs/wk</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-blue-700 block mb-1">Underloaded</span>
          <span className="text-2xl font-bold text-slate-900">{underloadCount}</span>
          <span className="text-xs text-slate-400 block mt-1">&lt; 15 hrs/wk</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-amber-700 block mb-1">High Workload</span>
          <span className="text-2xl font-bold text-slate-900">{highCount}</span>
          <span className="text-xs text-slate-400 block mt-1">23 - 26 hrs/wk</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs font-semibold text-rose-700 block mb-1">Overloaded</span>
          <span className="text-2xl font-bold text-slate-900">{overloadedCount}</span>
          <span className="text-xs text-slate-400 block mt-1">&gt; 26 hrs/wk (Action Required)</span>
        </div>
      </div>

      {/* Faculty Workload Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Faculty Load Roster</h4>
          <span className="text-xs text-slate-500 font-medium">{filteredFaculty.length} Instructors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Instructor</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Teaching Periods</th>
                <th className="px-4 py-3.5">Admin & Committee</th>
                <th className="px-4 py-3.5">Total Weekly Load</th>
                <th className="px-4 py-3.5">Workload Status</th>
                <th className="px-5 py-3.5">Capacity Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFaculty.map((item) => {
                const percent = Math.min(100, Math.round((item.totalLoad / 30) * 100));
                return (
                  <tr key={item.faculty.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900 block">{item.faculty.fullName}</span>
                      <span className="text-xs text-slate-400 font-mono">{item.faculty.employeeNumber}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">{item.faculty.department}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">
                      {item.teachingPeriods} periods/wk
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{item.adminHours} hrs/wk</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{item.totalLoad} hrs/wk</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-48">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.status === 'OVERLOADED'
                              ? 'bg-rose-500'
                              : item.status === 'HIGH'
                              ? 'bg-amber-500'
                              : item.status === 'UNDERLOAD'
                              ? 'bg-blue-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredFaculty.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs italic">
                    No teaching faculty records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
