import React, { useState, useEffect, useCallback } from 'react';
import {
  GovernanceService,
  UserActor
} from '../../services/governanceService';
import { AuditService } from '../../services/auditService';
import {
  GovernanceAnalyticsCache,
  GovernanceBody,
  GovernanceBodyMember,
  GovernanceMeeting,
  GovernanceResolution,
  GovernanceActionItem,
  Policy,
  PolicyVersion,
  ComplianceFramework,
  ComplianceObligation,
  ComplianceException,
  AccreditationBody,
  AccreditationCycle,
  AccreditationStandard,
  AccreditationCriterion,
  QualityFramework,
  QualityIndicator,
  InstitutionalAudit,
  AuditFinding,
  CorrectiveAction,
  InstitutionalRisk,
  RiskMitigation
} from '../../types/governance';
import { AuditRecord } from '../../types';

import { GovernanceKPIBanner } from './GovernanceKPIBanner';
import { GovernanceAnalyticsTab } from './tabs/GovernanceAnalyticsTab';
import { GoverningBodiesTab } from './tabs/GoverningBodiesTab';
import { PolicyManagementTab } from './tabs/PolicyManagementTab';
import { ComplianceFrameworkTab } from './tabs/ComplianceFrameworkTab';
import { AccreditationReadinessTab } from './tabs/AccreditationReadinessTab';
import { QualityAndAuditsTab } from './tabs/QualityAndAuditsTab';
import { RiskAndAuditTrailTab } from './tabs/RiskAndAuditTrailTab';
import { GovernanceFormModal } from './modals/GovernanceFormModal';

