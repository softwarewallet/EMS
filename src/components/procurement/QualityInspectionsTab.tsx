import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { ShieldCheck, Plus } from 'lucide-react';

export const QualityInspectionsTab: React.FC = () => {
  const { inspections, createInspection, goodsReceipts, currentUser, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [grnId, setGrnId] = useState('');
  const [status, setStatus] = useState<'PASSED' | 'FAILED' | 'PARTIALLY_ACCEPTED'>('PASSED');
  const [findings, setFindings] = useState('All parameters tested and met institutional quality standards.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const grn = goodsReceipts.find(g => g.id === grnId);
    if (!grn) return;

    await createInspection({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      grnId: grn.id,
      poId: grn.poId,
      inspectorId: currentUser.id,
      inspectorName: currentUser.displayName,
      inspectionDate: new Date().toISOString().split('T')[0],
      status,
      findings
    });
    setShowModal(false);
    setFindings('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quality Inspections</h2>
          <p className="text-xs text-slate-500">Inspection reports, specification compliance, and QA verdicts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Log Inspection
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Inspection # & GRN Ref</th>
              <th className="p-4">Inspector</th>
              <th className="p-4">Findings & Notes</th>
              <th className="p-4">Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {inspections.map(insp => (
              <tr key={insp.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {insp.inspectionNumber}
                  <div className="text-xs font-normal text-slate-600">GRN: {insp.grnId}</div>
                </td>
                <td className="p-4 text-xs text-slate-700">{insp.inspectorName}</td>
                <td className="p-4 text-xs text-slate-600">{insp.findings}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    insp.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {insp.status}
                  </span>
                </td>
              </tr>
            ))}
            {inspections.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No quality inspections recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Quality Inspection</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select GRN</label>
                <select
                  required
                  value={grnId}
                  onChange={e => setGrnId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose GRN --</option>
                  {goodsReceipts.map(g => (
                    <option key={g.id} value={g.id}>{g.grnNumber} — {g.vendorName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Verdict</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="PASSED">Passed</option>
                  <option value="FAILED">Failed</option>
                  <option value="PARTIALLY_ACCEPTED">Partially Accepted</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Findings</label>
                <textarea
                  required
                  rows={3}
                  value={findings}
                  onChange={e => setFindings(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  Save Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
