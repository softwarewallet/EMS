import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeacherService, TeacherAssignmentService } from '../../services/academicManagementService';
import { AcademicService } from '../../services/academicService';
import { UserService } from '../../services/userService';
import { TeacherProfile, TeacherAssignment, ClassGrade, Section, Subject, User } from '../../types';

export const TeacherManagementView: React.FC = () => {
  const { currentTenant, currentUser, userPermissions } = useAuth();
  const tenantId = currentTenant?.id || '';

  const [activeTab, setActiveTab] = useState<'directory' | 'allocations'>('directory');
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState<TeacherProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [newTeacher, setNewTeacher] = useState<Partial<TeacherProfile>>({
    employeeId: '',
    qualification: '',
    specialization: '',
    department: 'Department of Mathematics & Sciences',
    employmentStatus: 'full_time',
    contactNumber: '',
    email: '',
    bio: '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const [newAssignment, setNewAssignment] = useState({
    teacherId: '',
    academicYearId: 'ay_2025_2026',
    classId: '',
    sectionId: '',
    subjectId: '',
    role: 'primary' as const
  });

  const canManage = userPermissions.includes('platform.admin') || userPermissions.includes('teacher.create') || userPermissions.includes('teacher.assign');

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    if (!tenantId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [tList, aList, cList, secList, subList, uList] = await Promise.all([
        TeacherService.getTeachers(tenantId),
        TeacherAssignmentService.getAssignments(tenantId),
        AcademicService.getClasses(tenantId),
        AcademicService.getSections(tenantId),
        AcademicService.getSubjects(tenantId),
        UserService.getUsers(tenantId)
      ]);
      setTeachers(tList);
      setAssignments(aList);
      setClasses(cList);
      setSections(secList);
      setSubjects(subList);
      setUsers(uList);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to load faculty records');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.employeeId || !newTeacher.email || !newTeacher.qualification) {
      setErrorMsg('Please fill in all mandatory teacher details (Employee ID, Email, Qualification)');
      return;
    }

    try {
      // Find or link with a user account
      const matchedUser = users.find(u => u.email.toLowerCase() === newTeacher.email?.toLowerCase());
      const userId = matchedUser?.id || `usr_gen_${Date.now()}`;

      const profile: TeacherProfile = {
        id: `tch_${Date.now()}`,
        tenantId,
        userId,
        employeeId: newTeacher.employeeId || '',
        qualification: newTeacher.qualification || '',
        specialization: newTeacher.specialization || 'General Curriculum',
        department: newTeacher.department || 'Academics',
        joiningDate: newTeacher.joiningDate || new Date().toISOString().split('T')[0],
        employmentStatus: (newTeacher.employmentStatus as any) || 'full_time',
        contactNumber: newTeacher.contactNumber || '+91 ',
        email: newTeacher.email || '',
        bio: newTeacher.bio || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await TeacherService.saveTeacher(tenantId, profile, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg(`Faculty profile registered for ${profile.employeeId}`);
      setShowAddTeacherModal(false);
      setNewTeacher({
        employeeId: '',
        qualification: '',
        specialization: '',
        department: 'Department of Mathematics & Sciences',
        employmentStatus: 'full_time',
        contactNumber: '',
        email: '',
        bio: '',
        joiningDate: new Date().toISOString().split('T')[0]
      });
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not save faculty profile');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.teacherId || !newAssignment.classId || !newAssignment.sectionId || !newAssignment.subjectId) {
      setErrorMsg('Please select Teacher, Class, Section, and Subject');
      return;
    }

    const teacher = teachers.find(t => t.id === newAssignment.teacherId || t.userId === newAssignment.teacherId);
    const teacherUser = users.find(u => u.id === teacher?.userId || u.id === newAssignment.teacherId);
    const teacherName = teacherUser?.displayName || teacher?.employeeId || 'Teacher';

    const selectedClass = classes.find(c => c.id === newAssignment.classId);
    const selectedSection = sections.find(s => s.id === newAssignment.sectionId);
    const selectedSubject = subjects.find(sub => sub.id === newAssignment.subjectId);

    try {
      await TeacherAssignmentService.assignTeacher(
        tenantId,
        {
          tenantId,
          teacherId: teacher?.id || newAssignment.teacherId,
          teacherName,
          academicYearId: newAssignment.academicYearId,
          classId: newAssignment.classId,
          className: selectedClass?.name || 'Class',
          sectionId: newAssignment.sectionId,
          sectionName: selectedSection?.name || 'Section',
          subjectId: newAssignment.subjectId,
          subjectName: selectedSubject?.name || 'Subject',
          subjectCode: selectedSubject?.code || 'SUB-01',
          role: newAssignment.role,
          status: 'active'
        },
        currentUser?.email || 'admin',
        currentUser?.displayName || 'Administrator'
      );

      setSuccessMsg(`Successfully assigned ${teacherName} to ${selectedClass?.name} (${selectedSubject?.name})`);
      setShowAssignModal(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign teacher');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!window.confirm('Are you sure you want to revoke this teaching assignment?')) return;
    try {
      await TeacherAssignmentService.removeAssignment(tenantId, assignmentId, currentUser?.email || 'admin', currentUser?.displayName || 'Administrator');
      setSuccessMsg('Teaching allocation revoked successfully');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to revoke allocation');
    }
  };

  const departments = Array.from(new Set(teachers.map(t => t.department).filter(Boolean)));

  const filteredTeachers = teachers.filter(t => {
    const matchedUser = users.find(u => u.id === t.userId);
    const name = matchedUser?.displayName || '';
    const matchesSearch = 
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || t.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Faculty & Allocations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher & Faculty Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage institutional faculty records, academic credentials, and classroom subject teaching allocations.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setNewAssignment({
                  teacherId: teachers[0]?.id || '',
                  academicYearId: 'ay_2025_2026',
                  classId: classes[0]?.id || '',
                  sectionId: sections[0]?.id || '',
                  subjectId: subjects[0]?.id || '',
                  role: 'primary'
                });
                setShowAssignModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-sm font-medium border border-slate-700 transition"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Allocate Subject</span>
            </button>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>
          </div>
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'directory'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Directory ({teachers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-5 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
            activeTab === 'allocations'
              ? 'border-sky-600 text-sky-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Class-Subject Allocations ({assignments.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="font-medium">Loading faculty records...</p>
        </div>
      ) : activeTab === 'directory' ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by faculty name, employee ID, qualification, or subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Faculty Grid Cards */}
          {filteredTeachers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No faculty members found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting search query or add new faculty profiles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map(teacher => {
                const user = users.find(u => u.id === teacher.userId);
                const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id || a.teacherId === teacher.userId);

                return (
                  <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 mb-1">
                            {teacher.employeeId}
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {user?.displayName || 'Faculty Member'}
                          </h3>
                          <p className="text-xs text-sky-700 font-medium">{teacher.department}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          teacher.employmentStatus === 'full_time' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {teacher.employmentStatus?.replace('_', ' ') || 'Unknown'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <Award className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <span className="font-medium text-slate-800">{teacher.qualification}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <span>Specialization: <strong className="text-slate-800">{teacher.specialization}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`mailto:${teacher.email}`} className="text-sky-600 hover:underline">{teacher.email}</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{teacher.contactNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Joined: {teacher.joiningDate}</span>
                        </div>
                      </div>

                      {teacher.bio && (
                        <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg italic">
                          "{teacher.bio}"
                        </p>
                      )}

                      {/* Allocated classes preview */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>Teaching Allocations:</span>
                          <span className="text-sky-600 font-bold">{teacherAssignments.length}</span>
                        </div>
                        {teacherAssignments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No classes allocated yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {teacherAssignments.map(a => (
                              <span key={a.id} className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-xs">
                                {a.className} ({a.subjectName})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {canManage && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTeacherForAssign(teacher);
                            setNewAssignment({
                              teacherId: teacher.id,
                              academicYearId: 'ay_2025_2026',
                              classId: classes[0]?.id || '',
                              sectionId: sections[0]?.id || '',
                              subjectId: subjects[0]?.id || '',
                              role: 'primary'
                            });
                            setShowAssignModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition"
                        >
                          + Allocate Class
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Allocations Matrix Table */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Faculty Class-Subject Teaching Matrix</h3>
              <p className="text-xs text-slate-500">Official assignment records governing timetable scheduling and marks authorization.</p>
            </div>
            {canManage && (
              <button
                onClick={() => {
                  setNewAssignment({
                    teacherId: teachers[0]?.id || '',
                    academicYearId: 'ay_2025_2026',
                    classId: classes[0]?.id || '',
                    sectionId: sections[0]?.id || '',
                    subjectId: subjects[0]?.id || '',
                    role: 'primary'
                  });
                  setShowAssignModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Allocation</span>
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
            <div className="p-12 text-center">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">No teaching allocations recorded.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Class & Grade</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Subject & Code</th>
                    <th className="py-3 px-4">Teaching Role</th>
                    <th className="py-3 px-4">Allocated Date</th>
                    {canManage && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {assignments.map(a => {
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {a.teacherName}
                        </td>
                        <td className="py-3 px-4">{a.className}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                            {a.sectionName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800">{a.subjectName}</span>{' '}
                          <span className="text-xs text-slate-400">({a.subjectCode})</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            a.role === 'primary' 
                              ? 'bg-sky-100 text-sky-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {a.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {new Date(a.assignedAt).toLocaleDateString()}
                        </td>
                        {canManage && (
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveAssignment(a.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Revoke allocation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Faculty Member */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Register Faculty Profile</h3>
                <p className="text-xs text-slate-400">Add teacher qualifications, specialization & institutional contact details</p>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DPS-FAC-045"
                    value={newTeacher.employeeId}
                    onChange={e => setNewTeacher({ ...newTeacher, employeeId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="faculty@dpsrkp.edu.in"
                    value={newTeacher.email}
                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Qualification *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.Sc. Mathematics, B.Ed (Delhi University)"
                  value={newTeacher.qualification}
                  onChange={e => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Calculus & Algebra"
                    value={newTeacher.specialization}
                    onChange={e => setNewTeacher({ ...newTeacher, specialization: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Physical Sciences"
                    value={newTeacher.department}
                    onChange={e => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98110 00000"
                    value={newTeacher.contactNumber}
                    onChange={e => setNewTeacher({ ...newTeacher, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={newTeacher.employmentStatus}
                    onChange={e => setNewTeacher({ ...newTeacher, employmentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="full_time">Full Time Regular</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contractual</option>
                    <option value="probation">Probationary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  placeholder="Summary of experience, pedagogical focus, and achievements..."
                  value={newTeacher.bio}
                  onChange={e => setNewTeacher({ ...newTeacher, bio: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Save Faculty Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Class-Subject Allocation */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Allocate Subject to Teacher</h3>
                <p className="text-xs text-slate-400">Map instructor to target grade, section, and curriculum subject</p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Faculty *</label>
                <select
                  required
                  value={newAssignment.teacherId}
                  onChange={e => setNewAssignment({ ...newAssignment, teacherId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="">-- Choose Faculty --</option>
                  {teachers.map(t => {
                    const u = users.find(usr => usr.id === t.userId);
                    return (
                      <option key={t.id} value={t.id}>
                        {u?.displayName || t.employeeId} ({t.employeeId} - {t.department})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Grade *</label>
                  <select
                    required
                    value={newAssignment.classId}
                    onChange={e => {
                      const cid = e.target.value;
                      const validSections = sections.filter(s => s.classId === cid);
                      setNewAssignment({
                        ...newAssignment,
                        classId: cid,
                        sectionId: validSections[0]?.id || ''
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
                    required
                    value={newAssignment.sectionId}
                    onChange={e => setNewAssignment({ ...newAssignment, sectionId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {sections
                      .filter(s => !newAssignment.classId || s.classId === newAssignment.classId)
                      .map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <select
                  required
                  value={newAssignment.subjectId}
                  onChange={e => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={newAssignment.role}
                  onChange={e => setNewAssignment({ ...newAssignment, role: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="primary">Primary Teacher</option>
                  <option value="assistant">Assistant Instructor</option>
                  <option value="substitute">Substitute Faculty</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
