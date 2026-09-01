import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { ClipboardCheck, Plus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const ProcurementRequestsTab: React.FC = () => {
  const { requests, createRequest, submitRequest, approveRequest, rejectRequest, currentUser, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Academics');
  const [category, setCategory] = useState('ACADEMIC');
  const [priority, setPriority] = useState('MEDIUM');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [requiredByDate, setRequiredByDate] = useState('');
  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequest({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      requestingDepartment: department,
      requestedBy: {
        userId: currentUser.id,
        name: currentUser.displayName,
        email: currentUser.email
      },
      category: category as any,
      priority: priority as any,
      title,
      description,
      justification,
      estimatedAmount: parseFloat(estimatedAmount) || 0,
      requiredByDate
    });
    setShowModal(false);
    setTitle('');
    setEstimatedAmount('');
    setDescription('');
    setJustification('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Procurement Requests</h2>
          <p className="text-xs text-slate-500">Initiate and approve departmental purchase requests with anti-self-approval validation</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Request # & Title</th>
              <th className="p-4">Department & Requester</th>
              <th className="p-4">Category & Priority</th>
              <th className="p-4">Estimated Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {req.requestNumber}
                  <div className="text-xs font-normal text-slate-600">{req.title}</div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-semibold text-slate-900">{req.requestingDepartment}</div>
                  <div className="text-xs text-slate-500">{req.requestedBy.name}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                    {req.category}
                  </span>
                  <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    req.priority === 'URGENT' || req.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {req.priority}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-950">${req.estimatedAmount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                    req.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {req.status === 'DRAFT' && (
                    <button
                      onClick={() => submitRequest(req.id)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg"
                    >
                      Submit
                    </button>
                  )}
                  {req.status === 'SUBMITTED' && (
                    <>
                      <button
                        onClick={() => approveRequest(req.id, 'Approved via portal')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id, 'Budget constraints')}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No procurement requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Procurement Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Request Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Science Lab Microscopes Replacement"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    <option value="FACILITIES">Facilities</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={estimatedAmount}
                    onChange={e => setEstimatedAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Required By</label>
                  <input
                    type="date"
                    required
                    value={requiredByDate}
                    onChange={e => setRequiredByDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Justification</label>
                <textarea
                  required
                  rows={2}
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
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
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
