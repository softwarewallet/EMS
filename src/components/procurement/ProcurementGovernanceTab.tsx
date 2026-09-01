import React from 'react';
import { useProcurementContext } from './ProcurementContext';
import { Shield, CheckCircle2 } from 'lucide-react';

export const ProcurementGovernanceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Governance & Compliance Audit</h2>
        <p className="text-xs text-slate-500">Regulatory compliance, segregation of duties, and audit trail verification</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          System Hardening & Security Checks
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-sm font-medium text-slate-800">Tenant & Campus Isolation Engine</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-sm font-medium text-slate-800">Anti-Self-Approval Validation</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-sm font-medium text-slate-800">Immutable Audit Trail Logging</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
