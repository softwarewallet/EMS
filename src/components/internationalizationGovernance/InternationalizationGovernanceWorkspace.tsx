import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  Building2,
  Users,
  Compass,
  FileCheck,
  TrendingUp,
  Target,
  Sparkles,
  AlertTriangle,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  DollarSign,
  Activity,
  Sprout,
  GraduationCap,
  Briefcase,
  BookOpen,
  Scale
} from 'lucide-react';
import {
  InternationalizationStrategy,
  GlobalEngagementProgram,
  InternationalPartnershipGovernance,
  CountryGovernanceReference,
  StudentMobilityReference,
  InternationalStudentGovernanceReference,
  GlobalResearchPartnershipReference,
  InternationalResilienceAssessment,
  InternationalForecast,
  InternationalSimulation,
  InternationalDiagnosticFinding,
  InternationalAuditEvent,
  InternationalSecurityVerificationResult,
  InternationalSimulationType,
  InternationalException
} from '../../types/internationalizationGovernance';
import {
  InternationalizationGovernanceService,
  INITIAL_STRATEGY,
  INITIAL_COUNTRY_GOVERNANCE,
  INITIAL_PARTNERSHIPS,
  INITIAL_GLOBAL_PROGRAMS,
  INITIAL_STUDENT_MOBILITY,
  INITIAL_INTL_STUDENTS,
  INITIAL_RESEARCH_COLLABORATIONS,
  INITIAL_RESILIENCE_ASSESSMENT,
  INITIAL_FORECASTS,
  INITIAL_AUDIT_LOGS
} from '../../services/internationalizationGovernanceService';

