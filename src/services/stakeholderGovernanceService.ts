import { 
  FirebaseService, 
  handleFirestoreError 
} from './firebaseService';
import { db } from '../config/firebase';
import { 
  collection, doc, getDocs, getDoc, query, where, 
  setDoc, updateDoc, writeBatch, runTransaction, QueryConstraint
} from 'firebase/firestore';
import { 
  Stakeholder, StakeholderGroup, StakeholderSegment, 
  StakeholderRelationship, StakeholderEngagementPlan, 
  StakeholderEngagementActivity, InstitutionalCommunication, 
  CommunicationVersion, CommunicationApproval, 
  CommunicationPublication, Announcement, Consultation, 
  StakeholderComplaint, StakeholderIssue, StakeholderEscalation, 
  ReputationObservation, ReputationSnapshot, StakeholderRisk, 
  ExecutiveCommunicationDecision, StakeholderDataQualityIssue, 
  StakeholderAuditEvent
} from '../types/stakeholderGovernance';
import { User } from '../types/index';

const STAKEHOLDERS_COL = 'stakeholders';
const GROUPS_COL = 'stakeholder_groups';
const SEGMENTS_COL = 'stakeholder_segments';
const RELATIONSHIPS_COL = 'stakeholder_relationships';
const PLANS_COL = 'engagement_plans';
const ACTIVITIES_COL = 'engagement_activities';
const COMMS_COL = 'institutional_communications';
const COMM_VERSIONS_COL = 'communication_versions';
const COMM_APPROVALS_COL = 'communication_approvals';
const COMM_PUBLICATIONS_COL = 'communication_publications';
const ANNOUNCEMENTS_COL = 'institutional_announcements';
const CONSULTATIONS_COL = 'consultations';
const COMPLAINTS_COL = 'stakeholder_complaints';
const ISSUES_COL = 'stakeholder_issues';
const ESCALATIONS_COL = 'stakeholder_escalations';
const REPUTATION_OBS_COL = 'reputation_observations';
const REPUTATION_SNAP_COL = 'reputation_snapshots';
const RISKS_COL = 'stakeholder_risks';
const EXEC_COMMS_COL = 'executive_communication_decisions';
const DATA_QUALITY_COL = 'stakeholder_data_quality_issues';
const AUDIT_COL = 'stakeholder_audit_logs';

export class StakeholderGovernanceService {

