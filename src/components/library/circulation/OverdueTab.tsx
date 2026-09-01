import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, RefreshCw, Search, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryLoan } from '../../../types/library';

interface OverdueTabProps {
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

export const OverdueTab: React.FC<OverdueTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [overdueLoans, setOverdueLoans] = useState<LibraryLoan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadOverdueLoans();
  }, [currentTenantId]);

  const loadOverdueLoans = async () => {
    setLoading(true);
    try {
      const allLoans = await LibraryCirculationService.getLoans(currentTenantId);
      const nowMs = Date.now();
      const overdues = allLoans.filter(l => {
        if (l.status === 'OVERDUE') return true;
        if (l.status === 'ISSUED' && new Date(l.dueAt).getTime() < nowMs) return true;
        return false;
      });
      setOverdueLoans(overdues);
    } catch (err) {
      console.warn('Failed to load overdue loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunOverdueDetection = async () => {
    setDetecting(true);
    try {
      const result = await LibraryCirculationService.detectAndProcessOverdues(currentTenantId);
      onSuccess(`Overdue detection scan complete. Processed ${result.processedLoansCount} active loans; ${result.newlyOverdueCount} flagged as newly overdue.`);
      loadOverdueLoans();
    } catch (err: any) {
      onError(err.message || 'Overdue detection scan failed.');
    } finally {
      setDetecting(false);
    }
  };

  const calculateOverdueDays = (dueAtStr: string) => {
    const dueMs = new Date(dueAtStr).getTime();
    const nowMs = Date.now();
    return Math.max(0, Math.floor((nowMs - dueMs) / 86400000));
  };

  const filteredOverdues = overdueLoans.filter(l =>
    l.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.membershipNumber && l.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    l.transactionReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            Overdue Register & Borrowing Block Enforcement
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time audit register of items past due date with automated borrowing block enforcement and fine generation.
          </p>
        </div>
        <button
          onClick={handleRunOverdueDetection}
          disabled={detecting}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {detecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Scanning System...
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Run Overdue Detection Scan
            </>
          )}
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search overdue items by Title, Accession #, Member Card..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Overdue Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Active Overdue Loans Register</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
            Total Overdue: {filteredOverdues.length}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
            Loading overdue register...
          </div>
        ) : filteredOverdues.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span>No overdue loans found! All library materials are returned or active within schedule.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Tx Ref</th>
                  <th className="px-4 py-3">Resource Title</th>
                  <th className="px-4 py-3">Accession / Barcode</th>
                  <th className="px-4 py-3">Member Card</th>
                  <th className="px-4 py-3">Original Due Date</th>
                  <th className="px-4 py-3">Overdue Duration</th>
                  <th className="px-4 py-3">Borrowing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOverdues.map(loan => {
                  const days = calculateOverdueDays(loan.dueAt);
                  const isSeverelyOverdue = days >= 14;
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-rose-600">{loan.transactionReference}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{loan.resourceTitle}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{loan.accessionNumber} ({loan.barcode})</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{loan.membershipNumber}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(loan.dueAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-bold text-xs text-rose-700">{days} Days Past Due</td>
                      <td className="px-4 py-3">
                        {isSeverelyOverdue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                            <ShieldAlert className="w-3 h-3" /> Account Blocked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                            Warning Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
