import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Search
} from 'lucide-react';
import { ExamException, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface ExceptionsTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const ExceptionsTab: React.FC<ExceptionsTabProps> = ({ tenantId, campusId, currentUser }) => {
  const {
    selectedExamination,
    availableExaminations,
    selectedAcademicYear
  } = useExaminationOperations();

  const [exceptions, setExceptions] = useState<ExamException[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedException, setSelectedException] = useState<ExamException | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Reviewed and cleared by Examination Controller.');
  const [actionError, setActionError] = useState<string | null>(null);

  const loadExceptions = async () => {
    setLoading(true);
    try {
      const list = await ExaminationOpsService.getExceptions(tenantId);
      const filtered = selectedExamination?.id
        ? list.filter(e => e.examinationId === selectedExamination.id)
        : list;
      setExceptions(filtered);
    } catch (err) {
      console.error('Error loading exceptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExceptions();
  }, [tenantId, selectedExamination?.id]);

  const handleScan = async () => {
    setScanning(true);
    setActionError(null);

    const exam = selectedExamination || availableExaminations[0];
    if (!exam?.id) {
      setActionError('No active examination selected for exception scanning.');
      setScanning(false);
      return;
    }

    try {
      await ExaminationOpsService.scanAndGenerateExceptions(
        tenantId,
        campusId,
        selectedAcademicYear?.id || exam.academicYearId || 'AY-ACTIVE',
        exam.id,
        exam.name
      );
      loadExceptions();
    } catch (err: any) {
      setActionError(err.message || 'Failed to scan exceptions');
    } finally {
      setScanning(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedException) return;
    setActionError(null);
    try {
      await ExaminationOpsService.resolveException(tenantId, selectedException.exceptionId, resolutionNotes, currentUser);
      setShowResolveModal(false);
      setSelectedException(null);
      loadExceptions();
    } catch (err: any) {
      setActionError(err.message || 'Failed to resolve exception');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Examination Exception Register</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Scan and resolve operational anomalies: unapproved question papers, unresolved malpractice, missing marks, and capacity breaches.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning || (!selectedExamination && availableExaminations.length === 0)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning System...' : 'Run Operational Exception Scan'}
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading exception register...</div>
        ) : exceptions.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Zero System Exceptions</h3>
            <p className="text-xs text-slate-500">All examination operations are fully compliant. Click scan to run automated integrity checks.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Type & Severity</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Student / Context</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {exceptions.map(exc => (
                  <tr key={exc.exceptionId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-sm">{exc.type}</div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold mt-1 ${
                          exc.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : exc.severity === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {exc.severity} SEVERITY
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-sm">{exc.description}</td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <div>{exc.studentName || 'System-wide'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Exam: {exc.examinationName}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          exc.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {exc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {exc.status === 'OPEN' && (
                        <button
                          onClick={() => {
                            setSelectedException(exc);
                            setShowResolveModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                        >
                          Resolve Exception
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {showResolveModal && selectedException && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Resolve Operational Exception</h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleResolve} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resolution Clearance Notes</label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
