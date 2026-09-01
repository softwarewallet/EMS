// Institutional Digital Transformation, Technology Governance, IT Service Management, Cyber Resilience & Enterprise Architecture Governance Engine Workspace (Phase 7.69)

import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Server,
  Cloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building,
  Lock,
  Search,
  RefreshCw,
  Sliders,
  Terminal,
  Zap
} from 'lucide-react';
import { DigitalTechnologyGovernanceService } from '../../services/digitalTechnologyGovernanceService';
import { SimulationScenarioType, SimulationResult } from '../../types/digitalTechnologyGovernance';

export const DigitalTechnologyGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('command');
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenarioType>('CLOUD_PROVIDER_OUTAGE');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [auditFilter, setAuditFilter] = useState<string>('');

  const tenantId = 'tenant_demo_01';
  const campusId = 'campus_main_01';

  // Sample metrics & data
  const maturityScore = DigitalTechnologyGovernanceService.calculateDigitalMaturityScore([4, 3, 4, 5, 4]);
  const eaCompliance = DigitalTechnologyGovernanceService.calculateArchitectureComplianceScore(42, 48);
  const portfolioHealth = DigitalTechnologyGovernanceService.calculatePortfolioHealth(120, 15, 8);
  const cyberResilience = DigitalTechnologyGovernanceService.calculateCyberResilienceIndex(92, 88);
  const slaRisk = DigitalTechnologyGovernanceService.calculateSLARiskScore(1, 40);

  const findings = DigitalTechnologyGovernanceService.runDiagnostics([], [], [], []);
  const auditLogs = DigitalTechnologyGovernanceService.getAuditLogs(tenantId, campusId);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = DigitalTechnologyGovernanceService.runSimulation(selectedScenario, tenantId, campusId);
      setSimulationResult(res);
      setIsSimulating(false);
      DigitalTechnologyGovernanceService.logAudit(
        tenantId,
        campusId,
        'usr_exec_01',
        'super_admin',
        'RUN_WHAT_IF_SIMULATION',
        'SimulationScenario',
        selectedScenario,
        `Executed what-if simulation: ${res.scenarioName}`
      );
    }, 400);
  };

  const tabs = [
    { id: 'command', label: '1. Executive Digital Command', icon: Activity },
    { id: 'strategy', label: '2. Digital Strategy', icon: TrendingUp },
    { id: 'architecture', label: '3. Enterprise Architecture', icon: Layers },
    { id: 'adr', label: '4. Architecture Decisions', icon: FileText },
    { id: 'portfolio', label: '5. Technology Portfolio', icon: Cpu },
    { id: 'applications', label: '6. Application Portfolio', icon: Database },
    { id: 'tech_debt', label: '7. Technical Debt', icon: Sliders },
    { id: 'it_service', label: '8. IT Service Governance', icon: Server },
    { id: 'itsm', label: '9. ITSM Governance', icon: Terminal },
    { id: 'cyber', label: '10. Cyber Resilience', icon: ShieldCheck },
    { id: 'cloud', label: '11. Cloud & Infrastructure', icon: Cloud },
    { id: 'risk', label: '12. Technology Risk', icon: AlertTriangle },
    { id: 'transformation', label: '13. Digital Transformation', icon: Zap },
    { id: 'financial', label: '14. Financial Governance', icon: DollarSign },
    { id: 'vendor', label: '15. Vendor Technology', icon: Building },
    { id: 'sandbox', label: '16. Resilience Sandbox', icon: Lock },
    { id: 'audit', label: '17. Diagnostics & Audit', icon: Search },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md text-xs font-mono font-semibold uppercase tracking-wider">
                Phase 7.69 Control Plane
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-xs font-mono font-semibold uppercase tracking-wider">
                Zero-Trust Active
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-2">
              Institutional Digital Transformation, Architecture, ITSM & Cyber Resilience Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Authoritative governance control plane for enterprise architecture, digital strategy, technology portfolio risk, service levels, and resilience simulations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700 text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Digital Maturity</div>
              <div className="text-lg font-bold text-cyan-400">{maturityScore}%</div>
            </div>
            <div className="bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700 text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Cyber Resilience</div>
              <div className="text-lg font-bold text-emerald-400">{cyberResilience}%</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex gap-1.5 overflow-x-auto mt-6 pt-4 border-t border-slate-800 pb-2 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white min-h-[500px]">
        {activeTab === 'command' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Executive Digital Command Center
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Digital Capability Maturity</div>
                <div className="text-3xl font-extrabold text-cyan-400 mt-2">{maturityScore}%</div>
                <div className="text-xs text-emerald-400 mt-2 font-medium">Target: 85.0% by Q4</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Architecture Compliance</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2">{eaCompliance}%</div>
                <div className="text-xs text-slate-300 mt-2">42 of 48 Standards Adhered</div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Portfolio Health Score</div>
                <div className="text-3xl font-extrabold text-blue-400 mt-2">{portfolioHealth.healthScore}%</div>
                <div className={`text-xs mt-2 font-semibold uppercase ${portfolioHealth.status === 'GREEN' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  Status: {portfolioHealth.status}
                </div>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <div className="text-xs text-slate-400">SLA Breach Risk Index</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-2">{slaRisk}%</div>
                <div className="text-xs text-slate-300 mt-2">1 Active Breach Watch</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Active Governance Gates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div>
                      <div className="text-sm font-medium">Cloud ERP Migration Phase 2</div>
                      <div className="text-xs text-slate-400">Architecture Review Board Gate</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-xs font-semibold">APPROVED</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div>
                      <div className="text-sm font-medium">Legacy Database Deprecation</div>
                      <div className="text-xs text-slate-400">Technical Debt Review</div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-semibold">PENDING REVIEW</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Live Diagnostic Findings</h3>
                <div className="space-y-3">
                  {findings.map((f) => (
                    <div key={f.id} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${f.severity === 'CRITICAL' ? 'text-rose-400' : f.severity === 'HIGH' ? 'text-amber-400' : 'text-cyan-400'}`} />
                      <div>
                        <div className="text-sm font-medium">{f.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{f.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Digital Strategy & Objectives
            </h2>
            <p className="text-sm text-slate-400">
              Governance of institutional digital transformation objectives, pillars, and time horizons.
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold">Institutional Digital Vision 2026-2030</h3>
                <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-xs">Active Strategy</span>
              </div>
              <p className="text-sm text-slate-300">
                "Deliver a fully integrated, zero-trust cloud ecosystem that empowers student success, accelerates cross-border research collaboration, and guarantees operational resilience."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Pillar 1</div>
                  <div className="text-sm font-bold mt-1">Cloud-First Architecture</div>
                  <div className="text-xs text-slate-400 mt-2">Status: 82% Implemented</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Pillar 2</div>
                  <div className="text-sm font-bold mt-1">Zero-Trust Security & Identity</div>
                  <div className="text-xs text-slate-400 mt-2">Status: 94% Implemented</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Pillar 3</div>
                  <div className="text-sm font-bold mt-1">Data-Driven Student Success</div>
                  <div className="text-xs text-slate-400 mt-2">Status: 75% Implemented</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Enterprise Architecture Governance
            </h2>
            <p className="text-sm text-slate-400">
              Architecture domains, principles, standards, and approved technology patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Core Architecture Principles</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span className="font-bold text-cyan-400">EA-01:</span> Cloud-First by Default for New Workloads
                  </li>
                  <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span className="font-bold text-cyan-400">EA-02:</span> API-First Integration & Microservices Decoupling
                  </li>
                  <li className="bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span className="font-bold text-cyan-400">EA-03:</span> Mandatory Zero-Trust Identity Federation
                  </li>
                </ul>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Technology Classification Standards</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span>PostgreSQL Enterprise Database</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">STANDARD</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span>Legacy File Share (SMBv1)</span>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-xs font-semibold">PROHIBITED</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded border border-slate-800">
                    <span>Custom On-Prem Auth Server</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-semibold">EXCEPTION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adr' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Architecture Decision Records (ADRs)
            </h2>
            <p className="text-sm text-slate-400">
              Immutable record of major technical decisions, context, and consequences.
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-cyan-400 font-bold">ADR-2026-042</span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">APPROVED</span>
              </div>
              <h3 className="text-md font-bold">Adoption of GraphQL Enterprise Gateway for Student Portal</h3>
              <p className="text-sm text-slate-300">
                <strong>Context:</strong> Multiple REST endpoints causing over-fetching on mobile student portal. <br />
                <strong>Decision:</strong> Adopt unified GraphQL gateway proxying backend microservices. <br />
                <strong>Consequences:</strong> Reduces mobile payload bandwidth by 65%; requires gateway caching rules.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Technology Portfolio Governance
            </h2>
            <p className="text-sm text-slate-400">
              Tracking software assets, hardware inventory, obsolescence risk, and vendor concentrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Active Technology Assets</div>
                <div className="text-2xl font-bold text-white mt-1">143 Items</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Obsolescence Risk (EOL &lt; 12mo)</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">8 Assets</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Cloud Concentration Share</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">68.4% (AWS)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Application Governance & Criticality
            </h2>
            <p className="text-sm text-slate-400">
              Criticality profiles, RTO/RPO objectives, and risk observations for enterprise applications.
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 uppercase text-xs">
                    <th className="p-3">Application Name</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Criticality</th>
                    <th className="p-3">RTO / RPO</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3 font-medium">Banner Student Information System</td>
                    <td className="p-3 text-slate-300">Academic Operations</td>
                    <td className="p-3"><span className="text-rose-400 font-bold">MISSION_CRITICAL</span></td>
                    <td className="p-3 text-slate-300">2 hrs / 1 hr</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">ACTIVE</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Canvas Learning Management</td>
                    <td className="p-3 text-slate-300">Teaching & Learning</td>
                    <td className="p-3"><span className="text-rose-400 font-bold">MISSION_CRITICAL</span></td>
                    <td className="p-3 text-slate-300">4 hrs / 2 hrs</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">ACTIVE</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Workday Cloud ERP</td>
                    <td className="p-3 text-slate-300">Finance & HR</td>
                    <td className="p-3"><span className="text-amber-400 font-bold">BUSINESS_CRITICAL</span></td>
                    <td className="p-3 text-slate-300">8 hrs / 4 hrs</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">ACTIVE</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tech_debt' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Technical Debt & Modernization Priorities
            </h2>
            <p className="text-sm text-slate-400">
              Quantification of technical debt, remediation effort, and modernization backlog.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Debt by Category</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Legacy Codebases</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Outdated Infrastructure</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Total Remediation Budget</h3>
                  <div className="text-3xl font-extrabold text-cyan-400 mt-2">$420,000</div>
                  <p className="text-xs text-slate-400 mt-1">Estimated effort: 3,400 engineering hours across 6 core applications.</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition">
                  Export Modernization Roadmap
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'it_service' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              IT Service Governance & SLA Monitoring
            </h2>
            <p className="text-sm text-slate-400">
              Reference-only SLA performance, service availability, and business continuity readiness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Enterprise Service Uptime</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">99.94%</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">SLA Compliance Rate</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">98.2%</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">DR Verified Services</div>
                <div className="text-2xl font-bold text-blue-400 mt-1">38 / 40</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itsm' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              ITSM Governance (Reference-Only)
            </h2>
            <p className="text-sm text-slate-400">
              Reference observations of authoritative ITSM records (Incident, Problem, Change, Emergency Changes).
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 uppercase font-mono">Integration Source: ServiceNow / Jira Service Management</span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">SYNCHRONIZED</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Open Incidents</div>
                  <div className="text-xl font-bold text-white mt-1">14</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Major Incidents (YTD)</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">2</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Change Success Rate</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">99.1%</div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400">Emergency Change Rate</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">1.8%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cyber' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Cyber Resilience & Security Governance
            </h2>
            <p className="text-sm text-slate-400">
              Governance over security controls, vulnerability exposure, IAM risk, and ransomware resilience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Security Control Framework (NIST CSF)</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Identify & Protect</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Detect & Respond</span>
                      <span>89%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Identity & Privileged Access Risk</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span>MFA Enforcement Rate</span>
                    <span className="font-bold text-emerald-400">98.5%</span>
                  </li>
                  <li className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span>Stale Privileged Accounts</span>
                    <span className="font-bold text-amber-400">3 Accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Cloud className="w-5 h-5 text-cyan-400" />
              Cloud & Infrastructure Governance
            </h2>
            <p className="text-sm text-slate-400">
              Monitoring cloud posture, concentration risk, availability zones, and capacity utilization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Cloud Compliance Score</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">96.8%</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">CPU Saturation Average</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">42.1%</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Multi-AZ Redundancy</div>
                <div className="text-2xl font-bold text-blue-400 mt-1">100% Core</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              Technology Risk & Exception Governance
            </h2>
            <p className="text-sm text-slate-400">
              Governing technology risks, architecture exceptions, and risk acceptances under Four-Eyes SoD.
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Active Technology Risks</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <div className="text-sm font-medium">Single-Vendor Concentration in Cloud Storage</div>
                    <div className="text-xs text-slate-400">Assessed by Risk Committee • Bounded Mitigation Active</div>
                  </div>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-semibold">HIGH RISK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transformation' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Digital Transformation Control Tower
            </h2>
            <p className="text-sm text-slate-400">
              Portfolio health, milestone delivery, benefit realization, and initiative tracking.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Active Transformation Initiatives</h3>
                <div className="space-y-3">
                  <div className="bg-slate-900/60 p-3 rounded border border-slate-800">
                    <div className="flex justify-between font-medium">
                      <span>Next-Gen Cloud ERP Migration</span>
                      <span className="text-cyan-400">65% Complete</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Benefit Realization</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span>Operational Cost Reduction</span>
                    <span className="font-bold text-emerald-400">$1.2M Realized</span>
                  </div>
                  <div className="flex justify-between bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <span>Process Automation Gain</span>
                    <span className="font-bold text-cyan-400">45% Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              IT Financial Governance & TCO
            </h2>
            <p className="text-sm text-slate-400">
              Reference-only cost observations, TCO analysis, and cloud spend optimization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Annual IT Budget Spend</div>
                <div className="text-2xl font-bold text-white mt-1">$14.8M</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Cloud Monthly Run Rate</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">$185,000</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400">Budget Variance</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">-2.1% (Favorable)</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendor' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              Vendor & Third-Party Technology Risk
            </h2>
            <p className="text-sm text-slate-400">
              Vendor risk ratings, SOC2/ISO compliance verification, and exit transition readiness.
            </p>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Key Technology Vendors</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <div className="text-sm font-medium">Amazon Web Services (AWS)</div>
                    <div className="text-xs text-slate-400">SOC2 Type 2 Verified • ISO 27001 Certified</div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold">LOW RISK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-4 text-center">
              <div className="text-amber-400 font-extrabold uppercase tracking-widest text-sm">
                SIMULATION ONLY — SANDBOX MODE ACTIVE — ZERO PRODUCTION MUTATION
              </div>
              <p className="text-xs text-slate-300 mt-1">
                All scenarios execute in isolated in-memory simulation state. No operational systems or database records are mutated.
              </p>
            </div>

            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              What-If Digital Resilience Simulation Sandbox
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Select Disaster Scenario</h3>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value as SimulationScenarioType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="CLOUD_PROVIDER_OUTAGE">Cloud Provider Outage</option>
                  <option value="DATA_CENTER_OUTAGE">Data Center Power Failure</option>
                  <option value="RANSOMWARE_EVENT">Distributed Ransomware Outbreak</option>
                  <option value="CRITICAL_APPLICATION_FAILURE">Core SIS Database Corruption</option>
                  <option value="NETWORK_BACKBONE_FAILURE">Campus Fiber Backbone Severance</option>
                  <option value="IDENTITY_PROVIDER_OUTAGE">Federated Identity Provider Outage</option>
                  <option value="MASS_ACCOUNT_LOCKOUT">Mass Account Lockout Storm</option>
                  <option value="MAJOR_VENDOR_WITHDRAWAL">Major Software Vendor Withdrawal</option>
                  <option value="TECHNOLOGY_SUPPLY_SHORTAGE">Global Silicon Supply Shortage</option>
                  <option value="CYBER_INCIDENT_ESCALATION">Research Espionage Incursion</option>
                  <option value="DATA_PLATFORM_FAILURE">Institutional Data Lakehouse Failure</option>
                  <option value="API_INTEGRATION_FAILURE">API Gateway Collapse</option>
                  <option value="DISASTER_RECOVERY_FAILURE">Failed DR Failover Exercise</option>
                  <option value="DIGITAL_TRANSFORMATION_DELAY">Multi-Million ERP Schedule Slippage</option>
                  <option value="TECHNOLOGY_BUDGET_REDUCTION">Sudden IT Budget Rescission</option>
                </select>

                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isSimulating ? 'Executing Simulation...' : 'Run Resilience Simulation'}
                </button>
              </div>

              <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Simulation Output & Impact Analysis</h3>
                {simulationResult ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div>
                        <div className="text-base font-bold text-cyan-400">{simulationResult.scenarioName}</div>
                        <div className="text-xs text-slate-400 mt-1">{simulationResult.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Resilience Impact</div>
                        <div className="text-lg font-bold text-amber-400">{simulationResult.resilienceImpactScore}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                        <div className="text-xs font-semibold text-slate-400 uppercase">Affected Applications</div>
                        <ul className="mt-2 space-y-1 text-sm text-slate-300">
                          {simulationResult.affectedApplications.map((app, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                        <div className="text-xs font-semibold text-slate-400 uppercase">Financial Exposure Estimate</div>
                        <div className="text-2xl font-extrabold text-rose-400 mt-2">
                          ${simulationResult.financialExposureEstimate.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Calculated business interruption exposure</div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <div className="text-xs font-semibold text-slate-400 uppercase mb-2">Mitigation Recommendations</div>
                      <ul className="space-y-2 text-sm text-slate-300">
                        {simulationResult.mitigationRecommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    Select a disaster scenario on the left and click "Run Resilience Simulation" to generate impact projections.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              Diagnostics & Immutable Audit Trail
            </h2>
            <p className="text-sm text-slate-400">
              Append-only cryptographic lineage audit logs and automated technical health diagnostics.
            </p>

            <div className="space-y-4">
              <h3 className="text-md font-bold">Immutable Audit Log (Create-Only)</h3>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 uppercase text-xs">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity Reference</th>
                      <th className="p-3">State Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-xs">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="p-3 text-slate-300">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-3 text-cyan-400">{log.actorId} ({log.actorRole})</td>
                          <td className="p-3 font-bold text-white">{log.action}</td>
                          <td className="p-3 text-slate-300">{log.entityType}: {log.entityId}</td>
                          <td className="p-3 text-emerald-400">{log.resultingStateHash}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 font-sans">
                          No audit events recorded in current session. Run a simulation or governance action to generate audit lineage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
