import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  User, 
  FileText, 
  ExternalLink,
  Award,
  ChevronRight,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AssignmentService, TeacherService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { StudentService } from '../../services/studentService';
import { 
  Assignment, 
  AssignmentSubmission, 
  ClassGrade, 
  Section, 
  Subject, 
  TeacherProfile,
  Student
} from '../../types';

export const AssignmentManagementView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  // Selected assignment for submissions view / grading
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formState, setFormState] = useState<{
    title: string;
    description: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    teacherId: string;
    assignedDate: string;
    dueDate: string;
    maxMarks: number;
    allowLateSubmission: boolean;
    submissionType: 'online_text' | 'file_upload' | 'both';
  }>({
    title: '',
    description: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    teacherId: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    maxMarks: 20,
    allowLateSubmission: true,
    submissionType: 'both'
  });

  const canCreate = userPermissions.includes('platform.admin') || userPermissions.includes('assignment.create');
  const canGrade = userPermissions.includes('platform.admin') || userPermissions.includes('assignment.grade');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [aList, cList, secList, subList, tList, stuList] = await Promise.all([
        AssignmentService.getAssignments(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        AcademicService.getSubjects(tenantId),
        TeacherService.getTeachers(tenantId),
        StudentService.getStudents(tenantId)
      ]);
      setAssignments(aList);
      setClasses(cList);
      setSections(secList);
      setSubjects(subList);
      setTeachers(tList);
      setStudents(stuList);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load assignment dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    try {
      const subs = await AssignmentService.getSubmissions(tenantId, assignment.id);
      setSubmissions(subs);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load student submissions');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.classId || !formState.subjectId) {
      setErrorMsg('Please complete all required fields');
      return;
    }

    const selectedClass = classes.find(c => c.id === formState.classId);
    const selectedSection = sections.find(s => s.id === formState.sectionId);
    const selectedSubject = subjects.find(s => s.id === formState.subjectId);
    const selectedTeacher = teachers.find(t => t.id === formState.teacherId);

    const newAssignment: Assignment = {
      id: `asg_${Date.now()}`,
      tenantId,
      academicYearId: 'ay_2025_2026',
      classId: formState.classId,
      className: selectedClass?.name || 'Class',
      sectionId: formState.sectionId,
      sectionName: selectedSection?.name || 'Section',
      subjectId: formState.subjectId,
      subjectName: selectedSubject?.name || 'Subject',
      teacherId: formState.teacherId || teachers[0]?.id || 'tch_01',
      teacherName: selectedTeacher?.employeeId || currentUser?.displayName || 'Faculty',
      title: formState.title,
      description: formState.description,
      assignedDate: formState.assignedDate,
      dueDate: formState.dueDate,
      maxMarks: Number(formState.maxMarks),
      status: 'OPEN',
      allowLateSubmission: formState.allowLateSubmission,
      submissionType: formState.submissionType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await AssignmentService.saveAssignment(tenantId, newAssignment, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg(`Assignment "${newAssignment.title}" published`);
      setShowCreateModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish assignment');
    }
  };

  const handleOpenGradeModal = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.marksObtained ?? (selectedAssignment?.maxMarks || 20));
    setGradeFeedback(sub.feedback || 'Excellent work. Well presented solution.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      await AssignmentService.gradeSubmission(
        tenantId,
        gradingSubmission.id,
        Number(gradeMarks),
        gradeFeedback,
        currentUser?.displayName || 'Faculty Reviewer',
        currentUser?.email || 'admin'
      );
      setSuccessMsg(`Graded submission for ${gradingSubmission.studentName}`);
      setGradingSubmission(null);
      if (selectedAssignment) {
        const subs = await AssignmentService.getSubmissions(tenantId, selectedAssignment.id);
        setSubmissions(subs);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit grade');
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesClass = classFilter === 'ALL' || a.classId === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Formative Homework & Tasks
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assignment & Homework Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Publish academic assignments, track student digital submissions, and evaluate coursework with rubrics.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => {
              setFormState({
                title: '',
                description: '',
                classId: classes[0]?.id || '',
                sectionId: sections[0]?.id || '',
                subjectId: subjects[0]?.id || '',
                teacherId: teachers[0]?.id || '',
                assignedDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                maxMarks: 20,
                allowLateSubmission: true,
                submissionType: 'both'
              });
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
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

      {/* Main Layout: List & Submissions Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignments List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assignments by title or subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="REVIEWED">Reviewed</option>
              </select>
              <select
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignments Roster */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="font-medium">Loading assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No assignments found</h3>
              <p className="text-sm text-slate-500 mt-1">Create an assignment to assign tasks to enrolled students.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map(asg => {
                const isSelected = selectedAssignment?.id === asg.id;
                const isOverdue = new Date(asg.dueDate) < new Date();

                return (
                  <div
                    key={asg.id}
                    onClick={() => handleOpenSubmissions(asg)}
                    className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-sky-50/50 border-sky-400 ring-2 ring-sky-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                              {asg.className} ({asg.sectionName})
                            </span>
                            <span className="text-xs font-medium text-sky-700">
                              {asg.subjectName}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                            {asg.maxMarks} Marks
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                            asg.status === 'OPEN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {asg.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {asg.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{asg.dueDate}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{asg.teacherName}</span>
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:underline">
                        <span>Review Submissions</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Submissions & Grading Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              {selectedAssignment ? selectedAssignment.title : 'Submissions Panel'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedAssignment 
                ? `Max Marks: ${selectedAssignment.maxMarks} • Due ${selectedAssignment.dueDate}` 
                : 'Select an assignment on the left to evaluate student submissions.'}
            </p>
          </div>

          {!selectedAssignment ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Click any assignment card to inspect student homework submissions and record grades.
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No submissions uploaded yet for this assignment.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {submissions.map(sub => {
                return (
                  <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{sub.studentName}</div>
                        <div className="text-[11px] text-slate-400">Roll: {sub.studentRollNo}</div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        sub.status === 'GRADED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    {sub.submissionText && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 italic">
                        "{sub.submissionText}"
                      </p>
                    )}

                    {sub.fileUrl && (
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-600 font-medium hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Attached Solution File</span>
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        {sub.status === 'GRADED' ? (
                          <div className="text-emerald-700 font-bold">
                            Score: {sub.marksObtained} / {selectedAssignment.maxMarks}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending Evaluation</span>
                        )}
                      </div>

                      {canGrade && (
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium text-xs transition"
                        >
                          {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Submission'}
                        </button>
                      )}
                    </div>

                    {sub.feedback && (
                      <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                        <strong>Teacher Remark:</strong> {sub.feedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Publish New Assignment</h3>
                <p className="text-xs text-slate-400">Distribute coursework, due dates, and evaluation criteria</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Problem Set 3: Quadratic Formulas"
                  value={formState.title}
                  onChange={e => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Instructions for students regarding format, questions, and reference chapters..."
                  value={formState.description}
                  onChange={e => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Curriculum Subject *</label>
                  <select
                    value={formState.subjectId}
                    onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty</label>
                  <select
                    value={formState.teacherId}
                    onChange={e => setFormState({ ...formState, teacherId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.employeeId} ({t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formState.dueDate}
                    onChange={e => setFormState({ ...formState, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Marks *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={formState.maxMarks}
                    onChange={e => setFormState({ ...formState, maxMarks: Number(e.target.value) })}
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Submission */}
      {gradingSubmission && selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Grade Submission</h3>
                <p className="text-xs text-slate-400">Student: {gradingSubmission.studentName}</p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Marks Awarded (Max: {selectedAssignment.maxMarks}) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={selectedAssignment.maxMarks}
                  value={gradeMarks}
                  onChange={e => setGradeMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Evaluation Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={e => setGradeFeedback(e.target.value)}
                  placeholder="Qualitative remarks for student guidance..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Confirm Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
