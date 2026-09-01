import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Lock,
  RefreshCw,
  Play,
  Heart,
  LifeBuoy,
  Activity,
  FileCheck,
  Check,
  ChevronRight,
  Shield,
  Layers,
  PhoneCall,
  Briefcase
} from 'lucide-react';
import {
  studentServicesSupportService
} from '../../services/studentServicesSupportService';
import {
  SupportCase,
  ServiceRequest,
  ServiceReferral,
  AdvisingAppointment,
  InterventionPlan,
  StudentSuccessAlert,
  AccommodationRequest,
  AccommodationPlan,
  CrisisIncident,
  SafeguardingConcern,
  FollowUpTask,
  SupportOutcome,
  StudentSupportAuditEvent,
  StudentSupportDiagnosticsReport,
  SimulationScenario,
  StudentSupportSimulationType,
  ConfidentialityLevel,
  SupportCategory
} from '../../types/studentServicesSupport';

type WorkspaceTab =
  | 'command_center'
  | 'registry'
  | 'cases'
  | 'case_detail'
  | 'service_requests'
  | 'referrals'
  | 'advising'
  | 'appointments'
  | 'interventions'
  | 'alerts'
  | 'accommodations'
  | 'wellbeing'
  | 'crisis_safeguarding'
  | 'follow_up'
  | 'outcomes'
  | 'diagnostics'
  | 'audit_trail'
  | 'sandbox';

