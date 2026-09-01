import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { BarChart3, Plus, CheckCircle } from 'lucide-react';

export const ComparativeStatementsTab: React.FC = () => {
  const { comparativeStatements, createComparison, rfqs, quotations, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [rfqId, setRfqId] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('Lowest compliant bid selected');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quote = quotations.find(q => q.id === selectedQuotationId);
    if (!quote) return;

    await createComparison({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      rfqId,
      entries: [
        {
          vendorId: quote.vendorId,
          vendorName: quote.vendorName,
          quotationId: quote.id,
          totalAmount: quote.totalAmount,
          deliveryDays: 7,
          warrantyMonths: quote.warrantyMonths,
          technicalScore: 90,
          commercialScore: 95,
          weightedScore: 92,
          selected: true,
          selectionNotes: 'Selected as best value compliant bid'
        }
      ],
      recommendedVendorId: quote.vendorId,
      approvalNotes
    });
    setShowModal(false);
    setApprovalNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Comparative Statements & Bid Analysis</h2>
          <p className="text-xs text-slate-500">Weighted scoring and justification for vendor selection</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Generate Statement
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Statement # & RFQ Ref</th>
              <th className="p-4">Recommended Vendor</th>
              <th className="p-4">Approval Notes</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {comparativeStatements.map(cmp => (
              <tr key={cmp.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {cmp.statementNumber}
                  <div className="text-xs font-normal text-slate-600">RFQ: {cmp.rfqId}</div>
                </td>
                <td className="p-4 font-semibold text-emerald-700">
                  {cmp.entries.find(e => e.vendorId === cmp.recommendedVendorId)?.vendorName || 'N/A'}
                </td>
                <td className="p-4 text-xs text-slate-600">{cmp.approvalNotes}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {cmp.status}
                  </span>
                </td>
              </tr>
            ))}
            {comparativeStatements.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No comparative statements found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Generate Comparative Statement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select RFQ</label>
                <select
                  required
                  value={rfqId}
                  onChange={e => setRfqId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose RFQ --</option>
                  {rfqs.map(r => (
                    <option key={r.id} value={r.id}>{r.rfqNumber}: {r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Winning Quotation</label>
                <select
                  required
                  value={selectedQuotationId}
                  onChange={e => setSelectedQuotationId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose Quotation --</option>
                  {quotations.map(q => (
                    <option key={q.id} value={q.id}>{q.quoteNumber} — {q.vendorName} (${q.totalAmount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approval & Justification Notes</label>
                <textarea
                  required
                  rows={3}
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
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
                  Generate Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
