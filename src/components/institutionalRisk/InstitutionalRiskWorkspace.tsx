import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Flame,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Users,
  Eye,
  Lock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Building2,
  Calendar,
  Zap,
  CheckSquare,
  XCircle,
  BarChart3,
  Award,
  BookOpen,
  ArrowRight,
  Radio,
  FileCheck2,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';
import {
  InstitutionalRiskItem,
  RiskMitigationAction,
  KeyRiskIndicator,
  CampusIncidentItem,
  BusinessContinuityPlan,
  SafetyAuditInspection,
  ContinuitySimulationDrill,
  InstitutionalRiskAnalytics,
  RiskCategory,
  RiskSeverity,
  RiskStatus,
  IncidentSeverity,
  IncidentStatus,
  KriStatus,
  InspectionFinding
} from '../../types/institutionalRisk';
import { InstitutionalRiskService } from '../../services/institutionalRiskService';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';

type TabType =
  | 'overview'
  | 'risk_register'
  | 'incident_command'
  | 'kri_watchlist'
  | 'business_continuity'
  | 'safety_audits';

export const InstitutionalRiskWorkspace: React.FC = () => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  const tenantId = currentTenant?.id || 'demo-tenant';
  const campusId = currentTenant?.campuses?.[0]?.id;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Core Data States
  const [risks, setRisks] = useState<InstitutionalRiskItem[]>([]);
  const [mitigations, setMitigations] = useState<RiskMitigationAction[]>([]);
  const [kris, setKris] = useState<KeyRiskIndicator[]>([]);
  const [incidents, setIncidents] = useState<CampusIncidentItem[]>([]);
  const [bcps, setBcps] = useState<BusinessContinuityPlan[]>([]);
  const [inspections, setInspections] = useState<SafetyAuditInspection[]>([]);
  const [drills, setDrills] = useState<ContinuitySimulationDrill[]>([]);
  const [analytics, setAnalytics] = useState<InstitutionalRiskAnalytics | null>(null);

  // Filters & Search
  const [riskSearch, setRiskSearch] = useState<string>('');
  const [riskCategoryFilter, setRiskCategoryFilter] = useState<string>('ALL');
  const [riskSeverityFilter, setRiskSeverityFilter] = useState<string>('ALL');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState<string>('ALL');

  // Modals
  const [showRiskModal, setShowRiskModal] = useState<boolean>(false);
  const [showMitigationModal, setShowMitigationModal] = useState<boolean>(false);
  const [selectedRiskForMitigation, setSelectedRiskForMitigation] = useState<InstitutionalRiskItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [selectedRiskForReview, setSelectedRiskForReview] = useState<InstitutionalRiskItem | null>(null);

  const [showIncidentModal, setShowIncidentModal] = useState<boolean>(false);
  const [showCommandModal, setShowCommandModal] = useState<boolean>(false);
  const [selectedIncidentForCommand, setSelectedIncidentForCommand] = useState<CampusIncidentItem | null>(null);
  const [showPirModal, setShowPirModal] = useState<boolean>(false);
  const [selectedIncidentForPir, setSelectedIncidentForPir] = useState<CampusIncidentItem | null>(null);

  const [showKriModal, setShowKriModal] = useState<boolean>(false);
  const [showKriMeasureModal, setShowKriMeasureModal] = useState<boolean>(false);
  const [selectedKriForMeasure, setSelectedKriForMeasure] = useState<KeyRiskIndicator | null>(null);

  const [showBcpModal, setShowBcpModal] = useState<boolean>(false);
  const [showDrillModal, setShowDrillModal] = useState<boolean>(false);
  const [showDrillEvalModal, setShowDrillEvalModal] = useState<boolean>(false);
  const [selectedDrillForEval, setSelectedDrillForEval] = useState<ContinuitySimulationDrill | null>(null);

  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [showInspectionCompleteModal, setShowInspectionCompleteModal] = useState<boolean>(false);
  const [selectedInspectionForComplete, setSelectedInspectionForComplete] = useState<SafetyAuditInspection | null>(null);

  // Form States - Risk
  const [newRiskCode, setNewRiskCode] = useState<string>('');
  const [newRiskTitle, setNewRiskTitle] = useState<string>('');
  const [newRiskDescription, setNewRiskDescription] = useState<string>('');
  const [newRiskCategory, setNewRiskCategory] = useState<RiskCategory>('OPERATIONAL');
  const [newInherentProb, setNewInherentProb] = useState<number>(3);
  const [newInherentImpact, setNewInherentImpact] = useState<number>(3);
  const [newStrategy, setNewStrategy] = useState<'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT'>('MITIGATE');
  const [newMitigationSummary, setNewMitigationSummary] = useState<string>('');
  const [newRiskOwnerName, setNewRiskOwnerName] = useState<string>('');
  const [newRiskOwnerDept, setNewRiskOwnerDept] = useState<string>('');
  const [newReviewCadence, setNewReviewCadence] = useState<'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL'>('QUARTERLY');
  const [newNextReviewDate, setNewNextReviewDate] = useState<string>('');

  // Form States - Mitigation
  const [newMitTitle, setNewMitTitle] = useState<string>('');
  const [newMitControlType, setNewMitControlType] = useState<'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE'>('PREVENTIVE');
  const [newMitDescription, setNewMitDescription] = useState<string>('');
  const [newMitOwnerName, setNewMitOwnerName] = useState<string>('');
  const [newMitBudget, setNewMitBudget] = useState<number>(0);
  const [newMitDueDate, setNewMitDueDate] = useState<string>('');

  // Form States - Incident
  const [newIncTitle, setNewIncTitle] = useState<string>('');
  const [newIncType, setNewIncType] = useState<CampusIncidentItem['type']>('SAFETY_SECURITY');
  const [newIncSeverity, setNewIncSeverity] = useState<IncidentSeverity>('LEVEL_2_MODERATE');
  const [newIncLocation, setNewIncLocation] = useState<string>('');
  const [newIncOccurredAt, setNewIncOccurredAt] = useState<string>('');
  const [newIncImmediateActions, setNewIncImmediateActions] = useState<string>('');
  const [newIncEmergencyNotified, setNewIncEmergencyNotified] = useState<boolean>(false);
  const [newIncBroadcastTriggered, setNewIncBroadcastTriggered] = useState<boolean>(false);

  // Form States - KRI
  const [newKriCode, setNewKriCode] = useState<string>('');
  const [newKriName, setNewKriName] = useState<string>('');
  const [newKriUnit, setNewKriUnit] = useState<string>('Count');
  const [newKriDirection, setNewKriDirection] = useState<'LOWER_IS_BETTER' | 'HIGHER_IS_BETTER'>('LOWER_IS_BETTER');
  const [newKriNormal, setNewKriNormal] = useState<number>(5);
  const [newKriWatch, setNewKriWatch] = useState<number>(10);
  const [newKriBreach, setNewKriBreach] = useState<number>(20);
  const [newKriVal, setNewKriVal] = useState<number>(0);
  const [newKriDept, setNewKriDept] = useState<string>('');

  // Form States - BCP
  const [newBcpCode, setNewBcpCode] = useState<string>('');
  const [newBcpName, setNewBcpName] = useState<string>('');
  const [newBcpFunction, setNewBcpFunction] = useState<string>('');
  const [newBcpDept, setNewBcpDept] = useState<string>('');
  const [newBcpRto, setNewBcpRto] = useState<number>(4);
  const [newBcpRpo, setNewBcpRpo] = useState<number>(1);
  const [newBcpFacility, setNewBcpFacility] = useState<string>('');
  const [newBcpRemote, setNewBcpRemote] = useState<boolean>(true);
  const [newBcpLeadName, setNewBcpLeadName] = useState<string>('');
  const [newBcpSecLeadName, setNewBcpSecLeadName] = useState<string>('');
  const [newBcpTrigger, setNewBcpTrigger] = useState<string>('');

  // Form States - Safety Audit
  const [newInspNumber, setNewInspNumber] = useState<string>('');
  const [newInspType, setNewInspType] = useState<SafetyAuditInspection['inspectionType']>('FIRE_SAFETY');
  const [newInspLocation, setNewInspLocation] = useState<string>('');
  const [newInspDate, setNewInspDate] = useState<string>('');
  const [newInspectorName, setNewInspectorName] = useState<string>('');

  // Load All Data
  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [
        fetchedRisks,
        fetchedMits,
        fetchedKris,
        fetchedIncidents,
        fetchedBcps,
        fetchedInspections,
        fetchedDrills,
        fetchedAnalytics
      ] = await Promise.all([
        InstitutionalRiskService.getRisks(tenantId, campusId),
        InstitutionalRiskService.getMitigations(tenantId),
        InstitutionalRiskService.getKeyRiskIndicators(tenantId, campusId),
        InstitutionalRiskService.getCampusIncidents(tenantId, campusId),
        InstitutionalRiskService.getBcpPlans(tenantId, campusId),
        InstitutionalRiskService.getSafetyInspections(tenantId, campusId),
        InstitutionalRiskService.getSimulationDrills(tenantId, campusId),
        InstitutionalRiskService.getInstitutionalRiskAnalytics(tenantId, campusId)
      ]);

      setRisks(fetchedRisks);
      setMitigations(fetchedMits);
      setKris(fetchedKris);
      setIncidents(fetchedIncidents);
      setBcps(fetchedBcps);
      setInspections(fetchedInspections);
      setDrills(fetchedDrills);
      setAnalytics(fetchedAnalytics);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load enterprise risk data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId, campusId]);

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Active Critical Incidents
  const activeLevel3Or4Incidents = useMemo(() => {
    return (incidents || []).filter(
      i =>
        (i.severity === 'LEVEL_3_MAJOR' || i.severity === 'LEVEL_4_CRITICAL_DISASTER') &&
        i.status !== 'RESOLVED' &&
        i.status !== 'CLOSED'
    );
  }, [incidents]);

  // Handlers
  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.createRiskItem(
        tenantId,
        {
          campusId,
          riskCode: newRiskCode || `RSK-${Math.floor(1000 + Math.random() * 9000)}`,
          title: newRiskTitle,
          description: newRiskDescription,
          category: newRiskCategory,
          inherentProbability: Number(newInherentProb),
          inherentImpact: Number(newInherentImpact),
          strategy: newStrategy,
          mitigationSummary: newMitigationSummary,
          residualProbability: Number(newInherentProb),
          residualImpact: Number(newInherentImpact),
          riskOwnerId: user.id,
          riskOwnerName: newRiskOwnerName || user.name || 'Risk Officer',
          riskOwnerDepartment: newRiskOwnerDept || 'Operations',
          reviewCadence: newReviewCadence,
          nextReviewDate: newNextReviewDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
        },
        user
      );

      setShowRiskModal(false);
      setNewRiskTitle('');
      setNewRiskDescription('');
      showFeedback('Risk item drafted successfully');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveRisk = async (riskId: string) => {
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.approveRiskItem(tenantId, riskId, 'Approved under institutional risk governance.', user);
      showFeedback('Risk item approved and activated');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleSubmitRisk = async (riskId: string) => {
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.submitRiskItemForReview(tenantId, riskId, user);
      showFeedback('Risk submitted for review');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateMitigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRiskForMitigation) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.createMitigationAction(
        tenantId,
        {
          campusId,
          riskId: selectedRiskForMitigation.id,
          riskCode: selectedRiskForMitigation.riskCode,
          title: newMitTitle,
          controlType: newMitControlType,
          description: newMitDescription,
          actionOwnerId: user.id,
          actionOwnerName: newMitOwnerName || user.name || 'Action Lead',
          allocatedBudget: Number(newMitBudget) || 0,
          targetCompletionDate: newMitDueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        },
        user
      );

      setShowMitigationModal(false);
      setSelectedRiskForMitigation(null);
      setNewMitTitle('');
      setNewMitDescription('');
      showFeedback('Risk mitigation control created');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.reportCampusIncident(
        tenantId,
        campusId || 'main_campus',
        {
          title: newIncTitle,
          type: newIncType,
          severity: newIncSeverity,
          location: newIncLocation,
          occurredAt: newIncOccurredAt || new Date().toISOString(),
          immediateActionsTaken: newIncImmediateActions,
          emergencyServicesNotified: newIncEmergencyNotified,
          emergencyBroadcastTriggered: newIncBroadcastTriggered
        },
        user
      );

      setShowIncidentModal(false);
      setNewIncTitle('');
      setNewIncLocation('');
      setNewIncImmediateActions('');
      showFeedback('Incident reported and triage activated');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateKri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.createKeyRiskIndicator(
        tenantId,
        {
          campusId,
          code: newKriCode || `KRI-${Math.floor(100 + Math.random() * 900)}`,
          name: newKriName,
          metricUnit: newKriUnit,
          targetDirection: newKriDirection,
          normalThreshold: Number(newKriNormal),
          watchThreshold: Number(newKriWatch),
          breachThreshold: Number(newKriBreach),
          currentValue: Number(newKriVal),
          responsibleDepartment: newKriDept || 'Operations',
          associatedRiskIds: []
        },
        user
      );

      setShowKriModal(false);
      setNewKriName('');
      setNewKriCode('');
      showFeedback('Key Risk Indicator created');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateBcp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.createBcpPlan(
        tenantId,
        {
          campusId,
          code: newBcpCode || `BCP-${Math.floor(100 + Math.random() * 900)}`,
          name: newBcpName,
          criticalFunction: newBcpFunction,
          department: newBcpDept || 'Academic Services',
          rtoHours: Number(newBcpRto) || 4,
          rpoHours: Number(newBcpRpo) || 1,
          alternateOperatingFacility: newBcpFacility || 'Auxiliary Campus Hall',
          remoteWorkCapability: newBcpRemote,
          backupSystemDescription: 'Automated offsite cloud backups & cellular failover',
          emergencyTeamLeadId: user.id,
          emergencyTeamLeadName: newBcpLeadName || user.name || 'Lead Officer',
          secondaryLeadId: user.id,
          secondaryLeadName: newBcpSecLeadName || 'Secondary Officer',
          activationTrigger: newBcpTrigger || 'Declared campus emergency or facility outage exceeding 2 hours',
          stepByStepProcedures: [
            { stepNumber: 1, phase: 'IMMEDIATE_TRIAGE', action: 'Notify Incident Command & isolate affected infrastructure', responsibleRole: 'Emergency Lead' },
            { stepNumber: 2, phase: 'RELOCATION', action: 'Direct key staff to alternate facility or remote workstations', responsibleRole: 'Operations' },
            { stepNumber: 3, phase: 'TEMPORARY_OPS', action: 'Restore core services on secondary cloud servers', responsibleRole: 'IT Systems' },
            { stepNumber: 4, phase: 'FULL_RESTORATION', action: 'Validate data integrity and announce resumption', responsibleRole: 'Academic Dean' }
          ]
        },
        user
      );

      setShowBcpModal(false);
      setNewBcpName('');
      setNewBcpFunction('');
      showFeedback('Business Continuity Plan created');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setErrorMsg(null);
      await InstitutionalRiskService.scheduleSafetyInspection(
        tenantId,
        campusId || 'main_campus',
        {
          inspectionNumber: newInspNumber || `INSP-${Date.now().toString().slice(-6)}`,
          inspectionType: newInspType,
          facilityLocation: newInspLocation,
          inspectorId: user.id,
          inspectorName: newInspectorName || user.name || 'Safety Officer',
          inspectionDate: newInspDate || new Date().toISOString().split('T')[0]
        },
        user
      );

      setShowInspectionModal(false);
      setNewInspLocation('');
      showFeedback('Safety Inspection scheduled');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Critical</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Medium</span>;
      case 'LOW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Low</span>;
    }
  };

  const getIncidentSeverityBadge = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'LEVEL_4_CRITICAL_DISASTER':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-700 text-white animate-pulse">Level 4 — Disaster</span>;
      case 'LEVEL_3_MAJOR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">Level 3 — Major</span>;
      case 'LEVEL_2_MODERATE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">Level 2 — Moderate</span>;
      case 'LEVEL_1_MINOR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Level 1 — Minor</span>;
    }
  };

  const getKriBadge = (status: KriStatus) => {
    switch (status) {
      case 'BREACH':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-300">BREACH</span>;
      case 'WATCH':
        return <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">WATCH</span>;
      case 'NORMAL':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-300">NORMAL</span>;
    }
  };

  // Filtered Risks
  const filteredRisks = useMemo(() => {
    return (risks || []).filter(r => {
      const matchSearch =
        r.title.toLowerCase().includes(riskSearch.toLowerCase()) ||
        r.riskCode.toLowerCase().includes(riskSearch.toLowerCase()) ||
        r.riskOwnerDepartment.toLowerCase().includes(riskSearch.toLowerCase());
      const matchCat = riskCategoryFilter === 'ALL' || r.category === riskCategoryFilter;
      const matchSev = riskSeverityFilter === 'ALL' || r.inherentSeverity === riskSeverityFilter || r.residualSeverity === riskSeverityFilter;
      return matchSearch && matchCat && matchSev;
    });
  }, [risks, riskSearch, riskCategoryFilter, riskSeverityFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Alert Notifications */}
      {errorMsg && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 text-sm">Dismiss</button>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 text-sm">Dismiss</button>
        </div>
      )}

      {/* Emergency Active Incident Command Banner */}
      {activeLevel3Or4Incidents.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-red-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Flame className="w-6 h-6 animate-bounce" />
            <div>
              <h3 className="font-bold text-base tracking-wide">ACTIVE CAMPUS EMERGENCY PROTOCOL ACTIVATED</h3>
              <p className="text-xs text-red-100">
                {activeLevel3Or4Incidents.length} major/disaster incident(s) currently requiring Incident Command System response.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('incident_command')}
            className="px-4 py-2 bg-white text-red-700 font-semibold text-xs rounded-lg shadow hover:bg-red-50 transition"
          >
            Access Command Center
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Institutional Governance & Resilience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Enterprise Risk & Incident Command
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Institutional risk register, 5x5 dynamic heatmaps, KRIs, Incident Command System (ICS), and Business Continuity (BCP).
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
            title="Refresh All Records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowRiskModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Risk Item</span>
          </button>

          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-sm transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 mb-6 gap-2 sm:gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Heatmap & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('risk_register')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'risk_register'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Risk Register ({risks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incident_command')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'incident_command'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Incident Command ({incidents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kri_watchlist')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'kri_watchlist'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Key Risk Indicators ({kris.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('business_continuity')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'business_continuity'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Business Continuity & Drills</span>
        </button>

        <button
          onClick={() => setActiveTab('safety_audits')}
          className={`pb-3 whitespace-nowrap flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'safety_audits'
              ? 'border-indigo-600 text-indigo-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Safety Audits & CAPA</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE OVERVIEW & DYNAMIC 5x5 HEATMAP */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Risks</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{analytics?.totalRisks || 0}</div>
              <span className="text-xs text-slate-400">Institutional Register</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Critical Residual</span>
              <div className="text-2xl font-bold text-red-600 mt-1">{analytics?.criticalRisks || 0}</div>
              <span className="text-xs text-slate-400">Score &ge; 15</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Active Incidents</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{analytics?.activeIncidents || 0}</div>
              <span className="text-xs text-slate-400">ICS Activated / Contained</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider">KRI Breaches</span>
              <div className="text-2xl font-bold text-red-600 mt-1">{analytics?.kriBreaches || 0}</div>
              <span className="text-xs text-slate-400">Threshold Breached</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">BCP Readiness</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">{analytics?.bcpReadinessIndex || 100}%</div>
              <span className="text-xs text-slate-400">Active Continuity Plans</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open CAPAs</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{analytics?.openCapaCount || 0}</div>
              <span className="text-xs text-slate-400">Safety Corrective Actions</span>
            </div>
          </div>

          {/* 5x5 Dynamic Risk Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">5x5 Enterprise Risk Heatmap</h3>
                  <p className="text-xs text-slate-500">Live quantitative exposure (Impact &times; Probability)</p>
                </div>
                <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 font-medium">
                  {risks.length} Mapped Assets
                </span>
              </div>

              {/* Matrix Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[460px]">
                  {/* Y-Axis Label: Impact (5 down to 1) */}
                  <div className="flex">
                    <div className="w-16 flex items-center justify-center font-bold text-xs text-slate-400 transform -rotate-90">
                      IMPACT
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map(impact => (
                        <div key={impact} className="flex items-center space-x-1">
                          <span className="w-4 text-xs font-semibold text-slate-400 text-right">{impact}</span>
                          <div className="grid grid-cols-5 gap-1 flex-1">
                            {[1, 2, 3, 4, 5].map(prob => {
                              const score = impact * prob;
                              const key = `${impact}-${prob}`;
                              const count = analytics?.riskHeatmapMatrix?.residual[key] || 0;

                              let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                              if (score >= 15) bgClass = 'bg-red-100 text-red-900 border-red-300 font-bold';
                              else if (score >= 10) bgClass = 'bg-orange-100 text-orange-900 border-orange-300 font-semibold';
                              else if (score >= 5) bgClass = 'bg-amber-50 text-amber-900 border-amber-200';

                              return (
                                <div
                                  key={prob}
                                  className={`h-12 border rounded-lg flex flex-col items-center justify-center text-xs transition hover:scale-105 cursor-pointer ${bgClass}`}
                                  title={`Impact ${impact} x Probability ${prob} = Score ${score}`}
                                  onClick={() => {
                                    setRiskSeverityFilter('ALL');
                                    setActiveTab('risk_register');
                                  }}
                                >
                                  <span className="text-[10px] text-slate-400">s={score}</span>
                                  <span className="text-sm">{count > 0 ? `${count} items` : '-'}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {/* X-Axis Label: Probability (1 to 5) */}
                      <div className="flex items-center space-x-1 pt-2">
                        <span className="w-4"></span>
                        <div className="grid grid-cols-5 gap-1 flex-1 text-center font-semibold text-xs text-slate-400">
                          <span>1 (Rare)</span>
                          <span>2 (Unlikely)</span>
                          <span>3 (Possible)</span>
                          <span>4 (Likely)</span>
                          <span>5 (Certain)</span>
                        </div>
                      </div>
                      <div className="text-center font-bold text-xs text-slate-400 pt-1">PROBABILITY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Category Distribution & Priority Threats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Risk Taxonomy Distribution</h3>
                <div className="space-y-2.5">
                  {Object.entries(analytics?.categoryDistribution || {}).length === 0 ? (
                    <div className="text-xs text-slate-400 py-4 text-center">No risk categories recorded yet.</div>
                  ) : (
                    Object.entries(analytics?.categoryDistribution || {}).map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 capitalize">{cat.replace(/_/g, ' ').toLowerCase()}</span>
                        <span className="font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-3">Continuity Evacuation SLA</h3>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">Average Evacuation Time</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {analytics?.averageEvacuationTimeSeconds ? `${analytics.averageEvacuationTimeSeconds}s` : 'N/A'}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Institutional target: &le; 180 seconds across all campus zones.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ENTERPRISE RISK REGISTER */}
      {/* ========================================================================= */}
      {activeTab === 'risk_register' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search risk by code, title, department..."
                value={riskSearch}
                onChange={e => setRiskSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={riskCategoryFilter}
                onChange={e => setRiskCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="ALL">All Categories</option>
                <option value="STRATEGIC">Strategic</option>
                <option value="ACADEMIC_INTEGRITY">Academic Integrity</option>
                <option value="FINANCIAL_SUSTAINABILITY">Financial Sustainability</option>
                <option value="OPERATIONAL">Operational</option>
                <option value="LEGAL_REGULATORY">Legal & Regulatory</option>
                <option value="REPUTATIONAL">Reputational</option>
                <option value="CYBER_INFOSEC">Cyber & InfoSec</option>
                <option value="CAMPUS_SAFETY_HEALTH">Safety & Health</option>
                <option value="ENVIRONMENTAL_DISASTER">Environmental</option>
              </select>

              <select
                value={riskSeverityFilter}
                onChange={e => setRiskSeverityFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Risk Table */}
          {filteredRisks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No Risk Records Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No institutional risks match your criteria. Create your first risk register entry to start monitoring threats.
              </p>
              <button
                onClick={() => setShowRiskModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
              >
                Draft New Risk Item
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-3.5">Code & Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5 text-center">Inherent (P&times;I)</th>
                    <th className="p-3.5 text-center">Residual (P&times;I)</th>
                    <th className="p-3.5">Strategy</th>
                    <th className="p-3.5">Owner / Dept</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(filteredRisks || []).map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{r.riskCode}</div>
                        <div className="text-slate-600 font-medium">{r.title}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize text-slate-600">{r.category.replace(/_/g, ' ').toLowerCase()}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="font-semibold text-slate-800">
                          {r.inherentProbability} &times; {r.inherentImpact} = {r.inherentScore}
                        </div>
                        <div>{getSeverityBadge(r.inherentSeverity)}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="font-semibold text-slate-800">
                          {r.residualProbability} &times; {r.residualImpact} = {r.residualScore}
                        </div>
                        <div>{getSeverityBadge(r.residualSeverity)}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {r.strategy}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{r.riskOwnerName}</div>
                        <div className="text-[11px] text-slate-400">{r.riskOwnerDepartment}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            r.status === 'APPROVED' || r.status === 'ACTIVE_MONITORED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'SUBMITTED_FOR_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {r.status === 'DRAFT' && (
                          <button
                            onClick={() => handleSubmitRisk(r.id)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-medium hover:bg-amber-100"
                          >
                            Submit
                          </button>
                        )}
                        {r.status === 'SUBMITTED_FOR_REVIEW' && (
                          <button
                            onClick={() => handleApproveRisk(r.id)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedRiskForMitigation(r);
                            setShowMitigationModal(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-medium hover:bg-indigo-100"
                        >
                          + Control
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CAMPUS INCIDENT COMMAND CENTER (ICS) */}
      {/* ========================================================================= */}
      {activeTab === 'incident_command' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900">Incident Command Operations (ICS)</h3>
              <p className="text-xs text-slate-500">Live crisis triage, timeline logging, and role activations</p>
            </div>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Critical Incident</span>
            </button>
          </div>

          {/* Incident List */}
          {incidents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">All Campuses Secure</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Zero active incidents recorded. Continuous monitoring active.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(incidents || []).map(inc => (
                <div key={inc.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{inc.incidentNumber}</span>
                        {getIncidentSeverityBadge(inc.severity)}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{inc.title}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inc.status === 'RESOLVED' || inc.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <div><span className="text-slate-400">Location:</span> {inc.location}</div>
                    <div><span className="text-slate-400">Occurred:</span> {new Date(inc.occurredAt).toLocaleString()}</div>
                    <div><span className="text-slate-400">Commander:</span> {inc.incidentCommanderName || 'Not Assigned'}</div>
                    <div><span className="text-slate-400">Casualties:</span> {inc.casualtiesReported}</div>
                  </div>

                  <div className="text-xs text-slate-700">
                    <span className="font-semibold">Immediate Actions:</span> {inc.immediateActionsTaken || 'None logged.'}
                  </div>

                  {/* Incident Timeline */}
                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Timeline Log</span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {(inc.timeline || []).map(evt => (
                        <div key={evt.id} className="text-[11px] flex items-center justify-between text-slate-600">
                          <span>&bull; {evt.notes || evt.action}</span>
                          <span className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                    {inc.status !== 'COMMAND_ACTIVATED' && inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && (
                      <button
                        onClick={async () => {
                          if (!user) return;
                          await InstitutionalRiskService.activateIncidentCommand(
                            tenantId,
                            inc.id,
                            { commanderId: user.id, commanderName: user.name || 'Campus Commander' },
                            user
                          );
                          showFeedback('Incident Command System Activated');
                          loadData();
                        }}
                        className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-semibold hover:bg-red-100"
                      >
                        Activate ICS
                      </button>
                    )}

                    {inc.status !== 'RESOLVED' && inc.status !== 'CLOSED' && (
                      <button
                        onClick={async () => {
                          if (!user) return;
                          await InstitutionalRiskService.resolveIncident(tenantId, inc.id, 'Incident contained and resolved safely.', user);
                          showFeedback('Incident marked as resolved');
                          loadData();
                        }}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KEY RISK INDICATORS (KRIs) */}
      {/* ========================================================================= */}
      {activeTab === 'kri_watchlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900">Key Risk Indicators (KRIs)</h3>
              <p className="text-xs text-slate-500">Automated threshold metrics and early warning signals</p>
            </div>
            <button
              onClick={() => setShowKriModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New KRI Definition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(kris || []).map(kri => (
              <div key={kri.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-500">{kri.code}</span>
                  {getKriBadge(kri.status)}
                </div>
                <h4 className="font-bold text-sm text-slate-900">{kri.name}</h4>
                <div className="text-2xl font-bold text-slate-900">
                  {kri.currentValue} <span className="text-xs font-normal text-slate-500">{kri.metricUnit}</span>
                </div>

                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg">
                  <div>Normal Threshold: &le; {kri.normalThreshold}</div>
                  <div>Watch Threshold: &ge; {kri.watchThreshold}</div>
                  <div>Breach Threshold: &ge; {kri.breachThreshold}</div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Dept: {kri.responsibleDepartment}</span>
                  <button
                    onClick={async () => {
                      if (!user) return;
                      const input = prompt(`Enter new reading for ${kri.name}:`, String(kri.currentValue));
                      if (input !== null) {
                        await InstitutionalRiskService.recordKriEvaluation(tenantId, kri.id, Number(input), user);
                        showFeedback('KRI reading evaluated');
                        loadData();
                      }
                    }}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    + Record Reading
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BUSINESS CONTINUITY PLANS (BCP) & DRILLS */}
      {/* ========================================================================= */}
      {activeTab === 'business_continuity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900">Business Continuity & Disaster Recovery</h3>
              <p className="text-xs text-slate-500">Recovery objectives (RTO/RPO), procedures, and simulation drills</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDrillModal(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
              >
                + Schedule Drill
              </button>
              <button
                onClick={() => setShowBcpModal(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
              >
                + New BCP Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(bcps || []).map(bcp => (
              <div key={bcp.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-600">{bcp.code}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    {bcp.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{bcp.name}</h4>
                <div className="text-xs text-slate-600">Critical Function: {bcp.criticalFunction}</div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg">
                  <div><span className="text-slate-400">RTO (Max Downtime):</span> {bcp.rtoHours}h</div>
                  <div><span className="text-slate-400">RPO (Max Data Loss):</span> {bcp.rpoHours}h</div>
                  <div><span className="text-slate-400">Alt Facility:</span> {bcp.alternateOperatingFacility}</div>
                  <div><span className="text-slate-400">Team Lead:</span> {bcp.emergencyTeamLeadName}</div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold">Activation Trigger:</span> {bcp.activationTrigger}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: SAFETY AUDITS & CAPA */}
      {/* ========================================================================= */}
      {activeTab === 'safety_audits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900">Safety Audits & Corrective Actions (CAPA)</h3>
              <p className="text-xs text-slate-500">Fire safety, chemical lab checks, food sanitation, and CAR tracking</p>
            </div>
            <button
              onClick={() => setShowInspectionModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              + Schedule Inspection
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3.5">Inspection #</th>
                  <th className="p-3.5">Type & Facility</th>
                  <th className="p-3.5">Inspector</th>
                  <th className="p-3.5 text-center">Score</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(inspections || []).map(insp => (
                  <tr key={insp.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{insp.inspectionNumber}</td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 capitalize">{insp.inspectionType.replace(/_/g, ' ').toLowerCase()}</div>
                      <div className="text-[11px] text-slate-400">{insp.facilityLocation}</div>
                    </td>
                    <td className="p-3.5">{insp.inspectorName}</td>
                    <td className="p-3.5 text-center font-bold">{insp.overallScore > 0 ? `${insp.overallScore}%` : '-'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {insp.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {insp.status === 'SCHEDULED' && (
                        <button
                          onClick={async () => {
                            if (!user) return;
                            await InstitutionalRiskService.completeSafetyInspection(
                              tenantId,
                              insp.id,
                              {
                                overallScore: 92,
                                complianceStatus: 'COMPLIANT',
                                findings: [
                                  { id: 'f1', itemCategory: 'Extinguisher', observation: 'All valid', severity: 'OBSERVATION', capaRequired: false }
                                ]
                              },
                              user
                            );
                            showFeedback('Inspection completed');
                            loadData();
                          }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100"
                        >
                          Complete Audit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW RISK ITEM */}
      {/* ========================================================================= */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Draft New Institutional Risk Item</h3>
            <p className="text-xs text-slate-500 mb-4">Enterprise quantitative risk assessment matrix</p>

            <form onSubmit={handleCreateRisk} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Risk Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RSK-CYBER-01"
                    value={newRiskCode}
                    onChange={e => setNewRiskCode(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newRiskCategory}
                    onChange={e => setNewRiskCategory(e.target.value as RiskCategory)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="STRATEGIC">Strategic</option>
                    <option value="ACADEMIC_INTEGRITY">Academic Integrity</option>
                    <option value="FINANCIAL_SUSTAINABILITY">Financial Sustainability</option>
                    <option value="OPERATIONAL">Operational</option>
                    <option value="LEGAL_REGULATORY">Legal & Regulatory</option>
                    <option value="REPUTATIONAL">Reputational</option>
                    <option value="CYBER_INFOSEC">Cyber & InfoSec</option>
                    <option value="CAMPUS_SAFETY_HEALTH">Safety & Health</option>
                    <option value="ENVIRONMENTAL_DISASTER">Environmental Disaster</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Risk Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Student Data Ransomware Attack"
                  value={newRiskTitle}
                  onChange={e => setNewRiskTitle(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inherent Probability (1-5): {newInherentProb}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newInherentProb}
                    onChange={e => setNewInherentProb(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inherent Impact (1-5): {newInherentImpact}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={newInherentImpact}
                    onChange={e => setNewInherentImpact(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2 text-xs font-semibold text-indigo-700">
                  Calculated Inherent Score: {newInherentProb * newInherentImpact} / 25
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mitigation Strategy</label>
                  <select
                    value={newStrategy}
                    onChange={e => setNewStrategy(e.target.value as any)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="MITIGATE">Mitigate (Reduce P or I)</option>
                    <option value="AVOID">Avoid (Cease Activity)</option>
                    <option value="TRANSFER">Transfer (Insurance/Third Party)</option>
                    <option value="ACCEPT">Accept (Tolerate within Limits)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Responsible Dept</label>
                  <input
                    type="text"
                    placeholder="e.g. IT Security"
                    value={newRiskOwnerDept}
                    onChange={e => setNewRiskOwnerDept(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                >
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REPORT CRITICAL INCIDENT */}
      {/* ========================================================================= */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-red-600 mb-1 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Report Critical Incident</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Immediate Campus Incident Command Logging</p>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemical Spill in Chemistry Lab 3"
                  value={newIncTitle}
                  onChange={e => setNewIncTitle(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Type</label>
                  <select
                    value={newIncType}
                    onChange={e => setNewIncType(e.target.value as any)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="SAFETY_SECURITY">Safety & Security</option>
                    <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
                    <option value="FACILITY_FAILURE">Facility / Infrastructure Failure</option>
                    <option value="HAZARDOUS_MATERIALS">Hazardous Materials</option>
                    <option value="FIRE_OUTBREAK">Fire Outbreak</option>
                    <option value="CYBER_INCIDENT">Cyber / IT Incident</option>
                    <option value="SEVERE_WEATHER">Severe Weather / Flood</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Triage Severity Level</label>
                  <select
                    value={newIncSeverity}
                    onChange={e => setNewIncSeverity(e.target.value as any)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="LEVEL_1_MINOR">Level 1 (Minor - Localized)</option>
                    <option value="LEVEL_2_MODERATE">Level 2 (Moderate - Departmental)</option>
                    <option value="LEVEL_3_MAJOR">Level 3 (Major - Campus Wide)</option>
                    <option value="LEVEL_4_CRITICAL_DISASTER">Level 4 (Critical Disaster)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Campus Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Block, 2nd Floor, Room 204"
                  value={newIncLocation}
                  onChange={e => setNewIncLocation(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Immediate Actions Taken</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Room evacuated, ventilation engaged, campus security summoned."
                  value={newIncImmediateActions}
                  onChange={e => setNewIncImmediateActions(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium text-slate-700">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newIncEmergencyNotified}
                    onChange={e => setNewIncEmergencyNotified(e.target.checked)}
                  />
                  <span>Emergency Services (Police / Fire / Ambulance) Dispatched</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow"
                >
                  Dispatch & Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MITIGATION CONTROL */}
      {/* ========================================================================= */}
      {showMitigationModal && selectedRiskForMitigation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Risk Mitigation Control</h3>
            <p className="text-xs text-slate-500 mb-4">
              Linked to {selectedRiskForMitigation.riskCode}: {selectedRiskForMitigation.title}
            </p>

            <form onSubmit={handleCreateMitigation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action / Control Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement multi-factor authentication for student portal"
                  value={newMitTitle}
                  onChange={e => setNewMitTitle(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Control Type</label>
                  <select
                    value={newMitControlType}
                    onChange={e => setNewMitControlType(e.target.value as any)}
                    className="w-full p-2 text-xs border rounded-lg bg-white"
                  >
                    <option value="PREVENTIVE">Preventive</option>
                    <option value="DETECTIVE">Detective</option>
                    <option value="CORRECTIVE">Corrective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Allocated Budget ($)</label>
                  <input
                    type="number"
                    value={newMitBudget}
                    onChange={e => setNewMitBudget(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  required
                  value={newMitDueDate}
                  onChange={e => setNewMitDueDate(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowMitigationModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                >
                  Create Control Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW KRI DEFINITION */}
      {/* ========================================================================= */}
      {showKriModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">New Key Risk Indicator</h3>
            <p className="text-xs text-slate-500 mb-4">Define quantitative thresholds for early warning signals</p>

            <form onSubmit={handleCreateKri} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">KRI Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KRI-ATTN-01"
                    value={newKriCode}
                    onChange={e => setNewKriCode(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metric Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Count / %"
                    value={newKriUnit}
                    onChange={e => setNewKriUnit(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">KRI Metric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unresolved Campus Safety Incidents"
                  value={newKriName}
                  onChange={e => setNewKriName(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-700 mb-1">Normal (&le;)</label>
                  <input
                    type="number"
                    value={newKriNormal}
                    onChange={e => setNewKriNormal(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-700 mb-1">Watch (&ge;)</label>
                  <input
                    type="number"
                    value={newKriWatch}
                    onChange={e => setNewKriWatch(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-red-700 mb-1">Breach (&ge;)</label>
                  <input
                    type="number"
                    value={newKriBreach}
                    onChange={e => setNewKriBreach(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowKriModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                >
                  Save KRI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NEW BCP PLAN */}
      {/* ========================================================================= */}
      {showBcpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">New Business Continuity Plan</h3>
            <p className="text-xs text-slate-500 mb-4">Institutional recovery procedures and RTO/RPO objectives</p>

            <form onSubmit={handleCreateBcp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCP-ACAD-01"
                    value={newBcpCode}
                    onChange={e => setNewBcpCode(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Academic Examination"
                    value={newBcpDept}
                    onChange={e => setNewBcpDept(e.target.value)}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Examination Management Continuity Plan"
                  value={newBcpName}
                  onChange={e => setNewBcpName(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RTO (Hours Target)</label>
                  <input
                    type="number"
                    value={newBcpRto}
                    onChange={e => setNewBcpRto(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RPO (Hours Target)</label>
                  <input
                    type="number"
                    value={newBcpRpo}
                    onChange={e => setNewBcpRpo(Number(e.target.value))}
                    className="w-full p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alternate Facility Location</label>
                <input
                  type="text"
                  placeholder="e.g. Auxiliary Academic Hall & Remote Cloud LMS"
                  value={newBcpFacility}
                  onChange={e => setNewBcpFacility(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowBcpModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                >
                  Save BCP Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SCHEDULE SAFETY INSPECTION */}
      {/* ========================================================================= */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Schedule Safety Inspection</h3>
            <p className="text-xs text-slate-500 mb-4">Campus compliance and hazard assessment audit</p>

            <form onSubmit={handleCreateInspection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Type</label>
                <select
                  value={newInspType}
                  onChange={e => setNewInspType(e.target.value as any)}
                  className="w-full p-2 text-xs border rounded-lg bg-white"
                >
                  <option value="FIRE_SAFETY">Fire Safety & Extinguishers</option>
                  <option value="LAB_HAZARDS">Chemical & Laboratory Hazards</option>
                  <option value="ELECTRICAL_SAFETY">Electrical Safety & Panels</option>
                  <option value="STRUCTURAL_INTEGRITY">Structural & Exit Egress</option>
                  <option value="FOOD_SANITATION">Cafeteria Food Sanitation</option>
                  <option value="CAMPUS_SECURITY_PATROL">Security Patrol Perimeter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Block & Chemistry Wing"
                  value={newInspLocation}
                  onChange={e => setNewInspLocation(e.target.value)}
                  className="w-full p-2 text-xs border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
                >
                  Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
