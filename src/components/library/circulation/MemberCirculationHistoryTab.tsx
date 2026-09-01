import React, { useState } from 'react';
import { UserCheck, Search, Clock, DollarSign, Bookmark, RefreshCw, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryMembership, LibraryLoan, LibraryFine, LibraryReservation } from '../../../types/library';

interface MemberCirculationHistoryTabProps {
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

export const MemberCirculationHistoryTab: React.FC<MemberCirculationHistoryTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [memberCode, setMemberCode] = useState<string>('');
  const [membership, setMembership] = useState<LibraryMembership | null>(null);

  const [loans, setLoans] = useState<LibraryLoan[]>([]);
  const [fines, setFines] = useState<LibraryFine[]>([]);
  const [reservations, setReservations] = useState<LibraryReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLookupMemberHistory = async () => {
    if (!memberCode.trim()) return;
    setLoading(true);
    try {
      const scanResult = await LibraryCirculationService.resolveBarcodeOrQR(currentTenantId, memberCode);
      if (scanResult.type !== 'MEMBERSHIP' || !scanResult.membership) {
        throw new Error(`Scanned card '${memberCode}' is not a valid member barcode.`);
      }

      setMembership(scanResult.membership);

      // Load member's full loans history
      const allLoans = await LibraryCirculationService.getLoans(currentTenantId);
      setLoans(allLoans.filter(l => l.membershipId === scanResult.membership!.id));

      // Load member's fines
      const allFines = await LibraryCirculationService.getFines(currentTenantId);
      setFines(allFines.filter(f => f.membershipId === scanResult.membership!.id));

      // Load member's reservations
      const allRes = await LibraryCirculationService.getReservations(currentTenantId);
      setReservations(allRes.filter(r => r.membershipId === scanResult.membership!.id));
    } catch (err: any) {
      onError(err.message || 'Failed to lookup member circulation history.');
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-600" />
          Member Circulation History & Status Terminal
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Complete individual borrowing history, current active loans, pending holds, and outstanding fine balances.
        </p>

        <div className="mt-4 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Scan / Enter Member Card Number..."
              value={memberCode}
              onChange={e => setMemberCode(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookupMemberHistory()}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleLookupMemberHistory}
            disabled={loading || !memberCode.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Lookup Ledger'}
          </button>
        </div>
      </div>

      {membership && (
        <div className="space-y-6">
          {/* Member Card Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs uppercase font-medium text-slate-400">Member Card #</span>
              <p className="text-lg font-bold text-slate-800">{membership.membershipNumber}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-medium text-slate-400">Membership Type</span>
              <p className="text-sm font-semibold text-indigo-600">{membership.membershipType}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-medium text-slate-400">Eligibility Status</span>
              <p className="text-sm font-semibold text-emerald-600">{membership.eligibilityStatus}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-medium text-slate-400">Unpaid Fines Total</span>
              <p className="text-lg font-bold text-rose-600">
                ${fines.filter(f => f.status === 'CALCULATED' || f.status === 'PENDING').reduce((acc, f) => acc + f.currentAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Member Loans History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Borrowing Loans History ({loans.length})
            </div>
            {loans.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 italic">No loan records for this member.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tx Ref</th>
                      <th className="px-4 py-3">Resource Title</th>
                      <th className="px-4 py-3">Accession Number</th>
                      <th className="px-4 py-3">Issued Date</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Returned At</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loans.map(loan => (
                      <tr key={loan.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">{loan.transactionReference}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{loan.resourceTitle}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-600">{loan.accessionNumber}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{new Date(loan.issuedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{new Date(loan.dueAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {loan.returnedAt ? new Date(loan.returnedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${loan.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
