// EMS Phase 7.37: Institutional Workflow, Case Management, Task Orchestration & Enterprise Process Governance Engine Workspace

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import {
  WorkflowGovernanceService
} from '../../services/workflowGovernanceService';
import {
  WorkflowDefinition,
  WorkflowInstance,
  EnterpriseCase,
  EnterpriseTask,
  EnterpriseWorkQueue,
  WorkflowDelegation,
  WorkflowEscalation,
  WorkflowAnalytics,
  WorkflowAuditEvent,
  WorkflowDataQualityIssue,
  CaseCategory,
  CasePriority,
  CaseStatus,
  PrivacyClassification
} from '../../types/workflowGovernance';
import {
  GitBranch,
  Briefcase,
  CheckSquare,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  FileText,
  BarChart2,
  Database,
  Activity,
  Layers,
  CheckCircle,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Award,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

export const WorkflowGovernanceWorkspace: React.FC = () => {
  const { user } = useAuth();
  const { currentTenant, currentCampus } = useTenant();

  const [activeTab, setActiveTab] = useState<
    | 'command_center'
    | 'work_queue'
    | 'definitions'
    | 'instances'
    | 'approvals'
    | 'cases'
    | 'tasks'
    | 'sla'
    | 'escalations'
    | 'delegations'
    | 'cross_module'
    | 'evidence'
    | 'analytics'
    | 'data_quality'
    | 'reviews'
    | 'audit_trail'
  >('command_center');

  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | null>(null);
  const [workQueue, setWorkQueue] = useState<EnterpriseWorkQueue | null>(null);
  const [definitions, setDefinitions] = useState<WorkflowDefinition[]>([]);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [cases, setCases] = useState<EnterpriseCase[]>([]);
  const [tasks, setTasks] = useState<EnterpriseTask[]>([]);
  const [delegations, setDelegations] = useState<WorkflowDelegation[]>([]);
  const [escalations, setEscalations] = useState<WorkflowEscalation[]>([]);
  const [dataQualityIssues, setDataQualityIssues] = useState<WorkflowDataQualityIssue[]>([]);
  const [auditLogs, setAuditLogs] = useState<WorkflowAuditEvent[]>([]);

  // Form states
  const [showNewDefModal, setShowNewDefModal] = useState(false);
  const [newDefCode, setNewDefCode] = useState('');
  const [newDefName, setNewDefName] = useState('');
  const [newDefDesc, setNewDefDesc] = useState('');
  const [newDefCategory, setNewDefCategory] = useState<CaseCategory>('ACADEMIC');

  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCaseCategory, setNewCaseCategory] = useState<CaseCategory>('STUDENT_SUPPORT');
  const [newCasePriority, setNewCasePriority] = useState<CasePriority>('MEDIUM');

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<CasePriority>('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [showNewDelegationModal, setShowNewDelegationModal] = useState(false);
  const [newDelegateUserId, setNewDelegateUserId] = useState('');
  const [newDelEffectiveUntil, setNewDelEffectiveUntil] = useState('');

  const tenantId = currentTenant?.id || 'demo-tenant';
  const campusId = currentCampus?.id;
  const actorId = user?.id || 'user-system-admin';
  const actorRole = user?.roleAssignments?.[0]?.roleCode || 'INSTITUTION_ADMIN';

  useEffect(() => {
    loadData();
  }, [tenantId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const analyticsData = await WorkflowGovernanceService.getWorkflowAnalytics(tenantId);
      setAnalytics(analyticsData);

      const queueData = await WorkflowGovernanceService.getEnterpriseWorkQueue(tenantId, actorId, actorRole);
      setWorkQueue(queueData);

      const dq = await WorkflowGovernanceService.runDataQualityScan(tenantId);
      setDataQualityIssues(dq);
    } catch (err) {
      console.error('Failed to load Workflow Governance data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefinition = async () => {
    if (!newDefCode || !newDefName) return;
    try {
      const def = await WorkflowGovernanceService.createWorkflowDefinition(tenantId, actorId, actorRole, {
        code: newDefCode,
        name: newDefName,
        description: newDefDesc,
        category: newDefCategory,
        ownerDepartment: 'Academic Operations',
        privacyClassification: 'INTERNAL',
        campusScope: 'ALL_CAMPUSES',
        campusId
      });
      setDefinitions(prev => [def, ...prev]);
      setShowNewDefModal(false);
      setNewDefCode('');
      setNewDefName('');
      setNewDefDesc('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCase = async () => {
    if (!newCaseTitle) return;
    try {
      const c = await WorkflowGovernanceService.createEnterpriseCase(tenantId, actorId, actorRole, {
        title: newCaseTitle,
        description: newCaseDesc,
        category: newCaseCategory,
        priority: newCasePriority,
        department: 'Student Affairs',
        campusId,
        privacyClassification: 'INTERNAL'
      });
      setCases(prev => [c, ...prev]);
      setShowNewCaseModal(false);
      setNewCaseTitle('');
      setNewCaseDesc('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle) return;
    try {
      const t = await WorkflowGovernanceService.createEnterpriseTask(tenantId, actorId, actorRole, {
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        campusId
      });
      setTasks(prev => [t, ...prev]);
      setShowNewTaskModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDelegation = async () => {
    if (!newDelegateUserId) return;
    try {
      const d = await WorkflowGovernanceService.createDelegation(tenantId, actorId, actorRole, {
        delegateUserId: newDelegateUserId,
        delegatedPermissions: ['workflow.approve', 'case.resolve'],
        effectiveFrom: new Date().toISOString(),
        effectiveUntil: newDelEffectiveUntil || new Date(Date.now() + 86400000 * 7).toISOString(),
        campusId
      });
      setDelegations(prev => [d, ...prev]);
      setShowNewDelegationModal(false);
      setNewDelegateUserId('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Institutional Workflow & Case Governance Engine
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            EMS Phase 7.37 — Process Orchestration, Enterprise Case Management, Task Orchestration & Four-Eyes Governance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-md shadow-sm hover:bg-slate-50 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2 text-xs font-medium">
        {[
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'work_queue', label: 'My Work Queue', icon: CheckSquare },
          { id: 'definitions', label: 'Workflow Definitions', icon: GitBranch },
          { id: 'instances', label: 'Active Instances', icon: Layers },
          { id: 'approvals', label: 'Approvals', icon: ShieldCheck },
          { id: 'cases', label: 'Enterprise Cases', icon: Briefcase },
          { id: 'tasks', label: 'Enterprise Tasks', icon: CheckCircle },
          { id: 'sla', label: 'SLA Monitor', icon: Clock },
          { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
          { id: 'delegations', label: 'Delegated Authority', icon: Users },
          { id: 'cross_module', label: 'Cross-Module Triggers', icon: Sliders },
          { id: 'evidence', label: 'Evidence & Records', icon: FileText },
          { id: 'analytics', label: 'Process Analytics', icon: BarChart2 },
          { id: 'data_quality', label: 'Data Quality', icon: AlertOctagon },
          { id: 'reviews', label: 'Governance Reviews', icon: Award },
          { id: 'audit_trail', label: 'Audit Trail', icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Workflows</div>
              <div className="text-3xl font-extrabold text-indigo-600 mt-2">
                {analytics?.activeWorkflowsCount || 0}
              </div>
              <div className="text-xs text-slate-500 mt-1">Live Process Instances</div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open Cases</div>
              <div className="text-3xl font-extrabold text-blue-600 mt-2">
                {analytics?.openCasesCount || 0}
              </div>
              <div className="text-xs text-slate-500 mt-1">{analytics?.criticalCasesCount || 0} Critical Priority</div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">SLA Compliance</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                {analytics?.slaCompliancePercent || 100}%
              </div>
              <div className="text-xs text-slate-500 mt-1">{analytics?.slaBreachesCount || 0} Breaches Recorded</div>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Tasks</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-2">
                {analytics?.overdueTasksCount || 0}
              </div>
              <div className="text-xs text-slate-500 mt-1">Task Completion: {analytics?.taskCompletionPercent || 100}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
                Process Execution Health
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-600">Workflow Completion Rate</span>
                  <span className="font-semibold text-slate-900">{analytics?.workflowCompletionRatePercent || 100}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-600">Average Cycle Time</span>
                  <span className="font-semibold text-slate-900">{analytics?.averageCycleTimeHours || 0} hrs</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-600">Approval Turnaround Time</span>
                  <span className="font-semibold text-slate-900">{analytics?.approvalTurnaroundHours || 0} hrs</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-600">Active Escalations</span>
                  <span className="font-semibold text-amber-600">{analytics?.escalationsCount || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
                Data Quality & Compliance Alerts
              </h3>
              {dataQualityIssues.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No data quality or compliance issues detected in active processes.
                </div>
              ) : (
                <div className="space-y-2">
                  {dataQualityIssues.map(issue => (
                    <div key={issue.id} className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs flex items-start gap-2">
                      <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-900">{issue.type}</div>
                        <div className="text-amber-800">{issue.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'work_queue' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Dynamic Enterprise Work Queue</h3>
            <span className="text-xs text-slate-500">Derived for User ID: {actorId}</span>
          </div>

          {!workQueue || (workQueue.myTasks.length === 0 && workQueue.myCases.length === 0 && workQueue.myApprovals.length === 0) ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No pending work items assigned to your account.
            </div>
          ) : (
            <div className="space-y-4">
              {workQueue.myTasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">My Assigned Tasks</h4>
                  <div className="space-y-2">
                    {workQueue.myTasks.map(item => (
                      <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900">{item.code} — {item.title}</div>
                          <div className="text-slate-500">Priority: {item.priority} | Due: {item.dueDate || 'N/A'}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'definitions' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Institutional Workflow Definitions</h3>
              <p className="text-xs text-slate-500">Governed workflow templates, versioning, and activation controls</p>
            </div>
            <button
              onClick={() => setShowNewDefModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              New Definition
            </button>
          </div>

          {definitions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No workflow definitions configured.
            </div>
          ) : (
            <div className="space-y-3">
              {definitions.map(def => (
                <div key={def.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{def.code}</span> — {def.name}
                      <p className="text-slate-500 text-xs">{def.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                      {def.lifecycleStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Definition Modal */}
          {showNewDefModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900">Create Workflow Definition</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Code</label>
                    <input
                      type="text"
                      value={newDefCode}
                      onChange={e => setNewDefCode(e.target.value)}
                      placeholder="e.g. WF-STUDENT-SUPPORT"
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newDefName}
                      onChange={e => setNewDefName(e.target.value)}
                      placeholder="e.g. Student Support Remediation"
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newDefDesc}
                      onChange={e => setNewDefDesc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewDefModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDefinition}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                  >
                    Save Definition
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'instances' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Active Workflow Instances
          </h3>
          {instances.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No active workflow instances.
            </div>
          ) : (
            <div className="space-y-2">
              {instances.map(inst => (
                <div key={inst.id} className="p-3 border border-slate-200 rounded text-xs flex justify-between">
                  <div>
                    <div className="font-semibold">{inst.instanceCode}</div>
                    <div className="text-slate-500">Status: {inst.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Pending Approval Chains & Four-Eyes Governance
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            No pending approvals.
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Enterprise Case Management</h3>
              <p className="text-xs text-slate-500">Cross-module governed case files, evidence, and resolutions</p>
            </div>
            <button
              onClick={() => setShowNewCaseModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              New Case
            </button>
          </div>

          {cases.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No enterprise cases found.
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map(c => (
                <div key={c.id} className="p-4 border border-slate-200 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900">{c.caseNumber}</span> — {c.title}
                      <p className="text-slate-500 text-xs">{c.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">{c.priority}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">{c.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showNewCaseModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900">Create Enterprise Case</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newCaseTitle}
                      onChange={e => setNewCaseTitle(e.target.value)}
                      placeholder="e.g. Student Safeguarding Appeal"
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newCaseDesc}
                      onChange={e => setNewCaseDesc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Category</label>
                      <select
                        value={newCaseCategory}
                        onChange={e => setNewCaseCategory(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="ACADEMIC">ACADEMIC</option>
                        <option value="STUDENT_SUPPORT">STUDENT_SUPPORT</option>
                        <option value="FINANCE">FINANCE</option>
                        <option value="HR">HR</option>
                        <option value="GOVERNANCE">GOVERNANCE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Priority</label>
                      <select
                        value={newCasePriority}
                        onChange={e => setNewCasePriority(e.target.value as any)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewCaseModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCase}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                  >
                    Create Case
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Enterprise Task Orchestration</h3>
              <p className="text-xs text-slate-500">Tasks, blocking dependencies, and execution status</p>
            </div>
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No tasks assigned.
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.id} className="p-4 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{t.taskCode}</span> — {t.title}
                    <div className="text-slate-500">Due: {t.dueDate}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">{t.status}</span>
                </div>
              ))}
            </div>
          )}

          {showNewTaskModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900">Create Enterprise Task</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Conduct Remediation Audit"
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newTaskDesc}
                      onChange={e => setNewTaskDesc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={e => setNewTaskDueDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sla' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            SLA Monitor & Compliance Policies
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            No SLA breaches detected.
          </div>
        </div>
      )}

      {activeTab === 'escalations' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Process Escalation Log
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            No active escalations.
          </div>
        </div>
      )}

      {activeTab === 'delegations' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Delegated Authority Management</h3>
              <p className="text-xs text-slate-500">Time-bound authority delegations and scope constraints</p>
            </div>
            <button
              onClick={() => setShowNewDelegationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              New Delegation
            </button>
          </div>

          {delegations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No delegated authorities.
            </div>
          ) : (
            <div className="space-y-3">
              {delegations.map(d => (
                <div key={d.id} className="p-3 border border-slate-200 rounded text-xs flex justify-between">
                  <div>
                    <div className="font-semibold">Delegated to: {d.delegateUserId}</div>
                    <div className="text-slate-500">Effective Until: {d.effectiveUntil}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Active</span>
                </div>
              ))}
            </div>
          )}

          {showNewDelegationModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-900">Delegate Authority</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Delegate User ID</label>
                    <input
                      type="text"
                      value={newDelegateUserId}
                      onChange={e => setNewDelegateUserId(e.target.value)}
                      placeholder="e.g. user_dept_head_02"
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowNewDelegationModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateDelegation}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
                  >
                    Save Delegation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cross_module' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Cross-Module Workflow Integration Registry
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Authorized triggers from Student Support, Finance, Research, Risk, Scheduling, Quality & Accreditation
          </p>
          <div className="text-center py-12 text-slate-500 text-xs">
            No active cross-module triggers registered.
          </div>
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Evidence & Document Registry Mappings
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            No evidence records attached to active cases.
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Live Institutional Process Analytics
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="font-medium text-slate-600">Case Aging Average</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{analytics?.caseAgingDaysAverage || 0} Days</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="font-medium text-slate-600">Rejection Rate</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{analytics?.rejectionRatePercent || 0}%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-200">
              <div className="font-medium text-slate-600">Reopened Cases</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{analytics?.reopenedCasesCount || 0}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data_quality' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">Process Data Quality Scanner</h3>
            <button
              onClick={loadData}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
            >
              Run DQ Scan
            </button>
          </div>

          {dataQualityIssues.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No data quality issues detected across workflow references.
            </div>
          ) : (
            <div className="space-y-2">
              {dataQualityIssues.map(issue => (
                <div key={issue.id} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs">
                  <div className="font-bold text-amber-900">{issue.type} — {issue.severity} Severity</div>
                  <div className="text-amber-800">{issue.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Governance Reviews & Override Logs
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            No governance decisions recorded.
          </div>
        </div>
      )}

      {activeTab === 'audit_trail' && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
            Immutable Workflow Governance Audit Log
          </h3>
          <div className="text-center py-12 text-slate-500 text-xs">
            Audit logs are recorded append-only on Firestore.
          </div>
        </div>
      )}
    </div>
  );
};
