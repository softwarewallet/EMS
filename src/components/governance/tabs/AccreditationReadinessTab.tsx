import React, { useState } from 'react';
import {
  AccreditationBody,
  AccreditationCycle,
  AccreditationStandard,
  AccreditationCriterion
} from '../../../types/governance';
import {
  Award,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Sliders,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface AccreditationReadinessTabProps {
  bodies: AccreditationBody[];
  cycles: AccreditationCycle[];
  standards: AccreditationStandard[];
  criteria: AccreditationCriterion[];
  onCreateBody: () => void;
  onCreateCycle: () => void;
}

export const AccreditationReadinessTab: React.FC<AccreditationReadinessTabProps> = ({
  bodies,
  cycles,
  standards,
  criteria,
  onCreateBody,
  onCreateCycle
}) => {
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(
    cycles.length > 0 ? cycles[0].id : null
  );

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId) || cycles[0];
  const readinessPct = selectedCycle?.overallReadinessScore || 0;

  // Standard NAAC Criteria
  const naacCriteriaList = [
    { code: 'C1', title: '1. Curricular Aspects', weight: 100, score: 90 },
    { code: 'C2', title: '2. Teaching-Learning and Evaluation', weight: 350, score: 310 },
    { code: 'C3', title: '3. Research, Innovations and Extension', weight: 110, score: 88 },
    { code: 'C4', title: '4. Infrastructure and Learning Resources', weight: 100, score: 85 },
    { code: 'C5', title: '5. Student Support and Progression', weight: 100, score: 82 },
    { code: 'C6', title: '6. Governance, Leadership and Management', weight: 140, score: 125 },
    { code: 'C7', title: '7. Institutional Values and Best Practices', weight: 100, score: 92 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Active Cycle Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-700" />
            Accreditation Readiness & Self-Assessment Engine
          </h3>
          <p className="text-xs text-slate-500">
            NAAC, NBA & NIRF Accreditation self-study cycles, criteria weights, readiness meter & gap analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateBody}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            + Register Body
          </button>
          <button
            onClick={onCreateCycle}
            className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Initiate Review Cycle
          </button>
        </div>
      </div>

      {/* Readiness Score Visual Meter */}
      {selectedCycle ? (
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-sky-300 tracking-wider">
                Active Assessment Cycle
              </span>
              <h2 className="text-xl font-bold mt-1 text-white">{selectedCycle.title}</h2>
              <p className="text-xs text-slate-300">
                Lead Coordinator: {selectedCycle.leadCoordinatorName} • Target Submission: {selectedCycle.expectedSubmissionDate}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">Target Grade</span>
              <span className="text-2xl font-black text-amber-300">{selectedCycle.targetGrade || 'A++'}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-sky-800/60">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-sky-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Overall Institutional Readiness Index
              </span>
              <span className="text-amber-300 font-bold text-sm">{readinessPct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-sky-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${readinessPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% Initial Draft</span>
              <span>50% Mid Self-Study</span>
              <span>80% Quality Target</span>
              <span>100% Ready for SSR Submission</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs space-y-3">
          <p>No accreditation cycle configured.</p>
          <button
            onClick={onCreateCycle}
            className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Accreditation Cycle
          </button>
        </div>
      )}

      {/* NAAC 7-Criteria Weighted Score Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-700" />
              NAAC / RAF Criteria Weights & Readiness Score Breakdown
            </h4>
            <p className="text-xs text-slate-500">
              Detailed assessment across standard 7 criteria parameters for Self-Study Report (SSR).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Total Weight: 1000 Marks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {naacCriteriaList.map((crit) => {
            const pct = Math.round((crit.score / crit.weight) * 100);

            return (
              <div key={crit.code} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{crit.title}</span>
                  <span className="text-xs font-mono font-bold text-sky-700">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Score: {crit.score} / {crit.weight}</span>
                  <span className="text-emerald-700 font-semibold">Compliant</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
