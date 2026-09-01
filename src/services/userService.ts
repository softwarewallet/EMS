import { User, RoleAssignment, ScopeConstraint } from '../types';
import { FirebaseService } from './firebaseService';
import { AuditService } from './auditService';
import { SYSTEM_ROLES } from '../config/permissions';

const USERS_COL = 'users';

export class UserService {
  /**
   * Get all users for a given tenant or platform-wide
   */
  static async getUsers(tenantId: string): Promise<User[]> {
    if (tenantId === 'ALL') {
      return FirebaseService.getTenantCollection<User>(USERS_COL, 'ALL');
    }
    const allUsers = await FirebaseService.getTenantCollection<User>(USERS_COL, 'ALL');
    // Filter users who have at least one role assignment in this tenant or defaultTenantId
    return allUsers.filter(u => 
      u.defaultTenantId === tenantId || 
      (u.roleAssignments || []).some(ra => ra.tenantId === tenantId || ra.tenantId === 'ALL')
    );
  }

  static async getUserById(userId: string): Promise<User | null> {
    return FirebaseService.getDocument<User>(USERS_COL, userId);
  }

  /**
   * Upsert user profile
   */
  static async upsertUser(user: User): Promise<void> {
    await FirebaseService.setDocument(USERS_COL, user.id, user);
  }

  /**
   * Assign a role with scope to a user
   */
  static async assignRole(
    userId: string,
    tenantId: string,
    roleCode: string,
    scopes: ScopeConstraint[],
    performedBy: { userId: string; email: string; name: string }
  ): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    const roleDef = SYSTEM_ROLES.find(r => r.code === roleCode);
    const roleName = roleDef ? roleDef.name : roleCode;

    const newAssignment: RoleAssignment = {
      id: FirebaseService.generateId('ra'),
      userId,
      roleId: roleDef?.id || roleCode,
      roleCode,
      roleName,
      tenantId,
      scopes,
      assignedAt: new Date().toISOString(),
      assignedBy: performedBy.userId
    };

    // Filter out duplicate role for same tenant if exists, then add
    const updatedAssignments = [
      ...(user.roleAssignments || []).filter(ra => !(ra.roleCode === roleCode && ra.tenantId === tenantId)),
      newAssignment
    ];

    const updatedUser: User = {
      ...user,
      roleAssignments: updatedAssignments,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(USERS_COL, userId, updatedUser);

    await AuditService.log({
      tenantId,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: 'USER_ROLE_ASSIGNED',
      resource: 'role',
      resourceId: newAssignment.id,
      resourceName: `${roleName} to ${user.displayName}`,
      newValue: newAssignment,
      result: 'SUCCESS',
      notes: `Role ${roleName} assigned with scopes: ${scopes.map(s => `${s.type}:${s.value || '*'}`).join(', ')}`
    });

    return updatedUser;
  }

  /**
   * Remove a role assignment
   */
  static async removeRoleAssignment(
    userId: string,
    roleAssignmentId: string,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<User | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const removed = (user.roleAssignments || []).find(ra => ra.id === roleAssignmentId);
    const updatedAssignments = (user.roleAssignments || []).filter(ra => ra.id !== roleAssignmentId);

    const updatedUser: User = {
      ...user,
      roleAssignments: updatedAssignments,
      updatedAt: new Date().toISOString()
    };

    await FirebaseService.setDocument(USERS_COL, userId, updatedUser);

    if (removed) {
      await AuditService.log({
        tenantId: removed.tenantId,
        userId: performedBy.userId,
        userEmail: performedBy.email,
        userDisplayName: performedBy.name,
        action: 'USER_UPDATED',
        resource: 'role',
        resourceId: roleAssignmentId,
        resourceName: `Revoked ${removed.roleName}`,
        previousValue: removed,
        result: 'SUCCESS'
      });
    }

    return updatedUser;
  }
}
