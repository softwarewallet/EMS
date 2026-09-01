import React, { useEffect, useState } from 'react';
import { User, IndianRupee, Calendar, Clock, RefreshCw, MessageCircle, AlertCircle, Award, CheckSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTenant } from '../../../context/TenantContext';
import { DashboardService } from '../../../services/dashboardService';
import { ParentGovernanceStats } from '../../../types/dashboard';
import { formatCurrency } from '../../../lib/currency';

export const ParentDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const { currentUser } = useAuth();
  const { currentTenant } = useTenant();
  const [stats, setStats] = useState<ParentGovernanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWardIdx, setSelectedWardIdx] = useState(0);

  const loadParentData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    const email = currentUser?.email || 'parent@ems.local';
    const data = await DashboardService.getParentStats(currentTenant.id, email);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadParentData();
  }, [currentTenant, currentUser]);

  if (loading || !stats || (stats.wards || []).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Resolving Parent Portal...</p>
      </div>
    );
  }

  const activeWard = (stats.wards || [])[selectedWardIdx] || (stats.wards || [])[0];

  return (
    <div className="space-y-8" id="parent-dashboard-root">
      {/* Ward Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-2" id="ward-selector-tabs">
        {(stats.wards || []).map((ward, idx) => (
          <button
            key={ward.id}
            onClick={() => setSelectedWardIdx(idx)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
              idx === selectedWardIdx 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {ward.name} ({ward.grade})
          </button>
        ))}
      </div>

      {/* Ward Specific Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="parent-metrics-grid">
        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('attendance')}
          id="ward-attendance"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-3xl font-bold text-slate-800">{activeWard.attendancePercentage}%</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              <span>Present & Active</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('manage_fees')}
          id="ward-fees"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Billing</p>
            <h3 className={`text-3xl font-bold ${activeWard.outstandingFees > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {formatCurrency(activeWard.outstandingFees, 'INR')}
            </h3>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span>{activeWard.outstandingFees > 0 ? 'Billing adjustment pending' : 'All accounts settled'}</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('report_cards')}
          id="ward-performance"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Average</p>
            <h3 className="text-3xl font-bold text-emerald-600">A</h3>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              <span>Continuous Assessment (A)</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
          onClick={() => onNavigate?.('assignments')}
          id="ward-assignments"
        >
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Home Tasks</p>
            <h3 className={`text-3xl font-bold ${activeWard.pendingAssignments > 0 ? 'text-red-600' : 'text-slate-800'}`}>
              {activeWard.pendingAssignments}
            </h3>
            <div className="text-xs text-slate-500 font-medium mt-1">
              <span>Classwork assignments due</span>
            </div>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="parent-main-split">
        
        {/* Academic schedule & details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="ward-schedule-panel">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Ward Active Schedule</h3>
              <p className="text-xs text-slate-400">Next scheduled lesson period for {activeWard.name}</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {activeWard.nextClass}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700">Daily Learning Progression Check</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your ward is currently enrolled in {activeWard.grade}. All daily check-ins, subject periods, and curriculum lessons are tracked under standard academic hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice board */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6" id="parent-notice-panel">
          <h3 className="text-base font-bold text-slate-800 mb-4">Notice Board</h3>
          <div className="space-y-3">
            <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
              <h4 className="text-xs font-bold text-indigo-900 mb-1">Parent-Teacher Consultation</h4>
              <p className="text-[11px] text-indigo-700 leading-relaxed">Scheduled for this Friday at 4:00 PM in the Main Conference Hall.</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-lg">
              <h4 className="text-xs font-bold text-slate-800 mb-1">Science & Technology Exhibition</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Encourage participation in the upcoming multi-campus tech projects.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
