import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Building2,
  FileText,
  Plus,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Send,
  Lock,
  CalendarDays,
  Briefcase,
  AlertCircle,
  Eye,
  Check,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchedulingService } from '../../services/schedulingService';
import { FirebaseService } from '../../services/firebaseService';
import { AuditService } from '../../services/auditService';
import {
  Timetable,
  ScheduleEntry,
  ResourceBookingRequest,
  SchedulingConflict,
  FacultySubstitution,
  ScheduleChangeRequest,
  CalendarException,
  WorkloadSnapshot,
  RoomUtilizationSnapshot,
  SchedulingAnalytics,
  TimetableStatus
} from '../../types/scheduling';
import { AuditRecord } from '../../types/index';

interface SchedulingWorkspaceProps {
  tenantId?: string;
  campusId?: string;
  userRole?: string;
  userId?: string;
  userName?: string;
}

export const SchedulingWorkspace: React.FC<SchedulingWorkspaceProps> = ({
  tenantId = 'DEFAULT',
  campusId = 'MAIN_CAMPUS',
  userRole = 'SUPER_ADMIN',
  userId = 'usr_admin',
  userName = 'Platform Administrator'
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'command_center'
    | 'timetables'
    | 'builder'
    | 'workload'
    | 'rooms'
    | 'bookings'
    | 'conflicts'
    | 'substitutions'
    | 'changes'
    | 'exceptions'
    | 'analytics'
    | 'audit'
  >('command_center');

  // Core Data States
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [bookings, setBookings] = useState<ResourceBookingRequest[]>([]);
  const [conflicts, setConflicts] = useState<SchedulingConflict[]>([]);
  const [substitutions, setSubstitutions] = useState<FacultySubstitution[]>([]);
  const [changeRequests, setChangeRequests] = useState<ScheduleChangeRequest[]>([]);
  const [exceptions, setExceptions] = useState<CalendarException[]>([]);
  const [workloads, setWorkloads] = useState<WorkloadSnapshot[]>([]);
  const [roomUtilizations, setRoomUtilizations] = useState<RoomUtilizationSnapshot[]>([]);
  const [analytics, setAnalytics] = useState<SchedulingAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // UI & Loading States
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubstitutionModalOpen, setIsSubstitutionModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);

  // Form States
  const [timetableForm, setTimetableForm] = useState({
    title: '',
    code: '',
    className: '',
    classId: '',
    sectionName: '',
    sectionId: '',
    academicYearId: 'AY2026',
    effectiveFrom: new Date().toISOString().substring(0, 10),
    effectiveTo: '2026-12-31'
  });

  const [entryForm, setEntryForm] = useState({
    timetableId: '',
    className: '',
    classId: '',
    sectionName: '',
    sectionId: '',
    subjectName: '',
    subjectId: '',
    subjectCode: '',
    teacherName: '',
    teacherId: '',
    roomName: '',
    roomId: '',
    isLab: false,
    slotName: 'Period 1',
    dayOfWeek: 'MONDAY' as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY',
    startTime: '09:00',
    endTime: '09:45'
  });

  const [bookingForm, setBookingForm] = useState({
    resourceName: '',
    resourceId: '',
    resourceType: 'ROOM' as 'ROOM' | 'LABORATORY' | 'AUDITORIUM' | 'EQUIPMENT' | 'GROUND',
    purpose: '',
    bookingDate: new Date().toISOString().substring(0, 10),
    startTime: '10:00',
    endTime: '11:30'
  });

  const [substitutionForm, setSubstitutionForm] = useState({
    scheduleEntryId: '',
    originalTeacherName: '',
    originalTeacherId: '',
    substituteTeacherName: '',
    substituteTeacherId: '',
    effectiveDate: new Date().toISOString().substring(0, 10),
    reason: ''
  });

  const [changeForm, setChangeForm] = useState({
    timetableId: '',
    requestType: 'FACULTY_CHANGE' as 'FACULTY_CHANGE' | 'ROOM_CHANGE' | 'TIME_SLOT_CHANGE' | 'EMERGENCY_CANCEL',
    reason: '',
    entryId: '',
    newTeacherName: '',
    newRoomName: ''
  });

  const [exceptionForm, setExceptionForm] = useState({
    title: '',
    exceptionType: 'INSTITUTIONAL_HOLIDAY' as 'INSTITUTIONAL_HOLIDAY' | 'CAMPUS_CLOSURE' | 'SPECIAL_ACADEMIC_DAY' | 'EMERGENCY_CLOSURE',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date().toISOString().substring(0, 10),
    reason: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ttList, entryList, bookList, confList, subList, changeList, excList] = await Promise.all([
        FirebaseService.getTenantCollection<Timetable>('scheduling_timetables', tenantId),
        FirebaseService.getTenantCollection<ScheduleEntry>('scheduling_entries', tenantId),
        FirebaseService.getTenantCollection<ResourceBookingRequest>('scheduling_bookings', tenantId),
        FirebaseService.getTenantCollection<SchedulingConflict>('scheduling_conflicts', tenantId),
        FirebaseService.getTenantCollection<FacultySubstitution>('scheduling_substitutions', tenantId),
        FirebaseService.getTenantCollection<ScheduleChangeRequest>('scheduling_change_requests', tenantId),
        FirebaseService.getTenantCollection<CalendarException>('scheduling_calendar_exceptions', tenantId)
      ]);

      setTimetables(ttList);
      setEntries(entryList);
      setBookings(bookList);
      setConflicts(confList);
      setSubstitutions(subList);
      setChangeRequests(changeList);
      setExceptions(excList);

      const [wlData, roomData, stats] = await Promise.all([
        SchedulingService.calculateFacultyWorkload(tenantId),
        SchedulingService.calculateRoomUtilization(tenantId),
        SchedulingService.getSchedulingAnalytics(tenantId)
      ]);

      setWorkloads(wlData);
      setRoomUtilizations(roomData);
      setAnalytics(stats);

      const logs = await AuditService.getAuditLogs({ tenantId, limit: 20 });
      setAuditLogs(logs);
    } catch (err: any) {
      console.error('Error loading scheduling data:', err);
      showFeedback('error', err.message || 'Failed to load scheduling workspace data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handlers
  const handleCreateTimetable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SchedulingService.createTimetable(
        {
          tenantId,
          campusId,
          academicYearId: timetableForm.academicYearId,
          title: timetableForm.title,
          code: timetableForm.code || `TT-${timetableForm.className}-${timetableForm.sectionName}`,
          classId: timetableForm.classId || 'cls_' + Date.now(),
          className: timetableForm.className,
          sectionId: timetableForm.sectionId || 'sec_' + Date.now(),
          sectionName: timetableForm.sectionName,
          effectiveFrom: timetableForm.effectiveFrom,
          effectiveTo: timetableForm.effectiveTo,
          createdBy: userId,
          createdByName: userName
        },
        userId,
        userName,
        tenantId
      );
      showFeedback('success', 'Timetable created in DRAFT status successfully.');
      setIsTimetableModalOpen(false);
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to create timetable.');
    }
  };

  const handleApproveTimetable = async (timetableId: string) => {
    try {
      await SchedulingService.approveTimetable(timetableId, userId, userName, tenantId);
      showFeedback('success', 'Timetable formally APPROVED.');
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Approval failed.');
    }
  };

  const handlePublishTimetable = async (timetableId: string) => {
    try {
      await SchedulingService.publishTimetable(timetableId, 'Official Term Release', userId, userName, tenantId);
      showFeedback('success', 'Timetable PUBLISHED and immutable version snapshot recorded.');
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Publication failed.');
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SchedulingService.createScheduleEntry(
        {
          tenantId,
          campusId,
          timetableId: entryForm.timetableId || (timetables[0]?.id || 'tt_default'),
          academicYearId: 'AY2026',
          classId: entryForm.classId || 'cls_1',
          className: entryForm.className || 'Class 10',
          sectionId: entryForm.sectionId || 'sec_a',
          sectionName: entryForm.sectionName || 'Section A',
          subjectId: entryForm.subjectId || 'subj_1',
          subjectName: entryForm.subjectName,
          subjectCode: entryForm.subjectCode || entryForm.subjectName.substring(0, 4).toUpperCase(),
          teacherId: entryForm.teacherId || 'tch_' + Date.now(),
          teacherName: entryForm.teacherName,
          roomId: entryForm.roomId || 'rm_' + Date.now(),
          roomName: entryForm.roomName,
          isLab: entryForm.isLab,
          slot: {
            id: 's_' + Date.now(),
            slotName: entryForm.slotName,
            startTime: entryForm.startTime,
            endTime: entryForm.endTime,
            dayOfWeek: entryForm.dayOfWeek,
            order: 1
          },
          effectiveStartDate: new Date().toISOString().substring(0, 10),
          effectiveEndDate: '2026-12-31',
          status: 'ACTIVE',
          createdBy: userId
        },
        userId,
        tenantId
      );
      showFeedback('success', 'Schedule Entry created & conflict check executed.');
      setIsEntryModalOpen(false);
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to create schedule entry.');
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SchedulingService.requestResourceBooking(
        {
          tenantId,
          campusId,
          resourceId: bookingForm.resourceId || 'res_' + Date.now(),
          resourceName: bookingForm.resourceName,
          resourceType: bookingForm.resourceType,
          requesterId: userId,
          requesterName: userName,
          requesterRole: userRole,
          purpose: bookingForm.purpose,
          bookingDate: bookingForm.bookingDate,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          approvalRequired: true
        },
        userId,
        tenantId
      );
      showFeedback('success', 'Resource booking request submitted.');
      setIsBookingModalOpen(false);
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Booking request failed.');
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await SchedulingService.approveResourceBooking(bookingId, userId, userName, tenantId);
      showFeedback('success', 'Resource booking request APPROVED.');
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Booking approval failed.');
    }
  };

  const handleCreateSubstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SchedulingService.requestFacultySubstitution(
        {
          tenantId,
          campusId,
          scheduleEntryId: substitutionForm.scheduleEntryId || (entries[0]?.id || 'se_1'),
          originalTeacherId: substitutionForm.originalTeacherId || 'tch_orig',
          originalTeacherName: substitutionForm.originalTeacherName,
          substituteTeacherId: substitutionForm.substituteTeacherId || 'tch_sub',
          substituteTeacherName: substitutionForm.substituteTeacherName,
          effectiveDate: substitutionForm.effectiveDate,
          reason: substitutionForm.reason,
          requestedBy: userId,
          requestedByName: userName
        },
        userId,
        tenantId
      );
      showFeedback('success', 'Faculty substitution requested.');
      setIsSubstitutionModalOpen(false);
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Substitution request failed.');
    }
  };

  const handleApproveSubstitution = async (subId: string) => {
    try {
      await SchedulingService.approveFacultySubstitution(subId, userId, userName, tenantId);
      showFeedback('success', 'Faculty substitution APPROVED.');
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Substitution approval failed.');
    }
  };

  const handleCreateException = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await SchedulingService.createCalendarException(
        {
          tenantId,
          campusId,
          title: exceptionForm.title,
          exceptionType: exceptionForm.exceptionType,
          startDate: exceptionForm.startDate,
          endDate: exceptionForm.endDate,
          affectsAllClasses: true,
          reason: exceptionForm.reason,
          createdBy: userId,
          createdByName: userName
        },
        userId,
        tenantId
      );
      showFeedback('success', 'Calendar exception recorded.');
      setIsExceptionModalOpen(false);
      loadData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to record exception.');
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calendar className="w-64 h-64 text-blue-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                EMS Phase 7.32 Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Multi-Tenant Governed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              Institutional Scheduling & Academic Operations Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Master academic timetables, dynamic conflict detection, resource booking, faculty workload projections, and scheduling governance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync DB</span>
            </button>
            <button
              onClick={() => setIsTimetableModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {[
          { id: 'command_center', label: 'Command Center', icon: Layers },
          { id: 'timetables', label: 'Timetables', icon: CalendarDays, badge: timetables.length },
          { id: 'builder', label: 'Schedule Builder', icon: Clock, badge: entries.length },
          { id: 'workload', label: 'Faculty Workload', icon: Briefcase },
          { id: 'rooms', label: 'Rooms & Facilities', icon: Building2 },
          { id: 'bookings', label: 'Resource Bookings', icon: BookingsIcon, badge: bookings.filter(b => b.status === 'REQUESTED').length },
          { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle, badge: conflicts.filter(c => c.status === 'OPEN').length, alert: conflicts.filter(c => c.status === 'OPEN').length > 0 },
          { id: 'substitutions', label: 'Substitutions', icon: UserCheck, badge: substitutions.filter(s => s.status === 'PENDING_APPROVAL').length },
          { id: 'changes', label: 'Schedule Changes', icon: RefreshCw },
          { id: 'exceptions', label: 'Calendar Exceptions', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'audit', label: 'Governance Audit', icon: ShieldCheck }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : tab.alert ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Active Timetables</span>
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {analytics?.activeTimetablesCount || 0}
              </div>
              <p className="text-[11px] text-slate-500">Total active & published timetables</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {analytics?.pendingApprovalsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500">Awaiting formal SoD review</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Open Conflicts</span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {analytics?.unresolvedConflictsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500">System detected overlapping slots</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Room Utilization</span>
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {analytics?.averageRoomUtilizationPercentage || 0}%
              </div>
              <p className="text-[11px] text-slate-500">Weekly occupancy projection</p>
            </div>
          </div>

          {/* Action Quick Launch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-blue-950 font-sans">Create Schedule Entry</h3>
                <p className="text-xs text-blue-800/80 mt-1">Assign period slot, subject, teacher and classroom with automatic conflict check.</p>
              </div>
              <button
                onClick={() => setIsEntryModalOpen(true)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entry</span>
              </button>
            </div>

            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-amber-950 font-sans">Resource Booking</h3>
                <p className="text-xs text-amber-800/80 mt-1">Request room, auditorium or laboratory facility reservation with approval governance.</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Book Facility</span>
              </button>
            </div>

            <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-purple-950 font-sans">Faculty Cover / Substitution</h3>
                <p className="text-xs text-purple-800/80 mt-1">Assign substitute teachers for absent faculty with validation and approval logging.</p>
              </div>
              <button
                onClick={() => setIsSubstitutionModalOpen(true)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Cover</span>
              </button>
            </div>
          </div>

          {/* Recent Timetables Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-sans">Active & Draft Timetables</h2>
              <button onClick={() => setActiveTab('timetables')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {timetables.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No timetables configured.</p>
                <p className="text-xs text-slate-400 mt-1">Create a new timetable to begin scheduling class periods.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">Title / Code</th>
                      <th className="px-3 py-2.5">Class & Section</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Version</th>
                      <th className="px-3 py-2.5">Effective Dates</th>
                      <th className="px-3 py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {timetables.slice(0, 5).map(tt => (
                      <tr key={tt.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-3 py-3 font-bold text-slate-900">
                          {tt.title}
                          <div className="text-[11px] font-mono text-slate-400">{tt.code}</div>
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {tt.className} — {tt.sectionName}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tt.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tt.status === 'APPROVED'
                                ? 'bg-blue-100 text-blue-800'
                                : tt.status === 'SUBMITTED_FOR_REVIEW'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tt.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-600">v{tt.version}</td>
                        <td className="px-3 py-3 text-slate-500">
                          {tt.effectiveFrom} to {tt.effectiveTo}
                        </td>
                        <td className="px-3 py-3 text-right space-x-2">
                          {tt.status === 'SUBMITTED_FOR_REVIEW' && tt.createdBy !== userId && (
                            <button
                              onClick={() => handleApproveTimetable(tt.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {tt.status === 'APPROVED' && (
                            <button
                              onClick={() => handlePublishTimetable(tt.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Publish
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLES */}
      {activeTab === 'timetables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">Governed Timetables Master</h2>
            <button
              onClick={() => setIsTimetableModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Timetable</span>
            </button>
          </div>

          {timetables.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No timetables configured.</p>
              <p className="text-xs text-slate-400 mt-1">Click "Create Timetable" to define a new class timetable profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timetables.map(tt => (
                <div key={tt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{tt.code}</span>
                        <h3 className="text-base font-bold text-slate-900">{tt.title}</h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tt.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tt.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800'
                            : tt.status === 'SUBMITTED_FOR_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tt.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class & Section:</span>
                        <span className="font-bold text-slate-800">{tt.className} ({tt.sectionName})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Version:</span>
                        <span className="font-mono text-slate-800">v{tt.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created By:</span>
                        <span>{tt.createdByName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {tt.status === 'DRAFT' && (
                      <button
                        onClick={async () => {
                          try {
                            await SchedulingService.submitTimetable(tt.id, userId, tenantId);
                            showFeedback('success', 'Submitted for review.');
                            loadData();
                          } catch (err: any) {
                            showFeedback('error', err.message);
                          }
                        }}
                        className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Submit for Review
                      </button>
                    )}
                    {tt.status === 'SUBMITTED_FOR_REVIEW' && (
                      <button
                        onClick={() => handleApproveTimetable(tt.id)}
                        disabled={tt.createdBy === userId}
                        title={tt.createdBy === userId ? 'Creator cannot approve own timetable (SoD)' : ''}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        Approve (SoD)
                      </button>
                    )}
                    {tt.status === 'APPROVED' && (
                      <button
                        onClick={() => handlePublishTimetable(tt.id)}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Publish Version
                      </button>
                    )}
                    {tt.status === 'PUBLISHED' && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mx-auto">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active & Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SCHEDULE BUILDER */}
      {activeTab === 'builder' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">Schedule Slot Allocations</h2>
            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule Slot</span>
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No schedule entries found.</p>
              <p className="text-xs text-slate-400 mt-1">Add class period slots, subject mappings and teacher allocations.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Day & Time</th>
                    <th className="px-3 py-2.5">Period</th>
                    <th className="px-3 py-2.5">Subject</th>
                    <th className="px-3 py-2.5">Class / Section</th>
                    <th className="px-3 py-2.5">Faculty</th>
                    <th className="px-3 py-2.5">Room / Lab</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {entries.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3 font-bold text-slate-900">
                        {entry.slot.dayOfWeek}
                        <div className="text-[11px] font-mono text-slate-500">{entry.slot.startTime} - {entry.slot.endTime}</div>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-700">{entry.slot.slotName}</td>
                      <td className="px-3 py-3 font-bold text-blue-900">
                        {entry.subjectName}
                        <span className="ml-1 text-[10px] font-mono text-slate-400">({entry.subjectCode})</span>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{entry.className} - {entry.sectionName}</td>
                      <td className="px-3 py-3 text-slate-800">
                        {entry.teacherName}
                        {entry.substituteTeacherName && (
                          <div className="text-[10px] text-purple-600 font-bold">Cover: {entry.substituteTeacherName}</div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {entry.roomName}
                        {entry.isLab && <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-purple-100 text-purple-700 font-bold">LAB</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FACULTY WORKLOAD */}
      {activeTab === 'workload' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">Faculty Workload Projections</h2>

          {workloads.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No faculty workload data available.</p>
              <p className="text-xs text-slate-400 mt-1">Workload metrics project dynamically from active schedule entries.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workloads.map(wl => (
                <div key={wl.teacherId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{wl.teacherName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        wl.status === 'OVERLOAD'
                          ? 'bg-rose-100 text-rose-800'
                          : wl.status === 'UNDERLOAD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {wl.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 text-center bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Periods</span>
                      <span className="text-base font-bold text-slate-800 font-mono">{wl.totalPeriods}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Contact Hrs</span>
                      <span className="text-base font-bold text-slate-800 font-mono">{wl.contactHours}h</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Lab Hrs</span>
                      <span className="text-base font-bold text-purple-700 font-mono">{wl.labHours}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ROOMS & FACILITIES */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">Room & Facility Utilization</h2>

          {roomUtilizations.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No room utilization data calculated.</p>
              <p className="text-xs text-slate-400 mt-1">Add schedule entries to calculate facility utilization.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roomUtilizations.map(room => (
                <div key={room.roomId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{room.roomName}</h3>
                    <span className="text-xs font-mono font-bold text-blue-600">{room.utilizationPercentage}% occupied</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        room.utilizationPercentage > 85 ? 'bg-rose-500' : room.utilizationPercentage > 50 ? 'bg-blue-600' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${room.utilizationPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>Booked Slots: <strong className="text-slate-800">{room.totalSlotsBooked}</strong></span>
                    <span>Max Capacity: <strong className="text-slate-800">{room.totalSlotsAvailable}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: RESOURCE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">Resource Booking Requests</h2>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Resource</span>
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <BookingsIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No resource bookings found.</p>
              <p className="text-xs text-slate-400 mt-1">Submit resource reservation requests for auditoriums, labs, or rooms.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Resource</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Requester</th>
                    <th className="px-3 py-2.5">Date & Time</th>
                    <th className="px-3 py-2.5">Purpose</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map(bk => (
                    <tr key={bk.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3 font-bold text-slate-900">{bk.resourceName}</td>
                      <td className="px-3 py-3 font-mono text-slate-600">{bk.resourceType}</td>
                      <td className="px-3 py-3 text-slate-700">{bk.requesterName}</td>
                      <td className="px-3 py-3 text-slate-700">
                        {bk.bookingDate} ({bk.startTime}-{bk.endTime})
                      </td>
                      <td className="px-3 py-3 text-slate-600">{bk.purpose}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            bk.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {bk.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {bk.status === 'REQUESTED' && bk.requesterId !== userId && (
                          <button
                            onClick={() => handleApproveBooking(bk.id)}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: CONFLICTS */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">System-Detected Scheduling Conflicts</h2>

          {conflicts.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No scheduling conflicts detected.</p>
              <p className="text-xs text-slate-400 mt-1">All class, faculty, room and laboratory schedules are clean.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map(cnf => (
                <div key={cnf.id} className="bg-white rounded-2xl border border-rose-200 p-4 shadow-2xs flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-900">{cnf.conflictType}</span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">{cnf.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{cnf.description}</p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-1">Detected at: {new Date(cnf.detectedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold font-mono">{cnf.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: SUBSTITUTIONS */}
      {activeTab === 'substitutions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">Faculty Cover & Substitutions</h2>
            <button
              onClick={() => setIsSubstitutionModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Cover</span>
            </button>
          </div>

          {substitutions.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No substitutions recorded.</p>
              <p className="text-xs text-slate-400 mt-1">Assign substitute teachers for absent faculty.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Original Teacher</th>
                    <th className="px-3 py-2.5">Substitute Cover</th>
                    <th className="px-3 py-2.5">Effective Date</th>
                    <th className="px-3 py-2.5">Reason</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {substitutions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3 font-bold text-slate-900">{sub.originalTeacherName}</td>
                      <td className="px-3 py-3 font-bold text-purple-700">{sub.substituteTeacherName}</td>
                      <td className="px-3 py-3 font-mono text-slate-600">{sub.effectiveDate}</td>
                      <td className="px-3 py-3 text-slate-600">{sub.reason}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {sub.status === 'PENDING_APPROVAL' && sub.requestedBy !== userId && (
                          <button
                            onClick={() => handleApproveSubstitution(sub.id)}
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 9: SCHEDULE CHANGES */}
      {activeTab === 'changes' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">Schedule Change Proposals</h2>
          {changeRequests.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No schedule change requests found.</p>
              <p className="text-xs text-slate-400 mt-1">Formal adjustments to active timetables undergo SoD review before implementation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {changeRequests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">{req.requestType}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">{req.status}</span>
                  </div>
                  <p className="text-xs text-slate-600">Reason: {req.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 10: CALENDAR EXCEPTIONS */}
      {activeTab === 'exceptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">Calendar Exceptions & Emergency Closures</h2>
            <button
              onClick={() => setIsExceptionModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exception</span>
            </button>
          </div>

          {exceptions.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No calendar exceptions recorded.</p>
              <p className="text-xs text-slate-400 mt-1">Record institutional holidays, special academic days, or emergency campus closures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exceptions.map(exc => (
                <div key={exc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{exc.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{exc.exceptionType}</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Dates: <strong className="text-slate-900 font-mono">{exc.startDate} to {exc.endDate}</strong></div>
                    <div>Reason: {exc.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 11: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-sans">Scheduling Governance Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Average Faculty Contact Hours</span>
              <div className="text-3xl font-extrabold text-blue-900 font-mono">{analytics?.averageFacultyWorkloadHours || 0} hrs/wk</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Overall Room Occupancy</span>
              <div className="text-3xl font-extrabold text-emerald-800 font-mono">{analytics?.averageRoomUtilizationPercentage || 0}%</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Resource Booking Volume</span>
              <div className="text-3xl font-extrabold text-purple-900 font-mono">{analytics?.resourceBookingsCount || 0} requests</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: GOVERNANCE AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-sans">Immutable Governance Audit Log</h2>
          {auditLogs.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No audit logs logged yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Timestamp</th>
                    <th className="px-3 py-2.5">Action</th>
                    <th className="px-3 py-2.5">Resource</th>
                    <th className="px-3 py-2.5">User</th>
                    <th className="px-3 py-2.5">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-3 py-3 font-bold text-slate-900">{log.action}</td>
                      <td className="px-3 py-3 text-slate-700">{log.resourceName || log.resourceId}</td>
                      <td className="px-3 py-3 text-slate-600">{log.userDisplayName || log.userEmail}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Timetable Modal */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Create Academic Timetable</h3>
              <button onClick={() => setIsTimetableModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTimetable} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Timetable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10-A Regular Timetable"
                  value={timetableForm.title}
                  onChange={e => setTimetableForm({ ...timetableForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Class 10"
                    value={timetableForm.className}
                    onChange={e => setTimetableForm({ ...timetableForm, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Section A"
                    value={timetableForm.sectionName}
                    onChange={e => setTimetableForm({ ...timetableForm, sectionName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimetableModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                  Save DRAFT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Schedule Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Add Schedule Slot Entry</h3>
              <button onClick={() => setIsEntryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateEntry} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Physics Lab"
                  value={entryForm.subjectName}
                  onChange={e => setEntryForm({ ...entryForm, subjectName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty Teacher Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Sarah Jenkins"
                    value={entryForm.teacherName}
                    onChange={e => setEntryForm({ ...entryForm, teacherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Facility</label>
                  <input
                    type="text"
                    required
                    placeholder="Room 101"
                    value={entryForm.roomName}
                    onChange={e => setEntryForm({ ...entryForm, roomName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={entryForm.dayOfWeek}
                    onChange={e => setEntryForm({ ...entryForm, dayOfWeek: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="MONDAY">MONDAY</option>
                    <option value="TUESDAY">TUESDAY</option>
                    <option value="WEDNESDAY">WEDNESDAY</option>
                    <option value="THURSDAY">THURSDAY</option>
                    <option value="FRIDAY">FRIDAY</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={entryForm.startTime}
                    onChange={e => setEntryForm({ ...entryForm, startTime: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:45"
                    value={entryForm.endTime}
                    onChange={e => setEntryForm({ ...entryForm, endTime: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isLabCheck"
                  checked={entryForm.isLab}
                  onChange={e => setEntryForm({ ...entryForm, isLab: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <label htmlFor="isLabCheck" className="text-xs font-bold text-slate-700">Is Practical Laboratory Session?</label>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Resource Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Resource Booking Request</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Auditorium, Science Lab 2"
                  value={bookingForm.resourceName}
                  onChange={e => setBookingForm({ ...bookingForm, resourceName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={bookingForm.resourceType}
                    onChange={e => setBookingForm({ ...bookingForm, resourceType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="ROOM">ROOM</option>
                    <option value="LABORATORY">LABORATORY</option>
                    <option value="AUDITORIUM">AUDITORIUM</option>
                    <option value="EQUIPMENT">EQUIPMENT</option>
                    <option value="GROUND">GROUND</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.bookingDate}
                    onChange={e => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Science Exhibition"
                  value={bookingForm.purpose}
                  onChange={e => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Substitution Modal */}
      {isSubstitutionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Request Faculty Cover</h3>
              <button onClick={() => setIsSubstitutionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubstitution} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Original Absent Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Robert Vance"
                  value={substitutionForm.originalTeacherName}
                  onChange={e => setSubstitutionForm({ ...substitutionForm, originalTeacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Substitute Cover Teacher</label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Emily Watson"
                  value={substitutionForm.substituteTeacherName}
                  onChange={e => setSubstitutionForm({ ...substitutionForm, substituteTeacherName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical leave, Conference attendance"
                  value={substitutionForm.reason}
                  onChange={e => setSubstitutionForm({ ...substitutionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubstitutionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                  Request Cover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Exception Modal */}
      {isExceptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Add Calendar Exception</h3>
              <button onClick={() => setIsExceptionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateException} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Independence Day Holiday"
                  value={exceptionForm.title}
                  onChange={e => setExceptionForm({ ...exceptionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={exceptionForm.startDate}
                    onChange={e => setExceptionForm({ ...exceptionForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={exceptionForm.endDate}
                    onChange={e => setExceptionForm({ ...exceptionForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official gazetted holiday"
                  value={exceptionForm.reason}
                  onChange={e => setExceptionForm({ ...exceptionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl shadow-xs cursor-pointer">
                  Save Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon
const BookingsIcon = Building2;
