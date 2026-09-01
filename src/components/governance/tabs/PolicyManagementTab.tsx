import React, { useState } from 'react';
import { Policy, PolicyVersion } from '../../../types/governance';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  History,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface PolicyManagementTabProps {
  policies: Policy[];
  policyVersions: PolicyVersion[];
  currentUserId: string;
  onDraftPolicy: () => void;
  onApprovePolicy: (policy: Policy) => void;
  onPublishPolicy: (policy: Policy) => void;
  onViewVersions: (policyId: string) => void;
}

export const PolicyManagementTab: React.FC<PolicyManagementTabProps> = ({
  policies,
  policyVersions,
  currentUserId,
  onDraftPolicy,
  onApprovePolicy,
  onPublishPolicy,
  onViewVersions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedPolicyForVersionView, setSelectedPolicyForVersionView] = useState<Policy | null>(null);

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & SoD Notice */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Institutional Policy Lifecycle & Regulatory Registry
            </h3>
            <p className="text-xs text-slate-500">
              Authoritative policy documentation, version control & separation-of-duties approval workflow.
            </p>
          </div>
          <button
            onClick={onDraftPolicy}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Draft New Policy
          </button>
        </div>

        {/* Separation of Duties Guard Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Separation of Duties (SoD) Governance Safeguard Active:</span>
            <span className="ml-1 text-amber-700">
              Policy authors and designated owners are strictly prohibited from self-approving or self-publishing their own policy drafts. Approval must be granted by an authorized independent governance officer or committee chair.
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by policy title, code, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="RETIRED">RETIRED</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
              <option value="FINANCIAL">FINANCIAL</option>
              <option value="HR_STAFF">HR & STAFF</option>
              <option value="STUDENT_AFFAIRS">STUDENT AFFAIRS</option>
              <option value="RESEARCH">RESEARCH</option>
              <option value="IT_SECURITY">IT & SECURITY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Policy Registry Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Code & Title</th>
                <th className="p-3.5">Category & Scope</th>
                <th className="p-3.5">Owner & Approver</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map((p) => {
                const isOwner = p.ownerId === currentUserId;
                const canApprove = !isOwner && p.status === 'PENDING_APPROVAL';
                const canPublish = p.status === 'APPROVED';

                let statusBadge = 'bg-slate-100 text-slate-800';
                if (p.status === 'PUBLISHED') statusBadge = 'bg-emerald-100 text-emerald-800';
                else if (p.status === 'APPROVED') statusBadge = 'bg-sky-100 text-sky-800';
                else if (p.status === 'PENDING_APPROVAL') statusBadge = 'bg-amber-100 text-amber-800';
                else if (p.status === 'UNDER_REVIEW') statusBadge = 'bg-indigo-100 text-indigo-800';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800">{p.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{p.code}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-700 block">{p.category}</span>
                      <span className="text-[10px] text-slate-500">{p.scope}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800">
                        Owner: <span className="font-medium">{p.ownerName}</span>
                      </div>
                      {p.approverName && (
                        <div className="text-[10px] text-slate-500">
                          Approver: {p.approverName}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        v{p.currentVersionNumber}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPolicyForVersionView(p);
                          onViewVersions(p.id);
                        }}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded transition"
                      >
                        Versions
                      </button>

                      {canApprove && (
                        <button
                          onClick={() => onApprovePolicy(p)}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded transition"
                        >
                          Approve
                        </button>
                      )}

                      {canPublish && (
                        <button
                          onClick={() => onPublishPolicy(p)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition"
                        >
                          Publish
                        </button>
                      )}

                      {isOwner && p.status === 'PENDING_APPROVAL' && (
                        <span className="text-[10px] text-amber-600 font-semibold italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> SoD Restricted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredPolicies.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    <p className="mb-3">No policies have been created.</p>
                    <button
                      onClick={onDraftPolicy}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Create Policy
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Policy Version History Modal / Drawer */}
      {selectedPolicyForVersionView && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-sky-700" />
                Version History Audit Trail: {selectedPolicyForVersionView.title}
              </h4>
              <p className="text-xs text-slate-500">
                Immutable records of published policy versions and textual modifications.
              </p>
            </div>
            <button
              onClick={() => setSelectedPolicyForVersionView(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {policyVersions
              .filter((v) => v.policyId === selectedPolicyForVersionView.id)
              .map((v) => (
                <div key={v.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Version {v.versionNumber}</span>
                    <span className="text-[10px] text-slate-500">
                      Published on {v.publishedAt} by {v.publishedByName}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">Changes: {v.summaryOfChanges}</p>
                  {v.content && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 font-mono text-[11px] text-slate-700 max-h-32 overflow-y-auto mt-2">
                      {v.content}
                    </div>
                  )}
                </div>
              ))}

            {policyVersions.filter((v) => v.policyId === selectedPolicyForVersionView.id).length === 0 && (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No formal published version entries recorded yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
