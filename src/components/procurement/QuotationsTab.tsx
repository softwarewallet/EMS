import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { FileText, Plus } from 'lucide-react';

export const QuotationsTab: React.FC = () => {
  const { quotations, submitQuotation, rfqs, vendors, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [rfqId, setRfqId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [validityDate, setValidityDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === vendorId);
    const qty = parseFloat(quantity) || 1;
    const price = parseFloat(unitPrice) || 0;
    const subtotal = qty * price;

    await submitQuotation({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      rfqId,
      vendorId,
      vendorName: vendor ? vendor.legalName : 'Unknown Vendor',
      quoteNumber,
      quoteDate: new Date().toISOString().split('T')[0],
      validityDate,
      currency: 'USD',
      lineItems: [
        {
          itemName,
          quantity: qty,
          unit: 'units',
          unitPrice: price,
          totalPrice: subtotal,
          taxPercent: 5,
          discountPercent: 0
        }
      ],
      subtotal,
      totalTax: subtotal * 0.05,
      totalDiscount: 0,
      deliveryCharges: 0,
      totalAmount: subtotal * 1.05,
      deliveryTerms: 'Standard',
      paymentTerms: 'Net 30',
      warrantyMonths: 12
    });
    setShowModal(false);
    setQuoteNumber('');
    setItemName('');
    setQuantity('1');
    setUnitPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vendor Quotations</h2>
          <p className="text-xs text-slate-500">Log and lock competitive vendor bid responses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Log Quotation
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Quote # & Vendor</th>
              <th className="p-4">RFQ Ref</th>
              <th className="p-4">Validity</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {quotations.map(q => (
              <tr key={q.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {q.quoteNumber}
                  <div className="text-xs font-normal text-slate-600">{q.vendorName}</div>
                </td>
                <td className="p-4 text-xs font-mono text-slate-600">{q.rfqId}</td>
                <td className="p-4 text-xs text-slate-600">{q.validityDate}</td>
                <td className="p-4 font-semibold text-slate-950">${q.totalAmount.toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No vendor quotations logged yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Vendor Quotation</h3>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vendor</label>
                <select
                  required
                  value={vendorId}
                  onChange={e => setVendorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.legalName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quotation Number</label>
                <input
                  type="text"
                  required
                  value={quoteNumber}
                  onChange={e => setQuoteNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. QT-2026-998"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={e => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Validity Date</label>
                  <input
                    type="date"
                    required
                    value={validityDate}
                    onChange={e => setValidityDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
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
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
