import { where } from 'firebase/firestore';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import {
  InstitutionalGovernanceProfile,
  GovernanceBody,
  GovernanceBodyMember,
  GovernanceMeeting,
  GovernanceAgenda,
  GovernanceResolution,
  GovernanceActionItem,
  Policy,
  PolicyVersion,
  PolicyReview,
  ComplianceFramework,
  ComplianceObligation,
  ComplianceControl,
  ComplianceEvidence,
  ComplianceException,
  AccreditationBody,
  AccreditationCycle,
  AccreditationStandard,
  AccreditationCriterion,
  QualityFramework,
  QualityIndicator,
  QualityTarget,
  QualityMeasurement,
  InstitutionalAudit,
  AuditFinding,
  CorrectiveAction,
  InstitutionalRisk,
  RiskMitigation,
  GovernanceDocumentReference,
  GovernanceAnalyticsCache,
  RiskSeverityLevel
} from '../types/governance';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  tenantId: string;
  role?: string;
}

// Collection Constants
export const GOVERNANCE_PROFILES_COL = 'governance_profiles';
export const GOVERNANCE_BODIES_COL = 'governance_bodies';
export const GOVERNANCE_BODY_MEMBERS_COL = 'governance_body_members';
export const GOVERNANCE_MEETINGS_COL = 'governance_meetings';
export const GOVERNANCE_AGENDAS_COL = 'governance_agendas';
export const GOVERNANCE_RESOLUTIONS_COL = 'governance_resolutions';
export const GOVERNANCE_ACTION_ITEMS_COL = 'governance_action_items';
export const GOVERNANCE_POLICIES_COL = 'governance_policies';
export const GOVERNANCE_POLICY_VERSIONS_COL = 'governance_policy_versions';
export const GOVERNANCE_POLICY_REVIEWS_COL = 'governance_policy_reviews';
export const GOVERNANCE_COMPLIANCE_FRAMEWORKS_COL = 'governance_compliance_frameworks';
export const GOVERNANCE_COMPLIANCE_OBLIGATIONS_COL = 'governance_compliance_obligations';
export const GOVERNANCE_COMPLIANCE_CONTROLS_COL = 'governance_compliance_controls';
export const GOVERNANCE_COMPLIANCE_EVIDENCE_COL = 'governance_compliance_evidence';
export const GOVERNANCE_COMPLIANCE_EXCEPTIONS_COL = 'governance_compliance_exceptions';
export const GOVERNANCE_ACCREDITATION_BODIES_COL = 'governance_accreditation_bodies';
export const GOVERNANCE_ACCREDITATION_CYCLES_COL = 'governance_accreditation_cycles';
export const GOVERNANCE_ACCREDITATION_STANDARDS_COL = 'governance_accreditation_standards';
export const GOVERNANCE_ACCREDITATION_CRITERIA_COL = 'governance_accreditation_criteria';
export const GOVERNANCE_QUALITY_FRAMEWORKS_COL = 'governance_quality_frameworks';
export const GOVERNANCE_QUALITY_INDICATORS_COL = 'governance_quality_indicators';
export const GOVERNANCE_QUALITY_TARGETS_COL = 'governance_quality_targets';
export const GOVERNANCE_QUALITY_MEASUREMENTS_COL = 'governance_quality_measurements';
export const GOVERNANCE_INSTITUTIONAL_AUDITS_COL = 'governance_institutional_audits';
export const GOVERNANCE_AUDIT_FINDINGS_COL = 'governance_audit_findings';
export const GOVERNANCE_CORRECTIVE_ACTIONS_COL = 'governance_corrective_actions';
export const GOVERNANCE_INSTITUTIONAL_RISKS_COL = 'governance_institutional_risks';
export const GOVERNANCE_RISK_MITIGATIONS_COL = 'governance_risk_mitigations';
export const GOVERNANCE_DOCUMENT_REFS_COL = 'governance_document_references';
export const GOVERNANCE_ANALYTICS_CACHE_COL = 'governance_analytics_cache';

export class GovernanceService {
  // Helper to derive risk severity level
  private static deriveRiskSeverityLevel(score: number): RiskSeverityLevel {
    if (score <= 5) return 'LOW';
    if (score <= 10) return 'MEDIUM';
    if (score <= 15) return 'HIGH';
    return 'CRITICAL';
  }

  // ==========================================
  // GOVERNANCE PROFILE
  // ==========================================

