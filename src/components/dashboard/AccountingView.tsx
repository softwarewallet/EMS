import React, { useState } from 'react';
import { TrendingUp, TrendingDown, FileText, ArrowUpRight, ArrowDownRight, Plus, Download } from 'lucide-react';

export const AccountingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expense'>('overview');

  const transactions = [
    { id: 'TXN-984', title: 'Tuition Fee Batch - Class 10 (CBSE)', type: 'income', amount: 365000, date: '2026-08-24', category: 'Tuition', method: 'HDFC Net Banking / UPI' },
    { id: 'TXN-983', title: 'Physics & Chemistry Lab Equipment Batch', type: 'expense', amount: 85400, date: '2026-08-23', category: 'Laboratory', method: 'NEFT Transfer' },
    { id: 'TXN-982', title: 'Faculty & Staff Payroll (Mid-Month)', type: 'expense', amount: 1420000, date: '2026-08-20', category: 'Payroll', method: 'Direct Bank Transfer (SBI)' },
    { id: 'TXN-981', title: 'School Bus Fleet CNG & Annual Maintenance', type: 'expense', amount: 64500, date: '2026-08-19', category: 'Transport', method: 'Corporate Fleet Account' },
    { id: 'TXN-980', title: 'NCERT Textbook & School Uniform Sales', type: 'income', amount: 198000, date: '2026-08-18', category: 'Merchandise', method: 'UPI QR / POS Terminal' },
    { id: 'TXN-979', title: 'Smart Classroom & Cloud ERP License Renewal', type: 'expense', amount: 48000, date: '2026-08-16', category: 'Technology', method: 'Online Net Banking' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Income (Month)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹34,85,000</p>
          <span className="text-2xs text-emerald-600 font-semibold">+14.2% from last month</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Operating Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">₹16,17,900</p>
          <span className="text-2xs text-slate-400">Within allocated annual budget</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Net Operational Surplus</span>
            <p className="text-2xl font-bold text-[#0052FF] mt-1">+₹18,67,100</p>
            <span className="text-2xs text-slate-400">Audited institutional ledger</span>
          </div>
          <button className="px-3 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Record Entry
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Financial Ledger & Accounts</h3>
            <p className="text-xs text-slate-500">Institutional accounting entries and audit-ready journals (INR)</p>
          </div>
          <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export Tally / Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">VOUCHER NO</th>
                <th className="pb-3">DESCRIPTION</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">PAYMENT MODE</th>
                <th className="pb-3">DATE</th>
                <th className="pb-3 text-right">AMOUNT (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-mono text-2xs text-slate-500">{t.id}</td>
                  <td className="py-3.5 font-semibold text-slate-800">{t.title}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-2xs bg-slate-100 text-slate-600 font-medium">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-500">{t.method}</td>
                  <td className="py-3.5 text-slate-500">{t.date}</td>
                  <td className={`py-3.5 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
