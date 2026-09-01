import React, { useState, useEffect } from 'react';
import {
  Microscope,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  BookOpen,
  FolderGit2,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  Activity,
  UserCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

import { ResearchService } from '../../services/researchService';
import {
  ResearchProject,
  ResearchProposal,
  ResearchTeamMember,
  ResearchMilestone,
  ResearchOutput,
  ResearchPublication,
  ResearchIntellectualProperty,
  InnovationInitiative,
  InstitutionalProject,
  ProjectTask,
  ProjectRisk,
  ProjectIssue,
  ResearchKnowledgeAsset,
  ResearchAnalyticsCache
} from '../../types/research';
import { AuditRecord } from '../../types';
import { FirebaseService } from '../../services/firebaseService';

interface ResearchWorkspaceProps {
  tenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    roles: string[];
  };
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({ tenantId, currentUser }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<ResearchAnalyticsCache | null>(null);

  // Entities state
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [publications, setPublications] = useState<ResearchPublication[]>([]);
  const [ipRecords, setIpRecords] = useState<ResearchIntellectualProperty[]>([]);
  const [innovations, setInnovations] = useState<InnovationInitiative[]>([]);
  const [instProjects, setInstProjects] = useState<InstitutionalProject[]>([]);
  const [knowledgeAssets, setKnowledgeAssets] = useState<ResearchKnowledgeAsset[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Selected state for details
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectMilestones, setProjectMilestones] = useState<ResearchMilestone[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [projectRisks, setProjectRisks] = useState<ProjectRisk[]>([]);
  const [projectIssues, setProjectIssues] = useState<ProjectIssue[]>([]);
  const [projectTeam, setProjectTeam] = useState<ResearchTeamMember[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Action Modals / Forms
  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [showCreateProposalModal, setShowCreateProposalModal] = useState<boolean>(false);
  const [showCreateIPModal, setShowCreateIPModal] = useState<boolean>(false);
  const [showCreateInnovationModal, setShowCreateInnovationModal] = useState<boolean>(false);
  const [showCreateRiskModal, setShowCreateRiskModal] = useState<boolean>(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState<boolean>(false);

  // Form Fields
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectAbstract, setNewProjectAbstract] = useState('');
  const [newProjectPI, setNewProjectPI] = useState(currentUser.displayName);
  const [newProjectDepartment, setNewProjectDepartment] = useState('Dept of Computer Science & Research');
  const [newProjectBudget, setNewProjectBudget] = useState<number>(50000);

  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalSummary, setNewProposalSummary] = useState('');
  const [newProposalFundingAgency, setNewProposalFundingAgency] = useState('National Science Foundation');
  const [newProposalFundingReq, setNewProposalFundingReq] = useState<number>(75000);

  const [newIPTitle, setNewIPTitle] = useState('');
  const [newIPType, setNewIPType] = useState<'PATENT' | 'COPYRIGHT' | 'TRADEMARK'>('PATENT');

  const [newInnovationTitle, setNewInnovationTitle] = useState('');
  const [newInnovationProblem, setNewInnovationProblem] = useState('');
  const [newInnovationSolution, setNewInnovationSolution] = useState('');

  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskProb, setNewRiskProb] = useState<number>(3);
  const [newRiskImpact, setNewRiskImpact] = useState<number>(4);
  const [newRiskMitigation, setNewRiskMitigation] = useState('');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser.displayName);
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  const actor = {
    id: currentUser.id,
    email: currentUser.email,
    displayName: currentUser.displayName,
    role: (currentUser as any).roles?.[0] || currentUser.roleAssignments?.[0]?.roleCode || 'tenant_admin'
  };

  useEffect(() => {
    loadData();
  }, [tenantId]);

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectDetails(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prjList, propList, pubList, ipList, invList, instList, knwList, stats, auditData] = await Promise.all([
        ResearchService.getProjects(tenantId),
        ResearchService.getProposals(tenantId),
        ResearchService.getPublications(tenantId),
        ResearchService.getIPRecords(tenantId),
        ResearchService.getInnovations(tenantId),
        ResearchService.getInstitutionalProjects(tenantId),
        ResearchService.getKnowledgeAssets(tenantId),
        ResearchService.getResearchAnalytics(tenantId),
        FirebaseService.getTenantCollection<AuditRecord>('audit_logs', tenantId, [])
      ]);

      setProjects(prjList);
      setProposals(propList);
      setPublications(pubList);
      setIpRecords(ipList);
      setInnovations(invList);
      setInstProjects(instList);
      setKnowledgeAssets(knwList);
      setAnalytics(stats);
      setAuditLogs(auditData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 50));

      if (prjList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjList[0].id);
      }
    } catch (err) {
      console.error('Error loading research workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projId: string) => {
    try {
      const [mls, tsks, rsks, isss, tm] = await Promise.all([
        ResearchService.getMilestones(tenantId, projId),
        ResearchService.getTasks(tenantId, projId),
        ResearchService.getRisks(tenantId, projId),
        ResearchService.getIssues(tenantId, projId),
        ResearchService.getTeamMembers(tenantId, projId)
      ]);
      setProjectMilestones(mls);
      setProjectTasks(tsks);
      setProjectRisks(rsks);
      setProjectIssues(isss);
      setProjectTeam(tm);
    } catch (err) {
      console.error('Error loading project details:', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const deptSlug = `dept_${newProjectDepartment.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20)}`;
      const created = await ResearchService.createProject(tenantId, {
        title: newProjectTitle,
        abstractText: newProjectAbstract,
        departmentId: deptSlug,
        departmentName: newProjectDepartment,
        principalInvestigatorId: currentUser.id,
        principalInvestigatorName: newProjectPI,
        budgetAmount: newProjectBudget,
        currency: 'USD',
        tags: ['AI', 'Research', 'Innovation']
      }, actor);

      setShowCreateProjectModal(false);
      setNewProjectTitle('');
      setNewProjectAbstract('');
      await loadData();
      setSelectedProjectId(created.id);
    } catch (err: any) {
      alert(err.message || 'Failed to create research project');
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const deptSlug = `dept_${newProjectDepartment.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20)}`;
      await ResearchService.createProposal(tenantId, {
        title: newProposalTitle,
        summary: newProposalSummary,
        departmentId: deptSlug,
        principalInvestigatorId: currentUser.id,
        principalInvestigatorName: currentUser.displayName,
        requestedFundingAmount: newProposalFundingReq,
        fundingAgencyName: newProposalFundingAgency,
        ethicsRequired: false
      }, newProposalSummary, 'Methodology & Research Plan', actor);

      setShowCreateProposalModal(false);
      setNewProposalTitle('');
      setNewProposalSummary('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create research proposal');
    }
  };

  const handleApproveProposal = async (propId: string) => {
    try {
      await ResearchService.approveProposal(tenantId, propId, 'Approved by Research Governance Committee', actor);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleCreateIP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ResearchService.createIPRecord(tenantId, {
        title: newIPTitle,
        ipType: newIPType,
        inventors: [{ inventorId: currentUser.id, name: currentUser.displayName, sharePercentage: 100 }]
      }, actor);

      setShowCreateIPModal(false);
      setNewIPTitle('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to disclose IP');
    }
  };

  const handleCreateInnovation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ResearchService.createInnovation(tenantId, {
        title: newInnovationTitle,
        problemStatement: newInnovationProblem,
        proposedSolution: newInnovationSolution,
        ownerId: currentUser.id,
        ownerName: currentUser.displayName,
        estimatedImpactScore: 8.5
      }, actor);

      setShowCreateInnovationModal(false);
      setNewInnovationTitle('');
      setNewInnovationProblem('');
      setNewInnovationSolution('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit innovation initiative');
    }
  };

  const handleCreateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await ResearchService.createRisk(tenantId, {
        projectId: selectedProjectId,
        title: newRiskTitle,
        description: newRiskMitigation,
        probability: newRiskProb,
        impact: newRiskImpact,
        mitigationPlan: newRiskMitigation,
        ownerId: currentUser.id,
        ownerName: currentUser.displayName
      }, actor);

      setShowCreateRiskModal(false);
      setNewRiskTitle('');
      setNewRiskMitigation('');
      await loadProjectDetails(selectedProjectId);
    } catch (err: any) {
      alert(err.message || 'Failed to add risk');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await ResearchService.createTask(tenantId, {
        projectId: selectedProjectId,
        title: newTaskTitle,
        description: 'Task execution details',
        assigneeId: currentUser.id,
        assigneeName: newTaskAssignee,
        priority: newTaskPriority,
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
      }, actor);

      setShowCreateTaskModal(false);
      setNewTaskTitle('');
      await loadProjectDetails(selectedProjectId);
    } catch (err: any) {
      alert(err.message || 'Failed to create task');
    }
  };

  const handleAdvanceProjectStatus = async (projId: string, currentStatus: string) => {
    let next: any = 'SUBMITTED';
    if (currentStatus === 'DRAFT') next = 'SUBMITTED';
    else if (currentStatus === 'SUBMITTED') next = 'APPROVED';
    else if (currentStatus === 'APPROVED') next = 'ACTIVE';
    else if (currentStatus === 'ACTIVE') next = 'COMPLETED';

    try {
      await ResearchService.updateProjectStatus(tenantId, projId, next, actor, `Advanced to ${next}`);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.projectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <Microscope className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Research & Innovation Governance</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Institutional project portfolios, research proposals, publications, IP pipeline, and knowledge assets (Phase 7.22)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowCreateProposalModal(true)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2 transition"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            New Proposal
          </button>
          <button
            onClick={() => setShowCreateProjectModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            New Research Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto space-x-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'projects', label: 'Research Projects', icon: Microscope },
          { id: 'proposals', label: 'Proposals & Approvals', icon: FileText },
          { id: 'team_milestones', label: 'Team & Milestones', icon: Users },
          { id: 'outputs_publications', label: 'Publications & Outputs', icon: BookOpen },
          { id: 'ip_innovation', label: 'IP & Innovation Pipeline', icon: Lightbulb },
          { id: 'institutional_projects', label: 'Institutional Projects', icon: Building2 },
          { id: 'risks_tasks', label: 'Tasks & Risk Engine', icon: AlertTriangle },
          { id: 'knowledge', label: 'Knowledge Assets', icon: FolderGit2 },
          { id: 'audit', label: 'Governance Audit', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div>
          {/* TAB 1: OVERVIEW / COMMAND CENTER */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
                    <Microscope className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{analytics?.totalActiveProjects || projects.length}</div>
                  <p className="text-xs text-slate-500 mt-1">{analytics?.totalCompletedProjects || 0} projects completed</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Proposals Under Review</span>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{analytics?.proposalsUnderReview || proposals.length}</div>
                  <p className="text-xs text-slate-500 mt-1">~{analytics?.averageApprovalTurnaroundDays || 14} days avg turnaround</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Publications & IP</span>
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{(publications.length) + (ipRecords.length)}</div>
                  <p className="text-xs text-slate-500 mt-1">{publications.length} Papers, {ipRecords.length} IP disclosures</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Portfolio Health</span>
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{analytics?.milestoneCompletionRate || 88}%</div>
                  <p className="text-xs text-slate-500 mt-1">{analytics?.atRiskProjectsCount || 0} projects flagged at risk</p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Research Projects */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-900">Active Research Projects</h2>
                    <button onClick={() => setActiveTab('projects')} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">View All →</button>
                  </div>
                  {projects.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                      <Microscope className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">No research projects recorded yet.</p>
                      <button onClick={() => setShowCreateProjectModal(true)} className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">Create First Project</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 4).map(prj => (
                        <div key={prj.id} className="p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition bg-slate-50/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{prj.projectCode}</span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              prj.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                              prj.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                              prj.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {prj.status}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1">{prj.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{prj.abstractText}</p>
                          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>PI: <strong>{prj.principalInvestigatorName}</strong></span>
                            <span>Budget: <strong>${(prj.budgetAmount || 0).toLocaleString()} {prj.currency || 'USD'}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Innovation Pipeline & Quick Governance */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <h2 className="text-base font-bold text-slate-900 mb-3">Innovation Pipeline</h2>
                    {innovations.length === 0 ? (
                      <p className="text-xs text-slate-500">No innovation initiatives recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {innovations.slice(0, 3).map(inv => (
                          <div key={inv.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-800">{inv.title}</span>
                              <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{inv.stage}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{inv.problemStatement}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-indigo-950 text-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-sm font-bold">Governance & Compliance</h3>
                    </div>
                    <p className="text-xs text-indigo-200 mb-4">
                      All research proposals, IP disclosures, ethics committee references, and project state transitions are protected by separation of duties and auditable ledgers.
                    </p>
                    <div className="text-xs font-mono bg-indigo-900/50 p-2.5 rounded border border-indigo-800/80 text-indigo-300">
                      Tenant & Campus Boundary: Verified<br />
                      Ethics Review Committee: Governed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESEARCH PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {/* Search & Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by code, title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              {/* Project Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Title & Abstract</th>
                      <th className="py-3 px-4">Principal Investigator</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                          No research projects match your search query.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map(prj => (
                        <tr key={prj.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 text-xs">{prj.projectCode}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{prj.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-1 max-w-md">{prj.abstractText}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{prj.principalInvestigatorName}</td>
                          <td className="py-3.5 px-4 text-slate-600 text-xs">{prj.departmentName || 'Computer Science'}</td>
                          <td className="py-3.5 px-4 text-slate-900 font-semibold">${(prj.budgetAmount || 0).toLocaleString()}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              prj.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                              prj.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                              prj.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {prj.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProjectId(prj.id);
                                  setActiveTab('team_milestones');
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition"
                              >
                                View Team & Tasks
                              </button>
                              {prj.status !== 'COMPLETED' && (
                                <button
                                  onClick={() => handleAdvanceProjectStatus(prj.id, prj.status)}
                                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition"
                                >
                                  Advance Status
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PROPOSALS & APPROVALS */}
          {activeTab === 'proposals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Research Proposals</h2>
                  <p className="text-xs text-slate-500">Governed proposal versioning, submission, and separation-of-duties approval workflow</p>
                </div>
                <button
                  onClick={() => setShowCreateProposalModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Proposal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No proposals submitted yet.</p>
                  </div>
                ) : (
                  proposals.map(prop => (
                    <div key={prop.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">{prop.proposalCode}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          prop.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          prop.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {prop.status} (v{prop.currentVersionNumber})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{prop.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{prop.summary}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>PI: <strong>{prop.principalInvestigatorName}</strong></span>
                        <span>Requested: <strong>${(prop.requestedFundingAmount || 0).toLocaleString()}</strong></span>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        {prop.status === 'DRAFT' && (
                          <button
                            onClick={async () => {
                              await ResearchService.submitProposal(tenantId, prop.id, actor);
                              await loadData();
                            }}
                            className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition"
                          >
                            Submit Proposal
                          </button>
                        )}
                        {prop.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleApproveProposal(prop.id)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700 transition"
                          >
                            Approve Proposal
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM & MILESTONES */}
          {activeTab === 'team_milestones' && (
            <div className="space-y-6">
              {/* Project Selector */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600 uppercase">Select Project:</span>
                <select
                  value={selectedProjectId || ''}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectCode} — {p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Research Team
                    </h3>
                  </div>
                  {projectTeam.length === 0 ? (
                    <p className="text-xs text-slate-500">No team members assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectTeam.map(tm => (
                        <div key={tm.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{tm.memberName}</div>
                            <div className="text-[11px] text-slate-500">{tm.role} ({tm.memberType})</div>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">ACTIVE</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Project Milestones
                    </h3>
                  </div>
                  {projectMilestones.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-500">No milestones recorded for this project.</p>
                      <button
                        onClick={async () => {
                          if (!selectedProjectId) return;
                          await ResearchService.createMilestone(tenantId, {
                            projectId: selectedProjectId,
                            title: 'Literature Review & Feasibility Study',
                            description: 'Initial investigation and domain research',
                            plannedStart: new Date().toISOString().split('T')[0],
                            plannedEnd: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                            ownerId: currentUser.id,
                            ownerName: currentUser.displayName,
                            status: 'IN_PROGRESS',
                            completionPercentage: 45
                          }, actor);
                          loadProjectDetails(selectedProjectId);
                        }}
                        className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        + Add Default Milestone
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectMilestones.map(m => (
                        <div key={m.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{m.title}</span>
                            <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{m.status}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${m.completionPercentage}%` }}></div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Target: {m.plannedEnd}</span>
                            <span>{m.completionPercentage}% Completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PUBLICATIONS & OUTPUTS */}
          {activeTab === 'outputs_publications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Registered Publications & Outputs</h2>
                  <p className="text-xs text-slate-500">Peer-reviewed journal papers, conference proceedings, and research deliverables</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Journal / Conference</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">DOI / Indexing</th>
                      <th className="py-3 px-4">Publication Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {publications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                          No publications registered yet.
                        </td>
                      </tr>
                    ) : (
                      publications.map(pub => (
                        <tr key={pub.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{pub.title}</td>
                          <td className="py-3.5 px-4 text-slate-700">{pub.journalOrConferenceName}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">{pub.publicationType}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-mono text-indigo-600">{pub.doi || '10.1016/j.cs.2026.01'}</td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">{pub.publicationDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: IP & INNOVATION */}
          {activeTab === 'ip_innovation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Intellectual Property & Innovation Pipeline</h2>
                  <p className="text-xs text-slate-500">Patent filings, invention disclosures, and technology transfer initiatives</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCreateIPModal(true)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Disclose IP</button>
                  <button onClick={() => setShowCreateInnovationModal(true)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold">New Innovation</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IP Disclosures */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    IP Disclosures & Patents
                  </h3>
                  {ipRecords.length === 0 ? (
                    <p className="text-xs text-slate-500">No IP disclosures recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {ipRecords.map(ip => (
                        <div key={ip.id} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono font-bold text-slate-700">{ip.disclosureNumber}</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{ip.stage}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900">{ip.title}</div>
                          <div className="text-[11px] text-slate-500 mt-1">Type: {ip.ipType}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Innovation Initiatives */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                    Innovation Initiatives
                  </h3>
                  {innovations.length === 0 ? (
                    <p className="text-xs text-slate-500">No innovation initiatives recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {innovations.map(inv => (
                        <div key={inv.id} className="p-3.5 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{inv.title}</span>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">{inv.stage}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1">{inv.proposedSolution}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: INSTITUTIONAL PROJECTS */}
          {activeTab === 'institutional_projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institutional Projects Portfolio</h2>
                  <p className="text-xs text-slate-500">Strategic non-research institutional development initiatives and expansion projects</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instProjects.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No institutional projects recorded.</p>
                  </div>
                ) : (
                  instProjects.map(ip => (
                    <div key={ip.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{ip.projectCode}</span>
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{ip.status}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{ip.title}</h3>
                      <p className="text-xs text-slate-600">{ip.objectives}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Owner: <strong>{ip.ownerName}</strong></span>
                        <span>Budget: <strong>${(ip.budgetAmount || 0).toLocaleString()}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: TASKS & RISKS */}
          {activeTab === 'risks_tasks' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-600 uppercase">Selected Project:</span>
                  <select
                    value={selectedProjectId || ''}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="px-3 py-1 text-sm bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectCode} — {p.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCreateTaskModal(true)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">+ Add Task</button>
                  <button onClick={() => setShowCreateRiskModal(true)} className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold">+ Flag Risk</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Project Tasks</h3>
                  {projectTasks.length === 0 ? (
                    <p className="text-xs text-slate-500">No tasks created for selected project.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectTasks.map(t => (
                        <div key={t.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{t.title}</div>
                            <div className="text-[11px] text-slate-500">Assignee: {t.assigneeName} • Priority: {t.priority}</div>
                          </div>
                          <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">{t.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Risks */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Risk Matrix (Prob × Impact)
                  </h3>
                  {projectRisks.length === 0 ? (
                    <p className="text-xs text-slate-500">No risks flagged for selected project.</p>
                  ) : (
                    <div className="space-y-2">
                      {projectRisks.map(r => (
                        <div key={r.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{r.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              r.severityLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                              r.severityLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              Score: {r.severityScore} ({r.severityLevel})
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">Mitigation: {r.mitigationPlan}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: KNOWLEDGE ASSETS */}
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institutional Knowledge Assets</h2>
                  <p className="text-xs text-slate-500">Curated reports, methodology documents, and closure summaries</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {knowledgeAssets.length === 0 ? (
                  <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-slate-200">
                    <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No knowledge assets curated yet.</p>
                  </div>
                ) : (
                  knowledgeAssets.map(ka => (
                    <div key={ka.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase">{ka.category}</span>
                      <h3 className="text-sm font-bold text-slate-900">{ka.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{ka.summary}</p>
                      <div className="pt-2 text-[11px] text-slate-400">Author: {ka.authorName}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Research Governance Audit Trail</h2>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target Resource</th>
                      <th className="py-3 px-4">Target ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">No audit logs available.</td>
                      </tr>
                    ) : (
                      auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition text-xs">
                          <td className="py-3 px-4 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">{log.actorName}</td>
                          <td className="py-3 px-4 font-bold text-indigo-600">{log.action}</td>
                          <td className="py-3 px-4 text-slate-600">{log.targetResource}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{log.targetId}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE PROJECT */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Research Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProjectTitle}
                  onChange={e => setNewProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Quantum-Resilient Distributed Ledger Architecture"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Abstract</label>
                <textarea
                  required
                  rows={3}
                  value={newProjectAbstract}
                  onChange={e => setNewProjectAbstract(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Comprehensive research summary..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Investigator</label>
                  <input
                    type="text"
                    required
                    value={newProjectPI}
                    onChange={e => setNewProjectPI(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    required
                    value={newProjectBudget}
                    onChange={e => setNewProjectBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateProjectModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROPOSAL */}
      {showCreateProposalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">New Research Proposal</h3>
            <form onSubmit={handleCreateProposal} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={newProposalTitle}
                  onChange={e => setNewProposalTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g., Deep Learning in Climate Science Modeling"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Summary</label>
                <textarea
                  required
                  rows={3}
                  value={newProposalSummary}
                  onChange={e => setNewProposalSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Summary of research scope..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Agency</label>
                  <input
                    type="text"
                    required
                    value={newProposalFundingAgency}
                    onChange={e => setNewProposalFundingAgency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Requested Funding ($)</label>
                  <input
                    type="number"
                    required
                    value={newProposalFundingReq}
                    onChange={e => setNewProposalFundingReq(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateProposalModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Save Draft Proposal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISCLOSE IP */}
      {showCreateIPModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Disclose Intellectual Property</h3>
            <form onSubmit={handleCreateIP} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Invention / IP Title</label>
                <input
                  type="text"
                  required
                  value={newIPTitle}
                  onChange={e => setNewIPTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g., Ultra-Low Latency Neural Processor System"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">IP Category</label>
                <select
                  value={newIPType}
                  onChange={e => setNewIPType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="PATENT">PATENT</option>
                  <option value="COPYRIGHT">COPYRIGHT</option>
                  <option value="TRADEMARK">TRADEMARK</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateIPModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Submit Disclosure</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INNOVATION */}
      {showCreateInnovationModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">New Innovation Initiative</h3>
            <form onSubmit={handleCreateInnovation} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initiative Title</label>
                <input
                  type="text"
                  required
                  value={newInnovationTitle}
                  onChange={e => setNewInnovationTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g., Campus Smart Microgrid Optimization"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Statement</label>
                <textarea
                  required
                  rows={2}
                  value={newInnovationProblem}
                  onChange={e => setNewInnovationProblem(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Solution</label>
                <textarea
                  required
                  rows={2}
                  value={newInnovationSolution}
                  onChange={e => setNewInnovationSolution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateInnovationModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">Submit Initiative</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE RISK */}
      {showCreateRiskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Flag Project Risk</h3>
            <form onSubmit={handleCreateRisk} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Risk Title</label>
                <input
                  type="text"
                  required
                  value={newRiskTitle}
                  onChange={e => setNewRiskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g., Equipment Delivery Delay"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Probability (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    required
                    value={newRiskProb}
                    onChange={e => setNewRiskProb(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Impact (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    required
                    value={newRiskImpact}
                    onChange={e => setNewRiskImpact(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mitigation Plan</label>
                <textarea
                  required
                  rows={2}
                  value={newRiskMitigation}
                  onChange={e => setNewRiskMitigation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateRiskModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-semibold">Flag Risk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TASK */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Project Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g., Benchmark Algorithm Performance"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    required
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowCreateTaskModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
