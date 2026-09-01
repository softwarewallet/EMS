import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AcademicService } from '../../services/academicService';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AcademicYear, ClassGrade, Section, Subject } from '../../types';
import { BookOpen, Calendar, Plus, Layers, UserCheck, CheckCircle2, BookmarkCheck } from 'lucide-react';

export const AcademicStructureView: React.FC = () => {
  const { currentTenant, campuses } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'calendar'>('classes');

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Forms State
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classOrder, setClassOrder] = useState(10);

  const [sectionClassId, setSectionClassId] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [sectionCode, setSectionCode] = useState('');
  const [sectionRoom, setSectionRoom] = useState('');
  const [sectionTeacher, setSectionTeacher] = useState('');
  const [sectionCap, setSectionCap] = useState(30);

  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectType, setSubjectType] = useState<Subject['type']>('core');
  const [creditHours, setCreditHours] = useState(4);

  const loadData = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    try {
      const [ayList, clsList, secList, subList] = await Promise.all([
        AcademicService.getAcademicYears(currentTenant.id),
        AcademicService.getClasses(currentTenant.id),
        AcademicService.getSections(currentTenant.id),
        AcademicService.getSubjects(currentTenant.id)
      ]);
      setYears(ayList);
      setClasses(clsList);
      setSections(secList);
      setSubjects(subList);
      if (clsList.length > 0) setSectionClassId(clsList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !className || !classCode) return;
    try {
      await AcademicService.createClass(
        {
          tenantId: currentTenant.id,
          campusId: campuses[0]?.id,
          name: className,
          code: classCode.toUpperCase(),
          order: Number(classOrder)
        },
        {
          userId: currentUser?.id || 'admin',
          email: currentUser?.email || 'admin@edutech.edu',
          name: currentUser?.displayName || 'Admin'
        }
      );
      notify('success', 'Grade Added', `Grade "${className}" configured.`);
      setIsClassModalOpen(false);
      await loadData();
      setClassName('');
      setClassCode('');
    } catch (err: any) {
      notify('error', 'Failed', err.message);
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !sectionName || !sectionCode || !sectionClassId) return;
    try {
      await AcademicService.createSection(
        {
          tenantId: currentTenant.id,
          classId: sectionClassId,
          campusId: campuses[0]?.id || 'cmp_main',
          name: sectionName,
          code: sectionCode.toUpperCase(),
          roomNumber: sectionRoom || 'Room 101',
          classTeacherName: sectionTeacher || 'Faculty Assigned',
          maxCapacity: Number(sectionCap),
          currentStudentCount: 0
        },
        {
          userId: currentUser?.id || 'admin',
          email: currentUser?.email || 'admin@edutech.edu',
          name: currentUser?.displayName || 'Admin'
        }
      );
      notify('success', 'Section Created', `Section "${sectionName}" initialized.`);
      setIsSectionModalOpen(false);
      await loadData();
      setSectionName('');
      setSectionCode('');
    } catch (err: any) {
      notify('error', 'Failed', err.message);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !subjectName || !subjectCode) return;
    try {
      await AcademicService.createSubject({
        tenantId: currentTenant.id,
        name: subjectName,
        code: subjectCode.toUpperCase(),
        type: subjectType,
        creditHours: Number(creditHours),
        applicableClassIds: classes.map(c => c.id)
      });
      notify('success', 'Subject Added', `Curriculum subject "${subjectName}" saved.`);
      setIsSubjectModalOpen(false);
      await loadData();
      setSubjectName('');
      setSubjectCode('');
    } catch (err: any) {
      notify('error', 'Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Academic Curriculum & Structure
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure academic years, grade hierarchies, section classrooms, and curriculum subjects for {currentTenant?.name}.
          </p>
        </div>

        {hasPermission('academic.manage') && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              + Add Section
            </button>
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              + Add Grade/Class
            </button>
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              + Add Subject
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'classes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Classes & Classroom Sections ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'subjects'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Curriculum Subjects ({subjects.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'calendar'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Academic Terms & Calendar ({years.length})
        </button>
      </div>

      {/* Tab 1: Classes & Sections */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classSections = sections.filter(s => s.classId === cls.id);
            return (
              <div
                key={cls.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{cls.name}</h3>
                    <Badge variant="primary">{cls.code}</Badge>
                  </div>
                  <p className="text-2xs text-slate-400 mt-1">Hierarchy Order: {cls.order}</p>

                  <div className="mt-4 space-y-2">
                    <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                      Assigned Sections ({classSections.length})
                    </p>
                    {classSections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{sec.name}</p>
                          <p className="text-2xs text-slate-500">{sec.classTeacherName} • {sec.roomNumber}</p>
                        </div>
                        <span className="text-2xs font-mono font-medium text-slate-600 dark:text-slate-400">
                          {sec.maxCapacity} Max
                        </span>
                      </div>
                    ))}
                    {classSections.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No sections created for this grade yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      setSectionClassId(cls.id);
                      setIsSectionModalOpen(true);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    + Add Section to {cls.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Subjects */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{sub.name}</h3>
                    <p className="text-2xs font-mono text-slate-400">{sub.code}</p>
                  </div>
                  <Badge variant={sub.type === 'core' ? 'primary' : sub.type === 'lab' ? 'info' : 'warning'}>
                    {sub.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Credits: <span className="font-semibold text-slate-700 dark:text-slate-300">{sub.creditHours || 3} Hours/Week</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs text-slate-400">
                Curriculum syllabus mapped to {classes.length} grades
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          {years.map((y) => (
            <div
              key={y.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{y.name}</h3>
                  <p className="text-xs text-slate-500">
                    Duration: {y.startDate} to {y.endDate}
                  </p>
                </div>
                {y.isCurrent && <Badge variant="success">Current Academic Year</Badge>}
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {y.terms.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{t.name}</p>
                    <p className="text-2xs text-slate-500 mt-1">{t.startDate} — {t.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Grade */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Add Grade Level / Class"
        subtitle={`Configure a new cohort in ${currentTenant?.name}.`}
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Class Name *
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Grade 11 or Year 1"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Short Code *
            </label>
            <input
              type="text"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="e.g. G-11"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sorting Order
            </label>
            <input
              type="number"
              value={classOrder}
              onChange={(e) => setClassOrder(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsClassModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Save Grade
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Section */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add Classroom Section"
        subtitle="Create section roster under selected grade."
      >
        <form onSubmit={handleCreateSection} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Grade / Class *
            </label>
            <select
              value={sectionClassId}
              onChange={(e) => setSectionClassId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Section Name *
            </label>
            <input
              type="text"
              required
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. Section C - STEM"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Section Code *
              </label>
              <input
                type="text"
                required
                value={sectionCode}
                onChange={(e) => setSectionCode(e.target.value.toUpperCase())}
                placeholder="e.g. 10-C"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={sectionRoom}
                onChange={(e) => setSectionRoom(e.target.value)}
                placeholder="e.g. Room 304"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Assigned Class Teacher
            </label>
            <input
              type="text"
              value={sectionTeacher}
              onChange={(e) => setSectionTeacher(e.target.value)}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSectionModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Save Section
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Subject */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Curriculum Subject"
        subtitle="Catalog academic course subject in institutional database."
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Organic Chemistry"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                placeholder="e.g. CHM-301"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Subject Category
              </label>
              <select
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="core">Core</option>
                <option value="elective">Elective</option>
                <option value="lab">Lab / Practical</option>
                <option value="vocational">Vocational</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
