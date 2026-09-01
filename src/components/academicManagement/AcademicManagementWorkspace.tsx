import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Shield,
  FileText,
  Search,
  Activity,
  GitBranch,
  Building2,
  Users,
  Award
} from 'lucide-react';
import { AcademicManagementService } from '../../services/academicManagementService';
import {
  AcademicDiscipline,
  AcademicProgram,
  AcademicProgramVersion,
  AcademicCourse,
  AcademicCurriculum,
  AcademicCurriculumComponent,
  AcademicCoursePrerequisite,
  AcademicTerm,
  AcademicCourseOffering,
  AcademicSection,
  AcademicRule,
  AcademicChangeRequest
} from '../../types/academicManagement';

export const AcademicManagementWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'courses' | 'curriculum' | 'prerequisites' | 'terms' | 'offerings' | 'rules' | 'changes' | 'diagnostics' | 'audit'>('programs');
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [curricula, setCurricula] = useState<AcademicCurriculum[]>([]);
  const [components, setComponents] = useState<AcademicCurriculumComponent[]>([]);
  const [prerequisites, setPrerequisites] = useState<AcademicCoursePrerequisite[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [offerings, setOfferings] = useState<AcademicCourseOffering[]>([]);
  const [sections, setSections] = useState<AcademicSection[]>([]);
  const [rules, setRules] = useState<AcademicRule[]>([]);
  const [changeRequests, setChangeRequests] = useState<AcademicChangeRequest[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Program Form State
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [newProgCode, setNewProgCode] = useState('');
  const [newProgName, setNewProgName] = useState('');
  const [newProgType, setNewProgType] = useState<any>('BACHELOR');

  // New Course Form State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCrsCode, setNewCrsCode] = useState('');
  const [newCrsTitle, setNewCrsTitle] = useState('');
  const [newCrsCredits, setNewCrsCredits] = useState(4);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, c, cur, comp, prq, t, off, sec, r, acr, diag] = await Promise.all([
        AcademicManagementService.getPrograms(),
        AcademicManagementService.getCourses(),
        AcademicManagementService.getCurricula(),
        AcademicManagementService.getCurriculumComponents(),
        AcademicManagementService.getPrerequisites(),
        AcademicManagementService.getTerms(),
        AcademicManagementService.getOfferings(),
        AcademicManagementService.getSections(),
        AcademicManagementService.getChangeRequests(),
        Promise.resolve([]),
        AcademicManagementService.runDiagnostics()
      ]);
      setPrograms(p);
      setCourses(c);
      setCurricula(cur);
      setComponents(comp);
      setPrerequisites(prq);
      setTerms(t);
      setOfferings(off);
      setSections(sec);
      setRules([]);
      setChangeRequests(acr);
      setDiagnostics(diag);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AcademicManagementService.createProgram({
        tenantId: 'tenant_default',
        campusIdRef: 'campus_main',
        owningOrganizationUnitIdRef: 'unit_dept_cs',
        programCode: newProgCode,
        programName: newProgName,
        programType: newProgType,
        awardType: 'Degree',
        disciplineIdRef: 'disc_cs',
        duration: 4,
        durationUnit: 'YEARS',
        deliveryMode: 'IN_PERSON',
        status: 'ACTIVE',
        effectiveFrom: new Date().toISOString(),
        createdBy: 'sys_admin',
        updatedBy: 'sys_admin'
      });
      setShowProgramModal(false);
      setNewProgCode('');
      setNewProgName('');
      loadData();
    } catch (err) {
      alert(err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AcademicManagementService.createCourse({
        tenantId: 'tenant_default',
        courseCode: newCrsCode,
        courseTitle: newCrsTitle,
        shortTitle: newCrsTitle,
        description: 'New course created via academic management workspace.',
        disciplineIdRef: 'disc_cs',
        owningOrganizationUnitIdRef: 'unit_dept_cs',
        courseType: 'CORE',
        level: '100',
        creditValue: Number(newCrsCredits),
        contactHours: Number(newCrsCredits) * 15,
        deliveryMode: 'IN_PERSON',
        gradingMode: 'LETTER',
        status: 'ACTIVE',
        effectiveFrom: new Date().toISOString()
      });
      setShowCourseModal(false);
      setNewCrsCode('');
      setNewCrsTitle('');
      loadData();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> EMS Phase 10.2 Academic Operations
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Institutional Academic Management</h1>
          <p className="text-slate-600 text-sm mt-1">
            Authoritative academic operating layer for programs, courses, curricula, prerequisites, terms, and offerings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProgramModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> New Program
          </button>
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'programs', label: 'Programs', icon: GraduationCap, count: programs.length },
          { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
          { id: 'curriculum', label: 'Curricula', icon: Layers, count: curricula.length },
          { id: 'prerequisites', label: 'Prerequisites', icon: GitBranch, count: prerequisites.length },
          { id: 'terms', label: 'Terms & Calendar', icon: Calendar, count: terms.length },
          { id: 'offerings', label: 'Offerings & Sections', icon: Clock, count: offerings.length },
          { id: 'changes', label: 'Change Governance', icon: Shield, count: changeRequests.length },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertTriangle, count: diagnostics.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'programs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" /> Authoritative Academic Programs
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-semibold">Program Code</th>
                    <th className="p-4 font-semibold">Program Name</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Duration</th>
                    <th className="p-4 font-semibold">Delivery</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {programs
                    .filter(p => p.programName.toLowerCase().includes(searchTerm.toLowerCase()) || p.programCode.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(prog => (
                      <tr key={prog.programId} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-semibold text-indigo-600">{prog.programCode}</td>
                        <td className="p-4 font-medium text-slate-900">{prog.programName}</td>
                        <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">{prog.programType}</span></td>
                        <td className="p-4">{prog.duration} {prog.durationUnit.toLowerCase()}</td>
                        <td className="p-4">{prog.deliveryMode}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> {prog.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Authoritative Courses & Subjects
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-semibold">Course Code</th>
                    <th className="p-4 font-semibold">Course Title</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Credits</th>
                    <th className="p-4 font-semibold">Level</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {courses.map(crs => (
                    <tr key={crs.courseId} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-mono font-semibold text-indigo-600">{crs.courseCode}</td>
                      <td className="p-4 font-medium text-slate-900">{crs.courseTitle}</td>
                      <td className="p-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-semibold">{crs.courseType}</span></td>
                      <td className="p-4 font-semibold">{crs.creditValue} cr</td>
                      <td className="p-4">{crs.level}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {crs.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-600" /> Curriculum & Course Mappings
              </h2>
              {curricula.map(curr => {
                const currComps = components.filter(c => c.curriculumId === curr.curriculumId);
                const validation = AcademicManagementService.validateCurriculum(curr.curriculumId);
                return (
                  <div key={curr.curriculumId} className="border border-slate-200 rounded-lg p-5 mb-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-900">{curr.name}</h3>
                        <p className="text-xs text-slate-500">Academic Year: {curr.academicYear}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${validation.valid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {validation.valid ? 'Curriculum Validated' : 'Validation Errors'}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Curriculum Components</h4>
                      {currComps.map(comp => {
                        const crs = courses.find(c => c.courseId === comp.courseIdRef);
                        return (
                          <div key={comp.componentId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                            <div>
                              <span className="font-mono font-semibold text-indigo-600 mr-2">{crs?.courseCode || comp.courseIdRef}</span>
                              <span className="font-medium text-slate-900">{crs?.courseTitle || 'Unknown Course'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">{comp.academicPeriod}</span>
                              <span>{comp.credits} Credits</span>
                              <span className="font-semibold text-slate-700">{comp.componentType}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'prerequisites' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-indigo-600" /> Prerequisite & Corequisite Graph
            </h2>
            <div className="space-y-3">
              {prerequisites.map(prq => {
                const crs = courses.find(c => c.courseId === prq.courseId);
                const reqCrs = courses.find(c => c.courseId === prq.requiredCourseId);
                return (
                  <div key={prq.prerequisiteId} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 bg-white px-3 py-1 rounded border border-slate-200">{crs?.courseCode || prq.courseId}</span>
                      <span className="text-sm text-slate-500 font-medium">requires prerequisite</span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded border border-indigo-200">{reqCrs?.courseCode || prq.requiredCourseId}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded text-xs font-semibold">{prq.ruleType}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Academic Terms & Sessions
              </h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Term Code</th>
                  <th className="p-4 font-semibold">Term Name</th>
                  <th className="p-4 font-semibold">Academic Year</th>
                  <th className="p-4 font-semibold">Teaching Period</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {terms.map(t => (
                  <tr key={t.termId} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono font-semibold text-indigo-600">{t.code}</td>
                    <td className="p-4 font-medium text-slate-900">{t.name}</td>
                    <td className="p-4">{t.academicYear}</td>
                    <td className="p-4 text-xs">{t.teachingStart} to {t.teachingEnd}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'offerings' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Course Offerings & Sections
              </h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Offering ID</th>
                  <th className="p-4 font-semibold">Course</th>
                  <th className="p-4 font-semibold">Delivery</th>
                  <th className="p-4 font-semibold">Capacity</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {offerings.map(off => {
                  const crs = courses.find(c => c.courseId === off.courseIdRef);
                  return (
                    <tr key={off.offeringId} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-mono text-xs text-slate-500">{off.offeringId}</td>
                      <td className="p-4 font-semibold text-slate-900">{crs?.courseCode} - {crs?.courseTitle}</td>
                      <td className="p-4">{off.deliveryMode}</td>
                      <td className="p-4 font-semibold">{off.capacity} seats</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                          {off.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'changes' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" /> Academic Change Requests & Four-Eyes Governance
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {changeRequests.map(acr => (
                <div key={acr.requestId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{acr.title}</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-mono font-medium">{acr.changeType}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{acr.description}</p>
                    <span className="text-xs text-slate-400 mt-2 block">Requested by: {acr.requestedBy}</span>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                      {acr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Academic Diagnostic Suite
            </h2>
            <div className="space-y-3">
              {diagnostics.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                    d.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    d.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {d.severity}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.message}</p>
                    {d.entityId && <span className="text-xs font-mono text-slate-500">Entity Ref: {d.entityId}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* New Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Create Academic Program</h3>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Program Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BTECH-AI"
                  value={newProgCode}
                  onChange={e => setNewProgCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Technology in AI"
                  value={newProgName}
                  onChange={e => setNewProgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Program Type</label>
                <select
                  value={newProgType}
                  onChange={e => setNewProgType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="BACHELOR">Bachelor</option>
                  <option value="MASTER">Master</option>
                  <option value="DOCTORAL">Doctoral</option>
                  <option value="DIPLOMA">Diploma</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Create Academic Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS201"
                  value={newCrsCode}
                  onChange={e => setNewCrsCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Algorithms"
                  value={newCrsTitle}
                  onChange={e => setNewCrsTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Credit Value</label>
                <input
                  type="number"
                  required
                  value={newCrsCredits}
                  onChange={e => setNewCrsCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
