import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, RoleAssignment, ScopeConstraint } from '../types';
import { UserService } from '../services/userService';
import { SYSTEM_ROLES, ALL_PERMISSIONS, ROLE_ALIASES } from '../config/permissions';
import { useTenant } from './TenantContext';

interface AuthContextType {
  currentUser: User | null;
  activeRoleAssignment: RoleAssignment | null;
  effectiveRoleAssignments: RoleAssignment[];
  userPermissions: string[];
  allUsers: User[];
  isLoadingAuth: boolean;
  hasPermission: (permissionCode: string) => boolean;
  hasAnyPermission: (permissionCodes: string[]) => boolean;
  setActiveRole: (roleAssignmentId: string) => void;
  switchPersona: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
  assignUserRole: (userId: string, roleCode: string, scopes: ScopeConstraint[]) => Promise<void>;
  removeUserRole: (userId: string, roleAssignmentId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant, switchTenant } = useTenant();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRoleAssignment, setActiveRoleAssignment] = useState<RoleAssignment | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const users = await UserService.getUsers('ALL');
      setAllUsers(users);

      // Restore active persona or set default Super Admin / Principal
      const savedUserId = localStorage.getItem('edutech_active_user_id');
      const user = users.find(u => u.id === savedUserId) || users[0] || null;
      setCurrentUser(user);

      if (user && (user.roleAssignments || []).length > 0) {
        // Pick role matching current tenant or first available
        const matchingRole = (user.roleAssignments || []).find(
          ra => ra.tenantId === currentTenant?.id || ra.tenantId === 'ALL'
        ) || (user.roleAssignments || [])[0];
        setActiveRoleAssignment(matchingRole);
      }
    } catch (e) {
      console.error('Failed to load auth users:', e);
    } finally {
      setIsLoadingAuth(false);
    }
  }, [currentTenant?.id]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // When tenant changes, adapt role assignment if user has specific tenant role
  useEffect(() => {
    if (!currentUser || !currentTenant) return;
    const matchingRole = currentUser.roleAssignments.find(
      ra => ra.tenantId === currentTenant.id || ra.tenantId === 'ALL'
    );
    if (matchingRole) {
      setActiveRoleAssignment(matchingRole);
    }
  }, [currentTenant, currentUser]);

  // Get all relevant role assignments for the user in the current tenant or global
  const effectiveRoleAssignments = useMemo(() => {
    if (!currentUser) return [];
    if (!currentTenant) return currentUser.roleAssignments || [];

    return currentUser.roleAssignments || [].filter(
      ra => ra.tenantId === currentTenant.id || ra.tenantId === 'ALL'
    );
  }, [currentUser, currentTenant]);

  // Calculate effective permissions combining all active roles (Role Composition)
  const userPermissions = useMemo(() => {
    if (!currentUser || effectiveRoleAssignments.length === 0) return [];

    // Super Admin gets all permissions
    if (currentUser.isPlatformSuperAdmin || effectiveRoleAssignments.some(r => r.roleCode === 'super_admin' || r.roleCode === 'PLATFORM_SUPER_ADMIN')) {
      return ALL_PERMISSIONS.map(p => p.code);
    }

    const permissionSet = new Set<string>();
    for (const assignment of effectiveRoleAssignments) {
      const rawCode = assignment.roleCode || '';
      const resolvedCode = ROLE_ALIASES[rawCode] || rawCode;
      const roleDef = SYSTEM_ROLES.find(
        r => (resolvedCode && r.code === resolvedCode) || 
             r.id === assignment.roleId || 
             (r.code && resolvedCode && r.code.toUpperCase() === resolvedCode.toUpperCase())
      );
      if (roleDef) {
        roleDef.permissions.forEach(p => permissionSet.add(p));
      }
    }

    return Array.from(permissionSet);
  }, [currentUser, effectiveRoleAssignments]);

  const hasPermission = useCallback(
    (permissionCode: string): boolean => {
      if (!currentUser || effectiveRoleAssignments.length === 0) return false;
      if (userPermissions.includes('platform.admin')) return true;
      return userPermissions.includes(permissionCode);
    },
    [currentUser, effectiveRoleAssignments.length, userPermissions]
  );

  const hasAnyPermission = useCallback(
    (permissionCodes: string[]): boolean => {
      if (!currentUser || effectiveRoleAssignments.length === 0) return false;
      if (userPermissions.includes('platform.admin')) return true;
      return permissionCodes.some(code => userPermissions.includes(code));
    },
    [currentUser, effectiveRoleAssignments.length, userPermissions]
  );

  const setActiveRole = (roleAssignmentId: string) => {
    if (!currentUser) return;
    const role = currentUser.roleAssignments.find(r => r.id === roleAssignmentId);
    if (role) {
      setActiveRoleAssignment(role);
    }
  };

  const switchPersona = async (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    let targetTenantId = currentTenant?.id;
    const hasRoleInCurrentTenant = user.roleAssignments.some(ra => ra.tenantId === targetTenantId || ra.tenantId === 'ALL');
    
    if (!hasRoleInCurrentTenant && (user.roleAssignments || []).length > 0) {
      const specificRole = (user.roleAssignments || []).find(ra => ra.tenantId !== 'ALL');
      if (specificRole) {
        targetTenantId = specificRole.tenantId;
        await switchTenant(specificRole.tenantId);
      } else if (user.defaultTenantId) {
        targetTenantId = user.defaultTenantId;
        await switchTenant(user.defaultTenantId);
      }
    } else if (user.defaultTenantId && (user.roleAssignments || []).length === 0) {
      targetTenantId = user.defaultTenantId;
      await switchTenant(user.defaultTenantId);
    }

    setCurrentUser(user);
    localStorage.setItem('edutech_active_user_id', userId);

    const matchingRole = (user.roleAssignments || []).find(
      ra => ra.tenantId === targetTenantId || ra.tenantId === 'ALL'
    ) || (user.roleAssignments || [])[0] || null;

    setActiveRoleAssignment(matchingRole);
  };

  const refreshUsers = async () => {
    const users = await UserService.getUsers('ALL');
    setAllUsers(users);
    if (currentUser) {
      const refreshed = users.find(u => u.id === currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
  };

  const assignUserRole = async (userId: string, roleCode: string, scopes: ScopeConstraint[]) => {
    if (!currentTenant || !currentUser) return;
    await UserService.assignRole(
      userId,
      currentTenant.id,
      roleCode,
      scopes,
      {
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.displayName
      }
    );
    await refreshUsers();
  };

  const removeUserRole = async (userId: string, roleAssignmentId: string) => {
    if (!currentUser) return;
    await UserService.removeRoleAssignment(
      userId,
      roleAssignmentId,
      {
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.displayName
      }
    );
    await refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRoleAssignment,
        effectiveRoleAssignments,
        userPermissions,
        allUsers,
        isLoadingAuth,
        hasPermission,
        hasAnyPermission,
        setActiveRole,
        switchPersona,
        refreshUsers,
        assignUserRole,
        removeUserRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
