import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Stethoscope, 
  UserCheck, 
  ClipboardList, 
  Share2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Plus, 
  Search, 
  ShieldAlert, 
  Calendar, 
  FileText, 
  Lock, 
  Unlock, 
  Activity, 
  Users, 
  RefreshCw,
  Eye,
  Check,
  X,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { StudentSupportService } from '../../services/studentSupportService';
import { StudentService } from '../../services/studentService';
import { 
  StudentSupportCase, 
  HealthEncounter, 
  WellnessObservation, 
  CounsellingCase, 
  CounsellingSession, 
  SupportPlan, 
  SupportReferral, 
  SupportConsent, 
  SupportAccommodation, 
  SupportIncident, 
  EmergencySupportOverride, 
  SupportAnalyticsCache,
  SupportCaseCategory,
  SupportCasePriority,
  SupportCaseStatus,
  ConfidentialityLevel,
  HealthEncounterType,
  WellnessDomain,
  WellnessRiskLevel,
  ReferralCategory,
  ConsentType,
  AccommodationCategory,
  IncidentSeverity
} from '../../types/studentSupport';
import { Student } from '../../types';

interface StudentSupportWorkspaceProps {
  tenantId: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role?: string;
  };
}

type TabType = 
  | 'command_center'
  | 'cases'
  | 'health_wellness'
  | 'counselling'
  | 'support_plans'
  | 'referrals'
  | 'followups_sla'
  | 'accommodations'
  | 'incidents'
  | 'analytics'
  | 'welfare'
  | 'grievances'
  | 'safeguarding';

