import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { ShoppingBag, Plus, Send, CheckCircle } from 'lucide-react';

export const PurchaseOrdersTab: React.FC = () => {
  const { purchaseOrders, createPO, issuePO, quotations, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [quotationId, setQuotationId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Central Campus Store, Building A');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = quotations.find(qt => qt.id === quotationId);
    if (!q) return;

    await createPO({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      quotationId: q.id,
      vendorId: q.vendorId,
      vendorName: q.vendorName,
      lineItems: q.lineItems.map(li => ({
        itemName: li.itemName,
        quantity: li.quantity,
        unit: li.unit,
        unitPrice: li.unitPrice,
        taxPercent: li.taxPercent,
        totalPrice: li.totalPrice
      })),
      subtotal: q.subtotal,
      totalTax: q.totalTax,
      shippingCharges: q.deliveryCharges,
      totalAmount: q.totalAmount,
      deliveryAddress,
      expectedDeliveryDate,
      paymentTerms: q.paymentTerms,
      warrantyTerms: `${q.warrantyMonths} Months Warranty`
    });
    setShowModal(false);
    setExpectedDeliveryDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Purchase Orders (PO)</h2>
          <p className="text-xs text-slate-500">Authorized commitment orders issued to approved vendors</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Create PO from Quote
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">PO # & Vendor</th>
              <th className="p-4">Delivery Details</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {purchaseOrders.map(po => (
              <tr key={po.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {po.poNumber}
                  <div className="text-xs font-normal text-slate-600">{po.vendorName}</div>
                </td>
                <td className="p-4 text-xs text-slate-600">
                  <div>{po.deliveryAddress}</div>
                  <div className="text-rose-600 font-semibold">Expected: {po.expectedDeliveryDate}</div>
                </td>
                <td className="p-4 font-semibold text-slate-950">${po.totalAmount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    po.status === 'ISSUED' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {po.status === 'APPROVED' && (
                    <button
                      onClick={() => issuePO(po.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold rounded-lg ml-auto"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Issue PO
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {purchaseOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No purchase orders created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Purchase Order from Quotation</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Winning Quotation</label>
                <select
                  required
                  value={quotationId}
                  onChange={e => setQuotationId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose Quotation --</option>
                  {quotations.map(q => (
                    <option key={q.id} value={q.id}>{q.quoteNumber} — {q.vendorName} (${q.totalAmount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  required
                  value={expectedDeliveryDate}
                  onChange={e => setExpectedDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
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
                  Create PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
