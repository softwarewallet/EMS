import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { ShieldCheck, Plus } from 'lucide-react';

export const ContractsTab: React.FC = () => {
  const { contracts, createContract, vendors, currentUser, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [contractValue, setContractValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === vendorId);

    await createContract({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      title,
      vendorId,
      vendorName: vendor ? vendor.legalName : 'Unknown Vendor',
      effectiveDate,
      expiryDate,
      contractValue: parseFloat(contractValue) || 0,
      status: 'ACTIVE',
      owner: currentUser.displayName
    });
    setShowModal(false);
    setTitle('');
    setContractValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Procurement Contracts & SLAs</h2>
          <p className="text-xs text-slate-500">Manage binding agreements, expiration tracking, and service level terms</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Register Contract
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Contract # & Title</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Validity Period</th>
              <th className="p-4">Contract Value</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {contracts.map(cnt => (
              <tr key={cnt.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {cnt.contractNumber}
                  <div className="text-xs font-normal text-slate-600">{cnt.title}</div>
                </td>
                <td className="p-4 font-semibold text-slate-800">{cnt.vendorName}</td>
                <td className="p-4 text-xs text-slate-600">
                  <div>From: {cnt.effectiveDate}</div>
                  <div className="text-rose-600 font-semibold">Expiry: {cnt.expiryDate}</div>
                </td>
                <td className="p-4 font-semibold text-slate-950">${cnt.contractValue.toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {cnt.status}
                  </span>
                </td>
              </tr>
            ))}
            {contracts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No active contracts registered.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Register Procurement Contract</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Annual Campus Security Services SLA"
                />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={effectiveDate}
                    onChange={e => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Contract Value ($)</label>
                <input
                  type="number"
                  required
                  value={contractValue}
                  onChange={e => setContractValue(e.target.value)}
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
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
