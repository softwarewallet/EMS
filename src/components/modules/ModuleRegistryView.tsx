import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ModuleService } from '../../services/moduleService';
import { ModuleEngine } from '../../core/modules/ModuleEngine';
import { Badge } from '../common/Badge';
import { ModuleRegistryItem } from '../../types';
import { 
  Blocks, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Power, 
  GraduationCap, 
  BookOpen, 
  CalendarCheck, 
  CreditCard, 
  Layers, 
  Library, 
  Shield 
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Shield,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Layers,
  Library,
  Blocks
};

export const ModuleRegistryView: React.FC = () => {
  const { currentTenant, toggleTenantModule } = useTenant();
  const { currentUser, hasPermission } = useAuth();
  const { notify } = useNotification();

  const [togglingCode, setTogglingCode] = useState<string | null>(null);

  const modules = ModuleService.getRegistry();

  const handleToggle = async (mod: ModuleRegistryItem) => {
    if (!currentTenant) return;
    if (mod.isCore) {
      notify('info', 'Core System Module', 'Core platform administration cannot be deactivated.');
      return;
    }

    const isCurrentlyEnabled = currentTenant.enabledModules.includes(mod.code);
    setTogglingCode(mod.code);

    try {
      const res = await toggleTenantModule(mod.code, !isCurrentlyEnabled, currentUser);
      if (res.success) {
        notify(
          'success',
          isCurrentlyEnabled ? 'Module Deactivated' : 'Module Activated',
          res.message
        );
      } else {
        notify('warning', 'Action Restricted', res.message);
      }
    } catch (err: any) {
      notify('error', 'Module Update Failed', err.message);
    } finally {
      setTogglingCode(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Blocks className="w-5 h-5 text-indigo-600" />
            Plug-and-Play Module Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dynamically activate or deactivate functional capabilities for <span className="font-semibold text-slate-800 dark:text-slate-200">{currentTenant?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {currentTenant?.enabledModules.length || 0}
          </span>
          <span className="text-slate-500">of {modules.length} Modules Active</span>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl flex items-start gap-3 shadow-sm">
        <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200 leading-relaxed">
          <span className="font-bold text-white">Tenant-Level Extensibility:</span> Institution A may use 4 modules while Institution B uses 8 modules.
          Enabling or disabling a module immediately reconfigures sidebar routes, permission policies, and database scopes for that tenant without code changes.
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const enabledCodes = currentTenant?.enabledModules || [];
          const isEnabled = mod.isCore || ModuleEngine.isModuleActive(mod.code, enabledCodes);
          const Icon = ICON_MAP[mod.icon] || Blocks;
          const isToggling = togglingCode === mod.code;

          // Compute active dependent modules (modules enabled in this tenant that depend on this module)
          const activeDependents = modules
            .filter(m => m.code !== mod.code && m.id !== mod.id && (m.isCore || ModuleEngine.isModuleActive(m.code, enabledCodes)))
            .filter(m => m.dependencies.some(d => {
              const depCode = d.moduleId.replace('mod_', '');
              return !d.optional && (d.moduleId === mod.id || depCode === mod.code);
            }))
            .map(m => m.name);

          // Compute missing dependencies if attempting to enable this module
          const missingDeps = mod.dependencies
            .filter(d => {
              if (d.optional) return false;
              return !ModuleEngine.isModuleActive(d.moduleId, enabledCodes);
            })
            .map(d => {
              const depCode = d.moduleId.replace('mod_', '');
              const depMod = modules.find(m => m.id === d.moduleId || m.code === depCode);
              return depMod ? depMod.name : d.moduleId;
            });

          return (
            <div
              key={mod.id}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isEnabled
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-lg ${
                        isEnabled
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {mod.name}
                        </h3>
                        {mod.isCore && (
                          <Badge variant="primary" size="sm">Core</Badge>
                        )}
                        {mod.tenantAvailability.beta && (
                          <Badge variant="warning" size="sm">Phase 2 Preview</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono font-medium mt-0.5">
                        v{mod.version} • {mod.code}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  {hasPermission('module.manage') && (
                    <div>
                      {mod.isCore ? (
                        <span className="p-1.5 text-slate-500 dark:text-slate-400 inline-flex items-center" title="Core module mandatory">
                          <Lock className="w-4 h-4" />
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggle(mod)}
                          disabled={isToggling}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              : missingDeps.length > 0
                              ? 'bg-slate-400 cursor-not-allowed text-white shadow-xs'
                              : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-xs'
                          }`}
                          title={
                            isEnabled && activeDependents.length > 0
                              ? `Cannot disable: active modules (${activeDependents.join(', ')}) depend on this.`
                              : !isEnabled && missingDeps.length > 0
                              ? `Requires enabling first: ${missingDeps.join(', ')}`
                              : ''
                          }
                        >
                          <Power className="w-3.5 h-3.5" />
                          {isToggling ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-3 leading-relaxed">
                  {mod.description}
                </p>

                {/* Dependency constraint notices */}
                {isEnabled && activeDependents.length > 0 && (
                  <div className="mt-2.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Locked by active dependents: <strong>{activeDependents.join(', ')}</strong></span>
                  </div>
                )}
                {!isEnabled && missingDeps.length > 0 && (
                  <div className="mt-2.5 px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Enable dependencies first: <strong>{missingDeps.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              {/* Dependencies & Permissions footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  <span className="font-semibold text-slate-900 dark:text-white">Dependencies: </span>
                  {mod.dependencies.length > 0 ? (
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{mod.dependencies.map(d => d.moduleId?.replace('mod_', '') || 'unknown').join(', ')}</span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 italic">None (Standalone)</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="capitalize">{mod.category}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
