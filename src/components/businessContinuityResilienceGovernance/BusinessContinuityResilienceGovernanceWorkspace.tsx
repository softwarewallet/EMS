// Institutional Business Continuity, Disaster Recovery, Crisis Management, Emergency Operations & Enterprise Resilience Governance Workspace (Phase 7.71)

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle2,
  Lock,
  Server,
  FileText,
  Users,
  Building,
  Radio,
  Cpu,
  Layers,
  Search,
  Plus,
  RefreshCw,
  Compass,
  Zap,
  CheckSquare,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { Badge } from '../common/Badge';
import {
  ResilienceStrategy,
  BusinessContinuityPlan,
  BusinessImpactAnalysis,
  CriticalService,
  DisasterRecoveryPlan,
  CrisisGovernanceRecord,
  EmergencyOperationsPlan,
  IncidentCommandStructure,
  ResilienceRisk,
  SinglePointOfFailure,
  ThirdPartyContinuityAssessment,
  EmergencyCommunicationGovernance,
  ResilienceException,
  ResilienceAuditEvent,
  BCDiagnosticFinding,
  BCSimulationScenarioType,
  BCSimulationResult
} from '../../types/businessContinuityResilienceGovernance';
import { BusinessContinuityResilienceGovernanceService } from '../../services/businessContinuityResilienceGovernanceService';

export const BusinessContinuityResilienceGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'command'
    | 'strategy'
    | 'bia'
    | 'functions'
    | 'services'
    | 'continuity_plans'
    | 'disaster_recovery'
    | 'recovery_objectives'
    | 'crisis_management'
    | 'emergency_operations'
    | 'incident_command'
    | 'exercises'
    | 'assurance'
    | 'spof'
    | 'third_party'
    | 'workforce'
    | 'technology'
    | 'facilities'
    | 'communications'
    | 'risk'
    | 'sandbox'
    | 'audit'
  >('command');

  const tenantId = 'tenant_demo_01';
  const campusId = 'campus_main_01';

  // State
  const [strategies] = useState<ResilienceStrategy[]>([
    {
      id: 'strat_01',
      tenantId,
      campusId,
      title: 'Enterprise Resilience & Continuous Operation Master Strategy 2026-2030',
      version: '3.0',
      timeHorizon: '2026-2030',
      visionStatement: 'Uninterrupted institutional mission execution through proactive enterprise resilience and zero single-points-of-failure.',
      pillars: [
        { id: 'p_1', name: 'Life Safety & Crisis Preparedness', description: 'Immediate life safety protection and structured incident command.', maturityLevel: 'MANAGED', completionPercentage: 88 },
        { id: 'p_2', name: 'Critical Service Continuity', description: 'Guaranteed continuity for vital academic and research functions.', maturityLevel: 'DEFINED', completionPercentage: 78 },
        { id: 'p_3', name: 'Digital & Cyber Recovery', description: 'Robust immutable backup vaults and rapid cloud failover.', maturityLevel: 'MANAGED', completionPercentage: 92 }
      ],
      status: 'ACTIVE',
      updatedAt: '2026-08-15'
    }
  ]);

  const [bias, setBias] = useState<BusinessImpactAnalysis[]>([
    {
      id: 'bia_01',
      tenantId,
      campusId,
      functionIdRef: 'fn_sis_enrollment',
      lifeSafetyImpact: 'LOW',
      academicImpact: 'CRITICAL',
      researchImpact: 'HIGH',
      financialImpact: 'HIGH',
      regulatoryImpact: 'MEDIUM',
      reputationImpact: 'HIGH',
      criticalityScore: 92,
      recoveryPriority: 'P1_CRITICAL',
      rtoHours: 4,
      rpoHours: 1,
      mtdHours: 12,
      status: 'APPROVED'
    },
    {
      id: 'bia_02',
      tenantId,
      campusId,
      functionIdRef: 'fn_payroll_disbursement',
      lifeSafetyImpact: 'LOW',
      academicImpact: 'LOW',
      researchImpact: 'LOW',
      financialImpact: 'CRITICAL',
      regulatoryImpact: 'CRITICAL',
      reputationImpact: 'HIGH',
      criticalityScore: 95,
      recoveryPriority: 'P1_CRITICAL',
      rtoHours: 8,
      rpoHours: 2,
      mtdHours: 24,
      status: 'APPROVED'
    }
  ]);

  const [criticalServices, setCriticalServices] = useState<CriticalService[]>([
    {
      id: 'srv_01',
      tenantId,
      campusId,
      serviceName: 'Student Information System (Banner SIS)',
      serviceOwnerIdRef: 'usr_registrar_lead',
      technicalDependencyRefs: ['sys_oracle_db', 'sys_auth_sso'],
      vendorDependencyRefs: ['ven_cloud_hosting_corp'],
      continuityStatus: 'PROTECTED',
      resilienceRating: 'STRONG',
      spofDetected: false
    },
    {
      id: 'srv_02',
      tenantId,
      campusId,
      serviceName: 'Enterprise Financial ERP',
      serviceOwnerIdRef: 'usr_cfo_office',
      technicalDependencyRefs: ['sys_erp_db'],
      vendorDependencyRefs: ['ven_erp_saas'],
      continuityStatus: 'PROTECTED',
      resilienceRating: 'ADEQUATE',
      spofDetected: true
    }
  ]);

  const [continuityPlans, setContinuityPlans] = useState<BusinessContinuityPlan[]>([
    {
      id: 'bcp_01',
      tenantId,
      campusId,
      title: 'Registrar Office Continuity & Alternate Operations Plan',
      departmentIdRef: 'dept_registrar',
      ownerIdRef: 'usr_registrar_lead',
      version: '2.1',
      status: 'ACTIVE',
      reviewDate: '2027-01-15',
      updatedAt: '2026-07-20'
    }
  ]);

  const [drPlans, setDrPlans] = useState<DisasterRecoveryPlan[]>([
    {
      id: 'dr_01',
      tenantId,
      campusId,
      title: 'SIS Database Multi-Region Failover & Immutable Backup Recovery Plan',
      systemIdRef: 'sys_oracle_db',
      ownerIdRef: 'usr_cto_office',
      version: '3.0',
      status: 'ACTIVE',
      updatedAt: '2026-08-01'
    }
  ]);

  const [crises, setCrises] = useState<CrisisGovernanceRecord[]>([
    {
      id: 'cri_01',
      tenantId,
      campusId,
      title: 'Electrical Substation Feeder Fault - North Campus',
      severity: 'HIGH',
      lifecycleState: 'CONTAINED',
      commanderIdRef: 'usr_emergency_dir',
      declaredAt: '2026-08-28T09:15:00Z',
      summary: 'Primary electrical feeder tripped due to transformer fault. Emergency generators active.'
    }
  ]);

  const [eops, setEops] = useState<EmergencyOperationsPlan[]>([
    {
      id: 'eop_01',
      tenantId,
      campusId,
      title: 'Institutional All-Hazards Emergency Operations Plan',
      version: '4.2',
      status: 'ACTIVE',
      updatedAt: '2026-01-10'
    }
  ]);

  const [ics, setIcs] = useState<IncidentCommandStructure[]>([
    {
      id: 'ics_01',
      tenantId,
      campusId,
      incidentName: 'North Campus Power Restoration Command',
      commanderIdRef: 'usr_emergency_dir',
      safetyOfficerIdRef: 'usr_safety_lead',
      operationsSectionChiefIdRef: 'usr_facilities_lead',
      planningSectionChiefIdRef: 'usr_bcp_lead',
      logisticsSectionChiefIdRef: 'usr_procurement_lead',
      financeSectionChiefIdRef: 'usr_controller',
      active: true
    }
  ]);

  const [spofs, setSpofs] = useState<SinglePointOfFailure[]>([
    {
      id: 'spof_01',
      tenantId,
      campusId,
      assetIdRef: 'sys_auth_sso',
      assetName: 'Central Enterprise Directory SSO Server',
      assetType: 'Technology Platform',
      impactDescription: 'Total loss of SSO halts access to all online examinations and portals.',
      mitigated: false
    }
  ]);

  const [risks, setRisks] = useState<ResilienceRisk[]>([
    {
      id: 'risk_01',
      tenantId,
      campusId,
      title: 'Single Upstream Power Feeder Dependency for Data Center',
      category: 'Infrastructure',
      likelihood: 'MEDIUM',
      impact: 'CRITICAL',
      riskScore: 10,
      riskLevel: 'HIGH',
      ownerIdRef: 'usr_facilities_dir',
      status: 'OPEN'
    }
  ]);

  const [thirdParties, setThirdParties] = useState<ThirdPartyContinuityAssessment[]>([
    {
      id: 'tp_01',
      tenantId,
      campusId,
      vendorIdRef: 'ven_cloud_hosting_corp',
      vendorName: 'Cloud Hosting Corp Inc.',
      continuityAssessed: true,
      score: 91,
      status: 'APPROVED'
    }
  ]);

  const [comms, setComms] = useState<EmergencyCommunicationGovernance[]>([
    {
      id: 'comm_01',
      tenantId,
      campusId,
      planTitle: 'Emergency Notification & Stakeholder Broadcast Governance Plan',
      channels: ['SMS Alert', 'Email Broadcast', 'Desktop Alert', 'Campus PA'],
      approvedByIdRef: 'usr_comm_dir',
      status: 'ACTIVE'
    }
  ]);

  const [exceptions, setExceptions] = useState<ResilienceException[]>([]);

  // Sandbox Simulation State
  const [selectedScenario, setSelectedScenario] = useState<BCSimulationScenarioType>('MAJOR_CAMPUS_BLACKOUT');
  const [simulationResult, setSimulationResult] = useState<BCSimulationResult | null>(null);

  // Diagnostics & Audit
  const [diagnostics, setDiagnostics] = useState<BCDiagnosticFinding[]>([]);
  const auditLogs = BusinessContinuityResilienceGovernanceService.getAuditLogs(tenantId, campusId);

  const handleRunDiagnostics = () => {
    const res = BusinessContinuityResilienceGovernanceService.runDiagnostics(bias, continuityPlans, criticalServices, spofs, risks);
    setDiagnostics(res);
    BusinessContinuityResilienceGovernanceService.logAudit(tenantId, campusId, 'usr_admin_01', 'RUN_DIAGNOSTICS', 'DIagnostics', 'system', 'SUCCESS', 'Executed institutional resilience diagnostics');
  };

  const handleRunSimulation = () => {
    const res = BusinessContinuityResilienceGovernanceService.runSimulation(selectedScenario, tenantId, campusId);
    setSimulationResult(res);
    BusinessContinuityResilienceGovernanceService.logAudit(tenantId, campusId, 'usr_admin_01', 'RUN_SIMULATION', 'Simulation', selectedScenario, 'SUCCESS', 'Executed resilience what-if simulation sandbox');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              EMS Phase 7.71
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
              Tenant &amp; Campus Secured
            </Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            Institutional Business Continuity, Disaster Recovery &amp; Enterprise Resilience
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comprehensive governance control plane for institutional BCP, DR, crisis management, and emergency operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDiagnostics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Activity className="w-4 h-4" /> Run Diagnostics
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'command', label: 'Command Center', icon: ShieldCheck },
          { id: 'strategy', label: 'Strategy', icon: Compass },
          { id: 'bia', label: 'BIA', icon: TrendingUp },
          { id: 'services', label: 'Critical Services', icon: Server },
          { id: 'continuity_plans', label: 'BCP Plans', icon: FileText },
          { id: 'disaster_recovery', label: 'Disaster Recovery', icon: Cpu },
          { id: 'crisis_management', label: 'Crisis Management', icon: ShieldAlert },
          { id: 'emergency_operations', label: 'Emergency Ops', icon: Radio },
          { id: 'incident_command', label: 'Incident Command', icon: Users },
          { id: 'spof', label: 'SPOF Analysis', icon: AlertTriangle },
          { id: 'third_party', label: 'Third-Party', icon: Building },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Zap },
          { id: 'audit', label: 'Audit Trail', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resilience Maturity</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">84.5 / 100</h3>
                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Managed Tier Active
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Crisis Alerts</p>
                <h3 className="text-3xl font-black text-amber-600 mt-2">{crises.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Contained Substation Fault</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Services</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">{criticalServices.length}</h3>
                <p className="text-xs text-blue-600 font-bold mt-1">100% Protected</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unmitigated SPOFs</p>
                <h3 className="text-3xl font-black text-rose-600 mt-2">{spofs.filter(s => !s.mitigated).length}</h3>
                <p className="text-xs text-rose-500 mt-1">Requires Redundancy Action</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Active Incident Command &amp; EOC Posture</h3>
                <div className="space-y-4">
                  {ics.map(ic => (
                    <div key={ic.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{ic.incidentName}</span>
                        <Badge className="bg-emerald-100 text-emerald-800 font-bold">Active ICS</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div>Commander: <strong>{ic.commanderIdRef}</strong></div>
                        <div>Safety Officer: <strong>{ic.safetyOfficerIdRef}</strong></div>
                        <div>Operations Chief: <strong>{ic.operationsSectionChiefIdRef}</strong></div>
                        <div>Planning Chief: <strong>{ic.planningSectionChiefIdRef}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Diagnostic Findings</h3>
                {diagnostics.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Run diagnostics to evaluate current institutional continuity compliance.</p>
                ) : (
                  <div className="space-y-3">
                    {diagnostics.map(d => (
                      <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{d.title}</span>
                          <Badge variant={d.severity === 'CRITICAL' ? 'destructive' : 'default'}>{d.severity}</Badge>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">{d.description}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">Recommendation: {d.remediationRecommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Institutional Resilience Strategy</h3>
            {strategies.map(s => (
              <div key={s.id} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-base">{s.title}</h4>
                  <Badge className="bg-blue-100 text-blue-800">Horizon: {s.timeHorizon}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{s.visionStatement}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {s.pillars.map(p => (
                    <div key={p.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="font-bold text-xs">{p.name}</div>
                      <p className="text-xs text-slate-500">{p.description}</p>
                      <div className="flex justify-between text-xs font-bold">
                        <span>{p.maturityLevel}</span>
                        <span>{p.completionPercentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bia' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Impact Analysis (BIA) Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="p-3">Function Ref</th>
                    <th className="p-3">Criticality Score</th>
                    <th className="p-3">Recovery Priority</th>
                    <th className="p-3">RTO Target</th>
                    <th className="p-3">RPO Target</th>
                    <th className="p-3">MTD</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {bias.map(b => (
                    <tr key={b.id}>
                      <td className="p-3 font-bold">{b.functionIdRef}</td>
                      <td className="p-3"><Badge className="bg-purple-100 text-purple-800">{b.criticalityScore} / 100</Badge></td>
                      <td className="p-3 font-bold text-rose-600">{b.recoveryPriority}</td>
                      <td className="p-3">{b.rtoHours}h</td>
                      <td className="p-3">{b.rpoHours}h</td>
                      <td className="p-3">{b.mtdHours}h</td>
                      <td className="p-3"><Badge className="bg-emerald-100 text-emerald-800">{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Critical Services Registry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalServices.map(srv => (
                <div key={srv.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">{srv.serviceName}</h4>
                    <Badge className={srv.spofDetected ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}>
                      {srv.spofDetected ? 'SPOF Detected' : 'Protected'}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div>Owner: <strong>{srv.serviceOwnerIdRef}</strong></div>
                    <div>Continuity Status: <span className="font-bold text-blue-600">{srv.continuityStatus}</span></div>
                    <div>Resilience Rating: <span className="font-bold text-emerald-600">{srv.resilienceRating}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'continuity_plans' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Continuity Plans (BCP)</h3>
            <div className="space-y-3">
              {continuityPlans.map(bcp => (
                <div key={bcp.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{bcp.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Department: {bcp.departmentIdRef} | Owner: {bcp.ownerIdRef} | Version: {bcp.version}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 font-bold">{bcp.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'disaster_recovery' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Disaster Recovery (DR) Governance Plans</h3>
            <div className="space-y-3">
              {drPlans.map(dr => (
                <div key={dr.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{dr.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Target System: {dr.systemIdRef} | Owner: {dr.ownerIdRef} | Version: {dr.version}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 font-bold">{dr.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'crisis_management' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crisis Management &amp; Escalation Engine</h3>
            <div className="space-y-3">
              {crises.map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm">{c.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant="destructive">{c.severity}</Badge>
                      <Badge className="bg-amber-100 text-amber-800">{c.lifecycleState}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{c.summary}</p>
                  <p className="text-xs text-slate-400">Commander: {c.commanderIdRef} | Declared: {c.declaredAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emergency_operations' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Emergency Operations Governance</h3>
            <div className="space-y-3">
              {eops.map(e => (
                <div key={e.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{e.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Version: {e.version} | Last Updated: {e.updatedAt}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800">{e.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'incident_command' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Command System (ICS) Structure</h3>
            {ics.map(ic => (
              <div key={ic.id} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-3">
                <h4 className="font-bold text-base">{ic.incidentName}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Incident Commander</span>
                    <strong className="text-slate-900 dark:text-white">{ic.commanderIdRef}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Safety Officer</span>
                    <strong className="text-slate-900 dark:text-white">{ic.safetyOfficerIdRef}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Operations Chief</span>
                    <strong className="text-slate-900 dark:text-white">{ic.operationsSectionChiefIdRef}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Planning Chief</span>
                    <strong className="text-slate-900 dark:text-white">{ic.planningSectionChiefIdRef}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Logistics Chief</span>
                    <strong className="text-slate-900 dark:text-white">{ic.logisticsSectionChiefIdRef}</strong>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block">Finance Chief</span>
                    <strong className="text-slate-900 dark:text-white">{ic.financeSectionChiefIdRef}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'spof' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Single Point of Failure (SPOF) Analysis</h3>
            <div className="space-y-3">
              {spofs.map(s => (
                <div key={s.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{s.assetName}</h4>
                    <p className="text-xs text-slate-500 mt-1">Type: {s.assetType} | Impact: {s.impactDescription}</p>
                  </div>
                  <Badge variant={s.mitigated ? 'outline' : 'destructive'}>{s.mitigated ? 'Mitigated' : 'Unmitigated SPOF'}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'third_party' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Third-Party Supplier Continuity Assessments</h3>
            <div className="space-y-3">
              {thirdParties.map(tp => (
                <div key={tp.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm">{tp.vendorName}</h4>
                    <p className="text-xs text-slate-500 mt-1">Continuity Assessed: {tp.continuityAssessed ? 'Yes' : 'No'} | Score: {tp.score} / 100</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 font-bold">{tp.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 dark:text-amber-300 tracking-wider">
                SIMULATION ONLY &bull; SANDBOX MODE ACTIVE &bull; ZERO PRODUCTION MUTATION
              </span>
              <Badge className="bg-amber-200 text-amber-900 font-bold">Isolated Memory</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Select Disaster Scenario</label>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as BCSimulationScenarioType)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="MAJOR_CAMPUS_BLACKOUT">Major Campus Electrical Grid Blackout</option>
                  <option value="REGIONAL_POWER_FAILURE">Regional Electrical Transmission Collapse</option>
                  <option value="DATA_CENTER_OUTAGE">Primary Data Center Facility Outage</option>
                  <option value="CLOUD_REGION_FAILURE">Cloud Provider Regional Availability Zone Outage</option>
                  <option value="IDENTITY_SERVICE_OUTAGE">Federated Identity &amp; Authentication Provider Failure</option>
                  <option value="NETWORK_CORE_FAILURE">Campus Core Network Switch Cascade Failure</option>
                  <option value="RANSOMWARE_RECOVERY_EVENT">Enterprise Ransomware Outbreak &amp; Storage Encryption</option>
                  <option value="CRITICAL_VENDOR_FAILURE">Major SaaS SIS Vendor Insolvency / Outage</option>
                  <option value="FACILITY_LOSS">Catastrophic Structural Loss of Administration Building</option>
                  <option value="NATURAL_DISASTER">Severe Weather / Hurricane Impact on Campus</option>
                  <option value="PANDEMIC_WORKFORCE_ABSENCE">Severe Biological Health Epidemic &amp; Absenteeism</option>
                  <option value="WATER_SUPPLY_FAILURE">Municipal Water Supply Contamination &amp; Outage</option>
                  <option value="TELECOMMUNICATIONS_OUTAGE">Fiber Optic Cable Cut &amp; Telecom Isolation</option>
                  <option value="MULTI_SYSTEM_CASCADING_FAILURE">Complex Cascading Failure: Power, Network &amp; Identity</option>
                  <option value="MASS_EVACUATION_EVENT">Emergency Campus-Wide Evacuation Incident</option>
                </select>
                <button
                  onClick={handleRunSimulation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm mt-4"
                >
                  <Zap className="w-4 h-4" /> Run What-If Simulation
                </button>
              </div>

              <div className="md:col-span-2 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Simulation Output &amp; Impact Analysis</h4>
                {simulationResult ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Scenario Name:</span>
                      <span className="font-black text-slate-900 dark:text-white">{simulationResult.scenarioName}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{simulationResult.description}</p>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-600">
                      <div>
                        <span className="text-slate-400 block">Service Exposure Score</span>
                        <strong className="text-lg text-amber-600">{simulationResult.serviceExposureScore} / 100</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Estimated Financial Impact</span>
                        <strong className="text-lg text-rose-600">${simulationResult.estimatedImpact.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Recovery Bottlenecks:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-300">
                        {simulationResult.recoveryBottlenecks.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">Mitigation Opportunities:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-emerald-600 dark:text-emerald-400">
                        {simulationResult.mitigationOpportunities.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Select a disaster simulation scenario and click run to analyze recovery exposure.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Immutable Governance Audit Trail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor ID</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity Type</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Cryptographic Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 italic">No audit records in current session memory.</td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="p-3 font-bold">{log.actorId}</td>
                        <td className="p-3 font-mono text-blue-600">{log.action}</td>
                        <td className="p-3">{log.entityType}</td>
                        <td className="p-3"><Badge className="bg-emerald-100 text-emerald-800">{log.outcome}</Badge></td>
                        <td className="p-3 font-mono text-slate-400">{log.currentHash}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
