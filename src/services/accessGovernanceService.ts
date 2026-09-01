// EMS Access Governance Service
// Authoritative security-hardened administration layer

import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  runTransaction,
  limit,
  orderBy
} from 'firebase/firestore';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { 
  UserGovernanceStatus,
  ModuleAssignment,
  UserRoleAssignment,
  UserModuleAssignment,
  UserCampusAssignment,
  TemporaryAccessGrant,
  DelegatedAdministrationGrant,
  AccessReview,
  AccessReviewItem,
  SecuritySession,
  SecurityAccessEvent,
  AccessGovernanceAnalyticsCache
} from '../types/accessGovernance';
import { ScopeConstraint, User } from '../types';

export class AccessGovernanceService {
  private static readonly USERS_COL = 'users';
  private static readonly MODULE_ASSIGN_COL = 'module_assignments';
  private static readonly TEMP_GRANT_COL = 'temporary_access_grants';
  private static readonly DELEGATE_COL = 'delegated_administration_grants';
  private static readonly ACCESS_REVIEW_COL = 'access_reviews';
  private static readonly ACCESS_REVIEW_ITEM_COL = 'access_review_items';
  private static readonly SESSION_COL = 'security_sessions';
  private static readonly SEC_EVENT_COL = 'security_access_events';

  /**
   * Helper to validate IDOR/Tenant isolation server-side
   */
  private static validateTenantIsolation(tenantId: string, targetTenantId: string): void {
    if (tenantId !== 'ALL' && tenantId !== targetTenantId) {
      throw new Error(`Access Denied: Isolation breach detected. Cannot cross boundary from ${tenantId} to ${targetTenantId}.`);
    }
  }

  /**
   * Helper to validate Self-Privilege Escalation
   */
  private static checkSelfEscalation(actorId: string, targetUserId: string): void {
    if (actorId === targetUserId) {
      throw new Error('Access Denied: Self-privilege escalation is strictly prohibited.');
    }
  }

  // ==========================================
  // USER LIFECYCLE GOVERNANCE
  // ==========================================

