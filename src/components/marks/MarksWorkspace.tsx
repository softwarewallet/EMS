import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  FileCheck, 
  AlertCircle, 
  Save, 
  Users, 
  Layers, 
  Calculator,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AssessmentMark, SubjectResult } from '../../types/marks';
import { Examination } from '../../types/examination';
import { ExaminationService } from '../../services/examinationService';
import { MarksService } from '../../services/marksService';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const MarksWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('');
  const [marksList, setMarksList] = useState<AssessmentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'entry' | 'results' | 'validation'>('entry');
  const [resultsList, setResultsList] = useState<SubjectResult[]>([]);

  // Local state edits for bulk entry
  const [editableMarks, setEditableMarks] = useState<Record<string, number>>({});
  const [editableRemarks, setEditableRemarks] = useState<Record<string, string>>({});

  useEffect(() => {
    loadInitialData();
  }, [tenantId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const exams = await ExaminationService.getExaminations(tenantId);
      setExaminations(exams);
      if (exams.length > 0) {
        setSelectedExamId(exams[0].examinationId);
        if (exams[0].components.length > 0) {
          setSelectedComponentId(exams[0].components[0].componentId);
        }
      }
    } catch (err) {
      console.error('Error loading examinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExamId && selectedComponentId) {
      loadMarksData();
    }
  }, [selectedExamId, selectedComponentId]);

  const loadMarksData = async () => {
    try {
      const marks = await MarksService.getMarks(tenantId, selectedExamId, selectedComponentId);
      setMarksList(marks);
      
      const marksMap: Record<string, number> = {};
      const remarksMap: Record<string, string> = {};
      marks.forEach(m => {
        marksMap[m.studentId] = m.obtainedMarks;
        remarksMap[m.studentId] = m.remarks || '';
      });
      setEditableMarks(marksMap);
      setEditableRemarks(remarksMap);
    } catch (err) {
      console.error('Error loading marks:', err);
    }
  };

  const currentExam = examinations.find(e => e.examinationId === selectedExamId);
  const currentComponent = currentExam?.components.find(c => c.componentId === selectedComponentId);

  const handleMarkChange = (studentId: string, val: string) => {
    const num = parseFloat(val);
    setEditableMarks(prev => ({ ...prev, [studentId]: isNaN(num) ? 0 : num }));
  };

  const handleSaveAll = async () => {
    if (!currentExam || !currentComponent) return;

    try {
      const updates = marksList.map(m => ({
        ...m,
        obtainedMarks: editableMarks[m.studentId] !== undefined ? editableMarks[m.studentId] : m.obtainedMarks,
        remarks: editableRemarks[m.studentId] || m.remarks,
        status: 'SUBMITTED' as any
      }));

      await MarksService.bulkSaveMarks(updates, user);
      setSuccessMessage('Marks successfully submitted and saved to authoritative ledger.');
      loadMarksData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save marks');
    }
  };

  const handleVerifyBatch = async () => {
    if (!selectedExamId || !selectedComponentId) return;
    try {
      await MarksService.verifyMarks(tenantId, selectedExamId, selectedComponentId, user);
      setSuccessMessage('Marks verified by academic coordinator.');
      loadMarksData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    }
  };

  const handleLockBatch = async () => {
    if (!selectedExamId || !selectedComponentId) return;
    try {
      await MarksService.lockMarks(tenantId, selectedExamId, selectedComponentId, user);
      setSuccessMessage('Marks officially locked and approved.');
      loadMarksData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Lock failed');
    }
  };

  const handleCalculateResult = async (studentId: string, enrollmentId: string, subjectId: string, subjectName: string) => {
    try {
      const res = await MarksService.calculateSubjectResult(tenantId, selectedExamId, studentId, enrollmentId, subjectId, subjectName);
      setResultsList(prev => [...prev.filter(r => r.resultId !== res.resultId), res]);
      setSuccessMessage(`Subject result calculated: ${res.percentage}% (${res.grade} - ${res.resultStatus})`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Result calculation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Authoritative Marks & Results Engine</h2>
          <p className="text-sm text-slate-500">Phase 7.5 Enterprise Assessment Scores Ledger, Verification, Grading Policies, and Subject Results.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save & Submit Marks
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Examination</label>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
          >
            {(examinations || []).map(ex => (
              <option key={ex.examinationId} value={ex.examinationId}>{ex.name} ({ex.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">Assessment Component</label>
          <select
            value={selectedComponentId}
            onChange={e => setSelectedComponentId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
          >
            {(currentExam?.components || []).map(comp => (
              <option key={comp.componentId} value={comp.componentId}>
                {comp.name} (Max: {comp.maximumMarks}, Pass: {comp.passingMarks})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={handleVerifyBatch}
            className="px-3 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-semibold hover:bg-sky-100"
          >
            Verify Batch
          </button>
          <button
            onClick={handleLockBatch}
            className="px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold hover:bg-amber-100 flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock & Approve
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('entry')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'entry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Marks Entry Roster ({marksList.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Subject Results ({resultsList.length})
        </button>
      </div>

      {activeTab === 'entry' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-900">
                {currentComponent?.name} — Max Marks: {currentComponent?.maximumMarks || 100} (Passing: {currentComponent?.passingMarks || 35})
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Authoritative Score Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-200">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Participation</th>
                  <th className="p-4">Max Marks</th>
                  <th className="p-4">Obtained Marks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Remarks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(marksList || []).map(mark => (
                  <tr key={mark.markId} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{mark.studentName || 'Student'}</td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-md font-mono text-slate-700">
                        {mark.participationStatus}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600">{mark.maximumMarks}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        disabled={mark.status === 'LOCKED'}
                        value={editableMarks[mark.studentId] !== undefined ? editableMarks[mark.studentId] : mark.obtainedMarks}
                        onChange={e => handleMarkChange(mark.studentId, e.target.value)}
                        className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                        max={mark.maximumMarks}
                        min={0}
                      />
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        mark.status === 'LOCKED' ? 'bg-amber-100 text-amber-800' :
                        mark.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mark.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        disabled={mark.status === 'LOCKED'}
                        value={editableRemarks[mark.studentId] !== undefined ? editableRemarks[mark.studentId] : (mark.remarks || '')}
                        onChange={e => setEditableRemarks(prev => ({ ...prev, [mark.studentId]: e.target.value }))}
                        placeholder="Add remarks..."
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCalculateResult(mark.studentId, mark.enrollmentId, mark.subjectId, currentComponent?.subjectName || 'Subject')}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold"
                      >
                        Calculate Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Calculated Subject Results (Graded Ledger)</h3>
            <span className="text-xs text-slate-500 font-medium">{resultsList.length} Results Calculated</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(resultsList || []).map(res => (
              <div key={res.resultId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{res.subjectName}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      res.resultStatus === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {res.resultStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Score: <strong>{res.totalObtainedMarks} / {res.totalMaximumMarks}</strong> ({res.percentage}%) | Grade: <strong className="text-indigo-600">{res.grade}</strong>
                  </p>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  Calculated: {new Date(res.calculatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {resultsList.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">
                No subject results calculated yet. Click "Calculate Result" in the marks entry roster.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
