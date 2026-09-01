import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  Database,
  Activity,
  Award,
  Link,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Eye,
  Sliders,
  Play,
  FileText,
  User,
  ShieldCheck,
  Zap,
  Info,
  UserCheck
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  DataIntelligenceTrustGovernanceService,
  generateDeterministicHash
} from '../../services/dataIntelligenceTrustGovernanceService';
import {
  DataTrustStrategy,
  DataDomainGovernance,
  DataSourceReference,
  DataAuthorityDeclaration,
  DataQualityPolicy,
  TrustDataQualityRule,
  DataQualityObservation,
  TrustDataCertification,
  DataProvenanceRecord,
  DataContractReference,
  DataSourceReliabilityObservation,
  DataReconciliationObservation,
  DataException,
  DataOverride,
  DecisionIntegrityObservation,
  DataTrustRisk,
  TrustDataGovernanceAuditEvent,
  DataTrustScenario,
  DataTrustSimulationResult,
  DataQualityStatus,
  DataCertificationStatus,
  DataAuthorityClassification,
  DataTrustRiskLevel
} from '../../types/dataIntelligenceTrustGovernance';

export default function DataIntelligenceTrustGovernanceWorkspace() {
  const { currentTenant, campuses } = useTenant();
  const { currentUser } = useAuth();
  const { notify } = useNotification();

  const tenantId = currentTenant?.id || 'default_tenant';
  const campusId = campuses?.[0]?.id || 'default_campus';
  const activeUserId = currentUser?.id || 'usr_steward_99';
  const activeUserRole = currentUser?.role || 'steward';

  // State parameters
  const [activeTab, setActiveTab] = useState<'command' | 'domains' | 'quality' | 'certification' | 'lineage' | 'sync' | 'exceptions' | 'sandbox' | 'diagnostics'>('command');

  // Master Data State
  const [strategies, setStrategies] = useState<DataTrustStrategy[]>([]);
  const [domains, setDomains] = useState<DataDomainGovernance[]>([]);
  const [sources, setSources] = useState<DataSourceReference[]>([]);
  const [authorities, setAuthorities] = useState<DataAuthorityDeclaration[]>([]);
  const [policies, setPolicies] = useState<DataQualityPolicy[]>([]);
  const [observations, setObservations] = useState<DataQualityObservation[]>([]);
  const [certifications, setCertifications] = useState<TrustDataCertification[]>([]);
  const [provenances, setProvenances] = useState<DataProvenanceRecord[]>([]);
  const [contracts, setContracts] = useState<DataContractReference[]>([]);
  const [reliability, setReliability] = useState<DataSourceReliabilityObservation[]>([]);
  const [reconciliation, setReconciliation] = useState<DataReconciliationObservation[]>([]);
  const [exceptions, setExceptions] = useState<DataException[]>([]);
  const [overrides, setOverrides] = useState<DataOverride[]>([]);
  const [auditEvents, setAuditEvents] = useState<TrustDataGovernanceAuditEvent[]>([]);
  const [diagnostics, setDiagnostics] = useState<DecisionIntegrityObservation[]>([]);
  const [risks, setRisks] = useState<DataTrustRisk[]>([]);

  // Simulation State
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<DataTrustSimulationResult | null>(null);

  // Forms Input States
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showObsModal, setShowObsModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Exception Form State
  const [excDomainId, setExcDomainId] = useState('');
  const [excRationale, setExcRationale] = useState('');
  const [excRisk, setExcRisk] = useState('');
  const [excControl, setExcControl] = useState('');
  const [excExpiry, setExcExpiry] = useState('');

  // Override Form State
  const [ovIndicatorId, setOvIndicatorId] = useState('');
  const [ovOriginalVal, setOvOriginalVal] = useState<number>(0);
  const [ovOverriddenVal, setOvOverriddenVal] = useState<number>(0);
  const [ovRationale, setOvRationale] = useState('');
  const [ovRisk, setOvRisk] = useState('');
  const [ovControl, setOvControl] = useState('');
  const [ovExpiry, setOvExpiry] = useState('');

  // Quality Observation Form State
  const [obsDomainId, setObsDomainId] = useState('');
  const [obsRecordId, setObsRecordId] = useState('');
  const [obsCompleteness, setObsCompleteness] = useState<number>(1.0);
  const [obsAccuracy, setObsAccuracy] = useState<number>(1.0);
  const [obsTimeliness, setObsTimeliness] = useState<number>(1.0);
  const [obsConsistency, setObsConsistency] = useState<number>(1.0);
  const [obsUniqueness, setObsUniqueness] = useState<number>(1.0);

  // Certification Form State
  const [certDomainId, setCertDomainId] = useState('');
  const [certEntityName, setCertEntityName] = useState('');
  const [certVersion, setCertVersion] = useState('1.0.0');
  const [certQualityScore, setCertQualityScore] = useState<number>(0.98);

  // Load and refresh services
  const refreshData = () => {
    setStrategies(DataIntelligenceTrustGovernanceService.getStrategies(tenantId));
    setDomains(DataIntelligenceTrustGovernanceService.getDomains(tenantId));
    setSources(DataIntelligenceTrustGovernanceService.getSources(tenantId));
    setAuthorities(DataIntelligenceTrustGovernanceService.getAuthorities(tenantId));
    setPolicies(DataIntelligenceTrustGovernanceService.getPolicies(tenantId));
    setObservations(DataIntelligenceTrustGovernanceService.getObservations(tenantId));
    setCertifications(DataIntelligenceTrustGovernanceService.getCertifications(tenantId));
    setProvenances(DataIntelligenceTrustGovernanceService.getProvenances(tenantId));
    setContracts(DataIntelligenceTrustGovernanceService.getContracts(tenantId));
    setReliability(DataIntelligenceTrustGovernanceService.getReliability(tenantId));
    setReconciliation(DataIntelligenceTrustGovernanceService.getReconciliation(tenantId));
    setExceptions(DataIntelligenceTrustGovernanceService.getExceptions(tenantId));
    setOverrides(DataIntelligenceTrustGovernanceService.getOverrides(tenantId));
    setAuditEvents(DataIntelligenceTrustGovernanceService.getAuditEvents(tenantId));
    setDiagnostics(DataIntelligenceTrustGovernanceService.runDiagnosticsCheck(tenantId));
    setRisks(DataIntelligenceTrustGovernanceService.getRisks(tenantId));
  };

  useEffect(() => {
    refreshData();
  }, [tenantId]);

  // Action Handlers
  const handleCreateException = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!excExpiry) {
        notify('A mandatory finite expiry date is required.', 'error');
        return;
      }
      DataIntelligenceTrustGovernanceService.createException(tenantId, campusId, {
        dataDomainIdRef: excDomainId,
        businessRationale: excRationale,
        riskAssessment: excRisk,
        compensatingControlRef: excControl,
        requesterUserIdRef: activeUserId,
        independentApproverUserIdRef: '',
        mandatoryExpiryTimestamp: excExpiry
      });
      notify('Governance exception proposal submitted successfully.', 'success');
      setShowExceptionModal(false);
      refreshData();
      // Reset form
      setExcRationale('');
      setExcRisk('');
      setExcControl('');
      setExcExpiry('');
    } catch (err: any) {
      notify(err.message || 'Failed to submit exception', 'error');
    }
  };

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!ovExpiry) {
        notify('A mandatory finite expiry date is required.', 'error');
        return;
      }
      DataIntelligenceTrustGovernanceService.createOverride(tenantId, campusId, {
        indicatorIdRef: ovIndicatorId,
        originalValue: ovOriginalVal,
        overriddenValue: ovOverriddenVal,
        businessRationale: ovRationale,
        riskAssessment: ovRisk,
        compensatingControlRef: ovControl,
        requesterUserIdRef: activeUserId,
        independentApproverUserIdRef: '',
        mandatoryExpiryTimestamp: ovExpiry
      });
      notify('Manual data override proposal submitted successfully.', 'success');
      setShowOverrideModal(false);
      refreshData();
      setOvIndicatorId('');
      setOvOriginalVal(0);
      setOvOverriddenVal(0);
      setOvRationale('');
      setOvRisk('');
      setOvControl('');
      setOvExpiry('');
    } catch (err: any) {
      notify(err.message || 'Failed to submit override', 'error');
    }
  };

  const handleCreateObservation = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      DataIntelligenceTrustGovernanceService.createObservation(tenantId, campusId, {
        dataDomainIdRef: obsDomainId,
        sourceRecordIdRef: obsRecordId || `rec_gen_${Math.floor(Math.random()*1000)}`,
        sourceModuleIdRef: 'mod_academics',
        completeness: obsCompleteness,
        accuracy: obsAccuracy,
        timeliness: obsTimeliness,
        consistency: obsConsistency,
        uniqueness: obsUniqueness
      });
      notify('New data quality observation logged and scored.', 'success');
      setShowObsModal(false);
      refreshData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleProposeCertification = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      DataIntelligenceTrustGovernanceService.proposeCertification(tenantId, campusId, {
        dataDomainIdRef: certDomainId,
        entityName: certEntityName,
        version: certVersion,
        overallQualityScore: certQualityScore,
        certifiedByUserIdRef: activeUserId
      });
      notify('Proposed new data certification review.', 'success');
      setShowCertModal(false);
      refreshData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleApproveException = (id: string) => {
    try {
      DataIntelligenceTrustGovernanceService.approveException(tenantId, id, activeUserId);
      notify('Four-Eyes exception approval signed off.', 'success');
      refreshData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleApproveOverride = (id: string) => {
    try {
      DataIntelligenceTrustGovernanceService.approveOverride(tenantId, id, activeUserId);
      notify('Four-Eyes override approval signed off.', 'success');
      refreshData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleCertifyData = (id: string) => {
    try {
      DataIntelligenceTrustGovernanceService.certifyData(tenantId, id, activeUserId);
      notify('Four-Eyes data certification signed and locked.', 'success');
      refreshData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleRunSimulation = () => {
    if (!selectedScenario) return;
    try {
      const res = DataIntelligenceTrustGovernanceService.runScenarioSimulation(selectedScenario);
      setSimulationResult(res);
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  // Helper colors
  const getQualityColor = (score: number) => {
    if (score >= 0.95) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 0.85) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getRiskBadgeColor = (level: DataTrustRiskLevel) => {
    switch (level) {
      case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MODERATE': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  // Calculate statistics
  const overallQuality = observations.length > 0
    ? (observations.reduce((acc, o) => acc + o.overallQualityScore, 0) / observations.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="dt_workspace_root">
      {/* Upper Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-xs" id="dt_header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900" id="dt_title">
              Data Trust & Intelligence Quality Governance Control Plane
            </h1>
            <p className="text-xs text-slate-500">
              Module: mod_data_intelligence_trust_governance • Core Verification Suite
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-3">
            <span className="text-xs text-slate-400 block font-medium">ACTIVE TRUST STEWARD</span>
            <span className="text-sm font-semibold text-slate-700 block">{activeUserId} ({activeUserRole})</span>
          </div>
          <button
            onClick={refreshData}
            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            title="Refresh Registry Engine"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-6" id="dt_nav_tabs">
        <div className="flex flex-wrap gap-2 py-2">
          {[
            { id: 'command', label: 'Command Center', icon: ShieldCheck },
            { id: 'domains', label: 'Data Domains & Sources', icon: Layers },
            { id: 'quality', label: 'Quality Observatory', icon: Activity },
            { id: 'certification', label: 'Certification Lifecycle', icon: Award },
            { id: 'lineage', label: 'Provenance & Lineage', icon: Link },
            { id: 'sync', label: 'Reconciliation & Reliability', icon: RefreshCw },
            { id: 'exceptions', label: 'Exceptions & Overrides', icon: Sliders },
            { id: 'sandbox', label: 'What-If Sandbox', icon: Zap },
            { id: 'diagnostics', label: 'Diagnostics & Audit Logs', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6" id="dt_workspace_main">
        {/* Tab 1: Command Center */}
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dt_tab_command">
            {/* Stat Box 1: Overall Quality */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">ENTIRE INSTITUTION DATA QUALITY</span>
                <span className="text-4xl font-extrabold text-slate-900 block mt-1">
                  {overallQuality > 0 ? `${(overallQuality * 100).toFixed(1)}%` : 'INSUFFICIENT DATA'}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Active quality weightings applied</span>
                <span className="font-semibold text-slate-700">5 Metrics</span>
              </div>
            </div>

            {/* Stat Box 2: Institutional Risk Status */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">AGGREGATED RISK PROFILE</span>
                <span className="text-2xl font-extrabold text-indigo-700 block mt-2">
                  MODERATE (Score: 28)
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Core criticality constraints active</span>
                <span className="font-semibold text-slate-700">100% Monitored</span>
              </div>
            </div>

            {/* Stat Box 3: Certified Domains */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">ACTIVE QUALITY CERTIFICATIONS</span>
                <span className="text-4xl font-extrabold text-slate-900 block mt-1">
                  {certifications.filter(c => c.status === 'CERTIFIED').length} / {domains.length}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>Valid certification windows</span>
                <span className="font-semibold text-slate-700">180 Days</span>
              </div>
            </div>

            {/* Strategic Mandates & Vision */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs md:col-span-3">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Institutional Data Trust Strategies & Directives
              </h3>
              {strategies.length === 0 ? (
                <div className="text-center py-6 text-slate-400 border border-dashed rounded-lg">INSUFFICIENT DATA</div>
              ) : (
                <div className="space-y-4">
                  {strategies.map(s => (
                    <div key={s.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm">{s.name}</h4>
                        <span className="text-xs px-2.5 py-0.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ACTIVE STRATEGY
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{s.vision}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <div>
                          <span className="block font-medium">Steward Assignee</span>
                          <span className="font-bold text-slate-700">{s.stewardUserIdRef}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Governance Owner</span>
                          <span className="font-bold text-slate-700">{s.ownerUserIdRef}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Target Quality</span>
                          <span className="font-bold text-slate-700">{s.targetQualityScore * 100}%</span>
                        </div>
                        <div>
                          <span className="block font-medium">Max Risk Floor</span>
                          <span className="font-bold text-slate-700">{s.maxAllowedRiskLevel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Domains, Sources & Authority */}
        {activeTab === 'domains' && (
          <div className="space-y-6" id="dt_tab_domains">
            {/* Governed Domains */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                Institutional Data Domains & Steward Assignments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {domains.map(d => (
                  <div key={d.id} className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-xs transition-shadow">
                    <span className="text-xs font-bold text-indigo-600 block mb-1">DOMAIN CODE: {d.domainCode}</span>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{d.domainName}</h4>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between"><span className="text-slate-400">Owner:</span> <span className="font-semibold">{d.ownerUserIdRef}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Steward:</span> <span className="font-semibold">{d.stewardUserIdRef}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Criticality:</span> <span className="font-semibold text-red-600">{d.criticalityScore}/100</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources and Authorities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Sources Grid */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-600" />
                  Primary Connected Data Sources
                </h3>
                <div className="space-y-3">
                  {sources.map(src => (
                    <div key={src.id} className="flex justify-between items-center border border-slate-200 rounded-lg p-3 bg-slate-50">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block">{src.sourceCode} SYSTEM</span>
                        <h4 className="font-bold text-slate-900 text-sm">{src.sourceName}</h4>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          src.connectionStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {src.connectionStatus}
                        </span>
                        <span className="block text-xxs text-slate-400 mt-1">Steward: {src.stewardUserIdRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authority Declarations */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  Data Authority & Ownership Declarations
                </h3>
                <div className="space-y-3">
                  {authorities.map(auth => (
                    <div key={auth.id} className="border border-slate-200 rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-center mb-1.5">
                        <h4 className="font-bold text-slate-900 text-xs">{auth.entityName}</h4>
                        <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold rounded-md">
                          {auth.classification}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-2">"{auth.declarationRationale}"</p>
                      <div className="flex justify-between items-center text-xxs text-slate-400">
                        <span>Declarant: {auth.certifiedByUserIdRef || 'Unassigned'}</span>
                        <span>Approved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Quality Observatory */}
        {activeTab === 'quality' && (
          <div className="space-y-6" id="dt_tab_quality">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Deterministic Quality Verification Checks
                </h3>
                <button
                  onClick={() => setShowObsModal(true)}
                  className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Log Observation
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Entity Record</th>
                      <th className="py-3 px-4">Completeness</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Timeliness</th>
                      <th className="py-3 px-4">Consistency</th>
                      <th className="py-3 px-4">Uniqueness</th>
                      <th className="py-3 px-4">Quality Score</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {observations.map(obs => (
                      <tr key={obs.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div>
                            {obs.sourceRecordIdRef}
                            <span className="block text-xxs text-slate-400 font-normal">{obs.sourceModuleIdRef}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{(obs.completeness * 100).toFixed(0)}%</td>
                        <td className="py-3.5 px-4 font-mono">{(obs.accuracy * 100).toFixed(0)}%</td>
                        <td className="py-3.5 px-4 font-mono">{(obs.timeliness * 100).toFixed(0)}%</td>
                        <td className="py-3.5 px-4 font-mono">{(obs.consistency * 100).toFixed(0)}%</td>
                        <td className="py-3.5 px-4 font-mono">{(obs.uniqueness * 100).toFixed(0)}%</td>
                        <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono">{(obs.overallQualityScore * 100).toFixed(1)}%</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${getQualityColor(obs.overallQualityScore)}`}>
                            {obs.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Certification Hub */}
        {activeTab === 'certification' && (
          <div className="space-y-6" id="dt_tab_certification">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Active Data Certification Registries
                </h3>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Propose Certification
                </button>
              </div>

              <div className="space-y-4">
                {certifications.map(cert => {
                  const isPending = cert.status === 'UNDER_REVIEW' || cert.status === 'PENDING_VERIFICATION';
                  const isSelfProposer = cert.certifiedByUserIdRef === activeUserId;
                  return (
                    <div key={cert.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{cert.entityName}</h4>
                          <span className="text-xs px-2 py-0.5 font-bold bg-white border border-slate-200 text-slate-500 rounded-md">
                            VERSION {cert.version}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 mt-2">
                          <div>
                            <span className="block font-medium">Proposed By</span>
                            <span className="font-semibold text-slate-700">{cert.certifiedByUserIdRef}</span>
                          </div>
                          <div>
                            <span className="block font-medium">Quality Rating</span>
                            <span className="font-semibold text-indigo-600">{(cert.overallQualityScore * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="block font-medium">Issued On</span>
                            <span className="font-semibold text-slate-700">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="block font-medium">Expires On</span>
                            <span className="font-semibold text-slate-700">{new Date(cert.expiresAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-bold border rounded-full ${
                          cert.status === 'CERTIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {cert.status}
                        </span>

                        {isPending && (
                          <button
                            onClick={() => handleCertifyData(cert.id)}
                            disabled={isSelfProposer}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border ${
                              isSelfProposer
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                            }`}
                            title={isSelfProposer ? 'Separation of duties: Proposer cannot approve' : 'Sign off certification'}
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Approve Sign-off
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Provenance & Lineage */}
        {activeTab === 'lineage' && (
          <div className="space-y-6" id="dt_tab_lineage">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lineage Visual Board */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs lg:col-span-2">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Link className="h-5 w-5 text-indigo-600" />
                  Cryptographic Lineage Map Transformation Topology
                </h3>
                {/* Simulated SVG Graph Nodes & Edges */}
                <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="grid grid-cols-3 gap-8 items-center w-full max-w-lg text-center">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
                      <span className="text-xxs text-indigo-600 font-bold block">SOURCE SYSTEM</span>
                      <span className="text-xs font-bold">SIS Registrar Db</span>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg shadow-xs relative">
                      <span className="text-xxs text-indigo-700 font-bold block">TRANSFORMATION</span>
                      <span className="text-xs font-bold">GPA Aggregation</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs">
                      <span className="text-xxs text-emerald-600 font-bold block">DECISION OUTPUT</span>
                      <span className="text-xs font-bold">Executive Council</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center text-xs text-slate-400">
                    <Info className="h-4 w-4 inline mr-1" />
                    All records validated through sequential lineage hash chains.
                  </div>
                </div>
              </div>

              {/* Data Provenance Ledger */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Provenance Trace Ledgers
                </h3>
                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {provenances.map(prov => (
                    <div key={prov.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 mb-1">
                        <span>Record: {prov.sourceRecordIdRef}</span>
                        <span className="text-xxs text-slate-400">{prov.sourceModuleIdRef}</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        <div><span className="font-semibold text-slate-400">Authority:</span> {prov.authoritativeSystemIdRef}</div>
                        <div><span className="font-semibold text-slate-400">Formula:</span> {prov.calculationBasis}</div>
                        <div className="pt-2 border-t border-slate-100 font-mono text-[9px] text-indigo-600">
                          <span className="block text-xxs font-sans font-semibold text-slate-400">Hash chain block:</span>
                          {prov.provenanceHash.substring(0, 32)}...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Reconciliation & Reliability */}
        {activeTab === 'sync' && (
          <div className="space-y-6" id="dt_tab_sync">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reconciliation Logs */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-indigo-600" />
                  Dual-System Reconciliation Auditing
                </h3>
                <div className="space-y-4">
                  {reconciliation.map(recon => (
                    <div key={recon.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">Invoicing & Registration Cross-Check</h4>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {recon.reconciliationStatus}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                        <div className="border border-slate-200 rounded-md p-2 bg-white">
                          <span className="block text-slate-400 text-xxs font-bold">REGISTRAR RECORD COUNT</span>
                          <span className="block font-bold text-slate-800 text-sm">{recon.recordCountA}</span>
                        </div>
                        <div className="border border-slate-200 rounded-md p-2 bg-white">
                          <span className="block text-slate-400 text-xxs font-bold">LMS COUNT</span>
                          <span className="block font-bold text-slate-800 text-sm">{recon.recordCountB}</span>
                        </div>
                        <div className="border border-slate-200 rounded-md p-2 bg-white">
                          <span className="block text-slate-400 text-xxs font-bold">VARIANCE COUNT</span>
                          <span className="block font-bold text-red-600 text-sm">{recon.varianceCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Reliability */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Pipeline Latency & Reliability Logs
                </h3>
                <div className="space-y-3">
                  {reliability.map(rel => (
                    <div key={rel.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{rel.dataSourceIdRef}</h4>
                        <span className="text-xxs text-slate-400">Measured: {new Date(rel.measuredAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right space-y-1">
                        <div><span className="font-semibold text-slate-400">Availability Rate:</span> <span className="font-bold text-indigo-700">{(rel.availabilityRate * 100).toFixed(2)}%</span></div>
                        <div><span className="font-semibold text-slate-400">Avg Response Latency:</span> <span className="font-bold text-slate-700">{rel.latencyMs}ms</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Exceptions & Overrides */}
        {activeTab === 'exceptions' && (
          <div className="space-y-6" id="dt_tab_exceptions">
            {/* Action Panel */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowExceptionModal(true)}
                className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Propose Exception
              </button>
              <button
                onClick={() => setShowOverrideModal(true)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Propose Override
              </button>
            </div>

            {/* Exceptions Grid */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-600" />
                Active Governance Exceptions
              </h3>
              {exceptions.length === 0 ? (
                <div className="text-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-lg">INSUFFICIENT DATA</div>
              ) : (
                <div className="space-y-4">
                  {exceptions.map(exc => {
                    const isSelfProposer = exc.requesterUserIdRef === activeUserId;
                    return (
                      <div key={exc.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-slate-900 text-sm">Rationale: {exc.businessRationale}</h4>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 mt-2">
                            <div><span className="block font-medium">Requester</span> <span className="font-semibold text-slate-700">{exc.requesterUserIdRef}</span></div>
                            <div><span className="block font-medium">Compensating Control</span> <span className="font-semibold text-slate-700">{exc.compensatingControlRef}</span></div>
                            <div><span className="block font-medium">Risk Assessment</span> <span className="font-semibold text-slate-700">{exc.riskAssessment}</span></div>
                            <div><span className="block font-medium">Expiry Timestamp</span> <span className="font-semibold text-red-600">{new Date(exc.mandatoryExpiryTimestamp).toLocaleDateString()}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-bold border rounded-full ${
                            exc.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {exc.isApproved ? `Approved by ${exc.independentApproverUserIdRef}` : 'PENDING'}
                          </span>
                          {!exc.isApproved && (
                            <button
                              onClick={() => handleApproveException(exc.id)}
                              disabled={isSelfProposer}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                                isSelfProposer
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                              }`}
                              title={isSelfProposer ? 'Four-Eyes SoD: Proposer cannot approve' : 'Sign off approval'}
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Overrides Grid */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-600" />
                Active Manual Data Overrides
              </h3>
              {overrides.length === 0 ? (
                <div className="text-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-lg">INSUFFICIENT DATA</div>
              ) : (
                <div className="space-y-4">
                  {overrides.map(ov => {
                    const isSelfProposer = ov.requesterUserIdRef === activeUserId;
                    return (
                      <div key={ov.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-slate-900 text-sm">Indicator Override: {ov.indicatorIdRef}</h4>
                            <span className="text-xs font-bold bg-white border px-2 py-0.5 text-slate-600 rounded-md">
                              {ov.originalValue} {"\u2192"} {ov.overriddenValue}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-500 mt-2">
                            <div><span className="block font-medium">Rationale</span> <span className="font-semibold text-slate-700">{ov.businessRationale}</span></div>
                            <div><span className="block font-medium">Compensating Control</span> <span className="font-semibold text-slate-700">{ov.compensatingControlRef}</span></div>
                            <div><span className="block font-medium">Requester</span> <span className="font-semibold text-slate-700">{ov.requesterUserIdRef}</span></div>
                            <div><span className="block font-medium">Expiry Timestamp</span> <span className="font-semibold text-red-600">{new Date(ov.mandatoryExpiryTimestamp).toLocaleDateString()}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-bold border rounded-full ${
                            ov.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ov.isApproved ? `Approved by ${ov.independentApproverUserIdRef}` : 'PENDING'}
                          </span>
                          {!ov.isApproved && (
                            <button
                              onClick={() => handleApproveOverride(ov.id)}
                              disabled={isSelfProposer}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                                isSelfProposer
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                              }`}
                              title={isSelfProposer ? 'Four-Eyes SoD: Proposer cannot approve' : 'Sign off approval'}
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: What-If Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6" id="dt_tab_sandbox">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600" />
                Data Trust What-If Sandbox Resilience Simulator
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Execute isolated, entirely in-memory resilience tests to model impacts of system outages, data corruption, and cascading trust failures.
              </p>

              {/* Selection Control */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Choose Resilience Scenario (15 Available) --</option>
                  {DataIntelligenceTrustGovernanceService.getScenarios().map(sc => (
                    <option key={sc.code} value={sc.code}>{sc.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleRunSimulation}
                  disabled={!selectedScenario}
                  className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Play className="h-4 w-4" /> Execute Simulation
                </button>
              </div>

              {/* Simulation Result Output */}
              {simulationResult ? (
                <div className="space-y-4">
                  {/* Visual SandBox Disclaimer Banner */}
                  <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold text-center uppercase tracking-wider rounded-lg">
                    {simulationResult.diagnosticBanner}
                  </div>

                  <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                    <h4 className="font-extrabold text-slate-900 text-sm mb-3">
                      Scenario Code: {simulationResult.scenarioCode} • {simulationResult.scenarioName}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div className="border border-slate-200 bg-white rounded-lg p-3">
                        <span className="text-xxs text-slate-400 font-bold block">IMPACT SCORE</span>
                        <span className="text-xl font-black text-red-600">{simulationResult.impactScore}/100</span>
                      </div>
                      <div className="border border-slate-200 bg-white rounded-lg p-3">
                        <span className="text-xxs text-slate-400 font-bold block">SIMULATED QUALITY</span>
                        <span className="text-xl font-black text-slate-700">{(simulationResult.simulatedQualityScore * 100).toFixed(0)}%</span>
                      </div>
                      <div className="border border-slate-200 bg-white rounded-lg p-3">
                        <span className="text-xxs text-slate-400 font-bold block">SIMULATED RISK LEVEL</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadgeColor(simulationResult.simulatedRiskLevel)}`}>
                          {simulationResult.simulatedRiskLevel}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <h5 className="font-bold text-xs text-slate-500 mb-2 uppercase">Recommended Core Mitigation Protocols:</h5>
                      <ul className="space-y-2">
                        {simulationResult.remediationSteps.map((step, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="text-indigo-600 font-black">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 border border-dashed rounded-lg">
                  <Zap className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                  Select and run a simulation scenario to see real-time impact analysis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 9: Diagnostics & Ledger Trail */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6" id="dt_tab_diagnostics">
            {/* Automated Diagnostics */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Automated Integrity Verification Diagnostics
              </h3>
              {diagnostics.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> All integrity, lineage, and Four-Eyes SoD rules verified 100% compliant.
                </div>
              ) : (
                <div className="space-y-3">
                  {diagnostics.map(diag => (
                    <div key={diag.id} className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
                      <div>
                        <span className="text-xxs text-red-700 font-bold block mb-1">DIAGNOSTIC ALARM: {diag.diagnosticType}</span>
                        <p className="text-xs text-slate-700">{diag.description}</p>
                      </div>
                      <span className="text-xxs bg-red-100 text-red-800 font-bold border border-red-200 px-2 py-0.5 rounded-md">
                        {diag.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cryptographic Ledger Trail */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Immutable Append-Only Data Governance Audit Ledger
              </h3>
              {auditEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 border border-dashed rounded-lg">INSUFFICIENT DATA</div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto font-mono text-xs">
                  {auditEvents.map(evt => (
                    <div key={evt.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                      <div className="flex justify-between items-center mb-1 text-slate-900 font-bold">
                        <span>Action: {evt.actionCode}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{new Date(evt.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        <div>Tenant: {evt.tenantId} • Campus: {evt.campusId} • Actor: {evt.actorUserIdRef}</div>
                        <div className="text-indigo-600 truncate mt-1">Prev Hash: {evt.previousHash}</div>
                        <div className="text-indigo-700 truncate">Curr Hash: {evt.currentHash}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Exception Propose Modal */}
      {showExceptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Propose Governance Exception</h4>
            <form onSubmit={handleCreateException} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select Data Domain</label>
                <select
                  value={excDomainId}
                  onChange={(e) => setExcDomainId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                >
                  <option value="">-- Choose Domain --</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.domainName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Business Rationale</label>
                <textarea
                  value={excRationale}
                  onChange={(e) => setExcRationale(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Compensating Control Reference</label>
                <input
                  type="text"
                  value={excControl}
                  onChange={(e) => setExcControl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Risk Assessment Description</label>
                <input
                  type="text"
                  value={excRisk}
                  onChange={(e) => setExcRisk(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mandatory Expiry Date</label>
                <input
                  type="date"
                  value={excExpiry}
                  onChange={(e) => setExcExpiry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-indigo-700"
                >
                  Submit Proposal
                </button>
                <button
                  type="button"
                  onClick={() => setShowExceptionModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Override Propose Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Propose Manual Metric Override</h4>
            <form onSubmit={handleCreateOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target Indicator Code</label>
                <input
                  type="text"
                  value={ovIndicatorId}
                  onChange={(e) => setOvIndicatorId(e.target.value)}
                  placeholder="e.g. ACAD-METRIC-GP"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Original Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={ovOriginalVal}
                    onChange={(e) => setOvOriginalVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Overridden Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={ovOverriddenVal}
                    onChange={(e) => setOvOverriddenVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Business Rationale</label>
                <textarea
                  value={ovRationale}
                  onChange={(e) => setOvRationale(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Compensating Control Reference</label>
                <input
                  type="text"
                  value={ovControl}
                  onChange={(e) => setOvControl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Risk Assessment Description</label>
                <input
                  type="text"
                  value={ovRisk}
                  onChange={(e) => setOvRisk(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mandatory Expiry Date</label>
                <input
                  type="date"
                  value={ovExpiry}
                  onChange={(e) => setOvExpiry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-indigo-700"
                >
                  Submit Override
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quality Observation Modal */}
      {showObsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Log Quality Observation</h4>
            <form onSubmit={handleCreateObservation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target Data Domain</label>
                <select
                  value={obsDomainId}
                  onChange={(e) => setObsDomainId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                >
                  <option value="">-- Choose Domain --</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.domainName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Source Record ID Reference</label>
                <input
                  type="text"
                  value={obsRecordId}
                  onChange={(e) => setObsRecordId(e.target.value)}
                  placeholder="e.g. rec_grade_202"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Completeness (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={obsCompleteness}
                    onChange={(e) => setObsCompleteness(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Accuracy (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={obsAccuracy}
                    onChange={(e) => setObsAccuracy(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Timeliness (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={obsTimeliness}
                    onChange={(e) => setObsTimeliness(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Consistency (0-1)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={obsConsistency}
                    onChange={(e) => setObsConsistency(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Uniqueness (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={obsUniqueness}
                  onChange={(e) => setObsUniqueness(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-indigo-700"
                >
                  Log Observation
                </button>
                <button
                  type="button"
                  onClick={() => setShowObsModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Proposal Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Propose Data Certification</h4>
            <form onSubmit={handleProposeCertification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Data Domain</label>
                <select
                  value={certDomainId}
                  onChange={(e) => setCertDomainId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                >
                  <option value="">-- Choose Domain --</option>
                  {domains.map(d => (
                    <option key={d.id} value={d.id}>{d.domainName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Entity Name</label>
                <input
                  type="text"
                  value={certEntityName}
                  onChange={(e) => setCertEntityName(e.target.value)}
                  placeholder="e.g. AcademicEnrollments"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Version String</label>
                  <input
                    type="text"
                    value={certVersion}
                    onChange={(e) => setCertVersion(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Verified Quality Score (0-1)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={certQualityScore}
                    onChange={(e) => setCertQualityScore(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-indigo-700"
                >
                  Propose Certification
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="flex-1 bg-slate-100 text-slate-700 text-xs font-semibold py-2 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
