import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tenant, Campus, ModuleRegistryItem } from '../types';
import { TenantService } from '../services/tenantService';
import { ModuleService } from '../services/moduleService';
import { SeedService } from '../services/seedService';

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant | null;
  campuses: Campus[];
  activeCampus: Campus | null;
  enabledModules: ModuleRegistryItem[];
  isLoadingTenants: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  switchCampus: (campusId: string) => void;
  refreshTenants: () => Promise<void>;
  updateCurrentTenant: (updated: Partial<Tenant>) => Promise<void>;
  toggleTenantModule: (moduleCode: string, enable: boolean, user: any) => Promise<{ success: boolean; message: string }>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [activeCampus, setActiveCampus] = useState<Campus | null>(null);
  const [enabledModules, setEnabledModules] = useState<ModuleRegistryItem[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);

  // Initialize and seed if empty
  const loadTenants = useCallback(async () => {
    try {
      setIsLoadingTenants(true);
      await SeedService.seedInitialDataIfNeeded();
      
      const list = (await TenantService.getAllTenants());
      console.log('TenantService.getAllTenants() returned:', list);
      
      if (!list) {
        console.warn('TenantService.getAllTenants() returned null/undefined, defaulting to []');
      }
      
      const tenantsList = list || [];
      setTenants(tenantsList);

      // Select previously saved tenant or default first
      const savedTenantId = localStorage.getItem('edutech_active_tenant_id');
      console.log('Saved tenant ID:', savedTenantId);
      const matched = tenantsList.find(t => t.id === savedTenantId) || tenantsList[0] || null;
      setCurrentTenant(matched);
      console.log('Matched tenant:', matched);

      if (matched) {
        // Load campuses
        console.log('Loading campuses');
        const campusList = await TenantService.getCampuses(matched.id);
        setCampuses(campusList);
        setActiveCampus(campusList.find(c => c.isMainCampus) || campusList[0] || null);

        // Load modules
        console.log('Loading modules');
        const mods = await ModuleService.getTenantModules(matched.id);
        setEnabledModules(mods);
      }
    } catch (e) {
      console.error('Failed to load tenants:', e);
    } finally {
      setIsLoadingTenants(false);
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const switchTenant = async (tenantId: string) => {
    const selected = tenants.find(t => t.id === tenantId);
    if (!selected) return;

    setCurrentTenant(selected);
    localStorage.setItem('edutech_active_tenant_id', tenantId);

    // Load tenant campuses
    const campusList = await TenantService.getCampuses(tenantId);
    setCampuses(campusList);
    setActiveCampus(campusList.find(c => c.isMainCampus) || campusList[0] || null);

    // Load tenant enabled modules
    const mods = await ModuleService.getTenantModules(tenantId);
    setEnabledModules(mods);
  };

  const switchCampus = (campusId: string) => {
    const found = campuses.find(c => c.id === campusId);
    if (found) setActiveCampus(found);
  };

  const refreshTenants = async () => {
    const list = (await TenantService.getAllTenants()) || [];
    setTenants(list);
    if (currentTenant) {
      const refreshed = list.find(t => t.id === currentTenant.id);
      if (refreshed) {
        setCurrentTenant(refreshed);
        const mods = await ModuleService.getTenantModules(refreshed.id);
        setEnabledModules(mods);
      }
    }
  };

  const updateCurrentTenant = async (updated: Partial<Tenant>) => {
    if (!currentTenant) return;
    await TenantService.updateTenant(currentTenant.id, updated, {
      userId: 'system_admin',
      email: 'admin@system.local',
      name: 'Administrator'
    });
    await refreshTenants();
  };

  const toggleTenantModule = async (moduleCode: string, enable: boolean, user: any) => {
    if (!currentTenant) return { success: false, message: 'No tenant selected' };
    const res = await ModuleService.toggleModule(
      currentTenant.id,
      moduleCode,
      enable,
      {
        userId: user?.id || 'usr_admin',
        email: user?.email || 'admin@edutech.edu',
        name: user?.displayName || 'Admin'
      }
    );

    if (res.success) {
      await refreshTenants();
    }
    return res;
  };

  return (
    <TenantContext.Provider
      value={{
        tenants,
        currentTenant,
        campuses,
        activeCampus,
        enabledModules,
        isLoadingTenants,
        switchTenant,
        switchCampus,
        refreshTenants,
        updateCurrentTenant,
        toggleTenantModule
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
