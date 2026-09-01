import React, { useState, useEffect } from 'react';
import { Shield, Plus, GitBranch, Edit, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryCirculationPolicy, MembershipType, ResourceType } from '../../../types/library';

interface PolicyGovernanceTabProps {
  currentTenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const PolicyGovernanceTab: React.FC<PolicyGovernanceTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [policies, setPolicies] = useState<LibraryCirculationPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [policyForm, setPolicyForm] = useState({
    name: 'Student Standard Book Policy',
    memberType: 'STUDENT' as MembershipType,
    resourceType: 'BOOK' as ResourceType,
    maxActiveLoans: 5,
    maxRenewalCount: 2,
    standardLoanDurationDays: 14,
    gracePeriodDays: 2,
    fineRatePerDay: 1.0,
    maxFineAmount: 50.0,
    reservationDurationDays: 3,
    overdueBlockThresholdDays: 14,
    lostItemReplacementFeeMultiplier: 1.5
  });

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadPolicies();
  }, [currentTenantId]);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const pList = await LibraryCirculationService.getPolicies(currentTenantId);
      setPolicies(pList);
    } catch (err) {
      console.warn('Failed to load policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    setSubmitting(true);
    try {
      await LibraryCirculationService.createPolicy(
        {
          tenantId: currentTenantId,
          campusId: 'MAIN',
          libraryId: 'MAIN_LIB',
          name: policyForm.name,
          memberType: policyForm.memberType,
          resourceType: policyForm.resourceType,
          maxActiveLoans: policyForm.maxActiveLoans,
          maxRenewalCount: policyForm.maxRenewalCount,
          standardLoanDurationDays: policyForm.standardLoanDurationDays,
          gracePeriodDays: policyForm.gracePeriodDays,
          fineRatePerDay: policyForm.fineRatePerDay,
          maxFineAmount: policyForm.maxFineAmount,
          reservationDurationDays: policyForm.reservationDurationDays,
          overdueBlockThresholdDays: policyForm.overdueBlockThresholdDays,
          lostItemReplacementFeeMultiplier: policyForm.lostItemReplacementFeeMultiplier,
          borrowingEligibility: 'ELIGIBLE',
          createdBy: currentUser.id
        },
        currentUser
      );

      onSuccess(`Created circulation policy '${policyForm.name}' in DRAFT status.`);
      setShowCreateModal(false);
      loadPolicies();
    } catch (err: any) {
      onError(err.message || 'Failed to create policy.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (policy: LibraryCirculationPolicy, newStatus: 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED') => {
    try {
      await LibraryCirculationService.updatePolicyStatus(
        policy.id,
        currentTenantId,
        newStatus,
        currentUser,
        `Status change to ${newStatus}`
      );
      onSuccess(`Updated policy '${policy.name}' status to ${newStatus}. ${newStatus === 'ACTIVE' ? 'Immutable version snapshot saved.' : ''}`);
      loadPolicies();
    } catch (err: any) {
      onError(err.message || 'Failed to update policy status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Circulation Policy & Immutable Versioning Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Govern loan durations, renewal caps, fine rates, and overdue block thresholds. Published policies generate immutable version history snapshots.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Policy Version
        </button>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.length === 0 ? (
          <div className="col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 italic">
            No custom policies configured. System is operating under standard default circulation parameters.
          </div>
        ) : (
          policies.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{p.name}</h3>
                  <p className="text-xs text-slate-500">
                    Member: <span className="font-semibold text-slate-700">{p.memberType}</span> | Resource: <span className="font-semibold text-slate-700">{p.resourceType}</span>
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : p.status === 'SUPERSEDED'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.status} (v{p.version})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
                <div>Max Loans: <strong>{p.maxActiveLoans}</strong></div>
                <div>Loan Duration: <strong>{p.standardLoanDurationDays} Days</strong></div>
                <div>Max Renewals: <strong>{p.maxRenewalCount}</strong></div>
                <div>Grace Period: <strong>{p.gracePeriodDays} Days</strong></div>
                <div>Fine Rate/Day: <strong>${p.fineRatePerDay.toFixed(2)}</strong></div>
                <div>Max Fine Cap: <strong>${p.maxFineAmount.toFixed(2)}</strong></div>
                <div>Overdue Block: <strong>{p.overdueBlockThresholdDays} Days</strong></div>
                <div>Lost Fee Multiplier: <strong>{p.lostItemReplacementFeeMultiplier}x</strong></div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                {p.status !== 'ACTIVE' && (
                  <button
                    onClick={() => handleUpdateStatus(p, 'ACTIVE')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Activate & Publish Version
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Policy */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Draft Circulation Policy</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Policy Name</label>
                <input
                  type="text"
                  value={policyForm.name}
                  onChange={e => setPolicyForm({ ...policyForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Max Active Loans</label>
                  <input
                    type="number"
                    value={policyForm.maxActiveLoans}
                    onChange={e => setPolicyForm({ ...policyForm, maxActiveLoans: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Loan Duration (Days)</label>
                  <input
                    type="number"
                    value={policyForm.standardLoanDurationDays}
                    onChange={e => setPolicyForm({ ...policyForm, standardLoanDurationDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Fine Rate Per Day ($)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={policyForm.fineRatePerDay}
                    onChange={e => setPolicyForm({ ...policyForm, fineRatePerDay: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={policyForm.gracePeriodDays}
                    onChange={e => setPolicyForm({ ...policyForm, gracePeriodDays: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePolicy}
                disabled={submitting || !policyForm.name.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Draft Policy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
