import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  FileText, 
  UserCheck, 
  Activity, 
  Sliders,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { AcademicPerformanceInsight, AcademicIntervention } from '../../types/intelligence';
import { IntelligenceService } from '../../services/intelligenceService';
import { StudentService } from '../../services/studentService';
import { Student } from '../../types';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const IntelligenceWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [insights, setInsights] = useState<AcademicPerformanceInsight[]>([]);
  const [interventions, setInterventions] = useState<AcademicIntervention[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'interventions'>('insights');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // New Intervention Modal state
  const [isCreatingInt, setIsCreatingInt] = useState(false);
  const [actionPlan, setActionPlan] = useState('');
  const [assignedTo, setAssignedTo] = useState('Academic Counselor');
  const [targetDate, setTargetDate] = useState('2028-06-01');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ins, ints, stds] = await Promise.all([
        IntelligenceService.getInsights(tenantId, undefined, user),
        IntelligenceService.getInterventions(tenantId, user),
        StudentService.getStudents(tenantId, user)
      ]);
      setInsights(ins);
      setInterventions(ints);
      setStudents(stds);
      if (stds.length > 0 && !selectedStudentId) {
        setSelectedStudentId(stds[0].id);
      }
    } catch (err) {
      console.error('Error loading intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedStudentId) {
      alert('Please select an authoritative student to analyze.');
      return;
    }
    try {
      await IntelligenceService.runIntelligenceAnalysis(
        tenantId,
        selectedStudentId,
        'ay_2027_28',
        user
      );
      setSuccessMessage('Deterministic academic intelligence analysis executed successfully from authoritative marks & attendance.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Analysis failed');
    }
  };

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find(s => s.id === selectedStudentId);
    if (!targetStudent) return;

    try {
      await IntelligenceService.createIntervention({
        tenantId,
        studentId: targetStudent.id,
        studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
        enrollmentId: `enr_${targetStudent.id}`,
        academicYearId: 'ay_2027_28',
        classId: targetStudent.currentClassId || 'cls_demo',
        sectionId: targetStudent.currentSectionId || 'sec_demo',
        interventionType: 'ACADEMIC_SUPPORT',
        priority: 'MODERATE',
        status: 'OPEN',
        assignedTo,
        targetDate,
        actionPlan,
        createdBy: user.displayName || user.email || user.id
      }, user);

      setSuccessMessage('Intervention case created and logged to audit trail successfully.');
      setIsCreatingInt(false);
      setActionPlan('');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create intervention');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Academic Performance Intelligence & Intervention</h2>
          <p className="text-sm text-slate-500">Phase 7.7 Deterministic Intelligence, Risk Analysis, and Actionable Intervention Workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 shadow-sm"
          >
            <option value="">Select Authoritative Student...</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentIdNumber})</option>
            ))}
          </select>
          <button
            onClick={handleRunAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
          >
            <Brain className="w-4 h-4" />
            Run Analysis
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'insights' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Performance Insights ({insights.length})
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'interventions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Intervention Cases ({interventions.length})
        </button>
      </div>

      {isCreatingInt && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Intervention Case</h3>
          <form onSubmit={handleCreateIntervention} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Staff / Counselor</label>
                <input
                  type="text"
                  required
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Action Plan & Remedial Steps</label>
              <textarea
                required
                rows={3}
                value={actionPlan}
                onChange={e => setActionPlan(e.target.value)}
                placeholder="Specify remedial goals, meetings, and success metrics..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingInt(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Save Intervention Case
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map(ins => (
            <div key={ins.insightId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    {ins.insightType}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    ins.severity === 'HIGH' || ins.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    ins.severity === 'MODERATE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Risk: {ins.severity}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{ins.studentName}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">Sufficiency: {ins.dataSufficiency} | Confidence: {ins.confidence}</p>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-700 mb-4">
                  <p>Average Score: <strong className="text-slate-900">{ins.evidence.averageScore}%</strong></p>
                  <p>Attendance: <strong className="text-slate-900">{ins.evidence.attendancePercentage}%</strong></p>
                  <p>Trend: <strong className="text-indigo-600">{ins.evidence.trendStatus}</strong></p>
                  {ins.reasonCodes && ins.reasonCodes.length > 0 && (
                    <p className="pt-1 text-slate-500">Reasons: {ins.reasonCodes.join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">v{ins.calculationVersion}</span>
                <button
                  onClick={() => {
                    setSelectedStudentId(ins.studentId);
                    setIsCreatingInt(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700 shadow-sm"
                >
                  Create Intervention
                </button>
              </div>
            </div>
          ))}
          {insights.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 text-sm">
              No performance insights generated yet. Select a student and click "Run Analysis".
            </div>
          )}
        </div>
      )}

      {activeTab === 'interventions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Active Remedial Intervention Cases</h3>
            <button
              onClick={() => setIsCreatingInt(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              New Intervention
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {interventions.map(int => (
              <div key={int.interventionId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{int.studentName}</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg font-semibold">{int.interventionType}</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-lg font-semibold">{int.status}</span>
                  </div>
                  <p className="text-xs text-slate-600">Action Plan: {int.actionPlan}</p>
                  <p className="text-xs text-slate-400">Assigned To: {int.assignedTo} | Target Date: {int.targetDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                    Priority: {int.priority}
                  </span>
                </div>
              </div>
            ))}
            {interventions.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No active intervention cases found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
