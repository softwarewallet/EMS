import React from 'react';
import { useProcurementContext } from './ProcurementContext';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export const ProcurementAnalyticsTab: React.FC = () => {
  const { analytics } = useProcurementContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Procurement Analytics & Spend Intelligence</h2>
        <p className="text-xs text-slate-500">Comprehensive spend analytics, budget tracking, and request metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase">Total Spend YTD</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">${(analytics?.totalSpendYTD || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase">Total Requests</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.totalRequests || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase">Active Purchase Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.activePOs || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase">Open Exceptions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.openExceptions || 0}</p>
        </div>
      </div>
    </div>
  );
};
