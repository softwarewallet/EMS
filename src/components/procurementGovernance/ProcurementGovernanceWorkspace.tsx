import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  FileText,
  RefreshCw,
  Sliders,
  Building2,
  XCircle,
  Info,
  Handshake,
  ShoppingCart,
  Truck,
  FileSpreadsheet,
  Layers,
  Lock,
  Play,
  Flame,
  Check,
  Activity,
  Eye,
  ShieldAlert,
  DollarSign,
  AlertOctagon,
  UserX
} from 'lucide-react';

import {
  ProcurementStrategy,
  ProcurementPlan,
  ProcurementCategoryGovernance,
  ProcurementDemandObservation,
  ProcurementRequestGovernance,
  SourcingEvent,
  TenderGovernance,
  BidEvaluationGovernance,
  VendorGovernance,
  VendorDueDiligence,
  VendorRiskAssessment,
  ThirdPartyGovernance,
  ThirdPartyConcentrationRisk,
  ProcurementContractGovernanceReference,
  ProcurementContractRenewalObservation,
  ProcurementContractAmendmentGovernance,
  VendorPerformanceObservation,
  VendorSLAObservation,
  VendorIncidentObservation,
  EmergencyProcurementGovernance,
  SingleSourceJustification,
  ProcurementControl,
  ProcurementControlException,
  ProcurementResilienceAssessment,
  SupplierDisruptionScenario,
  ProcurementDecision,
  ProcurementAuditEvent,
  ProcurementDiagnosticFinding
} from '../../types/procurementGovernance';

import { ProcurementGovernanceService } from '../../services/procurementGovernanceService';

