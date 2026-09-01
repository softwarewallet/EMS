import React, { useState } from 'react';
import { InstitutionalRisk, RiskMitigation } from '../../../types/governance';
import { AuditRecord } from '../../../types';
import {
  AlertTriangle,
  Plus,
  ShieldCheck,
  Clock,
  UserCheck,
  FileText,
  Activity,
  Lock,
  ChevronRight
} from 'lucide-react';

interface RiskAndAuditTrailTabProps {
  risks: InstitutionalRisk[];
  mitigations: RiskMitigation[];
  auditLogs: AuditRecord[];
  onAddRisk: () => void;
  onAddMitigation: (riskId: string) => void;
}

export const RiskAndAuditTrailTab: React.FC<RiskAndAuditTrailTabProps> = ({
  risks,
  mitigations,
  auditLogs,
  onAddRisk,
  onAddMitigation
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'risk' | 'audit'>('risk');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Institutional Risk Register & Immutable Audit Trail
          </h3>
          <p className="text-xs text-slate-500">
            Identify institutional risks, severity matrix scoring, mitigation plans & regulatory security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('risk')}
              className={`px-3 py-1 rounded-md transition ${
                activeSubTab === 'risk'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Risk Register ({risks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1 rounded-md transition ${
                activeSubTab === 'audit'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Governance Audit Trail ({auditLogs.length})
            </button>
          </div>

          <button
            onClick={onAddRisk}
            className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Risk
          </button>
        </div>
      </div>

      {/* Subtab 1: Risk Register & Mitigations */}
      {activeSubTab === 'risk' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Institutional Risk Register</span>
              <span>{risks.length} Risks Identified</span>
            </div>

            <div className="divide-y divide-slate-100">
              {risks.map((r) => {
                const score = r.probability * r.impact;
                const riskMitigations = mitigations.filter((m) => m.riskId === r.id);

                let severityBadge = 'bg-slate-100 text-slate-800';
                if (score <= 5) severityBadge = 'bg-emerald-100 text-emerald-800';
                else if (score <= 10) severityBadge = 'bg-amber-100 text-amber-800';
                else if (score <= 15) severityBadge = 'bg-orange-100 text-orange-800';
                else severityBadge = 'bg-rose-100 text-rose-800';

                return (
                  <div key={r.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {r.code}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{r.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Score: <span className="font-bold text-slate-800">{score}</span> (Prob {r.probability} × Imp {r.impact})
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${severityBadge}`}>
                          {r.severityLevel || (score > 15 ? 'CRITICAL' : score > 10 ? 'HIGH' : score > 5 ? 'MEDIUM' : 'LOW')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{r.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                      <span>Category: <span className="font-semibold text-slate-700">{r.category}</span></span>
                      <span>Owner: <span className="font-semibold text-slate-700">{r.riskOwnerName}</span></span>
                      <span>Status: <span className="font-semibold text-slate-700">{r.status}</span></span>
                      <button
                        onClick={() => onAddMitigation(r.id)}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                      >
                        + Add Mitigation Plan
                      </button>
                    </div>

                    {/* Mitigations List */}
                    {riskMitigations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Risk Mitigation Plans ({riskMitigations.length})
                        </span>
                        {riskMitigations.map((m) => {
                          const resScore = (m.residualProbability || 1) * (m.residualImpact || 1);

                          return (
                            <div key={m.id} className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs space-y-1">
                              <div className="flex items-center justify-between font-semibold text-slate-800">
                                <span>{m.title}</span>
                                <span className="text-[10px] font-mono text-emerald-700">
                                  Residual Score: {resScore}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600">{m.description}</p>
                              <div className="text-[10px] text-slate-400">
                                Responsible: {m.responsibleName} • Target: {m.targetCompletionDate}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {risks.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs space-y-3">
                  <p>No institutional risks registered.</p>
                  <button
                    onClick={onAddRisk}
                    className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Risk
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Governance Security Audit Trail */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-700" />
                Immutable Governance Event Audit Trail ({auditLogs.length})
              </h4>
              <p className="text-xs text-slate-500">
                Statutory audit log capturing policy approvals, committee decisions, and compliance changes.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="font-mono text-sky-700 text-[11px]">{log.action}</span>
                    <span>• {log.resourceName || log.resource}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Actor: {log.actorName} ({log.actorId})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {log.result}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {auditLogs.length === 0 && (
              <p className="py-8 text-center text-slate-400 text-xs italic">
                No governance audit records logged in the current session.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
