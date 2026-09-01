import React, { useState } from 'react';
import { useStaffContext } from './StaffContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Plus, Search } from 'lucide-react';

interface ComplianceItem {
  id: string;
  staffName: string;
  department: string;
  requirementName: string;
  issueDate: string;
  expiryDate: string;
  status: 'COMPLIANT' | 'EXPIRING_SOON' | 'NON_COMPLIANT';
  verifiedAuthority: string;
}

export const ComplianceTab: React.FC = () => {
  const { staffList } = useStaffContext();

  const [complianceList, setComplianceList] = useState<ComplianceItem[]>([
    {
      id: 'comp_1',
      staffName: 'Dr. Arthur Pendelton',
      department: 'Sciences & Mathematics',
      requirementName: 'Child Safeguarding & Background Police Clearance',
      issueDate: '2025-01-10',
      expiryDate: '2027-01-10',
      status: 'COMPLIANT',
      verifiedAuthority: 'National Police Disclosure Board'
    },
    {
      id: 'comp_2',
      staffName: 'Ms. Clara Oswald',
      department: 'Humanities & Languages',
      requirementName: 'State Teaching License & Board Authorization',
      issueDate: '2023-08-15',
      expiryDate: '2026-09-30',
      status: 'EXPIRING_SOON',
      verifiedAuthority: 'Department of Public Instruction'
    },
    {
      id: 'comp_3',
      staffName: 'Mr. David Tennant',
      department: 'General Administration',
      requirementName: 'Workplace First Aid & CPR Emergency Responder',
      issueDate: '2024-03-01',
      expiryDate: '2026-03-01',
      status: 'NON_COMPLIANT',
      verifiedAuthority: 'Red Cross First Aid Council'
    }
  ]);

  const compliantCount = complianceList.filter((c) => c.status === 'COMPLIANT').length;
  const expiringCount = complianceList.filter((c) => c.status === 'EXPIRING_SOON').length;
  const expiredCount = complianceList.filter((c) => c.status === 'NON_COMPLIANT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Compliance, Authorizations & Expiry Radar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit background screening clearances, state teaching licenses, CPR readiness, and statutory expiry dates.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fully Compliant</span>
            <span className="text-2xl font-bold text-slate-900">{compliantCount} Records</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Expiring (&lt;60 Days)</span>
            <span className="text-2xl font-bold text-slate-900">{expiringCount} Alerts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Overdue / Expired</span>
            <span className="text-2xl font-bold text-slate-900">{expiredCount} Non-Compliant</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Institutional Compliance Ledger</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Employee Name</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Statutory Requirement</th>
                <th className="px-4 py-3.5">Issuing Authority</th>
                <th className="px-4 py-3.5">Valid Until</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complianceList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{item.staffName}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{item.department}</td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-800">{item.requirementName}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{item.verifiedAuthority}</td>
                  <td className="px-4 py-3.5 text-xs font-medium text-slate-700">{item.expiryDate}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        item.status === 'COMPLIANT'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : item.status === 'EXPIRING_SOON'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {item.status}
                    </span>
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
