import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  User, 
  BookOpen,
  Award,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AssessmentService, TeacherService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import { 
  Assessment, 
  AssessmentResult, 
  AssessmentType, 
  ClassGrade, 
  Section, 
  Subject, 
  TeacherProfile,
  Student
} from '../../types';

export const AssessmentManagementView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected assessment for score sheet
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, { marks: number; isAbsent: boolean; remarks: string }>>({});

  // Modals & UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formState, setFormState] = useState<{
    name: string;
    type: AssessmentType;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    assessmentDate: string;
    maxMarks: number;
    passingMarks: number;
    weightagePercentage: number;
  }>({
    name: '',
    type: 'class_test',
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    maxMarks: 25,
    passingMarks: 9,
    weightagePercentage: 10
  });

  const canCreate = userPermissions.includes('platform.admin') || userPermissions.includes('assessment.create');
  const canRecord = userPermissions.includes('platform.admin') || userPermissions.includes('assessment.record');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [assList, cList, secList, subList, tList, stuList] = await Promise.all([
        AssessmentService.getAssessments(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        AcademicService.getSubjects(tenantId),
        TeacherService.getTeachers(tenantId),
        StudentService.getStudents(tenantId)
      ]);
      setAssessments(assList);
      setClasses(cList);
      setSections(secList);
      setSubjects(subList);
      setTeachers(tList);
      setStudents(stuList);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load continuous assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScoreSheet = async (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    try {
      const res = await AssessmentService.getResults(tenantId, assessment.id);
      setResults(res);

      // Build draft scores map from enrolled students
      const enrolledInClass = students.filter(s => s.currentClassId === assessment.classId && s.currentSectionId === assessment.sectionId);
      const drafts: Record<string, { marks: number; isAbsent: boolean; remarks: string }> = {};

      enrolledInClass.forEach(stu => {
        const existing = res.find(r => r.studentId === stu.id);
        drafts[stu.id] = {
          marks: existing ? existing.marksObtained : 0,
          isAbsent: existing ? existing.isAbsent : false,
          remarks: existing?.remarks || ''
        };
      });

      setScoreDrafts(drafts);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load student score sheet');
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.classId || !formState.subjectId) {
      setErrorMsg('Please complete all assessment fields');
      return;
    }

    const selectedClass = classes.find(c => c.id === formState.classId);
    const selectedSection = sections.find(s => s.id === formState.sectionId);
    const selectedSubject = subjects.find(s => s.id === formState.subjectId);
    const selectedTeacher = teachers.find(t => t.id === formState.teacherId);

    const newAssessment: Assessment = {
      id: `ass_${Date.now()}`,
      tenantId,
      academicYearId: 'ay_2025_2026',
      name: formState.name,
      type: formState.type,
      classId: formState.classId,
      className: selectedClass?.name || 'Class',
      sectionId: formState.sectionId,
      sectionName: selectedSection?.name || 'Section',
      subjectId: formState.subjectId,
      subjectName: selectedSubject?.name || 'Subject',
      teacherId: formState.teacherId || teachers[0]?.id || 'tch_01',
      teacherName: selectedTeacher?.employeeId || currentUser?.displayName || 'Faculty',
      assessmentDate: formState.assessmentDate,
      maxMarks: Number(formState.maxMarks),
      passingMarks: Number(formState.passingMarks),
      weightagePercentage: Number(formState.weightagePercentage),
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await AssessmentService.saveAssessment(tenantId, newAssessment, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg(`Continuous assessment "${newAssessment.name}" scheduled`);
      setShowCreateModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save assessment');
    }
  };

  const handleSaveScoreSheet = async () => {
    if (!selectedAssessment) return;

    const classStudents = students.filter(s => s.currentClassId === selectedAssessment.classId && s.currentSectionId === selectedAssessment.sectionId);
    const recordsToSave: AssessmentResult[] = classStudents.map(stu => {
      const draft = scoreDrafts[stu.id] || { marks: 0, isAbsent: false, remarks: '' };
      return {
        id: `asr_${selectedAssessment.id}_${stu.id}`,
        tenantId,
        assessmentId: selectedAssessment.id,
        studentId: stu.id,
        studentName: `${stu.personalInfo.firstName} ${stu.personalInfo.lastName}`,
        studentRollNo: stu.rollNumber,
        marksObtained: draft.isAbsent ? 0 : Number(draft.marks),
        maxMarks: selectedAssessment.maxMarks,
        passingMarks: selectedAssessment.passingMarks,
        isAbsent: draft.isAbsent,
        isPassed: !draft.isAbsent && draft.marks >= selectedAssessment.passingMarks,
        remarks: draft.remarks,
        recordedBy: currentUser?.displayName || 'Faculty Evaluator',
        recordedAt: new Date().toISOString()
      };
    });

    try {
      await AssessmentService.recordResults(tenantId, selectedAssessment.id, recordsToSave, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg('All student assessment results recorded and verified successfully');
      await handleOpenScoreSheet(selectedAssessment);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record assessment scores');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Continuous & Comprehensive Evaluation (CCE)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Formative & Continuous Assessments</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage unit tests, practicals, viva-voce, and periodic formative testing with immediate passing criteria analysis.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => {
              setFormState({
                name: '',
                type: 'unit_test',
                classId: classes[0]?.id || '',
                sectionId: sections[0]?.id || '',
                subjectId: subjects[0]?.id || '',
                teacherId: teachers[0]?.id || '',
                assessmentDate: new Date().toISOString().split('T')[0],
                maxMarks: 25,
                passingMarks: 9,
                weightagePercentage: 10
              });
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Assessment</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{successMsg}</div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Assessments & Active Marks Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: List of Assessments */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>Assessment Schedules</span>
            <span className="text-xs text-sky-600 font-semibold">{assessments.length}</span>
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading assessments...</div>
          ) : assessments.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No continuous assessments scheduled.
            </div>
          ) : (
            assessments.map(ass => {
              const isSelected = selectedAssessment?.id === ass.id;
              return (
                <div
                  key={ass.id}
                  onClick={() => handleOpenScoreSheet(ass)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-100'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                        {ass.type?.replace('_', ' ') || 'Unknown'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{ass.name}</h4>
                      <p className="text-xs text-sky-700 font-medium">{ass.subjectName}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      ass.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ass.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{ass.className} ({ass.sectionName})</span>
                    <span className="font-semibold text-slate-700">Max: {ass.maxMarks} M</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Cols: Assessment Marks Sheet */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {selectedAssessment ? selectedAssessment.name : 'Score Entry Sheet'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAssessment 
                  ? `${selectedAssessment.className} • ${selectedAssessment.subjectName} • Max: ${selectedAssessment.maxMarks} • Pass: ${selectedAssessment.passingMarks}`
                  : 'Select an assessment schedule on the left to enter or review student marks.'}
              </p>
            </div>

            {selectedAssessment && canRecord && (
              <button
                onClick={handleSaveScoreSheet}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Scores</span>
              </button>
            )}
          </div>

          {!selectedAssessment ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              Select an assessment above to open the class score ledger.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 w-28">Marks ({selectedAssessment.maxMarks})</th>
                    <th className="py-2.5 px-3 text-center">Absent</th>
                    <th className="py-2.5 px-3 text-center">Result</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter(s => s.currentClassId === selectedAssessment.classId && s.currentSectionId === selectedAssessment.sectionId)
                    .map(stu => {
                      const draft = scoreDrafts[stu.id] || { marks: 0, isAbsent: false, remarks: '' };
                      const isPassed = !draft.isAbsent && draft.marks >= selectedAssessment.passingMarks;

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 text-xs">
                            {stu.rollNumber}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 text-xs">
                            {stu.personalInfo.firstName} {stu.personalInfo.lastName}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              max={selectedAssessment.maxMarks}
                              disabled={draft.isAbsent || !canRecord}
                              value={draft.marks}
                              onChange={e => {
                                setScoreDrafts({
                                  ...scoreDrafts,
                                  [stu.id]: { ...draft, marks: Number(e.target.value) }
                                });
                              }}
                              className={`w-20 px-2 py-1 text-xs border rounded font-bold text-center focus:ring-2 focus:ring-sky-500 ${
                                draft.isAbsent ? 'bg-slate-100 text-slate-400' : 'border-slate-300 text-slate-900'
                              }`}
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={draft.isAbsent}
                              disabled={!canRecord}
                              onChange={e => {
                                setScoreDrafts({
                                  ...scoreDrafts,
                                  [stu.id]: { ...draft, isAbsent: e.target.checked }
                                });
                              }}
                              className="rounded text-rose-600 focus:ring-rose-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {draft.isAbsent ? (
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                                ABSENT
                              </span>
                            ) : isPassed ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                PASS
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                FAIL
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              placeholder="Notes..."
                              disabled={!canRecord}
                              value={draft.remarks}
                              onChange={e => {
                                setScoreDrafts({
                                  ...scoreDrafts,
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
          )}
        </div>
      </div>

      {/* Modal: Schedule Assessment */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Schedule Continuous Assessment</h3>
                <p className="text-xs text-slate-400">Class test, unit practical, viva or project submission</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit Test 2: Differential Calculus & Vectors"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Type *</label>
                  <select
                    value={formState.type}
                    onChange={e => setFormState({ ...formState, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="class_test">Class Test (Daily/Weekly)</option>
                    <option value="unit_test">Unit Test</option>
                    <option value="practical">Laboratory Practical</option>
                    <option value="viva">Oral / Viva-Voce</option>
                    <option value="project">Project / Portfolio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Date *</label>
                  <input
                    type="date"
                    required
                    value={formState.assessmentDate}
                    onChange={e => setFormState({ ...formState, assessmentDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
                  <select
                    value={formState.classId}
                    onChange={e => {
                      const cid = e.target.value;
                      const validSecs = sections.filter(s => s.classId === cid);
                      setFormState({
                        ...formState,
                        classId: cid,
                        sectionId: validSecs[0]?.id || ''
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section *</label>
                  <select
                    value={formState.sectionId}
                    onChange={e => setFormState({ ...formState, sectionId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {sections
                      .filter(s => !formState.classId || s.classId === formState.classId)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <select
                  value={formState.subjectId}
                  onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formState.maxMarks}
                    onChange={e => setFormState({ ...formState, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passing Marks *</label>
                  <input
                    type="number"
                    min={1}
                    max={formState.maxMarks}
                    value={formState.passingMarks}
                    onChange={e => setFormState({ ...formState, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formState.weightagePercentage}
                    onChange={e => setFormState({ ...formState, weightagePercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Schedule Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