  static async updateUserStatus(
    tenantId: string,
    userId: string,
    newStatus: UserGovernanceStatus,
    reason: string,
    actor: { id: string; email: string; name: string }
  ): Promise<void> {
    this.checkSelfEscalation(actor.id, userId);

    const userRef = doc(db, this.USERS_COL, userId);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(userRef);
      if (!docSnap.exists()) {
        throw new Error(`User ${userId} not found.`);
      }

      const userData = docSnap.data() as User;
      const currentTenantId = userData.defaultTenantId || 'ALL';
      this.validateTenantIsolation(tenantId, currentTenantId);

      // Final platform administrator protection
      if (newStatus !== 'ACTIVE' && userData.isPlatformSuperAdmin) {
        // Count other active platform administrators
        const usersRef = collection(db, this.USERS_COL);
        const q = query(usersRef, where('isPlatformSuperAdmin', '==', true));
        const allSuperSnap = await getDocs(q);
        const activeSupers = allSuperSnap.docs.filter(d => {
          const u = d.data();
          return u.id !== userId && u.status === 'active';
        });

        if (activeSupers.length === 0) {
          throw new Error('Access Denied: Cannot disable or lock the final active Platform Administrator.');
        }
      }

      // Perform update
      transaction.update(userRef, {
        status: newStatus.toLowerCase(),
        updatedAt: new Date().toISOString()
      });
    });

    // Immutable Audit Trail logging
    await AuditService.log({
      tenantId,
      actorId: actor.id,
      userEmail: actor.email,
      actorName: actor.name,
      action: `USER_${newStatus}` as any,
      resource: 'user',
      resourceId: userId,
      notes: `Status changed to ${newStatus}. Reason: ${reason}`
    });
  }

  // ==========================================
  // USER ↔ ROLE ASSIGNMENT
  // ==========================================

  static async assignRole(
    tenantId: string,
    userId: string,
    roleCode: string,
    roleId: string,
    scopes: ScopeConstraint[],
    reason: string,
    actor: { id: string; email: string; name: string }
  ): Promise<void> {
    this.checkSelfEscalation(actor.id, userId);

    // Prevent assigning platform-wide role from non-platform scope
    if ((roleCode || '').toUpperCase() === 'PLATFORM_SUPER_ADMINISTRATOR' && tenantId !== 'ALL') {
      throw new Error('Access Denied: Platform Super Admin role can only be assigned at the platform level.');
    }

    const userRef = doc(db, this.USERS_COL, userId);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(userRef);
      if (!docSnap.exists()) {
        throw new Error(`User ${userId} not found.`);
      }

      const userData = docSnap.data() as User;
      const targetTenantId = userData.defaultTenantId || 'ALL';
      this.validateTenantIsolation(tenantId, targetTenantId);

      const existingAssignments = userData.roleAssignments || [];
      // Idempotency check: avoid duplicate role assignments
      const isAlreadyAssigned = existingAssignments.some(
        ra => ra.roleCode === roleCode && ra.tenantId === tenantId
      );

      if (isAlreadyAssigned) {
        return; // Idempotent success
      }

      const newAssignment = {
        id: FirebaseService.generateId('ras'),
        userId,
        roleId,
        roleCode,
        roleName: roleCode.replace(/_/g, ' '),
        tenantId,
        scopes,
        assignedAt: new Date().toISOString(),
        assignedBy: actor.name
      };

      transaction.update(userRef, {
        roleAssignments: [...existingAssignments, newAssignment],
        updatedAt: new Date().toISOString()
      });
    });

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      userEmail: actor.email,
      actorName: actor.name,
      action: 'ROLE_ASSIGNED',
      resource: 'role',
      resourceId: roleId,
      notes: `Assigned role ${roleCode} to user ${userId}. Reason: ${reason}`
    });
  }

  static async revokeRole(
    tenantId: string,
    userId: string,
    assignmentId: string,
    reason: string,
    actor: { id: string; email: string; name: string }
  ): Promise<void> {
    this.checkSelfEscalation(actor.id, userId);

    const userRef = doc(db, this.USERS_COL, userId);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(userRef);
      if (!docSnap.exists()) {
        throw new Error(`User ${userId} not found.`);
      }

      const userData = docSnap.data() as User;
      const targetTenantId = userData.defaultTenantId || 'ALL';
      this.validateTenantIsolation(tenantId, targetTenantId);

      const existingAssignments = userData.roleAssignments || [];
      const assignmentToRevoke = existingAssignments.find(ra => ra.id === assignmentId);
      if (!assignmentToRevoke) {
        return; // Already revoked, idempotent success
      }

      // Check final administrator protection
      if (userData.isPlatformSuperAdmin && assignmentToRevoke.roleCode === 'super_admin') {
        const usersRef = collection(db, this.USERS_COL);
        const q = query(usersRef, where('isPlatformSuperAdmin', '==', true));
        const allSuperSnap = await getDocs(q);
        const activeSupers = allSuperSnap.docs.filter(d => {
          const u = d.data();
          return u.id !== userId && u.status === 'active';
        });

        if (activeSupers.length === 0) {
          throw new Error('Access Denied: Cannot remove super_admin role from the last active Platform Administrator.');
        }
      }

      const updatedAssignments = existingAssignments.filter(ra => ra.id !== assignmentId);
      transaction.update(userRef, {
        roleAssignments: updatedAssignments,
        updatedAt: new Date().toISOString()
      });
    });

    await AuditService.log({
      tenantId,
      actorId: actor.id,
      userEmail: actor.email,
      actorName: actor.name,
      action: 'ROLE_REVOKED',
      resource: 'role',
      resourceId: assignmentId,
      notes: `Revoked role assignment. Reason: ${reason}`
    });
  }

  // ==========================================
  // MODULE ASSIGNMENT ENGINE
  // ==========================================

  static async assignModuleToTenant(
    tenantId: string,
    moduleId: string,
    assignedBy: string,
    reason: string,
    effectiveUntil?: string
  ): Promise<void> {
    const id = FirebaseService.generateId('mod_asg');
    const assignmentRef = doc(db, this.MODULE_ASSIGN_COL, id);

    const newAssignment: ModuleAssignment = {
      id,
      tenantId,
      moduleId,
      assignedTo: tenantId,
      assignedBy,
      status: 'ACTIVE',
      effectiveFrom: new Date().toISOString(),
      effectiveUntil,
      reason,
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: assignedBy,
      updatedAt: new Date().toISOString(),
      updatedBy: assignedBy
    };

    // Use transaction to ensure unique module constraint per tenant
    await runTransaction(db, async (transaction) => {
      const q = query(
        collection(db, this.MODULE_ASSIGN_COL),
        where('tenantId', '==', tenantId),
        where('moduleId', '==', moduleId),
        where('status', '==', 'ACTIVE')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return; // Idempotent duplicate check
      }

      transaction.set(assignmentRef, newAssignment);
    });

    await AuditService.log({
      tenantId,
      actorId: assignedBy,
      action: 'MODULE_ASSIGNED',
      resource: 'module' as any,
      resourceId: moduleId,
      notes: `Assigned module ${moduleId} to tenant ${tenantId}. Reason: ${reason}`
    });
  }

  static async revokeModuleFromTenant(
    tenantId: string,
    assignmentId: string,
    revokedBy: string,
    reason: string
  ): Promise<void> {
    const assignmentRef = doc(db, this.MODULE_ASSIGN_COL, assignmentId);

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(assignmentRef);
      if (!docSnap.exists()) {
        return; // Idempotent check
      }

      const data = docSnap.data() as ModuleAssignment;
      this.validateTenantIsolation(tenantId, data.tenantId);

      transaction.update(assignmentRef, {
        status: 'EXPIRED',
        updatedAt: new Date().toISOString(),
        updatedBy: revokedBy
      });
    });

    await AuditService.log({
      tenantId,
      actorId: revokedBy,
      action: 'MODULE_UNASSIGNED',
      resource: 'module' as any,
      resourceId: assignmentId,
      notes: `Revoked module assignment. Reason: ${reason}`
    });
  }

  // ==========================================
  // CAMPUS ASSIGNMENT
  // ==========================================

  static async assignUserCampus(
    tenantId: string,
    userId: string,
    campusId: string,
    assignedBy: string
  ): Promise<void> {
    const id = FirebaseService.generateId('cmp_asg');
    const assignmentRef = doc(db, 'user_campus_assignments', id);

    const newAssignment: UserCampusAssignment = {
      id,
      tenantId,
      userId,
      campusId,
      assignedBy,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: assignedBy,
      updatedAt: new Date().toISOString(),
      updatedBy: assignedBy
    };

    await runTransaction(db, async (transaction) => {
      const q = query(
        collection(db, 'user_campus_assignments'),
        where('userId', '==', userId),
        where('campusId', '==', campusId),
        where('status', '==', 'ACTIVE')
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return; // Idempotence
      }

      transaction.set(assignmentRef, newAssignment);
    });

    await AuditService.log({
      tenantId,
      actorId: assignedBy,
      action: 'CAMPUS_ASSIGNED',
      resource: 'campus' as any,
      resourceId: campusId,
      notes: `Assigned campus ${campusId} to user ${userId}`
    });
  }

  static async removeUserCampus(
    tenantId: string,
    assignmentId: string,
    removedBy: string
  ): Promise<void> {
    const assignmentRef = doc(db, 'user_campus_assignments', assignmentId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(assignmentRef);
      if (!snap.exists()) return;

      const data = snap.data() as UserCampusAssignment;
      this.validateTenantIsolation(tenantId, data.tenantId);

      transaction.update(assignmentRef, {
        status: 'INACTIVE',
        updatedAt: new Date().toISOString(),
        updatedBy: removedBy
      });
    });

    await AuditService.log({
      tenantId,
      actorId: removedBy,
      action: 'CAMPUS_UNASSIGNED',
      resource: 'campus' as any,
      resourceId: assignmentId,
      notes: `Revoked campus assignment.`
    });
  }

  // ==========================================
  // TEMPORARY ACCESS GRANTS
  // ==========================================

  static async createTemporaryAccessGrant(
    tenantId: string,
    grant: Omit<TemporaryAccessGrant, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'status'>,
    creatorId: string
  ): Promise<void> {
    this.checkSelfEscalation(creatorId, grant.userId);

    const id = FirebaseService.generateId('tmp_grt');
    const grantRef = doc(db, this.TEMP_GRANT_COL, id);

    const newGrant: TemporaryAccessGrant = {
      ...grant,
      id,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorId
    };

    await setDoc(grantRef, newGrant);

    await AuditService.log({
      tenantId,
      actorId: creatorId,
      action: 'TEMP_ACCESS_GRANTED',
      resource: 'security' as any,
      resourceId: id,
      notes: `Granted temporary access until ${grant.effectiveUntil}. Reason: ${grant.reason}`
    });
  }

  static async revokeTemporaryAccessGrant(
    tenantId: string,
    grantId: string,
    revokedBy: string
  ): Promise<void> {
    const grantRef = doc(db, this.TEMP_GRANT_COL, grantId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(grantRef);
      if (!snap.exists()) return;

      const data = snap.data() as TemporaryAccessGrant;
      this.validateTenantIsolation(tenantId, data.tenantId);

      transaction.update(grantRef, {
        status: 'REVOKED',
        updatedAt: new Date().toISOString(),
        updatedBy: revokedBy
      });
    });

    await AuditService.log({
      tenantId,
      actorId: revokedBy,
      action: 'TEMP_ACCESS_REVOKED',
      resource: 'security' as any,
      resourceId: grantId,
      notes: 'Revoked temporary access grant.'
    });
  }

  // ==========================================
  // DELEGATED ADMINISTRATION
  // ==========================================

  static async createDelegatedAdministration(
    tenantId: string,
    grant: Omit<DelegatedAdministrationGrant, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'status'>,
    creatorId: string
  ): Promise<void> {
    this.checkSelfEscalation(creatorId, grant.delegateeUserId);

    const id = FirebaseService.generateId('del_grt');
    const grantRef = doc(db, this.DELEGATE_COL, id);

    const newGrant: DelegatedAdministrationGrant = {
      ...grant,
      id,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorId
    };

    await setDoc(grantRef, newGrant);

    await AuditService.log({
      tenantId,
      actorId: creatorId,
      action: 'DELEGATED_ACCESS_GRANTED',
      resource: 'security' as any,
      resourceId: id,
      notes: `Delegated administration authority to ${grant.delegateeUserId}`
    });
  }

  static async revokeDelegatedAdministration(
    tenantId: string,
    grantId: string,
    revokedBy: string
  ): Promise<void> {
    const grantRef = doc(db, this.DELEGATE_COL, grantId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(grantRef);
      if (!snap.exists()) return;

      const data = snap.data() as DelegatedAdministrationGrant;
      this.validateTenantIsolation(tenantId, data.tenantId);

      transaction.update(grantRef, {
        status: 'REVOKED',
        updatedAt: new Date().toISOString(),
        updatedBy: revokedBy
      });
    });

    await AuditService.log({
      tenantId,
      actorId: revokedBy,
      action: 'DELEGATED_ACCESS_REVOKED',
      resource: 'security' as any,
      resourceId: grantId,
      notes: 'Revoked delegated administration grant.'
    });
  }

  // ==========================================
  // ACCESS REVIEW / CERTIFICATION PROCESS
  // ==========================================

  static async createAccessReview(
    tenantId: string,
    title: string,
    targetType: AccessReview['targetType'],
    creatorId: string
  ): Promise<string> {
    const reviewId = FirebaseService.generateId('rev');
    const reviewRef = doc(db, this.ACCESS_REVIEW_COL, reviewId);

    // Fetch candidate users to review
    const usersRef = collection(db, this.USERS_COL);
    const snap = await getDocs(usersRef);
    const candidateUsers = snap.docs.filter(d => {
      const u = d.data();
      return tenantId === 'ALL' || u.defaultTenantId === tenantId;
    });

    const newReview: AccessReview = {
      id: reviewId,
      tenantId,
      title,
      initiatedBy: creatorId,
      status: 'IN_PROGRESS',
      targetType,
      totalItems: candidateUsers.length,
      reviewedItems: 0,
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorId
    };

    await setDoc(reviewRef, newReview);

    // Generate matching review items
    for (const uDoc of candidateUsers) {
      const u = uDoc.data() as User;
      const itemId = FirebaseService.generateId('rvi');
      const itemRef = doc(db, this.ACCESS_REVIEW_ITEM_COL, itemId);

      const reviewItem: AccessReviewItem = {
        id: itemId,
        reviewId,
        tenantId,
        subjectId: u.id,
        subjectName: u.displayName,
        resourceDetails: `Review permissions & active status for user ${u.email}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        createdBy: creatorId,
        updatedAt: new Date().toISOString(),
        updatedBy: creatorId
      };

      await setDoc(itemRef, reviewItem);
    }

    await AuditService.log({
      tenantId,
      actorId: creatorId,
      action: 'ACCESS_REVIEW_CREATED',
      resource: 'security' as any,
      resourceId: reviewId,
      notes: `Initiated access governance review campaign: ${title}`
    });

    return reviewId;
  }

  static async reviewAccessItem(
    tenantId: string,
    itemId: string,
    decision: 'APPROVE' | 'REVOKE',
    reason: string,
    reviewerId: string
  ): Promise<void> {
    const itemRef = doc(db, this.ACCESS_REVIEW_ITEM_COL, itemId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(itemRef);
      if (!snap.exists()) return;

      const item = snap.data() as AccessReviewItem;
      this.validateTenantIsolation(tenantId, item.tenantId);

      transaction.update(itemRef, {
        decision,
        reason,
        status: 'DONE',
        reviewedBy: reviewerId,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: reviewerId
      });

      // Increment progress on parent AccessReview
      const reviewRef = doc(db, this.ACCESS_REVIEW_COL, item.reviewId);
      const parentSnap = await transaction.get(reviewRef);
      if (parentSnap.exists()) {
        const parent = parentSnap.data() as AccessReview;
        const nextReviewed = Math.min(parent.reviewedItems + 1, parent.totalItems);
        transaction.update(reviewRef, {
          reviewedItems: nextReviewed,
          status: nextReviewed === parent.totalItems ? 'COMPLETED' : 'IN_PROGRESS',
          completedAt: nextReviewed === parent.totalItems ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        });
      }
    });
  }

  // ==========================================
  // REAL-TIME SESSION MONITORING
  // ==========================================

  static async revokeSecuritySession(
    tenantId: string,
    sessionId: string,
    revokedBy: string
  ): Promise<void> {
    const sessionRef = doc(db, this.SESSION_COL, sessionId);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(sessionRef);
      if (!snap.exists()) return;

      const session = snap.data() as SecuritySession;
      this.validateTenantIsolation(tenantId, session.tenantId);

      transaction.update(sessionRef, {
        status: 'REVOKED',
        logoutTimestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: revokedBy
      });
    });

    await AuditService.log({
      tenantId,
      actorId: revokedBy,
      action: 'SECURITY_SESSION_REVOKED',
      resource: 'security' as any,
      resourceId: sessionId,
      notes: 'Administrative revocation of active authentication session'
    });
  }

  // ==========================================
  // GOVERNANCE ANALYTICS PROJECTION
  // ==========================================

  static async getAccessGovernanceAnalytics(tenantId: string): Promise<AccessGovernanceAnalyticsCache> {
    // Strictly read actual collections
    const usersSnap = await getDocs(collection(db, this.USERS_COL));
    const modulesSnap = await getDocs(collection(db, this.MODULE_ASSIGN_COL));
    const tempSnap = await getDocs(collection(db, this.TEMP_GRANT_COL));
    const reviewsSnap = await getDocs(collection(db, this.ACCESS_REVIEW_COL));
    const auditsSnap = await getDocs(collection(db, 'audit_logs'));

    const filteredUsers = usersSnap.docs
      .map(d => d.data() as User)
      .filter(u => tenantId === 'ALL' || u.defaultTenantId === tenantId);

    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
    const suspendedUsers = filteredUsers.filter(u => u.status === 'suspended').length;

    const usersByRole: Record<string, number> = {};
    const usersByCampus: Record<string, number> = {};

    filteredUsers.forEach(u => {
      (u.roleAssignments || []).forEach(ra => {
        usersByRole[ra.roleCode] = (usersByRole[ra.roleCode] || 0) + 1;
      });
      // campuses
      if (u.metadata?.campusId) {
        usersByCampus[u.metadata.campusId] = (usersByCampus[u.metadata.campusId] || 0) + 1;
      }
    });

    const activeTempGrants = tempSnap.docs
      .map(d => d.data() as TemporaryAccessGrant)
      .filter(g => (tenantId === 'ALL' || g.tenantId === tenantId) && g.status === 'ACTIVE');

    const pendingReviews = reviewsSnap.docs
      .map(d => d.data() as AccessReview)
      .filter(r => (tenantId === 'ALL' || r.tenantId === tenantId) && r.status === 'IN_PROGRESS');

    const filteredAudits = auditsSnap.docs
      .map(d => d.data())
      .filter(a => tenantId === 'ALL' || a.tenantId === tenantId);

    const escalations = filteredAudits.filter(a => a.action === 'PRIVILEGE_ESCALATION_BLOCKED').length;

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      usersByRole,
      usersByCampus,
      moduleAssignmentCounts: {},
      privilegedUsersCount: filteredUsers.filter(u => u.isPlatformSuperAdmin).length,
      activeTemporaryGrantsCount: activeTempGrants.length,
      expiringGrantsCount: activeTempGrants.filter(g => new Date(g.effectiveUntil).getTime() < Date.now() + 86400000).length,
      pendingAccessReviewsCount: pendingReviews.length,
      securityEventsCount: filteredAudits.length,
      blockedEscalationsCount: escalations
    };
  }
}
