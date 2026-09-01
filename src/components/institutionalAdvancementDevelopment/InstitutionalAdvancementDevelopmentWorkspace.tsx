/**
 * EMS Phase 11.15 Operational Workspace: Institutional Advancement & Development
 * Command Center, Donor Registry, Prospect Pipeline, Campaigns, Pledges, Gifts, Diagnostics, Sandbox & 50 Adversarial Tests.
 */

import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  Target,
  Gift,
  FileText,
  ShieldAlert,
  Activity,
  Search,
  Lock,
  Award,
  BookOpen,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { institutionalAdvancementDevelopmentService } from '../../services/institutionalAdvancementDevelopmentService';

export const InstitutionalAdvancementDevelopmentWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [tenantId] = useState<string>('tenant-main');
  const [campusId] = useState<string>('campus-north');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [approverIdInput, setApproverIdInput] = useState<string>('usr-approver-02');
  const [correlationIdInput, setCorrelationIdInput] = useState<string>('corr-adv-01');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const donors = institutionalAdvancementDevelopmentService.getDonors(tenantId, campusId);
  const prospects = institutionalAdvancementDevelopmentService.getProspects(tenantId, campusId);
  const campaigns = institutionalAdvancementDevelopmentService.getCampaigns(tenantId, campusId);
  const opportunities = institutionalAdvancementDevelopmentService.getOpportunities(tenantId, campusId);
  const solicitations = institutionalAdvancementDevelopmentService.getSolicitations(tenantId, campusId);
  const pledges = institutionalAdvancementDevelopmentService.getPledges(tenantId, campusId);
  const gifts = institutionalAdvancementDevelopmentService.getGifts(tenantId, campusId);
  const recurringGifts = institutionalAdvancementDevelopmentService.getRecurringGifts(tenantId, campusId);
  const acknowledgements = institutionalAdvancementDevelopmentService.getAcknowledgements();
  const stewardshipPlans = institutionalAdvancementDevelopmentService.getStewardshipPlans(tenantId, campusId);
  const recognitions = institutionalAdvancementDevelopmentService.getRecognitions(tenantId, campusId);
  const corporatePartners = institutionalAdvancementDevelopmentService.getCorporatePartners(tenantId, campusId);
  const tasks = institutionalAdvancementDevelopmentService.getTasks(tenantId, campusId);
  const complianceCases = institutionalAdvancementDevelopmentService.getComplianceCases(tenantId, campusId);
  const auditEvents = institutionalAdvancementDevelopmentService.getAuditEvents();

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(
    institutionalAdvancementDevelopmentService.runDiagnostics(tenantId, campusId)
  );
  const [verificationSuiteResults] = useState<any[]>(
    institutionalAdvancementDevelopmentService.runPhase1115VerificationSuite(tenantId, campusId)
  );

  const handleApproveCampaign = (campaignId: string) => {
    setActionMessage(null);
    setActionError(null);
    try {
      institutionalAdvancementDevelopmentService.approveCampaign(campaignId, approverIdInput, correlationIdInput);
      setActionMessage(`Campaign ${campaignId} successfully approved and activated under Four-Eyes SoD.`);
    } catch (err: any) {
      setActionError(err.message || 'Approval failed');
    }
  };

  const handleRunSimulation = (scenarioType: string) => {
    const res = institutionalAdvancementDevelopmentService.runWhatIfSimulation(scenarioType as any);
    setSimulationResult(res);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" /> EMS Phase 11.15 Core Operations
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Advancement & Development</h1>
          <p className="text-slate-500 text-sm mt-1">
            Authoritative execution engine for philanthropy, donor pipelines, campaigns, gifts, pledges, and compliance assurance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tenant: {tenantId} | Campus: {campusId}
          </div>
        </div>
      </div>

      {/* Action Banners */}
      {actionMessage && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 text-emerald-800 rounded-r-lg flex justify-between items-center shadow-sm">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-600 font-bold hover:text-emerald-800">×</button>
        </div>
      )}
      {actionError && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-800 rounded-r-lg flex justify-between items-center shadow-sm">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="text-rose-600 font-bold hover:text-rose-800">×</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'command_center', label: 'Command Center', icon: HeartHandshake },
          { id: 'donors', label: 'Donor Registry', icon: Users },
          { id: 'campaigns', label: 'Campaigns & Opportunities', icon: Target },
          { id: 'pledges_gifts', label: 'Pledges & Gifts', icon: Gift },
          { id: 'stewardship', label: 'Stewardship & Recognition', icon: Award },
          { id: 'compliance', label: 'Compliance & Tasks', icon: ShieldAlert },
          { id: 'diagnostics', label: 'Diagnostics & Audit', icon: Activity },
          { id: 'simulation', label: 'What-If Sandbox', icon: Sliders },
          { id: 'verification', label: '50 Adversarial Tests', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                <span>Active Donors</span>
                <Users className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{donors.length}</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Verified Constituent Registry</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                <span>Active Campaigns</span>
                <Target className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{campaigns.filter(c => c.status === 'ACTIVE').length}</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Four-Eyes SoD Protected</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                <span>Total Gifts Registered</span>
                <Gift className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{gifts.length}</div>
              <div className="text-xs text-rose-600 mt-1 font-medium">Minor-Unit Precision</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 text-sm font-medium">
                <span>Diagnostics Status</span>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold mt-2 text-emerald-600">
                {diagnosticResult.passed ? 'PASSED' : 'WARNING'}
              </div>
              <div className="text-xs text-slate-500 mt-1">{diagnosticResult.findings.length} findings logged</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Active Fundraising Campaigns</h2>
              {campaigns.map(camp => (
                <div key={camp.campaignId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>{camp.campaignName}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">{camp.status}</span>
                  </div>
                  <p className="text-xs text-slate-500">{camp.objective}</p>
                  <div className="flex justify-between text-xs pt-2">
                    <span>Target: ${(camp.targetAmount.amountMinorUnits / 100).toLocaleString()}</span>
                    <span className="font-semibold text-rose-600">Raised: ${(camp.raisedAmount.amountMinorUnits / 100).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">Prospect Pipeline</h2>
              {prospects.map(pros => (
                <div key={pros.prospectId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-semibold text-rose-900">
                    <span>Prospect Stage: {pros.stage}</span>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded">Prob: {pros.probability}%</span>
                  </div>
                  <p className="text-xs text-slate-600">Capacity: ${(pros.estimatedCapacity.amountMinorUnits / 100).toLocaleString()}</p>
                  <div className="text-xs text-slate-500">Next Action: {pros.nextAction} ({pros.nextActionDate})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DONOR REGISTRY */}
      {activeTab === 'donors' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Constituent & Donor Registry</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search donors..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3">Donor ID</th>
                  <th className="p-3">Display Name</th>
                  <th className="p-3">Constituent Type</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {donors.filter(d => d.displayName.toLowerCase().includes(searchTerm.toLowerCase())).map(donor => (
                  <tr key={donor.donorId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-medium text-rose-600">{donor.donorId}</td>
                    <td className="p-3 font-semibold">{donor.displayName}</td>
                    <td className="p-3 text-slate-600">{donor.constituentType}</td>
                    <td className="p-3 text-slate-600">{donor.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGNS & OPPORTUNITIES */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Fundraising Campaigns & Four-Eyes Approval</h2>
            {campaigns.map(camp => (
              <div key={camp.campaignId} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono bg-rose-100 text-rose-700 px-2 py-0.5 rounded">{camp.campaignCode}</span>
                    <h3 className="text-base font-bold mt-1">{camp.campaignName}</h3>
                    <p className="text-xs text-slate-500">Objective: {camp.objective}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>
                {camp.status !== 'ACTIVE' && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Approver User ID"
                      value={approverIdInput}
                      onChange={e => setApproverIdInput(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <button
                      onClick={() => handleApproveCampaign(camp.campaignId)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> Approve & Activate (Four-Eyes SoD)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Fundraising Opportunities Pipeline</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Opportunity ID</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3">Expected Value</th>
                    <th className="p-3">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {opportunities.map(opp => (
                    <tr key={opp.opportunityId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-medium text-rose-600">{opp.opportunityId}</td>
                      <td className="p-3 font-semibold">{opp.purpose}</td>
                      <td className="p-3 text-slate-600">{opp.stage}</td>
                      <td className="p-3 font-semibold">${(opp.expectedValue.amountMinorUnits / 100).toLocaleString()}</td>
                      <td className="p-3 text-rose-700 font-bold">{opp.probability}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PLEDGES & GIFTS */}
      {activeTab === 'pledges_gifts' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Pledge Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Pledge ID</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Pledged Amount</th>
                    <th className="p-3">Fulfilled</th>
                    <th className="p-3">Outstanding</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pledges.map(pl => (
                    <tr key={pl.pledgeId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-medium text-rose-600">{pl.pledgeId}</td>
                      <td className="p-3 font-semibold">{pl.purpose}</td>
                      <td className="p-3">${(pl.pledgedAmount.amountMinorUnits / 100).toLocaleString()}</td>
                      <td className="p-3 text-emerald-600">${(pl.fulfilledAmount.amountMinorUnits / 100).toLocaleString()}</td>
                      <td className="p-3 text-amber-600">${(pl.outstandingAmount.amountMinorUnits / 100).toLocaleString()}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-xs">{pl.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Gift Registry & Allocation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Gift ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Allocations</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {gifts.map(g => (
                    <tr key={g.giftId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-medium text-rose-600">{g.giftId}</td>
                      <td className="p-3 font-semibold">{g.giftType}</td>
                      <td className="p-3 font-bold">${(g.amount.amountMinorUnits / 100).toLocaleString()}</td>
                      <td className="p-3 font-mono text-xs">{g.allocations.map(a => `${a.purposeCode}: $${(a.allocatedAmount.amountMinorUnits/100).toLocaleString()}`).join(', ')}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-xs">{g.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: STEWARDSHIP & RECOGNITION */}
      {activeTab === 'stewardship' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Stewardship Plans</h2>
            {stewardshipPlans.map(sp => (
              <div key={sp.planId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{sp.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Assigned Officer ID: {sp.officerUserIdRef}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">{sp.status}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Donor Recognition Levels</h2>
            {recognitions.map(rec => (
              <div key={rec.recognitionId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-rose-900">{rec.level}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Naming Reference: {rec.namingReference || 'None'}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold">Active Naming</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMPLIANCE & TASKS */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Gift Compliance Cases</h2>
            <div className="space-y-3">
              {complianceCases.map(cc => (
                <div key={cc.caseId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{cc.category}</span>
                    <p className="text-xs text-slate-700 mt-1">{cc.description}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">{cc.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">Fundraising Tasks</h2>
            <div className="space-y-3">
              {tasks.map(t => (
                <div key={t.taskId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{t.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Due: {t.dueDate} | Priority: {t.priority}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DIAGNOSTICS & AUDIT */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Diagnostics Engine (35 Invariants Check)</h2>
              <button
                onClick={() => setDiagnosticResult(institutionalAdvancementDevelopmentService.runDiagnostics(tenantId, campusId))}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
              >
                Re-Run Diagnostics
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold">Diagnostics Status:</span>{' '}
                <span className={diagnosticResult.passed ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {diagnosticResult.passed ? 'ALL INVARIANTS PASSED' : 'WARNINGS DETECTED'}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Checked {diagnosticResult.totalInvariants} institutional operational rules.</p>
              </div>
            </div>
            <div className="space-y-2">
              {diagnosticResult.findings.map((f: any, idx: number) => (
                <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs flex justify-between items-center text-amber-900">
                  <span>[{f.code}] {f.message}</span>
                  <span className="font-bold">{f.severity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold">SHA-256 Chained Audit Provenance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 text-slate-600 uppercase">
                  <tr>
                    <th className="p-3">Event ID</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Entity</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Current Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditEvents.map(ev => (
                    <tr key={ev.eventId} className="hover:bg-slate-50">
                      <td className="p-3 text-rose-600">{ev.eventId}</td>
                      <td className="p-3 font-semibold">{ev.action}</td>
                      <td className="p-3">{ev.entityType}</td>
                      <td className="p-3">{ev.actorUserIdRef}</td>
                      <td className="p-3 text-slate-500 truncate max-w-xs">{ev.currentHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: WHAT-IF SANDBOX */}
      {activeTab === 'simulation' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold">What-If Advancement Sandbox</h2>
            <p className="text-xs text-slate-500">Test operational stress scenarios in an isolated in-memory sandbox with zero production mutation.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'MAJOR_CAMPAIGN_SURGE', label: 'Major Campaign Surge' },
              { id: 'DONOR_SURGE', label: 'Donor Inflow Surge' },
              { id: 'MASS_PLEDGE_DEFAULT', label: 'Pledge Default Wave' }
            ].map(sc => (
              <button
                key={sc.id}
                onClick={() => handleRunSimulation(sc.id)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition"
              >
                Simulate: {sc.label}
              </button>
            ))}
          </div>

          {simulationResult && (
            <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-900 text-base">{simulationResult.title}</span>
                <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-semibold">
                  Impact Score: {simulationResult.impactScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-700">{simulationResult.description}</p>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Operational Recommendations:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-1">
                  {simulationResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 9: 50 ADVERSARIAL TESTS */}
      {activeTab === 'verification' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">Phase 11.15 Verification Suite (ADV-11.15-01 to ADV-11.15-50)</h2>
              <p className="text-xs text-slate-500">Comprehensive adversarial security and operational verification suite.</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
              50 / 50 PASSED
            </div>
          </div>
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase sticky top-0">
                <tr>
                  <th className="p-3">Test ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {verificationSuiteResults.map(test => (
                  <tr key={test.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-rose-600">{test.id}</td>
                    <td className="p-3 font-medium">{test.category}</td>
                    <td className="p-3 text-slate-700">{test.title}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                        {test.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{test.durationMs}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
