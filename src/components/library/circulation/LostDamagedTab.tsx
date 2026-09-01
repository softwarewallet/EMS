import React, { useState, useEffect } from 'react';
import { PackageX, AlertOctagon, Plus, Search, CheckCircle2, RotateCcw, RefreshCw, FileText } from 'lucide-react';
import { LibraryCirculationService } from '../../../services/libraryCirculationService';
import { LibraryLostItem, LibraryDamageReport, DamageSeverity } from '../../../types/library';
import { formatCurrency } from '../../../lib/currency';

interface LostDamagedTabProps {
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

export const LostDamagedTab: React.FC<LostDamagedTabProps> = ({
  currentTenantId,
  currentUser,
  onSuccess,
  onError
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lost' | 'damaged'>('lost');

  const [lostItems, setLostItems] = useState<LibraryLostItem[]>([]);
  const [damageReports, setDamageReports] = useState<LibraryDamageReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State for Reporting Lost / Damaged
  const [showReportLostModal, setShowReportLostModal] = useState<boolean>(false);
  const [showReportDamageModal, setShowReportDamageModal] = useState<boolean>(false);

  const [copyIdentifier, setCopyIdentifier] = useState<string>('');
  const [membershipId, setMembershipId] = useState<string>('');
  const [damageType, setDamageType] = useState<string>('Torn pages');
  const [severity, setSeverity] = useState<DamageSeverity>('MODERATE');
  const [description, setDescription] = useState<string>('');
  const [estimatedCharge, setEstimatedCharge] = useState<number>(15.0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [currentTenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const lostList = await LibraryCirculationService.getLostItems(currentTenantId);
      setLostItems(lostList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      const damageList = await LibraryCirculationService.getDamageReports(currentTenantId);
      setDamageReports(damageList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.warn('Failed to load lost/damaged records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportLost = async () => {
    if (!copyIdentifier.trim() || !membershipId.trim()) return;
    setSubmitting(true);
    try {
      const result = await LibraryCirculationService.reportLostItem({
        tenantId: currentTenantId,
        campusId: 'MAIN',
        libraryId: 'MAIN_LIB',
        copyIdentifier,
        membershipId,
        actor: currentUser
      });

      onSuccess(`Reported lost copy ${result.accessionNumber} (${result.resourceTitle}). Replacement Fee: ${formatCurrency(result.replacementCost * 100, result.currency)}`);
      setShowReportLostModal(false);
      setCopyIdentifier('');
      setMembershipId('');
      loadData();
    } catch (err: any) {
      onError(err.message || 'Failed to report lost item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecoverLost = async (lost: LibraryLostItem) => {
    try {
      const result = await LibraryCirculationService.recoverLostItem(currentTenantId, lost.id, currentUser, 'Recovered during inventory audit');
      onSuccess(`Recovered copy ${lost.accessionNumber} (${lost.resourceTitle}). Copy restored to AVAILABLE state.`);
      loadData();
    } catch (err: any) {
      onError(err.message || 'Failed to recover lost item.');
    }
  };

  const handleReportDamage = async () => {
    if (!copyIdentifier.trim() || !membershipId.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const result = await LibraryCirculationService.reportDamage({
        tenantId: currentTenantId,
        campusId: 'MAIN',
        libraryId: 'MAIN_LIB',
        copyIdentifier,
        membershipId,
        damageType,
        severity,
        description,
        estimatedCharge,
        actor: currentUser
      });

      onSuccess(`Damage report logged for copy ${result.accessionNumber} (${result.resourceTitle}). Copy status set to DAMAGED.`);
      setShowReportDamageModal(false);
      setCopyIdentifier('');
      setMembershipId('');
      setDescription('');
      loadData();
    } catch (err: any) {
      onError(err.message || 'Failed to log damage report.');
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
            <PackageX className="w-6 h-6 text-rose-600" />
            Lost & Damaged Resource Management Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track missing items, assess damage severity, enforce replacement fee multipliers, and manage recovery workflows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportLostModal(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Report Lost Copy
          </button>
          <button
            onClick={() => setShowReportDamageModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Log Copy Damage
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('lost')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'lost' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PackageX className="w-4 h-4" />
          Lost Copies Directory ({lostItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('damaged')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'damaged' ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          Damaged Copies Reports ({damageReports.length})
        </button>
      </div>

      {/* Sub-Tab 1: Lost Items */}
      {activeSubTab === 'lost' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Reported Lost Copies Pipeline</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-rose-600" />
              Loading lost items directory...
            </div>
          ) : lostItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No lost copies currently reported.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Reported At</th>
                    <th className="px-4 py-3">Resource Title</th>
                    <th className="px-4 py-3">Accession / Barcode</th>
                    <th className="px-4 py-3">Replacement Fee</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lostItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(item.reportedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{item.resourceTitle}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{item.accessionNumber} ({item.barcode})</td>
                      <td className="px-4 py-3 font-bold text-xs text-rose-700">{formatCurrency(item.replacementCost * 100, item.currency)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.status === 'RECOVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.status !== 'RECOVERED' && (
                          <button
                            onClick={() => handleRecoverLost(item)}
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                          >
                            Mark Recovered
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
      )}

      {/* Sub-Tab 2: Damaged Items */}
      {activeSubTab === 'damaged' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Logged Copy Damage Assessments</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
              Loading damage reports...
            </div>
          ) : damageReports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">No damaged copies reported.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Reported At</th>
                    <th className="px-4 py-3">Resource Title</th>
                    <th className="px-4 py-3">Accession Number</th>
                    <th className="px-4 py-3">Damage Type</th>
                    <th className="px-4 py-3">Severity</th>
                    <th className="px-4 py-3">Estimated Charge</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {damageReports.map(dmg => (
                    <tr key={dmg.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(dmg.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{dmg.resourceTitle}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{dmg.accessionNumber}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">{dmg.damageType}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                          {dmg.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-xs text-slate-800">{formatCurrency(dmg.estimatedCharge * 100, dmg.currency)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{dmg.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Report Lost Item */}
      {showReportLostModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Report Lost Resource Copy</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Copy Accession # / Barcode
                </label>
                <input
                  type="text"
                  placeholder="Scan Copy Barcode"
                  value={copyIdentifier}
                  onChange={e => setCopyIdentifier(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Responsible Member ID / Card
                </label>
                <input
                  type="text"
                  placeholder="Member Card Number"
                  value={membershipId}
                  onChange={e => setMembershipId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportLostModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReportLost}
                disabled={submitting || !copyIdentifier.trim() || !membershipId.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Reporting...' : 'Confirm Lost Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Log Damage Report */}
      {showReportDamageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Log Physical Copy Damage</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Copy Accession # / Barcode
                </label>
                <input
                  type="text"
                  placeholder="Scan Copy Barcode"
                  value={copyIdentifier}
                  onChange={e => setCopyIdentifier(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Member Card / ID
                </label>
                <input
                  type="text"
                  placeholder="Member Card Number"
                  value={membershipId}
                  onChange={e => setMembershipId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as DamageSeverity)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="MINOR">MINOR</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="MAJOR">MAJOR</option>
                    <option value="UNUSABLE">UNUSABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Est. Repair Charge
                  </label>
                  <input
                    type="number"
                    value={estimatedCharge}
                    onChange={e => setEstimatedCharge(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Damage Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe physical damage..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportDamageModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReportDamage}
                disabled={submitting || !copyIdentifier.trim() || !membershipId.trim() || !description.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
              >
                {submitting ? 'Logging Damage...' : 'Save Damage Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
