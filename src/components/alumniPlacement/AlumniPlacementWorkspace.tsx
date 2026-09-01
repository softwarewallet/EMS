import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  UserPlus,
  Send,
  AlertCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Bookmark
} from 'lucide-react';
import { AlumniPlacementService } from '../../services/alumniPlacementService';
import {
  AlumniProfile,
  CorporatePartner,
  JobPosting,
  PlacementDrive,
  JobApplication,
  PlacementOffer,
  CareerMentorshipSession,
  AlumniEvent,
  AlumniContribution,
  AlumniPlacementAnalytics,
  AlumniEmploymentStatus,
  CorporatePartnerTier,
  JobPostingType,
  JobPostingStatus,
  JobApplicationStatus,
  PlacementOfferStatus
} from '../../types/alumniPlacement';
import { UserActor } from '../../types/inventory';
import { AuditRecord } from '../../types';
import { AuditService } from '../../services/auditService';

interface AlumniPlacementWorkspaceProps {
  tenantId: string;
  campusId?: string;
  currentUser?: UserActor;
}

export const AlumniPlacementWorkspace: React.FC<AlumniPlacementWorkspaceProps> = ({
  tenantId,
  campusId,
  currentUser = {
    id: 'user_admin_01',
    displayName: 'Placement Director / Admin',
    email: 'placement@institution.edu',
    roles: ['tenant_admin', 'academic_coordinator']
  }
}) => {
  const [activeTab, setActiveTab] = useState<
    'command_center' | 'alumni' | 'partners' | 'jobs' | 'drives' | 'applications' | 'mentorship' | 'events' | 'analytics' | 'audit'
  >('command_center');

  // Loading and error state
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data States
  const [analytics, setAnalytics] = useState<AlumniPlacementAnalytics | null>(null);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [partners, setPartners] = useState<CorporatePartner[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [offers, setOffers] = useState<PlacementOffer[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<CareerMentorshipSession[]>([]);
  const [alumniEvents, setAlumniEvents] = useState<AlumniEvent[]>([]);
  const [contributions, setContributions] = useState<AlumniContribution[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Modals and Forms
  const [showAlumniModal, setShowAlumniModal] = useState<boolean>(false);
  const [showPartnerModal, setShowPartnerModal] = useState<boolean>(false);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
  const [showMentorshipModal, setShowMentorshipModal] = useState<boolean>(false);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showContribModal, setShowContribModal] = useState<boolean>(false);

  // Form States
  const [alumniForm, setAlumniForm] = useState({
    studentId: '',
    studentIdNumber: '',
    fullName: '',
    email: '',
    phone: '',
    graduationYear: new Date().getFullYear(),
    degreeCourse: 'B.Tech Computer Science',
    currentCompany: '',
    currentDesignation: '',
    employmentStatus: 'EMPLOYED' as AlumniEmploymentStatus,
    isWillingToMentor: true,
    isWillingToRecruit: false
  });

  const [partnerForm, setPartnerForm] = useState({
    companyName: '',
    industry: 'Information Technology',
    website: '',
    tier: 'TIER_1' as CorporatePartnerTier,
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    status: 'ACTIVE' as const,
    mouStatus: 'ACTIVE' as const
  });

  const [jobForm, setJobForm] = useState({
    companyId: '',
    companyName: '',
    title: '',
    type: 'FULL_TIME' as JobPostingType,
    location: 'Hybrid / On-Site',
    baseCtc: 1200000,
    minCgpa: 7.0,
    allowedDepartments: 'Computer Science, Electronics, Information Technology',
    applicationDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    description: ''
  });

  const [driveForm, setDriveForm] = useState({
    title: 'Annual Campus Placement Drive 2027',
    venueLocation: 'Main Auditorium & Placement Block',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    coordinatorStaffId: currentUser.id,
    coordinatorName: currentUser.displayName,
    notes: 'Comprehensive recruitment drive covering Tier-1 IT & Core Engineering companies.'
  });

  const [offerForm, setOfferForm] = useState({
    applicationId: '',
    jobPostingId: '',
    studentId: '',
    studentName: '',
    companyId: '',
    companyName: '',
    offeredRole: 'Software Development Engineer',
    offeredCtc: 1400000,
    currency: 'INR',
    offerDate: new Date().toISOString().split('T')[0],
    joiningDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
  });

  const [mentorshipForm, setMentorshipForm] = useState({
    title: 'Navigating Tech Interviews & System Design',
    alumniOrMentorId: '',
    mentorName: '',
    mentorDesignation: 'Senior Staff Engineer @ Google',
    topic: 'Technical Interview Preparation & Career Trajectory',
    targetAudience: 'Pre-final and Final Year Students',
    scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 16),
    durationMinutes: 90,
    meetingLinkOrVenue: 'https://meet.google.com/ems-mentorship'
  });

  const [eventForm, setEventForm] = useState({
    title: 'Global Alumni Reunion & Leadership Summit',
    eventType: 'REUNION' as const,
    eventDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    venueOrLink: 'Campus Grand Hall & Live Stream',
    description: 'Annual gathering of alumni across all cohorts to foster networking and student mentorship.'
  });

  const [contribForm, setContribForm] = useState({
    alumniProfileId: '',
    alumniName: '',
    type: 'FINANCIAL_DONATION' as const,
    amount: 50000,
    currency: 'INR',
    description: 'Sponsorship for Student Innovation & Robotics Lab',
    dateRecorded: new Date().toISOString().split('T')[0],
    receiptReference: `REC-${Date.now().toString().slice(-6)}`
  });

  // Filters
  const [alumniSearch, setAlumniSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Initial Load
  useEffect(() => {
    loadWorkspaceData();
  }, [tenantId, campusId]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [
        statsData,
        alumniData,
        partnersData,
        jobsData,
        drivesData,
        appsData,
        offersData,
        mentorsData,
        eventsData,
        contribsData,
        logsData
      ] = await Promise.all([
        AlumniPlacementService.getAlumniPlacementAnalytics(tenantId),
        AlumniPlacementService.getAlumniProfiles(tenantId),
        AlumniPlacementService.getCorporatePartners(tenantId, campusId),
        AlumniPlacementService.getJobPostings(tenantId),
        AlumniPlacementService.getPlacementDrives(tenantId, campusId),
        AlumniPlacementService.getJobApplications(tenantId),
        AlumniPlacementService.getPlacementOffers(tenantId),
        AlumniPlacementService.getMentorshipSessions(tenantId),
        AlumniPlacementService.getAlumniEvents(tenantId),
        AlumniPlacementService.getAlumniContributions(tenantId),
        AuditService.getLogs(tenantId, 50)
      ]);

      setAnalytics(statsData);
      setAlumniList(alumniData);
      setPartners(partnersData);
      setJobPostings(jobsData);
      setPlacementDrives(drivesData);
      setApplications(appsData);
      setOffers(offersData);
      setMentorshipSessions(mentorsData);
      setAlumniEvents(eventsData);
      setContributions(contribsData);
      setAuditLogs(logsData);
    } catch (err: any) {
      console.error('Error loading Phase 7.21 workspace data:', err);
      setErrorMsg(err.message || 'Failed to load Alumni & Placement workspace data');
    } finally {
      setLoading(false);
    }
  };

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Handlers
  const handleCreateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.createAlumniProfile(
        tenantId,
        {
          ...alumniForm,
          campusId
        },
        currentUser
      );
      setAlumniList([created, ...alumniList]);
      setShowAlumniModal(false);
      notifySuccess(`Alumni profile for ${created.fullName} onboarded successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create alumni profile');
    }
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.createCorporatePartner(
        tenantId,
        {
          ...partnerForm,
          campusId
        },
        currentUser
      );
      setPartners([created, ...partners]);
      setShowPartnerModal(false);
      notifySuccess(`Corporate Partner ${created.companyName} registered successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register corporate partner');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedPartner = partners.find(p => p.id === jobForm.companyId);
      const companyName = selectedPartner ? selectedPartner.companyName : jobForm.companyName || 'Corporate Recruiter';

      const created = await AlumniPlacementService.createJobPosting(
        tenantId,
        {
          companyId: jobForm.companyId || 'comp_direct',
          companyName,
          title: jobForm.title,
          type: jobForm.type,
          location: jobForm.location,
          eligibility: {
            minCgpa: Number(jobForm.minCgpa),
            allowedDepartments: jobForm.allowedDepartments.split(',').map(s => s.trim())
          },
          packageDetails: {
            currency: 'INR',
            baseCtc: Number(jobForm.baseCtc)
          },
          applicationDeadline: jobForm.applicationDeadline,
          status: 'PUBLISHED',
          description: jobForm.description || `Recruitment opportunity at ${companyName}`,
          createdById: currentUser.id,
          createdByName: currentUser.displayName,
          campusId
        },
        currentUser
      );

      setJobPostings([created, ...jobPostings]);
      setShowJobModal(false);
      notifySuccess(`Job posting "${created.title}" published successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish job posting');
    }
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.createPlacementDrive(
        tenantId,
        {
          ...driveForm,
          companyIds: partners.map(p => p.id),
          jobPostingIds: jobPostings.map(j => j.id),
          status: 'REGISTRATION_OPEN',
          campusId
        },
        currentUser
      );

      setPlacementDrives([created, ...placementDrives]);
      setShowDriveModal(false);
      notifySuccess(`Placement drive "${created.title}" scheduled successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule placement drive');
    }
  };

  const handleIssueOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.issuePlacementOffer(
        tenantId,
        {
          ...offerForm,
          offeredCtc: Number(offerForm.offeredCtc),
          campusId
        },
        currentUser
      );

      setOffers([created, ...offers]);
      setShowOfferModal(false);
      notifySuccess(`Placement offer issued to ${created.studentName} for ${created.companyName}`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to issue placement offer');
    }
  };

  const handleVerifyOffer = async (offerId: string) => {
    try {
      const verified = await AlumniPlacementService.verifyPlacementOffer(tenantId, offerId, currentUser);
      setOffers(offers.map(o => o.id === offerId ? verified : o));
      notifySuccess(`Placement offer verified for ${verified.studentName}`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify offer');
    }
  };

  const handleCreateMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.createMentorshipSession(
        tenantId,
        {
          ...mentorshipForm,
          durationMinutes: Number(mentorshipForm.durationMinutes),
          status: 'SCHEDULED',
          campusId
        },
        currentUser
      );

      setMentorshipSessions([created, ...mentorshipSessions]);
      setShowMentorshipModal(false);
      notifySuccess(`Mentorship session "${created.title}" scheduled successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule mentorship session');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.createAlumniEvent(
        tenantId,
        {
          ...eventForm,
          status: 'PUBLISHED',
          createdById: currentUser.id,
          createdByName: currentUser.displayName,
          campusId
        },
        currentUser
      );

      setAlumniEvents([created, ...alumniEvents]);
      setShowEventModal(false);
      notifySuccess(`Alumni event "${created.title}" published successfully`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create alumni event');
    }
  };

  const handleRecordContrib = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await AlumniPlacementService.recordAlumniContribution(
        tenantId,
        {
          ...contribForm,
          amount: Number(contribForm.amount),
          campusId
        },
        currentUser
      );

      setContributions([created, ...contributions]);
      setShowContribModal(false);
      notifySuccess(`Contribution of ₹${created.amount} recorded for ${created.alumniName}`);
      loadWorkspaceData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record alumni contribution');
    }
  };

  const handleVerifyContrib = async (id: string) => {
    try {
      const verified = await AlumniPlacementService.verifyAlumniContribution(tenantId, id, currentUser);
      setContributions(contributions.map(c => c.id === id ? verified : c));
      notifySuccess(`Contribution verified for ${verified.alumniName}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify contribution');
    }
  };

  const formatCurrency = (amount: number, curr = 'INR') => {
    if (curr === 'INR') {
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakhs`;
      return `₹${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 space-x-2">
        <Clock className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading Alumni & Placement Engine...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner / Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Alumni, Career Services & Placement Engine</h1>
            <span className="bg-indigo-900/60 text-indigo-300 text-2xs font-semibold px-2 py-0.5 rounded border border-indigo-700/50">
              Phase 7.21
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Corporate partner management, campus placement drives, job board, offer verifications, mentorship sessions, and alumni network governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAlumniModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 text-slate-200 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Alumni</span>
          </button>
          <button
            onClick={() => setShowPartnerModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 text-slate-200 transition"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Add Recruiter</span>
          </button>
          <button
            onClick={() => setShowJobModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg flex items-center space-x-1.5 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Job</span>
          </button>
        </div>
      </div>

      {/* Notifications / Error Banner */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-lg text-xs text-rose-700 dark:text-rose-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto space-x-1 pb-px">
        {[
          { id: 'command_center', label: 'Command Center', icon: Sparkles },
          { id: 'alumni', label: `Alumni Directory (${alumniList.length})`, icon: GraduationCap },
          { id: 'partners', label: `Corporate Partners (${partners.length})`, icon: Building2 },
          { id: 'jobs', label: `Job Board (${jobPostings.length})`, icon: Briefcase },
          { id: 'drives', label: `Placement Drives (${placementDrives.length})`, icon: Calendar },
          { id: 'applications', label: `Applications & Offers (${offers.length})`, icon: FileText },
          { id: 'mentorship', label: `Mentorship (${mentorshipSessions.length})`, icon: Users },
          { id: 'events', label: `Events & Contributions (${alumniEvents.length})`, icon: Award },
          { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
          { id: 'audit', label: 'Governance & Audit', icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {analytics?.placementRatePercentage || 88}%
              </div>
              <span className="text-2xs text-slate-500 mt-0.5 block">Verified Placement Offers</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Average CTC</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(analytics?.averagePackage || 1250000)}
              </div>
              <span className="text-2xs text-slate-500 mt-0.5 block">Highest: {formatCurrency(analytics?.highestPackage || 4500000)}</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Corporate Partners</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {analytics?.totalCorporatePartners || partners.length}
              </div>
              <span className="text-2xs text-slate-500 mt-0.5 block">Active Recruiter Network</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Alumni Network</span>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                {analytics?.totalAlumniCount || alumniList.length}
              </div>
              <span className="text-2xs text-slate-500 mt-0.5 block">{analytics?.employedAlumniCount || 0} Employed Alumni</span>
            </div>
          </div>

          {/* Quick Actions & Live Campus Drives */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>Active & Upcoming Placement Drives</span>
                </h3>
                <button
                  onClick={() => setShowDriveModal(true)}
                  className="text-2xs font-semibold text-indigo-600 hover:underline"
                >
                  + Schedule Drive
                </button>
              </div>

              {placementDrives.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900 p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-xs text-slate-500">No active placement drives scheduled yet.</p>
                  <button
                    onClick={() => setShowDriveModal(true)}
                    className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
                  >
                    Schedule First Drive
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {placementDrives.map(drive => (
                    <div
                      key={drive.id}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{drive.title}</span>
                          <span className="text-2xs px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {drive.driveCode}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500 mt-1 flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{drive.venueLocation}</span>
                          </span>
                          <span>•</span>
                          <span>Coordinator: {drive.coordinatorName}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-2xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          {drive.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Job Postings Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span>Featured Job Postings</span>
                </h3>
                <button onClick={() => setActiveTab('jobs')} className="text-2xs font-semibold text-indigo-600 hover:underline">
                  View All
                </button>
              </div>

              {jobPostings.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-900 p-6 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                  <p className="text-xs text-slate-500">No published job opportunities.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobPostings.slice(0, 4).map(job => (
                    <div key={job.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{job.title}</span>
                        <span className="text-2xs font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(job.packageDetails.baseCtc)}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-500 mt-1">{job.companyName} • {job.location}</p>
                      <div className="mt-2 flex items-center justify-between text-3xs text-slate-400">
                        <span>Min CGPA: {job.eligibility.minCgpa || 'N/A'}</span>
                        <span>Deadline: {job.applicationDeadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALUMNI DIRECTORY */}
      {activeTab === 'alumni' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search alumni by name, ID, company..."
                value={alumniSearch}
                onChange={e => setAlumniSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowAlumniModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-500 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Onboard New Alumni</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-2xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Alumni Name & ID</th>
                    <th className="px-4 py-3">Degree & Year</th>
                    <th className="px-4 py-3">Current Employment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3 text-right">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {alumniList
                    .filter(a => a.fullName.toLowerCase().includes(alumniSearch.toLowerCase()) || a.currentCompany?.toLowerCase().includes(alumniSearch.toLowerCase()))
                    .map(alumni => (
                      <tr key={alumni.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          <div>{alumni.fullName}</div>
                          <span className="text-3xs text-slate-400 font-mono">{alumni.studentIdNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>{alumni.degreeCourse}</div>
                          <span className="text-3xs text-slate-400">Class of {alumni.graduationYear}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>{alumni.currentCompany || 'N/A'}</div>
                          <span className="text-3xs text-slate-400">{alumni.currentDesignation || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {alumni.employmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-1">
                            {alumni.isWillingToMentor && (
                              <span className="px-1.5 py-0.5 rounded text-3xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Mentor
                              </span>
                            )}
                            {alumni.isWillingToRecruit && (
                              <span className="px-1.5 py-0.5 rounded text-3xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                Recruiter
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400 font-mono text-3xs">
                          {alumni.email}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CORPORATE PARTNERS */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Registered Corporate Recruiters</h3>
            <button
              onClick={() => setShowPartnerModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-500 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Add Corporate Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.companyName}</h4>
                    <span className="text-3xs font-mono text-slate-400">{p.companyCode}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-3xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/50">
                    {p.tier}
                  </span>
                </div>

                <div className="text-2xs text-slate-500 space-y-1">
                  <div>Industry: <strong className="text-slate-700 dark:text-slate-300">{p.industry}</strong></div>
                  <div>MoU Status: <span className="font-semibold text-emerald-600">{p.mouStatus}</span></div>
                  <div>Primary Contact: {p.primaryContactName} ({p.primaryContactEmail})</div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-2xs text-slate-400">
                  <span>Total Placements: <strong className="text-slate-900 dark:text-slate-100">{p.totalPlacementsCount}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: JOB BOARD */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Job & Internship Opportunities</h3>
            <button
              onClick={() => setShowJobModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-500 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Job Posting</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobPostings.map(job => (
              <div key={job.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{job.jobCode}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{job.title}</h4>
                    <p className="text-2xs text-slate-500">{job.companyName} • {job.location}</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-extrabold text-xs rounded-md">
                    {formatCurrency(job.packageDetails.baseCtc)}
                  </span>
                </div>

                <p className="text-2xs text-slate-600 dark:text-slate-400 line-clamp-2">{job.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-3xs text-slate-400">
                  <span>Min CGPA: <strong>{job.eligibility.minCgpa || 'N/A'}</strong></span>
                  <span>Deadline: <strong>{job.applicationDeadline}</strong></span>
                  <span className="font-bold text-indigo-600">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: APPLICATIONS & OFFERS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Placement Offers & Verifications</h3>
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-500 transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Issue Placement Offer</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-2xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Company & Role</th>
                  <th className="px-4 py-3">Offered CTC</th>
                  <th className="px-4 py-3">Joining Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {offers.map(offer => (
                  <tr key={offer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {offer.studentName}
                    </td>
                    <td className="px-4 py-3">
                      <div>{offer.companyName}</div>
                      <span className="text-3xs text-slate-400">{offer.offeredRole}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(offer.offeredCtc, offer.currency)}
                    </td>
                    <td className="px-4 py-3 font-mono text-3xs">
                      {offer.joiningDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-3xs font-bold ${
                        offer.status === 'VERIFIED_BY_INSTITUTION'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {offer.status !== 'VERIFIED_BY_INSTITUTION' ? (
                        <button
                          onClick={() => handleVerifyOffer(offer.id)}
                          className="px-2.5 py-1 bg-indigo-600 text-white rounded text-3xs font-semibold hover:bg-indigo-500 transition"
                        >
                          Verify Offer
                        </button>
                      ) : (
                        <span className="text-3xs text-slate-400 font-semibold flex items-center justify-end space-x-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: MENTORSHIP */}
      {activeTab === 'mentorship' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Career Mentorship & Counseling Sessions</h3>
            <button
              onClick={() => setShowMentorshipModal(true)}
              className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-500 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentorshipSessions.map(session => (
              <div key={session.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{session.title}</h4>
                  <span className="text-3xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {session.status}
                  </span>
                </div>
                <p className="text-2xs text-slate-500">Mentor: <strong className="text-slate-800 dark:text-slate-200">{session.mentorName}</strong> ({session.mentorDesignation})</p>
                <div className="text-3xs text-slate-400 space-y-1">
                  <div>Topic: {session.topic}</div>
                  <div>Audience: {session.targetAudience}</div>
                  <div>Scheduled: {new Date(session.scheduledAt).toLocaleString()} ({session.durationMinutes} mins)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: EVENTS & CONTRIBUTIONS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Alumni Reunions & Events</h3>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
              >
                + New Event
              </button>
            </div>

            <div className="space-y-3">
              {alumniEvents.map(event => (
                <div key={event.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{event.title}</span>
                    <span className="text-3xs font-mono text-indigo-600">{event.eventCode}</span>
                  </div>
                  <p className="text-2xs text-slate-500">{event.description}</p>
                  <div className="flex justify-between items-center text-3xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Date: {event.eventDate}</span>
                    <span>RSVPs: {event.rsvpCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Alumni Contributions & Sponsorships</h3>
              <button
                onClick={() => setShowContribModal(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition"
              >
                + Record Contribution
              </button>
            </div>

            <div className="space-y-3">
              {contributions.map(contrib => (
                <div key={contrib.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{contrib.alumniName}</span>
                    <span className="text-xs font-extrabold text-emerald-600">{formatCurrency(contrib.amount || 0, contrib.currency)}</span>
                  </div>
                  <p className="text-2xs text-slate-500">{contrib.description}</p>
                  <div className="flex justify-between items-center text-3xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Receipt: {contrib.receiptReference}</span>
                    <button
                      onClick={() => handleVerifyContrib(contrib.id)}
                      className={`px-2 py-0.5 rounded text-3xs font-bold ${
                        contrib.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {contrib.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: GOVERNANCE & AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audit Trail & Compliance Logs</h3>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-2xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Resource</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-3xs">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-4 py-2.5 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-900 dark:text-slate-100">{log.userDisplayName}</td>
                    <td className="px-4 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">{log.action}</td>
                    <td className="px-4 py-2.5 text-slate-500">{log.resource}:{log.resourceId}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ONBOARD ALUMNI */}
      {showAlumniModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Onboard Alumni Profile</h3>
              <button onClick={() => setShowAlumniModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateAlumni} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Student Roll Number / ID</label>
                <input
                  type="text"
                  required
                  value={alumniForm.studentIdNumber}
                  onChange={e => setAlumniForm({ ...alumniForm, studentIdNumber: e.target.value })}
                  placeholder="e.g. STU-2023-1002"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={alumniForm.fullName}
                  onChange={e => setAlumniForm({ ...alumniForm, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={alumniForm.email}
                    onChange={e => setAlumniForm({ ...alumniForm, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Graduation Year</label>
                  <input
                    type="number"
                    required
                    value={alumniForm.graduationYear}
                    onChange={e => setAlumniForm({ ...alumniForm, graduationYear: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Current Company</label>
                  <input
                    type="text"
                    value={alumniForm.currentCompany}
                    onChange={e => setAlumniForm({ ...alumniForm, currentCompany: e.target.value })}
                    placeholder="e.g. Microsoft"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Current Designation</label>
                  <input
                    type="text"
                    value={alumniForm.currentDesignation}
                    onChange={e => setAlumniForm({ ...alumniForm, currentDesignation: e.target.value })}
                    placeholder="e.g. Software Engineer"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-2xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alumniForm.isWillingToMentor}
                    onChange={e => setAlumniForm({ ...alumniForm, isWillingToMentor: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Willing to Mentor</span>
                </label>
                <label className="flex items-center space-x-2 text-2xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alumniForm.isWillingToRecruit}
                    onChange={e => setAlumniForm({ ...alumniForm, isWillingToRecruit: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <span>Willing to Recruit</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAlumniModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Save Alumni Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CORPORATE PARTNER */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Register Corporate Recruiter</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={partnerForm.companyName}
                  onChange={e => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                  placeholder="e.g. Google India Pvt Ltd"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Industry Sector</label>
                  <input
                    type="text"
                    required
                    value={partnerForm.industry}
                    onChange={e => setPartnerForm({ ...partnerForm, industry: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Tier Category</label>
                  <select
                    value={partnerForm.tier}
                    onChange={e => setPartnerForm({ ...partnerForm, tier: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="TIER_1">Tier 1 (Core Tech / MNC)</option>
                    <option value="TIER_2">Tier 2 (Mid-scale Tech)</option>
                    <option value="TIER_3">Tier 3 (Regional)</option>
                    <option value="PRIME">Prime Executive Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={partnerForm.primaryContactName}
                    onChange={e => setPartnerForm({ ...partnerForm, primaryContactName: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={partnerForm.primaryContactEmail}
                    onChange={e => setPartnerForm({ ...partnerForm, primaryContactEmail: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLISH JOB POSTING */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Publish Job or Internship Opportunity</h3>
              <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Select Corporate Partner</label>
                <select
                  value={jobForm.companyId}
                  onChange={e => setJobForm({ ...jobForm, companyId: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="">-- Direct Recruitment / Unlisted --</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>{p.companyName} ({p.tier})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Graduate Trainee Engineer"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Opportunity Type</label>
                  <select
                    value={jobForm.type}
                    onChange={e => setJobForm({ ...jobForm, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FULL_TIME_PLUS_INTERNSHIP">Internship + Full Time Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Base Package CTC (Annual ₹)</label>
                  <input
                    type="number"
                    required
                    value={jobForm.baseCtc}
                    onChange={e => setJobForm({ ...jobForm, baseCtc: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Min Eligibility CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={jobForm.minCgpa}
                    onChange={e => setJobForm({ ...jobForm, minCgpa: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={jobForm.applicationDeadline}
                    onChange={e => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Publish Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PLACEMENT OFFER */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Issue Placement Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleIssueOffer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={offerForm.studentName}
                  onChange={e => setOfferForm({ ...offerForm, studentName: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Corporate Partner Name</label>
                <input
                  type="text"
                  required
                  value={offerForm.companyName}
                  onChange={e => setOfferForm({ ...offerForm, companyName: e.target.value })}
                  placeholder="e.g. Amazon Development Centre"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Offered Role</label>
                  <input
                    type="text"
                    required
                    value={offerForm.offeredRole}
                    onChange={e => setOfferForm({ ...offerForm, offeredRole: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Offered CTC (Annual ₹)</label>
                  <input
                    type="number"
                    required
                    value={offerForm.offeredCtc}
                    onChange={e => setOfferForm({ ...offerForm, offeredCtc: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Offer Date</label>
                  <input
                    type="date"
                    required
                    value={offerForm.offerDate}
                    onChange={e => setOfferForm({ ...offerForm, offerDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    value={offerForm.joiningDate}
                    onChange={e => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Issue Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PLACEMENT DRIVE */}
      {showDriveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Schedule Campus Placement Drive</h3>
              <button onClick={() => setShowDriveModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Drive Title</label>
                <input
                  type="text"
                  required
                  value={driveForm.title}
                  onChange={e => setDriveForm({ ...driveForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Venue Location</label>
                <input
                  type="text"
                  required
                  value={driveForm.venueLocation}
                  onChange={e => setDriveForm({ ...driveForm, venueLocation: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={driveForm.startDate}
                    onChange={e => setDriveForm({ ...driveForm, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={driveForm.endDate}
                    onChange={e => setDriveForm({ ...driveForm, endDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: MENTORSHIP SESSION */}
      {showMentorshipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Schedule Career Mentorship Session</h3>
              <button onClick={() => setShowMentorshipModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateMentorship} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={mentorshipForm.title}
                  onChange={e => setMentorshipForm({ ...mentorshipForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Mentor Name & Title</label>
                <input
                  type="text"
                  required
                  value={mentorshipForm.mentorName}
                  onChange={e => setMentorshipForm({ ...mentorshipForm, mentorName: e.target.value })}
                  placeholder="e.g. Vikram Seth, Director @ TechCorp"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMentorshipModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create Alumni Event</h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: CONTRIBUTION */}
      {showContribModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Record Alumni Contribution / Donation</h3>
              <button onClick={() => setShowContribModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRecordContrib} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Alumni Name</label>
                <input
                  type="text"
                  required
                  value={contribForm.alumniName}
                  onChange={e => setContribForm({ ...contribForm, alumniName: e.target.value })}
                  placeholder="e.g. Priya Nair"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={contribForm.amount}
                  onChange={e => setContribForm({ ...contribForm, amount: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Purpose / Description</label>
                <input
                  type="text"
                  required
                  value={contribForm.description}
                  onChange={e => setContribForm({ ...contribForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowContribModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-500"
                >
                  Record Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
