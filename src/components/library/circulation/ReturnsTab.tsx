import React, { useState, useEffect } from 'react';
import { RotateCcw, Barcode, Search, AlertCircle, CheckCircle2, DollarSign, Clock, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryResourceCopy, LibraryLoan, LibraryResource, CopyCondition, LibraryReturn } from '../../../types/library';

interface ReturnsTabProps {
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

export const ReturnsTab: React.FC<ReturnsTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [copyCode, setCopyCode] = useState<string>('');
  const [activeLoan, setActiveLoan] = useState<LibraryLoan | null>(null);
  const [resolvedCopy, setResolvedCopy] = useState<LibraryResourceCopy | null>(null);
  const [resolvedResource, setResolvedResource] = useState<LibraryResource | null>(null);

  const [conditionOnReturn, setConditionOnReturn] = useState<CopyCondition>('GOOD');
  const [notes, setNotes] = useState<string>('');

  const [returnHistory, setReturnHistory] = useState<LibraryReturn[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadReturnHistory();
  }, [currentTenantId]);

  const loadReturnHistory = async () => {
    try {
      const history = await LibraryCirculationService.getReturns(currentTenantId);
      setReturnHistory(history.sort((a, b) => new Date(b.returnedAt).getTime() - new Date(a.returnedAt).getTime()));
    } catch (err) {
      console.warn('Failed to load return history:', err);
    }
  };

  const handleLookupLoanForReturn = async () => {
    if (!copyCode.trim()) return;
    setLoading(true);
    try {
      const scanResult = await LibraryCirculationService.resolveBarcodeOrQR(currentTenantId, copyCode);
      if (scanResult.type !== 'COPY' || !scanResult.copy || !scanResult.resource) {
        throw new Error(`Scanned barcode '${copyCode}' is not a physical copy.`);
      }

      setResolvedCopy(scanResult.copy);
      setResolvedResource(scanResult.resource);

      // Find active loan
      const loans = await LibraryCirculationService.getLoans(currentTenantId);
      const matchedLoan = loans.find(
        l => l.copyId === scanResult.copy!.id && (l.status === 'ISSUED' || l.status === 'OVERDUE')
      );

      if (!matchedLoan) {
        throw new Error(`No active loan found for copy ${scanResult.copy.accessionNumber}. Current copy status is ${scanResult.copy.copyStatus}.`);
      }

      setActiveLoan(matchedLoan);
      setConditionOnReturn(scanResult.copy.condition || 'GOOD');
    } catch (err: any) {
      onError(err.message || 'Loan lookup failed');
      setActiveLoan(null);
      setResolvedCopy(null);
      setResolvedResource(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessReturn = async () => {
    if (!resolvedCopy || !activeLoan) return;
    setSubmitting(true);
    try {
      const result = await LibraryCirculationService.processReturn({
        tenantId: currentTenantId,
        campusId: activeLoan.campusId || 'MAIN',
        libraryId: activeLoan.libraryId || 'MAIN_LIB',
        copyIdentifier: resolvedCopy.id,
        conditionOnReturn,
        actor: currentUser,
        notes
      });

      const fineMsg = result.fine ? ` (Overdue Fine Generated: $${result.fine.currentAmount.toFixed(2)})` : '';
      onSuccess(`Successfully checked in '${resolvedResource?.title}' (Accession: ${resolvedCopy.accessionNumber}). Outcome: ${result.returnRecord.returnOutcome}${fineMsg}`);

      // Reset state and reload
      setCopyCode('');
      setActiveLoan(null);
      setResolvedCopy(null);
      setResolvedResource(null);
      setNotes('');
      loadReturnHistory();
    } catch (err: any) {
      onError(err.message || 'Failed to process return.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateOverdueDays = (dueAtStr: string) => {
    const dueMs = new Date(dueAtStr).getTime();
    const nowMs = Date.now();
    return Math.max(0, Math.floor((nowMs - dueMs) / 86400000));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-indigo-600" />
            Check-In & Return Processing Terminal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative return desk for copy check-in, physical condition grading, automated overdue fine creation, and hold queue fulfillment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Scan Copy Barcode */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Barcode className="w-5 h-5 text-indigo-600" />
            1. Scan Barcode / Accession # for Return
          </h3>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Scan Accession # / Barcode"
                value={copyCode}
                onChange={e => setCopyCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookupLoanForReturn()}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleLookupLoanForReturn}
              disabled={loading || !copyCode.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Find Active Loan'}
            </button>
          </div>

          {activeLoan && resolvedCopy && resolvedResource && (
            <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-200 space-y-3 mt-4">
              <div>
                <span className="text-xs font-medium uppercase text-indigo-500">Active Loan Located</span>
                <p className="font-semibold text-slate-800 text-base">{resolvedResource.title}</p>
                <p className="text-xs text-slate-600">
                  Transaction Ref: <span className="font-mono text-indigo-600 font-semibold">{activeLoan.transactionReference}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-indigo-100 text-slate-600">
                <div>Member Card: <strong>{activeLoan.membershipNumber}</strong></div>
                <div>Issued: <strong>{new Date(activeLoan.issuedAt).toLocaleDateString()}</strong></div>
                <div>Due Date: <strong>{new Date(activeLoan.dueAt).toLocaleDateString()}</strong></div>
                <div>
                  Overdue: <strong className={calculateOverdueDays(activeLoan.dueAt) > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    {calculateOverdueDays(activeLoan.dueAt)} Days
                  </strong>
                </div>
              </div>

              {calculateOverdueDays(activeLoan.dueAt) > 0 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Item is overdue. Overdue fine calculation will execute upon check-in confirmation.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Return Conditions & Confirmation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            2. Condition Assessment & Check-In
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Copy Physical Condition on Return
              </label>
              <select
                value={conditionOnReturn}
                onChange={e => setConditionOnReturn(e.target.value as CopyCondition)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="EXCELLENT">EXCELLENT - Like new condition</option>
                <option value="GOOD">GOOD - Minor normal shelf wear</option>
                <option value="FAIR">FAIR - Moderate binding / page wear</option>
                <option value="POOR">POOR - Heavy wear, requires inspection</option>
                <option value="DAMAGED">DAMAGED - Significant damage / torn pages</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Return Notes / Remarks
              </label>
              <textarea
                rows={2}
                placeholder="Optional return inspection notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleProcessReturn}
            disabled={submitting || !activeLoan || !resolvedCopy}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing Check-In...
              </>
            ) : (
              <>
                Confirm Return & Check-In
              </>
            )}
          </button>
        </div>
      </div>

      {/* Return History Audit Register */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Recent Return Transactions Audit Ledger
        </h3>

        {returnHistory.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No return transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Returned At</th>
                  <th className="px-4 py-3">Copy ID / Accession</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Overdue Days</th>
                  <th className="px-4 py-3">Fine Charged</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Received By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnHistory.map(ret => (
                  <tr key={ret.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(ret.returnedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{ret.copyId}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{ret.conditionOnReturn}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{ret.overdueDays} Days</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                      {ret.fineAmountCalculated > 0 ? `$${ret.fineAmountCalculated.toFixed(2)}` : '$0.00'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${ret.returnOutcome === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ret.returnOutcome}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{ret.receivedByName || ret.receivedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
