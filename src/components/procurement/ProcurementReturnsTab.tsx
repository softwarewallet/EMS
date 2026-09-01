import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { RotateCcw, Plus } from 'lucide-react';

export const ProcurementReturnsTab: React.FC = () => {
  const { returns, createReturn, purchaseOrders, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [poId, setPoId] = useState('');
  const [reason, setReason] = useState('Damaged items received in shipment');
  const [quantity, setQuantity] = useState('2');
  const [itemDescription, setItemDescription] = useState('');
  const [authorizationRef, setAuthorizationRef] = useState('RMA-9920');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    await createReturn({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      poId: po.id,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      reason,
      quantity: parseFloat(quantity) || 1,
      itemDescription,
      authorizationRef,
      status: 'PENDING'
    });
    setShowModal(false);
    setItemDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Returns & Rejections</h2>
          <p className="text-xs text-slate-500">Manage defective goods returns, vendor credits, and replacements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Log Return
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Return # & PO Ref</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Item & Reason</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {returns.map(ret => (
              <tr key={ret.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {ret.returnNumber}
                  <div className="text-xs font-normal text-slate-600">PO: {ret.poId}</div>
                </td>
                <td className="p-4 font-semibold text-slate-800">{ret.vendorName}</td>
                <td className="p-4 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">{ret.itemDescription} ({ret.quantity} units)</div>
                  <div>Reason: {ret.reason}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    {ret.status}
                  </span>
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No returns logged.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Vendor Return</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Purchase Order</label>
                <select
                  required
                  value={poId}
                  onChange={e => setPoId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="">-- Choose PO --</option>
                  {purchaseOrders.map(p => (
                    <option key={p.id} value={p.id}>{p.poNumber} — {p.vendorName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={e => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RMA / Auth Ref</label>
                  <input
                    type="text"
                    required
                    value={authorizationRef}
                    onChange={e => setAuthorizationRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Return Reason</label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
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
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
