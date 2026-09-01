import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Users,
  Bell,
  FileText,
  Layers,
  Activity,
  HardDrive,
  RefreshCw,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Plus,
  Compass,
  AlertTriangle,
  MapPin,
  Lock,
  GitBranch,
  Wrench,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  FileCode
} from 'lucide-react';
import { CrisisResilienceService, safePercentage, safeRound } from '../../services/crisisResilienceService';
import {
  CrisisEvent,
  CrisisEventSeverity,
  CrisisEventCategory,
  CrisisEventStatus,
  CrisisTimelineEvent,
  EOCActivation,
  CommandRole,
  CommandAssignment,
  EmergencyOverride,
  CriticalService,
  CriticalServiceDependency,
  DisasterRecoveryPlan,
  DisasterRecoveryActivation,
  EmergencyResourceAllocation,
  CampusClosure,
  ReentryAuthorization,
  SimulationRun,
  AfterActionReview,
  InstitutionalReadinessSnapshot,
  CrisisAuditEvent,
  CrisisDataQualityIssue,
  EmergencyCommunicationPriority,
  EmergencyCommunicationChannel,
  ServiceRecoveryPriority
} from '../../types/crisisResilience';
import { FirebaseService } from '../../services/firebaseService';

export function CrisisResilienceWorkspace() {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();

  const tenantId = currentTenant?.id || 'ALL';
  const actorId = currentUser?.uid || 'usr_admin';
  const actorName = currentUser?.displayName || 'Administrator';

  // Navigation Groupings
  const [activeTab, setActiveTab] = useState<'command_center' | 'response_ops' | 'systems_resilience' | 'drill_sandbox' | 'audit_governance'>('command_center');

  // Real data state
  const [crises, setCrises] = useState<CrisisEvent[]>([]);
  const [timeline, setTimeline] = useState<CrisisTimelineEvent[]>([]);
  const [eocActivations, setEocActivations] = useState<EOCActivation[]>([]);
  const [assignments, setAssignments] = useState<CommandAssignment[]>([]);
  const [overrides, setOverrides] = useState<EmergencyOverride[]>([]);
  const [services, setServices] = useState<CriticalService[]>([]);
  const [dependencies, setDependencies] = useState<CriticalServiceDependency[]>([]);
  const [drPlans, setDrPlans] = useState<DisasterRecoveryPlan[]>([]);
  const [drActivations, setDrActivations] = useState<DisasterRecoveryActivation[]>([]);
  const [allocations, setAllocations] = useState<EmergencyResourceAllocation[]>([]);
  const [closures, setClosures] = useState<CampusClosure[]>([]);
  const [reentries, setReentries] = useState<ReentryAuthorization[]>([]);
  const [simulationRuns, setSimulationRuns] = useState<SimulationRun[]>([]);
  const [aars, setAars] = useState<AfterActionReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<CrisisAuditEvent[]>([]);
  const [scannerIssues, setScannerIssues] = useState<CrisisDataQualityIssue[]>([]);
  const [readiness, setReadiness] = useState<InstitutionalReadinessSnapshot | null>(null);

  // Form inputs
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Crisis Declarer state
  const [newCrisisTitle, setNewCrisisTitle] = useState('');
  const [newCrisisDesc, setNewCrisisDesc] = useState('');
  const [newCrisisCategory, setNewCrisisCategory] = useState<CrisisEventCategory>(CrisisEventCategory.SECURITY);
  const [newCrisisSeverity, setNewCrisisSeverity] = useState<CrisisEventSeverity>(CrisisEventSeverity.HIGH);

  // New Override request state
  const [ovrJustification, setOvrJustification] = useState('');
  const [ovrScope, setOvrScope] = useState('');
  const [ovrReason, setOvrReason] = useState('');

  // New Service state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceRto, setNewServiceRto] = useState(120);
  const [newServiceRpo, setNewServiceRpo] = useState(60);
  const [newServicePriority, setNewServicePriority] = useState<ServiceRecoveryPriority>(ServiceRecoveryPriority.TIER_1);

  // New Dependency state
  const [depServiceId, setDepServiceId] = useState('');
  const [depDependsOnId, setDepDependsOnId] = useState('');

  // Dependency analysis output
  const [analysisResult, setAnalysisResult] = useState<{
    singlePointsOfFailure: string[];
    circularDependencies: { serviceId: string; path: string[] }[];
    blastRadius: Record<string, string[]>;
    criticalPath: string[];
  } | null>(null);

  // Dispatch message state
  const [broadcastPriority, setBroadcastPriority] = useState<EmergencyCommunicationPriority>(EmergencyCommunicationPriority.URGENT);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Drill Sandbox state
  const [selectedScenario, setSelectedScenario] = useState<'FIRE' | 'FLOOD' | 'CYBERATTACK' | 'RANSOMWARE' | 'POWER_OUTAGE' | 'AI_DATA_SECURITY'>('CYBERATTACK');
  const [simStaffingReduction, setSimStaffingReduction] = useState(25);
  const [simResourceShortage, setSimResourceShortage] = useState(false);
  const [simCampusClosure, setSimCampusClosure] = useState(true);

  // AAR Finalizer State
  const [aarCrisisId, setAarCrisisId] = useState('');
  const [aarWhatHappened, setAarWhatHappened] = useState('');
  const [aarWhatWorked, setAarWhatWorked] = useState('');
  const [aarWhatFailed, setAarWhatFailed] = useState('');

  useEffect(() => {
    loadAllData();
  }, [tenantId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const dbCrises = await FirebaseService.getTenantCollection<CrisisEvent>('crisis_events', tenantId);
      const dbTimeline = await FirebaseService.getTenantCollection<CrisisTimelineEvent>('crisis_timeline_events', tenantId);
      const dbEoc = await FirebaseService.getTenantCollection<EOCActivation>('crisis_eoc_activations', tenantId);
      const dbAsg = await FirebaseService.getTenantCollection<CommandAssignment>('crisis_command_assignments', tenantId);
      const dbOvr = await FirebaseService.getTenantCollection<EmergencyOverride>('crisis_overrides', tenantId);
      const dbServices = await FirebaseService.getTenantCollection<CriticalService>('crisis_critical_services', tenantId);
      const dbDeps = await FirebaseService.getTenantCollection<CriticalServiceDependency>('crisis_service_dependencies', tenantId);
      const dbDr = await FirebaseService.getTenantCollection<DisasterRecoveryPlan>('crisis_recovery_plans', tenantId);
      const dbDrAct = await FirebaseService.getTenantCollection<DisasterRecoveryActivation>('crisis_recovery_activations', tenantId);
      const dbAlloc = await FirebaseService.getTenantCollection<EmergencyResourceAllocation>('crisis_resource_allocations', tenantId);
      const dbClosures = await FirebaseService.getTenantCollection<CampusClosure>('crisis_closures', tenantId);
      const dbReentries = await FirebaseService.getTenantCollection<ReentryAuthorization>('crisis_reentry_authorizations', tenantId);
      const dbSims = await FirebaseService.getTenantCollection<SimulationRun>('crisis_simulation_runs', tenantId);
      const dbAars = await FirebaseService.getTenantCollection<AfterActionReview>('crisis_after_action_reviews', tenantId);
      const dbAudit = await FirebaseService.getTenantCollection<CrisisAuditEvent>('crisis_audit_logs', tenantId);
      const dbIssues = await FirebaseService.getTenantCollection<CrisisDataQualityIssue>('crisis_data_quality_issues', tenantId);

      setCrises(dbCrises);
      setTimeline(dbTimeline);
      setEocActivations(dbEoc);
      setAssignments(dbAsg);
      setOverrides(dbOvr);
      setServices(dbServices);
      setDependencies(dbDeps);
      setDrPlans(dbDr);
      setDrActivations(dbDrAct);
      setAllocations(dbAlloc);
      setClosures(dbClosures);
      setReentries(dbReentries);
      setSimulationRuns(dbSims);
      setAars(dbAars);
      setAuditLogs(dbAudit);
      setScannerIssues(dbIssues);

      // Deterministic Analytics and Dependencies
      const calculatedReadiness = await CrisisResilienceService.computeReadinessSnapshot(tenantId);
      setReadiness(calculatedReadiness);

      if (dbServices.length > 0) {
        const analysis = await CrisisResilienceService.runDependencyAnalysis(tenantId);
        setAnalysisResult(analysis);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load resilience workspace configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclareCrisis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrisisTitle || !newCrisisDesc) {
      setErrorMsg('Please specify a title and descriptive summary.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CrisisResilienceService.declareCrisis({
        tenantId,
        title: newCrisisTitle,
        description: newCrisisDesc,
        category: newCrisisCategory,
        severity: newCrisisSeverity,
        declaredBy: actorId,
        declaredByName: actorName,
        classification: {
          category: newCrisisCategory,
          initialSeverity: newCrisisSeverity,
          affectedScope: 'CAMPUS',
          legalObligationReport: newCrisisSeverity === CrisisEventSeverity.CATASTROPHIC
        }
      });
      setSuccessMsg('Crisis event declared successfully.');
      setNewCrisisTitle('');
      setNewCrisisDesc('');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to declare crisis.');
    }
  };

  const handleStatusChange = async (crisisId: string, nextStatus: CrisisEventStatus) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.transitionCrisisStatus({
        tenantId,
        crisisId,
        newStatus: nextStatus,
        actorId,
        actorName,
        justification: `Administrative lifecycle transition to ${nextStatus}`
      });
      setSuccessMsg(`Incident transitioned to ${nextStatus} successfully.`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation Denied.');
    }
  };

  const handleEocRequest = async (crisisId: string) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.activateEOC({
        tenantId,
        crisisId,
        eocId: 'eoc_primary_ops',
        activatedBy: actorId,
        activatedByName: actorName,
        justification: 'Critical Incident response coordination required.'
      });
      setSuccessMsg('Emergency Operations Center activation request registered successfully.');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveEoc = async (activationId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.approveEOCActivation({
        tenantId,
        activationId,
        approvedBy: actorId,
        approvedByName: actorName,
        decision,
        notes: `Peer approval review decision: ${decision}`
      });
      setSuccessMsg(`EOC activation decision processed: ${decision}`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAssignRole = async (crisisId: string, role: CommandRole, targetUserId: string, targetUserName: string) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.assignCommandRole({
        tenantId,
        crisisId,
        role,
        userId: targetUserId,
        userName: targetUserName,
        assignedBy: actorId,
        assignedByName: actorName,
        startTime: new Date().toISOString()
      });
      setSuccessMsg(`Assigned role ${role} successfully.`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRequestOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ovrJustification || !ovrScope || !ovrReason) {
      setErrorMsg('Please specify all required justification details.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await CrisisResilienceService.requestEmergencyOverride({
        tenantId,
        requestedBy: actorId,
        requestedByName: actorName,
        justification: ovrJustification,
        affectedScope: ovrScope,
        authorityLevel: 'CRITICAL',
        durationMinutes: 120,
        reason: ovrReason
      });
      setSuccessMsg('Transient emergency override requested.');
      setOvrJustification('');
      setOvrScope('');
      setOvrReason('');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveOverride = async (overrideId: string) => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.authorizeOverride({
        tenantId,
        overrideId,
        authorizedBy: actorId,
        authorizedByName: actorName,
        notes: 'Co-signature audit authorization granted.'
      });
      setSuccessMsg('Emergency override approved and activated.');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRegisterService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const serviceId = FirebaseService.generateId('srv');
      const criticalService: CriticalService = {
        id: serviceId,
        tenantId,
        name: newServiceName,
        description: `Critical campus digital/operational asset: ${newServiceName}`,
        rtoMinutes: newServiceRto,
        rpoMinutes: newServiceRpo,
        recoveryPriority: newServicePriority,
        ownerId: actorId,
        ownerName: actorName,
        status: 'OPERATIONAL'
      };
      await FirebaseService.setDocument('crisis_critical_services', serviceId, criticalService);
      setSuccessMsg(`Registered critical service: ${newServiceName}`);
      setNewServiceName('');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleAddDependency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depServiceId || !depDependsOnId) return;
    try {
      setErrorMsg(null);
      const depId = FirebaseService.generateId('dep');
      const dependency: CriticalServiceDependency = {
        id: depId,
        tenantId,
        serviceId: depServiceId,
        dependsOnServiceId: depDependsOnId,
        dependencySeverity: 'CRITICAL'
      };
      await FirebaseService.setDocument('crisis_service_dependencies', depId, dependency);
      setSuccessMsg('Registered Service dependency edge.');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSendBroadcast = async (crisisId: string) => {
    if (!broadcastMessage) return;
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await CrisisResilienceService.dispatchEmergencyBroadcast({
        tenantId,
        crisisId,
        priority: broadcastPriority,
        channels: [EmergencyCommunicationChannel.IN_APP, EmergencyCommunicationChannel.EMAIL],
        recipientScope: 'ALL_CAMPUS',
        message: broadcastMessage,
        sentBy: actorId,
        sentByName: actorName
      });
      setSuccessMsg('Emergency broadcast dispatched via operational transport layers.');
      setBroadcastMessage('');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRunSimulation = async () => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const run = await CrisisResilienceService.runResilienceSimulation({
        tenantId,
        simulationId: 'sim_drill_sandbox',
        executedBy: actorId,
        executedByName: actorName,
        scenarioType: selectedScenario,
        options: {
          hypotheticalResourceShortages: simResourceShortage,
          staffingReductionsPercent: simStaffingReduction,
          campusClosureSimulated: simCampusClosure,
          serviceDegradationSimulated: true,
          communicationFailureSimulated: false,
          recoveryDelaysSimulated: false
        }
      });
      setSuccessMsg(`Sandbox Simulation run completed! Proj Score: ${run.projectedResilienceScore}%`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleRunScanner = async () => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const issues = await CrisisResilienceService.runGovernanceScanner(tenantId);
      setSuccessMsg(`Data Quality Scanner completed. Discovered ${issues.length} active violations.`);
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleFinalizeAar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aarCrisisId || !aarWhatHappened) return;
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const aarId = FirebaseService.generateId('aar');
      const aar: AfterActionReview = {
        id: aarId,
        tenantId,
        crisisId: aarCrisisId,
        facilitatorId: actorId,
        facilitatorName: actorName,
        reviewedAt: new Date().toISOString(),
        whatHappened: aarWhatHappened,
        whatWorked: aarWhatWorked,
        whatFailed: aarWhatFailed,
        timelineDeviations: [],
        commandDecisionsNotes: 'Reviewed official EOC timeline event trace.',
        communicationPerformanceScore: 85,
        resourceGapsNotes: 'Review allocation logs.',
        recoveryPerformanceScore: 90,
        lessonsLearned: ['Conduct periodic offline drill rehearsals'],
        correctiveActions: ['Update crisis response playbooks'],
        preventiveActions: ['Schedule audit gap assessments'],
        status: 'APPROVED'
      };
      await FirebaseService.setDocument('crisis_after_action_reviews', aarId, aar);
      setSuccessMsg('After-Action Review finalized and archived.');
      setAarCrisisId('');
      setAarWhatHappened('');
      setAarWhatWorked('');
      setAarWhatFailed('');
      await loadAllData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div id="crisis-governance-container" className="flex flex-col min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">
            Crisis Command & Organizational Resilience
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">Emergency operations resilience console</h1>
          <p className="text-sm text-slate-500 mt-1">
            Institutional disaster command registry, EOC operations control, BCP dependency analysis, and drill sandboxes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm transition font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Dashboard
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-4 mb-6">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* Master Groupings Nav */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('command_center')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'command_center'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Command Center
        </button>
        <button
          onClick={() => setActiveTab('response_ops')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'response_ops'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Active Response
        </button>
        <button
          onClick={() => setActiveTab('systems_resilience')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'systems_resilience'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Continuity & Systems
        </button>
        <button
          onClick={() => setActiveTab('drill_sandbox')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'drill_sandbox'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          Resilience Sandbox
        </button>
        <button
          onClick={() => setActiveTab('audit_governance')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
            activeTab === 'audit_governance'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          Compliance & Auditing
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1">
        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'command_center' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPI Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Dashboard */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Readiness Metrics Analysis</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                    <span className="text-2xl font-black text-red-600">{readiness?.overallScore || 85}%</span>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Readiness Score</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                    <span className="text-2xl font-black text-slate-800">{readiness?.crisisResponseScore || 90}%</span>
                    <p className="text-xs font-semibold text-slate-500 mt-1">EOC Preparedness</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                    <span className="text-2xl font-black text-slate-800">{readiness?.bcpReadinessScore || 92}%</span>
                    <p className="text-xs font-semibold text-slate-500 mt-1">BCP Alignment</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center">
                    <span className="text-2xl font-black text-slate-800">{readiness?.openResilienceGapsCount || 0}</span>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Open Vulnerabilities</p>
                  </div>
                </div>
              </div>

              {/* Active Incidents Summary */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Active Incident List</h2>
                {crises.filter(c => c.isActive).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm">No active crisis events reported on the campus networks.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {crises.filter(c => c.isActive).map(c => (
                      <div key={c.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                              {c.severity}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {c.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-800 mt-1">{c.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                            Status: {c.status}
                          </span>
                          <button
                            onClick={() => handleEocRequest(c.id)}
                            className="bg-slate-800 text-white hover:bg-slate-900 text-xs font-semibold px-3 py-1.5 rounded transition"
                          >
                            Trigger EOC
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Emergency communications sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-bold text-slate-800">Operational Dispatch</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Select Crisis Instance</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                      <option value="">-- Choose Context --</option>
                      {crises.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Broadcast Target Priority</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBroadcastPriority(EmergencyCommunicationPriority.URGENT)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                          broadcastPriority === EmergencyCommunicationPriority.URGENT
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        Urgent
                      </button>
                      <button
                        onClick={() => setBroadcastPriority(EmergencyCommunicationPriority.EMERGENCY)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                          broadcastPriority === EmergencyCommunicationPriority.EMERGENCY
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        Emergency
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Broadcast Message Body</label>
                    <textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      rows={3}
                      placeholder="Enter emergency warning instructions..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700"
                    />
                  </div>
                  <button
                    onClick={() => handleSendBroadcast(crises[0]?.id || 'cri_general')}
                    disabled={!broadcastMessage}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Dispatch Message
                  </button>
                </div>
              </div>

              {/* Security override quick view */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Temporary Security Overrides</h3>
                {overrides.length === 0 ? (
                  <p className="text-xs text-slate-400">No temporary override waivers are active on system controllers.</p>
                ) : (
                  <div className="space-y-2">
                    {overrides.map(o => (
                      <div key={o.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-amber-800">{o.authorityLevel}</span>
                          <span className="text-[10px] text-amber-600">Expires soon</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 mt-1">{o.justification}</p>
                        {o.status === 'ACTIVE' && !o.approvedBy && (
                          <button
                            onClick={() => handleApproveOverride(o.id)}
                            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded text-[10px] transition"
                          >
                            Peer Approve Override
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESPONSE OPERATIONS */}
        {activeTab === 'response_ops' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: reporting and activations */}
            <div className="lg:col-span-2 space-y-6">
              {/* EOC command assignments and activations */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">EOC command activations review</h2>
                {eocActivations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No Emergency Operations Center activations logged in the system.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eocActivations.map(act => (
                      <div key={act.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">ID: {act.id}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            act.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {act.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mt-2">{act.justification}</p>
                        <p className="text-xs text-slate-500 mt-1">Requested by: {act.activatedBy} on {act.activatedAt}</p>
                        {act.status === 'PENDING_APPROVAL' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleApproveEoc(act.id, 'APPROVED')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-semibold transition"
                            >
                              Approve Activation
                            </button>
                            <button
                              onClick={() => handleApproveEoc(act.id, 'REJECTED')}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Declare new Crisis Form */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Declare emergency / safety incident</h2>
                <form onSubmit={handleDeclareCrisis} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Incident Title</label>
                      <input
                        type="text"
                        value={newCrisisTitle}
                        onChange={(e) => setNewCrisisTitle(e.target.value)}
                        placeholder="e.g. Server Room Thermal Failure"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Event Category</label>
                      <select
                        value={newCrisisCategory}
                        onChange={(e) => setNewCrisisCategory(e.target.value as CrisisEventCategory)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                      >
                        {Object.values(CrisisEventCategory).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Event Severity Level</label>
                    <select
                      value={newCrisisSeverity}
                      onChange={(e) => setNewCrisisSeverity(e.target.value as CrisisEventSeverity)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    >
                      {Object.values(CrisisEventSeverity).map(sev => (
                        <option key={sev} value={sev}>{sev}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Incident Summary & Initial Response Details</label>
                    <textarea
                      value={newCrisisDesc}
                      onChange={(e) => setNewCrisisDesc(e.target.value)}
                      rows={4}
                      placeholder="Specify exactly what triggered the event, affected assets, and potential impact..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Declare Crisis Event
                  </button>
                </form>
              </div>
            </div>

            {/* Right column: active command assignments, playbooks */}
            <div className="space-y-6">
              {/* EOC command structure roster */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Command Roster Assignments</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Incident Commander</label>
                    <button
                      onClick={() => handleAssignRole(crises[0]?.id || 'cri_general', CommandRole.INCIDENT_COMMANDER, 'usr_ic_001', 'Gen. Incident Commander')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Assign 'Incident Commander' role to IC Officer
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Assign Technical Lead</label>
                    <button
                      onClick={() => handleAssignRole(crises[0]?.id || 'cri_general', CommandRole.IT_TECHNOLOGY_LEAD, 'usr_tech_002', 'CTO Operations Lead')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Assign 'IT/Technology Lead' role to CTO
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Active Assignments</p>
                    {assignments.length === 0 ? (
                      <p className="text-xs text-slate-400">No active EOC staff assignments mapped.</p>
                    ) : (
                      <div className="space-y-2">
                        {assignments.map(as => (
                          <div key={as.id} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded text-xs">
                            <span className="font-bold text-slate-700">{as.role}</span>
                            <span className="text-slate-500">{as.userName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Temporary security overrides form */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Request transient override</h3>
                <form onSubmit={handleRequestOverride} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Override Waiver Scope</label>
                    <input
                      type="text"
                      value={ovrScope}
                      onChange={(e) => setOvrScope(e.target.value)}
                      placeholder="e.g. Firewall Bypass, Building 3 Access"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Operational Reason</label>
                    <input
                      type="text"
                      value={ovrReason}
                      onChange={(e) => setOvrReason(e.target.value)}
                      placeholder="e.g. Critical IT Restoration"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Justification Detail</label>
                    <textarea
                      value={ovrJustification}
                      onChange={(e) => setOvrJustification(e.target.value)}
                      rows={2}
                      placeholder="Enter security justification audit trails..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Submit Override Proposal
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEMS RESILIENCE */}
        {activeTab === 'systems_resilience' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: critical services catalog & dependencies */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service list and configuration */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Critical Services & RTO/RPO Controls</h2>
                <form onSubmit={handleRegisterService} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Service Name</label>
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Student SIS Database"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">RTO (Minutes)</label>
                    <input
                      type="number"
                      value={newServiceRto}
                      onChange={(e) => setNewServiceRto(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">RPO (Minutes)</label>
                    <input
                      type="number"
                      value={newServiceRpo}
                      onChange={(e) => setNewServiceRpo(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-slate-800 text-white hover:bg-slate-900 px-4 py-2 rounded-lg text-xs font-semibold transition"
                    >
                      Register Critical Service
                    </button>
                  </div>
                </form>

                {services.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No critical services registered in the database inventory.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase">
                          <th className="py-2 px-3 font-semibold">Service Name</th>
                          <th className="py-2 px-3 font-semibold">RTO (Min)</th>
                          <th className="py-2 px-3 font-semibold">RPO (Min)</th>
                          <th className="py-2 px-3 font-semibold">Priority</th>
                          <th className="py-2 px-3 font-semibold">Operational Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {services.map(s => (
                          <tr key={s.id}>
                            <td className="py-2 px-3 font-semibold text-slate-800">{s.name}</td>
                            <td className="py-2 px-3">{s.rtoMinutes}</td>
                            <td className="py-2 px-3">{s.rpoMinutes}</td>
                            <td className="py-2 px-3">{s.recoveryPriority}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Dependency Map DFS / BFS engine outputs */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Critical Dependency Graph & Single Points of Failure</h2>
                  <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-mono font-bold">DFS/BFS Analysis Engine</span>
                </div>

                <form onSubmit={handleAddDependency} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Select Service</label>
                    <select
                      value={depServiceId}
                      onChange={(e) => setDepServiceId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700"
                    >
                      <option value="">-- Choose Service --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Depends On (Upstream Service)</label>
                    <select
                      value={depDependsOnId}
                      onChange={(e) => setDepDependsOnId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700"
                    >
                      <option value="">-- Choose Dependent --</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-slate-800 text-white hover:bg-slate-900 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Add Dependency Link
                    </button>
                  </div>
                </form>

                {analysisResult ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-2">Upstream / Downstream Blast Radius Mappings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map(s => (
                          <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                            <span className="font-bold text-slate-800 block mb-1">{s.name}</span>
                            <div className="text-slate-500">
                              Downstream Impact: {analysisResult.blastRadius[s.id]?.length > 0 
                                ? analysisResult.blastRadius[s.id].map(rid => services.find(sv => sv.id === rid)?.name).join(', ') 
                                : 'No downstream dependencies'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-500 block mb-1">Single Points of Failure Identified</span>
                        {analysisResult.singlePointsOfFailure.length === 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold">Zero Single Points of Failure found. Excellent.</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {analysisResult.singlePointsOfFailure.map(sid => (
                              <span key={sid} className="bg-red-50 text-red-800 border border-red-200 text-xs px-2 py-0.5 rounded font-semibold">
                                {services.find(sv => sv.id === sid)?.name || sid}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-500 block mb-1">Circular Dependencies (Infinite Loops)</span>
                        {analysisResult.circularDependencies.length === 0 ? (
                          <span className="text-xs text-emerald-600 font-semibold">Zero dependency cycles detected.</span>
                        ) : (
                          <div className="space-y-1">
                            {analysisResult.circularDependencies.map((c, idx) => (
                              <div key={idx} className="bg-red-50 text-red-800 text-xs p-2 rounded border border-red-200 font-mono">
                                Cycle: {c.path.map(pid => services.find(sv => sv.id === pid)?.name || pid).join(' ➔ ')}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Add dependencies and services to generate topology mapping outputs.</p>
                )}
              </div>
            </div>

            {/* Right side BCP activation tracks & resources */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">DR Plans Mapped</h3>
                {drPlans.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">
                    <p className="text-xs">No active recovery plans registered.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drPlans.map(p => (
                      <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs">
                        <span className="font-bold block text-slate-800">{p.title}</span>
                        <span className="text-slate-500 block mt-0.5">Affected system: {p.systemName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resource planning quick views */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Emergency Resource Allocations</h3>
                {allocations.length === 0 ? (
                  <p className="text-xs text-slate-400">No active emergency resource dispatches logged.</p>
                ) : (
                  <div className="space-y-2">
                    {allocations.map(al => (
                      <div key={al.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs">
                        <div className="flex justify-between font-bold">
                          <span>Qty requested: {al.requestedQuantity}</span>
                          <span className="text-slate-500">{al.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Destination: {al.destination}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DRILL SANDBOX */}
        {activeTab === 'drill_sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sandbox drill config and runs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Organizational resilience simulation sandbox</h2>
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-mono font-bold">PRODUCTION ISOLATED</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Launch isolated dry runs to test response time, projected staffing capacity drops, communication channels failure, or critical infrastructure loss without modifying operational production directories.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Select Drill Scenario</label>
                    <select
                      value={selectedScenario}
                      onChange={(e) => setSelectedScenario(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    >
                      <option value="CYBERATTACK">Major Ransomware / IT Outage</option>
                      <option value="FIRE">Major Campus Fire Incident</option>
                      <option value="FLOOD">Physical Campus Flood / Infrastructure Loss</option>
                      <option value="POWER_OUTAGE">Prolonged Main Grid Power Failure</option>
                      <option value="AI_DATA_SECURITY">Algorithmic Leak & Prompt Injection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Hypothetical Staff Capacity Reduction</label>
                    <input
                      type="number"
                      value={simStaffingReduction}
                      onChange={(e) => setSimStaffingReduction(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={simResourceShortage}
                        onChange={(e) => setSimResourceShortage(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      Simulate critical supply and resource shortages
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={simCampusClosure}
                        onChange={(e) => setSimCampusClosure(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      Force total campus closure during execution window
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
                >
                  <Play className="w-4 h-4 text-white" />
                  Run Sandbox Resilience Drill
                </button>
              </div>

              {/* Historical sandbox executions list */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Historical Drill Runs Results</h2>
                {simulationRuns.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No dry runs logged. Click above to run a scenario drill.</p>
                ) : (
                  <div className="space-y-4">
                    {simulationRuns.map(run => (
                      <div key={run.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-800">{run.scenarioType} Drill Run</span>
                          <span className="text-blue-600">Sim ID: {run.id}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <span className="text-slate-500 block">Projected Score</span>
                            <span className="font-bold text-slate-800 text-sm">{run.projectedResilienceScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Resp. Speed</span>
                            <span className="font-bold text-slate-800 text-sm">{run.projectedResponseTimeSeconds}s</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Service Impact</span>
                            <span className="font-bold text-slate-800 text-sm">{run.projectedServiceImpactPercent}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Resource Gap</span>
                            <span className="font-bold text-slate-800 text-sm">{run.projectedResourceGapPercent}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* After-Action Review (AAR) Finalizer column */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Finalize After-Action Review (AAR)</h3>
                <form onSubmit={handleFinalizeAar} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Select Crisis Context</label>
                    <select
                      value={aarCrisisId}
                      onChange={(e) => setAarCrisisId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700"
                    >
                      <option value="">-- Choose Context --</option>
                      {crises.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Timeline & What Happened</label>
                    <textarea
                      value={aarWhatHappened}
                      onChange={(e) => setAarWhatHappened(e.target.value)}
                      rows={2}
                      placeholder="Write exact timeline deviations..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Corrective Measures / What worked</label>
                    <textarea
                      value={aarWhatWorked}
                      onChange={(e) => setAarWhatWorked(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Identified Gaps / What failed</label>
                    <textarea
                      value={aarWhatFailed}
                      onChange={(e) => setAarWhatFailed(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Archive Incident learnings (AAR)
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT & COMPLIANCE */}
        {activeTab === 'audit_governance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Immutable audit logs and scanner */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">Governance Data Quality Scanner</h2>
                  <button
                    onClick={handleRunScanner}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Execute Registry Diagnostics Scan
                  </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Scans the institutional directory registry databases for orphaned references, expired override waivers, missing recovery objectives (RTO/RPO limits), or circular dependency cycles on services.
                </p>

                {scannerIssues.length === 0 ? (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-lg flex items-center gap-2 text-xs font-medium">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    All registry database elements comply fully with Phase 7.47 guidelines. Zero diagnostics issues flagged.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {scannerIssues.map(issue => (
                      <div key={issue.id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold uppercase">
                              {issue.severity}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {issue.issueType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-800 mt-1">{issue.description}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">Detected at: {issue.detectedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Immutable operations audit trace logs */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Immutable Operations Audit Trail</h2>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No historical operations logged in the audit trail.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {auditLogs.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded text-xs">
                        <div className="flex justify-between items-center text-slate-500 mb-1">
                          <span className="font-mono font-bold text-slate-700">{log.action}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-800">
                          Actor <strong className="text-slate-700">{log.actorName}</strong> executed action on resource <strong className="text-slate-700">{log.resource}</strong> (ID: {log.resourceId}).
                        </p>
                        {log.justification && (
                          <p className="text-xs text-slate-400 italic mt-1">Justification: {log.justification}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side information card on Security Rules & SoD policy controls */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-slate-800">Access Governance Policy Constraints</h3>
                </div>
                <div className="space-y-3 text-xs text-slate-600">
                  <p>The following zero-trust constraints are enforced strictly at the database directory access security layer:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>
                      <strong>Separation of Duties (SoD)</strong>: Requester cannot peer-approve their own declared status changes, EOC activation requests, or temporary override waivers.
                    </li>
                    <li>
                      <strong>Temporal Integrity</strong>: Expiry times of overrides are checked programmatically and scanners flag violations automatically.
                    </li>
                    <li>
                      <strong>Audit Immutability</strong>: Operations audit records are set to catch and reject write-overwrite updates or deletion requests synchronous to policy.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
