import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Layers, 
  Clock, 
  Users,
  Building,
  Award
} from 'lucide-react';
import { Examination, ExaminationSchedule, ExaminationEligibility } from '../../types/examination';
import { ExaminationService } from '../../services/examinationService';
import { MarksWorkspace } from '../marks/MarksWorkspace';
import { ReportCardWorkspace } from '../reportCard/ReportCardWorkspace';
import { RankingWorkspace } from '../ranking/RankingWorkspace';

interface Props {
  tenantId: string;
  user: { id: string; email: string; displayName?: string; role?: string };
}

export const ExaminationWorkspace: React.FC<Props> = ({ tenantId, user }) => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [schedules, setSchedules] = useState<ExaminationSchedule[]>([]);
  const [eligibilityList, setEligibilityList] = useState<ExaminationEligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'exams' | 'schedules' | 'eligibility' | 'marks' | 'reportCards' | 'ranking'>('exams');
  const [successMessage, setSuccessMessage] = useState('');

  // New Exam Form State
  const [isCreatingExam, setIsCreatingExam] = useState(false);
  const [examName, setExamName] = useState('');
  const [examCode, setExamCode] = useState('');
  const [examType, setExamType] = useState<Examination['examinationType']>('ANNUAL');
  const [startDate, setStartDate] = useState('2028-03-01');
  const [endDate, setEndDate] = useState('2028-03-15');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const exams = await ExaminationService.getExaminations(tenantId);
      setExaminations(exams);
      const sch = await ExaminationService.getSchedules(tenantId);
      setSchedules(sch);
      const elig = await ExaminationService.getEligibilityRecords(tenantId);
      setEligibilityList(elig);
    } catch (err) {
      console.error('Error loading examination data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ExaminationService.saveExamination({
        tenantId,
        academicYearId: 'ay_2027_28',
        name: examName,
        code: examCode,
        examinationType: examType,
        status: 'DRAFT',
        startDate,
        endDate,
        classIds: ['cls_demo'],
        sectionIds: ['sec_demo'],
        components: [
          {
            componentId: `comp_${Date.now()}_1`,
            examinationId: 'pending',
            subjectId: 'sub_math',
            subjectName: 'Mathematics',
            componentType: 'THEORY',
            name: 'Theory Paper',
            maximumMarks: 80,
            passingMarks: 28,
            weightage: 80,
            sequence: 1,
            durationMinutes: 180,
            status: 'ACTIVE'
          }
        ],
        createdBy: user.displayName || user.email || user.id
      }, user);

      setSuccessMessage('Examination definition created successfully in draft mode.');
      setIsCreatingExam(false);
      setExamName('');
      setExamCode('');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create examination');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await ExaminationService.updateExaminationStatus(id, tenantId, 'PUBLISHED', user);
      setSuccessMessage('Examination published officially. Eligibility generated.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to publish examination');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Examination & Assessment Foundation</h2>
          <p className="text-sm text-slate-500">Board-agnostic examination structures, component definitions, scheduling, and attendance eligibility integration.</p>
        </div>
        <button
          onClick={() => setIsCreatingExam(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Examination
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit text-xs font-medium">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'exams' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Examinations ({examinations.length})
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'schedules' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Schedules ({schedules.length})
        </button>
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'eligibility' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Eligibility & Attendance ({eligibilityList.length})
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'marks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Marks & Results (Phase 7.5)
        </button>
        <button
          onClick={() => setActiveTab('reportCards')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'reportCards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Report Cards & Transcripts (Phase 7.6A)
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'ranking' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Merit & Ranking (Phase 7.6B)
        </button>
      </div>

      {isCreatingExam && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Examination Definition</h3>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Examination Name</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  placeholder="e.g. Mid-Term Assessment 2028"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Examination Code</label>
                <input
                  type="text"
                  required
                  value={examCode}
                  onChange={e => setExamCode(e.target.value)}
                  placeholder="e.g. MID-2028"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Examination Type</label>
                <select
                  value={examType}
                  onChange={e => setExamType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="UNIT_TEST">Unit Test</option>
                  <option value="MID_TERM">Mid-Term</option>
                  <option value="HALF_YEARLY">Half Yearly</option>
                  <option value="ANNUAL">Annual Examination</option>
                  <option value="PRE_BOARD">Pre-Board</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreatingExam(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm"
              >
                Save Draft Examination
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(examinations || []).map(exam => (
            <div key={exam.examinationId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    {exam.examinationType}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    exam.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                    exam.status === 'APPROVED' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {exam.status}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">{exam.name}</h3>
                <p className="text-xs text-slate-500 font-mono mb-4">Code: {exam.code} | {exam.startDate} to {exam.endDate}</p>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">{exam.description || 'No description provided.'}</p>
                
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-slate-700 block">Assessment Components ({(exam.components || []).length}):</span>
                  {(exam.components || []).map(comp => (
                    <div key={comp.componentId} className="flex justify-between items-center text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-800">{comp.name}</span>
                      <span className="text-slate-500 font-mono">Max: {comp.maximumMarks} | Pass: {comp.passingMarks}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Academic Year: {exam.academicYearId}</span>
                {exam.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePublish(exam.examinationId)}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 shadow-sm"
                  >
                    Publish Exam
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Examination Schedule & Timetable</h3>
            <span className="text-xs text-slate-500 font-medium">{(schedules || []).length} Scheduled Sessions</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(schedules || []).map(sch => (
              <div key={sch.scheduleId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Date: {sch.date}</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg font-mono">{sch.startTime} - {sch.endTime}</span>
                  </div>
                  <p className="text-xs text-slate-500">Room: {sch.roomName || 'TBD'} | Invigilator: {(sch.invigilatorNames || []).join(', ') || 'Not Assigned'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                    {sch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Examination Attendance Eligibility Register</h3>
            <span className="text-xs text-slate-500 font-medium">Linked to Phase 7.2 Attendance Policy Engine</span>
          </div>
          <div className="divide-y divide-slate-100">
            {(eligibilityList || []).map(elig => (
              <div key={elig.eligibilityId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{elig.studentName}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      elig.status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {elig.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Effective Attendance: <strong className="text-slate-800">{elig.attendancePercentage}%</strong> (Minimum required: 75%)</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  {elig.attendanceCompliant ? '✓ Policy Compliant' : '⚠ Shortage Warning'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'marks' && (
        <MarksWorkspace tenantId={tenantId} user={user} />
      )}

      {activeTab === 'reportCards' && (
        <ReportCardWorkspace tenantId={tenantId} user={user} />
      )}

      {activeTab === 'ranking' && (
        <RankingWorkspace tenantId={tenantId} user={user} />
      )}
    </div>
  );
};
