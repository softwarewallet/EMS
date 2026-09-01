import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface GovernanceFormModalProps {
  isOpen: boolean;
  modalType: string | null;
  payload?: any;
  onClose: () => void;
  onSubmit: (type: string, formData: any) => Promise<void>;
}

export const GovernanceFormModal: React.FC<GovernanceFormModalProps> = ({
  isOpen,
  modalType,
  payload,
  onClose,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  if (!isOpen || !modalType) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(modalType, formData);
      setFormData({});
      onClose();
    } catch (err) {
      console.error('[GovernanceFormModal] Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormContent = () => {
    switch (modalType) {
      case 'add_committee':
        return (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Committee / Body Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Board of Governors / Academic Council"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOG-001"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type *</label>
                <select
                  value={formData.type || 'BOARD_OF_GOVERNORS'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                >
                  <option value="BOARD_OF_GOVERNORS">BOARD_OF_GOVERNORS</option>
                  <option value="ACADEMIC_COUNCIL">ACADEMIC_COUNCIL</option>
                  <option value="EXECUTIVE_COMMITTEE">EXECUTIVE_COMMITTEE</option>
                  <option value="FINANCE_COMMITTEE">FINANCE_COMMITTEE</option>
                  <option value="ANTI_RAGGING_COMMITTEE">ANTI_RAGGING_COMMITTEE</option>
                  <option value="INTERNAL_QUALITY_CELL">INTERNAL_QUALITY_CELL (IQAC)</option>
                  <option value="GRIEVANCE_COMMITTEE">GRIEVANCE_COMMITTEE</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quorum Requirement (%)</label>
                <input
                  type="number"
                  defaultValue={50}
                  value={formData.quorumRequirement ?? 50}
                  onChange={(e) => handleChange('quorumRequirement', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Frequency (Months)</label>
                <input
                  type="number"
                  defaultValue={3}
                  value={formData.meetingFrequencyMonths ?? 3}
                  onChange={(e) => handleChange('meetingFrequencyMonths', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Terms of Reference / Scope</label>
              <textarea
                rows={2}
                placeholder="Brief description of duties and authority..."
                value={formData.termsOfReference || ''}
                onChange={(e) => handleChange('termsOfReference', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        );

      case 'add_policy':
        return (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Policy Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Institutional Academic Integrity Policy"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Policy Code *</label>
                <input
                  type="text"
                  required
                  placeholder="POL-ACAD-001"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={formData.category || 'ACADEMIC'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  <option value="ACADEMIC">ACADEMIC</option>
                  <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
                  <option value="FINANCIAL">FINANCIAL</option>
                  <option value="HR_STAFF">HR & STAFF</option>
                  <option value="STUDENT_AFFAIRS">STUDENT AFFAIRS</option>
                  <option value="RESEARCH">RESEARCH</option>
                  <option value="IT_SECURITY">IT & SECURITY</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Policy Purpose & Scope</label>
              <textarea
                rows={2}
                placeholder="Define objective and applicability..."
                value={formData.purpose || ''}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        );

      case 'add_obligation':
        return (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Obligation Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Anti-Ragging Affidavit Collection"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Obligation Code *</label>
                <input
                  type="text"
                  required
                  placeholder="OBL-UGC-01"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 'add_risk':
        return (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Risk Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Data Privacy Leak Exposure"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Probability (1-5) *</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={3}
                  value={formData.probability ?? 3}
                  onChange={(e) => handleChange('probability', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Impact (1-5) *</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={4}
                  value={formData.impact ?? 4}
                  onChange={(e) => handleChange('impact', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Title / Description *</label>
              <input
                type="text"
                required
                placeholder="Enter details..."
                value={formData.title || formData.reasonForException || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 capitalize flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            {modalType?.replace('_', ' ') || 'Unknown'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {renderFormContent()}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white rounded transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? 'Saving...' : 'Submit Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
