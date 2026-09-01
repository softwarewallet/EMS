import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Search, AlertCircle, CheckCircle2, RotateCcw, Calendar, FileText } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryLoan, LibraryRenewal } from '../../../types/library';

interface RenewalsTabProps {
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

export const RenewalsTab: React.FC<RenewalsTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [loans, setLoans] = useState<LibraryLoan[]>([]);
  const [renewals, setRenewals] = useState<LibraryRenewal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const activeLoans = await LibraryCirculationService.getLoans(currentTenantId);
      setLoans(activeLoans.filter(l => l.status === 'ISSUED' || l.status === 'OVERDUE'));

      const rList = await LibraryCirculationService.getRenewals(currentTenantId);
      setRenewals(rList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.warn('Failed to load active loans for renewals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewLoan = async (loan: LibraryLoan) => {
    setSubmittingId(loan.id);
    try {
      const result = await LibraryCirculationService.renewLoan({
        tenantId: currentTenantId,
        loanId: loan.id,
        actor: currentUser,
        reason: 'Staff desk renewal'
      });

      onSuccess(`Successfully renewed loan '${loan.resourceTitle}' (Renewal ${result.renewalRecord.renewalNumber}/${loan.maxRenewalsAllowed}). New Due Date: ${new Date(result.updatedLoan.dueAt).toLocaleDateString()}`);
      loadData();
    } catch (err: any) {
      onError(err.message || 'Failed to renew loan.');
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredLoans = loans.filter(l =>
    l.resourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.accessionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.membershipNumber && l.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    l.transactionReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-indigo-600" />
            Controlled Loan Renewal Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Extend active loan due dates subject to policy renewal caps and reservation hold checks.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Active Loans
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Title, Accession #, Barcode, Member Card, or Tx Ref..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Active Loans Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Active Loans Eligible for Renewal</h3>
          <span className="text-xs text-slate-500">Showing {filteredLoans.length} active loans</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            Loading active loans...
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic">No active loans found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Tx Reference</th>
                  <th className="px-4 py-3">Resource Title</th>
                  <th className="px-4 py-3">Accession / Barcode</th>
                  <th className="px-4 py-3">Member Card</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Renewals Used</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map(loan => {
                  const isMaxRenewed = loan.renewalCount >= loan.maxRenewalsAllowed;
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600">{loan.transactionReference}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{loan.resourceTitle}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">{loan.accessionNumber} ({loan.barcode})</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{loan.membershipNumber}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800">{new Date(loan.dueAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded font-semibold ${isMaxRenewed ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                          {loan.renewalCount} / {loan.maxRenewalsAllowed}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRenewLoan(loan)}
                          disabled={isMaxRenewed || submittingId === loan.id}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingId === loan.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="w-3.5 h-3.5" />
                              Extend Due Date
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Renewal History Log */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Historical Renewal Transaction Log
        </h3>

        {renewals.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No historical loan renewals recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Loan ID</th>
                  <th className="px-4 py-3">Renewal #</th>
                  <th className="px-4 py-3">Previous Due</th>
                  <th className="px-4 py-3">New Extended Due</th>
                  <th className="px-4 py-3">Renewed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renewals.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{r.loanId}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-800">#{r.renewalNumber}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(r.previousDueAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-emerald-700">{new Date(r.newDueAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{r.renewedByName || r.renewedBy}</td>
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
