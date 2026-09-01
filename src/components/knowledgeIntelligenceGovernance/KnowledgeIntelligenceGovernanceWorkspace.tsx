import React, { useState, useEffect } from 'react';
import {
  Brain,
  Layers,
  Database,
  Shield,
  Activity,
  CheckCircle,
  FileText,
  Clock,
  Plus,
  AlertTriangle,
  Play,
  HelpCircle,
  Link,
  ShieldCheck,
  User,
  Zap,
  Info,
  UserCheck,
  ArrowRight,
  Bookmark,
  BookOpen,
  Award,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  AlertCircle,
  Compass,
  FileSignature
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  KnowledgeIntelligenceGovernanceService,
  generateDeterministicHash
} from '../../services/knowledgeIntelligenceGovernanceService';
import {
  KnowledgeStrategy,
  KnowledgeDomainGovernance,
  KnowledgeObject,
  KnowledgeSourceReference,
  KnowledgeEvidenceReference,
  KnowledgeProvenanceRecord,
  KnowledgeVerification,
  KnowledgeTrustAssessment,
  KnowledgeLifecycleEvent,
  KnowledgeDecisionRecord,
  KnowledgeDecisionRationale,
  KnowledgeDecisionPrecedent,
  KnowledgeLessonLearned,
  KnowledgeBestPractice,
  KnowledgeInstitutionalInsight,
  KnowledgeResearchFinding,
  KnowledgeContradiction,
  KnowledgeConflictResolution,
  KnowledgeReviewCycle,
  KnowledgeIntelligenceException,
  KnowledgeOverride,
  KnowledgeRetrievalRequest,
  KnowledgeRetrievalPolicy,
  KnowledgeRetrievalEvidence,
  KnowledgeAccessDecision,
  KnowledgeIntelligenceRisk,
  KnowledgeResilienceAssessment,
  KnowledgeScenario,
  KnowledgeSimulationResult,
  KnowledgeGovernanceApproval,
  KnowledgeGovernanceDecision,
  KnowledgeGovernanceAuditEvent,
  KnowledgeDiagnostic,
  KnowledgeLifecycleStatus,
  KnowledgeTrustClassification,
  KnowledgeRiskLevel
} from '../../types/knowledgeIntelligenceGovernance';

