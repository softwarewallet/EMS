import React, { useState } from 'react';
import { useProcurementContext } from './ProcurementContext';
import { AlertTriangle, Plus } from 'lucide-react';

export const ExceptionsTab: React.FC = () => {
  const { exceptions, createException, currentUser, selectedCampusId } = useProcurementContext();
  const [showModal, setShowModal] = useState(false);

  const [exceptionType, setExceptionType] = useState<'SINGLE_SOURCE' | 'EMERGENCY' | 'QUOTATION_WAIVER'>('SINGLE_SOURCE');
  const [justification, setJustification] = useState('Urgent requirement for specialized lab equipment unavailable from alternate vendors.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createException({
      campusId: selectedCampusId === 'all' ? 'campus_main' : selectedCampusId,
      exceptionType,
      referenceType: 'REQUEST',
      referenceId: 'req_dummy_1',
      referenceNumber: 'PRQ-2026-999',
      justification,
      authorizedBy: {
        userId: currentUser.id,
        name: currentUser.displayName
      },
      severity: 'HIGH'
    });
    setShowModal(false);
    setJustification('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Procurement Exceptions & Waivers</h2>
          <p className="text-xs text-slate-500">Log single-source justifications, emergency purchases, and policy overrides</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Log Exception
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
              <th className="p-4">Exception # & Type</th>
              <th className="p-4">Reference</th>
              <th className="p-4">Justification & Auth</th>
              <th className="p-4">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {exceptions.map(exc => (
              <tr key={exc.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">
                  {exc.exceptionNumber}
                  <div className="text-xs font-semibold text-amber-600 mt-0.5">{exc.exceptionType}</div>
                </td>
                <td className="p-4 text-xs font-mono text-slate-600">{exc.referenceNumber}</td>
                <td className="p-4 text-xs text-slate-600">
                  <div>{exc.justification}</div>
                  <div className="text-slate-400 mt-1">Authorized by: {exc.authorizedBy.name}</div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
                    {exc.severity}
                  </span>
                </td>
              </tr>
            ))}
            {exceptions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No exceptions logged.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Procurement Exception</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exception Type</label>
                <select
                  value={exceptionType}
                  onChange={e => setExceptionType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                >
                  <option value="SINGLE_SOURCE">Single Source Procurement</option>
                  <option value="EMERGENCY">Emergency Purchase</option>
                  <option value="QUOTATION_WAIVER">Quotation Waiver</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Justification</label>
                <textarea
                  required
                  rows={3}
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
                  Authorize Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
