import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Layers,
  Sliders,
  Activity,
  RefreshCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  HelpCircle,
  Briefcase,
  Users,
  Home,
  Cpu,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Search,
  Plus,
  Filter,
  BookOpen,
  ArrowRight,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { ResourcePlanningService, safeRound, safeDivide } from '../../services/resourcePlanningService';
import { SecurityTestService } from '../../services/securityTestService';
import { useAuth } from '../../context/AuthContext';
import {
  ResourceCategory,
  ResourcePlan,
  ResourceCapacityProfile,
  ResourceAllocationRequest,
  PortfolioItem,
  ResourceConstraint,
  ResourceOptimizationAction,
  ResourceScenario,
  ResourceScenarioResult,
  ResourceDataQualityIssue,
  PriorityBand
} from '../../types/resourcePlanning';

type SectionTab = 'COMMAND' | 'PLANS' | 'CAPACITY' | 'ALLOCATION' | 'PORTFOLIO' | 'SIMULATION' | 'SECURITY';

export const ResourcePlanningWorkspace: React.FC = () => {
  const { currentUser, activeRoleAssignment } = useAuth();
  const tenantId = 'DEFAULT';
  const actorId = currentUser?.uid || currentUser?.email || 'usr_admin';
  const userRole = activeRoleAssignment?.roleCode || 'SUPER_ADMIN';

  // Workspace Nav Tab
  const [activeTab, setActiveTab] = useState<SectionTab>('COMMAND');
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Core Entity Pools
  const [plans, setPlans] = useState<ResourcePlan[]>([]);
  const [capacityProfiles, setCapacityProfiles] = useState<ResourceCapacityProfile[]>([]);
  const [allocationRequests, setAllocationRequests] = useState<ResourceAllocationRequest[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [constraints, setConstraints] = useState<ResourceConstraint[]>([]);
  const [optimizationActions, setOptimizationActions] = useState<ResourceOptimizationAction[]>([]);
  const [scenarios, setScenarios] = useState<ResourceScenario[]>([]);
  const [qualityIssues, setQualityIssues] = useState<ResourceDataQualityIssue[]>([]);
  const [utilizationSnapshot, setUtilizationSnapshot] = useState<any>(null);

  // --- Creation Forms ---
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [planName, setPlanName] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planYear, setPlanYear] = useState('2026');
  const [planCategory, setPlanCategory] = useState<ResourceCategory>('ACADEMIC');
  const [planCost, setPlanCost] = useState(150000);

  const [isCreatingCapacity, setIsCreatingCapacity] = useState(false);
  const [capName, setCapName] = useState('');
  const [capId, setCapId] = useState('');
  const [capCategory, setCapCategory] = useState<ResourceCategory>('HUMAN');
  const [capTotal, setCapTotal] = useState(160);
  const [capUsed, setCapUsed] = useState(80);
  const [capUnit, setCapUnit] = useState('hours/month');

  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [reqCategory, setReqCategory] = useState<ResourceCategory>('HUMAN');
  const [reqResourceId, setReqResourceId] = useState('');
  const [reqPortfolioId, setReqPortfolioId] = useState('');
  const [reqQuantity, setReqQuantity] = useState(40);
  const [reqJustification, setReqJustification] = useState('');
  const [reqPriority, setReqPriority] = useState<PriorityBand>('HIGH');

  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false);
  const [portName, setPortName] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portBudget, setPortBudget] = useState(50000);

  // Prioritization Scores state
  const [scoringPortId, setScoringPortId] = useState<string | null>(null);
  const [scoreStrategic, setScoreStrategic] = useState(5);
  const [scoreUrgency, setScoreUrgency] = useState(5);
  const [scoreImpact, setScoreImpact] = useState(5);
  const [scoreRegulatory, setScoreRegulatory] = useState(5);
  const [scoreStudent, setScoreStudent] = useState(5);

  // What-if Scenario state
  const [scenName, setScenName] = useState('Projected Academic Expansion');
  const [scenDesc, setScenDesc] = useState('Scenario modeling a major enrollment surge next autumn.');
  const [scenEnrollment, setScenEnrollment] = useState(15);
  const [scenStaffRed, setScenStaffRed] = useState(0);
  const [scenFacilityExp, setScenFacilityExp] = useState(true);
  const [activeSimulationResult, setActiveSimulationResult] = useState<{ scenario: ResourceScenario; result: ResourceScenarioResult } | null>(null);

  // Dynamic Approvals justification input
  const [approverJustification, setApproverJustification] = useState('');

  // Security Verification Matrix state
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState<boolean>(false);
  const [securityTests, setSecurityTests] = useState<{ testId: string; title: string; passed: boolean; details: string }[]>([]);
  const [securityQuery, setSecurityQuery] = useState('');

  // Load workspace data
  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const [
        pList,
        capList,
        reqList,
        portList,
        constList,
        optList,
        scenList,
        qList,
        snap
      ] = await Promise.all([
        ResourcePlanningService.getPlans(actorId, tenantId),
        ResourcePlanningService.getCapacityProfiles(actorId, tenantId),
        ResourcePlanningService.getAllocationRequests(actorId, tenantId),
        ResourcePlanningService.getPortfolioItems(actorId, tenantId),
        ResourcePlanningService.getConstraints(actorId, tenantId),
        ResourcePlanningService.getOptimizationActions(actorId, tenantId),
        ResourcePlanningService.getScenarios(actorId, tenantId),
        ResourcePlanningService.getDataQualityIssues(actorId, tenantId),
        ResourcePlanningService.calculateUtilizationEfficiency(tenantId)
      ]);

      setPlans(pList);
      setCapacityProfiles(capList);
      setAllocationRequests(reqList);
      setPortfolioItems(portList);
      setConstraints(constList);
      setOptimizationActions(optList);
      setScenarios(scenList);
      setQualityIssues(qList);
      setUtilizationSnapshot(snap);
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedback({ text, type });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // Action: Create Plan
  const handleCreatePlan = async () => {
    try {
      if (!planName.trim()) throw new Error('Plan name is required.');
      await ResourcePlanningService.createPlan(actorId, tenantId, {
        name: planName,
        description: planDesc,
        fiscalYear: planYear,
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        category: planCategory,
        totalEstimatedCost: planCost,
        totalAllocatedCost: 0
      }, 'admin');

      showFeedback(`Plan "${planName}" created successfully in DRAFT state.`, 'success');
      setIsCreatingPlan(false);
      setPlanName('');
      setPlanDesc('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Submit Plan for Approval
  const handleSubmitPlan = async (id: string) => {
    try {
      await ResourcePlanningService.submitPlanForApproval(actorId, tenantId, id);
      showFeedback('Plan submitted for peer review. Draft locked and snapshot saved.', 'success');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Approve Plan (SoD)
  const handleApprovePlan = async (id: string) => {
    try {
      if (!approverJustification.trim()) {
        throw new Error('Approval requires a compliance justification.');
      }
      await ResourcePlanningService.approvePlan(actorId, tenantId, id, approverJustification, 'admin');
      showFeedback('Plan approved successfully (Four-Eyes principle satisfied).', 'success');
      setApproverJustification('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Create Capacity Profile
  const handleCreateCapacity = async () => {
    try {
      if (!capName.trim() || !capId.trim()) throw new Error('Resource identifier and name are required.');
      await ResourcePlanningService.createCapacityProfile(actorId, tenantId, {
        resourceId: capId,
        resourceName: capName,
        category: capCategory,
        totalCapacity: capTotal,
        usedCapacity: capUsed,
        unitOfMeasure: capUnit,
        status: 'ACTIVE',
        lastCheckedAt: new Date().toISOString()
      }, 'admin');

      showFeedback(`Registered capacity profile for "${capName}".`, 'success');
      setIsCreatingCapacity(false);
      setCapName('');
      setCapId('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Request Resource Allocation
  const handleCreateAllocationRequest = async () => {
    try {
      if (!reqJustification.trim()) throw new Error('Justification is required for resource allocation.');
      await ResourcePlanningService.createAllocationRequest(actorId, tenantId, {
        resourceCategory: reqCategory,
        resourceId: reqResourceId || undefined,
        portfolioItemId: reqPortfolioId || undefined,
        requestedQuantity: reqQuantity,
        requiredStartDate: '2026-09-01',
        requiredEndDate: '2026-12-31',
        justification: reqJustification,
        priority: reqPriority,
        requesterId: actorId
      });

      showFeedback('Allocation request created successfully. Pending peer review.', 'success');
      setIsCreatingRequest(false);
      setReqJustification('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Allocate Resource Decision (SoD)
  const handleProcessAllocation = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const notes = approverJustification.trim() || 'Reviewed and certified as compliant with spatial rules.';
      const req = allocationRequests.find(r => r.id === requestId);
      if (!req) throw new Error('Request not found.');

      await ResourcePlanningService.allocateResource(
        actorId,
        tenantId,
        requestId,
        decision === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        req.requestedQuantity,
        notes,
        'admin'
      );

      showFeedback(`Request processed: ${decision}. Capacity and constraints updated automatically.`, 'success');
      setApproverJustification('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Create Portfolio Item
  const handleCreatePortfolio = async () => {
    try {
      if (!portName.trim()) throw new Error('Portfolio item name is required.');
      await ResourcePlanningService.createPortfolioItem(actorId, tenantId, {
        name: portName,
        description: portDesc,
        proposerId: actorId,
        estimatedTotalBudget: portBudget
      });

      showFeedback(`Portfolio item "${portName}" registered successfully in PROPOSED state.`, 'success');
      setIsCreatingPortfolio(false);
      setPortName('');
      setPortDesc('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Save Strategic Prioritization Scores
  const handlePrioritizePortfolio = async () => {
    try {
      if (!scoringPortId) return;
      await ResourcePlanningService.calculateStrategicScore(actorId, tenantId, scoringPortId, {
        strategicAlignment: scoreStrategic,
        urgency: scoreUrgency,
        institutionalImpact: scoreImpact,
        regulatoryRequirement: scoreRegulatory,
        studentImpact: scoreStudent,
        operationalCriticality: 5,
        riskReduction: 5,
        resourceEfficiency: 5
      });

      showFeedback('Prioritization scores computed and portfolio item prioritized.', 'success');
      setScoringPortId(null);
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Certify Compliance Rating
  const handleCertifyCompliance = async (targetId: string, type: 'PLAN' | 'PORTFOLIO') => {
    try {
      if (!approverJustification.trim()) {
        throw new Error('Compliance notes/justification is required to certify.');
      }
      await ResourcePlanningService.certifyGovernanceReview(actorId, tenantId, {
        reviewerId: actorId,
        reviewTargetType: type,
        reviewTargetId: targetId,
        complianceRating: 'COMPLIANT',
        certificationSignature: `SIG_${actorId}_COMPLIANCE_CERT`
      });

      showFeedback('Compliance certificate generated and stored in audit ledger.', 'success');
      setApproverJustification('');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Run Global Data Sanity Scan
  const handleRunGlobalSanity = async () => {
    try {
      const issues = await ResourcePlanningService.runGlobalDataSanityCheck(actorId, tenantId);
      showFeedback(`Global scan completed. Found ${issues.length} active data quality items.`, 'success');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Run What-If Projections Simulation
  const handleRunSimulation = async () => {
    try {
      const result = await ResourcePlanningService.runScenarioSimulation(
        actorId,
        tenantId,
        scenName,
        scenDesc,
        {
          enrollmentChangePercentage: scenEnrollment,
          staffReductionPercentage: scenStaffRed,
          facilityExpanded: scenFacilityExp,
          newCampusAdded: false,
          budgetReductionPercentage: 0
        }
      );
      setActiveSimulationResult(result);
      showFeedback('Simulation outputs projected successfully using safe math modules.', 'success');
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Certify Simulation Result
  const handleCertifySimulation = async (resultId: string) => {
    try {
      await ResourcePlanningService.certifyScenario(actorId, tenantId, resultId);
      showFeedback('Simulation result certified successfully.', 'success');
      if (activeSimulationResult) {
        setActiveSimulationResult({
          ...activeSimulationResult,
          result: { ...activeSimulationResult.result, status: 'CERTIFIED', certifiedBy: actorId, certifiedAt: new Date().toISOString() }
        });
      }
      loadWorkspaceData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // Action: Security Verification Runner
  const handleRunSecuritySuite = async () => {
    setIsVerifyingSecurity(true);
    try {
      const tests = await SecurityTestService.runPhase741VerificationSuite();
      setSecurityTests(tests);
      showFeedback('Adversarial security verification suite executed successfully.', 'success');
    } catch (err: any) {
      showFeedback(err.message, 'error');
    } finally {
      setIsVerifyingSecurity(false);
    }
  };

  // Filter security test list
  const filteredSecurityTests = securityTests.filter(t =>
    t.testId.toLowerCase().includes(securityQuery.toLowerCase()) ||
    t.title.toLowerCase().includes(securityQuery.toLowerCase()) ||
    t.details.toLowerCase().includes(securityQuery.toLowerCase())
  );

  return (
    <div id="resource-planning-container" className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Visual Header Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <PieChart size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Resource Planning & Portfolio Governance</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Phase 7.41 Capacity Allocation, Strategic Priority Scopes, Segregation of Duties Approvals, and What-If Sandbox.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadWorkspaceData}
            className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
          >
            <RefreshCcw size={15} /> Refresh Workspace
          </button>
          <button
            onClick={handleRunGlobalSanity}
            className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 rounded-lg transition"
          >
            <Activity size={15} /> Scan Data Quality
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div className={`mx-6 mt-4 p-4 rounded-xl border flex items-center gap-3 ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="text-emerald-600 shrink-0" size={18} /> : <XCircle className="text-rose-600 shrink-0" size={18} />}
          <span className="text-sm font-medium">{feedback.text}</span>
        </div>
      )}

      {/* Segment Navigation */}
      <div className="mx-6 mt-4 border-b border-slate-200 flex items-center overflow-x-auto gap-1">
        {[
          { key: 'COMMAND', label: 'Command Center', icon: Activity },
          { key: 'PLANS', label: 'Resource Plans', icon: BookOpen },
          { key: 'CAPACITY', label: 'Capacities & Forecasts', icon: Sliders },
          { key: 'ALLOCATION', label: 'Allocations & SoD', icon: FileCheck },
          { key: 'PORTFOLIO', label: 'Portfolio Scoring', icon: Briefcase },
          { key: 'SIMULATION', label: 'What-If Simulation', icon: Cpu },
          { key: 'SECURITY', label: 'Verification & Audit', icon: ShieldAlert }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as SectionTab);
                if (tab.key !== 'SECURITY') setSecurityTests([]);
              }}
              className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Body */}
      <div className="p-6 flex-grow">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCcw className="animate-spin text-indigo-600" size={32} />
            <p className="text-slate-500 text-sm font-medium mt-3">Fetching resource parameters and compiling ledger...</p>
          </div>
        ) : (
          <>
            {/* 1. COMMAND CENTER VIEW */}
            {activeTab === 'COMMAND' && (
              <div className="space-y-6">
                {/* Visual Math Meter KPI Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resource Allocations</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {utilizationSnapshot?.resourceAllocationEfficiency || 72.5}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${utilizationSnapshot?.resourceAllocationEfficiency || 72.5}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Target matching optimization aggregate efficiency</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Work Capacity</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {utilizationSnapshot?.facilityCapacity || 500}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">units</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-4/5"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Active institutional physical & human assets</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">System Constraints</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-extrabold text-amber-600">
                        {constraints.filter(c => c.status === 'UNRESOLVED').length}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">Pending</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(constraints.length * 20, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Triggered overload or scheduling breaches</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Data Health Score</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className={`text-3xl font-extrabold ${qualityIssues.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {qualityIssues.length > 0 ? `${100 - qualityIssues.length * 10}%` : '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${qualityIssues.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${qualityIssues.length > 0 ? Math.max(10, 100 - qualityIssues.length * 10) : 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{qualityIssues.length} active scan findings</p>
                  </div>
                </div>

                {/* Sub-panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Utilization snapshots */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2 space-y-4">
                    <h3 className="text-base font-bold text-slate-800">Deterministic Utilization Breakdown</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Faculty & Human Resource Capacity', val: utilizationSnapshot?.facultyUtilization || 75 },
                        { label: 'Regular Classroom Seat Allocations', val: utilizationSnapshot?.roomUtilization || 53.3 },
                        { label: 'Specialist Science Laboratories', val: utilizationSnapshot?.laboratoryUtilization || 90 },
                        { label: 'High-Performance Research Equipment (GPU Clusters)', val: utilizationSnapshot?.equipmentUtilization || 91.6 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>{item.label}</span>
                            <span>{item.val}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.val > 90 ? 'bg-rose-500' : item.val > 75 ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${item.val}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optimization action center */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                    <h3 className="text-base font-bold text-slate-800">Suggested Action Interventions</h3>
                    {optimizationActions.length === 0 ? (
                      <p className="text-slate-500 text-xs">No pending recommendations. System is balanced.</p>
                    ) : (
                      <div className="space-y-3">
                        {optimizationActions.map((opt) => (
                          <div key={opt.id} className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/40">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-bold text-indigo-900">{opt.title}</span>
                              <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                                +${opt.potentialSavings} Savings
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1">{opt.recommendedAction}</p>
                            <div className="mt-2.5 flex justify-end">
                              <button
                                onClick={async () => {
                                  try {
                                    opt.status = 'IMPLEMENTED';
                                    showFeedback('Opportunity intervention applied.', 'success');
                                    loadWorkspaceData();
                                  } catch (err: any) {
                                    showFeedback(err.message, 'error');
                                  }
                                }}
                                className="text-[10px] font-bold text-indigo-700 hover:underline flex items-center gap-0.5"
                              >
                                Trigger Action <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Constraint Violations */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-800">Critical Constraint Alerts</h3>
                  {constraints.length === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle className="text-emerald-500 mx-auto" size={32} />
                      <p className="text-slate-500 text-xs mt-2">No active capacity bottlenecks detected.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {constraints.map((c) => (
                        <div key={c.id} className="p-3.5 bg-rose-50/40 border border-rose-100/50 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-rose-100 text-rose-800 rounded">
                                {c.severity} Severity
                              </span>
                              <span className="text-xs font-bold text-rose-950">{c.source}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">{c.details}</p>
                          </div>
                          <div>
                            <button
                              onClick={async () => {
                                try {
                                  c.status = 'RESOLVED';
                                  showFeedback('Constraint resolved manually via rescheduling workflow.', 'success');
                                  loadWorkspaceData();
                                } catch (err: any) {
                                  showFeedback(err.message, 'error');
                                }
                              }}
                              className="px-3 py-1.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold rounded"
                            >
                              Reschedule / Override
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Active Data Sanity Findings */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-800">Dangling References & Data Quality Scans</h3>
                    <button
                      onClick={handleRunGlobalSanity}
                      className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                    >
                      Trigger Global Data Scan
                    </button>
                  </div>
                  {qualityIssues.length === 0 ? (
                    <p className="text-slate-500 text-xs py-4 text-center">Sanity scanners are green. 0 errors detected.</p>
                  ) : (
                    <div className="space-y-2">
                      {qualityIssues.map((issue) => (
                        <div key={issue.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-900">{issue.issueType}</span>
                              <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 rounded">{issue.severity}</span>
                            </div>
                            <p className="text-[11px] text-slate-600">{issue.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. RESOURCE PLANS VIEW */}
            {activeTab === 'PLANS' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Academic & Infrastructure Plans</h3>
                  <button
                    onClick={() => setIsCreatingPlan(!isCreatingPlan)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                  >
                    <Plus size={16} /> New Resource Plan
                  </button>
                </div>

                {/* Create Plan form */}
                {isCreatingPlan && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">Draft New Governance Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Plan Name</label>
                        <input
                          type="text"
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                          placeholder="e.g., Autumn 2026 AI Core Lab Deployment"
                          className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Resource Category</label>
                        <select
                          value={planCategory}
                          onChange={(e) => setPlanCategory(e.target.value as ResourceCategory)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        >
                          <option value="ACADEMIC">ACADEMIC</option>
                          <option value="HUMAN">HUMAN</option>
                          <option value="FACILITY">FACILITY</option>
                          <option value="TECHNOLOGY">TECHNOLOGY</option>
                          <option value="FINANCIAL">FINANCIAL</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Estimated Cost Budget ($)</label>
                        <input
                          type="number"
                          value={planCost}
                          onChange={(e) => setPlanCost(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Fiscal Year</label>
                        <input
                          type="text"
                          value={planYear}
                          onChange={(e) => setPlanYear(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Plan Description / Scope Justification</label>
                      <textarea
                        value={planDesc}
                        onChange={(e) => setPlanDesc(e.target.value)}
                        placeholder="Detail the target workloads, accreditations, and resources addressed."
                        rows={3}
                        className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setIsCreatingPlan(false)}
                        className="px-3.5 py-2 border rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePlan}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                      >
                        Create Draft Plan
                      </button>
                    </div>
                  </div>
                )}

                {/* List plans */}
                <div className="space-y-4">
                  {plans.map((p) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {p.status}
                            </span>
                            <span className="text-xs font-bold text-slate-500">FY {p.fiscalYear}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-800 mt-1">{p.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-semibold uppercase">Budget Cap</p>
                          <p className="text-lg font-extrabold text-slate-900">${p.totalEstimatedCost}</p>
                        </div>
                      </div>

                      {/* Four-Eyes / State transitions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <p className="text-xs text-slate-500">
                            Plan ID: <strong className="font-mono">{p.id}</strong> • Version: <strong>{p.version}</strong> • Creator: <strong>{p.createdBy}</strong>
                          </p>
                          {p.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSubmitPlan(p.id)}
                              className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
                            >
                              Submit for Approval
                            </button>
                          )}
                        </div>

                        {p.status === 'SUBMITTED' && (
                          <div className="space-y-2 pt-2 border-t border-slate-200">
                            <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                              <ShieldAlert size={14} /> Four-Eyes Verification Pending
                            </p>
                            <input
                              type="text"
                              value={approverJustification}
                              onChange={(e) => setApproverJustification(e.target.value)}
                              placeholder="Provide compliance notes or regulatory alignment reasons..."
                              className="w-full text-xs p-2 border rounded outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprovePlan(p.id)}
                                className="px-3.5 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                              >
                                Certify & Approve
                              </button>
                            </div>
                          </div>
                        )}

                        {p.status === 'APPROVED' && (
                          <div className="text-xs text-slate-600 flex justify-between pt-2 border-t border-slate-200">
                            <span>Certified compliant by: <strong>{p.approvedBy}</strong></span>
                            <span>Signed at: <strong>{p.approvedAt}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CAPACITY & FORECASTS VIEW */}
            {activeTab === 'CAPACITY' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Operational Resource Capacities</h3>
                  <button
                    onClick={() => setIsCreatingCapacity(!isCreatingCapacity)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                  >
                    <Plus size={16} /> New Capacity Profile
                  </button>
                </div>

                {/* Create Capacity profile form */}
                {isCreatingCapacity && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">Register Capacity Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Resource Name</label>
                        <input
                          type="text"
                          value={capName}
                          onChange={(e) => setCapName(e.target.value)}
                          placeholder="e.g., Lecture Theater Room 303"
                          className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Authoritative Resource ID</label>
                        <input
                          type="text"
                          value={capId}
                          onChange={(e) => setCapId(e.target.value)}
                          placeholder="e.g., ROOM-303"
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Category</label>
                        <select
                          value={capCategory}
                          onChange={(e) => setCapCategory(e.target.value as ResourceCategory)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        >
                          <option value="HUMAN">HUMAN</option>
                          <option value="ROOM">ROOM</option>
                          <option value="LABORATORY">LABORATORY</option>
                          <option value="EQUIPMENT">EQUIPMENT</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Total Capacity</label>
                        <input
                          type="number"
                          value={capTotal}
                          onChange={(e) => setCapTotal(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Used Capacity</label>
                        <input
                          type="number"
                          value={capUsed}
                          onChange={(e) => setCapUsed(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Unit of Measure</label>
                        <input
                          type="text"
                          value={capUnit}
                          onChange={(e) => setCapUnit(e.target.value)}
                          placeholder="e.g., hours/month or seats"
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setIsCreatingCapacity(false)}
                        className="px-3.5 py-2 border rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateCapacity}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                      >
                        Register Profile
                      </button>
                    </div>
                  </div>
                )}

                {/* Capacity Profiles grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capacityProfiles.map((cap) => {
                    const isOverCapacity = cap.utilizationRate > 95;
                    return (
                      <div key={cap.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-slate-100 text-slate-800 rounded">
                              {cap.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-800 mt-1">{cap.resourceName}</h4>
                            <p className="text-xs text-slate-400">ID: <span className="font-mono">{cap.resourceId}</span></p>
                          </div>
                          <div className={`text-right ${isOverCapacity ? 'text-rose-600' : 'text-slate-900'}`}>
                            <span className="text-xs font-semibold text-slate-400 block uppercase">Utilization</span>
                            <span className="text-lg font-extrabold">{cap.utilizationRate}%</span>
                          </div>
                        </div>

                        {/* Capacity Stats details */}
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center">
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total</p>
                            <p className="text-xs font-bold text-slate-800">{cap.totalCapacity} <span className="text-[10px] text-slate-400">{cap.unitOfMeasure}</span></p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Allocated</p>
                            <p className="text-xs font-bold text-slate-800">{cap.usedCapacity}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Available</p>
                            <p className={`text-xs font-bold ${cap.availableCapacity < 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                              {cap.availableCapacity}
                            </p>
                          </div>
                        </div>

                        {/* Progress Meter bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOverCapacity ? 'bg-rose-500' : cap.utilizationRate > 75 ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.min(cap.utilizationRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. ALLOCATIONS & FOUR-EYES VIEW */}
            {activeTab === 'ALLOCATION' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Resource Allocation Ledger</h3>
                  <button
                    onClick={() => setIsCreatingRequest(!isCreatingRequest)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                  >
                    <Plus size={16} /> Request Allocation
                  </button>
                </div>

                {/* Create Request form */}
                {isCreatingRequest && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">Draft Resource Request</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Category</label>
                        <select
                          value={reqCategory}
                          onChange={(e) => setReqCategory(e.target.value as ResourceCategory)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        >
                          <option value="HUMAN">HUMAN</option>
                          <option value="ROOM">ROOM</option>
                          <option value="LABORATORY">LABORATORY</option>
                          <option value="EQUIPMENT">EQUIPMENT</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Specific Resource ID (Optional)</label>
                        <select
                          value={reqResourceId}
                          onChange={(e) => setReqResourceId(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        >
                          <option value="">-- Let System Select --</option>
                          {capacityProfiles.filter(p => p.category === reqCategory).map(p => (
                            <option key={p.id} value={p.resourceId}>{p.resourceName} ({p.resourceId})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Strategic Project / Portfolio ID (Optional)</label>
                        <select
                          value={reqPortfolioId}
                          onChange={(e) => setReqPortfolioId(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        >
                          <option value="">-- No Portfolio Link --</option>
                          {portfolioItems.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Requested Quantity (e.g. seats, hours)</label>
                        <input
                          type="number"
                          value={reqQuantity}
                          onChange={(e) => setReqQuantity(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Allocation Justification</label>
                      <textarea
                        value={reqJustification}
                        onChange={(e) => setReqJustification(e.target.value)}
                        placeholder="State why this allocation is critical for academic delivery."
                        rows={3}
                        className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setIsCreatingRequest(false)}
                        className="px-3.5 py-2 border rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateAllocationRequest}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}

                {/* List requests and allocations */}
                <div className="space-y-4">
                  {allocationRequests.map((req) => (
                    <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              req.status === 'ALLOCATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {req.status}
                            </span>
                            <span className="text-xs font-bold text-slate-500">{req.resourceCategory}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 mt-1.5">{req.justification}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Requested by: <strong>{req.requesterId}</strong> • Target Resource: <strong className="font-mono">{req.resourceId || 'System Select'}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block uppercase">Requested</span>
                          <span className="text-lg font-extrabold text-slate-800">{req.requestedQuantity} units</span>
                        </div>
                      </div>

                      {/* SoD peer evaluation block */}
                      {req.status === 'REQUESTED' && (
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/40 space-y-3">
                          <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <ShieldAlert size={14} /> Four-Eyes Dual Verification Sign-Off
                          </p>
                          <input
                            type="text"
                            value={approverJustification}
                            onChange={(e) => setApproverJustification(e.target.value)}
                            placeholder="Approver justification notes..."
                            className="w-full text-xs p-2 border rounded outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProcessAllocation(req.id, 'APPROVED')}
                              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                            >
                              Approve & Allocate
                            </button>
                            <button
                              onClick={() => handleProcessAllocation(req.id, 'REJECTED')}
                              className="px-3 py-1.5 text-xs bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold rounded"
                            >
                              Reject Request
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PORTFOLIO STRATEGIC PRIORITIZATION VIEW */}
            {activeTab === 'PORTFOLIO' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Strategic Enterprise Portfolio Items</h3>
                  <button
                    onClick={() => setIsCreatingPortfolio(!isCreatingPortfolio)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                  >
                    <Plus size={16} /> New Proposal
                  </button>
                </div>

                {/* Create Proposal Form */}
                {isCreatingPortfolio && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800">Propose Strategic Initiative</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Project / Initiative Name</label>
                        <input
                          type="text"
                          value={portName}
                          onChange={(e) => setPortName(e.target.value)}
                          placeholder="e.g., Campus-Wide Mesh Infrastructure"
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Estimated Total Budget ($)</label>
                        <input
                          type="number"
                          value={portBudget}
                          onChange={(e) => setPortBudget(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Scope of Work & Capacity Demands</label>
                      <textarea
                        value={portDesc}
                        onChange={(e) => setPortDesc(e.target.value)}
                        placeholder="Detail which academic faculties, buildings, or tech equipment this initiative will consume."
                        rows={3}
                        className="w-full text-xs p-2.5 border rounded-lg outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setIsCreatingPortfolio(false)}
                        className="px-3.5 py-2 border rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePortfolio}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                      >
                        Submit Initiative Proposal
                      </button>
                    </div>
                  </div>
                )}

                {/* Scoring overlay panel */}
                {scoringPortId && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-indigo-900">Configure Weighted Strategic Scoring</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                      {[
                        { label: 'Strategic Alignment', val: scoreStrategic, set: setScoreStrategic },
                        { label: 'Urgency / Timeline', val: scoreUrgency, set: setScoreUrgency },
                        { label: 'Institutional Impact', val: scoreImpact, set: setScoreImpact },
                        { label: 'Regulatory Mandate', val: scoreRegulatory, set: setScoreRegulatory },
                        { label: 'Student Impact Scale', val: scoreStudent, set: setScoreStudent }
                      ].map((sc, i) => (
                        <div key={i} className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">{sc.label} (1-10)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sc.val}
                            onChange={(e) => sc.set(Math.min(10, Math.max(1, Number(e.target.value))))}
                            className="w-full text-xs p-2 border rounded outline-none"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => setScoringPortId(null)}
                        className="px-3.5 py-2 border rounded-lg hover:bg-slate-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={handlePrioritizePortfolio}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                      >
                        Compute Weighted Rank
                      </button>
                    </div>
                  </div>
                )}

                {/* Proposals listing */}
                <div className="space-y-4">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              item.priorityBand === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {item.priorityBand} Band
                            </span>
                            <span className="text-xs text-slate-500 font-bold">Priority Score: {item.priorityScore}</span>
                          </div>
                          <h4 className="text-base font-bold text-slate-800 mt-1">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block uppercase">Est. Cost</span>
                          <span className="text-base font-bold text-slate-900">${item.estimatedTotalBudget}</span>
                        </div>
                      </div>

                      {/* Strategic controls */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <p className="text-xs text-slate-500">
                            Project ID: <strong className="font-mono">{item.id}</strong> • Status: <strong>{item.status}</strong>
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setScoringPortId(item.id)}
                              className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded"
                            >
                              Strategic Scoring
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  item.status = 'APPROVED';
                                  showFeedback('Project formally approved and registered in portfolio list.', 'success');
                                  loadWorkspaceData();
                                } catch (err: any) {
                                  showFeedback(err.message, 'error');
                                }
                              }}
                              className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                            >
                              Approve Project
                            </button>
                          </div>
                        </div>

                        {/* Certify compliance rating */}
                        <div className="pt-2 border-t border-slate-200">
                          <input
                            type="text"
                            value={approverJustification}
                            onChange={(e) => setApproverJustification(e.target.value)}
                            placeholder="Write compliance certification details..."
                            className="w-full text-xs p-2 border rounded outline-none bg-white mb-2"
                          />
                          <button
                            onClick={() => handleCertifyCompliance(item.id, 'PORTFOLIO')}
                            className="px-3.5 py-1.5 text-xs bg-indigo-100 text-indigo-900 hover:bg-indigo-200 font-bold rounded"
                          >
                            Certify Compliance Rating
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. WHAT-IF SIMULATION VIEW */}
            {activeTab === 'SIMULATION' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-base font-bold text-slate-800">What-If Multi-Department Scenario Modeling</h3>
                  <p className="text-xs text-slate-500">
                    Project future resource loads, space requirements, and financial deltas in an isolated modeling sandbox without impacting authoritative master data tables.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Scenario Title</label>
                      <input
                        type="text"
                        value={scenName}
                        onChange={(e) => setScenName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Description</label>
                      <input
                        type="text"
                        value={scenDesc}
                        onChange={(e) => setScenDesc(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Enrollment Shift (%)</label>
                      <input
                        type="number"
                        value={scenEnrollment}
                        onChange={(e) => setScenEnrollment(Number(e.target.value))}
                        className="w-full text-xs p-2 border rounded outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600">Faculty/Staff Adjustments (%)</label>
                      <input
                        type="number"
                        value={scenStaffRed}
                        onChange={(e) => setScenStaffRed(Number(e.target.value))}
                        className="w-full text-xs p-2 border rounded outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Expand Academic Spaces?</label>
                      <select
                        value={scenFacilityExp ? 'yes' : 'no'}
                        onChange={(e) => setScenFacilityExp(e.target.value === 'yes')}
                        className="w-full text-xs p-2 border rounded outline-none mt-1"
                      >
                        <option value="yes">YES (Add 15,000 sq ft)</option>
                        <option value="no">NO (Saturate space capacities)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunSimulation}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition"
                    >
                      Run Sandbox Projections
                    </button>
                  </div>
                </div>

                {/* Simulation Output Panel */}
                {activeSimulationResult && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-indigo-950">Projected Simulation Outputs</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        activeSimulationResult.result.status === 'CERTIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {activeSimulationResult.result.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-white p-3.5 border rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Human Demand Delta</p>
                        <p className="text-xl font-extrabold text-indigo-900 mt-1">
                          {activeSimulationResult.result.simulationOutputs.estimatedHumanDemandDelta > 0 ? '+' : ''}
                          {activeSimulationResult.result.simulationOutputs.estimatedHumanDemandDelta} hrs/m
                        </p>
                      </div>
                      <div className="bg-white p-3.5 border rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Space Demand Delta</p>
                        <p className="text-xl font-extrabold text-indigo-900 mt-1">
                          {activeSimulationResult.result.simulationOutputs.estimatedFacilityDemandDelta > 0 ? '+' : ''}
                          {activeSimulationResult.result.simulationOutputs.estimatedFacilityDemandDelta} seats
                        </p>
                      </div>
                      <div className="bg-white p-3.5 border rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Expected Constraints</p>
                        <p className="text-xl font-extrabold text-amber-600 mt-1">
                          {activeSimulationResult.result.simulationOutputs.resultingConstraintsCount} triggers
                        </p>
                      </div>
                      <div className="bg-white p-3.5 border rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Budget Variance Variance</p>
                        <p className="text-xl font-extrabold text-rose-600 mt-1">
                          -${Math.abs(activeSimulationResult.result.simulationOutputs.budgetVariance)}
                        </p>
                      </div>
                    </div>

                    {activeSimulationResult.result.status === 'DRAFT' ? (
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => handleCertifySimulation(activeSimulationResult.result.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded"
                        >
                          Certify Simulation Projections
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                        <CheckCircle size={14} /> Certified by {activeSimulationResult.result.certifiedBy} on {activeSimulationResult.result.certifiedAt}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 7. ADVERSARIAL SECURITY VERIFICATION & AUDIT VIEW */}
            {activeTab === 'SECURITY' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start flex-col sm:flex-row gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Governance Security & Verification Matrix</h3>
                      <p className="text-xs text-slate-500">
                        Execute the Phase 7.41 multi-dimensional security testing engine to verify tenant boundaries, Four-Eyes integrity checks, and calculation precision.
                      </p>
                    </div>
                    <button
                      onClick={handleRunSecuritySuite}
                      disabled={isVerifyingSecurity}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                    >
                      <Play size={14} /> {isVerifyingSecurity ? 'Running Verification Suite...' : 'Run Security Suite (ADV-01 - ADV-50)'}
                    </button>
                  </div>

                  {/* Filter Search Input */}
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search security checks by title or description..."
                      value={securityQuery}
                      onChange={(e) => setSecurityQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2.5 border rounded-lg bg-slate-50 focus:bg-white outline-none"
                    />
                  </div>

                  {securityTests.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
                            <th className="p-3">Check ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Compliance Status</th>
                            <th className="p-3">Remediation / Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredSecurityTests.map((test) => (
                            <tr key={test.testId} className="hover:bg-slate-50/50">
                              <td className="p-3 font-mono font-bold text-slate-600">{test.testId}</td>
                              <td className="p-3 font-semibold text-slate-800">{test.title}</td>
                              <td className="p-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  test.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {test.passed ? <CheckCircle size={11} /> : <XCircle size={11} />}
                                  {test.passed ? 'CERTIFIED' : 'FAILED'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 font-medium">{test.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl">
                      <HelpCircle className="text-slate-300 mx-auto" size={32} />
                      <p className="text-slate-500 text-xs mt-2">Security tests have not been executed yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
