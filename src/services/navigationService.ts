import { 
  NavigationItemDefinition, 
  DynamicNavigationNode, 
  User, 
  RoleAssignment, 
  Tenant, 
  NavigationSearchResult 
} from '../types';
import { BASE_NAVIGATION_ITEMS } from '../config/navigationRegistry';
import { ModuleEngine } from '../core/modules/ModuleEngine';
import { SYSTEM_ROLES, ROLE_ALIASES } from '../config/permissions';

export class NavigationService {
  private static dynamicRegistry: Map<string, NavigationItemDefinition> = new Map();
  private static initialized = false;

  private static initialize() {
    if (this.initialized) return;
    BASE_NAVIGATION_ITEMS.forEach(item => {
      this.dynamicRegistry.set(item.id, { ...item });
    });
    
    // Auto-inject Universal Module Contract navigation items
    ModuleEngine.getAllModules().forEach(module => {
      if (module.navigationItems) {
        module.navigationItems.forEach(item => {
          this.dynamicRegistry.set(item.id, { ...item, moduleId: module.moduleId.replace('mod_', '') });
        });
      }
    });
    this.initialized = true;
    
  }

  /**
   * Reset or retrieve full raw registry items
   */
  static getRawRegistry(): NavigationItemDefinition[] {
    this.initialize();
    return Array.from(this.dynamicRegistry.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * Extensible Module Registration API
   * Future modules (Smart Classroom, LMS, Finance, HR, Government, etc.) register their
   * navigation definitions dynamically without touching core sidebar code.
   */
  static registerModuleNavigation(moduleId: string, items: NavigationItemDefinition[]): void {
    this.initialize();
    items.forEach(item => {
      this.dynamicRegistry.set(item.id, {
        ...item,
        moduleId,
        status: item.status || 'active'
      });
    });
  }

  /**
   * Unregister / De-register module navigation
   */
  static unregisterModuleNavigation(moduleId: string): void {
    this.initialize();
    for (const [id, item] of this.dynamicRegistry.entries()) {
      if (item.moduleId === moduleId) {
        this.dynamicRegistry.delete(id);
      }
    }
  }

  /**
   * Calculate effective permissions for a user across all active role assignments for the tenant
   */
  static getEffectivePermissions(
    user: User | null,
    roleAssignments: RoleAssignment[]
  ): string[] {
    if (!user) return [];
    if (user.isPlatformSuperAdmin) return ['*'];

    const perms = new Set<string>();
    for (const ra of roleAssignments) {
      if (ra.roleCode === 'super_admin' || ra.roleCode === 'PLATFORM_SUPER_ADMIN') {
        return ['*'];
      }
      const rawCode = ra.roleCode || '';
      const resolvedCode = ROLE_ALIASES[rawCode] || rawCode;
      const roleDef = SYSTEM_ROLES.find(
        r => (resolvedCode && r.code === resolvedCode) || 
             r.id === ra.roleId || 
             (r.code && resolvedCode && r.code.toUpperCase() === resolvedCode.toUpperCase())
      );
      if (roleDef) {
        roleDef.permissions.forEach(p => perms.add(p));
      }
    }
    return Array.from(perms);
  }

  /**
   * Check if a single item satisfies visibility rules:
   * 1. Status is active
   * 2. Module is enabled for tenant (or is 'core')
   * 3. User holds required permission(s)
   */
  static isItemAuthorized(
    item: NavigationItemDefinition,
    user: User | null,
    effectivePermissions: string[],
    enabledModules: string[],
    roleAssignments: RoleAssignment[] = []
  ): boolean {
    if (!user) return false;
    if (item.status === 'disabled') return false;

    const isSuperAdmin = Boolean(
      user.isPlatformSuperAdmin ||
      roleAssignments.some(ra => ra.roleCode === 'super_admin' || ra.roleCode === 'PLATFORM_SUPER_ADMIN') ||
      effectivePermissions.includes('*') ||
      effectivePermissions.includes('platform.admin')
    );

    // 1. Strict Role-based Check
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      const activeRoleCodes = (roleAssignments || []).map(ra => ra.roleCode).filter(Boolean) as string[];
      const matchesRole = isSuperAdmin || item.allowedRoles.some(r => {
        if (r === 'super_admin' && isSuperAdmin) return true;
        return activeRoleCodes.some(arc => {
          if (!arc || !r) return false;
          if (arc.toLowerCase() === r.toLowerCase()) return true;
          const resolvedArc = ROLE_ALIASES[arc.toLowerCase()] || arc;
          const resolvedR = ROLE_ALIASES[r.toLowerCase()] || r;
          if (resolvedArc.toLowerCase() === resolvedR.toLowerCase()) return true;
          return false;
        });
      });

      if (!matchesRole) {
        return false;
      }
    }

    // 2. Module Availability & Assignment Check
    const modRequirement = item.requiredModule || (item.moduleId !== 'core' ? item.moduleId : undefined);
    if (modRequirement && modRequirement !== 'core') {
      const bareMod = modRequirement.replace('mod_', '');
      const prefixedMod = modRequirement.startsWith('mod_') ? modRequirement : `mod_${modRequirement}`;
      if (!enabledModules.includes(modRequirement) && !enabledModules.includes(bareMod) && !enabledModules.includes(prefixedMod)) {
        return false;
      }
    }

    // 3. Permission Requirement Check
    if (item.requiredPermission) {
      if (!isSuperAdmin) {
        const required = Array.isArray(item.requiredPermission)
          ? item.requiredPermission
          : [item.requiredPermission];

        const hasReq = required.some(p => effectivePermissions.includes(p));
        if (!hasReq) return false;
      }
    }

    return true;
  }

  /**
   * Build the full dynamic hierarchical navigation tree tailored for current user,
   * roles, permissions, tenant, and enabled modules.
   * Empty parents whose children are all unauthorized are recursively eliminated.
   */
  static getEffectiveNavigationTree(
    user: User | null,
    roleAssignments: RoleAssignment[],
    enabledModules: string[],
    activeTab?: string
  ): DynamicNavigationNode[] {
    this.initialize();
    const effectivePermissions = this.getEffectivePermissions(user, roleAssignments);
    const allItems = this.getRawRegistry();

    // Map of id -> node
    const nodeMap = new Map<string, DynamicNavigationNode>();
    allItems.forEach(item => {
      nodeMap.set(item.id, {
        ...item,
        children: [],
        isActive: item.route === activeTab,
        isExpanded: false
      });
    });

    // Construct raw tree
    const rootNodes: DynamicNavigationNode[] = [];
    allItems.forEach(item => {
      const node = nodeMap.get(item.id)!;
      if (item.parentId && nodeMap.has(item.parentId)) {
        const parent = nodeMap.get(item.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Recursive filter: returns true if node itself is authorized and (if parent) has at least 1 authorized child
    const filterNode = (node: DynamicNavigationNode): boolean => {
      // If Section Header: visible only if following section has items
      if (node.isSectionHeader) return true;

      // Filter children first
      if (node.children && node.children.length > 0) {
        node.children = node.children.filter(filterNode);
      }

      // Check authorization of this item
      const isAuth = this.isItemAuthorized(node, user, effectivePermissions, enabledModules, roleAssignments);

      // Rule #6: If parent container with children, but 0 children survived and node has no standalone route, hide parent
      if (node.children && node.children.length === 0 && !node.route && itemHasChildrenInRegistry(node.id)) {
        return false;
      }

      // If node is not authorized, hide it
      if (!isAuth) return false;

      // Mark expansion if active child
      if (node.children && node.children.some(c => c.isActive || c.isExpanded)) {
        node.isExpanded = true;
      }

      return true;
    };

    const itemHasChildrenInRegistry = (parentId: string) => {
      return allItems.some(i => i.parentId === parentId);
    };

    // Filter roots
    let filteredRoots = rootNodes.filter(filterNode);

    // Clean up empty section headers (e.g. '-- Academic Modules' if no academic items below it)
    const cleanedRoots: DynamicNavigationNode[] = [];
    for (let i = 0; i < filteredRoots.length; i++) {
      const current = filteredRoots[i];
      if (current.isSectionHeader) {
        // Look ahead: does next non-section item exist before next section?
        let hasContentBelow = false;
        for (let j = i + 1; j < filteredRoots.length; j++) {
          if (filteredRoots[j].isSectionHeader) break;
          hasContentBelow = true;
          break;
        }
        if (hasContentBelow) {
          cleanedRoots.push(current);
        }
      } else {
        cleanedRoots.push(current);
      }
    }

    return cleanedRoots;
  }

  /**
   * Resolve effective workspace route from a tab key (node id or route string)
   */
  static getRouteForTab(tab: string): string {
    this.initialize();
    const allItems = this.getRawRegistry();
    const item = allItems.find(i => i.id === tab || i.route === tab);
    return item?.route || tab;
  }

  /**
   * Route Guard: Verifies if current user can access a specific route/tab
   */
  static canAccessRoute(
    routeOrId: string,
    user: User | null,
    roleAssignments: RoleAssignment[],
    enabledModules: string[]
  ): { allowed: boolean; reason?: string; requiredModule?: string; requiredPermission?: string } {
    if (!user) {
      return { allowed: false, reason: 'Authentication required. Please select a user persona to log in.' };
    }

    this.initialize();
    const allItems = this.getRawRegistry();
    const targetItem = allItems.find(i => i.id === routeOrId || i.route === routeOrId);

    // If route is not in registry (e.g. open system tab), allow basic access if user is logged in
    if (!targetItem) {
      return { allowed: true };
    }

    const effectivePermissions = this.getEffectivePermissions(user, roleAssignments);

    // 1. Check Module activation status
    const modRequirement = targetItem.requiredModule || (targetItem.moduleId !== 'core' ? targetItem.moduleId : undefined);
    if (modRequirement && modRequirement !== 'core') {
      const bareMod = modRequirement.replace('mod_', '');
      const prefixedMod = modRequirement.startsWith('mod_') ? modRequirement : `mod_${modRequirement}`;
      if (!enabledModules.includes(modRequirement) && !enabledModules.includes(bareMod) && !enabledModules.includes(prefixedMod)) {
        return {
          allowed: false,
          reason: `Module "${modRequirement}" is disabled for your institution`,
          requiredModule: modRequirement
        };
      }
    }

    // 2. Full authorization check (Role, Permission, Module, Status)
    const isAuth = this.isItemAuthorized(targetItem, user, effectivePermissions, enabledModules, roleAssignments);
    if (!isAuth) {
      const requiredPermStr = targetItem.requiredPermission
        ? (Array.isArray(targetItem.requiredPermission) ? targetItem.requiredPermission.join(' or ') : targetItem.requiredPermission)
        : undefined;

      return {
        allowed: false,
        reason: requiredPermStr
          ? `Missing required permission: ${requiredPermStr}`
          : targetItem.allowedRoles && targetItem.allowedRoles.length > 0
          ? `Your assigned role(s) [${(roleAssignments || []).map(r => r.roleName || r.roleCode).join(', ') || 'None'}] are not authorized for this workspace.`
          : 'Access restricted: You lack authorization for this workspace.',
        requiredModule: modRequirement,
        requiredPermission: Array.isArray(targetItem.requiredPermission) ? targetItem.requiredPermission[0] : targetItem.requiredPermission
      };
    }

    return { allowed: true };
  }

  /**
   * Global Navigation Search
   * Searches all accessible navigation entries for the current user and returns breadcrumb paths
   */
  static searchAccessibleNavigation(
    query: string,
    user: User | null,
    roleAssignments: RoleAssignment[],
    enabledModules: string[]
  ): NavigationSearchResult[] {
    if (!query || query.trim().length === 0) return [];
    this.initialize();

    const cleanQuery = query.trim().toLowerCase();
    const effectivePermissions = this.getEffectivePermissions(user, roleAssignments);
    const allItems = this.getRawRegistry();

    const results: NavigationSearchResult[] = [];

    // Helper to find parent trail
    const getBreadcrumbs = (item: NavigationItemDefinition): string[] => {
      const trail: string[] = [item.label];
      let curr = item;
      while (curr.parentId) {
        const parent = allItems.find(i => i.id === curr.parentId);
        if (parent) {
          trail.unshift(parent.label);
          curr = parent;
        } else {
          break;
        }
      }
      return trail;
    };

    for (const item of allItems) {
      if (item.isSectionHeader || !item.route) continue;

      // Must be authorized
      if (!this.isItemAuthorized(item, user, effectivePermissions, enabledModules)) {
        continue;
      }

      const label = item.label.toLowerCase();
      const desc = item.description?.toLowerCase() || '';

      if (label.includes(cleanQuery) || desc.includes(cleanQuery) || item.route.toLowerCase().includes(cleanQuery)) {
        const breadcrumbs = getBreadcrumbs(item);
        let score = 0;
        if (label === cleanQuery) score += 100;
        else if (label.startsWith(cleanQuery)) score += 50;
        else if (label.includes(cleanQuery)) score += 25;
        else score += 10;

        results.push({
          item,
          breadcrumbs,
          score,
          highlightMatch: item.label
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Pinned Favorites Management
   */
  static getPinnedItemIds(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`ems_pinned_${userId}`) || localStorage.getItem(`edutech_pinned_${userId}`);
      if (!raw) return ['nav_timetable', 'nav_attendance', 'nav_examinations'];
      return JSON.parse(raw);
    } catch {
      return ['nav_timetable', 'nav_attendance', 'nav_examinations'];
    }
  }

  static togglePinnedItem(userId: string, itemId: string): string[] {
    const current = this.getPinnedItemIds(userId);
    let updated: string[];
    if (current.includes(itemId)) {
      updated = current.filter(id => id !== itemId);
    } else {
      updated = [...current, itemId];
    }
    try {
      localStorage.setItem(`ems_pinned_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  }

  /**
   * Recently Visited Pages Management
   */
  static getRecentRoutes(userId: string): string[] {
    try {
      const raw = localStorage.getItem(`ems_recent_${userId}`) || localStorage.getItem(`edutech_recent_${userId}`);
      return raw ? JSON.parse(raw) : ['my_school', 'timetable', 'examinations'];
    } catch {
      return ['my_school', 'timetable', 'examinations'];
    }
  }

  static recordRouteVisit(userId: string, route: string): string[] {
    if (!route || route === 'nav_engine') return this.getRecentRoutes(userId);
    const current = this.getRecentRoutes(userId).filter(r => r !== route);
    const updated = [route, ...current].slice(0, 5); // Keep top 5
    try {
      localStorage.setItem(`ems_recent_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
  }
}
