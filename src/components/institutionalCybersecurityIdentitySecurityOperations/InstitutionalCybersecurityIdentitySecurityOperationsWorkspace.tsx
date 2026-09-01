/**
 * EMS Phase 11.21: Institutional Cybersecurity, Identity, Access, Security Operations Workspace
 */

import React, { useState } from 'react';
import {
  InstitutionalCybersecurityIdentitySecurityOperationsService,
  TestResult
} from '../../services/institutionalCybersecurityIdentitySecurityOperationsService';
import { Badge } from '../common/Badge';
import {
  Shield,
  ShieldAlert,
  Key,
  Users,
  AlertOctagon,
  Lock,
  Play,
  CheckCircle,
  Database
} from 'lucide-react';

export const InstitutionalCybersecurityIdentitySecurityOperationsWorkspace: React.FC = () => {
  const service = InstitutionalCybersecurityIdentitySecurityOperationsService.getInstance();
  const tenantId = 'tenant-main';

  const [activeTab, setActiveTab] = useState<'command' | 'identities' | 'pam' | 'incidents' | 'diagnostics' | 'audit' | 'sandbox' | 'verification'>('command');
  
  const [actorUser, setActorUser] = useState('usr-ciso-01');

  const [verificationResults, setVerificationResults] = useState<TestResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const identities = service.getIdentities(tenantId);
  const privilegedRequests = service.getPrivilegedRequests(tenantId);
  const incidents = service.getIncidents(tenantId);
  const alerts = service.getAlerts(tenantId);
  const vulnerabilities = service.getVulnerabilities(tenantId);
  const auditEvents = service.getAuditEvents(tenantId);
  const diagnostics = service.runDiagnostics(tenantId);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResults(service.runPhase1121VerificationSuite(tenantId, 'campus-north'));
      setIsVerifying(false);
    }, 400);
  };
  
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Cybersecurity &amp; Identity Ops
              </h1>
              <Badge variant="danger" size="sm">Phase 11.21</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authoritative engine for SecOps, IAM, Privileged Access, and Incident Response.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <select
              value={actorUser}
              onChange={(e) => setActorUser(e.target.value)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <option value="usr-ciso-01">CISO (usr-ciso-01)</option>
              <option value="usr-sec-analyst">SOC Analyst (usr-sec-analyst)</option>
              <option value="usr-iam-admin">IAM Admin (usr-iam-admin)</option>
            </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'command', label: 'Command Center', icon: Shield },
          { id: 'identities', label: 'Identity Registry', icon: Users },
          { id: 'pam', label: 'Privileged Access', icon: Key },
          { id: 'incidents', label: 'Sec Incidents & Alerts', icon: AlertOctagon },
          { id: 'diagnostics', label: 'Diagnostics', icon: Database },
          { id: 'audit', label: 'Audit Chain', icon: Lock },
          { id: 'sandbox', label: 'Sandbox', icon: Play },
          { id: 'verification', label: 'ADV Suite (50 Tests)', icon: CheckCircle }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === t.id ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'command' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Active Identities</p>
                <p className="text-2xl font-extrabold mt-1">{identities.filter(i => i.status === 'ACTIVE').length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Open Sec Incidents</p>
                <p className="text-2xl font-extrabold mt-1 text-rose-600">{incidents.filter(i => i.status !== 'CLOSED').length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Active Alerts</p>
                <p className="text-2xl font-extrabold mt-1 text-amber-600">{alerts.filter(a => a.status === 'NEW' || a.status === 'ESCALATED').length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Critical Vulns</p>
                <p className="text-2xl font-extrabold mt-1 text-rose-600">{vulnerabilities.filter(v => v.severity === 'CRITICAL' && v.status === 'OPEN').length}</p>
             </div>
          </div>
        )}

        {activeTab === 'identities' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Identity Registry</h3>
                <div className="space-y-3">
                    {identities.map(i => (
                        <div key={i.identityId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">{i.sourceUserIdRef}</p>
                                <p className="text-2xs text-slate-500 mt-1">MFA: {i.mfaEnabled ? 'Enrolled' : 'Disabled'} | Last Updated: {new Date(i.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <Badge variant={i.status === 'ACTIVE' ? 'success' : 'danger'}>{i.status}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'pam' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Privileged Access Requests (PAM)</h3>
                <div className="space-y-3">
                    {privilegedRequests.map(r => (
                        <div key={r.requestId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">Role: {r.requestedRoleId}</p>
                                <p className="text-2xs text-slate-500 mt-1">Identity: {r.identityIdRef} | Duration: {r.durationMinutes}m | Status: {r.status}</p>
                            </div>
                            <button onClick={() => {
                                try { service.approvePrivilegedRequest(r.requestId, actorUser); alert('Approved'); } catch(e:any) { alert(e.message); }
                            }} className="px-3 py-1 bg-red-600 text-white text-2xs font-bold rounded">Approve (4-Eyes)</button>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {activeTab === 'incidents' && (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                    <h3 className="text-sm font-bold mb-4">Security Incidents</h3>
                    <div className="space-y-3">
                        {incidents.map(i => (
                            <div key={i.incidentId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                                <div>
                                    <p className="text-xs font-bold">{i.title}</p>
                                    <p className="text-2xs text-slate-500 mt-1">Category: {i.category} | Severity: {i.severity}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={i.status === 'CLOSED' ? 'success' : 'danger'}>{i.status}</Badge>
                                    {i.status !== 'CLOSED' && (
                                        <button onClick={() => {
                                            try { service.closeSecurityIncident(i.incidentId, actorUser); alert('Closed'); } catch(e:any) { alert(e.message); }
                                        }} className="px-3 py-1 bg-slate-200 text-slate-800 text-2xs font-bold rounded">Close</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold mb-4">Diagnostics Engine</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnostics.map(d => (
                <div key={d.invariantCode} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-xs font-bold">{d.invariantCode} {d.title}</p>
                    <p className="text-2xs text-slate-500 mt-1">{d.message}</p>
                  </div>
                  <Badge variant={d.status === 'PASS' ? 'success' : d.status === 'WARNING' ? 'warning' : 'danger'}>{d.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold mb-4">Audit Chain</h3>
            <div className="space-y-2">
                {auditEvents.map(e => (
                    <div key={e.eventId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
                        <p>{e.action} on {e.entityType}</p>
                        <p className="text-2xs text-slate-500 truncate">Hash: {e.currentHash}</p>
                    </div>
                ))}
            </div>
          </div>
        )}
        
        {activeTab === 'sandbox' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Sandbox (Zero Mutation)</h3>
                <button onClick={() => setSandboxResult(service.runSandboxSimulation(tenantId, 'CREDENTIAL_COMPROMISE_SURGE'))} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded">Run Threat Simulation</button>
                {sandboxResult && (
                    <div className="mt-4 p-4 border rounded bg-slate-50">
                        <p className="font-bold">{sandboxResult.title}</p>
                        <p className="text-xs mt-1">{sandboxResult.description}</p>
                        <p className="text-xs text-amber-600 mt-1">Impact: {sandboxResult.impactScore}/10</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Verification Suite (ADV-11.21-01 to ADV-11.21-50)</h3>
              <button onClick={handleRunVerification} disabled={isVerifying} className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold disabled:opacity-50">
                {isVerifying ? 'Running...' : 'Run 50 Tests'}
              </button>
            </div>
            {verificationResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {verificationResults.map(r => (
                  <div key={r.id} className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div>
                      <p className="font-bold font-mono text-red-600">{r.id} <span className="text-slate-800">{r.title}</span></p>
                      <p className="text-2xs text-slate-500 mt-1">{r.description}</p>
                    </div>
                    <Badge variant={r.status === 'PASS' ? 'success' : 'danger'}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