import {
  ShieldCheck,
  Users,
  FileCheck,
  Scale,
  Award,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface GovernanceWorkspaceProps {
  tenantId: string;
  currentUser: {
    id: string;
    email: string;
    displayName: string;
    roles?: string[];
  };
}

export const GovernanceWorkspace: React.FC<GovernanceWorkspaceProps> = ({
  tenantId,
  currentUser
}) => {
  const actor: UserActor = {
    id: currentUser?.id,
    email: currentUser?.email,
    displayName: currentUser?.displayName,
    tenantId
  };

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'committees' | 'policies' | 'compliance' | 'accreditation' | 'quality_audits' | 'risks_audit'
  >('analytics');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cache, setCache] = useState<GovernanceAnalyticsCache | null>(null);

  // Domain Collections
  const [bodies, setBodies] = useState<GovernanceBody[]>([]);
  const [members, setMembers] = useState<GovernanceBodyMember[]>([]);
  const [meetings, setMeetings] = useState<GovernanceMeeting[]>([]);
  const [resolutions, setResolutions] = useState<GovernanceResolution[]>([]);
  const [actionItems, setActionItems] = useState<GovernanceActionItem[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyVersions, setPolicyVersions] = useState<PolicyVersion[]>([]);
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [obligations, setObligations] = useState<ComplianceObligation[]>([]);
  const [exceptions, setExceptions] = useState<ComplianceException[]>([]);
  const [accreditationBodies, setAccreditationBodies] = useState<AccreditationBody[]>([]);
  const [accreditationCycles, setAccreditationCycles] = useState<AccreditationCycle[]>([]);
  const [accreditationStandards, setAccreditationStandards] = useState<AccreditationStandard[]>([]);
  const [accreditationCriteria, setAccreditationCriteria] = useState<AccreditationCriterion[]>([]);
  const [qualityFrameworks, setQualityFrameworks] = useState<QualityFramework[]>([]);
  const [qualityIndicators, setQualityIndicators] = useState<QualityIndicator[]>([]);
  const [audits, setAudits] = useState<InstitutionalAudit[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [risks, setRisks] = useState<InstitutionalRisk[]>([]);
  const [mitigations, setMitigations] = useState<RiskMitigation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: string | null;
    payload?: any;
  }>({ isOpen: false, type: null });

  // Load All Data
  const loadWorkspaceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        analyticsData,
        bodiesData,
        policiesData,
        frameworksData,
        obligationsData,
        exceptionsData,
        accredBodiesData,
        accredCyclesData,
        auditsData,
        findingsData,
        capasData,
        risksData,
        mitigationsData,
        logsData
      ] = await Promise.all([
        GovernanceService.getGovernanceAnalyticsCache(tenantId),
        GovernanceService.getGovernanceBodies(tenantId),
        GovernanceService.getPolicies(tenantId),
        GovernanceService.getComplianceFrameworks(tenantId),
        GovernanceService.getComplianceObligations(tenantId),
        GovernanceService.getComplianceExceptions(tenantId),
        GovernanceService.getAccreditationBodies(tenantId),
        GovernanceService.getAccreditationCycles(tenantId),
        GovernanceService.getInstitutionalAudits(tenantId),
        GovernanceService.getAuditFindings(tenantId),
        GovernanceService.getCorrectiveActions(tenantId),
        GovernanceService.getInstitutionalRisks(tenantId),
        GovernanceService.getRiskMitigations(tenantId),
        AuditService.getAuditLogs({ tenantId, limit: 30 })
      ]);

      setCache(analyticsData);
      setBodies(bodiesData);
      setPolicies(policiesData);
      setFrameworks(frameworksData);
      setObligations(obligationsData);
      setExceptions(exceptionsData);
      setAccreditationBodies(accredBodiesData);
      setAccreditationCycles(accredCyclesData);
      setAudits(auditsData);
      setFindings(findingsData);
      setCorrectiveActions(capasData);
      setRisks(risksData);
      setMitigations(mitigationsData);
      setAuditLogs(logsData);

      // Auto-load members and meetings for first body
      if (bodiesData.length > 0) {
        const [membersData, meetingsData] = await Promise.all([
          GovernanceService.getGovernanceBodyMembers(tenantId, bodiesData[0].id),
          GovernanceService.getGovernanceMeetings(tenantId, bodiesData[0].id)
        ]);
        setMembers(membersData);
        setMeetings(meetingsData);
      }
    } catch (err) {
      console.error('[GovernanceWorkspace] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  // Open Modal Helper
  const openModal = (type: string, payload?: any) => {
    setModalState({ isOpen: true, type, payload });
  };

  // Form Submission Handler
  const handleFormSubmit = async (type: string, formData: any) => {
    try {
      switch (type) {
        case 'add_committee':
          await GovernanceService.createGovernanceBody(
            tenantId,
            {
              name: formData.name,
              code: formData.code || `GOV-${Date.now().toString().slice(-4)}`,
              bodyType: formData.type || 'BOARD_OF_GOVERNORS',
              description: formData.termsOfReference || formData.name,
              chairpersonId: actor.id,
              chairpersonName: actor.displayName,
              status: 'ACTIVE',
              effectiveFrom: new Date().toISOString().split('T')[0]
            },
            actor
          );
          break;

        case 'add_policy':
          await GovernanceService.createPolicy(
            tenantId,
            {
              title: formData.title,
              category: formData.category || 'ACADEMIC',
              scope: 'INSTITUTION_WIDE',
              issuingAuthority: 'Governance Committee',
              ownerStaffId: actor.id,
              ownerStaffName: actor.displayName,
              effectiveFrom: new Date().toISOString().split('T')[0],
              reviewDueAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            formData.purpose || formData.title,
            actor
          );
          break;

        case 'add_obligation':
          await GovernanceService.createComplianceObligation(
            tenantId,
            {
              frameworkId: formData.frameworkId || (frameworks.length > 0 ? frameworks[0].id : ''),
              requirementReference: formData.code || `OBL-${Date.now().toString().slice(-4)}`,
              title: formData.title,
              description: formData.title,
              frequency: 'ANNUALLY',
              dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
              responsibleStaffId: actor.id,
              responsibleStaffName: actor.displayName,
              status: 'IN_PROGRESS',
              evidenceRequired: true
            },
            actor
          );
          break;

        case 'add_risk':
          await GovernanceService.createInstitutionalRisk(
            tenantId,
            {
              title: formData.title,
              category: 'OPERATIONAL',
              description: formData.title,
              probability: formData.probability || 3,
              impact: formData.impact || 3,
              ownerStaffId: actor.id,
              ownerStaffName: actor.displayName,
              status: 'MITIGATING'
            },
            actor
          );
          break;

        case 'schedule_audit':
          await GovernanceService.createInstitutionalAudit(
            tenantId,
            {
              title: formData.title,
              auditType: 'INTERNAL_ACADEMIC',
              scope: formData.title,
              leadAuditorId: actor.id,
              leadAuditorName: actor.displayName,
              scheduledDate: new Date().toISOString().split('T')[0],
              status: 'PLANNED'
            },
            actor
          );
          break;
      }

      await loadWorkspaceData();
    } catch (err: any) {
      alert(`Error saving governance record: ${err.message}`);
    }
  };

  // Policy Approval Workflow with SoD Check
  const handleApprovePolicy = async (policy: Policy) => {
    try {
      await GovernanceService.approvePolicy(tenantId, policy.id, actor);
      await loadWorkspaceData();
    } catch (err: any) {
      alert(`Approval Failed (SoD Safeguard): ${err.message}`);
    }
  };

  // Policy Publish Workflow
  const handlePublishPolicy = async (policy: Policy) => {
    try {
      await GovernanceService.publishPolicy(tenantId, policy.id, actor);
      await loadWorkspaceData();
    } catch (err: any) {
      alert(`Publish Failed: ${err.message}`);
    }
  };

  // Exception Request Workflow
  const handleRequestException = (obligationId: string) => {
    openModal('request_exception', { obligationId });
  };

  const handleApproveException = async (exception: ComplianceException) => {
    try {
      await GovernanceService.approveComplianceException(tenantId, exception.id, actor);
      await loadWorkspaceData();
    } catch (err: any) {
      alert(`Exception Approval Failed (SoD Safeguard): ${err.message}`);
    }
  };

  // CAPA Verification Workflow
  const handleVerifyCAPAClosure = async (capa: CorrectiveAction) => {
    try {
      await GovernanceService.verifyCorrectiveActionClosure(tenantId, capa.id, actor);
      await loadWorkspaceData();
    } catch (err: any) {
      alert(`CAPA Verification Failed (SoD Safeguard): ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Title & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-700 text-white shadow-md shadow-sky-700/20">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Governance, Compliance, Accreditation & Institutional Quality Engine
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Phase 7.24 Enterprise Multi-Tenant Multi-Campus Statutory Foundation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadWorkspaceData}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Banner */}
      <GovernanceKPIBanner cache={cache} onRefresh={loadWorkspaceData} isLoading={isLoading} />

      {/* Main Tab Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Command Center
          </button>

          <button
            onClick={() => setActiveTab('committees')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'committees'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> Governing Bodies & Committees ({bodies.length})
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'policies'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Policy Registry ({policies.length})
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'compliance'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" /> Compliance Frameworks ({obligations.length})
          </button>

          <button
            onClick={() => setActiveTab('accreditation')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'accreditation'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" /> Accreditation Readiness
          </button>

          <button
            onClick={() => setActiveTab('quality_audits')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'quality_audits'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Quality & Audits ({audits.length})
          </button>

          <button
            onClick={() => setActiveTab('risks_audit')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0 ${
              activeTab === 'risks_audit'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Risks & Security Trail ({risks.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content Canvas */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-600" />
          <p className="text-xs font-semibold text-slate-600">
            Querying tenant governance collections & computing statutory compliance metrics...
          </p>
        </div>
      ) : (
        <div>
          {activeTab === 'analytics' && (
            <GovernanceAnalyticsTab
              cache={cache}
              bodies={bodies}
              policies={policies}
              obligations={obligations}
              risks={risks}
              audits={audits}
              onQuickAction={(action) => openModal(action)}
            />
          )}

          {activeTab === 'committees' && (
            <GoverningBodiesTab
              bodies={bodies}
              members={members}
              meetings={meetings}
              resolutions={resolutions}
              actionItems={actionItems}
              onCreateBody={() => openModal('add_committee')}
              onAddMember={(bodyId) => openModal('add_member', { bodyId })}
              onScheduleMeeting={(bodyId) => openModal('schedule_meeting', { bodyId })}
              onRecordResolution={(meetingId) => openModal('record_resolution', { meetingId })}
              onAddActionItem={(meetingId) => openModal('add_action_item', { meetingId })}
            />
          )}

          {activeTab === 'policies' && (
            <PolicyManagementTab
              policies={policies}
              policyVersions={policyVersions}
              currentUserId={actor.id}
              onDraftPolicy={() => openModal('add_policy')}
              onApprovePolicy={handleApprovePolicy}
              onPublishPolicy={handlePublishPolicy}
              onViewVersions={(policyId) => console.log('Viewing versions for policy:', policyId)}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceFrameworkTab
              frameworks={frameworks}
              obligations={obligations}
              exceptions={exceptions}
              currentUserId={actor.id}
              onCreateFramework={() => openModal('add_framework')}
              onAddObligation={() => openModal('add_obligation')}
              onRequestException={handleRequestException}
              onApproveException={handleApproveException}
            />
          )}

          {activeTab === 'accreditation' && (
            <AccreditationReadinessTab
              bodies={accreditationBodies}
              cycles={accreditationCycles}
              standards={accreditationStandards}
              criteria={accreditationCriteria}
              onCreateBody={() => openModal('add_accred_body')}
              onCreateCycle={() => openModal('add_accred_cycle')}
            />
          )}

          {activeTab === 'quality_audits' && (
            <QualityAndAuditsTab
              frameworks={qualityFrameworks}
              indicators={qualityIndicators}
              audits={audits}
              findings={findings}
              correctiveActions={correctiveActions}
              currentUserId={actor.id}
              onScheduleAudit={() => openModal('schedule_audit')}
              onAddFinding={(auditId) => openModal('add_finding', { auditId })}
              onAddCAPA={(findingId) => openModal('add_capa', { findingId })}
              onVerifyCAPAClosure={handleVerifyCAPAClosure}
            />
          )}

          {activeTab === 'risks_audit' && (
            <RiskAndAuditTrailTab
              risks={risks}
              mitigations={mitigations}
              auditLogs={auditLogs}
              onAddRisk={() => openModal('add_risk')}
              onAddMitigation={(riskId) => openModal('add_mitigation', { riskId })}
            />
          )}
        </div>
      )}

      {/* Shared Governance Form Modal */}
      <GovernanceFormModal
        isOpen={modalState.isOpen}
        modalType={modalState.type}
        payload={modalState.payload}
        onClose={() => setModalState({ isOpen: false, type: null })}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
