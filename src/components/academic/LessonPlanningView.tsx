import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Monitor, 
  BookOpen, 
  User, 
  Calendar, 
  AlertCircle, 
  X,
  Edit3,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LessonPlanService, TeacherService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { LessonPlan, LessonPlanStatus, ClassGrade, Section, Subject, TeacherProfile } from '../../types';

export const LessonPlanningView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LessonPlanStatus>('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  // Modals & form state
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formState, setFormState] = useState<{
    title: string;
    topic: string;
    curriculumUnit: string;
    classId: string;
    subjectId: string;
    teacherId: string;
    lessonDate: string;
    estimatedDurationMinutes: number;
    smartClassroomReady: boolean;
    learningObjectives: string[];
    teachingMethod: string;
    requiredMaterials: string[];
    notes: string;
    status: LessonPlanStatus;
  }>({
    title: '',
    topic: '',
    curriculumUnit: '',
    classId: '',
    subjectId: '',
    teacherId: '',
    lessonDate: new Date().toISOString().split('T')[0],
    estimatedDurationMinutes: 45,
    smartClassroomReady: true,
    learningObjectives: [''],
    teachingMethod: '',
    requiredMaterials: [''],
    notes: '',
    status: 'PLANNED'
  });

  const canEdit = userPermissions.includes('platform.admin') || userPermissions.includes('lesson_plan.create') || userPermissions.includes('lesson_plan.edit');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [lList, cList, subList, tList] = await Promise.all([
        LessonPlanService.getLessonPlans(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSubjects(tenantId),
        TeacherService.getTeachers(tenantId)
      ]);
      setLessonPlans(lList);
      setClasses(cList);
      setSubjects(subList);
      setTeachers(tList);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load lesson plans');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormState({
      title: '',
      topic: '',
      curriculumUnit: 'Unit 1',
      classId: classes[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      teacherId: teachers[0]?.id || '',
      lessonDate: new Date().toISOString().split('T')[0],
      estimatedDurationMinutes: 45,
      smartClassroomReady: true,
      learningObjectives: [''],
      teachingMethod: '',
      requiredMaterials: [''],
      notes: '',
      status: 'PLANNED'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormState({
      title: plan.title,
      topic: plan.topic,
      curriculumUnit: plan.curriculumUnit,
      classId: plan.classId,
      subjectId: plan.subjectId,
      teacherId: plan.teacherId,
      lessonDate: plan.lessonDate,
      estimatedDurationMinutes: plan.estimatedDurationMinutes,
      smartClassroomReady: plan.smartClassroomReady,
      learningObjectives: plan.learningObjectives.length > 0 ? plan.learningObjectives : [''],
      teachingMethod: plan.teachingMethod,
      requiredMaterials: plan.requiredMaterials.length > 0 ? plan.requiredMaterials : [''],
      notes: plan.notes || '',
      status: plan.status
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.topic) {
      setErrorMsg('Please specify Lesson Title and Topic');
      return;
    }

    const selectedClass = classes.find(c => c.id === formState.classId);
    const selectedSubject = subjects.find(s => s.id === formState.subjectId);
    const selectedTeacher = teachers.find(t => t.id === formState.teacherId);

    const plan: LessonPlan = {
      id: editingPlan?.id || `lp_${Date.now()}`,
      tenantId,
      academicYearId: 'ay_2025_2026',
      classId: formState.classId,
      className: selectedClass?.name || 'Class',
      sectionId: 'sec_10a',
      sectionName: 'Section A',
      subjectId: formState.subjectId,
      subjectName: selectedSubject?.name || 'Subject',
      teacherId: formState.teacherId,
      teacherName: selectedTeacher?.employeeId || currentUser?.displayName || 'Faculty',
      topic: formState.topic,
      title: formState.title,
      curriculumUnit: formState.curriculumUnit,
      smartClassroomReady: formState.smartClassroomReady,
      learningObjectives: formState.learningObjectives.filter(Boolean),
      teachingMethod: formState.teachingMethod,
      requiredMaterials: formState.requiredMaterials.filter(Boolean),
      estimatedDurationMinutes: Number(formState.estimatedDurationMinutes),
      notes: formState.notes,
      lessonDate: formState.lessonDate,
      status: formState.status,
      createdAt: editingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await LessonPlanService.saveLessonPlan(tenantId, plan, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg(`Lesson plan "${plan.title}" saved successfully`);
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save lesson plan');
    }
  };

  const handleToggleStatus = async (plan: LessonPlan) => {
    const nextStatus: LessonPlanStatus = plan.status === 'COMPLETED' ? 'PLANNED' : 'COMPLETED';
    try {
      await LessonPlanService.updateStatus(tenantId, plan.id, nextStatus, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg(`Lesson plan marked as ${nextStatus}`);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update lesson plan status');
    }
  };

  const filteredPlans = lessonPlans.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.curriculumUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subjectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesClass = classFilter === 'ALL' || p.classId === classFilter;
    const matchesSubject = subjectFilter === 'ALL' || p.subjectId === subjectFilter;

    return matchesSearch && matchesStatus && matchesClass && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Pedagogy & Curriculum Delivery
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Lesson Planning & Smart Syllabus</h1>
          <p className="text-slate-400 text-sm mt-1">
            Unit-by-unit syllabus objectives, interactive media teaching guides, and pedagogical tracking for secondary curricula.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Lesson Plan</span>
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

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, unit, learning objective, or subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Drafts</option>
            <option value="PLANNED">Planned</option>
            <option value="COMPLETED">Completed</option>
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

          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lesson Plans Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-medium">Loading syllabus & lesson plans...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No lesson plans found</h3>
          <p className="text-sm text-slate-500 mt-1">Create a new lesson plan to begin organizing curriculum delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map(plan => {
            return (
              <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                        {plan.curriculumUnit}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{plan.title}</h3>
                      <p className="text-xs text-sky-700 font-medium">{plan.topic}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {plan.smartClassroomReady && (
                        <span className="p-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-medium flex items-center gap-1" title="Smart Interactive Classroom Ready">
                          <Monitor className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        plan.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : plan.status === 'PLANNED'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{plan.className} — {plan.subjectName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{plan.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date: {plan.lessonDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Duration: {plan.estimatedDurationMinutes} mins</span>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  {plan.learningObjectives.length > 0 && (
                    <div className="space-y-1.5 text-xs text-slate-700 mb-3">
                      <div className="font-semibold text-slate-900">Key Learning Objectives:</div>
                      <ul className="space-y-1 pl-1">
                        {plan.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-slate-600">
                            <span className="text-sky-600 font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plan.teachingMethod && (
                    <div className="text-xs text-slate-600 mb-2">
                      <strong className="text-slate-800">Pedagogical Method:</strong> {plan.teachingMethod}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(plan)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      plan.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{plan.status === 'COMPLETED' ? 'Mark as Planned' : 'Mark as Delivered'}</span>
                  </button>

                  {canEdit && (
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Plan</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create/Edit Plan */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">
                  {editingPlan ? 'Edit Lesson Plan' : 'Create Unit Lesson Plan'}
                </h3>
                <p className="text-xs text-slate-400">Specify curriculum objectives, media aids and teaching strategies</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lesson Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4: Finding Roots & Discriminant Analysis"
                  value={formState.title}
                  onChange={e => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Curriculum Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit 4 - Algebra"
                    value={formState.curriculumUnit}
                    onChange={e => setFormState({ ...formState, curriculumUnit: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Chapter *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quadratic Equations"
                    value={formState.topic}
                    onChange={e => setFormState({ ...formState, topic: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class *</label>
                  <select
                    value={formState.classId}
                    onChange={e => setFormState({ ...formState, classId: e.target.value })}
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
                    value={formState.subjectId}
                    onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={formState.lessonDate}
                    onChange={e => setFormState({ ...formState, lessonDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formState.estimatedDurationMinutes}
                    onChange={e => setFormState({ ...formState, estimatedDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formState.status}
                    onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PLANNED">Planned</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Learning Objectives</label>
                {formState.learningObjectives.map((obj, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Objective ${idx + 1}...`}
                      value={obj}
                      onChange={e => {
                        const copy = [...formState.learningObjectives];
                        copy[idx] = e.target.value;
                        setFormState({ ...formState, learningObjectives: copy });
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                    {formState.learningObjectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormState({
                            ...formState,
                            learningObjectives: formState.learningObjectives.filter((_, i) => i !== idx)
                          });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormState({ ...formState, learningObjectives: [...formState.learningObjectives, ''] })}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold mt-1"
                >
                  + Add Objective
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teaching & Demonstration Method</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Optical bench practical lab demonstration followed by GeoGebra ray simulation"
                  value={formState.teachingMethod}
                  onChange={e => setFormState({ ...formState, teachingMethod: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="smartClass"
                  checked={formState.smartClassroomReady}
                  onChange={e => setFormState({ ...formState, smartClassroomReady: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <label htmlFor="smartClass" className="text-xs font-medium text-slate-800">
                  Includes Smartboard & Audio-Visual Media Module
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Save Lesson Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
