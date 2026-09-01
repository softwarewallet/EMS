import React, { useState, useEffect } from 'react';
import {
  EnterprisePortfolio,
  EnterpriseProgram,
  StrategicInitiative,
  GovernanceMilestone,
  GovernanceGate,
  GateDecision,
  DependencyLink,
  DependencyHealthIssue,
  BenefitRealizationPlan,
  BenefitMeasurement,
  PortfolioInvestment,
  InvestmentDecision,
  TransformationAssuranceReview,
  AssuranceFinding,
  InitiativeIntervention,
  WhatIfTransformationScenario,
  ScenarioSimulationResult,
  TransformationDataQualityIssue,
  TransformationGovernanceAudit,
  PortfolioStatus,
  ProgramStatus,
  InitiativeStatus,
  MilestoneStatus,
  VerificationStatus,
  GateType,
  GateStatus,
  GateDecisionType,
  DependencyType,
  DependencyLinkStatus,
  DependencyIssueType,
  BenefitType,
  BenefitPlanStatus,
  InvestmentDecisionType,
  InvestmentDecisionStatus,
  AssuranceReviewStatus,
  FindingType,
  FindingSeverity,
  InterventionType,
  InterventionStatus,
  DataQualityIssueType
} from '../../types/enterprisePortfolio';
import { EnterprisePortfolioService } from '../../services/enterprisePortfolioService';
import {
  Briefcase,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  XCircle,
  Clock,
  Coins,
  Shield,
  FileText,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Compass,
  Zap,
  Info,
  Sliders,
  Award,
  UserCheck
} from 'lucide-react';