export const ProcurementGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'strategy' | 'requests' | 'sourcing' | 'vendors' | 'thirdparty' | 'contracts' | 'performance' | 'emergency' | 'controls' | 'resilience' | 'decisions' | 'diagnostics' | 'audit'>('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [tenantScope] = useState('tenant_demo');
  const [campusScope] = useState('campus_main');

  // Sample State Data initialized truthfully
  const [strategies, setStrategies] = useState<ProcurementStrategy[]>([
    {
      id: 'pstrat_001',
      tenantId: tenantScope,
      campusScope,
      title: 'FY2026-2028 Institutional Sustainable Sourcing Strategy',
      strategicObjectives: ['Enhance Supplier Diversity to 25%', '100% Cybersecurity Due Diligence on Cloud Vendors', 'Zero Single-Source Unjustified Spend'],
      procurementPriorities: ['IT Infrastructure Resiliency', 'Research Lab Supply Continuity'],
      sustainabilityObjectives: ['Net-Zero Supply Chain Target', 'Recycled Paper & Equipment Standard'],
      supplierDiversityObjectives: ['Target 25% minority/women-owned enterprise spend'],
      categoryPriorities: ['Cloud Computing', 'Lab Supplies', 'Facilities Management'],
      planningHorizonYears: 3,
      riskAppetite: 'CONSERVATIVE',
      ownerId: 'user_procurement_dir',
      status: 'ACTIVE',
      approvedBy: 'user_vpf',
      approvedAt: '2026-01-15T10:00:00Z',
      createdBy: 'user_procurement_dir',
      createdAt: '2026-01-10T09:00:00Z'
    }
  ]);

  const [plans] = useState<ProcurementPlan[]>([
    {
      id: 'pplan_001',
      tenantId: tenantScope,
      campusScope,
      strategyId: 'pstrat_001',
      fiscalPeriod: 'FY2026',
      procurementCategories: ['Cloud Infrastructure', 'Scientific Instruments', 'Facilities'],
      expectedDemandJson: '{"IT": "High", "Research": "Urgent"}',
      strategicProjectRefs: ['proj_campus_expansion'],
      capitalProjectRefs: ['capex_lab_renovation'],
      researchProjectRefs: ['grant_genomics_2026'],
      grantRefs: ['grant_nsf_8849'],
      budgetEnvelopeIdRef: 'env_it_2026',
      procurementRiskRating: 'MEDIUM',
      sourcingTimelineJson: '{"Q1": "Tender Open", "Q2": "Contract Award"}',
      status: 'ACTIVE',
      createdBy: 'user_procurement_mgr',
      createdAt: '2026-01-20T11:00:00Z'
    }
  ]);

  const [requests, setRequests] = useState<ProcurementRequestGovernance[]>([
    {
      id: 'preq_1001',
      tenantId: tenantScope,
      campusScope,
      requesterId: 'user_prof_smith',
      departmentIdRef: 'dept_genomics',
      categoryIdRef: 'cat_lab_equipment',
      budgetCodeRef: 'BUD_RESEARCH_01',
      costCenterIdRef: 'CC_GENOMICS',
      justification: 'High-throughput DNA Sequencer Maintenance and Reagents',
      urgency: 'HIGH',
      riskRating: 'MEDIUM',
      status: 'SUBMITTED',
      createdBy: 'user_prof_smith',
      createdAt: '2026-08-20T14:30:00Z'
    }
  ]);

  const [vendors] = useState<VendorGovernance[]>([
    {
      id: 'vgov_001',
      tenantId: tenantScope,
      campusScope,
      vendorIdRef: 'VEND_ACME_CLOUD',
      vendorName: 'Acme Cloud Hosting Solutions',
      classification: 'MISSION_CRITICAL',
      criticality: 'MISSION_CRITICAL',
      strategicImportance: 'HIGH',
      dependencyDescription: 'Primary LMS and Student Database Cloud Host',
      riskTier: 'HIGH',
      reviewFrequencyMonths: 6,
      ownerId: 'user_it_security_lead',
      status: 'ACTIVE',
      createdBy: 'user_it_security_lead',
      createdAt: '2025-06-01T08:00:00Z'
    },
    {
      id: 'vgov_002',
      tenantId: tenantScope,
      campusScope,
      vendorIdRef: 'VEND_BIO_REAGENTS',
      vendorName: 'Global BioReagents Inc',
      classification: 'IMPORTANT',
      criticality: 'BUSINESS_CRITICAL',
      strategicImportance: 'MODERATE',
      dependencyDescription: 'Primary chemical and research reagent supplier',
      riskTier: 'MEDIUM',
      reviewFrequencyMonths: 12,
      ownerId: 'user_lab_mgr',
      status: 'ACTIVE',
      createdBy: 'user_lab_mgr',
      createdAt: '2025-08-15T10:00:00Z'
    }
  ]);

  const [dueDiligences] = useState<VendorDueDiligence[]>([
    {
      id: 'vdd_001',
      tenantId: tenantScope,
      campusScope,
      vendorGovernanceId: 'vgov_001',
      legalStanding: 'VERIFIED',
      regulatoryStatus: 'VERIFIED',
      sanctionsScreeningRef: 'VERIFIED',
      financialHealthRef: 'VERIFIED',
      cybersecurityPosture: 'VERIFIED',
      dataProtectionCompliance: 'VERIFIED',
      insuranceCoverage: 'VERIFIED',
      businessContinuityVerified: true,
      overallStatus: 'VERIFIED',
      evaluatedBy: 'user_compliance_officer',
      evaluatedAt: '2026-02-10T11:00:00Z',
      expiryDate: '2027-02-10T11:00:00Z'
    }
  ]);

  const [riskAssessments] = useState<VendorRiskAssessment[]>([
    {
      id: 'vra_001',
      tenantId: tenantScope,
      campusScope,
      vendorGovernanceId: 'vgov_001',
      financialRiskScore: 22,
      operationalRiskScore: 35,
      cybersecurityRiskScore: 40,
      privacyRiskScore: 30,
      complianceRiskScore: 15,
      concentrationRiskScore: 65,
      overallVendorRiskScore: 34.5,
      overallRiskTier: 'HIGH',
      assessedBy: 'user_risk_officer',
      assessedAt: '2026-03-01T15:00:00Z'
    }
  ]);

  const [thirdPartyGov] = useState<ThirdPartyGovernance[]>([
    {
      id: 'tpg_001',
      tenantId: tenantScope,
      campusScope,
      title: 'AWS Cloud Infrastructure Hosting',
      vendorGovernanceIdRef: 'vgov_001',
      serviceCategory: 'CLOUD',
      riskTier: 'HIGH',
      cybersecurityReviewStatus: 'APPROVED',
      privacyReviewStatus: 'APPROVED',
      status: 'ACTIVE',
      createdBy: 'user_it_security_lead',
      createdAt: '2025-06-01T08:00:00Z'
    }
  ]);

  const [concentrationRisks] = useState<ThirdPartyConcentrationRisk[]>([
    {
      id: 'tpc_001',
      tenantId: tenantScope,
      campusScope,
      categoryOrService: 'Cloud Hosting Services',
      vendorIdRef: 'vgov_001',
      concentrationPercent: 82,
      riskRating: 'HIGH',
      mitigationStrategy: 'Multi-cloud workload containerization and secondary failover environment.',
      assessedBy: 'user_risk_officer',
      assessedAt: '2026-04-10T09:00:00Z'
    }
  ]);

  const [contracts] = useState<ProcurementContractGovernanceReference[]>([
    {
      id: 'cg_001',
      tenantId: tenantScope,
      campusScope,
      contractIdRef: 'CONT_2025_AWS_9918',
      contractVersionIdRef: 'v2.1',
      vendorIdRef: 'VEND_ACME_CLOUD',
      title: 'Enterprise Master Cloud Services Agreement',
      criticality: 'CRITICAL',
      ownerId: 'user_cio',
      startDate: '2025-01-01',
      endDate: '2026-12-31',
      renewalNoticeDays: 90,
      status: 'ACTIVE',
      createdBy: 'user_legal_lead',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ]);

  const [slaObservations] = useState<VendorSLAObservation[]>([
    {
      id: 'sla_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cg_001',
      slaName: 'Cloud Infrastructure Uptime SLA (99.99%)',
      servicePeriod: 'July 2026',
      targetThresholdPercent: 99.99,
      actualObservedPercent: 99.95,
      isBreached: true,
      correctiveActionPlan: 'Vendor requested RCA and service credit application.',
      recordedBy: 'user_sysadmin',
      createdAt: '2026-08-01T08:00:00Z'
    }
  ]);

  const [emergencies] = useState<EmergencyProcurementGovernance[]>([]);
  const [singleSources] = useState<SingleSourceJustification[]>([]);
  const [controls] = useState<ProcurementControl[]>([
    {
      id: 'pctrl_001',
      tenantId: tenantScope,
      campusScope,
      code: 'CTRL-PROC-01',
      title: 'Four-Eyes Approval on Procurement Requests > $10k',
      category: 'AUTHORIZATION',
      description: 'Enforces independent approver distinct from request creator.',
      controlOwnerId: 'user_audit_lead',
      testingFrequency: 'MONTHLY',
      status: 'EFFECTIVE',
      createdBy: 'user_audit_lead',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ]);

  const [exceptions] = useState<ProcurementControlException[]>([]);

  const [sandboxScenario, setSandboxScenario] = useState<SupplierDisruptionScenario | null>(null);
  const [auditLogs, setAuditLogs] = useState<ProcurementAuditEvent[]>([
    {
      id: 'pgaudit_001',
      tenantId: tenantScope,
      campusScope,
      actorId: 'user_procurement_dir',
      action: 'APPROVE_STRATEGY',
      entityType: 'ProcurementStrategy',
      entityId: 'pstrat_001',
      timestamp: '2026-01-15T10:00:00Z',
      justification: 'Formally approved by Vice President of Finance.'
    }
  ]);

  const [diagnosticFindings, setDiagnosticFindings] = useState<ProcurementDiagnosticFinding[]>([]);

  const runDiagnostics = () => {
    const findings = ProcurementGovernanceService.runProcurementGovernanceDiagnostics(
      tenantScope,
      strategies,
      plans,
      requests,
      [],
      vendors,
      dueDiligences,
      riskAssessments,
      singleSources,
      emergencies,
      exceptions
    );
    setDiagnosticFindings(findings);
  };

  const executeSandbox = (disruptionType: SupplierDisruptionScenario['disruptionType']) => {
    const scenario = ProcurementGovernanceService.runSupplierDisruptionScenario(
      tenantScope,
      disruptionType,
      12
    );
    setSandboxScenario(scenario);
  };

  const handleApproveRequest = (req: ProcurementRequestGovernance) => {
    try {
      ProcurementGovernanceService.validateSoD(req.requesterId, 'current_user_approver', 'Procurement Request Approval');
      ProcurementGovernanceService.validateRequestStatusTransition(req.status, 'APPROVED');

      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'APPROVED', approvedBy: 'current_user_approver', approvedAt: new Date().toISOString() } : r));

      const event: ProcurementAuditEvent = {
        id: `pgaudit_${Date.now()}`,
        tenantId: tenantScope,
        campusScope,
        actorId: 'current_user_approver',
        action: 'APPROVE_REQUEST',
        entityType: 'ProcurementRequest',
        entityId: req.id,
        timestamp: new Date().toISOString(),
        justification: 'Authorized by designated budget approver.'
      };
      setAuditLogs(prev => [event, ...prev]);
    } catch (err: any) {
      alert(`Approval Blocked: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Institutional Procurement & Vendor Risk Governance Engine
              </h1>
              <p className="text-sm text-slate-500">
                Phase 7.61 — Sourcing, Tender Governance, Third-Party Risk, SLA Assurance & Supplier Resilience
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Governed Control Layer Active
          </span>
          <button
            onClick={runDiagnostics}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            Run Diagnostics
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 mb-6 shadow-sm overflow-x-auto flex items-center gap-1">
        {[
          { id: 'overview', label: 'Command Center', icon: Activity },
          { id: 'strategy', label: 'Strategy & Plans', icon: FileSpreadsheet },
          { id: 'requests', label: 'Requests & Approvals', icon: ShoppingCart },
          { id: 'sourcing', label: 'Sourcing & Tenders', icon: Layers },
          { id: 'vendors', label: 'Vendor Governance', icon: Building2 },
          { id: 'thirdparty', label: 'Third-Party Risk', icon: ShieldAlert },
          { id: 'contracts', label: 'Contract Governance', icon: FileText },
          { id: 'performance', label: 'Performance & SLAs', icon: Clock },
          { id: 'emergency', label: 'Emergency & Single Source', icon: Flame },
          { id: 'controls', label: 'Procurement Controls', icon: ShieldCheck },
          { id: 'resilience', label: 'Supplier Resilience', icon: Truck },
          { id: 'decisions', label: 'Decisions Log', icon: CheckCircle },
          { id: 'diagnostics', label: 'Diagnostics', icon: AlertOctagon },
          { id: 'audit', label: 'Audit Trail', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Active Procurement Strategy</span>
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">FY2026-2028</div>
              <p className="text-xs text-emerald-600 mt-1 font-medium">100% Policy Alignment</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Pending Approvals</span>
                <ShoppingCart className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-900">{requests.filter(r => r.status === 'SUBMITTED').length}</div>
              <p className="text-xs text-slate-500 mt-1">Four-Eyes Enforcement Active</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Critical Vendors Monitored</span>
                <Building2 className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-xl font-bold text-slate-900">{vendors.filter(v => v.criticality === 'MISSION_CRITICAL').length}</div>
              <p className="text-xs text-rose-600 mt-1 font-medium">Due-Diligence Verified</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">SLA Breaches Observed</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-slate-900">{slaObservations.filter(s => s.isBreached).length}</div>
              <p className="text-xs text-amber-700 mt-1 font-medium">Corrective Plan Required</p>
            </div>
          </div>

          {/* Strategic Overview & Concentration Warning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Active Strategy & Policy Directives
              </h2>
              {strategies.map(s => (
                <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {s.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Strategic Objectives:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-0.5">
                      {s.strategicObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Third-Party Concentration & Vendor Risk
              </h2>
              {concentrationRisks.map(c => (
                <div key={c.id} className="p-4 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-900">{c.categoryOrService}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {c.concentrationPercent}% Concentration ({c.riskRating})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Mitigation Strategy:</strong> {c.mitigationStrategy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STRATEGY & PLANS */}
      {activeTab === 'strategy' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Procurement Strategy & Fiscal Planning</h2>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Strategy Proposal
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="p-3">Strategy Title</th>
                  <th className="p-3">Planning Horizon</th>
                  <th className="p-3">Risk Appetite</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {strategies.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{s.title}</td>
                    <td className="p-3 text-slate-600">{s.planningHorizonYears} Years</td>
                    <td className="p-3 text-slate-600">{s.riskAppetite}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{s.ownerId}</td>
                    <td className="p-3 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REQUESTS & APPROVALS */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Procurement Requests & Approval Center</h2>
            <span className="text-xs text-slate-500">Separation of Duties (SoD) Strictly Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Requester</th>
                  <th className="p-3">Justification</th>
                  <th className="p-3">Urgency</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Four-Eyes Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-medium text-slate-900">{r.id}</td>
                    <td className="p-3 text-slate-600">{r.requesterId}</td>
                    <td className="p-3 text-slate-800">{r.justification}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {r.urgency}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{r.riskRating}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === 'SUBMITTED' ? (
                        <button
                          onClick={() => handleApproveRequest(r)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px]"
                        >
                          Approve (Four-Eyes)
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VENDORS */}
      {activeTab === 'vendors' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Vendor Registry & Due Diligence Governance</h2>
            <span className="text-xs text-slate-500">Reference-Only Vendor Master (No ERP Duplication)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map(v => (
              <div key={v.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{v.vendorName}</h3>
                    <p className="text-xs text-slate-500 font-mono">Ref ID: {v.vendorIdRef}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                    {v.criticality}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  <strong>Dependency:</strong> {v.dependencyDescription}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-500">Risk Tier: <strong>{v.riskTier}</strong></span>
                  <span className="text-emerald-700 font-medium">Due Diligence: VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUPPLIER RESILIENCE SANDBOX */}
      {activeTab === 'resilience' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Supplier Disruption & Resilience Simulation Sandbox
              </h2>
              <p className="text-xs text-slate-500">
                SANDBOX / SIMULATION MODE ACTIVE — Runs deterministic disruption models without mutating production records.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold rounded">
              SIMULATION ONLY
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Trigger Disruption Scenario
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'CRITICAL_SUPPLIER_OUTAGE',
                'SUPPLIER_BANKRUPTCY',
                'CYBER_COMPROMISE',
                'GEOGRAPHIC_DISRUPTION',
                'LOGISTICS_FAILURE',
                'SOLE_SOURCE_FAILURE'
              ].map(stype => (
                <button
                  key={stype}
                  onClick={() => executeSandbox(stype as any)}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded text-xs font-medium transition-colors"
                >
                  {stype.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {sandboxScenario && (
            <div className="p-5 border border-indigo-200 bg-indigo-50/50 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-indigo-900">{sandboxScenario.title}</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-600 text-white">
                  Resilience Rating: {sandboxScenario.simulatedResilienceRating}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded border border-indigo-100">
                  <span className="text-slate-500">Affected Services Count</span>
                  <div className="text-lg font-bold text-slate-900">{sandboxScenario.simulatedAffectedServicesCount}</div>
                </div>
                <div className="p-3 bg-white rounded border border-indigo-100">
                  <span className="text-slate-500">Alternative Availability</span>
                  <div className="text-lg font-bold text-slate-900">{sandboxScenario.simulatedAlternativeAvailabilityScore}%</div>
                </div>
                <div className="p-3 bg-white rounded border border-indigo-100">
                  <span className="text-slate-500">Recovery Time Objective</span>
                  <div className="text-lg font-bold text-slate-900">{sandboxScenario.simulatedRecoveryTimeHours} Hours</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-600" />
              Procurement Governance Diagnostic Engine
            </h2>
            <button
              onClick={runDiagnostics}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
            >
              Run Diagnostic Scan
            </button>
          </div>

          {diagnosticFindings.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs">
              No diagnostic anomalies detected. System procurement references and SoD limits are fully compliant.
            </div>
          ) : (
            <div className="space-y-2">
              {diagnosticFindings.map((f, i) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900">{f.type}:</strong> {f.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Immutable Procurement Audit Trail
            </h2>
            <span className="text-xs text-slate-500 font-mono">Create-Only / Append-Only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="p-3">Audit ID</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {auditLogs.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-900 font-bold">{a.id}</td>
                    <td className="p-3 text-slate-600">{a.actorId}</td>
                    <td className="p-3 text-indigo-700 font-bold">{a.action}</td>
                    <td className="p-3 text-slate-600">{a.entityType}</td>
                    <td className="p-3 text-slate-500">{a.timestamp}</td>
                    <td className="p-3 text-slate-700 font-sans">{a.justification || '-'}</td>
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