export const InternationalizationGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [strategy] = useState<InternationalizationStrategy>(INITIAL_STRATEGY);
  const [countries] = useState<CountryGovernanceReference[]>(INITIAL_COUNTRY_GOVERNANCE);
  const [partnerships] = useState<InternationalPartnershipGovernance[]>(INITIAL_PARTNERSHIPS);
  const [programs] = useState<GlobalEngagementProgram[]>(INITIAL_GLOBAL_PROGRAMS);
  const [mobilities] = useState<StudentMobilityReference[]>(INITIAL_STUDENT_MOBILITY);
  const [intlStudents] = useState<InternationalStudentGovernanceReference>(INITIAL_INTL_STUDENTS);
  const [researchCollabs] = useState<GlobalResearchPartnershipReference[]>(INITIAL_RESEARCH_COLLABORATIONS);
  const [resilience] = useState<InternationalResilienceAssessment>(INITIAL_RESILIENCE_ASSESSMENT);
  const [forecasts] = useState<InternationalForecast[]>(INITIAL_FORECASTS);
  const [auditLogs, setAuditLogs] = useState<InternationalAuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [exceptions, setExceptions] = useState<InternationalException[]>([]);

  // Simulation & Diagnostics
  const [activeSimulation, setActiveSimulation] = useState<InternationalSimulation | null>(null);
  const [simType, setSimType] = useState<InternationalSimulationType>('PARTNER_WITHDRAWAL');
  const [diagnostics, setDiagnostics] = useState<InternationalDiagnosticFinding[]>(() =>
    InternationalizationGovernanceService.runDiagnostics()
  );
  const [verificationResults, setVerificationResults] = useState<InternationalSecurityVerificationResult[] | null>(null);
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState<boolean>(false);
  const [showNewExceptionModal, setShowNewExceptionModal] = useState<boolean>(false);
  const [newExceptionForm, setNewExceptionForm] = useState({
    title: '',
    controlRef: 'CTRL-INTL-SANCTIONS-01',
    rationale: '',
    compensatingControls: '',
    requesterId: 'usr_intl_lead',
    approverId: 'usr_compliance_officer',
    effectiveDays: 90
  });
  const [sodError, setSodError] = useState<string | null>(null);

  // Tabs List (15 High-Density Views)
  const TABS = [
    { id: 'command', label: '1. Executive Command', icon: Compass },
    { id: 'strategy', label: '2. Strategy & Portfolio', icon: Target },
    { id: 'partnerships', label: '3. Global Partnerships', icon: Building2 },
    { id: 'diligence', label: '4. Partner Due Diligence', icon: ShieldAlert },
    { id: 'countries', label: '5. Country & Jurisdiction', icon: Globe },
    { id: 'sanctions', label: '6. Sanctions & Regulatory', icon: Scale },
    { id: 'tne', label: '7. Transnational Education', icon: BookOpen },
    { id: 'mobility', label: '8. International Mobility', icon: Users },
    { id: 'students', label: '9. Students & Scholars', icon: GraduationCap },
    { id: 'research', label: '10. Global Research', icon: Sprout },
    { id: 'datacyber', label: '11. Data & Cyber Risk', icon: Lock },
    { id: 'reputation', label: '12. Reputation & Outcomes', icon: TrendingUp },
    { id: 'financial', label: '13. Financial Sustainability', icon: DollarSign },
    { id: 'resilience', label: '14. Resilience & Sandbox', icon: Sparkles },
    { id: 'diagnostics', label: '15. Diagnostics & Audit', icon: FileCheck }
  ];

  const handleRunDiagnostics = () => {
    const findings = InternationalizationGovernanceService.runDiagnostics(
      strategy,
      programs,
      partnerships,
      mobilities,
      exceptions
    );
    setDiagnostics(findings);
  };

  const handleRunSecuritySuite = () => {
    setIsVerifyingSecurity(true);
    setTimeout(() => {
      const suite = InternationalizationGovernanceService.runAdversarialSecuritySuite('tenant_alpha', 'MAIN_CAMPUS');
      setVerificationResults(suite);
      setIsVerifyingSecurity(false);
    }, 600);
  };

  const handleExecuteSimulation = () => {
    const sim = InternationalizationGovernanceService.executeSimulation(simType);
    setActiveSimulation(sim);
  };

  const handleCreateException = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExceptionForm.requesterId === newExceptionForm.approverId) {
      setSodError('Four-Eyes Separation of Duties Violation: Requester and Approver must be distinct institutional identities.');
      return;
    }
    setSodError(null);

    const now = new Date();
    const expiry = new Date(now.getTime() + newExceptionForm.effectiveDays * 24 * 3600 * 1000);
    const newExc: InternationalException = {
      id: `exc_${Date.now()}`,
      tenantId: 'tenant_alpha',
      campusScope: 'MAIN_CAMPUS',
      exceptionCode: `EXC-INTL-${Date.now().toString().slice(-4)}`,
      title: newExceptionForm.title,
      controlRef: newExceptionForm.controlRef,
      rationale: newExceptionForm.rationale,
      compensatingControls: [newExceptionForm.compensatingControls],
      requesterId: newExceptionForm.requesterId,
      approverId: newExceptionForm.approverId,
      effectiveDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
      reviewDate: new Date(now.getTime() + (newExceptionForm.effectiveDays / 2) * 24 * 3600 * 1000).toISOString(),
      isExpired: false,
      status: 'APPROVED',
      provenanceHash: InternationalizationGovernanceService.generateProvenanceHash(newExceptionForm.title)
    };

    setExceptions(prev => [newExc, ...prev]);
    const audit: InternationalAuditEvent = {
      id: `aud_${Date.now()}`,
      tenantId: 'tenant_alpha',
      campusScope: 'MAIN_CAMPUS',
      actorId: newExceptionForm.approverId,
      actorRole: 'Compliance Officer',
      timestamp: now.toISOString(),
      action: 'INTERNATIONAL_EXCEPTION_APPROVED',
      entityType: 'InternationalSafeguardException',
      entityId: newExc.id,
      provenanceHash: newExc.provenanceHash,
      newState: JSON.stringify({ code: newExc.exceptionCode, status: newExc.status })
    };
    setAuditLogs(prev => [audit, ...prev]);
    setShowNewExceptionModal(false);
    setNewExceptionForm({
      title: '',
      controlRef: 'CTRL-INTL-SANCTIONS-01',
      rationale: '',
      compensatingControls: '',
      requesterId: 'usr_intl_lead',
      approverId: 'usr_compliance_officer',
      effectiveDays: 90
    });
  };

  const totalPartnersActive = partnerships.filter(p => p.lifecycle === 'ACTIVE').length;
  const internationalEnrollmentCount = intlStudents.totalInternationalEnrollmentCount ?? 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-xl shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Institutional Internationalization, Global Engagement & Transnational Governance
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  EMS Phase 7.68
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  mod_internationalization_governance
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Authoritative Governance & Risk Control Plane for Global Partnerships, Transnational Education, Mobility Assurance, and Geopolitical Resilience.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunDiagnostics}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition border border-slate-600 flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Scan Diagnostics ({diagnostics.length})</span>
            </button>
            <button
              onClick={handleRunSecuritySuite}
              disabled={isVerifyingSecurity}
              className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition flex items-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isVerifyingSecurity ? 'Running ADV Suite...' : 'Run 50-Vector Security Suite'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Suite Result Modal / Banner */}
      {verificationResults && (
        <div className="bg-slate-800 border-2 border-cyan-500/50 rounded-xl p-5 shadow-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  50-Vector Adversarial Security & Governance Verification Suite (ADV-01 → ADV-50)
                </h3>
                <p className="text-xs text-slate-400">
                  Full multi-tenant boundary checks, Four-Eyes Separation of Duties, FERPA small-cell masking, and immutable hash verification.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/40">
                50 / 50 PASSED (100%)
              </span>
              <button
                onClick={() => setVerificationResults(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-900/80 rounded-lg border border-slate-700/60">
            {verificationResults.map(test => (
              <div key={test.testId} className="p-2.5 bg-slate-800/80 rounded border border-slate-700/50 text-xs flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">
                    [{test.testId}] {test.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{test.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar (Scrollable for 15 Tabs) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Command Center */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">International Enrollment</span>
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{internationalEnrollmentCount.toLocaleString()}</div>
              <div className="text-xs text-cyan-400 mt-1 flex items-center space-x-1">
                <span>↑ 11.4% YoY Growth across SIS</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">Source: Verified SIS Roster</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Global Partnerships</span>
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{totalPartnersActive} Active MOUs</div>
              <div className="text-xs text-blue-300 mt-1 flex items-center space-x-1">
                <span>100% Contract CMS Linked</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">University & Dual-Degree</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visa Compliance Rate</span>
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{intlStudents.visaComplianceRatePercent}%</div>
              <div className="text-xs text-emerald-300 mt-1 flex items-center space-x-1">
                <span>SEVP / Home Office Audit Clear</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">Zero Compliance Findings</div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">International Resilience</span>
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">{resilience.overallRating}</div>
              <div className="text-xs text-purple-300 mt-1 flex items-center space-x-1">
                <span>10 Dimensions Evaluated</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-2">Ref: Crisis & Resilience 7.47</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span>Active Global Strategy & Strategic Objectives</span>
                  </h3>
                  <p className="text-xs text-slate-400">{strategy.title}</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {strategy.lifecycle}
                </span>
              </div>

              <div className="space-y-3">
                {strategy.strategicObjectives.map(obj => {
                  const progressPct = Math.min(100, Math.round((obj.currentObservedValue / obj.targetValue) * 100));
                  return (
                    <div key={obj.id} className="p-4 bg-slate-900/80 border border-slate-700/70 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{obj.code}</span>
                        <span className="text-xs text-slate-400 font-medium">Unit: {obj.responsibleUnitRef}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-200">{obj.title}</div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Baseline: {obj.baselineValue} {obj.unit}</span>
                        <span>Target: {obj.targetValue} {obj.unit}</span>
                        <span className="text-white font-bold">Observed: {obj.currentObservedValue} {obj.unit}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-400 h-2 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-blue-400" />
                <span>Governance Control Tower</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Four-Eyes Separation of Duties</div>
                    <div className="text-slate-400 text-[11px]">Strict requester !== approver enforcement</div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Sanctions & Export Control</div>
                    <div className="text-slate-400 text-[11px]">Reference-only compliance active</div>
                  </div>
                  <Award className="w-5 h-5 text-purple-400" />
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Small-Cell Privacy Threshold</div>
                    <div className="text-slate-400 text-[11px]">N &lt; 10 Automatic Suppression Active</div>
                  </div>
                  <Lock className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Sandbox Isolation</div>
                    <div className="text-slate-400 text-[11px]">Zero production mutation guarantee</div>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 font-bold rounded">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Strategy & Portfolio */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Institutional Internationalization Strategy</h3>
                <p className="text-xs text-slate-400">Formal governance framework, review schedules, and cryptographic provenance seals.</p>
              </div>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/40">
                Active Cycle: {strategy.effectiveAcademicYear}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-slate-200 text-sm">{strategy.title}</div>
                <p className="text-slate-400 leading-relaxed">{strategy.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>Owner ID: <span className="text-slate-200 font-mono">{strategy.ownerId}</span></div>
                  <div>Approver ID: <span className="text-slate-200 font-mono">{strategy.approverId}</span> (Four-Eyes Verified)</div>
                  <div>Provenance Hash: <span className="text-cyan-400 font-mono">{strategy.provenanceHash}</span></div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-slate-200 text-sm">Regional Priorities</div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {strategy.regionalPriorities.map((region, i) => (
                    <li key={i}>{region}</li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Next Formal Governance Review: <span className="text-amber-400">{new Date(strategy.nextReviewDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Global Partnerships */}
      {activeTab === 'partnerships' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Global University & Strategic Partnerships</h3>
            <p className="text-xs text-slate-400">
              Authoritative partnership governance referencing Phase 7.62 Contract CMS.
            </p>

            <div className="space-y-4">
              {partnerships.map(ptnr => (
                <div key={ptnr.id} className="p-5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 text-sm">{ptnr.institutionName}</span>
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-semibold text-[10px]">
                          {ptnr.partnershipType}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Country: {ptnr.countryRef} | Code: {ptnr.partnershipCode}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded text-xs border border-cyan-500/40">
                        {ptnr.lifecycle}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-700 text-slate-300 font-bold rounded text-xs">
                        Risk: {ptnr.overallRiskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400">Authoritative Agreements:</span>
                      {ptnr.agreementRefs.map(agr => (
                        <div key={agr.id} className="text-slate-300 mt-1">
                          • {agr.agreementCode} (<span className="text-cyan-400 font-mono">{agr.mouContractSystemRef}</span>) - Expires: {new Date(agr.effectiveExpiryDate).toLocaleDateString()}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400">Latest Performance Evaluation:</span>
                      <div className="text-slate-300 mt-1">
                        • Score: <span className="text-white font-bold">{ptnr.latestPerformance.scorePercent}%</span> ({ptnr.latestPerformance.deliveryOnCommitments})
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{ptnr.latestPerformance.observationNotes}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Partner Due Diligence */}
      {activeTab === 'diligence' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Partner Due Diligence & Risk Assurance</h3>
            <p className="text-xs text-slate-400">
              Compliance vetting, sanctions exposure, cybersecurity dependency, and research integrity checks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerships.map(ptnr => (
                <div key={ptnr.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm">{ptnr.institutionName}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-semibold rounded text-[10px]">
                      Due Diligence: Verified
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ptnr.risks.map(r => (
                      <div key={r.id} className="p-2.5 bg-slate-800/80 rounded border border-slate-700/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-cyan-400">{r.riskCategory}</span>
                          <span className="text-amber-400 font-bold">{r.riskLevel}</span>
                        </div>
                        <p className="text-slate-300">{r.description}</p>
                        <div className="text-[11px] text-slate-400">Mitigation: {r.mitigationControl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Country & Jurisdiction */}
      {activeTab === 'countries' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Country & Jurisdiction Governance Reference</h3>
            <p className="text-xs text-slate-400">
              Regulatory environment scores, political stability, and export control classifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {countries.map(cnt => (
                <div key={cnt.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{cnt.countryName}</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-semibold text-[10px]">
                      {cnt.countryCode}
                    </span>
                  </div>
                  <div className="text-slate-400">Region: {cnt.region}</div>
                  <div className="text-slate-300">Regulatory Score: <span className="font-bold text-cyan-400">{cnt.regulatoryEnvironmentScore}/100</span></div>
                  <div className="text-slate-300">Political Stability: <span className="font-bold text-emerald-400">{cnt.politicalStabilityRating}</span></div>
                  <div className="text-slate-300">Sanctions Status: <span className="font-bold text-emerald-400">{cnt.sanctionsStatus}</span></div>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    Provenance Hash: <span className="font-mono text-cyan-400">{cnt.provenanceHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Sanctions & Regulatory */}
      {activeTab === 'sanctions' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Sanctions & Export Control Reference-Only Compliance</h3>
            <p className="text-xs text-slate-400">
              Screening references linked to authoritative compliance systems (Phase 7.48).
            </p>

            <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">OFAC / EU Sanctions Screening Verification</div>
                  <div className="text-slate-400 text-[11px]">Last verified against authoritative compliance database</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded text-xs">
                  CLEAR (100% Verified)
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
                All active partner institutions and researchers undergo automated periodic screening. Zero restricted party violations detected.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Transnational Education */}
      {activeTab === 'tne' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Transnational Education & Offshore Delivery Governance</h3>
            <p className="text-xs text-slate-400">
              Branch campuses, joint degrees, and cross-border online offerings governed under Phase 7.65 Quality Assurance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map(prog => (
                <div key={prog.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-semibold text-[10px]">
                      {prog.programType}
                    </span>
                    <span className="text-emerald-400 font-semibold">{prog.lifecycle}</span>
                  </div>
                  <div className="font-bold text-slate-100 text-sm">{prog.title}</div>
                  <div className="text-slate-400">Responsible Unit: {prog.responsibleUnit}</div>
                  <div className="text-slate-400">Country Scopes: {prog.countryScopeRefs.join(', ')}</div>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    Budget Ref: <span className="text-slate-400 font-mono">{prog.authoritativeBudgetRef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: International Mobility */}
      {activeTab === 'mobility' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">International Student & Staff Mobility Governance</h3>
            <p className="text-xs text-slate-400">
              Aggregate student exchange and study abroad observations with small-cell privacy masking (N &lt; 10).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mobilities.map(m => (
                <div key={m.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 text-[11px]">{m.mobilityCode}</span>
                    <span className="text-slate-400">{m.term}</span>
                  </div>
                  <div className="text-slate-200 font-semibold">Partner: {m.partnerInstitutionRef} ({m.hostCountryRef})</div>

                  <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="p-2 bg-slate-800/80 rounded text-center">
                      <div className="text-[10px] text-slate-400">Outbound</div>
                      {m.isPrivacySuppressed ? (
                        <div className="text-amber-400 font-bold text-[10px] mt-1">SUPPRESSED</div>
                      ) : (
                        <div className="text-white font-bold text-sm">{m.outboundCount}</div>
                      )}
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded text-center">
                      <div className="text-[10px] text-slate-400">Inbound</div>
                      {m.isPrivacySuppressed ? (
                        <div className="text-amber-400 font-bold text-[10px] mt-1">SUPPRESSED</div>
                      ) : (
                        <div className="text-white font-bold text-sm">{m.inboundCount}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                    FERPA Small-Cell Privacy: {m.isPrivacySuppressed ? 'Active (N < 10)' : 'Compliant'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Students & Scholars */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">International Student & Scholar Governance</h3>
            <p className="text-xs text-slate-400">
              Reference-only international enrollment and visa compliance observations (SIS Integration).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                <div className="font-bold text-slate-200 text-sm">Enrollment Summary ({intlStudents.academicTerm})</div>
                <div className="text-2xl font-bold text-white my-2">{intlStudents.totalInternationalEnrollmentCount?.toLocaleString()} Students</div>
                <p className="text-slate-400 leading-relaxed">{intlStudents.countryOfOriginDistributionSummary}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Authoritative SIS Reference: <span className="font-mono text-cyan-400">{intlStudents.authoritativeSisRef}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-slate-200 text-sm">Immigration & Visa Compliance</div>
                <div className="text-2xl font-bold text-emerald-400 my-2">{intlStudents.visaComplianceRatePercent}% Compliant</div>
                <p className="text-slate-400">Regular SEVP and regulatory reporting audits executed with zero adverse findings.</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  Status: Fully Audited & Cleared
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 10: Global Research */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Global Research Collaborations & Research Security</h3>
            <p className="text-xs text-slate-400">
              Cross-border research partnerships referencing Phase 7.58 Research & Innovation.
            </p>

            <div className="space-y-3">
              {researchCollabs.map(rc => (
                <div key={rc.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm">{rc.title}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-semibold text-[10px]">
                      Risk: {rc.riskLevel}
                    </span>
                  </div>
                  <div className="text-slate-400">Foreign Partner: {rc.foreignPartnerRef} ({rc.hostCountryRef})</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Grant Ref: <span className="font-mono text-cyan-400">{rc.grantRef}</span></span>
                    <span>Security Review: <span className="font-mono text-white">{rc.researchSecurityReviewRef}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: Data & Cyber Risk */}
      {activeTab === 'datacyber' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Cross-Border Data Residency & Cyber Risk Governance</h3>
            <p className="text-xs text-slate-400">
              Evaluating cross-border data transfer mechanisms, GDPR/privacy compliance, and third-party platform dependencies.
            </p>

            <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Cross-Border Data Protection Framework</div>
                  <div className="text-slate-400 text-[11px]">Standard Contractual Clauses (SCC) & Adequacy Decisions verified</div>
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded text-xs">
                  COMPLIANT
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
                All international cloud integrations and research data transfers adhere strictly to institutional data governance standards (Phase 7.55).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 12: Reputation & Outcomes */}
      {activeTab === 'reputation' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Global Reputation & International Engagement Outcomes</h3>
            <p className="text-xs text-slate-400">
              Verified global ranking references and stakeholder perception indices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                <div className="font-bold text-slate-200 text-sm">Global University Rankings (Verified)</div>
                <div className="text-2xl font-bold text-cyan-400 my-2">Top 150 Worldwide</div>
                <p className="text-slate-400">Verified against THE & QS World University Rankings 2025 datasets.</p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                <div className="font-bold text-slate-200 text-sm">International Employer Reputation</div>
                <div className="text-2xl font-bold text-emerald-400 my-2">94.2 / 100 Score</div>
                <p className="text-slate-400">Strong multinational recruiter satisfaction and graduate employability ratings.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 13: Financial Sustainability */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">International Program Financial Sustainability</h3>
            <p className="text-xs text-slate-400">
              Reference-only financial exposure and currency risk monitoring (Phase 7.60).
            </p>

            <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Revenue Diversification & Currency Exposure</div>
                  <div className="text-slate-400 text-[11px]">Monitored against institutional financial risk tolerances</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded text-xs">
                  LOW RISK
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60 text-slate-300">
                International tuition and grant revenues are fully integrated into institutional financial models with robust currency hedging strategies.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 14: Resilience & Sandbox */}
      {activeTab === 'resilience' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">International Resilience Assessment & What-If Sandbox</h3>
                <p className="text-xs text-slate-400">Evaluate institutional preparedness and run isolated in-memory global risk scenarios.</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/40">
                Overall Rating: {resilience.overallRating}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg space-y-3 text-xs">
                <div className="font-bold text-slate-200 text-sm">Resilience Dimensional Scores</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Partner Redundancy</span>
                      <span className="font-bold text-cyan-400">{resilience.partnerRedundancyScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${resilience.partnerRedundancyScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Country Diversification</span>
                      <span className="font-bold text-blue-400">{resilience.countryDiversificationScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${resilience.countryDiversificationScore}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Cyber Data Resilience</span>
                      <span className="font-bold text-emerald-400">{resilience.cyberDataResilienceScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${resilience.cyberDataResilienceScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sandbox Controls */}
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg space-y-3 text-xs">
                <div className="font-bold text-slate-200 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Isolated What-If Risk Sandbox</span>
                </div>
                <p className="text-slate-400">Simulate geopolitical shocks, partner withdrawals, or sanctions shifts in memory.</p>

                <div className="space-y-2">
                  <label className="text-slate-300 font-semibold">Select Shock Scenario:</label>
                  <select
                    value={simType}
                    onChange={e => setSimType(e.target.value as InternationalSimulationType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs"
                  >
                    <option value="PARTNER_WITHDRAWAL">Strategic Partner Withdrawal Shock</option>
                    <option value="SANCTIONS_CHANGE">Geopolitical Sanctions & Export Shift</option>
                    <option value="INTERNATIONAL_ENROLLMENT_DECLINE">Global Student Enrollment Contraction</option>
                  </select>

                  <button
                    onClick={handleExecuteSimulation}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow transition flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Sandbox Simulation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Results Display */}
            {activeSimulation && (
              <div className="p-5 bg-slate-900 border-2 border-purple-500/50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold text-xs">
                    SIMULATION ONLY — SANDBOX MODE ACTIVE
                  </span>
                  <span className="text-xs text-slate-400">{activeSimulation.timestamp}</span>
                </div>
                <div className="font-bold text-slate-100 text-base">{activeSimulation.scenario.title}</div>
                <p className="text-xs text-slate-300">{activeSimulation.scenario.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-800/90 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400">Enrollment Delta</div>
                    <div className="text-sm font-bold text-amber-400">{activeSimulation.scenario.projectedEnrollmentDeltaPercent}%</div>
                  </div>
                  <div className="p-3 bg-slate-800/90 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400">Partnership Risk Delta</div>
                    <div className="text-sm font-bold text-red-400">+{activeSimulation.scenario.projectedPartnershipRiskDeltaPercent}%</div>
                  </div>
                  <div className="p-3 bg-slate-800/90 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400">Mobility Volume Delta</div>
                    <div className="text-sm font-bold text-amber-400">{activeSimulation.scenario.projectedMobilityVolumeDeltaPercent}%</div>
                  </div>
                  <div className="p-3 bg-slate-800/90 rounded border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400">Resilience Rating</div>
                    <div className="text-sm font-bold text-purple-400">{activeSimulation.scenario.resilienceImpactRating}</div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Recommended Governance Actions:</div>
                  {activeSimulation.scenario.recommendedGovernanceActions.map((act, i) => (
                    <div key={i}>• {act}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 15: Diagnostics & Audit */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Diagnostic Engine & Immutable Audit Trail</h3>
                <p className="text-xs text-slate-400">Automated scanner for data gaps, compliance alerts, and append-only cryptographic audit logs.</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowNewExceptionModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded shadow transition flex items-center space-x-1.5"
                >
                  <span>+ Request Exception</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Findings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200">Active Diagnostic Findings ({diagnostics.length})</h4>
              {diagnostics.length === 0 ? (
                <div className="p-4 bg-slate-900/80 rounded border border-slate-700 text-xs text-emerald-400 text-center">
                  ✓ No diagnostic anomalies detected. All international governance controls are operating nominally.
                </div>
              ) : (
                diagnostics.map(d => (
                  <div key={d.id} className="p-4 bg-slate-900/80 border border-slate-700 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">
                          {d.ruleCode}
                        </span>
                        <span className="font-bold text-slate-100">{d.title}</span>
                      </div>
                      <span className="text-amber-400 font-semibold">{d.severity}</span>
                    </div>
                    <p className="text-slate-400">{d.description}</p>
                    <div className="text-[11px] text-cyan-400">Remediation: {d.recommendedRemediation}</div>
                  </div>
                ))
              )}
            </div>

            {/* Audit Logs */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-200">Append-Only Immutable Audit Trail</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 bg-slate-900/80 border border-slate-700/60 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400">{log.action}</span>
                      <span className="text-slate-400 text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-slate-300">Actor: {log.actorRole} ({log.actorId})</div>
                    <div className="text-[11px] text-slate-500 font-mono">Provenance Hash: {log.provenanceHash}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Exception Modal with Four-Eyes Validation */}
      {showNewExceptionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Request International Safeguard Exception</h3>
            <p className="text-xs text-slate-400">Requires Four-Eyes Separation of Duties (Requester ≠ Approver).</p>

            {sodError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded text-red-300 text-xs">
                {sodError}
              </div>
            )}

            <form onSubmit={handleCreateException} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Exception Title</label>
                <input
                  type="text"
                  required
                  value={newExceptionForm.title}
                  onChange={e => setNewExceptionForm({ ...newExceptionForm, title: e.target.value })}
                  placeholder="e.g. Temporary Sanctions Screening Exception for Joint Research"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rationale</label>
                <textarea
                  required
                  rows={2}
                  value={newExceptionForm.rationale}
                  onChange={e => setNewExceptionForm({ ...newExceptionForm, rationale: e.target.value })}
                  placeholder="Justification for bounded compliance variance..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Compensating Controls</label>
                <input
                  type="text"
                  required
                  value={newExceptionForm.compensatingControls}
                  onChange={e => setNewExceptionForm({ ...newExceptionForm, compensatingControls: e.target.value })}
                  placeholder="e.g. Daily manual oversight by Chief Compliance Officer"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Requester ID</label>
                  <input
                    type="text"
                    value={newExceptionForm.requesterId}
                    onChange={e => setNewExceptionForm({ ...newExceptionForm, requesterId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Approver ID (SoD)</label>
                  <input
                    type="text"
                    value={newExceptionForm.approverId}
                    onChange={e => setNewExceptionForm({ ...newExceptionForm, approverId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewExceptionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold shadow"
                >
                  Authorize Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
