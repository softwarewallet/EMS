import React from 'react';
import { Building, Users, Activity, BarChart2 } from 'lucide-react';

export const GovernmentDashboard = ({ onNavigate, title }: { onNavigate?: (tab: string) => void, title: string }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('tenants')}>
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-3">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">4,285</h3>
          <p className="text-xs text-slate-500 font-medium">Total Institutions</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('students')}>
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">2.4M</h3>
          <p className="text-xs text-slate-500 font-medium">Total Students</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('reports')}>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">89%</h3>
          <p className="text-xs text-slate-500 font-medium">National Avg Attendance</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate?.('reports')}>
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">65%</h3>
          <p className="text-xs text-slate-500 font-medium">Smart Classroom Adop.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Regional Performance Comparison</h3>
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
             <div className="text-center text-slate-400">
               <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
               <p className="text-sm font-medium">Data visualization rendering...</p>
             </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Policy Compliance Alerts</h3>
          <div className="space-y-4">
            {['District 5: Below minimum infrastructure standard', 'District 12: Missing teacher attendance records', 'District 2: Outstanding inspection reports'].map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-lg">
                 <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                 <p className="text-sm font-medium text-rose-900">{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