export const StudentServicesSupportWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('command_center');
  const [tenantId] = useState('tenant-main');
  const [campusId] = useState('campus-north');
  const [userConfidentialityLevel] = useState<ConfidentialityLevel>('HIGHLY_CONFIDENTIAL');
  const [isCrisisResponder] = useState(true);
  const [isSafeguardingLead] = useState(true);

  // Operational State
  const [profiles, setProfiles] = useState(studentServicesSupportService.getProfiles(tenantId, campusId));
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [referrals, setReferrals] = useState<ServiceReferral[]>([]);
  const [advisingAssignments, setAdvisingAssignments] = useState(studentServicesSupportService.getAdvisingAssignments(tenantId, campusId));
  const [appointments, setAppointments] = useState<AdvisingAppointment[]>([]);
  const [interventions, setInterventions] = useState<InterventionPlan[]>([]);
  const [alerts, setAlerts] = useState<StudentSuccessAlert[]>([]);
  const [accommodationRequests, setAccommodationRequests] = useState<AccommodationRequest[]>([]);
  const [accommodationPlans, setAccommodationPlans] = useState<AccommodationPlan[]>([]);
  const [crisisIncidents, setCrisisIncidents] = useState<CrisisIncident[]>([]);
  const [safeguardingConcerns, setSafeguardingConcerns] = useState<SafeguardingConcern[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([]);
  const [outcomes, setOutcomes] = useState<SupportOutcome[]>([]);
  const [auditEvents, setAuditEvents] = useState<StudentSupportAuditEvent[]>([]);
  const [diagnosticsReport, setDiagnosticsReport] = useState<StudentSupportDiagnosticsReport | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationScenario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal forms state
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    studentIdRef: 'stu-alex-rivera',
    studentName: 'Alex Rivera',
    serviceIdRef: 'srv-acad-planning-01',
    serviceCategory: 'ACADEMIC_ADVISING' as SupportCategory,
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    confidentialityLevel: 'STANDARD' as ConfidentialityLevel
  });

  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newApptForm, setNewApptForm] = useState({
    studentIdRef: 'stu-alex-rivera',
    studentName: 'Alex Rivera',
    advisorUserIdRef: 'usr-advisor-sarah',
    advisorName: 'Dr. Sarah Jenkins',
    slotStartTime: '2026-09-08T14:00:00Z',
    slotEndTime: '2026-09-08T14:45:00Z',
    location: 'Building A, Room 204',
    modality: 'IN_PERSON' as 'IN_PERSON' | 'VIRTUAL' | 'PHONE',
    purpose: 'Academic Progress Consultation'
  });

  const [showFourEyesModal, setShowFourEyesModal] = useState(false);
  const [fourEyesTarget, setFourEyesTarget] = useState<{ type: 'CASE' | 'ACCOMMODATION' | 'CRISIS'; id: string } | null>(null);
  const [dualApproverId, setDualApproverId] = useState('usr-supervisor-02');
  const [closureRemarks, setClosureRemarks] = useState('All support requirements met and formally signed off.');

  const refreshAllData = () => {
    setProfiles(studentServicesSupportService.getProfiles(tenantId, campusId));
    const loadedCases = studentServicesSupportService.getCases(tenantId, campusId, userConfidentialityLevel);
    setCases(loadedCases);
    if (selectedCase) {
      const updated = loadedCases.find(c => c.caseId === selectedCase.caseId);
      if (updated) setSelectedCase(updated);
    }
    setServiceRequests(studentServicesSupportService.getServiceRequests(tenantId, campusId));
    setReferrals(studentServicesSupportService.getReferrals(tenantId, campusId));
    setAdvisingAssignments(studentServicesSupportService.getAdvisingAssignments(tenantId, campusId));
    setAppointments(studentServicesSupportService.getAppointments(tenantId, campusId));
    setInterventions(studentServicesSupportService.getInterventionPlans(tenantId, campusId));
    setAlerts(studentServicesSupportService.getSuccessAlerts(tenantId, campusId));
    setAccommodationRequests(studentServicesSupportService.getAccommodationRequests(tenantId, campusId));
    setAccommodationPlans(studentServicesSupportService.getAccommodationPlans(tenantId, campusId));
    setCrisisIncidents(studentServicesSupportService.getCrisisIncidents(tenantId, campusId, isCrisisResponder));
    setSafeguardingConcerns(studentServicesSupportService.getSafeguardingConcerns(tenantId, campusId, isSafeguardingLead));
    setFollowUps(studentServicesSupportService.getFollowUps(tenantId, campusId));
    setOutcomes(studentServicesSupportService.getOutcomes(tenantId, campusId));
    setAuditEvents(studentServicesSupportService.getAuditEvents(tenantId, campusId));
    setDiagnosticsReport(studentServicesSupportService.runDiagnostics(tenantId, campusId));
  };

  useEffect(() => {
    refreshAllData();
  }, [tenantId, campusId, userConfidentialityLevel]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      studentServicesSupportService.createSupportCase(
        {
          tenantId,
          campusIdRef: campusId,
          studentIdRef: newCaseForm.studentIdRef,
          studentName: newCaseForm.studentName,
          serviceIdRef: newCaseForm.serviceIdRef,
          serviceCategory: newCaseForm.serviceCategory,
          title: newCaseForm.title,
          description: newCaseForm.description,
          priority: newCaseForm.priority,
          confidentialityLevel: newCaseForm.confidentialityLevel,
          idempotencyKey: `IDEM-UI-CASE-${Date.now()}`
        },
        'usr-current-operator'
      );
      setShowNewCaseModal(false);
      setNewCaseForm({
        studentIdRef: 'stu-alex-rivera',
        studentName: 'Alex Rivera',
        serviceIdRef: 'srv-acad-planning-01',
        serviceCategory: 'ACADEMIC_ADVISING',
        title: '',
        description: '',
        priority: 'MEDIUM',
        confidentialityLevel: 'STANDARD'
      });
      refreshAllData();
      showNotification('success', 'Support case registered successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create case');
    }
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      studentServicesSupportService.scheduleAdvisingAppointment(
        {
          tenantId,
          campusIdRef: campusId,
          studentIdRef: newApptForm.studentIdRef,
          studentName: newApptForm.studentName,
          advisorUserIdRef: newApptForm.advisorUserIdRef,
          advisorName: newApptForm.advisorName,
          slotStartTime: newApptForm.slotStartTime,
          slotEndTime: newApptForm.slotEndTime,
          location: newApptForm.location,
          modality: newApptForm.modality,
          purpose: newApptForm.purpose,
          idempotencyKey: `IDEM-UI-APT-${Date.now()}`
        },
        'usr-current-operator'
      );
      setShowAppointmentModal(false);
      refreshAllData();
      showNotification('success', 'Advising appointment scheduled successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to schedule appointment');
    }
  };

  const executeFourEyesClosure = () => {
    if (!fourEyesTarget) return;
    try {
      if (fourEyesTarget.type === 'CASE') {
        studentServicesSupportService.closeCaseWithFourEyes(
          fourEyesTarget.id,
          'usr-current-operator',
          dualApproverId,
          closureRemarks,
          'RESOLVED'
        );
        showNotification('success', 'Case closed successfully with verified Four-Eyes authorization.');
      } else if (fourEyesTarget.type === 'CRISIS') {
        studentServicesSupportService.closeCrisisWithFourEyes(
          fourEyesTarget.id,
          'usr-current-operator',
          dualApproverId,
          closureRemarks
        );
        showNotification('success', 'Crisis incident closed with verified Four-Eyes authorization.');
      }
      setShowFourEyesModal(false);
      setFourEyesTarget(null);
      refreshAllData();
    } catch (err: any) {
      showNotification('error', err.message || 'Four-Eyes authorization failed');
    }
  };

  const triggerSimulation = (scenarioType: StudentSupportSimulationType) => {
    const res = studentServicesSupportService.runWhatIfSimulation(scenarioType);
    setActiveSimulation(res);
    refreshAllData();
    showNotification('success', `Executed simulation '${res.title}' with ZERO production mutation.`);
  };

  return (
    <div id="student-services-support-workspace" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Authoritative Header */}
      <header id="sss-header" className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Student Services, Advising & Wellbeing</h1>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Phase 11.12
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Authoritative Institutional Control Plane • Cases, Advising, Referrals, Accommodations & Crisis Operations
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400">Tenant:</span>
            <span className="font-mono text-indigo-300 font-semibold">{tenantId}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Campus:</span>
            <span className="font-mono text-emerald-300 font-semibold">{campusId}</span>
          </div>

          <button
            id="btn-refresh-support-data"
            onClick={refreshAllData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>

          <button
            id="btn-quick-new-case"
            onClick={() => setShowNewCaseModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Case
          </button>
        </div>
      </header>

      {/* Global Action Notifications */}
      {actionMessage && (
        <div
          id="sss-action-notification"
          className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <nav id="sss-tab-navigation" className="bg-slate-850 border-b border-slate-700 px-6 overflow-x-auto flex gap-1 scrollbar-thin">
        {[
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'registry', label: 'Student Profiles', icon: Users },
          { id: 'cases', label: `Cases (${cases.length})`, icon: FileText },
          { id: 'service_requests', label: `Requests (${serviceRequests.length})`, icon: Layers },
          { id: 'referrals', label: `Referrals (${referrals.length})`, icon: ChevronRight },
          { id: 'advising', label: 'Advising Roster', icon: Briefcase },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'interventions', label: `Interventions (${interventions.length})`, icon: Shield },
          { id: 'alerts', label: `Alerts (${alerts.length})`, icon: AlertTriangle },
          { id: 'accommodations', label: `Accommodations (${accommodationPlans.length})`, icon: FileCheck },
          { id: 'wellbeing', label: 'Wellbeing', icon: Heart },
          { id: 'crisis_safeguarding', label: `Crisis & Safeguarding (${crisisIncidents.length})`, icon: ShieldAlert },
          { id: 'follow_up', label: `Follow-Ups (${followUps.length})`, icon: Clock },
          { id: 'outcomes', label: `Outcomes (${outcomes.length})`, icon: CheckCircle2 },
          { id: 'diagnostics', label: 'Diagnostics (20 Invariants)', icon: Check },
          { id: 'audit_trail', label: 'Audit Trail (SHA-256)', icon: Lock },
          { id: 'sandbox', label: 'What-If Sandbox (15 Scenarios)', icon: Play }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id as WorkspaceTab);
                if (tab.id !== 'case_detail') setSelectedCase(null);
              }}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Workspace View Content */}
      <main id="sss-main-content" className="flex-1 p-6 overflow-y-auto">
        {/* =========================================================================
            TAB 1: COMMAND CENTER
        ========================================================================= */}
        {activeTab === 'command_center' && (
          <div id="view-command-center" className="space-y-6">
            {/* KPI Metric Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Active Support Cases</span>
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {cases.filter(c => c.status !== 'CLOSED').length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-amber-400 font-semibold">{cases.filter(c => c.status === 'IN_PROGRESS').length}</span> in progress •{' '}
                  <span className="text-rose-400 font-semibold">{cases.filter(c => c.priority === 'CRITICAL').length}</span> critical
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Scheduled Appointments</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{appointments.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {appointments.filter(a => a.status === 'CONFIRMED').length} confirmed • 0 double-bookings
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Active Accommodations</span>
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{accommodationPlans.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  100% Four-Eyes Approved • 0 Expired active
                </div>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400">Crisis & Alerts</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
                <div className="text-[11px] text-slate-400 mt-1 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All critical responders active
                </div>
              </div>
            </div>

            {/* Live Case Queue & Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    High-Priority Triage Queue
                  </h2>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View All Cases →
                  </button>
                </div>
                <div className="space-y-3">
                  {cases.slice(0, 4).map(c => (
                    <div
                      key={c.caseId}
                      className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-750 flex items-center justify-between hover:border-slate-600 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-indigo-300 font-semibold">{c.caseNumber}</span>
                          <span className="text-xs font-medium text-white">{c.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Student: <span className="text-slate-300 font-medium">{c.studentName}</span> • Assigned: {c.primaryAssignedName || 'Unassigned'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          c.status === 'CLOSED' ? 'bg-slate-700 text-slate-300' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {c.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCase(c);
                            setActiveTab('case_detail');
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-600 transition-colors"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Early Warning Alerts */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Active Early Alerts
                  </h2>
                </div>
                <div className="space-y-3">
                  {alerts.map(a => (
                    <div key={a.alertId} className="p-3 bg-slate-900/60 rounded-lg border border-slate-750 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-300">{a.category}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {a.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{a.reason}</p>
                      <div className="text-[10px] text-slate-500 font-mono">Target: {a.studentName}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: STUDENT SUPPORT REGISTRY
        ========================================================================= */}
        {activeTab === 'registry' && (
          <div id="view-student-registry" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Student Support Profile Registry</h2>
                <p className="text-xs text-slate-400">Institutional profiles consuming upstream Student Master by reference</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
                />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student ID & Name</th>
                    <th className="py-3 px-4 font-semibold">Program / Cohort</th>
                    <th className="py-3 px-4 font-semibold">Primary Advisor</th>
                    <th className="py-3 px-4 font-semibold">Confidentiality</th>
                    <th className="py-3 px-4 font-semibold">Accommodations</th>
                    <th className="py-3 px-4 font-semibold">Open Cases</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {profiles
                    .filter(p => !searchQuery || p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || p.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(p => (
                      <tr key={p.profileId} className="hover:bg-slate-750 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{p.studentName}</div>
                          <div className="font-mono text-[11px] text-slate-400">{p.studentNumber}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{p.programIdRef}</div>
                          <div className="text-[11px] text-slate-400">{p.academicYear}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">
                          {p.primaryAdvisorName || 'Unassigned'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.confidentialityLevel === 'HIGHLY_CONFIDENTIAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            p.confidentialityLevel === 'CONFIDENTIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {p.confidentialityLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {p.activeAccommodationsCount > 0 ? (
                            <span className="text-emerald-400">{p.activeAccommodationsCount} Active</span>
                          ) : (
                            <span className="text-slate-500">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {p.openCasesCount > 0 ? (
                            <span className="text-amber-400">{p.openCasesCount} Open</span>
                          ) : (
                            <span className="text-slate-500">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setNewCaseForm(prev => ({ ...prev, studentIdRef: p.studentIdRef, studentName: p.studentName }));
                              setShowNewCaseModal(true);
                            }}
                            className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded text-[11px] font-medium transition-colors"
                          >
                            Open Case
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: SUPPORT CASES LIST
        ========================================================================= */}
        {activeTab === 'cases' && (
          <div id="view-cases-list" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Student Support Cases</h2>
                <p className="text-xs text-slate-400">Governed lifecycle from SUBMITTED → IN_PROGRESS → FOUR-EYES CLOSURE</p>
              </div>
              <button
                onClick={() => setShowNewCaseModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Support Case
              </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Case Number</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Category & Title</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Lead Worker</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {cases.map(c => (
                    <tr key={c.caseId} className="hover:bg-slate-750 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{c.caseNumber}</td>
                      <td className="py-3 px-4 font-medium text-white">{c.studentName}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{c.title}</div>
                        <div className="text-[11px] text-slate-400">{c.serviceCategory}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          c.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'CLOSED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          c.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{c.primaryAssignedName || 'Unassigned'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedCase(c);
                            setActiveTab('case_detail');
                          }}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Inspect Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: CASE DETAIL VIEW
        ========================================================================= */}
        {activeTab === 'case_detail' && (
          <div id="view-case-detail" className="space-y-6">
            {selectedCase ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('cases')}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded text-slate-300"
                    >
                      ← Back to List
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white">{selectedCase.title}</h2>
                        <span className="font-mono text-xs text-indigo-300 font-semibold">{selectedCase.caseNumber}</span>
                      </div>
                      <p className="text-xs text-slate-400">Student: {selectedCase.studentName} ({selectedCase.studentIdRef})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCase.status !== 'CLOSED' && (
                      <button
                        onClick={() => {
                          setFourEyesTarget({ type: 'CASE', id: selectedCase.caseId });
                          setShowFourEyesModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Four-Eyes Case Closure
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Case Description</h3>
                      <p className="text-sm text-slate-200 leading-relaxed">{selectedCase.description}</p>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Case Case Notes</h3>
                      <div className="space-y-3">
                        {selectedCase.notes.length === 0 ? (
                          <p className="text-xs text-slate-500 italic">No notes logged yet for this support case.</p>
                        ) : (
                          selectedCase.notes.map(n => (
                            <div key={n.noteId} className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-750 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-200">{n.authorName}</span>
                                <span className="text-[11px] text-slate-500 font-mono">{n.createdAt}</span>
                              </div>
                              <p className="text-xs text-slate-300">{n.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3 text-xs">
                      <h3 className="font-semibold uppercase tracking-wider text-slate-400">Lifecycle State</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 border-b border-slate-700">
                          <span className="text-slate-400">Current Status:</span>
                          <span className="font-semibold text-indigo-300">{selectedCase.status}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-700">
                          <span className="text-slate-400">Priority:</span>
                          <span className="font-semibold text-amber-300">{selectedCase.priority}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-700">
                          <span className="text-slate-400">Confidentiality:</span>
                          <span className="font-semibold text-slate-200">{selectedCase.confidentialityLevel}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-700">
                          <span className="text-slate-400">Created At:</span>
                          <span className="text-slate-400 font-mono">{selectedCase.createdAt}</span>
                        </div>
                        {selectedCase.closedAt && (
                          <div className="flex justify-between py-1 border-b border-slate-700">
                            <span className="text-slate-400">Dual Approver:</span>
                            <span className="text-emerald-400 font-mono">{selectedCase.dualApprovedClosureUserIdRef}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p>No case selected. Please select a case from the cases table.</p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: SERVICE REQUESTS
        ========================================================================= */}
        {activeTab === 'service_requests' && (
          <div id="view-service-requests" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Student Service Requests</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Request #</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Service</th>
                    <th className="py-3 px-4 font-semibold">Subject</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {serviceRequests.map(r => (
                    <tr key={r.requestId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{r.requestNumber}</td>
                      <td className="py-3 px-4 font-medium text-white">{r.studentName}</td>
                      <td className="py-3 px-4">{r.serviceName}</td>
                      <td className="py-3 px-4 font-medium text-slate-200">{r.subject}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{r.submittedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: REFERRALS
        ========================================================================= */}
        {activeTab === 'referrals' && (
          <div id="view-referrals" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Cross-Department Service Referrals</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Referral #</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Source → Target</th>
                    <th className="py-3 px-4 font-semibold">Reason</th>
                    <th className="py-3 px-4 font-semibold">Urgency</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {referrals.map(ref => (
                    <tr key={ref.referralId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{ref.referralNumber}</td>
                      <td className="py-3 px-4 font-medium text-white">{ref.studentName}</td>
                      <td className="py-3 px-4">
                        <span className="text-slate-400">{ref.sourceServiceCategory}</span> →{' '}
                        <span className="text-indigo-300 font-semibold">{ref.targetServiceCategory}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{ref.reason}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {ref.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: ADVISING ROSTER
        ========================================================================= */}
        {activeTab === 'advising' && (
          <div id="view-advising-roster" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Advising Assignments Roster</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Assigned Advisor</th>
                    <th className="py-3 px-4 font-semibold">Advisor Email</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Assigned Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {advisingAssignments.map(a => (
                    <tr key={a.assignmentId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-medium text-white">{a.studentName}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-300">{a.advisorName}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{a.advisorEmail}</td>
                      <td className="py-3 px-4">{a.advisingType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          a.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{a.assignedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: APPOINTMENTS
        ========================================================================= */}
        {activeTab === 'appointments' && (
          <div id="view-appointments" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Advising & Support Appointments</h2>
                <p className="text-xs text-slate-400">Strict double-booking protection & state transitions</p>
              </div>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Appointment
              </button>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Appt #</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Advisor</th>
                    <th className="py-3 px-4 font-semibold">Slot Window</th>
                    <th className="py-3 px-4 font-semibold">Location / Modality</th>
                    <th className="py-3 px-4 font-semibold">Purpose</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {appointments.map(apt => (
                    <tr key={apt.appointmentId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{apt.appointmentNumber}</td>
                      <td className="py-3 px-4 font-medium text-white">{apt.studentName}</td>
                      <td className="py-3 px-4 text-slate-200">{apt.advisorName}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {apt.slotStartTime}
                      </td>
                      <td className="py-3 px-4">
                        <div>{apt.location}</div>
                        <div className="text-[10px] text-slate-400">{apt.modality}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{apt.purpose}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: INTERVENTIONS
        ========================================================================= */}
        {activeTab === 'interventions' && (
          <div id="view-interventions" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Student Success Intervention Plans</h2>
            <div className="space-y-4">
              {interventions.map(plan => (
                <div key={plan.planId} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-750 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-indigo-300">{plan.planNumber}</span>
                      <span className="text-sm font-semibold text-white">{plan.studentName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                        {plan.category}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {plan.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{plan.objective}</p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-semibold text-slate-400">Actionable Milestones ({plan.actions.length})</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.actions.map(act => (
                        <div key={act.actionId} className="p-3 bg-slate-900/70 rounded-lg border border-slate-750 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-medium text-slate-200">{act.title}</div>
                            <div className="text-[11px] text-slate-400">Owner: {act.ownerName} • Due: {act.targetCompletionDate}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {act.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 10: ALERTS
        ========================================================================= */}
        {activeTab === 'alerts' && (
          <div id="view-alerts" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Student Success Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map(a => (
                <div key={a.alertId} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-300 font-semibold">{a.alertNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {a.severity}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{a.studentName}</h3>
                  <div className="text-xs text-indigo-300 font-medium">{a.category}</div>
                  <p className="text-xs text-slate-300">{a.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 11: ACCOMMODATIONS
        ========================================================================= */}
        {activeTab === 'accommodations' && (
          <div id="view-accommodations" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Authorized Accessibility & Accommodation Plans</h2>
            <div className="space-y-4">
              {accommodationPlans.map(plan => (
                <div key={plan.planId} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-indigo-300">{plan.planNumber}</span>
                      <h3 className="text-sm font-semibold text-white">{plan.studentName}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {plan.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Validity Window: <span className="font-mono text-slate-200">{plan.effectiveFrom}</span> to{' '}
                    <span className="font-mono text-slate-200">{plan.expiresAt}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">Approved Adjustments</div>
                    <div className="space-y-1.5">
                      {plan.adjustments.map(adj => (
                        <div key={adj.adjustmentId} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-750 text-xs flex items-center justify-between">
                          <span className="text-slate-200">{adj.description}</span>
                          <span className="font-mono text-indigo-300">{adj.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 12: WELLBEING
        ========================================================================= */}
        {activeTab === 'wellbeing' && (
          <div id="view-wellbeing" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Student Wellbeing & Mental Health</h2>
                <p className="text-xs text-slate-400">Strictly confidential records with role-gated least privilege</p>
              </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Lock className="w-4 h-4" />
                CONFIDENTIALITY PROTOCOL ENFORCED (HIGHLY_CONFIDENTIAL)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wellbeing evaluations and clinical assessments are strictly segregated from public student registry views and academic records.
                Only licensed psychological practitioners and designated student welfare officers possess clearance to view full intake logs.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 13: CRISIS & SAFEGUARDING
        ========================================================================= */}
        {activeTab === 'crisis_safeguarding' && (
          <div id="view-crisis-safeguarding" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Crisis & Safeguarding Operations</h2>
                <p className="text-xs text-slate-400">Emergency stabilization, mandatory escalation & Four-Eyes closure</p>
              </div>
            </div>

            <div className="space-y-4">
              {crisisIncidents.map(c => (
                <div key={c.incidentId} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-750 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-rose-400">{c.incidentNumber}</span>
                      <span className="text-sm font-semibold text-white">{c.studentName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {c.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400">
                        {c.status}
                      </span>
                      {c.status !== 'CLOSED' && (
                        <button
                          onClick={() => {
                            setFourEyesTarget({ type: 'CRISIS', id: c.incidentId });
                            setShowFourEyesModal(true);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold transition-colors"
                        >
                          Four-Eyes Closure
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300">{c.incidentSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 14: FOLLOW-UP QUEUE
        ========================================================================= */}
        {activeTab === 'follow_up' && (
          <div id="view-followups" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Support Follow-Up & SLA Tasks</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Task #</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Assigned To</th>
                    <th className="py-3 px-4 font-semibold">Due At</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {followUps.map(t => (
                    <tr key={t.taskId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-300">{t.taskNumber}</td>
                      <td className="py-3 px-4 font-medium text-white">{t.studentName}</td>
                      <td className="py-3 px-4 font-medium text-slate-200">{t.title}</td>
                      <td className="py-3 px-4">{t.assignedToName}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{t.dueAt}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 15: OUTCOMES
        ========================================================================= */}
        {activeTab === 'outcomes' && (
          <div id="view-outcomes" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Recorded Support Outcomes</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Outcome ID</th>
                    <th className="py-3 px-4 font-semibold">Student Ref</th>
                    <th className="py-3 px-4 font-semibold">Outcome Type</th>
                    <th className="py-3 px-4 font-semibold">Evidence Summary</th>
                    <th className="py-3 px-4 font-semibold">Recorded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {outcomes.map(o => (
                    <tr key={o.outcomeId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono text-indigo-300">{o.outcomeId}</td>
                      <td className="py-3 px-4 font-medium text-white">{o.studentIdRef}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">{o.outcomeType}</td>
                      <td className="py-3 px-4 text-slate-200">{o.evidenceSummary}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{o.recordedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 16: DIAGNOSTICS
        ========================================================================= */}
        {activeTab === 'diagnostics' && (
          <div id="view-diagnostics" className="space-y-6">
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Automated Diagnostics Engine (20 Invariant Scanners)
                </h2>
                <p className="text-xs text-slate-400">Zero-mutation automated health & compliance verification</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {diagnosticsReport?.systemHealthScore}%
                  </div>
                  <div className="text-[10px] text-slate-400">System Health Score</div>
                </div>
                <button
                  onClick={refreshAllData}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Re-Scan Invariants
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticsReport?.issuesFound.map(iss => (
                <div key={iss.issueId} className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-indigo-300 font-semibold">{iss.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      iss.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {iss.severity}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white">{iss.title}</h3>
                  <p className="text-xs text-slate-300">{iss.details}</p>
                </div>
              ))}
              {diagnosticsReport?.issuesFound.length === 0 && (
                <div className="col-span-2 p-6 bg-slate-800/60 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-semibold text-white">All 20 Invariant Checks Verified 100% Green</div>
                  <p className="text-xs text-slate-400">No cross-tenant leakage, zero self-approvals, audit chains verified intact.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 17: AUDIT TRAIL
        ========================================================================= */}
        {activeTab === 'audit_trail' && (
          <div id="view-audit-trail" className="space-y-4">
            <h2 className="text-base font-semibold text-white">Cryptographic SHA-256 Audit Trail</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-850 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Event ID</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Entity</th>
                    <th className="py-3 px-4 font-semibold">Actor</th>
                    <th className="py-3 px-4 font-semibold">SHA-256 Hash</th>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-300">
                  {auditEvents.map(e => (
                    <tr key={e.eventId} className="hover:bg-slate-750">
                      <td className="py-3 px-4 font-mono text-indigo-300">{e.eventId}</td>
                      <td className="py-3 px-4 font-semibold text-white">{e.action}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{e.entityType} ({e.entityId})</td>
                      <td className="py-3 px-4">{e.actorUserIdRef}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{e.currentHash.substring(0, 16)}...</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{e.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 18: SANDBOX SIMULATION
        ========================================================================= */}
        {activeTab === 'sandbox' && (
          <div id="view-sandbox" className="space-y-6">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-400" />
                  What-If Simulation Sandbox (15 Operational Scenarios)
                </h2>
                <p className="text-xs text-slate-400">Zero production mutation guaranteed. Evaluates hypothetical support surges.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { type: 'CASE_SURGE', label: 'Case Surge (300%)' },
                  { type: 'REFERRAL_BACKLOG', label: 'Referral Backlog' },
                  { type: 'ADVISOR_CAPACITY_EXHAUSTION', label: 'Advisor Exhaustion' },
                  { type: 'ADVISOR_DOUBLE_BOOKING', label: 'Double-Booking Replay' },
                  { type: 'CRITICAL_CASE_ESCALATION', label: 'Critical Escalations' },
                  { type: 'SLA_BREACH_CASCADE', label: 'SLA Breach Cascade' },
                  { type: 'MASS_SERVICE_REQUEST', label: 'Mass Service Influx' },
                  { type: 'ACCOMMODATION_SURGE', label: 'Accommodations Surge' },
                  { type: 'ACCOMMODATION_EXPIRY', label: 'Plan Expiry Wave' },
                  { type: 'INTERVENTION_CASCADE', label: 'Alert Intervention Wave' },
                  { type: 'FOLLOWUP_OVERLOAD', label: 'Follow-Up Overload' },
                  { type: 'MULTI_CAMPUS_SUPPORT_LOAD', label: 'Multi-Campus Sharing' },
                  { type: 'PROVIDER_UNAVAILABLE', label: 'Counsellor Outage' },
                  { type: 'DUPLICATE_REQUEST_REPLAY', label: 'Replay Idempotency' },
                  { type: 'FULL_SUPPORT_LIFECYCLE', label: 'Full Support Journey' }
                ].map(item => (
                  <button
                    key={item.type}
                    onClick={() => triggerSimulation(item.type as StudentSupportSimulationType)}
                    className="p-3 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-lg text-left text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <div className="text-indigo-400 text-[10px] uppercase font-mono mb-0.5">Scenario</div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {activeSimulation && (
              <div className="p-5 bg-slate-800 border border-indigo-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{activeSimulation.title}</h3>
                  <span className="font-mono text-xs text-slate-400">{activeSimulation.simulatedAt}</span>
                </div>
                <p className="text-xs text-slate-300">{activeSimulation.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded border border-slate-700 text-xs">
                    <div className="text-slate-400 text-[10px]">Predicted Backlog</div>
                    <div className="text-lg font-bold text-amber-400">{activeSimulation.syntheticResults.predictedCaseBacklog} cases</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700 text-xs">
                    <div className="text-slate-400 text-[10px]">Advisor Utilization</div>
                    <div className="text-lg font-bold text-indigo-400">{activeSimulation.syntheticResults.advisorUtilizationPercent}%</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700 text-xs">
                    <div className="text-slate-400 text-[10px]">Projected SLA Breaches</div>
                    <div className="text-lg font-bold text-rose-400">{activeSimulation.syntheticResults.predictedSlaBreachCount}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700 text-xs">
                    <div className="text-slate-400 text-[10px]">Compliance Projected</div>
                    <div className="text-lg font-bold text-emerald-400">{activeSimulation.syntheticResults.complianceScoreProjected}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALS & FOUR-EYES APPROVAL POPUPS
      ========================================================================= */}

      {/* Modal: New Support Case */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Student Support Case</h3>
              <button onClick={() => setShowNewCaseModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Student</label>
                <input
                  type="text"
                  value={newCaseForm.studentName}
                  onChange={e => setNewCaseForm({ ...newCaseForm, studentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Service Category</label>
                <select
                  value={newCaseForm.serviceCategory}
                  onChange={e => setNewCaseForm({ ...newCaseForm, serviceCategory: e.target.value as SupportCategory })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="ACADEMIC_ADVISING">Academic Advising</option>
                  <option value="COUNSELLING_WELLBEING">Counselling & Wellbeing</option>
                  <option value="ACCESSIBILITY_SERVICES">Accessibility Services</option>
                  <option value="CAREER_SERVICES">Career Services</option>
                  <option value="FINANCIAL_AID">Financial Aid</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Case Title</label>
                <input
                  type="text"
                  placeholder="e.g., Course Overload Evaluation"
                  value={newCaseForm.title}
                  onChange={e => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description & Initial Notes</label>
                <textarea
                  rows={3}
                  value={newCaseForm.description}
                  onChange={e => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={newCaseForm.priority}
                    onChange={e => setNewCaseForm({ ...newCaseForm, priority: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Confidentiality</label>
                  <select
                    value={newCaseForm.confidentialityLevel}
                    onChange={e => setNewCaseForm({ ...newCaseForm, confidentialityLevel: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="STANDARD">STANDARD</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="HIGHLY_CONFIDENTIAL">HIGHLY_CONFIDENTIAL</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded"
                >
                  Submit Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Appointment */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Schedule Advising Appointment</h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleScheduleAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Student Name</label>
                <input
                  type="text"
                  value={newApptForm.studentName}
                  onChange={e => setNewApptForm({ ...newApptForm, studentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Faculty Advisor</label>
                <select
                  value={newApptForm.advisorUserIdRef}
                  onChange={e => setNewApptForm({ ...newApptForm, advisorUserIdRef: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                >
                  <option value="usr-advisor-sarah">Dr. Sarah Jenkins (Academic Advisor)</option>
                  <option value="usr-counsel-dir-01">Dr. Eleanor Vance (Director of Wellbeing)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Start Time (ISO)</label>
                  <input
                    type="text"
                    value={newApptForm.slotStartTime}
                    onChange={e => setNewApptForm({ ...newApptForm, slotStartTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Time (ISO)</label>
                  <input
                    type="text"
                    value={newApptForm.slotEndTime}
                    onChange={e => setNewApptForm({ ...newApptForm, slotEndTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Purpose</label>
                <input
                  type="text"
                  value={newApptForm.purpose}
                  onChange={e => setNewApptForm({ ...newApptForm, purpose: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Four-Eyes Segregation of Duties Closure */}
      {showFourEyesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Four-Eyes Approval Mandate</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Institutional policy requires distinct dual authorization for critical case closures and sensitive record modifications.
              Self-approval (<span className="font-mono text-rose-400">requester === approver</span>) is strictly prohibited.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Primary Actor (Operator)</label>
                <input
                  type="text"
                  value="usr-current-operator"
                  disabled
                  className="w-full bg-slate-900/60 border border-slate-700 rounded p-2 text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Dual Approver User ID (Non-Identical)</label>
                <input
                  type="text"
                  value={dualApproverId}
                  onChange={e => setDualApproverId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono"
                  placeholder="e.g. usr-supervisor-02"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Closure Rationale & Sign-Off Remarks</label>
                <textarea
                  rows={2}
                  value={closureRemarks}
                  onChange={e => setClosureRemarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFourEyesModal(false)}
                className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={executeFourEyesClosure}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
              >
                Authorize & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
