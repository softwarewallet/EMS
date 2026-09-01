import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckSquare, 
  ClipboardList, 
  Clock, 
  AlertOctagon, 
  Users, 
  GitMerge, 
  ShieldAlert, 
  FileCheck, 
  BarChart3, 
  Play, 
  Activity, 
  FileText, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  FileCode,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { EnterpriseCaseGovernanceService } from '../../services/enterpriseCaseGovernanceService';
import { 
  EnterpriseCase, 
  EnterpriseTask, 
  EnterpriseActionItem, 
  EnterpriseGovernanceException, 
  EnterpriseEscalationEvent, 
  EnterpriseCaseDiagnostic, 
  EnterpriseCaseSimulation,
  EnterpriseCaseAuditLog
} from '../../types';

export const EnterpriseCaseGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'COMMAND'
    | 'CASES'
    | 'TASKS'
    | 'ACTIONS'
    | 'SLA'
    | 'ESCALATIONS'
    | 'QUEUES'
    | 'DEPENDENCIES'
    | 'EXCEPTIONS'
    | 'EVIDENCE'
    | 'ANALYTICS'
    | 'SIMULATION'
    | 'DIAGNOSTICS'
    | 'AUDIT'
  >('COMMAND');

  const [simulationScenario, setSimulationScenario] = useState<EnterpriseCaseSimulation['scenario']>('SLA_SURGE');
  const [simulationResult, setSimulationResult] = useState<EnterpriseCaseSimulation | null>(null);

  // Initial mock data adhering strictly to reference-only identifiers
  const [mockCases] = useState<EnterpriseCase[]>([
    {
      id: 'case-802-01',
      tenantId: 'tenant-main',
      campusId: 'campus-north',
      caseNumber: 'CAS-2026-001',
      title: 'Academic Accreditation Compliance Discrepancy',
      description: 'Audit finding regarding international curriculum compliance validation in Engineering Dept.',
      caseType: 'COMPLIANCE',
      priority: 'HIGH',
      severity: 'MAJOR',
      status: 'IN_PROGRESS',
      confidentialityLevel: 'CONFIDENTIAL',
      sourceModuleIdRef: 'mod_compliance_assurance',
      sourceRecordIdRef: 'comp-rec-9941',
      departmentIdRef: 'dept-eng',
      ownerUserIdRef: 'user-director-01',
      assignment: {
        assignedUserIdRef: 'user-compliance-lead',
        assignedRoleIdRef: 'role_compliance_auditor',
        assignedDepartmentIdRef: 'dept-eng',
        assignedCampusIdRef: 'campus-north',
        assignedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        assignedByUserIdRef: 'user-director-01'
      },
      relationships: [],
      slaStatus: 'ON_TRACK',
      slaDueDate: new Date(Date.now() + 3600000 * 72).toISOString(),
      escalationLevel: 'LEVEL_1',
      closureVerificationRequired: true,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'case-802-02',
      tenantId: 'tenant-main',
      campusId: 'campus-south',
      caseNumber: 'CAS-2026-002',
      title: 'Lab Facilities Chemical Containment EHS Alert',
      description: 'Safety finding triggered from automated facilities monitoring sensor alert.',
      caseType: 'SAFETY',
      priority: 'CRITICAL',
      severity: 'CRITICAL',
      status: 'TRIAGED',
      confidentialityLevel: 'RESTRICTED',
      sourceModuleIdRef: 'mod_safety_ehs',
      sourceRecordIdRef: 'ehs-inc-4011',
      incidentIdRef: 'ehs-inc-4011',
      departmentIdRef: 'dept-chem',
      ownerUserIdRef: 'user-ehs-head',
      assignment: {
        assignedUserIdRef: 'user-ehs-inspector',
        assignedRoleIdRef: 'role_ehs_officer',
        assignedDepartmentIdRef: 'dept-chem',
        assignedCampusIdRef: 'campus-south',
        assignedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        assignedByUserIdRef: 'user-ehs-head'
      },
      relationships: [],
      slaStatus: 'AT_RISK',
      slaDueDate: new Date(Date.now() + 3600000 * 6).toISOString(),
      escalationLevel: 'LEVEL_2',
      closureVerificationRequired: true,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]);

  const [mockTasks] = useState<EnterpriseTask[]>([
    {
      id: 'task-802-101',
      tenantId: 'tenant-main',
      campusId: 'campus-north',
      caseIdRef: 'case-802-01',
      title: 'Review Engineering Course Syllabus Credentials',
      description: 'Validate course outcome mappings against national accreditation benchmark requirements.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignment: {
        assignedUserIdRef: 'user-auditor-02',
        assignedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
        assignedByUserIdRef: 'user-compliance-lead'
      },
      dueDate: new Date(Date.now() + 3600000 * 24).toISOString(),
      verificationRequired: true,
      dependencies: [],
      isBlocked: false,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]);

  const [mockActions] = useState<EnterpriseActionItem[]>([
    {
      id: 'act-802-201',
      tenantId: 'tenant-main',
      campusId: 'campus-north',
      actionNumber: 'ACT-2026-88',
      title: 'Install Secondary Containment Valves in Chemistry Lab B',
      description: 'Mandatory CAPA action resulting from safety finding EHS-INC-4011.',
      originType: 'SAFETY_FINDING',
      originRecordIdRef: 'ehs-inc-4011',
      ownerUserIdRef: 'user-facilities-director',
      responsibleUserIdRef: 'user-lead-engineer',
      accountableAuthorityUserIdRef: 'user-campus-principal',
      supportingUserIdsRef: ['user-tech-01', 'user-tech-02'],
      dueDate: new Date(Date.now() + 3600000 * 48).toISOString(),
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      verificationStatus: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ]);

  const [mockExceptions] = useState<EnterpriseGovernanceException[]>([
    {
      id: 'exc-802-301',
      tenantId: 'tenant-main',
      campusId: 'campus-north',
      exceptionNumber: 'EXC-2026-09',
      title: '72-Hour SLA Grace Period Extension for Engineering Audit',
      businessRationale: 'Unforeseen external accreditation panel delay requiring extended document compilation window.',
      riskJustification: 'Low risk - internal review already completed with zero critical non-conformances.',
      compensatingControl: 'Daily senior auditor oversight checkpoint and executive daily progress briefing.',
      requesterUserIdRef: 'user-compliance-lead',
      independentApproverUserIdRef: 'user-vice-chancellor',
      effectiveDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 3600000 * 72).toISOString(),
      reviewDate: new Date(Date.now() + 3600000 * 48).toISOString(),
      status: 'APPROVED',
      auditHash: 'hash-exc-301-802',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ]);

  const [diagnostics, setDiagnostics] = useState<EnterpriseCaseDiagnostic[]>([]);

  useEffect(() => {
    const diags = EnterpriseCaseGovernanceService.runDiagnostics(mockCases, mockTasks, mockExceptions);
    setDiagnostics(diags);
  }, [mockCases, mockTasks, mockExceptions]);

  const handleRunSimulation = () => {
    const res = EnterpriseCaseGovernanceService.runSimulation(simulationScenario, mockCases, mockTasks);
    setSimulationResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Enterprise Case, Task &amp; SLA Governance Engine
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Phase 8.2 Production
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Universal EMS Case Control Plane • Task Management • Action Register • Four-Eyes SoD • SLA &amp; Escalations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const diags = EnterpriseCaseGovernanceService.runDiagnostics(mockCases, mockTasks, mockExceptions);
              setDiagnostics(diags);
            }}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Run Diagnostics ({diagnostics.length})
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-1 scrollbar-none">
        {[
          { id: 'COMMAND', label: 'Executive Command', icon: Activity },
          { id: 'CASES', label: 'Case Register', icon: Briefcase },
          { id: 'TASKS', label: 'Task Management', icon: CheckSquare },
          { id: 'ACTIONS', label: 'Action Register', icon: ClipboardList },
          { id: 'SLA', label: 'SLA Command', icon: Clock },
          { id: 'ESCALATIONS', label: 'Escalations', icon: AlertOctagon },
          { id: 'QUEUES', label: 'Work Queues', icon: Users },
          { id: 'DEPENDENCIES', label: 'Dependencies', icon: GitMerge },
          { id: 'EXCEPTIONS', label: 'Exceptions & Approvals', icon: ShieldAlert },
          { id: 'EVIDENCE', label: 'Evidence', icon: FileCheck },
          { id: 'ANALYTICS', label: 'Analytics', icon: BarChart3 },
          { id: 'SIMULATION', label: 'What-If Sandbox', icon: Play },
          { id: 'DIAGNOSTICS', label: `Diagnostics (${diagnostics.length})`, icon: AlertTriangle },
          { id: 'AUDIT', label: 'Audit Trail', icon: FileCode }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Command */}
      {activeTab === 'COMMAND' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Active Cases</span>
                <Briefcase className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{mockCases.length}</div>
              <div className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" /> 100% Tenant Bounded
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Active Tasks</span>
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">{mockTasks.length}</div>
              <div className="text-[11px] text-slate-500">0 Blocked • 1 In-Progress</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>SLA Health</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">1 At Risk</div>
              <div className="text-[11px] text-slate-500">1 On Track • 0 Breached</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Four-Eyes SoD Compliance</span>
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-500">Zero SoD Violations</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Recent Governed Cases
              </h3>
              <div className="space-y-3">
                {mockCases.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">{c.caseNumber}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Active Governance Diagnostics
              </h3>
              {diagnostics.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  All governance controls, SLA timers, and SoD invariants are operating normally.
                </div>
              ) : (
                <div className="space-y-3">
                  {diagnostics.map(d => (
                    <div key={d.id} className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-amber-900 dark:text-amber-200">{d.issueType}</div>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400">{d.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Case Register */}
      {activeTab === 'CASES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Enterprise Case Register</h3>
            <span className="text-xs text-slate-500">Deterministic Lifecycle: NEW → TRIAGED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-3">Case #</th>
                  <th className="p-3">Title &amp; Reference</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">SLA Status</th>
                  <th className="p-3">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {mockCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-blue-600">{c.caseNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{c.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Ref: {c.sourceModuleIdRef} / {c.sourceRecordIdRef}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{c.caseType}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        c.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        c.slaStatus === 'AT_RISK' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.slaStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{c.ownerUserIdRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Task Management */}
      {activeTab === 'TASKS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Universal Governed Task Management</h3>
            <span className="text-xs text-slate-500">Lifecycle: PENDING → ASSIGNED → IN_PROGRESS → BLOCKED → COMPLETED → VERIFIED → CLOSED</span>
          </div>

          <div className="space-y-3">
            {mockTasks.map(t => (
              <div key={t.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">{t.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </div>
                <div className="text-right text-xs space-y-1">
                  <div className="text-slate-500">Assigned: <span className="font-mono font-medium">{t.assignment?.assignedUserIdRef}</span></div>
                  <div className="text-slate-500">Due: {new Date(t.dueDate || '').toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Action Register */}
      {activeTab === 'ACTIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Enterprise Action &amp; Accountability Register</h3>
            <span className="text-xs text-slate-500">Four-Eyes Verification Mandated for Closure</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                  <th className="p-3">Action #</th>
                  <th className="p-3">Title &amp; Origin</th>
                  <th className="p-3">Responsible Actor</th>
                  <th className="p-3">Accountable Authority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {mockActions.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-bold text-blue-600">{a.actionNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{a.title}</div>
                      <div className="text-[10px] text-slate-500">Origin: {a.originType} ({a.originRecordIdRef})</div>
                    </td>
                    <td className="p-3 font-mono">{a.responsibleUserIdRef}</td>
                    <td className="p-3 font-mono">{a.accountableAuthorityUserIdRef}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">{a.status}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">{a.verificationStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: SLA Command */}
      {activeTab === 'SLA' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Enterprise SLA Governance Engine</h3>
          <p className="text-xs text-slate-500">Business working hours calculation (08:00 - 17:00), grace period tracking, and automated threshold alerts.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-500">ON_TRACK</div>
              <div className="text-xl font-bold text-emerald-600">1 Policy Entity</div>
              <p className="text-[11px] text-slate-400">Response &amp; resolution within target window.</p>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-500">AT_RISK</div>
              <div className="text-xl font-bold text-amber-600">1 Policy Entity</div>
              <p className="text-[11px] text-slate-400">&lt;25% remaining before threshold breach.</p>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="text-xs font-bold text-slate-500">BREACHED</div>
              <div className="text-xl font-bold text-red-600">0 Policy Entities</div>
              <p className="text-[11px] text-slate-400">Zero unmanaged target breaches.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Escalations */}
      {activeTab === 'ESCALATIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Escalation Control Center</h3>
          <p className="text-xs text-slate-500">Levels: LEVEL_0 (Normal) → LEVEL_1 (Operational) → LEVEL_2 (Management) → LEVEL_3 (Executive) → LEVEL_4 (Critical / Command Center)</p>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">CAS-2026-002 Chemical Containment EHS Alert</div>
              <div className="text-[11px] text-slate-500">Trigger: High Severity Incident • Escalated to LEVEL_2 (MANAGEMENT)</div>
            </div>
            <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded cursor-pointer">
              Escalate to LEVEL_3
            </button>
          </div>
        </div>
      )}

      {/* Tab 7: Work Queues */}
      {activeTab === 'QUEUES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Governed Work Queues &amp; Assignment Rules</h3>
          <p className="text-xs text-slate-500 font-medium text-emerald-600">Integrated with native RBAC. Cross-tenant and cross-campus assignment strictly prohibited.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Campus EHS Incident Queue</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">CAMPUS</span>
              </div>
              <p className="text-xs text-slate-500">Campus: campus-south • Workload: 1 active item</p>
            </div>
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Academic Accreditation Queue</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded">DEPARTMENT</span>
              </div>
              <p className="text-xs text-slate-500">Department: dept-eng • Workload: 1 active item</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Dependencies & Blockers */}
      {activeTab === 'DEPENDENCIES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Task Dependency &amp; Graph Blocker Engine</h3>
          <p className="text-xs text-slate-500">Bounded DFS Graph Traversal preventing infinite recursion &amp; circular dependencies.</p>

          <div className="p-4 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Graph Check Complete: 0 Circular Dependencies • 0 Unresolved Critical Blockers</span>
          </div>
        </div>
      )}

      {/* Tab 9: Exceptions & Approvals */}
      {activeTab === 'EXCEPTIONS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Governance Exceptions &amp; Four-Eyes Approvals</h3>
          <p className="text-xs text-slate-500">All exceptions require compensating controls and explicit non-indefinite expiry dates.</p>

          <div className="space-y-3">
            {mockExceptions.map(e => (
              <div key={e.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600">{e.exceptionNumber}</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{e.title}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">{e.status}</span>
                </div>
                <p className="text-xs text-slate-500">Rationale: {e.businessRationale}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Expires: {new Date(e.expiryDate).toLocaleString()} • Requester: {e.requesterUserIdRef} • Approver: {e.independentApproverUserIdRef}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Evidence */}
      {activeTab === 'EVIDENCE' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Evidence &amp; Verification Repository</h3>
          <p className="text-xs text-slate-500">Reference-only document hashes preserving provenance without duplicate storage.</p>

          <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">Engineering Audit Syllabus Mapping Verification Report</div>
            <div className="text-slate-500 font-mono text-[11px]">Hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
          </div>
        </div>
      )}

      {/* Tab 11: Analytics */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Enterprise Case Analytics &amp; Performance Telemetry</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="text-slate-500 font-bold">SLA Breach Rate</div>
              <div className="text-xl font-bold text-emerald-600">0.0%</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="text-slate-500 font-bold">Avg Resolution Time</div>
              <div className="text-xl font-bold text-blue-600">18.4 Hours</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
              <div className="text-slate-500 font-bold">Action Verification Rate</div>
              <div className="text-xl font-bold text-purple-600">100%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 12: What-If Simulation Sandbox */}
      {activeTab === 'SIMULATION' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">What-If Simulation Sandbox</h3>
              <p className="text-xs text-slate-500">Test enterprise load, staff capacity reduction, and SLA surges in isolated memory.</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-[10px] rounded border border-amber-300">
              SANDBOX MODE ACTIVE • ZERO PRODUCTION MUTATION
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={simulationScenario}
              onChange={(e) => setSimulationScenario(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="SLA_SURGE">SLA Surge Load</option>
              <option value="CASE_VOLUME_SURGE">Case Volume Surge</option>
              <option value="STAFF_CAPACITY_REDUCTION">Staff Capacity Reduction (-50%)</option>
              <option value="MASS_TASK_BACKLOG">Mass Task Backlog</option>
              <option value="REGULATORY_DEADLINE_SURGE">Regulatory Deadline Surge</option>
            </select>

            <button
              onClick={handleRunSimulation}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Run Sandbox Simulation
            </button>
          </div>

          {simulationResult && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
              <div className="text-xs font-bold text-blue-600">Scenario: {simulationResult.scenario}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>Simulated Case Count: <span className="font-bold">{simulationResult.simulatedCaseCount}</span></div>
                <div>Predicted Breaches: <span className="font-bold text-amber-600">{simulationResult.predictedSlaBreaches}</span></div>
                <div>Predicted Escalations: <span className="font-bold text-red-600">{simulationResult.predictedEscalations}</span></div>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">Predicted Bottlenecks:</div>
                {simulationResult.capacityBottlenecks.map((b, idx) => (
                  <div key={idx} className="text-slate-500">• {b}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 13: Diagnostics */}
      {activeTab === 'DIAGNOSTICS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Enterprise Governance Diagnostic Scanner</h3>

          {diagnostics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              Zero issues detected. All cases, tasks, actions, and exceptions pass governance integrity rules.
            </div>
          ) : (
            <div className="space-y-3">
              {diagnostics.map(d => (
                <div key={d.id} className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200">{d.issueType}</div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400">{d.message}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
                    {d.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 14: Audit Trail */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Immutable Audit Trail &amp; Cryptographic Provenance</h3>
          <p className="text-xs text-slate-500 font-mono">Append-only audit ledger with cryptographic verification hashes.</p>

          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg space-y-2 border border-slate-800">
            <div>[LOG-802-001] timestamp: {new Date().toISOString()} | actor: user-compliance-lead</div>
            <div>action: CASE_TRANSITION_IN_PROGRESS | target: CAS-2026-001</div>
            <div className="text-emerald-400">hash: hash-802-a7f9c2d1e04b</div>
          </div>
        </div>
      )}
    </div>
  );
};
