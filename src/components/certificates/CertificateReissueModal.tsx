import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { Certificate, AuthorizedSignatory } from '../../types';

interface CertificateReissueModalProps {
  certificate: Certificate;
  signatories: AuthorizedSignatory[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: 'DATA_CORRECTION' | 'DAMAGED_DOCUMENT' | 'LOST_DOCUMENT' | 'INSTITUTIONAL_CORRECTION' | 'OTHER', description: string, signatoryId?: string) => Promise<void>;
}

export const CertificateReissueModal: React.FC<CertificateReissueModalProps> = ({
  certificate,
  signatories,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState<'DATA_CORRECTION' | 'DAMAGED_DOCUMENT' | 'LOST_DOCUMENT' | 'INSTITUTIONAL_CORRECTION' | 'OTHER'>('DATA_CORRECTION');
  const [description, setDescription] = useState('');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState(signatories[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason, description, selectedSignatoryId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Official Certificate Reissue
              </h3>
              <p className="text-2xs text-slate-500">
                Superseding Certificate #{certificate.certificateNumber} (Version {certificate.certificateVersion})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Note */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Permanent Historical Audit Preservation</p>
            <p className="text-2xs opacity-90">
              The existing certificate #{certificate.certificateNumber} will be marked as <strong>REISSUED (SUPERSEDED)</strong>. A new unique sequential certificate number will be generated with incremented version ({certificate.certificateVersion + 1}).
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reissue Reason Category *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
            >
              <option value="DATA_CORRECTION">Data Correction / Spelling Rectification</option>
              <option value="DAMAGED_DOCUMENT">Damaged / Mutilated Document Replacement</option>
              <option value="LOST_DOCUMENT">Lost Original Document Duplicate</option>
              <option value="INSTITUTIONAL_CORRECTION">Administrative / Institutional Correction</option>
              <option value="OTHER">Other Authorized Justification</option>
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Audit Justification & Notes *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify the exact corrections made or reason for reissuance (e.g., Parent requested mother name spelling correction according to birth certificate)..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Authorized Signatory for Reissued Document
            </label>
            <select
              value={selectedSignatoryId}
              onChange={(e) => setSelectedSignatoryId(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            >
              {signatories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isSubmitting ? 'Processing Reissue...' : 'Confirm & Reissue Certificate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
