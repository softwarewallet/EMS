/**
 * EMS Phase 11.16: Institutional Legal, Compliance, Risk, Governance & Policy Operations Workspace
 * High-density enterprise workspace with 16 core management tabs, diagnostics, sandbox, and verification suite.
 */

import React, { useState } from 'react';
import {
  InstitutionalLegalComplianceRiskGovernanceService,
  TestResult
} from '../../services/institutionalLegalComplianceRiskGovernanceService';
import { Badge } from '../common/Badge';
import {
  Scale,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Users,
  Activity,
  CheckCircle2,
  XCircle,
  Play,
  Plus,
  Lock,
  Database,
  Server,
  Layers,
  Award,
  Clock,
  Search
} from 'lucide-react';

export const InstitutionalLegalComplianceRiskGovernanceWorkspace: React.FC = () => {
  const service = InstitutionalLegalComplianceRiskGovernanceService.getInstance();
  const tenantId = 'tenant-main';

  const [activeTab, setActiveTab] = useState<
    | 'command'
    | 'matters'
    | 'cases'
    | 'obligations'
    | 'controls'
    | 'risks'
    | 'policies'
    | 'governance'
    | 'investigations'
    | 'submissions'
    | 'exceptions'
    | 'cofs'
    | 'diagnostics'
    | 'audit'
    | 'sandbox'
    | 'verification'
  >('command');

  // Interactive state
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseForum, setNewCaseForum] = useState('');
  const [newCasePlaintiff, setNewCasePlaintiff] = useState('');
  const [newCaseDefendant, setNewCaseDefendant] = useState('');
  const [actorUser, setActorUser] = useState('usr-admin-01');
  const [approverUser, setApproverUser] = useState('usr-counsel-01');

  // Sandbox state
  const [selectedScenario, setSelectedScenario] = useState<any>('REGULATORY_DEADLINE_SURGE');
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Verification Suite state
  const [verificationResults, setVerificationResults] = useState<TestResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const matters = service.getLegalMatters(tenantId);
  const cases = service.getLegalCases(tenantId);
  const obligations = service.getObligations(tenantId);
  const controls = service.getControls(tenantId);
  const risks = service.getRisks(tenantId);
  const policies = service.getPolicies(tenantId);
  const bodies = service.getGovernanceBodies(tenantId);
  const meetings = service.getGovernanceMeetings(tenantId);
  const decisions = service.getGovernanceDecisions(tenantId);
  const investigations = service.getInvestigations(tenantId);
  const submissions = service.getRegulatorySubmissions(tenantId);
  const exceptions = service.getExceptions(tenantId);
  const cofs = service.getConflictsOfInterests(tenantId);
  const auditEvents = service.getAuditEvents(tenantId);
  const diagnostics = service.runDiagnostics(tenantId);

  const handleRegisterCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseNumber || !newCaseForum) return;
    try {
      service.registerLegalCase(
        tenantId,
        'campus-north',
        matters[0]?.matterId || 'mat-001',
        newCaseNumber,
        newCaseForum,
        newCasePlaintiff || 'University',
        newCaseDefendant || 'Respondent',
        actorUser,
        'idemp-' + Date.now()
      );
      setNewCaseNumber('');
      setNewCaseForum('');
      setNewCasePlaintiff('');
      setNewCaseDefendant('');
      alert('Legal case registered successfully.');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const runSandbox = () => {
    const res = service.runSandboxSimulation(tenantId, selectedScenario);
    setSandboxResult(res);
  };

  const runVerificationSuite = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const res = service.runPhase1116VerificationSuite(tenantId, 'campus-north');
      setVerificationResults(res);
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Institutional Legal, Compliance, Risk, Governance &amp; Policy Operations
              </h1>
              <Badge variant="primary" size="sm">Phase 11.16 Authoritative</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Authoritative operational engine for institutional legal matters, regulatory obligations, compliance controls, institutional risk register, governance decisions, and immutable audit provenance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="text-2xs font-bold text-slate-400 uppercase">Actor Context</p>
            <select
              value={actorUser}
              onChange={(e) => setActorUser(e.target.value)}
              className="mt-0.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="usr-admin-01">Admin (usr-admin-01)</option>
              <option value="usr-counsel-01">General Counsel (usr-counsel-01)</option>
              <option value="usr-compliance-01">Compliance Dir (usr-compliance-01)</option>
              <option value="usr-risk-01">Risk Officer (usr-risk-01)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'command', label: 'Command Center', icon: Activity },
          { id: 'matters', label: 'Matters & Cases', icon: Briefcase },
          { id: 'obligations', label: 'Obligations', icon: ShieldCheck },
          { id: 'controls', label: 'Controls', icon: Layers },
          { id: 'risks', label: 'Risk Register', icon: AlertTriangle },
          { id: 'policies', label: 'Policies', icon: FileText },
          { id: 'governance', label: 'Governance', icon: Users },
          { id: 'investigations', label: 'Investigations', icon: Search },
          { id: 'submissions', label: 'Submissions', icon: Award },
          { id: 'exceptions', label: 'Exceptions', icon: Clock },
          { id: 'cofs', label: 'Conflicts', icon: Users },
          { id: 'diagnostics', label: 'Diagnostics', icon: Database },
          { id: 'audit', label: 'Audit Chain', icon: Lock },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Play },
          { id: 'verification', label: 'ADV Suite (50 Tests)', icon: Server }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Active Legal Cases</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{cases.length}</p>
                <p className="text-2xs text-emerald-600 mt-2 font-medium">100% Deterministic State Machine</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Compliance Obligations</p>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{obligations.length}</p>
                <p className="text-2xs text-slate-500 mt-2 font-medium">Verified &amp; Monitored</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Institutional Risks</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{risks.length}</p>
                <p className="text-2xs text-slate-500 mt-2 font-medium">Matrix Score Bounds Enforced</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Audit Provenance Hash</p>
                <p className="text-lg font-mono font-extrabold text-purple-600 mt-1 truncate">
                  {auditEvents.length > 0 ? auditEvents[auditEvents.length - 1].currentHash.substring(0, 16) + '...' : '0x0'}
                </p>
                <p className="text-2xs text-slate-500 mt-2 font-medium">{auditEvents.length} Immutable Events</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Legal Case Intake</h3>
                <form onSubmit={handleRegisterCase} className="space-y-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Case Number</label>
                    <input
                      type="text"
                      placeholder="e.g., LC-2026-002"
                      value={newCaseNumber}
                      onChange={(e) => setNewCaseNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-500 uppercase mb-1">Court or Forum</label>
                    <input
                      type="text"
                      placeholder="e.g., District Court"
                      value={newCaseForum}
                      onChange={(e) => setNewCaseForum(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Claimant"
                      value={newCasePlaintiff}
                      onChange={(e) => setNewCasePlaintiff(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Respondent"
                      value={newCaseDefendant}
                      onChange={(e) => setNewCaseDefendant(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Register Legal Case (Idempotent)
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Diagnostic Summary</h3>
                <div className="space-y-3">
                  {diagnostics.slice(0, 4).map((d) => (
                    <div key={d.invariantCode} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.title}</p>
                        <p className="text-2xs text-slate-500">{d.message}</p>
                      </div>
                      <Badge variant={d.status === 'PASS' ? 'success' : 'danger'} size="sm">
                        {d.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matters' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Institutional Legal Matters &amp; Cases</h3>
            <div className="space-y-3">
              {cases.map((c) => (
                <div key={c.caseId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-600">{c.caseNumber}</span>
                      <Badge variant="primary" size="sm">{c.status}</Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{c.courtOrForum}</p>
                    <p className="text-2xs text-slate-500">{c.plaintiffOrClaimant} vs. {c.defendantOrRespondent}</p>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => {
                        try {
                          service.updateLegalCaseStatus(c.caseId, 'CLOSED', 'usr-admin-01');
                          alert('Case closed successfully.');
                        } catch (err: any) {
                          alert('Error: ' + err.message);
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-2xs font-bold rounded-lg cursor-pointer"
                    >
                      Close Case (4-Eyes)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'obligations' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Regulatory Compliance Obligations</h3>
            <div className="space-y-3">
              {obligations.map((o) => (
                <div key={o.obligationId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{o.title}</span>
                      <Badge variant="success" size="sm">{o.status}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">{o.regulatoryAuthority} — {o.jurisdiction}</p>
                  </div>
                  <Badge variant="warning" size="sm">Due: {new Date(o.deadline).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Compliance Control Catalog</h3>
            <div className="space-y-3">
              {controls.map((ctrl) => (
                <div key={ctrl.controlId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-600">{ctrl.controlCode}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ctrl.title}</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">{ctrl.objective}</p>
                  </div>
                  <Badge variant="primary" size="sm">{ctrl.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Institutional Risk Register</h3>
            <div className="space-y-3">
              {risks.map((r) => (
                <div key={r.riskId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.title}</span>
                      <Badge variant="danger" size="sm">{r.severityBand}</Badge>
                      <Badge variant="primary" size="sm">Score: {r.inherentScore}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">{r.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      try {
                        service.acceptRisk(r.riskId, 'usr-risk-officer-02');
                        alert('Risk accepted with 4-eyes separation.');
                      } catch (err: any) {
                        alert('Error: ' + err.message);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-2xs font-bold rounded-lg cursor-pointer"
                  >
                    Accept Risk (4-Eyes)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Institutional Policies &amp; Versions</h3>
            <div className="space-y-3">
              {policies.map((p) => (
                <div key={p.policyId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-blue-600">{p.policyCode}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{p.title}</span>
                      <Badge variant="success" size="sm">{p.currentVersion}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">Category: {p.category}</p>
                  </div>
                  <Badge variant="primary" size="sm">{p.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Governance Bodies &amp; Decisions</h3>
            <div className="space-y-3">
              {decisions.map((d) => (
                <div key={d.decisionId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.title}</span>
                      <Badge variant="success" size="sm">{d.status}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">{d.resolutionText}</p>
                  </div>
                  <span className="text-2xs font-mono text-slate-400">{d.votingSummary}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investigations' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Institutional Investigations</h3>
            <div className="space-y-3">
              {investigations.map((inv) => (
                <div key={inv.investigationId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{inv.title}</span>
                      <Badge variant="danger" size="sm">{inv.classification}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">Lead: {inv.leadInvestigatorUserIdRef} | Conflict Checked: {inv.conflictChecked ? 'Yes' : 'No'}</p>
                  </div>
                  <Badge variant="primary" size="sm">{inv.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Regulatory Submissions</h3>
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub.submissionId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{sub.title}</span>
                      <Badge variant="success" size="sm">{sub.status}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">Regulator: {sub.regulatorName}</p>
                  </div>
                  <Badge variant="warning" size="sm">Deadline: {new Date(sub.deadline).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exceptions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Compliance Exceptions &amp; Waivers</h3>
            <div className="space-y-3">
              {exceptions.map((exc) => (
                <div key={exc.exceptionId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{exc.title}</span>
                      <Badge variant="primary" size="sm">{exc.status}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">Reason: {exc.reason}</p>
                  </div>
                  <Badge variant="danger" size="sm">Expires: {new Date(exc.expiryDate).toLocaleDateString()}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cofs' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Conflict-of-Interest Declarations</h3>
            <div className="space-y-3">
              {cofs.map((cof) => (
                <div key={cof.declarationId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{cof.personUserIdRef} — {cof.relatedEntity}</span>
                      <Badge variant="success" size="sm">{cof.status}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">{cof.natureOfConflict}</p>
                  </div>
                  <p className="text-2xs text-slate-600 font-medium">Mitigation: {cof.mitigationPlan}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Diagnostics Engine (30+ Invariants)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnostics.map((d) => (
                <div key={d.invariantCode} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-blue-600">{d.invariantCode}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.title}</span>
                    </div>
                    <p className="text-2xs text-slate-500 mt-0.5">{d.message}</p>
                  </div>
                  <Badge variant={d.status === 'PASS' ? 'success' : 'danger'} size="sm">{d.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Immutable Cryptographic Audit Chain (SHA-256)</h3>
            <div className="space-y-3 font-mono text-xs">
              {auditEvents.map((evt) => (
                <div key={evt.eventId} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-2xs text-slate-500">
                    <span>ID: {evt.eventId}</span>
                    <span>{new Date(evt.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <Badge variant="primary" size="sm">{evt.action}</Badge>
                    <span>{evt.entityType} ({evt.entityId})</span>
                  </div>
                  <p className="text-2xs text-purple-600 truncate">Hash: {evt.currentHash}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">What-If Sandbox Simulations (Zero Mutation)</h3>
            <div className="flex items-center gap-4">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="REGULATORY_DEADLINE_SURGE">Regulatory Deadline Surge</option>
                <option value="CRITICAL_RISK_ESCALATION">Critical Risk Escalation</option>
                <option value="COMPLIANCE_FAILURE_CASCADE">Compliance Failure Cascade</option>
                <option value="ENTERPRISE_COMPLIANCE_CRISIS">Enterprise Compliance Crisis</option>
              </select>
              <button
                onClick={runSandbox}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Run Simulation
              </button>
            </div>
            {sandboxResult && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{sandboxResult.title}</h4>
                <p className="text-2xs text-slate-600 dark:text-slate-400">{sandboxResult.description}</p>
                <p className="text-2xs font-bold text-amber-600">Simulated Impact Score: {sandboxResult.impactScore}/10</p>
                <div className="mt-2">
                  <p className="text-2xs font-bold text-slate-500 uppercase mb-1">Recommended Actions:</p>
                  <ul className="list-disc list-inside text-2xs text-slate-700 dark:text-slate-300 space-y-1">
                    {sandboxResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Adversarial Verification Suite (ADV-11.16-01 → ADV-11.16-50)</h3>
                <p className="text-2xs text-slate-500 mt-0.5">Executes 50 deterministic adversarial assertions.</p>
              </div>
              <button
                onClick={runVerificationSuite}
                disabled={isVerifying}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                {isVerifying ? 'Running Suite...' : 'Run 50 Tests'}
              </button>
            </div>

            {verificationResults.length > 0 && (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {verificationResults.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-blue-600">{t.id}</span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{t.title}</p>
                        <p className="text-2xs text-slate-500">{t.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xs text-slate-400 font-mono">{t.durationMs}ms</span>
                      <Badge variant={t.status === 'PASS' ? 'success' : 'danger'} size="sm">
                        {t.status}
                      </Badge>
                    </div>
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
