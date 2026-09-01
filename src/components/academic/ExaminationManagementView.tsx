import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Clock, 
  MapPin, 
  User, 
  Lock, 
  Unlock, 
  Send, 
  CheckCheck, 
  Printer, 
  Award,
  ShieldCheck,
  Eye,
  Save,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { ExaminationService, GradingService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import { 
  Examination, 
  ExamSchedule, 
  ExamTerm, 
  MarkEntry, 
  MarkWorkflowStatus, 
  ClassGrade, 
  Section, 
  Subject, 
  Student,
  GradingScheme
} from '../../types';

export const ExaminationManagementView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const { setActiveTab: setNavigationActiveTab } = useNavigation();
  const tenantId = currentTenant?.id || '';

  const [activeTab, setActiveTab] = useState<'exams' | 'datesheet' | 'marks'>('exams');
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradingScheme, setGradingScheme] = useState<GradingScheme | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected for Marks Entry
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [markEntries, setMarkEntries] = useState<MarkEntry[]>([]);
  const [markDrafts, setMarkDrafts] = useState<Record<string, { marks: number; attendance: 'PRESENT' | 'ABSENT' | 'EXEMPT'; remarks: string }>>({});
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState<MarkWorkflowStatus>('DRAFT');

  // Modals
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [newExam, setNewExam] = useState<{
    name: string;
    term: ExamTerm;
    startDate: string;
    endDate: string;
    maxMarksDefault: number;
    passingMarksDefault: number;
    classIds: string[];
  }>({
    name: 'Mid-Term Summative Assessment (Term 1) 2025–26',
    term: 'term_1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    maxMarksDefault: 80,
    passingMarksDefault: 27,
    classIds: []
  });

  const [newSchedule, setNewSchedule] = useState<{
    examId: string;
    classId: string;
    subjectId: string;
    examDate: string;
    startTime: string;
    endTime: string;
    roomNumber: string;
    invigilatorName: string;
    maxMarks: number;
    passingMarks: number;
  }>({
    examId: '',
    classId: '',
    subjectId: '',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    roomNumber: 'Auditorium Hall B',
    invigilatorName: 'Dr. R. K. Sharma',
    maxMarks: 80,
    passingMarks: 27
  });

  // RBAC checks for marks workflow
  const canCreateExam = userPermissions.includes('platform.admin') || userPermissions.includes('exam.create');
  const canEnterMarks = userPermissions.includes('platform.admin') || userPermissions.includes('marks.enter');
  const canVerifyMarks = userPermissions.includes('platform.admin') || userPermissions.includes('marks.verify');
  const canApproveMarks = userPermissions.includes('platform.admin') || userPermissions.includes('marks.approve');
  const canPublishMarks = userPermissions.includes('platform.admin') || userPermissions.includes('marks.publish');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [eList, schList, cList, secList, subList, stuList, gScheme] = await Promise.all([
        ExaminationService.getExaminations(tenantId),
        ExaminationService.getSchedules(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        AcademicService.getSubjects(tenantId),
        StudentService.getStudents(tenantId),
        GradingService.getGradingScheme(tenantId)
      ]);

      setExaminations(eList);
      setSchedules(schList);
      setClasses(cList);
      setSections(secList);
      setSubjects(subList);
      setStudents(stuList);
      setGradingScheme(gScheme);

      if (eList.length > 0) {
        setSelectedExamId(eList[0].id);
        setNewSchedule(prev => ({ ...prev, examId: eList[0].id }));
      }
      if (cList.length > 0) {
        setSelectedClassId(cList[0].id);
        setNewExam(prev => ({ ...prev, classIds: [cList[0].id] }));
        const matchedSections = secList.filter(s => s.classId === cList[0].id);
        if (matchedSections.length > 0) {
          setSelectedSectionId(matchedSections[0].id);
        }
      }
      if (subList.length > 0) {
        setSelectedSubjectId(subList[0].id);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load examinations dataset');
    } finally {
      setLoading(false);
    }
  };

  // Load marks when filter changes
  useEffect(() => {
    if (selectedExamId && selectedClassId && selectedSubjectId) {
      loadMarksForSelection();
    }
  }, [selectedExamId, selectedClassId, selectedSectionId, selectedSubjectId, students]);

  const loadMarksForSelection = async () => {
    if (!selectedExamId || !selectedClassId || !selectedSubjectId) return;
    try {
      const entries = await ExaminationService.getMarks(tenantId, selectedExamId, selectedClassId, selectedSubjectId);
      setMarkEntries(entries);

      // Check current workflow status from entries if any exist
      if (entries.length > 0) {
        setCurrentWorkflowStatus(entries[0].status);
      } else {
        setCurrentWorkflowStatus('DRAFT');
      }

      // Populate draft map for students in selected section
      const enrolled = students.filter(s => s.currentClassId === selectedClassId && (!selectedSectionId || s.currentSectionId === selectedSectionId));
      const drafts: Record<string, { marks: number; attendance: 'PRESENT' | 'ABSENT' | 'EXEMPT'; remarks: string }> = {};

      const currentExam = examinations.find(e => e.id === selectedExamId);
      const defaultMax = currentExam?.maxMarksDefault || 80;

      enrolled.forEach(stu => {
        const found = entries.find(e => e.studentId === stu.id);
        const att = found?.attendanceStatus;
        const normalizedAttendance: 'PRESENT' | 'ABSENT' | 'EXEMPT' = 
          (att === 'ABSENT' || att === 'absent') ? 'ABSENT' :
          (att === 'EXEMPT' || att === 'exempt') ? 'EXEMPT' : 'PRESENT';

        drafts[stu.id] = {
          marks: found ? found.marksObtained : defaultMax * 0.75,
          attendance: normalizedAttendance,
          remarks: found?.remarks || ''
        };
      });

      setMarkDrafts(drafts);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load marks');
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await ExaminationService.saveExamination(
        tenantId,
        {
          academicYearId: 'ay_2025_2026',
          name: newExam.name,
          term: newExam.term,
          startDate: newExam.startDate,
          endDate: newExam.endDate,
          maxMarksDefault: Number(newExam.maxMarksDefault),
          passingMarksDefault: Number(newExam.passingMarksDefault),
          gradingSchemeId: 'scheme_cbse_9pt',
          classIds: newExam.classIds.length > 0 ? newExam.classIds : classes.map(c => c.id),
          status: 'SCHEDULED'
        },
        currentUser?.email || 'admin',
        currentUser?.displayName || 'Administrator'
      );

      setSuccessMsg(`Examination "${created.name}" created successfully`);
      setShowCreateExamModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create exam');
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const selExam = examinations.find(ex => ex.id === newSchedule.examId);
    const selClass = classes.find(c => c.id === newSchedule.classId);
    const selSubject = subjects.find(s => s.id === newSchedule.subjectId);

    try {
      await ExaminationService.saveSchedule(
        tenantId,
        {
          examId: newSchedule.examId,
          examName: selExam?.name || 'Examination',
          classId: newSchedule.classId,
          className: selClass?.name || 'Class',
          subjectId: newSchedule.subjectId,
          subjectName: selSubject?.name || 'Subject',
          subjectCode: selSubject?.code || 'SUB-01',
          examDate: newSchedule.examDate,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
          roomNumber: newSchedule.roomNumber,
          invigilatorName: newSchedule.invigilatorName,
          maxMarks: Number(newSchedule.maxMarks),
          passingMarks: Number(newSchedule.passingMarks)
        },
        currentUser?.email || 'admin',
        currentUser?.displayName || 'Administrator'
      );

      setSuccessMsg(`Datesheet slot added for ${selSubject?.name} (${selClass?.name})`);
      setShowAddScheduleModal(false);
      const updatedSchedules = await ExaminationService.getSchedules(tenantId, newSchedule.examId);
      setSchedules(updatedSchedules);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add datesheet schedule');
    }
  };

  const handleSaveMarks = async (targetWorkflowStatus: MarkWorkflowStatus) => {
    const selExam = examinations.find(e => e.id === selectedExamId);
    const selClass = classes.find(c => c.id === selectedClassId);
    const selSubject = subjects.find(s => s.id === selectedSubjectId);
    if (!selExam || !selClass || !selSubject) return;

    const maxMarks = selExam.maxMarksDefault || 80;
    const passingMarks = selExam.passingMarksDefault || 27;

    const enrolled = students.filter(s => s.currentClassId === selectedClassId && (!selectedSectionId || s.currentSectionId === selectedSectionId));
    
    const entriesToSave: MarkEntry[] = enrolled.map(stu => {
      const draft = markDrafts[stu.id] || { marks: 0, attendance: 'PRESENT', remarks: '' };
      const percentage = (draft.marks / maxMarks) * 100;
      const gradeResult = GradingService.calculateGrade(percentage, gradingScheme || undefined);

      const stuName = stu.firstName 
        ? `${stu.firstName} ${stu.lastName}`.trim() 
        : (stu.personalInfo ? `${stu.personalInfo.firstName} ${stu.personalInfo.lastName}`.trim() : 'Student');

      return {
        id: `mrk_${selectedExamId}_${stu.id}_${selectedSubjectId}`,
        tenantId,
        academicYearId: 'ay_2025_2026',
        examId: selectedExamId,
        examName: selExam.name,
        studentId: stu.id,
        studentName: stuName,
        studentRollNo: stu.rollNumber,
        classId: selectedClassId,
        className: selClass.name,
        sectionId: stu.currentSectionId,
        sectionName: sections.find(s => s.id === stu.currentSectionId)?.name || 'Section',
        subjectId: selectedSubjectId,
        subjectName: selSubject.name,
        subjectCode: selSubject.code,
        marksObtained: draft.attendance === 'PRESENT' ? Number(draft.marks) : 0,
        maxMarks,
        passingMarks,
        grade: gradeResult.grade,
        gradePoint: gradeResult.gradePoint,
        attendanceStatus: draft.attendance,
        status: targetWorkflowStatus,
        remarks: draft.remarks,
        enteredBy: currentUser?.displayName || 'Faculty Instructor',
        enteredAt: new Date().toISOString(),
        verifiedBy: targetWorkflowStatus === 'VERIFIED' || targetWorkflowStatus === 'APPROVED' || targetWorkflowStatus === 'PUBLISHED' ? currentUser?.displayName : undefined,
        verifiedAt: targetWorkflowStatus === 'VERIFIED' ? new Date().toISOString() : undefined,
        approvedBy: targetWorkflowStatus === 'APPROVED' || targetWorkflowStatus === 'PUBLISHED' ? currentUser?.displayName : undefined,
        approvedAt: targetWorkflowStatus === 'APPROVED' || targetWorkflowStatus === 'PUBLISHED' ? new Date().toISOString() : undefined
      };
    });

    try {
      await ExaminationService.saveMarks(tenantId, entriesToSave, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setCurrentWorkflowStatus(targetWorkflowStatus);
      setSuccessMsg(`Marks ledger transitioned to state: ${targetWorkflowStatus}`);
      await loadMarksForSelection();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save marks');
    }
  };

  const getWorkflowBadge = (status: MarkWorkflowStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">PUBLISHED (Live)</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full font-bold text-xs">APPROVED (Principal)</span>;
      case 'VERIFIED':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-xs">VERIFIED (Coordinator)</span>;
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">SUBMITTED (Teacher)</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs">DRAFT</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Summative Evaluation & Workflow
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Examinations & Marks Governance</h1>
          <p className="text-slate-400 text-sm mt-1">
            Standardized examination scheduling, automated datesheets, and multi-stage marks authorization workflow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setNavigationActiveTab('examination_ops')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
            id="launch-exam-ops-btn"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Live Operations Desk</span>
          </button>
          {canCreateExam && (
            <>
              <button
                onClick={() => setShowAddScheduleModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-medium border border-slate-700 transition"
              >
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Add Datesheet Slot</span>
              </button>
              <button
                onClick={() => setShowCreateExamModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Examination</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3 print:hidden">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'exams'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Examinations Master ({examinations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('datesheet')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'datesheet'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Datesheet & Hall Schedule ({schedules.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'marks'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Marks Entry & Multi-Stage Approval</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-medium">Loading examination records...</p>
        </div>
      ) : activeTab === 'exams' ? (
        /* Tab 1: Examination Master */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examinations.map(exam => {
            const examSchedules = schedules.filter(s => s.examId === exam.id);
            return (
              <div key={exam.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                      {exam.term?.replace('_', ' ') || 'Unknown'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-1">{exam.name}</h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                    exam.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {exam.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Exam Duration:</span>
                    <strong className="text-slate-800">{exam.startDate} to {exam.endDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Marks Policy:</span>
                    <strong className="text-slate-800">Max {exam.maxMarksDefault} (Pass {exam.passingMarksDefault})</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Scheduled Papers: <strong className="text-slate-900">{examSchedules.length}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setActiveTab('marks');
                    }}
                    className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:underline"
                  >
                    <span>Enter / Review Marks</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'datesheet' ? (
        /* Tab 2: Datesheet Master */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Official Institutional Datesheet & Hall Matrix</h3>
              <p className="text-xs text-slate-500">Comprehensive schedule of examination sessions, invigilation and venues.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Datesheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject & Code</th>
                  <th className="py-3 px-4">Venue / Hall</th>
                  <th className="py-3 px-4">Invigilator</th>
                  <th className="py-3 px-4 text-center">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedules.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                      <div>{s.examDate}</div>
                      <div className="text-slate-400 font-normal">{s.startTime} - {s.endTime}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{s.className}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{s.subjectName}</span>{' '}
                      <span className="text-xs text-slate-400">({s.subjectCode})</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.roomNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.invigilatorName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 text-xs">
                      {s.maxMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 3: Marks Entry & Multi-Stage Approval Workflow */
        <div className="space-y-4">
          {/* Workflow Status Bar & Filter Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Examination:</label>
                  <select
                    value={selectedExamId}
                    onChange={e => setSelectedExamId(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    {examinations.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Class:</label>
                  <select
                    value={selectedClassId}
                    onChange={e => {
                      const cid = e.target.value;
                      setSelectedClassId(cid);
                      const validSecs = sections.filter(s => s.classId === cid);
                      setSelectedSectionId(validSecs[0]?.id || '');
                    }}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Section:</label>
                  <select
                    value={selectedSectionId}
                    onChange={e => setSelectedSectionId(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    {sections
                      .filter(s => !selectedClassId || s.classId === selectedClassId)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject:</label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Workflow Status & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Current State:</span>
                  {getWorkflowBadge(currentWorkflowStatus)}
                </div>

                {/* Multi-Stage Transition Actions */}
                <div className="flex items-center gap-2">
                  {canEnterMarks && (currentWorkflowStatus === 'DRAFT' || currentWorkflowStatus === 'ENTERED') && (
                    <>
                      <button
                        onClick={() => handleSaveMarks('DRAFT')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Draft</span>
                      </button>
                      <button
                        onClick={() => handleSaveMarks('SUBMITTED')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit for Verification</span>
                      </button>
                    </>
                  )}

                  {canVerifyMarks && currentWorkflowStatus === 'SUBMITTED' && (
                    <button
                      onClick={() => handleSaveMarks('VERIFIED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Verify Marks (Coordinator)</span>
                    </button>
                  )}

                  {canApproveMarks && currentWorkflowStatus === 'VERIFIED' && (
                    <button
                      onClick={() => handleSaveMarks('APPROVED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve Marks (Principal)</span>
                    </button>
                  )}

                  {canPublishMarks && (currentWorkflowStatus === 'APPROVED' || currentWorkflowStatus === 'VERIFIED') && (
                    <button
                      onClick={() => handleSaveMarks('PUBLISHED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Publish to Students & Parents</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Workflow Progress Steps Visual */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className={`font-semibold ${currentWorkflowStatus === 'DRAFT' ? 'text-sky-600' : 'text-slate-400'}`}>1. Teacher Draft</span>
              <span>→</span>
              <span className={`font-semibold ${currentWorkflowStatus === 'SUBMITTED' ? 'text-amber-600' : 'text-slate-400'}`}>2. Submitted</span>
              <span>→</span>
              <span className={`font-semibold ${currentWorkflowStatus === 'VERIFIED' ? 'text-purple-600' : 'text-slate-400'}`}>3. Coordinator Verified</span>
              <span>→</span>
              <span className={`font-semibold ${currentWorkflowStatus === 'APPROVED' ? 'text-sky-600' : 'text-slate-400'}`}>4. Principal Approved</span>
              <span>→</span>
              <span className={`font-semibold ${currentWorkflowStatus === 'PUBLISHED' ? 'text-emerald-600' : 'text-slate-400'}`}>5. Published</span>
            </div>
          </div>

          {/* Marks Entry Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Full Name</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4 w-32">Marks (Max: {examinations.find(e => e.id === selectedExamId)?.maxMarksDefault || 80})</th>
                    <th className="py-3 px-4 text-center">Calculated Grade</th>
                    <th className="py-3 px-4 text-center">Grade Point</th>
                    <th className="py-3 px-4">Teacher Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => s.currentClassId === selectedClassId && (!selectedSectionId || s.currentSectionId === selectedSectionId))
                    .map(stu => {
                      const draft = markDrafts[stu.id] || { marks: 0, attendance: 'PRESENT', remarks: '' };
                      const max = examinations.find(e => e.id === selectedExamId)?.maxMarksDefault || 80;
                      const percentage = (draft.marks / max) * 100;
                      const gradeResult = GradingService.calculateGrade(percentage, gradingScheme || undefined);
                      const isLocked = currentWorkflowStatus === 'PUBLISHED' && !canPublishMarks;

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                            {stu.rollNumber}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900 text-xs">
                            {stu.personalInfo.firstName} {stu.personalInfo.lastName}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              disabled={isLocked}
                              value={draft.attendance}
                              onChange={e => {
                                setMarkDrafts({
                                  ...markDrafts,
                                  [stu.id]: { ...draft, attendance: e.target.value as any }
                                });
                              }}
                              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium focus:ring-2 focus:ring-sky-500"
                            >
                              <option value="PRESENT">Present</option>
                              <option value="ABSENT">Absent</option>
                              <option value="EXEMPT">Exempt (Medical)</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min={0}
                              max={max}
                              disabled={draft.attendance !== 'PRESENT' || isLocked}
                              value={draft.marks}
                              onChange={e => {
                                setMarkDrafts({
                                  ...markDrafts,
                                  [stu.id]: { ...draft, marks: Number(e.target.value) }
                                });
                              }}
                              className="w-24 px-2 py-1 text-xs border border-slate-300 rounded font-bold text-center text-slate-900 focus:ring-2 focus:ring-sky-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            {draft.attendance === 'PRESENT' ? (
                              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-xs font-bold">
                                {gradeResult.grade}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-xs font-bold">
                                {draft.attendance}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-800 text-xs">
                            {draft.attendance === 'PRESENT' ? gradeResult.gradePoint : 0}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              disabled={isLocked}
                              placeholder="Remarks..."
                              value={draft.remarks}
                              onChange={e => {
                                setMarkDrafts({
                                  ...markDrafts,
                                  [stu.id]: { ...draft, remarks: e.target.value }
                                });
                              }}
                              className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-sky-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Examination */}
      {showCreateExamModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Create Examination Cycle</h3>
                <p className="text-xs text-slate-400">Summative assessment master with academic terms & policies</p>
              </div>
              <button onClick={() => setShowCreateExamModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Summative Examination 2025–26"
                  value={newExam.name}
                  onChange={e => setNewExam({ ...newExam, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Term *</label>
                <select
                  value={newExam.term}
                  onChange={e => setNewExam({ ...newExam, term: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="term_1">Term 1 (Mid-Term)</option>
                  <option value="term_2">Term 2 (Final / Annual)</option>
                  <option value="pre_board">Pre-Board Assessment</option>
                  <option value="unit_test">Summative Unit Evaluation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newExam.startDate}
                    onChange={e => setNewExam({ ...newExam, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newExam.endDate}
                    onChange={e => setNewExam({ ...newExam, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Max Marks *</label>
                  <input
                    type="number"
                    min={1}
                    value={newExam.maxMarksDefault}
                    onChange={e => setNewExam({ ...newExam, maxMarksDefault: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Pass Threshold *</label>
                  <input
                    type="number"
                    min={1}
                    value={newExam.passingMarksDefault}
                    onChange={e => setNewExam({ ...newExam, passingMarksDefault: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateExamModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Create Examination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Datesheet Slot */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Add Datesheet Schedule Slot</h3>
                <p className="text-xs text-slate-400">Map examination paper, timing, venue hall and invigilator</p>
              </div>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Examination *</label>
                <select
                  value={newSchedule.examId}
                  onChange={e => setNewSchedule({ ...newSchedule, examId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {examinations.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class *</label>
                  <select
                    value={newSchedule.classId}
                    onChange={e => setNewSchedule({ ...newSchedule, classId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <select
                    value={newSchedule.subjectId}
                    onChange={e => setNewSchedule({ ...newSchedule, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={newSchedule.examDate}
                    onChange={e => setNewSchedule({ ...newSchedule, examDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSchedule.startTime}
                    onChange={e => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSchedule.endTime}
                    onChange={e => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Examination Hall</label>
                  <input
                    type="text"
                    value={newSchedule.roomNumber}
                    onChange={e => setNewSchedule({ ...newSchedule, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Invigilator</label>
                  <input
                    type="text"
                    value={newSchedule.invigilatorName}
                    onChange={e => setNewSchedule({ ...newSchedule, invigilatorName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Add to Datesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
