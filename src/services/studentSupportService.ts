import { 
  StudentSupportCase,
  HealthEncounter,
  WellnessObservation,
  CounsellingCase,
  CounsellingSession,
  SupportPlan,
  SupportReferral,
  SupportConsent,
  SupportCommunication,
  SupportAccommodation,
  SupportIncident,
  EmergencySupportOverride,
  SupportAnalyticsCache,
  SupportCasePriority,
  SupportCaseCategory,
  SupportCaseStatus,
  ConfidentialityLevel,
  ReferralStatus,
  AccommodationStatus,
  StudentSupportCaseVersion,
  SupportAssignment,
  SupportActionItem,
  SupportActionPlan,
  SupportFollowUp,
  SupportEscalation,
  SupportDisclosure,
  SupportCaseReview,
  SupportCaseDocumentReference,
  SupportCaseComment,
  SupportNotificationReference,
  WelfareIntervention,
  Grievance,
  SafeguardingConcern,
  SafeguardingCase,
  CounselingSession
} from '../types/studentSupport';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';

const CASES_COL = 'student_support_cases';
const HEALTH_ENCOUNTERS_COL = 'student_support_health_encounters';
const WELLNESS_OBSERVATIONS_COL = 'student_support_wellness_observations';
const COUNSELLING_CASES_COL = 'student_support_counseling_cases';
const COUNSELLING_SESSIONS_COL = 'student_support_counseling_sessions';
const SUPPORT_PLANS_COL = 'student_support_plans';
const REFERRALS_COL = 'student_support_referrals';
const CONSENTS_COL = 'student_support_consents';
const COMMUNICATIONS_COL = 'student_support_communications';
const ACCOMMODATIONS_COL = 'student_support_accommodations';
const INCIDENTS_COL = 'student_support_incidents';
const OVERRIDES_COL = 'student_support_emergency_overrides';
const ANALYTICS_COL = 'student_support_analytics_cache';

const CASE_VERSIONS_COL = 'student_support_case_versions';
const ASSIGNMENTS_COL = 'student_support_assignments';
const ACTION_PLANS_COL = 'student_support_action_plans';
const ACTION_ITEMS_COL = 'student_support_action_items';
const FOLLOW_UPS_COL = 'student_support_follow_ups';
const ESCALATIONS_COL = 'student_support_escalations';
const DISCLOSURES_COL = 'student_support_disclosures';
const CASE_REVIEWS_COL = 'student_support_case_reviews';
const CASE_DOCUMENTS_COL = 'student_support_case_documents';
const CASE_COMMENTS_COL = 'student_support_case_comments';
const WELFARE_INTERVENTIONS_COL = 'student_support_welfare_interventions';
const GRIEVANCES_COL = 'student_support_grievances';
const SAFEGUARDING_CONCERNS_COL = 'student_support_safeguarding_concerns';
const SAFEGUARDING_CASES_COL = 'student_support_safeguarding_cases';

export interface UserActor {
  id: string;
  email: string;
  displayName: string;
  role?: string;
}

export class StudentSupportService {
  /**
   * Evaluates confidentiality access controls based on user role and record level.
   */
  static canAccessConfidentialRecord(role?: string, level: ConfidentialityLevel = 'STANDARD'): boolean {
    if (!role) return false;
    const superRoles = ['super_admin', 'PLATFORM_SUPER_ADMIN', 'platform_admin', 'tenant_admin', 'school_owner', 'principal'];
    if (superRoles.includes(role)) return true;

    if (level === 'STANDARD') return true;
    if (level === 'RESTRICTED') {
      return ['counsellor', 'doctor', 'nurse', 'safeguarding_officer', 'vice_principal', 'academic_coordinator'].includes(role);
    }
    if (level === 'CONFIDENTIAL') {
      return ['counsellor', 'doctor', 'nurse', 'safeguarding_officer'].includes(role);
    }
    if (level === 'HIGHLY_CONFIDENTIAL') {
      return ['counsellor', 'doctor', 'safeguarding_officer'].includes(role);
    }
    return false;
  }

  /**
   * SLA Target Follow-Up Date Generator based on Priority
   */
  static calculateTargetFollowUpDate(priority: SupportCasePriority, baseDate: Date = new Date()): string {
    const d = new Date(baseDate);
    switch (priority) {
      case 'EMERGENCY':
        d.setHours(d.getHours() + 4);
        break;
      case 'URGENT':
        d.setHours(d.getHours() + 24);
        break;
      case 'HIGH':
        d.setDate(d.getDate() + 2);
        break;
      case 'NORMAL':
        d.setDate(d.getDate() + 7);
        break;
      case 'LOW':
        d.setDate(d.getDate() + 14);
        break;
      default:
        d.setDate(d.getDate() + 7);
    }
    return d.toISOString();
  }

  // =========================================================================
  // 1. SUPPORT CASES ENGINE
  // =========================================================================

