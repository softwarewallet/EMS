import React from 'react';
import {
  GovernanceAnalyticsCache,
  GovernanceBody,
  Policy,
  ComplianceObligation,
  InstitutionalRisk,
  InstitutionalAudit
} from '../../../types/governance';
import {
  ShieldCheck,
  FileCheck,
  Scale,
  Award,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Plus
} from 'lucide-react';

interface GovernanceAnalyticsTabProps {
  cache: GovernanceAnalyticsCache | null;
  bodies: GovernanceBody[];
  policies: Policy[];
  obligations: ComplianceObligation[];
  risks: InstitutionalRisk[];
  audits: InstitutionalAudit[];
  onQuickAction: (action: string) => void;
}

export const GovernanceAnalyticsTab: React.FC<GovernanceAnalyticsTabProps> = ({
  cache,
  bodies,
  policies,
  obligations,
  risks,
  audits,
  onQuickAction
}) => {
  // Risk Score Matrix helper
  const renderRiskMatrix = () => {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              5x5 Institutional Risk Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Severity = Probability (1-5) × Impact (1-5)
            </p>
          </div>
          <button
            onClick={() => onQuickAction('add_risk')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Log Risk
          </button>
        </div>

        <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-semibold">
          <div className="col-span-1"></div>
          <div className="text-slate-400 py-1">Imp 1</div>
          <div className="text-slate-400 py-1">Imp 2</div>
          <div className="text-slate-400 py-1">Imp 3</div>
          <div className="text-slate-400 py-1">Imp 4</div>
          <div className="text-slate-400 py-1">Imp 5</div>

          {[5, 4, 3, 2, 1].map((prob) => (
            <React.Fragment key={`prob-${prob}`}>
              <div className="text-slate-400 flex items-center justify-end pr-2 font-medium">
                Prob {prob}
              </div>
              {[1, 2, 3, 4, 5].map((imp) => {
                const score = prob * imp;
                const matchedRisks = risks.filter(
                  (r) => r.probability === prob && r.impact === imp
                );
                let bgClass = 'bg-slate-100 text-slate-600';
                if (score <= 5) bgClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                else if (score <= 10) bgClass = 'bg-amber-100 text-amber-800 border-amber-200';
                else if (score <= 15) bgClass = 'bg-orange-100 text-orange-800 border-orange-200';
                else bgClass = 'bg-rose-100 text-rose-800 border-rose-200';

                return (
                  <div
                    key={`cell-${prob}-${imp}`}
                    className={`h-11 rounded border flex flex-col items-center justify-center p-1 transition ${bgClass} ${
                      matchedRisks.length > 0 ? 'ring-2 ring-slate-800 font-bold' : ''
                    }`}
                  >
                    <span>{score}</span>
                    {matchedRisks.length > 0 && (
                      <span className="text-[9px] bg-slate-900 text-white rounded-full px-1.5 py-0.2 mt-0.5">
                        {matchedRisks.length} risk
                      </span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span> Low (1-5)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-500 inline-block"></span> Medium (6-10)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-orange-500 inline-block"></span> High (11-15)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-rose-500 inline-block"></span> Critical (16-25)
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Launchpad & Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix Column */}
        <div className="lg:col-span-2">{renderRiskMatrix()}</div>

        {/* Quick Launchpad */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              Governance Workflows Launcher
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Execute key statutory governance & compliance lifecycle procedures.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onQuickAction('add_committee')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition flex items-center justify-between text-xs font-medium text-slate-700 group"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  Constitute Governing Body / Committee
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition" />
              </button>

              <button
                onClick={() => onQuickAction('add_policy')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition flex items-center justify-between text-xs font-medium text-slate-700 group"
              >
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Draft Institutional Policy Document
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition" />
              </button>

              <button
                onClick={() => onQuickAction('add_obligation')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition flex items-center justify-between text-xs font-medium text-slate-700 group"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  Register Regulatory Compliance Requirement
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition" />
              </button>

              <button
                onClick={() => onQuickAction('schedule_audit')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition flex items-center justify-between text-xs font-medium text-slate-700 group"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Initiate Institutional Audit
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Separation of Duties (SoD) Active</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Committee Roster Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-500" /> Governing Bodies ({bodies.length})
          </h4>
          <div className="space-y-2">
            {bodies.slice(0, 3).map((b) => (
              <div key={b.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{b.name}</div>
                  <div className="text-[10px] text-slate-500">{b.code} • Quorum: {b.quorumRequirement}%</div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {b.status}
                </span>
              </div>
            ))}
            {bodies.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">No governing bodies configured.</p>
            )}
          </div>
        </div>

        {/* Policy Master Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" /> Active Policies ({policies.length})
          </h4>
          <div className="space-y-2">
            {policies.slice(0, 3).map((p) => (
              <div key={p.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="pr-2">
                  <div className="font-semibold text-slate-800 line-clamp-1">{p.title}</div>
                  <div className="text-[10px] text-slate-500">v{p.currentVersionNumber} • {p.code}</div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800 shrink-0">
                  {p.status}
                </span>
              </div>
            ))}
            {policies.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">No policies drafted.</p>
            )}
          </div>
        </div>

        {/* Regulatory Obligations Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-600" /> Statutory Obligations ({obligations.length})
          </h4>
          <div className="space-y-2">
            {obligations.slice(0, 3).map((o) => (
              <div key={o.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="pr-2">
                  <div className="font-semibold text-slate-800 line-clamp-1">{o.title}</div>
                  <div className="text-[10px] text-slate-500">Due: {o.dueDate}</div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                  o.status === 'COMPLIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {o.status}
                </span>
              </div>
            ))}
            {obligations.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">No obligations listed.</p>
            )}
          </div>
        </div>

        {/* Audits & Findings Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" /> Audits ({audits.length})
          </h4>
          <div className="space-y-2">
            {audits.slice(0, 3).map((a) => (
              <div key={a.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="pr-2">
                  <div className="font-semibold text-slate-800 line-clamp-1">{a.title}</div>
                  <div className="text-[10px] text-slate-500">{a.code} • {a.type}</div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800 shrink-0">
                  {a.status}
                </span>
              </div>
            ))}
            {audits.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">No audits conducted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
