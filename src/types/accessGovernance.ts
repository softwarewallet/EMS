// EMS Access Governance Domain Types
// Authoritative Types for Security, Identity, & Permission Verification

import { RoleAssignment, ScopeConstraint } from './index';

export type UserGovernanceStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';

export interface PlatformUserProfile {
  id: string;
  tenantId: string;
  email: string;
  displayName: string;
  status: UserGovernanceStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

export interface RoleDefinition {
  id: string;
  tenantId: string; // Isolated to tenant (or 'ALL' for platform)
  code: string;
  name: string;
  description: string;
  permissions: string[]; // List of permission codes
  isSystemRole: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

export interface PermissionDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  applicableScopes: string[];
}

export interface ModuleAssignment {
  id: string;
  tenantId: string;
  campusId?: string; // Opt campus-specific module restriction
  moduleId: string;
  assignedTo: string; // Tenant administrator/coordinator
  assignedBy: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  effectiveFrom: string;
  effectiveUntil?: string;
  reason: string;
  version: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UserRoleAssignment {
  id: string;
  tenantId: string;
  userId: string;
  roleCode: string;
  roleId: string;
  scopes: ScopeConstraint[];
  assignedBy: string;
  reason?: string;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UserModuleAssignment {
  id: string;
  tenantId: string;
  userId: string;
  moduleId: string;
  assignedBy: string;
  reason?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  effectiveFrom: string;
  effectiveUntil?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UserCampusAssignment {
  id: string;
  tenantId: string;
  userId: string;
  campusId: string;
  assignedBy: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccessPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  rules: {
    effect: 'ALLOW' | 'DENY';
    actions: string[];
    resources: string[];
    conditions?: string;
  }[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface TemporaryAccessGrant {
  id: string;
  tenantId: string;
  userId: string;
  roleCode?: string;
  permissions?: string[];
  scope: ScopeConstraint[];
  effectiveFrom: string;
  effectiveUntil: string;
  reason: string;
  approvedBy: string;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DelegatedAdministrationGrant {
  id: string;
  tenantId: string;
  delegatorUserId: string;
  delegateeUserId: string;
  permissions: string[]; // Sub-permissions to delegate
  scope: ScopeConstraint[];
  effectiveFrom: string;
  effectiveUntil: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccessReview {
  id: string;
  tenantId: string;
  title: string;
  initiatedBy: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  targetType: 'USERS' | 'ROLES' | 'MODULES' | 'CAMPUSES' | 'GRANTS';
  totalItems: number;
  reviewedItems: number;
  completedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccessReviewItem {
  id: string;
  reviewId: string;
  tenantId: string;
  subjectId: string; // User or assignment ID
  subjectName: string;
  resourceDetails: string; // e.g. "Module: Finance Manager"
  reviewedBy?: string;
  decision?: 'APPROVE' | 'REVOKE';
  reason?: string;
  status: 'PENDING' | 'DONE';
  reviewedAt?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UserStatusChange {
  id: string;
  tenantId: string;
  userId: string;
  previousStatus: UserGovernanceStatus;
  newStatus: UserGovernanceStatus;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export interface SecuritySession {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  sessionId: string;
  loginTimestamp: string;
  lastActivity: string;
  ipAddress?: string;
  deviceMetadata?: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'LOGGED_OUT';
  logoutTimestamp?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SecurityAccessEvent {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILURE' | 'BLOCKED';
  ipAddress?: string;
  timestamp: string;
}

export interface AccessGovernanceAnalyticsCache {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  usersByRole: Record<string, number>;
  usersByCampus: Record<string, number>;
  moduleAssignmentCounts: Record<string, number>;
  privilegedUsersCount: number;
  activeTemporaryGrantsCount: number;
  expiringGrantsCount: number;
  pendingAccessReviewsCount: number;
  securityEventsCount: number;
  blockedEscalationsCount: number;
}
