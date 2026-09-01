import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Users,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Award,
  BarChart3,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Layers,
  HelpCircle,
  Send,
  Lock,
  Download,
  Share2
} from 'lucide-react';

import { LearningService } from '../../services/learningService';
import { AuditService } from '../../services/auditService';
import {
  LearningCourse,
  CourseOffering,
  CourseTeachingAssignment,
  LearningUnit,
  LearningLesson,
  LearningResource,
  LearningAssignment,
  LearningAssignmentSubmission,
  LearningQuestionBank,
  LearningQuestion,
  LearningQuiz,
  LearningAssessmentAttempt,
  LearningDiscussion,
  LearningAnnouncement,
  LearningStudentProgress,
  LearningAnalyticsCache,
  CourseLifecycleStatus,
  OfferingStatus,
  TeachingRole,
  AssignmentStatus,
  QuestionType,
  DifficultyLevel
} from '../../types/learning';
import { AuditRecord } from '../../types';

interface LearningWorkspaceProps {
  tenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    roles: string[];
  };
}

export const LearningWorkspace: React.FC<LearningWorkspaceProps> = ({
  tenantId,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'offerings' | 'teaching' | 'content' | 'assignments' | 'grading' | 'quizzes' | 'discussions' | 'announcements' | 'progress' | 'analytics' | 'audit'
  >('overview');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Core Datasets
  const [analytics, setAnalytics] = useState<LearningAnalyticsCache | null>(null);
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<CourseTeachingAssignment[]>([]);
  const [units, setUnits] = useState<LearningUnit[]>([]);
  const [assignments, setAssignments] = useState<LearningAssignment[]>([]);
  const [submissions, setSubmissions] = useState<LearningAssignmentSubmission[]>([]);
  const [questionBanks, setQuestionBanks] = useState<LearningQuestionBank[]>([]);
  const [quizzes, setQuizzes] = useState<LearningQuiz[]>([]);
  const [discussions, setDiscussions] = useState<LearningDiscussion[]>([]);
  const [announcements, setAnnouncements] = useState<LearningAnnouncement[]>([]);
  const [studentProgressList, setStudentProgressList] = useState<LearningStudentProgress[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Modal / Form States
  const [selectedCourse, setSelectedCourse] = useState<LearningCourse | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<CourseOffering | null>(null);

  // New Course Modal
  const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
  const [courseCode, setCourseCode] = useState<string>('');
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [courseDesc, setCourseDesc] = useState<string>('');
  const [courseDept, setCourseDept] = useState<string>('Computer Science & IT');

  // New Offering Modal
  const [showOfferingModal, setShowOfferingModal] = useState<boolean>(false);
  const [offeringCourseId, setOfferingCourseId] = useState<string>('');
  const [offeringYear, setOfferingYear] = useState<string>('AY-2026-2027');
  const [offeringClass, setOfferingClass] = useState<string>('Grade 10');
  const [offeringSection, setOfferingSection] = useState<string>('Section A');
  const [offeringSubject, setOfferingSubject] = useState<string>('Mathematics');

  // New Assignment Modal
  const [showAssignmentModal, setShowAssignmentModal] = useState<boolean>(false);
  const [asgnTitle, setAsgnTitle] = useState<string>('');
  const [asgnInstructions, setAsgnInstructions] = useState<string>('');
  const [asgnMaxMarks, setAsgnMaxMarks] = useState<number>(100);
  const [asgnDueDate, setAsgnDueDate] = useState<string>('2026-09-15');

  // New Quiz Modal
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizInstructions, setQuizInstructions] = useState<string>('');
  const [quizDuration, setQuizDuration] = useState<number>(45);

  const actor = {
    id: currentUser.id,
    email: currentUser.email,
    displayName: currentUser.displayName,
    role: (currentUser as any).roles?.[0] || currentUser.roleAssignments?.[0]?.roleCode || 'tenant_admin'
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [tenantId]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeTenant = tenantId || 'tenant_main';
      const [
        analyticsData,
        coursesData,
        offeringsData,
        questionBanksData,
        auditLogsData
      ] = await Promise.all([
        LearningService.getLearningAnalytics(activeTenant),
        LearningService.getCourses(activeTenant),
        LearningService.getOfferings(activeTenant),
        LearningService.getQuestionBanks(activeTenant),
        AuditService.getLogs(activeTenant, 50)
      ]);

      setAnalytics(analyticsData);
      setCourses(coursesData);
      setOfferings(offeringsData);
      setQuestionBanks(questionBanksData);
      setAuditLogs(auditLogsData);

      if (coursesData.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesData[0]);
        const courseUnits = await LearningService.getUnits(activeTenant, coursesData[0].id);
        setUnits(courseUnits);
      }

      if (offeringsData.length > 0 && !selectedOffering) {
        setSelectedOffering(offeringsData[0]);
        const [
          asgns,
          qz,
          disc,
          anc
        ] = await Promise.all([
          LearningService.getAssignments(activeTenant, offeringsData[0].id),
          LearningService.getQuizzes(activeTenant, offeringsData[0].id),
          LearningService.getDiscussions(activeTenant, offeringsData[0].id),
          LearningService.getAnnouncements(activeTenant, offeringsData[0].id)
        ]);
        setAssignments(asgns);
        setQuizzes(qz);
        setDiscussions(disc);
        setAnnouncements(anc);
      }

    } catch (err: any) {
      console.error('Failed to load learning workspace data:', err);
      setError(err.message || 'Failed to load learning management data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) return;
    try {
      const activeTenant = tenantId || 'tenant_main';
      const newCourse = await LearningService.createCourse(activeTenant, {
        code: courseCode,
        title: courseTitle,
        description: courseDesc || 'Comprehensive curriculum learning space',
        departmentName: courseDept,
        status: 'DRAFT',
        createdById: currentUser.id,
        createdByName: currentUser.displayName
      }, actor);

      setCourses(prev => [newCourse, ...prev]);
      setShowCourseModal(false);
      setCourseCode('');
      setCourseTitle('');
      setCourseDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create course');
    }
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourse = courses.find(c => c.id === offeringCourseId) || courses[0];
    if (!targetCourse) return;

    try {
      const activeTenant = tenantId || 'tenant_main';
      const newOffering = await LearningService.createOffering(activeTenant, {
        courseId: targetCourse.id,
        courseCode: targetCourse.code,
        courseTitle: targetCourse.title,
        academicYearId: 'ay_2026_2027',
        academicYearName: offeringYear,
        classId: 'cls_10',
        className: offeringClass,
        sectionId: 'sec_10a',
        sectionName: offeringSection,
        subjectId: 'sub_math',
        subjectName: offeringSubject,
        deliveryMode: 'HYBRID',
        status: 'ACTIVE',
        startDate: '2026-09-01',
        endDate: '2027-06-30',
        primaryTeacherId: currentUser.id,
        primaryTeacherName: currentUser.displayName
      }, actor);

      setOfferings(prev => [newOffering, ...prev]);
      setShowOfferingModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create course offering');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffering || !asgnTitle) return;

    try {
      const activeTenant = tenantId || 'tenant_main';
      const newAssignment = await LearningService.createAssignment(activeTenant, {
        courseOfferingId: selectedOffering.id,
        title: asgnTitle,
        instructions: asgnInstructions || 'Complete all questions in detail.',
        maxMarks: asgnMaxMarks,
        dueDate: asgnDueDate,
        allowLateSubmissions: true,
        status: 'PUBLISHED',
        createdById: currentUser.id,
        createdByName: currentUser.displayName
      }, actor);

      setAssignments(prev => [newAssignment, ...prev]);
      setShowAssignmentModal(false);
      setAsgnTitle('');
      setAsgnInstructions('');
    } catch (err: any) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-col items-center gap-3">
          <GraduationCap className="h-10 w-10 text-emerald-600 animate-bounce" />
          <p className="text-sm font-medium text-slate-600">Loading Learning Management Governance Space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Learning Management System</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                Phase 7.22
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Digital Classroom, Teaching Delivery & Content Governance Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium text-sm transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </button>
          <button
            onClick={() => setShowOfferingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium text-sm transition-colors shadow-sm"
          >
            <BookOpen className="h-4 w-4" />
            New Offering
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'overview', label: 'Command Center', icon: GraduationCap },
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'offerings', label: 'Offerings', icon: Calendar },
          { id: 'content', label: 'Content Studio', icon: Layers },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'grading', label: 'Submissions & Grading', icon: Award },
          { id: 'quizzes', label: 'Quizzes & Banks', icon: HelpCircle },
          { id: 'discussions', label: 'Discussions', icon: MessageSquare },
          { id: 'announcements', label: 'Announcements', icon: Send },
          { id: 'progress', label: 'Student Progress', icon: CheckCircle2 },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'audit', label: 'Audit Trail', icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Courses</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.totalActiveCourses || courses.length}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="h-3.5 w-3.5" /> Published & Governing
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Offerings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.totalActiveOfferings || offerings.length}</p>
                <p className="text-xs text-slate-500 mt-1">Sections & Classes</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Learners</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.totalEnrolledLearners || 140}</p>
                <p className="text-xs text-indigo-600 mt-1 font-medium">Active Digital Classrooms</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{analytics?.averageCourseCompletionRate || 84.5}%</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Formative Target Exceeded</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* ACTIVE OFFERINGS & RECENT COURSES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  Active Course Offerings
                </h3>
                <span className="text-xs text-slate-500">{offerings.length} Total</span>
              </div>

              {offerings.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No active course offerings found</p>
                  <p className="text-xs text-slate-400 mt-1">Create an offering to bind courses to academic years and classes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {offerings.slice(0, 5).map(offering => (
                    <div
                      key={offering.id}
                      onClick={() => setSelectedOffering(offering)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedOffering?.id === offering.id
                          ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{offering.courseCode} — {offering.courseTitle}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {offering.className} ({offering.sectionName}) • {offering.academicYearName}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-lg">
                          {offering.deliveryMode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                        <span>Faculty: {offering.primaryTeacherName || 'Assigned Staff'}</span>
                        <span className="font-medium text-slate-700">{offering.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Course Master Directory
                </h3>
                <span className="text-xs text-slate-500">{courses.length} Courses</span>
              </div>

              {courses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">No course master records found</p>
                  <p className="text-xs text-slate-400 mt-1">Draft new courses to begin building learning spaces</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {courses.slice(0, 5).map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCourse(c)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedCourse?.id === c.id
                          ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-300'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{c.code}: {c.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{c.departmentName || 'Academic Department'}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          c.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          v{c.currentVersion} • {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSES */}
      {activeTab === 'courses' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Course Master Catalog</h2>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative course structures, versions, and learning objectives</p>
            </div>
            <button
              onClick={() => setShowCourseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> New Course Master
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1">{course.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Version: {course.currentVersion}</span>
                  <span>Dept: {course.departmentName || 'General'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFERINGS */}
      {activeTab === 'offerings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Course Offerings & Section Binding</h2>
              <p className="text-xs text-slate-500 mt-0.5">Academic Year, Class, Section, and Primary Faculty bindings</p>
            </div>
            <button
              onClick={() => setShowOfferingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> Create Course Offering
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider">
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Class / Section</th>
                  <th className="p-3.5">Academic Year</th>
                  <th className="p-3.5">Primary Faculty</th>
                  <th className="p-3.5">Delivery Mode</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {offerings.map(offering => (
                  <tr key={offering.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {offering.courseCode} — {offering.courseTitle}
                    </td>
                    <td className="p-3.5 text-slate-700">
                      {offering.className} ({offering.sectionName || 'All Sections'})
                    </td>
                    <td className="p-3.5 text-slate-600">{offering.academicYearName}</td>
                    <td className="p-3.5 text-slate-800 font-medium">{offering.primaryTeacherName || 'Unassigned'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md">
                        {offering.deliveryMode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                        {offering.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Coursework & Assignments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Published assignments, rubrics, and submission windows</p>
            </div>
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" /> Create Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(asgn => (
              <div key={asgn.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{asgn.title}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">
                    {asgn.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{asgn.instructions}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Max Marks: <strong className="text-slate-900">{asgn.maxMarks}</strong></span>
                  <span>Due: <strong className="text-slate-900">{asgn.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Learning Management Governance Audit Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">Immutable event trail for course creation, assignment publishing, and grading</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-emerald-700">{log.action}</td>
                    <td className="p-3 text-slate-800">{log.entityType} ({log.entityId})</td>
                    <td className="p-3 text-slate-700">{log.actor?.actorName || 'System'}</td>
                    <td className="p-3 text-slate-600 font-sans">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE COURSE */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create Course Master</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-101"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Computer Science"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={courseDept}
                  onChange={e => setCourseDept(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Syllabus Overview</label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Summary of course content and learning outcomes..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 shadow-sm"
                >
                  Create Master Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE OFFERING */}
      {showOfferingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Bind New Course Offering</h3>
              <button onClick={() => setShowOfferingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Master Course</label>
                <select
                  value={offeringCourseId}
                  onChange={e => setOfferingCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={offeringYear}
                    onChange={e => setOfferingYear(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={offeringClass}
                    onChange={e => setOfferingClass(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={offeringSection}
                    onChange={e => setOfferingSection(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={offeringSubject}
                    onChange={e => setOfferingSubject(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferingModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 shadow-sm"
                >
                  Bind Course Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE ASSIGNMENT */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Publish Coursework Assignment</h3>
              <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 2 Problem Set: Linear Equations"
                  value={asgnTitle}
                  onChange={e => setAsgnTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instructions & Rubrics</label>
                <textarea
                  rows={3}
                  value={asgnInstructions}
                  onChange={e => setAsgnInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={asgnMaxMarks}
                    onChange={e => setAsgnMaxMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgnDueDate}
                    onChange={e => setAsgnDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 shadow-sm"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
