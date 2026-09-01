import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Lock,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { ExamResultProcessing, ExamResultProcessingStatus, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface ResultReadinessTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const ResultReadinessTab: React.FC<ResultReadinessTabProps> = ({ tenantId, campusId, currentUser }) => {
  const {
    selectedExamination,
    availableExaminations,
    selectedAcademicYear,
    classes,
    subjects,
    getEnrolledStudents
  } = useExaminationOperations();

  const [results, setResults] = useState<ExamResultProcessing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showInitModal, setShowInitModal] = useState(false);

  const [initForm, setInitForm] = useState({
    classId: '',
    subjectId: '',
    totalStudents: 30
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await ExaminationOpsService.getResultProcessings(tenantId);
      const filtered = selectedExamination?.id
        ? list.filter(r => r.examinationId === selectedExamination.id)
        : list;
      setResults(filtered);
    } catch (err) {
      console.error('Error loading result processing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId, selectedExamination?.id]);

  const handleOpenInit = () => {
    setActionError(null);
    const initialClass = classes[0];
    const initialSubject = subjects[0];
    const enrolledInClass = initialClass ? getEnrolledStudents(initialClass.id).length : 0;

    setInitForm({
      classId: initialClass?.id || '',
      subjectId: initialSubject?.id || '',
      totalStudents: enrolledInClass > 0 ? enrolledInClass : 30
    });
    setShowInitModal(true);
  };

  const handleInitializeLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const exam = selectedExamination || availableExaminations[0];
    if (!exam?.id) {
      setActionError('No active examination selected.');
      return;
    }

    const cls = classes.find(c => c.id === initForm.classId);
    const sub = subjects.find(s => s.id === initForm.subjectId);

    try {
      await ExaminationOpsService.initializeResultProcessing(
        {
          tenantId,
          campusId,
          academicYearId: selectedAcademicYear?.id || exam.academicYearId || 'AY-ACTIVE',
          examinationId: exam.id,
          examinationName: exam.name,
          classId: initForm.classId || cls?.id || 'CLS-GEN',
          className: cls?.name || 'Class',
          subjectId: initForm.subjectId || sub?.id || 'SUB-GEN',
          subjectName: sub?.name || 'General Subject',
          totalStudents: Number(initForm.totalStudents),
          marksEnteredCount: 0,
          marksVerifiedCount: 0,
          missingMarksCount: Number(initForm.totalStudents),
          unverifiedMarksCount: 0
        },
        currentUser
      );
      setShowInitModal(false);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to initialize result ledger');
    }
  };

  const handleStatusTransition = async (processingId: string, newStatus: ExamResultProcessingStatus) => {
    setActionError(null);
    try {
      await ExaminationOpsService.transitionResultProcessingStatus(tenantId, processingId, newStatus, currentUser);
      loadData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update result status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Result Processing & Finalization Gate</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Verify subject marks entry completeness, missing mark detection, moderation locks, and finalization signoff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenInit}
            disabled={!selectedExamination && availableExaminations.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Initialize Subject Ledger
          </button>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Re-check Status
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Scanning result processing readiness...</div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Result Processing Ledgers</h3>
            <p className="text-xs text-slate-500">
              Click "Initialize Subject Ledger" to track grading completion, missing marks, and final approval gates.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Class & Subject</th>
                  <th className="py-3 px-4">Marks Progress</th>
                  <th className="py-3 px-4">Missing / Unverified</th>
                  <th className="py-3 px-4">Result Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {results.map(rp => (
                  <tr key={rp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {rp.className} — {rp.subjectName || 'All Subjects'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">Exam: {rp.examinationName}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <div className="font-bold text-slate-800">
                        {rp.marksEnteredCount} / {rp.totalStudents} Students Entered
                      </div>
                      <div className="w-32 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((rp.marksEnteredCount / (rp.totalStudents || 1)) * 100))}%`
                          }}
                        ></div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {rp.missingMarksCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {rp.missingMarksCount} Missing Marks
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Complete
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          rp.status === 'FINALIZED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rp.status === 'LOCKED'
                            ? 'bg-slate-200 text-slate-800'
                            : rp.status === 'MARKS_PENDING'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {rp.status !== 'FINALIZED' && rp.status !== 'LOCKED' && (
                        <button
                          onClick={() => handleStatusTransition(rp.id, 'FINALIZED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                        >
                          Finalize Results
                        </button>
                      )}

                      {rp.status === 'FINALIZED' && (
                        <button
                          onClick={() => handleStatusTransition(rp.id, 'LOCKED')}
                          className="px-2.5 py-1 bg-slate-800 text-white rounded text-[11px] font-bold hover:bg-slate-900"
                        >
                          Lock Result Ledger
                        </button>
                      )}

                      {rp.status === 'LOCKED' && (
                        <span className="text-[11px] text-slate-400 font-mono italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3 text-slate-500" /> Immutable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Initialize Modal */}
      {showInitModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Initialize Subject Result Ledger</h3>
              <button
                onClick={() => setShowInitModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleInitializeLedger} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                <select
                  required
                  value={initForm.classId}
                  onChange={e => {
                    const cId = e.target.value;
                    const enrolled = getEnrolledStudents(cId).length;
                    setInitForm({
                      ...initForm,
                      classId: cId,
                      totalStudents: enrolled > 0 ? enrolled : initForm.totalStudents
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Subject</label>
                <select
                  required
                  value={initForm.subjectId}
                  onChange={e => setInitForm({ ...initForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code || s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Total Students</label>
                <input
                  type="number"
                  required
                  value={initForm.totalStudents}
                  onChange={e => setInitForm({ ...initForm, totalStudents: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInitModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Create Ledger Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
