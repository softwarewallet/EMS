import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Search, Trash2, CheckCircle2, Clock, AlertTriangle, RefreshCw, User, BookOpen } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryReservation, LibraryResource, LibraryMembership } from '../../../types/library';

interface ReservationsTabProps {
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

export const ReservationsTab: React.FC<ReservationsTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [reservations, setReservations] = useState<LibraryReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [resourceCode, setResourceCode] = useState<string>('');
  const [memberCode, setMemberCode] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadReservations();
  }, [currentTenantId]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const resList = await LibraryCirculationService.getReservations(currentTenantId);
      setReservations(resList.sort((a, b) => new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()));
    } catch (err) {
      console.warn('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async () => {
    if (!resourceCode.trim() || !memberCode.trim()) return;
    setSubmitting(true);
    try {
      // Resolve member
      const memberRes = await LibraryCirculationService.resolveBarcodeOrQR(currentTenantId, memberCode);
      if (memberRes.type !== 'MEMBERSHIP' || !memberRes.membership) {
        throw new Error(`Member card '${memberCode}' could not be resolved.`);
      }

      const res = await LibraryCirculationService.createReservation({
        tenantId: currentTenantId,
        campusId: memberRes.membership.campusId || 'MAIN',
        libraryId: memberRes.membership.libraryId || 'MAIN_LIB',
        resourceId: resourceCode.trim(),
        membershipId: memberRes.membership.id,
        actor: currentUser
      });

      onSuccess(`Successfully queued reservation for '${res.resourceTitle}'. Queue Position: #${res.queuePosition}`);
      setShowCreateModal(false);
      setResourceCode('');
      setMemberCode('');
      loadReservations();
    } catch (err: any) {
      onError(err.message || 'Failed to create reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReservation = async (res: LibraryReservation) => {
    try {
      await LibraryCirculationService.cancelReservation(currentTenantId, res.id, currentUser, 'Cancelled by librarian desk');
      onSuccess(`Cancelled reservation for '${res.resourceTitle}'.`);
      loadReservations();
    } catch (err: any) {
      onError(err.message || 'Failed to cancel reservation.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            Resource Reservations & Hold Queues
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Deterministic hold placement and priority reservation queue for high-demand library resources.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Place New Reservation
        </button>
      </div>

      {/* Reservations Register */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Active Reservation Queue</h3>
          <span className="text-xs text-slate-500">Total: {reservations.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
            Loading reservation queue...
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic">No active resource reservations queued.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Queue #</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3">Resource Title</th>
                  <th className="px-4 py-3">Member Card</th>
                  <th className="px-4 py-3">Hold Expiry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((res, index) => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-indigo-600">#{index + 1}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(res.requestedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{res.resourceTitle}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-700">{res.memberId}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {res.holdExpiresAt ? new Date(res.holdExpiresAt).toLocaleDateString() : 'Pending Return'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          res.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'FULFILLED'
                            ? 'bg-blue-100 text-blue-800'
                            : res.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(res.status === 'QUEUED' || res.status === 'REQUESTED' || res.status === 'READY') && (
                        <button
                          onClick={() => handleCancelReservation(res)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded transition-colors"
                        >
                          Cancel Hold
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Place Reservation */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Place Resource Reservation</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Master Resource ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Resource ID (e.g. res_101)"
                  value={resourceCode}
                  onChange={e => setResourceCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Member Card / Barcode
                </label>
                <input
                  type="text"
                  placeholder="Scan Member Card Barcode"
                  value={memberCode}
                  onChange={e => setMemberCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
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
                onClick={handleCreateReservation}
                disabled={submitting || !resourceCode.trim() || !memberCode.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Placing Reservation...' : 'Queue Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