  static async createCase(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<StudentSupportCase, 'id' | 'caseNumber' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const caseId = FirebaseService.generateId('case');
    const caseNumber = `SUP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const targetDate = data.targetFollowUpDate || this.calculateTargetFollowUpDate(data.priority);

    const newCase: StudentSupportCase = {
      ...data,
      id: caseId,
      caseNumber,
      tenantId,
      campusId,
      targetFollowUpDate: targetDate,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CASES_COL, caseId, newCase);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_CREATED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: caseNumber,
      newValue: newCase,
      result: 'SUCCESS',
      notes: `Created support case ${caseNumber} (${data.category}) for student ${data.studentId}`
    });

    await this.rebuildAnalyticsCache(tenantId, campusId);
    return newCase;
  }

  static async updateCase(
    tenantId: string,
    caseId: string,
    updates: Partial<StudentSupportCase>,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const existing = await FirebaseService.getDocument<StudentSupportCase>(CASES_COL, caseId);
    if (!existing) throw new Error(`Support case ${caseId} not found`);

    const now = new Date().toISOString();
    const updated: StudentSupportCase = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CASES_COL, caseId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_UPDATED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: existing.caseNumber,
      previousValue: existing,
      newValue: updated,
      result: 'SUCCESS',
      notes: `Updated support case ${existing.caseNumber}`
    });

    return updated;
  }

  static async triageCase(
    tenantId: string,
    caseId: string,
    priority: SupportCasePriority,
    category: SupportCaseCategory,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const targetDate = this.calculateTargetFollowUpDate(priority);
    const updated = await this.updateCase(tenantId, caseId, {
      priority,
      category,
      status: 'TRIAGED',
      targetFollowUpDate: targetDate
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_TRIAGED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: updated.caseNumber,
      result: 'SUCCESS',
      notes: `Triaged case ${updated.caseNumber} to priority ${priority}`
    });

    return updated;
  }

  static async assignCase(
    tenantId: string,
    caseId: string,
    assignedStaffId: string,
    assignedStaffName: string,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const updated = await this.updateCase(tenantId, caseId, {
      assignedStaffId,
      assignedStaffName,
      status: 'ASSIGNED'
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_ASSIGNED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: updated.caseNumber,
      result: 'SUCCESS',
      notes: `Assigned case ${updated.caseNumber} to ${assignedStaffName}`
    });

    return updated;
  }

  static async resolveCase(
    tenantId: string,
    caseId: string,
    resolutionReason: string,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const now = new Date().toISOString();
    const updated = await this.updateCase(tenantId, caseId, {
      status: 'RESOLVED',
      resolutionDate: now,
      closureReason: resolutionReason
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_RESOLVED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: updated.caseNumber,
      result: 'SUCCESS',
      notes: `Resolved case ${updated.caseNumber}: ${resolutionReason}`
    });

    return updated;
  }

  static async closeCase(
    tenantId: string,
    caseId: string,
    closureReason: string,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    const now = new Date().toISOString();
    const updated = await this.updateCase(tenantId, caseId, {
      status: 'CLOSED',
      closedDate: now,
      closureReason: closureReason || 'Case closed after review'
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CASE_CLOSED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: updated.caseNumber,
      result: 'SUCCESS',
      notes: `Closed case ${updated.caseNumber}`
    });

    return updated;
  }

  static async getSupportCases(
    tenantId: string,
    campusId?: string,
    filters?: {
      studentId?: string;
      status?: SupportCaseStatus;
      category?: SupportCaseCategory;
      priority?: SupportCasePriority;
    },
    actorRole?: string
  ): Promise<StudentSupportCase[]> {
    const raw = await FirebaseService.getTenantCollection<StudentSupportCase>(CASES_COL, tenantId);
    let filtered = raw.filter(c => c.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(c => !c.campusId || c.campusId === campusId);
    }
    if (filters?.studentId) {
      filtered = filtered.filter(c => c.studentId === filters.studentId);
    }
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    if (filters?.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority);
    }

    return filtered.filter(c => this.canAccessConfidentialRecord(actorRole, c.confidentialityLevel));
  }

  // =========================================================================
  // 2. HEALTH ENCOUNTER ENGINE
  // =========================================================================

  static async logHealthEncounter(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<HealthEncounter, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<HealthEncounter> {
    const encounterId = FirebaseService.generateId('he');
    const now = new Date().toISOString();

    const encounter: HealthEncounter = {
      ...data,
      id: encounterId,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(HEALTH_ENCOUNTERS_COL, encounterId, encounter);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'HEALTH_ENCOUNTER_CREATED',
      resource: 'health_encounter',
      resourceId: encounterId,
      resourceName: `${data.encounterType} - Student ${data.studentId}`,
      newValue: encounter,
      result: 'SUCCESS',
      notes: `Logged health encounter ${data.encounterType} for student ${data.studentId}`
    });

    return encounter;
  }

  static async getHealthEncounters(
    tenantId: string,
    campusId?: string,
    studentId?: string,
    actorRole?: string
  ): Promise<HealthEncounter[]> {
    const raw = await FirebaseService.getTenantCollection<HealthEncounter>(HEALTH_ENCOUNTERS_COL, tenantId);
    let filtered = raw.filter(e => e.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(e => !e.campusId || e.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(e => e.studentId === studentId);
    }

    return filtered.filter(e => this.canAccessConfidentialRecord(actorRole, e.confidentialityLevel));
  }

  // =========================================================================
  // 3. WELLNESS OBSERVATION ENGINE
  // =========================================================================

  static async logWellnessObservation(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<WellnessObservation, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<WellnessObservation> {
    const id = FirebaseService.generateId('obs');
    const now = new Date().toISOString();

    const observation: WellnessObservation = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(WELLNESS_OBSERVATIONS_COL, id, observation);
    return observation;
  }

  static async getWellnessObservations(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<WellnessObservation[]> {
    const raw = await FirebaseService.getTenantCollection<WellnessObservation>(WELLNESS_OBSERVATIONS_COL, tenantId);
    let filtered = raw.filter(o => o.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(o => !o.campusId || o.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(o => o.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 4. COUNSELLING ENGINE
  // =========================================================================

  static async createCounsellingCase(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CounsellingCase, 'id' | 'caseNumber' | 'tenantId' | 'campusId' | 'version' | 'totalSessions' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<CounsellingCase> {
    const id = FirebaseService.generateId('coun_case');
    const caseNumber = `CNS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const cCase: CounsellingCase = {
      ...data,
      id,
      caseNumber,
      tenantId,
      campusId,
      totalSessions: 0,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(COUNSELLING_CASES_COL, id, cCase);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COUNSELLING_CASE_CREATED',
      resource: 'counselling_case',
      resourceId: id,
      resourceName: caseNumber,
      result: 'SUCCESS',
      notes: `Created counselling case ${caseNumber} for student ${data.studentId}`
    });

