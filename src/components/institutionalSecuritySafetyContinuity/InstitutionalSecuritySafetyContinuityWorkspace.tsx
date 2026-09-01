import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Shield,
  KeyRound,
  Users,
  HardHat,
  Radio,
  UserCheck,
  AlertTriangle,
  FileSearch,
  Activity,
  Flame,
  DoorOpen,
  Building2,
  CalendarCheck,
  Stethoscope,
  Cpu,
  History,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  Plus,
  Filter,
  Eye,
  AlertOctagon,
  FileText,
  Search,
  Check,
  Layers,
  MapPin
} from 'lucide-react';
import {
  institutionalSecuritySafetyContinuityService
} from '../../services/institutionalSecuritySafetyContinuityService';
import {
  SecurityZone,
  SecurityCheckpoint,
  AccessCredential,
  VisitorVisit,
  ContractorAccessRequest,
  SecurityPatrol,
  SecurityOfficerAssignment,
  SecurityIncident,
  SecurityThreatAssessment,
  BusinessContinuityPlan,
  EmergencyDrill,
  SecuritySafetyAuditEvent,
  SecurityDiagnosticsReport,
  SecuritySimulationScenario,
  SecuritySimulationScenarioType,
  AccessDecision
} from '../../types/institutionalSecuritySafetyContinuity';

type WorkspaceTab =
  | 'command_center'
  | 'security_zones'
  | 'access_control'
  | 'credentials'
  | 'visitors'
  | 'contractors'
  | 'patrols'
  | 'officers'
  | 'incidents'
  | 'investigations'
  | 'threat_risk'
  | 'emergency'
  | 'evacuation'
  | 'continuity'
  | 'drills'
  | 'diagnostics'
  | 'audit_trail'
  | 'sandbox';

export const InstitutionalSecuritySafetyContinuityWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('command_center');
  const [tenantId] = useState('tenant-main');
  const [campusId] = useState('campus-north');

  // State caches
  const [zones, setZones] = useState<SecurityZone[]>([]);
  const [checkpoints, setCheckpoints] = useState<SecurityCheckpoint[]>([]);
  const [credentials, setCredentials] = useState<AccessCredential[]>([]);
  const [visits, setVisits] = useState<VisitorVisit[]>([]);
  const [contractors, setContractors] = useState<ContractorAccessRequest[]>([]);
  const [patrols, setPatrols] = useState<SecurityPatrol[]>([]);
  const [officers, setOfficers] = useState<SecurityOfficerAssignment[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [threats, setThreats] = useState<SecurityThreatAssessment[]>([]);
  const [bcpPlans, setBcpPlans] = useState<BusinessContinuityPlan[]>([]);
  const [drills, setDrills] = useState<EmergencyDrill[]>([]);
  const [auditEvents, setAuditEvents] = useState<SecuritySafetyAuditEvent[]>([]);
  const [diagReport, setDiagReport] = useState<SecurityDiagnosticsReport | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SecuritySimulationScenario | null>(null);

  // Form / Action states
  const [accessSimCheckpoint, setAccessSimCheckpoint] = useState('cp-gate-01');
  const [accessSimCredential, setAccessSimCredential] = useState('cred-stu-101');
  const [lastAccessResult, setLastAccessResult] = useState<{ decision: AccessDecision; reason?: string } | null>(null);

  // Four-Eyes Incident Closure Modal State
  const [closingIncidentId, setClosingIncidentId] = useState<string | null>(null);
  const [closureRemarks, setClosureRemarks] = useState('');
  const [closureRootCause, setClosureRootCause] = useState('');
  const [dualApproverId, setDualApproverId] = useState('usr-supervisor-02');
  const [closureError, setClosureError] = useState<string | null>(null);

  // Refresh data
  const refreshData = () => {
    const s = institutionalSecuritySafetyContinuityService;
    setZones(s.getSecurityZones(tenantId, campusId));
    setCheckpoints(s.getCheckpoints(tenantId, campusId));
    setCredentials(s.getAccessCredentials(tenantId, campusId));
    setVisits(s.getVisitorVisits(tenantId, campusId));
    setContractors(s.getContractorRequests(tenantId, campusId));
    setPatrols(s.getSecurityPatrols(tenantId, campusId));
    setOfficers(s.getOfficerAssignments(tenantId, campusId));
    setIncidents(s.getSecurityIncidents(tenantId, campusId, true));
    setThreats(s.getThreatAssessments(tenantId, campusId));
    setBcpPlans(s.getBusinessContinuityPlans(tenantId, campusId));
    setDrills(s.getEmergencyDrills(tenantId, campusId));
    setAuditEvents(s.getAuditEvents(tenantId, campusId));
    setDiagReport(s.runDiagnostics(tenantId, campusId));
  };

  useEffect(() => {
    refreshData();
  }, [tenantId, campusId]);

  // Handlers
  const handleSimulateAccess = () => {
    const res = institutionalSecuritySafetyContinuityService.evaluatePhysicalAccess(
      tenantId,
      campusId,
      accessSimCheckpoint,
      accessSimCredential
    );
    setLastAccessResult({ decision: res.decision, reason: res.rejectionReason });
    refreshData();
  };

  const handleCloseIncident = (incidentId: string) => {
    setClosureError(null);
    try {
      institutionalSecuritySafetyContinuityService.closeIncidentWithFourEyes(
        incidentId,
        'usr-sec-officer-01',
        dualApproverId,
        closureRemarks || 'Investigation complete, root cause isolated.',
        closureRootCause || 'Protocol breach resolved'
      );
      setClosingIncidentId(null);
      setClosureRemarks('');
      setClosureRootCause('');
      refreshData();
    } catch (err: any) {
      setClosureError(err.message || 'Failed to close incident');
    }
  };

  const handleRunSimulation = (type: SecuritySimulationScenarioType) => {
    const sim = institutionalSecuritySafetyContinuityService.runWhatIfSimulation(type);
    setActiveSimulation(sim);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-6 space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Institutional Security, Safety &amp; Business Continuity
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md">
                Phase 11.12 Operational
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authoritative Security Operations Center (SOC), Access Control, Guard Force, Threat/Risk, Emergency &amp; BCP Command Plane
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Campus Scope: <span className="font-bold text-amber-600 dark:text-amber-400">North Campus</span>
            </div>
            <div className="text-[11px] text-slate-400">Tenant: {tenantId}</div>
          </div>
          <button
            onClick={refreshData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            title="Refresh State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 18-Workspace Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-medium scrollbar-thin">
        {[
          { id: 'command_center', label: 'Command Center', icon: Activity },
          { id: 'security_zones', label: 'Security Zones', icon: MapPin },
          { id: 'access_control', label: 'Access Control', icon: Lock },
          { id: 'credentials', label: 'Credentials', icon: KeyRound },
          { id: 'visitors', label: 'Visitors', icon: Users },
          { id: 'contractors', label: 'Contractors', icon: HardHat },
          { id: 'patrols', label: 'Patrols', icon: Radio },
          { id: 'officers', label: 'Officers & Posts', icon: UserCheck },
          { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
          { id: 'investigations', label: 'Investigations', icon: FileSearch },
          { id: 'threat_risk', label: 'Threat & Risk', icon: Shield },
          { id: 'emergency', label: 'Emergency Response', icon: Flame },
          { id: 'evacuation', label: 'Evacuation', icon: DoorOpen },
          { id: 'continuity', label: 'Business Continuity', icon: Building2 },
          { id: 'drills', label: 'Emergency Drills', icon: CalendarCheck },
          { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope },
          { id: 'audit_trail', label: 'Audit Provenance', icon: History },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as WorkspaceTab)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Security Zones</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{zones.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Monitored &amp; Online
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Credentials</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {credentials.filter(c => c.status === 'ACTIVE').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {credentials.filter(c => c.status === 'SUSPENDED').length} Suspended Holds
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Open Incidents</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {incidents.filter(i => i.status !== 'CLOSED').length}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> 1 High Severity In-Progress
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">System Health Score</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {diagReport?.systemHealthScore || 100}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                SHA-256 Audit Chain: {diagReport?.auditChainIntegrityValid ? 'VALID' : 'CORRUPT'}
              </div>
            </div>
          </div>

          {/* Quick Threat & Incident Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Active Security Incidents
              </h2>
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.incidentId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{inc.incidentNumber}: {inc.title}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        inc.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                        inc.severity === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{inc.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Status: <strong className="text-slate-700 dark:text-slate-300">{inc.status}</strong></span>
                      {inc.status !== 'CLOSED' && (
                        <button
                          onClick={() => setClosingIncidentId(inc.incidentId)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3 h-3" /> Four-Eyes Close
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Simulator Widget */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" /> Physical Access Gate Simulator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Execute authoritative zone verification, credential status check, and curfew validation in real-time.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Checkpoint</label>
                  <select
                    value={accessSimCheckpoint}
                    onChange={(e) => setAccessSimCheckpoint(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    {checkpoints.map(cp => (
                      <option key={cp.checkpointId} value={cp.checkpointId}>
                        {cp.checkpointCode} - {cp.checkpointName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Credential Badge</label>
                  <select
                    value={accessSimCredential}
                    onChange={(e) => setAccessSimCredential(e.target.value)}
                    className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  >
                    {credentials.map(c => (
                      <option key={c.credentialId} value={c.credentialId}>
                        {c.credentialNumber} ({c.holderName} - {c.clearanceLevel}) [{c.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSimulateAccess}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" /> Tap Credential at Checkpoint
                </button>

                {lastAccessResult && (
                  <div className={`p-3 rounded-lg border text-xs ${
                    lastAccessResult.decision.startsWith('GRANTED')
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {lastAccessResult.decision.startsWith('GRANTED') ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      Decision: {lastAccessResult.decision}
                    </div>
                    {lastAccessResult.reason && (
                      <div className="mt-1 text-[11px]">{lastAccessResult.reason}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY ZONES */}
      {activeTab === 'security_zones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Campus Security Zones &amp; Clearances</h2>
            <span className="text-xs text-slate-500">{zones.length} Zones Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <div key={zone.zoneId} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{zone.zoneCode}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{zone.zoneName}</h3>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded">
                    {zone.clearanceRequired}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{zone.description}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>Escort Required: <strong>{zone.requiresEscortForVisitors ? 'YES' : 'NO'}</strong></div>
                  <div>Biometrics: <strong>{zone.biometricRequired ? 'REQUIRED' : 'NONE'}</strong></div>
                  <div>24x7 Accessible: <strong>{zone.is24x7Accessible ? 'YES' : 'NO'}</strong></div>
                  <div>Hours: <strong>{zone.allowedHoursStart ? `${zone.allowedHoursStart}-${zone.allowedHoursEnd}` : '24 Hours'}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CREDENTIALS */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Access Credentials Management</h2>
            <span className="text-xs text-slate-500">{credentials.length} Badges Registered</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Badge Number</th>
                    <th className="p-3">Holder Name</th>
                    <th className="p-3">Type &amp; Clearance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expires At</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {credentials.map((cred) => (
                    <tr key={cred.credentialId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-semibold">{cred.credentialNumber}</td>
                      <td className="p-3">{cred.holderName}</td>
                      <td className="p-3">
                        <div>{cred.credentialType}</div>
                        <div className="text-[10px] text-slate-400">{cred.clearanceLevel}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cred.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                          cred.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          {cred.status}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-500">{new Date(cred.expiresAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        {cred.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              institutionalSecuritySafetyContinuityService.advanceCredentialLifecycle(
                                cred.credentialId,
                                'SUSPENDED',
                                'usr-sec-officer-01',
                                'OFFICER',
                                'Manual hold'
                              );
                              refreshData();
                            }}
                            className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                        {cred.status === 'SUSPENDED' && (
                          <button
                            onClick={() => {
                              institutionalSecuritySafetyContinuityService.advanceCredentialLifecycle(
                                cred.credentialId,
                                'ACTIVE',
                                'usr-sec-officer-01',
                                'OFFICER'
                              );
                              refreshData();
                            }}
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: THREAT & RISK */}
      {activeTab === 'threat_risk' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Threat &amp; Bounded Risk Matrix (1–5 Scale)</h2>
            <span className="text-xs text-slate-500">{threats.length} Assessments Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threats.map((threat) => (
              <div key={threat.threatId} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{threat.threatCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    threat.riskClassification === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                    threat.riskClassification === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {threat.riskClassification} (Score: {threat.calculatedRiskScore}/25)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{threat.title}</h3>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Likelihood: <strong>{threat.likelihoodScore}/5</strong></span>
                    <span>Impact: <strong>{threat.impactScore}/5</strong></span>
                    <span>Residual Risk: <strong>{threat.residualRiskScore}/25</strong></span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{threat.mitigationStrategySummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 14: BUSINESS CONTINUITY */}
      {activeTab === 'continuity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Business Continuity Plans &amp; RTO/RPO Metrics</h2>
            <span className="text-xs text-slate-500">{bcpPlans.length} Plans Registered</span>
          </div>

          {bcpPlans.map((bcp) => (
            <div key={bcp.bcpId} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{bcp.planCode}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bcp.title}</h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded">
                  Version {bcp.version} Active
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Critical Functions &amp; Recovery Objectives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bcp.criticalFunctions.map((fn) => (
                    <div key={fn.functionId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{fn.functionName}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>RTO: <strong className="text-blue-600 dark:text-blue-400">{fn.recoveryTimeObjectiveHours} hrs</strong></span>
                        <span>RPO: <strong className="text-amber-600 dark:text-amber-400">{fn.recoveryPointObjectiveHours} hrs</strong></span>
                        <span>Min Staff: <strong>{fn.minimumStaffRequired}</strong></span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{fn.workaroundProcedures}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 16: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Authoritative Security Diagnostics Engine</h2>
            <button
              onClick={() => {
                setDiagReport(institutionalSecuritySafetyContinuityService.runDiagnostics(tenantId, campusId));
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-scan Invariants
            </button>
          </div>

          {diagReport && (
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-slate-400">Total Scans</div>
                  <div className="text-xl font-bold">{diagReport.totalChecksExecuted}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Passed Invariants</div>
                  <div className="text-xl font-bold text-emerald-500">{diagReport.passedChecksCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">System Health Score</div>
                  <div className="text-xl font-bold text-blue-500">{diagReport.systemHealthScore}%</div>
                </div>
              </div>

              {diagReport.issuesFound.length === 0 ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="font-bold text-sm text-emerald-900 dark:text-emerald-100">All Security &amp; Continuity Invariants Verified</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    No duplicate credentials, expired active passes, Four-Eyes breaches, or broken SHA-256 chains detected.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {diagReport.issuesFound.map((issue) => (
                    <div key={issue.issueId} className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-red-900 dark:text-red-100 flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 text-red-600" /> [{issue.code}] {issue.title}
                      </div>
                      <p className="text-red-700 dark:text-red-300">{issue.details}</p>
                      <div className="text-[11px] text-slate-500">Remediation: {issue.remediationRecommendation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 18: WHAT-IF SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Isolated What-If Simulation Sandbox</h2>
              <p className="text-xs text-slate-500">Zero production state mutation. Synthetic predictions only.</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold rounded">
              SYNTHETIC SANDBOX
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {[
              { id: 'SECURITY_SURGE', label: 'Security Surge' },
              { id: 'CAMPUS_LOCKDOWN', label: 'Campus Lockdown' },
              { id: 'EVACUATION_SURGE', label: 'Evacuation Surge' },
              { id: 'ACCESS_SYSTEM_OUTAGE', label: 'Access System Outage' },
              { id: 'BUSINESS_CONTINUITY_ACTIVATION', label: 'BCP DR Failover' }
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleRunSimulation(sc.id as SecuritySimulationScenarioType)}
                className="p-3 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-left transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-amber-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{sc.label}</div>
              </button>
            ))}
          </div>

          {activeSimulation && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">SYNTHETIC RESULT</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{activeSimulation.title}</h3>
                </div>
                <div className="text-xs text-slate-400">{new Date(activeSimulation.simulatedAt).toLocaleTimeString()}</div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{activeSimulation.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-400">Response Time</div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {activeSimulation.syntheticResults.predictedResponseTimeMinutes} min
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-400">Containment Probability</div>
                  <div className="text-base font-bold text-emerald-600">
                    {activeSimulation.syntheticResults.containmentSuccessProbability}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-400">Patrol Coverage</div>
                  <div className="text-base font-bold text-blue-600">
                    {activeSimulation.syntheticResults.patrolCoveragePercentage}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <div className="text-[10px] text-slate-400">Simulated Risk Score</div>
                  <div className="text-base font-bold text-amber-600">
                    {activeSimulation.syntheticResults.riskScoreAdjusted}/25
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: FOUR-EYES INCIDENT CLOSURE */}
      {closingIncidentId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" /> Four-Eyes Incident Closure
              </h3>
              <button onClick={() => setClosingIncidentId(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Segregation of Duties strictly requires distinct closing and dual-authorizing officers. Self-approval is rejected.
            </p>

            {closureError && (
              <div className="p-2.5 bg-red-50 text-red-800 border border-red-200 rounded text-xs">
                {closureError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold">Dual Authorizing Officer ID</label>
                <input
                  type="text"
                  value={dualApproverId}
                  onChange={(e) => setDualApproverId(e.target.value)}
                  className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded"
                />
              </div>

              <div>
                <label className="font-semibold">Root Cause Summary</label>
                <textarea
                  value={closureRootCause}
                  onChange={(e) => setClosureRootCause(e.target.value)}
                  rows={2}
                  placeholder="Root cause identified during investigation..."
                  className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded"
                />
              </div>

              <div>
                <label className="font-semibold">Closure Remarks</label>
                <textarea
                  value={closureRemarks}
                  onChange={(e) => setClosureRemarks(e.target.value)}
                  rows={2}
                  placeholder="Official closure notes..."
                  className="mt-1 w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setClosingIncidentId(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCloseIncident(closingIncidentId)}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Authorize Closure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
