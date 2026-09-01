import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  CheckCircle,
  AlertCircle,
  Lock,
  Search
} from 'lucide-react';
import { ExamPaper, ExamPaperStatus, User } from '../../types';
import { ExaminationOpsService } from '../../services/examinationOpsService';
import { useExaminationOperations } from '../../context/ExaminationOperationsContext';

interface PapersTabProps {
  tenantId: string;
  campusId: string;
  currentUser: User;
}

export const PapersTab: React.FC<PapersTabProps> = ({ tenantId, campusId, currentUser }) => {
  const { selectedExamination, availableExaminations, subjects } = useExaminationOperations();
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    examinationId: '',
    examinationName: '',
    subjectId: '',
    subjectName: '',
    subjectCode: '',
    paperCode: '',
    title: '',
    maximumMarks: 80,
    durationMinutes: 180,
    instructions: 'All questions are compulsory. Follow standard hall examination guidelines.'
  });

  const loadPapers = async () => {
    setLoading(true);
    try {
      const data = await ExaminationOpsService.getPapers(tenantId);
      const filteredForExam = selectedExamination?.id
        ? data.filter(p => p.examinationId === selectedExamination.id)
        : data;
      setPapers(filteredForExam);
    } catch (err) {
      console.error('Error loading papers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPapers();
  }, [tenantId, selectedExamination?.id]);

  const handleOpenCreate = () => {
    setActionError(null);
    const exam = selectedExamination || availableExaminations[0];
    const initialSub = subjects[0];
    const seq = Date.now().toString().slice(-4);
    setFormData({
      examinationId: exam?.id || '',
      examinationName: exam?.name || '',
      subjectId: initialSub?.id || '',
      subjectName: initialSub?.name || 'Subject',
      subjectCode: initialSub?.code || 'SUB-01',
      paperCode: `P-${initialSub?.code || 'GEN'}-${seq}`,
      title: `${initialSub?.name || 'General'} Question Paper`,
      maximumMarks: 80,
      durationMinutes: 180,
      instructions: 'All questions are compulsory. Follow standard hall examination guidelines.'
    });
    setShowCreateModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const targetExam = availableExaminations.find(ex => ex.id === formData.examinationId) || selectedExamination;
    if (!targetExam?.id) {
      setActionError('Please select a valid examination.');
      return;
    }

    try {
      await ExaminationOpsService.createPaper(
        {
          tenantId,
          campusId,
          examinationId: targetExam.id,
          examinationName: targetExam.name || formData.examinationName,
          subjectId: formData.subjectId,
          subjectName: formData.subjectName,
          subjectCode: formData.subjectCode,
          paperCode: formData.paperCode,
          title: formData.title,
          maximumMarks: formData.maximumMarks,
          durationMinutes: formData.durationMinutes,
          instructions: formData.instructions,
          createdBy: currentUser.id
        },
        currentUser
      );
      setShowCreateModal(false);
      loadPapers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create paper');
    }
  };

  const handleStatusChange = async (paperId: string, newStatus: ExamPaperStatus) => {
    setActionError(null);
    try {
      await ExaminationOpsService.updatePaperStatus(tenantId, paperId, newStatus, currentUser);
      loadPapers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update paper status');
    }
  };

  const filtered = papers.filter(
    p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paperCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Question Paper & Assessment Documents</h2>
            {selectedExamination && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {selectedExamination.name}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage question paper versions, moderation reviews, Document Registry links, and secure release workflows.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedExamination && availableExaminations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Register Question Paper
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search papers by title, code or subject..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading registered question papers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Question Papers Registered</h3>
            <p className="text-xs text-slate-500">
              Click "Register Question Paper" to define assessment papers for this examination.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Paper Code & Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Marks & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>Code: {p.paperCode}</span>
                        <span>•</span>
                        <span>v{p.version}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold text-slate-800">{p.subjectName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.subjectCode || p.subjectId}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      <div className="font-bold">{p.maximumMarks} Marks</div>
                      <div className="text-[11px] text-slate-500">{p.durationMinutes} Minutes</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.status === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'APPROVED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : p.status === 'UNDER_REVIEW'
                            ? 'bg-sky-100 text-sky-800'
                            : p.status === 'WITHDRAWN'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {p.status === 'DRAFT' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'UNDER_REVIEW')}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[11px] font-bold hover:bg-sky-100"
                        >
                          Submit For Review
                        </button>
                      )}

                      {p.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-bold hover:bg-indigo-100"
                        >
                          Approve
                        </button>
                      )}

                      {p.status === 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'RELEASED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                        >
                          Release & Seal
                        </button>
                      )}

                      {p.status === 'RELEASED' && (
                        <span className="text-[11px] text-slate-400 font-mono italic flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3 text-emerald-600" /> Released & Locked
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Register Question Paper</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Examination</label>
                <select
                  required
                  value={formData.examinationId}
                  onChange={e => {
                    const found = availableExaminations.find(ex => ex.id === e.target.value);
                    setFormData({
                      ...formData,
                      examinationId: e.target.value,
                      examinationName: found?.name || ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {availableExaminations.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.code || ex.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={e => {
                    const foundSub = subjects.find(s => s.id === e.target.value);
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      subjectName: foundSub?.name || '',
                      subjectCode: foundSub?.code || '',
                      paperCode: `P-${foundSub?.code || 'GEN'}-${Date.now().toString().slice(-4)}`,
                      title: `${foundSub?.name || ''} Final Question Paper`
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || s.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectCode}
                    onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paper Code</label>
                  <input
                    type="text"
                    required
                    value={formData.paperCode}
                    onChange={e => setFormData({ ...formData, paperCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    required
                    value={formData.maximumMarks}
                    onChange={e => setFormData({ ...formData, maximumMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    value={formData.durationMinutes}
                    onChange={e => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Paper Instructions</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Save Paper Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