  static async getGovernanceProfile(tenantId: string, campusId?: string): Promise<InstitutionalGovernanceProfile | null> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    const list = await FirebaseService.getTenantCollection<InstitutionalGovernanceProfile>(GOVERNANCE_PROFILES_COL, tenantId, constraints);
    return list[0] || null;
  }

  static async updateGovernanceProfile(
    tenantId: string,
    data: Omit<InstitutionalGovernanceProfile, 'id' | 'tenantId' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<InstitutionalGovernanceProfile> {
    const existing = await this.getGovernanceProfile(tenantId, data.campusId);
    const profileId = existing?.id || FirebaseService.generateId('gov_prof');
    const now = new Date().toISOString();

    const profile: InstitutionalGovernanceProfile = {
      ...data,
      id: profileId,
      tenantId,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_PROFILES_COL, profileId, profile);
    return profile;
  }

  // ==========================================
  // GOVERNANCE BODIES & MEMBERS
  // ==========================================

  static async getGovernanceBodies(tenantId: string, campusId?: string): Promise<GovernanceBody[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<GovernanceBody>(GOVERNANCE_BODIES_COL, tenantId, constraints);
  }

  static async createGovernanceBody(
    tenantId: string,
    data: Omit<GovernanceBody, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<GovernanceBody> {
    const bodyId = FirebaseService.generateId('gov_body');
    const now = new Date().toISOString();

    const body: GovernanceBody = {
      ...data,
      id: bodyId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_BODIES_COL, bodyId, body);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_BODY_CREATED',
      resource: 'governance_body',
      resourceId: bodyId,
      resourceName: body.name,
      newValue: body,
      result: 'SUCCESS'
    });

    return body;
  }

  static async updateGovernanceBody(
    tenantId: string,
    bodyId: string,
    updates: Partial<GovernanceBody>,
    actor: UserActor
  ): Promise<GovernanceBody> {
    const existing = await FirebaseService.getDocument<GovernanceBody>(GOVERNANCE_BODIES_COL, bodyId);
    if (!existing || existing.tenantId !== tenantId) throw new Error('Governance body not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: GovernanceBody = {
      ...existing,
      ...updates,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_BODIES_COL, bodyId, updated);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_BODY_UPDATED',
      resource: 'governance_body',
      resourceId: bodyId,
      resourceName: updated.name,
      previousValue: existing,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  static async getGovernanceBodyMembers(tenantId: string, governanceBodyId: string): Promise<GovernanceBodyMember[]> {
    return await FirebaseService.getTenantCollection<GovernanceBodyMember>(GOVERNANCE_BODY_MEMBERS_COL, tenantId, [
      where('governanceBodyId', '==', governanceBodyId)
    ]);
  }

  static async addGovernanceBodyMember(
    tenantId: string,
    data: Omit<GovernanceBodyMember, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<GovernanceBodyMember> {
    const body = await FirebaseService.getDocument<GovernanceBody>(GOVERNANCE_BODIES_COL, data.governanceBodyId);
    if (!body || body.tenantId !== tenantId) throw new Error('Governance body not found or cross-tenant access denied.');

    const memberId = FirebaseService.generateId('gov_mbr');
    const now = new Date().toISOString();

    const member: GovernanceBodyMember = {
      ...data,
      id: memberId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_BODY_MEMBERS_COL, memberId, member);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_MEMBER_ADDED',
      resource: 'governance_body',
      resourceId: data.governanceBodyId,
      resourceName: `${data.staffName} (${data.role})`,
      newValue: member,
      result: 'SUCCESS'
    });

    return member;
  }

  // ==========================================
  // MEETINGS, AGENDAS, RESOLUTIONS & ACTION ITEMS
  // ==========================================

  static async getGovernanceMeetings(tenantId: string, governanceBodyId?: string): Promise<GovernanceMeeting[]> {
    const constraints = governanceBodyId ? [where('governanceBodyId', '==', governanceBodyId)] : [];
    return await FirebaseService.getTenantCollection<GovernanceMeeting>(GOVERNANCE_MEETINGS_COL, tenantId, constraints);
  }

  static async createGovernanceMeeting(
    tenantId: string,
    data: Omit<GovernanceMeeting, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<GovernanceMeeting> {
    const meetingId = FirebaseService.generateId('gov_mtg');
    const now = new Date().toISOString();

    const meeting: GovernanceMeeting = {
      ...data,
      id: meetingId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_MEETINGS_COL, meetingId, meeting);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_MEETING_CREATED',
      resource: 'governance_meeting',
      resourceId: meetingId,
      resourceName: meeting.title,
      newValue: meeting,
      result: 'SUCCESS'
    });

    return meeting;
  }

  static async getGovernanceAgendas(tenantId: string, meetingId: string): Promise<GovernanceAgenda[]> {
    const list = await FirebaseService.getTenantCollection<GovernanceAgenda>(GOVERNANCE_AGENDAS_COL, tenantId, [
      where('meetingId', '==', meetingId)
    ]);
    return list.sort((a, b) => a.itemNumber - b.itemNumber);
  }

  static async createGovernanceAgenda(
    tenantId: string,
    data: Omit<GovernanceAgenda, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<GovernanceAgenda> {
    const meeting = await FirebaseService.getDocument<GovernanceMeeting>(GOVERNANCE_MEETINGS_COL, data.meetingId);
    if (!meeting || meeting.tenantId !== tenantId) throw new Error('Governance meeting not found or cross-tenant access denied.');

    const agendaId = FirebaseService.generateId('gov_agd');
    const now = new Date().toISOString();

    const agenda: GovernanceAgenda = {
      ...data,
      id: agendaId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_AGENDAS_COL, agendaId, agenda);
    return agenda;
  }

  static async getGovernanceResolutions(tenantId: string, meetingId?: string): Promise<GovernanceResolution[]> {
    const constraints = meetingId ? [where('meetingId', '==', meetingId)] : [];
    return await FirebaseService.getTenantCollection<GovernanceResolution>(GOVERNANCE_RESOLUTIONS_COL, tenantId, constraints);
  }

  static async createGovernanceResolution(
    tenantId: string,
    data: Omit<GovernanceResolution, 'id' | 'tenantId' | 'resolutionNumber' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<GovernanceResolution> {
    const resolutionId = FirebaseService.generateId('gov_res');
    const resolutionNumber = `RES-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const resolution: GovernanceResolution = {
      ...data,
      id: resolutionId,
      tenantId,
      resolutionNumber,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_RESOLUTIONS_COL, resolutionId, resolution);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_RESOLUTION_CREATED',
      resource: 'governance_resolution',
      resourceId: resolutionId,
      resourceName: resolution.title,
      newValue: resolution,
      result: 'SUCCESS'
    });

    return resolution;
  }

  static async getGovernanceActionItems(tenantId: string, meetingId?: string): Promise<GovernanceActionItem[]> {
    const constraints = meetingId ? [where('meetingId', '==', meetingId)] : [];
    return await FirebaseService.getTenantCollection<GovernanceActionItem>(GOVERNANCE_ACTION_ITEMS_COL, tenantId, constraints);
  }

  static async createGovernanceActionItem(
    tenantId: string,
    data: Omit<GovernanceActionItem, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<GovernanceActionItem> {
    const actionItemId = FirebaseService.generateId('gov_act');
    const now = new Date().toISOString();

    const actionItem: GovernanceActionItem = {
      ...data,
      id: actionItemId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_ACTION_ITEMS_COL, actionItemId, actionItem);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'GOVERNANCE_ACTION_ITEM_CREATED',
      resource: 'governance_action_item',
      resourceId: actionItemId,
      resourceName: actionItem.title,
      newValue: actionItem,
      result: 'SUCCESS'
    });

    return actionItem;
  }

  static async updateGovernanceActionItemStatus(
    tenantId: string,
    actionItemId: string,
    status: GovernanceActionItem['status'],
    completionNotes?: string,
    evidenceDocumentRegistryId?: string,
    actor?: UserActor
  ): Promise<GovernanceActionItem> {
    const item = await FirebaseService.getDocument<GovernanceActionItem>(GOVERNANCE_ACTION_ITEMS_COL, actionItemId);
    if (!item || item.tenantId !== tenantId) throw new Error('Governance action item not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: GovernanceActionItem = {
      ...item,
      status,
      completionNotes: completionNotes || item.completionNotes,
      evidenceDocumentRegistryId: evidenceDocumentRegistryId || item.evidenceDocumentRegistryId,
      completedAt: status === 'COMPLETED' ? now : item.completedAt,
      updatedAt: now,
      updatedBy: actor?.id || 'system'
    };

    await FirebaseService.setDocument(GOVERNANCE_ACTION_ITEMS_COL, actionItemId, updated);
    return updated;
  }

  // ==========================================
  // POLICY GOVERNANCE
  // ==========================================

  static async getPolicies(tenantId: string, campusId?: string, category?: string): Promise<Policy[]> {
    const constraints = [];
    if (campusId) constraints.push(where('campusId', '==', campusId));
    if (category) constraints.push(where('category', '==', category));
    return await FirebaseService.getTenantCollection<Policy>(GOVERNANCE_POLICIES_COL, tenantId, constraints);
  }

  static async createPolicy(
    tenantId: string,
    data: Omit<Policy, 'id' | 'tenantId' | 'policyNumber' | 'status' | 'currentVersion' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    policyText: string,
    actor: UserActor
  ): Promise<Policy> {
    const policyId = FirebaseService.generateId('gov_pol');
    const policyNumber = `POL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const policy: Policy = {
      ...data,
      id: policyId,
      tenantId,
      policyNumber,
      status: 'DRAFT',
      currentVersion: 1,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, policy);

    // Initial version
    const versionId = FirebaseService.generateId('pol_ver');
    const initialVersion: PolicyVersion = {
      id: versionId,
      tenantId,
      policyId,
      versionNumber: 1,
      changeSummary: 'Initial policy creation draft.',
      policyText,
      effectiveFrom: data.effectiveFrom,
      status: 'DRAFT',
      createdBy: actor.id,
      createdAt: now
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICY_VERSIONS_COL, versionId, initialVersion);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_CREATED',
      resource: 'governance_policy',
      resourceId: policyId,
      resourceName: policy.title,
      newValue: policy,
      result: 'SUCCESS'
    });

    return policy;
  }

  static async getPolicyVersions(tenantId: string, policyId: string): Promise<PolicyVersion[]> {
    const list = await FirebaseService.getTenantCollection<PolicyVersion>(GOVERNANCE_POLICY_VERSIONS_COL, tenantId, [
      where('policyId', '==', policyId)
    ]);
    return list.sort((a, b) => b.versionNumber - a.versionNumber);
  }

  static async createPolicyVersion(
    tenantId: string,
    policyId: string,
    changeSummary: string,
    policyText: string,
    effectiveFrom: string,
    actor: UserActor
  ): Promise<PolicyVersion> {
    const policy = await FirebaseService.getDocument<Policy>(GOVERNANCE_POLICIES_COL, policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error('Policy not found or cross-tenant access denied.');

    const newVersionNum = policy.currentVersion + 1;
    const versionId = FirebaseService.generateId('pol_ver');
    const now = new Date().toISOString();

    const newVersion: PolicyVersion = {
      id: versionId,
      tenantId,
      policyId,
      versionNumber: newVersionNum,
      changeSummary,
      policyText,
      effectiveFrom,
      status: 'DRAFT',
      createdBy: actor.id,
      createdAt: now
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICY_VERSIONS_COL, versionId, newVersion);

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, {
      ...policy,
      currentVersion: newVersionNum,
      status: 'DRAFT',
      updatedAt: now,
      updatedBy: actor.id
    });

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_VERSION_CREATED',
      resource: 'policy_version',
      resourceId: versionId,
      resourceName: `${policy.title} (v${newVersionNum})`,
      newValue: newVersion,
      result: 'SUCCESS'
    });

    return newVersion;
  }

  static async submitPolicyForReview(tenantId: string, policyId: string, actor: UserActor): Promise<Policy> {
    const policy = await FirebaseService.getDocument<Policy>(GOVERNANCE_POLICIES_COL, policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error('Policy not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: Policy = {
      ...policy,
      status: 'UNDER_REVIEW',
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, updated);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_SUBMITTED',
      resource: 'governance_policy',
      resourceId: policyId,
      resourceName: policy.title,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  static async approvePolicy(tenantId: string, policyId: string, actor: UserActor): Promise<Policy> {
    const policy = await FirebaseService.getDocument<Policy>(GOVERNANCE_POLICIES_COL, policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error('Policy not found or cross-tenant access denied.');

    // Separation of Duties: Policy creator or owner cannot approve own policy
    if (actor.id === policy.createdBy || actor.id === policy.ownerStaffId) {
      throw new Error('Self-approval violation: Policy creator or owner cannot approve their own policy.');
    }

    const now = new Date().toISOString();
    const updated: Policy = {
      ...policy,
      status: 'APPROVED',
      approvedBy: actor.id,
      approvedAt: now,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, updated);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_APPROVED',
      resource: 'governance_policy',
      resourceId: policyId,
      resourceName: policy.title,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  static async publishPolicy(tenantId: string, policyId: string, actor: UserActor): Promise<Policy> {
    const policy = await FirebaseService.getDocument<Policy>(GOVERNANCE_POLICIES_COL, policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error('Policy not found or cross-tenant access denied.');

    if (policy.status !== 'APPROVED') {
      throw new Error('Only approved policies can be published.');
    }

    const now = new Date().toISOString();
    const updated: Policy = {
      ...policy,
      status: 'PUBLISHED',
      publishedAt: now,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, updated);

    // Update current policy version status to PUBLISHED
    const versions = await this.getPolicyVersions(tenantId, policyId);
    const currentVer = versions.find(v => v.versionNumber === policy.currentVersion);
    if (currentVer) {
      await FirebaseService.setDocument(GOVERNANCE_POLICY_VERSIONS_COL, currentVer.id, {
        ...currentVer,
        status: 'PUBLISHED',
        approvedBy: policy.approvedBy || actor.id,
        approvedAt: policy.approvedAt || now
      });
    }

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_PUBLISHED',
      resource: 'governance_policy',
      resourceId: policyId,
      resourceName: policy.title,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  static async retirePolicy(tenantId: string, policyId: string, actor: UserActor): Promise<Policy> {
    const policy = await FirebaseService.getDocument<Policy>(GOVERNANCE_POLICIES_COL, policyId);
    if (!policy || policy.tenantId !== tenantId) throw new Error('Policy not found or cross-tenant access denied.');

    const now = new Date().toISOString();
    const updated: Policy = {
      ...policy,
      status: 'RETIRED',
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_POLICIES_COL, policyId, updated);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'POLICY_RETIRED',
      resource: 'governance_policy',
      resourceId: policyId,
      resourceName: policy.title,
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  // ==========================================
  // COMPLIANCE MANAGEMENT
  // ==========================================

  static async getComplianceFrameworks(tenantId: string, campusId?: string): Promise<ComplianceFramework[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<ComplianceFramework>(GOVERNANCE_COMPLIANCE_FRAMEWORKS_COL, tenantId, constraints);
  }

  static async createComplianceFramework(
    tenantId: string,
    data: Omit<ComplianceFramework, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<ComplianceFramework> {
    const frameworkId = FirebaseService.generateId('cmp_frk');
    const now = new Date().toISOString();

    const framework: ComplianceFramework = {
      ...data,
      id: frameworkId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_FRAMEWORKS_COL, frameworkId, framework);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPLIANCE_FRAMEWORK_CREATED',
      resource: 'compliance_framework',
      resourceId: frameworkId,
      resourceName: framework.frameworkName,
      newValue: framework,
      result: 'SUCCESS'
    });

    return framework;
  }

  static async getComplianceObligations(tenantId: string, frameworkId?: string): Promise<ComplianceObligation[]> {
    const constraints = frameworkId ? [where('frameworkId', '==', frameworkId)] : [];
    return await FirebaseService.getTenantCollection<ComplianceObligation>(GOVERNANCE_COMPLIANCE_OBLIGATIONS_COL, tenantId, constraints);
  }

  static async createComplianceObligation(
    tenantId: string,
    data: Omit<ComplianceObligation, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<ComplianceObligation> {
    const obligationId = FirebaseService.generateId('cmp_obg');
    const now = new Date().toISOString();

    const obligation: ComplianceObligation = {
      ...data,
      id: obligationId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_OBLIGATIONS_COL, obligationId, obligation);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPLIANCE_OBLIGATION_CREATED',
      resource: 'compliance_obligation',
      resourceId: obligationId,
      resourceName: obligation.title,
      newValue: obligation,
      result: 'SUCCESS'
    });

    return obligation;
  }

  static async getComplianceControls(tenantId: string, obligationId: string): Promise<ComplianceControl[]> {
    return await FirebaseService.getTenantCollection<ComplianceControl>(GOVERNANCE_COMPLIANCE_CONTROLS_COL, tenantId, [
      where('obligationId', '==', obligationId)
    ]);
  }

  static async createComplianceControl(
    tenantId: string,
    data: Omit<ComplianceControl, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<ComplianceControl> {
    const controlId = FirebaseService.generateId('cmp_ctl');
    const now = new Date().toISOString();

    const control: ComplianceControl = {
      ...data,
      id: controlId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_CONTROLS_COL, controlId, control);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPLIANCE_CONTROL_CREATED',
      resource: 'compliance_control',
      resourceId: controlId,
      resourceName: control.controlCode,
      newValue: control,
      result: 'SUCCESS'
    });

    return control;
  }

  static async getComplianceEvidence(tenantId: string, obligationId?: string): Promise<ComplianceEvidence[]> {
    const constraints = obligationId ? [where('obligationId', '==', obligationId)] : [];
    return await FirebaseService.getTenantCollection<ComplianceEvidence>(GOVERNANCE_COMPLIANCE_EVIDENCE_COL, tenantId, constraints);
  }

  static async recordComplianceEvidence(
    tenantId: string,
    data: Omit<ComplianceEvidence, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<ComplianceEvidence> {
    const evidenceId = FirebaseService.generateId('cmp_evd');
    const now = new Date().toISOString();

    const evidence: ComplianceEvidence = {
      ...data,
      id: evidenceId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_EVIDENCE_COL, evidenceId, evidence);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPLIANCE_EVIDENCE_RECORDED',
      resource: 'governance_document_ref',
      resourceId: evidenceId,
      resourceName: evidence.title,
      newValue: evidence,
      result: 'SUCCESS'
    });

    return evidence;
  }

  static async getComplianceExceptions(tenantId: string, obligationId?: string): Promise<ComplianceException[]> {
    const constraints = obligationId ? [where('obligationId', '==', obligationId)] : [];
    return await FirebaseService.getTenantCollection<ComplianceException>(GOVERNANCE_COMPLIANCE_EXCEPTIONS_COL, tenantId, constraints);
  }

  static async createComplianceException(
    tenantId: string,
    data: Omit<ComplianceException, 'id' | 'tenantId' | 'status' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<ComplianceException> {
    const exceptionId = FirebaseService.generateId('cmp_exp');
    const now = new Date().toISOString();

    const exception: ComplianceException = {
      ...data,
      id: exceptionId,
      tenantId,
      status: 'PENDING',
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_EXCEPTIONS_COL, exceptionId, exception);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'COMPLIANCE_EXCEPTION_CREATED',
      resource: 'compliance_exception',
      resourceId: exceptionId,
      resourceName: `Exception for obligation ${data.obligationId}`,
      newValue: exception,
      result: 'SUCCESS'
    });

    return exception;
  }

  static async approveComplianceException(tenantId: string, exceptionId: string, actor: UserActor): Promise<ComplianceException> {
    const exception = await FirebaseService.getDocument<ComplianceException>(GOVERNANCE_COMPLIANCE_EXCEPTIONS_COL, exceptionId);
    if (!exception || exception.tenantId !== tenantId) throw new Error('Compliance exception not found or cross-tenant access denied.');

    // Separation of Duties: Requester cannot approve own compliance exception
    if (actor.id === exception.requestedByStaffId || actor.id === exception.createdBy) {
      throw new Error('Self-approval violation: Requester cannot approve their own compliance exception.');
    }

    const now = new Date().toISOString();
    const updated: ComplianceException = {
      ...exception,
      status: 'APPROVED',
      approvedByStaffId: actor.id,
      approvedByStaffName: actor.displayName,
      approvedAt: now
    };

    await FirebaseService.setDocument(GOVERNANCE_COMPLIANCE_EXCEPTIONS_COL, exceptionId, updated);
    return updated;
  }

  // ==========================================
  // ACCREDITATION MANAGEMENT
  // ==========================================

  static async getAccreditationBodies(tenantId: string): Promise<AccreditationBody[]> {
    return await FirebaseService.getTenantCollection<AccreditationBody>(GOVERNANCE_ACCREDITATION_BODIES_COL, tenantId);
  }

  static async createAccreditationBody(
    tenantId: string,
    data: Omit<AccreditationBody, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<AccreditationBody> {
    const bodyId = FirebaseService.generateId('acc_bdy');
    const now = new Date().toISOString();

    const body: AccreditationBody = {
      ...data,
      id: bodyId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_ACCREDITATION_BODIES_COL, bodyId, body);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ACCREDITATION_BODY_CREATED',
      resource: 'accreditation_body',
      resourceId: bodyId,
      resourceName: body.name,
      newValue: body,
      result: 'SUCCESS'
    });

    return body;
  }

  static async getAccreditationCycles(tenantId: string, campusId?: string): Promise<AccreditationCycle[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<AccreditationCycle>(GOVERNANCE_ACCREDITATION_CYCLES_COL, tenantId, constraints);
  }

  static async createAccreditationCycle(
    tenantId: string,
    data: Omit<AccreditationCycle, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<AccreditationCycle> {
    const cycleId = FirebaseService.generateId('acc_cyc');
    const now = new Date().toISOString();

    const cycle: AccreditationCycle = {
      ...data,
      id: cycleId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_ACCREDITATION_CYCLES_COL, cycleId, cycle);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ACCREDITATION_CYCLE_CREATED',
      resource: 'accreditation_cycle',
      resourceId: cycleId,
      resourceName: cycle.cycleName,
      newValue: cycle,
      result: 'SUCCESS'
    });

    return cycle;
  }

  static async getAccreditationStandards(tenantId: string, cycleId: string): Promise<AccreditationStandard[]> {
    return await FirebaseService.getTenantCollection<AccreditationStandard>(GOVERNANCE_ACCREDITATION_STANDARDS_COL, tenantId, [
      where('cycleId', '==', cycleId)
    ]);
  }

  static async createAccreditationStandard(
    tenantId: string,
    data: Omit<AccreditationStandard, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<AccreditationStandard> {
    const standardId = FirebaseService.generateId('acc_std');
    const now = new Date().toISOString();

    const standard: AccreditationStandard = {
      ...data,
      id: standardId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_ACCREDITATION_STANDARDS_COL, standardId, standard);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ACCREDITATION_STANDARD_CREATED',
      resource: 'accreditation_cycle',
      resourceId: standardId,
      resourceName: standard.standardCode,
      newValue: standard,
      result: 'SUCCESS'
    });

    return standard;
  }

  static async getAccreditationCriteria(tenantId: string, standardId: string): Promise<AccreditationCriterion[]> {
    return await FirebaseService.getTenantCollection<AccreditationCriterion>(GOVERNANCE_ACCREDITATION_CRITERIA_COL, tenantId, [
      where('standardId', '==', standardId)
    ]);
  }

  static async createAccreditationCriterion(
    tenantId: string,
    data: Omit<AccreditationCriterion, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<AccreditationCriterion> {
    const criterionId = FirebaseService.generateId('acc_crt');
    const now = new Date().toISOString();

    const criterion: AccreditationCriterion = {
      ...data,
      id: criterionId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_ACCREDITATION_CRITERIA_COL, criterionId, criterion);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'ACCREDITATION_CRITERION_CREATED',
      resource: 'accreditation_cycle',
      resourceId: criterionId,
      resourceName: criterion.criterionCode,
      newValue: criterion,
      result: 'SUCCESS'
    });

    return criterion;
  }

  // ==========================================
  // QUALITY MANAGEMENT
  // ==========================================

  static async getQualityFrameworks(tenantId: string, campusId?: string): Promise<QualityFramework[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<QualityFramework>(GOVERNANCE_QUALITY_FRAMEWORKS_COL, tenantId, constraints);
  }

  static async createQualityFramework(
    tenantId: string,
    data: Omit<QualityFramework, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<QualityFramework> {
    const frameworkId = FirebaseService.generateId('qas_frk');
    const now = new Date().toISOString();

    const framework: QualityFramework = {
      ...data,
      id: frameworkId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_QUALITY_FRAMEWORKS_COL, frameworkId, framework);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'QUALITY_FRAMEWORK_CREATED',
      resource: 'quality_framework',
      resourceId: frameworkId,
      resourceName: framework.frameworkName,
      newValue: framework,
      result: 'SUCCESS'
    });

    return framework;
  }

  static async getQualityIndicators(tenantId: string, qualityFrameworkId?: string): Promise<QualityIndicator[]> {
    const constraints = qualityFrameworkId ? [where('qualityFrameworkId', '==', qualityFrameworkId)] : [];
    return await FirebaseService.getTenantCollection<QualityIndicator>(GOVERNANCE_QUALITY_INDICATORS_COL, tenantId, constraints);
  }

  static async createQualityIndicator(
    tenantId: string,
    data: Omit<QualityIndicator, 'id' | 'tenantId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<QualityIndicator> {
    const indicatorId = FirebaseService.generateId('qas_ind');
    const now = new Date().toISOString();
    const targetValue = Number(data.targetValue) || 0;

    const indicator: QualityIndicator = {
      ...data,
      targetValue,
      id: indicatorId,
      tenantId,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_QUALITY_INDICATORS_COL, indicatorId, indicator);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'QUALITY_INDICATOR_CREATED',
      resource: 'quality_indicator',
      resourceId: indicatorId,
      resourceName: indicator.name,
      newValue: indicator,
      result: 'SUCCESS'
    });

    return indicator;
  }

  static async getQualityTargets(tenantId: string, indicatorId: string): Promise<QualityTarget[]> {
    return await FirebaseService.getTenantCollection<QualityTarget>(GOVERNANCE_QUALITY_TARGETS_COL, tenantId, [
      where('indicatorId', '==', indicatorId)
    ]);
  }

  static async createQualityTarget(
    tenantId: string,
    data: Omit<QualityTarget, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<QualityTarget> {
    const targetId = FirebaseService.generateId('qas_tgt');
    const now = new Date().toISOString();
    const targetValue = Number(data.targetValue) || 0;

    const target: QualityTarget = {
      ...data,
      targetValue,
      id: targetId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_QUALITY_TARGETS_COL, targetId, target);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'QUALITY_TARGET_CREATED',
      resource: 'quality_indicator',
      resourceId: targetId,
      resourceName: `Target for indicator ${data.indicatorId}`,
      newValue: target,
      result: 'SUCCESS'
    });

    return target;
  }

  static async getQualityMeasurements(tenantId: string, indicatorId: string): Promise<QualityMeasurement[]> {
    return await FirebaseService.getTenantCollection<QualityMeasurement>(GOVERNANCE_QUALITY_MEASUREMENTS_COL, tenantId, [
      where('indicatorId', '==', indicatorId)
    ]);
  }

  static async recordQualityMeasurement(
    tenantId: string,
    data: Omit<QualityMeasurement, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<QualityMeasurement> {
    const measurementId = FirebaseService.generateId('qas_msr');
    const now = new Date().toISOString();
    const actualValue = Number(data.actualValue) || 0;
    const targetValue = Number(data.targetValue) || 0;

    const measurement: QualityMeasurement = {
      ...data,
      actualValue,
      targetValue,
      id: measurementId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_QUALITY_MEASUREMENTS_COL, measurementId, measurement);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'QUALITY_MEASUREMENT_RECORDED',
      resource: 'quality_measurement',
      resourceId: measurementId,
      resourceName: `Measurement for indicator ${data.indicatorId}`,
      newValue: measurement,
      result: 'SUCCESS'
    });

    return measurement;
  }

  // ==========================================
  // INSTITUTIONAL AUDIT & FINDINGS
  // ==========================================

  static async getInstitutionalAudits(tenantId: string, campusId?: string): Promise<InstitutionalAudit[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<InstitutionalAudit>(GOVERNANCE_INSTITUTIONAL_AUDITS_COL, tenantId, constraints);
  }

  static async createInstitutionalAudit(
    tenantId: string,
    data: Omit<InstitutionalAudit, 'id' | 'tenantId' | 'auditNumber' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<InstitutionalAudit> {
    const auditId = FirebaseService.generateId('aud_inst');
    const auditNumber = `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const audit: InstitutionalAudit = {
      ...data,
      id: auditId,
      tenantId,
      auditNumber,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_INSTITUTIONAL_AUDITS_COL, auditId, audit);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INSTITUTIONAL_AUDIT_CREATED',
      resource: 'institutional_audit',
      resourceId: auditId,
      resourceName: audit.title,
      newValue: audit,
      result: 'SUCCESS'
    });

    return audit;
  }

  static async getAuditFindings(tenantId: string, auditId?: string): Promise<AuditFinding[]> {
    const constraints = auditId ? [where('auditId', '==', auditId)] : [];
    return await FirebaseService.getTenantCollection<AuditFinding>(GOVERNANCE_AUDIT_FINDINGS_COL, tenantId, constraints);
  }

  static async createAuditFinding(
    tenantId: string,
    data: Omit<AuditFinding, 'id' | 'tenantId' | 'findingNumber' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<AuditFinding> {
    const findingId = FirebaseService.generateId('aud_fnd');
    const findingNumber = `FND-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const finding: AuditFinding = {
      ...data,
      id: findingId,
      tenantId,
      findingNumber,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_AUDIT_FINDINGS_COL, findingId, finding);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'AUDIT_FINDING_CREATED',
      resource: 'audit_finding',
      resourceId: findingId,
      resourceName: finding.title,
      newValue: finding,
      result: 'SUCCESS'
    });

    return finding;
  }

  static async getCorrectiveActions(tenantId: string, findingId?: string): Promise<CorrectiveAction[]> {
    const constraints = findingId ? [where('findingId', '==', findingId)] : [];
    return await FirebaseService.getTenantCollection<CorrectiveAction>(GOVERNANCE_CORRECTIVE_ACTIONS_COL, tenantId, constraints);
  }

  static async createCorrectiveAction(
    tenantId: string,
    data: Omit<CorrectiveAction, 'id' | 'tenantId' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<CorrectiveAction> {
    const actionId = FirebaseService.generateId('aud_act');
    const now = new Date().toISOString();

    const action: CorrectiveAction = {
      ...data,
      id: actionId,
      tenantId,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_CORRECTIVE_ACTIONS_COL, actionId, action);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'CORRECTIVE_ACTION_CREATED',
      resource: 'corrective_action',
      resourceId: actionId,
      resourceName: action.actionDescription.slice(0, 50),
      newValue: action,
      result: 'SUCCESS'
    });

    return action;
  }

  static async closeCorrectiveAction(
    tenantId: string,
    actionId: string,
    verificationEvidenceRegistryId: string,
    actor: UserActor
  ): Promise<CorrectiveAction> {
    const action = await FirebaseService.getDocument<CorrectiveAction>(GOVERNANCE_CORRECTIVE_ACTIONS_COL, actionId);
    if (!action || action.tenantId !== tenantId) throw new Error('Corrective action not found or cross-tenant access denied.');

    // Separation of Duties: Assigned staff or creator cannot self-verify corrective action closure
    if (actor.id === action.assignedStaffId || actor.id === action.createdBy) {
      throw new Error('Self-verification violation: Assigned staff cannot self-verify corrective action closure.');
    }

    const now = new Date().toISOString();
    const updated: CorrectiveAction = {
      ...action,
      status: 'CLOSED',
      verificationEvidenceRegistryId,
      verifiedByStaffId: actor.id,
      verifiedByStaffName: actor.displayName,
      verifiedAt: now
    };

    await FirebaseService.setDocument(GOVERNANCE_CORRECTIVE_ACTIONS_COL, actionId, updated);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'CORRECTIVE_ACTION_CLOSED',
      resource: 'corrective_action',
      resourceId: actionId,
      resourceName: action.actionDescription.slice(0, 50),
      newValue: updated,
      result: 'SUCCESS'
    });

    return updated;
  }

  // ==========================================
  // INSTITUTIONAL RISK FOUNDATION
  // ==========================================

  static async getInstitutionalRisks(tenantId: string, campusId?: string): Promise<InstitutionalRisk[]> {
    const constraints = campusId ? [where('campusId', '==', campusId)] : [];
    return await FirebaseService.getTenantCollection<InstitutionalRisk>(GOVERNANCE_INSTITUTIONAL_RISKS_COL, tenantId, constraints);
  }

  static async createInstitutionalRisk(
    tenantId: string,
    data: Omit<InstitutionalRisk, 'id' | 'tenantId' | 'riskNumber' | 'severityScore' | 'severityLevel' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<InstitutionalRisk> {
    const riskId = FirebaseService.generateId('gov_rsk');
    const riskNumber = `RSK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const probability = Math.min(5, Math.max(1, Math.round(Number(data.probability) || 1)));
    const impact = Math.min(5, Math.max(1, Math.round(Number(data.impact) || 1)));
    const severityScore = probability * impact;
    const severityLevel = this.deriveRiskSeverityLevel(severityScore);

    const now = new Date().toISOString();

    const risk: InstitutionalRisk = {
      ...data,
      probability,
      impact,
      severityScore,
      severityLevel,
      id: riskId,
      tenantId,
      riskNumber,
      createdAt: now,
      createdBy: actor.id,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_INSTITUTIONAL_RISKS_COL, riskId, risk);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'INSTITUTIONAL_RISK_CREATED',
      resource: 'institutional_risk',
      resourceId: riskId,
      resourceName: risk.title,
      newValue: risk,
      result: 'SUCCESS'
    });

    return risk;
  }

  static async getRiskMitigations(tenantId: string, riskId?: string): Promise<RiskMitigation[]> {
    const constraints = riskId ? [where('riskId', '==', riskId)] : [];
    return await FirebaseService.getTenantCollection<RiskMitigation>(GOVERNANCE_RISK_MITIGATIONS_COL, tenantId, constraints);
  }

  static async updateRiskMitigation(
    tenantId: string,
    riskId: string,
    data: Omit<RiskMitigation, 'id' | 'tenantId' | 'riskId' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<RiskMitigation> {
    const risk = await FirebaseService.getDocument<InstitutionalRisk>(GOVERNANCE_INSTITUTIONAL_RISKS_COL, riskId);
    if (!risk || risk.tenantId !== tenantId) throw new Error('Institutional risk not found or cross-tenant access denied.');

    const mitigationId = FirebaseService.generateId('rsk_mit');
    const now = new Date().toISOString();

    let residualProbability = data.residualProbability !== undefined ? Math.min(5, Math.max(1, Math.round(Number(data.residualProbability)))) : undefined;
    let residualImpact = data.residualImpact !== undefined ? Math.min(5, Math.max(1, Math.round(Number(data.residualImpact)))) : undefined;
    let residualSeverityScore = (residualProbability && residualImpact) ? residualProbability * residualImpact : undefined;

    const mitigation: RiskMitigation = {
      ...data,
      id: mitigationId,
      tenantId,
      riskId,
      residualProbability,
      residualImpact,
      residualSeverityScore,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(GOVERNANCE_RISK_MITIGATIONS_COL, mitigationId, mitigation);

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      actorName: actor.displayName,
      action: 'RISK_MITIGATION_UPDATED',
      resource: 'risk_mitigation',
      resourceId: mitigationId,
      resourceName: `Mitigation for risk ${risk.riskNumber}`,
      newValue: mitigation,
      result: 'SUCCESS'
    });

    return mitigation;
  }

  // Alias methods for analytics & CAPA
  static async getGovernanceAnalyticsCache(tenantId: string, campusId?: string): Promise<GovernanceAnalyticsCache> {
    return await this.rebuildGovernanceAnalyticsCache(tenantId, campusId);
  }

  static async verifyCorrectiveActionClosure(tenantId: string, actionId: string, actor: UserActor): Promise<CorrectiveAction> {
    return await this.closeCorrectiveAction(tenantId, actionId, 'verified_evidence_registry', actor);
  }

  static async addRiskMitigation(
    tenantId: string,
    riskId: string,
    data: Omit<RiskMitigation, 'id' | 'tenantId' | 'riskId' | 'updatedAt' | 'updatedBy'>,
    actor: UserActor
  ): Promise<RiskMitigation> {
    return await this.updateRiskMitigation(tenantId, riskId, data, actor);
  }

  // ==========================================
  // GOVERNANCE ANALYTICS PROJECTION CACHE
  // ==========================================

  static async rebuildGovernanceAnalyticsCache(tenantId: string, campusId?: string): Promise<GovernanceAnalyticsCache> {
    const cacheId = `cache_${tenantId}_${campusId || 'all'}`;

    const bodies = await this.getGovernanceBodies(tenantId, campusId);
    const meetings = await this.getGovernanceMeetings(tenantId);
    const policies = await this.getPolicies(tenantId, campusId);
    const obligations = await this.getComplianceObligations(tenantId);
    const cycles = await this.getAccreditationCycles(tenantId, campusId);
    const findings = await this.getAuditFindings(tenantId);
    const actions = await this.getCorrectiveActions(tenantId);
    const risks = await this.getInstitutionalRisks(tenantId, campusId);

    const activeBodiesCount = bodies.filter(b => b.status === 'ACTIVE').length;
    const upcomingMeetingsCount = meetings.filter(m => m.status === 'SCHEDULED' && new Date(m.scheduledAt) >= new Date()).length;
    const policiesAwaitingReviewCount = policies.filter(p => p.status === 'UNDER_REVIEW').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const policiesDueForReviewCount = policies.filter(p => p.reviewDueAt && p.reviewDueAt < todayStr && p.status !== 'RETIRED').length;

    const openComplianceCount = obligations.filter(o => o.status === 'OPEN' || o.status === 'IN_PROGRESS' || o.status === 'NON_COMPLIANT').length;
    const overdueComplianceCount = obligations.filter(o => o.dueDate && o.dueDate < todayStr && o.status !== 'COMPLIANT' && o.status !== 'CLOSED' && o.status !== 'EXCEPTION').length;

    let accreditationReadinessPercent = 0;
    if (cycles.length > 0) {
      const activeCycles = cycles.filter(c => c.status !== 'EXPIRED');
      if (activeCycles.length > 0) {
        const sumReadiness = activeCycles.reduce((acc, c) => acc + (c.overallReadinessScore || 0), 0);
        accreditationReadinessPercent = Math.round((sumReadiness / activeCycles.length) * 10) / 10;
      }
    }

    const openAuditFindingsCount = findings.filter(f => f.status === 'OPEN' || f.status === 'CORRECTIVE_ACTION_REQUIRED').length;
    const overdueCorrectiveActionsCount = actions.filter(a => a.dueDate && a.dueDate < todayStr && a.status !== 'CLOSED').length;
    const highRiskCount = risks.filter(r => (r.severityLevel === 'HIGH' || r.severityLevel === 'CRITICAL') && r.status !== 'CLOSED').length;

    const cache: GovernanceAnalyticsCache = {
      id: cacheId,
      tenantId,
      campusId,
      activeBodiesCount,
      upcomingMeetingsCount,
      policiesAwaitingReviewCount,
      policiesDueForReviewCount,
      openComplianceCount,
      overdueComplianceCount,
      accreditationReadinessPercent,
      openAuditFindingsCount,
      overdueCorrectiveActionsCount,
      highRiskCount,
      lastUpdated: new Date().toISOString()
    };

    await FirebaseService.setDocument(GOVERNANCE_ANALYTICS_CACHE_COL, cacheId, cache);
    return cache;
  }
}
