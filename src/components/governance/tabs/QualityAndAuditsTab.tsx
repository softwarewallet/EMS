import React, { useState } from 'react';
import {
  QualityFramework,
  QualityIndicator,
  InstitutionalAudit,
  AuditFinding,
  CorrectiveAction
} from '../../../types/governance';
import {
  CheckCircle2,
  Plus,
  Search,
  AlertTriangle,
  Award,
  Clock,
  Lock,
  UserCheck,
  FileText,
  BarChart2
} from 'lucide-react';

interface QualityAndAuditsTabProps {
  frameworks: QualityFramework[];
  indicators: QualityIndicator[];
  audits: InstitutionalAudit[];
  findings: AuditFinding[];
  correctiveActions: CorrectiveAction[];
  currentUserId: string;
  onScheduleAudit: () => void;
  onAddFinding: (auditId: string) => void;
  onAddCAPA: (findingId: string) => void;
  onVerifyCAPAClosure: (capa: CorrectiveAction) => void;
}

export const QualityAndAuditsTab: React.FC<QualityAndAuditsTabProps> = ({
  frameworks,
  indicators,
  audits,
  findings,
  correctiveActions,
  currentUserId,
  onScheduleAudit,
  onAddFinding,
  onAddCAPA,
  onVerifyCAPAClosure
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audits' | 'quality'>('audits');

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            Quality Management & Institutional Audit Engine
          </h3>
          <p className="text-xs text-slate-500">
            Internal & external institutional audits, audit findings, corrective actions (CAPA) & quality KPIs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('audits')}
              className={`px-3 py-1 rounded-md transition ${
                activeSubTab === 'audits'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Audits & CAPA ({audits.length})
            </button>
            <button
              onClick={() => setActiveSubTab('quality')}
              className={`px-3 py-1 rounded-md transition ${
                activeSubTab === 'quality'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Quality Indicators ({indicators.length})
            </button>
          </div>

          <button
            onClick={onScheduleAudit}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Schedule Audit
          </button>
        </div>
      </div>

      {/* Subtab 1: Institutional Audits, Findings & CAPA */}
      {activeSubTab === 'audits' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Institutional Audits Log</span>
              <span>{audits.length} Audits Conducted</span>
            </div>

            <div className="divide-y divide-slate-100">
              {audits.map((a) => {
                const auditFindings = findings.filter((f) => f.auditId === a.id);

                return (
                  <div key={a.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {a.code}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{a.title}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                        {a.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{a.summary || a.scope}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                      <span>Auditor: <span className="font-semibold text-slate-700">{a.leadAuditorName}</span></span>
                      <span>Period: {a.startDate} to {a.endDate}</span>
                      <button
                        onClick={() => onAddFinding(a.id)}
                        className="text-amber-700 font-semibold hover:text-amber-800"
                      >
                        + Log Finding
                      </button>
                    </div>

                    {/* Findings & CAPA Sub-Section */}
                    {auditFindings.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Audit Findings & Action Plans ({auditFindings.length})
                        </span>

                        {auditFindings.map((f) => {
                          const findingCAPAs = correctiveActions.filter((c) => c.auditFindingId === f.id);

                          return (
                            <div key={f.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                              <div className="flex items-center justify-between font-bold text-slate-800">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className={`w-3.5 h-3.5 ${f.severity === 'CRITICAL' || f.severity === 'HIGH' ? 'text-rose-500' : 'text-amber-500'}`} />
                                  {f.code}: {f.title}
                                </span>
                                <span className="px-2 py-0.2 rounded text-[10px] bg-slate-200 text-slate-800">
                                  {f.severity} Severity
                                </span>
                              </div>

                              <p className="text-slate-600">{f.description}</p>

                              {/* CAPA List */}
                              {findingCAPAs.map((capa) => {
                                const isAssignee = capa.assigneeId === currentUserId;
                                const canVerify = !isAssignee && capa.status !== 'VERIFIED_CLOSED';

                                return (
                                  <div key={capa.id} className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                                    <div className="flex items-center justify-between font-semibold text-slate-800">
                                      <span>CAPA: {capa.title}</span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                        {capa.status}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                      Assignee: {capa.assigneeName} • Target: {capa.targetCompletionDate}
                                    </p>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                                      <span className="text-slate-400">Resolution: {capa.resolutionNotes || 'In Progress'}</span>
                                      {canVerify && (
                                        <button
                                          onClick={() => onVerifyCAPAClosure(capa)}
                                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                        >
                                          Verify Closure
                                        </button>
                                      )}
                                      {isAssignee && capa.status !== 'VERIFIED_CLOSED' && (
                                        <span className="text-amber-600 font-semibold italic flex items-center gap-1">
                                          <Lock className="w-3 h-3" /> SoD Guard (Assignee cannot self-verify)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              <div className="text-right pt-1">
                                <button
                                  onClick={() => onAddCAPA(f.id)}
                                  className="text-[11px] text-sky-700 font-semibold hover:text-sky-800"
                                >
                                  + Create CAPA Plan
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {audits.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs space-y-3">
                  <p>No institutional audits found.</p>
                  <button
                    onClick={onScheduleAudit}
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Audit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Quality Frameworks & Indicators */}
      {activeSubTab === 'quality' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-sky-700" />
            Quality Management Frameworks & Indicators
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicators.map((ind) => (
              <div key={ind.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{ind.name}</span>
                  <span className="font-mono text-slate-500">{ind.code}</span>
                </div>
                <p className="text-slate-600">{ind.description}</p>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                  <span>Category: {ind.category}</span>
                  <span>Benchmark: <span className="font-semibold text-slate-800">{ind.benchmarkValue}</span></span>
                </div>
              </div>
            ))}

            {indicators.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                No quality indicators configured.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
