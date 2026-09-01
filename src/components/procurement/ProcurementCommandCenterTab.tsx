import React from 'react';
import { useProcurementContext } from './ProcurementContext';
import { ShoppingBag, Users, FileText, ClipboardCheck, Truck, AlertTriangle, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export const ProcurementCommandCenterTab: React.FC = () => {
  const { analytics, requests, purchaseOrders, vendors, setActiveTab } = useProcurementContext();

  const stats = [
    { label: 'Active Vendors', value: vendors.filter(v => v.status === 'ACTIVE' || v.status === 'VERIFIED').length, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Requests', value: analytics?.pendingApprovals || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active POs', value: analytics?.activePOs || 0, icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'YTD Spend', value: `$${(analytics?.totalSpendYTD || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests Awaiting Approval */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Recent Procurement Requests
            </h3>
            <button
              onClick={() => setActiveTab('requests')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                  <p className="text-xs text-slate-500">{req.requestNumber} • {req.requestingDepartment} • Est: ${req.estimatedAmount.toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No procurement requests recorded.</p>
            )}
          </div>
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Active Purchase Orders
            </h3>
            <button
              onClick={() => setActiveTab('purchase_orders')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map(po => (
              <div key={po.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{po.poNumber} — {po.vendorName}</p>
                  <p className="text-xs text-slate-500">Total: ${po.totalAmount.toLocaleString()} • Expected: {po.expectedDeliveryDate}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  {po.status}
                </span>
              </div>
            ))}
            {purchaseOrders.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No purchase orders active.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
