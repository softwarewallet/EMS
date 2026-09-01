import React, { useState } from 'react';
import { ALL_PERMISSIONS, SYSTEM_ROLES } from '../../config/permissions';
import { Badge } from '../common/Badge';
import { Shield, CheckCircle2, XCircle, Search, Layers, Lock, Filter, Building2, User, Globe, Wrench } from 'lucide-react';

export const RolePermissionView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0]);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [roleCategoryTab, setRoleCategoryTab] = useState<string>('ALL');
  const [permissionCategoryFilter, setPermissionCategoryFilter] = useState('ALL');
  const [permissionSearchQuery, setPermissionSearchQuery] = useState('');

  // Categories for Role Filter
  const roleCategories = [
    'ALL',
    'PLATFORM',
    'INSTITUTION',
    'ACADEMIC',
    'STUDENT',
    'PARENT',
    'FINANCE',
    'HR',
    'LIBRARY',
    'TRANSPORT',
    'HOSTEL',
    'IT',
    'DIGITAL_EDUCATION',
    'GOVERNMENT'
  ];

  // Filter Roles
  const filteredRoles = SYSTEM_ROLES.filter(r => {
    if (roleCategoryTab !== 'ALL' && r.category !== roleCategoryTab) return false;
    if (roleSearchQuery.trim()) {
      const q = roleSearchQuery.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter Permissions
  const filteredPermissions = ALL_PERMISSIONS.filter(p => {
    if (permissionCategoryFilter !== 'ALL' && p.category !== permissionCategoryFilter) return false;
    if (permissionSearchQuery.trim()) {
      const q = permissionSearchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Master Role Catalogue & Granular Permission Matrix (72 System Roles)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Role-Based Access Control (RBAC) enforced independently on both backend services, tenant scopes, and module policy engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col h-[700px]">
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                System Role Templates ({filteredRoles.length})
              </h2>
              <span className="text-3xs px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-full">
                72 Total
              </span>
            </div>

            {/* Role Search & Category Filter */}
            <div className="space-y-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  placeholder="Filter 72 roles..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <select
                value={roleCategoryTab}
                onChange={(e) => setRoleCategoryTab(e.target.value)}
                className="w-full text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                {roleCategories.map(cat => (
                  <option key={cat} value={cat}>
                    Category: {cat?.replace(/_/g, ' ') || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 overflow-y-auto pr-1 flex-1">
            {filteredRoles.map((role) => {
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-xs truncate">{role.name}</p>
                    <p className={`text-2xs truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {role.code} • {role.permissions.length} Perms
                    </p>
                  </div>
                  <Lock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`} />
                </button>
              );
            })}
            {filteredRoles.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No matching roles found.</p>
            )}
          </div>
        </div>

        {/* Permission Grid & Detail view for Selected Role */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-[700px]">
          <div>
            {/* Selected Role Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedRole.name}</h2>
                  <Badge variant="primary">{selectedRole.category}</Badge>
                  <span className="text-2xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-semibold">
                    ID: {selectedRole.code}
                  </span>
                  <span className="text-2xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {selectedRole.status || 'SYSTEM'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
                
                {/* Applicable Scopes display */}
                {selectedRole.applicableScopes && selectedRole.applicableScopes.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 text-2xs text-slate-500">
                    <span className="font-semibold">Supported Scope Constraints:</span>
                    {selectedRole.applicableScopes.map(sc => (
                      <span key={sc} className="bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded text-2xs font-mono">
                        {sc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Permission Filters */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={permissionSearchQuery}
                  onChange={(e) => setPermissionSearchQuery(e.target.value)}
                  placeholder="Filter permissions..."
                  className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                  value={permissionCategoryFilter}
                  onChange={(e) => setPermissionCategoryFilter(e.target.value)}
                  className="text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="core">Core & Admin</option>
                  <option value="student">Student</option>
                  <option value="admissions">Admissions</option>
                  <option value="academic">Academic</option>
                  <option value="attendance">Attendance</option>
                  <option value="finance">Finance</option>
                  <option value="hr">HR</option>
                  <option value="library">Library</option>
                  <option value="transport">Transport</option>
                  <option value="hostel">Hostel</option>
                  <option value="it">IT & CCTV</option>
                  <option value="digital_education">Digital Education</option>
                  <option value="government">Government</option>
                  <option value="security">Security</option>
                </select>
              </div>
            </div>

            {/* Matrix Permission Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2 max-h-[500px] overflow-y-auto pr-2">
              {filteredPermissions.map((perm) => {
                const isGranted = selectedRole.permissions.includes(perm.code) || selectedRole.permissions.includes('platform.admin');
                return (
                  <div key={perm.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{perm.name}</span>
                        <code className="text-2xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                          {perm.code}
                        </code>
                        <span className="text-2xs text-slate-400 uppercase font-medium">({perm.category})</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">{perm.description}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-2xs text-slate-400">
                        <span>Scope constraint:</span>
                        {perm.applicableScopes.map(sc => (
                          <span key={sc} className="border border-slate-200 dark:border-slate-700 px-1 rounded text-[10px]">
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 pt-1">
                      {isGranted ? (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Granted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <XCircle className="w-4 h-4" />
                          <span>Denied</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-2xs text-slate-500 flex items-center justify-between">
            <span>Role-Based Policy Engine (RBAC) enforced across platform and tenant boundary.</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedRole.permissions.length} total granted permissions</span>
          </div>
        </div>
      </div>
    </div>
  );
};
