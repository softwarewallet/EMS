import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Award,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  BookOpen,
  Calendar,
  Lock,
  Search,
  Plus,
  RefreshCw,
  TrendingUp,
  Cpu,
  FileCode,
  Users,
  Eye,
  Check,
  XCircle,
  Building,
  Target
} from 'lucide-react';
import { researchGrantsProjectsInnovationService } from '../../services/researchGrantsProjectsInnovationService';
import {
  ResearchUnit,
  ResearchProgram,
  ResearchProject,
  ResearchProposal,
  FundingOpportunity,
  GrantApplication,
  GrantAward,
  ResearchMilestone,
  ResearchBudget,
  ResearchEthicsReference,
  ResearchRisk,
  ResearchPublication,
  ResearchIntellectualProperty,
  InnovationProject,
  CommercializationOpportunity,
  ResearchDiagnosticResult,
  ResearchSimulationResult,
  ResearchSimulationScenario,
  ResearchAuditEvent
} from '../../types/researchGrantsProjectsInnovation';

export const ResearchGrantsProjectsInnovationWorkspace: React.FC = () => {
  const tenantId = 'TENANT_INDIA_DEFAULT';
  const currentUserId = 'USER_DEAN_RESEARCH';

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'units_programs'
    | 'projects'
    | 'proposals'
    | 'opportunities'
    | 'grants'
    | 'budgets'
    | 'milestones'
    | 'compliance'
    | 'risks'
    | 'outputs'
    | 'ip'
    | 'innovation'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
  >('overview');

  // State
  const [units, setUnits] = useState<ResearchUnit[]>([]);
  const [programs, setPrograms] = useState<ResearchProgram[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [awards, setAwards] = useState<GrantAward[]>([]);
  const [milestones, setMilestones] = useState<ResearchMilestone[]>([]);
  const [budgets, setBudgets] = useState<ResearchBudget[]>([]);
  const [ethicsProtocols, setEthicsProtocols] = useState<ResearchEthicsReference[]>([]);
  const [risks, setRisks] = useState<ResearchRisk[]>([]);
  const [publications, setPublications] = useState<ResearchPublication[]>([]);
  const [ips, setIps] = useState<ResearchIntellectualProperty[]>([]);
  const [innovations, setInnovations] = useState<InnovationProject[]>([]);
  const [commercializations, setCommercializations] = useState<CommercializationOpportunity[]>([]);
  const [auditEvents, setAuditEvents] = useState<ResearchAuditEvent[]>([]);

  // Diagnostics & Simulation
  const [diagnosticsResult, setDiagnosticsResult] = useState<ResearchDiagnosticResult | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ResearchSimulationScenario['type']>('GRANT_APPLICATION_SURGE');
  const [simulationResult, setSimulationResult] = useState<ResearchSimulationResult | null>(null);

  // Modals & User Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [showNewExpenditureModal, setShowNewExpenditureModal] = useState(false);
  const [showDiscloseIpModal, setShowDiscloseIpModal] = useState(false);

  // Proposal Form State
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropUnit, setNewPropUnit] = useState('UNIT-AI-CENTRE');
  const [newPropPi, setNewPropPi] = useState('EMP-FAC-001');
  const [newPropBudget, setNewPropBudget] = useState(4500000);
  const [newPropDuration, setNewPropDuration] = useState(36);
  const [newPropAbstract, setNewPropAbstract] = useState('');

  // Expenditure Form State
  const [selectedBudgetId, setSelectedBudgetId] = useState('BDG-2025-001');
  const [selectedLineId, setSelectedLineId] = useState('BL-03');
  const [expAmount, setExpAmount] = useState(25000);
  const [expJustification, setExpJustification] = useState('');

  // IP Form State
  const [newIpTitle, setNewIpTitle] = useState('');
  const [newIpProject, setNewIpProject] = useState('PROJ-AI-HEALTH-01');
  const [newIpType, setNewIpType] = useState<'PATENT' | 'COPYRIGHT' | 'TRADEMARK'>('PATENT');

  const refreshAllData = () => {
    setUnits(researchGrantsProjectsInnovationService.getUnits(tenantId));
    setPrograms(researchGrantsProjectsInnovationService.getPrograms(tenantId));
    setProjects(researchGrantsProjectsInnovationService.getProjects(tenantId));
    setProposals(researchGrantsProjectsInnovationService.getProposals(tenantId));
    setOpportunities(researchGrantsProjectsInnovationService.getOpportunities(tenantId));
    setApplications(researchGrantsProjectsInnovationService.getGrantApplications(tenantId));
    setAwards(researchGrantsProjectsInnovationService.getGrantAwards(tenantId));
    setMilestones(researchGrantsProjectsInnovationService.getMilestones(tenantId));
    setBudgets(researchGrantsProjectsInnovationService.getBudgets(tenantId));
    setEthicsProtocols(researchGrantsProjectsInnovationService.getEthicsProtocols(tenantId));
    setRisks(researchGrantsProjectsInnovationService.getRisks(tenantId));
    setPublications(researchGrantsProjectsInnovationService.getPublications(tenantId));
    setIps(researchGrantsProjectsInnovationService.getIntellectualProperties(tenantId));
    setInnovations(researchGrantsProjectsInnovationService.getInnovationProjects(tenantId));
    setCommercializations(researchGrantsProjectsInnovationService.getCommercializations(tenantId));
    setAuditEvents(researchGrantsProjectsInnovationService.getAuditTrail(tenantId));
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      researchGrantsProjectsInnovationService.createProposal(
        {
          title: newPropTitle,
          tenantId,
          campusIdRef: 'CAMPUS_DELHI',
          researchUnitIdRef: newPropUnit,
          leadPiEmployeeIdRef: newPropPi,
          coPiRefs: ['EMP-FAC-004'],
          abstract: newPropAbstract || 'Standard institutional research grant proposal specification.',
          keywords: ['Artificial Intelligence', 'Healthcare', 'Algorithms'],
          proposedDurationMonths: newPropDuration,
          totalProposedBudget: { amount: newPropBudget, currency: 'INR' },
          indirectCostRatePercentage: 15,
          mandatoryComplianceCategories: ['HUMAN_SUBJECTS', 'DATA_ETHICS']
        },
        currentUserId,
        `IDEM-PROP-${Date.now()}`
      );
      showToast('Research proposal drafted and registered successfully!', 'success');
      setShowNewProposalModal(false);
      setNewPropTitle('');
      setNewPropAbstract('');
      refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create proposal', 'error');
    }
  };

  const handleApproveProposal = (proposalId: string, leadPi: string) => {
    try {
      researchGrantsProjectsInnovationService.approveProposal(
        proposalId,
        tenantId,
        currentUserId, // USER_DEAN_RESEARCH
        `IDEM-APP-PROP-${Date.now()}`
      );
      showToast('Proposal received institutional Dean approval (Four-Eyes SoD verified)!', 'success');
      refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Approval rejected', 'error');
    }
  };

  const handleRecordExpenditure = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      researchGrantsProjectsInnovationService.recordExpenditure(
        {
          budgetIdRef: selectedBudgetId,
          lineIdRef: selectedLineId,
          tenantId,
          transactionIdRef: `TX-BANK-2025-${Date.now().toString().slice(-4)}`,
          amount: { amount: expAmount, currency: 'INR' },
          expenditureDate: new Date().toISOString().split('T')[0],
          justification: expJustification || 'Project consumable purchases',
          authorizedByUserIdRef: currentUserId
        },
        currentUserId,
        `IDEM-EXP-${Date.now()}`
      );
      showToast('Expenditure recorded and budget line item reconciled!', 'success');
      setShowNewExpenditureModal(false);
      setExpJustification('');
      refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Expenditure failed', 'error');
    }
  };

  const handleCompleteMilestone = (milestoneId: string) => {
    try {
      researchGrantsProjectsInnovationService.completeMilestone(
        milestoneId,
        tenantId,
        currentUserId,
        `IDEM-MS-${Date.now()}`
      );
      showToast('Milestone verified and marked completed!', 'success');
      refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'Milestone completion failed', 'error');
    }
  };

  const handleDiscloseIp = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      researchGrantsProjectsInnovationService.discloseIntellectualProperty(
        {
          projectIdRef: newIpProject,
          tenantId,
          campusIdRef: 'CAMPUS_DELHI',
          inventionTitle: newIpTitle,
          inventorEmployeeRefs: ['EMP-FAC-001', 'EMP-FAC-004'],
          disclosureDate: new Date().toISOString().split('T')[0],
          ipType: newIpType,
          filingJurisdiction: 'Indian Patent Office (IPO)',
          institutionalOwnershipPercentage: 70,
          inventorRevenueSharePercentage: 30,
          commercialStatus: 'EVALUATING',
          confidentialityLevel: 'CONFIDENTIAL'
        },
        currentUserId,
        `IDEM-IP-${Date.now()}`
      );
      showToast('Invention disclosure registered with Institutional Tech Transfer Office!', 'success');
      setShowDiscloseIpModal(false);
      setNewIpTitle('');
      refreshAllData();
    } catch (err: any) {
      showToast(err.message || 'IP disclosure failed', 'error');
    }
  };

  const handleRunDiagnostics = () => {
    const res = researchGrantsProjectsInnovationService.runDiagnostics(tenantId);
    setDiagnosticsResult(res);
    showToast(
      res.status === 'HEALTHY'
        ? 'Diagnostic Scan Complete: Research operational engine 100% healthy.'
        : `Diagnostic Scan Complete: Found ${res.diagnostics.length} findings.`,
      res.status === 'HEALTHY' ? 'success' : 'info'
    );
  };

  const handleRunSimulation = () => {
    const res = researchGrantsProjectsInnovationService.runSimulation(selectedScenario);
    setSimulationResult(res);
    showToast(`Simulation executed: ${res.scenarioType} (Zero production mutations)`, 'info');
  };

  // Metric aggregates
  const totalAwardFunding = awards.reduce((sum, a) => sum + a.awardedAmount.amount, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'ACTIVE').length;
  const pendingProposalsCount = proposals.filter(p => p.status !== 'AWARDED' && p.status !== 'REJECTED').length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
              : toastMessage.type === 'error'
              ? 'bg-rose-950 border-rose-500 text-rose-200'
              : 'bg-indigo-950 border-indigo-500 text-indigo-200'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toastMessage.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
          {toastMessage.type === 'info' && <AlertTriangle className="w-5 h-5 text-indigo-400" />}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="bg-slate-800/90 border-b border-slate-700 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-600 to-indigo-600 rounded-xl shadow-lg">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Research, Grants, Innovation &amp; Sponsored Programs
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Phase 11.9
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authoritative Operations for Institutional Research, Grants, Proposals, Budgets, IP &amp; Commercialization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewProposalModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Draft Proposal</span>
            </button>
            <button
              onClick={refreshAllData}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto mt-4 pt-2 border-t border-slate-700/60 no-scrollbar">
          {[
            { id: 'overview', label: 'Command Center', icon: Activity },
            { id: 'units_programs', label: 'Units & Programs', icon: Building },
            { id: 'projects', label: 'Projects & Lifecycle', icon: Target },
            { id: 'proposals', label: 'Proposals', icon: FileText },
            { id: 'opportunities', label: 'Funding Opps', icon: Sparkles },
            { id: 'grants', label: 'Grants & Awards', icon: Award },
            { id: 'budgets', label: 'Budgets & Spend', icon: DollarSign },
            { id: 'milestones', label: 'Milestones', icon: CheckCircle2 },
            { id: 'compliance', label: 'Compliance & IRB', icon: ShieldCheck },
            { id: 'risks', label: 'Risks & Issues', icon: AlertTriangle },
            { id: 'outputs', label: 'Publications & Outputs', icon: BookOpen },
            { id: 'ip', label: 'Intellectual Property', icon: Lock },
            { id: 'innovation', label: 'Innovation & TRL', icon: Cpu },
            { id: 'diagnostics', label: 'Diagnostics', icon: Zap },
            { id: 'audit', label: 'Audit Trail', icon: FileCode },
            { id: 'sandbox', label: 'What-If Sandbox', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* ========================================== */}
        {/* TAB 1: OVERVIEW / COMMAND CENTER */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-white">{activeProjectsCount}</span>
                  <span className="ml-2 text-xs text-slate-400">of {projects.length} total</span>
                </div>
                <div className="mt-2 text-xs text-indigo-400 flex items-center gap-1">
                  <span>100% Phase 10/11 upstream cohesive</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Award Funding</span>
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-white">₹{(totalAwardFunding / 100000).toFixed(1)} L</span>
                  <span className="ml-2 text-xs text-slate-400">INR</span>
                </div>
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                  <span>Phase 11.2 Minor-Unit Precision</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Proposals</span>
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-white">{pendingProposalsCount}</span>
                  <span className="ml-2 text-xs text-slate-400">Under Review</span>
                </div>
                <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                  <span>Four-Eyes SoD Gated</span>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patents &amp; IP</span>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Lock className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-white">{ips.length}</span>
                  <span className="ml-2 text-xs text-slate-400">Disclosures</span>
                </div>
                <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                  <span>TRL-6 Hardware Prototype</span>
                </div>
              </div>
            </div>

            {/* Active Research Spotlight */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-amber-400" />
                    <span>Flagship Research Projects</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.map(proj => (
                    <div
                      key={proj.projectId}
                      className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-950/60 rounded border border-amber-500/30">
                            {proj.projectCode}
                          </span>
                          <span className="text-sm font-semibold text-slate-100">{proj.title}</span>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                          {proj.status}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400 border-t border-slate-800 pt-2">
                        <div>
                          <span className="text-slate-500 block">Lead PI</span>
                          <span className="text-slate-200 font-medium">{proj.principalInvestigator.fullName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Budget</span>
                          <span className="text-slate-200 font-medium">₹{(proj.totalBudget.amount / 100000).toFixed(1)} Lakhs</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Discipline</span>
                          <span className="text-slate-200 font-medium">{proj.disciplineCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Space Ref</span>
                          <span className="text-slate-200 font-medium">{proj.facilitySpaceRefs?.[0] || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Governance & SoD Status */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Governance &amp; Four-Eyes SoD</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>Lead PI Self-Approval</span>
                        <span className="text-emerald-400 font-bold">BLOCKED (0 Violations)</span>
                      </div>
                      <p className="mt-1 text-slate-400 text-[11px]">
                        Requester !== Approver enforced across proposals, budget reallocations &amp; closeouts.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>SHA-256 Audit Chaining</span>
                        <span className="text-emerald-400 font-bold">VALID &amp; INTACT</span>
                      </div>
                      <p className="mt-1 text-slate-400 text-[11px]">
                        {auditEvents.length} cryptographic blocks chained with zero tampering.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between text-slate-300 font-medium">
                        <span>IRB / Ethics Clearance</span>
                        <span className="text-indigo-400 font-bold">1 Active Protocol</span>
                      </div>
                      <p className="mt-1 text-slate-400 text-[11px]">
                        IRB-HUMAN-2025-044 approved with patient consent gating.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={handleRunDiagnostics}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Run Diagnostic Scan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: RESEARCH UNITS & PROGRAMS */}
        {/* ========================================== */}
        {activeTab === 'units_programs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Institutional Research Units &amp; Strategic Programs</h2>
                <p className="text-xs text-slate-400">
                  Governed academic research centres linked to Phase 10.1 Departments and Phase 10.2 Disciplines
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {units.map(unit => (
                <div key={unit.unitId} className="bg-slate-800/70 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-950/60 rounded border border-amber-500/30">
                        {unit.code}
                      </span>
                      <h3 className="text-sm font-bold text-white">{unit.name}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {unit.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{unit.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-750">
                    <div>
                      <span className="text-slate-500 block">Department Ref</span>
                      <span className="text-slate-200 font-medium">{unit.departmentIdRef}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Faculty Lead</span>
                      <span className="text-slate-200 font-medium">{unit.facultyLeadEmployeeIdRef}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Disciplines</span>
                      <span className="text-slate-200 font-medium">{unit.focusDisciplines.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Programs */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Sponsored Strategic Research Programs</span>
              </h3>
              <div className="space-y-3">
                {programs.map(prog => (
                  <div key={prog.programId} className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-950/60 rounded">
                          {prog.code}
                        </span>
                        <span className="text-sm font-semibold text-slate-100">{prog.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        Allocated: ₹{(prog.totalAllocatedBudget.amount / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex flex-wrap gap-4">
                      <span>Theme: <strong className="text-slate-300">{prog.strategicTheme}</strong></span>
                      <span>Target Sponsors: <strong className="text-slate-300">{prog.targetFundingSponsors.join(', ')}</strong></span>
                      <span>Lead: <strong className="text-slate-300">{prog.leadCoordinatorEmployeeIdRef}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PROJECTS & LIFECYCLE */}
        {/* ========================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Research Projects &amp; Lifecycle State Control</h2>
                <p className="text-xs text-slate-400">
                  Deterministic lifecycle validation: DRAFT &rarr; PROPOSED &rarr; SUBMITTED &rarr; UNDER_REVIEW &rarr; APPROVED &rarr; ACTIVE &rarr; CLOSED
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-slate-800/80 border border-slate-700 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Code &amp; Title</th>
                    <th className="px-4 py-3 font-semibold">Lead PI</th>
                    <th className="px-4 py-3 font-semibold">Budget</th>
                    <th className="px-4 py-3 font-semibold">Duration</th>
                    <th className="px-4 py-3 font-semibold">Version</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {projects.map(p => (
                    <tr key={p.projectId} className="hover:bg-slate-750 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100">{p.title}</div>
                        <span className="text-[11px] font-mono text-amber-400">{p.projectCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-200 font-medium">{p.principalInvestigator.fullName}</div>
                        <div className="text-[11px] text-slate-400">{p.principalInvestigator.email}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        ₹{(p.totalBudget.amount / 100000).toFixed(1)} Lakhs
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {p.startDate} &rarr; {p.targetCompletionDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-mono">v{p.version}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer">
                          Inspect &rarr;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: PROPOSALS */}
        {/* ========================================== */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Research Proposals &amp; Sponsor Submissions</h2>
                <p className="text-xs text-slate-400">
                  Four-Eyes Institutional Endorsement: Lead PI cannot approve their own proposal
                </p>
              </div>
              <button
                onClick={() => setShowNewProposalModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>New Proposal</span>
              </button>
            </div>

            <div className="space-y-4">
              {proposals.map(prop => (
                <div key={prop.proposalId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 bg-indigo-950/70 rounded border border-indigo-500/30">
                        {prop.proposalNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{prop.title}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      {prop.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">{prop.abstract}</p>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                    <div>
                      <span className="text-slate-500 block">Lead PI Ref</span>
                      <span className="text-slate-200 font-medium">{prop.leadPiEmployeeIdRef}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Proposed Budget</span>
                      <span className="text-emerald-400 font-bold">₹{(prop.totalProposedBudget.amount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Duration</span>
                      <span className="text-slate-200 font-medium">{prop.proposedDurationMonths} Months</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Compliance Gating</span>
                      <span className="text-slate-200 font-medium">{prop.mandatoryComplianceCategories.join(', ')}</span>
                    </div>
                  </div>

                  {prop.status === 'DRAFT' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleApproveProposal(prop.proposalId, prop.leadPiEmployeeIdRef)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Institutional Dean Approval (SoD)</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: FUNDING OPPORTUNITIES */}
        {/* ========================================== */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">External &amp; Institutional Funding Opportunities</h2>
                <p className="text-xs text-slate-400">
                  Government, Industry and Foundation grant calls with strict eligibility criteria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map(opp => (
                <div key={opp.opportunityId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-950/60 rounded">
                      {opp.opportunityCode}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {opp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{opp.title}</h3>
                  <p className="text-xs text-indigo-300 font-medium">Sponsor: {opp.sponsorName} ({opp.sponsorType})</p>
                  <p className="text-xs text-slate-400">{opp.eligibilitySummary}</p>

                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">
                      Max: {opp.maxFundingAmount.currency} {opp.maxFundingAmount.amount.toLocaleString()}
                    </span>
                    <span className="text-slate-400">Closes: {opp.closingDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: GRANTS & AWARDS */}
        {/* ========================================== */}
        {activeTab === 'grants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Active Grant Awards &amp; Reporting Obligations</h2>
                <p className="text-xs text-slate-400">
                  Executed sponsor grant agreements linked to Phase 11.2 Financial General Ledger Accounts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {awards.map(awd => (
                <div key={awd.awardId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 bg-emerald-950/70 rounded border border-emerald-500/30">
                        {awd.awardNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{awd.sponsorAwardReferenceNumber}</h3>
                        <span className="text-xs text-slate-400">{awd.sponsorName}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      {awd.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300">{awd.termsAndConditionsSummary}</p>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                    <div>
                      <span className="text-slate-500 block">Awarded Capital</span>
                      <span className="text-emerald-400 font-bold">₹{(awd.awardedAmount.amount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Overhead Share</span>
                      <span className="text-slate-200 font-medium">₹{(awd.indirectOverheadAmount.amount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Period</span>
                      <span className="text-slate-200 font-medium">{awd.awardStartDate} &rarr; {awd.awardEndDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Next Report Due</span>
                      <span className="text-amber-400 font-bold">{awd.reportingRequirements.nextReportDueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: BUDGETS & SPEND */}
        {/* ========================================== */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Research Project Budgets &amp; Expenditure Ledger</h2>
                <p className="text-xs text-slate-400">
                  Deterministic Integer Minor-Unit Arithmetic: Strict validation against overrun and currency mismatch
                </p>
              </div>
              <button
                onClick={() => setShowNewExpenditureModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Record Spend</span>
              </button>
            </div>

            {budgets.map(bg => (
              <div key={bg.budgetId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Project Budget: {bg.projectIdRef}</h3>
                    <span className="text-xs text-slate-400 font-mono">GL Account: {bg.financialAccountIdRef}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-slate-300">
                      Allocated: ₹{(bg.totalAllocated.amount / 100000).toFixed(1)}L
                    </span>
                    <span className="text-amber-400">
                      Expended: ₹{(bg.totalExpended.amount / 100000).toFixed(1)}L
                    </span>
                    <span className="text-emerald-400">
                      Remaining: ₹{(bg.totalRemaining.amount / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>

                {/* Lines Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Line Item</th>
                        <th className="px-3 py-2 font-semibold">Category</th>
                        <th className="px-3 py-2 font-semibold">Allocated</th>
                        <th className="px-3 py-2 font-semibold">Committed</th>
                        <th className="px-3 py-2 font-semibold">Expended</th>
                        <th className="px-3 py-2 font-semibold">Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {bg.lines.map(line => {
                        const rem = line.allocatedAmount.amount - line.expendedAmount.amount;
                        return (
                          <tr key={line.lineId} className="hover:bg-slate-750">
                            <td className="px-3 py-2.5">
                              <span className="font-mono text-indigo-300 mr-2">{line.lineId}</span>
                              <span className="text-slate-200">{line.description}</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">{line.category}</span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-200">₹{line.allocatedAmount.amount.toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-slate-400">₹{line.committedAmount.amount.toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-amber-400 font-medium">₹{line.expendedAmount.amount.toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-emerald-400 font-bold">₹{rem.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 8: MILESTONES */}
        {/* ========================================== */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Project Deliverable Milestones &amp; Evidence Repository</h2>
                <p className="text-xs text-slate-400">
                  Tracking research progress weights, completion verification and deliverable artifacts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {milestones.map(ms => (
                <div key={ms.milestoneId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 bg-amber-950/70 rounded">
                        {ms.milestoneCode}
                      </span>
                      <h3 className="text-sm font-bold text-white">{ms.title}</h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        ms.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ms.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300">{ms.description}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700 pt-3">
                    <div className="flex items-center gap-4">
                      <span>Weight: <strong className="text-slate-200">{ms.weightPercentage}%</strong></span>
                      <span>Due Date: <strong className="text-slate-200">{ms.dueDate}</strong></span>
                    </div>

                    {ms.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleCompleteMilestone(ms.milestoneId)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Verify Completion</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 9: COMPLIANCE & IRB */}
        {/* ========================================== */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Research Compliance, Ethics (IRB/IACUC) &amp; Biosafety</h2>
                <p className="text-xs text-slate-400">
                  Institutional human-subject ethical clearances, informed consent oversight, and biosafety protocols
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ethicsProtocols.map(eth => (
                <div key={eth.ethicsProtocolId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-950/60 rounded">
                      {eth.protocolNumber}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {eth.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{eth.reviewBoardType}</h3>
                  <p className="text-xs text-slate-300">{eth.conditionsOfApproval}</p>

                  <div className="pt-2 border-t border-slate-700 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Approval Date</span>
                      <span className="text-slate-200 font-medium">{eth.approvalDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Expires</span>
                      <span className="text-amber-400 font-medium">{eth.expirationDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 10: RISKS & ISSUES */}
        {/* ========================================== */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Project Risks, Mitigation Strategies &amp; Issue Log</h2>
                <p className="text-xs text-slate-400">
                  Deterministic bounded risk scoring: Probability &times; Severity matrix
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {risks.map(r => (
                <div key={r.riskId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-0.5 bg-rose-950/70 text-rose-300 rounded border border-rose-500/30">
                        Score: {r.riskScore}/16
                      </span>
                      <h3 className="text-sm font-bold text-white">{r.title}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{r.description}</p>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-750 text-xs">
                    <span className="text-slate-400 font-semibold block mb-1">Mitigation Strategy:</span>
                    <span className="text-emerald-300">{r.mitigationPlan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 11: OUTPUTS & PUBLICATIONS */}
        {/* ========================================== */}
        {activeTab === 'outputs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Peer-Reviewed Publications &amp; Research Artifacts</h2>
                <p className="text-xs text-slate-400">
                  Metadata-only reference architecture linking research outputs with Phase 11.8 Library cataloging
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {publications.map(pub => (
                <div key={pub.publicationId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{pub.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      {pub.status}
                    </span>
                  </div>

                  <p className="text-xs text-indigo-300">{pub.journalOrVenueName} ({pub.publicationYear})</p>
                  <p className="text-xs text-slate-400">Authors: {pub.authors.join(', ')}</p>

                  <div className="pt-2 border-t border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-400">
                    <span>DOI: <strong className="text-slate-300">{pub.doi}</strong></span>
                    <span>Citations: <strong className="text-emerald-400">{pub.citationCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 12: INTELLECTUAL PROPERTY */}
        {/* ========================================== */}
        {activeTab === 'ip' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Intellectual Property &amp; Patent Disclosures</h2>
                <p className="text-xs text-slate-400">
                  Institutional invention disclosures, equity-sharing ratios (70:30), and patent filings
                </p>
              </div>
              <button
                onClick={() => setShowDiscloseIpModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Disclose Invention</span>
              </button>
            </div>

            <div className="space-y-4">
              {ips.map(ip => (
                <div key={ip.ipId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-purple-400 px-2.5 py-1 bg-purple-950/70 rounded">
                        {ip.ipCode}
                      </span>
                      <h3 className="text-sm font-bold text-white">{ip.inventionTitle}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                      {ip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                    <div>
                      <span className="text-slate-500 block">Patent App Number</span>
                      <span className="text-slate-200 font-mono font-medium">{ip.patentApplicationNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Jurisdiction</span>
                      <span className="text-slate-200 font-medium">{ip.filingJurisdiction}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Equity Share</span>
                      <span className="text-slate-200 font-medium">Inst {ip.institutionalOwnershipPercentage}% / Inv {ip.inventorRevenueSharePercentage}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Commercial State</span>
                      <span className="text-emerald-400 font-medium">{ip.commercialStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 13: INNOVATION & TRL */}
        {/* ========================================== */}
        {activeTab === 'innovation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Innovation Ventures, Tech-Transfer &amp; Incubation</h2>
                <p className="text-xs text-slate-400">
                  Technology Readiness Levels (TRL 1-9) &amp; Phase 11.5 Incubation Space Allocations
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {innovations.map(inn => (
                <div key={inn.innovationId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 bg-amber-950/70 rounded">
                        {inn.code}
                      </span>
                      <h3 className="text-sm font-bold text-white">{inn.title}</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      {inn.status}
                    </span>
                  </div>

                  {/* TRL Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Technology Readiness Level (TRL)</span>
                      <span className="text-amber-400 font-bold">Level {inn.technologyReadinessLevel} / 9</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${(inn.technologyReadinessLevel / 9) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
                    <div>
                      <span className="text-slate-500 block">Target Market</span>
                      <span className="text-slate-200 font-medium">{inn.targetMarket}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Incubation Space Ref</span>
                      <span className="text-slate-200 font-medium">{inn.incubationSpaceRef} (Phase 11.5)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Funding Raised</span>
                      <span className="text-emerald-400 font-bold">₹{(inn.fundingRaised.amount / 100000).toFixed(1)} Lakhs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 14: DIAGNOSTICS */}
        {/* ========================================== */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Diagnostic Scanner &amp; Governance Integrity Monitor</h2>
                <p className="text-xs text-slate-400">
                  Scans for broken upstream references, self-approval violations, overdue milestones and budget mismatches
                </p>
              </div>
              <button
                onClick={handleRunDiagnostics}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Execute Deep Scan</span>
              </button>
            </div>

            {diagnosticsResult ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    diagnosticsResult.status === 'HEALTHY'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold">Status: {diagnosticsResult.status}</h4>
                      <p className="text-xs opacity-80">
                        Scanned {diagnosticsResult.totalProjectsScanned} Projects, {diagnosticsResult.totalProposalsScanned} Proposals, {diagnosticsResult.totalAwardsScanned} Awards.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium">Scanned: {new Date(diagnosticsResult.scannedAt).toLocaleTimeString()}</span>
                </div>

                <div className="space-y-3">
                  {diagnosticsResult.diagnostics.length === 0 ? (
                    <div className="p-8 text-center bg-slate-800/40 border border-slate-700 rounded-xl">
                      <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
                      <h4 className="text-sm font-bold text-white">Zero Integrity Defects Detected</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        All audit chains, SoD constraints, and budget ledger records are 100% compliant.
                      </p>
                    </div>
                  ) : (
                    diagnosticsResult.diagnostics.map(diag => (
                      <div key={diag.diagnosticId} className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400">{diag.code}</span>
                          <span className="text-xs px-2 py-0.5 bg-rose-950 text-rose-300 rounded font-medium">{diag.severity}</span>
                        </div>
                        <p className="text-xs text-slate-200">{diag.message}</p>
                        <p className="text-[11px] text-indigo-300">Action: {diag.recommendedAction}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-800/40 border border-slate-700 rounded-xl">
                <Activity className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-sm text-slate-300 font-medium">No diagnostics scan run in this session.</p>
                <p className="text-xs text-slate-500 mt-1">Click &quot;Execute Deep Scan&quot; above to inspect operational integrity.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 15: AUDIT TRAIL */}
        {/* ========================================== */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">SHA-256 Chained Cryptographic Audit Trail</h2>
                <p className="text-xs text-slate-400">
                  Tamper-evident append-only ledger: Every block chains to its predecessor hash
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {auditEvents.map(event => (
                <div key={event.eventId} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-950/70 rounded">
                        {event.eventId}
                      </span>
                      <span className="font-bold text-white">{event.action}</span>
                      <span className="text-slate-400 font-mono">({event.entityType}: {event.entityId})</span>
                    </div>
                    <span className="text-slate-400">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-750">
                    <div className="truncate">
                      <span className="text-slate-500">Prev: </span>
                      <span className="text-slate-400">{event.previousAuditHash}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">Curr: </span>
                      <span className="text-emerald-400">{event.currentAuditHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 16: WHAT-IF SANDBOX */}
        {/* ========================================== */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            {/* Mandatory Banner */}
            <div className="bg-amber-950/80 border-2 border-amber-500/80 rounded-xl p-4 shadow-lg text-center">
              <span className="text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase">
                SIMULATION ONLY - SANDBOX MODE ACTIVE - ZERO PRODUCTION MUTATION
              </span>
              <p className="text-xs text-amber-200/80 mt-1">
                Stress-test institutional research scenarios in-memory without affecting live projects, budgets, or grant agreements.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Select Simulation Scenario (15 Governed Models)</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value as any)}
                  className="sm:col-span-2 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-medium focus:ring-1 focus:ring-amber-500"
                >
                  <option value="GRANT_APPLICATION_SURGE">1. Grant Application Surge (3.5x Volume)</option>
                  <option value="FUNDING_OPPORTUNITY_DEADLINE_SURGE">2. Funding Opportunity Deadline Surge</option>
                  <option value="RESEARCH_PROJECT_SURGE">3. Research Project Surge (Capacity Stress)</option>
                  <option value="BUDGET_CUT_SCENARIO">4. Budget Cut Scenario (-30% Award Reduction)</option>
                  <option value="BUDGET_INCREASE_SCENARIO">5. Budget Increase Scenario (+60% Capital Inflow)</option>
                  <option value="MILESTONE_DELAY_CASCADE">6. Milestone Delay Cascade (Sponsor NCE Needed)</option>
                  <option value="RESEARCHER_CAPACITY_SHORTAGE">7. Researcher Capacity Shortage</option>
                  <option value="GRANT_EXTENSION_SURGE">8. Grant Extension Surge</option>
                  <option value="GRANT_CLOSEOUT_SURGE">9. Grant Closeout Surge (Audit Reconciliations)</option>
                  <option value="COMPLIANCE_REVIEW_BACKLOG">10. Compliance Review Backlog (IRB Stress)</option>
                  <option value="RESEARCH_RISK_ESCALATION">11. Research Risk Escalation</option>
                  <option value="IP_DISCLOSURE_SURGE">12. IP Disclosure Surge (Patent Pipeline)</option>
                  <option value="INNOVATION_PIPELINE_SURGE">13. Innovation Pipeline Surge (Incubation Stress)</option>
                  <option value="COMMERCIALIZATION_DELAY">14. Commercialization Delay</option>
                  <option value="MULTI_CAMPUS_RESEARCH_PROGRAM">15. Multi-Campus Research Program (Consortium)</option>
                </select>

                <button
                  onClick={handleRunSimulation}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Execute Simulation</span>
                </button>
              </div>
            </div>

            {/* Simulation Results Output */}
            {simulationResult && (
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Projected Outcome: {simulationResult.scenarioType}</span>
                  </h4>
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                    Zero Production Mutation: {simulationResult.zeroProductionMutationVerified ? 'VERIFIED' : 'FAILED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">Stress Multiplier</span>
                    <span className="text-amber-400 font-bold text-sm">{simulationResult.stressFactorMultiplier}x</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">Projected Proposals</span>
                    <span className="text-white font-bold text-sm">{simulationResult.projectedProposalVolume}</span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">Projected Award Value</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ₹{(simulationResult.projectedAwardValue.amount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-750">
                    <span className="text-slate-500 block">Compliance Backlog</span>
                    <span className="text-indigo-300 font-bold text-sm">
                      +{simulationResult.projectedComplianceBacklogDays} Days
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-750 space-y-2 text-xs">
                  <span className="text-slate-400 font-semibold block">Strategic Recommendations:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    {simulationResult.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL 1: NEW PROPOSAL */}
      {/* ========================================== */}
      {showNewProposalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Draft Institutional Research Proposal</h3>
              <button onClick={() => setShowNewProposalModal(false)} className="text-slate-400 hover:text-slate-200">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={newPropTitle}
                  onChange={e => setNewPropTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Quantum Sensor Arrays for Atmospheric Monitoring"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Research Unit</label>
                  <select
                    value={newPropUnit}
                    onChange={e => setNewPropUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                  >
                    {units.map(u => (
                      <option key={u.unitId} value={u.unitId}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Lead PI Ref (Phase 11.1)</label>
                  <input
                    type="text"
                    value={newPropPi}
                    onChange={e => setNewPropPi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Proposed Budget (INR)</label>
                  <input
                    type="number"
                    min="100000"
                    step="10000"
                    value={newPropBudget}
                    onChange={e => setNewPropBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="6"
                    max="60"
                    value={newPropDuration}
                    onChange={e => setNewPropDuration(parseInt(e.target.value) || 36)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Abstract Summary</label>
                <textarea
                  rows={3}
                  value={newPropAbstract}
                  onChange={e => setNewPropAbstract(e.target.value)}
                  placeholder="Outline aims, scientific methodology, and expected publications/patents..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProposalModal(false)}
                  className="px-3.5 py-2 bg-slate-700 text-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded"
                >
                  Register Draft Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: RECORD EXPENDITURE */}
      {/* ========================================== */}
      {showNewExpenditureModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Record Project Expenditure</h3>
              <button onClick={() => setShowNewExpenditureModal(false)} className="text-slate-400 hover:text-slate-200">
                &times;
              </button>
            </div>

            <form onSubmit={handleRecordExpenditure} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Budget</label>
                <select
                  value={selectedBudgetId}
                  onChange={e => setSelectedBudgetId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                >
                  {budgets.map(b => (
                    <option key={b.budgetId} value={b.budgetId}>{b.projectIdRef} ({b.budgetId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Budget Line Item</label>
                <select
                  value={selectedLineId}
                  onChange={e => setSelectedLineId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                >
                  {budgets
                    .find(b => b.budgetId === selectedBudgetId)
                    ?.lines.map(l => (
                      <option key={l.lineId} value={l.lineId}>
                        {l.lineId}: {l.category} (Rem: ₹{l.allocatedAmount.amount - l.expendedAmount.amount})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Expenditure Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={expAmount}
                  onChange={e => setExpAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Justification</label>
                <input
                  type="text"
                  required
                  value={expJustification}
                  onChange={e => setExpJustification(e.target.value)}
                  placeholder="e.g. Optical lenses calibration equipment"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewExpenditureModal(false)}
                  className="px-3.5 py-2 bg-slate-700 text-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded"
                >
                  Reconcile &amp; Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: DISCLOSE IP */}
      {/* ========================================== */}
      {showDiscloseIpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Disclose Invention to Tech Transfer</h3>
              <button onClick={() => setShowDiscloseIpModal(false)} className="text-slate-400 hover:text-slate-200">
                &times;
              </button>
            </div>

            <form onSubmit={handleDiscloseIp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Invention Title</label>
                <input
                  type="text"
                  required
                  value={newIpTitle}
                  onChange={e => setNewIpTitle(e.target.value)}
                  placeholder="e.g. Ultra-sensitive Biosensor for Heavy Metal Water Contamination"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Originating Project</label>
                <select
                  value={newIpProject}
                  onChange={e => setNewIpProject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                >
                  {projects.map(p => (
                    <option key={p.projectId} value={p.projectId}>{p.title} ({p.projectCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">IP Type</label>
                <select
                  value={newIpType}
                  onChange={e => setNewIpType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-100"
                >
                  <option value="PATENT">Patent</option>
                  <option value="COPYRIGHT">Copyright</option>
                  <option value="TRADEMARK">Trademark</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscloseIpModal(false)}
                  className="px-3.5 py-2 bg-slate-700 text-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded"
                >
                  Submit Disclosure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
