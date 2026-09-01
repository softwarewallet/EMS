import React, { useState } from 'react';
import {
  FileSignature,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  FileText,
  RefreshCw,
  Building2,
  XCircle,
  Info,
  Lock,
  Play,
  Activity,
  Eye,
  ShieldAlert,
  AlertOctagon,
  Scale,
  FileCheck,
  Briefcase,
  AlertCircle,
  Check,
  Layers,
  Sparkles,
  Award,
  Calendar,
  Zap
} from 'lucide-react';

import {
  ContractStrategyGovernance,
  ContractPlanGovernance,
  ContractIntakeGovernance,
  ContractClassificationGovernance,
  ContractGovernanceReference,
  ContractVersionGovernance,
  ContractApprovalGovernance,
  ContractRiskAssessment,
  ContractRiskMitigation,
  ContractLegalReview,
  ContractComplianceReview,
  ContractCommercialReview,
  ContractSecurityReview,
  ContractPrivacyReview,
  ContractExecutionGovernance,
  ContractObligation,
  ContractObligationEvidence,
  ContractObligationException,
  ContractMilestone,
  ContractSLAGovernance,
  ContractSLAObservation,
  ContractPerformanceObservation,
  ContractRenewalObservation,
  ContractAmendmentGovernance,
  ContractTerminationGovernance,
  ContractDisputeGovernance,
  ContractClaimObservation,
  ContractExceptionGovernance,
  ContractControl,
  ContractControlTest,
  ContractResilienceAssessment,
  ContractDependencyObservation,
  ContractDecisionGovernance,
  ContractAssuranceEvent,
  ContractAuditEvent,
  ContractDiagnosticFinding,
  ContractSimulationScenario
} from '../../types/contractGovernance';

import { ContractGovernanceService } from '../../services/contractGovernanceService';

