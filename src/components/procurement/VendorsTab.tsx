import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { Users, Plus, ShieldCheck, AlertTriangle, Building, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react';

export const VendorsTab: React.FC = () => {
  const { vendors, createVendor, verifyVendor, suspendVendor, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [legalName, setLegalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [vendorType, setVendorType] = useState('DISTRIBUTOR');
  const [category, setCategory] = useState('ACADEMIC');
  const [regNo, setRegNo] = useState('');
  const [taxId, setTaxId] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVendor({
      campusId: selectedCampusId === 'all' ? undefined : selectedCampusId,
      legalName,
      displayName: displayName || legalName,
      vendorType: vendorType as any,
      category: category as any,
      registrationNumber: regNo,
      taxId,
      contactPerson,
      email,
      phone,
      address,
      status: 'ACTIVE'
    });
    setShowModal(false);
    setLegalName('');
    setDisplayName('');
    setRegNo('');
    setTaxId('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vendor Master Directory</h2>
          <p className="text-xs text-slate-500">Authorized suppliers, verification status, and tax compliance</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Onboard Vendor
        </button>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Vendor Name</th>
              <th className="p-4">Category & Type</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {vendors.map(v => (
              <tr key={v.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {v.legalName}
                  <div className="text-xs font-normal text-slate-500">Reg: {v.registrationNumber}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                    {v.category}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{v.vendorType}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {v.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {v.phone}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    v.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                    v.verificationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {v.verificationStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    v.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                    v.status === 'SUSPENDED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {v.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => verifyVendor(v.id, 'VERIFIED')}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg"
                    >
                      Verify
                    </button>
                  )}
                  {v.status !== 'SUSPENDED' && (
                    <button
                      onClick={() => suspendVendor(v.id, 'Administrative suspension')}
                      className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-lg"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No vendors registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Onboard Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Onboard New Vendor</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Business Name</label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Acme Educational Supplies LLC"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Type</label>
                  <select
                    value={vendorType}
                    onChange={e => setVendorType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="MANUFACTURER">Manufacturer</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="WHOLESALER">Wholesaler</option>
                    <option value="SERVICE_PROVIDER">Service Provider</option>
                    <option value="CONTRACTOR">Contractor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="IT">IT & Electronics</option>
                    <option value="LIBRARY">Library</option>
                    <option value="LAB">Laboratory</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="FACILITIES">Facilities</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration No.</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={e => setRegNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tax ID</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <textarea
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={2}
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
