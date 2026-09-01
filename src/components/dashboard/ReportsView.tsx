import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, Award, Calendar, FileSpreadsheet } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Academic Analytics & Institutional Reports</h2>
          <p className="text-xs text-slate-500 mt-1">Exportable attendance summaries, grade distribution, and fee audits</p>
        </div>
        <button className="px-4 py-2 bg-[#0052FF] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs">
          <Download className="w-3.5 h-3.5" /> Download Full School PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Attendance Summary Report</h3>
          <p className="text-xs text-slate-500">Average student attendance across all grades for the current academic session.</p>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <span className="text-2xl font-bold text-blue-700">96.8%</span>
            <p className="text-2xs text-blue-600 font-medium mt-0.5">Overall Institutional Attendance</p>
          </div>
          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Term Exam Pass Rates</h3>
          <p className="text-xs text-slate-500">Curriculum assessment performance breakdown by subject departments.</p>
          <div className="p-3 bg-emerald-50 rounded-lg text-center">
            <span className="text-2xl font-bold text-emerald-700">91.4%</span>
            <p className="text-2xs text-emerald-600 font-medium mt-0.5">Average Passing Percentage</p>
          </div>
          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Fee Collection Audit</h3>
          <p className="text-xs text-slate-500">Financial reconciliation of tuition fees collected vs outstanding arrears.</p>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <span className="text-2xl font-bold text-amber-700">80.2%</span>
            <p className="text-2xs text-amber-600 font-medium mt-0.5">Collected Revenue Progress</p>
          </div>
          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};