export const EnterprisePortfolioWorkspace: React.FC = () => {
  // Navigation & Tabs state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'gates' | 'dependencies' | 'benefits' | 'investments' | 'simulation' | 'quality' | 'audits'>('dashboard');

  // Core Data State
  const [portfolios, setPortfolios] = useState<EnterprisePortfolio[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
  const [programs, setPrograms] = useState<EnterpriseProgram[]>([]);
  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([]);
  const [milestones, setMilestones] = useState<GovernanceMilestone[]>([]);
  const [gates, setGates] = useState<GovernanceGate[]>([]);
  const [dependencyLinks, setDependencyLinks] = useState<DependencyLink[]>([]);
  const [dependencyIssues, setDependencyIssues] = useState<DependencyHealthIssue[]>([]);
  const [benefitPlans, setBenefitPlans] = useState<BenefitRealizationPlan[]>([]);
  const [benefitMeasurements, setBenefitMeasurements] = useState<BenefitMeasurement[]>([]);
  const [investments, setInvestments] = useState<PortfolioInvestment[]>([]);
  const [investmentDecisions, setInvestmentDecisions] = useState<InvestmentDecision[]>([]);
  const [interventions, setInterventions] = useState<InitiativeIntervention[]>([]);
  const [scenarios, setScenarios] = useState<WhatIfTransformationScenario[]>([]);
  const [simulationResults, setSimulationResults] = useState<ScenarioSimulationResult[]>([]);
  const [dataQualityIssues, setDataQualityIssues] = useState<TransformationDataQualityIssue[]>([]);
  const [audits, setAudits] = useState<TransformationGovernanceAudit[]>([]);

  // Loading and Error state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for creating entities
  const [showPortModal, setShowPortModal] = useState(false);
  const [newPort, setNewPort] = useState({
    name: '',
    description: '',
    fiscalYear: '2026',
    status: 'ACTIVE' as PortfolioStatus
  });

  const [showPrgModal, setShowPrgModal] = useState(false);
  const [newPrg, setNewPrg] = useState({
    name: '',
    description: '',
    ownerId: 'staff_alistair_vance',
    budget: 150000
  });

  const [showInitModal, setShowInitModal] = useState(false);
  const [newInit, setNewInit] = useState({
    programId: '',
    name: '',
    description: '',
    leadStaffId: 'staff_evelyn_martinez',
    strategicObjectiveId: 'obj_729_pioneer_ai',
    associatedRiskId: 'risk_731_sensor_failure',
    financialCode: 'FIN-TRANS-9900',
    budget: 100000,
    status: 'PROPOSED' as InitiativeStatus
  });

  const [showMileModal, setShowMileModal] = useState(false);
  const [newMile, setNewMile] = useState({
    initiativeId: '',
    name: '',
    description: '',
    targetDate: new Date().toISOString().split('T')[0],
    ownerId: 'staff_david_karr',
    evidenceDocId: 'doc_727_standard_charter'
  });

  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    initiativeId: '',
    name: '',
    benefitType: 'ACADEMIC' as BenefitType,
    targetValue: 10,
    targetUnit: 'citations',
    baselineValue: 0,
    targetDate: new Date().toISOString().split('T')[0],
    strategicObjectiveId: 'obj_729_pioneer_ai'
  });

  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    portfolioId: '',
    programId: '',
    amount: 50000,
    fundingSource: 'Academic Grant Fund',
    financialCode: 'FIN-TRANS-8844',
    fiscalQuarter: 'Q1'
  });

  // Action interactive states
  const [selectedGate, setSelectedGate] = useState<GovernanceGate | null>(null);
  const [approver1, setApprover1] = useState('staff_alistair_vance');
  const [approver2, setApprover2] = useState('staff_david_karr');
  const [gateDecisionRationale, setGateDecisionRationale] = useState('');

  // What-If Simulator form state
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    fundingCutPercentage: 0,
    timelineShiftDays: 0,
    excludeInitiativeIds: [] as string[]
  });
  const [activeSimulationResult, setActiveSimulationResult] = useState<ScenarioSimulationResult | null>(null);

  // Load Data function
  const loadAllGovernanceData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const ports = await EnterprisePortfolioService.getPortfolios();
      setPortfolios(ports);
      if (ports.length > 0 && !selectedPortfolioId) {
        setSelectedPortfolioId(ports[0].id);
      }

      const prgs = await EnterprisePortfolioService.getPrograms();
      setPrograms(prgs);

      const inits = await EnterprisePortfolioService.getInitiatives();
      setInitiatives(inits);

      const miles = await EnterprisePortfolioService.getMilestones();
      setMilestones(miles);

      const gts = await EnterprisePortfolioService.getGates();
      setGates(gts);

      const links = await EnterprisePortfolioService.getDependencyLinks();
      setDependencyLinks(links);

      const issues = await EnterprisePortfolioService.getDependencyHealthIssues();
      setDependencyIssues(issues);

      const bPlans = await EnterprisePortfolioService.getBenefitPlans();
      setBenefitPlans(bPlans);

      const bMeas = await EnterprisePortfolioService.getBenefitMeasurements();
      setBenefitMeasurements(bMeas);

      const invs = await EnterprisePortfolioService.getInvestments();
      setInvestments(invs);

      const decs = await EnterprisePortfolioService.getInvestmentDecisions();
      setInvestmentDecisions(decs);

      const intvs = await EnterprisePortfolioService.getInterventions();
      setInterventions(intvs);

      const scens = await EnterprisePortfolioService.getScenarios();
      setScenarios(scens);

      const simRes = await EnterprisePortfolioService.getSimulationResults();
      setSimulationResults(simRes);

      const qIssues = await EnterprisePortfolioService.getDataQualityIssues();
      setDataQualityIssues(qIssues);

      const ads = await EnterprisePortfolioService.getTransformationAudits();
      setAudits(ads);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch enterprise transformation portfolio records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllGovernanceData();
  }, []);

  const triggerRefresh = async () => {
    await loadAllGovernanceData();
    setSuccessMsg('Governance ledger synchronised successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Run dynamic analytical solvers
  const executeDependencyCheck = async () => {
    setLoading(true);
    try {
      const issues = await EnterprisePortfolioService.runDependencyHealthCheck();
      setDependencyIssues(issues);
      setSuccessMsg(`Topological health check finished. Found ${issues.length} active issues.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Dependency checks failed.');
    } finally {
      setLoading(false);
    }
  };

  const executeDataQualityAssessment = async () => {
    setLoading(true);
    try {
      const issues = await EnterprisePortfolioService.runDataQualityAssessment();
      setDataQualityIssues(issues);
      setSuccessMsg(`Data sanity rules verified. Logged ${issues.length} compliance warnings.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'SaaS data sanity tests failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for creators
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createPortfolio(newPort);
      setSuccessMsg(`Portfolio "${created.name}" registered successfully.`);
      setShowPortModal(false);
      setNewPort({ name: '', description: '', fiscalYear: '2026', status: 'ACTIVE' });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createProgram({
        ...newPrg,
        portfolioId: selectedPortfolioId
      });
      setSuccessMsg(`Program "${created.name}" created.`);
      setShowPrgModal(false);
      setNewPrg({ name: '', description: '', ownerId: 'staff_alistair_vance', budget: 150000 });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateInitiative = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createInitiative({
        ...newInit,
        portfolioId: selectedPortfolioId
      });
      setSuccessMsg(`Initiative "${created.name}" registered.`);
      setShowInitModal(false);
      setNewInit({
        programId: '',
        name: '',
        description: '',
        leadStaffId: 'staff_evelyn_martinez',
        strategicObjectiveId: 'obj_729_pioneer_ai',
        associatedRiskId: 'risk_731_sensor_failure',
        financialCode: 'FIN-TRANS-9900',
        budget: 100000,
        status: 'PROPOSED'
      });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createMilestone({
        ...newMile,
        status: 'PLANNED'
      });
      setSuccessMsg(`Milestone "${created.name}" registered.`);
      setShowMileModal(false);
      setNewMile({
        initiativeId: '',
        name: '',
        description: '',
        targetDate: new Date().toISOString().split('T')[0],
        ownerId: 'staff_david_karr',
        evidenceDocId: 'doc_727_standard_charter'
      });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createBenefitPlan(newBenefit);
      setSuccessMsg(`Benefit realization plan "${created.name}" activated.`);
      setShowBenefitModal(false);
      setNewBenefit({
        initiativeId: '',
        name: '',
        benefitType: 'ACADEMIC',
        targetValue: 10,
        targetUnit: 'citations',
        baselineValue: 0,
        targetDate: new Date().toISOString().split('T')[0],
        strategicObjectiveId: 'obj_729_pioneer_ai'
      });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleCreateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const created = await EnterprisePortfolioService.createInvestment({
        ...newInvestment,
        portfolioId: selectedPortfolioId,
        status: 'PENDING'
      });
      setSuccessMsg(`Capital allocation tracking code registered for ${newInvestment.financialCode}. Double-approval required.`);
      setShowInvestmentModal(false);
      setNewInvestment({
        portfolioId: '',
        programId: '',
        amount: 50000,
        fundingSource: 'Academic Grant Fund',
        financialCode: 'FIN-TRANS-8844',
        fiscalQuarter: 'Q1'
      });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // ADV-01 Milestone validation with explicit Segregation of Duties checking
  const handleVerifyMilestone = async (milestoneId: string, verifierId: string, action: 'VERIFIED' | 'REJECTED') => {
    setErrorMsg(null);
    try {
      const updated = await EnterprisePortfolioService.verifyMilestone(milestoneId, verifierId, action);
      setSuccessMsg(`Milestone verification finalized as ${updated.verificationStatus}.`);
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // ADV-02 Four-Eyes Gate Verification
  const handleGateApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGate) return;
    setErrorMsg(null);
    try {
      await EnterprisePortfolioService.recordGateDecision(
        selectedGate.id,
        'APPROVED',
        gateDecisionRationale || 'All checklist items peer-reviewed and verified.',
        approver1,
        approver2
      );
      setSuccessMsg('Stage gate approved and initiative promoted.');
      setSelectedGate(null);
      setGateDecisionRationale('');
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // ADV-03 Double Sign-off on Capital Allocations
  const handleSignInvestment = async (decisionId: string, status: InvestmentDecisionStatus) => {
    setErrorMsg(null);
    try {
      await EnterprisePortfolioService.signInvestmentDecision(
        decisionId,
        approver1,
        approver2,
        status,
        'Capital allocation release authorized by executive panel.'
      );
      setSuccessMsg(`Capital release decision completed: ${status}`);
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Interactive Checklist verification
  const handleToggleChecklist = async (gateId: string, itemId: string, checked: boolean) => {
    const gate = gates.find(g => g.id === gateId);
    if (!gate) return;
    const updatedList = gate.checklist.map(item => item.id === itemId ? { ...item, checked } : item);
    try {
      await EnterprisePortfolioService.submitGateChecklist(gateId, updatedList);
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Simulation handlers
  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const scen = await EnterprisePortfolioService.createScenario({
        ...newScenario,
        basePortfolioId: selectedPortfolioId
      });
      const result = await EnterprisePortfolioService.runScenarioSimulation(scen.id, 'exec_vance');
      setActiveSimulationResult(result);
      setSuccessMsg('Simulation mathematical projections generated successfully.');
      setShowScenarioModal(false);
      setNewScenario({ name: '', fundingCutPercentage: 0, timelineShiftDays: 0, excludeInitiativeIds: [] });
      await loadAllGovernanceData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Filter current elements by selected portfolio
  const currentPortfolio = portfolios.find(p => p.id === selectedPortfolioId);
  const activePrograms = programs.filter(p => p.portfolioId === selectedPortfolioId);
  const activeInitiatives = initiatives.filter(i => i.portfolioId === selectedPortfolioId);
  const totalBudget = activeInitiatives.reduce((sum, item) => sum + item.budget, 0) + activePrograms.reduce((sum, item) => sum + item.budget, 0);

  return (
    <div className="space-y-6 w-full" id="enterprise_portfolio_workspace">
      {/* Upper Status Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Phase 7.42 Governance Engine</span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Portfolio &amp; Transformation</h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Orchestrating institutional programs, stage gates, benefit realization indices, and immutable assurance reviews without duplicating master records.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Select Portfolio */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="w-full md:w-64 pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.fiscalYear})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={triggerRefresh}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
            title="Reload Governance Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPortModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Portfolio
          </button>
        </div>
      </div>

      {/* Error and Success Notifications */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-xs font-medium text-rose-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Security Rule / Validation Reject</span>
            {errorMsg}
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Primary Key Metrics / Executive Command Dashboard */}
      {currentPortfolio && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Metric 1: Health Index Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Health Index</span>
              <div className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${currentPortfolio.healthScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {currentPortfolio.status}
              </div>
            </div>
            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-950 tracking-tight">{currentPortfolio.healthScore}%</span>
              <span className="text-xs text-slate-400">weighted index</span>
            </div>
            {/* Health Contributing Factors */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>Alignment Focus</span>
                <span className="font-bold text-slate-700">{currentPortfolio.healthScoreFactors?.alignment}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${currentPortfolio.healthScoreFactors?.alignment}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>Delivery Pace</span>
                <span className="font-bold text-slate-700">{currentPortfolio.healthScoreFactors?.delivery}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${currentPortfolio.healthScoreFactors?.delivery}%` }} />
              </div>
            </div>
          </div>

          {/* Metric 2: Program Count */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Programs</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-950 tracking-tight">{activePrograms.length}</span>
              <span className="text-xs text-slate-400">aligned pathways</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-3">
              All programs linked strictly to authoritative Staff Owners to prevent duplicate directory records.
            </div>
          </div>

          {/* Metric 3: Strategic Initiatives */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Initiative Sandboxes</span>
              <Compass className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-950 tracking-tight">{activeInitiatives.length}</span>
              <span className="text-xs text-slate-400">cyber-physical nodes</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-3">
              Mapped on standard <strong className="text-indigo-600">Strategic Objectives</strong> and registered Risks.
            </div>
          </div>

          {/* Metric 4: Total Allocated Capital */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Investment Budget</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-950 tracking-tight">₹{(totalBudget / 1000).toFixed(0)}k</span>
              <span className="text-xs text-slate-400">INR mapped</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-3">
              Securely mapped via finance codes. No manual database entries allowed.
            </div>
          </div>
        </div>
      )}

      {/* Workspace Menu Bar Tabs */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('gates')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'gates' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Stage Gates ({gates.filter(g => g.status === 'SUBMITTED' || g.status === 'IN_PROGRESS').length})
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'dependencies' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Dependencies &amp; Cycles ({dependencyIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('benefits')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'benefits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Benefit Realization
        </button>
        <button
          onClick={() => setActiveTab('investments')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'investments' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-4 h-4" />
          Capital Allocations
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          What-If Simulator
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'quality' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          SaaS Sanity Rules ({dataQualityIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'audits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Audit Ledger
        </button>
      </div>

      {/* --- TAB CONTENT AREA --- */}

      {/* 1. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Programs & Initiatives List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Programs Section */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-800">Operational Transformation Programs</h3>
                </div>
                <button
                  onClick={() => setShowPrgModal(true)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-[11px] rounded-md flex items-center gap-1 border border-slate-200 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Program
                </button>
              </div>

              {activePrograms.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No programs assigned to this portfolio snapshot.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activePrograms.map(prg => (
                    <div key={prg.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200/60 hover:shadow-sm transition-all space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{prg.name}</h4>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                          Index: {prg.healthScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{prg.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-semibold">
                        <span>Owner: <strong className="text-slate-600">{prg.ownerId}</strong></span>
                        <span>Budget: <strong className="text-slate-600">₹{(prg.budget / 1000).toFixed(0)}k</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Initiatives Section */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-800">Strategic Initiative Sandboxes</h3>
                </div>
                <button
                  onClick={() => setShowInitModal(true)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-[11px] rounded-md flex items-center gap-1 border border-slate-200 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Initiative
                </button>
              </div>

              {activeInitiatives.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active sandboxes registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {activeInitiatives.map(init => (
                    <div key={init.id} className="p-4 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{init.name}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {init.currentGate}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xl">{init.description}</p>
                        <div className="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                          <span>Lead: <span className="text-slate-600">{init.leadStaffId}</span></span>
                          <span>Finance Code: <span className="text-slate-600">{init.financialCode}</span></span>
                          <span>Strategic Link: <span className="text-slate-600">{init.strategicObjectiveId}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">BUDGET</span>
                          <span className="text-xs font-extrabold text-slate-900">₹{(init.budget / 1000).toFixed(0)}k</span>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-extrabold ${init.healthScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {init.healthScore}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Milestones Tracking & Verification */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4.5 h-4.5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">Governance Milestones</h3>
                </div>
                <button
                  onClick={() => setShowMileModal(true)}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] rounded-md transition-all"
                >
                  Add Milestone
                </button>
              </div>

              <div className="space-y-3">
                {milestones.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No milestones scheduled.</p>
                ) : (
                  milestones.map(m => (
                    <div key={m.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60 space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {m.status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{m.targetDate}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-950">{m.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{m.description}</p>
                      
                      <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-200/60">
                        <span className="text-slate-400 font-medium">Owner: <strong className="text-slate-600">{m.ownerId}</strong></span>
                        <span className="font-semibold text-slate-600">Verification:</span>
                      </div>

                      {/* Explicit ADV-01 Segregation of Duties Panel */}
                      <div className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center gap-2">
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[9px] font-bold text-slate-500">
                            {m.verificationStatus === 'VERIFIED' ? 'Verified by Vance' : m.verificationStatus === 'REJECTED' ? 'REJECTED' : 'Awaiting Sign-off'}
                          </span>
                        </div>

                        {m.verificationStatus === 'PENDING' ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleVerifyMilestone(m.id, 'staff_alistair_vance', 'VERIFIED')}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] rounded transition-all"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleVerifyMilestone(m.id, 'staff_alistair_vance', 'REJECTED')}
                              className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[9px] rounded transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[9px] font-bold ${m.verificationStatus === 'VERIFIED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {m.verificationStatus}
                          </span>
                        )}
                      </div>
                      {/* Hint for self-verification testing */}
                      {m.verificationStatus === 'PENDING' && (
                        <div className="text-[9px] text-amber-600 font-medium leading-tight">
                          * Testing: Verification by same owner ({m.ownerId}) will be rejected by security constraint.
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

      {/* 2. STAGE GATES REVIEW */}
      {activeTab === 'gates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Stage Gates list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4.5 h-4.5 text-indigo-600" />
                Active stage Gates
              </h3>

              <div className="space-y-3">
                {gates.map(gate => (
                  <div key={gate.id} className={`p-4 rounded-lg border transition-all ${selectedGate?.id === gate.id ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200 bg-white'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Gate Level</span>
                        <span className="text-xs font-bold text-slate-900">{gate.gateType} — Initiative Ref: {gate.initiativeId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gate.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                          {gate.status}
                        </span>
                        <button
                          onClick={() => setSelectedGate(gate)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded transition-all"
                        >
                          Review Gate
                        </button>
                      </div>
                    </div>

                    {/* Checklist details */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Mandatory checklist</span>
                      {gate.checklist.map(item => (
                        <label key={item.id} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => handleToggleChecklist(gate.id, item.id, e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={item.checked ? 'line-through text-slate-400' : ''}>{item.item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ADV-02 Stage Gate double executive approval panel */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4.5 h-4.5 text-indigo-600" />
                Four-Eyes Sign-off Panel
              </h3>

              {selectedGate ? (
                <form onSubmit={handleGateApproval} className="space-y-4">
                  <div className="p-3 bg-indigo-50/40 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">Reviewing: {selectedGate.gateType}</span>
                    <span className="text-slate-500">Initiative: {selectedGate.initiativeId}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase block">Approving Executive 1</label>
                    <select
                      value={approver1}
                      onChange={(e) => setApprover1(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold focus:outline-none"
                    >
                      <option value="staff_alistair_vance">Alistair Vance (Director)</option>
                      <option value="staff_david_karr">David Karr (Dean of AI Research)</option>
                      <option value="staff_evelyn_martinez">Evelyn Martinez (Facilities Lead)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase block">Approving Executive 2</label>
                    <select
                      value={approver2}
                      onChange={(e) => setApprover2(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold focus:outline-none"
                    >
                      <option value="staff_david_karr">David Karr (Dean of AI Research)</option>
                      <option value="staff_alistair_vance">Alistair Vance (Director)</option>
                      <option value="staff_evelyn_martinez">Evelyn Martinez (Facilities Lead)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase block">Decision Rationale</label>
                    <textarea
                      value={gateDecisionRationale}
                      onChange={(e) => setGateDecisionRationale(e.target.value)}
                      placeholder="Specify rationale for promotion..."
                      rows={3}
                      className="w-full p-2.5 border border-slate-200 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="bg-amber-50 p-3 rounded text-[10px] text-amber-700 font-semibold leading-relaxed">
                    * Constraint warning: Approver 1 and Approver 2 must be distinct to authorize progression. Same approvers will trigger a safety reject.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-all shadow-sm"
                  >
                    Authorize Gate Release
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">Select an active gate from the list to sign off.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DEPENDENCIES & CYCLES */}
      {activeTab === 'dependencies' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dynamic Circular Dependency &amp; Schedule Analytics</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Topological solvers automatically compute cycles and milestone timeline overlaps.</p>
                </div>
              </div>
              <button
                onClick={executeDependencyCheck}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all"
              >
                Run Analytical Solvers
              </button>
            </div>

            {/* List links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Registered Dependency Links</span>
                {dependencyLinks.map(link => (
                  <div key={link.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Link ID: {link.id}</span>
                      <span className="text-slate-500 block">{link.sourceInitiativeId} &rarr; {link.targetInitiativeId}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">Lag Days: {link.lagDays} | Type: {link.dependencyType}</span>
                    </div>
                    {link.isCriticalPath && (
                      <span className="text-[9px] font-bold uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Critical Path
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Solvers Output */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Topological Solver Warnings ({dependencyIssues.length})</span>
                {dependencyIssues.length === 0 ? (
                  <div className="p-5 border border-dashed border-slate-200 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">Clean Topological Layout</p>
                    <p className="text-[10px] text-slate-400 mt-1">No cyclic deadlocks or timeline lag overflows detected.</p>
                  </div>
                ) : (
                  dependencyIssues.map(issue => (
                    <div key={issue.id} className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-rose-700 uppercase">{issue.issueType}</span>
                        <span className="text-[9px] font-extrabold text-rose-600 uppercase bg-rose-100 px-1 rounded">{issue.severity}</span>
                      </div>
                      <p className="text-xs font-bold text-rose-950">{issue.description}</p>
                      <span className="text-[9px] text-slate-400 block font-semibold">Detected: {issue.detectedAt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BENEFIT REALIZATION */}
      {activeTab === 'benefits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                  Benefit Realization Index
                </h3>
                <button
                  onClick={() => setShowBenefitModal(true)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-[11px] rounded-md border border-slate-200 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  New Plan
                </button>
              </div>

              <div className="space-y-3">
                {benefitPlans.map(plan => (
                  <div key={plan.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 rounded font-bold uppercase">{plan.benefitType}</span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{plan.name}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.status === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                        {plan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-3 rounded border border-slate-200">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Baseline</span>
                        <span className="font-extrabold text-slate-800">{plan.baselineValue}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Target Value</span>
                        <span className="font-extrabold text-slate-800">{plan.targetValue} {plan.targetUnit}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase">Target Date</span>
                        <span className="font-bold text-slate-800">{plan.targetDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-indigo-600" />
                Impact Verification
              </h3>

              <div className="space-y-3">
                {benefitMeasurements.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No reported metrics pending validation.</p>
                ) : (
                  benefitMeasurements.map(meas => (
                    <div key={meas.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">Plan Ref: {meas.benefitPlanId}</h4>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Measured Value: <strong className="text-indigo-600">{meas.measuredValue}</strong></span>
                        <span>Variance: <strong className={meas.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}>{meas.variance >= 0 ? `+${meas.variance}` : meas.variance}</strong></span>
                      </div>

                      <div className="flex gap-1 pt-2">
                        <button
                          onClick={() => EnterprisePortfolioService.verifyBenefitMeasurement(meas.id, 'staff_alistair_vance', 'VERIFIED').then(() => loadAllGovernanceData())}
                          className="flex-1 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[9px] rounded"
                        >
                          Verify Impact
                        </button>
                        <button
                          onClick={() => EnterprisePortfolioService.verifyBenefitMeasurement(meas.id, 'staff_alistair_vance', 'REJECTED').then(() => loadAllGovernanceData())}
                          className="flex-1 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[9px] rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CAPITAL ALLOCATIONS */}
      {activeTab === 'investments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Coins className="w-4.5 h-4.5 text-amber-500" />
                  Authorized Capital Allocations
                </h3>
                <button
                  onClick={() => setShowInvestmentModal(true)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-[11px] rounded-md border border-slate-200 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  New Allocation
                </button>
              </div>

              <div className="space-y-3">
                {investments.map(inv => (
                  <div key={inv.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{inv.financialCode}</span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded uppercase">{inv.fiscalQuarter}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">Source: {inv.fundingSource}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-bold">RELEASE AMOUNT</span>
                      <span className="text-xs font-extrabold text-slate-950">₹{(inv.amount / 1000).toFixed(0)}k INR</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ADV-03 Capital allocation approvals */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4.5 h-4.5 text-indigo-600" />
                Capital release Decision Board
              </h3>

              <div className="space-y-3">
                {investmentDecisions.map(dec => (
                  <div key={dec.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 block">INVESTMENT ID: {dec.investmentId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${dec.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {dec.status}
                    </span>

                    {dec.status === 'PENDING' && (
                      <div className="space-y-2 border-t border-slate-200 pt-2">
                        <div className="text-[9px] text-amber-700 font-bold bg-amber-50 p-2 rounded">
                          * Safety constraint: Two separate executive IDs must sign to release funds.
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSignInvestment(dec.id, 'APPROVED')}
                            className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] rounded"
                          >
                            Approve Release
                          </button>
                          <button
                            onClick={() => handleSignInvestment(dec.id, 'REJECTED')}
                            className="flex-1 py-1 bg-rose-500 hover:bg-rose-600 text-white font-bold text-[9px] rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WHAT-IF SCENARIO SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulator Panel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4.5 h-4.5 text-indigo-600" />
              Scenario configuration
            </h3>

            <form onSubmit={handleCreateScenario} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Scenario name</label>
                <input
                  type="text"
                  required
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                  placeholder="e.g. Q3 Fiscal Funding Cut 20%"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Funding cut percentage ({newScenario.fundingCutPercentage}%)</label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={newScenario.fundingCutPercentage}
                  onChange={(e) => setNewScenario({ ...newScenario, fundingCutPercentage: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Timeline shift days ({newScenario.timelineShiftDays} days)</label>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="10"
                  value={newScenario.timelineShiftDays}
                  onChange={(e) => setNewScenario({ ...newScenario, timelineShiftDays: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase block">Exclude Initiative Sandbox</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 p-2.5 rounded bg-slate-50">
                  {activeInitiatives.map(i => (
                    <label key={i.id} className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newScenario.excludeInitiativeIds.includes(i.id)}
                        onChange={(e) => {
                          const list = [...newScenario.excludeInitiativeIds];
                          if (e.target.checked) {
                            list.push(i.id);
                          } else {
                            const idx = list.indexOf(i.id);
                            if (idx > -1) list.splice(idx, 1);
                          }
                          setNewScenario({ ...newScenario, excludeInitiativeIds: list });
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{i.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-all shadow-sm"
              >
                Project Simulated Health Impacts
              </button>
            </form>
          </div>

          {/* Simulated Projection outputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
                Impact Projection Canvas
              </h3>

              {activeSimulationResult ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Simulated health score comparison */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Simulated health score</span>
                      <div className="flex items-baseline gap-2 my-4">
                        <span className="text-4xl font-black text-indigo-600">{activeSimulationResult.simulatedHealthScore}%</span>
                        <span className="text-[11px] text-slate-400 font-medium">vs {currentPortfolio?.healthScore}% (Base)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{activeSimulationResult.impactAnalysis}</p>
                    </div>

                    {/* Breakdown of simulated indicators */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Contributing factors breakdown</span>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Alignment Focus</span>
                          <span className="text-slate-800">{activeSimulationResult.simulatedAlignmentScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${activeSimulationResult.simulatedAlignmentScore}%` }} />
                        </div>

                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Delivery Pace</span>
                          <span className="text-slate-800">{activeSimulationResult.simulatedDeliveryScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${activeSimulationResult.simulatedDeliveryScore}%` }} />
                        </div>

                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Risk Severity</span>
                          <span className="text-slate-800">{activeSimulationResult.simulatedRiskScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${activeSimulationResult.simulatedRiskScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                    <span>Certified by: {activeSimulationResult.certifiedBy}</span>
                    <span>Snapshot Timestamp: {activeSimulationResult.certifiedAt}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-12 text-center">Adjust configuration parameters in the left panel to execute What-If simulation algorithm.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. SAAS SANITY DATA QUALITY */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Award className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SaaS Sanity Rules Governance</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Real-time assessments targeting orphan programs, unaligned objectives, and temporal conflicts.</p>
                </div>
              </div>
              <button
                onClick={executeDataQualityAssessment}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all"
              >
                Run Sanity Rules Analysis
              </button>
            </div>

            {/* List issues */}
            <div className="space-y-3">
              {dataQualityIssues.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">Prisinte Compliance Standard Achieved</p>
                  <p className="text-[10px] text-slate-400 mt-1">No orphaned assets, dates mismatch, or unlinked objectives registered in the system.</p>
                </div>
              ) : (
                dataQualityIssues.map(issue => (
                  <div key={issue.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-rose-700 uppercase bg-rose-50 px-1.5 rounded">{issue.issueType}</span>
                        <span className="text-slate-400">Target ID: {issue.targetEntityId}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{issue.description}</p>
                    </div>

                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${issue.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {issue.severity}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. IMMUTABLE AUDITS */}
      {activeTab === 'audits' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4.5 h-4.5 text-indigo-600" />
              Immutable transformation Governance Audits
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Timestamp</th>
                    <th>Action Type</th>
                    <th>Collection Target</th>
                    <th>Target ID</th>
                    <th>Executive Office</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {audits.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 font-medium text-slate-700">
                      <td className="py-3 text-[10px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="font-bold text-indigo-700">{log.action}</td>
                      <td>{log.entityCollection}</td>
                      <td className="text-[10px] font-bold text-slate-500">{log.entityId}</td>
                      <td>{log.userDisplayName} ({log.userEmail})</td>
                      <td>
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.2 rounded uppercase">
                          {log.result}
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

      {/* --- MODALS FOR CREATIONS --- */}

      {/* 1. PORTFOLIO SNAPSHOT CREATION MODAL */}
      {showPortModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Register Portfolio snapshot</h3>
            <form onSubmit={handleCreatePortfolio} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Name</label>
                <input
                  type="text"
                  required
                  value={newPort.name}
                  onChange={(e) => setNewPort({ ...newPort, name: e.target.value })}
                  placeholder="e.g. FY 2027 Advanced Robotics transformation"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Description</label>
                <textarea
                  required
                  value={newPort.description}
                  onChange={(e) => setNewPort({ ...newPort, description: e.target.value })}
                  placeholder="Focus objectives..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPortModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PROGRAM MODAL */}
      {showPrgModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add operational Program</h3>
            <form onSubmit={handleCreateProgram} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Program Name</label>
                <input
                  type="text"
                  required
                  value={newPrg.name}
                  onChange={(e) => setNewPrg({ ...newPrg, name: e.target.value })}
                  placeholder="e.g. GPU Infrastructure Consolidation"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Description</label>
                <textarea
                  required
                  value={newPrg.description}
                  onChange={(e) => setNewPrg({ ...newPrg, description: e.target.value })}
                  placeholder="Program objectives..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Owner Staff ID</label>
                <input
                  type="text"
                  required
                  value={newPrg.ownerId}
                  onChange={(e) => setNewPrg({ ...newPrg, ownerId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Budget (₹)</label>
                <input
                  type="number"
                  required
                  value={newPrg.budget}
                  onChange={(e) => setNewPrg({ ...newPrg, budget: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrgModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. INITIATIVE MODAL */}
      {showInitModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Strategic Sandbox Initiative</h3>
            <form onSubmit={handleCreateInitiative} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Linked Program ID</label>
                <select
                  required
                  value={newInit.programId}
                  onChange={(e) => setNewInit({ ...newInit, programId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option value="">Select linked program...</option>
                  {activePrograms.map(prg => (
                    <option key={prg.id} value={prg.id}>{prg.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Initiative Name</label>
                <input
                  type="text"
                  required
                  value={newInit.name}
                  onChange={(e) => setNewInit({ ...newInit, name: e.target.value })}
                  placeholder="e.g. Edge Storage Node B"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Description</label>
                <textarea
                  required
                  value={newInit.description}
                  onChange={(e) => setNewInit({ ...newInit, description: e.target.value })}
                  placeholder="Initiative parameters..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Financial Code (Authoritative)</label>
                <input
                  type="text"
                  required
                  value={newInit.financialCode}
                  onChange={(e) => setNewInit({ ...newInit, financialCode: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Strategic Objective Ref (ID)</label>
                <input
                  type="text"
                  required
                  value={newInit.strategicObjectiveId}
                  onChange={(e) => setNewInit({ ...newInit, strategicObjectiveId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Budget (₹)</label>
                <input
                  type="number"
                  required
                  value={newInit.budget}
                  onChange={(e) => setNewInit({ ...newInit, budget: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowInitModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Register Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MILESTONE MODAL */}
      {showMileModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Milestone Schedule</h3>
            <form onSubmit={handleCreateMilestone} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Initiative Sandbox Target</label>
                <select
                  required
                  value={newMile.initiativeId}
                  onChange={(e) => setNewMile({ ...newMile, initiativeId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option value="">Select linked sandbox...</option>
                  {activeInitiatives.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Milestone Label</label>
                <input
                  type="text"
                  required
                  value={newMile.name}
                  onChange={(e) => setNewMile({ ...newMile, name: e.target.value })}
                  placeholder="e.g. Safety cage approval certificate"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Description</label>
                <textarea
                  required
                  value={newMile.description}
                  onChange={(e) => setNewMile({ ...newMile, description: e.target.value })}
                  placeholder="Detailed deliverables..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Target Date</label>
                <input
                  type="date"
                  required
                  value={newMile.targetDate}
                  onChange={(e) => setNewMile({ ...newMile, targetDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Owner Staff ID</label>
                <input
                  type="text"
                  required
                  value={newMile.ownerId}
                  onChange={(e) => setNewMile({ ...newMile, ownerId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMileModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. BENEFIT MODAL */}
      {showBenefitModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Benefit Realization Metrics Plan</h3>
            <form onSubmit={handleCreateBenefit} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Sandbox Initiative Target</label>
                <select
                  required
                  value={newBenefit.initiativeId}
                  onChange={(e) => setNewBenefit({ ...newBenefit, initiativeId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option value="">Select linked sandbox...</option>
                  {activeInitiatives.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Benefit Name</label>
                <input
                  type="text"
                  required
                  value={newBenefit.name}
                  onChange={(e) => setNewBenefit({ ...newBenefit, name: e.target.value })}
                  placeholder="e.g. Local LLM paper submissions"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Baseline Value</label>
                <input
                  type="number"
                  required
                  value={newBenefit.baselineValue}
                  onChange={(e) => setNewBenefit({ ...newBenefit, baselineValue: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Target Value</label>
                <input
                  type="number"
                  required
                  value={newBenefit.targetValue}
                  onChange={(e) => setNewBenefit({ ...newBenefit, targetValue: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Target Unit</label>
                <input
                  type="text"
                  required
                  value={newBenefit.targetUnit}
                  onChange={(e) => setNewBenefit({ ...newBenefit, targetUnit: e.target.value })}
                  placeholder="e.g. published documents"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Target Milestone Date</label>
                <input
                  type="date"
                  required
                  value={newBenefit.targetDate}
                  onChange={(e) => setNewBenefit({ ...newBenefit, targetDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBenefitModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Register Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INVESTMENT ALLOCATION MODAL */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-[#121620]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Register Capital Allocation Code</h3>
            <form onSubmit={handleCreateInvestment} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Linked Program ID</label>
                <select
                  required
                  value={newInvestment.programId}
                  onChange={(e) => setNewInvestment({ ...newInvestment, programId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none"
                >
                  <option value="">Select linked program...</option>
                  {activePrograms.map(prg => (
                    <option key={prg.id} value={prg.id}>{prg.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Amount to Release (₹)</label>
                <input
                  type="number"
                  required
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({ ...newInvestment, amount: parseInt(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Financial Code (Authoritative)</label>
                <input
                  type="text"
                  required
                  value={newInvestment.financialCode}
                  onChange={(e) => setNewInvestment({ ...newInvestment, financialCode: e.target.value })}
                  placeholder="FIN-TRANS-XXXX"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block uppercase">Funding Source</label>
                <input
                  type="text"
                  required
                  value={newInvestment.fundingSource}
                  onChange={(e) => setNewInvestment({ ...newInvestment, fundingSource: e.target.value })}
                  placeholder="e.g. State Research Fellowship"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvestmentModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold"
                >
                  Register Release Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
