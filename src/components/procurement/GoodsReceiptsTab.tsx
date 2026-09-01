import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { Truck, Plus, CheckCircle } from 'lucide-react';

export const GoodsReceiptsTab: React.FC = () => {
  const { goodsReceipts, createGRN, purchaseOrders, currentUser, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [poId, setPoId] = useState('');
  const [receivedLocation, setReceivedLocation] = useState('Central Store');
  const [itemName, setItemName] = useState('');
  const [orderedQty, setOrderedQty] = useState('10');
  const [receivedQty, setReceivedQty] = useState('10');
  const [condition, setCondition] = useState<'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM'>('GOOD');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const ord = parseFloat(orderedQty) || 10;
    const rec = parseFloat(receivedQty) || 10;

    await createGRN({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      poId: po.id,
      poNumber: po.poNumber,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: {
        userId: currentUser.id,
        name: currentUser.displayName
      },
      location: receivedLocation,
      lineItems: [
        {
          itemName: itemName || 'General Item',
          orderedQuantity: ord,
          receivedQuantity: rec,
          rejectedQuantity: ord - rec,
          unit: 'units',
          condition,
          remarks: condition === 'GOOD' ? 'Received in excellent condition' : 'Discrepancy noted'
        }
      ],
      inspectionStatus: condition === 'GOOD' ? 'PASSED' : 'REQUIRES_REVIEW'
    });
    setShowModal(false);
    setItemName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Goods Receipt Note (GRN)</h2>
          <p className="text-xs text-slate-500">Log inward deliveries, quantity verification, and condition reports</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Record GRN
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">GRN # & PO Ref</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Received Date & Location</th>
              <th className="p-4">Inspection Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {goodsReceipts.map(grn => (
              <tr key={grn.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {grn.grnNumber}
                  <div className="text-xs font-normal text-slate-600">PO: {grn.poNumber}</div>
                </td>
                <td className="p-4 font-semibold text-slate-800">{grn.vendorName}</td>
                <td className="p-4 text-xs text-slate-600">
                  <div>Date: {grn.receivedDate}</div>
                  <div>Location: {grn.location}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    grn.inspectionStatus === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {grn.inspectionStatus}
                  </span>
                </td>
              </tr>
            ))}
            {goodsReceipts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No goods receipts recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Record Goods Receipt Note (GRN)</h3>
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
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Science Lab Microscopes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ordered Qty</label>
                  <input
                    type="number"
                    required
                    value={orderedQty}
                    onChange={e => setOrderedQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Received Qty</label>
                  <input
                    type="number"
                    required
                    value={receivedQty}
                    onChange={e => setReceivedQty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="GOOD">Good / Acceptable</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="DEFECTIVE">Defective</option>
                  <option value="WRONG_ITEM">Wrong Item</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  value={receivedLocation}
                  onChange={e => setReceivedLocation(e.target.value)}
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
                  Record GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