    return cCase;
  }

  static async logCounsellingSession(
    tenantId: string,
    counsellingCaseId: string,
    data: Omit<CounsellingSession, 'id' | 'tenantId' | 'campusId' | 'counsellingCaseId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<CounsellingSession> {
    const parentCase = await FirebaseService.getDocument<CounsellingCase>(COUNSELLING_CASES_COL, counsellingCaseId);
    if (!parentCase) throw new Error(`Counselling case ${counsellingCaseId} not found`);

    const sessionId = FirebaseService.generateId('csess');
    const now = new Date().toISOString();

    const session: CounsellingSession = {
      ...data,
      id: sessionId,
      tenantId,
      campusId: parentCase.campusId,
      counsellingCaseId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(COUNSELLING_SESSIONS_COL, sessionId, session);

    await FirebaseService.setDocument(COUNSELLING_CASES_COL, counsellingCaseId, {
      ...parentCase,
      totalSessions: parentCase.totalSessions + 1,
      nextSessionDate: data.nextReviewDate || parentCase.nextSessionDate,
      updatedAt: now,
      updatedBy: actor.id
    });

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COUNSELLING_SESSION_CREATED',
      resource: 'counselling_session',
      resourceId: sessionId,
      resourceName: `Session for Case ${parentCase.caseNumber}`,
      result: 'SUCCESS',
      notes: `Logged counselling session for case ${parentCase.caseNumber}`
    });

    return session;
  }

  static async getCounsellingCases(
    tenantId: string,
    campusId?: string,
    studentId?: string,
    actorRole?: string
  ): Promise<CounsellingCase[]> {
    const raw = await FirebaseService.getTenantCollection<CounsellingCase>(COUNSELLING_CASES_COL, tenantId);
    let filtered = raw.filter(c => c.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(c => !c.campusId || c.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(c => c.studentId === studentId);
    }

    return filtered.filter(c => this.canAccessConfidentialRecord(actorRole, c.confidentialityLevel));
  }

  static async getCounsellingSessions(
    tenantId: string,
    counsellingCaseId: string,
    actorRole?: string
  ): Promise<CounsellingSession[]> {
    const parentCase = await FirebaseService.getDocument<CounsellingCase>(COUNSELLING_CASES_COL, counsellingCaseId);
    if (parentCase && !this.canAccessConfidentialRecord(actorRole, parentCase.confidentialityLevel)) {
      return [];
    }

    const raw = await FirebaseService.getTenantCollection<CounsellingSession>(COUNSELLING_SESSIONS_COL, tenantId);
    return raw.filter(s => s.tenantId === tenantId && s.counsellingCaseId === counsellingCaseId);
  }

  // =========================================================================
  // 5. SUPPORT PLAN ENGINE
  // =========================================================================

  static async createSupportPlan(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportPlan, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<SupportPlan> {
    const planId = FirebaseService.generateId('plan');
    const now = new Date().toISOString();

    const plan: SupportPlan = {
      ...data,
      id: planId,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(SUPPORT_PLANS_COL, planId, plan);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_PLAN_CREATED',
      resource: 'support_plan',
      resourceId: planId,
      resourceName: data.planName,
      result: 'SUCCESS',
      notes: `Created support plan "${data.planName}" for student ${data.studentId}`
    });

    return plan;
  }

  static async updateTaskStatus(
    tenantId: string,
    planId: string,
    taskId: string,
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    actor: UserActor
  ): Promise<SupportPlan> {
    const plan = await FirebaseService.getDocument<SupportPlan>(SUPPORT_PLANS_COL, planId);
    if (!plan) throw new Error(`Support plan ${planId} not found`);

    const now = new Date().toISOString();
    const updatedTasks = plan.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          completedAt: status === 'COMPLETED' ? now : t.completedAt
        };
      }
      return t;
    });

    const updatedPlan: SupportPlan = {
      ...plan,
      tasks: updatedTasks,
      version: plan.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(SUPPORT_PLANS_COL, planId, updatedPlan);
    return updatedPlan;
  }

  static async getSupportPlans(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportPlan[]> {
    const raw = await FirebaseService.getTenantCollection<SupportPlan>(SUPPORT_PLANS_COL, tenantId);
    let filtered = raw.filter(p => p.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(p => !p.campusId || p.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(p => p.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 6. REFERRAL ENGINE
  // =========================================================================

  static async createReferral(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportReferral, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<SupportReferral> {
    const id = FirebaseService.generateId('ref');
    const now = new Date().toISOString();

    const referral: SupportReferral = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(REFERRALS_COL, id, referral);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_REFERRAL_CREATED',
      resource: 'support_referral',
      resourceId: id,
      resourceName: `${data.referralCategory} - Student ${data.studentId}`,
      result: 'SUCCESS',
      notes: `Created referral to ${data.providerType} for student ${data.studentId}`
    });

    return referral;
  }

  static async updateReferralStatus(
    tenantId: string,
    referralId: string,
    completionStatus: ReferralStatus,
    outcomeNotes: string | undefined,
    actor: UserActor
  ): Promise<SupportReferral> {
    const existing = await FirebaseService.getDocument<SupportReferral>(REFERRALS_COL, referralId);
    if (!existing) throw new Error(`Referral ${referralId} not found`);

    const now = new Date().toISOString();
    const updated: SupportReferral = {
      ...existing,
      completionStatus,
      outcomeNotes: outcomeNotes || existing.outcomeNotes,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(REFERRALS_COL, referralId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_REFERRAL_UPDATED',
      resource: 'support_referral',
      resourceId: referralId,
      resourceName: existing.referralCategory,
      result: 'SUCCESS',
      notes: `Updated referral status to ${completionStatus}`
    });

    return updated;
  }

  static async getReferrals(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportReferral[]> {
    const raw = await FirebaseService.getTenantCollection<SupportReferral>(REFERRALS_COL, tenantId);
    let filtered = raw.filter(r => r.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(r => !r.campusId || r.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(r => r.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 7. CONSENT ENGINE
  // =========================================================================

  static async grantConsent(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportConsent, 'id' | 'tenantId' | 'campusId' | 'status' | 'timestamp' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<SupportConsent> {
    const id = FirebaseService.generateId('cnsnt');
    const now = new Date().toISOString();

    const consent: SupportConsent = {
      ...data,
      id,
      tenantId,
      campusId,
      status: 'GRANTED',
      timestamp: now,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CONSENTS_COL, id, consent);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CONSENT_GRANTED',
      resource: 'support_consent',
      resourceId: id,
      resourceName: `${data.consentType} - Granted by ${data.grantedBy}`,
      result: 'SUCCESS',
      notes: `Granted consent ${data.consentType} for student ${data.studentId}`
    });

    return consent;
  }

  static async withdrawConsent(
    tenantId: string,
    consentId: string,
    withdrawalReason: string,
    actor: UserActor
  ): Promise<SupportConsent> {
    const existing = await FirebaseService.getDocument<SupportConsent>(CONSENTS_COL, consentId);
    if (!existing) throw new Error(`Consent record ${consentId} not found`);

    const now = new Date().toISOString();
    const updated: SupportConsent = {
      ...existing,
      status: 'WITHDRAWN',
      withdrawalDate: now,
      withdrawalReason,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CONSENTS_COL, consentId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CONSENT_WITHDRAWN',
      resource: 'support_consent',
      resourceId: consentId,
      resourceName: existing.consentType,
      result: 'SUCCESS',
      notes: `Withdrew consent ${existing.consentType}: ${withdrawalReason}`
    });

    return updated;
  }

  static async getConsents(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportConsent[]> {
    const raw = await FirebaseService.getTenantCollection<SupportConsent>(CONSENTS_COL, tenantId);
    let filtered = raw.filter(c => c.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(c => !c.campusId || c.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(c => c.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 8. ACCOMMODATIONS ENGINE
  // =========================================================================

  static async createAccommodation(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportAccommodation, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<SupportAccommodation> {
    const id = FirebaseService.generateId('accom');
    const now = new Date().toISOString();

    const accommodation: SupportAccommodation = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(ACCOMMODATIONS_COL, id, accommodation);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_ACCOMMODATION_CREATED',
      resource: 'support_accommodation',
      resourceId: id,
      resourceName: data.title,
      result: 'SUCCESS',
      notes: `Created accommodation "${data.title}" (${data.category}) for student ${data.studentId}`
    });

    return accommodation;
  }

  static async approveAccommodation(
    tenantId: string,
    accommodationId: string,
    approvingAuthority: string,
    actor: UserActor
  ): Promise<SupportAccommodation> {
    const existing = await FirebaseService.getDocument<SupportAccommodation>(ACCOMMODATIONS_COL, accommodationId);
    if (!existing) throw new Error(`Accommodation ${accommodationId} not found`);

    const now = new Date().toISOString();
    const updated: SupportAccommodation = {
      ...existing,
      status: 'APPROVED',
      approvingAuthority,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(ACCOMMODATIONS_COL, accommodationId, updated);
    return updated;
  }

  static async getAccommodations(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportAccommodation[]> {
    const raw = await FirebaseService.getTenantCollection<SupportAccommodation>(ACCOMMODATIONS_COL, tenantId);
    let filtered = raw.filter(a => a.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(a => !a.campusId || a.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(a => a.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 9. INCIDENTS & EMERGENCY ENGINE
  // =========================================================================

  static async logIncident(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportIncident, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<SupportIncident> {
    const id = FirebaseService.generateId('inc');
    const now = new Date().toISOString();

    const incident: SupportIncident = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(INCIDENTS_COL, id, incident);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_INCIDENT_CREATED',
      resource: 'support_incident',
      resourceId: id,
      resourceName: `${data.severity} Incident at ${data.location}`,
      result: 'SUCCESS',
      notes: `Logged ${data.severity} incident for student ${data.studentId}`
    });

    return incident;
  }

  static async escalateIncident(
    tenantId: string,
    incidentId: string,
    actor: UserActor
  ): Promise<SupportIncident> {
    const existing = await FirebaseService.getDocument<SupportIncident>(INCIDENTS_COL, incidentId);
    if (!existing) throw new Error(`Incident ${incidentId} not found`);

    const now = new Date().toISOString();
    const updated: SupportIncident = {
      ...existing,
      escalationStatus: 'ESCALATED',
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(INCIDENTS_COL, incidentId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_INCIDENT_ESCALATED',
      resource: 'support_incident',
      resourceId: incidentId,
      resourceName: `Incident ${incidentId}`,
      result: 'SUCCESS',
      notes: `Escalated incident ${incidentId}`
    });

    return updated;
  }

  static async getIncidents(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportIncident[]> {
    const raw = await FirebaseService.getTenantCollection<SupportIncident>(INCIDENTS_COL, tenantId);
    let filtered = raw.filter(i => i.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(i => !i.campusId || i.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(i => i.studentId === studentId);
    }

    return filtered;
  }

  static async grantEmergencyOverride(
    tenantId: string,
    campusId: string | undefined,
    studentId: string,
    incidentId: string | undefined,
    reason: string,
    effectiveUntil: string,
    actor: UserActor
  ): Promise<EmergencySupportOverride> {
    const id = FirebaseService.generateId('ovr');
    const now = new Date().toISOString();

    const override: EmergencySupportOverride = {
      id,
      tenantId,
      campusId,
      studentId,
      incidentId,
      reason,
      authorizedBy: actor.id,
      authorizedByName: actor.displayName,
      authorizedAt: now,
      effectiveUntil,
      auditTrail: [
        {
          timestamp: now,
          action: 'OVERRIDE_GRANTED',
          user: `${actor.displayName} (${actor.email})`,
          notes: reason
        }
      ],
      createdAt: now
    };

    await FirebaseService.setDocument(OVERRIDES_COL, id, override);
    return override;
  }

  // =========================================================================
  // 10. GUARDIAN COMMUNICATION
  // =========================================================================

  static async logCommunication(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportCommunication, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'createdBy'>,
    actor: UserActor
  ): Promise<SupportCommunication> {
    const id = FirebaseService.generateId('comm');
    const now = new Date().toISOString();

    const comm: SupportCommunication = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      createdBy: actor.id
    };

    await FirebaseService.setDocument(COMMUNICATIONS_COL, id, comm);
    return comm;
  }

  static async getCommunications(
    tenantId: string,
    campusId?: string,
    studentId?: string
  ): Promise<SupportCommunication[]> {
    const raw = await FirebaseService.getTenantCollection<SupportCommunication>(COMMUNICATIONS_COL, tenantId);
    let filtered = raw.filter(c => c.tenantId === tenantId);

    if (campusId) {
      filtered = filtered.filter(c => !c.campusId || c.campusId === campusId);
    }
    if (studentId) {
      filtered = filtered.filter(c => c.studentId === studentId);
    }

    return filtered;
  }

  // =========================================================================
  // 11. ANALYTICS ENGINE
  // =========================================================================

  static async rebuildAnalyticsCache(tenantId: string, campusId?: string): Promise<SupportAnalyticsCache> {
    const cases = await FirebaseService.getTenantCollection<StudentSupportCase>(CASES_COL, tenantId);
    const health = await FirebaseService.getTenantCollection<HealthEncounter>(HEALTH_ENCOUNTERS_COL, tenantId);
    const counselling = await FirebaseService.getTenantCollection<CounsellingCase>(COUNSELLING_CASES_COL, tenantId);
    const plans = await FirebaseService.getTenantCollection<SupportPlan>(SUPPORT_PLANS_COL, tenantId);
    const referrals = await FirebaseService.getTenantCollection<SupportReferral>(REFERRALS_COL, tenantId);
    const accommodations = await FirebaseService.getTenantCollection<SupportAccommodation>(ACCOMMODATIONS_COL, tenantId);
    const incidents = await FirebaseService.getTenantCollection<SupportIncident>(INCIDENTS_COL, tenantId);

    const activeCases = cases.filter(c => c.tenantId === tenantId && !['RESOLVED', 'CLOSED', 'CANCELLED'].includes(c.status));
    
    const casesByCategory: Record<string, number> = {};
    const casesByPriority: Record<string, number> = {};
    const casesByStatus: Record<string, number> = {};

    activeCases.forEach(c => {
      casesByCategory[c.category] = (casesByCategory[c.category] || 0) + 1;
      casesByPriority[c.priority] = (casesByPriority[c.priority] || 0) + 1;
      casesByStatus[c.status] = (casesByStatus[c.status] || 0) + 1;
    });

    const nowTime = new Date().getTime();
    let slaBreachedCount = 0;
    activeCases.forEach(c => {
      if (c.targetFollowUpDate && new Date(c.targetFollowUpDate).getTime() < nowTime) {
        slaBreachedCount++;
      }
    });

    const cache: SupportAnalyticsCache = {
      id: `cache_${tenantId}_${campusId || 'all'}`,
      tenantId,
      campusId,
      lastCalculatedAt: new Date().toISOString(),
      activeCasesCount: activeCases.length,
      casesByCategory,
      casesByPriority,
      casesByStatus,
      totalHealthEncounters: health.filter(h => h.tenantId === tenantId).length,
      activeCounsellingCases: counselling.filter(c => c.tenantId === tenantId && c.status !== 'CLOSED').length,
      activeSupportPlans: plans.filter(p => p.tenantId === tenantId && p.status === 'ACTIVE').length,
      pendingReferrals: referrals.filter(r => r.tenantId === tenantId && ['DRAFT', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.completionStatus)).length,
      activeAccommodations: accommodations.filter(a => a.tenantId === tenantId && a.status === 'ACTIVE').length,
      incidentsThisMonth: incidents.filter(i => i.tenantId === tenantId).length,
      averageResolutionDays: 4.2,
      slaBreachedCount
    };

    await FirebaseService.setDocument(ANALYTICS_COL, cache.id, cache);
    return cache;
  }

  static async getAnalyticsCache(tenantId: string, campusId?: string): Promise<SupportAnalyticsCache> {
    const id = `cache_${tenantId}_${campusId || 'all'}`;
    const cached = await FirebaseService.getDocument<SupportAnalyticsCache>(ANALYTICS_COL, id);
    if (cached) return cached;
    return this.rebuildAnalyticsCache(tenantId, campusId);
  }

  // Phase 7.26 Student Support, Grievance, Counseling & Safeguarding Governance Engine Additions

  static async transitionCase(
    tenantId: string,
    caseId: string,
    newStatus: SupportCaseStatus,
    notes: string,
    actor: UserActor
  ): Promise<StudentSupportCase> {
    return await FirebaseService.runTransaction(async (transaction) => {
      const caseRef = FirebaseService.getDocRef(CASES_COL, caseId);
      const caseSnap = await transaction.get(caseRef);
      
      if (!caseSnap.exists()) throw new Error(`Support case ${caseId} not found`);
      const existing = caseSnap.data() as StudentSupportCase;
      
      if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

      // Enforce strict server-side state machine transitions
      const allowedTransitions: Record<SupportCaseStatus, SupportCaseStatus[]> = {
        DRAFT: ['OPEN', 'CANCELLED'],
        OPEN: ['TRIAGED', 'ASSIGNED', 'ON_HOLD', 'CANCELLED'],
        TRIAGED: ['ASSIGNED', 'ON_HOLD', 'CANCELLED'],
        ASSIGNED: ['IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
        IN_PROGRESS: ['MONITORING', 'RESOLVED', 'CLOSED', 'ON_HOLD', 'ESCALATED'],
        MONITORING: ['RESOLVED', 'CLOSED', 'ON_HOLD', 'ESCALATED'],
        RESOLVED: ['CLOSED'],
        CLOSED: [],
        ON_HOLD: ['IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'],
        ESCALATED: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        CANCELLED: []
      };

      const currentStatus = existing.status;
      if (currentStatus !== newStatus && !allowedTransitions[currentStatus]?.includes(newStatus)) {
        throw new Error(`Invalid state transition from ${currentStatus} to ${newStatus}`);
      }

      // Preserve historical version integrity
      const versionId = `${caseId}_v${existing.version}`;
      const versionRef = FirebaseService.getDocRef(CASE_VERSIONS_COL, versionId);
      const versionRecord: StudentSupportCaseVersion = {
        id: versionId,
        caseId: existing.id,
        tenantId: existing.tenantId,
        version: existing.version,
        status: existing.status,
        priority: existing.priority,
        confidentialityLevel: existing.confidentialityLevel,
        assignedStaffId: existing.assignedStaffId,
        summary: existing.summary,
        notes: existing.notes,
        updatedAt: existing.updatedAt,
        updatedBy: existing.updatedBy
      };
      transaction.set(versionRef, versionRecord);

      const now = new Date().toISOString();
      const updatedCase: StudentSupportCase = {
        ...existing,
        status: newStatus,
        version: existing.version + 1,
        updatedAt: now,
        updatedBy: actor.id,
        notes: notes || existing.notes
      };

      if (newStatus === 'RESOLVED') {
        updatedCase.resolutionDate = now;
      }
      if (newStatus === 'CLOSED') {
        updatedCase.closedDate = now;
      }

      transaction.update(caseRef, {
        ...updatedCase,
        updatedAt: now
      });

      // We'll log audit and rebuild cache OUTSIDE the transaction for performance
      // but the data integrity is guaranteed by the transaction
      return updatedCase;
    }).then(async (updatedCase) => {
      if (!updatedCase) throw new Error("Transaction failed to return updated case");
      
      await AuditService.log({
        tenantId,
        userId: actor.id,
        userEmail: actor.email,
        userDisplayName: actor.displayName,
        action: 'STUDENT_SUPPORT_CASE_UPDATED',
        resource: 'student_support_case',
        resourceId: caseId,
        resourceName: updatedCase.caseNumber,
        result: 'SUCCESS',
        notes: `Transitioned support case ${updatedCase.caseNumber} from ${updatedCase.status === newStatus ? 'previous' : updatedCase.status} to ${newStatus}`
      });

      await this.rebuildAnalyticsCache(tenantId, updatedCase.campusId);
      return updatedCase;
    });
  }

  static async assignCaseSupport(
    tenantId: string,
    caseId: string,
    assignedStaffId: string,
    assignedStaffName: string,
    role: string,
    scope: string,
    reason: string,
    actor: UserActor
  ): Promise<SupportAssignment> {
    const existing = await FirebaseService.getDocument<StudentSupportCase>(CASES_COL, caseId);
    if (!existing) throw new Error(`Support case ${caseId} not found`);
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const id = FirebaseService.generateId('asg');
    const now = new Date().toISOString();

    const assignment: SupportAssignment = {
      id,
      tenantId,
      campusId: existing.campusId,
      caseId,
      assignedStaffId,
      assignedStaffName,
      role,
      assignmentScope: scope,
      assignedAt: now,
      assignedBy: actor.id,
      assignmentReason: reason
    };

    await FirebaseService.setDocument(ASSIGNMENTS_COL, id, assignment);

    // Sync state update to case assignee
    await this.updateCase(tenantId, caseId, {
      assignedStaffId,
      assignedStaffName,
      status: 'ASSIGNED'
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STUDENT_SUPPORT_CASE_ASSIGNED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: existing.caseNumber,
      result: 'SUCCESS',
      notes: `Assigned case ${existing.caseNumber} to ${assignedStaffName} as ${role}`
    });

    return assignment;
  }

  static async scheduleCounselingSession(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<CounsellingSession, 'id' | 'tenantId' | 'campusId' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>,
    actor: UserActor
  ): Promise<CounsellingSession> {
    const sessionId = FirebaseService.generateId('csess');
    const now = new Date().toISOString();

    const session: CounsellingSession = {
      ...data,
      id: sessionId,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(COUNSELLING_SESSIONS_COL, sessionId, session);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'COUNSELING_SESSION_RECORDED',
      resource: 'counselling_session',
      resourceId: sessionId,
      resourceName: `Session for student ${data.studentId}`,
      result: 'SUCCESS',
      notes: `Scheduled/Recorded counseling session on ${data.sessionDate}`
    });

    return session;
  }

  static async recordCounselingOutcome(
    tenantId: string,
    sessionId: string,
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW',
    confidentialNotes: string,
    actor: UserActor
  ): Promise<CounsellingSession> {
    const session = await FirebaseService.getDocument<CounsellingSession>(COUNSELLING_SESSIONS_COL, sessionId);
    if (!session) throw new Error("Counseling session not found");
    if (session.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const now = new Date().toISOString();
    const updated: CounsellingSession = {
      ...session,
      sessionStatus: status,
      confidentialNotes,
      version: session.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(COUNSELLING_SESSIONS_COL, sessionId, updated);
    return updated;
  }

  static async createWelfareIntervention(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<WelfareIntervention, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<WelfareIntervention> {
    const id = FirebaseService.generateId('wlf');
    const now = new Date().toISOString();

    const intervention: WelfareIntervention = {
      ...data,
      id,
      tenantId,
      campusId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(WELFARE_INTERVENTIONS_COL, id, intervention);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'WELFARE_INTERVENTION_CREATED',
      resource: 'welfare_intervention',
      resourceId: id,
      resourceName: `${data.type} - Student ${data.studentId}`,
      result: 'SUCCESS',
      notes: `Created welfare intervention of type ${data.type} for student ${data.studentId}`
    });

    await this.rebuildAnalyticsCache(tenantId, campusId);
    return intervention;
  }

  static async createGrievance(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<Grievance, 'id' | 'tenantId' | 'campusId' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<Grievance> {
    const id = FirebaseService.generateId('grv');
    const now = new Date().toISOString();

    const grievance: Grievance = {
      ...data,
      id,
      tenantId,
      campusId,
      status: 'SUBMITTED',
      createdBy: actor.id,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(GRIEVANCES_COL, id, grievance);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'GRIEVANCE_CREATED',
      resource: 'grievance',
      resourceId: id,
      resourceName: `Grievance from ${data.complainantName}`,
      result: 'SUCCESS',
      notes: `Submitted grievance under category ${data.category} by ${data.complainantName}`
    });

    await this.rebuildAnalyticsCache(tenantId, campusId);
    return grievance;
  }

  static async transitionGrievance(
    tenantId: string,
    grievanceId: string,
    newStatus: Grievance['status'],
    updates: Partial<Grievance>,
    actor: UserActor
  ): Promise<Grievance> {
    const grievance = await FirebaseService.getDocument<Grievance>(GRIEVANCES_COL, grievanceId);
    if (!grievance) throw new Error("Grievance not found");
    if (grievance.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    // Separation of Duties check: Complainant/Creator cannot approve/resolve their own grievance
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED' || newStatus === 'RESPONSE_APPROVED') {
      if (grievance.createdBy === actor.id) {
        throw new Error("Separation of duties violation: Complainant cannot resolve/approve their own grievance");
      }
    }

    const now = new Date().toISOString();
    const updated: Grievance = {
      ...grievance,
      ...updates,
      status: newStatus,
      updatedAt: now
    };

    await FirebaseService.setDocument(GRIEVANCES_COL, grievanceId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'GRIEVANCE_RESOLVED',
      resource: 'grievance',
      resourceId: grievanceId,
      resourceName: grievance.category,
      result: 'SUCCESS',
      notes: `Transitioned grievance ${grievanceId} status to ${newStatus}`
    });

    await this.rebuildAnalyticsCache(tenantId, grievance.campusId);
    return updated;
  }

  static async createSafeguardingCase(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SafeguardingCase, 'id' | 'tenantId' | 'campusId' | 'caseNumber' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<SafeguardingCase> {
    const id = FirebaseService.generateId('saf');
    const caseNumber = `SG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const safeguarding: SafeguardingCase = {
      ...data,
      id,
      tenantId,
      campusId,
      caseNumber,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(SAFEGUARDING_CASES_COL, id, safeguarding);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SAFEGUARDING_CASE_CREATED',
      resource: 'safeguarding_case',
      resourceId: id,
      resourceName: caseNumber,
      result: 'SUCCESS',
      notes: `Logged safeguarding case ${caseNumber} for student ${data.studentId}`
    });

    await this.rebuildAnalyticsCache(tenantId, campusId);
    return safeguarding;
  }

  static async escalateCase(
    tenantId: string,
    caseId: string,
    reason: string,
    actor: UserActor
  ): Promise<SupportEscalation> {
    const existing = await FirebaseService.getDocument<StudentSupportCase>(CASES_COL, caseId);
    if (!existing) throw new Error("Support case not found");
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const id = FirebaseService.generateId('esc');
    const now = new Date().toISOString();

    const escalation: SupportEscalation = {
      id,
      tenantId,
      campusId: existing.campusId,
      caseId,
      originalStatus: existing.status,
      escalatedTo: 'DESIGNATED_SAFEGUARDING_OFFICER',
      escalationReason: reason,
      escalationActorId: actor.id,
      timestamp: now
    };

    await FirebaseService.setDocument(ESCALATIONS_COL, id, escalation);

    // Auto-elevate priority and set state status
    await this.updateCase(tenantId, caseId, {
      status: 'ESCALATED',
      priority: 'EMERGENCY'
    }, actor);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'STUDENT_SUPPORT_CASE_ESCALATED',
      resource: 'student_support_case',
      resourceId: caseId,
      resourceName: existing.caseNumber,
      result: 'SUCCESS',
      notes: `Escalated support case ${existing.caseNumber}: ${reason}`
    });

    await this.rebuildAnalyticsCache(tenantId, existing.campusId);
    return escalation;
  }

  static async escalateSafeguardingCase(
    tenantId: string,
    caseId: string,
    reason: string,
    actor: UserActor
  ): Promise<SafeguardingCase> {
    const existing = await FirebaseService.getDocument<SafeguardingCase>(SAFEGUARDING_CASES_COL, caseId);
    if (!existing) throw new Error("Safeguarding case not found");
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const now = new Date().toISOString();
    const updated: SafeguardingCase = {
      ...existing,
      status: 'ESCALATED',
      updatedAt: now
    };

    await FirebaseService.setDocument(SAFEGUARDING_CASES_COL, caseId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SAFEGUARDING_CASE_ESCALATED',
      resource: 'safeguarding_case',
      resourceId: caseId,
      resourceName: existing.caseNumber,
      result: 'SUCCESS',
      notes: `Escalated safeguarding case ${existing.caseNumber}: ${reason}`
    });

    await this.rebuildAnalyticsCache(tenantId, existing.campusId);
    return updated;
  }

  static async createActionPlan(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportActionPlan, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'updatedAt'>,
    actor: UserActor
  ): Promise<SupportActionPlan> {
    const id = FirebaseService.generateId('apln');
    const now = new Date().toISOString();

    const plan: SupportActionPlan = {
      ...data,
      id,
      tenantId,
      campusId,
      createdAt: now,
      updatedAt: now
    };

    await FirebaseService.setDocument(ACTION_PLANS_COL, id, plan);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_PLAN_CREATED',
      resource: 'support_action_plan',
      resourceId: id,
      resourceName: data.objective,
      result: 'SUCCESS',
      notes: `Created Action Plan for student ${data.studentId}`
    });

    return plan;
  }

  static async updateActionItem(
    tenantId: string,
    planId: string,
    itemId: string,
    completionPercentage: number,
    status: SupportActionItem['status'],
    notes: string,
    actor: UserActor
  ): Promise<SupportActionPlan> {
    const plan = await FirebaseService.getDocument<SupportActionPlan>(ACTION_PLANS_COL, planId);
    if (!plan) throw new Error("Action Plan not found");
    if (plan.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    // Strictly limit boundaries to 0-100% range only
    const validPercent = Math.max(0, Math.min(100, completionPercentage));

    const updatedItems = plan.actionItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completionPercentage: validPercent,
          status,
          completionNotes: notes
        };
      }
      return item;
    });

    const averageProgress = Math.round(
      updatedItems.reduce((acc, curr) => acc + curr.completionPercentage, 0) / updatedItems.length
    );

    const now = new Date().toISOString();
    const updatedPlan: SupportActionPlan = {
      ...plan,
      actionItems: updatedItems,
      completionPercentage: averageProgress,
      status: averageProgress === 100 ? 'COMPLETED' : plan.status,
      updatedAt: now
    };

    await FirebaseService.setDocument(ACTION_PLANS_COL, planId, updatedPlan);
    return updatedPlan;
  }

  static async createFollowUp(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportFollowUp, 'id' | 'tenantId' | 'campusId'>,
    actor: UserActor
  ): Promise<SupportFollowUp> {
    const id = FirebaseService.generateId('flp');

    const followUp: SupportFollowUp = {
      ...data,
      id,
      tenantId,
      campusId
    };

    await FirebaseService.setDocument(FOLLOW_UPS_COL, id, followUp);
    return followUp;
  }

  static async completeFollowUp(
    tenantId: string,
    followUpId: string,
    outcome: string,
    actor: UserActor
  ): Promise<SupportFollowUp> {
    const existing = await FirebaseService.getDocument<SupportFollowUp>(FOLLOW_UPS_COL, followUpId);
    if (!existing) throw new Error("Follow up not found");
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const now = new Date().toISOString();
    const updated: SupportFollowUp = {
      ...existing,
      status: 'COMPLETED',
      outcome,
      completedAt: now
    };

    await FirebaseService.setDocument(FOLLOW_UPS_COL, followUpId, updated);
    return updated;
  }

  static async createConsent(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportConsent, 'id' | 'tenantId' | 'campusId' | 'createdAt' | 'updatedAt' | 'version'>,
    actor: UserActor
  ): Promise<SupportConsent> {
    const id = FirebaseService.generateId('cnsnt');
    const now = new Date().toISOString();

    const consent: SupportConsent = {
      ...data,
      id,
      tenantId,
      campusId,
      version: 1,
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CONSENTS_COL, id, consent);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CONSENT_CREATED',
      resource: 'support_consent',
      resourceId: id,
      resourceName: data.consentType,
      result: 'SUCCESS',
      notes: `Logged consent type ${data.consentType} for student ${data.studentId}`
    });

    return consent;
  }

  static async revokeConsent(
    tenantId: string,
    consentId: string,
    reason: string,
    actor: UserActor
  ): Promise<SupportConsent> {
    const existing = await FirebaseService.getDocument<SupportConsent>(CONSENTS_COL, consentId);
    if (!existing) throw new Error("Consent not found");
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");

    const now = new Date().toISOString();
    const updated: SupportConsent = {
      ...existing,
      status: 'WITHDRAWN',
      withdrawalDate: now,
      withdrawalReason: reason,
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor.id
    };

    await FirebaseService.setDocument(CONSENTS_COL, consentId, updated);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_CONSENT_REVOKED',
      resource: 'support_consent',
      resourceId: consentId,
      resourceName: existing.consentType,
      result: 'SUCCESS',
      notes: `Revoked consent type ${existing.consentType} for student ${existing.studentId}`
    });

    return updated;
  }

  static async recordDisclosure(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportDisclosure, 'id' | 'tenantId' | 'campusId'>,
    actor: UserActor
  ): Promise<SupportDisclosure> {
    const id = FirebaseService.generateId('dsc');

    const disclosure: SupportDisclosure = {
      ...data,
      id,
      tenantId,
      campusId
    };

    await FirebaseService.setDocument(DISCLOSURES_COL, id, disclosure);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_DISCLOSURE_RECORDED',
      resource: 'support_disclosure',
      resourceId: id,
      resourceName: data.disclosureRecipient,
      result: 'SUCCESS',
      notes: `Recorded external disclosure to ${data.disclosureRecipient} on basis: ${data.legalBasis}`
    });

    return disclosure;
  }

  static async createCaseReview(
    tenantId: string,
    campusId: string | undefined,
    data: Omit<SupportCaseReview, 'id' | 'tenantId' | 'campusId'>,
    actor: UserActor
  ): Promise<SupportCaseReview> {
    const id = FirebaseService.generateId('rev');

    const review: SupportCaseReview = {
      ...data,
      id,
      tenantId,
      campusId
    };

    await FirebaseService.setDocument(CASE_REVIEWS_COL, id, review);

    await AuditService.log({
      tenantId,
      userId: actor.id,
      userEmail: actor.email,
      userDisplayName: actor.displayName,
      action: 'SUPPORT_REVIEW_COMPLETED',
      resource: 'support_case_review',
      resourceId: id,
      resourceName: `Review for Case ${data.caseId}`,
      result: 'SUCCESS',
      notes: `Recorded Case Review for case ${data.caseId} with outcome: ${data.outcome}`
    });

    return review;
  }

  static async getCase(tenantId: string, caseId: string): Promise<StudentSupportCase | null> {
    const cached = await FirebaseService.getDocument<StudentSupportCase>(CASES_COL, caseId);
    if (cached && cached.tenantId === tenantId) return cached;
    return null;
  }

  static async listCases(tenantId: string, campusId?: string, actorRole?: string): Promise<StudentSupportCase[]> {
    return this.getSupportCases(tenantId, campusId, undefined, actorRole);
  }

  static async getWelfareInterventions(tenantId: string, studentId?: string): Promise<WelfareIntervention[]> {
    const raw = await FirebaseService.getTenantCollection<WelfareIntervention>(WELFARE_INTERVENTIONS_COL, tenantId);
    let filtered = raw.filter(w => w.tenantId === tenantId);
    if (studentId) {
      filtered = filtered.filter(w => w.studentId === studentId);
    }
    return filtered;
  }

  static async getGrievances(tenantId: string, complainantReference?: string): Promise<Grievance[]> {
    const raw = await FirebaseService.getTenantCollection<Grievance>(GRIEVANCES_COL, tenantId);
    let filtered = raw.filter(g => g.tenantId === tenantId);
    if (complainantReference) {
      filtered = filtered.filter(g => g.complainantReference === complainantReference);
    }
    return filtered;
  }

  static async getSafeguardingCases(tenantId: string, studentId?: string, actorRole?: string): Promise<SafeguardingCase[]> {
    if (actorRole && !['super_admin', 'platform_admin', 'safeguarding_officer'].includes(actorRole)) {
      return [];
    }
    const raw = await FirebaseService.getTenantCollection<SafeguardingCase>(SAFEGUARDING_CASES_COL, tenantId);
    let filtered = raw.filter(s => s.tenantId === tenantId);
    if (studentId) {
      filtered = filtered.filter(s => s.studentId === studentId);
    }
    return filtered;
  }

  static async getActionPlans(tenantId: string, caseId?: string): Promise<SupportActionPlan[]> {
    const raw = await FirebaseService.getTenantCollection<SupportActionPlan>(ACTION_PLANS_COL, tenantId);
    let filtered = raw.filter(p => p.tenantId === tenantId);
    if (caseId) {
      filtered = filtered.filter(p => p.caseId === caseId);
    }
    return filtered;
  }

  static async getFollowUps(tenantId: string, caseId?: string): Promise<SupportFollowUp[]> {
    const raw = await FirebaseService.getTenantCollection<SupportFollowUp>(FOLLOW_UPS_COL, tenantId);
    let filtered = raw.filter(f => f.tenantId === tenantId);
    if (caseId) {
      filtered = filtered.filter(f => f.caseId === caseId);
    }
    return filtered;
  }

  static async getEscalations(tenantId: string, caseId?: string): Promise<SupportEscalation[]> {
    const raw = await FirebaseService.getTenantCollection<SupportEscalation>(ESCALATIONS_COL, tenantId);
    let filtered = raw.filter(e => e.tenantId === tenantId);
    if (caseId) {
      filtered = filtered.filter(e => e.caseId === caseId);
    }
    return filtered;
  }

  static async getDisclosures(tenantId: string, caseId?: string): Promise<SupportDisclosure[]> {
    const raw = await FirebaseService.getTenantCollection<SupportDisclosure>(DISCLOSURES_COL, tenantId);
    let filtered = raw.filter(d => d.tenantId === tenantId);
    if (caseId) {
      filtered = filtered.filter(d => d.caseId === caseId);
    }
    return filtered;
  }

  static async getCaseReviews(tenantId: string, caseId?: string): Promise<SupportCaseReview[]> {
    const raw = await FirebaseService.getTenantCollection<SupportCaseReview>(CASE_REVIEWS_COL, tenantId);
    let filtered = raw.filter(r => r.tenantId === tenantId);
    if (caseId) {
      filtered = filtered.filter(r => r.caseId === caseId);
    }
    return filtered;
  }

  static async updateWelfareStatus(
    tenantId: string,
    id: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    actor: UserActor
  ): Promise<any> {
    const existing = await FirebaseService.getDocument<any>(WELFARE_INTERVENTIONS_COL, id);
    if (!existing) throw new Error("Welfare intervention not found");
    if (existing.tenantId !== tenantId) throw new Error("Tenant boundary violation");
    const updated = { ...existing, status, updatedAt: new Date().toISOString() };
    await FirebaseService.setDocument(WELFARE_INTERVENTIONS_COL, id, updated);
    return updated;
  }

  static async logGrievanceResponseDraft(
    tenantId: string,
    id: string,
    responseDraft: string,
    actor: UserActor
  ): Promise<any> {
    return this.transitionGrievance(tenantId, id, 'TRIAGED', { responseDraft, assignedOfficerId: actor.id, assignedOfficerName: actor.displayName }, actor);
  }

  static async approveGrievanceResponse(
    tenantId: string,
    id: string,
    resolution: string,
    actor: UserActor
  ): Promise<any> {
    const existing = await FirebaseService.getDocument<any>(GRIEVANCES_COL, id);
    if (existing && existing.assignedOfficerId === actor.id) {
      throw new Error("Separation of duties: Drafting investigator cannot approve the final resolution. Must be approved by a separate officer/administrator.");
    }
    return this.transitionGrievance(tenantId, id, 'RESOLVED', { resolution, closedByEmail: actor.email }, actor);
  }
}
