import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowLeft, RefreshCw, LayoutDashboard } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

interface RouteGuardProps {
  tab: string;
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ tab, children }) => {
  const { canAccessRoute, setActiveTab } = useNavigation();
  const { currentUser, effectiveRoleAssignments, userPermissions } = useAuth();
  const { currentTenant } = useTenant();

  const access = canAccessRoute(tab);

  if (access.allowed) {
    return <>{children}</>;
  }

  // Unauthorized or Inactive Module State
  const bareMod = access.requiredModule ? access.requiredModule.replace('mod_', '') : '';
  const prefixedMod = access.requiredModule ? (access.requiredModule.startsWith('mod_') ? access.requiredModule : `mod_${access.requiredModule}`) : '';
  
  const isModuleDisabled = access.requiredModule && (
    !currentTenant?.enabledModules?.includes(access.requiredModule) &&
    !currentTenant?.enabledModules?.includes(bareMod) &&
    !currentTenant?.enabledModules?.includes(prefixedMod)
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-rose-50 text-rose-500 ring-8 ring-rose-50/50">
          {isModuleDisabled ? (
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isModuleDisabled ? 'Module Inactive' : 'Access Restricted'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {access.reason || 'You do not have the required permissions to view this workspace.'}
          </p>
        </div>

        {/* Diagnostic Security Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">Target Workspace:</span>
            <span className="font-semibold text-slate-800">{tab}</span>
          </div>
          {access.requiredModule && (
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Required Module:</span>
              <span className="font-semibold text-amber-600">{access.requiredModule}</span>
            </div>
          )}
          {access.requiredPermission && (
            <div className="flex justify-between text-slate-600">
              <span className="text-slate-400">Required Permission:</span>
              <span className="font-semibold text-rose-600">{access.requiredPermission}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-400">User Roles:</span>
            <span className="font-semibold text-slate-800">
              {effectiveRoleAssignments.map(r => r.roleName).join(', ') || 'No Role Assigned'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('my_school')}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('nav_engine')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Engine Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};
