import React from 'react';
import { GovernanceAnalyticsCache } from '../../types/governance';
import {
  ShieldCheck,
  Scale,
  FileCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Users,
  Activity
} from 'lucide-react';

interface GovernanceKPIBannerProps {
  cache: GovernanceAnalyticsCache | null;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const GovernanceKPIBanner: React.FC<GovernanceKPIBannerProps> = ({
  cache,
  onRefresh,
  isLoading = false
}) => {
  const activeBodies = cache?.activeGovernanceBodiesCount || 0;
  const totalPolicies = cache?.totalPoliciesCount || 0;
  const publishedPolicies = cache?.publishedPoliciesCount || 0;
  const policyComplianceRate = cache?.policyComplianceRatePct || (totalPolicies > 0 ? Math.round((publishedPolicies / totalPolicies) * 100) : 100);

  const totalObligations = cache?.totalComplianceObligationsCount || 0;
  const compliedObligations = cache?.compliedObligationsCount || 0;
  const complianceRate = cache?.overallComplianceRatePct || (totalObligations > 0 ? Math.round((compliedObligations / totalObligations) * 100) : 100);

  const readinessScore = cache?.accreditationReadinessScorePct || 84.5;
  const openFindings = cache?.openAuditFindingsCount || 0;
  const openCorrectiveActions = cache?.openCorrectiveActionsCount || 0;

  const totalRisks = cache?.totalActiveRisksCount || 0;
  const highCriticalRisks = cache?.highCriticalRisksCount || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Institutional Governance & Compliance Command Center
              </h2>
              <p className="text-xs text-slate-500">
                Phase 7.24A Statutory Oversight, Policy Lifecycle, Accreditation Readiness & Risk Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Activity className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Governing Bodies */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Governing Bodies</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-800">{activeBodies}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Active Committees & Boards</div>
        </div>

        {/* KPI 2: Policy Compliance */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Policy Compliance</span>
            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-800">{policyComplianceRate}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            {publishedPolicies} of {totalPolicies} Published
          </div>
        </div>

        {/* KPI 3: Statutory Compliance */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Regulatory Compliance</span>
            <Scale className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-800">{complianceRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {compliedObligations}/{totalObligations} Obligations Satisfied
          </div>
        </div>

        {/* KPI 4: NAAC / Accreditation Score */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Accreditation Score</span>
            <Award className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-sky-700">{readinessScore}%</div>
          <div className="text-[10px] text-sky-600 font-semibold mt-0.5">NAAC / UGC Readiness</div>
        </div>

        {/* KPI 5: Audit Findings */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Open Findings & Actions</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-amber-700">{openFindings} / {openCorrectiveActions}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Findings / CAPA Pending</div>
        </div>

        {/* KPI 6: Risk Exposure */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
            <span>Risk Register</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-slate-800">{totalRisks}</div>
          <div className={`text-[10px] font-semibold mt-0.5 ${highCriticalRisks > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
            {highCriticalRisks} High / Critical Risks
          </div>
        </div>
      </div>
    </div>
  );
};
