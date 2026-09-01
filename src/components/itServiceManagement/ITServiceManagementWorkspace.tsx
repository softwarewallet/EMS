import React, { useState, useEffect } from 'react';
import {
  ITServiceDefinition,
  ServiceVersion,
  ITSMServiceDependency,
  ServiceLevelAgreement,
  ServiceLevelMeasurement,
  ITIncident,
  IncidentClassification,
  ITSMIncidentTimelineEvent,
  MajorIncident,
  ServiceRequest,
  RequestApproval,
  ITProblem,
  RootCauseAnalysis,
  ITChangeRequest,
  ChangeApproval,
  ChangeImplementation,
  ITRelease,
  DeploymentRecord,
  ITSMServiceHealthSnapshot,
  ServiceRecoveryExercise,
  ServiceGovernanceReview,
  ITSMDataQualityIssue
} from '../../types/itServiceManagement';
import { ITServiceManagementService, safeRound, safeDivide } from '../../services/itServiceManagementService';
import { FirebaseService } from '../../services/firebaseService';
import { AuditService } from '../../services/auditService';
import {
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileText,
  Filter,
  Layers,
  ListFilter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sliders,
  TrendingUp,
  UserCheck,
  Zap,
  Check,
  X,
  Play,
  Heart,
  Calendar,
  AlertOctagon,
  Award
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type ActiveSection = 'portfolio' | 'slas' | 'incidents' | 'requests' | 'problems' | 'changes' | 'releases' | 'resilience' | 'governance';

export const ITServiceManagementWorkspace: React.FC = () => {
  // Navigation
  const [activeSection, setActiveSection] = useState<ActiveSection>('portfolio');
  const [activeSubTab, setActiveSubTab] = useState<string>('services');

  // Tenant Boundary & Mock Logged In User
  const tenantId = 'TEN-EMS-CORE';
  const currentUser = {
    userId: 'staff_alistair_vance',
    email: 'alistair.vance@ems-core.edu',
    name: 'Alistair Vance (ITSM Director)'
  };

  // State Management
  const [services, setServices] = useState<ITServiceDefinition[]>([]);
  const [selectedService, setSelectedService] = useState<ITServiceDefinition | null>(null);
  const [serviceVersions, setServiceVersions] = useState<ServiceVersion[]>([]);
  const [dependencies, setDependencies] = useState<ITSMServiceDependency[]>([]);
  const [slas, setSlas] = useState<ServiceLevelAgreement[]>([]);
  const [slaMeasurements, setSlaMeasurements] = useState<ServiceLevelMeasurement[]>([]);
  
  const [incidents, setIncidents] = useState<ITIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<ITIncident | null>(null);
  const [incidentEvents, setIncidentEvents] = useState<ITSMIncidentTimelineEvent[]>([]);
  const [majorIncidents, setMajorIncidents] = useState<MajorIncident[]>([]);

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestApprovals, setRequestApprovals] = useState<RequestApproval[]>([]);

  const [problems, setProblems] = useState<ITProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<ITProblem | null>(null);
  const [rcas, setRcas] = useState<RootCauseAnalysis[]>([]);

  const [changes, setChanges] = useState<ITChangeRequest[]>([]);
  const [selectedChange, setSelectedChange] = useState<ITChangeRequest | null>(null);
  const [changeApprovals, setChangeApprovals] = useState<ChangeApproval[]>([]);
  const [changeImplementations, setChangeImplementations] = useState<ChangeImplementation[]>([]);

  const [releases, setReleases] = useState<ITRelease[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<ITRelease | null>(null);
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);

  const [healthSnapshots, setHealthSnapshots] = useState<ITSMServiceHealthSnapshot[]>([]);
  const [drExercises, setDrExercises] = useState<ServiceRecoveryExercise[]>([]);

  const [governanceReviews, setGovernanceReviews] = useState<ServiceGovernanceReview[]>([]);
  const [dataQualityIssues, setDataQualityIssues] = useState<ITSMDataQualityIssue[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Page level Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal / Form trigger states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [showReleaseForm, setShowReleaseForm] = useState(false);
  const [showRcaForm, setShowRcaForm] = useState(false);

  // --- Form Input States ---
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    code: '',
    version: '1.0.0',
    criticality: 'BUSINESS_CRITICAL' as ITServiceDefinition['criticality'],
    ownerId: 'staff_alistair_vance',
    businessOwnerId: 'staff_evelyn_martinez',
    technicalOwnerId: 'staff_david_karr',
    serviceHours: '24x7 Support',
    campusIds: ['CAMP-MAIN'],
    securityClassification: 'RESTRICTED' as ITServiceDefinition['securityClassification'],
    continuityClassification: 'MISSION_CRITICAL' as ITServiceDefinition['continuityClassification']
  });

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    serviceId: '',
    classification: 'security' as IncidentClassification,
    impact: 2 as 1|2|3|4,
    urgency: 2 as 1|2|3|4,
    campusId: 'CAMP-MAIN'
  });

  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    serviceId: '',
    severity: 'HIGH' as any,
    incidentIds: [] as string[]
  });

  const [newRca, setNewRca] = useState({
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    why5: '',
    rootCause: '',
    correctiveAction: ''
  });

  const [newChange, setNewChange] = useState({
    title: '',
    description: '',
    serviceId: '',
    type: 'normal' as 'standard' | 'normal' | 'emergency',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
    justification: '',
    implementationPlan: '',
    rollbackPlan: ''
  });

  const [newRelease, setNewRelease] = useState({
    name: '',
    description: '',
    changeRequestId: '',
    scope: '',
    plannedDeployDate: ''
  });

  // Load All Core Collections & Seed Mock Data if necessary
  useEffect(() => {
    loadWorkspaceData();
  }, [tenantId]);

  const loadWorkspaceData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Services
      let svcs = await FirebaseService.getTenantCollection<ITServiceDefinition>('itsm_services', tenantId);
      if (svcs.length === 0) {
        // Seed initial mock services to give a live functional experience immediately!
        const initialSrv: ITServiceDefinition = {
          id: 'srv_initial_001',
          tenantId,
          name: 'Institutional Identity & Single Sign-On (SSO)',
          description: 'Authoritative identity provider and authorization management system for all campuses.',
          code: 'ITS-SSO-001',
          category: 'infrastructure',
          version: '1.2.4',
          status: 'ACTIVE',
          criticality: 'MISSION_CRITICAL',
          ownerId: 'staff_alistair_vance',
          businessOwnerId: 'staff_evelyn_martinez',
          technicalOwnerId: 'staff_david_karr',
          supportModel: '24/7 Service Desk',
          serviceHours: '24/7/365 Tier-1 Support',
          campusIds: ['CAMP-MAIN', 'CAMP-NORTH'],
          securityClassification: 'RESTRICTED',
          continuityClassification: 'MISSION_CRITICAL',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'staff_alistair_vance',
          updatedBy: 'staff_alistair_vance'
        };
        const initialSrv2: ITServiceDefinition = {
          id: 'srv_initial_002',
          tenantId,
          name: 'Academic LMS Portal & Grading System',
          description: 'Web portal serving students and faculty for online courses and grades processing.',
          code: 'ITS-LMS-002',
          category: 'academic',
          version: '3.1.0',
          status: 'ACTIVE',
          criticality: 'BUSINESS_CRITICAL',
          ownerId: 'staff_alistair_vance',
          businessOwnerId: 'staff_evelyn_martinez',
          technicalOwnerId: 'staff_david_karr',
          supportModel: 'LMS Admin Team',
          serviceHours: '18/5 Operational Window',
          campusIds: ['CAMP-MAIN'],
          securityClassification: 'CONFIDENTIAL',
          continuityClassification: 'BUSINESS_CRITICAL',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'staff_alistair_vance',
          updatedBy: 'staff_alistair_vance'
        };
        await FirebaseService.setDocument('itsm_services', initialSrv.id, initialSrv);
        await FirebaseService.setDocument('itsm_services', initialSrv2.id, initialSrv2);
        svcs = [initialSrv, initialSrv2];
      }
      setServices(svcs);
      if (svcs.length > 0) setSelectedService(svcs[0]);

      // 2. Fetch Incidents
      let incs = await FirebaseService.getTenantCollection<ITIncident>('itsm_incidents', tenantId);
      if (incs.length === 0) {
        // Seed initial incident
        const mockInc: ITIncident = {
          id: 'inc_initial_001',
          tenantId,
          campusId: 'CAMP-MAIN',
          title: 'SSO LDAP Active Directory Service Outage',
          description: 'Students and administrators are experiencing token generation failures.',
          serviceId: 'srv_initial_001',
          classification: 'security',
          impact: 3,
          urgency: 4,
          priority: 'P1',
          status: 'IN_PROGRESS',
          reporterId: 'staff_evelyn_martinez',
          rcaRequired: true,
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
          updatedAt: new Date().toISOString(),
          createdBy: 'staff_evelyn_martinez',
          updatedBy: 'staff_david_karr',
          assignedToStaffId: 'staff_david_karr',
          assignedToTeamId: 'Infrastructure Ops'
        };
        await FirebaseService.setDocument('itsm_incidents', mockInc.id, mockInc);
        incs = [mockInc];
      }
      setIncidents(incs);
      if (incs.length > 0) setSelectedIncident(incs[0]);

      // 3. Fetch SLA Commitments & measurements
      let slaList = await FirebaseService.getTenantCollection<ServiceLevelAgreement>('itsm_slas', tenantId);
      if (slaList.length === 0) {
        const mockSLA: ServiceLevelAgreement = {
          id: 'sla_001',
          name: 'Single Sign-On Service Level Commitment',
          description: 'SLA rules for Identity Provider, guaranteeing high availability and rapid response.',
          serviceHours: '24/7/365',
          responseSlaMinutes: 15,
          resolutionSlaMinutes: 60,
          availabilitySlaPercentage: 99.9,
          status: 'active'
        };
        await FirebaseService.setDocument('itsm_slas', mockSLA.id, mockSLA);
        slaList = [mockSLA];
      }
      setSlas(slaList);

      const slaMs = await FirebaseService.getTenantCollection<ServiceLevelMeasurement>('itsm_sla_measurements', tenantId);
      setSlaMeasurements(slaMs.length > 0 ? slaMs : [
        { id: 'ms_1', tenantId, serviceId: 'srv_initial_001', month: '2026-08', actualAvailability: 99.95, slaBreachesCount: 0, complianceScore: 100 },
        { id: 'ms_2', tenantId, serviceId: 'srv_initial_002', month: '2026-08', actualAvailability: 99.50, slaBreachesCount: 1, complianceScore: 92.5 }
      ]);

      // 4. Fetch Problems, Requests, Changes, Releases, Quality scanner records
      const probs = await FirebaseService.getTenantCollection<ITProblem>('itsm_problems', tenantId);
      setProblems(probs);

      const reqs = await FirebaseService.getTenantCollection<ServiceRequest>('itsm_service_requests', tenantId);
      setRequests(reqs);

      const chgs = await FirebaseService.getTenantCollection<ITChangeRequest>('itsm_changes', tenantId);
      setChanges(chgs);

      const rels = await FirebaseService.getTenantCollection<ITRelease>('itsm_releases', tenantId);
      setReleases(rels);

      const qi = await FirebaseService.getTenantCollection<ITSMDataQualityIssue>('itsm_data_quality_issues', tenantId);
      setDataQualityIssues(qi);

      // Simple fetch for Audit logs
      const logs = await FirebaseService.getTenantCollection<any>('audit_logs', tenantId);
      setAuditLogs(logs.slice(0, 30));

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load IT Service Management registry.');
    } finally {
      setLoading(false);
    }
  };

  // Toast triggers
  const showToast = (success: string | null, error: string | null = null) => {
    if (success) {
      setSuccessMsg(success);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
    if (error) {
      setErrorMsg(error);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  // --- Handlers & Consequential Mutations ---

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await ITServiceManagementService.createService({
        tenantId,
        name: newService.name,
        description: newService.description,
        code: newService.code,
        category: 'infrastructure',
        version: newService.version,
        criticality: newService.criticality,
        ownerId: newService.ownerId,
        businessOwnerId: newService.businessOwnerId,
        technicalOwnerId: newService.technicalOwnerId,
        supportModel: 'Internal Core IT Support',
        serviceHours: newService.serviceHours,
        campusIds: newService.campusIds,
        securityClassification: newService.securityClassification,
        continuityClassification: newService.continuityClassification,
        createdBy: currentUser.userId,
        updatedBy: currentUser.userId
      }, currentUser);

      setShowServiceForm(false);
      showToast(`Service "${created.name}" created successfully as DRAFT.`);
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleSubmitServiceForReview = async (serviceId: string) => {
    try {
      await ITServiceManagementService.submitService(serviceId, currentUser);
      showToast('Service submitted for governance review.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleApproveService = async (serviceId: string) => {
    try {
      await ITServiceManagementService.approveService(serviceId, currentUser);
      showToast('Service definition approved successfully.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleActivateService = async (serviceId: string) => {
    try {
      await ITServiceManagementService.activateService(serviceId, currentUser);
      showToast('Service status changed to ACTIVE.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inc = await ITServiceManagementService.createIncident({
        tenantId,
        campusId: newIncident.campusId,
        title: newIncident.title,
        description: newIncident.description,
        serviceId: newIncident.serviceId,
        classification: newIncident.classification,
        impact: newIncident.impact,
        urgency: newIncident.urgency,
        reporterId: currentUser.userId,
        rcaRequired: newIncident.impact === 4,
        createdBy: currentUser.userId,
        updatedBy: currentUser.userId
      }, currentUser);

      setShowIncidentForm(false);
      showToast(`Incident ticket logged. System calculated Priority: ${inc.priority}`);
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleAssignIncident = async (incidentId: string) => {
    try {
      await ITServiceManagementService.assignIncident(incidentId, 'staff_alistair_vance', 'Service Desk Core', currentUser);
      showToast('Incident assigned to Alistair Vance.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleEscalateIncident = async (incidentId: string) => {
    try {
      await ITServiceManagementService.escalateIncident(incidentId, 'managerial', 'Incident breach threshold imminent.', currentUser);
      showToast('Managerial escalation initiated. Ticket priority escalated.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleResolveIncident = async (incidentId: string) => {
    try {
      await ITServiceManagementService.resolveIncident(incidentId, 'Resolved via Active Directory domain controller sync and LDAP connection reset.', currentUser);
      showToast('Incident resolved successfully.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleVerifyClosure = async (incidentId: string) => {
    try {
      await ITServiceManagementService.verifyIncidentClosure(incidentId, 'User validated log-in across North and Main campus campuses successfully.', currentUser);
      showToast('Closure verified. Incident marked CLOSED.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleDeclareMajorIncident = async (incidentId: string) => {
    try {
      await ITServiceManagementService.declareMajorIncident(incidentId, 'staff_alistair_vance', 'Enterprise Identity Outage affecting thousands of clients.', currentUser);
      showToast('MAJOR INCIDENT COMMAND ACTIVATED. Draft Post-Incident review initialized.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prob = await ITServiceManagementService.createProblem({
        tenantId,
        title: newProblem.title,
        description: newProblem.description,
        serviceId: newProblem.serviceId,
        priority: newProblem.severity.toLowerCase() as 'high' | 'medium' | 'low',
        affectedIncidentIds: newProblem.incidentIds,
        createdBy: currentUser.userId
      }, currentUser);

      setShowProblemForm(false);
      showToast(`Problem record ${prob.id} created.`);
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handlePerformRca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;
    try {
      const rca = await ITServiceManagementService.performRCA({
        problemId: selectedProblem.id,
        causalAnalysisType: '5_whys',
        fiveWhys: [newRca.why1, newRca.why2, newRca.why3, newRca.why4, newRca.why5].filter(Boolean),
        conclusion: newRca.rootCause,
        preventiveActions: [newRca.correctiveAction].filter(Boolean)
      }, currentUser);

      setShowRcaForm(false);
      showToast('Root Cause Analysis completed. Problem record transitioned to ROOT_CAUSE_CONFIRMED.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleCreateChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const chg = await ITServiceManagementService.createChange({
        tenantId,
        campusId: 'CAMP-MAIN',
        title: newChange.title,
        description: newChange.description,
        serviceId: newChange.serviceId,
        type: newChange.type,
        riskLevel: newChange.riskLevel,
        justification: newChange.justification,
        affectedServices: [newChange.serviceId],
        implementationPlan: newChange.implementationPlan || 'Standard implementation steps.',
        validationPlan: 'Post-implementation verification.',
        rollbackPlan: newChange.rollbackPlan || 'Standard rollback steps.',
        requesterId: currentUser.userId,
        approverIds: [],
        createdBy: currentUser.userId
      }, currentUser);

      setShowChangeForm(false);
      showToast(`Change request ${chg.id} registered as DRAFT.`);
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleAssessChange = async (changeId: string) => {
    try {
      await ITServiceManagementService.assessChange(changeId, currentUser.userId, '2026-09-01T02:00:00Z', '2026-09-01T04:00:00Z');
      showToast('Change assessment completed. Change status changed to CAB_REVIEW.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleApproveChange = async (changeId: string) => {
    try {
      await ITServiceManagementService.approveChange(changeId, 'Validated deployment scripts and fallback rollback mechanism.', currentUser);
      showToast('CAB Approval granted for Change Request.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    }
  };

  const handleExecuteDataQualityScan = async () => {
    setLoading(true);
    try {
      await ITServiceManagementService.runITSMDataQualityScan(tenantId, currentUser);
      showToast('ITSM Registry Scan completed. Actionable data quality items identified.');
      loadWorkspaceData();
    } catch (err: any) {
      showToast(null, err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Analytical Calculations (Server-side derived metrics) ---
  const incidentPriorityDistribution = [
    { name: 'P1 - Critical', value: incidents.filter(i => i.priority === 'P1').length, color: '#DC2626' },
    { name: 'P2 - High', value: incidents.filter(i => i.priority === 'P2').length, color: '#EA580C' },
    { name: 'P3 - Moderate', value: incidents.filter(i => i.priority === 'P3').length, color: '#D97706' },
    { name: 'P4 - Low', value: incidents.filter(i => i.priority === 'P4').length, color: '#2563EB' }
  ];

  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const openIncidents = totalIncidents - resolvedIncidents;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2A29] font-sans antialiased p-6 pb-24">
      
      {/* 1. Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E5E4E2] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#8C2D19] text-white rounded-lg">
              <Server className="w-6 h-6" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#1C1A17]" id="itsm-title">
              EMS Phase 7.44 — IT Service Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#706E6B] max-w-3xl">
            Institutional Digital Operations, Service Delivery Assurance, Incident Response Control, CAB Oversight, & Resilience Governance.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={handleExecuteDataQualityScan}
            className="flex items-center gap-2 px-4 py-2 bg-[#FAF9F6] border border-[#E5E4E2] rounded-lg text-sm font-semibold hover:bg-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Run Quality Scan
          </button>
          <button
            onClick={() => setShowServiceForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8C2D19] text-white rounded-lg text-sm font-semibold hover:bg-[#722313] transition"
          >
            <Plus className="w-4 h-4" />
            Register IT Service
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* 2. Global Sections Selector */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E4E2] pb-px mb-6">
        {[
          { id: 'portfolio', label: 'Service Portfolio & Catalog', icon: Layers },
          { id: 'slas', label: 'Service Level (SLAs)', icon: Clock },
          { id: 'incidents', label: 'Operations & Incidents', icon: AlertTriangle },
          { id: 'requests', label: 'Service Request Desk', icon: Database },
          { id: 'problems', label: 'Problem Resolution & RCA', icon: Sliders },
          { id: 'changes', label: 'Change Control (CAB)', icon: Shield },
          { id: 'releases', label: 'Release & Deployments', icon: Zap },
          { id: 'resilience', label: 'Service Health & DR', icon: Heart },
          { id: 'governance', label: 'Governance & Quality', icon: Award }
        ].map(sect => {
          const IconComp = sect.icon;
          const isActive = activeSection === sect.id;
          return (
            <button
              key={sect.id}
              onClick={() => {
                setActiveSection(sect.id as any);
                if (sect.id === 'portfolio') setActiveSubTab('services');
                else if (sect.id === 'incidents') setActiveSubTab('active_incidents');
                else if (sect.id === 'governance') setActiveSubTab('scanner');
              }}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold text-sm transition ${
                isActive
                  ? 'border-[#8C2D19] text-[#8C2D19]'
                  : 'border-transparent text-[#706E6B] hover:text-[#2C2A29]'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {sect.label}
            </button>
          );
        })}
      </div>

      {/* 3. Sub Tab and Working View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar / Secondary Sub-Navigation */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-[#E5E4E2]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#706E6B] mb-3">
            Module Options
          </h3>
          <div className="flex flex-col gap-1">
            {activeSection === 'portfolio' && (
              <>
                <button
                  onClick={() => setActiveSubTab('services')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'services' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  IT Services List
                </button>
                <button
                  onClick={() => setActiveSubTab('history')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'history' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  Version Logs
                </button>
              </>
            )}

            {activeSection === 'incidents' && (
              <>
                <button
                  onClick={() => setActiveSubTab('active_incidents')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'active_incidents' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  Operational Incidents
                </button>
                <button
                  onClick={() => setActiveSubTab('major_command')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'major_command' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  Major Incident Command
                </button>
              </>
            )}

            {activeSection === 'governance' && (
              <>
                <button
                  onClick={() => setActiveSubTab('scanner')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'scanner' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  Data Quality Issues ({dataQualityIssues.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('audits')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${activeSubTab === 'audits' ? 'bg-[#F4F3EF] text-[#8C2D19]' : 'text-[#706E6B] hover:bg-neutral-50'}`}
                >
                  Immutable Auditing Event Logs
                </button>
              </>
            )}

            {!['portfolio', 'incidents', 'governance'].includes(activeSection) && (
              <p className="text-xs text-[#706E6B] italic">Core dashboard views active.</p>
            )}
          </div>

          <div className="mt-8 border-t border-[#E5E4E2] pt-6">
            <h4 className="text-xs font-bold text-[#1C1A17] uppercase tracking-wider mb-2">Metrics Snapshot</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#706E6B]">Overall Service Health</p>
                <p className="text-xl font-bold text-emerald-600">99.85%</p>
              </div>
              <div>
                <p className="text-xs text-[#706E6B]">Active Incidents</p>
                <p className="text-xl font-bold text-rose-600">{openIncidents}</p>
              </div>
              <div>
                <p className="text-xs text-[#706E6B]">Change Success Rate</p>
                <p className="text-xl font-bold text-[#8C2D19]">98.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Primary View Workspace */}
        <div className="lg:col-span-3">
          
          {/* ========================================== */}
          {/* SECTION 1: PORTFOLIO & CATALOG */}
          {/* ========================================== */}
          {activeSection === 'portfolio' && (
            <div className="space-y-6">
              {activeSubTab === 'services' && (
                <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#1C1A17]">IT Services Registry</h2>
                    <span className="text-xs font-semibold text-[#706E6B]">{services.length} items registered</span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {services.map(srv => {
                      const isSelected = selectedService?.id === srv.id;
                      return (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedService(srv)}
                          className={`p-4 rounded-lg cursor-pointer transition ${isSelected ? 'bg-[#F4F3EF] border border-[#E5E4E2]' : 'hover:bg-neutral-50'}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-[#1C1A17]">{srv.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              srv.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {srv.status}
                            </span>
                          </div>
                          <p className="text-sm text-[#706E6B] line-clamp-2">{srv.description}</p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#706E6B]">
                            <span><strong>Criticality:</strong> {srv.criticality}</span>
                            <span><strong>SSID:</strong> {srv.code}</span>
                            <span><strong>Service Hours:</strong> {srv.serviceHours}</span>
                          </div>

                          {/* Action panel inside service list */}
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-[#E5E4E2] flex gap-2">
                              {srv.status === 'DRAFT' && (
                                <button
                                  onClick={() => handleSubmitServiceForReview(srv.id)}
                                  className="px-3 py-1 bg-[#8C2D19] text-white rounded text-xs font-semibold hover:bg-[#722313]"
                                >
                                  Submit for Review
                                </button>
                              )}
                              {srv.status === 'UNDER_REVIEW' && (
                                <button
                                  onClick={() => handleApproveService(srv.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                                >
                                  Approve Service
                                </button>
                              )}
                              {srv.status === 'APPROVED' && (
                                <button
                                  onClick={() => handleActivateService(srv.id)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                                >
                                  Activate Service
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 2: SERVICE LEVEL COMMITMENTS */}
          {/* ========================================== */}
          {activeSection === 'slas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                <h2 className="text-lg font-bold text-[#1C1A17] mb-4">SLA Commitment Standards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {slas.map(sla => {
                    const svc = services.find(s => s.id === sla.serviceId);
                    return (
                      <div key={sla.id} className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E5E4E2]">
                        <h3 className="font-bold text-sm text-[#1C1A17] truncate">{svc?.name || 'Unknown Service'}</h3>
                        <div className="mt-3 space-y-2 text-xs">
                          <p><strong>Availability Goal:</strong> {sla.targetAvailability}%</p>
                          <p><strong>P1 Max Resolve:</strong> {sla.incidentP1ResolveMinutes} mins</p>
                          <p><strong>P2 Max Resolve:</strong> {sla.incidentP2ResolveMinutes} mins</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                <h3 className="text-md font-bold mb-4 text-[#1C1A17]">Monthly Compliance (Derived Analytics)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slaMeasurements}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="complianceScore" fill="#8C2D19" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 3: OPERATIONS & INCIDENTS */}
          {/* ========================================== */}
          {activeSection === 'incidents' && (
            <div className="space-y-6">
              {activeSubTab === 'active_incidents' && (
                <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-[#1C1A17]">Incident Response Center</h2>
                    <button
                      onClick={() => setShowIncidentForm(true)}
                      className="px-3 py-1.5 bg-[#8C2D19] text-white rounded-lg text-xs font-semibold hover:bg-[#722313] transition"
                    >
                      Log Incident Ticket
                    </button>
                  </div>

                  <div className="space-y-4">
                    {incidents.map(inc => {
                      const svc = services.find(s => s.id === inc.serviceId);
                      return (
                        <div key={inc.id} className="p-4 bg-[#FAF9F6] border border-[#E5E4E2] rounded-lg">
                          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                            <div>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mr-2 ${
                                inc.priority === 'P1' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {inc.priority}
                              </span>
                              <span className="font-bold text-[#1C1A17]">{inc.title}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-semibold">
                              {inc.status}
                            </span>
                          </div>

                          <p className="text-sm text-[#706E6B] mb-3">{inc.description}</p>
                          <div className="flex flex-wrap justify-between items-center gap-4 text-xs text-[#706E6B]">
                            <p><strong>Service Impacted:</strong> {svc?.name || 'SSO Platform'}</p>
                            <p><strong>Assigned Agent:</strong> {inc.assignedToStaffId || 'Unassigned'}</p>
                          </div>

                          {/* Quick Actions Panel */}
                          <div className="mt-4 pt-3 border-t border-[#E5E4E2] flex flex-wrap gap-2">
                            {!inc.assignedToStaffId && (
                              <button
                                onClick={() => handleAssignIncident(inc.id)}
                                className="px-3 py-1 bg-neutral-100 text-[#1C1A17] border border-[#E5E4E2] rounded text-xs font-semibold hover:bg-neutral-200"
                              >
                                Self-Assign
                              </button>
                            )}
                            {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && (
                              <>
                                <button
                                  onClick={() => handleResolveIncident(inc.id)}
                                  className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                                >
                                  Apply Resolution
                                </button>
                                <button
                                  onClick={() => handleEscalateIncident(inc.id)}
                                  className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700"
                                >
                                  Escalate Ticket
                                </button>
                                {inc.priority !== 'P1' && (
                                  <button
                                    onClick={() => handleDeclareMajorIncident(inc.id)}
                                    className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-semibold hover:bg-rose-700"
                                  >
                                    Declare Major Outage
                                  </button>
                                )}
                              </>
                            )}
                            {inc.status === 'RESOLVED' && (
                              <button
                                onClick={() => handleVerifyClosure(inc.id)}
                                className="px-3 py-1 bg-[#8C2D19] text-white rounded text-xs font-semibold hover:bg-[#722313]"
                              >
                                Verify Closure
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 4: SERVICE REQUESTS */}
          {/* ========================================== */}
          {activeSection === 'requests' && (
            <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
              <h2 className="text-lg font-bold text-[#1C1A17] mb-4">Privileged Service Requests Desk</h2>
              <p className="text-sm text-[#706E6B] mb-6">
                Separation of Duties checks are enforced server-side. Users cannot self-approve requests requiring elevated access.
              </p>

              {requests.length === 0 ? (
                <div className="p-8 text-center text-[#706E6B] border border-dashed border-[#E5E4E2] rounded-lg">
                  No service requests registered.
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map(req => (
                    <div key={req.id} className="p-4 bg-[#FAF9F6] border border-[#E5E4E2] rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-[#1C1A17]">{req.id}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#706E6B]"><strong>Requester ID:</strong> {req.requesterId}</p>
                      <p className="text-xs text-[#706E6B]"><strong>Target System/Role:</strong> {req.justification}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 5: PROBLEM MANAGEMENT & RCA */}
          {/* ========================================== */}
          {activeSection === 'problems' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-[#1C1A17]">Problem Control Registry</h2>
                  <button
                    onClick={() => setShowProblemForm(true)}
                    className="px-3 py-1.5 bg-[#8C2D19] text-white rounded-lg text-xs font-semibold hover:bg-[#722313] transition"
                  >
                    Open Problem Ticket
                  </button>
                </div>

                {problems.length === 0 ? (
                  <div className="p-8 text-center text-[#706E6B] border border-dashed border-[#E5E4E2] rounded-lg">
                    No problem records created. Create a problem ticket to investigate recurrent incidents.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {problems.map(prob => (
                      <div
                        key={prob.id}
                        onClick={() => setSelectedProblem(prob)}
                        className={`p-4 rounded-lg cursor-pointer transition ${selectedProblem?.id === prob.id ? 'bg-[#F4F3EF] border border-[#E5E4E2]' : 'hover:bg-neutral-50'}`}
                      >
                        <h3 className="font-bold text-[#1C1A17]">{prob.title}</h3>
                        <p className="text-sm text-[#706E6B] mt-1">{prob.description}</p>
                        <div className="mt-3 flex gap-4 text-xs text-[#706E6B]">
                          <span><strong>Status:</strong> {prob.status}</span>
                          <span><strong>Linked Incidents:</strong> {prob.incidentIds.length}</span>
                        </div>

                        {selectedProblem?.id === prob.id && (
                          <div className="mt-4 pt-4 border-t border-[#E5E4E2] flex gap-2">
                            {!prob.rootCauseAnalysisId && (
                              <button
                                onClick={() => setShowRcaForm(true)}
                                className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700"
                              >
                                Conduct 5 Whys RCA
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 6: CHANGE CONTROL (CAB) */}
          {/* ========================================== */}
          {activeSection === 'changes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#1C1A17]">Change Advisory Board (CAB) Control</h2>
                    <p className="text-xs text-[#706E6B] mt-1">Governed pipeline for technical infrastructure adjustments.</p>
                  </div>
                  <button
                    onClick={() => setShowChangeForm(true)}
                    className="px-3 py-1.5 bg-[#8C2D19] text-white rounded-lg text-xs font-semibold hover:bg-[#722313] transition"
                  >
                    Request Change (RFC)
                  </button>
                </div>

                {changes.length === 0 ? (
                  <div className="p-8 text-center text-[#706E6B] border border-dashed border-[#E5E4E2] rounded-lg">
                    No change requests registered. Create an RFC to schedule network or system updates.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {changes.map(chg => (
                      <div key={chg.id} className="p-4 bg-[#FAF9F6] border border-[#E5E4E2] rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#8C2D19] mr-2">{chg.id}</span>
                            <span className="font-bold text-[#1C1A17]">{chg.title}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded text-xs font-semibold">
                            {chg.status}
                          </span>
                        </div>

                        <p className="text-sm text-[#706E6B] mb-3">{chg.description}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {chg.status === 'DRAFT' && (
                            <button
                              onClick={() => handleAssessChange(chg.id)}
                              className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700"
                            >
                              Run Conflict & Risk Assessment
                            </button>
                          )}
                          {chg.status === 'CAB_REVIEW' && (
                            <button
                              onClick={() => handleApproveChange(chg.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                            >
                              Grant CAB Approval
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 7: RELEASE & DEPLOYMENTS */}
          {/* ========================================== */}
          {activeSection === 'releases' && (
            <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
              <h2 className="text-lg font-bold text-[#1C1A17] mb-4">Release & Deployment Registry</h2>
              <p className="text-sm text-[#706E6B] mb-6">
                All production deployments are mapped strictly to authorized change window identifiers to guarantee release integrity.
              </p>

              {releases.length === 0 ? (
                <div className="p-8 text-center text-[#706E6B] border border-dashed border-[#E5E4E2] rounded-lg">
                  No releases planned. Map releases to approved changes.
                </div>
              ) : (
                <div className="space-y-4">
                  {releases.map(rel => (
                    <div key={rel.id} className="p-4 bg-[#FAF9F6] border border-[#E5E4E2] rounded-lg">
                      <h3 className="font-bold text-[#1C1A17]">{rel.name}</h3>
                      <p className="text-xs text-[#706E6B] mt-1"><strong>RFC Mapping:</strong> {rel.changeRequestId}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 8: RESILIENCE & DR EXERCISES */}
          {/* ========================================== */}
          {activeSection === 'resilience' && (
            <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
              <h2 className="text-lg font-bold text-[#1C1A17] mb-4">DR Continuity & Recovery Drills</h2>
              <p className="text-sm text-[#706E6B] mb-6">
                Periodic verification of Mean Time to Restore (MTTR) and recovery points to minimize institutional single-point failures.
              </p>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-800">
                <strong>Status Check:</strong> Active system backup validation completed successfully yesterday. Next mock fire-drill scheduled for CAMP-NORTH on Sept 15, 2026.
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SECTION 9: GOVERNANCE, QUALITY & AUDITING */}
          {/* ========================================== */}
          {activeSection === 'governance' && (
            <div className="space-y-6">
              {activeSubTab === 'scanner' && (
                <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-[#1C1A17]">Registry Integrity Scanner</h2>
                      <p className="text-xs text-[#706E6B] mt-1">Scans for architecture omissions, missing metadata, and SLA breaches.</p>
                    </div>
                    <button
                      onClick={handleExecuteDataQualityScan}
                      className="px-3 py-1.5 bg-[#8C2D19] text-white rounded-lg text-xs font-semibold hover:bg-[#722313] transition"
                    >
                      Trigger Scan Now
                    </button>
                  </div>

                  {dataQualityIssues.length === 0 ? (
                    <div className="p-8 text-center text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                      Pristine Health: No data quality issues found in the registry.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dataQualityIssues.map(issue => (
                        <div key={issue.id} className="p-4 bg-[#FAF9F6] border-l-4 border-amber-500 rounded-r-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-bold text-[#1C1A17]">{issue.ruleName}</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm text-[#706E6B]">{issue.details}</p>
                          <p className="text-xs text-emerald-700 mt-2"><strong>Remediation:</strong> {issue.remediationPlan}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSubTab === 'audits' && (
                <div className="bg-white rounded-xl border border-[#E5E4E2] p-6">
                  <h2 className="text-lg font-bold text-[#1C1A17] mb-6">Security & Systems Governance Audit</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#706E6B] border-collapse">
                      <thead>
                        <tr className="border-b border-[#E5E4E2] text-[#1C1A17] uppercase tracking-wider">
                          <th className="py-2">Event ID</th>
                          <th className="py-2">Actor</th>
                          <th className="py-2">Action</th>
                          <th className="py-2">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {auditLogs.map(log => (
                          <tr key={log.id}>
                            <td className="py-2 font-mono font-bold text-[#8C2D19]">{log.id}</td>
                            <td className="py-2">{log.userDisplayName}</td>
                            <td className="py-2 font-semibold text-[#1C1A17]">{log.action}</td>
                            <td className="py-2">{new Date(log.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL / POPUP FORMS */}
      {/* ========================================== */}

      {/* Service Registration Form */}
      {showServiceForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E5E4E2] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1A17]">Register IT Service</h3>
              <button onClick={() => setShowServiceForm(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Description</label>
                <textarea
                  required
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Service Code</label>
                  <input
                    type="text"
                    required
                    placeholder="ITS-SSO-001"
                    value={newService.code}
                    onChange={e => setNewService({ ...newService, code: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Criticality</label>
                  <select
                    value={newService.criticality}
                    onChange={e => setNewService({ ...newService, criticality: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowServiceForm(false)}
                  className="px-4 py-2 border border-[#E5E4E2] rounded-lg text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8C2D19] text-white rounded-lg text-sm font-semibold hover:bg-[#722313]"
                >
                  Create Service as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Form */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E5E4E2] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1A17]">Log Operational Incident</h3>
              <button onClick={() => setShowIncidentForm(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., LMS Portal Timing Out"
                  value={newIncident.title}
                  onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Details & Diagnostics</label>
                <textarea
                  required
                  value={newIncident.description}
                  onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Impact (1-4)</label>
                  <select
                    value={newIncident.impact}
                    onChange={e => setNewIncident({ ...newIncident, impact: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  >
                    <option value={1}>1 - Minor / Isolated</option>
                    <option value={2}>2 - Moderate / Departmental</option>
                    <option value={3}>3 - Serious / Multi-campus</option>
                    <option value={4}>4 - Disastrous / Institutional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Urgency (1-4)</label>
                  <select
                    value={newIncident.urgency}
                    onChange={e => setNewIncident({ ...newIncident, urgency: Number(e.target.value) as any })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  >
                    <option value={1}>1 - Low / Deferrable</option>
                    <option value={2}>2 - Medium / Workaround available</option>
                    <option value={3}>3 - High / Degraded service</option>
                    <option value={4}>4 - Critical / Hard down</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Affected IT Service</label>
                <select
                  required
                  value={newIncident.serviceId}
                  onChange={e => setNewIncident({ ...newIncident, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                >
                  <option value="">-- Choose Impacted Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowIncidentForm(false)}
                  className="px-4 py-2 border border-[#E5E4E2] rounded-lg text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8C2D19] text-white rounded-lg text-sm font-semibold hover:bg-[#722313]"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RCA Modal Form */}
      {showRcaForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E5E4E2] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1A17]">Conduct 5 Whys RCA</h3>
              <button onClick={() => setShowRcaForm(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handlePerformRca} className="space-y-4">
              <p className="text-xs text-[#706E6B]">Identify causal sequence iteratively to determine final systemic failure point.</p>
              
              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Why 1 (Primary Symptom)</label>
                <input
                  type="text" required
                  value={newRca.why1}
                  onChange={e => setNewRca({ ...newRca, why1: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Why 2</label>
                <input
                  type="text" required
                  value={newRca.why2}
                  onChange={e => setNewRca({ ...newRca, why2: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Why 3</label>
                <input
                  type="text" required
                  value={newRca.why3}
                  onChange={e => setNewRca({ ...newRca, why3: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Why 4</label>
                <input
                  type="text" required
                  value={newRca.why4}
                  onChange={e => setNewRca({ ...newRca, why4: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Why 5</label>
                <input
                  type="text" required
                  value={newRca.why5}
                  onChange={e => setNewRca({ ...newRca, why5: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Root Cause Determination</label>
                <textarea
                  required
                  value={newRca.rootCause}
                  onChange={e => setNewRca({ ...newRca, rootCause: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Corrective Remediation Action</label>
                <input
                  type="text" required
                  value={newRca.correctiveAction}
                  onChange={e => setNewRca({ ...newRca, correctiveAction: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRcaForm(false)}
                  className="px-4 py-2 border border-[#E5E4E2] rounded-lg text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8C2D19] text-white rounded-lg text-sm font-semibold hover:bg-[#722313]"
                >
                  Record RCA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RFC (Change Request) Form */}
      {showChangeForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E5E4E2] max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1C1A17]">Request for Change (RFC)</h3>
              <button onClick={() => setShowChangeForm(false)}>
                <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
              </button>
            </div>

            <form onSubmit={handleCreateChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Change Request Title</label>
                <input
                  type="text" required
                  placeholder="e.g., SSO Active Directory Patch Upgrade"
                  value={newChange.title}
                  onChange={e => setNewChange({ ...newChange, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Scope & Objective</label>
                <textarea
                  required
                  value={newChange.description}
                  onChange={e => setNewChange({ ...newChange, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Change Type</label>
                  <select
                    value={newChange.type}
                    onChange={e => setNewChange({ ...newChange, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  >
                    <option value="standard">Standard Change</option>
                    <option value="normal">Normal CAB-Reviewed Change</option>
                    <option value="emergency">Emergency Change</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Risk Level</label>
                  <select
                    value={newChange.riskLevel}
                    onChange={e => setNewChange({ ...newChange, riskLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Change Justification</label>
                <textarea
                  required
                  placeholder="Why is this change necessary?"
                  value={newChange.justification}
                  onChange={e => setNewChange({ ...newChange, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#706E6B] uppercase mb-1">Affected IT Service</label>
                <select
                  required
                  value={newChange.serviceId}
                  onChange={e => setNewChange({ ...newChange, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E4E2] rounded-lg text-sm"
                >
                  <option value="">-- Choose Affected Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangeForm(false)}
                  className="px-4 py-2 border border-[#E5E4E2] rounded-lg text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8C2D19] text-white rounded-lg text-sm font-semibold hover:bg-[#722313]"
                >
                  Submit RFC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
