import React, { useState } from 'react';
import { Barcode, QrCode, Search, CheckCircle2, AlertTriangle, User, BookOpen, Clock, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryResourceCopy, LibraryMembership, LibraryResource, LibraryLoan, MembershipType } from '../../../types/library';

interface IssueScanTabProps {
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

export const IssueScanTab: React.FC<IssueScanTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [memberCode, setMemberCode] = useState<string>('');
  const [copyCode, setCopyCode] = useState<string>('');

  const [resolvedMember, setResolvedMember] = useState<LibraryMembership | null>(null);
  const [resolvedCopy, setResolvedCopy] = useState<LibraryResourceCopy | null>(null);
  const [resolvedResource, setResolvedResource] = useState<LibraryResource | null>(null);

  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    reason?: string;
    activeLoanCount: number;
    unpaidFinesCount: number;
  } | null>(null);

  const [memberLoans, setMemberLoans] = useState<LibraryLoan[]>([]);
  const [loadingMember, setLoadingMember] = useState<boolean>(false);
  const [loadingCopy, setLoadingCopy] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Scan or Lookup Member
  const handleLookupMember = async () => {
    if (!memberCode.trim()) return;
    setLoadingMember(true);
    try {
      const result = await LibraryCirculationService.resolveBarcodeOrQR(currentTenantId, memberCode);
      if (result.type === 'MEMBERSHIP' && result.membership) {
        setResolvedMember(result.membership);
        
        // Check eligibility server-side
        const el = await LibraryCirculationService.validateMemberEligibility(
          currentTenantId,
          result.membership.campusId || 'MAIN',
          result.membership.id,
          'BOOK'
        );
        setEligibility({
          eligible: el.eligible,
          reason: el.reason,
          activeLoanCount: el.activeLoanCount,
          unpaidFinesCount: el.unpaidFinesCount
        });

        // Load member's active loans
        const loans = await LibraryCirculationService.getLoans(currentTenantId);
        setMemberLoans(loans.filter(l => l.membershipId === result.membership!.id && (l.status === 'ISSUED' || l.status === 'OVERDUE')));
      } else {
        onError(`Code '${memberCode}' is a copy barcode, not a member barcode.`);
      }
    } catch (err: any) {
      onError(err.message || 'Failed to resolve member card barcode');
      setResolvedMember(null);
      setEligibility(null);
    } finally {
      setLoadingMember(false);
    }
  };

  // Scan or Lookup Copy
  const handleLookupCopy = async () => {
    if (!copyCode.trim()) return;
    setLoadingCopy(true);
    try {
      const result = await LibraryCirculationService.resolveBarcodeOrQR(currentTenantId, copyCode);
      if (result.type === 'COPY' && result.copy && result.resource) {
        setResolvedCopy(result.copy);
        setResolvedResource(result.resource);
      } else {
        onError(`Code '${copyCode}' is not a physical copy barcode.`);
      }
    } catch (err: any) {
      onError(err.message || 'Failed to resolve physical copy barcode');
      setResolvedCopy(null);
      setResolvedResource(null);
    } finally {
      setLoadingCopy(false);
    }
  };

  // Issue Loan
  const handleIssueLoan = async () => {
    if (!resolvedMember || !resolvedCopy || !resolvedResource) return;
    setSubmitting(true);
    try {
      const newLoan = await LibraryCirculationService.issueLoan({
        tenantId: currentTenantId,
        campusId: resolvedMember.campusId || 'MAIN',
        libraryId: resolvedMember.libraryId || 'MAIN_LIB',
        membershipId: resolvedMember.id,
        copyIdentifier: resolvedCopy.id,
        actor: currentUser,
        idempotencyKey: `issue_${resolvedMember.id}_${resolvedCopy.id}_${Date.now()}`
      });

      onSuccess(`Successfully issued '${resolvedResource.title}' (Accession: ${resolvedCopy.accessionNumber}) to member ${resolvedMember.membershipNumber}. Due Date: ${new Date(newLoan.dueAt).toLocaleDateString()}`);

      // Reset copy and refresh member state
      setCopyCode('');
      setResolvedCopy(null);
      setResolvedResource(null);
      handleLookupMember();
    } catch (err: any) {
      onError(err.message || 'Failed to issue loan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Barcode className="w-6 h-6 text-indigo-600" />
            Barcode & QR Circulation Desk (Issue Loan)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative loan issuance terminal with real-time barcode resolution and strict server-side eligibility enforcement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            System Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Member Card Lookup */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              1. Scan / Enter Member Card
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Scan Member Card Barcode / Membership #"
                value={memberCode}
                onChange={e => setMemberCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookupMember()}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleLookupMember}
              disabled={loadingMember || !memberCode.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loadingMember ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Resolve'}
            </button>
          </div>

          {resolvedMember && eligibility && (
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Member Profile</span>
                  <p className="font-semibold text-slate-800 text-base">{resolvedMember.membershipNumber}</p>
                  <p className="text-xs text-slate-500">
                    Type: <span className="font-medium text-slate-700">{resolvedMember.membershipType}</span> | Status: <span className="font-medium text-emerald-600">{resolvedMember.status}</span>
                  </p>
                </div>
                <div>
                  {eligibility.eligible ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Eligible to Borrow
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                      <ShieldAlert className="w-3.5 h-3.5" /> Borrowing Blocked
                    </span>
                  )}
                </div>
              </div>

              {!eligibility.eligible && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{eligibility.reason}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 text-slate-600">
                <div>Active Loans: <strong className="text-slate-800">{eligibility.activeLoanCount}</strong></div>
                <div>Unpaid Fines: <strong className="text-slate-800">{eligibility.unpaidFinesCount}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Physical Copy Lookup & Issuance Confirmation */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              2. Scan / Enter Physical Resource Copy
            </h3>
            <span className="text-xs text-slate-400">Step 2 of 2</span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Scan Accession # / Barcode / QR Code"
                value={copyCode}
                onChange={e => setCopyCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookupCopy()}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleLookupCopy}
              disabled={loadingCopy || !copyCode.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loadingCopy ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Resolve Copy'}
            </button>
          </div>

          {resolvedCopy && resolvedResource && (
            <div className="mt-4 p-4 rounded-lg bg-indigo-50/50 border border-indigo-200 space-y-3">
              <div>
                <span className="text-xs font-medium uppercase text-indigo-500">Resource Found</span>
                <p className="font-semibold text-slate-800 text-base">{resolvedResource.title}</p>
                <p className="text-xs text-slate-500">
                  Accession: <span className="font-mono text-slate-700">{resolvedCopy.accessionNumber}</span> | Barcode: <span className="font-mono text-slate-700">{resolvedCopy.barcode}</span>
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-indigo-100">
                <span className="text-slate-600">Copy Condition: <strong>{resolvedCopy.condition}</strong></span>
                <span className={`px-2 py-0.5 rounded font-medium ${resolvedCopy.copyStatus === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {resolvedCopy.copyStatus}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleIssueLoan}
            disabled={
              submitting ||
              !resolvedMember ||
              !eligibility?.eligible ||
              !resolvedCopy ||
              (resolvedCopy.copyStatus !== 'AVAILABLE' && resolvedCopy.copyStatus !== 'RESERVED')
            }
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Issuing Loan Transaction...
              </>
            ) : (
              <>
                Confirm Loan Issuance
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Member Active Loans Register */}
      {resolvedMember && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Active Borrowed Items for {resolvedMember.membershipNumber}
          </h3>

          {memberLoans.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No active loans for this member.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Transaction Ref</th>
                    <th className="px-4 py-3">Resource Title</th>
                    <th className="px-4 py-3">Accession / Barcode</th>
                    <th className="px-4 py-3">Issued At</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memberLoans.map(loan => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-semibold">{loan.transactionReference}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{loan.resourceTitle}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">{loan.accessionNumber} ({loan.barcode})</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(loan.issuedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{new Date(loan.dueAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${loan.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}>
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
      )}
    </div>
  );
};
