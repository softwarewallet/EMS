import { MODULE_REGISTRY as LegacyRegistry } from '../config/modules';
import { ModuleRegistryItem, Tenant } from '../types';
import { TenantService } from './tenantService';
import { AuditService } from './auditService';
import { ModuleEngine } from '../core/modules/ModuleEngine';
import { AttendanceModule } from '../modules/attendance/AttendanceModule';
import { AdmissionsModule } from '../modules/admissions/AdmissionsModule';

// Phase 4.5 Bootstrapping
// Eventually all modules in legacy config/modules.ts will be migrated to the new ModuleEngine
ModuleEngine.register(AttendanceModule);
ModuleEngine.register(AdmissionsModule);

export class ModuleService {
  /**
   * List all registered modules in EduTech-SMS catalog
   */
  static getRegistry(): ModuleRegistryItem[] {
    // Merge Legacy Registry with New UniversalModuleContract modules (temporarily bridging both)
    const newModules = ModuleEngine.getAllModules().map(m => ({
      id: m.moduleId,
      code: (m.moduleId || '').replace('mod_', ''),
      name: m.displayName,
      description: m.description,
      version: m.version,
      category: m.category.toLowerCase() as any,
      icon: 'Puzzle', // Default fallback
      route: m.navigationItems?.[0]?.route || '',
      isCore: m.moduleId === 'mod_core',
      requiredPermissions: m.permissions.map(p => p.code),
      dependencies: m.dependencies,
      tenantAvailability: { supportedTypes: ['k12_school', 'higher_education'] as any }
    }));
    
    // De-duplicate (if a module exists in both, prefer new architecture)
    const existingIds = new Set(newModules.map(m => m.id));
    const filteredLegacy = LegacyRegistry.filter(m => !existingIds.has(m.id));
    
    return [...filteredLegacy, ...newModules];
  }

  /**
   * Returns list of enabled module objects for a given tenant
   */
  static async getTenantModules(tenantId: string): Promise<ModuleRegistryItem[]> {
    const tenant = await TenantService.getTenantById(tenantId);
    const registry = this.getRegistry();
    if (!tenant) return registry.filter(m => m.isCore);
    return registry.filter(m => m.isCore || tenant.enabledModules.includes(m.code));
  }

  /**
   * Toggles module activation for a tenant, validating dependencies using ModuleEngine
   */
  static async toggleModule(
    tenantId: string,
    moduleCode: string,
    enable: boolean,
    performedBy: { userId: string; email: string; name: string }
  ): Promise<{ success: boolean; message: string; updatedModules?: string[] }> {
    const tenant = await TenantService.getTenantById(tenantId);
    if (!tenant) return { success: false, message: 'Institution tenant not found' };

    const registry = this.getRegistry();
    const moduleDef = registry.find(m => m.code === moduleCode);
    if (!moduleDef) return { success: false, message: 'Unknown module code' };

    if (moduleDef.isCore && !enable) {
      return { success: false, message: 'Core platform modules cannot be deactivated' };
    }

    let current = [...(tenant.enabledModules || [])];

    if (enable) {
      // Validate dependencies using New Engine if it's a Universal Module, or fallback to legacy logic
      const universalModule = ModuleEngine.getModule(moduleDef.id);
      if (universalModule) {
        // Universal Module Architecture dependency check
        const { allowed, reason } = ModuleEngine.canEnable(universalModule.moduleId, current, registry);
        if (!allowed) {
          return { success: false, message: reason! };
        }
      } else {
        // Legacy dependency check
        for (const dep of moduleDef.dependencies) {
          const depDef = registry.find(m => m.id === dep.moduleId);
          if (depDef && !depDef.isCore && !current.includes(depDef.code)) {
            return {
              success: false,
              message: `Cannot enable "${moduleDef.name}". Dependency "${depDef.name}" must be enabled first.`
            };
          }
        }
      }

      if (!current.includes(moduleCode)) {
        current.push(moduleCode);
      }
    } else {
      // Check if other active modules depend on this one
      const universalModule = ModuleEngine.getModule(moduleDef.id);
      if (universalModule) {
        const { allowed, reason } = ModuleEngine.canDisable(universalModule.moduleId, current, registry);
        if (!allowed) {
          return { success: false, message: reason! };
        }
      } else {
        // Legacy check
        const dependents = registry.filter(
          m => current.includes(m.code) && m.dependencies.some(d => d.moduleId === moduleDef.id)
        );
        if (dependents.length > 0) {
          return {
            success: false,
            message: `Cannot disable "${moduleDef.name}". Active modules depend on it: ${dependents.map(d => d.name).join(', ')}`
          };
        }
      }

      current = current.filter(c => c !== moduleCode);
    }

    await TenantService.updateTenant(tenantId, { enabledModules: current }, performedBy);

    await AuditService.log({
      tenantId,
      tenantName: tenant.name,
      userId: performedBy.userId,
      userEmail: performedBy.email,
      userDisplayName: performedBy.name,
      action: enable ? 'MODULE_ENABLED' : 'MODULE_DISABLED',
      resource: 'module',
      resourceId: moduleDef.id,
      resourceName: moduleDef.name,
      previousValue: { enabledModules: tenant.enabledModules },
      newValue: { enabledModules: current },
      result: 'SUCCESS',
      notes: `Module "${moduleDef.name}" (${moduleCode}) was ${enable ? 'activated' : 'deactivated'} for ${tenant.name}`
    });

    return {
      success: true,
      message: `Module "${moduleDef.name}" ${enable ? 'enabled' : 'disabled'} successfully.`,
      updatedModules: current
    };
  }
}