export default function KnowledgeIntelligenceGovernanceWorkspace() {
  const { currentTenant } = useTenant();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const tenantId = currentTenant?.id || 'default_tenant';
  const campusId = 'default_campus';

  // State Management
  const [activeTab, setActiveTab] = useState<'command' | 'provenance' | 'memory' | 'access' | 'risk_sandbox'>('command');

  // Core repositories
  const [strategies, setStrategies] = useState<KnowledgeStrategy[]>([]);
  const [domains, setDomains] = useState<KnowledgeDomainGovernance[]>([]);
  const [objects, setObjects] = useState<KnowledgeObject[]>([]);
  const [sources, setSources] = useState<KnowledgeSourceReference[]>([]);
  const [decisions, setDecisions] = useState<KnowledgeDecisionRecord[]>([]);
  const [lessons, setLessons] = useState<KnowledgeLessonLearned[]>([]);
  const [exceptions, setExceptions] = useState<KnowledgeIntelligenceException[]>([]);
  const [overrides, setOverrides] = useState<KnowledgeOverride[]>([]);
  const [contradictions, setContradictions] = useState<KnowledgeContradiction[]>([]);
  const [diagnostics, setDiagnostics] = useState<KnowledgeDiagnostic[]>([]);
  const [auditEvents, setAuditEvents] = useState<KnowledgeGovernanceAuditEvent[]>([]);
  const [risks, setRisks] = useState<KnowledgeIntelligenceRisk[]>([]);

  // Selected sub-elements for secondary details
  const [selectedObjId, setSelectedObjId] = useState<string>('kn_obj_01');
  const [selectedDecId, setSelectedDecId] = useState<string>('dec_rec_01');

  // Input states for interactive actions (requires Four-Eyes verification)
  const [proposerId, setProposerId] = useState<string>('usr_steward_01');
  const [approverId, setApproverId] = useState<string>('usr_auditor_01');

  // Exception Form State
  const [showExcForm, setShowExcForm] = useState(false);
  const [excType, setExcType] = useState<'UNVERIFIED_KNOWLEDGE_USE' | 'MISSING_PROVENANCE' | 'SUPERSEDED_ACTIVE_USE'>('UNVERIFIED_KNOWLEDGE_USE');
  const [excTarget, setExcTarget] = useState('kn_obj_02');
  const [excRationale, setExcRationale] = useState('');
  const [excControls, setExcControls] = useState('');
  const [excExpiry, setExcExpiry] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Override Form State
  const [showOvForm, setShowOvForm] = useState(false);
  const [ovTarget, setOvTarget] = useState('kn_obj_02');
  const [ovField, setOvField] = useState('trustScore');
  const [ovOriginal, setOvOriginal] = useState('0.65');
  const [ovValue, setOvValue] = useState('0.85');
  const [ovJustification, setOvJustification] = useState('');
  const [ovExpiry, setOvExpiry] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Transition Form State
  const [selectedTargetStatus, setSelectedTargetStatus] = useState<KnowledgeLifecycleStatus>('PUBLISHED');
  const [transitionRationale, setTransitionRationale] = useState('');

  // Retrieval Test Sandbox State
  const [retrievalDomain, setRetrievalDomain] = useState('ACADEMICS');
  const [retrievalSensitivity, setRetrievalSensitivity] = useState<'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'HIGHLY_CONFIDENTIAL'>('INTERNAL');
  const [retrievalPurpose, setRetrievalPurpose] = useState('Standard Academic Record Verification');
  const [retrievalRole, setRetrievalRole] = useState('steward');
  const [retrievalResult, setRetrievalResult] = useState<any>(null);

  // What-If Sandbox Simulation State
  const [selectedScenarioCode, setSelectedScenarioCode] = useState<string>('KNOWLEDGE_SOURCE_OUTAGE');
  const [simResult, setSimResult] = useState<KnowledgeSimulationResult | null>(null);

  // Refresh and load data
  const loadData = () => {
    setStrategies(KnowledgeIntelligenceGovernanceService.getStrategies(tenantId));
    setDomains(KnowledgeIntelligenceGovernanceService.getDomains(tenantId));
    setObjects(KnowledgeIntelligenceGovernanceService.getObjects(tenantId));
    setSources(KnowledgeIntelligenceGovernanceService.getSources(tenantId));
    setDecisions(KnowledgeIntelligenceGovernanceService.getDecisionRecords(tenantId));
    setLessons(KnowledgeIntelligenceGovernanceService.getLessonsLearned(tenantId));
    setExceptions(KnowledgeIntelligenceGovernanceService.getExceptions(tenantId));
    setOverrides(KnowledgeIntelligenceGovernanceService.getOverrides(tenantId));
    setContradictions(KnowledgeIntelligenceGovernanceService.detectKnowledgeContradictions(tenantId));
    setDiagnostics(KnowledgeIntelligenceGovernanceService.runKnowledgeDiagnostics(tenantId));
    setAuditEvents(KnowledgeIntelligenceGovernanceService.getAuditEvents(tenantId));
    
    // Refresh risk levels
    const activeObjects = KnowledgeIntelligenceGovernanceService.getObjects(tenantId);
    const updatedRisks = activeObjects.map(obj => {
      const isStale = new Date(obj.nextReviewDate).getTime() < Date.now();
      const scoreObj = KnowledgeIntelligenceGovernanceService.calculateKnowledgeRisk({
        criticality: obj.classificationSensitivity === 'HIGHLY_CONFIDENTIAL' ? 0.9 : 0.4,
        sourceReliability: obj.trustScore,
        freshnessDegradation: isStale ? 0.8 : 0.1,
        evidenceWeakness: obj.status === 'PUBLISHED' ? 0.1 : 0.6,
        provenanceWeakness: 0.2,
        contradictionExposure: 0.1,
        dependencyConcentration: 0.2,
        accessSensitivity: obj.classificationSensitivity === 'HIGHLY_CONFIDENTIAL' ? 0.9 : 0.3
      });
      return {
        id: `risk_${obj.id}`,
        tenantId,
        targetObjectIdRef: obj.id,
        riskType: (isStale ? 'STALE_KNOWLEDGE' : 'UNVERIFIED_CLAIM') as any,
        inherentScore: scoreObj.riskScore * 1.2,
        residualScore: scoreObj.riskScore,
        criticalityScore: obj.classificationSensitivity === 'HIGHLY_CONFIDENTIAL' ? 0.9 : 0.4,
        reliabilityDeclineScore: 0.1,
        freshnessDeclineScore: isStale ? 0.8 : 0.1,
        evidenceDeficiencyScore: 0.2,
        riskRating: scoreObj.riskRating,
        mitigationPlan: `Verify with registered owner: ${obj.ownerUserIdRef}`,
        createdAt: new Date().toISOString()
      };
    });
    setRisks(updatedRisks);
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  // Execute State Transition
  const handleLifecycleTransition = (objId: string) => {
    try {
      KnowledgeIntelligenceGovernanceService.executeLifecycleTransition(
        tenantId,
        campusId,
        objId,
        selectedTargetStatus,
        proposerId,
        approverId,
        transitionRationale || 'Triggered through control panel.'
      );
      addNotification('Success', `Transition to ${selectedTargetStatus} verified & published under Four-Eyes control.`, 'success');
      setTransitionRationale('');
      loadData();
    } catch (err: any) {
      addNotification('Governance Error', err.message, 'error');
    }
  };

  // Propose Exception (requires 4-eyes)
  const handleCreateException = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      KnowledgeIntelligenceGovernanceService.proposeException(
        tenantId,
        campusId,
        proposerId,
        approverId,
        excType,
        excTarget,
        excRationale,
        excControls,
        new Date(excExpiry).toISOString()
      );
      addNotification('Success', 'Strategic exception approved and recorded to the trust ledger.', 'success');
      setShowExcForm(false);
      setExcRationale('');
      setExcControls('');
      loadData();
    } catch (err: any) {
      addNotification('Verification Failure', err.message, 'error');
    }
  };

  // Propose Override (requires 4-eyes)
  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      KnowledgeIntelligenceGovernanceService.proposeOverride(
        tenantId,
        campusId,
        proposerId,
        approverId,
        ovTarget,
        ovField,
        ovOriginal,
        ovValue,
        ovJustification,
        new Date(ovExpiry).toISOString()
      );
      addNotification('Success', 'Manual indicator override authorized and updated on the trust ledger.', 'success');
      setShowOvForm(false);
      setOvJustification('');
      loadData();
    } catch (err: any) {
      addNotification('Verification Failure', err.message, 'error');
    }
  };

  // Run Retrieval Test
  const handleRetrievalTest = () => {
    const res = KnowledgeIntelligenceGovernanceService.requestRetrieval(
      tenantId,
      campusId,
      proposerId,
      retrievalDomain,
      retrievalPurpose,
      retrievalSensitivity,
      retrievalRole
    );
    setRetrievalResult(res);
    addNotification('Access Evaluation Completed', `Retrieval classification: ${res.decision.decision}`, 'info');
  };

  // Run What-If Simulation Scenario
  const handleRunSimulation = () => {
    const res = KnowledgeIntelligenceGovernanceService.executeKnowledgeSimulation(selectedScenarioCode);
    setSimResult(res);
    addNotification('Simulation Run Complete', `Resilience impact evaluated for: ${selectedScenarioCode}`, 'success');
  };

  // Resolve Contradiction
  const handleResolveContradiction = (conId: string) => {
    try {
      KnowledgeIntelligenceGovernanceService.proposeConflictResolution(
        tenantId,
        campusId,
        conId,
        'RETAIN_A_RETIRE_B',
        'Retain official GPA directives and archive unverified legacy files.',
        proposerId,
        approverId
      );
      addNotification('Success', 'Syllabus/Decision contradiction resolved successfully.', 'success');
      loadData();
    } catch (err: any) {
      addNotification('Authorization Error', err.message, 'error');
    }
  };

  // Find related selected objects for secondary details
  const activeObj = objects.find(o => o.id === selectedObjId);
  const activeDec = decisions.find(d => d.id === selectedDecId);

  // Derive truth metrics
  const activeCount = objects.length;
  const verifiedCount = objects.filter(o => o.status === 'PUBLISHED').length;
  const contradictionCount = contradictions.filter(c => c.status === 'DETECTED').length;
  const criticalRiskCount = risks.filter(r => r.riskRating === 'CRITICAL').length;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 min-h-screen text-slate-800 dark:text-slate-200">
      
      {/* Header Info Band */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Brain className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Phase 9.4 Institutional Knowledge &amp; Decision Control Plane
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reference-only governance, organizational memory, and trusted decision lineage verification.
                </p>
              </div>
            </div>
          </div>

          {/* Core Telemetry Indicators */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Governed Objects: <span className="text-indigo-600">{activeCount}</span></span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified: <span className="text-emerald-600">{verifiedCount}</span></span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Conflicts: <span className="text-amber-600">{contradictionCount}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Global Four-Eyes Control Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Enforced Four-Eyes Separation of Duties (SoD) Active</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                All lifecycle transitions, overrides, exceptions, and resolutions require distinct proposer and auditor credentials. No self-approval is allowed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Proposer ID</label>
              <select
                value={proposerId}
                onChange={e => setProposerId(e.target.value)}
                className="bg-white border rounded px-2 py-1 text-xs font-mono"
              >
                <option value="usr_steward_01">usr_steward_01 (Steward)</option>
                <option value="usr_steward_02">usr_steward_02 (Faculty Proposer)</option>
                <option value="usr_dean_01">usr_dean_01 (Academic Dean)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Auditor/Approver ID</label>
              <select
                value={approverId}
                onChange={e => setApproverId(e.target.value)}
                className="bg-white border rounded px-2 py-1 text-xs font-mono"
              >
                <option value="usr_auditor_01">usr_auditor_01 (Lead Auditor)</option>
                <option value="usr_auditor_02">usr_auditor_02 (Compliance Officer)</option>
                <option value="usr_steward_01">usr_steward_01 (Steward Collision Test)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('command')}
            className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'command'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            Command &amp; Registry
          </button>
          <button
            onClick={() => setActiveTab('provenance')}
            className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'provenance'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            Provenance &amp; Trust
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'memory'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Organizational Memory
          </button>
          <button
            onClick={() => setActiveTab('access')}
            className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'access'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Retrieval &amp; Conflicts
          </button>
          <button
            onClick={() => setActiveTab('risk_sandbox')}
            className={`py-3 px-4 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
              activeTab === 'risk_sandbox'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            Risk &amp; Sandbox
          </button>
        </div>

        {/* Tab Content 1: Command & Registry */}
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Strategies and Domains */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Bookmark className="w-4 h-4 text-indigo-500" />
                  Knowledge Strategies
                </h3>
                <div className="space-y-4">
                  {strategies.map(st => (
                    <div key={st.id} className="border border-slate-150 p-4 rounded-md">
                      <h4 className="font-bold text-xs text-indigo-700">{st.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{st.description}</p>
                      <div className="flex gap-2 mt-3 text-[10px] text-slate-400">
                        <span>Owner: {st.ownerUserIdRef}</span>
                        <span>•</span>
                        <span>Objectives: {st.objectiveCodes.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Governed Knowledge Domains
                </h3>
                <div className="space-y-3">
                  {domains.map(dm => (
                    <div key={dm.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{dm.domainName}</p>
                        <p className="text-[10px] text-slate-400">Steward: {dm.stewardUserIdRef}</p>
                      </div>
                      <span className="px-2 py-0.5 font-mono text-[10px] bg-indigo-50 text-indigo-600 rounded">
                        {dm.domainCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Knowledge Registry & Control Plane */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between mb-4">
                  <span>Knowledge Registry &amp; Lifecycle Controls</span>
                  <span className="text-xs font-normal text-slate-400">Select an object to inspect or transition</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5">ID</th>
                        <th>Title</th>
                        <th>Domain</th>
                        <th>Sensitivity</th>
                        <th>Lifecycle Status</th>
                        <th>Review Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {objects.map(obj => (
                        <tr
                          key={obj.id}
                          onClick={() => setSelectedObjId(obj.id)}
                          className={`cursor-pointer transition hover:bg-indigo-50/20 ${
                            selectedObjId === obj.id ? 'bg-indigo-50/50 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3 font-mono text-slate-500">{obj.id}</td>
                          <td>{obj.title}</td>
                          <td>{obj.domainCode}</td>
                          <td>
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">
                              {obj.classificationSensitivity}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              obj.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              obj.status === 'VERIFICATION_PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {obj.status}
                            </span>
                          </td>
                          <td className={new Date(obj.nextReviewDate).getTime() < Date.now() ? 'text-red-500 font-bold' : ''}>
                            {new Date(obj.nextReviewDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Object Operations */}
                {activeObj && (
                  <div className="mt-6 p-4 bg-slate-50 border rounded-lg space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Execute Four-Eyes Lifecycle Transition for: <span className="font-mono text-indigo-600">{activeObj.id}</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400">Current Status</label>
                        <p className="mt-1 font-mono text-sm">{activeObj.status}</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400">Target Lifecycle Status</label>
                        <select
                          value={selectedTargetStatus}
                          onChange={e => setSelectedTargetStatus(e.target.value as any)}
                          className="mt-1 block w-full bg-white border rounded px-2.5 py-1 text-xs"
                        >
                          <option value="DRAFT">DRAFT</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                          <option value="VERIFICATION_PENDING">VERIFICATION_PENDING</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="PUBLISHED">PUBLISHED</option>
                          <option value="SUPERSEDED">SUPERSEDED</option>
                          <option value="RETIRED">RETIRED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => handleLifecycleTransition(activeObj.id)}
                          className="w-full bg-indigo-600 text-white rounded text-xs font-bold py-1.5 hover:bg-indigo-700 transition"
                        >
                          Request transition
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400">Verification Rationale</label>
                      <input
                        type="text"
                        value={transitionRationale}
                        onChange={e => setTransitionRationale(e.target.value)}
                        placeholder="Provide governance audit rationale for lifecycle change..."
                        className="mt-1 block w-full bg-white border rounded px-2.5 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Provenance & Trust */}
        {activeTab === 'provenance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sources and Evidences list */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Database className="w-4 h-4 text-indigo-500" />
                  Authoritative References
                </h3>
                <div className="space-y-4">
                  {sources.map(src => (
                    <div key={src.id} className="p-3 bg-slate-50 rounded border text-xs">
                      <p className="font-bold text-indigo-900">{src.recordTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Ref Module: {src.sourceModuleIdRef}</p>
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                        <span>Reliability: {src.reliabilityScore * 100}%</span>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">VERIFIED</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic Lineage & Validation Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Cryptographic Lineage SHA-256 Provenance &amp; Trust score
                </h3>

                {activeObj ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Inspecting Object</h4>
                        <p className="text-sm font-bold text-slate-800 mt-1">{activeObj.title}</p>
                        <p className="text-xs font-mono text-slate-500 mt-1">{activeObj.contentReference}</p>
                        <p className="text-[10px] text-slate-400 mt-3">Steward: {activeObj.stewardUserIdRef}</p>
                      </div>

                      <div className="flex flex-col justify-center items-center p-4 bg-white border rounded">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Composite Trust Score</span>
                        <span className="text-4xl font-extrabold text-indigo-600 mt-1">{(activeObj.trustScore * 100).toFixed(0)}%</span>
                        <span className="mt-2 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs rounded-full font-bold">
                          {activeObj.trustClassification}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Provenance Chain Hash */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lineage Trace Blockchain Header</h4>
                      <div className="space-y-3 font-mono text-[11px] bg-slate-950 text-slate-300 p-4 rounded-lg">
                        <div className="flex justify-between border-b border-slate-800 pb-1">
                          <span className="text-slate-500">previousProvenanceHash</span>
                          <span className="text-emerald-400">sha256_root_anchor_00000000000000000</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                          <span className="text-slate-500">sourceRecordIdRef</span>
                          <span>src_ref_01</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1 pt-1">
                          <span className="text-slate-500">sourceModuleIdRef</span>
                          <span>Phase 9.1</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-500">provenanceHash</span>
                          <span className="text-amber-400 font-bold">{generateDeterministicHash(activeObj.title + activeObj.contentReference)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Select a knowledge object from Command tab to view cryptographic provenance details.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Organizational Memory */}
        {activeTab === 'memory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List of decisions */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-indigo-500" />
                Institutional Decisions
              </h3>
              <div className="space-y-3">
                {decisions.map(dec => (
                  <div
                    key={dec.id}
                    onClick={() => setSelectedDecId(dec.id)}
                    className={`p-3 rounded border text-xs cursor-pointer transition ${
                      selectedDecId === dec.id ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50'
                    }`}
                  >
                    <p className="font-bold text-slate-800">{dec.decisionAuthorityRef}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(dec.decisionDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision rationale, precedents, and lessons learned */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Decision Lineage &amp; Memory Reference
                </h3>

                {activeDec ? (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-4 border rounded">
                      <h4 className="text-xs font-bold text-indigo-600">Context &amp; Strategic Alignment</h4>
                      <p className="text-xs mt-1 text-slate-700">{activeDec.decisionContext}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] text-slate-500">
                        <div>
                          <strong>Expected Outcome:</strong>
                          <p>{activeDec.expectedOutcome}</p>
                        </div>
                        <div>
                          <strong>Rationale Reference:</strong>
                          <p>{activeDec.rationaleReference}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Lessons Learned Memory</h4>
                        {lessons.map(les => (
                          <div key={les.id} className="mt-2 p-3 border rounded text-xs bg-amber-50/50">
                            <p className="font-bold text-amber-800">{les.title}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{les.description}</p>
                            <p className="text-[10px] text-red-700 font-semibold mt-2">Root Cause: {les.rootCause}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase">Syllabus Best Practices</h4>
                        <div className="mt-2 p-3 border rounded text-xs">
                          <p className="font-bold text-indigo-900">Bi-annual Credit Audit Procedure</p>
                          <p className="text-[10px] text-slate-600 mt-1">Stewards must verify historical GPA formulations at least once per term to guarantee data parity.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Select a decision record to view organizational memory connections.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Retrieval & Conflicts */}
        {activeTab === 'access' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Retrieval Sandbox Simulator */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-500" />
                Retrieval Authorization Control Plane
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-500">Domain Code</label>
                  <select
                    value={retrievalDomain}
                    onChange={e => setRetrievalDomain(e.target.value)}
                    className="mt-1 block w-full bg-slate-50 border rounded p-2"
                  >
                    <option value="ACADEMICS">ACADEMICS (Requires Steward Role)</option>
                    <option value="RESEARCH">RESEARCH (Requires Faculty Role)</option>
                    <option value="DECISIONS">DECISIONS (Requires Admin Role)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500">Request Sensitivity Level</label>
                  <select
                    value={retrievalSensitivity}
                    onChange={e => setRetrievalSensitivity(e.target.value as any)}
                    className="mt-1 block w-full bg-slate-50 border rounded p-2"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="HIGHLY_CONFIDENTIAL">HIGHLY_CONFIDENTIAL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500">User Role Assertion</label>
                  <select
                    value={retrievalRole}
                    onChange={e => setRetrievalRole(e.target.value)}
                    className="mt-1 block w-full bg-slate-50 border rounded p-2"
                  >
                    <option value="guest">guest</option>
                    <option value="faculty">faculty</option>
                    <option value="steward">steward</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500">Required Purpose</label>
                  <input
                    type="text"
                    value={retrievalPurpose}
                    onChange={e => setRetrievalPurpose(e.target.value)}
                    className="mt-1 block w-full bg-slate-50 border rounded p-2"
                  />
                </div>

                <button
                  onClick={handleRetrievalTest}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition"
                >
                  Evaluate Retrieval Request
                </button>
              </div>

              {retrievalResult && (
                <div className="p-4 rounded border text-xs bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Evaluation Decision</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      retrievalResult.decision.decision === 'AUTHORIZED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      retrievalResult.decision.decision === 'RESTRICTED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {retrievalResult.decision.decision}
                    </span>
                  </div>
                  {retrievalResult.decision.rejectionReason && (
                    <p className="text-red-600 text-[10px] mt-1 font-bold">Reason: {retrievalResult.decision.rejectionReason}</p>
                  )}
                  {retrievalResult.retrievalEvidence && (
                    <div className="mt-3 p-2 bg-slate-100 border rounded font-mono text-[10px] space-y-1 text-slate-600">
                      <p><strong>Ref object:</strong> {retrievalResult.retrievalEvidence.knowledgeObjectIdRef}</p>
                      <p className="truncate"><strong>Hash chain ref:</strong> {retrievalResult.retrievalEvidence.provenanceHashRef}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Contradictions & Conflict Resolution */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-500" />
                Knowledge Contradiction &amp; Conflict Resolvers
              </h3>

              <div className="space-y-4">
                {contradictions.map(con => (
                  <div key={con.id} className="p-4 border rounded-lg bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">CONTRADICTION</span>
                        <span className="font-mono text-slate-500">{con.id}</span>
                      </div>
                      <p className="mt-2 text-slate-800">
                        Conflict detected between <span className="font-mono text-indigo-600">{con.knowledgeObjectIdRefA}</span> and{' '}
                        <span className="font-mono text-indigo-600">{con.knowledgeObjectIdRefB}</span>.
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Severity: {con.severity} | Code: {con.conflictType}</p>
                    </div>

                    <div>
                      {con.status === 'DETECTED' ? (
                        <button
                          onClick={() => handleResolveContradiction(con.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded transition"
                        >
                          Resolve conflict
                        </button>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded border font-bold">RESOLVED</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 5: Risk & Sandbox */}
        {activeTab === 'risk_sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Risk, Exceptions, and Overrides Forms */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Exceptions and Overrides buttons */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  Policy Exceptions &amp; Overrides
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => { setShowExcForm(true); setShowOvForm(false); }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-3 text-xs rounded transition text-center"
                  >
                    Propose Exception
                  </button>
                  <button
                    onClick={() => { setShowOvForm(true); setShowExcForm(false); }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-3 text-xs rounded transition text-center"
                  >
                    Propose Override
                  </button>
                </div>

                {/* Exception Form */}
                {showExcForm && (
                  <form onSubmit={handleCreateException} className="border-t pt-4 space-y-3 text-xs">
                    <h4 className="font-bold text-indigo-600">Exception Registration Form</h4>
                    <div>
                      <label className="block text-slate-500">Exception Type</label>
                      <select
                        value={excType}
                        onChange={e => setExcType(e.target.value as any)}
                        className="mt-1 block w-full bg-white border rounded p-1"
                      >
                        <option value="UNVERIFIED_KNOWLEDGE_USE">UNVERIFIED_KNOWLEDGE_USE</option>
                        <option value="MISSING_PROVENANCE">MISSING_PROVENANCE</option>
                        <option value="SUPERSEDED_ACTIVE_USE">SUPERSEDED_ACTIVE_USE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500">Target Object ID</label>
                      <input
                        type="text"
                        value={excTarget}
                        onChange={e => setExcTarget(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Business Rationale</label>
                      <input
                        type="text"
                        value={excRationale}
                        onChange={e => setExcRationale(e.target.value)}
                        required
                        className="mt-1 block w-full bg-white border rounded p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Compensating Controls</label>
                      <input
                        type="text"
                        value={excControls}
                        onChange={e => setExcControls(e.target.value)}
                        required
                        className="mt-1 block w-full bg-white border rounded p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Expiry Date (No Indefinite Expiry)</label>
                      <input
                        type="date"
                        value={excExpiry}
                        onChange={e => setExcExpiry(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded"
                    >
                      Verify and Propose Exception
                    </button>
                  </form>
                )}

                {/* Override Form */}
                {showOvForm && (
                  <form onSubmit={handleCreateOverride} className="border-t pt-4 space-y-3 text-xs">
                    <h4 className="font-bold text-indigo-600">Override Registration Form</h4>
                    <div>
                      <label className="block text-slate-500">Target Object ID</label>
                      <input
                        type="text"
                        value={ovTarget}
                        onChange={e => setOvTarget(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Override Field</label>
                      <select
                        value={ovField}
                        onChange={e => setOvField(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1"
                      >
                        <option value="trustScore">trustScore (Direct Metric Adjustment)</option>
                        <option value="riskLevel">riskLevel (Risk Override)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500">Overridden Value</label>
                      <input
                        type="text"
                        value={ovValue}
                        onChange={e => setOvValue(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Justification</label>
                      <input
                        type="text"
                        value={ovJustification}
                        onChange={e => setOvJustification(e.target.value)}
                        required
                        className="mt-1 block w-full bg-white border rounded p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500">Expiry Date</label>
                      <input
                        type="date"
                        value={ovExpiry}
                        onChange={e => setOvExpiry(e.target.value)}
                        className="mt-1 block w-full bg-white border rounded p-1"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded"
                    >
                      Authorize and Apply Override
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sandbox Simulation and Audit Trail */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Resilience Simulation Sandbox */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-sm text-slate-900">What-If Resilience Sandbox Simulator</h3>
                  </div>
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200 font-mono">
                    SANDBOX MODE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-500 mb-1">Select Resilience Scenario (15 Models)</label>
                    <select
                      value={selectedScenarioCode}
                      onChange={e => setSelectedScenarioCode(e.target.value)}
                      className="w-full bg-slate-50 border rounded p-2"
                    >
                      {KnowledgeIntelligenceGovernanceService.getScenarios().map(sc => (
                        <option key={sc.code} value={sc.code}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-2">
                      {KnowledgeIntelligenceGovernanceService.getScenarios().find(s => s.code === selectedScenarioCode)?.description}
                    </p>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleRunSimulation}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded transition flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Run simulation
                    </button>
                  </div>
                </div>

                {simResult && (
                  <div className="mt-6 border border-amber-200 bg-amber-50/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                      <span>SIMULATION RESULTS</span>
                      <span>Impact: {(simResult.impactScore * 100).toFixed(0)}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                      <div>
                        <strong>Resilience Index Shift:</strong>
                        <p className="text-red-600 font-bold">{(simResult.resilienceDelta * 100).toFixed(0)}% delta</p>
                      </div>
                      <div>
                        <strong>Triggered Vulnerabilities:</strong>
                        <p className="font-mono text-[10px]">{simResult.vulnerabilitiesTriggered.join(', ')}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-t border-amber-100 pt-3 text-[10px] font-bold text-amber-800 tracking-wide text-center">
                      {simResult.diagnosticBanner}
                    </div>
                  </div>
                )}
              </div>

              {/* Diagnostics and Immutable Audit Trail */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Diagnostics &amp; Immutable Ledger Auditing
                  </h3>
                  <button
                    onClick={loadData}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Diagnostic Integrity Alerts</h4>
                    <div className="space-y-3">
                      {diagnostics.length > 0 ? (
                        diagnostics.map(dg => (
                          <div key={dg.id} className="p-3 bg-red-50/40 border border-red-100 rounded text-xs flex gap-3">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-red-800">{dg.diagnosticType}</p>
                              <p className="text-[10px] text-slate-600 mt-1">{dg.diagnosticMessage}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400">All structural checks passing. No active anomalies detected.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Immutable Audit Ledger Logs</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {auditEvents.map(evt => (
                        <div key={evt.id} className="p-2.5 bg-slate-50 rounded border font-mono text-[10px] text-slate-600 space-y-1">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{evt.actionCode}</span>
                            <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p>Target Entity ID: {evt.entityIdRef}</p>
                          <p className="truncate text-slate-400">Curr Hash: {evt.currentHash}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
