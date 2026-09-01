import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { EnterpriseArchitectureService } from '../../services/enterpriseArchitectureService';
import { 
  ADRStatus, 
  PortfolioItemStatus, 
  RationalizationCategory, 
  TechnicalDebtStatus, 
  ReviewStatus, 
  ClassificationLevel, 
  ArchitectureDomainType,
  EnterpriseArchitectureRepository,
  ArchitecturePrinciple,
  ArchitectureStandard,
  ArchitectureDecisionRecord,
  ArchitectureReview,
  ArchitectureException,
  ApplicationPortfolioItem,
  TechnologyLifecycleAssessment,
  DigitalService,
  TechnologyDependency,
  TechnologyRiskItem,
  TechnicalDebtItem,
  TechnologyInvestmentRequest,
  TechnologyDataQualityIssue
} from '../../types';
import { 
  Network, Cpu, Layers, Shield, Activity, FileText, CheckSquare, 
  AlertTriangle, TrendingUp, BarChart3, GitBranch, Search, Share2, 
  Briefcase, Clock, Plus, Wrench, ShieldCheck, UserCheck, Check, 
  X, RefreshCw, Info, AlertCircle, Sparkles, Sliders, ChevronRight
} from 'lucide-react';

export function EnterpriseArchitectureWorkspace() {
  const { currentTenant } = useTenant();
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const tenantId = currentTenant?.id || 'tenant_main';
  const campusId = 'MAIN_CAMPUS';

  // Sub-section Navigation (Combines 20 tab capabilities elegantly into 10 sub-sections)
  const [activeSection, setActiveSection] = useState<'ear_standards' | 'adrs' | 'reviews_exceptions' | 'app_portfolio' | 'lifecycle' | 'services' | 'topology' | 'risk_debt' | 'investments' | 'sandbox_dq'>('ear_standards');

  // Unified State Stores
  const [repositories, setRepositories] = useState<EnterpriseArchitectureRepository[]>([]);
  const [principles, setPrinciples] = useState<ArchitecturePrinciple[]>([]);
  const [standards, setStandards] = useState<ArchitectureStandard[]>([]);
  const [adrs, setAdrs] = useState<ArchitectureDecisionRecord[]>([]);
  const [reviews, setReviews] = useState<ArchitectureReview[]>([]);
  const [exceptions, setExceptions] = useState<ArchitectureException[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<ApplicationPortfolioItem[]>([]);
  const [lifecycles, setLifecycles] = useState<TechnologyLifecycleAssessment[]>([]);
  const [services, setServices] = useState<DigitalService[]>([]);
  const [dependencies, setDependencies] = useState<TechnologyDependency[]>([]);
  const [risks, setRisks] = useState<TechnologyRiskItem[]>([]);
  const [debts, setDebts] = useState<TechnicalDebtItem[]>([]);
  const [investments, setInvestments] = useState<TechnologyInvestmentRequest[]>([]);
  const [qualityIssues, setQualityIssues] = useState<TechnologyDataQualityIssue[]>([]);
  
  // What-If & Scanner states
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [sandboxAssumptions, setSandboxAssumptions] = useState({
    retireUnsupportedTech: false,
    remediateHighDebt: false,
    resolveCriticalRisks: false
  });
  
  const [depAnalysis, setDepAnalysis] = useState<{
    hasCircular: boolean;
    cycles: string[][];
    blastRadii: Record<string, number>;
  }>({ hasCircular: false, cycles: [], blastRadii: {} });

  // Control/Form modals
  const [loading, setLoading] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);

  // Load All Workspace Data
  const loadWorkspaceData = async () => {
    setLoading(true);
    try {
      const [
        reposData, principlesData, standardsData, adrsData,
        reviewsData, exceptionsData, appsData, lifecyclesData,
        servicesData, depsData, risksData, debtsData, investmentsData
      ] = await Promise.all([
        EnterpriseArchitectureService.getArchitectureRepositories(tenantId),
        EnterpriseArchitectureService.getArchitecturePrinciples(tenantId),
        EnterpriseArchitectureService.getArchitectureStandards(tenantId),
        EnterpriseArchitectureService.getADRs(tenantId),
        EnterpriseArchitectureService.getArchitectureReviews(tenantId),
        EnterpriseArchitectureService.getArchitectureExceptions(tenantId),
        EnterpriseArchitectureService.getApplicationPortfolioItems(tenantId),
        EnterpriseArchitectureService.getTechnologyLifecycleAssessments(tenantId),
        EnterpriseArchitectureService.getDigitalServices(tenantId),
        EnterpriseArchitectureService.getTechnologyDependencies(tenantId),
        EnterpriseArchitectureService.getTechnologyRisks(tenantId),
        EnterpriseArchitectureService.getTechnicalDebtItems(tenantId),
        EnterpriseArchitectureService.getTechnologyInvestments(tenantId)
      ]);

      setRepositories(reposData);
      setPrinciples(principlesData);
      setStandards(standardsData);
      setAdrs(adrsData);
      setReviews(reviewsData);
      setExceptions(exceptionsData);
      setPortfolioItems(appsData);
      setLifecycles(lifecyclesData);
      setServices(servicesData);
      setDependencies(depsData);
      setRisks(risksData);
      setDebts(debtsData);
      setInvestments(investmentsData);

      // Perform graph analysis if dependencies present
      if (depsData.length > 0) {
        const graphAnalysis = await EnterpriseArchitectureService.analyzeDependencyGraph(tenantId);
        setDepAnalysis(graphAnalysis);
      }
    } catch (err: any) {
      console.error(err);
      addNotification({
        type: 'error',
        title: 'Error Loading Workspace',
        message: err.message || 'An unexpected error occurred while fetching governance records'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, [tenantId]);

  // Run Real-Time Quality Scanner
  const runQualityScan = async () => {
    setScanning(true);
    try {
      const issues = await EnterpriseArchitectureService.scanTechnologyDataQuality(tenantId);
      setQualityIssues(issues);
      addNotification({
        type: 'success',
        title: 'Architecture Audit Complete',
        message: `Identified ${issues.length} active data quality and dependency compliance issues.`
      });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Scan Failed',
        message: err.message
      });
    } finally {
      setScanning(false);
    }
  };

  // Run What-If Scenario Calculation
  const calculateSandbox = async () => {
    try {
      const res = await EnterpriseArchitectureService.runTechnologyScenario(tenantId, sandboxAssumptions);
      setSandboxResult(res);
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Simulation Error',
        message: err.message
      });
    }
  };

  // State values for creation forms
  const [newRepo, setNewRepo] = useState({ name: '', description: '', domain: ArchitectureDomainType.BUSINESS, classification: ClassificationLevel.INTERNAL, authoritativeSource: '' });
  const [newPrinciple, setNewPrinciple] = useState({ statement: '', rationale: '', implications: '', domain: ArchitectureDomainType.BUSINESS });
  const [newStandard, setNewStandard] = useState({ name: '', description: '', category: 'Database', domain: ArchitectureDomainType.DATA, approvedVersions: '', deprecatedVersions: '' });
  const [newAdr, setNewAdr] = useState({ title: '', decisionRationale: '', alternativesConsidered: '', consequences: '', affectedSystems: '', affectedCampuses: '', implementationRequirements: '', linkedEvidence: '', linkedPolicies: '', linkedTechnologyStandards: '' });
  const [newException, setNewException] = useState({ title: '', justification: '', affectedPrincipleId: '', riskAssessment: '', mitigation: '', expiryDate: '', compensatingControls: '' });
  
  // Interactive TIME Calculator inputs
  const [newApp, setNewApp] = useState({
    name: '', description: '', businessOwner: '', technicalOwner: '', technologyCategory: '', status: PortfolioItemStatus.PROPOSED,
    businessCriticality: 3, technicalHealth: 3, strategicAlignment: 3, operatingCostReference: 3, securityRisk: 3, integrationComplexity: 3, userAdoption: 3, technicalDebtScore: 3, lifecyclePosition: 3
  });

  const [newRisk, setNewRisk] = useState({ title: '', description: '', probability: 3, impact: 3, controlEffectiveness: 3 });
  const [newDebt, setNewDebt] = useState({ title: '', description: '', affectedTechnology: '', affectedApplicationId: '', businessImpact: '', technicalImpact: '', riskImpact: '', estimatedRemediationEffort: 30, priority: 'MEDIUM', targetRemediationDate: '', ownerId: '' });
  const [newDep, setNewDep] = useState({ sourceId: '', sourceType: 'application', targetId: '', targetType: 'technology', dependencyType: 'depends_on' });
  const [newService, setNewService] = useState({ name: '', description: '', serviceOwner: '', technicalOwner: '', serviceCriticality: 3, availabilityTarget: 99.9, supportedCampuses: 'MAIN_CAMPUS', dependencyMap: '', complianceClassification: ClassificationLevel.INTERNAL, reviewSchedule: 'ANNUAL' });
  const [newInvestment, setNewInvestment] = useState({ title: '', description: '', estimatedCost: 50000, proposerId: '', benefitAssessment: '', portfolioId: '', programId: '', initiativeId: '', stageGateId: 'GATE_1' });

  // HANDLERS FOR CREATION
  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createArchitectureRepository({
        ...newRepo,
        tenantId,
        campusId,
        ownerId: currentUser?.uid || 'usr_admin',
        status: 'ACTIVE',
        effectiveDate: new Date().toISOString(),
        reviewDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Repository Registered', message: 'Enterprise Architecture repository added.' });
      setNewRepo({ name: '', description: '', domain: ArchitectureDomainType.BUSINESS, classification: ClassificationLevel.INTERNAL, authoritativeSource: '' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreatePrinciple = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createArchitecturePrinciple({
        ...newPrinciple,
        tenantId,
        campusId,
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Principle Saved', message: 'Architecture Principle established.' });
      setNewPrinciple({ statement: '', rationale: '', implications: '', domain: ArchitectureDomainType.BUSINESS });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreateStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createArchitectureStandard({
        ...newStandard,
        tenantId,
        campusId,
        approvedVersions: newStandard.approvedVersions.split(',').map(v => v.trim()),
        deprecatedVersions: newStandard.deprecatedVersions.split(',').map(v => v.trim()),
        status: 'APPROVED',
        reviewDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Standard Created', message: 'Technical Standard defined.' });
      setNewStandard({ name: '', description: '', category: 'Database', domain: ArchitectureDomainType.DATA, approvedVersions: '', deprecatedVersions: '' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreateAdr = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createADR({
        ...newAdr,
        tenantId,
        campusId,
        creatorId: currentUser?.uid || 'usr_admin',
        version: 1,
        alternativesConsidered: newAdr.alternativesConsidered.split(',').map(v => v.trim()),
        affectedSystems: newAdr.affectedSystems.split(',').map(v => v.trim()),
        affectedCampuses: newAdr.affectedCampuses.split(',').map(v => v.trim()),
        linkedEvidence: newAdr.linkedEvidence ? [newAdr.linkedEvidence] : [],
        linkedPolicies: newAdr.linkedPolicies ? [newAdr.linkedPolicies] : [],
        linkedTechnologyStandards: newAdr.linkedTechnologyStandards ? [newAdr.linkedTechnologyStandards] : [],
        reviewDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'ADR Drafted', message: 'Architecture Decision Record drafted.' });
      setNewAdr({ title: '', decisionRationale: '', alternativesConsidered: '', consequences: '', affectedSystems: '', affectedCampuses: '', implementationRequirements: '', linkedEvidence: '', linkedPolicies: '', linkedTechnologyStandards: '' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleApproveAdr = async (adrId: string) => {
    try {
      const performedBy = {
        userId: currentUser?.uid || 'usr_approver',
        email: currentUser?.email || 'approver@ems.edu.in',
        name: currentUser?.displayName || 'System Approver'
      };
      await EnterpriseArchitectureService.approveADR(adrId, currentUser?.uid || 'usr_approver', performedBy);
      addNotification({ type: 'success', title: 'ADR Approved', message: '4-Eyes Security validation complete.' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Security Control Block', message: err.message });
    }
  };

  const handleCreateException = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.requestArchitectureException({
        ...newException,
        tenantId,
        campusId,
        requesterId: currentUser?.uid || 'usr_admin',
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Exception Requested', message: 'Exception listed for ARB evaluation.' });
      setNewException({ title: '', justification: '', affectedPrincipleId: '', riskAssessment: '', mitigation: '', expiryDate: '', compensatingControls: '' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleApproveException = async (id: string) => {
    try {
      await EnterpriseArchitectureService.approveArchitectureException(id, currentUser?.uid || 'usr_arb', 'APPROVED', 'Compensating controls verified by ARB.');
      addNotification({ type: 'success', title: 'Exception Granted', message: 'Architecture Exception approved.' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreateAppItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createApplicationPortfolioItem({
        ...newApp,
        tenantId,
        campusId,
        campuses: [campusId],
        dependencies: [],
        riskProfile: 'MEDIUM',
        technicalDebt: 'LOW',
        modernizationStatus: 'ACTIVE',
        complianceClassification: ClassificationLevel.INTERNAL,
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Application Registered', message: 'TIME Rationalization calculated automatically.' });
      setNewApp({
        name: '', description: '', businessOwner: '', technicalOwner: '', technologyCategory: '', status: PortfolioItemStatus.PROPOSED,
        businessCriticality: 3, technicalHealth: 3, strategicAlignment: 3, operatingCostReference: 3, securityRisk: 3, integrationComplexity: 3, userAdoption: 3, technicalDebtScore: 3, lifecyclePosition: 3
      });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createTechnologyRisk({
        ...newRisk,
        tenantId,
        campusId,
        creatorId: currentUser?.uid || 'usr_admin',
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Risk Logged', message: 'Technology risk added to 5x5 matrix.' });
      setNewRisk({ title: '', description: '', probability: 3, impact: 3, controlEffectiveness: 3 });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleApproveRisk = async (riskId: string) => {
    try {
      const performedBy = {
        userId: currentUser?.uid || 'usr_approver',
        email: currentUser?.email || 'approver@ems.edu.in',
        name: currentUser?.displayName || 'System Approver'
      };
      await EnterpriseArchitectureService.approveTechnologyRisk(riskId, currentUser?.uid || 'usr_approver', performedBy);
      addNotification({ type: 'success', title: 'Risk Verified', message: 'Technology risk certified under 4-Eyes control.' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Security Control Block', message: err.message });
    }
  };

  const handleCreateDebt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createTechnicalDebt({
        ...newDebt,
        tenantId,
        campusId,
        creatorId: currentUser?.uid || 'usr_admin',
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Technical Debt Logged', message: 'Debt item registered.' });
      setNewDebt({ title: '', description: '', affectedTechnology: '', affectedApplicationId: '', businessImpact: '', technicalImpact: '', riskImpact: '', estimatedRemediationEffort: 30, priority: 'MEDIUM', targetRemediationDate: '', ownerId: '' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleVerifyDebtClosure = async (debtId: string) => {
    try {
      const performedBy = {
        userId: currentUser?.uid || 'usr_verifier',
        email: currentUser?.email || 'verifier@ems.edu.in',
        name: currentUser?.displayName || 'System Verifier'
      };
      await EnterpriseArchitectureService.verifyTechnicalDebtClosure(debtId, currentUser?.uid || 'usr_verifier', performedBy);
      addNotification({ type: 'success', title: 'Debt Closed', message: 'Technical debt verified as remediated.' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Security Control Block', message: err.message });
    }
  };

  const handleCreateDependency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createTechnologyDependency({
        ...newDep,
        tenantId,
        campusId
      });
      addNotification({ type: 'success', title: 'Dependency Mapped', message: 'Node linkage established in architecture graph.' });
      setNewDep({ sourceId: '', sourceType: 'application', targetId: '', targetType: 'technology', dependencyType: 'depends_on' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await EnterpriseArchitectureService.createDigitalService({
        ...newService,
        tenantId,
        campusId,
        supportedCampuses: [newService.supportedCampuses],
        dependencyMap: newService.dependencyMap.split(',').map(v => v.trim()),
        lifecycleStatus: 'ACTIVE',
        createdBy: currentUser?.uid || 'usr_admin'
      });
      addNotification({ type: 'success', title: 'Service Registered', message: 'Digital service added to catalog.' });
      setNewService({ name: '', description: '', serviceOwner: '', technicalOwner: '', serviceCriticality: 3, availabilityTarget: 99.9, supportedCampuses: 'MAIN_CAMPUS', dependencyMap: '', complianceClassification: ClassificationLevel.INTERNAL, reviewSchedule: 'ANNUAL' });
      loadWorkspaceData();
    } catch (err: any) {
      addNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  return (
    <div className="bg-[#F4F6FB] min-h-screen p-1" id="ea_workspace">
      {/* Module Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Network className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">EMS Phase 7.43</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Enterprise Architecture & Digital Governance</h1>
          <p className="text-slate-500 text-sm mt-0.5">Governed architecture definitions, application portfolio rationalization, digital services, technology risks, and debt lifecycle orchestration.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadWorkspaceData}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg font-medium transition-colors cursor-pointer"
            title="Reload Governance Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
          <button 
            onClick={runQualityScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {scanning ? 'Auditing Stack...' : 'Audit Tech Quality'}
          </button>
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Rationalized Apps</div>
          <div className="text-2xl font-bold text-slate-800">{portfolioItems.length}</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <Check className="w-3 h-3" /> 100% Deterministic
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Active ADRs</div>
          <div className="text-2xl font-bold text-slate-800">{adrs.filter(a => a.status === ADRStatus.APPROVED || a.status === ADRStatus.EFFECTIVE).length}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Draft/Submitted: {adrs.filter(a => a.status === ADRStatus.DRAFT || a.status === ADRStatus.SUBMITTED).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Technology Risks</div>
          <div className="text-2xl font-bold text-red-600">{risks.length}</div>
          <div className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3 h-3" /> Critical/High: {risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Technical Debt</div>
          <div className="text-2xl font-bold text-amber-600">{debts.filter(d => d.status !== TechnicalDebtStatus.RESOLVED && d.status !== TechnicalDebtStatus.VERIFIED).length} items</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Verified Closed: {debts.filter(d => d.status === TechnicalDebtStatus.VERIFIED).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Digital Services</div>
          <div className="text-2xl font-bold text-sky-600">{services.length}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">
            SLAs Cataloged
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Quality Violations</div>
          <div className="text-2xl font-bold text-red-600">{qualityIssues.length}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            Audit Alerts Active
          </div>
        </div>
      </div>

      {/* Main Workspace Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Dynamic Left Sub-Navigation Menu */}
        <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 h-fit">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">Governance Areas</div>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveSection('ear_standards')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'ear_standards' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Layers className="w-4 h-4" />
              1. Principles & Standards
            </button>
            <button 
              onClick={() => setActiveSection('adrs')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'adrs' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText className="w-4 h-4" />
              2. Decision Records (ADRs)
            </button>
            <button 
              onClick={() => setActiveSection('reviews_exceptions')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'reviews_exceptions' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Shield className="w-4 h-4" />
              3. Exception Governance
            </button>
            <button 
              onClick={() => setActiveSection('app_portfolio')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'app_portfolio' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BarChart3 className="w-4 h-4" />
              4. App Portfolio (TIME)
            </button>
            <button 
              onClick={() => setActiveSection('lifecycle')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'lifecycle' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Clock className="w-4 h-4" />
              5. Tech Lifecycle & EOL
            </button>
            <button 
              onClick={() => setActiveSection('services')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'services' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Activity className="w-4 h-4" />
              6. Digital Service Catalog
            </button>
            <button 
              onClick={() => setActiveSection('topology')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'topology' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <GitBranch className="w-4 h-4" />
              7. Dependency Topology
            </button>
            <button 
              onClick={() => setActiveSection('risk_debt')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'risk_debt' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <AlertTriangle className="w-4 h-4" />
              8. Risk & Technical Debt
            </button>
            <button 
              onClick={() => setActiveSection('investments')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'investments' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Briefcase className="w-4 h-4" />
              9. Investments Sandbox
            </button>
            <button 
              onClick={() => setActiveSection('sandbox_dq')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${activeSection === 'sandbox_dq' ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Sliders className="w-4 h-4" />
              10. Data Quality & What-If
            </button>
          </nav>
        </div>

        {/* Dynamic Display Canvas */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 overflow-hidden">
          {/* SECTION 1: PRINCIPLES & TECHNICAL STANDARDS */}
          {activeSection === 'ear_standards' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">1. Architecture Principles & Technology Standards</h2>
                <p className="text-slate-500 text-sm mt-0.5">Authoritative registry defining architectural principles, standards, and domain structures for institutional systems.</p>
              </div>

              {/* Grid: Create Principle Form & Current Principle list */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  {/* Principles Registry */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-600" />
                      Active Architecture Principles
                    </h3>
                    {principles.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">No principles established yet. Define one below.</div>
                    ) : (
                      <div className="space-y-3">
                        {principles.map((pr) => (
                          <div key={pr.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">{pr.domain}</span>
                              <span className="text-slate-400 text-xs">ID: {pr.id}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 mt-2 text-sm">{pr.statement}</h4>
                            <p className="text-xs text-slate-500 mt-1"><strong className="text-slate-600">Rationale:</strong> {pr.rationale}</p>
                            <p className="text-xs text-slate-500 mt-1"><strong className="text-slate-600">Implications:</strong> {pr.implications}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Standards List */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                      Approved Technology Standards
                    </h3>
                    {standards.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">No technical standards defined yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="pb-2">Standard Name</th>
                              <th className="pb-2">Domain</th>
                              <th className="pb-2">Category</th>
                              <th className="pb-2">Approved Versions</th>
                              <th className="pb-2">Deprecated Versions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {standards.map((st) => (
                              <tr key={st.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50">
                                <td className="py-2.5 font-bold text-slate-800">{st.name}</td>
                                <td className="py-2.5 text-slate-600">{st.domain}</td>
                                <td className="py-2.5 text-slate-600">{st.category}</td>
                                <td className="py-2.5">
                                  {st.approvedVersions.map(v => (
                                    <span key={v} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-semibold mr-1">{v}</span>
                                  ))}
                                </td>
                                <td className="py-2.5">
                                  {st.deprecatedVersions.map(v => (
                                    <span key={v} className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-[10px] font-semibold mr-1">{v}</span>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Creation form */}
                <div className="space-y-6">
                  <form onSubmit={handleCreatePrinciple} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-1">Define Principle</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Statement</label>
                      <input 
                        type="text" 
                        required
                        value={newPrinciple.statement} 
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, statement: e.target.value })}
                        placeholder="e.g. Data is an Asset"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Rationale</label>
                      <textarea 
                        required
                        value={newPrinciple.rationale} 
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, rationale: e.target.value })}
                        placeholder="Why is this principle necessary?"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Implications</label>
                      <textarea 
                        required
                        value={newPrinciple.implications} 
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, implications: e.target.value })}
                        placeholder="How does this impact institutional workflow?"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Architecture Domain</label>
                      <select 
                        value={newPrinciple.domain}
                        onChange={(e) => setNewPrinciple({ ...newPrinciple, domain: e.target.value as ArchitectureDomainType })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 bg-white focus:border-sky-500"
                      >
                        {Object.values(ArchitectureDomainType).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold cursor-pointer">
                      Save Principle
                    </button>
                  </form>

                  <form onSubmit={handleCreateStandard} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-1">Define Technical Standard</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Standard Name</label>
                      <input 
                        type="text" 
                        required
                        value={newStandard.name} 
                        onChange={(e) => setNewStandard({ ...newStandard, name: e.target.value })}
                        placeholder="e.g. PostgreSQL RDBMS"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Description</label>
                      <input 
                        type="text" 
                        value={newStandard.description} 
                        onChange={(e) => setNewStandard({ ...newStandard, description: e.target.value })}
                        placeholder="Standard database system specifications"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Approved Versions</label>
                      <input 
                        type="text" 
                        required
                        value={newStandard.approvedVersions} 
                        onChange={(e) => setNewStandard({ ...newStandard, approvedVersions: e.target.value })}
                        placeholder="e.g. 14, 15, 16"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Deprecated Versions</label>
                      <input 
                        type="text" 
                        required
                        value={newStandard.deprecatedVersions} 
                        onChange={(e) => setNewStandard({ ...newStandard, deprecatedVersions: e.target.value })}
                        placeholder="e.g. 9.6, 10, 11"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold cursor-pointer">
                      Publish Standard
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ARCHITECTURE DECISION RECORDS (ADR) */}
          {activeSection === 'adrs' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">2. Architecture Decision Records (ADRs) & 4-Eyes Governance</h2>
                <p className="text-slate-500 text-sm mt-0.5">Formal Architecture Decision Records maintaining version histories and strict creator-approver segregation of duties (SoD).</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ADR Registry List */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Architecture Decision Log
                  </h3>
                  {adrs.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                      No ADRs drafted or active in this tenant.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {adrs.map((adr) => (
                        <div key={adr.id} className="p-5 border border-slate-200 rounded-xl space-y-3 shadow-sm bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase mr-2">V{adr.version}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                adr.status === ADRStatus.APPROVED || adr.status === ADRStatus.EFFECTIVE 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : adr.status === ADRStatus.SUBMITTED ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-600'
                              }`}>{adr.status}</span>
                            </div>
                            <span className="text-slate-400 text-xs font-mono">{adr.id}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-800 text-base">{adr.title}</h4>
                          <p className="text-xs text-slate-600"><strong className="text-slate-800">Decision Rationale:</strong> {adr.decisionRationale}</p>
                          <p className="text-xs text-slate-600"><strong className="text-slate-800">Consequences:</strong> {adr.consequences}</p>
                          <p className="text-xs text-slate-500"><strong className="text-slate-800">Systems Affected:</strong> {adr.affectedSystems.join(', ')}</p>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                            <span className="text-slate-500">Drafted by: <strong className="text-slate-700">{adr.creatorId}</strong></span>
                            {adr.approverId ? (
                              <span className="text-emerald-600 font-medium">Approved by: <strong className="text-emerald-700">{adr.approverId}</strong></span>
                            ) : (
                              <div className="flex items-center gap-2">
                                {adr.status === ADRStatus.SUBMITTED ? (
                                  <button 
                                    onClick={() => handleApproveAdr(adr.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer transition-colors"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Verify & Approve
                                  </button>
                                ) : (
                                  <button 
                                    onClick={async () => {
                                      await EnterpriseArchitectureService.submitADR(adr.id, currentUser?.uid || 'usr_admin');
                                      addNotification({ type: 'success', title: 'ADR Submitted', message: 'ADR status updated to Submitted.' });
                                      loadWorkspaceData();
                                    }}
                                    className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors"
                                  >
                                    Submit for Review
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Draft ADR Form */}
                <div>
                  <form onSubmit={handleCreateAdr} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-1">Draft New ADR</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Decision Title</label>
                      <input 
                        type="text" 
                        required
                        value={newAdr.title}
                        onChange={(e) => setNewAdr({ ...newAdr, title: e.target.value })}
                        placeholder="e.g. Migrate LMS to PostgreSQL 16"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Decision Rationale</label>
                      <textarea 
                        required
                        value={newAdr.decisionRationale}
                        onChange={(e) => setNewAdr({ ...newAdr, decisionRationale: e.target.value })}
                        placeholder="Detailed engineering rationale"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-20 focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Alternatives Considered</label>
                      <input 
                        type="text" 
                        required
                        value={newAdr.alternativesConsidered}
                        onChange={(e) => setNewAdr({ ...newAdr, alternativesConsidered: e.target.value })}
                        placeholder="e.g. MySQL, Oracle DB"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Consequences</label>
                      <textarea 
                        required
                        value={newAdr.consequences}
                        onChange={(e) => setNewAdr({ ...newAdr, consequences: e.target.value })}
                        placeholder="What are the downstream consequences?"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Affected Systems (comma-sep)</label>
                      <input 
                        type="text" 
                        required
                        value={newAdr.affectedSystems}
                        onChange={(e) => setNewAdr({ ...newAdr, affectedSystems: e.target.value })}
                        placeholder="LMS, SIS, Exams"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Affected Campuses (comma-sep)</label>
                      <input 
                        type="text" 
                        required
                        value={newAdr.affectedCampuses}
                        onChange={(e) => setNewAdr({ ...newAdr, affectedCampuses: e.target.value })}
                        placeholder="MAIN_CAMPUS, NORTH_CAMPUS"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold cursor-pointer">
                      Draft Decision Record
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: REVIEWS & EXCEPTIONS REGISTRY */}
          {activeSection === 'reviews_exceptions' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">3. ARB Reviews & Architecture Exception Registry</h2>
                <p className="text-slate-500 text-sm mt-0.5">Track time-bound architecture exception requests, detailed risk assessments, and required compensating security controls.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  {/* Active Exception Registry */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-600" />
                      Architecture Exceptions Log
                    </h3>
                    {exceptions.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-sm">No exceptions registered in this environment.</div>
                    ) : (
                      <div className="space-y-3">
                        {exceptions.map((ex) => (
                          <div key={ex.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-2">
                            <div className="flex justify-between items-start">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                ex.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700'
                              }`}>{ex.status}</span>
                              <span className="text-slate-400 text-xs font-mono">{ex.id}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">{ex.title}</h4>
                            <p className="text-xs text-slate-600"><strong className="text-slate-800">Justification:</strong> {ex.justification}</p>
                            <p className="text-xs text-slate-500"><strong className="text-slate-700">Risk Assessment:</strong> {ex.riskAssessment}</p>
                            <p className="text-xs text-slate-500"><strong className="text-slate-700">Compensating Controls:</strong> {ex.compensatingControls || 'None specified'}</p>
                            <div className="flex justify-between items-center pt-2 border-t text-xs">
                              <span className="text-red-500 font-medium">Expires: {new Date(ex.expiryDate).toLocaleDateString()}</span>
                              {ex.status === 'REQUESTED' && (
                                <button 
                                  onClick={() => handleApproveException(ex.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer text-xs"
                                >
                                  Grant Exception
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Exception request form */}
                <div>
                  <form onSubmit={handleCreateException} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b pb-1">Request Exception</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Title</label>
                      <input 
                        type="text" 
                        required
                        value={newException.title}
                        onChange={(e) => setNewException({ ...newException, title: e.target.value })}
                        placeholder="e.g. Delay SQL upgrade for north campus"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Justification</label>
                      <textarea 
                        required
                        value={newException.justification}
                        onChange={(e) => setNewException({ ...newException, justification: e.target.value })}
                        placeholder="Detailed business or academic justification"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Affected Principle ID</label>
                      <input 
                        type="text" 
                        required
                        value={newException.affectedPrincipleId}
                        onChange={(e) => setNewException({ ...newException, affectedPrincipleId: e.target.value })}
                        placeholder="e.g. eap_xyz"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Risk Assessment</label>
                      <textarea 
                        required
                        value={newException.riskAssessment}
                        onChange={(e) => setNewException({ ...newException, riskAssessment: e.target.value })}
                        placeholder="Identified technology security or operational risks"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Compensating Controls</label>
                      <textarea 
                        required
                        value={newException.compensatingControls}
                        onChange={(e) => setNewException({ ...newException, compensatingControls: e.target.value })}
                        placeholder="Controls reducing risk exposure"
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500">Expiry Date</label>
                      <input 
                        type="date" 
                        required
                        value={newException.expiryDate}
                        onChange={(e) => setNewException({ ...newException, expiryDate: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded mt-1 outline-none focus:border-sky-500 bg-white" 
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold cursor-pointer">
                      Submit Exception Request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: APPLICATION PORTFOLIO RATIONALIZATION (TIME) */}
          {activeSection === 'app_portfolio' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">4. Application Portfolio & TIME Rationalization</h2>
                <p className="text-slate-500 text-sm mt-0.5">Analyze application portfolios and calculate automatic strategic categories (Invest, Modernize, Migrate, Tolerate, Retire) based on deterministic mathematical models.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-sky-600" />
                    Portfolio Analysis
                  </h3>
                  {portfolioItems.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-400 text-sm">
                      No applications registered yet. Enter specifications in the TIME calculator.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                item.rationalizationCategory === RationalizationCategory.INVEST ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                item.rationalizationCategory === RationalizationCategory.MODERNIZE ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                item.rationalizationCategory === RationalizationCategory.MIGRATE ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                item.rationalizationCategory === RationalizationCategory.TOLERATE ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                                {item.rationalizationCategory}
                              </span>
                              <span className="text-slate-400 text-xs font-semibold">Score: {item.rationalizationScore}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-base mt-2">{item.name}</h4>
                            <p className="text-slate-500 text-xs line-clamp-2 mt-1">{item.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg mt-3">
                              <div><span className="text-slate-400 block font-semibold uppercase">Business Value</span> <strong className="text-slate-700">{item.businessCriticality} / 5</strong></div>
                              <div><span className="text-slate-400 block font-semibold uppercase">Tech Health</span> <strong className="text-slate-700">{item.technicalHealth} / 5</strong></div>
                              <div><span className="text-slate-400 block font-semibold uppercase">Strategic Fit</span> <strong className="text-slate-700">{item.strategicAlignment} / 5</strong></div>
                              <div><span className="text-slate-400 block font-semibold uppercase">Cost Reference</span> <strong className="text-slate-700">{item.operatingCostReference} / 5</strong></div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
                            <span>Biz Owner: <strong className="text-slate-700">{item.businessOwner}</strong></span>
                            <span>Tech Owner: <strong className="text-slate-700">{item.technicalOwner}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* TIME Rationalization Calculator */}
                <div>
                  <form onSubmit={handleCreateAppItem} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1 text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      Deterministic TIME Input
                    </h3>
                    <div>
                      <label className="font-semibold text-slate-500">Application Name</label>
                      <input 
                        type="text" 
                        required
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        placeholder="e.g. Student Management Core"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Description</label>
                      <input 
                        type="text" 
                        required
                        value={newApp.description}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        placeholder="Application usage and architecture"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-500">Business Owner</label>
                        <input 
                          type="text" 
                          required
                          value={newApp.businessOwner}
                          onChange={(e) => setNewApp({ ...newApp, businessOwner: e.target.value })}
                          placeholder="Registrar"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-500">Technical Owner</label>
                        <input 
                          type="text" 
                          required
                          value={newApp.technicalOwner}
                          onChange={(e) => setNewApp({ ...newApp, technicalOwner: e.target.value })}
                          placeholder="IT Lead"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Technology Stack Category</label>
                      <input 
                        type="text" 
                        required
                        value={newApp.technologyCategory}
                        onChange={(e) => setNewApp({ ...newApp, technologyCategory: e.target.value })}
                        placeholder="Node.js / React / PostgreSQL"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" 
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border space-y-2.5 mt-2">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase">Gartner TIME Scoring Attributes (1 to 5)</span>
                      
                      <div className="flex justify-between items-center gap-4">
                        <label className="text-[10px] text-slate-600">Business Value</label>
                        <input 
                          type="range" min="1" max="5" 
                          value={newApp.businessCriticality}
                          onChange={(e) => setNewApp({ ...newApp, businessCriticality: Number(e.target.value) })}
                          className="w-24 shrink-0 accent-sky-600" 
                        />
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <label className="text-[10px] text-slate-600">Technical Health</label>
                        <input 
                          type="range" min="1" max="5" 
                          value={newApp.technicalHealth}
                          onChange={(e) => setNewApp({ ...newApp, technicalHealth: Number(e.target.value) })}
                          className="w-24 shrink-0 accent-sky-600" 
                        />
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <label className="text-[10px] text-slate-600">Strategic Alignment</label>
                        <input 
                          type="range" min="1" max="5" 
                          value={newApp.strategicAlignment}
                          onChange={(e) => setNewApp({ ...newApp, strategicAlignment: Number(e.target.value) })}
                          className="w-24 shrink-0 accent-sky-600" 
                        />
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <label className="text-[10px] text-slate-600">Operating Cost</label>
                        <input 
                          type="range" min="1" max="5" 
                          value={newApp.operatingCostReference}
                          onChange={(e) => setNewApp({ ...newApp, operatingCostReference: Number(e.target.value) })}
                          className="w-24 shrink-0 accent-sky-600" 
                        />
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <label className="text-[10px] text-slate-600">Security Risk Profile</label>
                        <input 
                          type="range" min="1" max="5" 
                          value={newApp.securityRisk}
                          onChange={(e) => setNewApp({ ...newApp, securityRisk: Number(e.target.value) })}
                          className="w-24 shrink-0 accent-sky-600" 
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Calculate & Register App
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: TECHNOLOGY LIFECYCLE & SUPPORT */}
          {activeSection === 'lifecycle' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">5. Technology Lifecycle & Obsolescence Assessment</h2>
                <p className="text-slate-500 text-sm mt-0.5">Track end-of-life (EOL) timelines for database platforms, programming frameworks, and operating systems to prevent unsupported technology deployments.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* EOL list */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Obsolescence Monitor
                  </h3>
                  {lifecycles.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-sm">
                      No technology platform assessments recorded. Formulate one using standard EOL dates.
                    </div>
                  ) : (
                    <div className="bg-white border rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 font-bold uppercase tracking-wider text-slate-400">
                            <th className="p-3">Technology</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">End of Life</th>
                            <th className="p-3">Support EOL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lifecycles.map((lc) => (
                            <tr key={lc.id} className="border-b last:border-0 hover:bg-slate-50/80">
                              <td className="p-3 font-bold text-slate-800">{lc.technologyName} <span className="text-slate-400 text-[10px] font-normal">v{lc.currentVersion}</span></td>
                              <td className="p-3 text-slate-600">{lc.category}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  lc.status === 'SECURE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  lc.status === 'UPGRADE_REQUIRED' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700 font-semibold'
                                }`}>{lc.status}</span>
                              </td>
                              <td className="p-3 text-slate-600 font-mono text-[10px]">{lc.endOfLifeDate ? new Date(lc.endOfLifeDate).toLocaleDateString() : 'N/A'}</td>
                              <td className="p-3 text-slate-600 font-mono text-[10px]">{lc.endOfSupportDate ? new Date(lc.endOfSupportDate).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Record EOL specs */}
                <div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    try {
                      await EnterpriseArchitectureService.assessTechnologyLifecycle({
                        technologyName: form.techName.value,
                        category: form.category.value,
                        currentVersion: form.version.value,
                        endOfLifeDate: form.eol.value,
                        endOfSupportDate: form.eos.value,
                        lastReviewDate: new Date().toISOString(),
                        tenantId,
                        campusId,
                        createdBy: currentUser?.uid || 'usr_admin'
                      });
                      addNotification({ type: 'success', title: 'Platform Assessed', message: 'Technology obsolescence record stored.' });
                      form.reset();
                      loadWorkspaceData();
                    } catch (err: any) {
                      addNotification({ type: 'error', title: 'Error', message: err.message });
                    }
                  }} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Register EOL Target</h3>
                    <div>
                      <label className="font-semibold text-slate-500">Platform/Tech Name</label>
                      <input name="techName" type="text" required placeholder="e.g. MySQL 5.7" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Category</label>
                      <select name="category" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 bg-white focus:border-sky-500">
                        <option value="Database">Database</option>
                        <option value="Operating System">Operating System</option>
                        <option value="Programming Language">Programming Language</option>
                        <option value="Framework">Framework</option>
                        <option value="API Protocol">API Protocol</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Active Version</label>
                      <input name="version" type="text" required placeholder="e.g. 5.7.42" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">End Of Life (EOL)</label>
                      <input name="eol" type="date" required className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500 bg-white" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">End Of Support (EOS)</label>
                      <input name="eos" type="date" required className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500 bg-white" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Assess Obsolescence Limits
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: DIGITAL SERVICES CATALOG */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">6. Governed Digital Services Catalog & SLAs</h2>
                <p className="text-slate-500 text-sm mt-0.5">Catalog institutional digital services, track business and technical ownership, and define target availability SLAs.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Catalog display */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-600" />
                    Digital Services List
                  </h3>
                  {services.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-sm">
                      No digital services defined in this environment yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((svc) => (
                        <div key={svc.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-100 rounded text-[10px] font-bold">SLA: {svc.availabilityTarget}%</span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold ml-1 uppercase">{svc.complianceClassification}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">{svc.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">{svc.name}</h4>
                          <p className="text-slate-500 text-xs">{svc.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t text-slate-500">
                            <span>Svc Owner: <strong className="text-slate-700">{svc.serviceOwner}</strong></span>
                            <span>Tech Owner: <strong className="text-slate-700">{svc.technicalOwner}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Service Form */}
                <div>
                  <form onSubmit={handleCreateService} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Register Service</h3>
                    <div>
                      <label className="font-semibold text-slate-500">Service Name</label>
                      <input type="text" required value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} placeholder="e.g. Student Registration Portal" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Description</label>
                      <input type="text" required value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} placeholder="Portal for processing incoming enrollments" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Service Owner</label>
                      <input type="text" required value={newService.serviceOwner} onChange={(e) => setNewService({ ...newService, serviceOwner: e.target.value })} placeholder="Dean Academics" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Technical Lead Owner</label>
                      <input type="text" required value={newService.technicalOwner} onChange={(e) => setNewService({ ...newService, technicalOwner: e.target.value })} placeholder="Infrastructure Lead" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Availability SLA Target (%)</label>
                      <input type="number" step="0.01" required value={newService.availabilityTarget} onChange={(e) => setNewService({ ...newService, availabilityTarget: Number(e.target.value) })} placeholder="99.9" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">SLA Dependencies (comma-sep)</label>
                      <input type="text" value={newService.dependencyMap} onChange={(e) => setNewService({ ...newService, dependencyMap: e.target.value })} placeholder="DB_SVC, AUTH_SVC" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Catalog Service
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: DEPENDENCIES TOPOLOGY GRAPH */}
          {activeSection === 'topology' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">7. Architecture Dependency Topology & Cycle Detection</h2>
                <p className="text-slate-500 text-sm mt-0.5">Map inter-component dependency vectors and execute cyclic loop checks on the institutional technology graph.</p>
              </div>

              {/* Cycle Warning strip */}
              {depAnalysis.hasCircular && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <strong className="block text-sm">Circular Dependency Loop Detected!</strong>
                    <span className="text-xs">Cyclic paths found: {depAnalysis.cycles.map(c => c.join(' -> ')).join(' | ')}. This violates digital governance policies.</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Dependency Log & Analysis */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Blast Radii list */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-sky-600" />
                      Blast Radius & Dependency Analysis
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(depAnalysis.blastRadii).map(([node, radius]) => {
                        const r = radius as number;
                        return (
                          <div key={node} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
                            <span className="font-bold text-slate-800">{node}</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                              r >= 3 ? 'bg-red-50 text-red-700 border border-red-100' :
                              r >= 1 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>Blast Radius: {r} dependents</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Link List */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Mapped Dependency Vectors</h4>
                    {dependencies.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">No dependency vectors declared.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dependencies.map((dep) => (
                          <div key={dep.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">{dep.sourceId}</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                              <span className="font-semibold text-slate-700">{dep.targetId}</span>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{dep.dependencyType}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vector map form */}
                <div>
                  <form onSubmit={handleCreateDependency} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Map Dependency</h3>
                    <div>
                      <label className="font-semibold text-slate-500">Source Component ID</label>
                      <input type="text" required value={newDep.sourceId} onChange={(e) => setNewDep({ ...newDep, sourceId: e.target.value })} placeholder="e.g. SIS_APP" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Source Type</label>
                      <select value={newDep.sourceType} onChange={(e) => setNewDep({ ...newDep, sourceType: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 bg-white focus:border-sky-500">
                        <option value="application">Application</option>
                        <option value="technology">Technology Platform</option>
                        <option value="service">Digital Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Target Dependent Component ID</label>
                      <input type="text" required value={newDep.targetId} onChange={(e) => setNewDep({ ...newDep, targetId: e.target.value })} placeholder="e.g. POSTGRES_DB" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Target Type</label>
                      <select value={newDep.targetType} onChange={(e) => setNewDep({ ...newDep, targetType: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 bg-white focus:border-sky-500">
                        <option value="application">Application</option>
                        <option value="technology">Technology Platform</option>
                        <option value="service">Digital Service</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Record Linkage
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: TECHNOLOGY RISK MATRIX & TECHNICAL DEBT REGISTER */}
          {activeSection === 'risk_debt' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">8. Technology Risks 5x5 Matrix & Technical Debt Register</h2>
                <p className="text-slate-500 text-sm mt-0.5">Enforce strict 4-Eyes controls on technology risk logs and closure verifications of remediated technical debt.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* 5x5 Risks registry */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-sky-600" />
                    Technology Risks Log (5x5 Matrix)
                  </h3>

                  {risks.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">No technology risks logged. Use form below.</div>
                  ) : (
                    <div className="space-y-3">
                      {risks.map((risk) => (
                        <div key={risk.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-1 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                risk.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                              }`}>{risk.severity}</span>
                              <span className="text-slate-400 text-[10px] ml-2">Exposure score: {risk.exposure}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">{risk.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-800">{risk.title}</h4>
                          <p className="text-slate-500">{risk.description}</p>
                          <div className="flex justify-between items-center pt-2 mt-2 border-t text-[10px]">
                            <span>Logged by: {risk.creatorId}</span>
                            {risk.approverId ? (
                              <span className="text-emerald-600 font-bold">Approved by: {risk.approverId}</span>
                            ) : (
                              <button 
                                onClick={() => handleApproveRisk(risk.id)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold cursor-pointer"
                              >
                                Approve Under SoD
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create Risk Form */}
                  <form onSubmit={handleCreateRisk} className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white shadow-sm text-xs">
                    <h4 className="font-bold text-slate-800 border-b pb-1 text-[11px] uppercase">Record Risk Item</h4>
                    <div>
                      <label className="font-semibold text-slate-500">Risk Title</label>
                      <input type="text" required value={newRisk.title} onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })} placeholder="e.g. Single point of failure in north fiber link" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Description</label>
                      <input type="text" required value={newRisk.description} onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })} placeholder="Impact of physical fiber severance" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-500">Probability (1-5)</label>
                        <input type="number" min="1" max="5" required value={newRisk.probability} onChange={(e) => setNewRisk({ ...newRisk, probability: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-500">Impact (1-5)</label>
                        <input type="number" min="1" max="5" required value={newRisk.impact} onChange={(e) => setNewRisk({ ...newRisk, impact: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Submit Risk
                    </button>
                  </form>
                </div>

                {/* Technical Debt registry */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-sky-600" />
                    Technical Debt Register & Verification
                  </h3>

                  {debts.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">No technical debt logged. Define specification below.</div>
                  ) : (
                    <div className="space-y-3">
                      {debts.map((d) => (
                        <div key={d.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                d.status === TechnicalDebtStatus.VERIFIED ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>{d.status}</span>
                              <span className="text-slate-400 text-[10px] ml-2">Priority: {d.priority}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">{d.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-800">{d.title}</h4>
                          <p className="text-slate-500">{d.description}</p>
                          <div className="flex justify-between items-center pt-2 border-t mt-2 text-[10px]">
                            <span>Logged by: {d.creatorId}</span>
                            {d.status === TechnicalDebtStatus.VERIFIED ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Closed: {d.verifierId}
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleVerifyDebtClosure(d.id)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold cursor-pointer"
                              >
                                Close & Verify
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Create Debt Form */}
                  <form onSubmit={handleCreateDebt} className="p-4 border border-slate-200 rounded-lg space-y-3 bg-white shadow-sm text-xs">
                    <h4 className="font-bold text-slate-800 border-b pb-1 text-[11px] uppercase">Record Debt Item</h4>
                    <div>
                      <label className="font-semibold text-slate-500">Debt Item Title</label>
                      <input type="text" required value={newDebt.title} onChange={(e) => setNewDebt({ ...newDebt, title: e.target.value })} placeholder="e.g. Legacy library interface code" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Affected Tech</label>
                      <input type="text" required value={newDebt.affectedTechnology} onChange={(e) => setNewDebt({ ...newDebt, affectedTechnology: e.target.value })} placeholder="e.g. PHP 5.4 Scripting" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-slate-500">Remediation Effort (days)</label>
                        <input type="number" required value={newDebt.estimatedRemediationEffort} onChange={(e) => setNewDebt({ ...newDebt, estimatedRemediationEffort: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-500">Priority</label>
                        <select value={newDebt.priority} onChange={(e) => setNewDebt({ ...newDebt, priority: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 bg-white focus:border-sky-500">
                          <option value="LOW">LOW</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HIGH">HIGH</option>
                          <option value="CRITICAL">CRITICAL</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Submit Technical Debt
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: INVESTMENTS SANDBOX */}
          {activeSection === 'investments' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">9. Technology Investments Requests</h2>
                <p className="text-slate-500 text-sm mt-0.5">Submit, track, and align technology modernization funding proposals with existing strategic initiatives and phase stage gates.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Active Investment requests list */}
                <div className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    Technology Investment Register
                  </h3>
                  {investments.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-sm">
                      No technology investment requests submitted. Use form to propose one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {investments.map((inv) => (
                        <div key={inv.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{inv.status}</span>
                              <span className="px-2.5 py-0.5 bg-sky-50 text-sky-600 border border-sky-100 rounded text-[10px] font-bold ml-1 uppercase">{inv.stageGateId}</span>
                            </div>
                            <span className="text-slate-400 text-[10px] font-mono">{inv.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">{inv.title}</h4>
                          <p className="text-slate-500">{inv.description}</p>
                          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 font-medium">
                            Cost Proposing Target: <strong className="text-slate-800">INR {inv.estimatedCost.toLocaleString()}</strong>
                          </div>
                          <p className="text-[10px] text-slate-500"><strong className="text-slate-600">Benefit Rationale:</strong> {inv.benefitAssessment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Investment request form */}
                <div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await EnterpriseArchitectureService.createTechnologyInvestment({
                        ...newInvestment,
                        tenantId,
                        campusId,
                        proposerId: currentUser?.uid || 'usr_proposer'
                      });
                      addNotification({ type: 'success', title: 'Proposal Logged', message: 'Investment modernization request filed.' });
                      setNewInvestment({ title: '', description: '', estimatedCost: 50000, proposerId: '', benefitAssessment: '', portfolioId: '', programId: '', initiativeId: '', stageGateId: 'GATE_1' });
                      loadWorkspaceData();
                    } catch (err: any) {
                      addNotification({ type: 'error', title: 'Error', message: err.message });
                    }
                  }} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm text-xs">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b pb-1">Request Technology Funding</h3>
                    <div>
                      <label className="font-semibold text-slate-500">Modernization Title</label>
                      <input type="text" required value={newInvestment.title} onChange={(e) => setNewInvestment({ ...newInvestment, title: e.target.value })} placeholder="e.g. Next-Gen Library Catalog System" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Proposal Description</label>
                      <textarea required value={newInvestment.description} onChange={(e) => setNewInvestment({ ...newInvestment, description: e.target.value })} placeholder="Describe scope and goals of modernizing" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Estimated Cost (INR)</label>
                      <input type="number" required value={newInvestment.estimatedCost} onChange={(e) => setNewInvestment({ ...newInvestment, estimatedCost: Number(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Target Stage Gate Link</label>
                      <select value={newInvestment.stageGateId} onChange={(e) => setNewInvestment({ ...newInvestment, stageGateId: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 bg-white focus:border-sky-500">
                        <option value="GATE_1">GATE_1 (Initiation)</option>
                        <option value="GATE_2">GATE_2 (Feasibility)</option>
                        <option value="GATE_3">GATE_3 (Approval)</option>
                        <option value="GATE_4">GATE_4 (Execution)</option>
                        <option value="GATE_5">GATE_5 (Deployment)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-500">Benefit Rationale</label>
                      <textarea required value={newInvestment.benefitAssessment} onChange={(e) => setNewInvestment({ ...newInvestment, benefitAssessment: e.target.value })} placeholder="What strategic benefit is realized?" className="w-full px-3 py-1.5 border border-slate-200 rounded mt-1 outline-none h-16 focus:border-sky-500" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs">
                      Submit Propose
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: REAL-TIME DATA QUALITY SCANNER & WHAT-IF MODELING SANDBOX */}
          {activeSection === 'sandbox_dq' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">10. Quality Audit Scanner & What-If Transformation Sandbox</h2>
                <p className="text-slate-500 text-sm mt-0.5">Simulate scenario impact on risk and technical debt, and run automated cross-record data quality checks on the architecture registry.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Data Quality Issues */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    Automated Quality Scan Results
                  </h3>

                  {qualityIssues.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-dashed rounded-xl text-slate-400 text-xs">
                      No active data quality issues detected. Run 'Audit Tech Quality' above to check.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {qualityIssues.map((issue) => (
                        <div key={issue.id} className="bg-white p-3.5 border border-red-100 rounded-lg shadow-sm space-y-1.5 text-xs flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-red-50 text-red-700 font-bold rounded text-[9px] uppercase">{issue.category}</span>
                              <span className="text-slate-400 text-[9px] font-mono">{issue.id}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 mt-1">{issue.title}</h4>
                            <p className="text-slate-500 text-[11px]">{issue.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* What-If Simulation Sandbox */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-sky-600" />
                    What-If Simulation Sandbox
                  </h3>

                  <div className="bg-white p-4 rounded-xl border space-y-3.5 text-xs shadow-sm">
                    <span className="font-bold text-slate-700 block text-[10px] uppercase">Simulation Assumptions</span>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                        <input 
                          type="checkbox" 
                          checked={sandboxAssumptions.retireUnsupportedTech} 
                          onChange={(e) => setSandboxAssumptions({ ...sandboxAssumptions, retireUnsupportedTech: e.target.checked })} 
                          className="rounded accent-sky-600"
                        />
                        Retire all obsolete/unsupported technologies
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                        <input 
                          type="checkbox" 
                          checked={sandboxAssumptions.remediateHighDebt} 
                          onChange={(e) => setSandboxAssumptions({ ...sandboxAssumptions, remediateHighDebt: e.target.checked })} 
                          className="rounded accent-sky-600"
                        />
                        Remediate High & Critical Technical Debt
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-slate-600">
                        <input 
                          type="checkbox" 
                          checked={sandboxAssumptions.resolveCriticalRisks} 
                          onChange={(e) => setSandboxAssumptions({ ...sandboxAssumptions, resolveCriticalRisks: e.target.checked })} 
                          className="rounded accent-sky-600"
                        />
                        Resolve all High & Critical technology risks
                      </label>
                    </div>

                    <button 
                      onClick={calculateSandbox}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold cursor-pointer transition-colors text-xs flex items-center justify-center gap-1.5"
                    >
                      <Activity className="w-4 h-4" />
                      Run Simulation Scenario
                    </button>
                  </div>

                  {sandboxResult && (
                    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4 text-xs">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase border-b pb-1">Projected Transformation Outcome</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">Risks count</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-slate-500 font-medium text-xs line-through">{sandboxResult.currentRisksCount}</span>
                            <span className="text-emerald-600 font-bold text-lg">{sandboxResult.projectedRisksCount}</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 mt-1 block">Projected reduction</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">Remediation days</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-slate-500 font-medium text-xs line-through">{sandboxResult.currentDebtCost} d</span>
                            <span className="text-emerald-600 font-bold text-lg">{sandboxResult.projectedDebtCost} d</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 mt-1 block">Effort saved</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
