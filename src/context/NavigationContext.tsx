import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DynamicNavigationNode, NavigationItemDefinition, NavigationSearchResult } from '../types';
import { NavigationService } from '../services/navigationService';
import { useAuth } from './AuthContext';
import { useTenant } from './TenantContext';

interface NavigationContextType {
  navigationTree: DynamicNavigationNode[];
  rawRegistry: NavigationItemDefinition[];
  pinnedItems: NavigationItemDefinition[];
  recentItems: NavigationItemDefinition[];
  isCollapsed: boolean;
  searchQuery: string;
  searchResults: NavigationSearchResult[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (q: string) => void;
  toggleSidebarCollapse: () => void;
  togglePinItem: (itemId: string) => void;
  canAccessRoute: (route: string) => { allowed: boolean; reason?: string; requiredModule?: string; requiredPermission?: string };
  registerPluginModule: (moduleId: string, items: NavigationItemDefinition[]) => void;
  unregisterPluginModule: (moduleId: string) => void;
  refreshNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode; currentTab: string; onSelectTab: (tab: string) => void }> = ({
  children,
  currentTab,
  onSelectTab
}) => {
  const { currentUser, effectiveRoleAssignments, userPermissions } = useAuth();
  const { currentTenant } = useTenant();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('edutech_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const enabledModules = useMemo(() => {
    return currentTenant?.enabledModules || ['core'];
  }, [currentTenant?.enabledModules]);

  // Generate dynamic effective navigation tree
  const navigationTree = useMemo(() => {
    return NavigationService.getEffectiveNavigationTree(
      currentUser,
      effectiveRoleAssignments,
      enabledModules,
      currentTab
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, effectiveRoleAssignments, enabledModules, currentTab, refreshTrigger, userPermissions]);

  const rawRegistry = useMemo(() => {
    return NavigationService.getRawRegistry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Pinned favorites
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  useEffect(() => {
    if (currentUser) {
      setPinnedIds(NavigationService.getPinnedItemIds(currentUser.id));
    }
  }, [currentUser]);

  const pinnedItems = useMemo(() => {
    if (!currentUser) return [];
    const effectivePerms = NavigationService.getEffectivePermissions(currentUser, effectiveRoleAssignments);
    return rawRegistry.filter(item => 
      pinnedIds.includes(item.id) &&
      NavigationService.isItemAuthorized(item, currentUser, effectivePerms, enabledModules)
    );
  }, [currentUser, pinnedIds, rawRegistry, effectiveRoleAssignments, enabledModules]);

  // Recent items
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);
  useEffect(() => {
    if (currentUser) {
      setRecentRoutes(NavigationService.getRecentRoutes(currentUser.id));
    }
  }, [currentUser]);

  // Record visit whenever currentTab changes
  useEffect(() => {
    if (currentUser && currentTab) {
      const updated = NavigationService.recordRouteVisit(currentUser.id, currentTab);
      setRecentRoutes(updated);
    }
  }, [currentUser, currentTab]);

  const recentItems = useMemo(() => {
    if (!currentUser) return [];
    const effectivePerms = NavigationService.getEffectivePermissions(currentUser, effectiveRoleAssignments);
    return recentRoutes
      .map(route => rawRegistry.find(item => item.route === route))
      .filter((item): item is NavigationItemDefinition => 
        Boolean(item) && NavigationService.isItemAuthorized(item!, currentUser, effectivePerms, enabledModules)
      );
  }, [currentUser, recentRoutes, rawRegistry, effectiveRoleAssignments, enabledModules]);

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return NavigationService.searchAccessibleNavigation(
      searchQuery,
      currentUser,
      effectiveRoleAssignments,
      enabledModules
    );
  }, [searchQuery, currentUser, effectiveRoleAssignments, enabledModules]);

  const toggleSidebarCollapse = useCallback(() => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('edutech_sidebar_collapsed', String(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const togglePinItem = useCallback((itemId: string) => {
    if (!currentUser) return;
    const updated = NavigationService.togglePinnedItem(currentUser.id, itemId);
    setPinnedIds(updated);
  }, [currentUser]);

  const canAccessRoute = useCallback((route: string) => {
    return NavigationService.canAccessRoute(
      route,
      currentUser,
      effectiveRoleAssignments,
      enabledModules
    );
  }, [currentUser, effectiveRoleAssignments, enabledModules]);

  const registerPluginModule = useCallback((moduleId: string, items: NavigationItemDefinition[]) => {
    NavigationService.registerModuleNavigation(moduleId, items);
    setRefreshTrigger(p => p + 1);
  }, []);

  const unregisterPluginModule = useCallback((moduleId: string) => {
    NavigationService.unregisterModuleNavigation(moduleId);
    setRefreshTrigger(p => p + 1);
  }, []);

  const refreshNavigation = useCallback(() => {
    setRefreshTrigger(p => p + 1);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        navigationTree,
        rawRegistry,
        pinnedItems,
        recentItems,
        isCollapsed,
        searchQuery,
        searchResults,
        activeTab: currentTab,
        setActiveTab: onSelectTab,
        setSearchQuery,
        toggleSidebarCollapse,
        togglePinItem,
        canAccessRoute,
        registerPluginModule,
        unregisterPluginModule,
        refreshNavigation
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
