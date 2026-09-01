import { UniversalModuleContract } from '../contracts/ModuleContract';
import { ModuleRegistryItem, Tenant } from '../../types';
import { MODULE_REGISTRY as LegacyRegistry } from '../../config/modules';

/**
 * ModuleEngine provides a hardened API for module lifecycle management.
 */
export class ModuleEngine {
  private static registeredModules: Map<string, UniversalModuleContract> = new Map();

  static register(module: UniversalModuleContract) {
    if (this.registeredModules.has(module.moduleId)) {
      throw new Error(`Module ${module.moduleId} is already registered.`);
    }
    this.registeredModules.set(module.moduleId, module);
  }

  static getModule(moduleId: string): UniversalModuleContract | undefined {
    return this.registeredModules.get(moduleId);
  }

  static getAllModules(): UniversalModuleContract[] {
    return Array.from(this.registeredModules.values());
  }

  static isModuleActive(modIdOrCode: string, enabledModuleCodes: string[]): boolean {
    const code = modIdOrCode.replace('mod_', '');
    if (modIdOrCode === 'mod_core' || code === 'core') return true;
    return enabledModuleCodes.includes(code) || enabledModuleCodes.includes(modIdOrCode) || enabledModuleCodes.includes(`mod_${code}`);
  }

  static validateDependencies(
    module: UniversalModuleContract,
    enabledModuleCodes: string[],
    registryItems?: ModuleRegistryItem[]
  ): { valid: boolean; missing: string[]; missingNames: string[] } {
    const missing: string[] = [];
    const missingNames: string[] = [];

    for (const dep of module.dependencies) {
      if (dep.optional) continue;

      const isActive = this.isModuleActive(dep.moduleId, enabledModuleCodes);
      if (!isActive) {
        missing.push(dep.moduleId);

        const depCode = dep.moduleId.replace('mod_', '');
        const regMatch = registryItems?.find(r => r.id === dep.moduleId || r.code === depCode)
          || LegacyRegistry.find(r => r.id === dep.moduleId || r.code === depCode);
        const name = regMatch ? regMatch.name : dep.moduleId;
        missingNames.push(name);
      }
    }

    return { valid: missing.length === 0, missing, missingNames };
  }

  static canEnable(moduleId: string, enabledModuleCodes: string[], registryItems?: ModuleRegistryItem[]): { allowed: boolean; reason?: string } {
    const module = this.getModule(moduleId);
    if (!module) return { allowed: false, reason: 'Module not found in registry.' };

    const { valid, missingNames } = this.validateDependencies(module, enabledModuleCodes, registryItems);
    if (!valid) {
      return { allowed: false, reason: `Missing required dependencies: ${missingNames.join(', ')}` };
    }

    return { allowed: true };
  }

  static canDisable(moduleId: string, enabledModuleCodes: string[], registryItems?: ModuleRegistryItem[]): { allowed: boolean; reason?: string } {
    const module = this.getModule(moduleId);
    const targetId = module ? module.moduleId : moduleId;
    const targetCode = targetId.replace('mod_', '');

    const dependents: string[] = [];
    const allItems = registryItems || LegacyRegistry;

    for (const item of allItems) {
      if (item.id === targetId || item.code === targetCode) continue;

      const isItemActive = item.isCore || this.isModuleActive(item.code, enabledModuleCodes);
      if (!isItemActive) continue;

      const universalMod = this.getModule(item.id);
      const deps = universalMod ? universalMod.dependencies : item.dependencies;

      const dependsOnThis = deps.some(d => !d.optional && (d.moduleId === targetId || d.moduleId.replace('mod_', '') === targetCode));
      if (dependsOnThis) {
        dependents.push(item.name);
      }
    }

    if (dependents.length > 0) {
      const targetName = module ? module.displayName : targetId;
      return { allowed: false, reason: `Cannot disable "${targetName}". Active modules depend on it: ${dependents.join(', ')}` };
    }

    return { allowed: true };
  }
}
