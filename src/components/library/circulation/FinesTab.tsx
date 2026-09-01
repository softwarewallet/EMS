import React, { useState, useEffect } from 'react';
import { DollarSign, Search, ShieldCheck, ShieldAlert, ArrowRightLeft, FileText, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryFine, LibraryFineAdjustment } from '../../../types/library';

interface FinesTabProps {
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

export const FinesTab: React.FC<FinesTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [fines, setFines] = useState<LibraryFine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedFine, setSelectedFine] = useState<LibraryFine | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [adjustedAmount, setAdjustedAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadFines();
  }, [currentTenantId]);

  const loadFines = async () => {
    setLoading(true);
    try {
      const fList = await LibraryCirculationService.getFines(currentTenantId);
      setFines(fList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.warn('Failed to load fines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdjustModal = (fine: LibraryFine) => {
    setSelectedFine(fine);
    setAdjustedAmount(0); // Default to full waiver
    setReason('');
    setShowAdjustModal(true);
  };

  const handleConfirmAdjustOrWaive = async () => {
    if (!selectedFine || !reason.trim()) return;

    // Self-approval check warning
    if (selectedFine.createdBy === currentUser.id && adjustedAmount < selectedFine.currentAmount) {
      console.warn('Self-approval warning: Creator modifying fine amount');
    }

    setSubmitting(true);
    try {
      const result = await LibraryCirculationService.adjustOrWaiveFine({
        tenantId: currentTenantId,
        fineId: selectedFine.id,
        adjustedAmount,
        reason: reason.trim(),
        actor: currentUser
      });

      onSuccess(`Successfully ${adjustedAmount === 0 ? 'waived' : 'adjusted'} fine. Waived Amount: $${result.adjustment.amountWaived.toFixed(2)}.`);
      setShowAdjustModal(false);
      setSelectedFine(null);
      loadFines();
    } catch (err: any) {
      onError(err.message || 'Failed to adjust or waive fine.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReferToFinance = async (fine: LibraryFine) => {
    try {
      const updated = await LibraryCirculationService.referFineToFinance(currentTenantId, fine.id, currentUser);
      onSuccess(`Fine $${fine.currentAmount.toFixed(2)} referred to Finance Module. Charge ID: ${updated.financeChargeId}`);
      loadFines();
    } catch (err: any) {
      onError(err.message || 'Failed to refer fine to Finance.');
    }
  };

  const filteredFines = fines.filter(f =>
    (f.memberName && f.memberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.membershipNumber && f.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    f.fineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            Library Fines Ledger & Waiver Governance
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative overdue and damage fine ledgers with mandatory waiver audit logs, self-approval controls, and Phase 7.10 Finance integration.
          </p>
        </div>
        <button
          onClick={loadFines}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Fines Ledger
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search fines by Member Card, Fine Type, or Status..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Fines Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Fines & Penalties Register</h3>
          <span className="text-xs text-slate-500">Total Fines: {filteredFines.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            Loading fines register...
          </div>
        ) : filteredFines.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic">No fine records found in ledger.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Calculated Date</th>
                  <th className="px-4 py-3">Member Card</th>
                  <th className="px-4 py-3">Fine Type</th>
                  <th className="px-4 py-3">Original Fee</th>
                  <th className="px-4 py-3">Current Fee</th>
                  <th className="px-4 py-3">Waived</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFines.map(fine => (
                  <tr key={fine.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(fine.calculatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">{fine.membershipNumber}</td>
                    <td className="px-4 py-3 text-xs font-medium text-indigo-600">{fine.fineType}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">${fine.originalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-xs text-slate-800">${fine.currentAmount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-medium">${fine.amountWaived.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          fine.status === 'WAIVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fine.status === 'REFERRED_TO_FINANCE'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {fine.status !== 'WAIVED' && fine.status !== 'SETTLED' && (
                        <>
                          <button
                            onClick={() => handleOpenAdjustModal(fine)}
                            className="px-2.5 py-1 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded transition-colors"
                          >
                            Waive / Adjust
                          </button>
                          {fine.status !== 'REFERRED_TO_FINANCE' && (
                            <button
                              onClick={() => handleReferToFinance(fine)}
                              className="px-2.5 py-1 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded transition-colors"
                            >
                              Refer to Finance
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Waive or Adjust Fine */}
      {showAdjustModal && selectedFine && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Fine Waiver / Reduction Governance</h3>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
              <div>Member: <strong>{selectedFine.membershipNumber}</strong></div>
              <div>Current Fine Amount: <strong className="text-rose-600">${selectedFine.currentAmount.toFixed(2)}</strong></div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  New Fine Amount ($0.00 for Full Waiver)
                </label>
                <input
                  type="number"
                  min={0}
                  max={selectedFine.currentAmount}
                  step={0.5}
                  value={adjustedAmount}
                  onChange={e => setAdjustedAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Mandatory Waiver / Adjustment Reason
                </label>
                <textarea
                  rows={3}
                  placeholder="State policy context or authorization reason..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdjustOrWaive}
                disabled={submitting || !reason.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Applying Waiver...' : 'Confirm Authorization'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
