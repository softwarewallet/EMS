import React, { useState } from 'react';
import {
  ComplianceFramework,
  ComplianceObligation,
  ComplianceException
} from '../../../types/governance';
import {
  Scale,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Calendar,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface ComplianceFrameworkTabProps {
  frameworks: ComplianceFramework[];
  obligations: ComplianceObligation[];
  exceptions: ComplianceException[];
  currentUserId: string;
  onCreateFramework: () => void;
  onAddObligation: () => void;
  onRequestException: (obligationId: string) => void;
  onApproveException: (exception: ComplianceException) => void;
}

export const ComplianceFrameworkTab: React.FC<ComplianceFrameworkTabProps> = ({
  frameworks,
  obligations,
  exceptions,
  currentUserId,
  onCreateFramework,
  onAddObligation,
  onRequestException,
  onApproveException
}) => {
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>('ALL');

  const filteredObligations = obligations.filter(
    (o) => selectedFrameworkId === 'ALL' || o.frameworkId === selectedFrameworkId
  );

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            Regulatory & Statutory Compliance Framework Engine
          </h3>
          <p className="text-xs text-slate-500">
            Track statutory obligations, regulatory frameworks (UGC, AICTE, Ministry), evidence links & exception tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateFramework}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            + Add Framework
          </button>
          <button
            onClick={onAddObligation}
            className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Obligation
          </button>
        </div>
      </div>

      {/* Framework Badges Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedFrameworkId('ALL')}
          className={`px-3 py-1.5 rounded-lg border font-semibold shrink-0 transition ${
            selectedFrameworkId === 'ALL'
              ? 'bg-indigo-700 text-white border-indigo-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Frameworks ({obligations.length})
        </button>
        {frameworks.map((fw) => {
          const count = obligations.filter((o) => o.frameworkId === fw.id).length;
          return (
            <button
              key={fw.id}
              onClick={() => setSelectedFrameworkId(fw.id)}
              className={`px-3 py-1.5 rounded-lg border font-semibold shrink-0 transition ${
                selectedFrameworkId === fw.id
                  ? 'bg-indigo-700 text-white border-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {fw.code}: {fw.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Obligations Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Statutory Compliance Obligations Registry</span>
          <span>{filteredObligations.length} Items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Requirement / Code</th>
                <th className="p-3.5">Risk & Frequency</th>
                <th className="p-3.5">Owner & Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredObligations.map((o) => {
                let statusBadge = 'bg-slate-100 text-slate-800';
                if (o.status === 'COMPLIED') statusBadge = 'bg-emerald-100 text-emerald-800';
                else if (o.status === 'OVERDUE' || o.status === 'BREACHED') statusBadge = 'bg-rose-100 text-rose-800';
                else if (o.status === 'IN_PROGRESS' || o.status === 'UNDER_REVIEW') statusBadge = 'bg-amber-100 text-amber-800';

                return (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{o.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{o.code}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 block">{o.riskCategory}</span>
                      <span className="text-[10px] text-slate-500">
                        Severity: <span className="font-semibold">{o.riskSeverityIfBreached}</span> • {o.frequency}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{o.ownerName}</div>
                      <div className="text-[10px] text-slate-500">Due: {o.dueDate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onRequestException(o.id)}
                        className="px-2 py-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded transition"
                      >
                        Request Exception
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredObligations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    <p className="mb-3">No compliance obligations found.</p>
                    <button
                      onClick={onAddObligation}
                      className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Create Compliance Obligation
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Exceptions Drawer/Card */}
      {exceptions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Active Authorized Compliance Exception Requests ({exceptions.length})
              </h4>
              <p className="text-xs text-slate-500">
                Time-bound statutory exceptions subject to independent approval & expiration tracking.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {exceptions.map((ex) => {
              const isRequester = ex.requestedBy === currentUserId;
              const canApprove = !isRequester && ex.status === 'PENDING_APPROVAL';

              return (
                <div key={ex.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{ex.reasonForException}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Requested by {ex.requestedByName} on {ex.requestedAt}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {ex.status}
                    </span>
                  </div>

                  <p className="text-slate-600">
                    <span className="font-semibold">Mitigating Control:</span> {ex.mitigatingControlPlan}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Valid Until: <span className="font-semibold text-slate-800">{ex.expiryDate}</span></span>
                    {canApprove && (
                      <button
                        onClick={() => onApproveException(ex)}
                        className="px-2.5 py-1 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded transition"
                      >
                        Approve Exception
                      </button>
                    )}
                    {isRequester && ex.status === 'PENDING_APPROVAL' && (
                      <span className="text-amber-600 font-semibold italic flex items-center gap-1">
                        <Lock className="w-3 h-3" /> SoD Safeguard (Requester cannot approve self)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
