import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { FileText, Plus, CheckCircle, Clock } from 'lucide-react';

export const PurchaseRequisitionsTab: React.FC = () => {
  const { requisitions, createRequisition, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [department, setDepartment] = useState('Academics');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('units');
  const [unitPrice, setUnitPrice] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Main Campus Store');
  const [requiredDate, setRequiredDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity) || 1;
    const price = parseFloat(unitPrice) || 0;
    const total = qty * price;

    await createRequisition({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      department,
      lineItems: [
        {
          id: `li_${Date.now()}`,
          itemName,
          description: itemName,
          quantity: qty,
          unit,
          estimatedUnitPrice: price,
          estimatedTotal: total
        }
      ],
      totalEstimatedAmount: total,
      deliveryLocation,
      requiredDate
    });
    setShowModal(false);
    setItemName('');
    setQuantity('1');
    setUnitPrice('');
    setRequiredDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Purchase Requisitions</h2>
          <p className="text-xs text-slate-500">Formal purchasing requisitions with itemized budget lines</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Create Requisition
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Requisition #</th>
              <th className="p-4">Department</th>
              <th className="p-4">Items / Description</th>
              <th className="p-4">Delivery Location</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {requisitions.map(reqn => (
              <tr key={reqn.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">{reqn.requisitionNumber}</td>
                <td className="p-4">{reqn.department}</td>
                <td className="p-4">
                  {reqn.lineItems.map(li => (
                    <div key={li.id} className="text-xs">
                      {li.itemName} ({li.quantity} {li.unit}) @ ${li.estimatedUnitPrice}
                    </div>
                  ))}
                </td>
                <td className="p-4 text-xs text-slate-600">{reqn.deliveryLocation}</td>
                <td className="p-4 font-semibold text-slate-950">${reqn.totalEstimatedAmount.toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {reqn.status}
                  </span>
                </td>
              </tr>
            ))}
            {requisitions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No purchase requisitions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Purchase Requisition</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name / Specification</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Dell Latitude 5420 Laptop"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Unit Price ($)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={e => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Location</label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={e => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Date</label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={e => setRequiredDate(e.target.value)}
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
                  Save Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