export const StudentSupportWorkspace: React.FC<StudentSupportWorkspaceProps> = ({ tenantId, user }) => {
  const [activeTab, setActiveTab] = useState<TabType>('command_center');
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  // State
  const [cases, setCases] = useState<StudentSupportCase[]>([]);
  const [healthEncounters, setHealthEncounters] = useState<HealthEncounter[]>([]);
  const [wellnessObs, setWellnessObs] = useState<WellnessObservation[]>([]);
  const [counsellingCases, setCounsellingCases] = useState<CounsellingCase[]>([]);
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);
  const [referrals, setReferrals] = useState<SupportReferral[]>([]);
  const [consents, setConsents] = useState<SupportConsent[]>([]);
  const [accommodations, setAccommodations] = useState<SupportAccommodation[]>([]);
  const [incidents, setIncidents] = useState<SupportIncident[]>([]);
  const [analytics, setAnalytics] = useState<SupportAnalyticsCache | null>(null);

  // Phase 7.26 addition states
  const [welfareInterventions, setWelfareInterventions] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [safeguardingCases, setSafeguardingCases] = useState<any[]>([]);

  const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null);
  const [selectedSafeguarding, setSelectedSafeguarding] = useState<any | null>(null);

  const [showWelfareModal, setShowWelfareModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showSafeguardingModal, setShowSafeguardingModal] = useState(false);

  const [welfareForm, setWelfareForm] = useState({
    studentId: '',
    type: 'Financial Aid Support',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    status: 'OPEN' as 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    assignedStaffId: user.id,
    assignedStaffName: user.displayName,
    outcomeNotes: ''
  });

  const [grievanceForm, setGrievanceForm] = useState({
    complainantReference: '',
    complainantName: '',
    complainantType: 'STUDENT' as 'STUDENT' | 'GUARDIAN' | 'STAFF' | 'OTHER',
    subjectReference: '',
    category: 'Academic Assessment Grievance',
    description: '',
    priority: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
    assignedOfficerId: '',
    assignedOfficerName: '',
    investigationNotes: '',
    resolution: '',
    response: '',
    appealReference: ''
  });

  const [safeguardingForm, setSafeguardingForm] = useState({
    studentId: '',
    severity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    status: 'OPEN' as 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'MONITORING' | 'CLOSED' | 'ESCALATED',
    designatedSafeguardingOfficerId: user.id,
    designatedSafeguardingOfficerName: user.displayName,
    actionPlan: '',
    protectedCaseNotes: '',
    referralReferences: ''
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showAccommodationModal, setShowAccommodationModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // Selected for details
  const [selectedCase, setSelectedCase] = useState<StudentSupportCase | null>(null);

  // Form States
  const [caseForm, setCaseForm] = useState({
    studentId: '',
    category: 'HEALTH' as SupportCaseCategory,
    priority: 'NORMAL' as SupportCasePriority,
    confidentialityLevel: 'STANDARD' as ConfidentialityLevel,
    summary: '',
    notes: ''
  });

  const [healthForm, setHealthForm] = useState({
    studentId: '',
    encounterType: 'ROUTINE_CHECK' as HealthEncounterType,
    temp: '',
    pulse: '',
    bpSystolic: '',
    bpDiastolic: '',
    observations: '',
    actionsTaken: '',
    medication: '',
    followUpRequired: false,
    referralRequired: false,
    guardianNotified: false,
    confidentialityLevel: 'STANDARD' as ConfidentialityLevel
  });

  const [counsellingForm, setCounsellingForm] = useState({
    studentId: '',
    assignedCounsellorId: user.id,
    assignedCounsellorName: user.displayName,
    priority: 'NORMAL' as SupportCasePriority,
    confidentialityLevel: 'CONFIDENTIAL' as ConfidentialityLevel,
    openingReasonCategory: 'COUNSELLING' as SupportCaseCategory
  });

  const [planForm, setPlanForm] = useState({
    studentId: '',
    planName: '',
    objectives: '',
    responsibleStaffId: user.id,
    responsibleStaffName: user.displayName,
    startDate: new Date().toISOString().split('T')[0],
    reviewDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  const [referralForm, setReferralForm] = useState({
    studentId: '',
    referralCategory: 'EXTERNAL_SPECIALIST' as ReferralCategory,
    providerType: 'Pediatric Specialist',
    providerName: 'City Children Hospital',
    reasonCategory: 'Specialist Evaluation',
    reasonDetails: '',
    followUpDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  });

  const [consentForm, setConsentForm] = useState({
    studentId: '',
    consentType: 'COUNSELLING' as ConsentType,
    grantedBy: 'Parent / Guardian',
    grantedByName: '',
    relationshipToStudent: 'MOTHER',
    scope: 'Permission for student counselling sessions'
  });

  const [accommodationForm, setAccommodationForm] = useState({
    studentId: '',
    category: 'EXAM' as AccommodationCategory,
    title: 'Extra Time for Exams',
    description: 'Grant 25% extra time for written evaluations due to mild dysgraphia.',
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  });

  const [incidentForm, setIncidentForm] = useState({
    studentId: '',
    location: 'Main Playground',
    category: 'HEALTH' as SupportCaseCategory,
    severity: 'MODERATE' as IncidentSeverity,
    description: '',
    immediateActions: '',
    guardianNotified: true,
    referralIssued: false
  });

  const [overrideForm, setOverrideForm] = useState({
    studentId: '',
    reason: 'Emergency hospital admission details requested by emergency medical response team',
    effectiveHours: '24'
  });

  useEffect(() => {
    loadWorkspaceData();
  }, [tenantId]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const fetchedStudents = await StudentService.getStudents(tenantId);
      setStudents(fetchedStudents);

      const [
        fetchedCases,
        fetchedHealth,
        fetchedWellness,
        fetchedCounselling,
        fetchedPlans,
        fetchedReferrals,
        fetchedConsents,
        fetchedAccommodations,
        fetchedIncidents,
        fetchedAnalytics,
        fetchedWelfare,
        fetchedGrievances,
        fetchedSafeguarding
      ] = await Promise.all([
        StudentSupportService.getSupportCases(tenantId, undefined, undefined, user.role),
        StudentSupportService.getHealthEncounters(tenantId, undefined, undefined, user.role),
        StudentSupportService.getWellnessObservations(tenantId),
        StudentSupportService.getCounsellingCases(tenantId, undefined, undefined, user.role),
        StudentSupportService.getSupportPlans(tenantId),
        StudentSupportService.getReferrals(tenantId),
        StudentSupportService.getConsents(tenantId),
        StudentSupportService.getAccommodations(tenantId),
        StudentSupportService.getIncidents(tenantId),
        StudentSupportService.getAnalyticsCache(tenantId),
        StudentSupportService.getWelfareInterventions(tenantId),
        StudentSupportService.getGrievances(tenantId),
        StudentSupportService.getSafeguardingCases(tenantId, undefined, user.role)
      ]);

      setCases(fetchedCases);
      setHealthEncounters(fetchedHealth);
      setWellnessObs(fetchedWellness);
      setCounsellingCases(fetchedCounselling);
      setSupportPlans(fetchedPlans);
      setReferrals(fetchedReferrals);
      setConsents(fetchedConsents);
      setAccommodations(fetchedAccommodations);
      setIncidents(fetchedIncidents);
      setAnalytics(fetchedAnalytics);
      setWelfareInterventions(fetchedWelfare || []);
      setGrievances(fetchedGrievances || []);
      setSafeguardingCases(fetchedSafeguarding || []);
    } catch (err) {
      console.error('Failed to load student support data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.studentId || !caseForm.summary) return;
    try {
      const student = students.find(s => s.id === caseForm.studentId);
      await StudentSupportService.createCase(
        tenantId,
        undefined,
        {
          studentId: caseForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          category: caseForm.category,
          priority: caseForm.priority,
          confidentialityLevel: caseForm.confidentialityLevel,
          status: 'OPEN',
          openedDate: new Date().toISOString(),
          targetFollowUpDate: StudentSupportService.calculateTargetFollowUpDate(caseForm.priority),
          summary: caseForm.summary,
          notes: caseForm.notes
        },
        user
      );
      setShowCaseModal(false);
      setCaseForm({ studentId: '', category: 'HEALTH', priority: 'NORMAL', confidentialityLevel: 'STANDARD', summary: '', notes: '' });
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating case: ${(err as Error).message}`);
    }
  };

  const handleCreateWelfare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!welfareForm.studentId || !welfareForm.description) return;
    try {
      const student = students.find(s => s.id === welfareForm.studentId);
      await StudentSupportService.createWelfareIntervention(
        tenantId,
        undefined,
        {
          studentId: welfareForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          type: welfareForm.type,
          description: welfareForm.description,
          startDate: welfareForm.startDate,
          targetEndDate: welfareForm.targetEndDate,
          status: welfareForm.status,
          assignedStaffId: welfareForm.assignedStaffId,
          assignedStaffName: welfareForm.assignedStaffName,
          outcomeNotes: welfareForm.outcomeNotes
        },
        user
      );
      setShowWelfareModal(false);
      setWelfareForm({
        studentId: '',
        type: 'Financial Aid Support',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        targetEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        status: 'OPEN',
        assignedStaffId: user.id,
        assignedStaffName: user.displayName,
        outcomeNotes: ''
      });
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating welfare intervention: ${(err as Error).message}`);
    }
  };

  const handleCreateGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceForm.complainantName || !grievanceForm.description) return;
    try {
      await StudentSupportService.createGrievance(
        tenantId,
        undefined,
        {
          complainantReference: grievanceForm.complainantReference || 'N/A',
          complainantName: grievanceForm.complainantName,
          complainantType: grievanceForm.complainantType,
          subjectReference: grievanceForm.subjectReference || undefined,
          category: grievanceForm.category,
          description: grievanceForm.description,
          priority: grievanceForm.priority,
          assignedOfficerId: grievanceForm.assignedOfficerId || undefined,
          assignedOfficerName: grievanceForm.assignedOfficerName || undefined,
          investigationNotes: grievanceForm.investigationNotes || undefined,
          resolution: grievanceForm.resolution || undefined,
          response: grievanceForm.response || undefined,
          appealReference: grievanceForm.appealReference || undefined
        },
        user
      );
      setShowGrievanceModal(false);
      setGrievanceForm({
        complainantReference: '',
        complainantName: '',
        complainantType: 'STUDENT',
        subjectReference: '',
        category: 'Academic Assessment Grievance',
        description: '',
        priority: 'NORMAL',
        assignedOfficerId: '',
        assignedOfficerName: '',
        investigationNotes: '',
        resolution: '',
        response: '',
        appealReference: ''
      });
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating grievance: ${(err as Error).message}`);
    }
  };

  const handleCreateSafeguarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safeguardingForm.studentId || !safeguardingForm.actionPlan) return;
    try {
      const student = students.find(s => s.id === safeguardingForm.studentId);
      await StudentSupportService.createSafeguardingCase(
        tenantId,
        undefined,
        {
          studentId: safeguardingForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          severity: safeguardingForm.severity,
          status: safeguardingForm.status,
          designatedSafeguardingOfficerId: safeguardingForm.designatedSafeguardingOfficerId,
          designatedSafeguardingOfficerName: safeguardingForm.designatedSafeguardingOfficerName,
          actionPlan: safeguardingForm.actionPlan,
          protectedCaseNotes: safeguardingForm.protectedCaseNotes,
          referralReferences: safeguardingForm.referralReferences ? safeguardingForm.referralReferences.split(',') : []
        },
        user
      );
      setShowSafeguardingModal(false);
      setSafeguardingForm({
        studentId: '',
        severity: 'MEDIUM',
        status: 'OPEN',
        designatedSafeguardingOfficerId: user.id,
        designatedSafeguardingOfficerName: user.displayName,
        actionPlan: '',
        protectedCaseNotes: '',
        referralReferences: ''
      });
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating safeguarding case: ${(err as Error).message}`);
    }
  };

  const handleCreateHealthEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthForm.studentId || !healthForm.observations) return;
    try {
      const student = students.find(s => s.id === healthForm.studentId);
      await StudentSupportService.logHealthEncounter(
        tenantId,
        undefined,
        {
          studentId: healthForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          encounterDateTime: new Date().toISOString(),
          encounterType: healthForm.encounterType,
          staffMemberId: user.id,
          staffMemberName: user.displayName,
          vitals: {
            temperatureCelsius: healthForm.temp ? parseFloat(healthForm.temp) : undefined,
            pulseBpm: healthForm.pulse ? parseInt(healthForm.pulse) : undefined,
            bpSystolic: healthForm.bpSystolic ? parseInt(healthForm.bpSystolic) : undefined,
            bpDiastolic: healthForm.bpDiastolic ? parseInt(healthForm.bpDiastolic) : undefined
          },
          observations: healthForm.observations,
          actionsTaken: healthForm.actionsTaken,
          medicationAdministered: healthForm.medication || undefined,
          followUpRequired: healthForm.followUpRequired,
          referralRequired: healthForm.referralRequired,
          guardianNotified: healthForm.guardianNotified,
          confidentialityLevel: healthForm.confidentialityLevel
        },
        user
      );
      setShowHealthModal(false);
      setHealthForm({ studentId: '', encounterType: 'ROUTINE_CHECK', temp: '', pulse: '', bpSystolic: '', bpDiastolic: '', observations: '', actionsTaken: '', medication: '', followUpRequired: false, referralRequired: false, guardianNotified: false, confidentialityLevel: 'STANDARD' });
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error logging health encounter: ${(err as Error).message}`);
    }
  };

  const handleCreateCounsellingCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counsellingForm.studentId) return;
    try {
      const student = students.find(s => s.id === counsellingForm.studentId);
      await StudentSupportService.createCounsellingCase(
        tenantId,
        undefined,
        {
          studentId: counsellingForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          assignedCounsellorId: counsellingForm.assignedCounsellorId,
          assignedCounsellorName: counsellingForm.assignedCounsellorName,
          priority: counsellingForm.priority,
          status: 'OPEN',
          confidentialityLevel: counsellingForm.confidentialityLevel,
          openingReasonCategory: counsellingForm.openingReasonCategory,
          openedAt: new Date().toISOString()
        },
        user
      );
      setShowCounsellingModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating counselling case: ${(err as Error).message}`);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.studentId || !planForm.planName) return;
    try {
      const student = students.find(s => s.id === planForm.studentId);
      await StudentSupportService.createSupportPlan(
        tenantId,
        undefined,
        {
          studentId: planForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          planName: planForm.planName,
          objectives: planForm.objectives.split('\n').filter(o => o.trim()),
          responsibleStaffId: planForm.responsibleStaffId,
          responsibleStaffName: planForm.responsibleStaffName,
          startDate: planForm.startDate,
          reviewDate: planForm.reviewDate,
          status: 'ACTIVE',
          tasks: [
            {
              id: `task_${Date.now()}_1`,
              planId: '',
              description: 'Initial assessment & objective review',
              assignedTo: user.id,
              assignedToName: user.displayName,
              dueDate: planForm.reviewDate,
              status: 'PENDING'
            }
          ]
        },
        user
      );
      setShowPlanModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating plan: ${(err as Error).message}`);
    }
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralForm.studentId) return;
    try {
      const student = students.find(s => s.id === referralForm.studentId);
      await StudentSupportService.createReferral(
        tenantId,
        undefined,
        {
          studentId: referralForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          referralCategory: referralForm.referralCategory,
          providerType: referralForm.providerType,
          providerName: referralForm.providerName,
          referralDate: new Date().toISOString().split('T')[0],
          reasonCategory: referralForm.reasonCategory,
          reasonDetails: referralForm.reasonDetails,
          consentStatus: 'GRANTED',
          followUpDate: referralForm.followUpDate,
          completionStatus: 'REQUESTED'
        },
        user
      );
      setShowReferralModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating referral: ${(err as Error).message}`);
    }
  };

  const handleGrantConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentForm.studentId || !consentForm.grantedByName) return;
    try {
      const student = students.find(s => s.id === consentForm.studentId);
      await StudentSupportService.grantConsent(
        tenantId,
        undefined,
        {
          studentId: consentForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          consentType: consentForm.consentType,
          grantedBy: consentForm.grantedBy,
          grantedByName: consentForm.grantedByName,
          relationshipToStudent: consentForm.relationshipToStudent,
          scope: consentForm.scope
        },
        user
      );
      setShowConsentModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error granting consent: ${(err as Error).message}`);
    }
  };

  const handleCreateAccommodation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accommodationForm.studentId || !accommodationForm.title) return;
    try {
      const student = students.find(s => s.id === accommodationForm.studentId);
      await StudentSupportService.createAccommodation(
        tenantId,
        undefined,
        {
          studentId: accommodationForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          category: accommodationForm.category,
          title: accommodationForm.title,
          description: accommodationForm.description,
          effectiveFrom: accommodationForm.effectiveFrom,
          effectiveTo: accommodationForm.effectiveTo,
          status: 'ACTIVE',
          approvingAuthority: user.displayName,
          reviewDate: accommodationForm.effectiveTo
        },
        user
      );
      setShowAccommodationModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error creating accommodation: ${(err as Error).message}`);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.studentId || !incidentForm.description) return;
    try {
      const student = students.find(s => s.id === incidentForm.studentId);
      await StudentSupportService.logIncident(
        tenantId,
        undefined,
        {
          studentId: incidentForm.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
          incidentTimestamp: new Date().toISOString(),
          location: incidentForm.location,
          category: incidentForm.category,
          severity: incidentForm.severity,
          description: incidentForm.description,
          immediateActions: incidentForm.immediateActions,
          responsibleStaffId: user.id,
          responsibleStaffName: user.displayName,
          escalationStatus: 'NONE',
          guardianNotified: incidentForm.guardianNotified,
          referralIssued: incidentForm.referralIssued
        },
        user
      );
      setShowIncidentModal(false);
      await loadWorkspaceData();
    } catch (err) {
      alert(`Error logging incident: ${(err as Error).message}`);
    }
  };

  const handleGrantOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideForm.studentId || !overrideForm.reason) return;
    try {
      const hours = parseInt(overrideForm.effectiveHours) || 24;
      const until = new Date(Date.now() + hours * 3600000).toISOString();
      await StudentSupportService.grantEmergencyOverride(
        tenantId,
        undefined,
        overrideForm.studentId,
        undefined,
        overrideForm.reason,
        until,
        user
      );
      setShowOverrideModal(false);
      alert('Emergency Support Override Granted. Access recorded in security audit trail.');
    } catch (err) {
      alert(`Error granting override: ${(err as Error).message}`);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.studentName && c.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesPri = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesStat = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesCat && matchesPri && matchesStat;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mb-3" />
        <h3 className="text-sm font-semibold text-slate-700">Loading Student Support Engine...</h3>
        <p className="text-xs text-slate-500 mt-1">Checking authoritative health, counselling, and SLA boundaries</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-rose-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Phase 7.13 Authoritative Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Data Privacy Guard Active
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Health, Wellness & Student Support</h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Comprehensive student care, health encounters, confidential counselling, support plans, external referrals, accessibility accommodations, and emergency incident governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowCaseModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-rose-600/30"
            >
              <Plus className="w-4 h-4" />
              New Support Case
            </button>
            <button 
              onClick={() => setShowHealthModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              Log Health Encounter
            </button>
            <button 
              onClick={() => setShowOverrideModal(true)}
              className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Emergency Override
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'command_center', label: 'Command Center', icon: HeartHandshake },
          { id: 'cases', label: `Support Cases (${cases.length})`, icon: ClipboardList },
          { id: 'health_wellness', label: `Health & Wellness (${healthEncounters.length})`, icon: Stethoscope },
          { id: 'counselling', label: `Counselling (${counsellingCases.length})`, icon: UserCheck },
          { id: 'support_plans', label: `Support Plans (${supportPlans.length})`, icon: Calendar },
          { id: 'referrals', label: `Referrals (${referrals.length})`, icon: Share2 },
          { id: 'followups_sla', label: 'Follow-ups & SLA', icon: Clock },
          { id: 'accommodations', label: `Accommodations (${accommodations.length})`, icon: CheckCircle2 },
          { id: 'incidents', label: `Incidents (${incidents.length})`, icon: AlertTriangle },
          { id: 'analytics', label: 'Analytics & SLA', icon: BarChart3 },
          { id: 'welfare', label: `Welfare (${welfareInterventions.length})`, icon: Users },
          { id: 'grievances', label: `Grievances (${grievances.length})`, icon: ClipboardList },
          ...(['super_admin', 'platform_admin', 'safeguarding_officer'].includes(user.role || '') ? [
            { id: 'safeguarding', label: `Safeguarding (${safeguardingCases.length})`, icon: ShieldAlert }
          ] : [])
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. COMMAND CENTER VIEW */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Support Cases</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{analytics?.activeCasesCount || cases.filter(c => !['RESOLVED','CLOSED','CANCELLED'].includes(c.status)).length}</h3>
                <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {analytics?.slaBreachedCount || 0} SLA Action Needed
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Encounters</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{healthEncounters.length}</h3>
                <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Routine & First-Aid Logged
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Support Plans</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{supportPlans.filter(p => p.status === 'ACTIVE').length}</h3>
                <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Under Review Schedule
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Accommodations</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{accommodations.filter(a => a.status === 'ACTIVE').length}</h3>
                <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Exam & Classroom Special Needs
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Overview Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urgent / Emergency Cases Panel */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Priority Cases & SLA Radar</h3>
                  <p className="text-xs text-slate-500">Cases requiring prompt triage, assignment, or follow-up action</p>
                </div>
                <button 
                  onClick={() => setActiveTab('cases')}
                  className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                >
                  View All Cases <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {cases.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No active support cases logged. Use "+ New Support Case" to record student support items.
                  </div>
                ) : (
                  cases.slice(0, 5).map(c => {
                    const isOverdue = c.targetFollowUpDate && new Date(c.targetFollowUpDate).getTime() < Date.now();
                    return (
                      <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            c.priority === 'EMERGENCY' ? 'bg-rose-600 animate-ping' :
                            c.priority === 'URGENT' ? 'bg-rose-500' :
                            c.priority === 'HIGH' ? 'bg-amber-500' : 'bg-sky-500'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{c.caseNumber}</span>
                              <span className="text-xs font-medium text-slate-700">{c.studentName || 'Student'}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                                {c.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.summary}</p>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div className="hidden sm:block">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isOverdue ? 'SLA Overdue' : `Target: ${new Date(c.targetFollowUpDate).toLocaleDateString()}`}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedCase(c)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Health Encounters & Incidents Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Recent Health Encounters</h3>
              <p className="text-xs text-slate-500">First-aid, medication & wellness checkups</p>

              <div className="space-y-3">
                {healthEncounters.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No recent health encounters.</p>
                ) : (
                  healthEncounters.slice(0, 4).map(h => (
                    <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{h.encounterType}</span>
                        <span className="text-[10px] text-slate-400">{new Date(h.encounterDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{h.studentName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{h.observations}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUPPORT CASES WORKSPACE */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search case #, student name, summary..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="ACADEMIC">Academic</option>
                <option value="BEHAVIOURAL">Behavioural</option>
                <option value="HEALTH">Health</option>
                <option value="COUNSELLING">Counselling</option>
                <option value="SAFEGUARDING">Safeguarding</option>
                <option value="RESIDENTIAL">Residential</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="TRIAGED">Triaged</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          {/* Cases Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Confidentiality</th>
                    <th className="px-4 py-3">Target Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        No support cases match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{c.caseNumber}</td>
                        <td className="px-4 py-3 text-slate-900">{c.studentName || 'Student'}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            c.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-700' :
                            c.priority === 'URGENT' ? 'bg-orange-100 text-orange-700' :
                            c.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-[11px] text-slate-600">
                            <Lock className="w-3 h-3 text-slate-400" />
                            {c.confidentialityLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(c.targetFollowUpDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedCase(c)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. HEALTH & WELLNESS WORKSPACE */}
      {activeTab === 'health_wellness' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Health Encounters & Vitals Log</h3>
              <p className="text-xs text-slate-500">First-aid, medical checkups, observations and routine nurse logs</p>
            </div>
            <button
              onClick={() => setShowHealthModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Log Encounter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthEncounters.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No health encounters recorded yet. Use "Log Encounter" to record student health checkups.
              </div>
            ) : (
              healthEncounters.map(h => (
                <div key={h.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {h.encounterType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(h.encounterDateTime).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{h.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-1">{h.observations}</p>
                  </div>

                  {h.vitals && (
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-700">
                      <div>Temp: <span className="font-bold">{h.vitals.temperatureCelsius ? `${h.vitals.temperatureCelsius} °C` : 'N/A'}</span></div>
                      <div>Pulse: <span className="font-bold">{h.vitals.pulseBpm ? `${h.vitals.pulseBpm} bpm` : 'N/A'}</span></div>
                      <div>BP: <span className="font-bold">{h.vitals.bpSystolic && h.vitals.bpDiastolic ? `${h.vitals.bpSystolic}/${h.vitals.bpDiastolic}` : 'N/A'}</span></div>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Staff: {h.staffMemberName}</span>
                    <span className="font-semibold text-slate-700">{h.confidentialityLevel}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. COUNSELLING WORKSPACE */}
      {activeTab === 'counselling' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Counselling & Mental Health Governance</h3>
              <p className="text-xs text-slate-500">Confidential counselling cases, session durations, and counsellor assignments</p>
            </div>
            <button
              onClick={() => setShowCounsellingModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Counselling Case
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counsellingCases.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                  No counselling cases registered.
                </div>
              ) : (
                counsellingCases.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700">{c.caseNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-800">
                        {c.confidentialityLevel}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{c.studentName}</h4>
                    <p className="text-xs text-slate-600">Counsellor: <span className="font-semibold">{c.assignedCounsellorName}</span></p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>Total Sessions: {c.totalSessions}</span>
                      <span>Opened: {new Date(c.openedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUPPORT PLANS WORKSPACE */}
      {activeTab === 'support_plans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Support Plans (IEP / Care Plans)</h3>
              <p className="text-xs text-slate-500">Structured objectives, task checklists, and scheduled review milestones</p>
            </div>
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Support Plan
            </button>
          </div>

          <div className="space-y-4">
            {supportPlans.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No active support plans.
              </div>
            ) : (
              supportPlans.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{p.planName}</h4>
                      <p className="text-xs text-slate-500">Student: <span className="font-semibold text-slate-700">{p.studentName}</span> | Responsible Staff: {p.responsibleStaffName}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                      {p.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-700">Objectives:</p>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                      {p.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Start: {p.startDate}</span>
                    <span>Next Review Target: <strong className="text-slate-800">{p.reviewDate}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. REFERRALS WORKSPACE */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">External & Internal Referrals</h3>
              <p className="text-xs text-slate-500">Specialist care, medical clinic, and safeguarding authority referrals</p>
            </div>
            <button
              onClick={() => setShowReferralModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Request Referral
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No referral requests logged.</td>
                  </tr>
                ) : (
                  referrals.map(r => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-bold text-slate-900">{r.studentName}</td>
                      <td className="px-4 py-3">{r.referralCategory}</td>
                      <td className="px-4 py-3">{r.providerName || r.providerType}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {r.consentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {r.completionStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{r.followUpDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. FOLLOW-UPS & SLA WORKSPACE */}
      {activeTab === 'followups_sla' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">SLA Target & Response Countdown Engine</h3>
            <p className="text-xs text-slate-500">Configured target follow-up response windows based on priority level</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                <p className="text-[11px] font-bold text-rose-800">EMERGENCY SLA</p>
                <p className="text-lg font-bold text-rose-950 mt-1">4 Hours</p>
                <p className="text-[10px] text-rose-700">Immediate guardian & medical response</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-[11px] font-bold text-amber-800">URGENT SLA</p>
                <p className="text-lg font-bold text-amber-950 mt-1">24 Hours</p>
                <p className="text-[10px] text-amber-700">Triage & staff assignment window</p>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl">
                <p className="text-[11px] font-bold text-sky-800">NORMAL SLA</p>
                <p className="text-lg font-bold text-sky-950 mt-1">7 Days</p>
                <p className="text-[10px] text-sky-700">Standard support plan review</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. ACCOMMODATIONS WORKSPACE */}
      {activeTab === 'accommodations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Accessibility & Special Accommodations</h3>
              <p className="text-xs text-slate-500">Exam time extensions, classroom seating, residence, and transport accommodations</p>
            </div>
            <button
              onClick={() => setShowAccommodationModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Accommodation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accommodations.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No active accommodations.
              </div>
            ) : (
              accommodations.map(a => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                      {a.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{a.status}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{a.title}</h4>
                  <p className="text-xs text-slate-600">{a.description}</p>
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">Student: <span className="font-semibold text-slate-800">{a.studentName}</span></p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 9. INCIDENTS WORKSPACE */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Emergency Incidents & Incident Logs</h3>
              <p className="text-xs text-slate-500">Emergency incident reporting, immediate actions taken, and escalation tracking</p>
            </div>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Report Incident
            </button>
          </div>

          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No emergency incidents logged.
              </div>
            ) : (
              incidents.map(inc => (
                <div key={inc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                        inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inc.severity} SEVERITY
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{inc.location}</span>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(inc.incidentTimestamp).toLocaleString()}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student: {inc.studentName}</h4>
                    <p className="text-xs text-slate-600 mt-1">{inc.description}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                    <strong className="text-slate-900">Immediate Actions:</strong> {inc.immediateActions}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 10. ANALYTICS WORKSPACE */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">Support Engine Rebuildable Analytics</h3>
              <p className="text-xs text-slate-500">Real-time aggregate data metrics computed on tenant boundaries</p>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                const updated = await StudentSupportService.rebuildAnalyticsCache(tenantId);
                setAnalytics(updated);
                setLoading(false);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rebuild Analytics
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cases by Category</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(analytics?.casesByCategory || {}).map(([cat, count]) => (
                  <div key={cat} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cases by Priority</h4>
              <div className="space-y-2 text-xs">
                {Object.entries(analytics?.casesByPriority || {}).map(([pri, count]) => (
                  <div key={pri} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{pri}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Governance Metrics</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Avg Resolution Time</span>
                  <span className="font-bold text-slate-900">{analytics?.averageResolutionDays} Days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Active Accommodations</span>
                  <span className="font-bold text-slate-900">{analytics?.activeAccommodations}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Pending Referrals</span>
                  <span className="font-bold text-slate-900">{analytics?.pendingReferrals}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. WELFARE INTERVENTIONS WORKSPACE */}
      {activeTab === 'welfare' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Welfare Interventions</h3>
              <p className="text-xs text-slate-500">Provide targeted financial aid, housing, nutritional, or community support</p>
            </div>
            <button
              onClick={() => setShowWelfareModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Welfare Case
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {welfareInterventions.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No active welfare interventions.
              </div>
            ) : (
              welfareInterventions.map(w => (
                <div key={w.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xxs font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                        {w.type}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">Student: {w.studentName}</h4>
                      <p className="text-xs text-slate-500">Assigned: {w.assignedStaffName}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xxs font-bold rounded-lg ${
                      w.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      w.status === 'CANCELLED' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {w.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {w.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Timeline: {w.startDate} to {w.targetEndDate}</span>
                    {w.status === 'OPEN' && (
                      <button
                        onClick={async () => {
                          try {
                            await StudentSupportService.updateWelfareStatus(tenantId, w.id, 'COMPLETED', user);
                            await loadWorkspaceData();
                          } catch (err) {
                            alert((err as Error).message);
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xxs font-semibold"
                      >
                        Complete Support
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 12. GRIEVANCES WORKSPACE */}
      {activeTab === 'grievances' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Academic & Conduct Grievance Desk</h3>
              <p className="text-xs text-slate-500">Secure log and review panel for formal complaints, triages, and resolution responses</p>
            </div>
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> File Grievance / Complaint
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grievance list */}
            <div className="lg:col-span-2 space-y-4">
              {grievances.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  No grievances filed.
                </div>
              ) : (
                grievances.map(g => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGrievance(g)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-3 hover:border-slate-400 ${
                      selectedGrievance?.id === g.id ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xxs font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">
                          {g.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">From: {g.complainantName} ({g.complainantType})</h4>
                        <p className="text-xs text-slate-500">Ref No: {g.caseNumber}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 text-xxs font-bold rounded-md ${
                          g.priority === 'URGENT' || g.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {g.priority}
                        </span>
                        <span className={`px-2 py-0.5 text-xxs font-bold rounded-md ${
                          g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {g.description}
                    </p>

                    <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Investigator: {g.assignedOfficerName || 'Not Assigned'}</span>
                      <span>Filed: {new Date(g.openedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detailed Investigation Panel (Separation of Duties implementation) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Investigation & Resolution Control</h4>
              {selectedGrievance ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400">Grievance Ref:</span>
                    <p className="text-slate-900 font-mono text-xs">{selectedGrievance.caseNumber}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400">Statement:</span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 leading-relaxed">
                      {selectedGrievance.description}
                    </p>
                  </div>

                  {selectedGrievance.status === 'OPEN' && (
                    <button
                      onClick={async () => {
                        try {
                          await StudentSupportService.assignCaseSupport(tenantId, selectedGrievance.id, user.id, user.displayName, user.role || 'staff', 'grievance_investigation', 'Formal grievance assignment', user);
                          await loadWorkspaceData();
                          setSelectedGrievance(prev => prev ? { ...prev, status: 'ASSIGNED', assignedOfficerId: user.id, assignedOfficerName: user.displayName } : null);
                        } catch (err) {
                          alert((err as Error).message);
                        }
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      Assign Investigation to Me
                    </button>
                  )}

                  {selectedGrievance.status === 'ASSIGNED' && selectedGrievance.assignedOfficerId === user.id && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <p className="font-bold text-slate-700">Draft Investigation Response</p>
                      <div>
                        <label className="block text-xxs font-semibold text-slate-500 mb-1">Detailed Findings & Action Taken</label>
                        <textarea
                          placeholder="Log findings..."
                          className="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                          id="findings_input"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          const findings = (document.getElementById('findings_input') as HTMLTextAreaElement)?.value;
                          if (!findings) return alert('Please enter investigation findings first.');
                          try {
                            // Stage response for separate approval
                            await StudentSupportService.logGrievanceResponseDraft(tenantId, selectedGrievance.id, findings, user);
                            await loadWorkspaceData();
                            alert('Draft findings submitted. Separation of Duties requires a DIFFERENT officer/admin to approve and send.');
                            setSelectedGrievance(null);
                          } catch (err) {
                            alert((err as Error).message);
                          }
                        }}
                        className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-sm"
                      >
                        Submit Response Draft
                      </button>
                    </div>
                  )}

                  {selectedGrievance.status === 'TRIAGED' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <p className="font-bold text-amber-600">Pending Governance Approval</p>
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-900 text-xxs">
                        <span className="font-bold">Drafted Findings:</span>
                        <p className="mt-1 font-mono">{selectedGrievance.responseDraft}</p>
                        <p className="mt-2 text-slate-500">Drafted by: <span className="font-semibold text-slate-700">{selectedGrievance.assignedOfficerName}</span></p>
                      </div>

                      {selectedGrievance.assignedOfficerId === user.id ? (
                        <p className="text-xxs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                          🔒 Security Override: Separation of duties restricts you from approving your own drafted grievance resolution. Another officer must approve.
                        </p>
                      ) : (
                        <button
                          onClick={async () => {
                            try {
                              await StudentSupportService.approveGrievanceResponse(tenantId, selectedGrievance.id, selectedGrievance.responseDraft, user);
                              await loadWorkspaceData();
                              alert('Grievance resolved and response published successfully.');
                              setSelectedGrievance(null);
                            } catch (err) {
                              alert((err as Error).message);
                            }
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-sm"
                        >
                          Approve and Publish Resolution
                        </button>
                      )}
                    </div>
                  )}

                  {selectedGrievance.status === 'RESOLVED' && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 text-xxs">
                      <p className="font-bold text-emerald-800">Grievance Resolved</p>
                      <p className="text-slate-700">{selectedGrievance.resolution}</p>
                      <p className="text-slate-500 mt-1">Approved by: {selectedGrievance.closedByEmail}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Select a grievance from the list to manage its investigation and resolution lifecycle.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 13. SAFEGUARDING PORTAL */}
      {activeTab === 'safeguarding' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Child Safeguarding Portal</h3>
              <p className="text-xs text-slate-500 text-rose-600 font-semibold">🔒 Highly Sensitive Information. Strict access audit logs activated.</p>
            </div>
            <button
              onClick={() => setShowSafeguardingModal(true)}
              className="px-3.5 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-rose-300" /> Log Safeguarding Concern
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {safeguardingCases.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                  No logged safeguarding cases.
                </div>
              ) : (
                safeguardingCases.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSafeguarding(s)}
                    className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-sm space-y-3 hover:border-slate-400 ${
                      selectedSafeguarding?.id === s.id ? 'border-rose-900 ring-1 ring-rose-900' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xxs font-bold uppercase px-2 py-0.5 bg-rose-950 text-rose-200 rounded-md">
                          Severity: {s.severity}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">Student: {s.studentName}</h4>
                        <p className="text-xs text-slate-500">Officer: {s.designatedSafeguardingOfficerName}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xxs font-bold rounded-md ${
                        s.status === 'CLOSED' ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Action Plan:</span> {s.actionPlan}
                    </p>

                    <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Logged: {new Date(s.openedDate).toLocaleDateString()}</span>
                      <span className="text-rose-700 font-semibold">🔒 Protected Access</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Safe detail panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-rose-950 border-b border-slate-100 pb-2">Sensitive Case Information</h4>
              {selectedSafeguarding ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400">Student:</span>
                    <p className="text-slate-900 font-semibold">{selectedSafeguarding.studentName}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400">Action Plan:</span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                      {selectedSafeguarding.actionPlan}
                    </p>
                  </div>

                  {/* Strictly protected notes */}
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                      <Lock className="w-3.5 h-3.5 text-rose-700" />
                      Protected Case Notes
                    </div>
                    <p className="text-slate-700 leading-relaxed italic bg-white/70 p-2 rounded-lg border border-rose-100 mt-1">
                      {selectedSafeguarding.protectedCaseNotes || 'No restricted notes entered.'}
                    </p>
                  </div>

                  {selectedSafeguarding.status !== 'CLOSED' && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        onClick={async () => {
                          try {
                            await StudentSupportService.transitionCase(tenantId, selectedSafeguarding.id, 'CLOSED', 'Formally closed by safeguarding officer', user);
                            await loadWorkspaceData();
                            alert('Safeguarding case formally closed with appropriate regulatory logs.');
                            setSelectedSafeguarding(null);
                          } catch (err) {
                            alert((err as Error).message);
                          }
                        }}
                        className="w-full py-2 bg-rose-950 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      >
                        Formally Close Case
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Select a safeguarding case to view sensitive notes and actions safely.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE WELFARE MODAL */}
      {showWelfareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Welfare Intervention Case</h3>
              <button onClick={() => setShowWelfareModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWelfare} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={welfareForm.studentId}
                  onChange={e => setWelfareForm({ ...welfareForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Support Type</label>
                <select
                  value={welfareForm.type}
                  onChange={e => setWelfareForm({ ...welfareForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="Financial Aid Support">Financial Aid Support</option>
                  <option value="Nutritional & Meals Support">Nutritional & Meals Support</option>
                  <option value="Housing & Boarding Assistance">Housing & Boarding Assistance</option>
                  <option value="Uniform & Study Materials Support">Uniform & Study Materials Support</option>
                  <option value="Community & Social Care Service">Community & Social Care Service</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={welfareForm.startDate}
                    onChange={e => setWelfareForm({ ...welfareForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target End Date</label>
                  <input
                    type="date"
                    required
                    value={welfareForm.targetEndDate}
                    onChange={e => setWelfareForm({ ...welfareForm, targetEndDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Needs Statement</label>
                <textarea
                  required
                  rows={3}
                  value={welfareForm.description}
                  onChange={e => setWelfareForm({ ...welfareForm, description: e.target.value })}
                  placeholder="Elaborate on the student's background welfare requirements..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWelfareModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GRIEVANCE MODAL */}
      {showGrievanceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">File Formal Grievance Complaint</h3>
              <button onClick={() => setShowGrievanceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrievance} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complainant Name</label>
                  <input
                    type="text"
                    required
                    value={grievanceForm.complainantName}
                    onChange={e => setGrievanceForm({ ...grievanceForm, complainantName: e.target.value })}
                    placeholder="Enter full name..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complainant Type</label>
                  <select
                    value={grievanceForm.complainantType}
                    onChange={e => setGrievanceForm({ ...grievanceForm, complainantType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="GUARDIAN">Guardian / Parent</option>
                    <option value="STAFF">Staff / Instructor</option>
                    <option value="OTHER">Other External Person</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={grievanceForm.category}
                    onChange={e => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="Academic Assessment Grievance">Academic Assessment Grievance</option>
                    <option value="Conduct & Discipline Grievance">Conduct & Discipline Grievance</option>
                    <option value="Facilities & Safety Complaint">Facilities & Safety Complaint</option>
                    <option value="Discrimination / Harassment Report">Discrimination / Harassment Report</option>
                    <option value="Fee & Billing Discrepancy">Fee & Billing Discrepancy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={grievanceForm.priority}
                    onChange={e => setGrievanceForm({ ...grievanceForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Grievance Statement</label>
                <textarea
                  required
                  rows={4}
                  value={grievanceForm.description}
                  onChange={e => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                  placeholder="Describe the complaint in detail, with dates, references, and facts..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrievanceModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SAFEGUARDING MODAL */}
      {showSafeguardingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Sensitive Safeguarding Case</h3>
              <button onClick={() => setShowSafeguardingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSafeguarding} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={safeguardingForm.studentId}
                  onChange={e => setSafeguardingForm({ ...safeguardingForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity Tier</label>
                <select
                  value={safeguardingForm.severity}
                  onChange={e => setSafeguardingForm({ ...safeguardingForm, severity: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                  <option value="CRITICAL">Critical Safeguarding Emergency</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Immediate Action Plan</label>
                <input
                  type="text"
                  required
                  value={safeguardingForm.actionPlan}
                  onChange={e => setSafeguardingForm({ ...safeguardingForm, actionPlan: e.target.value })}
                  placeholder="e.g. Relocate student to welfare block, separate contact from source"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">🔒 Highly Restricted Case Notes (Encrypted-at-rest equivalent)</label>
                <textarea
                  required
                  rows={4}
                  value={safeguardingForm.protectedCaseNotes}
                  onChange={e => setSafeguardingForm({ ...safeguardingForm, protectedCaseNotes: e.target.value })}
                  placeholder="These notes are restricted strictly to designated officers and auditable administrators only."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSafeguardingModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-950 text-white rounded-xl font-medium"
                >
                  Log Secure Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CASE MODAL */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Student Support Case</h3>
              <button onClick={() => setShowCaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={caseForm.studentId}
                  onChange={e => setCaseForm({ ...caseForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={caseForm.category}
                    onChange={e => setCaseForm({ ...caseForm, category: e.target.value as SupportCaseCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="ACADEMIC">Academic</option>
                    <option value="BEHAVIOURAL">Behavioural</option>
                    <option value="HEALTH">Health</option>
                    <option value="COUNSELLING">Counselling</option>
                    <option value="SAFEGUARDING">Safeguarding</option>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={caseForm.priority}
                    onChange={e => setCaseForm({ ...caseForm, priority: e.target.value as SupportCasePriority })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                  >
                    <option value="EMERGENCY">Emergency (4h SLA)</option>
                    <option value="URGENT">Urgent (24h SLA)</option>
                    <option value="HIGH">High (48h SLA)</option>
                    <option value="NORMAL">Normal (7d SLA)</option>
                    <option value="LOW">Low (14d SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confidentiality Level</label>
                <select
                  value={caseForm.confidentialityLevel}
                  onChange={e => setCaseForm({ ...caseForm, confidentialityLevel: e.target.value as ConfidentialityLevel })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                >
                  <option value="STANDARD">Standard (Support Staff)</option>
                  <option value="RESTRICTED">Restricted (Medical/Counsellors)</option>
                  <option value="CONFIDENTIAL">Confidential (Assigned Specialist)</option>
                  <option value="HIGHLY_CONFIDENTIAL">Highly Confidential (Safeguarding/Doctor)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Summary / Main Concern</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of support requirement..."
                  value={caseForm.summary}
                  onChange={e => setCaseForm({ ...caseForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Notes</label>
                <textarea
                  rows={3}
                  placeholder="Detailed observations and background..."
                  value={caseForm.notes}
                  onChange={e => setCaseForm({ ...caseForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCaseModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-sm"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEALTH ENCOUNTER MODAL */}
      {showHealthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Health Encounter</h3>
              <button onClick={() => setShowHealthModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHealthEncounter} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  required
                  value={healthForm.studentId}
                  onChange={e => setHealthForm({ ...healthForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={healthForm.encounterType}
                    onChange={e => setHealthForm({ ...healthForm, encounterType: e.target.value as HealthEncounterType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="ROUTINE_CHECK">Routine Checkup</option>
                    <option value="MINOR_ILLNESS">Minor Illness</option>
                    <option value="FIRST_AID">First Aid</option>
                    <option value="WELLNESS_CHECK">Wellness Check</option>
                    <option value="MEDICATION_ADMINISTRATION">Medication Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={healthForm.temp}
                    onChange={e => setHealthForm({ ...healthForm, temp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observations</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nurse / staff observation details..."
                  value={healthForm.observations}
                  onChange={e => setHealthForm({ ...healthForm, observations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Actions Taken</label>
                <input
                  type="text"
                  placeholder="Rest, hydration, ice pack..."
                  value={healthForm.actionsTaken}
                  onChange={e => setHealthForm({ ...healthForm, actionsTaken: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHealthModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
                >
                  Log Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY OVERRIDE MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border-2 border-amber-400">
            <div className="flex items-center gap-2 text-amber-600 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Emergency Support Authorization Override</h3>
            </div>

            <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              Granting emergency override bypasses standard confidentiality constraints to provide immediate medical/emergency response access. <strong>All actions are logged in the immutable security audit ledger.</strong>
            </p>

            <form onSubmit={handleGrantOverride} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student</label>
                <select
                  required
                  value={overrideForm.studentId}
                  onChange={e => setOverrideForm({ ...overrideForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Authorized Emergency Reason</label>
                <textarea
                  required
                  rows={3}
                  value={overrideForm.reason}
                  onChange={e => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-md"
                >
                  Grant Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CASE DETAIL DRAWER / MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
                  {selectedCase.caseNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedCase.summary}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
              <div>Student: <span className="font-bold text-slate-900">{selectedCase.studentName}</span></div>
              <div>Priority: <span className="font-bold text-rose-600">{selectedCase.priority}</span></div>
              <div>Category: <span className="font-semibold text-slate-700">{selectedCase.category}</span></div>
              <div>Status: <span className="font-bold text-indigo-700">{selectedCase.status}</span></div>
              <div>Opened: <span className="text-slate-600">{new Date(selectedCase.openedDate).toLocaleDateString()}</span></div>
              <div>Target SLA: <span className="font-semibold text-slate-800">{new Date(selectedCase.targetFollowUpDate).toLocaleDateString()}</span></div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-700">Detailed Notes:</p>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedCase.notes || 'No notes added.'}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="flex gap-2">
                {selectedCase.status !== 'RESOLVED' && (
                  <button
                    onClick={async () => {
                      await StudentSupportService.resolveCase(tenantId, selectedCase.id, 'Issue resolved after support intervention', user);
                      setSelectedCase(null);
                      await loadWorkspaceData();
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedCase.status !== 'CLOSED' && (
                  <button
                    onClick={async () => {
                      await StudentSupportService.closeCase(tenantId, selectedCase.id, 'Case closed', user);
                      setSelectedCase(null);
                      await loadWorkspaceData();
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold"
                  >
                    Close Case
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