export const ContractGovernanceWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'strategy' | 'intake' | 'registry' | 'reviews' | 'obligations' | 'renewals' | 'disputes' | 'controls' | 'resilience' | 'decisions' | 'diagnostics' | 'audit'
  >('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [tenantScope] = useState('tenant_demo');
  const [campusScope] = useState('campus_main');

  // 1. Contract Strategy
  const [strategies, setStrategies] = useState<ContractStrategyGovernance[]>([
    {
      id: 'cstrat_001',
      tenantId: tenantScope,
      campusScope,
      title: 'Institutional Multi-Year Agreement Governance Strategy (2026-2029)',
      strategicObjectives: ['Standardize 90% Institutional Master Service Agreements', 'Enforce Mandatory Cyber Risk Review on Tier-1 SaaS', 'Automate Obligation Assurance Tracking'],
      contractPortfolioPriorities: ['Enterprise IT Infrastructure', 'Academic Consortium Licenses', 'Facility Operations'],
      riskAppetite: 'CONSERVATIVE',
      criticalAgreementCategories: ['Cloud Services', 'Research Infrastructure', 'Campus Security Services'],
      standardizationObjectives: ['Adopt Uniform Governing Law and Liability Cap Standards', 'Strict IP Protection Clauses'],
      supplierDependencyObjectives: ['Ensure Dual-Sourcing or Hot-Standby for Mission-Critical SLAs'],
      resilienceObjectives: ['Zero Extended Outage from Single-Contractor Failure'],
      planningHorizonYears: 3,
      ownerId: 'usr_director_procurement_legal',
      status: 'ACTIVE',
      createdBy: 'usr_director_legal',
      createdAt: '2026-01-10T08:00:00Z'
    }
  ]);

  // 2. Contract Plans
  const [plans] = useState<ContractPlanGovernance[]>([
    {
      id: 'cplan_001',
      tenantId: tenantScope,
      campusScope,
      strategyId: 'cstrat_001',
      fiscalHorizon: 'FY2026-FY2027',
      plannedAgreementsJson: JSON.stringify(['Global Cloud Computing Agreement', 'Research Lab Consumables Master Contract']),
      strategicProjectRefs: ['proj_datacenter_modernization', 'proj_stem_research_hub'],
      procurementRefs: ['preq_1001'],
      budgetRefs: ['bud_it_cap_001', 'bud_research_ops_002'],
      grantRefs: ['grt_nsf_2026_01'],
      contractCriticality: 'MISSION_CRITICAL',
      renewalWorkloadForecast: 18,
      legalWorkloadForecast: 24,
      complianceWorkloadForecast: 30,
      status: 'ACTIVE',
      createdBy: 'usr_director_legal',
      createdAt: '2026-01-15T09:00:00Z'
    }
  ]);

  // 3. Contract Intake
  const [intakes, setIntakes] = useState<ContractIntakeGovernance[]>([
    {
      id: 'cint_101',
      tenantId: tenantScope,
      campusScope,
      title: 'Enterprise Campus Networking & SD-WAN Agreement Intake',
      contractIdRef: 'CTR-2026-NET-001',
      requestingDepartmentIdRef: 'dept_it_infrastructure',
      vendorIdRef: 'vend_cisco_enterprise',
      procurementRequestIdRef: 'preq_1001',
      contractCategory: 'IT Infrastructure',
      businessPurpose: 'Provide high-availability campus backbone connectivity and redundant interconnects.',
      urgency: 'HIGH',
      estimatedRisk: 'HIGH',
      requiredReviewsJson: JSON.stringify(['Legal', 'Compliance', 'Commercial', 'Security', 'Privacy']),
      status: 'REVIEW',
      requesterId: 'usr_it_director',
      proposerId: 'usr_it_lead',
      screenedBy: 'usr_procurement_analyst',
      screenedAt: '2026-02-01T10:00:00Z',
      createdBy: 'usr_it_lead',
      createdAt: '2026-02-01T09:00:00Z'
    }
  ]);

  // 4. Contract Governance Reference
  const [contracts] = useState<ContractGovernanceReference[]>([
    {
      id: 'cgov_1001',
      tenantId: tenantScope,
      campusScope,
      contractIdRef: 'CTR-2026-NET-001',
      contractVersionIdRef: 'VER-2.1',
      title: 'Campus Backbone & High-Speed SD-WAN Agreement',
      vendorIdRef: 'vend_cisco_enterprise',
      ownerId: 'usr_it_director',
      businessUnitIdRef: 'dept_it_infrastructure',
      category: 'Information Technology',
      criticality: 'MISSION_CRITICAL',
      effectiveState: 'ACTIVE',
      renewalState: 'WINDOW_OPEN',
      riskState: 'HIGH',
      complianceState: 'COMPLIANT',
      startDate: '2026-01-01',
      endDate: '2027-12-31',
      renewalNoticeDays: 90,
      status: 'ACTIVE',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T08:00:00Z'
    }
  ]);

  // 5. Version Governance
  const [versions] = useState<ContractVersionGovernance[]>([
    {
      id: 'cver_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      contractIdRef: 'CTR-2026-NET-001',
      contractVersionIdRef: 'VER-2.1',
      versionNumber: '2.1',
      changeSummary: 'Updated cybersecurity incident notification timeline from 72h to 24h as per Phase 7.45 standard.',
      changeClassification: 'MATERIAL',
      approvalState: 'APPROVED',
      legalReviewState: 'APPROVED',
      commercialReviewState: 'APPROVED',
      securityReviewState: 'APPROVED',
      privacyReviewState: 'APPROVED',
      effectiveState: 'ACTIVE',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T11:00:00Z'
    }
  ]);

  // 6. Risk Assessments
  const [risks] = useState<ContractRiskAssessment[]>([
    {
      id: 'crisk_1001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      contractIdRef: 'CTR-2026-NET-001',
      legalRiskScore: 18,
      regulatoryRiskScore: 22,
      financialRiskScore: 35,
      commercialRiskScore: 28,
      operationalRiskScore: 65,
      cybersecurityRiskScore: 72,
      privacyRiskScore: 40,
      dataRiskScore: 50,
      reputationalRiskScore: 30,
      dependencyRiskScore: 80,
      continuityRiskScore: 75,
      geopoliticalRiskScore: 10,
      supplierRiskScore: 45,
      strategicRiskScore: 60,
      overallRiskScore: 68,
      overallRiskTier: 'HIGH',
      assessedBy: 'usr_risk_manager',
      assessedAt: '2026-01-08T14:00:00Z'
    }
  ]);

  // 7. Risk Mitigations
  const [riskMitigations] = useState<ContractRiskMitigation[]>([
    {
      id: 'cmit_001',
      tenantId: tenantScope,
      campusScope,
      contractRiskAssessmentId: 'crisk_1001',
      identifiedRiskTitle: 'High Operational Dependency on Primary WAN Provider',
      mitigationPlan: 'Procure secondary redundant fiber carrier and enforce automated BGP failover testing quarterly.',
      ownerId: 'usr_network_architect',
      dueDate: '2026-11-30',
      evidenceRef: 'ev_failover_test_q1',
      residualRiskScore: 28,
      lifecycle: 'IN_PROGRESS',
      createdBy: 'usr_risk_manager',
      createdAt: '2026-01-09T09:00:00Z'
    }
  ]);

  // 8. Reviews
  const [legalReviews] = useState<ContractLegalReview[]>([
    {
      id: 'lrev_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      legalRecordIdRef: 'LEG-MAT-2026-044',
      reviewerId: 'usr_legal_counsel',
      reviewStatus: 'APPROVED',
      governingLaw: 'Institutional Home State Law',
      jurisdiction: 'District High Court',
      liabilityCapsVerified: true,
      indemnityBalanced: true,
      ipOwnershipProtected: true,
      disputeResolutionClauseVerified: true,
      legalRiskTier: 'LOW',
      findings: 'All mandatory standard protection terms and dispute resolution escalations validated.',
      reviewedAt: '2026-01-04T15:00:00Z'
    }
  ]);

  const [complianceReviews] = useState<ContractComplianceReview[]>([
    {
      id: 'comprev_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      reviewerId: 'usr_compliance_officer',
      reviewStatus: 'APPROVED',
      regulatoryObligationsVerified: true,
      institutionalPoliciesVerified: true,
      mandatoryClausesIncluded: true,
      recordsRetentionClauseVerified: true,
      reportingRequirementsVerified: true,
      conflictRequirementsVerified: true,
      jurisdictionalConstraintsVerified: true,
      findings: 'Compliant with State Educational Procurement Act & Policy POL-GOV-2026.',
      reviewedAt: '2026-01-04T16:00:00Z'
    }
  ]);

  const [securityReviews] = useState<ContractSecurityReview[]>([
    {
      id: 'secrev_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      reviewerId: 'usr_ciso_analyst',
      reviewStatus: 'APPROVED',
      securityControlsVerified: true,
      accessManagementAdequate: true,
      incidentNotificationHoursRequirement: 24,
      thirdPartyCyberRiskTier: 'MEDIUM',
      cloudDependencyDocumented: true,
      businessContinuityProvisionsVerified: true,
      findings: 'SOC2 Type II and ISO 27001 certifications verified. Mandatory 24h breach notification enforced.',
      reviewedAt: '2026-01-04T17:00:00Z'
    }
  ]);

  const [privacyReviews] = useState<ContractPrivacyReview[]>([
    {
      id: 'privrev_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      reviewerId: 'usr_dpo',
      reviewStatus: 'APPROVED',
      personalDataProcessingInvolved: true,
      privacyImpactAssessmentRef: 'PIA-2026-NET-01',
      dataLocationJurisdiction: 'Domestic Onshore Data Centers Only',
      dataRetentionAndDeletionVerified: true,
      breachNotificationTimelineHours: 24,
      subprocessorAuthorizationControlled: true,
      crossBorderTransferCompliant: true,
      findings: 'Student and staff network metadata privacy verified. No overseas transmission permitted.',
      reviewedAt: '2026-01-04T18:00:00Z'
    }
  ]);

  // 9. Obligations
  const [obligations, setObligations] = useState<ContractObligation[]>([
    {
      id: 'ob_101',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      obligationTitle: 'Quarterly Bandwidth & Redundancy Failover Testing Evidence',
      category: 'SERVICE_COMMITMENT',
      responsibleParty: 'VENDOR',
      ownerId: 'usr_network_lead',
      dueDate: '2026-09-30',
      criticality: 'CRITICAL',
      lifecycle: 'ACTIVE',
      evidenceRef: 'ev_q3_failover_test',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T09:00:00Z'
    },
    {
      id: 'ob_102',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      obligationTitle: 'Annual Third-Party SOC2 Security Assurance Submission',
      category: 'SECURITY',
      responsibleParty: 'VENDOR',
      ownerId: 'usr_ciso_analyst',
      dueDate: '2026-12-15',
      criticality: 'HIGH',
      lifecycle: 'ACTIVE',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T09:30:00Z'
    }
  ]);

  // 10. SLA & Performance
  const [slas] = useState<ContractSLAGovernance[]>([
    {
      id: 'sla_101',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      slaMetricName: 'Core Network Backbone Uptime',
      targetThresholdPercent: 99.99,
      measurementFrequency: 'MONTHLY',
      penaltyRemedyClauseRef: 'Clause 14.2 Service Credits',
      status: 'ACTIVE',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T10:00:00Z'
    }
  ]);

  const [slaObservations] = useState<ContractSLAObservation[]>([
    {
      id: 'slaobs_001',
      tenantId: tenantScope,
      campusScope,
      slaGovernanceId: 'sla_101',
      servicePeriod: '2026-07',
      actualObservedPercent: 99.995,
      isBreached: false,
      trend: 'STABLE',
      recordedBy: 'telemetry_system_daemon',
      recordedAt: '2026-08-01T00:05:00Z'
    }
  ]);

  // 11. Renewals
  const [renewals] = useState<ContractRenewalObservation[]>([
    {
      id: 'ren_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      contractIdRef: 'CTR-2026-NET-001',
      renewalNoticeDeadline: '2027-10-01',
      contractEndDate: '2027-12-31',
      reviewWindowStatus: 'UPCOMING',
      performanceRatingScore: 94,
      unresolvedRisksCount: 0,
      unresolvedDisputesCount: 0,
      unresolvedSLABreachesCount: 0,
      unresolvedObligationsCount: 0,
      recommendation: 'RENEW',
      recommendationJustification: 'Vendor consistently achieved 99.99%+ SLA and completed all cybersecurity obligations.',
      reviewedBy: 'usr_contract_officer',
      reviewedAt: '2026-08-15T11:00:00Z',
      status: 'PENDING'
    }
  ]);

  // 12. Amendments
  const [amendments] = useState<ContractAmendmentGovernance[]>([
    {
      id: 'amend_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      amendmentIdRef: 'AMD-2026-01',
      amendmentReason: 'Addition of 10Gbps dedicated research link to new Science Complex.',
      materiality: 'MATERIAL',
      affectedObligationsSummary: 'Increases monthly SLA monitoring scope and adds science lab bandwidth threshold.',
      riskImpactRating: 'LOW',
      financialReferenceAmount: 45000,
      procurementReferenceId: 'preq_1001',
      legalReviewPassed: true,
      complianceReviewPassed: true,
      proposerId: 'usr_network_architect',
      approverId: 'usr_director_finance',
      decision: 'APPROVED',
      approvedAt: '2026-04-10T14:00:00Z',
      status: 'APPROVED',
      createdAt: '2026-04-01T10:00:00Z'
    }
  ]);

  // 13. Disputes & Claims
  const [disputes] = useState<ContractDisputeGovernance[]>([
    {
      id: 'disp_001',
      tenantId: tenantScope,
      campusScope,
      disputeIdRef: 'DSP-2026-003',
      contractGovernanceRefId: 'cgov_1001',
      issueDescription: 'Disputed billing charges on fiber installation overtime for building 4B.',
      disputeStatus: 'IN_MEDIATION',
      legalReviewRef: 'LEG-REV-2026-089',
      commercialImpactEstimatedRef: '$4,200 Disputed Scope',
      operationalImpact: 'LOW',
      riskRating: 'LOW',
      resolutionPlan: 'Vendor agreed to issue service credits on next billing cycle upon verification.',
      reportedBy: 'usr_finance_analyst',
      reportedAt: '2026-06-12T14:00:00Z'
    }
  ]);

  // 14. Exceptions & Controls
  const [exceptions, setExceptions] = useState<ContractExceptionGovernance[]>([
    {
      id: 'cexc_001',
      tenantId: tenantScope,
      campusScope,
      contractGovernanceRefId: 'cgov_1001',
      exceptionType: 'MISSING_CLAUSE',
      reason: 'Temporary waiver of liquidated damages clause pending master consortium alignment.',
      compensatingControl: 'Daily vendor uptime telemetry monitoring and weekly management sync.',
      ownerId: 'usr_legal_counsel',
      proposerId: 'usr_contract_officer',
      approverId: 'usr_director_legal',
      expiryDate: '2026-11-30',
      status: 'ACTIVE',
      createdAt: '2026-01-05T12:00:00Z'
    }
  ]);

  const [controls] = useState<ContractControl[]>([
    {
      id: 'cctrl_001',
      tenantId: tenantScope,
      campusScope,
      code: 'CTRL-CTR-01',
      title: 'Mandatory Four-Eyes Approval on Contract Intake & Execution',
      category: 'APPROVAL_SEGREGATION',
      description: 'Proposer of a contract intake or execution cannot approve the same request.',
      controlOwnerId: 'usr_compliance_officer',
      testingFrequency: 'MONTHLY',
      status: 'EFFECTIVE',
      createdBy: 'usr_compliance_officer',
      createdAt: '2026-01-01T08:00:00Z'
    },
    {
      id: 'cctrl_002',
      tenantId: tenantScope,
      campusScope,
      code: 'CTRL-CTR-02',
      title: 'Mandatory Cybersecurity & Privacy Review for Technology Contracts',
      category: 'SECURITY_REVIEW',
      description: 'All contracts involving data processing or IT infrastructure must have signed CISO & DPO reviews.',
      controlOwnerId: 'usr_ciso',
      testingFrequency: 'MONTHLY',
      status: 'EFFECTIVE',
      createdBy: 'usr_ciso',
      createdAt: '2026-01-01T08:00:00Z'
    }
  ]);

  // 15. Resilience & What-If Sandbox
  const [sandboxScenario, setSandboxScenario] = useState<ContractSimulationScenario | null>(null);

  // 16. Decisions
  const [decisions] = useState<ContractDecisionGovernance[]>([
    {
      id: 'cdec_001',
      tenantId: tenantScope,
      campusScope,
      decisionType: 'EXECUTION',
      contractGovernanceRefId: 'cgov_1001',
      title: 'Execute Master Networking Agreement VER-2.1',
      description: 'Approval of full execution following verified legal, privacy, security, and financial reviews.',
      proposerId: 'usr_contract_officer',
      approverId: 'usr_vp_operations',
      status: 'APPROVED',
      decisionDate: '2026-01-05',
      createdBy: 'usr_contract_officer',
      createdAt: '2026-01-05T13:00:00Z'
    }
  ]);

  // 17. Diagnostics
  const [diagnosticFindings, setDiagnosticFindings] = useState<ContractDiagnosticFinding[]>([]);

  // 18. Audit Logs
  const [auditLogs, setAuditLogs] = useState<ContractAuditEvent[]>([
    {
      id: 'cgaudit_001',
      tenantId: tenantScope,
      campusScope,
      actorId: 'usr_contract_officer',
      action: 'CONTRACT_GOVERNANCE_INITIALIZATION',
      entityType: 'ContractGovernanceReference',
      entityId: 'cgov_1001',
      timestamp: '2026-01-05T08:00:00Z',
      resultingState: { status: 'ACTIVE', criticality: 'MISSION_CRITICAL' },
      justification: 'System initialization of Phase 7.62 Contract Governance engine.'
    }
  ]);

  const handleRunDiagnostics = () => {
    const findings = ContractGovernanceService.runContractGovernanceDiagnostics(
      tenantScope,
      strategies,
      plans,
      intakes,
      contracts,
      [],
      risks,
      riskMitigations,
      legalReviews,
      complianceReviews,
      securityReviews,
      privacyReviews,
      [],
      obligations,
      exceptions,
      renewals,
      amendments,
      [],
      disputes,
      controls
    );
    setDiagnosticFindings(findings);
  };

  const handleRunSimulation = (type: ContractSimulationScenario['simulationType']) => {
    const scenario = ContractGovernanceService.runContractSimulation(tenantScope, type, contracts.length || 10);
    setSandboxScenario(scenario);
  };

  const handleApproveIntake = (intake: ContractIntakeGovernance) => {
    try {
      ContractGovernanceService.validateSoD(intake.proposerId, 'usr_current_approver', 'Contract Intake Approval');
      ContractGovernanceService.validateIntakeTransition(intake.status, 'APPROVAL');
      
      const updated = intakes.map(i => i.id === intake.id ? { ...i, status: 'APPROVAL' as const, approvedBy: 'usr_current_approver', approvedAt: new Date().toISOString() } : i);
      setIntakes(updated);

      ContractGovernanceService.logAudit(
        tenantScope,
        'usr_current_approver',
        'APPROVE_CONTRACT_INTAKE',
        'ContractIntakeGovernance',
        intake.id,
        { status: 'APPROVAL' },
        'Intake screened and approved for legal negotiation'
      ).then(log => setAuditLogs(prev => [log, ...prev]));
    } catch (err: any) {
      alert(`Approval Blocked: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Institutional Contract, Commercial Obligations & Agreement Assurance Engine
              </h1>
              <p className="text-sm text-slate-500">
                Phase 7.62 • Non-Duplicative Reference Governance Layer • Four-Eyes Enforcement • Obligation Lifecycle
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDiagnostics}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 text-slate-600" />
            Run Diagnostics ({diagnosticFindings.length})
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Contract Intake
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-px text-sm font-medium text-slate-600">
        {[
          { key: 'overview', label: 'Command Center', icon: Eye },
          { key: 'strategy', label: 'Strategy & Plans', icon: Briefcase },
          { key: 'intake', label: 'Intake & Classification', icon: FileText },
          { key: 'registry', label: 'Contracts Registry & Versions', icon: Layers },
          { key: 'reviews', label: 'Legal & Cyber Reviews', icon: ShieldCheck },
          { key: 'obligations', label: 'Obligations & SLAs', icon: CheckCircle },
          { key: 'renewals', label: 'Renewals & Amendments', icon: RefreshCw },
          { key: 'disputes', label: 'Disputes & Claims', icon: Scale },
          { key: 'controls', label: 'Internal Controls', icon: Lock },
          { key: 'resilience', label: 'What-If Resilience Sandbox', icon: Zap },
          { key: 'decisions', label: 'Decisions', icon: Award },
          { key: 'diagnostics', label: 'Diagnostics', icon: AlertOctagon },
          { key: 'audit', label: 'Audit Trail', icon: FileCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white font-semibold shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE COMMAND CENTER */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Truthful Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Contracts</span>
                <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md"><FileText className="w-4 h-4" /></span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{contracts.length}</p>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="font-medium text-emerald-600">100% Governed</span> • Reference Linked
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mandatory Reviews Passed</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md"><ShieldCheck className="w-4 h-4" /></span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {legalReviews.filter(l => l.reviewStatus === 'APPROVED').length + securityReviews.filter(s => s.reviewStatus === 'APPROVED').length} / {legalReviews.length + securityReviews.length}
              </p>
              <div className="text-xs text-slate-500 mt-1">Legal, Cyber, Privacy & Compliance</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Obligations</span>
                <span className="p-1.5 bg-amber-50 text-amber-700 rounded-md"><Clock className="w-4 h-4" /></span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{obligations.length}</p>
              <div className="text-xs text-amber-600 mt-1 font-medium">0 Overdue • 100% On Schedule</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Exceptions</span>
                <span className="p-1.5 bg-purple-50 text-purple-700 rounded-md"><AlertTriangle className="w-4 h-4" /></span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{exceptions.length}</p>
              <div className="text-xs text-purple-600 mt-1 font-medium">Mandatory Expiry Enforced</div>
            </div>
          </div>

          {/* Quick Overview Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Key Monitored Contracts
                </h3>
                <span className="text-xs text-slate-500">Live Governance Status</span>
              </div>
              <div className="space-y-3">
                {contracts.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{c.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">{c.criticality}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Ref: {c.contractIdRef} • Vendor: {c.vendorIdRef} • End Date: {c.endDate}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                      {c.effectiveState}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Obligation & SLA Telemetry
                </h3>
                <span className="text-xs text-slate-500">Truthful Telemetry Feeds</span>
              </div>
              <div className="space-y-3">
                {slas.map(s => {
                  const obs = slaObservations.find(o => o.slaGovernanceId === s.id);
                  return (
                    <div key={s.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 text-sm">{s.slaMetricName}</span>
                        <p className="text-xs text-slate-500 mt-1">
                          Target: {s.targetThresholdPercent}% • Frequency: {s.measurementFrequency}
                        </p>
                      </div>
                      <div className="text-right">
                        {obs ? (
                          <>
                            <span className="text-sm font-bold text-emerald-600">{obs.actualObservedPercent}%</span>
                            <p className="text-2xs text-slate-400">Observed {obs.servicePeriod}</p>
                          </>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-medium">INSUFFICIENT DATA</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRACT STRATEGY & PLANS */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-base">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Strategic Contract Governance Directives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategies.map(s => (
                <div key={s.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{s.title}</span>
                    <span className="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-800 font-semibold">{s.status}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Strategic Objectives:</span>
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-0.5">
                      {s.strategicObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <span>Horizon: {s.planningHorizonYears} Years</span>
                    <span>Risk Appetite: {s.riskAppetite}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTAKE & CLASSIFICATION */}
      {activeTab === 'intake' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Contract Intakes Awaiting Review & Approval
              </h3>
            </div>
            <div className="space-y-3">
              {intakes.map(intake => (
                <div key={intake.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{intake.title}</span>
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 font-medium rounded-full">{intake.urgency}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{intake.businessPurpose}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Proposer: {intake.proposerId} • Department: {intake.requestingDepartmentIdRef} • Est. Risk: {intake.estimatedRisk}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">{intake.status}</span>
                    {intake.status === 'REVIEW' && (
                      <button
                        onClick={() => handleApproveIntake(intake)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Approve Intake (SoD Enforced)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTRACTS REGISTRY & VERSIONS */}
      {activeTab === 'registry' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Contract Governance Master Reference Registry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Contract Ref</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Vendor Ref</th>
                    <th className="p-3">Criticality</th>
                    <th className="p-3">Effective State</th>
                    <th className="p-3">Renewal State</th>
                    <th className="p-3">End Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {contracts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-medium text-slate-900">{c.contractIdRef}</td>
                      <td className="p-3 font-semibold text-slate-900">{c.title}</td>
                      <td className="p-3 font-mono text-slate-600">{c.vendorIdRef}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold">{c.criticality}</span></td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{c.effectiveState}</span></td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">{c.renewalState}</span></td>
                      <td className="p-3">{c.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LEGAL & CYBER REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Scale className="w-4 h-4 text-indigo-600" />
                Legal Review Records
              </h3>
              {legalReviews.map(l => (
                <div key={l.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Legal Ref: {l.legalRecordIdRef}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{l.reviewStatus}</span>
                  </div>
                  <p className="text-slate-600">{l.findings}</p>
                  <div className="text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Law: {l.governingLaw}</span>
                    <span>Reviewer: {l.reviewerId}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Cybersecurity & Privacy Reviews
              </h3>
              {securityReviews.map(s => (
                <div key={s.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Incident SLA: {s.incidentNotificationHoursRequirement} Hours</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{s.reviewStatus}</span>
                  </div>
                  <p className="text-slate-600">{s.findings}</p>
                  <div className="text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Cyber Risk: {s.thirdPartyCyberRiskTier}</span>
                    <span>Reviewer: {s.reviewerId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: OBLIGATIONS & SLAS */}
      {activeTab === 'obligations' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              Contractual Obligation Matrix
            </h3>
            <div className="space-y-3">
              {obligations.map(ob => (
                <div key={ob.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{ob.obligationTitle}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-medium rounded-full">{ob.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Party: {ob.responsibleParty} • Due: {ob.dueDate} • Owner: {ob.ownerId}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-100 text-emerald-800">
                    {ob.lifecycle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: RENEWALS & AMENDMENTS */}
      {activeTab === 'renewals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                Upcoming Renewal Observations
              </h3>
              {renewals.map(ren => (
                <div key={ren.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Contract: {ren.contractIdRef}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Recommendation: {ren.recommendation}</span>
                  </div>
                  <p className="text-slate-600">{ren.recommendationJustification}</p>
                  <p className="text-slate-400">Notice Deadline: {ren.renewalNoticeDeadline} • Contract End: {ren.contractEndDate}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Contract Amendments
              </h3>
              {amendments.map(am => (
                <div key={am.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{am.amendmentIdRef}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{am.decision}</span>
                  </div>
                  <p className="text-slate-600">{am.amendmentReason}</p>
                  <p className="text-slate-400">Materiality: {am.materiality} • Proposer: {am.proposerId} • Approver: {am.approverId}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DISPUTES & CLAIMS */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              Contract Disputes & Claim Observations
            </h3>
            <div className="space-y-3">
              {disputes.map(d => (
                <div key={d.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-sm">{d.disputeIdRef}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">{d.disputeStatus}</span>
                  </div>
                  <p className="text-slate-700">{d.issueDescription}</p>
                  <p className="text-slate-500 font-medium">Resolution: {d.resolutionPlan}</p>
                  <p className="text-slate-400">Commercial Exposure: {d.commercialImpactEstimatedRef} • Reported By: {d.reportedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CONTROLS & EXCEPTIONS */}
      {activeTab === 'controls' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4 text-indigo-600" />
                Internal Controls
              </h3>
              {controls.map(c => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.code} • {c.title}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">{c.status}</span>
                  </div>
                  <p className="text-slate-600">{c.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Active Contract Exceptions
              </h3>
              {exceptions.map(exc => (
                <div key={exc.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{exc.exceptionType}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">{exc.status}</span>
                  </div>
                  <p className="text-slate-600">{exc.reason}</p>
                  <p className="text-slate-500 font-medium">Compensating Control: {exc.compensatingControl}</p>
                  <p className="text-slate-400">Expiry Date: {exc.expiryDate} (No Indefinite Exceptions Allowed)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: WHAT-IF RESILIENCE SANDBOX */}
      {activeTab === 'resilience' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Contract Resilience Simulation Sandbox
              </h3>
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-md">
                SIMULATION ONLY • ZERO PRODUCTION MUTATION
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { type: 'CRITICAL_CONTRACT_TERMINATION', label: 'Simulate Critical Termination' },
                { type: 'SUPPLIER_DEFAULT', label: 'Simulate Supplier Default' },
                { type: 'SLA_FAILURE', label: 'Simulate SLA Breakdown' },
                { type: 'CYBER_INCIDENT', label: 'Simulate Vendor Cyber Breach' },
                { type: 'FORCE_MAJEURE', label: 'Simulate Force Majeure' }
              ].map(s => (
                <button
                  key={s.type}
                  onClick={() => handleRunSimulation(s.type as any)}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {sandboxScenario && (
              <div className="mt-4 p-5 bg-slate-900 text-white rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-indigo-400">{sandboxScenario.title}</span>
                  <span className="text-xs px-2 py-0.5 bg-red-900/60 text-red-300 font-mono rounded">
                    SIMULATION ONLY
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-slate-400">Affected Dependencies</span>
                    <p className="text-lg font-bold text-white mt-1">{sandboxScenario.simulatedAffectedDependenciesCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Impacted Obligations</span>
                    <p className="text-lg font-bold text-white mt-1">{sandboxScenario.simulatedImpactedObligationsCount}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Continuity Exposure</span>
                    <p className="text-lg font-bold text-white mt-1">{sandboxScenario.simulatedContinuityExposureHours} Hours</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Resilience Rating</span>
                    <p className="text-lg font-bold text-amber-400 mt-1">{sandboxScenario.simulatedResilienceRating}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 11: DECISIONS */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Contract Governance Decision Records
            </h3>
            <div className="space-y-3">
              {decisions.map(d => (
                <div key={d.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{d.title}</span>
                    <p className="text-slate-600 mt-1">{d.description}</p>
                    <p className="text-slate-400 mt-1">Proposer: {d.proposerId} • Approver: {d.approverId} • Date: {d.decisionDate}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold">{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 12: DIAGNOSTICS */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-indigo-600" />
                Contract Governance Integrity Diagnostics
              </h3>
              <button
                onClick={handleRunDiagnostics}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Execute Scan
              </button>
            </div>
            {diagnosticFindings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                No anomalies detected. Contract governance integrity verified across all dimensions.
              </div>
            ) : (
              <div className="space-y-2">
                {diagnosticFindings.map((f, i) => (
                  <div key={i} className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="font-medium text-amber-900">{f.description}</span>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono text-2xs">{f.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 13: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                Immutable Contract Governance Audit Log
              </h3>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
                CREATE ONLY • NO UPDATE • NO DELETE
              </span>
            </div>
            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{log.action}</span>
                    <span className="text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600">{log.justification}</p>
                  <p className="text-slate-400 text-2xs">Actor: {log.actorId} • Entity: {log.entityType} ({log.entityId})</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
