import React from 'react';
import { useProcurementContext } from './ProcurementContext';
import { TrendingUp, Award, Star } from 'lucide-react';

export const VendorPerformanceTab: React.FC = () => {
  const { vendors, purchaseOrders } = useProcurementContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Vendor Performance & Scorecards</h2>
        <p className="text-xs text-slate-500">Delivery fulfillment rates, quality scores, and vendor scorecards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(v => {
          const vPOs = purchaseOrders.filter(po => po.vendorId === v.id);
          return (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{v.legalName}</h3>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  {v.status}
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-slate-900">{v.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total POs Issued:</span>
                  <span className="font-semibold text-slate-900">{vPOs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment Rate:</span>
                  <span className="font-semibold text-emerald-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Score:</span>
                  <span className="font-semibold text-indigo-600">4.8 / 5.0</span>
                </div>
              </div>
            </div>
          );
        })}
        {vendors.length === 0 && (
          <p className="text-sm text-slate-500 col-span-full text-center py-8">No vendors available for performance scoring.</p>
        )}
      </div>
    </div>
  );
};
