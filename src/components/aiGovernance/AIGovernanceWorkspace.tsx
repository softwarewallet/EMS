import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import {
  Brain,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Plus,
  FileText,
  UserCheck,
  Server,
  Activity,
  Compass,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { AIGovernanceService } from '../../services/aiGovernanceService';
import {
  AISystem,
  AIModel,
  AIModelVersion,
  AIEvaluationRun,
  AIAgent,
  AIExceptionRequest,
  AIIncident,
  AIDataQualityIssue
} from '../../types/aiGovernance';

export function AIGovernanceWorkspace() {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const tenantId = currentTenant?.id || 'ALL';
  const actorId = currentUser?.uid || 'usr_admin';
  const actorName = currentUser?.displayName || 'Administrator';

  // State Management
  const [activeSubTab, setActiveSubTab] = useState<'systems' | 'models' | 'evaluations' | 'agents' | 'exceptions' | 'scanner' | 'sandbox'>('systems');
  const [healthScore, setHealthScore] = useState({
    score: 100,
    systemsCount: 0,
    highRiskCount: 0,
    pendingEvaluations: 0,
    activeIncidents: 0,
    activeExceptions: 0,
    complianceScore: 100
  });

  const [systems, setSystems] = useState<AISystem[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [evaluationRuns, setEvaluationRuns] = useState<AIEvaluationRun[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [exceptions, setExceptions] = useState<AIExceptionRequest[]>([]);
  const [incidents, setIncidents] = useState<AIIncident[]>([]);
  const [qualityIssues, setQualityIssues] = useState<AIDataQualityIssue[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [showSystemForm, setShowSystemForm] = useState(false);
  const [newSystem, setNewSystem] = useState({
    name: '',
    description: '',
    purpose: '',
    providerId: 'prov_openai_01',
    riskTier: 'LIMITED' as AISystem['riskTier'],
    dataClassification: 'INTERNAL' as AISystem['dataClassification'],
    humanOversightRequired: 'REQUIRED' as AISystem['humanOversightRequired'],
    ownerId: actorId
  });

  const [showModelForm, setShowModelForm] = useState(false);
  const [newModel, setNewModel] = useState({
    systemId: '',
    modelName: '',
    modelType: 'GPT-4o',
    providerId: 'prov_openai_01',
    purpose: '',
    capabilityClass: 'Generative Text Reasoning',
    riskTier: 'LIMITED' as AIModel['riskTier'],
    deploymentEnvironment: 'CLOUD' as AIModel['deploymentEnvironment'],
    ownerId: actorId
  });

  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [newException, setNewException] = useState({
    title: '',
    description: '',
    targetSystemId: '',
    policyReference: 'SEC-AI-04',
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    justification: '',
    requestedScope: 'Model Staging Test Run',
    riskAssessment: 'No student PII affected during run'
  });

  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    affectedSystemId: '',
    severity: 'MODERATE' as AIIncident['severity'],
    incidentType: 'bias' as AIIncident['incidentType']
  });

  // Sandbox simulation state
  const [selectedScenario, setSelectedScenario] = useState<'RANSOMWARE_COMPROMISE' | 'CREDENTIAL_EXPOSURE' | ''>('');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Message banners
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all dashboard metrics and collection data
  const loadData = async () => {
    setLoading(true);
    try {
      const score = await AIGovernanceService.calculateAIGovernanceHealthScore(tenantId);
      setHealthScore(score);

      const sysList = await AIGovernanceService.getSystems(tenantId);
      setSystems(sysList);

      const mdlList = await AIGovernanceService.getModels(tenantId);
      setModels(mdlList);

      const runs = await AIGovernanceService.getEvaluationRuns(tenantId);
      setEvaluationRuns(runs);

      const agtList = await AIGovernanceService.getAgents(tenantId);
      setAgents(agtList);

      const excList = await AIGovernanceService.getExceptions(tenantId);
      setExceptions(excList);

      const incList = await AIGovernanceService.getIncidents(tenantId);
      setIncidents(incList);

      const issues = await AIGovernanceService.getDataQualityIssues(tenantId);
      setQualityIssues(issues.filter((i) => i.status === 'OPEN'));
    } catch (err: any) {
      setErrorMsg('Error loading AI governance structures: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const clearMessages = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Creators submission
  const handleCreateSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      await AIGovernanceService.createSystem(tenantId, {
        ...newSystem,
        tenantId,
        createdBy: actorId
      }, actorId, actorName);
      setSuccessMsg(`AI System "${newSystem.name}" registered successfully.`);
      setShowSystemForm(false);
      setNewSystem({
        name: '',
        description: '',
        purpose: '',
        providerId: 'prov_openai_01',
        riskTier: 'LIMITED',
        dataClassification: 'INTERNAL',
        humanOversightRequired: 'REQUIRED',
        ownerId: actorId
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      await AIGovernanceService.createModel(tenantId, {
        ...newModel,
        tenantId,
        createdBy: actorId
      }, actorId, actorName);
      setSuccessMsg(`AI Model "${newModel.modelName}" submitted successfully.`);
      setShowModelForm(false);
      setNewModel({
        systemId: '',
        modelName: '',
        modelType: 'GPT-4o',
        providerId: 'prov_openai_01',
        purpose: '',
        capabilityClass: 'Generative Text Reasoning',
        riskTier: 'LIMITED',
        deploymentEnvironment: 'CLOUD',
        ownerId: actorId
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateException = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      await AIGovernanceService.createException(tenantId, {
        ...newException,
        tenantId,
        status: 'REQUESTED'
      }, actorId, actorName);
      setSuccessMsg(`Safety Exception Request submitted successfully.`);
      setShowExceptionForm(false);
      setNewException({
        title: '',
        description: '',
        targetSystemId: '',
        policyReference: 'SEC-AI-04',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        justification: '',
        requestedScope: 'Model Staging Test Run',
        riskAssessment: 'No student PII affected during run'
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      await AIGovernanceService.createIncident(tenantId, {
        ...newIncident,
        tenantId,
        reportedBy: actorId
      }, actorId, actorName);
      setSuccessMsg(`Incident reported and queued for security triage.`);
      setShowIncidentForm(false);
      setNewIncident({
        title: '',
        description: '',
        affectedSystemId: '',
        severity: 'MODERATE',
        incidentType: 'bias'
      });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Peer approvals
  const handleApproveSystem = async (systemId: string) => {
    clearMessages();
    try {
      await AIGovernanceService.approveSystem(tenantId, systemId, actorId, actorName);
      setSuccessMsg('System peer-approved successfully.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveModel = async (modelId: string) => {
    clearMessages();
    try {
      await AIGovernanceService.approveModel(tenantId, modelId, actorId, actorName);
      setSuccessMsg('Model certified and approved for operational workloads.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleApproveException = async (excId: string) => {
    clearMessages();
    try {
      await AIGovernanceService.approveException(tenantId, excId, actorId, actorName);
      setSuccessMsg('Temporary policy exception granted.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCloseIncident = async (incId: string) => {
    clearMessages();
    try {
      await AIGovernanceService.triageIncident(tenantId, incId, 'CLOSED', actorId, actorName);
      setSuccessMsg('Incident ticket closed under independent audit approval.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Automated Scanner trigger
  const handleRunScanner = async () => {
    clearMessages();
    setLoading(true);
    try {
      const issues = await AIGovernanceService.runDataQualityScan(tenantId, actorId, actorName);
      setQualityIssues(issues.filter((i) => i.status === 'OPEN'));
      setSuccessMsg('Automated scanner complete. New diagnostics loaded below.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulation Sandbox trigger
  const handleRunSimulation = (scenario: 'RANSOMWARE_COMPROMISE' | 'CREDENTIAL_EXPOSURE') => {
    setSelectedScenario(scenario);
    const result = AIGovernanceService.simulateScenario(scenario);
    setSimulationResult(result);
  };

  // Seed default items for a pristine layout demonstration if collections are empty
  const handleSeedDefaults = async () => {
    clearMessages();
    setLoading(true);
    try {
      // 1. Seed Provider
      const p = await AIGovernanceService.createProvider(tenantId, {
        tenantId,
        name: 'OpenAI Enterprise API Gateway',
        providerType: 'CLOUD',
        serviceCategory: 'LLM',
        securityClassification: 'CONFIDENTIAL',
        contractualStatus: 'ACTIVE',
        dataProcessingAllowed: true,
        externalTransferAllowed: true,
        createdBy: actorId,
        updatedBy: actorId,
        status: 'ACTIVE'
      }, actorId, actorName);

      // 2. Seed Systems
      const s1 = await AIGovernanceService.createSystem(tenantId, {
        tenantId,
        name: 'Student Career Advisory Agent',
        description: 'Orchestrates course and career alignment strategies using Gemini models.',
        purpose: 'Academic and vocational guidance helper',
        ownerId: actorId,
        providerId: p.id,
        riskTier: 'HIGH',
        dataClassification: 'RESTRICTED',
        humanOversightRequired: 'REQUIRED',
        createdBy: actorId
      }, actorId, actorName);

      const s2 = await AIGovernanceService.createSystem(tenantId, {
        tenantId,
        name: 'Automatic Admissions Assistant',
        description: 'Predictive modeling system mapping student entries score data.',
        purpose: 'Admissions and document evaluation assistant',
        ownerId: actorId,
        providerId: p.id,
        riskTier: 'LIMITED',
        dataClassification: 'INTERNAL',
        humanOversightRequired: 'CONDITIONAL',
        createdBy: actorId
      }, actorId, actorName);

      // 3. Seed Models
      const m1 = await AIGovernanceService.createModel(tenantId, {
        tenantId,
        systemId: s1.id,
        modelName: 'Advisory-Reasoner-v1',
        modelType: 'GPT-4o',
        providerId: p.id,
        purpose: 'Fine-tuned guidance reasoning',
        capabilityClass: 'Generative Text Reasoning',
        riskTier: 'HIGH',
        deploymentEnvironment: 'CLOUD',
        ownerId: actorId,
        createdBy: actorId
      }, actorId, actorName);

      // 4. Seed Evaluations
      await AIGovernanceService.createEvaluationRun(tenantId, {
        tenantId,
        datasetReference: 'ds_career_advisory_01',
        modelVersionId: m1.id,
        evaluatorId: actorId,
        status: 'PASSED',
        metrics: {
          accuracy: 92.4,
          precision: 91.0,
          recall: 93.5,
          fairnessScore: 98.1,
          hallucinationRate: 2.1,
          privacyPass: true
        },
        findings: 'High accuracy performance with negligible hallucination index.'
      }, actorId, actorName);

      // 5. Seed Agent
      await AIGovernanceService.createAgent(tenantId, {
        tenantId,
        name: 'Autonomous Grading Broker',
        description: 'Processes teacher criteria feedback to draft assignments reviews.',
        toolAccess: ['canvas_api', 'grades_db', 'prompt_parser'],
        workflowAccess: ['grading_workflow'],
        dataAccess: ['student_submissions'],
        maximumExecutionDepth: 5,
        approvalRequirements: 'SUPERVISORY',
        humanEscalationRules: ['Notify teacher if score divergence exceeds 15%'],
        permittedActions: ['draft_review', 'flag_plagiarism'],
        prohibitedActions: ['auto_publish_grades'],
        riskTier: 'LIMITED',
        status: 'ACTIVE'
      }, actorId, actorName);

      // 6. Seed Policies
      await AIGovernanceService.createPolicy(tenantId, {
        tenantId,
        name: 'Responsible AI & Hallucination Mitigations',
        description: 'Ensures reasoning agents retain minimum accuracy levels and mandatory human in the loop parameters.',
        riskTierRestrictions: {
          'HIGH': 'Requires certified evaluation runs',
          'CRITICAL': 'Requires human review override validation'
        },
        isEnabled: true,
        createdBy: actorId
      }, actorId, actorName);

      setSuccessMsg('Standard enterprise AI Governance default configurations seeded successfully.');
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai_governance_container" className="p-6 max-w-7xl mx-auto space-y-6 text-gray-900 bg-gray-50/50 min-h-screen">
      
      {/* HEADER BLOCK */}
      <div id="ai_governance_header" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">AI Model Governance & Oversight</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Enterprise compliance dashboard for AI agents, model validation registries, and algorithmic risk mitigation.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            id="btn_refresh_gov"
            onClick={loadData}
            className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            id="btn_seed_defaults"
            onClick={handleSeedDefaults}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition flex items-center gap-1.5 font-semibold shadow-sm shadow-indigo-100"
          >
            <Sliders className="w-4 h-4" />
            Seed Defaults
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div id="banner_success" className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={clearMessages} className="text-emerald-500 hover:text-emerald-700 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div id="banner_error" className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={clearMessages} className="text-rose-500 hover:text-rose-700 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* COMPLIANCE HEALTH SCORE BANNER */}
      <div id="compliance_score_card" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">AI Governance Health Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-indigo-900">{healthScore.score}</span>
              <span className="text-gray-400 text-sm">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden max-w-[240px]">
              <div 
                className={`h-full transition-all duration-500 ${
                  healthScore.score >= 85 ? 'bg-emerald-500' : healthScore.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${healthScore.score}%` }}
              />
            </div>
          </div>
          <div className={`p-4 rounded-full text-lg font-bold flex items-center justify-center w-14 h-14 ${
            healthScore.score >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {healthScore.score >= 85 ? 'A+' : 'B'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">AI Systems Enrolled</span>
            <span className="text-2xl font-bold text-gray-800">{healthScore.systemsCount}</span>
            <span className="text-xs text-gray-400 block mt-0.5">{healthScore.highRiskCount} High/Critical Risk</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Active Incidents</span>
            <span className="text-2xl font-bold text-gray-800">{healthScore.activeIncidents}</span>
            <span className="text-xs text-rose-500 font-semibold block mt-0.5">{healthScore.activeExceptions} Exceptions Active</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC COMPLIANCE SUB-TABS */}
      <div id="ai_sub_tab_navigation" className="border-b border-gray-200 flex flex-wrap gap-2">
        {[
          { id: 'systems', label: 'Systems & Use Cases', icon: Brain },
          { id: 'models', label: 'Models & Lineage', icon: FileText },
          { id: 'evaluations', label: 'Safety Lab (Runs)', icon: CheckCircle2 },
          { id: 'agents', label: 'Agent Safeguards', icon: Cpu },
          { id: 'exceptions', label: 'Exceptions & Incidents', icon: ShieldAlert },
          { id: 'scanner', label: 'Scanner & Issues', icon: Sliders },
          { id: 'sandbox', label: 'Simulation Sandbox', icon: Compass }
        ].map((tab) => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 border-b-2 text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB CONTENTS */}
      <div id="sub_tab_panel" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[350px]">
        
        {/* SYSTEMS & USE CASES TAB */}
        {activeSubTab === 'systems' && (
          <div id="panel_systems" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Enrolled AI Systems Registry</h3>
                <p className="text-gray-500 text-xs">All active algorithmic workflows, categorizations, and human oversight gates.</p>
              </div>
              <button
                id="btn_new_system"
                onClick={() => setShowSystemForm(!showSystemForm)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Register AI System
              </button>
            </div>

            {/* REGISTER FORM */}
            {showSystemForm && (
              <form onSubmit={handleCreateSystem} id="form_create_system" className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 max-w-2xl">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  New Model-Enforced System Definition
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">System Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Automated Student Advisor"
                      value={newSystem.name}
                      onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Operational Purpose</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Course suggestion recommendations"
                      value={newSystem.purpose}
                      onChange={(e) => setNewSystem({ ...newSystem, purpose: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Description</label>
                  <textarea
                    required
                    placeholder="Provide a complete description of the data inputs, models used, and user impacts."
                    value={newSystem.description}
                    onChange={(e) => setNewSystem({ ...newSystem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 h-20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Risk Assessment Tier</label>
                    <select
                      value={newSystem.riskTier}
                      onChange={(e) => setNewSystem({ ...newSystem, riskTier: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="MINIMAL">MINIMAL</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="HIGH">HIGH (Requires evaluation)</option>
                      <option value="CRITICAL">CRITICAL (Requires human review)</option>
                      <option value="PROHIBITED">PROHIBITED (Will be blocked)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Data Classification</label>
                    <select
                      value={newSystem.dataClassification}
                      onChange={(e) => setNewSystem({ ...newSystem, dataClassification: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="INTERNAL">INTERNAL ONLY</option>
                      <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                      <option value="RESTRICTED">RESTRICTED</option>
                      <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Human Oversight Required</label>
                    <select
                      value={newSystem.humanOversightRequired}
                      onChange={(e) => setNewSystem({ ...newSystem, humanOversightRequired: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="OPTIONAL">OPTIONAL</option>
                      <option value="CONDITIONAL">CONDITIONAL</option>
                      <option value="REQUIRED">REQUIRED MANDATORY</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSystemForm(false)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                  >
                    Save System Contract
                  </button>
                </div>
              </form>
            )}

            {/* SYSTEMS TABLE */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                    <th className="p-4">System Identity</th>
                    <th className="p-4">Risk Tier</th>
                    <th className="p-4">Data Class</th>
                    <th className="p-4">Lifecycle State</th>
                    <th className="p-4">Oversight</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {systems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                        No AI systems registered. Try clicking "Seed Defaults".
                      </td>
                    </tr>
                  ) : (
                    systems.map((sys) => (
                      <tr key={sys.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{sys.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{sys.purpose}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            sys.riskTier === 'MINIMAL' ? 'bg-gray-100 text-gray-700' :
                            sys.riskTier === 'LIMITED' ? 'bg-blue-50 text-blue-700' :
                            sys.riskTier === 'HIGH' ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {sys.riskTier}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-600">{sys.dataClassification}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            sys.lifecycleStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            sys.lifecycleStatus === 'DRAFT' ? 'bg-gray-100 text-gray-600' :
                            'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {sys.lifecycleStatus}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-500">{sys.humanOversightRequired}</td>
                        <td className="p-4 text-right">
                          {sys.lifecycleStatus === 'DRAFT' ? (
                            <button
                              onClick={() => handleApproveSystem(sys.id)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold transition"
                            >
                              Approve (SoD)
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODELS & LINEAGE TAB */}
        {activeSubTab === 'models' && (
          <div id="panel_models" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Model Inventory & Lineage Registry</h3>
                <p className="text-gray-500 text-xs">Verify fine-tuning parameters, artifact checksums, and release signatures.</p>
              </div>
              <button
                id="btn_new_model"
                onClick={() => setShowModelForm(!showModelForm)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Model
              </button>
            </div>

            {showModelForm && (
              <form onSubmit={handleCreateModel} id="form_create_model" className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 max-w-2xl">
                <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Define Model Specifications
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Model Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LLM-Advisory-v2"
                      value={newModel.modelName}
                      onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Operational System Mapping</label>
                    <select
                      required
                      value={newModel.systemId}
                      onChange={(e) => setNewModel({ ...newModel, systemId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select AI System</option>
                      {systems.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Base Architecture Type</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GPT-4o, Gemini 1.5"
                      value={newModel.modelType}
                      onChange={(e) => setNewModel({ ...newModel, modelType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Deployment Env</label>
                    <select
                      value={newModel.deploymentEnvironment}
                      onChange={(e) => setNewModel({ ...newModel, deploymentEnvironment: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="CLOUD">Managed Cloud Service</option>
                      <option value="LOCAL">On-Prem Container</option>
                      <option value="EDGE">Edge Application</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Capability Class</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Text reasoning"
                      value={newModel.capabilityClass}
                      onChange={(e) => setNewModel({ ...newModel, capabilityClass: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Risk Assessment Tier</label>
                  <select
                    value={newModel.riskTier}
                    onChange={(e) => setNewModel({ ...newModel, riskTier: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                  >
                    <option value="MINIMAL">MINIMAL</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="HIGH">HIGH (Evaluation mandatory)</option>
                    <option value="CRITICAL">CRITICAL (Human validation override)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModelForm(false)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Enlist Model specifications
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                    <th className="p-4">Model Details</th>
                    <th className="p-4">Base Architecture</th>
                    <th className="p-4">Capability Class</th>
                    <th className="p-4">Risk Tier</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {models.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                        No models registered in registry database yet.
                      </td>
                    </tr>
                  ) : (
                    models.map((mdl) => (
                      <tr key={mdl.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{mdl.modelName}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Deployment: {mdl.deploymentEnvironment}</div>
                        </td>
                        <td className="p-4 font-semibold text-gray-600">{mdl.modelType}</td>
                        <td className="p-4 text-gray-600">{mdl.capabilityClass}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            mdl.riskTier === 'HIGH' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {mdl.riskTier}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            mdl.lifecycleStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {mdl.lifecycleStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {mdl.lifecycleStatus === 'DRAFT' ? (
                            <button
                              onClick={() => handleApproveModel(mdl.id)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold transition"
                            >
                              Approve Staging/Prod
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SAFETY LABS (RUNS) TAB */}
        {activeSubTab === 'evaluations' && (
          <div id="panel_evaluations" className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Safety, Bias, & Accuracy Verification Lab</h3>
              <p className="text-gray-500 text-xs">Certified benchmark run executions validating hallucination indexes and privacy boundaries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluationRuns.length === 0 ? (
                <div className="col-span-full bg-gray-50 p-8 text-center rounded-xl text-gray-400 font-medium">
                  No model evaluation runs recorded. Register models and click "Seed Defaults" to load benchmark trials.
                </div>
              ) : (
                evaluationRuns.map((run) => (
                  <div key={run.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-gray-800">Run ID: {run.id.slice(-6).toUpperCase()}</div>
                        <div className="text-xs text-gray-400 mt-0.5">Evaluator: {run.evaluatorId}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        run.certificationStatus === 'CERTIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {run.certificationStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-gray-400 block">Accuracy Score</span>
                        <span className="font-bold text-gray-700 text-sm">{run.metrics?.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Recall Rate</span>
                        <span className="font-bold text-gray-700 text-sm">{run.metrics?.recall}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Fairness Score</span>
                        <span className="font-bold text-gray-700 text-sm">{run.metrics?.fairnessScore}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Hallucination Rate</span>
                        <span className="font-bold text-gray-700 text-sm">{run.metrics?.hallucinationRate}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400">Security Audit</span>
                        <span className={run.metrics?.privacyPass ? 'text-emerald-600' : 'text-rose-500'}>
                          {run.metrics?.privacyPass ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-400 font-medium">Status</span>
                        <span className="text-indigo-600">{run.status}</span>
                      </div>
                    </div>

                    {run.certificationStatus === 'UNCERTIFIED' && (
                      <div className="pt-2">
                        <button
                          onClick={() => AIGovernanceService.certifyEvaluationRun(tenantId, run.id, 'CERTIFIED', actorId, actorName).then(() => {
                            setSuccessMsg('Evaluation run certified.');
                            loadData();
                          }).catch((err) => setErrorMsg(err.message))}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <UserCheck className="w-4 h-4" />
                          Certify Benchmark Scores
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AGENT SAFEGUARDS TAB */}
        {activeSubTab === 'agents' && (
          <div id="panel_agents" className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Agent Safeguard & Recursive Call Gateway</h3>
              <p className="text-gray-500 text-xs">Prevents execution loop overflows, handles sandbox limits, and validates tool execution allowlists.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-gray-700">Configured Autonomous Agents</h4>
                <div className="space-y-4">
                  {agents.length === 0 ? (
                    <div className="bg-gray-50 p-6 text-center text-gray-400 rounded-xl font-medium">
                      No active autonomous agents registered. Seed defaults to view loops controls.
                    </div>
                  ) : (
                    agents.map((agt) => (
                      <div key={agt.id} className="bg-white p-5 rounded-xl border border-gray-200/60 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900">{agt.name}</div>
                            <p className="text-xs text-gray-500 mt-0.5">{agt.description}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-extrabold bg-indigo-50 text-indigo-700 rounded-full">
                            Risk: {agt.riskTier}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-2 bg-gray-50 rounded-lg text-center text-xs border border-gray-100">
                          <div>
                            <span className="text-gray-400 block font-medium">Max Loop Depth</span>
                            <span className="font-bold text-gray-800 text-sm">{agt.maximumExecutionDepth} cycles</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Approval Policy</span>
                            <span className="font-bold text-gray-800 text-sm">{agt.approvalRequirements}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block font-medium">Admin Kill-switch</span>
                            <span className="font-bold text-emerald-600 text-sm">ACTIVE READY</span>
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="font-semibold text-gray-400 block mb-1">Tool Execution Allowlist:</span>
                          <div className="flex flex-wrap gap-1">
                            {agt.toolAccess?.map((tool, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono font-medium">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* LIVE SAFEGUARD EVALUATOR PANEL */}
              <div className="bg-gray-50/60 p-5 rounded-xl border border-gray-200 space-y-4">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                  <Fingerprint className="w-4 h-4 text-indigo-600" />
                  Safeguard Gate Check
                </h4>
                <p className="text-xs text-gray-500">
                  Simulate downstream workflow depth requests to verify if core rate counters trigger the recursive circuit-breaker.
                </p>

                <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Target Agent</label>
                    <select id="select_test_agent" className="w-full p-2 border border-gray-200 rounded text-xs bg-white">
                      {agents.map((agt) => (
                        <option key={agt.id} value={agt.id}>{agt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Requested Execution Recursion Depth</label>
                    <input
                      id="input_test_depth"
                      type="number"
                      defaultValue={6}
                      className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const selectEl = document.getElementById('select_test_agent') as HTMLSelectElement;
                      const depthEl = document.getElementById('input_test_depth') as HTMLInputElement;
                      if (!selectEl || !depthEl) return;
                      const agt = agents.find(a => a.id === selectEl.value);
                      if (!agt) {
                        setErrorMsg('No agent selected for evaluation.');
                        return;
                      }
                      const depth = Number(depthEl.value);
                      AIGovernanceService.runAgentSafeguardCheck(agt, depth).then((res) => {
                        if (res.passed) {
                          setSuccessMsg(`Gate Pass: ${res.message}`);
                        } else {
                          setErrorMsg(`Security Block: ${res.message}`);
                        }
                      });
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" /> Run Gate Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXCEPTIONS & INCIDENTS TAB */}
        {activeSubTab === 'exceptions' && (
          <div id="panel_exceptions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* EXCEPTIONS PANEL */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Policy Exceptions Requests</h3>
                    <p className="text-xs text-gray-500">Temporary mitigations for high-risk modules.</p>
                  </div>
                  <button
                    id="btn_request_exception"
                    onClick={() => setShowExceptionForm(!showExceptionForm)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold transition flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Request
                  </button>
                </div>

                {showExceptionForm && (
                  <form onSubmit={handleCreateException} id="form_create_exception" className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-700">Request AI Security Exception</h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Exception Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Temporary bypassing bias assessment"
                        value={newException.title}
                        onChange={(e) => setNewException({ ...newException, title: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Mapped AI System</label>
                        <select
                          required
                          value={newException.targetSystemId}
                          onChange={(e) => setNewException({ ...newException, targetSystemId: e.target.value })}
                          className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
                        >
                          <option value="">Select Target System</option>
                          {systems.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Expiration Date</label>
                        <input
                          type="date"
                          required
                          value={newException.expirationDate}
                          onChange={(e) => setNewException({ ...newException, expirationDate: e.target.value })}
                          className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Justification</label>
                      <textarea
                        required
                        value={newException.justification}
                        onChange={(e) => setNewException({ ...newException, justification: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded text-xs h-16"
                        placeholder="Explain the critical business logic demanding this exception."
                      />
                    </div>

                    <button type="submit" className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold">
                      File Exception Request
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {exceptions.length === 0 ? (
                    <div className="p-4 bg-gray-50 text-center text-gray-400 text-xs rounded-lg font-medium">
                      No exception files registered.
                    </div>
                  ) : (
                    exceptions.map((exc) => (
                      <div key={exc.id} className="p-4 rounded-lg border border-gray-150 shadow-sm flex flex-col justify-between gap-2 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-800 text-sm">{exc.title}</span>
                            <div className="text-xs text-gray-400 mt-0.5">Expires: {exc.expirationDate}</div>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            exc.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-600 animate-pulse'
                          }`}>
                            {exc.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-55 bg-gray-50 p-2 rounded">{exc.justification}</p>
                        
                        {exc.status === 'REQUESTED' && (
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleApproveException(exc.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition"
                            >
                              Approve Exception (SoD)
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* INCIDENTS PANEL */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Reported AI Model Incidents</h3>
                    <p className="text-xs text-gray-500">Track and triage feedback leakages or algorithmic biases.</p>
                  </div>
                  <button
                    id="btn_report_incident"
                    onClick={() => setShowIncidentForm(!showIncidentForm)}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition flex items-center gap-0.5 shadow-sm"
                  >
                    <Plus className="w-3 h-3" /> Report Incident
                  </button>
                </div>

                {showIncidentForm && (
                  <form onSubmit={handleCreateIncident} id="form_create_incident" className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                    <h4 className="text-xs font-bold text-gray-700">Report New Incident</h4>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Incident Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Prompt Leakage in advisory chatbot"
                        value={newIncident.title}
                        onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Severity</label>
                        <select
                          value={newIncident.severity}
                          onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                          className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
                        >
                          <option value="LOW">LOW</option>
                          <option value="MODERATE">MODERATE</option>
                          <option value="HIGH">HIGH</option>
                          <option value="CRITICAL">CRITICAL</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Incident Type</label>
                        <select
                          value={newIncident.incidentType}
                          onChange={(e) => setNewIncident({ ...newIncident, incidentType: e.target.value as any })}
                          className="w-full p-2 border border-gray-200 rounded text-xs bg-white"
                        >
                          <option value="bias">BIAS LEAKAGE</option>
                          <option value="privacy_breach">PRIVACY BREACH</option>
                          <option value="hallucination">HALLUCINATION HAZARD</option>
                          <option value="system_failure">SYSTEM FAILURE</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Incident Description</label>
                      <textarea
                        required
                        value={newIncident.description}
                        onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                        className="w-full p-2 border border-gray-200 rounded text-xs h-16"
                        placeholder="Describe exact parameters that triggered anomaly."
                      />
                    </div>

                    <button type="submit" className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold">
                      Report Incident Ticket
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {incidents.length === 0 ? (
                    <div className="p-4 bg-gray-50 text-center text-gray-400 text-xs rounded-lg font-medium">
                      No active security incidents reported.
                    </div>
                  ) : (
                    incidents.map((inc) => (
                      <div key={inc.id} className="p-4 rounded-lg border border-red-100 shadow-sm flex flex-col gap-2 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-rose-500" />
                              {inc.title}
                            </span>
                            <div className="text-xs text-gray-400 mt-0.5">Category: {inc.incidentType}</div>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            inc.status === 'CLOSED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700 animate-pulse'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-100">{inc.description}</p>
                        
                        {inc.status !== 'CLOSED' && (
                          <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                            <span className="text-xs font-semibold text-rose-600">Severity: {inc.severity}</span>
                            <button
                              onClick={() => handleCloseIncident(inc.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-xs font-bold transition"
                            >
                              Resolve Incident (SoD)
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SCANNER & ISSUES TAB */}
        {activeSubTab === 'scanner' && (
          <div id="panel_scanner" className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-xl border border-gray-200/80">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Automated Alignment & Lineage Scanner
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scan registered assets to diagnose orphan model lineages, unverified consent, or expired active exceptions.
                </p>
              </div>
              <button
                id="btn_trigger_scan"
                onClick={handleRunScanner}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Activity className="w-4 h-4" /> Trigger Diagnostic Scan
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700">Identified Alignment & Compliance Issues</h4>
              
              {qualityIssues.length === 0 ? (
                <div className="p-8 bg-gray-50 border border-dashed border-gray-200 text-center text-gray-400 rounded-xl text-sm font-medium">
                  Compliance and lineage verified. Run scan to evaluate active components.
                </div>
              ) : (
                <div className="space-y-3">
                  {qualityIssues.map((issue) => (
                    <div key={issue.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        issue.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-600' :
                        issue.severity === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800 text-sm capitalize">{issue.issueType.replace('_', ' ')}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                            issue.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                            issue.severity === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {issue.severity} Severity
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{issue.description}</p>
                        <span className="text-[10px] text-gray-400 block pt-0.5">Detected: {new Date(issue.detectedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SIMULATION SANDBOX TAB */}
        {activeSubTab === 'sandbox' && (
          <div id="panel_sandbox" className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">What-If Governance Scenario Sandbox</h3>
              <p className="text-gray-500 text-xs">Simulate security compromises and training leakages in offline sandbox buffers to construct emergency playbooks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <h4 className="text-sm font-bold text-gray-700">Select Threat/Leakage Simulation</h4>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleRunSimulation('RANSOMWARE_COMPROMISE')}
                    className={`w-full p-4 rounded-xl text-left border transition flex flex-col gap-1 ${
                      selectedScenario === 'RANSOMWARE_COMPROMISE'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-sm">Autonomous Agent Compromise Scenario</span>
                    <span className="text-xs text-gray-500">Inject code injection simulation to verify agent kill switch constraints and loops.</span>
                  </button>

                  <button
                    onClick={() => handleRunSimulation('CREDENTIAL_EXPOSURE')}
                    className={`w-full p-4 rounded-xl text-left border transition flex flex-col gap-1 ${
                      selectedScenario === 'CREDENTIAL_EXPOSURE'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-sm">Fine-Tuning Dataset personal data leakage</span>
                    <span className="text-xs text-gray-500">Ingest unmasked records and check compliance quarantine controls.</span>
                  </button>
                </div>
              </div>

              {/* SIMULATION DIAGNOSTIC BOARD */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[250px] flex flex-col justify-center">
                {simulationResult ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight max-w-[80%]">{simulationResult.title}</h4>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        simulationResult.simulatedRiskRating === 'CRITICAL' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {simulationResult.simulatedRiskRating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-100">{simulationResult.description}</p>
                    
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Dynamic Impact Factors:</span>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                        {simulationResult.impactFactors.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Recommended Governance Action Plans:</span>
                      <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                        {simulationResult.governanceActionPlans.map((p: string, i: number) => (
                          <li key={i} className="text-indigo-600 font-semibold">{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8 space-y-2">
                    <Compass className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-sm font-semibold">Ready to Initiate Simulation Scenario</p>
                    <p className="text-xs max-w-[260px] mx-auto text-gray-400">Select a scenario on the left panel to execute offline simulated risk scoring rules.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default AIGovernanceWorkspace;
