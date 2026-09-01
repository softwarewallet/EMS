import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { StudentService } from '../../services/studentService';
import { AcademicService } from '../../services/academicService';
import { DataTable, Column } from '../common/DataTable';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Student360WorkspaceModal } from './Student360WorkspaceModal';
import { StudentStatusTransitionModal } from './StudentStatusTransitionModal';
import { StudentDuplicateWarningModal } from './StudentDuplicateWarningModal';
import {
  Student,
  ClassGrade,
  Section,
  AcademicYear,
  Guardian,
  StudentDuplicateCandidate,
  StudentLifecycleStatus
} from '../../types';
import {
  GraduationCap,
  UserPlus,
  Phone,
  Mail,
  Users,
  BookOpen,
  ArrowRightLeft,
  Award,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export const StudentDirectoryView: React.FC = () => {
  const { currentTenant, campuses } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  // State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCampusId, setSelectedCampusId] = useState<string>('ALL');
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>('ALL');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active View Tab
  const [viewTab, setViewTab] = useState<'all' | 'class_roster' | 'transfers' | 'alumni'>('all');

  // Modals
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentFor360, setSelectedStudentFor360] = useState<string | null>(null);
  const [selectedStudentForStatus, setSelectedStudentForStatus] = useState<Student | null>(null);

  // Duplicate Check
  const [duplicateCandidates, setDuplicateCandidates] = useState<StudentDuplicateCandidate[]>([]);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [pendingStudentPayload, setPendingStudentPayload] = useState<any | null>(null);

  // Enrollment Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [dob, setDob] = useState('2011-05-15');
  const [gender, setGender] = useState<Student['gender']>('male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [nationalId, setNationalId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Academic Placement
  const [formClassId, setFormClassId] = useState('');
  const [formSectionId, setFormSectionId] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [previousInstitution, setPreviousInstitution] = useState('');
  const [previousClass, setPreviousClass] = useState('');
  const [previousBoard, setPreviousBoard] = useState('CBSE');

  // Guardian
  const [guardianName, setGuardianName] = useState('');
  const [guardianRel, setGuardianRel] = useState<Guardian['relationship']>('father');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianOccupation, setGuardianOccupation] = useState('');

  const loadData = async () => {
    if (!currentTenant) return;
    setIsLoading(true);
    try {
      const [stuList, clsList, secList, ayList] = await Promise.all([
        StudentService.getStudents(currentTenant.id),
        AcademicService.getClasses(currentTenant.id),
        AcademicService.getSections(currentTenant.id),
        AcademicService.getAcademicYears(currentTenant.id)
      ]);
      setStudents(stuList);
      setClasses(clsList);
      setSections(secList);
      setAcademicYears(ayList);

      if (clsList.length > 0) setFormClassId(clsList[0].id);
      if (secList.length > 0) setFormSectionId(secList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  // Compute Metrics
  const totalCount = students.length;
  const activeCount = students.filter(s => {
    const st = (s.status ? s.status.toUpperCase() : 'ACTIVE');
    return st === 'ACTIVE' || st === 'ENROLLED';
  }).length;
  const transferredCount = students.filter(s => (s.status ? s.status.toUpperCase() : '') === 'TRANSFERRED').length;
  const withdrawnCount = students.filter(s => (s.status ? s.status.toUpperCase() : '') === 'WITHDRAWN').length;
  const graduatedCount = students.filter(s => {
    const st = (s.status ? s.status.toUpperCase() : '');
    return st === 'GRADUATED' || st === 'ALUMNI';
  }).length;

  // Filtered Students List
  const filteredStudents = students.filter(s => {
    if (selectedCampusId !== 'ALL' && s.campusId !== selectedCampusId) return false;
    if (selectedClassId !== 'ALL' && s.currentClassId !== selectedClassId) return false;
    if (selectedSectionId !== 'ALL' && s.currentSectionId !== selectedSectionId) return false;

    const sStatusNorm = (s.status ? s.status.toUpperCase() : 'ACTIVE');

    if (viewTab === 'transfers') {
      if (sStatusNorm !== 'TRANSFERRED' && sStatusNorm !== 'WITHDRAWN') return false;
    } else if (viewTab === 'alumni') {
      if (sStatusNorm !== 'GRADUATED' && sStatusNorm !== 'ALUMNI') return false;
    } else if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'ACTIVE' && sStatusNorm !== 'ACTIVE' && sStatusNorm !== 'ENROLLED') return false;
      if (selectedStatus !== 'ACTIVE' && sStatusNorm !== selectedStatus) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${s.firstName} ${s.middleName || ''} ${s.lastName}`.toLowerCase();
      const idNum = (s.studentIdNumber || '').toLowerCase();
      const emailStr = (s.email || '').toLowerCase();
      const phoneStr = (s.phone || '').toLowerCase();
      const gName = s.guardians?.[0]?.name ? s.guardians[0].name.toLowerCase() : '';

      return fullName.includes(q) || idNum.includes(q) || emailStr.includes(q) || phoneStr.includes(q) || gName.includes(q);
    }

    return true;
  });

  // Pre-submit duplicate check
  const handleInitiateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant || !firstName || !lastName) return;

    const admissionNo = studentIdNumber || (await StudentService.generateAdmissionNumber(currentTenant.id));

    const guardians: Guardian[] = guardianName
      ? [
          {
            id: `g_${Date.now()}`,
            name: guardianName,
            relationship: guardianRel,
            phone: guardianPhone || '+91 98765 43210',
            email: guardianEmail || 'guardian@example.com',
            occupation: guardianOccupation,
            isPrimaryContact: true,
            canReceiveCommunication: true,
            canAccessPortal: true
          }
        ]
      : [];

    const payload = {
      tenantId: currentTenant.id,
      campusId: campuses[0]?.id || 'cmp_main',
      studentIdNumber: admissionNo,
      firstName,
      middleName,
      lastName,
      dateOfBirth: dob,
      gender,
      bloodGroup,
      nationalId,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@dps.edu.in`,
      phone,
      address: address || 'School Resident Campus',
      city: city || 'New Delhi',
      state: state || 'Delhi',
      postalCode: postalCode || '110022',
      enrollmentDate: new Date().toISOString().split('T')[0],
      currentAcademicYearId: selectedAcademicYearId !== 'ALL' ? selectedAcademicYearId : 'ay_2025_2026',
      currentClassId: formClassId,
      currentSectionId: formSectionId,
      rollNumber: rollNumber || `${firstName.charAt(0)}${lastName.charAt(0)}-01`,
      previousInstitution,
      previousClass,
      previousBoard,
      guardians,
      status: 'ACTIVE' as StudentLifecycleStatus
    };

    // Run duplicate detection check
    const duplicates = await StudentService.detectDuplicateStudents(currentTenant.id, payload);

    if (duplicates.length > 0) {
      setDuplicateCandidates(duplicates);
      setPendingStudentPayload(payload);
      setIsDuplicateModalOpen(true);
    } else {
      await executeEnrollment(payload);
    }
  };

  const executeEnrollment = async (payload: any) => {
    try {
      await StudentService.enrollStudent(payload, {
        userId: currentUser?.id || 'usr_admin',
        email: currentUser?.email || 'principal@dpsrkp.edu.in',
        name: currentUser?.displayName || 'Principal Office'
      });

      notify(
        'success',
        'Student Enrolled',
        `Authoritative student record created for ${payload.firstName} ${payload.lastName} (${payload.studentIdNumber}).`
      );

      setIsEnrollModalOpen(false);
      setIsDuplicateModalOpen(false);
      setPendingStudentPayload(null);
      await loadData();

      // Reset Form
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setGuardianName('');
    } catch (err: any) {
      notify('error', 'Enrollment Failed', err.message);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!hasPermission('student.export')) {
      notify('error', 'Access Denied', 'You do not hold permission `student.export` to export student records.');
      return;
    }

    const headers = ['Admission ID', 'First Name', 'Last Name', 'Class', 'Section', 'Roll', 'Gender', 'Status', 'Guardian Name', 'Guardian Phone'];
    const rows = filteredStudents.map(s => [
      s.studentIdNumber,
      s.firstName,
      s.lastName,
      classes.find(c => c.id === s.currentClassId)?.name || s.currentClassId,
      sections.find(sec => sec.id === s.currentSectionId)?.name || s.currentSectionId,
      s.rollNumber || '',
      s.gender,
      s.status,
      s.guardians?.[0]?.name || '',
      s.guardians?.[0]?.phone || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notify('success', 'Roster Exported', `Exported ${filteredStudents.length} student records.`);
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || 'ACTIVE').toUpperCase();
    if (s === 'ACTIVE' || s === 'ENROLLED') return <Badge variant="success">ACTIVE</Badge>;
    if (s === 'TRANSFERRED') return <Badge variant="warning">TRANSFERRED</Badge>;
    if (s === 'WITHDRAWN') return <Badge variant="danger">WITHDRAWN</Badge>;
    if (s === 'GRADUATED' || s === 'ALUMNI') return <Badge variant="primary">GRADUATED</Badge>;
    if (s === 'ON_LEAVE') return <Badge variant="info">ON LEAVE</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student Name & Admission No',
      accessor: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shadow-2xs">
            {s.firstName.charAt(0)}{s.lastName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {s.firstName} {s.middleName || ''} {s.lastName}
            </p>
            <p className="text-2xs text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
              {s.studentIdNumber} • Roll: {s.rollNumber || 'N/A'}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Class & Section Roster',
      accessor: (s) => {
        const cls = classes.find(c => c.id === s.currentClassId);
        const sec = sections.find(sec => sec.id === s.currentSectionId);
        return (
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {cls?.name || 'Class Grade'}
            </p>
            <p className="text-2xs text-slate-500">{sec?.name || 'Section A'}</p>
          </div>
        );
      }
    },
    {
      header: 'Primary Guardian Contact',
      accessor: (s) => {
        const g = s.guardians?.[0];
        if (!g) return <span className="text-2xs text-slate-400 italic">No guardian registered</span>;
        return (
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{g.name}</p>
            <p className="text-2xs text-slate-500 capitalize">{g.relationship} • {g.phone}</p>
          </div>
        );
      }
    },
    {
      header: 'Lifecycle State',
      accessor: (s) => getStatusBadge(s.status)
    },
    {
      header: 'Actions',
      accessor: (s) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedStudentFor360(s.id)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-2xs font-medium"
            title="Open 360° Profile Workspace"
          >
            <Eye className="w-3.5 h-3.5" />
            360° Profile
          </button>

          {hasPermission('student.status.change') && (
            <button
              onClick={() => setSelectedStudentForStatus(s)}
              className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Change Lifecycle Status"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            Student Master & Lifecycle Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authoritative single source of truth for student identities, 360° profiles, guardian contacts, and enrollment timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('student.export') && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              Export Roster
            </button>
          )}

          {hasPermission('student.create') && (
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Enroll New Student
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
          <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Total Master Roster</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 block">{totalCount}</span>
          <span className="text-2xs text-slate-500">Registered across all campuses</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
          <span className="text-2xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Active Enrolled Strength</span>
          <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">{activeCount}</span>
          <span className="text-2xs text-emerald-600 dark:text-emerald-400">Current active students</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
          <span className="text-2xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Transferred / Withdrawn</span>
          <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300 mt-1 block">{transferredCount + withdrawnCount}</span>
          <span className="text-2xs text-amber-600">{transferredCount} Transferred • {withdrawnCount} Withdrawn</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
          <span className="text-2xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Graduated / Alumni</span>
          <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1 block">{graduatedCount}</span>
          <span className="text-2xs text-indigo-600">Alumni directory records</span>
        </div>
      </div>

      {/* Workspace View Tabs & Filters Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {[
              { id: 'all', label: 'All Students', icon: Users },
              { id: 'class_roster', label: 'Class Rosters', icon: BookOpen },
              { id: 'transfers', label: `Transfers (${transferredCount})`, icon: ArrowRightLeft },
              { id: 'alumni', label: `Graduated & Alumni (${graduatedCount})`, icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = viewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={loadData}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-2xs font-semibold text-slate-500 mb-1">Campus</label>
            <select
              value={selectedCampusId}
              onChange={(e) => setSelectedCampusId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <option value="ALL">All Campuses</option>
              {campuses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-500 mb-1">Grade / Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <option value="ALL">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-500 mb-1">Section</label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <option value="ALL">All Sections</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-500 mb-1">Lifecycle State</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <option value="ALL">All States</option>
              <option value="ACTIVE">Active / Enrolled</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="WITHDRAWN">Withdrawn</option>
              <option value="GRADUATED">Graduated / Alumni</option>
            </select>
          </div>

          <div>
            <label className="block text-2xs font-semibold text-slate-500 mb-1">Search Roster</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, ID, phone..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        keyExtractor={(s) => s.id}
      />

      {/* Modal: Enroll Student */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll New Student (Authoritative Registration)"
        subtitle={`Registering student into master database.`}
        maxWidth="xl"
      >
        <form onSubmit={handleInitiateEnrollment} className="space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Student Identity & Demographics
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Aarav"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="e.g. Kumar"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admission ID / Registration No
              </label>
              <input
                type="text"
                value={studentIdNumber}
                onChange={(e) => setStudentIdNumber(e.target.value)}
                placeholder="Auto-generated (STU-YYYY-XXXXXX)"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 pt-2 pb-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Academic Placement
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Grade / Class *
              </label>
              <select
                value={formClassId}
                onChange={(e) => setFormClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Section Assignment *
              </label>
              <select
                value={formSectionId}
                onChange={(e) => setFormSectionId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 10A-05"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="border-b border-slate-100 dark:border-slate-800 pt-2 pb-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Primary Guardian Details
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guardian Full Name
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Dr. Meenakshi Sundaram"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Relationship
              </label>
              <select
                value={guardianRel}
                onChange={(e) => setGuardianRel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Legal Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guardian Mobile Phone
              </label>
              <input
                type="text"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Guardian Email Address
              </label>
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verify & Complete Enrollment
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Student 360 Workspace */}
      {selectedStudentFor360 && (
        <Student360WorkspaceModal
          studentId={selectedStudentFor360}
          isOpen={!!selectedStudentFor360}
          onClose={() => setSelectedStudentFor360(null)}
          classes={classes}
          sections={sections}
          academicYears={academicYears}
          onOpenStatusModal={(st) => {
            setSelectedStudentFor360(null);
            setSelectedStudentForStatus(st);
          }}
        />
      )}

      {/* Modal: Status Transition Engine */}
      {selectedStudentForStatus && (
        <StudentStatusTransitionModal
          student={selectedStudentForStatus}
          isOpen={!!selectedStudentForStatus}
          onClose={() => setSelectedStudentForStatus(null)}
          onStatusUpdated={() => loadData()}
        />
      )}

      {/* Modal: Duplicate Warning */}
      {isDuplicateModalOpen && (
        <StudentDuplicateWarningModal
          isOpen={isDuplicateModalOpen}
          candidates={duplicateCandidates}
          onCancel={() => {
            setIsDuplicateModalOpen(false);
            setPendingStudentPayload(null);
          }}
          onProceedAnyway={() => {
            if (pendingStudentPayload) {
              executeEnrollment(pendingStudentPayload);
            }
          }}
          onSelectExistingStudent={(stId) => {
            setIsDuplicateModalOpen(false);
            setIsEnrollModalOpen(false);
            setSelectedStudentFor360(stId);
          }}
        />
      )}
    </div>
  );
};
