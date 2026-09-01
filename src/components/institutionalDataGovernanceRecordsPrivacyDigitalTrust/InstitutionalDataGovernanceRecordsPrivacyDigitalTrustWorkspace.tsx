/**
 * EMS Phase 11.19: Institutional Data Governance, Records, Information Management, Privacy & Digital Trust Operations Workspace
 */

import React, { useState } from 'react';
import {
  InstitutionalDataGovernanceRecordsPrivacyDigitalTrustService,
  TestResult
} from '../../services/institutionalDataGovernanceRecordsPrivacyDigitalTrustService';
import { Badge } from '../common/Badge';
import {
  Database,
  Search,
  FileArchive,
  Shield,
  Activity,
  Lock,
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const InstitutionalDataGovernanceRecordsPrivacyDigitalTrustWorkspace: React.FC = () => {
  const service = InstitutionalDataGovernanceRecordsPrivacyDigitalTrustService.getInstance();
  const tenantId = 'tenant-main';

  const [activeTab, setActiveTab] = useState<'command' | 'catalog' | 'records' | 'privacy' | 'diagnostics' | 'audit' | 'sandbox' | 'verification'>('command');
  
  const [actorUser, setActorUser] = useState('usr-admin-01');

  const [verificationResults, setVerificationResults] = useState<TestResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const catalog = service.getCatalog(tenantId);
  const issues = service.getIssues(tenantId);
  const records = service.getRecords(tenantId);
  const privacyRequests = service.getPrivacyRequests(tenantId);
  const privacyIncidents = service.getPrivacyIncidents(tenantId);
  const consents = service.getConsents(tenantId);
  const auditEvents = service.getAuditEvents(tenantId);
  const diagnostics = service.runDiagnostics(tenantId);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResults(service.runPhase1119VerificationSuite(tenantId, 'campus-north'));
      setIsVerifying(false);
    }, 400);
  };
  
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Data Gov, Records &amp; Privacy Ops
              </h1>
              <Badge variant="primary" size="sm">Phase 11.19</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authoritative engine for Data Governance, Records Management, Privacy, and Digital Trust.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <select
              value={actorUser}
              onChange={(e) => setActorUser(e.target.value)}
              className="px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold"
            >
              <option value="usr-admin-01">Admin (usr-admin-01)</option>
              <option value="usr-cdo-01">CDO (usr-cdo-01)</option>
              <option value="usr-privacy-01">Privacy Officer (usr-privacy-01)</option>
            </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'command', label: 'Command Center', icon: Activity },
          { id: 'catalog', label: 'Data Catalog & Quality', icon: Search },
          { id: 'records', label: 'Records Management', icon: FileArchive },
          { id: 'privacy', label: 'Privacy Operations', icon: Shield },
          { id: 'diagnostics', label: 'Diagnostics', icon: Database },
          { id: 'audit', label: 'Audit Chain', icon: Lock },
          { id: 'sandbox', label: 'Sandbox', icon: Play },
          { id: 'verification', label: 'ADV Suite (50 Tests)', icon: CheckCircle }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 ${
              activeTab === t.id ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 border border-slate-200 dark:border-slate-800'
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
                <p className="text-2xs font-bold text-slate-400 uppercase">Catalog Assets</p>
                <p className="text-2xl font-extrabold mt-1">{catalog.length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Data Issues</p>
                <p className="text-2xl font-extrabold mt-1 text-amber-600">{issues.filter(i => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Privacy Requests</p>
                <p className="text-2xl font-extrabold mt-1">{privacyRequests.filter(c => c.status !== 'COMPLETED' && c.status !== 'CLOSED').length}</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase">Privacy Incidents</p>
                <p className="text-2xl font-extrabold mt-1 text-rose-600">{privacyIncidents.filter(s => s.status !== 'CLOSED').length}</p>
             </div>
          </div>
        )}

        {activeTab === 'catalog' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Data Catalog</h3>
                <div className="space-y-3">
                    {catalog.map(c => (
                        <div key={c.assetId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">{c.name}</p>
                                <p className="text-2xs text-slate-500 mt-1">Steward: {c.stewardUserIdRef} | Domain: {c.domainIdRef}</p>
                            </div>
                            <Badge variant="primary">{c.classification}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'records' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold mb-4">Records Management</h3>
                <div className="space-y-3">
                    {records.map(r => (
                        <div key={r.recordId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                            <div>
                                <p className="text-xs font-bold">{r.recordType}</p>
                                <p className="text-2xs text-slate-500 mt-1">Source: {r.sourceEntityIdRef} | Status: {r.status}</p>
                            </div>
                            {r.legalHoldReference ? (
                                <Badge variant="danger">LEGAL HOLD</Badge>
                            ) : (
                                <button onClick={() => {
                                    try { service.createDispositionReview(tenantId, r.recordId, 'DELETE', actorUser); alert('Disposition Review Created'); } catch(e:any) { alert(e.message); }
                                }} className="px-3 py-1 bg-indigo-600 text-white text-2xs font-bold rounded">Dispose</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'privacy' && (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                    <h3 className="text-sm font-bold mb-4">Privacy Requests</h3>
                    <div className="space-y-3">
                        {privacyRequests.map(p => (
                            <div key={p.requestId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                                <div>
                                    <p className="text-xs font-bold">{p.requestType}</p>
                                    <p className="text-2xs text-slate-500 mt-1">Subject: {p.dataSubjectIdRef} | Deadline: {new Date(p.deadline).toLocaleDateString()}</p>
                                </div>
                                <Badge variant="warning">{p.status}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-6 shadow-xs">
                    <h3 className="text-sm font-bold mb-4">Privacy Incidents</h3>
                    <div className="space-y-3">
                        {privacyIncidents.map(i => (
                            <div key={i.incidentId} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200">
                                <div>
                                    <p className="text-xs font-bold">Affected Data: {i.affectedDataReference}</p>
                                    <p className="text-2xs text-slate-500 mt-1">Severity: {i.severity} | Status: {i.status}</p>
                                </div>
                                <button onClick={() => {
                                    try { service.closePrivacyIncident(i.incidentId, actorUser); alert('Closed'); } catch(e:any) { alert(e.message); }
                                }} className="px-3 py-1 bg-rose-600 text-white text-2xs font-bold rounded">Close (4-Eyes)</button>
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
                <button onClick={() => setSandboxResult(service.runSandboxSimulation(tenantId, 'MASS_PRIVACY_REQUEST_SURGE'))} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded">Run Simulation</button>
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
              <h3 className="text-sm font-bold">Verification Suite (ADV-11.19-01 to ADV-11.19-50)</h3>
              <button onClick={handleRunVerification} disabled={isVerifying} className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold disabled:opacity-50">
                {isVerifying ? 'Running...' : 'Run 50 Tests'}
              </button>
            </div>
            {verificationResults.length > 0 && (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {verificationResults.map(r => (
                  <div key={r.id} className="flex justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div>
                      <p className="font-bold font-mono text-indigo-600">{r.id} <span className="text-slate-800">{r.title}</span></p>
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
