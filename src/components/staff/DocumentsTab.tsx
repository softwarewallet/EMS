import React, { useState, useEffect } from 'react';
import { useStaffContext } from './StaffContext';
import { StaffService } from '../../services/staffService';
import { useNotification } from '../../context/NotificationContext';
import { StaffDocument, StaffDocumentCategory } from '../../types';
import {
  FileText,
  Plus,
  CheckCircle2,
  Eye,
  Lock,
} from 'lucide-react';

export const DocumentsTab: React.FC = () => {
  const { tenantId, staffList, currentUser } = useStaffContext();
  const { notify } = useNotification();

  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [documents, setDocuments] = useState<StaffDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Form State
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [category, setCategory] = useState<StaffDocumentCategory>('CONTRACT');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isConfidential, setIsConfidential] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadDocuments = async () => {
    if (!selectedStaffId) return;
    setLoading(true);
    try {
      const data = await StaffService.getStaffDocuments(tenantId, selectedStaffId);
      setDocuments(data);
    } catch (err: any) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [tenantId, selectedStaffId]);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await StaffService.uploadDocument(
        tenantId,
        {
          tenantId,
          staffId: selectedStaffId,
          title: documentTitle.trim(),
          documentCategory: category,
          fileName: `${documentTitle.trim().toLowerCase().replace(/\s+/g, '_')}.pdf`,
          fileType: 'application/pdf',
          fileSize: 245000,
          fileUrl: `https://storage.edutech.edu/docs/${selectedStaffId}/${Date.now()}_doc.pdf`,
          verificationStatus: 'PENDING',
          expiryDate: expiryDate || undefined,
          notes: isConfidential ? 'Confidential HR Document' : undefined
        },
        currentUser
      );

      notify('success', 'Document Uploaded', 'HR document registered and queued for verification.');

      setShowUploadModal(false);
      setDocumentTitle('');
      setExpiryDate('');
      setIsConfidential(false);
      await loadDocuments();
    } catch (err: any) {
      notify('error', 'Upload Failed', err.message || 'Could not register document.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDocument = async (docId: string) => {
    try {
      await StaffService.verifyDocument(tenantId, docId, 'VERIFIED', 'Verified by HR compliance desk', currentUser);
      notify('success', 'Document Verified', 'Compliance verification stamp signed successfully.');
      await loadDocuments();
    } catch (err: any) {
      notify('error', 'Verification Failed', err.message || 'Could not verify document.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            HR Document Registry & Compliance Verification
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Store and audit employment agreements, national IDs, background screening clearance, and medical certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Register HR Document
          </button>
        </div>
      </div>

      {/* Staff Selector Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="w-full sm:w-80">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Staff Member</label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.department} - {s.employeeNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading document repository...</div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 mb-1">No Documents Uploaded</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-4">
            Upload official credentials, employment contracts, and compliance proofs for this staff member.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Upload First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {doc.notes?.includes('Confidential') && (
                      <span className="p-1 bg-amber-100 text-amber-800 rounded text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Confidential
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        doc.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">{doc.title}</h4>
                <span className="text-xs text-slate-500 font-medium block mb-2">{doc.documentCategory}</span>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{doc.createdAt.split('T')[0]}</span>
                  </div>
                  {doc.expiryDate && (
                    <div className="flex justify-between text-amber-700 font-medium">
                      <span>Expires:</span>
                      <span>{doc.expiryDate}</span>
                    </div>
                  )}
                  {doc.verifiedByName && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Verified By:</span>
                      <span>{doc.verifiedByName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                {doc.verificationStatus !== 'VERIFIED' && (
                  <button
                    onClick={() => handleVerifyDocument(doc.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify Document
                  </button>
                )}
                <a
                  href={doc.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Register HR Document
            </h3>

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Employment Agreement 2026-27"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Document Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StaffDocumentCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="CONTRACT">Employment Contract</option>
                  <option value="IDENTITY_PROOF">National ID / Passport</option>
                  <option value="QUALIFICATION">Degree / Qualification Proof</option>
                  <option value="CERTIFICATION">Professional Certification</option>
                  <option value="COMPLIANCE">Compliance / Background Screening</option>
                  <option value="APPOINTMENT_LETTER">Appointment Letter</option>
                  <option value="MEDICAL_FITNESS">Medical Fitness Certificate</option>
                  <option value="PAYSLIP_PROOF">Payslip / Bank Proof</option>
                  <option value="RESIGNATION">Resignation Letter</option>
                  <option value="EXIT_CLEARANCE">Exit Clearance Sign-off</option>
                  <option value="OTHER">Other Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="confidentialCheck"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="confidentialCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Mark as confidential (HR Admin access only)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Registering...' : 'Register Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
