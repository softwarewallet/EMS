import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { FileText, Plus, Send } from 'lucide-react';

export const RFQsTab: React.FC = () => {
  const { rfqs, createRFQ, vendors, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('Standard Delivery to Campus');
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invitedVendors = vendors
      .filter(v => selectedVendorIds.includes(v.id))
      .map(v => ({
        vendorId: v.id,
        vendorName: v.legalName,
        email: v.email,
        status: 'INVITED' as const,
        invitedAt: new Date().toISOString()
      }));

    await createRFQ({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      title,
      description,
      submissionDeadline,
      deliveryTerms,
      paymentTerms,
      invitedVendors
    });
    setShowModal(false);
    setTitle('');
    setDescription('');
    setSelectedVendorIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Requests For Quotation (RFQ)</h2>
          <p className="text-xs text-slate-500">Solicit competitive bids from verified vendor network</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Create RFQ
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">RFQ # & Title</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Terms</th>
              <th className="p-4">Invited Vendors</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {rfqs.map(rfq => (
              <tr key={rfq.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {rfq.rfqNumber}
                  <div className="text-xs font-normal text-slate-600">{rfq.title}</div>
                </td>
                <td className="p-4 text-xs font-semibold text-rose-600">{rfq.submissionDeadline}</td>
                <td className="p-4 text-xs text-slate-600">
                  <div>Delivery: {rfq.deliveryTerms}</div>
                  <div>Payment: {rfq.paymentTerms}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                    {rfq.invitedVendors.length} Vendors Invited
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {rfq.status}
                  </span>
                </td>
              </tr>
            ))}
            {rfqs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No RFQs published yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Request For Quotation (RFQ)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">RFQ Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Annual IT Workstations Procurement"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={submissionDeadline}
                    onChange={e => setSubmissionDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    required
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vendors to Invite</label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-2">
                  {vendors.map(v => (
                    <label key={v.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedVendorIds.includes(v.id)}
                        onChange={e => {
                          if (e.target.checked) setSelectedVendorIds([...selectedVendorIds, v.id]);
                          else setSelectedVendorIds(selectedVendorIds.filter(id => id !== v.id));
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      {v.legalName} ({v.category})
                    </label>
                  ))}
                  {vendors.length === 0 && <p className="text-xs text-slate-500">No active vendors available.</p>}
                </div>
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
                  Publish RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