  // ==========================================
  // AUDIT LOGGING
  // ==========================================
  private static async logAudit(
    tenantId: string, campusScope: string, actorId: string, action: string, 
    entityType: string, entityId: string, 
    previousState?: any, resultingState?: any, justification?: string
  ): Promise<void> {
    const event: StakeholderAuditEvent = {
      id: `sa_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tenantId,
      campusScope,
      actorId,
      action,
      entityType,
      entityId,
      timestamp: new Date().toISOString(),
      previousState,
      resultingState,
      justification
    };
    await setDoc(doc(db, AUDIT_COL, event.id), event);
  }

  static async getAuditLogs(tenantId: string, limitCount = 50): Promise<StakeholderAuditEvent[]> {
    try {
      return await FirebaseService.getTenantCollection<StakeholderAuditEvent>(AUDIT_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, AUDIT_COL);
      return [];
    }
  }

  // ==========================================
  // STAKEHOLDERS
  // ==========================================
  static async registerStakeholder(
    tenantId: string, 
    data: Omit<Stakeholder, 'id' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>,
    actor: User
  ): Promise<Stakeholder> {
    const stakeholder: Stakeholder = {
      ...data,
      id: `stk_${Date.now()}`,
      tenantId,
      createdBy: actor.id,
      createdAt: new Date().toISOString(),
      updatedBy: actor.id,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, STAKEHOLDERS_COL, stakeholder.id), stakeholder);
    await this.logAudit(tenantId, data.campusScope, actor.id, 'REGISTER_STAKEHOLDER', 'Stakeholder', stakeholder.id, null, stakeholder);
    return stakeholder;
  }

  static async getStakeholders(tenantId: string): Promise<Stakeholder[]> {
    try {
      return await FirebaseService.getTenantCollection<Stakeholder>(STAKEHOLDERS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, STAKEHOLDERS_COL);
      return [];
    }
  }

  // ==========================================
  // ENGAGEMENT PLANS
  // ==========================================
  static async createEngagementPlan(
    tenantId: string,
    data: Omit<StakeholderEngagementPlan, 'id' | 'tenantId' | 'status' | 'createdBy' | 'createdAt'>,
    actor: User
  ): Promise<StakeholderEngagementPlan> {
    const plan: StakeholderEngagementPlan = {
      ...data,
      id: `plan_${Date.now()}`,
      tenantId,
      status: 'DRAFT',
      createdBy: actor.id,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, PLANS_COL, plan.id), plan);
    await this.logAudit(tenantId, data.campusScope, actor.id, 'CREATE_PLAN', 'StakeholderEngagementPlan', plan.id, null, plan);
    return plan;
  }

  static async getEngagementPlans(tenantId: string): Promise<StakeholderEngagementPlan[]> {
    try {
      return await FirebaseService.getTenantCollection<StakeholderEngagementPlan>(PLANS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, PLANS_COL);
      return [];
    }
  }

  // ==========================================
  // COMMUNICATIONS
  // ==========================================
  static async createCommunication(
    tenantId: string,
    data: Omit<InstitutionalCommunication, 'id' | 'tenantId' | 'status' | 'version' | 'createdBy' | 'createdAt'>,
    actor: User
  ): Promise<InstitutionalCommunication> {
    const comm: InstitutionalCommunication = {
      ...data,
      id: `comm_${Date.now()}`,
      tenantId,
      status: 'DRAFT',
      version: 1,
      createdBy: actor.id,
      createdAt: new Date().toISOString()
    };
    
    const version: CommunicationVersion = {
      id: `cv_${Date.now()}`,
      tenantId,
      communicationId: comm.id,
      version: 1,
      content: comm.content,
      createdBy: actor.id,
      createdAt: comm.createdAt
    };

    const batch = writeBatch(db);
    batch.set(doc(db, COMMS_COL, comm.id), comm);
    batch.set(doc(db, COMM_VERSIONS_COL, version.id), version);
    await batch.commit();

    await this.logAudit(tenantId, data.campusScope, actor.id, 'CREATE_COMMUNICATION', 'InstitutionalCommunication', comm.id, null, comm);
    return comm;
  }

  static async getCommunications(tenantId: string): Promise<InstitutionalCommunication[]> {
    try {
      return await FirebaseService.getTenantCollection<InstitutionalCommunication>(COMMS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, COMMS_COL);
      return [];
    }
  }

  static async approveCommunication(tenantId: string, communicationId: string, actor: User, rationale: string): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const commRef = doc(db, COMMS_COL, communicationId);
      const commSnap = await transaction.get(commRef);
      if (!commSnap.exists()) throw new Error("Communication not found");
      const comm = commSnap.data() as InstitutionalCommunication;

      if (comm.tenantId !== tenantId) throw new Error("Cross-tenant access denied");
      if (comm.status !== 'DRAFT' && comm.status !== 'APPROVAL_PENDING') {
        throw new Error(`Cannot approve communication in status ${comm.status}`);
      }

      // 4-Eyes Separation of Duties
      if (comm.createdBy === actor.id && !actor.isPlatformSuperAdmin) {
        throw new Error('Separation of Duties Violation: Creator cannot approve their own communication.');
      }

      const approval: CommunicationApproval = {
        id: `capp_${Date.now()}`,
        tenantId,
        communicationId,
        version: comm.version,
        approverId: actor.id,
        approverName: actor.displayName || actor.email || 'Approver',
        decision: 'APPROVED',
        rationale,
        approvedAt: new Date().toISOString()
      };

      transaction.set(doc(db, COMM_APPROVALS_COL, approval.id), approval);
      transaction.update(commRef, { status: 'APPROVED' });
    });

    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'APPROVE_COMMUNICATION', 'InstitutionalCommunication', communicationId);
  }

  static async publishCommunication(tenantId: string, communicationId: string, actor: User, channels: string[]): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const commRef = doc(db, COMMS_COL, communicationId);
      const commSnap = await transaction.get(commRef);
      if (!commSnap.exists()) throw new Error("Communication not found");
      const comm = commSnap.data() as InstitutionalCommunication;

      if (comm.tenantId !== tenantId) throw new Error("Cross-tenant access denied");
      if (comm.status !== 'APPROVED') {
        throw new Error(`Cannot publish communication. Current status: ${comm.status}. Must be APPROVED.`);
      }

      const pub: CommunicationPublication = {
        id: `cpub_${Date.now()}`,
        tenantId,
        communicationId,
        version: comm.version,
        publishedBy: actor.id,
        publishedAt: new Date().toISOString(),
        channels
      };

      transaction.set(doc(db, COMM_PUBLICATIONS_COL, pub.id), pub);
      transaction.update(commRef, { status: 'PUBLISHED' });
    });

    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'PUBLISH_COMMUNICATION', 'InstitutionalCommunication', communicationId);
  }

  // ==========================================
  // COMPLAINTS
  // ==========================================
  static async createComplaint(
    tenantId: string,
    data: Omit<StakeholderComplaint, 'id' | 'tenantId' | 'status' | 'createdAt'>,
    actor: User
  ): Promise<StakeholderComplaint> {
    const comp: StakeholderComplaint = {
      ...data,
      id: `comp_${Date.now()}`,
      tenantId,
      status: 'RECEIVED',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, COMPLAINTS_COL, comp.id), comp);
    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'CREATE_COMPLAINT', 'StakeholderComplaint', comp.id, null, comp);
    return comp;
  }

  static async getComplaints(tenantId: string): Promise<StakeholderComplaint[]> {
    try {
      return await FirebaseService.getTenantCollection<StakeholderComplaint>(COMPLAINTS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, COMPLAINTS_COL);
      return [];
    }
  }

  static async closeComplaint(tenantId: string, complaintId: string, actor: User, resolution: string): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const compRef = doc(db, COMPLAINTS_COL, complaintId);
      const compSnap = await transaction.get(compRef);
      if (!compSnap.exists()) throw new Error("Complaint not found");
      const comp = compSnap.data() as StakeholderComplaint;

      if (comp.tenantId !== tenantId) throw new Error("Cross-tenant access denied");

      // SoD enforcement: Owner cannot unilaterally close if it is CRITICAL severity
      if (comp.ownerId === actor.id && comp.severity === 'SEVERE' && !actor.isPlatformSuperAdmin) {
        throw new Error('Separation of Duties Violation: Investigator cannot unilaterally close a SEVERE complaint.');
      }

      transaction.update(compRef, { status: 'CLOSED' });
    });

    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'CLOSE_COMPLAINT', 'StakeholderComplaint', complaintId);
  }

  // ==========================================
  // EXECUTIVE COMMUNICATIONS
  // ==========================================
  static async proposeExecutiveCommunication(
    tenantId: string,
    data: Omit<ExecutiveCommunicationDecision, 'id' | 'tenantId' | 'status' | 'createdAt'>,
    actor: User
  ): Promise<ExecutiveCommunicationDecision> {
    const exec: ExecutiveCommunicationDecision = {
      ...data,
      id: `excd_${Date.now()}`,
      tenantId,
      status: 'PROPOSED',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, EXEC_COMMS_COL, exec.id), exec);
    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'PROPOSE_EXEC_COMM', 'ExecutiveCommunicationDecision', exec.id, null, exec);
    return exec;
  }

  static async getExecutiveCommunications(tenantId: string): Promise<ExecutiveCommunicationDecision[]> {
    try {
      return await FirebaseService.getTenantCollection<ExecutiveCommunicationDecision>(EXEC_COMMS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, EXEC_COMMS_COL);
      return [];
    }
  }

  static async approveExecutiveCommunication(tenantId: string, execId: string, actor: User): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const execRef = doc(db, EXEC_COMMS_COL, execId);
      const execSnap = await transaction.get(execRef);
      if (!execSnap.exists()) throw new Error("Exec comm decision not found");
      const exec = execSnap.data() as ExecutiveCommunicationDecision;

      if (exec.tenantId !== tenantId) throw new Error("Cross-tenant access denied");

      // 4-Eyes Governance
      if (exec.proposerId === actor.id && !actor.isPlatformSuperAdmin) {
        throw new Error('Separation of Duties Violation: Executive cannot approve their own communication decision.');
      }

      transaction.update(execRef, { 
        status: 'APPROVED',
        approverId: actor.id
      });
    });

    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'APPROVE_EXEC_COMM', 'ExecutiveCommunicationDecision', execId);
  }

  // ==========================================
  // STAKEHOLDER RISK
  // ==========================================
  static async createStakeholderRisk(
    tenantId: string,
    data: Omit<StakeholderRisk, 'id' | 'tenantId' | 'status' | 'createdAt'>,
    actor: User
  ): Promise<StakeholderRisk> {
    const risk: StakeholderRisk = {
      ...data,
      id: `srisk_${Date.now()}`,
      tenantId,
      status: 'IDENTIFIED',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, RISKS_COL, risk.id), risk);
    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'CREATE_RISK', 'StakeholderRisk', risk.id, null, risk);
    return risk;
  }

  static async getStakeholderRisks(tenantId: string): Promise<StakeholderRisk[]> {
    try {
      return await FirebaseService.getTenantCollection<StakeholderRisk>(RISKS_COL, tenantId);
    } catch (err) {
      handleFirestoreError(err, 'list' as any, RISKS_COL);
      return [];
    }
  }

  static async closeStakeholderRisk(tenantId: string, riskId: string, actor: User): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const riskRef = doc(db, RISKS_COL, riskId);
      const riskSnap = await transaction.get(riskRef);
      if (!riskSnap.exists()) throw new Error("Risk not found");
      const risk = riskSnap.data() as StakeholderRisk;

      if (risk.tenantId !== tenantId) throw new Error("Cross-tenant access denied");

      if (risk.ownerId === actor.id && risk.severity === 'CRITICAL' && !actor.isPlatformSuperAdmin) {
        throw new Error('Separation of Duties Violation: Risk owner cannot independently close a CRITICAL risk.');
      }

      transaction.update(riskRef, { status: 'CLOSED' });
    });
    
    await this.logAudit(tenantId, 'ALL_CAMPUSES', actor.id, 'CLOSE_RISK', 'StakeholderRisk', riskId);
  }

  // ==========================================
  // SEED BASELINE
  // ==========================================
  static async seedBaselineGovernance(tenantId: string, actor: User): Promise<void> {
    // Generate baseline data if needed
    const groups = await this.getEngagementPlans(tenantId);
    if (groups.length > 0) return;

    await this.createEngagementPlan(tenantId, {
      campusScope: 'ALL_CAMPUSES',
      title: 'FY2026 Academic Industry Advisory Board Engagement',
      objective: 'Align institutional programs with industry employer needs.',
      engagementPurpose: 'Curriculum alignment and strategic employment partnerships.',
      stakeholderGroupIds: ['grp_industry_01'],
      ownerId: actor.id,
      ownerName: actor.displayName || 'Engagement Officer',
      expectedOutcomes: 'Secured 15 new internship MOU agreements.'
    }, actor);

    await this.createStakeholderRisk(tenantId, {
      title: 'Negative Media Coverage on Housing Shortage',
      stakeholderGroupId: 'grp_media_01',
      likelihood: 'HIGH',
      impact: 'HIGH',
      severity: 'HIGH',
      ownerId: actor.id,
      mitigation: 'Proactive PR campaign and community town hall.',
      dueDate: '2026-10-01'
    }, actor);
  }
}
