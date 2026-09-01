// Institutional Cybersecurity, Information Security, Privacy, Identity, Access, Zero-Trust & Digital Trust Governance Engine Workspace (Phase 7.70)

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Eye,
  FileText,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Plus,
  BarChart2,
  Users,
  Database,
  Globe,
  Award,
  Layers,
  Terminal,
  Cpu,
  Zap,
  CheckSquare
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { CyberSecurityPrivacyGovernanceService } from '../../services/cyberSecurityPrivacyGovernanceService';
import {
  CyberSecurityStrategy,
  InformationSecurityPolicy,
  IdentityGovernanceProfile,
  AccessGovernanceRecord,
  CyberZeroTrustPolicy,
  CyberRisk,
  CyberSecurityIncidentReference,
  PrivacyGovernanceRecord,
  DataProtectionRequirement,
  CyberVendorRisk,
  CertificateGovernanceReference,
  CyberResilienceAssessment,
  CyberSecurityDecision,
  CyberSecurityAuditEvent,
  DiagnosticFinding,
  SimulationScenarioType,
  SimulationResult
} from '../../types/cyberSecurityPrivacyGovernance';

export const CyberSecurityPrivacyGovernanceWorkspace: React.FC = () => {
  const tenantId = 'tenant_demo_01';
  const campusId = 'campus_main_01';
  const actorId = 'usr_admin_01';
  const actorRole = 'super_admin';

  const [activeTab, setActiveTab] = useState<
    | 'command'
    | 'strategy'
    | 'identity'
    | 'access'
    | 'privileged'
    | 'zerotrust'
    | 'controls'
    | 'risk'
    | 'threats'
    | 'incidents'
    | 'privacy'
    | 'dataprotection'
    | 'vendors'
    | 'digitaltrust'
    | 'resilience'
    | 'sandbox'
    | 'diagnostics'
    | 'audit'
  >('command');

  // Initial mock seed states
  const [strategies, setStrategies] = useState<CyberSecurityStrategy[]>([
    {
      id: 'strat_01',
      tenantId,
      campusId,
      title: '2026-2028 Enterprise Cyber Resilience & Zero-Trust Master Strategy',
      version: '2.1',
      timeHorizon: '2026 - 2028',
      visionStatement: 'Establish uncompromising institutional cyber resilience, identity-first zero-trust perimeter, and airtight privacy safeguards.',
      pillars: [
        { id: 'pil_1', name: 'Zero-Trust Identity & Access', description: 'Mandatory FIDO2 MFA and risk-based conditional access.', maturityLevel: 'MANAGED', completionPercentage: 85 },
        { id: 'pil_2', name: 'Resilient Infrastructure & Backup', description: 'Air-gapped immutable backup vaults and automated DR testing.', maturityLevel: 'DEFINED', completionPercentage: 78 },
        { id: 'pil_3', name: 'Comprehensive Data Privacy', description: 'End-to-end data governance, DPIAs, and automated retention.', maturityLevel: 'MANAGED', completionPercentage: 82 }
      ],
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    }
  ]);

  const [identities, setIdentities] = useState<IdentityGovernanceProfile[]>([
    { id: 'id_01', tenantId, campusId, identityIdRef: 'usr_101', principalName: 'Dr. Evelyn Vance', userType: 'FACULTY', lifecycleState: 'ACTIVE', mfaEnabled: true, riskScore: 12 },
    { id: 'id_02', tenantId, campusId, identityIdRef: 'usr_102', principalName: 'Marcus Sterling', userType: 'STAFF', lifecycleState: 'DORMANT', mfaEnabled: false, riskScore: 78 },
    { id: 'id_03', tenantId, campusId, identityIdRef: 'usr_103', principalName: 'Sarah Jenkins', userType: 'STUDENT', lifecycleState: 'ACTIVE', mfaEnabled: true, riskScore: 24 }
  ]);

  const [accessRecords, setAccessRecords] = useState<AccessGovernanceRecord[]>([
    { id: 'acc_01', tenantId, campusId, identityIdRef: 'usr_101', entitlementIdRef: 'ent_sis_admin', roleIdRef: 'role_registrar', grantedByRef: 'usr_admin_01', status: 'ACTIVE', expiresAt: '2026-12-31' },
    { id: 'acc_02', tenantId, campusId, identityIdRef: 'usr_102', entitlementIdRef: 'ent_finance_read', roleIdRef: 'role_auditor', grantedByRef: 'usr_admin_01', status: 'ACTIVE', expiresAt: '2026-06-30' }
  ]);

  const [zeroTrustPolicies, setZeroTrustPolicies] = useState<CyberZeroTrustPolicy[]>([
    { id: 'zt_01', tenantId, campusId, policyName: 'Mandatory Hardware MFA for Privileged Admin Sessions', enforcementLevel: 'STRICT', targetDomain: 'IDENTITY', status: 'ACTIVE' },
    { id: 'zt_02', tenantId, campusId, policyName: 'Device Compliance Check Prior to Cloud ERP Egress', enforcementLevel: 'ENFORCE', targetDomain: 'DEVICE', status: 'ACTIVE' }
  ]);

  const [risks, setRisks] = useState<CyberRisk[]>([
    { id: 'risk_01', tenantId, campusId, title: 'Legacy Protocol Exposure on Subnet 192.168.4', category: 'Infrastructure', likelihood: 'MEDIUM', impact: 'HIGH', riskScore: 8, riskLevel: 'HIGH', ownerIdRef: 'usr_sec_lead', status: 'OPEN' },
    { id: 'risk_02', tenantId, campusId, title: 'Third-Party Vendor API Token Exfiltration Vector', category: 'Supply Chain', likelihood: 'LOW', impact: 'CRITICAL', riskScore: 5, riskLevel: 'MEDIUM', ownerIdRef: 'usr_vendor_mgr', status: 'MITIGATED' }
  ]);

  const [incidents, setIncidents] = useState<CyberSecurityIncidentReference[]>([
    { id: 'inc_01', tenantId, campusId, incidentIdRef: 'INC-2026-8812', title: 'Suspicious Brute-Force Authentication Spike on Portal Gateway', severity: 'MEDIUM', category: 'Authentication', status: 'CONTAINED', detectedAt: '2026-08-28T14:22:00Z' }
  ]);

  const [privacyRecords, setPrivacyRecords] = useState<PrivacyGovernanceRecord[]>([
    { id: 'priv_01', tenantId, campusId, title: 'Student Academic & Behavioral Telemetry Repository', dataSubjectCategory: 'Students', processingPurpose: 'Academic evaluation and student success tracking', lawfulBasis: 'Educational Contract', retentionPeriodDays: 2555, status: 'ACTIVE' }
  ]);

  const [vendors, setVendors] = useState<CyberVendorRisk[]>([
    { id: 'ven_01', tenantId, campusId, vendorIdRef: 'v_01', vendorName: 'CloudLearn LMS Corp', riskRating: 'LOW', soc2Type2Verified: true, iso27001Certified: true, lastAssessmentDate: '2026-01-15', status: 'APPROVED' },
    { id: 'ven_02', tenantId, campusId, vendorIdRef: 'v_02', vendorName: 'CampusAnalytics SaaS', riskRating: 'MEDIUM', soc2Type2Verified: false, iso27001Certified: true, lastAssessmentDate: '2026-03-10', status: 'CONDITIONAL' }
  ]);

  const [certificates, setCertificates] = useState<CertificateGovernanceReference[]>([
    { id: 'cert_01', tenantId, campusId, certificateIdRef: 'c_api', commonName: 'api.edutech.edu', issuer: 'DigiCert Enterprise CA', expirationDate: '2026-09-10', daysToExpiry: 11, status: 'EXPIRING_SOON' },
    { id: 'cert_02', tenantId, campusId, certificateIdRef: 'c_sso', commonName: 'auth.edutech.edu', issuer: 'Let’s Encrypt Authority X3', expirationDate: '2026-11-20', daysToExpiry: 82, status: 'VALID' }
  ]);

  // Sandbox simulation state
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenarioType>('RANSOMWARE_OUTBREAK');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<DiagnosticFinding[]>([]);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<CyberSecurityAuditEvent[]>([]);

  // New Strategy Modal / Form State
  const [showNewStrategyModal, setShowNewStrategyModal] = useState(false);
  const [newStratTitle, setNewStratTitle] = useState('');
  const [newStratVision, setNewStratVision] = useState('');

  const handleRunSimulation = () => {
    const res = CyberSecurityPrivacyGovernanceService.runSimulation(selectedScenario, tenantId, campusId);
    setSimulationResult(res);
    CyberSecurityPrivacyGovernanceService.logAudit(
      tenantId,
      campusId,
      actorId,
      actorRole,
      'RUN_SIMULATION',
      'CyberResilienceSandbox',
      selectedScenario,
      `Executed What-If cyber simulation for scenario: ${res.scenarioName}`
    );
    setAuditLogs(CyberSecurityPrivacyGovernanceService.getAuditLogs(tenantId, campusId));
  };

  const handleRunDiagnostics = () => {
    const findings = CyberSecurityPrivacyGovernanceService.runDiagnostics(identities, accessRecords, risks, certificates);
    setDiagnostics(findings);
    CyberSecurityPrivacyGovernanceService.logAudit(
      tenantId,
      campusId,
      actorId,
      actorRole,
      'RUN_DIAGNOSTICS',
      'CyberDiagnosticsEngine',
      'diag_scan_01',
      `Executed automated cyber security diagnostics. Found ${findings.length} findings.`
    );
    setAuditLogs(CyberSecurityPrivacyGovernanceService.getAuditLogs(tenantId, campusId));
  };

  const handleCreateStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStratTitle) return;
    const item: CyberSecurityStrategy = {
      id: 'strat_' + Date.now(),
      tenantId,
      campusId,
      title: newStratTitle,
      version: '1.0',
      timeHorizon: '2026 - 2029',
      visionStatement: newStratVision || 'Uncompromising security posture.',
      pillars: [
        { id: 'pil_a', name: 'Identity & Access Management', description: 'Zero-trust authentication across all nodes.', maturityLevel: 'DEFINED', completionPercentage: 60 }
      ],
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    };
    setStrategies([item, ...strategies]);
    CyberSecurityPrivacyGovernanceService.logAudit(
      tenantId,
      campusId,
      actorId,
      actorRole,
      'CREATE_STRATEGY',
      'CyberSecurityStrategy',
      item.id,
      `Created cybersecurity strategy: ${item.title}`
    );
    setAuditLogs(CyberSecurityPrivacyGovernanceService.getAuditLogs(tenantId, campusId));
    setNewStratTitle('');
    setNewStratVision('');
    setShowNewStrategyModal(false);
  };

  // Maturity score
  const maturityScore = CyberSecurityPrivacyGovernanceService.calculateSecurityMaturityScore(
    strategies.flatMap(s => s.pillars.map(p => p.maturityLevel))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Cybersecurity, Privacy &amp; Identity Governance Engine
              </h1>
              <Badge variant="primary" size="sm">Phase 7.70 Production</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Institutional governance control plane governing cybersecurity posture, information security policies, zero-trust architecture, identity &amp; access governance, privileged elevation, cyber risk registers, incident response, privacy impact assessments, third-party vendor risk, and digital resilience sandboxing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowNewStrategyModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Cyber Strategy
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cyber Maturity Score</p>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{maturityScore}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">Managed Level</span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Evaluated across all pillars &amp; NIST/ISO controls</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Open Cyber Risks</p>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{risks.filter(r => r.status === 'OPEN').length}</span>
            <span className="text-2xs text-slate-500">({risks.length} Total Registered)</span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Requires active risk treatment plans</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dormant / At-Risk Identities</p>
            <Users className="w-5 h-5 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{identities.filter(i => i.riskScore > 70).length}</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">High Risk</span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">Requiring identity re-certification</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certificates Expiring</p>
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{certificates.filter(c => c.daysToExpiry <= 14).length}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">&lt; 14 Days</span>
          </div>
          <p className="text-2xs text-slate-400 mt-1">PKI &amp; TLS trust continuity watch</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl overflow-x-auto shadow-xs">
        {[
          { id: 'command', label: 'Executive Command', icon: BarChart2 },
          { id: 'strategy', label: 'Cyber Strategy', icon: Award },
          { id: 'identity', label: 'Identity Governance', icon: Users },
          { id: 'access', label: 'Access & Certifications', icon: Key },
          { id: 'privileged', label: 'Privileged Access', icon: ShieldAlert },
          { id: 'zerotrust', label: 'Zero Trust & ZTNA', icon: Lock },
          { id: 'controls', label: 'Security Controls', icon: CheckSquare },
          { id: 'risk', label: 'Cyber Risk Register', icon: AlertTriangle },
          { id: 'threats', label: 'Threats & Vulnerabilities', icon: Eye },
          { id: 'incidents', label: 'Incidents & Response', icon: Activity },
          { id: 'privacy', label: 'Privacy & PIAs', icon: FileText },
          { id: 'dataprotection', label: 'Data Protection & DLP', icon: Database },
          { id: 'vendors', label: 'Third-Party Vendors', icon: Globe },
          { id: 'digitaltrust', label: 'Digital Trust & PKI', icon: Cpu },
          { id: 'resilience', label: 'Cyber Resilience', icon: Server },
          { id: 'sandbox', label: 'What-If Sandbox', icon: Zap },
          { id: 'diagnostics', label: 'Diagnostics', icon: Terminal },
          { id: 'audit', label: 'Immutable Audit Trail', icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Institutional Cyber Command Center</h2>
                <p className="text-xs text-slate-500">Real-time overview of cybersecurity maturity, zero-trust posture, and threat surface.</p>
              </div>
              <button
                onClick={handleRunDiagnostics}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-blue-600" />
                Run Security Diagnostics
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cyber Maturity Pillars</h3>
                {strategies[0]?.pillars.map(pillar => (
                  <div key={pillar.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{pillar.name}</span>
                      <span className="text-blue-600 font-extrabold">{pillar.completionPercentage}% ({pillar.maturityLevel})</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pillar.completionPercentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Security Incidents &amp; Alerts</h3>
                {incidents.length === 0 ? (
                  <p className="text-xs text-slate-400">No active security incidents recorded in current window.</p>
                ) : (
                  incidents.map(inc => (
                    <div key={inc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{inc.incidentIdRef}</span>
                          <Badge variant="warning" size="sm">{inc.severity}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{inc.title}</p>
                      </div>
                      <Badge variant="success" size="sm">{inc.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Cybersecurity Strategy &amp; Roadmap</h2>
                <p className="text-xs text-slate-500">Long-term strategic vision, master pillars, and target maturity benchmarks.</p>
              </div>
              <button
                onClick={() => setShowNewStrategyModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Strategy
              </button>
            </div>

            <div className="space-y-4">
              {strategies.map(strat => (
                <div key={strat.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{strat.title}</h3>
                        <Badge variant="primary" size="sm">v{strat.version}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{strat.visionStatement}</p>
                    </div>
                    <Badge variant="success" size="sm">{strat.status}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {strat.pillars.map(pil => (
                      <div key={pil.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{pil.name}</p>
                        <p className="text-2xs text-slate-500">{pil.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-2xs font-bold text-blue-600">{pil.maturityLevel}</span>
                          <span className="text-2xs font-extrabold text-slate-700 dark:text-slate-300">{pil.completionPercentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'identity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Identity Governance &amp; Lifecycle Management</h2>
                <p className="text-xs text-slate-500">Monitor digital identities, MFA enrollment status, lifecycle state, and risk scores.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-2xs">
                  <tr>
                    <th className="px-4 py-3">Identity Principle</th>
                    <th className="px-4 py-3">User Type</th>
                    <th className="px-4 py-3">Lifecycle State</th>
                    <th className="px-4 py-3">MFA Status</th>
                    <th className="px-4 py-3">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {identities.map(id => (
                    <tr key={id.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{id.principalName}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{id.userType}</td>
                      <td className="px-4 py-3">
                        <Badge variant={id.lifecycleState === 'ACTIVE' ? 'success' : 'warning'} size="sm">
                          {id.lifecycleState}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {id.mfaEnabled ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">Enabled (FIDO2)</span>
                        ) : (
                          <span className="text-rose-600 font-bold flex items-center gap-1">Disabled</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-extrabold ${id.riskScore > 70 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {id.riskScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Access Governance &amp; Certifications</h2>
                <p className="text-xs text-slate-500">Govern role assignments, entitlements, and periodic access certification reviews.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-2xs">
                  <tr>
                    <th className="px-4 py-3">Identity Ref</th>
                    <th className="px-4 py-3">Entitlement Ref</th>
                    <th className="px-4 py-3">Role Assigned</th>
                    <th className="px-4 py-3">Granted By</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Expires At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {accessRecords.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{acc.identityIdRef}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{acc.entitlementIdRef}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-bold">{acc.roleIdRef}</td>
                      <td className="px-4 py-3 text-slate-500">{acc.grantedByRef}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" size="sm">{acc.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{acc.expiresAt || 'Indefinite'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'privileged' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Privileged Access &amp; Emergency Break-Glass Governance</h2>
                <p className="text-xs text-slate-500">Strict separation of duties (SoD), time-bound elevated access, and emergency session auditing.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Four-Eyes SoD &amp; Break-Glass Protocol Active
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                All privileged administrative elevation requests require multi-party dual control approval. Requester ID and Approver ID are cryptographically validated to never match. Emergency break-glass activations log immediate high-priority audit alerts and force mandatory post-session review.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'zerotrust' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Zero Trust Architecture &amp; ZTNA Policies</h2>
                <p className="text-xs text-slate-500">Never trust, always verify: contextual trust signals, conditional access, and device posture verification.</p>
              </div>
            </div>

            <div className="space-y-3">
              {zeroTrustPolicies.map(zt => (
                <div key={zt.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{zt.policyName}</span>
                      <Badge variant="primary" size="sm">{zt.targetDomain}</Badge>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1">Enforcement Level: <span className="font-extrabold text-blue-600">{zt.enforcementLevel}</span></p>
                  </div>
                  <Badge variant="success" size="sm">{zt.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Information Security Controls &amp; Assurance</h2>
                <p className="text-xs text-slate-500">ISO 27001 / NIST CSF aligned security control frameworks and automated testing compliance.</p>
              </div>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Overall Control Assurance Index</h3>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-emerald-600">94.2%</span>
                <p className="text-xs text-slate-500">142 of 151 core institutional security controls verified and tested in the last 90 days.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Enterprise Cyber Risk Register</h2>
                <p className="text-xs text-slate-500">Identify, evaluate, and track cyber risks, likelihood scores, and risk treatment plans.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-2xs">
                  <tr>
                    <th className="px-4 py-3">Risk Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Likelihood</th>
                    <th className="px-4 py-3">Impact</th>
                    <th className="px-4 py-3">Risk Level</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {risks.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{r.title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.category}</td>
                      <td className="px-4 py-3">{r.likelihood}</td>
                      <td className="px-4 py-3">{r.impact}</td>
                      <td className="px-4 py-3">
                        <Badge variant={r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH' ? 'warning' : 'success'} size="sm">
                          {r.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary" size="sm">{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Threat Intelligence &amp; Vulnerability Observations</h2>
              <p className="text-xs text-slate-500">Continuous vulnerability assessment, CVSS scoring, and threat vector tracking.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Threat telemetry feed synchronized with enterprise SIEM &amp; CVE databases.</p>
              <p className="text-2xs text-slate-500">0 unresolved zero-day vulnerabilities detected across active institutional assets.</p>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Security Incident Response &amp; Forensics</h2>
              <p className="text-xs text-slate-500">Incident command tracking, severity classification, and post-mortem review references.</p>
            </div>
            <div className="space-y-3">
              {incidents.map(inc => (
                <div key={inc.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{inc.incidentIdRef}</span>
                      <Badge variant="warning" size="sm">{inc.severity}</Badge>
                      <span className="text-2xs text-slate-500">{inc.category}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{inc.title}</p>
                  </div>
                  <Badge variant="success" size="sm">{inc.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Privacy Governance &amp; Privacy Impact Assessments (PIAs)</h2>
              <p className="text-xs text-slate-500">Data protection compliance, lawful basis registries, and privacy impact assessments.</p>
            </div>
            <div className="space-y-3">
              {privacyRecords.map(pr => (
                <div key={pr.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{pr.title}</h3>
                    <p className="text-2xs text-slate-500 mt-0.5">Purpose: {pr.processingPurpose} | Lawful Basis: {pr.lawfulBasis}</p>
                  </div>
                  <Badge variant="success" size="sm">{pr.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dataprotection' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Data Protection, Encryption &amp; DLP Governance</h2>
              <p className="text-xs text-slate-500">At-rest and in-transit encryption standards, HSM key management, and data loss prevention.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Encryption at Rest &amp; In Transit</h3>
                <p className="text-2xs text-slate-500">AES-256 enforced across all database volumes. TLS 1.3 enforced for all web and API traffic.</p>
              </div>
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Immutable Backups</h3>
                <p className="text-2xs text-slate-500">WORM (Write Once, Read Many) cloud backup vaults tested successfully with 0 corruption.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Third-Party Cyber Vendor Risk Governance</h2>
              <p className="text-xs text-slate-500">Assess SaaS and supplier security postures, SOC2 Type 2 verification, and due diligence.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-2xs">
                  <tr>
                    <th className="px-4 py-3">Vendor Name</th>
                    <th className="px-4 py-3">Risk Rating</th>
                    <th className="px-4 py-3">SOC2 Type 2</th>
                    <th className="px-4 py-3">ISO 27001</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {vendors.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{v.vendorName}</td>
                      <td className="px-4 py-3"><Badge variant="primary" size="sm">{v.riskRating}</Badge></td>
                      <td className="px-4 py-3">{v.soc2Type2Verified ? 'Verified' : 'Pending'}</td>
                      <td className="px-4 py-3">{v.iso27001Certified ? 'Certified' : 'No'}</td>
                      <td className="px-4 py-3"><Badge variant="success" size="sm">{v.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'digitaltrust' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Digital Trust, PKI &amp; Certificate Lifecycle Governance</h2>
              <p className="text-xs text-slate-500">Monitor SSL/TLS certificate expiration, PKI architecture, and digital signature authorities.</p>
            </div>
            <div className="space-y-3">
              {certificates.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.commonName}</h3>
                    <p className="text-2xs text-slate-500 mt-0.5">Issuer: {c.issuer} | Expires: {c.expirationDate} ({c.daysToExpiry} days remaining)</p>
                  </div>
                  <Badge variant={c.status === 'EXPIRING_SOON' ? 'warning' : 'success'} size="sm">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resilience' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Cyber Resilience Assessment &amp; DR Readiness</h2>
              <p className="text-xs text-slate-500">Evaluate detection, response, and recovery capabilities across critical institutional IT assets.</p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Overall Resilience Rating</h3>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-blue-600">Strong (89.5%)</span>
                <p className="text-xs text-slate-500">Recovery Time Objective (RTO) &lt; 4 hours, Recovery Point Objective (RPO) &lt; 15 minutes.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">What-If Cyber Resilience Sandbox Simulator</h2>
              <p className="text-xs text-slate-500">Execute in-memory resilience disaster simulations across 15 cyber threat scenarios; zero production mutation.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value as SimulationScenarioType)}
                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none flex-1"
              >
                <option value="RANSOMWARE_OUTBREAK">Distributed Ransomware Outbreak</option>
                <option value="IDENTITY_PROVIDER_OUTAGE">Federated Identity Provider Outage</option>
                <option value="PRIVILEGED_ACCOUNT_COMPROMISE">Privileged Account Compromise</option>
                <option value="CRITICAL_APPLICATION_BREACH">Critical SIS Database Breach</option>
                <option value="DATA_EXFILTRATION">Mass Data Exfiltration</option>
                <option value="CLOUD_REGION_OUTAGE">Cloud Region Outage</option>
                <option value="DNS_OUTAGE">DNS Infrastructure Outage</option>
                <option value="CERTIFICATE_EXPIRY">Certificate Expiry Storm</option>
                <option value="SUPPLIER_CYBER_BREACH">SaaS Vendor Cyber Breach</option>
                <option value="DLP_CONTROL_FAILURE">DLP Control Failure</option>
                <option value="BACKUP_FAILURE">Backup Restoration Failure</option>
                <option value="SIEM_OUTAGE">SIEM Ingestion Pipeline Collapse</option>
                <option value="EDR_OUTAGE">EDR Sensor Outage</option>
                <option value="ZERO_TRUST_POLICY_FAILURE">Zero-Trust Policy Misconfiguration</option>
                <option value="MASS_ACCOUNT_COMPROMISE">Credential Stuffing &amp; Mass Compromise</option>
              </select>
              <button
                onClick={handleRunSimulation}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4" />
                Run Simulation
              </button>
            </div>

            {simulationResult && (
              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{simulationResult.scenarioName}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{simulationResult.description}</p>
                  </div>
                  <Badge variant="primary" size="sm">Impact Score: {simulationResult.resilienceImpactScore}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Affected Systems</p>
                    <ul className="list-disc list-inside text-xs text-slate-500">
                      {simulationResult.affectedSystems.map((sys, idx) => (
                        <li key={idx}>{sys}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Financial Exposure Estimate</p>
                    <p className="text-xl font-extrabold text-rose-600">${simulationResult.financialExposureEstimate.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Mitigation Recommendations</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {simulationResult.mitigationRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Automated Cyber Security Diagnostics</h2>
                <p className="text-xs text-slate-500">Run security integrity scanner to detect dormant identities, unmitigated risks, and expiring certs.</p>
              </div>
              <button
                onClick={handleRunDiagnostics}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                Run Diagnostics Scan
              </button>
            </div>

            <div className="space-y-3">
              {diagnostics.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Click "Run Diagnostics Scan" above to evaluate system security posture.</p>
              ) : (
                diagnostics.map(diag => (
                  <div key={diag.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{diag.title}</span>
                        <Badge variant="warning" size="sm">{diag.severity}</Badge>
                      </div>
                      <Badge variant="primary" size="sm">{diag.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{diag.description}</p>
                    <p className="text-2xs font-bold text-blue-600 mt-1">Recommendation: {diag.remediationRecommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Immutable Cryptographic Audit Trail</h2>
              <p className="text-xs text-slate-500">Tamper-evident append-only log with SHA-256 state hashing for all security and privacy governance actions.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-bold text-2xs">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Actor / Role</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Entity</th>
                    <th className="px-4 py-3">Details</th>
                    <th className="px-4 py-3">SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-xs">
                        No audit events recorded in this session. Perform governance actions to populate audit trail.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-100">{log.actorId} ({log.actorRole})</td>
                        <td className="px-4 py-3"><Badge variant="primary" size="sm">{log.action}</Badge></td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{log.entityType}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                        <td className="px-4 py-3 font-mono text-2xs text-slate-400">{log.resultingStateHash}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New Strategy Modal */}
      {showNewStrategyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create Cybersecurity Strategy</h3>
              <button onClick={() => setShowNewStrategyModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStrategy} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Strategy Title</label>
                <input
                  type="text"
                  required
                  value={newStratTitle}
                  onChange={(e) => setNewStratTitle(e.target.value)}
                  placeholder="e.g., 2027 Advanced Cloud Security & Zero-Trust Roadmap"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vision Statement</label>
                <textarea
                  value={newStratVision}
                  onChange={(e) => setNewStratVision(e.target.value)}
                  placeholder="Describe strategic goals and resilience vision..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStrategyModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
