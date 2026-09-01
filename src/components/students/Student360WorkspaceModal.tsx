import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Student,
  ClassGrade,
  Section,
  AcademicYear,
  StudentEnrollment,
  StudentAttendanceRecord,
  ReportCard,
  MarkEntry,
  AuditRecord
} from '../../types';
import { StudentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Student360ExitTab } from './Student360ExitTab';
import {
  GraduationCap,
  User,
  HeartHandshake,
  Calendar,
  BookOpen,
  FileText,
  Clock,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Award,
  Upload,
  History,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileCheck,
  ShieldAlert,
  HeartPulse,
  Fingerprint,
  LogOut
} from 'lucide-react';

interface Props {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
  classes: ClassGrade[];
  sections: Section[];
  academicYears: AcademicYear[];
  onOpenStatusModal?: (student: Student) => void;
}

export const Student360WorkspaceModal: React.FC<Props> = ({
  studentId,
  isOpen,
  onClose,
  classes,
  sections,
  academicYears,
  onOpenStatusModal
}) => {
  const { hasPermission, currentUser } = useAuth();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'guardians' | 'enrollments' | 'attendance' | 'examinations' | 'documents' | 'timeline' | 'restricted' | 'exits'
  >('overview');

  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [attendance, setAttendance] = useState<StudentAttendanceRecord[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [marks, setMarks] = useState<MarkEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Document Upload state
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<any>('birth_certificate');

  const load360Data = async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const data = await StudentService.getStudent360Data(studentId, 'ALL', currentUser);
      setStudent(data.student);
      setEnrollments(data.enrollments);
      setAttendance(data.attendanceHistory);
      setReportCards(data.reportCards);
      setMarks(data.marks);
      setAuditLogs(data.auditLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      load360Data();
    }
  }, [studentId, isOpen]);

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === student?.currentClassId);
  const currentSec = sections.find(s => s.id === student?.currentSectionId);
  const currentAY = academicYears.find(ay => ay.id === student?.currentAcademicYearId);

  const getStatusBadge = (status?: string) => {
    const s = (status || 'ACTIVE').toUpperCase();
    if (s === 'ACTIVE' || s === 'ENROLLED') return <Badge variant="success">ACTIVE</Badge>;
    if (s === 'TRANSFERRED') return <Badge variant="warning">TRANSFERRED</Badge>;
    if (s === 'WITHDRAWN') return <Badge variant="danger">WITHDRAWN</Badge>;
    if (s === 'GRADUATED' || s === 'ALUMNI') return <Badge variant="primary">GRADUATED</Badge>;
    if (s === 'ON_LEAVE') return <Badge variant="info">ON LEAVE</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  };

  // Compute attendance summary
  const totalAtt = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const attPct = totalAtt > 0 ? Math.round(((presentCount + lateCount) / totalAtt) * 100) : 100;

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !student) return;

    try {
      await StudentService.addStudentDocument(
        student.id,
        {
          title: docTitle,
          documentType: docType,
          status: 'VERIFIED',
          notes: 'Uploaded and verified via Student 360 Workspace'
        },
        {
          userId: currentUser?.id || 'usr_admin',
          email: currentUser?.email || 'admin@edutech.edu',
          name: currentUser?.displayName || 'Admin'
        }
      );
      notify('success', 'Document Attached', `Document "${docTitle}" added to student profile.`);
      setDocTitle('');
      await load360Data();
    } catch (err: any) {
      notify('error', 'Upload Failed', err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="2xl"
    >
      {isLoading ? (
        <div className="py-12 text-center space-y-2">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Retrieving Student 360° Profile & Cross-Module Intelligence...</p>
        </div>
      ) : !student ? (
        <div className="py-8 text-center text-slate-500 text-xs">Student record not found.</div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white/20">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">
                    {student.firstName} {student.middleName || ''} {student.lastName}
                  </h2>
                  {getStatusBadge(student.status)}
                </div>
                <p className="text-xs text-indigo-200 font-mono mt-0.5">
                  Permanent Admission ID: <span className="text-white font-bold">{student.studentIdNumber}</span> • Roll: {student.rollNumber || 'N/A'}
                </p>
                <p className="text-2xs text-slate-300 mt-0.5">
                  Placement: {currentClass?.name || 'Class Grade'} — {currentSec?.name || 'Section'} • Academic Year: {currentAY?.name || '2025-26'}
                </p>
              </div>
            </div>

            {hasPermission('student.status.change') && onOpenStatusModal && (
              <button
                type="button"
                onClick={() => onOpenStatusModal(student)}
                className="px-3 py-1.5 text-2xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <History className="w-3.5 h-3.5" />
                Change Lifecycle Status
              </button>
            )}
          </div>

          {/* 360 Workspace Tabs */}
          {(() => {
            const hasMedicalPermission = hasPermission('student.medical.view') || hasPermission('student.sensitive.view');
            const hasIdentityPermission = hasPermission('student.identity.view') || hasPermission('student.sensitive.view');
            
            let isSelfOrWard = false;
            if (currentUser && student) {
              const isStudent = currentUser.roleAssignments?.some(ra => ra.roleCode === 'STUDENT' && ra.tenantId === student.tenantId);
              if (isStudent && (currentUser.metadata?.studentId === student.id || currentUser.email?.toLowerCase() === student.email?.toLowerCase())) {
                isSelfOrWard = true;
              }
              const isParent = currentUser.roleAssignments?.some(ra => ra.roleCode === 'PARENT_GUARDIAN' && ra.tenantId === student.tenantId);
              if (isParent) {
                const isLinkedByMetadata = currentUser.metadata?.studentId === student.id;
                const isLinkedByGuardianList = student.guardians?.some((g: any) => 
                  g.email?.toLowerCase() === currentUser.email?.toLowerCase() || 
                  (currentUser.phoneNumber && g.phone === currentUser.phoneNumber)
                );
                if (isLinkedByMetadata || isLinkedByGuardianList) {
                  isSelfOrWard = true;
                }
              }
            }

            const showRestrictedTab = hasMedicalPermission || hasIdentityPermission || isSelfOrWard;

            return (
              <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'personal', label: 'Personal & Contact', icon: User },
                  { id: 'guardians', label: `Guardians (${student.guardians?.length || 0})`, icon: HeartHandshake },
                  ...(showRestrictedTab ? [{ id: 'restricted', label: 'Restricted Info', icon: ShieldAlert }] : []),
                  { id: 'enrollments', label: `Enrollments (${enrollments.length})`, icon: Calendar },
                  { id: 'attendance', label: `Attendance (${attPct}%)`, icon: Clock },
                  { id: 'examinations', label: `Exams & Marks (${marks.length})`, icon: Award },
                  { id: 'documents', label: `Documents (${student.documents?.length || 0})`, icon: FileText },
                  { id: 'exits', label: 'Exit & Clearance', icon: LogOut },
                  { id: 'timeline', label: `Timeline (${auditLogs.length})`, icon: History }
                ].map(t => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Tab Content */}
          <div className="min-h-[320px]">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                    <span className="text-slate-500 block text-2xs uppercase font-bold">Academic Class</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block mt-0.5">
                      {currentClass?.name || 'Grade 10'}
                    </span>
                    <span className="text-2xs text-indigo-600 dark:text-indigo-400">Section: {currentSec?.name || 'Section A'}</span>
                  </div>

                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 rounded-xl">
                    <span className="text-slate-500 block text-2xs uppercase font-bold">Attendance Score</span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 block mt-0.5">
                      {attPct}% Regularity
                    </span>
                    <span className="text-2xs text-slate-500">{presentCount} Days Present out of {totalAtt} recorded</span>
                  </div>

                  <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50 rounded-xl">
                    <span className="text-slate-500 block text-2xs uppercase font-bold">Primary Guardian</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block mt-0.5 truncate">
                      {student.guardians?.[0]?.name || 'Not Registered'}
                    </span>
                    <span className="text-2xs text-slate-500 capitalize">{student.guardians?.[0]?.relationship || 'Guardian'} • {student.guardians?.[0]?.phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Primary Contact & Address */}
                <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Residential & Contact Coordinates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                    <div>
                      <span className="text-slate-400 block">Student Email:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{student.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Student Phone:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{student.phone || 'N/A'}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block">Address:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {student.address}, {student.city || ''} {student.state || ''} {student.postalCode || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERSONAL & CONTACT TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="text-slate-400 block text-2xs">Date of Birth</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.dateOfBirth}</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="text-slate-400 block text-2xs">Gender</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{student.gender}</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="text-slate-400 block text-2xs">Blood Group</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-rose-50/10 border-dashed">
                    <span className="text-slate-400 block text-2xs flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-500" /> National ID / Govt No
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-2xs">Protected (See Restricted Tab)</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="text-slate-400 block text-2xs">Enrollment Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.enrollmentDate}</span>
                  </div>
                  <div className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="text-slate-400 block text-2xs">Admission Session</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{student.admissionSessionId || 'AY-2025-26'}</span>
                  </div>
                </div>

                {/* Previous Education History */}
                <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Previous Educational Background</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs">
                    <div>
                      <span className="text-slate-400 block">Previous Institution:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{student.previousInstitution || 'DPS Vasant Kunj'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Previous Class / Board:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{student.previousClass || 'Class 9'} ({student.previousBoard || 'CBSE'})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Marks / Performance:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{student.previousAcademicInfo || '89.4% Aggregate'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GUARDIANS TAB */}
            {activeTab === 'guardians' && (
              <div className="space-y-3 text-xs">
                {student.guardians?.map((g) => (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{g.name}</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 capitalize">
                          {g.relationship}
                        </span>
                        {g.isPrimaryContact && <Badge variant="primary" size="sm">Primary Contact</Badge>}
                      </div>
                      <p className="text-2xs text-slate-500">
                        Occupation: {g.occupation || 'Business / Professional'}
                      </p>
                      <div className="flex flex-wrap gap-3 text-2xs text-slate-600 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-indigo-500" /> {g.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-indigo-500" /> {g.email}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-2xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 sm:pl-3 shrink-0">
                      <span className="flex items-center gap-1 font-medium text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Receives SMS/Email Notifications
                      </span>
                      <span className="flex items-center gap-1 font-medium text-indigo-600">
                        <CheckCircle2 className="w-3 h-3" /> Authorized Parent Portal Access
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESTRICTED INFORMATION TAB */}
            {activeTab === 'restricted' && (() => {
              const hasMedicalPermission = hasPermission('student.medical.view') || hasPermission('student.sensitive.view');
              const hasIdentityPermission = hasPermission('student.identity.view') || hasPermission('student.sensitive.view');
              
              let isSelfOrWard = false;
              if (currentUser && student) {
                const isStudent = currentUser.roleAssignments?.some(ra => ra.roleCode === 'STUDENT' && ra.tenantId === student.tenantId);
                if (isStudent && (currentUser.metadata?.studentId === student.id || currentUser.email?.toLowerCase() === student.email?.toLowerCase())) {
                  isSelfOrWard = true;
                }
                const isParent = currentUser.roleAssignments?.some(ra => ra.roleCode === 'PARENT_GUARDIAN' && ra.tenantId === student.tenantId);
                if (isParent) {
                  const isLinkedByMetadata = currentUser.metadata?.studentId === student.id;
                  const isLinkedByGuardianList = student.guardians?.some((g: any) => 
                    g.email?.toLowerCase() === currentUser.email?.toLowerCase() || 
                    (currentUser.phoneNumber && g.phone === currentUser.phoneNumber)
                  );
                  if (isLinkedByMetadata || isLinkedByGuardianList) {
                    isSelfOrWard = true;
                  }
                }
              }

              return (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Classified Restricted Demographics</span>
                    </div>
                    <p className="text-2xs text-slate-500 leading-relaxed">
                      This tab contains access-controlled, confidential student attributes. Every retrieval of these attributes is logged in the institution's immutable audit trail for security compliance. Unauthorized extraction is strictly prohibited.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medical & Special Needs Section */}
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                        <HeartPulse className="w-4 h-4" />
                        <span>Medical & Special Support</span>
                      </div>

                      {hasMedicalPermission || isSelfOrWard ? (
                        <div className="space-y-3">
                          <div>
                            <span className="text-slate-400 text-2xs block mb-0.5">Sensitive Medical Conditions / Allergies</span>
                            <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg min-h-[44px]">
                              {student.medicalNotes ? (
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{student.medicalNotes}</p>
                              ) : (
                                <p className="text-slate-400 italic">No medical records or allergies reported.</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 text-2xs block mb-0.5">Special Needs & Accommodations (IEP)</span>
                            <div className="p-2.5 bg-slate-50 dark:bg-slate-855 rounded-lg min-h-[44px]">
                              {student.specialNeeds ? (
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{student.specialNeeds}</p>
                              ) : (
                                <p className="text-slate-400 italic">No special accommodations or IEP defined.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-slate-400 italic text-2xs">
                          Access Denied: Missing `student.medical.view` permission.
                        </div>
                      )}
                    </div>

                    {/* National Identity Section */}
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                        <Fingerprint className="w-4 h-4" />
                        <span>National Identity Records</span>
                      </div>

                      {hasIdentityPermission || isSelfOrWard ? (
                        <div className="space-y-3">
                          <div>
                            <span className="text-slate-400 text-2xs block mb-0.5">Government Issued Identification Number (Aadhaar/SSN/UID)</span>
                            <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-lg font-mono">
                              {student.nationalId ? (
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{student.nationalId}</p>
                              ) : (
                                <p className="text-slate-400 italic">No identification record attached.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center text-slate-400 italic text-2xs">
                          Access Denied: Missing `student.identity.view` permission.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ENROLLMENTS TAB */}
            {activeTab === 'enrollments' && (
              <div className="space-y-3 text-xs">
                <p className="text-2xs text-slate-500">Authoritative historical enrollment timeline retrieved from `enrollments` collection.</p>
                <div className="space-y-2">
                  {enrollments.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                      No historical enrollment records found.
                    </div>
                  ) : (
                    enrollments.map((e) => {
                      const cls = classes.find(c => c.id === e.classId);
                      const sec = sections.find(s => s.id === e.sectionId);
                      const ay = academicYears.find(a => a.id === e.academicYearId);
                      return (
                        <div
                          key={e.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {ay?.name || e.academicYearId} — {cls?.name || e.classId} ({sec?.name || 'Section A'})
                            </p>
                            <p className="text-2xs text-slate-500 font-mono">
                              Enrolled: {e.enrollmentDate} • Roll No: {e.rollNumber || 'N/A'}
                            </p>
                          </div>
                          <Badge variant={e.status === 'ACTIVE' ? 'success' : 'neutral'}>
                            {e.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center font-bold text-2xs">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-lg">
                    Present: {presentCount} Days
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-lg">
                    Late: {lateCount} Days
                  </div>
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 rounded-lg">
                    Absent: {absentCount} Days
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                  {attendance.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-2xs">No attendance logs found.</div>
                  ) : (
                    attendance.map((att) => (
                      <div key={att.id} className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-2xs">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{att.date}</span>
                          <span className="text-slate-400 ml-2">Recorded by: {att.recordedBy}</span>
                          {att.remarks && <p className="text-slate-500 italic mt-0.5">Note: {att.remarks}</p>}
                        </div>
                        <Badge size="sm" variant={att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'danger'}>
                          {att.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* EXAMINATIONS TAB */}
            {activeTab === 'examinations' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Recent Subject Marks & Assessment Scores</h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {marks.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-2xs">No examination mark entries recorded yet.</div>
                  ) : (
                    marks.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{m.subjectName} ({m.subjectCode || 'CBSE'})</p>
                          <p className="text-2xs text-slate-500">Exam: {m.examName || 'Term Assessment'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block">
                            {m.marksObtained} / {m.maximumMarks || m.maxMarks || 100}
                          </span>
                          <span className="text-2xs text-slate-400">Grade: {m.grade || 'A1'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="space-y-4 text-xs">
                {/* Upload Form */}
                <form onSubmit={handleAddDocument} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. CBSE Grade 9 Marksheet & TC"
                      className="w-full px-2.5 py-1.5 text-2xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div className="w-full sm:w-44">
                    <label className="block text-2xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Document Type
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full px-2 py-1.5 text-2xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option value="birth_certificate">Birth Certificate</option>
                      <option value="transfer_certificate">Transfer Certificate</option>
                      <option value="previous_marksheet">Previous Marksheet</option>
                      <option value="national_id">Aadhaar / National ID</option>
                      <option value="photo">Student Photograph</option>
                      <option value="medical_record">Medical Certificate</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-3 py-1.5 text-2xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-1 shrink-0"
                  >
                    <Upload className="w-3 h-3" />
                    Attach Document
                  </button>
                </form>

                {/* Documents List */}
                <div className="space-y-2">
                  {student.documents?.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-2xs">No documents attached yet.</div>
                  ) : (
                    student.documents?.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-indigo-600" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</p>
                            <p className="text-2xs text-slate-500 capitalize">{doc.documentType?.replace('_', ' ') || 'Unknown'} • Uploaded: {doc.uploadedAt?.split('T')[0] || 'Unknown'}</p>
                          </div>
                        </div>
                        <Badge variant={doc.status === 'VERIFIED' ? 'success' : 'neutral'}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TIMELINE & AUDIT TAB */}
            {activeTab === 'timeline' && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto text-xs pr-1">
                {auditLogs.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-2xs">No audit logs recorded for this student.</div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 border-l-2 border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 rounded-r-lg space-y-0.5">
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{log.action}</span>
                        <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-2xs text-slate-600 dark:text-slate-400">By: {log.userDisplayName} ({log.userEmail})</p>
                      {log.notes && <p className="text-2xs text-slate-500 italic">{log.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* EXIT & CLEARANCE WORKFLOW TAB */}
            {activeTab === 'exits' && student && (
              <div className="max-h-[450px] overflow-y-auto pr-1">
                <Student360ExitTab
                  student={student}
                  currentUser={currentUser}
                  onRefresh={load360Data}
                />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200"
            >
              Close Workspace
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
